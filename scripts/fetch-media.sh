mkdir -p scripts
cat > scripts/fetch-media.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail

REPO_ZIP="https://codeload.github.com/Gambin007/Mac_Interface/zip/refs/heads/main"
TMP_DIR=".tmp_media"
ZIP_FILE="$TMP_DIR/repo.zip"

echo "Downloading media zip..."
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
curl -L "$REPO_ZIP" -o "$ZIP_FILE"

echo "Unzipping..."
unzip -q "$ZIP_FILE" -d "$TMP_DIR"

SRC="$TMP_DIR/Mac_Interface-main/public/media"
DEST="public/media"

if [ ! -d "$SRC" ]; then
  echo "ERROR: Source folder not found: $SRC"
  exit 1
fi

echo "Copying media into $DEST ..."
rm -rf "$DEST"
mkdir -p "public"
cp -R "$SRC" "$DEST"

echo "Done. Listing a few files:"
ls -la "$DEST" | head
SH

chmod +x scripts/fetch-media.sh
