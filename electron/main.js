import { app, BrowserWindow, shell, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { startServer } from '../server/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly set AppUserModelID for Windows Taskbar grouping & icon
if (process.platform === 'win32') {
  app.setAppUserModelId('com.sakura.cleaner');
}

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
    const icoPath = path.join(__dirname, 'icon.ico');
    const pngPath = path.join(__dirname, 'icon.png');
    const windowIcon = nativeImage.createFromPath(icoPath);

    mainWindow = new BrowserWindow({
      width: 1280,
      height: 860,
      minWidth: 960,
      minHeight: 640,
      title: '🌸 Sakura Cleaner',
      backgroundColor: '#fff0f3',
      icon: windowIcon.isEmpty() ? pngPath : icoPath,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.cjs')
      }
    });

    if (process.platform === 'win32') {
      mainWindow.setIcon(icoPath);
    }

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
