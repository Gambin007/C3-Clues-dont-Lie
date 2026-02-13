#!/usr/bin/env bash
set -euo pipefail

# Configuration
TMP=".tmp_media"
REPO="https://github.com/Gambin007/Mac_Interface.git"
DEST="public/media"
GIT_LFS_VERSION="v3.5.1"

echo "=== Starting Git LFS media fetch ==="

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

# Clone repository
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

# Verify LFS objects were pulled
echo "Verifying LFS objects..."
if [ -f "public/media/macwallpaper.jpg" ]; then
  FILE_SIZE=$(stat -f%z "public/media/macwallpaper.jpg" 2>/dev/null || stat -c%s "public/media/macwallpaper.jpg" 2>/dev/null || echo "0")
  if [ "$FILE_SIZE" -lt 1000 ]; then
    echo "WARNING: macwallpaper.jpg is only ${FILE_SIZE} bytes - might still be a pointer file"
    echo "Attempting to force pull LFS objects..."
    git lfs fetch --all || true
    git lfs checkout || true
  else
    echo "✓ macwallpaper.jpg size: ${FILE_SIZE} bytes (looks good)"
  fi
else
  echo "WARNING: macwallpaper.jpg not found in expected location"
fi

cd ../..

# Copy media files
SRC="$TMP/repo/public/media"
if [ ! -d "$SRC" ]; then
  echo "ERROR: Source folder not found: $SRC"
  echo "Available files in repo:"
  ls -la "$TMP/repo/public/" || true
  exit 1
fi

echo "Copying media files to $DEST..."
rm -rf "$DEST"
mkdir -p public
cp -R "$SRC" "$DEST" || {
  echo "ERROR: Failed to copy media files"
  exit 1
}

# Sanity check
echo "=== Sanity check ==="
if [ -f "$DEST/macwallpaper.jpg" ]; then
  FILE_SIZE=$(stat -f%z "$DEST/macwallpaper.jpg" 2>/dev/null || stat -c%s "$DEST/macwallpaper.jpg" 2>/dev/null || echo "0")
  echo "macwallpaper.jpg size: ${FILE_SIZE} bytes"
  if [ "$FILE_SIZE" -lt 1000 ]; then
    echo "ERROR: macwallpaper.jpg is still too small (${FILE_SIZE} bytes) - Git LFS pull may have failed"
    exit 1
  fi
  echo "✓ Media files copied successfully"
else
  echo "ERROR: macwallpaper.jpg not found in destination"
  exit 1
fi

# Cleanup
echo "Cleaning up temporary directory..."
rm -rf "$TMP"

echo "=== Git LFS media fetch completed successfully ==="
