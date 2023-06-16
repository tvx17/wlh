import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import requests from './requests';

const {ipcMain} = require('electron');

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      sandbox         : true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

ipcMain.handle('create', async (ipcMainInvokeEvent:Electron.IpcMainInvokeEvent, table: string, params: object) => {
  return await requests.create(table, params);
});
ipcMain.handle('read', async (ipcMainInvokeEvent:Electron.IpcMainInvokeEvent, table: string, params: object) => {
  return await requests.read(table, params);
});

ipcMain.handle('update', async (ipcMainInvokeEvent:Electron.IpcMainInvokeEvent, table:string, params:object) => {
  return await requests.update(table, params);
});
ipcMain.handle('delete', async (ipcMainInvokeEvent:Electron.IpcMainInvokeEvent, table: string, id: number) => {
  return await requests.deleteDataset(table, id);
});
ipcMain.handle('setupCheck', async (ipcMainInvokeEvent:Electron.IpcMainInvokeEvent, params:object) => {
  return await requests.setupCheck();
});



