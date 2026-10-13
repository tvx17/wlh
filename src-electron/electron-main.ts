import { BrowserWindow, app, ipcMain, type WebContents } from "electron";
import path from "node:path";
import { readTranslationFile, echoText } from "@electron/translations";
import { pathToFileURL } from "node:url";
import os from "node:os";
import {
  createExecutor,
  isTrustedDocument,
  type CommandHandler
} from "@electron/execute";
import {
  registerQuasarRuntime,
  resolvePublicPath,
  resolveElectronAssetsPath
} from "#q-app/electron/main";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
const trustedWindows = new WeakMap<WebContents, string>();

const execute = createExecutor(
  new Map<string, CommandHandler>([
    ["echo", echoText],
    [
      "translations.read",
      resource => readTranslationFile(resource, resolvePublicPath)
    ],
    [
      "app.info",
      () => ({ name: app.getName(), version: app.getVersion(), platform })
    ]
  ])
);

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

  const trustedUrl = import.meta.env.QUASAR_DEV
    ? import.meta.env.QUASAR_APP_URL
    : pathToFileURL(path.join(app.getAppPath(), "index.html")).href;
  trustedWindows.set(mainWindow.webContents, trustedUrl);

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
  ipcMain.handle("execute", (event, command: unknown, payload: unknown) => {
    const expectedUrl = trustedWindows.get(event.sender);
    if (
      !expectedUrl ||
      event.senderFrame !== event.sender.mainFrame ||
      !isTrustedDocument(event.senderFrame.url, expectedUrl)
    ) {
      throw new Error("Unauthorized execute request");
    }
    return execute(command, payload);
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
