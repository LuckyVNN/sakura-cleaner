import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from '../server/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure single instance lock so two copies don't clash
const gotTheLock = app.requestSingleInstanceLock();

let mainWindow = null;
let serverPort = 3001;
let serverInstance = null;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  async function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 860,
      minWidth: 960,
      minHeight: 640,
      title: '🌸 Sakura Cleaner',
      backgroundColor: '#fff0f3',
      icon: path.join(__dirname, '../public/logo.png'),
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.cjs')
      }
    });

    const isDev = process.env.NODE_ENV === 'development' && !app.isPackaged;

    if (isDev) {
      mainWindow.loadURL('http://localhost:5173');
    } else {
      mainWindow.loadURL(`http://localhost:${serverPort}`);
    }

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  app.whenReady().then(async () => {
    const isDev = process.env.NODE_ENV === 'development' && !app.isPackaged;
    if (!isDev) {
      try {
        const info = await startServer(3001);
        serverPort = info.port;
        serverInstance = info.server;
      } catch (err) {
        console.error('Failed to start internal server:', err);
      }
    }
    await createWindow();
  });

  app.on('window-all-closed', () => {
    if (serverInstance) {
      serverInstance.close();
    }
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}
