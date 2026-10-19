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
      // Ces six CHAMPS sont bien produits dans 03_geocodage.R ; les sources ne les fournissent pas tous nativement.
      const o2Collecte = $("#methode-o2-3 .methode-rubrique-contenu", zone);
      if (o2Collecte) {
        const titreCommun = Array.from(o2Collecte.querySelectorAll("h2,h3,h4,h5,h6,p,strong"))
          .find(e => e.textContent.trim() === "Six variables communes pour rapprocher les sources");
        if (titreCommun) titreCommun.textContent = "Six champs harmonisés pour rapprocher les sources";
        addOnce(o2Collecte, "matTracabiliteO2", mk("mat-sc--o2 mat-sc--harmonie", `
          <span class="mat-sc__eyebrow">O2 · Harmonisation et reproductibilité</span>
          <p class="mat-sc__title" role="heading" aria-level="6">Six champs comparables, sans données inventées</p>
          <p class="mat-sc__small">Localisation, CLSC, secteur, domaine, millésime et identifiant interne : ils sont <strong>observés, recodés ou dérivés</strong> à partir des sources. Ils ne constituent pas six colonnes identiques dans chaque répertoire.</p>
          <details class="mat-sc__detail-six"><summary>Tableau · Comment sont obtenus les six champs</summary>
            <div class="mat-sc__table-wrap"><table class="mat-sc__table"><thead><tr><th>Champ harmonisé</th><th>Traitement réalisé dans R</th><th>Nature</th></tr></thead><tbody>
              <tr><th>Position géographique</th><td>Coordonnées de source ou géocodage d'une adresse</td><td>Observée / géocodée</td></tr>
              <tr><th>Territoire de CLSC</th><td>Position rapprochée des contours officiels</td><td>Dérivé spatialement</td></tr>
              <tr><th>Secteur</th><td>Type de service rapproché des six secteurs</td><td>Recodé</td></tr>
              <tr><th>Domaine de besoin</th><td>Catégories 211 ou types de service rapprochés d'une nomenclature</td><td>Codé ; plusieurs domaines possibles</td></tr>
              <tr><th>Millésime</th><td>Date de référence du fichier conservée pour chaque source</td><td>Métadonnée harmonisée</td></tr>
              <tr><th>Identifiant interne</th><td>Code créé après nettoyage et dédoublonnage ; identifiant de source conservé</td><td>Construit ; non stable entre versions</td></tr>
            </tbody></table></div>
          </details>
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
        <div class="mat-sc__exemple-titre">Contrastes exploratoires · Part des 65 ans et plus dans la classe d'écart bivarié</div>
        <div class="mat-sc__barres" role="img" aria-label="Saint-Paul 36,8 %, Centre-Sud 21,3 %, Verdun 14,7 %, Plateau-Mont-Royal 3,6 %, Centre-Ville 0 %">
          <div><span>Saint-Paul</span><i><u style="width:92%"></u></i><b>36,8 %</b></div>
          <div><span>Centre-Sud</span><i><u style="width:53.25%"></u></i><b>21,3 %</b></div>
          <div><span>Verdun</span><i><u style="width:36.75%"></u></i><b>14,7 %</b></div>
          <div><span>Plateau-Mont-Royal</span><i><u style="width:9%"></u></i><b>3,6 %</b></div>
          <div><span>Centre-Ville</span><i><u style="width:0%"></u></i><b>0 %</b></div>
        </div>
        <p class="mat-sc__hint">Source : <code>09_indice_clsc.csv</code> (exemple bivarié). Ces valeurs appuient une <strong>présélection</strong>, pas la désignation automatique des CLSC recrutés. Le contraste sera évalué avec les profils O1, les autres indicateurs disponibles et la faisabilité du terrain.</p>
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
