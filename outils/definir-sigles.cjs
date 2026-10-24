function definirSigles(zone,entries,lang='fr'){
 const d=zone.ownerDocument,skip='script,style,svg,code,pre,abbr,nav,button,select,option,.bibliographie-complete,.biblio-notice,.gab-sommaire-chapitre';
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const dict=new Map(entries.map(([s,fr,en])=>[s,lang==='en'?en:fr]));
 const pattern=new RegExp('(?<![\\p{L}\\p{N}_-])('+[...dict.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\p{L}\\p{N}_-])','gu');
 const scopes=[...zone.querySelectorAll('.chapitre-contenu')];if(!scopes.length)scopes.push(zone);
 for(const scope of scopes){const defined=new Set([...scope.querySelectorAll('abbr[data-sigle]')].map(e=>e.dataset.sigle));const walker=d.createTreeWalker(scope,4),nodes=[];let n;while(n=walker.nextNode())if(!n.parentElement.closest(skip)&&pattern.test(n.textContent)){nodes.push(n);pattern.lastIndex=0;}
 for(const node of nodes){const txt=node.textContent,parentText=node.parentElement.textContent,fragment=d.createDocumentFragment();let last=0;pattern.lastIndex=0;for(const m of txt.matchAll(pattern)){const sigle=m[0],label=dict.get(sigle),start=m.index;fragment.append(d.createTextNode(txt.slice(last,start)));const abbr=d.createElement('abbr');abbr.title=label;abbr.dataset.sigle=sigle;abbr.textContent=sigle;
 const citation=/^\s*,\s*(?:\d{4}|s\.\s?d\.)/.test(txt.slice(start+sigle.length));const dejaExplicite=parentText.toLocaleLowerCase().includes(label.toLocaleLowerCase())||/\([^)]*$/.test(txt.slice(0,start))&&parentText.toLocaleLowerCase().includes(label.split(',')[0].toLocaleLowerCase());
 if(!defined.has(sigle)&&!citation&&!dejaExplicite){fragment.append(d.createTextNode(label+' ('),abbr,d.createTextNode(')'));defined.add(sigle);}else{fragment.append(abbr);if(!citation||dejaExplicite)defined.add(sigle);}last=start+sigle.length;}fragment.append(d.createTextNode(txt.slice(last)));node.replaceWith(fragment);}
 }
}
module.exports=definirSigles;
