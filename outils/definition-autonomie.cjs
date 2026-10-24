// Définition commune aux pages publiées et à leurs sources de présentation.
const fs = require('node:fs');
const path = require('node:path');
const v = require('./autonomie-fonctionnelle.json');
const e = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p = s => '<p>'+e(s)+'</p>';
const cartes = rows => '<div class="these-cartes-synthese">'+rows.map(([h,t])=>'<article><strong>'+e(h)+'</strong>'+p(t)+'</article>').join('')+'</div>';

function cadre() {
  return '<div data-cadre-autonomie="20261023"><h4>Deux dimensions de l’autonomie à distinguer</h4>'+
    p('Dans la littérature gériatrique, le terme « autonomie » peut recouvrir à la fois l’autodétermination et l’indépendance dans les activités quotidiennes. Pour clarifier l’objet de cette recherche, deux dimensions sont distinguées (Gobillot et al., 2025).')+
    cartes([
      ['Dimension fonctionnelle · réaliser les activités quotidiennes', 'Elle concerne la réalisation des activités de la vie quotidienne, les difficultés rencontrées et l’assistance nécessaire. Les activités de base et instrumentales permettent de l’évaluer (Katz et al., 1963 ; Lawton et Brody, 1969).'],
      ['Dimension décisionnelle · décider et consentir', 'Elle concerne la possibilité de se déterminer et de prendre des décisions concernant sa vie. Dans les soins, le consentement doit être libre et éclairé. L’aptitude à consentir suppose de comprendre l’information, d’en apprécier la portée pour soi, de raisonner sur les options et de communiquer un choix (Appelbaum, 2007).']
    ])+
    p('Un besoin d’aide pour se laver, se déplacer ou préparer ses repas ne permet pas, à lui seul, de conclure à une incapacité à consentir. L’évaluation décisionnelle porte sur une décision donnée, dans son contexte, avec une information et une communication adaptées (Appelbaum, 2007).')+
    '<h4>Le choix de la dimension fonctionnelle dans cette recherche</h4>'+
    p('La thèse étudie l’organisation de la réponse intersectorielle à des difficultés de la vie quotidienne et à des besoins sociaux concomitants. La dimension fonctionnelle permet de mettre en relation les limitations observées, les besoins d’aide, les ressources de compensation et les services mobilisables. Ce choix est cohérent avec les travaux d’évaluation fonctionnelle et la prise en compte de l’environnement dans le fonctionnement quotidien (Hébert et al., 2001 ; OMS, 2015).')+
    p('L’autonomie décisionnelle reste essentielle au consentement, au respect des préférences et à la participation aux décisions. Elle constitue ici une exigence transversale de l’accompagnement ; la recherche ne vise pas à mesurer l’aptitude individuelle à consentir (Appelbaum, 2007 ; Gobillot et al., 2025).')+'</div>';
}

function definition() {
  const domaines = [
    ['Activités de base de la vie quotidienne (AVQ / ADL)', 'Soins personnels : se laver, s’habiller, utiliser les toilettes, effectuer les transferts, assurer sa continence et s’alimenter.'],
    ['Activités instrumentales de la vie quotidienne (AIVQ / IADL)', 'Vie dans la communauté : téléphoner, faire les courses, préparer les repas, entretenir le logement, faire la lessive, utiliser les transports, gérer médicaments et finances.'],
    ['Mobilité', 'Se lever, marcher, se déplacer à l’intérieur et à l’extérieur ou franchir des escaliers, avec les aides nécessaires.'],
    ['Fonctions mentales', 'Mémoire, orientation, compréhension, jugement et comportement ; préciser leurs conséquences sur la réalisation des activités.'],
    ['Communication', 'Voir, entendre et s’exprimer, en tenant compte des moyens de compensation.']
  ];
  return p(v.contexte[1][1][0])+cadre()+
    '<h4>Définition retenue de la perte d’autonomie </h4>'+
    '<div class="these-message-cle" data-definition-autonomie="20261023">'+p(v.contexte[1][1][1])+'</div>'+
    '<h4>Les activités et les fonctions à décrire</h4>'+
    p('Les AVQ et les AIVQ décrivent les activités concernées. La mobilité, les fonctions mentales et la communication éclairent aussi leur réalisation : la perte d’autonomie ne se limite donc pas aux capacités physiques. Le SMAF distingue ces cinq domaines ; les autres instruments ne les couvrent pas tous de la même façon (Katz et al., 1963 ; Lawton et Brody, 1969 ; Hébert et al., 2001).')+
    '<div class="these-tableau-defilement" role="region" tabindex="0" aria-label="Activités et fonctions constitutives de l’évaluation fonctionnelle"><table class="these-tableau"><caption>Activités et fonctions constitutives de l’évaluation fonctionnelle</caption><thead><tr><th scope="col">Domaine</th><th scope="col">Éléments à documenter</th></tr></thead><tbody>'+domaines.map(([h,t])=>'<tr><th scope="row">'+e(h)+'</th><td>'+e(t)+'</td></tr>').join('')+'</tbody></table></div>'+
    p('Le niveau d’aide distingue une activité réalisée seul mais avec difficulté, un besoin de stimulation ou de surveillance, une aide partielle et une aide complète. Ces situations ne décrivent pas une succession obligatoire. Les critères propres à chaque instrument et à chaque activité doivent être conservés (Hébert et al., 2001).')+
    '<h4>Un fonctionnement situé dans un environnement</h4>'+
    p('La Classification internationale du fonctionnement, du handicap et de la santé (CIF) distingue la capacité dans un environnement standardisé et la performance dans le milieu de vie habituel. Le fonctionnement et les restrictions de participation résultent aussi de l’interaction avec cet environnement : logement, transports, aides techniques, proches et services peuvent faciliter les activités ou leur faire obstacle (OMS, 2002).')+
    p('Il faut ainsi distinguer la limitation, l’aide nécessaire, l’aide effectivement reçue et ce qui reste non compensé. Une aide disponible peut permettre de réaliser une activité malgré une limitation persistante ; sa présence ne prouve pas que le besoin a disparu. Le SMAF prend également en compte la stabilité des ressources de compensation (Hébert et al., 2001).')+
    p('L’évaluation doit aussi considérer les activités que la personne souhaite poursuivre et le sens qu’elles ont pour elle. L’étude qualitative de Gobillot et ses collègues invite à compléter les scores fonctionnels par les projets de vie et les points de vue des personnes et de leurs proches. Les trajectoires qu’elle décrit ne constituent pas une progression inévitable de l’aide humaine vers la perte de liberté décisionnelle ou l’hébergement (Gobillot et al., 2025).')+
    cartes([['Fragilité','Une vulnérabilité accrue aux événements de santé, liée à une diminution des réserves.'],['Perte d’autonomie ','Des difficultés dans les activités ou un besoin d’aide humaine.'],['Handicap','Une situation façonnée aussi par l’environnement et les moyens de compensation.']])+
    p('Ces dimensions se recouvrent sans être équivalentes. Une fragilité peut exister sans dépendance dans les activités quotidiennes, et un même diagnostic ne détermine pas le même besoin d’aide chez toutes les personnes (Tchalla et al., 2022).');
}

function definitionSimple() {
  return '<div data-definition-autonomie="20261023">'+
    '<div data-cadre-autonomie="20261023"><h4>Réaliser les activités et décider pour soi</h4>'+
    cartes([
      ['La dimension fonctionnelle', 'Se laver, s’habiller ou préparer ses repas : on regarde les difficultés et l’aide nécessaire (Katz et al., 1963 ; Lawton et Brody, 1969).'],
      ['La dimension décisionnelle', 'Pour consentir à un soin : comprendre ce qui est proposé, en saisir les conséquences pour soi, comparer les possibilités et exprimer son choix (Appelbaum, 2007).']
    ])+
    p('Avoir besoin d’aide pour un geste quotidien ne signifie pas automatiquement ne plus pouvoir décider pour soi (Gobillot et al., 2025).')+
    '<h4>Le choix de la recherche</h4>'+
    p('Cette thèse s’intéresse aux difficultés quotidiennes, aux besoins sociaux et aux aides à organiser sur les territoires. Elle retient donc la dimension fonctionnelle ; les choix et le consentement de la personne restent essentiels.')+'</div>'+
    '<h4>La définition retenue</h4>'+
    p('Ici, la perte d’autonomie signifie avoir des difficultés ou avoir besoin d’aide pour des activités quotidiennes.')+
    cartes([['Les gestes personnels','Les activités de base de la vie quotidienne (AVQ) : se laver, s’habiller, utiliser les toilettes, se transférer, assurer sa continence et manger (Katz et al., 1963).'],['L’organisation de la vie à domicile','Les activités instrumentales de la vie quotidienne (AIVQ) : téléphoner, faire les courses, préparer les repas, entretenir le logement, faire la lessive, gérer médicaments et argent ou utiliser les transports (Lawton et Brody, 1969).'],['Les fonctions qui permettent d’agir','Se déplacer, mémoriser, comprendre, s’orienter, voir, entendre et communiquer font aussi partie de l’évaluation (Hébert et al., 2001).']])+
    p('L’aide peut être un rappel, une surveillance, un coup de main pour une partie de l’activité ou une assistance complète. On distingue ce dont la personne a besoin et l’aide qu’elle reçoit réellement (Hébert et al., 2001).')+
    p('Le logement, les transports, les aides techniques et les proches peuvent faciliter les activités ou les rendre plus difficiles. Les difficultés dépendent donc aussi du milieu de vie (OMS, 2002).')+
    p('Les tâches complexes peuvent devenir difficiles avant les soins personnels. Cela invite à repérer un changement et à en comprendre les causes ; ce n’est pas une évolution obligatoire pour toutes les personnes (Jekel et al., 2015).')+
    p('Comprendre ce qui compte pour la personne et les activités qu’elle souhaite garder complète l’évaluation de ses difficultés (Gobillot et al., 2025).')+'</div>';
}

function appliquer(d, file) {
  const simple = path.basename(file)==='methode-vulgarisee.html';
  const contexte = d.querySelector('.these [data-rubrique="contexte"] .chapitre-contenu');
  if (!contexte) return false;
  const prefix = simple ? 'Perte d’autonomie :' : 'De l’incapacité à la perte';
  const cible = [...contexte.querySelectorAll('.these-section-cadre')].find(s=>s.querySelector('h3')?.textContent.startsWith(prefix));
  if (!cible) return false;
  const entete = cible.querySelector('.these-section-entete').outerHTML;
  const complement = cible.querySelector('[data-complement-litterature="mesure-simple"]')?.outerHTML || '';
  cible.innerHTML = entete+(simple ? definitionSimple()+complement : definition());
  if (!simple) {
    const mesure = [...contexte.querySelectorAll('.these-section-cadre')].find(s=>s.querySelector('h3')?.textContent.startsWith('Mesure :'));
    // Les listes AVQ/AIVQ sont désormais réunies dans la définition.
    const doublon = mesure?.querySelector(':scope > .these-cartes-synthese');
    if (doublon?.textContent.startsWith('Soins personnels')) doublon.remove();
    // Le bloc concept → choix → définition → mesure précède les liens avec les besoins sociaux.
    const besoins = [...contexte.querySelectorAll('.these-section-cadre')].find(s=>s.querySelector('h3')?.textContent.startsWith('Perte d’autonomie et besoins sociaux'));
    if (besoins && cible.parentNode===besoins.parentNode) {
      besoins.parentNode.insertBefore(cible,besoins);
      if (mesure?.parentNode===besoins.parentNode) besoins.parentNode.insertBefore(mesure,besoins);
    }
  }
  contexte.querySelectorAll('.these-section-entete > span').forEach((el,i)=>el.textContent=String(i+1).padStart(2,'0'));
  return true;
}

function transformer(html, file) {
  const {JSDOM} = require('jsdom');
  const dom = new JSDOM(html, {includeNodeLocations:true});
  const d = dom.window.document;
  const contexte = d.querySelector('.these [data-rubrique="contexte"] .chapitre-contenu');
  if (!contexte) throw new Error('Contexte introuvable : '+file);
  const loc = dom.nodeLocation(contexte);
  if (!appliquer(d,file)) throw new Error('Définition fonctionnelle introuvable : '+file);
  const edits = [{a:loc.startOffset,b:loc.endOffset,html:contexte.outerHTML}];
  const biblio = d.querySelector('.bibliographie-complete');
  if (biblio) {const n=dom.nodeLocation(biblio);edits.push({a:n.startOffset,b:n.endOffset,html:require('./bibliographie').render({lang:'fr',chemin:''})});}
  for (const x of edits.sort((a,b)=>b.a-a.a)) html=html.slice(0,x.a)+x.html+html.slice(x.b);
  dom.window.close();
  return html;
}

module.exports = {definition, definitionSimple, appliquer, transformer};
if (require.main===module) for (const file of ['index.html','methode-vulgarisee.html']) {
  const target=path.join(__dirname,'..',file);
  fs.writeFileSync(target,transformer(fs.readFileSync(target,'utf8'),file));
  console.log(file+' : définition et composantes actualisées.');
}
