# Cloudflare R2 Media Assets Setup

## Overview
Alle Media-Assets werden von Cloudflare R2 ausgeliefert statt aus dem lokalen `public/` Ordner.

**R2 Base URL:** `https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev`

## Implementierung

### Next.js Rewrites
Die Rewrite-Regeln in `next.config.js` leiten alle Requests transparent zu R2 weiter:

- `/:path*` → `https://pub-...r2.dev/:path*`
- `/bela/:path*` → `https://pub-...r2.dev/bela/:path*`

### Code-Änderungen
**Keine Code-Änderungen nötig!** Alle Pfade bleiben gleich:
- `src="/media/movie/part1.mp4"` funktioniert weiterhin
- `src="/media/photos/arbeitsplatz/arbeitsplatz1.png"` funktioniert weiterhin
- `/bela/index.html` wird automatisch zu R2 weitergeleitet

### Build-Prozess
- `vercel-build` führt nur noch `next build` aus
- Kein Git LFS Fetch mehr nötig
- Schnellere Builds auf Vercel

## Lokale Entwicklung

### Wichtig: `public/media` Verhalten
**Next.js serviert lokale Dateien VOR Rewrites!**

Das bedeutet:
- Wenn `public/media/macwallpaper.jpg` existiert → wird lokal serviert
- Wenn `public/media/macwallpaper.jpg` NICHT existiert → Rewrite zu R2

### Empfehlung für lokale Entwicklung:
1. **Option A (Empfohlen):** `public/media` komplett löschen
   - Alle Assets kommen dann von R2
   - Konsistent mit Produktion
   - Keine lokalen Dateien mehr nötig

2. **Option B:** `public/media` mit Placeholder-Dateien behalten
   - Nur kleine Placeholder-Dateien (z.B. 1KB)
   - Für schnelles lokales Testing
   - Produktion verwendet trotzdem R2

3. **Option C:** `public/media` behalten wie es ist
   - Lokale Entwicklung verwendet lokale Dateien
   - Produktion verwendet R2 (wenn Dateien nicht im Repo sind)

## Testing

### R2 Assets direkt testen (curl)

```bash
# Test Wallpaper
curl -I "https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev/media/macwallpaper.jpg"
# Erwartet: 200 OK, Content-Length sollte groß sein (> 10KB)

# Test Photo
curl -I "https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev/media/photos/arbeitsplatz/arbeitsplatz1.png"
# Erwartet: 200 OK, Content-Length sollte groß sein

# Test Video
curl -I "https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev/media/movie/part1.mp4"
# Erwartet: 200 OK, Content-Length sollte sehr groß sein (> 1MB)
```

### Vercel Routes testen (nach Deployment)

```bash
# Test über Vercel Domain (Rewrites sollten funktionieren)
curl -I "https://your-domain.vercel.app/media/macwallpaper.jpg"
# Erwartet: 200 OK, Content-Length sollte groß sein (> 10KB)
# Response sollte von R2 kommen (prüfe Header)

curl -I "https://your-domain.vercel.app/media/photos/arbeitsplatz/arbeitsplatz1.png"
# Erwartet: 200 OK, Content-Length sollte groß sein

curl -I "https://your-domain.vercel.app/media/movie/part1.mp4"
# Erwartet: 200 OK, Content-Length sollte sehr groß sein (> 1MB)
```

### Browser DevTools

1. Öffne die App auf Vercel
2. Öffne DevTools → Network Tab
3. Lade eine Seite mit Media-Assets
4. Prüfe Requests zu `/media/...`:
   - Status sollte 200 sein
   - Response Headers sollten von R2 kommen
   - Content-Length sollte groß sein (nicht 133 bytes = Git LFS Pointer)

## Troubleshooting

**Problem:** Assets werden nicht geladen (404)

**Lösungen:**
1. Prüfe, ob Dateien auf R2 existieren (direkter R2-URL-Test)
2. Prüfe Rewrite-Regeln in `next.config.js`
3. Prüfe Vercel Build Logs
4. Prüfe, ob lokale `public/media` Dateien den Rewrite überschreiben

**Problem:** Assets werden lokal geladen statt von R2

**Ursache:** Next.js serviert lokale `public/` Dateien VOR Rewrites

**Lösung:** 
- Entferne `public/media` Dateien ODER
- Stelle sicher, dass Dateien nicht im Repo sind (nur auf R2)

**Problem:** Content-Length ist nur 133 bytes

**Ursache:** Git LFS Pointer-Datei wurde nicht konvertiert

**Lösung:** Stelle sicher, dass auf R2 die echten Dateien liegen, nicht Pointer-Dateien

## Migration Checklist

- [x] Rewrite-Regeln in `next.config.js` hinzugefügt
- [x] `vercel-build` vereinfacht (kein Git LFS Fetch mehr)
- [x] Dokumentation erstellt
- [ ] R2 Bucket mit allen Media-Dateien befüllt
- [ ] Test-Deployment auf Vercel durchgeführt
- [ ] Alle Media-Assets funktionieren über Rewrites

## Wichtige Hinweise

1. **Lokale Dateien überschreiben Rewrites:** Wenn `public/media/file.jpg` existiert, wird es lokal serviert, auch wenn Rewrite-Regel existiert.

2. **R2 Bucket muss befüllt sein:** Alle Media-Dateien müssen auf R2 hochgeladen sein mit identischer Ordnerstruktur.

3. **Keine Code-Änderungen:** Alle Pfade im Code bleiben gleich (`/media/...`), Rewrites handhaben die Umleitung transparent.

4. **Bela Assets:** Auch Bela-Assets (`/bela/...`) werden über Rewrites zu R2 weitergeleitet.
