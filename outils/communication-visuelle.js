"use strict";
// Parcours éditorial : exemples pédagogiques, sans résultats de recherche inventés.
module.exports = {
  icones: [
    '<circle cx="12" cy="9" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M20 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 2 4M4 5a3 3 0 0 0 0 6m-2 4a5 5 0 0 0-2 4"/>',
    '<rect x="3" y="4" width="22" height="20" rx="3"/><path d="M8 10h12M8 15h9M8 20h6"/>',
    '<path d="M4 5h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4V8a3 3 0 0 1 3-3Z"/><path d="M9 10h8M9 14h5m11-4v11l-4-3"/>',
    '<path d="M4 20h20M7 15h14M11 10h6M7 5v19M21 5v19"/><circle cx="14" cy="15" r="3"/>',
    '<circle cx="14" cy="5" r="2"/><path d="M4 10h20M14 8v8m0-4-7 12m7-12 7 12M8 11l6 3 6-3"/>',
    '<path d="M4 5v19h21M8 18l5-6 5 3 6-8M20 7h4v4"/>'
  ],
  langues: Object.fromEntries(["fr","en","es","zh","ar","ru"].map(code=>[code,require("./communication/"+code+".json")]))
};
