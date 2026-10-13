# Repository Guidelines

Quasar ist eine wiederverwendbare Vorlage mit Vue 3, TypeScript, Pinia, dynamischen Sprachdaten, Tailwind CSS und Electron.

## Struktur

GUI-Seiten, Komponenten und Styles liegen in `src/gui/`. Router, Stores, Dienste und Composables liegen in `src/core/`; Boot-Integrationen in `src/boot/`. Imports verwenden vollständige Alias-Pfade: `@/`, `@electron/` und `@root/`. Generierte Routentypen und Dateien in `.quasar/` und `dist/` nicht manuell bearbeiten. Sprachdateien liegen unter `public/locales/`.

## Dokumentation

Alle Änderungen knapp und datiert auf Deutsch in `ACTIONS.md` dokumentieren. CLI-Befehle mit Arbeitsverzeichnis in Codeblöcken und erforderliche Browser-URLs als Links nennen; ausgeführte Prüfungen und offene Schritte unterscheiden. Keine Geheimnisse dokumentieren.

## Stil und Prüfung

Zwei Leerzeichen, LF, doppelte Anführungszeichen und Vue-Komponenten mit `<script setup lang="ts">`. Bestehende Oxfmt-/Oxlint-Konfiguration beachten. Vor Abschluss `npm run lint:check`, `npm run typecheck`, `npm run test:i18n`, `npm run test:bridge` und `npm run build` ausführen. Bei Electron-Änderungen auch Electron-Build und vorhandenen IPC-Smoke-Test prüfen.
