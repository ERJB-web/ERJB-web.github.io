// Exécute le vrai générateur en mémoire : aucun fichier publié n'est réécrit.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),file=path.join(root,'outils/construire.js');
const localRequire=createRequire(file),writes=new Map();
const mockFS=new Proxy(fs,{get(target,key){
  if(key==='writeFileSync')return(p,s)=>writes.set(path.resolve(p),String(s));
  if(key==='mkdirSync')return()=>{};
  return target[key];
}});
const isolatedRequire=id=>id==='fs'?mockFS:id==='./harmoniser-typographie'?()=>{}:localRequire(id);
vm.runInNewContext(fs.readFileSync(file,'utf8'),{require:isolatedRequire,__dirname:path.dirname(file),console:{log(){}},module:{exports:{}},exports:{},process},{filename:file});
const config=require('../outils/chapitres-these.json');
assert.deepEqual(config.chapitres.flatMap(c=>c.sources).sort((a,b)=>a-b),Array.from({length:11},(_,i)=>i),'All source blocks retained exactly once');
for(const lang of ['','en','es','zh','ar','ru','iu','innu']){
 const html=writes.get(path.join(root,lang,'index.html'));assert(html,lang||'fr');
 assert(html.includes('130 000 $'),'Doctoral funding is retained in every complete or partial edition');
 const current=html.slice(html.indexOf('data-rubriques="these"'));
 const ids=[...current.matchAll(/class="chapitre-source"[^>]*data-rubrique="([^"]+)"/g)].slice(0,6).map(m=>m[1]);
 assert.deepEqual(ids,config.chapitres.map(c=>c.id));
 for(const asset of ['gabarit-salles.css','navigation-chapitres.css','chapitres/catalogue.js','gabarit-salles.js'])assert.equal(html.split('assets/'+asset+'?').length-1,1,asset);
 assert(html.indexOf('assets/site.js?')<html.indexOf('assets/gabarit-salles.js?'),'Controller loads after router');
}
console.log('Générateur : huit éditions, six chapitres, chargement commun, aucune écriture sur les pages publiées.');
