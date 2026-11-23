(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const whaleD = (x, y, s) => `M ${x} ${y} C ${x + 60 * s} ${y - 90 * s} ${x + 300 * s} ${y - 110 * s} ${x + 520 * s} ${y - 70 * s} C ${x + 640 * s} ${y - 50 * s} ${x + 720 * s} ${y - 20 * s} ${x + 790 * s} ${y - 60 * s} L ${x + 860 * s} ${y - 120 * s} L ${x + 840 * s} ${y - 20 * s} L ${x + 900 * s} ${y + 40 * s} L ${x + 800 * s} ${y + 10 * s} C ${x + 700 * s} ${y + 60 * s} ${x + 520 * s} ${y + 80 * s} ${x + 300 * s} ${y + 70 * s} C ${x + 140 * s} ${y + 64 * s} ${x + 20 * s} ${y + 40 * s} ${x} ${y} Z`;
  let wid = 0;
  function whale(x, y, s, swim) {
    const id = 'wh' + (wid++), dy = Math.sin(swim) * 6 * s;
    return `<g transform="translate(0 ${dy})">${ST.twoTone(id, whaleD(x, y, s), z.blue, z.blueS)}
      <path d="M ${x + 60 * s} ${y + 30 * s} C ${x + 200 * s} ${y + 70 * s} ${x + 420 * s} ${y + 72 * s} ${x + 560 * s} ${y + 50 * s}" stroke="${z.cream}" stroke-width="${3.5}" fill="none" opacity="0.6"/>
      <path d="M ${x + 80 * s} ${y + 44 * s} C ${x + 220 * s} ${y + 80 * s} ${x + 400 * s} ${y + 80 * s} ${x + 520 * s} ${y + 64 * s}" stroke="${z.cream}" stroke-width="${3}" fill="none" opacity="0.4"/>
      <circle cx="${x + 70 * s}" cy="${y - 12 * s}" r="${Math.max(4, 9 * s)}" fill="${z.night}"/><circle cx="${x + 66 * s}" cy="${y - 16 * s}" r="${Math.max(1.5, 3 * s)}" fill="${z.cream}"/>
      <path d="M ${x + 250 * s} ${y + 40 * s} q ${40 * s} ${70 * s} ${110 * s} ${50 * s}" fill="${z.blueS}"/></g>`;
  }
  function bus(x, y, w, h) { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.18}" fill="${z.coral}"/><rect x="${x}" y="${y + h * 0.7}" width="${w}" height="${h * 0.3}" rx="${h * 0.1}" fill="${z.coralS}"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${x + w * 0.08 + i * w * 0.18}" y="${y + h * 0.15}" width="${w * 0.13}" height="${h * 0.32}" rx="5" fill="${z.cream}"/>`;
    return s + `<circle cx="${x + w * 0.2}" cy="${y + h}" r="${h * 0.16}" fill="${z.night}"/><circle cx="${x + w * 0.8}" cy="${y + h}" r="${h * 0.16}" fill="${z.night}"/>`; }
  function krill(x, y, s, a) { return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M -30 0 Q -10 -14 22 -6 Q 34 0 22 6 Q -10 14 -30 0 Z" fill="${z.coral}"/>
    <path d="M -30 0 l -16 -10 M -30 0 l -16 10 M 0 6 l -4 14 M 8 6 l -2 14 M 16 5 l 0 13" stroke="${z.coralS}" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="-3" r="3" fill="${z.night}"/></g>`; }
  function elephant(x, y, sc, col = '#8d8a9a') { return `<g transform="translate(${x} ${y}) scale(${sc})"><rect x="-26" y="-18" width="52" height="34" rx="14" fill="${col}"/><rect x="-24" y="10" width="11" height="18" fill="${col}"/><rect x="12" y="10" width="11" height="18" fill="${col}"/>
    <circle cx="24" cy="-12" r="15" fill="${col}"/><path d="M 34 -6 q 10 14 4 32" stroke="${col}" stroke-width="8" fill="none" stroke-linecap="round"/></g>`; }
  window.EP = {
    caseNo: '07', exhibits: 5, modes: ['dos', 'zoom', 'zoom', 'zoom', 'iso', 'iso', 'dos', 'dos'],
    heads: { 0: ['EN BÜYÜK', 'KİM?'], 6: ['MAVİ', 'BALİNA'] }, subs: { 0: 'ŞÜPHELİ ARANIYOR...', 6: 'DÜNYANIN EN BÜYÜK HAYVANI' }, bigNum: { 0: '07', 6: '30m' },
    init(c) { c.T = { otobus: c.wt(2, 'otobüs'), kril: c.wt(3, 'minicik'), otuz: c.wt(4, 'otuz'), sarki: c.wt(5, 'şarkı'), kap: c.wt(6, 'kapandı') }; },
    stage(t, c) {
      const { si, into, T, L } = c; let s = '';
      if (si === 1) { // okyanus diski, balina belirir, sonraki durak
        const zm = lerp(1, 1.06, seg(into, 0, 3.5));
        s += `<g transform="translate(540 760) scale(${zm}) translate(-540 -760)">` + ST.glowRings(540, 760, 360) + ST.twoTone('oc1', 'M 180 760 a 360 360 0 1 0 720 0 a 360 360 0 1 0 -720 0', z.blue, z.blueS);
        for (let i = 0; i < 5; i++) s += `<path d="M ${260 + i * 110} ${560 + (i % 2) * 360} q 30 -14 60 0" stroke="${z.cream}" stroke-width="4" fill="none" opacity="0.35"/>`;
        const wp = back(seg(t, c.wt(1, 'şüpheli') - 0.1, c.wt(1, 'şüpheli') + 0.5));
        if (wp > 0) s += `<g transform="translate(540 790) scale(${wp}) translate(-540 -790)">${ST.twoTone('wh1', whaleD(330, 800, 0.48), z.mint, z.mintS)}<circle cx="364" cy="794" r="6" fill="${z.night}"/></g>`;
        s += `</g>`;
        if (t > c.wt(1, 'balina') - 0.2) s += ST.nextStop(560, 790, 150, 'ŞÜPHELİ', 'Mavi balina', 640, 1170, t);
        s += ST.scaleRibbon(70, 1180, 380, 0.15, ['10 cm', '1 m', '30 m'], '1000 km');
      }
      if (si === 2) { // balina ve üç otobüs
        const sw = t * 2;
        s += whale(80, 640, 1.05, sw);
        const bw = 290, by = 960;
        for (let i = 0; i < 3; i++) { const p = back(seg(t, T.otobus - 0.1 + i * 0.25, T.otobus + 0.25 + i * 0.25)); if (p > 0) s += `<g transform="translate(${90 + i * (bw + 15) + bw / 2} ${by + 70}) scale(${p}) translate(${-(90 + i * (bw + 15) + bw / 2)} ${-(by + 70)})">${bus(90 + i * (bw + 15), by, bw, 140)}</g>`; }
        const dp = eo(seg(t, c.wt(2, 'otuz') - 0.1, c.wt(2, 'otuz') + 0.5));
        s += `<path d="M 80 ${560} V 520 H ${80 + 940 * dp} V 560" stroke="${z.sun}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
        if (dp > 0.5) s += `<text x="540" y="490" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="96" fill="${z.sun}">30 m</text>`;
        s += ST.scaleRibbon(70, 1180, 380, 0.85, ['10 cm', '1 m', '30 m'], '40 m');
      }
      if (si === 3) { // kril sürüsü, yakınlaştırma
        const zp = eo(seg(into, 0, 1.2));
        for (let i = 0; i < 26; i++) { const r = ST.rng((i + 3) * 7919); r(); const x = 120 + r() * 840 + Math.sin(t * 1.5 + i) * 12, y = 420 + r() * 620;
          s += krill(x, y, lerp(0.4, 0.9 + r() * 0.4, zp), r() * 360 + Math.sin(t * 3 + i) * 10); }
        s += krill(560, 760, lerp(0.9, 2.4, zp), -10 + Math.sin(t * 3) * 4);
        if (t > T.kril) s += ST.nextStop(560, 760, 110, 'KRİL', '1–2 cm', 650, 1100, t);
        const bp = seg(t, c.wt(3, 'tonlarca') - 0.1, c.wt(3, 'tonlarca') + 0.4);
        if (bp > 0) s += `<text x="540" y="${400}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${90 * back(bp)}" fill="${z.sun}">GÜNDE ~4 TON!</text>`;
        s += ST.scaleRibbon(70, 1180, 380, lerp(0.85, 0.05, zp), ['10 cm', '1 m', '30 m'], '10 cm');
      }
      if (si === 4) { // izometrik: araba ve kalp aynı boy + 30 fil
        const o = { x: 540, y: 820, k: 1 };
        s += `<ellipse cx="540" cy="930" rx="420" ry="90" fill="#2b2440" opacity="0.12"/>` + ST.isoBox(-230, -230, 0, 460, 460, 40, '#c9c2b2', o);
        const cp = back(seg(into, 0.1, 0.6)), hp = back(seg(t, c.wt(4, 'kalbi') - 0.1, c.wt(4, 'kalbi') + 0.4));
        s += `<g transform="translate(0 ${(1 - cp) * 60})" opacity="${cl(cp)}">${ST.isoBox(-170, -120, 40, 170, 90, 60, '#ff6b5e', o)}${ST.isoBox(-140, -110, 100, 100, 70, 45, '#ff6b5e', o)}</g>`;
        if (hp > 0) { const hz = 40, hs = hp; s += ST.isoBox(60, -110, hz, 150 * hs, 80 * hs, 100 * hs, '#e3402f', o) + ST.isoBox(85, -100, hz + 100 * hs, 40 * hs, 30 * hs, 40 * hs, '#e3402f', o); }
        const a = ST.isoP(-90, -80, 120, o), b = ST.isoP(130, -70, 160, o);
        s += ST.pin(a[0], a[1], 120, 'ARABA', '', -1) + (hp > 0.5 ? ST.pin(b[0], b[1], 150, 'KALP', '≈ 180 kg', 1) : '');
        s += `<text x="70" y="420" font-family="'Jost'" font-weight="600" font-size="54" letter-spacing="6" fill="${P.iso.ink}">KALP ≈ ARABA</text>`;
        s += `<text x="70" y="1030" font-family="'Jost'" font-weight="600" font-size="40" letter-spacing="5" fill="${P.iso.ink}">AĞIRLIK ≈ 30 FİL</text>`;
        const n = Math.floor(seg(t, T.otuz - 0.1, T.otuz + 1.6) * 30);
        for (let i = 0; i < n; i++) s += elephant(120 + (i % 10) * 88, 1100 + Math.floor(i / 10) * 66, 0.95 * back(seg(t, T.otuz - 0.1 + i * 0.05, T.otuz + 0.15 + i * 0.05)));
        if (n >= 30) s += `<text x="1000" y="1260" text-anchor="end" font-family="'Jost'" font-weight="700" font-size="44" fill="${P.iso.ink}">= 1 balina</text>`;
      }
      if (si === 5) { // izometrik okyanus, ses halkaları
        const o = { x: 540, y: 760, k: 1 };
        s += ST.isoBox(-420, -120, -60, 840, 240, 60, '#3f8fd8', o) + ST.isoBox(-420, -120, -120, 840, 240, 60, '#2a5fa8', o);
        const wpos = ST.isoP(-330, 0, 0, o);
        for (let i = 0; i < 6; i++) { const ph = ((t - T.sarki) * 0.5 + i / 6) % 1; if (t < T.sarki) break; const r = ph * 700;
          s += `<ellipse cx="${wpos[0]}" cy="${wpos[1]}" rx="${r}" ry="${r * 0.5}" fill="none" stroke="${P.dos.ink}" stroke-width="3" stroke-dasharray="14 10" opacity="${1 - ph}"/>`; }
        s += `<g transform="translate(${wpos[0] - 90} ${wpos[1] - 40}) scale(0.3)">${ST.twoTone('wh5', whaleD(0, 0, 1), '#c9d3f5', '#9aa7d6')}</g>`;
        for (let k = 0; k < 4; k++) { const q = ST.isoP(-330 + k * 220, 0, 0, o); s += `<text x="${q[0]}" y="${q[1] + 70}" text-anchor="middle" font-family="'JetBrains Mono'" font-weight="800" font-size="26" fill="${P.iso.ink}">${k * 500} km</text>`; }
        const kp = back(seg(t, c.wt(5, 'kilometrelerce'), c.wt(5, 'kilometrelerce') + 0.4));
        s += `<text x="70" y="420" font-family="'Jost'" font-weight="600" font-size="54" letter-spacing="6" fill="${P.iso.ink}">BALİNA ŞARKISI</text>`;
        if (kp > 0) s += `<text x="540" y="1150" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${70 * kp}" fill="${P.dos.cobalt}">kilometrelerce uzağa! ♪</text>`;
      }
      if (si === 6) s += `<g opacity="${seg(into, 0.2, 0.6)}">${ST.twoTone('wh6', whaleD(560, 760, 0.55), z.blue, z.blueS)}</g>`;
      return s;
    },
    catPos(c, p) { if (c.si === 6) return { x: 330, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 2 && c.t > c.T.otobus) { st.brow = 1; st.ear = 0.7; } if (c.si === 4) { st.lookX = -0.4; st.lookY = -0.6; } },
    stamps(c) { return [{ t: c.T.kap, txt: 'ÇÖZÜLDÜ!', x: 690, y: 1180, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '?!', col: '#ff6f98', y: 560, dx: 370, size: 200 }]; },
  };
})();
