(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${s}" fill="${col}">${txt}</text>`;
  const star4 = (x, y, r, col = z.cream) => `<path d="M ${x} ${y - r} L ${x + r * 0.25} ${y - r * 0.25} L ${x + r} ${y} L ${x + r * 0.25} ${y + r * 0.25} L ${x} ${y + r} L ${x - r * 0.25} ${y + r * 0.25} L ${x - r} ${y} L ${x - r * 0.25} ${y - r * 0.25} Z" fill="${col}"/>`;
  function atmos(t, c, bend) {
    const o = { x: 540, y: 1020, k: 0.75 }; let s = `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">HAVAMIZ</text>`;
    s += ST.isoBox(-300, -300, 0, 600, 600, 60, '#5fc36a', o);
    [['#cfe8ff', 120], ['#e2f1ff', 110], ['#eef7ff', 100]].forEach(([col, h], i) => s += `<g opacity="0.75">${ST.isoBox(-300, -300, 60 + i * 120, 600, 600, h, col, o)}</g>`);
    const top = ST.isoP(0, 0, 420, o), bot = ST.isoP(0, 0, 60, o);
    let d = `M ${top[0]} ${top[1] - 300} L ${top[0]} ${top[1]}`;
    for (let k = 1; k <= 8; k++) { const y = lerp(top[1], bot[1], k / 8), x = top[0] + (bend ? Math.sin(t * 6 + k * 1.3) * 40 * (k / 8) : 0); d += ` L ${x} ${y}`; }
    s += `<path d="${d}" stroke="#ffc84a" stroke-width="10" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` + star4(top[0], top[1] - 300, 40, '#ffc84a');
    if (bend) for (let i = 0; i < 5; i++) { const p = ST.isoP(-200 + i * 100, 100, 150 + (i % 3) * 90, o); s += `<path d="M ${p[0] - 50} ${p[1]} q 25 ${-18 + Math.sin(t * 3 + i) * 10} 50 0 t 50 0" stroke="${P.iso.ink}" stroke-width="4" fill="none" opacity="0.6"/>`; }
    const e = ST.isoP(300, -300, 300, o); s += ST.pin(e[0], e[1], 40, 'ATMOSFER', 'hareketli hava', -1);
    return s;
  }
  window.EP = {
    caseNo: '13', exhibits: 5, modes: ['dos', 'zoom', 'iso', 'iso', 'zoom', 'zoom', 'dos', 'dos'],
    heads: { 0: ['GÖZ KIRPAN', 'YILDIZLAR'], 6: ['SUÇLU:', 'HAVAMIZ!'] }, subs: { 0: 'NEDEN TİTRİYORLAR?', 6: 'YILDIZ DOSYASI' }, bigNum: { 0: '13', 6: '✦' },
    stage(t, c) {
      const { si, into } = c; let s = '';
      if (si === 1) { s += SP.stars(1080, 1920, 60, 21) + SP.sunGlow(540, 300, 60, t) + SP.planet(540, 1080, 90, 'earth', t);
        const p = eo(seg(into, 0.2, 3)); s += ST.sightLine(540, 380, 540, lerp(380, 980, p), t, 16);
        s += ST.scaleRibbon(70, 1180, 380, p, ['yıldız', '', 'Dünya'], 'milyonlarca km'); }
      if (si === 2) s += atmos(t, c, false);
      if (si === 3) s += atmos(t, c, true);
      if (si === 4) { s += `<path d="M 0 1060 Q 300 960 600 1030 T 1080 1000 V 1920 H 0 Z" fill="${z.r1}"/>`;
        for (let i = 0; i < 9; i++) { const R = ST.rng(i * 313 + 4); R(); const x = 120 + R() * 840, y = 300 + R() * 600, k = 0.5 + 0.5 * Math.sin(t * (6 + i) + i * 2);
          s += `<circle cx="${x}" cy="${y}" r="${30 * k + 10}" fill="${z.r2}"/>` + star4(x, y, 18 + 26 * k, [z.cream, z.sun, '#9fdcff'][i % 3]); }
        s += big(540, 1180, 72, 'parıl… parıl…', z.cream); }
      if (si === 5) { s += SP.stars(1080, 1920, 80, 31) + SP.planet(540, 1700, 600, 'earth', t);
        for (let i = 0; i < 8; i++) { const R = ST.rng(i * 77 + 9); R(); s += star4(100 + R() * 880, 200 + R() * 700, 22, [z.cream, z.sun][i % 2]); }
        s += SP.astronaut(800, 780, 1.1, -12, t) + big(540, 300, 64, 'uzayda: hep sabit ✦', z.cream); }
      if (si === 6) for (let i = 0; i < 5; i++) { const k = 0.5 + 0.5 * Math.sin(t * 7 + i * 2); s += star4(640 + (i % 3) * 140, 720 + Math.floor(i / 3) * 160, 24 + 30 * k, P.dos.yellow); }
      return s;
    },
    catPos(c) { if (c.si === 6) return { x: 300, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 4) { st.blink = Math.max(st.blink, Math.sin(c.t * 4) > 0.8 ? 1 : 0); } if (c.si === 5) st.happy = 1; },
    stamps(c) { return [{ t: c.wt(6, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 690, y: 1200, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '✨?', col: '#ffc84a', y: 560, dx: 330, size: 170 }]; },
  };
})();
