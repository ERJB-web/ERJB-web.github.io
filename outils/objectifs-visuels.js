"use strict";
// Schémas de principe et textes existants des trois objectifs de la thèse.
const objectifs = [
  {
    "code": "O1",
    "titre": "Décrire les profils",
    "question": "Quels besoins se cumulent ?",
    "livrable": "Une typologie des profils",
    "chips": [
      "Besoins satisfaits ou non",
      "Vignettes"
    ],
    "utilite": "Repérer les combinaisons qui reviennent pour organiser la réponse autour d’elles.",
    "graph": "<svg viewBox=\"0 0 300 116\" role=\"img\" aria-label=\"Des besoins concomitants sont regroupés en profils\"><g fill=\"#e8f3df\" stroke=\"#7fae62\" stroke-width=\"1.5\"><rect x=\"8\" y=\"13\" width=\"94\" height=\"25\" rx=\"12\"/><rect x=\"8\" y=\"46\" width=\"94\" height=\"25\" rx=\"12\"/><rect x=\"8\" y=\"79\" width=\"94\" height=\"25\" rx=\"12\"/></g><g fill=\"#315e23\" font-size=\"12\" text-anchor=\"middle\"><text x=\"55\" y=\"30\">Besoin A</text><text x=\"55\" y=\"63\">Besoin B</text><text x=\"55\" y=\"96\">Besoin C</text></g><path d=\"M108 25h14v66h-14m14-33h37m-7-6 7 6-7 6\" fill=\"none\" stroke=\"#4c8234\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"173\" y=\"22\" width=\"116\" height=\"73\" rx=\"12\" fill=\"#fff\" stroke=\"#79a75d\" stroke-width=\"1.7\"/><circle cx=\"194\" cy=\"43\" r=\"6\" fill=\"#579637\"/><path d=\"M186 61v-4c0-6 16-6 16 0v4\" fill=\"#579637\"/><path d=\"M214 39h57m-57 10h43m-30 23h43m-43 9h32\" stroke=\"#b6cca8\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"194\" y=\"85\" text-anchor=\"middle\" fill=\"#315e23\" font-size=\"11\">Profil</text></svg>",
    "detail": "<p style=\"margin:10px 0 2px;font-size:.8em;letter-spacing:.06em;text-transform:uppercase\"><strong>1 · Objectif</strong></p><p class=\"these-formulation\">Identifier les différents types de profils de besoins sociaux concomitants chez les personnes aînées ayant des facteurs de morbidités ou comorbidités pris en charge dans les services à domicile (CLSC).</p><p style=\"margin:10px 0 2px;font-size:.8em;letter-spacing:.06em;text-transform:uppercase\"><strong>2 · Produit final</strong></p><p class=\"note these-produit\"><strong>Produit final :</strong> une typologie des profils de besoins sociaux concomitants, satisfaits ou non, traduite en vignettes. <strong>Ce que ça donne :</strong> savoir quelles combinaisons de besoins reviennent le plus, pour organiser la réponse autour d’elles.</p>",
    "button": "<button class=\"these-renvoi ov-methode\" type=\"button\" data-these-vers=\"methodes\" data-these-objectif=\"O1\">Voir la méthode associée <span aria-hidden=\"true\">↗</span></button>",
    "lacune": "Les recherches montrent que les besoins sociaux peuvent se cumuler et former des profils distincts, y compris parmi les patients de soins primaires. Toutefois, les études mobilisent des populations et des outils de mesure hétérogènes et documentent inégalement le caractère satisfait ou non des besoins, leur concomitance et leur articulation aux morbidités. Les synthèses repérées ne permettent pas encore de caractériser précisément ces configurations chez les personnes aînées suivies en soutien à domicile, ni de déterminer quels profils devraient orienter l’organisation de la réponse intersectorielle.",
    "references": [
      [
        "Kreuter et al., 2021",
        "https://doi.org/10.1089/pop.2020.0107"
      ],
      [
        "Vest et al., 2025",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC12096377/"
      ]
    ],
    "formulation": "Identifier les différents types de profils de besoins sociaux concomitants chez les personnes aînées ayant des facteurs de morbidités ou comorbidités pris en charge dans les services à domicile (CLSC)."
  },
  {
    "code": "O2",
    "titre": "Repérer les ressources",
    "question": "Où la réponse existe-t-elle ?",
    "livrable": "Un atlas par territoire de CLSC",
    "chips": [
      "Matrice besoins × ressources",
      "Indice d’écart"
    ],
    "utilite": "Repérer les réponses présentes, absentes, inaccessibles ou saturées.",
    "graph": "<svg viewBox=\"0 0 300 116\" role=\"img\" aria-label=\"Des ressources et des zones d’écart sont repérées sur un territoire de CLSC\"><path d=\"m22 22 73-12 47 22 62-18 73 25-11 58-79 8-54-21-60 17-57-24Z\" fill=\"#e9f6f4\" stroke=\"#8bbfb9\" stroke-width=\"1.5\"/><path d=\"m95 10 5 41-27 50m42-44 27-25m-9 52 10-34 61-36m-61 36 48 55m8-46 78-20\" fill=\"none\" stroke=\"#c0dcd6\" stroke-width=\"1.3\"/><g fill=\"#0c8c89\" stroke=\"#fff\" stroke-width=\"2\"><circle cx=\"68\" cy=\"48\" r=\"8\"/><circle cx=\"144\" cy=\"49\" r=\"8\"/><circle cx=\"231\" cy=\"51\" r=\"8\"/></g><circle cx=\"200\" cy=\"79\" r=\"16\" fill=\"#fff8ea\" stroke=\"#b87d24\" stroke-width=\"1.7\" stroke-dasharray=\"4 3\"/><path d=\"M196 79h8\" stroke=\"#b87d24\" stroke-width=\"2\" stroke-linecap=\"round\"/><g font-size=\"11\" fill=\"#196965\"><text x=\"26\" y=\"113\">Territoire de CLSC</text><circle cx=\"171\" cy=\"109\" r=\"3\" fill=\"#0c8c89\"/><text x=\"179\" y=\"113\">Ressource</text></g></svg>",
    "detail": "<p style=\"margin:10px 0 2px;font-size:.8em;letter-spacing:.06em;text-transform:uppercase\"><strong>1 · Objectif</strong></p><p class=\"these-formulation\">Cartographier dans l’espace les ressources de chaque territoire de CLSC susceptibles d’apporter une réponse intersectorielle à ces besoins.</p><p class=\"note\">Six secteurs : réseau public, première ligne, parapublic, communauté, municipalité, habitation.</p><p style=\"margin:10px 0 2px;font-size:.8em;letter-spacing:.06em;text-transform:uppercase\"><strong>2 · Produit final</strong></p><p class=\"note these-produit\"><strong>Produit final :</strong> un atlas par territoire de CLSC, une matrice besoins × ressources et un indice d’écart. <strong>Ce que ça donne :</strong> savoir, pour chaque profil, où la réponse existe, où elle manque, et pourquoi (absente, inaccessible ou saturée).</p>",
    "button": "<button class=\"these-renvoi ov-methode\" type=\"button\" data-these-vers=\"methodes\" data-these-objectif=\"O2\">Voir la méthode associée <span aria-hidden=\"true\">↗</span></button>",
    "lacune": "La répartition spatiale de l’offre de services destinés aux personnes aînées a déjà été étudiée au Québec, et des travaux ont documenté les limites de capacité de certains organismes sociaux. Toutefois, ces approches relient rarement, à l’échelle des territoires de CLSC, les profils de besoins sociaux concomitants aux ressources susceptibles d’y répondre. La correspondance entre besoins, couverture territoriale et accessibilité potentielle demeure ainsi insuffisamment caractérisée. Ce manque limite l’identification des écarts de réponse et la sélection raisonnée de territoires contrastés pour l’analyse des réseaux de l’objectif 3.",
    "references": [
      [
        "Duc et al., 2026",
        "https://doi.org/10.1007/s43999-026-00085-5"
      ],
      [
        "Kreuter et al., 2020",
        "https://doi.org/10.1377/hlthaff.2019.01256"
      ]
    ],
    "formulation": "Cartographier dans l’espace les ressources de chaque territoire de CLSC susceptibles d’apporter une réponse intersectorielle à ces besoins."
  },
  {
    "code": "O3",
    "titre": "Comprendre les réseaux",
    "question": "Qui travaille avec qui ?",
    "livrable": "Une carte des réseaux",
    "chips": [
      "Par CLSC et par profil",
      "Maillons manquants"
    ],
    "utilite": "Identifier les collaborations existantes et les liens sur lesquels agir.",
    "graph": "<svg viewBox=\"0 0 300 116\" role=\"img\" aria-label=\"Le réseau mobilisé autour d’une équipe SAD et les liens manquants sont examinés\"><g fill=\"none\" stroke=\"#6a9ac9\" stroke-width=\"2.5\"><path d=\"m150 58-79-29m79 29 80-29m-80 29-76 34m76-34 79 34\"/></g><path d=\"M83 26h136\" fill=\"none\" stroke=\"#cf9d4d\" stroke-width=\"2\" stroke-dasharray=\"5 4\"/><g fill=\"#eaf1fa\" stroke=\"#8cafd3\" stroke-width=\"1.5\"><circle cx=\"68\" cy=\"27\" r=\"16\"/><circle cx=\"232\" cy=\"27\" r=\"16\"/><circle cx=\"70\" cy=\"93\" r=\"15\"/><circle cx=\"230\" cy=\"93\" r=\"15\"/></g><g fill=\"#3b71a8\"><circle cx=\"68\" cy=\"24\" r=\"4\"/><path d=\"M61 36v-3c0-5 14-5 14 0v3\"/><circle cx=\"232\" cy=\"24\" r=\"4\"/><path d=\"M225 36v-3c0-5 14-5 14 0v3\"/><circle cx=\"70\" cy=\"90\" r=\"4\"/><path d=\"M63 101v-3c0-5 14-5 14 0v3\"/><circle cx=\"230\" cy=\"90\" r=\"4\"/><path d=\"M223 101v-3c0-5 14-5 14 0v3\"/></g><rect x=\"120\" y=\"37\" width=\"60\" height=\"42\" rx=\"14\" fill=\"#0755ad\"/><text x=\"150\" y=\"63\" fill=\"#fff\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\">SAD</text><text x=\"150\" y=\"16\" fill=\"#94651d\" text-anchor=\"middle\" font-size=\"10\">Lien à documenter</text></svg>",
    "detail": "<p style=\"margin:10px 0 2px;font-size:.8em;letter-spacing:.06em;text-transform:uppercase\"><strong>1 · Objectif</strong></p><p class=\"these-formulation\">Identifier les trajectoires organisationnelles des ressources intersectorielles mobilisées pour répondre aux différents profils, dans plusieurs territoires de CLSC (SAD) contrastés.</p><p class=\"note\">Avec les équipes de soutien à domicile du CIUSSS du Centre-Sud-de-l’Île-de-Montréal.</p><p style=\"margin:10px 0 2px;font-size:.8em;letter-spacing:.06em;text-transform:uppercase\"><strong>2 · Produit final</strong></p><p class=\"note these-produit\"><strong>Produit final :</strong> la carte du réseau de chaque CLSC et de chaque profil, avec les maillons manquants. <strong>Ce que ça donne :</strong> savoir qui travaille déjà ensemble, qui devrait le faire, et sur quels liens agir.</p>",
    "button": "<button class=\"these-renvoi ov-methode\" type=\"button\" data-these-vers=\"methodes\" data-these-objectif=\"O3\">Voir la méthode associée <span aria-hidden=\"true\">↗</span></button>",
    "lacune": "L’analyse des réseaux sociaux a déjà servi à étudier les relations entre organisations de services, tandis que des recherches en soutien à domicile soulignent l’intérêt d’examiner les collaborations professionnelles. La présence géographique d’une ressource ne démontre cependant ni sa mobilisation ni l’existence d’un lien fonctionnel avec les équipes de soutien à domicile. On connaît encore insuffisamment les configurations relationnelles associées aux différents profils de besoins sociaux concomitants, dans des territoires aux ressources contrastées. Cette lacune limite l’identification des relais, des ruptures de coordination et des leviers d’amélioration intersectorielle.",
    "references": [
      [
        "Urbanoski et al., 2018",
        "https://doi.org/10.1371/journal.pone.0206671"
      ],
      [
        "Schorderet et al., 2022",
        "https://doi.org/10.1186/s12913-022-08548-4"
      ]
    ],
    "formulation": "Identifier les trajectoires organisationnelles des ressources intersectorielles mobilisées pour répondre aux différents profils, dans plusieurs territoires de CLSC (SAD) contrastés."
  }
];
function render() {
  return `<section class="objectifs-visuels" aria-label="Les trois objectifs spécifiques">
<div class="ov-intro"><p class="ov-accroche">Trois objectifs qui se complètent</p><p>Des combinaisons de besoins aux ressources du territoire, puis aux réseaux mobilisés.</p></div>
<ol class="ov-parcours" aria-label="Le fil des trois objectifs"><li><span>O1</span><strong>Profils</strong></li><li><span>O2</span><strong>Ressources</strong></li><li><span>O3</span><strong>Réseaux</strong></li></ol>
<p class="ov-schema-note">Schémas de principe</p>
<div class="these-objectifs objectifs-grille">${objectifs.map(o => `<article class="objectif-carte ov-carte" data-objectif="${o.code}">
<section class="ov-lacune-avant" aria-label="Lacune scientifique de ${o.code}"><p class="ov-lacune-titre">Lacune scientifique · ${o.code}</p><p>${o.lacune}</p><p class="ov-lacune-sources">${o.references.map(([libelle,href])=>`<a href="${href}" target="_blank" rel="noopener noreferrer">${libelle}</a>`).join(" · ")}</p></section>
<header class="ov-entete"><span class="ov-code">${o.code}</span><h4>${o.titre}</h4><p class="ov-question">${o.question}</p></header>
<figure class="ov-schema">${o.graph}</figure>
<div class="ov-livrable"><p class="ov-label">Ce qu’on obtient</p><h5>${o.livrable}</h5><ul>${o.chips.map(chip=>`<li>${chip}</li>`).join("")}</ul></div>
<div class="ov-utilite"><p class="ov-label">Pour agir</p><p>${o.utilite}</p></div>
<details class="ov-details"><summary>Formulation complète et précisions</summary><div class="ov-details-corps">${o.detail}</div></details>
${o.button}
</article>`).join("")}</div>
<p class="ov-convergence">Une lecture commune : <strong>par profil de besoins</strong> et <strong>par territoire de CLSC</strong>.</p>
</section>`;
}
module.exports = { render };
