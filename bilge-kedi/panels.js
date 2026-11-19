// node panels.js <çıktı_klasörü> '<json: [[n,ic,nm,col],...]>'
const { chromium } = require('playwright');
(async () => { const out = process.argv[2], items = JSON.parse(process.argv[3]);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [n, ic, nm, col] of items) {
    await p.goto('file://' + process.cwd() + '/panel.html?' + new URLSearchParams({ n, ic, nm, col }));
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${out}/panel${n - 1}.png`, omitBackground: true });
  } await b.close(); })();
