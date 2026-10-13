// Produit index.html (français), en/index.html (anglais), es/index.html (espagnol) et 404.html à partir d'outils/contenu.js.
"use strict";
const fs = require("fs");
const path = require("path");
const { fr, en, es, LANGUES } = require("./contenu");

const RACINE = path.join(__dirname, "..");
const URL = "https://erjb-web.github.io/";
const SALLES = ["recherche", "approche", "implantation", "publications", "biographie", "parcours", "engagements"];

let typoFr = false;
const e = (s) => {
  const t = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return typoFr ? t.replace(/ ([?!;])/g, " $1").replace(/ :/g, " :") : t;
};
const externe = (href) => /^https?:/.test(href);
const lien = (href, texte, classe = "") =>
  `<a href="${e(href)}"${classe ? ` class="${classe}"` : ""}${externe(href) ? ' target="_blank" rel="noopener"' : ""}>${texte}</a>`;
const num = (i) => String(i + 1).padStart(2, "0");
const etiquettes = (tags, classe = "etiquettes") => `<div class="${classe}">${tags.map((t) => `<span>${e(t)}</span>`).join("")}</div>`;
const deuxPoints = (c) => (c.lang === "fr" ? " :" : ":");

function liste(items) {
  return `<ul class="liste">${items
    .map(
      (it) => `<li><span class="date">${e(it.date)}</span><div>${it.statut ? `<span class="statut">${e(it.statut)}</span>` : ""}<h4>${
        it.lien ? lien(it.lien, e(it.titre) + ' <span aria-hidden="true">↗</span>') : e(it.titre)
      }</h4>${it.detail ? `<p>${e(it.detail)}</p>` : ""}</div></li>`
    )
    .join("")}</ul>`;
}

function tableOnglets(titre, detail, etapes, terminus = "") {
  return `<div class="table" data-onglets>
<div class="table-tete"><span>${e(titre)}</span><span>${e(detail)}</span></div>
<div class="onglets n${etapes.length}" role="tablist">${etapes
    .map(([petit, q], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-volet="${i}"><small>${petit ? `${num(i)} · ${e(petit)}` : num(i)}</small>${e(q)}</button>`)
    .join("")}</div>
${etapes
  .map(
    ([, , titreVolet, texte, tags], i) =>
      `<div class="volet" role="tabpanel" data-volet="${i}"${i ? " hidden" : ""}><h3>${e(titreVolet)}</h3><p>${e(texte)}</p>${etiquettes(tags)}</div>`
  )
  .join("")}
${terminus ? `<p class="terminus">${e(terminus)}</p>` : ""}
</div>`;
}

const TEINTES = {
  recherche: ["#245a73", "#163a4c"],
  approche: ["#8c4d58", "#63343e"],
  implantation: ["#a0663b", "#7a4a26"],
  biographie: ["#2f6f86", "#1f4f62"],
  publications: ["#327a66", "#1f5446"],
  parcours: ["#9a7448", "#6c4f2e"],
  engagements: ["#5d6585", "#40465f"],
};


function porte(c, nom, i) {
  const [titre, legende] = c.hall.portes[nom];
  const [c1, c2] = TEINTES[nom];
  return `<button class="porte" type="button" data-salle="${nom}" style="--c1:${c1};--c2:${c2}" aria-label="${num(i)}. ${e(titre)}${deuxPoints(c)} ${e(legende)}">
<span class="plaque"><span class="num">${num(i)}</span>${e(titre)}</span>
<span class="baie" aria-hidden="true">
<span class="ouverture"><span class="apercu">${e(c.ui.entrer)} →</span><span class="battant"><span class="vignette" style="background-image:url(${c.chemin}assets/portes/${nom}.jpg)"></span><span class="poignee"></span></span></span>
<span class="reflet"></span>
</span>
<span class="seuil" aria-hidden="true"></span>
<span class="legende" aria-hidden="true">${e(legende)}</span>
</button>`;
}

function sectionRecherche(c) {
  const r = c.recherche;
  const valeur = (v) => (Array.isArray(v) ? v.map((x) => `<span class="ligne">${e(x)}</span>`).join("") : e(v));
  const travaux = `<div class="travaux">
<div class="travaux-tete"><h3>${e(r.travaux.titre)}</h3><p>${e(r.travaux.intro)}</p></div>
<div class="travaux-grille">${r.travaux.items
    .map(
      (t) => `<article class="travail${t.resume ? " vedette" : ""}">
<p class="domaine">${e(t.domaine)}</p>
<span class="statut-pastille">${e(t.statut)}</span>
<h4>${e(t.titre)}</h4>
<p class="auteurs">${e(t.auteurs)}</p>
${t.resume ? `<p class="resume">${e(t.resume)}</p>` : ""}
${t.etiquettes ? etiquettes(t.etiquettes) : ""}
</article>`
    )
    .join("")}</div>
</div>`;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(r.surtitre)}</p>
<p class="badge-these">${e(r.etiquette)}</p>
<h2>${e(r.titre)}</h2>
<p class="sous-titre">${e(r.sousTitre)}</p>
<p class="intro">${e(r.question)}</p>
<p>${e(r.but)}</p>
<ul class="faits">${r.faits.map(([k, v]) => `<li><b>${e(k)}</b><span>${valeur(v)}</span></li>`).join("")}</ul>
${lien(r.affiche[2], `<span><strong>${e(r.affiche[0])}</strong><small>${e(r.affiche[1])}</small></span><span aria-hidden="true">↗</span>`, "carte-lien")}
</div>
<div class="colonne-outils">
${tableOnglets(r.table.titre, r.table.detail, r.table.etapes, r.table.terminus)}
<h3 class="titre-bloc">${e(r.notions.titre)}</h3>
<div class="notions">${r.notions.items.map(([t, d, ref]) => `<div><h4>${e(t)}</h4><p>${e(d)}</p>${ref ? `<p class="ref">(${e(ref)})</p>` : ""}</div>`).join("")}</div>
<h3 class="titre-bloc">${e(r.retombees.titre)}</h3>
<ul class="puces deux-colonnes">${r.retombees.items.map(([t, d]) => `<li><b>${e(t)}</b>${deuxPoints(c)} ${e(d)}</li>`).join("")}</ul>
<h3 class="titre-bloc">${e(r.codirection.titre)}</h3>
<div class="codirection">${r.codirection.personnes.map((pe) => `<article class="personne"><h4>${e(pe.nom)}<span class="grade">${e(pe.grade)}</span></h4><ul>${pe.lignes.map((l) => `<li>${e(l)}</li>`).join("")}</ul><p class="chaire">${e(pe.chaire)}</p>${lien(pe.lien, `${e(r.codirection.profil)} <span aria-hidden="true">↗</span>`, "profil")}</article>`).join("")}</div>
</div>
</div>
${travaux}`;
}

function sectionApproche(c) {
  const a = c.approche;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(a.surtitre)}</p>
<h2>${e(a.titre)}</h2>
<p class="intro">${e(a.intro)}</p>
<div class="piliers">${a.piliers.map(([t, d]) => `<div><h4>${e(t)}</h4><p>${e(d)}</p></div>`).join("")}</div>
<div class="boite-outils">
<h3>${e(a.outils.titre)}</h3>
${a.outils.groupes.map(([g, items]) => `<div class="groupe-outils"><p>${e(g)}</p>${etiquettes(items, "etiquettes outils-liste")}</div>`).join("")}
</div>
</div>
<div class="colonne-outils">
<h3 class="titre-bloc">${e(a.expertises.titre)}</h3>
<div class="expertises">${a.expertises.items.map(([t, d]) => `<div><h4>${e(t)}</h4><p>${e(d)}</p></div>`).join("")}</div>
<h3 class="titre-bloc">${e(a.valeurs.titre)}</h3>
<p class="devise"><span class="devise-libelle">${e(a.valeurs.devise[0])}</span><span class="devise-latin" lang="la">${e(a.valeurs.devise[1])}</span><span class="devise-traduction">${e(a.valeurs.devise[2])}</span></p>
<div class="valeurs">${a.valeurs.items.map(([t, d]) => `<div><h4>${e(t)}</h4><p>${e(d)}</p></div>`).join("")}</div>
<h3 class="titre-bloc">${e(a.axes.titre)}</h3>
<ul class="puces">${a.axes.principaux.map((t) => `<li><b>${e(t)}</b></li>`).join("")}</ul>
<p class="petit-titre">${e(a.axes.secondairesTitre)}</p>
<ul class="puces secondaires">${a.axes.secondaires.map((t) => `<li>${e(t)}</li>`).join("")}</ul>
</div>
</div>`;
}

function sectionImplantation(c) {
  const m = c.implantation;
  const tr = m.transfert;
  const cadres = m.cadres
    ? `<h3 class="titre-bloc">${e(m.cadres.titre)}</h3><div class="cadres">${m.cadres.items
        .map((k) => `<article class="cadre"><h4>${e(k.nom)}</h4><p>${e(k.texte)}</p><p class="ref">${k.lien ? lien(k.lien, e(k.ref) + ' <span aria-hidden="true">↗</span>') : e(k.ref)}</p></article>`)
        .join("")}</div>`
    : "";
  const formation = m.formation
    ? `<div class="carte-formation"><p class="domaine">${e(m.formation.etiquette)}</p><h4>${e(m.formation.titre)}</h4><p>${e(m.formation.texte)}</p>${m.formation.themes ? etiquettes(m.formation.themes) : ""}${m.formation.lien ? lien(m.formation.lien, e(m.formation.lienTexte) + ' <span aria-hidden="true">↗</span>', "profil") : ""}</div>`
    : "";
  const ressources = m.ressources
    ? `<h3 class="titre-bloc">${e(m.ressources.titre)}</h3><ul class="liens-contact">${m.ressources.items
        .map(([titre, detail, href]) => `<li>${lien(href, `<span><strong>${e(titre)}</strong><small>${e(detail)}</small></span><span aria-hidden="true">↗</span>`)}</li>`)
        .join("")}</ul>`
    : "";
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(m.surtitre)}</p>
<h2>${e(m.titre)}</h2>
<p class="intro">${e(m.intro)}</p>
${formation}
${ressources}
</div>
<div class="colonne-outils">
${tableOnglets(tr.titre, tr.detail, tr.etapes.map(([verbe, titre, texte, tags]) => ["", verbe, titre, texte, tags]))}
<p class="note">${e(tr.note)}</p>
${cadres}
</div>
</div>`;
}

function sectionBiographie(c) {
  const b = c.biographie;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(b.surtitre)}</p>
<h2>${e(b.titre)}</h2>
<p class="intro">${e(b.intro)}</p>
<img class="portrait-bio" src="${c.chemin}assets/portrait.jpg" width="720" height="900" alt="${e(c.accueil.portrait)}" loading="lazy">
</div>
<div class="colonne-outils">
<ol class="recit">${b.chapitres.map(([titre, texte], i) => `<li><span class="recit-num">${num(i)}</span><div><h3>${e(titre)}</h3><p>${e(texte)}</p></div></li>`).join("")}</ol>
<p class="recit-fin">${e(b.conclusion)}</p>
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
<p class="sous-titre">${e(p.sousTitre)}</p>
<p class="intro">${e(p.intro)}</p>
<h3 class="titre-bloc">${e(p.continue.titre)}</h3>
<ul class="puces">${p.continue.items.map((t) => `<li>${e(t)}</li>`).join("")}</ul>
<p class="note">${e(p.note)}</p>
</div>
<div class="colonne-outils"><ol class="frise">${p.etapes
    .map(
      (s) =>
        `<li class="${s.type}"><span class="date">${e(s.date)}</span><div><span class="type">${e(p.types[s.type])}</span><h4>${e(s.titre)}</h4><p>${e(s.detail)}</p>${
          s.discret ? `<p class="discret">${e(s.discret)}</p>` : ""
        }</div></li>`
    )
    .join("")}</ol></div>
</div>`;
}

function selecteur(c) {
  return `<div class="langue" role="group" aria-label="${e(c.ui.langue)}">${LANGUES.map((l) =>
    l.code === c.lang
      ? `<span aria-current="true" lang="${l.code}">${l.libelle}</span>`
      : `<a href="${c.chemin + l.dossier || "./"}" hreflang="${l.code}" lang="${l.code}" title="${l.nom}">${l.libelle}</a>`
  ).join("")}</div>`;
}

function page(c) {
  typoFr = c.lang === "fr";
  const p = c.chemin;
  const ici = URL + LANGUES.find((l) => l.code === c.lang).dossier;
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
    knowsAbout: c.approche.axes.principaux,
    sameAs: [c.contact.liens.find((l) => l[0] === "ORCID")[2], c.contact.liens.find((l) => l[0] === "LinkedIn")[2]],
  };
  const sections = {
    recherche: sectionRecherche(c),
    approche: sectionApproche(c),
    implantation: sectionImplantation(c),
    publications: sectionGroupes(c, c.publications),
    biographie: sectionBiographie(c),
    parcours: sectionParcours(c),
    engagements: sectionGroupes(
      c,
      c.engagements,
      `<h3 class="titre-bloc">${e(c.engagements.affiliations.titre)}</h3>${etiquettes(c.engagements.affiliations.items, "etiquettes grandes")}`
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
${LANGUES.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${URL}${l.dossier}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${URL}">
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
${selecteur(c)}
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
<div class="scene"><div class="portes n${SALLES.length}">${SALLES.map((s, i) => porte(c, s, i)).join("")}</div></div>
<div class="hall-pied"><span>${e(c.hall.consigne)}</span><span class="points" aria-hidden="true">${SALLES.map(() => "<span></span>").join("")}</span></div>
</div>
</section>

${SALLES.map(
  (s, i) => `<section class="section${i % 2 ? " teinte" : ""}" id="${s}" data-salle="${s}" data-titre="${e(c.hall.portes[s][0])}">
<div class="section-contenu">
${sections[s]}
</div>
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

<footer class="pied"><span>${e(c.pied)}<br><small>${e(c.credits)}</small></span><a href="#contenu">${e(c.ui.haut)} ↑</a></footer>

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
  typoFr = false;
  const ligne = (c, dossier) => `<p lang="${c.lang}" class="note">${e(c.introuvable.texte)} <a href="/${dossier}">${e(c.introuvable.retour)}</a></p>`;
  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(fr.introuvable.titre)} · Éric Bernier</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"></head>
<body class="page-404"><main><p class="surtitre">404</p><h1>${e(fr.introuvable.titre)}</h1><p>${e(fr.introuvable.texte)}</p><p><a class="primaire" href="/">${e(fr.introuvable.retour)} →</a></p>
${ligne(en, "en/")}
${ligne(es, "es/")}</main></body>
</html>
`;
}

for (const c of [fr, en, es]) {
  const dossier = LANGUES.find((l) => l.code === c.lang).dossier;
  fs.mkdirSync(path.join(RACINE, dossier), { recursive: true });
  fs.writeFileSync(path.join(RACINE, dossier, "index.html"), page(c));
}
fs.writeFileSync(path.join(RACINE, "404.html"), introuvable());
console.log("index.html, en/index.html, es/index.html et 404.html produits");
