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
const AUTOCHTONES = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", "autochtones.json"), "utf8"));

const RACINE = path.join(__dirname, "..");
const empreinte = (fichier) => require("crypto").createHash("sha256").update(fs.readFileSync(path.join(RACINE, fichier))).digest("hex").slice(0, 10);
const VERSION_CSS = empreinte("assets/site.css");
const VERSION_JS = empreinte("assets/site.js");
const URL = "https://erjb-web.github.io/";
const SALLES = ["recherche", "approche", "implantation", "publications", "biographie", "parcours", "engagements", "ressources"];

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
  chapeau: '<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9.5V15"/>',
  fusee: '<path d="M12 3c3 2 4.5 5.5 4.5 9.5L14 15h-4l-2.5-2.5C7.5 8.5 9 5 12 3Z"/><circle cx="12" cy="9" r="1.6"/><path d="M10 15l-1.5 4L12 17.5 15.5 19 14 15"/>',
  etoile: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
  course: '<circle cx="14" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2.5V21M6 12l3-3.5 4 1 2.5 3.5 3 .5M11 15l-1-4"/>',
  outils: '<path d="M4 20l7-7M13.5 4.5a4 4 0 0 1 5.6 5.6l-3 .5-1.6 1.6-3.2-3.2 1.6-1.6z"/>',
  balance: '<path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  reseau: '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M6.5 6.5l3.7 3.7M17.5 6.5l-3.7 3.7M6.5 17.5l3.7-3.7M17.5 17.5l-3.7-3.7"/>',
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

let BIBLIO = [];
const NOMS_INSTITUTIONS = { IRSC: "Instituts de recherche en santé du Canada", CIHR: "Instituts de recherche en santé du Canada" };
function lierCitations(html) {
  return html.replace(/\(([^()]*\d{4}[^()]*)\)/g, (tout, dedans) => {
    const sep = dedans.includes("；") ? "；" : dedans.includes("؛") ? "؛ " : " ; ";
    const parties = dedans.split(/\s*[;；؛]\s*/).map((cit) => {
      const m = cit.match(/^(.+?)\s*[,،，]\s*(\d{4})$/);
      if (!m) return cit;
      const nom = m[1].replace(/\s+(et al\.|&amp;.*|et .*|and .*|y .*|和.*|و.*)$/, "").trim();
      const cible = NOMS_INSTITUTIONS[nom] || nom;
      const ref = BIBLIO.find((x) => x.startsWith(cible) && x.includes(`(${m[2]}`));
      const url = ref && (ref.match(/https?:\/\/\S+$/) || [])[0];
      return url ? `<a class="citation-lien" href="${url}" target="_blank" rel="noopener">${cit}</a>` : cit;
    });
    return "(" + parties.join(sep) + ")";
  });
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
      `<div class="volet" role="tabpanel" data-volet="${i}"${i ? " hidden" : ""}><h3>${e(titreVolet)}</h3><p>${lierCitations(e(texte))}</p>${etiquettes(tags)}</div>`
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
  ressources: "ressources.jpg",
};

const TEINTES = {
  recherche: ["#245a73", "#163a4c"],
  approche: ["#8c4d58", "#63343e"],
  implantation: ["#a0663b", "#7a4a26"],
  biographie: ["#2f6f86", "#1f4f62"],
  publications: ["#327a66", "#1f5446"],
  parcours: ["#9a7448", "#6c4f2e"],
  engagements: ["#5d6585", "#40465f"],
  ressources: ["#3f6f8f", "#2c5068"],
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

// Schémas : réseau égocentré du CLSC, postures de recherche, cycle des cinq temps.
const SCHEMAS = {
  fr: {
    reseauTitre: "Le réseau égocentré du CLSC",
    reseauLegende: "Dans ma thèse, l’analyse de réseau est égocentrée : elle se déroule à partir du CLSC. Ses intervenants et gestionnaires nomment leurs interlocuteurs, qui reçoivent à leur tour le questionnaire ; les liens entre partenaires sont ainsi déclarés par les partenaires eux-mêmes. Les vignettes décrivent le réseau potentiel, les interactions des douze derniers mois le réseau réel, et des entretiens sur la carte du réseau éclairent le pourquoi et le comment de ces interactions.",
    partenaires: ["Clinique","Hôpital","Pharmacie","École","Municipalité","Organisme communautaire","CPE"],
    figure: "Gouvernance locale animée par le CLSC du territoire : un milieu d’affiliation pour chaque personne, au sein d’un voisinage de soins et de services.",
    source: "Source : ministère de la Santé et des Services sociaux du Québec (2026), Politique de première ligne.",
    comparePolitique: "Ce que prévoit la politique",
    compareThese: "Ce que la thèse observe",
    alt: "Schéma officiel : le CLSC anime la gouvernance locale de son territoire avec la clinique, l’hôpital, la pharmacie, l’école, la municipalité, les organismes communautaires et les CPE.",
    posture: ["Lecture positiviste", "Mesurer, estimer, tester", "Lecture constructiviste", "Comprendre le sens donné aux pratiques", "Posture pragmatique", "La question décide de la méthode : des méthodes mixtes intégrées."],
  },
  en: {
    reseauTitre: "The CLSC’s ego-centred network",
    reseauLegende: "In my thesis, network analysis is ego-centred: it unfolds from the CLSC. Its practitioners and managers name the people they work with, who in turn receive the questionnaire; links between partners are thus reported by the partners themselves. Vignettes describe the potential network, interactions over the past twelve months the actual network, and interviews on the network map shed light on why and how these interactions occur.",
    partenaires: ["Clinic","Hospital","Pharmacy","School","Municipality","Community organisation","Childcare centre"],
    figure: "Local governance led by the territory’s CLSC: a home base for each person, within a neighbourhood of care and services.",
    source: "Source: Quebec Ministry of Health and Social Services (2026), first-line services policy.",
    comparePolitique: "What the policy sets out",
    compareThese: "What the thesis observes",
    alt: "Official diagram: the CLSC leads local governance in its territory with the clinic, hospital, pharmacy, school, municipality, community organisations and childcare centres.",
    posture: ["Positivist lens", "Measure, estimate, test", "Constructivist lens", "Understand the meaning given to practices", "Pragmatic stance", "The question decides the method: integrated mixed methods."],
  },
  es: {
    reseauTitre: "La red egocentrada del CLSC",
    reseauLegende: "En mi tesis, el análisis de redes es egocentrado: se despliega a partir del CLSC. Sus profesionales y gestores nombran a sus interlocutores, que a su vez reciben el cuestionario; los vínculos entre socios son así declarados por los propios socios. Las viñetas describen la red potencial, las interacciones de los últimos doce meses la red real, y entrevistas sobre el mapa de la red aclaran el porqué y el cómo de esas interacciones.",
    partenaires: ["Clínica","Hospital","Farmacia","Escuela","Municipio","Organismo comunitario","Centro de primera infancia"],
    figure: "Gobernanza local animada por el CLSC del territorio: un lugar de afiliación para cada persona, dentro de una vecindad de cuidados y servicios.",
    source: "Fuente: Ministerio de Salud y Servicios Sociales de Quebec (2026), política de primera línea.",
    comparePolitique: "Lo que prevé la política",
    compareThese: "Lo que observa la tesis",
    alt: "Esquema oficial: el CLSC anima la gobernanza local de su territorio con la clínica, el hospital, la farmacia, la escuela, el municipio, los organismos comunitarios y los centros de primera infancia.",
    posture: ["Lectura positivista", "Medir, estimar, probar", "Lectura constructivista", "Comprender el sentido dado a las prácticas", "Postura pragmática", "La pregunta decide el método: métodos mixtos integrados."],
  },
  zh: {
    reseauTitre: "以 CLSC 为中心的自我中心网络",
    reseauLegende: "在我的博士论文中，网络分析以 CLSC 为中心展开：其从业人员和管理者列出与之合作的对象，这些对象再依次填写问卷；合作伙伴之间的联系因此由伙伴自己申报。情景案例描述潜在网络，过去十二个月的互动描述实际网络，而围绕网络图进行的访谈则阐明这些互动发生的原因与方式。",
    partenaires: ["诊所","医院","药房","学校","市政","社区组织","幼儿中心"],
    figure: "由区域内 CLSC 主导的地方治理：在照护与服务的邻里网络中，为每个人提供一个归属的服务场所。",
    source: "来源：魁北克卫生与社会服务部（2026），《第一线服务政策》。",
    comparePolitique: "政策的规定",
    compareThese: "论文的观察",
    alt: "官方示意图：CLSC 与诊所、医院、药房、学校、市政、社区组织和幼儿中心共同主导其区域的地方治理。",
    posture: ["实证主义视角", "测量、估计、检验", "建构主义视角", "理解行动者赋予实践的意义", "实用主义立场", "由问题决定方法：整合的混合方法。"],
  },
  ar: {
    reseauTitre: "الشبكة المتمركزة حول CLSC",
    reseauLegende: "في أطروحتي، يتمحور تحليل الشبكات حول CLSC: إذ يسمّي ممارسوه ومديروه الجهات التي يتعاملون معها، فتتلقى هذه الجهات بدورها الاستبيان؛ وبذلك يصرّح الشركاء أنفسهم بالروابط القائمة بينهم. تصف الحالات الافتراضية الشبكة المحتملة، وتصف تفاعلات الأشهر الاثني عشر الأخيرة الشبكة الفعلية، ثم توضّح المقابلات حول خريطة الشبكة أسباب هذه التفاعلات وكيفية حدوثها.",
    partenaires: ["العيادة","المستشفى","الصيدلية","المدرسة","البلدية","المنظمة المجتمعية","مركز الطفولة المبكرة"],
    figure: "حوكمة محلية يقودها CLSC في منطقته: مكان انتماء لكل شخص ضمن جوار من خدمات الرعاية والخدمات.",
    source: "المصدر: وزارة الصحة والخدمات الاجتماعية في كيبيك (2026)، سياسة خدمات الخط الأول.",
    comparePolitique: "ما تنصّ عليه السياسة",
    compareThese: "ما ترصده الأطروحة",
    alt: "رسم رسمي: يقود CLSC الحوكمة المحلية في منطقته مع العيادة والمستشفى والصيدلية والمدرسة والبلدية والمنظمات المجتمعية ومراكز الطفولة المبكرة.",
    posture: ["المنظور الوضعي", "القياس والتقدير والاختبار", "المنظور البنائي", "فهم المعنى الذي يمنحه الفاعلون لممارساتهم", "الموقف البراغماتي", "السؤال هو الذي يحدّد المنهج: مناهج مختلطة متكاملة."],
  },
};

function schemaReseau(c) {
  const S = SCHEMAS[c.lang];
  const n = S.partenaires.length;
  const pts = S.partenaires.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [320 + 215 * Math.cos(a), 200 + 140 * Math.sin(a), Math.cos(a)];
  });
  const liens = [[0, 1], [1, 2], [0, 5], [5, 4], [4, 3], [5, 6], [3, 6]];
  const ancre = (cx) => (Math.abs(cx) < 0.2 ? "middle" : cx > 0 ? "start" : "end");
  return `<figure class="schema schema-reseau">
<p class="comparaison-etiquette these">${e(S.compareThese)}</p><figcaption class="schema-titre">${e(S.reseauTitre)}</figcaption>
<svg viewBox="0 0 640 400" role="img" aria-label="${e(S.reseauTitre)}">
${liens.map(([a, b]) => `<line x1="${pts[a][0].toFixed(1)}" y1="${pts[a][1].toFixed(1)}" x2="${pts[b][0].toFixed(1)}" y2="${pts[b][1].toFixed(1)}" class="lien-partenaires"/>`).join("")}
${pts.map(([x, y]) => `<line x1="320" y1="200" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="lien-centre"/>`).join("")}
${pts
  .map(([x, y, cx], i) => {
    const dx = Math.abs(cx) < 0.2 ? 0 : cx > 0 ? 16 : -16;
    const dy = Math.abs(cx) < 0.2 ? (y < 200 ? -18 : 28) : 5;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" class="noeud n${i % 4}"/><text x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${ancre(cx)}">${e(S.partenaires[i])}</text>`;
  })
  .join("")}
<circle cx="320" cy="200" r="40" class="noeud-centre"/><text x="320" y="206" text-anchor="middle" class="texte-centre">CLSC</text>
</svg>
<p class="schema-legende">${e(S.reseauLegende)}</p>
</figure>`;
}

function figureClsc(c) {
  const S = SCHEMAS[c.lang];
  return `<figure class="figure-officielle"><p class="comparaison-etiquette politique">${e(S.comparePolitique)}</p><img src="${c.chemin}assets/figures/clsc-gouvernance.png?v=${empreinte("assets/figures/clsc-gouvernance.png")}" width="1400" height="983" alt="${e(S.alt)}" loading="lazy"><figcaption>${e(S.figure)} <span class="source">${e(S.source)}</span></figcaption></figure>`;
}

function schemaPosture(c) {
  const [g, gs, d, ds, centre, legende] = SCHEMAS[c.lang].posture;
  return `<figure class="schema schema-posture">
<svg viewBox="0 0 560 290" role="img" aria-label="${e(centre)}">
<circle cx="205" cy="140" r="122" class="cercle-gauche"/><circle cx="355" cy="140" r="122" class="cercle-droit"/>
<text x="150" y="128" text-anchor="middle" class="venn-titre">${e(g)}</text><text x="150" y="152" text-anchor="middle" class="venn-sous">${e(gs)}</text>
<text x="410" y="128" text-anchor="middle" class="venn-titre">${e(d)}</text><text x="410" y="152" text-anchor="middle" class="venn-sous">${e(ds)}</text>
<rect x="222" y="122" width="116" height="40" rx="20" class="venn-pastille"/><text x="280" y="147" text-anchor="middle" class="venn-centre">${e(centre)}</text>
</svg>
<p class="schema-legende">${e(legende)}</p>
</figure>`;
}

function schemaCycle(tr) {
  const n = tr.etapes.length;
  const pos = tr.etapes.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [50 + 38 * Math.cos(a), 50 + 38 * Math.sin(a)];
  });
  const arcs = pos.map((_, i) => {
    const a1 = -Math.PI / 2 + ((i + 0.22) * 2 * Math.PI) / n;
    const a2 = -Math.PI / 2 + ((i + 0.78) * 2 * Math.PI) / n;
    const p = (a) => `${(180 + 137 * Math.cos(a)).toFixed(1)} ${(180 + 137 * Math.sin(a)).toFixed(1)}`;
    return `<path d="M${p(a1)} A137 137 0 0 1 ${p(a2)}" class="arc" marker-end="url(#fleche-cycle)"/>`;
  });
  return `<div class="cycle" aria-hidden="false">
<svg viewBox="0 0 360 360" aria-hidden="true"><defs><marker id="fleche-cycle" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="pointe"/></marker></defs>${arcs.join("")}</svg>
<p class="cycle-centre">${e(tr.detail)}</p>
${tr.etapes.map(([verbe], i) => `<button type="button" class="cycle-noeud${i ? "" : " actif"}" data-aller="${i}" style="left:${pos[i][0].toFixed(1)}%;top:${pos[i][1].toFixed(1)}%"><span>${num(i)}</span>${e(verbe)}</button>`).join("")}
</div>`;
}

const ICONES_GROUPES = {
  engagements: ["bulles", "chapeau", "loupe", "etoile", "coeur", "course"],
  publications: ["bulles", "papiers", "chapeau", "outils", "papiers", "papiers"],
};
const ICONES_TYPES = { formation: "chapeau", experience: "mallette", entreprise: "fusee" };

// Accueil : parcours illustré et chiffres clés.
const BANDE = {
  fr: {
    titre: "Le parcours en un coup d’œil",
    etapes: [["2016–2024","Séjours adaptés et de répit","coeur"],["2020–2023","Éducateur spécialisé, Adapei 35","personne"],["2024","Maîtrise en direction des structures médico-sociales, UBO","mallette"],["2024–2025","Chargé de mission, ANAP","reseau"],["2025","Master en droit de la santé, Paris-Panthéon-Assas","balance"],["Depuis 2025","Doctorat en santé publique, ESPUM et CRCHUM","loupe"]],
    chiffres: [["8","années auprès de personnes en situation de handicap"],["4","charges d’auxiliaire d’enseignement à l’Université de Montréal"],["3","mentions spéciales du jury"],["1","prix de la meilleure affiche, 3e cycle (GFSP, 2026)"]],

  },
  en: {
    titre: "The path at a glance",
    etapes: [["2016–2024","Adapted and respite holidays","coeur"],["2020–2023","Special needs educator, Adapei 35","personne"],["2024","Master’s-level degree in managing social care services, UBO","mallette"],["2024–2025","Project manager, ANAP","reseau"],["2025","Master’s in health law, Paris-Panthéon-Assas","balance"],["Since 2025","PhD in public health, ESPUM and CRCHUM","loupe"]],
    chiffres: [["8","years supporting people with disabilities"],["4","teaching assistantships at Université de Montréal"],["3","special distinctions from the jury"],["1","best poster award, doctoral level (GFSP, 2026)"]],

  },
  es: {
    titre: "La trayectoria de un vistazo",
    etapes: [["2016–2024","Estancias adaptadas y de respiro","coeur"],["2020–2023","Educador especializado, Adapei 35","personne"],["2024","Maestría en dirección de estructuras médico-sociales, UBO","mallette"],["2024–2025","Encargado de misión, ANAP","reseau"],["2025","Máster en derecho de la salud, Paris-Panthéon-Assas","balance"],["Desde 2025","Doctorado en salud pública, ESPUM y CRCHUM","loupe"]],
    chiffres: [["8","años junto a personas en situación de discapacidad"],["4","ayudantías de docencia en la Université de Montréal"],["3","menciones especiales del jurado"],["1","premio al mejor póster, doctorado (GFSP, 2026)"]],

  },
  zh: {
    titre: "经历一览",
    etapes: [["2016–2024","适应性度假与喘息服务","coeur"],["2020–2023","特殊教育工作者，Adapei 35","personne"],["2024","医疗社会服务机构管理硕士级文凭（Maîtrise），UBO","mallette"],["2024–2025","项目专员，ANAP","reseau"],["2025","卫生法硕士，巴黎-先贤祠-阿萨斯大学","balance"],["2025 年起","公共卫生博士，ESPUM 与 CRCHUM","loupe"]],
    chiffres: [["8","年陪伴残障人士"],["4","次在蒙特利尔大学担任助教"],["3","次获评审团特别嘉许"],["1","项最佳海报奖，博士阶段（GFSP，2026）"]],

  },
  ar: {
    titre: "المسار في لمحة",
    etapes: [["2016–2024","إقامات مكيّفة وإقامات راحة","coeur"],["2020–2023","مربٍّ متخصص، Adapei 35","personne"],["2024","ماجستير مهني (Maîtrise) في إدارة المؤسسات الطبية الاجتماعية، UBO","mallette"],["2024–2025","مكلّف بمهمة، ANAP","reseau"],["2025","ماجستير في قانون الصحة، باريس-بانتيون-أساس","balance"],["منذ 2025","دكتوراه في الصحة العامة، ESPUM وCRCHUM","loupe"]],
    chiffres: [["8","سنوات إلى جانب الأشخاص ذوي الإعاقة"],["4","مهام مساعد تدريس في جامعة مونتريال"],["3","تنويهات خاصة من لجنة التحكيم"],["1","جائزة أفضل ملصق، مرحلة الدكتوراه (GFSP، 2026)"]],

  },
};

function bandeAccueil(c) {
  const B = BANDE[c.lang];
  return `<div class="bande-accueil">
<p class="bande-titre">${e(B.titre)}</p>
<ol class="trajectoire">${B.etapes.map(([quand, quoi, ic], i) => `<li style="--rang:${i}"><span class="trajectoire-date">${e(quand)}</span><span class="trajectoire-texte">${e(quoi)}</span></li>`).join("")}</ol>
<div class="chiffres chiffres-accueil">${B.chiffres.map(([v, l]) => `<div><strong>${e(v)}</strong><span>${e(l)}</span></div>`).join("")}</div>
</div>`;
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
<div class="comparaison">${figureClsc(c)}
${schemaReseau(c)}</div>
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
${schemaPosture(c)}
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
<div class="cycle-bloc">${schemaCycle(tr)}
${tableOnglets(tr.titre, tr.detail, tr.etapes.map(([verbe, titre, texte, tags]) => ["", verbe, titre, texte, tags]))}</div>
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
<figure class="bio-figure"><img class="portrait-bio" src="${c.chemin}assets/portrait-bio.png?v=${empreinte("assets/portrait-bio.png")}" width="800" height="800" alt="${e(c.accueil.portrait)}" loading="lazy"><blockquote class="citation">${e(b.citation)}</blockquote></figure>
</div>
<div class="colonne-outils">
<ol class="recit">${b.chapitres.map(([titre, paragraphes], k) => `<li><span class="recit-num">${num(k)}</span><div><h3>${e(titre)}</h3>${paragraphes.map((p) => `<p>${riche(p)}</p>`).join("")}</div></li>`).join("")}</ol>
<div class="vision"><h3>${e(b.vision.titre)}</h3>${b.vision.paragraphes.map((p) => `<p>${riche(p)}</p>`).join("")}</div>
<p class="recit-fin">${e(b.conclusion)}</p>
</div>
</div>`;
}

function sectionGroupes(c, s, extra = "", icones = []) {
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(s.surtitre)}</p>
<h2>${e(s.titre)}</h2>
<p class="intro">${e(s.intro)}</p>
${extra}
</div>
<div class="colonne-outils">${s.groupes.map((g, k) => `<h3 class="titre-bloc titre-icone">${e(g.titre)}<span class="compte">${g.items.length}</span></h3>${liste(g.items)}`).join("")}</div>
</div>`;
}

const RESSOURCES = JSON.parse(fs.readFileSync(path.join(__dirname, "ressources-donnees.json"), "utf8"));
const lienFinal = (s) => e(s).replace(/(https?:\/\/\S+?)(\.?)$/, (u, url, point) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>${point}`);

function sectionRessources(c) {
  const t = c.ressources;
  const D = RESSOURCES;
  const cles = ["5", "4", "3", "2", "1"];
  const max = Math.max(...cles.map((k) => D.priorites[k]));
  const barres = cles
    .map((k) => `<div class="barre"><span class="barre-libelle">${e(t.prioriteLibelle)} ${k}</span><span class="barre-piste"><span class="barre-valeur p${k}" style="width:${((100 * D.priorites[k]) / max).toFixed(1)}%"></span></span><span class="barre-nombre">${D.priorites[k]}</span></div>`)
    .join("");
  const total = t.provenance.reduce((s, [, n]) => s + n, 0);
  const teintes = ["var(--accent)", "#286d5c", "#a0663b"];
  let cumul = 0;
  const segments = t.provenance.map(([, n], i) => {
    const debut = cumul;
    cumul += (100 * n) / total;
    return `${teintes[i]} ${debut.toFixed(2)}% ${cumul.toFixed(2)}%`;
  });
  const anneau = `<div class="anneau-bloc"><div class="anneau" style="background:conic-gradient(${segments.join(",")})" role="img" aria-label="${e(t.provenanceTitre)}"><span>${total}</span></div><ul class="anneau-legende">${t.provenance
    .map(([nom, n], i) => `<li><span class="pastille-couleur" style="background:${teintes[i]}"></span>${e(nom)}<b>${n}</b></li>`)
    .join("")}</ul></div>`;
  const lacunes = t.lacunes
    .map(
      (l) => `<article class="lacune s${l.score}"><div class="lacune-tete"><h4>${e(l.dimension)}</h4><span class="niveau">${e(l.niveau)}</span></div><div class="jauge" aria-hidden="true">${[1, 2, 3, 4, 5]
        .map((n) => `<span${n <= l.score ? ' class="plein"' : ""}></span>`)
        .join("")}</div><p class="etat">${e(l.etat)}</p><p>${e(l.constat)}</p><p class="ref">${e(l.reperes)}</p></article>`
    )
    .join("");
  const lectures = (arr) =>
    `<ol class="lectures">${arr.map((x) => `<li><span class="lecture-auteurs">${e(x.auteurs)} (${e(x.annee)})</span> ${x.lien ? lien(x.lien, e(x.titre)) : e(x.titre)} <span class="type">${e(x.type)}</span></li>`).join("")}</ol>`;
  return `<div class="section-corps">
<div class="colonne-texte">
<p class="surtitre">${e(t.surtitre)}</p>
<h2>${e(t.titre)}</h2>
<p class="intro">${e(t.intro)}</p>
<div class="chiffres">${t.chiffres.map(([v, l]) => `<div><strong>${e(v)}</strong><span>${e(l)}</span></div>`).join("")}</div>
<h3 class="titre-bloc">${e(t.prioritesTitre)}</h3>
<div class="barres">${barres}</div>
<h3 class="titre-bloc">${e(t.provenanceTitre)}</h3>
${anneau}
<p class="note">${e(t.note)}</p>
</div>
<div class="colonne-outils">
<h3 class="titre-bloc">${e(t.lacunesTitre)}</h3>
<p class="note">${e(t.lacunesIntro)}</p>
<div class="lacunes">${lacunes}</div>
<div class="lacune-principale"><h4>${e(t.principaleTitre)}</h4><p>${e(t.principale)}</p><p class="vigilance">${e(t.vigilance)}</p></div>
<details class="biblio"><summary>${e(t.p5Titre)}</summary>${lectures(D.p5)}</details>
<details class="biblio"><summary>${e(t.p4Titre)}</summary>${lectures(D.p4)}</details>
<h3 class="titre-bloc">${e(t.formationTitre)}</h3>
<div class="cours">${t.cours.map(([nom, refs]) => `<article class="cours-carte"><h4>${e(nom)}</h4><ul>${refs.map((x) => `<li>${lienFinal(x)}</li>`).join("")}</ul></article>`).join("")}</div>
</div>
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

const PREFERENCES = `<script>(function(){try{var h=document.documentElement;h.classList.add("js");var m=(localStorage.getItem("eb-modes")||"").split(" "),t=+localStorage.getItem("eb-taille")||0,a=location.hash;if(a==="#daltonien"||a==="#colour-blind")m.push("cb");if(a==="#basse-vision"||a==="#low-vision")m.push("lv");m.forEach(function(x){if(/^(cb|lv|hc)$/.test(x))h.classList.add(x)});if(t>0&&t<4)h.classList.add("t"+t)}catch(e){}})();</script>`;

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
  BIBLIO = c.implantation.bibliographie.items;
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
    publications: sectionGroupes(c, c.publications, "", ICONES_GROUPES.publications),
    biographie: sectionBiographie(c),
    parcours: sectionParcours(c),
    ressources: sectionRessources(c),
    engagements: sectionGroupes(
      c,
      c.engagements,
      `<h3 class="titre-bloc">${e(c.engagements.affiliations.titre)}</h3>${etiquettes(c.engagements.affiliations.items, "etiquettes grandes")}`,
      ICONES_GROUPES.engagements
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
<div class="hall-pied"><span>${e(c.hall.consigne)}</span></div>
</div>
${bandeAccueil(c)}
</section>

${SALLES.map(
  (s, i) => `<section class="section${i % 2 ? " teinte" : ""}" id="${s}" data-salle="${s}" data-titre="${e(c.hall.portes[s][0])}">
<div class="section-contenu">
<div class="bandeau" style="--c1:${TEINTES[s][0]};background-image:var(--degrade),url(${p}assets/bandeaux/${s}.jpg?v=${empreinte("assets/bandeaux/" + s + ".jpg")})" role="img" aria-label="${e(c.hall.portes[s][0])}"><div class="bandeau-texte"><span class="bandeau-num">${num(i)}</span><span class="bandeau-titre">${e(c.hall.portes[s][0])}</span><span class="bandeau-legende">${e(c.hall.portes[s][1])}</span></div></div>
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
<div class="salle-progres" aria-hidden="true">${SALLES.map(() => "<span></span>").join("")}</div>
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
  typoFr = false;
  const cle = langue(code).dossier.replace("/", "");
  const T = AUTOCHTONES[cle];
  const lng = code === "moe" ? "moe" : "iu";
  const c = { ...fr, chemin: "../", titre: T["18"].texte, description: ABREGE[cle].description };
  const ligne = (n, balise = "p", classe = "") =>
    `<${balise}${classe ? ` class="${classe}"` : ""} lang="${lng}">${e(T[n].texte)}${T[n].latin ? `<span class="translitteration" lang="${lng}-Latn">${e(T[n].latin)}</span>` : ""}</${balise}>`;
  const bloc = (titre, phrases, icon) =>
    `<section class="bloc-falc"><div class="picto">${icone(icon)}</div><div>${ligne(titre, "h2")}${phrases.map((n) => ligne(n)).join("")}</div></section>`;
  const liens = [["13", "../", false], ["14", "../en/", false], ["15", "https://erjb-web.github.io/affiche-releve/", true]];
  return `${enTeteAbregee(c, code)}
<main id="contenu" class="abrege salutation-page">
${ligne("1", "p", "salutation")}
<h1>Éric Bernier</h1>
${bloc("2", ["3", "4"], "personne")}
${bloc("5", ["6", "7"], "loupe")}
${bloc("8", ["9", "10"], "coeur")}
<section class="bloc-falc"><div class="picto">${icone("enveloppe")}</div><div>${ligne("11", "h2")}${ligne("12")}<p><a class="primaire" href="mailto:${e(ABREGE.COURRIEL)}">${e(ABREGE.COURRIEL)}</a></p></div></section>
<ul class="liens-contact compact">${liens.map(([n, href, ext]) => `<li>${lien(href, `<span lang="${lng}"><strong>${e(T[n].texte)}</strong>${T[n].latin ? `<small>${e(T[n].latin)}</small>` : ""}</span><span aria-hidden="true">${ext ? "↗" : "→"}</span>`)}</li>`).join("")}</ul>
${ligne("16", "p", "merci")}
<p class="avis-traduction">${ligne("17", "span")}<span lang="fr">Traduction préliminaire, à faire valider par une personne locutrice.</span> <span lang="en">Preliminary translation, to be validated by a fluent speaker.</span></p>
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
