#!/usr/bin/env bash
set -euo pipefail

# ===== Config =====
TMP=".tmp_media"
REPO_MAC="https://github.com/Gambin007/Mac_Interface.git"
REPO_C3="https://github.com/Gambin007/C3-Clues-dont-Lie.git"
DEST="public/media"
GIT_LFS_VERSION="v3.5.1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== Git LFS Media Fetch (Public repos, no token) ==="
echo "Project root: $PROJECT_ROOT"

# ===== Helpers =====
file_size() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo "0"
}

copy_dir_tar() {
  local src="$1"
  local dst="$2"
  mkdir -p "$dst"
  (cd "$src" && tar -cf - .) | (cd "$dst" && tar -xf -)
}

clone_and_lfs_pull() {
  local repo_url="$1"
  local folder="$2"

  echo "Cloning $repo_url -> $folder ..."
  git clone --depth 1 "$repo_url" "$folder" >/dev/null 2>&1 || {
    echo "ERROR: Failed to clone $repo_url"
    exit 1
  }

  echo "Installing git-lfs locally ($folder)..."
  (cd "$folder" && git lfs install --local >/dev/null 2>&1) || {
    echo "ERROR: git lfs install failed in $folder"
    exit 1
  }

  echo "Pulling LFS objects ($folder)..."
  (cd "$folder" && git lfs pull) || {
    echo "ERROR: git lfs pull failed in $folder"
    exit 1
  }
}

find_media_dir() {
  local root="$1"
  if [ -d "$root/public/media" ]; then
    echo "$root/public/media"
    return 0
  fi
  local found
  found="$(find "$root" -path "*/public/media" -type d | head -n 1 || true)"
  if [ -z "$found" ] || [ ! -d "$found" ]; then
    echo ""
    return 1
  fi
  echo "$found"
}

# ===== Prep TMP =====
rm -rf "$PROJECT_ROOT/$TMP"
mkdir -p "$PROJECT_ROOT/$TMP"
cd "$PROJECT_ROOT/$TMP"

# ===== Install git-lfs binary (portable) =====
echo "Downloading git-lfs (linux amd64) $GIT_LFS_VERSION..."
GIT_LFS_URL="https://github.com/git-lfs/git-lfs/releases/download/${GIT_LFS_VERSION}/git-lfs-linux-amd64-${GIT_LFS_VERSION}.tar.gz"
curl -sSL "$GIT_LFS_URL" -o lfs.tar.gz || { echo "ERROR: Failed to download git-lfs"; exit 1; }
tar -xzf lfs.tar.gz
export PATH="$PWD/git-lfs-${GIT_LFS_VERSION}:$PATH"

echo "git-lfs version:"
git-lfs version

# ===== 1) Mac_Interface -> photos/images/audio + wallpaper =====
clone_and_lfs_pull "$REPO_MAC" "repo_mac"
MAC_MEDIA_DIR="$(find_media_dir "$PROJECT_ROOT/$TMP/repo_mac")" || {
  echo "ERROR: Could not find public/media in Mac_Interface clone"
  exit 1
}

echo "Copying from Mac_Interface -> $DEST (photos/images/audio)..."
mkdir -p "$PROJECT_ROOT/$DEST"
for folder in photos images audio; do
  if [ -d "$MAC_MEDIA_DIR/$folder" ]; then
    echo " - Replacing $DEST/$folder"
    rm -rf "$PROJECT_ROOT/$DEST/$folder"
    copy_dir_tar "$MAC_MEDIA_DIR/$folder" "$PROJECT_ROOT/$DEST/$folder"
  else
    echo " - NOTE: $folder not found in Mac_Interface, skipping"
  fi
done

echo "Copying wallpaper from Mac_Interface..."
WALLPAPER_FOUND="$(find "$PROJECT_ROOT/$TMP/repo_mac" -type f -iname "macwallpaper.*" | head -n 1 || true)"
if [ -n "$WALLPAPER_FOUND" ]; then
  cp -f "$WALLPAPER_FOUND" "$PROJECT_ROOT/$DEST/macwallpaper.jpg"
  echo " - copied -> $PROJECT_ROOT/$DEST/macwallpaper.jpg"
else
  echo "WARNING: macwallpaper.* not found in Mac_Interface repo"
fi

# ===== 2) C3 repo -> movie/videos/Team =====
clone_and_lfs_pull "$REPO_C3" "repo_c3"
C3_MEDIA_DIR="$(find_media_dir "$PROJECT_ROOT/$TMP/repo_c3")" || {
  echo "ERROR: Could not find public/media in C3 clone"
  exit 1
}

echo "Copying from C3 -> $DEST (movie/videos/Team)..."
for folder in movie videos Team; do
  if [ -d "$C3_MEDIA_DIR/$folder" ]; then
    echo " - Replacing $DEST/$folder"
    rm -rf "$PROJECT_ROOT/$DEST/$folder"
    copy_dir_tar "$C3_MEDIA_DIR/$folder" "$PROJECT_ROOT/$DEST/$folder"
  else
    echo " - NOTE: $folder not found in C3 repo, skipping"
  fi
done

# ===== Sanity checks =====
echo "=== Sanity Checks ==="

WALL="$PROJECT_ROOT/$DEST/macwallpaper.jpg"
if [ ! -f "$WALL" ]; then
  echo "ERROR: macwallpaper.jpg missing at $WALL"
  exit 1
fi
WALL_SIZE="$(file_size "$WALL")"
if [ "$WALL_SIZE" -lt $((10*1024)) ]; then
  echo "ERROR: macwallpaper.jpg too small (${WALL_SIZE} bytes) -> still a pointer?"
  exit 1
fi
echo "✓ macwallpaper.jpg size: ${WALL_SIZE} bytes (OK)"

MOV="$PROJECT_ROOT/$DEST/movie/part1.mp4"
if [ ! -f "$MOV" ]; then
  echo "ERROR: movie/part1.mp4 missing in destination"
  exit 1
fi
MOV_SIZE="$(file_size "$MOV")"
if [ "$MOV_SIZE" -lt $((1*1024*1024)) ]; then
  echo "ERROR: movie/part1.mp4 too small (${MOV_SIZE} bytes) -> likely LFS pointer"
  exit 1
fi
echo "✓ movie/part1.mp4 size: ${MOV_SIZE} bytes (OK)"

echo "Checking for Git LFS pointer files in $DEST..."
POINTER_FILES="$(find "$PROJECT_ROOT/$DEST" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.mov" \) -size -300c -print 2>/dev/null || true)"
if [ -n "$POINTER_FILES" ]; then
  BAD=0
  while IFS= read -r f; do
    if head -n 1 "$f" 2>/dev/null | grep -q "version https://git-lfs.github.com/spec/v1"; then
      echo "ERROR: LFS pointer remains: $f ($(file_size "$f") bytes)"
      BAD=1
    fi
  done <<< "$POINTER_FILES"
  if [ "$BAD" -eq 1 ]; then
    exit 1
  fi
fi
echo "✓ No Git LFS pointer files found"

# Cleanup
cd "$PROJECT_ROOT"
rm -rf "$PROJECT_ROOT/$TMP"
echo "=== Done: media prepared ==="
