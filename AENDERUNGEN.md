# Änderungsdokumentation

## 2026-10-13 – Folio nach WLH übertragen und Quasar zur Vorlage zurückgeführt

Die Folio-Schreiboberfläche wurde mit Mock-Daten, Session-/Studio-Stores, Styles, Sprachdateien, Router-Guard und Bedienablauftest aus Quasar nach WLH übertragen. Die bisherige einfache WLH-Oberfläche wurde in Quasar eingesetzt: Sprachwechsel, einblendbare Komponente und Electron-Echo. Beide Projekte behalten beziehungsweise verwenden jetzt die GUI/Core-Aufteilung. Quasar enthält keine Folio-Anmeldung oder fachlichen Folio-Daten mehr.

Die gemeinsame Grundlage verwendet Quasars referenzgezählten Sprachdienst unter `src/core/app`, Sprachdateien unter `public/locales` und die allgemeine Electron-Brücke `execute`. Die alte WLH-API `window.desktop` und `useTranslationResource` wurde durch diese gemeinsame API ersetzt. Die Vorlagendemo verwendet `de`/`en` statt `de-de`/`en-us`. Für beide Projekte wurde ein gezielter Electron-Dateitransport ergänzt, damit die Sprachdateien auch im ausgelieferten Build ohne HTTP-Server geladen werden. Echo bleibt mit Text und Empfangszeit verfügbar. Backend-Eingaben und Dateipfade werden geprüft.

Tailwind CSS ist in **beiden** Projekten vorhanden und aktiv: Paketabhängigkeiten, Vite-Plugin sowie `src/gui/css/tailwind.css`; Klassen mit `tw:`-Präfix, ohne Preflight. Paketnamen und Produktnamen bleiben projektspezifisch. Abhängigkeiten wurden nicht neu installiert oder aktualisiert. Quasar-Konfiguration, Testskripte, README und Projektregeln wurden an die neuen Rollen angepasst. Der frühere Vergleich in `PROJEKTVERGLEICH.md` ist als historischer Stand gekennzeichnet.

### Lokale Sicherung

Die ausgetauschten Quelldateien, Sprachressourcen, Tests und Konfigurationen beider Projekte liegen vor dem Austausch gesichert unter `.quasar/ui-transfer-20261013/backup/{quasar,wlh}` im WLH-Verzeichnis. Diese lokale Sicherung ist von Git ausgeschlossen. Die Git-Verzeichnisse und bisherigen Dokumentationseinträge bleiben erhalten. Browser-/Electron-Speicherdaten werden durch den Quellcodetransfer nicht zwischen Benutzerprofilen übertragen.

### Start durch den Benutzer

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run dev -- --port 9000
```

Browser: [WLH/Folio](http://localhost:9000/#/). „Mit Beispielroman starten“ wählen, anschließend Dashboard, Projekte und Editor öffnen.

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npm run dev -- --port 9001
```

Browser: [Quasar-Vorlage](http://localhost:9001/#/). Sprache wechseln und die Beispielkomponente ein-/ausblenden. Bei Portkonflikten die Adresse der Terminalausgabe verwenden.

Electron jeweils im gewünschten Projektverzeichnis starten:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run dev:electron
```

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npm run dev:electron
```

### Ausgeführte Prüfungen

Abschließendes Ergebnis: In beiden Projekten sind alle 9 Dienst-/Bridge-Tests, Typprüfung, Format-/Codeprüfung, SPA-Build, Electron-Build und der gebaute Electron-Oberflächentest erfolgreich. In WLH ist zusätzlich der vollständige Folio-Bedienablauftest erfolgreich (Login, Navigation, Suche, Projektanlage, Editor, Notizen, Speicherung, Export, Fokusmodus und Desktop-/Mobile-Darstellung). Die Codeprüfung beanstandete einen ungebundenen Node-Pfadhelfer im neuen Test; dessen Aufruf wurde korrigiert. `git diff --check` ist in beiden Projekten erfolgreich.

In beiden Projektverzeichnissen wurden Quasars generierte Dateien neu erstellt, Sprachdienst- und Bridge-Tests, Typprüfung sowie SPA- und Electron-Build ausgeführt. Pro Projekt bestehen 5 Sprachdienst- und 4 Bridge-/Dateitransport-Testfälle. Die vorhandenen Folio-Bedienabläufe werden nun in WLH geprüft; ein zusätzlicher Test lädt die gebauten Electron-Oberflächen mit dem echten Preload und den produktiven Backend-Hilfsfunktionen. Die Testfenster bleiben unsichtbar und verwenden isolierte Browserprofile.

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npx quasar prepare
npm run test:i18n
npm run test:bridge
npm run typecheck
npm run lint:check
npm run build
npm run build:electron
```

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npx quasar prepare
npm run test:i18n
npm run test:bridge
npm run typecheck
npm run lint:check
npm run build
npm run build:electron
```

Oberflächentest in beiden Projektverzeichnissen; zusätzlich Folio-Bedienablauftest in WLH:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
$smoke = Start-Process -FilePath '.\src-electron\node_modules\electron\dist\electron.exe' -ArgumentList 'tests/studio-smoke.cjs' -WindowStyle Hidden -PassThru -Wait
if ($smoke.ExitCode -ne 0) { throw 'Folio-Bedienablauftest fehlgeschlagen.' }
$smoke = Start-Process -FilePath '.\src-electron\node_modules\electron\dist\electron.exe' -ArgumentList 'tests/application-electron-smoke.cjs' -WindowStyle Hidden -PassThru -Wait
if ($smoke.ExitCode -ne 0) { throw 'Electron-Oberflächentest fehlgeschlagen.' }
```

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
$smoke = Start-Process -FilePath '.\src-electron\node_modules\electron\dist\electron.exe' -ArgumentList 'tests/application-electron-smoke.cjs' -WindowStyle Hidden -PassThru -Wait
if ($smoke.ExitCode -ne 0) { throw 'Electron-Oberflächentest fehlgeschlagen.' }
```

Prüfprotokolle liegen jeweils unter `.quasar/transfer-*.log`; Folio-Vorschaubilder unter `.quasar/studio-preview` in WLH. Ein erster Sandbox-Lauf blockierte Build-/Format-Unterprozesse; diese Prüfungen wurden mit Freigabe außerhalb der Sandbox wiederholt. Formatabweichungen wurden korrigiert. Der erste neue Folio-Electron-Test suchte einen nur mobil vorhandenen Navigationsknopf im Desktop-Menü; der Test wurde auf den Editor-Routenaufruf korrigiert. Vue Router meldet weiterhin den bestehenden Hinweis auf ein nicht gesetztes `rootDir`. Installer und echte Serverauthentifizierung sind nicht Gegenstand dieser Migration.

## 2026-10-13 – Drei Quasar-Projekte verglichen

`PROJEKTVERGLEICH.md` dokumentiert den Vergleich von `QuasarTailwindDynamicLanguage`, `Quasar` und WLH anhand der lokalen Quellstände. Verglichen wurden Struktur, Paket- und Lockstände, Konfiguration, Übersetzungsdienste, Electron-Brücken, Oberfläche und vorhandene Tests. Die Datei enthält außerdem optionale Prüf-/Startbefehle mit Arbeitsverzeichnissen und Browser-Adresse.

Ergebnis: gemeinsame technische Basis, aber unterschiedliche Sprachdienst-APIs und deutlich unterschiedlicher Anwendungsumfang. Quasar enthält die Folio-Schreiboberfläche; WLH ergänzt einen Electron-Dateiladeweg für Sprachdateien. Ein möglicher Prüfbedarf für Quasars Sprachladen im ausgelieferten Electron-Build ist als Codeableitung gekennzeichnet.

Ausgeführt wurden ausschließlich lesende Quellcode-/Konfigurationsprüfungen sowie eine Prüfung der Dokumentationsänderungen. Keine Anwendungstests, Builds oder Browserstarts; beide Boilerplate-Projekte bleiben unverändert. Abschließender Prüfbefehl:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
git diff --check
```

## 2026-10-11 – Aktuelle Sitzung mit resume-session.ps1 fortsetzen

Die vorhandenen Projektregeln, die Änderungsdokumentation und das bisherige Sitzungsskript wurden gelesen. Zuvor wurde die Existenz von `AGENTS.md` geprüft; die vorhandene Datei blieb unverändert. Alle Änderungen dieser Aufgabe sind hier dokumentiert.

`resume-session.ps1` wurde erstellt und hinterlegt die aktuelle Sitzung `01a12b59-ab25-7dc0-9f00-2c670367c578`. Es startet Codex im Verzeichnis des Skripts und stellt anschließend das vorherige Arbeitsverzeichnis wieder her. Eine andere Sitzung kann mit `-SessionId` angegeben werden. Das bisherige `Resume-Codex.ps1` bleibt erhalten und verweist weiterhin auf die ältere Sitzung.

### Vom Benutzer auszuführen

Voraussetzungen: Codex CLI im `PATH`, bestehende Anmeldung und gespeicherte Sitzung im selben lokalen Codex-Profil. In PowerShell ausführen:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
.\resume-session.ps1
```

Optional den Befehl nur anzeigen oder eine andere Sitzung öffnen:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
.\resume-session.ps1 -PrintCommand
.\resume-session.ps1 -SessionId '<SITZUNGS-ID>'
```

Es ist keine Browser-URL aufzurufen. Das Skript exportiert keinen Gesprächsverlauf.

### Bereits ausgeführte Prüfungen

Die lokale CLI-Hilfe bestätigt `resume <SESSION_ID>` und `--cd`. PowerShell-Syntax und Befehlsausgabe wurden erfolgreich geprüft; `git diff --check` meldete keine fehlerhaften Leerzeichen. Die CLI-Hilfe meldete eingeschränkten Zugriff auf temporäre Codex-Verzeichnisse, lieferte aber erfolgreich die Hilfe. Git meldete Hinweise zur Zeilenenden-Konvertierung vorhandener Projektdateien. Ein interaktiver Sitzungsstart bleibt dem Benutzer überlassen.

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
codex resume --help
$parseErrors = $null
$parseTokens = $null
[System.Management.Automation.Language.Parser]::ParseFile((Join-Path $PWD 'resume-session.ps1'), [ref]$parseTokens, [ref]$parseErrors) | Out-Null
if ($parseErrors.Count -gt 0) { throw ($parseErrors | Out-String) }
.\resume-session.ps1 -PrintCommand
git diff --check
```

Diese Datei dokumentiert die von Codex vorgenommenen Änderungen in kurzen, datierten Einträgen. Befehle und Browser-URLs stehen sichtbar bei der jeweiligen Aufgabe.

## 2026-10-08 – Initialisierungsbeschreibung als Markdown formatiert

`codex_init.md` wurde mit Überschriften, Listen, formatierten technischen Bezeichnungen und einem Codeblock für den Beispielpfad strukturiert. Die beschriebenen Anforderungen bleiben erhalten.

Prüfung: Die formatierte Datei wurde vollständig gelesen und mit den ursprünglichen Anforderungen abgeglichen. Ausgeführter Prüfbefehl in PowerShell:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
Get-Content codex_init.md
```

Weitere manuelle Schritte oder Browser-Aufrufe sind für diese Formatierungsaufgabe nicht erforderlich.

## 2026-10-08 – Dokumentation und Wiederaufnahme eingerichtet

- `AGENTS.md` legt fest, dass Codex alle künftigen Änderungen hier knapp dokumentiert, einschließlich ausführbarer Schritte und Prüfergebnisse.
- `Resume-Codex.ps1` nimmt gezielt diese Sitzung wieder auf (ID: `01a119bb-c107-7c32-9e30-ecc34681e46a`). Das Projektverzeichnis wird aus dem Speicherort des Skripts ermittelt; nach dem Beenden wird das vorherige Arbeitsverzeichnis wiederhergestellt.
- Voraussetzung: Codex CLI im `PATH`, Anmeldung und die gespeicherte Sitzung im selben lokalen Codex-Profil. Das Skript selbst sichert oder exportiert den Gesprächsverlauf nicht.

### Sitzung wieder aufnehmen

In PowerShell im Projektverzeichnis `C:\Entwicklung\Projekte\WLH\vue\wlh` ausführen:

```powershell
.\Resume-Codex.ps1
```

Der zugrunde liegende CLI-Befehl lautet:

```powershell
codex resume 01a119bb-c107-7c32-9e30-ecc34681e46a --cd 'C:\Entwicklung\Projekte\WLH\vue\wlh'
```

Zur Anzeige des Befehls ohne Sitzungsstart:

```powershell
.\Resume-Codex.ps1 -PrintCommand
```

Optional lässt sich eine andere gespeicherte Sitzung angeben:

```powershell
.\Resume-Codex.ps1 -SessionId '<SITZUNGS-ID>'
```

### Voraussetzungen bei Bedarf herstellen

Nur falls Codex CLI fehlt oder noch keine Anmeldung besteht (Node.js/npm erforderlich):

```powershell
npm install -g @openai/codex
codex login
```

Offizielle Dokumentation: [Codex CLI und Befehle](https://developers.openai.com/codex/cli/reference).
Es ist für diese Einrichtung keine Projekt-URL im Browser aufzurufen.

### Prüfung

Die installierte CLI unterstützt `resume <SESSION_ID>` und `--cd`, geprüft mit:

```powershell
codex resume --help
```

PowerShell-Syntax und Befehlsausgabe wurden geprüft. Ein interaktiver Sitzungsstart erfolgt durch den Benutzer mit dem oben angegebenen Aufruf.

## 2026-10-08 – Projektgrundlage aus project_init.md umgesetzt

Die Verbindung zwischen Vue und Electron ist als typisierte Anfrage mit Antwort eingerichtet. Eine Beispielseite sendet Text an das Backend und zeigt die Antwort mit Empfangszeit an. Die isolierte Preload-Brücke bietet gezielte Methoden; das Backend prüft Absender und Eingaben. Sprachdateien werden in Electron über diese Brücke gelesen, damit die ausgelieferte App auch ohne HTTP-Server funktioniert.

Tailwind CSS ist über das Vite-Plugin eingebunden. Klassen verwenden das Präfix `tw:` (beispielsweise `tw:max-w-2xl`); Preflight wird ausgelassen, um Quasars Grundformatierung zu erhalten.

Übersetzungen werden zur Laufzeit aus JSON-Dateien unter `public/i18n/<sprache>/` geladen. Vorläufige Vorgaben: Startsprache `de-de`, Beispielsprache `en-us`, Echo als erste Backend-Aktion. Die dazu gestellten Rückfragen können diese Vorgaben noch konkretisieren. App-Texte werden beim Start geladen. Seiten, Layouts, Komponenten und Elemente können denselben Dienst nutzen. `useTranslationResource("co.hallo", "components/hallo")` lädt einen Namensraum und gibt ihn beim Entfernen des Verbrauchers frei. Mehrere Verbraucher teilen denselben Namensraum; die letzte Freigabe entfernt seine Nachrichten. Übergeordnete und untergeordnete Namensräume dürfen sich nicht überlappen. Ein Sprachwechsel lädt alle verwendeten Ressourcen, aktiviert sie erst nach erfolgreichem Laden und leert die Nachrichten der bisherigen Sprache. Fehlgeschlagene Wechsel erhalten den bisherigen Zustand. Freigabe außerhalb einer Vue-Komponente: die von `translations.acquire(namespace, path)` zurückgegebene Funktion aufrufen. Sprachwechsel: `await translations.setLocale("en-us")`. Neue Dateien können auch unter `pages/`, `layouts/` und `elements/` angelegt werden; in beiden Sprachen dieselben Ressourcen bereitstellen. Die automatische Entladung betrifft den Anwendungsspeicher, nicht den Browsercache oder den Speicherbereinigungszeitpunkt.

Die Startseite enthält einen Sprachwechsel und eine einblendbare Beispielkomponente. Skripte für Electron und drei automatisierte Tests wurden ergänzt. Paketmanifest und Lockdatei wurden durch die Tailwind-Installation aktualisiert; Quasar erzeugt seine Routentypen beim Build erneut. Bestehende Quelldateien der bisherigen statischen Beispielübersetzung bleiben ungenutzt erhalten.

### Ausgeführte Schritte und Prüfungen

Arbeitsverzeichnis für alle Befehle:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm install --save-dev tailwindcss @tailwindcss/vite
npm run lint
npm run test:i18n
npm run typecheck
npm run build
npm run build:electron
```

Die drei Übersetzungsdienst-Tests und die TypeScript-Prüfung sind erfolgreich, ebenso der SPA-Build. Ein erster Lintlauf meldete nicht markierte Test-Promises; diese wurden korrigiert. Die abschließenden Ergebnisse stehen im folgenden Prüfvermerk. Der erste Electron-Build konnte in der Sandbox keinen Paketmanager-Unterprozess erkennen; er wurde mit Freigabe außerhalb der Sandbox wiederholt. npm meldete bei der Installation vier Sicherheitsbefunde mit hohem Schweregrad; eine automatische Aktualisierung zur Behebung wurde nicht durchgeführt. Node meldet für die TypeScript-Transformation im Testlauf den experimentellen Status; vue-router weist auf ein nicht gesetztes `rootDir` hin.

### Vom Benutzer noch auszuführen: Oberfläche prüfen

Browser-Entwicklung starten (die konkrete Adresse bei Portkonflikten der Terminalausgabe entnehmen):

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run dev -- --port 9000
```

Browser: [Startseite](http://localhost:9000/#/). Deutsch/Englisch wechseln, die Beispielkomponente entfernen und erneut einblenden. In den Browser-Entwicklerwerkzeugen sind die JSON-Anfragen beim erneuten Einblenden sichtbar. Backend-Senden ist im Browser deaktiviert.

Electron starten:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run dev:electron
```

Im Electron-Fenster eine Nachricht eingeben und „Senden“ betätigen; Antworttext und Empfangszeit kontrollieren. Auch dort Sprache wechseln und Komponente ein-/ausblenden. Diese interaktive Prüfung ist noch offen; der Build ersetzt sie nicht. Die Build-Ausgabe ohne Installer liegt unter `dist/electron/`.

Grundlagen: [Quasar Electron](https://quasar.dev/quasar-cli-vite/developing-electron-apps/introduction/), [Vue I18n Lazy Loading](https://vue-i18n.intlify.dev/guide/advanced/lazy), [Tailwind mit Vite](https://tailwindcss.com/docs/installation/using-vite) und [Tailwind ohne Preflight](https://tailwindcss.com/docs/preflight).

### Abschließender Prüfvermerk

Erfolgreich ausgeführt: `npm run lint` (nach Freigabe außerhalb der Sandbox wegen `spawn EPERM`), `npm run lint:check`, `npm run typecheck`, `npm run test:i18n` (3/3), SPA-Build und Electron-Build ohne Paketierung. Die generierte Electron-CSS-Datei enthält die verwendeten Tailwind-Klassen. `git diff --check` meldet keine fehlerhaften Leerzeichen. Die interaktive Oberflächen- und IPC-Prüfung bleibt offen.

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run lint:check
npm run typecheck
npm run test:i18n
npm run build:electron *> electron-build-check.log
Get-Content electron-build-check.log -Tail 30
git diff --check
```

`electron-build-check.log` enthält das Build-Protokoll. Quasar hat für den Electron-Build zusätzlich `@electron/packager` in `src-electron/package.json` samt Lockdatei eingerichtet. Ausgeführter automatischer Installationsbefehl:

```powershell
Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh\src-electron'
npm install --save-dev @electron/packager@^20.0.0
```

Die Ausgabe des Electron-Builds liegt konkret unter `dist/electron/UnPackaged/`. Ein Installer wurde noch nicht erstellt.
