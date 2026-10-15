"use strict";
const references = require("./methodes-references.json");
module.exports = Object.fromEntries(["fr", "en", "es", "zh", "ar", "ru"].map(code => {
  const texte = require("./methodes/" + code + ".json");
  return [code, { ...texte, items: texte.items.map(m => ({ ...m, illustrations: [], references: m.references.map(cle => references[cle]) })) }];
}));
