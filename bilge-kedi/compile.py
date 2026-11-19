"""Derleme: giriş + 6 dikey bölüm (yatay kareye oturtulmuş) + geçişler + kapanış -> episodes/derleme/bilge_kedi_6_sir.mp4
Kullanım: python3 compile.py <dikey_bolum_klasoru>   (her bölüm: <klasor>/<ad>.mp4 ve <klasor>/<ad>.json zaman çizelgesi)"""
import json, subprocess, sys, os
SRC = sys.argv[1]; OUT = "episodes/derleme"; TMP = OUT + "/parts"; os.makedirs(TMP, exist_ok=True)
EPS = [("karadelik", "🕳️", "Kara Delik", "#7a5cff"), ("ahtapot", "🐙", "Ahtapot", "#b26bff"), ("ay", "🌙", "Ay", "#e8b830"),
       ("gokkusagi", "🌈", "Gökkuşağı", "#3fa9ff"), ("arilar", "🐝", "Arılar", "#ff9f2f"), ("kartanesi", "❄️", "Kar Tanesi", "#3fc8e8")]
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2"]
def run(*a): subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)
TL = json.load(open(OUT + "/timeline.json")); L = TL["lines"]; card = OUT + "/derleme.mp4"
def cut(src, a, b, dst): run("-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, *ENC, dst)
parts = []
# paneller
subprocess.run(["node", "panels.js", TMP, json.dumps([[i + 1, ic, nm, col] for i, (ad, ic, nm, col) in enumerate(EPS)], ensure_ascii=False)], check=True)
cut(card, 0, L[3]["start"] - 0.4, f"{TMP}/00_giris.mp4"); parts.append("00_giris.mp4")
for i, (ad, *_rest) in enumerate(EPS):
    if i > 0:
        li = 2 + i; cut(card, L[li]["start"] - 0.4, L[li]["end"] + 0.9, f"{TMP}/{i:02d}a_gecis.mp4"); parts.append(f"{i:02d}a_gecis.mp4")
    tl = json.load(open(f"{SRC}/{ad}.json")); end = tl["lines"][-1]["start"] - 0.25
    fc = ("[0:v]split[a][b];[a]scale=1920:-2,crop=1920:1080,boxblur=30:3,eq=brightness=-0.12[bg];"
          "[b]scale=608:1080[fg];[bg][fg]overlay=656:0[v1];[v1][1:v]overlay=0:0[v]")
    run("-ss", "0", "-to", f"{end:.3f}", "-i", f"{SRC}/{ad}.mp4", "-i", f"{TMP}/panel{i}.png", "-filter_complex", fc,
        "-map", "[v]", "-map", "0:a", *ENC, "-af", "afade=t=out:st=%.3f:d=0.4" % (end - 0.4), f"{TMP}/{i:02d}b_{ad}.mp4")
    parts.append(f"{i:02d}b_{ad}.mp4")
cut(card, L[8]["start"] - 0.4, TL["duration"], f"{TMP}/99_kapanis.mp4"); parts.append("99_kapanis.mp4")
open(f"{TMP}/list.txt", "w").write("".join(f"file '{x}'\n" for x in parts))
run("-f", "concat", "-safe", "0", "-i", f"{TMP}/list.txt", "-c", "copy", "-movflags", "+faststart", OUT + "/bilge_kedi_6_sir.mp4")
print("ok", OUT + "/bilge_kedi_6_sir.mp4")
