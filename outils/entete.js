// Met à jour l'en-tête et le repli sans JavaScript d'index.html : node outils/entete.js [URL publique]
"use strict";
const fs = require("fs");
const path = require("path");

const FICHIER = path.join(__dirname, "..", "index.html");
const url = (process.argv[2] || "").replace(/\/?$/, "/");
let page = fs.readFileSync(FICHIER, "utf8");

function remplacer(avant, apres) {
  const n = page.split(avant).length - 1;
  if (n !== 1) throw new Error(`${n} occurrence(s) : ${avant.slice(0, 80)}`);
  page = page.replace(avant, apres);
}

const description =
  "Éric Bernier, doctorant en santé publique (systèmes, organisations et politiques de santé) à l’ESPUM, juriste et éducateur spécialisé. Parcours, recherches, travaux et CV.";

page = page.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`);
page = page.replace(/\n?<!-- entete -->[\s\S]*?<!-- \/entete -->/, "");

const personne = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Éric Bernier",
  jobTitle: "Doctorant en santé publique",
  affiliation: [
    { "@type": "CollegeOrUniversity", name: "École de santé publique de l’Université de Montréal (ESPUM)" },
    { "@type": "ResearchOrganization", name: "Centre de recherche du CHUM (CRCHUM)" },
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Université Paris Panthéon-Assas" },
    { "@type": "CollegeOrUniversity", name: "Université de Bretagne Occidentale" },
  ],
  knowsAbout: [
    "Systèmes, organisations et politiques de santé",
    "Première ligne et intersectorialité",
    "Vieillissement et maintien à domicile",
    "Droit de la santé",
  ],
  email: "mailto:eric.bernier.1@umontreal.ca",
  sameAs: ["https://www.linkedin.com/in/eric-b-5aa52b250"],
};
if (url !== "/") personne.url = url;

const image = url !== "/" ? `${url}assets/media/apercu.jpg` : "assets/media/apercu.jpg";
const entete = [
  "<!-- entete -->",
  '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">',
  url !== "/" ? `<link rel="canonical" href="${url}">` : "",
  '<meta property="og:type" content="profile">',
  '<meta property="og:title" content="Éric Bernier — Un parcours, des perspectives">',
  `<meta property="og:description" content="${description}">`,
  `<meta property="og:image" content="${image}">`,
  url !== "/" ? `<meta property="og:url" content="${url}">` : "",
  '<meta property="og:locale" content="fr_CA">',
  '<meta name="twitter:card" content="summary_large_image">',
  `<script type="application/ld+json">${JSON.stringify(personne)}</script>`,
  "<!-- /entete -->",
]
  .filter(Boolean)
  .join("\n");
page = page.replace(/(<\/title>)/, `$1\n${entete}`);

page = page.replace(/assets\/cv-(academique|professionnel)\.docx/g, "assets/cv-$1.pdf");
page = page.replace(
  /<noscript><p>Éric Bernier · [^<]*/,
  "<noscript><p>Éric Bernier · Doctorant en santé publique (2e année, systèmes, organisations et politiques de santé, ESPUM), juriste et éducateur spécialisé. "
);

fs.writeFileSync(FICHIER, page, "utf8");
console.log("index.html mis à jour" + (url !== "/" ? ` pour ${url}` : ""));
