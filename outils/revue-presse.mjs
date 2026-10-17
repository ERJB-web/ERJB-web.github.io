// Revue de presse : lit les flux des médias et des institutions, classe les articles par rubrique et écrit le JSON lu par la page d'accueil.
// Usage : node outils/revue-presse.mjs [edition-precedente.json] [sortie.json]
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const [, , cheminPrecedent = "", cheminSortie = "assets/revue-presse.json"] = process.argv;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
const RC = "https://ici.radio-canada.ca/info/rss/";
const LD = "https://www.ledevoir.com/rss/";
const TC = "https://theconversation.com/";

// zone : qc (Québec et Canada francophone), ca (Canada), fr (France), monde.
// type : sante (tout le flux est retenu), general (filtré par mots-clés), science, opinion, analyse, institution, loi, recherche.
const SOURCES = [
  { id: "rc-sante", nom: "Radio-Canada", groupe: "rc", url: RC + "sante/en-continu", zone: "qc", type: "sante" },
  { id: "lp-sante", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/actualites/sante/rss", zone: "qc", type: "sante" },
  { id: "ld-sante", nom: "Le Devoir", groupe: "ld", url: LD + "section/actualites/sante.xml", zone: "qc", type: "sante" },
  { id: "jdm-sante", nom: "Le Journal de Montréal", groupe: "qmi", url: "https://www.journaldemontreal.com/actualite/sante/rss.xml", zone: "qc", type: "sante" },
  { id: "tva-sante", nom: "TVA Nouvelles", groupe: "qmi", url: "https://www.tvanouvelles.ca/actualites/sante/rss.xml", zone: "qc", type: "sante" },
  { id: "lactualite", nom: "L’actualité", groupe: "lact", url: "https://lactualite.com/sante-et-science/feed/", zone: "qc", type: "sante" },
  { id: "rc-quebec", nom: "Radio-Canada", groupe: "rc", url: RC + "quebec/en-continu", zone: "qc", type: "general", quebec: true },
  { id: "rc-montreal", nom: "Radio-Canada", groupe: "rc", url: RC + "grandmontreal/en-continu", zone: "qc", type: "general", quebec: true },
  { id: "rc-societe", nom: "Radio-Canada", groupe: "rc", url: RC + "societe/en-continu", zone: "qc", type: "general" },
  { id: "lp-actualites", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/actualites/rss", zone: "qc", type: "general" },
  { id: "ld-manchettes", nom: "Le Devoir", groupe: "ld", url: LD + "manchettes.xml", zone: "qc", type: "general" },
  { id: "ld-societe", nom: "Le Devoir", groupe: "ld", url: LD + "section/actualites/societe.xml", zone: "qc", type: "general" },
  { id: "jdm-societe", nom: "Le Journal de Montréal", groupe: "qmi", url: "https://www.journaldemontreal.com/actualite/societe/rss.xml", zone: "qc", type: "general" },
  { id: "metro", nom: "Métro", groupe: "metro", url: "https://journalmetro.com/feed/", zone: "qc", type: "general", quebec: true },
  { id: "pivot", nom: "Pivot", groupe: "pivot", url: "https://pivot.quebec/feed/", zone: "qc", type: "general" },
  { id: "itineraire", nom: "L’Itinéraire", groupe: "itineraire", url: "https://itineraire.ca/feed/", zone: "qc", type: "general", quebec: true },
  { id: "rqaca", nom: "RQ-ACA", groupe: "rqaca", url: "https://rq-aca.org/feed/", zone: "qc", type: "sante", quebec: true },
  { id: "assnat", nom: "Assemblée nationale du Québec", groupe: "assnat", url: "https://www.assnat.qc.ca/fr/rss/SyndicationRSS-210.html", zone: "qc", type: "loi", quebec: true },
  { id: "sq-communiques", nom: "Santé Québec", groupe: "sq", url: "https://sante.quebec/actualites/communiques-presse/", zone: "qc", type: "institution", quebec: true, page: "santeQuebec", delai: 31000 },
  { id: "sq-nouvelles", nom: "Santé Québec", groupe: "sq", url: "https://sante.quebec/actualites/nouvelles/", zone: "qc", type: "institution", quebec: true, page: "santeQuebec", delai: 31000 },
  { id: "inspq-publications", nom: "INSPQ", groupe: "inspq", url: "https://www.inspq.qc.ca/nos-productions/publications/rss.xml", zone: "qc", type: "institution", quebec: true },
  { id: "inspq-nouvelles", nom: "INSPQ", groupe: "inspq", url: "https://www.inspq.qc.ca/nouvelles/rss.xml", zone: "qc", type: "institution", quebec: true },

  { id: "cbc-sante", nom: "CBC", groupe: "cbc", url: "https://www.cbc.ca/webfeed/rss/rss-health", zone: "ca", type: "sante", langue: "en" },
  { id: "global-sante", nom: "Global News", groupe: "global", url: "https://globalnews.ca/health/feed/", zone: "ca", type: "sante", langue: "en" },
  { id: "onfr", nom: "ONFR", groupe: "onfr", url: "https://onfr.tfo.org/feed/", zone: "ca", type: "general" },
  { id: "gc-sante", nom: "Gouvernement du Canada", groupe: "gc", url: "https://api.io.canada.ca/io-server/gc/news/fr/v2?topic=health&sort=publishedDate&orderBy=desc&pick=30&format=atom", zone: "ca", type: "institution" },
  { id: "tc-ca-en", nom: "The Conversation Canada", groupe: "tc-en", url: TC + "ca/health/articles.atom", zone: "ca", type: "analyse", langue: "en" },

  { id: "lemonde-sante", nom: "Le Monde", groupe: "lemonde", url: "https://www.lemonde.fr/sante/rss_full.xml", zone: "fr", type: "sante" },
  { id: "figaro-sante", nom: "Le Figaro", groupe: "figaro", url: "https://www.lefigaro.fr/rss/figaro_sante.xml", zone: "fr", type: "sante" },
  { id: "franceinfo-sante", nom: "franceinfo", groupe: "franceinfo", url: "https://www.francetvinfo.fr/sante.rss", zone: "fr", type: "sante" },
  { id: "liberation-sante", nom: "Libération", groupe: "liberation", url: "https://www.liberation.fr/arc/outboundfeeds/rss/category/societe/sante/?outputType=xml", zone: "fr", type: "sante" },
  { id: "qdm", nom: "Le Quotidien du médecin", groupe: "qdm", url: "https://www.lequotidiendumedecin.fr/rss.xml", zone: "fr", type: "sante" },
  { id: "infirmiers", nom: "Infirmiers.com", groupe: "infirmiers", url: "https://www.infirmiers.com/rss.xml", zone: "fr", type: "sante" },
  { id: "lemonde-societe", nom: "Le Monde", groupe: "lemonde", url: "https://www.lemonde.fr/societe/rss_full.xml", zone: "fr", type: "general" },
  { id: "franceinfo-societe", nom: "franceinfo", groupe: "franceinfo", url: "https://www.francetvinfo.fr/societe.rss", zone: "fr", type: "general" },
  { id: "spf", nom: "Santé publique France", groupe: "spf", url: "https://www.santepubliquefrance.fr/rss/actualites.xml", zone: "fr", type: "institution" },
  { id: "tc-fr", nom: "The Conversation France", groupe: "tc-fr", url: TC + "fr/sante/articles.atom", zone: "fr", type: "analyse" },

  { id: "ld-idees", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/idees.xml", zone: "qc", type: "opinion" },
  { id: "ld-lettres", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/lettres.xml", zone: "qc", type: "opinion" },
  { id: "ld-libre", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/libre-opinion.xml", zone: "qc", type: "opinion" },
  { id: "ld-editoriaux", nom: "Le Devoir", groupe: "ld", url: LD + "section/opinion/editoriaux.xml", zone: "qc", type: "opinion" },
  { id: "lp-dialogue", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/dialogue/rss", zone: "qc", type: "opinion" },
  { id: "tc-ca", nom: "La Conversation", groupe: "tc", url: TC + "ca-fr/sante/articles.atom", zone: "qc", type: "analyse" },

  { id: "rc-science", nom: "Radio-Canada", groupe: "rc", url: RC + "science/en-continu", zone: "monde", type: "science" },
  { id: "lp-sciences", nom: "La Presse", groupe: "lp", url: "https://www.lapresse.ca/actualites/sciences/rss", zone: "monde", type: "science" },
  { id: "ld-science", nom: "Le Devoir", groupe: "ld", url: LD + "section/actualites/science.xml", zone: "monde", type: "science" },
  { id: "qs", nom: "Québec Science", groupe: "qs", url: "https://www.quebecscience.qc.ca/feed/", zone: "monde", type: "science" },
  { id: "asp", nom: "Agence Science-Presse", groupe: "asp", url: "https://www.sciencepresse.qc.ca/rss.xml", zone: "monde", type: "science" },
  { id: "lemonde-sciences", nom: "Le Monde", groupe: "lemonde", url: "https://www.lemonde.fr/sciences/rss_full.xml", zone: "monde", type: "science" },
  { id: "sciencesetavenir", nom: "Sciences et Avenir", groupe: "sea", url: "https://www.sciencesetavenir.fr/sante/rss.xml", zone: "monde", type: "science" },
  { id: "futura", nom: "Futura", groupe: "futura", url: "https://www.futura-sciences.com/rss/sante/actualites.xml", zone: "monde", type: "science" },
  { id: "inserm", nom: "Inserm", groupe: "inserm", url: "https://www.inserm.fr/feed/", zone: "monde", type: "science" },
  { id: "sciencedaily", nom: "ScienceDaily", groupe: "sciencedaily", url: "https://www.sciencedaily.com/rss/health_medicine.xml", zone: "monde", type: "science", langue: "en" },
  { id: "medicalxpress", nom: "Medical Xpress", groupe: "medicalxpress", url: "https://medicalxpress.com/rss-feed/", zone: "monde", type: "science", langue: "en" },
  { id: "nature-medicine", nom: "Nature Medicine", groupe: "natmed", url: "https://www.nature.com/nm.rss", zone: "monde", type: "science", langue: "en" },

  { id: "crchum", nom: "CRCHUM", groupe: "crchum", url: "https://www.chumontreal.qc.ca/crchum/nouvelles", zone: "qc", type: "recherche", page: "chum", delai: 2000 },
  { id: "espum", nom: "ESPUM", groupe: "espum", url: "https://espum.umontreal.ca/lespum/nouvelles/", zone: "qc", type: "recherche", page: "espum", delai: 2000 },
  { id: "udem", nom: "UdeM Nouvelles", groupe: "udem", url: "https://nouvelles.umontreal.ca/", zone: "qc", type: "recherche", page: "udem", delai: 2000, filtre: true },
  { id: "frq", nom: "Fonds de recherche du Québec", groupe: "frq", url: "https://frq.gouv.qc.ca/feed/", zone: "qc", type: "recherche", filtre: true },
  { id: "inrs", nom: "INRS", groupe: "inrs", url: "https://inrs.ca/feed/", zone: "qc", type: "recherche", filtre: true },
];

const PUBMED = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
const EXCLUS_PUBMED = " AND journal article[pt] NOT (comment[pt] OR editorial[pt] OR letter[pt] OR news[pt] OR published erratum[pt] OR retraction of publication[pt] OR expression of concern[pt] OR interview[pt] OR biography[pt]) AND hasabstract";
// Recherche, santé, services sociaux et communautaires, toutes revues confondues ; PubMed classe par pertinence (Best Match).
const TERMES_DOMAINE = ["public health", "population health", "health services", "health policy", "health system", "health systems", "primary care", "primary health care", "social services", "social care", "social work", "community health", "community-based", "community organizations", "health equity", "health inequalities", "health inequities", "social determinants", "social needs", "integrated care", "home care", "long-term care", "mental health services", "health promotion", "implementation science"];
const domaine = champ => "(" + TERMES_DOMAINE.map(t => `"${t}"[${champ}]`).join(" OR ") + ")";
const LANGUES = " AND (english[la] OR french[la])";
const REQUETES_PUBMED = [
  { cle: "probantes", jours: 7, tri: "relevance", terme: domaine("tiab") + " AND (systematic review[pt] OR meta-analysis[pt] OR randomized controlled trial[pt])" + LANGUES + EXCLUS_PUBMED },
  { cle: "domaine", jours: 7, tri: "relevance", terme: domaine("ti") + LANGUES + EXCLUS_PUBMED },
  { cle: "crchum", jours: 14, terme: '("CRCHUM"[ad] OR "Centre de recherche du CHUM"[ad] OR "CHUM Research Centre"[ad] OR "Centre hospitalier de l\'Universite de Montreal"[ad])' + EXCLUS_PUBMED },
  { cle: "espum", jours: 45, terme: '("Ecole de sante publique de l\'Universite de Montreal"[ad] OR "School of Public Health, Universite de Montreal"[ad] OR "Universite de Montreal School of Public Health"[ad] OR ESPUM[ad])' + EXCLUS_PUBMED },
  { cle: "inspq", jours: 30, terme: '"Institut national de sante publique du Quebec"[ad]' + EXCLUS_PUBMED },
  { cle: "quebec", jours: 14, terme: '(Montreal[ad] OR Quebec[ad] OR Sherbrooke[ad] OR Laval[ad] OR "Trois-Rivieres"[ad] OR Rimouski[ad] OR Chicoutimi[ad] OR Gatineau[ad]) AND ("public health"[tiab] OR "population health"[tiab] OR "primary care"[tiab] OR "primary health care"[tiab] OR "health services"[tiab] OR "health policy"[tiab] OR "health system"[tiab] OR "social needs"[tiab] OR "social determinants"[tiab] OR "health equity"[tiab] OR "health inequalities"[tiab] OR epidemiolog*[tiab] OR "home care"[tiab] OR "integrated care"[tiab] OR "social services"[tiab] OR "community organizations"[tiab])' + EXCLUS_PUBMED },
];

const HEURE = 3600e3;
const JOUR = 24 * HEURE;
const maintenant = Date.now();

const sansAccents = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, " ");
const motif = liste => new RegExp("(?:^|[^a-z0-9])(?:" + liste.join("|") + ")", "i");

const SANTE = ["sante", "hopita", "urgences?\\b", "medec", "medic", "infirmi", "patient", "soins?\\b", "soignant", "clinique", "clsc", "ciusss", "cisss", "gmf\\b", "chsld", "rpa\\b", "pharmac", "vaccin", "maladi", "cancer", "tumeur", "virus", "viral", "grippe", "covid", "rougeole", "ebola", "mpox", "epidem", "pandem", "eclosion", "infecti", "bacteri", "antibio", "psychiatr", "psycholog", "depressi", "anxi", "suicid", "dependanc", "surdose", "opioide", "fentanyl", "tabac", "vapot", "chirurg", "diagnos", "traitement", "therap", "nutrition", "obesit", "diabet", "cardiaq", "cardio", "alzheimer", "demence", "avc\\b", "greffe", "don d organe", "grossesse", "accouch", "postpartum", "sage-femme", "ramq", "inspq", "msss", "inesss", "chum\\b", "cusm", "sainte-justine", "ambulanc", "paramedic", "vieilliss", "longevit", "sommeil", "sedentar", "listeri", "salmonell", "mortalite", "esperance de vie", "dentist", "optometr", "physiotherap", "deces", "menopause", "ehpad", "ars\\b", "assurance maladie", "assurance-maladie", "securite sociale", "plfss", "mutuelle", "deserts? medica", "aide-soignant"];
const SOCIAL = ["services sociaux", "travail social", "travailleu[rs]e?s? sociaux", "intervenant", "communautaire", "organismes?\\b", "banques? alimentaire", "insecurite alimentaire", "aide alimentaire", "itineran", "sans-abri", "refuge", "logement social", "logements sociaux", "hlm\\b", "pauvrete", "precarite", "aide sociale", "solidarite sociale", "dpj\\b", "protection de la jeunesse", "protection de l enfance", "violence conjugale", "maison d hebergement", "proches? aidant", "aines\\b", "personnes agees", "handicap", "deficience", "autism", "sante mentale", "toxicomanie", "benevol", "philanthrop", "centraide", "action communautaire", "economie sociale", "rsa\\b", "allocation", "inclusion sociale"];
const SECTEUR = motif([...SANTE, ...SOCIAL]);
const SANTE_SEULE = motif(SANTE);
const QUEBEC = motif(["quebec", "montreal", "laval\\b", "gatineau", "sherbrooke", "saguenay", "trois-rivieres", "rimouski", "levis", "longueuil", "estrie", "monteregie", "laurentides", "lanaudiere", "outaouais", "abitibi", "gaspesie", "cote-nord", "nunavik", "mauricie", "chaudiere-appalaches", "capitale-nationale", "bas-saint-laurent", "ciusss", "cisss", "chsld", "ramq", "inspq", "msss", "inesss", "sante quebec", "chum\\b", "cusm", "sainte-justine", "hema-quebec", "assemblee nationale", "gmf\\b", "clsc", "frq\\b", "dpj\\b"]);
const CANADA = motif(["canada", "canadien", "ottawa", "federa", "ontari", "alberta", "colombie-britannique", "british columbia", "manitoba", "saskatchewan", "nouvelle-ecosse", "nova scotia", "nouveau-brunswick", "new brunswick", "terre-neuve", "newfoundland", "ile-du-prince-edouard", "prince edward island", "yukon", "nunavut", "territoires du nord-ouest", "northwest territories", "toronto", "vancouver", "calgary", "edmonton", "winnipeg", "halifax", "regina", "saskatoon", "hamilton", "sante canada", "health canada", "aspc\\b", "phac\\b", "irsc\\b", "cihr\\b"]);
const DEBAT = motif(["debat", "controvers", "polemi", "critiqu", "denonc", "reclam", "s oppos", "opposition", "reforme", "projet de loi", "petition", "plaidoyer", "lettre ouverte", "faut-il", "doit-on", "remise en question", "inquietude", "deplor", "appel a", "mobilisation", "manifest"]);
const DECOUVERTE = motif(["etude", "chercheu", "decouv", "percee", "essai clinique", "scientifi", "recherche", "molecule", "genetiq", "genome", "cellul", "prometteu", "premiere mondiale", "nouveau traitement", "nouvelle therap", "intelligence artificielle", "ia\\b", "biomarqueur", "neuron", "microbiote", "anticorps"]);
const POSITIF = motif(["percee", "gueri", "guerison", "succes", "reussi", "espoir", "prometteu", "efficac", "sauve", "sauver", "don\\b", "don d", "greffe", "survi", "remission", "recul", "amelior", "innovation", "premiere mondiale", "gratuit", "elargi", "investi", "financement", "soutien", "benevol", "solidarit", "laureat", "distingu", "eradiq", "terminee", "declaree terminee", "bonne nouvelle", "bienfait", "benefi", "soulag", "autonomie", "retrouver", "nouvelle clinique", "ouverture", "recrut", "meilleurs soins", "plus de professionnels", "prevenir", "protege", "progres", "avancee", "celebr", "record de dons", "retour a domicile", "reduire", "reduit", "entraide"]);
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
const pause = ms => new Promise(f => setTimeout(f, ms));

async function lire(url, essais = 2) {
  for (let i = 0; i < essais; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, application/json, */*" }, signal: AbortSignal.timeout(20000), redirect: "follow" });
      if (r.ok) return await r.text();
      if (r.status < 500) return "";
    } catch {}
    await pause(1500);
  }
  return "";
}

const MOIS = ["janv", "fevr", "mars", "avr", "mai", "juin", "juil", "aout", "sept", "oct", "nov", "dec"];
function dateFrancaise(s) {
  const m = sansAccents(s || "").match(/(\d{1,2})(?:er)?\s+([a-z]+)\.?\s+(\d{4})/);
  const mois = m ? MOIS.findIndex(k => m[2].startsWith(k)) : -1;
  return mois < 0 ? null : new Date(Date.UTC(+m[3], mois, +m[1], 16));
}

const article = (source, titre, url, date, resume = "") => ({
  t: titre, u: url, s: source.nom, g: source.groupe, src: source.id, type: source.type, zone: source.zone,
  l: source.langue || "fr", quebecSource: !!source.quebec, filtre: !!source.filtre, d: date, resume,
});

const PAGES = {
  santeQuebec: (html, source) => [...html.matchAll(/<a href="(\/actualites\/(?:communiques-presse|nouvelles)\/[^"]+)"[^>]*data-component_section="(?:article|tuile)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, chemin, bloc]) => article(source, texte((bloc.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1]), "https://sante.quebec" + chemin,
      dateFrancaise((bloc.match(/<span[^>]*>\s*(\d{1,2}\s+[^<\d]{3,10}\s+\d{4})\s*<\/span>/) || [])[1]))),
  chum: (html, source) => [...html.matchAll(/<article[^>]*>\s*<a href="(\/actualites\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, chemin, bloc]) => article(source, texte((bloc.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]), "https://www.chumontreal.qc.ca" + chemin,
      dateFrancaise(texte((bloc.match(/<time[^>]*>([\s\S]*?)<\/time>/) || [])[1])))),
  espum: (html, source) => html.split(/itemtype="http:\/\/schema\.org\/Article"/).slice(1).map(bloc => {
    const a = bloc.match(/<a title="([^"]+)" href="(\/lespum\/nouvelles\/nouvelle\/news\/detail\/[^"]+)"/);
    const d = bloc.match(/datetime="(\d{4}-\d{2}-\d{2})"/);
    return a && d ? article(source, texte(a[1]), "https://espum.umontreal.ca" + a[2], new Date(d[1] + "T16:00:00Z")) : null;
  }).filter(Boolean),
  udem: (html, source) => {
    const vus = new Map();
    for (const [, chemin, a, m, j, bloc] of html.matchAll(/<a href="(\/article\/(\d{4})\/(\d{2})\/(\d{2})\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const morceaux = bloc.replace(/<!--[\s\S]*?-->/g, "").split(/<[^>]+>/).map(texte).filter(Boolean);
      const titre = morceaux.sort((x, y) => y.length - x.length)[0] || "";
      const rubrique = morceaux.length > 1 ? morceaux[morceaux.length - 1] : "";
      if (titre.length > (vus.get(chemin)?.t.length || 0)) vus.set(chemin, article(source, titre, "https://nouvelles.umontreal.ca" + chemin, new Date(`${a}-${m}-${j}T16:00:00Z`), rubrique));
    }
    return [...vus.values()];
  },
};

function analyser(xml, source) {
  const liste = source.page ? PAGES[source.page](xml, source) : (xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || []).map(b => {
    const date = new Date(texte(balise(b, "pubDate") || balise(b, "published") || balise(b, "updated") || balise(b, "dc:date")));
    return article(source, texte(balise(b, "title")), lien(b), isNaN(date) ? null : date,
      texte(balise(b, "description") || balise(b, "summary") || balise(b, "content")).slice(0, 600));
  });
  return liste.filter(a => a.t && a.u && a.d && !isNaN(a.d) && a.d.getTime() <= maintenant + HEURE);
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

const tout = a => sansAccents(a.t + " " + a.resume);
const titreSecteur = a => SECTEUR.test(sansAccents(a.t));
const recent = (a, heures) => maintenant - a.d.getTime() <= heures * HEURE;
const compter = (re, s) => (s.match(new RegExp(re.source, "gi")) || []).length;
// Un article d'un flux généraliste n'est retenu que si le secteur est dans le titre et revient dans le texte.
const dansLeSecteur = a => a.type === "sante" || a.l === "en" || (titreSecteur(a) && compter(SECTEUR, tout(a)) >= 2);

function region(a) {
  if (a.zone === "fr") return "france";
  const t = tout(a);
  if (a.zone === "ca" && !a.quebecSource) return QUEBEC.test(sansAccents(a.t)) && !/hors quebec/.test(t) ? "quebec" : "canada";
  if (a.quebecSource || (QUEBEC.test(t) && !/hors quebec/.test(t))) return "quebec";
  if (a.zone === "ca" || CANADA.test(t)) return "canada";
  return "monde";
}

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
  const ordre = ["rc", "ld", "lp", "lact", "qmi", "metro"];
  return groupes.map(g => {
    const tete = [...g.membres].sort((x, y) => ordre.indexOf(x.a.g) - ordre.indexOf(y.a.g) || y.a.d - x.a.d)[0].a;
    return { tete, n: new Set(g.membres.map(m => m.a.g)).size, dernier: Math.max(...g.membres.map(m => m.a.d.getTime())) };
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
    .replace(/\s*(Lire la suite|Lire l’article|Continuer la lecture|Read more|Continue reading)\b.*$/i, "")
    .replace(/\s*(\[…\]|\[\.\.\.\])\s*$/, "")
    .trim();
  if (sansAccents(s).startsWith(sansAccents(a.t))) s = s.slice(a.t.length).replace(/^[\s:.,–—|-]+/, "");
  if (s.length < 40) return "";
  return premierePhrase(s);
}

const sortir = a => {
  const x = a.x ?? extrait(a);
  return { t: a.t, u: a.u, s: a.s, d: a.d.toISOString(), ...(x ? { x } : {}), ...(a.l === "en" ? { l: "en" } : {}), ...(a.n > 1 ? { n: a.n } : {}), ...(a.r ? { r: a.r } : {}), ...(a.e ? { e: a.e } : {}), ...(a.y ? { y: a.y } : {}) };
};

async function pubmed() {
  const resultats = {};
  for (const req of REQUETES_PUBMED) {
    const p = new URLSearchParams({ db: "pubmed", term: req.terme, reldate: String(req.jours), datetype: "edat", retmax: "60", retmode: "json", tool: "revue-presse-sante", ...(req.tri ? { sort: req.tri } : {}) });
    const ids = JSON.parse((await lire(PUBMED + "esearch.fcgi?" + p)) || "{}").esearchresult?.idlist || [];
    await pause(400);
    if (!ids.length) { resultats[req.cle] = []; continue; }
    const resume = JSON.parse((await lire(PUBMED + "esummary.fcgi?" + new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "json", tool: "revue-presse-sante" }))) || "{}");
    await pause(400);
    resultats[req.cle] = ids.map(uid => resume.result?.[uid]).filter(Boolean).map(f => {
      const entree = (f.history || []).find(h => h.pubstatus === "entrez")?.date || f.sortpubdate;
      const date = new Date((entree || "").replace(/\//g, "-").replace(" ", "T"));
      const types = (f.pubtype || []).join(" ");
      const y = /Meta-Analysis/.test(types) ? "meta" : /Systematic Review/.test(types) ? "revue" : /Randomized Controlled Trial/.test(types) ? "essai" : undefined;
      return { t: texte(f.title).replace(/\.$/, ""), u: `https://pubmed.ncbi.nlm.nih.gov/${f.uid}/`, pmid: f.uid, s: "PubMed", r: f.source, g: f.source, l: "en", d: isNaN(date) ? new Date(maintenant) : date, y };
    }).filter(a => a.t && !/^(correction|erratum|retraction|reply|response)/i.test(a.t));
  }
  return resultats;
}

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

function nouvelleEncourageante(articles, precedente, jour) {
  if (precedente?.bonne?.jour === jour && precedente.bonne.u) {
    const meme = articles.find(a => normaliserUrl(a.u) === normaliserUrl(precedente.bonne.u));
    const x = precedente.bonne.x || (meme && extrait(meme));
    return { ...precedente.bonne, ...(x ? { x } : {}) };
  }
  const dejaVues = new Set((precedente?.bonnesRecentes || []).map(normaliserUrl));
  const candidates = articles
    .filter(a => a.l === "fr" && a.type !== "opinion" && a.type !== "loi" && dansLeSecteur(a) && SECTEUR.test(tout(a)) && !dejaVues.has(normaliserUrl(a.u)))
    .map(a => {
      const titre = sansAccents(a.t);
      const pos = compter(POSITIF, titre) * 2 + compter(POSITIF, tout(a));
      const neg = compter(NEGATIF, titre) * 2 + compter(NEGATIF, sansAccents(a.resume));
      return { a, pos, score: pos - 1.5 * neg };
    })
    .filter(c => c.pos >= 2 && compter(NEGATIF, sansAccents(c.a.t)) === 0);
  for (const fenetre of [36, 96, 24 * 7]) {
    const choix = candidates.filter(c => recent(c.a, fenetre)).sort((x, y) => y.score - x.score || y.a.d - x.a.d)[0];
    if (choix && choix.score > 0) return { jour, ...sortir(choix.a) };
  }
  return precedente?.bonne?.u ? precedente.bonne : null;
}

async function lireSources() {
  const pages = async () => {
    const sortie = [];
    let precedent = null;
    for (const s of SOURCES.filter(s => s.page)) {
      if (precedent) await pause(Math.max(precedent.delai, s.delai));
      sortie.push({ s, xml: await lire(s.url, 1) });
      precedent = s;
    }
    return sortie;
  };
  const [flux, lesPages] = await Promise.all([
    Promise.all(SOURCES.filter(s => !s.page).map(async s => ({ s, xml: await lire(s.url) }))),
    pages(),
  ]);
  return [...flux, ...lesPages];
}

async function principal() {
  let precedente = null;
  if (cheminPrecedent) {
    try { precedente = JSON.parse(await readFile(cheminPrecedent, "utf8")); } catch {}
  }
  const etat = {};
  const vus = new Set();
  const articles = [];
  for (const { s, xml } of await lireSources()) {
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

  const nouvelles = articles.filter(a => ["sante", "general", "institution", "loi"].includes(a.type) && dansLeSecteur(a));
  const parRegion = cle => nouvelles.filter(a => region(a) === cle);

  let fenetre = 24, groupes = [];
  const francophones = nouvelles.filter(a => a.l === "fr" && a.zone !== "fr" && (a.type === "sante" || a.type === "general"));
  while (fenetre <= 96) {
    groupes = regrouper(francophones.filter(a => recent(a, fenetre)));
    if (groupes.length >= 6) break;
    fenetre *= 2;
  }
  const repris = groupes.filter(g => g.n > 1).sort((x, y) => y.n - x.n || y.dernier - x.dernier).map(g => ({ ...g.tete, n: g.n }));
  const seuls = groupes.filter(g => g.n === 1).sort((x, y) => y.dernier - x.dernier).map(g => g.tete);
  const une = [...repris, ...alterner(seuls, 6)].slice(0, 6);

  const quebec = alterner(parRegion("quebec").filter(a => recent(a, a.type === "loi" ? 24 * 21 : a.type === "institution" ? 24 * 14 : 96)), 10);
  const canada = alterner(parRegion("canada").filter(a => recent(a, a.type === "institution" ? 24 * 14 : 96)), 8);
  const france = alterner(parRegion("france").filter(a => recent(a, a.type === "institution" ? 24 * 14 : 72)), 8);

  const debats = alterner(articles.filter(a => recent(a, 24 * 7) && (
    (a.type === "opinion" && titreSecteur(a) && compter(SECTEUR, tout(a)) >= 2) ||
    a.type === "analyse" ||
    ((a.type === "sante" || a.type === "general") && a.l === "fr" && dansLeSecteur(a) && DEBAT.test(sansAccents(a.t)))
  )), 8);

  const decouvertes = alterner(
    articles
      .filter(a => recent(a, 24 * 7) && (
        (a.type === "science" && (a.l === "en" || SANTE_SEULE.test(sansAccents(a.t)) || (SANTE_SEULE.test(tout(a)) && DECOUVERTE.test(sansAccents(a.t))))) ||
        ((a.type === "sante" || a.type === "analyse") && a.l === "fr" && DECOUVERTE.test(sansAccents(a.t)))
      ))
      .map(a => ({ a, score: a.l === "en" ? 3 : compter(DECOUVERTE, sansAccents(a.t)) * 2 + compter(DECOUVERTE, sansAccents(a.resume)) + (SANTE_SEULE.test(sansAccents(a.t)) ? 2 : 0) }))
      .sort((x, y) => y.score - x.score || y.a.d - x.a.d)
      .map(c => c.a),
    10,
  );

  const pm = await pubmed();
  const plusRecents = (liste, n) => [...(liste || [])].sort((x, y) => y.d - x.d).slice(0, n);
  const pmRecherche = [
    ...plusRecents(pm.crchum, 2).map(a => ({ ...a, e: "CRCHUM" })),
    ...plusRecents(pm.espum, 2).map(a => ({ ...a, e: "ESPUM" })),
    ...plusRecents(pm.inspq, 1).map(a => ({ ...a, e: "INSPQ" })),
  ];
  const dejaPris = new Set(pmRecherche.map(a => a.u));
  pmRecherche.push(...plusRecents((pm.quebec || []).filter(a => !dejaPris.has(a.u)), 2).map(a => ({ ...a, e: "Québec" })));
  const nouvellesRecherche = alterner(articles.filter(a => a.type === "recherche" && recent(a, 24 * 45) && (!a.filtre || SECTEUR.test(tout(a)))), 6);
  const recherche = [...nouvellesRecherche, ...pmRecherche];

  const publications = [];
  const parRevue = new Map();
  const probantes = pm.probantes || [], domaine = pm.domaine || [];
  for (let i = 0; publications.length < 10 && (i < probantes.length || i < domaine.length); i++) {
    for (const a of [probantes[i], domaine[i]]) {
      if (!a || a.t.length < 45 || publications.length >= 10 || publications.some(p => p.u === a.u) || (parRevue.get(a.r) || 0) >= 2) continue;
      parRevue.set(a.r, (parRevue.get(a.r) || 0) + 1);
      publications.push(a);
    }
  }
  await conclusions([...pmRecherche, ...publications]);

  const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Montreal" }).format(new Date(maintenant));
  const bonne = nouvelleEncourageante(articles, precedente, jour);
  const bonnesRecentes = [...new Set([bonne?.u, ...(precedente?.bonnesRecentes || [])].filter(Boolean))].slice(0, 14);

  const rubriques = { une, quebec, canada, france, debats, decouvertes, recherche, publications };
  for (const [cle, liste] of Object.entries(rubriques)) {
    rubriques[cle] = liste.map(sortir);
    if (!rubriques[cle].length && precedente?.rubriques?.[cle]?.length) rubriques[cle] = precedente.rubriques[cle];
  }

  const sortie = {
    maj: new Date(maintenant).toISOString(),
    bonne,
    rubriques,
    sources: [...new Set([...SOURCES.map(s => s.nom), "PubMed"])],
    bonnesRecentes,
    etat,
  };
  await mkdir(dirname(cheminSortie), { recursive: true });
  await writeFile(cheminSortie, JSON.stringify(sortie, null, 1) + "\n");
  const total = Object.values(etat).reduce((x, y) => x + y, 0);
  console.log(`${articles.length} articles uniques (${total} lus) ; ` + Object.entries(rubriques).map(([k, v]) => `${k} ${v.length}`).join(", ") + ` ; nouvelle encourageante : ${bonne ? bonne.t : "aucune"}`);
  const vides = Object.entries(etat).filter(([, n]) => !n).map(([k]) => k);
  if (vides.length) console.log("Flux sans article : " + vides.join(", "));
  if (total === 0) process.exitCode = 1;
}

await principal();
