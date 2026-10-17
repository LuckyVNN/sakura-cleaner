const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  setScanningStatus: (isScanning, lang) => {
    ipcRenderer.send('set-scanning-status', { isScanning, lang });
  }
});
