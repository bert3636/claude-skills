(function () {
  const { seg, eo, lerp } = K;
  const CH = [['giris', 0], ['piril', 2], ['ay', 6], ['dunya', 10], ['okyanus', 11], ['arilar', 14], ['gokkusagi', 16], ['kar', 19], ['saturn', 22], ['eve', 25], ['kapanis', 28]];
  const RB = ['#ff6b6b', '#ffa45c', '#ffe27a', '#7fdc8a', '#6cbcff', '#6f7fe0', '#b98aea'];
  const chapOf = si => { let k = 0; CH.forEach((c, i) => { if (si >= c[1]) k = i; }); return k; };
  function starPath(x, y, r) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.5 : r; d += `${i ? 'L' : 'M'} ${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr} `; } return d + 'Z'; }
  function piril(x, y, r, t, sleepy = 0, col = '#ffe27a') {
    const tw = 1 + 0.05 * Math.sin(t * 2.2), k = r / 100;
    const eyes = sleepy > 0.5
      ? `<path d="M ${x - 32 * k} ${y} q ${14 * k} ${12 * k} ${28 * k} 0 M ${x + 4 * k} ${y} q ${14 * k} ${12 * k} ${28 * k} 0" stroke="#7a4a10" stroke-width="${7 * k}" fill="none" stroke-linecap="round"/>`
      : `<circle cx="${x - 18 * k}" cy="${y}" r="${9 * k}" fill="#4a2a10"/><circle cx="${x + 18 * k}" cy="${y}" r="${9 * k}" fill="#4a2a10"/><circle cx="${x - 15 * k}" cy="${y - 3 * k}" r="${3 * k}" fill="#fff"/><circle cx="${x + 21 * k}" cy="${y - 3 * k}" r="${3 * k}" fill="#fff"/>`;
    return `<g transform="translate(${x} ${y}) scale(${tw}) translate(${-x} ${-y})">
      <circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="${col}" opacity="0.35" filter="url(#b30)"/>
      <path d="${starPath(x, y + 8 * k, r)}" fill="${col}" stroke="#e8a21a" stroke-width="${7 * k}" stroke-linejoin="round"/>
      ${eyes}<path d="M ${x - 12 * k} ${y + 20 * k} q ${12 * k} ${10 * k} ${24 * k} 0" stroke="#7a4a10" stroke-width="${6 * k}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x - 34 * k}" cy="${y + 16 * k}" rx="${9 * k}" ry="${5 * k}" fill="#ff9fb8" opacity="0.7"/><ellipse cx="${x + 34 * k}" cy="${y + 16 * k}" rx="${9 * k}" ry="${5 * k}" fill="#ff9fb8" opacity="0.7"/></g>`;
  }
  function moon(cx, cy, r) {
    const k = r / 200;
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.5}" fill="#fff6c8" opacity="0.3" filter="url(#b80)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#f4efd8"/>
      <circle cx="${cx - 90 * k}" cy="${cy - 80 * k}" r="${30 * k}" fill="#d8d1b2"/><circle cx="${cx + 110 * k}" cy="${cy + 70 * k}" r="${36 * k}" fill="#d8d1b2"/><circle cx="${cx - 40 * k}" cy="${cy + 120 * k}" r="${20 * k}" fill="#d8d1b2"/>
      <path d="M ${cx - 85 * k} ${cy - 5 * k} q ${25 * k} ${-28 * k} ${50 * k} 0 M ${cx + 35 * k} ${cy - 5 * k} q ${25 * k} ${-28 * k} ${50 * k} 0" stroke="#6a6048" stroke-width="${10 * k}" fill="none" stroke-linecap="round"/>
      <path d="M ${cx - 40 * k} ${cy + 45 * k} q ${40 * k} ${36 * k} ${80 * k} 0" stroke="#6a6048" stroke-width="${10 * k}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${cx - 110 * k}" cy="${cy + 35 * k}" rx="${24 * k}" ry="${14 * k}" fill="#ffb0b8" opacity="0.5"/><ellipse cx="${cx + 110 * k}" cy="${cy + 35 * k}" rx="${24 * k}" ry="${14 * k}" fill="#ffb0b8" opacity="0.5"/>`;
  }
  function earth(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r * 1.2}" fill="#5fc6ff" opacity="0.3" filter="url(#b30)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#3a8fe8"/>
      <path d="M ${cx - r * 0.7} ${cy - r * 0.3} q ${r * 0.3} ${-r * 0.5} ${r * 0.7} ${-r * 0.2} q ${r * 0.2} ${r * 0.35} ${-r * 0.25} ${r * 0.5} q ${-r * 0.4} ${r * 0.1} ${-r * 0.45} ${-r * 0.3}Z" fill="#5fc36a"/>
      <path d="M ${cx + r * 0.2} ${cy + r * 0.3} q ${r * 0.4} ${-r * 0.25} ${r * 0.65} ${r * 0.05} q ${-r * 0.1} ${r * 0.45} ${-r * 0.5} ${r * 0.4}Z" fill="#5fc36a"/>
      <path d="M ${cx - r * 0.38} ${cy} q ${r * 0.1} ${r * 0.08} ${r * 0.2} 0 M ${cx + r * 0.18} ${cy} q ${r * 0.1} ${r * 0.08} ${r * 0.2} 0" stroke="#10204a" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>
      <path d="M ${cx - r * 0.15} ${cy + r * 0.2} q ${r * 0.15} ${r * 0.14} ${r * 0.3} 0" stroke="#10204a" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>`;
  }
  function octo(cx, cy, r, t) {
    let arms = ''; for (let i = 0; i < 8; i++) { const bx = cx + lerp(-0.8, 0.8, i / 7) * r, dir = lerp(-1, 1, i / 7);
      const wave = i === 7 ? Math.sin(t * 2) * r * 0.5 : 0;
      arms += `<path d="M ${bx} ${cy + r * 0.4} q ${dir * r * 0.4 + Math.sin(t + i) * r * 0.1} ${r * 0.5} ${dir * r * 0.55} ${r * 0.9 - (i === 7 ? r * 1.2 + wave : 0)}" stroke="#b98aea" stroke-width="${r * 0.2}" fill="none" stroke-linecap="round"/>`; }
    return `${arms}<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.95}" ry="${r}" fill="#b98aea"/>
      <circle cx="${cx - r * 0.3}" cy="${cy + r * 0.1}" r="${r * 0.13}" fill="#1a1040"/><circle cx="${cx + r * 0.3}" cy="${cy + r * 0.1}" r="${r * 0.13}" fill="#1a1040"/>
      <circle cx="${cx - r * 0.34}" cy="${cy + r * 0.05}" r="${r * 0.045}" fill="#fff"/><circle cx="${cx + r * 0.26}" cy="${cy + r * 0.05}" r="${r * 0.045}" fill="#fff"/>
      <path d="M ${cx - r * 0.15} ${cy + r * 0.38} q ${r * 0.15} ${r * 0.15} ${r * 0.3} 0" stroke="#1a1040" stroke-width="${r * 0.05}" fill="none" stroke-linecap="round"/>`;
  }
  function fish(x, y, s, col, t) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -40 0 Q 0 -32 40 0 Q 0 32 -40 0 Z" fill="${col}"/><path d="M -38 0 L -66 ${-20 + Math.sin(t * 6) * 6} L -66 ${20 + Math.sin(t * 6) * 6} Z" fill="${col}"/><circle cx="20" cy="-5" r="5" fill="#1a1040"/></g>`; }
  function flake(cx, cy, r, rot) {
    let d = ''; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + rot; d += `M ${cx} ${cy} L ${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r} `;
      for (const f of [0.45, 0.72]) { const bx = cx + Math.cos(a) * r * f, by = cy + Math.sin(a) * r * f; for (const sg of [-1, 1]) { const aa = a + sg * Math.PI / 3; d += `M ${bx} ${by} L ${bx + Math.cos(aa) * r * 0.25} ${by + Math.sin(aa) * r * 0.25} `; } } }
    return `<path d="${d}" stroke="#fff" stroke-width="${r * 0.08}" stroke-linecap="round" fill="none"/>`;
  }
  function hive(x, y, t) {
    return `<path d="M ${x - 250} ${y - 160} Q ${x} ${y - 200} ${x + 300} ${y - 150}" stroke="#6b4a2a" stroke-width="26" fill="none" stroke-linecap="round"/>
      <line x1="${x}" y1="${y - 180}" x2="${x}" y2="${y - 120}" stroke="#6b4a2a" stroke-width="10"/>
      ${[0, 1, 2, 3].map(i => `<ellipse cx="${x}" cy="${y - 90 + i * 55}" rx="${90 - Math.abs(i - 1.5) * 18}" ry="34" fill="#e8a21a" stroke="#a8701a" stroke-width="6"/>`).join('')}
      <ellipse cx="${x}" cy="${y + 40}" rx="22" ry="18" fill="#4a2a10"/>
      ${K.text(x + 120, y - 60 - (t * 20 % 40), 50, 'z', '#fff', 'middle', `opacity="${0.4 + 0.4 * Math.sin(t * 2)}"`)}${K.text(x + 160, y - 120 - (t * 20 % 40), 36, 'z', '#fff', 'middle', `opacity="${0.4 + 0.4 * Math.cos(t * 2)}"`)}`;
  }
  function tulip(x, y, col, open) {
    return `<path d="M ${x} ${y} V ${y + 130}" stroke="#3f8f4a" stroke-width="10"/><path d="M ${x - 30} ${y} Q ${x - 34} ${y - 50} ${x - 10 - open * 20} ${y - 60} L ${x} ${y - 40} L ${x + 10 + open * 20} ${y - 60} Q ${x + 34} ${y - 50} ${x + 30} ${y} Q ${x} ${y + 18} ${x - 30} ${y} Z" fill="${col}"/>`;
  }
  window.EP = {
    theme: 'space', calm: true, poses: { big: { x: 960, y: 650, s: 0.62 } }, bigScenes: [0, 1, 28, 29, 30], noLogo: true,
    dark(t, c) { return c.si >= 25 ? lerp(0, 0.35, seg(t, c.L[25].start, c.L[30].end)) : 0.15; },
    stage(t, c) {
      const { si, L } = c, k = chapOf(si), name = CH[k][0], t0 = c.sceneStart(CH[k][1]);
      const a = k === 0 ? 1 : eo(seg(t, t0 - 0.2, t0 + 1.4)), loc = t - t0;
      let s = '';
      if (name === 'giris') {
        s += `<path d="M 1580 150 A 110 110 0 1 0 1700 300 A 85 85 0 1 1 1580 150 Z" fill="#ffe9a8" opacity="0.9"/>`;
        s += `<g opacity="${seg(t, 0.5, 2)}">${K.text(960, 130, 96, "Pırıl'ın Uzay Yolculuğu", '#ffe9a8')}${K.text(960, 210, 54, '🌙 Uyku Masalı 🌙', '#fff')}</g>`;
      }
      if (name === 'piril') {
        const mv = eo(seg(t, L[5].start, L[5].end + 1.5));
        s += piril(lerp(620, 980, mv), lerp(430, 360, mv) + Math.sin(t) * 12, 110, t);
        for (let i = 0; i < 6; i++) s += piril(150 + i * 210, 160 + (i % 2) * 520 + Math.sin(t + i) * 8, 36, t + i, 1, '#fff4c0');
        if (si === 4) { const p = eo(seg(t, L[4].start, L[4].start + 0.8));
          s += `<g opacity="${p}"><circle cx="840" cy="230" r="70" fill="#fff"/><circle cx="760" cy="320" r="18" fill="#fff"/><circle cx="730" cy="355" r="10" fill="#fff"/>${K.text(840, 255, 80, '?', '#3f4fd0')}</g>`; }
      }
      if (name === 'ay') {
        s += moon(660, 520, 240);
        const p = eo(seg(t, t0, t0 + 3));
        s += piril(lerp(200, 300, p), lerp(250, 300, p) + Math.sin(t) * 10, 60, t, si === 9 ? 1 : 0);
        if (si === 8) { const q = seg(t, L[8].start + 1, L[8].start + 3);
          s += `<circle cx="110" cy="110" r="70" fill="#ffc83d"/><circle cx="110" cy="110" r="120" fill="#ffd84d" opacity="0.3" filter="url(#b30)"/>
            <line x1="170" y1="160" x2="${lerp(170, 470, q)}" y2="${lerp(160, 380, q)}" stroke="#ffe27a" stroke-width="10" stroke-dasharray="26 20" stroke-dashoffset="${-t * 40}" stroke-linecap="round"/>`; }
      }
      if (name === 'dunya') { const z = lerp(200, 320, eo(seg(t, t0, t0 + 7)));
        s += earth(660, 520, z) + piril(1080, 230, 55, t); }
      if (name === 'okyanus') {
        s += `<rect width="1920" height="1080" fill="#1a5f9f" opacity="${0.85 * a}"/>`;
        for (let i = 0; i < 6; i++) { const x = (i * 300 + t * 30) % 1500 - 100; s += `<path d="M ${x} 140 q 75 -30 150 0 t 150 0" stroke="#7fd0ff" stroke-width="10" fill="none" opacity="0.5"/>`; }
        s += piril(660, 70, 40, t, 0) ;
        s += octo(640, 560, 150, t);
        for (let i = 0; i < 5; i++) s += fish(((i * 290 + t * (30 + i * 6)) % 1500) - 80, 330 + i * 110, 0.9, ['#ffb35c', '#ff7fb0', '#ffe27a', '#7af0ff', '#b0ff8a'][i], t);
        if (si === 12) for (let i = 0; i < 3; i++) { const p = 1 + 0.12 * Math.max(0, Math.sin(t * 5 + i)); s += `<path transform="translate(${540 + i * 100} 340) scale(${p * 0.9})" d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#ff7f9e"/>`; }
        for (let i = 0; i < 14; i++) { const y = 1080 - ((i * 140 + t * 50) % 1100); s += `<circle cx="${100 + i * 90 + Math.sin(t + i) * 10}" cy="${y}" r="${6 + i % 4 * 3}" fill="none" stroke="#dffaff" stroke-width="3" opacity="0.5"/>`; }
      }
      if (name === 'arilar') {
        s += `<path d="M -50 860 Q 480 700 1350 820 T 1980 800 V 1100 H -50 Z" fill="#2f5a3a"/>`;
        ['#ff7fb0', '#ffe27a', '#b98aea', '#ff9a3c', '#7fd0ff'].forEach((col, i) => s += tulip(120 + i * 150, 780 - (i % 2) * 20, col, 0));
        s += hive(1000, 420, t) + piril(400, 200, 50, t, 0);
      }
      if (name === 'gokkusagi') {
        s += `<rect x="0" y="560" width="1920" height="520" fill="#1f3f6f"/><path d="M 80 380 H 360 V 1080 H 80 Z" fill="#9fd8ff" opacity="0.55"/>`;
        for (let i = 0; i < 6; i++) s += `<line x1="${110 + i * 45}" y1="${380 + (t * 200 + i * 80) % 700}" x2="${110 + i * 45}" y2="${440 + (t * 200 + i * 80) % 700}" stroke="#fff" stroke-width="8" opacity="0.6"/>`;
        s += `<path d="M 0 380 Q 220 330 400 380 L 400 560 L 0 560 Z" fill="#2a4a3a"/>`;
        const ws = ['kırmızı', 'turuncu', 'sarı', 'yeşil', 'mavi', 'lacivert', 'mor'];
        for (let i = 0; i < 7; i++) { const ti = si === 18 ? c.wt(18, ws[i]) : -1, on = si < 18 ? 0.55 : (t >= ti - 0.1 ? 1 : 0.55);
          const p = eo(seg(t, t0 + 0.5, t0 + 4)), r = 520 - i * 34;
          s += `<path d="M ${760 - r} 620 A ${r} ${r} 0 0 1 ${760 + r} 620" pathLength="1" stroke-dasharray="${p} 1" stroke="${RB[i]}" stroke-width="32" fill="none" opacity="${on * 0.8}"/>`; }
        s += moon(1180, 170, 80) + piril(240, 160, 46, t, 0);
      }
      if (name === 'kar') {
        s += `<g opacity="${a * 0.95}">${K.cloud(660, 520, 4.2)}</g>`;
        const n = si >= 20 ? 10 : 0;
        for (let i = 0; i < n; i++) { const ang = i / n * Math.PI * 2 + t * 0.3; s += flake(660 + Math.cos(ang) * 330, 500 + Math.sin(ang) * 210, 34 + (i % 3) * 8, t * 0.4 + i); }
        s += piril(660, 500, 80, t, 0);
      }
      if (name === 'saturn') {
        const cx = 640, cy = 520;
        s += `<ellipse cx="${cx}" cy="${cy}" rx="480" ry="120" fill="none" stroke="#e8c88a" stroke-width="40" opacity="0.85" transform="rotate(-12 ${cx} ${cy})"/>
          <circle cx="${cx}" cy="${cy}" r="210" fill="#e8b86a"/><path d="M ${cx - 205} ${cy - 40} Q ${cx} ${cy - 10} ${cx + 205} ${cy - 40} M ${cx - 200} ${cy + 50} Q ${cx} ${cy + 80} ${cx + 200} ${cy + 50}" stroke="#c9904a" stroke-width="24" fill="none"/>
          <path d="M ${cx - 470} ${cy + 100} A 480 120 0 0 0 ${cx + 470} ${cy - 100}" fill="none" stroke="#f4dca8" stroke-width="40" opacity="0.95" transform="rotate(-12 ${cx} ${cy}) translate(0 0)"/>`;
        const p = si >= 23 ? (seg(t, L[23].start, L[24].end + 1.5)) : 0, ang = Math.PI * (1 - p);
        const px = cx + Math.cos(ang) * 470, py = cy + Math.sin(ang) * 115;
        const rot = -12 * Math.PI / 180, rx = cx + (px - cx) * Math.cos(rot) - (py - cy) * Math.sin(rot), ry = cy + (px - cx) * Math.sin(rot) + (py - cy) * Math.cos(rot);
        s += piril(si >= 23 ? rx : 230, si >= 23 ? ry - 60 : 230, 55, t, 0);
      }
      if (name === 'eve') {
        const sl = si >= 27 ? seg(t, L[27].start + 1, L[27].start + 3) : 0;
        for (let i = 0; i < 5; i++) { const ang = i / 5 * Math.PI * 2 + 0.3, hug = si >= 26 ? eo(seg(t, L[26].start + 1, L[26].start + 3)) : 0, R = lerp(380, 200, hug);
          s += piril(660 + Math.cos(ang) * R * 1.3, 480 + Math.sin(ang) * R, 45, t + i, sl > 0.3 ? 1 : 0, '#fff4c0'); }
        s += `<g opacity="${lerp(1, 0.6, sl)}">${piril(660, 480, 100, t, si >= 25 ? (si === 25 ? (Math.sin(t * 1.5) > 0.3 ? 1 : 0) : 1) : 0)}</g>`;
        if (sl > 0.5) s += K.text(790, 360 - (t * 15 % 40), 60, 'z', '#fff', 'middle', `opacity="${0.6}"`) + K.text(840, 300 - (t * 15 % 40), 44, 'z', '#fff', 'middle', 'opacity="0.5"');
      }
      if (name === 'kapanis') s += `<path d="M 1580 150 A 110 110 0 1 0 1700 300 A 85 85 0 1 1 1580 150 Z" fill="#ffe9a8" opacity="0.9"/>` + piril(330, 250, 50, t, 1) + (si === 30 ? `<g opacity="${seg(t, L[30].end, L[30].end + 1.2)}">${K.text(960, 150, 110, '🌙 İyi geceler 🌙', '#ffe9a8')}</g>` : '');
      return k === 0 ? s : `<g opacity="${a}">${s}</g>`;
    },
    catOver() { // gece takkesi
      return `<path d="M 130 175 Q 260 -110 600 -70 Q 700 -40 690 60 Q 600 0 540 60 Q 560 110 570 175 Z" fill="#4a5fd0" stroke="#1a1040" stroke-width="8" stroke-linejoin="round"/>
        ${[[300, 60], [420, 0], [500, 110], [240, 130]].map(([x, y]) => `<path d="${starPath(x, y, 18)}" fill="#ffe27a"/>`).join('')}
        <circle cx="690" cy="70" r="42" fill="#fff" stroke="#1a1040" stroke-width="7"/>
        <rect x="110" y="150" width="480" height="60" rx="30" fill="#fff" stroke="#1a1040" stroke-width="7"/>`;
    },
    cat(st, c) {
      st.tail = Math.sin(c.t * 1.2) * 0.6; st.brow = 0.3;
      if (![0, 1, 28, 29, 30].includes(c.si)) { st.lookX = -0.7; st.lookY = -0.2; }
      if (c.si >= 28) { st.lookX = 0; st.lookY = 0.2; }
      // sona doğru gözler yarı kapalı
      if (c.si >= 29) st.blink = Math.max(st.blink, 0.45 + 0.2 * Math.sin(c.t));
      if (c.si === 30 && c.t > c.L[30].end + 0.6) st.blink = 1;
    },
    stickers() { return []; }, flashes() { return []; },
  };
})();
