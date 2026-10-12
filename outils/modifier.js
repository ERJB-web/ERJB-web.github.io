// Applique les modifications de contenu du bundle : node outils/modifier.js <modifs.json>
// Format : { "textes": [{ "fr": "<français actuel>", "nouveau": [fr, en, es, ar, zh] }],
//            "remplacements": [{ "avant": "...", "apres": "...", "fois": n }] }
// Chaque texte doit exister au moins une fois et chaque remplacement exactement « fois » fois.
"use strict";
const fs = require("fs");
const { BUNDLE, appels, ecrireAppel } = require("./textes");

const modifs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
let src = fs.readFileSync(BUNDLE, "utf8");

for (const t of modifs.textes || []) {
  if (t.nouveau.length !== 5) throw new Error(`5 langues attendues : ${t.fr}`);
  const cibles = appels(src).filter((a) => a.args[0] === t.fr);
  if (!cibles.length) throw new Error(`Texte introuvable : ${t.fr}`);
  for (const a of cibles.reverse()) {
    src = src.slice(0, a.debut) + ecrireAppel(t.nouveau) + src.slice(a.fin);
  }
  console.log(`${cibles.length} × ${t.fr.slice(0, 60)}`);
}

for (const r of modifs.remplacements || []) {
  const n = src.split(r.avant).length - 1;
  if (n !== r.fois) throw new Error(`${n} occurrence(s) au lieu de ${r.fois} : ${r.avant.slice(0, 80)}`);
  src = src.split(r.avant).join(r.apres);
  console.log(`${n} × ${r.avant.slice(0, 60)}`);
}

fs.writeFileSync(BUNDLE, src, "utf8");
