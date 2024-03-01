import {app, BrowserWindow, ipcMain} from 'electron';
import os from 'os';
import path from 'path';
import dbIndex from './database';

// needed if process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow(
    {
      icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
      width: 1000,
      height: 600,
      useContentSize: true,
      webPreferences: {
        contextIsolation: true,
        sandbox: true,
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

// *************************************************************************************
// *************************************************************************************
// *************************************************************************************

ipcMain.handle('query', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent, query: string) => {
  return await dbIndex.query(query);
});
ipcMain.handle('init', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent) => {
  return await dbIndex.init();
});
ipcMain.handle('create', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent, table: string, data: object) => {
  return await dbIndex.create(table, data);
});
ipcMain.handle('read', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent, table: string, data: object) => {
  return await dbIndex.read(table, data);
});
ipcMain.handle('update', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent, table: string, data: object, where: object) => {
  return await dbIndex.update(table, data, where);
});
ipcMain.handle('delete', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent, table: string, where: object, softDelete = true) => {
  return await dbIndex.delete(table, where, softDelete);
});
ipcMain.handle('structure', async (_ipcMainInvokeEvent: Electron.IpcMainInvokeEvent, parentId: number) => {
  return await dbIndex.structure(parentId);
});
