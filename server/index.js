import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import {
  getWindowsDrives,
  scanDirectoryTree,
  scanAllDrives,
  cancelActiveScan,
  resetScanCancellation,
  moveToRecycleBin,
  revealInExplorer,
  scanSmartJunk,
  cleanSmartJunkItems
} from './scanner.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

let activeClients = new Set();

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const client of activeClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

// 1. Get all PC drives
app.get('/api/drives', async (req, res) => {
  try {
    const drives = await getWindowsDrives();
    res.json({ success: true, drives });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Scan a drive or directory
let currentScanActive = false;

app.post('/api/scan', async (req, res) => {
  const { path: targetPath, maxDepth = 7 } = req.body;
  if (!targetPath) {
    return res.status(400).json({ success: false, error: 'Path is required' });
  }

  resetScanCancellation();
  currentScanActive = true;
  broadcast({ type: 'scan_started', targetPath });

  try {
    const scanResult = await scanDirectoryTree(
      targetPath,
      { maxDepth },
      (progress) => {
        broadcast({
          type: 'scan_progress',
          ...progress
        });
      }
    );

    currentScanActive = false;

    if (scanResult.cancelled) {
      broadcast({ type: 'scan_cancelled' });
      return res.json({
        success: false,
        cancelled: true,
        message: 'Scan was cancelled'
      });
    }

    broadcast({ type: 'scan_completed', summary: scanResult.summary });

    res.json({
      success: true,
      data: scanResult.root,
      summary: scanResult.summary
    });
  } catch (err) {
    currentScanActive = false;
    broadcast({ type: 'scan_error', error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2b. Scan ALL PC drives
app.post('/api/scan-all', async (req, res) => {
  const { maxDepth = 7 } = req.body;
  resetScanCancellation();
  currentScanActive = true;
  broadcast({ type: 'scan_started', targetPath: 'This PC (All Drives)' });

  try {
    const scanResult = await scanAllDrives({ maxDepth }, (progress) => {
      broadcast({
        type: 'scan_progress',
        ...progress
      });
    });

    currentScanActive = false;

    if (scanResult.cancelled) {
      broadcast({ type: 'scan_cancelled' });
      return res.json({
        success: false,
        cancelled: true,
        message: 'Scan was cancelled'
      });
    }

    broadcast({ type: 'scan_completed', summary: scanResult.summary });

    res.json({
      success: true,
      data: scanResult.root,
      summary: scanResult.summary
    });
  } catch (err) {
    currentScanActive = false;
    broadcast({ type: 'scan_error', error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2c. Cancel active scan
app.post('/api/scan-cancel', (req, res) => {
  cancelActiveScan();
  currentScanActive = false;
  broadcast({ type: 'scan_cancelled' });
  res.json({ success: true, message: 'Scan cancelled successfully' });
});

// 2d. Fast targeted scan of a single folder for deep drill-down exploration
app.post('/api/scan-folder', async (req, res) => {
  const { path: targetPath, maxDepth = 6 } = req.body;
  if (!targetPath) {
    return res.status(400).json({ success: false, error: 'Path is required' });
  }

  try {
    const scanResult = await scanDirectoryTree(targetPath, {
      maxDepth,
      minSize: 0 // include all files no matter how small for targeted inspection
    });

    res.json({
      success: true,
      data: scanResult.root,
      summary: scanResult.summary
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Reveal in Windows File Explorer
app.post('/api/open-folder', async (req, res) => {
  const { path: targetPath } = req.body;
  try {
    await revealInExplorer(targetPath);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Move to Windows Recycle Bin
app.post('/api/trash', async (req, res) => {
  const { path: targetPath } = req.body;
  try {
    await moveToRecycleBin(targetPath);
    res.json({ success: true, message: 'Item safely sent to Recycle Bin' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Smart clean junk scan
app.get('/api/smart-junk', async (req, res) => {
  try {
    const junk = await scanSmartJunk();
    res.json({ success: true, junk });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Clean selected junk
app.post('/api/clean-junk', async (req, res) => {
  const { itemIds } = req.body;
  try {
    const result = await cleanSmartJunkItems(itemIds || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SPA catch-all fallback for production
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

export function startServer(startPort = 3001) {
  return new Promise((resolve, reject) => {
    let port = startPort;

    function tryBind() {
      const server = http.createServer(app);
      const wss = new WebSocketServer({ server });

      wss.on('error', () => {
        // Handled via server error listener
      });

      wss.on('connection', (ws) => {
        activeClients.add(ws);
        ws.send(JSON.stringify({ type: 'connected', message: '🌸 Sakura Cleaner Scanner connected!' }));
        ws.on('close', () => {
          activeClients.delete(ws);
        });
      });

      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`🌸 Port ${port} is in use, retrying on port ${port + 1}...`);
          try {
            wss.close();
            server.close();
          } catch (_) {}
          port++;
          setTimeout(tryBind, 50);
        } else {
          reject(err);
        }
      });

      server.once('listening', () => {
        console.log(`🌸 Sakura Cleaner Backend API running at http://localhost:${port}`);
        resolve({ port, server, wss });
      });

      server.listen(port);
    }

    tryBind();
  });
}

// Automatically start if executed directly via Node.js
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server\\index.js') ||
  process.argv[1].endsWith('server/index.js')
);

if (isDirectRun) {
  const preferredPort = Number(process.env.PORT) || 3001;
  startServer(preferredPort).catch(err => {
    console.error('Failed to start Sakura Cleaner server:', err);
  });
}
