(() => {
  const boite = document.querySelector("[data-revue-presse]");
  if (!boite) return;

  const DONNEES = "https://raw.githubusercontent.com/ERJB-web/ERJB-web.github.io/revue-presse-donnees/revue-presse.json";
  const SECOURS = (document.documentElement.dataset.racine || "./") + "assets/revue-presse.json";
  const RAFRAICHIR = 10 * 60e3;
  const ORDRE = ["une", "quebec", "canada", "france", "debats", "decouvertes", "recherche", "publications"];

  const TEXTES = {
    fr: { marque: "Éric Bernier · Revue de presse", accroche: "Québec · Canada · France · Monde", titre: ["Actualité en recherche, santé,", "services sociaux et communautaires"], maj: "Mise à jour {t}", attente: "Chargement de l’actualité…", indispo: "L’actualité est momentanément indisponible.", bonne: "Nouvelle encourageante du jour", rubriques: ["À la une", "Québec", "Canada", "France", "Débats", "Découvertes", "Recherche", "Publications"], medias: n => `${n} médias`, vide: "Rien de nouveau dans cette rubrique pour l’instant.", sources: "Sources", onglets: "Rubriques de l’actualité", quebec: "Québec", langue: "", types: { revue: "Revue systématique", meta: "Méta-analyse", essai: "Essai randomisé" } },
    en: { marque: "Éric Bernier · Press review", accroche: "Québec · Canada · France · World", titre: ["News in research, health,", "social and community services"], maj: "Updated {t}", attente: "Loading the news…", indispo: "The news is temporarily unavailable.", bonne: "Encouraging news of the day", rubriques: ["Top stories", "Québec", "Canada", "France", "Debates", "Discoveries", "Research", "Publications"], medias: n => `${n} outlets`, vide: "Nothing new in this section yet.", sources: "Sources", onglets: "News sections", quebec: "Québec", langue: "Articles in their original language", types: { revue: "Systematic review", meta: "Meta-analysis", essai: "Randomized trial" } },
    es: { marque: "Éric Bernier · Revista de prensa", accroche: "Quebec · Canadá · Francia · Mundo", titre: ["Actualidad en investigación, salud,", "servicios sociales y comunitarios"], maj: "Actualizado {t}", attente: "Cargando las noticias…", indispo: "Las noticias no están disponibles por el momento.", bonne: "Noticia alentadora del día", rubriques: ["Portada", "Quebec", "Canadá", "Francia", "Debates", "Descubrimientos", "Investigación", "Publicaciones"], medias: n => `${n} medios`, vide: "Nada nuevo en esta sección por ahora.", sources: "Fuentes", onglets: "Secciones de actualidad", quebec: "Quebec", langue: "Artículos en su idioma original", types: { revue: "Revisión sistemática", meta: "Metaanálisis", essai: "Ensayo aleatorizado" } },
    zh: { marque: "Éric Bernier · 新闻综述", accroche: "魁北克 · 加拿大 · 法国 · 全球", titre: ["研究、健康、", "社会与社区服务资讯"], maj: "更新于{t}", attente: "正在加载资讯…", indispo: "资讯暂时无法显示。", bonne: "今日鼓舞人心的消息", rubriques: ["头条", "魁北克", "加拿大", "法国", "辩论", "发现", "研究", "出版物"], medias: n => `${n} 家媒体`, vide: "此栏目暂无新内容。", sources: "来源", onglets: "资讯栏目", quebec: "魁北克", langue: "文章保留原文语言", types: { revue: "系统综述", meta: "荟萃分析", essai: "随机对照试验" } },
    ar: { marque: "إريك برنييه · مراجعة صحفية", accroche: "كيبيك · كندا · فرنسا · العالم", titre: ["أخبار البحث والصحة", "والخدمات الاجتماعية والمجتمعية"], maj: "آخر تحديث {t}", attente: "جارٍ تحميل الأخبار…", indispo: "الأخبار غير متاحة مؤقتًا.", bonne: "خبر مشجّع اليوم", rubriques: ["أبرز الأخبار", "كيبيك", "كندا", "فرنسا", "نقاشات", "اكتشافات", "أبحاث", "منشورات"], medias: n => `${n} وسائل إعلام`, vide: "لا جديد في هذا القسم حاليًا.", sources: "المصادر", onglets: "أقسام الأخبار", quebec: "كيبيك", langue: "المقالات بلغتها الأصلية", types: { revue: "مراجعة منهجية", meta: "تحليل تلوي", essai: "تجربة معشاة" } },
    ru: { marque: "Éric Bernier · Обзор прессы", accroche: "Квебек · Канада · Франция · Мир", titre: ["Новости исследований, здравоохранения,", "социальных и общественных служб"], maj: "Обновлено {t}", attente: "Загрузка новостей…", indispo: "Новости временно недоступны.", bonne: "Обнадёживающая новость дня", rubriques: ["Главное", "Квебек", "Канада", "Франция", "Дебаты", "Открытия", "Исследования", "Публикации"], medias: n => `СМИ: ${n}`, vide: "В этом разделе пока нет новостей.", sources: "Источники", onglets: "Разделы новостей", quebec: "Квебек", langue: "Статьи на языке оригинала", types: { revue: "Систематический обзор", meta: "Метаанализ", essai: "Рандомизированное исследование" } },
  };
  const code = (document.documentElement.lang || "fr").slice(0, 2);
  const langue = TEXTES[code] ? code : "fr";
  const T = TEXTES[langue];
  const relatif = new Intl.RelativeTimeFormat(langue, { numeric: "auto", style: "short" });
  const jourMois = new Intl.DateTimeFormat(langue, { day: "numeric", month: "short" });

  const quand = iso => {
    const ecart = (Date.now() - new Date(iso).getTime()) / 60e3;
    if (ecart < 1) return relatif.format(0, "minute");
    if (ecart < 60) return relatif.format(-Math.round(ecart), "minute");
    if (ecart < 24 * 60) return relatif.format(-Math.round(ecart / 60), "hour");
    if (ecart < 6 * 24 * 60) return relatif.format(-Math.round(ecart / 1440), "day");
    return jourMois.format(new Date(iso));
  };

  const el = (nom, attributs = {}, ...enfants) => {
    const n = document.createElement(nom);
    for (const [k, v] of Object.entries(attributs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "texte") n.textContent = v;
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const e of enfants) if (e) n.append(e);
    return n;
  };

  const langueArticle = a => (a.s === "PubMed" || a.l === "en" ? "en" : "fr");

  const lienArticle = a => {
    const lien = el("a", { href: a.u, target: "_blank", rel: "noopener", lang: langueArticle(a), dir: "ltr" });
    const [surtitre, ...reste] = a.s === "PubMed" ? [a.t] : a.t.split(" | ");
    if (reste.length) lien.append(el("span", { class: "revue-surtitre", texte: surtitre }), " ", reste.join(" | "));
    else lien.textContent = a.t;
    return lien;
  };

  const resume = a => (a.x ? el("p", { class: "revue-resume", lang: langueArticle(a), dir: "ltr", texte: a.x }) : null);

  const meta = a => {
    const ligne = el("p", { class: "revue-meta" });
    const morceaux = [el("bdi", { class: "revue-source", texte: a.s === "PubMed" ? (a.r || "PubMed") : a.s })];
    morceaux.push(el("time", { datetime: a.d, texte: quand(a.d) }));
    if (a.n > 1) morceaux.push(el("span", { class: "revue-etiquette", texte: T.medias(a.n) }));
    if (a.y && T.types[a.y]) morceaux.push(el("span", { class: "revue-etiquette revue-type", texte: T.types[a.y] }));
    if (a.e) morceaux.push(el("span", { class: "revue-etiquette", texte: a.e === "Québec" ? T.quebec : a.e }));
    morceaux.forEach((m, i) => { if (i) ligne.append(el("span", { class: "revue-point", "aria-hidden": "true", texte: "·" })); ligne.append(m); });
    return ligne;
  };

  let donnees = null;
  let rubrique = "une";
  try { const r = localStorage.getItem("eb-revue-rubrique"); if (ORDRE.includes(r)) rubrique = r; } catch {}

  const majTexte = el("span", { "data-revue-maj": true, texte: T.attente });
  const haut = el("div", { class: "revue-haut" },
    el("span", { class: "revue-marque", texte: T.marque }),
    el("span", { class: "revue-badge" }, el("span", { class: "revue-pastille", "aria-hidden": "true" }), majTexte));
  const titre = el("h2", { id: "revue-titre" }, T.titre[0] + " ", el("em", { texte: T.titre[1] }));
  const tete = el("div", { class: "revue-tete" }, el("span", { class: "revue-accroche", texte: T.accroche }), titre);
  if (T.langue) tete.append(el("p", { class: "revue-langue", texte: T.langue }));

  const bonne = el("div", { class: "revue-bonne", hidden: true });
  const onglets = el("div", { class: "revue-onglets", role: "tablist", "aria-label": T.onglets });
  const boutons = ORDRE.map((cle, i) => el("button", { type: "button", role: "tab", id: "revue-onglet-" + cle, "aria-controls": "revue-panneau", "data-rubrique": cle, texte: T.rubriques[i] }));
  onglets.append(...boutons);
  const liste = el("ol", { class: "revue-liste" });
  const panneau = el("div", { class: "revue-panneau", id: "revue-panneau", role: "tabpanel", tabindex: "0" }, liste);
  const pied = el("p", { class: "revue-pied" });

  boite.replaceChildren(haut, tete, bonne, onglets, panneau, pied);
  boite.removeAttribute("aria-label");
  boite.setAttribute("aria-labelledby", "revue-titre");

  function choisir(cle, focus) {
    rubrique = cle;
    try { localStorage.setItem("eb-revue-rubrique", cle); } catch {}
    for (const b of boutons) {
      const actif = b.dataset.rubrique === cle;
      b.setAttribute("aria-selected", String(actif));
      b.tabIndex = actif ? 0 : -1;
      if (actif && focus) b.focus();
    }
    panneau.setAttribute("aria-labelledby", "revue-onglet-" + cle);
    panneau.dataset.rubrique = cle;
    remplirListe();
    panneau.scrollTop = 0;
  }

  function remplirListe() {
    const articles = donnees?.rubriques?.[rubrique] || [];
    liste.replaceChildren(...(articles.length
      ? articles.map(a => el("li", {}, lienArticle(a), resume(a), meta(a)))
      : [el("li", { class: "revue-vide", texte: donnees ? T.vide : T.attente })]));
  }

  function afficher() {
    majTexte.textContent = T.maj.replace("{t}", quand(donnees.maj));
    const b = donnees.bonne;
    bonne.hidden = !b;
    if (b) {
      bonne.replaceChildren(
        el("p", { class: "revue-bonne-etiquette" }, el("span", { class: "revue-soleil", "aria-hidden": "true" }), T.bonne),
        el("p", { class: "revue-bonne-titre" }, lienArticle(b)),
        resume(b),
        meta(b),
      );
    }
    const sources = donnees.sources || [];
    pied.replaceChildren(el("details", {},
      el("summary", { texte: `${T.sources} (${sources.length})` }),
      el("span", { lang: "fr", texte: sources.join(" · ") })));
    remplirListe();
  }

  onglets.addEventListener("click", e => {
    const b = e.target.closest("[data-rubrique]");
    if (b) choisir(b.dataset.rubrique);
  });
  onglets.addEventListener("keydown", e => {
    const i = ORDRE.indexOf(rubrique);
    const sens = getComputedStyle(boite).direction === "rtl" ? -1 : 1;
    const cible = { ArrowRight: i + sens, ArrowLeft: i - sens, Home: 0, End: ORDRE.length - 1 }[e.key];
    if (cible === undefined) return;
    e.preventDefault();
    choisir(ORDRE[(cible + ORDRE.length) % ORDRE.length], true);
  });

  let dernierChargement = 0;
  async function charger() {
    dernierChargement = Date.now();
    const tranche = Math.floor(Date.now() / 300e3);
    for (const url of [DONNEES + "?v=" + tranche, SECOURS + "?v=" + tranche]) {
      try {
        const r = await fetch(url, { cache: "no-cache" });
        if (!r.ok) continue;
        const j = await r.json();
        if (!j?.rubriques) continue;
        donnees = j;
        afficher();
        return;
      } catch {}
    }
    if (!donnees) {
      majTexte.textContent = T.indispo;
      liste.replaceChildren(el("li", { class: "revue-vide", texte: T.indispo }));
    }
  }

  choisir(rubrique);
  charger();
  setInterval(() => { if (document.visibilityState === "visible") charger(); else if (donnees) afficher(); }, RAFRAICHIR);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && Date.now() - dernierChargement > RAFRAICHIR) charger();
  });
})();
