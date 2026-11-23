(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${s}" fill="${col}">${txt}</text>`;
  window.EP = {
    caseNo: '12', exhibits: 5, modes: ['dos', 'zoom', 'zoom', 'zoom', 'iso', 'zoom', 'dos', 'dos'],
    heads: { 0: ['KUYRUKLU', 'YILDIZ?'], 6: ['BUZLU', 'GEZGİN'] }, subs: { 0: 'GÖKYÜZÜNDE GARİP BİR İZ', 6: 'KUYRUKLU YILDIZ DOSYASI' }, bigNum: { 0: '12', 6: '76' },
    stage(t, c) {
      const { si, into, L } = c; let s = '';
      if (si === 1) { s += SP.stars(1080, 1920, 60, 7); const r = lerp(60, 260, eo(seg(into, 0, 1.5)));
        s += SP.comet(540, 760, r, -2.5, r * 0.2, t);
        for (let i = 0; i < 10; i++) { const a = i * 0.63 + t * 0.3, d = r * 1.3; s += `<circle cx="${540 + Math.cos(a) * d}" cy="${760 + Math.sin(a) * d}" r="${4 + i % 3 * 3}" fill="${i % 2 ? z.cream : z.mist}"/>`; }
        if (t > c.wt(1, 'kartopu') - 0.4) s += ST.nextStop(600, 700, 90, 'ÇEKİRDEK', 'buz + toz', 640, 1120, t);
        s += ST.scaleRibbon(70, 1180, 380, 0.2, ['10 km', 'Dünya', 'Güneş'], '30 km'); }
      if (si === 2) { s += SP.stars(1080, 1920, 50, 9) + SP.sunGlow(200, 1040, 140, t);
        const p = eo(seg(into, 0.2, 3.6)), x = lerp(980, 520, p), y = lerp(320, 760, p), tl = lerp(20, 420, p);
        const ang = Math.atan2(y - 1040, x - 200); s += SP.comet(x, y, 46, ang, tl, t);
        s += big(540, 330, 64, p > 0.5 ? 'Buz eriyor, kuyruk uzuyor!' : 'Güneş\'e yaklaşıyor…', z.cream); }
      if (si === 3) { const sx = 540, sy = 780; s += SP.stars(1080, 1920, 40, 11) + `<ellipse cx="${sx}" cy="${sy}" rx="380" ry="280" fill="none" stroke="${z.r2}" stroke-width="6" stroke-dasharray="12 12"/>` + SP.sunGlow(sx, sy, 80, t);
        const n = Math.min(5, 1 + Math.floor(seg(into, 0.2, 3) * 5));
        for (let k = 0; k < n; k++) { const a = -2.2 + k * 1.1 + t * 0.05, x = sx + Math.cos(a) * 380, y = sy + Math.sin(a) * 280; s += SP.comet(x, y, 22, Math.atan2(y - sy, x - sx), 150, t); }
        if (t > c.wt(3, 'tersini') - 0.2) s += big(540, 330, 72, 'Kuyruk → Güneş\'in tersi!'); }
      if (si === 4) { const o = { x: 540, y: 860, k: 1 }; s += `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">HALLEY TAKVİMİ</text>`;
        s += ST.isoBox(-460, -60, 0, 920, 120, 30, '#e8dccb', o);
        [[1910, -380], [1986, 0], [2061, 380]].forEach(([y, x], i) => { const p = back(seg(into, 0.3 + i * 0.5, 0.7 + i * 0.5)); if (p <= 0) return;
          s += ST.isoBox(x - 50, -40, 30, 100, 80, 120 * p, i === 2 ? '#ffc84a' : '#9fdcff', o); const q = ST.isoP(x, 0, 160 * p, o); s += ST.pin(q[0], q[1], 70, String(y), i === 2 ? 'sıradaki!' : 'göründü', 1); });
        const a = ST.isoP(-380, 60, 30, o), b = ST.isoP(0, 60, 30, o); if (into > 1.2) s += `<path d="M ${a[0]} ${a[1] + 40} Q ${(a[0] + b[0]) / 2} ${a[1] + 120} ${b[0]} ${b[1] + 40}" stroke="${P.iso.ink}" stroke-width="3" fill="none" stroke-dasharray="8 8"/><text x="${(a[0] + b[0]) / 2}" y="${a[1] + 150}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="44" fill="${P.iso.ink}">76 yıl</text>`; }
      if (si === 5) { s += SP.stars(1080, 1920, 50, 13); const p = back(seg(into, 0.2, 0.7));
        s += `<g transform="translate(540 650) scale(${p})"><rect x="-260" y="-230" width="520" height="460" rx="40" fill="${z.cream}"/><rect x="-260" y="-230" width="520" height="110" rx="40" fill="${z.coral}"/>
          <text y="-155" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="56" fill="${z.cream}">BİR SONRAKİ</text>${big(0, 120, 200, '2061', z.night)}</g>`;
        s += SP.comet(880 + Math.sin(t) * 20, 330, 30, 2.6, 260, t); }
      if (si === 6) s += SP.comet(790, 760, 60, 2.4, 420, t);
      return s;
    },
    catPos(c) { if (c.si === 6) return { x: 300, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 3 && c.t > c.wt(3, 'tersini')) { st.brow = 1; st.ear = 0.8; } if (c.si === 5) st.happy = 1; },
    stamps(c) { return [{ t: c.wt(6, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 690, y: 1200, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '☄️?', col: '#9fdcff', y: 560, dx: 330, size: 170 }]; },
  };
})();
