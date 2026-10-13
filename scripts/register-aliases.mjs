import { registerHooks } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Match Quasar's build.alias for Node tests and the Electron smoke test.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const aliases = {
  "@/": resolve(root, "src"),
  "@electron/": resolve(root, "src-electron"),
  "@root/": root
};

export function resolveProjectPath(specifier) {
  for (const [prefix, base] of Object.entries(aliases)) {
    if (specifier.startsWith(prefix)) {
      return resolve(base, specifier.slice(prefix.length));
    }
  }
  throw new Error(`Unknown project alias: ${specifier}`);
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    for (const prefix of Object.keys(aliases)) {
      if (specifier.startsWith(prefix)) {
        return nextResolve(
          pathToFileURL(resolveProjectPath(specifier)).href,
          context
        );
      }
    }
    return nextResolve(specifier, context);
  }
});
