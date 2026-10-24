/* Régression du cadrage scientifique de l'édition française active.
   Les autres langues restent temporairement suspendues : ne pas exiger leur
   ancien contenu ou leurs anciennes diapositives. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const forms = require('../outils/formulations-recherche.json');
const fr = forms.fr;

assert.match(fr.methodologiques[0], /Revue de la littérature afin d’identifier les différentes configurations/);
assert.match(fr.methodologiques[1], /Cartographie spatiale des ressources intersectorielles/);
assert.match(fr.methodologiques[1], /distribution territoriale, leur complémentarité et leur accessibilité géographique/);
assert.match(fr.methodologiques[2], /Analyse rétrospective des réseaux sociaux/);

for (const file of ['index.html', 'methode-vulgarisee.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8').replace(/<\/?abbr\b[^>]*>/g, '');
  const intro = html.match(/<div class="colonne-texte these-introduction these-entete">[\s\S]*?<\/nav>/)?.[0];
  assert.ok(intro, file + ' : introduction et parcours des objectifs');
  assert.ok(intro.includes('<h2>' + fr.titre + '</h2>'), file + ' : titre intégral');
  assert.ok(intro.includes('<p class="these-formulation">' + fr.question + '</p>'), file + ' : question intégrale');
  if(file==='methode-vulgarisee.html'){
    assert.equal((html.match(/data-vulgarisation-affinee="oui"/g)||[]).length,6,'Six chapitres vulgarisés actualisés');
    assert.ok(html.includes('Les points représentent des organisations, jamais des personnes.'),'Unité d’analyse respectée dans la vulgarisation');
    continue;
  }
  const methode = new JSDOM(html).window.document.querySelector('.these [data-rubrique="methodes"] .chapitre-contenu');
  assert.ok(methode, 'Chapitre méthodologique présent');
  assert.doesNotMatch(methode.textContent, /soins primaires|besoins sociaux et de soins de santé concomitants|chronologies propres aux situations/);
  assert.ok(![...methode.querySelectorAll('h4,h5,h6')].some(h => h.textContent.includes('?')), 'Titres descriptifs, sans questions');
  for (const section of methode.querySelectorAll('.methodo-section')) {
    assert.ok(section.querySelector(':scope > h5 + p[data-guide-methodologie="introduction"]'), section.id + ' : introduction après le titre');
    assert.ok(section.querySelector(':scope > p[data-guide-methodologie="transition"]'), section.id + ' : transition visible');
    assert.ok(section.querySelector('details .ms-protocol-context'), section.id + ' : précisions scientifiques conservées');
  }
  assert.equal(methode.querySelectorAll('.methodo-section').length, 18, 'Six rubriques pour chacun des trois objectifs');
  assert.match(methode.querySelector('[data-produit="O2"] p').textContent, /^Atlas de cartes des ressources intersectorielles mobilisables/);
  const objectifsActifs = fr.objectifs;
  for (let i = 0; i < 3; i++) {
    const id = 'O' + (i + 1);
    const button = intro.match(new RegExp('<button\\b[^>]*data-objectif="' + id + '"[^>]*>[\\s\\S]*?<\\/button>'))?.[0];
    assert.ok(button && button.includes(objectifsActifs[i]), file + ' : objectif spécifique ' + id);
    const start = html.indexOf('id="these-methode-o' + (i + 1) + '"');
    const end = i < 2 ? html.indexOf('id="these-methode-o' + (i + 2) + '"', start + 1) : html.length;
    assert.ok(start !== -1 && end > start, file + ' : section méthodologique ' + id);
    const method = html.slice(start, end);
    assert.ok(method.includes('<p class="methodo-formulation-officielle">' + fr.methodologiques[i] + '</p>'), file + ' : formulation méthodologique intégrale ' + id);
    const rubriques = [...method.matchAll(/<section class="[^"]*\bmethodo-section\b[^"]*"[^>]*>\s*<h5 class="[^"]*"><span>(\d{2})<\/span>/g)].map(m => m[1]);
    assert.deepEqual(rubriques, ['01', '02', '03', '04', '05', '06'], file + ' : six rubriques numérotées ' + id);
    if (i === 2) {
      assert.ok(!method.includes('class="methodo-volet"'), file + ' : pas de volet qualitatif distinct');
      assert.ok(method.includes('Brewster et al., 2019'), file + ' : référence auteur-année');
    }
  }
  assert.ok(html.includes('https://doi.org/10.1111/1475-6773.13206'), file + ' : référence complète en bibliographie');
}
for (const lang of ['en', 'es', 'zh', 'ar', 'ru', 'innu', 'iu']) {
  const html = fs.readFileSync(path.join(root, lang, 'index.html'), 'utf8');
  assert.ok(html.includes('noindex,follow') && html.includes('location.replace'), lang + ' : redirection vers le français et exclusion de l’indexation');
}
for (const [number, expected] of [[1, fr.titre], [11, fr.methodologiques[0]], [13, fr.methodologiques[1]], [24, fr.objectifs[0]]]) {
  const file = path.join(root, 'assets/these/diapos/diapo-' + String(number).padStart(2, '0') + '.svg');
  const svg = fs.readFileSync(file, 'utf8');
  assert.ok(svg.startsWith('<svg') && svg.includes('</svg>'), file + ' : diapositive française valide');
  assert.ok(svg.includes(expected), file + ' : formulation complète dans la diapositive');
}
console.log('Cadrage exact : deux pages françaises, O1–O3, 18 rubriques, sept langues suspendues et diapositives françaises contrôlées.');
