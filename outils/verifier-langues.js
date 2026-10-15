"use strict";
// Vérifie la couverture de contenu sans confondre accès complet et traduction complète.
// Usage : node outils/verifier-langues.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const codes = ["fr","en","es","zh","ar","ru","iu","innu","falc"];
const lire = code => fs.readFileSync(path.join(root,code === "fr" ? "" : code,"index.html"),"utf8");
const pages = Object.fromEntries(codes.map(code=>[code,lire(code)]));
const salles = html => [...html.matchAll(/<section\b[^>]*data-salle="([^"]+)"/g)].map(m=>m[1]);
const attendues = salles(pages.fr);
const erreurs = [];
const rapport = codes.map(code=>{
 const html = pages[code], ids=salles(html), adaptee=code==="falc", partielle=["iu","innu"].includes(code);
 if(!adaptee && JSON.stringify(ids)!==JSON.stringify(attendues))erreurs.push(code+": salles absentes ou ordre différent");
 const doclang=(html.match(/<html\b[^>]*lang="([^"]+)"/)||[])[1];
 const attendu=partielle||adaptee?"fr":code==="zh"?"zh-Hans":code;
 if(doclang!==attendu)erreurs.push(code+": langue du contenu incorrecte");
 if(partielle && (!html.includes('data-traduction="partielle"')||!html.includes('class="edition-linguistique"')))erreurs.push(code+": traduction partielle non indiquée");
 if(code==="ar"&&!/<html[^>]*dir="rtl"/.test(html))erreurs.push("ar: direction de lecture incorrecte");
 const reperes=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 const repetitions=[...new Set(reperes.filter((x,i)=>reperes.indexOf(x)!==i))];
 if(repetitions.length)erreurs.push(code+": identifiants dupliqués ("+repetitions.join(", ")+")");
 const dossier=path.join(root,code==="fr"?"":code);
 const absents=[...new Set([...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(href=>!href.startsWith("#")&&!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)).map(href=>href.split(/[?#]/)[0]).filter(Boolean).filter(href=>{
  const cible=href.startsWith("/")?path.join(root,href.slice(1)):path.resolve(dossier,href);
  return !fs.existsSync(cible)&&!fs.existsSync(path.join(cible,"index.html"));
 }))];
 if(absents.length)erreurs.push(code+": fichiers liés absents ("+absents.join(", ")+")");
 const etat=adaptee?"adaptation FALC":partielle?"traduction partielle, contenu intégral accessible":"version complète";
 return {code,langueDuContenu:doclang,rubriques:ids.length,etat};
});
console.log(JSON.stringify({versions:rapport,erreurs,traductionsRestantACompleter:["inuktitut","innu-aimun"]},null,2));
process.exitCode=erreurs.length?1:0;
