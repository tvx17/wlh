import assert from "node:assert/strict";
import { test } from "node:test";
import { execute } from "@/core/app/bridge.ts";
import { createExecutor, isTrustedDocument } from "@electron/execute.ts";

await test("renderer forwards command, payload, result and backend failures", async () => {
  const backend = createExecutor(
    new Map([
      ["echo", payload => payload],
      [
        "fail",
        () => {
          throw new Error("Command failed");
        }
      ]
    ])
  );
  globalThis.window = { appBridge: { execute: backend } };
  try {
    const payload = { value: 42 };
    assert.deepEqual(await execute("echo", payload), payload);
    await assert.rejects(execute("fail"), /Command failed/);
    await assert.rejects(execute("missing"), /Unknown backend command/);
    await assert.rejects(execute(""), /command name/);
    await assert.rejects(backend(null), /command name/);
    await assert.rejects(backend("__proto__"), /Unknown/);
  } finally {
    delete globalThis.window;
  }
});

await test("bridge rejects in ordinary browsers and SSR", async () => {
  await assert.rejects(execute("app.info"), /only available in Electron/);
  globalThis.window = {};
  try {
    await assert.rejects(execute("app.info"), /only available in Electron/);
  } finally {
    delete globalThis.window;
  }
});

await test("document authorization permits hash routes but rejects other URLs", () => {
  assert.equal(
    isTrustedDocument(
      "http://localhost:9000/#/second",
      "http://localhost:9000/"
    ),
    true
  );
  assert.equal(
    isTrustedDocument(
      "file:///app/index.html#/second",
      "file:///app/index.html"
    ),
    true
  );
  for (const url of [
    "https://example.org/",
    "http://localhost:9001/",
    "http://localhost:9000/other",
    "invalid"
  ]) {
    assert.equal(isTrustedDocument(url, "http://localhost:9000/"), false);
  }
});

await test("translation file transport accepts locale JSON and rejects traversal", async () => {
  const { readTranslationFile, echoText } =
    await import("@electron/translations.ts");
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const nodePath = await import("node:path");
  const directory = await mkdtemp(
    nodePath.join(tmpdir(), "quasar-translations-")
  );
  try {
    await mkdir(nodePath.join(directory, "locales/de/gui"), {
      recursive: true
    });
    await writeFile(
      nodePath.join(directory, "locales/de/gui/studio.json"),
      '{"title":"Folio"}'
    );
    const resolveFile = (...parts) => nodePath.join(directory, ...parts);
    assert.deepEqual(
      await readTranslationFile("locales/de/gui/studio.json", resolveFile),
      { title: "Folio" }
    );
    for (const invalid of [
      "../secret.json",
      "locales/de/../secret.json",
      "/locales/de/gui/studio.json",
      null
    ]) {
      await assert.rejects(
        readTranslationFile(invalid, resolveFile),
        /Invalid translation path/
      );
    }
    await assert.rejects(
      readTranslationFile("locales/en/gui/studio.json", resolveFile),
      /ENOENT/
    );
    assert.equal(echoText("Hallo").text, "Hallo");
    assert.ok(Number.isFinite(Date.parse(echoText("Hallo").receivedAt)));
    assert.throws(() => echoText({}), /Expected text/);
    assert.throws(() => echoText("x".repeat(2001)), /Expected text/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
