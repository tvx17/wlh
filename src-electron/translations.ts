import { readFile } from "node:fs/promises";

/** Only relative locale JSON resources are exposed to the renderer. */
export async function readTranslationFile(
  resource: unknown,
  resolveFile: (...parts: string[]) => string
): Promise<unknown> {
  if (
    typeof resource !== "string" ||
    !/^locales\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)+\.json$/.test(resource)
  ) {
    throw new Error("Invalid translation path");
  }
  return JSON.parse(
    await readFile(resolveFile(...resource.split("/")), "utf8")
  );
}

export function echoText(text: unknown) {
  if (typeof text !== "string" || text.length > 2000)
    throw new Error("Expected text with at most 2000 characters");
  return { text, receivedAt: new Date().toISOString() };
}
