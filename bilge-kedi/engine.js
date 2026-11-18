// Bilge Kedi ortak motoru: arka plan, kedi, altyazı, çıkartmalar, flaş, logo.
// Bölüm dosyası window.EP = { theme, stage(t,c), cat(st,c), catOver(c,P), catDy(c), stickers(c), flashes(c), shakes(c), poses }
(function () {
  const W = 1080, H = 1920;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const eo = x => 1 - Math.pow(1 - x, 3);
  const back = x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const lerp = (a, b, x) => a + (b - a) * x;
  function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  const low = s => s.replace(/I/g, 'ı').replace(/İ/g, 'i').toLocaleLowerCase('tr');
  window.K = { W, H, cl, seg, eo, back, lerp, rng, low };

  const THEMES = {
    space: { g: ['#3a2a7a', '#1a1450', '#07071c'], neb: ['#ff5fa8', '#3fd0ff'], stars: true },
    ocean: { g: ['#1f8fd0', '#0d4f8f', '#06223f'], neb: ['#5ff0ff', '#3a7dff'], bubbles: true, rays: true },
    sky:   { g: ['#bfe9ff', '#7cc8ff', '#4a9be8'], neb: ['#ffffff', '#ffe28a'], clouds: true },
    meadow:{ g: ['#d8f3ff', '#9ad8ff', '#6cc0f5'], neb: ['#fff6b0', '#ffffff'], clouds: true, hills: true },
    winter:{ g: ['#4b5fa8', '#26306e', '#111637'], neb: ['#a8d8ff', '#d0a8ff'], stars: true, snow: true },
  };
  const R = rng(11);
  const PTS = [...Array(170)].map(() => ({ x: R() * W, y: R() * H, r: R() * 2.8 + 0.5, d: R() * 0.8 + 0.2, p: R() * 6 }));
  const DEFS = `<filter id="b80" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="80"/></filter>
    <filter id="b30" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="30"/></filter>
    <filter id="b12" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="b4" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter>`;

  function cloud(x, y, s, o = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="20" rx="130" ry="50" fill="#fff"/>
      <circle cx="-55" cy="0" r="55" fill="#fff"/><circle cx="20" cy="-25" r="70" fill="#fff"/><circle cx="80" cy="5" r="48" fill="#fff"/></g>`;
  }
  K.cloud = cloud;
  function bg(t, c) {
    const th = THEMES[EP.theme || 'space'];
    let s = `<defs>${DEFS}<radialGradient id="bg" cx="50%" cy="30%" r="85%"><stop offset="0" stop-color="${th.g[0]}"/><stop offset="0.5" stop-color="${th.g[1]}"/><stop offset="1" stop-color="${th.g[2]}"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <circle cx="${200 + Math.sin(t * .3) * 40}" cy="520" r="280" fill="${th.neb[0]}" opacity="0.22" filter="url(#b80)"/>
      <circle cx="${900 + Math.cos(t * .25) * 40}" cy="1250" r="320" fill="${th.neb[1]}" opacity="0.18" filter="url(#b80)"/>`;
    if (th.rays) for (let i = 0; i < 5; i++) { const x = 150 + i * 200 + Math.sin(t * 0.5 + i) * 40;
      s += `<path d="M ${x - 40} 0 L ${x + 40} 0 L ${x + 160} ${H} L ${x - 60} ${H} Z" fill="#bff6ff" opacity="${0.06 + 0.03 * Math.sin(t + i)}"/>`; }
    if (th.stars) for (const p of PTS) { const y = (p.y + t * 40 * p.d) % H;
      s += `<circle cx="${p.x}" cy="${y}" r="${p.r}" fill="#fff" opacity="${(0.35 + 0.65 * Math.abs(Math.sin(t * 1.7 + p.p))) * p.d}"/>`; }
    if (th.bubbles) for (const p of PTS.slice(0, 50)) { const y = H - ((p.y + t * 160 * p.d) % (H + 100)); const x = p.x + Math.sin(t * 2 + p.p) * 14;
      s += `<circle cx="${x}" cy="${y}" r="${p.r * 4}" fill="none" stroke="#dffaff" stroke-width="3" opacity="${0.5 * p.d}"/><circle cx="${x - p.r * 1.3}" cy="${y - p.r * 1.3}" r="${p.r}" fill="#fff" opacity="${0.6 * p.d}"/>`; }
    if (th.clouds) for (let i = 0; i < 4; i++) { const x = ((i * 330 + t * (25 + i * 8)) % 1500) - 200;
      s += cloud(x, 180 + i * 230, 0.7 + (i % 2) * 0.4, 0.75); }
    if (th.hills) s += `<path d="M 0 1420 Q 270 1300 540 1400 T 1080 1380 V 1920 H 0 Z" fill="#7fd36a"/><path d="M 0 1520 Q 300 1440 600 1530 T 1080 1500 V 1920 H 0 Z" fill="#5cbf4f"/>`;
    if (th.snow) for (const p of PTS.slice(0, 90)) { const y = (p.y + t * 90 * p.d) % H; const x = p.x + Math.sin(t * 1.3 + p.p) * 30;
      s += `<circle cx="${x}" cy="${y}" r="${p.r * 1.8}" fill="#fff" opacity="${0.4 + 0.5 * p.d}"/>`; }
    const dk = EP.dark ? EP.dark(t, c) : 0;
    return s + (dk ? `<rect width="${W}" height="${H}" fill="#000" opacity="${dk}"/>` : '');
  }
  function burst(cx, cy, r, col, rot) { let p = ''; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + rot, rr = i % 2 ? r * 0.7 : r; p += `${i ? 'L' : 'M'} ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr} `; }
    return `<path d="${p}Z" fill="${col}" stroke="#1a1040" stroke-width="12" stroke-linejoin="round"/>`; }
  K.burst = burst;
  K.text = (x, y, size, txt, fill = '#fff', anchor = 'middle', extra = '') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="'Baloo 2'" font-weight="800" font-size="${size}" fill="${fill}" stroke="#1a1040" stroke-width="${size * 0.14}" paint-order="stroke" ${extra}>${txt}</text>`;

  const POSE = { big: { x: 540, y: 1060, s: 1.1 }, nar: { x: 540, y: 1540, s: 0.7 } };
  let C = null;
  function init() {
    const L = TL.lines;
    const wt = (li, sub) => { for (const w of L[li].words) if (low(w.w).includes(sub)) return w.s; return L[li].start; };
    const we = (li, sub) => { for (const w of L[li].words) if (low(w.w).includes(sub)) return w.e; return L[li].end; };
    const sceneStart = i => i === 0 ? 0 : L[i].start - 0.3;
    const CH = [];
    L.forEach((l, li) => { let cur = []; const flush = () => { if (cur.length) CH.push({ li, words: cur }); cur = []; };
      l.words.forEach(w => { const len = cur.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length; if (cur.length >= 3 || len > 16) flush(); cur.push(w); }); flush(); });
    CH.forEach((c, i) => { c.s = c.words[0].s - 0.08; const n = CH[i + 1]; c.e = (n && n.li === c.li) ? n.words[0].s - 0.08 : L[c.li].end + 0.25; });
    C = { L, wt, we, sceneStart, CH, last: L.length - 1 };
    if (EP.init) EP.init(C);
    C.stk = EP.stickers ? EP.stickers(C) : [];
    C.fl = EP.flashes ? EP.flashes(C) : [];
    C.sh = EP.shakes ? EP.shakes(C) : [];
  }

  function render(t) {
    if (!C) init();
    const L = C.L, last = C.last;
    let si = 0; for (let i = 0; i < L.length; i++) if (t >= C.sceneStart(i)) si = i;
    const ts = C.sceneStart(si), into = t - ts, inP = eo(seg(into, 0, 0.35));
    const c = Object.assign(C, { t, si, ts, into, inP });
    let shake = 0; for (const x of C.sh) if (t > x) shake = Math.max(shake, Math.exp(-(t - x) * 6) * 26);
    const sx = Math.sin(t * 90) * shake, sy = Math.cos(t * 77) * shake;
    const stage = EP.stage(t, c) || '';
    const isBig = i => (EP.bigScenes || [0, last]).includes(i);
    const big = isBig(si), prevBig = si > 0 && isBig(si - 1);
    const A = POSE[prevBig ? 'big' : 'nar'], B = POSE[big ? 'big' : 'nar'];
    const pk = si === 0 ? 1 : eo(seg(into, 0, 0.45));
    const P = { x: lerp(A.x, B.x, pk), y: lerp(A.y, B.y, pk), s: lerp(A.s, B.s, pk), big };
    if (si === 0) P.s *= lerp(0.85, 1, eo(seg(t, 0, 0.6)));
    if (EP.catDy) P.y += EP.catDy(c, P);
    const fi = Math.min(TL.mouth.length - 1, Math.round(t * 30));
    const bt = (t % 2.9);
    const st = { mouth: cl(TL.mouth[fi] * 0.9), blink: bt < 0.14 ? Math.sin(bt / 0.14 * Math.PI) : 0, tail: Math.sin(t * (si === last ? 7 : 3)),
      glint: 0, lookX: 0, lookY: big ? 0 : -1, ear: 0, brow: 0.2 };
    if (si === 0) { st.glint = seg(t, 0.1, 0.3) - seg(t, 0.8, 1.1); st.brow = 0.8; }
    if (si === 1) { st.glint = seg(into, 0.2, 0.4) - seg(into, 0.7, 1); }
    if (si === last) { st.lookY = 0; st.brow = 0.5; if (t > L[last].end - 0.1) st.blink = Math.sin(seg(t, L[last].end - 0.1, L[last].end + 0.25) * Math.PI); }
    if (EP.cat) EP.cat(st, c);
    const tf = `translate(${P.x - 350 * P.s} ${P.y - 480 * P.s}) scale(${P.s})`;
    const cat = `<g transform="${tf}">${drawCat(st)}${EP.catOver ? EP.catOver(c, st) : ''}</g>`;
    let flash = 0; for (const x of C.fl) if (t > x) flash = Math.max(flash, 1 - seg(t, x, x + 0.33));
    const trans = si > 0 ? 1 - seg(into, 0, 0.2) : 0;
    let logo = '';
    const lp = back(seg(t, L[last].end + 0.05, L[last].end + 0.5));
    if (si === last && lp > 0) logo = `<g transform="translate(540 330) scale(${lp})">${K.text(0, 0, 150, 'Bilge Kedi')}${K.text(0, 110, 70, '⭐ Yarın yeni bir sır! ⭐', '#ffd84d')}</g>`;
    const front = EP.front ? EP.front(t, c) : '';
    document.getElementById('s').innerHTML = bg(t, c) +
      `<g transform="translate(${sx} ${sy}) translate(540 960) scale(${lerp(1.08, 1, inP)}) translate(-540 -960)" opacity="${si === 0 ? 1 : lerp(0.2, 1, inP)}">${stage}</g>` +
      `<g transform="translate(${sx * 0.5} ${sy * 0.5})">${cat}</g>${front}${logo}` +
      `<rect width="${W}" height="${H}" fill="#fff" opacity="${Math.max(flash * 0.85, trans * 0.25)}"/>`;
    // altyazı: yalnızca söylenmiş kelimeler (ortalı)
    const cap = document.getElementById('cap'); const ch = C.CH.find(k => t >= k.s && t < k.e);
    cap.style.top = (big ? 200 : (EP.capY || 1010)) + 'px';
    if (ch && !(si === last && t > L[last].end)) {
      const vis = ch.words.filter(w => t >= w.s - 0.06); cap.innerHTML = vis.map((w, wi) => { const a = seg(t, w.s - 0.06, w.s + 0.1);
        const sc = a < 1 ? lerp(0.4, 1.12, back(a)) : 1; const on = wi === vis.length - 1 && t < w.e + 0.3;
        return `<span style="transform:scale(${on ? Math.max(sc, 1.06) : sc}) rotate(${on ? -2 : 0}deg);color:${on ? '#ffd84d' : '#fff'}">${w.w}</span>`; }).join('');
    } else cap.innerHTML = '';
    let html = '';
    for (const k of C.stk) { const p = seg(t, k.t, k.t + 0.3), q = 1 - seg(t, k.t + (k.d || 1.0), k.t + (k.d || 1.0) + 0.25); if (p <= 0 || q <= 0) continue;
      const s = back(p) * q; html += `<div style="position:absolute;left:0;right:0;top:${k.y}px;transform:translateX(${k.dx || 0}px) scale(${s}) rotate(${-8 + 4 * Math.sin(t * 8)}deg);font-size:${k.size || 220}px;color:${k.col}">${k.txt}</div>`; }
    document.getElementById('stk').innerHTML = html;
  }
  window.renderAt = render;
})();
