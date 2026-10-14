// Textes lus à voix haute : extraits des pages produites, zone par zone (accueil, chaque salle, chaque bloc FALC).
"use strict";

const ENTITES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " };
const BLOCS = "h1|h2|h3|h4|p|li|blockquote|figcaption";

// Retire un élément entier (balises imbriquées du même nom comprises).
function retirer(html, ouverture, nom) {
  let i;
  while ((i = html.search(ouverture)) >= 0) {
    let profondeur = 0;
    const motif = new RegExp(`<(/?)${nom}\\b[^>]*>`, "g");
    motif.lastIndex = i;
    let m;
    while ((m = motif.exec(html))) {
      profondeur += m[1] ? -1 : 1;
      if (profondeur === 0) break;
    }
    const fin = m ? motif.lastIndex : html.length;
    html = html.slice(0, i) + html.slice(fin);
  }
  return html;
}

function paragraphes(html) {
  let h = html;
  h = retirer(h, /<details class="(?:biblio|notion-biblio)"/, "details");
  h = retirer(h, /<div class="plus-loin"/, "div");
  h = retirer(h, /<ul class="liens-contact[^"]*"/, "ul");
  h = retirer(h, /<div class="etiquettes[^"]*"/, "div");
  h = retirer(h, /<div class="onglets[^"]*"/, "div");
  h = retirer(h, /<div class="table-tete"/, "div");
  h = retirer(h, /<div class="actions"/, "div");
  h = retirer(h, /<div class="bandeau"/, "div");
  h = retirer(h, /<div class="rg-ensemble"/, "div");
  h = retirer(h, /<div class="comparaison"/, "div");
  h = retirer(h, /<div class="cycle"/, "div");
  h = retirer(h, /<a [^>]*class="carte-lien/, "a");
  h = retirer(h, /<span aria-hidden="true"/, "span");
  h = retirer(h, /<svg\b/, "svg");
  h = retirer(h, /<button\b/, "button");
  h = h.replace(/<p class="ref">[\s\S]*?<\/p>/g, "").replace(/<p class="surtitre">[\s\S]*?<\/p>/g, "");
  h = h.replace(/<\/b>/g, " :</b> ").replace(/<\/(small|h4)>/g, "$& ").replace(/<span class="date">([\s\S]*?)<\/span>/g, "$1 ");
  h = h.replace(new RegExp(`</(${BLOCS})>`, "g"), "\n");
  h = h.replace(/<[^>]+>/g, "");
  h = h.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITES[m]);
  return h
    .split("\n")
    .map((l) =>
      l
        .split(" ")
        .map((x) => x.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .map((x) => (/[.!?:;…»"’)]$/.test(x) ? x : x + "."))
        .join(" ")
    )
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l && !/^https?:\/\//.test(l) && /\p{L}/u.test(l));
}

// Zones d'une page complète : l'accueil (sans le hall) et chaque salle.
function zonesPage(html) {
  const zones = {};
  const accueil = html.match(/<div class="presentation">([\s\S]*?)<div class="hall"/);
  if (accueil) zones.accueil = paragraphes(accueil[1]);
  for (const m of html.matchAll(/<section class="section[^"]*" id="([a-z]+)" data-salle="\1" data-titre="([^"]*)">([\s\S]*?)<\/section>\n/g)) {
    zones[m[1]] = paragraphes(m[3]);
  }
  return zones;
}

// Zones de la page FALC : un bloc par partie.
function zonesFalc(html) {
  const zones = {};
  for (const m of html.matchAll(/<section class="bloc-falc" id="(bloc-\d+)"[^>]*>([\s\S]*?)<\/section>/g)) zones[m[1]] = paragraphes(m[2]);
  return zones;
}

module.exports = { zonesPage, zonesFalc, paragraphes };
