# Quasar App (quasar)

## Folio writing workspace

Run `npm run dev` and choose **Mit Beispielroman starten** on the login screen.
Folio provides a responsive writing dashboard, project/book/character/place
views, and a scene editor using `@/mockData.js`. Its tools expand as inline
panels, with a focus mode and bottom notes panel. There are no drawers.
The login is a local demo session, not backend authentication; passwords are
never stored or submitted. Sign out through the profile menu.

Drafts, notes, new projects and preferences persist in this browser's
`localStorage`; the demo profile uses `sessionStorage`. Scene drafts are separate
for German and English text. The editor exports the current text as `.txt`.
The daily goal counts words in manuscripts edited today, not newly added words.
Demo records remain unchanged. The interface loads `gui/studio.json` through
the existing language service under the `studio` namespace (`de` and `en`).

For the desktop/mobile interaction check, build with `npm run build`, then run
`src-electron/node_modules/electron/dist/electron.exe tests/studio-smoke.cjs`.
It checks login, navigation, editing, persistence, panels and language switching
in an isolated browser session and saves previews under `.quasar/studio-preview`.

## Install the dependencies

```bash
pnpm install
# or: yarn/npm/bun install
```

### Start the app in development mode (HMR, error reporting, etc.)

```bash
quasar dev
```

### Format & Lint the files

```bash
pnpm run lint
# or: yarn/npm/bun run lint
```

...or just check formatting & linting:

```bash
pnpm run lint:check
# or: yarn/npm/bun run lint:check
```

### Build the app for production

```bash
quasar build
```

### Tailwind CSS

Tailwind CSS is integrated through `@tailwindcss/vite` and
`src/gui/css/tailwind.css`. Use the `tw:` prefix to avoid collisions with Quasar
classes, for example `class="tw:flex tw:gap-4 tw:font-bold"`.
Preflight is omitted so Quasar retains its base styles. Keep Tailwind imports
in the CSS entry rather than SCSS. Start with `npm run dev` or build with
`npm run build`.

### Dynamic translations

JSON translations live in `public/locales/<locale>/<directory>/<file>.json`.
Locales can be `de`, `en`, regional tags, or custom identifiers such as `xx`.
Files contain message keys directly, for example `{ "welcome": "Hello, {name}!" }`.

Call the composable synchronously in `<script setup>` in pages, layouts,
components, or elements:

```ts
import { onMounted } from "vue";
import { useLangData } from "@/core/composables/useLangData";

const { t, locale, loadLangData, unloadLangData, changeLanguage } =
  useLangData();
onMounted(async () => {
  await loadLangData("eins", "components", "eins");
  // t("eins.welcome", { name: "Quasar" })
});
// await changeLanguage("de");
// unloadLangData("eins");
```

All three load parameters are required. Use `""` for the root directory or
`"components/forms"` for nested directories. Namespace names must be single
identifiers, without dots. Different active files require different namespaces;
identical filenames in different directories are supported.

Each successful load owns one reference. Unloading releases one reference owned
by that composable; unmounting releases all its references, including pending loads.
The last release removes the namespace from the service and VueI18n messages.
There is no application-level cache of inactive translations. VueI18n/browser
internal caches and garbage collection remain managed by those runtimes.

Use `changeLanguage()` rather than assigning VueI18n's locale directly. It loads
every active file before publishing the new language, then clears old messages.
HTTP/JSON errors reject the promise and retain the previous language; callers
should catch errors and show loading/error UI. Missing keys use VueI18n's normal
warnings/key display; cross-language fallback is disabled. Initial locale is `en`.
The home page demonstrates loading, interpolation, and switching to `de`/`en`/`xx`.
Run `npm run test:i18n` for lifecycle and error tests (Node 22.18+ or 24 recommended).
Custom locales need a real locale mapping if used for Intl date/number formatting.
The default fetch loader targets browser SPA/PWA usage; SSR callers must supply
an absolute base URL/fetcher to the service factory.

### Electron backend bridge

Import the asynchronous bridge from any renderer component or service:

```ts
import { execute } from "@/core/app/bridge";

const info = await execute("app.info");
```

`execute(command, payload?)` returns a `Promise<unknown>` and rejects on backend
errors or when used outside Electron. Pass structured-clone-compatible payloads
and results (plain objects, arrays, strings, numbers); catch errors at the caller.

The preload exposes `window.appBridge.execute`, which invokes the fixed IPC
channel `execute`. The main process validates the calling window/document and
dispatches through `src-electron/execute.ts`. Register additional named commands
in the handler map in `electron-main.ts`; each handler validates its payload.
Unknown commands reject. The example `app.info` returns name, version, and platform.
Context isolation and sandboxing stay enabled; renderer Node integration is disabled.

Use `npx quasar dev -m electron` for development and
`npx quasar build -m electron --skip-pkg` to verify the Electron build.
Run `npm run test:bridge` for bridge and dispatcher tests.
For an actual IPC smoke test, build Electron first, then run
`src-electron/node_modules/electron/dist/electron.exe tests/electron-bridge-smoke.cjs`.
The test uses an invisible window and the built preload, checks results and
error propagation, and exits automatically.

### Project structure and aliases

GUI pages, components, and styles live in `src/gui/`. Router setup, Pinia
stores, composables, and application services live in `src/core/`.
Project imports must use complete alias paths: `@/` for `src/`, `@electron/`
for `src-electron/`, and `@root/` for the repository root.

Quasar config resolves the moved router, stores, route generation, and global
styles. `src/css/quasar.variables.scss` forwards to the GUI theme because
Quasar discovers its variables entry at that fixed path. Do not edit generated
route types; they are generated in `src/core/router/typed-router.d.ts`.

Node tests load `scripts/register-aliases.mjs` before importing application
files, so they use the same aliases. Use the npm test scripts rather than
invoking individual test files directly. Node 24 is recommended.

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-file).
