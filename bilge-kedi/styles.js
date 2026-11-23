// Bilge Kedi v2 stil kütüphanesi: halftone dosya (ana), ölçek yakınlaştırma, blueprint, izometrik, scratch film.
// Hepsi SVG string döndürür; her kare zamanın saf fonksiyonudur. window.ST
(function () {
  const PAL = {
    // halftone dosya: kâğıt + koyu mürekkep + 5 nokta mürekkebi
    dos: { paper: '#f2e4c4', ink: '#1f2650', cobalt: '#2f5fd0', pink: '#ff5c8a', yellow: '#ffc72c', red: '#e3402f', teal: '#1fa38a' },
    zoom: { night: '#1D2052', r1: '#252A63', r2: '#30367C', blue: '#4D7CFE', blueS: '#3A5FD9', mint: '#3FD8AE', mintS: '#22B38C', coral: '#FF6B5E', coralS: '#E14B45', sun: '#FFC84A', sunS: '#F2A12F', cream: '#FFF4E2', creamS: '#F0DCC0', mist: '#9298D4' },
    bp: { b1: '#18336B', b2: '#2A58A6', line: '#E7F0F9', table: '#0D1116', stamp: '#e3402f' },
    iso: { ground: '#f3ede2', ink: '#2b2440' },
    scr: { black: '#050403', cream: '#FFF4DC', teal: '#1FB39A', blue: '#2F86FF', red: '#FF3220', yellow: '#FFC81C', green: '#46D65A' },
  };
  function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, x) => a + (b - a) * x;

  // ---------- dokular (bir kez üretilip PNG data URL olarak önbelleğe alınır) ----------
  const cache = {};
  function texture(kind, W, H) {
    const key = kind + W + 'x' + H; if (cache[key]) return cache[key];
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const r = rng(kind.length * 977 + W);
    const base = { paper: [242, 228, 196], bp: [30, 66, 138], scr: [8, 6, 5], iso: [243, 237, 226], zoom: [29, 32, 82] }[kind];
    // düşük frekanslı lekeler: küçük gürültü dokusunu büyütüp yumuşat
    const sm = document.createElement('canvas'); sm.width = 48; sm.height = Math.round(48 * H / W); const sg = sm.getContext('2d');
    const amp = { paper: 16, bp: 18, scr: 10, iso: 6, zoom: 0 }[kind];
    const id = sg.createImageData(sm.width, sm.height);
    for (let i = 0; i < id.data.length; i += 4) { const v = (r() - 0.5) * amp * 2, w = kind === 'scr' ? (r() - 0.5) * 8 : 0;
      id.data[i] = base[0] + v + w; id.data[i + 1] = base[1] + v; id.data[i + 2] = base[2] + v - w; id.data[i + 3] = 255; }
    sg.putImageData(id, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(sm, 0, 0, W, H);
    // ince taneler
    const im = g.getImageData(0, 0, W, H), d = im.data, gr = { paper: 12, bp: 5, scr: 8, iso: 5, zoom: 0 }[kind];
    for (let i = 0; i < d.length; i += 4) { const v = (r() - 0.5) * gr; d[i] += v + (kind === 'paper' ? 2 : 0); d[i + 1] += v; d[i + 2] += v; }
    g.putImageData(im, 0, 0);
    if (kind === 'bp') { g.strokeStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 70; i++) { g.lineWidth = r() * 2; g.beginPath(); const x = r() * W; g.moveTo(x, 0); g.lineTo(x + (r() - 0.5) * 80, H); g.stroke(); } }
    if (kind === 'paper' || kind === 'bp') { // katlanma izi
      g.fillStyle = kind === 'paper' ? 'rgba(120,90,40,0.10)' : 'rgba(0,0,0,0.18)'; g.fillRect(0, H * 0.5 - 2, W, 3);
      g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, H * 0.5 + 1, W, 2); }
    const vg = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, kind === 'paper' ? 'rgba(90,60,20,0.28)' : 'rgba(0,0,0,0.45)');
    g.fillStyle = vg; g.fillRect(0, 0, W, H);
    return (cache[key] = cv.toDataURL('image/png'));
  }

  // ---------- halftone ----------
  // dens(x,y) -> 0..1 ; döndürülmüş ızgarada daireler, tek path
  function halftone(x0, y0, w, h, step, angDeg, dens, color, k = 0.7, extra = '') {
    const a = angDeg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), cx = x0 + w / 2, cy = y0 + h / 2, R = Math.hypot(w, h) / 2;
    let d = '';
    for (let u = -R; u <= R; u += step) for (let v = -R; v <= R; v += step) {
      const x = cx + u * ca - v * sa, y = cy + u * sa + v * ca; if (x < x0 - step || x > x0 + w + step || y < y0 - step || y > y0 + h + step) continue;
      const rr = cl(dens(x, y)) * step * k; if (rr < 0.8) continue;
      d += `M${(x - rr).toFixed(1)} ${y.toFixed(1)}a${rr.toFixed(1)} ${rr.toFixed(1)} 0 1 0 ${(2 * rr).toFixed(1)} 0a${rr.toFixed(1)} ${rr.toFixed(1)} 0 1 0 ${(-2 * rr).toFixed(1)} 0`;
    }
    return `<path d="${d}" fill="${color}" ${extra}/>`;
  }
  const fields = {
    radial: (cx, cy, r0, r1, inv = false) => (x, y) => { const q = cl((Math.hypot(x - cx, y - cy) - r0) / (r1 - r0)); return inv ? q : 1 - q; },
    edge: (W, H, m) => (x, y) => 1 - cl(Math.min(x, y, W - x, H - y) / m),
    linear: (x0, y0, x1, y1) => (x, y) => { const dx = x1 - x0, dy = y1 - y0; return cl(((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy)); },
  };

  // ---------- ortak SVG filtreleri ----------
  function defs(t) {
    const seed = Math.floor(t * 10) % 50; // 10 fps çizgi titremesi
    return `<filter id="stOutline" x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="d"/><feFlood flood-color="${PAL.dos.ink}"/><feComposite in2="d" operator="in" result="o"/>
        <feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="stBoil" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}"/>
        <feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="stWhite"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>
      <filter id="stLines" x="-10%" y="-10%" width="120%" height="120%">
        <feColorMatrix type="luminanceToAlpha" in="SourceGraphic" result="l"/>
        <feConvolveMatrix in="l" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" preserveAlpha="false" result="e"/>
        <feComponentTransfer in="e" result="e2"><feFuncA type="linear" slope="14" intercept="-0.4"/></feComponentTransfer>
        <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="sd"/><feMorphology in="SourceAlpha" operator="erode" radius="1" result="se"/>
        <feComposite in="sd" in2="se" operator="out" result="sil"/>
        <feMerge result="m"><feMergeNode in="e2"/><feMergeNode in="sil"/></feMerge>
        <feMorphology in="m" operator="dilate" radius="0.8" result="m2"/>
        <feFlood flood-color="${'#E7F0F9'}"/><feComposite in2="m2" operator="in"/></filter>
      <filter id="stScratch" x="-15%" y="-15%" width="130%" height="130%">
        <feColorMatrix type="luminanceToAlpha" in="SourceGraphic" result="l"/>
        <feConvolveMatrix in="l" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" divisor="1" preserveAlpha="false" result="e"/>
        <feComponentTransfer in="e" result="e2"><feFuncA type="linear" slope="14" intercept="-0.4"/></feComponentTransfer>
        <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="sd"/><feMorphology in="SourceAlpha" operator="erode" radius="1" result="se"/>
        <feComposite in="sd" in2="se" operator="out" result="sil"/>
        <feMerge result="m"><feMergeNode in="e2"/><feMergeNode in="sil"/></feMerge>
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="${seed}" result="n"/>
        <feDisplacementMap in="m" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="j"/>
        <feFlood flood-color="${PAL.scr.cream}"/><feComposite in2="j" operator="in" result="c"/>
        <feGaussianBlur in="c" stdDeviation="9" result="g1"/><feGaussianBlur in="c" stdDeviation="26" result="g2"/>
        <feMerge><feMergeNode in="g2"/><feMergeNode in="g1"/><feMergeNode in="c"/><feMergeNode in="c"/></feMerge></filter>
      <filter id="stRough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="9" result="n2"/>
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.55" result="m"/>
        <feComposite in="d" in2="m" operator="in"/></filter>
      <filter id="stHalo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="a"/><feGaussianBlur in="SourceGraphic" stdDeviation="28" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  }

  // ---------- kedi varyantları ----------
  // pos: {x,y,s}; variant: 'ink' (dosya), 'flat' (ölçek/izometrik), 'line' (blueprint), 'scratch'
  let catN = 0;
  function cat(st, pos, variant = 'ink', over = '') {
    const tf = `translate(${pos.x - 350 * pos.s} ${pos.y - 480 * pos.s}) scale(${pos.s})`;
    const body = `${drawCat(st)}${over}`;
    if (variant === 'line') return `<g transform="${tf}" filter="url(#stLines)">${body}</g>`;
    if (variant === 'scratch') return `<g transform="${tf}" filter="url(#stScratch)">${body}</g>`;
    const id = 'catm' + (catN++);
    let shade = '';
    if (variant === 'ink') { // gövdenin sağ altına halftone gölge, kedi siluetine maskeli
      shade = `<mask id="${id}"><g filter="url(#stWhite)">${body}</g></mask>
        <g mask="url(#${id})">${halftone(0, 0, 760, 960, 16, 15, (x, y) => cl(((x - 330) + (y - 620)) / 560) * 0.85, PAL.dos.cobalt, 0.7, 'style="mix-blend-mode:multiply" opacity="0.85"')}</g>`;
    }
    return `<g transform="${tf}"><g filter="url(#stOutline)"><g filter="${variant === 'ink' ? 'url(#stBoil)' : ''}">${body}</g></g>${shade}</g>`;
  }

  // ---------- dosya stili parçaları ----------
  const F = { head: "'Alfa Slab One'", disp: "'Baloo 2'", mono: "'JetBrains Mono'", hand: "'Patrick Hand'", geo: "'Jost'" };
  function headline(x, y, size, txt, col = PAL.dos.ink, shadow = PAL.dos.cobalt, anchor = 'start', p = 1) {
    const chars = [...txt]; const n = chars.length;
    const sp = chars.map((ch, i) => { const q = cl(p * (n * 0.25 + 1) - i * 0.25); const dy = (1 - Math.min(1, q)) * -90;
      return `<tspan dy="0" opacity="${q > 0 ? 1 : 0}">${ch}</tspan>`; }).join('');
    const base = `x="${x}" y="${y}" font-family="${F.head}" font-size="${size}" text-anchor="${anchor}"`;
    return `<text ${base} transform="translate(9 9)" fill="${shadow}" style="mix-blend-mode:multiply">${sp}</text><text ${base} fill="${col}">${sp}</text>`;
  }
  function stamp(x, y, txt, col = PAL.dos.red, rot = -10, sc = 1, size = 110) {
    const w = txt.length * size * 0.66 + 80, h = size * 1.45;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" opacity="0.93" filter="url(#stRough)">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="22" fill="none" stroke="${col}" stroke-width="12"/>
      <rect x="${-w / 2 + 18}" y="${-h / 2 + 18}" width="${w - 36}" height="${h - 36}" rx="12" fill="none" stroke="${col}" stroke-width="5"/>
      <text x="0" y="${size * 0.36}" text-anchor="middle" font-family="${F.head}" font-size="${size}" fill="${col}">${txt}</text></g>`;
  }
  function chip(x, y, txt, bg = PAL.dos.ink, fg = PAL.dos.paper, size = 34) {
    const w = txt.length * size * 0.62 + 36;
    return `<g transform="translate(${x} ${y})"><rect x="0" y="${-size}" width="${w}" height="${size * 1.45}" rx="${size * 0.3}" fill="${bg}"/>
      <text x="18" y="${size * 0.12}" font-family="${F.mono}" font-weight="800" font-size="${size}" fill="${fg}">${txt}</text></g>`;
  }
  function captionBar(x, y, w, words, key, size = 56) { // kelimelerden biri anahtar (sarı)
    const h = size * 1.7;
    const tx = words.map(wd => `<tspan fill="${wd === key ? PAL.dos.yellow : PAL.dos.paper}">${wd} </tspan>`).join('');
    return `<rect x="${x - w / 2 + 10}" y="${y - h / 2 + 10}" width="${w}" height="${h}" rx="${h / 2}" fill="${PAL.dos.cobalt}" style="mix-blend-mode:multiply"/>
      <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${PAL.dos.ink}"/>
      <text x="${x}" y="${y + size * 0.35}" text-anchor="middle" font-family="${F.disp}" font-weight="800" font-size="${size}">${tx}</text>`;
  }
  function dotWipe(W, H, p, col, cell = 90) { // p: 0 -> 1 (kapanır) -> 2 (açılır)
    let d = ''; const cov = cell * 0.75;
    for (let x = cell / 2; x < W + cell; x += cell) for (let y = cell / 2; y < H + cell; y += cell) {
      const delay = (x / W + y / H) * 0.25, q = p <= 1 ? cl((p - delay) / 0.5) : 1 - cl((p - 1 - delay) / 0.5);
      const r = q * cov; if (r > 0.5) d += `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`; }
    return d ? `<path d="${d}" fill="${col}"/>` : '';
  }
  function grain(W, H, t, colA, colB, n = 260) {
    const r = rng(Math.floor(t * 15) + 7); let a = '', b = '';
    for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, s = r() * 2.2 + 0.6; const p = `M${x} ${y}h${s}v${s}h${-s}Z`; if (i % 4) a += p; else b += p; }
    return `<path d="${a}" fill="${colA}" opacity="0.55"/><path d="${b}" fill="${colB}" opacity="0.5"/>`;
  }
  function paper(W, H, kind = 'paper') { return `<image href="${texture(kind, W, H)}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>`; }

  // ---------- ölçek yakınlaştırma ----------
  function glowRings(x, y, r) { const z = PAL.zoom; return `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="${z.r1}"/><circle cx="${x}" cy="${y}" r="${r * 1.45}" fill="${z.r2}"/>`; }
  function twoTone(id, shapeD, base, shade) { // tek gölge adımı: sağ altta hilal
    return `<clipPath id="${id}"><path d="${shapeD}"/></clipPath><path d="${shapeD}" fill="${shade}"/><g clip-path="url(#${id})"><path d="${shapeD}" fill="${base}" transform="translate(-14 -14)"/></g>`;
  }
  function nextStop(x, y, r, tag, label, lx, ly, t = 0) {
    const z = PAL.zoom;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${z.sun}" stroke-width="6"/>
      <circle cx="${x}" cy="${y}" r="${r + 18}" fill="none" stroke="${z.sun}" stroke-width="3" stroke-dasharray="10 12" transform="rotate(${t * 20} ${x} ${y})"/>
      <path d="M ${x + r * 0.7} ${y - r * 0.7} L ${lx} ${ly}" stroke="${z.cream}" stroke-width="3" stroke-linecap="round"/>
      <text x="${lx + 10}" y="${ly - 40}" font-family="${F.geo}" font-weight="600" font-size="24" letter-spacing="3" fill="${z.sun}">${tag}</text>
      <text x="${lx + 10}" y="${ly}" font-family="${F.geo}" font-weight="600" font-size="38" fill="${z.cream}">${label}</text>`;
  }
  function sightLine(x0, y0, x1, y1, t, n = 14) {
    const z = PAL.zoom; let s = '';
    for (let i = 1; i < n; i++) { const q = ((i / n) + t * 0.15) % 1; const x = lerp(x0, x1, q), y = lerp(y0, y1, q); const r = 7 * Math.sin(Math.PI * q) + 2;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${z.sun}"/>`; }
    return s;
  }
  function scaleRibbon(x, y, w, prog, stops, fov) {
    const z = PAL.zoom; let s = `<text x="${x}" y="${y - 70}" font-family="${F.geo}" font-weight="600" font-size="22" letter-spacing="3" fill="${z.mist}">GÖRÜŞ ALANI</text>
      <text x="${x}" y="${y - 22}" font-family="${F.geo}" font-weight="700" font-size="52" fill="${z.cream}">${fov}</text>
      <line x1="${x}" y1="${y + 20}" x2="${x + w}" y2="${y + 20}" stroke="${z.r2}" stroke-width="10" stroke-linecap="round"/>
      <line x1="${x}" y1="${y + 20}" x2="${x + w * prog}" y2="${y + 20}" stroke="${z.sun}" stroke-width="10" stroke-linecap="round"/>`;
    stops.forEach((st, i) => { const px = x + w * i / (stops.length - 1); s += `<circle cx="${px}" cy="${y + 20}" r="11" fill="${prog * (stops.length - 1) >= i - 0.01 ? z.sun : z.r2}"/>
      <text x="${px}" y="${y + 66}" text-anchor="middle" font-family="${F.geo}" font-weight="600" font-size="20" fill="${z.mist}">${st}</text>`; });
    return s;
  }

  // ---------- blueprint ----------
  function bpLine(d, p, w = 3.2, extra = '') { // çizilerek gelen çizgi (p: 0..1)
    return p <= 0 ? '' : `<path d="${d}" pathLength="1" stroke-dasharray="${p} 1" stroke="${PAL.bp.line}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  }
  function dim(x0, y0, x1, y1, label, p = 1, off = 40) { // ölçü çizgisi
    const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny), ux = nx / L * off, uy = ny / L * off;
    const ax = x0 + ux, ay = y0 + uy, bx = x1 + ux, by = y1 + uy, mx = (ax + bx) / 2, my = (ay + by) / 2;
    return bpLine(`M ${x0} ${y0} L ${ax + ux * 0.3} ${ay + uy * 0.3} M ${x1} ${y1} L ${bx + ux * 0.3} ${by + uy * 0.3}`, p, 1.25) +
      bpLine(`M ${ax} ${ay} L ${bx} ${by}`, p, 1.6) +
      (p > 0.6 ? `<path d="M ${ax} ${ay} l 14 -6 v 12 z M ${bx} ${by} l -14 -6 v 12 z" fill="${PAL.bp.line}" transform=""/>
        <text x="${mx}" y="${my - 12}" text-anchor="middle" font-family="${F.hand}" font-size="40" fill="${PAL.bp.line}" opacity="${cl((p - 0.6) / 0.4)}">${label}</text>` : '');
  }
  function balloon(x, y, n, lx, ly, p = 1) {
    return bpLine(`M ${x} ${y} L ${lx} ${ly}`, p, 1.25) + (p > 0.5 ? `<circle cx="${lx}" cy="${ly}" r="30" fill="${PAL.bp.b1}" stroke="${PAL.bp.line}" stroke-width="2.5"/>
      <text x="${lx}" y="${ly + 12}" text-anchor="middle" font-family="${F.hand}" font-size="38" fill="${PAL.bp.line}">${n}</text>` : '');
  }

  // ---------- izometrik ----------
  const ISO = { k: 1, cos: Math.cos(Math.PI / 6) };
  function isoP(x, y, z, o) { return [o.x + (x - y) * ISO.cos * o.k, o.y + ((x + y) * 0.5 - z) * o.k]; }
  function mixHex(a, b, t) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); }
  function tones(base) { return { top: mixHex(base, '#fff8ee', 0.2), left: base, right: mixHex(base, '#231A2C', 0.22) }; }
  function isoBox(x, y, z, w, d, h, base, o) { // x,y,z köşe; w (x), d (y), h (z)
    const T = tones(base), P = (a, b, c) => isoP(a, b, c, o).join(' ');
    return `<path d="M ${P(x, y, z + h)} L ${P(x + w, y, z + h)} L ${P(x + w, y + d, z + h)} L ${P(x, y + d, z + h)} Z" fill="${T.top}"/>
      <path d="M ${P(x, y + d, z + h)} L ${P(x + w, y + d, z + h)} L ${P(x + w, y + d, z)} L ${P(x, y + d, z)} Z" fill="${T.left}"/>
      <path d="M ${P(x + w, y, z + h)} L ${P(x + w, y + d, z + h)} L ${P(x + w, y + d, z)} L ${P(x + w, y, z)} Z" fill="${T.right}"/>`;
  }
  function pin(x, y, len, label, sub, dir = 1) {
    const c = PAL.iso.ink, ex = x + dir * 160;
    return `<circle cx="${x}" cy="${y}" r="10" fill="${PAL.iso.ground}" stroke="${c}" stroke-width="3"/>
      <path d="M ${x} ${y - 10} V ${y - len} H ${ex}" stroke="${c}" stroke-width="2.5" fill="none"/>
      <text x="${dir > 0 ? x + 12 : ex}" y="${y - len - 14}" font-family="${F.geo}" font-weight="600" font-size="30" letter-spacing="3" fill="${c}" stroke="${PAL.iso.ground}" stroke-width="7" paint-order="stroke">${label}</text>
      ${sub ? `<text x="${dir > 0 ? x + 12 : ex}" y="${y - len + 32}" font-family="${F.geo}" font-size="26" fill="${c}" stroke="${PAL.iso.ground}" stroke-width="6" paint-order="stroke">${sub}</text>` : ''}`;
  }

  // ---------- scratch ----------
  function scratch(pts, t, w = 4, col = PAL.scr.cream, passes = 3, seed = 1) { // titreyen iğne çizgisi
    const r = rng(seed * 131 + Math.floor(t * 15) * 7 + 1); let s = '';
    for (let p = 0; p < passes; p++) { let d = '';
      pts.forEach(([x, y], i) => { const j = w * 0.7; d += `${i ? 'L' : 'M'} ${x + (r() - 0.5) * j * 2} ${y + (r() - 0.5) * j * 2} `; });
      s += `<path d="${d}" stroke="${col}" stroke-width="${w * (0.5 + r() * 0.6)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${0.7 + r() * 0.3}"/>`; }
    return s;
  }
  function hatch(x, y, w, h, t, gap = 14, ang = 0.5, col = PAL.scr.cream, seed = 2, op = 0.6) {
    const r = rng(seed * 71 + Math.floor(t * 15) * 3); let d = '';
    for (let i = -h; i < w + h; i += gap) { const x0 = x + i + (r() - 0.5) * 4, x1 = x0 + h * ang; d += `M ${x0} ${y + (r() - 0.5) * 6} L ${x1 + (r() - 0.5) * 6} ${y + h} `; }
    return `<g><clipPath id="hc${seed}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><path d="${d}" clip-path="url(#hc${seed})" stroke="${col}" stroke-width="2.2" opacity="${op}"/></g>`;
  }
  function circlePts(cx, cy, rx, ry, n = 40, a0 = 0, a1 = Math.PI * 2) { return [...Array(n + 1)].map((_, i) => { const a = lerp(a0, a1, i / n); return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; }); }

  window.ST = { PAL, F, rng, texture, paper, halftone, fields, defs, cat, headline, stamp, chip, captionBar, dotWipe, grain,
    glowRings, twoTone, nextStop, sightLine, scaleRibbon, bpLine, dim, balloon, isoP, isoBox, tones, mixHex, pin, scratch, hatch, circlePts };
})();
