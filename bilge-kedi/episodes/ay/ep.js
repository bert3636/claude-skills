(function () {
  const { seg, eo, back, lerp } = K;
  function moon(cx, cy, r, t, glow, wink) {
    const k = r / 200;
    const eyeR = wink ? `<path d="M ${cx + 35 * k} ${cy - 20 * k} l ${50 * k} 0" stroke="#5a5040" stroke-width="${11 * k}" stroke-linecap="round"/>`
                      : `<path d="M ${cx + 35 * k} ${cy - 10 * k} q ${25 * k} ${-30 * k} ${50 * k} 0" stroke="#5a5040" stroke-width="${11 * k}" fill="none" stroke-linecap="round"/>`;
    return `<defs><radialGradient id="mg" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#cfc8a8"/></radialGradient></defs>
      <circle cx="${cx}" cy="${cy}" r="${r * 1.6}" fill="#fff6c8" opacity="${0.25 + 0.35 * glow}" filter="url(#b80)"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#mg)"/>
      <circle cx="${cx - 90 * k}" cy="${cy - 90 * k}" r="${30 * k}" fill="#bdb594" opacity="0.7"/><circle cx="${cx + 110 * k}" cy="${cy + 70 * k}" r="${38 * k}" fill="#bdb594" opacity="0.7"/>
      <circle cx="${cx - 40 * k}" cy="${cy + 120 * k}" r="${22 * k}" fill="#bdb594" opacity="0.7"/><circle cx="${cx + 60 * k}" cy="${cy - 130 * k}" r="${16 * k}" fill="#bdb594" opacity="0.7"/>
      <path d="M ${cx - 85 * k} ${cy - 10 * k} q ${25 * k} ${-30 * k} ${50 * k} 0" stroke="#5a5040" stroke-width="${11 * k}" fill="none" stroke-linecap="round"/>${eyeR}
      <path d="M ${cx - 40 * k} ${cy + 40 * k} q ${40 * k} ${40 * k} ${80 * k} 0" stroke="#5a5040" stroke-width="${11 * k}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${cx - 110 * k}" cy="${cy + 30 * k}" rx="${26 * k}" ry="${15 * k}" fill="#ffa0a8" opacity="0.5"/><ellipse cx="${cx + 110 * k}" cy="${cy + 30 * k}" rx="${26 * k}" ry="${15 * k}" fill="#ffa0a8" opacity="0.5"/>`;
  }
  function earth(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.25}" fill="#5fc6ff" opacity="0.3" filter="url(#b30)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#3aa0ff"/>
      <path d="M ${cx - r * 0.7} ${cy - r * 0.3} q ${r * 0.3} ${-r * 0.5} ${r * 0.7} ${-r * 0.2} q ${r * 0.2} ${r * 0.35} ${-r * 0.25} ${r * 0.5} q ${-r * 0.4} ${r * 0.1} ${-r * 0.45} ${-r * 0.3}Z" fill="#5fd36a"/>
      <path d="M ${cx + r * 0.2} ${cy + r * 0.3} q ${r * 0.4} ${-r * 0.25} ${r * 0.65} ${r * 0.05} q ${-r * 0.1} ${r * 0.45} ${-r * 0.5} ${r * 0.4}Z" fill="#5fd36a"/>
      <circle cx="${cx - r * 0.28}" cy="${cy}" r="${r * 0.09}" fill="#10204a"/><circle cx="${cx + r * 0.28}" cy="${cy}" r="${r * 0.09}" fill="#10204a"/>
      <path d="M ${cx - r * 0.2} ${cy + r * 0.22} q ${r * 0.2} ${r * 0.2} ${r * 0.4} 0" stroke="#10204a" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>`;
  }
  function sun(cx, cy, r, t) {
    let rays = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.6;
      rays += `<line x1="${cx + Math.cos(a) * r * 1.1}" y1="${cy + Math.sin(a) * r * 1.1}" x2="${cx + Math.cos(a) * r * 1.5}" y2="${cy + Math.sin(a) * r * 1.5}" stroke="#ffd84d" stroke-width="${r * 0.14}" stroke-linecap="round"/>`; }
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.8}" fill="#ffd84d" opacity="0.35" filter="url(#b80)"/>${rays}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffc83d"/>
      <path d="M ${cx - r * 0.45} ${cy - r * 0.05} q ${r * 0.17} ${-r * 0.25} ${r * 0.34} 0 M ${cx + r * 0.11} ${cy - r * 0.05} q ${r * 0.17} ${-r * 0.25} ${r * 0.34} 0" stroke="#8a4a10" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>
      <path d="M ${cx - r * 0.3} ${cy + r * 0.25} q ${r * 0.3} ${r * 0.3} ${r * 0.6} 0" stroke="#8a4a10" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>`;
  }
  function ground() {
    return `<ellipse cx="540" cy="2050" rx="1100" ry="560" fill="#b9b39a"/><ellipse cx="540" cy="2050" rx="1100" ry="560" fill="none" stroke="#e8e2c8" stroke-width="10"/>
      <ellipse cx="200" cy="1640" rx="90" ry="26" fill="#9d977e"/><ellipse cx="880" cy="1700" rx="120" ry="32" fill="#9d977e"/><ellipse cx="640" cy="1850" rx="70" ry="20" fill="#9d977e"/>`;
  }
  function boot(x, y, rot, s) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-26" y="-50" width="52" height="100" rx="24" fill="#8f8970"/>
      ${[-35, -15, 5, 25].map(yy => `<rect x="-20" y="${yy}" width="40" height="9" rx="4" fill="#6f6a55"/>`).join('')}</g>`;
  }
  window.EP = {
    theme: 'space', bigScenes: [0, 5],
    init(c) { c.T = { isik: c.wt(1, 'ışık'), gunes: c.wt(2, 'güneş'), yans: c.wt(2, 'yansıtır'), zip: c.wt(3, 'zıplarsan'), yuk: c.wt(3, 'yükselirsin'),
      ayak: c.wt(4, 'ayak'), iz: c.wt(4, 'izleri'), hala: c.wt(4, 'hâlâ'), dur: c.wt(4, 'duruyor') }; },
    stage(t, c) {
      const { si, into, T } = c; let s = '';
      if (si === 0) s += `<circle cx="540" cy="1000" r="${300 + 40 * Math.sin(t * 3)}" fill="#fff6c8" opacity="0.2" filter="url(#b80)"/>`;
      if (si === 1) { const p = back(seg(into, 0, 0.6));
        s += earth(lerp(540, 250, eo(seg(into, 0.2, 0.9))), lerp(1100, 820, eo(seg(into, 0.2, 0.9))), 90);
        s += moon(lerp(540, 640, eo(seg(into, 0.2, 0.9))), 520, 210 * p, t, seg(t, T.isik - 0.1, T.isik + 0.4), false);
        const g = seg(t, T.isik, T.isik + 0.5); if (g > 0) s += `<path d="M 560 650 L 280 790" stroke="#fff6c8" stroke-width="${40 * g}" opacity="0.5" stroke-linecap="round" filter="url(#b12)"/>`; }
      if (si === 2) {
        s += sun(170, 260, 110, t) + earth(260, 860, 80) + moon(700, 560, 190, t, 0.5, t > T.yans && t < T.yans + 0.6);
        const a = seg(t, T.gunes - 0.1, T.gunes + 0.6), b = seg(t, T.gunes + 0.5, T.yans + 0.2);
        for (let k = 0; k < 3; k++) {
          const o = k * 30 - 30;
          if (a > 0) s += `<line x1="270" y1="${300 + o}" x2="${lerp(270, 540, a)}" y2="${lerp(300 + o, 470 + o, a)}" stroke="#ffe27a" stroke-width="12" stroke-linecap="round" stroke-dasharray="30 22" stroke-dashoffset="${-t * 120}"/>`;
          if (b > 0) s += `<line x1="560" y1="${640 + o}" x2="${lerp(560, 330, b)}" y2="${lerp(640 + o, 820 + o, b)}" stroke="#fff6c8" stroke-width="12" stroke-linecap="round" stroke-dasharray="30 22" stroke-dashoffset="${-t * 120}"/>`;
        }
      }
      if (si === 3 || si === 4) {
        s += earth(860, 260, 70);
        s += ground();
      }
      if (si === 4) {
        const steps = [[830, 1760, 30], [930, 1680, 40], [920, 1560, 30], [1010, 1490, 45]];
        const times = [T.ayak, T.iz, T.hala, T.dur];
        steps.forEach(([x, y, r], i) => { const p = back(seg(t, times[i] - 0.05, times[i] + 0.25)); if (p > 0) s += boot(x, y - 40, r, p * 1.5); });
        const fp = seg(t, c.L[4].start, c.L[4].start + 0.6);
        s += `<g transform="translate(540 560) scale(${back(fp)})">
          <path d="M -260 -60 q 120 -60 240 0 t 240 0 M -300 40 q 140 -60 280 0 t 280 0 M -220 140 q 110 -50 220 0 t 220 0" stroke="#bfe9ff" stroke-width="22" fill="none" stroke-linecap="round"/>
          <circle r="250" fill="none" stroke="#ff4f6d" stroke-width="34"/><line x1="-177" y1="177" x2="177" y2="-177" stroke="#ff4f6d" stroke-width="34" stroke-linecap="round"/>
          ${K.text(0, 360, 100, 'RÜZGÂR YOK!', '#fff')}</g>`;
      }
      return s;
    },
    catDy(c) {
      if (c.si !== 3) return 0;
      const ph = (c.t - c.T.zip) / 2.4; if (ph <= 0 || ph >= 1) return 0;
      return -540 * Math.sin(Math.PI * ph);
    },
    cat(st, c) {
      if (c.si === 1 || c.si === 2) { st.lookY = -1; st.lookX = 0.3; }
      if (c.si === 3) { st.lookY = 0; const ph = (c.t - c.T.zip) / 2.4; if (ph > 0 && ph < 1) { st.brow = 1; st.ear = 0.8; st.tail = Math.sin(c.t * 10); } }
      if (c.si === 4) { st.lookY = 0.6; st.lookX = -0.8; }
    },
    stickers(c) { return [{ t: 0.4, txt: '🌙?!', col: '#ffd84d', y: 470, dx: 300, size: 170 }, { t: c.T.yuk, txt: 'UÇUYORUM!', col: '#7af0ff', y: 200, size: 150 }]; },
    flashes(c) { return []; },
  };
})();
