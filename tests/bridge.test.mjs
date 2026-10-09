import assert from "node:assert/strict";
import { test } from "node:test";
import { execute } from "../src/core/app/bridge.ts";
import { createExecutor, isTrustedDocument } from "../src-electron/execute.ts";

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
