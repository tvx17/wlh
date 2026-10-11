import { BrowserWindow, app, ipcMain } from "electron";
import {
  ECHO_CHANNEL,
  TRANSLATION_CHANNEL,
  type EchoResponse
} from "../src/shared/desktop";
import { readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  registerQuasarRuntime,
  resolvePublicPath,
  resolveElectronAssetsPath
} from "#q-app/electron/main";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

async function createWindow() {
  /**
   * Initial window options
   */
  const mainWindow = new BrowserWindow({
    icon: resolveElectronAssetsPath("icons/icon.png"), // Windows and Linux
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.join(import.meta.dirname, "electron-preload.cjs")
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.split("#")[0] !== mainWindow.webContents.getURL().split("#")[0])
      event.preventDefault();
  });

  if (import.meta.env.QUASAR_DEV) {
    await mainWindow.loadURL(import.meta.env.QUASAR_APP_URL);
  } else {
    await mainWindow.loadFile("index.html");
  }

  if (import.meta.env.QUASAR_DEBUG) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow?.webContents.closeDevTools();
    });
  }
}

void app.whenReady().then(() => {
  registerQuasarRuntime();
  ipcMain.handle(TRANSLATION_CHANNEL, async (event, url: unknown) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window || event.senderFrame !== window.webContents.mainFrame)
      throw new Error("Invalid IPC sender");
    if (
      typeof url !== "string" ||
      !/^i18n\/[a-z]{2,3}-[a-z0-9]{2,8}\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.json$/.test(
        url
      )
    )
      throw new Error("Invalid translation path");
    return JSON.parse(
      await readFile(resolvePublicPath(...url.split("/")), "utf8")
    );
  });
  ipcMain.handle(ECHO_CHANNEL, (event, text: unknown): EchoResponse => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window || event.senderFrame !== window.webContents.mainFrame)
      throw new Error("Invalid IPC sender");
    if (typeof text !== "string" || text.length > 2000)
      throw new Error("Expected text with at most 2000 characters");
    return { text, receivedAt: new Date().toISOString() };
  });
  void createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});
