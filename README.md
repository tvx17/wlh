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

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-file).
