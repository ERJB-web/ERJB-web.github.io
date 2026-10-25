const notices = [...new Map([...require('./bibliographie-site.json'), ...require('./lacunes-scientifiques-references.json'), ...require('./definition-autonomie-references.json')].map(r => [r.href ? r.href.toLowerCase() : r.citation, r])).values()].sort((a,b)=>a.citation.localeCompare(b.citation,'fr',{sensitivity:'base'}));
const labels = {
 fr:['Ressources','Bibliographie','La bibliothèque des savoirs','Toutes les références citées sur le site, réunies dans la bibliographie générale, par catégorie et par ordre alphabétique.','Rechercher un auteur, un titre ou une année','références','Aucune référence ne correspond à votre recherche.'],
 en:['Resources','Bibliography','The library of knowledge','All references cited on this website, collected in APA format and alphabetical order.','Search an author, title or year','references','No references match your search.'],
 es:['Recursos','Bibliografía','La biblioteca del conocimiento','Todas las referencias citadas en el sitio, en formato APA y orden alfabético.','Buscar autor, título o año','referencias','No hay referencias para esta búsqueda.'],
 zh:['资源','参考文献','知识图书馆','网站引用的全部参考文献，采用 APA 格式并按字母排序。','搜索作者、标题或年份','条参考文献','未找到相关文献。'],
 ar:['الموارد','المراجع','مكتبة المعرفة','جميع المراجع المذكورة في الموقع، بتنسيق APA ومرتبة أبجديًا.','ابحث عن مؤلف أو عنوان أو سنة','مرجعًا','لا توجد مراجع مطابقة للبحث.'],
 ru:['Ресурсы','Библиография','Библиотека знаний','Все источники сайта в формате APA, в алфавитном порядке.','Поиск по автору, названию или году','источников','Источники не найдены.']
};
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const letter = r => r.citation[0].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
const categories = [
 ['scientifique','Littérature scientifique'],
 ['grise','Littérature grise'],
 ['institutionnelle','Rapports institutionnels']
];
function categorie(r) {
 if(r.categorie)return r.categorie;
 const text=r.citation, url=r.href||'';
 // Les articles et ouvrages scientifiques restent scientifiques, même hébergés par une institution.
 if(/Journal|\bBMJ\b|\bJAMA\b|\bLancet\b|\bPLOS\b|\bBMC\b|Scientific Reports|Social Science & Medicine|Annals of|Revue|Health Reports|Rapports sur la santé|Promotion de la santé et prévention|Health Systems in Transition/i.test(text))return 'scientifique';
 if(/^(Agence|Agency|Alliance for Health Policy|Anap|Caisse|Canadian Institute|Centers for Disease|Centre de collaboration|Commissaire|Conseil|Council|Department|Direction|European Commission|Gouvernement|Government|Haute Autorité|Health Canada|Institut|Institute|International Labour|International Organization|Ministère|Ministry|MSSS|National Academies|National Institute|Nations|OCDE|OECD|OMS|Organisation|Organization|Public Health|Québec|Santé Canada|Statistique|Statistics|UNESCO|United Nations|WHO|World Health|Wellcome)/i.test(text)||/\.(?:gouv\.qc\.ca|gc\.ca|gov|gov\.uk)(?:\/|$)|(?:who\.int|inspq\.qc\.ca|csbe\.gouv|quebec\.ca|canada\.ca|cnsa\.fr|anap\.fr|anap\.my|oecd\.org|statcan\.gc|has-sante\.fr)/i.test(url)||/Institut national de santé publique|Statistics Canada|Statistique Canada|rapport institutionnel|International AI Safety Report/i.test(text))return 'institutionnelle';
 if(/doi\.org|pubmed\.ncbi|pmc\.ncbi|sciencedirect|springer|cairn|journals\.|arxiv\.org|frontiersin\.org/i.test(url)||!url||/University Press|Presses universitaires|Presses de l’Université|Routledge|SAGE|Elsevier|Springer|Gallimard|Seuil|Dunod|Pearson|Wiley|La Découverte|Oxford|Cambridge|PUF|McGraw|Addison|CRC Press|Jones & Bartlett|Doubleday|Fayard|Palgrave|Emerald/i.test(text))return 'scientifique';
 return 'grise';
}
function render(c) {
 const t=labels[c.lang]||labels.fr, prefix='biblio-'+c.lang+'-';
 const liste=categories.map(([key,title])=>{
  const rows=notices.filter(r=>categorie(r)===key).sort((a,b)=>a.citation.localeCompare(b.citation,'fr',{sensitivity:'base'}));
  const groups=new Map();rows.forEach(r=>{const k=letter(r);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);});
  return '<section class="biblio-categorie" data-biblio-categorie="'+key+'"><h4>'+title+' <span>('+rows.length+')</span></h4><nav class="biblio-alphabet" aria-label="'+title+'">'+[...groups.keys()].map(k=>'<a href="#'+prefix+key+'-'+k+'">'+k+'</a>').join('')+'</nav>'+[...groups].map(([k,items])=>'<div class="biblio-groupe" id="'+prefix+key+'-'+k+'"><h5>'+k+'</h5><ul>'+items.map(r=>'<li class="biblio-notice"><span lang="'+(/\b(the|of|and|for|with)\b/i.test(r.citation)?'en':'fr')+'">'+escape(r.citation)+'</span>'+(r.href?' <a href="'+escape(r.href)+'" target="_blank" rel="noopener noreferrer">'+escape(r.href)+'</a>':'')+'</li>').join('')+'</ul></div>').join('')+'</section>';
 }).join('');
 return '<div class="logiciels-chapitre bibliographie-complete" data-image="aucune"><h3 class="ressources-chapitre-titre">'+t[1]+'</h3><header class="biblio-hero"><div><p class="surtitre">'+t[2]+'</p><p class="intro">'+t[3]+'</p><p><strong>'+notices.length.toLocaleString(c.lang)+' '+t[5]+'</strong> · APA</p></div><img src="'+c.chemin+'assets/chapitres/bibliotheque-pantheon.svg" width="800" height="450" alt="'+escape(t[2])+'" loading="lazy"></header><div class="biblio-outils"><label for="'+prefix+'recherche">'+t[4]+'</label><input id="'+prefix+'recherche" type="search" data-biblio-recherche placeholder="'+escape(t[4])+'" aria-controls="'+prefix+'liste"><p class="biblio-resultat" role="status" aria-live="polite" data-biblio-compte data-unite="'+t[5]+'">'+notices.length+' '+t[5]+'</p></div><div id="'+prefix+'liste" class="biblio-liste">'+liste+'</div><p data-biblio-vide hidden>'+t[6]+'</p></div>';
}
module.exports={render,labels,categorie};
