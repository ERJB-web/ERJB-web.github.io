// Réunit les notices APA présentes dans les sources et les dossiers du site.
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const notices = new Map();
const clean = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/\s+/g, ' ').trim();
function add(text, href = '') {
  text = clean(text);
  if (!/^[^()<>]{2,1000}?(?:\(Eds?\.\)\.\s*)?\((?:1[5-9]\d{2}|20\d{2}|s\.\s?d\.|n\.d\.)(?:,[^)]{0,55})?\)\.\s+.{15}/u.test(text) || text.length > 3500 || /^\d/.test(text)) return;
  const url = (text.match(/https?:\/\/[^\s<>]+/) || [href])[0].replace(/[.,;]$/, '');
  const doi = (url.match(/(?:dx\.)?doi\.org\/(10\..+)/i) || [])[1];
  const key = doi ? 'doi:' + doi.toLowerCase() : text.replace(/https?:\/\/\S+/g, '').toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
  const item = { citation: text.replace(/\s*https?:\/\/\S+/g, '').replace(/\s*(?:doi:\s*10\.\S+|DOI\s*\.)\s*$/i, '').trim(), href: url };
  const old = notices.get(key);
  if (!old || (/et al\./.test(old.citation) && !/et al\./.test(item.citation)) || (old.citation.length < item.citation.length && /et al\./.test(old.citation) === /et al\./.test(item.citation))) notices.set(key, item);
}
function walk(value) {
  if (typeof value === 'string') return add(value);
  if (!value || typeof value !== 'object') return;
  if (value.citation || value.apa) add(value.citation || value.apa, value.href || value.lien || '');
  if (value.authors && value.title && value.year) {
    const r = value;
    add(`${r.authors}${r.editors ? ' (Eds.).' : ''} (${r.year}). ${r.title}. ${r.journal ? `${r.journal}, ${r.volume || ''}${r.issue ? '('+r.issue+')' : ''}${r.pages ? ', '+r.pages : r.article ? ', Article '+r.article : ''}.` : r.publisher ? r.publisher+'.' : ''}`, r.href || '');
  }
  Object.values(value).forEach(walk);
}
const modules = ['contenu','methodologie','methodes-ajouts','posture-recherche','axes-recherche','enseignement-vulgarisation','enseignement-vision','communication-visuelle','vulgarisation-ressources','ia-recherche','these-rubriques','these-cadrage','sna-exemples','ateliers','notions-cles'];
for (const name of modules) walk(require('./'+name));
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (['.git','node_modules','audio','jeu'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (entry.name.endsWith('.json') && !entry.name.startsWith('bibliographie-')) {
      try { walk(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch {}
    } else if (entry.name.endsWith('.html') && !/[/\\](en|es|zh|ru|ar|iu|innu|falc)[/\\]/.test(file)) {
      const html = fs.readFileSync(file, 'utf8').replace(/<section[^>]*class="bibliographie-complete"[\s\S]*?<\/section>/g, '');
      for (const match of html.matchAll(/<(li|p|td)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
        if (/biblio-notice/.test(match[0])) continue;
        add(match[2], (match[2].match(/href="(https?:[^"]+)"/) || [,''])[1]);
      }
    }
  }
}
scan(root);
const complements = require('./bibliographie-complements.json');
Object.values(complements).forEach(r=>add(r.citation,r.href));
const titles = new Map();
for (const r of notices.values()) {
  const match = r.citation.match(/\(((?:1[5-9]|20)\d{2})[^)]*\)\.\s+(.+)/);
  const key = match ? match[1]+'|'+match[2].split(/\.\s/)[0].normalize('NFD').replace(/[^a-zA-Z0-9]/g,'').toLowerCase() : r.citation;
  const old = titles.get(key);
  if (!old) titles.set(key,r);
  else {
    const preferred = /et al\./.test(old.citation) && !/et al\./.test(r.citation) ? r : !/et al\./.test(old.citation) && /et al\./.test(r.citation) ? old : old.citation.length >= r.citation.length ? old : r;
    titles.set(key,{citation:preferred.citation,href:preferred.href || old.href || r.href});
  }
}
const entries = [...titles.values()].map(r=>complements[r.href] || r).sort((a,b) => a.citation.localeCompare(b.citation, 'fr', {sensitivity:'base'}));
fs.writeFileSync(path.join(__dirname, 'bibliographie-site.json'), JSON.stringify(entries, null, 2)+'\n');
console.log(JSON.stringify({references:entries.length,abregees:entries.filter(r=>/et al\./.test(r.citation)).length,sansLien:entries.filter(r=>!r.href).length}));
