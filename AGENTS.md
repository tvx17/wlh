# Projektregeln für Codex

## Projektstruktur

WLH enthält die Folio-Schreiboberfläche. GUI-Seiten, Komponenten und Styles liegen in `src/gui/`; Router, Stores, Dienste und Composables in `src/core/`. Verwende vollständige Import-Aliase `@/`, `@electron/` und `@root/`. Sprachdateien liegen unter `public/locales/`. Generierte Routentypen nicht manuell bearbeiten. Tailwind-Klassen verwenden das Präfix `tw:`; Preflight bleibt deaktiviert.

## Änderungsdokumentation

- Dokumentiere alle von dir vorgenommenen Änderungen in `AENDERUNGEN.md`, auch Änderungen an Dokumentation, Konfiguration und Skripten.
- Ergänze pro zusammenhängender Aufgabe einen datierten Eintrag auf Deutsch. Beschreibe Zweck und Ergebnis auf hoher Abstraktionsebene; vermeide kleinteilige Implementierungsdetails.
- Halte die Dokumentation vor der abschließenden Antwort aktuell. Bestehende Einträge bleiben erhalten.
- Dokumentiere ausführbare Schritte sichtbar: vollständige CLI-Befehle in Codeblöcken mit Arbeitsverzeichnis, erforderliche Browser-URLs als anklickbare Links und nötige manuelle Schritte.
- Unterscheide bereits ausgeführte Prüfungen von Schritten, die der Benutzer noch ausführen muss. Nenne Ergebnisse und relevante offene Punkte knapp.
- Trage keine Zugangsdaten oder sonstigen Geheimnisse ein; verwende bei Bedarf klar bezeichnete Platzhalter.

## Sitzung wieder aufnehmen

`Resume-Codex.ps1` im Projektstamm öffnet die beim Einrichten festgelegte Codex-Sitzung. Aufruf und Voraussetzungen stehen in `AENDERUNGEN.md`.
