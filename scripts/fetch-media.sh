#!/usr/bin/env bash
set -euo pipefail

# Configuration
TMP=".tmp_media"
REPO="https://github.com/Gambin007/Mac_Interface.git"
DEST="public/media"
GIT_LFS_VERSION="v3.5.1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== Starting Git LFS media fetch ==="
echo "Project root: $PROJECT_ROOT"

# Cleanup
echo "Cleaning temporary directory..."
rm -rf "$TMP"
mkdir -p "$TMP"
cd "$TMP"

# Download and install Git LFS
echo "Downloading git-lfs (linux amd64) v${GIT_LFS_VERSION}..."
GIT_LFS_URL="https://github.com/git-lfs/git-lfs/releases/download/${GIT_LFS_VERSION}/git-lfs-linux-amd64-${GIT_LFS_VERSION}.tar.gz"
curl -L "$GIT_LFS_URL" -o lfs.tar.gz || {
  echo "ERROR: Failed to download git-lfs"
  exit 1
}

echo "Extracting git-lfs..."
tar -xzf lfs.tar.gz || {
  echo "ERROR: Failed to extract git-lfs"
  exit 1
}

# Add git-lfs to PATH
export PATH="$PWD/git-lfs-${GIT_LFS_VERSION}:$PATH"

# Verify git-lfs installation
echo "Verifying git-lfs installation..."
if ! command -v git-lfs &> /dev/null; then
  echo "ERROR: git-lfs not found in PATH"
  exit 1
fi

echo "git-lfs version:"
git-lfs version || {
  echo "ERROR: git-lfs version check failed"
  exit 1
}

# Clone repository (public, no auth)
echo "Cloning Mac_Interface repository..."
git clone --depth 1 "$REPO" repo || {
  echo "ERROR: Failed to clone repository"
  exit 1
}

cd repo

# Install and pull LFS objects
echo "Installing git-lfs locally..."
git lfs install --local || {
  echo "ERROR: Failed to install git-lfs locally"
  exit 1
}

echo "Pulling LFS objects..."
git lfs pull || {
  echo "ERROR: Failed to pull LFS objects"
  exit 1
}

cd "$PROJECT_ROOT"

# Find source media directory
echo "Finding source media directory..."
SRC_MEDIA_DIR=""
if [ -d "$TMP/repo/public/media" ]; then
  SRC_MEDIA_DIR="$TMP/repo/public/media"
  echo "Found media directory: $SRC_MEDIA_DIR"
else
  echo "repo/public/media not found, searching..."
  SRC_MEDIA_DIR=$(find "$TMP/repo" -path "*/public/media" -type d | head -n 1)
  if [ -z "$SRC_MEDIA_DIR" ] || [ ! -d "$SRC_MEDIA_DIR" ]; then
    echo "ERROR: Source media directory not found"
    echo "Available directories in repo:"
    find "$TMP/repo" -type d | head -20
    exit 1
  fi
  echo "Found media directory: $SRC_MEDIA_DIR"
fi

# Copy media files (no rsync available on Vercel)
echo "Copying media files to $DEST (tar pipe, no rsync)..."
mkdir -p "$PROJECT_ROOT/$DEST"

# delete existing to mimic --delete behavior
rm -rf "$PROJECT_ROOT/$DEST"/*
# copy preserving structure
( cd "$SRC_MEDIA_DIR" && tar -cf - . ) | ( cd "$PROJECT_ROOT/$DEST" && tar -xf - ) || {
  echo "ERROR: Failed to copy media files with tar pipe"
  exit 1
}

# Find and copy wallpaper
echo "Searching for wallpaper..."
WALLPAPER_FOUND=$(find "$TMP/repo" -type f -iname "macwallpaper.*" | head -n 1)
if [ -n "$WALLPAPER_FOUND" ]; then
  echo "Found wallpaper: $WALLPAPER_FOUND"
  cp -f "$WALLPAPER_FOUND" "$PROJECT_ROOT/$DEST/macwallpaper.jpg" || {
    echo "ERROR: Failed to copy wallpaper"
    exit 1
  }
  echo "Wallpaper copied to $PROJECT_ROOT/$DEST/macwallpaper.jpg"
else
  echo "WARNING: No wallpaper found matching macwallpaper.*"
fi

# Sanity check: wallpaper must exist and be > 10KB
echo "=== Sanity Checks ==="
WALLPAPER_PATH="$PROJECT_ROOT/$DEST/macwallpaper.jpg"
if [ ! -f "$WALLPAPER_PATH" ]; then
  echo "ERROR: macwallpaper.jpg not found at $WALLPAPER_PATH"
  exit 1
fi

WALLPAPER_SIZE=$(stat -f%z "$WALLPAPER_PATH" 2>/dev/null || stat -c%s "$WALLPAPER_PATH" 2>/dev/null || echo "0")
MIN_SIZE=$((10 * 1024))  # 10KB

if [ "$WALLPAPER_SIZE" -lt "$MIN_SIZE" ]; then
  echo "ERROR: macwallpaper.jpg is too small: ${WALLPAPER_SIZE} bytes (minimum: ${MIN_SIZE} bytes)"
  exit 1
fi

echo "✓ macwallpaper.jpg size: ${WALLPAPER_SIZE} bytes (OK)"

# Check for Git LFS pointer files
echo "Checking for Git LFS pointer files..."
POINTER_FILES=$(find "$PROJECT_ROOT/$DEST" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.mov" \) -size -300c -print 2>/dev/null || true)

if [ -n "$POINTER_FILES" ]; then
  POINTER_COUNT=0
  POINTER_LIST=""
  
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      # Check if file contains Git LFS pointer header
      if head -n 1 "$file" 2>/dev/null | grep -q "version https://git-lfs.github.com/spec/v1"; then
        POINTER_COUNT=$((POINTER_COUNT + 1))
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
        POINTER_LIST="${POINTER_LIST}  - $file (${FILE_SIZE} bytes)\n"
      fi
    fi
  done <<< "$POINTER_FILES"
  
  if [ "$POINTER_COUNT" -gt 0 ]; then
    echo ""
    echo "ERROR: Found $POINTER_COUNT Git LFS pointer file(s) in public/media:"
    echo -e "$POINTER_LIST"
    echo ""
    echo "These files were not properly pulled from Git LFS."
    echo "Please check your Git LFS configuration and ensure LFS objects are accessible."
    exit 1
  fi
fi

echo "✓ No Git LFS pointer files found"

# Cleanup
echo "Cleaning up temporary directory..."
rm -rf "$TMP"

echo "=== Git LFS media fetch completed successfully ==="
