# Gallery Ordner

Legen Sie hier Bilder ab, die im Chat-Galerie-Picker verfügbar sein sollen.

## Bilder hinzufügen

1. Kopieren Sie das Bild in diesen Ordner (`files/gallery/`)
2. Öffnen Sie `content/gallery.json`
3. Fügen Sie einen neuen Eintrag zum `images` Array hinzu:

```json
{
  "filename": "mein-bild.jpg",
  "label": "Mein Bild"
}
```

## Spezielle Antworten für Bilder

Sie können spezielle automatische Antworten definieren, die gesendet werden, wenn ein bestimmtes Bild an einen bestimmten Kontakt geschickt wird:

```json
{
  "filename": "beweis-foto.jpg",
  "label": "Beweis",
  "specialReplies": {
    "contact-1": "Das isch interessant! Wo hesch du das gfunde?",
    "contact-3": "Dieses Bild kenne ich bereits."
  }
}
```

- Der Key (z.B. `"contact-1"`) ist die Kontakt-ID aus `chat.json`
- Der Value ist die automatische Antwort, die dieser Kontakt sendet

Wenn keine `specialReplies` definiert sind, wird die normale Auto-Antwort des Kontakts verwendet (falls vorhanden).

## Beispiel gallery.json

```json
{
  "images": [
    {
      "filename": "foto1.jpg",
      "label": "Foto 1"
    },
    {
      "filename": "screenshot.png",
      "label": "Screenshot",
      "specialReplies": {
        "contact-1": "Was zeigt dieser Screenshot?"
      }
    }
  ]
}
```

## Unterstützte Formate

- JPG/JPEG
- PNG
- GIF
- WebP
