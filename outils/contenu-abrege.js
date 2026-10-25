"use strict";
// Versions abrégées : facile à lire et à comprendre (FALC), inuktitut, innu-aimun.

const COURRIEL = "eric.bernier.1@umontreal.ca";

const falc = {
  titre: "Éric Bernier en facile à lire",
  description: "Qui est Éric Bernier, son travail et sa recherche, en facile à lire et à comprendre (FALC).",
  surtitre: "Facile à lire et à comprendre (FALC)",
  h1: "Bonjour, je suis Éric Bernier",
  ecouterTout: "Écouter toute la page",
  ecouter: "Écouter",
  blocs: [
    {
      icone: "personne",
      titre: "Qui je suis",
      phrases: [
        "Je m’appelle Éric Bernier.",
        "Je fais un doctorat en santé publique.",
        "Un doctorat, ce sont de longues études à l’université. On apprend à faire de la recherche.",
        "J’étudie à l’Université de Montréal, au Québec.",
        "2 professeures m’accompagnent dans ma recherche : Nadia Sourial et Géraldine Layani.",
      ],
    },
    {
      icone: "mallette",
      titre: "Mes métiers",
      phrases: [
        "J’ai travaillé comme éducateur spécialisé.",
        "J’aidais des adultes en situation de handicap, dans un foyer.",
        "Je suis aussi juriste. Un juriste connaît les lois et les droits des personnes.",
        "Je crée une entreprise : je suis aussi entrepreneur.",
        "Aujourd’hui, je fais de la recherche.",
      ],
    },
    {
      icone: "chemin",
      titre: "Mon chemin",
      phrases: [
        "J’ai quitté l’école à 16 ans.",
        "Plus tard, j’ai repris mes études.",
        "J’ai étudié la musique, l’éducation, la gestion et le droit.",
        "Chaque étape m’a appris quelque chose.",
      ],
    },
    {
      icone: "cartes",
      titre: "Les cartes de la vie",
      phrases: [
        "Notre vie a plusieurs parties.",
        "Par exemple : le logement, l’argent, les repas, la santé.",
        "Chaque carte montre une partie de la vie.",
        "Parfois, une personne a besoin d’aide pour 1 carte.",
        "Parfois, elle a besoin d’aide pour plusieurs cartes en même temps.",
      ],
      cartes: [
        ["maison", "Logement"],
        ["argent", "Argent"],
        ["repas", "Repas"],
        ["sante", "Santé"],
        ["mallette", "Travail"],
        ["famille", "Famille"],
        ["bus", "Transport"],
        ["papiers", "Papiers"],
        ["musique", "Loisirs"],
        ["bulles", "Amis"],
      ],
    },
    {
      icone: "loupe",
      titre: "Ma recherche",
      phrases: [
        "Je cherche à savoir qui aide les personnes qui ont besoin d’aide pour plusieurs cartes.",
        "Il y a le CLSC. Le CLSC est un centre de santé et de services sociaux, près de chez vous.",
        "Il y a aussi des organismes, la ville, les écoles et d’autres services.",
        "Je regarde comment ces services travaillent ensemble.",
        "Le but : que chaque personne reçoive la bonne aide, au bon moment.",
        "Mon sujet de recherche peut encore changer.",
      ],
      lien: ["Voir mon affiche en facile à lire", "https://erjb-web.github.io/affiche-releve/falc/"],
    },
    {
      icone: "coeur",
      titre: "Ce qui compte pour moi",
      phrases: [
        "Chaque personne a des droits.",
        "Chaque personne peut faire ses propres choix.",
        "Il faut écouter les personnes qui vivent les difficultés.",
        "Les chercheurs, les services et les personnes doivent travailler ensemble.",
      ],
    },
    {
      icone: "enveloppe",
      titre: "Me contacter",
      phrases: ["Vous pouvez m’écrire un courriel.", "Vous pouvez demander à quelqu’un de vous aider à écrire."],
      courriel: COURRIEL,
    },
    {
      icone: "info",
      titre: "À propos de cette page",
      phrases: [
        "Cette page est écrite en FALC.",
        "FALC veut dire : facile à lire et à comprendre.",
        "Les cartes de la vie viennent d’un outil qui s’appelle ELADEB.",
        "ELADEB aide une personne à dire ses difficultés et ses besoins.",
        "Les dessins de cette page ont été faits pour ce site.",
        "Vous pouvez écouter chaque partie avec le bouton Écouter.",
      ],
      lien: ["Voir le site complet", "../"],
    },
  ],
};

// Inuktitut et innu-aimun : salutation dans la langue, présentation en français et en anglais.
const presentation = {
  fr: [
    "Je m’appelle Éric Bernier. Je suis doctorant en santé publique à l’École de santé publique de l’Université de Montréal (ESPUM) et au Centre de recherche du CHUM (CRCHUM).",
    "Ma recherche porte sur la façon dont les services de santé, les services sociaux et les organismes de la communauté s’organisent ensemble pour accompagner les personnes qui vivent plusieurs difficultés en même temps. Le sujet est provisoire.",
    "Mes partenariats suivent quatre principes : respect, pertinence, réciprocité et responsabilité.",
  ],
  en: [
    "My name is Éric Bernier. I am a PhD student in public health at the School of Public Health of Université de Montréal (ESPUM) and at the CHUM Research Centre (CRCHUM).",
    "My research looks at how health services, social services and community organisations work together to support people facing several difficulties at the same time. The topic is provisional.",
    "My partnerships follow four principles: respect, relevance, reciprocity and responsibility.",
  ],
};

const iu = {
  titre: "ᑐᙵᓱᒋᑦ · Éric Bernier",
  description: "Éric Bernier, doctorant en santé publique · PhD student in public health",
  salutation: ["ᑐᙵᓱᒋᑦ", "Tunngasugit", "Bienvenue · Welcome"],
  merci: ["ᓇᑯᕐᒦᒃ", "Nakurmiik", "Merci · Thank you"],
  avis: {
    fr: "Cette page présente l’essentiel. La version complète en inuktitut sera préparée avec une personne locutrice : je ne publie pas de traduction automatique dans cette langue.",
    en: "This page gives the essentials. The full Inuktitut version will be prepared with a fluent speaker: I do not publish machine translation in this language.",
  },
};

const innu = {
  titre: "Kuei · Éric Bernier",
  description: "Éric Bernier, doctorant en santé publique · PhD student in public health",
  salutation: ["Kuei !", "", "Bonjour · Hello"],
  merci: ["Tshinashkumitin", "", "Merci · Thank you"],
  avis: {
    fr: "Cette page présente l’essentiel. La version complète en innu-aimun sera préparée avec une personne locutrice : je ne publie pas de traduction automatique dans cette langue.",
    en: "This page gives the essentials. The full Innu-aimun version will be prepared with a fluent speaker: I do not publish machine translation in this language.",
  },
};

const liensCommuns = {
  fr: [
    ["Site complet en français", "../"],
    ["Affiche du projet de thèse", "https://erjb-web.github.io/affiche-releve/"],
    ["Version facile à lire (FALC)", "../falc/"],
  ],
  en: [
    ["Full site in English", "../en/"],
    ["Thesis project poster", "https://erjb-web.github.io/affiche-releve/en/"],
  ],
};

module.exports = { falc, iu, innu, presentation, liensCommuns, COURRIEL };
