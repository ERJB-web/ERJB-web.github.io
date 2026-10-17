// Revue de presse santé : lit les flux des médias, les classe par rubrique et écrit le JSON lu par la page d'accueil.
// Usage : node outils/revue-presse.mjs [edition-precedente.json] [sortie.json]
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const [, , cheminPrecedent = "", cheminSortie = "assets/revue-presse.json"] = process.argv;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
const RC = "https://ici.radio-canada.ca/info/rss/";
const LD = "https://www.ledevoir.com/rss/";

const SOURCES = [
  { id: "rc-sante", nom: "Radio-Canada", groupe: "rc", url: RC + "sante/en-continu", type: "sante" },
  { id: "lp-sante", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/actualites/sante/rss", type: "sante" },
  { id: "ld-sante", nom: "Le Devoir", groupe: "ld", url: LD + "section/actualites/sante.xml", type: "sante" },
  { id: "jdm-sante", nom: "Le Journal de Montréal", groupe: "qmi", url: "https://www.journaldemontreal.com/actualite/sante/rss.xml", type: "sante" },
  { id: "tva-sante", nom: "TVA Nouvelles", groupe: "qmi", url: "https://www.tvanouvelles.ca/actualites/sante/rss.xml", type: "sante" },
  { id: "lactualite", nom: "L’actualité", groupe: "lact", url: "https://lactualite.com/sante-et-science/feed/", type: "sante" },
  { id: "rc-quebec", nom: "Radio-Canada", groupe: "rc", url: RC + "quebec/en-continu", type: "general", quebec: true },
  { id: "rc-montreal", nom: "Radio-Canada", groupe: "rc", url: RC + "grandmontreal/en-continu", type: "general", quebec: true },
  { id: "lp-actualites", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/actualites/rss", type: "general" },
  { id: "ld-manchettes", nom: "Le Devoir", groupe: "ld", url: LD + "manchettes.xml", type: "general" },
  { id: "metro", nom: "Métro", groupe: "metro", url: "https://journalmetro.com/feed/", type: "general", quebec: true },
  { id: "rc-science", nom: "Radio-Canada", groupe: "rc", url: RC + "science/en-continu", type: "science" },
  { id: "lp-sciences", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/actualites/sciences/rss", type: "science" },
  { id: "ld-science", nom: "Le Devoir", groupe: "ld", url: LD + "section/actualites/science.xml", type: "science" },
  { id: "qs", nom: "Québec Science", groupe: "qs", url: "https://www.quebecscience.qc.ca/feed/", type: "science" },
  { id: "asp", nom: "Agence Science-Presse", groupe: "asp", url: "https://www.sciencepresse.qc.ca/rss.xml", type: "science" },
  { id: "ld-idees", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/idees.xml", type: "opinion" },
  { id: "ld-lettres", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/lettres.xml", type: "opinion" },
  { id: "ld-libre", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/libre-opinion.xml", type: "opinion" },
  { id: "ld-editoriaux", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/editoriaux.xml", type: "opinion" },
  { id: "lp-dialogue", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/dialogue/rss", type: "opinion" },
  { id: "conversation", nom: "La Conversation", groupe: "tc", url: "https://theconversation.com/ca-fr/sante/articles.atom", type: "analyse" },
  { id: "gc-sante", nom: "Gouvernement du Canada", groupe: "gc", url: "https://api.io.canada.ca/io-server/gc/news/fr/v2?topic=health&sort=publishedDate&orderBy=desc&pick=30&format=atom", type: "institution" },
  { id: "frq", nom: "Fonds de recherche du Québec", groupe: "frq", url: "https://frq.gouv.qc.ca/feed/", type: "institution" },
  { id: "inspq-publications", nom: "INSPQ", groupe: "inspq", url: "https://www.inspq.qc.ca/nos-productions/publications/rss.xml", type: "institution" },
  { id: "inspq-nouvelles", nom: "INSPQ", groupe: "inspq", url: "https://www.inspq.qc.ca/nouvelles/rss.xml", type: "institution" },
  { id: "sq-communiques", nom: "Santé Québec", groupe: "sq", url: "https://sante.quebec/actualites/communiques-presse/", type: "institution", page: "santeQuebec" },
  { id: "sq-nouvelles", nom: "Santé Québec", groupe: "sq", url: "https://sante.quebec/actualites/nouvelles/", type: "institution", page: "santeQuebec" },
];
// sante.quebec demande 30 s entre deux requêtes (robots.txt).
const DELAI_PAGES = 31000;

const PUBMED = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
const EXCLUS_PUBMED = ' AND journal article[pt] NOT (comment[pt] OR editorial[pt] OR letter[pt] OR news[pt] OR published erratum[pt] OR retraction of publication[pt] OR expression of concern[pt] OR interview[pt] OR biography[pt]) AND hasabstract';
const REQUETES_PUBMED = [
  {
    cle: "revues",
    jours: 7,
    terme: '("N Engl J Med"[ta] OR "Lancet"[ta] OR "JAMA"[ta] OR "BMJ"[ta] OR "Nat Med"[ta] OR "CMAJ"[ta] OR "Lancet Public Health"[ta] OR "Lancet Glob Health"[ta] OR "Am J Public Health"[ta] OR "Can J Public Health"[ta])' + EXCLUS_PUBMED,
  },
  {
    cle: "inspq",
    jours: 30,
    terme: '"Institut national de sante publique du Quebec"[ad]' + EXCLUS_PUBMED,
  },
  {
    cle: "quebec",
    jours: 14,
    terme: '(Montreal[ad] OR Quebec[ad] OR Sherbrooke[ad] OR Laval[ad] OR "Trois-Rivieres"[ad] OR Rimouski[ad] OR Chicoutimi[ad] OR Gatineau[ad]) AND ("public health"[tiab] OR "population health"[tiab] OR "primary care"[tiab] OR "primary health care"[tiab] OR "health services"[tiab] OR "health policy"[tiab] OR "health system"[tiab] OR "social needs"[tiab] OR "social determinants"[tiab] OR "health equity"[tiab] OR "health inequalities"[tiab] OR epidemiolog*[tiab] OR "home care"[tiab] OR "integrated care"[tiab])' + EXCLUS_PUBMED,
  },
];

const HEURE = 3600e3;
const maintenant = Date.now();

const sansAccents = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, " ");
const motif = liste => new RegExp("(?:^|[^a-z0-9])(?:" + liste.join("|") + ")", "i");

const SANTE = motif(["sante", "hopita", "urgences?\\b", "medec", "medic", "infirmi", "patient", "soins?\\b", "soignant", "clinique", "clsc", "ciusss", "cisss", "gmf\\b", "chsld", "rpa\\b", "pharmac", "vaccin", "maladi", "cancer", "tumeur", "virus", "viral", "grippe", "covid", "rougeole", "ebola", "mpox", "epidem", "pandem", "eclosion", "infecti", "bacteri", "antibio", "psychiatr", "psycholog", "depressi", "anxi", "suicid", "dependanc", "surdose", "opioide", "fentanyl", "tabac", "vapot", "chirurg", "diagnos", "traitement", "therap", "nutrition", "obesit", "diabet", "cardiaq", "cardio", "alzheimer", "demence", "avc\\b", "greffe", "don d organe", "grossesse", "accouch", "postpartum", "sage-femme", "ramq", "inspq", "msss", "inesss", "itineran", "autism", "chum\\b", "cusm", "sainte-justine", "ambulanc", "paramedic", "vieilliss", "longevit", "sommeil", "sedentar", "listeri", "salmonell", "mortalite", "esperance de vie", "proche aidant", "aines", "dentist", "optometr", "physiotherap", "sante publique", "deces"]);
const QUEBEC = motif(["quebec", "montreal", "laval\\b", "gatineau", "sherbrooke", "saguenay", "trois-rivieres", "rimouski", "levis", "longueuil", "estrie", "monteregie", "laurentides", "lanaudiere", "outaouais", "abitibi", "gaspesie", "cote-nord", "nunavik", "mauricie", "chaudiere-appalaches", "capitale-nationale", "bas-saint-laurent", "ciusss", "cisss", "chsld", "ramq", "inspq", "msss", "inesss", "sante quebec", "chum\\b", "cusm", "sainte-justine", "hema-quebec", "assemblee nationale", "gmf\\b", "clsc", "frq\\b"]);
const DEBAT = motif(["debat", "controvers", "polemi", "critiqu", "denonc", "reclam", "s oppos", "opposition", "reforme", "projet de loi", "petition", "plaidoyer", "lettre ouverte", "faut-il", "doit-on", "remise en question", "inquietude", "deplor", "appel a"]);
const DECOUVERTE = motif(["etude", "chercheu", "decouv", "percee", "essai clinique", "scientifi", "recherche", "molecule", "genetiq", "genome", "cellul", "prometteu", "premiere mondiale", "nouveau traitement", "nouvelle therap", "intelligence artificielle", "ia\\b", "biomarqueur", "neuron", "microbiote", "anticorps"]);
const POSITIF = motif(["percee", "gueri", "guerison", "succes", "reussi", "espoir", "prometteu", "efficac", "sauve", "sauver", "don\\b", "don d", "greffe", "survi", "remission", "recul", "amelior", "innovation", "premiere mondiale", "gratuit", "elargi", "investi", "financement", "soutien", "benevol", "solidarit", "laureat", "distingu", "eradiq", "terminee", "declaree terminee", "bonne nouvelle", "bienfait", "benefi", "soulag", "autonomie", "retrouver", "nouvelle clinique", "ouverture", "recrut", "meilleurs soins", "plus de professionnels", "prevenir", "protege", "progres", "avancee", "celebr", "record de dons", "retour a domicile", "reduire", "reduit"]);
const NEGATIF = motif(["deces", "mort", "meurt", "decede", "tue", "victime", "crise", "penurie", "attente", "greve", "rupture", "eclosion", "epidemie", "cas de", "rappel", "risque", "danger", "alerte", "radie", "fraude", "poursuit", "poursuite", "compression", "coupe", "ferme", "fermeture", "deborde", "surcharg", "violence", "viol\\b", "agress", "abus", "suicid", "surdose", "inquiet", "menace", "grave", "hausse", "complication", "retard", "erreur", "scandal", "plainte", "enquete", "accus", "condamn", "deficit", "manque", "demission", "epuise", "detresse", "intoxic", "contamin", "listeri", "salmonell", "ebola", "effets secondaires", "difficile", "sombre", "drame", "tragedie", "meurtr", "cancer", "ne pas", "pire", "echec", "perte", "perd"]);

const ENTITES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", hellip: "…", ndash: "–", mdash: "—", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç", ecirc: "ê", ocirc: "ô", icirc: "î" };
const texte = s => (s || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&([a-z]+);/gi, (m, e) => ENTITES[e.toLowerCase()] ?? m)
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const balise = (x, nom) => {
  const m = x.match(new RegExp(`<${nom}(?:\\s[^>]*)?>([\\s\\S]*?)</${nom}>`, "i"));
  return m ? m[1] : "";
};
const lien = x => {
  const atom = x.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)/i) || x.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (atom) return texte(atom[1]);
  const rss = texte(balise(x, "link"));
  if (/^https?:/.test(rss)) return rss;
  const guid = texte(balise(x, "guid"));
  return /^https?:/.test(guid) ? guid : "";
};

async function lire(url, essais = 2) {
  for (let i = 0; i < essais; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, */*" }, signal: AbortSignal.timeout(20000), redirect: "follow" });
      if (r.ok) return await r.text();
      if (r.status < 500) return "";
    } catch {}
    await new Promise(f => setTimeout(f, 1500));
  }
  return "";
}

const MOIS = { janv: 0, fevr: 1, mars: 2, avr: 3, mai: 4, juin: 5, juil: 6, aout: 7, sept: 8, oct: 9, nov: 10, dec: 11 };
function dateFrancaise(s) {
  const m = sansAccents(s).match(/(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})/);
  if (!m || !(m[2] in MOIS)) return null;
  return new Date(Date.UTC(+m[3], MOIS[m[2]], +m[1], 16));
}

function analyserSanteQuebec(html, source) {
  const cartes = html.matchAll(/<a href="(\/actualites\/(?:communiques-presse|nouvelles)\/[^"]+)"[^>]*data-component_section="(?:article|tuile)"[^>]*>([\s\S]*?)<\/a>/g);
  return [...cartes].map(([, chemin, bloc]) => {
    const titre = texte((bloc.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1]);
    const date = dateFrancaise((bloc.match(/<span[^>]*>\s*(\d{1,2}\s+[^<\d]{3,10}\s+\d{4})\s*<\/span>/) || [])[1] || "");
    return { t: titre, u: "https://sante.quebec" + chemin, s: source.nom, g: source.groupe, src: source.id, type: source.type, quebecSource: true, d: date, resume: "" };
  }).filter(a => a.t && a.d);
}

function analyser(xml, source) {
  if (source.page === "santeQuebec") return analyserSanteQuebec(xml, source);
  const blocs = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blocs.map(b => {
    const titre = texte(balise(b, "title"));
    const resume = texte(balise(b, "description") || balise(b, "summary") || balise(b, "content")).slice(0, 600);
    const brute = texte(balise(b, "pubDate") || balise(b, "published") || balise(b, "updated") || balise(b, "dc:date"));
    const date = new Date(brute);
    return { t: titre, u: lien(b), s: source.nom, g: source.groupe, src: source.id, type: source.type, quebecSource: !!source.quebec, d: isNaN(date) ? null : date, resume };
  }).filter(a => a.t && a.u && a.d && a.d.getTime() <= maintenant + HEURE);
}

const normaliserUrl = u => u.replace(/[?#].*$/, "").replace(/\/$/, "").toLowerCase();
const MOTS_VIDES = new Set("les des une pour avec dans sur par plus que qui aux son ses est sont pas leur leurs cette ces elle ils elles nous vous mais comme entre sans sous vers chez apres avant tout tous toute toutes deja encore aussi selon quand dont fait faire peut doit etre avoir ete".split(" "));
const jetons = t => new Set(sansAccents(t).replace(/[^a-z0-9 -]/g, " ").split(/\s+/).filter(m => m.length >= 4 && !MOTS_VIDES.has(m)).map(m => m.slice(0, 7)));
const ressemblance = (a, b) => {
  let commun = 0;
  for (const m of a) if (b.has(m)) commun++;
  const union = a.size + b.size - commun;
  return { commun, jaccard: union ? commun / union : 0 };
};

const rechercheTexte = a => sansAccents(a.t + " " + a.resume);
const estSante = a => a.type === "sante" || a.type === "analyse" || SANTE.test(rechercheTexte(a));
const estSanteTitre = a => SANTE.test(sansAccents(a.t));
const recent = (a, heures) => maintenant - a.d.getTime() <= heures * HEURE;
const compter = (re, s) => (s.match(new RegExp(re.source, "gi")) || []).length;

function alterner(articles, max, cleGroupe = a => a.g) {
  const files = new Map();
  for (const a of articles) {
    const k = cleGroupe(a);
    if (!files.has(k)) files.set(k, []);
    files.get(k).push(a);
  }
  const sortie = [];
  while (sortie.length < max && [...files.values()].some(f => f.length)) {
    for (const f of files.values()) if (f.length && sortie.length < max) sortie.push(f.shift());
  }
  return sortie;
}

function regrouper(articles) {
  const groupes = [];
  for (const a of articles) {
    const j = jetons(a.t);
    const cible = groupes.find(g => g.membres.some(m => {
      const r = ressemblance(j, m.j);
      return r.jaccard >= 0.34 || r.commun >= 3;
    }));
    if (cible) cible.membres.push({ a, j });
    else groupes.push({ membres: [{ a, j }] });
  }
  return groupes.map(g => {
    const medias = new Set(g.membres.map(m => m.a.g));
    const dernier = Math.max(...g.membres.map(m => m.a.d.getTime()));
    const ordre = ["rc", "ld", "lp", "lact", "qmi", "metro"];
    const tete = [...g.membres].sort((x, y) => ordre.indexOf(x.a.g) - ordre.indexOf(y.a.g) || y.a.d - x.a.d)[0].a;
    return { tete, n: medias.size, dernier };
  });
}

function premierePhrase(s, derniere = false) {
  const phrases = (s.match(/[^.!?]{20,}?[.!?](?=\s+[A-ZÀ-ÖØ-Þ«“"(]|\s*$)/g) || [s]).map(p => p.trim()).filter(p => p.length >= 40);
  if (!phrases.length) return "";
  const p = derniere ? phrases[phrases.length - 1] : phrases[0];
  return p.length <= 200 ? p : p.slice(0, 190).replace(/\s+\S*$/, "") + " …";
}

function extrait(a) {
  let s = (a.resume || "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/(L’article|L'article|The post) .{0,200}(est apparu en premier sur|appeared first on) .*$/i, "")
    .replace(/\s*(Lire la suite|Lire l’article|Continuer la lecture|Read more)\b.*$/i, "")
    .replace(/\s*(\[…\]|\[\.\.\.\]|\[&#8230;\])\s*$/, "")
    .trim();
  if (sansAccents(s).startsWith(sansAccents(a.t))) s = s.slice(a.t.length).replace(/^[\s:.,–—|-]+/, "");
  if (s.length < 40) return "";
  return premierePhrase(s);
}

const sortir = a => {
  const x = a.x ?? extrait(a);
  return { t: a.t, u: a.u, s: a.s, d: a.d.toISOString(), ...(x ? { x } : {}), ...(a.n > 1 ? { n: a.n } : {}), ...(a.r ? { r: a.r } : {}), ...(a.q ? { q: 1 } : {}), ...(a.i ? { i: 1 } : {}) };
};

async function conclusions(articles) {
  const ids = articles.map(a => a.pmid).filter(Boolean);
  if (!ids.length) return;
  const xml = await lire(PUBMED + "efetch.fcgi?" + new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "xml", rettype: "abstract", tool: "revue-presse-sante" }));
  const trouves = {};
  for (const bloc of xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []) {
    const pmid = (bloc.match(/<PMID[^>]*>(\d+)<\/PMID>/) || [])[1];
    const parties = [...bloc.matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)]
      .map(m => ({
        etiquette: (m[1].match(/Label="([^"]+)"/) || [])[1] || "",
        texte: texte(m[2]).replace(/https?:\/\/\S+/g, "").replace(/\([^()]*\b(?:doi|Am J Public Health|PROSPERO|ClinicalTrials\.gov|NCT\d{6,})[^()]*\)?\.?/gi, "").replace(/\s+/g, " ").trim(),
      }))
      .filter(p => p.texte);
    if (!pmid || !parties.length) continue;
    const conclusion = parties.find(p => /CONCLUSION|INTERPRETATION/i.test(p.etiquette));
    trouves[pmid] = conclusion ? premierePhrase(conclusion.texte) : premierePhrase(parties.map(p => p.texte).join(" "), true);
  }
  for (const a of articles) if (trouves[a.pmid]) a.x = trouves[a.pmid];
}

async function pubmed() {
  const resultats = {};
  for (const req of REQUETES_PUBMED) {
    const p = new URLSearchParams({ db: "pubmed", term: req.terme, reldate: String(req.jours), datetype: "edat", retmax: "60", retmode: "json", tool: "revue-presse-sante" });
    const recherche = JSON.parse((await lire(PUBMED + "esearch.fcgi?" + p)) || "{}");
    const ids = recherche.esearchresult?.idlist || [];
    await new Promise(f => setTimeout(f, 400));
    if (!ids.length) { resultats[req.cle] = []; continue; }
    const resume = JSON.parse((await lire(PUBMED + "esummary.fcgi?" + new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json", tool: "revue-presse-sante" }))) || "{}");
    await new Promise(f => setTimeout(f, 400));
    const fiches = (resume.result?.uids || []).map(uid => resume.result[uid]).filter(Boolean);
    resultats[req.cle] = fiches.map(f => {
      const entree = (f.history || []).find(h => h.pubstatus === "entrez")?.date || f.sortpubdate;
      const date = new Date((entree || "").replace(/\//g, "-").replace(" ", "T"));
      const types = (f.pubtype || []).join(" ");
      const poids = /Randomized Controlled Trial/.test(types) ? 3 : /Systematic Review|Meta-Analysis/.test(types) ? 3 : /Clinical Trial|Observational/.test(types) ? 2 : 1;
      return { t: texte(f.title).replace(/\.$/, ""), u: `https://pubmed.ncbi.nlm.nih.gov/${f.uid}/`, pmid: f.uid, s: "PubMed", r: f.source, g: f.source, d: isNaN(date) ? new Date(maintenant) : date, poids, q: req.cle === "quebec" };
    }).filter(a => a.t && !/^(correction|erratum|retraction|reply|response)/i.test(a.t));
  }
  return resultats;
}

function bonneNouvelle(articles, precedente, jour) {
  if (precedente?.bonne?.jour === jour && precedente.bonne.u) {
    const meme = articles.find(a => normaliserUrl(a.u) === normaliserUrl(precedente.bonne.u));
    const x = precedente.bonne.x || (meme && extrait(meme));
    return { ...precedente.bonne, ...(x ? { x } : {}) };
  }
  const dejaVues = new Set((precedente?.bonnesRecentes || []).map(normaliserUrl));
  const candidates = articles
    .filter(a => estSante(a) && a.type !== "opinion" && !dejaVues.has(normaliserUrl(a.u)))
    .map(a => {
      const titre = sansAccents(a.t), tout = rechercheTexte(a);
      const pos = compter(POSITIF, titre) * 2 + compter(POSITIF, tout);
      const neg = compter(NEGATIF, titre) * 2 + compter(NEGATIF, sansAccents(a.resume));
      return { a, pos, neg, score: pos - 1.5 * neg };
    })
    .filter(c => c.pos >= 2 && compter(NEGATIF, sansAccents(c.a.t)) === 0);
  for (const fenetre of [36, 96, 24 * 7]) {
    const choix = candidates.filter(c => recent(c.a, fenetre)).sort((x, y) => y.score - x.score || y.a.d - x.a.d)[0];
    if (choix && choix.score > 0) return { jour, ...sortir(choix.a) };
  }
  return precedente?.bonne?.u ? precedente.bonne : null;
}

async function principal() {
  let precedente = null;
  if (cheminPrecedent) {
    try { precedente = JSON.parse(await readFile(cheminPrecedent, "utf8")); } catch {}
  }
  const pages = async () => {
    const sortie = [];
    for (const s of SOURCES.filter(s => s.page)) {
      if (sortie.length) await new Promise(f => setTimeout(f, DELAI_PAGES));
      sortie.push({ s, xml: await lire(s.url, 1) });
    }
    return sortie;
  };
  const [flux, lesPages] = await Promise.all([
    Promise.all(SOURCES.filter(s => !s.page).map(async s => ({ s, xml: await lire(s.url) }))),
    pages(),
  ]);
  const lus = [...flux, ...lesPages];
  const etat = {};
  const vus = new Set();
  const articles = [];
  for (const { s, xml } of lus) {
    const liste = analyser(xml, s);
    etat[s.id] = liste.length;
    for (const a of liste) {
      const k = normaliserUrl(a.u), kt = sansAccents(a.t);
      if (vus.has(k) || vus.has(kt)) continue;
      vus.add(k); vus.add(kt);
      articles.push(a);
    }
  }
  articles.sort((x, y) => y.d - x.d);

  const nouvelles = articles.filter(a => a.type === "sante" || (a.type === "general" && estSanteTitre(a) && compter(SANTE, rechercheTexte(a)) >= 2));
  let fenetre = 24, une = [];
  while (fenetre <= 96) {
    une = regrouper(nouvelles.filter(a => recent(a, fenetre)));
    if (une.length >= 6) break;
    fenetre *= 2;
  }
  const repris = une.filter(g => g.n > 1).sort((x, y) => y.n - x.n || y.dernier - x.dernier).map(g => ({ ...g.tete, n: g.n }));
  const seuls = une.filter(g => g.n === 1).sort((x, y) => y.dernier - x.dernier).map(g => g.tete);
  une = [...repris, ...alterner(seuls, 6)].slice(0, 6);

  const quebec = alterner(
    nouvelles.filter(a => recent(a, 72) && (QUEBEC.test(rechercheTexte(a)) || a.quebecSource)),
    8,
  );

  const debats = alterner(
    articles.filter(a => recent(a, 24 * 7) && (
      ((a.type === "opinion") && SANTE.test(sansAccents(a.t + " " + a.resume)) && estSanteTitre(a)) ||
      a.type === "analyse" ||
      ((a.type === "sante" || a.type === "general") && estSanteTitre(a) && DEBAT.test(sansAccents(a.t)))
    )),
    8,
  );

  const decouvertes = alterner(
    articles
      .filter(a => recent(a, 24 * 7) && a.type !== "opinion" && a.type !== "institution" && (
        (a.type === "science" && (estSanteTitre(a) || (SANTE.test(rechercheTexte(a)) && DECOUVERTE.test(sansAccents(a.t))))) ||
        ((a.type === "sante" || a.type === "analyse") && DECOUVERTE.test(sansAccents(a.t)))
      ))
      .map(a => ({ a, score: compter(DECOUVERTE, sansAccents(a.t)) * 2 + compter(DECOUVERTE, sansAccents(a.resume)) + (estSanteTitre(a) ? 2 : 0) }))
      .sort((x, y) => y.score - x.score || y.a.d - x.a.d)
      .map(c => c.a),
    8,
  );

  const publications = alterner(
    articles.filter(a => a.type === "institution" && recent(a, 24 * 30) && (a.src !== "frq" || estSanteTitre(a))),
    8,
  );

  const pm = await pubmed();
  const revues = alterner([...(pm.revues || [])].sort((x, y) => y.poids - x.poids || y.d - x.d), 4, a => a.r);
  const inspq = (pm.inspq || []).sort((x, y) => y.d - x.d).slice(0, 2).map(a => ({ ...a, q: false, i: true }));
  const dejaPris = new Set(inspq.map(a => a.u));
  const quebecRecherche = (pm.quebec || []).filter(a => !dejaPris.has(a.u)).sort((x, y) => y.d - x.d).slice(0, 3);
  const recherche = [...revues, ...inspq, ...quebecRecherche];
  await conclusions(recherche);

  const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Montreal" }).format(new Date(maintenant));
  const bonne = bonneNouvelle(articles, precedente, jour);
  const bonnesRecentes = [...new Set([bonne?.u, ...(precedente?.bonnesRecentes || [])].filter(Boolean))].slice(0, 14);

  const rubriques = { une, quebec, debats, decouvertes, recherche, publications };
  for (const [cle, liste] of Object.entries(rubriques)) {
    rubriques[cle] = liste.map(sortir);
    if (!rubriques[cle].length && precedente?.rubriques?.[cle]?.length) rubriques[cle] = precedente.rubriques[cle];
  }

  const sortie = {
    maj: new Date(maintenant).toISOString(),
    bonne,
    rubriques,
    sources: [...new Set(SOURCES.map(s => s.nom)), "PubMed"],
    bonnesRecentes,
    etat,
  };
  await mkdir(dirname(cheminSortie), { recursive: true });
  await writeFile(cheminSortie, JSON.stringify(sortie, null, 1) + "\n");
  const total = Object.values(etat).reduce((x, y) => x + y, 0);
  console.log(`${articles.length} articles uniques (${total} lus) ; ` + Object.entries(rubriques).map(([k, v]) => `${k} ${v.length}`).join(", ") + ` ; bonne nouvelle : ${bonne ? bonne.t : "aucune"}`);
  const vides = Object.entries(etat).filter(([, n]) => !n).map(([k]) => k);
  if (vides.length) console.log("Flux sans article : " + vides.join(", "));
  if (total === 0) process.exitCode = 1;
}

await principal();
