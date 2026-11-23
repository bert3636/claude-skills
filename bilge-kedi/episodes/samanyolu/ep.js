(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${s}" fill="${col}">${txt}</text>`;
  function galaxy(cx, cy, R, rot, t, n = 420) { // spiral kollar: noktalar
    let d1 = '', d2 = '', d3 = ''; const r = ST.rng(77);
    for (let i = 0; i < n; i++) { const arm = i % 2, u = r(), rr = Math.pow(u, 0.7) * R, a = rot + arm * Math.PI + rr / R * 4.2 + (r() - 0.5) * 0.5;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.62, sz = 1.5 + r() * 3.5, p = `M${x - sz} ${y}a${sz} ${sz} 0 1 0 ${2 * sz} 0a${sz} ${sz} 0 1 0 ${-2 * sz} 0`;
      if (i % 3 === 0) d1 += p; else if (i % 3 === 1) d2 += p; else d3 += p; }
    return `<ellipse cx="${cx}" cy="${cy}" rx="${R * 0.38}" ry="${R * 0.24}" fill="${z.r2}"/><ellipse cx="${cx}" cy="${cy}" rx="${R * 0.2}" ry="${R * 0.13}" fill="${z.creamS}"/><ellipse cx="${cx}" cy="${cy}" rx="${R * 0.12}" ry="${R * 0.08}" fill="${z.cream}"/>
      <path d="${d1}" fill="${z.cream}"/><path d="${d2}" fill="${z.mist}"/><path d="${d3}" fill="#9fdcff"/>`;
  }
  window.EP = {
    caseNo: '15', exhibits: 5, modes: ['dos', 'zoom', 'zoom', 'iso', 'zoom', 'zoom', 'dos', 'dos'],
    heads: { 0: ['UZAY', 'ADRESİ'], 6: ['SAMANYOLU', 'GALAKSİSİ'] }, subs: { 0: 'EVİMİZ TAM OLARAK NEREDE?', 6: 'ADRES DOSYASI' }, bigNum: { 0: '15', 6: '∞' },
    stage(t, c) {
      const { si, into } = c; let s = '';
      if (si === 1) { const p = seg(into, 0.2, 4.6); s += SP.stars(1080, 1920, 70, 51);
        if (p < 0.45) { const k = 1 - p / 0.45; s += SP.planet(540, 760, lerp(30, 260, k), 'earth', t) + SP.sunGlow(lerp(540, 200, k), lerp(760, 1000, k), lerp(10, 90, k), t); }
        else { const k = (p - 0.45) / 0.55; s += galaxy(540, 760, lerp(80, 460, k), t * 0.1, t) + `<circle cx="${540 + 0.55 * lerp(80, 460, k)}" cy="${760 + 0.1 * lerp(80, 460, k)}" r="6" fill="${z.sun}"/>`; }
        s += ST.scaleRibbon(70, 1180, 380, p, ['Dünya', 'Güneş S.', 'Galaksi'], p < 0.45 ? '10 milyar km' : '100.000 ışık yılı'); }
      if (si === 2) { s += SP.stars(1080, 1920, 60, 52) + galaxy(540, 760, 470, t * 0.12, t); const yx = 540 + Math.cos(t * 0.12 + 0.5) * 260, yy = 760 + Math.sin(t * 0.12 + 0.5) * 260 * 0.62;
        if (into > 1) s += ST.nextStop(yx, yy, 30, 'BİZ BURADAYIZ', 'Güneş Sistemi', 640, 1120, t); s += big(540, 330, 80, 'SAMANYOLU', z.cream); }
      if (si === 3) { s += `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">YILDIZ SAYIMI</text>`;
        const n = Math.floor(seg(t, c.L[3].start, c.L[3].end + 0.2) * 60);
        for (let i = 0; i < n; i++) { const x = 120 + (i % 10) * 88, y = 420 + Math.floor(i / 10) * 100, k = back(seg(t, c.L[3].start + i * 0.035, c.L[3].start + 0.2 + i * 0.035));
          s += `<path transform="translate(${x} ${y}) scale(${k})" d="M 0 -30 L 9 -9 L 30 0 L 9 9 L 0 30 L -9 9 L -30 0 L -9 -9 Z" fill="${['#ffc84a', '#2f5fd0', '#ff6b5e'][i % 3]}"/>`; }
        s += `<text x="540" y="1110" text-anchor="middle" font-family="'Jost'" font-weight="600" font-size="34" fill="${P.iso.ink}">her ✦ = ~2 milyar yıldız</text>` + big(540, 1200, 70, '100.000.000.000+', P.dos.cobalt); }
      if (si === 4) { s += SP.stars(1080, 1920, 50, 53) + galaxy(540, 760, 470, 0.4, t); const q = seg(into, 0.3, 2.8);
        const x = lerp(80, 1000, q); s += `<line x1="80" y1="760" x2="${x}" y2="760" stroke="${z.sun}" stroke-width="10" stroke-linecap="round"/><circle cx="${x}" cy="760" r="16" fill="#fff3a0"/>`;
        s += big(540, 1180, 84, `${Math.round(q * 100)}.000 yıl`, z.cream); }
      if (si === 5) { s += SP.stars(1080, 1920, 120, 54);
        let d = ''; const r = ST.rng(5); for (let i = 0; i < 500; i++) { const u = r(), x = u * 1080, y = 900 - u * 700 + (r() - 0.5) * 220 * (1 - Math.abs(u - 0.5)), sz = 1 + r() * 3; d += `M${x} ${y}a${sz} ${sz} 0 1 0 ${2 * sz} 0a${sz} ${sz} 0 1 0 ${-2 * sz} 0`; }
        s += `<path d="M 0 900 L 1080 200 L 1080 380 L 0 1080 Z" fill="${z.r2}" opacity="0.7"/><path d="${d}" fill="${z.cream}" opacity="0.85"/>`;
        s += `<path d="M 0 1100 Q 300 1000 600 1060 T 1080 1040 V 1920 H 0 Z" fill="#141640"/>` + `<g transform="translate(260 1010)"><rect x="-8" y="0" width="16" height="70" fill="#141640"/><circle cy="-10" r="50" fill="#141640"/></g>`; }
      if (si === 6) { const p = back(seg(into, 0.2, 0.6)); s += `<g transform="translate(760 820) rotate(-4) scale(${p})"><rect x="-230" y="-190" width="460" height="380" rx="16" fill="${P.dos.ink}" transform="translate(10 10)"/><rect x="-230" y="-190" width="460" height="380" rx="16" fill="#f7e8c4" stroke="${P.dos.ink}" stroke-width="7"/>
        <text x="-200" y="-130" font-family="'JetBrains Mono'" font-weight="800" font-size="30" fill="${P.dos.ink}">ADRES:</text>
        ${['Bilge Kedi', 'Dünya', 'Güneş Sistemi', 'Samanyolu', 'Evren'].map((l, i) => `<text x="-200" y="${-70 + i * 58}" font-family="'Alfa Slab One'" font-size="40" fill="${i === 3 ? P.dos.cobalt : P.dos.ink}">${l}</text>`).join('')}</g>`; }
      return s;
    },
    catPos(c) { if (c.si === 6) return { x: 260, y: 1150, s: 0.58 }; },
    cat(st, c) { if (c.si === 5) { st.lookY = -0.9; st.happy = 0; st.brow = 0.8; } },
    stamps(c) { return [{ t: c.wt(6, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 720, y: 1180, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '🌌?', col: '#9fdcff', y: 560, dx: 330, size: 170 }]; },
  };
})();
