/* Retouches visuelles : conserver ce fichier et edition-locale-donnees.js lors des régénérations. */
(()=>{
function apply(doc,changes,imageURL){
 for(const p of changes||[]){
  let el;try{el=(p.targetId&&doc.querySelector('[data-local-target="'+p.targetId+'"]'))||doc.querySelector(p.selector)}catch{continue}if(!el)continue;if(p.targetId)el.dataset.localTarget=p.targetId;
  if(p.original!==undefined&&el.textContent!==p.original&&el.textContent!==p.text)continue;
  if(p.html!==undefined){if(el.innerHTML!==p.html&&el.innerHTML!==p.originalHTML)continue;if(el.innerHTML!==p.html)el.innerHTML=p.html}
  if(p.text!==undefined&&el.textContent!==p.text)el.textContent=p.text;
  if(p.color&&el.style.color!==p.color)el.style.color=p.color;
  if(p.background&&el.style.backgroundColor!==p.background)el.style.backgroundColor=p.background;
  for(const [key,value] of Object.entries(p.styles||{})){if(['color','background-color','font-family','font-size','font-weight','font-style','text-decoration','text-align','width','max-width','height','display','margin-left','margin-right','float','clear'].includes(key)&&el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value,'important')}
  if(p.href!==undefined&&el.getAttribute('href')!==p.href)el.setAttribute('href',p.href);
  if(p.src){el.removeAttribute('srcset');if(el.parentElement?.tagName==='PICTURE')el.parentElement.querySelectorAll('source').forEach(s=>s.removeAttribute('srcset'));if(el.getAttribute('src')!==(imageURL?imageURL(p.src):p.src))el.setAttribute('src',imageURL?imageURL(p.src):p.src)}
  if(p.alt!==undefined&&el.getAttribute('alt')!==p.alt)el.setAttribute('alt',p.alt);
  if(p.hidden)el.hidden=true;
  if(p.moveBefore){const anchor=doc.querySelector(p.moveBefore);if(anchor&&anchor!==el&&el.nextElementSibling!==anchor)anchor.before(el)}
  if(p.moveAfter){const anchor=doc.querySelector(p.moveAfter);if(anchor&&anchor!==el&&el.previousElementSibling!==anchor)anchor.after(el)}
  if(p.add?.type==='table'&&!doc.querySelector('[data-local-add="'+p.id+'"]')){const table=doc.createElement('table');table.dataset.localAdd=p.id;table.style.cssText='width:100%;border-collapse:collapse;margin:16px 0';const tbody=doc.createElement('tbody');for(let r=0;r<Math.min(30,p.add.rows);r++){const tr=doc.createElement('tr');for(let c=0;c<Math.min(12,p.add.cols);c++){const cell=doc.createElement(r===0?'th':'td');cell.textContent=r===0?'En-tête '+(c+1):'Texte';cell.style.cssText='border:1px solid #a8b9c0;padding:10px;text-align:left';tr.append(cell)}tbody.append(tr)}table.append(tbody);el.after(table);continue}
  if(p.add&&!doc.querySelector('[data-local-add="'+p.id+'"]')){const n=doc.createElement(({image:'img',video:'video',embed:'iframe',h2:'h2',h3:'h3',quote:'blockquote'})[p.add.type]||'p');n.dataset.localAdd=p.id;if(['image','video'].includes(p.add.type)){n.src=imageURL?imageURL(p.add.src):p.add.src;if(p.add.type==='image')n.alt=p.add.alt||'';else{n.controls=true;n.preload='metadata'}n.style.maxWidth='100%'}else if(p.add.type==='embed'){n.src=p.add.src;n.title=p.add.alt||'Vidéo';n.allowFullscreen=true;n.setAttribute('loading','lazy');n.style.cssText='display:block;width:100%;aspect-ratio:16/9;border:0'}else n.textContent=p.add.text;el.after(n)}
 }
}
window.EditionLocale={apply};
if(window.__EDITION_LOCALE__){const start=()=>{const changes=window.__EDITION_LOCALE__.pages[location.pathname.endsWith('/')?location.pathname+'index.html':location.pathname];if(!changes)return;let queued=false;const update=()=>apply(document,changes);update();new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;update()})}}).observe(document.body,{childList:true,subtree:true});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start()}
})();
