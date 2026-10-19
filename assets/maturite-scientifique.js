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
      o1.querySelectorAll("p").forEach(p => {
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
        addOnce(o2Collecte, "matTracabiliteO2", mk("mat-sc--o2",
          '<span class="mat-sc__eyebrow">Faisabilité O2 · Éléments déjà opérationnalisés</span>' +
          '<p class="mat-sc__small"><strong>Six champs présents dans le traitement R :</strong> localisation, CLSC, secteur, domaine, millésime et identifiant interne. Ils sont harmonisés ou construits, et non fournis identiquement par toutes les sources ; l’identifiant n’est pas une clé commune native.</p>' +
          '<p class="mat-sc__small"><strong>Traçabilité déjà organisée :</strong> scripts R conservés en texte, inventaire et empreintes des sources, journal des décisions, dédoublonnage, rattachement CLSC, indicateurs et exports QGIS. O1 dispose séparément du suivi PRISMA.</p>' +
          '<p class="mat-sc__small"><strong>Statut :</strong> les cartes présentées sont des exemples de faisabilité, pas des résultats de la thèse. Les analyses prévues seront adaptées aux profils O1 et aux données disponibles.</p>'
        ));
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
