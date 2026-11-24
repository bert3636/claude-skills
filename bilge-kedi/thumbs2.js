// v2 kapaklar (halftone dosya). thumbs2.html?k=<bölüm>  — Shorts dikey 1080x1920, uzunlar yatay 1920x1080.
(function () {
  const P = ST.PAL, D = P.dos, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="'Alfa Slab One'" font-size="${s}" fill="${col}" stroke="${z.night}" stroke-width="${s * 0.12}" paint-order="stroke" stroke-linejoin="round">${txt}</text>`;
  const star4 = (x, y, r, col = z.cream) => `<path d="M ${x} ${y - r} L ${x + r * 0.25} ${y - r * 0.25} L ${x + r} ${y} L ${x + r * 0.25} ${y + r * 0.25} L ${x} ${y + r} L ${x - r * 0.25} ${y + r * 0.25} L ${x - r} ${y} L ${x - r * 0.25} ${y - r * 0.25} Z" fill="${col}"/>`;
  function galaxy(cx, cy, R, rot, n = 520) {
    let d1 = '', d2 = '', d3 = ''; const r = ST.rng(77);
    for (let i = 0; i < n; i++) { const arm = i % 2, u = r(), rr = Math.pow(u, 0.7) * R, a = rot + arm * Math.PI + rr / R * 4.2 + (r() - 0.5) * 0.5;
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.62, sz = 1.8 + r() * 4, p = `M${x - sz} ${y}a${sz} ${sz} 0 1 0 ${2 * sz} 0a${sz} ${sz} 0 1 0 ${-2 * sz} 0`;
      if (i % 3 === 0) d1 += p; else if (i % 3 === 1) d2 += p; else d3 += p; }
    return `<ellipse cx="${cx}" cy="${cy}" rx="${R * 0.38}" ry="${R * 0.24}" fill="${z.r2}"/><ellipse cx="${cx}" cy="${cy}" rx="${R * 0.2}" ry="${R * 0.13}" fill="${z.creamS}"/><ellipse cx="${cx}" cy="${cy}" rx="${R * 0.12}" ry="${R * 0.08}" fill="${z.cream}"/>
      <path d="${d1}" fill="${z.cream}"/><path d="${d2}" fill="${z.mist}"/><path d="${d3}" fill="#9fdcff"/>`;
  }
  const bubble = (x, y, s, txt) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -150 -90 h 300 a 40 40 0 0 1 40 40 v 100 a 40 40 0 0 1 -40 40 h -200 l -60 50 l 10 -50 h -50 a 40 40 0 0 1 -40 -40 v -100 a 40 40 0 0 1 40 -40 Z" fill="${z.cream}"/>${big(0, 40, 110, txt, z.coral)}</g>`;

  // art(w,h): kanıt fotoğrafının içi (karanlık uzay)
  const E = {
    istasyon: { no: '11', h: ['UZAY', 'İSTASYONU'], sub: 'GÜNDE 16 KEZ GÜN DOĞUMU!', stamp: '16 KEZ!', cat: { glint: 1, brow: 0.8, mouth: 0.6, lookX: 0.6, lookY: -0.4 },
      art: (w, h) => SP.stars(w, h, 70, 11) + SP.planet(w / 2, h + 330, 460, 'earth') + SP.sunGlow(w - 110, 110, 52) + SP.iss(w * 0.45, h * 0.47, 1.35, -10) + SP.astronaut(w * 0.16, h * 0.25, 0.9, -20) + big(w - 110, h - 60, 110, '16×') },
    kuyruklu: { no: '12', h: ['KUYRUKLU', 'YILDIZ'], sub: 'GÖKYÜZÜNDE GARİP BİR İZ!', stamp: '76 YIL!', cat: { glint: 1, brow: 1, ear: 1, mouth: 0.7, lookX: 0.7, lookY: -0.6 },
      art: (w, h) => { const sx = 80, sy = 80, cx = w * 0.42, cy = h * 0.34, ta = Math.atan2(cy - sy, cx - sx), L = 760, n = [Math.cos(ta + Math.PI / 2), Math.sin(ta + Math.PI / 2)], ex = cx + Math.cos(ta) * L, ey = cy + Math.sin(ta) * L;
        const wedge = (h0, h1, col, op) => `<path d="M ${cx + n[0] * h0} ${cy + n[1] * h0} L ${ex + n[0] * h1} ${ey + n[1] * h1} L ${ex - n[0] * h1} ${ey - n[1] * h1} L ${cx - n[0] * h0} ${cy - n[1] * h0} Z" fill="url(#tg)" style="color:${col}" opacity="${op}"/>`;
        return `<defs><linearGradient id="tg" gradientUnits="userSpaceOnUse" x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}"><stop offset="0" stop-color="#e8f6ff"/><stop offset="1" stop-color="#9fdcff" stop-opacity="0"/></linearGradient></defs>` +
          SP.stars(w, h, 80, 12) + SP.sunGlow(sx, sy, 60) + wedge(60, 230, '', 0.35) + wedge(44, 140, '', 0.55) + wedge(26, 60, '', 0.9) +
          ST.glowRings(cx, cy, 50) + SP.planet(cx, cy, 58, 'comet') + `<path d="M ${cx - 80} ${cy - 40} q -30 -50 -10 -90" stroke="${z.sun}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="4 16"/>`; } },
    yildizlar: { no: '13', h: ['GÖZ KIRPAN', 'YILDIZLAR'], sub: 'NEDEN TİTRİYORLAR?', stamp: 'SUÇLU: HAVA', cat: { glint: 1, happy: 1, mouth: 0.5, lookY: -0.6 },
      art: (w, h) => { let s = SP.stars(w, h, 90, 13) + `<path d="M 0 ${h - 120} Q ${w * 0.3} ${h - 200} ${w * 0.6} ${h - 140} T ${w} ${h - 160} V ${h} H 0 Z" fill="${z.r1}"/>`;
        [[0.25, 0.3, 80, z.sun], [0.68, 0.22, 60, z.cream], [0.5, 0.55, 110, z.cream], [0.82, 0.6, 50, '#9fdcff'], [0.15, 0.68, 44, z.sun]].forEach(([x, y, r, c]) => s += `<circle cx="${x * w}" cy="${y * h}" r="${r * 1.2}" fill="${z.r2}"/>` + star4(x * w, y * h, r, c));
        return s; } },
    uzaydases: { no: '14', h: ['UZAYDA', 'SES VAR MI?'], sub: 'BAĞIRSAN DUYULUR MU?', stamp: 'ŞŞŞT!', cat: { glint: 1, brow: 1, ear: 0.8, mouth: 0.2, lookX: 0.6 },
      art: (w, h) => SP.stars(w, h, 70, 14) + SP.planet(w * 0.85, h * 0.85, 150, 'moon') + SP.astronaut(w * 0.3, h * 0.62, 1.9, -10) + bubble(w * 0.64, h * 0.27, 1.05, 'HEY!') + big(w * 0.7, h * 0.66, 120, '🔇', z.cream) },
    samanyolu: { no: '15', h: ['SAMANYOLU', 'ADRESİMİZ'], sub: 'EVİMİZ TAM OLARAK NEREDE?', stamp: 'BURADAYIZ!', cat: { glint: 1, brow: 0.6, mouth: 0.8, lookX: 0.6, lookY: -0.3 },
      art: (w, h) => { const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.85, px = cx + Math.cos(0.5) * R * 0.55, py = cy + Math.sin(0.5) * R * 0.55 * 0.62;
        return SP.stars(w, h, 60, 15) + galaxy(cx, cy, R, 0.3) + `<circle cx="${px}" cy="${py}" r="16" fill="${z.coral}" stroke="${z.cream}" stroke-width="6"/><path d="M ${px} ${py - 22} l 0 -70" stroke="${z.coral}" stroke-width="8"/>` + big(px, py - 110, 54, 'BİZ!', z.coral); } },
    roket: { no: '16', land: 1, h: ['ROKETLE', 'UZAYA!'], sub: 'ATEŞLEME! 3 · 2 · 1', stamp: 'KALKIŞ!', cat: { glint: 1, brow: 1, ear: 1, mouth: 0.9, lookX: 0.7, lookY: -0.5 },
      art: (w, h) => { let s = `<rect width="${w}" height="${h}" fill="${z.night}"/>` + SP.stars(w, h * 0.6, 60, 16) + `<rect y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="${z.r2}" opacity="0.6"/>`;
        [[0.15, 0.78], [0.8, 0.72], [0.55, 0.92]].forEach(([x, y]) => s += `<g fill="${z.cream}" opacity="0.9"><circle cx="${x * w}" cy="${y * h}" r="46"/><circle cx="${x * w + 50}" cy="${y * h + 10}" r="38"/><circle cx="${x * w - 48}" cy="${y * h + 14}" r="32"/></g>`);
        return s + SP.planet(w * 0.85, h * 0.2, 60, 'moon') + SP.rocket(w * 0.48, h * 0.42, 1.05, 1.1, 0.3); } },
    uzaybilmece: { no: 'B2', land: 1, h: ['UZAY', 'BİLMECESİ'], sub: '8 SORU · KAÇINI BİLECEKSİN?', stamp: '8 SORU', cat: { glint: 1, brow: 1, mouth: 0.3, lookX: 0.6, lookY: -0.5 },
      art: (w, h) => SP.stars(w, h, 80, 17) + SP.planet(w * 0.2, h * 0.75, 110, 'earth') + SP.planet(w * 0.36, h * 0.3, 60, 'moon') + SP.planet(w * 0.82, h * 0.78, 90, 'mars') + SP.iss(w * 0.8, h * 0.25, 0.7, 12) + big(w * 0.55, h * 0.72, 380, '?') },
  };

  window.draw = function (k) {
    const e = E[k], land = !!e.land, W = land ? 1920 : 1080, H = land ? 1080 : 1920;
    document.body.style.width = W + 'px'; document.body.style.height = H + 'px';
    const svg = document.getElementById('s'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const L = land ? { hx: 70, hy: [290, 450], hw: 840, hs: 165, sub: 545, card: [1400, 470, 3], cw: 880, ch: 640, cat: { x: 330, y: 880, s: 0.58 }, stamp: [1180, 940], num: [900, 1000, 560] }
      : { hx: 60, hy: [330, 490], hw: 960, hs: 150, sub: 590, card: [545, 1050, -3], cw: 920, ch: 660, cat: { x: 290, y: 1580, s: 0.8 }, stamp: [750, 1560], num: [1060, 1180, 640] };
    let s = `<defs>${ST.defs(1.3)}</defs>` + ST.paper(W, H);
    s += ST.halftone(0, 0, W, H, 24, 45, ST.fields.edge(W, H, 170), D.pink, 0.62, 'style="mix-blend-mode:multiply" opacity="0.5"');
    s += `<g style="mix-blend-mode:multiply">` + ST.halftone(0, 0, W, H, 22, 15, ST.fields.radial(L.cat.x, L.cat.y, 120, 520), D.yellow, 0.72) + `</g>`;
    if (!land) s += `<clipPath id="num"><text x="${L.num[0]}" y="${L.num[1]}" text-anchor="end" font-family="'Alfa Slab One'" font-size="${L.num[2]}">${e.no}</text></clipPath><g clip-path="url(#num)" style="mix-blend-mode:multiply" opacity="0.35">${ST.halftone(0, 0, W, H, 20, 30, () => 0.62, D.cobalt, 0.7)}</g>`;
    s += ST.chip(land ? 70 : 50, land ? 110 : 120, `DOSYA #${e.no}`) + ST.chip(land ? 400 : 380, land ? 110 : 120, 'UZAY', D.cobalt);
    e.h.forEach((t, i) => s += ST.headline(L.hx, L.hy[i], Math.min(L.hs, L.hw / ([...t].length * 0.82)), t, i ? D.red : D.ink));
    s += `<text x="${L.hx + 6}" y="${L.sub}" font-family="'JetBrains Mono'" font-weight="800" font-size="${land ? 44 : 40}" fill="${D.ink}">${e.sub}</text>`;
    // kanıt fotoğrafı
    const [cx, cy, rot] = L.card, w = L.cw, h = L.ch;
    s += `<g transform="translate(${cx} ${cy}) rotate(${rot})"><rect x="${-w / 2 - 22 + 16}" y="${-h / 2 - 22 + 16}" width="${w + 44}" height="${h + 44}" fill="${D.ink}"/><rect x="${-w / 2 - 22}" y="${-h / 2 - 22}" width="${w + 44}" height="${h + 44}" fill="#fff8e8" stroke="${D.ink}" stroke-width="6"/>
      <clipPath id="cc"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#cc)"><g transform="translate(${-w / 2} ${-h / 2})">${ST.paper(w, h, 'zoom')}${e.art(w, h)}</g></g>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="${D.ink}" stroke-width="5"/>
      <rect x="${-w / 2 - 50}" y="${-h / 2 - 40}" width="170" height="54" fill="${D.yellow}" opacity="0.85" transform="rotate(-30 ${-w / 2 + 30} ${-h / 2 - 10})"/>
      <rect x="${w / 2 - 120}" y="${-h / 2 - 40}" width="170" height="54" fill="${D.yellow}" opacity="0.85" transform="rotate(28 ${w / 2 - 30} ${-h / 2 - 10})"/>
      ${ST.chip(-w / 2 + 20, h / 2 - 24, 'KANIT #1', D.red, '#fff8e8', 30)}</g>`;
    s += ST.cat(e.cat, L.cat, 'ink');
    s += ST.stamp(L.stamp[0], L.stamp[1], e.stamp, D.red, -10, 1, Math.min(land ? 96 : 84, 430 / ([...e.stamp].length * 0.66)));
    s += ST.grain(W, H, 1.3, D.paper, D.ink);
    svg.innerHTML = s;
  };
  window.THUMBS = Object.keys(E).map(k => [k, !!E[k].land]);
})();
