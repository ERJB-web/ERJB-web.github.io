/* Galerie O2 : une seule planche visible, sans piste défilante et sans déplacement de page. */
(() => {
  "use strict";
  const trouver = (gallery) => Array.from(gallery.querySelectorAll(".galerie-o2-planche"));
  const bornes = (i, total) => Math.max(0, Math.min(total - 1, i));

  function afficher(gallery, n) {
    const figures = trouver(gallery);
    if (!figures.length) return;
    n = bornes(n, figures.length);
    figures.forEach((figure, i) => {
      const visible = i === n;
      figure.hidden = !visible;
      figure.setAttribute("aria-hidden", String(!visible));
      if (visible) {
        const image = figure.querySelector("img");
        if (image) image.loading = "eager";
      }
    });
    gallery.dataset.planche = String(n + 1);
    const select = gallery.querySelector("[data-galerie-choix]");
    if (select) select.value = String(n + 1);
    const counter = gallery.querySelector("[data-galerie-compteur]");
    if (counter) counter.textContent = (n + 1) + " / " + figures.length;
    const prev = gallery.querySelector("[data-galerie-precedente]");
    const next = gallery.querySelector("[data-galerie-suivante]");
    if (prev) prev.disabled = n === 0;
    if (next) next.disabled = n === figures.length - 1;
    const hd = gallery.querySelector("[data-galerie-agrandir]");
    const origin = figures[n].querySelector(".galerie-o2-photo");
    if (hd && origin) {
      hd.href = origin.href;
      const title = figures[n].querySelector("h5");
      hd.setAttribute("aria-label", "Voir en haute définition : " + (title?.textContent || "la carte"));
    }
  }

  // Présentation synthétique de l'étude spatiale exploratoire indépendante.
  // Ajoutée autour de la visionneuse : les 48 figures, leurs liens HD et leurs contrôles restent intacts.
  function preparerPresentation(gallery) {
    const section = gallery.closest("#methode-o2-exemples");
    if (!section || section.dataset.o2Presentation === "oui") return;
    const header = section.querySelector(".methode-exemples-tete");
    const title = header?.querySelector("h4");
    if (!title) return;
    section.dataset.o2Presentation = "oui";
    const fr = !document.documentElement.lang.toLowerCase().startsWith("en");
    const mots = fr ? {
      chiffres: [["55", "Fichiers intégrés"], ["7 216", "Lieux recensés"], ["35", "Types de services"], ["6", "Secteurs"], ["8", "Territoires de CLSC"], ["48", "Cartes et graphiques"]],
      source:["Recensement 2021", "Sources publiques · 17 octobre 2026"],
      intro:"Cet exercice indépendant utilise le recensement de 2021 et des sources publiques réunies le 17 octobre 2026. Il teste une chaîne de cartographie territoriale, depuis l'inventaire et le géocodage jusqu'aux croisements spatiaux et à leur représentation.",
      suite:"Les planches permettent de comparer des ressources et des scénarios de proximité à pied ou en transport collectif. Pour O2, les méthodes devront être adaptées aux profils issus d'O1 et les données contrôlées. Cet exercice ne prouve ni besoins individuels satisfaits ni collaborations intersectorielles effectives (O3) ; ses résultats ne sont pas ceux de la thèse.",
      tag:"CARTE REPÈRE · PLANCHE 03 / 48",
      carte:"Quand l'offre de santé et les ressources sociales sont-elles accessibles ensemble ?",
      carteTexte:"Cette carte explore la co-accessibilité potentielle à 1 km à pied, par îlot. Elle montre un croisement spatial possible, et non une coordination déjà observée.",
      surtitre:"DE L'EXPLORATION AU PROTOCOLE",
      tabTitre:"Ce que l'exercice a permis de tester — et ce qu'il reste à resserrer",
      tabIntro:"Les acquis techniques constituent des points de départ à vérifier, pas des résultats définitifs du projet doctoral.",
      entetes:["Dimension", "Acquis de l'exercice indépendant", "Resserrement pour la recherche"],
      lignes:[
        ["Inventaire intersectoriel","Fusion de 55 fichiers ; 35 types de services classés dans six secteurs.","Stabiliser les définitions et les domaines de besoins à partir des profils O1 ; dédoublonner et actualiser les sources."],
        ["Localisation territoriale","Géocodage de 7 216 lieux et rattachement aux huit territoires de CLSC étudiés.","Vérifier les coordonnées, les limites, la couverture des répertoires et les années de référence."],
        ["Accessibilité potentielle","Comparaisons de proximité à 500 m et 1 km, et scénarios en transport collectif ; visualisation de la co-accessibilité santé–social.","Tester les seuils et la sensibilité ; distinguer distance, admissibilité, horaires, capacité et accessibilité réelle."],
        ["Articulation avec O3","Repérage de contrastes entre territoires, utile pour envisager des CLSC contrastés.","Justifier la sélection territoriale et l'accès au terrain ; mesurer séparément les relations intersectorielles réellement déclarées."]
      ],
      reserve:"Lecture prudente : une ressource localisée n'est pas nécessairement disponible, mobilisée ou utilisée. L'atlas ne mesure pas les besoins individuels satisfaits."
    } : {
      chiffres: [["55", "Integrated files"], ["7,216", "Locations listed"], ["35", "Service types"], ["6", "Sectors"], ["8", "CLSC territories"], ["48", "Maps and charts"]],
      source:["2021 census", "Public sources · October 17, 2026"],
      intro:"This independent exercise uses the 2021 census and public sources compiled on October 17, 2026. It tests a territorial mapping workflow, from inventory and geocoding to spatial overlays and visualization.",
      suite:"The maps compare resources and potential walking and public-transit access scenarios. For O2, these methods will need to be adapted to the profiles identified in O1 and the data verified. This exercise demonstrates neither met individual needs nor effective intersectoral collaboration (O3); its findings are not thesis results.",
      tag:"FEATURED MAP · PLATE 03 / 48",
      carte:"Where are health and social resources accessible together?",
      carteTexte:"This map explores potential co-accessibility within 1 km on foot, by dissemination block. It illustrates spatial overlap, not observed coordination.",
      surtitre:"FROM EXPLORATION TO STUDY DESIGN",
      tabTitre:"What the exercise tested — and what still needs refinement",
      tabIntro:"Technical feasibility offers a starting point to verify, not definitive doctoral findings.",
      entetes:["Dimension", "Independent exercise", "Refinement for the study"],
      lignes:[
        ["Cross-sector inventory","55 files merged; 35 service types classified across six sectors.","Finalize definitions and need domains from O1 profiles; deduplicate and update sources."],
        ["Territorial mapping","7,216 locations geocoded and linked to eight CLSC territories.","Check coordinates, boundaries, directory coverage and reference years."],
        ["Potential accessibility","Comparisons at 500 m and 1 km walking distance and by public transit; health–social co-accessibility mapped.","Test thresholds and sensitivity; distinguish distance, eligibility, hours, capacity and actual accessibility."],
        ["Connection to O3","Territorial contrasts identified to inform selection of contrasting CLSC areas.","Justify case selection and access; independently measure intersectoral relationships actually reported."]
      ],
      reserve:"Read cautiously: a mapped resource may not be available, mobilized or used. The atlas does not measure whether individual needs are met."
    };
    const creer = (tag, cls) => {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      return node;
    };
    const stats = creer("div","o2-stats-bandeau");
    stats.setAttribute("role","list");
    stats.setAttribute("aria-label",fr?"L'exploration en chiffres":"Exploration at a glance");
    mots.chiffres.forEach(([valeur,libelle],i) => {
      const item=creer("div","o2-stats-item");
      item.setAttribute("role","listitem");
      item.style.setProperty("--o2-item",["#168996","#e28e50","#6378b9","#3b9f83","#ad69a0","#477eae"][i]);
      const nombre=creer("strong","o2-stats-nombre");
      nombre.textContent=valeur;
      const legende=creer("span","o2-stats-legende");
      legende.textContent=libelle;
      item.append(nombre,legende);
      stats.append(item);
    });
    title.insertAdjacentElement("afterend",stats);
    const para = [...header.querySelectorAll(":scope > p:not(.galerie-o2-surtexte)")];
    // Recomposer le texte introductif sans perdre les précautions scientifiques,
    // mais sans répéter tous les grands chiffres du bandeau.
    if (fr && para[0]?.textContent?.includes("Cette étude spatiale exploratoire")) {
      para[0].textContent=mots.intro;
      if (para[1]) para[1].textContent=mots.suite;
    } else if (!fr && para.length>=2) {
      para[0].textContent=mots.intro;
      para[1].textContent=mots.suite;
    }
    const reperes=header.querySelector(".galerie-o2-reperes");
    if (reperes) {
      reperes.replaceChildren(...mots.source.map(v=>{
        const e=creer("span","");
        e.textContent=v;
        return e;
      }));
    }
    const guide=creer("div","o2-carte-guide");
    const guideTag=creer("span","o2-carte-guide-tag");
    guideTag.textContent=mots.tag;
    const guideTitle=creer("h5","");
    guideTitle.textContent=mots.carte;
    const guideDesc=creer("p","");
    guideDesc.textContent=mots.carteTexte;
    guide.append(guideTag,guideTitle,guideDesc);
    gallery.parentNode.insertBefore(guide,gallery);
    // La planche 03 illustre directement la co-accessibilité potentielle santé–social.
    // Ne change pas le fonctionnement ni la composition de la galerie.
    if (gallery.dataset.planche==="1") gallery.dataset.planche="3";
    const synthese=creer("section","o2-tableau-synthese");
    synthese.setAttribute("aria-labelledby","o2-bilan-titre");
    const surtitre=creer("span","o2-tableau-surtitre");
    surtitre.textContent=mots.surtitre;
    const t=creer("h5","");
    t.id="o2-bilan-titre";
    t.textContent=mots.tabTitre;
    const p=creer("p","o2-tableau-intro");
    p.textContent=mots.tabIntro;
    const scrolling=creer("div","o2-tableau-defilement");
    const table=creer("table","");
    const thead=creer("thead","");
    const thtr=creer("tr","");
    mots.entetes.forEach(s=>{
      const th=creer("th","");
      th.scope="col";
      th.textContent=s;
      thtr.append(th);
    });
    thead.append(thtr);
    const tbody=creer("tbody","");
    mots.lignes.forEach(ligne=>{
      const tr=creer("tr","");
      ligne.forEach((texte,index)=>{
        const td=creer(index===0?"th":"td","");
        if(index===0) td.scope="row";
        td.textContent=texte;
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(thead,tbody);
    scrolling.append(table);
    const note=creer("p","o2-tableau-reserve");
    note.textContent=mots.reserve;
    synthese.append(surtitre,t,p,scrolling,note);
    gallery.insertAdjacentElement("afterend",synthese);
  }

  function initialiser(gallery) {
    if (!gallery || gallery.dataset.galerieInitialisee === "oui") return;
    const figures = trouver(gallery);
    if (!figures.length) return;
    preparerPresentation(gallery);
    gallery.dataset.galerieInitialisee = "oui";
    afficher(gallery, bornes((Number(gallery.dataset.planche) || 1) - 1, figures.length));
  }

  // Les vues de chapitre peuvent déplacer ou recréer le contenu : les événements
  // sont délégués au document. Aucune écoute de scroll, aucun drag de la page.
  document.querySelectorAll("[data-galerie-o2]").forEach(initialiser);
  document.addEventListener("focusin", event => {
    const gallery = event.target.closest?.("[data-galerie-o2]");
    if (gallery) initialiser(gallery);
  });
  document.addEventListener("change", event => {
    if (!event.target.matches?.("[data-galerie-choix]")) return;
    const gallery = event.target.closest("[data-galerie-o2]");
    initialiser(gallery);
    afficher(gallery, Number(event.target.value) - 1);
  });

  document.addEventListener("click", event => {
    const source = event.target.closest?.("[data-galerie-planche]");
    if (source) {
      const gallery = source.closest(".methode-exemples")?.querySelector("[data-galerie-o2]");
      if (!gallery) return;
      event.preventDefault();
      initialiser(gallery);
      afficher(gallery, Number(source.dataset.galeriePlanche) - 1);
      // Un lien extérieur à la visionneuse mène volontairement à celle-ci.
      gallery.scrollIntoView({block:"start", behavior:"auto"});
      return;
    }
    const button = event.target.closest?.("[data-galerie-precedente],[data-galerie-suivante]");
    if (!button) return;
    const gallery = button.closest("[data-galerie-o2]");
    if (!gallery) return;
    initialiser(gallery);
    const i = Number(gallery.dataset.planche || "1") - 1;
    const delta = button.hasAttribute("data-galerie-suivante") ? 1 : -1;
    // Ne jamais appeler scrollTo ou scrollIntoView depuis les flèches.
    afficher(gallery, i + delta);
  });

  document.addEventListener("keydown", event => {
    if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest?.("select,input,textarea,[contenteditable='true']")) return;
    const gallery = event.target.closest?.("[data-galerie-o2]");
    if (!gallery) return;
    initialiser(gallery);
    const total = trouver(gallery).length;
    let i = Number(gallery.dataset.planche || "1") - 1;
    if (event.key === "ArrowLeft") i--;
    else if (event.key === "ArrowRight") i++;
    else if (event.key === "Home") i = 0;
    else i = total - 1;
    event.preventDefault();
    afficher(gallery, i);
  });
})();
