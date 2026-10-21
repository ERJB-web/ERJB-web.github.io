"use strict";
(function o3Atlas() {
  "use strict";
  // Une instance par élément DOM réel. Les clones de la navigation
  // ne reprennent pas les gestionnaires d'événements du module initial.
  // Échappement des légendes et attributs injectés dans la galerie O3.
  const echapper = (valeur) => String(valeur).replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[caractere]));
  const modulesInitialises = new WeakSet();
  const controlesCompacts = new WeakSet();
  function initialiser(zone) {
    if (!/^fr(?:-|$)/i.test(document.documentElement.lang || "")) return;
    if (!zone) return;
    const cibleO3 = zone.querySelector("#these-methode-o3");
    if (!cibleO3) return;
    const espaceExistant = zone.querySelector("#methode-o3-exemples");
    function ajouterBandeauRetro(zone, cibleO3) {
  cibleO3.querySelectorAll("[data-o3-devis-retro]").forEach(el=>el.remove());
  const bandeau = document.createElement("section");
  bandeau.className = "o3-devis-retro";
  bandeau.dataset.o3DevisRetro = "1";
  bandeau.setAttribute("aria-label", "Devis principal : analyse de réseaux rétrospective");
  bandeau.innerHTML = "<div class=\"o3-lecture-intro\"><span class=\"o3-devis-retro__kicker\">DEVIS PRINCIPAL · O3</span><h3>Analyse de réseaux rétrospective</h3><div class=\"o3-lecture-volets\"><span>QUAN · Réseaux</span><span aria-hidden=\"true\">→</span><span>qual · Entretiens</span></div></div><div class=\"o3-lecture-chiffres\"><div><strong>12</strong><span>mois rétrospectifs</span></div><div><strong>16–24</strong><span>situations envisagées</span></div><div><strong>2</strong><span>CLSC prévus</span></div><div><strong>4</strong><span>situations pilotes</span></div></div><ol class=\"o3-lecture-parcours\" aria-label=\"Parcours méthodologique\"><li><span>01</span><strong>Situations réelles</strong><small>Profils O1 · avec ou sans orientation</small></li><li><span>02</span><strong>Relations déclarées</strong><small>Organisations · contacts · relais</small></li><li><span>03</span><strong>Réseaux</strong><small>Par profil et territoire</small></li><li><span>04</span><strong>Entretiens</strong><small>Explications des acteurs</small></li></ol><details class=\"o3-lecture-principe\"><summary>Principe et périmètre</summary><p>À partir de situations réelles correspondant aux profils de besoins, les équipes de soutien à domicile (SAD) reconstituent la réponse intersectorielle sur une <strong>fenêtre de repérage rétrospective de 12 mois</strong> : actions, contacts, coordinations, relais et aide effectivement reçue ou non. Les situations <strong>sans orientation extérieure</strong> sont également retenues. Questionnaires, traces accessibles et vérifications auprès des partenaires servent à qualifier les liens.</p></details><button class=\"o3-devis-retro__renvoi\" type=\"button\" data-o3-ouvrir-prospectif>Comparer rétrospectif et prospectif <span aria-hidden=\"true\">↘</span></button>";
  const entete = cibleO3.querySelector(":scope > .methode-objectif-tete");
  if (entete) entete.insertAdjacentElement("afterend",bandeau);
  else cibleO3.prepend(bandeau);
  bandeau.querySelector("[data-o3-ouvrir-prospectif]").addEventListener("click",()=>{
    const option=zone.querySelector("#o3-option-prospective");
    if(!option)return;
    option.open=true;
    option.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  });
}

    // La galerie est placée dans la vue O3, après l'article du protocole.
    // L'ancienne recherche dans l'article seul la manquait et la dupliquait.
    const galeriesExistantes = Array.from(zone.querySelectorAll(
      "#these-objectif-vue-o3 [data-o3-atlas], #methode-o3-exemples [data-o3-atlas], #these-methode-o3 [data-o3-atlas]"
    ));
    if (galeriesExistantes.length === 1 && modulesInitialises.has(galeriesExistantes[0])) return;
    ajouterBandeauRetro(zone, cibleO3);
    // Nettoyer les copies clonées et reconstruire une seule visionneuse active.
    galeriesExistantes.forEach(galerie => galerie.remove());
    const point = zone.querySelector(".these-objectifs");
    const racine = document.documentElement.dataset.racine || "./";
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
      const acteurs = points.map(p => '<circle cx="' + p.x + '" cy="' + p.y + '" r="26" fill="#fff" stroke="' + p.type + '" stroke-width="3"/><text x="' + p.x + '" y="' + (p.y + 5) + '" text-anchor="middle" font-size="16" fill="#284a60" font-weight="700">' + p.txt + '</text>').join("");
      return '<svg viewBox="0 0 660 540" role="img" aria-label="Exemple de carte d’entretien qualitatif avec ego central, six alters anonymisés, cercles concentriques et liens de styles distincts"><rect x="1" y="1" width="658" height="538" rx="22" fill="#f6f8fb" stroke="#dae3ed"/><circle cx="315" cy="265" r="215" fill="none" stroke="#b7c9d8" stroke-width="2"/><circle cx="315" cy="265" r="130" fill="#eaf0f7" stroke="#c9d9e8" stroke-width="2"/>' + lien + acteurs + '<circle cx="315" cy="265" r="63" fill="#274f68" stroke="white" stroke-width="5"/><text x="315" y="259" font-size="20" text-anchor="middle" fill="white" font-weight="750">EGO</text><text x="315" y="281" font-size="16" text-anchor="middle" fill="#dcebf6">CLSC</text><text x="16" y="518" font-size="15" fill="#657888">A1 à A6 : acteurs codés, placement fictif</text></svg>';
    }

    // Expérimentations et modèles d'application, distincts de l'enquête SAD.
    const descriptifs211=[
      ["Orientations du 211 : ego dirigé et pondéré","01-ego-211.svg","Verdun, 2024–2025. Chaque flèche correspond à une référence du 211 vers un destinataire : aucun lien SAD–partenaire n'est observé."],
      ["Affiliation domaines–organismes","02-biparti.svg","Verdun, tous âges : des besoins référencés vers des destinataires. Il ne s'agit pas de liens de collaboration entre organismes."],
      ["Matrice des destinations par origine","03-matrice.svg","Références des 60 ans et plus en 2024–2025. Les arrondissements sont des contextes géographiques, non des organisations qui collaborent."],
      ["Évolution des destinataires du 211","04-evolution.svg","Trois exercices de références. Une variation de destinataires observés ne prouve pas l'ouverture ou la fermeture d'organismes."]
    ];
    const annees=["2023–2024","2024–2025","2025–2026"];
    const serieR=[{titre:"Évolution temporelle · R",cle:"a1_temporel.svg",
      lecture:"Comparaison calculée des exercices à Verdun ; l'interprétation dépend de la couverture des extractions."}];
    annees.forEach((annee,i)=>{
      const k="a1_y"+(i+1)+"_";
      serieR.push({titre:"SNA égocentrée 211 · "+annee,cle:k+"ego.svg",
        lecture:"Le 211 est l'ego. Les liens représentent les références enregistrées vers les destinataires, pas des partenariats SAD."});
      serieR.push({titre:"SNA bipartie · "+annee,cle:k+"biparti.svg",
        lecture:"Affiliation entre domaines de besoins et organismes référencés, sans mesurer les besoins concomitants d'une personne."});
      [0,10,20].forEach(seuil=>serieR.push({
        titre:"Projection des domaines · "+annee+" · seuil "+(seuil/100).toFixed(2).replace(".",","),
        cle:k+"projection_"+seuil+".svg",
        lecture:"Domaines liés parce qu'ils partagent des destinataires, avec seuil de similarité Jaccard ; ces liens dérivés ne mesurent pas les collaborations intersectorielles."
      }));
    });
    // Galerie : uniquement les figures d'analyse des orientations du 211.
    const donnees=[
      ...descriptifs211.map(([titre,nom,lecture])=>({type:"figure",titre:"211 · "+titre,url:"/simulations/sna-o3/figures/"+nom,lecture})),
      ...serieR.map(x=>({...x,type:"r",titre:"211 / R · "+x.titre}))
    ];
    const nFigures=descriptifs211.length,total=donnees.length;
    const enteteChoix=(debut,fin)=>donnees.slice(debut,fin).map((d,j)=>
      '<option value="'+(debut+j)+'">'+String(debut+j+1).padStart(2,"0")+' · '+echapper(d.titre)+'</option>').join("");
    const options='<optgroup label="211 · quatre figures de synthèse">'+enteteChoix(0,nFigures)+'</optgroup>'+
      '<optgroup label="211 · seize graphiques calculés avec R">'+enteteChoix(nFigures,total)+'</optgroup>';
    const planches=donnees.map((d,i)=>{
      let visuel;
      if(d.type==="figure")visuel='<a class="o3-galerie-visuel" href="'+d.url+'" target="_blank" rel="noopener" aria-label="Voir la figure vectorielle"><img src="'+d.url+'" alt="'+echapper(d.titre)+'" loading="lazy"></a>';
      else visuel='<div class="o3-galerie-visuel o3-galerie-r" data-o3-r-key="'+echapper(d.cle)+'"><p>Graphique R chargé lors de sa sélection.</p></div>';
      return '<figure class="o3-galerie-planche" data-o3-slide="'+i+'"'+(i?' hidden aria-hidden="true"':' aria-hidden="false"')+'>'+visuel+
        '<figcaption><span class="o3-galerie-statut">'+"Exercice SNA sur les références du 211 · non assimilable au protocole de thèse"+
        '</span><h4>'+echapper(d.titre)+'</h4><p>'+echapper(d.lecture)+'</p>'+
        (d.type==="r"?'<section class="o3-r-legende" data-o3-r-legende aria-label="Codes, couleurs et nombres de la figure R"><p>Légende en cours de chargement…</p></section>':'')+'</figcaption></figure>';
    }).join("");
    const module=document.createElement("section");
    module.className="o3-atlas o3-galerie-unifiee";
    module.id="o3-atlas-reseaux";
    module.dataset.o3Atlas="1";
    module.setAttribute("aria-labelledby","o3-atlas-titre");
    const qualitatif =
      '<div class="o3-partie o3-partie-quali"><span>VOLET QUALITATIF DU SNA · O3 (QUAN → qual)</span><h4>De la carte à l’explication des relations</h4><p>Le sociogramme devient un support d’entretien : on explore les raisons des liens, les ressources échangées, les difficultés de coordination, les absences de relation et les points de passage entre organisations.</p></div>' +
      '<div class="o3-quali-grille">' +
        '<article class="o3-quali-panneau"><div class="o3-panneau-entete"><span>06.1 · ÉLICITATION</span><h5>Sociogramme co-construit</h5><p>Le participant nomme les acteurs, les positionne sur une carte concentrique et décrit ses relations avec eux.</p></div><div class="o3-quali-visuel">' + qualitatifSVG() + '</div><div class="o3-panneau-pied"><span>Proximité ou importance perçue</span><span>Alters anonymisés · exemple de méthode</span></div></article>' +
        '<article class="o3-quali-panneau"><div class="o3-panneau-entete"><span>06.2 · QUALIFICATION DES LIENS</span><h5>Ce que les traits ne disent pas</h5><p>La présence d’un lien ne renseigne pas à elle seule sur sa nature, sa direction, sa fréquence ou sa fonction.</p></div><div class="o3-qualifications"><div><span class="o3-qual-repere solide"></span><strong>Collaboration opérationnelle</strong><small>Pour quelles tâches, à quelle fréquence ?</small></div><div><span class="o3-qual-repere double"></span><strong>Échanges réciproques</strong><small>Qui transmet quoi et à qui ?</small></div><div><span class="o3-qual-repere pointille"></span><strong>Lien incertain ou occasionnel</strong><small>Quand est-il activé et pourquoi ?</small></div><div><span class="o3-qual-repere manque"></span><strong>Lien absent ou non mobilisé</strong><small>Obstacle, connaissance, mandat, accessibilité ?</small></div></div><p class="o3-qual-note">Ces styles sont une grille de lecture pédagogique à confronter aux définitions du questionnaire, et non des liens observés.</p></article>' +
      '</div>' +
      '<div class="o3-quali-matrice"><div class="o3-matrice-titre"><span>06.3 · CODAGE ET INTERPRÉTATION</span><h5>Mise en regard des réseaux et des entretiens</h5><p>Exemples de questions analytiques, sans verbatim attribué à un professionnel ni constat présenté comme acquis.</p></div><div class="o3-table-wrap"><table><thead><tr><th>Observation structurale à vérifier</th><th>Question d’entretien</th><th>Thème à coder</th><th>Discussion possible en O3</th></tr></thead><tbody><tr><td>Un partenaire périphérique sur la carte</td><td>Pourquoi est-il peu mobilisé pour ce profil de besoins ?</td><td>Connaissance des ressources · accès</td><td>Quelles conditions faciliteraient sa mobilisation ?</td></tr><tr><td>Un CLSC placé en position de passage</td><td>Qui relie les organisations en son absence ?</td><td>Coordination · dépendance à un acteur</td><td>Comment renforcer la continuité des liens ?</td></tr><tr><td>Un lien attendu mais non déclaré</td><td>Le mandat, le financement ou les pratiques empêchent-ils l’échange ?</td><td>Frontières institutionnelles · confiance</td><td>Quel ajustement intersectoriel envisager ?</td></tr></tbody></table></div></div>' +
      '<div class="o3-transfert"><div><span>06.4 · INTÉGRATION ET ATELIER</span><h5>Du constat discuté à une recommandation contextualisée</h5></div><ol><li><strong>Carte de réseau</strong><small>Qui est relié à qui ?</small></li><li><strong>Entretien qualitatif</strong><small>Pourquoi, comment, dans quel contexte ?</small></li><li><strong>Mise en regard</strong><small>Convergences, divergences et incertitudes</small></li><li><strong>Délibération O3</strong><small>Options, désaccords et recommandations</small></li></ol></div>' +
      '<div class="o3-methodo-sources"><h5>Repères méthodologiques vérifiables</h5><p><a href="https://doi.org/10.1177/19375867211013772" target="_blank" rel="noopener noreferrer">Burgette et al. (2021) · Principes et métriques des réseaux égocentrés ↗</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12315688/" target="_blank" rel="noopener noreferrer">Étude qualitative avec sociogrammes et entretiens (2025) ↗</a><a href="https://doi.org/10.1111/glob.12315" target="_blank" rel="noopener noreferrer">Herz (2021) · Cartes égocentrées et analyse qualitative ↗</a></p></div>';

    module.innerHTML=
      '<header class="o3-galerie-intro"><span class="o3-galerie-surtexte"><span class="exemple-illustration-etiquette">[EXEMPLE D’ILLUSTRATION]</span><span><strong>SNA</strong> réalisé à partir des données secondaires et des références du 211</span></span>'+
      '<h3 id="o3-atlas-titre">Galerie SNA du 211 · '+total+' figures</h3>'+
      '<p>La galerie suivante rassemble <strong>quatre figures de synthèse</strong> et <strong>seize figures calculées dans R</strong> afin d’illustrer une analyse de réseaux (SNA) fondée sur les fichiers du 211, qui décrivent des orientations vers des organismes, et non les collaborations entre équipes SAD et partenaires. <strong>Il s’agit d’un exercice méthodologique à titre d’exemple : ces données et figures ne sont ni les données collectées ni les résultats de la SNA prévue dans la thèse, laquelle sera égocentrée sur les équipes des CLSC en soutien à domicile.</strong></p>'+
      '<div class="o3-galerie-reperes"><span>4 figures de synthèse</span><span>16 graphiques R</span><span>Exercice exploratoire · 211</span></div></header>'+
      '<div class="o3-galerie-commandes"><label for="o3-galerie-select">Choisir un sociogramme ou un graphique</label>'+
      '<div class="o3-galerie-controles"><select id="o3-galerie-select" data-o3-choix>'+options+'</select>'+
      '<div class="o3-galerie-fleches"><button type="button" data-o3-prev aria-label="Figure précédente" disabled>←</button>'+
      '<output data-o3-compteur aria-live="polite">1 / '+total+'</output>'+
      '<button type="button" data-o3-next aria-label="Figure suivante">→</button></div></div></div>'+
      '<div class="o3-galerie-planches" aria-label="Figure sélectionnée">'+planches+'</div>'+
      '<div class="o3-galerie-pied"><p><strong>Statut des données.</strong> Seules des orientations du 211 sont enregistrées ; les relations entre organismes, les collaborations SAD et la réponse effective aux besoins devront être documentées dans le protocole O3. Les variations de couverture des fichiers peuvent influencer les graphes.</p>'+
      '<a href="/simulations/sna-o3/" target="_blank" rel="noopener">Dossier 211 : figures et sources ↗</a>'+
      '<a href="/simulations/sna-o3/r/" target="_blank" rel="noopener">Calculs R, graphiques et GraphML ↗</a>'+
      '</div>';
    // Les exemples qualitatifs relèvent de la section 06 d'O3, avant les limitations.
    // Aucun encadré autonome ni accordéon supplémentaire : le contenu suit l'ordre du protocole.
    const methodo = document.createElement("div");
    methodo.className = "o3-qualitatif-integre";
    methodo.setAttribute("aria-label", "Exemples méthodologiques d’entretiens et de codage qualitatif");
    methodo.innerHTML = '<h6 class="o3-qual-titre">Exemples méthodologiques d’entretiens et de codage qualitatif</h6>' + qualitatif;
    const espaceExemples = cibleO3.querySelector("#methode-o3-exemples");
    if (espaceExemples) {
      espaceExemples.querySelectorAll(":scope > .o3-qualitatif-integre, :scope > .o3-clsc-methodo").forEach(node => node.remove());
      espaceExemples.prepend(methodo);
    } else cibleO3.append(methodo);
    // La galerie du 211 vient après TOUT le contenu de l'objectif O3,
    // jamais au milieu des sous-sections méthodologiques ni des annexes.
    // Elle reste dans la vue O3 (masquée lorsque O1 ou O2 est sélectionné).
    const vueO3 = cibleO3.closest(".these-objectif-vue[data-vue-objectif='O3']") ||
      zone.querySelector("#these-objectif-vue-o3");
    if (vueO3) vueO3.append(module);
    else if (espaceExemples) espaceExemples.append(module);
    else cibleO3.append(module);
    // Un seul accordéon, fermé par défaut, pour comparer les modalités et approfondir le prospectif.
    zone.querySelectorAll("[data-o3-choix-quantitatif], [data-o3-devis-prospectif]").forEach(el => el.remove());
    const comparatif = document.createElement("details");
    comparatif.id = "o3-option-prospective";
    comparatif.className = "o3-choix-quantitatif";
    comparatif.dataset.o3ChoixQuantitatif = "1";
    comparatif.setAttribute("aria-labelledby", "o3-choix-quantitatif-titre");
    comparatif.innerHTML = "\n      <summary class=\"o3-choix-quantitatif__entete\">\n<h3 id=\"o3-choix-quantitatif-titre\">Autre choix méthodologique possible : rétrospectif ou prospectif ?</h3>\n        <span class=\"o3-choix-chevron\" aria-hidden=\"true\">⌄</span>\n      </summary>\n      <p class=\"o3-choix-quantitatif__intro\">Deux façons de documenter la réponse intersectorielle autour des situations correspondant aux profils d’O1. <strong>O3-A reste la modalité privilégiée ; O3-B est une alternative exploratoire.</strong> Le choix sera arrêté avant le recrutement, avec la codirection, selon les partenariats, les autorisations et la qualité attendue des données.</p>\n      <div class=\"o3-choix-quantitatif__tableau-wrap\">\n        <div class=\"o3-choix-quantitatif__defilement\" role=\"region\" tabindex=\"0\" aria-label=\"Comparaison des modalités rétrospective et prospective\">\n          <table><caption class=\"o3-comparatif-legende\">Deux modalités, un même objectif : documenter les relations entre organisations</caption><thead><tr><th scope=\"col\">Critère</th><th scope=\"col\"><span class=\"o3-comp-code\">O3-A</span><span class=\"o3-comp-mode\">Rétrospectif</span><small>Modalité privilégiée</small></th><th scope=\"col\"><span class=\"o3-comp-code\">O3-B</span><span class=\"o3-comp-mode\">Prospectif</span><small>Alternative à évaluer</small></th></tr></thead><tbody>\n          <tr><th scope=\"row\">Principe</th><td data-modalite=\"O3-A · Rétrospectif\">Reconstituer les relations interorganisationnelles autour de situations correspondant aux profils d’O1.</td><td data-modalite=\"O3-B · Prospectif\">Suivre des patients traceurs et les organisations mobilisées au fil de leur trajectoire.</td></tr>\n          <tr><th scope=\"row\">Porte d’entrée</th><td data-modalite=\"O3-A · Rétrospectif\">SAD ou GMF : repérage des situations, puis des liens entre organisations.</td><td data-modalite=\"O3-B · Prospectif\">Patient traceur : inclusion à T0 et relevé du réseau déjà mobilisé.</td></tr>\n          <tr><th scope=\"row\">Collecte</th><td data-modalite=\"O3-A · Rétrospectif\">Questionnaires auprès des organisations sur les 12 derniers mois.</td><td data-modalite=\"O3-B · Prospectif\">12 mois de suivi : T0, puis questionnaires à 3, 6, 9 et 12 mois.</td></tr>\n          <tr><th scope=\"row\">Faisabilité</th><td data-modalite=\"O3-A · Rétrospectif\">Plus favorable avec les partenariats envisagés à ce stade ; logistique plus légère.</td><td data-modalite=\"O3-B · Prospectif\">Soumise au recrutement, aux partenariats et aux autorisations ; sollicitations répétées.</td></tr>\n          <tr><th scope=\"row\">Limites</th><td data-modalite=\"O3-A · Rétrospectif\">Oublis et reconstruction parfois incomplète.</td><td data-modalite=\"O3-B · Prospectif\">Attrition et exigences éthiques accrues ; biais de mémoire réduit, sans être supprimé.</td></tr>\n          <tr><th scope=\"row\">Place du patient</th><td data-modalite=\"O3-A · Rétrospectif\">Participation possible, mais plus indirecte.</td><td data-modalite=\"O3-B · Prospectif\">Point de vue intégré aux suivis, selon les autorisations et consentements.</td></tr>\n          <tr><th scope=\"row\">Portée scientifique</th><td data-modalite=\"O3-A · Rétrospectif\">Décrire les relations et les limites de leur reconstitution.</td><td data-modalite=\"O3-B · Prospectif\">Documenter leur évolution dans le temps, sans inférence causale.</td></tr>\n          </tbody></table>\n        </div>\n      </div>\n      <div class=\"o3-pros__contenu\">\n        <p><strong>Effectif prospectif envisagé :</strong> un ou deux cas par profil et par CLSC, soit 4–6 patients pour 2–3 profils dans 2 CLSC, ou 8–12 avec deux cas par combinaison. Inclure, dans la mesure du possible, des parcours avec et sans orientation intersectorielle. Un cas par profil et CLSC ne représente pas toutes les trajectoires.</p>\n        <details class=\"o3-pros__approfondir\"><summary>Afficher le protocole détaillé · mesures, trajectoire et faisabilité <span aria-hidden=\"true\">⌄</span></summary><div class=\"o3-pros__approfondir-corps\">\n      <section class=\"o3-pros__partie\" aria-labelledby=\"o3-pros-mesures-title\">\n        <div class=\"o3-pros__titre\"><span>01 · QUESTIONNAIRE TRIMESTRIEL</span><h4 id=\"o3-pros-mesures-title\">Six dimensions documentées à chaque échéance</h4><p>Questionnaire bref au professionnel SAD référent, confronté selon autorisations et consentements aux traces accessibles, aux partenaires et au patient ou à son proche.</p></div>\n        <div class=\"o3-pros__mesures\">\n          <article><span class=\"o3-pros__mesure-num\">01</span><strong>Besoins et morbidité</strong><p>Les besoins ont-ils évolué, augmenté ou disparu ?</p></article>\n          <article><span class=\"o3-pros__mesure-num\">02</span><strong>Mobilisation</strong><p>Quels organismes ont été contactés, puis sont intervenus ?</p></article>\n          <article><span class=\"o3-pros__mesure-num\">03</span><strong>Collaboration</strong><p>Qui échange, décide ou coordonne concrètement ?</p></article>\n          <article><span class=\"o3-pros__mesure-num\">04</span><strong>Continuité</strong><p>Quels liens persistent, cessent ou sont réorganisés ?</p></article>\n          <article><span class=\"o3-pros__mesure-num\">05</span><strong>Réponse aux besoins</strong><p>Une aide a-t-elle été reçue, partiellement reçue ou non reçue ?</p></article>\n          <article><span class=\"o3-pros__mesure-num\">06</span><strong>Point de vue du patient</strong><p>La réponse correspond-elle à ses besoins et priorités ?</p></article>\n        </div>\n      </section>\n      <section class=\"o3-pros__partie\" aria-labelledby=\"o3-pros-reseaux-title\">\n        <div class=\"o3-pros__titre\"><span>02 · RÉSEAUX ÉVOLUTIFS</span><h4 id=\"o3-pros-reseaux-title\">D’un contact à une coordination documentée</h4><p>Des sociogrammes successifs, propres à <strong>chaque situation</strong>, permettent de visualiser les modifications du réseau sans supposer qu’un réseau agrégé équivaut à une collaboration autour de la même personne. <strong>Le patient sert de traceur de situation ; les nœuds du SNA demeurent l’équipe SAD et les organisations mobilisées.</strong></p></div>\n        <div class=\"o3-pros__parcours\" aria-label=\"Exemple fictif de progression d'une trajectoire intersectorielle\">\n          <div><span>T0</span><strong>Besoin repéré</strong><p>Alimentation et transport, dans un contexte de morbidité.</p></div>\n          <div><span>T6</span><strong>Contacts</strong><p>Deux organismes sollicités ; coordination encore inconnue.</p></div>\n          <div><span>T9</span><strong>Coordination</strong><p>Plan partagé et échanges corroborés entre intervenants.</p></div>\n          <div><span>T12</span><strong>Réponse vérifiée</strong><p>Aide reçue ; adéquation examinée avec la personne.</p></div>\n        </div>\n        <p class=\"o3-pros__note\">Exemple fictif, non résultat de thèse. <strong>Contact ≠ collaboration ≠ aide effectivement reçue.</strong> Une coordination peut être documentée sans que tous les besoins soient résolus.</p>\n      </section>\n      <section class=\"o3-pros__precautions\" aria-label=\"Conditions et limites de cette option\">\n        <div class=\"o3-pros__titre\"><span>03 · CONDITIONS DE FAISABILITÉ</span><h4>Une option à confirmer lors du pilote</h4></div>\n        <div class=\"o3-pros__garde-fous\">\n          <article><strong>Accès et consentement</strong><p>Accords institutionnels et éthiques, consentements adaptés notamment aux troubles cognitifs, pseudonymisation et accès répété aux données.</p></article>\n          <article><strong>Événements de parcours</strong><p>Prévoir hospitalisation, décès, entrée en institution et retrait, sans les interpréter automatiquement comme des échecs de coordination.</p></article>\n          <article><strong>Portée des résultats</strong><p>Quatre à six cas éclairent des mécanismes, sans estimer une fréquence représentative ni démontrer une causalité.</p></article>\n        </div>\n        \n      </section>\n      </div></details>\n      </div>";
    module.before(comparatif);
    modulesInitialises.add(module);
    // Accès immédiat à la galerie depuis le début de l'objectif O3.
    const teteO3 = cibleO3.querySelector(":scope > .methode-objectif-tete");
    if (teteO3 && !teteO3.querySelector("[data-o3-acces-galerie]")) {
      const acces = document.createElement("a");
      acces.dataset.o3AccesGalerie = "1";
      acces.className = "o3-acces-galerie";
      acces.href = "#o3-atlas-reseaux";
      acces.textContent = "Voir la galerie SNA du 211 · 20 figures ↓";
      acces.addEventListener("click", event => {
        event.preventDefault();
        module.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
      teteO3.append(acces);
    }
    const el=Array.from(module.querySelectorAll("[data-o3-slide]"));
    const select=module.querySelector("[data-o3-choix]"),output=module.querySelector("[data-o3-compteur]");
    const prev=module.querySelector("[data-o3-prev]"),next=module.querySelector("[data-o3-next]");
    let current=0,sourceR=null,promesseR=null,promesseAnalyses=null;
    // analyses.json et analyse_sna.R définissent tous les codes, groupes et poids.
    const paletteR=['#176B91','#D67A25','#568447','#9861AB','#C34D68','#3C9190','#A78A28','#647A94','#903F40','#295F48','#774E95','#BD6054','#3759A0','#79773B'];
    const nombreR=x=>Number(x).toLocaleString('fr-CA',{maximumFractionDigits:3});
    function legendeR(fig,resultats) {
      const cle=String(fig.cle||'');
      const couleur=(c,t)=>'<span class="o3-r-repere"><i aria-hidden="true" style="background:'+c+'"></i>'+t+'</span>';
      const codes=liste=>'<ul class="o3-r-codes">'+liste.map(x=>
        '<li><b style="--o3-code:'+x.c+'">'+echapper(x.code)+'</b><span>'+echapper(x.name)+
        (x.note?'<small>'+echapper(x.note)+'</small>':'')+'</span></li>').join('')+'</ul>';
      const afficher=(titre,explication,cles,details)=>
        '<h5>Comment lire la figure · '+titre+'</h5><p>'+explication+'</p>'+
        '<div class="o3-r-reperes">'+cles.join('')+'</div>'+details+
        '<p class="o3-r-limite">Prudence : les fichiers du 211 décrivent des références vers des destinataires, pas des collaborations SAD–organismes, des prestations reçues ou des besoins concomitants individuels.</p>'+
        '<a class="o3-r-source" href="/simulations/sna-o3/r/" target="_blank" rel="noopener noreferrer">Calculs R, mesures et listes complètes ↗</a>';
      if(cle==='a1_temporel.svg'){
        const top=resultats.temporal?.a1?.top;
        if(!Array.isArray(top))throw Error('Codes temporels absents');
        return afficher('suivi temporel',
          'Trois colonnes = trois exercices. Les chiffres près des cercles indiquent le nombre de références de l’année. Un symbole d’absence indique qu’aucune référence n’est enregistrée dans cette extraction.',
          [couleur('#176B91','Bleu : destinataire référencé'),couleur('#ffffff','Blanc : absence de référence'),couleur('#8DB4C6','Trait : références dans deux années consécutives')],
          '<p>La taille du cercle dépend du compte ; la largeur du trait est liée au compte minimum des deux exercices. Une absence de référence ne prouve pas une fermeture.</p><h6>Numéros O1–O10 : noms des destinataires</h6>'+
          codes(top.map(x=>({code:x.code,name:x.name,note:'ID '+x.id,c:'#176B91'}))));
      }
      const m=/^a1_y([1-3])_(ego|biparti|projection_(0|10|20))\.svg$/.exec(cle);
      if(!m)throw Error('Figure non reconnue');
      const a=resultats.analyses?.['a1_y'+m[1]];
      if(!a)throw Error('Analyse absente');
      if(m[2]==='ego')return afficher('réseau égocentré',
        '211 est le centre ; les cercles numérotés 1 à 8 sont les huit destinataires les plus référencés. Le nombre placé sur une flèche est le compte des références du 211 vers ce destinataire.',
        [couleur('#173F55','Bleu foncé : ego 211'),couleur('#176B91','Bleu : destinataires'),couleur('#8DB4C6','Flèche : référence dirigée')],
        '<p>La largeur de la flèche croît avec la racine carrée des références. Huit destinataires sont affichés pour la lisibilité, mais les indicateurs portent sur l’ensemble du réseau.</p><h6>Codes 1–8 : destinataires et nombres</h6>'+
        codes(a.ego_top.map(x=>({code:x.code,name:x.name,note:'ID '+x.id+' · '+nombreR(x.in_strength)+' références',c:'#176B91'}))));
      if(m[2]==='biparti')return afficher('réseau à deux modes',
        'Les carrés D1–D14 sont des domaines de besoins ; les cercles O1–O12 représentent les organismes les plus référencés. Une arête relie un domaine à un destinataire lorsqu’une référence l’associe à ce domaine.',
        [couleur('#D67A25','Carrés orange D : domaines'),couleur('#176B91','Cercles bleus O : organismes'),couleur('#568CA4','Trait : références enregistrées')],
        '<p>L’épaisseur des arêtes augmente avec les comptes. Ces résultats concernent tous les âges ; ils ne mesurent pas les liens entre organismes.</p>'+
        '<div class="o3-r-deux-colonnes"><div><h6>Domaines D1 à D14</h6>'+
        codes(a.domains.map(x=>({code:x.code,name:x.name,c:'#D67A25'})))+
        '</div><div><h6>Organismes O1 à O12</h6>'+
        codes(a.biparti_top.map(x=>({code:x.code,name:x.name,note:'ID '+x.id,c:'#176B91'})))+'</div></div>');
      const seuil=Number(m[3])/100,proj=a.projection?.[String(seuil)];
      if(!proj?.nodes)throw Error('Projection absente');
      const groupes=[...new Set(proj.nodes.map(x=>+x.community))].sort((x,y)=>x-y);
      return afficher('projection des domaines · seuil Jaccard '+seuil.toLocaleString('fr-CA',{minimumFractionDigits:2}),
        'D1–D14 représentent les domaines. Deux domaines sont liés s’ils partagent des organismes référencés ; Jaccard (0–1) mesure leur similarité de destinataires.',
        groupes.map(g=>couleur(paletteR[(g-1)%paletteR.length],'Couleur : communauté Louvain '+g)),
        '<p>Ces couleurs représentent des groupes calculés, pas des secteurs de services. La taille des nœuds augmente avec l’intermédiarité ; l’épaisseur des liens avec Jaccard. Les groupes peuvent changer entre exercices et seuils.</p><h6>Codes D1–D14, noms et groupes</h6>'+
        codes(proj.nodes.map(x=>({code:x.code,name:x.name,note:'Groupe '+x.community+' · intermédiarité '+nombreR(x.betweenness),c:paletteR[(+x.community-1)%paletteR.length]}))));
    }
    async function ouvrirGraphique(zone){
      if(!zone||zone.dataset.charge==="oui")return;
      zone.innerHTML="<p>Chargement du graphique calculé avec R…</p>";
      try{
        if(!promesseR)promesseR=fetch("/simulations/sna-o3/r/graphiques-a1.json")
          .then(r=>{if(!r.ok)throw Error("Fichier R inaccessible");return r.json()});
        sourceR=await promesseR;
        if(!zone.isConnected)return;
        const svg=sourceR.figures?.[zone.dataset.o3RKey];
        if(!svg)throw Error("Graphique absent");
        zone.innerHTML=svg.replace(/^<\?xml[^>]*>\s*/i,"");
        zone.dataset.charge="oui";
        const figure=zone.closest("[data-o3-slide]");
        const image=zone.querySelector("svg");
        if(image){image.setAttribute("role","img");image.setAttribute("aria-label",donnees[+figure.dataset.o3Slide].titre)}
        const cleLegende=figure.querySelector("[data-o3-r-legende]");
        if(cleLegende){
          try{
            if(!promesseAnalyses)promesseAnalyses=fetch("/simulations/sna-o3/r/analyses.json")
              .then(r=>{if(!r.ok)throw Error("Analyses R indisponibles");return r.json()});
            const calculs=await promesseAnalyses;
            if(cleLegende.isConnected)cleLegende.innerHTML=legendeR(donnees[+figure.dataset.o3Slide],calculs);
          }catch(erreur){
            if(cleLegende.isConnected)cleLegende.innerHTML='<p>La légende détaillée est indisponible. <a href="/simulations/sna-o3/r/" target="_blank" rel="noopener">Consulter les correspondances des codes dans les calculs R ↗</a></p>';
            promesseAnalyses=null;
          }
        }
      }catch(erreur){
        zone.innerHTML='<p>Le chargement a échoué. <a href="/simulations/sna-o3/r/" target="_blank" rel="noopener">Ouvrir les résultats R ↗</a></p>';
        promesseR=null;
      }
    }
    function afficher(i){
      current=Math.max(0,Math.min(total-1,i));
      el.forEach((p,j)=>{p.hidden=j!==current;p.setAttribute("aria-hidden",String(j!==current))});
      select.value=String(current);output.textContent=(current+1)+" / "+total;
      prev.disabled=current===0;next.disabled=current===total-1;
      ouvrirGraphique(el[current].querySelector("[data-o3-r-key]"));
    }
    select.addEventListener("change",()=>afficher(+select.value));
    prev.addEventListener("click",()=>afficher(current-1));
    next.addEventListener("click",()=>afficher(current+1));
    module.addEventListener("keydown",event=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
      if(event.target.closest("select,input,textarea,a"))return;
      event.preventDefault();
      afficher(event.key==="Home"?0:event.key==="End"?total-1:current+(event.key==="ArrowRight"?1:-1));
    });
    // Raccourci explicite depuis la carte O3 et les méthodes O2 sans déplacer ni modifier leurs formulations.
    const o3 = point?.querySelector('.objectif-carte[data-objectif="O3"]');
    if (o3 && !o3.querySelector("[data-o3-raccourci]")) {
      const lien = document.createElement("a");
      lien.className = "o3-raccourci";
      lien.dataset.o3Raccourci = "1";
      lien.href = "#o3-atlas-reseaux";
      lien.dataset.theseVers = "methodes";
      lien.dataset.theseObjectif = "O3";
      lien.textContent = "Explorer les 20 figures de la galerie SNA du 211 →";
      // Le gabarit commun ouvre la méthodologie et défile jusqu'à O3.
      lien.addEventListener('click', (event) => event.preventDefault());
      o3.appendChild(lien);
    }

  }
  // Lecture à deux niveaux : repères visuels, puis protocole intégral à la demande.
  function compacterO3(zone) {
    if (!zone) return;
    const article = zone.querySelector('#these-methode-o3');
    if (!article) return;

    // Garder la phrase de cadrage accessible dans le principe, sans doubler la synthèse visuelle.
    const entete = article.querySelector(':scope > .methode-objectif-tete');
    const chapeau = entete?.querySelector(':scope > p:not(:first-child)');
    const reperes = {
      'methode-o3-4': [['QUAN', 'Organisations'], ['qual', 'Acteurs des réseaux']],
      'methode-o3-5': [['2 CLSC', '× 2–3 profils × 4 situations'], ['Pilote', '4 situations']],
      'methode-o3-6': [['12 mois', 'Repérage rétrospectif'], ['2 relais', 'Borne de collecte']],
      'methode-o3-7': [['QUAN', 'Taille · diversité · relations'], ['qual', 'Matrice thématique']],
      'methode-o3-8': [['O1', 'Profils'], ['O2', 'Ressources'], ['O3', 'Réseaux']],
      'methode-o3-9': [['Sociogrammes', '→ entretiens'], ['Exemples', 'Codage · justification']],
      'methode-o3-10': [['Vigilance', 'Sélection · mémoire · non-réponse']]
    };
    article.querySelectorAll('.methode-rubrique').forEach(section => {
      if (section.querySelector(':scope > .o3-lecture-details')) return;
      const titre = section.querySelector(':scope > .methode-rubrique-titre');
      if (!titre) return;
      section.classList.add('o3-lecture-rubrique');
      const detail = document.createElement('details');
      detail.className = 'o3-lecture-details';
      const summary = document.createElement('summary');
      summary.append(titre);
      const apercu = document.createElement('span');
      apercu.className = 'o3-lecture-apercu';
      (reperes[section.id] || []).forEach(([valeur, label]) => {
        const repere = document.createElement('span');
        const valeurNode = document.createElement('b');
        valeurNode.textContent = valeur;
        repere.append(valeurNode, document.createTextNode(' ' + label));
        apercu.append(repere);
      });
      summary.append(apercu);
      const contenu = document.createElement('div');
      contenu.className = 'o3-lecture-contenu';
      while (section.firstChild) contenu.append(section.firstChild);
      detail.append(summary, contenu);
      section.append(detail);
    });
    const corps = article.querySelector('.methode-these-corps');
    if (corps && !corps.querySelector(':scope > .o3-lecture-notes')) {
      const notes = document.createElement('details');
      notes.className = 'o3-lecture-notes';
      const summary = document.createElement('summary');
      summary.textContent = 'Cadrage du terrain, calendrier et études d’appui';
      notes.append(summary);
      corps.querySelectorAll(':scope > .methode-o3-precision-territoire, :scope > .ia-reperes').forEach(el => notes.append(el));
      corps.append(notes);
    }
    const vue = article.closest('[data-vue-objectif]');
    const flexible = vue?.querySelector(':scope > .mat-sc--flex');
    const notes = article.querySelector('.o3-lecture-notes');
    if (flexible && notes) notes.append(flexible);
    if (chapeau && notes) notes.querySelector(':scope > summary').after(chapeau);
    let commandes = article.querySelector('.o3-lecture-commandes');
    if (!commandes) {
      commandes = document.createElement('div');
      commandes.className = 'o3-lecture-commandes';
      commandes.setAttribute('role', 'group');
      commandes.setAttribute('aria-label', 'Lecture du protocole O3');
      commandes.innerHTML = '<span>Le protocole en 7 rubriques</span><button type="button" data-o3-deplier>Ouvrir les rubriques</button><button type="button" data-o3-replier>Replier les rubriques</button>';
      article.querySelector('.o3-devis-retro')?.after(commandes);
    }
    if (!controlesCompacts.has(commandes)) {
      controlesCompacts.add(commandes);
      commandes.querySelector('[data-o3-deplier]').addEventListener('click', () => article.querySelectorAll('.o3-lecture-details').forEach(d => { d.open = true; }));
      commandes.querySelector('[data-o3-replier]').addEventListener('click', () => article.querySelectorAll('.o3-lecture-details').forEach(d => { d.open = false; }));
    }
  }

  document.addEventListener('click', event => {
    const lien = event.target.closest?.('a[data-gab-cible]');
    if (!lien) return;
    const salle = lien.closest('#salle');
    const article = salle?.querySelector('#these-methode-o3');
    if (!article) return;
    const cible = Array.from(article.querySelectorAll('[id]')).find(el => el.id === lien.dataset.gabCible);
    if (!cible) return;
    const detail = cible.closest('.methode-rubrique')?.querySelector(':scope > .o3-lecture-details');
    if (detail) detail.open = true;
  }, true);
  addEventListener('o3:contenu-pret', () => compacterO3(document.querySelector('#salle .salle-contenu')));
  function synchroniserGaleries() {
    // Source statique pour la lecture libre, puis copie effectivement affichée dans la salle.
    initialiser(document.querySelector('section.section[data-salle="recherche"]'));
    initialiser(document.querySelector("#salle .salle-contenu"));
    compacterO3(document.querySelector('section.section[data-salle="recherche"]'));
    compacterO3(document.querySelector("#salle .salle-contenu"));
  }
  function installer() {
    synchroniserGaleries();
    const contenuSalle = document.querySelector("#salle .salle-contenu");
    if (contenuSalle) {
      // L'ouverture d'une porte remplace les enfants directs de .salle-contenu.
      // Ne pas observer toute la page et ne modifier aucun autre chapitre.
      new MutationObserver(() => { initialiser(contenuSalle); compacterO3(contenuSalle); })
        .observe(contenuSalle, { childList: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installer, { once: true });
  else installer();
})();
