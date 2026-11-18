// Bilge Kedi — gözlüklü smokin kedi. drawCat(state) -> SVG <g> string (yerel kutu 700x950).
// state: {blink 0..1, mouth 0..1, tail -1..1, glint 0..1, lookX -1..1, lookY -1..1, ear 0..1, brow -1..1}
(function () {
  const C = {
    fur: '#1c1d2b', furHi: '#3a3d58', white: '#f7f4ee', whiteSh: '#d9d4e8',
    pink: '#ff9fb8', nose: '#ff7f9e', iris1: '#c8f26b', iris2: '#5fbf3a',
    frame: '#f2c14e', frameSh: '#b8862a', bow: '#ff4f6d', bowSh: '#c22c4a', mouth: '#7a2140', tongue: '#ff8fa8'
  };
  function eye(cx, cy, s) {
    const open = Math.max(0.04, 1 - s.blink);
    const px = cx + (s.lookX || 0) * 12, py = cy + (s.lookY || 0) * 10;
    if (open < 0.15) {
      return `<path d="M ${cx - 42} ${cy + 4} Q ${cx} ${cy + 26} ${cx + 42} ${cy + 4}" stroke="${C.white}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    }
    const id = 'clip' + Math.round(cx);
    return `
      <clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="46" ry="${50 * open}"/></clipPath>
      <ellipse cx="${cx}" cy="${cy}" rx="46" ry="${50 * open}" fill="${C.white}"/>
      <g clip-path="url(#${id})">
        <circle cx="${px}" cy="${py}" r="37" fill="url(#irisG)"/>
        <ellipse cx="${px}" cy="${py}" rx="15" ry="27" fill="#0b0b14"/>
        <circle cx="${px - 13}" cy="${py - 15}" r="10" fill="#fff"/>
        <circle cx="${px + 12}" cy="${py + 12}" r="5" fill="#fff" opacity="0.85"/>
        <path d="M ${cx - 50} ${cy - 50 * open} L ${cx + 50} ${cy - 50 * open} L ${cx + 50} ${cy - 50 * open + 14} Q ${cx} ${cy - 50 * open + 22} ${cx - 50} ${cy - 50 * open + 14} Z" fill="${C.fur}" opacity="0.5"/>
      </g>`;
  }
  function lens(cx, cy, s) {
    const g = s.glint || 0;
    return `
      <circle cx="${cx}" cy="${cy}" r="64" fill="rgba(190,225,255,0.14)" stroke="${C.frameSh}" stroke-width="14"/>
      <circle cx="${cx}" cy="${cy}" r="64" fill="none" stroke="${C.frame}" stroke-width="9"/>
      <path d="M ${cx - 40} ${cy - 22} A 46 46 0 0 1 ${cx - 12} ${cy - 46}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.7"/>
      <g opacity="${g}"><path d="M ${cx - 50} ${cy + 30} L ${cx + 30} ${cy - 50} L ${cx + 48} ${cy - 32} L ${cx - 32} ${cy + 48} Z" fill="#fff" opacity="0.55"/>
        <path d="M ${cx + 36} ${cy - 62} l 6 -18 l 6 18 l 18 6 l -18 6 l -6 18 l -6 -18 l -18 -6 Z" fill="#fff"/></g>`;
  }
  window.drawCat = function (s = {}) {
    s = Object.assign({ blink: 0, mouth: 0, tail: 0, glint: 0, lookX: 0, lookY: 0, ear: 0, brow: 0 }, s);
    const t = s.tail, e = s.ear * 10, m = s.mouth, b = s.brow * 8;
    const tailPath = `M 520 800 C ${660 + t * 30} 820 ${720 + t * 60} ${700 - t * 20} ${660 + t * 70} ${560 - t * 10}`;
    const mouthOpen = m > 0.05
      ? `<path d="M ${350 - 18 - m * 6} 398 Q 350 ${404 + m * 34} ${350 + 18 + m * 6} 398 Q 350 ${408} ${350 - 18 - m * 6} 398 Z" fill="${C.mouth}"/>
         <ellipse cx="350" cy="${404 + m * 20}" rx="${10 + m * 4}" ry="${4 + m * 7}" fill="${C.tongue}"/>`
      : '';
    return `
    <defs>
      <radialGradient id="irisG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${C.iris1}"/><stop offset="1" stop-color="${C.iris2}"/></radialGradient>
      <radialGradient id="furG" cx="35%" cy="25%" r="80%"><stop offset="0" stop-color="${C.furHi}"/><stop offset="0.55" stop-color="${C.fur}"/><stop offset="1" stop-color="#11121c"/></radialGradient>
      <linearGradient id="bibG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.white}"/><stop offset="1" stop-color="${C.whiteSh}"/></linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <!-- gölge -->
    <ellipse cx="350" cy="905" rx="260" ry="34" fill="#000" opacity="0.35" filter="url(#soft)"/>
    <!-- kuyruk -->
    <path d="${tailPath}" stroke="${C.fur}" stroke-width="56" fill="none" stroke-linecap="round"/>
    <circle cx="${660 + t * 70}" cy="${560 - t * 10}" r="28" fill="${C.white}"/>
    <!-- gövde -->
    <ellipse cx="350" cy="660" rx="225" ry="235" fill="url(#furG)"/>
    <path d="M 262 470 Q 350 520 438 470 Q 470 650 350 850 Q 230 650 262 470 Z" fill="url(#bibG)"/>
    <!-- patiler -->
    <ellipse cx="268" cy="872" rx="66" ry="40" fill="${C.white}"/>
    <ellipse cx="432" cy="872" rx="66" ry="40" fill="${C.white}"/>
    <path d="M 240 885 v -18 M 268 890 v -20 M 296 885 v -18 M 404 885 v -18 M 432 890 v -20 M 460 885 v -18" stroke="${C.whiteSh}" stroke-width="5" stroke-linecap="round"/>
    <!-- papyon -->
    <g transform="translate(350 488)">
      <path d="M 0 0 L -78 -40 Q -92 0 -78 40 Z" fill="${C.bow}" stroke="${C.bowSh}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M 0 0 L 78 -40 Q 92 0 78 40 Z" fill="${C.bow}" stroke="${C.bowSh}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M -62 -22 L -30 -8" stroke="#ff8ea1" stroke-width="6" stroke-linecap="round"/>
      <path d="M 62 -22 L 30 -8" stroke="#ff8ea1" stroke-width="6" stroke-linecap="round"/>
      <rect x="-20" y="-22" width="40" height="44" rx="12" fill="${C.bowSh}"/>
    </g>
    <!-- kulaklar -->
    <path d="M 160 230 L ${178 - e} ${52 - e} L 300 140 Z" fill="${C.fur}" stroke="${C.fur}" stroke-width="24" stroke-linejoin="round"/>
    <path d="M 192 196 L ${200 - e} ${102 - e} L 268 150 Z" fill="${C.pink}" stroke="${C.pink}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M 540 230 L ${522 + e} ${52 - e} L 400 140 Z" fill="${C.fur}" stroke="${C.fur}" stroke-width="24" stroke-linejoin="round"/>
    <path d="M 508 196 L ${500 + e} ${102 - e} L 432 150 Z" fill="${C.pink}" stroke="${C.pink}" stroke-width="10" stroke-linejoin="round"/>
    <!-- baş -->
    <ellipse cx="350" cy="305" rx="218" ry="192" fill="url(#furG)"/>
    <path d="M 350 190 C 330 255 300 285 252 328 C 214 362 228 440 300 456 Q 350 468 400 456 C 472 440 486 362 448 328 C 400 285 370 255 350 190 Z" fill="${C.white}"/>
    <!-- kaşlar (bilge ifadesi) -->
    <path d="M 225 ${206 + b} Q 268 ${190 - b} 308 ${208 + b}" stroke="${C.white}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M 392 ${208 + b} Q 432 ${190 - b} 475 ${206 + b}" stroke="${C.white}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.85"/>
    <!-- gözler -->
    ${eye(270, 292, s)}${eye(430, 292, s)}
    <!-- yanaklar -->
    <ellipse cx="238" cy="398" rx="30" ry="17" fill="${C.pink}" opacity="0.45"/>
    <ellipse cx="462" cy="398" rx="30" ry="17" fill="${C.pink}" opacity="0.45"/>
    <!-- burun + ağız -->
    <path d="M 332 364 Q 350 356 368 364 Q 360 382 350 384 Q 340 382 332 364 Z" fill="${C.nose}"/>
    ${mouthOpen}
    <path d="M 350 384 Q 350 400 333 403 M 350 384 Q 350 400 367 403" stroke="${C.fur}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- bıyıklar -->
    <g stroke="#e9e6f5" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9">
      <path d="M 285 392 Q 210 380 120 368"/><path d="M 285 404 Q 205 408 118 420"/><path d="M 290 414 Q 225 432 150 462"/>
      <path d="M 415 392 Q 490 380 580 368"/><path d="M 415 404 Q 495 408 582 420"/><path d="M 410 414 Q 475 432 550 462"/>
    </g>
    <!-- gözlük -->
    <path d="M 206 282 L 138 262" stroke="${C.frame}" stroke-width="9" stroke-linecap="round"/>
    <path d="M 494 282 L 562 262" stroke="${C.frame}" stroke-width="9" stroke-linecap="round"/>
    <path d="M 332 286 Q 350 268 368 286" stroke="${C.frame}" stroke-width="9" fill="none" stroke-linecap="round"/>
    ${lens(270, 292, s)}${lens(430, 292, s)}`;
  };
})();
