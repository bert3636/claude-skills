"""v2 derleme: episodes/dosyalar kartları + 3 dikey v2 Short (dosya panelleriyle yatay) -> episodes/dosyalar/bilge_kedi_dosyalari.mp4"""
import json, subprocess, os
OUT = "episodes/dosyalar"; TMP = OUT + "/parts"; os.makedirs(TMP, exist_ok=True)
EPS = [("mavibalina", "07", "MAVİ", "BALİNA", "🐋", "#2f5fd0"), ("karinca", "08", "GİZLİ", "ŞEHİR", "🐜", "#e3402f"), ("yaprak", "09", "IŞIKTAN", "YEMEK", "🍃", "#1fa38a")]
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2"]
def run(*a): subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)
subprocess.run(["node", "panels2.js", TMP, json.dumps([[n, a, b, ic, col] for _, n, a, b, ic, col in EPS], ensure_ascii=False)], check=True)
TL = json.load(open(OUT + "/timeline.json")); L = TL["lines"]; card = OUT + "/dosyalar.mp4"
def cut(a, b, dst): run("-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", card, *ENC, dst)
parts = []
cut(0, L[1]["start"] - 0.4, f"{TMP}/00.mp4"); parts.append("00.mp4")
for i, (ad, n, *_r) in enumerate(EPS):
    li = 1 + i; cut(L[li]["start"] - 0.4, L[li]["end"] + 1.0, f"{TMP}/{i+1:02d}a.mp4"); parts.append(f"{i+1:02d}a.mp4")
    tl = json.load(open(f"episodes/{ad}/timeline.json")); end = tl["lines"][-1]["start"] - 0.3
    fc = ("[0:v]split[a][b];[a]scale=1920:-2,crop=1920:1080,boxblur=30:3,eq=brightness=-0.15[bg];"
          "[b]scale=608:1080[fg];[bg][fg]overlay=656:0[v1];[v1][1:v]overlay=0:0[v]")
    run("-ss", "0", "-to", f"{end:.3f}", "-i", f"episodes/{ad}/{ad}.mp4", "-i", f"{TMP}/panel_{n}.png", "-filter_complex", fc,
        "-map", "[v]", "-map", "0:a", *ENC, "-af", f"afade=t=out:st={end - 0.4:.3f}:d=0.4", f"{TMP}/{i+1:02d}b.mp4"); parts.append(f"{i+1:02d}b.mp4")
cut(L[4]["start"] - 0.4, TL["duration"], f"{TMP}/99.mp4"); parts.append("99.mp4")
open(f"{TMP}/list.txt", "w").write("".join(f"file '{x}'\n" for x in parts))
run("-f", "concat", "-safe", "0", "-i", f"{TMP}/list.txt", "-c", "copy", "-movflags", "+faststart", OUT + "/bilge_kedi_dosyalari.mp4")
print("ok")
