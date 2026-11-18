(function () {
  const { seg, eo, back, lerp } = K;
  const RB = ['#ff4b4b', '#ff9a3c', '#ffe14d', '#5fd36a', '#3fa9ff', '#3f4fd0', '#a05fe0'];
  function arcBand(cx, cy, r, w, col, prog) {
    if (prog <= 0) return '';
    return `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" pathLength="1" stroke="${col}" stroke-width="${w}" fill="none" stroke-dasharray="${prog} 1"/>`;
  }
  function circleBand(cx, cy, r, w, col, prog) {
    if (prog <= 0) return '';
    return `<circle cx="${cx}" cy="${cy}" r="${r}" pathLength="1" stroke="${col}" stroke-width="${w}" fill="none" stroke-dasharray="${prog} 1" transform="rotate(180 ${cx} ${cy})"/>`;
  }
  function rainCloud(x, y, s, grey) {
    const c = `rgb(${Math.round(lerp(255, 150, grey))},${Math.round(lerp(255, 160, grey))},${Math.round(lerp(255, 185, grey))})`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="30" rx="210" ry="80" fill="${c}"/><circle cx="-100" cy="0" r="90" fill="${c}"/>
      <circle cx="20" cy="-50" r="120" fill="${c}"/><circle cx="130" cy="0" r="85" fill="${c}"/>
      <path d="M -60 10 q 15 -15 30 0 M 30 10 q 15 -15 30 0" stroke="#4a4f70" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M -20 45 q 20 15 40 0" stroke="#4a4f70" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
  }
  function sun(cx, cy, r, t, white = 0) {
    let rays = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.6;
      rays += `<line x1="${cx + Math.cos(a) * r * 1.1}" y1="${cy + Math.sin(a) * r * 1.1}" x2="${cx + Math.cos(a) * r * 1.5}" y2="${cy + Math.sin(a) * r * 1.5}" stroke="${white ? '#fff' : '#ffd84d'}" stroke-width="${r * 0.14}" stroke-linecap="round"/>`; }
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.8}" fill="#fff4a8" opacity="0.5" filter="url(#b80)"/>${rays}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${white ? '#fffdf0' : '#ffc83d'}" stroke="#ffd84d" stroke-width="6"/>
      <path d="M ${cx - r * 0.45} ${cy - r * 0.05} q ${r * 0.17} ${-r * 0.25} ${r * 0.34} 0 M ${cx + r * 0.11} ${cy - r * 0.05} q ${r * 0.17} ${-r * 0.25} ${r * 0.34} 0" stroke="#8a4a10" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>
      <path d="M ${cx - r * 0.3} ${cy + r * 0.25} q ${r * 0.3} ${r * 0.3} ${r * 0.6} 0" stroke="#8a4a10" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>`;
  }
  const dropPath = s => `M 0 ${-120 * s} C ${50 * s} ${-40 * s} ${100 * s} ${10 * s} ${100 * s} ${50 * s} A ${100 * s} ${100 * s} 0 0 1 ${-100 * s} ${50 * s} C ${-100 * s} ${10 * s} ${-50 * s} ${-40 * s} 0 ${-120 * s} Z`;
  function plane(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -110 0 Q -110 -30 -60 -30 L 90 -30 Q 130 -30 140 0 Q 130 30 90 30 L -60 30 Q -110 30 -110 0 Z" fill="#fff" stroke="#1a1040" stroke-width="7"/>
      <path d="M -10 -25 L -50 -85 L -20 -85 L 40 -25 Z M -10 25 L -50 85 L -20 85 L 40 25 Z M -100 -20 L -125 -60 L -95 -60 L -75 -20 Z" fill="#ff7fb0" stroke="#1a1040" stroke-width="6" stroke-linejoin="round"/>
      ${[-40, -5, 30, 65].map(xx => `<circle cx="${xx}" cy="-5" r="11" fill="#3fa9ff"/>`).join('')}<circle cx="110" cy="-6" r="6" fill="#1a1040"/></g>`;
  }
  window.EP = {
    theme: 'sky', bigScenes: [0, 6],
    init(c) { c.T = { gun: c.wt(1, 'güneş'), gok: c.wt(1, 'gökkuşağı'), ren: c.wt(2, 'renkler'), dam: c.wt(3, 'damlaları'), ayir: c.wt(3, 'ayırır'),
      col: ['kırmızı', 'turuncu', 'sarı', 'yeşil', 'mavi', 'lacivert', 'mor'].map(w => c.wt(4, w)), daire: c.wt(5, 'daire'), ucak: c.wt(5, 'uçaktan') }; },
    stage(t, c) {
      const { si, into, T } = c; let s = '';
      if (si === 0) s += `<circle cx="540" cy="1000" r="${320 + 40 * Math.sin(t * 3)}" fill="#fff" opacity="0.5" filter="url(#b80)"/>`;
      if (si === 1) {
        const clear = seg(t, T.gun - 0.1, T.gun + 0.5);
        s += sun(lerp(640, 800, eo(clear)), lerp(420, 260, eo(clear)), 110, t);
        if (clear < 1) for (let i = 0; i < 16; i++) { const ph = (t * 1.6 + i / 16) % 1, x = 330 + (i * 47) % 420;
          s += `<path transform="translate(${x} ${lerp(470, 950, ph)})" d="${dropPath(0.18)}" fill="#5fb8ff" opacity="${(1 - clear) * 0.9}"/>`; }
        s += rainCloud(lerp(540, 420, eo(clear)), 380, 1.1, 1 - clear);
        for (let i = 0; i < 7; i++) s += arcBand(540, 980, 470 - i * 38, 40, RB[i], eo(seg(t, T.gok - 0.1 + i * 0.04, T.gok + 0.7 + i * 0.04)));
      }
      if (si === 2) {
        const p = seg(t, T.ren - 0.2, T.ren + 0.5), rot = t * 40;
        for (let i = 0; i < 7; i++) { const a0 = i / 7 * 360 + rot, a1 = a0 + 360 / 7;
          const r = 270, x0 = 540 + Math.cos(a0 * Math.PI / 180) * r, y0 = 560 + Math.sin(a0 * Math.PI / 180) * r, x1 = 540 + Math.cos(a1 * Math.PI / 180) * r, y1 = 560 + Math.sin(a1 * Math.PI / 180) * r;
          s += `<path d="M 540 560 L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z" fill="${RB[i]}" opacity="${p}" transform="scale(1)"/>`; }
        s += sun(540, 560, lerp(170, 150, p), t, 1);
      }
      if (si === 3) {
        const a = eo(seg(into, 0.1, 0.7)), b = eo(seg(t, T.dam, T.ayir + 0.3));
        s += `<line x1="0" y1="520" x2="${lerp(0, 450, a)}" y2="${lerp(520, 560, a)}" stroke="#fff" stroke-width="40" stroke-linecap="round"/>`;
        for (let i = 0; i < 7; i++) { const ty = lerp(380, 820, i / 6);
          s += `<line x1="640" y1="${580 + i * 6}" x2="${lerp(640, 1080, b)}" y2="${lerp(580 + i * 6, ty, b)}" stroke="${RB[i]}" stroke-width="26" stroke-linecap="round" opacity="${b > 0 ? 1 : 0}"/>`; }
        s += `<path transform="translate(540 600)" d="${dropPath(1.25)}" fill="#bfe4ff" opacity="0.85" stroke="#fff" stroke-width="10"/>
          <ellipse cx="490" cy="600" rx="22" ry="40" fill="#fff" opacity="0.8"/>
          <circle cx="510" cy="650" r="10" fill="#1a1040"/><circle cx="575" cy="650" r="10" fill="#1a1040"/><path d="M 520 680 q 22 18 44 0" stroke="#1a1040" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      }
      if (si === 4) {
        T.col.forEach((ct, i) => { s += arcBand(540, 980, 470 - i * 44, 46, RB[i], eo(seg(t, ct - 0.05, ct + 0.3))); });
        s += K.cloud(90, 960, 0.9) + K.cloud(990, 960, 0.9);
      }
      if (si === 5) {
        for (let i = 0; i < 7; i++) s += circleBand(540, 600, 340 - i * 30, 32, RB[i], eo(seg(into, 0.1 + i * 0.03, 1.4 + i * 0.03)));
        const px = lerp(-200, 1300, seg(into, 0, 3.2));
        s += `<line x1="${px - 600}" y1="270" x2="${px - 120}" y2="270" stroke="#fff" stroke-width="10" stroke-dasharray="20 18" opacity="0.8"/>` + plane(px, 270, 1.1);
      }
      return s;
    },
    cat(st, c) { if (c.si >= 1 && c.si <= 5) { st.lookY = -1; } if (c.si === 4) st.brow = 0.8;
      if (c.si === 5 && c.t > c.T.daire) { st.brow = 1; st.ear = 0.6; } },
    stickers(c) { return [{ t: 0.4, txt: '🌈?', col: '#ff7fb0', y: 470, dx: 300, size: 170 }, { t: c.T.col[6] + 0.35, txt: '7 RENK!', col: '#ffd84d', y: 140, size: 180 },
      { t: c.T.daire, txt: 'DAİRE!', col: '#7af0ff', y: 60, size: 160, d: 0.9 }]; },
    flashes(c) { return [c.T.gok]; },
    capY: 1010,
  };
})();
