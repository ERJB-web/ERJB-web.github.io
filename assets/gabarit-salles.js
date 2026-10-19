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
    axes: { unique: true },
    publications: { sel: "section.publication-bloc", titre: ".publication-titre, h3" },
    methodes: { sel: "article.methode", titre: "h4" },
    vulgarisation: { sel: "article.vul-dossier-chapitre", titre: "h3" },
    outils: { sel: "article.projet", titre: ".projet-tete h3, h3" },
    biographie: { sel: "ol.recit > li", titre: "h3" },
    juriste: VITRINE, gestionnaire: VITRINE, educateur: VITRINE, entrepreneuriat: { unique: true },
    valeurs: { sel: "article.valeur", titre: "h4" },
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
    const dernierCadre = cadres.length ? cadres[cadres.length - 1] : null;
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

    const implantation = fabriquer("implantation-science", 1, l[2], l[5], "assets/chapitres/ia-07.webp");
    implantation.append(titreCadre, dernierCadre);
    if (langue === "fr") {
      // Seul le chapitre « Implantation » reçoit le dossier, avec ses titres et graphiques.
      // Le cadre originel déplacé depuis « Transfert » n'est pas réintroduit ailleurs.
      const dossier = D.createElement("section");
      dossier.className = "impl-dossier";
      dossier.innerHTML = "\n<style>\n.impl-dossier{--impl-ink:#173347;--impl-soft:#eef5f8;--impl-a:#167a91;--impl-teal:#116e80;--impl-green:#247a64;color:var(--impl-ink);font-size:1rem;line-height:1.72;max-width:100%;min-width:0}\n.impl-dossier *{box-sizing:border-box}.impl-dossier .impl-hero{background:linear-gradient(128deg,#123d51 0%,#145f72 57%,#177978 100%);color:#fff;border-radius:22px;padding:clamp(23px,4.2vw,48px);margin:12px 0 25px;box-shadow:0 16px 34px rgba(12,57,74,.12)}\n.impl-dossier .impl-kicker{font-size:.73rem;letter-spacing:.14em;text-transform:uppercase;font-weight:800;opacity:.83;margin:0 0 9px}\n.impl-dossier .impl-hero h2{color:#fff!important;font-size:clamp(1.65rem,2.7vw,2.75rem)!important;letter-spacing:-.035em;line-height:1.16;margin:0 0 15px;max-width:840px}\n.impl-dossier .impl-hero p{color:#ecf9fa;max-width:800px;line-height:1.72;margin:0}\n.impl-dossier .impl-lead{font-size:1.055rem;line-height:1.76}\n.impl-dossier .impl-cite{white-space:normal;color:#146b83;text-decoration:none;border-bottom:1px solid #add8df;font-size:.91em;font-weight:650}\n.impl-dossier .impl-hero .impl-cite{color:#e4ffff;border-color:#9edbdc}\n.impl-dossier .impl-cite:hover{border-color:currentColor}\n.impl-dossier .impl-triptych,.impl-dossier .impl-grid,.impl-dossier .impl-questions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:20px 0}\n.impl-dossier .impl-tile{padding:21px 19px;border-radius:17px;background:#f1f8fa;border:1px solid #dbeaed;border-top:5px solid var(--tile,#187f91);height:100%;min-width:0}\n.impl-dossier .impl-tile b{display:block;margin-bottom:6px;font-size:.96rem}.impl-dossier .impl-tile p{font-size:.92rem;line-height:1.55;margin:0;color:#3f5665}\n.impl-dossier .impl-index{font-size:.72rem;letter-spacing:.11em;font-weight:800;text-transform:uppercase;color:var(--impl-a)}\n.impl-dossier .impl-module{margin:28px 0 18px;padding:clamp(19px,3vw,32px);background:#fff;border:1px solid #dbe7ec;border-radius:19px;box-shadow:0 7px 27px rgba(25,70,91,.055);min-width:0;overflow:hidden}\n.impl-dossier .impl-module h4{font-size:clamp(1.3rem,2.15vw,1.7rem)!important;line-height:1.27!important;letter-spacing:-.025em;color:#123e52!important;padding:0 0 13px!important;border-bottom:2px solid #d6e9ed!important;margin:5px 0 20px!important}\n.impl-dossier .impl-module h5{font-size:1.08rem!important;line-height:1.35;margin:24px 0 9px!important;color:#146779!important}\n.impl-dossier p{margin:0 0 14px}.impl-dossier .impl-module p:last-child{margin-bottom:0}\n.impl-dossier .impl-note{background:linear-gradient(90deg,#edf7f6,#f7fbfd);padding:18px 21px;border-left:4px solid #329e93;border-radius:0 13px 13px 0;margin:20px 0;font-size:.97rem}\n.impl-dossier .impl-table-scroll{overflow-x:auto;max-width:100%;border-radius:13px;border:1px solid #dae8ee;margin:18px 0}\n.impl-dossier table{width:100%;border-collapse:collapse;min-width:530px;font-size:.9rem;text-align:left}\n.impl-dossier th{background:#e6f1f5;color:#22495f;font-weight:750}\n.impl-dossier td,.impl-dossier th{padding:12px 14px;vertical-align:top;border-bottom:1px solid #dce8ed}\n.impl-dossier tr:nth-child(even) td{background:#f7fafc}.impl-dossier tr:last-child td{border-bottom:0}\n.impl-dossier .impl-figure{border:1px solid #d9e9ee;background:linear-gradient(155deg,#f7fcfd,#eff7fa);padding:clamp(16px,3vw,26px);border-radius:18px;margin:20px 0}\n.impl-dossier .impl-figure h5{margin:0 0 6px!important}.impl-dossier .impl-figure .impl-legend{color:#587383;font-size:.88rem;margin:0 0 22px}\n.impl-dossier .impl-bar-row{display:grid;grid-template-columns:minmax(110px,1.35fr) minmax(85px,1fr) 55px;align-items:center;gap:13px;margin:13px 0}\n.impl-dossier .impl-bar-name{font-size:.83rem;line-height:1.26;font-weight:620}\n.impl-dossier .impl-bar-line{height:18px;border-radius:999px;background:#d8e7ed;overflow:hidden}\n.impl-dossier .impl-bar-line span{display:block;height:100%;border-radius:999px}\n.impl-dossier .impl-bar-row strong{font-variant-numeric:tabular-nums;font-size:.87rem;text-align:right}\n.impl-dossier figcaption{font-size:.81rem;line-height:1.55;color:#587080;margin-top:18px}\n.impl-dossier .impl-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:17px 0}\n.impl-dossier .impl-metric{background:#edf5f8;border:1px solid #d5e6eb;border-radius:15px;padding:20px;min-width:0}\n.impl-dossier .impl-metric strong{font-size:clamp(2rem,4vw,3rem);line-height:1;color:#186d80;font-weight:820;display:block}\n.impl-dossier .impl-metric span{display:block;font-size:.88rem;line-height:1.4;margin-top:8px}\n.impl-dossier .impl-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:20px 0}\n.impl-dossier .impl-step{background:#eaf3f7;border:1px solid #d2e3e9;border-radius:12px;padding:16px 10px;text-align:center;font-size:.88rem;font-weight:680}\n.impl-dossier .impl-step b{display:block;font-size:1.5rem;line-height:1.2;color:#138396;margin-bottom:7px}\n.impl-dossier .impl-step::after{content:\"↓\";display:block;color:#5893a1;font-size:1.1rem;margin-top:7px}\n.impl-dossier .impl-step:last-child::after{content:\"↺\"}\n.impl-dossier .impl-ref-list{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0 0}\n.impl-dossier .impl-ref-list a{padding:9px 13px;background:#eaf4f6;border:1px solid #cce2e6;color:#155d70;border-radius:999px;font-size:.86rem;text-decoration:none}\n.impl-dossier .impl-ref-list a:hover{background:#d7edf1}\n@media(max-width:760px){.impl-dossier .impl-triptych,.impl-dossier .impl-grid,.impl-dossier .impl-questions{grid-template-columns:1fr}.impl-dossier .impl-two{grid-template-columns:1fr}.impl-dossier .impl-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.impl-dossier .impl-bar-row{grid-template-columns:minmax(100px,1.1fr) minmax(70px,1fr) 45px;gap:7px}.impl-dossier .impl-bar-name{font-size:.75rem}.impl-dossier .impl-module{padding:18px}}\n</style>\n<div class=\"impl-hero\">\n<p class=\"impl-kicker\">Savoirs en action · Dossier scientifique · 2026</p>\n<h2>Science de l’implantation et enjeux contemporains de la recherche</h2>\n<p class=\"impl-lead\">Une intervention efficace n’améliore pas nécessairement la santé lorsqu’elle demeure inaccessible, insuffisamment adoptée ou impossible à maintenir. La science de l’implantation étudie comment les connaissances deviennent des pratiques effectives, pour quelles populations et dans quelles conditions. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n</div>\n<div class=\"impl-triptych\" aria-label=\"Trois dimensions complémentaires de la recherche\">\n <div class=\"impl-tile\" style=\"--tile:#267bb0\"><span class=\"impl-index\">01 · Efficacité</span><b>Qu’est-ce qui fonctionne ?</b><p>Évaluer les effets de l’intervention et leurs conditions de validité. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p></div>\n <div class=\"impl-tile\" style=\"--tile:#159a99\"><span class=\"impl-index\">02 · Implantation</span><b>Comment la mettre en œuvre ?</b><p>Étudier l’adoption, les acteurs, les adaptations, les coûts et les contextes. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p></div>\n <div class=\"impl-tile\" style=\"--tile:#7e9c4a\"><span class=\"impl-index\">03 · Impact</span><b>Pour qui, où et combien de temps ?</b><p>Examiner la portée, l’équité, les effets et le maintien. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></p></div>\n</div>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 01</span><h4>Comprendre la science de l’implantation</h4>\n<p>La science de l’implantation est l’étude systématique des méthodes permettant de promouvoir l’intégration des résultats de recherche et des pratiques fondées sur les preuves dans les services, les organisations et les politiques. Elle cherche à expliquer pourquoi des interventions pourtant efficaces ne sont pas automatiquement utilisées dans les conditions ordinaires d’action. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<p>Elle se distingue de la diffusion, qui rend des résultats accessibles, et du transfert de connaissances, qui organise leur circulation, leur échange et leur mobilisation. L’implantation examine plus spécifiquement le processus par lequel une pratique est adoptée, adaptée, effectivement réalisée et éventuellement pérennisée. Ces démarches sont complémentaires plutôt qu’interchangeables. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></p>\n<div class=\"impl-note\"><strong>Exemple : soutien à domicile.</strong> La démonstration qu’un dispositif de coordination réduit certains besoins non satisfaits ne suffit pas à établir qu’il sera utilisé dans tous les territoires. Il faut également étudier les ressources, les professionnels impliqués, les mécanismes d’orientation, les populations effectivement rejointes et la continuité des partenariats. Cette application illustre la distinction entre efficacité et implantation. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></div>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Champ</th><th>Question centrale</th><th>Résultat attendu</th></tr></thead><tbody>\n<tr><td>Recherche d’efficacité</td><td>Quels effets produit une intervention ?</td><td>Estimation des effets et de leur incertitude.</td></tr>\n<tr><td>Transfert de connaissances</td><td>Comment rendre des connaissances disponibles et utilisables ?</td><td>Échange, compréhension et mobilisation.</td></tr>\n<tr><td>Science de l’implantation</td><td>Quelles stratégies rendent une pratique réalisable et durable ?</td><td>Adoption, faisabilité, fidélité, portée et maintien.</td></tr>\n<tr><td>Évaluation d’impact</td><td>Quelles conséquences observe-t-on, pour qui et à quelle échelle ?</td><td>Effets populationnels, équité et effets inattendus.</td></tr>\n</tbody></table></div>\n<p class=\"impl-index\">Distinctions conceptuelles : <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 02</span><h4>Les cadres scientifiques, les stratégies et les méthodes</h4>\n<p>Les cadres théoriques ne sont pas des recettes de mise en œuvre. Certains servent à repérer les déterminants contextuels, d’autres à décrire les phases de changement, à choisir des stratégies ou à évaluer les résultats. Leur sélection doit suivre la question de recherche et le niveau de décision étudié. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Cadre</th><th>Rôle analytique</th><th>Utilisation privilégiée</th></tr></thead><tbody>\n<tr><td><strong>CFIR</strong></td><td>Déterminants de l’implantation.</td><td>Innovation, environnements interne et externe, personnes et processus. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></td></tr>\n<tr><td><strong>RE-AIM</strong></td><td>Évaluation de l’impact en conditions réelles.</td><td>Portée, efficacité, adoption, implantation et maintien. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a></td></tr>\n<tr><td><strong>EPIS</strong></td><td>Trajectoire temporelle.</td><td>Exploration, préparation, implantation et pérennisation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></td></tr>\n<tr><td><strong>ERIC</strong></td><td>Répertoire de stratégies.</td><td>Facilitation, formation, audit, mobilisation et adaptation ; 73 stratégies répertoriées. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a></td></tr>\n<tr><td><strong>Devis hybrides</strong></td><td>Évaluation conjointe des effets et de l’implantation.</td><td>Types 1, 2 et 3 selon la priorité scientifique. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></td></tr>\n</tbody></table></div>\n<h5>Quels devis permettent d’étudier l’implantation ?</h5>\n<p>Selon la question, les chercheurs peuvent recourir à des essais randomisés en grappes, des expériences naturelles, des enquêtes observationnelles, des études de cas comparatives, des analyses qualitatives et des méthodes mixtes. Les devis hybrides rapprochent l’étude des effets de l’intervention de celle des stratégies nécessaires à sa mise en œuvre. <a class=\"impl-cite\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a></p>\n<p>Pour les dispositifs intersectoriels, les approches longitudinales, les analyses de réseaux et la cartographie des ressources peuvent éclairer respectivement l’évolution de la coopération, la structure des relations et les disparités territoriales. Elles décrivent des dimensions différentes et ne démontrent pas, à elles seules, un effet causal. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh et Papoutsi, 2018)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 03</span><h4>Mesurer les résultats de l’implantation</h4>\n<p>Une pratique peut être appréciée par ses utilisateurs sans être réellement adoptée, être déployée sans respecter ses composantes essentielles, ou être initialement adoptée puis abandonnée. La taxonomie de Proctor distingue huit résultats d’implantation de la qualité des services et des résultats cliniques. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<div class=\"impl-grid\">\n<div class=\"impl-tile\" style=\"--tile:#247fb1\"><b>Acceptabilité</b><p>Jugement favorable des acteurs concernant la pratique.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#11988d\"><b>Adoption</b><p>Décision ou commencement effectif de l’utilisation.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#7b9d4a\"><b>Pertinence</b><p>Adéquation perçue au problème, aux acteurs et au contexte.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#608db3\"><b>Faisabilité</b><p>Possibilité de réalisation dans les conditions locales.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#528c74\"><b>Fidélité</b><p>Respect des fonctions ou composantes prévues.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#c18b56\"><b>Coût d’implantation</b><p>Ressources nécessaires pour intégrer la pratique.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#176c93\"><b>Pénétration</b><p>Degré d’intégration dans les services et organisations ciblés.</p></div>\n<div class=\"impl-tile\" style=\"--tile:#20948c\"><b>Durabilité</b><p>Maintien de la pratique après son introduction.</p></div>\n</div>\n<p class=\"impl-index\">Taxonomie des huit résultats : <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<p>L’évaluation doit également analyser séparément les résultats de santé, l’expérience des personnes, l’accessibilité et la distribution des bénéfices. Une adoption élevée ne signifie pas automatiquement que l’intervention atteint les populations qui en ont le plus besoin. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 04</span><h4>Les défis contemporains de la mise en œuvre</h4>\n<h5>Complexité, contexte et interdépendances</h5>\n<p>Les organisations de santé évoluent dans des systèmes dynamiques : une intervention peut modifier les pratiques professionnelles, les flux d’orientation, les ressources et même les besoins auxquels elle répond. Les effets moyens peuvent masquer des trajectoires divergentes selon les groupes, organisations ou territoires. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh et Papoutsi, 2018)</a></p>\n<h5>Adapter les interventions sans perdre leurs mécanismes essentiels</h5>\n<p>La tension entre fidélité et adaptation demande de distinguer les fonctions essentielles des modalités ajustables. Une adaptation culturelle, linguistique ou organisationnelle peut renforcer l’accessibilité, mais une modification non documentée peut aussi altérer le mécanisme censé produire l’effet. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<h5>Évaluer la pérennité plutôt que le seul démarrage</h5>\n<p>L’adoption initiale n’est qu’une étape. Le maintien dépend notamment de la disponibilité des ressources, de l’intégration aux routines, de l’évolution des équipes et de la capacité des organisations à absorber les changements de contexte. Il exige un suivi au-delà de la période de financement ou d’expérimentation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a></p>\n<h5>Désimplanter les pratiques de faible valeur</h5>\n<p>Faire évoluer les systèmes suppose aussi d’abandonner ou de réduire les pratiques qui n’apportent pas suffisamment de bénéfices. Les habitudes établies, les incitations institutionnelles et les coûts politiques du changement peuvent rendre leur retrait différent de l’introduction d’une innovation. <a class=\"impl-cite\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n<h5>Agir entre plusieurs secteurs</h5>\n<p>Les réponses aux besoins sociaux et sanitaires mobilisent souvent les soins, les services sociaux, le logement, le transport et les organismes communautaires. La disponibilité d’un service ne démontre pas que les personnes peuvent réellement y accéder ni que les organisations travaillent ensemble. La portée effective et la coordination doivent être étudiées. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 05 · Données récentes</span><h4>Équité : ce que montrent les recherches de 2026</h4>\n<p>Une revue de portée publiée en 2026 a identifié 42 théories, modèles et cadres explicitement consacrés à l’équité en science de l’implantation. Elle montre qu’ils reconnaissent fréquemment les inégalités, mais proposent moins souvent des mécanismes opérationnels de cogouvernance ou d'action sur les obstacles structurels. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n<figure class=\"impl-figure\">\n<h5>Ce que les cadres d’implantation équitable prennent réellement en compte</h5>\n<p class=\"impl-legend\">Part des 42 cadres intégrant chaque critère d’analyse · Pourcentages publiés</p>\n<div role=\"img\" aria-label=\"Graphique horizontal comparant huit critères observés dans 42 cadres d’implantation équitable, de 90 à 40 pour cent.\"><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Reconnaître explicitement les inégalités</div><div class=\"impl-bar-line\"><span style=\"width:90%;background:#2697a9\"></span></div><strong>90 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Intégrer les savoirs des non-spécialistes</div><div class=\"impl-bar-line\"><span style=\"width:88%;background:#2697a9\"></span></div><strong>88 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Promouvoir l'adaptation culturelle</div><div class=\"impl-bar-line\"><span style=\"width:86%;background:#2697a9\"></span></div><strong>86 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Soutenir l'apprentissage réciproque</div><div class=\"impl-bar-line\"><span style=\"width:64%;background:#6b90be\"></span></div><strong>64 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Considérer les déterminants structurels</div><div class=\"impl-bar-line\"><span style=\"width:60%;background:#6b90be\"></span></div><strong>60 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Prévoir une cogouvernance communautaire</div><div class=\"impl-bar-line\"><span style=\"width:45%;background:#cb8a56\"></span></div><strong>45 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Définir des stratégies de réduction des inégalités</div><div class=\"impl-bar-line\"><span style=\"width:40%;background:#cb8a56\"></span></div><strong>40 %</strong></div><div class=\"impl-bar-row\"><div class=\"impl-bar-name\">Agir sur les obstacles structurels</div><div class=\"impl-bar-line\"><span style=\"width:40%;background:#cb8a56\"></span></div><strong>40 %</strong></div></div>\n<figcaption>Lecture : 90 % des cadres nomment explicitement les inégalités, mais 40 % seulement proposent des processus pour agir sur les obstacles structurels. Il s’agit de caractéristiques des cadres scientifiques, non de leur efficacité démontrée sur le terrain. Source : <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></figcaption>\n</figure>\n<div class=\"impl-two\">\n<div class=\"impl-metric\"><strong>42</strong><span>Cadres étudiés dans la revue de portée. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></span></div>\n<div class=\"impl-metric\"><strong>17 %</strong><span>Sept cadres satisfont l’ensemble des huit critères d’équité examinés. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></span></div>\n</div>\n<p>Ce décalage invite à analyser non seulement la représentation des groupes marginalisés, mais aussi leurs droits réels de participation, l’accès aux informations, les règles d’allocation et la possibilité de réorienter les décisions. Le choix d’un cadre explicitement « équitable » ne suffit pas à garantir un changement structurel. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 06</span><h4>Les enjeux actuels de la recherche scientifique</h4>\n<h5>Reproductibilité, intégrité et incitations</h5>\n<p>Une accumulation de publications ne constitue pas, en elle-même, une garantie de connaissances robustes. La transparence des protocoles, des données, des analyses et des critères de décision est nécessaire pour rendre les résultats vérifiables et permettre leur correction. Les pratiques de science ouverte proposent notamment l’enregistrement préalable et la mise à disposition des matériaux lorsque les obligations éthiques le permettent. <a class=\"impl-cite\" href=\"https://doi.org/10.1126/science.aab2374\" target=\"_blank\" rel=\"noopener noreferrer\">(Nosek et al., 2015)</a></p>\n<h5>Intelligence artificielle : usage et contrôle</h5>\n<p>Les outils d’intelligence artificielle peuvent soutenir la recherche documentaire, la classification ou le suivi des programmes, mais leur déploiement doit être évalué en conditions réelles. Performance technique, biais, sécurité, explicabilité, responsabilité professionnelle et pertinence contextuelle constituent des dimensions distinctes de l’implantation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a></p>\n<h5>Participation et redistribution du pouvoir</h5>\n<p>Une consultation ponctuelle ne garantit pas que les personnes concernées influencent le cadrage des problèmes, le choix des indicateurs ou les décisions. Les travaux récents sur l’équité soulignent l’écart entre la valorisation affichée des savoirs issus de l’expérience et les mécanismes concrets de copropriété ou de codécision. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></p>\n<h5>Confiance et légitimité des institutions</h5>\n<p>La défiance envers les scientifiques ne doit pas être présentée comme universelle : une enquête menée dans 68 pays auprès de 71 922 personnes décrit une confiance globalement modérément élevée, mais révèle aussi des attentes importantes concernant l’ouverture et l’écoute. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></p>\n<div class=\"impl-two\">\n<div class=\"impl-metric\"><strong>75 %</strong><span>Jugent les méthodes scientifiques comme le meilleur moyen d’établir le vrai et le faux. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></span></div>\n<div class=\"impl-metric\"><strong>42 %</strong><span>Estiment que les scientifiques tiennent au moins relativement compte des opinions d’autrui. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></span></div>\n</div>\n<p>L’enjeu dépasse donc la communication : il concerne également la transparence des décisions, la reconnaissance des désaccords et les modalités par lesquelles les institutions rendent compte de leurs choix. Ces relations entre capacité de révision et légitimité constituent des hypothèses à étudier, et non des effets établis par ces pourcentages. <a class=\"impl-cite\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a></p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 07 · Perspective critique</span><h4>Le retour épistémique : quand le terrain peut modifier la connaissance</h4>\n<p>Le manuscrit scientifique transmis propose de compléter le mouvement de la recherche vers l’action par un mouvement inverse : les observations, expériences vécues et conséquences imprévues devraient pouvoir conduire les institutions à réexaminer non seulement la manière d’appliquer une pratique, mais aussi les catégories, indicateurs ou règles qui fondent l’action. Cette perspective prolonge les débats sur l’apprentissage organisationnel et la gouvernance réflexive ; son dispositif d’audit demande encore des validations empiriques supplémentaires. (Argyris et Schön, 1978 ; Jasanoff, 2003)</p>\n<div class=\"impl-note\"><strong>Deux niveaux de rétroaction.</strong> Corriger l’exécution d’un programme n’équivaut pas à réexaminer la définition de sa réussite. Le retour épistémique vise une possibilité traçable de réviser un engagement scientifique ou administratif, ou de le maintenir avec des raisons explicites. (Argyris et Schön, 1978 ; Jasanoff, 2003)</div>\n<div class=\"impl-steps\" aria-label=\"Quatre conditions proposées dans le manuscrit sur le retour épistémique\">\n<div class=\"impl-step\"><b>01</b>Signal d’écart intelligible</div>\n<div class=\"impl-step\"><b>02</b>Droit reconnu de demander l’examen</div>\n<div class=\"impl-step\"><b>03</b>Forum comparant les explications</div>\n<div class=\"impl-step\"><b>04</b>Autorité tenue de motiver sa décision</div>\n</div>\n<p>Ce modèle exige également une condition préalable : l’engagement contesté doit être identifiable, daté et suffisamment documenté pour qu’une révision soit vérifiable. L’objectif n’est pas de rendre toute règle instable, mais de distinguer une stabilité justifiée d’une incapacité institutionnelle à apprendre. (Argyris et Schön, 1978 ; Jasanoff, 2003)</p>\n<p>Cette proposition reste un cadre conceptuel présenté dans le manuscrit fourni, et ne doit pas être confondue avec une théorie déjà validée à grande échelle. Les études futures devraient évaluer la traçabilité des décisions, les droits de contestation, la fiabilité des audits et les effets sur la légitimité institutionnelle. (Jasanoff, 2003 ; Nosek et al., 2015)</p>\n</article>\n<article class=\"impl-module\">\n<span class=\"impl-index\">Chapitre 08 · Agenda scientifique</span><h4>Priorités et nouvelles questions de recherche</h4>\n<p>Un programme de recherche contemporain doit articuler efficacité, stratégies d’implantation, équité, pérennité et gouvernance. Une consultation internationale sur la couverture sanitaire universelle identifie particulièrement les lacunes concernant l’équité de l’accès aux services et la protection financière des populations. <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n<div class=\"impl-table-scroll\"><table><thead><tr><th>Question</th><th>Approche proposée</th></tr></thead><tbody>\n<tr><td>Pourquoi une pratique éprouvée n’est-elle pas utilisée ?</td><td>Analyse des déterminants et évaluation des stratégies. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a></td></tr>\n<tr><td>À qui bénéficie-t-elle, et qui reste exclu ?</td><td>Analyses de portée, d’équité et des besoins non satisfaits. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a></td></tr>\n<tr><td>Qu’est-ce qui permet son maintien ?</td><td>Suivis longitudinaux et analyse des phases d’implantation. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a></td></tr>\n<tr><td>Comment les partenaires intersectoriels coopèrent-ils ?</td><td>Méthodes mixtes, analyse de réseaux et études comparatives. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s12916-018-1089-4\" target=\"_blank\" rel=\"noopener noreferrer\">(Greenhalgh et Papoutsi, 2018)</a></td></tr>\n<tr><td>Comment les institutions corrigent-elles leurs propres critères ?</td><td>Analyse documentaire des décisions et mise à l’épreuve de modèles de gouvernance réflexive. (Jasanoff, 2003)</td></tr>\n<tr><td>Comment implanter les outils d’IA de façon responsable ?</td><td>Évaluation prospective, audits sociotechniques et surveillance des effets inattendus. <a class=\"impl-cite\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a></td></tr>\n</tbody></table></div>\n<p>Les recherches sur le soutien à domicile constituent un terrain particulièrement pertinent : les besoins des personnes, les ressources disponibles dans les territoires et les relations entre organisations doivent être étudiés conjointement, sans assimiler disponibilité théorique, accessibilité effective et utilisation réelle des services. <a class=\"impl-cite\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a> <a class=\"impl-cite\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a></p>\n<h5>Accéder aux travaux scientifiques mobilisés</h5>\n<p>Les références restent volontairement courtes dans le texte et les figures. Les liens ci-dessous ouvrent directement les travaux correspondants.</p>\n<div class=\"impl-ref-list\">\n<a class=\"impl-ref-link\" aria-label=\"CFIR\" href=\"https://doi.org/10.1186/s13012-022-01245-0\" target=\"_blank\" rel=\"noopener noreferrer\">(Damschroder et al., 2022)</a><a class=\"impl-ref-link\" aria-label=\"Résultats d’implantation\" href=\"https://doi.org/10.1007/s10488-010-0319-7\" target=\"_blank\" rel=\"noopener noreferrer\">(Proctor et al., 2011)</a><a class=\"impl-ref-link\" aria-label=\"RE-AIM\" href=\"https://doi.org/10.2105/ajph.89.9.1322\" target=\"_blank\" rel=\"noopener noreferrer\">(Glasgow et al., 1999)</a><a class=\"impl-ref-link\" aria-label=\"EPIS\" href=\"https://doi.org/10.1186/s13012-018-0842-6\" target=\"_blank\" rel=\"noopener noreferrer\">(Moullin et al., 2019)</a><a class=\"impl-ref-link\" aria-label=\"ERIC\" href=\"https://doi.org/10.1186/s13012-015-0209-1\" target=\"_blank\" rel=\"noopener noreferrer\">(Powell et al., 2015)</a><a class=\"impl-ref-link\" aria-label=\"Devis hybrides\" href=\"https://doi.org/10.1097/MLR.0b013e3182408812\" target=\"_blank\" rel=\"noopener noreferrer\">(Curran et al., 2012)</a><a class=\"impl-ref-link\" aria-label=\"Équité 2026\" href=\"https://doi.org/10.1186/s13012-026-01536-w\" target=\"_blank\" rel=\"noopener noreferrer\">(Crump et al., 2026)</a><a class=\"impl-ref-link\" aria-label=\"Agenda international\" href=\"https://doi.org/10.1136/bmjgh-2024-018562\" target=\"_blank\" rel=\"noopener noreferrer\">(Namyalo et al., 2025)</a><a class=\"impl-ref-link\" aria-label=\"Confiance et science\" href=\"https://doi.org/10.1038/s41562-024-02090-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Cologna et al., 2025)</a><a class=\"impl-ref-link\" aria-label=\"IA et implantation\" href=\"https://doi.org/10.1186/s13012-026-01503-5\" target=\"_blank\" rel=\"noopener noreferrer\">(Fontaine et al., 2026)</a>\n</div>\n</article>\n";
      implantation.replaceChildren(dossier);
      const introImpl = implantation.closest(".rubrique-corps")?.querySelector(".colonne-texte p.intro");
      if (introImpl) introImpl.textContent = "Fondements, cadres, méthodes, résultats d’implantation, équité et enjeux scientifiques contemporains (Damschroder et al., 2022 ; Crump et al., 2026).";
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
      echapper(langue === "fr" ? "mandats · un même engagement" : net($(".groupe-large > h3", corps)?.textContent).replace(/\d+$/, "")) + '</small>';
    ouverture.append(texte, chiffre);
    page.append(ouverture);
    const labels = langue === "fr" ? ["Engagements actuels", "Repères précédents"] : null;
    const courts = langue === "fr" ? ["Doctorat · AÉÉSPUM", "Mentorat solidaire", "Comité de programme", "Doctorat · DGEPS", "Ambassadeur · UdeM", "Conseil d’administration · CROUS", "Présidence · Askoria"] : [];
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
      fr: ["Tout le parcours", "En cours", "Précédents", "Étudiants", "Instances", "Une même voix, plusieurs espaces", "Représentation", "Mentorat", "Vie du programme", "Vie du département", "Engagements actuels", "Repères précédents", "Afficher les mandats"],
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
      communaute:"Faire partie de la conversation scientifique",
      distinctions:"Un parcours reconnu et soutenu",
      citoyen:"S’engager au service des autres",
      loisirs:"Des pratiques qui ouvrent d’autres horizons"
    }[salle];
    $$(":scope > .surtitre", intro).forEach(x=>x.remove());
    if (affiliations) affiliations.remove();
    if (titreAffiliations) titreAffiliations.remove();
    texte.append(...Array.from(intro.children));
    const repere = el("div", "representation-repere");repere.setAttribute("aria-hidden","true");
    const labels = {communaute:"comités scientifiques",distinctions:"bourses et distinctions",citoyen:"engagements citoyens",loisirs:"pratiques et horizons"};
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
    const sectionTitre = langue === "fr" ? {communaute:"Contribuer aux rencontres scientifiques",distinctions:"Prix et soutiens académiques",citoyen:"Sur le terrain",loisirs:"Sports, création et curiosité"}[salle] : titre;
    section.append(el("h3","representation-section-titre",echapper(sectionTitre)));
    if (galerie) {
      galerie.classList.add("engagements-galerie");
      items.forEach(item=>{
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
    if (REGLES[salle]?.unique || salle === "biographie" || salle === "parcours") {
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
      ["O1", "Objectif 1 · Revue de portée et profils de besoins"],
      ["O2", "Objectif 2 · Cartographie des ressources"],
      ["O3", "Objectif 3 · Analyse des réseaux (SNA)"]
    ];
    const sections = objectifs.map(([code, nom]) => {
      const source = corps.querySelector("#these-methode-" + code.toLowerCase());
      if (!source) return null;
      const rubriques = $$(":scope > .methode-these-corps > section.methode-rubrique[id]", source)
        .filter((partie) => !!partie.querySelector(":scope > h5.methode-rubrique-titre"));
      if (!rubriques.length) return null;
      const enTete = $(".methode-objectif-tete h4", source);
      return { code, nom: enTete ? titreSommaire(enTete) : nom, source, rubriques };
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
        const enTete = rubrique.querySelector(":scope > h5.methode-rubrique-titre");
        const numero = net(enTete.querySelector("span")?.textContent) || deux(position + 1);
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
      { nom: "Problématique", liens: [ajouterLien(
        corps.querySelector(".these-problematique-bandeau__titre, .these-question-encadre :is(.surtitre,.these-question-label)"),
        "Question de recherche"
      )] },
      { nom: "Objectif général", liens: [lienPour(/^objectif general$/)] },
      { nom: "Point de thèse", liens: [lienPour(/^point de these$/)] },
      { nom: "Objectifs spécifiques", liens: [lienPour(/^objectifs specifiques$/)] }
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
      groupes.push({ nom: titreSommaire(carte?.querySelector("h4")) || "Objectif " + numero,
        objectif: code, titreLien: objectif, liens: liensObjectif });
    });
    const hypotheses = corps.querySelector(".these-hypotheses h4");
    if (hypotheses) groupes.push({ nom: "Hypothèses",
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
      const couleurs = palette[index % palette.length];
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


  // O2 : supprimer une redite et condenser le résultat de double codage.
  // Transformation ciblée du chapitre, avant le calcul du menu latéral.
  function condenserExplicationsO2(corps) {
    if (langue !== "fr") return;
    const o2 = $("#these-methode-o2", corps);
    if (!o2) return;
    const section = o2;
    const titre = (prefixe) => $$("h3,h4,h5,h6,dt,strong,b,span", section)
      .find((n) => net(n.textContent).startsWith(prefixe) && net(n.textContent).length < 110);
    const paragraphe = (prefixe) => $$("p", section)
      .find((n) => net(n.textContent).startsWith(prefixe));

    // Retirer l'enveloppe entière uniquement si elle ne contient rien d'autre.
    function remplacerPaire(entete, texte, remplacement = null) {
      if (!entete || !texte) return;
      const base = net(entete.textContent + " " + texte.textContent);
      let commune = entete.parentElement;
      while (commune && commune !== section && !commune.contains(texte)) commune = commune.parentElement;
      const seule = commune && commune !== section && net(commune.textContent).replace(/\s/g, "") === base.replace(/\s/g, "");
      if (seule) {
        if (remplacement) commune.replaceWith(remplacement);
        else commune.remove();
      } else {
        if (remplacement) entete.before(remplacement);
        const enveloppeTitre = entete.closest("h3,h4,h5,h6,dt,p") || entete;
        enveloppeTitre.remove();
        texte.remove();
      }
    }

    remplacerPaire(
      titre("Comment les fichiers sont rapprochés"),
      paragraphe("Le territoire de CLSC et le domaine de besoin")
    );
    const titreKappa = titre("Ce que mesure le double codage");
    const texteKappa = paragraphe("Lors de l’essai, les catégories de besoins");
    if (!titreKappa || !texteKappa) return;

    if (!D.getElementById("css-o2-kappa-compact")) {
      const style = el("style");
      style.id = "css-o2-kappa-compact";
      style.textContent = [
        ".these .o2-kappa-bandeau{display:grid;grid-template-columns:minmax(140px,.8fr) auto minmax(0,2.2fr);align-items:center;gap:15px;width:100%;margin:15px 0;padding:15px 19px;border:1px solid #cbe4e3;border-left:4px solid #148b85;border-radius:13px;background:linear-gradient(110deg,#f0f9f7,#fff 74%);box-shadow:0 4px 14px rgba(21,80,83,.045);box-sizing:border-box}",
        ".these .o2-kappa-bandeau .o2-kappa-label{font-size:11px;font-weight:800;line-height:1.35;letter-spacing:.07em;text-transform:uppercase;color:#27726e}",
        ".these .o2-kappa-bandeau .o2-kappa-valeur{font-size:clamp(22px,2.5vw,31px);line-height:1.1;font-weight:850;white-space:nowrap;color:#087e79;font-variant-numeric:tabular-nums}",
        ".these .o2-kappa-bandeau .o2-kappa-lecture{font-size:13px;line-height:1.5;color:#29444a;text-align:left;min-width:0}",
        ".these .o2-kappa-bandeau .o2-kappa-lecture strong{font-weight:780;color:#165b59}",
        ".these .o2-kappa-bandeau .o2-kappa-limite{display:block;margin-top:3px;color:#736044;font-size:12px}",
        "@media(max-width:680px){.these .o2-kappa-bandeau{grid-template-columns:1fr auto;gap:7px 12px;padding:13px 15px}.these .o2-kappa-lecture{grid-column:1/-1}}"
      ].join("\n");
      D.head.append(style);
    }
    const bandeau = el("aside", "o2-kappa-bandeau");
    bandeau.setAttribute("aria-label", "Concordance du double codage de l’essai");
    bandeau.innerHTML =
      '<span class="o2-kappa-label">Essai · Double codage des besoins</span>' +
      '<span class="o2-kappa-valeur">κ = 0,94</span>' +
      '<div class="o2-kappa-lecture"><strong>Accord très élevé</strong> entre deux codages, au-delà du hasard.' +
      '<span class="o2-kappa-limite">≠ 94 % de données exactes ; ne valide ni les doublons ni les rapprochements géographiques.</span></div>';
    remplacerPaire(titreKappa, texteKappa, bandeau);
  }

  function fabriquerSommaire(corps, salle, chapitre, index) {
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
    if (these && /methode/.test(chapitre.cle || "")) organiserSommaireObjectifs(nav, titres);
    else if (these && /problematique|objectifs/.test((chapitre.cle || "") + " " + normaliser(chapitre.titre))) organiserSommaireProblematique(nav, titres, corps);
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
    if (!nouveau) { ancien?.remove(); return; }
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
      $$(":scope > .rubrique-entete, :scope > .rubriques-pagination", section).forEach((x) => x.remove());
    }
    const grille = el("div", "gab-chapitre-grille");
    const texte = el("div", "gab-chapitre-texte");
    // Titre de chapitre unique et transversal : numéro et intitulé sur la même ligne.
    const titreAffiche = salle === "recherche" && langue === "fr" && ch.cle === "problematique" ? "Problématisation" :
      salle === "recherche" && langue === "fr" && ch.cle === "methodes" ? "Méthodologie" : ch.titre;
    section.dataset.gabTitre = titreAffiche || "";
    const tete = el("header", "gab-chapitre-tete", `<span class="gab-chapitre-num" role="heading" aria-level="3"><b aria-hidden="true">${deux(i + 1)}</b><span>${echapper(titreAffiche)}</span></span>`);
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
    if (salle === "recherche" && ch.cle === "methodes") condenserExplicationsO2(corps);
    texte.append(tete, corps);
    const aside = el("aside", "gab-chapitre-aside");
    // Dans le contexte de la thèse, le visuel de chiffres clés du premier chapitre
    // figure déjà dans le corps : ne pas le dupliquer au-dessus du sommaire.
    if (choix.url && salle !== "vulgarisation" && !REGLES[salle]?.unique && !(salle === "biographie" || salle === "parcours") && !(salle === "recherche" && i === 0) && !(salle === "recherche" && ch.cle === "transfert")) {
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
    if (estChapitreMethode && !nota) {
      nota = el("p", "these-exemples-attribution");
      nota.innerHTML = "<strong>Nota Bene :</strong> La réflexion scientifique, les choix méthodologiques, la structuration des exemples, la réalisation des cartes dans QGIS, l’analyse, l’interprétation et la rédaction sont assurées par l’auteur. Le traitement et le codage des données sont effectués en R dans l’environnement Positron. L’assistance de Claude est limitée aux graphismes et à la programmation du site Internet ; Claude n’intervient ni dans le codage ou l’analyse des données, ni dans la rédaction scientifique.";
    }
    grille.append(texte, aside);
    section.append(grille);
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
    if (salle === "recherche") mettreDevisEnCartes(sc);
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
    // Les rubriques de CV se lisent directement, sans sommaire de chapitre.
    if (n === 1 && SALLES_ENGAGEMENTS.includes(salle)) sc.classList.add("gab-cv-direct");
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
        if (n >= 2) puces.append(el("span", "", echapper(salle === "recherche" && langue === "fr" ? `${n} chapitres de thèse` : T.chapitres(n))));
        if (minutes <= 90) puces.append(el("span", "", echapper(T.minutes(minutes))));
        if (puces.children.length) texte.append(puces);
      }
      bandeau.classList.remove("revele");
      $$(".revele", bandeau).forEach((x) => x.classList.remove("revele"));
    }

    // Tuiles des chapitres, juste sous le bandeau.
    if (n >= 1) {
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
    if (destination === "logiciels" && repere === "chapitre-3") return 0;
    return liste.findIndex((chapitre) =>
      chapitre.dataset.gabSlug === repere ||
      chapitre.dataset.rubrique === repere ||
      chapitre.id === repere ||
      $$("[data-rubrique], [data-axe-cible], [id]", chapitre).some((element) =>
        element.dataset.rubrique === repere || element.dataset.axeCible === repere || element.id === repere));
  }

  function ouvrirPageChapitre(zone, index, options = {}) {
    if (!zone) return;
    zone.hidden = false;
    $(".gab-programme-porte", zone.parentElement)?.remove();
    const liste = chapitresDe(zone);
    if (!liste.length) return;
    const cible = index >= 0 && index < liste.length ? index : -1;
    const ouverte = cible >= 0;
    zone.classList.toggle("gab-rubrique-complete", navigationParPorte(zone));
    liste.forEach((chapitre, i) => {
      const visible = ouverte && (navigationParPorte(zone) || i === cible);
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
        representation: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
        communaute: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="m10 8-3 6m7-6 3 6M8 17h8"/>',
        distinctions: '<circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8m-4-8v6m-3-3h6"/>',
        citoyen: '<path d="M12 20S3 14 3 8a4 4 0 0 1 9-2 4 4 0 0 1 9 2c0 6-9 12-9 12Z"/>',
        loisirs: '<path d="m9 18 6-12M5 10l-3 2 3 2m14-4 3 2-3 2"/><circle cx="12" cy="12" r="10"/>',
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
    if ($(".gab-programme-porte", contenu)) return;
    const zone = $(".section-contenu", contenu);
    if (!zone) return;
    if (!zone.classList.contains("gab")) transformer(zone);
    mettreAJourChapitreVulgarisation(zone);
    fusionnerDossierImplantation(zone);
    observerSommaires(zone);
    preparerSalle();
    decorerOnglets();
    const titre = net($("#salle-titre")?.textContent).split(" · ");
    const nom = $(".gab-porte-nom", barre);
    if (nom) nom.innerHTML = titre.length >= 3
      ? `<small>${echapper(T.porte)}</small> ${echapper(titre[1])} <span class="gab-sous-categorie">› ${echapper(titre[2])}</span>`
      : "";
    const liste = chapitresDe(zone);
    salle.classList.toggle("gab-avec-chapitres", liste.length >= 1);
    if (lecture) {
      const destinations = navigationParPorte(zone) ? chapitresDeLaPorte(zone) : liste.map((chapitre, index) => ({ zone, chapitre, index, externe: false, titre: nomChapitre(chapitre) }));
      $(".gab-segments", lecture).innerHTML = destinations.map((c, k) => '<button type="button" style="--gab-c:' + c.chapitre.style.getPropertyValue("--gab-c") + '" data-gab-segment="' + k + '" aria-label="' + echapper(T.aller(c.titre)) + '"></button>').join("");
      $$(".gab-segments button", lecture).forEach((b) => b.addEventListener("click", () => ouvrirDestinationChapitre(destinations[+b.dataset.gabSegment])));
    }
    // La salle présente une page de chapitre à la fois. Sans fragment
    // précis, commencer par le premier chapitre, les autres restant masqués.
    const indexAdresse = chapitreDansAdresse(zone, liste);
    ouvrirPageChapitre(zone, indexAdresse >= 0 ? indexAdresse : 0);
    requestAnimationFrame(suivreDefilement);
  }

  // Inventaire des chapitres (sert à constituer le catalogue d'images).
  window.gabaritSalles = {
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
    ensemble.setAttribute("aria-label","Dossier interactif d'implantation intégré au chapitre Implantation");
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

  // precision-protocole-20261018 : insertion ciblée O2/O3 avant construction des chapitres.
  function completerMethodologieO2O3() {
    if (langue !== "fr") return;
    const cibleO2 = D.querySelector("#these-methode-o2 #methode-o2-4 .methode-rubrique-contenu");
    const cibleO3 = D.querySelector("#these-methode-o3 #methode-o3-6 .methode-rubrique-contenu");
    if (!cibleO2 && !cibleO3) return;
    if (!D.getElementById("css-precision-protocole-20261018")) {
      const feuille = D.createElement("style");
      feuille.id = "css-precision-protocole-20261018";
      feuille.textContent = [
        '.these .precision-protocole{--precision:var(--objectif,#167d83);margin:24px 0 7px;padding:clamp(16px,2.5vw,26px);border:1px solid color-mix(in srgb,var(--precision) 27%,#dae5e8);border-top:4px solid var(--precision);border-radius:14px;background:linear-gradient(138deg,color-mix(in srgb,var(--precision) 6%,#fff),#fff 52%);min-width:0}',
        '.these .precision-kicker{margin:0 0 7px;color:var(--precision);font:800 11px/1.5 var(--sans);letter-spacing:.11em;text-transform:uppercase;text-align:left}',
        '.these .precision-titre{margin:0 0 12px;color:#183b4c;font:760 clamp(19px,2.1vw,24px)/1.35 var(--sans);letter-spacing:-.016em;text-align:left}',
        '.these .precision-intro,.these .precision-note{color:#394f5b;text-align:justify;hyphens:auto;font:400 14px/1.75 var(--sans);margin:0 0 15px}',
        '.these .precision-reperes{display:flex;flex-wrap:wrap;gap:8px;margin:13px 0 18px}',
        '.these .precision-reperes>span{padding:6px 11px;border-radius:999px;background:color-mix(in srgb,var(--precision) 10%,white);color:#28515d;font:700 12px/1.4 var(--sans)}',
        '.these .precision-table-scroll{border-radius:10px;border:1px solid #dce6e9;overflow-x:auto;max-width:100%;background:#fff}',
        '.these .precision-table{width:100%;min-width:725px;margin:0!important;border-collapse:collapse;table-layout:fixed;font:400 13px/1.56 var(--sans)}',
        '.these .precision-table :is(th,td){padding:13px!important;border:0!important;border-bottom:1px solid #e2eaed!important;vertical-align:top;text-align:left;overflow-wrap:break-word;hyphens:auto}',
        '.these .precision-table thead th{background:var(--precision)!important;color:white!important;font:750 12px/1.45 var(--sans)}',
        '.these .precision-table th:nth-child(1){width:23%}.these .precision-table th:nth-child(2){width:34%}.these .precision-table th:nth-child(3){width:27%}.these .precision-table th:nth-child(4){width:16%}',
        '.these .precision-table tbody tr:nth-child(even){background:#f5f8f9}.these .precision-table tbody th{font-weight:750;color:#193d4c}',
        '.these .precision-table tbody tr:last-child :is(th,td){border-bottom:0!important}',
        '.these .precision-table a,.these .precision-inventaire{color:var(--precision);font-weight:750;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}',
        '.these .precision-inventaire{display:inline-block;font-size:14px;margin:2px 0 0}',
        '.these .precision-note{font-size:12.5px;line-height:1.7;margin:15px 0 8px}',
        '.these .precision-cartes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:17px 0}',
        '.these .precision-carte{min-width:0;background:#fff;border:1px solid color-mix(in srgb,var(--precision) 21%,#dae4e8);border-radius:14px;padding:20px 18px}',
        '.these .precision-chiffre{display:block!important;font:850 clamp(44px,4.8vw,60px)/1.05 var(--sans)!important;letter-spacing:-.045em!important;margin:0 0 12px!important;font-variant-numeric:lining-nums}',
        '.these .precision-carte:nth-child(1) .precision-chiffre{color:#17704f!important}',
        '.these .precision-carte:nth-child(2) .precision-chiffre{color:#086f7d!important}',
        '.these .precision-carte:nth-child(3) .precision-chiffre{color:#2559a7!important}',
        '.these .precision-carte strong{display:block;color:#526977;font:750 11.5px/1.4 var(--sans);letter-spacing:.07em;text-transform:uppercase;margin:0 0 10px}',
        '.these .precision-carte p{color:#3f5663;font:400 13.2px/1.65 var(--sans);margin:0;text-align:justify;hyphens:auto}',
        '.these .precision-parcours{background:color-mix(in srgb,var(--precision) 8%,white);border-left:3px solid var(--precision);border-radius:0 9px 9px 0;padding:13px 17px;color:#244b5b;font:650 13.3px/1.75 var(--sans);margin:17px 0;text-align:left}',
        '.these .precision-parcours strong{color:var(--precision)}',
        '.these .precision-table a:focus-visible,.these .precision-inventaire:focus-visible{outline:3px solid var(--precision);outline-offset:3px}',
        '#methode-o2-4 .precision-protocole-o2{display:block;width:100%;max-width:100%;min-width:0;margin:0!important;padding:20px 0 0!important;border:0!important;border-top:1px solid #d6e2e6!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;grid-column:1/-1;color:#294657}',
        '#methode-o2-4 .precision-protocole-o2 .precision-titre{margin:0 0 14px!important;padding:0!important;color:#496475!important;font-size:12px!important;font-weight:750!important;line-height:1.5!important;letter-spacing:.055em!important;text-transform:uppercase!important;text-align:left!important}',
        '#methode-o2-4 .precision-protocole-o2 .precision-reperes{margin:0 0 16px!important;gap:8px}',
        '#methode-o2-4 .precision-protocole-o2 .precision-reperes span{background:#f1f8f8;color:#255c64;border-color:#d7e6e8}',
        '#methode-o2-4 .precision-protocole-o2 .precision-table-scroll{max-width:100%;min-width:0}',
        '#methode-o2-4 .precision-protocole-o2 .precision-note{margin:15px 0 9px!important;text-align:justify!important}',
        '/* O3 uniquement : chiffres grands, légendes courtes, sans paragraphes */',
        '.these .precision-protocole-o3{margin:16px 0 8px!important;padding:17px 19px!important}',
        '.these .precision-protocole-o3 .precision-titre{font:680 15px/1.45 var(--sans)!important;margin:0 0 13px!important;letter-spacing:0!important;color:#254d62!important}',
        '.these .precision-protocole-o3 .precision-cartes{gap:13px!important;margin:0 0 13px!important}',
        '.these .precision-protocole-o3 .precision-carte{display:flex;flex-direction:column;align-items:flex-start;min-width:0;padding:16px 17px 18px!important;border-radius:12px}',
        '.these .precision-protocole-o3 .precision-chiffre{font:800 clamp(43px,4.3vw,62px)/1.09 var(--sans)!important;margin:0 0 9px!important;letter-spacing:-.035em!important;white-space:nowrap}',
        '.these .precision-protocole-o3 .precision-carte:first-child .precision-chiffre{color:#c53939!important;font-size:clamp(50px,5.3vw,73px)!important}',
        '.these .precision-protocole-o3 .precision-carte:nth-child(3) .precision-chiffre{font-size:clamp(32px,3.4vw,51px)!important}',
        '.these .precision-protocole-o3 .precision-carte strong{font:710 11px/1.4 var(--sans)!important;margin:0 0 4px!important;letter-spacing:.035em!important;color:#536c79!important}',
        '.these .precision-protocole-o3 .precision-carte p{font:440 12.5px/1.45 var(--sans)!important;margin:0!important;text-align:left!important;hyphens:none!important;color:#566b76!important}',
        '.these .precision-protocole-o3 .precision-parcours{margin:0 0 9px!important;padding:10px 13px!important;font:560 12.5px/1.55 var(--sans)!important;text-align:justify!important}',
        '.these .precision-protocole-o3 .precision-note{margin:0!important;font:450 12px/1.6 var(--sans)!important;text-align:justify!important}',
        '@media(max-width:800px){.these .precision-protocole-o3 .precision-cartes{grid-template-columns:repeat(3,minmax(0,1fr))}}',
        '@media(max-width:650px){.these .precision-protocole-o3 .precision-cartes{grid-template-columns:1fr}.these .precision-protocole-o3 .precision-carte{padding:13px 16px!important}.these .precision-protocole-o3 .precision-chiffre{font-size:50px!important}.these .precision-protocole-o3 .precision-carte:first-child .precision-chiffre{font-size:57px!important}.these .precision-protocole-o3 .precision-carte:nth-child(3) .precision-chiffre{font-size:43px!important}}',
        '@media(max-width:800px){.these .precision-cartes{grid-template-columns:1fr}.these .precision-carte{padding:15px}}',
        'html.hc .these .precision-protocole,html.lv .these .precision-protocole{background:#fff;border-width:2px}'
      ].join("\n");
      D.head.append(feuille);
    }
    if (cibleO2 && !cibleO2.querySelector(".precision-protocole-o2")) {
      const sources = [
        ["Statistique Canada","Profil du Recensement 2021 ; population, âge, logement et aires de diffusion","Quinquennale · millésime 2021","https://www150.statcan.gc.ca/n1/fr/catalogue/98-401-X2021006"],
        ["MSSS · ISQ","Estimations et projections de population par territoire sociosanitaire","Révisions selon publication institutionnelle · fichier d’août 2025","https://www.quebec.ca/sante/systeme-et-services-de-sante/organisation-des-services/donnees-systeme-sante-quebecois-services/donnees-population-territoire-sociosanitaire"],
        ["MSSS","Découpage et correspondances territoriales des CLSC, RLS et RSS","Révisions administratives · millésime 2026","https://publications.msss.gouv.qc.ca/msss/fichiers/statistiques/decoupage-territorial/ListeMunParCLSC_avril_26.pdf"],
        ["211 Grand Montréal","Répertoire des ressources et services sociocommunautaires","Vérification des fiches annuelle · extraction 2026","https://www.211qc.ca/"],
        ["211 Grand Montréal","Tableaux des demandes, références et besoins non comblés","Périodes et exercices sélectionnables · fréquence de rafraîchissement non indiquée","https://www.211qc.ca/rapport-statistique"],
        ["MSSS · Données Québec","Installations, services de première ligne et répertoires sectoriels","Variable selon le fichier et le registre","https://www.donneesquebec.ca/recherche/dataset/fichiers-cartographiques-m02-des-installations-et-etablissements"],
        ["Ville de Montréal","Limites administratives, lieux publics, équipements et logement","Variable selon le jeu de données","https://donnees.montreal.ca/"],
        ["OpenStreetMap","Réseau piéton, itinéraires et points d’intérêt","Mise à jour continue · extraction datée","https://www.openstreetmap.org/"],
        ["STM","Arrêts, lignes et horaires planifiés au format GTFS","Trimestrielle · fichier d’octobre 2026","https://www.donneesquebec.ca/recherche/dataset/vmtl-stm-horaires-planifies-et-trajets-des-bus-et-du-metro"],
        ["INSPQ","Indice de défavorisation matérielle et sociale","Quinquennale · version du recensement 2021","https://www.donneesquebec.ca/recherche/dataset/indice-de-defavorisation-du-quebec-2021"]
      ];
      const bloc = D.createElement("section");
      bloc.className = "precision-protocole precision-protocole-o2";
      bloc.setAttribute("aria-label","Sources de données : provenance, actualisation et accès");
      bloc.innerHTML =
        '<p class="precision-titre">Sources mobilisées · publication et accès</p>' +
        '<div class="precision-reperes"><span>55 fichiers documentés</span><span>10 familles de sources</span><span>Millésimes distincts</span></div>' +
        '<div class="precision-table-scroll" role="region" tabindex="0" aria-label="Tableau défilant des banques de données O2"><table class="precision-table"><thead><tr><th scope="col">Producteur</th><th scope="col">Données utilisées</th><th scope="col">Publication / actualisation</th><th scope="col">Accès</th></tr></thead><tbody>' +
        sources.map(function(s){return '<tr><th scope="row">'+s[0]+'</th><td>'+s[1]+'</td><td>'+s[2]+'</td><td><a href="'+s[3]+'" target="_blank" rel="noopener noreferrer" aria-label="Accéder à la source '+s[0]+'">Source ↗</a></td></tr>';}).join("") +
        '</tbody></table></div>' +
        '<p class="precision-note">Une fréquence de publication ne correspond pas à la date d’extraction dans le projet. Lorsque les fichiers sont actualisés de façon variable, la date propre à chaque jeu est vérifiée et conservée. Les agrégats du 211 ne sont pas assimilés à des parcours individuels du SAD.</p>' +
        '<a class="precision-inventaire" href="docs/sources-mapping-o2.csv" target="_blank" rel="noopener noreferrer">Inventaire détaillé et provenance des 55 fichiers ↗</a>';
      (cibleO2.querySelector(".o2-sources-modernes") || cibleO2).append(bloc);
    }
    if (cibleO3 && !cibleO3.parentElement.querySelector(".precision-protocole")) {
      const bloc = D.createElement("section");
      bloc.className = "precision-protocole precision-protocole-o3";
      bloc.setAttribute("aria-label","O3 : repères du questionnaire de réseau");
      bloc.innerHTML =
        '<p class="precision-titre">Questionnaire de réseau · O3</p>' +
        '<div class="precision-cartes">' +
        '<div class="precision-carte"><span class="precision-chiffre">&gt; 80 %</span><strong>Réponse visée</strong><p>Cible méthodologique</p></div>' +
        '<div class="precision-carte"><span class="precision-chiffre">12 mois</span><strong>Période étudiée</strong><p>Interactions déclarées</p></div>' +
        '<div class="precision-carte"><span class="precision-chiffre">O1 → O3</span><strong>Profils et liens</strong><p>Vignettes : cadre commun</p></div></div>' +
        '<p class="precision-parcours"><strong>O1</strong> Vignettes → <strong>O3</strong> Questionnaires SAD–partenaires → réseaux par profil et CLSC → comparaison à <strong>O2</strong> et entretiens.</p>' +
        '<p class="precision-note"><strong>Par lien :</strong> acteur · secteur · nature · fréquence · collaboration (1–4). Non-réponse ≠ absence de lien.</p>';
      cibleO3.insertAdjacentElement("afterend",bloc);
    }
  }
  completerMethodologieO2O3();

  $$("section.section[data-salle] > .section-contenu").forEach(transformer);
  observerSommaires(D);

  // Charge les sept contenus existants uniquement pour la fusion du chapitre Implantation.
  if(langue==="fr"){
    const script=D.createElement("script");
    script.src=new URL(CHEMIN+"implantation/portail.js?v=20261018-fusion-ch03",D.baseURI).href;
    script.onload=()=>{
      const source=$("section.section[data-salle='implantation'] > .section-contenu.gab");
      if(source)fusionnerDossierImplantation(source);
      const active=contenu&&$(".section-contenu.gab",contenu);
      if(active)fusionnerDossierImplantation(active);
    };
    script.onerror=()=>console.warn("Dossier d'implantation indisponible : chargement du chapitre Implantation incomplet.");
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
      console.warn("Le chapitre Vulgarisation conserve son contenu antérieur faute de chargement scientifique.", err);
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
