(function () {
  const { seg, eo, back, lerp, cl } = K;
  const mix = (a, b, x) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b);
    return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], x))).join(',')})`; };
  function heart(x, y, s, col) {
    return `<path transform="translate(${x} ${y}) scale(${s})" d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="${col}" stroke="#1a1040" stroke-width="6" stroke-linejoin="round"/>
      <ellipse transform="translate(${x} ${y}) scale(${s})" cx="-20" cy="-30" rx="9" ry="6" fill="#fff" opacity="0.7"/>`;
  }
  function octo(cx, cy, r, t, col, rock, look) {
    let arms = '';
    for (let i = 0; i < 8; i++) {
      const bx = cx + lerp(-0.85, 0.85, i / 7) * r, dir = lerp(-1, 1, i / 7);
      let d = `M ${bx} ${cy + r * 0.45}`, px = bx, py = cy + r * 0.45;
      for (let k = 1; k <= 6; k++) { const nx = bx + dir * k * r * 0.17 + Math.sin(t * 3 + i + k * 0.9) * r * 0.1, ny = cy + r * 0.45 + k * r * 0.17;
        d += ` Q ${px} ${py} ${(px + nx) / 2} ${(py + ny) / 2}`; px = nx; py = ny; }
      arms += `<path d="${d}" stroke="${col}" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round"/>`;
      arms += `<circle cx="${px}" cy="${py}" r="${r * 0.06}" fill="#ffd0e8" opacity="${1 - rock}"/>`;
    }
    const spots = rock > 0 ? [[-0.4, -0.3, 0.12], [0.35, -0.45, 0.09], [0.1, 0.1, 0.14], [-0.15, -0.6, 0.07], [0.5, 0, 0.08]]
      .map(([x, y, s]) => `<circle cx="${cx + x * r}" cy="${cy + y * r}" r="${s * r}" fill="#5d6270" opacity="${rock}"/>`).join('') : '';
    const ex = look * r * 0.05;
    return `${arms}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.95}" ry="${r}" fill="${col}"/>
      <ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.45}" rx="${r * 0.25}" ry="${r * 0.15}" fill="#fff" opacity="${0.25 * (1 - rock)}"/>${spots}
      <ellipse cx="${cx - r * 0.33}" cy="${cy + r * 0.05}" rx="${r * 0.2}" ry="${r * 0.24}" fill="#fff"/><ellipse cx="${cx + r * 0.33}" cy="${cy + r * 0.05}" rx="${r * 0.2}" ry="${r * 0.24}" fill="#fff"/>
      <circle cx="${cx - r * 0.3 + ex}" cy="${cy + r * 0.1}" r="${r * 0.12}" fill="#1a1040"/><circle cx="${cx + r * 0.36 + ex}" cy="${cy + r * 0.1}" r="${r * 0.12}" fill="#1a1040"/>
      <circle cx="${cx - r * 0.34 + ex}" cy="${cy + r * 0.04}" r="${r * 0.045}" fill="#fff"/><circle cx="${cx + r * 0.32 + ex}" cy="${cy + r * 0.04}" r="${r * 0.045}" fill="#fff"/>
      <path d="M ${cx - r * 0.15} ${cy + r * 0.38} q ${r * 0.15} ${r * 0.15} ${r * 0.3} 0" stroke="#1a1040" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${cx - r * 0.6}" cy="${cy + r * 0.35}" rx="${r * 0.12}" ry="${r * 0.07}" fill="#ff7fb0" opacity="${0.6 * (1 - rock)}"/><ellipse cx="${cx + r * 0.6}" cy="${cy + r * 0.35}" rx="${r * 0.12}" ry="${r * 0.07}" fill="#ff7fb0" opacity="${0.6 * (1 - rock)}"/>`;
  }
  function seaweed(t) {
    let s = '';
    [[60, 1], [130, 0.8], [960, 1.1], [1030, 0.85]].forEach(([x, k], i) => {
      let d = `M ${x} 1920`; for (let j = 1; j <= 6; j++) d += ` Q ${x + Math.sin(t * 2 + i + j) * 40 * k} ${1920 - j * 110 * k + 55} ${x + Math.sin(t * 2 + i + j + 0.5) * 30 * k} ${1920 - j * 110 * k}`;
      s += `<path d="${d}" stroke="${i % 2 ? '#3fbf7a' : '#2ea866'}" stroke-width="${34 * k}" fill="none" stroke-linecap="round"/>`; });
    return s;
  }
  function jar(cx, cy, lidRot, lidUp) {
    return `<rect x="${cx - 120}" y="${cy - 150}" width="240" height="300" rx="50" fill="#cfefff" opacity="0.35" stroke="#e8fbff" stroke-width="10"/>
      <text x="${cx}" y="${cy + 40}" text-anchor="middle" font-size="120">🦐</text>
      <path d="M ${cx - 90} ${cy - 100} v 180" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity="0.6"/>
      <g transform="translate(${cx} ${cy - 165 - lidUp}) rotate(${lidRot})"><rect x="-135" y="-30" width="270" height="60" rx="18" fill="#ff8a3d" stroke="#1a1040" stroke-width="8"/>
      ${[-90, -45, 0, 45, 90].map(x => `<line x1="${x}" y1="-22" x2="${x}" y2="22" stroke="#c95a1a" stroke-width="8"/>`).join('')}</g>`;
  }
  window.EP = {
    theme: 'ocean', bigScenes: [0, 6],
    init(c) { c.T = { a: c.wt(1, 'ahtapot'), h: [c.wt(2, 'biri'), c.wt(2, 'ikisi'), c.wt(2, 'üçü')], mavi: c.wt(3, 'mavi'), renk: c.wt(4, 'rengini'), hop: c.wt(4, 'hop'),
      kav: c.wt(5, 'kavanoz'), ac: c.wt(5, 'açabilir') }; },
    stage(t, c) {
      const { si, into, T } = c; let s = si > 0 && si < 6 ? seaweed(t) : '';
      const PUR = '#b26bff', ROCK = '#8a8f9c';
      if (si === 0) s += `<circle cx="540" cy="1000" r="${320 + 40 * Math.sin(t * 3)}" fill="#5ff0ff" opacity="0.25" filter="url(#b80)"/>`;
      if (si >= 1 && si <= 4) {
        const y = si === 1 ? lerp(1500, 520, back(seg(into, 0, 0.8))) : 520 + Math.sin(t * 2) * 15;
        let col = PUR, rock = 0, x = 540;
        if (si === 3) col = mix(PUR, '#6b8cff', 0.35 * seg(t, T.mavi - 0.1, T.mavi + 0.4));
        if (si === 4) { x = lerp(540, 620, eo(seg(into, 0, 0.5))); const k = eo(seg(t, T.renk, T.hop)); col = mix(PUR, ROCK, k); rock = k;
          s += `<path d="M 260 760 Q 230 560 380 470 Q 520 400 640 450 Q 820 380 860 600 Q 900 760 820 790 Z" fill="#8a8f9c" stroke="#5d6270" stroke-width="10"/>
            <circle cx="420" cy="560" r="30" fill="#5d6270"/><circle cx="760" cy="650" r="22" fill="#5d6270"/><circle cx="560" cy="720" r="18" fill="#5d6270"/>`; }
        s += octo(x, y, si === 4 ? 160 : 190, t, col, rock, Math.sin(t));
        if (si === 2 || si === 3) {
          T.h.forEach((ht, i) => { const p = back(seg(t, ht - 0.05, ht + 0.3)); if (si === 3) {}
            const pp = si === 3 ? 1 : p; if (pp <= 0) return;
            const beat = 1 + 0.08 * Math.max(0, Math.sin(t * 9 + i));
            const col2 = si === 3 ? mix('#ff4f6d', '#3f7dff', seg(t, T.mavi - 0.1, T.mavi + 0.3)) : '#ff4f6d';
            s += heart(540 + (i - 1) * 190, 230 - (i === 1 ? 40 : 0), pp * beat * 1.4, col2); });
        }
        if (si === 3) { const p = back(seg(t, T.mavi, T.mavi + 0.4)); if (p > 0)
          s += `<path transform="translate(870 760) scale(${p})" d="M 0 -90 C 40 -30 70 10 70 40 A 70 70 0 0 1 -70 40 C -70 10 -40 -30 0 -90 Z" fill="#3f7dff" stroke="#1a1040" stroke-width="8"/><ellipse transform="translate(870 760) scale(${p})" cx="-25" cy="20" rx="14" ry="22" fill="#fff" opacity="0.6"/>`; }
      }
      if (si === 5) {
        const tw = seg(t, T.kav, T.ac); const up = eo(seg(t, T.ac, T.ac + 0.5)) * 260;
        s += jar(720, 600, Math.sin(tw * 25) * 10 + up * 0.15, up);
        s += octo(330, 560, 150, t, PUR, 0, 1);
        s += `<path d="M 430 600 Q 560 360 ${700} ${435 - up}" stroke="${PUR}" stroke-width="34" fill="none" stroke-linecap="round"/>`;
      }
      return s;
    },
    cat(st, c) { if (c.si >= 1 && c.si <= 5) { st.lookX = c.si === 5 ? 0.4 : 0; st.lookY = -1; }
      if (c.si === 2) st.brow = 1; if (c.si === 4 && c.t > c.T.hop) { st.brow = 1; st.ear = 0.6; } },
    catOver(c) { // dalgıç fanusu
      return `<circle cx="350" cy="300" r="300" fill="rgba(220,250,255,0.10)" stroke="#dffaff" stroke-width="12" opacity="0.9"/>
        <path d="M 150 170 A 250 250 0 0 1 330 60" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.6"/>
        <rect x="160" y="555" width="380" height="40" rx="20" fill="#ffd84d" stroke="#1a1040" stroke-width="6"/>`;
    },
    stickers(c) { return [{ t: 0.4, txt: '3 ❤️?', col: '#ff7fb0', y: 470, dx: 290, size: 150 }, { t: c.T.hop, txt: 'HOP!', col: '#ffd84d', y: 120 },
      { t: c.T.ac, txt: 'AÇILDI!', col: '#7af0ff', y: 100, size: 170 }]; },
    flashes(c) { return [c.T.hop]; },
  };
})();
