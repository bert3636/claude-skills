(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  function ant(x, y, s, a, t, col = '#7a3b2e', colS = '#5a2a20') {
    const lg = Math.sin(t * 14) * 8;
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">
      <path d="M -10 0 L -30 ${-26 + lg} M -10 0 L -34 ${24 - lg} M 4 0 L -4 ${-30 - lg} M 4 0 L 0 ${30 + lg} M 16 0 L 30 ${-26 + lg} M 16 0 L 34 ${24 - lg}" stroke="${colS}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="-34" cy="0" rx="26" ry="18" fill="${colS}"/><ellipse cx="-36" cy="-3" rx="22" ry="14" fill="${col}"/>
      <ellipse cx="4" cy="0" rx="14" ry="10" fill="${col}"/>
      <circle cx="34" cy="0" r="15" fill="${colS}"/><circle cx="32" cy="-2" r="12" fill="${col}"/>
      <path d="M 42 -8 q 14 -16 26 -14 M 42 8 q 14 16 26 14" stroke="${colS}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="38" cy="-4" r="3" fill="${z.cream}"/></g>`;
  }
  function tree(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-16" y="-10" width="32" height="140" rx="10" fill="#8a5a3a"/>
    ${ST.twoTone('tr' + Math.round(x), 'M -110 -20 a 110 100 0 1 0 220 0 a 110 100 0 1 0 -220 0', z.mint, z.mintS)}</g>`; }
  // izometrik yuva: bölüm yüzü (y = 300) üzerindeki 2B noktalar
  const o = { x: 520, y: 940, k: 1 };
  const F = (x, zz) => ST.isoP(x, 300, zz, o);
  const ROOMS = { kral: [-160, 110, 70, 38], yavru: [90, 190, 80, 40], kiler: [210, 70, 64, 34], ana: [0, 260, 50, 28] };
  const TUN = [[[0, 360], [0, 300], [-20, 262]], [[-10, 250], [-90, 200], [-160, 140]], [[20, 250], [70, 220], [90, 200]], [[100, 170], [170, 110], [210, 90]], [[-150, 90], [-60, 60], [150, 60], [200, 70]]];
  const roomPath = ([cx, cz, rx, rz]) => { let d = ''; for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2; const p = F(cx + Math.cos(a) * rx, cz + Math.sin(a) * rz); d += `${i ? 'L' : 'M'} ${p[0]} ${p[1]} `; } return d + 'Z'; };
  const tunPath = pts => 'M ' + pts.map(([x, zz]) => F(x, zz).join(' ')).join(' L ');
  function nest(t, c, pr) {
    let s = `<ellipse cx="520" cy="1190" rx="430" ry="90" fill="#2b2440" opacity="0.12"/>`;
    s += ST.isoBox(-300, -300, 0, 600, 600, 330, '#9a6a44', o) + ST.isoBox(-300, -300, 330, 600, 600, 30, '#5fc36a', o);
    for (let i = 0; i < 14; i++) { const r = ST.rng(i * 911 + 5); r(); const p = ST.isoP(-280 + r() * 560, -280 + r() * 560, 360, o); s += `<path d="M ${p[0]} ${p[1]} l -6 -18 M ${p[0] + 8} ${p[1]} l 4 -20" stroke="#3f9f4a" stroke-width="5" stroke-linecap="round"/>`; }
    const hole = ST.isoP(0, 300, 360, o); s += `<ellipse cx="${hole[0]}" cy="${hole[1]}" rx="22" ry="10" fill="#3a2418"/>`;
    // kesit: tüneller ve odalar
    TUN.forEach((pts, i) => s += `<path d="${tunPath(pts)}" pathLength="1" stroke-dasharray="${cl(pr * 1.6 - i * 0.12)} 1" stroke="#4a2c1c" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    Object.values(ROOMS).forEach((r, i) => { const q = back(seg(pr, 0.3 + i * 0.1, 0.6 + i * 0.1)); if (q > 0) s += `<path d="${roomPath(r)}" fill="#4a2c1c" transform="translate(${F(r[0], r[1])[0] * (1 - q)} ${F(r[0], r[1])[1] * (1 - q)}) scale(${q})"/>`; });
    // tünellerde yürüyen karıncalar
    if (pr > 0.8) TUN.forEach((pts, i) => { for (let k = 0; k < 2; k++) { const q = ((t * 0.25 + k * 0.5 + i * 0.17) % 1), n = pts.length - 1, f = q * n, j = Math.min(n - 1, Math.floor(f)), u = f - j;
      const p = F(lerp(pts[j][0], pts[j + 1][0], u), lerp(pts[j][1], pts[j + 1][1], u)); s += ant(p[0], p[1], 0.22, (i % 2 ? 1 : -1) * 20, t + i, '#2a1a12', '#140c08'); } });
    return s;
  }
  window.EP = {
    caseNo: '08', exhibits: 5, modes: ['dos', 'zoom', 'iso', 'iso', 'iso', 'zoom', 'dos', 'dos'], haloInk: '#9bd96a',
    heads: { 0: ['GİZLİ', 'ŞEHİR?'], 6: ['MİNİK', 'MÜHENDİSLER'] }, subs: { 0: 'TOPRAK ALTINDA HAREKET VAR...', 6: 'KARINCA YUVASI' }, bigNum: { 0: '08', 6: '10x' },
    init(c) { c.T = { delik: c.wt(1, 'deliğe'), daha: c.wt(1, 'daha'), kral: c.wt(3, 'kraliçe'), yavru: c.wt(3, 'yavrular'), kiler: c.wt(4, 'kiler'), saklar: c.wt(4, 'saklar'), on: c.wt(5, 'on'), coz: c.wt(6, 'çözüldü') }; },
    stage(t, c) {
      const { si, into, T, L } = c; let s = '';
      if (si === 1) { // park -> delik, log yakınlaştırma
        const hx = 640, hy = 860, zk = Math.exp(eo(seg(t, T.daha - 0.3, L[1].end + 0.3)) * Math.log(7));
        s += `<g transform="translate(${hx} ${hy}) scale(${zk}) translate(${-hx} ${-hy})">`;
        s += ST.glowRings(540, 820, 330) + ST.twoTone('park', 'M 140 820 a 400 300 0 1 0 800 0 a 400 300 0 1 0 -800 0', z.mint, z.mintS);
        s += tree(330, 700, 1) + tree(780, 640, 0.7) + `<path d="M 200 900 q 200 -80 440 -20" stroke="${z.creamS}" stroke-width="26" fill="none" stroke-linecap="round"/>`;
        s += `<ellipse cx="${hx}" cy="${hy}" rx="16" ry="8" fill="#2a1a12"/>` + ant(hx + 40, hy + 14, 0.12, 30, t) + ant(hx - 30, hy - 10, 0.12, -150, t);
        s += `</g>`;
        if (t > T.delik - 0.2 && zk < 2.5) s += ST.nextStop(hx, hy, 40, 'İNCELE', 'Minik bir delik', 700, 1100, t);
        s += ST.scaleRibbon(70, 1180, 380, lerp(0.1, 0.9, seg(zk, 1, 7)), ['20 m', '1 m', '5 cm'], zk > 4 ? '5 cm' : zk > 2 ? '1 m' : '20 m');
      }
      if (si >= 2 && si <= 4) {
        const pr = seg(t, L[2].start - 0.2, L[2].start + 2.2);
        s += nest(t, c, pr);
        s += `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">KARINCA YUVASI</text>`;
        const pinAt = (r, lab, sub, dir, tt, len = 140) => { if (t < tt) return ''; const p = F(r[0], r[1] + r[3]); return ST.pin(p[0], p[1], len, lab, sub, dir); };
        if (si >= 3) { const r = ROOMS.kral, p = F(r[0], r[1]); s += ant(p[0], p[1], 0.5, 0, t, '#8a2a3a', '#5a1a26');
          for (let i = 0; i < 4; i++) { const q = F(r[0] + 30 + i * 9, r[1] - 18); s += `<ellipse cx="${q[0]}" cy="${q[1]}" rx="7" ry="10" fill="${z.cream}"/>`; }
          s += pinAt(r, 'KRALİÇE', 'yumurtlar', 1, T.kral, 230);
          const y2 = ROOMS.yavru, q2 = F(y2[0], y2[1]); if (t > T.yavru) for (let i = 0; i < 5; i++) s += `<ellipse cx="${q2[0] - 40 + i * 20}" cy="${q2[1] + (i % 2) * 8}" rx="9" ry="13" fill="${z.cream}" transform="rotate(30 ${q2[0] - 40 + i * 20} ${q2[1]})"/>`;
          s += pinAt(y2, 'YAVRU ODASI', 'bebekler büyür', 1, T.yavru, 200); }
        if (si >= 4) { const r = ROOMS.kiler, q = F(r[0], r[1]); const n = Math.floor(seg(t, T.kiler, T.saklar + 0.6) * 9);
          for (let i = 0; i < n; i++) s += `<ellipse cx="${q[0] - 36 + (i % 5) * 18}" cy="${q[1] - 6 + Math.floor(i / 5) * 14}" rx="9" ry="6" fill="#ffc84a"/>`;
          s += pinAt(r, 'KİLER', 'tohumlar burada', 1, T.kiler, 100); }
      }
      if (si === 5) { // karınca yaprak taşıyor + ağırlık kıyası
        const bob = Math.sin(t * 6) * 6;
        s += ST.glowRings(540, 760, 280) + `<path d="M 0 1000 H 1080" stroke="${z.r2}" stroke-width="6"/>`;
        s += `<g transform="translate(0 ${bob})">${ST.twoTone('leaf', 'M 420 520 Q 640 380 820 560 Q 640 700 420 520 Z', z.mint, z.mintS)}<path d="M 430 525 Q 620 520 810 558" stroke="${z.mintS}" stroke-width="6" fill="none"/></g>`;
        s += ant(540, 900, 2.6, -8, t);
        s += `<path d="M 620 860 L 640 ${640 + bob}" stroke="#5a2a20" stroke-width="14" stroke-linecap="round"/>`;
        const kp = back(seg(t, T.on - 0.1, T.on + 0.4));
        if (kp > 0) { s += `<g transform="translate(870 380) scale(${kp})"><circle r="120" fill="${z.sun}"/><text y="30" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="100" fill="${z.night}">x10</text></g>`;
          for (let i = 0; i < 10; i++) { const q = back(seg(t, T.on + 0.1 + i * 0.06, T.on + 0.4 + i * 0.06)); if (q > 0) s += ant(110 + (i % 5) * 90, 1080 + Math.floor(i / 5) * 60, 0.5 * q, 0, t + i); } }
        s += ST.scaleRibbon(70, 1180, 380, 0.95, ['20 m', '1 m', '5 cm'], '5 cm');
      }
      if (si === 6) s += ant(800, 760, 1.6, -20, t, '#7a3b2e', '#5a2a20');
      return s;
    },
    catPos(c) { if (c.si === 6) return { x: 330, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 1 && c.t > c.T.daha) { st.brow = 1; st.glint = 0.6; } if (c.si === 5 && c.t > c.T.on) { st.brow = 1; st.ear = 0.8; } },
    stamps(c) { return [{ t: c.T.coz, txt: 'ÇÖZÜLDÜ!', x: 690, y: 1180, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '🐜?', col: '#ff6f98', y: 560, dx: 330, size: 170 }]; },
  };
})();
