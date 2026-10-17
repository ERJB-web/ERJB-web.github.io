"use strict";
// Enrichissement éditorial de la salle IA.
module.exports = (ia) => {
  Object.assign(ia.references, require("./ia-references-ajouts.json"));
  const titresBiblio = {
    fr: "Bibliographie : IA, programmation, recherche, santé et société",
    en: "Bibliography: AI, programming, research, health and society",
    es: "Bibliografía: IA, programación, investigación, salud y sociedad",
    zh: "参考文献：人工智能、编程、研究、健康与社会",
    ar: "المراجع: الذكاء الاصطناعي والبرمجة والبحث والصحة والمجتمع",
    ru: "Библиография: ИИ, программирование, исследования, здоровье и общество",
  };
  for (const code of ["fr", "en", "es", "zh", "ar", "ru"]) {
    const a = require("./ia-approfondie/" + code + ".json");
    const s = ia.langues[code];
    s.titre = a.titre;
    s.intro = a.intro;
    s.date = a.date;
    s.lectures.titre = titresBiblio[code];
    const originales = s.rubriques;
    const recherche = { ...originales[1], intro: a.rechercheIntro, items: [...a.rechercheAjouts, ...originales[1].items] };
    const sante = { ...originales[3], intro: a.santeIntro, items: [...a.santeAjouts, ...originales[3].items] };
    s.rubriques = [a.programmation, originales[0], recherche, originales[2], sante, originales[4], a.societe, a.debats];
  }
};
