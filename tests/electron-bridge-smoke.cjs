// Run with Electron after `quasar build -m electron --skip-pkg`.
const { app, BrowserWindow, ipcMain } = require("electron");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");
const { pathToFileURL } = require("node:url");
const { transpileModule, ModuleKind } = require("typescript");

const pageUrl = "data:text/html,<html><body>Bridge smoke test</body></html>";
const timeout = setTimeout(() => {
  console.error("Electron bridge smoke test timed out");
  app.exit(1);
}, 20000);

void app
  .whenReady()
  .then(async () => {
    // Bootstrap alias resolution once, before resolving project files.
    const { resolveProjectPath } = await import(
      pathToFileURL(
        path.join(path.dirname(__dirname), "scripts/register-aliases.mjs")
      ).href
    );
    const compiled = transpileModule(
      fs.readFileSync(resolveProjectPath("@electron/execute.ts"), "utf8"),
      { compilerOptions: { module: ModuleKind.CommonJS } }
    ).outputText;
    const backend = { exports: {}, URL };
    vm.runInNewContext(compiled, backend);
    const execute = backend.exports.createExecutor(
      new Map([
        ["echo", payload => payload],
        [
          "fail",
          () => {
            throw new Error("Expected backend failure");
          }
        ]
      ])
    );
    // The built Quasar preload resolves its runtime paths synchronously.
    ipcMain.on("quasar-electron:resolve-electron-assets", (event, ...parts) => {
      event.returnValue = path.join(
        resolveProjectPath("@electron/electron-assets"),
        ...parts
      );
    });
    ipcMain.on("quasar-electron:resolve-public", (event, ...parts) => {
      event.returnValue = path.join(
        resolveProjectPath("@root/dist/electron/UnPackaged"),
        ...parts
      );
    });
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        preload: resolveProjectPath(
          "@root/dist/electron/UnPackaged/electron-preload.cjs"
        )
      }
    });
    ipcMain.handle("execute", (event, command, payload) => {
      if (
        event.sender !== win.webContents ||
        event.senderFrame !== event.sender.mainFrame ||
        !backend.exports.isTrustedDocument(event.senderFrame.url, pageUrl)
      ) {
        throw new Error("Unauthorized execute request");
      }
      return execute(command, payload);
    });
    await win.loadURL(pageUrl);
    const result = await win.webContents.executeJavaScript(`(async () => {
    const value = await window.appBridge.execute("echo", { value: 42 });
    let rejected = false;
    try { await window.appBridge.execute("fail"); } catch { rejected = true; }
    return { value, rejected, nodeExposed: typeof window.require !== "undefined" };
  })()`);
    assert.deepEqual(result, {
      value: { value: 42 },
      rejected: true,
      nodeExposed: false
    });
    console.log("Electron preload IPC smoke test passed");
    clearTimeout(timeout);
    app.exit(0);
  })
  .catch(error => {
    console.error(error);
    clearTimeout(timeout);
    app.exit(1);
  });
