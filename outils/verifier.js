// Contrôles avant publication : pages produites, liens internes, langues, données à ne jamais publier.
"use strict";
const fs = require("fs");
const path = require("path");
const { fr, en, es, LANGUES } = require("./contenu");

const RACINE = path.join(__dirname, "..");
const zh = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", "zh.json"), "utf8"));
const ar = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", "ar.json"), "utf8"));
const ru = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", "ru.json"), "utf8"));
const resultats = [];
const verifier = (nom, ok, detail = "") => resultats.push({ nom, ok: !!ok, detail });

const forme = (v) =>
  Array.isArray(v) ? "[" + v.map(forme).join(",") + "]" : v && typeof v === "object" ? "{" + Object.keys(v).sort().map((k) => k + ":" + forme(v[k])).join(",") + "}" : typeof v;
for (const [nom, c] of Object.entries({ en, es, zh, ar, ru })) {
  verifier(`structure ${nom} identique au français`, forme(c) === forme(fr));
  verifier(`navigation ${nom} : identifiants conservés`, c.nav.every((x, i) => x[0] === fr.nav[i][0]));
}

const pages = LANGUES.map((l) => path.join(l.dossier, "index.html")).concat("404.html");
const html = {};
for (const p of pages) {
  const f = path.join(RACINE, p);
  verifier(`page ${p} produite`, fs.existsSync(f));
  if (fs.existsSync(f)) html[p] = fs.readFileSync(f, "utf8");
}

const INTERDITS = [
  [/Lanaudi[eè]re/i, "région du terrain"],
  [/2026[–-]2029/, "calendrier de thèse"],
  [/27 octobre/, "présentation du protocole"],
  [/attestation[^<]{0,40}MobilizeU|MobilizeU[^<]{0,40}attestation/i, "attestation MobilizeU"],
  [/Per aspera ad astra/, "ancienne devise"],
];
for (const [p, h] of Object.entries(html)) {
  for (const [motif, quoi] of INTERDITS) verifier(`${p} sans ${quoi}`, !motif.test(h));
  const courriels = [...new Set((h.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []).filter((m) => !/\.(png|jpg|svg)$/.test(m)))];
  verifier(`${p} : seul son courriel apparaît`, courriels.every((m) => m === "eric.bernier.1@umontreal.ca" || m === "RDVavecEricBernier@umontreal.ca"), courriels.join(", "));
  const dossier = path.dirname(path.join(RACINE, p));
  const internes = [...h.matchAll(/(?:href|src)="([^"#:]+?)(?:\?[^"]*)?(?:#[^"]*)?"/g)].map((m) => m[1]).filter((u) => u && !u.startsWith("//"));
  const manquants = internes.filter((u) => {
    const cible = u.startsWith("/") ? path.join(RACINE, u) : path.join(dossier, u);
    return !fs.existsSync(cible) && !fs.existsSync(path.join(cible, "index.html"));
  });
  verifier(`${p} : liens internes valides`, manquants.length === 0, manquants.join(", "));
}

for (const l of LANGUES.filter((x) => x.hreflang)) {
  const h = html[path.join(l.dossier, "index.html")];
  verifier(`${l.code} : attribut lang`, h && h.includes(`<html lang="${l.code === "zh" ? "zh-Hans" : l.code}"`));
  verifier(`${l.code} : liens hreflang vers toutes les langues`, h && LANGUES.filter((x) => x.hreflang).every((x) => h.includes(`hreflang="${x.hreflang}" href=`)));
  verifier(`${l.code} : affiche disponible`, h && h.includes(`affiche-releve/img/affiche-${l.code === "ru" ? "fr" : l.code}.png`));
  const section = (id) => ((h || "").match(new RegExp(`<section[^>]+id="${id}"[\\s\\S]*?(?=<section|<footer|$)`)) || [""])[0];
  verifier(`${l.code} : travaux hors de la thèse`, !section("recherche").includes('class="travaux"'));
  verifier(`${l.code} : méthodologie du protocole complète`, ["40–80", "15–25", "15–20", "Covidence", "Gravity Project", "REDCap", "Framework Method", "QAP"].every((t) => section("recherche").includes(t)));
  verifier(`${l.code} : SNA égocentré sur le CLSC`, section("recherche").includes({fr: "réseau égocentré", en: "CLSC ego network", es: "red egocéntrica", zh: "自我中心网络", ar: "شبكة متمركزة حول الذات", ru: "Эгоцентрированная сеть"}[l.code]));
  verifier(`${l.code} : travaux avec les axes, hors de la posture`, section("axes").includes('class="travaux"') && !section("approche").includes('class="travaux"'));
  const groupes = [...(h || "").matchAll(/data-salle="([a-z]+)"[^>]*data-sections="([^"]+)"/g)];
  const sallesGroupe = (g) => (groupes.find((m) => m[1] === g) || ["", "", ""])[2].split(" ");
  verifier(`${l.code} : innovations dans la première porte`, sallesGroupe("recherche").includes("outils") && !sallesGroupe("implantation").includes("outils"));
  verifier(`${l.code} : axes dans une sous-catégorie distincte`, sallesGroupe("recherche").includes("axes"));
  verifier(`${l.code} : enseignement et vulgarisation distincts`, sallesGroupe("implantation").includes("transmission") && sallesGroupe("implantation").includes("vulgarisation") && section("transmission").includes("SPU 7001") && !section("vulgarisation").includes("SPU 7001"));
  verifier(`${l.code} : sources pédagogiques et de communication`, section("transmission").includes("10.1073/pnas.1319030111") && section("transmission").includes("udlguidelines.cast.org") && section("vulgarisation").includes("www.cdc.gov/ccindex") && section("vulgarisation").includes("www.w3.org/WAI/media/av/"));
  const icone = (h.match(/rel="icon" href="([^"]+)"/) || [])[1];
  verifier(`${l.code} : même logo pour le site et l'onglet`, !!icone && h.includes(`src="${icone}" alt="EB"`));
  verifier(`${l.code} : applications présentes dans Innovations`, section("outils").includes('class="projet projet-ownnight"') && section("outils").includes('class="projet projet-spheres"'));
  verifier(`${l.code} : posture et méthodes séparées`, sallesGroupe("recherche").includes("methodes") && !section("approche").includes('class="methodes"') && !section("approche").includes('class="boite-outils"') && section("methodes").includes('class="methodes"') && section("methodes").includes('class="boite-outils"'));
  verifier(`${l.code} : posture centrée sur la recherche`, !section("approche").includes('class="expertises"') && section("approche").includes('class="piliers piliers-posture"'));
  verifier(`${l.code} : expertises professionnelles dans Parcours`, ["juriste", "gestionnaire", "educateur", "entrepreneuriat"].every((id) => sallesGroupe("parcours").includes(id) && section(id).includes('class="vitrine-liste"')));
}
verifier("arabe de droite à gauche", html[path.join("ar", "index.html")].includes('dir="rtl"'));
verifier("Nadia Sourial agrégée", html["index.html"].includes("Professeure agrégée"));
verifier("titres avec entrepreneur", html["index.html"].includes("Doctorant en santé publique (2e année) · Juriste · Entrepreneur · Éducateur spécialisé"));

const echecs = resultats.filter((r) => !r.ok);
for (const r of echecs) console.log("ÉCHEC", r.nom, r.detail);
console.log(`${resultats.length - echecs.length}/${resultats.length} contrôles réussis`);
process.exitCode = echecs.length ? 1 : 0;
