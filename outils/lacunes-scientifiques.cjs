"use strict";

// Acquis en pleine largeur, lacunes dans les trois cadres d’origine.
const cadres = {
  O1: {
    savoir: [
      "Plusieurs travaux documentent la coexistence d’une perte d’autonomie et de besoins sociaux chez les personnes aînées recevant des services à domicile. Au Québec, Turcotte et al. (2015) montrent, auprès de personnes présentant une perte d’autonomie mesurée au SMAF, que les besoins satisfaits concernent principalement les activités quotidiennes, tandis que les besoins non satisfaits touchent davantage les relations interpersonnelles, les loisirs, la vie communautaire et la mobilité. En Ontario, Saari et al. (2024) décrivent six profils combinant des besoins fonctionnels, cognitifs et psychosociaux, notamment des enjeux de solitude, de soutien informel et de sécurité du domicile. Ces études documentent des besoins qui dépassent l’aide à l’accomplissement des activités quotidiennes.",
      "D’autres contributions précisent certaines dimensions de ce cumul. Wright et al. (2024) décrivent l’imbrication des difficultés fonctionnelles, financières, alimentaires, relationnelles et de transport chez des personnes aînées fragiles. McKittrick et al. (2026) identifient sept profils de besoins d’aide à domicile, principalement structurés par les dimensions fonctionnelles, cognitives et cliniques, puis caractérisés selon des facteurs sociaux. Tingvold et al. (2026) mettent en évidence des divergences entre personnes aînées, proches, professionnels et responsables de services quant à la reconnaissance des besoins relationnels et aux responsabilités pour y répondre. Ces travaux mobilisent toutefois des critères fonctionnels, des populations et des dimensions sociales différents ; la fragilité ne correspond pas, à elle seule, à une perte d’autonomie établie dans les AVQ ou les AIVQ.",
      "Les sources québécoises de littérature grise apportent également des connaissances sur les besoins et leur prise en compte. Le CSBE (2023, tome 3) relève, à partir de ses consultations et analyses, une évaluation et un ajustement des services aux besoins encore imparfaits, ainsi qu’une modulation de l’aide selon la situation familiale. La politique Mieux chez soi (MSSS, 2026) reconnaît, pour les personnes ayant une incapacité, les obstacles à la socialisation et à la participation communautaire. Ces constats institutionnels et orientations complètent les études empiriques ; ils ne constituent pas une typologie des configurations individuelles associant perte d’autonomie et besoins sociaux."
    ],
    lacune: [
      "Malgré l’existence de travaux décrivant des profils multidimensionnels de besoins, la caractérisation comparée des profils de besoins sociaux concomitants à une perte d’autonomie chez les personnes aînées vivant à domicile demeure à consolider. L’hétérogénéité des définitions, des instruments et des populations étudiées limite l’identification de profils comparables, articulant limitations des activités quotidiennes, besoins d’aide et besoins sociaux matériels et relationnels, satisfaits ou non. Cette fragmentation des connaissances limite la construction de scénarios types étayés permettant de préciser les fonctions de réponse intersectorielle à examiner en soins et services de première ligne."
    ]
  },
  O2: {
    savoir: [
      "Au Québec, Juliette Duc et ses collègues (2026) analysent la répartition des installations de santé, des services offerts et des capacités déclarées, notamment les lits d’hébergement, en regard de la localisation de la population de 65 ans et plus et du degré d’urbanisation. Leurs résultats mettent en évidence des disparités spatiales d’offre, avec une disponibilité généralement plus faible en milieu rural. Cette étude constitue un acquis direct pour la cartographie d’O2. La demande y est toutefois approchée par la population âgée ; elle ne correspond pas à une mesure individuelle du cumul de perte d’autonomie et de besoins sociaux concomitants.",
      "Les analyses du CSBE (2023, tome 2) comparent déjà la performance du soutien à domicile selon les territoires, notamment son accessibilité et son ajustement aux besoins. Le CSBE (2024, tome 4) rapporte également un taux de réponse modélisé de 10,7 % aux besoins de services de longue durée à domicile en 2023. Ce taux rapporte des volumes de services aux besoins estimés ; il ne représente pas la proportion des personnes qui reçoivent une aide. Ces travaux documentent ainsi des écarts de réponse, au-delà de la seule localisation des services.",
      "À l’international, Tabatabaei-Jafari et al. (2024) proposent un atlas standardisé des services sanitaires et sociaux liés à la démence. Weaver et Roberto (2021) montrent des variations géographiques dans la réception de services alimentaires, de transport et d’aide à domicile. Shin et al. (2026) soulignent la fragmentation des recherches entre ressources sanitaires, sociales et environnementales, ainsi que des barrières géographiques, financières et organisationnelles. Les acquis québécois et internationaux justifient donc d’examiner conjointement la distribution de l’offre, ses fonctions et ses conditions d’accès."
    ],
    lacune: [
      "Les connaissances sur la répartition territoriale des ressources intersectorielles mobilisables en soins et services de première ligne demeurent insuffisamment intégrées pour apprécier leur adéquation aux différents scénarios types associant perte d’autonomie et besoins sociaux concomitants chez les personnes aînées vivant à domicile. Il reste à mettre en relation, dans une même analyse, la répartition des personnes aînées vivant à domicile, les configurations socioéconomiques des territoires et les ressources intersectorielles mobilisables pour assurer les fonctions de réponse requises par chaque scénario type. Cette articulation est nécessaire pour caractériser les variations territoriales de distribution, de disponibilité, de complémentarité et d’accessibilité des ressources, et repérer les écarts potentiels entre les fonctions de réponse requises et celles couvertes par les ressources recensées."
    ]
  },
  O3: {
    savoir: [
      "Les recherches québécoises ont déjà étudié l’intégration et la coordination des services destinés aux personnes aînées. L’évaluation de PRISMA par Hébert et al. (2010) documente un modèle reposant notamment sur la concertation, la gestion de cas, l’évaluation commune et le partage d’information. Le CSBE (2023, tome 3) décrit des mécanismes de transition entre l’hôpital et le domicile opérationnels, tout en relevant des difficultés d’arrimage avec les services médicaux de première ligne, les services spécialisés et les différents prestataires. Il souligne aussi les limites des données disponibles pour mesurer certaines dimensions de la coordination. Ces constats renseignent déjà l’organisation des réponses, sans constituer une analyse de réseaux différenciée selon les configurations cumulées de besoins.",
      "La politique Mieux chez soi (MSSS, 2026) confirme le CLSC comme porte d’entrée principale et prévoit une coordination avec les prestataires publics, privés, d’économie sociale et d’action communautaire. Elle rapporte que des projets pilotes menés en 2024-2025 dans six établissements ont permis de dégager des conditions d’accès intégré, dont la connaissance des ressources, la coordination des voies d’entrée et la mobilisation des partenaires. Ces orientations et retours d’expérience précisent les mécanismes attendus ; ils n’établissent pas, pour chaque scénario du projet, les relations organisationnelles effectivement mobilisées.",
      "L’analyse des réseaux apporte des repères complémentaires. Brewster et al. (2019) distinguent les orientations, les échanges d’information et d’autres collaborations entre organisations sanitaires et sociales desservant les aînés. Grol et al. (2020) décrivent, selon les perceptions de personnes aînées fragiles, des réseaux davantage reliés aux acteurs médicaux et à l’aide à domicile qu’à certains acteurs sociaux. Prusaczyk et al. (2026) analysent les relations entre organismes de soutien à domicile liés à la démence en milieu rural. Park et al. (2026) étudient l’évolution d’un réseau intersectoriel associant organismes communautaires et institutions artistiques ou culturelles. Ces études ne comparent pas les réseaux selon les configurations précises de cumul de perte d’autonomie et de besoins sociaux retenues dans le projet."
    ],
    lacune: [
      "Les connaissances sur la configuration organisationnelle des réseaux intersectoriels mobilisés en soins et services de première ligne demeurent insuffisamment articulées aux différents scénarios types associant perte d’autonomie et besoins sociaux concomitants chez les personnes aînées vivant à domicile. Pour un même scénario type et un même territoire, la correspondance entre les ressources intersectorielles mobilisables et celles effectivement mobilisées reste à préciser. Il importe de caractériser la composition des réseaux, la structure des relations et leurs modalités de fonctionnement, notamment la nature, la direction, la fréquence et l’intensité des interactions organisationnelles déclarées sur douze mois, afin de documenter les écarts entre ressources mobilisables et mobilisation déclarée, sans les assimiler automatiquement à des besoins non satisfaits."
    ]
  }
};

const citations = [
  ["Turcotte et al. (2015)", "https://doi.org/10.1186/s12877-015-0077-1"],
  ["Saari et al. (2024)", "https://doi.org/10.1371/journal.pone.0300521"],
  ["Wright et al. (2024)", "https://doi.org/10.18043/001c.121369"],
  ["McKittrick et al. (2026)", "https://doi.org/10.1177/07334648251366720"],
  ["Tingvold et al. (2026)", "https://doi.org/10.1016/j.gerinurse.2026.103979"],
  ["CSBE (2023, tome 3)", "https://www.csbe.gouv.qc.ca/fileadmin/www/2023/Rapportpreliminaire_SAD/CSBE-Rapport_Soutien_Domicile_Tome3.pdf"],
  ["Mieux chez soi (MSSS, 2026)", "https://publications.msss.gouv.qc.ca/msss/document-003983/"],
  ["Juliette Duc et ses collègues (2026)", "https://doi.org/10.1007/s43999-026-00085-5"],
  ["CSBE (2023, tome 2)", "https://www.csbe.gouv.qc.ca/fileadmin/www/2023/Rapportpreliminaire_SAD/CSBE-Tome2_Rapport_Preliminaire_SoutienDomicile.pdf"],
  ["CSBE (2024, tome 4)", "https://www.csbe.gouv.qc.ca/fileadmin/www/2024/Rapport_final_SAD/CSBE-Rapport_Soutien_Domicile_Tome4.pdf"],
  ["Tabatabaei-Jafari et al. (2024)", "https://doi.org/10.1177/11786329241232254"],
  ["Weaver et Roberto (2021)", "https://doi.org/10.1177/0091415020948205"],
  ["Shin et al. (2026)", "https://doi.org/10.1177/01640275261458993"],
  ["Hébert et al. (2010)", "https://doi.org/10.1093/geronb/gbp027"],
  ["Brewster et al. (2019)", "https://doi.org/10.1111/1475-6773.13206"],
  ["Grol et al. (2020)", "https://doi.org/10.5334/ijic.4721"],
  ["Prusaczyk et al. (2026)", "https://doi.org/10.1002/bsa3.70103"],
  ["Park et al. (2026)", "https://doi.org/10.1016/j.socnet.2026.04.004"]
];
const escape = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function paragraphe(texte) {
  let html = escape(texte);
  for (const [label, href] of citations) html = html.split(escape(label)).join('<a class="ov-citation" href="'+escape(href)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a>');
  return '<p>'+html+'</p>';
}
function render(code) {
  const v = cadres[code];
  if (!v) throw new Error('Objectif inconnu : '+code);
  return '<section class="ov-lacune-avant" aria-label="Lacune scientifique de '+code+'"><p class="ov-lacune-titre">Lacune scientifique · '+code+'</p>'+v.lacune.map(paragraphe).join('')+'</section>';
}
function renderConnaissances() {
  return '<div class="ov-connaissances" data-acquis-litterature="oui">'+Object.entries(cadres).map(([code,v])=>'<section class="ov-savoir-avant" data-etat-connaissances="'+code+'" aria-label="Ce qu’on sait déjà pour '+code+'"><h5 class="ov-savoir-titre">Ce qu’on sait déjà · '+code+'</h5>'+v.savoir.map(paragraphe).join('')+'</section>').join('\n')+'</div>';
}
function transformer(html) {
  if (!html.includes('class="objectif-carte ov-carte"')) return html;
  const {JSDOM} = require('jsdom');
  const dom = new JSDOM(html, {includeNodeLocations:true});
  const edits = [];
  const connaissances = dom.window.document.querySelector('.objectifs-visuels [data-acquis-litterature]');
  if (connaissances) {
    const n = dom.nodeLocation(connaissances);
    edits.push({a:n.startOffset,b:n.endOffset,text:renderConnaissances()});
  } else {
    const note = dom.window.document.querySelector('.objectifs-visuels .ov-schema-note');
    if (!note) throw new Error('Point d’insertion des connaissances absent');
    const n = dom.nodeLocation(note);
    edits.push({a:n.startOffset,b:n.startOffset,text:renderConnaissances()+'\n'});
  }
  for (const card of dom.window.document.querySelectorAll('.ov-carte[data-objectif]')) {
    const old = [...card.children].filter(e => e.classList.contains('ov-lacune-avant'));
    if (!old.length) throw new Error('Cadre de lacune absent : '+card.dataset.objectif);
    const first = dom.nodeLocation(old[0]);
    const last = dom.nodeLocation(old[old.length-1]);
    edits.push({a:first.startOffset,b:last.endOffset,text:render(card.dataset.objectif)});
  }
  dom.window.close();
  for (const edit of edits.sort((a,b)=>b.a-a.a)) html = html.slice(0,edit.a)+edit.text+html.slice(edit.b);
  return html;
}
module.exports = {cadres, citations, render, renderConnaissances, transformer};
