(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${s}" fill="${col}">${txt}</text>`;
  function module(t, c, water) { // izometrik modül kesiti
    const o = { x: 540, y: 820, k: 1 }; let s = `<ellipse cx="540" cy="1060" rx="420" ry="70" fill="#2b2440" opacity="0.12"/>`;
    s += ST.isoBox(-320, -160, 0, 640, 320, 24, '#c9c2b2', o) + ST.isoBox(-320, -180, 24, 640, 20, 300, '#e8dccb', o);
    // duvardaki uyku tulumu (arka duvar, y=-160)
    const bag = (x) => { const a = ST.isoP(x, -158, 90, o), b = ST.isoP(x + 70, -158, 90, o), cc = ST.isoP(x + 70, -158, 250, o), d = ST.isoP(x, -158, 250, o);
      return `<path d="M ${a.join(' ')} L ${b.join(' ')} L ${cc.join(' ')} L ${d.join(' ')} Z" fill="#4D7CFE"/><circle cx="${(d[0] + cc[0]) / 2}" cy="${(d[1] + cc[1]) / 2 + 26}" r="20" fill="#ffd2b0"/>${ST.isoP(0, 0, 0, o) && ''}`; };
    s += bag(-260) + bag(-150);
    // süzülen nesneler
    const items = [['🍎', -40, 160], ['📘', 120, 200], ['🔧', 230, 140]];
    items.forEach(([ic, x, zz], i) => { const p = ST.isoP(x, 0, zz + Math.sin(t * 1.5 + i) * 18, o); s += `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-size="64" transform="rotate(${Math.sin(t + i) * 20} ${p[0]} ${p[1]})">${ic}</text>`; });
    const ap = ST.isoP(60, 20, 170 + Math.sin(t * 1.2) * 16, o); s += SP.astronaut(ap[0], ap[1], 1.3, -20 + Math.sin(t) * 10, t);
    if (water) for (let i = 0; i < 6; i++) { const p = ST.isoP(-200 + i * 70, 40, 120 + Math.sin(t * 2 + i) * 30, o), r = 16 + (i % 3) * 6;
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="#7fc8ff" opacity="0.85"/><circle cx="${p[0] - r * 0.3}" cy="${p[1] - r * 0.3}" r="${r * 0.3}" fill="#fff"/>`; }
    const a1 = ST.isoP(-220, -158, 250, o); s += ST.pin(a1[0], a1[1], 60, 'UYKU TULUMU', 'duvara bağlı', 1);
    return s;
  }
  window.EP = {
    caseNo: '11', exhibits: 5, modes: ['dos', 'zoom', 'zoom', 'zoom', 'iso', 'iso', 'dos', 'dos'],
    heads: { 0: ['16 GÜN', 'DOĞUMU?'], 6: ['GÖKTEKİ', 'EV'] }, subs: { 0: 'BU EV NEREDE?', 6: 'ULUSLARARASI UZAY İSTASYONU' }, bigNum: { 0: '11', 6: '90dk' },
    stage(t, c) {
      const { si, into, L } = c; let s = '';
      if (si === 1) { s += SP.stars(1080, 1920, 50, 4) + SP.planet(540, 1500, 700, 'earth', t);
        const p = back(seg(into, 0.6, 1.2)); s += SP.iss(540, 560, 0.9 * p, -6 + Math.sin(t) * 2);
        s += `<path d="M 540 660 V 790" stroke="${z.sun}" stroke-width="5" stroke-dasharray="10 10"/>` + (p > 0.5 ? ST.nextStop(540, 560, 230, 'YÜKSEKLİK', '400 km', 640, 300, t).replace(/r="230"/g, 'r="0"') + big(700, 880, 64, '400 km') : ''); }
      if (si === 2) { const a = t * 1.6; s += SP.planet(540, 760, 260, 'earth', t) + `<ellipse cx="540" cy="760" rx="420" ry="300" fill="none" stroke="${z.r2}" stroke-width="6"/>`;
        for (let k = 1; k < 10; k++) { const b = a - k * 0.08; s += `<circle cx="${540 + Math.cos(b) * 420}" cy="${760 + Math.sin(b) * 300}" r="${8 - k * 0.6}" fill="${z.sun}"/>`; }
        s += SP.iss(540 + Math.cos(a) * 420, 760 + Math.sin(a) * 300, 0.3, a * 57);
        s += big(540, 330, 72, '28.000 km/sa') + (t > c.wt(2, 'doksan') - 0.2 ? big(540, 1200, 110, '90 dk = 1 tur', z.cream) : ''); }
      if (si === 3) { const n = Math.min(16, Math.floor(seg(t, c.wt(3, 'on') - 0.3, L[3].end + 0.2) * 16) + 1);
        s += SP.planet(540, 760, 300, 'earth', t) + `<path d="M 540 460 A 300 300 0 0 1 540 1060 Z" fill="${z.night}" opacity="0.55"/>`;
        s += SP.sunGlow(130, 420, 60, t);
        for (let i = 0; i < n; i++) s += `<g transform="translate(${130 + (i % 8) * 116} ${1180 + Math.floor(i / 8) * 90})">${SP.planet(0, 0, 30, 'sun', t)}</g>`;
        s += big(540, 330, 96, `${n} gün doğumu!`); }
      if (si === 4 || si === 5) s += module(t, c, si === 5) + `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">İSTASYONUN İÇİ</text>`;
      if (si === 6) s += SP.iss(760, 820, 0.85, -8);
      return s;
    },
    catPos(c) { if (c.si === 6) return { x: 300, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 5) st.happy = 1; if (c.si === 3) st.glint = 0.6; },
    stamps(c) { return [{ t: c.wt(6, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 690, y: 1200, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '🛰️?', col: '#ffc84a', y: 560, dx: 330, size: 170 }]; },
  };
})();
