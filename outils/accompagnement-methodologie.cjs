// Lecture guidée du protocole actualisé. Les détails et les visuels sont conservés.
const guides=[
 [
  ['Nous cherchons des études sur des aînés vivant à domicile dont les difficultés quotidiennes et les besoins sociaux sont documentés ensemble.','Ces critères permettent maintenant de choisir les documents à examiner.'],
  ['Nous sélectionnons les publications et rapports pertinents, puis deux évaluateurs vérifient indépendamment leur admissibilité.','Les documents retenus fournissent les informations à relever de manière systématique.'],
  ['Nous relevons les mêmes informations dans chaque étude : activités difficiles, aide nécessaire, besoins sociaux et réponses décrites.','Ces informations deviennent comparables, tout en conservant leurs différences de définition et de mesure.'],
  ['Nous cherchons les combinaisons de besoins observées chez les mêmes personnes pour construire des scénarios types, c’est-à-dire des situations de référence étayées.','Ces scénarios permettront de préciser les fonctions de service utiles à la suite du projet.'],
  ['Nous traduisons chaque scénario en fonctions de réponse : aider à se nourrir, se déplacer, adapter le logement ou maintenir des liens sociaux.','O2 pourra rechercher les ressources correspondantes ; O3 examinera leurs collaborations effectives.'],
  ['Nous indiquons ce que les études permettent de décrire et les combinaisons qui restent insuffisamment documentées.','La suite utilisera les scénarios étayés, sans inventer de profils ni leur fréquence sur un territoire.']
 ],
 [
  ['Nous décrivons la population et les ressources du territoire. Le nombre de personnes de 65 ans et plus ne mesure pas leur perte d’autonomie.','Il faut ensuite délimiter les territoires et les ressources à inclure.'],
  ['Nous choisissons des territoires contrastés et les règles communes pour recenser les ressources pertinentes pour les scénarios.','Ces règles guident la collecte d’informations comparables sur chaque ressource.'],
  ['Nous réunissons les adresses et les conditions d’accès : public accueilli, coût, horaires, territoire desservi et capacité lorsqu’elle est connue.','Les données vérifiées permettent de comparer la répartition et l’accessibilité des ressources.'],
  ['Nous calculons où se trouvent les services, à quelles conditions ils sont accessibles et quelles fonctions ils couvrent ensemble pour chaque scénario.','Les cartes et indicateurs alimenteront un atlas des ressources mobilisables.'],
  ['Nous construisons un tableau reliant chaque scénario aux organisations, aux fonctions proposées et aux conditions d’accès, pour chaque territoire.','Ce tableau sera rapproché des collaborations réellement déclarées dans O3.'],
  ['Nous précisons les informations manquantes et vérifions si les conclusions changent selon les distances, les frontières ou les ressources retenues.','L’atlas décrit les possibilités de réponse ; il ne démontre pas que les services ont été reçus.']
 ],
 [
  ['Nous étudions les organisations et leurs interactions. Sur les dessins de réseau, les points représentent des organisations et les traits leurs relations.','Il faut d’abord définir quelles organisations seront invitées à décrire leurs collaborations.'],
  ['Nous sollicitons les organisations du périmètre retenu, avec un répondant connaissant leurs collaborations. Les partenaires nommés peuvent compléter l’inventaire initial.','Le questionnaire pourra alors documenter les mêmes types de relations sur une période commune.'],
  ['Nous administrons un seul questionnaire sur les douze mois précédents : orientations, échanges d’information, coordination et décisions conjointes, selon les scénarios.','Ces déclarations permettent de construire les réseaux, en distinguant absence de lien et information inconnue.'],
  ['Nous décrivons les participants, leurs relations et leurs rôles de coordination. Un réseau centré sur un CLSC montre ses partenaires dans l’ensemble enquêté.','Les réseaux observés pourront ensuite être comparés aux ressources mobilisables recensées en O2.'],
  ['Nous comparons, pour un même scénario, territoire et période, les ressources qui pourraient intervenir et les relations effectivement déclarées.','Les écarts observés serviront à discuter des obstacles et des améliorations possibles.'],
  ['Nous tenons compte des oublis, des non-réponses et des liens inconnus. Les résultats décrivent l’organisation des collaborations, sans mesurer leur effet clinique.','La synthèse finale rapprochera scénarios, atlas et réseaux pour formuler des pistes adaptées aux territoires.']
 ]
];
const introductions=[
 'Ce premier volet repère les combinaisons de perte d’autonomie et de besoins sociaux dans les études, puis les décline en scénarios types étayés.',
 'Ce deuxième volet construit un atlas des ressources intersectorielles mobilisables et accessibles pour répondre à ces scénarios, selon les territoires.',
 'Ce troisième volet décrit les collaborations déclarées par les organisations sur douze mois, puis les compare aux ressources mobilisables.'
];
const transitions=[
 'Les scénarios d’O1 précisent les besoins à rapprocher des ressources ; l’inventaire préparatoire d’O2 peut avancer en parallèle.',
 'L’atlas d’O2 fournit la grille des ressources mobilisables à comparer aux collaborations documentées en O3.',
 'Les trois volets seront mis en regard pour dégager des pistes d’amélioration de la réponse intersectorielle en soins et services de première ligne.'
];
const titres=new Map([
 ['Quels besoins se cumulent ?','Les besoins à documenter'],['Quelles réponses sont possibles ?','Les ressources possibles'],['Qui agit ensemble, concrètement ?','Les collaborations à observer'],
 ['Pourquoi le profil plutôt que la personne ?','Des publications aux profils de besoins'],['Pourquoi des profils concomitants ?','Des besoins observés ensemble'],
 ['Pourquoi ces secteurs autour du CLSC ?','Les secteurs à considérer autour du CLSC'],['Pourquoi le mapping est indispensable','L’apport de la cartographie'],['Pourquoi c’est nécessaire maintenant','L’enjeu actuel pour les territoires'],
 ['Comment on passe des données au produit final','Des données au produit final'],['Six questions, six lectures de la carte','Six dimensions pour lire la carte'],
 ['Quels services existent, et où ?','Localisation et répartition des services'],['Quels services sont géographiquement accessibles ?','Accessibilité géographique des services'],
 ['La proximité signifie-t-elle une capacité de service ?','Capacité de service et proximité'],['Où apparaissent les signaux de besoins ?','Répartition des signaux de besoins'],
 ['Les ressources couvrent-elles ensemble plusieurs domaines de besoin ?','Couverture conjointe des domaines de besoin'],['Les difficultés se regroupent-elles dans l’espace ?','Regroupements spatiaux des difficultés'],
 ['Comment vérifier la solidité du travail ?','Vérifier la solidité du travail'],['O1 · Quelles situations les études décrivent-elles ?','O1 · Lire les études et construire les scénarios'],['O1 · Quelles situations reviennent dans les études ?','O1 · Lire les études et construire les scénarios'],['O2 · Quelles aides pourraient répondre à ces situations ?','O2 · Cartographier les aides mobilisables'],['O3 · Quels liens les organisations ont-elles réellement mobilisés ?','O3 · Décrire les collaborations effectivement mobilisées']
]);
function appliquer(d){
 const chapitre=d.querySelector('.these [data-rubrique="methodes"] .chapitre-contenu');if(!chapitre)return;
 const replacements=[
  ['soins primaires','soins et services de première ligne'],
  ['Soins primaires','Soins et services de première ligne'],
  ['besoins sociaux et de soins de santé concomitants','perte d’autonomie et besoins sociaux concomitants'],
  ['Besoins sociaux et de soins de santé concomitants','Perte d’autonomie et besoins sociaux concomitants'],
  ['Au moins un besoin social et un besoin de soins de santé chez les mêmes personnes','Une perte d’autonomie et au moins un besoin social chez les mêmes personnes'],
  ['Depuis 2006 · français ou anglais','Période et langues à justifier dans le protocole'],
  ['aux perte d’autonomie et besoins sociaux concomitants','aux scénarios associant perte d’autonomie et besoins sociaux concomitants'],
  ['par profil et territoire','par scénario type et territoire'],['par profil et par territoire','par scénario type et par territoire'],
  ['par profils et territoires','par scénarios types et territoires'],['profils issus d’O1','scénarios types issus d’O1'],['par profil O1 étayé','par scénario type étayé par O1']
 ];
 const walker=d.createTreeWalker(chapitre,4),nodes=[];let n;while(n=walker.nextNode())if(!n.parentElement.closest('script,style,svg,code,pre,.m-source,.bibliographie-complete,a[href^="https:"]'))nodes.push(n);
 for(const n of nodes)for(const [a,b]of replacements)n.textContent=n.textContent.split(a).join(b);
 for(const h of chapitre.querySelectorAll('h3,h4,h5,h6'))if(titres.has(h.textContent.trim()))h.textContent=titres.get(h.textContent.trim());
 const ordre=chapitre.querySelector('.ds-ordre-souple');if(ordre)ordre.textContent='La préparation de l’inventaire territorial peut avancer pendant la revue. La comparaison finale exige des scénarios de besoins, des territoires et des périodes compatibles. O3 repose sur un questionnaire unique portant sur les douze mois précédents. Le réseau enquêté réunit les organisations du périmètre ; une lecture égocentrée se concentre sur un CLSC et ses partenaires, à partir du même recueil.';
 for(const p of chapitre.querySelectorAll('.ms-method-note')){
  if(p.textContent.startsWith('Passage à O2 :'))p.textContent='Passage à O2 : les scénarios étayés précisent les fonctions à rechercher dans l’inventaire territorial. Passage à O3 : ils servent à qualifier les collaborations déclarées entre organisations. Les personnes décrites dans les publications ne sont pas recrutées ni suivies dans l’enquête de réseaux.';
  if(p.textContent.startsWith('Trois résultats à ne pas confondre :'))p.textContent='Trois résultats à relier : O1 construit des scénarios types à partir des combinaisons de besoins documentées ; O2 décrit les ressources mobilisables ; O3 caractérise les relations organisationnelles déclarées sur douze mois. Ces relations sont comparées à l’inventaire d’O2 pour des scénarios et territoires compatibles. Ce questionnaire ne reconstitue pas des chronologies individuelles de soins.';
 }
 for(const p of chapitre.querySelectorAll('p')){
  if(p.textContent.startsWith('Les acteurs repèrent-ils ces besoins'))p.textContent='L’enquête décrit les orientations, les échanges d’information et la coordination entre organisations, puis les compare aux ressources mobilisables. Elle ne mesure pas l’aide reçue par cette personne fictive.';
  if(p.textContent.startsWith('Vers O3 : après approbation éthique'))p.textContent='Vers O3 : après les approbations requises, les scénarios serviront à préciser les collaborations à documenter auprès des organisations de première ligne et de leurs partenaires. La revue ne recrute pas de personnes aînées et O3 ne suit pas leurs parcours individuels.';
  if(p.textContent.startsWith('Participation : Conserver ≥ 80 %'))p.textContent='Participation : viser une réponse aussi complète que possible des organisations sollicitées. Les repères de 80 % et de 65–79 % servent à organiser les relances et les analyses de sensibilité ; ils ne garantissent pas la validité d’un réseau. Calculer le taux d’organisations répondantes et décrire séparément la couverture des relations, des secteurs, des territoires et des scénarios. La lecture centrée sur un CLSC utilise les mêmes déclarations organisationnelles.';
 }
 for(const li of chapitre.querySelectorAll('li')){
  if(li.querySelector(':scope > strong')?.textContent==='Associer un cas à un profil'){
   li.querySelector(':scope > strong').textContent='Rattacher les relations à un scénario';
   const label=li.querySelector('.ms-node');if(label)label.textContent='01 · SCÉNARIO';
   const texte=li.querySelector(':scope > span:last-child');if(texte)texte.textContent='Préciser le scénario de besoins, la période et les organisations concernées par les relations déclarées, sans reconstituer le parcours individuel d’une personne.';
  }
  if(li.textContent.startsWith('Personnes présentant une ou plusieurs morbidités'))li.textContent='Personnes présentant une limitation des activités quotidiennes et des besoins sociaux concomitants, documentés chez les mêmes personnes. Une maladie chronique ou une fragilité ne suffit pas, à elle seule, à établir ces critères.';
  if(li.textContent.startsWith('Études sans morbidité ni problème de santé'))li.textContent='Études ne documentant pas la perte d’autonomie et les besoins sociaux concomitants dans la population cible.';
  if(li.textContent.startsWith('Au moins un besoin social et un besoin de soins de santé décrits'))li.textContent='Une perte d’autonomie et au moins un besoin social observés conjointement chez les mêmes personnes aînées. La présence de plusieurs domaines dans une publication, sans données conjointes, ne suffit pas à établir un scénario étayé.';
  if(li.textContent.startsWith('Publications en français ou en anglais, depuis 2006'))li.textContent='Publications de 2006 et après, en français ou en anglais. La revue couvre les deux décennies qui suivent la politique Chez soi : le premier choix (MSSS, 2003) et la Commission des déterminants sociaux de la santé de l’OMS (2005).';
  if(li.textContent.startsWith('Résumés de congrès, thèses et mémoires'))li.textContent='Documents sans informations exploitables pour l’objectif, notamment protocoles sans résultats, éditoriaux et lettres sans données. Les mémoires, thèses et rapports pertinents seront recherchés dans la littérature grise et évalués selon leur contenu.';
  if(li.textContent.startsWith('Autres langues')&&li.closest('#methode-o1-5'))li.textContent='Toute exclusion liée à la langue ou à la période sera explicitée et justifiée ; les documents utiles au contexte seront distingués du corpus qui étaye les scénarios.';
 }
 for(const h of chapitre.querySelectorAll('h6'))if(h.textContent==='Associer un cas à un profil')h.textContent='Rattacher les relations à un scénario';
 for(const p of chapitre.querySelectorAll('p'))if(p.textContent.startsWith('Documenter les besoins sociaux')&&p.textContent.includes('sans assimiler ce cas'))p.textContent='Rattacher les relations déclarées à un ou plusieurs scénarios d’O1 et à une période commune. Le questionnaire documente les organisations et leurs interactions, sans recruter ni suivre un cas individuel.';
 for(let i=0;i<3;i++){
  const obj=chapitre.querySelector('#these-methode-o'+(i+1));if(!obj)continue;
  const head=obj.querySelector('.methode-objectif-tete'),titre=head?.querySelector('h4');
  obj.querySelectorAll('.methode-intro-objectif').forEach(n=>n.remove());
  if(titre){const intro=d.createElement('p');intro.className='methode-intro-objectif';intro.textContent=introductions[i];titre.after(intro);}
  const transition=obj.querySelector(':scope > .methode-transition-objectif');if(transition)transition.textContent=transitions[i];
  const exploration=obj.querySelector('.ms-exploration');if(exploration&&!exploration.querySelector('[data-guide-exploration]')){const t=exploration.querySelector('h5');if(t){const p=d.createElement('p');p.className='methode-intro-objectif';p.dataset.guideExploration='oui';p.textContent='Cet exercice déjà réalisé sert à tester les outils et à préparer le protocole. Les résultats de l’essai sont distincts de la méthode doctorale prévue ci-dessous.';t.after(p);}}
  for(let j=0;j<6;j++){
   const sec=obj.querySelector('#methode-o'+(i+1)+'-'+(j+4));if(!sec)continue;
   sec.querySelectorAll(':scope > [data-guide-methodologie]').forEach(n=>n.remove());
   const titre=sec.querySelector(':scope > h5');if(!titre)continue;
   const intro=d.createElement('p');intro.className='methode-intro-objectif';intro.dataset.guideMethodologie='introduction';intro.textContent=guides[i][j][0];titre.after(intro);
   const contexte=sec.querySelector(':scope > .ms-protocol-context');
   if(contexte){let details=sec.querySelector(':scope > details.ms-details');if(!details){details=d.createElement('details');details.className='ms-details';const summary=d.createElement('summary');summary.textContent='Précisions méthodologiques';details.append(summary);sec.append(details);}let corps=details.querySelector('.ms-detail-body');if(!corps){corps=d.createElement('div');corps.className='ms-detail-body';details.append(corps);}corps.prepend(contexte);}
   const sortie=d.createElement('p');sortie.className='methode-transition-objectif';sortie.dataset.guideMethodologie='transition';sortie.textContent=guides[i][j][1];sec.append(sortie);
  }
 }
 for(const p of chapitre.querySelectorAll('.methodo-statut,.methode-statut-protocole'))p.innerHTML=p.innerHTML.replace(/<\/strong>(?=\S)/g,'</strong> ');
}
module.exports={appliquer};
