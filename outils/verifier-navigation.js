"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.join(__dirname,"..");
const obsolete=/(?:rubriques-(?:console|nav|pagination|progression|choix)|rubrique-(?:entete|icone|libelle|direction|etape|precedente)|data-rubrique-(?:select|pas|compteur|progression)|salle-(?:onglets|progres)|data-suivante|navigation-rubriques|ongletsRubriques|(?:Parcours de lecture|Reading path)01\s*\/)/;
const navigationCSS=/\.(?:salle-(?:barre|actions)|gab-(?:barre|lecture(?!-integrale)|tous|fleche(?:-[\w-]+)?|actuel|segments|porte-nom|sous-categorie))(?![\w-])/;
function verifierNavigation(){
  let files=0;const errors=[];
  function visit(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","__pycache__"].includes(entry.name))continue;
    const file=path.join(dir,entry.name),rel=path.relative(root,file).split(path.sep).join("/");
    if(entry.isDirectory()){visit(file);continue;}
    if(!/\.(?:html|css|js|cjs|mjs|json|ya?ml|py)$/.test(entry.name)||rel==="outils/verifier-navigation.js")continue;
    const text=fs.readFileSync(file,"utf8");files++;
    if(obsolete.test(text))errors.push(rel+" : ancien code de navigation");
    if(rel.endsWith(".html"))for(const style of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)){
      if(navigationCSS.test(style[1]))errors.push(rel+" : style de navigation intégré à la page");
    }
    if(rel.startsWith("assets/")&&rel.endsWith(".css")&&rel!=="assets/navigation-chapitres.css"&&navigationCSS.test(text))errors.push(rel+" : styles de navigation hors de la feuille commune");
    if(rel.endsWith(".html")&&text.includes('id="salle"')){
      for(const asset of ["gabarit-salles.css","navigation-chapitres.css","chapitres/catalogue.js","gabarit-salles.js"]){
        const anglais=rel.startsWith("en/")&&asset.endsWith(".js")?"assets/"+asset.replace(/([^/]+)$/,"en-$1")+"?":null;
        const occurrences=text.split("assets/"+asset+"?").length-1+(anglais?text.split(anglais).length-1:0);
        if(occurrences!==1)errors.push(rel+" : chargement unique manquant pour "+asset);
      }
    }
  }}
  visit(root);assert.deepEqual(errors,[],errors.join("\n"));
  console.log(`Navigation : ${files} fichiers audités, aucun menu abandonné, une feuille commune.`);
}
module.exports={verifierNavigation};
if(require.main===module)verifierNavigation();
