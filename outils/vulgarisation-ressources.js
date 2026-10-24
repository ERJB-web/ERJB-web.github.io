"use strict";
// Ressources et exemples éditoriaux ; aucun résultat de recherche personnel n’est simulé.
module.exports = {
 references: {
  "publics": {
    "court": "National Academies (2017)",
    "citation": "National Academies of Sciences, Engineering, and Medicine. (2017). Communicating science effectively: A research agenda. The National Academies Press.",
    "href": "https://doi.org/10.17226/23674"
  },
  "clarte": {
    "court": "CDC · Clear Communication Index",
    "citation": "Centers for Disease Control and Prevention. (n.d.). How to use the Index. The CDC Clear Communication Index.",
    "href": "https://www.cdc.gov/ccindex/tool/how-to-use.html"
  },
  "dialogue": {
    "court": "NCCPE · Public engagement",
    "citation": "National Co-ordinating Centre for Public Engagement. (n.d.). A quick guide to developing high quality public engagement.",
    "href": "https://www.publicengagement.ac.uk/resources/guide/quick-guide-developing-high-quality-public-engagement"
  },
  "incertitude": {
    "court": "van der Bles et al. (2020)",
    "citation": "van der Bles, A. M., van der Linden, S., Freeman, A. L. J., & Spiegelhalter, D. J. (2020). The effects of communicating uncertainty on public trust in facts and numbers. Proceedings of the National Academy of Sciences, 117(14), 7672–7683.",
    "href": "https://doi.org/10.1073/pnas.1913678117"
  },
  "accessibilite": {
    "court": "W3C · Accessible media",
    "citation": "World Wide Web Consortium, Web Accessibility Initiative. (n.d.). Making audio and video media accessible.",
    "href": "https://www.w3.org/WAI/media/av/"
  },
  "evaluation": {
    "court": "NCCPE · Evaluation",
    "citation": "National Co-ordinating Centre for Public Engagement. (2023, August 14). How to evaluate public engagement projects and programmes.",
    "href": "https://www.publicengagement.ac.uk/resources/guide/how-evaluate-public-engagement-projects-and-programmes"
  },
  "social": {
    "court": "NCCPE (2018) · Social media",
    "citation": "National Co-ordinating Centre for Public Engagement. (2018). What works: Engaging the public through social media.",
    "href": "https://www.publicengagement.ac.uk/sites/default/files/2023-08/what_works_engaging_the_public_through_social_media_november_2018.pdf"
  },
  "cochrane": {
    "court": "Schünemann et al. (2024) · Cochrane",
    "citation": "Schünemann, H. J., Vist, G. E., Higgins, J. P. T., Santesso, N., Deeks, J. J., Glasziou, P., Akl, E. A., & Guyatt, G. H. (2024). Chapter 15: Interpreting results and drawing conclusions. In J. P. T. Higgins, J. Thomas, J. Chandler, M. Cumpston, T. Li, M. J. Page, & V. A. Welch (Eds.), Cochrane handbook for systematic reviews of interventions (Version 6.5). Cochrane.",
    "href": "https://training.cochrane.org/handbook/current/chapter-15"
  },
  "images": {
    "court": "W3C · Images tutorial",
    "citation": "World Wide Web Consortium, Web Accessibility Initiative. (n.d.). Images tutorial.",
    "href": "https://www.w3.org/WAI/tutorials/images/"
  },
  "ethique": {
    "court": "WHO (2025) · Social listening",
    "citation": "World Health Organization. (2025). Social listening in infodemic management for public health emergencies: Guidance on ethical considerations.",
    "href": "https://www.who.int/publications/i/item/9789240108202"
  },
  "scienceouverte": {
    "court": "UNESCO (2021) · Open science",
    "citation": "UNESCO. (2021). UNESCO recommendation on open science.",
    "href": "https://www.unesco.org/en/open-science/about"
  }
},
 langues: Object.fromEntries(["fr", "en", "es", "zh", "ar", "ru"].map(code => [code, require("./vulgarisation/" + code + ".json")]))
};
