// Bilge Kedi v2 motoru (dikey Shorts): halftone dosya çerçevesi + ölçek yakınlaştırma / izometrik anlatım sahneleri.
// Bölüm: window.EP = { caseNo, modes:[ 'dos'|'zoom'|'iso' ... satır başına ], heads:{si:[satırlar]}, stage(t,c), cat(st,c),
//   stamps(c) -> [{t, txt, x, y, rot, col, size}], stickers(c), bigNum:{si:'01'} }
(function () {
  const W = 1080, H = 1920, P = ST.PAL;
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => cl((t - a) / (b - a));
  const eo = x => 1 - Math.pow(1 - x, 3), back = x => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const lerp = (a, b, x) => a + (b - a) * x;
  const low = s => s.replace(/I/g, 'ı').replace(/İ/g, 'i').toLocaleLowerCase('tr');
  window.K2 = { W, H, cl, seg, eo, back, lerp, low };
  const R = ST.rng(21), STARS = [...Array(110)].map(() => ({ x: R() * W, y: R() * H, r: R() * 2.6 + 1, c: [P.zoom.mist, P.zoom.cream, P.zoom.sun][Math.floor(R() * 3)], d: 0.1 + R() * 0.3 }));
  const POSE = { dos: { x: 540, y: 1090, s: 0.74 }, zoom: { x: 850, y: 1655, s: 0.42 }, iso: { x: 850, y: 1655, s: 0.42 } };
  const WIPE = { dos: P.dos.ink, zoom: P.zoom.sun, iso: P.dos.pink };
  let C = null;
  function init() {
    const L = TL.lines;
    const wt = (li, sub) => { for (const w of L[li].words) if (low(w.w).includes(sub)) return w.s; return L[li].start; };
    const sceneStart = i => i === 0 ? 0 : L[i].start - 0.3;
    const CH = [];
    L.forEach((l, li) => { let cur = []; const flush = () => { if (cur.length) CH.push({ li, words: cur }); cur = []; };
      l.words.forEach(w => { const len = cur.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length; if (cur.length >= 3 || len > 18) flush(); cur.push(w); }); flush(); });
    CH.forEach((c, i) => { c.s = c.words[0].s - 0.08; const n = CH[i + 1]; c.e = (n && n.li === c.li) ? n.words[0].s - 0.08 : L[c.li].end + 0.3; });
    C = { L, wt, sceneStart, CH, last: L.length - 1 };
    if (EP.init) EP.init(C);
    C.stamps = EP.stamps ? EP.stamps(C) : []; C.stk = EP.stickers ? EP.stickers(C) : [];
  }
  function bg(mode, t) {
    if (mode === 'zoom') { let s = `<rect width="${W}" height="${H}" fill="${P.zoom.night}"/>`;
      for (const p of STARS) s += `<circle cx="${p.x}" cy="${(p.y + t * 12 * p.d * 10) % H}" r="${p.r}" fill="${p.c}"/>`; return s; }
    if (mode === 'iso') { let s = `<rect width="${W}" height="${H}" fill="${P.iso.ground}"/>`; let d = '';
      for (let i = 0; i < 38; i++) for (let j = 0; j < 66; j++) if ((i + j) % 2 === 0) d += `M${i * 30} ${j * 30}h2.4v2.4h-2.4Z`;
      return s + `<path d="${d}" fill="#d9cfbd"/>`; }
    return ST.paper(W, H) + ST.halftone(0, 0, W, H, 24, 45, ST.fields.edge(W, H, 150), EP.edgeInk || P.dos.pink, 0.62, 'style="mix-blend-mode:multiply" opacity="0.5"');
  }
  function hud(mode, si, t) {
    const dark = mode === 'zoom', fg = dark ? P.zoom.cream : P.dos.ink, bgc = dark ? P.zoom.r2 : P.dos.ink;
    let s = ST.chip(44, 104, `DOSYA #${EP.caseNo}`, bgc, dark ? P.zoom.cream : P.dos.paper, 34);
    if (si > 0 && si < C.last) s += ST.chip(44, 166, `KANIT ${Math.min(si, EP.exhibits || C.last - 1)}/${EP.exhibits || C.last - 1}`, dark ? P.zoom.sun : P.dos.cobalt, dark ? P.zoom.night : P.dos.paper, 30);
    s += `<circle cx="872" cy="92" r="13" fill="${P.dos.red}" opacity="${Math.floor(t * 2) % 2 ? 1 : 0.25}"/><text x="896" y="104" font-family="'JetBrains Mono'" font-weight="800" font-size="32" fill="${fg}">KAYIT</text>`;
    return s;
  }
  function headline(lines, p, mode) { // dosya başlığı: harf harf düşer
    let s = ''; lines.forEach((ln, k) => { const size = ln.length > 9 ? 118 : 150, y = 340 + k * 150;
      const chars = [...ln]; let x = 60; const parts = [];
      chars.forEach((ch, i) => { const q = cl(p * (chars.length * 0.07 + 0.5) / 0.5 - i * 0.07 / 0.5 - k * 0.6); const dy = (1 - back(Math.min(1, q))) * -80;
        parts.push(`<tspan dy="0" opacity="${q > 0 ? 1 : 0}">${ch}</tspan>`); });
      const tx = parts.join('');
      s += `<text x="${60 + 9}" y="${y + 9}" font-family="'Alfa Slab One'" font-size="${size}" fill="${P.dos.cobalt}" style="mix-blend-mode:multiply">${tx}</text><text x="60" y="${y}" font-family="'Alfa Slab One'" font-size="${size}" fill="${P.dos.ink}">${tx}</text>`; });
    return s;
  }
  function bigNum(txt, p) {
    return `<clipPath id="bn"><text x="1110" y="${1000}" text-anchor="end" font-family="'Alfa Slab One'" font-size="620">${txt}</text></clipPath>
      <g clip-path="url(#bn)" style="mix-blend-mode:multiply" opacity="${0.45 * p}">${ST.halftone(260, 480, 860, 560, 20, 30, () => 0.62, P.dos.cobalt, 0.7)}</g>`;
  }
  function render(t) {
    if (!C) init();
    const L = C.L, last = C.last;
    let si = 0; for (let i = 0; i < L.length; i++) if (t >= C.sceneStart(i)) si = i;
    const ts = C.sceneStart(si), into = t - ts, mode = EP.modes[si] || 'dos', prev = si > 0 ? EP.modes[si - 1] : mode;
    const c = Object.assign(C, { t, si, ts, into, mode });
    // damga sarsıntısı + flaş
    let shake = 0, flash = 0;
    for (const k of C.stamps) { if (t > k.t && !(k.end && t > k.end)) { shake = Math.max(shake, Math.exp(-(t - k.t) * 7) * 22); flash = Math.max(flash, 0.5 * (1 - seg(t, k.t, k.t + 0.25))); } }
    const sx = Math.sin(t * 93) * shake, sy = Math.cos(t * 71) * shake;
    let s = `<defs>${ST.defs(t)}</defs>` + bg(mode, t);
    if (mode === 'dos') {
      s += `<g style="mix-blend-mode:multiply">${ST.halftone(0, 500, W, 1300, 22, 15, ST.fields.radial(540, 1020, 120, 560), EP.haloInk || P.dos.yellow, 0.72)}</g>`;
      if (EP.bigNum && EP.bigNum[si]) s += bigNum(EP.bigNum[si], eo(seg(into, 0, 0.5)));
      if (EP.heads && EP.heads[si]) s += headline(EP.heads[si], seg(into, 0.05, 0.9), mode);
      if (EP.subs && EP.subs[si]) s += `<text x="64" y="${340 + EP.heads[si].length * 150 - 60}" font-family="'JetBrains Mono'" font-weight="800" font-size="34" fill="${P.dos.ink}" opacity="${seg(into, 0.6, 0.9)}">${EP.subs[si]}</text>`;
    }
    s += `<g transform="translate(${sx} ${sy})">${EP.stage(t, c) || ''}</g>`;
    // kedi
    const A = POSE[prev], B = POSE[mode], pk = si === 0 ? 1 : eo(seg(into, 0, 0.5));
    const pos = { x: lerp(A.x, B.x, pk), y: lerp(A.y, B.y, pk), s: lerp(A.s, B.s, pk) };
    if (EP.catPos) Object.assign(pos, EP.catPos(c, pos) || {});
    const fi = Math.min(TL.mouth.length - 1, Math.round(t * 30)), bt = t % 3.1;
    const st = { mouth: cl(TL.mouth[fi] * 0.9), blink: bt < 0.13 ? Math.sin(bt / 0.13 * Math.PI) : 0, tail: Math.sin(t * 3), glint: 0, lookX: 0, lookY: 0, ear: 0, brow: 0.3, happy: 0 };
    if (mode !== 'dos') { st.lookX = -0.6; st.lookY = -0.7; }
    if (si === 0) { st.glint = seg(t, 0.1, 0.3) - seg(t, 0.8, 1.1); st.brow = 0.9; }
    if (si === last) { st.happy = t > L[last].end - 0.2 ? 1 : 0; st.tail = Math.sin(t * 8); }
    for (const k of C.stamps) if (t > k.t && t < k.t + 1.2) { st.ear = 1; st.brow = 1; st.happy = 0; }
    if (EP.cat) EP.cat(st, c);
    s += `<g transform="translate(${sx * 0.5} ${sy * 0.5})">${ST.cat(st, pos, mode === 'zoom' ? 'inkDark' : 'ink')}</g>`;
    if (EP.front) s += EP.front(t, c);
    // damgalar
    for (const k of C.stamps) { if (t < k.t - 0.09 || (k.end && t > k.end)) continue; const q = seg(t, k.t - 0.09, k.t);
      const sc = q < 1 ? lerp(2.6, 1, q * q) : 1 + 0.06 * Math.exp(-(t - k.t) * 9) * Math.cos((t - k.t) * 40);
      s += ST.stamp(k.x, k.y, k.txt, k.col || P.dos.red, k.rot || -12, sc, k.size || 104); }
    s += hud(mode, si, t);
    if (mode === 'dos') s += ST.grain(W, H, t, P.dos.paper, P.dos.ink, 200);
    // çıkış
    if (si === last) { const lp = back(seg(t, L[last].end + 0.05, L[last].end + 0.5));
      if (lp > 0) s += `<g transform="translate(540 300) scale(${lp})">${ST.headline(0, 0, 130, 'BİLGE KEDİ', P.dos.ink, P.dos.cobalt, 'middle')}
        <text x="0" y="90" text-anchor="middle" font-family="'JetBrains Mono'" font-weight="800" font-size="40" fill="${P.dos.ink}">YARIN YENİ BİR DOSYA!</text></g>`; }
    // nokta silme geçişi (sahne değişiminde ekranı kaplar)
    for (let i = 1; i <= last; i++) { const b = C.sceneStart(i), p = (t - (b - 0.24)) / 0.24; if (p > 0 && p < 2) s += ST.dotWipe(W, H, p, WIPE[EP.modes[i] || 'dos']); }
    if (flash > 0) s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${flash}"/>`;
    document.getElementById('s').innerHTML = s;
    // altyazı şeridi
    const cap = document.getElementById('cap'), ch = C.CH.find(k => t >= k.s && t < k.e);
    cap.style.top = (mode === 'dos' ? 1500 : 1290) + 'px';
    if (ch && !(si === last && t > L[last].end)) {
      const vis = ch.words.filter(w => t >= w.s - 0.06);
      cap.innerHTML = vis.map((w, i) => { const a = seg(t, w.s - 0.06, w.s + 0.1), sc = a < 1 ? lerp(0.5, 1.1, back(a)) : 1, on = i === vis.length - 1 && t < w.e + 0.3;
        return `<span style="transform:scale(${sc});color:${on ? '#ffc72c' : '#fff3dc'}">${w.w}</span>`; }).join(' ');
      cap.style.display = 'flex';
    } else cap.style.display = 'none';
    let html = '';
    for (const k of C.stk) { const p = seg(t, k.t, k.t + 0.3), q = 1 - seg(t, k.t + (k.d || 1.0), k.t + (k.d || 1.0) + 0.25); if (p <= 0 || q <= 0) continue;
      html += `<div style="position:absolute;left:0;right:0;top:${k.y}px;transform:translateX(${k.dx || 0}px) scale(${back(p) * q}) rotate(${-8 + 4 * Math.sin(t * 8)}deg);font-size:${k.size || 200}px;color:${k.col}">${k.txt}</div>`; }
    document.getElementById('stk').innerHTML = html;
  }
  window.renderAt = render;
})();
