import assert from "node:assert/strict";
import { test } from "node:test";
import { createI18n } from "vue-i18n";
import { createLangDataService } from "../src/i18n/lang-data.ts";
import { langDataKey } from "../src/i18n/lang-data.ts";
import { readFile } from "node:fs/promises";
import { transpileModule } from "typescript";
import { createRenderer, h } from "vue";

// Resolve the app alias for Node while exercising the actual composable source.
const composableSource = await readFile(
  new URL("../src/composables/useLangData.ts", import.meta.url),
  "utf8"
);
const compiled = transpileModule(composableSource, {
  compilerOptions: { module: 99, target: 99 }
})
  .outputText.replace(
    '"@/i18n/lang-data"',
    JSON.stringify(new URL("../src/i18n/lang-data.ts", import.meta.url).href)
  )
  .replace('"vue"', JSON.stringify(import.meta.resolve("vue")))
  .replace('"vue-i18n"', JSON.stringify(import.meta.resolve("vue-i18n")));
const { useLangData } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function setup(fetcher) {
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: false,
    messages: {}
  });
  const service = createLangDataService(i18n.global, {
    baseUrl: "/app/",
    fetcher
  });
  return { service, store: i18n.global };
}

await test("shared ownership, interpolation, namespace isolation and unloading", async () => {
  const urls = [];
  const { service, store } = setup(async url => {
    urls.push(url);
    return Response.json({ welcome: "Hello, {name}!" });
  });
  const a = service.acquire("eins", "components/forms", "eins");
  const b = service.acquire("eins", "components/forms", "eins");
  await Promise.all([a.ready, b.ready]);
  assert.deepEqual(urls, ["/app/locales/en/components/forms/eins.json"]);
  assert.equal(store.t("eins.welcome", { name: "World" }), "Hello, World!");
  await assert.rejects(
    service.acquire("eins", "pages", "eins").ready,
    /Namespace/
  );
  const c = service.acquire("eins", "pages", "page");
  await c.ready;
  a.release();
  a.release();
  assert.equal(store.te("eins.welcome"), true);
  b.release();
  assert.equal(store.te("eins.welcome"), false);
  assert.equal(store.te("page.welcome"), true);
  c.release();
  assert.deepEqual(store.getLocaleMessage("en"), {});
});

await test("switch is atomic, preserves old data on failure, and supports xx", async () => {
  let fail = true;
  const { service, store } = setup(async url => {
    if (fail && url.includes("/de/pages/"))
      return new Response(null, { status: 404 });
    return Response.json({ welcome: url });
  });
  const a = service.acquire("eins", "components", "eins");
  const b = service.acquire("eins", "pages", "page");
  await Promise.all([a.ready, b.ready]);
  const original = JSON.stringify(store.getLocaleMessage("en"));
  await assert.rejects(service.changeLanguage("de"), /404/);
  assert.equal(store.locale.value, "en");
  assert.equal(JSON.stringify(store.getLocaleMessage("en")), original);
  assert.deepEqual(store.getLocaleMessage("de"), {});
  fail = false;
  await service.changeLanguage("de");
  assert.equal(store.locale.value, "de");
  assert.match(store.t("eins.welcome"), /\/de\//);
  assert.deepEqual(store.getLocaleMessage("en"), {});
  await service.changeLanguage("xx");
  assert.equal(store.locale.value, "xx");
  assert.deepEqual(store.getLocaleMessage("de"), {});
  a.release();
  b.release();
});

await test("release during fetch and queued switches cannot resurrect resources", async () => {
  let finish;
  let started;
  const start = new Promise(resolve => {
    started = resolve;
  });
  const { service, store } = setup(url => {
    started();
    return new Promise(resolve => {
      finish = () => resolve(Response.json({ welcome: url }));
    });
  });
  const handle = service.acquire("eins", "", "eins");
  await start;
  handle.release();
  const de = service.changeLanguage("de");
  const xx = service.changeLanguage("xx");
  finish();
  await Promise.all([handle.ready, de, xx]);
  assert.equal(store.locale.value, "xx");
  for (const locale of ["en", "de", "xx"])
    assert.deepEqual(store.getLocaleMessage(locale), {});
});

await test("invalid paths and JSON fail clearly; subsequent loads still work", async () => {
  let invalid = true;
  const { service, store } = setup(async () =>
    Response.json(invalid ? { welcome: null } : { welcome: "ok" })
  );
  assert.throws(() => service.acquire("../eins", "", "eins"), /Invalid/);
  assert.throws(() => service.acquire("eins", "../pages", "eins"), /Invalid/);
  assert.throws(() => service.acquire("eins", "", ""), /Invalid/);
  assert.throws(() => service.acquire("eins", ""), /Invalid/);
  assert.throws(() => service.changeLanguage("../de"), /Invalid/);
  await assert.rejects(
    service.acquire("eins", "", "eins").ready,
    /Invalid translations/
  );
  assert.deepEqual(store.getLocaleMessage("en"), {});
  invalid = false;
  const handle = service.acquire("eins", "", "eins");
  await handle.ready;
  assert.equal(store.t("eins.welcome"), "ok");
  handle.release();
});

await test("Vue component unmount releases shared and pending ownership", async () => {
  const i18n = createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: false,
    messages: {}
  });
  let requests = 0;
  const service = createLangDataService(i18n.global, {
    fetcher: async () => {
      requests++;
      return Response.json({ welcome: "Hello" });
    }
  });
  const renderer = createRenderer({
    createElement: () => ({}),
    createText: () => ({}),
    createComment: () => ({}),
    insert() {},
    remove() {},
    setText() {},
    setElementText() {},
    patchProp() {},
    parentNode: () => null,
    nextSibling: () => null
  });
  const pending = [];
  const controls = [];
  const Child = {
    setup() {
      const language = useLangData();
      controls.push(language);
      pending.push(language.loadLangData("eins", "components", "eins"));
      return () => h("div");
    }
  };
  const app = renderer.createApp({
    render: () => h("div", [h(Child), h(Child)])
  });
  app.use(i18n);
  app.provide(langDataKey, service);
  app.mount({});
  await Promise.all(pending);
  assert.equal(requests, 1);
  controls[0].unloadLangData("eins");
  assert.equal(i18n.global.te("eins.welcome"), true);
  // A pending load must not restore messages after the scope has been disposed.
  const extra = controls[1].loadLangData("other", "", "other");
  app.unmount();
  await extra;
  assert.deepEqual(i18n.global.getLocaleMessage("en"), {});
  assert.equal(requests, 1);
});
