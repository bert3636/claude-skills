(function () {
  const { seg, eo, back, lerp } = K;
  const VARS = [[[0.4, 0.32], [0.68, 0.24], [0.88, 0.12]], [[0.35, 0.18], [0.6, 0.36], [0.85, 0.16]], [[0.5, 0.4], [0.8, 0.2]]];
  function flake(cx, cy, r, rot, v = 0, grow = 1, hi = -1, out = false) {
    let d = '', dh = '';
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 + rot, L = r * grow;
      let p = `M ${cx} ${cy} L ${cx + Math.cos(a) * L} ${cy + Math.sin(a) * L} `;
      for (const [f, bl] of VARS[v]) { if (f > grow) continue;
        const bx = cx + Math.cos(a) * r * f, by = cy + Math.sin(a) * r * f, b = r * bl * Math.min(1, (grow - f) * 4);
        for (const sgn of [-1, 1]) { const aa = a + sgn * Math.PI / 3; p += `M ${bx} ${by} L ${bx + Math.cos(aa) * b} ${by + Math.sin(aa) * b} `; } }
      if (i === hi) dh += p; else d += p;
    }
    const hex = [...Array(6)].map((_, i) => { const a = i / 6 * Math.PI * 2 + rot; return `${cx + Math.cos(a) * r * 0.14} ${cy + Math.sin(a) * r * 0.14}`; }).join(' L ');
    return `${out ? `<path d="${d}" stroke="#1f3a8a" stroke-width="${r * 0.15}" stroke-linecap="round" fill="none"/>` : ''}<path d="${d}${dh}" stroke="#bfe9ff" stroke-width="${r * 0.12}" stroke-linecap="round" fill="none" opacity="0.6" filter="url(#b12)"/>
      <path d="${d}" stroke="#fff" stroke-width="${r * 0.07}" stroke-linecap="round" fill="none"/>
      ${dh ? `<path d="${dh}" stroke="#7af0ff" stroke-width="${r * 0.09}" stroke-linecap="round" fill="none"/>` : ''}
      <path d="M ${hex} Z" fill="#e8f8ff" stroke="#fff" stroke-width="${r * 0.04}"/>`;
  }
  function heart(x, y, s, o) {
    return `<path transform="translate(${x} ${y}) scale(${s})" d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#ff7fb0" stroke="#1a1040" stroke-width="6" opacity="${o}"/>`;
  }
  window.EP = {
    theme: 'winter', bigScenes: [0, 5],
    init(c) { c.T = { kr: c.wt(1, 'kristalleri'), dog: c.wt(1, 'doğar'), buy: c.wt(2, 'büyür'), alti: c.wt(2, 'altı'), yil: c.wt(2, 'yıldıza'), far: c.wt(3, 'farklı'),
      hic: c.wt(3, 'hiçbiri'), tip: c.wt(4, 'tıpkı'), es: c.wt(4, 'eşsizsin'), oz: c.wt(4, 'özelsin') }; },
    stage(t, c) {
      const { si, into, T } = c; let s = '';
      if (si === 0) s += `<circle cx="540" cy="1000" r="${320 + 40 * Math.sin(t * 3)}" fill="#a8d8ff" opacity="0.3" filter="url(#b80)"/>` + flake(220, 520, 80, t, 0, 1);
      if (si === 1) {
        s += `<g opacity="0.95">${K.cloud(540, 400, 2.2)}</g>`;
        for (let i = 0; i < 8; i++) { const x = 380 + (i * 53) % 330, y = 360 + (i * 37) % 90, o = Math.max(0, Math.sin(t * 5 + i * 1.7)) * seg(t, T.kr - 0.2, T.kr + 0.2);
          s += `<path d="M ${x} ${y - 16} L ${x + 5} ${y - 5} L ${x + 16} ${y} L ${x + 5} ${y + 5} L ${x} ${y + 16} L ${x - 5} ${y + 5} L ${x - 16} ${y} L ${x - 5} ${y - 5} Z" fill="#7af0ff" opacity="${o}"/>`; }
        const d = eo(seg(t, T.dog - 0.1, T.dog + 0.6)); if (d > 0) s += flake(540, lerp(430, 720, d), 60, t * 0.8, 0, 0.18);
      }
      if (si === 2) {
        const g = lerp(0.18, 1, eo(seg(t, T.buy - 0.1, T.yil + 0.3)));
        const hi = t > T.alti - 0.05 && t < T.alti + 0.6 ? Math.floor(seg(t, T.alti - 0.05, T.alti + 0.6) * 6) : -1;
        s += flake(540, lerp(480, 600, eo(seg(into, 0, 2.5))), 280, t * 0.5, 0, g, hi);
        if (hi >= 0) s += K.text(540, 220, 150, String(hi + 1), '#7af0ff');
      }
      if (si === 3) {
        const lanes = [[240, 0, 1.3, 70], [540, 1, 0.8, 110], [840, 2, 1.7, 50]];
        lanes.forEach(([x0, v, fr, amp], i) => { const pr = seg(into, 0.1 + i * 0.25, 4.2 + i * 0.2);
          let tr = ''; for (let k = 0; k <= 40; k++) { const q = pr * k / 40; tr += `${k ? 'L' : 'M'} ${x0 + Math.sin(q * 12 * fr) * amp} ${lerp(160, 860, q)} `; }
          s += `<path d="${tr}" stroke="#fff" stroke-width="6" stroke-dasharray="3 16" stroke-linecap="round" fill="none" opacity="0.7"/>`;
          s += flake(x0 + Math.sin(pr * 12 * fr) * amp, lerp(160, 860, pr), 90, t * (0.6 + i * 0.3), v, 1); });
        const ne = back(seg(t, T.hic - 0.05, T.hic + 0.3)); if (ne > 0) s += `<g transform="translate(0 0)">${K.text(390, 900, 140 * ne, '≠', '#ffd84d')}${K.text(690, 900, 140 * ne, '≠', '#ffd84d')}</g>`;
      }
      return s;
    },
    front(t, c) {
      if (c.si !== 4) return '';
      const { T } = c; const p = eo(seg(t, c.L[4].start - 0.2, T.tip + 0.3));
      let s = flake(lerp(540, 540, p) + Math.sin(t * 3) * 60 * (1 - p), lerp(250, 1458, p), lerp(90, 44, p), t * 0.7, 1, 1, -1, true);
      for (let i = 0; i < 6; i++) { const ph = ((t - T.es) * 0.6 + i / 6) % 1; if (t < T.es) break;
        s += heart(540 + Math.cos(i * 1.7) * 330 + Math.sin(t * 2 + i) * 20, lerp(1600, 1050, ph), 1.1, 1 - ph); }
      return s;
    },
    catOver() { // atkı
      return `<path d="M 168 462 Q 350 545 532 462 L 545 515 Q 350 610 155 515 Z" fill="#ff4f6d" stroke="#1a1040" stroke-width="7"/>
        <path d="M 230 492 L 222 548 M 300 512 L 296 572 M 400 512 L 404 572 M 470 492 L 478 548" stroke="#fff" stroke-width="16"/>
        <path d="M 410 530 L 470 700 L 400 715 L 370 545 Z" fill="#ff4f6d" stroke="#1a1040" stroke-width="7" stroke-linejoin="round"/>
        <path d="M 395 590 L 448 578 M 410 640 L 462 628" stroke="#fff" stroke-width="14"/>`;
    },
    cat(st, c) { if (c.si >= 1 && c.si <= 3) st.lookY = -1;
      if (c.si === 4) { const p = seg(c.t, c.L[4].start - 0.2, c.T.tip + 0.3); st.lookY = lerp(-1, 0.9, p); st.brow = p > 0.9 ? 0.9 : 0.3;
        st.glint = seg(c.t, c.T.oz, c.T.oz + 0.1) - seg(c.t, c.T.oz + 0.5, c.T.oz + 0.8); } },
    stickers(c) { return [{ t: 0.4, txt: '❄️?', col: '#7af0ff', y: 470, dx: 300, size: 170 }, { t: c.T.es, txt: 'EŞSİZSİN!', col: '#ff7fb0', y: 120, size: 160, d: 1.6 }]; },
    flashes(c) { return []; },
  };
})();
