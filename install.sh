#!/usr/bin/env bash
# skills.txt'teki bütün skill'leri ~/.claude/skills içine kurar / günceller.
# Kullanım: curl -sL https://raw.githubusercontent.com/bert3636/claude-skills/main/install.sh | bash
set +e
LIST_URL="${SKILLS_LIST_URL:-https://raw.githubusercontent.com/bert3636/claude-skills/main/skills.txt}"
S="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"; T=$(mktemp -d); mkdir -p "$S"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]:-.}")" 2>/dev/null && pwd)"
if [ -f "$HERE/skills.txt" ]; then LIST=$(cat "$HERE/skills.txt"); else LIST=$(curl -fsSL "$LIST_URL"); fi

put() { # $1=kaynak klasör/dosya  $2=skill adı
  rm -rf "$S/$2"
  if [ -f "$1" ]; then mkdir -p "$S/$2" && cp "$1" "$S/$2/SKILL.md"
  elif [ -f "$1/SKILL.md" ]; then cp -r "$1" "$S/$2" && rm -rf "$S/$2/.git"
  fi && echo "  + $2"
}

echo "$LIST" | grep -v '^\s*#' | grep -v '^\s*$' | while read -r repo path name; do
  dir="$T/$repo"; base="${path%/\*}"
  if [ ! -d "$dir" ]; then
    git clone -q --depth 1 --filter=blob:none --sparse "https://github.com/$repo" "$dir" || { echo "! $repo indirilemedi"; continue; }
  fi
  if [ "$base" = "." ]; then git -C "$dir" sparse-checkout disable >/dev/null 2>&1
  else git -C "$dir" sparse-checkout add --no-cone "/$base" >/dev/null 2>&1 || git -C "$dir" sparse-checkout set --no-cone "/$base" >/dev/null 2>&1; fi
  echo "$repo"
  if [ "$path" != "$base" ]; then
    for d in "$dir/$base"/*/; do [ -f "$d/SKILL.md" ] && put "${d%/}" "$(basename "$d")"; done
  else
    put "$dir/$base" "${name:-$(basename "$base")}"
  fi
done
rm -rf "$T"
exit 0
