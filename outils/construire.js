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
const TELEPHONE = ["(263) 384-3050", "+12633843050"];
const GROUPES = [
  ["recherche", ["recherche", "approche", "conceptualisation", "publications"]],
  ["implantation", ["implantation", "notions", "transmission", "outils"]],
  ["parcours", ["biographie", "parcours", "valeurs"]],
  ["engagements", ["representation", "communaute", "distinctions", "citoyen", "loisirs"]],
  ["ressources", ["litterature", "grise", "presse", "capsules", "balados"]],
  ["contact", []],
];
const SALLES = GROUPES.flatMap(([, ss]) => ss);
const NUMS = Object.fromEntries(GROUPES.flatMap(([, ss], gi) => ss.map((s, k) => [s, String(gi + 1).padStart(2, "0") + (ss.length > 1 ? "." + (k + 1) : "")])));
const TRANSMISSION = {
  fr: { porte: ["Transfert de connaissances et implantation", "Implantation, notions clés, enseignement, vulgarisation et outils numériques"], salle: ["Enseigner et vulgariser", "Enseignement, communication et vulgarisation"], surtitre: "Transmission", titre: "Enseigner, vulgariser, communiquer", intro: "Transférer les connaissances, c’est aussi les enseigner, les rendre lisibles et les partager avec celles et ceux qui les mobilisent.", groupes: ["Enseignement", "Communications scientifiques", "Vulgarisation et accessibilité", "Animation de réseaux"], affiche: ["Affiche du projet de thèse en version accessible", "Sept langues, dont l’inuktitut et l’innu-aimun (versions préliminaires), une version en facile à lire et à comprendre (FALC), et des versions adaptées au daltonisme et à la basse vision."], rdv: "Réserver un rendez-vous" },
  en: { porte: ["Knowledge transfer and implementation", "Implementation, key concepts, teaching, outreach and digital tools"], salle: ["Teaching and outreach", "Teaching, communication and outreach"], surtitre: "Sharing knowledge", titre: "Teaching, outreach, communication", intro: "Transferring knowledge also means teaching it, making it readable and sharing it with those who put it to use.", groupes: ["Teaching", "Scientific communications", "Outreach and accessibility", "Network facilitation"], affiche: ["Accessible version of the thesis project poster", "Seven languages, including Inuktitut and Innu-aimun (preliminary versions), an easy-to-read version, and versions adapted for colour blindness and low vision."], rdv: "Book a meeting" },
  es: { porte: ["Transferencia de conocimientos e implementación", "Implementación, nociones clave, docencia, divulgación y herramientas digitales"], salle: ["Enseñar y divulgar", "Docencia, comunicación y divulgación"], surtitre: "Transmisión", titre: "Enseñar, divulgar, comunicar", intro: "Transferir conocimientos también es enseñarlos, hacerlos comprensibles y compartirlos con quienes los movilizan.", groupes: ["Docencia", "Comunicaciones científicas", "Divulgación y accesibilidad", "Animación de redes"], affiche: ["Versión accesible del póster del proyecto de tesis", "Siete idiomas, entre ellos el inuktitut y el innu-aimun (versiones preliminares), una versión de lectura fácil y versiones adaptadas al daltonismo y a la baja visión."], rdv: "Reservar una cita" },
  zh: { porte: ["知识转化与实施", "实施、关键概念、教学、科普与数字工具"], salle: ["教学与科普", "教学、传播与科普"], surtitre: "知识传递", titre: "教学、科普与传播", intro: "转化知识，也意味着教授知识、让知识易于理解，并与运用知识的人分享。", groupes: ["教学", "学术交流", "科普与无障碍", "网络组织与引导"], affiche: ["博士论文项目海报无障碍版", "共七种语言，包括因纽特语和因努语（初步版本），另有易读版，以及适合色觉障碍和低视力人士的版本。"], rdv: "预约会面" },
  ar: { porte: ["نقل المعارف والتنفيذ", "التنفيذ والمفاهيم الأساسية والتدريس والتبسيط العلمي والأدوات الرقمية"], salle: ["التدريس والتبسيط", "التدريس والتواصل والتبسيط العلمي"], surtitre: "نقل المعرفة", titre: "التدريس والتبسيط والتواصل", intro: "نقل المعارف يعني أيضًا تدريسها وجعلها مفهومة ومشاركتها مع من يستخدمونها.", groupes: ["التدريس", "المداخلات العلمية", "التبسيط العلمي وإتاحة الوصول", "تنشيط الشبكات"], affiche: ["النسخة الميسّرة من ملصق مشروع الأطروحة", "سبع لغات، منها الإنكتيتوت والإينو-أيمون (نسخ أولية)، ونسخة سهلة القراءة، ونسخ مكيّفة لعمى الألوان وضعف البصر."], rdv: "حجز موعد" },
};
const BOOKINGS = "https://bookings.cloud.microsoft/book/RDVavecEricBernier@umontreal.ca/";
const textesTransmission = (c) => TRANSMISSION[c.lang] || TRANSMISSION.en;
// La salle reprend des éléments déjà publiés ailleurs sur le site (mêmes positions dans toutes les langues).
function sectionTransmission(c) {
  const T = textesTransmission(c);
  const iEns = fr.parcours.etapes.map((x, i) => (/Auxiliaire d’enseignement/.test(x.titre) ? i : -1)).filter((i) => i >= 0);
  const iAnap = fr.parcours.etapes.findIndex((x) => /ANAP|Agence nationale d’appui/.test(x.titre));
  const gMent = fr.engagements.groupes.findIndex((g) => g.items.some((x) => /mentorat/i.test(x.titre)));
  const iMent = gMent >= 0 ? fr.engagements.groupes[gMent].items.findIndex((x) => /mentorat/i.test(x.titre)) : -1;
  const affiche = c.contact.liens.find((l) => /affiche|poster|póster|海报|ملصق/i.test(l[0] + l[1]));
  const s = {
    surtitre: T.surtitre,
    titre: T.titre,
    intro: T.intro,
    groupes: [
      { titre: T.groupes[0], items: iEns.map((i) => c.parcours.etapes[i]) },
      { titre: T.groupes[1], items: c.publications.groupes[0].items },
      { titre: T.groupes[2], items: [{ date: "2026", titre: T.affiche[0], detail: T.affiche[1], lien: affiche && (externe(affiche[2]) ? affiche[2] : c.chemin + affiche[2]) }] },
      { titre: T.groupes[3], items: [c.parcours.etapes[iAnap], iMent >= 0 ? c.engagements.groupes[gMent].items[iMent] : null].filter(Boolean) },
    ],
  };
  return sectionGroupes(c, s);
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
const BANDEAUX = { litterature: "bandeaux/ressources.jpg", representation: "photos/representation.jpg", communaute: "bandeaux/engagements.jpg", distinctions: "photos/distinctions.jpg" };
const bandeau = (s) => BANDEAUX[s] || "bandeaux/" + s + ".jpg";
// Références vérifiées (Crossref), communes à toutes les langues.
const REFS_NOTIONS = {
  autodetermination: [
    ["Wehmeyer, M. L. (2005). Self-determination and individuals with severe disabilities: Re-examining meanings and misinterpretations. Research and Practice for Persons with Severe Disabilities, 30(3), 113–120.", "https://doi.org/10.2511/rpsd.30.3.113"],
    ["Lachapelle, Y., Wehmeyer, M. L., Haelewyck, M.-C., Courbois, Y., Keith, K. D., Schalock, R., Verdugo, M. A., & Walsh, P. N. (2005). The relationship between quality of life and self-determination: An international study. Journal of Intellectual Disability Research, 49(10), 740–744.", "https://doi.org/10.1111/j.1365-2788.2005.00743.x"],
    ["Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist, 55(1), 68–78.", "https://doi.org/10.1037/0003-066X.55.1.68"],
  ],
  coconstruction: [
    ["Jull, J., Giles, A., & Graham, I. D. (2017). Community-based participatory research and integrated knowledge translation: Advancing the co-creation of knowledge. Implementation Science, 12, 150.", "https://doi.org/10.1186/s13012-017-0696-3"],
    ["Redman, S., Greenhalgh, T., Adedokun, L., Staniszewska, S., & Denegri, S. (2021). Co-production of knowledge: The future. BMJ, 372, n434.", "https://doi.org/10.1136/bmj.n434"],
  ],
  experientiels: [
    ["Borkman, T. (1976). Experiential knowledge: A new concept for the analysis of self-help groups. Social Service Review, 50(3), 445–456.", "https://doi.org/10.1086/643401"],
    ["Pomey, M.-P., Flora, L., Karazivan, P., Dumez, V., Lebel, P., Vanier, M.-C., Débarges, B., Clavel, N., & Jouet, E. (2015). Le « Montreal model » : enjeux du partenariat relationnel entre patients et professionnels de la santé. Santé Publique, S1(HS), 41–50.", "https://doi.org/10.3917/spub.150.0041"],
  ],
  epistemique: [
    ["Fricker, M. (2007). Epistemic injustice: Power and the ethics of knowing. Oxford University Press.", "https://doi.org/10.1093/acprof:oso/9780198237907.001.0001"],
    ["Jull, J., Giles, A., & Graham, I. D. (2017). Community-based participatory research and integrated knowledge translation: Advancing the co-creation of knowledge. Implementation Science, 12, 150.", "https://doi.org/10.1186/s13012-017-0696-3"],
  ],
};
const NOTIONS = {
  fr: { salle: ["Notions clés", "Autodétermination, coconstruction, savoirs expérientiels"], surtitre: "Transmission", titre: "Faire avec, et non faire pour", intro: "Quatre notions orientent ma manière de transférer les connaissances : elles placent les personnes concernées au cœur de la production et de l’usage des savoirs.", refs: "Pour aller plus loin",
    items: {
      autodetermination: ["Autodétermination", "Agir comme principal agent causal de sa propre vie : faire des choix et prendre des décisions sans influence externe indue. Le modèle fonctionnel de Wehmeyer en distingue quatre composantes : l’autonomie, l’autorégulation, l’empowerment psychologique et l’autoréalisation, c’est-à-dire une connaissance juste de soi, de ses forces et de ses limites, qui permet d’agir en conséquence. La théorie de Deci et Ryan y ajoute trois besoins fondamentaux : autonomie, compétence et appartenance."],
      coconstruction: ["Coconstruction", "Produire les connaissances avec les personnes concernées plutôt que pour elles : chercheurs, praticiens, gestionnaires, patients et citoyens partagent la définition des questions, l’interprétation des résultats et leur mise en œuvre. Faire avec augmente la pertinence des savoirs et leur appropriation par celles et ceux qui les utiliseront."],
      experientiels: ["Savoirs expérientiels", "Savoirs issus de l’expérience vécue de la maladie, du handicap, de la vulnérabilité ou du recours aux services. Distincts des savoirs scientifiques et professionnels, ils les complètent : le partenariat patient les reconnaît comme une expertise à part entière, dans le soin, l’enseignement et la recherche."],
      epistemique: ["Retour épistémique", "Restituer les connaissances produites aux personnes et aux communautés qui y ont contribué, sous une forme qu’elles peuvent s’approprier, et reconnaître la légitimité de leurs savoirs. C’est une exigence de justice épistémique : éviter que la parole de certains groupes soit discréditée, ou que leurs expériences restent sans mots pour être dites."],
    } },
  en: { salle: ["Key concepts", "Self-determination, co-construction, experiential knowledge"], surtitre: "Sharing knowledge", titre: "Doing with, not doing for", intro: "Four concepts guide the way I transfer knowledge: they place the people concerned at the heart of producing and using knowledge.", refs: "Further reading",
    items: {
      autodetermination: ["Self-determination", "Acting as the primary causal agent in one’s own life: making choices and decisions free from undue external influence. Wehmeyer’s functional model distinguishes four components: autonomy, self-regulation, psychological empowerment and self-realisation, that is, an accurate knowledge of oneself, one’s strengths and limits, which makes it possible to act accordingly. Deci and Ryan’s theory adds three basic needs: autonomy, competence and relatedness."],
      coconstruction: ["Co-construction", "Producing knowledge with the people concerned rather than for them: researchers, practitioners, managers, patients and citizens share in framing the questions, interpreting the results and putting them into practice. Doing with increases the relevance of knowledge and its ownership by those who will use it."],
      experientiels: ["Experiential knowledge", "Knowledge that comes from lived experience of illness, disability, vulnerability or service use. Distinct from scientific and professional knowledge, it complements them: patient partnership recognises it as expertise in its own right, in care, teaching and research."],
      epistemique: ["Epistemic return", "Returning the knowledge produced to the people and communities who contributed to it, in a form they can make their own, and recognising the legitimacy of their knowledge. It is a requirement of epistemic justice: preventing some groups’ testimony from being discredited, or their experiences from lacking the words to be expressed."],
    } },
  es: { salle: ["Nociones clave", "Autodeterminación, coconstrucción, saberes experienciales"], surtitre: "Transmisión", titre: "Hacer con, y no hacer por", intro: "Cuatro nociones orientan mi manera de transferir conocimientos: sitúan a las personas concernidas en el centro de la producción y del uso de los saberes.", refs: "Para profundizar",
    items: {
      autodetermination: ["Autodeterminación", "Actuar como principal agente causal de la propia vida: tomar decisiones sin influencia externa indebida. El modelo funcional de Wehmeyer distingue cuatro componentes: la autonomía, la autorregulación, el empoderamiento psicológico y la autorrealización, es decir, un conocimiento ajustado de uno mismo, de sus fortalezas y de sus límites, que permite actuar en consecuencia. La teoría de Deci y Ryan añade tres necesidades básicas: autonomía, competencia y vinculación."],
      coconstruction: ["Coconstrucción", "Producir los conocimientos con las personas concernidas y no para ellas: investigadores, profesionales, gestores, pacientes y ciudadanos comparten la definición de las preguntas, la interpretación de los resultados y su puesta en práctica. Hacer con aumenta la pertinencia de los saberes y su apropiación por quienes los utilizarán."],
      experientiels: ["Saberes experienciales", "Saberes nacidos de la experiencia vivida de la enfermedad, la discapacidad, la vulnerabilidad o el uso de los servicios. Distintos de los saberes científicos y profesionales, los complementan: la colaboración con pacientes los reconoce como una pericia propia, en el cuidado, la enseñanza y la investigación."],
      epistemique: ["Retorno epistémico", "Devolver los conocimientos producidos a las personas y comunidades que contribuyeron a ellos, en una forma que puedan apropiarse, y reconocer la legitimidad de sus saberes. Es una exigencia de justicia epistémica: evitar que la palabra de algunos grupos sea desacreditada o que sus experiencias carezcan de palabras para ser dichas."],
    } },
  zh: { salle: ["关键概念", "自我决定、共同建构、经验性知识"], surtitre: "知识传递", titre: "与人们一起做，而不是替人们做", intro: "四个概念引导我转化知识的方式：它们让相关人士处于知识生产与运用的中心。", refs: "延伸阅读",
    items: {
      autodetermination: ["自我决定", "作为自己生活的主要行动者：在不受不当外部影响的情况下作出选择和决定。Wehmeyer 的功能模型区分了四个组成部分：自主、自我调节、心理赋权与自我实现，即对自身、自身优势与局限的准确认识，从而能够据此行动。Deci 与 Ryan 的理论补充了三种基本需要：自主、胜任与归属。"],
      coconstruction: ["共同建构", "与相关人士一起而不是替他们生产知识：研究者、实践者、管理者、患者与公民共同界定问题、解读结果并付诸实施。一起做能够提高知识的相关性，也让使用知识的人更好地把握知识。"],
      experientiels: ["经验性知识", "来自疾病、残障、脆弱处境或使用服务之亲身经历的知识。它不同于科学知识与专业知识，并与之互补：患者伙伴关系将其视为在照护、教学与研究中的独立专长。"],
      epistemique: ["认识回馈", "把所产生的知识以对方能够掌握的形式回馈给参与其中的人们与社群，并承认他们知识的正当性。这是认识正义的要求：避免某些群体的话语遭到贬低，或其经历缺乏被表达的语言。"],
    } },
  ar: { salle: ["مفاهيم أساسية", "تقرير المصير والبناء المشترك والمعارف التجريبية"], surtitre: "نقل المعرفة", titre: "العمل مع الناس لا من أجلهم", intro: "أربعة مفاهيم توجّه طريقتي في نقل المعارف: فهي تضع الأشخاص المعنيين في قلب إنتاج المعارف واستخدامها.", refs: "للتعمق",
    items: {
      autodetermination: ["تقرير المصير", "أن يكون المرء الفاعل الرئيسي في حياته: أن يختار ويقرر دون تأثير خارجي غير مبرر. يميّز النموذج الوظيفي لويمير أربعة مكوّنات: الاستقلالية، والتنظيم الذاتي، والتمكين النفسي، وتحقيق الذات، أي معرفة دقيقة بالنفس وبمواطن قوتها وحدودها تتيح التصرف وفقًا لذلك. وتضيف نظرية ديسي ورايان ثلاث حاجات أساسية: الاستقلالية والكفاءة والانتماء."],
      coconstruction: ["البناء المشترك", "إنتاج المعارف مع الأشخاص المعنيين لا من أجلهم: يشترك الباحثون والممارسون والمديرون والمرضى والمواطنون في تحديد الأسئلة وتفسير النتائج وتطبيقها. فالعمل المشترك يزيد من ملاءمة المعارف ومن تملّكها لدى من سيستخدمونها."],
      experientiels: ["المعارف التجريبية", "معارف نابعة من التجربة المعيشة للمرض أو الإعاقة أو الهشاشة أو اللجوء إلى الخدمات. وهي متميزة عن المعارف العلمية والمهنية ومكمّلة لها: فالشراكة مع المرضى تعترف بها خبرةً قائمة بذاتها في الرعاية والتعليم والبحث."],
      epistemique: ["الإرجاع المعرفي", "إعادة المعارف المنتَجة إلى الأشخاص والمجتمعات التي أسهمت فيها، بصيغة يستطيعون تملّكها، والاعتراف بمشروعية معارفهم. إنه مقتضى من مقتضيات العدالة المعرفية: تجنّب أن تُستخفّ شهادة بعض الفئات، أو أن تبقى تجاربهم بلا كلمات تعبّر عنها."],
    } },
};
const textesNotions = (c) => NOTIONS[c.lang] || NOTIONS.en;
function sectionNotions(c) {
  const N = textesNotions(c);
  const carte = (k) => `<article class="groupe-carte carte-notion"><div class="groupe-corps"><h3 class="titre-bloc">${e(N.items[k][0])}</h3><p>${e(N.items[k][1])}</p><p class="notion-refs-titre">${e(N.refs)}</p><ul class="notion-refs">${REFS_NOTIONS[k].map(([t, u]) => `<li>${e(t)} <a href="${u}" rel="noopener">${e(u.replace("https://doi.org/", "doi:"))}</a></li>`).join("")}</ul></div></article>`;
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(N.surtitre)}</p>
<h2>${e(N.titre)}</h2>
<p class="intro">${e(N.intro)}</p>
</div>
<div class="colonne-outils"><div class="groupes-grille">${Object.keys(N.items).map(carte).join("")}</div></div>
</div>`;
}
const OUTILS = {
  fr: { salle: ["Outils numériques", "OWNNIGHT et les Sphères"], surtitre: "Transmission", titre: "Des outils pour apprendre et prendre soin", intro: "Deux réalisations numériques prolongent mon travail de transfert des connaissances : rendre des savoirs exigeants accessibles, au rythme de chacun.", etiquettes: ["Ce que c’est", "Le but", "La lacune comblée"],
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
  en: { salle: ["Digital tools", "OWNNIGHT and the Spheres"], surtitre: "Sharing knowledge", titre: "Tools for learning and caring", intro: "Two digital projects extend my knowledge transfer work: making demanding knowledge accessible, at each person’s own pace.", etiquettes: ["What it is", "The aim", "The gap it fills"],
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
  es: { salle: ["Herramientas digitales", "OWNNIGHT y las Esferas"], surtitre: "Transmisión", titre: "Herramientas para aprender y cuidarse", intro: "Dos proyectos digitales prolongan mi trabajo de transferencia de conocimientos: hacer accesibles saberes exigentes, al ritmo de cada persona.", etiquettes: ["Qué es", "El objetivo", "La carencia que cubre"],
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
  zh: { salle: ["数字工具", "OWNNIGHT 与 Sphères"], surtitre: "知识传递", titre: "用于学习与自我照护的工具", intro: "两个数字项目延续了我的知识转化工作：让高要求的知识变得易于获取，并按照每个人的节奏进行。", etiquettes: ["是什么", "目标", "填补的空白"],
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
  ar: { salle: ["الأدوات الرقمية", "OWNNIGHT وتطبيقات Sphères"], surtitre: "نقل المعرفة", titre: "أدوات للتعلّم وللعناية بالذات", intro: "مشروعان رقميان يمدّان عملي في نقل المعارف: جعل معارف متطلّبة في متناول الجميع، وفق إيقاع كل شخص.", etiquettes: ["ما هو", "الهدف", "الفجوة التي يسدّها"],
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
const TEXTES_GROUPES = {
  fr: { ressources: ["Ressources","Lectures, articles, capsules et balados"], recherche: ["Recherche", "Thèse, approche, recherche en cours et publications"], parcours: ["Parcours", "Biographie, expériences et valeurs"] },
  en: { ressources: ["Resources","Readings, articles, videos and podcasts"], recherche: ["Research", "Thesis, approach, research in progress and publications"], parcours: ["Background", "Biography, experience and values"] },
  es: { ressources: ["Recursos","Lecturas, artículos, cápsulas y pódcasts"], recherche: ["Investigación", "Tesis, enfoque, investigación en curso y publicaciones"], parcours: ["Trayectoria", "Biografía, experiencia y valores"] },
  zh: { ressources: ["资源","阅读文献、文章、视频与播客"], recherche: ["研究", "博士论文、研究取向、在研工作与发表成果"], parcours: ["经历", "个人简介、经历与价值观"] },
  ar: { ressources: ["الموارد","قراءات ومقالات ومقاطع فيديو وبودكاست"], recherche: ["البحث", "الأطروحة والمقاربة والبحث الجاري والمنشورات"], parcours: ["المسار", "السيرة والخبرات والقيم"] },
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
  fr: '<svg viewBox="0 0 24 16"><path fill="#003da5" d="M0 0h24v16H0z"/><path fill="#fff" d="M10 0h4v16h-4zM0 6h24v4H0z"/><path fill="#fff" d="M5 1.4c.5.5.6 1.1.3 1.7.5-.3 1-.2 1.2.3-.4 0-.7.2-.9.5h-1.2c-.2-.3-.5-.5-.9-.5.2-.5.7-.6 1.2-.3-.3-.6-.2-1.2.3-1.7zM4.1 3.9h1.8v.4h-1.8zM19 1.4c.5.5.6 1.1.3 1.7.5-.3 1-.2 1.2.3-.4 0-.7.2-.9.5h-1.2c-.2-.3-.5-.5-.9-.5.2-.5.7-.6 1.2-.3-.3-.6-.2-1.2.3-1.7zM18.1 3.9h1.8v.4h-1.8zM5 11.4c.5.5.6 1.1.3 1.7.5-.3 1-.2 1.2.3-.4 0-.7.2-.9.5h-1.2c-.2-.3-.5-.5-.9-.5.2-.5.7-.6 1.2-.3-.3-.6-.2-1.2.3-1.7zM4.1 13.9h1.8v.4h-1.8zM19 11.4c.5.5.6 1.1.3 1.7.5-.3 1-.2 1.2.3-.4 0-.7.2-.9.5h-1.2c-.2-.3-.5-.5-.9-.5.2-.5.7-.6 1.2-.3-.3-.6-.2-1.2.3-1.7zM18.1 13.9h1.8v.4h-1.8z"/></svg>',
  gb: '<svg viewBox="0 0 32 16"><path fill="#d52b1e" d="M0 0h8v16H0zM24 0h8v16h-8z"/><path fill="#fff" d="M8 0h16v16H8z"/><path fill="#d52b1e" d="M16 2.2l1 1.9 1-.5-.4 2.7 1.4-1.4.3.8 1.6-.3-.5 1.6.7.3-2.4 2 .3.9-2.4-.4v2.4h-.4v-2.4l-2.4.4.3-.9-2.4-2 .7-.3-.5-1.6 1.6.3.3-.8 1.4 1.4-.4-2.7 1 .5z"/></svg>',
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

const IMAGES_GROUPES = { recherche: "recherche.jpg", implantation: "expertise.jpg", parcours: "biographie.jpg", engagements: "engagements.jpg", ressources: "ressources.jpg", contact: "contact.jpg" };
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
  implantation: ["#a0663b", "#7a4a26"],
  biographie: ["#2f6f86", "#1f4f62"],
  publications: ["#327a66", "#1f5446"],
  parcours: ["#9a7448", "#6c4f2e"],
  engagements: ["#5d6585", "#40465f"],
  conceptualisation: ["#3f6f8f", "#2c5068"],
  valeurs: ["#7a5a8c", "#5a4068"],
  ressources: ["#2f7f86", "#215c61"],
  transmission: ["#5f7f35", "#43592a"],
  notions: ["#7a4f9a", "#563870"],
  outils: ["#2f3f7a", "#1c2650"],
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
  const [titre, legende] = texteGroupe(c, nom);
  const [c1, c2] = TEINTES_GROUPES[nom] || TEINTES[nom];
  const image = IMAGES_GROUPES[nom];
  const fond = image ? ` style="background-image:url(${c.chemin}assets/portes/${image}?v=${empreinte("assets/portes/" + image)})"` : "";
  return `<button class="porte${image ? "" : " porte-contact"}" type="button" data-salle="${nom}" data-sections="${sections.join(" ")}" data-titre="${e(titre)}" style="--c1:${c1};--c2:${c2}" aria-label="${num(i)}. ${e(titre)}${deuxPoints(c)} ${e(legende)}">
<span class="baie" aria-hidden="true"><span class="ouverture"><span class="apercu">${e(c.ui.entrer)}</span><span class="battant"><span class="vignette"${fond}></span><span class="poignee"></span></span></span></span>
<span class="porte-texte" aria-hidden="true"><span class="plaque"><span class="num">${num(i)}</span>${e(titre)}</span><span class="legende">${e(legende)}</span>${sections.length > 1 ? `<span class="sous-portes">${sections.map((s) => `<span data-sous="${s}" style="--c1:${TEINTES[s][0]}">${e(c.hall.portes[s][0])}</span>`).join("")}</span>` : ""}<span class="entrer">${e(c.ui.entrer)} →</span></span>
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
<ol class="trajectoire">${[...B.etapes].reverse().map(([quand, quoi, ic], i) => `<li style="--rang:${i}"><span class="trajectoire-date">${e(quand)}</span><span class="trajectoire-texte">${e(quoi)}</span></li>`).join("")}</ol>
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
  return `<div class="section-corps pleine">
<div class="colonne-texte">
<p class="surtitre">${e(r.surtitre)}</p>
<p class="badge-these">${e(r.etiquette)}</p>
<h2>${e(r.titre)}</h2>
<p class="sous-titre">${e(r.sousTitre)}</p>
<p class="intro">${e(r.question)}</p>
<p>${e(r.but)}</p>
<ul class="faits">${r.faits.map(([k, v], i) => `<li><b>${e(k)}</b><span>${valeur(v)}${i === r.faits.findIndex(([, x]) => /B2/.test(x)) ? ` <a class="doi" href="https://doi.org/10.69777/2009461">DOI 10.69777/2009461</a>` : ""}</span></li>`).join("")}</ul>
<figure class="logos-recherche"><img src="${c.chemin}assets/logos-recherche.png?v=${empreinte("assets/logos-recherche.png")}" alt="Chaire de recherche GSK en gestion optimale des maladies chroniques · Fonds de recherche du Québec · CRCHUM · ESPUM · Université de Montréal" loading="lazy"></figure>
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

function schemaDiscours([social, discursive, texte], titre) {
  return `<svg class="schema-discours" viewBox="0 0 520 300" role="img" aria-label="${e(titre)}"><rect x="6" y="6" width="508" height="288" rx="18" class="niveau-1"/><rect x="46" y="62" width="428" height="202" rx="14" class="niveau-2"/><rect x="128" y="134" width="264" height="90" rx="12" class="niveau-3"/><text x="260" y="38" text-anchor="middle">${e(social)}</text><text x="260" y="98" text-anchor="middle">${e(discursive)}</text><text x="260" y="186" text-anchor="middle" class="centre">${e(texte)}</text></svg>`;
}

function sectionApproche(c) {
  const a = c.approche;
  return `<div class="section-corps pleine large">
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
<h3 class="titre-bloc">${e(a.methodes.titre)}</h3>
<div class="methodes">${a.methodes.items.map((m) => `<article class="methode"><div class="methode-texte"><h4>${e(m.titre)}</h4><p>${e(m.texte)}</p><ul class="methode-refs">${m.references.map((x) => `<li>${lienFinal(x)}</li>`).join("")}</ul></div><div class="methode-figures">${m.illustrations.map((il) => `<figure>${il.schema ? schemaDiscours(il.schema, il.legende) : `<a href="${e(il.page)}" target="_blank" rel="noopener"><img src="${e(il.src)}" alt="${e(il.legende)}" loading="lazy" referrerpolicy="no-referrer"></a>`}<figcaption>${e(il.legende)} <span class="source">${e(il.credit)}</span></figcaption></figure>`).join("")}</div></article>`).join("")}</div>
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
${cartes(m.plan)}
${cartes(m.cadres)}
<details class="biblio"><summary>${e(m.bibliographie.titre)}</summary><ol>${m.bibliographie.items.map((r) => `<li>${lienDoi(r)}</li>`).join("")}</ol></details>
</div>
</div>
`;
}

function sectionBiographie(c) {
  const b = c.biographie;
  return `<div class="section-corps pleine">
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

const PHOTOS_ENGAGEMENTS = ["representation", null, "distinctions", null, null];
const PHOTOS_LOISIRS = ["course", "musique", null, null, null];
const photo = (c, nom, alt = "") => `<img class="photo-groupe" src="${c.chemin}assets/photos/${nom}.jpg?v=${empreinte("assets/photos/" + nom + ".jpg")}" alt="${e(alt)}" width="800" height="457" loading="lazy">`;

function sectionEngagements(c, sous) {
  const s = c.engagements;
  const kSous = INDEX_ENGAGEMENTS[sous];
  const groupes = s.groupes
    .map((g, k) => {
      if (k !== kSous) return "";
      const tete = `<h3 class="titre-bloc titre-icone">${e(g.titre)}<span class="compte">${g.items.length}</span></h3>`;
      if (k === s.groupes.length - 1)
        return `<div class="groupe-large">${tete}<div class="loisirs">${g.items
          .map((it, i) => `<figure class="loisir${PHOTOS_LOISIRS[i] ? "" : " sans-photo"}">${PHOTOS_LOISIRS[i] ? photo(c, PHOTOS_LOISIRS[i], it.titre) : ""}<figcaption><span>${e(it.date)}</span><strong>${e(it.titre)}</strong>${it.detail ? `<small>${e(it.detail)}</small>` : ""}</figcaption></figure>`)
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
<div class="colonne-outils"><div class="groupes-grille">${s.groupes.map((g) => `<article class="groupe-carte"><div class="groupe-corps"><h3 class="titre-bloc titre-icone">${e(g.titre)}<span class="compte">${g.items.length}</span></h3>${liste(g.items)}</div></article>`).join("")}</div></div>
</div>`;
}

const RESSOURCES = JSON.parse(fs.readFileSync(path.join(__dirname, "ressources-donnees.json"), "utf8"));
const lienFinal = (s) => e(s).replace(/(https?:\/\/\S+?)(\.?)$/, (u, url, point) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>${point}`);

function sectionConceptualisation(c) {
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
    `<ol class="lectures">${arr.map((x) => `<li><span class="lecture-auteurs">${e(x.auteurs)} (${e(x.annee)})</span> ${x.lien ? lien(x.lien, e(x.titre)) : e(x.titre)} <span class="type">${e(x.type)}</span></li>`).join("")}</ol>`;
  return `<div class="section-corps pleine">
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
    .map(([t, d], i) => `<article class="valeur v${i % 6}"><span class="valeur-num">${num(i)}</span><h4>${e(t)}</h4><p>${e(d)}</p></article>`)
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
${ici === "falc" ? `<span aria-current="page" lang="fr"><img class="logo-falc" src="${c.chemin}assets/logo-falc-mini.jpg" alt="" width="22" height="22"><span>${e(u.falc)}</span></span>` : `<a href="${c.chemin}falc/" lang="fr"><img class="logo-falc" src="${c.chemin}assets/logo-falc-mini.jpg" alt="" width="22" height="22"><span>${e(u.falc)}</span></a>`}
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
    sameAs: [c.contact.liens.find((l) => l[0] === "ORCID")[2]],
  };
  c.hall.portes.transmission = textesTransmission(c).salle;
  c.hall.portes.notions = textesNotions(c).salle;
  c.hall.portes.outils = textesOutils(c).salle;
  poserSousPortes(c);
  const sections = {
    recherche: sectionRecherche(c),
    approche: sectionApproche(c),
    implantation: sectionImplantation(c),
    transmission: sectionTransmission(c),
    notions: sectionNotions(c),
    outils: sectionOutils(c),
    publications: sectionGroupes(c, c.publications, "", ICONES_GROUPES.publications),
    biographie: sectionBiographie(c),
    parcours: sectionParcours(c),
    conceptualisation: sectionConceptualisation(c),
    valeurs: sectionValeurs(c),
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
<a class="marque" href="${p || "./"}"><span class="marque-mono" aria-hidden="true"><span class="mono-grand">E</span><span class="mono-petit">rj</span><span class="mono-grand">B</span></span><span><strong>Éric Bernier</strong><small>${e(c.ui.sousTitre)}</small></span></a>
<p class="coordonnees coordonnees-haut"><a href="mailto:${e(c.contact.courriel)}">${icone("enveloppe")}${e(c.contact.courriel)}</a><a href="tel:${TELEPHONE[1]}">${icone("telephone")}${TELEPHONE[0]}</a></p>
<nav class="nav" aria-label="${e(c.ui.navigation)}">${GROUPES.map(([g, ss]) => `<a href="#${ss[0] || g}">${e(texteGroupe(c, g)[0])}</a>`).join("")}</nav>
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
<div class="hall-tete"><span>${e(c.hall.titre)}</span><span>${e(c.hall.compte.replace(/\d+/, GROUPES.length))}</span></div>
<div class="portes">${GROUPES.map((g, i) => porte(c, g, i)).join("")}</div>
<div class="hall-pied"><span>${e(c.hall.consigne)}</span></div>
</div>
${bandeAccueil(c)}
</section>

${SALLES.map(
  (s, i) => `<section class="section${i % 2 ? " teinte" : ""}" id="${s}" data-salle="${s}" data-titre="${e(c.hall.portes[s][0])}">
<div class="section-contenu" data-numero="${NUMS[s]}" data-mini="${p}assets/portes-mini/${s}.jpg?v=${empreinte("assets/portes-mini/" + s + ".jpg")}">
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
<nav class="salle-onglets" aria-label="${e(c.hall.titre)}" hidden></nav>
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
<a class="marque" href="../"><span class="marque-mono" aria-hidden="true"><span class="mono-grand">E</span><span class="mono-petit">rj</span><span class="mono-grand">B</span></span><span><strong>Éric Bernier</strong><small>${e(fr.ui.sousTitre)}</small></span></a>
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
<p class="logo-falc-bloc"><img src="../assets/logo-falc.jpg" width="80" height="79" alt="Logo européen Facile à lire"></p>
<p class="actions-ecoute">${ecouter("contenu", a.ecouterTout)}<button type="button" class="bouton-ecouter" data-arreter hidden>${e(fr.ui.arreter)}</button></p>
${a.blocs.map(bloc).join("\n")}
<p class="credit-falc">© European Easy-to-Read Logo: Inclusion Europe. Plus d’informations : <a href="https://www.easy-to-read.eu" target="_blank" rel="noopener">www.easy-to-read.eu</a></p>
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
