/* Maturité scientifique du protocole. Complément progressif, sans réécrire ni retirer le contenu existant. */
(function () {
  "use strict";
  if ((document.documentElement.lang || "fr").slice(0,2) !== "fr") return;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const mk = (cls, html) => {const e=document.createElement("section");e.className="mat-sc "+cls;e.innerHTML=html;return e;};
  function addOnce(target, key, node, where) {
    if (!target || target.dataset[key] === "oui") return;
    if (where === "before") target.before(node);
    else if (where === "after") target.after(node);
    else if (where === "prepend") target.prepend(node);
    else target.append(node);
    target.dataset[key] = "oui";
  }
  function applique(root) {
    const zones = $$(".these", root);
    if (root.matches && root.matches(".these")) zones.unshift(root);
    zones.forEach(zone => {
      const o1=$("#these-methode-o1",zone),o2=$("#these-methode-o2",zone),o3=$("#these-methode-o3",zone);
      if (!(o1 && o2 && o3)) return;
      // Encadré central dans l'introduction, avant la synthèse vulgarisée.
      const introMethode = zone.querySelector("#rubrique-fr-these-panneau-2 .these-synthese-vulgarisee") ||
        $(".these p", document).find(p => zone.contains(p) &&
          p.textContent.includes("Synthèse vulgarisée") && p.textContent.includes("Nous examinerons"));
      if (introMethode) {
        addOnce(introMethode, "matForceProjet", mk("mat-sc--force", "<span class=\"mat-sc__ampoule\" aria-hidden=\"true\">💡</span><div class=\"mat-sc__force-text\"><span class=\"mat-sc__eyebrow\">Contribution scientifique centrale</span><p class=\"mat-sc__force-phrase\">La force de cette recherche est de confronter, pour des profils documentés de besoins sociaux et sanitaires concomitants, <strong>ce que les territoires rendent potentiellement accessible</strong> et <strong>ce que les équipes SAD mobilisent effectivement</strong> autour des aînés à domicile.</p><p class=\"mat-sc__force-bas\">Leurs convergences et leurs écarts permettront d’examiner les obstacles et les leviers d’une réponse intersectorielle mieux organisée, sans confondre disponibilité, collaboration et aide reçue.</p></div>"), "before");
      } else {
        addOnce(o1, "matForceProjet", mk("mat-sc--force", "<span class=\"mat-sc__ampoule\" aria-hidden=\"true\">💡</span><div class=\"mat-sc__force-text\"><span class=\"mat-sc__eyebrow\">Contribution scientifique centrale</span><p class=\"mat-sc__force-phrase\">La force de cette recherche est de confronter, pour des profils documentés de besoins sociaux et sanitaires concomitants, <strong>ce que les territoires rendent potentiellement accessible</strong> et <strong>ce que les équipes SAD mobilisent effectivement</strong> autour des aînés à domicile.</p><p class=\"mat-sc__force-bas\">Leurs convergences et leurs écarts permettront d’examiner les obstacles et les leviers d’une réponse intersectorielle mieux organisée, sans confondre disponibilité, collaboration et aide reçue.</p></div>"), "before");
      }
      // REVISION_COURTE_O1_O2_20261019 : repères vérifiables, sans toucher aux menus ni aux galeries.
      // Remplace le précédent chiffrage indicatif, sans modifier le nombre de notices.
      const blocCharge = $(".revision-demo--workload .revision-note", zone);
      if (blocCharge && blocCharge.textContent.includes("443–887")) {
        blocCharge.innerHTML = "<strong>Hypothèse rapide : 25–35 s par décision</strong> · <strong>370–517 heures-personnes</strong> pour deux évaluateurs. Repère de rythme : 4 000 notices en deux semaines, soit environ 2 h 45 à 3 h 55 par jour ouvré et par évaluateur. À confirmer par un essai chronométré ; hors textes intégraux, arbitrage et extraction.";
      }
      const ancienneSimulation = "30 à 60 secondes par notice représenteraient 443 à 887 heures-personnes";
      const nouvelleSimulation = "25 à 35 secondes par notice représenteraient environ 370 à 517 heures-personnes";
      zone.querySelectorAll("p").forEach(p => {
        if (p.innerHTML.includes(ancienneSimulation)) {
          p.innerHTML = p.innerHTML.replace(ancienneSimulation, nouvelleSimulation);
        }
      });
      // POPULATION O2 : expliciter les secteurs, sans confondre offre et réponse effective.
      const o2Population = $("#methode-o2-1 .methode-rubrique-contenu", zone);
      addOnce(o2Population, "matSecteursExploratoires", mk("mat-sc--o2 mat-sc--secteurs", `
        <span class="mat-sc__eyebrow">O2 · Population, ressources et sources</span>
        <p class="mat-sc__title" role="heading" aria-level="6">Pourquoi retenir six secteurs de ressources ?</p>
        <p class="mat-sc__lead">Le maintien à domicile peut mobiliser des ressources sanitaires, sociales, collectives et résidentielles. Les <strong>35 types recensés</strong> dans l'exercice exploratoire sont regroupés en six secteurs pour décrire l'offre sans la réduire aux seuls soins.</p>
        <div class="mat-sc__secteurs-grid" aria-label="Les six secteurs analytiques">
          <div><span>01</span><b>Réseau public</b><small>Installations et services du réseau de santé et de services sociaux</small></div>
          <div><span>02</span><b>Première ligne</b><small>Soins et services professionnels de proximité, dont GMF et pharmacies</small></div>
          <div><span>03</span><b>Parapublic</b><small>Services collectifs de mission publique classés hors des autres secteurs</small></div>
          <div><span>04</span><b>Communauté</b><small>Organismes d'aide et de soutien social, notamment répertoriés au 211</small></div>
          <div><span>05</span><b>Municipalité</b><small>Équipements, lieux et services municipaux soutenant la vie quotidienne</small></div>
          <div><span>06</span><b>Habitation</b><small>RPA, hébergement et solutions de logement recensées</small></div>
        </div>
        <p class="mat-sc__small"><strong>Pourquoi cette typologie ?</strong> Un secteur classe le <em>type de ressource</em> ; un domaine classe le <em>besoin susceptible d'être couvert</em>. Un même service peut correspondre à plusieurs domaines. La présence d'une ressource ne prouve ni son admissibilité, ni son utilisation, ni une réponse effective.</p>
        <div class="mat-sc__resultats">
          <strong>Tests préliminaires : ce qui a été démontré</strong>
          <div class="mat-sc__resultats-row"><span><b>01 · Inventorier</b>55 fichiers documentés, dédoublonnage et lieux de service géolocalisés</span><span class="mat-sc__tag mat-sc__tag--rule">Réalisé</span></div>
          <div class="mat-sc__resultats-row"><span><b>02 · Harmoniser</b>Six champs, rattachement spatial aux CLSC et catégories de besoins</span><span class="mat-sc__tag mat-sc__tag--rule">Codé dans R</span></div>
          <div class="mat-sc__resultats-row"><span><b>03 · Comparer</b>Indicateurs calculés et contrastes territoriaux exploratoires visualisés</span><span class="mat-sc__tag mat-sc__tag--rule">Sorties produites</span></div>
        </div>
        <p class="mat-sc__hint">Les essais attestent la <strong>faisabilité technique</strong> sur les sources disponibles, sans constituer des résultats définitifs de thèse ni garantir une couverture uniforme au Québec.</p>
      `));
      // Ces six CHAMPS sont bien produits dans 03_geocodage.R ; les sources ne les fournissent pas tous nativement.
      const o2Collecte = $("#methode-o2-3 .methode-rubrique-contenu", zone);
      if (o2Collecte) {
        const titreCommun = Array.from(o2Collecte.querySelectorAll("h2,h3,h4,h5,h6,p,strong"))
          .find(e => e.textContent.trim() === "Six variables communes pour rapprocher les sources");
        if (titreCommun) titreCommun.textContent = "Six champs harmonisés pour rapprocher les sources";
        addOnce(o2Collecte, "matTracabiliteO2", mk("mat-sc--o2 mat-sc--harmonie", `
          <span class="mat-sc__eyebrow">O2 · Harmonisation et reproductibilité</span>
          <p class="mat-sc__title" role="heading" aria-level="6">Six champs comparables, sans données inventées</p>
          <p class="mat-sc__lead">Les banques ne contiennent pas toutes les mêmes colonnes. Les scripts R rapprochent les informations disponibles par <strong>géocodage, rattachement géographique, recodage et création d’un identifiant interne</strong>. Les observations de départ restent traçables ; aucun besoin individuel n’est créé.</p>
          <div class="mat-sc__exemple" aria-label="Exemple fictif de codage et d'harmonisation">
            <div class="mat-sc__exemple-source">
              <small>01 · Donnée fournie par le répertoire</small>
              <b>Service alimentaire A</b>
              <span>Adresse à Montréal · Catégorie 211 : « Aide alimentaire »</span>
              <em>Exemple fictif, destiné à illustrer la méthode</em>
            </div>
            <div class="mat-sc__exemple-arrow" aria-hidden="true">→</div>
            <div class="mat-sc__exemple-result">
              <small>02 · Résultat du traitement R</small>
              <div><span>CLSC</span><b>Rattaché par localisation</b></div>
              <div><span>Secteur</span><b>Communauté</b></div>
              <div><span>Domaine</span><b>Alimentation</b></div>
              <div><span>Millésime / ID</span><b>Source datée + code interne</b></div>
            </div>
          </div>

          <details class="mat-sc__detail-six" open><summary>Tableau · Les six champs, leur traitement et leur nature</summary>
            <div class="mat-sc__table-wrap"><table class="mat-sc__table"><thead><tr><th>Champ harmonisé</th><th>Traitement réalisé dans R</th><th>Nature</th></tr></thead><tbody>
              <tr><th>Position géographique</th><td>Coordonnées de la source ou géocodage d’une adresse, puis projection commune</td><td>Observée / géocodée</td></tr>
              <tr><th>Territoire de CLSC</th><td>Rattachement spatial du point aux polygones officiels des CLSC</td><td>Dérivé spatialement</td></tr>
              <tr><th>Secteur</th><td>Correspondance du type de service avec le référentiel des six secteurs</td><td>Recodé</td></tr>
              <tr><th>Domaine de besoin</th><td>Correspondances entre catégories du 211, types de services et domaines ; plusieurs domaines possibles</td><td>Codé ; plusieurs domaines possibles</td></tr>
              <tr><th>Millésime</th><td>Année ou date de référence du jeu conservée à l’import</td><td>Métadonnée harmonisée</td></tr>
              <tr><th>Identifiant interne</th><td>Code créé après nettoyage et rapprochement des doublons ; identifiant de source conservé</td><td>Construit ; non stable entre versions</td></tr>
            </tbody></table></div>
          </details>
          
          <div class="mat-sc__verif">
            <div class="mat-sc__verif-stat"><small>Essai · double codage des catégories du 211</small><strong>κ = 0,94</strong><span>Forte concordance corrigée du hasard</span></div>
            <div class="mat-sc__verif-desc"><b>Codage assisté puis contrôlé</b>Les règles de correspondance sont appliquées dans R et deux grilles de codage des catégories du 211 sont comparées. Le coefficient κ de Cohen est calculé ; les désaccords sont consignés pour arbitrage. Cet accord porte sur les <strong>catégories</strong>, pas sur la validité des coordonnées, des doublons ou des prestations.</div>
          </div>
<p class="mat-sc__small"><strong>Traçabilité déjà en place :</strong> scripts R en texte, fichiers sources et empreintes, journal des décisions, contrôles de doublons, rattachement aux CLSC, calculs et exports QGIS ; suivi PRISMA distinct pour O1.</p>
          <p class="mat-sc__small"><strong>Statut des figures :</strong> les cartes actuelles illustrent la faisabilité technique ; les résultats définitifs seront calculés selon les profils O1 et la couverture des sources.</p>
        `));
      }
      // Chapitre 03 : les trois niveaux ne sont pas interchangeables ; pas de lien causal supposé.
      addOnce(o1,"matConcept",mk("mat-sc--concept",
        '<span class="mat-sc__eyebrow">Cadre conceptuel · Chaîne des observations</span>'+
        '<p class="mat-sc__title" role="heading" aria-level="4">Trois niveaux de preuve, une mise en regard</p>'+
        '<div class="mat-sc__levels">'+
        '<div class="mat-sc__level"><small>O1 · Personnes</small><strong>Besoins sociaux concomitants</strong><p>Configurations documentées chez les mêmes personnes dans la littérature. Produit : profils étayés et vignettes, sans estimation de leur fréquence locale.</p></div>'+
        '<div class="mat-sc__level"><small>O2 · Territoires</small><strong>Offre et accessibilité potentielles</strong><p>Ressources localisées, conditions d’accès et indicateurs par CLSC. Produit : atlas des écarts géographiques, non mesure de besoins individuels satisfaits.</p></div>'+
        '<div class="mat-sc__level"><small>O3 · Organisations</small><strong>Mobilisations déclarées</strong><p>Situations SAD admissibles, contacts, partenaires et aides documentées. Produit : réseaux contextualisés, non estimation causale d’efficacité.</p></div>'+
        '</div><p class="mat-sc__bottom"><strong>Règle d’inférence :</strong> les profils orientent les domaines à cartographier et les situations à observer. Les données sont rapprochées dans des tableaux conjoints ; leurs discordances sont explorées en entretien. Une proximité géographique ne prouve ni collaboration ni résolution du besoin.</p>'
      ),"before");
      // O1 : critères à satisfaire AVANT le criblage, sans répéter la procédure JBI/PRISMA-ScR.
      const o1selection=$("#methode-o1-2 .methode-rubrique-contenu",zone);
      addOnce(o1selection,"matO1",mk("mat-sc--o1",
        '<span class="mat-sc__eyebrow">Contrôle documentaire · O1</span><p class="mat-sc__title" role="heading" aria-level="6">Ce qui doit être vérifié avant la sélection définitive</p>'+
        '<div class="mat-sc__cards">'+
        '<div class="mat-sc__card"><span class="mat-sc__number">26 609</span><strong>Notices à examiner</strong><p>Charge à confirmer par essai chronométré sur au moins 100 notices par évaluateur.</p><span class="mat-sc__tag mat-sc__tag--pending">Planification en cours</span></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">2 + 1</span><strong>Évaluateurs et arbitre</strong><p>Deux décisions indépendantes ; arbitrage des désaccords persistants. Même principe pour l’extraction.</p><span class="mat-sc__tag mat-sc__tag--rule">Règle prévue</span></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">+ 2</span><strong>Écart de traçabilité</strong><p>Deux notices à réconcilier entre exports, exclusion temporelle et import Covidence avant le diagramme final.</p><span class="mat-sc__tag mat-sc__tag--pending">Vérification requise</span></div>'+
        '</div><p class="mat-sc__small"><strong>Décision de passage :</strong> protocole et critères validés avec la bibliothécaire et la codirection ; concordance pilote documentée ; charge de sélection et disponibilité des évaluateurs compatibles avec l’échéancier. Sinon, ajuster les ressources ou le calendrier, sans restreindre arbitrairement le corpus.</p>'
      ));
      // Réponse intersectorielle : deux calculs de potentiel ; les interactions réelles relèvent d'O3.
      const o2Analyse = $("#methode-o2-4 .methode-rubrique-contenu", zone);
      // O2 définitif : analyse de co-accessibilité dédiée aux domaines des profils établis en O1.
      addOnce(o2Analyse, "matPotentielIntersectoriel", mk("mat-sc--o2 mat-sc--potentiel", "\n<span class=\"mat-sc__eyebrow\">O2 · Ce que la carte « réponse intersectorielle » mesure réellement</span>\n<p class=\"mat-sc__title\" role=\"heading\" aria-level=\"5\">Un potentiel conjoint santé–social, pas une coordination observée</p>\n<p class=\"mat-sc__lead\">La cartographie montre les <strong>conditions territoriales d'une réponse intersectorielle possible</strong> : plusieurs ressources sont-elles simultanément accessibles pour des domaines de besoins différents ? Elle ne démontre ni leur collaboration ni la réalisation de l'aide.</p>\n<div class=\"mat-sc__potentiel-situation\">\n  <small>Exemple pédagogique fictif · Une personne aînée à domicile</small>\n  <p>Une personne vivant avec un <strong>diabète et une arthrose</strong> a également des difficultés à se nourrir et à se loger. Cette situation n'est <strong>pas</strong> un profil déjà identifié par O1.</p>\n  <div class=\"mat-sc__potentiel-trois\">\n    <div><span aria-hidden=\"true\">✚</span><b>Santé</b><small>GMF ou pharmacie potentiellement accessible</small></div>\n    <div><span aria-hidden=\"true\">◉</span><b>Alimentation</b><small>Organisme d'aide alimentaire recensé</small></div>\n    <div><span aria-hidden=\"true\">⌂</span><b>Logement</b><small>Ressource de soutien au logement recensée</small></div>\n  </div>\n  <div class=\"mat-sc__potentiel-constat\">\n    <p><b>Ce qu'O2 établit :</b> des ressources correspondant à plusieurs domaines sont accessibles selon les seuils retenus.</p>\n    <p><b>Ce qu'O2 n'établit pas :</b> ces organismes se coordonnent, cette personne est admissible ou reçoit effectivement les aides.</p>\n  </div>\n</div>\n<div class=\"mat-sc__potentiel-methods\">\n  <div><strong>08 · Score de co-accessibilité par îlot</strong><p>Compter les domaines sociaux accessibles à <b>500 m / 1 km</b>, seulement si une ressource du domaine santé est aussi accessible depuis l'îlot. Le score couvre jusqu'à 12 domaines sociaux.</p>\n    <div class=\"mat-sc__score-exemple\" aria-label=\"Exemple hypothétique : une ressource de santé accessible, deux domaines sociaux sur douze, score de deux\">\n      <div><strong>1</strong><small>Santé accessible</small></div><span>ET</span>\n      <div><strong>2 / 12</strong><small>Domaines sociaux</small></div><span>→</span>\n      <div><strong>2</strong><small>Score illustratif</small></div>\n    </div>\n    <p class=\"mat-sc__hint\">Si aucune ressource de santé n'est accessible dans la fenêtre considérée, le score est <b>0</b>, même si des ressources sociales existent. Exemple fictif, non résultat observé.</p>\n  </div>\n  <div><strong>05b · Classification santé–social par CLSC et domaine</strong><p>Tester la disponibilité des deux piliers <b>à domicile</b> ou <b>sur place</b>. Pour les ressources sur place, la règle exploratoire considère une accessibilité en 30 minutes de transport collectif pour au moins 80 % des 65 ans et plus, calculée <em>séparément par pilier</em>.</p>\n    <details class=\"mat-sc__classes\"><summary>Les cinq classes produites par le script 05b</summary><div class=\"mat-sc__table-wrap\"><table class=\"mat-sc__table\">\n      <thead><tr><th>Classe</th><th>Interprétation correcte</th></tr></thead><tbody>\n      <tr><th>Conjointe à domicile</th><td>Des services de santé et sociaux susceptibles d'intervenir au domicile couvrent le territoire selon les règles de source.</td></tr>\n      <tr><th>Conjointe sur place</th><td>Les deux piliers satisfont les critères de disponibilité, mais au moins l'un nécessite un déplacement.</td></tr>\n      <tr><th>Santé seule</th><td>Le pilier santé satisfait la règle, mais pas le domaine social étudié.</td></tr>\n      <tr><th>Social seul</th><td>Le domaine social satisfait la règle, mais pas le pilier santé.</td></tr>\n      <tr><th>Aucune</th><td>Ni l'un ni l'autre ne satisfait les critères fixés.</td></tr>\n      </tbody></table></div></details>\n    <p class=\"mat-sc__hint\">« Conjointe » qualifie ici les <b>possibilités de disponibilité</b>, pas les interactions. Des seuils atteints séparément par les deux piliers ne garantissent pas leur accès conjoint pour une même personne.</p>\n  </div>\n</div>\n<div class=\"mat-sc__potentiel-questions\">\n  <div><b>Question scientifique</b><b>Ce que permet l'étude</b></div>\n  <div><span>Plusieurs secteurs accessibles au même endroit ?</span><strong>O2 · Oui, selon les seuils</strong></div>\n  <div><span>Des ressources pour tous les domaines d'un profil O1 ?</span><strong>O2 · À estimer après harmonisation</strong></div>\n  <div><span>Une personne SAD cumule ces besoins ou morbidités ?</span><strong>O2 seul · Non</strong></div>\n  <div><span>Quels partenaires sont réellement sollicités ?</span><strong>O3 · Situations SAD documentées</strong></div>\n</div>\n<div class=\"mat-sc__potentiel-reason\"><span class=\"mat-sc__potentiel-arrow\" aria-hidden=\"true\">O2 → O3</span><p><strong>Pourquoi O3 est nécessaire :</strong> O2 mesure <em>ce qui pourrait être mobilisé</em> ; O3 reconstitue <em>ce qui a été mobilisé</em> pour des situations réelles et explore les raisons des écarts : admissibilité, capacités, connaissance des services, choix des personnes ou pratiques de coordination. Une ressource non sollicitée n'est pas automatiquement une défaillance.</p></div>\n<details class=\"mat-sc__potentiel-sad\"><summary>Faut-il des données SAD individuelles pour réaliser O2 ?</summary><p><strong>Non pour mesurer l'offre potentielle par profil.</strong> O1 fournit les combinaisons documentées dans les études ; les répertoires et le SIG fournissent l'accessibilité des ressources. Des <strong>agrégats SAD autorisés</strong> pourraient, si disponibles avec les dénominateurs adaptés, contextualiser les effectifs et les profils réellement suivis dans chaque CLSC. Leur absence n'empêche pas le calcul du potentiel. Pour affirmer que plusieurs besoins ou comorbidités sont présents chez une même personne, il faut une information conjointe au niveau des personnes et les autorisations pertinentes : cette vérification est prévue dans le repérage encadré des situations O3, pas par croisement écologique de tableaux.</p></details>\n<p class=\"mat-sc__hint\"><strong>Statut :</strong> les cartes actuellement exposées sont des <b>exemples exploratoires</b>. Le protocole définitif associera les domaines des profils établis en O1 aux ressources cartographiées, puis confrontera ces possibilités aux réseaux O3. Une cartographie ne prouve ni la concomitance individuelle ni l'efficacité des services.</p>\n"), "prepend");
      addOnce(o2Analyse, "matProfilsO1O2", mk("mat-sc--o2 mat-sc--profils", "\n<span class=\"mat-sc__eyebrow\">Analyse définitive O2 · Méthode proposée, distincte de l'exercice illustratif</span>\n<p class=\"mat-sc__title\" role=\"heading\" aria-level=\"5\">Comment cartographier des profils associant besoins sociaux et morbidité ?</p>\n<p class=\"mat-sc__lead\">Il ne s'agit pas de localiser les personnes ayant réellement ces combinaisons, mais de <strong>mesurer, sur chaque territoire, la possibilité d'accéder simultanément aux services correspondant aux domaines d'un profil documenté par O1</strong>.</p>\n<div class=\"mat-sc__profil-steps\">\n  <div><small>01 · O1</small><b>Définir les profils admissibles</b><p>Retenir les <strong>besoins sociaux observés ensemble chez les mêmes personnes</strong>, les morbidités ou comorbidités associées lorsqu'elles sont documentées, les études d'appui et leurs incertitudes. Aucun profil n'est présumé.</p></div>\n  <div><small>02 · Harmoniser</small><b>Relier besoins et services</b><p>Associer les besoins aux domaines de la taxonomie du 211 et aux catégories de ressources selon un codebook traçable. Vérifier séparément les ressources du pilier santé pertinentes aux morbidités, seulement si leurs missions sont documentées.</p></div>\n  <div><small>03 · Calcul O2</small><b>Mesurer la couverture conjointe</b><p>Pour chaque îlot : tester l'accès à une ressource sanitaire et à <strong>tous les domaines sociaux du profil</strong>, à 500 m / 1 km, puis en variantes transport et domicile. Agréger au CLSC en distinguant couverture complète, partielle et inconnue.</p></div>\n  <div><small>04 · Intégration O3</small><b>Comparer aux situations SAD</b><p>Confronter, par CLSC et profil, la couverture potentielle aux partenaires sollicités dans les situations réelles. Les entretiens examineront les discordances, sans attribuer automatiquement l'absence de mobilisation à un échec.</p></div>\n</div>\n<div class=\"mat-sc__profil-mesure\">\n  <div><strong>Indicateur principal envisagé</strong><p>Pour un profil donné : accès géographique à une ressource de santé pertinente <strong>ET</strong> à chacun des domaines sociaux constitutifs du profil, selon les informations effectivement disponibles.</p></div>\n  <div><strong>Indicateurs complémentaires</strong><p>Nombre de domaines couverts parmi ceux du profil, domaine(s) manquant(s), part estimée des résidents de 65 ans et plus dans les zones correspondantes, scénarios de mobilité et d'intervention à domicile.</p></div>\n</div>\n<p class=\"mat-sc__hint\"><strong>Morbidité / comorbidité :</strong> O1 documente les associations dans la littérature. O2 cartographie l'offre de soins et services <em>potentiellement pertinente</em> ; sans données cliniques individuelles, elle ne peut ni localiser les personnes ayant ces maladies, ni établir qu'un service est réellement approprié pour chacune. Les critères de pertinence devront être documentés avant le calcul.</p>\n<details class=\"mat-sc__profil-precision\"><summary>Protocole de calcul proposé · Conditions et analyses de sensibilité</summary>\n<p>Pour un îlot <em>i</em> et un profil <em>p</em>, la « couverture complète potentielle » est positive lorsque le pilier santé est accessible selon une règle explicitée et que <strong>tous les domaines sociaux requis par p</strong> disposent d'au moins une ressource accessible selon la même fenêtre géographique. Une couverture partielle est signalée lorsque seuls certains domaines sont accessibles ; l'absence d'information ne sera pas assimilée à une absence de ressource. Les variantes compareront les seuils de déplacement, les réponses à domicile, les capacités mesurées et la sensibilité aux correspondances des catégories. Si O1 ne permet pas d'établir un profil conjoint étayé, l'analyse restera limitée aux domaines séparés et aux combinaisons hypothétiques clairement signalées.</p>\n</details>\n"), "prepend");
      // O2 : statut de chaque source, évite d'attribuer au CLSC des observations produites à une autre échelle.
      const o2lim=$("#methode-o2-6 .methode-rubrique-contenu",zone);
      addOnce(o2lim,"matO2",mk("mat-sc--o2",
        '<span class="mat-sc__eyebrow">Contrôle des inférences · O2</span><p class="mat-sc__title" role="heading" aria-level="6">Trois statuts à ne jamais mélanger dans l’atlas</p>'+
        '<div class="mat-sc__cards">'+
        '<div class="mat-sc__card"><span class="mat-sc__number">01</span><strong>Observé à la maille disponible</strong><p>Répertoires et demandes du 211 rapportés à la géographie publiée, avec période, âge et couverture.</p><span class="mat-sc__tag mat-sc__tag--rule">Analyses descriptives</span></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">02</span><strong>Estimé par hypothèse</strong><p>La répartition des données 211 entre arrondissement et CLSC, figurant dans certains exemples, est une simulation et non une observation au CLSC.</p><span class="mat-sc__tag mat-sc__tag--pending">Illustration seulement</span></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">03</span><strong>Non démontrable ici</strong><p>La distance ne mesure ni la capacité réelle, ni l’admissibilité, ni la prestation reçue, ni la coordination.</p><span class="mat-sc__tag">À documenter séparément</span></div>'+
        '</div><p class="mat-sc__bottom"><strong>Condition de validité :</strong> ne pas utiliser les redistributions exploratoires du 211 comme données CLSC observées dans le protocole final. Conserver les unités de publication, signaler les incompatibilités et contrôler les résultats selon les millésimes, la géolocalisation et les capacités réellement disponibles.</p>'
      ));
      // O3 : décision et preuve du pilote de 4 situations, non promesse de données déjà collectées.
      const o3recrutement=$("#methode-o3-2 .methode-rubrique-contenu",zone);
      addOnce(o3recrutement,"matO3pilote",mk("mat-sc--o3",
        '<span class="mat-sc__eyebrow">Faisabilité vérifiable · O3</span><p class="mat-sc__title" role="heading" aria-level="6">Pilote de quatre situations : la décision avant la collecte principale</p>'+
        '<div class="mat-sc__cards mat-sc__cards--four">'+
        '<div class="mat-sc__card"><span class="mat-sc__number">4</span><strong>Situations pilotes</strong><p>Présence de profils O1 et de situations avec ou sans orientation.</p></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">12 mois</span><strong>Fenêtre de repérage</strong><p>Disponibilité des traces et temps nécessaire pour reconstituer chaque parcours.</p></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">2 relais</span><strong>Borne de collecte</strong><p>Quantifier les parcours complets, ouverts, tronqués ou non documentables.</p></div>'+
        '<div class="mat-sc__card"><span class="mat-sc__number">≥ 80 %</span><strong>Participation visée</strong><p>Cible distincte pour les professionnels SAD ; taux des partenaires rapporté à part.</p></div>'+
        '</div><div class="mat-sc__table-wrap"><table class="mat-sc__table"><thead><tr><th>Vérifier pendant le pilote</th><th>Trace conservée</th><th>Décision à documenter</th></tr></thead><tbody>'+
        '<tr><th>Repérage non sélectif</th><td>Cas admissibles avec et sans orientation, refus et non-repérables.</td><td>Maintenir ou réviser les critères et la stratification.</td></tr>'+
        '<tr><th>Reconstruction des parcours</th><td>Temps par situation ; proportion de parcours exploitables et tronqués.</td><td>Ajuster le nombre de cas ou la profondeur des relais.</td></tr>'+
        '<tr><th>Validation des liens</th><td>Partenaires joignables ; liens déclarés, corroborés, confirmés ou contestés.</td><td>Limiter les indicateurs structurels aux données suffisamment fiables.</td></tr>'+
        '<tr><th>Éthique et accès</th><td>Autorisations, modalités de consentement, possibilités de pseudonymisation.</td><td>Aucune collecte principale sans accords et approbation éthique.</td></tr>'+
        '</tbody></table></div><p class="mat-sc__small">Les seuils de poursuite et les adaptations seront arrêtés avec la codirection après le pilote et consignés avant la collecte principale. Ni les 16 à 24 situations ni les deux CLSC envisagés ne sont présentés comme confirmés.</p>'
      ));

      // Les objectifs conservent leur numéro : seul le calendrier de réalisation est adaptable.
      addOnce(o3, "matOrdreFlexible", mk("mat-sc--flex",
        `<span class="mat-sc__eyebrow">Organisation de l'étude · Calendrier adaptable</span>
        <p class="mat-sc__title" role="heading" aria-level="5">O2 et O3 : ordre flexible, intégration finale commune</p>
        <div class="mat-sc__fleche"><span class="mat-sc__fleche-o1">O1 <b>Profils documentés</b></span><span class="mat-sc__fleche-link" aria-hidden="true">↓</span></div>
        <div class="mat-sc__parallel">
          <div><b>O2 · Cartographie définitive</b><small>Offre et accessibilité potentielles par profil et territoire</small></div>
          <span aria-label="Ordre interchangeable">↔</span>
          <div><b>O3 · Réseaux SAD</b><small>Situations réelles et mobilisations documentées ; CLSC présélectionnés par l'exploration</small></div>
        </div>
        <div class="mat-sc__fleche"><span class="mat-sc__fleche-link" aria-hidden="true">↓</span><span class="mat-sc__fleche-out">Analyse conjointe des résultats définitifs</span></div>
        <p class="mat-sc__small"><strong>Devis :</strong> échantillonnage raisonné à variation maximale pour les CLSC. O2 avant O3, O3 avant O2 ou travaux parallèles selon les autorisations ; les profils O1 doivent être stabilisés avant le repérage des situations O3. Les critères de sélection seront consignés avant recrutement, sans requalification a posteriori.</p>
        `), "before");

      // Recrutement O3 : 2 CLSC dans un territoire par défaut ; 4 dans 2 territoires si faisable.
      addOnce(o3recrutement, "matTerrainsContrastes", mk("mat-sc--terrain",
        `<span class="mat-sc__eyebrow">Choix des terrains · O3</span>
        <p class="mat-sc__title" role="heading" aria-level="6">Deux CLSC contrastés, extension envisageable à quatre</p>
        <div class="mat-sc__terrain-grille">
          <div class="mat-sc__scenario mat-sc__scenario--base">
            <small>SCÉNARIO PRINCIPAL</small><strong>2 <em>CLSC</em></strong>
            <b>1 territoire · 2 CLSC différents</b>
            <p>Deux équipes SAD présentant un contraste maximal admissible dans le même territoire, sous réserve des accès et autorisations.</p>
          </div>
          <div class="mat-sc__scenario mat-sc__scenario--option">
            <small>EXTENSION CONDITIONNELLE</small><strong>4 <em>CLSC</em></strong>
            <b>2 territoires · 2 CLSC par territoire</b>
            <p>Un territoire de la CMM et un territoire en région ; deux CLSC contrastés dans chacun, si partenariats, données et moyens le permettent.</p>
          </div>
        </div>
        <div class="mat-sc__kpis" aria-label="Exercice cartographique exploratoire">
          <div><strong>8</strong><span>CLSC étudiés</span></div>
          <div><strong>7 216</strong><span>lieux de services</span></div>
          <div><strong>35</strong><span>types recensés</span></div>
        </div>
        <p class="mat-sc__hint">Repères issus de l'exercice cartographique exploratoire du CCSMTL ; <strong>pas des résultats définitifs de thèse</strong>.</p>
        <div class="mat-sc__exemple-titre">Tests préliminaires · Contrastes mesurables entre les CLSC</div>
        <p class="mat-sc__hint">Le script 09 compare la part des aînés vivant dans des îlots cumulant un indice élevé de besoins potentiels et une faible accessibilité à 500 m. <strong>Ce sont des écarts écologiques exploratoires, pas des taux de besoins individuels non comblés.</strong></p>
        <p class="mat-sc__exemple-titre mat-sc__exemple-titre--suite">Part des 65 ans et plus dans la classe d’écart bivarié</p>
        <div class="mat-sc__barres" role="img" aria-label="Saint-Paul 36,8 %, Centre-Sud 21,3 %, Verdun 14,7 %, Plateau-Mont-Royal 3,6 %, Centre-Ville 0 %">
          <div><span>Saint-Paul</span><i><u style="width:92%"></u></i><b>36,8 %</b></div>
          <div><span>Centre-Sud</span><i><u style="width:53.25%"></u></i><b>21,3 %</b></div>
          <div><span>Verdun</span><i><u style="width:36.75%"></u></i><b>14,7 %</b></div>
          <div><span>Plateau-Mont-Royal</span><i><u style="width:9%"></u></i><b>3,6 %</b></div>
          <div><span>Centre-Ville</span><i><u style="width:0%"></u></i><b>0 %</b></div>
        </div>
        <p class="mat-sc__hint"><strong>Contrôle des sorties :</strong> <code>09_indice_clsc.csv</code> et <code>09_ecarts_clsc.csv</code> concordent : <strong>172 îlots · 6 913 aînés · 15,9 %</strong> pour l’écart bivarié dans les huit CLSC. Les 150 îlots du script 08 relèvent d’un <em>autre indicateur</em>. Ces résultats exploratoires orientent une présélection raisonnée, sans présumer les CLSC effectivement recrutés.</p>
        <div class="mat-sc__quebec"><strong>166 territoires de CLSC · Québec</strong><span>Le script national permet déjà d'étudier certains indicateurs de santé et d'habitation à cette échelle. L'extension à une région hors CMM nécessitera des sources comparables : répertoires sociaux et couverture du 211 non uniformes. La couverture complète des six secteurs n'est pas présumée.</span></div>
      `), "prepend");

      // Volet qualitatif : une décision concertée traçable au-delà des entretiens explicatifs.
      const o3qual=$("#methode-o3-6 .methode-rubrique-contenu",zone);
      addOnce(o3qual,"matO3qual",mk("mat-sc--o3",
        '<span class="mat-sc__eyebrow">Intégration et recommandations · Proposition à valider</span><p class="mat-sc__title" role="heading" aria-level="6">Des résultats triangulés à une délibération documentée</p>'+
        '<div class="mat-sc__steps">'+
        '<div class="mat-sc__step"><b>01 · Préparer</b>Tableau conjoint profils O1, offre O2, liens et trajectoires O3 ; indiquer inconnues et discordances.</div>'+
        '<div class="mat-sc__step"><b>02 · Confronter</b>Soumettre des propositions à des professionnels SAD, partenaires, gestionnaires et personnes partenaires.</div>'+
        '<div class="mat-sc__step"><b>03 · Délibérer</b>Discuter faisabilité, acceptabilité et priorités ; consigner désaccords et intérêts divergents.</div>'+
        '<div class="mat-sc__step"><b>04 · Restituer</b>Rédiger une matrice proposition → justification → conditions → limites ; solliciter une validation des comptes rendus.</div>'+
        '</div>'+
        '<details><summary>Voir le protocole délibératif envisagé</summary>'+
        '<p><strong>Format proposé, non approuvé :</strong> 8 à 10 personnes recrutées par diversité des secteurs et des positions ; rencontre de 90 à 180 minutes, animée avec des règles d’équité de parole. Enregistrement et consentement seulement si autorisés. Analyse thématique des propositions, désaccords et conditions de mise en œuvre, avec traçabilité des décisions et retour aux participants. Les recommandations devront être distinguées des résultats empiriques et ne seront pas présentées comme des effets démontrés. La composition, les outils et le calendrier restent à discuter avec la codirection et les partenaires patients.</p>'+
        '</details><div class="mat-sc__status"><span class="mat-sc__tag mat-sc__tag--pending">Statut : option méthodologique à valider</span><span class="mat-sc__tag mat-sc__tag--rule">Produit : recommandations contextualisées et traçables</span></div>'
      ));
    });
  }
  function actualiser(){applique(document);}
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",actualiser,{once:true});
  else actualiser();
  const contenu=$("#contenu");
  if (contenu) new MutationObserver(actualiser).observe(contenu,{childList:true});
  addEventListener("hashchange", actualiser, {passive:true});
})();

/* FAISABILITE_QUATRE_DECISIONS_20261019. Enrichissement scientifique limité au chapitre 4. */
(function () {
  "use strict";
  if ((document.documentElement.lang || "fr").slice(0,2)!=="fr") return;
  const bloc="\n<div class=\"f-valid-head\">\n<span class=\"f-valid-eyebrow\">Faisabilité · Vérifications de passage</span>\n<h4 id=\"f-valid-title\">Quatre contrôles avant les analyses définitives</h4>\n<p>Les outils et premiers essais sont déjà documentés. Ces contrôles précisent les décisions encore à prendre.</p>\n</div>\n<div class=\"f-valid-grid\">\n<article class=\"f-valid-card\" data-o=\"o1\"><span class=\"f-valid-code\">01 · O1</span><h5>Profils appuyés sur des données conjointes</h5><p><b>Contrôle :</b> besoins observés chez les mêmes personnes, morbidités rapportées, populations, sources et incertitudes.</p><p><b>Décision :</b> profil étayé pour O2/O3, sinon synthèse des domaines séparés.</p></article>\n<article class=\"f-valid-card\" data-o=\"o2\"><span class=\"f-valid-code\">02 · O2</span><h5>Correspondance besoins et services</h5><p><b>Contrôle :</b> grille O1 → domaines 211 → ressources ; missions, conditions d'accès et pertinence du volet santé selon les morbidités.</p><p><b>Décision :</b> justifier les correspondances ; signaler les catégories ambiguës ou inconnues, sans présumer une prise en charge.</p></article>\n<article class=\"f-valid-card\" data-o=\"o3\"><span class=\"f-valid-code\">03 · O3</span><h5>Pilote de quatre situations réelles</h5><p><b>Contrôle :</b> situations avec et sans orientation, durée, données manquantes, partenaires joignables et liens vérifiables.</p><p><b>Décision :</b> maintenir ou ajuster le nombre de profils, de situations et la profondeur du réseau après les autorisations.</p></article>\n<article class=\"f-valid-card\" data-o=\"qa\"><span class=\"f-valid-code\">04 · R / QGIS</span><h5>Alignement des calculs et du protocole</h5><p><b>Contrôle :</b> scripts, sources, millésimes, unités, seuils, indices, permutations, imputations et sorties.</p><p><b>Décision :</b> figer les paramètres définitifs dans le journal ; distinguer les exemples exploratoires.</p></article>\n</div>\n<p class=\"f-valid-foot\"><strong>Calendrier :</strong> les contrastes cartographiques exploratoires permettent déjà de présélectionner les CLSC. O2 et O3 peuvent avancer dans un ordre flexible ; O3 nécessite les profils O1 stabilisés, les accords et l'approbation éthique.</p>\n<p class=\"f-valid-refs\">Références méthodologiques : <a href=\"https://jbi-global.atlassian.net/wiki/spaces/MANUAL/pages/2051473426/10.2.9.2%2BPiloting%2Bthe%2Bdata%2Bextraction\" rel=\"noopener noreferrer\" target=\"_blank\">JBI Manual</a> et <a href=\"https://pmc.ncbi.nlm.nih.gov/articles/PMC4595218/\" rel=\"noopener noreferrer\" target=\"_blank\">RECORD (Benchimol et al., 2015)</a>.</p>";
  function appliquerFaisabilite() {
    const chapitre=document.querySelector("#rubrique-fr-these-panneau-3 .f-faisa");
    if(!chapitre) return;
    if(!chapitre.querySelector("#f-validation-preuves")) {
      const repere=chapitre.querySelector(".f-synthese")||chapitre.querySelector(".f-chapeau");
      if(repere) {
        const section=document.createElement("section");
        section.id="f-validation-preuves";
        section.className="f-valid";
        section.setAttribute("aria-labelledby","f-valid-title");
        section.innerHTML=bloc;
        repere.insertAdjacentElement("afterend",section);
      }
    }
    const corrections=[
      ["choisis selon les résultats définitifs d’O2 et la faisabilité","présélectionnés à partir des contrastes cartographiques exploratoires, puis retenus selon la faisabilité et les autorisations"],
      ["le choix des CLSC d’O3 dépendra des contrastes établis en O2","la présélection des CLSC d’O3 pourra s’appuyer sur les contrastes exploratoires déjà documentés"],
      ["L’ordre prévisionnel suit le devis : O1 définit les profils documentés, O2 propose des territoires contrastés et O3 repère des situations réelles","L’ordre d’O2 et d’O3 peut être adapté : les profils O1 guident les situations, le mapping exploratoire présélectionne les terrains et O3 repère des situations réelles"]
    ];
    chapitre.querySelectorAll("p").forEach(p=>{
      for(const [avant,apres] of corrections) {
        if(p.innerHTML.includes(avant)) p.innerHTML=p.innerHTML.replace(avant,apres);
      }
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",appliquerFaisabilite,{once:true});
  else appliquerFaisabilite();
  window.addEventListener("hashchange",appliquerFaisabilite,{passive:true});
})();
