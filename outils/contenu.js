"use strict";

const ORCID = "https://orcid.org/0009-0001-4236-4932";
const LINKEDIN = "https://www.linkedin.com/in/eric-b-5aa52b250";
const AFFICHE = "https://erjb-web.github.io/affiche-releve/";
const COURRIEL = "eric.bernier.1@umontreal.ca";
const FRQ_DOI = "https://doi.org/10.69777/2009461";
const ANAP_SAD = "https://anap.fr/s/article/reforme-services-autonomie-a-domicile";
const ANAP_CRT = "https://www.anap.fr/s/article/centre-ressources-territorial-crt-ambition-nouvelle";
const CRCHUM_SOURIAL = "https://www.chumontreal.qc.ca/crchum/chercheurs/nadia-sourial";
const CRCHUM_LAYANI = "https://www.chumontreal.qc.ca/crchum/chercheurs/geraldine-layani";

const LANGUES = [
  { code: "fr", libelle: "FR", nom: "Français", dossier: "" },
  { code: "en", libelle: "EN", nom: "English", dossier: "en/" },
  { code: "es", libelle: "ES", nom: "Español", dossier: "es/" },
];

const TITRES_ORIGINAUX = {
  gfsp: "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative",
  cahspr: "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec",
  epistemic: "Epistemic return in public health governance: The road back from health to science",
  hospit: "Potentially avoidable hospitalisations and primary care: the role of patient experience across Commonwealth countries",
  pl2: "Prise de parole des médecins dans l’espace public québécois lors des débats entourant le projet de loi n° 2 : une analyse qualitative du discours critique",
  droit: "Vieillir chez soi à l’épreuve du droit : l’effectivité du choix du lieu de vie en droit français et en droit québécois",
  memoireDroit: "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec",
  memoireGestion: "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?",
  memoireEduc: "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement",
};
const AUTEURS = {
  trio: "Bernier, É., Sourial, N., Layani, G.",
  hospit: "Bernier, É., Algoët, A., Sourial, N., Layani, G., Vedel, I., Calafiore, M.",
  pl2: "Bernier, É., Aïssi, F., Diene Faye, C., Boukari Abdo, S.",
};

/* ---------------------------------------------------------------- Français */
const fr = {
  lang: "fr",
  locale: "fr_CA",
  chemin: "",
  meta: {
    titre: "Éric Bernier — Doctorant en santé publique, ESPUM",
    description:
      "Éric Bernier, doctorant en santé publique (systèmes, organisations et politiques de santé) à l’ESPUM, juriste et éducateur spécialisé. Recherche sur la réponse intersectorielle aux besoins sociaux complexes en soins primaires.",
  },
  ui: {
    evitement: "Aller au contenu",
    sousTitre: "Santé publique · Gouvernance · Gestion · Droit · Intervention sociale et intersectorialité",
    navigation: "Navigation principale",
    langue: "Langue",
    entrer: "Entrer",
    cv: "CV",
    hall: "Le hall",
    suivante: "Porte suivante",
    contact: "Me contacter",
    haut: "Haut de page",
  },
  nav: [
    ["recherche", "Recherche"],
    ["approche", "Approche"],
    ["implantation", "Implantation"],
    ["publications", "Publications"],
    ["biographie", "Biographie"],
    ["parcours", "Parcours"],
    ["engagements", "Engagements"],
    ["contact", "Contact"],
  ],
  accueil: {
    surtitre: "Doctorant en santé publique · ESPUM",
    roles: "Éducateur spécialisé · Juriste · Doctorant en santé publique",
    chapeau:
      "Une même attention aux personnes, à leurs droits et aux services qui les accompagnent. Mon parcours croise la pratique éducative, le droit public et la recherche en systèmes, organisations et politiques de santé.",
    encadrement:
      "Thèse codirigée par les Dres Nadia Sourial, Ph. D., et Géraldine Layani, M.D. · Chaire de recherche GSK en gestion optimale des maladies chroniques · CRCHUM · Boursier FRQ (B2)",
    visite: "Commencer la visite",
    explorer: "Explorer librement",
    portrait: "Portrait d’Éric Bernier",
  },
  hall: {
    titre: "Le hall",
    compte: "7 portes",
    consigne: "Cliquez sur une porte pour entrer",
    portes: {
      recherche: ["La recherche", "Thèse et travaux en cours"],
      approche: ["L’approche", "Posture, méthodes, axes, valeurs"],
      implantation: ["Implantation", "Transfert de connaissances et implantation"],
      publications: ["Publications", "Communications, mémoires, outils"],
      biographie: ["Biographie", "Une histoire, plusieurs vies"],
      parcours: ["Le parcours", "Formations et expériences"],
      engagements: ["Engagements", "Représentation, enseignement, distinctions"],
    },
  },
  recherche: {
    surtitre: "01 · La recherche",
    etiquette: "Thèse de doctorat en cours · sujet provisoire",
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
        { nom: "Dre Nadia Sourial", grade: "Ph. D.", lignes: ["Professeure adjointe, Département de gestion, d’évaluation et de politique de santé, École de santé publique, Université de Montréal", "Chercheuse régulière au CRCHUM, Carrefour de l’innovation"], chaire: "Cotitulaire de la Chaire de recherche GSK en gestion optimale des maladies chroniques", lien: CRCHUM_SOURIAL },
        { nom: "Dre Géraldine Layani", grade: "M.D., M. Sc.", lignes: ["Médecin de famille, GMF-U Notre-Dame, Montréal", "Professeure adjointe de clinique, Département de médecine de famille et de médecine d’urgence, Université de Montréal", "Chercheuse régulière au CRCHUM, Carrefour de l’innovation"], chaire: "Cotitulaire de la Chaire de recherche GSK en gestion optimale des maladies chroniques", lien: CRCHUM_LAYANI },
      ],
    },
    affiche: ["Voir l’affiche du projet", "Version accessible : français, anglais, daltonisme, écoute", AFFICHE],
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
      titre: "Travaux en cours",
      intro: "Articles et manuscrits en cours d’écriture, en parallèle de la thèse.",
      items: [
        {
          domaine: "Épistémologie et transfert de connaissances",
          statut: "En travaux",
          titre: TITRES_ORIGINAUX.epistemic,
          auteurs: "Bernier, É.",
          resume:
            "L’impact de la recherche est d’ordinaire pensé dans un seul sens, de la connaissance vers les politiques et les pratiques. L’article propose une santé publique conçue comme science réflexive de la gouvernance : il précise à quelles conditions les conséquences observées sur le terrain et les savoirs des populations concernées peuvent exiger que l’on réexamine les catégories, les indicateurs et les règles en amont. Le concept se traduit en un audit documentaire, mis à l’essai sur quatre chaînes institutionnelles.",
          etiquettes: ["Retour épistémique", "Gouvernance réflexive", "Impact de la recherche"],
        },
        { domaine: "Systèmes de santé et soins primaires", statut: "Manuscrit en préparation", titre: TITRES_ORIGINAUX.hospit, auteurs: AUTEURS.hospit },
        { domaine: "Gouvernance et espace public", statut: "Manuscrit en préparation", titre: TITRES_ORIGINAUX.pl2, auteurs: AUTEURS.pl2 },
        { domaine: "Droit de la santé", statut: "Manuscrit en préparation", titre: TITRES_ORIGINAUX.droit, auteurs: "Bernier, É. · article de doctrine" },
      ],
    },
  },
  approche: {
    surtitre: "02 · L’approche",
    titre: "Une posture pragmatique, des méthodes mixtes",
    intro:
      "De la question à l’observation : chaque question appelle ses données, sa méthode d’analyse et son interprétation. Je choisis les méthodes selon ce qu’il faut éclairer, en croisant les disciplines.",
    piliers: [
      ["Posture pragmatique", "Une posture qui articule une lecture positiviste (mesurer, estimer, tester des hypothèses) et une lecture constructiviste (comprendre le sens que les acteurs donnent à leurs pratiques). La question décide de la méthode."],
      ["Méthodes mixtes", "Analyses quantitatives et qualitatives intégrées : analyse de réseaux, régressions, analyse thématique, analyse documentaire et cartographie, réunies dans des tableaux d’intégration."],
      ["Pluridisciplinarité", "Santé publique, droit, gestion, sciences politiques et intervention sociale : des regards qui se répondent pour analyser un même système."],
    ],
    outils: {
      titre: "Boîte à outils",
      groupes: [
        ["Analyse de données", ["Positron (R)", "Python", "NVivo", "QGIS", "Excel"]],
        ["Collaboration et animation", ["Miro", "Klaxoon", "Canva"]],
        ["Bureautique et IA", ["Office 365", "Intelligence artificielle"]],
      ],
    },
    expertises: {
      titre: "Expertises",
      items: [
        ["Méthodologie et évaluation de projet", "Concevoir, piloter et évaluer des projets : devis, indicateurs, outils d’aide à la décision et conduite du changement."],
        ["Handicap", "Accompagnement éducatif, autodétermination et adaptation des services, du foyer d’hébergement aux séjours adaptés."],
        ["Autisme", "Accompagnement éducatif des personnes autistes et adaptation des services à leurs besoins."],
        ["Accompagnement des personnes aînées", "Vieillissement, perte d’autonomie, maintien à domicile et handicap vieillissant, de la pratique à la recherche."],
      ],
    },
    axes: {
      titre: "Axes de travaux",
      principaux: ["Gouvernance et évaluation des politiques de santé", "Approche intersectorielle en première ligne", "Vieillissement, perte d’autonomie et politiques du maintien à domicile"],
      secondairesTitre: "Axes secondaires",
      secondaires: ["Planification juridique, analyse doctrinale et droit de la santé", "Performance, conduite du changement et pilotage des organisations", "Analyse comparée des systèmes de santé"],
    },
    valeurs: {
      titre: "Mes valeurs",
      devise: ["Devise", "Per aspera ad astra", "Par des sentiers ardus jusqu’aux étoiles"],
      items: [
        ["Résilience", "Faire des épreuves traversées une ressource pour avancer."],
        ["Persévérance", "Progresser pas à pas, malgré les obstacles."],
        ["Autodétermination", "Respecter le choix des personnes sur leur propre vie."],
        ["Coconstruction", "Écouter, puis chercher et décider avec les milieux, pas seulement pour eux."],
        ["Utilité sociale", "Que les connaissances servent concrètement aux personnes et aux services."],
        ["Audace d’innover", "Oser proposer, entreprendre et créer de nouvelles réponses."],
      ],
    },
  },
  implantation: {
    surtitre: "03 · Implantation",
    titre: "Transfert de connaissances et implantation",
    intro: "Faire circuler les savoirs entre les personnes, les milieux de pratique et la recherche, puis examiner ce qu’ils permettent réellement de changer.",
    transfert: {
      titre: "Transfert de connaissances et implantation",
      detail: "Cinq temps",
      etapes: [
        ["Écouter", "Construire la question avec les milieux", "Repérer les besoins et les décisions à éclairer. Préciser qui participe, à quel moment et avec quelle influence.", ["Besoins", "Participation"]],
        ["Faire circuler", "Contextualiser les savoirs", "Mettre en dialogue la recherche et les savoirs d’expérience. Adapter le format, le langage et le contenu aux usages visés.", ["Savoirs d’expérience", "Formats adaptés"]],
        ["Coconstruire", "Discuter les options et les choix", "Consulter recueille des avis ; coconstruire, c’est élaborer ensemble ; délibérer, c’est examiner des arguments et des arbitrages. Documenter l’influence réelle des contributions.", ["Coconstruction", "Délibération"]],
        ["Implanter", "Accompagner la mise en œuvre", "Examiner le contexte, les ressources et les obstacles. Préciser les acteurs, les adaptations et les stratégies d’accompagnement, avec des cadres comme le CFIR.", ["Implantation", "CFIR"]],
        ["Évaluer", "Distinguer produire, utiliser et changer", "Un outil diffusé est une production. Son adoption est un résultat d’implantation. Les changements pour les services et les personnes sont d’autres résultats à documenter.", ["Évaluation", "Impact"]],
      ],
      note: "Formé à la mobilisation des connaissances (MobilizeU, Research Impact Canada et Université York, 2026).",
    },
  },
  publications: {
    surtitre: "04 · Publications",
    titre: "Communications, mémoires et outils",
    intro: "Chaque travail garde son titre original, ses auteurs et son statut. Les manuscrits en cours sont présentés dans la salle La recherche.",
    groupes: [
      {
        titre: "Communications scientifiques",
        items: [
          { date: "Juin 2026", statut: "Prix de la meilleure affiche · 3e cycle et postdoctorat", titre: TITRES_ORIGINAUX.gfsp, detail: `${AUTEURS.trio} · Groupe francophone en soins primaires (GFSP), Montréal · présentation par affiche` },
          { date: "Mai 2026", statut: "Affiche", titre: TITRES_ORIGINAUX.cahspr, detail: `${AUTEURS.trio} · CAHSPR, Ottawa` },
          { date: "Avril 2026", statut: "Affiche et 180 secondes", titre: TITRES_ORIGINAUX.gfsp, detail: `${AUTEURS.trio} · Réseau québécois de recherche sur le vieillissement (RQRV), Sherbrooke · affiche et vulgarisation en 180 secondes` },
        ],
      },
      {
        titre: "Mémoires soutenus devant jury",
        items: [
          { date: "2025", titre: TITRES_ORIGINAUX.memoireDroit, detail: "Master en droit · Université Paris Panthéon-Assas · direction : Benoît Apollis" },
          { date: "2024", titre: TITRES_ORIGINAUX.memoireGestion, detail: "Maîtrise en direction d’établissements · Université de Bretagne Occidentale · direction : Michelle-Hentic Giliberto" },
          { date: "2023", titre: TITRES_ORIGINAUX.memoireEduc, detail: "Diplôme d’État d’éducateur spécialisé · Académie de Rennes" },
        ],
      },
      {
        titre: "Outils professionnels",
        items: [
          { date: "2024–2025", titre: "Réforme des services autonomie à domicile : outils d’aide à la décision", detail: "Agence nationale d’appui à la performance (ANAP) · plusieurs milliers de téléchargements", lien: ANAP_SAD },
          { date: "2024–2025", titre: "Centres de ressources territoriaux : dix outils d’aide au pilotage", detail: "ANAP · plusieurs milliers de téléchargements", lien: ANAP_CRT },
        ],
      },
    ],
  },
  biographie: {
    surtitre: "05 · Biographie",
    titre: "Chaque étape est née des limites de la précédente",
    intro: "Éducateur spécialisé, juriste et doctorant en santé publique : mon parcours n’a rien de linéaire, et c’est précisément ce qui lui donne sa cohérence.",
    chapitres: [
      ["Partir de l’expérience", "J’ai connu l’aide sociale à l’enfance, en France, puis j’ai quitté l’école à 16 ans. Ma neuroatypie m’a appris tôt à apprendre autrement, à chercher mes propres chemins et à ne pas renoncer. De ce point de départ, je garde une conviction qui guide encore mon travail : une politique publique se juge à ce qu’elle change concrètement dans la vie des personnes."],
      ["La musique, puis le terrain", "Les études sont revenues par la musique, avec une licence en musicologie : l’écoute, la rigueur et la persévérance du travail patient. En parallèle, l’animation puis la responsabilité de séjours adaptés pour des personnes en situation de handicap m’ont appris à organiser, à encadrer des équipes et à partir des besoins de chaque personne."],
      ["Le choix de l’utilité sociale", "Une remise en question est venue ensuite : quel est mon rapport à la société, et à quoi suis-je utile ? J’ai repris mes études pour devenir éducateur spécialisé et entrer dans le champ de la santé par la pratique professionnelle."],
      ["Des limites de la pratique à la gestion", "Mon mémoire d’éducateur portait sur l’influence des pratiques éducatives sur l’autodétermination. Il m’a montré une limite : sans organisation adaptée, la meilleure pratique bute sur le cadre. Je suis donc allé voir du côté de la gestion, avec une maîtrise en direction d’établissements de santé et un diplôme universitaire en entrepreneuriat."],
      ["Du droit à la gouvernance", "La gestion a révélé à son tour ses limites : la planification, le droit et le financement se décident souvent plus haut. J’ai poursuivi à l’Université Paris Panthéon-Assas, en droit public, droit social et droit de la santé, puis à l’Agence nationale d’appui à la performance, au plus près de l’organisation centrale, de la planification, des sciences politiques et de la gouvernance."],
      ["Chercher pour proposer", "Le doctorat en santé publique, à Montréal, réunit aujourd’hui ces regards : le terrain, la gestion, le droit et la gouvernance. Je n’y cherche pas seulement à comprendre ; je veux innover et proposer des réponses mieux organisées pour les personnes dont les besoins traversent plusieurs secteurs. Le même élan me pousse à entreprendre, avec la création d’OWNNIGHT."],
    ],
    conclusion: "Per aspera ad astra : par des sentiers ardus jusqu’aux étoiles.",
  },
  parcours: {
    surtitre: "06 · Le parcours",
    titre: "Formations et expériences",
    sousTitre: "Du terrain aux politiques de santé",
    intro: "De l’éducation spécialisée au doctorat : les diplômes, les postes et les formations qui jalonnent le parcours.",
    types: { formation: "Formation", experience: "Expérience", entreprise: "Entrepreneuriat" },
    etapes: [
      { date: "En cours", type: "entreprise", titre: "Création d’OWNNIGHT · entrepreneur", detail: "Application Android de bien-être et d’éducation au sommeil : plan individualisé, leçons et séances guidées. Les données restent sur le téléphone, sans compte." },
      { date: "Depuis 2025", type: "formation", titre: "Doctorat en santé publique · ESPUM", detail: "Option systèmes, organisations et politiques de santé (SOPS), 2e année. Stagiaire de recherche au CRCHUM : politiques de soins primaires, intersectorialité et intégration des soins et services.", discret: "Moyenne cumulative : 4,1" },
      { date: "2025", type: "formation", titre: "Master en droit (LL.M.)", detail: "Droit public, droit social et droit de la santé · Université Paris Panthéon-Assas, mention spéciale du jury." },
      { date: "2024–2025", type: "experience", titre: "Chargé de mission · Agence nationale d’appui à la performance", detail: "Paris. Accompagner la transformation de l’offre en santé et services sociaux, piloter des projets, produire des outils d’aide à la décision, animer un réseau d’experts et des communautés de pratique." },
      { date: "2024", type: "formation", titre: "Maîtrise en direction d’établissements de santé", detail: "Université de Bretagne Occidentale, mention spéciale du jury." },
      { date: "2023", type: "formation", titre: "Diplôme universitaire en entrepreneuriat", detail: "Institut d’administration des entreprises (IAE) de Brest, mention spéciale du jury." },
      { date: "2023", type: "formation", titre: "Diplôme d’État d’éducateur spécialisé", detail: "Académie de Rennes." },
      { date: "2020–2023", type: "experience", titre: "Éducateur spécialisé", detail: "Foyer d’hébergement, Adapei 35, Saint-Malo : évaluer les besoins, coconstruire les projets individualisés, coordonner une équipe pluridisciplinaire." },
      { date: "2016–2024", type: "experience", titre: "Responsable de séjours de répit", detail: "Séjours adaptés pour personnes en situation de handicap, Brest : encadrement, projets de service, gestion des équipes, du budget et de la logistique." },
    ],
    continue: {
      titre: "Formation continue · 2026",
      items: [
        "Conduite responsable de la recherche · CRCHUM",
        "Pratique d’auxiliaire de recherche · Université de Montréal",
        "MobilizeU, mobilisation des connaissances · Research Impact Canada et Université York",
      ],
    },
    note: "Diplômes français évalués par le MIFI (Québec) et WES Canada.",
  },
  engagements: {
    surtitre: "07 · Engagements",
    titre: "Représenter, enseigner, contribuer",
    intro: "Une présence dans la vie étudiante et scientifique, en continuité avec le parcours.",
    groupes: [
      {
        titre: "Représentation étudiante",
        items: [
          { date: "2026", titre: "Coordinateur au doctorat en santé publique · AÉÉSPUM", detail: "Élu." },
          { date: "2026", titre: "Représentant étudiant du doctorat · DGEPS", detail: "Département de gestion, d’évaluation et de politique de santé, ESPUM." },
          { date: "Hiver 2026", titre: "Ambassadeur de l’Université de Montréal" },
          { date: "2022–2024", titre: "Représentant élu au conseil d’administration du CROUS", detail: "France." },
          { date: "2021", titre: "Président du bureau régional des étudiants en travail social d’Askoria", detail: "France." },
        ],
      },
      {
        titre: "Expérience en enseignement",
        items: [
          { date: "Automne 2026", statut: "En cours", titre: "Auxiliaire d’enseignement · SPU 7001, ASA 6754 et ASA 6765", detail: "Université de Montréal." },
          { date: "Hiver 2026", titre: "Auxiliaire d’enseignement · ASA 6754", detail: "Système de santé et santé des populations, Université de Montréal : accompagnement des étudiants, correction des examens écrits et oraux." },
        ],
      },
      {
        titre: "Communauté scientifique",
        items: [
          { date: "Juin 2026", titre: "Comité scientifique de la journée de la relève du GFSP", detail: "Membre étudiant." },
        ],
      },
      {
        titre: "Bourses et distinctions",
        items: [
          { date: "2026", titre: "Prix de la meilleure présentation par affiche, 3e cycle et postdoctorat", detail: "Journée de la relève, Groupe francophone en soins primaires." },
          { date: "2025", titre: "Bourse de doctorat du Fonds de recherche du Québec (B2)", detail: "Bourse d’excellence, rang 3.", lien: FRQ_DOI },
          { date: "2025", titre: "Bourse de recrutement international", detail: "Études supérieures et postdoctorales, Université de Montréal." },
          { date: "2023–2025", titre: "Trois mentions spéciales du jury", detail: "Excellence académique." },
        ],
      },
      {
        titre: "Engagement citoyen",
        items: [
          { date: "2023", titre: "Sapeur-pompier volontaire", detail: "Centre d’incendie et de secours de Dinard, France." },
          { date: "2013", titre: "Bénévolat et service civique", detail: "Association de la fondation étudiante pour la ville (AFEV), France." },
        ],
      },
      {
        titre: "Sports et loisirs",
        items: [
          { date: "Course", titre: "Triple marathonien", detail: "Marathons de Paris 2025 et 2026, marathon de Montréal 2026." },
          { date: "Musique", titre: "Piano, chant et guitare" },
          { date: "Sport", titre: "Hockey sur glace" },
        ],
      },
    ],
    affiliations: {
      titre: "Membre étudiant",
      items: ["Chaire de recherche GSK en gestion optimale des maladies chroniques", "Groupe francophone en soins primaires (GFSP)", "Réseau québécois de recherche sur le vieillissement (RQRV)", "Canadian Association for Health Services and Policy Research (CAHSPR)"],
    },
  },
  contact: {
    surtitre: "Contact",
    titre: "Échanger sur un travail",
    intro: "Une question, une lecture à partager, un projet à discuter : écrivez-moi.",
    courriel: COURRIEL,
    ecrire: "Écrire un courriel",
    liens: [
      ["CV académique", "PDF", "docs/cv-academique.pdf"],
      ["CV professionnel", "PDF", "docs/cv-professionnel.pdf"],
      ["ORCID", "0009-0001-4236-4932", ORCID],
      ["LinkedIn", "Profil", LINKEDIN],
      ["Affiche du projet de thèse", "Version accessible", AFFICHE],
    ],
    adresse: "École de santé publique de l’Université de Montréal · 7101, avenue du Parc, Montréal (Québec)",
  },
  pied: "© 2026 Éric Bernier · Site sans témoins ni mesure d’audience.",
  credits: "Images des portes : photographies Unsplash et portrait d’Éric Bernier ; amphithéâtre, assemblée et atelier participatif générés pour le site.",
  introuvable: { titre: "Page introuvable", texte: "Cette page n’existe pas ou a été déplacée.", retour: "Revenir à l’accueil" },
};

/* ----------------------------------------------------------------- English */
const en = {
  lang: "en",
  locale: "en_CA",
  chemin: "../",
  meta: {
    titre: "Éric Bernier — PhD student in public health, ESPUM",
    description:
      "Éric Bernier, PhD student in public health (health systems, organisations and policy) at ESPUM, Université de Montréal, trained in law and special needs education. Research on intersectoral responses to complex social needs in primary care.",
  },
  ui: {
    evitement: "Skip to content",
    sousTitre: "Public health · Governance · Management · Law · Social intervention and intersectoral action",
    navigation: "Main navigation",
    langue: "Language",
    entrer: "Step in",
    cv: "CV",
    hall: "The hall",
    suivante: "Next door",
    contact: "Get in touch",
    haut: "Back to top",
  },
  nav: [
    ["recherche", "Research"],
    ["approche", "Approach"],
    ["implantation", "Implementation"],
    ["publications", "Publications"],
    ["biographie", "Biography"],
    ["parcours", "Background"],
    ["engagements", "Engagement"],
    ["contact", "Contact"],
  ],
  accueil: {
    surtitre: "PhD student in public health · ESPUM",
    roles: "Special needs educator · Jurist · PhD student in public health",
    chapeau:
      "The same attention to people, to their rights and to the services that support them. My path brings together educational practice, public law and research on health systems, organisations and policy.",
    encadrement:
      "Thesis co-supervised by Dr. Nadia Sourial, PhD, and Dr. Géraldine Layani, MD · GSK Research Chair in optimal management of chronic diseases · CRCHUM · FRQ doctoral scholar (B2)",
    visite: "Start the visit",
    explorer: "Browse freely",
    portrait: "Portrait of Éric Bernier",
  },
  hall: {
    titre: "The hall",
    compte: "7 doors",
    consigne: "Click a door to step in",
    portes: {
      recherche: ["Research", "Thesis and work in progress"],
      approche: ["Approach", "Stance, methods, areas, values"],
      implantation: ["Implementation", "Knowledge translation and implementation"],
      publications: ["Publications", "Presentations, theses, tools"],
      biographie: ["Biography", "One story, several lives"],
      parcours: ["Background", "Education and experience"],
      engagements: ["Engagement", "Representation, teaching, awards"],
    },
  },
  recherche: {
    surtitre: "01 · Research",
    etiquette: "Doctoral thesis in progress · provisional topic",
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
        { nom: "Dr. Nadia Sourial", grade: "PhD", lignes: ["Assistant Professor, Department of Health Management, Evaluation and Policy, School of Public Health, Université de Montréal", "Principal scientist, CRCHUM, Health Innovation and Evaluation Hub"], chaire: "Co-holder, GSK Research Chair in optimal management of chronic diseases", lien: CRCHUM_SOURIAL },
        { nom: "Dr. Géraldine Layani", grade: "MD, MSc", lignes: ["Family physician, GMF-U Notre-Dame, Montréal", "Assistant clinical professor, Department of Family and Emergency Medicine, Université de Montréal", "Principal scientist, CRCHUM, Health Innovation and Evaluation Hub"], chaire: "Co-holder, GSK Research Chair in optimal management of chronic diseases", lien: CRCHUM_LAYANI },
      ],
    },
    affiche: ["See the project poster", "Accessible version: French, English, colour-blind friendly, audio", AFFICHE],
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
      titre: "Work in progress",
      intro: "Articles and manuscripts being written alongside the thesis.",
      items: [
        {
          domaine: "Epistemology and knowledge translation",
          statut: "In progress",
          titre: TITRES_ORIGINAUX.epistemic,
          auteurs: "Bernier, É.",
          resume:
            "Research impact is usually pictured as a forward pathway, from knowledge to policy and practice. The article develops public health as a reflexive science of governance and specifies how consequences in practice and the situated knowledge of affected populations can acquire standing to require reconsideration of upstream categories, indicators and rules. The concept is translated into a documentary audit, tested on four institutional chains.",
          etiquettes: ["Epistemic return", "Reflexive governance", "Research impact"],
        },
        { domaine: "Health systems and primary care", statut: "Manuscript in preparation", titre: TITRES_ORIGINAUX.hospit, auteurs: AUTEURS.hospit },
        { domaine: "Governance and the public sphere", statut: "Manuscript in preparation", titre: TITRES_ORIGINAUX.pl2, auteurs: AUTEURS.pl2 },
        { domaine: "Health law", statut: "Manuscript in preparation", titre: TITRES_ORIGINAUX.droit, auteurs: "Bernier, É. · legal scholarship article" },
      ],
    },
  },
  approche: {
    surtitre: "02 · Approach",
    titre: "A pragmatic stance, mixed methods",
    intro:
      "From question to observation: each question calls for its own data, analytical method and interpretation. I choose methods according to what needs to be understood, drawing on several disciplines.",
    piliers: [
      ["Pragmatic stance", "A stance that combines a positivist reading (measuring, estimating, testing hypotheses) with a constructivist one (understanding the meaning actors give to their practices). The question determines the method."],
      ["Mixed methods", "Integrated quantitative and qualitative analyses: network analysis, regression, thematic analysis, document analysis and mapping, brought together in joint displays."],
      ["Multidisciplinarity", "Public health, law, management, political science and social intervention: perspectives that inform one another to analyse the same system."],
    ],
    outils: {
      titre: "Toolbox",
      groupes: [
        ["Data analysis", ["Positron (R)", "Python", "NVivo", "QGIS", "Excel"]],
        ["Collaboration and facilitation", ["Miro", "Klaxoon", "Canva"]],
        ["Office tools and AI", ["Office 365", "Artificial intelligence"]],
      ],
    },
    expertises: {
      titre: "Expertise",
      items: [
        ["Project methodology and evaluation", "Designing, steering and evaluating projects: study design, indicators, decision-support tools and change management."],
        ["Disability", "Educational support, self-determination and adapting services, from residential homes to adapted stays."],
        ["Autism", "Educational support for autistic people and adapting services to their needs."],
        ["Support for older adults", "Ageing, loss of autonomy, ageing in place and ageing with a disability, from practice to research."],
      ],
    },
    axes: {
      titre: "Areas of work",
      principaux: ["Governance and evaluation of health policy", "Intersectoral approaches in primary care", "Ageing, loss of autonomy and ageing-in-place policies"],
      secondairesTitre: "Secondary areas",
      secondaires: ["Legal planning, doctrinal analysis and health law", "Performance, change management and organisational steering", "Comparative analysis of health systems"],
    },
    valeurs: {
      titre: "My values",
      devise: ["Motto", "Per aspera ad astra", "Through hardships to the stars"],
      items: [
        ["Resilience", "Turning hardships into resources to move forward."],
        ["Perseverance", "Moving forward step by step, despite obstacles."],
        ["Self-determination", "Respecting people’s choices about their own lives."],
        ["Co-design", "Listening, then researching and deciding with practice settings, not only for them."],
        ["Social usefulness", "Making knowledge concretely useful to people and services."],
        ["Daring to innovate", "Daring to propose, to undertake and to create new responses."],
      ],
    },
  },
  implantation: {
    surtitre: "03 · Implementation",
    titre: "Knowledge translation and implementation",
    intro: "Moving knowledge between people, practice settings and research, then examining what it actually helps to change.",
    transfert: {
      titre: "Knowledge translation and implementation",
      detail: "Five stages",
      etapes: [
        ["Listen", "Framing the question with practice settings", "Identify the needs and the decisions to inform. Specify who takes part, when, and with what influence.", ["Needs", "Participation"]],
        ["Circulate", "Putting knowledge in context", "Bring research into dialogue with lived experience. Adapt format, language and content to the intended uses.", ["Lived experience", "Adapted formats"]],
        ["Co-design", "Discussing options and choices", "Consultation gathers views; co-design means building together; deliberation weighs arguments and trade-offs. Document the actual influence of contributions.", ["Co-design", "Deliberation"]],
        ["Implement", "Supporting implementation", "Examine context, resources and barriers. Specify actors, adaptations and support strategies, using frameworks such as CFIR.", ["Implementation", "CFIR"]],
        ["Evaluate", "Telling producing, using and changing apart", "A disseminated tool is an output. Its adoption is an implementation outcome. Changes for services and people are further outcomes to document.", ["Evaluation", "Impact"]],
      ],
      note: "Trained in knowledge mobilisation (MobilizeU, Research Impact Canada and York University, 2026).",
    },
  },
  publications: {
    surtitre: "04 · Publications",
    titre: "Presentations, theses and tools",
    intro: "Each work keeps its original title, authors and status. Manuscripts in progress are presented in the Research room.",
    groupes: [
      {
        titre: "Scientific presentations",
        items: [
          { date: "June 2026", statut: "Best poster award · doctoral and postdoctoral", titre: TITRES_ORIGINAUX.gfsp, detail: `${AUTEURS.trio} · Groupe francophone en soins primaires (GFSP), Montréal · poster` },
          { date: "May 2026", statut: "Poster", titre: TITRES_ORIGINAUX.cahspr, detail: `${AUTEURS.trio} · CAHSPR, Ottawa` },
          { date: "April 2026", statut: "Poster and 180-second talk", titre: TITRES_ORIGINAUX.gfsp, detail: `${AUTEURS.trio} · Quebec Network for Research on Aging (RQRV), Sherbrooke · poster and 180-second talk` },
        ],
      },
      {
        titre: "Theses defended before a jury",
        items: [
          { date: "2025", titre: TITRES_ORIGINAUX.memoireDroit, detail: "Master of Laws · Université Paris Panthéon-Assas · supervisor: Benoît Apollis" },
          { date: "2024", titre: TITRES_ORIGINAUX.memoireGestion, detail: "Master’s in health care facility management · Université de Bretagne Occidentale · supervisor: Michelle-Hentic Giliberto" },
          { date: "2023", titre: TITRES_ORIGINAUX.memoireEduc, detail: "State diploma in special needs education · Académie de Rennes" },
        ],
      },
      {
        titre: "Professional tools",
        items: [
          { date: "2024–2025", titre: "Home care services reform: decision-support tools", detail: "French national agency for performance support (ANAP) · several thousand downloads", lien: ANAP_SAD },
          { date: "2024–2025", titre: "Territorial resource centres: ten management support tools", detail: "ANAP · several thousand downloads", lien: ANAP_CRT },
        ],
      },
    ],
  },
  biographie: {
    surtitre: "05 · Biography",
    titre: "Each step grew out of the limits of the one before",
    intro: "Special needs educator, jurist and PhD student in public health: my path is anything but linear, and that is precisely what makes it coherent.",
    chapitres: [
      ["Starting from experience", "I went through the child welfare system in France, then left school at 16. Neurodivergence taught me early on to learn differently, to find my own paths and not to give up. From that starting point I keep a conviction that still guides my work: a public policy should be judged by what it concretely changes in people’s lives."],
      ["Music, then the field", "Studying came back through music, with a bachelor’s degree in musicology: listening, rigour and the perseverance of patient work. Alongside, youth and leisure programmes and then managing adapted stays for people with disabilities taught me to organise, to lead teams and to start from each person’s needs."],
      ["Choosing social usefulness", "Then came a moment of questioning: what is my relationship to society, and how am I useful? I went back to school to become a special needs educator and to enter the health field through professional practice."],
      ["From the limits of practice to management", "My educator’s thesis examined how educational practices shape self-determination. It showed me a limit: without the right organisation, even the best practice runs into the framework. So I turned to management, with a master’s in health care facility management and a university diploma in entrepreneurship."],
      ["From law to governance", "Management in turn revealed its own limits: planning, law and funding are often decided higher up. I went on to Université Paris Panthéon-Assas, in public, social and health law, then to France’s national agency for performance support (ANAP), close to central organisation, planning, political science and governance."],
      ["Researching in order to propose", "Today, the PhD in public health in Montréal brings these perspectives together: the field, management, law and governance. I am not only trying to understand; I want to innovate and propose better-organised responses for people whose needs cut across several sectors. The same drive leads me to entrepreneurship, with the creation of OWNNIGHT."],
    ],
    conclusion: "Per aspera ad astra: through hardships to the stars.",
  },
  parcours: {
    surtitre: "06 · Background",
    titre: "Education and experience",
    sousTitre: "From frontline practice to health policy",
    intro: "From special needs education to the PhD: the degrees, positions and training that mark the path.",
    types: { formation: "Education", experience: "Experience", entreprise: "Entrepreneurship" },
    etapes: [
      { date: "Ongoing", type: "entreprise", titre: "Founding OWNNIGHT · entrepreneur", detail: "An Android app for sleep well-being and sleep education: a personalised plan, lessons and guided sessions. Data stays on the phone, with no account." },
      { date: "Since 2025", type: "formation", titre: "PhD in public health · ESPUM", detail: "Health systems, organisations and policy option (SOPS), 2nd year. Research trainee at CRCHUM: primary care policy, intersectoral action and integration of care and services.", discret: "Cumulative GPA: 4.1" },
      { date: "2025", type: "formation", titre: "Master of Laws (LL.M.)", detail: "Public law, social law and health law · Université Paris Panthéon-Assas, with special distinction from the jury." },
      { date: "2024–2025", type: "experience", titre: "Project manager · French national agency for performance support (ANAP)", detail: "Paris. Supporting the transformation of health and social services, leading projects, producing decision-support tools, coordinating an expert network and communities of practice." },
      { date: "2024", type: "formation", titre: "Master’s in health care facility management", detail: "Université de Bretagne Occidentale, with special distinction from the jury." },
      { date: "2023", type: "formation", titre: "University diploma in entrepreneurship", detail: "Institut d’administration des entreprises (IAE) de Brest, with special distinction from the jury." },
      { date: "2023", type: "formation", titre: "State diploma in special needs education", detail: "Académie de Rennes." },
      { date: "2020–2023", type: "experience", titre: "Special needs educator", detail: "Residential home, Adapei 35, Saint-Malo: assessing needs, co-designing individual plans, coordinating a multidisciplinary team." },
      { date: "2016–2024", type: "experience", titre: "Respite stay manager", detail: "Adapted stays for people with disabilities, Brest: supervision, service projects, team, budget and logistics management." },
    ],
    continue: {
      titre: "Continuing education · 2026",
      items: [
        "Responsible conduct of research · CRCHUM",
        "Research assistant practice · Université de Montréal",
        "MobilizeU, knowledge mobilisation · Research Impact Canada and York University",
      ],
    },
    note: "French degrees evaluated by the MIFI (Québec) and WES Canada.",
  },
  engagements: {
    surtitre: "07 · Engagement",
    titre: "Representing, teaching, contributing",
    intro: "Taking part in student and scientific life, in continuity with the path so far.",
    groupes: [
      {
        titre: "Student representation",
        items: [
          { date: "2026", titre: "PhD coordinator in public health · AÉÉSPUM", detail: "Elected." },
          { date: "2026", titre: "Doctoral student representative · DGEPS", detail: "Department of Health Management, Evaluation and Policy, ESPUM." },
          { date: "Winter 2026", titre: "Université de Montréal ambassador" },
          { date: "2022–2024", titre: "Elected member of the CROUS board", detail: "France." },
          { date: "2021", titre: "President of Askoria’s regional social work student association", detail: "France." },
        ],
      },
      {
        titre: "Teaching experience",
        items: [
          { date: "Fall 2026", statut: "Ongoing", titre: "Teaching assistant · SPU 7001, ASA 6754 and ASA 6765", detail: "Université de Montréal." },
          { date: "Winter 2026", titre: "Teaching assistant · ASA 6754", detail: "Health system and population health, Université de Montréal: student support, grading of written and oral exams." },
        ],
      },
      {
        titre: "Scientific community",
        items: [
          { date: "June 2026", titre: "Scientific committee, GFSP early-career research day", detail: "Student member." },
        ],
      },
      {
        titre: "Scholarships and awards",
        items: [
          { date: "2026", titre: "Best poster presentation award, doctoral and postdoctoral category", detail: "Early-career research day, Groupe francophone en soins primaires." },
          { date: "2025", titre: "Fonds de recherche du Québec doctoral scholarship (B2)", detail: "Excellence scholarship, ranked 3rd.", lien: FRQ_DOI },
          { date: "2025", titre: "International recruitment scholarship", detail: "Graduate and Postdoctoral Studies, Université de Montréal." },
          { date: "2023–2025", titre: "Three special distinctions from the jury", detail: "Academic excellence." },
        ],
      },
      {
        titre: "Civic engagement",
        items: [
          { date: "2023", titre: "Volunteer firefighter", detail: "Dinard fire and rescue station, France." },
          { date: "2013", titre: "Volunteering and civic service", detail: "Association de la fondation étudiante pour la ville (AFEV), France." },
        ],
      },
      {
        titre: "Sports and leisure",
        items: [
          { date: "Running", titre: "Three-time marathoner", detail: "Paris Marathon 2025 and 2026, Montréal Marathon 2026." },
          { date: "Music", titre: "Piano, singing and guitar" },
          { date: "Sport", titre: "Ice hockey" },
        ],
      },
    ],
    affiliations: {
      titre: "Student member",
      items: ["GSK Research Chair in optimal management of chronic diseases", "Groupe francophone en soins primaires (GFSP)", "Quebec Network for Research on Aging (RQRV)", "Canadian Association for Health Services and Policy Research (CAHSPR)"],
    },
  },
  contact: {
    surtitre: "Contact",
    titre: "Let’s talk about your work",
    intro: "A question, a reading to share, a project to discuss: write to me.",
    courriel: COURRIEL,
    ecrire: "Send an email",
    liens: [
      ["Academic CV", "PDF, in French", "docs/cv-academique.pdf"],
      ["Professional CV", "PDF, in French", "docs/cv-professionnel.pdf"],
      ["ORCID", "0009-0001-4236-4932", ORCID],
      ["LinkedIn", "Profile", LINKEDIN],
      ["Thesis project poster", "Accessible version", AFFICHE],
    ],
    adresse: "School of Public Health, Université de Montréal · 7101 avenue du Parc, Montréal, Québec",
  },
  pied: "© 2026 Éric Bernier · No cookies, no analytics.",
  credits: "Door images: Unsplash photographs and a portrait of Éric Bernier; lecture hall, assembly and participatory workshop generated for this site.",
  introuvable: { titre: "Page not found", texte: "This page does not exist or has moved.", retour: "Back to the home page" },
};

/* ----------------------------------------------------------------- Español */
const es = {
  lang: "es",
  locale: "es_ES",
  chemin: "../",
  meta: {
    titre: "Éric Bernier — Doctorando en salud pública, ESPUM",
    description:
      "Éric Bernier, doctorando en salud pública (sistemas, organizaciones y políticas de salud) en la ESPUM, Université de Montréal, jurista y educador especializado. Investigación sobre la respuesta intersectorial a las necesidades sociales complejas en atención primaria.",
  },
  ui: {
    evitement: "Ir al contenido",
    sousTitre: "Salud pública · Gobernanza · Gestión · Derecho · Intervención social e intersectorialidad",
    navigation: "Navegación principal",
    langue: "Idioma",
    entrer: "Entrar",
    cv: "CV",
    hall: "El vestíbulo",
    suivante: "Puerta siguiente",
    contact: "Contactarme",
    haut: "Volver arriba",
  },
  nav: [
    ["recherche", "Investigación"],
    ["approche", "Enfoque"],
    ["implantation", "Implementación"],
    ["publications", "Publicaciones"],
    ["biographie", "Biografía"],
    ["parcours", "Trayectoria"],
    ["engagements", "Compromisos"],
    ["contact", "Contacto"],
  ],
  accueil: {
    surtitre: "Doctorando en salud pública · ESPUM",
    roles: "Educador especializado · Jurista · Doctorando en salud pública",
    chapeau:
      "Una misma atención a las personas, a sus derechos y a los servicios que las acompañan. Mi trayectoria cruza la práctica educativa, el derecho público y la investigación en sistemas, organizaciones y políticas de salud.",
    encadrement:
      "Tesis codirigida por la Dra. Nadia Sourial, Ph. D., y la Dra. Géraldine Layani, M.D. · Cátedra de investigación GSK en gestión óptima de enfermedades crónicas · CRCHUM · Becario del FRQ (B2)",
    visite: "Comenzar la visita",
    explorer: "Explorar libremente",
    portrait: "Retrato de Éric Bernier",
  },
  hall: {
    titre: "El vestíbulo",
    compte: "7 puertas",
    consigne: "Haga clic en una puerta para entrar",
    portes: {
      recherche: ["La investigación", "Tesis y trabajos en curso"],
      approche: ["El enfoque", "Postura, métodos, ejes, valores"],
      implantation: ["Implementación", "Transferencia de conocimientos e implementación"],
      publications: ["Publicaciones", "Comunicaciones, memorias, herramientas"],
      biographie: ["Biografía", "Una historia, varias vidas"],
      parcours: ["La trayectoria", "Formación y experiencia"],
      engagements: ["Compromisos", "Representación, docencia, distinciones"],
    },
  },
  recherche: {
    surtitre: "01 · La investigación",
    etiquette: "Tesis doctoral en curso · tema provisional",
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
        { nom: "Dra. Nadia Sourial", grade: "Ph. D.", lignes: ["Profesora adjunta, Departamento de Gestión, Evaluación y Política de Salud, Escuela de Salud Pública, Université de Montréal", "Investigadora del CRCHUM, Polo de innovación y evaluación en salud"], chaire: "Cotitular de la Cátedra de investigación GSK en gestión óptima de enfermedades crónicas", lien: CRCHUM_SOURIAL },
        { nom: "Dra. Géraldine Layani", grade: "M.D., M. Sc.", lignes: ["Médica de familia, GMF-U Notre-Dame, Montreal", "Profesora adjunta clínica, Departamento de Medicina Familiar y de Urgencias, Université de Montréal", "Investigadora del CRCHUM, Polo de innovación y evaluación en salud"], chaire: "Cotitular de la Cátedra de investigación GSK en gestión óptima de enfermedades crónicas", lien: CRCHUM_LAYANI },
      ],
    },
    affiche: ["Ver el póster del proyecto", "Versión accesible: francés, inglés, daltonismo, audio", AFFICHE],
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
      titre: "Trabajos en curso",
      intro: "Artículos y manuscritos en redacción, en paralelo a la tesis.",
      items: [
        {
          domaine: "Epistemología y transferencia de conocimientos",
          statut: "En elaboración",
          titre: TITRES_ORIGINAUX.epistemic,
          auteurs: "Bernier, É.",
          resume:
            "El impacto de la investigación suele pensarse en un solo sentido, del conocimiento hacia las políticas y las prácticas. El artículo propone una salud pública concebida como ciencia reflexiva de la gobernanza: precisa en qué condiciones las consecuencias observadas en el terreno y los saberes de las poblaciones afectadas pueden exigir que se reexaminen las categorías, los indicadores y las reglas de origen. El concepto se traduce en una auditoría documental, puesta a prueba en cuatro cadenas institucionales.",
          etiquettes: ["Retorno epistémico", "Gobernanza reflexiva", "Impacto de la investigación"],
        },
        { domaine: "Sistemas de salud y atención primaria", statut: "Manuscrito en preparación", titre: TITRES_ORIGINAUX.hospit, auteurs: AUTEURS.hospit },
        { domaine: "Gobernanza y espacio público", statut: "Manuscrito en preparación", titre: TITRES_ORIGINAUX.pl2, auteurs: AUTEURS.pl2 },
        { domaine: "Derecho de la salud", statut: "Manuscrito en preparación", titre: TITRES_ORIGINAUX.droit, auteurs: "Bernier, É. · artículo de doctrina" },
      ],
    },
  },
  approche: {
    surtitre: "02 · El enfoque",
    titre: "Una postura pragmática, métodos mixtos",
    intro:
      "De la pregunta a la observación: cada pregunta requiere sus datos, su método de análisis y su interpretación. Elijo los métodos según lo que haya que esclarecer, cruzando disciplinas.",
    piliers: [
      ["Postura pragmática", "Una postura que articula una lectura positivista (medir, estimar, poner a prueba hipótesis) y una lectura constructivista (comprender el sentido que los actores dan a sus prácticas). La pregunta decide el método."],
      ["Métodos mixtos", "Análisis cuantitativos y cualitativos integrados: análisis de redes, regresiones, análisis temático, análisis documental y cartografía, reunidos en tablas de integración."],
      ["Pluridisciplinariedad", "Salud pública, derecho, gestión, ciencia política e intervención social: miradas que dialogan para analizar un mismo sistema."],
    ],
    outils: {
      titre: "Caja de herramientas",
      groupes: [
        ["Análisis de datos", ["Positron (R)", "Python", "NVivo", "QGIS", "Excel"]],
        ["Colaboración y animación", ["Miro", "Klaxoon", "Canva"]],
        ["Ofimática e IA", ["Office 365", "Inteligencia artificial"]],
      ],
    },
    expertises: {
      titre: "Áreas de especialización",
      items: [
        ["Metodología y evaluación de proyectos", "Diseñar, dirigir y evaluar proyectos: diseño, indicadores, herramientas de apoyo a la decisión y gestión del cambio."],
        ["Discapacidad", "Acompañamiento educativo, autodeterminación y adaptación de los servicios, de la residencia a las estancias adaptadas."],
        ["Autismo", "Acompañamiento educativo de las personas autistas y adaptación de los servicios a sus necesidades."],
        ["Acompañamiento de personas mayores", "Envejecimiento, pérdida de autonomía, permanencia en el domicilio y discapacidad en la vejez, de la práctica a la investigación."],
      ],
    },
    axes: {
      titre: "Ejes de trabajo",
      principaux: ["Gobernanza y evaluación de las políticas de salud", "Enfoque intersectorial en atención primaria", "Envejecimiento, pérdida de autonomía y políticas de permanencia en el domicilio"],
      secondairesTitre: "Ejes secundarios",
      secondaires: ["Planificación jurídica, análisis doctrinal y derecho de la salud", "Desempeño, gestión del cambio y dirección de organizaciones", "Análisis comparado de sistemas de salud"],
    },
    valeurs: {
      titre: "Mis valores",
      devise: ["Lema", "Per aspera ad astra", "A través de las dificultades hasta las estrellas"],
      items: [
        ["Resiliencia", "Hacer de las pruebas vividas un recurso para avanzar."],
        ["Perseverancia", "Avanzar paso a paso, pese a los obstáculos."],
        ["Autodeterminación", "Respetar la elección de las personas sobre su propia vida."],
        ["Coconstrucción", "Escuchar, y luego investigar y decidir con los entornos de práctica, no solo para ellos."],
        ["Utilidad social", "Que los conocimientos sirvan concretamente a las personas y a los servicios."],
        ["Audacia para innovar", "Atreverse a proponer, emprender y crear nuevas respuestas."],
      ],
    },
  },
  implantation: {
    surtitre: "03 · Implementación",
    titre: "Transferencia de conocimientos e implementación",
    intro: "Hacer circular los saberes entre las personas, los entornos de práctica y la investigación, y examinar después lo que realmente permiten cambiar.",
    transfert: {
      titre: "Transferencia de conocimientos e implementación",
      detail: "Cinco tiempos",
      etapes: [
        ["Escuchar", "Construir la pregunta con los entornos de práctica", "Identificar las necesidades y las decisiones que hay que esclarecer. Precisar quién participa, en qué momento y con qué influencia.", ["Necesidades", "Participación"]],
        ["Hacer circular", "Contextualizar los saberes", "Poner en diálogo la investigación y los saberes de experiencia. Adaptar el formato, el lenguaje y el contenido a los usos previstos.", ["Saberes de experiencia", "Formatos adaptados"]],
        ["Coconstruir", "Discutir las opciones y las decisiones", "Consultar recoge opiniones; coconstruir es elaborar en conjunto; deliberar es examinar argumentos y arbitrajes. Documentar la influencia real de las contribuciones.", ["Coconstrucción", "Deliberación"]],
        ["Implementar", "Acompañar la puesta en marcha", "Examinar el contexto, los recursos y los obstáculos. Precisar los actores, las adaptaciones y las estrategias de acompañamiento, con marcos como el CFIR.", ["Implementación", "CFIR"]],
        ["Evaluar", "Distinguir producir, utilizar y cambiar", "Una herramienta difundida es una producción. Su adopción es un resultado de implementación. Los cambios para los servicios y las personas son otros resultados que documentar.", ["Evaluación", "Impacto"]],
      ],
      note: "Formado en movilización de conocimientos (MobilizeU, Research Impact Canada y Universidad York, 2026).",
    },
  },
  publications: {
    surtitre: "04 · Publicaciones",
    titre: "Comunicaciones, memorias y herramientas",
    intro: "Cada trabajo conserva su título original, sus autores y su estado. Los manuscritos en curso se presentan en la sala La investigación.",
    groupes: [
      {
        titre: "Comunicaciones científicas",
        items: [
          { date: "Junio de 2026", statut: "Premio al mejor póster · doctorado y posdoctorado", titre: TITRES_ORIGINAUX.gfsp, detail: `${AUTEURS.trio} · Groupe francophone en soins primaires (GFSP), Montreal · póster` },
          { date: "Mayo de 2026", statut: "Póster", titre: TITRES_ORIGINAUX.cahspr, detail: `${AUTEURS.trio} · CAHSPR, Ottawa` },
          { date: "Abril de 2026", statut: "Póster y 180 segundos", titre: TITRES_ORIGINAUX.gfsp, detail: `${AUTEURS.trio} · Red quebequense de investigación sobre el envejecimiento (RQRV), Sherbrooke · póster y divulgación en 180 segundos` },
        ],
      },
      {
        titre: "Memorias defendidas ante un jurado",
        items: [
          { date: "2025", titre: TITRES_ORIGINAUX.memoireDroit, detail: "Máster en Derecho · Université Paris Panthéon-Assas · dirección: Benoît Apollis" },
          { date: "2024", titre: TITRES_ORIGINAUX.memoireGestion, detail: "Maestría en dirección de establecimientos de salud · Université de Bretagne Occidentale · dirección: Michelle-Hentic Giliberto" },
          { date: "2023", titre: TITRES_ORIGINAUX.memoireEduc, detail: "Diploma de Estado de educador especializado · Académie de Rennes" },
        ],
      },
      {
        titre: "Herramientas profesionales",
        items: [
          { date: "2024–2025", titre: "Reforma de los servicios de autonomía a domicilio: herramientas de apoyo a la decisión", detail: "Agencia nacional francesa de apoyo al desempeño (ANAP) · varios miles de descargas", lien: ANAP_SAD },
          { date: "2024–2025", titre: "Centros de recursos territoriales: diez herramientas de apoyo a la dirección", detail: "ANAP · varios miles de descargas", lien: ANAP_CRT },
        ],
      },
    ],
  },
  biographie: {
    surtitre: "05 · Biografía",
    titre: "Cada etapa nació de los límites de la anterior",
    intro: "Educador especializado, jurista y doctorando en salud pública: mi trayectoria no tiene nada de lineal, y es precisamente eso lo que le da coherencia.",
    chapitres: [
      ["Partir de la experiencia", "Pasé por la protección de la infancia en Francia y dejé la escuela a los 16 años. Mi neuroatipia me enseñó pronto a aprender de otra manera, a buscar mis propios caminos y a no rendirme. De ese punto de partida conservo una convicción que todavía guía mi trabajo: una política pública se juzga por lo que cambia concretamente en la vida de las personas."],
      ["La música, y luego el terreno", "Los estudios volvieron a través de la música, con una licenciatura en musicología: la escucha, el rigor y la perseverancia del trabajo paciente. Al mismo tiempo, la animación sociocultural y después la responsabilidad de estancias adaptadas para personas con discapacidad me enseñaron a organizar, a dirigir equipos y a partir de las necesidades de cada persona."],
      ["Elegir la utilidad social", "Luego llegó un replanteamiento: ¿cuál es mi relación con la sociedad y para qué soy útil? Retomé los estudios para ser educador especializado y entrar en el ámbito de la salud a través de la práctica profesional."],
      ["De los límites de la práctica a la gestión", "Mi memoria de educador trataba sobre la influencia de las prácticas educativas en la autodeterminación. Me mostró un límite: sin una organización adecuada, incluso la mejor práctica choca con el marco. Por eso me dirigí a la gestión, con una maestría en dirección de establecimientos de salud y un diploma universitario en emprendimiento."],
      ["Del derecho a la gobernanza", "La gestión reveló a su vez sus propios límites: la planificación, el derecho y la financiación suelen decidirse más arriba. Continué en la Université Paris Panthéon-Assas, en derecho público, social y de la salud, y después en la Agencia nacional francesa de apoyo al desempeño (ANAP), cerca de la organización central, la planificación, la ciencia política y la gobernanza."],
      ["Investigar para proponer", "Hoy, el doctorado en salud pública en Montreal reúne estas miradas: el terreno, la gestión, el derecho y la gobernanza. No busco solo comprender; quiero innovar y proponer respuestas mejor organizadas para las personas cuyas necesidades atraviesan varios sectores. El mismo impulso me lleva a emprender, con la creación de OWNNIGHT."],
    ],
    conclusion: "Per aspera ad astra: a través de las dificultades hasta las estrellas.",
  },
  parcours: {
    surtitre: "06 · La trayectoria",
    titre: "Formación y experiencia",
    sousTitre: "Del terreno a las políticas de salud",
    intro: "De la educación especializada al doctorado: los títulos, los puestos y las formaciones que marcan la trayectoria.",
    types: { formation: "Formación", experience: "Experiencia", entreprise: "Emprendimiento" },
    etapes: [
      { date: "En curso", type: "entreprise", titre: "Creación de OWNNIGHT · emprendedor", detail: "Aplicación Android de bienestar y educación sobre el sueño: plan personalizado, lecciones y sesiones guiadas. Los datos permanecen en el teléfono, sin cuenta." },
      { date: "Desde 2025", type: "formation", titre: "Doctorado en salud pública · ESPUM", detail: "Opción sistemas, organizaciones y políticas de salud (SOPS), 2.º año. Investigador en prácticas en el CRCHUM: políticas de atención primaria, intersectorialidad e integración de cuidados y servicios.", discret: "Promedio acumulado: 4,1" },
      { date: "2025", type: "formation", titre: "Máster en Derecho (LL.M.)", detail: "Derecho público, derecho social y derecho de la salud · Université Paris Panthéon-Assas, mención especial del jurado." },
      { date: "2024–2025", type: "experience", titre: "Encargado de misión · Agencia nacional francesa de apoyo al desempeño (ANAP)", detail: "París. Acompañar la transformación de la oferta de salud y servicios sociales, dirigir proyectos, producir herramientas de apoyo a la decisión, animar una red de expertos y comunidades de práctica." },
      { date: "2024", type: "formation", titre: "Maestría en dirección de establecimientos de salud", detail: "Université de Bretagne Occidentale, mención especial del jurado." },
      { date: "2023", type: "formation", titre: "Diploma universitario en emprendimiento", detail: "Institut d’administration des entreprises (IAE) de Brest, mención especial del jurado." },
      { date: "2023", type: "formation", titre: "Diploma de Estado de educador especializado", detail: "Académie de Rennes." },
      { date: "2020–2023", type: "experience", titre: "Educador especializado", detail: "Residencia, Adapei 35, Saint-Malo: evaluar las necesidades, coconstruir los proyectos individualizados, coordinar un equipo pluridisciplinario." },
      { date: "2016–2024", type: "experience", titre: "Responsable de estancias de respiro", detail: "Estancias adaptadas para personas con discapacidad, Brest: supervisión, proyectos de servicio, gestión de equipos, presupuesto y logística." },
    ],
    continue: {
      titre: "Formación continua · 2026",
      items: [
        "Conducta responsable en la investigación · CRCHUM",
        "Práctica de auxiliar de investigación · Université de Montréal",
        "MobilizeU, movilización de conocimientos · Research Impact Canada y Universidad York",
      ],
    },
    note: "Títulos franceses evaluados por el MIFI (Quebec) y WES Canada.",
  },
  engagements: {
    surtitre: "07 · Compromisos",
    titre: "Representar, enseñar, contribuir",
    intro: "Una presencia en la vida estudiantil y científica, en continuidad con la trayectoria.",
    groupes: [
      {
        titre: "Representación estudiantil",
        items: [
          { date: "2026", titre: "Coordinador del doctorado en salud pública · AÉÉSPUM", detail: "Electo." },
          { date: "2026", titre: "Representante estudiantil del doctorado · DGEPS", detail: "Departamento de Gestión, Evaluación y Política de Salud, ESPUM." },
          { date: "Invierno de 2026", titre: "Embajador de la Université de Montréal" },
          { date: "2022–2024", titre: "Representante electo en el consejo de administración del CROUS", detail: "Francia." },
          { date: "2021", titre: "Presidente de la oficina regional de estudiantes de trabajo social de Askoria", detail: "Francia." },
        ],
      },
      {
        titre: "Experiencia docente",
        items: [
          { date: "Otoño de 2026", statut: "En curso", titre: "Auxiliar docente · SPU 7001, ASA 6754 y ASA 6765", detail: "Université de Montréal." },
          { date: "Invierno de 2026", titre: "Auxiliar docente · ASA 6754", detail: "Sistema de salud y salud de las poblaciones, Université de Montréal: acompañamiento de estudiantes, corrección de exámenes escritos y orales." },
        ],
      },
      {
        titre: "Comunidad científica",
        items: [
          { date: "Junio de 2026", titre: "Comité científico de la jornada de jóvenes investigadores del GFSP", detail: "Miembro estudiante." },
        ],
      },
      {
        titre: "Becas y distinciones",
        items: [
          { date: "2026", titre: "Premio a la mejor presentación en póster, doctorado y posdoctorado", detail: "Jornada de jóvenes investigadores, Groupe francophone en soins primaires." },
          { date: "2025", titre: "Beca de doctorado del Fonds de recherche du Québec (B2)", detail: "Beca de excelencia, tercer puesto.", lien: FRQ_DOI },
          { date: "2025", titre: "Beca de captación internacional", detail: "Estudios de posgrado y posdoctorado, Université de Montréal." },
          { date: "2023–2025", titre: "Tres menciones especiales del jurado", detail: "Excelencia académica." },
        ],
      },
      {
        titre: "Compromiso ciudadano",
        items: [
          { date: "2023", titre: "Bombero voluntario", detail: "Centro de bomberos y rescate de Dinard, Francia." },
          { date: "2013", titre: "Voluntariado y servicio cívico", detail: "Association de la fondation étudiante pour la ville (AFEV), Francia." },
        ],
      },
      {
        titre: "Deportes y ocio",
        items: [
          { date: "Carrera", titre: "Triple maratonista", detail: "Maratón de París 2025 y 2026, maratón de Montreal 2026." },
          { date: "Música", titre: "Piano, canto y guitarra" },
          { date: "Deporte", titre: "Hockey sobre hielo" },
        ],
      },
    ],
    affiliations: {
      titre: "Miembro estudiante",
      items: ["Cátedra de investigación GSK en gestión óptima de enfermedades crónicas", "Groupe francophone en soins primaires (GFSP)", "Red quebequense de investigación sobre el envejecimiento (RQRV)", "Canadian Association for Health Services and Policy Research (CAHSPR)"],
    },
  },
  contact: {
    surtitre: "Contacto",
    titre: "Conversar sobre un trabajo",
    intro: "Una pregunta, una lectura para compartir, un proyecto que discutir: escríbame.",
    courriel: COURRIEL,
    ecrire: "Escribir un correo",
    liens: [
      ["CV académico", "PDF, en francés", "docs/cv-academique.pdf"],
      ["CV profesional", "PDF, en francés", "docs/cv-professionnel.pdf"],
      ["ORCID", "0009-0001-4236-4932", ORCID],
      ["LinkedIn", "Perfil", LINKEDIN],
      ["Póster del proyecto de tesis", "Versión accesible", AFFICHE],
    ],
    adresse: "Escuela de Salud Pública de la Université de Montréal · 7101, avenue du Parc, Montreal (Quebec)",
  },
  pied: "© 2026 Éric Bernier · Sin cookies ni medición de audiencia.",
  credits: "Imágenes de las puertas: fotografías de Unsplash y retrato de Éric Bernier; anfiteatro, asamblea y taller participativo generados para el sitio.",
  introuvable: { titre: "Página no encontrada", texte: "Esta página no existe o ha sido trasladada.", retour: "Volver a la página de inicio" },
};

module.exports = { fr, en, es, LANGUES };
