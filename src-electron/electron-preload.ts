/**
 * This file is used specifically for security reasons.
 * Here you can securely expose privileged APIs into the renderer process
 * by leveraging Electron's contextBridge functionality and communicating
 * with the main process through Electron's inter-process communication (IPC).
 *
 * WARNING!
 * The preload script sandboxing offers limited access to a full Node.js environment.
 * Do NOT attempt to import packages from node_modules or use Node.js APIs directly in this file.
 * Instead, use IPC to communicate with the main process and access packages and Node.js
 * functionality there.
 *
 * Example on injecting window.myAPI.doAThing() into renderer thread:
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * Preload script documentation:
 * https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */

import { contextBridge, ipcRenderer } from "electron";
import {
  ECHO_CHANNEL,
  TRANSLATION_CHANNEL,
  type DesktopApi
} from "../src/shared/desktop";
import { quasarRuntime } from "#q-app/electron/preload";

/**
 * Can be used in the renderer process through `window.quasarRuntime`
 */
contextBridge.exposeInMainWorld("quasarRuntime", quasarRuntime);
contextBridge.exposeInMainWorld("desktop", {
  loadTranslation: (url: string) =>
    ipcRenderer.invoke(TRANSLATION_CHANNEL, url),
  echo: (text: string) => ipcRenderer.invoke(ECHO_CHANNEL, text)
} satisfies DesktopApi);
