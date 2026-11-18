// node render.js <ep> samples t1 t2 ... | node render.js <ep> full
const {chromium}=require('playwright');const fs=require('fs');const {execFileSync}=require('child_process');
(async()=>{const ep=process.argv[2], mode=process.argv[3], dir=`episodes/${ep}`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.error('ERR',e.message));
await p.goto('file://'+process.cwd()+'/player.html?ep='+ep);await p.evaluate(()=>document.fonts.ready);
if(mode==='samples'){const ts=process.argv.slice(4).map(Number);fs.mkdirSync(dir+'/samples',{recursive:true});
 for(const t of ts){await p.evaluate(t=>renderAt(t),t);await p.screenshot({path:`${dir}/samples/t${t}.png`});}}
else{const dur=await p.evaluate(()=>TL.duration);const n=Math.ceil(dur*30);fs.mkdirSync(dir+'/frames',{recursive:true});
 for(let i=0;i<n;i++){await p.evaluate(t=>renderAt(t),i/30);await p.screenshot({path:`${dir}/frames/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:95});}
 execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','30','-i',`${dir}/frames/f%05d.jpg`,'-i',`${dir}/mix.wav`,'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ac','2','-shortest','-movflags','+faststart',`${dir}/${ep}.mp4`]);
 fs.rmSync(dir+'/frames',{recursive:true});console.log('done',ep);}
await b.close();})();
