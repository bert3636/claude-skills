(function () {
  const { seg, eo, back, lerp } = K;
  // soru verisi: satır = 2 + 2k (soru), 3 + 2k (cevap)
  const Q = [
    { icon: '🐙', q: 'Ahtapotun kaç kalbi var?', o: [['Bir', '❤️'], ['İki', '❤️❤️'], ['Üç', '❤️❤️❤️']], k: ['bir', 'iki', 'üç'], a: 2 },
    { icon: '🌙', q: "Ay'ın ışığı nereden gelir?", o: [["Güneş'ten", '☀️'], ['Kendinden', '🌙'], ['Yıldızlardan', '⭐']], k: ["güneş'ten", 'kendinden', 'yıldızlardan'], a: 0 },
    { icon: '🌈', q: 'Gökkuşağında kaç renk var?', o: [['Beş', '5'], ['Altı', '6'], ['Yedi', '7']], k: ['beş', 'altı', 'yedi'], a: 2 },
    { icon: '🐝', q: 'Arılar yolu nasıl anlatır?', o: [['Şarkıyla', '🎵'], ['Dansla', '💃'], ['Resimle', '🖍️']], k: ['şarkı', 'dans', 'resim'], a: 1 },
    { icon: '❄️', q: 'Kar tanesinin kaç kolu var?', o: [['Altı', '6'], ['Dört', '4'], ['On', '10']], k: ['altı', 'dört', 'on'], a: 0 },
    { icon: '🕳️', q: 'Kara delikten ne kaçamaz?', o: [['Rüzgâr', '💨'], ['Su', '💧'], ['Işık', '💡']], k: ['rüzgâr', 'su', 'ışık'], a: 2 },
    { icon: '🍯', q: 'Bal yıllarca bozulmaz mı?', o: [['Evet', '👍'], ['Hayır', '👎']], k: ['evet', 'hayır'], a: 0 },
    { icon: '🚀', q: "Ay'da zıplarsan ne olur?", o: [['Düşersin', '⬇️'], ['Uçarsın', '🕊️']], k: ['düşersin', 'yükselirsin'], a: 1 },
  ];
  const COL = ['#ff7fb0', '#7af0ff', '#ffd84d'];
  function lastWord(c, li, sub) { const ws = c.L[li].words; for (let i = ws.length - 1; i >= 0; i--) if (K.low(ws[i].w).startsWith(sub)) return ws[i].s; return c.L[li].start + 1; }
  function card(x, y, w, h, col, letter, label, icon, sc, op, glow) {
    return `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${op}">
      ${glow ? `<rect x="${-w / 2 - 22}" y="${-h / 2 - 22}" width="${w + 44}" height="${h + 44}" rx="50" fill="#5fe07a" opacity="${0.55 * glow}" filter="url(#b30)"/>` : ''}
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="40" fill="${glow ? '#5fe07a' : '#fff'}" stroke="#1a1040" stroke-width="10"/>
      <circle cx="${-w / 2 + 10}" cy="${-h / 2 + 10}" r="42" fill="${col}" stroke="#1a1040" stroke-width="8"/>
      ${K.text(-w / 2 + 10, -h / 2 + 30, 56, letter, '#fff')}
      <text x="0" y="${-10}" text-anchor="middle" font-size="${icon.length > 3 ? 60 : 84}" font-family="'Baloo 2'" font-weight="800" fill="#1a1040">${icon}</text>
      ${K.text(0, h / 2 - 28, 58, label, '#fff')}
      ${glow ? K.text(w / 2 - 20, -h / 2 + 40, 90 * glow, '✔', '#fff') : ''}</g>`;
  }
  function confetti(t, t0) {
    const p = t - t0; if (p < 0 || p > 2.2) return ''; let s = '';
    for (let i = 0; i < 46; i++) { const a = i * 2.399, v = 300 + (i * 53) % 400;
      const x = 700 + Math.cos(a) * v * p, y = 560 + Math.sin(a) * v * p * 0.8 + 380 * p * p;
      s += `<rect x="${x}" y="${y}" width="18" height="30" rx="5" fill="${['#ff4f6d', '#ffd84d', '#5fe07a', '#3fa9ff', '#b07fff'][i % 5]}" transform="rotate(${i * 40 + p * 400} ${x} ${y})" opacity="${1 - p / 2.2}"/>`; }
    return s;
  }
  window.EP = {
    theme: 'space', bigScenes: [0, 1, 18, 19], steady: true,
    init(c) {
      c.Q = Q.map((q, k) => { const ql = 2 + 2 * k, al = 3 + 2 * k;
        return Object.assign({}, q, { ql, al, ot: q.k.map(w => lastWord(c, ql, w)), cnt: c.L[ql].end + 0.6, rev: c.L[al].start }); });
    },
    stage(t, c) {
      const { si } = c; let s = '';
      if (si <= 1) {
        const p = back(seg(t, 0.2, 0.7));
        if (si === 0) s += `<g transform="translate(960 120) scale(${p}) rotate(${-3 + 2 * Math.sin(t * 2)})">${K.text(0, 40, 120, '❓ BİLGE KEDİ SORUYOR ❓', '#ffd84d')}</g>`;
        if (si === 1) { const q = seg(t, c.L[1].start, c.L[1].start + 0.4);
          [1, 2, 3, 4, 5].forEach((n, i) => { const pp = back(seg(t, c.L[1].start + 0.2 + i * 0.25, c.L[1].start + 0.5 + i * 0.25));
            if (pp > 0) s += `<g transform="translate(${480 + i * 240} 140) scale(${pp})"><circle r="70" fill="${COL[i % 3]}" stroke="#1a1040" stroke-width="9"/>${K.text(0, 28, 90, n, '#fff')}</g>`; }); }
      }
      if (si >= 2 && si <= 17) {
        const q = c.Q[Math.floor((si - 2) / 2)];
        const enter = back(seg(t, c.L[q.ql].start - 0.3, c.L[q.ql].start + 0.2));
        s += `<g transform="translate(700 95) scale(${enter})"><rect x="-140" y="-45" width="280" height="80" rx="40" fill="#ff4f6d" stroke="#1a1040" stroke-width="8"/>${K.text(0, 18, 52, `SORU ${(si - 2) / 2 + 1 | 0}/8`, '#fff')}</g>`;
        s += `<g transform="translate(700 225) scale(${enter})">${K.text(0, 0, 74, q.q, '#fff')}</g>`;
        s += `<text x="700" y="${430 + Math.sin(t * 3) * 10}" text-anchor="middle" font-size="${170 * enter}">${q.icon}</text>`;
        const n = q.o.length, xs = n === 3 ? [330, 700, 1070] : [480, 920];
        const revealed = t >= q.rev;
        q.o.forEach(([label, icon], i) => {
          const pp = back(seg(t, q.ot[i] - 0.1, q.ot[i] + 0.25)); if (pp <= 0) return;
          const right = i === q.a, g = revealed && right ? eo(seg(t, q.rev, q.rev + 0.4)) : 0;
          const op = revealed && !right ? lerp(1, 0.3, seg(t, q.rev, q.rev + 0.4)) : 1;
          const sc = pp * (1 + 0.12 * g + (revealed && right ? 0.03 * Math.sin(t * 8) : 0));
          s += card(xs[i], 660, n === 3 ? 320 : 380, 230, COL[i], 'ABC'[i], label, icon, sc, op, g);
        });
        // geri sayım
        if (t > q.cnt - 0.2 && t < q.rev) {
          const e = t - q.cnt, d = Math.max(1, 5 - Math.floor(Math.max(0, e))), fr = Math.max(0, e) % 1;
          const R = 64, circ = 2 * Math.PI * R;
          s += `<g transform="translate(700 905) scale(${1 + 0.15 * (1 - eo(Math.min(1, fr * 3)))})"><circle r="${R + 14}" fill="#1a1040"/><circle r="${R}" fill="none" stroke="#3a3d58" stroke-width="16"/>
            <circle r="${R}" fill="none" stroke="#ffd84d" stroke-width="16" stroke-dasharray="${circ * (1 - fr)} ${circ}" transform="rotate(-90)" stroke-linecap="round"/>${K.text(0, 30, 90, d, '#fff')}</g>`;
        }
        s += confetti(t, q.rev);
      }
      if (si >= 18) {
        const p = back(seg(t, c.L[18].start, c.L[18].start + 0.5));
        if (si === 18) s += `<g transform="translate(960 130) scale(${p})">${K.text(0, 40, 120, '⭐⭐⭐ HARİKA! ⭐⭐⭐', '#ffd84d')}</g>`;
        s += confetti(t, c.L[18].start);
      }
      return s;
    },
    cat(st, c) {
      const { si, t } = c;
      if (si >= 2 && si <= 17) { const q = c.Q[Math.floor((si - 2) / 2)];
        st.lookY = 0.2; st.lookX = -0.8;
        if (t > q.cnt && t < q.rev) { st.brow = 0.9; st.lookY = -0.6; st.tail = Math.sin(t * 6); }
        if (t >= q.rev) { st.ear = 1; st.brow = 1; st.glint = seg(t, q.rev, q.rev + 0.15) - seg(t, q.rev + 0.5, q.rev + 0.8); } }
      if (si === 18) { st.ear = 0.8; st.tail = Math.sin(t * 10); }
    },
    stickers(c) { return [{ t: c.L[1].end - 0.5, txt: 'HAZIRIM!', col: '#7af0ff', y: 260, dx: 520, size: 120 }]; },
    flashes() { return []; },
  };
})();
