"use strict";
module.exports = {
  references: {
    foucault: {court:"Foucault (1982)",citation:"Foucault, M. (1982). The subject and power. Critical Inquiry, 8(4), 777–795.",href:"https://doi.org/10.1086/448181"},
    fassin: {court:"Fassin (2018)",citation:"Fassin, D. (2018). La vie : mode d’emploi critique. Seuil.",href:"https://doi.org/10.3917/ls.fassi.2018.01"},
    hegel: {court:"Hegel (1807/2018)",citation:"Hegel, G. W. F. (2018). The phenomenology of spirit (T. Pinkard, Trans.). Cambridge University Press. (Original work published 1807).",href:"https://www.cambridge.org/core/books/georg-wilhelm-friedrich-hegel-the-phenomenology-of-spirit/6FEDB42FDEF2E5FF97FEAE0EEEDABE8E"},
    camus: {court:"Camus (1951/1985)",citation:"Camus, A. (1985). L’Homme révolté. Gallimard. (Œuvre originale publiée en 1951).",href:"https://www.cercle-enseignement.com/Ouvrages/Gallimard/Folio-essais/L-Homme-revolte"},
    sartre: {court:"Sartre (1946/1996)",citation:"Sartre, J.-P. (1996). L’existentialisme est un humanisme. Gallimard. (Œuvre originale publiée en 1946).",href:"https://www.cercle-enseignement.com/Ouvrages/Gallimard/Folio-essais/L-existentialisme-est-un-humanisme"},
    dewey: {court:"Dewey (1927)",citation:"Dewey, J. (1927). The public and its problems. Henry Holt and Company.",href:"https://www.gutenberg.org/ebooks/71000"},
    ricoeur: {court:"Ricœur (1990)",citation:"Ricœur, P. (1990). Soi-même comme un autre. Seuil.",href:"https://catalogue.bnf.fr/ark:/12148/cb35071032c"},
    sen: {court:"Sen (1999)",citation:"Sen, A. (1999). Development as freedom. Oxford University Press.",href:"https://india.oup.com/product/development-as-freedom-9780195655261"},
    fricker: {court:"Fricker (2007)",citation:"Fricker, M. (2007). Epistemic injustice: Power and the ethics of knowing. Oxford University Press.",href:"https://doi.org/10.1093/acprof:oso/9780198237907.001.0001"}
  },
  langues: Object.fromEntries(["fr","en","es","zh","ar","ru"].map(code=>[code,require("./posture/"+code+".json")]))
};
