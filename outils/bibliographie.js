const notices = require('./bibliographie-site.json');
const labels = {
 fr:['Ressources','Bibliographie','La bibliothèque des savoirs','Toutes les références citées sur le site, réunies en format APA et classées par ordre alphabétique.','Rechercher un auteur, un titre ou une année','références','Aucune référence ne correspond à votre recherche.'],
 en:['Resources','Bibliography','The library of knowledge','All references cited on this website, collected in APA format and alphabetical order.','Search an author, title or year','references','No references match your search.'],
 es:['Recursos','Bibliografía','La biblioteca del conocimiento','Todas las referencias citadas en el sitio, en formato APA y orden alfabético.','Buscar autor, título o año','referencias','No hay referencias para esta búsqueda.'],
 zh:['资源','参考文献','知识图书馆','网站引用的全部参考文献，采用 APA 格式并按字母排序。','搜索作者、标题或年份','条参考文献','未找到相关文献。'],
 ar:['الموارد','المراجع','مكتبة المعرفة','جميع المراجع المذكورة في الموقع، بتنسيق APA ومرتبة أبجديًا.','ابحث عن مؤلف أو عنوان أو سنة','مرجعًا','لا توجد مراجع مطابقة للبحث.'],
 ru:['Ресурсы','Библиография','Библиотека знаний','Все источники сайта в формате APA, в алфавитном порядке.','Поиск по автору, названию или году','источников','Источники не найдены.']
};
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const letter = r => r.citation[0].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
function render(c) {
 const t = labels[c.lang] || labels.fr;
 const groups = new Map();
 notices.forEach(r=>{const k=letter(r);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);});
 const prefix='biblio-'+c.lang+'-';
 return `<div class="logiciels-chapitre bibliographie-complete" data-image="aucune"><h3 class="ressources-chapitre-titre">${t[1]}</h3><header class="biblio-hero"><div><p class="surtitre">${t[2]}</p><p class="intro">${t[3]}</p><p><strong>${notices.length.toLocaleString(c.lang)} ${t[5]}</strong> · APA</p></div><img src="${c.chemin}assets/chapitres/bibliotheque-pantheon.svg" width="800" height="450" alt="${escape(t[2])}" loading="lazy"></header><div class="biblio-outils"><label for="${prefix}recherche">${t[4]}</label><input id="${prefix}recherche" type="search" data-biblio-recherche placeholder="${escape(t[4])}" aria-controls="${prefix}liste"><p class="biblio-resultat" role="status" aria-live="polite" data-biblio-compte data-unite="${t[5]}">${notices.length} ${t[5]}</p><nav class="biblio-alphabet" aria-label="${escape(t[1])}">${[...groups.keys()].map(k=>`<a href="#${prefix+k}">${k}</a>`).join('')}</nav></div><div id="${prefix}liste" class="biblio-liste">${[...groups].map(([k,rows])=>`<div class="biblio-groupe" id="${prefix+k}"><h4>${k}</h4><ul>${rows.map(r=>`<li class="biblio-notice"><span lang="${/\b(the|of|and|for|with)\b/i.test(r.citation)?'en':'fr'}">${escape(r.citation)}</span>${r.href?` <a href="${escape(r.href)}" target="_blank" rel="noopener noreferrer">${escape(r.href)}</a>`:''}</li>`).join('')}</ul></div>`).join('')}</div><p data-biblio-vide hidden>${t[6]}</p></div>`;
}
module.exports={render,labels};
