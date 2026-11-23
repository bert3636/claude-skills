(function () {
  const { seg, eo, back, lerp, cl, low } = K2, P = ST.PAL, D = P.dos;
  const Q = [
    { icon: '🐋', q: 'Mavi balinanın boyu?', o: [['3 m', '📏'], ['30 m', '🚌'], ['300 m', '🗼']], a: 1 },
    { icon: '🦐', q: 'Mavi balina ne yer?', o: [['Kril', '🦐'], ['Balık', '🐟'], ['Yosun', '🌿']], a: 0 },
    { icon: '🐜', q: 'Karıncanın kileri nerede?', o: [['Kiler', '🌰'], ['Çatı', '🏠'], ['Bahçe', '🌷']], a: 0 },
    { icon: '💪', q: 'Karınca kaç kat taşır?', o: [['2 kat', '✌️'], ['10+ kat', '🏋️'], ['Hiç', '🚫']], a: 1 },
    { icon: '🍃', q: 'Yeşil fabrikanın adı?', o: [['Kloroplast', '🍃'], ['Kristal', '💎'], ['Kaktüs', '🌵']], a: 0 },
    { icon: '🌳', q: 'Ağaçlar bize ne verir?', o: [['Oksijen', '🫧'], ['Duman', '🌫️'], ['Buhar', '♨️']], a: 0 },
    { icon: '🪐', q: 'En büyük gezegen?', o: [['Mars', '🔴'], ['Jüpiter', '🪐'], ['Merkür', '⚪']], a: 1 },
    { icon: '☀️', q: 'Işık bize kaç dakikada gelir?', o: [['1 dk', '⏱️'], ['8 dk', '☀️'], ['100 dk', '🐢']], a: 1 },
  ];
  const XS = [260, 640, 1020], CY = 560;
  function card(x, y, letter, label, icon, sc, op, rot, win) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="${op}">
      <rect x="-165" y="-195" width="330" height="390" rx="18" fill="${D.ink}" transform="translate(10 10)"/>
      <rect x="-165" y="-195" width="330" height="390" rx="18" fill="${win ? '#fff3a8' : '#f7e8c4'}" stroke="${D.ink}" stroke-width="7"/>
      <rect x="-165" y="-195" width="330" height="64" rx="18" fill="${D.ink}"/>
      <text x="0" y="-150" text-anchor="middle" font-family="'JetBrains Mono'" font-weight="800" font-size="30" fill="#f7e8c4">ŞÜPHELİ ${letter}</text>
      <text x="0" y="40" text-anchor="middle" font-size="130">${icon}</text>
      <text x="0" y="160" text-anchor="middle" font-family="'Alfa Slab One'" font-size="${label.length > 8 ? 40 : 52}" fill="${D.ink}">${label}</text></g>`;
  }
  function clock(x, y, frac, n) {
    const R = 66, a = frac * Math.PI * 2, lg = frac > 0.5 ? 1 : 0;
    const wedge = frac > 0.001 ? `<path d="M ${x} ${y} L ${x} ${y - R} A ${R} ${R} 0 ${lg} 1 ${x + Math.sin(a) * R} ${y - Math.cos(a) * R} Z" fill="${D.yellow}"/>` : '';
    return `<circle cx="${x + 8}" cy="${y + 8}" r="${R + 12}" fill="${D.cobalt}"/><circle cx="${x}" cy="${y}" r="${R + 12}" fill="${D.ink}"/>${wedge}
      <text x="${x}" y="${y + 34}" text-anchor="middle" font-family="'Alfa Slab One'" font-size="96" fill="#fff3dc" stroke="${D.ink}" stroke-width="8" paint-order="stroke">${n}</text>`;
  }
  window.EP = {
    caseNo: 'B1', exhibits: 8,
    modes: Array(20).fill('dos'),
    heads: { 0: ['DOSYA', 'BİLMECESİ'], 1: ["5'E KADAR", 'SAY!'], 18: ['HARİKA', 'DEDEKTİF!'] },
    subs: { 0: '8 SORU · 8 ŞÜPHELİ', 1: 'CEVABI YÜKSEK SESLE SÖYLE', 18: 'KAÇ TANESİNİ BİLDİN?' }, bigNum: { 0: '?', 18: '8' },
    exNum: si => si >= 2 && si <= 17 ? Math.floor((si - 2) / 2) + 1 : 0,
    noWipe: i => i >= 3 && i <= 17 && i % 2 === 1,
    init(c) {
      c.Q = Q.map((q, k) => { const ql = 2 + 2 * k, al = ql + 1, ws = c.L[ql].words;
        const mis = ws.filter(w => ['mi', 'mı', 'mu', 'mü'].includes(low(w.w).replace(/[?,]/g, '')));
        const ot = q.o.map((_, i) => mis[i] ? mis[i].s - 0.45 : c.L[ql].start + 2 + i * 0.8);
        return Object.assign({}, q, { ql, al, ot, cnt: c.L[ql].end + 0.6, rev: c.L[al].start }); });
    },
    stage(t, c) {
      const { si } = c; let s = '';
      if (si >= 2 && si <= 17) {
        const q = c.Q[Math.floor((si - 2) / 2)], k = Math.floor((si - 2) / 2) + 1;
        const ent = back(seg(t, c.L[q.ql].start - 0.3, c.L[q.ql].start + 0.15));
        s += `<g transform="translate(80 250) scale(${ent})">${ST.chip(0, 0, `SORU ${k}/8`, D.red, '#fff3dc', 40)}</g>`;
        s += `<g opacity="${cl(ent)}">${ST.headline(80, 370, 78, q.q, D.ink, D.cobalt)}</g>`;
        const rev = t >= q.rev;
        q.o.forEach(([lab, ic], i) => { const p = back(seg(t, q.ot[i], q.ot[i] + 0.3)); if (p <= 0) return;
          const right = i === q.a, op = rev && !right ? lerp(1, 0.35, seg(t, q.rev, q.rev + 0.3)) : 1;
          s += card(XS[i], CY + 60, 'ABC'[i], lab, ic, p * (rev && right ? 1.06 : 1), op, [-3, 2, -2][i], rev && right); });
        if (t > q.cnt - 0.2 && t < q.rev) { const e = Math.max(0, t - q.cnt); s += clock(1300, 300, 1 - (e % 1), Math.max(1, 5 - Math.floor(e))); }
        if (rev) for (let i = 0; i < 40; i++) { const pp = t - q.rev; if (pp > 2) break; const a = i * 2.4, v = 260 + (i * 47) % 300;
          s += `<rect x="${XS[q.a] + Math.cos(a) * v * pp}" y="${CY + Math.sin(a) * v * pp * 0.8 + 300 * pp * pp}" width="16" height="26" rx="4" fill="${[D.red, D.yellow, D.cobalt, D.pink][i % 4]}" opacity="${1 - pp / 2}"/>`; }
      }
      if (si === 1) for (let i = 0; i < 5; i++) { const p = back(seg(t, c.L[1].start + 0.3 + i * 0.25, c.L[1].start + 0.6 + i * 0.25)); if (p > 0) s += `<g transform="translate(${120 + i * 200} 760) scale(${p})">${clock(0, 0, 1 - i / 5, i + 1)}</g>`; }
      return s;
    },
    catPos(c) { if (c.si >= 2 && c.si <= 17) return { x: 1680, y: 790, s: 0.4 }; },
    cat(st, c) { if (c.si >= 2 && c.si <= 17) { const q = c.Q[Math.floor((c.si - 2) / 2)]; st.lookX = -0.8; st.lookY = 0.1;
      if (c.t > q.cnt && c.t < q.rev) { st.brow = 0.9; st.lookY = -0.6; st.tail = Math.sin(c.t * 6); } if (c.t >= q.rev) { st.happy = 1; } }
      if (c.si === 18) st.happy = 1; },
    stamps(c) { return c.Q.map(q => ({ t: q.rev, txt: 'DOĞRU!', x: XS[q.a], y: CY + 150, rot: -14, size: 84, end: c.sceneStart(q.al + 1) }))
      .concat([{ t: c.wt(18, 'bilge'), txt: 'TEBRİKLER!', x: 600, y: 760, rot: -8, size: 96, end: c.sceneStart(19) }]); },
    stickers() { return []; },
  };
})();
