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
    outils: { sel: "article.projet", titre: ".projet-tete h3, h3" },
    biographie: { sel: "ol.recit > li", titre: "h3" },
    juriste: VITRINE, gestionnaire: VITRINE, educateur: VITRINE, entrepreneuriat: VITRINE,
    valeurs: { sel: "article.valeur", titre: "h4" },
    representation: { unique: true }, communaute: { unique: true }, distinctions: { unique: true }, citoyen: { unique: true },
    loisirs: { sel: "figure.loisir", titre: "h4, figcaption strong" },
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
    const lienDossier = D.createElement("p");
    lienDossier.className = "note";
    lienDossier.innerHTML = '<a href="' + CHEMIN + 'implantation/comprendre.html">' + echapper(l[7]) + ' ↗</a>';
    implantation.append(lienDossier);

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
      if (salle === "implantation") {
        const portail = $(".implantation-portail-accueil", sc);
        if (portail) chapitres.push({ source: portail, titre: texteTitre($(".implantation-portail-tete strong", portail)), titreEl: $(".implantation-portail-tete", portail) });
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

  function construireChapitre(ch, i, n, couleur, choix, salle) {
    const section = ch.surPlace ? ch.source : el("section");
    section.classList.add("gab-chapitre");
    section.style.setProperty("--gab-c", couleur);
    section.dataset.gabIndex = i;
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
    if (choix.url && !(salle === "recherche" && i === 0)) {
      const credit = choix.image ? `${T.photo} : ${echapper(choix.image.auteur || "")}${choix.image.licence ? " · " + echapper(choix.image.licence) : ""}` : "";
      const alt = choix.alt || (langue === "fr" && choix.image?.alt ? choix.image.alt : "");
      aside.innerHTML = `<div class="gab-photo"><img src="${echapper(choix.url)}" alt="${echapper(alt)}" loading="lazy" decoding="async" width="960" height="640">${credit ? `<small class="gab-credit">${choix.image.source_url ? `<a href="${echapper(choix.image.source_url)}" target="_blank" rel="noopener">${credit}</a>` : credit}</small>` : ""}</div>`;
    }
    const intertitres = $$("h4", corps).filter((h) => !h.closest("details:not([open]), [hidden], .gab-source.carte-vitrine"));
    if (intertitres.length >= 2) {
      const nav = el("nav", "gab-sommaire-chapitre");
      nav.setAttribute("aria-label", T.dans);
      nav.setAttribute("tabindex", "0");
      const theseFr = salle === "recherche" && langue === "fr";
      const entrees = theseFr && i === 0 ? intertitres : intertitres.slice(0, 8);
      nav.innerHTML = `<span>${echapper(T.dans)}</span>` + entrees.map((h, k) => {
        const titre = net(h.textContent);
        const prefixe = /^(?:O|Objectif\s*)([123])\b/i.exec(titre);
        const code = h.closest("[data-objectif]")?.dataset.objectif || (prefixe ? "O" + prefixe[1] : "");
        const objectif = /^O[123]$/.test(code) ? code : "";
        let libelle = theseFr ? sommaireTheseFr[titre] || titre : titre;
        if (objectif && !/^(?:O|Objectif\s*)[123]\b/i.test(libelle)) libelle = objectif + " · " + libelle;
        return `<a href="#" data-gab-intertitre="${k}"${objectif ? ` data-objectif="${objectif}"` : ""}${libelle !== titre ? ` title="${echapper(titre)}"` : ""}>${echapper(libelle)}</a>`;
      }).join("");
      aside.append(nav);
    }
    // Thèse : seul le sommaire migre à gauche ; l'illustration reste
    // dans la colonne de lecture, suffisamment large pour les cartes.
    if (salle === "recherche" && aside.querySelector(".gab-sommaire-chapitre")) {
      const photo = aside.querySelector(".gab-photo");
      if (photo) tete.after(photo);
      grille.classList.add("gab-menu-gauche");
    }
    grille.append(texte, aside);
    section.append(grille);
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

  function transformer(sc) {
    if (!sc || sc.classList.contains("gab")) return;
    const salle = salleDe(sc);
    if (!salle) return;
    const porte = porteDe(salle);
    const bandeau = $(":scope > .bandeau", sc);
    const corps = $(":scope > .section-corps", sc);
    if (!corps) return;
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
        if (n >= 2) puces.append(el("span", "", echapper(T.chapitres(n))));
        if (minutes <= 90) puces.append(el("span", "", echapper(T.minutes(minutes))));
        if (puces.children.length) texte.append(puces);
      }
      bandeau.classList.remove("revele");
      $$(".revele", bandeau).forEach((x) => x.classList.remove("revele"));
    }

    // Tuiles des chapitres, juste sous le bandeau.
    if (n >= 2) {
      const programme = el("nav", "gab-programme");
      programme.setAttribute("aria-label", T.programme);
      const colonnes = n <= 4 ? n : n <= 6 ? 3 : n <= 12 ? 4 : 5;
      const vides = Math.ceil(n / colonnes) * colonnes - n;
      programme.style.setProperty("--gab-colonnes", colonnes);
      programme.innerHTML = `<div class="gab-programme-tete"><h2>${echapper(T.programme)}</h2><span>${echapper(T.aide)}</span></div>` +
        `<div class="gab-tuiles">` + chapitres.map((ch, i) => {
          const large = (vides === 1 && i === 0) || (vides === 2 && (i === 0 || i === n - 1)) ? " gab-large" : vides >= 3 && i === 0 ? " gab-grande" : "";
          const vignette = ch.choix.image ? urlVignette(ch.choix.image) : ch.choix.url;
          const photo = vignette ? ` style="--gab-c:${COULEURS[i % COULEURS.length]};--gab-tuile:url('${echapper(vignette)}')"` : ` style="--gab-c:${COULEURS[i % COULEURS.length]}"`;
          return `<a class="gab-tuile${large}" href="#${echapper(salle)}${ch.cle ? "/" + echapper(ch.cle) : ""}" data-gab-aller="${i}"${photo} aria-label="${echapper(T.aller(ch.titre))}"><span class="gab-tuile-num">${deux(i + 1)}</span><span class="gab-tuile-titre">${echapper(ch.titre)}</span></a>`;
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

  D.addEventListener("click", (ev) => {
    const tuile = ev.target.closest("[data-gab-aller]");
    if (tuile) {
      const zone = tuile.closest(".gab");
      const cible = chapitresDe(zone)[+tuile.dataset.gabAller];
      if (!cible) return;
      ev.preventDefault();
      defiler(cible);
      const cle = cible.dataset.rubrique;
      if (cle && salle?.classList.contains("visible")) try { history.replaceState(history.state, "", `#${zone.dataset.gabSalle}/${cle}`); } catch {}
      return;
    }
    const inter = ev.target.closest("[data-gab-intertitre]");
    if (inter) {
      ev.preventDefault();
      const chapitre = inter.closest(".gab-chapitre");
      const h = $$("h4", $(".gab-corps", chapitre)).filter((x) => !x.closest("details:not([open]), [hidden]"))[+inter.dataset.gabIntertitre];
      defiler(h);
      return;
    }
    const these = ev.target.closest(".gab [data-these-vers]");
    if (these) {
      const zone = these.closest(".gab");
      const volet = chapitresDe(zone).find((c) => c.dataset.rubrique === these.dataset.theseVers);
      const article = these.dataset.theseObjectif && volet ? $$("article[data-objectif]", volet).find((a) => a.dataset.objectif === these.dataset.theseObjectif) : null;
      defiler(article || volet);
      return;
    }
    const pas = ev.target.closest("[data-gab-pas]");
    if (pas && contenu) {
      const zone = $(".gab", contenu);
      const liste = chapitresDe(zone);
      if (pas.dataset.gabPas === "tous") defiler($(".gab-programme", zone) || zone);
      else defiler(liste[Math.max(0, Math.min(liste.length - 1, courant + Number(pas.dataset.gabPas)))]);
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
        `<button type="button" class="gab-fleche" data-gab-pas="-1" aria-label="${echapper(T.precedent)}">‹</button>` +
        `<div class="gab-actuel" aria-live="polite"><b></b><span><small></small><strong></strong></span></div>` +
        `<button type="button" class="gab-fleche" data-gab-pas="1" aria-label="${echapper(T.suivant)}">›</button>` +
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
    const programme = $(".gab .gab-programme", contenu);
    const bas = barre.getBoundingClientRect().bottom;
    const lit = !!programme && programme.getBoundingClientRect().bottom < bas + 10;
    salle.classList.toggle("gab-lit", lit);
  }

  function activerSalle() {
    if (!contenu) return;
    const zone = $(".section-contenu", contenu);
    if (!zone) return;
    if (!zone.classList.contains("gab")) transformer(zone);
    preparerSalle();
    decorerOnglets();
    const titre = net($("#salle-titre")?.textContent).split(" · ");
    const nom = $(".gab-porte-nom", barre);
    if (nom) nom.innerHTML = titre.length >= 3 ? `<small>${echapper(T.porte)}</small> ${echapper(titre[1])}` : "";
    const liste = chapitresDe(zone);
    salle.classList.toggle("gab-avec-chapitres", liste.length >= 2);
    if (lecture) {
      $(".gab-segments", lecture).innerHTML = liste.map((c, k) => `<button type="button" style="--gab-c:${c.style.getPropertyValue("--gab-c")}" data-gab-segment="${k}" aria-label="${echapper(T.aller(net($(".gab-chapitre-titre", c)?.textContent)))}"></button>`).join("");
      $$(".gab-segments button", lecture).forEach((b) => b.addEventListener("click", () => defiler(liste[+b.dataset.gabSegment])));
    }
    observateur?.disconnect();
    if (liste.length >= 2 && "IntersectionObserver" in window) {
      observateur = new IntersectionObserver((entrees) => entrees.forEach((e) => { if (e.isIntersecting) marquer(liste.indexOf(e.target)); }), { rootMargin: "-35% 0px -55% 0px" });
      liste.forEach((c) => observateur.observe(c));
    }
    marquer(0);
    salle.classList.remove("gab-lit");
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

  noterTitres();
  if (langue === "fr") lierReferencesCadreThese();
  $$("section.section[data-salle] > .section-contenu").forEach(transformer);
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
