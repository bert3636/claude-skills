(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const CX = 700, CY = 500;
  const PL = {
    earth: ['#4D7CFE', '#3A5FD9'], moon: ['#F0E8D8', '#CFC5B0'], sun: ['#FFC84A', '#F2A12F'], mercury: ['#c9c0b6', '#9e958b'], venus: ['#f2d08a', '#d9a85c'],
    mars: ['#ff7a4e', '#d9542e'], jupiter: ['#f0c9a0', '#d9a27a'], saturn: ['#f2d896', '#d9b866'], uranus: ['#9feae6', '#6cc9c4'], neptune: ['#5a86ff', '#3a5fd9'],
  };
  let pid = 0;
  function planet(cx, cy, r, kind, t, extra = '') {
    const id = 'pl' + (pid++), [b, sdw] = PL[kind];
    const circ = `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
    let f = '';
    if (kind === 'earth') f = `<path d="M ${cx - r * 0.6} ${cy - r * 0.2} q ${r * 0.3} ${-r * 0.5} ${r * 0.7} ${-r * 0.2} q ${r * 0.2} ${r * 0.35} ${-r * 0.25} ${r * 0.5} q ${-r * 0.4} ${r * 0.1} ${-r * 0.45} ${-r * 0.3}Z M ${cx + r * 0.2} ${cy + r * 0.3} q ${r * 0.4} ${-r * 0.25} ${r * 0.65} ${r * 0.05} q ${-r * 0.1} ${r * 0.45} ${-r * 0.5} ${r * 0.4}Z" fill="${z.mint}"/>` +
      [0, 1, 2].map(i => `<ellipse cx="${cx + ((t * 0.08 * r + i * r * 0.8) % (2.4 * r)) - 1.2 * r}" cy="${cy - r * 0.5 + i * r * 0.45}" rx="${r * 0.35}" ry="${r * 0.08}" fill="${z.cream}"/>`).join('');
    if (kind === 'moon' || kind === 'mercury') f = [[-0.4, -0.3, 0.18], [0.3, 0.2, 0.22], [-0.1, 0.5, 0.12], [0.45, -0.4, 0.1]].map(([x, y, s]) => `<circle cx="${cx + x * r}" cy="${cy + y * r}" r="${s * r}" fill="${sdw}"/>`).join('');
    if (kind === 'sun') f = [[-0.3, -0.2, 0.1], [0.35, 0.3, 0.08], [0.1, -0.5, 0.06]].map(([x, y, s]) => `<circle cx="${cx + x * r}" cy="${cy + y * r}" r="${s * r}" fill="${sdw}"/>`).join('');
    if (kind === 'venus') f = [0, 1, 2, 3].map(i => `<path d="M ${cx - r} ${cy - r * 0.6 + i * r * 0.4} q ${r * 0.5} ${Math.sin(t + i) * r * 0.12} ${r} 0 t ${r} 0" stroke="${z.cream}" stroke-width="${r * 0.08}" fill="none" opacity="0.7"/>`).join('');
    if (kind === 'mars') f = `<ellipse cx="${cx}" cy="${cy - r * 0.88}" rx="${r * 0.4}" ry="${r * 0.14}" fill="${z.cream}"/><circle cx="${cx - r * 0.3}" cy="${cy + r * 0.1}" r="${r * 0.15}" fill="${sdw}"/><circle cx="${cx + r * 0.35}" cy="${cy - r * 0.25}" r="${r * 0.1}" fill="${sdw}"/>`;
    if (kind === 'jupiter') f = [-0.6, -0.3, 0.05, 0.4, 0.7].map((y, i) => `<rect x="${cx - r}" y="${cy + y * r}" width="${2 * r}" height="${r * 0.12}" fill="${i % 2 ? '#c98a5a' : z.cream}" opacity="0.85"/>`).join('') + `<ellipse cx="${cx + r * 0.3 + Math.sin(t * 0.3) * r * 0.05}" cy="${cy + r * 0.3}" rx="${r * 0.22}" ry="${r * 0.13}" fill="${z.coralS}"/>`;
    if (kind === 'saturn') f = [-0.4, 0, 0.35].map(y => `<rect x="${cx - r}" y="${cy + y * r}" width="${2 * r}" height="${r * 0.1}" fill="${z.cream}" opacity="0.6"/>`).join('');
    if (kind === 'neptune') f = [-0.3, 0.2, 0.5].map((y, i) => `<path d="M ${cx - r * 0.7 + ((t * 30 + i * 40) % 60)} ${cy + y * r} h ${r * 0.6}" stroke="${z.cream}" stroke-width="${r * 0.05}" stroke-linecap="round" opacity="0.7"/>`).join('');
    return `<clipPath id="${id}c"><path d="${circ}"/></clipPath>${ST.twoTone(id, circ, b, sdw)}<g clip-path="url(#${id}c)">${f}<path d="${circ}" fill="${sdw}" transform="translate(${r * 0.22} ${r * 0.22})" opacity="0.35"/></g>${extra}`;
  }
  function rings(cx, cy, r, front, tilt = -14) {
    const a = front ? `M ${cx - r * 2} ${cy} A ${r * 2} ${r * 0.5} 0 0 0 ${cx + r * 2} ${cy}` : `M ${cx - r * 2} ${cy} A ${r * 2} ${r * 0.5} 0 0 1 ${cx + r * 2} ${cy}`;
    return `<g transform="rotate(${tilt} ${cx} ${cy})"><path d="${a}" stroke="${z.creamS}" stroke-width="${r * 0.28}" fill="none"/><path d="${a.replace(/2\) /g, '')}" stroke="${z.cream}" stroke-width="${r * 0.1}" fill="none" transform="scale(1)"/></g>`;
  }
  const label = (x, y, tag, txt) => `<text x="${x}" y="${y}" font-family="'Jost'" font-weight="600" font-size="24" letter-spacing="3" fill="${z.sun}">${tag}</text><text x="${x}" y="${y + 52}" font-family="'Jost'" font-weight="700" font-size="54" fill="${z.cream}">${txt}</text>`;
  const ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'], NAMES = ['Merkür', 'Venüs', 'Dünya', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün'];
  window.EP = {
    caseNo: '10', exhibits: 20,
    modes: ['dos', 'zoom', 'zoom', 'zoom', 'zoom', 'zoom', 'iso', 'zoom', 'zoom', 'zoom', 'zoom', 'zoom', 'iso', 'zoom', 'zoom', 'zoom', 'zoom', 'zoom', 'zoom', 'iso', 'iso', 'dos', 'dos'],
    heads: { 0: ['BÜYÜK', 'TUR!'], 21: ['KOCAMAN', 'BİR AİLE'] }, subs: { 0: 'GÜNEŞ SİSTEMİ DOSYASI', 21: '8 GEZEGEN · 1 YILDIZ' }, bigNum: { 0: '10', 21: '8' },
    init(c) { c.T = {}; },
    stage(t, c) {
      const { si, into, L } = c; let s = '';
      const w = (sub) => c.wt(si, sub);
      if (si === 0) for (let i = 0; i < 8; i++) { const p = back(seg(into, 0.6 + i * 0.12, 1.0 + i * 0.12)); if (p > 0) s += planet(110 + i * 130, 860, 40 * p * (i === 4 ? 1.4 : i === 5 ? 1.2 : 1), ORDER[i], t); }
      if (si === 1) { const p = back(seg(into, 0, 0.6)); s += ST.glowRings(CX, CY, 300 * p) + planet(CX, CY, 300 * p, 'earth', t) + (into > 1.2 ? ST.nextStop(CX + 120, CY - 140, 60, 'EVİMİZ', 'Dünya', 1080, 260, t) : '') + ST.scaleRibbon(70, 800, 360, 0.1, ['Dünya', 'Güneş', 'Neptün'], '20.000 km'); }
      if (si === 2) { const sx = 300, a = seg(into, 0.2, 3.6) * Math.PI * 2 - Math.PI / 2;
        s += `<ellipse cx="${CX}" cy="${CY}" rx="440" ry="250" fill="none" stroke="${z.r2}" stroke-width="6"/>` + ST.glowRings(CX, CY, 90) + planet(CX, CY, 90, 'sun', t);
        s += `<path d="M ${CX + 440} ${CY} A 440 250 0 ${a > Math.PI / 2 ? 1 : 0} 1 ${CX + Math.cos(a) * 440} ${CY + Math.sin(a) * 250}" stroke="${z.sun}" stroke-width="6" fill="none" stroke-dasharray="2 14" stroke-linecap="round" transform="rotate(0)"/>`;
        s += planet(CX + Math.cos(a) * 440, CY + Math.sin(a) * 250, 46, 'earth', t) + label(80, 300, 'BİR TUR', '1 yıl = 365 gün'); }
      if (si === 3) { s += planet(500, CY, 220, 'earth', t) + ST.glowRings(1080, 360, 60) + planet(1080, 360, 60, 'moon', t);
        if (into > 0.8) s += ST.sightLine(640, 420, 1030, 370, t) + ST.nextStop(1080, 360, 80, 'KOMŞU', 'Ay', 1130, 560, t);
        s += ST.scaleRibbon(70, 800, 360, 0.2, ['Dünya', 'Güneş', 'Neptün'], '400.000 km'); }
      if (si === 4) { const r = lerp(80, 420, eo(seg(into, 0.2, 2.2))); s += ST.glowRings(560, CY + 40, r) + planet(560, CY + 40, r, 'sun', t);
        s += `<circle cx="1220" cy="720" r="6" fill="${z.blue}"/>` + (into > 2 ? ST.nextStop(1220, 720, 26, 'DÜNYA', 'bu kadarcık!', 1060, 220, t) : '');
        const k = back(seg(t, w('milyondan') - 0.1, w('milyondan') + 0.4)); if (k > 0) s += `<g transform="translate(1180 520) scale(${k})"><circle r="110" fill="${z.sun}"/><text y="-8" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="54" fill="${z.night}">1.300.000</text><text y="40" text-anchor="middle" font-family="'Jost'" font-weight="600" font-size="30" fill="${z.night}">Dünya sığar!</text></g>`;
        s += ST.scaleRibbon(70, 800, 360, 0.45, ['Dünya', 'Güneş', 'Neptün'], '3 milyon km'); }
      if (si === 5) { const r = lerp(200, 26, eo(seg(into, 0, 2.5)));
        for (let i = 0; i < 26; i++) { const R = ST.rng(i * 619 + 3); R(); const x = 80 + R() * 1300, y = 120 + R() * 700, rr = 8 + R() * 12, tw = 0.6 + 0.4 * Math.sin(t * 2 + i);
          s += `<circle cx="${x}" cy="${y}" r="${rr * 2.2 * tw}" fill="${z.r2}"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${[z.sun, z.cream, z.coral][i % 3]}"/>`; }
        s += ST.glowRings(CX, CY, r) + planet(CX, CY, r, 'sun', t) + label(80, 300, 'HER YILDIZ', 'uzak bir güneş!'); }
      if (si === 6 || si === 19 || si === 20 || si === 12) s += `<text x="60" y="252" font-family="'Jost'" font-weight="600" font-size="48" letter-spacing="6" fill="${P.iso.ink}">${{ 6: 'GEZEGENLERİN YOLLARI', 12: 'EN YÜKSEK DAĞLAR', 19: 'IŞIĞIN YOLCULUĞU', 20: 'IŞIĞIN YOLCULUĞU' }[si]}</text>`;
      if (si === 6) { const o = { x: 700, y: 560, k: 1 };
        s += `<ellipse cx="700" cy="620" rx="640" ry="280" fill="#2b2440" opacity="0.08"/>`;
        ORDER.forEach((pk, i) => { const R = 70 + i * 52; let d = ''; for (let k = 0; k <= 48; k++) { const a = k / 48 * Math.PI * 2, p = ST.isoP(Math.cos(a) * R, Math.sin(a) * R, 0, o); d += `${k ? 'L' : 'M'} ${p[0]} ${p[1]} `; }
          s += `<path d="${d}" stroke="${P.iso.ink}" stroke-width="2" fill="none" stroke-dasharray="6 8" opacity="${seg(into, i * 0.12, i * 0.12 + 0.3)}"/>`; });
        s += planet(700, 560, 40, 'sun', t);
        ORDER.forEach((pk, i) => { const R = 70 + i * 52, a = t * (1.2 / Math.sqrt(i + 1)) + i, p = ST.isoP(Math.cos(a) * R, Math.sin(a) * R, 0, o), q = back(seg(into, 0.3 + i * 0.15, 0.7 + i * 0.15));
          if (q > 0) s += planet(p[0], p[1] - 12, (i === 4 ? 22 : i === 5 ? 19 : 12) * q, pk, t); });
        NAMES.forEach((n, i) => { const q = seg(into, 0.3 + i * 0.15, 0.6 + i * 0.15); s += `<text x="1290" y="${330 + i * 56}" font-family="'Jost'" font-weight="600" font-size="34" fill="${P.iso.ink}" opacity="${q}">${i + 1}. ${n}</text>`; }); }
      if (si === 7) { const a = t * 2.4; s += ST.glowRings(360, CY + 40, 110) + planet(360, CY + 40, 110, 'sun', t) + `<circle cx="360" cy="${CY + 40}" r="280" fill="none" stroke="${z.r2}" stroke-width="5"/>`;
        for (let k = 1; k < 8; k++) { const b = a - k * 0.1; s += `<circle cx="${360 + Math.cos(b) * 280}" cy="${CY + 40 + Math.sin(b) * 280}" r="${10 - k}" fill="${z.sun}" opacity="${1 - k / 8}"/>`; }
        s += planet(360 + Math.cos(a) * 280, CY + 40 + Math.sin(a) * 280, 50, 'mercury', t) + label(800, 300, 'DURAK 1', 'Merkür') + `<text x="800" y="440" font-family="'Jost'" font-weight="600" font-size="40" fill="${z.mist}">en hızlısı! 💨</text>`; }
      if (si === 8) { s += planet(330, CY, 170, 'mercury', t);
        const n = Math.floor(seg(t, w('seksen') - 0.2, w('seksen') + 1.2) * 88);
        s += `<g transform="translate(900 470)"><rect x="-200" y="-200" width="400" height="380" rx="30" fill="${z.cream}"/><rect x="-200" y="-200" width="400" height="90" rx="30" fill="${z.coral}"/>
          <text y="-138" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="44" fill="${z.cream}">1 MERKÜR YILI</text><text y="70" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="170" fill="${z.night}">${n}</text><text y="140" text-anchor="middle" font-family="'Jost'" font-weight="600" font-size="40" fill="${z.night}">gün</text></g>`; }
      if (si === 9) { s += ST.glowRings(520, CY, 260) + planet(520, CY, 260, 'venus', t) + label(900, 260, 'DURAK 2', 'Venüs');
        const th = seg(t, w('sıcak') - 0.3, w('sıcak') + 1.0); s += `<g transform="translate(1150 420)"><rect x="-26" y="-190" width="52" height="300" rx="26" fill="${z.cream}"/><rect x="-14" y="${100 - 270 * th}" width="28" height="${270 * th}" rx="14" fill="${z.coral}"/><circle cy="130" r="48" fill="${z.coral}"/></g>`;
        if (th > 0.6) s += `<text x="1220" y="470" font-family="'Jost'" font-weight="700" font-size="64" fill="${z.coral}">465°C</text>`; }
      if (si === 10) { s += `<path d="M 0 760 Q 300 640 700 720 T 1500 700 V 900 H 0 Z" fill="${z.r1}"/>`; const tw = 1 + 0.2 * Math.sin(t * 4);
        s += `<circle cx="760" cy="300" r="${70 * tw}" fill="${z.r2}"/><circle cx="760" cy="300" r="${40 * tw}" fill="${z.r1}" opacity="0.6"/><circle cx="760" cy="300" r="18" fill="${z.cream}"/><path d="M 760 230 l 8 62 l 62 8 l -62 8 l -8 62 l -8 -62 l -62 -8 l 62 -8 Z" fill="${z.cream}" opacity="${0.6 + 0.4 * Math.sin(t * 3)}"/>`;
        s += ST.nextStop(760, 300, 100, 'ÇOBAN YILDIZI', 'aslında Venüs!', 880, 520, t); }
      if (si === 11) { s += ST.glowRings(520, CY, 260) + planet(520, CY, 260, 'mars', t) + label(900, 260, 'DURAK 3', 'Mars');
        for (let i = 0; i < 18; i++) { const q = (t * 0.2 + i / 18) % 1; s += `<circle cx="${260 + q * 600}" cy="${300 + (i * 37) % 400}" r="4" fill="${z.coral}" opacity="${(1 - q) * 0.7}"/>`; }
        s += `<text x="900" y="420" font-family="'Jost'" font-weight="600" font-size="40" fill="${z.mist}">demir tozu = pas rengi</text>`; }
      if (si === 12) { const o = { x: 640, y: 860, k: 1 }; const mp = eo(seg(into, 0.2, 1.6));
        s += ST.isoBox(-420, -160, 0, 840, 320, 20, '#e8dccb', o);
        for (let k = 0; k < 6; k++) { const hh = 58 * mp, wd = 300 - k * 48; s += ST.isoBox(-360 + k * 24, -wd / 2, 20 + k * hh, wd, wd, hh, '#ff7a4e', o); }
        for (let k = 0; k < 3; k++) { const hh = 56 * mp, wd = 160 - k * 44; s += ST.isoBox(160 + k * 22, -wd / 2, 20 + k * hh, wd, wd, hh, '#9e958b', o); }
        const a = ST.isoP(-240, 0, 20 + 6 * 58 * mp, o), b = ST.isoP(220, 0, 20 + 3 * 56 * mp, o);
        if (mp > 0.8) s += ST.pin(a[0], a[1], 50, 'OLİMPOS (Mars)', '≈ 22 km', 1) + ST.pin(b[0], b[1], 50, 'EVEREST (Dünya)', '≈ 8,8 km', 1); }
      if (si === 13) { s += planet(560, CY + 40, 360, 'jupiter', t) + label(980, 240, 'DURAK 4', 'Jüpiter');
        if (t > w('leke') - 0.3) s += planet(1240, 640, 50, 'earth', t) + ST.nextStop(668, 648, 90, 'KIRMIZI LEKE', 'Dünya\'dan büyük', 960, 760, t).replace(/font-size="38"/, 'font-size="34"'); }
      if (si === 14) { s += planet(CX, CY, 150, 'jupiter', t); const n = Math.min(95, Math.floor(seg(t, w('doksandan') - 0.4, w('doksandan') + 1.2) * 95));
        for (let i = 0; i < n; i++) { const R = 190 + (i % 7) * 34, a = t * (0.6 - (i % 7) * 0.05) + i * 2.4; s += `<circle cx="${CX + Math.cos(a) * R * 1.4}" cy="${CY + Math.sin(a) * R * 0.75}" r="${3 + (i % 3)}" fill="${[z.cream, z.mist, z.sun][i % 3]}"/>`; }
        s += `<text x="80" y="380" font-family="'Jost'" font-weight="700" font-size="120" fill="${z.sun}">${n}${n >= 95 ? '+' : ''}</text><text x="80" y="440" font-family="'Jost'" font-weight="600" font-size="40" fill="${z.cream}">uydu!</text>`; }
      if (si === 15) { s += rings(560, CY, 210, false) + planet(560, CY, 210, 'saturn', t) + rings(560, CY, 210, true) + label(1000, 240, 'DURAK 5', 'Satürn');
        for (let i = 0; i < 14; i++) { const R = ST.rng(i * 97 + 1); R(); const x = 1020 + R() * 380, y = 420 + R() * 360, sz = 12 + R() * 26; s += `<rect x="${x}" y="${y + Math.sin(t + i) * 8}" width="${sz}" height="${sz * 0.8}" rx="5" fill="${i % 2 ? z.cream : z.mist}" transform="rotate(${i * 30 + t * 20} ${x} ${y})"/>`; }
        s += `<text x="1020" y="840" font-family="'Jost'" font-weight="600" font-size="34" fill="${z.mist}">buz + kaya parçaları</text>`; }
      if (si === 16) { const bob = Math.sin(t * 2.5) * 14;
        s += `<rect x="250" y="520" width="900" height="300" rx="140" fill="${z.cream}"/><rect x="290" y="${560}" width="820" height="60" rx="30" fill="${z.blue}"/><rect x="230" y="500" width="940" height="44" rx="22" fill="${z.creamS}"/>
          <rect x="330" y="820" width="40" height="60" rx="10" fill="${z.creamS}"/><rect x="1030" y="820" width="40" height="60" rx="10" fill="${z.creamS}"/>`;
        s += `<g transform="translate(0 ${bob})">${rings(700, 470, 130, false)}${planet(700, 470, 130, 'saturn', t)}${rings(700, 470, 130, true)}</g>`;
        for (let i = 0; i < 6; i++) { const q = (t * 0.8 + i / 6) % 1; s += `<circle cx="${560 + i * 56}" cy="${540 - Math.sin(q * Math.PI) * 120}" r="9" fill="${z.blue}" opacity="${1 - q}"/>`; }
        s += label(80, 300, 'DEV KÜVET', 'Satürn yüzer!'); }
      if (si === 17) { const a = t * 1.5; s += ST.glowRings(600, CY, 230) + planet(600, CY, 230, 'uranus', t);
        s += `<ellipse cx="600" cy="${CY}" rx="70" ry="400" fill="none" stroke="${z.cream}" stroke-width="14" opacity="0.8" transform="rotate(${-8} 600 ${CY})"/>`;
        s += `<path d="M 300 ${CY} H 900" stroke="${z.sun}" stroke-width="6" stroke-dasharray="14 12"/><path d="M 900 ${CY} l -24 -14 v 28 Z" fill="${z.sun}"/>` + label(980, 260, 'DURAK 6', 'Uranüs') + `<text x="980" y="400" font-family="'Jost'" font-weight="600" font-size="40" fill="${z.mist}">yan yatmış döner ↻</text>`; }
      if (si === 18) { s += ST.glowRings(460, CY, 230) + planet(460, CY, 230, 'neptune', t) + label(900, 240, 'DURAK 7', 'Neptün');
        const k = seg(t, w('yüz') - 0.3, w('yüz') + 1.4), n = Math.floor(k * 165);
        s += `<circle cx="1120" cy="560" r="170" fill="none" stroke="${z.r2}" stroke-width="8"/><path d="M 1120 390 A 170 170 0 ${k > 0.5 ? 1 : 0} 1 ${1120 + Math.sin(k * Math.PI * 2) * 170} ${560 - Math.cos(k * Math.PI * 2) * 170}" stroke="${z.sun}" stroke-width="8" fill="none"/>
          <circle cx="1120" cy="560" r="22" fill="${z.sun}"/><text x="1120" y="800" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="60" fill="${z.cream}">${n} yıl</text>`; }
      if (si === 19 || si === 20) { const far = si === 20, o = { x: far ? 820 : 760, y: far ? 600 : 660, k: far ? 0.62 : 0.95 };
        const len = far ? 1400 : 700, x0 = -620;
        s += ST.isoBox(x0, -30, 0, len + 120, 60, 20, '#e8dccb', o);
        const sp = ST.isoP(x0 + 40, 0, 20, o); s += planet(sp[0], sp[1] - 40, 46, 'sun', t);
        const ep = ST.isoP(x0 + 700, 0, 20, o); s += planet(ep[0], ep[1] - 20, 20, 'earth', t);
        if (far) { const np = ST.isoP(x0 + 1400, 0, 20, o); s += planet(np[0], np[1] - 20, 24, 'neptune', t); }
        const q = seg(t, c.L[si].start, c.L[si].start + 2.4), lp = ST.isoP(x0 + 40 + (len - 40) * q, 0, 30, o);
        const a0 = ST.isoP(x0 + 40, 0, 30, o);
        s += `<path d="M ${a0[0]} ${a0[1]} L ${lp[0]} ${lp[1]}" stroke="#ffc84a" stroke-width="12" stroke-linecap="round"/><circle cx="${lp[0]}" cy="${lp[1]}" r="16" fill="#fff3a0"/>`;
        s += ST.pin(ep[0], ep[1] + 10, -80, '8 DAKİKA', 'Dünya', 1).replace('V ' + (ep[1] + 10 + 80), 'V ' + (ep[1] + 90));
        if (far) { const np = ST.isoP(x0 + 1400, 0, 20, o); s += ST.pin(np[0], np[1] - 50, 80, '4 SAAT', 'Neptün', -1); }
        s += `<text x="80" y="840" font-family="'JetBrains Mono'" font-weight="800" font-size="70" fill="${P.iso.ink}">${far ? Math.round(q * 4 * 10) / 10 + ' saat' : Math.round(q * 8 * 10) / 10 + ' dk'}</text>`; }
      if (si === 21) for (let i = 0; i < 8; i++) s += planet(110 + i * 120, 860, i === 4 ? 52 : i === 5 ? 44 : 32, ORDER[i], t);
      return s;
    },
    cat(st, c) { if (c.mode === 'zoom') { st.lookX = -0.8; st.lookY = -0.3; } if (c.si === 16) st.happy = 1; if (c.si === 4 && c.into > 2) { st.brow = 1; st.ear = 0.8; } },
    stamps(c) { return [{ t: c.wt(21, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 1450, y: 860, rot: -10, end: c.sceneStart(22), size: 96 }]; },
    stickers(c) { return [{ t: 0.6, txt: '🪐?', col: '#ffc84a', y: 160, dx: 720, size: 150 }]; },
  };
})();
