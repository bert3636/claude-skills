(function () {
  const { seg, eo, back, lerp, cl } = K2, P = ST.PAL, z = P.zoom;
  const big = (x, y, s, txt, col = z.sun) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Jost'" font-weight="700" font-size="${s}" fill="${col}">${txt}</text>`;
  const title = txt => `<text x="60" y="262" font-family="'Jost'" font-weight="600" font-size="52" letter-spacing="6" fill="${P.iso.ink}">${txt}</text>`;
  window.EP = {
    caseNo: '14', exhibits: 4, modes: ['dos', 'iso', 'iso', 'zoom', 'zoom', 'dos', 'dos', 'dos'],
    heads: { 0: ['UZAYDA', 'SES?'], 5: ['ŞŞŞT…', 'SESSİZ UZAY'], 6: ['SES HAVA', 'İSTER!'] }, subs: { 0: 'BAĞIRSAN DUYULUR MU?', 5: 'KOCAMAN VE SESSİZ', 6: 'SES DOSYASI' }, bigNum: { 0: '14', 6: '0dB' },
    stage(t, c) {
      const { si, into } = c; let s = '';
      if (si === 1) { const o = { x: 540, y: 860, k: 1.25 }; s += title('SES NASIL GİDER?') + ST.isoBox(-380, -120, 0, 760, 240, 20, '#e8dccb', o);
        const sp = ST.isoP(-330, 0, 80, o); s += `<g transform="translate(${sp[0]} ${sp[1] - 40})"><rect x="-40" y="-60" width="80" height="120" rx="14" fill="${P.dos.ink}"/><circle cy="-20" r="22" fill="#9a9aa8"/><circle cy="34" r="14" fill="#9a9aa8"/></g>`;
        for (let i = 0; i < 14; i++) for (let j = 0; j < 4; j++) { const x0 = -260 + i * 46, push = Math.max(0, Math.sin(t * 6 - i * 0.7)) * 12, p = ST.isoP(x0 + push, -80 + j * 50, 80 + (j % 2) * 20, o);
          s += `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${i % 2 ? '#4D7CFE' : '#3fd8ae'}"/>`; }
        const e = ST.isoP(380, 0, 80, o); s += `<text x="${e[0]}" y="${e[1]}" text-anchor="middle" font-size="90">👂</text>` + ST.pin(e[0] - 140, e[1] + 30, 60, 'HAVA', 'minik parçacıklar', 1); }
      if (si === 2) { const o = { x: 540, y: 860, k: 1.25 }; s += title('DOMİNO GİBİ') + ST.isoBox(-400, -100, 0, 800, 200, 20, '#e8dccb', o);
        const start = c.L[2].start + 0.3;
        for (let i = 0; i < 12; i++) { const fall = cl((t - start - i * 0.14) / 0.2), x = -340 + i * 62;
          const a = ST.isoP(x, 0, 20, o), h = 130, ang = fall * 70;
          s += `<g transform="translate(${a[0]} ${a[1]}) rotate(${ang})"><rect x="-10" y="${-h}" width="22" height="${h}" rx="4" fill="${i % 2 ? '#ff6b5e' : '#ffc84a'}" stroke="${P.iso.ink}" stroke-width="3"/><circle cx="1" cy="${-h * 0.7}" r="4" fill="#fff"/><circle cx="1" cy="${-h * 0.3}" r="4" fill="#fff"/></g>`; } }
      if (si === 3) { s += SP.stars(1080, 1920, 60, 41) + SP.astronaut(380, 760, 1.4, -8, t);
        const p = back(seg(into, 0.6, 1.0)); s += `<g transform="translate(700 470) scale(${p})"><path d="M -150 -90 h 300 a 40 40 0 0 1 40 40 v 100 a 40 40 0 0 1 -40 40 h -200 l -60 50 l 10 -50 h -50 a 40 40 0 0 1 -40 -40 v -100 a 40 40 0 0 1 40 -40 Z" fill="${z.cream}"/>${big(0, 40, 110, 'HEY!', z.night)}</g>`;
        if (into > 1.4) { s += `<g opacity="${seg(into, 1.4, 1.8)}">${big(700, 760, 120, '…', z.mist)}${big(700, 860, 44, 'ses yok, hava yok', z.mist)}</g>`; } }
      if (si === 4) { s += SP.stars(1080, 1920, 60, 43) + SP.astronaut(260, 760, 1.1, -10, t) + SP.astronaut(830, 700, 1.1, 12, t + 1);
        for (let i = 0; i < 6; i++) { const q = (t * 0.6 + i / 6) % 1, x = lerp(330, 760, q); s += `<path d="M ${x} ${640} q 14 26 0 52" stroke="${z.sun}" stroke-width="7" fill="none" opacity="${1 - Math.abs(q - 0.5) * 1.6}" stroke-linecap="round"/><path d="M ${x + 18} ${626} q 22 40 0 80" stroke="${z.sun}" stroke-width="5" fill="none" opacity="${0.7 - Math.abs(q - 0.5)}" stroke-linecap="round"/>`; }
        s += big(540, 330, 72, '📻 telsiz dalgaları', z.cream); }
      if (si === 5) s += `<text x="820" y="880" text-anchor="middle" font-size="260">🤫</text>`;
      if (si === 6) s += `<text x="800" y="880" text-anchor="middle" font-size="230">🔇</text>`;
      return s;
    },
    catPos(c) { if (c.si === 6 || c.si === 5) return { x: 300, y: 1150, s: 0.62 }; },
    cat(st, c) { if (c.si === 3 && c.into > 1.4) { st.brow = 1; st.ear = 0.7; } if (c.si === 5) { st.mouth = Math.min(st.mouth, 0.2); } },
    stamps(c) { return [{ t: c.wt(6, 'çözüldü'), txt: 'ÇÖZÜLDÜ!', x: 690, y: 1200, rot: -12, end: c.sceneStart(7) }]; },
    stickers(c) { return [{ t: 0.5, txt: '🔊?', col: '#ff6f98', y: 560, dx: 330, size: 170 }]; },
  };
})();
