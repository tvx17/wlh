# Projektinitialisierung

Du hast hier eine grundlegende Installation des Quasar-Frameworks vor dir. Es ist schon die Version, welche dateibasiertes Routing nutzt. Folgendes soll hier gemacht werden.

## Frontend und Electron-Backend

Grundlegende Erstellung der Übergabe von Daten im Frontend zum Electron-Backend.

## Tailwind CSS

Außerdem soll Tailwind CSS mit eingebunden werden.

## Übersetzungen mit i18n

Die Übersetzung mit i18n soll so geschehen, dass man dynamisch, zu jeder Zeit, Übersetzungen laden kann. Dabei soll dieses auf folgenden Ebenen möglich sein:

- App
- Komponenten
- Elemente

Zum Start soll eine Sprache geladen werden. Damit nicht zu viele Daten der Sprache im Speicher sind, möchte ich, dass auch Sprachdaten entladen werden können.

### Namensräume

Vielleicht ist es praktisch, wenn man Sprachdaten in Namensräumen hat, zum Beispiel für die Komponente Hallo: `co.hallo`, wobei `co` für Component steht.

### Sprachdateien und Ordnerstruktur

Die Sprachdateien werden als JSON vorliegen. Sie werden pro Sprache organisiert und dann zum Beispiel nach:

- Seite
- Layout
- Komponente
- Element

Beispiel in der Ordnerstruktur:

```text
public/i18n/de-de/components/hallo.json
```

Die Benennung der Sprache (`de-de`) orientiert sich an der Syntax von `vue-i18n`.

## Weitere Klärungen

Stelle Fragen für weitere Klärungen.
