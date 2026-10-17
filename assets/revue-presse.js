(() => {
  const boite = document.querySelector("[data-revue-presse]");
  if (!boite) return;

  const DONNEES = "https://raw.githubusercontent.com/ERJB-web/ERJB-web.github.io/revue-presse-donnees/revue-presse.json";
  const SECOURS = (document.documentElement.dataset.racine || "./") + "assets/revue-presse.json";
  const RAFRAICHIR = 10 * 60e3;
  const ORDRE = ["une", "quebec", "debats", "decouvertes", "recherche", "publications"];

  const TEXTES = {
    fr: { titre: "Actualité santé", maj: "Mis à jour {t}", attente: "Chargement de l’actualité…", indispo: "L’actualité est momentanément indisponible.", bonne: "Bonne nouvelle du jour", rubriques: ["À la une", "Québec", "Débats", "Découvertes", "Recherche", "Publications"], medias: n => `${n} médias`, vide: "Rien de nouveau dans cette rubrique pour l’instant.", sources: "Sources", onglets: "Rubriques de l’actualité santé", quebec: "Québec", langue: "" },
    en: { titre: "Health news", maj: "Updated {t}", attente: "Loading the news…", indispo: "The news is temporarily unavailable.", bonne: "Good news of the day", rubriques: ["Top stories", "Québec", "Debates", "Discoveries", "Research", "Publications"], medias: n => `${n} outlets`, vide: "Nothing new in this section yet.", sources: "Sources", onglets: "Health news sections", quebec: "Québec", langue: "Articles in French" },
    es: { titre: "Actualidad sanitaria", maj: "Actualizado {t}", attente: "Cargando las noticias…", indispo: "Las noticias no están disponibles por el momento.", bonne: "Buena noticia del día", rubriques: ["Portada", "Quebec", "Debates", "Descubrimientos", "Investigación", "Publicaciones"], medias: n => `${n} medios`, vide: "Nada nuevo en esta sección por ahora.", sources: "Fuentes", onglets: "Secciones de actualidad sanitaria", quebec: "Quebec", langue: "Artículos en francés" },
    zh: { titre: "健康资讯", maj: "更新于{t}", attente: "正在加载资讯…", indispo: "资讯暂时无法显示。", bonne: "今日好消息", rubriques: ["头条", "魁北克", "辩论", "发现", "研究", "出版物"], medias: n => `${n} 家媒体`, vide: "此栏目暂无新内容。", sources: "来源", onglets: "健康资讯栏目", quebec: "魁北克", langue: "文章为法语" },
    ar: { titre: "أخبار الصحة", maj: "آخر تحديث {t}", attente: "جارٍ تحميل الأخبار…", indispo: "الأخبار غير متاحة مؤقتًا.", bonne: "خبر سارّ اليوم", rubriques: ["أبرز الأخبار", "كيبيك", "نقاشات", "اكتشافات", "أبحاث", "منشورات"], medias: n => `${n} وسائل إعلام`, vide: "لا جديد في هذا القسم حاليًا.", sources: "المصادر", onglets: "أقسام أخبار الصحة", quebec: "كيبيك", langue: "المقالات باللغة الفرنسية" },
    ru: { titre: "Новости здоровья", maj: "Обновлено {t}", attente: "Загрузка новостей…", indispo: "Новости временно недоступны.", bonne: "Хорошая новость дня", rubriques: ["Главное", "Квебек", "Дебаты", "Открытия", "Исследования", "Публикации"], medias: n => `СМИ: ${n}`, vide: "В этом разделе пока нет новостей.", sources: "Источники", onglets: "Разделы новостей здоровья", quebec: "Квебек", langue: "Статьи на французском" },
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

  const lienArticle = a => {
    const pubmed = a.s === "PubMed";
    const lien = el("a", { href: a.u, target: "_blank", rel: "noopener", lang: pubmed ? "en" : "fr", dir: "ltr" });
    const [surtitre, ...reste] = pubmed ? [a.t] : a.t.split(" | ");
    if (reste.length) lien.append(el("span", { class: "revue-surtitre", texte: surtitre }), " ", reste.join(" | "));
    else lien.textContent = a.t;
    return lien;
  };

  const meta = a => {
    const ligne = el("span", { class: "revue-meta" });
    const morceaux = [el("bdi", { class: "revue-source", texte: a.s === "PubMed" ? (a.r || "PubMed") : a.s })];
    morceaux.push(el("time", { datetime: a.d, texte: quand(a.d) }));
    if (a.n > 1) morceaux.push(el("span", { class: "revue-etiquette", texte: T.medias(a.n) }));
    if (a.i) morceaux.push(el("span", { class: "revue-etiquette", texte: "INSPQ" }));
    else if (a.q) morceaux.push(el("span", { class: "revue-etiquette", texte: T.quebec }));
    morceaux.forEach((m, i) => { if (i) ligne.append(el("span", { class: "revue-point", "aria-hidden": "true", texte: "·" })); ligne.append(m); });
    return ligne;
  };

  let donnees = null;
  let rubrique = "une";
  try { const r = localStorage.getItem("eb-revue-rubrique"); if (ORDRE.includes(r)) rubrique = r; } catch {}

  const titre = el("h2", { id: "revue-titre", texte: T.titre });
  const majTexte = el("span", { "data-revue-maj": true, texte: T.attente });
  const tete = el("div", { class: "revue-tete" }, titre, el("p", { class: "revue-maj" }, el("span", { class: "revue-pastille", "aria-hidden": "true" }), majTexte));
  if (T.langue) tete.append(el("p", { class: "revue-langue", texte: T.langue }));

  const bonne = el("div", { class: "revue-bonne", hidden: true });
  const onglets = el("div", { class: "revue-onglets", role: "tablist", "aria-label": T.onglets });
  const boutons = ORDRE.map((cle, i) => el("button", { type: "button", role: "tab", id: "revue-onglet-" + cle, "aria-controls": "revue-panneau", "data-rubrique": cle, texte: T.rubriques[i] }));
  onglets.append(...boutons);
  const liste = el("ol", { class: "revue-liste" });
  const panneau = el("div", { class: "revue-panneau", id: "revue-panneau", role: "tabpanel", tabindex: "0" }, liste);
  const pied = el("p", { class: "revue-pied" });

  boite.replaceChildren(tete, bonne, onglets, panneau, pied);
  boite.setAttribute("aria-labelledby", "revue-titre");
  boite.classList.add("revue-prete");

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
      ? articles.map(a => el("li", {}, lienArticle(a), meta(a)))
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
        meta(b),
      );
    }
    const sources = donnees.sources || [];
    pied.replaceChildren(el("span", { class: "revue-pied-titre", texte: T.sources + " : " }), el("span", { lang: "fr", texte: sources.join(" · ") }));
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
