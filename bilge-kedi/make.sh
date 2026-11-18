#!/usr/bin/env bash
# Kullanım:
#   ./make.sh setup                 bağımlılıkları kur
#   ./make.sh audio <ep>            ses + zaman çizelgesi (episodes/<ep>/mix.wav, timeline.js)
#   ./make.sh samples <ep> t1 t2..  örnek kareler + episodes/<ep>/sheet.png
#   ./make.sh video <ep>            tam video -> episodes/<ep>/<ep>.mp4
set -euo pipefail
cd "$(dirname "$0")"
cmd=${1:-}; shift || true
case "$cmd" in
  setup) [ -d node_modules ] || npm install --silent --no-audit --no-fund
         python3 -c "import edge_tts" 2>/dev/null || pip install -q edge-tts ;;
  audio) python3 audio.py "episodes/$1" ;;
  samples) ep=$1; shift; node render.js "$ep" samples "$@" && python3 sheet.py "episodes/$ep" ;;
  video) node render.js "$1" full && ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of compact "episodes/$1/$1.mp4" ;;
  *) echo "kullanım: $0 setup|audio|samples|video" ; exit 1 ;;
esac
