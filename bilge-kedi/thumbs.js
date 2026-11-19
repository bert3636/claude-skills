const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
for(const k of ['derleme','yarisma','masal']){await p.goto('file://'+process.cwd()+'/thumbs.html?k='+k);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:`episodes/${k}/kapak_big.png`});}
await b.close();})();
