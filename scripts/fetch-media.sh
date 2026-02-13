#!/usr/bin/env bash
set -euo pipefail

TMP=".tmp_lfs"
GIT_LFS_VERSION="v3.5.1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$PROJECT_ROOT/public/media"

echo "=== Git LFS + Media Setup ==="
echo "Project root: $PROJECT_ROOT"

# temp
rm -rf "$PROJECT_ROOT/$TMP"
mkdir -p "$PROJECT_ROOT/$TMP"
cd "$PROJECT_ROOT/$TMP"

# install git-lfs binary (portable)
echo "Downloading git-lfs (linux amd64) ${GIT_LFS_VERSION}..."
GIT_LFS_URL="https://github.com/git-lfs/git-lfs/releases/download/${GIT_LFS_VERSION}/git-lfs-linux-amd64-${GIT_LFS_VERSION}.tar.gz"
curl -L "$GIT_LFS_URL" -o lfs.tar.gz
tar -xzf lfs.tar.gz
export PATH="$PWD/git-lfs-${GIT_LFS_VERSION}:$PATH"

echo "git-lfs version:"
git-lfs version

# go back to project repo (already cloned by Vercel)
cd "$PROJECT_ROOT"

echo "Installing git-lfs locally (project repo)..."
git lfs install --local

echo "Pulling LFS objects for THIS repo..."
# Pull everything needed for current checkout
git lfs pull

# sanity: ensure videos exist and are not pointer files
echo "=== Sanity: pointer check ==="
POINTER_FILES="$(find "$DEST" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.mov" \) -size -300c -print 2>/dev/null || true)"

if [ -n "${POINTER_FILES:-}" ]; then
  BAD=0
  while IFS= read -r f; do
    [ -f "$f" ] || continue
    if head -n 1 "$f" 2>/dev/null | grep -q "version https://git-lfs.github.com/spec/v1"; then
      echo "ERROR: LFS pointer still present: $f"
      BAD=1
    fi
  done <<< "$POINTER_FILES"
  if [ "$BAD" -eq 1 ]; then
    echo ""
    echo "FAILED: Some LFS objects are missing on the LFS server OR Vercel has no access."
    exit 1
  fi
fi

echo "✓ No LFS pointer files found in public/media"

# cleanup
rm -rf "$PROJECT_ROOT/$TMP"
echo "=== Done ==="
