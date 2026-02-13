#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# Config
# -----------------------------
TMP=".tmp_media"
REPO_MAC="https://github.com/Gambin007/Mac_Interface.git"
REPO_C3="Gambin007/C3-Clues-dont-Lie"
DEST="public/media"
GIT_LFS_VERSION="v3.5.1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export GIT_TERMINAL_PROMPT=0

echo "=== Git LFS Media Fetch (Vercel-safe) ==="
echo "Project root: $PROJECT_ROOT"

# -----------------------------
# Helpers
# -----------------------------
copy_dir_tar() {
  local src="$1"
  local dst="$2"
  rm -rf "$dst"
  mkdir -p "$dst"
  (cd "$src" && tar -cf - .) | (cd "$dst" && tar -xf -)
}

is_lfs_pointer() {
  local f="$1"
  [ -f "$f" ] || return 1
  head -n 1 "$f" 2>/dev/null | grep -q "version https://git-lfs.github.com/spec/v1"
}

stat_size() {
  local f="$1"
  stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null || echo "0"
}

# -----------------------------
# Prepare tmp
# -----------------------------
rm -rf "$PROJECT_ROOT/$TMP"
mkdir -p "$PROJECT_ROOT/$TMP"
cd "$PROJECT_ROOT/$TMP"

# -----------------------------
# Install git-lfs locally (no apt / no rsync)
# -----------------------------
echo "Downloading git-lfs (linux amd64) $GIT_LFS_VERSION..."
GIT_LFS_URL="https://github.com/git-lfs/git-lfs/releases/download/${GIT_LFS_VERSION}/git-lfs-linux-amd64-${GIT_LFS_VERSION}.tar.gz"
curl -sSL "$GIT_LFS_URL" -o lfs.tar.gz
tar -xzf lfs.tar.gz
export PATH="$PWD/git-lfs-${GIT_LFS_VERSION}:$PATH"

echo "git-lfs version:"
git-lfs version

# -----------------------------
# 1) Mac_Interface (PUBLIC) -> photos/images/audio + wallpaper
# -----------------------------
echo "Cloning Mac_Interface (public, no token)..."
git clone --depth 1 "$REPO_MAC" repo_mac
cd repo_mac
git lfs install --local >/dev/null
git lfs pull
cd "$PROJECT_ROOT/$TMP"

MAC_MEDIA_DIR="$PROJECT_ROOT/$TMP/repo_mac/public/media"
if [ ! -d "$MAC_MEDIA_DIR" ]; then
  echo "ERROR: Mac_Interface public/media not found at $MAC_MEDIA_DIR"
  exit 1
fi

mkdir -p "$PROJECT_ROOT/$DEST"

echo "Copying from Mac_Interface -> $DEST (photos/images/audio)..."
for folder in photos images audio; do
  if [ -d "$MAC_MEDIA_DIR/$folder" ]; then
    echo " - $folder"
    copy_dir_tar "$MAC_MEDIA_DIR/$folder" "$PROJECT_ROOT/$DEST/$folder"
  else
    echo " - NOTE: $folder not found in Mac_Interface, skipping"
  fi
done

echo "Copying wallpaper from Mac_Interface..."
WALLPAPER_FOUND="$(find "$PROJECT_ROOT/$TMP/repo_mac" -type f -iname "macwallpaper.*" | head -n 1 || true)"
if [ -z "$WALLPAPER_FOUND" ]; then
  echo "ERROR: macwallpaper not found in Mac_Interface repo"
  exit 1
fi
cp -f "$WALLPAPER_FOUND" "$PROJECT_ROOT/$DEST/macwallpaper.jpg"

# sanity wallpaper size
WALLPAPER_PATH="$PROJECT_ROOT/$DEST/macwallpaper.jpg"
WALLPAPER_SIZE="$(stat_size "$WALLPAPER_PATH")"
if [ "$WALLPAPER_SIZE" -lt $((10 * 1024)) ]; then
  echo "ERROR: macwallpaper.jpg too small (${WALLPAPER_SIZE} bytes)"
  exit 1
fi
echo "✓ macwallpaper.jpg size: ${WALLPAPER_SIZE} bytes"

# -----------------------------
# 2) C3 repo (NEEDS TOKEN) -> movie/videos/Team (LFS)
# -----------------------------
echo "Cloning C3 repo for LFS (movie/videos/Team)..."

if [ -z "${GH_TOKEN:-}" ]; then
  echo "ERROR: GH_TOKEN is not set. Add it in Vercel env vars."
  exit 1
fi

# IMPORTANT: token ONLY for this URL (no global git config rewrite)
C3_URL="https://x-access-token:${GH_TOKEN}@github.com/${REPO_C3}.git"

git clone --depth 1 "$C3_URL" repo_c3
cd repo_c3
git lfs install --local >/dev/null
git lfs pull
cd "$PROJECT_ROOT/$TMP"

C3_MEDIA_DIR="$PROJECT_ROOT/$TMP/repo_c3/public/media"
if [ ! -d "$C3_MEDIA_DIR" ]; then
  echo "ERROR: C3 public/media not found at $C3_MEDIA_DIR"
  exit 1
fi

echo "Copying from C3 -> $DEST (movie/videos/Team)..."
for folder in movie videos Team; do
  if [ -d "$C3_MEDIA_DIR/$folder" ]; then
    echo " - $folder"
    copy_dir_tar "$C3_MEDIA_DIR/$folder" "$PROJECT_ROOT/$DEST/$folder"
  else
    echo " - NOTE: $folder not found in C3, skipping"
  fi
done

# -----------------------------
# Final pointer check
# -----------------------------
echo "Checking for Git LFS pointer files in $DEST..."
POINTER_HITS=0

while IFS= read -r f; do
  if is_lfs_pointer "$f"; then
    POINTER_HITS=$((POINTER_HITS + 1))
    echo "  - POINTER: $f ($(stat_size "$f") bytes)"
  fi
done < <(find "$PROJECT_ROOT/$DEST" -type f \
  \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.mov" \) \
  -size -300c -print 2>/dev/null || true)

if [ "$POINTER_HITS" -gt 0 ]; then
  echo "ERROR: Found $POINTER_HITS Git LFS pointer file(s) in $DEST"
  exit 1
fi

echo "✓ No Git LFS pointer files found"

# Cleanup
cd "$PROJECT_ROOT"
rm -rf "$PROJECT_ROOT/$TMP"
echo "=== Git LFS media fetch completed successfully ==="
