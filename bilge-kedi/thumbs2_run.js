// node thumbs2_run.js [k...]  -> episodes/<k>/kapak.jpg
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1920,height:1920}});await p.goto('file://'+__dirname+'/thumbs2.html?k=istasyon');
const all=await p.evaluate(()=>THUMBS);const want=process.argv.slice(2);
for(const [k,land] of all){if(want.length&&!want.includes(k))continue;
 await p.setViewportSize(land?{width:1920,height:1080}:{width:1080,height:1920});
 await p.goto('file://'+__dirname+'/thumbs2.html?k='+k);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
 await p.screenshot({path:`${__dirname}/episodes/${k}/kapak.jpg`,type:'jpeg',quality:90});console.log(k);}
await b.close();})();
