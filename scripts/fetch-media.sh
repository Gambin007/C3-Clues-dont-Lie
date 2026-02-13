cat > scripts/fetch-media.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail

TMP=".tmp_media"
REPO="https://github.com/Gambin007/Mac_Interface.git"
DEST="public/media"

echo "Cleaning..."
rm -rf "$TMP"
mkdir -p "$TMP"

echo "Downloading git-lfs (linux amd64)..."
cd "$TMP"
curl -L "https://github.com/git-lfs/git-lfs/releases/download/v3.5.1/git-lfs-linux-amd64-v3.5.1.tar.gz" -o lfs.tar.gz
tar -xzf lfs.tar.gz
export PATH="$PWD/git-lfs-3.5.1:$PATH"

echo "git-lfs version:"
git-lfs version

echo "Cloning Mac_Interface..."
git clone --depth 1 "$REPO" repo
cd repo

echo "Pulling LFS objects..."
git lfs install --local
git lfs pull

cd ../..

SRC="$TMP/repo/public/media"
if [ ! -d "$SRC" ]; then
  echo "ERROR: Source folder not found: $SRC"
  exit 1
fi

echo "Copying media into $DEST ..."
rm -rf "$DEST"
mkdir -p public
cp -R "$SRC" "$DEST"

echo "Sanity check sizes:"
ls -lh "$DEST/macwallpaper.jpg" || true
SH

chmod +x scripts/fetch-media.sh
