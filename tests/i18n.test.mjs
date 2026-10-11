import { test } from "node:test";
import assert from "node:assert/strict";
import { TranslationLoader } from "../src/i18n/loader.ts";
function setup() {
  const published = new Map();
  const requests = [];
  let locale = "de-de";
  const loader = new TranslationLoader(
    (key, value) => published.set(key, value),
    value => {
      locale = value;
    },
    async url => {
      requests.push(url);
      if (url.includes("fr-fr")) throw new Error("Missing file");
      return { greeting: url };
    }
  );
  return { loader, published, requests, locale: () => locale };
}
void test("shared resources load once and unload after the last release", async () => {
  const { loader, published, requests } = setup();
  const [first, second] = await Promise.all([
    loader.acquire("co.hallo", "components/hallo"),
    loader.acquire("co.hallo", "components/hallo")
  ]);
  assert.equal(requests.length, 1);
  await first();
  assert.ok(published.get("de-de").co.hallo);
  await first();
  await second();
  assert.deepEqual(published.get("de-de"), {});
});
void test("locale changes load active resources and discard the old language", async () => {
  const { loader, published, locale } = setup();
  const release = await loader.acquire("app", "app");
  await loader.setLocale("en-us");
  assert.equal(locale(), "en-us");
  assert.deepEqual(published.get("de-de"), {});
  assert.equal(published.get("en-us").app.greeting, "i18n/en-us/app.json");
  await assert.rejects(loader.setLocale("fr-fr"));
  assert.equal(locale(), "en-us");
  assert.ok(published.get("en-us").app);
  await release();
  assert.deepEqual(published.get("en-us"), {});
});
void test("invalid paths, dangerous keys and overlapping namespaces are rejected", async () => {
  const { loader } = setup();
  await assert.rejects(loader.acquire("co.hallo", "../secret"));
  const release = await loader.acquire("co.hallo", "components/hallo");
  await assert.rejects(loader.acquire("co", "app"));
  await assert.rejects(loader.acquire("co.hallo", "other"));
  await assert.rejects(loader.acquire("constructor", "app"));
  await release();
  const invalid = new TranslationLoader(
    () => {},
    () => {},
    async () => JSON.parse('{"__proto__":{"bad":"value"}}')
  );
  await assert.rejects(invalid.acquire("app", "app"));
});
