"""Anlatım (edge-tts) + kelime zamanları + sentez müzik/SFX -> timeline.json, mix.wav"""
import asyncio, json, os, subprocess, io, wave
import numpy as np
import edge_tts

SR = 44100
VOICE, RATE = "tr-TR-EmelNeural", "+10%"
PROXY = os.environ.get("HTTPS_PROXY")
import sys
EP = sys.argv[1] if len(sys.argv) > 1 else "episodes/karadelik"
SCRIPT = json.load(open(os.path.join(EP, "script.json")))
LINES = SCRIPT["lines"]
LEAD, GAP, TAIL = 0.35, 0.30, 1.4

async def tts(text):
    c = edge_tts.Communicate(text, VOICE, rate=SCRIPT.get("rate", RATE), proxy=PROXY, boundary="WordBoundary")
    mp3, words = b"", []
    async for ch in c.stream():
        if ch["type"] == "audio": mp3 += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append({"w": ch["text"], "s": ch["offset"] / 1e7, "e": (ch["offset"] + ch["duration"]) / 1e7})
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-f", "s16le", "-ac", "1", "-ar", str(SR), "pipe:1"],
                         input=mp3, capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768, words

def trim(x, thr=0.01):
    idx = np.where(np.abs(x) > thr)[0]
    return (x[: idx[-1] + int(0.05 * SR)], 0) if len(idx) else (x, 0)

# ---------- sentez yardımcıları ----------
def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=None):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r: e *= np.exp(-np.arange(n) / (r * SR))
    return e
def bell(f, d=1.2, r=0.35):
    t = t_(d); x = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2.01*f*t) + 0.12*np.sin(2*np.pi*3.98*f*t)
    return x * env(len(t), 0.003, r)
def lp(x, a):  # tek kutuplu alçak geçiren
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
rng = np.random.default_rng(3)

def sfx_ding(): return 0.5*bell(1568, 1.0, 0.3) + 0.3*bell(2093, 1.0, 0.25)
def sfx_whoosh(d=0.45):
    n = int(d*SR); noise = rng.standard_normal(n)
    a = np.linspace(0.02, 0.35, n)**1.5; y = np.zeros(n); s = 0
    for i in range(n): s += a[i]*(noise[i]-s); y[i] = s
    return 0.9 * y * np.sin(np.linspace(0, np.pi, n))**2
def sfx_sparkle(d=0.9):
    out = np.zeros(int(d*SR))
    for k in range(9):
        f = rng.choice([2093, 2349, 2637, 3136, 3520]); st = int(rng.uniform(0, d-0.3)*SR)
        b = 0.18*bell(f, 0.3, 0.08); out[st:st+len(b)] += b[:len(out)-st]
    return out
def sfx_vinn(d=1.1):
    t = t_(d); f = 900*np.exp(-t*2.2)+120; ph = 2*np.pi*np.cumsum(f)/SR
    return 0.35*np.sin(ph)*(0.6+0.4*np.sin(2*np.pi*14*t))*env(len(t), 0.02)*np.linspace(1, 0.3, len(t))
def sfx_pop():
    t = t_(0.18); f = 300+900*np.exp(-t*40); ph = 2*np.pi*np.cumsum(f)/SR
    return 0.8*np.sin(ph)*env(len(t), 0.001, 0.05)
def sfx_swirl(d=1.3):
    t = t_(d); f = 300+500*t/d+80*np.sin(2*np.pi*6*t); ph = 2*np.pi*np.cumsum(f)/SR
    return 0.25*np.sin(ph)*np.sin(np.pi*t/d) + 0.3*sfx_whoosh(d)[:len(t)]
def sfx_click():
    n = int(0.12*SR); x = rng.standard_normal(n)*env(n, 0.0005, 0.012)
    m = rng.standard_normal(n)*env(n, 0.0005, 0.01); x[int(0.06*SR):] += m[:n-int(0.06*SR)]
    return 0.6*x
def sfx_boing(d=0.6):
    t = t_(d); f = 220*(1+0.35*np.exp(-t*5)*np.sin(2*np.pi*11*t)); ph = 2*np.pi*np.cumsum(f)/SR
    return 0.55*np.sin(ph)*env(len(t), 0.003, 0.2)
def sfx_chime():
    out = np.zeros(int(1.6*SR))
    for i, f in enumerate([1047, 1319, 1568, 2093]):
        b = 0.3*bell(f, 1.0, 0.35); st = int(i*0.11*SR); out[st:st+len(b)] += b
    return out
def sfx_bubble():
    out = np.zeros(int(0.7*SR))
    for k in range(5):
        d = 0.09; t = t_(d); f0 = rng.uniform(500, 900); ph = 2*np.pi*np.cumsum(f0*(1+2.5*t/d))/SR
        b = 0.35*np.sin(ph)*env(len(t), 0.002, 0.04); st = int(k*0.11*SR); out[st:st+len(b)] += b
    return out
def sfx_heart():
    out = np.zeros(int(0.6*SR))
    for st0, a in ((0, 1.0), (0.17, 0.7)):
        t = t_(0.2); f = 70+60*np.exp(-t*30); ph = 2*np.pi*np.cumsum(f)/SR
        b = a*0.9*np.sin(ph)*env(len(t), 0.002, 0.06); st = int(st0*SR); out[st:st+len(b)] += b
    return out + 0.25*np.pad(sfx_pop(), (0, len(out)-len(sfx_pop())))
def sfx_buzz(d=1.2):
    t = t_(d); f = 230+25*np.sin(2*np.pi*7*t); ph = 2*np.pi*np.cumsum(f)/SR
    x = sum(np.sin(k*ph)/k for k in range(1, 7)); x = lp(x, 0.25)
    return 0.22*x*np.sin(np.pi*t/d)**0.5*(0.7+0.3*np.sin(2*np.pi*3*t))
def sfx_jump(d=0.5):
    t = t_(d); f = 250+700*(t/d)**0.6; ph = 2*np.pi*np.cumsum(f)/SR
    return 0.45*np.sin(ph)*env(len(t), 0.005, 0.25)
def sfx_tick(n=14, gap=0.07):
    out = np.zeros(int((n*gap+0.2)*SR))
    for k in range(n):
        b = 0.25*bell(2600+k*60, 0.06, 0.015); st = int(k*gap*SR); out[st:st+len(b)] += b
    return out
def sfx_drop():
    t = t_(0.25); f = 1400*np.exp(-t*12)+500; ph = 2*np.pi*np.cumsum(f)/SR
    return 0.5*np.sin(ph)*env(len(t), 0.001, 0.07)
def sfx_count(n=5):
    out = np.zeros(int((n+0.5)*SR))
    for k in range(n):
        b = 0.35*bell(880 if k < n-1 else 1320, 0.4, 0.1); st = int(k*SR); out[st:st+len(b)] += b
    return out
def sfx_yay():
    c = sfx_chime(); sp = sfx_sparkle(1.2); out = np.zeros(max(len(c), len(sp)) + SR)
    out[:len(c)] += c; out[int(0.1*SR):int(0.1*SR)+len(sp)] += sp
    for k in range(4): p = sfx_pop(); st = int((0.05+k*0.12)*SR); out[st:st+len(p)] += 0.5*p
    return out
def sfx_stamp():
    t = t_(0.6); f = 110*np.exp(-t*9)+38; ph = 2*np.pi*np.cumsum(f)/SR
    boom = 0.9*np.sin(ph)*env(len(t), 0.001, 0.18)
    n = int(0.03*SR); click = rng.standard_normal(n)*env(n, 0.0005, 0.006)
    out = boom.copy(); out[:n] += 0.8*click
    cr = rng.standard_normal(len(t))*env(len(t), 0.001, 0.05)*0.15; return out + cr
def sfx_blip():
    out = np.zeros(int(0.9*SR))
    for k in range(6):
        d = 0.06; tt = t_(d); f = 900 + k*140 + 600*tt/d; ph = 2*np.pi*np.cumsum(f)/SR
        b = 0.28*np.sin(ph)*env(len(tt), 0.002, 0.03); st = int(k*0.12*SR); out[st:st+len(b)] += b
    return out
SFX = dict(stamp=sfx_stamp, blip=sfx_blip, count=sfx_count, yay=sfx_yay, bubble=sfx_bubble, heart=sfx_heart, buzz=sfx_buzz, jump=sfx_jump, tick=sfx_tick, drop=sfx_drop, ding=sfx_ding, whoosh=sfx_whoosh, sparkle=sfx_sparkle, vinn=sfx_vinn, pop=sfx_pop,
           swirl=sfx_swirl, click=sfx_click, boing=sfx_boing, chime=sfx_chime)

def music(dur, bpm=112, tr=0, calm=False):
    bpm = bpm; beat = 60/bpm; out = np.zeros(int(dur*SR)+8*SR)
    chords = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]  # C Am F G
    m2f = lambda m: 440*2**((m+tr-69)/12)
    nbars = int(dur/(4*beat))+1
    for bar in range(nbars):
        ch = chords[bar % 4]; b0 = bar*4*beat
        # pad
        t = t_(4*beat); pad = sum(np.sin(2*np.pi*m2f(m-12)*t)+0.3*np.sin(2*np.pi*m2f(m)*t*1.003) for m in ch[:3])
        pad *= 0.035*np.sin(np.pi*t/(4*beat))**0.7; st = int(b0*SR); out[st:st+len(pad)] += pad
        # bas
        bs = 0.12*np.sin(2*np.pi*m2f(ch[0]-24)*t_(beat*1.8))*env(int(beat*1.8*SR), 0.01, 0.4)
        for k in (0, 2): s2 = int((b0+k*beat)*SR); out[s2:s2+len(bs)] += bs
        # arpej (8'lik; sakin modda müzik kutusu, 4'lük)
        pat = [0, 2, 1, 3, 2, 1, 3, 2] if not calm else [0, 2, 3, 1]
        for k, p in enumerate(pat):
            step = beat/2 if not calm else beat
            b = (0.09 if not calm else 0.07)*bell(m2f(ch[p]+12+(12 if calm else 0)), 1.2 if calm else 0.6, 0.5 if calm else 0.18); s2 = int((b0+k*step)*SR); out[s2:s2+len(b)] += b
        # hafif ritim: shaker
        for k in range(0 if calm else 8):
            n = int(0.05*SR); sh = 0.025*rng.standard_normal(n)*env(n, 0.001, 0.012)
            sh = sh - lp(sh, 0.3); s2 = int((b0+k*beat/2)*SR); out[s2:s2+n] += sh*(1.4 if k % 2 else 0.8)
    out = out[:int(dur*SR)]
    fade = int(1.2*SR); out[-fade:] *= np.linspace(1, 0, fade); out[:int(0.4*SR)] *= np.linspace(0, 1, int(0.4*SR))
    return out

def main():
    async def all_lines(): return [await tts(l) for l in LINES]
    res = asyncio.run(all_lines())
    t = LEAD; voice_parts = []; timeline = {"lines": []}
    for text, (pcm, words) in zip(LINES, res):
        pcm, _ = trim(pcm)
        d = len(pcm)/SR
        timeline["lines"].append({"text": text, "start": round(t, 3), "end": round(t+d, 3),
                                  "words": [{"w": w["w"], "s": round(t+w["s"], 3), "e": round(t+w["e"], 3)} for w in words]})
        gi = SCRIPT.get("gaps", {}).get(str(len(voice_parts)), SCRIPT.get("gap", GAP))
        voice_parts.append((t, pcm)); t += d + gi; last_gap = gi
    total = t - last_gap + SCRIPT.get("tail", TAIL); timeline["duration"] = round(total, 3)
    N = int(total*SR); voice = np.zeros(N)
    for st, pcm in voice_parts: i = int(st*SR); voice[i:i+len(pcm)] += pcm

    hop = SR // 30
    rms = np.array([np.sqrt(np.mean(voice[i*hop:(i+1)*hop]**2)) for i in range(N // hop + 1)])
    rms = np.clip(rms / (np.percentile(rms[rms > 0.005], 90) + 1e-9), 0, 1)
    timeline["mouth"] = [round(float(v), 2) for v in rms]

    L = timeline["lines"]
    def word_t(li, sub):
        for w in L[li]["words"]:
            if sub in w["w"].replace("I","ı").replace("İ","i").lower(): return w["s"]
        return L[li]["start"]
    events = [("ding", 0.05)] + ([] if SCRIPT.get("calm") or SCRIPT.get("no_whoosh") else [("whoosh", L[i]["start"]-0.25) for i in range(1, len(L))])
    for ev in SCRIPT["events"]:
        name, li, sub = ev[0], ev[1], ev[2]; off = ev[3] if len(ev) > 3 else 0
        x = word_t(li, sub) if sub else L[li]["start"]
        if sub == "@end": x = L[li]["end"]
        events.append((name, x + off))
    events += [("chime", L[-1]["start"]), ("ding", L[-1]["end"]+0.15)]
    timeline["events"] = [{"name": n, "t": round(max(0, x), 3)} for n, x in events]
    sfx = np.zeros(N + 2*SR)
    for n, x in events:
        s = SFX[n](); i = int(max(0, x)*SR); sfx[i:i+len(s)] += s
    sfx = sfx[:N]

    mus = music(total, SCRIPT.get("bpm", 112), SCRIPT.get("transpose", 0), SCRIPT.get("calm", False))
    speech_env = lp(np.abs(voice), 0.0005) > 0.004
    duck = lp(np.where(speech_env, 0.45, 1.0).astype(float), 0.0003)
    mix = voice*1.0 + 0.55*sfx + 0.8*mus*duck
    peak = np.max(np.abs(mix)); mix *= 0.89/peak  # ≈ -1 dBFS
    with wave.open(os.path.join(EP, "mix.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
    json.dump(timeline, open(os.path.join(EP, "timeline.json"), "w"), ensure_ascii=False, indent=1)
    open(os.path.join(EP, "timeline.js"), "w").write("window.TL=" + json.dumps(timeline, ensure_ascii=False) + ";")
    print("duration", total, "peak dBFS", 20*np.log10(np.max(np.abs(mix))), "words", sum(len(l["words"]) for l in L))

if __name__ == "__main__":
    main()
