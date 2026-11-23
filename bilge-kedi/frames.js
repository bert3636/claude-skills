const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('ERR',e.message));
for(const f of (process.argv[2]||'1,2,3,4,5').split(',').map(Number)){await p.goto('file://'+process.cwd()+'/frames.html?f='+f);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`/tmp/claude-0/-home-user-claude-skills/798c5084-3aac-5e10-b947-7d85f2990f19/scratchpad/stil${f}.png`});}
await b.close();})();
