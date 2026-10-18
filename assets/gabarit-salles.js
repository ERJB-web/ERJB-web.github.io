"use strict";
// Gabarit unique des salles : bandeau, tuiles de chapitres illustrées, chapitres pleine largeur et barre de lecture.
// Le découpage suit REGLES ; une salle sans règle est découpée par ses intertitres h3.
(() => {
  const D = document, racine = D.documentElement;
  const $ = (s, r = D) => r.querySelector(s);
  const $$ = (s, r = D) => Array.from(r.querySelectorAll(s));
  const langue = (racine.lang || "fr").slice(0, 2).toLowerCase();
  const CHEMIN = racine.dataset.racine || "./";
  const calme = matchMedia("(prefers-reduced-motion: reduce)");
  const deux = (n) => String(n).padStart(2, "0");

  const TEXTES = {
    fr: { chapitres: (n) => `${n} chapitres`, minutes: (m) => `≈ ${m} min de lecture`, programme: "Les chapitres de cette salle", aide: "Touchez une tuile pour aller directement au chapitre", chapitre: (i, n) => `Chapitre ${i} sur ${n}`, tous: "Tous les chapitres", precedent: "Chapitre précédent", suivant: "Chapitre suivant", dans: "Dans ce chapitre", photo: "Photo", porte: "Porte", aller: (t) => `Aller au chapitre : ${t}`, afficher: (n) => `Afficher les ${n} références` },
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
    axes: { sel: "article.axe-carte", titre: "h4" },
    publications: { sel: "section.publication-bloc", titre: ".publication-titre, h3" },
    methodes: { sel: "article.methode", titre: "h4" },
    vulgarisation: { sel: "article.vul-dossier-chapitre", titre: "h3" },
    outils: { sel: "article.projet", titre: ".projet-tete h3, h3" },
    biographie: { sel: "ol.recit > li", titre: "h3" },
    juriste: VITRINE, gestionnaire: VITRINE, educateur: VITRINE, entrepreneuriat: { unique: true },
    valeurs: { sel: "article.valeur", titre: "h4" },
    representation: { unique: true }, communaute: { unique: true }, distinctions: { unique: true }, citoyen: { unique: true },
    loisirs: { unique: true },
    logiciels: { sel: ".logiciels-cartes > *, aside.logiciels-jeu", titre: "h3" },
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
    const transfert = $(":scope > .volet[data-rubrique='implantation-reperes']", table);
    if (!transfert || transfert.dataset.chapitresDistincts) return;
    const textes = {
      fr: ["Des connaissances aux pratiques et aux publics", "Transfert de connaissances", "Implantation", "Vulgarisation scientifique",
        "Le transfert organise l’échange, la mobilisation et l’utilisation des connaissances entre la recherche, les personnes et les milieux concernés. Il ne garantit pas, à lui seul, l’adoption durable d’une pratique.",
        "L’implantation examine les conditions dans lesquelles une intervention ou une pratique est adoptée, adaptée, mise en œuvre et maintenue. Elle mobilise ses propres cadres, stratégies et critères d’évaluation.",
        "La vulgarisation scientifique vise à rendre la recherche compréhensible et discutable par des publics non spécialistes, en conservant ses nuances, ses limites et ses incertitudes.",
        "Approfondir les sciences de l’implantation", "Explorer la vulgarisation scientifique",
        "Trois démarches complémentaires, mais distinctes : transférer les connaissances, implanter des pratiques et rendre la science accessible."],
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
    const t = $(".rubriques-nav [data-rubrique='implantation-reperes'] strong", table);
    if (t) t.textContent = l[1];
    const entete = $(".rubrique-entete span", transfert);
    if (entete) entete.textContent = l[1];
    const transfertTexte = $(".rubrique-contenu .colonne-texte", transfert);
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
    const outils = $(".rubrique-contenu .colonne-outils", transfert);
    const cadres = outils ? $$(":scope > .cadres", outils) : [];
    const dernierCadre = cadres.length > 1 ? cadres[cadres.length - 1] : null;
    const titreCadre = dernierCadre?.previousElementSibling;
    if (!dernierCadre || !titreCadre?.matches("h3.titre-bloc")) return;

    const fabriquer = (cle, numero, titre, texte, image) => {
      const volet = D.createElement("div");
      volet.className = "volet rubrique-corps";
      volet.dataset.volet = String(numero);
      volet.dataset.rubrique = cle;
      volet.dataset.image = CHEMIN + image;
      volet.hidden = true;
      const entete = D.createElement("div");
      entete.className = "rubrique-entete";
      const n = D.createElement("bdi");
      n.dir = "ltr";
      n.textContent = deux(numero + 1);
      const nom = D.createElement("span");
      nom.textContent = titre;
      entete.append(n, nom);
      const contenu = D.createElement("div");
      contenu.className = "rubrique-contenu";
      const section = D.createElement("div");
      section.className = "section-corps pleine";
      section.innerHTML = '<div class="colonne-texte"><h2>' + echapper(titre) + '</h2><p class="intro">' + echapper(texte) + '</p></div><div class="colonne-outils"></div>';
      contenu.append(section);
      volet.append(entete, contenu);
      table.append(volet);
      return $(".colonne-outils", section);
    };

    const implantation = fabriquer("implantation-science", 2, l[2], l[5], "assets/chapitres/ia-07.webp");
    implantation.append(titreCadre, dernierCadre);
    if (langue === "fr") {
      // Seul le chapitre « Implantation » reçoit le dossier, avec ses titres et graphiques.
      // Le cadre originel déplacé depuis « Transfert » n'est pas réintroduit ailleurs.
      const dossier = D.createElement("section");
      dossier.className = "impl-dossier";
      dossier.innerHTML = "\n<style>\n.impl-dossier{--impl-ink:#173347;--impl-soft:#eef5f8;--impl-a:#167a91;--impl-teal:#116e80;--impl-green:#247a64;color:var(--impl-ink);font-size:1rem;line-height:1.72;max-width:100%;min-width:0}\n.impl-dossier *{box-sizing:border-box}.impl-dossier .impl-hero{background:linear-gradient(128deg,#123d51 0%,#145f72 57%,#177978 100%);color:#fff;border-radius:22px;padding:clamp(23px,4.2vw,48px);margin:12px 0 25px;box-shadow:0 16px 34px rgba(12,57,74,.12)}\n.impl-dossier .impl-kicker{font-size:.73rem;letter-spacing:.14em;text-transform:uppercase;font-weight:800;opacity:.83;margin:0 0 9px}\n.impl-dossier .impl-hero h2{color:#fff!important;font-size:clamp(1.65rem,2.7vw,2.75rem)!important;letter-spacing:-.035em;line-height:1.16;margin:0 0 15px;max-width:840px}\n.impl-dossier .impl-hero p{color:#ecf9fa;max-width:800px;line-height:1.72;margin:0}\n.impl-dossier .impl-lead{font-size:1.055rem;line-height:1.76}\n.impl-dossier .impl-cite{white-space:normal;color:#146b83;text-decoration:none;border-bottom:1px solid #add8df;font-size:.91em;font-weight:650}\n.impl-dossier .impl-hero .impl-cite{color:#e4ffff;border-color:#9edbdc}\n.impl-dossier .impl-cite:hover{border-color:currentColor}\n.impl-dossier .impl-triptych,.impl-dossier .impl-grid,.impl-dossier .impl-questions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:20px 0}\n.impl-dossier .impl-tile{padding:21px 19px;border-radius:17px;background:#f1f8fa;border:1px solid #dbeaed;border-top:5px solid var(--tile,#187f91);height:100%;min-width:0}\n.impl-dossier .impl-tile b{display:block;margin-bottom:6px;font-size:.96rem}.impl-dossier .impl-tile p{font-size:.92rem;line-height:1.55;margin:0;color:#3f5665}\n.impl-dossier .impl-index{font-size:.72rem;letter-spacing:.11em;font-weight:800;text-transform:uppercase;color:var(--impl-a)}\n.impl-dossier .impl-module{margin:28px 0 18px;padding:clamp(19px,3vw,32px);background:#fff;border:1px solid #dbe7ec;border-radius:19px;box-shadow:0 7px 27px rgba(25,70,91,.055);min-width:0;overflow:hidden}\n.impl-dossier .impl-module h4{font-size:clamp(1.3rem,2.15vw,1.7rem)!important;line-height:1.27!important;letter-spacing:-.025em;color:#123e52!important;padding:0 0 13px!important;border-bottom:2px solid #d6e9ed!important;margin:5px 0 20px!important}\n.impl-dossier .impl-module h5{font-size:1.08rem!important;line-height:1.35;margin:24px 0 9px!important;color:#146779!important}\n.impl-dossier p{margin:0 0 14px}.impl-dossier .impl-module p:last-child{margin-bottom:0}\n.impl-dossier .impl-note{background:linear-gradient(90deg,#edf7f6,#f7fbfd);padding:18px 21px;border-left:4px solid #329e93;border-radius:0 13px 13px 0;margin:20px 0;font-size:.97rem}\n.impl-dossier .impl-table-scroll{overflow-x:auto;max-width:100%;border-radius:13px;border:1px solid #dae8ee;margin:18px 0}\n.impl-dossier table{width:100%;border-collapse:collapse;min-width:530px;font-size:.9rem;text-align:left}\n.impl-dossier th{background:#e6f1f5;color:#22495f;font-weight:750}\n.impl-dossier td,.impl-dossier th{padding:12px 14px;vertical-align:top;border-bottom:1px solid #dce8ed}\n.impl-dossier tr:nth-child(even) td{background:#f7fafc}.impl-dossier tr:last-child td{border-bottom:0}\n.impl-dossier .impl-figure{border:1px solid #d9e9ee;background:linear-gradient(155deg,#f7fcfd,#eff7fa);padding:clamp(16px,3vw,26px);border-radius:18px;margin:20px 0}\n.impl-dossier .impl-figure h5{margin:0 0 6px!important}.impl-dossier .impl-figure .impl-legend{color:#587383;font-size:.88rem;margin:0 0 22px}\n.impl-dossier .impl-bar-row{display:grid;grid-template-columns:minmax(110px,1.35fr) minmax(85px,1fr) 55px;align-items:center;gap:13px;margin:13px 0}\n.impl-dossier .impl-bar-name{font-size:.83rem;line-height:1.26;font-weight:620}\n.impl-dossier .impl-bar-line{height:18px;border-radius:999px;background:#d8e7ed;overflow:hidden}\n.impl-dossier .impl-bar-line span{display:block;height:100%;border-radius:999px}\n.impl-dossier .impl-bar-row strong{font-variant-numeric:tabular-nums;font-size:.87rem;text-align:right}\n.impl-dossier figcaption{font-size:.81rem;line-height:1.55;color:#587080;margin-top:18px}\n.impl-dossier .impl-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:17px 0}\n.impl-dossier .impl-metric{background:#edf5f8;border:1px solid #d5e6eb;border-radius:15px;padding:20px;min-width:0}\n.impl-dossier .impl-metric strong{font-size:clamp(2rem,4vw,3rem);line-height:1;color:#186d80;font-weight:820;display:block}\n.impl-dossier .impl-metric span{display:block;font-size:.88rem;line-height:1.4;margin-top:8px}\n.impl-dossier .impl-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:20px 0}\n.impl-dossier .impl-step{background:#eaf3f7;border:1px solid #d2e3e9;border-radius:12px;padding:16px 10px;text-align:center;font-size:.88rem;font-weight:680}\n.impl-dossier .impl-step b{display:block;font-size:1.5rem;line-height:1.2;color:#138396;margin-bottom:7px}\n.impl-dossier .impl-step::after{content:\"↓\";display:block;color:#5893a1;font-size:1.1rem;margin-top:7px}\n.impl-dossier .impl-step:last-child::after{content:\"↺\"}\n.impl-dossier .impl-ref-list{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0 0}\n.impl-dossier .impl-ref-list a{padding:9px 13px;background:#eaf4f6;border:1px solid #cce2e6;color:#155d70;border-radius:999px;font-size:.86rem;text-decoration:none}\n.impl-dossier .impl-ref-list a:hover{background:#d7edf1}\n@media(max-width:760px){.impl-dossier .impl-triptych,.impl-dossier .impl-grid,.impl-dossier .impl-questions{grid-template-columns:1fr}.impl-dossier .impl-two{grid-template-columns:1fr}.impl-dossier .impl-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.impl-dossier .impl-bar-row{grid-template-columns:minmax(100px,1.1fr) minmax(70px,1fr) 45px;gap:7px}.impl-dossier .impl-bar-name{font-size:.75rem}.impl-dossier .impl-module{padding:18px}}\n</style>\n<div class=\"impl-hero\">\n<p class=\"impl-kicker\">Savoirs en action · Dossier scientifique · 2026</p>\n<h2>Science de l’implantation et enjeux contemporains de la recherche</h2>\n<p class=\"impl-lead\">Une intervention efficace n’améliore pas nécessairement la santé lorsqu’elle demeure inaccessible, insuffisamment adoptée ou impossible à maintenir. La science de l’implantation étudie comment les connaissances deviennent des pratiques effectives, pour quelles populations et dans quelles conditions. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n</div>\n<div class=\"impl-triptych\" aria-label=\"Trois dimensions complémentaires de la recherche\">\n <div class=\"impl-tile\" style=\"--tile:#267bb0\"><span class=\"impl-index\">01 · Efficacité</span><b>Qu’est-ce qui fonctionne ?</b><p>Évaluer les effets de l’intervention et leurs conditions de validité. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p></div>\n <div class=\"impl-tile\" style=\"--tile:#159a99\"><span class=\"impl-index\">02 · Implantation</span><b>Comment la mettre en œuvre ?</b><p>Étudier l’adoption, les acteurs, les adaptations, les coûts et les contextes. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p></div>\n <div class=\"impl-tile\" style=\"--tile:#7e9c4a\"><span class=\"impl-index\">03 · Impact</span><b>Pour qui, où et combien de temps ?</b><p>Examiner la portée, l’équité, les effets et le maintien. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></p></div>\n</div>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 01</span><h4>Comprendre la science de l’implantation</h4>\n<p>La science de l’implantation est l’étude systématique des méthodes permettant de promouvoir l’intégration des résultats de recherche et des pratiques fondées sur les preuves dans les services, les organisations et les politiques. Elle cherche à expliquer pourquoi des interventions pourtant efficaces ne sont pas automatiquement utilisées dans les conditions ordinaires d’action. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<p>Elle se distingue de la diffusion, qui rend des résultats accessibles, et du transfert de connaissances, qui organise leur circulation, leur échange et leur mobilisation. L’implantation examine plus spécifiquement le processus par lequel une pratique est adoptée, adaptée, effectivement réalisée et éventuellement pérennisée. Ces démarches sont complémentaires plutôt qu’interchangeables. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></p>\n<div class=\"impl-note\"><strong>Exemple — soutien à domicile.</strong> La démonstration qu’un dispositif de coordination réduit certains besoins non satisfaits ne suffit pas à établir qu’il sera utilisé dans tous les territoires. Il faut également étudier les ressources, les professionnels impliqués, les mécanismes d’orientation, les populations effectivement rejointes et la continuité des partenariats. Cette application illustre la distinction entre efficacité et implantation. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></div>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Champ</th><th>Question centrale</th><th>Résultat attendu</th></tr></thead><tbody>\n<tr><td>Recherche d’efficacité</td><td>Quels effets produit une intervention ?</td><td>Estimation des effets et de leur incertitude.</td></tr>\n<tr><td>Transfert de connaissances</td><td>Comment rendre des connaissances disponibles et utilisables ?</td><td>Échange, compréhension et mobilisation.</td></tr>\n<tr><td>Science de l’implantation</td><td>Quelles stratégies rendent une pratique réalisable et durable ?</td><td>Adoption, faisabilité, fidélité, portée et maintien.</td></tr>\n<tr><td>Évaluation d’impact</td><td>Quelles conséquences observe-t-on, pour qui et à quelle échelle ?</td><td>Effets populationnels, équité et effets inattendus.</td></tr>\n</tbody></table></div>\n<p class=\"impl-index\">Distinctions conceptuelles : <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 02</span><h4>Les cadres scientifiques, les stratégies et les méthodes</h4>\n<p>Les cadres théoriques ne sont pas des recettes de mise en œuvre. Certains servent à repérer les déterminants contextuels, d’autres à décrire les phases de changement, à choisir des stratégies ou à évaluer les résultats. Leur sélection doit suivre la question de recherche et le niveau de décision étudié. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Cadre</th><th>Rôle analytique</th><th>Utilisation privilégiée</th></tr></thead><tbody>\n<tr><td><strong>CFIR</strong></td><td>Déterminants de l’implantation.</td><td>Innovation, environnements interne et externe, personnes et processus. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></td></tr>\n<tr><td><strong>RE-AIM</strong></td><td>Évaluation de l’impact en conditions réelles.</td><td>Portée, efficacité, adoption, implantation et maintien. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></td></tr>\n<tr><td><strong>EPIS</strong></td><td>Trajectoire temporelle.</td><td>Exploration, préparation, implantation et pérennisation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></td></tr>\n<tr><td><strong>ERIC</strong></td><td>Répertoire de stratégies.</td><td>Facilitation, formation, audit, mobilisation et adaptation ; 73 stratégies répertoriées. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a></td></tr>\n<tr><td><strong>Devis hybrides</strong></td><td>Évaluation conjointe des effets et de l’implantation.</td><td>Types 1, 2 et 3 selon la priorité scientifique. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></td></tr>\n</tbody></table></div>\n<h5>Quels devis permettent d’étudier l’implantation ?</h5>\n<p>Selon la question, les chercheurs peuvent recourir à des essais randomisés en grappes, des expériences naturelles, des enquêtes observationnelles, des études de cas comparatives, des analyses qualitatives et des méthodes mixtes. Les devis hybrides rapprochent l’étude des effets de l’intervention de celle des stratégies nécessaires à sa mise en œuvre. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p>\n<p>Pour les dispositifs intersectoriels, les approches longitudinales, les analyses de réseaux et la cartographie des ressources peuvent éclairer respectivement l’évolution de la coopération, la structure des relations et les disparités territoriales. Elles décrivent des dimensions différentes et ne démontrent pas, à elles seules, un effet causal. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh et Papoutsi, 2018)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 03</span><h4>Mesurer les résultats de l’implantation</h4>\n<p>Une pratique peut être appréciée par ses utilisateurs sans être réellement adoptée, être déployée sans respecter ses composantes essentielles, ou être initialement adoptée puis abandonnée. La taxonomie de Proctor distingue huit résultats d’implantation de la qualité des services et des résultats cliniques. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<div class=\"impl-grid\">\n<div class=\"impl-tile\" style=\"--tile:#247fb1\"><b>Acceptabilité</b><p>Jugement favorable des acteurs concernant la pratique.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#11988d\"><b>Adoption</b><p>Décision ou commencement effectif de l’utilisation.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#7b9d4a\"><b>Pertinence</b><p>Adéquation perçue au problème, aux acteurs et au contexte.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#608db3\"><b>Faisabilité</b><p>Possibilité de réalisation dans les conditions locales.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#528c74\"><b>Fidélité</b><p>Respect des fonctions ou composantes prévues.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#c18b56\"><b>Coût d’implantation</b><p>Ressources nécessaires pour intégrer la pratique.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#176c93\"><b>Pénétration</b><p>Degré d’intégration dans les services et organisations ciblés.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#20948c\"><b>Durabilité</b><p>Maintien de la pratique après son introduction.</p></div>\n</div>\n<p class=\"impl-index\">Taxonomie des huit résultats : <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<p>L’évaluation doit également analyser séparément les résultats de santé, l’expérience des personnes, l’accessibilité et la distribution des bénéfices. Une adoption élevée ne signifie pas automatiquement que l’intervention atteint les populations qui en ont le plus besoin. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 04</span><h4>Les défis contemporains de la mise en œuvre</h4>\n<h5>Complexité, contexte et interdépendances</h5>\n<p>Les organisations de santé évoluent dans des systèmes dynamiques : une intervention peut modifier les pratiques professionnelles, les flux d’orientation, les ressources et même les besoins auxquels elle répond. Les effets moyens peuvent masquer des trajectoires divergentes selon les groupes, organisations ou territoires. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh et Papoutsi, 2018)</a></p>\n<h5>Adapter les interventions sans perdre leurs mécanismes essentiels</h5>\n<p>La tension entre fidélité et adaptation demande de distinguer les fonctions essentielles des modalités ajustables. Une adaptation culturelle, linguistique ou organisationnelle peut renforcer l’accessibilité, mais une modification non documentée peut aussi altérer le mécanisme censé produire l’effet. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<h5>Évaluer la pérennité plutôt que le seul démarrage</h5>\n<p>L’adoption initiale n’est qu’une étape. Le maintien dépend notamment de la disponibilité des ressources, de l’intégration aux routines, de l’évolution des équipes et de la capacité des organisations à absorber les changements de contexte. Il exige un suivi au-delà de la période de financement ou d’expérimentation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<h5>Désimplanter les pratiques de faible valeur</h5>\n<p>Faire évoluer les systèmes suppose aussi d’abandonner ou de réduire les pratiques qui n’apportent pas suffisamment de bénéfices. Les habitudes établies, les incitations institutionnelles et les coûts politiques du changement peuvent rendre leur retrait différent de l’introduction d’une innovation. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n<h5>Agir entre plusieurs secteurs</h5>\n<p>Les réponses aux besoins sociaux et sanitaires mobilisent souvent les soins, les services sociaux, le logement, le transport et les organismes communautaires. La disponibilité d’un service ne démontre pas que les personnes peuvent réellement y accéder ni que les organisations travaillent ensemble. La portée effective et la coordination doivent être étudiées. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 05 · Données récentes</span><h4>Équité : ce que montrent les recherches de 2026</h4>\n<p>Une revue de portée publiée en 2026 a identifié 42 théories, modèles et cadres explicitement consacrés à l’équité en science de l’implantation. Elle montre qu’ils reconnaissent fréquemment les inégalités, mais proposent moins souvent des mécanismes opérationnels de cogouvernance ou d'action sur les obstacles structurels. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n<figure class=\"impl-figure\">\n<h5>Ce que les cadres d’implantation équitable prennent réellement en compte</h5>\n<p class=\"impl-legend\">Part des 42 cadres intégrant chaque critère d’analyse · Pourcentages publiés</p>\n<div role=\"img\" aria-label=\"Graphique horizontal comparant huit critères observés dans 42 cadres d’implantation équitable, de 90 à 40 pour cent.\"><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Reconnaître explicitement les inégalités</div><div class=\"impl-bar-line\"><span style=\"width:90%;background:#2697a9\"></span></div><strong>90 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Intégrer les savoirs des non-spécialistes</div><div class=\"impl-bar-line\"><span style=\"width:88%;background:#2697a9\"></span></div><strong>88 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Promouvoir l'adaptation culturelle</div><div class=\"impl-bar-line\"><span style=\"width:86%;background:#2697a9\"></span></div><strong>86 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Soutenir l'apprentissage réciproque</div><div class=\"impl-bar-line\"><span style=\"width:64%;background:#6b90be\"></span></div><strong>64 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Considérer les déterminants structurels</div><div class=\"impl-bar-line\"><span style=\"width:60%;background:#6b90be\"></span></div><strong>60 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Prévoir une cogouvernance communautaire</div><div class=\"impl-bar-line\"><span style=\"width:45%;background:#cb8a56\"></span></div><strong>45 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Définir des stratégies de réduction des inégalités</div><div class=\"impl-bar-line\"><span style=\"width:40%;background:#cb8a56\"></span></div><strong>40 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Agir sur les obstacles structurels</div><div class=\"impl-bar-line\"><span style=\"width:40%;background:#cb8a56\"></span></div><strong>40 %</strong></div></div>\n<figcaption>Lecture : 90 % des cadres nomment explicitement les inégalités, mais 40 % seulement proposent des processus pour agir sur les obstacles structurels. Il s’agit de caractéristiques des cadres scientifiques, non de leur efficacité démontrée sur le terrain. Source : <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></figcaption>\n</figure>\n<div class=\"impl-two\">\n<div class=\"impl-metric\"><strong>42</strong><span>Cadres étudiés dans la revue de portée. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></span></div>\n<div class=\"impl-metric\"><strong>17 %</strong><span>Sept cadres satisfont l’ensemble des huit critères d’équité examinés. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></span></div>\n</div>\n<p>Ce décalage invite à analyser non seulement la représentation des groupes marginalisés, mais aussi leurs droits réels de participation, l’accès aux informations, les règles d’allocation et la possibilité de réorienter les décisions. Le choix d’un cadre explicitement « équitable » ne suffit pas à garantir un changement structurel. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 06</span><h4>Les enjeux actuels de la recherche scientifique</h4>\n<h5>Reproductibilité, intégrité et incitations</h5>\n<p>Une accumulation de publications ne constitue pas, en elle-même, une garantie de connaissances robustes. La transparence des protocoles, des données, des analyses et des critères de décision est nécessaire pour rendre les résultats vérifiables et permettre leur correction. Les pratiques de science ouverte proposent notamment l’enregistrement préalable et la mise à disposition des matériaux lorsque les obligations éthiques le permettent. <a class=\"impl-cite\" href=\"https://doi.org/10.1126/science.aab2374\" target=\"_blank\" rel=\"noopener noreferrer\">(Nosek et al., 2015)</a></p>\n<h5>Intelligence artificielle : usage et contrôle</h5>\n<p>Les outils d’intelligence artificielle peuvent soutenir la recherche documentaire, la classification ou le suivi des programmes, mais leur déploiement doit être évalué en conditions réelles. Performance technique, biais, sécurité, explicabilité, responsabilité professionnelle et pertinence contextuelle constituent des dimensions distinctes de l’implantation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n<h5>Participation et redistribution du pouvoir</h5>\n<p>Une consultation ponctuelle ne garantit pas que les personnes concernées influencent le cadrage des problèmes, le choix des indicateurs ou les décisions. Les travaux récents sur l’équité soulignent l’écart entre la valorisation affichée des savoirs issus de l’expérience et les mécanismes concrets de copropriété ou de codécision. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n<h5>Confiance et légitimité des institutions</h5>\n<p>La défiance envers les scientifiques ne doit pas être présentée comme universelle : une enquête menée dans 68 pays auprès de 71 922 personnes décrit une confiance globalement modérément élevée, mais révèle aussi des attentes importantes concernant l’ouverture et l’écoute. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></p>\n<div class=\"impl-two\">\n<div class=\"impl-metric\"><strong>75 %</strong><span>Jugent les méthodes scientifiques comme le meilleur moyen d’établir le vrai et le faux. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></span></div>\n<div class=\"impl-metric\"><strong>42 %</strong><span>Estiment que les scientifiques tiennent au moins relativement compte des opinions d’autrui. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></span></div>\n</div>\n<p>L’enjeu dépasse donc la communication : il concerne également la transparence des décisions, la reconnaissance des désaccords et les modalités par lesquelles les institutions rendent compte de leurs choix. Ces relations entre capacité de révision et légitimité constituent des hypothèses à étudier, et non des effets établis par ces pourcentages. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 07 · Perspective critique</span><h4>Le retour épistémique : quand le terrain peut modifier la connaissance</h4>\n<p>Le manuscrit scientifique transmis propose de compléter le mouvement de la recherche vers l’action par un mouvement inverse : les observations, expériences vécues et conséquences imprévues devraient pouvoir conduire les institutions à réexaminer non seulement la manière d’appliquer une pratique, mais aussi les catégories, indicateurs ou règles qui fondent l’action. Cette perspective prolonge les débats sur l’apprentissage organisationnel et la gouvernance réflexive ; son dispositif d’audit demande encore des validations empiriques supplémentaires. (Argyris et Schön, 1978 ; Jasanoff, 2003)</p>\n<div class=\"impl-note\"><strong>Deux niveaux de rétroaction.</strong> Corriger l’exécution d’un programme n’équivaut pas à réexaminer la définition de sa réussite. Le retour épistémique vise une possibilité traçable de réviser un engagement scientifique ou administratif, ou de le maintenir avec des raisons explicites. (Argyris et Schön, 1978 ; Jasanoff, 2003)</div>\n<div class=\"impl-steps\" aria-label=\"Quatre conditions proposées dans le manuscrit sur le retour épistémique\">\n<div class=\"impl-step\"><b>01</b>Signal d’écart intelligible</div>\n<div class=\"impl-step\"><b>02</b>Droit reconnu de demander l’examen</div>\n<div class=\"impl-step\"><b>03</b>Forum comparant les explications</div>\n<div class=\"impl-step\"><b>04</b>Autorité tenue de motiver sa décision</div>\n</div>\n<p>Ce modèle exige également une condition préalable : l’engagement contesté doit être identifiable, daté et suffisamment documenté pour qu’une révision soit vérifiable. L’objectif n’est pas de rendre toute règle instable, mais de distinguer une stabilité justifiée d’une incapacité institutionnelle à apprendre. (Argyris et Schön, 1978 ; Jasanoff, 2003)</p>\n<p>Cette proposition reste un cadre conceptuel présenté dans le manuscrit fourni, et ne doit pas être confondue avec une théorie déjà validée à grande échelle. Les études futures devraient évaluer la traçabilité des décisions, les droits de contestation, la fiabilité des audits et les effets sur la légitimité institutionnelle. (Jasanoff, 2003 ; Nosek et al., 2015)</p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 08 · Agenda scientifique</span><h4>Priorités et nouvelles questions de recherche</h4>\n<p>Un programme de recherche contemporain doit articuler efficacité, stratégies d’implantation, équité, pérennité et gouvernance. Une consultation internationale sur la couverture sanitaire universelle identifie particulièrement les lacunes concernant l’équité de l’accès aux services et la protection financière des populations. <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Question</th><th>Approche proposée</th></tr></thead><tbody>\n<tr><td>Pourquoi une pratique éprouvée n’est-elle pas utilisée ?</td><td>Analyse des déterminants et évaluation des stratégies. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a></td></tr>\n<tr><td>À qui bénéficie-t-elle, et qui reste exclu ?</td><td>Analyses de portée, d’équité et des besoins non satisfaits. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></td></tr>\n<tr><td>Qu’est-ce qui permet son maintien ?</td><td>Suivis longitudinaux et analyse des phases d’implantation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></td></tr>\n<tr><td>Comment les partenaires intersectoriels coopèrent-ils ?</td><td>Méthodes mixtes, analyse de réseaux et études comparatives. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh et Papoutsi, 2018)</a></td></tr>\n<tr><td>Comment les institutions corrigent-elles leurs propres critères ?</td><td>Analyse documentaire des décisions et mise à l’épreuve de modèles de gouvernance réflexive. (Jasanoff, 2003)</td></tr>\n<tr><td>Comment implanter les outils d’IA de façon responsable ?</td><td>Évaluation prospective, audits sociotechniques et surveillance des effets inattendus. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a></td></tr>\n</tbody></table></div>\n<p>Les recherches sur le soutien à domicile constituent un terrain particulièrement pertinent : les besoins des personnes, les ressources disponibles dans les territoires et les relations entre organisations doivent être étudiés conjointement, sans assimiler disponibilité théorique, accessibilité effective et utilisation réelle des services. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n<h5>Accéder aux travaux scientifiques mobilisés</h5>\n<p>Les références restent volontairement courtes dans le texte et les figures. Les liens ci-dessous ouvrent directement les travaux correspondants.</p>\n<div class=\"impl-ref-list\">\n<a class=\"impl-ref-link\" aria-label=\"CFIR\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a><a class=\"impl-ref-link\" aria-label=\"Résultats d’implantation\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a><a class=\"impl-ref-link\" aria-label=\"RE-AIM\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a><a class=\"impl-ref-link\" aria-label=\"EPIS\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a><a class=\"impl-ref-link\" aria-label=\"ERIC\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a><a class=\"impl-ref-link\" aria-label=\"Devis hybrides\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a><a class=\"impl-ref-link\" aria-label=\"Équité 2026\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a><a class=\"impl-ref-link\" aria-label=\"Agenda international\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a><a class=\"impl-ref-link\" aria-label=\"Confiance et science\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a><a class=\"impl-ref-link\" aria-label=\"IA et implantation\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a>\n</div>\n</article>\n";
      implantation.replaceChildren(dossier);
      const introImpl = implantation.closest(".rubrique-corps")?.querySelector(".colonne-texte p.intro");
      if (introImpl) introImpl.textContent = "Fondements, cadres, méthodes, résultats d’implantation, équité et enjeux scientifiques contemporains (Damschroder et al., 2022 ; Crump et al., 2026).";
    } else {
      const lienDossier = D.createElement("p");
      lienDossier.className = "note";
      lienDossier.innerHTML = '<a href="' + CHEMIN + 'implantation/comprendre.html">' + echapper(l[7]) + ' ↗</a>';
      implantation.append(lienDossier);
    }

    const vulgarisation = fabriquer("implantation-vulgarisation", 3, l[3], l[6], "assets/chapitres/vulgarisation-01.webp");
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

  function decouper(sc, salle) {
    const table = $(".table.rubriques[data-rubriques], [data-rubriques][data-navigation=atelier]", sc);
    if (table) {
      if (salle === "implantation") preparerChapitresImplantation(sc, table);
      const boutons = $$(".rubriques-nav [role=tab]", table);
      const volets = Array.from(table.children).filter((v) => v.classList.contains("volet"));
      const chapitres = volets.map((v) => {
        const b = boutons.find((x) => x.dataset.volet === v.dataset.volet);
        return { source: v, titre: texteTitre(b?.querySelector("strong") || b) || texteTitre($(".rubrique-entete span", v)), cle: v.dataset.rubrique || "", surPlace: true };
      });
      if (salle === "vulgarisation" && langue !== "fr") {
        const titres = {
          fr: ["Dossier scientifique approfondi", "État des connaissances, statistiques internationales, tableaux comparatifs et figures authentiques issues de publications scientifiques.", "Lire le dossier scientifique complet"],
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
      const titres = { fr: ["Formations", "Expériences professionnelles"], en: ["Education", "Professional experience"], es: ["Formación", "Experiencia profesional"], zh: ["教育背景", "工作经历"], ar: ["التكوين", "الخبرة المهنية"], ru: ["Образование", "Профессиональный опыт"] }[langue] || ["Formations", "Expériences professionnelles"];
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
    if (regle?.unique) return { mode: "unique", chapitres: [] };
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
  const absolue = (u) => { try { return u ? new URL(u, D.baseURI).href : ""; } catch { return u; } };
  function photoDuBandeau(bandeau) {
    const m = (bandeau?.getAttribute("style") || "").match(/url\((['"]?)([^'")]+)\1\)/);
    return m ? absolue(m[2]) : "";
  }
  function premiereImage(source) {
    const img = $$("img", source).find((i) => !i.closest(".ic, svg") && !/\.svg(\?|$)/i.test(i.getAttribute("src") || "") && (i.getAttribute("width") || 300) >= 120);
    return img ? absolue(img.getAttribute("src")) : "";
  }

  // Libellés courts du sommaire français ; les titres et le contenu restent intacts.
  const sommaireTheseFr = {
    "1. Le problème : des besoins qui dépassent l’offre": "Besoins et offre de services",
    "2. Quand les besoins se cumulent, la réponse se complique": "Cumul des besoins",
    "3. Plusieurs portes d’entrée, pas une seule": "Portes d’entrée",
    "4. Ce qui existe déjà au Québec pour intégrer les services": "Intégration des services",
    "5. Ce que la littérature a déjà tenté": "État des connaissances",
    "La lacune principale": "Lacune scientifique",
    "6. Une réponse intersectorielle, pas seulement une intervention individuelle": "Réponse intersectorielle",
    "7. Volet secondaire : territoire vécu et territoire administratif": "Territoires vécus et administratifs",
    "8. L’idée de la thèse": "Idée de la thèse",
    "9. Ma posture": "Posture de recherche",
    "Lire le territoire avant de décrire les réseaux": "Lecture du territoire",
    "Le devis : trois objectifs qui s’enchaînent": "Devis en trois objectifs",
    "O1 · La revue de portée, de la recherche au tri": "O1 · Revue de portée",
    "Les outils, tels qu’on les utilise": "Outils de recherche",
    "Objectif 2 : de la donnée publique à l’atlas par territoire de CLSC": "O2 · Données et atlas",
    "Les données du mapping : ce qu’on a, ce qu’on en fait": "Données cartographiques",
    "Pourquoi ces deux méthodes sont indispensables": "Choix des méthodes",
    "Mesurer l’accessibilité et la réponse de proximité": "Accessibilité et proximité"
  };

  // Navigation de la méthodologie : un même objectif regroupe et colore
  // toutes ses sous-parties, sans toucher à leur contenu ou à leurs cibles.
  function organiserSommaireObjectifs(nav, intertitres) {
    const titres = [
      ["commun", "Cadre méthodologique"],
      ["O1", "Revue de portée et profils de besoins"],
      ["O2", "Cartographie des ressources"],
      ["O3", "Analyse des réseaux (SNA)"],
      ["fin", "Limites et articulation"]
    ];
    const groupes = new Map(titres.map(([code]) => [code, []]));
    const liens = $$(":scope > a[data-gab-intertitre]", nav);
    if (liens.length !== intertitres.length) return;
    liens.forEach((a) => {
      const h = intertitres[Number(a.dataset.gabIntertitre)];
      const brut = net(h.textContent).replace(/^([1-9])(?=[A-ZÀ-ÖØ-ÞŒ])/u, "");
      const t = normaliser(brut);
      const marqueur = /^(?:o\s*([123])|objectif\s*([123]))\b/.exec(t);
      const panneau = h.closest(".these-objectif-vue[data-vue-objectif]")?.dataset.vueObjectif || "";
      let code = /^O[123]$/.test(panneau) ? panneau : (marqueur ? "O" + (marqueur[1] || marqueur[2]) : "");
      // Le titre est prioritaire sur le contexte DOM, notamment pour les
      // outils O1 qui figurent après une carte de présentation O2.
      if (!code && /revue de portee|profils? de besoins|outils? de recherche|recherche documentaire|recherche bibliographique|criteres? d inclusion|criteres? d exclusion|criteres? de selection|strategie de recherche|codebook|covidence|criblage|bibliothecair|selection des etudes|extraction des etudes/.test(t)) code = "O1";
      if (!code && /mapping|cartograph|atlas|donnees cartographiques|lecture du territoire|accessibilite|proximite|croiser besoins|ressources disponibles|qgis|systeme d information geographique|ecologique|configuration territoriale|ecarts territoriaux/.test(t)) code = "O2";
      if (!code && /analyse de reseaux|reseaux|reseau egocentre|\bsna\b|graphes?|dyades?|matrices?|acteurs du reseau|references reelles du 211|liens entre acteurs|trajectoires intersectorielles/.test(t)) code = "O3";
      if (!code) {
        const ancetre = h.closest("[data-objectif]");
        if (/^O[123]$/.test(ancetre?.dataset.objectif || "")) code = ancetre.dataset.objectif;
      }
      if (!code) {
        let parent = h.parentElement;
        while (parent && !parent.classList.contains("gab-corps")) {
          const noms = typeof parent.className === "string" ? parent.className : "";
          const m = /(?:^|[\s-])o([123])(?:[\s-]|$)/i.exec(parent.id + " " + noms);
          if (m) { code = "O" + m[1]; break; }
          parent = parent.parentElement;
        }
      }
      if (!code) code = /limites?|parades|precautions|integration|articulation des methodes/.test(t) ? "fin" : "commun";
      if (/^O[123]$/.test(code)) {
        a.dataset.objectif = code;
        a.setAttribute("aria-label", code + " · " + net(a.textContent));
        const cible = a.querySelector(".gab-sommaire-etape-texte") || a;
        cible.textContent = cible.textContent.replace(/^(?:O|Objectif\s*)[123]\s*(?:[·.:\u2013-]\s*)?/i, "").trim();
      } else {
        a.removeAttribute("data-objectif");
      }
      groupes.get(code).push(a);
    });
    nav.classList.add("gab-sommaire-objectifs");
    const etiquette = nav.querySelector(":scope > span");
    nav.replaceChildren();
    if (etiquette) nav.append(etiquette);

    // Trois accès directs toujours visibles : les détails du sommaire
    // défilent librement, mais O1, O2 et O3 restent immédiatement repérables.
    const raccourcis = el("div", "gab-sommaire-raccourcis");
    const contenuMethodes = intertitres[0]?.closest(".gab-corps");
    ["O1", "O2", "O3"].forEach((code) => {
      let cibleId = groupes.get(code)[0]?.dataset.gabCible;
      if (!cibleId && contenuMethodes) {
        const cible = $$('[data-objectif="' + code + '"]', contenuMethodes)
          .find((element) => element.matches("article, section, div, details, h3, h4"));
        if (cible) {
          if (!cible.id) cible.id = "gab-objectif-sommaire-" + langue + "-" + code.toLowerCase();
          cibleId = cible.id;
        }
      }
      if (!cibleId) return;
      const lienObjectif = el("a", "gab-sommaire-raccourci", echapper(code));
      lienObjectif.href = "#" + encodeURIComponent(cibleId);
      lienObjectif.dataset.gabCible = cibleId;
      lienObjectif.setAttribute("aria-label", code + " · " + titres.find(([id]) => id === code)[1]);
      raccourcis.append(lienObjectif);
    });
    if (raccourcis.children.length) nav.append(raccourcis);
    titres.forEach(([code, nom]) => {
      const liensDuGroupe = groupes.get(code);
      if (!liensDuGroupe.length) return;
      const groupe = el("section", "gab-sommaire-groupe");
      if (/^O[123]$/.test(code)) groupe.dataset.objectif = code;
      else groupe.dataset.transversal = code;
      groupe.setAttribute("aria-label", nom);
      const titre = el("div", "gab-sommaire-groupe-titre");
      if (/^O[123]$/.test(code)) titre.append(el("b", "", echapper(code)));
      titre.append(el("strong", "", echapper(nom)));
      const corps = el("div", "gab-sommaire-groupe-liens");
      corps.append(...liensDuGroupe);
      groupe.append(titre, corps);
      nav.append(groupe);
    });
  }


  // Thèse : un sommaire structuré par sections colorées dans chaque chapitre.
  // Même composants, même hiérarchie et mêmes destinations que le modèle de la
  // méthodologie (Cadre / O1 / O2 / O3). Les titres h4 restent intacts.
  function organiserSommaireSections(nav, intertitres, chapitre) {
    const titre = normaliser(chapitre.titre);
    // Débuts des sections dans l'ordre de lecture : les sous-titres non
    // reconnus restent dans leur section en cours, jamais supprimés.
    const plans = {
      contexte: [
        { nom: "Notions et ressources" },
        { nom: "Besoins sociaux et réponse", debut: /le probleme|besoins et offre|besoins sociaux|les besoins se cumulent/ },
        { nom: "Connaissances et lacune", debut: /etat des connaissances|ce que la litterature/ },
        { nom: "Territoires et posture", debut: /reponse intersectorielle|territoires vecus/ }
      ],
      objectifs: [
        { nom: "Question et objectifs" },
        { nom: "Profils de besoins", objectif: "O1", debut: /^o\s*1\b|^objectif\s*1\b|decrire les profils/ },
        { nom: "Ressources territoriales", objectif: "O2", debut: /^o\s*2\b|^objectif\s*2\b|reperer les ressources/ },
        { nom: "Réseaux intersectoriels", objectif: "O3", debut: /^o\s*3\b|^objectif\s*3\b|comprendre les reseaux/ }
      ],
      faisabilite: [
        { nom: "Données et conditions" },
        { nom: "Terrain et partenariats", debut: /o3 sur le terrain|associer le terrain|partenariats/ },
        { nom: "Calendrier", debut: /calendrier|planification/ }
      ],
      retombees: [
        { nom: "Productions et premiers résultats" },
        { nom: "Retombées et échelles d'action", debut: /retombees concretes|a l echelle du quebec/ },
        { nom: "Évaluation et références", debut: /comment on s assure|references/ }
      ],
      transfert: [
        { nom: "Transfert de connaissances" },
        { nom: "Implantation", debut: /preparer les conditions|mise en oeuvre|implantation/ },
        { nom: "Diffusion et évaluation", debut: /diffuser|evaluer l usage|evaluation de l usage/ },
        { nom: "Participation et cadre institutionnel", debut: /partenaires patients|cadre institutionnel|codirection/ }
      ]
    };
    const cle = /problematique|objectifs/.test(titre) ? "objectifs"
      : /contexte/.test(titre) ? "contexte"
      : /faisabilite/.test(titre) ? "faisabilite"
      : /retombees/.test(titre) ? "retombees"
      : /transfert|implantation/.test(titre) ? "transfert" : "";
    const plan = plans[cle];
    if (!plan) return;
    const liens = Array.from(nav.querySelectorAll(":scope > a[data-gab-intertitre]"));
    if (liens.length !== intertitres.length || liens.length < 2) return;

    // Couleurs distinctes pour les sections, cohérentes entre les six
    // chapitres ; O1/O2/O3 conservent leurs teintes de la méthodologie.
    const palette = [
      { texte:"#365772", trait:"#76a2bb", fond:"#edf4f8", lien:"#f8fbfd" },
      { texte:"#286c23", trait:"#5aae38", fond:"#ecf7e8", lien:"#f5fbf2" },
      { texte:"#006e72", trait:"#11a7a5", fond:"#e9f7f6", lien:"#f3fbfa" },
      { texte:"#18559b", trait:"#0755ad", fond:"#ebf2fd", lien:"#f3f7ff" },
      { texte:"#80532e", trait:"#bf8953", fond:"#faf2e9", lien:"#fdf9f4" }
    ];
    const listes = plan.map(() => []);
    let sectionActuelle = 0;
    liens.forEach((a, k) => {
      const valeur = normaliser(intertitres[k].textContent);
      for (let j = sectionActuelle + 1; j < plan.length; j++) {
        if (plan[j].debut?.test(valeur)) {
          sectionActuelle = j;
          break;
        }
      }
      listes[sectionActuelle].push(a);
    });
    nav.classList.add("gab-sommaire-objectifs", "gab-sommaire-sections");
    const etiquette = nav.querySelector(":scope > span");
    nav.replaceChildren();
    if (etiquette) nav.append(etiquette);
    plan.forEach((g, k) => {
      if (!listes[k].length) return;
      const groupe = el("section", "gab-sommaire-groupe");
      groupe.dataset.section = cle + "-" + k;
      if (g.objectif) groupe.dataset.objectif = g.objectif;
      const couleur = g.objectif === "O1" ? palette[1] :
        g.objectif === "O2" ? palette[2] :
        g.objectif === "O3" ? palette[3] : palette[k % palette.length];
      for (const [variable, valeur] of Object.entries({
        "--objectif-texte": couleur.texte,
        "--objectif-trait": couleur.trait,
        "--objectif-fond": couleur.fond,
        "--objectif-lien": couleur.lien
      })) groupe.style.setProperty(variable, valeur);
      groupe.setAttribute("aria-label", g.nom);
      const enTete = el("div", "gab-sommaire-groupe-titre");
      if (g.objectif) enTete.append(el("b", "", echapper(g.objectif)));
      enTete.append(el("strong", "", echapper(g.nom)));
      const items = el("div", "gab-sommaire-groupe-liens");
      items.append(...listes[k]); // conserve data-gab-intertitre et les liens
      groupe.append(enTete, items);
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
      const lien = el("a", "", echapper(libelle));
      lien.href = "#" + encodeURIComponent(cible.id);
      lien.dataset.gabCible = cible.id;
      return lien;
    };
    const groupes = [
      { nom: "Problématique", liens: [ajouterLien(
        corps.querySelector(".these-question-encadre") || corps.querySelector(".these-problematique") || corps,
        "Question de recherche"
      )] },
      { nom: "Objectif général", liens: [lienPour(/^objectif general$/)] },
      { nom: "Point de thèse", liens: [lienPour(/^point de these$/)] }
    ];
    ["O1", "O2", "O3"].forEach((code, index) => {
      const numero = index + 1;
      const carte = corps.querySelector('.ov-carte[data-objectif="' + code + '"], .objectif-carte[data-objectif="' + code + '"]');
      const lacune = carte?.querySelector(".ov-lacune-avant");
      const libelles = ["decrire les profils", "reperer les ressources", "comprendre les reseaux"];
      const objectif = lienPour(new RegExp("^o\\s*" + numero + "\\b|^objectif\\s*" + numero + "\\b|" + libelles[index]));
      const liensObjectif = [
        ajouterLien(lacune, "Lacune scientifique " + numero),
        objectif
      ].filter(Boolean);
      groupes.push({ nom: "Lacune scientifique " + numero + " et objectif spécifique " + numero,
        objectif: code, liens: liensObjectif });
    });
    const hypotheses = corps.querySelector(".these-hypotheses h4");
    if (hypotheses) groupes.push({ nom: "Hypothèses",
      liens: [lienPour(/^hypotheses/) || ajouterLien(hypotheses, "Hypothèses exploratoires")] });
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
      groupe.setAttribute("aria-label", g.nom);
      const entete = el("div", "gab-sommaire-groupe-titre");
      if (g.objectif) entete.append(el("b", "", echapper(g.objectif)));
      entete.append(el("strong", "", echapper(g.nom)));
      const items = el("div", "gab-sommaire-groupe-liens");
      items.append(...elements);
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
      numero.append(el("strong","", "Section " + deux(k+1)));
      const contenu = el("div","gab-sommaire-groupe-liens");
      contenu.append(lien);
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
      if (titre.tagName === "H3") {
        groupe = { nom: net(titre.textContent), titreLien: lien, liens: [] };
        groupes.push(groupe);
      } else {
        // Pour les chapitres sans H3, créer de courtes sections colorées
        // à partir des titres existants, sans les renommer ni les déplacer.
        if (!groupe || (!groupe.titreLien && groupe.liens.length >= 3)) {
          groupe = { nom: "", titreLien: null, liens: [] };
          groupes.push(groupe);
        }
        groupe.liens.push(lien);
      }
    });
    const palette = [
      ["#365772","#76a2bb","#edf4f8","#f8fbfd"],
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
      const couleurs = palette[index % palette.length];
      ["--objectif-texte","--objectif-trait","--objectif-fond","--objectif-lien"]
        .forEach((nom,i)=>bloc.style.setProperty(nom,couleurs[i]));
      const titre = el("div", "gab-sommaire-groupe-titre");
      titre.append(el("b", "", deux(index + 1)));
      if (g.titreLien) {
        g.titreLien.classList.add("gab-section-lien-titre");
        titre.append(g.titreLien);
        bloc.setAttribute("aria-label", g.nom);
      } else {
        titre.append(el("strong", "", echapper("Section " + deux(index + 1))));
      }
      const liste = el("div", "gab-sommaire-groupe-liens");
      liste.append(...g.liens);
      bloc.append(titre, liste);
      nav.append(bloc);
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
      $$(":scope > .rubrique-entete, :scope > .rubriques-pagination", section).forEach((x) => x.remove());
    }
    const grille = el("div", "gab-chapitre-grille");
    const texte = el("div", "gab-chapitre-texte");
    const tete = el("header", "gab-chapitre-tete", `<span class="gab-chapitre-num"><b>${deux(i + 1)}</b>${echapper(T.chapitre(i + 1, n))}</span><h3 class="gab-chapitre-titre">${echapper(ch.titre)}</h3>`);
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
      if (ch.photoInterne && ch.choix?.interne) $$("img", source).find((im) => absolue(im.getAttribute("src")) === ch.photoInterne)?.closest("picture, img")?.remove();
      corps.append(source);
    }
    texte.append(tete, corps);
    const aside = el("aside", "gab-chapitre-aside");
    // Dans le contexte de la thèse, le visuel de chiffres clés du premier chapitre
    // figure déjà dans le corps : ne pas le dupliquer au-dessus du sommaire.
    if (choix.url && !(salle === "recherche" && i === 0) && !(salle === "recherche" && ch.cle === "transfert")) {
      const credit = choix.image ? `${T.photo} : ${echapper(choix.image.auteur || "")}${choix.image.licence ? " · " + echapper(choix.image.licence) : ""}` : "";
      const alt = choix.alt || (langue === "fr" && choix.image?.alt ? choix.image.alt : "");
      aside.innerHTML = `<div class="gab-photo"><img src="${echapper(choix.url)}" alt="${echapper(alt)}" loading="lazy" decoding="async" width="960" height="640">${credit ? `<small class="gab-credit">${choix.image.source_url ? `<a href="${echapper(choix.image.source_url)}" target="_blank" rel="noopener">${credit}</a>` : credit}</small>` : ""}</div>`;
    }
    // Ma thèse : le sommaire repère les parties h3 et h4 d'un chapitre.
    const methodeThese = salle === "recherche" && langue === "fr" &&
      (ch.cle === "methodes" || ch.cle === "methode" || /m[ée]thod/i.test(ch.titre));
    const intertitres = Array.from(corps.querySelectorAll("h3, h4, h5.titre-bloc"))
      .filter((h) => {
        if (h.closest("details:not([open]), .gab-source.carte-vitrine")) return false;
        const invisible = h.closest("[hidden]");
        return !invisible || (methodeThese && invisible.matches(".these-objectif-vue[data-vue-objectif]"));
      })
      .filter((h) =>
        !h.closest(".gab-sommaire-chapitre, .gab-bas-chapitre, .gab-chapitre-tete") &&
        (net(h.textContent) !== net(ch.titre) || h.tagName !== "H3")
      );
    if (intertitres.length >= (salle === "recherche" ? 1 : 2)) {
      const nav = el("nav", "gab-sommaire-chapitre");
      nav.setAttribute("aria-label", T.dans);
      nav.setAttribute("tabindex", "0");
      const theseFr = salle === "recherche" && langue === "fr";
      const entrees = intertitres;
      nav.innerHTML = `<span>${echapper(T.dans)}</span>` + entrees.map((h, k) => {
        let titre = net(h.textContent);
        // Certains h4 placent le chiffre de l'étape dans un élément distinct :
        // textContent le colle au titre (« 1Les », « 3O3 »). Le séparer.
        const etape = theseFr ? /^([1-9])(?=[A-ZÀ-ÖØ-ÞŒ])/u.exec(titre)?.[1] : "";
        if (etape) titre = net(titre.slice(etape.length));
        const prefixe = /^(?:O|Objectif\s*)([123])\b/i.exec(titre);
        const code = h.closest("[data-objectif]")?.dataset.objectif || (prefixe ? "O" + prefixe[1] : "");
        const objectif = /^O[123]$/.test(code) ? code : "";
        let libelle = theseFr ? sommaireTheseFr[titre] || titre : titre;
        if (objectif && !/^(?:O|Objectif\s*)[123]\b/i.test(libelle)) libelle = objectif + " · " + libelle;
        const texteLien = etape
          ? `<span class="gab-sommaire-etape-num">${deux(Number(etape))}</span><span class="gab-sommaire-etape-texte">${echapper(libelle)}</span>`
          : echapper(libelle);
        const id = h.id || `gab-partie-${langue}-${ch.cle || "chapitre"}-${i + 1}-${k + 1}`;
        if (!h.id) h.id = id;
        return `<a href="#${echapper(id)}" data-gab-intertitre="${k}" data-gab-cible="${echapper(id)}" data-gab-niveau="${h.tagName.toLowerCase()}"${etape ? ' class="gab-sommaire-etape"' : ""}${objectif ? ` data-objectif="${objectif}"` : ""}${libelle !== titre ? ` title="${echapper(titre)}"` : ""}>${texteLien}</a>`;
      }).join("");
      if (theseFr && (ch.cle === "methodes" || ch.cle === "methode" || /m[ée]thod/i.test(ch.titre))) {
        organiserSommaireObjectifs(nav, entrees);
      } else if (theseFr && /problematique|objectifs/.test(normaliser(ch.titre))) {
        organiserSommaireProblematique(nav, entrees, corps);
      } else if (theseFr) {
        organiserSommaireSections(nav, entrees, ch);
      } else if (salle === "vulgarisation" && langue === "fr") {
        organiserSommaireVulgarisation(nav, entrees);
      } else {
        organiserSommaireUniversel(nav, entrees);
      }
      aside.append(nav);
      // Seule la grille du chapitre contenant un sommaire universel change :
      // les onglets des portes, les titres, photos et contenus restent en place.
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
      } else if (photo) tete.after(photo);
      grille.classList.add("gab-menu-gauche");
    }
    grille.append(texte, aside);
    section.append(grille);
    // Navigation de fin de page : on passe à une autre vue, jamais au
    // chapitre suivant dans une longue page continue.
    const bas = el("nav", "gab-bas-chapitre");
    bas.setAttribute("aria-label", T.chapitre(i + 1, n));
    bas.innerHTML =
      `<button type="button" class="gab-bas-lien gab-bas-precedent" data-gab-pas="-1"${i === 0 ? " disabled" : ""}><span class="gab-bas-chevron" aria-hidden="true">‹</span><span class="gab-bas-libelle"><small>${echapper(T.precedent)}</small><strong class="gab-nav-cible"></strong></span></button>` +
      `<button type="button" class="gab-bas-sommaire" data-gab-pas="tous">${echapper(T.tous)}</button>` +
      `<button type="button" class="gab-bas-lien gab-bas-suivant" data-gab-pas="1"${i === n - 1 ? " disabled" : ""}><span class="gab-bas-libelle"><small>${echapper(T.suivant)}</small><strong class="gab-nav-cible"></strong></span><span class="gab-bas-chevron" aria-hidden="true">›</span></button>`;
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
    // Ces deux pages se lisent d'un seul tenant : conserver le récit et la
    // chronologie sources, sans créer de tuiles, pages ni navigation de chapitres.
    if (salle === "biographie" || salle === "parcours") {
      sc.dataset.gabSalle = salle;
      sc.dataset.gabChapitres = "0";
      sc.classList.add("gab", "gab-unique", "gab-continu");
      if (bandeau) {
        bandeau.classList.add("gab-bandeau");
        const photo = photoDuBandeau(bandeau);
        if (photo) bandeau.style.setProperty("--gab-photo", `url("${photo}")`);
        bandeau.classList.remove("revele");
        $$(".revele", bandeau).forEach((x) => x.classList.remove("revele"));
      }
      // Les anciennes adresses de chapitre restent des ancrages dans la page.
      if (salle === "biographie") $$(".recit > li", sc).forEach((item, i) => {
        item.id = "biographie-chapitre-" + (i + 1);
      });
      const lectureContinue = el("div", "continu-texte");
      lectureContinue.append(...Array.from(corps.children));
      const navigation = el("aside", "continu-aside");
      const nav = el("nav", "gab-sommaire-chapitre gab-sommaire-objectifs continu-sommaire");
      const libelles = {
        fr: ["Dans cette page", "Expériences et recherche", "Engagements et perspectives", "Formations et expériences"],
        en: ["On this page", "Experience and research", "Commitments and perspectives", "Education and experience"],
        es: ["En esta página", "Experiencia e investigación", "Compromisos y perspectivas", "Formación y experiencia"],
        zh: ["本页目录", "经历与研究", "参与和展望", "教育与经历"],
        ar: ["في هذه الصفحة", "الخبرات والبحث", "المشاركة والآفاق", "التكوين والخبرات"],
        ru: ["На этой странице", "Опыт и исследования", "Участие и перспективы", "Образование и опыт"]
      }[langue] || ["Dans cette page", "Expériences et recherche", "Engagements et perspectives", "Formations et expériences"];
      nav.setAttribute("aria-label", libelles[0]);
      nav.append(el("span", "", echapper(libelles[0])));
      const cibles = salle === "biographie" ? $$(".recit h3, .vision h3", lectureContinue)
        : $$(".colonne-texte > h2, .colonne-texte > h3, .frise h4", lectureContinue);
      const groupes = [el("section", "gab-sommaire-groupe"), el("section", "gab-sommaire-groupe")];
      groupes.forEach((g, i) => {
        g.dataset.objectif = i ? "O2" : "O1";
        g.append(el("div", "gab-sommaire-groupe-titre", `<strong>${echapper(libelles[salle === "parcours" ? 3 : i + 1])}</strong>`));
      });
      cibles.forEach((h, i) => {
        if (!h.id) h.id = "continu-" + salle + "-" + i;
        const a = el("a", "", echapper(net(h.textContent)));
        a.href = "#" + h.id;
        a.dataset.continuCible = h.id;
        groupes[salle === "biographie" && i >= 3 ? 1 : 0].append(a);
      });
      groupes.forEach((g) => { if (g.querySelector("a")) nav.append(g); });
      navigation.append(nav);
      corps.append(navigation, lectureContinue);
      return;
    }
    if (salle === "recherche") mettreDevisEnCartes(sc);
    const photoSalle = photoDuBandeau(bandeau);
    const { mode, table, chapitres } = decouper(sc, salle);

    // Introduction : un seul chapeau, sans surtitre (le bandeau dit déjà où l'on est).
    const intro = Array.from(corps.children).find((c) => c.querySelector("h2") || c.matches(".colonne-texte"));
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
      if (salle === "recherche" && chapitres.length === 6 && i === 3) {
        ch.choix = {
          url: new URL(`${CHEMIN}assets/chapitres/calendrier-faisabilite.svg`, D.baseURI).href,
          alt: "Calendrier de planification scientifique avec étapes O1, O2 et O3",
        };
      } else if (salle === "recherche" && chapitres.length === 6 && i === 4) {
        const acteurs = CATALOGUE.find((im) => im.fichier === "litterature-15.webp");
        ch.choix = acteurs ? { url: urlImage(acteurs), image: acteurs } : choisirImage(ch, salle, porte?.dataset.salle, prises, photoSalle);
      } else {
        ch.choix = choisirImage(ch, salle, porte?.dataset.salle, prises, photoSalle);
      }
      if (ch.choix.image) prises.add(ch.choix.image.fichier);
    });

    // Chapitres.
    const n = chapitres.length;
    if (mode === "rubriques") {
      $$(":scope > .rubriques-console", table).forEach((x) => x.remove());
      ["data-onglets", "data-navigation", "role"].forEach((a) => table.removeAttribute(a));
      table.classList.remove("table", "rubriques");
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
        if (n >= 2) puces.append(el("span", "", echapper(salle === "recherche" && langue === "fr" ? `${n} chapitres de thèse` : T.chapitres(n))));
        if (minutes <= 90) puces.append(el("span", "", echapper(T.minutes(minutes))));
        if (puces.children.length) texte.append(puces);
      }
      bandeau.classList.remove("revele");
      $$(".revele", bandeau).forEach((x) => x.classList.remove("revele"));
    }

    // Tuiles des chapitres, juste sous le bandeau.
    if (n >= 2) {
      const programme = el("nav", "gab-programme");
      const titreProgramme = salle === "recherche" && langue === "fr" ? "Les chapitres de ma thèse" : T.programme;
      const aideProgramme = salle === "recherche" && langue === "fr" ? "Choisir un chapitre" : T.aide;
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
  const onglets = salle && $(".salle-onglets", salle);
  let lecture = null, observateur = null, courant = 0;

  function defiler(cible) {
    if (!cible) return;
    cible.scrollIntoView({ block: "start", behavior: calme.matches ? "instant" : "smooth" });
  }
  const chapitresDe = (zone) => $$(".gab-chapitre", zone).filter((c) => c.closest(".gab") === zone);

  // Montrer la destination réelle sur les deux navigations (haut et bas),
  // plutôt qu'une flèche sans indication. Titres lus dans les chapitres existants.
  function nommerChapitresVoisins(zone, liste, index) {
    const actif = liste[index];
    if (!actif) return;
    const navigations = [$(".gab-bas-chapitre", actif)];
    if (lecture && contenu && $(".gab", contenu) === zone) navigations.push(lecture);
    navigations.filter(Boolean).forEach((nav) => {
      [-1, 1].forEach((sens) => {
        const bouton = $("[data-gab-pas='" + sens + "']", nav);
        if (!bouton) return;
        const voisin = liste[index + sens];
        const action = sens < 0 ? T.precedent : T.suivant;
        const titre = voisin ? net($(".gab-chapitre-titre", voisin)?.textContent) : "";
        const destination = voisin ? deux(index + sens + 1) + " · " + titre : "";
        bouton.disabled = !voisin;
        const cible = $(".gab-nav-cible, .gab-fleche-cible", bouton);
        if (cible) cible.textContent = destination;
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
    return liste.findIndex((chapitre) =>
      chapitre.dataset.gabSlug === repere ||
      chapitre.dataset.rubrique === repere ||
      chapitre.id === repere ||
      $$("[data-rubrique], [data-axe-cible], [id]", chapitre).some((element) =>
        element.dataset.rubrique === repere || element.dataset.axeCible === repere || element.id === repere));
  }

  function ouvrirPageChapitre(zone, index, options = {}) {
    if (!zone) return;
    const liste = chapitresDe(zone);
    if (!liste.length) return;
    const cible = index >= 0 && index < liste.length ? index : -1;
    const ouverte = cible >= 0;
    liste.forEach((chapitre, i) => {
      const visible = ouverte && i === cible;
      chapitre.hidden = !visible;
      chapitre.inert = !visible;
      chapitre.classList.toggle("gab-page-active", visible);
    });
    zone.classList.toggle("gab-page-chapitre", ouverte);
    zone.classList.toggle("gab-page-sommaire", !ouverte);
    if (ouverte) nommerChapitresVoisins(zone, liste, cible);
    $$(".gab-tuile[data-gab-aller]", zone).forEach((tuile, i) => {
      if (ouverte && i === cible) tuile.setAttribute("aria-current", "page");
      else tuile.removeAttribute("aria-current");
    });
    if (lecture && zone === $(".gab", contenu)) {
      if (ouverte) {
        marquer(cible);
        $$("[data-gab-pas='-1']", lecture).forEach((bouton) => { bouton.disabled = cible === 0; });
        $$("[data-gab-pas='1']", lecture).forEach((bouton) => { bouton.disabled = cible === liste.length - 1; });
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
    if (options.haut && dansSalle && salle) salle.scrollTo({ top: 0, behavior: "instant" });
    else if (options.haut && dansPageLibre) {
      ($(".gab-chapitres", zone) || zone).scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  D.addEventListener("click", (ev) => {
    const menuContinu = ev.target.closest("[data-continu-menu]");
    if (menuContinu) {
      const ouvert = salle.classList.toggle("continu-rubriques-ouvertes");
      menuContinu.setAttribute("aria-expanded", String(ouvert));
      return;
    }
    const pasContinu = ev.target.closest("[data-continu-pas], [data-continu-rubrique]");
    if (pasContinu) {
      const boutons = $$(".onglet-salle", onglets);
      const index = boutons.findIndex((b) => b.classList.contains("actif"));
      const cible = pasContinu.dataset.continuRubrique
        ? boutons.find((b) => b.dataset.sous === pasContinu.dataset.continuRubrique)
        : boutons[index + Number(pasContinu.dataset.continuPas)];
      if (cible) cible.click();
      return;
    }
    const lienContinu = ev.target.closest("[data-continu-cible]");
    if (lienContinu) {
      ev.preventDefault();
      const zone = lienContinu.closest(".gab-continu");
      const cible = $$("[id]", zone).find((x) => x.id === lienContinu.dataset.continuCible);
      if (cible) {
        $$("[data-continu-cible]", zone).forEach((a) => a.removeAttribute("aria-current"));
        lienContinu.setAttribute("aria-current", "location");
        defiler(cible);
      }
      return;
    }
    const tuile = ev.target.closest("[data-gab-aller]");
    if (tuile) {
      const zone = tuile.closest(".gab");
      const cible = chapitresDe(zone)[+tuile.dataset.gabAller];
      if (!cible) return;
      ev.preventDefault();
      ouvrirPageChapitre(zone, +tuile.dataset.gabAller, { adresse: true, haut: true });
      return;
    }
    const inter = ev.target.closest("[data-gab-intertitre], [data-gab-cible]");
    if (inter) {
      ev.preventDefault();
      const chapitre = inter.closest(".gab-chapitre");
      const cible = inter.dataset.gabCible
        ? $$("[id]", chapitre).find((x) => x.id === inter.dataset.gabCible)
        : $$("h4", $(".gab-corps", chapitre)).filter((x) => !x.closest("details:not([open]), [hidden], .gab-source.carte-vitrine"))[+inter.dataset.gabIntertitre];
      if (cible) {
        const vue = cible.closest(".these-objectif-vue[data-vue-objectif]");
        if (vue?.hidden) {
          const code = vue.dataset.vueObjectif;
          const selection = chapitre.querySelector('.these-methode-parcours[data-objectifs-isoles="oui"] a[data-objectif="' + code + '"]');
          if (selection) selection.click();
        }
        Array.from(chapitre.querySelectorAll("details")).filter((d) => d.contains(cible)).forEach((d) => { d.open = true; });
        defiler(cible);
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
      if (pas.dataset.gabPas === "tous") ouvrirPageChapitre(zone, -1, { adresse: true, haut: true });
      else {
        const liste = chapitresDe(zone);
        const actuel = liste.findIndex((chapitre) => !chapitre.hidden);
        if (actuel >= 0) {
          const cible = Math.max(0, Math.min(liste.length - 1, actuel + Number(pas.dataset.gabPas)));
          ouvrirPageChapitre(zone, cible, { adresse: true, haut: true });
        }
      }
    }
  });

  function preparerSalle() {
    if (!salle || !barre) return;
    if (!$(".gab-porte-nom", barre)) {
      const nom = el("span", "gab-porte-nom");
      $("[data-retour]", barre).after(nom);
      if (onglets) nom.after(onglets);
      lecture = el("div", "gab-lecture");
      lecture.innerHTML = `<button type="button" class="gab-tous" data-gab-pas="tous"><span aria-hidden="true">▦</span><span>${echapper(T.tous)}</span></button>` +
        `<button type="button" class="gab-fleche gab-fleche-precedente" data-gab-pas="-1" aria-label="${echapper(T.precedent)}"><span class="gab-fleche-icone" aria-hidden="true">‹</span><span class="gab-fleche-libelle"><span class="gab-fleche-texte">${echapper(T.precedent)}</span><small class="gab-fleche-cible"></small></span></button>` +
        `<div class="gab-actuel" aria-live="polite"><b></b><span><small></small><strong></strong></span></div>` +
        `<button type="button" class="gab-fleche gab-fleche-suivante" data-gab-pas="1" aria-label="${echapper(T.suivant)}"><span class="gab-fleche-libelle"><span class="gab-fleche-texte">${echapper(T.suivant)}</span><small class="gab-fleche-cible"></small></span><span class="gab-fleche-icone" aria-hidden="true">›</span></button>` +
        `<div class="gab-segments"></div>`;
      barre.append(lecture);
      barre.classList.add("gab-barre");
      salle.classList.add("gab-salle");
      salle.addEventListener("scroll", suivreDefilement, { passive: true });
    }
  }

  function decorerOnglets() {
    if (!onglets) return;
    $$(".onglet-salle", onglets).forEach((b) => {
      if ($(".gab-onglet-photo", b)) return;
      const sousSalle = b.dataset.sous;
      // Pictogrammes vectoriels explicites : pas de photos arbitraires recadrées.
      const dessins = {
        recherche: '<path d="M8 3h8l4 4v14H4V3h4"/><path d="M16 3v5h4M8 12h8M8 16h6"/>',
        axes: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M11 7 6 16M13 7l5 9M7 18h10"/>',
        publications: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 1V4Z"/><path d="M5 20V7a3 3 0 0 1 3-3M9 9h6M9 13h6M9 17h4"/>',
        approche: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>',
        methodes: '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="9" cy="5" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="19" r="2"/>',
        ia: '<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 9h6v6H9zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'
      };
      const photo = el("span", "gab-onglet-photo");
      photo.setAttribute("aria-hidden", "true");
      photo.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">' + (dessins[sousSalle] || dessins.recherche) + '</svg>';
      b.prepend(photo);
    });
  }

  function marquer(i) {
    if (!lecture || !contenu) return;
    const zone = $(".gab", contenu);
    const liste = chapitresDe(zone);
    if (!liste.length) return;
    courant = Math.max(0, Math.min(liste.length - 1, i));
    const ch = liste[courant];
    const titre = net($(".gab-chapitre-titre", ch)?.textContent);
    const couleur = ch.style.getPropertyValue("--gab-c");
    lecture.style.setProperty("--gab-c", couleur);
    $(".gab-actuel b", lecture).textContent = deux(courant + 1);
    $(".gab-actuel small", lecture).textContent = T.chapitre(courant + 1, liste.length);
    $(".gab-actuel strong", lecture).textContent = titre;
    $$(".gab-segments button", lecture).forEach((s, k) => { s.classList.toggle("lu", k < courant); s.setAttribute("aria-current", k === courant); });
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


  // Sports et loisirs : conserver la barre de navigation initiale, sans recréer de chapitres.
  // Les huit figures restent côte à côte dans leur grille ; les flèches les rejoignent par défilement.
  let navigationLoisirs = null;
  const NAV_LOISIRS = {
    fr: { tous: "Toutes les activités", precedent: "Activité précédente", suivant: "Activité suivante", compteur: (i,n) => "Activité " + i + " sur " + n },
    en: { tous: "All activities", precedent: "Previous activity", suivant: "Next activity", compteur: (i,n) => "Activity " + i + " of " + n },
    es: { tous: "Todas las actividades", precedent: "Actividad anterior", suivant: "Actividad siguiente", compteur: (i,n) => "Actividad " + i + " de " + n },
    zh: { tous: "所有活动", precedent: "上一项活动", suivant: "下一项活动", compteur: (i,n) => "活动 " + i + " / " + n },
    ar: { tous: "كل الأنشطة", precedent: "النشاط السابق", suivant: "النشاط التالي", compteur: (i,n) => "النشاط " + i + " من " + n },
    ru: { tous: "Все занятия", precedent: "Предыдущее занятие", suivant: "Следующее занятие", compteur: (i,n) => "Занятие " + i + " из " + n }
  };
  const motsLoisirs = NAV_LOISIRS[langue] || NAV_LOISIRS.fr;

  function rafraichirBarreLoisirs() {
    const etat = navigationLoisirs;
    if (!etat || !lecture || !etat.activites.length) return;
    const i = etat.index, n = etat.activites.length;
    lecture.style.setProperty("--gab-c", COULEURS[i % COULEURS.length]);
    $(".gab-actuel b", lecture).textContent = deux(i + 1);
    $(".gab-actuel small", lecture).textContent = motsLoisirs.compteur(i + 1, n);
    $(".gab-actuel strong", lecture).textContent = etat.titres[i];
    [-1, 1].forEach((sens) => {
      const btn = $("[data-gab-pas='" + sens + "']", lecture);
      if (!btn) return;
      const voisin = i + sens, possible = voisin >= 0 && voisin < n;
      const cible = $(".gab-fleche-cible", btn);
      if (cible) cible.textContent = possible ? deux(voisin + 1) + " · " + etat.titres[voisin] : "";
      btn.disabled = !possible;
      btn.setAttribute("aria-label", (sens < 0 ? motsLoisirs.precedent : motsLoisirs.suivant) +
        (possible ? " : " + deux(voisin + 1) + " · " + etat.titres[voisin] : ""));
    });
    $(".gab-segments button", lecture).forEach((btn, k) => {
      btn.classList.toggle("lu", k < i);
      btn.setAttribute("aria-current", String(k === i));
    });
  }

  function configurerBarreLoisirs(zone) {
    if (!lecture || !zone || zone.dataset.gabSalle !== "loisirs") return false;
    const activites = $(".loisirs-etendus > figure.loisir", zone);
    if (!activites.length) return false;
    const titres = activites.map((fig) => net($("figcaption strong", fig)?.textContent));
    if (!navigationLoisirs || navigationLoisirs.zone !== zone) {
      navigationLoisirs = { zone, activites, titres, index: 0 };
    }
    // Réutiliser exactement le contenant, les flèches, les pastilles et les dimensions du menu existant.
    $(".gab-tous span:last-child", lecture).textContent = motsLoisirs.tous;
    $(".gab-fleche-precedente .gab-fleche-texte", lecture).textContent = motsLoisirs.precedent;
    $(".gab-fleche-suivante .gab-fleche-texte", lecture).textContent = motsLoisirs.suivant;
    const segments = $(".gab-segments", lecture);
    segments.innerHTML = titres.map((titre, i) =>
      '<button type="button" data-loisirs-cible="' + i + '" style="--gab-c:' +
      COULEURS[i % COULEURS.length] + '" aria-label="' + echapper(titre) + '"></button>'
    ).join("");
    if (!lecture.dataset.loisirsEvenements) {
      lecture.dataset.loisirsEvenements = "oui";
      lecture.addEventListener("click", (event) => {
        if ($(".gab", contenu)?.dataset.gabSalle !== "loisirs" || !navigationLoisirs) return;
        const bouton = event.target.closest("[data-loisirs-cible], [data-gab-pas]");
        if (!bouton || !lecture.contains(bouton)) return;
        // Bloquer seulement l'ancien gestionnaire qui ouvrirait une page de chapitre.
        event.preventDefault();
        event.stopPropagation();
        const etat = navigationLoisirs;
        let cible = etat.index;
        if (bouton.dataset.loisirsCible != null) cible = +bouton.dataset.loisirsCible;
        else if (bouton.dataset.gabPas === "tous") {
          etat.index = 0;
          rafraichirBarreLoisirs();
          defiler($(".loisirs-etendus", etat.zone));
          return;
        } else cible += Number(bouton.dataset.gabPas || 0);
        if (cible < 0 || cible >= etat.activites.length) return;
        etat.index = cible;
        rafraichirBarreLoisirs();
        defiler(etat.activites[cible]);
      }, true);
    }
    rafraichirBarreLoisirs();
    return true;
  }

  function restaurerBarreChapitres() {
    if (!lecture || !navigationLoisirs) return;
    $(".gab-tous span:last-child", lecture).textContent = T.tous;
    $(".gab-fleche-precedente .gab-fleche-texte", lecture).textContent = T.precedent;
    $(".gab-fleche-suivante .gab-fleche-texte", lecture).textContent = T.suivant;
    navigationLoisirs = null;
  }

  function activerSalle() {
    if (!contenu) return;
    const zone = $(".section-contenu", contenu);
    if (!zone) return;
    if (!zone.classList.contains("gab")) transformer(zone);
    salle.classList.toggle("gab-continu-active", zone.classList.contains("gab-continu"));
    if (zone.classList.contains("gab-continu")) salle.classList.remove("gab-lit", "gab-page-chapitre");
    mettreAJourChapitreVulgarisation(zone);
    fusionnerDossierImplantation(zone);
    preparerSalle();
    decorerOnglets();
    let barreContinue = $(".gab-lecture-continue", barre);
    if (zone.classList.contains("gab-continu")) {
      if (!barreContinue) {
        barreContinue = el("div", "gab-lecture gab-lecture-continue");
        barre.append(barreContinue);
      }
      const boutons = $$(".onglet-salle", onglets);
      const index = boutons.findIndex((b) => b.dataset.sous === zone.dataset.gabSalle);
      const titreBouton = (b) => net($(".onglet-titre", b)?.textContent);
      const lib = langue === "fr" ? ["Toutes les rubriques", "Rubrique précédente", "Rubrique suivante", "Lecture continue"]
        : langue === "en" ? ["All sections", "Previous section", "Next section", "Continuous reading"]
        : [T.tous.replace(/chapitres|chapters/g, "rubriques"), T.precedent, T.suivant, ""];
      barreContinue.innerHTML = `<button type="button" class="gab-tous" data-continu-menu aria-expanded="false"><span aria-hidden="true">▦</span><span>${echapper(lib[0])}</span></button>` +
        `<button type="button" class="gab-fleche gab-fleche-precedente" data-continu-pas="-1" ${index <= 0 ? "disabled" : ""}><span aria-hidden="true">‹</span><span class="gab-fleche-libelle"><span class="gab-fleche-texte">${echapper(lib[1])}</span><small class="gab-fleche-cible">${echapper(index > 0 ? titreBouton(boutons[index - 1]) : "")}</small></span></button>` +
        `<div class="gab-actuel"><b>${deux(index + 1)}</b><span><small>${echapper(lib[3])}</small><strong>${echapper(titreBouton(boutons[index]))}</strong></span></div>` +
        `<button type="button" class="gab-fleche gab-fleche-suivante" data-continu-pas="1" ${index === boutons.length - 1 ? "disabled" : ""}><span class="gab-fleche-libelle"><span class="gab-fleche-texte">${echapper(lib[2])}</span><small class="gab-fleche-cible">${echapper(index < boutons.length - 1 ? titreBouton(boutons[index + 1]) : "")}</small></span><span aria-hidden="true">›</span></button>` +
        `<div class="gab-segments">${boutons.map((b, i) => `<button type="button" data-continu-rubrique="${echapper(b.dataset.sous)}" style="--gab-c:${COULEURS[i % COULEURS.length]}" aria-label="${echapper(titreBouton(b))}" aria-current="${i === index}"></button>`).join("")}</div>`;
      salle.classList.remove("continu-rubriques-ouvertes");
    }
    const titre = net($("#salle-titre")?.textContent).split(" · ");
    const nom = $(".gab-porte-nom", barre);
    if (nom) nom.innerHTML = titre.length >= 3
      ? `<small>${echapper(T.porte)}</small> ${echapper(titre[1])}${zone.dataset.gabSalle === "recherche" ? ` <span class="gab-sous-categorie">› ${echapper(titre[2])}</span>` : ""}`
      : "";
    if (configurerBarreLoisirs(zone)) {
      // Même barre supérieure qu'avant ; toutes les figures sont visibles simultanément.
      salle.classList.add("gab-avec-chapitres", "gab-lit");
      requestAnimationFrame(suivreDefilement);
      return;
    }
    restaurerBarreChapitres();
    const liste = chapitresDe(zone);
    salle.classList.toggle("gab-avec-chapitres", liste.length >= 2);
    if (lecture) {
      $(".gab-segments", lecture).innerHTML = liste.map((c, k) => `<button type="button" style="--gab-c:${c.style.getPropertyValue("--gab-c")}" data-gab-segment="${k}" aria-label="${echapper(T.aller(net($(".gab-chapitre-titre", c)?.textContent)))}"></button>`).join("");
      $$(".gab-segments button", lecture).forEach((b) => b.addEventListener("click", () => ouvrirPageChapitre(zone, +b.dataset.gabSegment, { adresse: true, haut: true })));
    }
    // La salle présente une page de chapitre à la fois. Sans fragment
    // précis, commencer par le premier chapitre, les autres restant masqués.
    const indexAdresse = chapitreDansAdresse(zone, liste);
    ouvrirPageChapitre(zone, indexAdresse >= 0 ? indexAdresse : 0);
    requestAnimationFrame(suivreDefilement);
  }

  // Inventaire des chapitres (sert à constituer le catalogue d'images).
  window.gabaritSalles = {
    inventaire: () => $$("section.section[data-salle] > .section-contenu.gab").flatMap((sc) => chapitresDe(sc).map((c, i) => ({ salle: sc.dataset.gabSalle, porte: porteDe(sc.dataset.gabSalle)?.dataset.salle || "", ordre: i + 1, titre: net($(".gab-chapitre-titre", c)?.textContent) }))),
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
      ["Doctorat en santé publique, option systèmes, organisations et politiques de santé (SOPS)", "https://espum.umontreal.ca/etudes/programmes/doctorats-et-programmes-de-3e-cycle/doctorats/doctorat-en-sante-publique/"],
      ["Chaire de recherche GSK en gestion optimale des maladies chroniques", "https://www.linkedin.com/company/chaire-glaxosmithkline-gsk-de-recherche-en-gestion-optimale-des-maladies-chroniques/"],
      ["Fonds de recherche du Québec", "https://frq.gouv.qc.ca/"],
      ["bourse de doctorat (B2)", "https://doi.org/10.69777/2009461"],
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
  // contenu intégral appartient désormais au chapitre 03, avec navigation
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
    ensemble.setAttribute("aria-label","Dossier interactif d'implantation intégré au chapitre 03");
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
  // Le dossier est affiché uniquement au chapitre 04 existant dans « Savoirs en action ».
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
    if (titres.length !== 10) throw new Error("Dix sections requises pour la vulgarisation scientifique.");
    const corps = $(".gab-corps", chapitre);
    const aside = $(".gab-chapitre-aside", chapitre);
    const grille = $(".gab-chapitre-grille", chapitre);
    if (!corps || !aside || !grille) throw new Error("Chapitre 04 incomplet.");
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
  $$("section.section[data-salle] > .section-contenu").forEach(transformer);
  // Charge les sept contenus existants uniquement pour la fusion du chapitre 03.
  if(langue==="fr"){
    const script=D.createElement("script");
    script.src=new URL(CHEMIN+"implantation/portail.js?v=20261018-fusion-ch03",D.baseURI).href;
    script.onload=()=>{
      const source=$("section.section[data-salle='implantation'] > .section-contenu.gab");
      if(source)fusionnerDossierImplantation(source);
      const active=contenu&&$(".section-contenu.gab",contenu);
      if(active)fusionnerDossierImplantation(active);
    };
    script.onerror=()=>console.warn("Dossier d'implantation indisponible : chargement du chapitre 03 incomplet.");
    D.head.append(script);
  }
  if (langue === "fr") {
    const url = new URL(CHEMIN + "vulgarisation/dossier-contenu-2026.html", D.baseURI).href;
    fetch(url).then((rep) => {
      if (!rep.ok) throw new Error("Contenu scientifique introuvable : " + rep.status);
      return rep.text();
    }).then((html) => {
      if (!html.includes('id="vul-section-10"')) throw new Error("Dossier incomplet.");
      contenuVulgarisation2026 = html;
      const source = $("section.section[data-salle='implantation'] > .section-contenu.gab");
      mettreAJourChapitreVulgarisation(source);
      const active = contenu && $(".section-contenu.gab", contenu);
      if (active) mettreAJourChapitreVulgarisation(active);
    }).catch((err) => {
      console.warn("Le chapitre 04 conserve son contenu antérieur faute de chargement scientifique.", err);
    });
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
    if (onglets) new MutationObserver(decorerOnglets).observe(onglets, { childList: true });
    if (contenu.children.length) activerSalle();
  }
})();
