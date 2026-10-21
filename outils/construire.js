// Produit six traductions complètes, deux éditions autochtones à traduction partielle avec accès intégral, la version FALC et 404.html.
"use strict";
const OBJECTIFS_VISUELS = require("./objectifs-visuels");
const fs = require("fs");
const path = require("path");
const { fr, en, es, LANGUES, AFFICHE } = require("./contenu");
const lireLangue = (code) => JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", code + ".json"), "utf8"));
const zh = lireLangue("zh");
const ar = lireLangue("ar");
const ru = lireLangue("ru");
const RU_COMPLEMENTS = lireLangue("ru-complements");
const COMPLETES = [fr, en, es, zh, ar, ru];
const langue = (code) => LANGUES.find((l) => l.code === code);
const ABREGE = require("./contenu-abrege");
const EDITIONS_AUTOCHTONES = require("./editions-autochtones");
const AUTOCHTONES = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n", "autochtones.json"), "utf8"));
const METHODOLOGIE = require("./methodologie");
const METHODES_AJOUTS = require("./methodes-ajouts");
const POSTURE = require("./posture-recherche");
const AXES = require("./axes-recherche");
const HALL_3D = require("./hall-3d");
const MEDIATION = require("./enseignement-vulgarisation");
const ENSEIGNEMENT = require("./enseignement-vision");
const DISPOSITIFS_PEDAGOGIQUES = require("./enseignement-dispositifs.json");
const RENDU_PEDAGOGIQUE = require("./enseignement-dispositifs");
const COMMUNICATION = require("./communication-visuelle");
const VULGARISATION = require("./vulgarisation-ressources");
const IA = require("./ia-recherche");
const THESE = require("./these-rubriques");
const CADRAGE_THESE = require("./these-cadrage");
const SNA_EXEMPLES = require("./sna-exemples");
const CHIFFRES_IMPACT = require("./chiffres-parcours");
const LOISIRS_AJOUTS = require("./loisirs-ajouts");
const ATELIERS = require("./ateliers");
const LOGICIELS = require("./logiciels");
const JEUX_ACCUEIL = require("./jeu-accueil.json");
const SPHERES_PUBLIC = require("./spheres-publication.json");
const LIBELLES_THESE = require("./libelles-these");
const NAVIGATION_CHAPITRES = require("./navigation-chapitres");
const TYPES_ETUDES = require("./typologies-multilingues");
const AUDIENCE = require("./audience.json");
const AUDIENCE_LIBELLES = require("./audience-libelles");
if(AUDIENCE.websiteId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(AUDIENCE.websiteId))throw new Error("Identifiant Umami invalide");

const RACINE = path.join(__dirname, "..");
const empreinte = (fichier) => require("crypto").createHash("sha256").update(fs.readFileSync(path.join(RACINE, fichier))).digest("hex").slice(0, 10);
const VERSION_CSS = empreinte("assets/site.css");
const VERSION_HALL_CSS = empreinte("assets/hall-realiste.css");
const VERSION_JS = empreinte("assets/site.js");
const VERSION_MARCHE = empreinte("assets/hall-marche.js");
const VERSION_CIEL = empreinte("assets/hall-ciel.js");
const VERSION_AUDIENCE = empreinte("assets/audience.js");
const VERSION_ICONE = empreinte("assets/favicon.svg");
const PUBLICATION_SITE = require("./site-publication.json");
function copyrightSite(code="fr") {
  const libelles={fr:"Dernière mise à jour",en:"Last updated",es:"Última actualización",zh:"最后更新",ar:"آخر تحديث",ru:"Последнее обновление"};
  const langue=libelles[code]?code:"fr",date=PUBLICATION_SITE.date;
  const lisible=new Intl.DateTimeFormat(langue,{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(date+"T12:00:00Z"));
  return '<span>© '+date.slice(0,4)+' Éric Bernier · '+e(libelles[langue])+' : <time datetime="'+date+'">'+e(lisible)+'</time></span><small>'+e(AUTEUR_SITE[langue])+'</small>';
}
const AUTEUR_SITE = {
  fr: "Contenu et réflexion originaux créés et rédigés par Éric Bernier sous sa seule responsabilité. L’IA a pu être utilisée comme assistance à la programmation et à la création graphique.",
  en: "Original content and reflection created and written by Éric Bernier, under the author’s sole responsibility. AI may have been used to assist with programming and graphic design.",
  es: "Contenido y reflexión originales creados y redactados por Éric Bernier bajo su exclusiva responsabilidad. La IA pudo utilizarse como asistencia para la programación y la creación gráfica.",
  zh: "原创内容与思考由 Éric Bernier 创作和撰写，并由作者本人承担全部责任。人工智能可能曾被用于辅助编程和图形创作。",
  ar: "المحتوى والتفكير الأصليان من إنشاء Éric Bernier وتحريره، على مسؤولية المؤلف وحده. ربما استُخدم الذكاء الاصطناعي للمساعدة في البرمجة والتصميم الجرافيكي.",
  ru: "Оригинальное содержание и размышления созданы и написаны Éric Bernier под исключительную ответственность автора. ИИ мог использоваться для помощи в программировании и создании графики.",
};
const ATTRIBUTION_EXEMPLES = {
  fr: ["Réalisation des exemples méthodologiques", "La réflexion scientifique, les choix méthodologiques, la structuration des exemples, la réalisation des cartes dans QGIS, l’analyse, l’interprétation et la rédaction sont assurées par l’auteur. Le traitement et le codage des données sont effectués en R dans l’environnement Positron. L’assistance de Claude est limitée aux graphismes et à la programmation du site Internet ; Claude n’intervient ni dans le codage ou l’analyse des données, ni dans la rédaction scientifique."],
  en: ["Production of methodological examples", "The scientific reasoning, methodological choices, organisation of the examples, creation of maps in QGIS, analysis, interpretation and writing are carried out by the author. Data processing and coding are carried out in R using Positron. Claude’s assistance is limited to graphics and website programming; Claude is not used for data coding or analysis, or for scientific writing."],
  es: ["Realización de los ejemplos metodológicos", "La reflexión científica, las decisiones metodológicas, la estructuración de los ejemplos, la elaboración de mapas en QGIS, el análisis, la interpretación y la redacción son responsabilidad del autor. El tratamiento y la codificación de los datos se realizan en R con Positron. La asistencia de Claude se limita a los gráficos y a la programación del sitio web; Claude no interviene en la codificación o el análisis de los datos ni en la redacción científica."],
  zh: ["方法示例的制作", "科学思考、方法选择、示例结构设计、使用 QGIS 制作地图、分析、解释和科学写作均由作者本人完成。数据处理和编码使用 Positron 环境中的 R 语言完成。Claude 的辅助仅限于图形设计和网站编程，不参与数据编码、数据分析或科学写作。"],
  ar: ["إعداد الأمثلة المنهجية", "يتولى المؤلف بنفسه التفكير العلمي والاختيارات المنهجية وتنظيم الأمثلة وإعداد الخرائط باستخدام QGIS والتحليل والتفسير والكتابة العلمية. وتُعالج البيانات وتُبرمج بلغة R في بيئة Positron. وتقتصر مساعدة Claude على الرسوم والتصميم البصري وبرمجة الموقع الإلكتروني، دون المشاركة في ترميز البيانات أو تحليلها أو كتابة المحتوى العلمي."],
  ru: ["Подготовка методологических примеров", "Научное осмысление, выбор методов, структурирование примеров, создание карт в QGIS, анализ, интерпретация и написание научных текстов выполняются автором. Обработка и кодирование данных осуществляются на языке R в среде Positron. Помощь Claude ограничивается графикой и программированием сайта; Claude не используется для кодирования или анализа данных и подготовки научных текстов."],
};
function attributionExemples(lang) {
  const [, texte] = ATTRIBUTION_EXEMPLES[lang] || ATTRIBUTION_EXEMPLES.en;
  const labels = {fr:"Nota Bene :",en:"Note:",es:"Nota:",zh:"注意：",ar:"ملاحظة:",ru:"Примечание:"};
  return `<p class="these-exemples-attribution" style="font-size:9pt!important;line-height:1.5!important;text-align:justify!important;margin:18px 0 4px;padding:10px 0 0;border-top:1px solid #e4e9ec;color:#596977"><strong>${e(labels[lang] || labels.en)}</strong> ${e(texte)}</p>`;
}
const URL = "https://erjb-web.github.io/";
const TELEPHONE = ["(263) 384-3050", "+12633843050"];
const GROUPES = [
  ["recherche", ["recherche", "axes", "publications", "approche", "methodes", "ia", "outils"]],
  ["implantation", ["implantation", "notions", "transmission", "vulgarisation"]],
  ["parcours", ["biographie", "parcours", "juriste", "gestionnaire", "educateur", "entrepreneuriat", "valeurs"]],
  ["engagements", ["representation", "communaute", "distinctions", "citoyen", "loisirs"]],
  ["ressources", ["logiciels", "litterature", "grise", "presse", "capsules", "balados"]],
  ["contact", []],
];
const SALLES = GROUPES.flatMap(([, ss]) => ss);
const NUMS = Object.fromEntries(GROUPES.flatMap(([, ss], gi) => ss.map((s, k) => [s, String(gi + 1).padStart(2, "0") + (ss.length > 1 ? "." + (k + 1) : "")])));
const TRANSMISSION = {
  fr: { porte: ["Savoirs en action", "Implantation, notions clés, enseignement et vulgarisation scientifique"], salle: ["Enseigner et vulgariser", "Enseignement, communication et vulgarisation"], surtitre: "Transmission", titre: "Enseigner, vulgariser, communiquer", intro: "Transférer les connaissances, c’est aussi les enseigner, les rendre lisibles et les partager avec celles et ceux qui les mobilisent.", groupes: ["Enseignement", "Communications scientifiques", "Vulgarisation et accessibilité", "Animation de réseaux"], affiche: ["Affiche du projet de thèse en version accessible", "Sept langues, dont l’inuktitut et l’innu-aimun (versions préliminaires), une version en facile à lire et à comprendre (FALC), et des versions adaptées au daltonisme et à la basse vision."], rdv: "Réserver un rendez-vous" },
  en: { porte: ["Knowledge transfer and implementation", "Implementation, key concepts, teaching and outreach"], salle: ["Teaching and outreach", "Teaching, communication and outreach"], surtitre: "Sharing knowledge", titre: "Teaching, outreach, communication", intro: "Transferring knowledge also means teaching it, making it readable and sharing it with those who put it to use.", groupes: ["Teaching", "Scientific communications", "Outreach and accessibility", "Network facilitation"], affiche: ["Accessible version of the thesis project poster", "Seven languages, including Inuktitut and Innu-aimun (preliminary versions), an easy-to-read version, and versions adapted for colour blindness and low vision."], rdv: "Book a meeting" },
  es: { porte: ["Transferencia de conocimientos e implementación", "Implementación, nociones clave, docencia y divulgación científica"], salle: ["Enseñar y divulgar", "Docencia, comunicación y divulgación"], surtitre: "Transmisión", titre: "Enseñar, divulgar, comunicar", intro: "Transferir conocimientos también es enseñarlos, hacerlos comprensibles y compartirlos con quienes los movilizan.", groupes: ["Docencia", "Comunicaciones científicas", "Divulgación y accesibilidad", "Animación de redes"], affiche: ["Versión accesible del póster del proyecto de tesis", "Siete idiomas, entre ellos el inuktitut y el innu-aimun (versiones preliminares), una versión de lectura fácil y versiones adaptadas al daltonismo y a la baja visión."], rdv: "Reservar una cita" },
  zh: { porte: ["知识转化与实施", "实施、关键概念、教学与科普"], salle: ["教学与科普", "教学、传播与科普"], surtitre: "知识传递", titre: "教学、科普与传播", intro: "转化知识，也意味着教授知识、让知识易于理解，并与运用知识的人分享。", groupes: ["教学", "学术交流", "科普与无障碍", "网络组织与引导"], affiche: ["博士论文项目海报无障碍版", "共七种语言，包括因纽特语和因努语（初步版本），另有易读版，以及适合色觉障碍和低视力人士的版本。"], rdv: "预约会面" },
  ar: { porte: ["نقل المعارف والتنفيذ", "التنفيذ والمفاهيم الأساسية والتدريس والتبسيط العلمي"], salle: ["التدريس والتبسيط", "التدريس والتواصل والتبسيط العلمي"], surtitre: "نقل المعرفة", titre: "التدريس والتبسيط والتواصل", intro: "نقل المعارف يعني أيضًا تدريسها وجعلها مفهومة ومشاركتها مع من يستخدمونها.", groupes: ["التدريس", "المداخلات العلمية", "التبسيط العلمي وإتاحة الوصول", "تنشيط الشبكات"], affiche: ["النسخة الميسّرة من ملصق مشروع الأطروحة", "سبع لغات، منها الإنكتيتوت والإينو-أيمون (نسخ أولية)، ونسخة سهلة القراءة، ونسخ مكيّفة لعمى الألوان وضعف البصر."], rdv: "حجز موعد" },
};
const BOOKINGS = "https://bookings.cloud.microsoft/book/RDVavecEricBernier@umontreal.ca/";
const textesTransmission = (c) => TRANSMISSION[c.lang] || TRANSMISSION.en;
// Les responsabilités et dates restent celles du parcours publié.
function reperesMediation(bloc) {
  return `<h3 class="titre-bloc">${e(bloc.titre)}</h3><div class="cadres reperes-transmission">${bloc.items.map(([t, d, refs]) => `<article class="cadre"><h4>${e(t)}</h4><p>${e(d)}</p><p class="ref">${refs.map((k) => lien(MEDIATION.REFERENCES[k].href, e(MEDIATION.REFERENCES[k].court))).join(" · ")}</p></article>`).join("")}</div>`;
}
function communicationVisuelle(c, bloc) {
  const s = COMMUNICATION.langues[c.lang];
  const icone = (i) => `<svg viewBox="-2 -2 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${COMMUNICATION.icones[i]}</svg>`;
  const identifiant = (type, i) => `communication-${type}-${c.lang}-${i}`;
  return `<section class="communication-visuelle" data-onglets aria-labelledby="communication-titre-${c.lang}">
<header class="comm-entete"><h3 id="communication-titre-${c.lang}">${e(bloc.titre)}</h3><p>${e(s.intro)}</p></header>
<div class="onglets comm-nav" role="tablist" aria-label="${e(s.navigation)}">${s.etapes.map((etape, i) => `<button type="button" role="tab" id="${identifiant("onglet", i)}" aria-controls="${identifiant("panneau", i)}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}" data-volet="${i}"><span class="comm-num" aria-hidden="true">${num(i)}</span><span class="comm-icone">${icone(i)}</span><strong>${e(etape.court)}</strong></button>`).join("")}</div>
${s.etapes.map((etape, i) => {
  const [titre, texte, sources] = bloc.items[i];
  return `<div class="volet comm-panel" role="tabpanel" id="${identifiant("panneau", i)}" aria-labelledby="${identifiant("onglet", i)}" data-volet="${i}"${i ? " hidden" : ""}>
<div class="comm-panel-entete"><h4>${e(titre)}</h4><p>${e(texte)}</p></div>
<div class="comm-atelier"><div class="comm-pratique"><h5>${e(s.pratique)}</h5><ol>${etape.actions.map(([titre, detail]) => `<li><strong>${e(titre)}</strong><p>${e(detail)}</p></li>`).join("")}</ol></div><aside class="comm-exemple"><h5>${e(s.exemple)}</h5><p class="comm-formulation">${e(etape.exemple)}</p><div class="comm-livrable"><h5>${e(s.livrable)}</h5><p>${e(etape.livrable)}</p></div></aside></div>
<div class="comm-vigilance"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-10v1"/></svg><div><h5>${e(s.vigilance)}</h5><p>${e(etape.vigilance)}</p></div></div>
<p class="ref comm-sources">${sources.map(k => lien(MEDIATION.REFERENCES[k].href, e(MEDIATION.REFERENCES[k].court))).join(" · ")}</p></div>`;
}).join("")}
<p class="comm-boucle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 8a8 8 0 1 0 0 9M20 3v5h-5"/></svg><span>${e(s.boucle)}</span></p>
</section>`;
}
function sourcesMediation(c, s) {
  const cles = [...new Set([...(s.pratiques.items), ...(s.formats ? s.formats.items : [])].flatMap((x) => x[2]))];
  return `<h3 class="titre-bloc">${e(MEDIATION.LANGUES[c.lang].references)}</h3><ul class="methode-refs references-transmission">${cles.map((k) => `<li>${lien(MEDIATION.REFERENCES[k].href, e(MEDIATION.REFERENCES[k].citation))}</li>`).join("")}</ul>`;
}

const JEUX_RESSOURCES = {
  "fr": [
    "JEU INTERACTIF 3D",
    "La thèse impossible",
    "Une aventure doctorale pour aider Éric à construire et défendre son protocole, avec des choix méthodologiques et plusieurs issues.",
    "Découvrir le jeu",
    "Disponible en français et en anglais"
  ],
  "en": [
    "INTERACTIVE 3D GAME",
    "The impossible thesis",
    "A doctoral adventure where you help Éric design and defend his research protocol, making methodological choices with different outcomes.",
    "Explore the game",
    "Available in French and English"
  ],
  "es": [
    "JUEGO INTERACTIVO 3D",
    "La tesis imposible",
    "Una aventura doctoral para ayudar a Éric a elaborar y defender su protocolo de investigación, tomando decisiones metodológicas que cambian el desenlace.",
    "Descubrir el juego",
    "Disponible en francés e inglés"
  ],
  "zh": [
    "3D 互动游戏",
    "不可能的博士论文",
    "在这场博士研究冒险中，帮助 Éric 制定并答辩研究方案。方法学选择会影响游戏结局。",
    "探索游戏",
    "游戏提供法语和英语版本"
  ],
  "ar": [
    "لعبة تفاعلية ثلاثية الأبعاد",
    "أطروحة الدكتوراه المستحيلة",
    "مغامرة دكتوراه تساعد فيها إريك على إعداد بروتوكول بحثه والدفاع عنه، مع اختيارات منهجية تؤثر في النهاية.",
    "استكشف اللعبة",
    "اللعبة متاحة بالفرنسية والإنجليزية"
  ],
  "ru": [
    "ИНТЕРАКТИВНАЯ 3D-ИГРА",
    "Невозможная диссертация",
    "Докторское приключение: помогите Эрику подготовить и защитить исследовательский протокол. Методологические решения меняют исход игры.",
    "Открыть игру",
    "Доступно на французском и английском"
  ]
};
function sectionJeuRessources(c){
 const t=JEUX_RESSOURCES[c.lang]||JEUX_RESSOURCES.en;
 const j=c.lang==="fr"?"fr":"en";
 return '<aside class="logiciels-jeu" aria-labelledby="jeu-ressources-'+c.lang+'"><div class="logiciels-jeu-texte"><span class="logiciels-jeu-kicker">'+e(t[0])+'</span><h3 id="jeu-ressources-'+c.lang+'">'+e(t[1])+'</h3><p>'+e(t[2])+'</p><small>'+e(t[4])+'</small></div><a class="logiciels-jeu-lien" href="'+c.chemin+'jeu/?lang='+j+'">'+e(t[3])+' <span aria-hidden="true">↗</span></a></aside>';
}
function sectionLogiciels(c,compact=false){
 const L=LOGICIELS[c.lang];
 const BIBLIO=require("./bibliographie");
 const visuel=i=>i===0?'<svg viewBox="0 0 460 170" aria-hidden="true"><path d="M45 15v125h380" fill="none" stroke="#b5d0d5" stroke-width="2"/><path d="M55 128 405 36" stroke="#216b8a" stroke-width="3"/><g fill="#168990">'+Array.from({length:23},(_,n)=>'<circle cx="'+(60+n*15)+'" cy="'+(126-n*3.9+Math.sin(n*4)*18)+'" r="5" opacity=".7"/>').join('')+'</g></svg>':'<svg viewBox="0 0 460 170" aria-hidden="true"><g fill="none" stroke="#5b94a7" stroke-width="2"><path d="M80 45 225 120 380 45M80 45 380 45M225 120 225 45"/></g><g fill="#e2f0ee" stroke="#287a6c" stroke-width="2"><circle cx="80" cy="45" r="24"/><circle cx="225" cy="120" r="24"/><circle cx="380" cy="45" r="24"/></g><circle cx="225" cy="45" r="18" fill="#d9e8f2" stroke="#276a91" stroke-width="2"/></svg>';
 const contenu = '<section class="section-corps pleine logiciels-publics"><header><p class="surtitre">'+e(L.salle[0])+'</p><h2>'+e(L.titre)+'</h2><p class="intro">'+e(L.intro)+'</p></header><div class="logiciels-cartes">'+['statosphere','episphere'].map((s,i)=>{const B=SPHERES_PUBLIC.bilan[s];return '<article>'+visuel(i)+'<div><h3>'+e(i?'Épisphère':'Statosphère')+'</h3><p>'+e(L.items[i])+'</p><p class="logiciels-chiffres"><span><b>'+B.lecons+'</b> '+e(L.chapitres)+'</span><span><b>'+B.qcm.toLocaleString(c.lang)+'</b> '+e(L.questions)+'</span></p><a class="bouton" href="'+c.chemin+'applications/'+s+'/">'+e(L.lancer)+' ↗</a></div></article>';}).join('')+'</div><ol class="logiciels-parcours">'+L.etapes.map((t,i)=>'<li><b>'+num(i)+'</b>'+e(t)+'</li>').join('')+'</ol><p class="note">'+e(L.note)+'</p>'+(!compact?sectionJeuRessources(c):'')+'</section>';
 if(compact)return contenu;
 return contenu.replace('<header>','<div class="logiciels-chapitre" data-image="aucune"><h3 class="ressources-chapitre-titre">'+(BIBLIO.labels[c.lang]||BIBLIO.labels.fr)[0]+'</h3><header>').slice(0,-10)+'</div>'+BIBLIO.render(c)+'</section>';
}
function atelierPratique(c,cle){
 const A=ATELIERS.textes(c.lang,cle),L=A.labels;
 const lignes=A.chaine.map(([t,d],i)=>'<li><span aria-hidden="true">'+num(i)+'</span><h4>'+e(t)+'</h4><p>'+e(d)+'</p></li>').join('');
 const refs=A.refs.map(k=>ATELIERS.references[k]);
 const fichier='docs/atelier-'+cle+'-'+c.lang+'.md';
 fs.writeFileSync(path.join(RACINE,fichier),'# '+A.titre+'\n\n'+A.intro+'\n\n'+A.chaine.map(([t,d],i)=>'## '+(i+1)+'. '+t+'\n\n'+d).join('\n\n')+'\n\n## '+L.exemple+'\n\n'+A.cas+'\n\n'+A.options.map(x=>'### '+x.nom+'\n\n'+L.raisonnement+' : '+x.raisonnement+'\n\n'+L.livrable+' : '+x.livrable+'\n\n'+L.vigilance+' : '+x.vigilance).join('\n\n')+'\n\n## '+L.questions+'\n\n'+A.questions.map(x=>'- '+x).join('\n')+'\n\n## '+L.sources+'\n\n'+A.portee+'\n\n'+refs.map(r=>r.citation).join('\n\n')+'\n');
 return '<section class="atelier-pratique atelier-'+cle+'">'+(cle === 'enseignement' ? '' : '<figure class="atelier-figure"><img src="'+c.chemin+'assets/atelier-'+cle+'.svg" alt="'+e(A.chaine.map(x=>x[0]).join(' → '))+'" loading="lazy" width="600" height="300"></figure>')+'<header><p class="surtitre">'+e(L.atelier)+'</p><h3>'+e(A.titre)+'</h3><p>'+e(A.intro)+'</p><a class="atelier-telecharger" href="'+c.chemin+fichier+'" download>'+e(L.telecharger)+' ↓</a></header><ol class="atelier-chaine">'+lignes+'</ol><div class="atelier-essais">'+A.essai.map(([t,d])=>'<section><h4>'+e(t)+'</h4><p>'+e(d)+'</p></section>').join('')+'</div><div class="atelier-cas"><p class="surtitre">'+e(L.exemple)+'</p><p>'+e(A.cas)+'</p><div data-onglets><div class="onglets atelier-choix" role="tablist" aria-label="'+e(L.choisir)+'">'+A.options.map((x,i)=>'<button type="button" role="tab" data-volet="'+i+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'">'+e(x.nom)+'</button>').join('')+'</div>'+A.options.map((x,i)=>'<div class="volet atelier-reponse" role="tabpanel" data-volet="'+i+'"'+(i?' hidden':'')+'><h4>'+e(x.nom)+'</h4><div><section><h5>'+e(L.raisonnement)+'</h5><p>'+e(x.raisonnement)+'</p></section><section><h5>'+e(L.livrable)+'</h5><p>'+e(x.livrable)+'</p></section></div><aside><h5>'+e(L.vigilance)+'</h5><p>'+e(x.vigilance)+'</p></aside></div>').join('')+'</div></div><details class="atelier-biblio"><summary>'+e(L.sources)+'</summary><p>'+e(A.portee)+'</p><ol>'+refs.map(r=>'<li>'+e(r.citation)+' '+lien(r.href,'↗')+'</li>').join('')+'</ol></details></section>';
}

function sectionTransmission(c) {
  const s = MEDIATION.LANGUES[c.lang].enseignement;
  const p = ENSEIGNEMENT.langues[c.lang];
  const iEns = fr.parcours.etapes.map((x, i) => (/Auxiliaire d’enseignement/.test(x.titre) ? i : -1)).filter((i) => i >= 0);
  const gMent = fr.engagements.groupes.findIndex((g) => g.items.some((x) => /mentorat/i.test(x.titre)));
  const iMent = gMent >= 0 ? fr.engagements.groupes[gMent].items.findIndex((x) => /mentorat/i.test(x.titre)) : -1;
  const paragraphes = textes => textes.map(t => '<p>' + e(t) + '</p>').join('');
  const appuis = cles => '<p class="ref enseignement-appuis"><strong>' + e(p.appuis) + ' :</strong> ' + cles.map(k => lien(ENSEIGNEMENT.references[k].href, e(ENSEIGNEMENT.references[k].court))).join(' · ') + '</p>';
  const essai = bloc => '<div class="enseignement-essai"><h3>' + e(bloc.titre) + '</h3>' + bloc.sections.map(partie => '<section><h4>' + e(partie.titre) + '</h4>' + paragraphes(partie.paragraphes) + '</section>').join('') + appuis(bloc.refs) + '</div>';
  const pont = '<div class="enseignement-essai"><h3>' + e(p.pont.titre) + '</h3>' + paragraphes(p.pont.paragraphes) + '</div><div class="enseignement-ponts">' + p.pont.liens.map(([origine, suite], i) => '<article><span class="enseignement-repere" aria-hidden="true">' + num(i) + '</span><div><p class="enseignement-libelle">' + e(p.pontLibelles[0]) + '</p><h4>' + e(origine) + '</h4><p class="enseignement-libelle">' + e(p.pontLibelles[1]) + '</p><p>' + e(suite) + '</p></div></article>').join('') + '</div>' + appuis(p.pont.refs);
  const pratique = '<div class="enseignement-essai"><h3>' + e(p.pratique.titre) + '</h3>' + paragraphes(p.pratique.paragraphes) + '</div><div class="enseignement-experiences"><section><h4>' + e(s.experiences) + '</h4>' + liste(iEns.map(i => c.parcours.etapes[i])) + '</section>' + (iMent >= 0 ? '<section><h4>' + e(s.mentorat) + '</h4>' + liste([c.engagements.groupes[gMent].items[iMent]]) + '</section>' : '') + '</div><h4 class="titre-bloc">' + e(s.academique[0]) + '</h4><ul class="puces"><li>' + lien(c.chemin + 'docs/cv-academique.pdf', e(s.academique[1])) + '</li><li><a href="#publications">' + e(s.academique[2]) + '</a></li></ul>' + appuis(p.pratique.refs);
  const valeurs = RENDU_PEDAGOGIQUE(c, DISPOSITIFS_PEDAGOGIQUES[c.lang], e, ENSEIGNEMENT.references);
  const apprendre = '<div class="enseignement-essai"><h3>' + e(p.apprendre.titre) + '</h3>' + paragraphes(p.apprendre.paragraphes) + '</div><section class="enseignement-sequence"><header><p class="surtitre">' + e(p.apprendre.scenarioTitre) + '</p><p>' + e(p.apprendre.scenarioIntro) + '</p></header><ol>' + p.apprendre.etapes.map(([titre, texte], i) => '<li><span class="enseignement-repere" aria-hidden="true">' + num(i) + '</span><div><h4>' + e(titre) + '</h4><p>' + e(texte) + '</p></div></li>').join('') + '</ol></section>' + appuis(p.apprendre.refs);
  const avenir = essai(p.avenir) + '<p class="enseignement-lien"><a href="#ia">' + e(p.suiteIA) + ' →</a></p>';
  const sources = '<div class="enseignement-essai"><h3>' + e(p.sources.titre) + '</h3><p>' + e(p.sources.intro) + '</p></div><ul class="methode-refs references-transmission enseignement-references">' + Object.values(ENSEIGNEMENT.references).sort((a,b) => a.citation.localeCompare(b.citation, 'en')).map(r => '<li>' + e(r.citation) + ' ' + lien(r.href, e(r.href)) + '</li>').join('') + '</ul>';
  const contenus = [c.lang === 'fr' ? require('./enseignement-immersif.cjs').render() : essai(p.vision), pont, pratique, valeurs, apprendre, avenir, sources];
  const titresEns=[...p.onglets];titresEns[3]=DISPOSITIFS_PEDAGOGIQUES[c.lang].onglet;titresEns.splice(5,0,ATELIERS.textes(c.lang,'enseignement').labels.atelier);contenus.splice(5,0,atelierPratique(c,'enseignement'));
  return '<div class="section-corps pleine enseignement"><div class="colonne-texte"><p class="surtitre">' + e(s.salle[0]) + '</p><h2>' + e(p.titre) + '</h2><p class="intro">' + e(p.intro) + '</p></div><div class="colonne-outils">' + chapitresSource(c, 'enseignement', p.explorer, titresEns.map((titre, i) => ['enseignement-' + i, titre, contenus[i]]), 4) + '</div></div>';
}
function sectionVulgarisation(c) {
  const s = MEDIATION.LANGUES[c.lang].vulgarisation;
  const v = VULGARISATION.langues[c.lang];
  const L = v.labels;
  const T = textesTransmission(c);
  const affiche = c.contact.liens.find(l => /affiche|poster|póster|海报|ملصق|постер/i.test(l[0] + l[1]));
  const refs = cles => '<p class="ref vul-appuis">' + e(L.appuis) + ' : ' + cles.map(k => lien(VULGARISATION.references[k].href, e(VULGARISATION.references[k].court))).join(' · ') + '</p>';
  const sections = parties => parties.map(([titre, texte]) => '<section class="vul-texte"><h4>' + e(titre) + '</h4><p>' + e(texte) + '</p></section>').join('');
  const chaine = (items, classe) => '<ol class="vul-parcours ' + classe + '">' + items.map(([titre, texte], i) => '<li><span aria-hidden="true">' + num(i) + '</span><h4>' + e(titre) + '</h4><p>' + e(texte) + '</p></li>').join('') + '</ol>';
  const image = i => '<img src="' + c.chemin + 'assets/illustrations/vulgarisation-' + ['carrousel','video','balado'][i] + '.svg" alt="" width="480" height="260" loading="lazy">';
  const vision = '<h3>' + e(v.vision.titre) + '</h3>' + sections(v.vision.sections) + '<figure class="vul-relations"><figcaption>' + e(v.vision.modesTitre) + '</figcaption><div>' + v.vision.modes.map(([titre, texte, ex], i) => '<article><span class="vul-mode" aria-hidden="true">' + ['→','↔','◇','◎'][i] + '</span><h4>' + e(titre) + '</h4><p>' + e(texte) + '</p><p class="vul-exemple">' + e(ex) + '</p></article>').join('') + '</div><p>' + e(v.vision.note) + '</p></figure>' + refs(v.vision.refs);
  const grillePoints = n => '<svg class="vul-pictogramme" viewBox="0 0 192 192" aria-hidden="true" focusable="false">' + Array.from({length:100}, (_, i) => '<circle cx="' + (15 + i % 10 * 18) + '" cy="' + (15 + Math.floor(i / 10) * 18) + '" r="5.5" fill="' + (i < n ? '#256d68' : '#e1e8eb') + '"' + (i < n ? '' : ' stroke="#a2b5bc" stroke-width=".7"') + '/>').join('') + '</svg>';
  const chiffres = '<figure class="vul-chiffres"><figcaption>' + e(v.chiffres.titre) + '</figcaption><p>' + e(v.chiffres.intro) + '</p><div class="vul-frequences">' + [20,10].map((n,i) => '<div><h4>' + e(v.chiffres.groupes[i]) + '</h4>' + grillePoints(n) + '<p><strong>' + e(v.chiffres.frequences[i]) + '</strong></p></div>').join('') + '</div><p class="vul-legende">' + e(v.chiffres.legende) + '</p><div class="vul-mesures">' + v.chiffres.mesures.map(([t,n,d]) => '<div><h4>' + e(t) + '</h4><strong>' + e(n) + '</strong><p>' + e(d) + '</p></div>').join('') + '</div><p class="vul-note">' + e(v.chiffres.conclusion) + '</p></figure>' + refs(v.chiffres.refs);
  const preuve = '<h3>' + e(v.preuve.titre) + '</h3><p class="vul-texte">' + e(v.preuve.intro) + '</p>' + chaine(v.preuve.chaine, 'vul-chaine-preuve') + sections(v.preuve.fiches) + refs(v.preuve.refs) + chiffres;
  const formats = '<h3>' + e(v.formats.titre) + '</h3><p class="vul-texte">' + e(v.formats.intro) + '</p><div class="vul-formats">' + v.formats.items.map((f, i) => '<article><div class="vul-format-entete"><div>' + image(i) + '</div><div><p class="surtitre">' + e(L.exemple) + ' ' + num(i) + '</p><h4>' + e(f.titre) + '</h4><p>' + e(f.objectif) + '</p></div></div><h5>' + e(L.structure) + '</h5><ol class="vul-storyboard">' + f.structure.map(([titre, texte], j) => '<li><span aria-hidden="true">' + num(j) + '</span><h5>' + e(titre) + '</h5><p>' + e(texte) + '</p></li>').join('') + '</ol><div class="vul-format-suite"><div><h5>' + e(L.accessibilite) + '</h5><p>' + e(f.accessibilite) + '</p></div><aside><h5>' + e(L.question) + '</h5><p>' + e(f.question) + '</p></aside></div>' + refs(f.refs) + '</article>').join('') + '</div>';
  const dialogue = '<h3>' + e(v.dialogue.titre) + '</h3><p class="vul-texte">' + e(v.dialogue.intro) + '</p>' + sections(v.dialogue.sections) + '<h4 class="titre-bloc">' + e(v.dialogue.boucleTitre) + '</h4>' + chaine(v.dialogue.boucle, 'vul-boucle') + '<h4 class="titre-bloc">' + e(v.dialogue.evaluationTitre) + '</h4><div class="vul-evaluation">' + v.dialogue.evaluation.map(([t,d,l], i) => '<article><span aria-hidden="true">' + num(i) + '</span><h5>' + e(t) + '</h5><p class="vul-petit-titre">' + e(L.recueil) + '</p><p>' + e(d) + '</p><p class="vul-petit-titre">' + e(L.prudence) + '</p><p>' + e(l) + '</p></article>').join('') + '</div><p class="vul-note">' + e(v.dialogue.note) + '</p>' + refs(v.dialogue.refs);
  const fiche = (nom, titre, items) => {
    const fichier = 'docs/vulgarisation-' + nom + '-' + c.lang + '.md';
    fs.writeFileSync(path.join(RACINE, fichier), '# ' + titre + '\n\n' + v.outils.intro + '\n\n' + items.map(([t, d], i) => '## ' + (i + 1) + '. ' + t + '\n\n' + d + '\n\n…\n').join('\n') + '\n' + L.appuis + '\n\n' + v.outils.refs.map(k => VULGARISATION.references[k].citation + '\n' + VULGARISATION.references[k].href).join('\n\n') + '\n');
    return '<section class="vul-fiche"><header><h4>' + e(titre) + '</h4><a href="' + c.chemin + fichier + '" download>' + e(L.telecharger) + ' ↓</a></header><dl>' + items.map(([t,d]) => '<div><dt>' + e(t) + '</dt><dd>' + e(d) + '</dd></div>').join('') + '</dl></section>';
  };
  const outils = '<h3>' + e(v.outils.titre) + '</h3><p class="vul-texte">' + e(v.outils.intro) + '</p><div class="vul-fiches">' + fiche('preparation', L.fiche, v.outils.preparation) + fiche('lecture', L.grille, v.outils.lecture) + '</div>' + refs(v.outils.refs);
  const ressources = '<h3>' + e(v.ressources.titre) + '</h3><p class="vul-texte">' + e(v.ressources.intro) + '</p><div class="vul-bibliotheque">' + Object.entries(v.ressources.items).map(([k,[type,apport,usage,limite]]) => {
    const r = VULGARISATION.references[k];
    return '<article><p class="vul-type">' + e(type) + '</p><h4>' + e(r.court) + '</h4><p>' + e(apport) + '</p><details><summary>' + e(L.usage) + '</summary><p>' + e(usage) + '</p><p><strong>' + e(L.limite) + '.</strong> ' + e(limite) + '</p><p class="vul-citation">' + e(r.citation) + '</p></details><p class="vul-source">' + lien(r.href, e(L.source) + ' ↗') + '</p></article>';
  }).join('') + '</div><h4 class="titre-bloc">' + e(v.ressources.suite) + '</h4><div class="vul-liens">' + ['litterature','grise','capsules','balados'].map((k,i) => '<a href="#' + k + '">' + e(v.ressources.liens[i]) + ' →</a>').join('') + '</div><h4 class="titre-bloc">' + e(s.supports) + '</h4>' + liste([{date:'2026',titre:T.affiche[0],detail:T.affiche[1],lien:affiche ? affiche[2] : AFFICHE}]);
  const contenus = [vision, preuve, communicationVisuelle(c, s.pratiques), formats, dialogue, outils, ressources];
  return '<div class="section-corps pleine vulgarisation"><div class="colonne-texte"><p class="surtitre">' + e(s.salle[0]) + '</p><h2>' + e(v.titre) + '</h2><p class="intro">' + e(v.intro) + '</p></div><figure class="vul-galerie"><figcaption>' + e(v.galerie.titre) + '</figcaption><div>' + v.galerie.legendes.map((legende,i) => '<div>' + image(i) + '<p>' + e(legende) + '</p></div>').join('') + '</div></figure><div class="colonne-outils">' + chapitresSource(c, 'vulgarisation', v.explorer, v.onglets.map((t,i) => ['vulgarisation-' + i,t,contenus[i]]), 4) + '</div></div>';
}
const SOUS_RESSOURCES = {
  fr: { litterature: ["Littérature scientifique", "Articles en libre accès et lectures par thème"], grise: ["Littérature grise", "Rapports, politiques, guides et outils"], presse: [null, "Articles de presse et de magazines"], capsules: [null, "Vidéos en français et en anglais"], balados: [null, "Balados en français et en anglais"], rapports: "Rapports, politiques et cadres de référence" },
  en: { litterature: ["Scientific literature", "Open-access articles and readings by theme"], grise: ["Grey literature", "Reports, policies, guides and tools"], presse: [null, "Newspaper and magazine articles"], capsules: [null, "Videos in French and English"], balados: [null, "Podcasts in French and English"], rapports: "Reports, policies and frameworks" },
  es: { litterature: ["Literatura científica", "Artículos de acceso abierto y lecturas por tema"], grise: ["Literatura gris", "Informes, políticas, guías y herramientas"], presse: [null, "Artículos de prensa y revistas"], capsules: [null, "Vídeos en francés y en inglés"], balados: [null, "Pódcasts en francés y en inglés"], rapports: "Informes, políticas y marcos de referencia" },
  zh: { litterature: ["科学文献", "开放获取论文与分主题阅读"], grise: ["灰色文献", "报告、政策、指南与工具"], presse: [null, "报刊与杂志文章"], capsules: [null, "法语和英语视频"], balados: [null, "法语和英语播客"], rapports: "报告、政策与参考框架" },
  ar: { litterature: ["الأدبيات العلمية", "مقالات مفتوحة الوصول وقراءات حسب الموضوع"], grise: ["الأدبيات الرمادية", "تقارير وسياسات وأدلة وأدوات"], presse: [null, "مقالات صحفية ومقالات مجلات"], capsules: [null, "مقاطع فيديو بالفرنسية والإنجليزية"], balados: [null, "بودكاست بالفرنسية والإنجليزية"], rapports: "تقارير وسياسات وأطر مرجعية" },
};
// Groupes de ressources (même ordre dans toutes les langues) : 0 articles, 1 guides, 2 balados, 3 vidéos, 4 presse.
const PARTIES_RESSOURCES = { litterature: { groupes: [0], lectures: "sci" }, grise: { groupes: [1], lectures: "grise" }, presse: { groupes: [4] }, capsules: { groupes: [3] }, balados: { groupes: [2] } };
const INDEX_ENGAGEMENTS = { representation: 0, communaute: 1, distinctions: 2, citoyen: 3, loisirs: 4 };
const GRISE = /^(Ministère|Commissaire|Institut national|Commission|Organisation mondiale|World Health|National Academies|Institute of Medicine|OECD|OCDE)/;
// Libellés des petites portes de Ressources et d'Engagements, posés avant la construction de la page.
function poserSousPortes(c) {
  const S = SOUS_RESSOURCES[c.lang] || SOUS_RESSOURCES.en;
  for (const [s, P] of Object.entries(PARTIES_RESSOURCES)) c.hall.portes[s] = [S[s][0] || c.ressources.groupes[P.groupes[0]][0], S[s][1]];
  for (const [s, k] of Object.entries(INDEX_ENGAGEMENTS)) c.hall.portes[s] = [c.engagements.groupes[k].titre, c.hall.portes.engagements[0]];
}
const BANDEAUX = { logiciels:"bandeaux/logiciels.svg", methodes: "bandeaux/conceptualisation.jpg", axes: "bandeaux/recherche.jpg", ia: "bandeaux/grise.jpg", vulgarisation: "photos/ecriture.jpg", litterature: "bandeaux/ressources.jpg", representation: "photos/representation.jpg", communaute: "bandeaux/engagements.jpg", distinctions: "photos/distinctions.jpg", loisirs: "bandeaux/sports-loisirs.png" };
const bandeau = (s) => BANDEAUX[s] || "bandeaux/" + s + ".jpg";
const miniSalle = (s) => ({ logiciels:"logiciels", methodes: "conceptualisation", axes: "recherche", ia: "outils", vulgarisation: "presse" }[s] || s);
// Lexique : seize notions, quatre familles et références communes au format APA.
const NOTIONS = require("./notions-cles");
const textesNotions = (c) => NOTIONS.langues[c.lang] || NOTIONS.langues.en;
function referenceNotion(r) {
  const auteurs = r.editors ? `${e(r.authors)} (Eds.).` : `${e(r.authors)}${r.authors.endsWith(".") ? "" : "."}`;
  const titre = r.book ? `<em>${e(r.title)}</em>` : e(r.title);
  const ponctuation = /[.!?]$/.test(r.title) ? "" : ".";
  const support = r.journal
    ? `<em>${e(r.journal)}${r.volume ? ", " + e(r.volume) : ""}</em>${r.issue ? "(" + e(r.issue) + ")" : ""}${r.pages || r.article ? ", " + e(r.pages || "Article " + r.article) : ""}.`
    : r.publisher ? e(r.publisher) + "." : "";
  return `${auteurs} (${e(String(r.year))}). ${titre}${ponctuation} ${support} <a href="${e(r.href)}" target="_blank" rel="noopener noreferrer">${e(r.href)}</a>`;
}
function sectionNotions(c) {
  const N = textesNotions(c);
  const cles = NOTIONS.groupes.flat();
  const carte = (k) => {
    const [titre, definition, usage, precision] = N.items[k];
    const refs = NOTIONS.appuis[k].map((r) => NOTIONS.references[r]).sort((a, b) => a.authors.localeCompare(b.authors, "en"));
    return `<article class="groupe-carte carte-notion notion-cadre"><div class="groupe-corps"><header class="notion-entete"><span class="notion-numero" aria-hidden="true">${num(cles.indexOf(k))}</span><h4 class="titre-bloc">${e(titre)}</h4></header><p class="notion-definition">${e(definition)}</p><div class="notion-usage"><p class="notion-libelle">${e(N.usage)}</p><p>${e(usage)}</p></div><p class="notion-precision"><strong>${e(N.precision)}.</strong> ${e(precision)}</p><details class="notion-biblio"><summary>${e(k === "epistemique" ? N.appuis : N.sources)}</summary><ol class="notion-refs">${refs.map((r) => `<li>${referenceNotion(r)}</li>`).join("")}</ol></details></div></article>`;
  };
  const rubriques = NOTIONS.groupes.map((g, i) => [`notions-${i + 1}`, N.familles[i], `<h3 class="lexique-famille">${e(N.familles[i])}</h3><div class="lexique-grille">${g.map(carte).join("")}</div>`]);
  return `<div class="section-corps pleine lexique"><div class="colonne-texte"><p class="surtitre">${e(N.surtitre)}</p><h2>${e(N.titre)}</h2><p class="intro">${e(N.intro)}</p></div><div class="colonne-outils">${chapitresSource(c, "notions", N.explorer, rubriques, 4)}</div></div>`;
}

const OUTILS = {
  fr: { salle: ["Productions numériques", "OWNNIGHT et les Sphères"], surtitre: "Productions numériques", titre: "Des applications pour apprendre et prendre soin", intro: "Deux projets numériques conçus à partir de besoins concrets : rendre les connaissances utiles, accessibles et mobilisables au quotidien.", etiquettes: ["Ce que c’est", "Le but", "La lacune comblée"],
    ownnight: { nom: "OWNNIGHT", slogan: "La science de ton sommeil, entre tes mains.", statut: "Projet entrepreneurial en cours · Android",
      quoi: "Une application Android de bien-être et d’éducation au sommeil, en français et en anglais. Elle propose un plan individualisé qui s’ajuste aux réponses de la personne, de courtes leçons, des séances guidées, des outils pour apaiser l’esprit, un rituel du soir et des histoires lues à voix haute.",
      but: "Donner à chacun les moyens d’agir sur son sommeil : s’autoévaluer, comprendre ce qui se joue la nuit et apprendre à en prendre soin, grâce à une éducation au sommeil fondée sur la thérapie cognitive et comportementale de l’insomnie (TCC-I).",
      lacune: "L’accompagnement fondé sur la TCC-I, traitement de première intention de l’insomnie, reste difficile d’accès, et beaucoup d’applications se contentent de mesurer le sommeil sans aider à le comprendre, tout en exploitant les données personnelles. OWNNIGHT mise sur l’empowerment : la personne apprend, s’autoévalue et devient actrice de son sommeil. Tout reste sur le téléphone, chiffré, sans compte.",
      alts: ["Écran d’accueil d’OWNNIGHT : la soirée et le plan de la semaine", "Une leçon d’OWNNIGHT : l’horloge biologique et la pression de sommeil", "Le suivi de la semaine dans OWNNIGHT"] },
    spheres: { nom: "Les Sphères", slogan: "Épisphère et Statosphère : comprendre l’épidémiologie et les statistiques, à son rythme.", statut: "Ordinateur, tablette et téléphone · hors ligne",
      quoi: "Deux applications d’apprentissage sœurs, l’une pour l’épidémiologie, l’autre pour les statistiques. Elles fonctionnent hors ligne sur ordinateur, tablette et téléphone : leçons expliquées pas à pas, diapositives commentées, fiches, questions à choix multiples avec rétroaction, cartes à mémoriser, exercices corrigés et suivi des progrès, avec un tuteur intégré, Sigma.",
      but: "Aider à comprendre les méthodes plutôt qu’à les mémoriser : chaque formule est expliquée par ce qu’elle fait, puis lue pas à pas, et chacun organise sa révision selon ses besoins.",
      lacune: "Les méthodes quantitatives intimident souvent les personnes venues d’autres disciplines, et les ressources sont dispersées, souvent en anglais ou très techniques. Les Sphères réunissent tout au même endroit, en français, avec une progression accessible et des explications en langage clair.",
      alts: ["Une leçon expliquée pas à pas", "Une question à choix multiples avec rétroaction", "Les cartes à mémoriser"] } },
  en: { salle: ["Digital productions", "OWNNIGHT and the Spheres"], surtitre: "Digital productions", titre: "Apps for learning and caring", intro: "Two digital projects developed from concrete needs: making knowledge useful, accessible and applicable in everyday life.", etiquettes: ["What it is", "The aim", "The gap it fills"],
    ownnight: { nom: "OWNNIGHT", slogan: "The science of your sleep, in your hands.", statut: "Entrepreneurial project in progress · Android",
      quoi: "An Android app for sleep well-being and education, in French and English. It offers an individualised plan that adapts to each answer, short lessons, guided sessions, tools to calm the mind, an evening ritual and stories read aloud.",
      but: "Empowering people to act on their own sleep: assessing it themselves, understanding what happens at night and learning to take care of it, through sleep education grounded in cognitive behavioural therapy for insomnia (CBT-I).",
      lacune: "Support based on CBT-I, the first-line treatment for insomnia, remains hard to access, and many apps merely measure sleep without helping people understand it, while exploiting personal data. OWNNIGHT focuses on empowerment: people learn, assess themselves and take an active role in their own sleep. Everything stays on the phone, encrypted, with no account.",
      alts: ["OWNNIGHT home screen: the evening and the week’s plan", "An OWNNIGHT lesson: the body clock and sleep pressure", "Weekly tracking in OWNNIGHT"] },
    spheres: { nom: "The Spheres", slogan: "Episphère and Statosphère: understanding epidemiology and statistics at your own pace.", statut: "Computer, tablet and phone · offline",
      quoi: "Two sister learning apps, one for epidemiology and the other for statistics. They work offline on computer, tablet and phone: step-by-step lessons, annotated slides, summary sheets, multiple-choice questions with feedback, flashcards, worked exercises and progress tracking, with a built-in tutor, Sigma.",
      but: "Helping people understand methods rather than memorise them: each formula is explained by what it does, then read step by step, and everyone organises their revision around their own needs.",
      lacune: "Quantitative methods often intimidate people from other disciplines, and resources are scattered, often in English or highly technical. The Spheres bring everything together in one place, in French, with an accessible progression and plain-language explanations.",
      alts: ["A lesson explained step by step", "A multiple-choice question with feedback", "Flashcards"] } },
  es: { salle: ["Producciones digitales", "OWNNIGHT y las Esferas"], surtitre: "Producciones digitales", titre: "Aplicaciones para aprender y cuidarse", intro: "Dos proyectos digitales concebidos a partir de necesidades concretas: hacer que los conocimientos sean útiles, accesibles y aplicables en la vida cotidiana.", etiquettes: ["Qué es", "El objetivo", "La carencia que cubre"],
    ownnight: { nom: "OWNNIGHT", slogan: "La ciencia de tu sueño, en tus manos.", statut: "Proyecto emprendedor en curso · Android",
      quoi: "Una aplicación Android de bienestar y educación sobre el sueño, en francés y en inglés. Ofrece un plan individualizado que se ajusta a cada respuesta, lecciones breves, sesiones guiadas, herramientas para calmar la mente, un ritual nocturno e historias leídas en voz alta.",
      but: "Dar a cada persona los medios para actuar sobre su sueño: autoevaluarse, comprender lo que ocurre por la noche y aprender a cuidarlo, gracias a una educación sobre el sueño basada en la terapia cognitivo-conductual del insomnio (TCC-I).",
      lacune: "El acompañamiento basado en la TCC-I, tratamiento de primera línea del insomnio, sigue siendo de difícil acceso, y muchas aplicaciones se limitan a medir el sueño sin ayudar a comprenderlo, mientras explotan los datos personales. OWNNIGHT apuesta por el empoderamiento: la persona aprende, se autoevalúa y se vuelve protagonista de su sueño. Todo queda en el teléfono, cifrado y sin cuenta.",
      alts: ["Pantalla de inicio de OWNNIGHT: la noche y el plan de la semana", "Una lección de OWNNIGHT: el reloj biológico y la presión de sueño", "El seguimiento semanal en OWNNIGHT"] },
    spheres: { nom: "Las Esferas", slogan: "Episphère y Statosphère: comprender la epidemiología y la estadística a tu ritmo.", statut: "Ordenador, tableta y teléfono · sin conexión",
      quoi: "Dos aplicaciones de aprendizaje hermanas, una para la epidemiología y otra para la estadística. Funcionan sin conexión en ordenador, tableta y teléfono: lecciones explicadas paso a paso, diapositivas comentadas, fichas, preguntas de opción múltiple con retroalimentación, tarjetas para memorizar, ejercicios corregidos y seguimiento del progreso, con un tutor integrado, Sigma.",
      but: "Ayudar a comprender los métodos en lugar de memorizarlos: cada fórmula se explica por lo que hace y luego se lee paso a paso, y cada persona organiza su repaso según sus necesidades.",
      lacune: "Los métodos cuantitativos suelen intimidar a quienes vienen de otras disciplinas, y los recursos están dispersos, a menudo en inglés o muy técnicos. Las Esferas lo reúnen todo en un solo lugar, en francés, con una progresión accesible y explicaciones en lenguaje claro.",
      alts: ["Una lección explicada paso a paso", "Una pregunta de opción múltiple con retroalimentación", "Las tarjetas para memorizar"] } },
  zh: { salle: ["数字作品", "OWNNIGHT 与 Sphères"], surtitre: "数字作品", titre: "用于学习与自我照护的应用", intro: "两个从具体需求出发的数字项目：让知识变得实用、易于获取，并能应用于日常生活。", etiquettes: ["是什么", "目标", "填补的空白"],
    ownnight: { nom: "OWNNIGHT", slogan: "你的睡眠科学，掌握在你手中。", statut: "进行中的创业项目 · Android",
      quoi: "一款关于睡眠健康与睡眠教育的 Android 应用，提供法语和英语版本。它提供根据每次回答调整的个性化计划、简短课程、引导练习、帮助平静心绪的工具、睡前仪式以及有声故事。",
      but: "让每个人都有能力改善自己的睡眠：自我评估、理解夜间发生的事情，并学会照顾自己的睡眠。这一切依托于以失眠认知行为疗法（CBT-I）为基础的睡眠教育。",
      lacune: "以失眠认知行为疗法（失眠的一线治疗）为基础的支持仍然难以获得，而许多应用只测量睡眠，却不帮助人们理解睡眠，同时还利用个人数据。OWNNIGHT 注重赋能：让人们学习、自我评估，并成为自己睡眠的主导者。所有数据都加密保存在手机上，无需账户。",
      alts: ["OWNNIGHT 主屏幕：当晚安排与本周计划", "OWNNIGHT 的一节课：生物钟与睡眠压力", "OWNNIGHT 的每周追踪"] },
    spheres: { nom: "Sphères 系列", slogan: "Épisphère 与 Statosphère：按自己的节奏理解流行病学与统计学。", statut: "电脑、平板与手机 · 可离线使用",
      quoi: "两款姊妹学习应用，一款面向流行病学，另一款面向统计学。它们可在电脑、平板和手机上离线使用：逐步讲解的课程、带讲解的幻灯片、知识卡片、带反馈的选择题、记忆卡、附答案的练习和进度追踪，并配有内置导师 Sigma。",
      but: "帮助人们理解方法而不是死记硬背：每个公式都先说明它的作用，再逐步解读，每个人都可以根据自己的需要安排复习。",
      lacune: "定量方法常常让来自其他学科的人望而却步，而相关资源分散，往往是英文或过于技术化。Sphères 将一切集中在一处，以法语呈现，循序渐进，并用通俗语言讲解。",
      alts: ["逐步讲解的课程", "带反馈的选择题", "记忆卡"] } },
  ar: { salle: ["الإنتاجات الرقمية", "OWNNIGHT وتطبيقات Sphères"], surtitre: "الإنتاجات الرقمية", titre: "تطبيقات للتعلّم وللعناية بالذات", intro: "مشروعان رقميان انطلقا من احتياجات ملموسة: جعل المعارف مفيدة وميسّرة وقابلة للاستخدام في الحياة اليومية.", etiquettes: ["ما هو", "الهدف", "الفجوة التي يسدّها"],
    ownnight: { nom: "OWNNIGHT", slogan: "علم نومك بين يديك.", statut: "مشروع ريادي قيد الإنجاز · Android",
      quoi: "تطبيق Android للعافية والتثقيف حول النوم، بالفرنسية والإنجليزية. يقدّم خطة فردية تتكيّف مع كل إجابة، ودروسًا قصيرة، وجلسات موجّهة، وأدوات لتهدئة الذهن، وطقسًا مسائيًا، وقصصًا مقروءة بصوت عالٍ.",
      but: "تمكين كل شخص من التأثير في نومه: أن يقيّم نومه بنفسه، ويفهم ما يجري ليلًا، ويتعلّم العناية به، بفضل تثقيف حول النوم قائم على العلاج المعرفي السلوكي للأرق.",
      lacune: "تبقى المرافقة القائمة على العلاج المعرفي السلوكي للأرق، وهو العلاج الأول للأرق، صعبة المنال، وكثير من التطبيقات تكتفي بقياس النوم دون المساعدة على فهمه، مع استغلال البيانات الشخصية. يراهن OWNNIGHT على التمكين: يتعلّم الشخص ويقيّم نفسه ويصبح فاعلًا في نومه. يبقى كل شيء على الهاتف، مشفّرًا ومن دون حساب.",
      alts: ["الشاشة الرئيسية لـ OWNNIGHT: المساء وخطة الأسبوع", "درس من OWNNIGHT: الساعة البيولوجية وضغط النوم", "المتابعة الأسبوعية في OWNNIGHT"] },
    spheres: { nom: "تطبيقات Sphères", slogan: "Épisphère وStatosphère: فهم علم الأوبئة والإحصاء وفق إيقاعك.", statut: "حاسوب وجهاز لوحي وهاتف · من دون اتصال",
      quoi: "تطبيقان تعليميان شقيقان، أحدهما لعلم الأوبئة والآخر للإحصاء. يعملان من دون اتصال على الحاسوب والجهاز اللوحي والهاتف: دروس مشروحة خطوة بخطوة، وشرائح مع تعليقات، وبطاقات ملخّصة، وأسئلة اختيار من متعدد مع تغذية راجعة، وبطاقات للحفظ، وتمارين مصحّحة، ومتابعة للتقدّم، مع مرشد مدمج اسمه Sigma.",
      but: "المساعدة على فهم المناهج بدل حفظها: تُشرح كل معادلة بما تفعله ثم تُقرأ خطوة بخطوة، وينظّم كل شخص مراجعته وفق احتياجاته.",
      lacune: "كثيرًا ما تُرهب المناهج الكمية القادمين من تخصصات أخرى، والموارد مبعثرة، غالبًا بالإنجليزية أو شديدة التقنية. تجمع Sphères كل شيء في مكان واحد، بالفرنسية، مع تدرّج ميسّر وشروح بلغة واضحة.",
      alts: ["درس مشروح خطوة بخطوة", "سؤال اختيار من متعدد مع تغذية راجعة", "بطاقات للحفظ"] } },
};
const IMAGES_OUTILS = { ownnight: ["ownnight-accueil.jpg", "ownnight-lecon.jpg", "ownnight-semaine.jpg"], spheres: ["spheres-lecon.jpg", "spheres-qcm.jpg", "spheres-memoriser.jpg"] };
const textesOutils = (c) => OUTILS[c.lang] || OUTILS.en;
function sectionOutils(c) {
  const O = textesOutils(c);
  const img = (f, alt, cls) => `<img class="${cls}" src="${c.chemin}assets/projets/${f}?v=${empreinte("assets/projets/" + f)}" alt="${e(alt)}" loading="lazy">`;
  const projet = (k) => {
    const P = O[k];
    const textes = [P.quoi, P.but, P.lacune].map((t, i) => `<div class="projet-bloc"><h4>${e(O.etiquettes[i])}</h4><p>${e(t)}</p></div>`).join("");
    const galerie = IMAGES_OUTILS[k].map((f, i) => img(f, P.alts[i], k === "ownnight" ? "ecran-tel" : "ecran-tab")).join("");
    return `<article class="projet projet-${k}"><div class="projet-tete"><h3>${e(P.nom)}</h3><p class="projet-slogan">${e(P.slogan)}</p><span class="projet-statut">${e(P.statut)}</span></div><div class="projet-corps"><div class="projet-textes">${textes}</div><div class="projet-galerie galerie-${k}">${galerie}</div></div></article>`;
  };
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(O.surtitre)}</p>
<h2>${e(O.titre)}</h2>
<p class="intro">${e(O.intro)}</p>
</div>
<div class="colonne-outils"><div class="projets">${projet("ownnight")}${projet("spheres")}</div></div>
</div>`;
}
const VITRINES = JSON.parse(fs.readFileSync(path.join(__dirname, "vitrines.json"), "utf8"));
const CLES_VITRINES = ["juriste", "gestionnaire", "educateur", "entrepreneuriat"];
const textesVitrine = (c, cle) => (VITRINES[c.lang] || VITRINES.en)[cle];
// Vitrine d'expertise : en-tête, puis une carte par domaine avec ses matières ou réalisations.
function sectionVitrine(c, cle) {
  const V = textesVitrine(c, cle);
  const projets = cle === "entrepreneuriat"
    ? `<div class="projets-vignettes">${["ownnight-accueil.jpg", "spheres-lecon.jpg"].map((f, i) => `<img class="${i ? "ecran-tab" : "ecran-tel"} vignette-projet" src="${c.chemin}assets/projets/${f}?v=${empreinte("assets/projets/" + f)}" alt="" loading="lazy">`).join("")}</div><a class="lien-salle" href="#outils">${e(V.lien)} <span aria-hidden="true">→</span></a>`
    : "";
  const cartes = V.blocs.map(([t, items, opt], k) => {
    const reperes = opt && opt.reperes
      ? `<p class="cnp-introduction">${e(opt.introduction)}</p><div class="cnp-reperes">${opt.reperes.map(([titre, texte, lien]) => `<div><h4>${e(titre)}</h4><p>${e(texte)}</p><a href="${e(lien)}">${e(opt.source)}</a></div>`).join("")}</div><h4 class="cnp-competences">${e(opt.listeTitre)}</h4>`
      : "";
    return `<article class="groupe-carte carte-vitrine${opt && opt.large ? " carte-large" : ""}"><div class="groupe-corps"><h3 class="titre-bloc">${e(t)}</h3>${reperes}<ul class="vitrine-liste">${items.map((x, j) => `<li${cle === "gestionnaire" && k === V.blocs.length - 1 && j === 2 ? ' data-axe-cible="experience-anap"' : ""}>${e(x)}</li>`).join("")}</ul>${k === V.blocs.length - 1 ? projets : ""}</div></article>`;
  }).join("");
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(V.surtitre)}</p>
<h2>${e(V.titre)}</h2>
<p class="intro">${e(V.intro)}</p>
</div>
<div class="colonne-outils"><div class="groupes-grille grille-vitrine">${cartes}</div></div>
</div>`;
}
const TEXTES_GROUPES = {
  fr: { ressources: ["Ressources","Logiciels, lectures, vidéos et balados"], recherche: ["Recherche", "Thèse, méthodes, travaux, publications et innovations"], parcours: ["Parcours", "Biographie, parcours, expertises et valeurs"] },
  en: { ressources: ["Resources","Learning software, readings, videos and podcasts"], recherche: ["Research", "Thesis, methods, current work, publications and innovation"], parcours: ["Background", "Biography, background, expertise and values"] },
  es: { ressources: ["Recursos","Programas educativos, lecturas, vídeos y pódcasts"], recherche: ["Investigación", "Tesis, métodos, trabajos, publicaciones e innovación"], parcours: ["Trayectoria", "Biografía, trayectoria, pericias y valores"] },
  zh: { ressources: ["资源","学习软件、文献、视频与播客"], recherche: ["研究", "博士论文、研究方法、在研工作、发表成果与创新"], parcours: ["经历", "个人简介、经历、专长与价值观"] },
  ar: { ressources: ["الموارد","برمجيات تعليمية وقراءات وفيديو وبودكاست"], recherche: ["البحث", "الأطروحة والمنهجيات والأعمال الجارية والمنشورات والابتكار"], parcours: ["المسار", "السيرة والمسار ومجالات الخبرة والقيم"] },
};
const texteGroupe = (c, g) =>
  g === "implantation"
    ? textesTransmission(c).porte
    : g === "contact"
    ? [c.nav.find((x) => x[0] === "contact")[1], `${c.contact.courriel} · ${TELEPHONE[0]}`]
    : (TEXTES_GROUPES[c.lang] || TEXTES_GROUPES.en)[g] || c.hall.portes[g];

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
  fr: '<svg viewBox="0 0 30 20"><path fill="#0055a4" d="M0 0h10v20H0z"/><path fill="#fff" d="M10 0h10v20H10z"/><path fill="#ef4135" d="M20 0h10v20H20z"/></svg>',
  gb: '<svg viewBox="0 0 32 16"><path fill="#012169" d="M0 0h32v16H0z"/><path stroke="#fff" stroke-width="4.5" d="M0 0l32 16M32 0L0 16"/><path stroke="#c8102e" stroke-width="2" d="M0 0l32 16M32 0L0 16"/><path stroke="#fff" stroke-width="6" d="M16 0v16M0 8h32"/><path stroke="#c8102e" stroke-width="3" d="M16 0v16M0 8h32"/></svg>',
  es: '<svg viewBox="0 0 3 2"><path fill="#aa151b" d="M0 0h3v2H0z"/><path fill="#f1bf00" d="M0 .5h3v1H0z"/></svg>',
  cn: `<svg viewBox="0 0 30 20"><path fill="#ee1c25" d="M0 0h30v20H0z"/><path fill="#ffde00" d="${etoile(5, 5, 3)}${etoile(10, 2, 1)}${etoile(12, 4, 1)}${etoile(12, 7, 1)}${etoile(10, 9, 1)}"/></svg>`,
};
// Inuktitut : drapeau du Nunavut (inuksuk rouge, étoile bleue) ; innu-aimun : drapeau de l’Innu Nation (bandes, tambour et bois de caribou).
DRAPEAUX.iu = `<svg viewBox="0 0 32 18"><path fill="#e8c547" d="M0 0h16v18H0z"/><path fill="#fff" d="M16 0h16v18H16z"/><path fill="#d52b1e" d="M14.6 3.2h2.8v2.4h-2.8zM11 6.4h10v1.6H11zM13.6 8.6h4.8v3.2h-4.8zM13.6 12.2h1.6v4.6h-1.6zM16.8 12.2h1.6v4.6h-1.6zM12.6 11.8h6.8v1H12.6z"/><path fill="#1e5aa8" d="${etoile(26.5, 4.2, 2.6)}"/></svg>`;
DRAPEAUX.innu = '<svg viewBox="0 0 24 12"><path fill="#2e7d4f" d="M0 0h24v12H0z"/><path fill="#fff" d="M0 2h24v8H0z"/><path fill="#8ecae6" d="M0 3h24v6H0z"/><circle cx="12" cy="6" r="1.7" fill="#111"/><path d="M9.4 3.6l1.6 1.6M14.6 3.6 13 5.2M9 5l1.4.4M15 5l-1.4.4" stroke="#111" stroke-width=".7" stroke-linecap="round"/></svg>';
const PASTILLES = { ar: "ع", falc: "Aa" };
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
  telephone: '<path d="M6.6 3.5h2.6l1.4 3.8-1.9 1.3a11.5 11.5 0 0 0 6.7 6.7l1.3-1.9 3.8 1.4v2.6a1.8 1.8 0 0 1-2 1.8A16.5 16.5 0 0 1 4.8 5.5a1.8 1.8 0 0 1 1.8-2z"/>',
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

function liste(items, afficherThemes = false) {
  return `<ul class="liste">${items
    .map(
      (it) => `<li${it.cible ? ` data-axe-cible="${e(it.cible)}"` : ""}><span class="date">${e(it.date)}</span><div>${it.statut ? `<span class="statut">${e(it.statut)}</span>` : ""}<h4>${
        it.lien ? lien(it.lien, e(it.titre) + ' <span aria-hidden="true">↗</span>') : e(it.titre)
      }</h4>${it.detail ? `<p>${e(it.detail)}</p>` : ""}${afficherThemes && it.etiquettes?.length ? etiquettes(it.etiquettes, "etiquettes publication-themes") : ""}</div></li>`
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

const IMAGES_GROUPES = { recherche: "recherche.jpg", implantation: "transfert-implantation-pro.jpg", parcours: "parcours-professionnel.jpg", engagements: "engagements.jpg", ressources: "ressources.jpg", contact: "contact.jpg" };
const TEINTES_GROUPES = { recherche: ["#1f5a8a", "#143d5e"], implantation: ["#c0612b", "#8a431c"], parcours: ["#7a4a8c", "#553263"], engagements: ["#a8343f", "#76232b"], ressources: ["#138086", "#0c5a5e"], contact: ["#4f7d2e", "#37591f"] };
const IMAGES_PORTES = {
  recherche: "recherche.jpg",
  approche: "approche.jpg",
  implantation: "implantation.jpg",
  publications: "publications.jpg",
  biographie: "biographie.jpg",
  parcours: "parcours.jpg",
  engagements: "engagements.jpg",
  conceptualisation: "conceptualisation.jpg",
  valeurs: "valeurs.jpg",
  ressources: "ressources.jpg",
};

const TEINTES = {
  recherche: ["#245a73", "#163a4c"],
  approche: ["#8c4d58", "#63343e"],
  methodes: ["#466a78", "#304b56"],
  axes: ["#286d5c", "#1f5446"],
  ia: ["#3f6f8f", "#2c5068"],
  implantation: ["#a0663b", "#7a4a26"],
  biographie: ["#2f6f86", "#1f4f62"],
  publications: ["#327a66", "#1f5446"],
  parcours: ["#9a7448", "#6c4f2e"],
  engagements: ["#5d6585", "#40465f"],
  conceptualisation: ["#3f6f8f", "#2c5068"],
  valeurs: ["#7a5a8c", "#5a4068"],
  ressources: ["#2f7f86", "#215c61"],
  transmission: ["#5f7f35", "#43592a"],
  vulgarisation: ["#2f6f86", "#1f4f62"],
  notions: ["#7a4f9a", "#563870"],
  outils: ["#2f3f7a", "#1c2650"],
  logiciels: ["#138086", "#0c5a5e"],
  juriste: ["#7a2e3a", "#561f28"],
  gestionnaire: ["#46507a", "#2f3656"],
  educateur: ["#4f8a5b", "#37633f"],
  entrepreneuriat: ["#b8862b", "#8a641f"],
  litterature: ["#2a6fb0", "#1d4f80"],
  grise: ["#3d7a5a", "#2a5640"],
  presse: ["#8a5a2b", "#63401e"],
  capsules: ["#1b5e7a", "#124257"],
  balados: ["#5a3d7a", "#3f2a56"],
  representation: ["#5d6585", "#40465f"],
  communaute: ["#2f6f86", "#1f4f62"],
  distinctions: ["#a8842c", "#7a5f1e"],
  citoyen: ["#b5523b", "#843a2a"],
  loisirs: ["#3f8a4f", "#2b6237"],
};


function porte(c, [nom, sections], i) {
  const [titre] = texteGroupe(c, nom);
  const [c1, c2] = TEINTES_GROUPES[nom] || TEINTES[nom];
  const image = IMAGES_GROUPES[nom];
  const fond = image ? ` style="background-image:url(${c.chemin}assets/portes/${image}?v=${empreinte("assets/portes/" + image)})"` : "";
  return `<button class="porte${image ? "" : " porte-contact"}" type="button" data-salle="${nom}" data-sections="${sections.join(" ")}" data-titre="${e(titre)}" style="--c1:${c1};--c2:${c2}" aria-label="${num(i)}. ${e(titre)}">
<span class="baie" aria-hidden="true"><span class="ouverture"><span class="apercu">${e(c.ui.entrer)}</span><span class="battant"><span class="vignette"${fond}></span><span class="poignee"></span></span></span></span>
<span class="porte-texte" aria-hidden="true"><span class="plaque"><span class="num">${num(i)}</span>${e(titre)}</span>${sections.length > 1 ? `<span class="sous-portes">${sections.map((s) => `<span data-sous="${s}" style="--c1:${TEINTES[s][0]}">${e(c.hall.portes[s][0])}</span>`).join("")}</span>` : nom === "contact" ? `<span class="sous-portes"><span data-lien="mailto:${e(c.contact.courriel)}" style="--c1:${c1}">${e(c.contact.ecrire)}</span><span data-lien="${BOOKINGS}" data-nouvel="1" style="--c1:${c1}">${e(textesTransmission(c).rdv)}</span></span>` : ""}<span class="entrer">${e(c.ui.entrer)} →</span></span>
</button>`;
}

function hallEnVolume(c) {
  const h = HALL_3D[c.lang];
  const positions = [[130,-559,0],[890,-559,0],[1,50,90],[1579,-525,-90],[1,680,90],[1579,105,-90]];
  const cube = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m12 3 9 5v8l-9 5-9-5V8l9-5Zm0 10 9-5m-9 5-9-5m9 5v8"/></svg>';
  const stations = GROUPES.map(([nom, sections], i) => {
    const [titre] = texteGroupe(c, nom);
    const teinte = (TEINTES_GROUPES[nom] || TEINTES[nom])[0];
    const [x,z,angle] = positions[i];
    const liens = sections.length ? sections.map(s => '<button type="button" data-hall-sous="' + s + '" style="--c1:' + TEINTES[s][0] + '">' + e(c.hall.portes[s][0]) + '</button>').join('') :
      '<a href="mailto:' + e(c.contact.courriel) + '" style="--c1:' + teinte + '">' + e(c.contact.ecrire) + '</a><a href="' + BOOKINGS + '" target="_blank" rel="noopener noreferrer" style="--c1:' + teinte + '">' + e(textesTransmission(c).rdv) + '</a>';
    return '<div class="station-hall" data-hall-station="' + i + '" style="--station-x:' + x + 'px;--station-z:' + z + 'px;--station-angle:' + angle + 'deg;--c1:' + teinte + '">' + porte(c, [nom, sections], i) + '<section class="panneau-hall" aria-label="' + e(titre) + '"><h3><button type="button" data-hall-entrer="' + i + '"><bdi dir="ltr">' + num(i) + '</bdi><span>' + e(titre) + '</span></button></h3><nav class="sous-portes-murales" aria-label="' + e(h.rubriques + ' · ' + titre) + '">' + liens + '</nav></section></div>';
  }).join('');
  return '<div class="hall" id="hall" data-hall-volume role="group" aria-label="' + e(c.hall.titre) + '"><div class="hall-tete"><span>' + e(c.hall.titre) + '</span><div class="hall-outils"><span>' + e(c.hall.compte.replace(/\d+/, GROUPES.length)) + '</span><button class="hall-mode" type="button" data-hall-mode aria-pressed="false" hidden>' + cube + '<span>' + e(h.mode) + '</span></button></div></div><button class="hall-reprise" type="button" data-reprendre-lecture hidden><span>' + e(h.reprendre) + '</span><strong data-reprise-nom></strong><span aria-hidden="true">↗</span></button><p class="hall-aide-deplacement" id="hall-aide-deplacement">' + e(h.deplacement) + '</p><p class="hall-guide-mobile" data-hall-aide-mobile hidden>' + e(h.aideMobile) + '</p><div class="hall-espace" data-hall-espace><div class="hall-univers"><div class="architecture-hall" aria-hidden="true"><span class="paroi-hall paroi-fond"></span><span class="paroi-hall paroi-gauche"></span><span class="paroi-hall paroi-droite"></span><span class="dallage-hall"></span><span class="plafond-hall"></span><span class="verriere-hall"></span></div><div class="portes">' + stations + '</div></div><div class="hall-commandes" data-hall-commandes hidden><button type="button" data-hall-precedente aria-label="' + e(h.precedente) + '">←</button><output class="hall-position-mobile" data-hall-position aria-live="polite" aria-atomic="true">01 / 06</output><button type="button" data-hall-recentrer>' + cube + '<span>' + e(h.recentrer) + '</span></button><button type="button" data-hall-suivante aria-label="' + e(h.suivante) + '">→</button></div></div><nav class="hall-reperes" data-hall-reperes aria-label="' + e(h.navigation) + '" hidden>' + GROUPES.map(([nom],i) => '<button type="button" data-hall-choix="' + i + '" aria-label="' + e(num(i) + '. ' + texteGroupe(c,nom)[0]) + '" aria-pressed="' + (i===0) + '" style="--c1:' + (TEINTES_GROUPES[nom] || TEINTES[nom])[0] + '"><bdi dir="ltr">' + num(i) + '</bdi><span>' + e(texteGroupe(c,nom)[0]) + '</span></button>').join('') + '</nav><div class="hall-pied"><span>' + e(c.hall.consigne) + '</span></div></div>';
}

// Schémas : réseau égocentré sur le CLSC, postures de recherche, cycle des cinq temps.
const SCHEMAS = {
  fr: {
    reseauTitre: "Le réseau égocentré du CLSC",
    reseauLegende: "Dans ma thèse, l’analyse de réseau est égocentrée : elle se déroule à partir du CLSC. Ses intervenants et gestionnaires nomment leurs interlocuteurs, qui reçoivent à leur tour le questionnaire ; les liens entre partenaires sont ainsi déclarés par les partenaires eux-mêmes. Les vignettes décrivent le réseau potentiel, les interactions des douze derniers mois le réseau réel, et des entretiens sur la carte du réseau éclairent le pourquoi et le comment de ces interactions.",
    partenaires: ["Clinique","Hôpital","Pharmacie","École","Municipalité","Organisme communautaire","CPE"],
    figure: "Gouvernance locale animée par le CLSC du territoire : un milieu d’affiliation pour chaque personne, au sein d’un voisinage de soins et de services.",
    source: "Source : ministère de la Santé et des Services sociaux du Québec (2026), Politique de première ligne.",
    comparePolitique: "Ce que prévoit la politique",
    compareThese: "Schéma de principe de la thèse",
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
    compareThese: "Conceptual illustration of the thesis",
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
    compareThese: "Esquema conceptual de la tesis",
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
    compareThese: "论文的概念示意图",
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
    compareThese: "رسم مفاهيمي للأطروحة",
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
  const placerTexte = (texte, x, y, classe, maximum) => {
    const lignes = [];
    if (c.lang === "zh") {
      const caracteres = Array.from(texte);
      for (let i = 0; i < caracteres.length; i += 9) lignes.push(caracteres.slice(i, i + 9).join(""));
    } else {
      for (const mot of texte.split(" ")) {
        const dernier = lignes.length - 1;
        if (dernier >= 0 && (lignes[dernier] + " " + mot).length <= maximum) lignes[dernier] += " " + mot;
        else lignes.push(mot);
      }
    }
    const debut = classe === "venn-titre" ? y - (lignes.length - 1) * 9 : y;
    return `<text x="${x}" y="${debut}" text-anchor="middle" class="${classe}"${c.lang === "ru" && classe === "venn-titre" ? ' style="font-size:13px"' : ""}>${lignes.map((ligne, i) => `<tspan x="${x}" dy="${i ? 18 : 0}">${e(ligne)}${i < lignes.length - 1 && c.lang !== "zh" ? " " : ""}</tspan>`).join("")}</text>`;
  };
  return `<figure class="schema schema-posture">
<svg viewBox="0 0 560 290" role="img" aria-label="${e(centre)}">
<circle cx="205" cy="140" r="122" class="cercle-gauche"/><circle cx="355" cy="140" r="122" class="cercle-droit"/>
${placerTexte(g, 160, c.lang === "ru" ? 112 : 108, "venn-titre", 19)}${placerTexte(gs, 160, 144, "venn-sous", c.lang === "ru" ? 16 : 22)}
${placerTexte(d, 400, c.lang === "ru" ? 112 : 108, "venn-titre", 19)}${placerTexte(ds, 400, 144, "venn-sous", c.lang === "ru" ? 16 : 22)}
<rect x="192" y="188" width="176" height="44" rx="22" class="venn-pastille"/><text x="280" y="215" text-anchor="middle" class="venn-centre">${e(centre)}</text>
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

const ICONES_MENU = {
  "recherche": "<path d=\"m9 3 5 5-3 3-5-5zM12 10l-2 2M6 8l-2 2 4 4 2-2M5 21h14M10 17a6 6 0 0 0 6-10M12 17v4M4 17h7\"/>",
  "entrepreneuriat": "<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"m9 7-3 3 3 3m6-6 3 3-3 3M8 21h8M12 17v4\"/>",
  "implantation": "<path d=\"M9 16h6m-6 3h6m-5 3h4M8 13a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3M12 1v1M3 5l1 1m16-1-1 1M1 11h2m18 0h2\"/>",
  "biographie": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12a24 24 0 0 0 18 0M10 12v3h4v-3\"/>",
  "representation": "<path d=\"M12 12 7 7a3 3 0 0 1 5-4 3 3 0 0 1 5 4zM2 14h4l4 3h5a2 2 0 0 1 0 4H8l-6-3m13-1 4-3a2 2 0 0 1 3 2l-5 5\"/>",
  "logiciels": "<path d=\"M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1M5 8h3m-3 4h3m8-4h3m-3 4h3\"/>"
};
function iconeMenu(g){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(ICONES_MENU[g]||'')+'</svg>';}

const ICONES_GROUPES = {
  engagements: ["bulles", "chapeau", "loupe", "etoile", "coeur", "course"],
  publications: ["bulles", "papiers", "chapeau", "outils", "papiers", "papiers"],
};
const ICONES_TYPES = { formation: "chapeau", experience: "mallette", entreprise: "fusee" };

// Accueil : parcours illustré et chiffres clés.
const BANDE = {
  fr: {
    titre: "Le parcours en un coup d’œil",
    etapes: [["2016–2024","Directeur de séjours pour adultes en situation de handicap (France)","coeur"],["2020–2023","Éducateur spécialisé, Adapei 35 (France)","personne"],["2024","Stage en direction d’EHPAD, Fondation Ildys, Landerneau (France)","mallette"],["2024","Diplôme universitaire en entrepreneuriat et management, IAE de Brest (France)","mallette"],["2024","Maîtrise en direction des structures médico-sociales, Université de Bretagne Occidentale (UBO, France)","mallette"],["2024–2025","Chargé de mission médico-sociale, Agence nationale d’appui à la performance (ANAP, France)","reseau"],["2025","Master en droit public (droit de la santé et droit social), Paris-Panthéon-Assas (France)","balance"],["Depuis 2025","Doctorat en santé publique, École de santé publique de l’Université de Montréal (ESPUM) et Centre de recherche du CHUM (CRCHUM), Canada","loupe"]],
    chiffres: [["10","années auprès de personnes en situation de handicap"],["4","charges d’auxiliaire d’enseignement à l’Université de Montréal"],["3","mentions spéciales du jury"],["1","prix de la meilleure affiche, 3e cycle (GFSP, 2026)"]],

  },
  en: {
    titre: "The path at a glance",
    etapes: [["2016–2024","Director of stays for adults with disabilities (France)","coeur"],["2020–2023","Special needs educator, Adapei 35 (France)","personne"],["2024","EHPAD management internship, Fondation Ildys, Landerneau (France)","mallette"],["2024","University diploma in entrepreneurship and management, IAE de Brest (France)","mallette"],["2024","Master’s-level degree in social care management, Université de Bretagne Occidentale (UBO, France)","mallette"],["2024–2025","Health and social care project officer, Agence nationale d’appui à la performance (ANAP, France)","reseau"],["2025","Master’s in public law (health and social law), Paris-Panthéon-Assas (France)","balance"],["Since 2025","PhD in public health, École de santé publique de l’Université de Montréal (ESPUM) and Centre de recherche du CHUM (CRCHUM), Canada","loupe"]],
    chiffres: [["10","years supporting people with disabilities"],["4","teaching assistantships at Université de Montréal"],["3","special distinctions from the jury"],["1","best poster award, doctoral level (GFSP, 2026)"]],

  },
  es: {
    titre: "La trayectoria de un vistazo",
    etapes: [["2016–2024","Director de estancias para adultos con discapacidad (Francia)","coeur"],["2020–2023","Educador especializado, Adapei 35 (Francia)","personne"],["2024","Prácticas de dirección en EHPAD, Fondation Ildys, Landerneau (Francia)","mallette"],["2024","Diploma universitario en emprendimiento y gestión, IAE de Brest (Francia)","mallette"],["2024","Maestría en dirección de estructuras médico-sociales, Université de Bretagne Occidentale (UBO, Francia)","mallette"],["2024–2025","Encargado de misión médico-social, Agence nationale d’appui à la performance (ANAP, Francia)","reseau"],["2025","Máster en derecho público (derecho de la salud y derecho social), Paris-Panthéon-Assas (Francia)","balance"],["Desde 2025","Doctorado en salud pública, École de santé publique de l’Université de Montréal (ESPUM) y Centre de recherche du CHUM (CRCHUM), Canadá","loupe"]],
    chiffres: [["10","años junto a personas en situación de discapacidad"],["4","ayudantías de docencia en la Université de Montréal"],["3","menciones especiales del jurado"],["1","premio al mejor póster, doctorado (GFSP, 2026)"]],

  },
  zh: {
    titre: "经历一览",
    etapes: [["2016–2024","法国：面向残障成年人的度假活动负责人","coeur"],["2020–2023","法国：特殊教育工作者，Adapei 35","personne"],["2024","法国朗代诺 Fondation Ildys：EHPAD 管理实习","mallette"],["2024","法国布雷斯特 IAE：创业与管理大学文凭","mallette"],["2024","法国西布列塔尼大学（UBO）：医疗社会服务机构管理硕士级文凭","mallette"],["2024–2025","法国国家绩效支持署（ANAP）：医疗社会服务项目专员","reseau"],["2025","法国巴黎-先贤祠-阿萨斯大学：卫生法与社会法方向公法硕士","balance"],["2025 年起","加拿大蒙特利尔大学公共卫生学院（ESPUM）及蒙特利尔大学医院研究中心（CRCHUM）：公共卫生博士","loupe"]],
    chiffres: [["10","年陪伴残障人士"],["4","次在蒙特利尔大学担任助教"],["3","次获评审团特别嘉许"],["1","项最佳海报奖，博士阶段（GFSP，2026）"]],

  },
  ar: {
    titre: "المسار في لمحة",
    etapes: [["2016–2024","فرنسا: مدير إقامات للبالغين ذوي الإعاقة","coeur"],["2020–2023","فرنسا: مربٍّ متخصص، Adapei 35","personne"],["2024","مؤسسة Fondation Ildys، لانديرنو (فرنسا): تدريب إداري في EHPAD","mallette"],["2024","دبلوم جامعي في ريادة الأعمال والإدارة، IAE de Brest (فرنسا)","mallette"],["2024","ماجستير مهني في إدارة المؤسسات الطبية الاجتماعية، جامعة بريتاني الغربية (UBO، فرنسا)","mallette"],["2024–2025","مكلّف بمهمة طبية اجتماعية في الوكالة الوطنية لدعم الأداء (ANAP، فرنسا)","reseau"],["2025","ماجستير في القانون العام، قانون الصحة والقانون الاجتماعي، باريس-بانتيون-أساس (فرنسا)","balance"],["منذ 2025","دكتوراه في الصحة العامة، كلية الصحة العامة بجامعة مونتريال (ESPUM) ومركز أبحاث مستشفى جامعة مونتريال (CRCHUM)، كندا","loupe"]],
    chiffres: [["10","سنوات إلى جانب الأشخاص ذوي الإعاقة"],["4","مهام مساعد تدريس في جامعة مونتريال"],["3","تنويهات خاصة من لجنة التحكيم"],["1","جائزة أفضل ملصق، مرحلة الدكتوراه (GFSP، 2026)"]],

  },
};

function bandeAccueil(c) {
  const B = BANDE[c.lang];
  const I = CHIFFRES_IMPACT[c.lang];
  const etapes = [];
  for (const [quand, quoi] of [...B.etapes].reverse()) {
    const derniere = etapes.at(-1);
    if (derniere && derniere.quand === quand) derniere.textes.push(quoi);
    else etapes.push({ quand, textes: [quoi] });
  }
  const frise = '<section class="bande-accueil bande-parcours" aria-labelledby="parcours-apercu-titre"><h2 class="bande-titre" id="parcours-apercu-titre">' + e(B.titre) + '</h2><ol class="trajectoire">' + etapes.map(({quand, textes}, i) => '<li style="--rang:' + i + '"><span class="trajectoire-date">' + e(quand) + '</span>' + textes.map(quoi => '<span class="trajectoire-texte">' + e(quoi) + '</span>').join('') + '</li>').join('') + '</ol></section>';
  const chiffres = '<section class="bande-accueil bande-restauree" aria-labelledby="parcours-chiffres-titre"><h2 class="bande-titre" id="parcours-chiffres-titre">' + e(I.titre) + '</h2><div class="impact-ensembles">' + I.groupes.map((titre, i) => '<section class="impact-ensemble"><h3>' + e(titre) + '</h3><dl>' + I.chiffres.slice(i * 4, i * 4 + 4).map(([valeur, libelle, precision]) => '<div><dt>' + e(libelle) + (precision ? '<small class="impact-public">' + e(precision) + '</small>' : '') + '</dt><dd><bdi dir="ltr">' + e(valeur) + '</bdi></dd></div>').join('') + '</dl></section>').join('') + '</div><details class="impact-precisions"><summary>' + e(I.details) + '</summary><ul>' + I.notes.map(t => '<li>' + e(t) + '</li>').join('') + '</ul></details></section>';
  return frise + chiffres;
}

function encadrementAvecLiens(c) {
  const morceaux = c.accueil.encadrement.split(" · ");
  const sourial = "https://www.chumontreal.qc.ca/crchum/chercheurs/nadia-sourial";
  const layani = "https://www.chumontreal.qc.ca/crchum/chercheurs/geraldine-layani";
  const chaire = "https://www.linkedin.com/company/chaire-glaxosmithkline-gsk-de-recherche-en-gestion-optimale-des-maladies-chroniques/";
  const bourse = "https://doi.org/10.69777/2009461";
  return morceaux.map((texte, i) => {
    if (i === 0) return e(texte)
      .replace("Nadia Sourial", lien(sourial, "Nadia Sourial", "encadrement-lien"))
      .replace("Géraldine Layani", lien(layani, "Géraldine Layani", "encadrement-lien"));
    if (i === 1) return lien(chaire, e(texte), "encadrement-lien");
    if (i === 2) return lien("https://www.chumontreal.qc.ca/crchum", e(texte), "encadrement-lien");
    if (i === 3) return lien(bourse, e(texte), "encadrement-lien");
    return e(texte);
  }).join(' <span class="encadrement-separateur" aria-hidden="true">·</span> ');
}

function travauxEnCours(c) {
  const r = c.recherche;
  const themes = (THEMES_PUBLICATIONS[c.lang] || THEMES_PUBLICATIONS.fr).articles;
  return `<div class="travaux">
<div class="travaux-tete"><h3>${e(r.travaux.titre)}</h3><p>${e(r.travaux.intro)}</p></div>
<div class="travaux-grille">${r.travaux.items
    .map(
      (t, i) => `<article class="travail${t.resume ? " vedette" : ""}" data-axe-cible="${["travail-hospitalisations", "travail-epistemique", "travail-pl2", "travail-droit"][i]}">
<p class="domaine">${e(t.domaine)}</p>
<span class="statut-pastille">${e(t.statut)}</span>
<h4>${e(t.titre)}</h4>
<p class="auteurs">${e(t.auteurs)}</p>
${t.resume ? `<p class="resume">${e(t.resume)}</p>` : ""}
${etiquettes(t.etiquettes?.length ? t.etiquettes : (themes[i] || [t.domaine]))}
</article>`
    )
    .join("")}</div>
</div>`;
}

const LIENS_FAITS_RECHERCHE = [
  "https://espum.umontreal.ca/etudes/programmes/doctorats-et-programmes-de-3e-cycle/doctorats/doctorat-en-sante-publique/",
  "https://espum.umontreal.ca/",
  "https://www.linkedin.com/company/chaire-glaxosmithkline-gsk-de-recherche-en-gestion-optimale-des-maladies-chroniques/",
  "https://www.chumontreal.qc.ca/crchum",
  "https://frq.gouv.qc.ca/",
];
const LIBELLES_FAITS_RECHERCHE = {
  fr: ["Présentation du doctorat", "Site de l’ESPUM", "Chaire sur LinkedIn", "Site du CRCHUM", "Site du FRQ"],
  en: ["PhD programme", "ESPUM website", "Chair on LinkedIn", "CRCHUM website", "FRQ website"],
  es: ["Presentación del doctorado", "Sitio de la ESPUM", "Cátedra en LinkedIn", "Sitio del CRCHUM", "Sitio del FRQ"],
  zh: ["博士项目介绍", "ESPUM 官网", "研究讲席 LinkedIn", "CRCHUM 官网", "FRQ 官网"],
  ar: ["التعريف ببرنامج الدكتوراه", "موقع ESPUM", "الكرسي البحثي على LinkedIn", "موقع CRCHUM", "موقع FRQ"],
  ru: ["О программе PhD", "Сайт ESPUM", "Кафедра GSK в LinkedIn", "Сайт CRCHUM", "Сайт FRQ"],
};

// Une navigation propre à chaque table évite que les onglets imbriqués se masquent entre eux.
function baliseAudience(prefixe) {
  return AUDIENCE.websiteId ? `<script src="${prefixe}assets/audience.js?v=${VERSION_AUDIENCE}" data-audience-website-id="${e(AUDIENCE.websiteId)}" data-audience-domaines="${e(AUDIENCE.domaines.join(' '))}" defer></script>` : '';
}

function confidentialiteAudience(code) {
  const t=AUDIENCE_LIBELLES[code] || AUDIENCE_LIBELLES.fr;
  return `<details class="audience-info"><summary>${e(t.titre)}</summary><div><p>${e(AUDIENCE.websiteId ? t.actif : t.inactif)}</p><p>${e(t.local)}</p>${AUDIENCE.websiteId ? `<p><a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer">${e(t.service)} ↗</a></p><button type="button" data-audience-refuser aria-pressed="false">${e(t.refuser)}</button><p class="audience-etat" data-audience-etat data-autorisee="${e(t.autorisee)}" data-refusee="${e(t.refusee)}" data-navigateur="${e(t.navigateur)}"></p>` : ''}</div></details>`;
}

function chapitresSource(c, cle, explorer, rubriques) {
  return `<div class="chapitres-source" data-rubriques="${cle}">
${rubriques.map(([id, titre, contenu], i) => `<div class="chapitre-source" id="chapitre-${c.lang}-${cle}-${i}" data-volet="${i}" data-rubrique="${id}" data-chapitre-titre="${e(titre)}"><div class="chapitre-contenu">${contenu}</div></div>`).join("")}</div>`;
}

function referencesIA(cles = []) {
  return cles.length ? `<p class="ref references-courtes">${cles.map((k) => lien(IA.references[k].href, e(IA.references[k].court))).join(" · ")}</p>` : "";
}

function cartesRubrique(items) {
  return `<div class="ia-reperes">${items.map(([titre, texte, refs]) => `<article><h4>${e(titre)}</h4><p>${e(texte)}</p>${referencesIA(refs)}</article>`).join("")}</div>`;
}

function sectionRecherche(c) {
  const f = CADRAGE_THESE.langues[c.lang];
  const n = LIBELLES_THESE.langues[c.lang];
  const r = { ...c.recherche, titre: f.titre, question: f.question, but: f.general };
  const p = METHODOLOGIE[c.lang];
  const t = THESE.langues[c.lang];
  const langueAffiche = c.lang === "ru" ? "fr" : c.lang;
  const valeur = (v) => (Array.isArray(v) ? v.map((x) => `<span class="ligne">${e(x)}</span>`).join("") : e(v));
  const contexte = `<h3>${e(t.titres[1])}</h3><div class="these-contextes">${f.contextes.map(([nom, texte, ref]) => `<article><h4>${e(nom)}</h4><p>${e(texte)}</p><p class="ref">${lien(CADRAGE_THESE.references[ref][1], e(CADRAGE_THESE.references[ref][0]))}</p></article>`).join("")}</div><h4 class="titre-bloc">${e(f.labels.justification)}</h4><p>${e(f.justification)}</p><h4 class="titre-bloc">${e(f.labels.lacunes)}</h4><div class="these-lacunes">${f.lacunes.map((texte, i) => `<article class="objectif-carte" data-objectif="O${i + 1}"><h5><span class="objectif-code">O${i + 1}</span> ${e(f.labels.lacune)} ${i + 1}</h5><p>${lierCitations(e(texte))}</p></article>`).join("")}</div>`;
  const institution = `<h3>${e(f.labels.cadre)}</h3>
<ul class="faits faits-these">${r.faits.map(([k, v], i) => `<li><b>${e(k)}</b><span class="fait-description">${valeur(v)}</span><span class="fait-liens">${lien(LIENS_FAITS_RECHERCHE[i], e(LIBELLES_FAITS_RECHERCHE[c.lang][i]))}${i === r.faits.findIndex(([, x]) => /B2/.test(x)) ? `<a href="https://doi.org/10.69777/2009461">DOI 10.69777/2009461</a>` : ""}</span></li>`).join("")}</ul>
<figure class="logos-recherche"><img src="${c.chemin}assets/logos-recherche.png?v=${empreinte("assets/logos-recherche.png")}" alt="Chaire de recherche GSK en gestion optimale des maladies chroniques · Fonds de recherche du Québec · CRCHUM · ESPUM · Université de Montréal" loading="lazy"></figure>
${lien(
  r.affiche[2],
  `<img class="affiche-vignette" src="${AFFICHE}img/affiche-${langueAffiche}.png" data-std="${AFFICHE}img/affiche-${langueAffiche}.png" data-cb="${AFFICHE}img/affiche-${langueAffiche}-daltonien.png" alt="${e(c.ui.afficheAlt)}" width="2400" height="2400" loading="lazy" decoding="async"><span><strong>${e(r.affiche[0])}</strong><small>${e(r.affiche[1])}</small></span><span aria-hidden="true">↗</span>`,
  "carte-lien carte-affiche"
)}
<h4 class="titre-bloc">${e(r.codirection.titre)}</h4>
<div class="codirection">${r.codirection.personnes.map((pe) => `<article class="personne"><h4>${e(pe.nom)}<span class="grade">${e(pe.grade)}</span></h4><ul>${pe.lignes.map((l) => `<li>${e(l)}</li>`).join("")}</ul><p class="chaire">${e(pe.chaire)}</p>${lien(pe.lien, `${e(r.codirection.profil)} <span aria-hidden="true">↗</span>`, "profil")}</article>`).join("")}</div>`;
  const methodes = `<p class="these-fil"><span data-objectif="O1">O1</span><span aria-hidden="true">→</span><span data-objectif="O2">O2</span><span aria-hidden="true">→</span><span data-objectif="O3">O3</span><strong>${e(f.labels.articulation)}</strong></p><div class="these-methodes">${f.methodes.map((texte, i) => `<article class="objectif-carte" data-objectif="O${i + 1}"><h4><span class="objectif-code">O${i + 1}</span> ${e(n.etapes[i])}</h4><p class="these-formulation">${e(texte)}</p><button class="these-renvoi" type="button" data-these-vers="problematique" data-these-objectif="O${i + 1}">${e(n.objectif)} <span aria-hidden="true">↗</span></button></article>`).join("")}</div>
<details class="protocole-these these-protocole-detail"><summary>${e(p.titre)}</summary>
<p class="note-protocole">${e(p.etat)}</p>
<h4>${e(p.devis.titre)}</h4>
<ul class="puces">${p.devis.items.map(([t, d]) => `<li><b>${e(t)}</b>${deuxPoints(c)} ${e(d)}</li>`).join("")}</ul>
<div class="etapes-protocole">${p.etapes.map((s) => `<details class="methode-these" data-objectif="${e(s.code)}"><summary><span class="code-methode objectif-code">${e(s.code)}</span><span><strong>${e(s.titre)}</strong><small>${e(s.cible)}</small></span></summary><div class="methode-these-corps"><dl>${s.blocs.map(([t, d]) => `<dt>${e(t)}</dt><dd>${e(d)}</dd>`).join("")}</dl><p class="repere-protocole">${e(s.reperes)}</p>${s.code === "O3" ? SNA_EXEMPLES(c.lang) : ""}</div></details>`).join("")}</div>
<h4>${e(p.integration.titre)}</h4><p>${e(p.integration.texte)}</p>
</details>
<div class="comparaison">${figureClsc(c)}
${schemaReseau(c)}</div>
<h4 class="titre-bloc">${e(r.notions.titre)}</h4>
<div class="notions">${r.notions.items.map(([t, d, ref]) => `<div><h4>${e(t)}</h4><p>${e(d)}</p>${ref ? `<p class="ref">(${e(ref)})</p>` : ""}</div>`).join("")}</div>${attributionExemples(c.lang)}`;
  const contenus = [
    `<h3>${e(t.titres[0])}</h3><p class="these-concept-label">${e(f.labels.point)}</p><p class="these-point these-formulation">${e(f.point)}</p><div class="these-concept-sequence">${n.etapes.map((nom,i)=>`<button type="button" data-these-vers="problematique" data-these-objectif="O${i+1}" data-objectif="O${i+1}"><span class="objectif-code">O${i+1}</span><strong>${e(nom)}</strong><span aria-hidden="true">${i<2?'→':'↗'}</span></button>`).join('')}</div><details class="these-fondements"><summary>${icone('papiers')}<span>${e(n.fondements)}</span></summary><p>${e(n.fondementsIntro)}</p>${sectionConceptualisation(c, true)}</details>`,
    contexte,
    `<h3>${e(f.labels.general)}</h3><p class="these-objectif-general these-formulation">${e(f.general)}</p><h4 class="titre-bloc">${e(f.labels.specifiques)}</h4>${c.lang === "fr" ? OBJECTIFS_VISUELS.render() : `<div class="these-objectifs">${f.objectifs.map((texte, i) => `<article class="objectif-carte" data-objectif="O${i + 1}"><h4><span class="objectif-code">O${i + 1}</span> ${e(n.etapes[i])}</h4><p class="these-formulation">${e(texte)}</p><details class="objectif-lacune"><summary>${e(n.lacune)}</summary><p>${lierCitations(e(f.lacunes[i]))}</p></details><button class="these-renvoi" type="button" data-these-vers="methodes" data-these-objectif="O${i + 1}">${e(n.methode)} <span aria-hidden="true">↗</span></button></article>`).join("")}</div>`}`,
    `<h3>${e(t.titres[3])}</h3><h4 class="titre-bloc">${e(f.labels.question)}</h4><p class="question-these">${e(f.question)}</p><h4 class="titre-bloc">${e(f.labels.point)}</h4><p class="these-point">${e(f.point)}</p>`,
    methodes,
    `<h3>${e(t.titres[5])}</h3><p>${e(t.resultats)}</p><h4 class="titre-bloc">${e(r.retombees.titre)}</h4><ul class="puces">${r.retombees.items.map(([nom, d]) => `<li><b>${e(nom)}</b>${deuxPoints(c)} ${e(d)}</li>`).join("")}</ul>`,
    `<h3>${e(t.titres[6])}</h3><p>${e(p.limites.intro)}</p><ul class="puces limites-these">${p.limites.items.map(([nom, d]) => `<li><b>${e(nom)}</b>${deuxPoints(c)} ${e(d)}</li>`).join("")}</ul>`,
    `<h3>${e(t.titres[7])}</h3>${cartesRubrique(t.faisabilite)}`,
    `<h3>${e(t.titres[8])}</h3><p>${e(t.ethiqueIntro)}</p>${cartesRubrique(t.ethique)}<p class="ref">${lien(THESE.ethiqueLien, e(t.sourceEthique))}</p>`,
    `<h3>${e(t.titres[9])}</h3>${cartesRubrique(t.transfert)}`,
    institution,
  ];
  return `<div class="section-corps pleine these"><div class="colonne-texte these-introduction"><div class="these-statut"><p class="badge-these">${e(r.etiquette)}</p><p class="these-evolution"><strong>${e(r.avertissement)}</strong></p></div><p class="these-titre-label">${e(f.labels.titre)}</p><h2>${e(f.titre)}</h2><div class="these-question-principale"><span>${e(f.labels.question)}</span><p class="these-formulation">${e(f.question)}</p></div><nav class="these-parcours" aria-label="${e(n.fil)}">${n.etapes.map((nom,i)=>`<button type="button" data-these-vers="problematique" data-these-objectif="O${i+1}" data-objectif="O${i+1}"><bdi dir="ltr">O${i+1}</bdi><span>${e(nom)}</span><span aria-hidden="true">↗</span></button>`).join("")}</nav></div><div class="colonne-outils">${chapitresSource(c, "these", t.explorer, NAVIGATION_CHAPITRES.regrouperThese(contenus, c.lang))}</div></div>`;
}

function sectionIA(c) {
  const s = IA.langues[c.lang];
  const biblio = (cles) => `<ul class="methode-refs lectures-ia">${cles.map((k) => `<li>${lien(IA.references[k].href, e(IA.references[k].citation))}</li>`).join("")}</ul>`;
  const rubriques = s.rubriques.map((r, i) => ["ia-" + i, r.nom, `<h3>${e(r.titre)}</h3><p>${e(r.intro)}</p>${referencesIA(r.refs)}${cartesRubrique(r.items)}<p class="note note-ia">${e(r.note)}</p>${referencesIA(r.noteRefs)}`]);
  rubriques.splice(2,0,["ia-atelier",ATELIERS.textes(c.lang,"ia").labels.atelier,atelierPratique(c,"ia")]);
  rubriques.push(["ia-lectures", s.sources, `<h3>${e(s.lectures.titre)}</h3><p>${e(s.lectures.intro)}</p>${biblio(Object.keys(IA.references))}`]);
  return `<div class="section-corps pleine section-ia"><div class="colonne-texte"><p class="surtitre">${e(s.date)}</p><h2>${e(s.titre)}</h2><p class="intro">${e(s.intro)}</p></div><div class="colonne-outils">${chapitresSource(c, "ia", s.explorer, rubriques, 4)}</div></div>`;
}

function schemaDiscours([social, discursive, texte], titre) {
  return `<svg class="schema-discours" viewBox="0 0 520 300" role="img" aria-label="${e(titre)}"><rect x="6" y="6" width="508" height="288" rx="18" class="niveau-1"/><rect x="46" y="62" width="428" height="202" rx="14" class="niveau-2"/><rect x="128" y="134" width="264" height="90" rx="12" class="niveau-3"/><text x="260" y="38" text-anchor="middle">${e(social)}</text><text x="260" y="98" text-anchor="middle">${e(discursive)}</text><text x="260" y="186" text-anchor="middle" class="centre">${e(texte)}</text></svg>`;
}

function sectionApproche(c) {
  const a = c.approche;
  const s = POSTURE.langues[c.lang];
  const refs = (cles) => `<p class="ref posture-refs">${cles.map(cle => lien(POSTURE.references[cle].href, e(POSTURE.references[cle].court))).join(" · ")}</p>`;
  const cartes = (items) => items.length ? `<div class="posture-perspectives">${items.map(([titre, lecture, apport, sources]) => `<article><h4>${e(titre)}</h4><p class="posture-lecture">${e(lecture)}</p><div class="posture-apport"><h5>${e(s.apport)}</h5><p>${e(apport)}</p></div>${refs(sources)}</article>`).join("")}</div>` : "";
  const epistemologie = `${schemaPosture(c)}<div class="piliers piliers-posture">${a.piliers.filter((_, i) => i !== 1).map(([titre, texte]) => `<div><h4>${e(titre)}</h4><p>${e(texte)}</p></div>`).join("")}</div>`;
  const rubriques = s.rubriques.map((r, i) => [`posture-${i}`, r.nom, `<div class="posture-essai"><h3>${e(r.titre)}</h3>${r.paragraphes.map(p => `<p>${e(p)}</p>`).join("")}</div>${i === 1 ? epistemologie : ""}${cartes(r.items)}`]);
  rubriques.push(["posture-references", s.sources, `<h3>${e(s.sources)}</h3><p>${e(s.sourcesIntro)}</p><ul class="methode-refs posture-bibliographie">${Object.values(POSTURE.references).sort((x, y) => x.citation.localeCompare(y.citation, "fr")).map(r => `<li>${lien(r.href, e(r.citation))}</li>`).join("")}</ul>`]);
  return `<div class="section-corps pleine large posture-philosophique">
<div class="colonne-texte">
<p class="surtitre">${e(a.surtitre)}</p>
<h2>${e(a.titre)}</h2>
<p class="intro">${e(s.titre)}</p>
<p>${e(s.intro)}</p>
</div>
<div class="colonne-outils">${chapitresSource(c, "posture", s.explorer, rubriques, 3)}</div>
</div>`;
}

function sectionAxes(c) {
  const a = c.approche.axes;
  const t = MEDIATION.LANGUES[c.lang].axes;
  const v = AXES.langues[c.lang];
  const titres = [...a.principaux, ...a.secondaires];
  const statut = x => typeof x === 'number' ? c.recherche.travaux.items[x].statut : v[x];
  const carte = i => '<article class="axe-carte" style="--axe:' + AXES.couleurs[i] + '"><div class="axe-carte-tete"><span class="axe-numero">' + e(v.axe) + ' ' + num(i) + '</span><svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + AXES.icones[i] + '</svg></div><h4><a href="#' + AXES.principales[i] + '" data-axe-lien><span>' + e(titres[i]) + '</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></a></h4><p class="axe-description">' + e(v.items[i][0]) + '</p><div class="axe-associations"><p class="axe-libelle">' + e(v.appuis) + '</p><ul>' + v.items[i][1].map((texte, j) => '<li><a href="#' + AXES.destinations[i][j] + '" data-axe-lien><span><strong>' + e(texte) + '</strong><small>' + e(statut(AXES.statuts[i][j])) + '</small></span><span class="axe-lien-fleche" aria-hidden="true">→</span></a></li>').join('') + '</ul></div></article>';
  const groupe = (titre, indices) => '<section class="axes-famille"><header><h3>' + e(titre) + '</h3><span aria-hidden="true">' + indices.length + '</span></header><div class="axes-cartes">' + indices.map(carte).join('') + '</div></section>';
  return '<div class="section-corps pleine axes-recherche"><div class="axes-introduction"><p class="surtitre">' + e(t.salle[0]) + '</p><h2>' + e(t.salle[0]) + '</h2><p class="intro">' + e(v.intro) + '</p></div>' + groupe(t.principaux, [0,1,2]) + groupe(a.secondairesTitre, [3,4,5]) + '</div>';
}
function sectionMethodes(c) {
  const a = c.approche;
  const complement = METHODES_AJOUTS[c.lang];
  const methodes = [...a.methodes.items, ...complement.items];
  return `<div class="section-corps pleine large">
<div class="colonne-texte">
<p class="surtitre">${e(c.hall.portes.methodes[0])}</p>
<h2>${e(a.methodes.titre)}</h2>
<p class="intro">${e(a.methodes.intro)}</p>
<p class="methodes-intro">${e(complement.intro)}</p>
<h3 class="titre-bloc">${e(a.piliers[1][0])}</h3><p>${e(a.piliers[1][1])}</p>
<div class="boite-outils">
<h3>${e(a.outils.titre)}</h3>
${a.outils.groupes.map(([g, items]) => `<div class="groupe-outils"><p>${e(g)}</p>${etiquettes(items, "etiquettes outils-liste")}</div>`).join("")}
</div>
</div>
<div class="colonne-outils">
<div class="methodes">${methodes.map((m) => `<article class="methode${m.etapes ? " methode-etendue" : ""}"><div class="methode-texte"><h4>${e(m.titre)}</h4><p>${e(m.texte)}</p>${m.reperes ? `<dl class="methode-reperes">${m.reperes.map(([titre, texte]) => `<dt>${e(titre)}</dt><dd>${e(texte)}</dd>`).join("")}</dl>` : ""}<ul class="methode-refs">${m.references.map((x) => `<li>${lienFinal(x)}</li>`).join("")}</ul></div><div class="methode-figures${m.etapes ? " methode-parcours" : ""}">${m.etapes ? `<figure><ol class="methode-etapes">${m.etapes.map((texte, i) => `<li><span aria-hidden="true">${num(i)}</span><strong>${e(texte)}</strong></li>`).join("")}</ol><figcaption>${e(m.legende)}</figcaption></figure>` : m.illustrations.map((il) => `<figure>${il.schema ? schemaDiscours(il.schema, il.legende) : `<a href="${e(il.page)}" target="_blank" rel="noopener"><img src="${e(il.src)}" alt="${e(il.legende)}" loading="lazy" referrerpolicy="no-referrer"></a>`}<figcaption>${e(il.legende)} <span class="source">${e(il.credit)}</span></figcaption></figure>`).join("")}</div></article>`).join("")}</div>
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

function sectionImplantationHistorique(c) {
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
  return `<div class="section-corps pleine">
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
${c.lang === 'fr' ? require('./cadres-pedagogiques').render() : cartes(m.plan)}
${cartes(m.cadres)}
<details class="biblio"><summary>${e(m.bibliographie.titre)}</summary><ol>${m.bibliographie.items.map((r) => `<li>${lienDoi(r)}</li>`).join("")}</ol></details>
</div>
</div>
`;
}

function sectionImplantation(c) {
 const m=c.implantation,A=ATELIERS.textes(c.lang,"implantation");
 return `<div class="section-corps pleine implantation-approfondie"><div class="colonne-texte"><p class="surtitre">${e(m.surtitre)}</p><h2>${e(m.titre)}</h2><p class="intro">${e(m.intro)}</p></div><div class="colonne-outils">${chapitresSource(c,"implantation",A.labels.choisir,[["implantation-reperes",m.transfert.titre,sectionImplantationHistorique(c)]],1)}</div></div>`;
}

function sectionBiographie(c) {
  const b = c.biographie;
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(b.surtitre)}</p>
<h2>${e(b.titre)}</h2>
<div class="bio-intro">${b.intro.map((p) => `<p>${riche(p)}</p>`).join("")}</div>
<figure class="bio-figure"><blockquote class="citation">${e(b.citation)}</blockquote></figure>
</div>
<div class="colonne-outils">
<ol class="recit">${b.chapitres.map(([titre, paragraphes], k) => `<li><span class="recit-num">${num(k)}</span><div><h3>${e(titre)}</h3>${paragraphes.map((p) => `<p>${riche(p)}</p>`).join("")}</div></li>`).join("")}</ol>
<div class="vision"><h3>${e(b.vision.titre)}</h3>${b.vision.paragraphes.map((p) => `<p>${riche(p)}</p>`).join("")}</div>
<p class="recit-fin">${e(b.conclusion)}</p>
</div>
</div>`;
}

const PHOTOS_ENGAGEMENTS = ["representation", null, "distinctions", null, null];
const MARATHON_ILLUSTRATION = {
  "fr": [
    "Illustration de coureurs fictifs à Paris, avec l’Arc de Triomphe en arrière-plan",
    "Illustration · Paris"
  ],
  "en": [
    "Illustration of fictional runners in Paris, with the Arc de Triomphe in the background",
    "Illustration · Paris"
  ],
  "es": [
    "Ilustración de corredores ficticios en París, con el Arco del Triunfo al fondo",
    "Ilustración · París"
  ],
  "zh": [
    "插图：虚构跑者在巴黎跑步，背景为凯旋门",
    "插图 · 巴黎"
  ],
  "ar": [
    "رسم لعدائين خياليين في باريس وقوس النصر في الخلفية",
    "صورة توضيحية · باريس"
  ],
  "ru": [
    "Иллюстрация вымышленных бегунов в Париже с Триумфальной аркой на заднем плане",
    "Иллюстрация · Париж"
  ]
};
const PHOTOS_LOISIRS = ["photos/course.jpg", "photos/musique.jpg", "photos/hockey.jpg", "bandeaux/grise.jpg", "bandeaux/loisirs.jpg"];
const photo = (c, fichier, alt = "") => `<img class="photo-groupe" src="${c.chemin}assets/${fichier}?v=${empreinte("assets/" + fichier)}"${fichier === "bandeaux/loisirs.jpg" ? ' style="object-position:right"' : ""} alt="${e(alt)}" width="800" height="457" loading="lazy">`;

function sectionEngagements(c, sous) {
  const s = c.engagements;
  const kSous = INDEX_ENGAGEMENTS[sous];
  const groupes = s.groupes
    .map((g, k) => {
      if (k !== kSous) return "";
      // Une rubrique personnelle n’est publiée qu’avec sa véritable image.
      const ajouts = k === s.groupes.length - 1 ? LOISIRS_AJOUTS.textes[c.lang]
        .map((it) => ({ ...it, photo: LOISIRS_AJOUTS.photos[it.id] }))
        .filter((it) => fs.existsSync(path.join(RACINE, "assets", it.photo))) : [];
      const items = [...g.items, ...ajouts];
      const tete = `<h3 class="titre-bloc titre-icone">${e(g.titre)}<span class="compte">${items.length}</span></h3>`;
      if (k === s.groupes.length - 1)
        return `<div class="groupe-large">${tete}<div class="loisirs loisirs-etendus">${items
          .map((it, i) => {
            const fichier = it.photo || PHOTOS_LOISIRS[i];
            return `<figure class="loisir${it.id ? " loisir-" + it.id : ""}${fichier ? "" : " sans-photo"}">${fichier ? photo(c, fichier, i === 0 ? MARATHON_ILLUSTRATION[c.lang][0] : it.alt || it.titre) : ""}<figcaption><span>${e(it.date)}</span><strong>${e(it.titre)}</strong>${it.detail ? `<small>${e(it.detail)}</small>` : ""}${i === 0 ? `<small class="credit-image">${e(MARATHON_ILLUSTRATION[c.lang][1])}</small>` : ""}${it.credit ? `<small class="credit-image">${e(it.credit)}</small>` : ""}</figcaption></figure>`;
          })
          .join("")}</div></div>`;
      return `<div class="groupe-large">${tete}${liste(g.items).replace('<ul class="liste">', '<ul class="liste liste-cartes">')}</div>`;
    })
    .join("");
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(s.surtitre)}</p>
<h2>${e(s.titre)}</h2>
${kSous === 0 ? `<p class="intro">${e(s.intro)}</p>` : ""}
${kSous === 1 ? `<h3 class="titre-bloc">${e(s.affiliations.titre)}</h3>${etiquettes(s.affiliations.items, "etiquettes grandes")}` : ""}
</div>
<div class="colonne-outils"><div class="groupes-grille">${groupes}</div></div>
</div>`;
}

function sectionGroupes(c, s, extra = "", icones = []) {
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(s.surtitre)}</p>
<h2>${e(s.titre)}</h2>
<p class="intro">${e(s.intro)}</p>
${extra}
</div>
<div class="colonne-outils"><div class="groupes-grille">${s.groupes.map((g, gi) => `<article class="groupe-carte"><div class="groupe-corps"><h3 class="titre-bloc titre-icone">${e(g.titre)}<span class="compte">${g.items.length}</span></h3>${liste(s === c.publications && gi === 1 ? g.items.map((it, j) => ({ ...it, cible: ["memoire-domicile", "memoire-ehpad"][j] })) : g.items)}</div></article>`).join("")}</div></div>
</div>`;
}

const PUBLICATION_LABELS = {"fr":["Articles scientifiques","Affiches de congrès","Communications orales","Mémoires et thèse","Aucune communication orale répertoriée pour le moment.","Le projet doctoral est présenté séparément dans « Projet de thèse ».","Voir le projet de thèse","Explorer les publications"],"en":["Research articles","Conference posters","Oral presentations","Dissertations and PhD","No oral presentations are listed at present.","The doctoral project is described separately under “My PhD”.","View my PhD","Explore publications"],"es":["Artículos científicos","Pósteres de congresos","Presentaciones orales","Memorias y tesis","Por el momento no hay presentaciones orales registradas.","El proyecto doctoral está presentado en « Mi tesis ».","Ver mi tesis","Explorar publicaciones"],"zh":["研究文章","会议海报","口头报告","学位论文与博士研究","目前尚未列出口头报告。","正在进行的博士研究项目另见“我的博士论文”栏目。","查看博士研究","浏览研究成果"],"ar":["المقالات العلمية","ملصقات المؤتمرات","العروض الشفوية","المذكرات وأطروحة الدكتوراه","لا توجد عروض شفوية مدرجة حالياً.","يمكن الاطلاع على مشروع الدكتوراه الجاري في قسم «أطروحتي».","عرض المشروع","استكشاف المنشورات"],"ru":["Научные статьи","Конференционные постеры","Устные доклады","Дипломные работы и диссертация","Устные доклады пока не указаны.","Докторский проект представлен отдельно в разделе «Моя диссертация».","Посмотреть проект","Публикации"]};

/* Thèmes scientifiques harmonisés pour toutes les notices de publications.
   Les titres, statuts et auteurs sont conservés dans les données sources ;
   le manuscrit sur le retour épistémique garde ses mots-clés existants. */
const THEMES_PUBLICATIONS = {
  fr: {
    articles: [
      ["Hospitalisations évitables", "Expérience des patients", "Soins primaires"],
      null,
      ["Prise de parole médicale", "Débat public", "Politiques de santé"],
      ["Droit de la santé", "Vieillissement à domicile", "Choix du lieu de vie"]
    ],
    affiches: ["Intégration des soins", "Vieillissement à domicile", "France–Québec"],
    memoires: [
      ["Vieillissement à domicile", "Politiques publiques", "Droit comparé"],
      ["Handicap et vieillissement", "Adaptation des établissements", "Accompagnement"],
      ["Autodétermination", "Pratiques éducatives", "Parcours de vie"]
    ]
  },
  en: {
    articles: [
      ["Avoidable hospitalisations", "Patient experience", "Primary care"],
      null,
      ["Physicians' public voices", "Public debate", "Health policy"],
      ["Health law", "Ageing at home", "Choice of residence"]
    ],
    affiches: ["Integrated care", "Ageing at home", "France–Quebec"],
    memoires: [
      ["Ageing at home", "Public policy", "Comparative law"],
      ["Disability and ageing", "Care facility adaptation", "Support services"],
      ["Self-determination", "Educational practices", "Life course"]
    ]
  },
  es: {
    articles: [
      ["Hospitalizaciones evitables", "Experiencia del paciente", "Atención primaria"],
      null,
      ["Voz pública de los médicos", "Debate público", "Políticas de salud"],
      ["Derecho sanitario", "Envejecer en casa", "Elección del lugar de vida"]
    ],
    affiches: ["Atención integrada", "Envejecimiento en casa", "Francia–Quebec"],
    memoires: [
      ["Envejecer en casa", "Políticas públicas", "Derecho comparado"],
      ["Discapacidad y envejecimiento", "Adaptación institucional", "Acompañamiento"],
      ["Autodeterminación", "Prácticas educativas", "Trayectorias vitales"]
    ]
  },
  zh: {
    articles: [
      ["可避免住院", "患者体验", "初级卫生保健"],
      null,
      ["医生公共发声", "公共辩论", "卫生政策"],
      ["卫生法", "居家养老", "居住地选择"]
    ],
    affiches: ["整合照护", "居家养老", "法国与魁北克"],
    memoires: [
      ["居家养老", "公共政策", "比较法"],
      ["残障与老龄化", "机构服务适应", "支持服务"],
      ["自我决定", "教育实践", "生命历程"]
    ]
  },
  ar: {
    articles: [
      ["الاستشفاء الممكن تجنّبه", "تجربة المرضى", "الرعاية الأولية"],
      null,
      ["صوت الأطباء في المجال العام", "النقاش العام", "السياسات الصحية"],
      ["القانون الصحي", "الشيخوخة في المنزل", "اختيار مكان العيش"]
    ],
    affiches: ["تكامل الرعاية", "الشيخوخة في المنزل", "فرنسا وكيبيك"],
    memoires: [
      ["الشيخوخة في المنزل", "السياسات العامة", "القانون المقارن"],
      ["الإعاقة والتقدم في السن", "تكييف المؤسسات", "الدعم والمرافقة"],
      ["تقرير المصير", "الممارسات التربوية", "مسار الحياة"]
    ]
  },
  ru: {
    articles: [
      ["Предотвратимые госпитализации", "Опыт пациентов", "Первичная помощь"],
      null,
      ["Публичные выступления врачей", "Общественные дебаты", "Политика здравоохранения"],
      ["Медицинское право", "Старение дома", "Выбор места проживания"]
    ],
    affiches: ["Интеграция помощи", "Старение дома", "Франция и Квебек"],
    memoires: [
      ["Старение дома", "Государственная политика", "Сравнительное право"],
      ["Инвалидность и старение", "Адаптация учреждений", "Поддержка"],
      ["Самоопределение", "Педагогические практики", "Жизненный путь"]
    ]
  }
};

const PUB_META={"fr":["BIBLIOTHÈQUE SCIENTIFIQUE","Explorer les travaux par format","Manuscrits, affiches, communications et mémoires : quatre chemins pour parcourir les travaux scientifiques.",["Questionner","Écrire","Présenter","Partager"],["travaux","affiches","présentations","documents"],"Collection sélectionnée"],"en":["RESEARCH LIBRARY","Explore research by format","Manuscripts, posters, presentations and academic work: four clear ways to explore research.",["Explore","Write","Present","Share"],["works","posters","presentations","documents"],"Selected collection"],"es":["BIBLIOTECA DE INVESTIGACIÓN","Explorar por tipo de trabajo","Manuscritos, pósteres, presentaciones y memorias en cuatro secciones intuitivas.",["Investigar","Escribir","Presentar","Compartir"],["trabajos","pósteres","presentaciones","documentos"],"Colección seleccionada"],"zh":["研究成果资料库","按成果类型浏览","研究手稿、会议海报、口头报告与学位论文，四类作品清晰呈现。",["研究","写作","展示","传播"],["项研究","份海报","场报告","份文档"],"当前分类"],"ar":["مكتبة البحث العلمي","استكشاف الأعمال حسب النوع","مخطوطات وملصقات وعروض وأعمال جامعية في أربعة أقسام واضحة.",["البحث","الكتابة","العرض","المشاركة"],["أعمال","ملصقات","عروض","وثائق"],"المجموعة المحددة"],"ru":["НАУЧНАЯ БИБЛИОТЕКА","Выбрать тип научной работы","Рукописи, постеры, выступления и академические работы в четырёх разделах.",["Исследовать","Написать","Представить","Поделиться"],["работы","постера","выступлений","документа"],"Выбрана коллекция"]};
const PUB_IDS=["publication-articles","publication-affiches","publication-oraux","publication-memoires"];
const PUB_ICONS=["<svg viewBox=\"0 0 230 110\" aria-hidden=\"true\"><rect x=\"42\" y=\"6\" width=\"140\" height=\"98\" rx=\"5\" fill=\"#fffdf7\" stroke=\"#7fa79e\" stroke-width=\"2\"/><rect x=\"56\" y=\"22\" width=\"109\" height=\"9\" rx=\"2\" fill=\"#277669\"/><path d=\"M56 41h109M56 49h109M56 57h73\" stroke=\"#acc3bc\" stroke-width=\"3\" stroke-linecap=\"round\"/><rect x=\"56\" y=\"67\" width=\"46\" height=\"24\" rx=\"2\" fill=\"#d4e9e2\"/><path d=\"m63 85 11-10 10 5 10-8\" stroke=\"#367e70\" stroke-width=\"3\" fill=\"none\"/><path d=\"M115 69h50M115 77h50M115 85h36\" stroke=\"#acc3bc\" stroke-width=\"3\"/></svg>","<svg viewBox=\"0 0 230 110\" aria-hidden=\"true\"><rect x=\"35\" y=\"10\" width=\"160\" height=\"88\" rx=\"4\" fill=\"#fffdf8\" stroke=\"#779bac\" stroke-width=\"2\"/><rect x=\"46\" y=\"20\" width=\"138\" height=\"13\" rx=\"2\" fill=\"#2c6882\"/><path d=\"M48 44h57M48 52h44\" stroke=\"#9eb7c0\" stroke-width=\"3\"/><rect x=\"47\" y=\"62\" width=\"66\" height=\"23\" rx=\"2\" fill=\"#dbeaf0\"/><path d=\"m53 81 13-9 13 4 11-11 16 8\" stroke=\"#46879b\" fill=\"none\" stroke-width=\"3\"/><rect x=\"132\" y=\"58\" width=\"11\" height=\"27\" fill=\"#b57b49\"/><rect x=\"149\" y=\"48\" width=\"11\" height=\"37\" fill=\"#478a99\"/><rect x=\"166\" y=\"66\" width=\"11\" height=\"19\" fill=\"#91b5a5\"/></svg>","<svg viewBox=\"0 0 230 110\" aria-hidden=\"true\"><rect x=\"64\" y=\"65\" width=\"104\" height=\"34\" rx=\"4\" fill=\"#f5e9d7\" stroke=\"#b98f66\" stroke-width=\"2\"/><rect x=\"88\" y=\"46\" width=\"56\" height=\"19\" rx=\"2\" fill=\"#fff5e8\" stroke=\"#ba8e61\" stroke-width=\"2\"/><path d=\"M112 22v23M124 31v14\" stroke=\"#b1774e\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"112\" cy=\"18\" r=\"9\" fill=\"#ce966c\"/><path d=\"M20 39c9-9 17-9 26 0s17 9 26 0m98 0c9-9 17-9 26 0s17 9 26 0\" stroke=\"#c88e5c\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M78 76h75M78 84h75\" stroke=\"#c9ab8c\" stroke-width=\"3\"/></svg>","<svg viewBox=\"0 0 230 110\" aria-hidden=\"true\"><path d=\"M48 12h95l19 19v66H48z\" fill=\"#fffcf7\" stroke=\"#8b7aab\" stroke-width=\"2\"/><path d=\"M143 12v19h19\" fill=\"#e2d9f0\" stroke=\"#8b7aab\" stroke-width=\"2\"/><rect x=\"62\" y=\"42\" width=\"84\" height=\"9\" rx=\"2\" fill=\"#80659e\"/><path d=\"M62 64h84M62 72h84M62 80h58\" stroke=\"#bab0cb\" stroke-width=\"3\" stroke-linecap=\"round\"/><rect x=\"165\" y=\"38\" width=\"24\" height=\"59\" rx=\"2\" fill=\"#b6a8d0\"/><rect x=\"191\" y=\"29\" width=\"22\" height=\"68\" rx=\"2\" fill=\"#e7cc9d\"/><path d=\"M176 47v42m26-49v49\" stroke=\"#fff\" stroke-width=\"3\" opacity=\".75\"/></svg>"];
function navigationPublications(lang,names,counts,prefix){
 const t=PUB_META[lang]||PUB_META.fr,h=x=>String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const stages='<ol class="pub-parcours" aria-label="'+h(t[1])+'">'+t[3].map((s,i)=>'<li><b>'+String(i+1).padStart(2,"0")+'</b><span>'+h(s)+'</span></li>').join('')+'</ol>';
 const cards=names.map((n,i)=>'<button type="button" role="tab" id="publication-tab-'+PUB_IDS[i].slice(12)+'" aria-controls="'+PUB_IDS[i]+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?'0':'-1')+'" class="pub-format'+(i===0?' est-actif':'')+'" style="--pub-c:'+["#286f68","#286881","#aa7044","#755a8d"][i]+'" data-publications-cible="'+PUB_IDS[i]+'"><span class="pub-format-visuel">'+PUB_ICONS[i]+'</span><span class="pub-format-corps"><small>'+String(i+1).padStart(2,"0")+' / 04</small><strong>'+h(n)+'</strong><span class="pub-format-bas"><b>'+String(counts[i]).padStart(2,"0")+'</b>'+h(t[4][i])+'</span></span></button>').join('');
 return '<div class="pub-explorateur"><div class="pub-hero"><img src="'+h(prefix)+'assets/bandeaux/publications.jpg" alt="" width="1200" height="450" loading="lazy"><div class="pub-hero-texte"><span class="pub-kicker">'+h(t[0])+'</span><h3>'+h(t[1])+'</h3><p>'+h(t[2])+'</p></div>'+stages+'</div><nav class="pub-formats" role="tablist" aria-label="'+h(t[1])+'">'+cards+'</nav><div class="pub-en-cours"><i aria-hidden="true"></i><span>'+h(t[5])+' :</span><strong data-publications-annonce aria-live="polite">'+h(names[0])+'</strong></div></div>';
}

function sectionPublications(c) {
 const s=c.publications,l=PUBLICATION_LABELS[c.lang]||PUBLICATION_LABELS.fr;
 const ids=['publication-articles','publication-affiches','publication-oraux','publication-memoires'],posters=s.groupes[0],memoires=s.groupes[1];
 const nav=navigationPublications(c.lang,l.slice(0,4),[c.recherche.travaux.items.length,posters.items.length,0,memoires.items.length],c.chemin);
 const bloc=(id,content,i)=>'<section class="publication-bloc" role="tabpanel" id="'+id+'" aria-labelledby="publication-tab-'+id.slice(12)+'" tabindex="-1"'+(i?' hidden':'')+'>'+content+'</section>';
 const group=(g,items)=>'<article class="groupe-carte"><div class="groupe-corps"><h3 class="titre-bloc titre-icone">'+e(g.titre)+'<span class="compte">'+items.length+'</span></h3>'+liste(items)+'</div></article>';
 const memItems=memoires.items.map((it,i)=>i<2?{...it,cible:['memoire-domicile','memoire-ehpad'][i]}:it);
 return '<div class="section-corps pleine publications-page"><div class="colonne-texte"><p class="surtitre">'+e(s.surtitre)+'</p><h2>'+e(s.titre)+'</h2><p class="intro">'+e(s.intro)+'</p></div>'+nav+
 bloc(ids[0],travauxEnCours(c),0)+
 bloc(ids[1],'<h3 class="publication-titre">'+e(l[1])+'</h3><div class="groupes-grille">'+group(posters,posters.items)+'</div>',1)+
 bloc(ids[2],'<h3 class="publication-titre">'+e(l[2])+'</h3><p class="publication-vide">'+e(l[4])+'</p>',2)+
 bloc(ids[3],'<h3 class="publication-titre">'+e(l[3])+'</h3><div class="groupes-grille">'+group(memoires,memItems)+'</div><p class="publication-these-note">'+e(l[5])+' <a href="#recherche">'+e(l[6])+' <span aria-hidden="true">→</span></a></p>',3)+'</div>';
}

const RESSOURCES = JSON.parse(fs.readFileSync(path.join(__dirname, "ressources-donnees.json"), "utf8"));
const lienFinal = (s) => e(s).replace(/(https?:\/\/\S+?)(\.?)$/, (u, url, point) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>${point}`);

function sectionConceptualisation(c, imbrique = false) {
  const t = c.conceptualisation;
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
    `<ol class="lectures">${arr.map((x) => `<li><span class="lecture-auteurs">${e(x.auteurs)} (${e(x.annee)})</span> ${x.lien ? lien(x.lien, e(x.titre)) : e(x.titre)} <span class="type">${e(TYPES_ETUDES.traduire(c.lang,x.type))}</span></li>`).join("")}</ol>`;
  return `<div class="${imbrique ? "conceptualisation-these" : "section-corps pleine"}">
<div class="${imbrique ? "conceptualisation-texte" : "colonne-texte"}">
${imbrique ? "" : `<p class="surtitre">${e(t.surtitre)}</p>`}
<${imbrique ? "h3" : "h2"}>${e(t.titre)}</${imbrique ? "h3" : "h2"}>
<p class="intro">${e(t.intro)}</p>
<div class="chiffres">${t.chiffres.map(([v, l]) => `<div><strong>${e(v)}</strong><span>${e(l)}</span></div>`).join("")}</div>
<h3 class="titre-bloc">${e(t.prioritesTitre)}</h3>
<div class="barres">${barres}</div>
<h3 class="titre-bloc">${e(t.provenanceTitre)}</h3>
${anneau}
<p class="note">${e(t.note)}</p>
</div>
<div class="${imbrique ? "conceptualisation-outils" : "colonne-outils"}">
<h3 class="titre-bloc">${e(t.lacunesTitre)}</h3>
<p class="note">${e(t.lacunesIntro)}</p>
<div class="lacunes">${lacunes}</div>
<div class="lacune-principale"><h4>${e(t.principaleTitre)}</h4><p>${e(t.principale)}</p><p class="vigilance">${e(t.vigilance)}</p></div>
<details class="biblio"><summary>${e(t.p5Titre)}</summary>${lectures(D.p5)}</details>
<details class="biblio"><summary>${e(t.p4Titre)}</summary>${lectures(D.p4)}</details>
</div>
</div>`;
}

function sectionValeurs(c) {
  const v = c.valeurs;
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(v.surtitre)}</p>
<h2>${e(v.titre)}</h2>
<p class="intro">${e(v.intro)}</p>
<p class="devise devise-grande"><span class="devise-libelle">${e(v.devise[0])}</span><span class="devise-latin" lang="la">${e(v.devise[1])}</span><span class="devise-traduction">${e(v.devise[2])}</span></p>
</div>
<div class="colonne-outils"><div class="valeurs-grille">${v.items
    .map(([t, d, teinte], i) => `<article class="valeur v${teinte ?? i % 6}"><span class="valeur-num">${num(i)}</span><h4>${e(t)}</h4><p>${e(d)}</p></article>`)
    .join("")}</div></div>
</div>`;
}

// Ressources : articles, guides, capsules, balados et presse, chacun dans sa propre section, en français et en anglais.

// Lectures de toute la scolarité, par thème, en français puis en anglais
const LECTURES = require("./lectures.json").themes;
const LECTURES_TITRE = { fr: "Lectures", en: "Readings", es: "Lecturas", zh: "阅读文献", ar: "قراءات" };
function sectionLectures(c, R, mode) {
  const l = LECTURES_TITRE[c.lang] ? c.lang : "en";
  const garder = (x) => (mode === "grise") === (x.grise === true || GRISE.test(x.apa));
  const THEMES = LECTURES.map((t) => ({ ...t, lectures: t.lectures.filter(garder) })).filter((t) => t.lectures.length);
  const total = THEMES.reduce((n, t) => n + t.lectures.length, 0);
  const ref = (x) => { const t = e(x.apa); return `<li>${x.lien ? t.replace(e(x.lien), `<a href="${e(x.lien)}" rel="noopener">${e(x.lien.replace("https://doi.org/", "doi:"))}</a>`) : t}</li>`; };
  const theme = (t) => {
    const cols = ["fr", "en"].map((k, i) => { const v = t.lectures.filter((x) => x.langue === k); return v.length ? `<div class="rg-colonne"><p class="rg-langue">${e(R.langues[i])}</p><ol class="lectures-liste">${v.map(ref).join("")}</ol></div>` : ""; }).join("");
    return `<details class="lecture-theme"><summary>${e(t[l] || t.en)}<span class="compte">${t.lectures.length}</span></summary><div class="rg-langues">${cols}</div></details>`;
  };
  if (mode === "grise") {
    const tout = THEMES.flatMap((t) => t.lectures).filter((x, i, a) => a.findIndex((y) => y.apa === x.apa) === i).sort((a, b) => a.apa.localeCompare(b.apa));
    const cols = ["fr", "en"].map((k, i) => { const v = tout.filter((x) => x.langue === k); return v.length ? `<div class="rg-colonne"><p class="rg-langue">${e(R.langues[i])}</p><ol class="lectures-liste">${v.map(ref).join("")}</ol></div>` : ""; }).join("");
    return `<section class="rg rg-lectures"><h3 class="rg-titre">${e((SOUS_RESSOURCES[c.lang] || SOUS_RESSOURCES.en).rapports)}<span class="compte">${tout.length}</span></h3><div class="rg-langues">${cols}</div></section>`;
  }
  return `<section class="rg rg-lectures"><h3 class="rg-titre">${LECTURES_TITRE[l]}<span class="compte">${total}</span></h3><div class="lectures-themes">${THEMES.map(theme).join("")}</div></section>`;
}
function sectionMedias(c, partie) {
  const P = PARTIES_RESSOURCES[partie];
  const R = c.ressources;
  const classes = ["rg-articles", "rg-guides", "rg-balados", "rg-videos", "rg-presse"];
  const enAnglais = (gi, ii) => /\(anglais\)/.test(fr.ressources.groupes[gi][1][ii][1]);
  const fleche = ' <span aria-hidden="true">↗</span>';
  const suggestion = ([titre, source, href, apport]) =>
    `<li>${lien(href, `<span><strong>${e(titre)}</strong><small>${e(source)}</small><small class="apport">${e(apport)}</small></span>${fleche}`)}</li>`;
  const bloc = ([nom, items], gi) => {
    const medias = items.some(([, , href]) => integration(href));
    const parLangue = [0, 1].map((k) => items.filter((_, ii) => (k === 1) === enAnglais(gi, ii)));
    const colonne = (liste, k) =>
      liste.length
        ? `<div class="rg-colonne"><p class="rg-langue">${e(R.langues[k])}</p>${medias ? `<div class="mediatheque">${liste.map((it) => media(c, it)).join("")}</div>` : `<ul class="liens-contact compact suggestions">${liste.map(suggestion).join("")}</ul>`}</div>`
        : "";
    return `<section class="rg ${classes[gi] || ""}"><h3 class="rg-titre">${e(nom)}<span class="compte">${items.length}</span></h3><div class="rg-langues">${parLangue.map(colonne).join("")}</div></section>`;
  };
  return `<div class="section-corps pleine section-medias">
<div class="colonne-texte">
<p class="surtitre">${e(R.surtitre)}</p>
<h2>${e(c.hall.portes[partie][1])}</h2>
${partie === "litterature" ? `<p class="intro">${e(R.intro)}</p>` : ""}
</div>
</div>
<div class="rg-ensemble">${P.groupes.map((gi) => bloc(R.groupes[gi], gi)).join("")}${P.lectures ? sectionLectures(c, R, P.lectures) : ""}</div>`;
}

function sectionParcours(c) {
  const p = c.parcours;
  return `<div class="section-corps pleine">
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

const PREFERENCES = require('./chargement-page')();

const langueHtml = (l) => (l.code === "falc" ? "fr" : l.code);

function menuLangues(c, ici) {
  const actuelle = langue(ici === "falc" ? "fr" : ici);
  const partielle = { fr: "Traduction partielle", en: "Partial translation", es: "Traducción parcial", zh: "部分翻译", ar: "ترجمة جزئية", ru: "Частичный перевод" }[c.lang] || "Traduction partielle";
  const nomLangue = l => e(l.nom) + (["iu", "moe"].includes(l.code) ? `<small class="langue-statut" lang="${c.lang}">${e(partielle)}</small>` : "");
  const lienLangue = (l) =>
    l.code === ici
      ? `<span aria-current="page" lang="${langueHtml(l)}">${drapeau(l.drapeau)}<span>${nomLangue(l)}</span></span>`
      : `<a href="${c.chemin + l.dossier || "./"}" lang="${langueHtml(l)}"${l.hreflang ? ` hreflang="${l.hreflang}"` : ""}>${drapeau(l.drapeau)}<span>${nomLangue(l)}</span></a>`;
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
${ici === "falc" ? `<span aria-current="page" lang="fr"><img class="logo-falc" src="${c.chemin}assets/logo-falc-mini.jpg" alt="" width="22" height="22"><span>${e(u.falc)}</span></span>` : `<a href="${c.chemin}falc/" lang="fr"><img class="logo-falc" src="${c.chemin}assets/logo-falc-mini.jpg" alt="" width="22" height="22"><span>${e(u.falc)}</span></a>`}
${`<a href="${c.chemin}methode-vulgarisee.html#recherche/methodes" lang="fr"><img class="logo-falc" src="${c.chemin}assets/grand-public-mini.jpg" alt="" width="22" height="22" style="border-radius:50%;object-fit:cover;object-position:center 18%"><span>${e(({fr:"Consulter la version vulgarisée",en:"Plain-language version (in French)",es:"Versión en lenguaje sencillo (en francés)",zh:"通俗版（法语）",ar:"النسخة المبسّطة (بالفرنسية)",ru:"Версия простым языком (на французском)"})[c.lang]||"Consulter la version vulgarisée")}</span></a>`}
</div></details>`;
}


function accesThese(c) {
  const libelle = ({ fr: "Projet de thèse", en: "My PhD", es: "Mi tesis", zh: "我的博士论文", ar: "أطروحتي", ru: "Моя диссертация" })[c.lang] || "Projet de thèse";
  return `<span class="these-nav"><svg class="these-guide" viewBox="0 0 54 48" aria-hidden="true" focusable="false"><circle cx="24" cy="25" r="22" fill="#dceef3"/><path d="M12 45V35c0-6 4-10 10-10s10 4 10 10v10" fill="#205b76"/><path d="m18 26 4 9 4-9" fill="#fff"/><path d="m21 30 1-2 2 2-1 11" fill="#d4a34e"/><path d="M14 34v8" fill="none" stroke="#327f96" stroke-width="5" stroke-linecap="round"/><g class="these-guide-bras"><path d="M29 32h8" fill="none" stroke="#205b76" stroke-width="6" stroke-linecap="round"/><g class="these-guide-main-coucou" fill="#f4ccb0" stroke="#ad7058" stroke-width=".5" stroke-linejoin="round"><path d="M37 29h3l2-4q1-1 2 0l-1 3h7q2 0 2 1t-2 1h-5l6 1q2 1 0 2l-6-1 5 2q1 2-1 2l-6-2 3 2q1 2-1 2l-7-4z"/></g><g class="these-guide-main-index" fill="#f4ccb0" stroke="#ad7058" stroke-width=".6" stroke-linejoin="round"><path d="M37 29h4l9-1q3 0 2 2l-9 1 2 1q2 1 0 2l-3 1-5-2z"/></g></g><path d="M19 23v5l3 3 3-3v-5" fill="#e5a987"/><ellipse cx="22" cy="17" rx="8" ry="9" fill="#f4ccb0"/><path d="M14 18c-2-8 2-12 8-12 6 0 10 5 8 11l-3-5c-3 2-7 2-11 1l-1 5" fill="#193e52"/><g fill="#193e52"><circle cx="19" cy="17" r=".8"/><circle cx="25" cy="17" r=".8"/></g><path d="M19 22q3 3 6 0" fill="none" stroke="#ad7058" stroke-width="1.1" stroke-linecap="round"/></svg><a class="acces-these" href="#recherche" aria-label="${e(libelle)}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.6c0 1.3 2.5 2.9 5.5 2.9s5.5-1.6 5.5-2.9V11"/><path d="M21.5 9v5"/></svg><span>${e(libelle)}</span><span class="acces-these-fleche" aria-hidden="true">→</span></a></span>`;
}

function page(c, options = {}) {
  BIBLIO = c.implantation.bibliographie.items;
  typoFr = c.lang === "fr";
  const p = c.chemin;
  const edition = options.edition || c.lang;
  const ici = URL + langue(edition).dossier;
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
    sameAs: [c.contact.liens.find((l) => l[0] === "ORCID")[2]],
  };
  c.hall.portes.transmission = MEDIATION.LANGUES[c.lang].enseignement.salle;
  c.hall.portes.vulgarisation = MEDIATION.LANGUES[c.lang].vulgarisation.salle;
  c.hall.portes.axes = MEDIATION.LANGUES[c.lang].axes.salle;
  c.hall.portes.ia = IA.langues[c.lang].salle;
  c.hall.portes.notions = textesNotions(c).salle;
  c.hall.portes.outils = textesOutils(c).salle;
  for (const k of CLES_VITRINES) c.hall.portes[k] = textesVitrine(c, k).salle;
  c.hall.portes.logiciels=LOGICIELS[c.lang].salle;
  poserSousPortes(c);
  const sections = {
    recherche: sectionRecherche(c),
    approche: sectionApproche(c),
    methodes: sectionMethodes(c),
    axes: sectionAxes(c),
    implantation: sectionImplantation(c),
    transmission: sectionTransmission(c),
    vulgarisation: sectionVulgarisation(c),
    notions: sectionNotions(c),
    outils: sectionOutils(c)+sectionLogiciels(c,true),
    logiciels: sectionLogiciels(c),
    publications: sectionPublications(c),
    biographie: sectionBiographie(c),
    parcours: sectionParcours(c),
    ia: sectionIA(c),
    valeurs: sectionValeurs(c),
    juriste: sectionVitrine(c, "juriste"),
    gestionnaire: sectionVitrine(c, "gestionnaire"),
    educateur: sectionVitrine(c, "educateur"),
    entrepreneuriat: sectionOutils(c)+sectionLogiciels(c,true),
    litterature: sectionMedias(c, "litterature"),
    grise: sectionMedias(c, "grise"),
    presse: sectionMedias(c, "presse"),
    capsules: sectionMedias(c, "capsules"),
    balados: sectionMedias(c, "balados"),
    representation: sectionEngagements(c, "representation"),
    communaute: sectionEngagements(c, "communaute"),
    distinctions: sectionEngagements(c, "distinctions"),
    citoyen: sectionEngagements(c, "citoyen"),
    loisirs: sectionEngagements(c, "loisirs"),
  };

  return `<!doctype html>
<html lang="${c.lang === "zh" ? "zh-Hans" : c.lang}"${langue(c.lang).dir ? ` dir="${langue(c.lang).dir}"` : ""} data-voix="${langue(c.lang).voix}" data-racine="${c.chemin || "./"}"${options.edition ? ` data-edition="${options.edition}" data-traduction="partielle"` : ""}${!options.edition && ["fr", "en"].includes(c.lang) ? ` data-audio="${c.lang}" data-audio-exclues="implantation logiciels recherche approche methodes axes ia transmission vulgarisation publications parcours educateur loisirs valeurs biographie notions representation"` : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${PREFERENCES}
<title translate="no">${e(c.meta.titre)}</title>
<meta name="description" content="${e(c.meta.description)}">
<meta name="theme-color" content="#fcfdfb">
<link rel="canonical" href="${ici}">
${LANGUES.filter((l) => l.hreflang).map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${URL}${l.dossier}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${URL}">
<link rel="icon" href="${p}assets/favicon.svg?v=${VERSION_ICONE}" type="image/svg+xml">
<link rel="stylesheet" href="${p}assets/site.css?v=${VERSION_CSS}">
${c.lang === 'fr' ? `<link rel="stylesheet" href="${p}assets/cadres-pedagogiques.css?v=20261019-1"><script src="${p}assets/cadres-pedagogiques.js?v=20261019-1" defer></script>` : ''}
${c.lang === 'fr' ? `<link rel="stylesheet" href="${p}assets/enseignement-immersif.css?v=${empreinte('assets/enseignement-immersif.css')}"><script src="${p}assets/enseignement-immersif.js?v=${empreinte('assets/enseignement-immersif.js')}" defer></script>` : ''}
<link rel="stylesheet" href="${p}assets/hall-realiste.css?v=${VERSION_HALL_CSS}">
<link rel="stylesheet" href="${p}assets/vulgarisation-studio.css?v=20261015studio5">
<link rel="stylesheet" href="${p}assets/vulgarisation-editorial.css?v=6501e1f73c">
${NAVIGATION_CHAPITRES.styles(p)}
<meta property="og:type" content="profile">
<meta property="og:title" content="${e(c.meta.titre)}">
<meta property="og:description" content="${e(c.meta.description)}">
<meta property="og:image" content="${URL}assets/apercu.jpg">
<meta property="og:url" content="${ici}">
<meta property="og:locale" content="${c.locale}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(personne)}</script>
<script src="${p}assets/hall-marche.js?v=${VERSION_MARCHE}" defer></script>
<script src="${p}assets/hall-ciel.js?v=${VERSION_CIEL}" defer></script>
<script src="${p}assets/site.js?v=${VERSION_JS}" defer></script>
<script src="${p}assets/vulgarisation-studio.js?v=616a84e6b8" defer></script>
<script src="${p}assets/vulgarisation-editorial.js?v=1c60acd3f4" defer></script>
${NAVIGATION_CHAPITRES.scripts(p)}
${c.lang === 'fr' ? `<link rel="stylesheet" href="${p}assets/maturite-scientifique.css?v=${empreinte('assets/maturite-scientifique.css')}"><script src="${p}assets/maturite-scientifique.js?v=${empreinte('assets/maturite-scientifique.js')}" defer></script><link rel="stylesheet" href="${p}assets/o3-reseaux.css?v=${empreinte('assets/o3-reseaux.css')}"><script src="${p}assets/o3-reseaux.js?v=${empreinte('assets/o3-reseaux.js')}" defer></script>` : ''}
${baliseAudience(p)}
<link rel="stylesheet" href="${p}assets/bibliographie.css?v=${empreinte("assets/bibliographie.css")}"><script src="${p}assets/bibliographie.js?v=${empreinte("assets/bibliographie.js")}" defer></script>
<link rel="stylesheet" href="${p}assets/typographie.css?v=bc0fdd3359">
</head>
<body>
<a class="evitement" href="#contenu">${e(c.ui.evitement)}</a>
<header class="entete">
<a class="marque" href="${p || "./"}"><span class="marque-domaines">${e(c.ui.sousTitre)}</span></a>
<p class="coordonnees coordonnees-haut"><a href="mailto:${e(c.contact.courriel)}">${icone("enveloppe")}${e(c.contact.courriel)}</a><a href="tel:${TELEPHONE[1]}">${icone("telephone")}${TELEPHONE[0]}</a></p>
<nav class="nav" aria-label="${e(c.ui.navigation)}">${accesThese(c)}${GROUPES.map(([g, ss]) => `<a href="#${ss[0] || g}" style="--nav-accent:${TEINTES_GROUPES[g][0]}">${iconeMenu(g)}${e(texteGroupe(c, g)[0])}</a>`).join("")}</nav>
<div class="outils">
${menuLangues(c, edition)}
${menuAcces(c, c.lang)}
<a class="bouton-cv" href="${p}docs/cv-academique.pdf">${e(c.ui.cv)} <span aria-hidden="true">↓</span></a>
<a class="bouton-cv" href="${e(c.recherche.affiche[2])}" target="_blank" rel="noopener">${e(({fr:"Affiche",en:"Poster",es:"Póster",zh:"海报",ar:"الملصق",ru:"Постер"})[c.lang] || "Affiche")} <span aria-hidden="true">↗</span></a>
</div>
</header>

<main id="contenu">
${options.edition ? accueilAutochtone(options.edition) : ""}
<section class="accueil" aria-labelledby="nom">
<div class="presentation">
<div class="identite">
<img class="portrait" src="${p}assets/portrait.jpg?v=${empreinte("assets/portrait.jpg")}" width="900" height="900" alt="${e(c.accueil.portrait)}">
<div><p class="surtitre">${e(c.accueil.surtitre)}</p><h1 id="nom" translate="no">Éric Bernier</h1><p class="roles">${e(c.accueil.roles)}</p></div>
</div>
<div class="chapeau"><h2>${e(c.accueil.chapeau.titre)}</h2>${c.accueil.chapeau.paragraphes.map((x) => `<p>${riche(x)}</p>`).join("")}</div>
<p class="encadrement">${encadrementAvecLiens(c)}</p>
<div class="actions"><button class="primaire" type="button" id="visite">${e(c.accueil.visite)} <span aria-hidden="true">→</span></button><a class="lien" href="#recherche">${e(c.accueil.explorer)}</a></div>
</div>
${hallEnVolume(c)}
${bandeAccueil(c)}
</section>

${SALLES.map(
  (s, i) => `<section class="section${i % 2 ? " teinte" : ""}" id="${s}" data-salle="${s}" data-titre="${e(c.hall.portes[s][0])}">
<div class="section-contenu" data-numero="${NUMS[s]}" data-mini="${p}assets/portes-mini/${miniSalle(s)}.${s==="logiciels"?"svg":"jpg"}?v=${empreinte("assets/portes-mini/" + miniSalle(s) + (s==="logiciels"?".svg":".jpg"))}">
<div class="bandeau" style="--c1:${TEINTES[s][0]};background-image:var(--degrade),url(${p}assets/${bandeau(s)}?v=${empreinte("assets/" + bandeau(s))})" role="img" aria-label="${e(c.hall.portes[s][0])}"><div class="bandeau-texte"><span class="bandeau-num">${NUMS[s]}</span><span class="bandeau-titre">${e(c.hall.portes[s][0])}</span><span class="bandeau-legende">${e(c.hall.portes[s][1])}</span></div></div>
${sections[s].replace(/<p class="surtitre">(\d{2} · )?/, `<p class="surtitre">${NUMS[s]} · `)}
</div>
</section>`
).join("\n")}

<section class="section contact" id="contact">
<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(c.contact.surtitre)}</p>
<h2>${e(c.contact.titre)}</h2>
<p class="intro">${e(c.contact.intro)}</p>
<div class="contact-actions"><a class="primaire" href="mailto:${e(c.contact.courriel)}">${e(c.contact.ecrire)} <span aria-hidden="true">→</span></a><a class="primaire secondaire" href="${BOOKINGS}" rel="noopener" target="_blank">${e(textesTransmission(c).rdv)} <span aria-hidden="true">↗</span></a></div>
<p class="courriel"><a href="mailto:${e(c.contact.courriel)}">${icone("enveloppe")}${e(c.contact.courriel)}</a></p>
<p class="courriel"><a href="tel:${TELEPHONE[1]}">${icone("telephone")}${TELEPHONE[0]}</a></p>
<p class="note">${e(c.contact.adresse)}</p>
</div>
<div class="colonne-outils"><ul class="liens-contact">${c.contact.liens
    .map(([t, d, href]) => `<li>${lien(externe(href) ? href : p + href, `<span><strong>${e(t)}</strong><small>${e(d)}</small></span><span aria-hidden="true">${externe(href) ? "↗" : "↓"}</span>`)}</li>`)
    .join("")}</ul></div>
</div>
</section>
${JEUX_ACCUEIL[c.lang] || ""}
</main>

<footer class="pied"><div class="pied-informations">${copyrightSite(c.lang)}${confidentialiteAudience(c.lang)}<small>${e(c.credits)}</small></div><a href="#contenu">${e(c.ui.haut)} ↑</a></footer>

<div class="salle" id="salle" role="dialog" aria-modal="true" aria-labelledby="salle-titre" hidden>
<div class="salle-barre">
<button type="button" data-retour>← ${e(c.ui.hall)}</button>
<span id="salle-titre"></span>
</div>
<div class="salle-contenu"></div>
</div>
</body>
</html>
`;
}

function enTeteAbregee(c, code) {
  return `<!doctype html>
<html lang="fr" data-voix="fr-FR" data-racine="../"${code === "falc" ? ' data-audio="falc"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${PREFERENCES}
<title>${e(c.titre)}</title>
<meta name="description" content="${e(c.description)}">
<link rel="canonical" href="${URL}${langue(code).dossier}">
<link rel="icon" href="../assets/favicon.svg?v=${VERSION_ICONE}" type="image/svg+xml">
<link rel="stylesheet" href="../assets/site.css?v=${VERSION_CSS}">
<link rel="stylesheet" href="../assets/hall-realiste.css?v=${VERSION_HALL_CSS}">
<script src="../assets/hall-marche.js?v=${VERSION_MARCHE}" defer></script>
<script src="../assets/hall-ciel.js?v=${VERSION_CIEL}" defer></script>
<script src="../assets/site.js?v=${VERSION_JS}" defer></script>
${baliseAudience("../")}
</head>
<body class="page-abregee">
<a class="evitement" href="#contenu">${e(fr.ui.evitement)}</a>
<header class="entete">
<a class="marque" href="../"><span class="marque-domaines">${e(fr.ui.sousTitre)}</span></a>
<div class="outils">
${menuLangues(c, code)}
${menuAcces(c, code)}
</div>
</header>`;
}

const piedAbrege = () => `<footer class="pied"><div class="pied-informations">${copyrightSite("fr")}${confidentialiteAudience("fr")}</div><a href="#contenu">${e(fr.ui.haut)} ↑</a></footer>
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
<p class="logo-falc-bloc"><img src="../assets/logo-falc.jpg" width="80" height="79" alt="Logo européen Facile à lire"></p>
<p class="actions-ecoute">${ecouter("contenu", a.ecouterTout)}<button type="button" class="bouton-ecouter" data-arreter hidden>${e(fr.ui.arreter)}</button></p>
${a.blocs.map(bloc).join("\n")}
<p class="credit-falc">© European Easy-to-Read Logo: Inclusion Europe. Plus d’informations : <a href="https://www.easy-to-read.eu" target="_blank" rel="noopener">www.easy-to-read.eu</a></p>
</main>
${piedAbrege()}`;
}

function accueilAutochtone(code) {
  const a = EDITIONS_AUTOCHTONES[code], cle = code === "moe" ? "innu" : "iu";
  const T = AUTOCHTONES[cle];
  const natif = n => '<span lang="' + code + '">' + e(T[n].texte) + '</span>' + (T[n].latin ? '<small class="translitteration" lang="iu-Latn">' + e(T[n].latin) + '</small>' : '');
  return '<aside class="edition-linguistique" aria-labelledby="edition-titre" lang="fr"><div class="edition-linguistique-tete"><h2 id="edition-titre">' + natif("1") + '</h2><span class="edition-statut">Traduction partielle</span></div><p>' + e(a.introduction) + '</p><details><summary>Présentation commencée en ' + e(a.langue.toLowerCase()) + '</summary><div class="edition-presentation"><div><h3>' + natif("2") + '</h3><p>' + natif("3") + '</p><p>' + natif("4") + '</p><p lang="fr">' + e(ABREGE.presentation.fr[0]) + '</p></div><div><h3>' + natif("5") + '</h3><p>' + natif("6") + '</p><p>' + natif("7") + '</p><p lang="fr">' + e(ABREGE.presentation.fr[1]) + '</p></div><div><h3>' + natif("11") + '</h3><p>' + natif("12") + '</p><p><a href="mailto:' + e(ABREGE.COURRIEL) + '" translate="no">' + e(ABREGE.COURRIEL) + '</a></p><p>' + natif("16") + '</p></div></div></details><p class="edition-limite">' + e(a.limite) + '</p><nav class="edition-actions" aria-label="Accès aux contenus et ressources linguistiques"><a href="#hall">Explorer les 28 rubriques en français</a><a href="../en/">Read the full site in English</a>' + (a.automatique ? '<a href="' + a.automatique + '" target="_blank" rel="noopener noreferrer">Traduction automatique complète en inuktut ↗</a>' : '') + '<a href="' + a.source + '" target="_blank" rel="noopener noreferrer">' + e(a.sourceNom) + ' ↗</a></nav></aside>';
}

function pageAutochtone(code) {
  const a = EDITIONS_AUTOCHTONES[code], c = JSON.parse(JSON.stringify(fr));
  c.chemin = "../";
  c.meta.description = a.langue + " · Toutes les rubriques du site d’Éric Bernier ; présentation préliminaire et contenu français accessible en intégralité.";
  c.meta.titre = "Éric Bernier · " + a.langue;
  return page(c, { edition: code });
}

function introuvable() {
  typoFr = false;
  const ligne = (c, dossier) => `<p lang="${c.lang}"${langue(c.lang).dir ? ` dir="${langue(c.lang).dir}"` : ""} class="note">${e(c.introuvable.texte)} <a href="/${dossier}">${e(c.introuvable.retour)}</a></p>`;
  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(fr.introuvable.titre)} · Éric Bernier</title>
<link rel="icon" href="/assets/favicon.svg?v=${VERSION_ICONE}" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"></head>
<body class="page-404"><main><p class="surtitre">404</p><h1>${e(fr.introuvable.titre)}</h1><p>${e(fr.introuvable.texte)}</p><p><a class="primaire" href="/">${e(fr.introuvable.retour)} →</a></p>
${[en, es, zh, ar, ru].map((c) => ligne(c, langue(c.lang).dossier)).join("\n")}</main></body>
</html>
`;
}

const protegerCoordonnees = html => html.replace(/<a\b([^>]*href="(?:mailto:|tel:|https:\/\/orcid\.org\/)[^>]*?)>/g, (balise, attributs) => /translate=/.test(attributs) ? balise : '<a' + attributs + ' translate="no">');

const ecrire = (dossier, html) => {
  fs.mkdirSync(path.join(RACINE, dossier), { recursive: true });
  fs.writeFileSync(path.join(RACINE, dossier, "index.html"), protegerCoordonnees(html));
};
// En arabe, les flèches de direction suivent le sens de lecture.
const miroir = (html) => html.replace(/[→←]/g, (m) => (m === "→" ? "←" : "→"));
const { zonesPage, zonesFalc } = require("./narration");
const lectures = {};
TRANSMISSION.ru = RU_COMPLEMENTS.TRANSMISSION;
SOUS_RESSOURCES.ru = RU_COMPLEMENTS.SOUS_RESSOURCES;
OUTILS.ru = RU_COMPLEMENTS.OUTILS;
TEXTES_GROUPES.ru = RU_COMPLEMENTS.TEXTES_GROUPES;
SCHEMAS.ru = RU_COMPLEMENTS.SCHEMAS;
BANDE.ru = RU_COMPLEMENTS.BANDE;
INTEGRATION.ru = RU_COMPLEMENTS.INTEGRATION;
LECTURES_TITRE.ru = RU_COMPLEMENTS.LECTURES_TITRE;
LECTURES.forEach((theme, i) => { theme.ru = RU_COMPLEMENTS.LECTURES_THEMES[i]; });
DRAPEAUX.ru = '<svg viewBox="0 0 3 2"><path fill="#fff" d="M0 0h3v2H0z"/><path fill="#0039a6" d="M0 .667h3v.667H0z"/><path fill="#d52b1e" d="M0 1.334h3V2H0z"/></svg>';
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
for (const code of ["iu", "moe"]) ecrire(langue(code).dossier, pageAutochtone(code));
fs.writeFileSync(path.join(RACINE, "404.html"), introuvable());
console.log("pages produites : " + LANGUES.map((l) => l.dossier || "/").join(", ") + " et 404.html");

// Finaliser toutes les pages avec la charte commune et son empreinte de cache.
require("./harmoniser-typographie")();
