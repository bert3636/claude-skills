(function () {
  const { seg, eo, back, lerp } = K;
  const T = [['🕳️', 'Kara Delik', 'kara', '#7a5cff'], ['🐙', 'Ahtapot', 'ahtapot', '#b26bff'], ['🌙', 'Ay', 'ay', '#ffd84d'],
    ['🌈', 'Gökkuşağı', 'gökkuşağı', '#3fa9ff'], ['🐝', 'Arılar', 'arılar', '#ffb33f'], ['❄️', 'Kar Tanesi', 'kar', '#7af0ff']];
  function badge(x, y, s, i, glow = 0) {
    const [ic, nm, , col] = T[i];
    return `<g transform="translate(${x} ${y}) scale(${s})">${glow ? `<circle r="150" fill="${col}" opacity="${0.5 * glow}" filter="url(#b30)"/>` : ''}
      <circle r="110" fill="${col}" stroke="#1a1040" stroke-width="10"/><text y="40" text-anchor="middle" font-size="120">${ic}</text>
      ${K.text(0, 175, 50, nm, '#fff')}</g>`;
  }
  window.EP = {
    theme: 'space', bigScenes: [0, 1, 2, 8, 9], steady: false,
    stage(t, c) {
      const { si, L } = c; let s = '';
      if (si === 1 || si === 2) T.forEach((x, i) => { const ti = c.wt(1, x[2]); const p = back(seg(t, ti - 0.1, ti + 0.3));
        if (p > 0) s += badge(i < 3 ? 150 + i * 210 : 1350 + (i - 3) * 210, 300 + (i % 2) * 300, p * 0.85, i); });
      if (si >= 3 && si <= 7) { const i = si - 2, p = back(seg(t, L[si].start - 0.3, L[si].start + 0.2));
        s += `<g transform="translate(680 470) scale(${p}) rotate(${-3 + 2 * Math.sin(t * 2)})">
          <rect x="-430" y="-330" width="860" height="660" rx="70" fill="${T[i][3]}" stroke="#1a1040" stroke-width="14"/>
          ${K.text(0, -200, 100, `SIR #${i + 1}`, '#fff')}<text y="110" text-anchor="middle" font-size="300">${T[i][0]}</text>${K.text(0, 270, 110, T[i][1], '#ffd84d')}</g>`;
        for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 + t, r = 470 + 20 * Math.sin(t * 3 + k);
          s += `<circle cx="${680 + Math.cos(a) * r}" cy="${470 + Math.sin(a) * r * 0.75}" r="12" fill="#fff" opacity="${0.6 * p}"/>`; } }
      if (si === 0) s += `<g transform="translate(960 150) scale(${back(seg(t, 0.2, 0.7))})">${K.text(0, 40, 130, '👋 MERHABA! 👋', '#ffd84d')}</g>`;
      if (si === 8) T.forEach((x, i) => { s += badge(i < 3 ? 150 + i * 210 : 1350 + (i - 3) * 210, 300 + (i % 2) * 300, 0.85 * (1 + 0.06 * Math.sin(t * 6 + i)), i, 1); });
      return s;
    },
    cat(st, c) { if (c.si >= 3 && c.si <= 7) { st.lookX = -0.8; st.lookY = 0; st.brow = 0.8; } if (c.si === 0) st.tail = Math.sin(c.t * 8); },
    stickers(c) { return []; }, flashes(c) { return []; },
  };
})();
