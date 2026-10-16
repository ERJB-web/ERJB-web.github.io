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

const TYPOS = require("./typologies-multilingues");
const typesFR = [...pages.fr.matchAll(/<span class="type">([^<>]+)<\/span>/g)].map(m=>m[1]);
if(!typesFR.length) erreurs.push("aucun type de recherche trouvé");
for(const code of ["en","es","zh","ar","ru"]){
 const typesTraduits = [...pages[code].matchAll(/<span class="type">([^<>]+)<\/span>/g)].map(m=>m[1]);
 const attendusTypes = typesFR.map(type => TYPOS.traduire(code,type));
 if(JSON.stringify(typesTraduits)!==JSON.stringify(attendusTypes))
   erreurs.push(code+": typologies de recherche non traduites ou ordre incohérent");
 if(typesFR.some(type=>!TYPOS.types[type]?.[code]))
   erreurs.push(code+": une typologie n'est pas couverte dans le lexique multilingue");
}
for(const code of codes){
 if(pages[code].includes("Français canadien"))erreurs.push(code+": ancien libellé français canadien");
 if(!pages[code].includes("#0055a4"))erreurs.push(code+": drapeau français absent");
}


/* Garde-fous complémentaires : les marqueurs techniques ne sont jamais des traductions. */
for (const code of codes) {
  const markup = pages[code]
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const marqueurs=[...markup.matchAll(/(?:>\s*(?:undefined|null|NaN|\[object Object\])\s*<|=\s*["'](?:undefined|null|NaN|\[object Object\])["'])/g)];
  if(marqueurs.length)erreurs.push(code+": valeur de traduction manquante ou invalide ("+marqueurs.length+")");
}
const legendeAxes={
  fr:"Axes principaux et axes secondaires",
  en:"Main and secondary research areas",
  es:"Ejes principales y secundarios",
  zh:"主要与次要研究方向",
  ar:"المحاور البحثية الرئيسية والثانوية",
  ru:"Основные и дополнительные направления исследований"
};
for(const [code,label] of Object.entries(legendeAxes)){
  const html=pages[code],debut=html.indexOf('id="axes" data-salle="axes"');
  const panneau=debut>=0?html.slice(debut,debut+1500):"";
  if(!panneau.includes('<span class="bandeau-legende">'+label+'</span>'))
    erreurs.push(code+": sous-titre des axes de recherche absent ou incorrect");
}
for (const code of ["fr","iu","innu","falc"]) {
  if (!pages[code].includes('data-voix="fr-FR"'))
    erreurs.push(code+": synthèse vocale française non configurée pour la France");
}
if (!pages.fr.includes('property="og:locale" content="fr_FR"'))
  erreurs.push("fr: locale de la version française incorrecte");

console.log(JSON.stringify({versions:rapport,erreurs,traductionsRestantACompleter:["inuktitut","innu-aimun"]},null,2));
process.exitCode=erreurs.length?1:0;
