/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
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
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('db', {
  query: async (type: string, query: object) => ipcRenderer.invoke('query', type, query),
  init: async () => ipcRenderer.invoke('init'),
  create: async (table: string, data: object) => ipcRenderer.invoke('create', table, data),
  read: async (table: string, params: object, includeDeleted = false) => ipcRenderer.invoke('read', table, params, includeDeleted),
  update: async (table: string, data: object, where: object) => ipcRenderer.invoke('update', table, data, where),
  delete: async (table: string, where: object, softDelete = true) => ipcRenderer.invoke('delete', table, where, softDelete),
  structure: async (parentId: number) => ipcRenderer.invoke('structure', parentId),
});
