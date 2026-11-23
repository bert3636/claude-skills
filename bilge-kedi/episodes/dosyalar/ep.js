(function () {
  const { seg, eo, back, lerp } = K2, P = ST.PAL, D = P.dos;
  const F = [['07', 'MAVİ BALİNA', '🐋', '#2f5fd0'], ['08', 'GİZLİ ŞEHİR', '🐜', '#e3402f'], ['09', 'IŞIKTAN YEMEK', '🍃', '#1fa38a']];
  function folder(x, y, s, rot, i, open = 0, stamped = 0) {
    const [n, title, ic, col] = F[i];
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <path d="M -260 -170 h 150 l 30 -40 h 120 l 30 40 h 220 v 360 h -550 Z" fill="${D.ink}" transform="translate(12 12)"/>
      <path d="M -260 -170 h 150 l 30 -40 h 120 l 30 40 h 220 v 360 h -550 Z" fill="#e8c98a" stroke="${D.ink}" stroke-width="7" stroke-linejoin="round"/>
      <rect x="-230" y="-140" width="490" height="300" rx="10" fill="#f7e8c4" stroke="${D.ink}" stroke-width="5" transform="translate(0 ${-open * 60}) rotate(${-open * 4})"/>
      <text x="-30" y="-176" text-anchor="middle" font-family="'JetBrains Mono'" font-weight="800" font-size="30" fill="${D.ink}">#${n}</text>
      <text x="0" y="30" text-anchor="middle" font-size="120" transform="translate(0 ${-open * 60})">${ic}</text>
      <rect x="-230" y="110" width="490" height="70" fill="${col}"/>
      <text x="15" y="160" text-anchor="middle" font-family="'Alfa Slab One'" font-size="44" fill="#fff3dc">${title}</text>
      ${stamped ? ST.stamp(60, -10, 'ÇÖZÜLDÜ!', D.red, -14, stamped, 70) : ''}</g>`;
  }
  window.EP = {
    caseNo: '07-09', exhibits: 3, modes: ['dos', 'dos', 'dos', 'dos', 'dos', 'dos'],
    heads: { 0: ['ÜÇ GİZLİ', 'DOSYA'], 4: ['HEPSİ', 'ÇÖZÜLDÜ!'] }, subs: { 0: 'BİLGE KEDİ DOSYALARI', 4: 'EN ŞAŞIRTICI HANGİSİ?' },
    exNum: si => si >= 1 && si <= 3 ? si : 0,
    stage(t, c) {
      const { si, into, L } = c; let s = '';
      if (si === 0) F.forEach((f, i) => { const p = back(seg(t, 2 + i * 0.4, 2.4 + i * 0.4)); if (p > 0) s += folder(260 + i * 300, 720, 0.62 * p, -8 + i * 8, i); });
      if (si >= 1 && si <= 3) { const i = si - 1, p = back(seg(into, 0, 0.5)); s += folder(620, 560, 1.15 * p, -3, i, eo(seg(into, 0.6, 1.3))); }
      if (si >= 4) F.forEach((f, i) => { const st = si === 4 ? back(seg(t, c.wt(4, 'çözüldü') + i * 0.2, c.wt(4, 'çözüldü') + 0.25 + i * 0.2)) : 1; s += folder(260 + i * 300, 760, 0.55, -8 + i * 8, i, 0, Math.max(0, st)); });
      return s;
    },
    cat(st, c) { if (c.si >= 1 && c.si <= 3) { st.lookX = -0.8; st.brow = 0.8; } if (c.si >= 4) st.happy = 1; },
    stamps() { return []; }, stickers() { return []; },
  };
})();
