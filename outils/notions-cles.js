"use strict";
module.exports = {
  references: require("./notions-references.json"),
  groupes: [
    ["autodetermination", "pouvoir", "participation", "equite"],
    ["faireavec", "coconstruction", "experientiels", "epistemique"],
    ["systemie", "intersectorialite", "integration", "implantation"],
    ["resilience", "reflexivite", "critique", "mobilisation"]
  ],
  appuis: {
    autodetermination: ["wehmeyer", "lachapelle", "ryan"],
    pouvoir: ["lebosse", "rappaport"], participation: ["arnstein", "carman"],
    equite: ["braveman", "bienetre"], faireavec: ["lebosse", "pomey"],
    coconstruction: ["jull", "redman"], experientiels: ["borkman", "pomey"],
    epistemique: ["fricker", "finlay"], systemie: ["systemes", "systemes2026"],
    intersectorialite: ["hiap", "desalvo"], integration: ["valentijn"],
    implantation: ["nilsen", "cfir"], resilience: ["masten", "ungar"],
    reflexivite: ["finlay"], critique: ["facione"], mobilisation: ["graham", "jull"]
  },
  langues: {
    fr: require("./notions/fr.json"), en: require("./notions/en.json"),
    es: require("./notions/es.json"), zh: require("./notions/zh.json"),
    ar: require("./notions/ar.json"), ru: require("./notions/ru.json")
  }
};
