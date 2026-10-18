"use strict";
(function o3Atlas() {
  "use strict";
  function initialiser() {
    if (!/^fr(?:-|$)/i.test(document.documentElement.lang || "")) return;
    if (document.querySelector("[data-o3-atlas]")) return;
    const point = document.querySelector(".section-corps.these .these-objectifs");
    const cibleO3 = document.querySelector('.section-corps.these #these-methode-o3');
    if (!point || !cibleO3) return;
    const racine = document.documentElement.dataset.racine || "./";
    if (!document.querySelector("link[data-o3-style]")) {
      const feuille = document.createElement("link");
      feuille.rel = "stylesheet";
      feuille.href = racine + "assets/o3-reseaux.css";
      feuille.dataset.o3Style = "1";
      document.head.appendChild(feuille);
    }
    const cls = [
      "CLSC Parthenais",
      "CLSC de la Visitation",
      "CLSC Sainte-Catherine",
      "CLSC du Plateau-Mont-Royal",
      "CLSC de Saint-Louis-du-Parc",
      "CLSC de Saint-Henri",
      "CLSC de Verdun",
      "CLSC de Ville-Émard"
    ];
    const echapper = valeur => String(valeur).replace(/[&<>"']/g, caractere => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[caractere]);
    const actes = [
      { texte: ["Soins à", "domicile"], categorie: "soins", x: 420, y: 21 },
      { texte: ["GMF / première", "ligne"], categorie: "soins", x: 673, y: 78 },
      { texte: ["Pharmacie"], categorie: "soins", x: 810, y: 196 },
      { texte: ["Aide", "alimentaire"], categorie: "communaute", x: 792, y: 345 },
      { texte: ["Ressources", "pour aînés"], categorie: "communaute", x: 659, y: 467 },
      { texte: ["Soutien au", "logement"], categorie: "communaute", x: 418, y: 512 },
      { texte: ["Services", "municipaux"], categorie: "territoire", x: 166, y: 459 },
      { texte: ["Accès aux", "droits"], categorie: "territoire", x: 42, y: 344 },
      { texte: ["Organismes de", "proximité"], categorie: "communaute", x: 31, y: 195 },
      { texte: ["Hôpital"], categorie: "soins", x: 167, y: 72 }
    ];
    const couleurs = { soins: "#2d718c", communaute: "#257c6b", territoire: "#b47a42" };
    function constellation(nom, miniature = false) {
      const cx = 500, cy = 299;
      const centreTexte = nom.replace(/^CLSC (?:de la |du |de )?/, "");
      if (miniature) {
        const points = actes.map(({ x, y, categorie }) => {
          const xx = x + 87, yy = y + 34;
          return '<line x1="500" y1="300" x2="' + xx + '" y2="' + yy + '" stroke="' + couleurs[categorie] + '" stroke-opacity=".5" stroke-width="7"/>' +
            '<circle cx="' + xx + '" cy="' + yy + '" r="17" fill="' + couleurs[categorie] + '" stroke="white" stroke-width="5"/>';
        }).join("");
        return '<svg viewBox="0 0 1000 620" aria-hidden="true" focusable="false"><circle cx="500" cy="300" r="250" fill="none" stroke="#bdd9cf" stroke-dasharray="6 12" stroke-width="4"/>' + points + '<circle cx="500" cy="300" r="65" fill="#1c594c" stroke="white" stroke-width="10"/><text x="500" y="309" text-anchor="middle" font-size="37" fill="#fff" font-weight="700">CLSC</text></svg>';
      }
      const lignes = actes.map((a, i) => {
        const nx = a.x + 88, ny = a.y + 33;
        const accent = couleurs[a.categorie];
        const quart = (i % 3) * 8 - 8;
        return '<path d="M' + cx + ',' + cy + ' Q' + (cx + nx) / 2 + ',' + ((cy + ny) / 2 + quart) + ' ' + nx + ',' + ny + '" fill="none" stroke="' + accent + '" stroke-opacity=".73" stroke-width="3.3" stroke-linecap="round"/>';
      }).join("");
      const croisements = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [8, 9], [5, 6]].map(([a, b]) => {
        const p = actes[a], q = actes[b];
        return '<path d="M' + (p.x + 88) + ',' + (p.y + 33) + ' L' + (q.x + 88) + ',' + (q.y + 33) + '" fill="none" stroke="#8ea79d" stroke-width="2.2" stroke-dasharray="5 9" opacity=".5"/>';
      }).join("");
      const noeuds = actes.map(a => {
        const couleur = couleurs[a.categorie];
        const texte = a.texte.map((ligne, j) => '<tspan x="' + (a.x + 88) + '" dy="' + (j ? 21 : 0) + '">' + echapper(ligne) + '</tspan>').join("");
        return '<g><rect x="' + a.x + '" y="' + a.y + '" width="176" height="66" rx="18" fill="#fff" stroke="' + couleur + '" stroke-width="2.8"/><rect x="' + (a.x + 12) + '" y="' + (a.y + 12) + '" width="6" height="42" rx="3" fill="' + couleur + '"/><text x="' + (a.x + 96) + '" y="' + (a.y + (a.texte.length === 2 ? 27 : 39)) + '" fill="#183a38" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="650">' + texte + '</text></g>';
      }).join("");
      const taille = centreTexte.length > 20 ? 18 : centreTexte.length > 15 ? 21 : 25;
      return '<svg class="o3-grand-svg" viewBox="0 0 1000 622" role="img" aria-label="Sociogramme égocentré illustratif autour du ' + echapper(nom) + ' : liens conceptuels avec dix familles d’acteurs, sans données empiriques"><rect width="1000" height="622" rx="23" fill="#f7faf8"/><circle cx="500" cy="299" r="245" fill="none" stroke="#bad7ce" stroke-width="2" stroke-dasharray="4 11"/><circle cx="500" cy="299" r="153" fill="#e8f2ed" stroke="#d2e5dc" stroke-width="2"/>' + croisements + lignes + noeuds + '<circle cx="500" cy="299" r="104" fill="#1e594c" stroke="#fff" stroke-width="9"/><text x="500" y="279" text-anchor="middle" fill="#b9e6d3" font-family="system-ui,sans-serif" font-size="19" font-weight="700">EGO · CLSC</text><text x="500" y="310" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="' + taille + '" font-weight="750">' + echapper(centreTexte) + '</text><text x="500" y="337" text-anchor="middle" fill="#d8f1e6" font-family="system-ui,sans-serif" font-size="14">Territoire d’intervention</text></svg>';
    }
    function qualitatifSVG() {
      const points = [
        { x: 290, y: 92, txt: "A1", type: "#307c8b" },
        { x: 516, y: 160, txt: "A2", type: "#2c836c" },
        { x: 550, y: 365, txt: "A3", type: "#2c836c" },
        { x: 321, y: 441, txt: "A4", type: "#af7943" },
        { x: 106, y: 325, txt: "A5", type: "#af7943" },
        { x: 113, y: 125, txt: "A6", type: "#307c8b" }
      ];
      const lien = points.map((p, i) => '<path d="M315 265 L' + p.x + " " + p.y + '" fill="none" stroke="' + p.type + '" stroke-width="' + (i % 2 ? 4 : 2) + '" stroke-dasharray="' + (i > 3 ? "8 7" : "none") + '"/>').join("");
      const acteurs = points.map(p => '<circle cx="' + p.x + '" cy="' + p.y + '" r="26" fill="#fff" stroke="' + p.type + '" stroke-width="3"/><text x="' + p.x + '" y="' + (p.y + 5) + '" text-anchor="middle" font-size="16" fill="#173f3b" font-weight="700">' + p.txt + '</text>').join("");
      return '<svg viewBox="0 0 660 540" role="img" aria-label="Exemple de carte d’entretien qualitatif avec ego central, six alters anonymisés, cercles concentriques et liens de styles distincts"><rect x="1" y="1" width="658" height="538" rx="22" fill="#f7faf8" stroke="#d8e5df"/><circle cx="315" cy="265" r="215" fill="none" stroke="#b8cfc7" stroke-width="2"/><circle cx="315" cy="265" r="130" fill="#e9f2ed" stroke="#c9dcd3" stroke-width="2"/>' + lien + acteurs + '<circle cx="315" cy="265" r="63" fill="#20594e" stroke="white" stroke-width="5"/><text x="315" y="259" font-size="20" text-anchor="middle" fill="white" font-weight="750">EGO</text><text x="315" y="281" font-size="16" text-anchor="middle" fill="#d9f5e7">CLSC</text><text x="16" y="518" font-size="15" fill="#6d7f78">A1 à A6 : acteurs codés, placement fictif</text></svg>';
    }
    const realBase = "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12913-026-15347-8/MediaObjects/";
    const figure1 = realBase + "12913_2026_15347_Fig1_HTML.png";
    const figure3 = realBase + "12913_2026_15347_Fig3_HTML.png";
    const article = "https://link.springer.com/article/10.1186/s12913-026-15347-8";
    const officiel = "https://ciusss-centresudmtl.gouv.qc.ca/propos/qui-sommes-nous/territoire-et-population-desservie";
    const module = document.createElement("section");
    module.className = "o3-atlas";
    module.id = "o3-atlas-reseaux";
    module.dataset.o3Atlas = "1";
    module.setAttribute("aria-labelledby", "o3-atlas-titre");
    module.innerHTML =
      '<div class="o3-chapeau"><span>O3 · Support visuel à la délibération</span><span>Analyse de réseaux sociaux · SNA</span></div>' +
      '<div class="o3-entete"><p class="o3-surtexte">Du réseau égocentré à l’interprétation qualitative</p><h3 id="o3-atlas-titre">Huit CLSC, huit sociogrammes d’application</h3><p>L’analyse de réseaux (O3) décrit les relations autour du CLSC. Ses résultats quantitatifs et qualitatifs pourront ensuite être discutés en atelier (O3). Les deux figures scientifiques ci-dessous proviennent de réseaux effectivement étudiés ; les huit déclinaisons montréalaises montrent uniquement comment le dispositif pourrait se présenter sur le terrain.</p></div>' +
      '<div class="o3-source-tete"><h4>Figures scientifiques publiées</h4><p>Réseaux observés dans une recherche sur la coordination intersectorielle en promotion de la santé municipale, et non dans les CLSC de Montréal.</p></div>' +
      '<div class="o3-figures-reelles">' +
        '<figure><a href="' + article + '#Fig1" target="_blank" rel="noopener noreferrer"><img src="' + figure1 + '" alt="Figure scientifique publiée, réseau égocentré avec des communautés d’acteurs et un ego reliant les groupes" loading="lazy" decoding="async"></a><figcaption><strong>01 · Configuration dépendante de l’ego</strong><span>La coordination entre groupes repose fortement sur l’acteur focal.</span><a href="' + article + '#Fig1" target="_blank" rel="noopener noreferrer">Voir la figure originale ↗</a></figcaption></figure>' +
        '<figure><a href="' + article + '#Fig3" target="_blank" rel="noopener noreferrer"><img src="' + figure3 + '" alt="Figure scientifique publiée, configuration de réseau égocentré avec des liaisons réparties entre groupes" loading="lazy" decoding="async"></a><figcaption><strong>02 · Configuration distribuée</strong><span>Les groupes maintiennent davantage de connexions indépendamment de l’ego.</span><a href="' + article + '#Fig3" target="_blank" rel="noopener noreferrer">Voir la figure originale ↗</a></figcaption></figure>' +
      '</div>' +
      '<p class="o3-credit">Source des figures 1 et 3 : Richter, H., Mamontova, T. et Kühne, L. (2026), <em>BMC Health Services Research</em>, 26, 1176. <a href="' + article + '" target="_blank" rel="noopener noreferrer">Article en libre accès</a> · Licence CC BY 4.0. Les figures sont reproduites sans modification.</p>' +
      '<div class="o3-partie"><span>APPLICATION AU TERRAIN</span><h4>Un réseau égocentré pour chaque CLSC du Centre-Sud</h4><p>Choisir un CLSC : son nom devient l’<em>ego</em> de la carte, entouré des catégories de partenaires susceptibles d’être interrogées. La disposition est identique pour permettre une lecture comparative, sans supposer que les collaborations sont les mêmes dans les huit territoires.</p></div>' +
      '<div class="o3-selection" role="group" aria-label="Choisir un CLSC">' + cls.map((nom, i) => '<button type="button" class="o3-clsc-option' + (i === 0 ? " est-actif" : "") + '" data-o3-select="' + i + '" aria-pressed="' + (i === 0) + '"><span class="o3-miniature">' + constellation(nom, true) + '</span><span class="o3-option-num">CLSC ' + String(i + 1).padStart(2, "0") + ' / 08</span><strong>' + echapper(nom) + '</strong></button>').join("") + '</div>' +
      '<div class="o3-planche"><div class="o3-planche-tete"><div><span>CARTE ÉGOCENTRÉE · APPLICATION ILLUSTRATIVE</span><h5 data-o3-nom>' + echapper(cls[0]) + '</h5></div><span class="o3-planche-badge">Pas de données empiriques</span></div><div class="o3-vue-reseau" data-o3-carte>' + constellation(cls[0]) + '</div><div class="o3-legende"><span><i class="o3-leg-soins"></i>Santé et soins</span><span><i class="o3-leg-communaute"></i>Communautaire</span><span><i class="o3-leg-territoire"></i>Municipal / droits</span><span><i class="o3-leg-ego"></i>Ego (CLSC)</span><span><i class="o3-leg-pointille"></i>Liens entre partenaires à investiguer</span></div><p class="o3-precaution">Les nœuds, les liens et leur intensité ne représentent <strong>aucun partenariat attesté</strong>. Les lignes continues et pointillées sont un exemple graphique du type de relations que le questionnaire et les entretiens pourraient documenter. Elles ne constituent ni une mesure, ni un résultat du projet.</p></div>' +
      '<p class="o3-credit">Identification des CLSC : <a href="' + officiel + '" target="_blank" rel="noopener noreferrer">répertoire officiel du territoire Centre-Sud</a>. Un CLSC réel n’implique pas un réseau de partenaires mesuré.</p>' +
      '<div class="o3-partie o3-partie-quali"><span>VOLET QUALITATIF DU SNA · O3 (QUAN → qual)</span><h4>De la carte à l’explication des relations</h4><p>Le sociogramme devient un support d’entretien : on explore les raisons des liens, les ressources échangées, les difficultés de coordination, les absences de relation et les points de passage entre organisations.</p></div>' +
      '<div class="o3-quali-grille">' +
        '<article class="o3-quali-panneau"><div class="o3-panneau-entete"><span>01 · ÉLICITATION</span><h5>Sociogramme co-construit</h5><p>Le participant nomme les acteurs, les positionne sur une carte concentrique et décrit ses relations avec eux.</p></div><div class="o3-quali-visuel">' + qualitatifSVG() + '</div><div class="o3-panneau-pied"><span>Proximité ou importance perçue</span><span>Alters anonymisés · exemple de méthode</span></div></article>' +
        '<article class="o3-quali-panneau"><div class="o3-panneau-entete"><span>02 · QUALIFICATION DES LIENS</span><h5>Ce que les traits ne disent pas</h5><p>La présence d’un lien ne renseigne pas à elle seule sur sa nature, sa direction, sa fréquence ou sa fonction.</p></div><div class="o3-qualifications"><div><span class="o3-qual-repere solide"></span><strong>Collaboration opérationnelle</strong><small>Pour quelles tâches, à quelle fréquence ?</small></div><div><span class="o3-qual-repere double"></span><strong>Échanges réciproques</strong><small>Qui transmet quoi et à qui ?</small></div><div><span class="o3-qual-repere pointille"></span><strong>Lien incertain ou occasionnel</strong><small>Quand est-il activé et pourquoi ?</small></div><div><span class="o3-qual-repere manque"></span><strong>Lien absent ou non mobilisé</strong><small>Obstacle, connaissance, mandat, accessibilité ?</small></div></div><p class="o3-qual-note">Ces styles sont une grille de lecture pédagogique à confronter aux définitions du questionnaire, et non des liens observés.</p></article>' +
      '</div>' +
      '<div class="o3-quali-matrice"><div class="o3-matrice-titre"><span>03 · CODAGE ET INTERPRÉTATION</span><h5>Mise en regard des réseaux et des entretiens</h5><p>Exemples de questions analytiques, sans verbatim attribué à un professionnel ni constat présenté comme acquis.</p></div><div class="o3-table-wrap"><table><thead><tr><th>Observation structurale à vérifier</th><th>Question d’entretien</th><th>Thème à coder</th><th>Discussion possible en O3</th></tr></thead><tbody><tr><td>Un partenaire périphérique sur la carte</td><td>Pourquoi est-il peu mobilisé pour ce profil de besoins ?</td><td>Connaissance des ressources · accès</td><td>Quelles conditions faciliteraient sa mobilisation ?</td></tr><tr><td>Un CLSC placé en position de passage</td><td>Qui relie les organisations en son absence ?</td><td>Coordination · dépendance à un acteur</td><td>Comment renforcer la continuité des liens ?</td></tr><tr><td>Un lien attendu mais non déclaré</td><td>Le mandat, le financement ou les pratiques empêchent-ils l’échange ?</td><td>Frontières institutionnelles · confiance</td><td>Quel ajustement intersectoriel envisager ?</td></tr></tbody></table></div></div>' +
      '<div class="o3-transfert"><div><span>04 · INTÉGRATION ET ATELIER</span><h5>Du constat discuté à une recommandation contextualisée</h5></div><ol><li><strong>Carte de réseau</strong><small>Qui est relié à qui ?</small></li><li><strong>Entretien qualitatif</strong><small>Pourquoi, comment, dans quel contexte ?</small></li><li><strong>Mise en regard</strong><small>Convergences, divergences et incertitudes</small></li><li><strong>Délibération O3</strong><small>Options, désaccords et recommandations</small></li></ol></div>' +
      '<div class="o3-methodo-sources"><h5>Repères méthodologiques vérifiables</h5><p><a href="https://doi.org/10.1177/19375867211013772" target="_blank" rel="noopener noreferrer">Burgette et al. (2021) · Principes et métriques des réseaux égocentrés ↗</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12315688/" target="_blank" rel="noopener noreferrer">Étude qualitative avec sociogrammes et entretiens (2025) ↗</a><a href="https://doi.org/10.1111/glob.12315" target="_blank" rel="noopener noreferrer">Herz (2021) · Cartes égocentrées et analyse qualitative ↗</a></p></div>';
    // Le module SNA est un prolongement d'O3 dans la méthodologie,
    // pas une insertion après les trois objectifs de la problématique.
    const exemplesO3 = cibleO3.querySelector('#exemples-sna-o3');
    if (exemplesO3) exemplesO3.before(module);
    else cibleO3.appendChild(module);
    const boutons = [...module.querySelectorAll("[data-o3-select]")];
    boutons.forEach((bouton) => bouton.addEventListener("click", () => {
      const i = Number(bouton.dataset.o3Select);
      boutons.forEach((autre, j) => {
        const oui = i === j;
        autre.classList.toggle("est-actif", oui);
        autre.setAttribute("aria-pressed", String(oui));
      });
      module.querySelector("[data-o3-carte]").innerHTML = constellation(cls[i]);
      module.querySelector("[data-o3-nom]").textContent = cls[i];
    }));
    // Raccourci explicite depuis la carte O3 et les méthodes O2 sans déplacer ni modifier leurs formulations.
    const o3 = point.querySelector('.objectif-carte[data-objectif="O3"]');
    if (o3 && !o3.querySelector("[data-o3-raccourci]")) {
      const lien = document.createElement("a");
      lien.className = "o3-raccourci";
      lien.dataset.o3Raccourci = "1";
      lien.href = "#o3-atlas-reseaux";
      lien.dataset.theseVers = "methodes";
      lien.dataset.theseObjectif = "O3";
      lien.textContent = "Explorer les sociogrammes et le volet qualitatif →";
      // Le gestionnaire de rubriques change d'onglet et défile jusqu'à O3.
      lien.addEventListener('click', (event) => event.preventDefault());
      o3.appendChild(lien);
    }
    const methodes = document.querySelector(".section-corps.these .these-methodes");
    if (methodes && !methodes.querySelector(".o3-renvoi-methodes")) {
      const note = document.createElement("div");
      note.className = "o3-renvoi-methodes";
      note.innerHTML = '<strong>Illustrations du SNA quantitatif et qualitatif</strong><p>Huit exemples égocentrés centrés sur les CLSC du Centre-Sud, des figures scientifiques authentiques et une démarche qualitative guidée par la carte.</p><button type="button">Voir l’atlas des réseaux et les schémas qualitatifs →</button>';
      // Garder ce renvoi avec la méthode O3 au lieu d'en faire un bloc flottant.
      const titreO3 = cibleO3.querySelector('h4.titre-bloc');
      if (titreO3) titreO3.insertAdjacentElement("afterend", note);
      else cibleO3.prepend(note);
      note.querySelector("button").addEventListener("click", () => {
        const table = note.closest('[data-rubriques="these"]');
        const ongletMethode = table?.querySelector('[role="tab"][data-rubrique="methodes"]');
        if (ongletMethode && ongletMethode.getAttribute('aria-selected') !== 'true') ongletMethode.click();
        const carte = document.querySelector("#o3-atlas-reseaux");
        if (carte) carte.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialiser, { once: true });
  else initialiser();
})();
