"use strict";

const ORCID = "https://orcid.org/0009-0001-4236-4932";
const LINKEDIN = "https://www.linkedin.com/in/eric-b-5aa52b250";
const AFFICHE = "https://erjb-web.github.io/affiche-releve/";
const COURRIEL = "eric.bernier.1@umontreal.ca";
const FRQ_DOI = "https://doi.org/10.69777/2009461";
const ANAP_SAD = "https://anap.fr/s/article/reforme-services-autonomie-a-domicile";
const ANAP_CRT = "https://www.anap.fr/s/article/centre-ressources-territorial-crt-ambition-nouvelle";

const fr = {
  lang: "fr",
  locale: "fr_CA",
  chemin: "",
  autre: { code: "en", libelle: "EN", href: "en/", nom: "English" },
  meta: {
    titre: "Éric Bernier — Doctorant en santé publique, ESPUM",
    description:
      "Éric Bernier, doctorant en santé publique (systèmes, organisations et politiques de santé) à l’ESPUM, juriste et éducateur spécialisé. Recherche sur la réponse intersectorielle aux besoins sociaux complexes en soins primaires.",
  },
  ui: {
    evitement: "Aller au contenu",
    sousTitre: "Santé publique · Droit · Intervention sociale",
    navigation: "Navigation principale",
    langue: "Langue",
    cv: "CV",
    hall: "Le hall",
    suivante: "Porte suivante",
    contact: "Me contacter",
    telecharger: "Télécharger",
    pdf: "PDF",
    ouvrir: "Ouvrir",
    haut: "Haut de page",
  },
  nav: [
    ["recherche", "Recherche"],
    ["publications", "Publications"],
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
      "Thèse codirigée par Nadia Sourial et Géraldine Layani · Chaire de recherche GSK en gestion optimale des maladies chroniques · CRCHUM · Boursier FRQ (B2)",
    visite: "Commencer la visite",
    explorer: "Explorer librement",
    portrait: "Portrait d’Éric Bernier",
  },
  hall: {
    titre: "Le hall",
    compte: "4 portes",
    consigne: "Cliquez sur une porte pour entrer",
    portes: {
      recherche: ["La recherche", "Thèse, question, devis"],
      publications: ["Publications", "Communications, manuscrits, mémoires"],
      parcours: ["Le parcours", "Terrain, gestion, droit, santé publique"],
      engagements: ["Engagements", "Représentation, enseignement, distinctions"],
    },
  },
  recherche: {
    surtitre: "01 · La recherche",
    titre: "Organiser la réponse intersectorielle aux besoins sociaux complexes et co-occurrents en soins primaires",
    sousTitre: "Configuration des réseaux adaptés aux différents profils de patients pris en charge",
    question:
      "Comment s’organise la réponse intersectorielle aux différents profils de patients ayant des besoins sociaux complexes et co-occurrents pris en charge en soins primaires ?",
    but: "Le projet vise à relier chaque profil de besoins à une configuration de partenaires et à son coordonnateur, à l’échelle d’un territoire de CLSC.",
    faits: [
      ["Programme", "Doctorat en santé publique, 2e année · option systèmes, organisations et politiques de santé · ESPUM"],
      ["Codirection", "Nadia Sourial et Géraldine Layani"],
      ["Milieu", "Chaire de recherche GSK en gestion optimale des maladies chroniques · CRCHUM"],
      ["Calendrier", "2026–2029 · présentation du protocole le 27 octobre 2026"],
      ["Financement", "Fonds de recherche du Québec, bourse de doctorat (B2)"],
    ],
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
        ["La co-occurrence", "La présence d’au moins deux besoins sociaux en même temps. Elle se compte : c’est le critère d’inclusion."],
        ["La complexité", "Le cumul de maladies chroniques, d’incapacités, de problèmes de santé mentale et de vulnérabilité sociale. Elle se décrit, sans être exigée."],
        ["La réponse intersectorielle", "Les actions d’autres secteurs que la santé, menées avec elle : CLSC, GMF, hôpital, pharmacies, organismes communautaires, municipalité, écoles, CPE. Elle s’organise sur un territoire."],
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
    axes: {
      titre: "Axes de recherche",
      items: [
        "Gouvernance et évaluation des politiques de santé",
        "Approche intersectorielle en première ligne",
        "Vieillissement, perte d’autonomie et politiques du maintien à domicile",
      ],
    },
  },
  publications: {
    surtitre: "02 · Publications",
    titre: "Communications, manuscrits et mémoires",
    intro: "Chaque travail garde son titre original, ses auteurs et son statut.",
    groupes: [
      {
        titre: "Communications scientifiques",
        items: [
          { date: "Juin 2026", statut: "Prix de la meilleure affiche · 3e cycle et postdoctorat", titre: "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative", detail: "Bernier, É., Sourial, N., Layani, G. · Groupe francophone en soins primaires (GFSP), Montréal · présentation par affiche" },
          { date: "Mai 2026", statut: "Affiche", titre: "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec", detail: "Bernier, É., Sourial, N., Layani, G. · CAHSPR, Ottawa" },
          { date: "Avril 2026", statut: "Affiche et 180 secondes", titre: "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative", detail: "Bernier, É., Sourial, N., Layani, G. · Réseau québécois de recherche sur le vieillissement (RQRV), Sherbrooke · affiche et vulgarisation en 180 secondes" },
        ],
      },
      {
        titre: "Manuscrits en préparation",
        items: [
          { date: "2026", titre: "Potentially avoidable hospitalisations and primary care: the role of patient experience across Commonwealth countries", detail: "Bernier, É., Algoët, A., Sourial, N., Layani, G., Vedel, I., Calafiore, M." },
          { date: "2026", titre: "Prise de parole des médecins dans l’espace public québécois lors des débats entourant le projet de loi n° 2 : une analyse qualitative du discours critique", detail: "Bernier, É., Aïssi, F., Diene Faye, C., Boukari Abdo, S." },
          { date: "2026", titre: "Vieillir chez soi à l’épreuve du droit : l’effectivité du choix du lieu de vie en droit français et en droit québécois", detail: "Bernier, É. · article de doctrine" },
        ],
      },
      {
        titre: "Mémoires soutenus devant jury",
        items: [
          { date: "2025", titre: "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec", detail: "Master en droit · Université Paris Panthéon-Assas · direction : Benoît Apollis" },
          { date: "2024", titre: "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?", detail: "Maîtrise en direction d’établissements · Université de Bretagne Occidentale · direction : Michelle-Hentic Giliberto" },
          { date: "2023", titre: "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement", detail: "Diplôme d’État d’éducateur spécialisé · Académie de Rennes" },
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
  parcours: {
    surtitre: "03 · Le parcours",
    titre: "Du terrain aux politiques de santé",
    intro:
      "Accompagner, organiser, analyser, chercher : plusieurs positions pour interroger les mêmes services. Chaque étape a élargi la question de départ : comment les services répondent-ils aux besoins des personnes ?",
    types: { formation: "Formation", experience: "Expérience" },
    etapes: [
      { date: "Depuis 2025", type: "formation", titre: "Doctorat en santé publique · ESPUM", detail: "Option systèmes, organisations et politiques de santé, 2e année. Stagiaire de recherche au CRCHUM : politiques de soins primaires, intersectorialité et intégration des soins et services." },
      { date: "2024–2025", type: "experience", titre: "Chargé de mission · Agence nationale d’appui à la performance", detail: "Paris. Accompagner la transformation de l’offre en santé et services sociaux, piloter des projets, produire des outils d’aide à la décision, animer un réseau d’experts et des communautés de pratique." },
      { date: "2025", type: "formation", titre: "Master en droit (LL.M.)", detail: "Droit public, droit social et droit de la santé · Université Paris Panthéon-Assas, mention spéciale du jury." },
      { date: "2024", type: "formation", titre: "Maîtrise en direction d’établissements de santé", detail: "Université de Bretagne Occidentale, mention spéciale du jury." },
      { date: "2024", type: "formation", titre: "Diplôme universitaire en entrepreneuriat et management", detail: "IAE de Brest, mention spéciale du jury." },
      { date: "2016–2024", type: "experience", titre: "Responsable de séjours de répit", detail: "Séjours adaptés pour personnes en situation de handicap, Brest : encadrement, projets de service, gestion des équipes, du budget et de la logistique." },
      { date: "2020–2023", type: "experience", titre: "Éducateur spécialisé", detail: "Foyer d’hébergement, Adapei 35, Saint-Malo : évaluer les besoins, coconstruire les projets individualisés, coordonner une équipe pluridisciplinaire." },
      { date: "2023", type: "formation", titre: "Diplôme d’État d’éducateur spécialisé", detail: "Académie de Rennes." },
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
    surtitre: "04 · Engagements",
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
        titre: "Enseignement et communauté scientifique",
        items: [
          { date: "2026", titre: "Auxiliaire d’enseignement · ASA 6754", detail: "Système de santé et santé des populations, Université de Montréal, hiver et automne 2026 : accompagnement des étudiants, correction des examens écrits et oraux." },
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
  introuvable: { titre: "Page introuvable", texte: "Cette page n’existe pas ou a été déplacée.", retour: "Revenir à l’accueil" },
};

const en = {
  lang: "en",
  locale: "en_CA",
  chemin: "../",
  autre: { code: "fr", libelle: "FR", href: "../", nom: "Français" },
  meta: {
    titre: "Éric Bernier — PhD student in public health, ESPUM",
    description:
      "Éric Bernier, PhD student in public health (health systems, organisations and policy) at ESPUM, Université de Montréal, trained in law and special needs education. Research on intersectoral responses to complex social needs in primary care.",
  },
  ui: {
    evitement: "Skip to content",
    sousTitre: "Public health · Law · Social care",
    navigation: "Main navigation",
    langue: "Language",
    cv: "CV",
    hall: "The hall",
    suivante: "Next door",
    contact: "Get in touch",
    telecharger: "Download",
    pdf: "PDF",
    ouvrir: "Open",
    haut: "Back to top",
  },
  nav: [
    ["recherche", "Research"],
    ["publications", "Publications"],
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
      "Thesis co-supervised by Nadia Sourial and Géraldine Layani · GSK Research Chair in optimal management of chronic diseases · CRCHUM · FRQ doctoral scholar (B2)",
    visite: "Start the visit",
    explorer: "Browse freely",
    portrait: "Portrait of Éric Bernier",
  },
  hall: {
    titre: "The hall",
    compte: "4 doors",
    consigne: "Click a door to step in",
    portes: {
      recherche: ["Research", "Thesis, question, design"],
      publications: ["Publications", "Presentations, manuscripts, theses"],
      parcours: ["Background", "Practice, management, law, public health"],
      engagements: ["Engagement", "Representation, teaching, awards"],
    },
  },
  recherche: {
    surtitre: "01 · Research",
    titre: "Organising the intersectoral response to complex and co-occurring social needs in primary care",
    sousTitre: "Network configurations adapted to the different profiles of patients in care",
    question:
      "How is the intersectoral response organised for the different profiles of primary care patients with complex and co-occurring social needs?",
    but: "The project aims to link each needs profile to a configuration of partners and to its coordinator, at the scale of a CLSC territory (local community health and social services centre).",
    faits: [
      ["Programme", "PhD in public health, 2nd year · health systems, organisations and policy option · ESPUM"],
      ["Supervision", "Nadia Sourial and Géraldine Layani"],
      ["Setting", "GSK Research Chair in optimal management of chronic diseases · CRCHUM"],
      ["Timeline", "2026–2029 · protocol presentation on 27 October 2026"],
      ["Funding", "Fonds de recherche du Québec, doctoral scholarship (B2)"],
    ],
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
        ["Co-occurrence", "At least two social needs present at the same time. It is counted: it is the inclusion criterion."],
        ["Complexity", "The accumulation of chronic diseases, disabilities, mental health problems and social vulnerability. It is described, not required."],
        ["Intersectoral response", "Actions by sectors other than health, carried out with it: CLSC, family medicine groups, hospital, pharmacies, community organisations, municipality, schools, childcare centres. It is organised within a territory."],
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
    axes: {
      titre: "Research interests",
      items: [
        "Governance and evaluation of health policy",
        "Intersectoral approaches in primary care",
        "Ageing, loss of autonomy and ageing-in-place policies",
      ],
    },
  },
  publications: {
    surtitre: "02 · Publications",
    titre: "Presentations, manuscripts and theses",
    intro: "Each work keeps its original title, authors and status.",
    groupes: [
      {
        titre: "Scientific presentations",
        items: [
          { date: "June 2026", statut: "Best poster award · doctoral and postdoctoral", titre: "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative", detail: "Bernier, É., Sourial, N., Layani, G. · Groupe francophone en soins primaires (GFSP), Montréal · poster" },
          { date: "May 2026", statut: "Poster", titre: "Integrating Care and Services to Support Aging at Home: A Comparative Analysis of Institutional, Organizational, and Professional Mechanisms in France and Quebec", detail: "Bernier, É., Sourial, N., Layani, G. · CAHSPR, Ottawa" },
          { date: "April 2026", statut: "Poster and 180-second talk", titre: "Intégration des soins et services de proximité pour soutenir l’autonomie domiciliaire des personnes aînées : une étude qualitative comparative", detail: "Bernier, É., Sourial, N., Layani, G. · Quebec Network for Research on Aging (RQRV), Sherbrooke · poster and 180-second talk" },
        ],
      },
      {
        titre: "Manuscripts in preparation",
        items: [
          { date: "2026", titre: "Potentially avoidable hospitalisations and primary care: the role of patient experience across Commonwealth countries", detail: "Bernier, É., Algoët, A., Sourial, N., Layani, G., Vedel, I., Calafiore, M." },
          { date: "2026", titre: "Prise de parole des médecins dans l’espace public québécois lors des débats entourant le projet de loi n° 2 : une analyse qualitative du discours critique", detail: "Bernier, É., Aïssi, F., Diene Faye, C., Boukari Abdo, S." },
          { date: "2026", titre: "Vieillir chez soi à l’épreuve du droit : l’effectivité du choix du lieu de vie en droit français et en droit québécois", detail: "Bernier, É. · legal scholarship article" },
        ],
      },
      {
        titre: "Theses defended before a jury",
        items: [
          { date: "2025", titre: "Vieillir chez soi : réalités et mise en œuvre du virage domiciliaire. Une étude comparée France / Québec", detail: "Master of Laws · Université Paris Panthéon-Assas · supervisor: Benoît Apollis" },
          { date: "2024", titre: "La prise en charge des personnes en situation de handicap vieillissantes : comment les établissements d’hébergement pour personnes âgées dépendantes peuvent-ils adapter leurs structures et services à leurs besoins spécifiques ?", detail: "Master’s in health care facility management · Université de Bretagne Occidentale · supervisor: Michelle-Hentic Giliberto" },
          { date: "2023", titre: "Parcours de vie et autodétermination : l’influence des pratiques éducatives sur le parcours de vie des personnes en situation de handicap en institution d’hébergement", detail: "State diploma in special needs education · Académie de Rennes" },
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
  parcours: {
    surtitre: "03 · Background",
    titre: "From frontline practice to health policy",
    intro:
      "Supporting, organising, analysing, researching: several vantage points on the same services. Each step widened the starting question: how do services respond to people’s needs?",
    types: { formation: "Education", experience: "Experience" },
    etapes: [
      { date: "Since 2025", type: "formation", titre: "PhD in public health · ESPUM", detail: "Health systems, organisations and policy option, 2nd year. Research trainee at CRCHUM: primary care policy, intersectoral action and integration of care and services." },
      { date: "2024–2025", type: "experience", titre: "Project manager · French national agency for performance support (ANAP)", detail: "Paris. Supporting the transformation of health and social services, leading projects, producing decision-support tools, coordinating an expert network and communities of practice." },
      { date: "2025", type: "formation", titre: "Master of Laws (LL.M.)", detail: "Public law, social law and health law · Université Paris Panthéon-Assas, with special distinction from the jury." },
      { date: "2024", type: "formation", titre: "Master’s in health care facility management", detail: "Université de Bretagne Occidentale, with special distinction from the jury." },
      { date: "2024", type: "formation", titre: "University diploma in entrepreneurship and management", detail: "IAE Brest, with special distinction from the jury." },
      { date: "2016–2024", type: "experience", titre: "Respite stay manager", detail: "Adapted stays for people with disabilities, Brest: supervision, service projects, team, budget and logistics management." },
      { date: "2020–2023", type: "experience", titre: "Special needs educator", detail: "Residential home, Adapei 35, Saint-Malo: assessing needs, co-designing individual plans, coordinating a multidisciplinary team." },
      { date: "2023", type: "formation", titre: "State diploma in special needs education", detail: "Académie de Rennes." },
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
    surtitre: "04 · Engagement",
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
        titre: "Teaching and scientific community",
        items: [
          { date: "2026", titre: "Teaching assistant · ASA 6754", detail: "Health system and population health, Université de Montréal, winter and fall 2026: student support, grading of written and oral exams." },
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
  introuvable: { titre: "Page not found", texte: "This page does not exist or has moved.", retour: "Back to the home page" },
};

module.exports = { fr, en };
