# Repository Guidelines

## Project Structure & Module Organization

This boilerplate uses Quasar, Vue 3, TypeScript, and Vite. `src/App.vue` is
the root component. Reusable UI lives in `src/components/`; file-based routes
live in `src/pages/`, including nested pages and `[...path].vue` for unmatched
paths. Router setup lives in `src/router/`; do not manually edit generated
`typed-router.d.ts`.

Keep Pinia stores in `src/stores/`, startup integrations in `src/boot/`, and
translation messages in `src/i18n/`. Use `src/css/` for shared styles,
`src/assets/` for imported assets, and `public/` for files served directly.
`quasar.config.ts` controls boot files, routing, and builds. `.quasar/` and
`dist/` contain generated output.

## Build, Test, and Development Commands

Use a Node version supported by `package.json`, such as Node 24.

- `npm ci`: install dependencies from the committed `package-lock.json`;
  the postinstall hook prepares Quasar's generated files.
- `npm run dev`: start the development server with hot reload and browser opening.
- `npm run build`: create the production build in `dist/`.
- `npm run typecheck`: check Vue and TypeScript types without emitting files.
- `npm run lint:check`: check formatting and run type-aware Oxlint checks.
- `npm run lint`: format files with Oxfmt and apply Oxlint fixes; review the diff.

## Coding Style & Naming Conventions

Use two-space indentation, UTF-8, LF line endings, and a final newline.
Oxfmt specifies an 80-character print width, double quotes, semicolons, and
no trailing commas. Follow `oxfmt.config.ts` and `oxlint.config.ts`.

Write Vue components with `<script setup lang="ts">`. Use PascalCase for
reusable component files, such as `EssentialLink.vue`; follow existing route
filenames in `src/pages/`. Use camelCase for functions and variables, and
`use…Store` for Pinia store exports. Prefer `@/` imports for source modules.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured.
Before submitting changes, run `lint:check`, `typecheck`, and `build`.
Manually verify affected routes, navigation, responsive layouts, and translations
in the development server. Document verification steps in the pull request.

## Commit & Pull Request Guidelines

Git history currently contains only `Initialize the project 🚀`; no established
commit convention exists. Use concise, imperative subjects describing the change.
Keep commits focused. Pull requests should explain the purpose, link relevant
issues, list validation results, and include screenshots for visible UI changes.
Exclude generated output and secrets; `.env*` files are ignored.
