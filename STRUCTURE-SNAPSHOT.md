# Struktur vor der Umorganisation

## Vorgaben für die anschließende Anpassung

Projektinterne Imports mit vollständigem Alias-Pfad ab `@` schreiben.
Relative Projektimporte vermeiden, auch in Electron und Tests. Alias-Auflösung
in Quasar/Vite, TypeScript und Node-Tests gemeinsam prüfen. `@/` zeigt derzeit
auf `src/`; für Dateien außerhalb von `src/` müssen passende `@`-Aliase eingerichtet werden.

## Aktuelle Verknüpfungen

- `src/App.vue` → Router-View; `src/router/index.ts` → automatisch generierte Seitenrouten.
- `src/pages/index.vue` → Layout mit `src/components/EssentialLink.vue`.
- `src/pages/index/(index).vue` → Startseite mit `LanguageDataExample.vue` und SVG-Logo.
- `src/pages/index/second.vue` → zweite Seite; `src/pages/[...path].vue` → Fehlerseite.
- `quasar.config.ts`: Boot `i18n`, CSS `tailwind.css` und `app.scss`, filename-based routing.
- `src/boot/i18n.ts` → `src/i18n/lang-data.ts`; stellt Dienst per Injection bereit.
- `src/composables/useLangData.ts` → Dienst und globales VueI18n.
- `LanguageDataExample.vue` → Composable; JSON unter `public/locales/{de,en,xx}/components/eins.json`.
- `src/core/app/bridge.ts` → `window.appBridge.execute` → Preload → IPC `execute`.
- `src-electron/electron-preload.ts` → Bridge-Typ und Quasar-Runtime.
- `src-electron/electron-main.ts` → `src-electron/execute.ts`; registriert `app.info`.
- Electron lädt die gebaute Datei `electron-preload.cjs`; deren Laufzeitpfad muss erhalten bleiben.
- `tests/bridge.test.mjs` → Frontend-Bridge und Backend-Dispatcher.
- `tests/lang-data.test.mjs` → Dienst und dynamisch transpiliertes Composable.
- `tests/electron-bridge-smoke.cjs` → Backend-Quelltext und gebauter Electron-Preload.
- `src/stores/index.ts` → Pinia; `example-store.ts` → Beispiel-Counter.
- PWA: `src-pwa/register-sw.ts`, `src-pwa/sw/custom-sw.ts`, Manifest und Icons.

## Prüfung nach der Umorganisation

Imports, dynamische Test-Imports, Assets, Boot-/CSS-Konfiguration, Routing,
Electron-Main/Preload und öffentliche JSON-URLs an die tatsächlichen neuen Orte anpassen.
Generierte Dateien unter `.quasar/`, `dist/` und `typed-router.d.ts` regenerieren.
Validierung: `npm run typecheck`, `npm run lint:check`, `npm run test:i18n`,
`npm run test:bridge`, `npm run build`, `npx quasar build -m electron --skip-pkg`;
anschließend Electron-IPC-Smoke-Test. Aktuell bekannte Formatabweichung:
`src-pwa/package.json`. Zum Aufnahmezeitpunkt ist nur `ACTIONS.md` geändert.

## Datei-Inventar mit SHA-256

Hashes helfen, verschobene Dateien wiederzuerkennen und fehlende Dateien festzustellen.
Die Pfade sind der Ist-Zustand vor den Änderungen des Benutzers.

| Datei                                        | SHA-256                                                          |
| -------------------------------------------- | ---------------------------------------------------------------- |
| AGENTS.md                                    | 561170A8F8D5D98C8C66EC24A99ECDFC084321A58B5CF75C1FFE2D9E3EB954E7 |
| env.d.ts                                     | 92EA0947708079D24A253AFAC568F1E19FEECD234ADEA99E9FC11C5118558F34 |
| index.html                                   | E078B609A63116A79E59D29DA665A602F0B7C9E5B2095E96EAD4EAEE9DFB9BEF |
| oxfmt.config.ts                              | E6C370A2EE803222033DFF5DFE717F8BBE26C2035ECD5E5FD41048F341F908ED |
| oxlint.config.ts                             | C076A0EA3FC85E4F871ED5FF3CDAC7C0BC9B8D4137AD1F1F58BF240B23496531 |
| package-lock.json                            | 392C859C197FFF845B0401BDE068948917F16708209F9E63C1F5CD93747BE833 |
| package.json                                 | 0C498AD88952C48A702452716CF074D0B03BC5FAD9B4FB3CFD8C0B5EAE03E7C9 |
| pnpm-workspace.yaml                          | 5F1D22B758FC50476B9059D6FB164F67C741C1026ED91CB784BC890C236527E2 |
| postcss.config.js                            | 5B18C4DC29387596EFF114D8295BE322AFA20FF8E891BCCE04BB7B6F9EEC45F4 |
| public/favicon.ico                           | D99709698FF895EE30E4D481CD68DA8F7CA4D5F68B017D17AA2A08F938EC71BB |
| public/icons/apple-icon-120x120.png          | 7185FBE24F33300CE0CBB9A7FF3F681E360A3E3C54C9809A960E4A2FB3C625E9 |
| public/icons/apple-icon-152x152.png          | 4F53D09B9972C095EF502E1C621877F677056A879A262952B2E1AE134E944CFE |
| public/icons/apple-icon-167x167.png          | FBBF6BD65E7D328F30E47E6F930D180FD3B8D8F651423588E7E51A959EE9FA76 |
| public/icons/apple-icon-180x180.png          | 40DCB91FD0649883F715E06E5A9DD79A06FA32BDF79AECE7D1D9ED040432C883 |
| public/icons/favicon-128x128.png             | CE61A0D27E9167938CE2083E1391DE1EE514B40D8A0F5C3602A7A04F449F6779 |
| public/icons/favicon-16x16.png               | DF29C1147263C1A50529C6550B6AC1B36EDBF36AFAE1D99CBDF173128E76FAC5 |
| public/icons/favicon-32x32.png               | 96119764EA8886370A0F29A66CACA8E26AD598A634E792CC0F918EF5E5B64239 |
| public/icons/favicon-96x96.png               | D0F6CFE58174D551DBC303FCCFBCFC8E396D434AB7E370B5C298F15A38F8EEB6 |
| public/icons/icon-128x128.png                | CE61A0D27E9167938CE2083E1391DE1EE514B40D8A0F5C3602A7A04F449F6779 |
| public/icons/icon-192x192.png                | DF8C18E54E8BAA6B0106E14FEB6060C7E7041CC5D401DE12FA18ED3D8FEE8D19 |
| public/icons/icon-256x256.png                | B6B6A99026B8CED1B9177AEE8E0C44B0168D81A555D006BB94E8A2CDC62C76A2 |
| public/icons/icon-384x384.png                | 717A8E738C5CCB58895870CFC1214599ECF7D387C139DE095343BB38F4BB9E07 |
| public/icons/icon-512x512.png                | 7A62BE88B71FB909AF35A53E10F4C3E5EF96209A3F50D09304A46BF74E8CB46B |
| public/icons/icon-maskable-512x512.png       | 18F5C661D1426ABB164F752FB72B9A8ED4B41F0839CA76498A6746231AAFBAA5 |
| public/icons/icon-monochrome-512x512.png     | CEEE356AF84C32CBE498A166F838A1C836B369630B98F079AA89A4696398CED3 |
| public/icons/safari-pinned-tab.svg           | BE59A7983918D1464F7F72CD2849A1AB016A2AC2C65E81F2783E4A526DE955A9 |
| public/locales/de/components/eins.json       | 5B067A70CDE28E9C07F16E2618DFF0139FCE9953A1D6EA85AB4B091F5B504276 |
| public/locales/en/components/eins.json       | B469F28D03DC6674223745150886EB9AC29FC0DB55AA1DCC9DB335344CB90510 |
| public/locales/xx/components/eins.json       | FEB8469C47426743C19A154C8F428894A38DD292C68ABCE4F9D7044BB777A38C |
| quasar.config.ts                             | 6F5EDDD64ADB0E7C42E417802A9713C730BF4FD2A40FD507C30F74AFBC292DBC |
| README.md                                    | 2683992B10F45A7C1C7AD1A8D2B60EF1138D99C5D062F459B40C8B325C42A53E |
| resume-session.ps1                           | EE259D375D39A4C9B9889241F01B45611007F6DD9028E3665F874EF8E1D2183E |
| src-electron/electron-assets/icons/icon.icns | D8CFC79253B93031878CB0A7F8CC6191FD90086E3639882E83C809D21C2C6CA5 |
| src-electron/electron-assets/icons/icon.ico  | 2D95359A1A639E7DBC8907CD3A52B372AE95635A00B97C89F7605FD03F0D338F |
| src-electron/electron-assets/icons/icon.png  | A936F8940A38CBF1C8B60840DF5FC9EF1D79B0AA3A918C7538D4057BB8CAEAE5 |
| src-electron/electron-main.ts                | 5F4CC97387F9FB4357629F479995E7B9E6229F30506B8C10F5A43AA5268A8D48 |
| src-electron/electron-preload.ts             | 713293CCF0067FAC49FD51663C55B2FD2F9956973CD0962DCD03AE53E6D14574 |
| src-electron/execute.ts                      | 6053FCA8247F3258C7DB96D6EF1343622582BD64AC2FD78985FE81E99A7760DC |
| src-electron/package-lock.json               | EE525DA07C152FA62DBA30A2F5586EEE69F6010F9765E5CE0F82D830C5FEB243 |
| src-electron/package.json                    | 92578586238639B8119BD3365284897FEFBCD046FEC38D9162C1B39C2F62D864 |
| src-electron/pnpm-workspace.yaml             | 93E57834808582C36006902199E038A017106B92DC6806067CEF6031A0FACBA0 |
| src-pwa/manifest.json                        | 858769A9A4C09FFF662F978AF5504252470002A0B05ED65CBCBA03A3B9DA96F3 |
| src-pwa/package-lock.json                    | CDDBA5004E11392173854B9BCB9DD784F85E06FBD3FB119088857CFA63B58F60 |
| src-pwa/package.json                         | 419AEF6706ED73E8D9BAA3725E2DE61DDDC91854A2B0CF41A6D5765C0BAE7B56 |
| src-pwa/register-sw.ts                       | DC8C740637A955E23F5AB3AF7814AD8FBC640FE46B54583AA92FE1355B1802FC |
| src-pwa/sw/custom-sw.ts                      | 6256B9E989389A3D214FB4F69BC78C4B091073B5F723022BF563B90E7D00C74B |
| src-pwa/sw/tsconfig.json                     | D4FD80D890188BC32FB93C8CBBF5696953C286B971DA85AF9AF9732E6DBEEC6B |
| src/App.vue                                  | 656E64166110B11CC4DA47778D5605A4A495F10D30335172102F105D4B8B33A2 |
| src/assets/quasar-logo-vertical.svg          | 55E9C85406AEADB0AE3898AB1F458C0F62431DA7D9241DAB59AB3DD3A2A2189C |
| src/boot/i18n.ts                             | 70BBBF338CFCDF8E6F5DCE2E15FB3BCF68EE08370AF2986A42ABE8A6D61568D9 |
| src/components/EssentialLink.vue             | 3964E27020D3B4CA5DFC66878916BAC99CE4A9F33F3C302143C869BEE0C3B32B |
| src/components/LanguageDataExample.vue       | A739A5F09C96D8C733836BFE1D4D26E9787A74A16AFFCBFCB21FE340148FE299 |
| src/composables/useLangData.ts               | 640DD7495BAD8AD714B7DEE1634365CDDDF4E10875E65EA609D4527BC3CB50FD |
| src/core/app/bridge.ts                       | 3C2A37D009BCD0E16EDF242D1375B10A8D31D044342A7CFF9EA9F2D927880638 |
| src/css/app.scss                             | 43D85898C49A3C5890258A9F6177B6399E82FAFCE48104E4DF2C8A439DE9D6F7 |
| src/css/quasar.variables.scss                | 7C6C256975FFFC4E0D1631B098E2E41F2523983B150250ABB4BA25974FE7760D |
| src/css/tailwind.css                         | 3345293BD21530B7115232FABE0E5221A6828B2FE2DA9BD840AD92B0E0B3E364 |
| src/i18n/lang-data.ts                        | 3DCD9D897AA567840DDCBA511485627A7C4F8DBB617A68091E2C5668D9469DCB |
| src/pages/[...path].vue                      | 3971DC95274FA5426B295FB248D0076E15A477C029181E716F44B3CCE638F0CD |
| src/pages/index.vue                          | 4A57B5DD04FFDE0CEE484052956CA1004F48DBC1F3BDBFB0DB41D9FA28E51E21 |
| src/pages/index/(index).vue                  | 769117DC39DD851F6EAD5EE1C1E854DAD8C925F19CC5EA7BF8A6300192347CF5 |
| src/pages/index/second.vue                   | A02427BBEAE747BC575A3EAB19442607B150FDB02E1BCAE0993F0B3F0490EB83 |
| src/router/index.ts                          | E1856CFED3579E1B3216940DFC6E4FD02AA13ECBDA3DCE90CD44F2E43EE08D94 |
| src/router/typed-router.d.ts                 | FA2E8175C8E63C6956CC4CB9345F171D548AF755BB0F6AC73AD25CD9BDF426BA |
| src/stores/example-store.ts                  | 17D1A44EA214E96A30880C3A9547593181526305DB9E06F1C94BD5EAB147F654 |
| src/stores/index.ts                          | 2A92E195A50F78AFAB42D5C7BC067C0E86347DE56DF6824643EFCD1A3CF59163 |
| tests/bridge.test.mjs                        | DA8D1C587ADC824D3DD5E84B67DD1AFDAA9A3E74CD8111C975548401189D96F2 |
| tests/electron-bridge-smoke.cjs              | 6017A16E10371875491B69BB0B3BC2ADA61C4BEC08234F9FC7F46E66CD99D33E |
| tests/lang-data.test.mjs                     | 34996FB4C9574048F97E7F6A2472A6BFF1D36B40EB0199095135A67F54CFF8C6 |
| tsconfig.json                                | 1B44C2994B197D7067FDEE4BAD6942832B6EDE9DA741A3F92381F32BC49D0550 |
