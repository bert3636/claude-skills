// Bilge Kedi — halftone dosya karakteri. drawCatHT(st) -> SVG (yerel kutu 700x950; baş merkezi 350,300, ayaklar ~880).
// Kalın mürekkep kontur, düz renkler, açık renkli göğüs/yüz, parlak mürekkep gözler (iki parlama), halftone gölgeler.
// st: {blink 0..1, mouth 0..1, tail -1..1, glint 0..1, lookX/lookY -1..1, ear 0..1, brow -1..1, happy 0..1}
(function () {
  const C = { ink: '#151a3a', fur: '#252842', furD: '#171a32', cream: '#fff3dc', pink: '#ff6f98', red: '#e3402f', yellow: '#ffc72c', cobalt: '#2f5fd0', tongue: '#ff8fae', mouthIn: '#7a1f3a' };
  const OW = 9; // kontur kalınlığı (yerel birim)
  let uid = 0;
  const sh = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" stroke="${C.ink}" stroke-width="${OW}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
  function dots(id, clipD, x0, y0, w, h, step, ang, dens, col, op = 1) {
    if (!window.ST) return '';
    return `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})" opacity="${op}">${ST.halftone(x0, y0, w, h, step, ang, dens, col, 0.68)}</g>`;
  }
  const lin = (x0, y0, x1, y1, a = 0, b = 1) => (x, y) => { const dx = x1 - x0, dy = y1 - y0; const q = ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy); return Math.max(0, Math.min(1, a + (b - a) * q)); };

  function eye(cx, cy, s, side) {
    const lx = (s.lookX || 0) * 9, ly = (s.lookY || 0) * 8;
    if (s.happy > 0.5) return `<path d="M ${cx - 30} ${cy + 8} Q ${cx} ${cy - 30} ${cx + 30} ${cy + 8}" stroke="${C.ink}" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    const open = Math.max(0, 1 - s.blink);
    if (open < 0.18) return `<path d="M ${cx - 30} ${cy + 2} Q ${cx} ${cy + 18} ${cx + 30} ${cy + 2}" stroke="${C.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    const ry = 34 * open;
    return `<ellipse cx="${cx + lx}" cy="${cy + ly}" rx="27" ry="${ry}" fill="${C.ink}"/>
      <ellipse cx="${cx + lx - 9}" cy="${cy + ly - ry * 0.42}" rx="10" ry="${Math.max(2, 12 * open)}" fill="#fff"/>
      <circle cx="${cx + lx + 9}" cy="${cy + ly + ry * 0.35}" r="${5 * open}" fill="#fff"/>`;
  }
  window.drawCatHT = function (s = {}) {
    s = Object.assign({ blink: 0, mouth: 0, tail: 0, glint: 0, lookX: 0, lookY: 0, ear: 0, brow: 0, happy: 0 }, s);
    const n = uid++, t = s.tail, e = s.ear * 12, b = s.brow * 9, m = s.mouth;
    // kuyruk (kalın tüp + krem uç)
    const tx = 650 + t * 70, ty = 545 - t * 12;
    const tail = `<path d="M 505 790 C ${650 + t * 30} 820 ${720 + t * 60} ${690 - t * 20} ${tx} ${ty}" stroke="${C.ink}" stroke-width="${62 + OW * 2}" fill="none" stroke-linecap="round"/>
      <path d="M 505 790 C ${650 + t * 30} 820 ${720 + t * 60} ${690 - t * 20} ${tx} ${ty}" stroke="${C.fur}" stroke-width="62" fill="none" stroke-linecap="round"/>
      <circle cx="${tx}" cy="${ty}" r="33" fill="${C.cream}" stroke="${C.ink}" stroke-width="${OW}"/>`;
    // gövde: tıknaz armut
    const bodyD = 'M 350 445 C 520 445 590 560 585 700 C 582 820 520 880 350 882 C 180 880 118 820 115 700 C 110 560 180 445 350 445 Z';
    const bibD = 'M 268 470 Q 350 515 432 470 Q 482 640 350 848 Q 218 640 268 470 Z';
    let o = tail + `<ellipse cx="350" cy="900" rx="250" ry="26" fill="${C.ink}" opacity="0.22"/>`;
    o += sh(bodyD, C.fur) + dots(`cb${n}`, bodyD, 100, 440, 500, 450, 15, 20, lin(250, 560, 560, 860, -0.2, 0.75), C.furD);
    o += sh(bibD, C.cream) + dots(`cbb${n}`, bibD, 210, 470, 280, 390, 14, 35, lin(330, 600, 420, 840, 0, 0.55), C.cobalt, 0.55);
    // patiler
    o += sh('M 196 870 C 196 834 236 826 268 826 C 302 826 338 838 338 870 C 338 900 300 906 268 906 C 232 906 196 900 196 870 Z', C.cream);
    o += sh('M 362 870 C 362 838 398 826 432 826 C 464 826 504 834 504 870 C 504 900 468 906 432 906 C 400 906 362 900 362 870 Z', C.cream);
    o += `<path d="M 245 892 v -20 M 268 896 v -22 M 291 892 v -20 M 409 892 v -20 M 432 896 v -22 M 455 892 v -20" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
    // papyon
    o += `<g transform="translate(350 478)">${sh('M 0 0 L -86 -44 Q -104 0 -86 44 Z', C.red)}${sh('M 0 0 L 86 -44 Q 104 0 86 44 Z', C.red)}
      ${dots(`cpb${n}`, 'M 0 0 L -86 -44 Q -104 0 -86 44 Z M 0 0 L 86 -44 Q 104 0 86 44 Z', -110, -50, 220, 100, 11, 45, lin(0, -40, 0, 50, 0.1, 0.8), C.ink, 0.2)}
      ${sh('M -22 -24 H 22 V 24 H -22 Z', C.red, 'rx="10"')}<path d="M -66 -22 L -36 -8 M 66 -22 L 36 -8" stroke="#ffb0a0" stroke-width="7" stroke-linecap="round"/></g>`;
    // kulaklar
    o += sh(`M 150 235 L ${172 - e} ${48 - e} L 300 140 Z`, C.fur) + sh(`M 550 235 L ${528 + e} ${48 - e} L 400 140 Z`, C.fur);
    o += `<path d="M 190 196 L ${199 - e} ${104 - e} L 266 152 Z M 510 196 L ${501 + e} ${104 - e} L 434 152 Z" fill="${C.pink}"/>`;
    // baş: yuvarlak, hafif basık
    const headD = 'M 350 112 C 500 112 575 200 575 305 C 575 420 480 488 350 488 C 220 488 125 420 125 305 C 125 200 200 112 350 112 Z';
    o += sh(headD, C.fur) + dots(`ch${n}`, headD, 120, 110, 460, 380, 15, 20, lin(300, 260, 560, 470, -0.3, 0.7), C.furD);
    // yüzdeki beyaz alev + ağız bölgesi
    const blazeD = 'M 350 196 C 330 256 302 282 256 322 C 216 356 226 440 300 458 Q 350 470 400 458 C 474 440 484 356 444 322 C 398 282 370 256 350 196 Z';
    o += `<path d="${blazeD}" fill="${C.cream}"/>` + dots(`cz${n}`, blazeD, 220, 190, 270, 280, 12, 35, lin(350, 380, 430, 470, 0, 0.5), C.cobalt, 0.4);
    // yanaklar: pembe halftone kümesi
    o += `<g>${window.ST ? ST.halftone(195, 365, 80, 56, 11, 45, (x, y) => 1 - Math.hypot((x - 235) / 40, (y - 393) / 28), C.pink, 0.7) + ST.halftone(425, 365, 80, 56, 11, 45, (x, y) => 1 - Math.hypot((x - 465) / 40, (y - 393) / 28), C.pink, 0.7) : ''}</g>`;
    // kaşlar (kürk üstünde krem, kalın)
    o += `<path d="M 222 ${200 + b} Q 266 ${180 - b} 306 ${200 + b} M 394 ${200 + b} Q 434 ${180 - b} 478 ${200 + b}" stroke="${C.cream}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    // gözler
    o += eye(270, 290, s, -1) + eye(430, 290, s, 1);
    // gözlük: kalın sarı çerçeve + mürekkep kontur + cam parlaması
    const lens = (cx) => `<circle cx="${cx}" cy="290" r="66" fill="none" stroke="${C.ink}" stroke-width="${22 + OW}"/><circle cx="${cx}" cy="290" r="66" fill="none" stroke="${C.yellow}" stroke-width="20"/>
      <path d="M ${cx - 40} ${262} A 48 48 0 0 1 ${cx - 12} ${240}" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.85"/>`;
    o += `<path d="M 204 280 L 140 262 M 496 280 L 560 262" stroke="${C.ink}" stroke-width="${12 + OW}" stroke-linecap="round"/><path d="M 204 280 L 140 262 M 496 280 L 560 262" stroke="${C.yellow}" stroke-width="12" stroke-linecap="round"/>`;
    o += `<path d="M 334 284 Q 350 266 366 284" stroke="${C.ink}" stroke-width="${12 + OW}" fill="none" stroke-linecap="round"/><path d="M 334 284 Q 350 266 366 284" stroke="${C.yellow}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    o += lens(270) + lens(430);
    if (s.glint > 0.02) o += `<g opacity="${s.glint}"><path d="M 210 330 L 300 230 L 318 248 L 228 348 Z M 370 330 L 460 230 L 478 248 L 388 348 Z" fill="#fff" opacity="0.6"/>
      <path d="M 486 214 l 8 -24 l 8 24 l 24 8 l -24 8 l -8 24 l -8 -24 l -24 -8 Z" fill="#fff" stroke="${C.ink}" stroke-width="4"/></g>`;
    // burun + ağız
    o += sh('M 330 366 Q 350 356 370 366 Q 362 386 350 388 Q 338 386 330 366 Z', C.pink);
    if (m > 0.06) o += sh(`M ${326 - m * 8} 404 Q 350 ${410 + m * 46} ${374 + m * 8} 404 Q 350 ${414} ${326 - m * 8} 404 Z`, C.mouthIn) +
      `<ellipse cx="350" cy="${410 + m * 26}" rx="${11 + m * 5}" ry="${4 + m * 8}" fill="${C.tongue}"/>`;
    o += `<path d="M 350 388 Q 350 406 330 410 M 350 388 Q 350 406 370 410" stroke="${C.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    // bıyıklar
    o += `<path d="M 282 400 Q 210 390 118 376 M 282 414 Q 206 418 116 432 M 412 400 Q 490 390 582 376 M 412 414 Q 494 418 584 432" stroke="${C.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    return o;
  };
  window.drawCatHT.C = C;
})();
