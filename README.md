# Quasar App (quasar)

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
`src/css/tailwind.css`. Use the `tw:` prefix to avoid collisions with Quasar
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
import { useLangData } from "@/composables/useLangData";

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

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-file).
