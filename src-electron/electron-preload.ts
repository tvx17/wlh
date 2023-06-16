/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 */
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('db', {
  setupCheck: async () => ipcRenderer.invoke('setupCheck'),
  create: async (table: string, params: object) => ipcRenderer.invoke('create', table, params),
  read: async (table: string, params: object) => ipcRenderer.invoke('read', table, params),
  update: async (table:string, params: object) => ipcRenderer.invoke('update', table, params),
  delete: async (table:string, params: object) => ipcRenderer.invoke('delete', table, params)});

/**
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
