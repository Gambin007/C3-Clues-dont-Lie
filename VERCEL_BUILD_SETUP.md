# Vercel Build Setup für Git LFS

## Problem
Auf Vercel werden Git LFS Dateien (z.B. `/media/macwallpaper.jpg`) nur als Pointer-Dateien (133 bytes) bereitgestellt, da Vercel standardmäßig kein Git LFS unterstützt.

## Lösung
Das Projekt verwendet ein `vercel-build` Script, das während des Builds:
1. Git LFS binary herunterlädt
2. Das Mac_Interface Repository klont
3. Git LFS installiert und LFS-Objekte pullt
4. Media-Dateien nach `public/media` kopiert

## Vercel Settings

### Build Command überschreiben

**Wichtig:** Stelle sicher, dass in den Vercel Settings der Build Command NICHT überschrieben ist, damit das `vercel-build` Script aus `package.json` verwendet wird.

1. Gehe zu: **Vercel Dashboard** → **Dein Projekt** → **Settings** → **General** → **Build & Development Settings**

2. Prüfe folgende Einstellungen:
   - **Build Command**: Sollte leer sein ODER `npm run vercel-build` sein
   - **Output Directory**: Sollte leer sein (Next.js verwendet `.next` automatisch)
   - **Install Command**: Sollte leer sein ODER `npm install` sein

3. **Falls Build Command überschrieben ist:**
   - Entferne die Überschreibung ODER
   - Setze es auf: `npm run vercel-build`

### Environment Variables

Keine speziellen Environment Variables erforderlich für Git LFS.

### Build Logs prüfen

Nach dem Build sollten in den Logs erscheinen:
```
=== Starting Git LFS media fetch ===
Downloading git-lfs (linux amd64) v3.5.1...
git-lfs version: git-lfs/3.5.1
Cloning Mac_Interface repository...
Pulling LFS objects...
✓ macwallpaper.jpg size: [große Zahl] bytes (looks good)
=== Git LFS media fetch completed successfully ===
```

### Troubleshooting

**Problem:** macwallpaper.jpg ist immer noch nur 133 bytes

**Lösungen:**
1. Prüfe Build Logs auf Fehler
2. Stelle sicher, dass `vercel-build` Script verwendet wird
3. Prüfe, ob Build Command in Vercel Settings überschrieben ist
4. Prüfe, ob das Repository öffentlich zugänglich ist (für Clone)

**Problem:** Build schlägt fehl mit "git-lfs not found"

**Lösung:** Das Script lädt Git LFS automatisch herunter. Falls es fehlschlägt, prüfe die Download-URL im Script.

## Lokale Entwicklung

Für lokale Entwicklung:
```bash
npm run dev
```

Das `vercel-build` Script wird nur auf Vercel ausgeführt. Für lokale Entwicklung müssen Git LFS Dateien bereits vorhanden sein oder manuell gepullt werden.
