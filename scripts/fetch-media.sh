#!/usr/bin/env bash
set -euo pipefail

TMP=".tmp_media"
DEST="public/media"

REPO_MAC="https://github.com/Gambin007/Mac_Interface.git"
REPO_C3="https://github.com/Gambin007/C3-Clues-dont-Lie.git"

GIT_LFS_VERSION="v3.5.1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=== Git LFS Media Fetch (Vercel-safe) ==="
echo "Project root: $PROJECT_ROOT"

# --- helpers ---
with_token() {
  # Usage: with_token "https://github.com/OWNER/REPO.git"
  local url="$1"
  if [ -n "${GH_TOKEN:-}" ]; then
    # inject token into https URL
    echo "$url" | sed -E "s#^https://github.com/#https://${GH_TOKEN}@github.com/#"
  else
    echo "$url"
  fi
}

copy_dir_tar() {
  local src="$1"
  local dst="$2"
  rm -rf "$dst"
  mkdir -p "$dst"
  (cd "$src" && tar -cf - .) | (cd "$dst" && tar -xf -)
}

# --- setup tmp ---
rm -rf "$PROJECT_ROOT/$TMP"
mkdir -p "$PROJECT_ROOT/$TMP"
cd "$PROJECT_ROOT/$TMP"

# --- install git-lfs portable ---
echo "Downloading git-lfs (linux amd64) $GIT_LFS_VERSION..."
GIT_LFS_URL="https://github.com/git-lfs/git-lfs/releases/download/${GIT_LFS_VERSION}/git-lfs-linux-amd64-${GIT_LFS_VERSION}.tar.gz"
curl -L "$GIT_LFS_URL" -o lfs.tar.gz
tar -xzf lfs.tar.gz
export PATH="$PWD/git-lfs-${GIT_LFS_VERSION}:$PATH"

echo "git-lfs version:"
git-lfs version

# =========================
# 1) MAC_INTERFACE (public)
# =========================
echo "Cloning Mac_Interface..."
git clone --depth 1 "$(with_token "$REPO_MAC")" repo_mac
cd repo_mac
git lfs install --local
git lfs pull
cd "$PROJECT_ROOT/$TMP"

MAC_MEDIA="$PROJECT_ROOT/$TMP/repo_mac/public/media"
if [ ! -d "$MAC_MEDIA" ]; then
  echo "ERROR: Mac_Interface public/media not found"
  exit 1
fi

echo "Copying from Mac_Interface -> $DEST (photos/images/audio)..."
mkdir -p "$PROJECT_ROOT/$DEST"

for folder in photos images audio; do
  if [ -d "$MAC_MEDIA/$folder" ]; then
    echo " - $folder"
    copy_dir_tar "$MAC_MEDIA/$folder" "$PROJECT_ROOT/$DEST/$folder"
  else
    echo " - NOTE: $folder not found in Mac_Interface, skipping"
  fi
done

echo "Copying wallpaper from Mac_Interface..."
WALLPAPER_FOUND="$(find "$PROJECT_ROOT/$TMP/repo_mac" -type f -iname "macwallpaper.*" | head -n 1 || true)"
if [ -n "${WALLPAPER_FOUND:-}" ]; then
  cp -f "$WALLPAPER_FOUND" "$PROJECT_ROOT/$DEST/macwallpaper.jpg"
else
  echo "WARNING: macwallpaper.* not found in Mac_Interface"
fi

# =========================
# 2) C3 REPO (needs token if private)
# =========================
echo "Cloning C3 repo for LFS (movie/videos/Team)..."
if [ -z "${GH_TOKEN:-}" ]; then
  echo "ERROR: GH_TOKEN is not set. Add it in Vercel env vars so we can clone/pull LFS from C3 repo."
  exit 1
fi

git clone --depth 1 "$(with_token "$REPO_C3")" repo_c3
cd repo_c3
git lfs install --local
git lfs pull
cd "$PROJECT_ROOT/$TMP"

C3_MEDIA="$PROJECT_ROOT/$TMP/repo_c3/public/media"
if [ ! -d "$C3_MEDIA" ]; then
  echo "ERROR: C3 repo public/media not found"
  exit 1
fi

echo "Copying from C3 repo -> $DEST (movie/videos/Team + trailer etc if present)..."
for folder in movie videos Team; do
  if [ -d "$C3_MEDIA/$folder" ]; then
    echo " - $folder"
    copy_dir_tar "$C3_MEDIA/$folder" "$PROJECT_ROOT/$DEST/$folder"
  else
    echo " - NOTE: $folder not found in C3 repo, skipping"
  fi
done

# also copy top-level mp4 if any (e.g. trailer.mp4 at /public/media/trailer.mp4)
for f in "$C3_MEDIA"/*.mp4 "$C3_MEDIA"/*.mov; do
  if [ -f "$f" ]; then
    echo " - copying $(basename "$f")"
    cp -f "$f" "$PROJECT_ROOT/$DEST/$(basename "$f")"
  fi
done

# =========================
# Sanity + pointer check
# =========================
echo "=== Sanity Checks ==="
if [ ! -f "$PROJECT_ROOT/$DEST/macwallpaper.jpg" ]; then
  echo "ERROR: macwallpaper.jpg missing in destination"
  exit 1
fi

echo "Checking for LFS pointer files in $DEST..."
POINTER_FILES="$(find "$PROJECT_ROOT/$DEST" -type f \
  \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.mov" \) \
  -size -300c -print 2>/dev/null || true)"

BAD=0
if [ -n "${POINTER_FILES:-}" ]; then
  while IFS= read -r file; do
    [ -f "$file" ] || continue
    if head -n 1 "$file" 2>/dev/null | grep -q "version https://git-lfs.github.com/spec/v1"; then
      echo "ERROR: Still a pointer: $file"
      BAD=1
    fi
  done <<< "$POINTER_FILES"
fi

if [ "$BAD" -eq 1 ]; then
  echo "FAILED: Some LFS objects could not be fetched."
  exit 1
fi

echo "✓ No LFS pointer files found"

echo "Cleaning up..."
rm -rf "$PROJECT_ROOT/$TMP"

echo "=== DONE ==="
