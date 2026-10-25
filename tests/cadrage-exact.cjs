/* Régression du cadrage scientifique de l'édition française active.
   L'anglais est actif ; les autres langues restent temporairement suspendues : ne pas exiger leur
   ancien contenu ou leurs anciennes diapositives. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const forms = require('../outils/formulations-recherche.json');
const fr = forms.fr;

for (const file of ['index.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8').replace(/<\/?abbr\b[^>]*>/g, '');
  const intro = html.match(/<div class="colonne-texte these-introduction these-entete">[\s\S]*?<\/nav>/)?.[0];
  assert.ok(intro, file + ' : introduction et parcours des objectifs');
  assert.ok(intro.includes('<h2>' + fr.titre + '</h2>'), file + ' : titre intégral');
  assert.ok(intro.includes('<p class="these-formulation">' + fr.question + '</p>'), file + ' : question intégrale');
  assert.ok(!html.includes('these-parcours these-cartes') && !html.includes('class="these-devis"'), file + ' : aucun objectif spécifique ni devis dans l’en-tête');
  assert.ok(!/<h4>Objectif spécifique \d/.test(html) && !html.includes('these-produit-cadre'), file + ' : aucun objectif spécifique ni produit attendu');
  assert.equal((html.match(/class="ov-lacune-avant"/g)||[]).length, 3, file + ' : trois lacunes');
  assert.ok(html.includes('class="these-suite-protocole"') && html.includes('Elle sera communiquée une fois officiellement publiée.') && html.includes('href="mailto:eric.bernier.1@umontreal.ca">Écrire un courriel'), file + ' : annonce de la suite et contact');
  assert.equal((html.match(/class="objectif-carte ov-carte ov-carte-lacune"/g)||[]).length, 3, file + ' : lacunes dans leur visuel');
  assert.ok(!html.includes('data-rubrique="methodes"'), file + ' : aucun chapitre méthodologique publié');
}
{
  const html = fs.readFileSync(path.join(root, 'en', 'index.html'), 'utf8');
  assert.ok(html.startsWith('<!DOCTYPE html><html lang="en"') && !html.includes('pause-editions-non-fr'), 'en : édition anglaise active');
  assert.ok(html.includes('assets/en-gabarit-salles.js?'), 'en : contrôleur anglais des salles');
}
for (const lang of ['es', 'zh', 'ar', 'ru', 'innu', 'iu']) {
  const html = fs.readFileSync(path.join(root, lang, 'index.html'), 'utf8');
  assert.ok(html.includes('noindex,follow') && html.includes('location.replace'), lang + ' : redirection vers le français et exclusion de l’indexation');
}
console.log('Cadrage exact : page française, titre, question, lacunes et annonce de la suite, sans objectifs spécifiques ni méthode, édition anglaise active, six langues suspendues.');
