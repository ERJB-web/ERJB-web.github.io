"use strict";
// Point d'entrée commun aux pages publiées et au générateur.
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const root = path.join(__dirname, "..");
const ressource = (prefixe, fichier) => prefixe + fichier + "?v=" + crypto.createHash("sha256").update(fs.readFileSync(path.join(root, fichier))).digest("hex").slice(0, 10);
const styles = (prefixe = "./") => ["assets/gabarit-salles.css", "assets/navigation-chapitres.css"].map(f => `<link rel="stylesheet" href="${ressource(prefixe, f)}">`).join("\n");
const scripts = (prefixe = "./") => ["assets/chapitres/catalogue.js", "assets/gabarit-salles.js"].map(f => `<script src="${ressource(prefixe, f)}" defer></script>`).join("\n");
const these = require("./chapitres-these.json");
const regrouperThese = (contenus, langue) => these.chapitres.map(({id, sources}, i) => [id, (these.titres[langue] || these.titres.fr)[i], sources.map(index => contenus[index]).join("\n")]);
module.exports = { styles, scripts, regrouperThese };
