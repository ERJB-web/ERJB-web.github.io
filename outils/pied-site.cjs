const {JSDOM}=require('jsdom');
const publication=require('./publication-site.cjs');
function transformer(html,prefixe=''){
 return html.replace(/<style id="pied-compact-professionnel-20261019">[\s\S]*?<\/style>/g,'').replace(/<footer\b[^>]*class="[^"]*\bpied\b[^"]*"[^>]*>[\s\S]*?<\/footer>/g,balise=>{
  const fragment=JSDOM.fragment(balise),pied=fragment.querySelector('footer'),barre=pied.querySelector('.pied-barre');
  if(!barre)return balise;
  const date=publication.datePublication(),copyright=barre.querySelector('.pied-copyright');
  if(copyright)copyright.innerHTML='<span>© '+date.slice(0,4)+' <a href="'+prefixe+'informations-site.html">Éric Bernier</a><span class="pied-separateur"> · </span><span class="pied-date">Dernière mise à jour : <time datetime="'+date+'">'+publication.libelle(date)+'</time></span></span>';
  if(copyright){const note=fragment.ownerDocument.createElement('small');note.className='pied-attribution';note.textContent=require('./usage-ia.json').site;copyright.append(note);}
  barre.querySelectorAll('.pied-liens,.pied-haut,.audience-compteur').forEach(e=>e.remove());
  pied.querySelectorAll('.compteur-jour').forEach(e=>e.remove());
  barre.insertAdjacentHTML('beforeend','<section class="audience-compteur" aria-label="Audience du jour" title="Estimations journalières des navigateurs et des lieux représentés. Les lieux sont recensés depuis le 22 octobre 2026. Les préférences de non-suivi sont respectées."><div class="audience-periode"><span class="audience-voyant" aria-hidden="true"></span>Aujourd’hui</div><dl><div><dt>Visiteurs</dt><dd data-audience-total="visiteurs">—</dd></div><div><dt>Villes</dt><dd data-audience-total="villes">—</dd></div><div><dt>Pays</dt><dd data-audience-total="pays">—</dd></div></dl></section>');
  pied.setAttribute('aria-label','Publication et audience');return pied.outerHTML;
 });
}
module.exports=transformer;
