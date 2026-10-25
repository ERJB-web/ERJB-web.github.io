"use strict";
// Gabarit unique des salles : bandeau, tuiles de chapitres illustrées, chapitres pleine largeur et barre de lecture.
// Le découpage suit REGLES ; une salle sans règle est découpée par ses intertitres h3.
(() => {
  const D = document, racine = D.documentElement;
  const $ = (s, r = D) => r.querySelector(s);
  const $$ = (s, r = D) => Array.from(r.querySelectorAll(s));
  const langue = "fr";
  const CHEMIN = racine.dataset.racine || "./";
  const calme = matchMedia("(prefers-reduced-motion: reduce)");
  const deux = (n) => String(n).padStart(2, "0");

  const TEXTES = {
    fr: { chapitres: (n) => `${n} chapters`, minutes: (m) => `≈ ${m} min read`, programme: "The chapters in this room", aide: "Tap a tile to go directly to the chapter", chapitre: (i, n) => `Chapter ${i} of ${n}`, tous: "All chapters", precedent: "Previous chapter", suivant: "Next chapter", dans: "In this chapter", photo: "Photo", porte: "Door", aller: (t) => `Go to chapter: ${t}`, afficher: (n) => `Show the ${n} references` },
    en: { chapitres: (n) => `${n} chapters`, minutes: (m) => `≈ ${m} min read`, programme: "Chapters in this room", aide: "Select a tile to go straight to a chapter", chapitre: (i, n) => `Chapter ${i} of ${n}`, tous: "All chapters", precedent: "Previous chapter", suivant: "Next chapter", dans: "In this chapter", photo: "Photo", porte: "Door", aller: (t) => `Go to chapter: ${t}`, afficher: (n) => `Show the ${n} references` },
    es: { chapitres: (n) => `${n} capítulos`, minutes: (m) => `≈ ${m} min de lectura`, programme: "Capítulos de esta sala", aide: "Toque una tarjeta para ir directamente al capítulo", chapitre: (i, n) => `Capítulo ${i} de ${n}`, tous: "Todos los capítulos", precedent: "Capítulo anterior", suivant: "Capítulo siguiente", dans: "En este capítulo", photo: "Foto", porte: "Puerta", aller: (t) => `Ir al capítulo: ${t}`, afficher: (n) => `Mostrar las ${n} referencias` },
    zh: { chapitres: (n) => `${n} 章`, minutes: (m) => `约 ${m} 分钟阅读`, programme: "本展厅的章节", aide: "点击卡片即可直达该章", chapitre: (i, n) => `第 ${i} 章，共 ${n} 章`, tous: "全部章节", precedent: "上一章", suivant: "下一章", dans: "本章内容", photo: "图片", porte: "门", aller: (t) => `前往章节：${t}`, afficher: (n) => `显示 ${n} 条文献` },
    ar: { chapitres: (n) => `${n} فصول`, minutes: (m) => `≈ ${m} دقيقة قراءة`, programme: "فصول هذه القاعة", aide: "اختر بطاقة للانتقال مباشرة إلى الفصل", chapitre: (i, n) => `الفصل ${i} من ${n}`, tous: "كل الفصول", precedent: "الفصل السابق", suivant: "الفصل التالي", dans: "في هذا الفصل", photo: "صورة", porte: "الباب", aller: (t) => `الانتقال إلى الفصل: ${t}`, afficher: (n) => `عرض المراجع (${n})` },
    ru: { chapitres: (n) => `Глав: ${n}`, minutes: (m) => `≈ ${m} мин чтения`, programme: "Главы этого зала", aide: "Нажмите на плитку, чтобы перейти к главе", chapitre: (i, n) => `Глава ${i} из ${n}`, tous: "Все главы", precedent: "Предыдущая глава", suivant: "Следующая глава", dans: "В этой главе", photo: "Фото", porte: "Дверь", aller: (t) => `Перейти к главе: ${t}`, afficher: (n) => `Показать источники (${n})` },
  };
  const T = TEXTES[langue] || TEXTES.fr;

  // Couleurs de la Chaire, en alternance sur les tuiles et les chapitres.
  const COULEURS = ["#0879BE", "#11A7A5", "#5AAE38", "#0755AD", "#0D2A3A", "#0E8F8D", "#3F8F2A", "#1C6FB8"];

  // Découpage des salles qui ne sont pas organisées en rubriques.
  const VITRINE = { sel: "article.carte-vitrine", titre: "h3" };
  const REGLES = {
    axes: { unique: true },
    publications: { sel: "section.publication-bloc", titre: ".publication-titre, h3" },
    methodes: { sel: "article.methode", titre: "h4" },
    vulgarisation: { sel: "article.vul-dossier-chapitre", titre: "h3" },
    outils: { sel: "article.projet", titre: ".projet-tete h3, h3" },
    biographie: { sel: "ol.recit > li", titre: "h3" },
    juriste: VITRINE, gestionnaire: { unique: true }, educateur: VITRINE, entrepreneuriat: { unique: true },
    valeurs: { unique: true },
    representation: { unique: true }, communaute: { unique: true }, distinctions: { unique: true }, citoyen: { unique: true },
    loisirs: { unique: true },
    logiciels: { sel: ".logiciels-chapitre", titre: ".ressources-chapitre-titre" },
    litterature: { sel: "section.rg-articles, details.lecture-theme", titre: "h3.rg-titre, summary" },
    grise: { sel: "section.rg", titre: "h3.rg-titre" },
    presse: { unique: true }, capsules: { unique: true }, balados: { unique: true },
  };

  const net = (t) => (t || "").replace(/\s+/g, " ").trim();
  const normaliser = (t) => net(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  // Titre sans compteur ni flèche : « Lectures 692 » → « Lectures ».
  function texteTitre(el) {
    if (!el) return "";
    const copie = el.cloneNode(true);
    $$(".compte, .rg-compte, .lecture-theme-compte, svg, [aria-hidden=true]", copie).forEach((x) => x.remove());
    return net(copie.textContent).replace(/\s*↗\s*$/, "").replace(/\s+\d+$/, "").replace(/[\s·:–—-]+$/, "").trim();
  }

  // ---------- Catalogue d'images ----------
  const CATALOGUE = (window.CATALOGUE_CHAPITRES && window.CATALOGUE_CHAPITRES.images) || [];
  const parTitre = new Map();
  CATALOGUE.forEach((im) => Object.values(im.titres || {}).forEach((t) => parTitre.set(`${im.salle}|${normaliser(t)}`, im)));
  const VIDES = new Set("de des du la le les et en un une pour par dans sur au aux a l d the of and in for to with on y el los las con para por".split(" "));
  const mots = (t) => normaliser(t).split(" ").filter((m) => m.length > 2 && !VIDES.has(m));
  function accord(motsChapitre, image) {
    const cles = (image.mots || []).flatMap((m) => mots(m));
    let score = 0;
    motsChapitre.forEach((m) => { if (cles.some((c) => c === m || (m.length > 4 && c.length > 4 && (c.startsWith(m.slice(0, 5)) || m.startsWith(c.slice(0, 5)))))) score++; });
    return score;
  }
  const urlImage = (im) => new URL(`${CHEMIN}assets/chapitres/${im.fichier}`, D.baseURI).href;
  const urlVignette = (im) => new URL(`${CHEMIN}assets/chapitres/v/${im.fichier}`, D.baseURI).href;
  function choisirImage(ch, salle, porte, prises, photoSalle) {
    // La vignette du chapitre de transfert doit illustrer une rencontre scientifique,
    // sans remplacer le document MSSS conservé dans le contenu du chapitre.
    if (salle === "recherche" && ch.cle === "transfert")
      return { url: absolue(`${CHEMIN}assets/portes/transfert-congres.jpg`) };
    if (salle === "transmission" && ch.cle === "enseignement-0") {
      const photo = CATALOGUE.find(im => im.fichier === "parcours-03.webp");
      if (photo) return { url: urlImage(photo), image: photo };
    }
    const explicite = ch.source?.dataset?.image;
    if (explicite === "aucune") return { url: "" };
    if (explicite) return { url: absolue(explicite) };
    const connue = parTitre.get(`${salle}|${normaliser(ch.titre)}`);
    if (connue && !prises.has(connue.fichier)) return { url: urlImage(connue), image: connue };
    const interne = ch.photoInterne;
    if (interne) return { url: interne, interne: true };
    const m = mots(`${ch.titre} ${ch.extrait || ""}`);
    let meilleure = null, note = 0;
    CATALOGUE.forEach((im) => {
      if (prises.has(im.fichier)) return;
      const s = accord(m, im) + (im.salle === salle ? 0.5 : 0) + (im.porte && im.porte === porte ? 0.25 : 0);
      if (s > note) { note = s; meilleure = im; }
    });
    if (meilleure && note >= 1) return { url: urlImage(meilleure), image: meilleure };
    const reserve = CATALOGUE.find((im) => !im.salle && !prises.has(im.fichier) && (!im.porte || im.porte === porte));
    if (reserve) return { url: urlImage(reserve), image: reserve };
    return { url: photoSalle };
  }

  // ---------- Découpage ----------
  const salleDuNumero = new Map();
  $$("section.section[data-salle] > .section-contenu").forEach((sc) => salleDuNumero.set(sc.dataset.numero, sc.parentElement.dataset.salle));
  const salleDe = (sc) => sc.dataset.gabSalle || sc.closest("[data-salle]")?.dataset.salle || salleDuNumero.get(sc.dataset.numero) || "";
  const porteDe = (salle) => $$(".porte").find((p) => (p.dataset.sections || "").split(" ").includes(salle));

  // Dans cette salle, transfert, implantation et vulgarisation sont trois
  // démarches distinctes. On conserve les contenus existants, en déplaçant
  // les cadres d'implantation dans leur propre chapitre.
  function preparerChapitresImplantation(sc, table) {
    const transfert = $(":scope > .chapitre-source[data-rubrique='implantation-reperes']", table);
    if (!transfert || transfert.dataset.chapitresDistincts) return;
    const textes = {
      fr: ["From knowledge to practices and publics", "Knowledge transfer", "Implantation", "Vulgarisation scientifique",
        "Knowledge transfer organizes the exchange, mobilization and use of knowledge among research, people and the settings concerned. On its own, it does not guarantee the sustained adoption of a practice.",
        "Implementation examines the conditions under which an intervention or practice is adopted, adapted, implemented and sustained. It draws on its own frameworks, strategies and evaluation criteria.",
        "Science outreach aims to make research understandable and open to discussion for non-specialist audiences, while retaining its nuances, limitations and uncertainties.",
        "Explore implementation science", "Explore science communication",
        "Three complementary but distinct approaches: transferring knowledge, implementing practices and making science accessible."],
      en: ["From knowledge to practice and public dialogue", "Knowledge translation", "Implementation", "Science outreach",
        "Knowledge translation organises the exchange and use of evidence among research, people and practice settings. On its own, it does not ensure the sustained adoption of a practice.",
        "Implementation examines how an intervention or practice is adopted, adapted, delivered and sustained in context, using its own frameworks, strategies and evaluation outcomes.",
        "Science outreach makes research accessible to non-specialist audiences while retaining its nuances, limitations and uncertainties.",
        "Explore implementation science", "Explore science outreach",
        "Three complementary but distinct approaches: knowledge translation, implementation and science outreach."],
      es: ["Del conocimiento a la práctica y al diálogo", "Transferencia de conocimientos", "Implementación", "Divulgación científica",
        "La transferencia organiza el intercambio y el uso del conocimiento entre la investigación, las personas y los entornos de práctica; no garantiza por sí sola la adopción sostenible de una práctica.",
        "La implementación estudia cómo se adopta, adapta, aplica y mantiene una intervención en su contexto, mediante marcos, estrategias y resultados propios.",
        "La divulgación hace comprensible la investigación para públicos no especializados, sin ocultar matices, límites ni incertidumbres.",
        "Explorar la ciencia de la implementación", "Explorar la divulgación científica",
        "Tres enfoques complementarios, pero distintos: transferencia de conocimientos, implementación y divulgación científica."],
      zh: ["从知识到实践与公众对话", "知识转化", "实施科学", "科学普及",
        "知识转化促进研究者、公众及实践机构之间的知识交流与应用，但本身不能保证实践得到持续采纳。",
        "实施科学研究干预或实践在特定情境中如何被采纳、调整、执行和维持，并采用专门的框架、策略和评价指标。",
        "科学普及让非专业公众理解并讨论研究，同时保留其细微差别、局限性与不确定性。",
        "深入了解实施科学", "探索科学普及",
        "三种相互补充却各不相同的工作：知识转化、实践实施与科学普及。"],
      ar: ["من المعرفة إلى الممارسة والحوار العام", "نقل المعارف", "التنفيذ", "التبسيط العلمي",
        "يساعد نقل المعارف على تبادل المعرفة واستخدامها بين البحث والأشخاص وبيئات الممارسة، لكنه لا يضمن وحده تبني الممارسات بصورة مستدامة.",
        "يدرس علم التنفيذ كيفية تبني التدخلات وتكييفها وتطبيقها واستدامتها في سياقاتها، باستخدام أطر واستراتيجيات ومؤشرات تقييم خاصة.",
        "يجعل التبسيط العلمي نتائج البحث مفهومة للجمهور غير المتخصص مع الحفاظ على دقائقها وحدودها وأوجه عدم اليقين.",
        "استكشاف علم التنفيذ", "استكشاف التبسيط العلمي",
        "ثلاث مقاربات متكاملة ولكن مختلفة: نقل المعرفة والتنفيذ والتبسيط العلمي."],
      ru: ["От знаний к практике и общественному диалогу", "Передача знаний", "Внедрение", "Популяризация науки",
        "Передача знаний организует обмен и использование научных результатов исследователями, людьми и практическими организациями, но сама по себе не гарантирует устойчивое внедрение.",
        "Наука о внедрении изучает принятие, адаптацию, реализацию и устойчивость вмешательств в конкретных условиях, используя собственные модели, стратегии и показатели.",
        "Популяризация науки делает исследования понятными широкой аудитории, сохраняя нюансы, ограничения и неопределённость.",
        "Узнать о науке внедрения", "Изучить популяризацию науки",
        "Три взаимодополняющих, но разных направления: передача знаний, внедрение и популяризация науки."]
    };
    const l = textes[langue] || textes.fr;
    transfert.dataset.chapitreTitre = l[1];
    const transfertTexte = $(".chapitre-contenu .colonne-texte", transfert);
    if (transfertTexte) {
      const titre = $("h2", transfertTexte), intro = $("p.intro", transfertTexte);
      if (titre) titre.textContent = l[1];
      if (intro) intro.textContent = l[4];
    }
    const introSalle = $(".implantation-approfondie > .colonne-texte", sc);
    if (introSalle) {
      const titre = $("h2", introSalle), intro = $("p.intro", introSalle);
      if (titre) titre.textContent = l[0];
      if (intro) intro.textContent = l[9];
    }
    transfert.dataset.image = CHEMIN + "assets/chapitres/recherche-10.webp";
    const outils = $(".chapitre-contenu .colonne-outils", transfert);
    const cadres = outils ? $$(":scope > .cadres", outils) : [];
    const dernierCadre = cadres.length ? cadres[cadres.length - 1] : null;
    const titreCadre = dernierCadre?.previousElementSibling;
    if (!dernierCadre || !titreCadre?.matches("h3.titre-bloc")) return;

    const fabriquer = (cle, numero, titre, texte, image) => {
      const volet = D.createElement("div");
      volet.className = "chapitre-source";
      volet.dataset.volet = String(numero);
      volet.dataset.rubrique = cle;
      volet.dataset.image = CHEMIN + image;
      volet.hidden = true;
      volet.dataset.chapitreTitre = titre;
      const contenu = D.createElement("div");
      contenu.className = "chapitre-contenu";
      const section = D.createElement("div");
      section.className = "section-corps pleine";
      section.innerHTML = '<div class="colonne-texte"><h2>' + echapper(titre) + '</h2><p class="intro">' + echapper(texte) + '</p></div><div class="colonne-outils"></div>';
      contenu.append(section);
      volet.append(contenu);
      table.append(volet);
      return $(".colonne-outils", section);
    };

    const implantation = fabriquer("implantation-science", 1, l[2], l[5], "assets/chapitres/ia-07.webp");
    implantation.append(titreCadre, dernierCadre);
    if (langue === "fr") {
      // Seul le chapitre « Implantation » reçoit le dossier, avec ses titres et graphiques.
      // Le cadre originel déplacé depuis « Transfert » n'est pas réintroduit ailleurs.
      const dossier = D.createElement("section");
      dossier.className = "impl-dossier";
      dossier.innerHTML = "\n<style>\n.impl-dossier{--impl-ink:#173347;--impl-soft:#eef5f8;--impl-a:#167a91;--impl-teal:#116e80;--impl-green:#247a64;color:var(--impl-ink);font-size:1rem;line-height:1.72;max-width:100%;min-width:0}\n.impl-dossier *{box-sizing:border-box}.impl-dossier .impl-hero{background:linear-gradient(128deg,#123d51 0%,#145f72 57%,#177978 100%);color:#fff;border-radius:22px;padding:clamp(23px,4.2vw,48px);margin:12px 0 25px;box-shadow:0 16px 34px rgba(12,57,74,.12)}\n.impl-dossier .impl-kicker{font-size:.73rem;letter-spacing:.14em;text-transform:uppercase;font-weight:800;opacity:.83;margin:0 0 9px}\n.impl-dossier .impl-hero h2{color:#fff!important;font-size:clamp(1.65rem,2.7vw,2.75rem)!important;letter-spacing:-.035em;line-height:1.16;margin:0 0 15px;max-width:840px}\n.impl-dossier .impl-hero p{color:#ecf9fa;max-width:800px;line-height:1.72;margin:0}\n.impl-dossier .impl-lead{font-size:1.055rem;line-height:1.76}\n.impl-dossier .impl-cite{white-space:normal;color:#146b83;text-decoration:none;border-bottom:1px solid #add8df;font-size:.91em;font-weight:650}\n.impl-dossier .impl-hero .impl-cite{color:#e4ffff;border-color:#9edbdc}\n.impl-dossier .impl-cite:hover{border-color:currentColor}\n.impl-dossier .impl-triptych,.impl-dossier .impl-grid,.impl-dossier .impl-questions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:20px 0}\n.impl-dossier .impl-tile{padding:21px 19px;border-radius:17px;background:#f1f8fa;border:1px solid #dbeaed;border-top:5px solid var(--tile,#187f91);height:100%;min-width:0}\n.impl-dossier .impl-tile b{display:block;margin-bottom:6px;font-size:.96rem}.impl-dossier .impl-tile p{font-size:.92rem;line-height:1.55;margin:0;color:#3f5665}\n.impl-dossier .impl-index{font-size:.72rem;letter-spacing:.11em;font-weight:800;text-transform:uppercase;color:var(--impl-a)}\n.impl-dossier .impl-module{margin:28px 0 18px;padding:clamp(19px,3vw,32px);background:#fff;border:1px solid #dbe7ec;border-radius:19px;box-shadow:0 7px 27px rgba(25,70,91,.055);min-width:0;overflow:hidden}\n.impl-dossier .impl-module h4{font-size:clamp(1.3rem,2.15vw,1.7rem)!important;line-height:1.27!important;letter-spacing:-.025em;color:#123e52!important;padding:0 0 13px!important;border-bottom:2px solid #d6e9ed!important;margin:5px 0 20px!important}\n.impl-dossier .impl-module h5{font-size:1.08rem!important;line-height:1.35;margin:24px 0 9px!important;color:#146779!important}\n.impl-dossier p{margin:0 0 14px}.impl-dossier .impl-module p:last-child{margin-bottom:0}\n.impl-dossier .impl-note{background:linear-gradient(90deg,#edf7f6,#f7fbfd);padding:18px 21px;border-left:4px solid #329e93;border-radius:0 13px 13px 0;margin:20px 0;font-size:.97rem}\n.impl-dossier .impl-table-scroll{overflow-x:auto;max-width:100%;border-radius:13px;border:1px solid #dae8ee;margin:18px 0}\n.impl-dossier table{width:100%;border-collapse:collapse;min-width:530px;font-size:.9rem;text-align:left}\n.impl-dossier th{background:#e6f1f5;color:#22495f;font-weight:750}\n.impl-dossier td,.impl-dossier th{padding:12px 14px;vertical-align:top;border-bottom:1px solid #dce8ed}\n.impl-dossier tr:nth-child(even) td{background:#f7fafc}.impl-dossier tr:last-child td{border-bottom:0}\n.impl-dossier .impl-figure{border:1px solid #d9e9ee;background:linear-gradient(155deg,#f7fcfd,#eff7fa);padding:clamp(16px,3vw,26px);border-radius:18px;margin:20px 0}\n.impl-dossier .impl-figure h5{margin:0 0 6px!important}.impl-dossier .impl-figure .impl-legend{color:#587383;font-size:.88rem;margin:0 0 22px}\n.impl-dossier .impl-bar-row{display:grid;grid-template-columns:minmax(110px,1.35fr) minmax(85px,1fr) 55px;align-items:center;gap:13px;margin:13px 0}\n.impl-dossier .impl-bar-name{font-size:.83rem;line-height:1.26;font-weight:620}\n.impl-dossier .impl-bar-line{height:18px;border-radius:999px;background:#d8e7ed;overflow:hidden}\n.impl-dossier .impl-bar-line span{display:block;height:100%;border-radius:999px}\n.impl-dossier .impl-bar-row strong{font-variant-numeric:tabular-nums;font-size:.87rem;text-align:right}\n.impl-dossier figcaption{font-size:.81rem;line-height:1.55;color:#587080;margin-top:18px}\n.impl-dossier .impl-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:17px 0}\n.impl-dossier .impl-metric{background:#edf5f8;border:1px solid #d5e6eb;border-radius:15px;padding:20px;min-width:0}\n.impl-dossier .impl-metric strong{font-size:clamp(2rem,4vw,3rem);line-height:1;color:#186d80;font-weight:820;display:block}\n.impl-dossier .impl-metric span{display:block;font-size:.88rem;line-height:1.4;margin-top:8px}\n.impl-dossier .impl-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:20px 0}\n.impl-dossier .impl-step{background:#eaf3f7;border:1px solid #d2e3e9;border-radius:12px;padding:16px 10px;text-align:center;font-size:.88rem;font-weight:680}\n.impl-dossier .impl-step b{display:block;font-size:1.5rem;line-height:1.2;color:#138396;margin-bottom:7px}\n.impl-dossier .impl-step::after{content:\"↓\";display:block;color:#5893a1;font-size:1.1rem;margin-top:7px}\n.impl-dossier .impl-step:last-child::after{content:\"↺\"}\n.impl-dossier .impl-ref-list{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0 0}\n.impl-dossier .impl-ref-list a{padding:9px 13px;background:#eaf4f6;border:1px solid #cce2e6;color:#155d70;border-radius:999px;font-size:.86rem;text-decoration:none}\n.impl-dossier .impl-ref-list a:hover{background:#d7edf1}\n@media(max-width:760px){.impl-dossier .impl-triptych,.impl-dossier .impl-grid,.impl-dossier .impl-questions{grid-template-columns:1fr}.impl-dossier .impl-two{grid-template-columns:1fr}.impl-dossier .impl-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.impl-dossier .impl-bar-row{grid-template-columns:minmax(100px,1.1fr) minmax(70px,1fr) 45px;gap:7px}.impl-dossier .impl-bar-name{font-size:.75rem}.impl-dossier .impl-module{padding:18px}}\n</style>\n<div class=\"impl-hero\">\n<p class=\"impl-kicker\">Knowledge in action · Scientific dossier · 2026</p>\n<h2>Implementation science and contemporary research challenges</h2>\n<p class=\"impl-lead\">An effective intervention does not necessarily improve health when it remains inaccessible, insufficiently adopted or impossible to sustain. Implementation science studies how knowledge becomes effective practice, for which populations and under what conditions. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n</div>\n<div class=\"impl-triptych\" aria-label=\"Three complementary dimensions of research\">\n <div class=\"impl-tile\" style=\"--tile:#267bb0\"><span class=\"impl-index\">01 · Effectiveness</span><b>What works?</b><p>Evaluate the effects of the intervention and the conditions of their validity. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p></div>\n <div class=\"impl-tile\" style=\"--tile:#159a99\"><span class=\"impl-index\">02 · Implementation</span><b>How can it be put into practice?</b><p>Study adoption, actors, adaptations, costs and contexts. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p></div>\n <div class=\"impl-tile\" style=\"--tile:#7e9c4a\"><span class=\"impl-index\">03 · Impact</span><b>For whom, where and for how long?</b><p>Examine reach, equity, effects and maintenance. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></p></div>\n</div>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 01</span><h4>Understanding implementation science</h4>\n<p>Implementation science is the systematic study of methods to promote the integration of research findings and evidence-based practices into services, organizations and policies. It seeks to explain why interventions that are nonetheless effective are not automatically used under ordinary conditions of practice. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<p>It differs from dissemination, which makes findings accessible, and from knowledge transfer, which organizes their circulation, exchange and mobilization. Implementation more specifically examines the process by which a practice is adopted, adapted, actually delivered and eventually sustained. These approaches are complementary rather than interchangeable. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></p>\n<div class=\"impl-note\"><strong>Example: home support.</strong> Demonstrating that a coordination mechanism reduces certain unmet needs is not enough to establish that it will be used in every territory. One must also study the resources, the professionals involved, the referral mechanisms, the populations actually reached and the continuity of partnerships. This application illustrates the distinction between effectiveness and implementation. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></div>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Field</th><th>Central question</th><th>Expected result</th></tr></thead><tbody>\n<tr><td>Effectiveness research</td><td>What effects does an intervention produce?</td><td>Estimation of effects and their uncertainty.</td></tr>\n<tr><td>Knowledge transfer</td><td>How can knowledge be made available and usable?</td><td>Exchange, understanding and mobilization.</td></tr>\n<tr><td>Implementation science</td><td>Which strategies make a practice feasible and sustainable?</td><td>Adoption, feasibility, fidelity, reach and maintenance.</td></tr>\n<tr><td>Impact evaluation</td><td>What consequences are observed, for whom and at what scale?</td><td>Population effects, equity and unintended effects.</td></tr>\n</tbody></table></div>\n<p class=\"impl-index\">Conceptual distinctions: <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 02</span><h4>Scientific frameworks, strategies and methods</h4>\n<p>Theoretical frameworks are not implementation recipes. Some serve to identify contextual determinants, others to describe the phases of change, to select strategies or to evaluate outcomes. Their selection must follow the research question and the level of decision under study. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Framework</th><th>Analytical role</th><th>Preferred use</th></tr></thead><tbody>\n<tr><td><strong>CFIR</strong></td><td>Determinants of implementation.</td><td>Innovation, inner and outer settings, individuals and process. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></td></tr>\n<tr><td><strong>RE-AIM</strong></td><td>Evaluation of impact under real-world conditions.</td><td>Reach, effectiveness, adoption, implementation and maintenance. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></td></tr>\n<tr><td><strong>EPIS</strong></td><td>Temporal trajectory.</td><td>Exploration, preparation, implementation and sustainment. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></td></tr>\n<tr><td><strong>ERIC</strong></td><td>Compilation of strategies.</td><td>Facilitation, training, audit, mobilization and adaptation; 73 strategies compiled. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a></td></tr>\n<tr><td><strong>Hybrid designs</strong></td><td>Joint evaluation of effects and implementation.</td><td>Types 1, 2 and 3 according to the scientific priority. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></td></tr>\n</tbody></table></div>\n<h5>Which designs make it possible to study implementation?</h5>\n<p>Depending on the question, researchers may use cluster randomized trials, natural experiments, observational surveys, comparative case studies, qualitative analyses and mixed methods. Hybrid designs bring the study of the intervention’s effects closer to that of the strategies needed to implement it. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p>\n<p>For intersectoral initiatives, longitudinal approaches, network analyses and resource mapping can shed light, respectively, on the evolution of cooperation, the structure of relationships and territorial disparities. They describe different dimensions and do not, on their own, demonstrate a causal effect. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh &amp; Papoutsi, 2018)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 03</span><h4>Measuring implementation outcomes</h4>\n<p>A practice may be appreciated by its users without actually being adopted, be deployed without respecting its essential components, or be initially adopted and then abandoned. Proctor’s taxonomy distinguishes eight implementation outcomes from service quality and clinical outcomes. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<div class=\"impl-grid\">\n<div class=\"impl-tile\" style=\"--tile:#247fb1\"><b>Acceptability</b><p>Favourable judgment of the actors regarding the practice.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#11988d\"><b>Adoption</b><p>Decision to use, or actual start of use.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#7b9d4a\"><b>Appropriateness</b><p>Perceived fit with the problem, the actors and the context.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#608db3\"><b>Feasibility</b><p>Possibility of delivery under local conditions.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#528c74\"><b>Fidelity</b><p>Adherence to the planned functions or components.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#c18b56\"><b>Implementation cost</b><p>Resources needed to integrate the practice.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#176c93\"><b>Penetration</b><p>Degree of integration into the targeted services and organizations.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#20948c\"><b>Sustainability</b><p>Maintenance of the practice after its introduction.</p></div>\n</div>\n<p class=\"impl-index\">Taxonomy of the eight outcomes: <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<p>Evaluation must also analyze separately health outcomes, people’s experience, accessibility and the distribution of benefits. High adoption does not automatically mean that the intervention reaches the populations who need it most. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 04</span><h4>Contemporary implementation challenges</h4>\n<h5>Complexity, context and interdependencies</h5>\n<p>Health organizations operate within dynamic systems: an intervention can modify professional practices, referral flows, resources and even the needs it addresses. Average effects can mask divergent trajectories across groups, organizations or territories. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh &amp; Papoutsi, 2018)</a></p>\n<h5>Adapting interventions without losing their essential mechanisms</h5>\n<p>The tension between fidelity and adaptation requires distinguishing essential functions from adjustable modalities. A cultural, linguistic or organizational adaptation can strengthen accessibility, but an undocumented modification can also alter the mechanism meant to produce the effect. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<h5>Evaluating sustainability rather than start-up alone</h5>\n<p>Initial adoption is only one step. Maintenance depends in particular on the availability of resources, integration into routines, changes in teams and the capacity of organizations to absorb changes in context. It requires follow-up beyond the funding or pilot period. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<h5>De-implementing low-value practices</h5>\n<p>Changing systems also means abandoning or reducing practices that do not bring sufficient benefits. Established habits, institutional incentives and the political costs of change can make their withdrawal different from the introduction of an innovation. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n<h5>Acting across several sectors</h5>\n<p>Responses to social and health needs often mobilize care, social services, housing, transportation and community organizations. The availability of a service does not demonstrate that people can actually access it, nor that organizations work together. Actual reach and coordination must be studied. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 05 · Recent data</span><h4>Equity: what 2026 research shows</h4>\n<p>A scoping review published in 2026 identified 42 theories, models and frameworks explicitly devoted to equity in implementation science. It shows that they frequently acknowledge inequities, but less often propose operational mechanisms for co-governance or for action on structural barriers. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n<figure class=\"impl-figure\">\n<h5>What equitable implementation frameworks actually take into account</h5>\n<p class=\"impl-legend\">Share of the 42 frameworks incorporating each analytical criterion · Published percentages</p>\n<div role=\"img\" aria-label=\"Horizontal chart comparing eight criteria observed in 42 equitable implementation frameworks, from 90 to 40 percent.\"><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Explicitly acknowledge inequities</div><div class=\"impl-bar-line\"><span style=\"width:90%;background:#2697a9\"></span></div><strong>90%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Incorporate the knowledge of non-specialists</div><div class=\"impl-bar-line\"><span style=\"width:88%;background:#2697a9\"></span></div><strong>88%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Promote cultural adaptation</div><div class=\"impl-bar-line\"><span style=\"width:86%;background:#2697a9\"></span></div><strong>86%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Support reciprocal learning</div><div class=\"impl-bar-line\"><span style=\"width:64%;background:#6b90be\"></span></div><strong>64%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Consider structural determinants</div><div class=\"impl-bar-line\"><span style=\"width:60%;background:#6b90be\"></span></div><strong>60%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Provide for community co-governance</div><div class=\"impl-bar-line\"><span style=\"width:45%;background:#cb8a56\"></span></div><strong>45%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Define strategies to reduce inequities</div><div class=\"impl-bar-line\"><span style=\"width:40%;background:#cb8a56\"></span></div><strong>40%</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Act on structural barriers</div><div class=\"impl-bar-line\"><span style=\"width:40%;background:#cb8a56\"></span></div><strong>40%</strong></div></div>\n<figcaption>How to read: 90% of frameworks explicitly name inequities, but only 40% propose processes to act on structural barriers. These are characteristics of the scientific frameworks, not their demonstrated effectiveness in the field. Source: <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></figcaption>\n</figure>\n<div class=\"impl-two\">\n<div class=\"impl-metric\"><strong>42</strong><span>Frameworks studied in the scoping review. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></span></div>\n<div class=\"impl-metric\"><strong>17%</strong><span>Seven frameworks meet all eight equity criteria examined. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></span></div>\n</div>\n<p>This gap calls for analyzing not only the representation of marginalized groups, but also their actual rights of participation, access to information, allocation rules and the possibility of redirecting decisions. Choosing an explicitly “equitable” framework is not enough to guarantee structural change. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 06</span><h4>Current challenges in scientific research</h4>\n<h5>Reproducibility, integrity and incentives</h5>\n<p>An accumulation of publications does not, in itself, guarantee robust knowledge. Transparency of protocols, data, analyses and decision criteria is necessary to make findings verifiable and allow their correction. Open science practices propose, in particular, preregistration and the sharing of materials when ethical obligations allow. <a class=\"impl-cite\" href=\"https://doi.org/10.1126/science.aab2374\" target=\"_blank\" rel=\"noopener noreferrer\">(Nosek et al., 2015)</a></p>\n<h5>Artificial intelligence: use and oversight</h5>\n<p>Artificial intelligence tools can support literature searching, classification or program monitoring, but their deployment must be evaluated under real-world conditions. Technical performance, bias, safety, explainability, professional accountability and contextual relevance are distinct dimensions of implementation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n<h5>Participation and redistribution of power</h5>\n<p>A one-time consultation does not guarantee that the people concerned influence the framing of problems, the choice of indicators or decisions. Recent work on equity highlights the gap between the stated value placed on experiential knowledge and the concrete mechanisms of co-ownership or co-decision. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n<h5>Trust and legitimacy of institutions</h5>\n<p>Distrust of scientists should not be presented as universal: a survey conducted in 68 countries among 71,922 people describes overall moderately high trust, but also reveals substantial expectations regarding openness and listening. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></p>\n<div class=\"impl-two\">\n<div class=\"impl-metric\"><strong>75%</strong><span>Consider scientific methods the best way to establish what is true and what is false. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></span></div>\n<div class=\"impl-metric\"><strong>42%</strong><span>Believe that scientists pay at least some attention to other people’s views. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></span></div>\n</div>\n<p>The issue therefore goes beyond communication: it also concerns the transparency of decisions, the recognition of disagreements and the ways in which institutions account for their choices. These relationships between capacity for revision and legitimacy are hypotheses to be studied, not effects established by these percentages. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 07 · Critical perspective</span><h4>Epistemic feedback: when the field can change knowledge</h4>\n<p>The scientific manuscript provided proposes complementing the movement from research to action with a reverse movement: observations, lived experiences and unforeseen consequences should be able to lead institutions to re-examine not only the way a practice is applied, but also the categories, indicators or rules on which action is based. This perspective extends the debates on organizational learning and reflexive governance; its audit mechanism still requires further empirical validation. (Argyris &amp; Schön, 1978; Jasanoff, 2003)</p>\n<div class=\"impl-note\"><strong>Two levels of feedback.</strong> Correcting the execution of a program is not equivalent to re-examining the definition of its success. Epistemic feedback aims at a traceable possibility of revising a scientific or administrative commitment, or of maintaining it with explicit reasons. (Argyris &amp; Schön, 1978; Jasanoff, 2003)</div>\n<div class=\"impl-steps\" aria-label=\"Four conditions proposed in the manuscript on epistemic feedback\">\n<div class=\"impl-step\"><b>01</b>Intelligible signal of a discrepancy</div>\n<div class=\"impl-step\"><b>02</b>Recognized right to request a review</div>\n<div class=\"impl-step\"><b>03</b>Forum comparing the explanations</div>\n<div class=\"impl-step\"><b>04</b>Authority bound to justify its decision</div>\n</div>\n<p>This model also requires a precondition: the contested commitment must be identifiable, dated and sufficiently documented for a revision to be verifiable. The aim is not to make every rule unstable, but to distinguish justified stability from an institutional inability to learn. (Argyris &amp; Schön, 1978; Jasanoff, 2003)</p>\n<p>This proposal remains a conceptual framework presented in the manuscript provided, and must not be confused with a theory already validated on a large scale. Future studies should evaluate the traceability of decisions, rights of contestation, the reliability of audits and the effects on institutional legitimacy. (Jasanoff, 2003; Nosek et al., 2015)</p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapter 08 · Scientific agenda</span><h4>Priorities and new research questions</h4>\n<p>A contemporary research program must link effectiveness, implementation strategies, equity, sustainability and governance. An international consultation on universal health coverage identifies gaps particularly concerning equity of access to services and the financial protection of populations. <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Question</th><th>Proposed approach</th></tr></thead><tbody>\n<tr><td>Why is a proven practice not used?</td><td>Analysis of determinants and evaluation of strategies. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a></td></tr>\n<tr><td>Who benefits from it, and who remains excluded?</td><td>Analyses of reach, equity and unmet needs. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></td></tr>\n<tr><td>What enables its maintenance?</td><td>Longitudinal follow-up and analysis of implementation phases. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></td></tr>\n<tr><td>How do intersectoral partners cooperate?</td><td>Mixed methods, network analysis and comparative studies. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh &amp; Papoutsi, 2018)</a></td></tr>\n<tr><td>How do institutions correct their own criteria?</td><td>Documentary analysis of decisions and testing of reflexive governance models. (Jasanoff, 2003)</td></tr>\n<tr><td>How can AI tools be implemented responsibly?</td><td>Prospective evaluation, sociotechnical audits and monitoring of unintended effects. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a></td></tr>\n</tbody></table></div>\n<p>Research on home support is a particularly relevant field: people’s needs, the resources available in territories and the relationships between organizations must be studied together, without equating theoretical availability, actual accessibility and real use of services. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n<h5>Accessing the scientific works cited</h5>\n<p>References are deliberately kept short in the text and figures. The links below open the corresponding works directly.</p>\n<div class=\"impl-ref-list\">\n<a class=\"impl-ref-link\" aria-label=\"CFIR\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a><a class=\"impl-ref-link\" aria-label=\"Implementation outcomes\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a><a class=\"impl-ref-link\" aria-label=\"RE-AIM\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a><a class=\"impl-ref-link\" aria-label=\"EPIS\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a><a class=\"impl-ref-link\" aria-label=\"ERIC\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a><a class=\"impl-ref-link\" aria-label=\"Hybrid designs\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a><a class=\"impl-ref-link\" aria-label=\"Equity 2026\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a><a class=\"impl-ref-link\" aria-label=\"International agenda\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a><a class=\"impl-ref-link\" aria-label=\"Trust and science\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a><a class=\"impl-ref-link\" aria-label=\"AI and implementation\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a>\n</div>\n</article>\n";
      implantation.replaceChildren(dossier);
      const introImpl = implantation.closest(".chapitre-source")?.querySelector(".colonne-texte p.intro");
      if (introImpl) introImpl.textContent = "Foundations, frameworks, methods, implementation outcomes, equity and contemporary scientific issues (Damschroder et al., 2022; Crump et al., 2026).";
    } else {
      const lienDossier = D.createElement("p");
      lienDossier.className = "note";
      lienDossier.innerHTML = '<a href="' + CHEMIN + 'implantation/comprendre.html">' + echapper(l[7]) + ' ↗</a>';
      implantation.append(lienDossier);
    }

    const vulgarisation = fabriquer("implantation-vulgarisation", 2, l[3], l[6], "assets/chapitres/vulgarisation-01.webp");
    const presentation = D.createElement("div");
    presentation.className = "cadres";
    const article = D.createElement("article");
    article.className = "cadre";
    const titreVul = D.createElement("h4");
    titreVul.textContent = l[3];
    const texteVul = D.createElement("p");
    const introExistante = $("section.section[data-salle='vulgarisation'] .section-corps .intro");
    texteVul.textContent = introExistante?.textContent?.trim() || l[6];
    const lienVul = D.createElement("p");
    lienVul.innerHTML = '<a href="#vulgarisation">' + echapper(l[8]) + ' ↗</a>';
    article.append(titreVul, texteVul, lienVul);
    presentation.append(article);
    vulgarisation.append(presentation);
    transfert.dataset.chapitresDistincts = "oui";
  }

  // Une page éditoriale : les sept mandats restent des entrées, jamais des chapitres.
  function preparerRepresentation(corps) {
    const liste = $(".liste-cartes", corps);
    const introduction = $(".colonne-texte", corps);
    if (!liste || !introduction) return;
    const mandats = Array.from(liste.children);
    const page = el("div", "representation-editorial");
    const ouverture = el("header", "representation-ouverture");
    const texte = el("div", "representation-presentation");
    texte.append(...Array.from(introduction.children));
    const chiffre = el("div", "representation-repere");
    chiffre.setAttribute("aria-hidden", "true");
    chiffre.innerHTML = '<span>' + deux(mandats.length) + '</span><small>' +
      echapper(langue === "fr" ? "mandates · one shared commitment" : net($(".groupe-large > h3", corps)?.textContent).replace(/\d+$/, "")) + '</small>';
    ouverture.append(texte, chiffre);
    page.append(ouverture);
    const labels = langue === "fr" ? ["Engagements actuels", "Previous milestones"] : null;
    const courts = langue === "fr" ? ["Doctorate · AÉÉSPUM", "Mentorat solidaire", "Program committee", "Doctorat · DGEPS", "Ambassadeur · UdeM", "Conseil d’administration · CROUS", "Presidency · Askoria"] : [];
    [mandats.slice(0,4), mandats.slice(4)].forEach((groupe,k) => {
      if (!groupe.length) return;
      const section = el("section", "representation-periode");
      section.dataset.periode = k ? "precedent" : "actuel";
      if (labels) section.append(el("h3", "representation-section-titre", echapper(labels[k])));
      const nouvelleListe = el("ol", "representation-mandats");
      groupe.forEach((mandat,j) => {
        const i = k ? j+4 : j;
        mandat.className = "representation-mandat";
        const date = $(".date", mandat);
        if (date) {
          const repere = el("div", "representation-date");
          repere.append(el("span", "representation-numero", deux(i+1)), date);
          mandat.prepend(repere);
        }
        const h = $("h4", mandat);
        if (h && courts[i]) h.dataset.representationMenu = courts[i];
        nouvelleListe.append(mandat);
      });
      section.append(nouvelleListe);page.append(section);
    });
    composerRepresentation(page);
    corps.replaceChildren(page);
  }

  // Une composition visuelle fondée sur les mandats existants, dans chaque langue.
  function composerRepresentation(page) {
    const traductions = {
      fr: ["The whole path", "En cours", "Previous", "Étudiants", "Instances", "One voice, many spaces", "Representation", "Mentorat", "Program life", "Department life", "Engagements actuels", "Previous milestones", "Show the mandates"],
      en: ["Full journey", "Current", "Previous", "Students", "Committees", "One voice, many spaces", "Representation", "Mentoring", "Program life", "Department life", "Current commitments", "Previous roles", "Show roles"],
      es: ["Todo el recorrido", "Actuales", "Anteriores", "Estudiantes", "Instancias", "Una voz, varios espacios", "Representación", "Mentoría", "Vida del programa", "Vida del departamento", "Compromisos actuales", "Experiencias anteriores", "Mostrar los mandatos"],
      zh: ["全部经历", "现任", "曾任", "学生", "委员会", "同一个声音，多个交流空间", "学生代表", "指导支持", "项目事务", "系部事务", "当前参与", "过往经历", "显示任职"],
      ar: ["المسار الكامل", "الحالية", "السابقة", "الطلاب", "الهيئات", "صوت واحد في فضاءات متعددة", "التمثيل", "الإرشاد", "شؤون البرنامج", "شؤون القسم", "المهام الحالية", "المهام السابقة", "عرض المهام"],
      ru: ["Весь путь", "Текущие", "Предыдущие", "Студенты", "Органы управления", "Один голос, разные площадки", "Представительство", "Наставничество", "Жизнь программы", "Жизнь кафедры", "Текущие обязанности", "Предыдущий опыт", "Показать обязанности"]
    };
    const t = traductions[langue];
    if (!t) return;
    page.classList.add("rs-page");
    const dessins = [
      '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
      '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m1-7a5 5 0 0 1 7 4v3"/>',
      '<path d="M4 4h16v17H4zM8 2v4m8-4v4M8 10h8m-8 4h5m-5 4h8"/>',
      '<path d="m2 9 10-6 10 6H2Zm2 12h16M6 11v7m6-7v7m6-7v7"/>'
    ];
    const icone = (i) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + dessins[i] + '</svg>';
    const ouverture = $(".representation-ouverture", page);
    ouverture.classList.add("rs-hero");
    $(".representation-repere", ouverture)?.remove();
    const art = el("div", "rs-illustration");
    art.setAttribute("aria-hidden", "true");
    art.innerHTML = '<div class="rs-art-grid"></div><div class="rs-art-ring"></div><div class="rs-art-ring rs-art-inner"></div><span class="rs-art-label rs-art-students">' + echapper(t[3]) + '</span><div class="rs-art-center">' + icone(0) + '</div><span class="rs-art-label rs-art-instances">' + echapper(t[4]) + '</span><i class="rs-dot rs-dot-one"></i><i class="rs-dot rs-dot-two"></i><i class="rs-dot rs-dot-three"></i><span class="rs-art-note">' + echapper(t[5]) + '</span>';
    ouverture.append(art);
    const commandes = el("div", "rs-filters");
    commandes.setAttribute("role", "group");
    commandes.setAttribute("aria-label", t[12]);
    const periodes = $$(".representation-periode", page);
    ["all", "actuel", "precedent"].forEach((valeur, i) => {
      const nombre = i ? $$(".representation-mandat", periodes[i - 1]).length : $$(".representation-mandat", page).length;
      const bouton = el("button", "", echapper(t[i]) + '<span class="rs-filter-count">' + nombre + '</span>');
      bouton.type = "button";
      bouton.dataset.rsFilter = valeur;
      bouton.setAttribute("aria-pressed", String(i === 0));
      commandes.append(bouton);
    });
    ouverture.after(commandes);
    periodes.forEach((periode, k) => {
      let titre = $("h3", periode);
      if (!titre) { titre = el("h3", "representation-section-titre"); periode.prepend(titre); }
      titre.textContent = t[10 + k];
      $(".representation-mandats", periode).classList.add(k ? "rs-timeline" : "rs-bento");
      $$(".representation-mandat", periode).forEach((mandat, j) => {
        mandat.classList.add(k ? "rs-past" : "rs-mandat", "rs-mandat-" + j);
        if (k) return;
        const haut = el("div", "rs-card-top");
        haut.innerHTML = '<span class="rs-card-icon">' + icone(j) + '</span><span class="rs-card-category">' + echapper(t[6 + j]) + '</span>';
        const date = $(".representation-date", mandat);
        if (date) haut.append(date);
        mandat.prepend(haut);
        if (j === 0) {
          const sceau = el("div", "rs-card-seal", '<span>AÉÉSPUM</span><div><i></i><i></i><i></i><i></i><i></i></div>');
          sceau.setAttribute("aria-hidden", "true");
          mandat.append(sceau);
        }
        if (j === 3) {
          const marque = el("span", "rs-department-mark", "DGEPS");
          marque.setAttribute("aria-hidden", "true");
          mandat.append(marque);
        }
      });
    });
  }

  // La salle immersive clone le contenu : déléguer les commandes au document.
  D.addEventListener("click", (event) => {
    const bouton = event.target.closest("button[data-rs-filter]");
    const page = bouton?.closest(".rs-page");
    if (!page) return;
    const valeur = bouton.dataset.rsFilter;
    $$("button[data-rs-filter]", page).forEach(b => b.setAttribute("aria-pressed", String(b === bouton)));
    $$(".representation-periode", page).forEach(p => { p.hidden = valeur !== "all" && p.dataset.periode !== valeur; });
  });

  const SALLES_ENGAGEMENTS = ["representation", "communaute", "distinctions", "citoyen", "loisirs"];
  function preparerAutresEngagements(corps, salle) {
    const intro = $(".colonne-texte", corps);
    const liste = $(".liste-cartes", corps);
    const galerie = $(".loisirs-etendus", corps);
    if (!intro || (!liste && !galerie)) return;
    const titreSource = $(".groupe-large > h3", corps);
    const titre = net(titreSource?.textContent).replace(/\d+$/, "").trim();
    const items = liste ? Array.from(liste.children) : Array.from(galerie.children);
    const affiliations = $(".etiquettes", intro);
    const titreAffiliations = affiliations?.previousElementSibling;
    const page = el("div", "representation-editorial engagements-" + salle);
    const ouverture = el("header", "representation-ouverture");
    const texte = el("div", "representation-presentation");
    // L'intitulé appartient au chapitre ; le chapeau présente son contenu.
    const h2 = $("h2", intro);
    if (h2 && langue === "fr") h2.textContent = {
      communaute:"Being part of the scientific conversation",
      distinctions:"A recognized and supported path",
      citoyen:"Serving others",
      loisirs:"Practices that open other horizons"
    }[salle];
    $$(":scope > .surtitre", intro).forEach(x=>x.remove());
    if (affiliations) affiliations.remove();
    if (titreAffiliations) titreAffiliations.remove();
    texte.append(...Array.from(intro.children));
    const repere = el("div", "representation-repere");repere.setAttribute("aria-hidden","true");
    const labels = {communaute:"scientific committees",distinctions:"scholarships and awards",citoyen:"engagements citoyens",loisirs:"practices and horizons"};
    repere.innerHTML = '<span>'+deux(items.length)+'</span><small>'+echapper(langue === "fr" ? labels[salle] : titre)+'</small>';
    ouverture.append(texte,repere);page.append(ouverture);
    if (affiliations) {
      const section = el("section", "representation-periode engagements-affiliations");
      if (titreAffiliations) {titreAffiliations.className="representation-section-titre";section.append(titreAffiliations);}
      const reseau = el("ul", "engagements-reseau");
      Array.from(affiliations.children).forEach((aff,i)=>{
        const item=el("li");item.append(el("span","engagements-reseau-numero",deux(i+1)),el("span","",echapper(net(aff.textContent))));reseau.append(item);
      });section.append(reseau);page.append(section);
    }
    const section=el("section","representation-periode");
    const sectionTitre = langue === "fr" ? {communaute:"Contributing to scientific meetings",distinctions:"Academic awards and support",citoyen:"In the field",loisirs:"Sports, creation and curiosity"}[salle] : titre;
    section.append(el("h3","representation-section-titre",echapper(sectionTitre)));
    if (galerie) {
      galerie.classList.add("engagements-galerie");
      items.forEach(item=>{
        if (salle === "loisirs") item.tabIndex = 0; // Les détails restent accessibles au clavier dans la mosaïque compacte.
        const fort=$("figcaption > strong",item);
        if (fort) {const titre=el("h4","",fort.innerHTML);fort.replaceWith(titre);}
      });
      section.append(galerie);
    } else {
      const chronologie=el("ol","representation-mandats");
      items.forEach((item,i)=>{
        item.className="representation-mandat";
        const date=$(".date",item);
        if(date){const bloc=el("div","representation-date");bloc.append(el("span","representation-numero",deux(i+1)),date);item.prepend(bloc);}
        chronologie.append(item);
      });section.append(chronologie);
    }
    if (salle === "distinctions") {
      page.classList.add("ds-page");
      const recompenses = $(".representation-mandats", section);
      recompenses?.classList.add("ds-list");
      $$(".representation-mandat", section).forEach((item, i) => {
        item.classList.add("ds-award", "ds-award-" + i);
        if (i === 0) {
          const medaille = el("div", "ds-medal");
          medaille.setAttribute("aria-hidden", "true");
          medaille.innerHTML = '<svg viewBox="0 0 120 140" fill="none"><path d="m37 74-8 52 31-17 31 17-8-52" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="51" r="37" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="51" r="29" stroke="currentColor" stroke-dasharray="2 5"/><path d="m60 29 6 14 15 2-11 10 3 16-13-8-13 8 3-16-11-10 15-2Z" fill="currentColor"/></svg>';
          item.append(medaille);
        }
      });
    }
    page.append(section);corps.replaceChildren(page);
  }

  function decouper(sc, salle) {
    // Une rubrique sans découpage éditorial explicite reste un seul chapitre.
    if ((salle === "educateur" && langue === "fr") || REGLES[salle]?.unique || salle === "biographie" || salle === "parcours") {
      const corps = $(":scope > .section-corps", sc);
      if (SALLES_ENGAGEMENTS.includes(salle)) {
        sc.classList.add("gab-engagements");
        if (salle === "representation") preparerRepresentation(corps);
        else preparerAutresEngagements(corps,salle);
      }
      const source = el("div", "gab-lecture-integrale");
      const titre = SALLES_ENGAGEMENTS.includes(salle) ? texteTitre($(".bandeau-titre", sc)) : texteTitre($("h2", corps)) || texteTitre($(".bandeau-titre", sc));
      if (salle === "axes") $$(".axe-carte", corps).forEach((carte, i) => {
        carte.id = "axes-chapitre-" + (i + 1);
        carte.style.setProperty("--axe", COULEURS[i % COULEURS.length]);
      });
      source.append(...Array.from(corps.children));
      corps.append(source);
      return { mode: "elements", chapitres: [{ source, titre, cle: "chapitre-1" }] };
    }
    const table = $(".chapitres-source[data-rubriques]", sc);
    if (table) {
      if (salle === "implantation") preparerChapitresImplantation(sc, table);
      const chapitres = Array.from(table.children).filter((v) => v.classList.contains("chapitre-source")).map((v) => ({
        source: v, titre: v.dataset.chapitreTitre || "", cle: v.dataset.rubrique || "", surPlace: true
      }));
      if (salle === "vulgarisation" && langue !== "fr") {
        const titres = {
          fr: ["Dossier scientifique approfondi", "State of knowledge, international statistics, comparative tables and authentic figures from scientific publications.", "Read the full scientific dossier"],
          en: ["In-depth scientific dossier (French)", "Research synthesis, international statistics and figures from published studies.", "Read the scientific dossier"],
          es: ["Dossier científico completo (en francés)", "Estado del conocimiento, estadísticas internacionales y figuras científicas.", "Leer el dossier"],
          zh: ["科学传播研究专题（法语）", "研究综述、国际数据和原始科学图表。", "阅读专题"],
          ar: ["ملف علمي معمّق (بالفرنسية)", "مراجعة للأبحاث وبيانات دولية ورسوم علمية منشورة.", "قراءة الملف"],
          ru: ["Научный обзор (на французском)", "Обзор исследований, международная статистика и научные иллюстрации.", "Читать обзор"],
        };
        const t = titres[langue] || titres.fr;
        const source = el("div", "vul-dossier-invite");
        source.dataset.image = CHEMIN + "assets/chapitres/vulgarisation-02.webp";
        source.innerHTML = '<p class="vul-dossier-extrait">' + echapper(t[1]) + '</p>' +
          '<p><a class="vul-dossier-lien" href="' + CHEMIN + 'vulgarisation/dossier.html">' + echapper(t[2]) + ' ↗</a></p>';
        chapitres.push({ source, titre: t[0], cle: "dossier", urlExterne: CHEMIN + "vulgarisation/dossier.html" });
      }
      return { mode: "rubriques", table, chapitres };
    }
    if (salle === "parcours") {
      const frise = $("ol.frise", sc), texte = $(".colonne-texte", sc);
      const items = frise ? Array.from(frise.children) : [];
      const groupe = (filtre, classe) => {
        const ol = D.createElement("ol");
        ol.className = "frise " + classe;
        items.filter(filtre).forEach((li) => ol.append(li));
        return ol;
      };
      const titres = { fr: ["Formations", "Professional experience"], en: ["Education", "Professional experience"], es: ["Formación", "Experiencia profesional"], zh: ["教育背景", "工作经历"], ar: ["التكوين", "الخبرة المهنية"], ru: ["Образование", "Профессиональный опыт"] }[langue] || ["Formations", "Professional experience"];
      const chapitres = [];
      if (items.length) {
        chapitres.push({ source: groupe((li) => li.classList.contains("formation"), "gab-frise-formation"), titre: titres[0], ancre: frise });
        chapitres.push({ source: groupe((li) => !li.classList.contains("formation"), "gab-frise-experience"), titre: titres[1], ancre: frise });
      }
      const bloc = texte && $(".titre-bloc", texte);
      if (bloc) {
        const conteneur = D.createElement("div");
        let x = bloc.nextElementSibling;
        while (x) { const suivant = x.nextElementSibling; conteneur.append(x); x = suivant; }
        chapitres.push({ source: conteneur, titre: texteTitre(bloc).replace(/\s*·\s*\d{4}\s*$/, ""), titreEl: bloc, ancre: frise });
      }
      return { mode: "elements", chapitres };
    }
    const regle = REGLES[salle];
    if (regle) {
      const chapitres = $$(regle.sel, sc).map((el) => {
        const titreEl = $(regle.titre, el);
        return { source: el, titre: texteTitre(titreEl), titreEl };
      }).filter((c) => c.titre);
      return { mode: "elements", chapitres };
    }
    // Salle sans règle : les intertitres h3 de la colonne de contenu ouvrent les chapitres.
    const zone = $(".colonne-outils", sc);
    const h3 = zone ? $$(":scope > h3", zone) : [];
    if (h3.length < 2) return { mode: "unique", chapitres: [] };
    const chapitres = h3.map((h) => {
      const div = D.createElement("div");
      let x = h.nextElementSibling;
      while (x && x.tagName !== "H3") { const suivant = x.nextElementSibling; div.append(x); x = suivant; }
      h.after(div);
      return { source: div, titre: texteTitre(h), titreEl: h };
    });
    return { mode: "elements", chapitres };
  }

  // ---------- Construction ----------
  const el = (tag, classe, html) => { const x = D.createElement(tag); if (classe) x.className = classe; if (html != null) x.innerHTML = html; return x; };
  const echapper = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Adresses absolues : une url() relative placée dans une variable CSS serait résolue depuis la feuille de style.
  const absolue = (u) => { try { return u ? new URL(/^assets\//.test(u) ? CHEMIN + u : u, D.baseURI).href : ""; } catch { return u; } };
  function photoDuBandeau(bandeau) {
    const m = (bandeau?.getAttribute("style") || "").match(/url\((['"]?)([^'")]+)\1\)/);
    return m ? absolue(m[2]) : "";
  }
  function premiereImage(source) {
    const img = $$("img", source).find((i) => !i.closest(".ic, svg") && !/\.svg(\?|$)/i.test(i.getAttribute("src") || "") && (i.getAttribute("width") || 300) >= 120);
    return img ? absolue(img.getAttribute("src")) : "";
  }

  // Un seul intitulé : celui du contenu. Ne pas utiliser de paraphrases de menu.
  function titreSommaire(titre) {
    if (!titre) return "";
    const source = titre.matches(".cp-module > summary") ? $(".cp-summary strong", titre)
      : titre.matches(".ei-gesture > summary") ? $("strong", titre) : titre;
    const copie = (source || titre).cloneNode(true);
    $$("svg, .compte, .rg-compte, .objectif-code, [aria-hidden='true']", copie).forEach(n => n.remove());
    $$("br", copie).forEach(n => n.replaceWith(D.createTextNode(" ")));
    // Les badges sont visuels et restent séparés du texte, comme en méthodologie.
    const numero = $(":scope > span", copie);
    if (titre.matches(".methode-rubrique-titre") && /^\d+$/.test(net(numero?.textContent))) numero.remove();
    return net(copie.textContent);
  }
  function niveauSommaire(titre) {
    if (titre.matches(".impl-portail-grand-titre")) return 3;
    if (titre.closest(".impl-portail-fusion")) return Math.min(6, Number(titre.tagName.slice(1)) + 2);
    if (titre.matches("summary")) return 4;
    if (titre.matches("h4") && /^\d+[.)]\s/.test(titreSommaire(titre))) return 3;
    return Number(titre.tagName.slice(1)) || 5;
  }
  function titresSommaire(corps, salle, chapitre) {
    const methode = salle === "recherche" && langue === "fr" && /methode/.test(chapitre.cle || "");
    return $$("h3, h4, h5, .impl-portail-fusion h2, .cp-module > summary, .ei-gesture > summary", corps).filter(h => {
      if (!titreSommaire(h) || h.closest("figure, svg, table, .gab-bas-chapitre, .gab-chapitre-tete")) return false;
      // Les questions et réponses qui changent sont des contrôles, pas des rubriques.
      if (h.closest(".cp-step-content, .cp-challenge, .cp-quiz-board, .ei-stage, .ei-lens, .ei-purpose-content, .ei-society, .ei-lab-output, .ei-quiz-results")) return false;
      if (h.closest("[data-ei-root]") && !h.matches("h3, .ei-gesture > summary")) return false;
      const detail = h.closest("details:not([open])");
      if (detail && corps.contains(detail) && !h.matches("summary") && !(methode && detail.matches(".methode-these"))) return false;
      const cache = h.closest("[hidden]");
      if (cache && corps.contains(cache) && !(methode && cache.matches(".these-objectif-vue"))) return false;
      return titreSommaire(h) !== net(chapitre.titre) || h.tagName !== "H3";
    });
  }

  // Navigation de la méthodologie : un même objectif regroupe et colore
  // toutes ses sous-parties, sans toucher à leur contenu ou à leurs cibles.
  function organiserSommaireObjectifs(nav, intertitres) {
    // Chapitre Méthodologie uniquement : le sommaire reprend les véritables
    // sections numérotées de chacun des trois objectifs, et non les illustrations.
    // Les rubriques du corps scientifique, les autres menus et le gabarit ne bougent pas.
    const corps = intertitres.find((h) => h.closest(".gab-corps"))?.closest(".gab-corps");
    if (!corps) return;
    const objectifs = [
      ["O1", "Objective 1 · Literature review"],
      ["O2", "Objective 2 · Spatial mapping"],
      ["O3", "Objective 3 · Retrospective social network analysis"]
    ];
    const sections = objectifs.map(([code, nom]) => {
      const source = corps.querySelector("#these-methode-" + code.toLowerCase());
      if (!source) return null;
      const rubriques = $$(":scope > .methode-these-corps > section.methode-rubrique[id]", source)
        .filter((partie) => !!partie.querySelector(":scope > h5.methode-rubrique-titre, :scope > details > summary > h5.methode-rubrique-titre"));
      if (!rubriques.length) return null;
      // Le titre de l’objectif est l’objectif mot pour mot : le menu garde le nom court fixe.
      return { code, nom, source, rubriques };
    });
    // Conserver le menu existant si les rubriques réelles ne sont pas encore disponibles.
    if (sections.some((section) => !section)) return;

    nav.classList.add("gab-sommaire-objectifs");
    const etiquette = nav.querySelector(":scope > span");
    nav.replaceChildren();
    if (etiquette) nav.append(etiquette);

    // Trois raccourcis compacts, attachés aux en-têtes O1/O2/O3.
    const raccourcis = el("div", "gab-sommaire-raccourcis");
    sections.forEach(({ code, nom, source }) => {
      const lien = el("a", "gab-sommaire-raccourci", echapper(code));
      lien.href = "#" + encodeURIComponent(source.id);
      lien.dataset.gabCible = source.id;
      lien.setAttribute("aria-label", nom);
      raccourcis.append(lien);
    });
    nav.append(raccourcis);

    sections.forEach(({ code, nom, rubriques }) => {
      const groupe = el("section", "gab-sommaire-groupe");
      groupe.dataset.objectif = code;
      groupe.setAttribute("aria-label", nom);
      const titre = el("div", "gab-sommaire-groupe-titre");
      titre.append(el("b", "", echapper(code)), el("strong", "", echapper(nom)));
      const liens = el("div", "gab-sommaire-groupe-liens");
      rubriques.forEach((rubrique, position) => {
        const enTete = rubrique.querySelector(":scope > h5.methode-rubrique-titre, :scope > details > summary > h5.methode-rubrique-titre");
        const numero = deux(position + 1);
        const etiquetteNumero = enTete.querySelector(":scope > span");
        if (etiquetteNumero && net(etiquetteNumero.textContent) !== numero) etiquetteNumero.textContent = numero;
        const libelle = titreSommaire(enTete);
        if (!enTete.id) enTete.id = rubrique.id + "-titre";
        const lien = el("a", "gab-sommaire-etape");
        lien.href = "#" + encodeURIComponent(rubrique.id);
        lien.dataset.gabCible = rubrique.id;
        lien.dataset.gabNiveau = "h5";
        lien.dataset.gabTitre = enTete.id;
        lien.dataset.objectif = code;
        lien.setAttribute("aria-label", code + " · " + numero + " · " + libelle);
        lien.innerHTML =
          '<span class="gab-sommaire-etape-num" style="background:var(--objectif-fond);color:var(--objectif-texte)">' + echapper(numero) + '</span>' +
          '<span class="gab-sommaire-etape-texte">' + echapper(libelle) + '</span>';
        liens.append(lien);
      });
      groupe.append(titre, liens);
      nav.append(groupe);
    });
  }

  // Problématique : titres du sommaire conformes à la structure scientifique,
  // sans modifier les chapitres, les textes, les classes ni les couleurs.
  function organiserSommaireProblematique(nav, intertitres, corps) {
    const liens = Array.from(nav.querySelectorAll(":scope > a[data-gab-intertitre]"));
    if (liens.length !== intertitres.length || !liens.length) return;
    const lienPour = (regex) => liens.find((lien, i) => regex.test(normaliser(intertitres[i].textContent)));
    const ajouterLien = (cible, libelle) => {
      if (!cible) return null;
      if (!cible.id) cible.id = "gab-problematique-cible-" + libelle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const lien = el("a", "", echapper(titreSommaire(cible) || libelle));
      lien.href = "#" + encodeURIComponent(cible.id);
      lien.dataset.gabCible = cible.id;
      lien.dataset.gabTitre = cible.id;
      return lien;
    };
    const groupes = [
      { nom: "Scientific problem", liens: [lienPour(/^the scientific problem$/)] },
      { nom: "Problem statement", liens: [ajouterLien(
        corps.querySelector(".these-problematique-bandeau__titre, .these-question-encadre :is(.surtitre,.these-question-label)"),
        "Research question"
      )] },
      { nom: "General objective", liens: [lienPour(/^objectif general$/)] },
      { nom: "General hypothesis", liens: [lienPour(/^hypothese generale$/)] },
      { nom: "Specific objectives", liens: [lienPour(/^objectifs specifiques$/)] }
    ];
    ["O1", "O2", "O3"].forEach((code, index) => {
      const numero = index + 1;
      const carte = corps.querySelector('.ov-carte[data-objectif="' + code + '"], .objectif-carte[data-objectif="' + code + '"]');
      const lacune = carte?.querySelector(".ov-lacune-titre");
      const libelles = ["decrire les profils", "reperer les ressources", "comprendre les reseaux"];
      const objectif = lienPour(new RegExp("^o\\s*" + numero + "\\b|^objectif\\s*" + numero + "\\b|" + libelles[index]));
      const liensObjectif = [
        ajouterLien(lacune, "Lacune scientifique " + numero),
        objectif,
        ...liens.filter((lien, i) => carte?.contains(intertitres[i]) && lien !== objectif)
      ].filter(Boolean);
      groupes.push({ nom: titreSommaire(carte?.querySelector("h4")) || "Objective " + numero,
        objectif: code, titreLien: objectif, liens: liensObjectif });
    });
    const hypotheses = corps.querySelector(".these-hypotheses h4");
    if (hypotheses) groupes.push({ nom: "Hypotheses",
      liens: [lienPour(/^hypotheses/) || ajouterLien(hypotheses, titreSommaire(hypotheses))] });
    const palette = [
      { texte:"#365772", trait:"#76a2bb", fond:"#edf4f8", lien:"#f8fbfd" },
      { texte:"#286c23", trait:"#5aae38", fond:"#ecf7e8", lien:"#f5fbf2" },
      { texte:"#006e72", trait:"#11a7a5", fond:"#e9f7f6", lien:"#f3fbfa" },
      { texte:"#18559b", trait:"#0755ad", fond:"#ebf2fd", lien:"#f3f7ff" }
    ];
    nav.classList.add("gab-sommaire-objectifs", "gab-sommaire-sections");
    const etiquette = nav.querySelector(":scope > span");
    nav.replaceChildren();
    if (etiquette) nav.append(etiquette);
    groupes.sort((a,b) => {
      const cible = g => $$("[id]",corps).find(n => n.id === g.liens.find(Boolean)?.dataset.gabCible);
      const x=cible(a), y=cible(b);
      return x && y ? (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1) : 0;
    });
    groupes.forEach((g, i) => {
      const elements = g.liens.filter(Boolean);
      if (!elements.length) return;
      const couleur = g.objectif === "O1" ? palette[1] :
        g.objectif === "O2" ? palette[2] :
        g.objectif === "O3" ? palette[3] : palette[0];
      const groupe = el("section", "gab-sommaire-groupe");
      groupe.dataset.section = "objectifs-" + i;
      if (g.objectif) groupe.dataset.objectif = g.objectif;
      for (const [variable, valeur] of Object.entries({
        "--objectif-texte": couleur.texte,
        "--objectif-trait": couleur.trait,
        "--objectif-fond": couleur.fond,
        "--objectif-lien": couleur.lien
      })) groupe.style.setProperty(variable, valeur);
      const titreLien = g.titreLien || elements[0];
      const nom = net(titreLien.textContent);
      groupe.setAttribute("aria-label", nom);
      const entete = el("div", "gab-sommaire-groupe-titre");
      if (g.objectif) entete.append(el("b", "", echapper(g.objectif)));
      titreLien.classList.add("gab-section-lien-titre");
      entete.append(titreLien);
      const items = el("div", "gab-sommaire-groupe-liens");
      items.append(...elements.filter(a => a !== titreLien));
      groupe.append(entete, items);
      nav.append(groupe);
    });
  }


  // Vulgarisation : les dix sections du dossier restent visibles dans le
  // sommaire latéral, sur le modèle coloré des sections de « Ma thèse ».
  function organiserSommaireVulgarisation(nav, titres) {
    const liens = Array.from(nav.querySelectorAll(":scope > a[data-gab-intertitre]"));
    if (liens.length !== 10 || titres.length !== 10) return;
    const palette = [
      ["#365772","#76a2bb","#edf4f8","#f8fbfd"],
      ["#286c23","#5aae38","#ecf7e8","#f5fbf2"],
      ["#006e72","#11a7a5","#e9f7f6","#f3fbfa"],
      ["#18559b","#0755ad","#ebf2fd","#f3f7ff"],
      ["#80532e","#bf8953","#faf2e9","#fdf9f4"]
    ];
    nav.classList.add("gab-sommaire-objectifs","gab-sommaire-sections","gab-sommaire-vulgarisation");
    const etiquette = nav.querySelector(":scope > span");
    nav.replaceChildren();
    if (etiquette) nav.append(etiquette);
    liens.forEach((lien,k) => {
      const groupe = el("section","gab-sommaire-groupe");
      const [texte,trait,fond,cible] = palette[k%palette.length];
      [["--objectif-texte",texte],["--objectif-trait",trait],["--objectif-fond",fond],["--objectif-lien",cible]]
        .forEach(([nom,valeur])=>groupe.style.setProperty(nom,valeur));
      groupe.dataset.section = "vulgarisation-" + (k+1);
      const numero = el("div","gab-sommaire-groupe-titre");
      numero.append(el("b","",deux(k+1)));
      lien.classList.add("gab-section-lien-titre");
      numero.append(lien);
      const contenu = el("div","gab-sommaire-groupe-liens");
      groupe.append(numero,contenu);
      nav.append(groupe);
    });
  }


  // Le menu historique à sections colorées est commun à toutes les portes.
  // Les sommaires spéciaux de la thèse et de vulgarisation restent inchangés.
  function organiserSommaireUniversel(nav, intertitres) {
    const liens = Array.from(nav.querySelectorAll(":scope > a[data-gab-intertitre]"));
    if (!liens.length || liens.length !== intertitres.length) return;
    const groupes = [];
    let groupe = null;
    liens.forEach((lien, index) => {
      const titre = intertitres[index];
      const niveau = niveauSommaire(titre);
      if (!groupe || niveau <= groupe.niveau) {
        groupe = { nom: titreSommaire(titre), titreLien: lien, liens: [], niveau };
        groupes.push(groupe);
      } else {
        lien.dataset.gabProfondeur = String(niveau - groupe.niveau);
        groupe.liens.push(lien);
      }
    });
    const palette = [
      ["#286c23","#5aae38","#ecf7e8","#f5fbf2"],
      ["#006e72","#11a7a5","#e9f7f6","#f3fbfa"],
      ["#18559b","#0755ad","#ebf2fd","#f3f7ff"],
      ["#80532e","#bf8953","#faf2e9","#fdf9f4"]
    ];
    nav.classList.add("gab-sommaire-objectifs", "gab-sommaire-sections", "gab-sommaire-universel");
    const etiquette = nav.querySelector(":scope > span");
    nav.replaceChildren();
    if (etiquette) nav.append(etiquette);
    groupes.forEach((g, index) => {
      const bloc = el("section", "gab-sommaire-groupe");
      bloc.dataset.section = "universel-" + (index + 1);
      const objectif = intertitres.find(t => t.id === g.titreLien.dataset.gabCible)?.closest("[data-objectif]")?.dataset.objectif;
      if (objectif) bloc.dataset.objectif = objectif;
      const couleurs = palette[objectif ? Number(objectif.slice(1)) - 1 : index % palette.length];
      ["--objectif-texte","--objectif-trait","--objectif-fond","--objectif-lien"]
        .forEach((nom,i)=>bloc.style.setProperty(nom,couleurs[i]));
      const titre = el("div", "gab-sommaire-groupe-titre");
      titre.append(el("b", "", deux(index + 1)));
      g.titreLien.classList.add("gab-section-lien-titre");
      titre.append(g.titreLien);
      bloc.setAttribute("aria-label", g.nom);
      const liste = el("div", "gab-sommaire-groupe-liens");
      liste.append(...g.liens);
      bloc.append(titre, liste);
      nav.append(bloc);
    });
  }



  function fabriquerSommaire(corps, salle, chapitre, index) {
    // Les anciens sommaires automatiques "In this chapter" sont supprimés
    // des portes de parcours et de compétences : navigation précédente/suivante inchangée.
    // Les dossiers scientifiques conservent leurs sommaires structurés dédiés.
    if (!["recherche", "implantation", "vulgarisation"].includes(salle)) return null;
    const titres = titresSommaire(corps, salle, chapitre);
    if (!titres.length) return null;
    const nav = el("nav", "gab-sommaire-chapitre");
    nav.setAttribute("aria-label", T.dans);
    nav.setAttribute("tabindex", "0");
    nav.append(el("span", "", echapper(T.dans)));
    const ids = new Map();
    $$("[id]", corps).forEach(n => { if (!ids.has(n.id)) ids.set(n.id,n); });
    titres.forEach((h, k) => {
      if (!h.id || ids.get(h.id) !== h) {
        const base = "gab-partie-" + langue + "-" + (chapitre.cle || "chapitre") + "-" + (index + 1) + "-" + (k + 1);
        let id = base, suffixe = 1;
        while (ids.has(id)) id = base + "-" + suffixe++;
        h.id = id; ids.set(id,h);
      }
      const lien = el("a", "", echapper(titreSommaire(h)));
      lien.href = "#" + encodeURIComponent(h.id);
      lien.dataset.gabIntertitre = String(k);
      lien.dataset.gabCible = h.id;
      lien.dataset.gabTitre = h.id;
      lien.dataset.gabNiveau = h.tagName.toLowerCase();
      const code = h.closest("[data-objectif]")?.dataset.objectif;
      if (/^O[123]$/.test(code || "")) lien.dataset.objectif = code;
      nav.append(lien);
    });
    const these = salle === "recherche" && langue === "fr";
    if (these && /methode/.test(chapitre.cle || "") && !corps.querySelector('[data-vulgarisation-affinee]')) organiserSommaireObjectifs(nav, titres);
    else if (these && corps.querySelector('.ov-carte') && /problematique|objectifs/.test((chapitre.cle || "") + " " + normaliser(chapitre.titre))) organiserSommaireProblematique(nav, titres, corps);
    else organiserSommaireUniversel(nav, titres);
    const bascule=el("button","gab-sommaire-basculer",echapper(T.dans)+' <span aria-hidden="true">⌄</span>');
    bascule.type="button";bascule.setAttribute("aria-expanded","false");nav.dataset.gabReplie="oui";nav.prepend(bascule);
    return nav;
  }
  const corpsSommairesObserves = new WeakSet();
  function actualiserSommaire(chapitre) {
    const corps = $(".gab-corps", chapitre), aside = $(".gab-chapitre-aside", chapitre);
    if (!corps || !aside) return;
    const salle = chapitre.closest("[data-gab-salle]")?.dataset.gabSalle || "";
    const nouveau = fabriquerSommaire(corps, salle, {
      cle: chapitre.dataset.gabSlug, titre: chapitre.dataset.gabTitre
    }, Number(chapitre.dataset.gabIndex || 0));
    const ancien = $(".gab-sommaire-chapitre", aside);
    if (!nouveau) {
      ancien?.remove();
      $(".gab-chapitre-grille", chapitre)?.classList.remove("gab-menu-universel");
      return;
    }
    if (ancien?.innerHTML === nouveau.innerHTML && ancien.className === nouveau.className) return;
    if(ancien?.dataset.gabReplie === "non") {
      nouveau.dataset.gabReplie="non";$(".gab-sommaire-basculer",nouveau)?.setAttribute("aria-expanded","true");
    }
    const position = ancien?.scrollTop || 0;
    const focus = ancien?.contains(D.activeElement) ? D.activeElement.dataset.gabCible : null;
    if (ancien) ancien.replaceWith(nouveau); else aside.append(nouveau);
    nouveau.scrollTop = position;
    const grille = $(".gab-chapitre-grille", chapitre);
    grille?.classList.toggle("gab-menu-universel", nouveau.classList.contains("gab-sommaire-universel"));
    if (focus) $$("a", nouveau).find(a => a.dataset.gabCible === focus)?.focus({ preventScroll: true });
  }
  function observerSommaires(zone) {
    $$(".gab-chapitre", zone).forEach(chapitre => {
      const corps = $(".gab-corps", chapitre);
      if (!corps || corpsSommairesObserves.has(corps)) return;
      corpsSommairesObserves.add(corps);
      actualiserSommaire(chapitre);
      let attente = false;
      new MutationObserver(() => {
        if (attente || !chapitre.isConnected) return;
        attente = true;
        requestAnimationFrame(() => { attente = false; actualiserSommaire(chapitre); });
      }).observe(corps, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden", "open"] });
    });
  }

  function construireChapitre(ch, i, n, couleur, choix, salle) {
    const section = ch.surPlace ? ch.source : el("section");
    section.classList.add("gab-chapitre");
    section.style.setProperty("--gab-c", couleur);
    section.dataset.gabIndex = i;
    // Chaque chapitre constitue une vue indépendante, accessible par URL.
    section.dataset.gabSlug = ch.cle || `chapitre-${i + 1}`;
    if (ch.surPlace) {
      section.hidden = false;
      ["role", "aria-labelledby", "tabindex"].forEach((a) => section.removeAttribute(a));
    }
    const grille = el("div", "gab-chapitre-grille");
    const texte = el("div", "gab-chapitre-texte");
    // Titre de chapitre unique et transversal : numéro et intitulé sur la même ligne.
    const titreAffiche = salle === "recherche" && langue === "fr" && ch.cle === "problematique" ? "Problem statement" :
      salle === "recherche" && langue === "fr" && ch.cle === "methodes" ? (/\/methode-vulgarisee\.html$/i.test(location.pathname) ? "Plain-language methodology" : "Methodology") : ch.titre;
    section.dataset.gabTitre = titreAffiche || "";
    const tete = el("header", "gab-chapitre-tete", `<span class="gab-chapitre-num" role="heading" aria-level="3"><b aria-hidden="true">${deux(i + 1)}</b><span>${echapper(titreAffiche)}</span></span>`);
    // Seule la Méthodologie possède un lien vers sa copie en langage courant.
    // Ajouter le lien dans l'en-tête du chapitre, jamais dans les menus.
    if (salle === "recherche" && ch.cle === "methodes" && langue === "fr") {
      const lienLecture = el("a", "methode-lien-grand-public");
      lienLecture.href = "./methode-vulgarisee.html#recherche/methodes";
      lienLecture.setAttribute("aria-label", "Read the plain-language methodology");
      const visage = el("img", "methode-lien-visage");
      visage.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHCAkIBgoJCAkMCwoMDxoRDw4ODx8WGBMaJSEnJiQhJCMpLjsyKSw4LCMkM0Y0OD0/QkNCKDFITUhATTtBQj//2wBDAQsMDA8NDx4RER4/KiQqPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz//wAARCACgAKADASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAAAAECAwQFBgf/xAA3EAACAgECBQIDBgUDBQAAAAABAgADEQQhBRIxQVFhcQYTgRQiMlKRwTNCobHwI2LRFRYkcuH/xAAaAQACAwEBAAAAAAAAAAAAAAAAAgEDBAUG/8QAIREAAwACAgMBAQEBAAAAAAAAAAECAxESMQQhQVEiMhP/2gAMAwEAAhEDEQA/APXoQh03MzlgRrOB03MYz52HSNldX+Dqf0CS3UxIsJWMJFhCABCLy+YHA8/pG4sNoSEaXUdTFBBG0hpoBYQhIASOBI6GJCAEquDsdjHSCOVyNj0liv8ARXP4SwgNxkQlggHYZMidi3tB25jgdI2VVW/SHSCEIRBggMZA89IE4GT0ErG35jYHQRpW2Q2Tl8HAXf1j1Unc7RivgdSfePXmffoPMtSSFbBvQEyF2x1VhJysY+x6xgKr2Bu/1kKXlH67d47WKFUuvncSvp0LNzMQD7ZxIZJoLqOY7Lt7SYHIzIq0blyGB9xGWEqdjymI4XwNlmEiouFqnsw6iSyprQwRIsIAKrFT6SYHIyJBHI3KfSNNa9MhobCEIpIQhBm5ULHtJS2BBc5dF5fwnrFqrwgK4PkGVqlYnn35STsO0tglRkbecy8QkVcn+GBJR6mQc5PUf1jbLeUY7noO5kkEt1q10tYxwoBJPpOebiNl1uVJUdhmXeKWl6RpkOWfY48StVpUqUbZMovLp6RfGLa2y4li3Gutz94gEiXkqCjGNvEx2XkYOg+8pyJrafUpauQe2f8A7+0bHk5kZMfHoc4CDK9DK1rBxgmWn3Gw2PaVLaSTkGWlRVquNGq5mzg7MJp12pbzfLOQO8y7qjjBwxkvDrlTNfYnfzmV1O/ZKNKEISoYIQhAAhCEACMsIOU8iPlXW8yjnAJHkRp7IYITVkHYeZHbqa+74+kqW3WEEqDgDcmU6Fe+9jYTyg45Y93wWxojk9F4apnOKA2PzHYRU+cGLHdj3J6QL1UgCyxE8AnElHKQCpBB6EGZudP2aOMr0hiV8pLE5Y9SY4jbvFmXrOJ3Jca9Lpy+P5iDF1snZfYSB2elues4I3lSrX6473aIlfK9ZZFqX1Fkz6gjBBke17Qy0/TL1OqtdAeQ/Q/tJDZcRucfSRcNcNVyZ+8p6ektvjpuD5E3S9ymYqXGmijdkIZTVyNUCNlJGT2mhdSxyS64/wB0oWVgMcE+8YU3a7FtUsv4c7HzHypw11bTcoGGU7+stzO1pjoIQhIAIQhABZFcMgCSyO4MUyoyR2jT2QyFq1I6bD+pmFz2Ktq6cZtezlXPb1mvbaRpQQd+hmVpG/8AKuHggiTl/wAj4v8ARVbhlaH5mpvayw9STgTQ0brWq1LsP5d8zlOM8S4gdFdxKvVnRaFdX9mSyuoWO2CeZz/tGCAo6yP4I47rOM6fUrql5305DLcFC83XYgbZ2mdzWuTNCqd8TuWOxMoXWJXS99zKqAElmOAB5Jl9yDX7iVV01VzUDUqGqrfnZD0YjpnyM7/QRdbeh96WzA/7x4RXqvkWaoqwO5allUfU/uJvq1d6i6shg67MN8j95w3F/gvi2v461h1qHQpa71c53AduY7AZ/XxOz0Wiq0NTVaYlaSxZU7LnsPT0jWpX+WLLp9ocC1VysjYOcTRXVkoBau/nH+YmZf3kptBQWK4XI3BluCu0V556ZZt1C46Z+sqvcr8wB3G8ydVrXttWus/6bHBZdsyTR2myrL7kbGXTaptL4U1jqEm/p0nC0xSz/mOP8/WXpFpU+Xpq1xvyjMllTe2QghCEgAhCEAFhCEAM/X1shLouayPvgf3mRQMa+7fZl/edPjI3GRMbiWkTTut1WQG+6R28ybr+Gh8S/tEFmn09uibSPQj6dtzXsFO+envG0aPT6LTsmm09VCt1WtQP18wqffcxmstcrzVoXWvdgvWZeXo3cNMma09+klqZWGNj6TIs17NXlULNjZTsZZ0aai3lsvQVYBwFOYqfsapSRdcIu+JXstOesS601nlt2HZuxkDnJ2MlsmEvorvlT5lTVsPsVgZiByncHv2lkr9w5jK+RiysAeXBwYJtdEUk2Z2krNek5nGAp5gD/nmbPw7ofmn5tgzWh/UzPs5tbqxRQOfB3x3M67QaVdHpVqX3PvNONcJ3+mLPfOtfhZiRYkkpCEIkAFhCEAFhCEAFkGto+0aR6x+LqvuJNFg1v0CbT2jlMWAfdXMamrTQ6cvrA6KDl7OUlQfUjpNfWVfI1POB/p2HI9D3EiKglgQCGG48zNx0zof9Oa2U01Wiu5balazO4ZKiQY7Ua40VfMfT2Vp2a3CZ9h1P0Ei/6XXST9lssoVjkrWxA/QGSU8OpWz5jg2P+Zt/7yfRP8lPS/beI2NdqANPpR/DqA+9Z6tnoPSaC6VK6UA6gDrLBHKJDZaFQbxWRt/CtfgAict823U8QusrdgjHGxxsOk2ddqDZzVoe25mrwb4bGlZLtYysQMitdxn18y/Br22UeQ2kkiT4f4S1CC+8Mj9UAOD9ZvxFVUUKgAUdAO0WWt7MoRIQikhCEIAEIQgAsIkWABFiRZJAy2tLazXYMqZj6rT6jSnnVTdUO6jcD1E25W1ut02goN2ruWtO2ep9h3iuOY85OHv4Z9NqOgZSCD3EezjHWc0nEk4jqdXquFF66lswyONicbkCJZrNWw5WcD2EorcPTNkJZJVL6amv1y1ryqcsZlWamyzYEj1kIUs2SSSe5lmqrJlfZckkMWrFZ8mdpw+8anQVWjclQG9COs5bk5mxjYTL4pTfXWdTo9VZpb6QSHRiAR4MuxNKtP6Z88up2u0ejRJw3AvjRwUo4uOZTsL1G4/9gOvuJ3COtiK6MGVhkMDkETVeOoemc/HknItoWJFiSssCEIQAIRIsACLEgSAMk4AgAsZddVRWXvsWtR3Y4nP8V+JFqJq0OGI2Nh6fQTltVrLtTYXusZ2Pcmasfj1Xt+jHk8qY9T7Oo4l8VUUKy6Kv5r/nfYfp1M4viuq1PEbHs1FpZ2+6PC58eItgypjSAw9+mP2mucUwvRhvPVv+ujpeDaJNJUqVoBWVxJr9KMkY9pFwniNV9CVWuqXAY32Deomo6cwGROFcVNars9PjyRcqofozKtMebAEn+WFHKOp6y6tfIuw3lPU6vS6QE3Wrz/lG5/SRMunpDValbp6QoTC5nMcc14uJ09Byg/GR/N7ekl4lxe3VKa6Qaqj67t7zFcgDJ2H9QZ0/H8Ry+d9nG8vzla4Y+v0hfYbdTNHhPGuIcKIGmuPyu9T7qfp2+koIjO3MRvLArGJvcprTOXNuXtHecK+L9FqwE1g+y2+Scofr2+s6NWDqGUhlIyCDkGePmrxNHhXGddwpx8mzmq71Pup/4+kyZPGXcm3F5b6s9QhM3g/GNNxagvSeWxfx1sd1/wCR6zSmJpy9M6E0qW0EIEYODCQSE5j4o4oVY6KhsAfxSO/pN/XaldHordQ38i5A8ntPNr9Q1lzO5yzEsT5M1eNj5Pk/hj8vLxnivoM2YwmIDkRDOgcoXOZHnlOD+E9/EfEkgJkEDwd/p2ktes1NS4rvsXC5wGMrlOuDjPiNPPvuN9ukhyn2SqqemW7ddqnDB9RawAzguZWc7t5/EI0lyTuNxjpGFSx3JMFKXQOqrtiO43C753GOxjVrLtzPJVQDtJMSRRoGBtFxFiGABI7D1A+seTtt1PSMfYYECRdDrLtBrK9Rp3Kuh+h9D6T1Phmur4jw+rVVbBxuv5T3E8jbrOs+Atey66zQMSUtHOnow6/0/tMvkY+U8l2jb4uXjXF9M//Z";
      visage.alt = "";
      visage.setAttribute("aria-hidden", "true");
      const mots = el("span", "methode-lien-mots");
      mots.append(
        el("span", "methode-lien-kicker", "General public"),
        el("span", "methode-lien-label", "See the plain-language version")
      );
      const fleche = el("span", "methode-lien-fleche", "→");
      fleche.setAttribute("aria-hidden", "true");
      lienLecture.append(visage, mots, fleche);
      // Lien déplacé dans le bandeau libre au-dessus du sommaire et du titre.
      // Aucun changement aux menus ni à la navigation des chapitres.
      section.dataset.lectureDisponible = "oui";
      section.__lienLecture = lienLecture;
    }
    const corps = el("div", "gab-corps");
    if (ch.surPlace) {
      Array.from(section.childNodes).forEach((x) => corps.append(x));
    } else {
      if (ch.titreEl && ch.titreEl.tagName !== "SUMMARY") ch.titreEl.remove();
      let source = ch.source;
      if (source.tagName === "LI") {
        const div = el("div", source.className);
        Array.from(source.childNodes).forEach((x) => div.append(x));
        source.remove();
        source = div;
      }
      source.classList.add("gab-source");
      if (salle === "logiciels") source.classList.remove("gab-intro");
      // Une page unique conserve ses images dans le contenu : aucune photo
      // n'est transférée dans la colonne latérale pour ce type de rubrique.
      if (!REGLES[salle]?.unique && ch.photoInterne && ch.choix?.interne) $$("img", source).find((im) => absolue(im.getAttribute("src")) === ch.photoInterne)?.closest("picture, img")?.remove();
      corps.append(source);
    }

    // La page Contexte ouvre sur le titre complet du projet de thèse.
    if (salle === "recherche" && langue === "fr" && ch.cle === "contexte" &&
        !corps.querySelector(".these-titre-contexte")) {
      const titreThese = el("div", "these-titre-contexte",
        '<span class="these-titre-contexte-label">Thesis title</span>' +
        '<div class="these-titre-contexte-principal">Organizing the intersectoral primary care and services response to the needs of older adults living at home with a loss of autonomy and co-occurring social needs: configurations, mobilizable resources and mobilized networks</div>');
      corps.prepend(titreThese);
    }
    texte.append(tete, corps);
    const aside = el("aside", "gab-chapitre-aside");
    // Dans le contexte de la thèse, le visuel de chiffres clés du premier chapitre
    // figure déjà dans le corps : ne pas le dupliquer au-dessus du sommaire.
    if (choix.url && !(salle === "recherche" && ch.cle !== "methodes") && salle !== "vulgarisation" && !REGLES[salle]?.unique && !(salle === "educateur" && langue === "fr") && !(salle === "biographie" || salle === "parcours") && !(salle === "recherche" && i === 0) && !(salle === "recherche" && ch.cle === "transfert")) {
      const credit = choix.image ? `${T.photo} : ${echapper(choix.image.auteur || "")}${choix.image.licence ? " · " + echapper(choix.image.licence) : ""}` : "";
      const alt = choix.alt || (langue === "fr" && choix.image?.alt ? choix.image.alt : "");
      aside.innerHTML = `<div class="gab-photo"><img src="${echapper(choix.url)}" alt="${echapper(alt)}" loading="lazy" decoding="async" width="960" height="640">${credit ? `<small class="gab-credit">${choix.image.source_url ? `<a href="${echapper(choix.image.source_url)}" target="_blank" rel="noopener">${credit}</a>` : credit}</small>` : ""}</div>`;
    }
    const nav = fabriquerSommaire(corps, salle, ch, i);
    if (nav) {
      aside.append(nav);
      if (nav.classList.contains("gab-sommaire-universel")) grille.classList.add("gab-menu-universel");
    }
    // Thèse : seul le sommaire migre à gauche ; l'illustration reste
    // dans la colonne de lecture, suffisamment large pour les cartes.
    if ((salle === "recherche" || (salle === "vulgarisation" && langue === "fr")) && aside.querySelector(".gab-sommaire-chapitre")) {
      const photo = aside.querySelector(".gab-photo");
      if (photo && salle === "recherche" && ch.cle === "retombees") {
        // Uniquement la photographie d'illustration des Retombées :
        // conserver le titre avant l'image et limiter sa place.
        const titreRetombees = $(".r-retombees > h3", corps);
        if (titreRetombees) titreRetombees.after(photo);
        else tete.after(photo);
        photo.style.width = "min(100%, 440px)";
        photo.style.maxWidth = "440px";
        photo.style.margin = "16px 0 26px auto";
        const illustration = $("img", photo);
        if (illustration) {
          illustration.style.width = "100%";
          illustration.style.height = "auto";
          illustration.style.maxHeight = "260px";
          illustration.style.objectFit = "cover";
        }
      } else if (photo && salle === "recherche" && langue === "fr" && ch.cle === "methodes") {
        // La carte de proximité illustre l'analyse spatiale O2, pas l'en-tête général.
        const cible = $("#methode-o2-7 > .capture-methode", corps);
        if (cible) {
          cible.after(photo);
          photo.style.width = "100%";
          photo.style.margin = "16px 0 26px";
          const carte = $("img", photo);
          if (carte) {
            carte.style.width = "100%";
            carte.style.height = "auto";
            carte.style.maxHeight = "none";
            carte.style.aspectRatio = "auto";
            carte.style.objectFit = "contain";
          }
        } else photo.remove();
      } else if (photo) tete.after(photo);
      grille.classList.add("gab-menu-gauche");
    }
    // Le Nota Bene est un élément de fin de chapitre : après O1–O3 et
    // hors des vues d'objectif / du menu, immédiatement avant la navigation.
    const estChapitreMethode = salle === "recherche" && langue === "fr" && ch.cle === "methodes";
    let nota = estChapitreMethode ? corps.querySelector(".these-exemples-attribution") : null;
    // Uniquement en fin du chapitre Méthodologie, jamais en page de garde.
    // Ne jamais réserver une colonne vide à l’ancien menu latéral.
    grille.append(texte);
    if (aside.hasChildNodes() || ["recherche", "implantation", "vulgarisation"].includes(salle)) {
      grille.append(aside);
    } else {
      grille.classList.add("gab-sans-aside");
    }
    section.append(grille);
    if (section.__lienLecture) {
      const ligneLecture = el("div", "gab-methode-ligne-lecture");
      ligneLecture.append(section.__lienLecture);
      section.prepend(ligneLecture);
      delete section.__lienLecture;
    }
    if (nota) {
      nota.removeAttribute("hidden");
      nota.style.setProperty("display", "block", "important");
      nota.style.setProperty("font-size", "9pt", "important");
      nota.style.setProperty("line-height", "1.5", "important");
      nota.style.setProperty("text-align", "justify", "important");
      nota.style.setProperty("width", "100%");
      nota.style.setProperty("margin", "20px 0 6px", "important");
      nota.style.setProperty("padding", "10px 0 0", "important");
      nota.style.setProperty("border-top", "1px solid #e4e9ec", "important");
      nota.style.setProperty("color", "#596977", "important");
      section.append(nota);
    }
    // Navigation de fin de page : on passe à une autre vue, jamais au
    // chapitre suivant dans une longue page continue.
    const bas = el("nav", "gab-bas-chapitre");
    bas.setAttribute("aria-label", T.chapitre(i + 1, n));
    bas.innerHTML =
      `<button type="button" class="gab-bas-lien gab-bas-precedent" data-gab-pas="-1"${i === 0 ? " disabled" : ""}><span class="gab-bas-chevron" aria-hidden="true">‹</span><span class="gab-bas-libelle"><strong class="gab-nav-cible"></strong></span></button>` +
      `<button type="button" class="gab-bas-sommaire" data-gab-pas="tous">${echapper(T.tous)}</button>` +
      `<button type="button" class="gab-bas-lien gab-bas-suivant" data-gab-pas="1"${i === n - 1 ? " disabled" : ""}><span class="gab-bas-libelle"><strong class="gab-nav-cible"></strong></span><span class="gab-bas-chevron" aria-hidden="true">›</span></button>`;
    // Éducation spécialisée (FR) : conserver la navigation native de la porte
    // Parcours. Seul le contrôle central devient l'intitulé du chapitre.
    // Aucun changement au découpage, à la destination des flèches ni aux autres salles.
    if (salle === "educateur" && langue === "fr") {
      bas.classList.add("educ-bas-nav");
      const sommaire = $(".gab-bas-sommaire", bas);
      if (sommaire) {
        const titreActuel = el("span", "gab-bas-centre",
          "<small>Current chapter</small><strong>Specialized education</strong>");
        sommaire.replaceWith(titreActuel);
      }
    }
    section.append(bas);
    return section;
  }

  // Un conteneur vidé de ses chapitres disparaît, avec l'intertitre qui l'annonçait.
  const titreSeul = (c) => c.matches(".titre-bloc, h2, h3, h4, header:empty") || (c.matches("header") && Array.from(c.children).every((x) => x.matches("h2, h3, h4, p")));
  function nettoyer(depuis, limite) {
    let x = depuis;
    while (x && x !== limite && limite.contains(x)) {
      const parent = x.parentElement;
      const restants = Array.from(x.children).filter((c) => !titreSeul(c));
      if (!restants.length && !net(Array.from(x.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join(""))) x.remove();
      else break;
      x = parent;
    }
  }

  // Un grand titre repris tel quel d'une salle précédente de la même porte n'est gardé que dans la première.
  const premierTitre = new Map();
  function noterTitres() {
    $$("section.section[data-salle] > .section-contenu").forEach((sc) => {
      const salle = sc.parentElement.dataset.salle, h2 = $(".section-corps h2", sc);
      const cle = `${porteDe(salle)?.dataset.salle}|${normaliser(h2?.textContent)}`;
      if (h2 && !premierTitre.has(cle)) premierTitre.set(cle, salle);
    });
  }

  // Mise en page de la présentation du devis : deux principes clairement
  // séparés, sans modifier ni supprimer les formulations du protocole.
  function mettreDevisEnCartes(sc) {
    sc.querySelectorAll(".these-protocole-detail").forEach((protocole) => {
      const titre = $(":scope > h4", protocole);
      const liste = $(":scope > ul.puces", protocole);
      if (!titre || !liste || liste.dataset.devisCartes || liste.children.length !== 2) return;
      const enveloppe = el("section", "these-devis-visuel");
      const grille = el("div", "these-devis-grille");
      Array.from(liste.children).forEach((li, i) => {
        const libelle = $(":scope > b", li);
        if (!libelle) return;
        const carte = el("article", "these-devis-carte");
        carte.dataset.devis = i === 0 ? "sequence" : "posture";
        const entete = el("div", "these-devis-carte-entete");
        const numero = el("span", "these-devis-num", deux(i + 1));
        numero.setAttribute("aria-hidden", "true");
        const titreCarte = el("h5", "these-devis-carte-titre", echapper(net(libelle.textContent)));
        entete.append(numero, titreCarte);
        carte.append(entete);
        if (i === 0) {
          const fil = el("div", "these-devis-phases");
          fil.setAttribute("aria-hidden", "true");
          fil.innerHTML = '<span>O1</span><i>→</i><span>O2</span><i>→</i><span>O3</span>';
          carte.append(fil);
        }
        const description = el("p", "these-devis-description");
        Array.from(li.childNodes).filter((noeud) => noeud !== libelle)
          .forEach((noeud) => description.append(noeud));
        if (description.firstChild?.nodeType === 3)
          description.firstChild.textContent = description.firstChild.textContent.replace(/^\s*[:：]\s*/, "");
        carte.append(description);
        grille.append(carte);
      });
      if (grille.children.length !== 2) return;
      titre.before(enveloppe);
      titre.classList.add("these-devis-titre");
      enveloppe.append(titre, grille);
      liste.remove();
    });
  }

  function transformer(sc) {
    if (!sc || sc.classList.contains("gab")) return;
    const salle = salleDe(sc);
    if (!salle) return;
    const porte = porteDe(salle);
    const bandeau = $(":scope > .bandeau", sc);
    const corps = $(":scope > .section-corps", sc);
    if (!corps) return;
    if (salle === "recherche") {
      mettreDevisEnCartes(sc);
      const labels = {"fr":"Summary","en":"Overview of the three objectives","es":"Síntesis de los tres objetivos","zh":"三个目标概述","ar":"ملخص الأهداف الثلاثة","ru":"Обзор трёх целей"};
      sc.querySelectorAll(".these-vulgarisation-ensemble").forEach(bloc => {
        if (bloc.querySelector(":scope > .methode-recapitulatif")) return;
        const details = el("section", "methode-recapitulatif methodo-synthese-visible");
        details.append(el("h4", "", echapper(labels[langue] || labels.fr)));
        while (bloc.firstChild) details.append(bloc.firstChild);
        bloc.append(details);
      });
    }
    const photoSalle = photoDuBandeau(bandeau);
    const { mode, table, chapitres } = decouper(sc, salle);

    // Introduction : un seul chapeau, sans surtitre (le bandeau dit déjà où l'on est).
    const intro = Array.from(corps.children).find((c) => !c.matches(".gab-lecture-integrale") && (c.querySelector("h2") || c.matches(".colonne-texte")));
    if (intro) {
      intro.classList.add("gab-intro");
      $$(":scope > .surtitre", intro).forEach((s) => s.remove());
      const h2 = $(":scope > h2", intro);
      const cleTitre = `${porte?.dataset.salle}|${normaliser(h2?.textContent)}`;
      if (h2 && premierTitre.has(cleTitre) && premierTitre.get(cleTitre) !== salle) h2.remove();
      if (!intro.children.length && !net(intro.textContent)) intro.remove();
      const blocs = Array.from(intro.children).filter((c) => !c.matches(".implantation-portail-accueil"));
      if (blocs.length <= 3 && blocs.every((c) => c.matches("h2, p.intro, p.sous-titre"))) intro.classList.add("gab-intro-duo");
    }

    // Images : une par chapitre, sans doublon dans la salle.
    const prises = new Set();
    chapitres.forEach((ch, i) => {
      ch.extrait = net(ch.source.textContent).slice(0, 300);
      if (!parTitre.has(`${salle}|${normaliser(ch.titre)}`)) ch.photoInterne = premiereImage(ch.source);
      // Ma thèse : associer les visuels aux deux chapitres concernés,
      // plutôt que de laisser la correspondance automatique choisir un hors-sujet.
      ch.choix = choisirImage(ch, salle, porte?.dataset.salle, prises, photoSalle);
      if (ch.choix.image) prises.add(ch.choix.image.fichier);
    });

    // Chapitres.
    const n = chapitres.length;
    // Les rubriques de CV se lisent directement, sans sommaire de chapitre.
    if (n === 1 && SALLES_ENGAGEMENTS.includes(salle)) sc.classList.add("gab-cv-direct");
    if (mode === "rubriques") {
      table.classList.add("gab-chapitres");
      chapitres.forEach((ch, i) => {
        const s = construireChapitre(ch, i, n, COULEURS[i % COULEURS.length], ch.choix, salle);
        if (!ch.surPlace) table.append(s);
      });
    } else if (mode === "elements" && n) {
      const conteneur = el("div", "gab-chapitres");
      const premier = chapitres[0].ancre || chapitres[0].source;
      let repere = premier.isConnected ? premier : null;
      while (repere && repere.parentElement && repere.parentElement !== sc && !repere.parentElement.matches(".colonne-outils, .section-corps")) repere = repere.parentElement;
      const parents = chapitres.map((c) => c.source.parentElement).filter(Boolean);
      if (repere) repere.before(conteneur); else corps.append(conteneur);
      chapitres.forEach((ch, i) => conteneur.append(construireChapitre(ch, i, n, COULEURS[i % COULEURS.length], ch.choix, salle)));
      if (chapitres[0].ancre?.isConnected && !chapitres[0].ancre.children.length) chapitres[0].ancre.remove();
      parents.forEach((p) => p.isConnected && nettoyer(p, sc));
    }
    // L’introduction du laboratoire appartient au premier chapitre, sans se répéter avant chaque vue.
    if (salle === "vulgarisation") {
      const premierCorps = $(".gab-chapitre .gab-corps", sc);
      const intro = $(".vs-hero", sc), galerie = $(".vul-galerie", sc);
      if (premierCorps && intro) premierCorps.prepend(intro);
      if (premierCorps && galerie) premierCorps.append(galerie);
    }
    if (mode === "unique") sc.classList.add("gab-unique");

    // Publications : tous les blocs sont visibles, les tuiles remplacent les onglets de formats.
    if (salle === "publications") {
      $$(".pub-formats", sc).forEach((x) => x.remove());
      $$("[data-publications-annonce]", sc).forEach((x) => (x.closest(".pub-en-cours") || x).remove());
      $$(".publications-page", sc).forEach((p) => p.classList.replace("publications-page", "gab-publications"));
      $$(".publication-bloc", sc).forEach((b) => (b.hidden = false));
    }
    // Littérature : chaque thème garde sa liste repliable, sous forme de bouton.
    $$("details.lecture-theme.gab-source", sc).forEach((d) => {
      const s = $("summary", d);
      const nombre = (net(s?.textContent).match(/(\d+)\s*$/) || [])[1] || $$("li", d).length;
      if (s) s.textContent = T.afficher(nombre);
    });

    // Bandeau : porte, numéro, titre, légende, chiffres.
    if (bandeau) {
      bandeau.classList.add("gab-bandeau");
      if (photoSalle) bandeau.style.setProperty("--gab-photo", `url("${photoSalle}")`);
      const texte = $(".bandeau-texte", bandeau);
      const num = $(".bandeau-num", bandeau);
      if (num && porte && !$(".gab-k-porte", num)) num.innerHTML = `<span class="gab-k-porte">${echapper(porte.dataset.titre)} · </span>${echapper(sc.dataset.numero || num.textContent)}`;
      const motsLus = net(sc.textContent).split(" ").length;
      const minutes = Math.max(1, Math.round(motsLus / 210));
      if (texte) {
        const puces = el("span", "gab-puces");
        if (n >= 2) puces.append(el("span", "", echapper(salle === "recherche" && langue === "fr" ? `${n} thesis chapters` : T.chapitres(n))));
        if (minutes <= 90) puces.append(el("span", "", echapper(T.minutes(minutes))));
        if (puces.children.length) texte.append(puces);
      }
      bandeau.classList.remove("revele");
      $$(".revele", bandeau).forEach((x) => x.classList.remove("revele"));
    }

    // Tuiles des chapitres, juste sous le bandeau.
    if (n >= 1) {
      const programme = el("nav", "gab-programme");
      const titreProgramme = salle === "recherche" && langue === "fr" ? "The chapters of my thesis" : T.programme;
      const aideProgramme = salle === "recherche" && langue === "fr" ? "Choose a chapter" : T.aide;
      programme.setAttribute("aria-label", titreProgramme);
      const colonnes = n <= 4 ? n : n <= 6 ? 3 : n <= 12 ? 4 : 5;
      const vides = Math.ceil(n / colonnes) * colonnes - n;
      programme.style.setProperty("--gab-colonnes", colonnes);
      programme.innerHTML = `<div class="gab-programme-tete"><h2>${echapper(titreProgramme)}</h2><span>${echapper(aideProgramme)}</span></div>` +
        `<div class="gab-tuiles">` + chapitres.map((ch, i) => {
          const large = (vides === 1 && i === 0) || (vides === 2 && (i === 0 || i === n - 1)) ? " gab-large" : vides >= 3 && i === 0 ? " gab-grande" : "";
          const vignette = ch.choix.image ? urlVignette(ch.choix.image) : ch.choix.url;
          const photo = vignette ? ` style="--gab-c:${COULEURS[i % COULEURS.length]};--gab-tuile:url('${echapper(vignette)}')"` : ` style="--gab-c:${COULEURS[i % COULEURS.length]}"`;
          const destination = ch.urlExterne || ("#" + salle + "/" + (ch.cle || `chapitre-${i + 1}`));
          const aller = ch.urlExterne ? "" : ' data-gab-aller="' + i + '"';
          return `<a class="gab-tuile${large}" href="${echapper(destination)}"${aller}${photo} aria-label="${echapper(T.aller(ch.titre))}"><span class="gab-tuile-num">${deux(i + 1)}</span><span class="gab-tuile-titre">${echapper(ch.titre)}</span></a>`;
        }).join("") + `</div>`;
      // Ma thèse : le titre provisoire, le statut et la codirection
      // doivent être lus avant les tuiles. Ne déplacer aucun élément
      // de présentation : insérer simplement le parcours après ce bloc.
      const cadreThese = salle === "recherche" ? $(".these-entete > .these-cadre", corps) : null;
      if (cadreThese) {
        cadreThese.after(programme);
      } else {
        (bandeau || corps).after(programme);
        if (!bandeau) corps.before(programme);
      }
    }

    sc.dataset.gabSalle = salle;
    sc.dataset.gabChapitres = n;
    sc.classList.add("gab");
    // La page publique (hors salle immersive) doit elle aussi montrer
    // un seul chapitre dès l'ouverture : le chapitre demandé ou le premier.
    if (n && !sc.closest("#salle")) {
      const index = chapitreDansAdresse(sc, chapitresDe(sc));
      ouvrirPageChapitre(sc, index >= 0 ? index : 0);
    }
  }

  // Ma thèse : retirer seulement les éléments <img> qui affichent
  // EXACTEMENT la même ressource, sans toucher au reste du contenu.
  // Deux fichiers, variantes d'image ou URLs distincts sont conservés.
  function retirerImagesRepeteesThese(zone) {
    if (langue !== "fr" || !zone) return;
    const parImage = new Map();

    $$("img[src]", zone).forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;
      let url;
      try {
        url = new URL(src, D.baseURI).href;
      } catch {
        return;
      }
      // Une variante srcset / picture constitue une représentation différente.
      const picture = img.closest("picture");
      const variantes = [
        img.getAttribute("srcset") || "",
        picture ? $$("source", picture).map((x) =>
          [x.getAttribute("srcset") || "", x.getAttribute("media") || "",
           x.getAttribute("type") || ""].join(":")
        ).join("|") : ""
      ].join("|");
      const identite = JSON.stringify([url, variantes]);
      if (!parImage.has(identite)) parImage.set(identite, []);
      parImage.get(identite).push(img);
    });

    // Préserver la copie la plus utile dans le déroulé scientifique.
    const pertinence = (img) => {
      if (img.closest(".gab-photo")) return -100;
      if (img.closest(".atlas-these-figure")) return -50;
      const chapitre = img.closest(".gab-chapitre");
      if (!chapitre) return 15; // Logos dans l'introduction, notamment.
      const rubrique = chapitre.dataset.rubrique;
      if (rubrique === "methodes") return 40;
      if (rubrique === "objectifs") return 35;
      if (rubrique === "contexte") return 30;
      if (rubrique === "retombees") return 25;
      return 20;
    };

    parImage.forEach((images) => {
      if (images.length < 2) return;
      const garder = images.reduce((a, b) =>
        pertinence(b) > pertinence(a) ? b : a
      );
      images.forEach((img) => {
        if (img === garder || !img.isConnected) return;
        // Ne retirer aucun titre, paragraphe, légende, figure,
        // lien, schéma différent, ni même un texte dans la figure.
        // Seul le rendu de l'image strictement identique est supprimé.
        const picture = img.closest("picture");
        if (picture && $$("img", picture).length === 1) {
          picture.remove();
        } else {
          img.remove();
        }
      });
    });
  }

  // ---------- Navigation ----------
  const salle = $("#salle");
  const contenu = salle && $(".salle-contenu", salle);
  const barre = salle && $(".salle-barre", salle);
  let lecture = null, observateur = null, courant = 0;

  function defiler(cible) {
    if (!cible) return;
    cible.scrollIntoView({ block: "start", behavior: "instant" });
  }
  const chapitresDe = (zone) => $$(".gab-chapitre", zone).filter((c) => c.closest(".gab") === zone);

  // Montrer la destination réelle sur les deux navigations (haut et bas),
  // plutôt qu'une flèche sans indication. Titres lus dans les chapitres existants.
  // Le titre peut figurer dans le bandeau du chapitre, sans h3 dédié.
  const nomChapitre = (chapitre) => chapitre
    ? net($(".gab-chapitre-titre", chapitre)?.textContent) || net(chapitre.dataset.gabTitre)
    : "";
  const navigationParPorte = (zone) => ["engagements", "ressources", "parcours"].includes(porteDe(zone.dataset.gabSalle)?.dataset.salle);
  function chapitresDeLaPorte(zone) {
    const salles = (porteDe(zone.dataset.gabSalle)?.dataset.sections || "").split(/\s+/).filter(Boolean);
    return salles.flatMap((nom) => {
      const section = $$("section.section[data-salle]").find((s) => s.dataset.salle === nom);
      const source = nom === zone.dataset.gabSalle ? zone : section && $(".section-contenu.gab", section);
      const chapitre = source && chapitresDe(source)[0];
      return chapitre ? [{ zone: source, chapitre, index: 0, externe: source !== zone, titre: section.dataset.titre }] : [];
    });
  }
  function positionDansPorte(zone, chapitre) {
    if (!navigationParPorte(zone)) return { index: chapitresDe(zone).indexOf(chapitre), total: chapitresDe(zone).length };
    const liste = chapitresDeLaPorte(zone);
    const index = liste.findIndex((c) => c.zone === zone);
    return { index: index < 0 ? chapitresDe(zone).indexOf(chapitre) : index, total: liste.length || chapitresDe(zone).length };
  }
  // Ces trois portes ont pour chapitres les rubriques du panneau du hall.
  // Recherche et Savoirs en action conservent leur découpage interne.
  function chapitreVoisin(zone, liste, index, sens) {
    if (navigationParPorte(zone)) {
      const chapitres = chapitresDeLaPorte(zone);
      return chapitres[chapitres.findIndex((c) => c.zone === zone) + sens] || null;
    }
    const chapitre = liste[index + sens];
    return chapitre ? { zone, chapitre, index: index + sens, externe: false } : null;
  }
  function ouvrirDestinationChapitre(destination) {
    if (destination.externe) location.hash = "#" + destination.zone.dataset.gabSalle + "/" + destination.chapitre.dataset.gabSlug;
    else ouvrirPageChapitre(destination.zone, destination.index, { adresse: true, haut: true });
  }
  function sommaireDeLaPorte(zone) {
    const programme = el("nav", "gab-programme gab-programme-porte");
    programme.setAttribute("aria-label", T.tous);
    programme.style.setProperty("--gab-colonnes", 3);
    programme.innerHTML = '<div class="gab-programme-tete"><h2>' + echapper(T.tous) + '</h2></div><div class="gab-tuiles"></div>';
    const tuiles = $(".gab-tuiles", programme);
    chapitresDeLaPorte(zone).forEach((destination, i) => {
      const tuile = $(".gab-tuile", destination.zone)?.cloneNode(true) || el("a", "gab-tuile");
      tuile.removeAttribute("data-gab-aller");
      tuile.className = "gab-tuile";
      tuile.href = "#" + destination.zone.dataset.gabSalle + "/" + destination.chapitre.dataset.gabSlug;
      tuile.innerHTML = '<span class="gab-tuile-num">' + deux(i + 1) + '</span><span class="gab-tuile-titre">' + echapper(destination.titre) + '</span>';
      tuile.setAttribute("aria-label", T.aller(destination.titre));
      tuile.addEventListener("click", (ev) => { ev.preventDefault(); programme.remove(); zone.hidden = false; ouvrirDestinationChapitre(destination); });
      tuiles.append(tuile);
    });
    zone.hidden = true;
    zone.before(programme);
    salle.scrollTo({ top: 0, behavior: "instant" });
  }
  function nommerChapitresVoisins(zone, liste, index) {
    const actif = liste[index];
    if (!actif) return;
    const navigations = navigationParPorte(zone)
      ? liste.map((chapitre) => $(".gab-bas-chapitre", chapitre))
      : [$(".gab-bas-chapitre", actif)];
    if (lecture && contenu && $(".gab", contenu) === zone) navigations.push(lecture);
    navigations.filter(Boolean).forEach((nav) => {
      [-1, 1].forEach((sens) => {
        const bouton = $("[data-gab-pas='" + sens + "']", nav);
        if (!bouton) return;
        const dansPorte = navigationParPorte(zone);
        const voisin = chapitreVoisin(zone, liste, index, sens);
        const action = sens < 0 ? T.precedent : T.suivant;
        const titre = dansPorte ? voisin?.titre : nomChapitre(voisin?.chapitre);
        const destination = voisin ? deux((dansPorte ? positionDansPorte(voisin.zone, voisin.chapitre).index : voisin.index) + 1) + " · " + titre : "";
        bouton.disabled = !voisin;
        bouton.hidden = !voisin;
        const cible = $(".gab-nav-cible, .gab-fleche-cible", bouton);
        if (cible) cible.textContent = nav === lecture ? (titre || "") : destination;
        const annonce = destination ? action + " : " + destination : action;
        bouton.setAttribute("aria-label", annonce);
        if (destination) bouton.title = annonce;
        else bouton.removeAttribute("title");
      });
    });
  }

  // Un fragment désigne sa propre page de chapitre ; les anciens liens
  // #salle/rubrique et les ancres internes continuent de fonctionner.
  function chapitreDansAdresse(zone, liste) {
    const [destination, segment] = location.hash.slice(1).split("/");
    if (destination !== zone.dataset.gabSalle || !segment) return -1;
    let repere;
    try { repere = decodeURIComponent(segment); } catch { repere = segment; }
    if (destination === "logiciels" && repere === "chapitre-3") return 0;
    return liste.findIndex((chapitre) =>
      chapitre.dataset.gabSlug === repere ||
      chapitre.dataset.rubrique === repere ||
      chapitre.id === repere ||
      $$("[data-rubrique], [data-axe-cible], [id]", chapitre).some((element) =>
        element.dataset.rubrique === repere || element.dataset.axeCible === repere || element.id === repere));
  }

  function reglerLienGrandPublic(zone) {
    const lien = $(".methode-lien-grand-public", zone);
    if (!lien) return;
    const surVulgarisee = /\/methode-vulgarisee\.html$/i.test(location.pathname) && zone.dataset.chapitreOuvert === "methodes";
    const kicker = $(".methode-lien-kicker", lien);
    const label = $(".methode-lien-label", lien);
    if (surVulgarisee) {
      lien.href = "./index.html#recherche/methodes";
      if (kicker) kicker.textContent = "Version scientifique";
      if (label) label.textContent = "Return to the scientific version";
      lien.setAttribute("aria-label", "Read the scientific methodology");
    } else {
      lien.href = "./methode-vulgarisee.html#recherche/methodes";
      if (kicker) kicker.textContent = "General public";
      if (label) label.textContent = "See the plain-language version";
      lien.setAttribute("aria-label", "Read the plain-language methodology");
    }
  }

  function ouvrirPageChapitre(zone, index, options = {}) {
    if (!zone) return;
    if (options.adresse) window.ebNavigation?.memoriser();
    zone.hidden = false;
    $(".gab-programme-porte", zone.parentElement)?.remove();
    const liste = chapitresDe(zone);
    if (!liste.length) return;
    const cible = index >= 0 && index < liste.length ? index : -1;
    const ouverte = cible >= 0;
    zone.classList.toggle("gab-rubrique-complete", navigationParPorte(zone));
    liste.forEach((chapitre, i) => {
      const visible = ouverte && (navigationParPorte(zone) || i === cible);
      if (ouverte && i === cible) zone.dataset.chapitreOuvert = chapitre.dataset.gabSlug || "";
      chapitre.hidden = !visible;
      chapitre.inert = !visible;
      chapitre.classList.toggle("gab-page-active", ouverte && i === cible);
      if (navigationParPorte(zone)) {
        // Tout le contenu de la rubrique se lit dans le même chapitre.
        // Une seule navigation de fin, après la dernière subdivision.
        const bas = $(".gab-bas-chapitre", chapitre);
        if (bas) bas.hidden = i < liste.length - 1;
        if (i === 0) {
          const numero = $(".gab-chapitre-num b", chapitre);
          if (numero) numero.textContent = deux(positionDansPorte(zone, chapitre).index + 1);
        }
      }
    });
    liste.forEach(chapitre => {
      $$('a[href^="#"]', chapitre).forEach(lien => {
        if (lien.matches("[data-gab-aller], [data-these-vers]")) return;
        const repere = lien.dataset.gabAncre || lien.getAttribute("href").slice(1);
        if (!$$("[id]", chapitre).some(x => x.id === repere)) return;
        lien.dataset.gabAncre = repere;
        lien.href = "#" + zone.dataset.gabSalle + "/" + chapitre.dataset.gabSlug + "/" + encodeURIComponent(repere);
      });
    });
    zone.classList.toggle("gab-page-chapitre", ouverte);
    zone.classList.toggle("gab-page-sommaire", !ouverte);
    reglerLienGrandPublic(zone);
    if (ouverte) nommerChapitresVoisins(zone, liste, cible);
    $$(".gab-tuile[data-gab-aller]", zone).forEach((tuile, i) => {
      if (ouverte && i === cible) tuile.setAttribute("aria-current", "page");
      else tuile.removeAttribute("aria-current");
    });
    if (lecture && zone === $(".gab", contenu)) {
      if (ouverte) {
        marquer(cible);
      }
      salle.classList.toggle("gab-page-chapitre", ouverte);
      salle.classList.toggle("gab-lit", ouverte);
    }
    const dansSalle = !!(contenu && contenu.contains(zone));
    const dansPageLibre = !dansSalle && !!zone.closest("section.section[data-salle]");
    if (options.adresse && (dansSalle || dansPageLibre)) {
      const fragment = "#" + zone.dataset.gabSalle + (ouverte ? "/" + liste[cible].dataset.gabSlug : "");
      if (location.hash !== fragment) {
        try { history.pushState(null, "", location.pathname + location.search + fragment); }
        catch { location.hash = fragment; }
      }
    }
    if (options.adresse) window.ebNavigation?.actualiser();
    if (options.haut && dansSalle && salle) salle.scrollTo({ top: 0, behavior: "instant" });
    else if (options.haut && dansPageLibre) {
      ($(".gab-chapitres", zone) || zone).scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  D.addEventListener("click", (ev) => {
    const tuile = ev.target.closest("[data-gab-aller]");
    if (tuile) {
      const zone = tuile.closest(".gab");
      const cible = chapitresDe(zone)[+tuile.dataset.gabAller];
      if (!cible) return;
      ev.preventDefault();
      ouvrirPageChapitre(zone, +tuile.dataset.gabAller, { adresse: true, haut: true });
      return;
    }
    const basculeSommaire=ev.target.closest(".gab-sommaire-basculer");
    if(basculeSommaire){
      const nav=basculeSommaire.closest(".gab-sommaire-chapitre"), ouvert=nav.dataset.gabReplie!=="non";
      nav.dataset.gabReplie=ouvert?"non":"oui";basculeSommaire.setAttribute("aria-expanded",String(ouvert));return;
    }
    const ancreLocale = ev.target.closest('.gab a[href^="#"]');
    const inter = ev.target.closest("[data-gab-intertitre], [data-gab-cible]") ||
      (ancreLocale && !ancreLocale.matches("[data-gab-aller], [data-these-vers]") ? ancreLocale : null);
    if (inter) {
      ev.preventDefault();
      const chapitre = inter.closest(".gab-chapitre");
      if (!chapitre) return;
      const idLocal = inter.dataset.gabAncre || inter.getAttribute("href")?.slice(1);
      const cible = !inter.dataset.gabCible && !inter.hasAttribute("data-gab-intertitre")
        ? $$("[id]", chapitre).find(x => x.id === idLocal)
        : inter.dataset.gabCible
        ? $$("[id]", chapitre).find((x) => x.id === inter.dataset.gabCible)
        : $$("h4", $(".gab-corps", chapitre)).filter((x) => !x.closest("details:not([open]), [hidden], .gab-source.carte-vitrine"))[+inter.dataset.gabIntertitre];
      if (cible) {
        const zone = chapitre.closest(".gab");
        window.ebNavigation?.memoriser();
        const fragment = "#" + zone.dataset.gabSalle + "/" + chapitre.dataset.gabSlug + "/" + encodeURIComponent(cible.id);
        if (location.hash !== fragment) history.pushState(null, "", location.pathname + location.search + fragment);
        window.ebNavigation?.actualiser();
        const vue = cible.closest(".these-objectif-vue[data-vue-objectif]");
        if (vue?.hidden) {
          const code = vue.dataset.vueObjectif;
          const selection = chapitre.querySelector('.these-methode-parcours[data-objectifs-isoles="oui"] a[data-objectif="' + code + '"]');
          if (selection) selection.click();
        }
        Array.from(chapitre.querySelectorAll("details")).filter((d) => d.contains(cible)).forEach((d) => { d.open = true; });
        defiler(cible);
        window.ebNavigation?.memoriser();
      }
      return;
    }
    const these = ev.target.closest(".gab [data-these-vers]");
    if (these) {
      const zone = these.closest(".gab");
      const volet = chapitresDe(zone).find((c) => c.dataset.rubrique === these.dataset.theseVers);
      const article = these.dataset.theseObjectif && volet ? $$("article[data-objectif]", volet).find((a) => a.dataset.objectif === these.dataset.theseObjectif) : null;
      if (volet) ouvrirPageChapitre(zone, chapitresDe(zone).indexOf(volet), { adresse: true, haut: true });
      defiler(article || volet);
      return;
    }
    const pas = ev.target.closest("[data-gab-pas]");
    if (pas) {
      const zone = pas.closest(".gab") || (contenu && $(".gab", contenu));
      if (!zone) return;
      if (pas.dataset.gabPas === "tous") {
        if (navigationParPorte(zone)) { if (!$(".gab-programme-porte", zone.parentElement)) sommaireDeLaPorte(zone); }
        else ouvrirPageChapitre(zone, -1, { adresse: true, haut: true });
      }
      else {
        const liste = chapitresDe(zone);
        const actuel = liste.findIndex((chapitre) => !chapitre.hidden);
        if (actuel >= 0) {
          const sens = Number(pas.dataset.gabPas);
          if (sens !== -1 && sens !== 1) return;
          const voisin = chapitreVoisin(zone, liste, actuel, sens);
          if (!voisin) return;
          if (voisin.externe) {
            // Le routeur existant ouvre la rubrique et restaure le chapitre
            // explicite, y compris au retour arrière et au rechargement.
            location.hash = "#" + voisin.zone.dataset.gabSalle + "/" + voisin.chapitre.dataset.gabSlug;
          } else ouvrirPageChapitre(zone, voisin.index, { adresse: true, haut: true });
        }
      }
    }
  });

  const LIBELLES_ENTETE = {
    fr: ["Back to the Halls", "Back to the Chapters"],
    en: ["Back to the halls", "Back to chapters"],
    es: ["Volver a los vestíbulos", "Volver a los capítulos"],
    zh: ["返回大厅", "返回章节"],
    ar: ["العودة إلى القاعات", "العودة إلى الفصول"],
    ru: ["Вернуться в холл", "Вернуться к главам"]
  };
  const elementsEntete = [];
  function synchroniserEnteteChapitre() {
    if (!barre || !lecture) return;
    if (salle.hidden) {
      elementsEntete.splice(0).forEach(({noeud, repere}) => repere.replaceWith(noeud));
      return;
    }
    if (elementsEntete.length) return;
    const accueil = D.querySelector("body > header.entete");
    if (!accueil) return;
    const contact = $(".entete-contact, .coordonnees-haut", accueil);
    const menus = $$(".outils > .menu-langues, .outils > .menu-acces", accueil);
    const deplacer = (noeud, cible) => {
      if (!noeud) return;
      const repere = D.createComment("home header placeholder");
      noeud.before(repere);elementsEntete.push({noeud, repere});cible.append(noeud);
    };
    deplacer(contact, $(".chapitre-coordonnees", barre));
    menus.forEach(menu => deplacer(menu, $(".chapitre-outils", barre)));
  }
  function preparerSalle() {
    if (!salle || !barre) return;
    if (!lecture) {
      const libelles = LIBELLES_ENTETE[langue] || LIBELLES_ENTETE.fr;
      const retour = $("[data-retour]", barre);
      retour.textContent = "← " + libelles[0];
      const utilitaires = el("div", "chapitre-utilitaires");
      const coordonnees = el("div", "chapitre-coordonnees");
      const outils = el("div", "chapitre-outils outils");
      const chapitres = el("button", "chapitre-retour-chapitres", echapper(libelles[1]) + " →");
      chapitres.type = "button";chapitres.dataset.gabPas = "tous";
      utilitaires.append(retour, coordonnees, outils, chapitres);
      barre.prepend(utilitaires);
      lecture = el("div", "gab-lecture");
      lecture.innerHTML =
        '<button type="button" class="gab-fleche gab-fleche-precedente" data-gab-pas="-1" aria-label="' + echapper(T.precedent) + '"><span class="gab-fleche-icone" aria-hidden="true">‹</span><span class="gab-fleche-libelle"><small class="gab-fleche-cible"></small></span></button>' +
        '<div class="gab-actuel" aria-live="polite"><b></b><span><small></small><strong></strong></span></div>' +
        '<button type="button" class="gab-fleche gab-fleche-suivante" data-gab-pas="1" aria-label="' + echapper(T.suivant) + '"><span class="gab-fleche-libelle"><small class="gab-fleche-cible"></small></span><span class="gab-fleche-icone" aria-hidden="true">›</span></button>';
      barre.append(lecture);
      barre.classList.add("gab-barre");salle.classList.add("gab-salle");
      salle.addEventListener("scroll", suivreDefilement, {passive:true});
      new MutationObserver(synchroniserEnteteChapitre).observe(salle, {attributes:true, attributeFilter:["hidden"]});
    }
    synchroniserEnteteChapitre();
  }

  function marquer(i) {
    if (!lecture || !contenu) return;
    const zone = $(".gab", contenu);
    const liste = chapitresDe(zone);
    if (!liste.length) return;
    courant = Math.max(0, Math.min(liste.length - 1, i));
    const ch = liste[courant];
    const titre = nomChapitre(ch);
    const couleur = ch.style.getPropertyValue("--gab-c");
    lecture.style.setProperty("--gab-c", couleur);
    const position = positionDansPorte(zone, ch);
    $(".gab-actuel b", lecture).textContent = deux(position.index + 1);
    $(".gab-actuel small", lecture).textContent = T.chapitre(position.index + 1, position.total);
    $(".gab-actuel strong", lecture).textContent = (navigationParPorte(zone) && chapitresDeLaPorte(zone).find((c) => c.zone === zone)?.titre) || titre;
    $$(".gab-segments button", lecture).forEach((s, k) => { s.classList.toggle("lu", k < (navigationParPorte(zone) ? position.index : courant)); s.setAttribute("aria-current", k === (navigationParPorte(zone) ? position.index : courant)); });
  }

  function suivreDefilement() {
    if (!lecture || !contenu) return;
    const zone = $(".gab", contenu);
    if (zone?.dataset.gabSalle === "loisirs") {
      // Les activités restent visibles ensemble ; leur barre de lecture reste accessible.
      salle.classList.add("gab-lit");
      return;
    }
    const programme = $(".gab .gab-programme", contenu);
    const bas = barre.getBoundingClientRect().bottom;
    const lit = zone?.classList.contains("gab-page-chapitre") ||
      (!!programme && !zone?.classList.contains("gab-page-sommaire") && programme.getBoundingClientRect().bottom < bas + 10);
    salle.classList.toggle("gab-lit", !!lit);
  }


  function activerSalle() {
    if (!contenu) return;
    preciserVariablesO2(contenu);
    if ($(".gab-programme-porte", contenu)) return;
    const zone = $(".section-contenu", contenu);
    if (!zone) return;
    if (!zone.classList.contains("gab")) transformer(zone);
    mettreAJourChapitreVulgarisation(zone);
    fusionnerDossierImplantation(zone);
    observerSommaires(zone);
    preparerSalle();
    const liste = chapitresDe(zone);
    salle.classList.toggle("gab-avec-chapitres", liste.length >= 1);
    // La salle présente une page de chapitre à la fois. Sans fragment
    // précis, commencer par le premier chapitre, les autres restant masqués.
    const indexAdresse = chapitreDansAdresse(zone, liste);
    ouvrirPageChapitre(zone, indexAdresse >= 0 ? indexAdresse : 0);
    requestAnimationFrame(suivreDefilement);
  }

  // Inventaire des chapitres (sert à constituer le catalogue d'images).
  window.gabaritSalles = {
    atteindre: (zone, repere) => {
      if (!zone || !repere) return null;
      const cible = $$("[id], [data-rubrique]", zone).find(x => x.id === repere || x.dataset.rubrique === repere);
      const chapitre = cible?.closest(".gab-chapitre");
      if (!cible || !chapitre) return null;
      if (cible.matches("details")) cible.open = true;
      const liste = chapitresDe(zone);
      if (chapitre.hidden) ouvrirPageChapitre(zone, liste.indexOf(chapitre));
      let parent = cible.parentElement;
      while (parent && parent !== zone) { if (parent.matches("details")) parent.open = true; parent = parent.parentElement; }
      const detail = cible.matches(".methode-rubrique") && cible.querySelector(":scope > details");
      if (detail) detail.open = true;
      return cible;
    },
    inventaire: () => $$("section.section[data-salle] > .section-contenu.gab").flatMap((sc) => chapitresDe(sc).map((c, i) => ({ salle: sc.dataset.gabSalle, porte: porteDe(sc.dataset.gabSalle)?.dataset.salle || "", ordre: i + 1, titre: nomChapitre(c) }))),
  };

  // Références institutionnelles de l'en-tête de thèse : mêmes destinations
  // que les liens de l'accueil et du chapitre « Cadre institutionnel ».
  // On conserve le texte et les éléments de mise en page existants.
  function lierReferencesCadreThese() {
    const cadre = $("#recherche .these-entete .these-cadre");
    if (!cadre) return;
    const references = [
      ["Nadia Sourial", "https://www.chumontreal.qc.ca/crchum/chercheurs/nadia-sourial"],
      ["Géraldine Layani", "https://www.chumontreal.qc.ca/crchum/chercheurs/geraldine-layani"],
      ["École de santé publique de l’Université de Montréal (ESPUM)", "https://espum.umontreal.ca/"],
      ["PhD in public health, health systems, organizations and policies option (SOPS)", "https://espum.umontreal.ca/etudes/programmes/doctorats-et-programmes-de-3e-cycle/doctorats/doctorat-en-sante-publique/"],
      ["Chaire de recherche GSK en gestion optimale des maladies chroniques", "https://www.linkedin.com/company/chaire-glaxosmithkline-gsk-de-recherche-en-gestion-optimale-des-maladies-chroniques/"],
      ["Fonds de recherche du Québec", "https://frq.gouv.qc.ca/"],
      ["doctoral scholarship (B2)", "https://doi.org/10.69777/2009461"],
    ];
    const marche = D.createTreeWalker(cadre, NodeFilter.SHOW_TEXT);
    const noeuds = [];
    while (marche.nextNode()) {
      const noeud = marche.currentNode;
      if (!noeud.parentElement?.closest("a, script, style")) noeuds.push(noeud);
    }
    noeuds.forEach((noeud) => {
      const texte = noeud.nodeValue;
      const correspondances = [];
      references.forEach(([libelle, href]) => {
        let debut = 0, pos;
        while ((pos = texte.indexOf(libelle, debut)) !== -1) {
          correspondances.push({ debut: pos, fin: pos + libelle.length, href });
          debut = pos + libelle.length;
        }
      });
      if (!correspondances.length) return;
      correspondances.sort((a, b) => a.debut - b.debut || b.fin - a.fin);
      const fragment = D.createDocumentFragment();
      let precedent = 0;
      correspondances.forEach(({ debut, fin, href }) => {
        if (debut < precedent) return;
        if (debut > precedent) fragment.append(D.createTextNode(texte.slice(precedent, debut)));
        const lien = D.createElement("a");
        lien.className = "these-cadre-lien";
        lien.href = href;
        lien.target = "_blank";
        lien.rel = "noopener noreferrer";
        lien.textContent = texte.slice(debut, fin);
        fragment.append(lien);
        precedent = fin;
      });
      if (precedent < texte.length) fragment.append(D.createTextNode(texte.slice(precedent)));
      noeud.replaceWith(fragment);
    });
  }



  // L'ancien cinquième chapitre pointait vers sept pages externes. Leur
  // contenu intégral appartient désormais au chapitre Implantation, avec navigation
  // interne. Les autres chapitres ne sont pas modifiés.
  function installerStyleImplantationFusion() {
    if (D.getElementById("style-implantation-fusion-2026")) return;
    const style = el("style");
    style.id = "style-implantation-fusion-2026";
    style.textContent = `
.gab[data-gab-salle="implantation"] .impl-portail-fusion{min-width:0;max-width:100%;margin:30px 0 0;padding-top:25px;border-top:1px solid #dce8eb}
.gab[data-gab-salle="implantation"] .impl-portail-bloc{margin:0 0 31px;min-width:0;scroll-margin-top:125px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .masthead{padding:24px clamp(15px,3vw,35px);border-radius:18px;background:linear-gradient(115deg,#123c50,#177b80);color:white;margin:0 0 22px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .masthead :is(h4,p,.eyebrow){color:white;margin:8px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .masthead .hero-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .masthead .hero-tags>span{border:1px solid #b4ded6a0;border-radius:99px;padding:5px 10px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .impl-portail-section{scroll-margin-top:120px;margin:0 0 18px;padding:19px clamp(14px,2vw,25px);border:1px solid #dde8eb;border-radius:13px;background:#fff;min-width:0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .impl-portail-section :is(h2,h3){color:#173e50;line-height:1.35}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .impl-portail-section .section-head{margin:0 0 14px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .eyebrow{font-weight:770;color:#187a82;letter-spacing:.07em}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .panel{min-width:0;padding:15px;background:#f6fafb;border:1px solid #deeaed;border-radius:12px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .panel .label{color:#147a85;letter-spacing:.05em}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .panel :is(h3,p){margin:8px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .split{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,265px),1fr));gap:18px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc figure{margin:14px 0;max-width:100%;min-width:0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .diagram{display:block;max-width:100%;width:100%;height:auto;border-radius:11px;background:#f2f8fa}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .diagram .node{fill:#fff;stroke:#89b0b4;stroke-width:2}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .diagram .accent-node{fill:#e3f4ec;stroke:#82b69f;stroke-width:2}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .diagram text{fill:#194355;font-size:16px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .diagram text.small{font-size:12px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc figcaption,.gab[data-gab-salle="implantation"] .impl-portail-bloc .disclaimer{font-size:13px!important;color:#536974;line-height:1.5}
.gab[data-gab-salle="implantation"] .impl-portail-bloc :is(.table-scroll,.chart-wrap){max-width:100%;overflow-x:auto;margin:15px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc table{width:100%;min-width:520px;border-collapse:collapse}
.gab[data-gab-salle="implantation"] .impl-portail-bloc :is(th,td){padding:10px 12px;border:1px solid #deeaeb;text-align:left}
.gab[data-gab-salle="implantation"] .impl-portail-bloc th{background:#edf5f6;font-weight:750}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .callout{padding:15px 18px;margin:17px 0;background:#eef7f5;border-inline-start:3px solid #1b8a87;border-radius:0 10px 10px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .chips,.gab[data-gab-salle="implantation"] .impl-portail-bloc .tags{display:flex;flex-wrap:wrap;gap:8px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .chip,.gab[data-gab-salle="implantation"] .impl-portail-bloc .tag{border:1px solid #bcdedb;border-radius:99px;padding:4px 9px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .image-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .image-card{overflow:hidden;border-radius:10px;border:1px solid #dce8e9}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .image-card img{width:100%;height:auto}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .image-card>div{padding:12px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .source-list{padding-left:25px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .source-list li{padding:10px 0;border-bottom:1px solid #e1e9eb}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .source-list small{display:block}
.gab[data-gab-salle="implantation"] .impl-portail-bloc :is(button,.primary){border:1px solid #b8d3da;border-radius:8px;padding:9px 11px;cursor:pointer}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .primary{background:#126d80;color:white}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .field :is(label,select){display:block;width:100%;max-width:100%;margin:6px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .field select{padding:9px;border:1px solid #bdd4da;border-radius:8px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .lab-actions{display:flex;flex-wrap:wrap;gap:9px;margin:15px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .chart-row{display:grid;grid-template-columns:145px minmax(70px,1fr) 70px;gap:10px;align-items:center;margin:10px 0}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .chart-track{height:13px;border-radius:8px;background:#dfeced;overflow:hidden}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .chart-bar{display:block;height:100%;background:#159093}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .stat-card{display:inline-block;padding:12px;border:1px solid #d9e9e8;border-radius:10px}
.gab[data-gab-salle="implantation"] .impl-portail-bloc .stat-value{font-weight:760;color:#157984}
`;
    D.head.append(style);
  }

  const interactionsImplantationInitialisees = new WeakSet();
  function initialiserInteractionsImplantation(chapitre,api) {
    if(interactionsImplantationInitialisees.has(chapitre))return;
    api.chapitres.forEach(info=>{
      const bloc=$(".impl-portail-bloc[data-impl-page='"+info.code+"']",chapitre);
      if(bloc)api.initialiser(bloc,info.code);
    });
    interactionsImplantationInitialisees.add(chapitre);
  }
  function fusionnerDossierImplantation(zone) {
    const api=window.DOSSIER_IMPLANTATION_2026;
    if(langue!=="fr"||!api||!zone||zone.dataset.gabSalle!=="implantation")return;
    const chapitre=$(".gab-chapitre[data-gab-slug='implantation-science']",zone);
    if(!chapitre)return;
    // Un clone de la salle conserve le HTML, mais pas les écouteurs d'événements.
    // Réactiver les outils interactifs du clone sans dupliquer le contenu.
    if($(".impl-portail-fusion",chapitre)){
      initialiserInteractionsImplantation(chapitre,api);
      return;
    }
    const corps=$(".gab-corps",chapitre);
    if(!corps)return;
    installerStyleImplantationFusion();
    const ensemble=el("section","impl-portail-fusion");
    ensemble.setAttribute("aria-label","Interactive implementation file integrated into the Implementation chapter");
    api.chapitres.forEach((info,i)=>{
      const bloc=el("section","impl-portail-bloc");
      bloc.id="impl-fusion-"+info.code;bloc.dataset.implPage=info.code;
      let contenu=api.contenu(info.code);
      contenu=contenu.replaceAll('class="section"','class="impl-portail-section"')
        .replaceAll('<h1>','<h4 class="impl-portail-grand-titre">')
        .replaceAll('</h1>','</h4>')
        .replace(/href="(index|comprendre|cadres|strategies|evaluer|laboratoire|sources)[.]html"/g,
          (_,slug)=>'href="#impl-fusion-'+slug+'" data-impl-saut="'+slug+'"')
        .replaceAll('src="../assets/','src="'+CHEMIN+'assets/')
        .replaceAll('href="../assets/','href="'+CHEMIN+'assets/')
        .replaceAll('href="../docs/','href="'+CHEMIN+'docs/');
      bloc.innerHTML=contenu;ensemble.append(bloc);
    });
    // Intégrer le dossier au texte existant sans remplacer ni modifier le menu du chapitre.
    const dossierExistant=$(".impl-dossier",corps);
    (dossierExistant || corps).append(ensemble);
    initialiserInteractionsImplantation(chapitre,api);
  }

  // Sommaire local : ancrages internes sans quitter la salle immersive.
  D.addEventListener("click",(evenement)=>{
    const lien=evenement.target.closest(".impl-portail-fusion a[data-impl-saut]");
    if(!lien)return;
    const chapitre=lien.closest(".gab-chapitre[data-gab-slug='implantation-science']");
    if(!chapitre)return;
    const cible=chapitre.querySelector('[id="'+lien.getAttribute("href").slice(1)+'"]');
    if(!cible)return;
    evenement.preventDefault();
    cible.scrollIntoView({block:"start",behavior:"smooth"});
  });


  noterTitres();
  if (langue === "fr") lierReferencesCadreThese();
  // Le dossier est affiché uniquement au chapitre Vulgarisation existant dans « Savoirs en action ».
  // La salle immersive utilise un clone DOM ; appliquer le contenu à la source
  // et à chaque salle active, sans ajouter de chapitre ni de page.
  let contenuVulgarisation2026 = "";
  function mettreAJourChapitreVulgarisation(zone) {
    if (langue !== "fr" || !contenuVulgarisation2026 || !zone || zone.dataset.gabSalle !== "implantation") return;
    const chapitre = $(".gab-chapitre[data-gab-slug='implantation-vulgarisation']", zone);
    if (!chapitre || chapitre.classList.contains("vulgarisation-recherche-active")) return;
    const enveloppe = el("div", "", contenuVulgarisation2026);
    const article = $("article.vul-dossier-chapitre", enveloppe);
    const titres = article ? $$(":scope > section.vr-section > h4", article) : [];
    if (titres.length !== 10) throw new Error("Ten sections are required for science communication.");
    const corps = $(".gab-corps", chapitre);
    const aside = $(".gab-chapitre-aside", chapitre);
    const grille = $(".gab-chapitre-grille", chapitre);
    if (!corps || !aside || !grille) throw new Error("Chapter 04 incomplete.");
    const nav = el("nav", "gab-sommaire-chapitre");
    nav.setAttribute("aria-label", T.dans);
    nav.setAttribute("tabindex", "0");
    nav.innerHTML = '<span>' + echapper(T.dans) + '</span>' +
      titres.map((h, i) => {
        const id = h.id || "vul-section-" + (i + 1);
        h.id = id;
        return '<a href="#' + echapper(id) + '" data-gab-intertitre="' + i +
          '" data-gab-cible="' + echapper(id) + '">' + echapper(net(h.textContent)) + '</a>';
      }).join("");
    organiserSommaireVulgarisation(nav, titres);
    corps.replaceChildren(...Array.from(enveloppe.childNodes));
    aside.replaceChildren(nav);
    grille.classList.add("gab-menu-gauche");
    chapitre.classList.add("vulgarisation-recherche-active");
  }
  D.addEventListener("change", (ev) => {
    if (!ev.target.matches("[data-vul-checks] input[type=checkbox]")) return;
    const g = ev.target.closest("[data-vul-checks]");
    const n = g.querySelectorAll("input[type=checkbox]:checked").length;
    g.querySelector("progress").value = n;
    g.querySelector("[data-vul-progress]").textContent = n + "/10";
  });
  D.addEventListener("click", (ev) => {
    if (!ev.target.closest("[data-vul-reset]")) return;
    const g = ev.target.closest("[data-vul-checks]");
    g.querySelectorAll("input[type=checkbox]").forEach((x) => { x.checked = false; });
    g.querySelector("progress").value = 0;
    g.querySelector("[data-vul-progress]").textContent = "0/10";
  });

  // O2 : expliciter l'origine des six variables communes.
  function preciserVariablesO2(zone) {
    if (langue !== "fr" || !zone) return;
    $$(".ms-grid.ms-variables", zone).forEach((grille) => {
      if (grille.previousElementSibling?.classList.contains("ms-variables-intro")) return;
      const intro = el("p", "ms-variables-intro",
        'These six common variables will be constructed for each resource, whatever its source database: they will make the sources comparable.');
      grille.before(intro);
    });
  }

  // Le contenu méthodologique validé et ses illustrations sont statiques.
  $$("section.section[data-salle] > .section-contenu").forEach(transformer);
  preciserVariablesO2(D);
  observerSommaires(D);

  // Charge les sept contenus existants uniquement pour la fusion du chapitre Implantation.
  if(langue==="fr"){
    const script=D.createElement("script");
    let pret, echec;
    const preparation = new Promise((resolve, reject) => { pret = resolve; echec = reject; });
    // Complément facultatif : ne doit pas bloquer l'ouverture du site.
    preparation.catch(() => {});
    script.src=new URL(CHEMIN+"en/implantation/portail.js?v=20261018-fusion-ch03",D.baseURI).href;
    script.onload=()=>{
      const source=$("section.section[data-salle='implantation'] > .section-contenu.gab");
      if(source)fusionnerDossierImplantation(source);
      const active=contenu&&$(".section-contenu.gab",contenu);
      if(active)fusionnerDossierImplantation(active);
      pret();
    };
    script.onerror=()=>echec(new Error("Dossier d'implantation indisponible."));
    D.head.append(script);
  }
  if (langue === "fr") {
    const url = new URL(CHEMIN + "en/vulgarisation/dossier-contenu-2026.html", D.baseURI).href;
    const preparation = fetch(url).then((rep) => {
      if (!rep.ok) throw new Error("Contenu scientifique introuvable : " + rep.status);
      return rep.text();
    }).then((html) => {
      if (!html.includes('id="vul-section-10"')) throw new Error("Dossier incomplet.");
      contenuVulgarisation2026 = html;
      const source = $("section.section[data-salle='implantation'] > .section-contenu.gab");
      mettreAJourChapitreVulgarisation(source);
      const active = contenu && $(".section-contenu.gab", contenu);
      if (active) mettreAJourChapitreVulgarisation(active);
    });
    // Complément facultatif : ne doit pas bloquer l'ouverture du site.
    preparation.catch(err => console.warn("The current file could not be loaded.", err));
  }
  // Retour arrière, adresse directe et changement de chapitre sans
  // réafficher l'intégralité des chapitres dans la vue publique.
  const synchroniserPageLibre = () => {
    if (!racine.classList.contains("libre")) return;
    const destination = location.hash.slice(1).split("/")[0];
    const section = Array.from(D.querySelectorAll("section.section[data-salle]"))
      .find((element) => element.dataset.salle === destination);
    const zone = section && $(".section-contenu.gab", section);
    if (!zone) return;
    const index = chapitreDansAdresse(zone, chapitresDe(zone));
    ouvrirPageChapitre(zone, index >= 0 ? index : 0);
  };
  addEventListener("hashchange", synchroniserPageLibre);
  addEventListener("popstate", synchroniserPageLibre);
  // Les figures de l'atlas peuvent être ajoutées après la transformation.
  if (langue === "fr") $$(".these").forEach((zone) => {
    retirerImagesRepeteesThese(zone);
    new MutationObserver(() => retirerImagesRepeteesThese(zone))
      .observe(zone, { childList: true, subtree: true });
  });
  if (contenu) {
    new MutationObserver(activerSalle).observe(contenu, { childList: true });
    if (contenu.children.length) activerSalle();
  }
})();
