(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const FX = 600, FY = 620; // yakınlaşma odağı (yaprak)
  function leafD(x, y, s, a = -30) { return { d: `M ${-30 * s} 0 Q 0 ${-18 * s} ${30 * s} 0 Q 0 ${18 * s} ${-30 * s} 0 Z`, tf: `translate(${x} ${y}) rotate(${a})` }; }
  function chloro(x, y, s, a, glow) { return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${glow > 0 ? `<ellipse rx="${46 + 10 * glow}" ry="${30 + 10 * glow}" fill="${z.sun}" opacity="${0.35 * glow}"/>` : ''}
    <ellipse rx="40" ry="24" fill="${z.mintS}"/><ellipse cx="-4" cy="-4" rx="34" ry="18" fill="${z.mint}"/>
    <path d="M -24 -4 h 48 M -24 6 h 48" stroke="${z.mintS}" stroke-width="4" stroke-linecap="round"/></g>`; }
  // izometrik ağaç dioraması
  const o = { x: 540, y: 980, k: 1 };
  function diorama(t, c) {
    let s = `<ellipse cx="540" cy="1230" rx="430" ry="80" fill="#2b2440" opacity="0.12"/>`;
    s += ST.isoBox(-260, -260, 0, 520, 520, 120, '#9a6a44', o) + ST.isoBox(-260, -260, 120, 520, 520, 24, '#5fc36a', o);
    // kökler (ön-sol kesitte)
    const F2 = (x, zz) => ST.isoP(x, 260, zz, o);
    [[0, 120, -90, 40], [0, 120, 80, 30], [0, 120, -20, 10], [0, 120, 140, 70]].forEach(([x0, z0, x1, z1]) => { const a = F2(x0, z0), b = F2(x1, z1); s += `<path d="M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${a[1] + 20} ${b[0]} ${b[1]}" stroke="#5a3a24" stroke-width="10" fill="none" stroke-linecap="round"/>`; });
    // gövde ve taç
    s += ST.isoBox(-30, 200, 144, 60, 60, 260, '#8a5a3a', o);
    s += ST.isoBox(-150, 80, 380, 300, 300, 120, '#3fc87a', o) + ST.isoBox(-100, 130, 500, 200, 200, 90, '#3fc87a', o);
    // güneş
    s += `<circle cx="930" cy="330" r="70" fill="${z.sun}"/>` + [...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2 + t * 0.4; return `<line x1="${930 + Math.cos(a) * 88}" y1="${330 + Math.sin(a) * 88}" x2="${930 + Math.cos(a) * 112}" y2="${330 + Math.sin(a) * 112}" stroke="${z.sun}" stroke-width="10" stroke-linecap="round"/>`; }).join('');
    return s;
  }
  window.EP = {
    caseNo: '09', exhibits: 4, modes: ['dos', 'zoom', 'zoom', 'iso', 'iso', 'dos', 'dos'], haloInk: '#9bd96a', edgeInk: '#3fc87a',
    heads: { 0: ['IŞIKTAN', 'YEMEK?'], 5: ['TEŞEKKÜRLER', 'AĞAÇ!'] }, subs: { 0: 'ŞÜPHELİ: SESSİZ BİR AĞAÇ', 5: 'FOTOSENTEZ DOSYASI' }, bigNum: { 0: '09', 5: 'O₂' },
    init(c) { c.T = { daha: c.wt(1, 'daha'), fab: c.wt(2, 'fabrikalar'), yak: c.wt(2, 'yakalıyorlar'), su: c.wt(3, 'su'), hava: c.wt(3, 'havadan'), seker: c.wt(4, 'şekerli'), oks: c.wt(4, 'oksijen'), tes: c.wt(5, 'teşekkür') }; },
    stage(t, c) {
      const { si, into, T, L } = c; let s = '';
      if (si === 1) {
        const zk = Math.exp(eo(seg(t, c.wt(1, 'yakından') - 0.1, L[1].end + 0.3)) * Math.log(80));
        s += `<g transform="translate(${FX} ${FY}) scale(${zk}) translate(${-FX} ${-FY})">`;
        const treeOp = 1 - seg(zk, 4, 9);
        if (treeOp > 0) s += `<g opacity="${treeOp}">${ST.glowRings(540, 700, 300)}<rect x="515" y="820" width="50" height="300" rx="16" fill="#8a5a3a"/>${ST.twoTone('crown', 'M 260 680 a 280 240 0 1 0 560 0 a 280 240 0 1 0 -560 0', z.mint, z.mintS)}</g>`;
        for (let i = 0; i < 26; i++) { const r = ST.rng(i * 733 + 9); r(); const x = 300 + r() * 520, y = 470 + r() * 420, L2 = leafD(x, y, 1, r() * 360);
          s += `<path d="${L2.d}" transform="${L2.tf}" fill="${i % 2 ? z.mintS : '#5fe8c0'}" opacity="${treeOp}"/>`; }
        // odaktaki yaprak (her ölçekte)
        const lf = leafD(FX, FY, 1.4, -25);
        s += `<path d="${lf.d}" transform="${lf.tf}" fill="#5fe8c0"/><path d="M -40 0 L 40 0" transform="${lf.tf}" stroke="${z.mintS}" stroke-width="1.2"/>`;
        const cellOp = seg(zk, 12, 30);
        if (cellOp > 0) { let d = ''; for (let i = -4; i <= 4; i++) for (let j = -3; j <= 3; j++) { const x = FX + i * 1.4 + (j % 2) * 0.7, y = FY + j * 1.2; d += `M ${x - 0.6} ${y - 0.5} h 1.2 v 1 h -1.2 Z`; }
          s += `<path d="${d}" fill="${z.mint}" stroke="${z.mintS}" stroke-width="0.12" opacity="${cellOp}"/>`; }
        s += `</g>`;
        if (zk < 3 && t > c.wt(1, 'yaprağa')) s += ST.nextStop(FX, FY, 36, 'SONRAKİ DURAK', 'Bir yaprak', 700, 1050, t);
        s += ST.scaleRibbon(70, 1180, 380, lerp(0.05, 0.95, seg(Math.log(zk), 0, Math.log(80))), ['10 m', '5 cm', '0,1 mm'], zk > 30 ? '0,1 mm' : zk > 4 ? '5 cm' : '10 m');
      }
      if (si === 2) { // tek hücre, kloroplastlar, ışık
        s += `<rect x="140" y="420" width="800" height="640" rx="90" fill="${z.mintS}"/><rect x="160" y="436" width="760" height="600" rx="80" fill="${z.mint}" opacity="0.45"/>`;
        const CL = [[300, 560, 10], [480, 520, -20], [700, 560, 30], [820, 720, -10], [600, 760, 15], [360, 800, -30], [250, 950, 5], [500, 930, 25], [760, 920, -15]];
        CL.forEach(([x, y, a], i) => { const g = t > T.yak ? 0.5 + 0.5 * Math.sin(t * 5 + i) : 0; const p = back(seg(t, T.fab - 0.2 + i * 0.05, T.fab + 0.2 + i * 0.05)); if (p > 0) s += chloro(x, y, 1.1 * p, a + Math.sin(t + i) * 5, g); });
        s += `<circle cx="1000" cy="300" r="60" fill="${z.sun}"/>`;
        if (t > T.yak - 0.4) CL.slice(0, 5).forEach(([x, y], i) => s += ST.sightLine(990, 320, x, y, t + i * 0.3, 10));
        if (t > T.fab) s += ST.nextStop(480, 520, 70, 'KLOROPLAST', 'yeşil fabrika', 560, 380, t);
        s += ST.scaleRibbon(70, 1180, 380, 1, ['10 m', '5 cm', '0,1 mm'], '0,05 mm');
      }
      if (si === 3 || si === 4) {
        s += diorama(t, c) + `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">AĞACIN MUTFAĞI</text>`;
        // su: köklerden yukarı (mavi rota)
        const sp = seg(t, T.su - 0.2, T.su + 1.4);
        if (sp > 0) { const a = ST.isoP(0, 230, 60, o), b = ST.isoP(0, 230, 380, o);
          s += `<path d="M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}" stroke="#3fa9ff" stroke-width="8" stroke-dasharray="18 12" stroke-dashoffset="${t * 60}" opacity="${cl(sp * 2)}"/>`;
          for (let i = 0; i < 3; i++) { const q = ((t * 0.5 + i / 3) % 1); s += `<path transform="translate(${lerp(a[0], b[0], q)} ${lerp(a[1], b[1], q)}) scale(0.5)" d="M 0 -30 C 16 -8 22 4 22 12 A 22 22 0 0 1 -22 12 C -22 4 -16 -8 0 -30 Z" fill="#3fa9ff"/>`; }
          const k = ST.isoP(-90, 260, 40, o); s += ST.pin(k[0], k[1], 90, 'KÖKLER', 'su topluyor', -1); }
        const hp = seg(t, T.hava - 0.2, T.hava + 1.2);
        if (hp > 0 && si === 3) { for (let i = 0; i < 6; i++) { const q = ((t * 0.35 + i / 6) % 1), x = lerp(120 + i * 40, 420, q), y = lerp(520 + i * 30, 560, q);
            s += `<circle cx="${x}" cy="${y}" r="24" fill="#b8b4c8" opacity="${(1 - q) * cl(hp * 2)}"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="20" fill="${P.iso.ink}" opacity="${(1 - q) * cl(hp * 2)}">CO₂</text>`; }
          const k = ST.isoP(150, 80, 470, o); s += ST.pin(k[0], k[1], 80, 'YAPRAKLAR', 'havadan alıyor', 1); }
        if (si === 4) {
          const sp2 = seg(t, T.seker - 0.1, T.seker + 1.6);
          for (let i = 0; i < 3; i++) { const q = ((t * 0.4 + i / 3) % 1); const zz = lerp(400, 160, q); if (sp2 > 0) s += ST.isoBox(-15, 215, zz, 30, 30, 30, '#fff3dc', o); }
          if (sp2 > 0) { const k = ST.isoP(30, 230, 260, o); s += ST.pin(k[0], k[1], 120, 'ŞEKER', 'ağacın yemeği', 1); }
          const op = seg(t, T.oks - 0.2, T.oks + 1.2);
          if (op > 0) { for (let i = 0; i < 7; i++) { const q = ((t * 0.3 + i / 7) % 1), x = lerp(460, 160 + (i % 3) * 120, q), y = lerp(560, 360 - (i % 2) * 60, q);
              s += `<circle cx="${x}" cy="${y}" r="26" fill="#9fdcff" opacity="${cl(op * 2) * (1 - q * 0.5)}"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="22" fill="${P.iso.ink}" opacity="${cl(op * 2)}">O₂</text>`; }
            // minik insan: yuvarlak baş, iki tonlu gövde
            const hpn = ST.isoP(-200, 150, 144, o); s += `<g transform="translate(${hpn[0]} ${hpn[1]})"><path d="M -22 0 L -14 -70 L 14 -70 L 22 0 Z" fill="#ff6b5e"/><path d="M 0 0 L 0 -70 L 14 -70 L 22 0 Z" fill="#e14b45"/><circle cx="0" cy="-92" r="20" fill="#ffd2b0"/>
              <path d="M -18 -60 q -22 -20 -10 -44" stroke="#ffd2b0" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
            s += ST.pin(hpn[0], hpn[1] - 110, 60, 'OKSİJEN', 'bize nefes', -1); }
        }
      }
      if (si === 5) s += `<g transform="translate(790 820)"><rect x="-22" y="0" width="44" height="200" rx="12" fill="#8a5a3a" stroke="${P.dos.ink}" stroke-width="8"/>
        <circle cx="0" cy="-40" r="150" fill="#3fc87a" stroke="${P.dos.ink}" stroke-width="9"/><circle cx="-60" cy="-60" r="16" fill="#151a3a"/><circle cx="40" cy="-60" r="16" fill="#151a3a"/>
        <path d="M -50 0 q 40 40 80 0" stroke="#151a3a" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
      return s;
    },
    catPos(c) { if (c.si === 5) return { x: 300, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 1 && c.t > c.T.daha) { st.brow = 1; st.glint = 0.5; } if (c.si === 4 && c.t > c.T.oks) { st.happy = 1; } if (c.si === 5) st.happy = c.t > c.T.tes + 0.6 ? 1 : 0; },
    stamps(c) { return [{ t: c.T.tes, txt: 'ÇÖZÜLDÜ!', x: 640, y: 1230, rot: -10, end: c.sceneStart(6) }]; },
    stickers(c) { return [{ t: 0.5, txt: '🌳?', col: '#3fc87a', y: 560, dx: 330, size: 170 }]; },
  };
})();
