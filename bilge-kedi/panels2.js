// node panels2.js <out_dir> '<json [[n,t1,t2,ic,col],...]>'
const { chromium } = require('playwright');
(async () => { const out = process.argv[2], items = JSON.parse(process.argv[3]); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [n, t1, t2, ic, col] of items) { await p.goto('file://' + process.cwd() + '/panel2.html?' + new URLSearchParams({ n, t1, t2, ic, col })); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/panel_${n}.png`, omitBackground: true }); } await b.close(); })();
