// Uzay çizim kiti (ölçek yakınlaştırma stili: düz, iki tonlu, kontursuz). window.SP
(function () {
  const z = ST.PAL.zoom;
  const PL = { earth: ['#4D7CFE', '#3A5FD9'], moon: ['#F0E8D8', '#CFC5B0'], sun: ['#FFC84A', '#F2A12F'], mars: ['#ff7a4e', '#d9542e'], jupiter: ['#f0c9a0', '#d9a27a'], neptune: ['#5a86ff', '#3a5fd9'], comet: ['#e8ecf5', '#b8bfd6'] };
  let n = 0;
  function planet(cx, cy, r, kind, t = 0) {
    const id = 'sp' + (n++), [b, s] = PL[kind] || PL.moon;
    const circ = `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
    let f = '';
    if (kind === 'earth') f = `<path d="M ${cx - r * 0.6} ${cy - r * 0.2} q ${r * 0.3} ${-r * 0.5} ${r * 0.7} ${-r * 0.2} q ${r * 0.2} ${r * 0.35} ${-r * 0.25} ${r * 0.5} q ${-r * 0.4} ${r * 0.1} ${-r * 0.45} ${-r * 0.3}Z M ${cx + r * 0.2} ${cy + r * 0.3} q ${r * 0.4} ${-r * 0.25} ${r * 0.65} ${r * 0.05} q ${-r * 0.1} ${r * 0.45} ${-r * 0.5} ${r * 0.4}Z" fill="${z.mint}"/>` +
      [0, 1, 2].map(i => `<ellipse cx="${cx + ((t * 0.08 * r + i * r * 0.8) % (2.4 * r)) - 1.2 * r}" cy="${cy - r * 0.5 + i * r * 0.45}" rx="${r * 0.35}" ry="${r * 0.08}" fill="${z.cream}"/>`).join('');
    if (kind === 'moon' || kind === 'comet') f = [[-0.4, -0.3, 0.18], [0.3, 0.2, 0.22], [-0.1, 0.5, 0.12], [0.45, -0.4, 0.1]].map(([x, y, q]) => `<circle cx="${cx + x * r}" cy="${cy + y * r}" r="${q * r}" fill="${s}"/>`).join('');
    if (kind === 'sun') f = [[-0.3, -0.2, 0.1], [0.35, 0.3, 0.08]].map(([x, y, q]) => `<circle cx="${cx + x * r}" cy="${cy + y * r}" r="${q * r}" fill="${s}"/>`).join('');
    return `<clipPath id="${id}c"><path d="${circ}"/></clipPath>${ST.twoTone(id, circ, b, s)}<g clip-path="url(#${id}c)">${f}<path d="${circ}" fill="${s}" transform="translate(${r * 0.22} ${r * 0.22})" opacity="0.35"/></g>`;
  }
  function sunGlow(cx, cy, r, t = 0) { let rays = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 + t * 0.4; rays += `<line x1="${cx + Math.cos(a) * r * 1.15}" y1="${cy + Math.sin(a) * r * 1.15}" x2="${cx + Math.cos(a) * r * 1.45}" y2="${cy + Math.sin(a) * r * 1.45}" stroke="${z.sun}" stroke-width="${r * 0.12}" stroke-linecap="round"/>`; }
    return ST.glowRings(cx, cy, r) + rays + planet(cx, cy, r, 'sun', t); }
  function iss(x, y, s, rot = 0) { // uzay istasyonu
    let p = ''; for (const dx of [-170, -95, 95, 170]) for (const dy of [-1, 1]) p += `<rect x="${dx - 30}" y="${dy > 0 ? 14 : -94}" width="60" height="80" fill="${z.blueS}"/><rect x="${dx - 26}" y="${dy > 0 ? 18 : -90}" width="52" height="72" fill="${z.blue}"/><path d="M ${dx - 26} ${dy > 0 ? 42 : -66} h 52 M ${dx - 26} ${dy > 0 ? 66 : -42} h 52 M ${dx} ${dy > 0 ? 18 : -90} v 72" stroke="${z.blueS}" stroke-width="3"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-210" y="-8" width="420" height="16" fill="${z.creamS}"/>${p}
      <rect x="-60" y="-30" width="120" height="60" rx="26" fill="${z.cream}"/><rect x="-60" y="4" width="120" height="26" rx="12" fill="${z.creamS}"/><rect x="-16" y="-60" width="32" height="120" rx="14" fill="${z.cream}"/>
      <circle cx="-30" cy="-6" r="6" fill="${z.night}"/><circle cx="0" cy="-6" r="6" fill="${z.night}"/><circle cx="30" cy="-6" r="6" fill="${z.night}"/></g>`;
  }
  function astronaut(x, y, s, rot = 0, t = 0, suit = z.cream) { // basit astronot, kask camında parıltı
    const sw = Math.sin(t * 2) * 10;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <rect x="-34" y="-10" width="68" height="80" rx="26" fill="${z.creamS}"/><rect x="-30" y="-10" width="60" height="70" rx="24" fill="${suit}"/>
      <rect x="-20" y="8" width="40" height="22" rx="6" fill="${z.coral}"/><rect x="-10" y="12" width="8" height="8" fill="${z.sun}"/>
      <path d="M -30 10 L ${-62} ${-10 + sw} M 30 10 L 62 ${-10 - sw}" stroke="${z.cream}" stroke-width="20" stroke-linecap="round"/>
      <path d="M -16 66 L -22 106 M 16 66 L 22 106" stroke="${z.cream}" stroke-width="22" stroke-linecap="round"/>
      <circle cx="0" cy="-46" r="42" fill="${z.creamS}"/><circle cx="0" cy="-48" r="38" fill="${z.cream}"/>
      <rect x="-28" y="-66" width="56" height="38" rx="18" fill="${z.night}"/><path d="M -18 -58 q 8 -6 18 -4" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  }
  function rocket(x, y, s, flame = 0, t = 0) { // dikey roket, alevli
    const fl = flame > 0 ? `<path d="M -40 170 Q 0 ${170 + 220 * flame * (0.85 + 0.15 * Math.sin(t * 30))} 40 170 Z" fill="${z.sun}"/><path d="M -22 170 Q 0 ${170 + 130 * flame * (0.85 + 0.15 * Math.cos(t * 27))} 22 170 Z" fill="${z.cream}"/>` : '';
    return `<g transform="translate(${x} ${y}) scale(${s})">${fl}
      <path d="M -60 120 L -110 190 L -60 170 Z M 60 120 L 110 190 L 60 170 Z" fill="${z.coralS}"/>
      <path d="M 0 -230 C 70 -150 66 -40 60 170 L -60 170 C -66 -40 -70 -150 0 -230 Z" fill="${z.creamS}"/><path d="M 0 -230 C 60 -150 56 -40 50 170 L -60 170 C -66 -40 -70 -150 0 -230 Z" fill="${z.cream}"/>
      <path d="M 0 -230 C 34 -196 50 -170 56 -140 L -56 -140 C -50 -170 -34 -196 0 -230 Z" fill="${z.coral}"/>
      <circle cx="0" cy="-40" r="34" fill="${z.blueS}"/><circle cx="-4" cy="-44" r="26" fill="${z.blue}"/><path d="M -16 -54 q 8 -8 18 -6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="-60" y="60" width="120" height="22" fill="${z.coral}"/></g>`;
  }
  function comet(x, y, r, tailAng, tailLen, t = 0) { // çekirdek + kuyruk (tailAng: kuyruk yönü, radyan)
    let tail = ''; for (let k = 0; k < 6; k++) { const a = tailAng + (k - 2.5) * 0.05, L = tailLen * (1 - k * 0.08);
      tail += `<path d="M ${x + Math.cos(a + Math.PI / 2) * r * 0.8} ${y + Math.sin(a + Math.PI / 2) * r * 0.8} L ${x + Math.cos(a) * L} ${y + Math.sin(a) * L} L ${x + Math.cos(a - Math.PI / 2) * r * 0.8} ${y + Math.sin(a - Math.PI / 2) * r * 0.8} Z" fill="${k % 2 ? z.cream : '#9fdcff'}" opacity="${0.18 + 0.05 * k}"/>`; }
    return tail + ST.glowRings(x, y, r * 0.8) + planet(x, y, r, 'comet', t);
  }
  function stars(W, H, n, seed, t = 0, tw = 0) { const R = ST.rng(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = R() * W, y = R() * H, r = R() * 2.6 + 1, k = tw ? 0.5 + 0.5 * Math.sin(t * 7 + i * 1.7) : 1;
      s += `<circle cx="${x}" cy="${y}" r="${r * (tw ? 0.6 + k : 1)}" fill="${[z.mist, z.cream, z.sun][i % 3]}" opacity="${tw ? 0.5 + 0.5 * k : 1}"/>`; } return s; }
  window.SP = { planet, sunGlow, iss, astronaut, rocket, comet, stars, PL };
})();
