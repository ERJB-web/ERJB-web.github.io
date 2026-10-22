"use strict";
/* Contrôle de non-régression du chapitre Méthodologie.
   Le test examine les fichiers publiés, sans les modifier. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const page = read("index.html");
const scripts = read("assets/site.js");
const gabarit = read("assets/gabarit-salles.js");
const style = read("assets/methodologie-audit-20261022.css");
const typo = read("assets/typographie.css");
const gallery = JSON.parse(read("assets/these/o2-galerie/index.json"));
const labels = [
  ["04", "Population à l’étude"],
  ["05", "Échantillonnage"],
  ["06", "Collecte de données"],
  ["07", "Analyse des données"],
  ["08", "Intégration des données"],
  ["09", "Limitations"]
];
let checks = 0;
for (const n of [1, 2, 3]) {
  const start = page.indexOf('id="these-methode-o' + n + '"');
  assert(start >= 0, "Objectif O" + n + " absent");
  const end = n < 3 ? page.indexOf('id="these-methode-o' + (n + 1) + '"', start) : page.length;
  let previous = start;
  for (const [numero, titre] of labels) {
    const section = 'id="methode-o' + n + '-' + numero[1] + '"';
    const pos = page.indexOf(section, start);
    assert(pos > previous && pos < end, "Rubrique manquante ou dans le désordre : O" + n + "/" + numero);
    const local = page.slice(pos, pos + 400);
    assert(local.includes(titre), "Titre incohérent : O" + n + "/" + numero);
    previous = pos;
    checks++;
  }
}
assert.equal(gallery.planches.length, 48, "Galerie O2 : 48 planches requises");
assert.equal(new Set(gallery.planches.map(x => x.id)).size, 48, "Identifiants de planches répétés");
for (const planche of gallery.planches) {
  for (const key of ["image", "original"]) {
    assert(planche[key] && fs.existsSync(path.join(__dirname, "..", planche[key])),
      "Illustration manquante : " + planche.id + " / " + key);
    checks++;
  }
}
assert(scripts.includes('first.before(intro)'), "Essai O1 non placé avant la première rubrique");
assert(scripts.includes('exemples?.querySelector(".o1-protocole.o1-compact")'),
  "Critères exploratoires O1 non récupérés dans la zone initiale");
assert(scripts.includes('destination.replaceWith(capture)'),
  "Capture O1 originale non déplacée : risque de doublon");
assert(gabarit.includes('tete.insertAdjacentElement("afterend",panneau)'),
  "Étude exploratoire O2 non placée après le titre d’objectif");
assert(page.includes("Réseaux intersectoriels entiers par profil et par territoire de CLSC"),
  "Réseaux entiers par profil O3 absents");
assert(page.includes("Réseaux égocentrés à partir des CLSC"),
  "Réseaux égocentrés CLSC O3 absents");
assert(page.includes("Un questionnaire relationnel unique"),
  "Instrument quantitatif rétrospectif O3 absent");
assert(!typo.includes("text-align:justify"), "Justification étirant les mots encore présente");
for (const [id, hex] of [["O1", "#427b26"], ["O2", "#167d83"], ["O3", "#245f9f"]]) {
  assert(style.includes('data-produit="' + id + '"]') && style.includes("--produit-couleur:" + hex),
    "Code couleur du parcours non défini : " + id);
}
console.log("Méthodologie : " + checks + " contrôles de rubriques et d'illustrations réussis ;");
console.log("essais O1/O2, échelles O3, couleurs et typographie vérifiés.");
