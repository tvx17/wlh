# Quasar – Projektvorlage

Die Vorlage zeigt einen Sprachwechsel (Deutsch/Englisch), eine einblendbare Komponente mit automatisch freigegebenen Sprachdaten und ein Electron-Echo mit Empfangszeit. Die Backend-Schaltfläche ist im Browser deaktiviert.

GUI-Dateien liegen unter `src/gui`; Router, Stores, Composables und Dienste unter `src/core`. Tailwind CSS ist über das Vite-Plugin eingebunden: Klassen tragen das Präfix `tw:`, Preflight bleibt deaktiviert. Sprachdateien liegen unter `public/locales/{de,en}`. `useLangData` lädt JSON mit Referenzzählung; Namensräume werden beim letzten Unmount entfernt. Sprachwechsel erfolgen über `changeLanguage` ohne Sprachfallback. In Electron werden Sprachdateien über den registrierten Backend-Befehl `translations.read` gelesen.

Die Folio-Anwendung wurde am 2026-10-13 nach WLH übertragen. Diese Vorlage enthält keine Folio-Seiten, Mock-Daten oder Demo-Anmeldung.

Arbeitsverzeichnis für alle Befehle:

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npm run dev -- --port 9001
```

Browser: [Vorlage](http://localhost:9001/#/). Deutsch/Englisch wechseln, Komponente aus-/einblenden und zweite Seite aufrufen. Bei Portkonflikten die Terminaladresse verwenden.

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npm run dev:electron
npm run test:i18n
npm run test:bridge
npm run lint:check
npm run typecheck
npm run build
npm run build:electron
```

In Electron zusätzlich Echo senden und Antwortzeit prüfen. Automatisierte Oberflächen-/IPC-Prüfungen und ausgeführte Ergebnisse stehen in `ACTIONS.md`.
