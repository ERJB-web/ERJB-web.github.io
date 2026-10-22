/* Formulations scientifiques : une source unique, sans réécriture éditoriale. */
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..'),DATA=require('./formulations-recherche.json');
const LABELS={fr:['Objectif spécifique','Objectif méthodologique','Produits et précisions','Formulations scientifiques exactes'],en:['Specific objective','Methodological objective','Outputs and details','Exact scientific wording'],es:['Objetivo específico','Objetivo metodológico','Productos y detalles','Formulaciones científicas completas'],zh:['具体目标','方法目标','产出与说明','完整科学表述'],ar:['الهدف المحدد','الهدف المنهجي','المخرجات والتفاصيل','الصياغات العلمية الكاملة'],ru:['Конкретная задача','Методологическая задача','Результаты и пояснения','Полные научные формулировки']};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const REPERES={fr:['Revue de la littérature','Étude cartographique et spatiale','Analyse rétrospective des réseaux sociaux'],en:['Literature review','Cartographic and spatial study','Retrospective social network analysis'],es:['Revisión de la literatura','Estudio cartográfico y espacial','Análisis retrospectivo de redes sociales'],zh:['文献综述','制图与空间研究','回顾性社会网络分析'],ar:['مراجعة الأدبيات','دراسة خرائطية ومكانية','تحليل استعادي للشبكات الاجتماعية'],ru:['Обзор литературы','Картографическое и пространственное исследование','Ретроспективный анализ социальных сетей']};
function paragraphe(text,cls){return '<p class="'+cls+'">'+esc(text)+'</p>';}
function synchroniser(file){
 const p=path.join(ROOT,file),before=fs.readFileSync(p,'utf8'),dom=new JSDOM(before,{includeNodeLocations:true}),d=dom.window.document;
 const prefix=file.split('/')[0],partial=['innu','iu'].includes(prefix),lang=partial?'fr':(Object.keys(DATA).includes(prefix)?prefix:'fr'),v=DATA[lang],labels=LABELS[lang];
 const edits=[];
 function inner(e,html){if(!e)return;const n=dom.nodeLocation(e);if(n?.startTag&&n?.endTag)edits.push({a:n.startTag.endOffset,b:n.endTag.startOffset,s:html});}
 function outer(e,html){if(!e)return;const n=dom.nodeLocation(e);edits.push({a:n.startOffset,b:n.endOffset,s:html});}
 d.querySelectorAll('.these-introduction h2').forEach(e=>inner(e,esc(v.titre)));
 d.querySelectorAll('.these-question-principale p,.these-problematique-bandeau p,.question-these').forEach(e=>inner(e,esc(v.question)));
 for(const e of new Set(d.querySelectorAll('.ov-carte[data-objectif],.these-objectifs .objectif-carte[data-objectif]'))){
  const i=+e.dataset.objectif.slice(1)-1,copy=e.cloneNode(true),h=copy.querySelector('.ov-entete h4,h4');if(h)h.textContent=labels[0]+' '+(i+1);
  let para=copy.querySelector('.these-formulation');if(para){para.textContent=v.objectifs[i];const first=para.textContent.split(' ')[0];if(lang!=='zh'){para.innerHTML='<strong>'+esc(first)+'</strong>'+esc(v.objectifs[i].slice(first.length));}
   if(copy.classList.contains('ov-carte')){const prev=para.previousElementSibling;if(prev&&/^1\s*·/.test(prev.textContent.trim()))prev.remove();copy.querySelector('.ov-entete').after(para);}
  }else if(h)h.insertAdjacentHTML('afterend',paragraphe(v.objectifs[i],'these-formulation'));
  const summary=copy.querySelector('.ov-details summary');if(summary)summary.textContent=labels[2];
  outer(e,copy.outerHTML);
 }
 d.querySelectorAll('.these-parcours.these-cartes [data-objectif]').forEach(e=>{const i=+e.dataset.objectif.slice(1)-1;inner(e,'<bdi dir="ltr">O'+(i+1)+'</bdi><strong>'+esc(labels[0])+'</strong><small class="these-formulation">'+esc(v.objectifs[i])+'</small>');});
 for(const e of d.querySelectorAll('.these-methode-objectif[data-objectif]')){
  const i=+e.dataset.objectif.slice(1)-1;
  const head=e.querySelector(':scope > header.methode-objectif-tete'),h=head?.querySelector('h4')||e.querySelector(':scope > h4');
  const html='<header class="methode-objectif-tete"'+(partial?' lang="fr"':'')+'><h4 class="titre-bloc"><span class="objectif-code">O'+(i+1)+'</span> '+esc(REPERES[lang][i])+'</h4>'+paragraphe(v.methodologiques[i],'methodo-formulation-officielle')+'</header>';
  if(head)outer(head,html);else if(h)outer(h,html);else throw Error(file+' : début de méthode absent O'+(i+1));
 }
 d.querySelectorAll('.these-methode-parcours [data-objectif]').forEach(e=>{const i=+e.dataset.objectif.slice(1)-1;const t=e.querySelector('.these-parcours-texte');if(t)inner(t,esc(REPERES[lang][i]));});
 d.querySelectorAll('.ds-etape').forEach((e,i)=>{inner(e,'<span class="ds-etape-kicker">O'+(i+1)+'</span><strong>'+esc(REPERES[lang][i])+'</strong>');});
 const ordered=edits.sort((a,b)=>a.a-b.a);for(let i=1;i<ordered.length;i++)if(ordered[i].a<ordered[i-1].b)throw Error('Retouches imbriquées : '+file);
 let after=before;for(const c of ordered.reverse())after=after.slice(0,c.a)+c.s+after.slice(c.b);
 if(after!==before)fs.writeFileSync(p,after);
 console.log(file+' : titre, question, O1–O3 spécifiques et méthodologiques synchronisés.');
}
function annexeFalc(){const p=path.join(ROOT,'falc/index.html');let s=fs.readFileSync(p,'utf8'),v=DATA.fr;const html='<details id="cadrage-scientifique-exact"><summary>'+LABELS.fr[3]+'</summary><h2>Titre provisoire</h2>'+paragraphe(v.titre,'titre-these-officiel')+'<h3>Question de recherche</h3>'+paragraphe(v.question,'question-these-officielle')+'<h3>Objectifs spécifiques</h3><ol>'+v.objectifs.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol><h3>Objectifs méthodologiques</h3><ol>'+v.methodologiques.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol></details>';
 s=s.includes('id="cadrage-scientifique-exact"')?s.replace(/<details id="cadrage-scientifique-exact">[\s\S]*?<\/details>/,()=>html):s.replace('</main>',html+'</main>');fs.writeFileSync(p,s);}
function harmoniser(){for(const file of ['index.html','methode-vulgarisee.html','innu/index.html','iu/index.html','en/index.html','es/index.html','zh/index.html','ar/index.html','ru/index.html'])synchroniser(file);annexeFalc();}
module.exports=harmoniser;if(require.main===module)harmoniser();
