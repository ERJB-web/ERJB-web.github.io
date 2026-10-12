// Produit index.html (français), en/index.html (anglais) et 404.html à partir d'outils/contenu.js.
"use strict";
const fs = require("fs");
const path = require("path");
const { fr, en } = require("./contenu");

const RACINE = path.join(__dirname, "..");
const URL = "https://erjb-web.github.io/";
const SALLES = ["recherche", "publications", "parcours", "engagements"];

const e = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const externe = (href) => /^https?:/.test(href);
const lien = (href, texte, classe = "") =>
  `<a href="${e(href)}"${classe ? ` class="${classe}"` : ""}${externe(href) ? ' target="_blank" rel="noopener"' : ""}>${texte}</a>`;
const num = (i) => String(i + 1).padStart(2, "0");

function liste(items, c) {
  return `<ul class="liste">${items
    .map(
      (it) => `<li><span class="date">${e(it.date)}</span><div>${it.statut ? `<span class="statut">${e(it.statut)}</span>` : ""}<h4>${
        it.lien ? lien(it.lien, e(it.titre) + ' <span aria-hidden="true">↗</span>') : e(it.titre)
      }</h4>${it.detail ? `<p>${e(it.detail)}</p>` : ""}</div></li>`
    )
    .join("")}</ul>`;
}

function porte(c, nom, i) {
  const [titre, legende] = c.hall.portes[nom];
  return `<button class="porte" type="button" data-salle="${nom}" aria-label="${num(i)}. ${e(titre)} : ${e(legende)}">
<span class="plaque"><span class="num">${num(i)}</span>${e(titre)}</span>
<span class="baie" aria-hidden="true"><span class="lueur"></span><span class="battant"><span class="poignee"></span></span></span>
<span class="seuil" aria-hidden="true"></span>
<span class="legende" aria-hidden="true">${e(legende)}</span>
</button>`;
}

function sectionRecherche(c) {
  const r = c.recherche;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(r.surtitre)}</p>
<h2>${e(r.titre)}</h2>
<p class="sous-titre">${e(r.sousTitre)}</p>
<p class="intro">${e(r.question)}</p>
<p>${e(r.but)}</p>
<ul class="faits">${r.faits.map(([k, v]) => `<li><b>${e(k)}</b><span>${e(v)}</span></li>`).join("")}</ul>
${lien(r.affiche[2], `<span><strong>${e(r.affiche[0])}</strong><small>${e(r.affiche[1])}</small></span><span aria-hidden="true">↗</span>`, "carte-lien")}
</div>
<div class="colonne-outils">
<div class="table" data-onglets>
<div class="table-tete"><span>${e(r.table.titre)}</span><span>${e(r.table.detail)}</span></div>
<div class="onglets" role="tablist">${r.table.etapes
    .map(([obj, q], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-volet="${i}"><small>${num(i)} · ${e(obj)}</small>${e(q)}</button>`)
    .join("")}</div>
${r.table.etapes
  .map(
    ([, , titre, texte, tags], i) =>
      `<div class="volet" role="tabpanel" data-volet="${i}"${i ? " hidden" : ""}><h3>${e(titre)}</h3><p>${e(texte)}</p><div class="etiquettes">${tags.map((t) => `<span>${e(t)}</span>`).join("")}</div></div>`
  )
  .join("")}
<p class="terminus">${e(r.table.terminus)}</p>
</div>
<h3 class="titre-bloc">${e(r.notions.titre)}</h3>
<div class="notions">${r.notions.items.map(([t, d]) => `<div><h4>${e(t)}</h4><p>${e(d)}</p></div>`).join("")}</div>
<div class="duo">
<div><h3 class="titre-bloc">${e(r.retombees.titre)}</h3><ul class="puces">${r.retombees.items.map(([t, d]) => `<li><b>${e(t)}</b> : ${e(d)}</li>`).join("")}</ul></div>
<div><h3 class="titre-bloc">${e(r.axes.titre)}</h3><ul class="puces">${r.axes.items.map((t) => `<li>${e(t)}</li>`).join("")}</ul></div>
</div>
</div>
</div>`;
}

function sectionGroupes(c, s, extra = "") {
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(s.surtitre)}</p>
<h2>${e(s.titre)}</h2>
<p class="intro">${e(s.intro)}</p>
${extra}
</div>
<div class="colonne-outils">${s.groupes.map((g) => `<h3 class="titre-bloc">${e(g.titre)}</h3>${liste(g.items)}`).join("")}</div>
</div>`;
}

function sectionParcours(c) {
  const p = c.parcours;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(p.surtitre)}</p>
<h2>${e(p.titre)}</h2>
<p class="intro">${e(p.intro)}</p>
<h3 class="titre-bloc">${e(p.continue.titre)}</h3>
<ul class="puces">${p.continue.items.map((t) => `<li>${e(t)}</li>`).join("")}</ul>
<p class="note">${e(p.note)}</p>
</div>
<div class="colonne-outils"><ol class="frise">${p.etapes
    .map(
      (s) =>
        `<li class="${s.type}"><span class="date">${e(s.date)}</span><div><span class="type">${e(p.types[s.type])}</span><h4>${e(s.titre)}</h4><p>${e(s.detail)}</p></div></li>`
    )
    .join("")}</ol></div>
</div>`;
}

function page(c) {
  const p = c.chemin;
  const autreUrl = URL + (c.lang === "fr" ? "en/" : "");
  const ici = URL + (c.lang === "fr" ? "" : "en/");
  const personne = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Éric Bernier",
    url: URL,
    image: URL + "assets/portrait.jpg",
    jobTitle: c.accueil.surtitre,
    email: "mailto:" + c.contact.courriel,
    affiliation: [
      { "@type": "CollegeOrUniversity", name: "École de santé publique de l’Université de Montréal (ESPUM)" },
      { "@type": "ResearchOrganization", name: "Centre de recherche du CHUM (CRCHUM)" },
    ],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Université Paris Panthéon-Assas" },
      { "@type": "CollegeOrUniversity", name: "Université de Bretagne Occidentale" },
    ],
    knowsAbout: c.recherche.axes.items,
    sameAs: [c.contact.liens.find((l) => l[0] === "ORCID")[2], c.contact.liens.find((l) => l[0] === "LinkedIn")[2]],
  };
  const sections = {
    recherche: sectionRecherche(c),
    publications: sectionGroupes(c, c.publications),
    parcours: sectionParcours(c),
    engagements: sectionGroupes(
      c,
      c.engagements,
      `<h3 class="titre-bloc">${e(c.engagements.affiliations.titre)}</h3><div class="etiquettes grandes">${c.engagements.affiliations.items.map((t) => `<span>${e(t)}</span>`).join("")}</div>`
    ),
  };

  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(c.meta.titre)}</title>
<meta name="description" content="${e(c.meta.description)}">
<meta name="theme-color" content="#fcfdfb">
<link rel="canonical" href="${ici}">
<link rel="alternate" hreflang="fr" href="${URL}">
<link rel="alternate" hreflang="en" href="${URL}en/">
<link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${p}assets/site.css">
<meta property="og:type" content="profile">
<meta property="og:title" content="${e(c.meta.titre)}">
<meta property="og:description" content="${e(c.meta.description)}">
<meta property="og:image" content="${URL}assets/apercu.jpg">
<meta property="og:url" content="${ici}">
<meta property="og:locale" content="${c.locale}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(personne)}</script>
<script src="${p}assets/site.js" defer></script>
</head>
<body>
<a class="evitement" href="#contenu">${e(c.ui.evitement)}</a>
<header class="entete">
<a class="marque" href="${p || "./"}"><span class="monogramme" aria-hidden="true">EB</span><span><strong>Éric Bernier</strong><small>${e(c.ui.sousTitre)}</small></span></a>
<nav class="nav" aria-label="${e(c.ui.navigation)}">${c.nav.map(([id, t]) => `<a href="#${id}">${e(t)}</a>`).join("")}</nav>
<div class="outils">
<div class="langue" role="group" aria-label="${e(c.ui.langue)}"><span aria-current="true">${c.lang.toUpperCase()}</span><a href="${c.autre.href}" hreflang="${c.autre.code}" lang="${c.autre.code}" title="${e(c.autre.nom)}">${c.autre.libelle}</a></div>
<a class="bouton-cv" href="${p}docs/cv-academique.pdf">${e(c.ui.cv)} <span aria-hidden="true">↓</span></a>
</div>
</header>

<main id="contenu">
<section class="accueil" aria-labelledby="nom">
<div class="presentation">
<div class="identite">
<img class="portrait" src="${p}assets/portrait.jpg" width="720" height="900" alt="${e(c.accueil.portrait)}">
<div><p class="surtitre">${e(c.accueil.surtitre)}</p><h1 id="nom">Éric Bernier</h1><p class="roles">${e(c.accueil.roles)}</p></div>
</div>
<p class="chapeau">${e(c.accueil.chapeau)}</p>
<p class="encadrement">${e(c.accueil.encadrement)}</p>
<div class="actions"><button class="primaire" type="button" id="visite">${e(c.accueil.visite)} <span aria-hidden="true">→</span></button><a class="lien" href="#recherche">${e(c.accueil.explorer)}</a></div>
</div>
<div class="hall" role="group" aria-label="${e(c.hall.titre)}">
<div class="hall-tete"><span>${e(c.hall.titre)}</span><span>${e(c.hall.compte)}</span></div>
<div class="scene"><div class="portes">${SALLES.map((s, i) => porte(c, s, i)).join("")}</div></div>
<div class="hall-pied"><span>${e(c.hall.consigne)}</span><span class="points" aria-hidden="true">${SALLES.map(() => "<span></span>").join("")}</span></div>
</div>
</section>

${SALLES.map(
  (s, i) => `<section class="section${i % 2 ? " teinte" : ""}" id="${s}" data-salle="${s}" data-titre="${e(c.hall.portes[s][0])}">
${sections[s]}
</section>`
).join("\n")}

<section class="section contact" id="contact">
<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(c.contact.surtitre)}</p>
<h2>${e(c.contact.titre)}</h2>
<p class="intro">${e(c.contact.intro)}</p>
<a class="primaire" href="mailto:${e(c.contact.courriel)}">${e(c.contact.ecrire)} <span aria-hidden="true">→</span></a>
<p class="courriel">${e(c.contact.courriel)}</p>
<p class="note">${e(c.contact.adresse)}</p>
</div>
<div class="colonne-outils"><ul class="liens-contact">${c.contact.liens
    .map(([t, d, href]) => `<li>${lien(externe(href) ? href : p + href, `<span><strong>${e(t)}</strong><small>${e(d)}</small></span><span aria-hidden="true">${externe(href) ? "↗" : "↓"}</span>`)}</li>`)
    .join("")}</ul></div>
</div>
</section>
</main>

<footer class="pied"><span>${e(c.pied)}</span><a href="#contenu">${e(c.ui.haut)} ↑</a></footer>

<div class="salle" id="salle" role="dialog" aria-modal="true" aria-labelledby="salle-titre" hidden>
<div class="salle-barre">
<button type="button" data-retour>← ${e(c.ui.hall)}</button>
<span id="salle-titre"></span>
<button type="button" data-suivante>${e(c.ui.suivante)} →</button>
<button type="button" data-contact hidden>${e(c.ui.contact)} →</button>
</div>
<div class="salle-contenu"></div>
</div>
</body>
</html>
`;
}

function introuvable() {
  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(fr.introuvable.titre)} · Éric Bernier</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"></head>
<body class="page-404"><main><p class="surtitre">404</p><h1>${e(fr.introuvable.titre)}</h1><p>${e(fr.introuvable.texte)}</p><p><a class="primaire" href="/">${e(fr.introuvable.retour)} →</a></p>
<p lang="en" class="note">${e(en.introuvable.texte)} <a href="/en/">${e(en.introuvable.retour)}</a></p></main></body>
</html>
`;
}

fs.writeFileSync(path.join(RACINE, "index.html"), page(fr));
fs.mkdirSync(path.join(RACINE, "en"), { recursive: true });
fs.writeFileSync(path.join(RACINE, "en", "index.html"), page(en));
fs.writeFileSync(path.join(RACINE, "404.html"), introuvable());
console.log("index.html, en/index.html et 404.html produits");
