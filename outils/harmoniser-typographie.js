// Charge la charte en dernier sur toutes les pages, y compris les outils autonomes.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const RACINE = path.join(__dirname, "..");
function harmoniser({ check = false } = {}) {
  const version = crypto.createHash("sha256").update(fs.readFileSync(path.join(RACINE, "assets/typographie.css"))).digest("hex").slice(0, 10);
  let pages = 0;
  const divergences = [];
  function parcourir(dossier) {
    for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
      if ([".git", "node_modules"].includes(entree.name)) continue;
      const fichier = path.join(dossier, entree.name);
      if (entree.isDirectory()) { parcourir(fichier); continue; }
      if (!entree.name.endsWith(".html")) continue;
      const avant = fs.readFileSync(fichier, "utf8");
      // Les fragments éditoriaux héritent de la feuille de leur page hôte.
      if (!/<(?:!doctype|html|head)\b/i.test(avant)) continue;
      if (!/<\/head\s*>/i.test(avant)) throw new Error(`En-tête HTML absent : ${fichier}`);
      const relatif = path.relative(path.dirname(fichier), path.join(RACINE, "assets/typographie.css")).split(path.sep).join("/");
      const lien = `<link rel="stylesheet" href="${relatif}?v=${version}">`;
      const apres = avant.replace(/<link\b[^>]*href=["'][^"']*\bassets\/typographie\.css(?:\?[^"']*)?["'][^>]*>\s*/gi, "").replace(/<\/head\s*>/i, `${lien}\n</head>`);
      pages++;
      if (avant !== apres) {
        divergences.push(path.relative(RACINE, fichier));
        if (!check) fs.writeFileSync(fichier, apres);
      }
    }
  }
  parcourir(RACINE);
  if (check && divergences.length) throw new Error(`Charte absente, périmée ou mal placée : ${divergences.join(", ")}. Exécuter node outils/harmoniser-typographie.js`);
  console.log(`Typographie commune : ${pages} pages, ${check ? "contrôle réussi" : divergences.length + " mises à jour"}.`);
}
module.exports = harmoniser;
if (require.main === module) harmoniser({ check: process.argv.includes("--check") });
