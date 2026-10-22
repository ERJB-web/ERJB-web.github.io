/* Régression : la formulation de l'auteur doit rester intégrale sur chaque support. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),forms=require('../outils/formulations-recherche.json');
assert.equal(forms.fr.methodologiques[1],'Réaliser une étude cartographique et spatiale des ressources mobilisables en première ligne pour répondre aux différents besoins sociaux et de soins de santé concomitants associés aux profils de personnes aînées vivant à domicile afin de caractériser, dans les différents territoires de CLSC, leur distribution, leur disponibilité, leur diversité, leur complémentarité et leur accessibilité territoriale.');
assert.equal(forms.fr.methodologiques[2],'Mener une analyse rétrospective des réseaux sociaux (ARS) intersectoriels mobilisés en première ligne à partir de territoires de CLSC pour répondre aux besoins sociaux et de soins de santé concomitants des différents profils de personnes aînées vivant à domicile, afin de caractériser leur composition, la structure de leurs relations ainsi que la nature et l\'intensité des collaborations entre acteurs.');
const pages=['index.html','methode-vulgarisee.html','en/index.html','es/index.html','zh/index.html','ar/index.html','ru/index.html','innu/index.html','iu/index.html'];
for(const v of Object.values(forms))assert.equal(v.methodologiques[1].includes('O1'),false,'O2 ne réintroduit pas une dépendance à O1');
for(const file of pages){
 const lang=Object.keys(forms).find(l=>file.startsWith(l+'/'))||'fr',v=forms[lang],d=new JSDOM(fs.readFileSync(path.join(root,file),'utf8')).window.document;
 assert.equal(d.querySelector('.these-introduction h2').textContent,v.titre,file+' titre');
 for(const e of d.querySelectorAll('.these-question-principale p,.these-problematique-bandeau p,.question-these'))assert.equal(e.textContent,v.question,file+' question');
 for(let i=0;i<3;i++){
  const card=d.querySelector('.ov-carte[data-objectif="O'+(i+1)+'"],.these-objectifs .objectif-carte[data-objectif="O'+(i+1)+'"]');
  assert.equal(card.querySelector('.these-formulation').textContent,v.objectifs[i],file+' spécifique '+i);
  assert.equal(card.querySelector('.these-formulation').closest('details'),null,file+' formulation spécifique visible');
  const meth=d.querySelector('.these-methode-objectif[data-objectif="O'+(i+1)+'"]');
  assert.equal(meth.querySelector(':scope > header .methodo-formulation-officielle').textContent,v.methodologiques[i],file+' méthodologie '+i);
  const rubriques=[...meth.querySelectorAll(':scope > .methode-these-corps > .methodo-section')];
  assert.equal(rubriques.length,6,file+' six rubriques pour O'+(i+1));
  assert.deepEqual(rubriques.map(e=>e.querySelector('h5 span').textContent),['04','05','06','07','08','09']);
  if(i===2){assert.equal(meth.querySelectorAll('.methodo-volet').length,0,'Pas de second volet qualitatif');assert.ok(meth.querySelector('a[href="https://doi.org/10.1111/1475-6773.13206"]'),'Référence du questionnaire');}
 }
}
const compact=s=>s.replace(/\s+/g,'');
for(const [lang,v]of Object.entries(forms))for(const n of [1,9,10,11,13,16,24,27,28]){
 const file=path.join(root,'assets/these/diapos',lang==='fr'?'':lang,'diapo-'+String(n).padStart(2,'0')+'.svg');
 const d=new JSDOM(fs.readFileSync(file,'utf8'),{contentType:'image/svg+xml'}).window.document;
 const texts=[...d.querySelectorAll('text')].map(e=>compact([...e.querySelectorAll('tspan')].map(x=>x.textContent).join(' ')));
 let expected=n===1?[v.titre]:n===9?[v.question]:n===10?[v.question,...v.objectifs,...v.methodologiques]:[];
 if([11,13,16].includes(n))expected=[v.methodologiques[[11,13,16].indexOf(n)]];
 if([24,27,28].includes(n)){const i=[24,27,28].indexOf(n);expected=[v.objectifs[i],v.methodologiques[i]];}
 for(const value of expected)assert.ok(texts.includes(compact(value)),file+' : formulation SVG intégrale');
}
console.log('Cadrage exact : 9 pages, 54 diapositives linguistiques, formulations visibles et dernière version méthodologique vérifiées.');
