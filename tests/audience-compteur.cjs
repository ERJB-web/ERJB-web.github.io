const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom'),{webcrypto}=require('node:crypto');
const script=fs.readFileSync(require.resolve('../assets/audience.js'),'utf8');
const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replaceAll('-','');
const valeurs=new Map([['erjbweb-unique-browser-day-'+date,27]]);
async function essai(refus=false,connu=false){
 const dom=new JSDOM('<section class="audience-compteur"><b data-audience-total="visiteurs">—</b><b data-audience-total="villes">—</b><b data-audience-total="pays">—</b></section>',{url:'https://erjb-web.github.io/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,appels=[];Object.defineProperty(w,'crypto',{value:webcrypto});w.TextEncoder=TextEncoder;w.AbortSignal=AbortSignal;
 if(refus)w.localStorage.setItem('eb-audience-refusee','1');if(connu)w.localStorage.setItem('eb-visiteur-public-'+date,'1');
 w.fetch=async url=>{appels.push(url);if(url.startsWith('https://ipwho.is/'))return{ok:true,json:async()=>({success:true,city:'Montréal',region_code:'QC',country_code:'CA'})};const u=new URL(url),parts=u.pathname.split('/'),action=parts.at(-2),key=parts.at(-1);if(action==='hit')valeurs.set(key,(valeurs.get(key)||0)+1);return{ok:valeurs.has(key),json:async()=>({value:valeurs.get(key)})};};
 w.eval(script);for(let i=0;i<50;i++){await new Promise(r=>setTimeout(r,10));if(refus||w.document.querySelector('[data-audience-total="villes"]').textContent!=='—')break;}
 const chiffres=Object.fromEntries([...w.document.querySelectorAll('[data-audience-total]')].map(e=>[e.dataset.audienceTotal,e.textContent]));w.close();return{appels,chiffres};
}
(async()=>{
 const premier=await essai();assert.deepEqual(premier.chiffres,{visiteurs:'28',villes:'1',pays:'1'});
 const second=await essai(false,true);assert.equal(second.chiffres.visiteurs,'28','Un navigateur connu ne réincrémente pas le total');assert.equal(second.chiffres.villes,'1','Une ville déjà représentée ne compte pas deux fois');assert.equal(second.chiffres.pays,'1');
 assert(!premier.appels.filter(u=>u.includes('countapi')).some(u=>u.includes('Montr')||u.includes('QC')),'Les noms de lieux ne sont pas envoyés à CountAPI');
 const refuse=await essai(true);assert.equal(refuse.appels.length,0,'Le refus bloque les appels du compteur et de localisation');
 const ancien=process.env.SOURCE_DATE_EPOCH;process.env.SOURCE_DATE_EPOCH=String(Date.parse('2026-10-23T02:00:00Z')/1000);assert.equal(require('../outils/publication-site.cjs').datePublication(),'2026-10-22');if(ancien===undefined)delete process.env.SOURCE_DATE_EPOCH;else process.env.SOURCE_DATE_EPOCH=ancien;
 console.log('Compteur : agrégation, absence de double compte, refus et date de publication vérifiés.');
})().catch(e=>{console.error(e);process.exitCode=1;});
