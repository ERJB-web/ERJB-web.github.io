// Repère les appels de traduction _("fr","en","es","ar","zh") du bundle.
// node outils/textes.js liste [motif]  : affiche les appels dont le français contient le motif
"use strict";
const fs = require("fs");
const path = require("path");

const BUNDLE = path.join(__dirname, "..", "assets", "app.js");

function litChaine(src, i) {
  const q = src[i];
  if (q !== '"' && q !== "'" && q !== "`") return null;
  let j = i + 1;
  while (j < src.length && src[j] !== q) {
    if (src[j] === "\\") j++;
    else if (q === "`" && src[j] === "$" && src[j + 1] === "{") return null;
    j++;
  }
  const brut = src.slice(i, j + 1);
  return { fin: j + 1, valeur: new Function("return " + brut)() };
}

function appels(src) {
  const res = [];
  const re = /(?<![\w$.])_\(/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + 2;
    const args = [];
    let ok = true;
    for (;;) {
      while (/\s/.test(src[i])) i++;
      const s = litChaine(src, i);
      if (!s) { ok = false; break; }
      args.push(s.valeur);
      i = s.fin;
      while (/\s/.test(src[i])) i++;
      if (src[i] === ",") { i++; continue; }
      if (src[i] === ")") { i++; break; }
      ok = false;
      break;
    }
    if (ok && args.length === 5) res.push({ debut: m.index, fin: i, args });
  }
  return res;
}

function ecrireAppel(args) {
  return "_(" + args.map((a) => JSON.stringify(a)).join(",") + ")";
}

module.exports = { BUNDLE, appels, ecrireAppel };

if (require.main === module && process.argv[2] === "liste") {
  const src = fs.readFileSync(BUNDLE, "utf8");
  const motif = process.argv[3] || "";
  for (const a of appels(src)) {
    if (a.args[0].includes(motif)) console.log(JSON.stringify(a.args));
  }
}
