// Produit les pages complètes (fr, en, es, zh, ar), les versions abrégées (iu, innu, falc) et 404.html à partir d'outils/contenu.js et d'outils/i18n.
"use strict";
const fs = require("fs");
const path = require("path");
const { fr, en, es, LANGUES, AFFICHE } = require("./contenu");
const lireLangue = (code) => JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", code + ".json"), "utf8"));
const zh = lireLangue("zh");
const ar = lireLangue("ar");
const COMPLETES = [fr, en, es, zh, ar];
const langue = (code) => LANGUES.find((l) => l.code === code);
const ABREGE = require("./contenu-abrege");

const RACINE = path.join(__dirname, "..");
const empreinte = (fichier) => require("crypto").createHash("sha256").update(fs.readFileSync(path.join(RACINE, fichier))).digest("hex").slice(0, 10);
const VERSION_CSS = empreinte("assets/site.css");
const VERSION_JS = empreinte("assets/site.js");
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
const riche = (s) => e(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
const deuxPoints = (c) => (c.lang === "fr" ? " :" : c.lang === "zh" ? "：" : ":");
const etoile = (cx, cy, r) => {
  const p = [];
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rr = k % 2 ? r * 0.382 : r;
    p.push(`${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${p.join("L")}Z`;
};
const DRAPEAUX = {
  fr: '<svg viewBox="0 0 3 2"><path fill="#002654" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ce1126" d="M2 0h1v2H2z"/></svg>',
  gb: '<svg viewBox="0 0 60 30"><path fill="#012169" d="M0 0h60v30H0z"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6"/></svg>',
  es: '<svg viewBox="0 0 3 2"><path fill="#aa151b" d="M0 0h3v2H0z"/><path fill="#f1bf00" d="M0 .5h3v1H0z"/></svg>',
  cn: `<svg viewBox="0 0 30 20"><path fill="#ee1c25" d="M0 0h30v20H0z"/><path fill="#ffde00" d="${etoile(5, 5, 3)}${etoile(10, 2, 1)}${etoile(12, 4, 1)}${etoile(12, 7, 1)}${etoile(10, 9, 1)}"/></svg>`,
};
const PASTILLES = { ar: "ع", iu: "ᐃ", innu: "In", falc: "Aa" };
const drapeau = (code) =>
  DRAPEAUX[code] ? `<span class="drapeau" aria-hidden="true">${DRAPEAUX[code]}</span>` : `<span class="drapeau pastille pastille-${code}" aria-hidden="true">${PASTILLES[code]}</span>`;

const ICONES = {
  oeil: '<path d="M2 12c2.5-4.5 6-6.5 10-6.5s7.5 2 10 6.5c-2.5 4.5-6 6.5-10 6.5S4.5 16.5 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  loupe: '<circle cx="10.5" cy="10.5" r="7"/><path d="M15.6 15.6 21 21M7.5 10.5h6M10.5 7.5v6"/>',
  contraste: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>',
  casque: '<path d="M4 15v-2.5a8 8 0 0 1 16 0V15M4 14.5h3.2v6H4ZM20 14.5h-3.2v6H20Z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  acces: '<circle cx="12" cy="4.5" r="2"/><path d="m4 8.5 8 1.5 8-1.5M12 10v5m0 0-3.5 6.5M12 15l3.5 6.5"/>',
  personne: '<circle cx="12" cy="7.5" r="3.8"/><path d="M4.5 21c0-4.4 3.4-7.4 7.5-7.4s7.5 3 7.5 7.4"/>',
  mallette: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3 13h18"/>',
  cartes: '<rect x="3.5" y="6.5" width="9" height="14" rx="1.5"/><path d="M12.5 8.5 15.5 5l5.5 5-5.5 7.5-3-2.5"/>',
  coeur: '<path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z"/>',
  chemin: '<path d="M8 21 11 3M16 21 13 3M12 7v2M12 13v2"/>',
  enveloppe: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  maison: '<path d="M3 11 12 3.5 21 11M5.5 9v11.5h13V9M10 20.5v-6h4v6"/>',
  argent: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-.9-1.5-1.4-2.8-1.4-1.7 0-2.8.8-2.8 2.1 0 2.9 5.6 1.5 5.6 4.3 0 1.3-1.2 2.1-2.8 2.1-1.4 0-2.5-.6-3-1.6M12 6.2v1.6M12 16.4V18"/>',
  repas: '<circle cx="13" cy="13" r="6"/><path d="M3 4v5a2 2 0 0 0 4 0V4M5 4v16M21 4c-1.5 0-2.5 2-2.5 5s1 3 2.5 3v8"/>',
  sante: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
  famille: '<circle cx="8" cy="7" r="2.8"/><circle cx="16.5" cy="9" r="2.2"/><path d="M3 20c0-3.4 2.3-6 5-6s5 2.6 5 6M13 20c0-2.6 1.6-4.6 3.5-4.6S20 17.4 20 20"/>',
  bus: '<rect x="4.5" y="3.5" width="15" height="14" rx="2.5"/><path d="M4.5 11h15M8 17.5V20M16 17.5V20M8 14.5h.01M16 14.5h.01"/>',
  papiers: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  musique: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  bulles: '<path d="M4 5h11v8H8l-4 3Z"/><path d="M15 9h5v8l-3-2h-6v-2"/>',
};
const icone = (nom) =>
  `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONES[nom]}</svg>`;

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

const IMAGES_PORTES = {
  recherche: "recherche.jpg",
  approche: "approche.jpg",
  implantation: "implantation.jpg",
  publications: "publications.jpg",
  biographie: "biographie.jpg",
  parcours: "parcours.jpg",
  engagements: "engagements.jpg",
};

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
  const image = IMAGES_PORTES[nom];
  return `<button class="porte" type="button" data-salle="${nom}" style="--c1:${c1};--c2:${c2}" aria-label="${num(i)}. ${e(titre)}${deuxPoints(c)} ${e(legende)}">
<span class="baie" aria-hidden="true"><span class="ouverture"><span class="apercu">${e(c.ui.entrer)}</span><span class="battant"><span class="vignette" style="background-image:url(${c.chemin}assets/portes/${image}?v=${empreinte("assets/portes/" + image)})"></span><span class="poignee"></span></span></span></span>
<span class="porte-texte" aria-hidden="true"><span class="plaque"><span class="num">${num(i)}</span>${e(titre)}</span><span class="legende">${e(legende)}</span><span class="entrer">${e(c.ui.entrer)} →</span></span>
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
${lien(
  r.affiche[2],
  `<img class="affiche-vignette" src="${AFFICHE}img/affiche-${c.lang}.png" data-std="${AFFICHE}img/affiche-${c.lang}.png" data-cb="${AFFICHE}img/affiche-${c.lang}-daltonien.png" alt="${e(c.ui.afficheAlt)}" width="2400" height="2400" loading="lazy" decoding="async"><span><strong>${e(r.affiche[0])}</strong><small>${e(r.affiche[1])}</small></span><span aria-hidden="true">↗</span>`,
  "carte-lien carte-affiche"
)}
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

// Vidéos et balados intégrés : le lecteur du service ne se charge qu'au clic (aucun témoin avant).
const INTEGRATION = {
  fr: ["Lire ici", "Chargé depuis {s} au clic", "Ouvrir la source"],
  en: ["Play here", "Loads from {s} when clicked", "Open the source"],
  es: ["Reproducir aquí", "Se carga desde {s} al hacer clic", "Abrir la fuente"],
  zh: ["在此播放", "点击后从 {s} 加载", "打开来源"],
  ar: ["تشغيل هنا", "يُحمَّل من {s} عند النقر", "فتح المصدر"],
};
const PODBEAN = {
  "https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/": "c6m54-1635555-pb",
  "https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice": "8ccjk-17862e8-pb",
};
function integration(href) {
  if (PODBEAN[href]) return { src: `https://www.podbean.com/player-v2/?i=${PODBEAN[href]}&share=0&download=0&skin=1&btn-skin=7`, service: "Podbean", audio: true };
  const yt = href.match(/youtube\.com\/watch\?v=([\w-]{11})/);
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1`, service: "YouTube", audio: false };
  if (/^https:\/\/podcasts\.apple\.com\//.test(href)) return { src: href.replace("https://podcasts.apple.com/", "https://embed.podcasts.apple.com/"), service: "Apple Podcasts", audio: true };
  return null;
}
function media(c, [titre, source, href, apport]) {
  const [lire, note, ouvrir] = INTEGRATION[c.lang];
  const i = integration(href);
  const ecran = i
    ? `<div class="media-ecran${i.audio ? " audio" : ""}"><button type="button" data-integrer="${e(i.src)}" data-titre="${e(titre)}"><span class="rond" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg></span><span>${e(lire)}</span><small>${e(note.replace("{s}", i.service))}</small></button></div>`
    : "";
  return `<article class="media">${ecran}<div class="media-texte"><strong>${e(titre)}</strong><small>${e(source)}</small><p>${e(apport)}</p>${lien(href, e(ouvrir) + ' <span aria-hidden="true">↗</span>')}</div></article>`;
}

function sectionImplantation(c) {
  const m = c.implantation;
  const tr = m.transfert;
  const fleche = ' <span aria-hidden="true">↗</span>';
  const cartes = (bloc) =>
    `<h3 class="titre-bloc">${e(bloc.titre)}</h3><div class="cadres">${bloc.items
      .map((k) => `<article class="cadre"><h4>${e(k.nom)}</h4><p>${e(k.texte)}</p><p class="ref">(${e(k.ref)})</p></article>`)
      .join("")}</div>`;
  const lienDoi = (s) => e(s).replace(/(https?:\/\/\S+)$/, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  const suggestion = ([titre, source, href, apport]) =>
    `<li>${lien(href, `<span><strong>${e(titre)}</strong><small>${e(source)}</small><small class="apport">${e(apport)}</small></span>${fleche}`)}</li>`;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(m.surtitre)}</p>
<h2>${e(m.titre)}</h2>
<p class="intro">${e(m.intro)}</p>
<p class="precision">${e(m.precision)}</p>
<h3 class="titre-bloc">${e(m.ressources.titre)}</h3>
<ul class="liens-contact">${m.ressources.items
    .map(([titre, detail, href]) => `<li>${lien(href, `<span><strong>${e(titre)}</strong><small>${e(detail)}</small></span>${fleche}`)}</li>`)
    .join("")}</ul>
<p class="formation-discrete"><span>${e(m.formation.etiquette)}</span>${e(m.formation.titre)} · ${lien(m.formation.lien, e(m.formation.lienTexte) + fleche)}</p>
</div>
<div class="colonne-outils">
${tableOnglets(tr.titre, tr.detail, tr.etapes.map(([verbe, titre, texte, tags]) => ["", verbe, titre, texte, tags]))}
<p class="note">${e(tr.note)}</p>
<p class="note note-avant">${e(m.chantiers.intro)}</p>
${tableOnglets(m.chantiers.titre, m.chantiers.detail, m.chantiers.items.map(([court, titre, texte, refs]) => ["", court, titre, texte, refs]), "")}
${cartes(m.plan)}
${cartes(m.cadres)}
<details class="biblio"><summary>${e(m.bibliographie.titre)}</summary><ol>${m.bibliographie.items.map((r) => `<li>${lienDoi(r)}</li>`).join("")}</ol></details>
</div>
</div>
<div class="plus-loin">
<div class="travaux-tete"><h3>${e(m.plusLoin.titre)}</h3><p>${e(m.plusLoin.intro)}</p></div>
${m.plusLoin.groupes
  .filter(([, items]) => items.some(([, , href]) => integration(href)))
  .map(([g, items]) => `<p class="petit-titre">${e(g)}</p><div class="mediatheque">${items.map((it) => media(c, it)).join("")}</div>`)
  .join("")}
<div class="plus-loin-grille">${m.plusLoin.groupes
    .filter(([, items]) => !items.some(([, , href]) => integration(href)))
    .map(([g, items]) => `<div><p class="petit-titre">${e(g)}</p><ul class="liens-contact compact suggestions">${items.map(suggestion).join("")}</ul></div>`)
    .join("")}</div>
</div>`;
}

function sectionBiographie(c) {
  const b = c.biographie;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(b.surtitre)}</p>
<h2>${e(b.titre)}</h2>
<div class="bio-intro">${b.intro.map((p) => `<p>${riche(p)}</p>`).join("")}</div>
<figure class="bio-figure"><img class="portrait-bio" src="${c.chemin}assets/portrait.jpg?v=${empreinte("assets/portrait.jpg")}" width="900" height="900" alt="${e(c.accueil.portrait)}" loading="lazy"><blockquote class="citation">${e(b.citation)}</blockquote></figure>
</div>
<div class="colonne-outils">
<ol class="recit">${b.chapitres.map(([titre, paragraphes], k) => `<li><span class="recit-num">${num(k)}</span><div><h3>${e(titre)}</h3>${paragraphes.map((p) => `<p>${riche(p)}</p>`).join("")}</div></li>`).join("")}</ol>
<div class="vision"><h3>${e(b.vision.titre)}</h3>${b.vision.paragraphes.map((p) => `<p>${riche(p)}</p>`).join("")}</div>
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

const PREFERENCES = `<script>(function(){try{var h=document.documentElement,m=(localStorage.getItem("eb-modes")||"").split(" "),t=+localStorage.getItem("eb-taille")||0,a=location.hash;if(a==="#daltonien"||a==="#colour-blind")m.push("cb");if(a==="#basse-vision"||a==="#low-vision")m.push("lv");m.forEach(function(x){if(/^(cb|lv|hc)$/.test(x))h.classList.add(x)});if(t>0&&t<4)h.classList.add("t"+t)}catch(e){}})();</script>`;

const langueHtml = (l) => (l.code === "falc" ? "fr" : l.code);

function menuLangues(c, ici) {
  const actuelle = langue(ici === "falc" ? "fr" : ici);
  const lienLangue = (l) =>
    l.code === ici
      ? `<span aria-current="page" lang="${langueHtml(l)}">${drapeau(l.drapeau)}<span>${e(l.nom)}</span></span>`
      : `<a href="${c.chemin + l.dossier || "./"}" lang="${langueHtml(l)}"${l.hreflang ? ` hreflang="${l.hreflang}"` : ""}>${drapeau(l.drapeau)}<span>${e(l.nom)}</span></a>`;
  return `<details class="menu menu-langues"><summary aria-label="${e(c.ui.langue)}${deuxPoints(c)} ${e(actuelle.nom)}">${drapeau(actuelle.drapeau)}<span class="menu-libelle">${e(actuelle.libelle)}</span>${icone("chevron")}</summary>
<div class="menu-panneau"><p class="menu-titre">${e(c.ui.langue)}</p><ul>${LANGUES.filter((l) => !l.abregee).map((l) => `<li>${lienLangue(l)}</li>`).join("")}</ul>
<p class="menu-titre">${e(c.ui.autresLangues)}</p><ul>${LANGUES.filter((l) => l.abregee && l.code !== "falc").map((l) => `<li>${lienLangue(l)}</li>`).join("")}</ul></div></details>`;
}

function menuAcces(c, ici) {
  const u = c.ui;
  return `<details class="menu menu-acces"><summary aria-label="${e(u.acces)}">${icone("acces")}<span class="menu-libelle">${e(u.acces)}</span>${icone("chevron")}</summary>
<div class="menu-panneau">
<button type="button" data-mode="cb" aria-pressed="false">${icone("oeil")}<span>${e(u.daltonisme)}</span></button>
<button type="button" data-mode="lv" aria-pressed="false">${icone("loupe")}<span>${e(u.basseVision)}</span></button>
<button type="button" data-mode="hc" aria-pressed="false">${icone("contraste")}<span>${e(u.contraste)}</span></button>
<div class="taille" role="group" aria-label="${e(u.taille)}"><span>${e(u.taille)}</span><button type="button" data-taille="-1" aria-label="${e(u.moins)}">A−</button><button type="button" data-taille="1" aria-label="${e(u.plus)}">A+</button></div>
<div class="menu-sep"></div>
<button type="button" data-ecouter>${icone("casque")}<span>${e(u.ecouterPage)}</span></button>
<button type="button" data-arreter hidden><span>${e(u.arreter)}</span></button>
<p class="note-voix" data-sans-voix hidden>${e(u.sansVoix)}</p>
${ici === "falc" ? `<span aria-current="page" lang="fr">${drapeau("falc")}<span>${e(u.falc)}</span></span>` : `<a href="${c.chemin}falc/" lang="fr">${drapeau("falc")}<span>${e(u.falc)}</span></a>`}
</div></details>`;
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
<html lang="${c.lang === "zh" ? "zh-Hans" : c.lang}"${langue(c.lang).dir ? ` dir="${langue(c.lang).dir}"` : ""} data-voix="${langue(c.lang).voix}" data-racine="${c.chemin || "./"}"${["fr", "en"].includes(c.lang) ? ` data-audio="${c.lang}"` : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${PREFERENCES}
<title>${e(c.meta.titre)}</title>
<meta name="description" content="${e(c.meta.description)}">
<meta name="theme-color" content="#fcfdfb">
<link rel="canonical" href="${ici}">
${LANGUES.filter((l) => l.hreflang).map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${URL}${l.dossier}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${URL}">
<link rel="icon" href="${p}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${p}assets/site.css?v=${VERSION_CSS}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${e(c.meta.titre)}">
<meta property="og:description" content="${e(c.meta.description)}">
<meta property="og:image" content="${URL}assets/apercu.jpg">
<meta property="og:url" content="${ici}">
<meta property="og:locale" content="${c.locale}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(personne)}</script>
<script src="${p}assets/site.js?v=${VERSION_JS}" defer></script>
</head>
<body>
<a class="evitement" href="#contenu">${e(c.ui.evitement)}</a>
<header class="entete">
<a class="marque" href="${p || "./"}"><span class="monogramme" aria-hidden="true">EB</span><span><strong>Éric Bernier</strong><small>${e(c.ui.sousTitre)}</small></span></a>
<nav class="nav" aria-label="${e(c.ui.navigation)}">${c.nav.map(([id, t]) => `<a href="#${id}">${e(t)}</a>`).join("")}</nav>
<div class="outils">
${menuLangues(c, c.lang)}
${menuAcces(c, c.lang)}
<a class="bouton-cv" href="${p}docs/cv-academique.pdf">${e(c.ui.cv)} <span aria-hidden="true">↓</span></a>
</div>
</header>

<main id="contenu">
<section class="accueil" aria-labelledby="nom">
<div class="presentation">
<div class="identite">
<img class="portrait" src="${p}assets/portrait.jpg?v=${empreinte("assets/portrait.jpg")}" width="900" height="900" alt="${e(c.accueil.portrait)}">
<div><p class="surtitre">${e(c.accueil.surtitre)}</p><h1 id="nom">Éric Bernier</h1><p class="roles">${e(c.accueil.roles)}</p></div>
</div>
<div class="chapeau"><h2>${e(c.accueil.chapeau.titre)}</h2>${c.accueil.chapeau.paragraphes.map((x) => `<p>${riche(x)}</p>`).join("")}</div>
<p class="encadrement">${e(c.accueil.encadrement)}</p>
<div class="actions"><button class="primaire" type="button" id="visite">${e(c.accueil.visite)} <span aria-hidden="true">→</span></button><a class="lien" href="#recherche">${e(c.accueil.explorer)}</a></div>
</div>
<div class="hall" role="group" aria-label="${e(c.hall.titre)}">
<div class="hall-tete"><span>${e(c.hall.titre)}</span><span>${e(c.hall.compte)}</span></div>
<div class="portes">${SALLES.map((s, i) => porte(c, s, i)).join("")}</div>
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
<div class="salle-actions"><button type="button" data-ecouter>${icone("casque")}<span>${e(c.ui.ecouter)}</span></button><button type="button" data-arreter hidden>${e(c.ui.arreter)}</button>
<button type="button" data-suivante>${e(c.ui.suivante)} →</button>
<button type="button" data-contact hidden>${e(c.ui.contact)} →</button></div>
</div>
<div class="salle-contenu"></div>
</div>
</body>
</html>
`;
}

function enTeteAbregee(c, code) {
  return `<!doctype html>
<html lang="fr" data-voix="fr-CA" data-racine="../"${code === "falc" ? ' data-audio="falc"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${PREFERENCES}
<title>${e(c.titre)}</title>
<meta name="description" content="${e(c.description)}">
<link rel="canonical" href="${URL}${langue(code).dossier}">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/site.css?v=${VERSION_CSS}">
<script src="../assets/site.js?v=${VERSION_JS}" defer></script>
</head>
<body class="page-abregee">
<a class="evitement" href="#contenu">${e(fr.ui.evitement)}</a>
<header class="entete">
<a class="marque" href="../"><span class="monogramme" aria-hidden="true">EB</span><span><strong>Éric Bernier</strong><small>${e(fr.ui.sousTitre)}</small></span></a>
<div class="outils">
${menuLangues(c, code)}
${menuAcces(c, code)}
</div>
</header>`;
}

const piedAbrege = () => `<footer class="pied"><span>${e(fr.pied)}</span><a href="#contenu">${e(fr.ui.haut)} ↑</a></footer>
</body>
</html>
`;

function pageFalc() {
  typoFr = true;
  const a = ABREGE.falc;
  const c = { ...fr, chemin: "../", titre: a.titre, description: a.description };
  const ecouter = (cible, texte) =>
    `<button type="button" class="bouton-ecouter" data-ecouter data-cible="${cible}">${icone("casque")}<span>${e(texte)}</span></button>`;
  const bloc = (b, i) => `<section class="bloc-falc" id="bloc-${i + 1}" aria-labelledby="titre-bloc-${i + 1}">
<div class="picto">${icone(b.icone)}</div>
<div>
<h2 id="titre-bloc-${i + 1}">${e(b.titre)}</h2>
${b.phrases.map((p) => `<p>${e(p)}</p>`).join("")}
${b.cartes ? `<ul class="cartes-vie">${b.cartes.map(([ic, nom]) => `<li>${icone(ic)}<span>${e(nom)}</span></li>`).join("")}</ul>` : ""}
${b.courriel ? `<p><a class="primaire" href="mailto:${e(b.courriel)}">${e(b.courriel)}</a></p>` : ""}
${b.lien ? `<p>${lien(b.lien[1], e(b.lien[0]) + (externe(b.lien[1]) ? ' <span aria-hidden="true">↗</span>' : " →"), "lien")}</p>` : ""}
${ecouter("bloc-" + (i + 1), a.ecouter)}
</div>
</section>`;
  return `${enTeteAbregee(c, "falc")}
<main id="contenu" class="abrege falc">
<p class="surtitre">${e(a.surtitre)}</p>
<h1>${e(a.h1)}</h1>
<p class="actions-ecoute">${ecouter("contenu", a.ecouterTout)}<button type="button" class="bouton-ecouter" data-arreter hidden>${e(fr.ui.arreter)}</button></p>
${a.blocs.map(bloc).join("\n")}
</main>
${piedAbrege()}`;
}

function pageSalutation(code) {
  typoFr = true;
  const a = ABREGE[langue(code).dossier.replace("/", "")];
  const c = { ...fr, chemin: "../", titre: a.titre, description: a.description };
  const P = ABREGE.presentation;
  const liens = (l) =>
    `<ul class="liens-contact compact">${ABREGE.liensCommuns[l]
      .map(([texte, href]) => `<li>${lien(href, `<span><strong>${e(texte)}</strong></span><span aria-hidden="true">${externe(href) ? "↗" : "→"}</span>`)}</li>`)
      .join("")}</ul>`;
  const colonne = (l, nom) =>
    `<section lang="${l}" aria-labelledby="titre-${l}"><h2 id="titre-${l}">${nom}</h2><p class="avis">${e(a.avis[l])}</p>${P[l].map((p) => `<p>${e(p)}</p>`).join("")}${liens(l)}</section>`;
  return `${enTeteAbregee(c, code)}
<main id="contenu" class="abrege salutation-page">
<p class="salutation" lang="${code}">${e(a.salutation[0])}</p>
${a.salutation[1] ? `<p class="translitteration">${e(a.salutation[1])}</p>` : ""}
<p class="sens">${e(a.salutation[2])}</p>
<h1>Éric Bernier</h1>
<div class="duo-langues">
${colonne("fr", "Français")}
${colonne("en", "English")}
</div>
<p class="merci"><span lang="${code}">${e(a.merci[0])}</span>${a.merci[1] ? ` <span class="translitteration">(${e(a.merci[1])})</span>` : ""} · ${e(a.merci[2])}</p>
<p><a class="primaire" href="mailto:${e(ABREGE.COURRIEL)}">${e(ABREGE.COURRIEL)}</a></p>
</main>
${piedAbrege()}`;
}

function introuvable() {
  typoFr = false;
  const ligne = (c, dossier) => `<p lang="${c.lang}"${langue(c.lang).dir ? ` dir="${langue(c.lang).dir}"` : ""} class="note">${e(c.introuvable.texte)} <a href="/${dossier}">${e(c.introuvable.retour)}</a></p>`;
  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(fr.introuvable.titre)} · Éric Bernier</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"></head>
<body class="page-404"><main><p class="surtitre">404</p><h1>${e(fr.introuvable.titre)}</h1><p>${e(fr.introuvable.texte)}</p><p><a class="primaire" href="/">${e(fr.introuvable.retour)} →</a></p>
${[en, es, zh, ar].map((c) => ligne(c, langue(c.lang).dossier)).join("\n")}</main></body>
</html>
`;
}

const ecrire = (dossier, html) => {
  fs.mkdirSync(path.join(RACINE, dossier), { recursive: true });
  fs.writeFileSync(path.join(RACINE, dossier, "index.html"), html);
};
// En arabe, les flèches de direction suivent le sens de lecture.
const miroir = (html) => html.replace(/[→←]/g, (m) => (m === "→" ? "←" : "→"));
const { zonesPage, zonesFalc } = require("./narration");
const lectures = {};
for (const c of COMPLETES) {
  const l = langue(c.lang);
  const html = page(c);
  ecrire(l.dossier, l.dir === "rtl" ? miroir(html) : html);
  lectures[c.lang] = zonesPage(html);
}
const falcHtml = pageFalc();
ecrire("falc/", falcHtml);
lectures.falc = zonesFalc(falcHtml);
// Textes que la voix de lecture enregistre (français, anglais, FALC) : rendus hors du dépôt, puis rangés dans audio/.
fs.mkdirSync(path.join(__dirname, "narration"), { recursive: true });
for (const cle of ["fr", "en", "falc"]) fs.writeFileSync(path.join(__dirname, "narration", cle + ".json"), JSON.stringify(lectures[cle], null, 1) + "\n");
for (const code of ["iu", "moe"]) ecrire(langue(code).dossier, pageSalutation(code));
fs.writeFileSync(path.join(RACINE, "404.html"), introuvable());
console.log("pages produites : " + LANGUES.map((l) => l.dossier || "/").join(", ") + " et 404.html");
