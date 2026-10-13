# Projektvergleich – 2026-10-13

**Historischer Stand vor dem Oberflächentausch:** Folio wurde anschließend von Quasar nach WLH übertragen, die einfache Demo von WLH nach Quasar. Beide verwenden jetzt die GUI/Core-Struktur und denselben Sprachdienst mit Electron-Dateitransport. QuasarTailwindDynamicLanguage wurde vom Benutzer lokal gelöscht. Die folgenden Vergleichsergebnisse beschreiben den vorherigen Stand; die aktuelle Migration steht in `AENDERUNGEN.md`.

Verglichen wurden die lokalen Arbeitsstände:

- **Template:** `C:\Entwicklung\Projekte\Boilerplates\QuasarTailwindDynamicLanguage`
- **Quasar/Folio:** `C:\Entwicklung\Projekte\Boilerplates\Quasar`
- **WLH:** `C:\Entwicklung\Projekte\WLH\vue\wlh`

Grundlage sind Quellcode, Paketmanifeste, Lockdateien, Konfiguration und vorhandene Tests. Generierte Ausgaben und `node_modules` wurden nicht als Anwendungscode verglichen. Es wurden keine Builds, Tests oder interaktiven Oberflächenprüfungen ausgeführt. Vorhandene Build-Verzeichnisse belegen nicht die Funktionsfähigkeit des aktuellen Quellstands.

## Ergebnis

Alle drei Projekte teilen dieselbe technische Basis. WLH und Template sind im Aufbau sehr ähnlich; ihre Übersetzungsdienste und Electron-Erweiterungen unterscheiden sich jedoch wesentlich. Quasar enthält inzwischen die Schreibanwendung **Folio** und ist damit deutlich umfangreicher als ein neutrales Boilerplate. Ein bloßes Kopieren der Dateien zwischen den Projekten wäre wegen unterschiedlicher Pfade und APIs keine verlässliche Zusammenführung.

| Merkmal               | Template                                                 | Quasar/Folio                                                         | WLH                                                  |
| --------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| Oberfläche            | Quasar-Beispielseiten                                    | Login-Demo, Dashboard, Projekte, Bücher, Figuren, Orte, Szeneneditor | Sprachwechsel, einblendbare Komponente, Backend-Echo |
| Aufbau                | Klassische `src/pages`, `components`, `stores`, `router` | Trennung in `src/gui` und `src/core`                                 | Klassisch, zusätzlich `composables` und `shared`     |
| Routing               | Dateibasiert, Hash                                       | Dateibasiert aus `src/gui/pages`, Hash, Session-Guard                | Dateibasiert, Hash                                   |
| Tailwind              | Vite-Plugin, `tw:`-Präfix, ohne Preflight                | Ebenso, Styles unter `src/gui/css`                                   | Ebenso                                               |
| Übersetzungsquelle    | `src/i18n/locales`                                       | `public/locales`                                                     | `public/i18n`                                        |
| Ladeweg               | Dynamische Imports; vorkompilierte JS-Chunks             | JSON per `fetch`                                                     | JSON per `fetch`, in Electron per IPC/Dateizugriff   |
| Startsprache          | `en-US`                                                  | Gespeicherte Folio-Sprache, sonst `de`                               | `de-de`                                              |
| Fallback              | Fehlende Datei wird aus `en-US` geladen                  | Kein Sprachfallback                                                  | Kein Sprachfallback                                  |
| Entladen              | Explizit und global                                      | Referenzen pro Verbraucher, automatische Freigabe                    | Referenzzähler, automatische Freigabe im Composable  |
| Electron-API          | Nur Quasar-Runtime im Preload                            | `execute(command, payload?)`, registrierte Befehle                   | Typisierte Methoden `echo` und `loadTranslation`     |
| PWA                   | Grundgerüst vorhanden                                    | Grundgerüst vorhanden                                                | Grundgerüst vorhanden                                |
| Anwendungsspeicherung | Beispiel-Pinia-Store                                     | Entwürfe/Präferenzen in localStorage, Demo-Session in sessionStorage | Beispiel-Pinia-Store                                 |
| Vorhandene Tests      | 13 Loader-Testfälle                                      | 5 Sprachdienst- und 3 Bridge-Testfälle, zwei Smoke-Skripte           | 3 Sprachdienst-Testfälle                             |

## Abhängigkeiten und Konfiguration

Die sechs direkten Laufzeitabhängigkeiten und ihre Versionsbereiche sind in allen drei `package.json` identisch: Quasar, Quasar Extras, Vue, Vue Router, Vue I18n und Pinia. Auch die meisten Entwicklungsabhängigkeiten stimmen überein. Template deklariert zusätzlich `sass-embedded` direkt; bei Quasar und WLH ist es in der Lockdatei enthalten.

Ausgewählte tatsächlich in den Root-Lockdateien festgeschriebene Versionen:

| Paket            | Template | Quasar/Folio | WLH     |
| ---------------- | -------- | ------------ | ------- |
| quasar           | 2.34.0   | 2.35.0       | 2.35.0  |
| @quasar/app-vite | 3.10.1   | 3.10.2       | 3.10.2  |
| vue              | 3.5.43   | 3.5.43       | 3.5.43  |
| vue-router       | 5.3.1    | 5.4.0        | 5.4.0   |
| vue-i18n         | 11.4.12  | 11.4.13      | 11.4.13 |
| tailwindcss      | 4.3.3    | 4.3.3        | 4.3.3   |
| typescript       | 6.0.3    | 6.0.3        | 6.0.3   |

Diese Angaben beschreiben den lokalen Lockstand, nicht die neuesten verfügbaren Releases. Electron ist im jeweiligen Unterprojekt deklariert: Template `^44.5.1`, Quasar und WLH `^44.7.0`. Die beiden letzteren deklarieren außerdem `@electron/packager` mit `^20.3.0`.

`tsconfig.json` und `postcss.config.js` sind in allen drei Projekten bytegleich. Template und WLH haben außerdem bytegleiche Router-, Oxlint- und Oxfmt-Konfigurationen. Ihre `quasar.config.ts` unterscheiden sich nur bei drei Punkten: WLH aktiviert `runtimeOnly: false`, verwendet einen anderen i18n-Include-Pfad und setzt `appId: "wlh"` statt `"template"`.

Quasar/Folio passt dagegen Router, Store, Routengenerierung und CSS-Einstiegspunkte an die GUI/Core-Struktur an und ergänzt die Aliase `@electron` und `@root`. Die CSS-Reihenfolge ist dort Tailwind vor App-Styles; bei Template und WLH ist sie umgekehrt. Das kann bei konkurrierenden CSS-Regeln relevant sein.

## Übersetzungssysteme: wesentliche Unterschiede

**Template:** `loadTranslations`, `unloadTranslations` und `setLocale` arbeiten mit Dateipfaden als Namensräumen. Vite kennt die Dateien beim Build; neue Sprachdateien benötigen einen erneuten Build. Entladen entfernt Vue-I18n-Nachrichten und Loader-Referenzen, nicht den JavaScript-Modulcache des Browsers. Es gibt keinen automatischen Besitznachweis pro Komponente: Eine Komponente kann durch globales Entladen eine andere beeinflussen. Die Startseite lädt selbst keine Sprachressource.

**Quasar/Folio:** `useLangData` verwendet getrennte Parameter für Datei, Verzeichnis und Namensraum. Namensräume sind einzelne Bezeichner ohne Punkte; Sprachcodes wie `de`, `en` und `xx` sind möglich. Jeder Verbraucher hält eigene Referenzen, einschließlich noch laufender Ladevorgänge. Freigabe und Sprachwechsel sind im vorhandenen Testcode breiter abgedeckt als bei WLH. Der aktuelle Boot-Code startet standardmäßig mit `de`; die README nennt im generischen Sprachdienstabschnitt noch `en` und ist an dieser Stelle veraltet.

**WLH:** `useTranslationResource(namespace, path)` unterstützt Punkt-Namensräume wie `co.hallo`. Überlappende Namensräume werden abgewiesen. Die Sprach-/Pfadprüfung akzeptiert nur bestimmte kleingeschriebene regionale Codes, beispielsweise `de-de` und `en-us`; `de`, `xx` oder `en-US` sind nicht direkt kompatibel. Beim Boot wird die Ressource `app` geladen. Ein Sprachwechsel lädt alle aktiven Ressourcen und leert anschließend die alte Sprache; fehlgeschlagene Ladevorgänge lassen den bisherigen Sprachzustand bestehen.

Quasar und WLH laden Roh-JSON zur Laufzeit und aktivieren dafür die Vue-I18n-Laufzeitkompilierung. Template lässt seine JSON-Dateien beim Build vorkompilieren. Diese Wege sollten bei einer Vereinheitlichung bewusst gewählt werden.

## Electron und praktische Grenzen

WLH hat bereits einen eigenen Dateiladeweg für Übersetzungen in der ausgelieferten Electron-App. Quasar/Folio nutzt für Übersetzungen weiterhin den Browser-Fetcher mit `BASE_URL`; ein entsprechender IPC-Dateiladeweg ist dort nicht eingerichtet. **Aus dem Code abgeleiteter Prüfbedarf:** Das Laden der Sprachdateien sollte insbesondere im ausgelieferten Electron-Build unter `file://` überprüft werden. Ein erfolgreicher Build oder der Bridge-Smoke-Test allein prüft diese Funktion nicht.

Quasar/Folio hat den flexibleren Backend-Dispatcher, allerdings mit `Promise<unknown>` als Rückgabe. WLH bietet für das Echo eine konkrete Antwortstruktur mit Text und Empfangszeit. Beide aktivieren Context Isolation und Sandboxing und deaktivieren Renderer-Node-Integration. Quasar prüft zusätzlich die erwartete Dokument-URL beim IPC-Aufruf; WLH prüft Fensterzugehörigkeit und Hauptframe.

Folio verwendet eine lokale Demo-Anmeldung und Mock-Daten, keine echte Backend-Authentifizierung. Fachliche Oberfläche und lokale Speicherung sind vorhanden; daraus folgt noch keine fertige Serveranbindung. WLH enthält aktuell die technische Demonstration, noch keine vergleichbare fachliche Anwendung.

## Konsequenzen für eine mögliche Übernahme

- Für WLH sind Quasars GUI/Core-Aufteilung, der Backend-Dispatcher und die zusätzlichen Lifecycle-/Bridge-Tests sinnvolle Übernahmekandidaten. Dafür müssen Importpfade, Quasar-Konfiguration und API-Aufrufe gemeinsam angepasst werden.
- WLHs Electron-Dateiladeweg sollte bei einer Übernahme des Quasar-Sprachdienstes erhalten oder dort ergänzt werden.
- Sprachcodes, Ressourcenpfade und Namensraumregeln müssen vereinheitlicht werden; die vorhandenen Sprachdateien lassen sich nicht unverändert zwischen allen drei Loadern austauschen.
- Template ist die schlankere Basis für Anwendungen mit beim Build bekannten Übersetzungen. Folio bringt bereits fachliche Oberfläche mit und erfordert für ein neutrales Grundgerüst eine gezielte Bereinigung.

## Optionale lokale Prüfung durch den Benutzer

Diese Befehle wurden im Rahmen dieses Vergleichs **nicht ausgeführt**. Sie prüfen jeweils die vorhandenen Tests, Typen und den SPA-Build:

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\QuasarTailwindDynamicLanguage'
npm run test:i18n
npm run typecheck
npm run build

Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npm run test:i18n
npm run test:bridge
npm run typecheck
npm run build

Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run test:i18n
npm run typecheck
npm run build
```

Für einen direkten visuellen Vergleich die Projekte nacheinander starten und den jeweiligen Server vor dem nächsten Start beenden:

```powershell
Set-Location 'C:\Entwicklung\Projekte\Boilerplates\QuasarTailwindDynamicLanguage'
npm run dev -- --port 9000

Set-Location 'C:\Entwicklung\Projekte\Boilerplates\Quasar'
npm run dev -- --port 9000

Set-Location 'C:\Entwicklung\Projekte\WLH\vue\wlh'
npm run dev -- --port 9000
```

Browser: [Startseite](http://localhost:9000/#/). Falls der Port belegt ist, die tatsächlich ausgegebene Adresse verwenden. Die Backend-Brücken benötigen Electron; ein Browservergleich prüft sie nicht.
