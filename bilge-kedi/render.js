// node render.js <ep> samples t1 t2 ...   |   node render.js <ep> full [işçi_sayısı]
// script.json içinde "land": true ise yatay 1920x1080 (player_h.html), değilse dikey 1080x1920.
const { chromium } = require('playwright'); const fs = require('fs'); const { execFileSync } = require('child_process');
(async () => {
  const ep = process.argv[2], mode = process.argv[3], dir = `episodes/${ep}`;
  const SC = JSON.parse(fs.readFileSync(`${dir}/script.json`, 'utf8')), land = !!SC.land;
  const vw = land ? 1920 : 1080, vh = land ? 1080 : 1920, page = SC.v2 ? 'player2.html' : land ? 'player_h.html' : 'player.html';
  const b = await chromium.launch();
  async function open() {
    const p = await b.newPage({ viewport: { width: vw, height: vh } });
    p.on('pageerror', e => console.error('ERR', e.message));
    await p.goto('file://' + process.cwd() + '/' + page + '?ep=' + ep); await p.evaluate(() => document.fonts.ready);
    return p;
  }
  if (mode === 'samples') {
    const p = await open(); const ts = process.argv.slice(4).map(Number); fs.mkdirSync(dir + '/samples', { recursive: true });
    fs.readdirSync(dir + '/samples').forEach(f => fs.unlinkSync(`${dir}/samples/${f}`));
    for (const t of ts) { await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: `${dir}/samples/t${t}.png` }); }
  } else {
    const jobs = +(process.argv[4] || 3); const first = await open();
    const dur = await first.evaluate(() => TL.duration); const n = Math.ceil(dur * 30); fs.mkdirSync(dir + '/frames', { recursive: true });
    const pages = [first]; for (let j = 1; j < jobs; j++) pages.push(await open());
    let done = 0;
    await Promise.all(pages.map(async (p, j) => {
      for (let i = j; i < n; i += jobs) {
        await p.evaluate(t => renderAt(t), i / 30);
        await p.screenshot({ path: `${dir}/frames/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94 });
        if (++done % 600 === 0) console.log('kare', done, '/', n);
      }
    }));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', `${dir}/frames/f%05d.jpg`, '-i', `${dir}/mix.wav`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-shortest', '-movflags', '+faststart', `${dir}/${ep}.mp4`]);
    fs.rmSync(dir + '/frames', { recursive: true }); console.log('done', ep);
  }
  await b.close();
})();
