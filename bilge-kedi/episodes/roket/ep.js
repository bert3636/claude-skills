(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${s}" fill="${col}">${txt}</text>`;
  const title = txt => `<text x="60" y="252" font-family="'Jost'" font-weight="600" font-size="48" letter-spacing="6" fill="${P.iso.ink}">${txt}</text>`;
  const cloud = (x, y, s, col = '#ffffff') => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="20" rx="120" ry="44" fill="${col}"/><circle cx="-50" r="50" fill="${col}"/><circle cx="20" cy="-20" r="64" fill="${col}"/><circle cx="76" cy="4" r="44" fill="${col}"/></g>`;
  function atmo(t, c, level) {
    const o = { x: 600, y: 900, k: 0.8 }; let s = title('HAVANIN KATLARI');
    const L = [['#7fd0ff', 120, 'TROPOSFER', 'bulutlar, uçaklar'], ['#a8dcff', 110, 'STRATOSFER', 'ozon kalkanı'], ['#cfe6ff', 100, 'MEZOSFER', ''], ['#e6efff', 100, 'TERMOSFER', 'uzay başlıyor']];
    s += ST.isoBox(-220, -160, 0, 440, 320, 30, '#5fc36a', o); let zz = 30; const mids = [];
    L.forEach(([col, h], i) => { s += `<g opacity="0.85">${ST.isoBox(-220, -160, zz, 440, 320, h, col, o)}</g>`; mids.push(zz + h / 2); zz += h; });
    const cp = ST.isoP(-40, 0, 80, o); s += cloud(cp[0] - 120, cp[1] + 10, 0.45) + cloud(cp[0] + 80, cp[1] - 30, 0.35);
    const pl = ST.isoP(100, 60, 110, o); s += `<text x="${pl[0]}" y="${pl[1]}" font-size="54" transform="rotate(-10 ${pl[0]} ${pl[1]})">✈️</text>`;
    L.forEach(([col, h, a, b], i) => { if (level >= Math.min(i, 2) || (level >= 2 && i === 3)) { const p = ST.isoP(220, -160, mids[i], o); s += ST.pin(p[0], p[1], 20, a, b, 1); } });
    if (level >= 2) { const k1 = ST.isoP(-220, 160, 330, o), k2 = ST.isoP(220, 160, 330, o), k3 = ST.isoP(220, -160, 330, o);
      s += `<path d="M ${k1.join(' ')} L ${k2.join(' ')} L ${k3.join(' ')}" stroke="${P.dos.red}" stroke-width="5" stroke-dasharray="16 10" fill="none"/><text x="${k1[0] - 20}" y="${k1[1] + 10}" text-anchor="end" font-family="'Jost'" font-weight="700" font-size="40" fill="${P.dos.red}">100 km</text>`; }
    const ry = level === 0 ? 0.25 : level === 1 ? 0.55 : 1, rp = ST.isoP(-250, -170, lerp(30, 470, ry * eo(seg(c.into, 0, 2.5))), o);
    s += `<path d="M ${ST.isoP(-250, -170, 30, o).join(' ')} L ${rp.join(' ')}" stroke="${z.sun}" stroke-width="6" stroke-dasharray="10 10"/>` + SP.rocket(rp[0], rp[1] - 30, 0.22, 1, t);
    return s;
  }
  function interior(t, kind) {
    const o = { x: 620, y: 780, k: 1 }; let s = title(kind === 'food' ? 'UZAYDA YEMEK' : 'UZAYDA UYKU');
    s += ST.isoBox(-320, -160, 0, 640, 320, 24, '#c9c2b2', o) + ST.isoBox(-320, -180, 24, 640, 20, 280, '#e8dccb', o);
    if (kind === 'food') { [['🥫', -200, 140], ['🍪', -60, 200], ['🍝', 80, 150], ['🍓', 200, 220]].forEach(([ic, x, zz], i) => { const p = ST.isoP(x, 20, zz + Math.sin(t * 1.5 + i) * 16, o); s += `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-size="64" transform="rotate(${Math.sin(t + i) * 18} ${p[0]} ${p[1]})">${ic}</text>`; });
      const pp = ST.isoP(-10, 60, 120 + Math.sin(t) * 10, o); s += `<g transform="translate(${pp[0]} ${pp[1]})"><rect x="-34" y="-50" width="68" height="90" rx="14" fill="#7fc8ff" stroke="${P.iso.ink}" stroke-width="3"/><path d="M 10 -50 L 30 -110" stroke="${P.dos.red}" stroke-width="8" stroke-linecap="round"/></g>` + ST.pin(pp[0] + 30, pp[1] - 60, 40, 'SU POŞETİ', 'pipetle içilir', 1); }
    else { [-240, -120, 0].forEach((x, i) => { const a = ST.isoP(x, -158, 70, o), b = ST.isoP(x + 80, -158, 70, o), cc = ST.isoP(x + 80, -158, 250, o), d = ST.isoP(x, -158, 250, o);
        s += `<path d="M ${a.join(' ')} L ${b.join(' ')} L ${cc.join(' ')} L ${d.join(' ')} Z" fill="${['#4D7CFE', '#ff6b5e', '#3fd8ae'][i]}"/><circle cx="${(d[0] + cc[0]) / 2}" cy="${(d[1] + cc[1]) / 2 + 26}" r="20" fill="#ffd2b0"/>`; });
      const p = ST.isoP(-200, -158, 250, o); s += ST.pin(p[0], p[1], 50, 'UYKU TULUMU', 'duvara bağlı', 1); s += `<text x="${p[0] + 360}" y="${p[1] + 40}" font-family="'Jost'" font-weight="700" font-size="54" fill="${P.iso.ink}" opacity="${0.5 + 0.5 * Math.sin(t * 2)}">z z z</text>`; }
    const ap = ST.isoP(200, 40, 150 + Math.sin(t * 1.2) * 14, o); s += SP.astronaut(ap[0], ap[1], 1.1, -15 + Math.sin(t) * 8, t);
    return s;
  }
  window.EP = {
    caseNo: '16', exhibits: 12,
    modes: ['dos', 'iso', 'iso', 'zoom', 'iso', 'iso', 'iso', 'zoom', 'zoom', 'zoom', 'iso', 'iso', 'zoom', 'dos', 'dos'],
    heads: { 0: ['UZAYA', 'GİDİYORUZ!'], 13: ['İTİŞ +', 'HIZ!'] }, subs: { 0: 'ROKET DOSYASI', 13: 'UZAYIN ANAHTARI' }, bigNum: { 0: '16', 13: '🚀' },
    stage(t, c) {
      const { si, into, L } = c; let s = '';
      if (si === 0) s += SP.rocket(760, 640, 0.75, 0.6 + 0.2 * Math.sin(t * 6), t).replace('<g ', '<g opacity="0.95" ');
      if (si === 1) { const o = { x: 620, y: 760, k: 1 }; s += title('BALON DENEYİ') + ST.isoBox(-420, -140, 0, 840, 280, 20, '#e8dccb', o);
        const go = eo(seg(t, c.wt(1, 'uçar') - 0.3, L[1].end + 0.4)), bp = ST.isoP(lerp(-150, 300, go), 0, 140, o);
        s += `<g transform="translate(${bp[0]} ${bp[1]})"><ellipse rx="110" ry="80" fill="#ff6f98"/><ellipse cx="-30" cy="-26" rx="30" ry="16" fill="#ffb0c8"/><path d="M -108 0 l -26 -14 v 28 Z" fill="#e0507a"/></g>`;
        if (t > c.wt(1, 'kaçar') - 0.3) for (let i = 0; i < 5; i++) { const q = (t * 1.5 + i / 5) % 1; s += `<circle cx="${bp[0] - 150 - q * 220}" cy="${bp[1] + (i - 2) * 16 * q}" r="${16 * (1 - q) + 4}" fill="#cfd8e8"/>`; }
        s += `<path d="M ${bp[0] - 170} ${bp[1] + 110} h -160" stroke="${P.iso.ink}" stroke-width="6"/><path d="M ${bp[0] - 330} ${bp[1] + 110} l 24 -14 v 28 Z" fill="${P.iso.ink}"/><text x="${bp[0] - 250}" y="${bp[1] + 160}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="36" fill="${P.iso.ink}">hava ←</text>`;
        s += `<path d="M ${bp[0] + 130} ${bp[1] + 110} h 160" stroke="${P.dos.red}" stroke-width="6"/><path d="M ${bp[0] + 290} ${bp[1] + 110} l -24 -14 v 28 Z" fill="${P.dos.red}"/><text x="${bp[0] + 210}" y="${bp[1] + 160}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="36" fill="${P.dos.red}">→ balon</text>`; }
      if (si === 2) { const o = { x: 620, y: 860, k: 1 }; s += title('ETKİ - TEPKİ') + ST.isoBox(-160, -160, 0, 320, 320, 50, '#9e958b', o);
        const top = ST.isoP(0, 0, 50, o), up = eo(seg(t, c.wt(2, 'fırlar') - 0.2, L[2].end + 0.5)) * 160;
        s += SP.rocket(top[0], top[1] - 190 - up, 0.55, 0.9, t);
        s += `<path d="M ${top[0] + 230} ${top[1] - 360} v -150" stroke="${P.dos.red}" stroke-width="10"/><path d="M ${top[0] + 230} ${top[1] - 520} l -22 30 h 44 Z" fill="${P.dos.red}"/><text x="${top[0] + 270}" y="${top[1] - 430}" font-family="'Jost'" font-weight="700" font-size="40" fill="${P.dos.red}">ROKET ↑</text>`;
        s += `<path d="M ${top[0] - 230} ${top[1] - 280} v 150" stroke="#f2a12f" stroke-width="10"/><path d="M ${top[0] - 230} ${top[1] - 120} l -22 -30 h 44 Z" fill="#f2a12f"/><text x="${top[0] - 270}" y="${top[1] - 200}" text-anchor="end" font-family="'Jost'" font-weight="700" font-size="40" fill="#d9822a">GAZ ↓</text>`; }
      if (si === 3) { const ign = c.wt(3, 'ateşleme'), lift = eo(seg(t, ign + 0.3, L[3].end + 1.2)) * 900;
        s += SP.stars(1920, 1080, 50, 61) + `<rect x="0" y="900" width="1920" height="180" fill="${z.r1}"/><rect x="420" y="380" width="40" height="520" fill="${z.r2}"/>${[0, 1, 2, 3, 4].map(i => `<path d="M 460 ${420 + i * 100} h 120" stroke="${z.r2}" stroke-width="10"/>`).join('')}`;
        if (t > ign) for (let i = 0; i < 8; i++) { const q = (t * 0.8 + i / 8) % 1; s += cloud(640 + (i - 4) * 70 * q * 3, 880 - q * 40, 0.4 + q * 0.5, i % 2 ? z.cream : z.creamS); }
        s += SP.rocket(640, 640 - lift, 0.95, t > ign ? 1 : 0, t);
        const CW = ['beş', 'dört', 'üç', 'iki', 'bir'].map(w => c.wt(3, w)).concat([ign]); ['beş', 'dört', 'üç', 'iki', 'bir'].forEach((w, i) => { const tw = CW[i], n = 5 - i; if (t >= tw - 0.05 && t < CW[i + 1] - 0.05) s += `<g transform="translate(1150 480) scale(${back(seg(t, tw - 0.05, tw + 0.2))})">${big(0, 120, 360, n)}</g>`; });
        if (t > ign) s += `<g transform="translate(1150 420) scale(${back(seg(t, ign, ign + 0.3))})">${big(0, 60, 130, 'ATEŞLEME!', z.coral)}</g>`; }
      if (si === 4) s += atmo(t, c, 0);
      if (si === 5) s += atmo(t, c, 1);
      if (si === 6) s += atmo(t, c, 2) + `<g transform="translate(1180 330) scale(${back(seg(into, 0.6, 1.0))})">${big(0, 0, 90, 'UZAY!', P.dos.cobalt)}</g>`;
      if (si === 7) { const sep = eo(seg(t, c.wt(7, 'ayrılır') - 0.2, c.wt(7, 'ayrılır') + 1.5)); s += SP.stars(1920, 1080, 70, 62) + SP.planet(700, 1500, 700, 'earth', t);
        s += `<g transform="translate(0 ${sep * 260}) rotate(${sep * 25} 700 600)"><rect x="660" y="560" width="80" height="160" rx="10" fill="${z.creamS}"/><rect x="660" y="590" width="80" height="22" fill="${z.coral}"/></g>`;
        s += SP.rocket(700, 330 - sep * 120, 0.6, 1, t) + (sep > 0.3 ? big(1150, 400, 64, 'boş tank: güle güle!', z.cream) : ''); }
      if (si === 8) { const a = -Math.PI / 2 + t * 0.9; s += SP.stars(1920, 1080, 70, 63) + SP.planet(560, 540, 250, 'earth', t) + `<circle cx="560" cy="540" r="360" fill="none" stroke="${z.r2}" stroke-width="6" stroke-dasharray="12 12"/>`;
        s += `<g transform="translate(${560 + Math.cos(a) * 360} ${540 + Math.sin(a) * 360}) rotate(${a * 57 + 90})">${SP.rocket(0, 0, 0.18, 0.6, t)}</g>`;
        const sp = eo(seg(t, c.wt(8, 'yirmi') - 0.3, c.wt(8, 'yirmi') + 1.2)), ang = lerp(-210, 30, sp) * Math.PI / 180;
        s += `<g transform="translate(1180 520)"><path d="M -200 0 A 200 200 0 0 1 200 0" stroke="${z.r2}" stroke-width="40" fill="none"/><path d="M -200 0 A 200 200 0 0 1 ${200 * Math.cos(Math.PI - sp * Math.PI)} ${-200 * Math.sin(sp * Math.PI)}" stroke="${z.sun}" stroke-width="40" fill="none"/>
          <line x1="0" y1="0" x2="${Math.cos(Math.PI - sp * Math.PI) * 170}" y2="${-Math.sin(sp * Math.PI) * 170}" stroke="${z.cream}" stroke-width="10" stroke-linecap="round"/><circle r="20" fill="${z.cream}"/>${big(0, 100, 64, Math.round(sp * 28) + '.000 km/sa', z.cream)}</g>`; }
      if (si === 9) { s += `<rect width="1920" height="1080" fill="#3a4060"/><circle cx="700" cy="520" r="360" fill="${z.night}"/>` + `<clipPath id="win"><circle cx="700" cy="520" r="340"/></clipPath><g clip-path="url(#win)">${SP.stars(1400, 1000, 40, 64)}${SP.planet(780, 620, 260, 'earth', t)}</g>`;
        s += `<circle cx="700" cy="520" r="350" fill="none" stroke="${z.creamS}" stroke-width="40"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return `<circle cx="${700 + Math.cos(a) * 350}" cy="${520 + Math.sin(a) * 350}" r="10" fill="${z.cream}"/>`; }).join('')}<path d="M 470 330 q 60 -60 140 -70" stroke="#fff" stroke-width="14" fill="none" opacity="0.4" stroke-linecap="round"/>`; }
      if (si === 10) s += interior(t, 'food');
      if (si === 11) s += interior(t, 'sleep');
      if (si === 12) { const d = eo(seg(into, 0.2, 3.8)); s += `<rect width="1920" height="1080" fill="#7cc8ff"/>` + cloud(300, 220, 0.9) + cloud(1200, 160, 0.7) + `<rect x="0" y="860" width="1920" height="220" fill="#3a8fe8"/>`;
        for (let i = 0; i < 8; i++) s += `<path d="M ${i * 260 + ((t * 40) % 260)} 900 q 40 -20 80 0" stroke="#bfe6ff" stroke-width="8" fill="none"/>`;
        const cy = lerp(160, 760, d); [-1, 0, 1].forEach(k => s += `<path d="M ${700 + k * 150 - 90} ${cy - 260} Q ${700 + k * 150} ${cy - 360} ${700 + k * 150 + 90} ${cy - 260} Z" fill="${k ? '#ff6b5e' : '#fff3dc'}"/><path d="M ${700 + k * 150 - 90} ${cy - 260} L 680 ${cy - 60} M ${700 + k * 150 + 90} ${cy - 260} L 720 ${cy - 60}" stroke="#2b2440" stroke-width="3"/>`);
        s += `<path d="M 620 ${cy + 20} L 640 ${cy - 70} L 760 ${cy - 70} L 780 ${cy + 20} Z" fill="#e8dccb"/><path d="M 620 ${cy + 20} Q 700 ${cy + 50} 780 ${cy + 20}" fill="#9e958b"/>`;
        if (d > 0.95) for (let i = 0; i < 8; i++) { const q = (t * 1.2 + i / 8) % 1; s += `<circle cx="${700 + (i - 3.5) * 40 * (1 + q)}" cy="${860 - Math.sin(q * Math.PI) * 90}" r="10" fill="#bfe6ff" opacity="${1 - q}"/>`; } }
      if (si === 13) s += SP.rocket(860, 660, 0.55, 1, t);
      return s;
    },
    cat(st, c) { if (c.si === 3 && c.t > c.wt(3, 'ateşleme')) { st.brow = 1; st.ear = 1; } if (c.si === 9) st.happy = 1; },
    stamps(c) { return [{ t: c.wt(13, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 1450, y: 860, rot: -10, end: c.sceneStart(14), size: 96 }]; },
    stickers(c) { return [{ t: 0.6, txt: '🚀?', col: '#ff6b5e', y: 160, dx: 720, size: 150 }]; },
  };
})();
