// Data-driven doctoral game: simulated paths, not official university policies.
export const milestones=[
 {
  "id": "admission",
  "title": "Candidature et sélection",
  "kind": "admin",
  "station": "Administration",
  "requires": [],
  "year": 1,
  "priority": "main",
  "weeks": 2
 },
 {
  "id": "motivation",
  "title": "Entretien d'admission et motivation",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "admission"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "supervision",
  "title": "Choix d'une direction de recherche",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "admission"
  ],
  "year": 1,
  "priority": "main",
  "weeks": 2
 },
 {
  "id": "agreement",
  "title": "Entente de direction et attentes",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "supervision"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "registration",
  "title": "Inscription et règlement de programme",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "admission"
  ],
  "year": 1,
  "priority": "main",
  "weeks": 3
 },
 {
  "id": "financialPlan",
  "title": "Plan de financement de quatre ans",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "bursarySearch",
  "title": "Veille des concours de bourses",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 4
 },
 {
  "id": "bursary1",
  "title": "Demande de bourse provinciale",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "motivation"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "bursary2",
  "title": "Demande de bourse fédérale",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "motivation"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "assistantship",
  "title": "Auxiliariat de recherche",
  "kind": "work",
  "station": "Emploi du temps",
  "requires": [
   "supervision"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "teaching",
  "title": "Auxiliariat d'enseignement",
  "kind": "work",
  "station": "Emploi du temps",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "statisticsCourse",
  "title": "Cours de biostatistique",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "epidemiologyCourse",
  "title": "Cours d'épidémiologie",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "qualitativeCourse",
  "title": "Séminaire qualitatif et épistémologique",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "implementationCourse",
  "title": "Formation en science de l'implantation",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "ethicsCourse",
  "title": "Formation en éthique de recherche",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "referenceManager",
  "title": "Constituer la bibliothèque numérique",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "registration"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "conceptWorkshop",
  "title": "Atelier de conceptualisation",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "referenceManager"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "researchGroup",
  "title": "Entrer dans une équipe de recherche",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "supervision"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "publicHealthProblem",
  "title": "Définir un problème de santé publique",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "conceptWorkshop"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 4
 },
 {
  "id": "doctoralSeminar",
  "title": "Premier séminaire doctoral",
  "kind": "exam",
  "station": "Salle d'examens",
  "requires": [
   "publicHealthProblem"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "scopingReview",
  "title": "Revue de portée préliminaire",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "conceptWorkshop"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "duplicateDiscovery",
  "title": "Découverte d'une thèse déjà publiée",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "scopingReview"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "researchGap",
  "title": "Documenter une lacune démontrable",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "duplicateDiscovery"
  ],
  "year": 1,
  "priority": "main",
  "weeks": 2
 },
 {
  "id": "initialObjectives",
  "title": "Définir les objectifs exploratoires",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchGap"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "credits",
  "title": "Valider les crédits obligatoires",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "statisticsCourse",
   "epidemiologyCourse"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "examPreparation",
  "title": "Préparation examen de synthèse",
  "kind": "course",
  "station": "École doctorale",
  "requires": [
   "credits"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "comprehensiveExam",
  "title": "Examen doctoral de synthèse",
  "kind": "exam",
  "station": "Salle d'examens",
  "requires": [
   "examPreparation"
  ],
  "year": 1,
  "priority": "main",
  "weeks": 1
 },
 {
  "id": "firstPortfolio",
  "title": "Dossier de progression annuelle",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "comprehensiveExam"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "annualMeeting1",
  "title": "Rencontre de bilan avec la direction",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "firstPortfolio"
  ],
  "year": 1,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "scholarshipRenewal",
  "title": "Candidatures de bourses renouvelées",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "firstPortfolio"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "framework",
  "title": "Construction du cadre théorique",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "researchGap"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "paradigm",
  "title": "Choisir le paradigme et justifier ses présupposés",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "framework"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "researchQuestion",
  "title": "Arrêter une question centrale",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "initialObjectives",
   "paradigm"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "objectives",
  "title": "Arbitrer entre deux, trois, quatre ou six objectifs",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchQuestion"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "qualOption",
  "title": "Explorer les devis qualitatifs",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchQuestion"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "epiOption",
  "title": "Explorer les devis épidémiologiques",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchQuestion"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 4
 },
 {
  "id": "mixedOption",
  "title": "Explorer l'articulation des méthodes mixtes",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchQuestion"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "researchDesign",
  "title": "Verrouiller le devis de recherche",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "objectives"
  ],
  "year": 2,
  "priority": "main",
  "weeks": 3
 },
 {
  "id": "population",
  "title": "Définir population et unité d'analyse",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchDesign"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "sites",
  "title": "Choisir les établissements et territoires",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "population"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "sampling",
  "title": "Définir l'échantillonnage",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "population"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "sampleSize",
  "title": "Justifier la taille et la suffisance",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "sampling"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "variables",
  "title": "Opérationnaliser concepts et indicateurs",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchDesign"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "analysisPlan",
  "title": "Construire le plan d'analyse",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "variables"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "qualRigor",
  "title": "Critères de rigueur qualitative",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "researchDesign"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "biases",
  "title": "Biais, confusion, sélection et mesures",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "analysisPlan"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "biostatReview",
  "title": "Faire relire le modèle statistique",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "analysisPlan"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "protocol",
  "title": "Rédiger le protocole complet",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "analysisPlan",
   "researchDesign"
  ],
  "year": 2,
  "priority": "main",
  "weeks": 2
 },
 {
  "id": "supervisorRevision",
  "title": "Corriger avec la direction",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "protocol"
  ],
  "year": 2,
  "priority": "main",
  "weeks": 4
 },
 {
  "id": "stakeholders",
  "title": "Discuter les besoins des partenaires",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "protocol"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "siteAuthorization",
  "title": "Conclure les accords de terrain",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "supervisorRevision"
  ],
  "year": 2,
  "priority": "main",
  "weeks": 3
 },
 {
  "id": "dataContracts",
  "title": "Obtenir les accès aux données",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "siteAuthorization"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "consent",
  "title": "Préparer les consentements et outils",
  "kind": "ethics",
  "station": "Comité d'éthique",
  "requires": [
   "protocol"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "privacy",
  "title": "Confidentialité et réidentification",
  "kind": "ethics",
  "station": "Comité d'éthique",
  "requires": [
   "consent"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "ethicsSubmission",
  "title": "Soumettre au comité d'éthique",
  "kind": "ethics",
  "station": "Comité d'éthique",
  "requires": [
   "privacy",
   "siteAuthorization"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "ethicsReplies",
  "title": "Répondre aux demandes de modifications",
  "kind": "ethics",
  "station": "Comité d'éthique",
  "requires": [
   "ethicsSubmission"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "ethicsApproved",
  "title": "Obtenir les approbations éthiques",
  "kind": "ethics",
  "station": "Comité d'éthique",
  "requires": [
   "ethicsReplies"
  ],
  "year": 2,
  "priority": "main",
  "weeks": 1
 },
 {
  "id": "committeeReview",
  "title": "Présenter le protocole au comité doctoral",
  "kind": "exam",
  "station": "Salle d'examens",
  "requires": [
   "supervisorRevision",
   "ethicsSubmission"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "annualMeeting2",
  "title": "Bilan de deuxième année",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "committeeReview"
  ],
  "year": 2,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "fundingField",
  "title": "Financer le travail de terrain",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "annualMeeting2"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "recruitmentPlan",
  "title": "Organiser le recrutement",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "ethicsApproved"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "pilotInterview",
  "title": "Prétester les guides d'entretien",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruitmentPlan"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "pilotSurvey",
  "title": "Piloter un questionnaire",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruitmentPlan"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "pilotData",
  "title": "Tester extraction et dictionnaire de données",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "dataContracts"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "reviseSample",
  "title": "Adapter les critères d'échantillonnage",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "recruitmentPlan"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "recruit",
  "title": "Recruter les participants",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruitmentPlan"
  ],
  "year": 3,
  "priority": "main",
  "weeks": 4
 },
 {
  "id": "fieldLog",
  "title": "Documenter le journal de terrain",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "interview",
  "title": "Réaliser les entretiens",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "observations",
  "title": "Conduire des observations",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "survey",
  "title": "Collecter des questionnaires",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "extract",
  "title": "Extraire des données administratives",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "dataContracts"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "networkDefinition",
  "title": "Définir frontières et liens du réseau",
  "kind": "design",
  "station": "Laboratoire des méthodes",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "networkData",
  "title": "Collecter les relations interorganisationnelles",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "networkDefinition"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "resourceInventory",
  "title": "Inventorier les ressources territoriales",
  "kind": "field",
  "station": "Terrain",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "qualityAudit",
  "title": "Vérifier la qualité et les données manquantes",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "recruit"
  ],
  "year": 3,
  "priority": "main",
  "weeks": 2
 },
 {
  "id": "codebook",
  "title": "Constituer le codebook",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "qualityAudit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "coding",
  "title": "Coder entretiens et documents",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "codebook"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "statistics",
  "title": "Estimer les modèles et leurs incertitudes",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "codebook"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "networkAnalysis",
  "title": "Analyser les réseaux sociaux",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "codebook"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 4
 },
 {
  "id": "spatialAnalysis",
  "title": "Réaliser la cartographie spatiale",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "codebook"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "triangulation",
  "title": "Intégrer les sources et les perspectives",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "codebook"
  ],
  "year": 3,
  "priority": "main",
  "weeks": 3
 },
 {
  "id": "negativeCases",
  "title": "Chercher les cas négatifs",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "triangulation"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "sensitivity",
  "title": "Réaliser des analyses de sensibilité",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "triangulation"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "article1Plan",
  "title": "Délimiter une première contribution",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "triangulation"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "article1Draft",
  "title": "Rédiger le premier article",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "article1Plan"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "coauthors",
  "title": "Accorder la contribution des auteurs",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "article1Draft"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "article1Submit",
  "title": "Soumettre le premier article",
  "kind": "publication",
  "station": "Publications",
  "requires": [
   "article1Draft"
  ],
  "year": 3,
  "priority": "main",
  "weeks": 1
 },
 {
  "id": "congress",
  "title": "Présenter des résultats au congrès",
  "kind": "publication",
  "station": "Publications",
  "requires": [
   "triangulation"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "annualMeeting3",
  "title": "Évaluer le calendrier et le financement",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "article1Submit"
  ],
  "year": 3,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "review1",
  "title": "Répondre au Reviewer 2",
  "kind": "publication",
  "station": "Publications",
  "requires": [
   "article1Submit"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "article1Revision",
  "title": "Réviser le premier manuscrit",
  "kind": "publication",
  "station": "Publications",
  "requires": [
   "review1"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "article2Plan",
  "title": "Définir le deuxième article",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "triangulation"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "article2Draft",
  "title": "Rédiger le deuxième article",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "article2Plan"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "article2Submit",
  "title": "Soumettre le deuxième article",
  "kind": "publication",
  "station": "Publications",
  "requires": [
   "article2Draft"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "article3Plan",
  "title": "Définir le troisième article",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "triangulation"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "article3Draft",
  "title": "Rédiger le troisième article",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "article3Plan"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 4
 },
 {
  "id": "article3Submit",
  "title": "Soumettre le troisième article",
  "kind": "publication",
  "station": "Publications",
  "requires": [
   "article3Draft"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "formatDecision",
  "title": "Vérifier le format de thèse autorisé",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "article1Submit"
  ],
  "year": 4,
  "priority": "main",
  "weeks": 3
 },
 {
  "id": "thesisIntro",
  "title": "Rédiger l'introduction de la thèse",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "formatDecision"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "methodSynthesis",
  "title": "Rédiger la synthèse méthodologique",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "thesisIntro"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "overallDiscussion",
  "title": "Synthétiser les contributions",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "methodSynthesis"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "limitations",
  "title": "Expliquer les limites et transferts",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "overallDiscussion"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "originality",
  "title": "Expliciter la contribution originale",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "limitations"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "partnerFeedback",
  "title": "Prévoir la restitution des résultats",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "originality"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 1
 },
 {
  "id": "ethicsClose",
  "title": "Clôture des obligations éthiques",
  "kind": "ethics",
  "station": "Comité d'éthique",
  "requires": [
   "triangulation"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "archive",
  "title": "Archivage sécurisé et documentation des analyses",
  "kind": "analysis",
  "station": "Laboratoire des analyses",
  "requires": [
   "ethicsClose"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "lastScholarship",
  "title": "Trouver le financement de dernière année",
  "kind": "funding",
  "station": "Bourses et finances",
  "requires": [
   "annualMeeting3"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "finalSupervision",
  "title": "Accorder les demandes de la direction",
  "kind": "social",
  "station": "Direction & partenariats",
  "requires": [
   "originality"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "figures",
  "title": "Rendre les figures et tableaux publiables",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "finalSupervision"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 4
 },
 {
  "id": "referenceAudit",
  "title": "Vérifier chaque référence bibliographique",
  "kind": "literature",
  "station": "Bibliothèque",
  "requires": [
   "figures"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "rulesAudit",
  "title": "Vérifier le règlement de dépôt",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "figures"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "thesisSubmit",
  "title": "Déposer la thèse",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "rulesAudit"
  ],
  "year": 4,
  "priority": "main",
  "weeks": 1
 },
 {
  "id": "preDefense",
  "title": "Effectuer la soutenance blanche",
  "kind": "exam",
  "station": "Salle d'examens",
  "requires": [
   "thesisSubmit"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "jury",
  "title": "Organiser la composition du jury",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "thesisSubmit"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "presentation",
  "title": "Construire la présentation de soutenance",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "preDefense"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 3
 },
 {
  "id": "objections",
  "title": "Préparer les objections du jury",
  "kind": "exam",
  "station": "Salle d'examens",
  "requires": [
   "preDefense"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "defense",
  "title": "Défendre la thèse",
  "kind": "defense",
  "station": "Grand amphithéâtre",
  "requires": [
   "objections",
   "jury",
   "presentation"
  ],
  "year": 4,
  "priority": "main",
  "weeks": 1
 },
 {
  "id": "corrections",
  "title": "Effectuer les corrections demandées",
  "kind": "writing",
  "station": "Atelier de rédaction",
  "requires": [
   "defense"
  ],
  "year": 4,
  "priority": "side",
  "weeks": 2
 },
 {
  "id": "deposit",
  "title": "Déposer le manuscrit final",
  "kind": "admin",
  "station": "Administration",
  "requires": [
   "corrections"
  ],
  "year": 4,
  "priority": "main",
  "weeks": 3
 }
];
export const methodology={
 "families": [
  {
   "id": "qual",
   "name": "Qualitative",
   "paradigms": [
    "constructiviste",
    "interprétatif",
    "critique",
    "pragmatique"
   ],
   "designs": [
    "étude de cas unique",
    "étude de cas multiples",
    "phénoménologie",
    "théorie ancrée",
    "ethnographie",
    "recherche qualitative descriptive",
    "recherche-action participative",
    "analyse narrative",
    "ethnographie institutionnelle",
    "étude de processus"
   ],
   "data": [
    "entretiens",
    "observations",
    "documents",
    "ateliers",
    "journaux de terrain"
   ],
   "analysis": [
    "analyse thématique",
    "analyse de contenu",
    "comparaison constante",
    "analyse de cadres",
    "analyse narrative",
    "analyse de discours"
   ]
  },
  {
   "id": "quant",
   "name": "Quantitative / épidémiologie",
   "paradigms": [
    "postpositiviste",
    "pragmatique"
   ],
   "designs": [
    "étude transversale",
    "cohorte prospective",
    "cohorte rétrospective",
    "cas-témoins",
    "essai randomisé contrôlé",
    "essai pragmatique",
    "étude quasi expérimentale",
    "série temporelle interrompue",
    "différence-en-différences",
    "régression sur discontinuité",
    "étude écologique",
    "enquête longitudinale",
    "cas-croisés",
    "étude prédictive",
    "évaluation économique"
   ],
   "data": [
    "questionnaire",
    "cohorte",
    "données administratives",
    "registre",
    "mesures cliniques",
    "données géographiques"
   ],
   "analysis": [
    "régression linéaire",
    "régression logistique",
    "modèles multiniveaux",
    "analyse de survie",
    "modèles mixtes",
    "score de propension",
    "série temporelle",
    "modèles de comptage",
    "analyse factorielle",
    "modélisation spatiale",
    "analyse de réseaux"
   ]
  },
  {
   "id": "mixed",
   "name": "Mixte",
   "paradigms": [
    "pragmatique",
    "réalisme critique",
    "transformateur"
   ],
   "designs": [
    "convergent parallèle",
    "séquentiel explicatif",
    "séquentiel exploratoire",
    "imbriqué",
    "multiphase",
    "étude de cas mixte",
    "évaluation réaliste mixte"
   ],
   "data": [
    "entretiens et questionnaire",
    "données administratives et entretiens",
    "observations et mesures",
    "SIG et entretiens",
    "réseaux et entretiens"
   ],
   "analysis": [
    "triangulation",
    "joint display",
    "intégration séquentielle",
    "méta-inférences",
    "comparaison de cas",
    "analyse multiniveau intégrée"
   ]
  },
  {
   "id": "reviews",
   "name": "Synthèse des connaissances",
   "paradigms": [
    "pragmatique",
    "postpositiviste",
    "interprétatif"
   ],
   "designs": [
    "revue systématique",
    "méta-analyse",
    "revue de portée",
    "revue réaliste",
    "revue intégrative",
    "méta-ethnographie",
    "umbrella review",
    "revue rapide"
   ],
   "data": [
    "bases bibliographiques",
    "littérature grise",
    "documents publics"
   ],
   "analysis": [
    "synthèse narrative",
    "méta-analyse",
    "synthèse thématique",
    "méta-ethnographie",
    "analyse de contenu",
    "cartographie des lacunes"
   ]
  }
 ],
 "themes": [
  "Relations interorganisationnelles",
  "Besoins sociaux concomitants",
  "Inégalités d'accès",
  "Qualité des soins primaires",
  "Parcours des personnes aînées",
  "Intervention communautaire",
  "Santé mentale",
  "Hospitalisations évitables",
  "Transformation des organisations",
  "Politiques publiques",
  "Participation des usagers",
  "Conception des services",
  "Éthique des données",
  "Vieillissement à domicile"
 ],
 "populations": [
  "Personnes aînées à domicile",
  "Usagers des soins primaires",
  "Professionnels de santé",
  "Organisations communautaires",
  "Population générale",
  "Aidants proches",
  "Patients avec conditions chroniques",
  "Équipes intersectorielles",
  "Personnes en situation de vulnérabilité",
  "Territoires et organisations"
 ],
 "settings": [
  "un établissement",
  "deux territoires contrastés",
  "plusieurs sites",
  "une province",
  "plusieurs provinces",
  "comparaison internationale"
 ],
 "sampling": [
  "raisonné",
  "variation maximale",
  "boule de neige",
  "théorique",
  "probabiliste aléatoire",
  "stratifié",
  "en grappes",
  "exhaustif",
  "de convenance",
  "apparié"
 ],
 "formats": [
  "Thèse par articles",
  "Monographie"
 ],
 "count": [
  1,
  2,
  3,
  4,
  5,
  6
 ],
 "articleTargets": [
  2,
  3,
  4
 ]
};

export function initialCareerState(){
 return {version:1,week:0,budget:45,energy:85,stress:12,rigor:32,trust:48,proof:0,completed:[],attempts:{},journal:[],family:"mixed",design:"séquentiel exploratoire",data:"données administratives et entretiens",analysis:"intégration séquentielle",paradigm:"pragmatique",theme:"Relations interorganisationnelles",population:"Personnes aînées à domicile",setting:"deux territoires contrastés",sampling:"raisonné",objectives:4,format:"Thèse par articles",articleTarget:3,novelty:false,access:false,articles:0,approved:false,ending:null,repairs:0};
}
export function availableMilestones(st){const complete=new Set(st.completed);return milestones.filter(t=>!complete.has(t.id)&&t.requires.every(k=>complete.has(k)));}
export function assessDesign(st){
 const fam=methodology.families.find(f=>f.id===st.family);const blockers=[],warnings=[];
 if(!fam||!fam.designs.includes(st.design)||!fam.data.includes(st.data)||!fam.analysis.includes(st.analysis)||!fam.paradigms.includes(st.paradigm))blockers.push("Le paradigme, le devis, les données et les analyses doivent être articulés.");
 if(st.objectives>=6)blockers.push("Six objectifs substantiels dépassent le calendrier doctoral fictif de quatre ans.");
 else if(st.objectives>=5)warnings.push("Cinq objectifs demandent une justification des moyens et du calendrier.");
 if(/essai randomisé|essai pragmatique/.test(st.design)&&st.budget<80)blockers.push("L'essai nécessiterait un financement et une équipe qui ne sont pas disponibles.");
 if(st.setting==="comparaison internationale"&&st.objectives>=4)blockers.push("Le cumul d'objectifs et de terrains internationaux dépasse le périmètre prévu.");
 if(st.family==="quant"&&st.analysis==="analyse de survie"&&st.data==="questionnaire")warnings.push("Vérifier un suivi temporel permettant une analyse de survie.");
 if(st.family==="qual"&&st.sampling==="probabiliste aléatoire")warnings.push("Justifier l'échantillonnage au regard de la logique qualitative.");
 if(!st.novelty)warnings.push("Démontrer une lacune face aux études déjà publiées.");
 if(!st.access)warnings.push("La permission de recruter ou d'utiliser les données reste à établir.");
 if(st.format==="Thèse par articles"&&st.articleTarget<3)warnings.push("Confirmer le nombre de manuscrits demandé dans le règlement fictif retenu.");
 return {blockers,warnings,score:Math.max(0,100-28*blockers.length-7*warnings.length),valid:blockers.length===0};
}
export function checkDefense(st){
 const needed=["admission","supervision","registration","comprehensiveExam","researchGap","researchDesign","protocol","ethicsApproved","recruit","qualityAudit","triangulation","thesisSubmit","preDefense","jury"];
 const completed=new Set(st.completed),missing=needed.filter(x=>!completed.has(x));const evalDesign=assessDesign(st);
 if(!evalDesign.valid)missing.push("devis cohérent");
 if(!st.novelty)missing.push("originalité scientifique non démontrée");
 if(!st.access)missing.push("données ou autorisations non confirmées");
 if(st.format==="Thèse par articles"&&st.articles<st.articleTarget)missing.push("manuscrits exigés dans la simulation");
 if(st.trust<28)missing.push("accord de la direction");
 if(st.week>208)missing.push("délai des quatre années dépassé (prolongation nécessaire)");
 if(st.energy<10||st.stress>92)missing.push("conditions de soutenance incompatibles avec l'état du personnage");
 return {ready:missing.length===0,missing,evalDesign};
}
