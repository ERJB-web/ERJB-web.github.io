const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),data={...require('./methodologie-structuree.json'),...require('./methodologie-structuree-autres.json')};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function cartes(items){return '<div class="methodo-grille">'+items.map(s=>{const cut=s.indexOf(':');return '<article class="methodo-item">'+(cut>0?'<strong>'+esc(s.slice(0,cut))+'</strong><p>'+esc(s.slice(cut+1).trim())+'</p>':'<p>'+esc(s)+'</p>')+'</article>';}).join('')+'</div>';}
for(const file of ['index.html','methode-vulgarisee.html','innu/index.html','iu/index.html','en/index.html','es/index.html','zh/index.html','ar/index.html','ru/index.html']){
 const p=path.join(root,file),before=fs.readFileSync(p,'utf8'),dom=new JSDOM(before,{includeNodeLocations:true}),d=dom.window.document;
 const l=Object.keys(data).find(l=>file.startsWith(l+'/'))||'fr',v=data[l],edits=[];
 for(const e of d.querySelectorAll('.these-methode-objectif[data-objectif]')){
  const i=+e.dataset.objectif.slice(1)-1,n=dom.nodeLocation(e),copy=e.cloneNode(true);
  const head=copy.querySelector(':scope > header.methode-objectif-tete');if(!head)throw Error(file+' en-tête manquant');
  const conserves=new Map([...copy.querySelectorAll('.methodo-section')].map(s=>[s.id,[...s.querySelectorAll(':scope>.methodo-restauration,:scope>.methode-rubrique-contenu>.methodo-reperes-restaures,:scope>.methodo-patrimoine')].map(x=>x.outerHTML).join('')]));
  const figures=[...copy.querySelectorAll('figure')].filter(el=>!el.parentElement.closest('figure')).filter(el=>!el.closest('.methodo-patrimoine')).filter(el=>i!==2||!/diapo-(?:17|18)\./.test(el.innerHTML)).map(el=>el.outerHTML);
  const tables=[...copy.querySelectorAll('table')].filter(el=>/score|pondér|collabor|Burt|constraint|weight|matrice|matrix|评分|ترميز|вес/i.test(el.textContent)&&!/prospect|O3-B/i.test(el.textContent)).filter(el=>!el.closest('.methodo-patrimoine')).map(el=>'<div class="methodo-table">'+el.outerHTML+'</div>');
  // Les citations restent dans les phrases ; les notices complètes sont dans Ressources > Bibliographie.
  copy.querySelectorAll(':scope > :not(header)').forEach(el=>el.remove());
  copy.setAttribute('data-cadrage-harmonise','oui');
  if(file.startsWith('innu/')||file.startsWith('iu/'))copy.setAttribute('lang','fr');
  let body='<div class="methode-these-corps"><p class="methodo-statut">'+esc(v.statut)+'</p>';
  v.objectifs[i].forEach((section,j)=>{const no=j+4;
   let contenu=Array.isArray(section)?cartes(section):'<div class="methodo-composantes">'+Object.entries(section).map(([role,items])=>'<section class="methodo-volet" aria-label="'+role+'"><h6>'+role+'</h6>'+cartes(items)+'</section>').join('')+'</div>';
   body+='<section class="methode-rubrique methodo-section" id="methode-o'+(i+1)+'-'+no+'"><h5 class="methode-rubrique-titre"><span>'+String(no).padStart(2,'0')+'</span>'+esc(v.titres[j])+'</h5><div class="methode-rubrique-contenu">'+contenu+'</div>'+(conserves.get('methode-o'+(i+1)+'-'+no)||'')+'</section>';
  });
  if(i===2&&v.precisionsO3)body+='<details class="methodo-doc methodo-precisions"><summary>'+esc({fr:'Précisions du recueil et des indicateurs',en:'Collection and indicator details',es:'Detalles de recogida e indicadores',zh:'采集与指标详情',ar:'تفاصيل الجمع والمؤشرات',ru:'Подробности сбора и показателей'}[l])+'</summary>'+v.precisionsO3.map(t=>'<p>'+esc(t)+'</p>').join('')+'</details>';
  if(figures.length||tables.length)body+='<details class="methodo-doc"><summary>'+esc(v.annexes)+'</summary>'+figures.join('')+tables.join('')+'</details>';
  body+='</div>';head.insertAdjacentHTML('afterend',body);
  edits.push({a:n.startOffset,b:n.endOffset,s:copy.outerHTML});
 }
 let after=before;for(const e of edits.sort((a,b)=>b.a-a.a))after=after.slice(0,e.a)+e.s+after.slice(e.b);
 const css=(file.includes('/')?'../':'')+'assets/methodologie-structuree.css';if(!after.includes('assets/methodologie-structuree.css'))after=after.replace('</head>','<link rel="stylesheet" href="'+css+'">\n</head>');
 fs.writeFileSync(p,after);console.log(file+' : trois objectifs, rubriques 4 à 9, ARS quantitative à deux niveaux.');
}
