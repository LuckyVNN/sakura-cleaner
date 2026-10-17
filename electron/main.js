import { app, BrowserWindow, shell, nativeImage, dialog, ipcMain } from 'electron';
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
let isScanningActive = false;
let currentLanguage = 'en';

ipcMain.on('set-scanning-status', (event, { isScanning, lang }) => {
  isScanningActive = !!isScanning;
  if (lang) currentLanguage = lang;
});

const closeConfirmDialogs = {
  en: {
    title: '🌸 Sakura Cleaner - Scan in Progress',
    message: 'A disk scan is currently running!',
    detail: 'Are you sure you want to close Sakura Cleaner? Closing now will cancel the active scan.',
    stayBtn: '🌸 Keep Scanning',
    exitBtn: '🛑 Exit App & Abort'
  },
  vi: {
    title: '🌸 Sakura Cleaner - Đang quét ổ đĩa',
    message: 'Tiến trình quét ổ đĩa đang được thực hiện!',
    detail: 'Bạn có chắc chắn muốn đóng Sakura Cleaner không? Việc đóng ứng dụng sẽ dừng tiến trình quét này.',
    stayBtn: '🌸 Tiếp tục quét',
    exitBtn: '🛑 Thoát ứng dụng'
  },
  ja: {
    title: '🌸 Sakura Cleaner - スキャン実行中',
    message: 'ディスクスキャンが現在実行中です！',
    detail: 'Sakura Cleaner を終了してもよろしいですか？終了すると現在のスキャンは中止されます。',
    stayBtn: '🌸 スキャンを続ける',
    exitBtn: '🛑 終了して中止する'
  }
};

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

    let isForceClosing = false;

    mainWindow.on('close', (e) => {
      if (isForceClosing) return;

      if (isScanningActive) {
        e.preventDefault();
        const texts = closeConfirmDialogs[currentLanguage] || closeConfirmDialogs.en;
        const choice = dialog.showMessageBoxSync(mainWindow, {
          type: 'warning',
          buttons: [texts.stayBtn, texts.exitBtn],
          defaultId: 0,
          cancelId: 0,
          title: texts.title,
          message: texts.message,
          detail: texts.detail,
          icon: windowIcon.isEmpty() ? undefined : windowIcon,
          noLink: true
        });

        if (choice === 1) {
          isScanningActive = false;
          isForceClosing = true;
          mainWindow.destroy();
        }
      }
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
