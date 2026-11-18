(function () {
  const { seg, eo, back, lerp } = K;
  function bee(x, y, s, t, rot = 0) {
    const w = 0.5 + 0.5 * Math.abs(Math.sin(t * 40));
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <ellipse cx="-15" cy="-45" rx="34" ry="${46 * w}" fill="#e8f8ff" opacity="0.85" stroke="#9fd8ff" stroke-width="4" transform="rotate(-25 -15 -45)"/>
      <ellipse cx="22" cy="-45" rx="30" ry="${40 * w}" fill="#e8f8ff" opacity="0.85" stroke="#9fd8ff" stroke-width="4" transform="rotate(20 22 -45)"/>
      <ellipse cx="0" cy="0" rx="70" ry="50" fill="#ffd23f" stroke="#1a1040" stroke-width="6"/>
      <path d="M -22 -47 Q -32 0 -22 47 M 8 -50 Q -2 0 8 50" stroke="#1a1040" stroke-width="16" fill="none"/>
      <circle cx="40" cy="-8" r="9" fill="#1a1040"/><circle cx="43" cy="-11" r="3" fill="#fff"/>
      <path d="M 36 14 q 10 8 20 0" stroke="#1a1040" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="54" cy="8" rx="8" ry="5" fill="#ff7fb0" opacity="0.7"/>
      <path d="M 45 -40 q 10 -30 25 -35 M 30 -45 q 0 -30 10 -40" stroke="#1a1040" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="70" cy="-75" r="6" fill="#1a1040"/><circle cx="40" cy="-85" r="6" fill="#1a1040"/></g>`;
  }
  function flower(x, y, s, col, stem = true) {
    let p = ''; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; p += `<circle cx="${Math.cos(a) * 34}" cy="${Math.sin(a) * 34}" r="26" fill="${col}"/>`; }
    return `<g transform="translate(${x} ${y}) scale(${s})">${stem ? `<path d="M 0 0 Q -10 80 0 160" stroke="#3f9f4a" stroke-width="12" fill="none"/><ellipse cx="18" cy="90" rx="26" ry="12" fill="#5cbf4f" transform="rotate(-30 18 90)"/>` : ''}
      ${p}<circle r="26" fill="#ffd23f" stroke="#e8a21a" stroke-width="5"/></g>`;
  }
  function jar(cx, cy, s, glow) {
    return `<g transform="translate(${cx} ${cy}) scale(${s})">
      <circle r="260" fill="#ffd23f" opacity="${0.35 * glow}" filter="url(#b80)"/>
      <rect x="-150" y="-150" width="300" height="320" rx="60" fill="#f6a91c" stroke="#1a1040" stroke-width="8"/>
      <path d="M -150 -40 Q -75 -10 0 -40 T 150 -40 V -100 Q 150 -150 100 -150 H -100 Q -150 -150 -150 -100 Z" fill="#ffd877" opacity="0.6"/>
      <rect x="-165" y="-205" width="330" height="70" rx="20" fill="#c9752a" stroke="#1a1040" stroke-width="8"/>
      <rect x="-100" y="0" width="200" height="100" rx="20" fill="#fff6dc" stroke="#1a1040" stroke-width="6"/>
      ${K.text(0, 75, 80, 'BAL', '#c9752a')}
      <path d="M -120 -110 v 220" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity="0.45"/></g>`;
  }
  const COLS = ['#ff7fb0', '#ffffff', '#b07fff', '#ff9a3c', '#7fd0ff'];
  window.EP = {
    theme: 'meadow', bigScenes: [0, 5],
    init(c) { c.T = { mil: c.wt(2, 'milyonlarca'), zi: c.wt(2, 'ziyaret'), dans: c.wt(3, 'dans'), kon: c.wt(3, 'konuşur'), yil: c.wt(4, 'yıllarca'), boz: c.wt(4, 'bozulmaz') }; },
    stage(t, c) {
      const { si, into, T } = c; let s = '';
      if (si === 0) s += `<circle cx="540" cy="1000" r="${320 + 40 * Math.sin(t * 3)}" fill="#fff6b0" opacity="0.6" filter="url(#b80)"/>`;
      if (si === 0) s += bee(230 + Math.sin(t * 3) * 50, 470 + Math.cos(t * 4) * 30, 0.9, t, 10);
      if (si === 1) {
        s += `<path d="M -50 900 Q 270 760 540 850 T 1130 820 V 1920 H -50 Z" fill="#8edb76"/>`;
        const fx = [160, 350, 540, 730, 920], fy = [760, 700, 740, 690, 750];
        fx.forEach((x, i) => s += flower(x, fy[i], 1.1, COLS[i]));
        const p = seg(into, 0.3, c.L[1].end - c.ts) * 4, k = Math.min(3, Math.floor(p)), f = p - k;
        const bx = lerp(fx[k], fx[k + 1], eo(f)), by = lerp(fy[k], fy[k + 1], f) - 80 - Math.sin(f * Math.PI) * 160;
        s += `<path d="M ${fx[0]} ${fy[0] - 80} ${fx.slice(1, k + 1).map((x, i) => `L ${x} ${fy[i + 1] - 80}`).join(' ')} L ${bx} ${by}" stroke="#fff" stroke-width="7" stroke-dasharray="4 18" stroke-linecap="round" fill="none"/>`;
        s += bee(bx, by, 1.0, t, Math.sin(t * 6) * 10);
      }
      if (si === 2) {
        const n = 26, appear = seg(t, T.mil - 0.1, T.zi + 0.4);
        for (let i = 0; i < n; i++) { if (i / n > appear) break; const a = i / n * Math.PI * 2, r = 330 + (i % 2) * 70;
          s += flower(540 + Math.cos(a) * r, 620 + Math.sin(a) * r * 0.85, 0.45 * back(seg(appear, i / n, i / n + 0.12)), COLS[i % 5], false); }
        s += jar(540, 640, back(seg(into, 0, 0.4)) * 0.95, 0.6);
        const num = Math.floor(Math.pow(seg(t, T.mil - 0.1, T.zi + 0.2), 2) * 1000000);
        if (t > T.mil - 0.1) s += K.text(540, 230, 120, num.toLocaleString('tr-TR') + (num >= 1000000 ? '+' : ''), '#ffd23f') + K.text(540, 310, 70, 'çiçek 🌼', '#fff');
      }
      if (si === 3) {
        const a = Math.max(0, t - T.dans + 0.3) * 3.2;
        let tr = ''; for (let k = 0; k <= 60; k++) { const aa = a - k * 0.05; if (aa < 0) break; tr += `${k ? 'L' : 'M'} ${540 + 260 * Math.sin(aa)} ${600 + 150 * Math.sin(2 * aa)} `; }
        s += `<path d="${tr}" stroke="#fff" stroke-width="8" stroke-dasharray="4 16" stroke-linecap="round" fill="none"/>`;
        s += bee(540 + 260 * Math.sin(a) + Math.sin(t * 50) * 6, 600 + 150 * Math.sin(2 * a), 1.0, t, Math.cos(a) * 30);
        for (let i = 0; i < 4; i++) { const ph = (t * 0.8 + i / 4) % 1;
          s += K.text(540 + 260 * Math.sin(a - i) , 520 - ph * 260, 70, i % 2 ? '♪' : '♫', '#ff7fb0', 'middle', `opacity="${1 - ph}"`); }
        s += bee(160, 300, 0.7, t, 10) + bee(920, 320, 0.7, t + 1, -10);
        if (t > T.kon) s += K.text(160, 210, 70, '!', '#ffd23f') + K.text(920, 230, 70, '!', '#ffd23f');
      }
      if (si === 4) {
        s += jar(540, 640, lerp(0.9, 1.15, eo(seg(into, 0, 0.6))), 1 + 0.3 * Math.sin(t * 4));
        const yrs = Math.floor(lerp(1, 100, Math.pow(seg(t, T.yil - 0.1, T.boz + 0.2), 1.6)));
        const cp = back(seg(t, T.yil - 0.15, T.yil + 0.2));
        if (cp > 0) s += `<g transform="translate(860 300) scale(${cp}) rotate(8)"><rect x="-120" y="-100" width="240" height="210" rx="20" fill="#fff" stroke="#1a1040" stroke-width="8"/>
          <rect x="-120" y="-100" width="240" height="60" rx="20" fill="#ff4f6d"/>${K.text(0, 50, 100, yrs + (yrs >= 100 ? '+' : ''), '#1a1040')}${K.text(0, 100, 46, 'YIL', '#ff4f6d')}</g>`;
      }
      return s;
    },
    cat(st, c) { if (c.si >= 1 && c.si <= 4) st.lookY = -1; if (c.si === 3) st.tail = Math.sin(c.t * 9); if (c.si === 2 && c.t > c.T.zi) st.brow = 1; },
    stickers(c) { return [{ t: 0.4, txt: '🍯?', col: '#ffd23f', y: 470, dx: 300, size: 170 }, { t: c.T.boz, txt: 'HÂLÂ TAZE!', col: '#ffd23f', y: 90, size: 150 }]; },
    flashes(c) { return []; },
  };
})();
