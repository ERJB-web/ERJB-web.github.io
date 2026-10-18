"use strict";

const ORCID = "https://orcid.org/0009-0001-4236-4932";
const AFFICHE = "https://erjb-web.github.io/affiche-releve/";
const COURRIEL = "eric.bernier.1@umontreal.ca";
const FRQ_DOI = "https://doi.org/10.69777/2009461";
const ANAP_SAD = "https://anap.fr/s/article/reforme-services-autonomie-a-domicile";
const ANAP_CRT = "https://www.anap.fr/s/article/centre-ressources-territorial-crt-ambition-nouvelle";
const CRCHUM_SOURIAL = "https://www.chumontreal.qc.ca/crchum/chercheurs/nadia-sourial";
const CRCHUM_LAYANI = "https://www.chumontreal.qc.ca/crchum/chercheurs/geraldine-layani";

// Langues complètes (hreflang) puis versions abrégées : inuktitut, innu-aimun, facile à lire.
const LANGUES = [
  { code: "fr", libelle: "FR", nom: "Français", dossier: "", hreflang: "fr", drapeau: "fr", voix: "fr-FR" },
  { code: "en", libelle: "EN", nom: "English", dossier: "en/", hreflang: "en", drapeau: "gb", voix: "en-CA" },
  { code: "es", libelle: "ES", nom: "Español", dossier: "es/", hreflang: "es", drapeau: "es", voix: "es-ES" },
  { code: "zh", libelle: "中文", nom: "中文（简体）", dossier: "zh/", hreflang: "zh-Hans", drapeau: "cn", voix: "zh-CN" },
  { code: "ar", libelle: "عربي", nom: "العربية", dossier: "ar/", hreflang: "ar", drapeau: "ar", voix: "ar", dir: "rtl" },
  { code: "ru", libelle: "RU", nom: "Русский", dossier: "ru/", hreflang: "ru", drapeau: "ru", voix: "ru-RU" },
  { code: "iu", libelle: "ᐃᓄ", nom: "ᐃᓄᒃᑎᑐᑦ · Inuktitut", dossier: "iu/", drapeau: "iu", abregee: true },
  { code: "moe", libelle: "Innu", nom: "Innu-aimun", dossier: "innu/", drapeau: "innu", abregee: true },
  { code: "falc", libelle: "FALC", nom: "Facile à lire (FALC)", dossier: "falc/", drapeau: "falc", abregee: true },
];

const TITRES_ORIGINAUX = {
  gfsp: "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
  cahspr: "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec",
  epistemic: "Epistemic return in public health governance: The road back from health to science",
  hospit: "Patient experience and potentially avoidable hospitalisations across OECD countries: exploratory ecological study",
  pl2: "Prise de parole des médecins dans l’espace public québécois lors des débats entourant le projet de loi n° 2 : une analyse qualitative du discours critique",
  droit: "Vieillir chez soi à l’épreuve du droit : l’effectivité du choix du lieu de vie en droit français et en droit québécois",
  memoireDroit: "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec",
  memoireGestion: "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?",
  memoireEduc: "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement",
};
const AUTEURS = {
  trio: "Bernier, É., Sourial, N., Layani, G.",
  hospit: "Éric Bernier (LL.M, PhD student), Nadia Sourial (PhD), Isabelle Vedel (PhD), Géraldine Layani (MD, M.Sc), Aurélien Algoet (MD), Matthieu Calafiore (MD, PhD)",
  pl2: "Bernier, É., Aïssi, F., Diene Faye, C., Boukari Abdo, S.",
};

/* ---------------------------------------------------------------- Français */
const fr = {
  lang: "fr",
  locale: "fr_FR",
  chemin: "",
  meta: {
    titre: "Éric Bernier",
    description:
      "Éric Bernier, doctorant en santé publique (systèmes, organisations et politiques de santé) à l’ESPUM, juriste, entrepreneur et éducateur spécialisé. Recherche sur la réponse intersectorielle aux besoins sociaux complexes en soins primaires.",
  },
  ui: {
    evitement: "Aller au contenu",
    sousTitre: "Santé publique · Gouvernance · Gestion · Droit · Intervention sociale et intersectorialité",
    navigation: "Navigation principale",
    langue: "Langue",
    entrer: "Entrer",
    cv: "CV",
    hall: "Revenir au hall",
    suivante: "Porte suivante",
    contact: "Me contacter",
    haut: "Haut de page",
    acces: "Accessibilité",
    daltonisme: "Daltonisme",
    basseVision: "Basse vision",
    contraste: "Contraste élevé",
    taille: "Taille du texte",
    plus: "Agrandir le texte",
    moins: "Réduire le texte",
    ecouter: "Écouter",
    ecouterPage: "Écouter la page",
    arreter: "Arrêter la lecture",
    sansVoix: "Votre appareil n’a pas de voix pour cette langue.",
    falc: "Version facile à lire (FALC)",
    afficheAlt: "Aperçu de l’affiche du projet de thèse, 120 × 120 cm",
    autresLangues: "Autres langues",
  },
  nav: [
    [
      "recherche",
      "Recherche"
    ],
    [
      "conceptualisation",
      "Conceptualisation"
    ],
    [
      "approche",
      "Posture de recherche"
    ],
    ["methodes", "Méthodes de recherche"],
    [
      "valeurs",
      "Valeurs"
    ],
    [
      "implantation",
      "Implantation"
    ],
    [
      "ressources",
      "Ressources"
    ],
    [
      "publications",
      "Publications"
    ],
    [
      "biographie",
      "Biographie"
    ],
    [
      "parcours",
      "Parcours"
    ],
    [
      "engagements",
      "Engagements"
    ],
    [
      "contact",
      "Contact"
    ]
  ],
  accueil: {
    surtitre: "Doctorant en santé publique · ESPUM · CRCHUM",
    roles: "Doctorant en santé publique (2e année) · Juriste · Entrepreneur · Éducateur spécialisé",
    chapeau: {
      "titre": "Des personnes aux politiques : une lecture intégrée des systèmes de santé",
      "paragraphes": [
        "De l’accompagnement des personnes à la recherche en santé publique, mon parcours m’a conduit à explorer les différentes échelles du système de santé : des réalités individuelles aux organisations, jusqu’aux politiques publiques et à la gouvernance.",
        "Ces expériences, à la croisée du terrain, de la gestion, du droit et de la recherche, ont nourri une conviction : **transformer les systèmes de santé suppose de faire dialoguer les expériences humaines, les savoirs scientifiques, les dynamiques collectives et les choix politiques.**",
        "Mon ambition est d’**ouvrir des portes entre ces univers qui se côtoient sans toujours se comprendre**, de décloisonner les perspectives et de rapprocher la recherche de l’action, pour favoriser l’autodétermination, éclairer les décisions collectives et contribuer à une société plus juste et en meilleure santé."
      ]
    },
    encadrement:
      "Thèse de doctorat en cours de conceptualisation, codirigée par les Dres Nadia Sourial, Ph. D., et Géraldine Layani, M.D. · Chaire de recherche GSK en gestion optimale des maladies chroniques · CRCHUM · Boursier FRQ (B2)",
    visite: "Commencer la visite",
    explorer: "Explorer librement",
    portrait: "Portrait d’Éric Bernier",
  },
  hall: {
    "titre": "Le hall",
    "compte": "10 portes",
    "consigne": "Cliquez sur une porte pour entrer",
    "portes": {
      "recherche": [
        "Ma thèse",
        "Projet de doctorat"
      ],
      "conceptualisation": [
        "Conceptualisation",
        "Recherche en cours : corpus et lacunes"
      ],
      "approche": [
        "Posture de recherche",
        "Posture pragmatique et regard pluridisciplinaire"
      ],
      "methodes": ["Méthodes de recherche","Analyses, outils et références méthodologiques"],
      "valeurs": [
        "Valeurs",
        "Ce qui guide ma pratique"
      ],
      "implantation": [
        "Implantation",
        "Transfert de connaissances et implantation"
      ],
      "ressources": [
        "Ressources",
        "Articles, capsules, balados"
      ],
      "publications": [
        "Publications",
        "Communications, mémoires, outils"
      ],
      "biographie": [
        "Biographie",
        "Des expériences humaines aux transformations collectives"
      ],
      "parcours": [
        "Le parcours",
        "Formations et expériences"
      ],
      "engagements": [
        "Engagements",
        "Représentation, recherche, distinctions, loisirs"
      ]
    }
  },
  recherche: {
    surtitre: "01 · La recherche",
    etiquette: "Thèse de doctorat en cours",
    avertissement: "Sujet en cours de construction et susceptible d’évoluer",
    titre: "Organiser la réponse intersectorielle aux besoins sociaux complexes et co-occurrents en soins primaires",
    sousTitre: "Configuration des réseaux adaptés aux différents profils de patients pris en charge",
    question:
      "Comment s’organise la réponse intersectorielle aux différents profils de patients ayant des besoins sociaux complexes et co-occurrents pris en charge en soins primaires ?",
    but: "Le projet vise à relier chaque profil de besoins à une configuration de partenaires et à son coordonnateur, à l’échelle d’un territoire de CLSC.",
    faits: [
      ["Programme", "Doctorat en santé publique, option systèmes, organisations et politiques de santé (SOPS) · 2e année"],
      ["Établissement", "École de santé publique de l’Université de Montréal (ESPUM)"],
      ["Chaire", "Chaire de recherche GSK en gestion optimale des maladies chroniques"],
      ["Centre de recherche", "Centre de recherche du CHUM (CRCHUM) · stagiaire de recherche"],
      ["Financement", "Fonds de recherche du Québec, bourse de doctorat (B2)"],
    ],
    codirection: {
      titre: "Codirection",
      profil: "Profil CRCHUM",
      personnes: [
        { nom: "Dre Nadia Sourial", grade: "Ph. D.", lignes: ["Professeure agrégée, Département de gestion, d’évaluation et de politique de santé, École de santé publique, Université de Montréal", "Chercheuse régulière au CRCHUM, Carrefour de l’innovation"], chaire: "Cotitulaire de la Chaire de recherche GSK en gestion optimale des maladies chroniques", lien: CRCHUM_SOURIAL },
        { nom: "Dre Géraldine Layani", grade: "M.D., M. Sc.", lignes: ["Médecin de famille, GMF-U Notre-Dame, Montréal", "Professeure adjointe de clinique, Département de médecine de famille et de médecine d’urgence, Université de Montréal", "Chercheuse régulière au CRCHUM, Carrefour de l’innovation"], chaire: "Cotitulaire de la Chaire de recherche GSK en gestion optimale des maladies chroniques", lien: CRCHUM_LAYANI },
      ],
    },
    affiche: ["Voir l’affiche du projet", "Version accessible : 5 langues, FALC, daltonisme, basse vision, écoute", AFFICHE],
    table: {
      titre: "Table d’exploration",
      detail: "Le devis en quatre étapes",
      etapes: [
        ["Objectif 1", "Quels profils ?", "Une revue de portée", "À partir des études publiées, dégager les profils de besoins sociaux récurrents, puis les transformer en quatre à six vignettes : des situations fictives validées.", ["Revue de portée", "Vignettes"]],
        ["Objectif 2", "Qui mobiliser ?", "Le réseau égocentré du CLSC", "Pour chaque vignette, le CLSC est au centre : on repère les partenaires qu’il mobiliserait et les liens entre ces partenaires. On obtient une configuration par profil.", ["Analyse de réseaux", "Réseau égocentré"]],
        ["Objectif 2", "Pourquoi ces choix ?", "Des entretiens sur la carte du réseau", "Les entretiens s’appuient sur la carte de chaque réseau pour expliquer les choix observés, par exemple : pourquoi ces partenaires sont-ils peu reliés ?", ["Entretiens", "Méthodes mixtes"]],
        ["Objectif 3", "Que recommander ?", "Un atelier délibératif", "Patients partenaires et acteurs des soins primaires, du communautaire, de la gouvernance locale, du municipal et du privé formulent des recommandations pour chaque profil.", ["Délibération", "Patients partenaires"]],
      ],
      terminus: "Le tout s’intègre dans un tableau conjoint : une ligne par profil, avec le réseau, les explications et les recommandations.",
    },
    notions: {
      titre: "Trois notions",
      items: [
        ["La co-occurrence", "La présence d’au moins deux besoins sociaux en même temps. Elle se compte : c’est le critère d’inclusion.", "Kreuter et al., 2021"],
        ["La complexité", "Le cumul de maladies chroniques, d’incapacités, de problèmes de santé mentale et de vulnérabilité sociale. Elle se décrit, sans être exigée.", "Kuluski et al., 2017"],
        ["La réponse intersectorielle", "Les actions d’autres secteurs que la santé, menées avec elle : CLSC, GMF, hôpital, pharmacies, organismes communautaires, municipalité, écoles, CPE. Elle s’organise sur un territoire.", "Leppo et al., 2013 ; MSSS, 2017"],
      ],
    },
    retombees: {
      titre: "Retombées attendues",
      items: [
        ["Pour les personnes", "une réponse ajustée à leur combinaison de besoins."],
        ["Pour le CLSC et ses partenaires", "des repères sur qui mobiliser, comment se relier et qui coordonne."],
        ["Pour la politique de première ligne", "un état de départ et des recommandations selon les rôles du CLSC."],
        ["Pour la recherche", "une hypothèse qui relie le profil de besoins au réseau."],
      ],
    },
    travaux: {
      titre: "Manuscrits soumis et en préparation",
      intro: "Articles soumis ou en cours de rédaction, parallèlement à la thèse.",
      items: [
        { domaine: "Systèmes de santé et soins primaires", statut: "Soumis à BJGP Open", titre: TITRES_ORIGINAUX.hospit, auteurs: AUTEURS.hospit },
        {
          domaine: "Épistémologie et transfert de connaissances",
          statut: "En construction · En attente de collaboration",
          titre: TITRES_ORIGINAUX.epistemic,
          auteurs: "Bernier, É.",
          resume:
            "L’impact de la recherche est d’ordinaire pensé dans un seul sens, de la connaissance vers les politiques et les pratiques. L’article propose une santé publique conçue comme science réflexive de la gouvernance : il précise à quelles conditions les conséquences observées sur le terrain et les savoirs des populations concernées peuvent exiger que l’on réexamine les catégories, les indicateurs et les règles en amont. Le concept se traduit en un audit documentaire, mis à l’essai sur quatre chaînes institutionnelles.",
          etiquettes: ["Retour épistémique", "Gouvernance réflexive", "Impact de la recherche"],
        },
        { domaine: "Gouvernance et espace public", statut: "Manuscrit en préparation", titre: TITRES_ORIGINAUX.pl2, auteurs: AUTEURS.pl2 },
        { domaine: "Droit de la santé", statut: "Manuscrit en préparation", titre: TITRES_ORIGINAUX.droit, auteurs: "Bernier, É. · article de doctrine" },
      ],
    },
  },
  conceptualisation: {
    "surtitre": "Recherche en cours",
    "titre": "Conceptualiser le projet de recherche",
    "intro": "Je suis à l’étape de la conceptualisation : un corpus de publications priorisées, les lacunes qu’il fait apparaître et les lectures de formation qui l’appuient.",
    "chiffres": [
      [
        222,
        "publications retenues"
      ],
      [
        39,
        "lectures prioritaires"
      ],
      [
        83,
        "lectures importantes"
      ],
      [
        9,
        "dimensions de lacunes examinées"
      ]
    ],
    "prioritesTitre": "Répartition par priorité",
    "prioriteLibelle": "Priorité",
    "provenanceTitre": "Provenance des publications",
    "provenance": [
      [
        "PubMed",
        112
      ],
      [
        "Embase et MEDLINE (Ovid)",
        95
      ],
      [
        "Cairn",
        15
      ]
    ],
    "lacunesTitre": "Ce que la littérature laisse ouvert",
    "lacunesIntro": "Pour chacune des neuf dimensions examinées, le tableau indique l’état de la littérature, l’importance de la lacune et quelques repères bibliographiques.",
    "lacunes": [
      {
        "dimension": "Conceptualisation",
        "etat": "Présente mais non stabilisée",
        "niveau": "Importante",
        "score": 3,
        "constat": "Les études indexées dans PubMed distinguent de plus en plus le risque social, le besoin social et le désir d’assistance. Les travaux francophones de Cairn y ajoutent un vocabulaire de la précarité et de la vulnérabilité sociale, souvent multidimensionnel, mais conceptuellement plus large que le besoin non satisfait.",
        "reperes": "Gruß 2021; Tucher 2026; Tudrej 2019; Karran 2023"
      },
      {
        "dimension": "Mesure",
        "etat": "Abondante mais hétérogène",
        "niveau": "Importante",
        "score": 3,
        "constat": "Les outils diffèrent fortement par leurs domaines, leurs seuils et leur mode d’administration. Les scores multidimensionnels de précarité repérés dans Cairn, comme EPICES et PRECAR, ne sont pas équivalents aux questionnaires de besoins sociaux non satisfaits.",
        "reperes": "Zein 2026; Karran 2023; Tudrej 2019; Rogers 2025"
      },
      {
        "dimension": "Caractérisation / prévalence",
        "etat": "Bien documentée pour au moins un besoin",
        "niveau": "Modérée",
        "score": 2,
        "constat": "De nombreuses études décrivent la prévalence par domaine et la charge cumulative des besoins, mais les estimations se comparent difficilement lorsque la définition du besoin et l’outil diffèrent.",
        "reperes": "Jih 2023; Bleacher 2020; Fiori 2021"
      },
      {
        "dimension": "Multiplicité / concomitance",
        "etat": "Émergente mais désormais démontrée",
        "niveau": "Importante",
        "score": 3,
        "constat": "La coexistence de plusieurs besoins ou risques sociaux est fréquente, et des grappes, des classes et des mesures de charge cumulative ont été proposées. Une étude récente montre en outre que la multiplicité des risques augmente fortement la probabilité de souhaiter une aide.",
        "reperes": "Vest 2025; Kreuter 2021; Zeng 2024; Tucher 2026"
      },
      {
        "dimension": "Priorisation par les patients",
        "etat": "Quelques études directes, mais champ encore peu développé",
        "niveau": "Majeure",
        "score": 4,
        "constat": "La littérature mesure surtout le désir d’aide, les objectifs négociés, l’acceptabilité ou la priorité relative, et les travaux récents renforcent la distinction entre risque détecté et aide souhaitée. Les travaux e-CARE montrent un accompagnement ajusté au rythme et aux priorités du patient, sans produire de hiérarchie standardisée des besoins.",
        "reperes": "O’Loughlin 2022; Gruß 2021; Tucher 2026; Vasan 2026; Ouanhnon 2022"
      },
      {
        "dimension": "Interrelations entre besoins",
        "etat": "Principalement décrites comme cooccurrence ou complexité globale",
        "niveau": "Majeure",
        "score": 4,
        "constat": "Les analyses quantitatives documentent surtout la cooccurrence des besoins et des profils. Les travaux qualitatifs francophones de Cairn décrivent l’imbrication des difficultés sociales, administratives, économiques et de santé, mais rarement leur direction, leur séquence ou leur mécanisme causal.",
        "reperes": "Vest 2025; Kreuter 2021; Marron-Delabre 2015; Ouanhnon 2022"
      },
      {
        "dimension": "Résolution / trajectoire",
        "etat": "Croissante mais dominée par des indicateurs intermédiaires",
        "niveau": "Majeure",
        "score": 4,
        "constat": "Le champ distingue de plus en plus le dépistage, la référence, la connexion, la ressource reçue et la résolution. Les travaux francophones e-CARE suivent aussi des résultats concrets, comme l’ouverture de droits, l’accès à un médecin traitant, le logement et l’autonomie dans le parcours, mais sans mesure standardisée de la résolution de chaque besoin.",
        "reperes": "Steeves-Reece 2022; Hausmann 2024; Ouanhnon 2022; Agarwal 2025"
      },
      {
        "dimension": "Réseaux / réponse intersectorielle",
        "etat": "Littérature substantielle mais souvent séparée des données patient",
        "niveau": "Majeure pour l’intégration",
        "score": 4,
        "constat": "PubMed documente la navigation, les agents de santé communautaire, les partenariats médico-juridiques et les boucles de référence fermées, et Cairn les unités sociales en médecine générale, les MSP, les CPTS, les DAC et la coordination territoriale. La configuration du réseau est toutefois rarement reliée aux profils de besoins et à leur résolution.",
        "reperes": "Hogg-Graham 2021; Tevaearai 2022; Yatim & Sebai 2021; Lessi 2023; Ouanhnon 2022"
      },
      {
        "dimension": "Synthèse intégrée",
        "etat": "Articulation à préciser chez les aînés suivis en SAD",
        "niveau": "Lacune principale",
        "score": 5,
        "constat": "La lacune porte sur l’articulation, chez les personnes aînées vivant à domicile et présentant une ou plusieurs morbidités, entre les profils de besoins sociaux concomitants (satisfaits ou non), les ressources mobilisables et les collaborations réellement organisées autour des équipes SAD. Il s’agit de préciser quelles réponses intersectorielles correspondent à quelles combinaisons de besoins, et où ces réponses demeurent incomplètes.",
        "reperes": "Karran 2023; Vest 2025; Chang 2026; Tudrej 2019; Ouanhnon 2022"
      }
    ],
    "principaleTitre": "La lacune principale",
    "principale": "Les recherches documentent les profils de besoins, les ressources disponibles et certaines formes d’intégration des services. Leur articulation reste toutefois insuffisamment décrite chez les personnes aînées vivant à domicile et présentant une ou plusieurs morbidités : quelles configurations de besoins sociaux concomitants appellent quels acteurs, quelles collaborations et quelles modalités de coordination, et où la réponse demeure-t-elle incomplète ? La lacune porte sur l’adéquation entre besoins et organisation effective des réponses intersectorielles, non sur la seule délimitation géographique de l’étude.",
    "vigilance": "Par rigueur méthodologique, la formulation retenue est « aucune synthèse identifiée dans les recherches PubMed et Cairn réalisées » et non « aucune synthèse n’existe ».",
    "p5Titre": "Les 39 lectures prioritaires",
    "p4Titre": "Les 83 lectures importantes",
    "formationTitre": "Lectures de formation",
    "cours": [
      [
        "MSO 6011 · Concepts et méthodes en épidémiologie",
        [
          "Celentano, D. D., Szklo, M., & Youssef, M. K. F. Gordis Epidemiology (7e éd.). Elsevier.",
          "Szklo, M., & Nieto, F. J. (2018). Epidemiology: Beyond the basics (4e éd.). Jones & Bartlett Learning.",
          "Rothman, K. J. Epidemiology: An introduction (chapitres 2 et 3).",
          "Oleckno, W. A. Epidemiology: Concepts and methods (chapitre 6)."
        ]
      ],
      [
        "ASA 6754 · Système de santé et santé des populations",
        [
          "Arpin, E., Gautier, L., & Quesnel-Vallée, A. (2025). Quebec: A health system profile. University of Toronto Press.",
          "Pineault, R. (2012). Comprendre le système de santé pour mieux le gérer. Presses de l’Université de Montréal."
        ]
      ],
      [
        "POL 6021 · Méthodes quantitatives",
        [
          "Arel-Bundock, V. (2021). Analyse causale et méthodes quantitatives. Presses de l’Université de Montréal.",
          "Arel-Bundock, V. Model to meaning (chapitres 3, 5, 6 et 10). https://marginaleffects.com",
          "Angrist, J. D., & Pischke, J.-S. (2015). Mastering ’metrics: The path from cause to effect. Princeton University Press."
        ]
      ]
    ],
    "note": "Le corpus a été constitué à partir d’Ovid (Embase, MEDLINE), de PubMed et de Cairn, et chaque publication a reçu une priorité selon sa pertinence pour la question de thèse."
  },
  approche: {
    "surtitre": "Posture de recherche",
    "titre": "Posture de recherche",
    "intro": "Une posture pragmatique et pluridisciplinaire, qui met en dialogue la mesure des phénomènes et la compréhension des pratiques.",
    "piliers": [
      [
        "Posture pragmatique",
        "Une posture qui articule une lecture positiviste (mesurer, estimer, tester des hypothèses) et une lecture constructiviste (comprendre le sens que les acteurs donnent à leurs pratiques). La question décide de la méthode."
      ],
      [
        "Méthodes mixtes",
        "Analyses quantitatives et qualitatives intégrées : analyse de réseaux, régressions, analyse thématique, analyse documentaire et cartographie, réunies dans des tableaux d’intégration."
      ],
      [
        "Pluridisciplinarité",
        "Santé publique, droit, gestion, sciences politiques et intervention sociale : des regards qui se répondent pour analyser un même système."
      ]
    ],
    "outils": {
      "titre": "Boîte à outils",
      "groupes": [
        [
          "Analyse de données",
          [
            "Positron (R)",
            "Python",
            "NVivo",
            "QGIS",
            "Excel"
          ]
        ],
        [
          "Collaboration et animation",
          [
            "Miro",
            "Klaxoon",
            "Canva"
          ]
        ],
        [
          "Bureautique",
          [
            "Office 365"
          ]
        ]
      ]
    },
    "methodes": {
      "titre": "Méthodes de recherche mobilisées",
      "intro": "De la question à l’observation : chaque question appelle ses données, sa méthode d’analyse et son interprétation. Je choisis les méthodes selon ce qu’il faut éclairer, en croisant les disciplines.",
      "items": [
        {
          "titre": "Analyse de réseaux sociaux égocentrée et sociocentrée",
          "texte": "L’analyse de réseaux sociaux décrit les relations entre acteurs plutôt que leurs seuls attributs. L’approche sociocentrée examine l’ensemble des liens d’une population délimitée ; l’approche égocentrée part d’un répondant (ego) et des interlocuteurs qu’il nomme (alters). Dans ma thèse, je pars du CLSC : ses intervenants et gestionnaires nomment leurs interlocuteurs, qui répondent à leur tour, ce qui permet de croiser les liens déclarés par les partenaires. Des vignettes font apparaître le réseau potentiel, soit les partenaires qui seraient sollicités ; les interactions des 12 derniers mois décrivent le réseau réel. La comparaison des deux éclaire la réponse intersectorielle aux besoins sociaux complexes en soins primaires.",
          "references": [
            "Perry, B. L., Pescosolido, B. A., & Borgatti, S. P. (2018). Egocentric network analysis: Foundations, methods, and models. Cambridge University Press. https://doi.org/10.1017/9781316443255",
            "Provan, K. G., Veazie, M. A., Staten, L. K., & Teufel-Shone, N. I. (2005). The use of network analysis to strengthen community partnerships. Public Administration Review, 65(5), 603–613. https://doi.org/10.1111/j.1540-6210.2005.00487.x",
            "Valente, T. W., Palinkas, L. A., Czaja, S., Chu, K.-H., & Brown, C. H. (2015). Social network analysis for program implementation. PLOS ONE, 10(6), Article e0131712. https://doi.org/10.1371/journal.pone.0131712"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12913-026-15347-8/MediaObjects/12913_2026_15347_Fig1_HTML.png",
              "page": "https://bmchealthservres.biomedcentral.com/articles/10.1186/s12913-026-15347-8",
              "legende": "Réseau égocentré de coordination en promotion de la santé municipale : l’acteur focal (ego) au centre, relié à ses interlocuteurs (alters).",
              "credit": "Figure 1 de Richter, Mamontova et Kühne (2026), BMC Health Services Research, CC BY 4.0"
            },
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs13033-019-0328-1/MediaObjects/13033_2019_328_Fig2_HTML.png",
              "page": "https://ijmhs.biomedcentral.com/articles/10.1186/s13033-019-0328-1",
              "legende": "Réseau sociocentré de 27 organisations de santé mentale et de services sociaux au Timor-Leste, selon la fréquence des contacts sur un an.",
              "credit": "Figure 2 de Hall et al. (2019), International Journal of Mental Health Systems, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Cartographie et systèmes d’information géographique",
          "texte": "La cartographie et les systèmes d’information géographique (SIG) relient des données à leur localisation pour décrire la répartition des services, des besoins et des populations sur un territoire. Les mesures d’accessibilité potentielle, comme la méthode à deux étapes des aires de desserte flottantes (2SFCA), mettent en rapport l’offre de services, la demande et la distance qui les sépare. J’en ai acquis les bases dans un MOOC de l’Université de Genève. Dans ma thèse, la cartographie peut servir à situer sur le territoire du CLSC les organisations nommées dans le réseau et à mettre la structure des liens en regard de la répartition des services et des besoins.",
          "references": [
            "Guagliardo, M. F. (2004). Spatial accessibility of primary care: Concepts, methods and challenges. International Journal of Health Geographics, 3, Article 3. https://doi.org/10.1186/1476-072X-3-3",
            "Luo, W., & Wang, F. (2003). Measures of spatial accessibility to health care in a GIS environment: Synthesis and a case study in the Chicago region. Environment and Planning B: Planning and Design, 30(6), 865–884. https://doi.org/10.1068/b29120",
            "Ngui, A. N., & Apparicio, P. (2011). Optimizing the two-step floating catchment area method for measuring spatial accessibility to medical clinics in Montreal. BMC Health Services Research, 11, Article 166. https://doi.org/10.1186/1472-6963-11-166"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2F1472-6963-11-166/MediaObjects/12913_2010_Article_1671_Fig3_HTML.jpg",
              "page": "https://bmchealthservres.biomedcentral.com/articles/10.1186/1472-6963-11-166",
              "legende": "Accessibilité spatiale aux cliniques médicales de Montréal selon la méthode 2SFCA, version classique et version optimisée.",
              "credit": "Figure 3 de Ngui et Apparicio (2011), BMC Health Services Research, CC BY 2.0"
            },
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12942-017-0105-9/MediaObjects/12942_2017_105_Fig4_HTML.gif",
              "page": "https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-017-0105-9",
              "legende": "Localisation des services de santé et de services sociaux de la région métropolitaine de Montréal en 2015, dont les CLSC (carte d).",
              "credit": "Figure 4 d’Apparicio et al. (2017), International Journal of Health Geographics, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Programmation reproductible : R et Python dans Positron, et le shell",
          "texte": "La programmation reproductible consiste à conduire chaque étape d’une analyse, de l’importation des données aux figures, dans des scripts qui peuvent être réexécutés et vérifiés. Je code en R et en Python dans Positron, l’environnement de développement de Posit, et j’enchaîne les traitements en ligne de commande dans le shell. En R, le tidyverse structure la préparation des données ; igraph et statnet servent à construire les réseaux et à calculer centralité, densité et cohésion ; sf gère les données spatiales. Python complète cette chaîne pour la préparation et l’automatisation des données. Le tout relie, dans un même projet documenté, les données de réseau, les données territoriales et les figures.",
          "references": [
            "Handcock, M. S., Hunter, D. R., Butts, C. T., Goodreau, S. M., & Morris, M. (2008). statnet: Software tools for the representation, visualization, analysis and simulation of network data. Journal of Statistical Software, 24(1), 1–11. https://doi.org/10.18637/jss.v024.i01",
            "Pebesma, E. (2018). Simple features for R: Standardized support for spatial vector data. The R Journal, 10(1), 439–446. https://doi.org/10.32614/RJ-2018-009",
            "Wickham, H., Averick, M., Bryan, J., Chang, W., McGowan, L. D., François, R., Grolemund, G., Hayes, A., Henry, L., Hester, J., Kuhn, M., Pedersen, T. L., Miller, E., Bache, S. M., Müller, K., Ooms, J., Robinson, D., Seidel, D. P., Spinu, V., . . . Yutani, H. (2019). Welcome to the tidyverse. Journal of Open Source Software, 4(43), Article 1686. https://doi.org/10.21105/joss.01686"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12992-024-01055-7/MediaObjects/12992_2024_1055_Fig2_HTML.png",
              "page": "https://globalizationandhealth.biomedcentral.com/articles/10.1186/s12992-024-01055-7",
              "legende": "Réseau d’organisations engagées dans la prévention des zoonoses émergentes, coloré par secteur ; analyse avec igraph et statnet, figure produite dans R avec ggraph.",
              "credit": "Figure 2 de Clifford Astbury et al. (2024), Globalization and Health, CC BY 4.0"
            },
            {
              "src": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/7b60/12169549/9225d6431677/pone.0325597.g001.jpg",
              "page": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0325597",
              "legende": "Sociogrammes des interactions entre organisations en Guinée et en Sierra Leone (paludisme et COVID-19), produits dans R avec le tidyverse, tidygraph et ggraph.",
              "credit": "Figure 1 de Feddern et al. (2025), PLOS ONE, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Analyse qualitative thématique et de réseaux",
          "texte": "L’analyse thématique repère, organise et interprète des régularités de sens dans un corpus d’entretiens ou de documents, selon un processus itératif qui va du codage initial à la définition des thèmes. Je conduis ce codage dans NVivo, qui permet de documenter l’arbre de codes, les mémos et les regroupements successifs. Dans ma thèse, les entretiens guidés par les cartes relèvent de la description interprétative. La méthode du cadre (Framework Method) associe codes déductifs et inductifs dans une matrice participants × thèmes pour comparer les secteurs, les positions dans le réseau et les profils. Un double codage de 20 % du corpus, un journal réflexif et une restitution aux participants sont prévus avant l’intégration et l’atelier délibératif.",
          "references": [
            "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa",
            "Hogan, B., Carrasco, J. A., & Wellman, B. (2007). Visualizing personal networks: Working with participant-aided sociograms. Field Methods, 19(2), 116–144. https://doi.org/10.1177/1525822X06298589",
            "Hollstein, B. (2024). Qualitative and mixed methods. In J. McLevey, J. Scott, & P. J. Carrington (Eds.), The Sage handbook of social network analysis (2nd ed., pp. 562–574). Sage. https://doi.org/10.4135/9781529614695.n38"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12875-026-03322-5/MediaObjects/12875_2026_3322_Fig1_HTML.png",
              "page": "https://bmcprimcare.biomedcentral.com/articles/10.1186/s12875-026-03322-5",
              "legende": "Carte thématique issue d’une analyse thématique réflexive d’entretiens codés dans NVivo, sur l’accès aux soins primaires.",
              "credit": "Figure 1 d’Instone et al. (2026), BMC Primary Care, CC BY 4.0"
            },
            {
              "src": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/4df6/8392189/3efc6c848b2a/ijerph-18-08372-g001.jpg",
              "page": "https://doi.org/10.3390/ijerph18168372",
              "legende": "Carte de réseau dessinée en entretien puis numérisée, dans une analyse qualitative d’un réseau intersectoriel de promotion de la santé.",
              "credit": "Figure 1 de Fleuren, Thiel et Frahsa (2021), International Journal of Environmental Research and Public Health, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Analyse critique du discours",
          "texte": "J’ai mené une analyse qualitative du discours critique des médecins québécois lors des débats entourant le projet de loi n° 2. Le corpus raisonné compte 42 documents de presse et communiqués (base Eureka, mai à décembre 2025), codés chronologiquement jusqu’à la stabilité de l’architecture des codes. L’analyse articule le modèle tridimensionnel de Fairclough (le texte, les pratiques de production et de circulation, le contexte sociopolitique), la théorie du cadrage et l’attribution des rôles narratifs : victimes, responsables, protecteurs. Chaque citation est tracée jusqu’à sa source, et l’analyse distingue ce que disent les textes de leur interprétation sociologique.",
          "references": [
            "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58. https://doi.org/10.1111/j.1460-2466.1993.tb01304.x",
            "Fairclough, N. (1995). Critical discourse analysis: The critical study of language. Longman.",
            "Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? Qualitative Health Research, 27(4), 591–608. https://doi.org/10.1177/1049732316665344",
            "Shanahan, E. A., Jones, M. D., & McBeth, M. K. (2018). How to conduct a Narrative Policy Framework study. The Social Science Journal, 55(3), 332–345. https://doi.org/10.1016/j.soscij.2017.12.002"
          ],
          "illustrations": [
            {
              "schema": [
                "Pratique sociale : contexte sociopolitique",
                "Pratique discursive : production et circulation",
                "Texte"
              ],
              "legende": "Modèle tridimensionnel de l’analyse critique du discours",
              "credit": "Schéma d’après Fairclough (1995)"
            }
          ]
        }
      ]
    },
    "expertises": {
      "titre": "Expertises",
      "items": [
        [
          "Direction des établissements sanitaires, sociaux et médico-sociaux",
          "Ma maîtrise en direction des structures médico-sociales et de services aux personnes (Université de Bretagne Occidentale, 2024, mention spéciale du jury) couvre la gestion budgétaire et financière (CPOM, EPRD), la comptabilité, la gestion des ressources humaines et le droit du travail, le management, la théorie et la sociologie des organisations, la philosophie et le projet d’établissement. Responsable de séjours de vacances adaptés et de séjours de répit de 2016 à 2024, j’en ai assuré la gestion des équipes, du budget et de la logistique."
        ],
        [
          "Droit sanitaire, social et médico-social",
          "Mon master en droit public, spécialisé en droit de la santé et en droit social (Université Paris-Panthéon-Assas, 2025, mention spéciale du jury), porte sur l’organisation et la planification des secteurs sanitaire, social et médico-social : autorisation, habilitation, tarification et contentieux de la tarification. Il couvre aussi les droits des patients et des usagers, la bioéthique, l’économie de la santé, la contractualisation, les responsabilités civile, pénale et administrative, ainsi que le droit du travail et de la sécurité sociale."
        ],
        [
          "Transformation de l’offre et appui à la performance",
          "Chargé de mission médico-sociale à l’Agence nationale d’appui à la performance (ANAP, Paris) en 2024–2025, j’ai accompagné la transformation de l’offre en santé et en services sociaux : copilotage du réseau des experts, animation de webinaires, recueil et analyse de données, animation et coconstruction de séances de communautés de pratique."
        ],
        [
          "Vieillissement, autonomie et EHPAD",
          "Mes deux mémoires de master portent sur ce champ : l’adaptation des EHPAD aux personnes handicapées vieillissantes (Université de Bretagne Occidentale, 2024) et la mise en œuvre du virage domiciliaire, dans une étude comparée de la France et du Québec (« Vieillir chez soi », Université Paris-Panthéon-Assas, 2025). S’y ajoutent une expérience en EHPAD et le travail mené à l’ANAP sur la réforme des services autonomie à domicile."
        ],
        [
          "Handicap et autodétermination",
          "Éducateur spécialisé en foyer d’hébergement (Adapei 35, Saint-Malo, 2020–2023), j’ai évalué les besoins des personnes accompagnées, coconstruit leurs projets individualisés et coordonné une équipe pluridisciplinaire. Mon mémoire de 2023 porte sur l’influence des pratiques éducatives sur l’autodétermination. De 2016 à 2024, j’ai également été responsable de séjours de vacances adaptés et de séjours de répit pour personnes en situation de handicap."
        ],
        [
          "Autisme",
          "Mon expérience d’éducateur spécialisé en foyer d’hébergement, à l’Adapei 35 de Saint-Malo de 2020 à 2023, comprend l’accompagnement de personnes autistes. Cet accompagnement repose sur l’évaluation des besoins propres à chaque personne, la coconstruction de son projet individualisé avec elle et la coordination d’une équipe pluridisciplinaire autour de ce projet."
        ],
        [
          "Méthodologie de recherche et évaluation de projet",
          "Doctorant en santé publique à l’ESPUM (Université de Montréal), je mobilise des méthodes mixtes, quantitatives et qualitatives. L’un de mes axes de recherche porte sur la performance, la conduite du changement et le pilotage des organisations. En évaluation de projet, je m’appuie sur ma formation (évaluation des établissements, contrats d’objectifs et de moyens) et sur les outils d’aide à la décision et de pilotage élaborés à l’ANAP."
        ],
        [
          "Intersectorialité et soins primaires",
          "Stagiaire de recherche au Centre de recherche du CHUM (CRCHUM), j’étudie les politiques de soins primaires, l’intersectorialité et l’intégration des soins et services. L’intersectorialité désigne l’action concertée de plusieurs secteurs, tels que la santé, les services sociaux, l’éducation ou le logement, sur des problèmes qui dépassent le champ d’un seul d’entre eux. Ces travaux rejoignent mon axe d’analyse comparée des systèmes de santé."
        ],
        [
          "Entrepreneuriat et management",
          "Formé à l’entrepreneuriat et au management (diplôme universitaire, IAE de Brest, 2024), j’ai entrepris la création d’OWNNIGHT, une application de bien-être et d’éducation au sommeil. Mon approche du management s’appuie sur la clinique des organisations et le développement de l’activité d’une structure, étudiés en master, ainsi que sur le leadership de proximité exercé comme responsable de séjours de vacances adaptés et de séjours de répit."
        ]
      ]
    },
    "axes": {
      "titre": "Axes de travaux",
      "principaux": [
        "Gouvernance et évaluation des politiques de santé",
        "Approche intersectorielle en première ligne",
        "Vieillissement, perte d’autonomie et politiques du maintien à domicile"
      ],
      "secondairesTitre": "Axes secondaires",
      "secondaires": [
        "Planification juridique, analyse doctrinale et droit de la santé",
        "Performance, conduite du changement et pilotage des organisations",
        "Analyse comparée des systèmes de santé"
      ]
    }
  },
  valeurs: {
    "surtitre": "Valeurs",
    "titre": "Ce qui guide ma pratique",
    "intro": "Six valeurs qui orientent mon travail, du terrain à la recherche.",
    "devise": [
      "Devise",
      "Ad astra per aspera",
      "Par des sentiers ardus jusqu’aux étoiles"
    ],
    "items": [
      [
        "Pensée critique",
        "Explorer d’autres disciplines et façons de penser, confronter les idées et questionner les évidences, les données et les institutions, à commencer par ses propres convictions.",
        0
      ],
      [
        "Résilience",
        "Faire des épreuves traversées une ressource pour avancer.",
        1
      ],
      [
        "Autonomie",
        "Penser par soi-même et soutenir chez chacun la capacité de choisir sa vie.",
        2
      ],
      [
        "Coconstruire pour le bien collectif",
        "Faire avec les personnes, et non pour elles : une recherche à impact, menée avec et pour les gens.",
        4
      ],
      [
        "Audace d’innover",
        "Oser proposer, innover, créer et mettre en œuvre de nouvelles réponses.",
        5
      ],
      [
        "Équité",
        "Permettre, autant que possible, à toutes et tous de développer pleinement leurs capacités et de concrétiser leurs volontés.",
        3
      ]
    ]
  },
  implantation: {
    "surtitre": "03 · Implantation",
    "titre": "Transfert de connaissances et implantation",
    "intro": "Faire circuler les savoirs entre les personnes, les milieux de pratique et la recherche, puis examiner ce qu’ils permettent réellement de changer.",
    "precision": "Dans ma thèse, la mobilisation des connaissances accompagne la recherche : elle n’est ni une étude d’implantation ni une évaluation de politique.",
    "formation": {
      "etiquette": "Formation complétée",
      "titre": "MobilizeU, mobilisation des connaissances · Research Impact Canada et Université York, 2026",
      "lien": "https://researchimpact.ca/learning/mobilizeu/",
      "lienTexte": "En savoir plus"
    },
    "plan": {
      "titre": "Dans ma thèse : un plan de mobilisation des connaissances",
      "items": [
        {
          "nom": "Pourquoi, quoi, à qui, comment",
          "texte": "Le cadre de Ward structure le plan en quatre questions : préciser le quoi, le pourquoi et le qui avant de choisir le comment, les formats et les canaux.",
          "ref": "Ward, 2017"
        },
        {
          "nom": "Des connaissances à l’action",
          "texte": "Le modèle des connaissances à l’action encadre la production, l’adaptation, la communication et le suivi des connaissances, sans prétendre en assurer l’adoption durable.",
          "ref": "Graham et al., 2006"
        },
        {
          "nom": "Des partenariats fondés sur les 4R",
          "texte": "Respect, pertinence, réciprocité et responsabilité guident les partenariats avec les patients et les milieux, en s’appuyant sur le cadre d’engagement des patients des IRSC.",
          "ref": "Kirkness et Barnhardt, 1991 ; IRSC, 2014 ; Bowen et Graham, 2013"
        },
        {
          "nom": "Un dialogue délibératif",
          "texte": "Un atelier délibératif transforme les résultats en recommandations contextualisées, avec un retour aux participants. La participation est rapportée selon GRIPP2.",
          "ref": "Boyko et al., 2012 ; Lavis et al., 2009 ; Staniszewska et al., 2017"
        },
        {
          "nom": "Suivre la contribution, pas l’attribution",
          "texte": "Quatre indicateurs (production, portée, appropriation, utilisation documentée) et un registre permettent d’apprécier la contribution plausible de la recherche, sans lui attribuer les changements ultérieurs.",
          "ref": "Morton, 2015"
        }
      ]
    },
    "cadres": {
      "titre": "Repères en science de l’implantation",
      "items": [
        {
          "nom": "CFIR 2.0",
          "texte": "Examiner le contexte et les déterminants qui facilitent ou freinent l’implantation.",
          "ref": "Damschroder et al., 2022"
        },
        {
          "nom": "Résultats d’implantation",
          "texte": "Distinguer acceptabilité, adoption, pertinence, faisabilité, fidélité, coût, pénétration et pérennité.",
          "ref": "Proctor et al., 2011"
        },
        {
          "nom": "Impact de la recherche",
          "texte": "Les cadres d’impact cartographient surtout le chemin aller, de la recherche vers la pratique ; mes travaux interrogent aussi le chemin retour.",
          "ref": "Greenhalgh et al., 2016 ; Brownson et al., 2026"
        },
        {
          "nom": "Approche par contributions",
          "texte": "Relier les productions aux usages, puis aux changements documentés, en examinant les autres influences possibles.",
          "ref": "Morton, 2015 ; Bayley et Phipps, 2019"
        },
        {
          "nom": "Coproduction et application intégrée",
          "texte": "Les mécanismes de coproduction dépendent de l’infrastructure, de la clarté des rôles et du partage du pouvoir ; leurs coûts comptent aussi.",
          "ref": "Graham et al., 2019 ; Kothari et al., 2025 ; Oliver et al., 2019"
        },
        {
          "nom": "Une science de l’implantation critique",
          "texte": "Théoriser plutôt qu’appliquer les cadres comme des listes de contrôle.",
          "ref": "Kislov et al., 2019"
        },
        {
          "nom": "Participation et délibération",
          "texte": "Concevoir et évaluer des processus de participation publique qui laissent une trace de leur influence.",
          "ref": "Abelson et al., 2003 ; OCDE, 2022"
        },
        {
          "nom": "Pourquoi l’implantation",
          "texte": "Prouver qu’une innovation est efficace ne suffit pas à garantir qu’elle sera adoptée.",
          "ref": "Bauer et Kirchner, 2020"
        },
        {
          "nom": "Stratégies d’implantation",
          "texte": "La compilation ERIC offre un vocabulaire commun de 73 stratégies pour décrire, choisir et rapporter les stratégies employées.",
          "ref": "Powell et al., 2015"
        },
        {
          "nom": "Interventions complexes",
          "texte": "L’implantation devient une phase à part entière, avec le contexte, la théorie du programme et les parties prenantes au centre.",
          "ref": "Skivington et al., 2021"
        },
        {
          "nom": "Implanter auprès des aînés",
          "texte": "Au Québec, l’implantation d’un accompagnement citoyen pour la participation sociale des aînés éclaire les conditions qui comptent.",
          "ref": "Gobeil et al., 2023"
        }
      ]
    },
    "ressources": {
      "titre": "Ressources",
      "items": [
        [
          "Glossaire de la mobilisation des connaissances",
          "Instituts de recherche en santé du Canada",
          "https://cihr-irsc.gc.ca/f/54014.html"
        ],
        [
          "Cadre d’engagement des patients",
          "IRSC, Stratégie de recherche axée sur le patient",
          "https://cihr-irsc.gc.ca/f/48413.html"
        ],
        [
          "Lignes directrices sur la participation citoyenne",
          "OCDE, 2022",
          "https://doi.org/10.1787/f765caf6-en"
        ]
      ]
    },
    "chantiers": {
      "titre": "Huit chantiers de la mobilisation des connaissances",
      "intro": "Chaque chantier relie la littérature scientifique à ma pratique.",
      "detail": "Littérature scientifique",
      "items": [
        [
          "Mobiliser",
          "Faire circuler les savoirs dans les deux sens",
          "Mobiliser, c’est faire circuler les savoirs de la recherche vers les milieux, mais aussi des milieux et des personnes vers la recherche. Le modèle des connaissances à l’action distingue la création des connaissances et le cycle de leur mise en action : cerner un problème, adapter les savoirs au contexte, repérer les obstacles, soutenir puis suivre l’usage (Graham et al., 2006). Cinq questions organisent la démarche, quoi transférer, à qui, par qui, comment et avec quel effet, et l’on mobilise d’abord des ensembles de preuves plutôt qu’une étude isolée (Grimshaw et al., 2012). Le courtage de connaissances donne un visage à ce travail de liaison (Munerol et al., 2013).",
          [
            "Graham et al. (2006)",
            "Grimshaw et al. (2012)",
            "Ward et al. (2012)",
            "Munerol et al. (2013)"
          ]
        ],
        [
          "Cadres",
          "Choisir un cadre selon la question",
          "Un cadre rend les choix explicites : pourquoi mobiliser, quels savoirs, avec qui et comment (Ward, 2017). Les théories, modèles et cadres se rangent en familles selon ce que l’on cherche à faire : guider un processus, expliquer ce qui facilite ou freine, ou évaluer (Nilsen, 2015). Certains placent la facilitation au cœur de l’implantation (Harvey et Kitson, 2016) ; d’autres couvrent tout le cycle de l’application des connaissances (Esmail et al., 2020). Les choisir selon la question, et les discuter plutôt que les cocher comme une liste, rend la démarche plus féconde (Kislov et al., 2019).",
          [
            "Ward (2017)",
            "Nilsen (2015)",
            "Harvey et Kitson (2016)",
            "Esmail et al. (2020)"
          ]
        ],
        [
          "Planifier",
          "Planifier dès la conception",
          "Un plan de mobilisation précise les publics, les objectifs, les messages, les activités, les ressources, le calendrier et les indicateurs (IRSC, 2012). Il se construit avec les partenaires dès la conception du projet : concevoir pour la diffusion et la pérennité, c’est penser tôt l’adéquation entre les résultats et leur contexte d’adoption (Kwan et al., 2022). Les plans réels décrivent bien les partenaires et les stratégies, mais oublient souvent l’évaluation et les ressources (Tchameni Ngamo et al., 2016). Pour démarrer : connaître ses publics, s’entourer, impliquer des personnes ayant une expérience vécue et tirer des leçons de chaque essai (Diany et al., 2025 ; Dancause, 2023).",
          [
            "IRSC (2012)",
            "Tchameni Ngamo et al. (2016)",
            "Kwan et al. (2022)",
            "Diany et al. (2025)",
            "Dancause (2023)"
          ]
        ],
        [
          "Partenariats",
          "Coproduire et partager le pouvoir",
          "La coproduction et l’application intégrée des connaissances associent les utilisateurs des résultats à chaque étape, de la question à la diffusion (Jull et al., 2017). Les approches de recherche en partenariat partagent des principes, des stratégies et des retombées communs, qu’un vocabulaire partagé permet de décrire et de comparer (Hoekstra et al., 2020). L’engagement se conçoit sur trois plans, l’organisation, les valeurs et les pratiques (Boaz et al., 2018), et repose sur une interdépendance réelle et la cocréation (Skipper et Pepler, 2020). Il demande du temps et des moyens : ses coûts doivent être reconnus (Oliver et al., 2019).",
          [
            "Jull et al. (2017)",
            "Boaz et al. (2018)",
            "Hoekstra et al. (2020)",
            "Skipper et Pepler (2020)",
            "Oliver et al. (2019)"
          ]
        ],
        [
          "Inclusion",
          "Qui est entendu, qui participe, qui en bénéficie",
          "Une mobilisation inclusive interroge la place de chacun : qui est entendu, qui participe, qui en bénéficie (Georgalakis, 2023). Relier savoirs et action pour l’équité suppose de redistribuer le pouvoir et de s’attaquer aux causes structurelles des inégalités (Plamondon et al., 2019). Les savoirs d’expérience ne sont pas des compléments : ils transforment les questions, les méthodes et l’interprétation (Breton, 2025). En santé autochtone, les pratiques prometteuses respectent les façons de partager les savoirs propres aux communautés (Morton Ninomiya et al., 2022) ; dans le champ du handicap, des principes coconstruits évitent la participation de façade (Gainforth et al., 2021).",
          [
            "Plamondon et al. (2019)",
            "Morton Ninomiya et al. (2022)",
            "Gainforth et al. (2021)",
            "Breton (2025)",
            "Georgalakis (2023)"
          ]
        ],
        [
          "Publics",
          "Choisir le format selon l’objectif",
          "Le format suit l’objectif : cocréer (dialogue délibératif, café du monde, atelier), diffuser (exposition, webinaire, table ronde) ou mettre en œuvre (formation, réunion de projet). L’accessibilité se pense sous toutes ses formes, physique, sensorielle, financière, culturelle et linguistique : les publics doivent se sentir inclus, pas seulement invités. Le modèle de Montréal reconnaît les savoirs expérientiels des patients comme complémentaires des savoirs professionnels (Pomey et al., 2015), et de nombreux cadres soutiennent la participation des patients et du public à la recherche (Greenhalgh et al., 2019). Les résumés en langage clair (Stoll et al., 2022) et l’art visuel coconstruit (Courcy et al., 2022) ouvrent la recherche à d’autres publics.",
          [
            "Pomey et al. (2015)",
            "Greenhalgh et al. (2019)",
            "Stoll et al. (2022)",
            "Courcy et al. (2022)"
          ]
        ],
        [
          "Communiquer",
          "Viser l’usage autant que la visibilité",
          "La communication stratégique et l’application des connaissances se recoupent sans se confondre : l’une soutient la visibilité, l’autre l’usage (Barwick et al., 2014). Le courtier de connaissances travaille dans un entre-deux, en tissant des liens entre chercheurs et décideurs plutôt qu’en diffusant des produits (Lomas, 2007). Dans les politiques publiques, la pertinence des données et les facteurs organisationnels pèsent lourd (Oliver et al., 2026), alors que les conseils donnés aux chercheurs reposent rarement sur des preuves et taisent les coûts de l’engagement (Oliver et Cairney, 2019). Une intervention de courtage en agence régionale de santé montre que les compétences progressent plus vite que l’influence sur les décisions (Fillol et al., 2026).",
          [
            "Lomas (2007)",
            "Barwick et al. (2014)",
            "Oliver et Cairney (2019)",
            "Oliver et al. (2026)",
            "Fillol et al. (2026)"
          ]
        ],
        [
          "Impact",
          "Suivre la contribution, pas l’attribution",
          "Évaluer l’impact, c’est suivre la contribution de la recherche aux changements sans les lui attribuer à elle seule : productions, portée, appropriation, usages documentés, puis retombées pour les services et les personnes (Morton, 2015). L’analyse de contribution offre une démarche raisonnée lorsque l’attribution causale stricte est hors de portée (Mayne, 2012). Des cadres francophones rendent visibles les retombées du transfert (Gervais et al., 2016), et une revue québécoise recense les modèles utilisés pour évaluer les stratégies de mobilisation (Ziam et al., 2024). Reste une question ouverte et discutée : dans quelle mesure l’évaluation du transfert est-elle possible (Plouffe, 2015) ?",
          [
            "Mayne (2012)",
            "Morton (2015)",
            "Gervais et al. (2016)",
            "Ziam et al. (2024)",
            "Plouffe (2015)"
          ]
        ]
      ]
    },
    "bibliographie": {
      "titre": "Bibliographie (APA)",
      "items": [
        "Abelson, J., Forest, P.-G., Eyles, J., Smith, P., Martin, E., & Gauvin, F.-P. (2003). Deliberations about deliberative methods: Issues in the design and evaluation of public participation processes. Social Science & Medicine, 57(2), 239–251. https://doi.org/10.1016/S0277-9536(02)00343-X",
        "Barwick, M., Phipps, D., Myers, G., Johnny, M., & Coriandoli, R. (2014). Knowledge translation and strategic communications: Unpacking differences and similarities for scholarly and research communications. Scholarly and Research Communication, 5(3). https://doi.org/10.22230/src.2014v5n3a175",
        "Bauer, M. S., & Kirchner, J. (2020). Implementation science: What is it and why should I care? Psychiatry Research, 283, Article 112376. https://doi.org/10.1016/j.psychres.2019.04.025",
        "Bayley, J. E., & Phipps, D. (2019). Building the concept of research impact literacy. Evidence & Policy, 15(4), 597–606. https://doi.org/10.1332/174426417X15034894876108",
        "Beaulieu, M.-D. (2016). Construction et hiérarchisation des données probantes en santé : savoirs scientifiques, expérientiels et contextuels. Revue du CREMIS, 9(2), 9-15. https://cremis.ca/publications/articles-et-medias/construction-et-hierarchisation-des-donnees-probantes-en-sante-savoirs-scientifiques-experientiels-et-contextuels/",
        "Berrada, M. (2026, 2 juin). Recherche et politiques publiques : comment mieux faire circuler les savoirs ? Affaires universitaires. https://www.affairesuniversitaires.ca/actualites/recherche-et-politiques-publiques-comment-mieux-faire-circuler-les-savoirs/",
        "Boaz, A., Hanney, S., Borst, R., O’Shea, A., & Kok, M. (2018). How to engage stakeholders in research: Design principles to support improvement. Health Research Policy and Systems, 16, Article 60. https://doi.org/10.1186/s12961-018-0337-6",
        "Bowen, S. J., & Graham, I. D. (2013). From knowledge translation to engaged scholarship: Promoting research relevance and utilization. Archives of Physical Medicine and Rehabilitation, 94(1 Suppl.), S3–S8. https://doi.org/10.1016/j.apmr.2012.04.037",
        "Boyko, J. A., Lavis, J. N., Abelson, J., Dobbins, M., & Carter, N. (2012). Deliberative dialogues as a mechanism for knowledge translation and exchange in health systems decision-making. Social Science & Medicine, 75(11), 1938–1945. https://doi.org/10.1016/j.socscimed.2012.06.016",
        "Breton, H. (2025). Savoirs expérientiels en santé : revue systématique de littérature. Santé Publique, 37(3), 241-251. https://doi.org/10.3917/spub.255.0241",
        "Brownson, R. C., Iwelunmor, J., Odeny, T. A., Proctor, E. K., & Geng, E. H. (2026). So what? Elevating the impact of implementation science. Implementation Science Communications, 7, 2. https://doi.org/10.1186/s43058-025-00831-9",
        "Bulloch, M. N. (Animatrice). (2024, 17 juillet). SCCM Pod-520: Implementation science: From evidence to practice [Balado]. Dans SCCM Podcast. Society of Critical Care Medicine. https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice",
        "Centre de collaboration nationale des méthodes et outils. (2016, 4 juillet). CCNMO - Prise de décisions fondée sur des données probantes [Vidéo]. YouTube. https://www.youtube.com/watch?v=XrZjc3Flrz8",
        "Courcy, I., Bureau, A., & Grenier, G. (2022). L’art visuel comme outil de pratique en mobilisation et transfert de connaissances : retour sur un projet de cocréation d’une murale alliant la recherche, l’art et des savoirs expérientiels. Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 6(3). https://doi.org/10.18166/tuc.2022.6.3.25",
        "Crowley, D. M., & Scott, J. T. (2023). To support evidence-based policymaking, bring researchers and policymakers together. Issues in Science and Technology, 39(2), 31-35. https://issues.org/evidence-based-policymaking-researchers-policymakers-collaborate-crowley-scott/",
        "Dagenais, C., Hot, A., & Ridde, V. (2023, 21 février). Communiquer efficacement les connaissances scientifiques permet de sauver des vies. The Conversation. https://theconversation.com/communiquer-efficacement-les-connaissances-scientifiques-permet-de-sauver-des-vies-197191",
        "Damschroder, L. J., Reardon, C. M., Widerquist, M. A. O., & Lowery, J. (2022). The updated Consolidated Framework for Implementation Research based on user feedback. Implementation Science, 17, 75. https://doi.org/10.1186/s13012-022-01245-0",
        "Dancause, L. (2023). Guide pédagogique sur la mobilisation des connaissances (L. Cardinal & J. Luckerhoff, dir.). Laboratoire interdisciplinaire de recherche sur l’enseignement supérieur. https://www.erudit.org/fr/livres/hors-collection/guide-pedagogique-sur-la-mobilisation-des-connaissances/",
        "David, G., & Grégoire, A. (2018). Guide pratique – Stratégie de partenariat avec les patients et le public en recherche. Unité de soutien SRAP du Québec. https://ceppp.ca/wp-content/uploads/2021/01/USSQ_Guide-pratique-SPPP-en-recherche_V1.pdf",
        "Diany, R., Fitzgibbon-Collins, L. K., & Gagliano Taliun, S. A. (2025). Ten simple rules for getting started with knowledge mobilization. PLOS Computational Biology, 21(4), e1012888. https://doi.org/10.1371/journal.pcbi.1012888",
        "Équipe RENARD. (2023, 26 mai). Ancrage historique et évolution du courtage de connaissances [Vidéo]. YouTube. https://www.youtube.com/watch?v=3uucW5ZOp-g",
        "Équipe RENARD. (2023, 29 mai). Les compétences clés pour agir en courtage de connaissances [Vidéo]. YouTube. https://www.youtube.com/watch?v=RGVmhf9Wyzo",
        "Esmail, R., Hanson, H. M., Holroyd-Leduc, J., Brown, S., Strifler, L., Straus, S. E., Niven, D. J., & Clement, F. M. (2020). A scoping review of full-spectrum knowledge translation theories, models, and frameworks. Implementation Science, 15, Article 11. https://doi.org/10.1186/s13012-020-0964-5",
        "Fillol, A., Traverson, L., Zitti, T., Bars, G., Minssieux, N., Hot, A., Dagenais, C., & Ridde, V. (2026). Évaluation d’une intervention de courtage de connaissances à l’Agence régionale de santé Île-de-France. Santé Publique, 38(1), 15-34. https://doi.org/10.3917/spub.261.0015",
        "Gainforth, H. L., Hoekstra, F., McKay, R., McBride, C. B., Sweet, S. N., Martin Ginis, K. A., Anderson, K., Chernesky, J., Clarke, T., Forwell, S., Maffin, J., McPhail, L. T., Mortenson, W. B., Scarrow, G., Schaefer, L., Sibley, K. M., Athanasopoulos, P., & Willms, R. (2021). Integrated knowledge translation guiding principles for conducting and disseminating spinal cord injury research in partnership. Archives of Physical Medicine and Rehabilitation, 102(4), 656-663. https://doi.org/10.1016/j.apmr.2020.09.393",
        "Georgalakis, J. (2023, 16 janvier). We need to talk about equity in knowledge mobilisation. Transforming Evidence. https://transforming-evidence.org/blog/we-need-to-talk-about-equity-in-knowledge-mobilisation",
        "Gervais, M.-J., Souffez, K., & Ziam, S. (2016). Quel impact avons-nous ? Vers l’élaboration d’un cadre pour rendre visibles les retombées du transfert des connaissances. Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 1(1). https://doi.org/10.18166/tuc.2016.1.1.5",
        "Gobeil, J., Gaumond, V., Germain, S., Vézina, A., Duguay, A.-M., & Levasseur, M. (2023). Implantation de l’Accompagnement-citoyen personnalisé d’intégration communautaire (APIC) : vers l’optimisation de la mise en œuvre de cette approche novatrice visant la participation sociale des aînés. Canadian Journal on Aging / La Revue canadienne du vieillissement, 42(4), 551-564. https://doi.org/10.1017/S0714980823000132",
        "Gobel, U. (2021, 8 février). Knowledge mobilization will help Canada face the next major challenge. Policy Options. https://policyoptions.irpp.org/magazines/february-2021/knowledge-mobilization-will-help-canada-face-the-next-major-challenge/",
        "Graham, I. D., Logan, J., Harrison, M. B., Straus, S. E., Tetroe, J., Caswell, W., & Robinson, N. (2006). Lost in knowledge translation: Time for a map? Journal of Continuing Education in the Health Professions, 26(1), 13–24. https://doi.org/10.1002/chp.47",
        "Graham, I. D., McCutcheon, C., & Kothari, A. (2019). Exploring the frontiers of research co-production: The Integrated Knowledge Translation Research Network concept papers. Health Research Policy and Systems, 17, 88. https://doi.org/10.1186/s12961-019-0501-7",
        "Greenhalgh, T., Hinton, L., Finlay, T., Macfarlane, A., Fahy, N., Clyde, B., & Chant, A. (2019). Frameworks for supporting patient and public involvement in research: Systematic review and co-design pilot. Health Expectations, 22(4), 785-801. https://doi.org/10.1111/hex.12888",
        "Greenhalgh, T., Raftery, J., Hanney, S., & Glover, M. (2016). Research impact: A narrative review. BMC Medicine, 14, 78. https://doi.org/10.1186/s12916-016-0620-8",
        "Grimshaw, J. M., Eccles, M. P., Lavis, J. N., Hill, S. J., & Squires, J. E. (2012). Knowledge translation of research findings. Implementation Science, 7, Article 50. https://doi.org/10.1186/1748-5908-7-50",
        "Harvey, G., & Kitson, A. (2016). PARIHS revisited: From heuristic to integrated framework for the successful implementation of knowledge into practice. Implementation Science, 11, Article 33. https://doi.org/10.1186/s13012-016-0398-2",
        "Hoekstra, F., Mrklas, K. J., Khan, M., McKay, R. C., Vis-Dunbar, M., Sibley, K. M., Nguyen, T., Graham, I. D., SCI Guiding Principles Consensus Panel, & Gainforth, H. L. (2020). A review of reviews on principles, strategies, outcomes and impacts of research partnerships approaches: A first step in synthesising the research partnership literature. Health Research Policy and Systems, 18, Article 51. https://doi.org/10.1186/s12961-020-0544-9",
        "Institut du Nouveau Monde. (2026, 31 mars). Quand l’expertise académique rencontre le vécu du terrain (Épisode 2) [Balado]. Dans Le Réverbère : mini-série sur la science citoyenne. YouTube. https://www.youtube.com/watch?v=J6gVGWA_yhc",
        "Instituts de recherche en santé du Canada. (2012). Guide de planification de l’application des connaissances aux IRSC : approches intégrées et de fin de subvention. https://irsc-cihr.gc.ca/f/documents/kt_lm_ktplan-fr.pdf",
        "Instituts de recherche en santé du Canada. (2014). Cadre d’engagement des patients de la Stratégie de recherche axée sur le patient. https://cihr-irsc.gc.ca/f/48413.html",
        "Jabet, C., & Petitgand, C. (2022, 21 juillet). Au-delà de l’acceptabilité sociale, ouvrir le dialogue pour favoriser la participation citoyenne au débat sur l’utilisation des données de santé. Fonds de recherche du Québec. https://frq.gouv.qc.ca/ouvrir-le-dialogue-pour-favoriser-la-participation-citoyenne/",
        "Jull, J., Giles, A., & Graham, I. D. (2017). Community-based participatory research and integrated knowledge translation: Advancing the co-creation of knowledge. Implementation Science, 12, Article 150. https://doi.org/10.1186/s13012-017-0696-3",
        "Kirkness, V. J., & Barnhardt, R. (1991). First Nations and higher education: The four R’s—Respect, relevance, reciprocity, responsibility. Journal of American Indian Education, 30(3), 1–15.",
        "Kislov, R., Pope, C., Martin, G. P., & Wilson, P. M. (2019). Harnessing the power of theorising in implementation science. Implementation Science, 14, 103. https://doi.org/10.1186/s13012-019-0957-4",
        "Kothari, A., Sibbald, S. L., McCutcheon, C., Berta, W., Urquhart, R., Horsley, T., Comer, L., & Graham, I. D. (2025). How does integrated knowledge translation work? A realist review. Health Research Policy and Systems, 23, 102. https://doi.org/10.1186/s12961-025-01374-0",
        "Kwan, B. M., Brownson, R. C., Glasgow, R. E., Morrato, E. H., & Luke, D. A. (2022). Designing for dissemination and sustainability to promote equitable impacts on health. Annual Review of Public Health, 43, 331-353. https://doi.org/10.1146/annurev-publhealth-052220-112457",
        "Lavis, J. N., Boyko, J. A., Oxman, A. D., Lewin, S., & Fretheim, A. (2009). SUPPORT Tools for evidence-informed health Policymaking (STP) 14: Organising and using policy dialogues to support evidence-informed policymaking. Health Research Policy and Systems, 7(Suppl. 1), S14. https://doi.org/10.1186/1478-4505-7-S1-S14",
        "Lemire, N., Souffez, K., & Laurendeau, M.-C. (2009). Animer un processus de transfert des connaissances : bilan des connaissances et outil d’animation. Institut national de santé publique du Québec. https://www.inspq.qc.ca/publications/1012",
        "Les humains derrière la recherche en soins palliatifs. (2025, 13 novembre). Le pont entre la recherche et le terrain [Balado]. Apple Podcasts. https://podcasts.apple.com/ca/podcast/le-pont-entre-la-recherche-et-le-terrain/id1608211841?i=1000736634362",
        "Lomas, J. (2007). The in-between world of knowledge brokering. BMJ, 334(7585), 129-132. https://doi.org/10.1136/bmj.39038.593380.AE",
        "Massuard, M. (2023). Guide pour accompagner l’implantation de pratiques prometteuses dans un établissement : soutien à l’implantation de pratiques prometteuses et au transfert de connaissances dans le réseau de la santé et des services sociaux (J. Lane, dir.). Ministère de la Santé et des Services sociaux. https://publications.msss.gouv.qc.ca/msss/fichiers/2023/23-516-04W.pdf",
        "Mayne, J. (2012). Contribution analysis: Coming of age? Evaluation, 18(3), 270-280. https://doi.org/10.1177/1356389012451663",
        "Morton Ninomiya, M. E., Maddox, R., Brascoupé, S., Robinson, N., Atkinson, D., Firestone, M., Ziegler, C., & Smylie, J. (2022). Knowledge translation approaches and practices in Indigenous health research: A systematic review. Social Science & Medicine, 301, Article 114898. https://doi.org/10.1016/j.socscimed.2022.114898",
        "Morton, S. (2015). Progressing research impact assessment: A “contributions” approach. Research Evaluation, 24(4), 405–419. https://doi.org/10.1093/reseval/rvv016",
        "Munerol, L., Cambon, L., & Alla, F. (2013). Le courtage en connaissances, définition et mise en œuvre : une revue de la littérature. Santé Publique, 25(5), 587-597. https://doi.org/10.3917/spub.135.0587",
        "NCI Scientific Events and Resources. (2022, 23 février). TIDIRC: Introduction to dissemination & implementation science [Vidéo]. YouTube. https://www.youtube.com/watch?v=DO2tv7DqL3w",
        "Nilsen, P. (2015). Making sense of implementation theories, models and frameworks. Implementation Science, 10, Article 53. https://doi.org/10.1186/s13012-015-0242-0",
        "OECD. (2022). OECD guidelines for citizen participation processes. OECD Publishing. https://doi.org/10.1787/f765caf6-en",
        "Oliver, K., & Cairney, P. (2019). The dos and don’ts of influencing policy: A systematic review of advice to academics. Palgrave Communications, 5, Article 21. https://doi.org/10.1057/s41599-019-0232-y",
        "Oliver, K., Kothari, A., & Mays, N. (2019). The dark side of coproduction: Do the costs outweigh the benefits for health research? Health Research Policy and Systems, 17, 33. https://doi.org/10.1186/s12961-019-0432-3",
        "Oliver, K., Malin, J., Akerlof, K. L., Day, E., Grant, S., McGill, E., Lorenc, T., Martin, P., Lam, J., Williamson, L. E., Mouthaan, M., Pleguezuelo, V. C., Iqbal, S., Jaques, L., Nyanchoka, M., Cesar Alejandre, J., Lane, L., Persson, E., Forde, H., . . . Falconer, J. (2026). What factors influence evidence use in policy? An updated systematic map. Humanities and Social Sciences Communications. Publication en ligne anticipée. https://doi.org/10.1057/s41599-026-08391-6",
        "Plamondon, K. M., Caxaj, C. S., Graham, I. D., & Bottorff, J. L. (2019). Connecting knowledge with action for health equity: A critical interpretive synthesis of promising practices. International Journal for Equity in Health, 18, Article 202. https://doi.org/10.1186/s12939-019-1108-x",
        "Plouffe, L. (2015, 20 novembre). Les retombées vers les milieux : dans quelle mesure l’évaluation du transfert des connaissances est-elle possible? [Vidéo]. Institut de recherche Robert-Sauvé en santé et en sécurité du travail. https://www.irsst.qc.ca/publications-et-outils/video/i/100291/n/les-retombees-vers-les-milieux-dans-quelle-mesure-l-evaluation-du-transfert-des-connaissances-est-elle-possible-",
        "Pomey, M.-P., Flora, L., Karazivan, P., Dumez, V., Lebel, P., Vanier, M.-C., Débarges, B., Clavel, N., & Jouet, E. (2015). Le « Montreal model » : enjeux du partenariat relationnel entre patients et professionnels de la santé. Santé Publique, 27(1, suppl.), S41-S50. https://doi.org/10.3917/spub.150.0041",
        "Powell, B. J., Waltz, T. J., Chinman, M. J., Damschroder, L. J., Smith, J. L., Matthieu, M. M., Proctor, E. K., & Kirchner, J. E. (2015). A refined compilation of implementation strategies: Results from the Expert Recommendations for Implementing Change (ERIC) project. Implementation Science, 10, Article 21. https://doi.org/10.1186/s13012-015-0209-1",
        "Proctor, E., Silmere, H., Raghavan, R., Hovmand, P., Aarons, G., Bunger, A., Griffey, R., & Hensley, M. (2011). Outcomes for implementation research: Conceptual distinctions, measurement challenges, and research agenda. Administration and Policy in Mental Health and Mental Health Services Research, 38(2), 65–76. https://doi.org/10.1007/s10488-010-0319-7",
        "Pullmann, M., & King, K. (Animateurs). (2024, 8 juin). Season 2, Ep 1: David Chambers [Balado]. Dans That Implementation Science Podcast. Podbean. https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/",
        "Ridde, V., Hot, A., & Dagenais, C. (2025, 16 février). Pour mieux communiquer la science, commençons par bien choisir nos mots. The Conversation. https://theconversation.com/pour-mieux-communiquer-la-science-commencons-par-bien-choisir-nos-mots-247661",
        "Skipper, Y., & Pepler, D. J. (2020). Knowledge mobilization: Stepping into interdependent and relational space using co-creation. Action Research. Publication anticipée en ligne. https://doi.org/10.1177/1476750320960810",
        "Skivington, K., Matthews, L., Simpson, S. A., Craig, P., Baird, J., Blazeby, J. M., Boyd, K. A., Craig, N., French, D. P., McIntosh, E., Petticrew, M., Rycroft-Malone, J., White, M., & Moore, L. (2021). A new framework for developing and evaluating complex interventions: Update of Medical Research Council guidance. BMJ, 374, Article n2061. https://doi.org/10.1136/bmj.n2061",
        "Souffez, K., & Laurendeau, M.-C. (s. d.). Outil pour soutenir l’élaboration d’un plan de transfert des connaissances. Institut national de santé publique du Québec. https://www.inspq.qc.ca/sites/default/files/publications/outil_pour_soutenir_l_elaboration_d_un_plan_de_transfert_des_connaissances.pdf",
        "Staniszewska, S., Brett, J., Simera, I., Seers, K., Mockford, C., Goodlad, S., Altman, D. G., Moher, D., Barber, R., Denegri, S., Entwistle, A., Littlejohns, P., Morris, C., Suleman, R., Thomas, V., & Tysall, C. (2017). GRIPP2 reporting checklists: Tools to improve reporting of patient and public involvement in research. BMJ, 358, j3453. https://doi.org/10.1136/bmj.j3453",
        "Stoll, M., Kerwer, M., Lieb, K., & Chasiotis, A. (2022). Plain language summaries: A systematic review of theory, guidelines and empirical research. PLOS ONE, 17(6), Article e0268789. https://doi.org/10.1371/journal.pone.0268789",
        "Tchameni Ngamo, S., Souffez, K., Lord, C., & Dagenais, C. (2016). Do knowledge translation (KT) plans help to structure KT practices? Health Research Policy and Systems, 14, Article 46. https://doi.org/10.1186/s12961-016-0118-z",
        "Unité de soutien SSA Québec. (2025, 21 février). Expériences du midi: Recherche en partenariat avec une citoyenne-chercheuse [Vidéo]. YouTube. https://www.youtube.com/watch?v=TNwIcNyGjwY",
        "Villeneuve, V., & Tousignant, C. (Animatrices). (2024, 30 septembre). Patient partenaire : des alliés pour la recherche (Épisode 23) [Balado]. Dans Des femmes comme vous. Les Radieuses Magazine. https://www.youtube.com/watch?v=27KRzWNoxAA",
        "Ward, V. (2017). Why, whose, what and how? A framework for knowledge mobilisers. Evidence & Policy, 13(3), 477–497. https://doi.org/10.1332/174426416X14634763278725",
        "Ward, V., Smith, S., House, A., & Hamer, S. (2012). Exploring knowledge exchange: A useful framework for practice and policy. Social Science & Medicine, 74(3), 297-304. https://doi.org/10.1016/j.socscimed.2011.09.021",
        "Ziam, S., Lanoue, S., McSween-Cadieux, E., Gervais, M.-J., Lane, J., Gaid, D., Chouinard, L. J., Dagenais, C., Ridde, V., Jean, E., Fleury, F. C., Hong, Q. N., & Prigent, O. (2024). A scoping review of theories, models and frameworks used or proposed to evaluate knowledge mobilization strategies. Health Research Policy and Systems, 22, Article 8. https://doi.org/10.1186/s12961-023-01090-7"
      ]
    },
    "transfert": {
      "titre": "Transfert de connaissances et implantation",
      "detail": "Cinq temps",
      "etapes": [
        [
          "Écouter",
          "Construire la question avec les milieux",
          "Tout commence par l’écoute : repérer avec les milieux les besoins et les décisions à éclairer, puis préciser qui participe, à quel moment et avec quelle influence. Les plans de transfert négligent souvent la connaissance fine des publics (Tchameni Ngamo et al., 2016) ; l’application intégrée des connaissances, elle, associe les utilisateurs des résultats dès la formulation de la question (Jull et al., 2017). Le respect, la pertinence, la réciprocité et la responsabilité guident cette première rencontre (Kirkness et Barnhardt, 1991).",
          [
            "Besoins",
            "Participation"
          ]
        ],
        [
          "Faire circuler",
          "Contextualiser les savoirs",
          "Les savoirs de la recherche ne circulent pas seuls : ils rencontrent des savoirs d’expérience et de contexte qu’il faut mettre en dialogue plutôt qu’opposer (Breton, 2025). L’échange de connaissances est un processus social, fait d’allers-retours, et non une simple transmission (Ward et al., 2012). Adapter le format, le langage et le contenu aux usages visés passe par des résumés en langage clair (Stoll et al., 2022) et, souvent, par un courtier de connaissances qui fait le lien (Lomas, 2007).",
          [
            "Savoirs d’expérience",
            "Formats adaptés"
          ]
        ],
        [
          "Coconstruire",
          "Discuter les options et les choix",
          "Consulter recueille des avis ; coconstruire, c’est élaborer ensemble ; délibérer, c’est examiner des arguments et des arbitrages. Le dialogue délibératif transforme des résultats en options discutées par les personnes concernées (Boyko et al., 2012). Encore faut-il documenter l’influence réelle des contributions et reconnaître les coûts de la coproduction pour toutes les parties (Oliver et al., 2019), afin d’éviter une participation de façade (Gainforth et al., 2021).",
          [
            "Coconstruction",
            "Délibération"
          ]
        ],
        [
          "Implanter",
          "Accompagner la mise en œuvre",
          "Une pratique prometteuse ne s’implante pas d’elle-même : prouver son efficacité ne garantit pas son adoption (Bauer et Kirchner, 2020). Il faut examiner le contexte, les ressources et les obstacles avec des cadres comme le CFIR (Damschroder et al., 2022), puis choisir et décrire les stratégies d’accompagnement dans un vocabulaire partagé (Powell et al., 2015). Au Québec, l’implantation d’un accompagnement citoyen auprès des aînés en éclaire les facteurs favorables, les obstacles et les conditions essentielles (Gobeil et al., 2023).",
          [
            "Implantation",
            "CFIR"
          ]
        ],
        [
          "Évaluer",
          "Distinguer produire, utiliser et changer",
          "Un outil diffusé est une production ; son adoption est un résultat d’implantation ; les changements pour les services et les personnes sont d’autres résultats, à documenter séparément (Proctor et al., 2011). Plutôt que d’attribuer ces changements à la seule recherche, on suit sa contribution plausible en examinant les autres influences (Mayne, 2012 ; Morton, 2015). Des cadres francophones aident à rendre ces retombées visibles (Gervais et al., 2016).",
          [
            "Évaluation",
            "Impact"
          ]
        ]
      ],
      "note": "Ces cinq temps s’inspirent du modèle des connaissances à l’action (Graham et al., 2006) et du cadre de Ward (2017)."
    }
  },
  ressources: {
    "surtitre": "Ressources",
    "titre": "Articles, capsules et balados",
    "intro": "Une sélection commentée pour approfondir la mobilisation des connaissances et la science de l’implantation, en français et en anglais.",
    "langues": [
      "En français",
      "En anglais"
    ],
    "groupes": [
      [
        "Articles scientifiques en libre accès",
        [
          [
            "Making sense of implementation theories, models and frameworks",
            "Nilsen, Implementation Science, 2015 (anglais)",
            "https://doi.org/10.1186/s13012-015-0242-0",
            "La typologie qui range les théories, modèles et cadres en cinq familles (modèles de processus, cadres de déterminants, théories classiques, théories de l’implantation, cadres d’évaluation) selon ce qu’on cherche à faire : guider, expliquer ou évaluer."
          ],
          [
            "Community-based participatory research and integrated knowledge translation: advancing the co-creation of knowledge",
            "Jull, Giles et Graham, Implementation Science, 2017 (anglais)",
            "https://doi.org/10.1186/s13012-017-0696-3",
            "Met côte à côte la recherche participative communautaire et l’application intégrée des connaissances pour montrer où elles convergent, où elles divergent et ce que chacune peut emprunter à l’autre pour coconstruire des savoirs."
          ],
          [
            "The dos and don’ts of influencing policy: a systematic review of advice to academics",
            "Oliver et Cairney, Palgrave Communications, 2019 (anglais)",
            "https://doi.org/10.1057/s41599-019-0232-y",
            "Une revue systématique des conseils donnés aux chercheurs qui veulent influencer les politiques : ces conseils reposent rarement sur des données et passent sous silence les coûts et les risques de l’engagement politique."
          ],
          [
            "Connecting knowledge with action for health equity: a critical interpretive synthesis of promising practices",
            "Plamondon, Caxaj, Graham et Bottorff, International Journal for Equity in Health, 2019 (anglais)",
            "https://doi.org/10.1186/s12939-019-1108-x",
            "Une synthèse interprétative critique qui dégage des pratiques prometteuses pour relier savoirs et action en faveur de l’équité, en insistant sur la redistribution du pouvoir et sur les causes structurelles des inégalités."
          ],
          [
            "Quel impact avons-nous ? Vers l’élaboration d’un cadre pour rendre visibles les retombées du transfert des connaissances",
            "Gervais, Souffez et Ziam, Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 2016",
            "https://doi.org/10.18166/tuc.2016.1.1.5",
            "À partir de l’examen de 29 cadres conceptuels, jette en français les bases d’un cadre pour rendre visibles les retombées des activités de transfert et répondre aux exigences de reddition de comptes des organisations."
          ],
          [
            "Plain language summaries: A systematic review of theory, guidelines and empirical research",
            "Stoll, Kerwer, Lieb et Chasiotis, PLOS ONE, 2022 (anglais)",
            "https://doi.org/10.1371/journal.pone.0268789",
            "Fait le tour des théories, lignes directrices et études empiriques sur les résumés en langage clair et en tire un cadre conceptuel pour rédiger des synthèses compréhensibles par un public non spécialiste."
          ]
        ]
      ],
      [
        "Guides et outils",
        [
          [
            "Animer un processus de transfert des connaissances : bilan des connaissances et outil d’animation",
            "Nicole Lemire, Karine Souffez et Marie-Claire Laurendeau, Institut national de santé publique du Québec, 2009",
            "https://www.inspq.qc.ca/publications/1012",
            "Le guide québécois qui conçoit le transfert comme un processus dynamique et propose un outil d’animation et un aide-mémoire pour structurer chaque étape avec les acteurs concernés."
          ],
          [
            "Outil pour soutenir l’élaboration d’un plan de transfert des connaissances",
            "Karine Souffez et Marie-Claire Laurendeau, Institut national de santé publique du Québec, sans date (métadonnées du PDF : 2011)",
            "https://www.inspq.qc.ca/sites/default/files/publications/outil_pour_soutenir_l_elaboration_d_un_plan_de_transfert_des_connaissances.pdf",
            "Une grille à remplir en équipe, dès le début d’un projet, pour préciser les produits de connaissances, les publics, les acteurs à impliquer, puis les stratégies, les échéances et les ressources du plan de transfert."
          ],
          [
            "Guide pour accompagner l’implantation de pratiques prometteuses dans un établissement : soutien à l’implantation de pratiques prometteuses et au transfert de connaissances dans le réseau de la santé et des services sociaux",
            "Marie Massuard, sous la direction de Julie Lane, ministère de la Santé et des Services sociaux du Québec, 2023",
            "https://publications.msss.gouv.qc.ca/msss/fichiers/2023/23-516-04W.pdf",
            "Un guide ministériel québécois qui transpose la science de l’implantation et l’application intégrée des connaissances en démarche d’accompagnement concrète pour les établissements du réseau."
          ],
          [
            "Guide pratique – Stratégie de partenariat avec les patients et le public en recherche",
            "Geneviève David et Alexandre Grégoire, Unité de soutien SRAP du Québec et Centre d’excellence sur le partenariat avec les patients et le public (CEPPP), 2018",
            "https://ceppp.ca/wp-content/uploads/2021/01/USSQ_Guide-pratique-SPPP-en-recherche_V1.pdf",
            "Un guide de démarrage, coécrit par un coordonnateur patient, qui répond aux questions pourquoi, qui, quand, où, combien et comment engager des patients et le public dans un projet de recherche, avec l’évaluation et les enjeux éthiques."
          ]
        ]
      ],
      [
        "Balados",
        [
          [
            "Le pont entre la recherche et le terrain",
            "Les humains derrière la recherche en soins palliatifs, avec Chantal Verdon (UQO), 2025",
            "https://podcasts.apple.com/ca/podcast/le-pont-entre-la-recherche-et-le-terrain/id1608211841?i=1000736634362",
            "Une chercheuse en sciences infirmières explique comment elle a bâti un pont entre la recherche et la pratique, notamment par des communautés de pratique avec des infirmières et des infirmiers."
          ],
          [
            "Season 2, Ep 1: David Chambers",
            "That Implementation Science Podcast, animé par Mike Pullmann et Kevin King, 2024 (anglais)",
            "https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/",
            "Le directeur adjoint de la science de l’implantation au National Cancer Institute revient sur l’histoire du champ, sur le caractère collectif de la science et sur ce qui rend une équipe de recherche efficace."
          ],
          [
            "SCCM Pod-520: Implementation Science: From Evidence to Practice",
            "SCCM Podcast (Society of Critical Care Medicine), animé par Marilyn N. Bulloch avec Anne E. Sales, 2024 (anglais)",
            "https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice",
            "Une introduction accessible où une chercheuse présente la science de l’implantation comme l’étude du changement planifié des comportements dans les contraintes des organisations, exemples cliniques à l’appui."
          ]
        ]
      ],
      [
        "Capsules vidéo",
        [
          [
            "Ancrage historique et évolution du courtage de connaissances",
            "Équipe RENARD, présentation de Christian Dagenais et Saliha Ziam au colloque 31 du 90e congrès de l’Acfas, 2023",
            "https://www.youtube.com/watch?v=3uucW5ZOp-g",
            "Une courte présentation qui retrace d’où vient le courtage de connaissances et comment cette fonction a évolué, en guise d’entrée en matière sur le rôle de courtier."
          ],
          [
            "Les compétences clés pour agir en courtage de connaissances",
            "Équipe RENARD, présentation d’Esther McSween-Cadieux au colloque 31 du 90e congrès de l’Acfas, 2023",
            "https://www.youtube.com/watch?v=RGVmhf9Wyzo",
            "Fait le point sur les compétences dont une personne a besoin pour exercer le courtage de connaissances, un complément pratique aux textes sur le rôle de courtier."
          ],
          [
            "Expériences du midi: Recherche en partenariat avec une citoyenne-chercheuse",
            "Unité de soutien SSA Québec, webinaire avec Julie Coulombe et Marie-Hélène Morin, 2025",
            "https://www.youtube.com/watch?v=TNwIcNyGjwY",
            "Un cas concret de recherche menée avec une citoyenne-chercheuse sur la pair-aidance famille en santé mentale, qui montre ce que la science participative change à la conduite d’un projet."
          ],
          [
            "CCNMO - Prise de décisions fondée sur des données probantes",
            "Centre de collaboration nationale des méthodes et outils (CCNMO), 2016",
            "https://www.youtube.com/watch?v=XrZjc3Flrz8",
            "Présente en huit minutes le modèle du CCNMO, qui montre comment données de recherche, contexte local, préférences de la population et ressources se combinent dans une décision de santé publique."
          ],
          [
            "TIDIRC: Introduction to Dissemination & Implementation Science",
            "National Cancer Institute (TIDIRC OpenAccess), conférence de David Chambers, 2022 (anglais)",
            "https://www.youtube.com/watch?v=DO2tv7DqL3w",
            "Une conférence d’introduction qui distingue recherche sur la diffusion, diffusion de la recherche, recherche sur l’implantation et recherche pragmatique, et présente les concepts de base du champ."
          ],
          [
            "Quand l’expertise académique rencontre le vécu du terrain (Le Réverbère, mini-série sur la science citoyenne, épisode 2)",
            "Le Réverbère, Institut du Nouveau Monde avec le Fonds de recherche du Québec, 2026",
            "https://www.youtube.com/watch?v=J6gVGWA_yhc",
            "Des duos citoyen-chercheur racontent comment ils partagent les rôles dans un projet de recherche lancé par une question citoyenne, sans que l’un ou l’autre perde sa propre expertise."
          ],
          [
            "Ép. 23 - Patient Partenaire: des alliés pour la recherche",
            "Des femmes comme vous, Les Radieuses Magazine, avec Catherine Wilhelmy, 2024",
            "https://www.youtube.com/watch?v=27KRzWNoxAA",
            "Une patiente devenue responsable du partenariat dans un centre de recherche explique au grand public ce qu’est le mouvement patient partenaire et pourquoi le vécu des patients doit nourrir la recherche et les soins."
          ]
        ]
      ],
      [
        "Presse et magazines",
        [
          [
            "Communiquer efficacement les connaissances scientifiques permet de sauver des vies",
            "Christian Dagenais, Aurélie Hot et Valéry Ridde, The Conversation (Canada), 2023",
            "https://theconversation.com/communiquer-efficacement-les-connaissances-scientifiques-permet-de-sauver-des-vies-197191",
            "Défend l’idée que la recherche ne change les pratiques que si ses résultats parviennent aux décideurs sous une forme accessible et si le changement est accompagné dans la durée, avec l’appui des bailleurs de fonds."
          ],
          [
            "Pour mieux communiquer la science, commençons par bien choisir nos mots",
            "Valéry Ridde, Aurélie Hot et Christian Dagenais, The Conversation (Canada), 2025",
            "https://theconversation.com/pour-mieux-communiquer-la-science-commencons-par-bien-choisir-nos-mots-247661",
            "Montre comment la profusion de termes concurrents (transfert, application, mobilisation…) brouille la collaboration et le financement de ce champ, et plaide pour une clarification du vocabulaire."
          ],
          [
            "Recherche et politiques publiques : comment mieux faire circuler les savoirs ?",
            "Mohamed Berrada, Affaires universitaires, 2026",
            "https://www.affairesuniversitaires.ca/actualites/recherche-et-politiques-publiques-comment-mieux-faire-circuler-les-savoirs/",
            "Compte rendu d’un colloque de l’Acfas où universités, collèges, organismes et décideurs ont cherché comment rapprocher recherche et décisions publiques sans sacrifier le temps long de la recherche."
          ],
          [
            "Au-delà de l’acceptabilité sociale, ouvrir le dialogue pour favoriser la participation citoyenne au débat sur l’utilisation des données de santé",
            "Carole Jabet et Cécile Petitgand, Fonds de recherche du Québec, 2022",
            "https://frq.gouv.qc.ca/ouvrir-le-dialogue-pour-favoriser-la-participation-citoyenne/",
            "Tiré d’un colloque de l’Acfas, ce texte propose des dispositifs délibératifs, comme des groupes de travail régionaux ou des forums citoyens, pour associer le public aux décisions sur l’usage des données de santé."
          ],
          [
            "Construction et hiérarchisation des données probantes en santé : savoirs scientifiques, expérientiels et contextuels",
            "Marie-Dominique Beaulieu, Revue du CREMIS, 2016",
            "https://cremis.ca/publications/articles-et-medias/construction-et-hierarchisation-des-donnees-probantes-en-sante-savoirs-scientifiques-experientiels-et-contextuels/",
            "Revient sur l’essor de la médecine fondée sur les données probantes et sur la hiérarchie des preuves, et plaide pour intégrer plutôt qu’opposer savoirs scientifiques, expérientiels et contextuels dans les décisions en santé."
          ],
          [
            "Knowledge mobilization will help Canada face the next major challenge",
            "Ursula Gobel, Policy Options / Options politiques, 2021 (anglais)",
            "https://policyoptions.irpp.org/magazines/february-2021/knowledge-mobilization-will-help-canada-face-the-next-major-challenge/",
            "Une vice-présidente du CRSH tire de la pandémie l’idée que la synthèse des connaissances et des réseaux de recherche interdisciplinaires et intersectoriels sont indispensables pour éclairer les décisions publiques face aux crises."
          ],
          [
            "To Support Evidence-Based Policymaking, Bring Researchers and Policymakers Together",
            "D. Max Crowley et J. Taylor Scott, Issues in Science and Technology, 2023 (anglais)",
            "https://issues.org/evidence-based-policymaking-researchers-policymakers-collaborate-crowley-scott/",
            "Deux chercheurs décrivent un modèle de collaboration directe entre scientifiques et élus, fondé sur la confiance, et rapportent qu’il améliore la quantité et la qualité des données probantes mobilisées dans la législation."
          ]
        ]
      ]
    ]
  },
  publications: {
    "surtitre": "04 · Publications",
    "titre": "Publications et travaux en cours",
    "intro": "Communications scientifiques, mémoires soutenus et manuscrits en cours sont présentés ici avec leurs titres, auteurs et statuts respectifs.",
    "groupes": [
      {
        "titre": "Communications scientifiques",
        "items": [
          {
            "date": "Juin 2026",
            "statut": "Prix de la meilleure affiche · 3e cycle et postdoctorat",
            "titre": "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
            "detail": "Bernier, É., Sourial, N., Layani, G. · Groupe francophone en soins primaires (GFSP), Montréal · présentation par affiche"
          },
          {
            "date": "Mai 2026",
            "statut": "Affiche",
            "titre": "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec",
            "detail": "Bernier, É., Sourial, N., Layani, G. · CAHSPR, Ottawa"
          },
          {
            "date": "Avril 2026",
            "statut": "Affiche et 180 secondes",
            "titre": "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
            "detail": "Bernier, É., Sourial, N., Layani, G. · Réseau québécois de recherche sur le vieillissement (RQRV), Sherbrooke · affiche et vulgarisation en 180 secondes"
          }
        ]
      },
      {
        "titre": "Mémoires soutenus devant jury",
        "items": [
          {
            "date": "2025",
            "titre": "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec",
            "detail": "Master en droit · Université Paris Panthéon-Assas · direction : Benoît Apollis"
          },
          {
            "date": "2024",
            "titre": "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?",
            "detail": "Maîtrise en direction d’établissements · Université de Bretagne Occidentale · direction : Michelle-Hentic Giliberto"
          },
          {
            "date": "2023",
            "titre": "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement",
            "detail": "Diplôme d’État d’éducateur spécialisé · Académie de Rennes"
          }
        ]
      }
    ]
  },
  biographie: {
    "surtitre": "05 · Biographie",
    "titre": "Des expériences humaines aux transformations collectives",
    "intro": [
      "Éducateur spécialisé, juriste, entrepreneur et doctorant en santé publique, mon parcours s’est construit à la rencontre de différents univers : l’accompagnement des personnes, la gestion des organisations, le droit, les politiques publiques et la recherche.",
      "Derrière cette diversité se trouve une même ambition : **comprendre les mécanismes qui façonnent les trajectoires individuelles et collectives, pour contribuer à des sociétés plus justes, solidaires et capables de reconnaître les possibilités d’agir de chacun.**",
      "Mon cheminement, personnel comme professionnel, nourrit une conviction : les réalités humaines ne peuvent être dissociées des systèmes sociaux, organisationnels et politiques dans lesquels elles s’inscrivent.",
      "Il suit une dynamique ascendante : de l’accompagnement des personnes vers la transformation des organisations et des politiques de santé et de services sociaux, avec une orientation claire vers l’appui à la décision publique."
    ],
    "citation": "Les réalités humaines ne peuvent être dissociées des systèmes sociaux, organisationnels et politiques dans lesquels elles s’inscrivent.",
    "chapitres": [
      [
        "Se construire hors des trajectoires conventionnelles",
        [
          "Mon parcours commence en France, dans un milieu populaire, marqué notamment par une expérience de l’aide sociale à l’enfance et une déscolarisation à seize ans.",
          "Loin d’un cheminement académique conventionnel, j’ai progressivement construit ma trajectoire par le travail, l’exploration de différents milieux et la reprise d’études.",
          "Ces expériences, tout comme ma neuroatypie, ont nourri mon indépendance de pensée, ma capacité d’adaptation et mon intérêt pour les mécanismes de reproduction sociale, d’émancipation et de solidarité. Elles contribuent aujourd’hui à mon regard sur les institutions et sur la diversité des expériences humaines."
        ]
      ],
      [
        "La création, la rencontre et l’éthique du prendre soin",
        [
          "Mon intérêt pour la musique m’a conduit à entreprendre une licence en musicologie, parallèlement à mes premières expériences dans l’animation, puis à la responsabilité de séjours adaptés auprès de personnes en situation de handicap.",
          "Au-delà de leurs différences, ces univers m’ont permis d’explorer les rapports humains sous plusieurs dimensions : l’expression individuelle, la vie collective, l’accompagnement et la responsabilité envers autrui.",
          "Au fil de onze années d’engagement auprès de la vulnérabilité humaine, ces expériences ont progressivement donné une place centrale à l’éthique du *prendre soin*, à la reconnaissance des capacités individuelles et à l’importance d’un accompagnement qui favorise l’autonomie plutôt que la dépendance. Elles m’ont aussi montré la force des mécanismes de solidarité."
        ]
      ],
      [
        "De l’accompagnement à l’autodétermination",
        [
          "Après plusieurs années d’engagement sur le terrain, j’ai souhaité donner une nouvelle orientation à mon activité professionnelle, guidé par une réflexion sur l’utilité sociale et sur la place que je souhaitais occuper dans la société.",
          "J’ai ainsi repris des études en éducation spécialisée pour approfondir les fondements théoriques, éthiques et méthodologiques de l’accompagnement dans les secteurs social et médico-social, en recentrant ma pratique sur l’autodétermination et le « faire avec » les personnes.",
          "Mon mémoire de pratique professionnelle, consacré à l’influence des pratiques éducatives sur l’autodétermination, a constitué un tournant dans mon questionnement : **comment favoriser la liberté de choix des personnes lorsque les conditions de leur accompagnement sont aussi déterminées par le fonctionnement des institutions ?**"
        ]
      ],
      [
        "Comprendre les organisations pour transformer les pratiques",
        [
          "Cette interrogation m’a conduit à élargir ma réflexion aux organisations elles-mêmes.",
          "J’ai poursuivi une formation en direction et gestion des établissements sanitaires et médico-sociaux, ainsi qu’un diplôme universitaire en entrepreneuriat à l’IAE de Brest, obtenu en 2024.",
          "J’y ai approfondi les enjeux de management, de financement, de coordination, de ressources humaines et de conduite du changement. J’y ai constaté que les difficultés des structures, du financement au travail partenarial et au recrutement, étaient largement conditionnées par les politiques publiques de santé.",
          "J’ai surtout cherché à comprendre les conditions qui permettent aux professionnels de traduire leurs intentions en pratiques effectives, et aux organisations de concilier leurs contraintes avec les besoins des personnes."
        ]
      ],
      [
        "Du fonctionnement des institutions à la gouvernance des systèmes de santé",
        [
          "L’étude des organisations m’a amené à explorer les mécanismes qui orientent leurs décisions : les cadres juridiques, les politiques publiques, la planification, les dispositifs de financement et les modalités de gouvernance.",
          "J’ai poursuivi cette réflexion à l’Université Paris-Panthéon-Assas, en droit public, sanitaire et social, pour dépasser les problématiques gestionnaires et adopter une approche multiniveau du système de santé et des instruments juridiques de la solidarité nationale, puis comme chargé de projets à l’Agence nationale d’appui à la performance (ANAP).",
          "Cette expérience m’a permis de travailler à l’articulation entre orientations nationales et réalités opérationnelles, en traduisant ces orientations en dispositifs concrets, au contact des enjeux rencontrés par les gestionnaires, les professionnels et les usagers du système de santé.",
          "Elle a renforcé mon intérêt pour les difficultés de mise en œuvre des politiques publiques, particulièrement lorsque les réponses à apporter supposent de dépasser les frontières entre organisations et secteurs d’intervention. Consolidée par un mémoire de recherche, cette immersion a révélé les difficultés de mise en œuvre des modèles de soins et services intégrés, et la nécessité d’une approche intersectorielle et interdisciplinaire face aux pratiques en silos. J’ai alors sollicité plusieurs chercheurs québécois en leur présentant mes constats et un projet de mise en contraste des systèmes de santé, pour trouver des réponses aux difficultés de mise en œuvre du maintien à domicile."
        ]
      ],
      [
        "Produire des connaissances pour éclairer l’action collective",
        [
          "Aujourd’hui, mon doctorat en santé publique à l’Université de Montréal, sous la direction des Dres N. Sourial et G. Layani, prolonge ce cheminement.",
          "Mes travaux portent sur l’organisation des systèmes de santé et de services sociaux, les besoins sociaux des populations, les collaborations intersectorielles et les conditions de mise en œuvre de réponses intégrées, notamment dans le soutien à domicile.",
          "Mon approche est résolument interdisciplinaire et pragmatique. Elle vise à rapprocher les expériences vécues, les connaissances scientifiques et les réalités décisionnelles pour mieux comprendre les phénomènes étudiés et contribuer à la transformation des pratiques et des politiques publiques.",
          "Je porte une attention particulière aux populations en perte d’autonomie et éloignées des services, à la recherche partenariale, qui intègre les patients comme producteurs de savoirs, au transfert des connaissances et à leur mobilisation par les personnes, les professionnels, les organisations et les décideurs.",
          "Cette volonté de créer, d’expérimenter et de proposer se prolonge également dans l’entrepreneuriat, notamment à travers le développement d’**OWNNIGHT**, un projet en cours de création."
        ]
      ]
    ],
    "vision": {
      "titre": "Une vision qui relie les expériences, les savoirs et l’action",
      "paragraphes": [
        "Je crois que les savoirs académiques, professionnels et expérientiels gagnent à être confrontés plutôt que hiérarchisés.",
        "Mon parcours m’a permis de découvrir différentes strates de la société et du système de santé, d’y occuper des positions diverses et d’en observer les interactions. Cette pluralité de perspectives constitue aujourd’hui l’une des ressources de ma démarche scientifique.",
        "**La recherche représente pour moi un instrument de compréhension, mais aussi d’émancipation humaine, de justice sociale et d’appui à la décision collective.** Sa valeur réside autant dans la rigueur des connaissances produites que dans leur capacité à nourrir le débat, à éclairer les choix et à soutenir leur mise en œuvre.",
        "Elle s’inscrit dans les Objectifs de développement durable de l’Organisation des Nations Unies : l’amélioration du bien-être des aînés, la réduction des inégalités face au maintien à domicile et la consolidation d’institutions inclusives et responsables. À terme, mon ambition est de devenir un chercheur autonome, reconnu pour son engagement à articuler données probantes, dialogue entre parties prenantes et vulgarisation auprès du grand public.",
        "Curiosité intellectuelle, résilience, autonomie, sens critique, coconstruction et audace d’entreprendre sont autant de valeurs qui traversent mon cheminement.",
        "Je souhaite poursuivre cette exploration à l’interface des disciplines et des milieux, convaincu que les réponses aux défis contemporains de santé publique nécessitent de faire dialoguer les personnes, les savoirs et les institutions."
      ]
    },
    "conclusion": "Ad astra per aspera : par des sentiers ardus jusqu’aux étoiles."
  },
  parcours: {
    "surtitre": "06 · Le parcours",
    "titre": "Formations et expériences",
    "sousTitre": "Du terrain aux politiques de santé",
    "intro": "De l’éducation spécialisée au doctorat : les diplômes, les postes et les formations qui jalonnent le parcours.",
    "types": {
      "formation": "Formation",
      "experience": "Expérience",
      "entreprise": "Entrepreneuriat"
    },
    "etapes": [
      {
        "date": "En cours",
        "type": "entreprise",
        "titre": "Création d’OWNNIGHT · entrepreneur",
        "detail": "Application Android de bien-être et d’éducation au sommeil : plan individualisé, leçons et séances guidées."
      },
      {
        "date": "Depuis 2025",
        "type": "formation",
        "titre": "Doctorat en santé publique · ESPUM (Canada)",
        "detail": "École de santé publique de l’Université de Montréal (ESPUM), Canada. Option systèmes, organisations et politiques de santé (SOPS), 2e année. Stagiaire de recherche au Centre de recherche du CHUM (CRCHUM), Canada : soins primaires et intersectorialité.",
        "discret": "Moyenne cumulative : 4,1"
      },
      {
        "date": "Automne 2026",
        "type": "experience",
        "titre": "Auxiliaire d’enseignement · SPU 7001, ASA 6754 et ASA 6765",
        "detail": "Université de Montréal."
      },
      {
        "date": "Hiver 2026",
        "type": "experience",
        "titre": "Auxiliaire d’enseignement · ASA 6754",
        "detail": "Système de santé et santé des populations, Université de Montréal : accompagnement des étudiants, correction des examens écrits et oraux."
      },
      {
        "date": "2025",
        "type": "formation",
        "titre": "Master en droit public spécialisé en droit de la santé et droit social",
        "detail": "Droit public, droit social et droit de la santé · Université Paris Panthéon-Assas, mention spéciale du jury."
      },
      {
        "date": "2024–2025",
        "type": "experience",
        "titre": "Chargé de mission médico-sociale · ANAP (France)",
        "detail": "Agence nationale d’appui à la performance (ANAP), Paris (France). Copilotage du réseau des experts, animation de webinaires, recueil et analyse de données, animation et coconstruction de séances de communautés de pratique."
      },
      {
        "date": "2024",
        "type": "formation",
        "titre": "Maîtrise en direction d’établissements de santé · UBO (France)",
        "detail": "Université de Bretagne Occidentale (UBO), France, mention spéciale du jury."
      },
      {
        "date": "2024",
        "type": "experience",
        "titre": "Stage en direction d’EHPAD · Fondation Ildys",
        "detail": "Fondation Ildys, Landerneau (France). Stage auprès de la direction."
      },
      {
        "date": "2024",
        "type": "formation",
        "titre": "Diplôme universitaire en entrepreneuriat et management",
        "detail": "IAE de Brest, Institut d’administration des entreprises (France), mention spéciale du jury."
      },
      {
        "date": "2023",
        "type": "formation",
        "titre": "Diplôme d’État d’éducateur spécialisé",
        "detail": "Académie de Rennes."
      },
      {
        "date": "2020–2023",
        "type": "experience",
        "titre": "Éducateur spécialisé",
        "detail": "Foyer d’hébergement, Adapei 35, Saint-Malo : évaluer les besoins, coconstruire les projets individualisés, coordonner une équipe pluridisciplinaire."
      },
      {
        "date": "2016–2024",
        "type": "experience",
        "titre": "Directeur de séjours pour adultes en situation de handicap",
        "detail": "Séjours de vacances adaptés et séjours de répit pour personnes en situation de handicap, Brest (France) : coconstruction du projet pédagogique, accompagnement socioéducatif, activités de loisirs et suivi des traitements ; gestion des équipes, du budget et de la logistique."
      }
    ],
    "continue": {
      "titre": "Formation continue · 2026",
      "items": [
        "Conduite responsable de la recherche · CRCHUM",
        "Pratique d’auxiliaire de recherche · Université de Montréal",
        "MobilizeU, mobilisation des connaissances · Research Impact Canada et Université York"
      ]
    },
    "note": "Diplômes français évalués par le MIFI (Québec) et WES Canada."
  },
  engagements: {
    "surtitre": "07 · Engagements",
    "titre": "Représenter, contribuer, s’engager",
    "intro": "Une présence dans la vie étudiante et scientifique, en continuité avec le parcours.",
    "groupes": [
      {
        "titre": "Représentation étudiante",
        "items": [
          {
            "date": "Depuis 2026 · En cours",
            "titre": "Coordinateur au doctorat en santé publique · AÉÉSPUM",
            "detail": "Élu."
          },
          {
            "date": "En cours",
            "titre": "Coordination du mentorat solidaire · programme de doctorat en santé publique",
            "detail": "ESPUM, Université de Montréal."
          },
          {
            "date": "En cours",
            "titre": "Représentant étudiant au comité du programme de doctorat en santé publique",
            "detail": "ESPUM, Université de Montréal."
          },
          {
            "date": "Depuis 2026 · En cours",
            "titre": "Représentant étudiant du doctorat · DGEPS",
            "detail": "Département de gestion, d’évaluation et de politique de santé, ESPUM."
          },
          {
            "date": "Hiver 2026",
            "titre": "Ambassadeur de l’Université de Montréal"
          },
          {
            "date": "2022–2024",
            "titre": "Représentant élu au conseil d’administration du CROUS",
            "detail": "France."
          },
          {
            "date": "2021",
            "titre": "Président du bureau régional des étudiants en travail social d’Askoria",
            "detail": "France."
          }
        ]
      },
      {
        "titre": "Communauté scientifique",
        "items": [
          {
            "date": "En cours",
            "titre": "Comité scientifique étudiant du congrès de l’AÉÉSPUM",
            "detail": "Membre."
          },
          {
            "date": "Juin 2026",
            "titre": "Comité scientifique de la journée de la relève du GFSP",
            "detail": "Membre étudiant."
          }
        ]
      },
      {
        "titre": "Bourses et distinctions",
        "items": [
          {
            "date": "2026",
            "titre": "Prix de la meilleure présentation par affiche, 3e cycle et postdoctorat",
            "detail": "Journée de la relève, Groupe francophone en soins primaires."
          },
          {
            "date": "2025",
            "titre": "Bourse de doctorat du Fonds de recherche du Québec (B2)",
            "detail": "Bourse d’excellence, rang 3.",
            "lien": "https://doi.org/10.69777/2009461"
          },
          {
            "date": "2025",
            "titre": "Bourse de recrutement international",
            "detail": "Études supérieures et postdoctorales, Université de Montréal."
          },
          {
            "date": "2023–2025",
            "titre": "Trois mentions spéciales du jury",
            "detail": "Excellence académique."
          }
        ]
      },
      {
        "titre": "Engagement citoyen",
        "items": [
          {
            "date": "2023",
            "titre": "Sapeur-pompier volontaire",
            "detail": "Centre d’incendie et de secours de Dinard, France."
          },
          {
            "date": "2013",
            "titre": "Bénévolat et service civique",
            "detail": "Association de la fondation étudiante pour la ville (AFEV), France : coordination des étudiants bénévoles et accompagnement d’une jeune dans son parcours scolaire et culturel."
          }
        ]
      },
      {
        "titre": "Sports et loisirs",
        "items": [
          {
            "date": "Sport",
            "titre": "Pratique du marathon",
            "detail": "Marathons de Paris 2025 et 2026, marathon de Montréal 2026."
          },
          {
            "date": "Musique",
            "titre": "Piano, écriture musicale et guitare"
          },
          {
            "date": "Sport",
            "titre": "Hockey sur glace"
          },
          {
            "date": "Programmation",
            "titre": "Développement d’outils numériques"
          },
          {
            "date": "Culture",
            "titre": "Réflexions et vulgarisation scientifique",
            "detail": "Sciences de la vie et de la Terre, philosophie, géopolitique, science politique, physique, astronomie."
          }
        ]
      }
    ],
    "affiliations": {
      "titre": "Membre étudiant",
      "items": [
        "Chaire de recherche GSK en gestion optimale des maladies chroniques",
        "Groupe francophone en soins primaires (GFSP)",
        "Réseau québécois de recherche sur le vieillissement (RQRV)",
        "Canadian Association for Health Services and Policy Research (CAHSPR)",
        "Centre de recherche en santé publique (CReSP)",
        "Centre de recherche du CISSS de Chaudière-Appalaches",
        "Centre interuniversitaire de recherche en analyse des organisations (CIRANO)"
      ]
    }
  },
  contact: {
    surtitre: "Contact",
    titre: "Échanger des idées et des perspectives",
    intro: "Une idée, une lecture, une expérience à partager ou un projet à imaginer ? Je serai heureux d’en discuter avec vous.",
    courriel: COURRIEL,
    ecrire: "Écrire un courriel",
    liens: [
      ["CV académique", "PDF", "docs/cv-academique.pdf"],
      ["CV professionnel", "PDF", "docs/cv-professionnel.pdf"],
      ["ORCID", "0009-0001-4236-4932", ORCID],
      ["Affiche du projet de thèse", "Version accessible", AFFICHE],
    ],
    adresse: "École de santé publique de l’Université de Montréal · 7101, avenue du Parc, Montréal (Québec)",
  },
  pied: "© 2026 Éric Bernier",
  credits: "Images : portrait d’Éric Bernier, photographies Unsplash et illustrations numériques représentant des scènes fictives, non documentaires. Vue de Montréal depuis le mont Royal : Wilfredor, « Montreal Skyline from Mont Royal golden hour » (CC0), et Calvin411, « Panorama Montreal Skyline 2017 » (CC BY-SA 4.0, modifiée), Wikimedia Commons. Lecture à voix haute : Kyutai TTS (CC BY 4.0), voix de référence CML-TTS (Oliveira et al., 2023) et Alba MacKenna (CC BY 4.0).",
  introuvable: { titre: "Page introuvable", texte: "Cette page n’existe pas ou a été déplacée.", retour: "Revenir à l’accueil" },
};

/* ----------------------------------------------------------------- English */
const en = {
  lang: "en",
  locale: "en_CA",
  chemin: "../",
  meta: {
    titre: "Éric Bernier",
    description:
      "Éric Bernier, PhD student in public health (health systems, organisations and policy) at ESPUM, Université de Montréal, trained in law and special needs education, and an entrepreneur. Research on intersectoral responses to complex social needs in primary care.",
  },
  ui: {
    evitement: "Skip to content",
    sousTitre: "Public health · Governance · Management · Law · Social intervention and intersectoral action",
    navigation: "Main navigation",
    langue: "Language",
    entrer: "Step in",
    cv: "CV",
    hall: "Back to the hall",
    suivante: "Next door",
    contact: "Get in touch",
    haut: "Back to top",
    acces: "Accessibility",
    daltonisme: "Colour blindness",
    basseVision: "Low vision",
    contraste: "High contrast",
    taille: "Text size",
    plus: "Larger text",
    moins: "Smaller text",
    ecouter: "Listen",
    ecouterPage: "Listen to this page",
    arreter: "Stop reading",
    sansVoix: "Your device has no voice for this language.",
    falc: "Easy-to-read version (in French, FALC)",
    afficheAlt: "Preview of the thesis project poster, 120 × 120 cm",
    autresLangues: "Other languages",
  },
  nav: [
    [
      "recherche",
      "Research"
    ],
    [
      "conceptualisation",
      "Conceptualisation"
    ],
    [
      "approche",
      "Research stance"
    ],
    ["methodes", "Research methods"],
    [
      "valeurs",
      "Values"
    ],
    [
      "implantation",
      "Implementation"
    ],
    [
      "ressources",
      "Resources"
    ],
    [
      "publications",
      "Publications"
    ],
    [
      "biographie",
      "Biography"
    ],
    [
      "parcours",
      "Background"
    ],
    [
      "engagements",
      "Engagement"
    ],
    [
      "contact",
      "Contact"
    ]
  ],
  accueil: {
    surtitre: "PhD student in public health · ESPUM · CRCHUM",
    roles: "PhD student in public health (2nd year) · Jurist · Entrepreneur · Special needs educator",
    chapeau: {
      "titre": "From people to policy: an integrated view of health systems",
      "paragraphes": [
        "From supporting people to public health research, my path has led me to explore the different scales of the health system: from individual realities to organisations, all the way to public policy and governance.",
        "These experiences, at the crossroads of practice, management, law and research, have shaped a conviction: **transforming health systems means bringing human experiences, scientific knowledge, collective dynamics and political choices into dialogue.**",
        "My ambition is to **open doors between these worlds that sit side by side without always understanding one another**, to break down silos between perspectives and bring research closer to action, so as to foster self-determination, inform collective decisions and contribute to a fairer, healthier society."
      ]
    },
    encadrement:
      "PhD research currently being conceptualised, co-supervised by Nadia Sourial (PhD) and Géraldine Layani (MD) · GSK Research Chair in optimal management of chronic diseases · CRCHUM · FRQ doctoral scholar (B2)",
    visite: "Start the visit",
    explorer: "Browse freely",
    portrait: "Portrait of Éric Bernier",
  },
  hall: {
    "titre": "The hall",
    "compte": "10 doors",
    "consigne": "Click a door to step in",
    "portes": {
      "recherche": [
        "My thesis",
        "Doctoral project"
      ],
      "conceptualisation": [
        "Conceptualisation",
        "Research in progress: corpus and gaps"
      ],
      "approche": [
        "Research stance",
        "Pragmatic stance and multidisciplinary perspectives"
      ],
      "methodes": ["Research methods","Analyses, tools and methodological references"],
      "valeurs": [
        "Values",
        "What guides my practice"
      ],
      "implantation": [
        "Implementation",
        "Knowledge translation and implementation"
      ],
      "ressources": [
        "Resources",
        "Articles, videos, podcasts"
      ],
      "publications": [
        "Publications",
        "Presentations, theses, tools"
      ],
      "biographie": [
        "Biography",
        "From human experiences to collective change"
      ],
      "parcours": [
        "Background",
        "Education and experience"
      ],
      "engagements": [
        "Engagement",
        "Representation, research, awards, leisure"
      ]
    }
  },
  recherche: {
    surtitre: "01 · Research",
    etiquette: "Doctoral thesis in progress",
    avertissement: "Topic under development and subject to change",
    titre: "Organising the intersectoral response to complex and co-occurring social needs in primary care",
    sousTitre: "Network configurations adapted to the different profiles of patients in care",
    question:
      "How is the intersectoral response organised for the different profiles of primary care patients with complex and co-occurring social needs?",
    but: "The project aims to link each needs profile to a configuration of partners and to its coordinator, at the scale of a CLSC territory (local community health and social services centre).",
    faits: [
      ["Programme", "PhD in public health, health systems, organisations and policy option (SOPS) · 2nd year"],
      ["Institution", "School of Public Health, Université de Montréal (ESPUM)"],
      ["Chair", "GSK Research Chair in optimal management of chronic diseases"],
      ["Research centre", "CHUM Research Centre (CRCHUM) · research trainee"],
      ["Funding", "Fonds de recherche du Québec, doctoral scholarship (B2)"],
    ],
    codirection: {
      titre: "Co-supervision",
      profil: "CRCHUM profile",
      personnes: [
        { nom: "Dr. Nadia Sourial", grade: "PhD", lignes: ["Associate Professor, Department of Health Management, Evaluation and Policy, School of Public Health, Université de Montréal", "Principal scientist, CRCHUM, Health Innovation and Evaluation Hub"], chaire: "Co-holder, GSK Research Chair in optimal management of chronic diseases", lien: CRCHUM_SOURIAL },
        { nom: "Dr. Géraldine Layani", grade: "MD, MSc", lignes: ["Family physician, GMF-U Notre-Dame, Montréal", "Assistant clinical professor, Department of Family and Emergency Medicine, Université de Montréal", "Principal scientist, CRCHUM, Health Innovation and Evaluation Hub"], chaire: "Co-holder, GSK Research Chair in optimal management of chronic diseases", lien: CRCHUM_LAYANI },
      ],
    },
    affiche: ["See the project poster", "Accessible version: 5 languages, easy-to-read French, colour-blind friendly, low vision, audio", AFFICHE + "en/"],
    table: {
      titre: "Exploration table",
      detail: "The design in four steps",
      etapes: [
        ["Objective 1", "Which profiles?", "A scoping review", "Identify recurring profiles of social needs from published studies, then turn them into four to six vignettes: validated fictional situations.", ["Scoping review", "Vignettes"]],
        ["Objective 2", "Whom to involve?", "The CLSC ego network", "For each vignette, the CLSC sits at the centre: we identify the partners it would involve and the ties between them. The result is one configuration per profile.", ["Network analysis", "Ego network"]],
        ["Objective 2", "Why these choices?", "Interviews built on the network map", "Interviews use each network map to explain the observed choices, for instance: why are these partners so loosely connected?", ["Interviews", "Mixed methods"]],
        ["Objective 3", "What to recommend?", "A deliberative workshop", "Patient partners and actors from primary care, community organisations, local governance, municipalities and the private sector draw up recommendations for each profile.", ["Deliberation", "Patient partners"]],
      ],
      terminus: "Everything comes together in a joint display: one row per profile, with the network, the explanations and the recommendations.",
    },
    notions: {
      titre: "Three concepts",
      items: [
        ["Co-occurrence", "At least two social needs present at the same time. It is counted: it is the inclusion criterion.", "Kreuter et al., 2021"],
        ["Complexity", "The accumulation of chronic diseases, disabilities, mental health problems and social vulnerability. It is described, not required.", "Kuluski et al., 2017"],
        ["Intersectoral response", "Actions by sectors other than health, carried out with it: CLSC, family medicine groups, hospital, pharmacies, community organisations, municipality, schools, childcare centres. It is organised within a territory.", "Leppo et al., 2013; MSSS, 2017"],
      ],
    },
    retombees: {
      titre: "Expected outcomes",
      items: [
        ["For people", "a response tailored to their combination of needs."],
        ["For the CLSC and its partners", "guidance on whom to involve, how to connect and who coordinates."],
        ["For primary care policy", "a baseline and recommendations aligned with the roles of the CLSC."],
        ["For research", "a hypothesis linking the needs profile to the network."],
      ],
    },
    travaux: {
      titre: "Submitted manuscripts and works in preparation",
      intro: "Submitted papers and manuscripts being prepared alongside the thesis.",
      items: [
        { domaine: "Health systems and primary care", statut: "Submitted to BJGP Open", titre: TITRES_ORIGINAUX.hospit, auteurs: AUTEURS.hospit },
        {
          domaine: "Epistemology and knowledge translation",
          statut: "Under development · Awaiting collaboration",
          titre: TITRES_ORIGINAUX.epistemic,
          auteurs: "Bernier, É.",
          resume:
            "Research impact is usually pictured as a forward pathway, from knowledge to policy and practice. The article develops public health as a reflexive science of governance and specifies how consequences in practice and the situated knowledge of affected populations can acquire standing to require reconsideration of upstream categories, indicators and rules. The concept is translated into a documentary audit, tested on four institutional chains.",
          etiquettes: ["Epistemic return", "Reflexive governance", "Research impact"],
        },
        { domaine: "Governance and the public sphere", statut: "Manuscript in preparation", titre: TITRES_ORIGINAUX.pl2, auteurs: AUTEURS.pl2 },
        { domaine: "Health law", statut: "Manuscript in preparation", titre: TITRES_ORIGINAUX.droit, auteurs: "Bernier, É. · legal scholarship article" },
      ],
    },
  },
  conceptualisation: {
    "surtitre": "Research in progress",
    "titre": "Conceptualising the research project",
    "intro": "I am at the conceptualisation stage: a corpus of prioritised publications, the gaps it reveals and the training readings that support it.",
    "chiffres": [
      [
        222,
        "publications retained"
      ],
      [
        39,
        "priority readings"
      ],
      [
        83,
        "important readings"
      ],
      [
        9,
        "gap dimensions examined"
      ]
    ],
    "prioritesTitre": "Distribution by priority",
    "prioriteLibelle": "Priority",
    "provenanceTitre": "Sources of the publications",
    "provenance": [
      [
        "PubMed",
        112
      ],
      [
        "Embase and MEDLINE (Ovid)",
        95
      ],
      [
        "Cairn",
        15
      ]
    ],
    "lacunesTitre": "What the literature leaves open",
    "lacunesIntro": "For each of the nine dimensions examined, the table shows the state of the literature, the significance of the gap and a few key references.",
    "lacunes": [
      {
        "dimension": "Conceptualisation",
        "etat": "Present but not yet settled",
        "niveau": "Substantial",
        "score": 3,
        "constat": "Studies indexed in PubMed increasingly distinguish social risk, social need and desire for assistance. French-language work in Cairn adds a vocabulary of precariousness and social vulnerability that is often multidimensional but conceptually broader than unmet need.",
        "reperes": "Gruß 2021; Tucher 2026; Tudrej 2019; Karran 2023"
      },
      {
        "dimension": "Measurement",
        "etat": "Abundant but heterogeneous",
        "niveau": "Substantial",
        "score": 3,
        "constat": "Instruments differ markedly in their domains, thresholds and mode of administration. Multidimensional deprivation scores found in Cairn, such as EPICES and PRECAR, are not equivalent to unmet social needs questionnaires.",
        "reperes": "Zein 2026; Karran 2023; Tudrej 2019; Rogers 2025"
      },
      {
        "dimension": "Characterisation and prevalence",
        "etat": "Well documented for at least one need",
        "niveau": "Moderate",
        "score": 2,
        "constat": "Many studies describe prevalence by domain and cumulative burden, but estimates are difficult to compare when the definition of need and the instrument differ.",
        "reperes": "Jih 2023; Bleacher 2020; Fiori 2021"
      },
      {
        "dimension": "Multiplicity and co-occurrence",
        "etat": "Emerging but now demonstrated",
        "niveau": "Substantial",
        "score": 3,
        "constat": "The coexistence of several social needs or risks is common, and clusters, classes and cumulative burden measures have been proposed. A recent study also shows that multiple risks sharply increase the likelihood of wanting assistance.",
        "reperes": "Vest 2025; Kreuter 2021; Zeng 2024; Tucher 2026"
      },
      {
        "dimension": "Prioritisation by patients",
        "etat": "A few direct studies, but a field still underdeveloped",
        "niveau": "Major",
        "score": 4,
        "constat": "The literature mainly measures desire for assistance, negotiated goals, acceptability or relative priority, and recent work reinforces the distinction between detected risk and desired help. The e-CARE studies show support adjusted to the patient’s pace and priorities, without producing a standardised ranking of needs.",
        "reperes": "O’Loughlin 2022; Gruß 2021; Tucher 2026; Vasan 2026; Ouanhnon 2022"
      },
      {
        "dimension": "Interrelations between needs",
        "etat": "Mostly described as co-occurrence or overall complexity",
        "niveau": "Major",
        "score": 4,
        "constat": "Quantitative analyses mainly document co-occurrence and profiles. Qualitative French-language work in Cairn describes how social, administrative, economic and health difficulties are intertwined, but rarely their direction, sequence or causal mechanism.",
        "reperes": "Vest 2025; Kreuter 2021; Marron-Delabre 2015; Ouanhnon 2022"
      },
      {
        "dimension": "Resolution and trajectory",
        "etat": "Growing but dominated by intermediate indicators",
        "niveau": "Major",
        "score": 4,
        "constat": "The field increasingly distinguishes screening, referral, connection, receipt of a resource and resolution. French-language e-CARE studies also track concrete outcomes such as access to entitlements, a regular doctor, housing and autonomy in navigating care, but without a standardised measure of whether each need is resolved.",
        "reperes": "Steeves-Reece 2022; Hausmann 2024; Ouanhnon 2022; Agarwal 2025"
      },
      {
        "dimension": "Networks and cross-sector response",
        "etat": "Substantial literature, but often separate from patient data",
        "niveau": "Major for integration",
        "score": 4,
        "constat": "PubMed documents navigation, community health workers, medical-legal partnerships and closed-loop referral, while Cairn documents social units in general practice and French primary care and territorial coordination structures (MSP, CPTS, DAC). Yet the configuration of the network is rarely linked to need profiles and their resolution.",
        "reperes": "Hogg-Graham 2021; Tevaearai 2022; Yatim & Sebai 2021; Lessi 2023; Ouanhnon 2022"
      },
      {
        "dimension": "Integrated synthesis",
        "etat": "Not identified in the PubMed and Cairn audits",
        "niveau": "Principal gap",
        "score": 5,
        "constat": "No synthesis located brings together, for adults attending primary care, the unmet nature of needs, multi-domain measurement, patterns of co-occurrence, the priority patients give to their needs, interrelations between needs, the configuration of the mobilisable network and the trajectory to resolution.",
        "reperes": "Karran 2023; Vest 2025; Chang 2026; Tudrej 2019; Ouanhnon 2022"
      }
    ],
    "principaleTitre": "The principal gap",
    "principale": "The literature is not empty on each component of the question, whether the measurement of multiple social needs, their co-occurrence, patients’ desire for assistance or the services that respond to them. However, no synthesis identified brings together, for adults in primary care, the unmet nature of needs, their co-occurrence, their prioritisation by patients, their interrelations, the response network and the trajectory to resolution. The gap therefore lies in the link between how needs are configured and how the cross-sector response is configured, and in the mechanisms that explain why some needs persist despite being identified.",
    "vigilance": "For methodological accuracy, the wording used is ‘no synthesis identified in the PubMed and Cairn searches conducted’ rather than ‘no synthesis exists’.",
    "p5Titre": "The 39 priority readings",
    "p4Titre": "The 83 important readings",
    "formationTitre": "Formative readings",
    "cours": [
      [
        "MSO 6011 · Concepts and methods in epidemiology",
        [
          "Celentano, D. D., Szklo, M., & Youssef, M. K. F. Gordis Epidemiology (7th ed.). Elsevier.",
          "Szklo, M., & Nieto, F. J. (2018). Epidemiology: Beyond the basics (4th ed.). Jones & Bartlett Learning.",
          "Rothman, K. J. Epidemiology: An introduction (chapters 2 and 3).",
          "Oleckno, W. A. Epidemiology: Concepts and methods (chapter 6)."
        ]
      ],
      [
        "ASA 6754 · Health system and population health",
        [
          "Arpin, E., Gautier, L., & Quesnel-Vallée, A. (2025). Quebec: A health system profile. University of Toronto Press.",
          "Pineault, R. (2012). Comprendre le système de santé pour mieux le gérer. Presses de l’Université de Montréal."
        ]
      ],
      [
        "POL 6021 · Quantitative methods",
        [
          "Arel-Bundock, V. (2021). Analyse causale et méthodes quantitatives. Presses de l’Université de Montréal.",
          "Arel-Bundock, V. Model to meaning (chapters 3, 5, 6 and 10). https://marginaleffects.com",
          "Angrist, J. D., & Pischke, J.-S. (2015). Mastering ’metrics: The path from cause to effect. Princeton University Press."
        ]
      ]
    ],
    "note": "The corpus was assembled from Ovid (Embase, MEDLINE), PubMed and Cairn, and each publication was assigned a priority according to its relevance to the thesis question."
  },
  approche: {
    "surtitre": "Research stance",
    "titre": "Research stance",
    "intro": "A pragmatic, multidisciplinary stance that brings together the measurement of phenomena and the understanding of practices.",
    "piliers": [
      [
        "Pragmatic stance",
        "A stance that combines a positivist reading (measuring, estimating, testing hypotheses) with a constructivist one (understanding the meaning actors give to their practices). The question determines the method."
      ],
      [
        "Mixed methods",
        "Integrated quantitative and qualitative analyses: network analysis, regression, thematic analysis, document analysis and mapping, brought together in joint displays."
      ],
      [
        "Multidisciplinarity",
        "Public health, law, management, political science and social intervention: perspectives that inform one another to analyse the same system."
      ]
    ],
    "outils": {
      "titre": "Toolbox",
      "groupes": [
        [
          "Data analysis",
          [
            "Positron (R)",
            "Python",
            "NVivo",
            "QGIS",
            "Excel"
          ]
        ],
        [
          "Collaboration and facilitation",
          [
            "Miro",
            "Klaxoon",
            "Canva"
          ]
        ],
        [
          "Office tools",
          [
            "Office 365"
          ]
        ]
      ]
    },
    "methodes": {
      "titre": "Research methods in practice",
      "intro": "From question to observation: each question calls for its own data, analytical method and interpretation. I choose methods according to what needs to be understood, drawing on several disciplines.",
      "items": [
        {
          "titre": "Egocentric and sociocentric social network analysis",
          "texte": "Social network analysis describes the relationships between actors rather than their attributes alone. A sociocentric approach examines all ties within a bounded population; an egocentric approach starts from a respondent (ego) and the contacts this person names (alters). In my thesis, I start from the CLSC (local community service centre): its practitioners and managers name their contacts, who in turn respond, which makes it possible to cross-check the ties reported by partners. Vignettes reveal the potential network, that is, the partners who would be called upon; interactions over the past 12 months describe the actual network. Comparing the two sheds light on the intersectoral response to complex social needs in primary care.",
          "references": [
            "Perry, B. L., Pescosolido, B. A., & Borgatti, S. P. (2018). Egocentric network analysis: Foundations, methods, and models. Cambridge University Press. https://doi.org/10.1017/9781316443255",
            "Provan, K. G., Veazie, M. A., Staten, L. K., & Teufel-Shone, N. I. (2005). The use of network analysis to strengthen community partnerships. Public Administration Review, 65(5), 603–613. https://doi.org/10.1111/j.1540-6210.2005.00487.x",
            "Valente, T. W., Palinkas, L. A., Czaja, S., Chu, K.-H., & Brown, C. H. (2015). Social network analysis for program implementation. PLOS ONE, 10(6), Article e0131712. https://doi.org/10.1371/journal.pone.0131712"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12913-026-15347-8/MediaObjects/12913_2026_15347_Fig1_HTML.png",
              "page": "https://bmchealthservres.biomedcentral.com/articles/10.1186/s12913-026-15347-8",
              "legende": "Egocentric coordination network in municipal health promotion: the focal actor (ego) at the centre, linked to its contacts (alters).",
              "credit": "Figure 1 from Richter, Mamontova, and Kühne (2026), BMC Health Services Research, CC BY 4.0"
            },
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs13033-019-0328-1/MediaObjects/13033_2019_328_Fig2_HTML.png",
              "page": "https://ijmhs.biomedcentral.com/articles/10.1186/s13033-019-0328-1",
              "legende": "Sociocentric network of 27 mental health and social service organizations in Timor-Leste, based on frequency of contact over one year.",
              "credit": "Figure 2 from Hall et al. (2019), International Journal of Mental Health Systems, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Mapping and geographic information systems",
          "texte": "Mapping and geographic information systems (GIS) link data to their location in order to describe how services, needs and populations are distributed across a territory. Measures of potential accessibility, such as the two-step floating catchment area (2SFCA) method, relate service supply, demand and the distance between them. I acquired the foundations of this approach through a MOOC from the University of Geneva. In my thesis, mapping can be used to locate the organizations named in the network within the CLSC territory and to set the structure of ties against the distribution of services and needs.",
          "references": [
            "Guagliardo, M. F. (2004). Spatial accessibility of primary care: Concepts, methods and challenges. International Journal of Health Geographics, 3, Article 3. https://doi.org/10.1186/1476-072X-3-3",
            "Luo, W., & Wang, F. (2003). Measures of spatial accessibility to health care in a GIS environment: Synthesis and a case study in the Chicago region. Environment and Planning B: Planning and Design, 30(6), 865–884. https://doi.org/10.1068/b29120",
            "Ngui, A. N., & Apparicio, P. (2011). Optimizing the two-step floating catchment area method for measuring spatial accessibility to medical clinics in Montreal. BMC Health Services Research, 11, Article 166. https://doi.org/10.1186/1472-6963-11-166"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2F1472-6963-11-166/MediaObjects/12913_2010_Article_1671_Fig3_HTML.jpg",
              "page": "https://bmchealthservres.biomedcentral.com/articles/10.1186/1472-6963-11-166",
              "legende": "Spatial accessibility to medical clinics in Montreal using the 2SFCA method, conventional and optimized versions.",
              "credit": "Figure 3 from Ngui and Apparicio (2011), BMC Health Services Research, CC BY 2.0"
            },
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12942-017-0105-9/MediaObjects/12942_2017_105_Fig4_HTML.gif",
              "page": "https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-017-0105-9",
              "legende": "Location of health and social services in the Montreal metropolitan area in 2015, including CLSCs (map d).",
              "credit": "Figure 4 from Apparicio et al. (2017), International Journal of Health Geographics, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Reproducible programming: R and Python in Positron, and the shell",
          "texte": "Reproducible programming means carrying out every step of an analysis, from importing data to producing figures, in scripts that can be rerun and checked. I code in R and Python in Positron, Posit’s development environment, and chain processing steps on the command line in the shell. In R, the tidyverse structures data preparation; igraph and statnet build networks and compute centrality, density and cohesion; sf handles spatial data. Python complements this pipeline for data preparation and automation. Everything links network data, territorial data and figures within a single documented project.",
          "references": [
            "Handcock, M. S., Hunter, D. R., Butts, C. T., Goodreau, S. M., & Morris, M. (2008). statnet: Software tools for the representation, visualization, analysis and simulation of network data. Journal of Statistical Software, 24(1), 1–11. https://doi.org/10.18637/jss.v024.i01",
            "Pebesma, E. (2018). Simple features for R: Standardized support for spatial vector data. The R Journal, 10(1), 439–446. https://doi.org/10.32614/RJ-2018-009",
            "Wickham, H., Averick, M., Bryan, J., Chang, W., McGowan, L. D., François, R., Grolemund, G., Hayes, A., Henry, L., Hester, J., Kuhn, M., Pedersen, T. L., Miller, E., Bache, S. M., Müller, K., Ooms, J., Robinson, D., Seidel, D. P., Spinu, V., . . . Yutani, H. (2019). Welcome to the tidyverse. Journal of Open Source Software, 4(43), Article 1686. https://doi.org/10.21105/joss.01686"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12992-024-01055-7/MediaObjects/12992_2024_1055_Fig2_HTML.png",
              "page": "https://globalizationandhealth.biomedcentral.com/articles/10.1186/s12992-024-01055-7",
              "legende": "Network of organizations involved in preventing emerging zoonoses, coloured by sector; analysed with igraph and statnet, figure produced in R with ggraph.",
              "credit": "Figure 2 from Clifford Astbury et al. (2024), Globalization and Health, CC BY 4.0"
            },
            {
              "src": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/7b60/12169549/9225d6431677/pone.0325597.g001.jpg",
              "page": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0325597",
              "legende": "Sociograms of interactions between organizations in Guinea and Sierra Leone (malaria and COVID-19), produced in R with the tidyverse, tidygraph and ggraph.",
              "credit": "Figure 1 from Feddern et al. (2025), PLOS ONE, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Qualitative thematic and network analysis",
          "texte": "Thematic analysis identifies, organizes and interprets patterns of meaning in a corpus of interviews or documents, through an iterative process that moves from initial coding to the definition of themes. I carry out this coding in NVivo, which documents the coding tree, memos and successive groupings. In my thesis, map-guided interviews draw on interpretive description. The Framework Method combines deductive and inductive codes in a participants × themes matrix to compare sectors, network positions and profiles. Double coding of 20% of the material, a reflexive journal and feedback to participants are planned before integration and the deliberative workshop.",
          "references": [
            "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa",
            "Hogan, B., Carrasco, J. A., & Wellman, B. (2007). Visualizing personal networks: Working with participant-aided sociograms. Field Methods, 19(2), 116–144. https://doi.org/10.1177/1525822X06298589",
            "Hollstein, B. (2024). Qualitative and mixed methods. In J. McLevey, J. Scott, & P. J. Carrington (Eds.), The Sage handbook of social network analysis (2nd ed., pp. 562–574). Sage. https://doi.org/10.4135/9781529614695.n38"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12875-026-03322-5/MediaObjects/12875_2026_3322_Fig1_HTML.png",
              "page": "https://bmcprimcare.biomedcentral.com/articles/10.1186/s12875-026-03322-5",
              "legende": "Thematic map from a reflexive thematic analysis of interviews coded in NVivo, on access to primary care.",
              "credit": "Figure 1 from Instone et al. (2026), BMC Primary Care, CC BY 4.0"
            },
            {
              "src": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/4df6/8392189/3efc6c848b2a/ijerph-18-08372-g001.jpg",
              "page": "https://doi.org/10.3390/ijerph18168372",
              "legende": "Network map drawn during an interview and then digitized, in a qualitative analysis of an intersectoral health promotion network.",
              "credit": "Figure 1 from Fleuren, Thiel, and Frahsa (2021), International Journal of Environmental Research and Public Health, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Critical discourse analysis",
          "texte": "I conducted a qualitative analysis of Quebec physicians’ critical discourse during the debates on Bill 2. The purposive corpus comprises 42 press documents and press releases (Eureka database, May to December 2025), coded chronologically until the code structure stabilised. The analysis combines Fairclough’s three-dimensional model (the text, practices of production and circulation, the sociopolitical context), framing theory and the attribution of narrative roles: victims, villains and heroes. Every quotation is traced back to its source, and the analysis separates what the texts say from their sociological interpretation.",
          "references": [
            "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58. https://doi.org/10.1111/j.1460-2466.1993.tb01304.x",
            "Fairclough, N. (1995). Critical discourse analysis: The critical study of language. Longman.",
            "Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? Qualitative Health Research, 27(4), 591–608. https://doi.org/10.1177/1049732316665344",
            "Shanahan, E. A., Jones, M. D., & McBeth, M. K. (2018). How to conduct a Narrative Policy Framework study. The Social Science Journal, 55(3), 332–345. https://doi.org/10.1016/j.soscij.2017.12.002"
          ],
          "illustrations": [
            {
              "schema": [
                "Social practice: sociopolitical context",
                "Discursive practice: production and circulation",
                "Text"
              ],
              "legende": "Three-dimensional model of critical discourse analysis",
              "credit": "Diagram after Fairclough (1995)"
            }
          ]
        }
      ]
    },
    "expertises": {
      "titre": "Expertise",
      "items": [
        [
          "Management of health, social and medico-social establishments",
          "My master’s-level degree (maîtrise) in managing medico-social organisations and personal services (Université de Bretagne Occidentale, 2024, with special distinction from the jury) covers budgetary and financial management (CPOM, EPRD), accounting, human resource management and employment law, management, organisation theory and the sociology of organisations, philosophy and the institutional project. As manager of respite and adapted holidays from 2016 to 2024, I was responsible for their teams, budget and logistics."
        ],
        [
          "Health, social and medico-social law",
          "My master’s degree in public law, specialising in health law and social law (Université Paris-Panthéon-Assas, 2025, with special distinction from the jury), addresses the organisation and planning of the health, social and medico-social sectors: authorisation, approval, rate-setting and rate-setting litigation. It also covers patients’ and service users’ rights, bioethics, health economics, contracting, civil, criminal and administrative liability, and employment and social security law."
        ],
        [
          "Transformation of service provision and performance support",
          "As a project officer at the French national agency for performance support (ANAP, Paris) in 2024–2025, I supported the transformation of health and social service provision: co-leading the expert network, hosting webinars, collecting and analysing data, and facilitating and co-designing community of practice sessions."
        ],
        [
          "Ageing, autonomy and EHPAD",
          "My two master’s dissertations address this field: the adaptation of EHPAD (French care homes for dependent older people) to ageing people with disabilities (Université de Bretagne Occidentale, 2024), and the implementation of the shift to home-based care, in a comparative study of France and Quebec (‘Vieillir chez soi’, Université Paris-Panthéon-Assas, 2025). EHPAD experience and work at ANAP on the reform of home-based autonomy services complement them."
        ],
        [
          "Disability and self-determination",
          "As a special needs educator in a residential home (Adapei 35, Saint-Malo, 2020–2023), I assessed the needs of the people supported, co-designed their individual plans and coordinated a multidisciplinary team. My 2023 dissertation examines the influence of educational practices on self-determination. From 2016 to 2024, I was also manager of respite stays and adapted stays for people with disabilities."
        ],
        [
          "Autism",
          "My experience as a special needs educator in a residential home, at Adapei 35 in Saint-Malo from 2020 to 2023, includes supporting autistic people. This support rests on assessing each person’s specific needs, co-designing their individual plan with them and coordinating a multidisciplinary team around that plan."
        ],
        [
          "Research methodology and project evaluation",
          "As a doctoral candidate in public health at ESPUM (Université de Montréal), I use mixed methods, both quantitative and qualitative. One of my research areas concerns performance, change management and the steering of organisations. In project evaluation, I draw on my training (evaluation of establishments, objectives and resources contracts) and on the decision-support and steering tools developed at ANAP."
        ],
        [
          "Intersectoral action and primary care",
          "As a research trainee at the CHUM Research Centre (CRCHUM), I study primary care policy, intersectoral action and the integration of care and services. Intersectoral action refers to the concerted action of several sectors, such as health, social services, education or housing, on problems that extend beyond the remit of any one of them. This work links to my research area of comparative health systems analysis."
        ],
        [
          "Entrepreneurship and management",
          "Trained in entrepreneurship and management (university diploma, IAE de Brest, 2024), I have embarked on the creation of OWNNIGHT, a well-being and sleep education application. My approach to management draws on the clinical approach to organisations and on developing an organisation’s activity, both studied at master’s level, as well as on the hands-on leadership I exercised as manager of adapted holiday and respite stays."
        ]
      ]
    },
    "axes": {
      "titre": "Areas of work",
      "principaux": [
        "Governance and evaluation of health policy",
        "Intersectoral approaches in primary care",
        "Ageing, loss of autonomy and ageing-in-place policies"
      ],
      "secondairesTitre": "Secondary areas",
      "secondaires": [
        "Legal planning, doctrinal analysis and health law",
        "Performance, change management and organisational steering",
        "Comparative analysis of health systems"
      ]
    }
  },
  valeurs: {
    "surtitre": "Values",
    "titre": "What guides my practice",
    "intro": "Six values that guide my work, from practice to research.",
    "devise": [
      "Motto",
      "Ad astra per aspera",
      "Through hardships to the stars"
    ],
    "items": [
      [
        "Critical thinking",
        "Exploring other disciplines and ways of thinking, comparing ideas and questioning assumptions, data and institutions, starting with one’s own beliefs.",
        0
      ],
      [
        "Resilience",
        "Turning hardships into resources to move forward.",
        1
      ],
      [
        "Autonomy",
        "Thinking for oneself, and supporting everyone’s capacity to choose their own life.",
        2
      ],
      [
        "Co-constructing for the common good",
        "Doing with people, not for them: impactful research carried out with and for the people it concerns.",
        4
      ],
      [
        "Boldness to innovate",
        "Daring to propose, innovate, create and implement new responses.",
        5
      ],
      [
        "Equity",
        "Enabling everyone, as far as possible, to fully develop their capabilities and realise their own aspirations.",
        3
      ]
    ]
  },
  implantation: {
    "surtitre": "03 · Implementation",
    "titre": "Knowledge translation and implementation",
    "intro": "Moving knowledge between people, practice settings and research, then examining what it actually helps to change.",
    "precision": "In my thesis, knowledge mobilisation accompanies the research: it is neither an implementation study nor a policy evaluation.",
    "formation": {
      "etiquette": "Completed training",
      "titre": "MobilizeU, knowledge mobilisation · Research Impact Canada and York University, 2026",
      "lien": "https://researchimpact.ca/learning/mobilizeu/",
      "lienTexte": "Learn more"
    },
    "plan": {
      "titre": "In my thesis: a knowledge mobilisation plan",
      "items": [
        {
          "nom": "Why, what, to whom, how",
          "texte": "Ward’s framework structures the plan around four questions: clarify the what, the why and the who before choosing the how, the formats and the channels.",
          "ref": "Ward, 2017"
        },
        {
          "nom": "Knowledge to action",
          "texte": "The knowledge-to-action model frames the production, tailoring, communication and monitoring of knowledge, without claiming to secure lasting uptake.",
          "ref": "Graham et al., 2006"
        },
        {
          "nom": "Partnerships based on the 4Rs",
          "texte": "Respect, relevance, reciprocity and responsibility guide partnerships with patients and practice settings, drawing on the CIHR patient engagement framework.",
          "ref": "Kirkness & Barnhardt, 1991; CIHR, 2014; Bowen & Graham, 2013"
        },
        {
          "nom": "A deliberative dialogue",
          "texte": "A deliberative workshop turns findings into contextualised recommendations, with feedback to participants. Involvement is reported using GRIPP2.",
          "ref": "Boyko et al., 2012; Lavis et al., 2009; Staniszewska et al., 2017"
        },
        {
          "nom": "Tracking contribution, not attribution",
          "texte": "Four indicators (output, reach, uptake, documented use) and a log make it possible to assess the plausible contribution of the research without attributing later changes to it.",
          "ref": "Morton, 2015"
        }
      ]
    },
    "cadres": {
      "titre": "Landmarks in implementation science",
      "items": [
        {
          "nom": "CFIR 2.0",
          "texte": "Examining the context and the determinants that help or hinder implementation.",
          "ref": "Damschroder et al., 2022"
        },
        {
          "nom": "Implementation outcomes",
          "texte": "Distinguishing acceptability, adoption, appropriateness, feasibility, fidelity, cost, penetration and sustainability.",
          "ref": "Proctor et al., 2011"
        },
        {
          "nom": "Research impact",
          "texte": "Impact frameworks mostly map the forward path, from research to practice; my work also examines the way back.",
          "ref": "Greenhalgh et al., 2016; Brownson et al., 2026"
        },
        {
          "nom": "Contribution approach",
          "texte": "Linking outputs to uses, then to documented changes, while examining other possible influences.",
          "ref": "Morton, 2015; Bayley & Phipps, 2019"
        },
        {
          "nom": "Co-production and integrated knowledge translation",
          "texte": "Co-production mechanisms depend on infrastructure, role clarity and power sharing; their costs matter too.",
          "ref": "Graham et al., 2019; Kothari et al., 2025; Oliver et al., 2019"
        },
        {
          "nom": "Critical implementation science",
          "texte": "Theorising rather than applying frameworks as checklists.",
          "ref": "Kislov et al., 2019"
        },
        {
          "nom": "Participation and deliberation",
          "texte": "Designing and evaluating public participation processes that leave a record of their influence.",
          "ref": "Abelson et al., 2003; OECD, 2022"
        },
        {
          "nom": "Why implementation",
          "texte": "Proving that an innovation is effective is not enough to ensure that it will be adopted.",
          "ref": "Bauer & Kirchner, 2020"
        },
        {
          "nom": "Implementation strategies",
          "texte": "The ERIC compilation offers a common vocabulary of 73 strategies for describing, selecting and reporting the strategies used.",
          "ref": "Powell et al., 2015"
        },
        {
          "nom": "Complex interventions",
          "texte": "Implementation becomes a phase in its own right, with context, programme theory and stakeholders at the centre.",
          "ref": "Skivington et al., 2021"
        },
        {
          "nom": "Implementing with older adults",
          "texte": "In Quebec, the implementation of personalised citizen support for older adults’ social participation sheds light on the conditions that matter.",
          "ref": "Gobeil et al., 2023"
        }
      ]
    },
    "ressources": {
      "titre": "Resources",
      "items": [
        [
          "Knowledge mobilization glossary",
          "Canadian Institutes of Health Research (in French)",
          "https://cihr-irsc.gc.ca/f/54014.html"
        ],
        [
          "Patient engagement framework",
          "CIHR, Strategy for Patient-Oriented Research (in French)",
          "https://cihr-irsc.gc.ca/f/48413.html"
        ],
        [
          "Guidelines for citizen participation",
          "OECD, 2022",
          "https://doi.org/10.1787/f765caf6-en"
        ]
      ]
    },
    "chantiers": {
      "titre": "Eight areas of knowledge mobilisation",
      "intro": "Each area links the scientific literature to my practice.",
      "detail": "Scientific literature",
      "items": [
        [
          "Mobilize",
          "Moving knowledge both ways",
          "Mobilising is to circulate knowledge from research into settings, but also from settings and people into research. The knowledge-to-action model distinguishes the creation of knowledge and the cycle of its implementation: identifying a problem, adapting knowledge to the context, identifying barriers, supporting and monitoring its use (Graham et al., 2006). Five questions organise the approach: what to transfer, to whom, by whom, how and with what effect, and one mobilises first sets of evidence rather than an isolated study (Grimshaw et al., 2012). Knowledge brokerage gives a face to this linking work (Munerol et al., 2013).",
          [
            "Graham et al. (2006)",
            "Grimshaw et al. (2012)",
            "Ward et al. (2012)",
            "Munerol et al. (2013)"
          ]
        ],
        [
          "Frameworks",
          "Choosing a framework to fit the question",
          "A framework makes choices explicit: why mobilise, which knowledges, with whom and how (Ward, 2017). Theories, models and frameworks are grouped into families according to what one seeks to do: guide a process, explain what facilitates or hinders, or evaluate (Nilsen, 2015). Some place facilitation at the heart of implementation (Harvey & Kitson, 2016); others cover the entire cycle of knowledge application (Esmail et al., 2020). Choosing them according to the question, and discussing rather than ticking them off as a list, makes the approach more fruitful (Kislov et al., 2019).",
          [
            "Ward (2017)",
            "Nilsen (2015)",
            "Harvey & Kitson (2016)",
            "Esmail et al. (2020)"
          ]
        ],
        [
          "Planning",
          "Planning from the outset",
          "A mobilisation plan specifies the audiences, objectives, messages, activities, resources, timeline and indicators (IRSC, 2012). It is built with partners from the outset of the project: designing for dissemination and sustainability means thinking early about the fit between findings and their adoption context (Kwan et al., 2022). Real plans describe well the partners and strategies, but often forget evaluation and resources (Tchameni Ngamo et al., 2016). To start: know your audiences, surround yourself, involve people with lived experience and draw lessons from each trial (Diany et al., 2025; Dancause, 2023).",
          [
            "CIHR (2012)",
            "Tchameni Ngamo et al. (2016)",
            "Kwan et al. (2022)",
            "Diany et al. (2025)",
            "Dancause (2023)"
          ]
        ],
        [
          "Partnerships",
          "Co-producing and sharing power",
          "Co-production and integrated application of knowledge involve knowledge users at every stage, from question to dissemination (Jull et al., 2017). Partnership research approaches share common principles, strategies and outcomes, which a shared vocabulary allows to describe and compare (Hoekstra et al., 2020). Engagement is conceptualised across three levels, organisation, values and practices (Boaz et al., 2018), and rests on real interdependence and co-creation (Skipper & Pepler, 2020). It requires time and resources: its costs must be recognised (Oliver et al., 2019).",
          [
            "Jull et al. (2017)",
            "Boaz et al. (2018)",
            "Hoekstra et al. (2020)",
            "Skipper & Pepler (2020)",
            "Oliver et al. (2019)"
          ]
        ],
        [
          "Inclusion",
          "Who is heard, who takes part, who benefits",
          "An inclusive mobilisation questions the place of each: who is heard, who participates, who benefits (Georgalakis, 2023). Linking knowledge and action for equity requires redistributing power and addressing the structural causes of inequalities (Plamondon et al., 2019). Experiential knowledge is not a complement: it transforms the questions, methods and interpretation (Breton, 2025). In Indigenous health, promising practices respect the ways of sharing knowledge specific to communities (Morton Ninomiya et al., 2022); in the field of disability, co-constructed principles avoid token participation (Gainforth et al., 2021).",
          [
            "Plamondon et al. (2019)",
            "Morton Ninomiya et al. (2022)",
            "Gainforth et al. (2021)",
            "Breton (2025)",
            "Georgalakis (2023)"
          ]
        ],
        [
          "Audiences",
          "Choosing the format to fit the goal",
          "The format follows the aim: co-create (deliberative dialogue, world café, workshop), disseminate (exhibition, webinar, panel discussion) or implement (training, project meeting). Accessibility is considered in all its forms, physical, sensory, financial, cultural and linguistic: audiences must feel included, not just invited. The Montreal model recognises the experiential knowledge of patients as complementary to professional knowledge (Pomey et al., 2015), and many frameworks support the involvement of patients and the public in research (Greenhalgh et al., 2019). Clear language summaries (Stoll et al., 2022) and co-built visual art (Courcy et al., 2022) open research to other audiences.",
          [
            "Pomey et al. (2015)",
            "Greenhalgh et al. (2019)",
            "Stoll et al. (2022)",
            "Courcy et al. (2022)"
          ]
        ],
        [
          "Communicating",
          "Aiming for use as much as visibility",
          "Strategic communication and knowledge application overlap without merging: one supports visibility, the other use (Barwick et al., 2014). The knowledge broker works in between, building links between researchers and decision-makers rather than disseminating products (Lomas, 2007). In public policy, the relevance of data and organisational factors weigh heavily (Oliver et al., 2026), whereas advice given to researchers rarely rests on evidence and silences the costs of engagement (Oliver & Cairney, 2019). A brokerage intervention in a regional health agency shows that skills progress more quickly than influence on decisions (Fillol et al., 2026).",
          [
            "Lomas (2007)",
            "Barwick et al. (2014)",
            "Oliver & Cairney (2019)",
            "Oliver et al. (2026)",
            "Fillol et al. (2026)"
          ]
        ],
        [
          "Impact",
          "Tracking contribution, not attribution",
          "Evaluating impact is to follow the contribution of research to changes without attributing them solely to it: productions, scope, appropriation, documented uses, then outcomes for services and people (Morton, 2015). Contribution analysis offers a reasoned approach when strict causal attribution is out of reach (Mayne, 2012). French-speaking frameworks make visible the outcomes of transfer (Gervais et al., 2016), and a Quebec review lists the models used to evaluate mobilisation strategies (Ziam et al., 2024). There remains an open and debated question: to what extent is transfer evaluation possible (Plouffe, 2015)?",
          [
            "Mayne (2012)",
            "Morton (2015)",
            "Gervais et al. (2016)",
            "Ziam et al. (2024)",
            "Plouffe (2015)"
          ]
        ]
      ]
    },
    "bibliographie": {
      "titre": "References (APA)",
      "items": [
        "Abelson, J., Forest, P.-G., Eyles, J., Smith, P., Martin, E., & Gauvin, F.-P. (2003). Deliberations about deliberative methods: Issues in the design and evaluation of public participation processes. Social Science & Medicine, 57(2), 239–251. https://doi.org/10.1016/S0277-9536(02)00343-X",
        "Barwick, M., Phipps, D., Myers, G., Johnny, M., & Coriandoli, R. (2014). Knowledge translation and strategic communications: Unpacking differences and similarities for scholarly and research communications. Scholarly and Research Communication, 5(3). https://doi.org/10.22230/src.2014v5n3a175",
        "Bauer, M. S., & Kirchner, J. (2020). Implementation science: What is it and why should I care? Psychiatry Research, 283, Article 112376. https://doi.org/10.1016/j.psychres.2019.04.025",
        "Bayley, J. E., & Phipps, D. (2019). Building the concept of research impact literacy. Evidence & Policy, 15(4), 597–606. https://doi.org/10.1332/174426417X15034894876108",
        "Beaulieu, M.-D. (2016). Construction et hiérarchisation des données probantes en santé : savoirs scientifiques, expérientiels et contextuels. Revue du CREMIS, 9(2), 9-15. https://cremis.ca/publications/articles-et-medias/construction-et-hierarchisation-des-donnees-probantes-en-sante-savoirs-scientifiques-experientiels-et-contextuels/",
        "Berrada, M. (2026, 2 juin). Recherche et politiques publiques : comment mieux faire circuler les savoirs ? Affaires universitaires. https://www.affairesuniversitaires.ca/actualites/recherche-et-politiques-publiques-comment-mieux-faire-circuler-les-savoirs/",
        "Boaz, A., Hanney, S., Borst, R., O’Shea, A., & Kok, M. (2018). How to engage stakeholders in research: Design principles to support improvement. Health Research Policy and Systems, 16, Article 60. https://doi.org/10.1186/s12961-018-0337-6",
        "Bowen, S. J., & Graham, I. D. (2013). From knowledge translation to engaged scholarship: Promoting research relevance and utilization. Archives of Physical Medicine and Rehabilitation, 94(1 Suppl.), S3–S8. https://doi.org/10.1016/j.apmr.2012.04.037",
        "Boyko, J. A., Lavis, J. N., Abelson, J., Dobbins, M., & Carter, N. (2012). Deliberative dialogues as a mechanism for knowledge translation and exchange in health systems decision-making. Social Science & Medicine, 75(11), 1938–1945. https://doi.org/10.1016/j.socscimed.2012.06.016",
        "Breton, H. (2025). Savoirs expérientiels en santé : revue systématique de littérature. Santé Publique, 37(3), 241-251. https://doi.org/10.3917/spub.255.0241",
        "Brownson, R. C., Iwelunmor, J., Odeny, T. A., Proctor, E. K., & Geng, E. H. (2026). So what? Elevating the impact of implementation science. Implementation Science Communications, 7, 2. https://doi.org/10.1186/s43058-025-00831-9",
        "Bulloch, M. N. (Animatrice). (2024, 17 juillet). SCCM Pod-520: Implementation science: From evidence to practice [Balado]. Dans SCCM Podcast. Society of Critical Care Medicine. https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice",
        "Centre de collaboration nationale des méthodes et outils. (2016, 4 juillet). CCNMO - Prise de décisions fondée sur des données probantes [Vidéo]. YouTube. https://www.youtube.com/watch?v=XrZjc3Flrz8",
        "Courcy, I., Bureau, A., & Grenier, G. (2022). L’art visuel comme outil de pratique en mobilisation et transfert de connaissances : retour sur un projet de cocréation d’une murale alliant la recherche, l’art et des savoirs expérientiels. Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 6(3). https://doi.org/10.18166/tuc.2022.6.3.25",
        "Crowley, D. M., & Scott, J. T. (2023). To support evidence-based policymaking, bring researchers and policymakers together. Issues in Science and Technology, 39(2), 31-35. https://issues.org/evidence-based-policymaking-researchers-policymakers-collaborate-crowley-scott/",
        "Dagenais, C., Hot, A., & Ridde, V. (2023, 21 février). Communiquer efficacement les connaissances scientifiques permet de sauver des vies. The Conversation. https://theconversation.com/communiquer-efficacement-les-connaissances-scientifiques-permet-de-sauver-des-vies-197191",
        "Damschroder, L. J., Reardon, C. M., Widerquist, M. A. O., & Lowery, J. (2022). The updated Consolidated Framework for Implementation Research based on user feedback. Implementation Science, 17, 75. https://doi.org/10.1186/s13012-022-01245-0",
        "Dancause, L. (2023). Guide pédagogique sur la mobilisation des connaissances (L. Cardinal & J. Luckerhoff, dir.). Laboratoire interdisciplinaire de recherche sur l’enseignement supérieur. https://www.erudit.org/fr/livres/hors-collection/guide-pedagogique-sur-la-mobilisation-des-connaissances/",
        "David, G., & Grégoire, A. (2018). Guide pratique – Stratégie de partenariat avec les patients et le public en recherche. Unité de soutien SRAP du Québec. https://ceppp.ca/wp-content/uploads/2021/01/USSQ_Guide-pratique-SPPP-en-recherche_V1.pdf",
        "Diany, R., Fitzgibbon-Collins, L. K., & Gagliano Taliun, S. A. (2025). Ten simple rules for getting started with knowledge mobilization. PLOS Computational Biology, 21(4), e1012888. https://doi.org/10.1371/journal.pcbi.1012888",
        "Équipe RENARD. (2023, 26 mai). Ancrage historique et évolution du courtage de connaissances [Vidéo]. YouTube. https://www.youtube.com/watch?v=3uucW5ZOp-g",
        "Équipe RENARD. (2023, 29 mai). Les compétences clés pour agir en courtage de connaissances [Vidéo]. YouTube. https://www.youtube.com/watch?v=RGVmhf9Wyzo",
        "Esmail, R., Hanson, H. M., Holroyd-Leduc, J., Brown, S., Strifler, L., Straus, S. E., Niven, D. J., & Clement, F. M. (2020). A scoping review of full-spectrum knowledge translation theories, models, and frameworks. Implementation Science, 15, Article 11. https://doi.org/10.1186/s13012-020-0964-5",
        "Fillol, A., Traverson, L., Zitti, T., Bars, G., Minssieux, N., Hot, A., Dagenais, C., & Ridde, V. (2026). Évaluation d’une intervention de courtage de connaissances à l’Agence régionale de santé Île-de-France. Santé Publique, 38(1), 15-34. https://doi.org/10.3917/spub.261.0015",
        "Gainforth, H. L., Hoekstra, F., McKay, R., McBride, C. B., Sweet, S. N., Martin Ginis, K. A., Anderson, K., Chernesky, J., Clarke, T., Forwell, S., Maffin, J., McPhail, L. T., Mortenson, W. B., Scarrow, G., Schaefer, L., Sibley, K. M., Athanasopoulos, P., & Willms, R. (2021). Integrated knowledge translation guiding principles for conducting and disseminating spinal cord injury research in partnership. Archives of Physical Medicine and Rehabilitation, 102(4), 656-663. https://doi.org/10.1016/j.apmr.2020.09.393",
        "Georgalakis, J. (2023, 16 janvier). We need to talk about equity in knowledge mobilisation. Transforming Evidence. https://transforming-evidence.org/blog/we-need-to-talk-about-equity-in-knowledge-mobilisation",
        "Gervais, M.-J., Souffez, K., & Ziam, S. (2016). Quel impact avons-nous ? Vers l’élaboration d’un cadre pour rendre visibles les retombées du transfert des connaissances. Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 1(1). https://doi.org/10.18166/tuc.2016.1.1.5",
        "Gobeil, J., Gaumond, V., Germain, S., Vézina, A., Duguay, A.-M., & Levasseur, M. (2023). Implantation de l’Accompagnement-citoyen personnalisé d’intégration communautaire (APIC) : vers l’optimisation de la mise en œuvre de cette approche novatrice visant la participation sociale des aînés. Canadian Journal on Aging / La Revue canadienne du vieillissement, 42(4), 551-564. https://doi.org/10.1017/S0714980823000132",
        "Gobel, U. (2021, 8 février). Knowledge mobilization will help Canada face the next major challenge. Policy Options. https://policyoptions.irpp.org/magazines/february-2021/knowledge-mobilization-will-help-canada-face-the-next-major-challenge/",
        "Graham, I. D., Logan, J., Harrison, M. B., Straus, S. E., Tetroe, J., Caswell, W., & Robinson, N. (2006). Lost in knowledge translation: Time for a map? Journal of Continuing Education in the Health Professions, 26(1), 13–24. https://doi.org/10.1002/chp.47",
        "Graham, I. D., McCutcheon, C., & Kothari, A. (2019). Exploring the frontiers of research co-production: The Integrated Knowledge Translation Research Network concept papers. Health Research Policy and Systems, 17, 88. https://doi.org/10.1186/s12961-019-0501-7",
        "Greenhalgh, T., Hinton, L., Finlay, T., Macfarlane, A., Fahy, N., Clyde, B., & Chant, A. (2019). Frameworks for supporting patient and public involvement in research: Systematic review and co-design pilot. Health Expectations, 22(4), 785-801. https://doi.org/10.1111/hex.12888",
        "Greenhalgh, T., Raftery, J., Hanney, S., & Glover, M. (2016). Research impact: A narrative review. BMC Medicine, 14, 78. https://doi.org/10.1186/s12916-016-0620-8",
        "Grimshaw, J. M., Eccles, M. P., Lavis, J. N., Hill, S. J., & Squires, J. E. (2012). Knowledge translation of research findings. Implementation Science, 7, Article 50. https://doi.org/10.1186/1748-5908-7-50",
        "Harvey, G., & Kitson, A. (2016). PARIHS revisited: From heuristic to integrated framework for the successful implementation of knowledge into practice. Implementation Science, 11, Article 33. https://doi.org/10.1186/s13012-016-0398-2",
        "Hoekstra, F., Mrklas, K. J., Khan, M., McKay, R. C., Vis-Dunbar, M., Sibley, K. M., Nguyen, T., Graham, I. D., SCI Guiding Principles Consensus Panel, & Gainforth, H. L. (2020). A review of reviews on principles, strategies, outcomes and impacts of research partnerships approaches: A first step in synthesising the research partnership literature. Health Research Policy and Systems, 18, Article 51. https://doi.org/10.1186/s12961-020-0544-9",
        "Institut du Nouveau Monde. (2026, 31 mars). Quand l’expertise académique rencontre le vécu du terrain (Épisode 2) [Balado]. Dans Le Réverbère : mini-série sur la science citoyenne. YouTube. https://www.youtube.com/watch?v=J6gVGWA_yhc",
        "Instituts de recherche en santé du Canada. (2012). Guide de planification de l’application des connaissances aux IRSC : approches intégrées et de fin de subvention. https://irsc-cihr.gc.ca/f/documents/kt_lm_ktplan-fr.pdf",
        "Instituts de recherche en santé du Canada. (2014). Cadre d’engagement des patients de la Stratégie de recherche axée sur le patient. https://cihr-irsc.gc.ca/f/48413.html",
        "Jabet, C., & Petitgand, C. (2022, 21 juillet). Au-delà de l’acceptabilité sociale, ouvrir le dialogue pour favoriser la participation citoyenne au débat sur l’utilisation des données de santé. Fonds de recherche du Québec. https://frq.gouv.qc.ca/ouvrir-le-dialogue-pour-favoriser-la-participation-citoyenne/",
        "Jull, J., Giles, A., & Graham, I. D. (2017). Community-based participatory research and integrated knowledge translation: Advancing the co-creation of knowledge. Implementation Science, 12, Article 150. https://doi.org/10.1186/s13012-017-0696-3",
        "Kirkness, V. J., & Barnhardt, R. (1991). First Nations and higher education: The four R’s—Respect, relevance, reciprocity, responsibility. Journal of American Indian Education, 30(3), 1–15.",
        "Kislov, R., Pope, C., Martin, G. P., & Wilson, P. M. (2019). Harnessing the power of theorising in implementation science. Implementation Science, 14, 103. https://doi.org/10.1186/s13012-019-0957-4",
        "Kothari, A., Sibbald, S. L., McCutcheon, C., Berta, W., Urquhart, R., Horsley, T., Comer, L., & Graham, I. D. (2025). How does integrated knowledge translation work? A realist review. Health Research Policy and Systems, 23, 102. https://doi.org/10.1186/s12961-025-01374-0",
        "Kwan, B. M., Brownson, R. C., Glasgow, R. E., Morrato, E. H., & Luke, D. A. (2022). Designing for dissemination and sustainability to promote equitable impacts on health. Annual Review of Public Health, 43, 331-353. https://doi.org/10.1146/annurev-publhealth-052220-112457",
        "Lavis, J. N., Boyko, J. A., Oxman, A. D., Lewin, S., & Fretheim, A. (2009). SUPPORT Tools for evidence-informed health Policymaking (STP) 14: Organising and using policy dialogues to support evidence-informed policymaking. Health Research Policy and Systems, 7(Suppl. 1), S14. https://doi.org/10.1186/1478-4505-7-S1-S14",
        "Lemire, N., Souffez, K., & Laurendeau, M.-C. (2009). Animer un processus de transfert des connaissances : bilan des connaissances et outil d’animation. Institut national de santé publique du Québec. https://www.inspq.qc.ca/publications/1012",
        "Les humains derrière la recherche en soins palliatifs. (2025, 13 novembre). Le pont entre la recherche et le terrain [Balado]. Apple Podcasts. https://podcasts.apple.com/ca/podcast/le-pont-entre-la-recherche-et-le-terrain/id1608211841?i=1000736634362",
        "Lomas, J. (2007). The in-between world of knowledge brokering. BMJ, 334(7585), 129-132. https://doi.org/10.1136/bmj.39038.593380.AE",
        "Massuard, M. (2023). Guide pour accompagner l’implantation de pratiques prometteuses dans un établissement : soutien à l’implantation de pratiques prometteuses et au transfert de connaissances dans le réseau de la santé et des services sociaux (J. Lane, dir.). Ministère de la Santé et des Services sociaux. https://publications.msss.gouv.qc.ca/msss/fichiers/2023/23-516-04W.pdf",
        "Mayne, J. (2012). Contribution analysis: Coming of age? Evaluation, 18(3), 270-280. https://doi.org/10.1177/1356389012451663",
        "Morton Ninomiya, M. E., Maddox, R., Brascoupé, S., Robinson, N., Atkinson, D., Firestone, M., Ziegler, C., & Smylie, J. (2022). Knowledge translation approaches and practices in Indigenous health research: A systematic review. Social Science & Medicine, 301, Article 114898. https://doi.org/10.1016/j.socscimed.2022.114898",
        "Morton, S. (2015). Progressing research impact assessment: A “contributions” approach. Research Evaluation, 24(4), 405–419. https://doi.org/10.1093/reseval/rvv016",
        "Munerol, L., Cambon, L., & Alla, F. (2013). Le courtage en connaissances, définition et mise en œuvre : une revue de la littérature. Santé Publique, 25(5), 587-597. https://doi.org/10.3917/spub.135.0587",
        "NCI Scientific Events and Resources. (2022, 23 février). TIDIRC: Introduction to dissemination & implementation science [Vidéo]. YouTube. https://www.youtube.com/watch?v=DO2tv7DqL3w",
        "Nilsen, P. (2015). Making sense of implementation theories, models and frameworks. Implementation Science, 10, Article 53. https://doi.org/10.1186/s13012-015-0242-0",
        "OECD. (2022). OECD guidelines for citizen participation processes. OECD Publishing. https://doi.org/10.1787/f765caf6-en",
        "Oliver, K., & Cairney, P. (2019). The dos and don’ts of influencing policy: A systematic review of advice to academics. Palgrave Communications, 5, Article 21. https://doi.org/10.1057/s41599-019-0232-y",
        "Oliver, K., Kothari, A., & Mays, N. (2019). The dark side of coproduction: Do the costs outweigh the benefits for health research? Health Research Policy and Systems, 17, 33. https://doi.org/10.1186/s12961-019-0432-3",
        "Oliver, K., Malin, J., Akerlof, K. L., Day, E., Grant, S., McGill, E., Lorenc, T., Martin, P., Lam, J., Williamson, L. E., Mouthaan, M., Pleguezuelo, V. C., Iqbal, S., Jaques, L., Nyanchoka, M., Cesar Alejandre, J., Lane, L., Persson, E., Forde, H., . . . Falconer, J. (2026). What factors influence evidence use in policy? An updated systematic map. Humanities and Social Sciences Communications. Publication en ligne anticipée. https://doi.org/10.1057/s41599-026-08391-6",
        "Plamondon, K. M., Caxaj, C. S., Graham, I. D., & Bottorff, J. L. (2019). Connecting knowledge with action for health equity: A critical interpretive synthesis of promising practices. International Journal for Equity in Health, 18, Article 202. https://doi.org/10.1186/s12939-019-1108-x",
        "Plouffe, L. (2015, 20 novembre). Les retombées vers les milieux : dans quelle mesure l’évaluation du transfert des connaissances est-elle possible? [Vidéo]. Institut de recherche Robert-Sauvé en santé et en sécurité du travail. https://www.irsst.qc.ca/publications-et-outils/video/i/100291/n/les-retombees-vers-les-milieux-dans-quelle-mesure-l-evaluation-du-transfert-des-connaissances-est-elle-possible-",
        "Pomey, M.-P., Flora, L., Karazivan, P., Dumez, V., Lebel, P., Vanier, M.-C., Débarges, B., Clavel, N., & Jouet, E. (2015). Le « Montreal model » : enjeux du partenariat relationnel entre patients et professionnels de la santé. Santé Publique, 27(1, suppl.), S41-S50. https://doi.org/10.3917/spub.150.0041",
        "Powell, B. J., Waltz, T. J., Chinman, M. J., Damschroder, L. J., Smith, J. L., Matthieu, M. M., Proctor, E. K., & Kirchner, J. E. (2015). A refined compilation of implementation strategies: Results from the Expert Recommendations for Implementing Change (ERIC) project. Implementation Science, 10, Article 21. https://doi.org/10.1186/s13012-015-0209-1",
        "Proctor, E., Silmere, H., Raghavan, R., Hovmand, P., Aarons, G., Bunger, A., Griffey, R., & Hensley, M. (2011). Outcomes for implementation research: Conceptual distinctions, measurement challenges, and research agenda. Administration and Policy in Mental Health and Mental Health Services Research, 38(2), 65–76. https://doi.org/10.1007/s10488-010-0319-7",
        "Pullmann, M., & King, K. (Animateurs). (2024, 8 juin). Season 2, Ep 1: David Chambers [Balado]. Dans That Implementation Science Podcast. Podbean. https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/",
        "Ridde, V., Hot, A., & Dagenais, C. (2025, 16 février). Pour mieux communiquer la science, commençons par bien choisir nos mots. The Conversation. https://theconversation.com/pour-mieux-communiquer-la-science-commencons-par-bien-choisir-nos-mots-247661",
        "Skipper, Y., & Pepler, D. J. (2020). Knowledge mobilization: Stepping into interdependent and relational space using co-creation. Action Research. Publication anticipée en ligne. https://doi.org/10.1177/1476750320960810",
        "Skivington, K., Matthews, L., Simpson, S. A., Craig, P., Baird, J., Blazeby, J. M., Boyd, K. A., Craig, N., French, D. P., McIntosh, E., Petticrew, M., Rycroft-Malone, J., White, M., & Moore, L. (2021). A new framework for developing and evaluating complex interventions: Update of Medical Research Council guidance. BMJ, 374, Article n2061. https://doi.org/10.1136/bmj.n2061",
        "Souffez, K., & Laurendeau, M.-C. (s. d.). Outil pour soutenir l’élaboration d’un plan de transfert des connaissances. Institut national de santé publique du Québec. https://www.inspq.qc.ca/sites/default/files/publications/outil_pour_soutenir_l_elaboration_d_un_plan_de_transfert_des_connaissances.pdf",
        "Staniszewska, S., Brett, J., Simera, I., Seers, K., Mockford, C., Goodlad, S., Altman, D. G., Moher, D., Barber, R., Denegri, S., Entwistle, A., Littlejohns, P., Morris, C., Suleman, R., Thomas, V., & Tysall, C. (2017). GRIPP2 reporting checklists: Tools to improve reporting of patient and public involvement in research. BMJ, 358, j3453. https://doi.org/10.1136/bmj.j3453",
        "Stoll, M., Kerwer, M., Lieb, K., & Chasiotis, A. (2022). Plain language summaries: A systematic review of theory, guidelines and empirical research. PLOS ONE, 17(6), Article e0268789. https://doi.org/10.1371/journal.pone.0268789",
        "Tchameni Ngamo, S., Souffez, K., Lord, C., & Dagenais, C. (2016). Do knowledge translation (KT) plans help to structure KT practices? Health Research Policy and Systems, 14, Article 46. https://doi.org/10.1186/s12961-016-0118-z",
        "Unité de soutien SSA Québec. (2025, 21 février). Expériences du midi: Recherche en partenariat avec une citoyenne-chercheuse [Vidéo]. YouTube. https://www.youtube.com/watch?v=TNwIcNyGjwY",
        "Villeneuve, V., & Tousignant, C. (Animatrices). (2024, 30 septembre). Patient partenaire : des alliés pour la recherche (Épisode 23) [Balado]. Dans Des femmes comme vous. Les Radieuses Magazine. https://www.youtube.com/watch?v=27KRzWNoxAA",
        "Ward, V. (2017). Why, whose, what and how? A framework for knowledge mobilisers. Evidence & Policy, 13(3), 477–497. https://doi.org/10.1332/174426416X14634763278725",
        "Ward, V., Smith, S., House, A., & Hamer, S. (2012). Exploring knowledge exchange: A useful framework for practice and policy. Social Science & Medicine, 74(3), 297-304. https://doi.org/10.1016/j.socscimed.2011.09.021",
        "Ziam, S., Lanoue, S., McSween-Cadieux, E., Gervais, M.-J., Lane, J., Gaid, D., Chouinard, L. J., Dagenais, C., Ridde, V., Jean, E., Fleury, F. C., Hong, Q. N., & Prigent, O. (2024). A scoping review of theories, models and frameworks used or proposed to evaluate knowledge mobilization strategies. Health Research Policy and Systems, 22, Article 8. https://doi.org/10.1186/s12961-023-01090-7"
      ]
    },
    "transfert": {
      "titre": "Knowledge translation and implementation",
      "detail": "Five stages",
      "etapes": [
        [
          "Listen",
          "Framing the question with practice settings",
          "Everything starts with listening: identifying with the communities the needs and decisions to be informed, then specifying who participates, when and with what influence. Transfer plans often neglect fine-grained knowledge of the public (Tchameni Ngamo et al., 2016); integrated knowledge application, on the other hand, involves users of the results from the formulation of the question (Jull et al., 2017). Respect, relevance, reciprocity and responsibility guide this first encounter (Kirkness & Barnhardt, 1991).",
          [
            "Needs",
            "Participation"
          ]
        ],
        [
          "Circulate",
          "Putting knowledge in context",
          "Research knowledge does not circulate on its own: it meets experiential and contextual knowledge that needs to be put into dialogue rather than opposed (Breton, 2025). The exchange of knowledge is a social process, made of back-and-forth interactions, and not a simple transmission (Ward et al., 2012). Adapting the format, language and content to the intended uses involves clear language summaries (Stoll et al., 2022) and, often, a knowledge broker who makes the link (Lomas, 2007).",
          [
            "Lived experience",
            "Adapted formats"
          ]
        ],
        [
          "Co-design",
          "Discussing options and choices",
          "Consulting gathers opinions; co-constructing is developing together; deliberating is examining arguments and making decisions. Deliberative dialogue transforms findings into discussed options by the concerned people (Boyko et al., 2012). Yet it is still necessary to document the real influence of contributions and to recognise the costs of co-production for all parties (Oliver et al., 2019), in order to avoid token participation (Gainforth et al., 2021).",
          [
            "Co-design",
            "Deliberation"
          ]
        ],
        [
          "Implement",
          "Supporting implementation",
          "A promising practice does not implement itself: proving its effectiveness does not guarantee its adoption (Bauer & Kirchner, 2020). One must examine the context, resources and obstacles using frameworks such as CFIR (Damschroder et al., 2022), then choose and describe the support strategies in a shared vocabulary (Powell et al., 2015). In Quebec, the implementation of a citizen support approach for the elderly illuminates the favourable factors, obstacles and essential conditions (Gobeil et al., 2023).",
          [
            "Implementation",
            "CFIR"
          ]
        ],
        [
          "Evaluate",
          "Telling producing, using and changing apart",
          "A disseminated tool is a product; its adoption is an implementation outcome; changes for services and people are other outcomes, to be documented separately (Proctor et al., 2011). Rather than attributing these changes to the research alone, we follow its plausible contribution by examining other influences (Mayne, 2012; Morton, 2015). French-speaking frameworks help to make these outcomes visible (Gervais et al., 2016).",
          [
            "Evaluation",
            "Impact"
          ]
        ]
      ],
      "note": "These five stages draw on the knowledge-to-action model (Graham et al., 2006) and Ward’s framework (2017)."
    }
  },
  ressources: {
    "surtitre": "Resources",
    "titre": "Articles, videos and podcasts",
    "intro": "An annotated selection to explore knowledge mobilisation and implementation science further, in French and English.",
    "langues": [
      "In French",
      "In English"
    ],
    "groupes": [
      [
        "Open-access scientific articles",
        [
          [
            "Making sense of implementation theories, models and frameworks",
            "Nilsen, Implementation Science, 2015",
            "https://doi.org/10.1186/s13012-015-0242-0",
            "The typology that sorts theories, models and frameworks into five families (process models, determinant frameworks, classic theories, implementation theories, evaluation frameworks) according to what one seeks to do: guide, explain or evaluate."
          ],
          [
            "Community-based participatory research and integrated knowledge translation: advancing the co-creation of knowledge",
            "Jull, Giles and Graham, Implementation Science, 2017",
            "https://doi.org/10.1186/s13012-017-0696-3",
            "Sets community-based participatory research and integrated knowledge translation side by side to show where they converge, where they diverge and what each can borrow from the other to co-create knowledge."
          ],
          [
            "The dos and don’ts of influencing policy: a systematic review of advice to academics",
            "Oliver and Cairney, Palgrave Communications, 2019",
            "https://doi.org/10.1057/s41599-019-0232-y",
            "A systematic review of the advice given to academics who want to influence policy: this advice is rarely based on evidence and says little about the costs and risks of engaging with policy."
          ],
          [
            "Connecting knowledge with action for health equity: a critical interpretive synthesis of promising practices",
            "Plamondon, Caxaj, Graham and Bottorff, International Journal for Equity in Health, 2019",
            "https://doi.org/10.1186/s12939-019-1108-x",
            "A critical interpretive synthesis that identifies promising practices for connecting knowledge with action for equity, with an emphasis on redistributing power and on the structural causes of inequities."
          ],
          [
            "Quel impact avons-nous ? Vers l’élaboration d’un cadre pour rendre visibles les retombées du transfert des connaissances",
            "Gervais, Souffez and Ziam, Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 2016 (in French)",
            "https://doi.org/10.18166/tuc.2016.1.1.5",
            "Drawing on a review of 29 conceptual frameworks, lays the groundwork, in French, for a framework that makes the impacts of knowledge transfer activities visible and meets organisations’ accountability requirements."
          ],
          [
            "Plain language summaries: A systematic review of theory, guidelines and empirical research",
            "Stoll, Kerwer, Lieb and Chasiotis, PLOS ONE, 2022",
            "https://doi.org/10.1371/journal.pone.0268789",
            "Surveys theories, guidelines and empirical studies on plain language summaries and derives a conceptual framework for writing summaries that a non-specialist audience can understand."
          ]
        ]
      ],
      [
        "Guides and tools",
        [
          [
            "Animer un processus de transfert des connaissances : bilan des connaissances et outil d’animation",
            "Nicole Lemire, Karine Souffez and Marie-Claire Laurendeau, Institut national de santé publique du Québec, 2009 (in French)",
            "https://www.inspq.qc.ca/publications/1012",
            "The Quebec guide that frames knowledge transfer as a dynamic process and offers a facilitation tool and a checklist for structuring each stage with the stakeholders concerned."
          ],
          [
            "Outil pour soutenir l’élaboration d’un plan de transfert des connaissances",
            "Karine Souffez and Marie-Claire Laurendeau, Institut national de santé publique du Québec, undated (PDF metadata: 2011) (in French)",
            "https://www.inspq.qc.ca/sites/default/files/publications/outil_pour_soutenir_l_elaboration_d_un_plan_de_transfert_des_connaissances.pdf",
            "A grid for teams to complete at the start of a project, to specify the knowledge products, the audiences and the actors to involve, then the strategies, deadlines and resources of the transfer plan."
          ],
          [
            "Guide pour accompagner l’implantation de pratiques prometteuses dans un établissement : soutien à l’implantation de pratiques prometteuses et au transfert de connaissances dans le réseau de la santé et des services sociaux",
            "Marie Massuard, under the direction of Julie Lane, Ministère de la Santé et des Services sociaux du Québec, 2023 (in French)",
            "https://publications.msss.gouv.qc.ca/msss/fichiers/2023/23-516-04W.pdf",
            "A Quebec ministry guide that turns implementation science and integrated knowledge translation into a practical support process for institutions in the health and social services network."
          ],
          [
            "Guide pratique – Stratégie de partenariat avec les patients et le public en recherche",
            "Geneviève David and Alexandre Grégoire, Unité de soutien SRAP du Québec and Centre d’excellence sur le partenariat avec les patients et le public (CEPPP), 2018 (in French)",
            "https://ceppp.ca/wp-content/uploads/2021/01/USSQ_Guide-pratique-SPPP-en-recherche_V1.pdf",
            "A starter guide, co-written by a patient coordinator, that answers why, who, when, where, how much and how to engage patients and the public in a research project, including evaluation and ethical issues."
          ]
        ]
      ],
      [
        "Podcasts",
        [
          [
            "Le pont entre la recherche et le terrain",
            "Les humains derrière la recherche en soins palliatifs, with Chantal Verdon (UQO), 2025 (in French)",
            "https://podcasts.apple.com/ca/podcast/le-pont-entre-la-recherche-et-le-terrain/id1608211841?i=1000736634362",
            "A nursing researcher explains how she built a bridge between research and practice, notably through communities of practice with nurses."
          ],
          [
            "Season 2, Ep 1: David Chambers",
            "That Implementation Science Podcast, hosted by Mike Pullmann and Kevin King, 2024",
            "https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/",
            "The deputy director for implementation science at the National Cancer Institute reflects on the history of the field, the collective nature of science and what makes a research team effective."
          ],
          [
            "SCCM Pod-520: Implementation Science: From Evidence to Practice",
            "SCCM Podcast (Society of Critical Care Medicine), hosted by Marilyn N. Bulloch with Anne E. Sales, 2024",
            "https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice",
            "An accessible introduction in which a researcher presents implementation science as the study of planned behaviour change within organisational constraints, illustrated with clinical examples."
          ]
        ]
      ],
      [
        "Video capsules",
        [
          [
            "Ancrage historique et évolution du courtage de connaissances",
            "Équipe RENARD, presentation by Christian Dagenais and Saliha Ziam at Colloquium 31 of the 90th Acfas Congress, 2023 (in French)",
            "https://www.youtube.com/watch?v=3uucW5ZOp-g",
            "A short presentation that traces where knowledge brokering comes from and how the role has evolved, as an introduction to the work of a knowledge broker."
          ],
          [
            "Les compétences clés pour agir en courtage de connaissances",
            "Équipe RENARD, presentation by Esther McSween-Cadieux at Colloquium 31 of the 90th Acfas Congress, 2023 (in French)",
            "https://www.youtube.com/watch?v=RGVmhf9Wyzo",
            "Reviews the competencies a person needs to work in knowledge brokering, a practical complement to the readings on the broker’s role."
          ],
          [
            "Expériences du midi: Recherche en partenariat avec une citoyenne-chercheuse",
            "Unité de soutien SSA Québec, webinar with Julie Coulombe and Marie-Hélène Morin, 2025 (in French)",
            "https://www.youtube.com/watch?v=TNwIcNyGjwY",
            "A concrete case of research conducted with a citizen researcher on family peer support in mental health, showing what participatory science changes in the way a project is run."
          ],
          [
            "CCNMO - Prise de décisions fondée sur des données probantes",
            "Centre de collaboration nationale des méthodes et outils (CCNMO), 2016 (in French)",
            "https://www.youtube.com/watch?v=XrZjc3Flrz8",
            "Presents, in eight minutes, the CCNMO model, which shows how research evidence, local context, population preferences and resources come together in a public health decision."
          ],
          [
            "TIDIRC: Introduction to Dissemination & Implementation Science",
            "National Cancer Institute (TIDIRC OpenAccess), lecture by David Chambers, 2022",
            "https://www.youtube.com/watch?v=DO2tv7DqL3w",
            "An introductory lecture that distinguishes dissemination research, research dissemination, implementation research and pragmatic research, and presents the core concepts of the field."
          ],
          [
            "Quand l’expertise académique rencontre le vécu du terrain (Le Réverbère, mini-série sur la science citoyenne, épisode 2)",
            "Le Réverbère, Institut du Nouveau Monde with the Fonds de recherche du Québec, 2026 (in French)",
            "https://www.youtube.com/watch?v=J6gVGWA_yhc",
            "Citizen–researcher pairs describe how they share roles in a research project launched by a citizen’s question, without either of them losing their own expertise."
          ],
          [
            "Ép. 23 - Patient Partenaire: des alliés pour la recherche",
            "Des femmes comme vous, Les Radieuses Magazine, with Catherine Wilhelmy, 2024 (in French)",
            "https://www.youtube.com/watch?v=27KRzWNoxAA",
            "A patient who became partnership lead at a research centre explains to a general audience what the patient-partner movement is and why patients’ lived experience should inform research and care."
          ]
        ]
      ],
      [
        "Press and magazines",
        [
          [
            "Communiquer efficacement les connaissances scientifiques permet de sauver des vies",
            "Christian Dagenais, Aurélie Hot and Valéry Ridde, The Conversation (Canada), 2023 (in French)",
            "https://theconversation.com/communiquer-efficacement-les-connaissances-scientifiques-permet-de-sauver-des-vies-197191",
            "Argues that research changes practice only if its findings reach decision-makers in an accessible form and if change is supported over time, with backing from funders."
          ],
          [
            "Pour mieux communiquer la science, commençons par bien choisir nos mots",
            "Valéry Ridde, Aurélie Hot and Christian Dagenais, The Conversation (Canada), 2025 (in French)",
            "https://theconversation.com/pour-mieux-communiquer-la-science-commencons-par-bien-choisir-nos-mots-247661",
            "Shows how the profusion of competing terms (transfer, translation, mobilisation…) muddles collaboration and funding in this field, and calls for a clearer vocabulary."
          ],
          [
            "Recherche et politiques publiques : comment mieux faire circuler les savoirs ?",
            "Mohamed Berrada, Affaires universitaires, 2026 (in French)",
            "https://www.affairesuniversitaires.ca/actualites/recherche-et-politiques-publiques-comment-mieux-faire-circuler-les-savoirs/",
            "A report on an Acfas symposium where universities, colleges, organisations and decision-makers looked for ways to bring research and public decision-making closer together without sacrificing the long time frames of research."
          ],
          [
            "Au-delà de l’acceptabilité sociale, ouvrir le dialogue pour favoriser la participation citoyenne au débat sur l’utilisation des données de santé",
            "Carole Jabet and Cécile Petitgand, Fonds de recherche du Québec, 2022 (in French)",
            "https://frq.gouv.qc.ca/ouvrir-le-dialogue-pour-favoriser-la-participation-citoyenne/",
            "Drawn from an Acfas symposium, this piece proposes deliberative mechanisms, such as regional working groups or citizen forums, to involve the public in decisions about the use of health data."
          ],
          [
            "Construction et hiérarchisation des données probantes en santé : savoirs scientifiques, expérientiels et contextuels",
            "Marie-Dominique Beaulieu, Revue du CREMIS, 2016 (in French)",
            "https://cremis.ca/publications/articles-et-medias/construction-et-hierarchisation-des-donnees-probantes-en-sante-savoirs-scientifiques-experientiels-et-contextuels/",
            "Looks back at the rise of evidence-based medicine and the hierarchy of evidence, and argues for integrating rather than opposing scientific, experiential and contextual knowledge in health decisions."
          ],
          [
            "Knowledge mobilization will help Canada face the next major challenge",
            "Ursula Gobel, Policy Options / Options politiques, 2021",
            "https://policyoptions.irpp.org/magazines/february-2021/knowledge-mobilization-will-help-canada-face-the-next-major-challenge/",
            "A vice-president of SSHRC draws from the pandemic the lesson that knowledge synthesis and interdisciplinary, intersectoral research networks are essential to inform public decisions in times of crisis."
          ],
          [
            "To Support Evidence-Based Policymaking, Bring Researchers and Policymakers Together",
            "D. Max Crowley and J. Taylor Scott, Issues in Science and Technology, 2023",
            "https://issues.org/evidence-based-policymaking-researchers-policymakers-collaborate-crowley-scott/",
            "Two researchers describe a trust-based model of direct collaboration between scientists and elected officials, and report that it improves the quantity and quality of the evidence used in legislation."
          ]
        ]
      ]
    ]
  },
  publications: {
    "surtitre": "04 · Publications",
    "titre": "Publications and work in progress",
    "intro": "Scientific presentations, defended theses and manuscripts in progress are presented here with their original titles, authors and respective statuses.",
    "groupes": [
      {
        "titre": "Scientific presentations",
        "items": [
          {
            "date": "June 2026",
            "statut": "Best poster award · doctoral and postdoctoral",
            "titre": "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
            "detail": "Bernier, É., Sourial, N., Layani, G. · Groupe francophone en soins primaires (GFSP), Montréal · poster"
          },
          {
            "date": "May 2026",
            "statut": "Poster",
            "titre": "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec",
            "detail": "Bernier, É., Sourial, N., Layani, G. · CAHSPR, Ottawa"
          },
          {
            "date": "April 2026",
            "statut": "Poster and 180-second talk",
            "titre": "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
            "detail": "Bernier, É., Sourial, N., Layani, G. · Quebec Network for Research on Aging (RQRV), Sherbrooke · poster and 180-second talk"
          }
        ]
      },
      {
        "titre": "Theses defended before a jury",
        "items": [
          {
            "date": "2025",
            "titre": "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec",
            "detail": "Master of Laws · Université Paris Panthéon-Assas · supervisor: Benoît Apollis"
          },
          {
            "date": "2024",
            "titre": "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?",
            "detail": "Master’s in health care facility management · Université de Bretagne Occidentale · supervisor: Michelle-Hentic Giliberto"
          },
          {
            "date": "2023",
            "titre": "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement",
            "detail": "State diploma in special needs education · Académie de Rennes"
          }
        ]
      }
    ]
  },
  biographie: {
    "surtitre": "05 · Biography",
    "titre": "From human experiences to collective transformations",
    "intro": [
      "Special needs educator, jurist, entrepreneur and PhD student in public health, I built my path at the meeting point of different worlds: supporting people, managing organisations, law, public policy and research.",
      "Behind this diversity lies one ambition: **to understand the mechanisms that shape individual and collective trajectories, in order to contribute to fairer, more supportive societies that recognise everyone’s capacity to act.**",
      "My journey, personal and professional, feeds one conviction: human realities cannot be separated from the social, organisational and political systems in which they are embedded.",
      "It follows an upward movement: from supporting people towards transforming health and social service organisations and policies, with a clear focus on supporting public decision-making."
    ],
    "citation": "Human realities cannot be separated from the social, organisational and political systems in which they are embedded.",
    "chapitres": [
      [
        "Growing up outside conventional paths",
        [
          "My path begins in France, in a working-class setting, marked in particular by time in the child welfare system and by leaving school at sixteen.",
          "Far from a conventional academic route, I gradually built my trajectory through work, through exploring different settings and through returning to study.",
          "These experiences, like my neurodivergence, nurtured my independent thinking, my adaptability and my interest in the mechanisms of social reproduction, emancipation and solidarity. Today they inform how I look at institutions and at the diversity of human experience."
        ]
      ],
      [
        "Creation, encounter and the ethics of care",
        [
          "My interest in music led me to a bachelor’s degree in musicology, alongside my first experiences in youth and leisure programmes and then managing adapted stays for people with disabilities.",
          "For all their differences, these worlds let me explore human relationships in several dimensions: individual expression, collective life, support and responsibility towards others.",
          "Over eleven years of commitment alongside human vulnerability, these experiences gradually placed the ethics of *care* at the centre, together with the recognition of individual capacities and the importance of support that fosters autonomy rather than dependence. They also showed me the strength of solidarity."
        ]
      ],
      [
        "From support to self-determination",
        [
          "After several years in the field, I wanted to give my professional life a new direction, guided by a reflection on social usefulness and on the place I wished to hold in society.",
          "I therefore returned to study special needs education to deepen the theoretical, ethical and methodological foundations of support in the social and medico-social sectors, refocusing my practice on self-determination and on working *with* people.",
          "My professional practice thesis, on how educational practices influence self-determination, was a turning point in my questioning: **how can people’s freedom of choice be fostered when the conditions of their support are also determined by how institutions work?**"
        ]
      ],
      [
        "Understanding organisations to transform practice",
        [
          "This question led me to widen my reflection to organisations themselves.",
          "I completed training in the management of health and medico-social facilities, as well as a university diploma in entrepreneurship at IAE Brest, obtained in 2024.",
          "There I deepened issues of management, funding, coordination, human resources and change management, and observed that the facilities’ difficulties, from funding to partnership work and recruitment, were largely conditioned by health policy.",
          "Above all, I sought to understand the conditions that allow professionals to turn their intentions into effective practice, and organisations to reconcile their constraints with people’s needs."
        ]
      ],
      [
        "From how institutions work to the governance of health systems",
        [
          "Studying organisations led me to explore the mechanisms that steer their decisions: legal frameworks, public policy, planning, funding arrangements and governance.",
          "I pursued this reflection at Université Paris-Panthéon-Assas, in public, health and social law, to move beyond management issues and adopt a multilevel approach to the health system and to the legal instruments of national solidarity, then as a project manager at France’s national agency for performance support (ANAP).",
          "This experience allowed me to work at the interface between national directions and operational realities, turning those directions into concrete arrangements, in close contact with the challenges faced by managers, professionals and users of the health system.",
          "It strengthened my interest in the difficulties of implementing public policy, especially when the responses needed require crossing the boundaries between organisations and sectors. Consolidated by a research thesis, this immersion revealed the difficulties of implementing integrated care and service models, and the need for an intersectoral and interdisciplinary approach to siloed practices. I then reached out to several researchers in Québec, presenting my findings and a project to contrast health systems, in search of answers to the difficulties of implementing ageing-in-place policies."
        ]
      ],
      [
        "Producing knowledge to inform collective action",
        [
          "Today, my PhD in public health at Université de Montréal, supervised by Drs. N. Sourial and G. Layani, continues this journey.",
          "My work focuses on the organisation of health and social service systems, populations’ social needs, intersectoral collaboration and the conditions for implementing integrated responses, particularly in home support.",
          "My approach is resolutely interdisciplinary and pragmatic. It seeks to bring together lived experience, scientific knowledge and decision-making realities, to better understand the phenomena studied and to contribute to changing practice and public policy.",
          "I pay particular attention to people losing autonomy and those far from services, to partnership research that recognises patients as producers of knowledge, to knowledge translation and to the use of knowledge by people, professionals, organisations and decision-makers.",
          "This drive to create, experiment and propose also extends to entrepreneurship, notably through the development of **OWNNIGHT**, a project under way."
        ]
      ]
    ],
    "vision": {
      "titre": "A vision that connects experience, knowledge and action",
      "paragraphes": [
        "I believe that academic, professional and experiential knowledge gain from being confronted rather than ranked.",
        "My path has let me discover different layers of society and of the health system, hold various positions within them and observe how they interact. This plurality of perspectives is now one of the resources of my scientific approach.",
        "**For me, research is an instrument of understanding, but also of human emancipation, social justice and support for collective decision-making.** Its value lies as much in the rigour of the knowledge it produces as in its capacity to feed debate, inform choices and support their implementation.",
        "It is aligned with the United Nations Sustainable Development Goals: improving the well-being of older adults, reducing inequalities in ageing at home and strengthening inclusive, accountable institutions. In the long run, my ambition is to become an independent researcher, recognised for combining evidence, dialogue among stakeholders and outreach to the general public.",
        "Intellectual curiosity, resilience, autonomy, critical thinking, co-construction and the boldness to undertake are values that run through my journey.",
        "I wish to pursue this exploration at the interface of disciplines and settings, convinced that today’s public health challenges require bringing people, knowledge and institutions into dialogue."
      ]
    },
    "conclusion": "Ad astra per aspera: through hardships to the stars."
  },
  parcours: {
    "surtitre": "06 · Background",
    "titre": "Education and experience",
    "sousTitre": "From frontline practice to health policy",
    "intro": "From special needs education to the PhD: the degrees, positions and training that mark the path.",
    "types": {
      "formation": "Education",
      "experience": "Experience",
      "entreprise": "Entrepreneurship"
    },
    "etapes": [
      {
        "date": "Ongoing",
        "type": "entreprise",
        "titre": "Founding OWNNIGHT · entrepreneur",
        "detail": "An Android app for sleep well-being and sleep education: a personalised plan, lessons and guided sessions."
      },
      {
        "date": "Since 2025",
        "type": "formation",
        "titre": "PhD in public health · ESPUM (Canada)",
        "detail": "École de santé publique de l’Université de Montréal (ESPUM), Canada. Health systems, organisations and policy (SOPS), second year; research trainee at the Centre de recherche du CHUM (CRCHUM), Canada.",
        "discret": "Cumulative GPA: 4.1"
      },
      {
        "date": "Fall 2026",
        "type": "experience",
        "titre": "Teaching assistant · SPU 7001, ASA 6754 and ASA 6765",
        "detail": "Université de Montréal."
      },
      {
        "date": "Winter 2026",
        "type": "experience",
        "titre": "Teaching assistant · ASA 6754",
        "detail": "Health system and population health, Université de Montréal: student support, grading of written and oral exams."
      },
      {
        "date": "2025",
        "type": "formation",
        "titre": "Master’s in public law specialising in health law and social law",
        "detail": "Public law, social law and health law · Université Paris Panthéon-Assas, with special distinction from the jury."
      },
      {
        "date": "2024–2025",
        "type": "experience",
        "titre": "Health and social care project officer · ANAP (France)",
        "detail": "Agence nationale d’appui à la performance (ANAP), Paris (France). Co-leading the expert network, hosting webinars, collecting and analysing data, and facilitating communities of practice."
      },
      {
        "date": "2024",
        "type": "formation",
        "titre": "Master’s in health care facility management · UBO (France)",
        "detail": "Université de Bretagne Occidentale (UBO), France, with special distinction from the jury."
      },
      {
        "date": "2024",
        "type": "experience",
        "titre": "Management internship in an EHPAD · Fondation Ildys",
        "detail": "Fondation Ildys, Landerneau (France). Internship with the management team."
      },
      {
        "date": "2024",
        "type": "formation",
        "titre": "University diploma in entrepreneurship and management",
        "detail": "IAE de Brest (Institut d’administration des entreprises), France, with special distinction from the jury."
      },
      {
        "date": "2023",
        "type": "formation",
        "titre": "State diploma in special needs education",
        "detail": "Académie de Rennes."
      },
      {
        "date": "2020–2023",
        "type": "experience",
        "titre": "Special needs educator",
        "detail": "Residential home, Adapei 35, Saint-Malo: assessing needs, co-designing individual plans, coordinating a multidisciplinary team."
      },
      {
        "date": "2016–2024",
        "type": "experience",
        "titre": "Director of stays for adults with disabilities",
        "detail": "Adapted holidays and respite stays for people with disabilities, Brest (France): co-designing educational programmes, providing socio-educational support and supervising teams, budgets and logistics."
      }
    ],
    "continue": {
      "titre": "Continuing education · 2026",
      "items": [
        "Responsible conduct of research · CRCHUM",
        "Research assistant practice · Université de Montréal",
        "MobilizeU, knowledge mobilisation · Research Impact Canada and York University"
      ]
    },
    "note": "French degrees evaluated by the MIFI (Québec) and WES Canada."
  },
  engagements: {
    "surtitre": "07 · Engagement",
    "titre": "Representing, contributing, engaging",
    "intro": "Taking part in student and scientific life, in continuity with the path so far.",
    "groupes": [
      {
        "titre": "Student representation",
        "items": [
          {
            "date": "Since 2026 · Ongoing",
            "titre": "PhD coordinator in public health · AÉÉSPUM",
            "detail": "Elected."
          },
          {
            "date": "Ongoing",
            "titre": "Coordinator of solidarity mentoring · PhD program in public health",
            "detail": "ESPUM, Université de Montréal."
          },
          {
            "date": "Ongoing",
            "titre": "Student representative on the PhD program committee in public health",
            "detail": "ESPUM, Université de Montréal."
          },
          {
            "date": "Since 2026 · Ongoing",
            "titre": "Doctoral student representative · DGEPS",
            "detail": "Department of Health Management, Evaluation and Policy, ESPUM."
          },
          {
            "date": "Winter 2026",
            "titre": "Université de Montréal ambassador"
          },
          {
            "date": "2022–2024",
            "titre": "Elected member of the CROUS board",
            "detail": "France."
          },
          {
            "date": "2021",
            "titre": "President of Askoria’s regional social work student association",
            "detail": "France."
          }
        ]
      },
      {
        "titre": "Scientific community",
        "items": [
          {
            "date": "Ongoing",
            "titre": "Student scientific committee of the AÉÉSPUM conference",
            "detail": "Member."
          },
          {
            "date": "June 2026",
            "titre": "Scientific committee, GFSP early-career research day",
            "detail": "Student member."
          }
        ]
      },
      {
        "titre": "Scholarships and awards",
        "items": [
          {
            "date": "2026",
            "titre": "Best poster presentation award, doctoral and postdoctoral category",
            "detail": "Early-career research day, Groupe francophone en soins primaires."
          },
          {
            "date": "2025",
            "titre": "Fonds de recherche du Québec doctoral scholarship (B2)",
            "detail": "Excellence scholarship, ranked 3rd.",
            "lien": "https://doi.org/10.69777/2009461"
          },
          {
            "date": "2025",
            "titre": "International recruitment scholarship",
            "detail": "Graduate and Postdoctoral Studies, Université de Montréal."
          },
          {
            "date": "2023–2025",
            "titre": "Three special distinctions from the jury",
            "detail": "Academic excellence."
          }
        ]
      },
      {
        "titre": "Civic engagement",
        "items": [
          {
            "date": "2023",
            "titre": "Volunteer firefighter",
            "detail": "Dinard fire and rescue station, France."
          },
          {
            "date": "2013",
            "titre": "Volunteering and civic service",
            "detail": "Association de la fondation étudiante pour la ville (AFEV), France: coordinating student volunteers and supporting a young person through her school and cultural journey."
          }
        ]
      },
      {
        "titre": "Sports and leisure",
        "items": [
          {
            "date": "Sport",
            "titre": "Marathon running",
            "detail": "Paris Marathon 2025 and 2026, Montréal Marathon 2026."
          },
          {
            "date": "Music",
            "titre": "Piano, music composition and guitar"
          },
          {
            "date": "Sport",
            "titre": "Ice hockey"
          },
          {
            "date": "Programming",
            "titre": "Building digital tools"
          },
          {
            "date": "Culture",
            "titre": "Scientific reflection and outreach",
            "detail": "Life and Earth sciences, philosophy, geopolitics, political science, physics, astronomy."
          }
        ]
      }
    ],
    "affiliations": {
      "titre": "Student member",
      "items": [
        "GSK Research Chair in optimal management of chronic diseases",
        "Groupe francophone en soins primaires (GFSP)",
        "Quebec Network for Research on Aging (RQRV)",
        "Canadian Association for Health Services and Policy Research (CAHSPR)",
        "Centre de recherche en santé publique (CReSP)",
        "Centre de recherche du CISSS de Chaudière-Appalaches",
        "Centre interuniversitaire de recherche en analyse des organisations (CIRANO)"
      ]
    }
  },
  contact: {
    surtitre: "Contact",
    titre: "Let’s share ideas and perspectives",
    intro: "Have an idea, an interesting reading, an experience to share or a project to explore? I would be glad to hear from you.",
    courriel: COURRIEL,
    ecrire: "Send an email",
    liens: [
      ["Academic CV", "PDF, in French", "docs/cv-academique.pdf"],
      ["Professional CV", "PDF, in French", "docs/cv-professionnel.pdf"],
      ["ORCID", "0009-0001-4236-4932", ORCID],
      ["Thesis project poster", "Accessible version", AFFICHE + "en/"],
    ],
    adresse: "School of Public Health, Université de Montréal · 7101 avenue du Parc, Montréal, Québec",
  },
  pied: "© 2026 Éric Bernier",
  credits: "Images: a portrait of Éric Bernier, Unsplash photographs and digital illustrations depicting fictional scenes, not documentary photographs. View of Montreal from Mount Royal: Wilfredor, “Montreal Skyline from Mont Royal golden hour” (CC0), and Calvin411, “Panorama Montreal Skyline 2017” (CC BY-SA 4.0, modified), Wikimedia Commons. Read-aloud voices: Kyutai TTS (CC BY 4.0), reference voices CML-TTS (Oliveira et al., 2023) and Alba MacKenna (CC BY 4.0).",
  introuvable: { titre: "Page not found", texte: "This page does not exist or has moved.", retour: "Back to the home page" },
};

/* ----------------------------------------------------------------- Español */
const es = {
  lang: "es",
  locale: "es_ES",
  chemin: "../",
  meta: {
    titre: "Éric Bernier",
    description:
      "Éric Bernier, doctorando en salud pública (sistemas, organizaciones y políticas de salud) en la ESPUM, Université de Montréal, jurista, emprendedor y educador especializado. Investigación sobre la respuesta intersectorial a las necesidades sociales complejas en atención primaria.",
  },
  ui: {
    evitement: "Ir al contenido",
    sousTitre: "Salud pública · Gobernanza · Gestión · Derecho · Intervención social e intersectorialidad",
    navigation: "Navegación principal",
    langue: "Idioma",
    entrer: "Entrar",
    cv: "CV",
    hall: "Volver al vestíbulo",
    suivante: "Puerta siguiente",
    contact: "Contactarme",
    haut: "Volver arriba",
    acces: "Accesibilidad",
    daltonisme: "Daltonismo",
    basseVision: "Baja visión",
    contraste: "Alto contraste",
    taille: "Tamaño del texto",
    plus: "Agrandar el texto",
    moins: "Reducir el texto",
    ecouter: "Escuchar",
    ecouterPage: "Escuchar la página",
    arreter: "Detener la lectura",
    sansVoix: "Su dispositivo no tiene voz para este idioma.",
    falc: "Versión de lectura fácil (en francés, FALC)",
    afficheAlt: "Vista previa del póster del proyecto de tesis, 120 × 120 cm",
    autresLangues: "Otros idiomas",
  },
  nav: [
    [
      "recherche",
      "Investigación"
    ],
    [
      "conceptualisation",
      "Conceptualización"
    ],
    [
      "approche",
      "Postura de investigación"
    ],
    ["methodes", "Métodos de investigación"],
    [
      "valeurs",
      "Valores"
    ],
    [
      "implantation",
      "Implementación"
    ],
    [
      "ressources",
      "Recursos"
    ],
    [
      "publications",
      "Publicaciones"
    ],
    [
      "biographie",
      "Biografía"
    ],
    [
      "parcours",
      "Trayectoria"
    ],
    [
      "engagements",
      "Compromisos"
    ],
    [
      "contact",
      "Contacto"
    ]
  ],
  accueil: {
    surtitre: "Doctorando en salud pública · ESPUM · CRCHUM",
    roles: "Doctorando en salud pública (2.º año) · Jurista · Emprendedor · Educador especializado",
    chapeau: {
      "titre": "De las personas a las políticas: una lectura integrada de los sistemas de salud",
      "paragraphes": [
        "Del acompañamiento de las personas a la investigación en salud pública, mi trayectoria me ha llevado a explorar las distintas escalas del sistema de salud: de las realidades individuales a las organizaciones, hasta las políticas públicas y la gobernanza.",
        "Estas experiencias, en la encrucijada del terreno, la gestión, el derecho y la investigación, han forjado una convicción: **transformar los sistemas de salud supone hacer dialogar las experiencias humanas, los saberes científicos, las dinámicas colectivas y las decisiones políticas.**",
        "Mi ambición es **abrir puertas entre esos universos que conviven sin entenderse siempre**, romper los compartimentos entre perspectivas y acercar la investigación a la acción, para favorecer la autodeterminación, orientar las decisiones colectivas y contribuir a una sociedad más justa y más sana."
      ]
    },
    encadrement:
      "Tesis doctoral en fase de conceptualización, codirigida por Nadia Sourial (PhD) y Géraldine Layani (MD) · Cátedra de investigación GSK en gestión óptima de enfermedades crónicas · CRCHUM · Becario del FRQ (B2)",
    visite: "Comenzar la visita",
    explorer: "Explorar libremente",
    portrait: "Retrato de Éric Bernier",
  },
  hall: {
    "titre": "El vestíbulo",
    "compte": "10 puertas",
    "consigne": "Haga clic en una puerta para entrar",
    "portes": {
      "recherche": [
        "Mi tesis",
        "Proyecto doctoral"
      ],
      "conceptualisation": [
        "Conceptualización",
        "Investigación en curso: corpus y lagunas"
      ],
      "approche": [
        "Postura de investigación",
        "Postura pragmática y mirada pluridisciplinar"
      ],
      "methodes": ["Métodos de investigación","Análisis, herramientas y referencias metodológicas"],
      "valeurs": [
        "Valores",
        "Lo que guía mi práctica"
      ],
      "implantation": [
        "Implementación",
        "Transferencia de conocimientos e implementación"
      ],
      "ressources": [
        "Recursos",
        "Artículos, cápsulas, pódcasts"
      ],
      "publications": [
        "Publicaciones",
        "Comunicaciones, memorias, herramientas"
      ],
      "biographie": [
        "Biografía",
        "De las experiencias humanas a las transformaciones colectivas"
      ],
      "parcours": [
        "La trayectoria",
        "Formación y experiencia"
      ],
      "engagements": [
        "Compromisos",
        "Representación, investigación, distinciones, ocio"
      ]
    }
  },
  recherche: {
    surtitre: "01 · La investigación",
    etiquette: "Tesis doctoral en curso",
    avertissement: "Tema en proceso de elaboración y sujeto a cambios",
    titre: "Organizar la respuesta intersectorial a las necesidades sociales complejas y concurrentes en atención primaria",
    sousTitre: "Configuraciones de redes adaptadas a los distintos perfiles de pacientes atendidos",
    question:
      "¿Cómo se organiza la respuesta intersectorial para los distintos perfiles de pacientes con necesidades sociales complejas y concurrentes atendidos en atención primaria?",
    but: "El proyecto busca vincular cada perfil de necesidades con una configuración de socios y con su coordinador, a la escala de un territorio de CLSC (centro local de servicios comunitarios).",
    faits: [
      ["Programa", "Doctorado en salud pública, opción sistemas, organizaciones y políticas de salud (SOPS) · 2.º año"],
      ["Institución", "Escuela de Salud Pública de la Université de Montréal (ESPUM)"],
      ["Cátedra", "Cátedra de investigación GSK en gestión óptima de enfermedades crónicas"],
      ["Centro de investigación", "Centro de investigación del CHUM (CRCHUM) · investigador en prácticas"],
      ["Financiación", "Fonds de recherche du Québec, beca de doctorado (B2)"],
    ],
    codirection: {
      titre: "Codirección",
      profil: "Perfil CRCHUM",
      personnes: [
        { nom: "Dra. Nadia Sourial", grade: "Ph. D.", lignes: ["Profesora agregada, Departamento de Gestión, Evaluación y Política de Salud, Escuela de Salud Pública, Université de Montréal", "Investigadora del CRCHUM, Polo de innovación y evaluación en salud"], chaire: "Cotitular de la Cátedra de investigación GSK en gestión óptima de enfermedades crónicas", lien: CRCHUM_SOURIAL },
        { nom: "Dra. Géraldine Layani", grade: "M.D., M. Sc.", lignes: ["Médica de familia, GMF-U Notre-Dame, Montreal", "Profesora adjunta clínica, Departamento de Medicina Familiar y de Urgencias, Université de Montréal", "Investigadora del CRCHUM, Polo de innovación y evaluación en salud"], chaire: "Cotitular de la Cátedra de investigación GSK en gestión óptima de enfermedades crónicas", lien: CRCHUM_LAYANI },
      ],
    },
    affiche: ["Ver el póster del proyecto", "Versión accesible: 5 idiomas, lectura fácil, daltonismo, baja visión, audio", AFFICHE + "es/"],
    table: {
      titre: "Mesa de exploración",
      detail: "El diseño en cuatro etapas",
      etapes: [
        ["Objetivo 1", "¿Qué perfiles?", "Una revisión de alcance", "A partir de los estudios publicados, identificar los perfiles recurrentes de necesidades sociales y convertirlos en cuatro a seis viñetas: situaciones ficticias validadas.", ["Revisión de alcance", "Viñetas"]],
        ["Objetivo 2", "¿A quién movilizar?", "La red egocéntrica del CLSC", "Para cada viñeta, el CLSC está en el centro: se identifican los socios que movilizaría y los vínculos entre ellos. Se obtiene una configuración por perfil.", ["Análisis de redes", "Red egocéntrica"]],
        ["Objetivo 2", "¿Por qué esas elecciones?", "Entrevistas sobre el mapa de la red", "Las entrevistas se apoyan en el mapa de cada red para explicar las elecciones observadas; por ejemplo: ¿por qué estos socios están poco conectados?", ["Entrevistas", "Métodos mixtos"]],
        ["Objetivo 3", "¿Qué recomendar?", "Un taller deliberativo", "Pacientes colaboradores y actores de la atención primaria, del sector comunitario, de la gobernanza local, del ámbito municipal y del sector privado formulan recomendaciones para cada perfil.", ["Deliberación", "Pacientes colaboradores"]],
      ],
      terminus: "Todo se integra en una tabla conjunta: una fila por perfil, con la red, las explicaciones y las recomendaciones.",
    },
    notions: {
      titre: "Tres nociones",
      items: [
        ["La concurrencia", "La presencia de al menos dos necesidades sociales al mismo tiempo. Se cuenta: es el criterio de inclusión.", "Kreuter et al., 2021"],
        ["La complejidad", "La acumulación de enfermedades crónicas, discapacidades, problemas de salud mental y vulnerabilidad social. Se describe, sin ser exigida.", "Kuluski et al., 2017"],
        ["La respuesta intersectorial", "Las acciones de sectores distintos de la salud, realizadas junto con ella: CLSC, grupos de medicina familiar, hospital, farmacias, organizaciones comunitarias, municipio, escuelas, guarderías. Se organiza en un territorio.", "Leppo et al., 2013; MSSS, 2017"],
      ],
    },
    retombees: {
      titre: "Resultados esperados",
      items: [
        ["Para las personas", "una respuesta ajustada a su combinación de necesidades."],
        ["Para el CLSC y sus socios", "referencias sobre a quién movilizar, cómo vincularse y quién coordina."],
        ["Para la política de atención primaria", "un punto de partida y recomendaciones según los roles del CLSC."],
        ["Para la investigación", "una hipótesis que vincula el perfil de necesidades con la red."],
      ],
    },
    travaux: {
      titre: "Manuscritos enviados y en preparación",
      intro: "Artículos enviados y manuscritos en preparación, en paralelo a la tesis.",
      items: [
        { domaine: "Sistemas de salud y atención primaria", statut: "Enviado a BJGP Open", titre: TITRES_ORIGINAUX.hospit, auteurs: AUTEURS.hospit },
        {
          domaine: "Epistemología y transferencia de conocimientos",
          statut: "En construcción · En espera de colaboración",
          titre: TITRES_ORIGINAUX.epistemic,
          auteurs: "Bernier, É.",
          resume:
            "El impacto de la investigación suele pensarse en un solo sentido, del conocimiento hacia las políticas y las prácticas. El artículo propone una salud pública concebida como ciencia reflexiva de la gobernanza: precisa en qué condiciones las consecuencias observadas en el terreno y los saberes de las poblaciones afectadas pueden exigir que se reexaminen las categorías, los indicadores y las reglas de origen. El concepto se traduce en una auditoría documental, puesta a prueba en cuatro cadenas institucionales.",
          etiquettes: ["Retorno epistémico", "Gobernanza reflexiva", "Impacto de la investigación"],
        },
        { domaine: "Gobernanza y espacio público", statut: "Manuscrito en preparación", titre: TITRES_ORIGINAUX.pl2, auteurs: AUTEURS.pl2 },
        { domaine: "Derecho de la salud", statut: "Manuscrito en preparación", titre: TITRES_ORIGINAUX.droit, auteurs: "Bernier, É. · artículo de doctrina" },
      ],
    },
  },
  conceptualisation: {
    "surtitre": "Investigación en curso",
    "titre": "Conceptualizar el proyecto de investigación",
    "intro": "Estoy en la etapa de conceptualización: un corpus de publicaciones priorizadas, las lagunas que revela y las lecturas de formación que lo respaldan.",
    "chiffres": [
      [
        222,
        "publicaciones seleccionadas"
      ],
      [
        39,
        "lecturas prioritarias"
      ],
      [
        83,
        "lecturas importantes"
      ],
      [
        9,
        "dimensiones de vacíos examinadas"
      ]
    ],
    "prioritesTitre": "Distribución por prioridad",
    "prioriteLibelle": "Prioridad",
    "provenanceTitre": "Procedencia de las publicaciones",
    "provenance": [
      [
        "PubMed",
        112
      ],
      [
        "Embase y MEDLINE (Ovid)",
        95
      ],
      [
        "Cairn",
        15
      ]
    ],
    "lacunesTitre": "Lo que la literatura deja abierto",
    "lacunesIntro": "Para cada una de las nueve dimensiones examinadas, la tabla indica el estado de la literatura, la magnitud del vacío y algunas referencias clave.",
    "lacunes": [
      {
        "dimension": "Conceptualización",
        "etat": "Presente pero no consolidada",
        "niveau": "Importante",
        "score": 3,
        "constat": "Los estudios indexados en PubMed distinguen cada vez más entre riesgo social, necesidad social y deseo de asistencia. Los trabajos francófonos de Cairn añaden un vocabulario de la precariedad y la vulnerabilidad social, a menudo multidimensional, pero conceptualmente más amplio que la necesidad no satisfecha.",
        "reperes": "Gruß 2021; Tucher 2026; Tudrej 2019; Karran 2023"
      },
      {
        "dimension": "Medición",
        "etat": "Abundante pero heterogénea",
        "niveau": "Importante",
        "score": 3,
        "constat": "Los instrumentos difieren mucho en sus dominios, umbrales y modo de administración. Las puntuaciones multidimensionales de precariedad identificadas en Cairn, como EPICES y PRECAR, no equivalen a los cuestionarios de necesidades sociales no satisfechas.",
        "reperes": "Zein 2026; Karran 2023; Tudrej 2019; Rogers 2025"
      },
      {
        "dimension": "Caracterización y prevalencia",
        "etat": "Bien documentada para al menos una necesidad",
        "niveau": "Moderada",
        "score": 2,
        "constat": "Numerosos estudios describen la prevalencia por dominio y la carga acumulada, pero las estimaciones son difíciles de comparar cuando difieren la definición de necesidad y el instrumento.",
        "reperes": "Jih 2023; Bleacher 2020; Fiori 2021"
      },
      {
        "dimension": "Multiplicidad y concurrencia",
        "etat": "Emergente pero ya demostrada",
        "niveau": "Importante",
        "score": 3,
        "constat": "La coexistencia de varias necesidades o riesgos sociales es frecuente, y se han propuesto agrupaciones, clases y medidas de carga acumulada. Un estudio reciente muestra además que la multiplicidad de riesgos aumenta fuertemente la probabilidad de desear ayuda.",
        "reperes": "Vest 2025; Kreuter 2021; Zeng 2024; Tucher 2026"
      },
      {
        "dimension": "Priorización por los pacientes",
        "etat": "Algunos estudios directos, pero un campo aún poco desarrollado",
        "niveau": "Mayor",
        "score": 4,
        "constat": "La literatura mide sobre todo el deseo de ayuda, los objetivos negociados, la aceptabilidad o la prioridad relativa, y los trabajos recientes refuerzan la distinción entre riesgo detectado y ayuda deseada. Los trabajos de e-CARE muestran un acompañamiento ajustado al ritmo y a las prioridades del paciente, sin producir una jerarquía estandarizada de las necesidades.",
        "reperes": "O’Loughlin 2022; Gruß 2021; Tucher 2026; Vasan 2026; Ouanhnon 2022"
      },
      {
        "dimension": "Interrelaciones entre necesidades",
        "etat": "Descritas sobre todo como concurrencia o complejidad global",
        "niveau": "Mayor",
        "score": 4,
        "constat": "Los análisis cuantitativos documentan sobre todo la concurrencia y los perfiles. Los trabajos cualitativos francófonos de Cairn describen el entrelazamiento de dificultades sociales, administrativas, económicas y de salud, pero rara vez su dirección, su secuencia o su mecanismo causal.",
        "reperes": "Vest 2025; Kreuter 2021; Marron-Delabre 2015; Ouanhnon 2022"
      },
      {
        "dimension": "Resolución y trayectoria",
        "etat": "Creciente pero dominada por indicadores intermedios",
        "niveau": "Mayor",
        "score": 4,
        "constat": "El campo distingue cada vez más entre cribado, derivación, conexión, recurso recibido y resolución. Los trabajos francófonos de e-CARE siguen además resultados concretos, como el acceso a derechos, a un médico de cabecera y a la vivienda o la autonomía en el recorrido asistencial, pero sin una medida estandarizada de la resolución de cada necesidad.",
        "reperes": "Steeves-Reece 2022; Hausmann 2024; Ouanhnon 2022; Agarwal 2025"
      },
      {
        "dimension": "Redes y respuesta intersectorial",
        "etat": "Literatura sustancial, pero a menudo separada de los datos de pacientes",
        "niveau": "Mayor para la integración",
        "score": 4,
        "constat": "PubMed documenta la navegación, los agentes comunitarios de salud, las alianzas médico-jurídicas y la derivación de circuito cerrado, y Cairn las unidades sociales en medicina general y las estructuras francesas de atención primaria y coordinación territorial (MSP, CPTS, DAC). Sin embargo, la configuración de la red rara vez se vincula con los perfiles de necesidades y su resolución.",
        "reperes": "Hogg-Graham 2021; Tevaearai 2022; Yatim & Sebai 2021; Lessi 2023; Ouanhnon 2022"
      },
      {
        "dimension": "Síntesis integrada",
        "etat": "No identificada en las auditorías de PubMed y Cairn",
        "niveau": "Vacío principal",
        "score": 5,
        "constat": "Ninguna síntesis localizada reúne, en personas adultas atendidas en atención primaria, el carácter no satisfecho de las necesidades, su medición multidominio, las configuraciones de concurrencia, la prioridad que les otorga el paciente, las interrelaciones entre necesidades, la configuración de la red movilizable y la trayectoria hasta su resolución.",
        "reperes": "Karran 2023; Vest 2025; Chang 2026; Tudrej 2019; Ouanhnon 2022"
      }
    ],
    "principaleTitre": "El vacío principal",
    "principale": "La literatura no está vacía en cada uno de los componentes de la pregunta, ya se trate de la medición de las necesidades sociales múltiples, de su concurrencia, del deseo de ayuda de los pacientes o de los dispositivos de respuesta. Sin embargo, ninguna síntesis identificada reúne, en personas adultas en atención primaria, el carácter no satisfecho de las necesidades, su concurrencia, su priorización por los pacientes, sus interrelaciones, la red de respuesta y la trayectoria hasta su resolución. El vacío reside, por tanto, en la articulación entre la configuración de las necesidades y la de la respuesta intersectorial, así como en los mecanismos que explican por qué algunas necesidades persisten pese a haber sido identificadas.",
    "vigilance": "Por rigor metodológico, la formulación adoptada es «ninguna síntesis identificada en las búsquedas realizadas en PubMed y Cairn» y no «no existe ninguna síntesis».",
    "p5Titre": "Las 39 lecturas prioritarias",
    "p4Titre": "Las 83 lecturas importantes",
    "formationTitre": "Lecturas de formación",
    "cours": [
      [
        "MSO 6011 · Conceptos y métodos en epidemiología",
        [
          "Celentano, D. D., Szklo, M., & Youssef, M. K. F. Gordis Epidemiology (7.ª ed.). Elsevier.",
          "Szklo, M., & Nieto, F. J. (2018). Epidemiology: Beyond the basics (4.ª ed.). Jones & Bartlett Learning.",
          "Rothman, K. J. Epidemiology: An introduction (capítulos 2 y 3).",
          "Oleckno, W. A. Epidemiology: Concepts and methods (capítulo 6)."
        ]
      ],
      [
        "ASA 6754 · Sistema de salud y salud de las poblaciones",
        [
          "Arpin, E., Gautier, L., & Quesnel-Vallée, A. (2025). Quebec: A health system profile. University of Toronto Press.",
          "Pineault, R. (2012). Comprendre le système de santé pour mieux le gérer. Presses de l’Université de Montréal."
        ]
      ],
      [
        "POL 6021 · Métodos cuantitativos",
        [
          "Arel-Bundock, V. (2021). Analyse causale et méthodes quantitatives. Presses de l’Université de Montréal.",
          "Arel-Bundock, V. Model to meaning (capítulos 3, 5, 6 y 10). https://marginaleffects.com",
          "Angrist, J. D., & Pischke, J.-S. (2015). Mastering ’metrics: The path from cause to effect. Princeton University Press."
        ]
      ]
    ],
    "note": "El corpus se constituyó a partir de Ovid (Embase, MEDLINE), PubMed y Cairn, y a cada publicación se le asignó una prioridad según su pertinencia para la pregunta de tesis."
  },
  approche: {
    "surtitre": "Postura de investigación",
    "titre": "Postura de investigación",
    "intro": "Una postura pragmática y pluridisciplinar que relaciona la medición de los fenómenos con la comprensión de las prácticas.",
    "piliers": [
      [
        "Postura pragmática",
        "Una postura que articula una lectura positivista (medir, estimar, poner a prueba hipótesis) y una lectura constructivista (comprender el sentido que los actores dan a sus prácticas). La pregunta decide el método."
      ],
      [
        "Métodos mixtos",
        "Análisis cuantitativos y cualitativos integrados: análisis de redes, regresiones, análisis temático, análisis documental y cartografía, reunidos en tablas de integración."
      ],
      [
        "Pluridisciplinariedad",
        "Salud pública, derecho, gestión, ciencia política e intervención social: miradas que dialogan para analizar un mismo sistema."
      ]
    ],
    "outils": {
      "titre": "Caja de herramientas",
      "groupes": [
        [
          "Análisis de datos",
          [
            "Positron (R)",
            "Python",
            "NVivo",
            "QGIS",
            "Excel"
          ]
        ],
        [
          "Colaboración y animación",
          [
            "Miro",
            "Klaxoon",
            "Canva"
          ]
        ],
        [
          "Ofimática",
          [
            "Office 365"
          ]
        ]
      ]
    },
    "methodes": {
      "titre": "Métodos de investigación utilizados",
      "intro": "De la pregunta a la observación: cada pregunta requiere sus datos, su método de análisis y su interpretación. Elijo los métodos según lo que haya que esclarecer, cruzando disciplinas.",
      "items": [
        {
          "titre": "Análisis de redes sociales egocéntrico y sociocéntrico",
          "texte": "El análisis de redes sociales describe las relaciones entre actores y no solo sus atributos. El enfoque sociocéntrico examina el conjunto de vínculos de una población delimitada; el enfoque egocéntrico parte de una persona encuestada (ego) y de los interlocutores que nombra (alters). En mi tesis parto del CLSC (centro local de servicios comunitarios): sus profesionales de intervención y sus gestores nombran a sus interlocutores, quienes responden a su vez, lo que permite contrastar los vínculos declarados por los socios. Unas viñetas revelan la red potencial, es decir, los socios a los que se recurriría; las interacciones de los últimos 12 meses describen la red real. La comparación de ambas aclara la respuesta intersectorial a las necesidades sociales complejas en atención primaria.",
          "references": [
            "Perry, B. L., Pescosolido, B. A., & Borgatti, S. P. (2018). Egocentric network analysis: Foundations, methods, and models. Cambridge University Press. https://doi.org/10.1017/9781316443255",
            "Provan, K. G., Veazie, M. A., Staten, L. K., & Teufel-Shone, N. I. (2005). The use of network analysis to strengthen community partnerships. Public Administration Review, 65(5), 603–613. https://doi.org/10.1111/j.1540-6210.2005.00487.x",
            "Valente, T. W., Palinkas, L. A., Czaja, S., Chu, K.-H., & Brown, C. H. (2015). Social network analysis for program implementation. PLOS ONE, 10(6), Article e0131712. https://doi.org/10.1371/journal.pone.0131712"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12913-026-15347-8/MediaObjects/12913_2026_15347_Fig1_HTML.png",
              "page": "https://bmchealthservres.biomedcentral.com/articles/10.1186/s12913-026-15347-8",
              "legende": "Red egocéntrica de coordinación en promoción de la salud municipal: el actor focal (ego) en el centro, vinculado a sus interlocutores (alters).",
              "credit": "Figura 1 de Richter, Mamontova y Kühne (2026), BMC Health Services Research, CC BY 4.0"
            },
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs13033-019-0328-1/MediaObjects/13033_2019_328_Fig2_HTML.png",
              "page": "https://ijmhs.biomedcentral.com/articles/10.1186/s13033-019-0328-1",
              "legende": "Red sociocéntrica de 27 organizaciones de salud mental y servicios sociales en Timor Oriental, según la frecuencia de contacto durante un año.",
              "credit": "Figura 2 de Hall et al. (2019), International Journal of Mental Health Systems, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Cartografía y sistemas de información geográfica",
          "texte": "La cartografía y los sistemas de información geográfica (SIG) vinculan los datos con su localización para describir la distribución de los servicios, las necesidades y las poblaciones en un territorio. Las medidas de accesibilidad potencial, como el método de áreas de captación flotantes en dos etapas (2SFCA), relacionan la oferta de servicios, la demanda y la distancia que las separa. Adquirí sus fundamentos en un MOOC de la Universidad de Ginebra. En mi tesis, la cartografía puede servir para situar en el territorio del CLSC las organizaciones nombradas en la red y para contrastar la estructura de los vínculos con la distribución de los servicios y de las necesidades.",
          "references": [
            "Guagliardo, M. F. (2004). Spatial accessibility of primary care: Concepts, methods and challenges. International Journal of Health Geographics, 3, Article 3. https://doi.org/10.1186/1476-072X-3-3",
            "Luo, W., & Wang, F. (2003). Measures of spatial accessibility to health care in a GIS environment: Synthesis and a case study in the Chicago region. Environment and Planning B: Planning and Design, 30(6), 865–884. https://doi.org/10.1068/b29120",
            "Ngui, A. N., & Apparicio, P. (2011). Optimizing the two-step floating catchment area method for measuring spatial accessibility to medical clinics in Montreal. BMC Health Services Research, 11, Article 166. https://doi.org/10.1186/1472-6963-11-166"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2F1472-6963-11-166/MediaObjects/12913_2010_Article_1671_Fig3_HTML.jpg",
              "page": "https://bmchealthservres.biomedcentral.com/articles/10.1186/1472-6963-11-166",
              "legende": "Accesibilidad espacial a las clínicas médicas de Montreal según el método 2SFCA, versión convencional y versión optimizada.",
              "credit": "Figura 3 de Ngui y Apparicio (2011), BMC Health Services Research, CC BY 2.0"
            },
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12942-017-0105-9/MediaObjects/12942_2017_105_Fig4_HTML.gif",
              "page": "https://ij-healthgeographics.biomedcentral.com/articles/10.1186/s12942-017-0105-9",
              "legende": "Localización de los servicios de salud y servicios sociales del área metropolitana de Montreal en 2015, incluidos los CLSC (mapa d).",
              "credit": "Figura 4 de Apparicio et al. (2017), International Journal of Health Geographics, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Programación reproducible: R y Python en Positron, y el shell",
          "texte": "La programación reproducible consiste en llevar a cabo cada etapa de un análisis, desde la importación de los datos hasta las figuras, en scripts que pueden volver a ejecutarse y verificarse. Programo en R y en Python en Positron, el entorno de desarrollo de Posit, y encadeno los procesos en línea de comandos en el shell. En R, el tidyverse estructura la preparación de los datos; igraph y statnet sirven para construir las redes y calcular centralidad, densidad y cohesión; sf gestiona los datos espaciales. Python completa esta cadena para la preparación y la automatización de los datos. Todo enlaza, en un mismo proyecto documentado, los datos de red, los datos territoriales y las figuras.",
          "references": [
            "Handcock, M. S., Hunter, D. R., Butts, C. T., Goodreau, S. M., & Morris, M. (2008). statnet: Software tools for the representation, visualization, analysis and simulation of network data. Journal of Statistical Software, 24(1), 1–11. https://doi.org/10.18637/jss.v024.i01",
            "Pebesma, E. (2018). Simple features for R: Standardized support for spatial vector data. The R Journal, 10(1), 439–446. https://doi.org/10.32614/RJ-2018-009",
            "Wickham, H., Averick, M., Bryan, J., Chang, W., McGowan, L. D., François, R., Grolemund, G., Hayes, A., Henry, L., Hester, J., Kuhn, M., Pedersen, T. L., Miller, E., Bache, S. M., Müller, K., Ooms, J., Robinson, D., Seidel, D. P., Spinu, V., . . . Yutani, H. (2019). Welcome to the tidyverse. Journal of Open Source Software, 4(43), Article 1686. https://doi.org/10.21105/joss.01686"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12992-024-01055-7/MediaObjects/12992_2024_1055_Fig2_HTML.png",
              "page": "https://globalizationandhealth.biomedcentral.com/articles/10.1186/s12992-024-01055-7",
              "legende": "Red de organizaciones dedicadas a la prevención de zoonosis emergentes, coloreada por sector; análisis con igraph y statnet, figura producida en R con ggraph.",
              "credit": "Figura 2 de Clifford Astbury et al. (2024), Globalization and Health, CC BY 4.0"
            },
            {
              "src": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/7b60/12169549/9225d6431677/pone.0325597.g001.jpg",
              "page": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0325597",
              "legende": "Sociogramas de las interacciones entre organizaciones en Guinea y Sierra Leona (malaria y COVID-19), producidos en R con el tidyverse, tidygraph y ggraph.",
              "credit": "Figura 1 de Feddern et al. (2025), PLOS ONE, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Análisis cualitativo temático y de redes",
          "texte": "El análisis temático identifica, organiza e interpreta regularidades de sentido en un corpus de entrevistas o documentos, mediante un proceso iterativo que va de la codificación inicial a la definición de los temas. Realizo esta codificación en NVivo, que permite documentar el árbol de códigos, los memos y las agrupaciones sucesivas. En mi tesis, las entrevistas guiadas por los mapas se basan en la descripción interpretativa. La Framework Method combina códigos deductivos e inductivos en una matriz participantes × temas para comparar sectores, posiciones en la red y perfiles. Se prevén una doble codificación del 20 % del corpus, un diario reflexivo y una devolución a los participantes antes de la integración y el taller deliberativo.",
          "references": [
            "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa",
            "Hogan, B., Carrasco, J. A., & Wellman, B. (2007). Visualizing personal networks: Working with participant-aided sociograms. Field Methods, 19(2), 116–144. https://doi.org/10.1177/1525822X06298589",
            "Hollstein, B. (2024). Qualitative and mixed methods. In J. McLevey, J. Scott, & P. J. Carrington (Eds.), The Sage handbook of social network analysis (2nd ed., pp. 562–574). Sage. https://doi.org/10.4135/9781529614695.n38"
          ],
          "illustrations": [
            {
              "src": "https://media.springernature.com/full/springer-static/image/art%3A10.1186%2Fs12875-026-03322-5/MediaObjects/12875_2026_3322_Fig1_HTML.png",
              "page": "https://bmcprimcare.biomedcentral.com/articles/10.1186/s12875-026-03322-5",
              "legende": "Mapa temático resultante de un análisis temático reflexivo de entrevistas codificadas en NVivo, sobre el acceso a la atención primaria.",
              "credit": "Figura 1 de Instone et al. (2026), BMC Primary Care, CC BY 4.0"
            },
            {
              "src": "https://cdn.ncbi.nlm.nih.gov/pmc/blobs/4df6/8392189/3efc6c848b2a/ijerph-18-08372-g001.jpg",
              "page": "https://doi.org/10.3390/ijerph18168372",
              "legende": "Mapa de red dibujado durante una entrevista y luego digitalizado, en un análisis cualitativo de una red intersectorial de promoción de la salud.",
              "credit": "Figura 1 de Fleuren, Thiel y Frahsa (2021), International Journal of Environmental Research and Public Health, CC BY 4.0"
            }
          ]
        },
        {
          "titre": "Análisis crítico del discurso",
          "texte": "Realicé un análisis cualitativo del discurso crítico de los médicos quebequenses durante los debates sobre el proyecto de ley n.º 2. El corpus intencional reúne 42 documentos de prensa y comunicados (base Eureka, de mayo a diciembre de 2025), codificados cronológicamente hasta la estabilidad de la arquitectura de códigos. El análisis articula el modelo tridimensional de Fairclough (el texto, las prácticas de producción y circulación, el contexto sociopolítico), la teoría del encuadre y la atribución de roles narrativos: víctimas, responsables y protectores. Cada cita se rastrea hasta su fuente, y el análisis distingue lo que dicen los textos de su interpretación sociológica.",
          "references": [
            "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58. https://doi.org/10.1111/j.1460-2466.1993.tb01304.x",
            "Fairclough, N. (1995). Critical discourse analysis: The critical study of language. Longman.",
            "Hennink, M. M., Kaiser, B. N., & Marconi, V. C. (2017). Code saturation versus meaning saturation: How many interviews are enough? Qualitative Health Research, 27(4), 591–608. https://doi.org/10.1177/1049732316665344",
            "Shanahan, E. A., Jones, M. D., & McBeth, M. K. (2018). How to conduct a Narrative Policy Framework study. The Social Science Journal, 55(3), 332–345. https://doi.org/10.1016/j.soscij.2017.12.002"
          ],
          "illustrations": [
            {
              "schema": [
                "Práctica social: contexto sociopolítico",
                "Práctica discursiva: producción y circulación",
                "Texto"
              ],
              "legende": "Modelo tridimensional del análisis crítico del discurso",
              "credit": "Esquema según Fairclough (1995)"
            }
          ]
        }
      ]
    },
    "expertises": {
      "titre": "Áreas de especialización",
      "items": [
        [
          "Dirección de establecimientos sanitarios, sociales y medicosociales",
          "Mi maestría (maîtrise) en dirección de estructuras medicosociales y de servicios a las personas (Université de Bretagne Occidentale, 2024, mención especial del jurado) abarca la gestión presupuestaria y financiera (CPOM, EPRD), la contabilidad, la gestión de recursos humanos y el derecho laboral, el management, la teoría y la sociología de las organizaciones, la filosofía y el proyecto de establecimiento. Como responsable de estancias de respiro y estancias adaptadas de 2016 a 2024, asumí la gestión de los equipos, del presupuesto y de la logística."
        ],
        [
          "Derecho sanitario, social y medicosocial",
          "Mi máster en Derecho público, especializado en derecho de la salud y derecho social (Université Paris-Panthéon-Assas, 2025, mención especial del jurado), trata de la organización y la planificación de los sectores sanitario, social y medicosocial: autorización, habilitación, tarificación y contencioso de la tarificación. Abarca también los derechos de los pacientes y de los usuarios, la bioética, la economía de la salud, la contractualización, la responsabilidad civil, penal y administrativa, así como el derecho laboral y de la seguridad social."
        ],
        [
          "Transformación de la oferta y apoyo al desempeño",
          "Como encargado de misión en la Agencia nacional francesa de apoyo al desempeño (ANAP, París) en 2024–2025, acompañé la transformación de la oferta de salud y servicios sociales: copilotaje de la red de expertos, animación de seminarios web, recopilación y análisis de datos, animación y coconstrucción de sesiones de comunidades de práctica."
        ],
        [
          "Envejecimiento, autonomía y EHPAD",
          "Mis dos memorias de máster tratan este campo: la adaptación de los EHPAD (residencias para mayores dependientes) a las personas con discapacidad envejecidas (Université de Bretagne Occidentale, 2024) y la aplicación del giro hacia el domicilio, comparando Francia y Quebec («Vieillir chez soi», Université Paris-Panthéon-Assas, 2025). Se suman una experiencia en EHPAD y el trabajo en la ANAP sobre la reforma de los servicios de autonomía a domicilio."
        ],
        [
          "Discapacidad y autodeterminación",
          "Como educador especializado en una residencia (Adapei 35, Saint-Malo, 2020–2023), evalué las necesidades de las personas acompañadas, coconstruí sus proyectos individualizados y coordiné un equipo pluridisciplinario. Mi memoria de 2023 trata de la influencia de las prácticas educativas en la autodeterminación. De 2016 a 2024 fui también responsable de estancias de respiro y estancias adaptadas para personas con discapacidad."
        ],
        [
          "Autismo",
          "Mi experiencia como educador especializado en una residencia, en la Adapei 35 de Saint-Malo de 2020 a 2023, incluye el acompañamiento de personas autistas. Este acompañamiento se basa en la evaluación de las necesidades propias de cada persona, la coconstrucción con ella de su proyecto individualizado y la coordinación de un equipo pluridisciplinario en torno a dicho proyecto."
        ],
        [
          "Metodología de investigación y evaluación de proyectos",
          "Doctorando en salud pública en la ESPUM (Université de Montréal), recurro a métodos mixtos, cuantitativos y cualitativos. Uno de mis ejes de investigación trata del desempeño, la gestión del cambio y el pilotaje de las organizaciones. En evaluación de proyectos, me apoyo en mi formación (evaluación de los establecimientos, contratos de objetivos y medios) y en las herramientas de apoyo a la decisión y de pilotaje elaboradas en la ANAP."
        ],
        [
          "Intersectorialidad y atención primaria",
          "Investigador en prácticas en el Centro de investigación del CHUM (CRCHUM), estudio las políticas de atención primaria, la intersectorialidad y la integración de cuidados y servicios. La intersectorialidad designa la acción concertada de varios sectores, como salud, servicios sociales, educación o vivienda, sobre problemas que exceden el ámbito de uno solo de ellos. Estos trabajos se vinculan con mi eje de análisis comparado de los sistemas de salud."
        ],
        [
          "Emprendimiento y gestión",
          "Formado en emprendimiento y gestión (diploma universitario, IAE de Brest, 2023), he iniciado la creación de OWNNIGHT, una aplicación de bienestar y educación del sueño. Mi enfoque de la gestión se apoya en la clínica de las organizaciones y en el desarrollo de la actividad de una estructura, estudiados en el máster, así como en el liderazgo de proximidad ejercido como responsable de estancias adaptadas."
        ]
      ]
    },
    "axes": {
      "titre": "Ejes de trabajo",
      "principaux": [
        "Gobernanza y evaluación de las políticas de salud",
        "Enfoque intersectorial en atención primaria",
        "Envejecimiento, pérdida de autonomía y políticas de permanencia en el domicilio"
      ],
      "secondairesTitre": "Ejes secundarios",
      "secondaires": [
        "Planificación jurídica, análisis doctrinal y derecho de la salud",
        "Desempeño, gestión del cambio y dirección de organizaciones",
        "Análisis comparado de sistemas de salud"
      ]
    }
  },
  valeurs: {
    "surtitre": "Valores",
    "titre": "Lo que guía mi práctica",
    "intro": "Seis valores que orientan mi trabajo, del terreno a la investigación.",
    "devise": [
      "Lema",
      "Ad astra per aspera",
      "A través de las dificultades hasta las estrellas"
    ],
    "items": [
      [
        "Pensamiento crítico",
        "Explorar otras disciplinas y formas de pensar, contrastar ideas y cuestionar las evidencias, los datos y las instituciones, empezando por las propias convicciones.",
        0
      ],
      [
        "Resiliencia",
        "Hacer de las pruebas vividas un recurso para avanzar.",
        1
      ],
      [
        "Autonomía",
        "Pensar por uno mismo y sostener en cada persona la capacidad de elegir su vida.",
        2
      ],
      [
        "Coconstruir por el bien colectivo",
        "Hacer con las personas, y no por ellas: una investigación con impacto, realizada con y para la gente.",
        4
      ],
      [
        "Audacia para innovar",
        "Atreverse a proponer, innovar, crear y poner en práctica nuevas respuestas.",
        5
      ],
      [
        "Equidad",
        "Permitir, en la medida de lo posible, que todas las personas desarrollen plenamente sus capacidades y hagan realidad sus aspiraciones.",
        3
      ]
    ]
  },
  implantation: {
    "surtitre": "03 · Implementación",
    "titre": "Transferencia de conocimientos e implementación",
    "intro": "Hacer circular los saberes entre las personas, los entornos de práctica y la investigación, y examinar después lo que realmente permiten cambiar.",
    "precision": "En mi tesis, la movilización de conocimientos acompaña la investigación: no es un estudio de implementación ni una evaluación de políticas.",
    "formation": {
      "etiquette": "Formación completada",
      "titre": "MobilizeU, movilización de conocimientos · Research Impact Canada y York University, 2026",
      "lien": "https://researchimpact.ca/learning/mobilizeu/",
      "lienTexte": "Más información"
    },
    "plan": {
      "titre": "En mi tesis: un plan de movilización de conocimientos",
      "items": [
        {
          "nom": "Por qué, qué, para quién, cómo",
          "texte": "El marco de Ward estructura el plan en cuatro preguntas: precisar el qué, el porqué y el quién antes de elegir el cómo, los formatos y los canales.",
          "ref": "Ward, 2017"
        },
        {
          "nom": "Del conocimiento a la acción",
          "texte": "El modelo del conocimiento a la acción enmarca la producción, la adaptación, la comunicación y el seguimiento de los conocimientos, sin pretender garantizar su adopción duradera.",
          "ref": "Graham et al., 2006"
        },
        {
          "nom": "Alianzas basadas en las 4R",
          "texte": "Respeto, pertinencia, reciprocidad y responsabilidad guían las alianzas con los pacientes y los entornos de práctica, apoyándose en el marco de participación de pacientes de los IRSC.",
          "ref": "Kirkness y Barnhardt, 1991; IRSC, 2014; Bowen y Graham, 2013"
        },
        {
          "nom": "Un diálogo deliberativo",
          "texte": "Un taller deliberativo convierte los resultados en recomendaciones contextualizadas, con un retorno a los participantes. La participación se informa según GRIPP2.",
          "ref": "Boyko et al., 2012; Lavis et al., 2009; Staniszewska et al., 2017"
        },
        {
          "nom": "Seguir la contribución, no la atribución",
          "texte": "Cuatro indicadores (producción, alcance, apropiación, uso documentado) y un registro permiten valorar la contribución plausible de la investigación, sin atribuirle los cambios posteriores.",
          "ref": "Morton, 2015"
        }
      ]
    },
    "cadres": {
      "titre": "Referencias en ciencia de la implementación",
      "items": [
        {
          "nom": "CFIR 2.0",
          "texte": "Examinar el contexto y los determinantes que facilitan o frenan la implementación.",
          "ref": "Damschroder et al., 2022"
        },
        {
          "nom": "Resultados de implementación",
          "texte": "Distinguir aceptabilidad, adopción, pertinencia, factibilidad, fidelidad, costo, penetración y sostenibilidad.",
          "ref": "Proctor et al., 2011"
        },
        {
          "nom": "Impacto de la investigación",
          "texte": "Los marcos de impacto cartografían sobre todo el camino de ida, de la investigación a la práctica; mis trabajos examinan también el camino de vuelta.",
          "ref": "Greenhalgh et al., 2016; Brownson et al., 2026"
        },
        {
          "nom": "Enfoque por contribuciones",
          "texte": "Vincular las producciones con los usos y después con los cambios documentados, examinando otras influencias posibles.",
          "ref": "Morton, 2015; Bayley y Phipps, 2019"
        },
        {
          "nom": "Coproducción y traslación integrada",
          "texte": "Los mecanismos de coproducción dependen de la infraestructura, de la claridad de los roles y del reparto del poder; sus costos también cuentan.",
          "ref": "Graham et al., 2019; Kothari et al., 2025; Oliver et al., 2019"
        },
        {
          "nom": "Una ciencia de la implementación crítica",
          "texte": "Teorizar en lugar de aplicar los marcos como listas de verificación.",
          "ref": "Kislov et al., 2019"
        },
        {
          "nom": "Participación y deliberación",
          "texte": "Diseñar y evaluar procesos de participación pública que dejen constancia de su influencia.",
          "ref": "Abelson et al., 2003; OCDE, 2022"
        },
        {
          "nom": "Por qué la implementación",
          "texte": "Demostrar que una innovación es eficaz no basta para garantizar que será adoptada.",
          "ref": "Bauer y Kirchner, 2020"
        },
        {
          "nom": "Estrategias de implementación",
          "texte": "La compilación ERIC ofrece un vocabulario común de 73 estrategias para describir, seleccionar e informar las estrategias empleadas.",
          "ref": "Powell et al., 2015"
        },
        {
          "nom": "Intervenciones complejas",
          "texte": "La implementación se convierte en una fase por derecho propio, con el contexto, la teoría del programa y las partes interesadas en el centro.",
          "ref": "Skivington et al., 2021"
        },
        {
          "nom": "Implementar con las personas mayores",
          "texte": "En Quebec, la implementación de un acompañamiento ciudadano para la participación social de las personas mayores arroja luz sobre las condiciones que importan.",
          "ref": "Gobeil et al., 2023"
        }
      ]
    },
    "ressources": {
      "titre": "Recursos",
      "items": [
        [
          "Glosario de la movilización de conocimientos",
          "Institutos de Investigación en Salud de Canadá (en francés)",
          "https://cihr-irsc.gc.ca/f/54014.html"
        ],
        [
          "Marco de participación de pacientes",
          "IRSC, Estrategia de investigación orientada al paciente (en francés)",
          "https://cihr-irsc.gc.ca/f/48413.html"
        ],
        [
          "Directrices sobre participación ciudadana",
          "OCDE, 2022",
          "https://doi.org/10.1787/f765caf6-en"
        ]
      ]
    },
    "chantiers": {
      "titre": "Ocho ejes de la movilización de conocimientos",
      "intro": "Cada eje vincula la literatura científica con mi práctica.",
      "detail": "Literatura científica",
      "items": [
        [
          "Movilizar",
          "Hacer circular los saberes en ambos sentidos",
          "Mobilizar, es hacer circular los conocimientos de la investigación hacia los entornos, pero también de los entornos y las personas hacia la investigación. El modelo de conocimientos a la acción distingue la creación de conocimientos y el ciclo de su puesta en práctica: identificar un problema, adaptar los conocimientos al contexto, detectar los obstáculos, apoyar y seguir el uso (Graham y al., 2006). Cinco preguntas organizan la démarche, qué transferir, a quién, por quién, cómo y con qué efecto, y se mobilizan primero conjuntos de evidencia en lugar de un estudio aislado (Grimshaw y al., 2012). El brokerage de conocimientos da un rostro a este trabajo de enlace (Munerol y al., 2013).",
          [
            "Graham et al. (2006)",
            "Grimshaw et al. (2012)",
            "Ward et al. (2012)",
            "Munerol et al. (2013)"
          ]
        ],
        [
          "Marcos",
          "Elegir un marco según la pregunta",
          "Un marco hace explícitos los criterios: por qué movilizar, qué conocimientos, con quién y cómo (Ward, 2017). Las teorías, modelos y marcos se agrupan en familias según lo que se busca lograr: guiar un proceso, explicar lo que facilita o obstaculiza, o evaluar (Nilsen, 2015). Algunos colocan la facilitación en el centro de la implementación (Harvey y Kitson, 2016); otros abarcan todo el ciclo de aplicación del conocimiento (Esmail et al., 2020). Elegirlos según la pregunta y discutirlos en lugar de marcarlos como una lista, hace que el enfoque sea más fructuoso (Kislov et al., 2019).",
          [
            "Ward (2017)",
            "Nilsen (2015)",
            "Harvey y Kitson (2016)",
            "Esmail et al. (2020)"
          ]
        ],
        [
          "Planificar",
          "Planificar desde el diseño",
          "Un plan de movilización precisa los públicos, los objetivos, los mensajes, las actividades, los recursos, el calendario y los indicadores (IRSC, 2012). Se construye con los socios desde la concepción del proyecto: concebir para la difusión y la sostenibilidad, es pensar temprano la adecuación entre los resultados y su contexto de adopción (Kwan y al., 2022). Los planes reales describen bien los socios y las estrategias, pero suelen olvidar a menudo la evaluación y los recursos (Tchameni Ngamo y al., 2016). Para empezar: conocer a sus públicos, rodearse, implicar a personas con experiencia vivida y sacar lecciones de cada ensayo (Diany y al., 2025; Dancause, 2023).",
          [
            "IRSC (2012)",
            "Tchameni Ngamo et al. (2016)",
            "Kwan et al. (2022)",
            "Diany et al. (2025)",
            "Dancause (2023)"
          ]
        ],
        [
          "Alianzas",
          "Coproducir y compartir el poder",
          "La coproducción y la aplicación integrada del conocimiento involucran a los usuarios de los resultados en cada etapa, desde la formulación hasta la difusión (Jull y al., 2017). Las aproximaciones de investigación en colaboración comparten principios, estrategias y resultados comunes, que un vocabulario compartido permite describir y comparar (Hoekstra y al., 2020). El compromiso se concibe en tres niveles: organización, valores y prácticas (Boaz y al., 2018), y se fundamenta en una interdependencia real y la co-creación (Skipper y Pepler, 2020). Requiere tiempo y recursos: sus costos deben ser reconocidos (Oliver y al., 2019).",
          [
            "Jull et al. (2017)",
            "Boaz et al. (2018)",
            "Hoekstra et al. (2020)",
            "Skipper y Pepler (2020)",
            "Oliver et al. (2019)"
          ]
        ],
        [
          "Inclusión",
          "Quién es escuchado, quién participa, quién se beneficia",
          "Una movilización inclusiva cuestiona el lugar de cada uno: quién es escuchado, quién participa, quién se beneficia (Georgalakis, 2023). Relacionar conocimientos y acción para la equidad implica redistribuir el poder y abordar las causas estructurales de las desigualdades (Plamondon y al., 2019). Los conocimientos de experiencia no son complementos: transforman las preguntas, los métodos y la interpretación (Breton, 2025). En salud indígena, las prácticas prometedoras respetan las formas de compartir conocimientos propias de las comunidades (Morton Ninomiya y al., 2022); en el campo del discapacidad, principios coconstruidos evitan la participación en la superficie (Gainforth y al., 2021).",
          [
            "Plamondon et al. (2019)",
            "Morton Ninomiya et al. (2022)",
            "Gainforth et al. (2021)",
            "Breton (2025)",
            "Georgalakis (2023)"
          ]
        ],
        [
          "Públicos",
          "Elegir el formato según el objetivo",
          "El formato sigue el objetivo: co-crear (diálogo deliberativo, café del mundo, taller), difundir (exposición, webinario, mesa redonda) o implementar (formación, reunión de proyecto). La accesibilidad se concibe en todas sus formas, física, sensorial, financiera, cultural y lingüística: los públicos deben sentirse incluidos, no solo invitados. El modelo de Montreal reconoce los saberes experimentales de los pacientes como complementarios de los saberes profesionales (Pomey et al., 2015), y muchos marcos apoyan la participación de los pacientes y del público en la investigación (Greenhalgh et al., 2019). Los resúmenes en lenguaje claro (Stoll et al., 2022) y el arte visual coconstruido (Courcy et al., 2022) abren la investigación a otros públicos.",
          [
            "Pomey et al. (2015)",
            "Greenhalgh et al. (2019)",
            "Stoll et al. (2022)",
            "Courcy et al. (2022)"
          ]
        ],
        [
          "Comunicar",
          "Buscar el uso tanto como la visibilidad",
          "La comunicación estratégica y la aplicación de conocimientos se superponen sin coincidir: una apoya la visibilidad, la otra el uso (Barwick y al., 2014). El intermediario de conocimientos trabaja en un entretiempo, tejiendo enlaces entre investigadores y tomadores de decisiones en lugar de difundir productos (Lomas, 2007). En las políticas públicas, la pertinencia de los datos y los factores organizacionales pesan mucho (Oliver y al., 2026), mientras que los consejos dados a los investigadores rara vez se basan en evidencia y callan los costos del compromiso (Oliver y Cairney, 2019). Una intervención de intermediación en una agencia regional de salud muestra que las habilidades progresan más rápido que la influencia en las decisiones (Fillol y al., 2026).",
          [
            "Lomas (2007)",
            "Barwick et al. (2014)",
            "Oliver y Cairney (2019)",
            "Oliver et al. (2026)",
            "Fillol et al. (2026)"
          ]
        ],
        [
          "Impacto",
          "Seguir la contribución, no la atribución",
          "Evaluar el impacto consiste en seguir la contribución de la investigación a los cambios sin atribuirle a ella sola: producciones, alcance, apropiación, usos documentados, así como efectos para los servicios y las personas (Morton, 2015). El análisis de contribución ofrece una metodología racionalizada cuando la atribución causal estricta resulta fuera de alcance (Mayne, 2012). Marco teóricos franceses hacen visibles los efectos del traslado (Gervais y al., 2016), y una revisión canadiense recopila los modelos utilizados para evaluar las estrategias de movilización (Ziam y al., 2024). Queda una pregunta abierta y discutida: en qué medida es posible evaluar el traslado (Plouffe, 2015)?",
          [
            "Mayne (2012)",
            "Morton (2015)",
            "Gervais et al. (2016)",
            "Ziam et al. (2024)",
            "Plouffe (2015)"
          ]
        ]
      ]
    },
    "bibliographie": {
      "titre": "Referencias (APA)",
      "items": [
        "Abelson, J., Forest, P.-G., Eyles, J., Smith, P., Martin, E., & Gauvin, F.-P. (2003). Deliberations about deliberative methods: Issues in the design and evaluation of public participation processes. Social Science & Medicine, 57(2), 239–251. https://doi.org/10.1016/S0277-9536(02)00343-X",
        "Barwick, M., Phipps, D., Myers, G., Johnny, M., & Coriandoli, R. (2014). Knowledge translation and strategic communications: Unpacking differences and similarities for scholarly and research communications. Scholarly and Research Communication, 5(3). https://doi.org/10.22230/src.2014v5n3a175",
        "Bauer, M. S., & Kirchner, J. (2020). Implementation science: What is it and why should I care? Psychiatry Research, 283, Article 112376. https://doi.org/10.1016/j.psychres.2019.04.025",
        "Bayley, J. E., & Phipps, D. (2019). Building the concept of research impact literacy. Evidence & Policy, 15(4), 597–606. https://doi.org/10.1332/174426417X15034894876108",
        "Beaulieu, M.-D. (2016). Construction et hiérarchisation des données probantes en santé : savoirs scientifiques, expérientiels et contextuels. Revue du CREMIS, 9(2), 9-15. https://cremis.ca/publications/articles-et-medias/construction-et-hierarchisation-des-donnees-probantes-en-sante-savoirs-scientifiques-experientiels-et-contextuels/",
        "Berrada, M. (2026, 2 juin). Recherche et politiques publiques : comment mieux faire circuler les savoirs ? Affaires universitaires. https://www.affairesuniversitaires.ca/actualites/recherche-et-politiques-publiques-comment-mieux-faire-circuler-les-savoirs/",
        "Boaz, A., Hanney, S., Borst, R., O’Shea, A., & Kok, M. (2018). How to engage stakeholders in research: Design principles to support improvement. Health Research Policy and Systems, 16, Article 60. https://doi.org/10.1186/s12961-018-0337-6",
        "Bowen, S. J., & Graham, I. D. (2013). From knowledge translation to engaged scholarship: Promoting research relevance and utilization. Archives of Physical Medicine and Rehabilitation, 94(1 Suppl.), S3–S8. https://doi.org/10.1016/j.apmr.2012.04.037",
        "Boyko, J. A., Lavis, J. N., Abelson, J., Dobbins, M., & Carter, N. (2012). Deliberative dialogues as a mechanism for knowledge translation and exchange in health systems decision-making. Social Science & Medicine, 75(11), 1938–1945. https://doi.org/10.1016/j.socscimed.2012.06.016",
        "Breton, H. (2025). Savoirs expérientiels en santé : revue systématique de littérature. Santé Publique, 37(3), 241-251. https://doi.org/10.3917/spub.255.0241",
        "Brownson, R. C., Iwelunmor, J., Odeny, T. A., Proctor, E. K., & Geng, E. H. (2026). So what? Elevating the impact of implementation science. Implementation Science Communications, 7, 2. https://doi.org/10.1186/s43058-025-00831-9",
        "Bulloch, M. N. (Animatrice). (2024, 17 juillet). SCCM Pod-520: Implementation science: From evidence to practice [Balado]. Dans SCCM Podcast. Society of Critical Care Medicine. https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice",
        "Centre de collaboration nationale des méthodes et outils. (2016, 4 juillet). CCNMO - Prise de décisions fondée sur des données probantes [Vidéo]. YouTube. https://www.youtube.com/watch?v=XrZjc3Flrz8",
        "Courcy, I., Bureau, A., & Grenier, G. (2022). L’art visuel comme outil de pratique en mobilisation et transfert de connaissances : retour sur un projet de cocréation d’une murale alliant la recherche, l’art et des savoirs expérientiels. Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 6(3). https://doi.org/10.18166/tuc.2022.6.3.25",
        "Crowley, D. M., & Scott, J. T. (2023). To support evidence-based policymaking, bring researchers and policymakers together. Issues in Science and Technology, 39(2), 31-35. https://issues.org/evidence-based-policymaking-researchers-policymakers-collaborate-crowley-scott/",
        "Dagenais, C., Hot, A., & Ridde, V. (2023, 21 février). Communiquer efficacement les connaissances scientifiques permet de sauver des vies. The Conversation. https://theconversation.com/communiquer-efficacement-les-connaissances-scientifiques-permet-de-sauver-des-vies-197191",
        "Damschroder, L. J., Reardon, C. M., Widerquist, M. A. O., & Lowery, J. (2022). The updated Consolidated Framework for Implementation Research based on user feedback. Implementation Science, 17, 75. https://doi.org/10.1186/s13012-022-01245-0",
        "Dancause, L. (2023). Guide pédagogique sur la mobilisation des connaissances (L. Cardinal & J. Luckerhoff, dir.). Laboratoire interdisciplinaire de recherche sur l’enseignement supérieur. https://www.erudit.org/fr/livres/hors-collection/guide-pedagogique-sur-la-mobilisation-des-connaissances/",
        "David, G., & Grégoire, A. (2018). Guide pratique – Stratégie de partenariat avec les patients et le public en recherche. Unité de soutien SRAP du Québec. https://ceppp.ca/wp-content/uploads/2021/01/USSQ_Guide-pratique-SPPP-en-recherche_V1.pdf",
        "Diany, R., Fitzgibbon-Collins, L. K., & Gagliano Taliun, S. A. (2025). Ten simple rules for getting started with knowledge mobilization. PLOS Computational Biology, 21(4), e1012888. https://doi.org/10.1371/journal.pcbi.1012888",
        "Équipe RENARD. (2023, 26 mai). Ancrage historique et évolution du courtage de connaissances [Vidéo]. YouTube. https://www.youtube.com/watch?v=3uucW5ZOp-g",
        "Équipe RENARD. (2023, 29 mai). Les compétences clés pour agir en courtage de connaissances [Vidéo]. YouTube. https://www.youtube.com/watch?v=RGVmhf9Wyzo",
        "Esmail, R., Hanson, H. M., Holroyd-Leduc, J., Brown, S., Strifler, L., Straus, S. E., Niven, D. J., & Clement, F. M. (2020). A scoping review of full-spectrum knowledge translation theories, models, and frameworks. Implementation Science, 15, Article 11. https://doi.org/10.1186/s13012-020-0964-5",
        "Fillol, A., Traverson, L., Zitti, T., Bars, G., Minssieux, N., Hot, A., Dagenais, C., & Ridde, V. (2026). Évaluation d’une intervention de courtage de connaissances à l’Agence régionale de santé Île-de-France. Santé Publique, 38(1), 15-34. https://doi.org/10.3917/spub.261.0015",
        "Gainforth, H. L., Hoekstra, F., McKay, R., McBride, C. B., Sweet, S. N., Martin Ginis, K. A., Anderson, K., Chernesky, J., Clarke, T., Forwell, S., Maffin, J., McPhail, L. T., Mortenson, W. B., Scarrow, G., Schaefer, L., Sibley, K. M., Athanasopoulos, P., & Willms, R. (2021). Integrated knowledge translation guiding principles for conducting and disseminating spinal cord injury research in partnership. Archives of Physical Medicine and Rehabilitation, 102(4), 656-663. https://doi.org/10.1016/j.apmr.2020.09.393",
        "Georgalakis, J. (2023, 16 janvier). We need to talk about equity in knowledge mobilisation. Transforming Evidence. https://transforming-evidence.org/blog/we-need-to-talk-about-equity-in-knowledge-mobilisation",
        "Gervais, M.-J., Souffez, K., & Ziam, S. (2016). Quel impact avons-nous ? Vers l’élaboration d’un cadre pour rendre visibles les retombées du transfert des connaissances. Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 1(1). https://doi.org/10.18166/tuc.2016.1.1.5",
        "Gobeil, J., Gaumond, V., Germain, S., Vézina, A., Duguay, A.-M., & Levasseur, M. (2023). Implantation de l’Accompagnement-citoyen personnalisé d’intégration communautaire (APIC) : vers l’optimisation de la mise en œuvre de cette approche novatrice visant la participation sociale des aînés. Canadian Journal on Aging / La Revue canadienne du vieillissement, 42(4), 551-564. https://doi.org/10.1017/S0714980823000132",
        "Gobel, U. (2021, 8 février). Knowledge mobilization will help Canada face the next major challenge. Policy Options. https://policyoptions.irpp.org/magazines/february-2021/knowledge-mobilization-will-help-canada-face-the-next-major-challenge/",
        "Graham, I. D., Logan, J., Harrison, M. B., Straus, S. E., Tetroe, J., Caswell, W., & Robinson, N. (2006). Lost in knowledge translation: Time for a map? Journal of Continuing Education in the Health Professions, 26(1), 13–24. https://doi.org/10.1002/chp.47",
        "Graham, I. D., McCutcheon, C., & Kothari, A. (2019). Exploring the frontiers of research co-production: The Integrated Knowledge Translation Research Network concept papers. Health Research Policy and Systems, 17, 88. https://doi.org/10.1186/s12961-019-0501-7",
        "Greenhalgh, T., Hinton, L., Finlay, T., Macfarlane, A., Fahy, N., Clyde, B., & Chant, A. (2019). Frameworks for supporting patient and public involvement in research: Systematic review and co-design pilot. Health Expectations, 22(4), 785-801. https://doi.org/10.1111/hex.12888",
        "Greenhalgh, T., Raftery, J., Hanney, S., & Glover, M. (2016). Research impact: A narrative review. BMC Medicine, 14, 78. https://doi.org/10.1186/s12916-016-0620-8",
        "Grimshaw, J. M., Eccles, M. P., Lavis, J. N., Hill, S. J., & Squires, J. E. (2012). Knowledge translation of research findings. Implementation Science, 7, Article 50. https://doi.org/10.1186/1748-5908-7-50",
        "Harvey, G., & Kitson, A. (2016). PARIHS revisited: From heuristic to integrated framework for the successful implementation of knowledge into practice. Implementation Science, 11, Article 33. https://doi.org/10.1186/s13012-016-0398-2",
        "Hoekstra, F., Mrklas, K. J., Khan, M., McKay, R. C., Vis-Dunbar, M., Sibley, K. M., Nguyen, T., Graham, I. D., SCI Guiding Principles Consensus Panel, & Gainforth, H. L. (2020). A review of reviews on principles, strategies, outcomes and impacts of research partnerships approaches: A first step in synthesising the research partnership literature. Health Research Policy and Systems, 18, Article 51. https://doi.org/10.1186/s12961-020-0544-9",
        "Institut du Nouveau Monde. (2026, 31 mars). Quand l’expertise académique rencontre le vécu du terrain (Épisode 2) [Balado]. Dans Le Réverbère : mini-série sur la science citoyenne. YouTube. https://www.youtube.com/watch?v=J6gVGWA_yhc",
        "Instituts de recherche en santé du Canada. (2012). Guide de planification de l’application des connaissances aux IRSC : approches intégrées et de fin de subvention. https://irsc-cihr.gc.ca/f/documents/kt_lm_ktplan-fr.pdf",
        "Instituts de recherche en santé du Canada. (2014). Cadre d’engagement des patients de la Stratégie de recherche axée sur le patient. https://cihr-irsc.gc.ca/f/48413.html",
        "Jabet, C., & Petitgand, C. (2022, 21 juillet). Au-delà de l’acceptabilité sociale, ouvrir le dialogue pour favoriser la participation citoyenne au débat sur l’utilisation des données de santé. Fonds de recherche du Québec. https://frq.gouv.qc.ca/ouvrir-le-dialogue-pour-favoriser-la-participation-citoyenne/",
        "Jull, J., Giles, A., & Graham, I. D. (2017). Community-based participatory research and integrated knowledge translation: Advancing the co-creation of knowledge. Implementation Science, 12, Article 150. https://doi.org/10.1186/s13012-017-0696-3",
        "Kirkness, V. J., & Barnhardt, R. (1991). First Nations and higher education: The four R’s—Respect, relevance, reciprocity, responsibility. Journal of American Indian Education, 30(3), 1–15.",
        "Kislov, R., Pope, C., Martin, G. P., & Wilson, P. M. (2019). Harnessing the power of theorising in implementation science. Implementation Science, 14, 103. https://doi.org/10.1186/s13012-019-0957-4",
        "Kothari, A., Sibbald, S. L., McCutcheon, C., Berta, W., Urquhart, R., Horsley, T., Comer, L., & Graham, I. D. (2025). How does integrated knowledge translation work? A realist review. Health Research Policy and Systems, 23, 102. https://doi.org/10.1186/s12961-025-01374-0",
        "Kwan, B. M., Brownson, R. C., Glasgow, R. E., Morrato, E. H., & Luke, D. A. (2022). Designing for dissemination and sustainability to promote equitable impacts on health. Annual Review of Public Health, 43, 331-353. https://doi.org/10.1146/annurev-publhealth-052220-112457",
        "Lavis, J. N., Boyko, J. A., Oxman, A. D., Lewin, S., & Fretheim, A. (2009). SUPPORT Tools for evidence-informed health Policymaking (STP) 14: Organising and using policy dialogues to support evidence-informed policymaking. Health Research Policy and Systems, 7(Suppl. 1), S14. https://doi.org/10.1186/1478-4505-7-S1-S14",
        "Lemire, N., Souffez, K., & Laurendeau, M.-C. (2009). Animer un processus de transfert des connaissances : bilan des connaissances et outil d’animation. Institut national de santé publique du Québec. https://www.inspq.qc.ca/publications/1012",
        "Les humains derrière la recherche en soins palliatifs. (2025, 13 novembre). Le pont entre la recherche et le terrain [Balado]. Apple Podcasts. https://podcasts.apple.com/ca/podcast/le-pont-entre-la-recherche-et-le-terrain/id1608211841?i=1000736634362",
        "Lomas, J. (2007). The in-between world of knowledge brokering. BMJ, 334(7585), 129-132. https://doi.org/10.1136/bmj.39038.593380.AE",
        "Massuard, M. (2023). Guide pour accompagner l’implantation de pratiques prometteuses dans un établissement : soutien à l’implantation de pratiques prometteuses et au transfert de connaissances dans le réseau de la santé et des services sociaux (J. Lane, dir.). Ministère de la Santé et des Services sociaux. https://publications.msss.gouv.qc.ca/msss/fichiers/2023/23-516-04W.pdf",
        "Mayne, J. (2012). Contribution analysis: Coming of age? Evaluation, 18(3), 270-280. https://doi.org/10.1177/1356389012451663",
        "Morton Ninomiya, M. E., Maddox, R., Brascoupé, S., Robinson, N., Atkinson, D., Firestone, M., Ziegler, C., & Smylie, J. (2022). Knowledge translation approaches and practices in Indigenous health research: A systematic review. Social Science & Medicine, 301, Article 114898. https://doi.org/10.1016/j.socscimed.2022.114898",
        "Morton, S. (2015). Progressing research impact assessment: A “contributions” approach. Research Evaluation, 24(4), 405–419. https://doi.org/10.1093/reseval/rvv016",
        "Munerol, L., Cambon, L., & Alla, F. (2013). Le courtage en connaissances, définition et mise en œuvre : une revue de la littérature. Santé Publique, 25(5), 587-597. https://doi.org/10.3917/spub.135.0587",
        "NCI Scientific Events and Resources. (2022, 23 février). TIDIRC: Introduction to dissemination & implementation science [Vidéo]. YouTube. https://www.youtube.com/watch?v=DO2tv7DqL3w",
        "Nilsen, P. (2015). Making sense of implementation theories, models and frameworks. Implementation Science, 10, Article 53. https://doi.org/10.1186/s13012-015-0242-0",
        "OECD. (2022). OECD guidelines for citizen participation processes. OECD Publishing. https://doi.org/10.1787/f765caf6-en",
        "Oliver, K., & Cairney, P. (2019). The dos and don’ts of influencing policy: A systematic review of advice to academics. Palgrave Communications, 5, Article 21. https://doi.org/10.1057/s41599-019-0232-y",
        "Oliver, K., Kothari, A., & Mays, N. (2019). The dark side of coproduction: Do the costs outweigh the benefits for health research? Health Research Policy and Systems, 17, 33. https://doi.org/10.1186/s12961-019-0432-3",
        "Oliver, K., Malin, J., Akerlof, K. L., Day, E., Grant, S., McGill, E., Lorenc, T., Martin, P., Lam, J., Williamson, L. E., Mouthaan, M., Pleguezuelo, V. C., Iqbal, S., Jaques, L., Nyanchoka, M., Cesar Alejandre, J., Lane, L., Persson, E., Forde, H., . . . Falconer, J. (2026). What factors influence evidence use in policy? An updated systematic map. Humanities and Social Sciences Communications. Publication en ligne anticipée. https://doi.org/10.1057/s41599-026-08391-6",
        "Plamondon, K. M., Caxaj, C. S., Graham, I. D., & Bottorff, J. L. (2019). Connecting knowledge with action for health equity: A critical interpretive synthesis of promising practices. International Journal for Equity in Health, 18, Article 202. https://doi.org/10.1186/s12939-019-1108-x",
        "Plouffe, L. (2015, 20 novembre). Les retombées vers les milieux : dans quelle mesure l’évaluation du transfert des connaissances est-elle possible? [Vidéo]. Institut de recherche Robert-Sauvé en santé et en sécurité du travail. https://www.irsst.qc.ca/publications-et-outils/video/i/100291/n/les-retombees-vers-les-milieux-dans-quelle-mesure-l-evaluation-du-transfert-des-connaissances-est-elle-possible-",
        "Pomey, M.-P., Flora, L., Karazivan, P., Dumez, V., Lebel, P., Vanier, M.-C., Débarges, B., Clavel, N., & Jouet, E. (2015). Le « Montreal model » : enjeux du partenariat relationnel entre patients et professionnels de la santé. Santé Publique, 27(1, suppl.), S41-S50. https://doi.org/10.3917/spub.150.0041",
        "Powell, B. J., Waltz, T. J., Chinman, M. J., Damschroder, L. J., Smith, J. L., Matthieu, M. M., Proctor, E. K., & Kirchner, J. E. (2015). A refined compilation of implementation strategies: Results from the Expert Recommendations for Implementing Change (ERIC) project. Implementation Science, 10, Article 21. https://doi.org/10.1186/s13012-015-0209-1",
        "Proctor, E., Silmere, H., Raghavan, R., Hovmand, P., Aarons, G., Bunger, A., Griffey, R., & Hensley, M. (2011). Outcomes for implementation research: Conceptual distinctions, measurement challenges, and research agenda. Administration and Policy in Mental Health and Mental Health Services Research, 38(2), 65–76. https://doi.org/10.1007/s10488-010-0319-7",
        "Pullmann, M., & King, K. (Animateurs). (2024, 8 juin). Season 2, Ep 1: David Chambers [Balado]. Dans That Implementation Science Podcast. Podbean. https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/",
        "Ridde, V., Hot, A., & Dagenais, C. (2025, 16 février). Pour mieux communiquer la science, commençons par bien choisir nos mots. The Conversation. https://theconversation.com/pour-mieux-communiquer-la-science-commencons-par-bien-choisir-nos-mots-247661",
        "Skipper, Y., & Pepler, D. J. (2020). Knowledge mobilization: Stepping into interdependent and relational space using co-creation. Action Research. Publication anticipée en ligne. https://doi.org/10.1177/1476750320960810",
        "Skivington, K., Matthews, L., Simpson, S. A., Craig, P., Baird, J., Blazeby, J. M., Boyd, K. A., Craig, N., French, D. P., McIntosh, E., Petticrew, M., Rycroft-Malone, J., White, M., & Moore, L. (2021). A new framework for developing and evaluating complex interventions: Update of Medical Research Council guidance. BMJ, 374, Article n2061. https://doi.org/10.1136/bmj.n2061",
        "Souffez, K., & Laurendeau, M.-C. (s. d.). Outil pour soutenir l’élaboration d’un plan de transfert des connaissances. Institut national de santé publique du Québec. https://www.inspq.qc.ca/sites/default/files/publications/outil_pour_soutenir_l_elaboration_d_un_plan_de_transfert_des_connaissances.pdf",
        "Staniszewska, S., Brett, J., Simera, I., Seers, K., Mockford, C., Goodlad, S., Altman, D. G., Moher, D., Barber, R., Denegri, S., Entwistle, A., Littlejohns, P., Morris, C., Suleman, R., Thomas, V., & Tysall, C. (2017). GRIPP2 reporting checklists: Tools to improve reporting of patient and public involvement in research. BMJ, 358, j3453. https://doi.org/10.1136/bmj.j3453",
        "Stoll, M., Kerwer, M., Lieb, K., & Chasiotis, A. (2022). Plain language summaries: A systematic review of theory, guidelines and empirical research. PLOS ONE, 17(6), Article e0268789. https://doi.org/10.1371/journal.pone.0268789",
        "Tchameni Ngamo, S., Souffez, K., Lord, C., & Dagenais, C. (2016). Do knowledge translation (KT) plans help to structure KT practices? Health Research Policy and Systems, 14, Article 46. https://doi.org/10.1186/s12961-016-0118-z",
        "Unité de soutien SSA Québec. (2025, 21 février). Expériences du midi: Recherche en partenariat avec une citoyenne-chercheuse [Vidéo]. YouTube. https://www.youtube.com/watch?v=TNwIcNyGjwY",
        "Villeneuve, V., & Tousignant, C. (Animatrices). (2024, 30 septembre). Patient partenaire : des alliés pour la recherche (Épisode 23) [Balado]. Dans Des femmes comme vous. Les Radieuses Magazine. https://www.youtube.com/watch?v=27KRzWNoxAA",
        "Ward, V. (2017). Why, whose, what and how? A framework for knowledge mobilisers. Evidence & Policy, 13(3), 477–497. https://doi.org/10.1332/174426416X14634763278725",
        "Ward, V., Smith, S., House, A., & Hamer, S. (2012). Exploring knowledge exchange: A useful framework for practice and policy. Social Science & Medicine, 74(3), 297-304. https://doi.org/10.1016/j.socscimed.2011.09.021",
        "Ziam, S., Lanoue, S., McSween-Cadieux, E., Gervais, M.-J., Lane, J., Gaid, D., Chouinard, L. J., Dagenais, C., Ridde, V., Jean, E., Fleury, F. C., Hong, Q. N., & Prigent, O. (2024). A scoping review of theories, models and frameworks used or proposed to evaluate knowledge mobilization strategies. Health Research Policy and Systems, 22, Article 8. https://doi.org/10.1186/s12961-023-01090-7"
      ]
    },
    "transfert": {
      "titre": "Transferencia de conocimientos e implementación",
      "detail": "Cinco tiempos",
      "etapes": [
        [
          "Escuchar",
          "Construir la pregunta con los entornos de práctica",
          "Todo comienza con la escucha: identificar con los entornos las necesidades y las decisiones a iluminar, luego precisar quién participa, en qué momento y con qué influencia. Los planes de transferencia suelen ignorar a menudo el conocimiento fino de los públicos (Tchameni Ngamo y al., 2016); la aplicación integrada del conocimiento, en cambio, incluye a los usuarios de los resultados desde la formulación de la pregunta (Jull y al., 2017). El respeto, la pertinencia, la reciprocidad y la responsabilidad guían esta primera reunión (Kirkness y Barnhardt, 1991).",
          [
            "Necesidades",
            "Participación"
          ]
        ],
        [
          "Hacer circular",
          "Contextualizar los saberes",
          "Los conocimientos de la investigación no circulan solos: se encuentran con conocimientos de experiencia y contexto que deben ponerse en diálogo, en lugar de oponerse (Breton, 2025). El intercambio de conocimientos es un proceso social, compuesto por idas y vueltas, y no una simple transmisión (Ward y al., 2012). Adaptar el formato, el lenguaje y el contenido a los usos buscados pasa por resúmenes en lenguaje claro (Stoll y al., 2022) y, a menudo, por un intermediario de conocimientos que establece el vínculo (Lomas, 2007).",
          [
            "Saberes de experiencia",
            "Formatos adaptados"
          ]
        ],
        [
          "Coconstruir",
          "Discutir las opciones y las decisiones",
          "Consultar recoge opiniones; coconstruir, es elaborar juntos; deliberar, es examinar argumentos y arbitrarios. El diálogo deliberativo transforma resultados en opciones discutidas por las personas involucradas (Boyko y al., 2012). Aún hay que documentar la influencia real de las contribuciones y reconocer los costos de la coproducción para todas las partes (Oliver y al., 2019), con el fin de evitar una participación de cara (Gainforth y al., 2021).",
          [
            "Coconstrucción",
            "Deliberación"
          ]
        ],
        [
          "Implementar",
          "Acompañar la puesta en marcha",
          "Una práctica prometedora no se implanta por sí sola: demostrar su eficacia no garantiza su adopción (Bauer y Kirchner, 2020). Es necesario examinar el contexto, los recursos y los obstáculos con marcos como el CFIR (Damschroder et al., 2022), luego elegir y describir las estrategias de acompañamiento en un vocabulario compartido (Powell et al., 2015). En Quebec, la implantación de un acompañamiento ciudadano junto a los adultos mayores ilumina los factores favorables, los obstáculos y las condiciones esenciales (Gobeil et al., 2023).",
          [
            "Implementación",
            "CFIR"
          ]
        ],
        [
          "Evaluar",
          "Distinguir producir, utilizar y cambiar",
          "Un producto difundido es una producción; su adopción es un resultado de implementación; los cambios para los servicios y las personas son otros resultados, a documentar por separado (Proctor et al., 2011). En lugar de atribuir estos cambios solo a la investigación, se sigue su contribución plausible examinando las otras influencias (Mayne, 2012; Morton, 2015). Marco francófonos ayudan a hacer visibles estas repercusiones (Gervais et al., 2016).",
          [
            "Evaluación",
            "Impacto"
          ]
        ]
      ],
      "note": "Estos cinco tiempos se inspiran en el modelo del conocimiento a la acción (Graham et al., 2006) y en el marco de Ward (2017)."
    }
  },
  ressources: {
    "surtitre": "Recursos",
    "titre": "Artículos, cápsulas y pódcasts",
    "intro": "Una selección comentada para profundizar en la movilización del conocimiento y la ciencia de la implementación, en francés y en inglés.",
    "langues": [
      "En francés",
      "En inglés"
    ],
    "groupes": [
      [
        "Artículos científicos de acceso abierto",
        [
          [
            "Making sense of implementation theories, models and frameworks",
            "Nilsen, Implementation Science, 2015 (en inglés)",
            "https://doi.org/10.1186/s13012-015-0242-0",
            "La tipología que clasifica las teorías, los modelos y los marcos en cinco familias (modelos de proceso, marcos de determinantes, teorías clásicas, teorías de la implementación, marcos de evaluación) según lo que se busca hacer: guiar, explicar o evaluar."
          ],
          [
            "Community-based participatory research and integrated knowledge translation: advancing the co-creation of knowledge",
            "Jull, Giles y Graham, Implementation Science, 2017 (en inglés)",
            "https://doi.org/10.1186/s13012-017-0696-3",
            "Pone lado a lado la investigación participativa basada en la comunidad y la traslación integrada del conocimiento para mostrar en qué convergen, en qué divergen y qué puede tomar cada una de la otra para coconstruir saberes."
          ],
          [
            "The dos and don’ts of influencing policy: a systematic review of advice to academics",
            "Oliver y Cairney, Palgrave Communications, 2019 (en inglés)",
            "https://doi.org/10.1057/s41599-019-0232-y",
            "Una revisión sistemática de los consejos dados a los investigadores que quieren influir en las políticas: estos consejos rara vez se basan en datos y pasan por alto los costos y los riesgos de implicarse en el ámbito político."
          ],
          [
            "Connecting knowledge with action for health equity: a critical interpretive synthesis of promising practices",
            "Plamondon, Caxaj, Graham y Bottorff, International Journal for Equity in Health, 2019 (en inglés)",
            "https://doi.org/10.1186/s12939-019-1108-x",
            "Una síntesis interpretativa crítica que identifica prácticas prometedoras para vincular saberes y acción en favor de la equidad, con énfasis en la redistribución del poder y en las causas estructurales de las desigualdades."
          ],
          [
            "Quel impact avons-nous ? Vers l’élaboration d’un cadre pour rendre visibles les retombées du transfert des connaissances",
            "Gervais, Souffez y Ziam, Revue francophone de recherche sur le transfert et l’utilisation des connaissances, 2016 (en francés)",
            "https://doi.org/10.18166/tuc.2016.1.1.5",
            "A partir del examen de 29 marcos conceptuales, sienta en francés las bases de un marco para hacer visibles las repercusiones de las actividades de transferencia y responder a las exigencias de rendición de cuentas de las organizaciones."
          ],
          [
            "Plain language summaries: A systematic review of theory, guidelines and empirical research",
            "Stoll, Kerwer, Lieb y Chasiotis, PLOS ONE, 2022 (en inglés)",
            "https://doi.org/10.1371/journal.pone.0268789",
            "Repasa las teorías, las directrices y los estudios empíricos sobre los resúmenes en lenguaje claro y extrae de ellos un marco conceptual para redactar síntesis comprensibles para un público no especializado."
          ]
        ]
      ],
      [
        "Guías y herramientas",
        [
          [
            "Animer un processus de transfert des connaissances : bilan des connaissances et outil d’animation",
            "Nicole Lemire, Karine Souffez y Marie-Claire Laurendeau, Institut national de santé publique du Québec, 2009 (en francés)",
            "https://www.inspq.qc.ca/publications/1012",
            "La guía quebequense que concibe la transferencia como un proceso dinámico y propone una herramienta de facilitación y una lista de verificación para estructurar cada etapa con los actores implicados."
          ],
          [
            "Outil pour soutenir l’élaboration d’un plan de transfert des connaissances",
            "Karine Souffez y Marie-Claire Laurendeau, Institut national de santé publique du Québec, sin fecha (metadatos del PDF: 2011) (en francés)",
            "https://www.inspq.qc.ca/sites/default/files/publications/outil_pour_soutenir_l_elaboration_d_un_plan_de_transfert_des_connaissances.pdf",
            "Una plantilla para completar en equipo, desde el inicio de un proyecto, a fin de precisar los productos de conocimiento, los públicos y los actores que hay que implicar y, después, las estrategias, los plazos y los recursos del plan de transferencia."
          ],
          [
            "Guide pour accompagner l’implantation de pratiques prometteuses dans un établissement : soutien à l’implantation de pratiques prometteuses et au transfert de connaissances dans le réseau de la santé et des services sociaux",
            "Marie Massuard, bajo la dirección de Julie Lane, Ministère de la Santé et des Services sociaux du Québec, 2023 (en francés)",
            "https://publications.msss.gouv.qc.ca/msss/fichiers/2023/23-516-04W.pdf",
            "Una guía ministerial quebequense que traduce la ciencia de la implementación y la traslación integrada del conocimiento en un proceso concreto de acompañamiento para los establecimientos de la red de salud y servicios sociales."
          ],
          [
            "Guide pratique – Stratégie de partenariat avec les patients et le public en recherche",
            "Geneviève David y Alexandre Grégoire, Unité de soutien SRAP du Québec y Centre d’excellence sur le partenariat avec les patients et le public (CEPPP), 2018 (en francés)",
            "https://ceppp.ca/wp-content/uploads/2021/01/USSQ_Guide-pratique-SPPP-en-recherche_V1.pdf",
            "Una guía de inicio, coescrita por un coordinador paciente, que responde a las preguntas por qué, quién, cuándo, dónde, cuánto y cómo implicar a pacientes y al público en un proyecto de investigación, incluidas la evaluación y las cuestiones éticas."
          ]
        ]
      ],
      [
        "Pódcasts",
        [
          [
            "Le pont entre la recherche et le terrain",
            "Les humains derrière la recherche en soins palliatifs, con Chantal Verdon (UQO), 2025 (en francés)",
            "https://podcasts.apple.com/ca/podcast/le-pont-entre-la-recherche-et-le-terrain/id1608211841?i=1000736634362",
            "Una investigadora en ciencias de enfermería explica cómo tendió un puente entre la investigación y la práctica, en particular mediante comunidades de práctica con enfermeras y enfermeros."
          ],
          [
            "Season 2, Ep 1: David Chambers",
            "That Implementation Science Podcast, presentado por Mike Pullmann y Kevin King, 2024 (en inglés)",
            "https://thatimplementationsciencepodcast.podbean.com/e/season-2-ep-1-david-chambers/",
            "El director adjunto de ciencia de la implementación del National Cancer Institute repasa la historia del campo, el carácter colectivo de la ciencia y lo que hace eficaz a un equipo de investigación."
          ],
          [
            "SCCM Pod-520: Implementation Science: From Evidence to Practice",
            "SCCM Podcast (Society of Critical Care Medicine), presentado por Marilyn N. Bulloch con Anne E. Sales, 2024 (en inglés)",
            "https://www.sccm.org/communications/sccm-podcast/sccm-podcast-all-episodes/sccm-pod-520-implementation-science-from-evidence-to-practice",
            "Una introducción accesible en la que una investigadora presenta la ciencia de la implementación como el estudio del cambio planificado de comportamientos dentro de las limitaciones de las organizaciones, con ejemplos clínicos."
          ]
        ]
      ],
      [
        "Cápsulas de vídeo",
        [
          [
            "Ancrage historique et évolution du courtage de connaissances",
            "Équipe RENARD, presentación de Christian Dagenais y Saliha Ziam en el coloquio 31 del 90.º congreso de la Acfas, 2023 (en francés)",
            "https://www.youtube.com/watch?v=3uucW5ZOp-g",
            "Una breve presentación que repasa de dónde viene la intermediación de conocimientos y cómo ha evolucionado esta función, a modo de introducción al papel del intermediario."
          ],
          [
            "Les compétences clés pour agir en courtage de connaissances",
            "Équipe RENARD, presentación de Esther McSween-Cadieux en el coloquio 31 del 90.º congreso de la Acfas, 2023 (en francés)",
            "https://www.youtube.com/watch?v=RGVmhf9Wyzo",
            "Hace balance de las competencias que necesita una persona para ejercer la intermediación de conocimientos, un complemento práctico a los textos sobre el papel del intermediario."
          ],
          [
            "Expériences du midi: Recherche en partenariat avec une citoyenne-chercheuse",
            "Unité de soutien SSA Québec, seminario web con Julie Coulombe y Marie-Hélène Morin, 2025 (en francés)",
            "https://www.youtube.com/watch?v=TNwIcNyGjwY",
            "Un caso concreto de investigación realizada con una ciudadana investigadora sobre el apoyo entre pares para familias en salud mental, que muestra lo que la ciencia participativa cambia en la conducción de un proyecto."
          ],
          [
            "CCNMO - Prise de décisions fondée sur des données probantes",
            "Centre de collaboration nationale des méthodes et outils (CCNMO), 2016 (en francés)",
            "https://www.youtube.com/watch?v=XrZjc3Flrz8",
            "Presenta en ocho minutos el modelo del CCNMO, que muestra cómo los datos de investigación, el contexto local, las preferencias de la población y los recursos se combinan en una decisión de salud pública."
          ],
          [
            "TIDIRC: Introduction to Dissemination & Implementation Science",
            "National Cancer Institute (TIDIRC OpenAccess), conferencia de David Chambers, 2022 (en inglés)",
            "https://www.youtube.com/watch?v=DO2tv7DqL3w",
            "Una conferencia introductoria que distingue la investigación sobre la difusión, la difusión de la investigación, la investigación sobre la implementación y la investigación pragmática, y presenta los conceptos básicos del campo."
          ],
          [
            "Quand l’expertise académique rencontre le vécu du terrain (Le Réverbère, mini-série sur la science citoyenne, épisode 2)",
            "Le Réverbère, Institut du Nouveau Monde con el Fonds de recherche du Québec, 2026 (en francés)",
            "https://www.youtube.com/watch?v=J6gVGWA_yhc",
            "Dúos de ciudadano e investigador cuentan cómo se reparten los roles en un proyecto de investigación surgido de una pregunta ciudadana, sin que ninguno de los dos pierda su propia experticia."
          ],
          [
            "Ép. 23 - Patient Partenaire: des alliés pour la recherche",
            "Des femmes comme vous, Les Radieuses Magazine, con Catherine Wilhelmy, 2024 (en francés)",
            "https://www.youtube.com/watch?v=27KRzWNoxAA",
            "Una paciente que llegó a ser responsable de la colaboración con pacientes en un centro de investigación explica al público general qué es el movimiento del paciente colaborador y por qué la experiencia vivida de los pacientes debe nutrir la investigación y la atención."
          ]
        ]
      ],
      [
        "Prensa y revistas",
        [
          [
            "Communiquer efficacement les connaissances scientifiques permet de sauver des vies",
            "Christian Dagenais, Aurélie Hot y Valéry Ridde, The Conversation (Canada), 2023 (en francés)",
            "https://theconversation.com/communiquer-efficacement-les-connaissances-scientifiques-permet-de-sauver-des-vies-197191",
            "Defiende la idea de que la investigación solo cambia las prácticas si sus resultados llegan a los responsables de las decisiones en una forma accesible y si el cambio se acompaña en el tiempo, con el apoyo de los financiadores."
          ],
          [
            "Pour mieux communiquer la science, commençons par bien choisir nos mots",
            "Valéry Ridde, Aurélie Hot y Christian Dagenais, The Conversation (Canada), 2025 (en francés)",
            "https://theconversation.com/pour-mieux-communiquer-la-science-commencons-par-bien-choisir-nos-mots-247661",
            "Muestra cómo la profusión de términos que compiten entre sí (transferencia, traslación, movilización…) enturbia la colaboración y la financiación de este campo, y aboga por clarificar el vocabulario."
          ],
          [
            "Recherche et politiques publiques : comment mieux faire circuler les savoirs ?",
            "Mohamed Berrada, Affaires universitaires, 2026 (en francés)",
            "https://www.affairesuniversitaires.ca/actualites/recherche-et-politiques-publiques-comment-mieux-faire-circuler-les-savoirs/",
            "Reseña de un coloquio de la Acfas en el que universidades, centros de estudios superiores, organismos y responsables de las decisiones buscaron cómo acercar la investigación y las decisiones públicas sin sacrificar los tiempos largos de la investigación."
          ],
          [
            "Au-delà de l’acceptabilité sociale, ouvrir le dialogue pour favoriser la participation citoyenne au débat sur l’utilisation des données de santé",
            "Carole Jabet y Cécile Petitgand, Fonds de recherche du Québec, 2022 (en francés)",
            "https://frq.gouv.qc.ca/ouvrir-le-dialogue-pour-favoriser-la-participation-citoyenne/",
            "Surgido de un coloquio de la Acfas, este texto propone dispositivos deliberativos, como grupos de trabajo regionales o foros ciudadanos, para asociar al público a las decisiones sobre el uso de los datos de salud."
          ],
          [
            "Construction et hiérarchisation des données probantes en santé : savoirs scientifiques, expérientiels et contextuels",
            "Marie-Dominique Beaulieu, Revue du CREMIS, 2016 (en francés)",
            "https://cremis.ca/publications/articles-et-medias/construction-et-hierarchisation-des-donnees-probantes-en-sante-savoirs-scientifiques-experientiels-et-contextuels/",
            "Repasa el auge de la medicina basada en la evidencia y la jerarquía de las pruebas, y aboga por integrar, en lugar de oponer, los saberes científicos, experienciales y contextuales en las decisiones de salud."
          ],
          [
            "Knowledge mobilization will help Canada face the next major challenge",
            "Ursula Gobel, Policy Options / Options politiques, 2021 (en inglés)",
            "https://policyoptions.irpp.org/magazines/february-2021/knowledge-mobilization-will-help-canada-face-the-next-major-challenge/",
            "Una vicepresidenta del CRSH extrae de la pandemia la idea de que la síntesis de conocimientos y las redes de investigación interdisciplinarias e intersectoriales son indispensables para orientar las decisiones públicas ante las crisis."
          ],
          [
            "To Support Evidence-Based Policymaking, Bring Researchers and Policymakers Together",
            "D. Max Crowley y J. Taylor Scott, Issues in Science and Technology, 2023 (en inglés)",
            "https://issues.org/evidence-based-policymaking-researchers-policymakers-collaborate-crowley-scott/",
            "Dos investigadores describen un modelo de colaboración directa entre científicos y cargos electos, basado en la confianza, e informan de que mejora la cantidad y la calidad de la evidencia movilizada en la legislación."
          ]
        ]
      ]
    ]
  },
  publications: {
    "surtitre": "04 · Publicaciones",
    "titre": "Publicaciones y trabajos en curso",
    "intro": "Aquí se presentan comunicaciones científicas, memorias defendidas y manuscritos en curso, con sus títulos originales, autores y estados respectivos.",
    "groupes": [
      {
        "titre": "Comunicaciones científicas",
        "items": [
          {
            "date": "Junio de 2026",
            "statut": "Premio al mejor póster · doctorado y posdoctorado",
            "titre": "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
            "detail": "Bernier, É., Sourial, N., Layani, G. · Groupe francophone en soins primaires (GFSP), Montreal · póster"
          },
          {
            "date": "Mayo de 2026",
            "statut": "Póster",
            "titre": "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec",
            "detail": "Bernier, É., Sourial, N., Layani, G. · CAHSPR, Ottawa"
          },
          {
            "date": "Abril de 2026",
            "statut": "Póster y 180 segundos",
            "titre": "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
            "detail": "Bernier, É., Sourial, N., Layani, G. · Red quebequense de investigación sobre el envejecimiento (RQRV), Sherbrooke · póster y divulgación en 180 segundos"
          }
        ]
      },
      {
        "titre": "Memorias defendidas ante un jurado",
        "items": [
          {
            "date": "2025",
            "titre": "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec",
            "detail": "Máster en Derecho · Université Paris Panthéon-Assas · dirección: Benoît Apollis"
          },
          {
            "date": "2024",
            "titre": "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?",
            "detail": "Maestría en dirección de establecimientos de salud · Université de Bretagne Occidentale · dirección: Michelle-Hentic Giliberto"
          },
          {
            "date": "2023",
            "titre": "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement",
            "detail": "Diploma de Estado de educador especializado · Académie de Rennes"
          }
        ]
      }
    ]
  },
  biographie: {
    "surtitre": "05 · Biografía",
    "titre": "De las experiencias humanas a las transformaciones colectivas",
    "intro": [
      "Educador especializado, jurista, emprendedor y doctorando en salud pública, construí mi trayectoria en el encuentro de distintos mundos: el acompañamiento de las personas, la gestión de las organizaciones, el derecho, las políticas públicas y la investigación.",
      "Detrás de esta diversidad hay una misma ambición: **comprender los mecanismos que dan forma a las trayectorias individuales y colectivas, para contribuir a sociedades más justas, solidarias y capaces de reconocer las posibilidades de actuar de cada persona.**",
      "Mi camino, personal y profesional, alimenta una convicción: las realidades humanas no pueden separarse de los sistemas sociales, organizativos y políticos en los que se inscriben.",
      "Sigue una dinámica ascendente: del acompañamiento de las personas hacia la transformación de las organizaciones y de las políticas de salud y de servicios sociales, con una orientación clara hacia el apoyo a la decisión pública."
    ],
    "citation": "Las realidades humanas no pueden separarse de los sistemas sociales, organizativos y políticos en los que se inscriben.",
    "chapitres": [
      [
        "Construirse fuera de las trayectorias convencionales",
        [
          "Mi trayectoria comienza en Francia, en un medio popular, marcado en particular por una experiencia en la protección de la infancia y por el abandono de la escuela a los dieciséis años.",
          "Lejos de un recorrido académico convencional, fui construyendo mi trayectoria a través del trabajo, la exploración de distintos entornos y la vuelta a los estudios.",
          "Estas experiencias, al igual que mi neuroatipia, alimentaron mi independencia de pensamiento, mi capacidad de adaptación y mi interés por los mecanismos de reproducción social, de emancipación y de solidaridad. Hoy forman parte de mi mirada sobre las instituciones y sobre la diversidad de las experiencias humanas."
        ]
      ],
      [
        "La creación, el encuentro y la ética del cuidado",
        [
          "Mi interés por la música me llevó a cursar una licenciatura en musicología, en paralelo a mis primeras experiencias en la animación sociocultural y, después, a la responsabilidad de estancias adaptadas para personas con discapacidad.",
          "Más allá de sus diferencias, estos mundos me permitieron explorar las relaciones humanas en varias dimensiones: la expresión individual, la vida colectiva, el acompañamiento y la responsabilidad hacia los demás.",
          "A lo largo de once años de compromiso junto a la vulnerabilidad humana, estas experiencias fueron dando un lugar central a la ética del *cuidado*, al reconocimiento de las capacidades individuales y a la importancia de un acompañamiento que favorezca la autonomía y no la dependencia. También me mostraron la fuerza de la solidaridad."
        ]
      ],
      [
        "Del acompañamiento a la autodeterminación",
        [
          "Tras varios años de compromiso en el terreno, quise dar una nueva orientación a mi actividad profesional, guiado por una reflexión sobre la utilidad social y sobre el lugar que deseaba ocupar en la sociedad.",
          "Así retomé los estudios en educación especializada para profundizar en los fundamentos teóricos, éticos y metodológicos del acompañamiento en los sectores social y sociosanitario, centrando mi práctica en la autodeterminación y en el «hacer con» las personas.",
          "Mi memoria de práctica profesional, dedicada a la influencia de las prácticas educativas en la autodeterminación, marcó un punto de inflexión en mis preguntas: **¿cómo favorecer la libertad de elección de las personas cuando las condiciones de su acompañamiento dependen también del funcionamiento de las instituciones?**"
        ]
      ],
      [
        "Comprender las organizaciones para transformar las prácticas",
        [
          "Esta pregunta me llevó a ampliar mi reflexión a las propias organizaciones.",
          "Cursé una formación en dirección y gestión de establecimientos sanitarios y sociosanitarios, así como un diploma universitario en emprendimiento en el IAE de Brest, obtenido en 2024.",
          "Allí profundicé en los retos de la gestión, la financiación, la coordinación, los recursos humanos y la conducción del cambio, y comprobé que las dificultades de las estructuras, desde la financiación hasta el trabajo en red y la contratación, dependían en gran medida de las políticas públicas de salud.",
          "Sobre todo, busqué comprender las condiciones que permiten a los profesionales traducir sus intenciones en prácticas efectivas, y a las organizaciones conciliar sus limitaciones con las necesidades de las personas."
        ]
      ],
      [
        "Del funcionamiento de las instituciones a la gobernanza de los sistemas de salud",
        [
          "El estudio de las organizaciones me llevó a explorar los mecanismos que orientan sus decisiones: los marcos jurídicos, las políticas públicas, la planificación, los mecanismos de financiación y las modalidades de gobernanza.",
          "Continué esta reflexión en la Université Paris-Panthéon-Assas, en derecho público, sanitario y social, para superar los problemas de gestión y adoptar un enfoque multinivel del sistema de salud y de los instrumentos jurídicos de la solidaridad nacional, y después como encargado de proyectos en la Agencia nacional francesa de apoyo al desempeño (ANAP).",
          "Esta experiencia me permitió trabajar en la articulación entre las orientaciones nacionales y las realidades operativas, traduciendo esas orientaciones en dispositivos concretos, en contacto con los retos de gestores, profesionales y usuarios del sistema de salud.",
          "Reforzó mi interés por las dificultades de implementación de las políticas públicas, sobre todo cuando las respuestas exigen superar las fronteras entre organizaciones y sectores. Consolidada por una memoria de investigación, esta inmersión reveló las dificultades de implementación de los modelos de atención y servicios integrados, y la necesidad de un enfoque intersectorial e interdisciplinario frente a las prácticas en silos. Entonces me dirigí a varios investigadores quebequenses, presentándoles mis constataciones y un proyecto para contrastar los sistemas de salud, en busca de respuestas a las dificultades de implementación de la permanencia en el domicilio."
        ]
      ],
      [
        "Producir conocimientos para esclarecer la acción colectiva",
        [
          "Hoy, mi doctorado en salud pública en la Université de Montréal, bajo la dirección de las Dras. N. Sourial y G. Layani, prolonga este camino.",
          "Mis trabajos abordan la organización de los sistemas de salud y de servicios sociales, las necesidades sociales de las poblaciones, las colaboraciones intersectoriales y las condiciones de implementación de respuestas integradas, en particular en el apoyo a domicilio.",
          "Mi enfoque es decididamente interdisciplinario y pragmático. Busca acercar las experiencias vividas, los conocimientos científicos y las realidades de la toma de decisiones para comprender mejor los fenómenos estudiados y contribuir a transformar las prácticas y las políticas públicas.",
          "Presto una atención particular a las personas que pierden autonomía y a quienes están lejos de los servicios, a la investigación participativa que reconoce a los pacientes como productores de saberes, a la transferencia de conocimientos y a su movilización por las personas, los profesionales, las organizaciones y quienes toman las decisiones.",
          "Esta voluntad de crear, experimentar y proponer se prolonga también en el emprendimiento, en particular con el desarrollo de **OWNNIGHT**, un proyecto en creación."
        ]
      ]
    ],
    "vision": {
      "titre": "Una visión que une experiencias, saberes y acción",
      "paragraphes": [
        "Creo que los saberes académicos, profesionales y experienciales ganan al confrontarse en lugar de jerarquizarse.",
        "Mi trayectoria me ha permitido descubrir distintos estratos de la sociedad y del sistema de salud, ocupar en ellos posiciones diversas y observar sus interacciones. Esta pluralidad de perspectivas es hoy uno de los recursos de mi trabajo científico.",
        "**Para mí, la investigación es un instrumento de comprensión, pero también de emancipación humana, de justicia social y de apoyo a la decisión colectiva.** Su valor reside tanto en el rigor de los conocimientos producidos como en su capacidad de alimentar el debate, esclarecer las decisiones y sostener su puesta en práctica.",
        "Se inscribe en los Objetivos de Desarrollo Sostenible de las Naciones Unidas: mejorar el bienestar de las personas mayores, reducir las desigualdades ante la permanencia en el domicilio y consolidar instituciones inclusivas y responsables. A largo plazo, aspiro a ser un investigador autónomo, reconocido por su compromiso de articular datos probatorios, diálogo entre las partes interesadas y divulgación al gran público.",
        "Curiosidad intelectual, resiliencia, autonomía, sentido crítico, coconstrucción y audacia para emprender son valores que atraviesan mi camino.",
        "Deseo continuar esta exploración en la interfaz entre disciplinas y entornos, convencido de que las respuestas a los desafíos actuales de salud pública exigen hacer dialogar a las personas, los saberes y las instituciones."
      ]
    },
    "conclusion": "Ad astra per aspera: a través de las dificultades hasta las estrellas."
  },
  parcours: {
    "surtitre": "06 · La trayectoria",
    "titre": "Formación y experiencia",
    "sousTitre": "Del terreno a las políticas de salud",
    "intro": "De la educación especializada al doctorado: los títulos, los puestos y las formaciones que marcan la trayectoria.",
    "types": {
      "formation": "Formación",
      "experience": "Experiencia",
      "entreprise": "Emprendimiento"
    },
    "etapes": [
      {
        "date": "En curso",
        "type": "entreprise",
        "titre": "Creación de OWNNIGHT · emprendedor",
        "detail": "Aplicación Android de bienestar y educación sobre el sueño: plan personalizado, lecciones y sesiones guiadas."
      },
      {
        "date": "Desde 2025",
        "type": "formation",
        "titre": "Doctorado en salud pública · ESPUM (Canadá)",
        "detail": "École de santé publique de l’Université de Montréal (ESPUM), Canadá. Opción de sistemas, organizaciones y políticas sanitarias (SOPS); investigador en prácticas en el Centre de recherche du CHUM (CRCHUM), Canadá.",
        "discret": "Promedio acumulado: 4,1"
      },
      {
        "date": "Otoño de 2026",
        "type": "experience",
        "titre": "Auxiliar docente · SPU 7001, ASA 6754 y ASA 6765",
        "detail": "Université de Montréal."
      },
      {
        "date": "Invierno de 2026",
        "type": "experience",
        "titre": "Auxiliar docente · ASA 6754",
        "detail": "Sistema de salud y salud de las poblaciones, Université de Montréal: acompañamiento de estudiantes, corrección de exámenes escritos y orales."
      },
      {
        "date": "2025",
        "type": "formation",
        "titre": "Máster en derecho público especializado en derecho de la salud y derecho social",
        "detail": "Derecho público, derecho social y derecho de la salud · Université Paris Panthéon-Assas, mención especial del jurado."
      },
      {
        "date": "2024–2025",
        "type": "experience",
        "titre": "Encargado de misión médico-social · ANAP (Francia)",
        "detail": "Agence nationale d’appui à la performance (ANAP), París (Francia). Copilotaje de la red de expertos, seminarios web, análisis de datos y comunidades de práctica."
      },
      {
        "date": "2024",
        "type": "formation",
        "titre": "Maestría en dirección de establecimientos de salud · UBO (Francia)",
        "detail": "Université de Bretagne Occidentale (UBO), Francia, mención especial del jurado."
      },
      {
        "date": "2024",
        "type": "experience",
        "titre": "Prácticas de dirección en EHPAD · Fondation Ildys",
        "detail": "Fondation Ildys, Landerneau (Francia). Prácticas con el equipo directivo."
      },
      {
        "date": "2024",
        "type": "formation",
        "titre": "Diploma universitario en emprendimiento y gestión",
        "detail": "IAE de Brest (Institut d’administration des entreprises), Francia, mención especial del jurado."
      },
      {
        "date": "2023",
        "type": "formation",
        "titre": "Diploma de Estado de educador especializado",
        "detail": "Académie de Rennes."
      },
      {
        "date": "2020–2023",
        "type": "experience",
        "titre": "Educador especializado",
        "detail": "Residencia, Adapei 35, Saint-Malo: evaluar las necesidades, coconstruir los proyectos individualizados, coordinar un equipo pluridisciplinario."
      },
      {
        "date": "2016–2024",
        "type": "experience",
        "titre": "Director de estancias para adultos con discapacidad",
        "detail": "Vacaciones adaptadas y estancias de respiro para personas con discapacidad, Brest (Francia): proyectos pedagógicos, acompañamiento socioeducativo, dirección de equipos, presupuestos y logística."
      }
    ],
    "continue": {
      "titre": "Formación continua · 2026",
      "items": [
        "Conducta responsable en la investigación · CRCHUM",
        "Práctica de auxiliar de investigación · Université de Montréal",
        "MobilizeU, movilización de conocimientos · Research Impact Canada y Universidad York"
      ]
    },
    "note": "Títulos franceses evaluados por el MIFI (Quebec) y WES Canada."
  },
  engagements: {
    "surtitre": "07 · Compromisos",
    "titre": "Representar, contribuir, comprometerse",
    "intro": "Una presencia en la vida estudiantil y científica, en continuidad con la trayectoria.",
    "groupes": [
      {
        "titre": "Representación estudiantil",
        "items": [
          {
            "date": "Desde 2026 · En curso",
            "titre": "Coordinador del doctorado en salud pública · AÉÉSPUM",
            "detail": "Electo."
          },
          {
            "date": "En curso",
            "titre": "Coordinación de la mentoría solidaria · programa de doctorado en salud pública",
            "detail": "ESPUM, Université de Montréal."
          },
          {
            "date": "En curso",
            "titre": "Representante estudiantil en el comité del programa de doctorado en salud pública",
            "detail": "ESPUM, Université de Montréal."
          },
          {
            "date": "Desde 2026 · En curso",
            "titre": "Representante estudiantil del doctorado · DGEPS",
            "detail": "Departamento de Gestión, Evaluación y Política de Salud, ESPUM."
          },
          {
            "date": "Invierno de 2026",
            "titre": "Embajador de la Université de Montréal"
          },
          {
            "date": "2022–2024",
            "titre": "Representante electo en el consejo de administración del CROUS",
            "detail": "Francia."
          },
          {
            "date": "2021",
            "titre": "Presidente de la oficina regional de estudiantes de trabajo social de Askoria",
            "detail": "Francia."
          }
        ]
      },
      {
        "titre": "Comunidad científica",
        "items": [
          {
            "date": "En curso",
            "titre": "Comité científico estudiantil del congreso de la AÉÉSPUM",
            "detail": "Miembro."
          },
          {
            "date": "Junio de 2026",
            "titre": "Comité científico de la jornada de jóvenes investigadores del GFSP",
            "detail": "Miembro estudiante."
          }
        ]
      },
      {
        "titre": "Becas y distinciones",
        "items": [
          {
            "date": "2026",
            "titre": "Premio a la mejor presentación en póster, doctorado y posdoctorado",
            "detail": "Jornada de jóvenes investigadores, Groupe francophone en soins primaires."
          },
          {
            "date": "2025",
            "titre": "Beca de doctorado del Fonds de recherche du Québec (B2)",
            "detail": "Beca de excelencia, tercer puesto.",
            "lien": "https://doi.org/10.69777/2009461"
          },
          {
            "date": "2025",
            "titre": "Beca de captación internacional",
            "detail": "Estudios de posgrado y posdoctorado, Université de Montréal."
          },
          {
            "date": "2023–2025",
            "titre": "Tres menciones especiales del jurado",
            "detail": "Excelencia académica."
          }
        ]
      },
      {
        "titre": "Compromiso ciudadano",
        "items": [
          {
            "date": "2023",
            "titre": "Bombero voluntario",
            "detail": "Centro de bomberos y rescate de Dinard, Francia."
          },
          {
            "date": "2013",
            "titre": "Voluntariado y servicio cívico",
            "detail": "Association de la fondation étudiante pour la ville (AFEV), Francia: coordinación de los estudiantes voluntarios y acompañamiento de una joven en su trayectoria escolar y cultural."
          }
        ]
      },
      {
        "titre": "Deportes y ocio",
        "items": [
          {
            "date": "Deporte",
            "titre": "Práctica del maratón",
            "detail": "Maratón de París 2025 y 2026, maratón de Montreal 2026."
          },
          {
            "date": "Música",
            "titre": "Piano, composición musical y guitarra"
          },
          {
            "date": "Deporte",
            "titre": "Hockey sobre hielo"
          },
          {
            "date": "Programación",
            "titre": "Desarrollo de herramientas digitales"
          },
          {
            "date": "Cultura",
            "titre": "Reflexión y divulgación científica",
            "detail": "Ciencias de la vida y de la Tierra, filosofía, geopolítica, ciencia política, física, astronomía."
          }
        ]
      }
    ],
    "affiliations": {
      "titre": "Miembro estudiante",
      "items": [
        "Cátedra de investigación GSK en gestión óptima de enfermedades crónicas",
        "Groupe francophone en soins primaires (GFSP)",
        "Red quebequense de investigación sobre el envejecimiento (RQRV)",
        "Canadian Association for Health Services and Policy Research (CAHSPR)",
        "Centre de recherche en santé publique (CReSP)",
        "Centre de recherche du CISSS de Chaudière-Appalaches",
        "Centre interuniversitaire de recherche en analyse des organisations (CIRANO)"
      ]
    }
  },
  contact: {
    surtitre: "Contacto",
    titre: "Compartamos ideas y perspectivas",
    intro: "¿Tiene alguna idea, lectura, experiencia o proyecto que le gustaría compartir? Será un placer conversar.",
    courriel: COURRIEL,
    ecrire: "Escribir un correo",
    liens: [
      ["CV académico", "PDF, en francés", "docs/cv-academique.pdf"],
      ["CV profesional", "PDF, en francés", "docs/cv-professionnel.pdf"],
      ["ORCID", "0009-0001-4236-4932", ORCID],
      ["Póster del proyecto de tesis", "Versión accesible", AFFICHE + "es/"],
    ],
    adresse: "Escuela de Salud Pública de la Université de Montréal · 7101, avenue du Parc, Montreal (Quebec)",
  },
  pied: "© 2026 Éric Bernier",
  credits: "Imágenes: retrato de Éric Bernier, fotografías de Unsplash e ilustraciones digitales de escenas ficticias, no documentales. Vista de Montreal desde el monte Royal: Wilfredor, «Montreal Skyline from Mont Royal golden hour» (CC0), y Calvin411, «Panorama Montreal Skyline 2017» (CC BY-SA 4.0, modificada), Wikimedia Commons. Lectura en voz alta: Kyutai TTS (CC BY 4.0), voces de referencia CML-TTS (Oliveira et al., 2023) y Alba MacKenna (CC BY 4.0).",
  introuvable: { titre: "Página no encontrada", texte: "Esta página no existe o ha sido trasladada.", retour: "Volver a la página de inicio" },
};

fr.biographie = require("./biographie-frq");

module.exports = { fr, en, es, LANGUES, AFFICHE };
