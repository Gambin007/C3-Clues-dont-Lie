#!/usr/bin/env bash
set -euo pipefail

# ---------------------------
# Configuration
# ---------------------------
TMP=".tmp_media"
REPO_MAC="https://github.com/Gambin007/Mac_Interface.git"
REPO_C3="https://github.com/Gambin007/C3-Clues-dont-Lie.git"
DEST="public/media"
GIT_LFS_VERSION="v3.5.1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== Starting Git LFS media fetch ==="
echo "Project root: $PROJECT_ROOT"

# ---------------------------
# Cleanup temp
# ---------------------------
echo "Cleaning temporary directory..."
rm -rf "$PROJECT_ROOT/$TMP"
mkdir -p "$PROJECT_ROOT/$TMP"
cd "$PROJECT_ROOT/$TMP"

# ---------------------------
# Download + install git-lfs (portable)
# ---------------------------
echo "Downloading git-lfs (linux amd64) ${GIT_LFS_VERSION}..."
GIT_LFS_URL="https://github.com/git-lfs/git-lfs/releases/download/${GIT_LFS_VERSION}/git-lfs-linux-amd64-${GIT_LFS_VERSION}.tar.gz"
curl -L "$GIT_LFS_URL" -o lfs.tar.gz || { echo "ERROR: Failed to download git-lfs"; exit 1; }

echo "Extracting git-lfs..."
tar -xzf lfs.tar.gz || { echo "ERROR: Failed to extract git-lfs"; exit 1; }

export PATH="$PWD/git-lfs-${GIT_LFS_VERSION}:$PATH"

echo "Verifying git-lfs installation..."
command -v git-lfs >/dev/null || { echo "ERROR: git-lfs not found in PATH"; exit 1; }
echo "git-lfs version:"
git-lfs version || { echo "ERROR: git-lfs version check failed"; exit 1; }

# ---------------------------
# 1) MAC_INTERFACE: photos/images/audio + wallpaper
# ---------------------------
echo "Cloning Mac_Interface repository..."
git clone --depth 1 "$REPO_MAC" repo_mac || { echo "ERROR: Failed to clone Mac_Interface"; exit 1; }

cd repo_mac

echo "Installing git-lfs locally (Mac_Interface)..."
git lfs install --local || { echo "ERROR: Failed to install git-lfs locally (Mac_Interface)"; exit 1; }

echo "Pulling LFS objects (Mac_Interface)..."
git lfs pull || { echo "ERROR: Failed to pull LFS objects (Mac_Interface)"; exit 1; }

cd "$PROJECT_ROOT"

# Locate source media dir in Mac_Interface
echo "Finding source media directory (Mac_Interface)..."
SRC_MEDIA_DIR_MAC="$PROJECT_ROOT/$TMP/repo_mac/public/media"
if [ ! -d "$SRC_MEDIA_DIR_MAC" ]; then
  echo "ERROR: Mac_Interface public/media not found at $SRC_MEDIA_DIR_MAC"
  echo "Available directories:"
  find "$PROJECT_ROOT/$TMP/repo_mac" -maxdepth 4 -type d | head -50
  exit 1
fi
echo "Found media directory: $SRC_MEDIA_DIR_MAC"

# Copy only LFS-problematic folders from Mac_Interface (do NOT touch movies/videos)
echo "Copying ONLY folders (photos/images/audio) from Mac_Interface into $DEST..."
mkdir -p "$PROJECT_ROOT/$DEST"

for folder in photos images audio; do
  if [ -d "$SRC_MEDIA_DIR_MAC/$folder" ]; then
    echo " - Replacing $DEST/$folder from Mac_Interface"
    rm -rf "$PROJECT_ROOT/$DEST/$folder"
    mkdir -p "$PROJECT_ROOT/$DEST/$folder"
    (cd "$SRC_MEDIA_DIR_MAC/$folder" && tar -cf - .) | (cd "$PROJECT_ROOT/$DEST/$folder" && tar -xf -)
  else
    echo " - NOTE: $folder not found in Mac_Interface source, skipping"
  fi
done

# Wallpaper (single file)
echo "Searching for wallpaper (Mac_Interface)..."
WALLPAPER_FOUND="$(find "$PROJECT_ROOT/$TMP/repo_mac" -type f -iname "macwallpaper.*" | head -n 1 || true)"
if [ -n "${WALLPAPER_FOUND:-}" ]; then
  echo "Found wallpaper: $WALLPAPER_FOUND"
  cp -f "$WALLPAPER_FOUND" "$PROJECT_ROOT/$DEST/macwallpaper.jpg" || { echo "ERROR: Failed to copy wallpaper"; exit 1; }
  echo "Wallpaper copied to $PROJECT_ROOT/$DEST/macwallpaper.jpg"
else
  echo "WARNING: No wallpaper found matching macwallpaper.* in Mac_Interface"
fi

# ---------------------------
# 2) C3 repo: movie/videos/Team + trailer.mp4  (LFS)
# ---------------------------
echo "Cloning C3 repo to fetch LFS media (movie/videos/Team)..."
cd "$PROJECT_ROOT/$TMP"
git clone --depth 1 "$REPO_C3" repo_c3 || { echo "ERROR: Failed to clone C3 repo"; exit 1; }

cd repo_c3

echo "Installing git-lfs locally (C3 repo)..."
git lfs install --local || { echo "ERROR: git lfs install failed (C3 repo)"; exit 1; }

echo "Pulling LFS objects (C3 repo)..."
git lfs pull || { echo "ERROR: git lfs pull failed (C3 repo)"; exit 1; }

cd "$PROJECT_ROOT"

echo "Copying C3 media folders (movie/videos/Team + trailer) into $DEST..."
mkdir -p "$PROJECT_ROOT/$DEST"

for folder in movie videos Team; do
  if [ -d "$PROJECT_ROOT/$TMP/repo_c3/public/media/$folder" ]; then
    echo " - Replacing $DEST/$folder from C3 repo"
    rm -rf "$PROJECT_ROOT/$DEST/$folder"
    mkdir -p "$PROJECT_ROOT/$DEST/$folder"
    (cd "$PROJECT_ROOT/$TMP/repo_c3/public/media/$folder" && tar -cf - .) | (cd "$PROJECT_ROOT/$DEST/$folder" && tar -xf -)
    echo "   ✓ copied $folder"
  else
    echo " - NOTE: $folder not found in C3 repo source, skipping"
  fi
done

if [ -f "$PROJECT_ROOT/$TMP/repo_c3/public/media/trailer.mp4" ]; then
  cp -f "$PROJECT_ROOT/$TMP/repo_c3/public/media/trailer.mp4" "$PROJECT_ROOT/$DEST/trailer.mp4"
  echo "   ✓ copied trailer.mp4"
fi

# ---------------------------
# Sanity checks
# ---------------------------
echo "=== Sanity Checks ==="

# wallpaper must exist and be > 10KB
WALLPAPER_PATH="$PROJECT_ROOT/$DEST/macwallpaper.jpg"
if [ ! -f "$WALLPAPER_PATH" ]; then
  echo "ERROR: macwallpaper.jpg not found at $WALLPAPER_PATH"
  exit 1
fi

WALLPAPER_SIZE="$(stat -f%z "$WALLPAPER_PATH" 2>/dev/null || stat -c%s "$WALLPAPER_PATH" 2>/dev/null || echo "0")"
MIN_SIZE=$((10 * 1024))
if [ "$WALLPAPER_SIZE" -lt "$MIN_SIZE" ]; then
  echo "ERROR: macwallpaper.jpg is too small: ${WALLPAPER_SIZE} bytes (minimum: ${MIN_SIZE} bytes)"
  exit 1
fi
echo "✓ macwallpaper.jpg size: ${WALLPAPER_SIZE} bytes (OK)"

# ensure movies exist (at least part1)
if [ ! -f "$PROJECT_ROOT/$DEST/movie/part1.mp4" ]; then
  echo "ERROR: movie/part1.mp4 missing in destination"
  exit 1
fi
echo "✓ movie/part1.mp4 exists"

# pointer file detection
echo "Checking for Git LFS pointer files in $DEST..."
POINTER_FILES="$(find "$PROJECT_ROOT/$DEST" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.mov" \) -size -300c -print 2>/dev/null || true)"

if [ -n "${POINTER_FILES:-}" ]; then
  POINTER_COUNT=0
  POINTER_LIST=""

  while IFS= read -r file; do
    [ -f "$file" ] || continue
    if head -n 1 "$file" 2>/dev/null | grep -q "version https://git-lfs.github.com/spec/v1"; then
      POINTER_COUNT=$((POINTER_COUNT + 1))
      FILE_SIZE="$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")"
      POINTER_LIST="${POINTER_LIST}  - $file (${FILE_SIZE} bytes)\n"
    fi
  done <<< "$POINTER_FILES"

  if [ "$POINTER_COUNT" -gt 0 ]; then
    echo ""
    echo "ERROR: Found $POINTER_COUNT Git LFS pointer file(s) in $DEST:"
    echo -e "$POINTER_LIST"
    echo ""
    echo "These files were not properly pulled from Git LFS."
    echo "Most likely: LFS objects are missing on GitHub (quota / not pushed)."
    exit 1
  fi
fi
echo "✓ No Git LFS pointer files found"

# ---------------------------
# Cleanup
# ---------------------------
echo "Cleaning up temporary directory..."
rm -rf "$PROJECT_ROOT/$TMP"

echo "=== Git LFS media fetch completed successfully ==="
