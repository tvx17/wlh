// Run with Electron after `npm run build`. Uses an isolated browser session.
const { app, BrowserWindow } = require("electron");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { pathToFileURL } = require("node:url");

let server;
const timeout = setTimeout(() => {
  console.error("Studio smoke test timed out");
  app.exit(1);
}, 90000);

void app
  .whenReady()
  .then(async () => {
    const { resolveProjectPath } = await import(
      pathToFileURL(
        path.join(path.dirname(__dirname), "scripts/register-aliases.mjs")
      ).href
    );
    const root = resolveProjectPath("@root/dist/spa");
    const previews = resolveProjectPath("@root/.quasar/studio-preview");
    fs.mkdirSync(previews, { recursive: true });
    const types = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".woff2": "font/woff2",
      ".woff": "font/woff",
      ".png": "image/png"
    };
    const requested = new Set();
    server = http.createServer((request, response) => {
      try {
        const pathname = decodeURIComponent(
          new URL(request.url, "http://127.0.0.1").pathname
        );
        const file = path.resolve(
          root,
          `.${pathname === "/" ? "/index.html" : pathname}`
        );
        if (!file.startsWith(`${root}${path.sep}`)) {
          response.writeHead(403).end();
          return;
        }
        requested.add(pathname);
        response.setHeader(
          "Content-Type",
          types[path.extname(file)] ?? "application/octet-stream"
        );
        response.end(fs.readFileSync(file));
      } catch {
        response.writeHead(404).end();
      }
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    console.log(`Preview URL: ${origin}/`);
    const win = new BrowserWindow({
      width: 1440,
      height: 1080,
      show: false,
      webPreferences: {
        partition: "folio-studio-smoke",
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        backgroundThrottling: false,
        offscreen: true
      }
    });
    const errors = [];
    win.webContents.on("console-message", (_event, level, message) => {
      if (level >= 3 && !message.includes("favicon")) errors.push(message);
    });
    const evaluate = source => win.webContents.executeJavaScript(source, true);
    async function waitFor(source) {
      for (let attempt = 0; attempt < 120; attempt++) {
        if (await evaluate(source)) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error(
        `Condition not met: ${source}\n${await evaluate("document.body.innerText")}`
      );
    }
    async function clickText(text, selector = ".q-btn") {
      const found = await evaluate(
        `(() => { const element = Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(item => { const copy = item.cloneNode(true); copy.querySelectorAll('.q-icon').forEach(icon => icon.remove()); return copy.textContent.trim() === ${JSON.stringify(text)}; }); if (!element) return false; element.click(); return true; })()`
      );
      assert.ok(found, `Missing clickable text: ${text}`);
    }
    async function click(selector) {
      assert.ok(
        await evaluate(
          `(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) return false; element.click(); return true; })()`
        ),
        `Missing element: ${selector}`
      );
    }
    async function input(selector, value) {
      assert.ok(
        await evaluate(
          `(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) return false; element.value = ${JSON.stringify(value)}; element.dispatchEvent(new Event("input", { bubbles: true })); element.dispatchEvent(new Event("change", { bubbles: true })); return true; })()`
        ),
        `Missing input: ${selector}`
      );
    }
    async function preview(name) {
      await evaluate("window.scrollTo(0, 0)");
      await new Promise(resolve => setTimeout(resolve, 180));
      assert.ok(
        await evaluate(
          "document.documentElement.scrollWidth <= window.innerWidth + 1"
        ),
        `Horizontal overflow: ${name}`
      );
      fs.writeFileSync(
        path.join(previews, `${name}.png`),
        (await win.webContents.capturePage()).toPNG()
      );
    }

    await win.loadURL(origin);
    await waitFor("Boolean(document.querySelector('.login-form'))");
    assert.ok((await evaluate("location.hash")).includes("login"));
    await preview("login-desktop");
    await clickText("Mit Beispielroman starten");
    await waitFor("Boolean(document.querySelector('.dashboard'))");
    assert.match(
      await evaluate("document.querySelector('h1').textContent"),
      /Alex/
    );
    assert.equal(
      await evaluate("document.querySelectorAll('.quick-card').length"),
      4
    );
    assert.equal(
      await evaluate("document.querySelectorAll('.q-drawer').length"),
      0
    );
    await preview("overview-desktop");

    await clickText("Projekte", ".desktop-nav a");
    await waitFor("document.querySelectorAll('.entity-card').length === 2");
    await clickText("Neues Projekt");
    await waitFor("Boolean(document.querySelector('.project-dialog input'))");
    await input(".project-dialog input", "Nacht über dem Hafen");
    await input(".project-dialog textarea", "Eine neue Geschichte am Meer.");
    await clickText("Projekt anlegen");
    await waitFor("document.querySelectorAll('.entity-card').length === 3");
    await input(".search-field input", "Hafen");
    await waitFor("document.querySelectorAll('.entity-card').length === 1");
    await click(".entity-card");
    await waitFor("Boolean(document.querySelector('.empty-state'))");

    await clickText("Figuren", ".desktop-nav a");
    await waitFor("document.querySelectorAll('.entity-card').length === 5");
    await click(".entity-card");
    await waitFor(
      "Boolean(document.querySelector('.entity-details .linked-scene'))"
    );
    await click(".entity-details .linked-scene");
    await waitFor("Boolean(document.querySelector('.manuscript-input'))");
    const sceneId = await evaluate(
      "new URLSearchParams(location.hash.split('?')[1]).get('scene')"
    );
    const draft =
      "Ein neuer Satz für Anna.\n\nDer Regen zeichnete leise Linien auf das Fenster.";
    await input(".manuscript-input", draft);
    await clickText("Szenenkompass");
    await clickText("Notizen");
    await input(
      ".notes-panel textarea",
      "Den Brief im nächsten Kapitel wieder aufgreifen."
    );
    await preview("editor-desktop");
    assert.equal(
      await evaluate(
        `JSON.parse(localStorage.getItem('folio.drafts'))[${JSON.stringify(`${sceneId}:de`)}].text`
      ),
      draft
    );
    const exported = path.join(previews, "scene-export.txt");
    const download = new Promise((resolve, reject) => {
      win.webContents.session.once("will-download", (_event, item) => {
        item.setSavePath(exported);
        item.once("done", (_downloadEvent, state) => {
          if (state === "completed") resolve();
          else reject(new Error(`Export failed: ${state}`));
        });
      });
    });
    await click('.editor-tools [aria-label="Text exportieren"]');
    await download;
    assert.ok(fs.readFileSync(exported, "utf8").includes(draft));
    win.reload();
    await waitFor("Boolean(document.querySelector('.manuscript-input'))");
    assert.equal(
      await evaluate("document.querySelector('.manuscript-input').value"),
      draft
    );
    await clickText("Notizen");
    assert.equal(
      await evaluate("document.querySelector('.notes-panel textarea').value"),
      "Den Brief im nächsten Kapitel wieder aufgreifen."
    );

    await click(".language-button");
    await waitFor(
      "Boolean(Array.from(document.querySelectorAll('.q-item')).find(item => item.textContent.trim() === 'English'))"
    );
    await clickText("English", ".q-item");
    await waitFor(
      "document.documentElement.lang === 'en' && document.body.innerText.includes('Scene compass')"
    );
    assert.equal(
      await evaluate("document.querySelector('.manuscript-input').value"),
      draft,
      "Interface switch must not change the writing language"
    );
    assert.ok(requested.has("/locales/de/gui/studio.json"));
    assert.ok(requested.has("/locales/en/gui/studio.json"));
    await clickText("Focus mode");
    await waitFor("Boolean(document.querySelector('.is-focus'))");
    assert.equal(
      await evaluate("document.querySelectorAll('.context-panel').length"),
      0
    );
    await clickText("Leave focus");
    await clickText("Overview", ".desktop-nav a");
    await waitFor("Boolean(document.querySelector('.dashboard'))");

    win.setContentSize(390, 844);
    await new Promise(resolve => setTimeout(resolve, 300));
    await preview("overview-mobile");
    assert.equal(
      await evaluate(
        "getComputedStyle(document.querySelector('.mobile-nav')).display"
      ),
      "flex"
    );
    await clickText("Write", ".mobile-nav a");
    await waitFor("Boolean(document.querySelector('.manuscript-input'))");
    assert.equal(
      await evaluate("document.querySelector('.manuscript-input').value"),
      draft,
      "Writing language must survive navigation"
    );
    await clickText("Chapters & scenes");
    await clickText("Scene compass");
    await clickText("Notes");
    await preview("editor-mobile");
    await clickText("Focus mode");
    await preview("focus-mobile");
    await clickText("Leave focus");
    win.setContentSize(320, 740);
    await preview("editor-small-mobile");
    await click(".profile-button");
    await waitFor(
      "Boolean(Array.from(document.querySelectorAll('.q-item')).find(item => item.textContent.includes('Sign out')))"
    );
    await clickText("Sign out", ".q-item");
    await waitFor("Boolean(document.querySelector('.login-form'))");
    await preview("login-mobile");
    await evaluate("location.hash = '#/books'");
    await waitFor("location.hash.includes('/login')");
    assert.deepEqual(errors, [], `Browser errors: ${errors.join("\n")}`);
    console.log(
      "Studio smoke test passed: login, guard, navigation, search, project creation, editor, notes, persistence, translations, export, focus, desktop/mobile overflow."
    );
    console.log(`Previews: ${previews}`);
    console.log(
      `Loaded translations: ${origin}/locales/de/gui/studio.json, ${origin}/locales/en/gui/studio.json`
    );
    clearTimeout(timeout);
    await new Promise(resolve => server.close(resolve));
    app.exit(0);
  })
  .catch(error => {
    console.error(error);
    clearTimeout(timeout);
    server?.close();
    app.exit(1);
  });
