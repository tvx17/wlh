// Tests the packaged renderer/preload and production translation/echo handlers.
const { app, BrowserWindow, ipcMain } = require("electron");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { pathToFileURL } = require("node:url");
const { transpileModule, ModuleKind } = require("typescript");

const root = path.dirname(__dirname);
const smokeProfile = path.join(
  root,
  ".quasar",
  "application-smoke-data",
  String(Date.now())
);
fs.mkdirSync(smokeProfile, { recursive: true });
app.setPath("userData", smokeProfile);
const folio = require(path.join(root, "package.json")).name === "wlh";
const timeout = setTimeout(() => app.exit(1), 30000);
void app
  .whenReady()
  .then(async () => {
    const built = path.join(root, "dist/electron/UnPackaged");
    function loadBackend(file) {
      const compiled = transpileModule(
        fs.readFileSync(path.join(root, "src-electron", file), "utf8"),
        {
          compilerOptions: { module: ModuleKind.CommonJS }
        }
      ).outputText;
      const context = { exports: {}, require, URL, Date };
      vm.runInNewContext(compiled, context);
      return context.exports;
    }
    const { createExecutor, isTrustedDocument } = loadBackend("execute.ts");
    const { readTranslationFile, echoText } = loadBackend("translations.ts");
    const resources = [];
    const execute = createExecutor(
      new Map([
        ["echo", echoText],
        [
          "translations.read",
          resource => {
            resources.push(resource);
            return readTranslationFile(resource, (...parts) =>
              path.join(built, ...parts)
            );
          }
        ]
      ])
    );
    ipcMain.on("quasar-electron:resolve-electron-assets", (event, ...parts) => {
      event.returnValue = path.join(
        root,
        "src-electron/electron-assets",
        ...parts
      );
    });
    ipcMain.on("quasar-electron:resolve-public", (event, ...parts) => {
      event.returnValue = path.join(built, ...parts);
    });
    const win = new BrowserWindow({
      show: false,
      width: 1440,
      height: 1080,
      webPreferences: {
        partition: `application-smoke-${Date.now()}`,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        backgroundThrottling: false,
        preload: path.join(built, "electron-preload.cjs")
      }
    });
    const pageUrl = pathToFileURL(path.join(built, "index.html")).href;
    ipcMain.handle("execute", (event, command, payload) => {
      assert.equal(event.sender, win.webContents);
      assert.equal(event.senderFrame, event.sender.mainFrame);
      assert.ok(isTrustedDocument(event.senderFrame.url, pageUrl));
      return execute(command, payload);
    });
    const evaluate = source => win.webContents.executeJavaScript(source, true);
    async function waitFor(source) {
      for (let attempt = 0; attempt < 120; attempt++) {
        if (await evaluate(source)) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error(
        `Condition failed: ${source}\n${await evaluate("document.body.innerText")}`
      );
    }
    async function clickText(text, selector = ".q-btn") {
      assert.ok(
        await evaluate(`(() => {
      const item = Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(element => {
        const copy = element.cloneNode(true);
        copy.querySelectorAll('.q-icon').forEach(icon => icon.remove());
        return copy.textContent.trim() === ${JSON.stringify(text)};
      });
      if (!item) return false;
      item.click(); return true;
    })()`),
        `Missing button: ${text}`
      );
    }
    await win.loadFile(path.join(built, "index.html"));
    if (folio) {
      await waitFor("Boolean(document.querySelector('.login-form'))");
      await clickText("Mit Beispielroman starten");
      await waitFor("Boolean(document.querySelector('.dashboard'))");
      await evaluate("document.querySelector('.language-button').click()");
      await waitFor("Boolean(document.querySelector('.folio-menu'))");
      await clickText("English", ".q-item");
      await waitFor("document.documentElement.lang === 'en'");
      await evaluate("location.hash = '#/editor'");
      await waitFor("Boolean(document.querySelector('.manuscript-input'))");
      assert.ok(resources.includes("locales/de/gui/studio.json"));
      assert.ok(resources.includes("locales/en/gui/studio.json"));
    } else {
      await waitFor(
        "document.body.innerText.includes('Quasar – Projektvorlage')"
      );
      await waitFor("document.body.innerText.includes('Hallo!')");
      await clickText("Komponente laden / entladen");
      await waitFor("!document.body.innerText.includes('Hallo!')");
      await clickText("Komponente laden / entladen");
      await waitFor("document.body.innerText.includes('Hallo!')");
      await evaluate("document.querySelector('.q-select').click()");
      await waitFor("Boolean(document.querySelector('.q-menu'))");
      await clickText("en", ".q-menu .q-item");
      await waitFor(
        "document.body.innerText.includes('Quasar – Project template')"
      );
      await clickText("Send");
      await waitFor("Boolean(document.querySelector('pre'))");
      const response = JSON.parse(
        await evaluate("document.querySelector('pre').textContent")
      );
      assert.equal(response.text, "Hallo Electron!");
      assert.ok(Number.isFinite(Date.parse(response.receivedAt)));
      assert.equal(
        resources.filter(
          resource => resource === "locales/de/components/hallo.json"
        ).length,
        2
      );
      assert.ok(resources.includes("locales/en/app.json"));
      assert.ok(resources.includes("locales/en/components/hallo.json"));
      const layout = await evaluate(
        "getComputedStyle(document.querySelector('.tw\\\\:max-w-2xl')).maxWidth"
      );
      assert.equal(layout, "672px");
      await evaluate("location.hash = '#/second'");
      await waitFor("document.body.innerText.includes('Go to Index Page')");
      await clickText("Go to Index Page");
      await waitFor(
        "document.body.innerText.includes('Quasar – Project template')"
      );
    }
    assert.equal(await evaluate("typeof window.require"), "undefined");
    console.log(
      `${folio ? "Folio" : "Template"} packaged Electron UI, translations and preload passed`
    );
    clearTimeout(timeout);
    app.exit(0);
  })
  .catch(error => {
    console.error(error);
    clearTimeout(timeout);
    app.exit(1);
  });
