const NBSP = ' ';
const CLE_OPTIONS = 'protocole.options.v1';
const RAYON_MINICARTE_M = 20;
const DISTANCE_DIRECTION_MAX = 60;
const DISTANCE_DIRECTION_PROCHE = 12;

export function fr(t) {
  if (t == null) return '';
  return String(t)
    .replace(/«[   ]*/g, '«' + NBSP)
    .replace(/[   ]*»/g, NBSP + '»')
    .replace(/(\S)[  ]+([;:!?])/g, '$1' + NBSP + '$2')
    .replace(/([\p{L}\p{N})\]’'"»])([;!?])/gu, '$1' + NBSP + '$2');
}

const ICONES = {
  chevron: '<path d="M9 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  croix: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  cadenas: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  journal: '<path d="M5.5 4.5h10.5a2.5 2.5 0 0 1 2.5 2.5v13.5H8a2.5 2.5 0 0 1-2.5-2.5z"/><path d="M5.5 18a2.5 2.5 0 0 1 2.5-2.5h10.5"/><path d="M9.5 8.5h5"/>',
  carte: '<path d="M3.5 6.5l5.5-2 6 2.5 5.5-2v13l-5.5 2-6-2.5-5.5 2z"/><path d="M9 4.5v13M15 7v13"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13"/>',
  reglages: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
  sortie: '<path d="M13.5 4.5h-7a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h7"/><path d="M10.5 12h10M17 8.5l3.5 3.5-3.5 3.5"/>',
  reprendre: '<path d="M8 5.5v13l10-6.5z"/>',
  rigueur: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/><path d="M8 10.6l1.9 1.9 3.3-3.4"/>',
  energie: '<path d="M13 3L5.5 13.5H12L11 21l7.5-10.5H12z"/>',
  stress: '<path d="M3 12.5h3.5l2.2-5.5 3.8 11 2.4-5.5H21"/>',
  confiance: '<path d="M12 3.5l7 2.8v5.4c0 4.3-3 7.7-7 8.8-4-1.1-7-4.5-7-8.8V6.3z"/><path d="M9 12l2.2 2.2L15.3 10"/>',
  calendrier: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
  personne: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.6-3.9 3.1-6.2 6.5-6.2s5.9 2.3 6.5 6.2"/>',
  personnes: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5c.5-3.4 2.6-5.3 5.5-5.3s5 1.9 5.5 5.3"/><circle cx="16.5" cy="9.5" r="2.4"/><path d="M15.8 14.2c2.4 0 4.2 1.6 4.7 4.6"/>',
  preuve: '<path d="M7 3.5h7l4.5 4.5v12a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4.5"/><path d="M9.5 12.5h6M9.5 16h4"/>',
  article: '<path d="M6 4.5h12v15H6z"/><path d="M9 8.5h6M9 11.5h6M9 14.5h3.5"/>',
  entretien: '<path d="M4.5 6.5h11v8h-6l-3.5 3v-3h-1.5z"/><path d="M15.5 9.5h4v7.5H18v2.5l-3-2.5h-4.5v-2"/>',
  donnees: '<path d="M5 19.5V11M10 19.5V5M15 19.5v-6M20 19.5V8.5"/>',
  observation: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  mission: '<path d="M6 21V4"/><path d="M6 4.5h11l-2.5 4 2.5 4H6"/>',
  protocole: '<path d="M14.5 4.5l5 5L10 19H5v-5z"/><path d="M12.5 6.5l5 5"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.9v.1"/>',
  alerte: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4.5M12 17.1v.1"/>',
  lieu: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  objectif: '<path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/>',
  main: '<path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11"/><path d="M15 10.5a1.5 1.5 0 0 1 3 0v4c0 3.6-2.4 6-5.8 6-2.3 0-3.7-1-5-2.8L4.7 14.2a1.5 1.5 0 0 1 2.3-1.9L9 14.5"/>',
  sauter: '<path d="M12 17V5.5M7 10.5l5-5 5 5"/><path d="M5.5 20h13"/>',
  courir: '<path d="M5.5 6.5l5.5 5.5-5.5 5.5M12.5 6.5l5.5 5.5-5.5 5.5"/>',
  son: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  graphismes: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="15.5" cy="8.5" r="1.5"/>',
  soustitres: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M6.5 14h4M12.5 14h5M6.5 10.5h7"/>',
  manette: '<path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.7 3.4a2.3 2.3 0 0 1-4 1L14.6 16H9.4l-1.6 1.8a2.3 2.3 0 0 1-4-1l-.7-3.4A4.5 4.5 0 0 1 7.5 8z"/><path d="M8 11v3M6.5 12.5h3"/><path d="M16 11.4v.1M17.6 13.1v.1"/>',
  clavier: '<rect x="2.5" y="6.5" width="19" height="11" rx="2"/><path d="M6 10h.1M9 10h.1M12 10h.1M15 10h.1M18 10h.1M7.5 14h9"/>',
  sceau: '<circle cx="12" cy="9.5" r="5.5"/><path d="M9 14.2L7.5 21l4.5-2.5 4.5 2.5-1.5-6.8"/><path d="M9.8 9.6l1.6 1.6 2.8-2.9"/>',
  corrections: '<path d="M14.5 4.5l5 5L10 19H5v-5z"/><path d="M4 21h16"/>',
  report: '<circle cx="12" cy="12.5" r="8"/><path d="M12 8v4.5l3 2"/><path d="M9.5 2.5h5"/>',
  vue: '<rect x="4" y="5" width="10" height="8" rx="1.5"/><rect x="10" y="11" width="10" height="8" rx="1.5"/>',
  menu: '<path d="M5 7.5h14M5 12h14M5 16.5h14"/>',
  etoile: '<path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
  souris: '<rect x="7" y="3.5" width="10" height="17" rx="5"/><path d="M12 7v3"/>',
  cible: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6"/>',
  patin: '<path d="M5.5 5h5.5v6.5l6.6 1.6a2 2 0 0 1 1.5 1.9v1H5.5z"/><path d="M4 19.5h16.5"/><path d="M8.5 16v3.5M16 16v3.5"/>',
  livres: '<path d="M4.5 5h3.5v14.5H4.5zM9.5 5H13v14.5H9.5z"/><path d="M14.6 5.9l3.4-.9 3.5 13.3-3.4.9z"/>',
  pavillon: '<path d="M3.5 20.5h17M6 20.5V11h12v9.5M9.5 11V6.5h5V11M11 6.5V3.5h2v3"/><path d="M9 14v3.5M12 14v3.5M15 14v3.5"/>',
  clsc: '<rect x="4.5" y="7" width="15" height="13.5" rx="1"/><path d="M12 10.2v6.3M8.9 13.4h6.2"/><path d="M9 7V4h6v3"/>',
  lutrin: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.6v4.6c3.2 2.1 7.8 2.1 11 0v-4.6"/><path d="M21.5 9.5v5.5"/>',
  rondelle: '<ellipse cx="12" cy="10" rx="7.5" ry="3"/><path d="M4.5 10v3.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V10"/>'
};

const FLECHE_ERIC = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.6l7.2 17.6L12 16.3l-7.2 3.9z" fill="#FFFFFF" stroke="#0755AD" stroke-width="1.8" stroke-linejoin="round"/></svg>';

function svg(nom, classe = '') {
  return `<svg class="ui-icone ${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONES[nom] || ''}</svg>`;
}

export function icone(nom, classe = '') {
  const t = document.createElement('template');
  t.innerHTML = svg(nom, classe);
  return t.content.firstElementChild;
}

function html(chaine) {
  const t = document.createElement('template');
  t.innerHTML = chaine;
  return t.content.firstElementChild;
}

function el(tag, attrs, ...enfants) {
  const n = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'texte') n.textContent = fr(v);
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
      else n.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const e of enfants.flat(Infinity)) {
    if (e == null || e === false || e === '') continue;
    n.append(e instanceof Node ? e : document.createTextNode(fr(e)));
  }
  return n;
}

const pince = (v, a, b) => Math.min(b, Math.max(a, v));
const melange = (a, b, t) => a + (b - a) * t;
const nombreFr = (v, dec = 0) => Number(v).toLocaleString('fr-CA', { minimumFractionDigits: dec, maximumFractionDigits: dec });

const COULEURS_PERSONNAGES = {
  eric: '#7FC0EE',
  direction_a: '#F29C92',
  direction_b: '#EDA7B3',
  bibliothecaire: '#45CFCB',
  collegue_doc: '#5FD98E',
  prof_seminaire: '#D6E3EB',
  intervenante_sad: '#9FD47F',
  gestionnaire_clsc: '#A9C9DD',
  prepose_accueil: '#B4DAD2',
  mme_protocole: '#E27A1B',
  jury: '#E6DCC8',
  entraineur_patin: '#A3D99B',
  usager: '#C9D9E3',
  etudiant: '#B9CCE0',
  joueur_hockey: '#B9CCE0',
  gardien: '#B9CCE0',
  chauffeur_zamboni: '#B9CCE0'
};

const STATS = [
  ['rigueur', 'Rigueur', 'rigueur'],
  ['energie', 'Énergie', 'energie'],
  ['stress', 'Stress', 'stress'],
  ['confiance', 'Confiance', 'confiance']
];

const SECTIONS_PROTOCOLE = [
  { id: 'contexte', titre: 'Contexte' },
  { id: 'question', titre: 'Question de recherche' },
  { id: 'objectifs', titre: 'Objectifs' },
  { id: 'methodes', titre: 'Méthodes' },
  { id: 'ethique', titre: 'Considérations éthiques' },
  { id: 'resultats', titre: 'Résultats anticipés' },
  { id: 'retombees', titre: 'Retombées' }
];

const CONSEILS = [
  'Fermer une porte derrière vous ralentit la direction.',
  'Un échec rapproche la direction ; une réussite brillante l’éloigne.',
  'Les preuves récoltées débloquent des réponses fortes devant le jury.',
  'Dans la salle de lecture, courir fait du bruit. On vous entendra.',
  'Certains échecs coûtent une semaine. Gardez un œil sur l’échéance.',
  'Le journal garde la trace de vos missions et de votre protocole.',
  'Parlez aux gens : un détail glané au détour d’un corridor peut tout changer.'
];

const CONSEILS_SALLE = [
  'Chaque activité se rejoue autant de fois que vous le voulez.',
  'Sur la glace, surveillez la jauge d’équilibre : près des bords rouges, la chute guette.',
  'Le menu pause permet de changer d’activité à tout moment.',
  'Les sous-titres, le contraste et les commandes se règlent dans les options.'
];

const FINS = {
  reussie: {
    icone: 'sceau',
    surtitre: 'Soutenance du protocole',
    titre: ['Protocole', 'accepté'],
    texte: 'Le comité approuve votre protocole. La collecte de données peut commencer.'
  },
  corrections: {
    icone: 'corrections',
    surtitre: 'Soutenance du protocole',
    titre: ['Accepté', 'avec corrections'],
    texte: 'Le comité approuve votre protocole, sous réserve de quelques corrections à remettre à la direction.'
  },
  report: {
    icone: 'report',
    surtitre: 'Soutenance du protocole',
    titre: ['Soutenance', 'reportée'],
    texte: 'Le jury demande une nouvelle version. Rien n’est perdu : reprenez au dernier chapitre et renforcez vos arguments.'
  }
};

const TOUCHES_CLAVIER = {
  interagir: ['KeyE'],
  sauter: ['Space'],
  courir: ['ShiftLeft'],
  journal: ['KeyJ'],
  carte: ['KeyM'],
  pause: ['Escape'],
  valider: ['Enter'],
  retour: ['Escape'],
  onglets: ['KeyQ', 'KeyE'],
  ongletPrec: ['KeyQ'],
  ongletSuiv: ['KeyE'],
  passer: ['Space'],
  deplacer: ['KeyW', 'KeyA', 'KeyS', 'KeyD'],
  regarder: ['@souris'],
  tirer: ['@souris'],
  defiler: ['ArrowUp', 'ArrowDown']
};

const TOUCHES_MANETTE = {
  interagir: ['A'],
  sauter: ['X'],
  courir: ['L3'],
  journal: ['Y'],
  carte: ['@vue'],
  pause: ['@menu'],
  tirer: ['RT'],
  valider: ['A'],
  retour: ['B'],
  onglets: ['LB', 'RB'],
  ongletPrec: ['LB'],
  ongletSuiv: ['RB'],
  passer: ['A'],
  deplacer: ['L'],
  regarder: ['R'],
  defiler: ['R']
};

const ALIAS_TOUCHES = { f: 'interagir', tab: 'journal', start: 'pause', e: 'interagir', espace: 'sauter', ' ': 'sauter', space: 'sauter', maj: 'courir', shift: 'courir', j: 'journal', m: 'carte', 'échap': 'pause', escape: 'pause', 'entrée': 'valider', enter: 'valider' };

const LIBELLES_CODES = { Space: 'Espace', ShiftLeft: 'Maj', ShiftRight: 'Maj', Escape: 'Échap', Enter: 'Entrée', Tab: 'Tab', Backspace: 'Retour', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' };
const AZERTY = { KeyW: 'Z', KeyA: 'Q', KeyQ: 'A', KeyZ: 'W' };

const CLE_PARTIE = 'protocole.partie.v1';
const CLE_RENCONTRES = 'protocole.ui.rencontres.v1';

const LIEUX = {
  campus: { titre: 'Pavillon Roger-Gaudry', sousTitre: 'Université de Montréal' },
  bibliotheque: { titre: 'Bibliothèque de la santé', sousTitre: 'Pavillon Roger-Gaudry, 6e étage' },
  clsc: { titre: 'CLSC des Faubourgs', sousTitre: 'Centre-Sud' },
  arena: { titre: 'Aréna du CEPSUM', sousTitre: 'Université de Montréal' },
  soutenance: { titre: 'Salle du conseil', sousTitre: 'Pavillon Roger-Gaudry' },
  metro: { titre: 'Métro de Montréal', sousTitre: 'Ligne bleue' }
};

const DIRECTIONS_CLAVIER = { ArrowUp: 'haut', ArrowDown: 'bas', ArrowLeft: 'gauche', ArrowRight: 'droite', KeyW: 'haut', KeyS: 'bas', KeyA: 'gauche', KeyD: 'droite' };

function lireStockage(cle) {
  try { return window.localStorage.getItem(cle); } catch { return null; }
}
function ecrireStockage(cle, valeur) {
  try { window.localStorage.setItem(cle, valeur); } catch { }
}

function media(requete) {
  try { return window.matchMedia(requete).matches; } catch { return false; }
}

function estTactile() {
  return media('(pointer: coarse)') && !media('(pointer: fine)');
}

function dispositionParDefaut() {
  const langues = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map(l => String(l).toLowerCase());
  const l = langues[0] || '';
  if (/^fr-(fr|be|lu|mc)/.test(l)) return 'azerty';
  return 'qwerty';
}

function optionsParDefaut() {
  return {
    qualite: 'auto',
    volumeGeneral: 0.9,
    volumeMusique: 0.6,
    volumeVoix: 1,
    volumeEffets: 0.85,
    sousTitres: true,
    tailleSousTitres: 'normale',
    fondSousTitres: 'leger',
    sensibilite: 1,
    inverserY: false,
    clavier: 'auto',
    reduireMouvement: media('(prefers-reduced-motion: reduce)'),
    contraste: media('(prefers-contrast: more)')
  };
}

const VALEURS_OPTIONS = {
  qualite: ['auto', 'bas', 'moyen', 'eleve', 'ultra'],
  tailleSousTitres: ['petite', 'normale', 'grande', 'tres_grande'],
  fondSousTitres: ['aucun', 'leger', 'opaque'],
  clavier: ['auto', 'qwerty', 'azerty']
};

function lireStockageJSON(cle) {
  const brut = lireStockage(cle);
  if (!brut) return {};
  try { return JSON.parse(brut) || {}; } catch { return {}; }
}

function lireOptions(fournies) {
  const defauts = optionsParDefaut();
  const lues = { ...lireStockageJSON(CLE_OPTIONS), ...(fournies && typeof fournies === 'object' ? fournies : {}) };
  if (lues.tailleSousTitres === 'moyenne') lues.tailleSousTitres = 'normale';
  const o = { ...defauts };
  for (const [k, v] of Object.entries(lues)) {
    if (!(k in defauts)) continue;
    if (typeof v !== typeof defauts[k]) continue;
    if (VALEURS_OPTIONS[k] && !VALEURS_OPTIONS[k].includes(v)) continue;
    o[k] = v;
  }
  return { options: o };
}

function ecrireOptions(o) {
  ecrireStockage(CLE_OPTIONS, JSON.stringify({ ...lireStockageJSON(CLE_OPTIONS), ...o }));
}

function chargerFeuille() {
  let href;
  try { href = new URL('./ui.css', import.meta.url).href; } catch { return; }
  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (l.href === href) return;
  }
  const lien = document.createElement('link');
  lien.rel = 'stylesheet';
  lien.href = href;
  document.head.append(lien);
}

function urlRessource(chemin) {
  try { return new URL(chemin, import.meta.url).href; } catch { return chemin; }
}

function initiales(nom) {
  const mots = String(nom || '').replace(/^(Pre|Pr|Dre|Dr|Mme|M\.|Me)\s+/i, '').split(/[\s-]+/).filter(Boolean);
  if (!mots.length) return '?';
  return (mots[0][0] + (mots.length > 1 ? mots[mots.length - 1][0] : '')).toUpperCase();
}

function visible(n) {
  if (!n || !n.isConnected) return false;
  if (n.disabled || n.hidden) return false;
  if (n.closest('[inert]') || n.closest('[hidden]')) return false;
  if (typeof n.checkVisibility === 'function') return n.checkVisibility({ visibilityProperty: true, checkVisibilityCSS: true });
  const cs = getComputedStyle(n);
  return cs.visibility !== 'hidden' && cs.display !== 'none' && n.getClientRects().length > 0;
}

export function initUI({ bus, etat = {}, racine, pauseSurPerteVerrou = true, autonome = false } = {}) {
  if (!bus || typeof bus.on !== 'function' || typeof bus.emit !== 'function') throw new Error('initUI : bus.on et bus.emit sont requis');
  chargerFeuille();
  if (!racine) {
    racine = document.getElementById('ui');
    if (!racine) { racine = document.createElement('div'); racine.id = 'ui'; document.body.append(racine); }
  }
  racine.classList.add('ui-racine');
  racine.setAttribute('lang', 'fr-CA');
  racine.replaceChildren();

  const lu = lireOptions(etat.options);
  const S = {
    base: 'aucun',
    mode: 'jeu',
    pile: [],
    entree: estTactile() ? 'tactile' : 'clavier',
    options: lu.options,
    hud: { stats: {}, semaines: null, pression: 0, objectif: null, chapitre: null },
    objectifTexte: null,
    zone: etat.zone || null,
    carte: { x: 0, z: 0, angle: 0, pnj: [] },
    cible: null,
    direction: { visible: false, distance: Infinity, etat: '' },
    journal: { missions: [], protocole: { titre: '', sousTitre: '', auteur: 'Éric Bernier', sections: SECTIONS_PROTOCOLE.map(s => ({ ...s })) }, preuves: [], personnages: [] },
    vus: { missions: new Set(), preuves: new Set(), protocole: new Set(), personnages: new Set() },
    nouveaux: { missions: false, protocole: false, preuves: false, personnages: false },
    selection: { missions: null, preuves: null },
    ongletJournal: 'missions',
    ongletOptions: 'affichage',
    ongletsVus: new Set(),
    dispositionDetectee: dispositionParDefaut(),
    deltaExterne: {},
    pageTitre: 'principal',
    modeJeu: 'histoire',
    salles: Array.isArray(etat.salles) ? etat.salles : ((etat.salles && etat.salles.salles) || []),
    derniereSalle: null,
    pauseEmise: -1e9,
    partieLancee: false,
    chargementDemarrage: false,
    chapitreCourant: null,
    carteEnAttente: null,
    lieuEnAttente: null,
    lieuxVus: {},
    journalExplicite: false,
    sectionsNouvelles: new Set(),
    preuvesNouvelles: new Set(),
    rencontres: (() => { try { const l = JSON.parse(lireStockage(CLE_RENCONTRES) || '[]'); return Array.isArray(l) ? l : []; } catch { return []; } })(),
    nomsVus: {},
    donneesPerso: null,
    hockey: { actif: false, possession: false },
    exercice: null,
    zoneId: null,
    chapitres: Array.isArray(etat.chapitres) ? etat.chapitres : [],
    sauvegarde: etat.sauvegarde || null,
    credits: Array.isArray(etat.credits) ? etat.credits : [],
    personnages: etat.personnages || {},
    conseils: Array.isArray(etat.conseils) && etat.conseils.length ? etat.conseils : CONSEILS,
    choix: null,
    invite: null,
    st: null,
    verrouActif: false,
    ignorerPerteVerrou: false,
    rafCarte: 0,
    detruit: false
  };
  if (etat.hud) Object.assign(S.hud, etat.hud);

  const emettre = (nom, donnees) => {
    try { bus.emit(nom, donnees); } catch (e) { console.error(e); }
  };
  let dernierSurvol = 0;
  const son = (nom) => {
    if (nom === 'ui_survol') {
      const t = performance.now();
      if (t - dernierSurvol < 70) return;
      dernierSurvol = t;
    }
    emettre('ui:son', { nom });
  };

  const nettoyages = [];
  const ecouter = (cible, type, fn, opts) => { cible.addEventListener(type, fn, opts); nettoyages.push(() => cible.removeEventListener(type, fn, opts)); };

  function nomDe(qui) {
    const p = S.personnages[qui];
    if (p && p.nom) return p.nom;
    const j = S.journal.personnages.find(x => x.id === qui);
    if (j && j.nom) return j.nom;
    return qui ? String(qui) : '';
  }
  function couleurDe(qui, explicite) {
    const p = S.personnages[qui];
    if (p && p.couleur) return p.couleur;
    if (qui && COULEURS_PERSONNAGES[qui]) return COULEURS_PERSONNAGES[qui];
    const racineId = String(qui || '').replace(/_\d+$/, '');
    if (COULEURS_PERSONNAGES[racineId]) return COULEURS_PERSONNAGES[racineId];
    return explicite || '#C9D9E3';
  }
  function portraitDe(qui, explicite) {
    const id = explicite || (S.personnages[qui] && S.personnages[qui].portrait) || null;
    if (!id) return null;
    if (/[./]/.test(id)) return id;
    if (etat.cheminPortraits) return `${etat.cheminPortraits}${id}.webp`;
    return null;
  }
  function monogramme(nom, portrait, classe = 'ui-monogramme') {
    const m = el('span', { class: classe, 'aria-hidden': 'true' }, initiales(nom));
    if (portrait) {
      const img = el('img', { src: portrait, alt: '' });
      img.addEventListener('error', () => { img.remove(); m.textContent = initiales(nom); }, { once: true });
      img.addEventListener('load', () => { m.textContent = ''; m.append(img); }, { once: true });
    }
    return m;
  }

  function dispositionEffective() {
    return S.options.clavier === 'auto' ? S.dispositionDetectee : S.options.clavier;
  }
  function libelleCode(code) {
    if (LIBELLES_CODES[code]) return LIBELLES_CODES[code];
    if (dispositionEffective() === 'azerty' && AZERTY[code]) return AZERTY[code];
    return code.replace(/^Key/, '').replace(/^Digit/, '');
  }
  function glyphe(action, entree = S.entree) {
    const conteneur = el('span', { class: 'ui-glyphes', 'data-glyphe': action, 'aria-hidden': 'true' });
    if (entree === 'tactile') {
      conteneur.append(el('span', { class: 'ui-glyphe ui-glyphe-tactile', html: svg('main') }));
      return conteneur;
    }
    if (entree === 'manette') {
      for (const b of TOUCHES_MANETTE[action] || ['A']) {
        if (b === '@vue') conteneur.append(el('span', { class: 'ui-glyphe ui-glyphe-manette', html: svg('vue') }));
        else if (b === '@menu') conteneur.append(el('span', { class: 'ui-glyphe ui-glyphe-manette', html: svg('menu') }));
        else conteneur.append(el('span', { class: 'ui-glyphe ui-glyphe-manette' + (b.length > 1 ? ' large' : '') }, b));
      }
      return conteneur;
    }
    for (const c of TOUCHES_CLAVIER[action] || [action]) {
      if (c === '@souris') { conteneur.append(el('span', { class: 'ui-glyphe', html: svg('souris') })); continue; }
      const lib = libelleCode(c);
      conteneur.append(el('kbd', { class: 'ui-glyphe' + (lib.length > 1 ? ' large' : '') }, lib));
    }
    return conteneur;
  }
  function glypheLibre(touche) {
    const action = ALIAS_TOUCHES[String(touche || '').toLowerCase()] || (TOUCHES_CLAVIER[touche] ? touche : null);
    if (action) return glyphe(action);
    const c = el('span', { class: 'ui-glyphes', 'data-glyphe-libre': touche, 'aria-hidden': 'true' });
    c.append(el('kbd', { class: 'ui-glyphe' + (String(touche).length > 1 ? ' large' : '') }, String(touche)));
    return c;
  }
  function glypheInvite(touche) {
    const t = String(touche || '').trim().toLowerCase();
    if (!t || ['e', 'f', 'a', 'x', 'interagir'].includes(t)) return glyphe('interagir');
    return glypheLibre(touche);
  }
  function rafraichirGlyphes() {
    for (const g of racine.querySelectorAll('[data-glyphe]')) g.replaceWith(glyphe(g.dataset.glyphe));
    majTouchesListe();
  }
  function definirEntree(type) {
    if (S.entree === type) return;
    S.entree = type;
    racine.dataset.entree = type;
    rafraichirGlyphes();
    emettre('ui:entree', { type });
  }

  const couches = {};
  const bases = {};

  /* ---------- Écran-titre ---------- */

  const titre = (() => {
    const item = (action, libelle, fn, sous, classe = '') => {
      const sousEl = el('span', { class: 'ui-menu-sous' }, sous || '');
      const b = el('button', { class: `ui-menu-item ${classe}`, type: 'button', 'data-nav': '', 'data-action': action, onclick: fn }, el('span', { class: 'ui-menu-libelle' }, libelle), sousEl);
      b._sous = sousEl;
      return b;
    };
    const grand = (action, libelle, sous, ic, fn) => {
      const b = el('button', { class: 'ui-menu-item ui-menu-grand', type: 'button', 'data-nav': '', 'data-action': action, onclick: fn },
        el('span', { class: 'ui-menu-icone', html: svg(ic) }),
        el('span', { class: 'ui-menu-textes' }, el('span', { class: 'ui-menu-libelle' }, libelle), el('span', { class: 'ui-menu-sous' }, sous)),
        el('span', { class: 'ui-menu-fleche', html: svg('chevron') }));
      b._sous = b.querySelector('.ui-menu-sous');
      return b;
    };
    const items = {
      histoire: grand('histoire', 'Mode histoire', 'Études doctorales', 'journal', () => { son('ui_clic'); pageTitre('histoire', true); }),
      salle: grand('salle', 'Mode salle', 'Aller droit à une activité', 'cible', () => { son('ui_clic'); ouvrirCouche('salles'); }),
      continuer: item('continuer', 'Continuer', () => { son('ui_clic'); S.modeJeu = 'histoire'; emettre('partie:continuer', {}); }),
      nouvelle: item('nouvelle', 'Nouvelle partie', nouvellePartie),
      chapitres: item('chapitres', 'Chapitres', () => { son('ui_clic'); ouvrirCouche('chapitres'); }),
      retour: item('retour', 'Retour', () => { son('ui_clic'); pageTitre('principal', true); }, '', 'ui-menu-retour'),
      options: item('options', 'Options', () => { son('ui_clic'); ouvrirCouche('options'); }),
      credits: item('credits', 'Crédits', () => { son('ui_clic'); ouvrirCouche('credits'); })
    };
    items.histoire.setAttribute('data-defaut', '');
    const principal = el('nav', { class: 'ui-menu ui-titre-page', 'data-page': 'principal', 'aria-label': 'Menu principal', 'data-boucle': '' },
      items.histoire, items.salle, el('div', { class: 'ui-menu-sep', 'aria-hidden': 'true' }), items.options, items.credits);
    const histoire = el('nav', { class: 'ui-menu ui-titre-page', 'data-page': 'histoire', 'aria-label': 'Mode histoire', 'data-boucle': '', hidden: '' },
      el('p', { class: 'ui-titre-page-tete' }, el('span', { html: svg('journal') }), 'Mode histoire · Études doctorales'),
      items.continuer, items.nouvelle, items.chapitres, el('div', { class: 'ui-menu-sep', 'aria-hidden': 'true' }), items.retour);
    const menu = el('div', { class: 'ui-titre-menus' }, principal, histoire);
    const accroche = el('p', { class: 'ui-titre-accroche ui-entree d2' }, etat.accroche || 'Faites accepter votre protocole de thèse avant la soutenance.');
    const e = el('section', { class: 'ui-couche ui-titre', 'aria-label': 'Écran-titre', inert: '' },
      el('div', { class: 'ui-voile' }),
      el('div', { class: 'ui-titre-contenu' },
        el('header', { class: 'ui-titre-entete' },
          el('p', { class: 'ui-surtitre ui-entree' }, el('span', { class: 'ui-points', 'aria-hidden': 'true' }, el('i'), el('i')), 'Doctorat en santé publique'),
          el('h1', { class: 'ui-titre-jeu ui-entree d1' }, 'Protocole'),
          el('span', { class: 'ui-titre-filet ui-entree d2', 'aria-hidden': 'true' }),
          accroche),
        el('div', { class: 'ui-entree d3' }, menu)));
    return { el: e, items, pages: { principal, histoire } };
  })();
  bases.titre = titre.el;

  function pageTitre(nom, avecFocus = false) {
    const page = titre.pages[nom] ? nom : 'principal';
    const avant = S.pageTitre;
    S.pageTitre = page;
    for (const [k, n] of Object.entries(titre.pages)) {
      n.hidden = k !== page;
      n.classList.toggle('arrivee', k === page && avant && avant !== page);
    }
    majAide();
    if (avecFocus) requestAnimationFrame(() => {
      const zone = titre.pages[page];
      const cible = (page === 'principal' && avant === 'histoire') ? titre.items.histoire : (navigables(zone).find(n => n.hasAttribute('data-defaut')) || navigables(zone)[0]);
      if (cible) focaliser(cible);
    });
  }

  function resumeSauvegarde(s) {
    if (!s) return '';
    if (typeof s === 'string') return s;
    if (s.resume) return s.resume;
    const morceaux = [];
    if (s.chapitre) morceaux.push(s.chapitre);
    if (s.lieu) morceaux.push(s.lieu);
    if (s.semaines != null) morceaux.push(`${s.semaines} semaine${Math.abs(s.semaines) > 1 ? 's' : ''}`);
    return morceaux.join(' · ');
  }
  function partieCourante() {
    try { return etat.partie || null; } catch { return null; }
  }
  function sauvegardeCourante() {
    if (S.sauvegarde) return S.sauvegarde;
    let existe = false;
    try { existe = !!etat.existeSauvegarde; } catch { existe = false; }
    if (!existe) return null;
    const p = lireStockageJSON(CLE_PARTIE);
    const chs = (etat.scenario && etat.scenario.chapitres) || [];
    const i = chs.findIndex(c => c.id === p.chapitre);
    return { existe: true, chapitre: i >= 0 ? libelleChapitre({ numero: i + 1, titre: chs[i].titre }) : '', semaines: Number.isFinite(p.semaines) ? p.semaines : null };
  }
  function majTitre() {
    const s = sauvegardeCourante();
    const existe = !!(s && (s.existe !== false));
    titre.items.continuer.hidden = !existe;
    titre.items.continuer._sous.textContent = fr(resumeSauvegarde(s));
    titre.items.continuer._sous.hidden = !titre.items.continuer._sous.textContent;
    titre.items.nouvelle._sous.hidden = true;
    titre.items.continuer.toggleAttribute('data-defaut', existe);
    titre.items.nouvelle.toggleAttribute('data-defaut', !existe);
    for (const k of ['chapitres', 'options', 'credits', 'retour']) titre.items[k]._sous.hidden = true;
  }
  async function nouvellePartie() {
    son('ui_clic');
    const sv = sauvegardeCourante();
    if (sv && sv.existe !== false) {
      const ok = await confirmer({ surtitre: 'Nouvelle partie', titre: 'Recommencer depuis le début ?', texte: 'Votre progression actuelle sera remplacée.', ok: 'Commencer', annuler: 'Annuler' });
      if (!ok) return;
    }
    S.modeJeu = 'histoire';
    emettre('partie:nouvelle', {});
  }

  /* ---------- Chargement ---------- */

  const chargement = (() => {
    const image = el('div', { class: 'ui-chargement-image', hidden: '' });
    const surtitre = el('p', { class: 'ui-surtitre' }, '');
    const lieu = el('h2', { class: 'ui-chargement-lieu' }, '');
    const sous = el('p', { class: 'ui-chargement-sous' }, '');
    const conseil = el('p', {}, '');
    const barre = el('div', { class: 'ui-progression-barre' });
    const texte = el('span', { class: 'ui-progression-texte' }, '');
    const pct = el('span', { class: 'ui-progression-pct' }, '0 %');
    const piste = el('div', { class: 'ui-progression-piste', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', 'aria-label': 'Chargement' }, barre);
    const e = el('section', { class: 'ui-couche ui-chargement', 'aria-label': 'Chargement', 'aria-busy': 'true', inert: '' },
      image,
      el('div', { class: 'ui-chargement-signe', 'aria-hidden': 'true' }, el('i'), el('i')),
      el('div', { class: 'ui-chargement-bas' },
        el('div', { class: 'ui-entree' }, surtitre, lieu, sous),
        el('div', { class: 'ui-chargement-conseil ui-entree d1' }, el('p', { class: 'ui-surtitre' }, 'Conseil'), conseil),
        el('div', { class: 'ui-progression ui-entree d2' }, texte, piste, pct)));
    return { el: e, image, surtitre, lieu, sous, conseil, barre, texte, pct, piste, indice: Math.floor(Math.random() * 1000), minuterie: 0 };
  })();
  bases.chargement = chargement.el;

  function majChargement(d = {}) {
    let p = Number(d.progression);
    if (!Number.isFinite(p)) p = 0;
    if (p > 1.0001) p = p / 100;
    p = pince(p, 0, 1);
    chargement.el.style.setProperty('--p', p);
    chargement.barre.style.setProperty('--p', p);
    chargement.pct.textContent = `${Math.round(p * 100)}${NBSP}%`;
    chargement.piste.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    if (d.texte != null) chargement.texte.textContent = fr(d.texte);
    const z = S.chargementDemarrage ? null : (d.zone && typeof d.zone === 'object' ? d.zone : (typeof d.zone === 'string' ? lieuDe(d.zone) : null));
    const t = d.titre || (z && z.titre);
    const st = d.sousTitre != null ? d.sousTitre : (z ? (z.sousTitre || '') : null);
    if (t) chargement.lieu.textContent = fr(t);
    if (st != null) chargement.sous.textContent = fr(st);
    if (d.chapitre != null) chargement.surtitre.textContent = fr(typeof d.chapitre === 'object' ? libelleChapitre(d.chapitre) : d.chapitre);
    if (d.conseil) chargement.conseil.textContent = fr(d.conseil);
    if (d.image) { chargement.image.style.backgroundImage = `url("${d.image}")`; chargement.image.hidden = false; }
    chargement.el.setAttribute('aria-busy', p < 1 ? 'true' : 'false');
  }
  function lieuDe(id) {
    return S.lieuxVus[id] || LIEUX[id] || null;
  }
  function conseilsActifs() {
    return S.modeJeu === 'salle' ? CONSEILS_SALLE : S.conseils;
  }
  function conseilSuivant() {
    const liste = conseilsActifs();
    if (!liste.length) return;
    chargement.indice = (chargement.indice + 1) % liste.length;
    chargement.conseil.style.opacity = '0';
    setTimeout(() => { chargement.conseil.textContent = fr(liste[chargement.indice]); chargement.conseil.style.opacity = ''; }, 260);
  }
  function demarrerConseils() {
    clearInterval(chargement.minuterie);
    const liste = conseilsActifs();
    chargement.conseil.textContent = fr(liste[chargement.indice % liste.length]);
    chargement.minuterie = setInterval(conseilSuivant, 8000);
  }

  /* ---------- HUD ---------- */

  const hud = (() => {
    const chapitre = el('p', { class: 'ui-hud-chapitre' }, '');
    const etiquette = el('p', { class: 'ui-hud-etiquette' }, icone('objectif'), el('span', {}, 'Objectif'));
    const objTexte = el('span', {}, '');
    const objDist = el('span', { class: 'ui-dist' }, '');
    const objectif = el('div', { class: 'ui-hud-objectif vide', role: 'status', 'aria-live': 'polite' }, chapitre, etiquette, el('p', { class: 'ui-hud-objectif-texte' }, objTexte, objDist));

    const semNombre = el('span', { class: 'ui-semaines-nombre' }, '–');
    const semLib = el('span', { class: 'ui-semaines-lib', html: '<span class="long">semaines<br>avant la soutenance</span><span class="court">sem.</span>' });
    const semaines = el('div', { class: 'ui-semaines' }, semNombre, semLib);
    const jauges = {};
    const liste = el('ul', { class: 'ui-jauges' }, STATS.map(([cle, nom, ic]) => {
      const barre = el('div', { class: 'ui-jauge-barre' });
      const val = el('span', { class: 'ui-jauge-val' }, '–');
      const delta = el('span', { class: 'ui-jauge-delta', 'aria-hidden': 'true' }, '');
      const li = el('li', { class: 'ui-jauge', 'data-cle': cle, title: nom }, icone(ic), el('span', { class: 'ui-jauge-nom' }, nom), val, el('div', { class: 'ui-jauge-piste' }, barre), delta);
      jauges[cle] = { li, barre, val, delta, valeur: null };
      return li;
    }));
    const droite = el('div', { class: 'ui-hud-droite' }, semaines, liste);
    const etiquettes = el('div', { class: 'ui-etiquettes', 'aria-live': 'polite' });

    const exTitre = el('p', { class: 'ui-exercice-titre' }, '');
    const exConsigne = el('p', { class: 'ui-exercice-consigne' }, '');
    const exBarre = el('div', { class: 'ui-progression-barre' });
    const exTexte = el('p', { class: 'ui-exercice-texte' }, '');
    const exSceau = el('span', { class: 'ui-exercice-sceau', 'aria-hidden': 'true' });
    const exercice = el('div', { class: 'ui-exercice', role: 'status' },
      el('p', { class: 'ui-surtitre' }, el('span', { class: 'ui-points', 'aria-hidden': 'true' }, el('i'), el('i')), el('span', { class: 'ui-exercice-type' }, 'Exercice')),
      exTitre, exConsigne,
      el('div', { class: 'ui-exercice-ligne' }, el('div', { class: 'ui-progression-piste' }, exBarre), exSceau),
      exTexte);
    const colonne = el('div', { class: 'ui-hud-colonne' }, droite, etiquettes, exercice);

    const dirEtat = el('span', { class: 'ui-direction-etat' }, '');
    const dirStatut = el('p', { class: 'ui-direction-statut' }, '');
    const dirAnnonce = el('span', { class: 'ui-sr', 'aria-live': 'assertive' }, '');
    const direction = el('div', { class: 'ui-hud-direction', 'aria-hidden': 'true' },
      el('div', { class: 'ui-direction-entete' }, el('span', { class: 'ui-direction-nom' }, 'La direction'), dirEtat),
      el('div', { class: 'ui-direction-piste' }, el('span', { class: 'ui-direction-trace' }), el('span', { class: 'ui-direction-pastille' }), el('span', { class: 'ui-direction-eric', html: svg('personne') })),
      dirStatut);

    const plan = el('div', { class: 'ui-mc-plan', hidden: '' });
    const marques = el('div', { class: 'ui-mc-marques' });
    const monde = el('div', { class: 'ui-mc-monde' }, plan, marques);
    const cone = el('div', { class: 'ui-mc-cone' });
    const fleche = el('div', { class: 'ui-mc-eric', html: FLECHE_ERIC });
    const disque = el('div', { class: 'ui-mc-disque' }, monde, cone, fleche, el('div', { class: 'ui-mc-ombre' }));
    const mcN = el('span', { class: 'ui-mc-n' }, 'N');
    const mcLieu = el('p', { class: 'ui-mc-lieu' }, '');
    const minicarte = el('div', { class: 'ui-minicarte', 'aria-hidden': 'true' }, disque, mcN, mcLieu);

    const inviteTexte = el('span', { class: 'ui-invite-texte' }, '');
    const inviteGlyphe = el('span', {}, '');
    const invite = el('div', { class: 'ui-invite', role: 'status' }, inviteGlyphe, inviteTexte);
    invite.addEventListener('click', () => {
      if (S.entree === 'tactile' && S.invite) emettre('tactile:action', { action: 'interagir' });
    });

    const ptEric = el('span', { class: 'ui-pointage-score' }, '0');
    const ptAdverse = el('span', { class: 'ui-pointage-score' }, '0');
    const ptChrono = el('span', { class: 'ui-pointage-chrono' }, '');
    const ptRondelle = el('span', { class: 'ui-pointage-rondelle', 'aria-hidden': 'true' });
    const ptNomEric = el('span', { class: 'ui-pointage-nom' }, 'Éric');
    const ptNomAdverse = el('span', { class: 'ui-pointage-nom' }, 'Adversaires');
    const ptPeriode = el('span', { class: 'ui-pointage-periode', hidden: '' }, '');
    const ptTirs = el('span', { class: 'ui-pointage-tirs', hidden: '' }, '');
    const ptPenEric = el('span', { class: 'ui-pointage-pen' }, '');
    const ptPenAdverse = el('span', { class: 'ui-pointage-pen' }, '');
    const pointage = el('div', { class: 'ui-pointage', role: 'status' },
      el('div', { class: 'ui-pointage-equipe eric' }, ptPenEric, ptRondelle, ptNomEric, ptEric),
      el('div', { class: 'ui-pointage-centre' }, ptPeriode, ptChrono, ptTirs),
      el('div', { class: 'ui-pointage-equipe adverse' }, ptAdverse, ptNomAdverse, ptPenAdverse));
    const charge = el('div', { class: 'ui-charge', 'aria-hidden': 'true' }, el('span', { class: 'ui-charge-anneau' }), el('span', { class: 'ui-charge-point' }));

    const eqMarque = el('span', { class: 'ui-equilibre-marque' });
    const equilibre = el('div', { class: 'ui-equilibre', 'aria-hidden': 'true' },
      el('p', { class: 'ui-equilibre-nom' }, 'Équilibre'),
      el('div', { class: 'ui-equilibre-piste' }, el('span', { class: 'ui-equilibre-centre' }), eqMarque));

    const lieuSur = el('p', { class: 'ui-surtitre' }, '');
    const lieuTitre = el('p', { class: 'ui-lieu-titre' }, '');
    const lieuSous = el('p', { class: 'ui-lieu-sous' }, '');
    const lieu = el('div', { class: 'ui-lieu-arrivee', role: 'status' }, lieuSur, lieuTitre, el('span', { class: 'ui-lieu-filet', 'aria-hidden': 'true' }), lieuSous);

    const e = el('section', { class: 'ui-couche ui-hud ui-traversable', 'aria-label': 'Interface de jeu', inert: '' }, objectif, colonne, direction, pointage, minicarte, invite, charge, equilibre, lieu, dirAnnonce);
    return {
      el: e, chapitre, etiquette, objectif, objTexte, objDist, semaines, semNombre, semLib, jauges, colonne, etiquettes,
      exercice, exTitre, exConsigne, exBarre, exTexte, exSceau,
      direction, dirEtat, dirStatut, dirAnnonce, plan, marques, monde, cone, fleche, disque, mcN, mcLieu, minicarte,
      invite, inviteTexte, inviteGlyphe, pointage, ptEric, ptAdverse, ptChrono, ptRondelle, ptNomEric, ptNomAdverse, ptPeriode, ptTirs, ptPenEric, ptPenAdverse, charge, equilibre, eqMarque,
      lieu, lieuSur, lieuTitre, lieuSous, pool: new Map()
    };
  })();
  bases.hud = hud.el;
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => {
      const r = hud.objectif.getBoundingClientRect();
      const base = racine.getBoundingClientRect();
      if (r.height) hud.el.style.setProperty('--obj-bas', `${Math.round(r.bottom - base.top)}px`);
    });
    ro.observe(hud.objectif);
    nettoyages.push(() => ro.disconnect());
  }

  function libelleChapitre(c) {
    if (!c) return '';
    if (typeof c === 'string') return c;
    const n = c.numero != null ? `Chapitre ${c.numero}` : '';
    return [n, c.titre].filter(Boolean).join(' · ');
  }

  let minuterieObjectif = 0;
  function definirObjectif(obj) {
    const texte = obj == null ? null : (typeof obj === 'string' ? obj : obj.texte);
    if (obj && typeof obj === 'object' && obj.cible) S.cible = obj.cible;
    if (!texte) {
      hud.objectif.classList.add('vide');
      S.objectifTexte = null;
      return;
    }
    if (texte === S.objectifTexte) return;
    const premier = S.objectifTexte == null;
    S.objectifTexte = texte;
    hud.objTexte.textContent = fr(texte);
    hud.objectif.classList.remove('vide');
    rejouerObjectif();
    if (!premier) son('ui_succes');
    majDistanceObjectif();
  }
  function rejouerObjectif() {
    hud.objectif.classList.remove('nouveau');
    void hud.objectif.offsetWidth;
    hud.objectif.classList.add('nouveau');
    hud.etiquette.lastChild.textContent = 'Nouvel objectif';
    clearTimeout(minuterieObjectif);
    minuterieObjectif = setTimeout(() => {
      hud.objectif.classList.remove('nouveau');
      hud.etiquette.lastChild.textContent = 'Objectif';
    }, 4200);
  }

  function definirModeJeu(m) {
    S.modeJeu = m === 'salle' ? 'salle' : 'histoire';
    racine.classList.toggle('ui-mode-salle', S.modeJeu === 'salle');
  }
  function majHUD(d = {}) {
    if ('mode' in d) definirModeJeu(d.mode);
    if (d.stats) {
      for (const [cle] of STATS) {
        if (d.stats[cle] == null) continue;
        const j = hud.jauges[cle];
        const v = pince(Math.round(Number(d.stats[cle]) || 0), 0, 100);
        if (j.valeur != null && v !== j.valeur) {
          const diff = v - j.valeur;
          const bon = cle === 'stress' ? diff < 0 : diff > 0;
          j.li.classList.remove('flash-plus', 'flash-moins');
          void j.li.offsetWidth;
          j.li.classList.add(bon ? 'flash-plus' : 'flash-moins');
          if (performance.now() - (S.deltaExterne[cle] || -1e9) > 1500) {
            j.delta.textContent = (diff > 0 ? '+' : '−') + Math.abs(diff);
            j.delta.className = 'ui-jauge-delta ' + (bon ? 'plus' : 'moins');
            void j.delta.offsetWidth;
            j.delta.classList.add('voir');
          }
        }
        j.valeur = v;
        j.barre.style.setProperty('--v', v);
        j.val.textContent = String(v);
        const alerte = cle === 'stress' ? v >= 70 : (cle === 'energie' ? v <= 20 : v <= 15);
        j.li.classList.toggle('alerte', alerte);
        j.li.setAttribute('aria-label', `${STATS.find(s => s[0] === cle)[1]} : ${v} sur 100`);
      }
      S.hud.stats = { ...S.hud.stats, ...d.stats };
    }
    if (d.semaines != null) {
      const n = Math.max(0, Math.round(Number(d.semaines)));
      const avant = S.hud.semaines;
      hud.semNombre.textContent = String(n);
      hud.semLib.innerHTML = `<span class="long">${n === 1 ? 'semaine' : 'semaines'}<br>avant la soutenance</span><span class="court">sem.</span>`;
      hud.semaines.setAttribute('aria-label', `${n} ${n === 1 ? 'semaine' : 'semaines'} avant la soutenance`);
      hud.semaines.classList.toggle('critique', n <= 3);
      if (avant != null && n < avant) {
        hud.semaines.classList.remove('baisse');
        void hud.semaines.offsetWidth;
        hud.semaines.classList.add('baisse');
      }
      S.hud.semaines = n;
    }
    if (d.pression != null) S.hud.pression = Number(d.pression) || 0;
    if (d.chapitre !== undefined) {
      let c = d.chapitre;
      if (typeof c === 'string' && S.chapitreCourant && S.chapitreCourant.titre === c) c = S.chapitreCourant;
      S.hud.chapitre = c;
      hud.chapitre.textContent = fr(libelleChapitre(c));
      hud.chapitre.hidden = !hud.chapitre.textContent;
    }
    if (d.objectif !== undefined) { S.hud.objectif = d.objectif; definirObjectif(d.objectif); }
    if (d.cible !== undefined) { S.cible = d.cible; planifierCarte(); }
  }

  function majInvite(d) {
    if (!d || !d.texte) {
      S.invite = null;
      hud.invite.classList.remove('visible');
      tactile.interagir.classList.remove('dispo');
      return;
    }
    S.invite = d;
    hud.inviteTexte.textContent = fr(d.texte);
    hud.inviteGlyphe.replaceChildren(glypheInvite(d.touche));
    hud.invite.classList.add('visible');
    tactile.interagir.classList.add('dispo');
  }

  const STATUTS_DIRECTION = {
    traque: 'La direction te suit',
    cherche: 'La direction te cherche',
    repart: 'Elle a perdu ta trace',
    rencontre: 'Rencontre de suivi'
  };
  let directionPrecedente = '';
  function majDirection(d) {
    const statut = d && d.statut ? String(d.statut) : '';
    const vis = !!(d && d.visible) && statut !== 'absente';
    const dist = d && Number.isFinite(Number(d.distance)) ? Number(d.distance) : Infinity;
    S.direction = { visible: vis, distance: dist, statut };
    hud.direction.classList.toggle('visible', vis);
    hud.direction.dataset.statut = statut || '';
    if (!vis) {
      vignette.style.setProperty('--a', '0');
      vignette.classList.remove('bat');
      hud.direction.classList.remove('proche');
      directionPrecedente = '';
      return;
    }
    const p = pince(1 - dist / DISTANCE_DIRECTION_MAX, 0, 1);
    const pouls = melange(1.9, 0.42, p);
    for (const n of [hud.direction, racine]) n.style.setProperty('--pouls', `${pouls.toFixed(2)}s`);
    hud.direction.style.setProperty('--p', p.toFixed(3));
    const proche = dist <= DISTANCE_DIRECTION_PROCHE && statut !== 'repart';
    let etatTexte;
    if (proche) etatTexte = 'Tout près';
    else if (dist <= 30) etatTexte = 'Elle approche';
    else etatTexte = 'Au loin';
    if (statut === 'repart') etatTexte = 'Elle s’éloigne';
    const m = Number.isFinite(dist) ? `${Math.round(dist)}${NBSP}m` : '';
    hud.dirEtat.textContent = fr(m ? `${etatTexte} · ${m}` : etatTexte);
    let phrase = STATUTS_DIRECTION[statut] || '';
    if (statut === 'traque' && proche) phrase = 'Elle est sur tes talons !';
    hud.dirStatut.textContent = fr(phrase);
    hud.dirStatut.hidden = !phrase;
    hud.direction.classList.toggle('proche', proche);
    const a = statut === 'repart' ? 0 : pince((DISTANCE_DIRECTION_PROCHE + 4 - dist) / (DISTANCE_DIRECTION_PROCHE + 4), 0, 1) * 0.75;
    vignette.style.setProperty('--a', a.toFixed(3));
    vignette.classList.toggle('bat', a > 0.05);
    const annonce = phrase || etatTexte;
    if (annonce !== directionPrecedente) {
      hud.dirAnnonce.textContent = fr(phrase ? phrase : `La direction : ${etatTexte}`);
      directionPrecedente = annonce;
    }
  }

  /* ---------- Étiquettes de changement ---------- */

  const NOMS_STATS = { rigueur: 'Rigueur', energie: 'Énergie', stress: 'Stress', confiance: 'Confiance' };
  function etiquette(texte, genre, ic, duree = 2.8) {
    const n = el('p', { class: `ui-etiquette ${genre}` }, ic ? icone(ic) : null, el('span', {}, texte));
    hud.etiquettes.append(n);
    while (hud.etiquettes.children.length > 4) hud.etiquettes.firstElementChild.remove();
    void n.offsetWidth;
    n.classList.add('ouvert');
    setTimeout(() => { n.classList.add('sortie'); setTimeout(() => n.remove(), 500); }, duree * 1000);
  }
  function statChangement(d) {
    if (!d) return;
    const duree = Number(d.duree) > 0 ? Number(d.duree) : 2.8;
    if (d.preuve) {
      const dict = (etat.scenario && etat.scenario.preuves) || {};
      const idP = typeof d.preuve === 'string' ? d.preuve : (d.preuve.id || '');
      const t = typeof d.preuve === 'string' ? ((dict[d.preuve] && dict[d.preuve].titre) || d.preuve) : (d.preuve.titre || d.preuve.nom || (dict[idP] && dict[idP].titre) || '');
      if (idP) S.preuvesNouvelles.add(idP);
      S.nouveaux.preuves = true;
      journal.onglets.boutons.preuves._point.hidden = false;
      etiquette(`Preuve récoltée : ${t}`, 'preuve', 'preuve', Math.max(duree, 3.6));
      son('ui_succes');
      return;
    }
    const cle = String(d.stat || '');
    const delta = Number(d.delta);
    if (!cle || !Number.isFinite(delta) || delta === 0) return;
    const signe = delta > 0 ? '+' : '−';
    const n = Math.abs(Math.round(delta * 10) / 10);
    const nombre = nombreFr(n, Number.isInteger(n) ? 0 : 1);
    if (cle === 'semaines' || cle === 'semaine') {
      etiquette(`${signe}${nombre} semaine${n > 1 ? 's' : ''}`, delta < 0 ? 'moins' : 'plus', 'calendrier', duree);
      if (delta < 0) son('ui_echec');
      return;
    }
    if (cle === 'pression') {
      etiquette(delta > 0 ? 'La direction se rapproche' : 'La direction s’éloigne', delta > 0 ? 'moins' : 'plus', 'personne', duree);
      return;
    }
    S.deltaExterne[cle] = performance.now();
    const bon = cle === 'stress' ? delta < 0 : delta > 0;
    etiquette(`${signe}${nombre} ${NOMS_STATS[cle] || cle}`, bon ? 'plus' : 'moins', STATS.find(s => s[0] === cle)?.[2] || null, duree);
  }
  function echec(d) {
    vignette.classList.remove('eclat');
    void vignette.offsetWidth;
    vignette.classList.add('eclat');
    setTimeout(() => vignette.classList.remove('eclat'), 1400);
    son('ui_echec');
    if (d && Number(d.pression) > 0 && !(S.direction && S.direction.visible)) etiquette('La direction se rapproche', 'moins', 'personne');
  }

  /* ---------- Patinoire ---------- */

  function majPatin(d) {
    if (!d) { hud.equilibre.classList.remove('visible'); return; }
    const e = pince(Number(d.equilibre) || 0, -1, 1);
    hud.eqMarque.style.setProperty('--e', e.toFixed(3));
    const montrer = Math.abs(e) > 0.15 || !!S.exercice;
    hud.equilibre.classList.toggle('visible', montrer);
    hud.equilibre.classList.toggle('danger', Math.abs(e) > 0.7);
    hud.equilibre.classList.toggle('instable', Math.abs(e) > 0.4 && Math.abs(e) <= 0.7);
  }

  let minuterieExercice = 0;
  function majExercice(d) {
    clearTimeout(minuterieExercice);
    if (!d) { S.exercice = null; hud.exercice.classList.remove('visible', 'reussi', 'rate'); return; }
    const nouveau = !S.exercice || S.exercice.titre !== d.titre;
    S.exercice = { ...(S.exercice || {}), ...d };
    hud.exercice.querySelector('.ui-exercice-type').textContent = fr(d.type ? ({ patin: 'Patin', tir: 'Tir', passe: 'Passe', slalom: 'Slalom', freinage: 'Freinage' }[d.type] || 'Exercice') : 'Exercice');
    if (d.titre != null) hud.exTitre.textContent = fr(d.titre);
    if (d.consigne != null) hud.exConsigne.textContent = fr(d.consigne);
    hud.exConsigne.hidden = !hud.exConsigne.textContent;
    const p = pince(Number(d.progression) || 0, 0, 1);
    hud.exBarre.style.width = `${(p * 100).toFixed(1)}%`;
    if (d.texte != null) hud.exTexte.textContent = fr(d.texte);
    hud.exTexte.hidden = !hud.exTexte.textContent;
    hud.exercice.classList.add('visible');
    if (nouveau) hud.exercice.classList.remove('reussi', 'rate');
    if (d.etat === 'reussi' || d.etat === 'rate') {
      hud.exercice.classList.remove('reussi', 'rate');
      void hud.exercice.offsetWidth;
      hud.exercice.classList.add(d.etat);
      hud.exSceau.innerHTML = svg(d.etat === 'reussi' ? 'check' : 'croix');
      if (d.etat === 'reussi') hud.exBarre.style.width = '100%';
      son(d.etat === 'reussi' ? 'ui_succes' : 'ui_echec');
      minuterieExercice = setTimeout(() => majExercice(null), 4200);
    } else {
      hud.exSceau.innerHTML = '';
    }
    hud.equilibre.classList.add('visible');
  }

  function formatChrono(s) {
    const t = Math.max(0, Math.ceil(Number(s) || 0));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  }
  function majHockey(d) {
    if (!d) { S.hockey.actif = false; hud.pointage.classList.remove('visible'); hud.charge.classList.remove('visible'); hud.el.classList.remove('avec-pointage'); tactile.tirer.hidden = true; return; }
    const partie = d.score != null || d.chrono != null;
    S.hockey = { ...S.hockey, ...d, actif: true };
    hud.pointage.classList.toggle('visible', partie);
    hud.el.classList.toggle('avec-pointage', partie);
    if (d.score) {
      const avantE = hud.ptEric.textContent;
      const avantA = hud.ptAdverse.textContent;
      hud.ptEric.textContent = String(d.score.eric ?? 0);
      hud.ptAdverse.textContent = String(d.score.adverse ?? 0);
      if (avantE !== hud.ptEric.textContent) relancer(hud.ptEric, 'change');
      if (avantA !== hud.ptAdverse.textContent) relancer(hud.ptAdverse, 'change');
    }
    hud.ptChrono.textContent = d.chrono != null ? formatChrono(d.chrono) : '';
    hud.ptChrono.hidden = d.chrono == null;
    hud.pointage.classList.toggle('match', !!d.match);
    hud.ptNomEric.textContent = fr(d.equipes?.eric || 'Éric');
    hud.ptNomAdverse.textContent = fr(d.equipes?.adverse || 'Adversaires');
    hud.ptPeriode.hidden = !d.nomPeriode;
    hud.ptPeriode.textContent = d.nomPeriode ? fr(/^\d/.test(d.nomPeriode) ? `${d.nomPeriode} pér.` : d.nomPeriode) : '';
    hud.ptTirs.hidden = !d.tirs;
    hud.ptTirs.textContent = d.tirs ? `Tirs ${d.tirs.eric ?? 0}–${d.tirs.adverse ?? 0}` : '';
    const pen = (n, liste) => { const l = (liste || []).filter((x) => x > 0); n.textContent = l.length ? `${l.length > 1 ? `${l.length} × ` : ''}${formatChrono(Math.min(...l))}` : ''; n.classList.toggle('visible', !!l.length); };
    pen(hud.ptPenEric, d.penalites?.eric);
    pen(hud.ptPenAdverse, d.penalites?.adverse);
    hud.pointage.classList.toggle('fin-chrono', d.chrono != null && d.chrono <= 10);
    hud.ptRondelle.classList.toggle('visible', !!d.possession);
    const c = pince(Number(d.charge) || 0, 0, 1);
    hud.charge.style.setProperty('--c', c.toFixed(3));
    hud.charge.classList.toggle('visible', c > 0.02);
    hud.charge.classList.toggle('pleine', c > 0.95);
    tactile.tirer.hidden = !d.possession && !(c > 0);
  }
  function relancer(n, classe) { n.classList.remove(classe); void n.offsetWidth; n.classList.add(classe); }

  function butHockey(d = {}) {
    const pourEric = d.pourEric !== false;
    but.el.classList.toggle('adverse', !pourEric);
    but.sous.textContent = fr(d.texte || (pourEric ? 'Éric marque !' : 'L’équipe adverse marque'));
    relancer(but.el, 'joue');
    racine.classList.add('ui-but-en-cours');
    clearTimeout(but.minuterie);
    but.minuterie = setTimeout(() => { but.el.classList.remove('joue'); racine.classList.remove('ui-but-en-cours'); }, 3200);
  }

  /* ---------- Cartes de titre ---------- */

  function carteChapitre(d = {}) {
    S.chapitreCourant = { numero: d.numero, titre: d.titre };
    if (d.titre || d.numero != null) majHUD({ chapitre: { numero: d.numero, titre: d.titre } });
    if (S.base !== 'hud') { S.carteEnAttente = d; return; }
    jouerCarteChapitre(d);
  }
  function jouerCarteChapitre(d) {
    const n = d.numero != null ? d.numero : '';
    chapitreVue.numero.textContent = n !== '' ? fr(`Chapitre ${n}`) : 'Chapitre';
    chapitreVue.titre.textContent = fr(d.titre || '');
    chapitreVue.sous.textContent = fr(d.sousTitre || '');
    chapitreVue.sous.hidden = !d.sousTitre;
    relancer(chapitreVue.el, 'joue');
    racine.classList.add('ui-cinematique');
    S.cinematique = true;
    if (hud.lieu.classList.contains('joue')) { hud.lieu.classList.remove('joue'); clearTimeout(hud.lieu._t); S.lieuEnAttente = S.zone; }
    clearTimeout(chapitreVue.minuterie);
    chapitreVue.minuterie = setTimeout(() => {
      chapitreVue.el.classList.remove('joue');
      racine.classList.remove('ui-cinematique');
      S.cinematique = false;
      if (S.lieuEnAttente) { const z = S.lieuEnAttente; S.lieuEnAttente = null; S.zoneId = null; annoncerLieu(z); }
      if (S.objectifTexte) rejouerObjectif();
    }, 4000);
  }
  function lancerAttentes() {
    if (S.base !== 'hud') return;
    if (S.carteEnAttente) { const d = S.carteEnAttente; S.carteEnAttente = null; jouerCarteChapitre(d); return; }
    if (S.lieuEnAttente) { const z = S.lieuEnAttente; S.lieuEnAttente = null; S.zoneId = null; annoncerLieu(z); }
  }

  function annoncerLieu(z) {
    if (!z || !z.titre) return;
    if (S.cinematique || S.base !== 'hud') { S.lieuEnAttente = z; return; }
    if (S.zoneId === z.id && performance.now() - (S.zoneT || 0) < 3000) return;
    S.zoneId = z.id;
    S.zoneT = performance.now();
    hud.lieuSur.textContent = fr(z.surTitre || 'Montréal');
    hud.lieuTitre.textContent = fr(z.titre);
    hud.lieuSous.textContent = fr(z.sousTitre || '');
    hud.lieuSous.hidden = !z.sousTitre;
    relancer(hud.lieu, 'joue');
    clearTimeout(hud.lieu._t);
    hud.lieu._t = setTimeout(() => hud.lieu.classList.remove('joue'), 5200);
  }

  /* ---------- Mini-carte et carte ---------- */

  function majZone(z, annoncer = false) {
    if (!z) return;
    S.zone = annoncer ? { ...z } : { ...(S.zone || {}), ...z };
    if (z.id && z.titre) S.lieuxVus[z.id] = { titre: z.titre, sousTitre: z.sousTitre || '' };
    const src = S.zone.carte || S.zone.image;
    if (src) { hud.plan.style.backgroundImage = `url("${src}")`; carteVue.image.src = src; carteVue.image.hidden = false; }
    else { hud.plan.style.backgroundImage = ''; carteVue.image.removeAttribute('src'); carteVue.image.hidden = true; }
    hud.mcLieu.textContent = fr(S.zone.titre || '');
    carteVue.titre.textContent = fr(S.zone.titre || 'Carte');
    carteVue.sous.textContent = fr(S.zone.sousTitre || '');
    if (annoncer) annoncerLieu(S.zone);
    planifierCarte();
  }

  function majCarte(d = {}) {
    if (d.image || d.bounds || d.carte) majZone({ carte: d.image || d.carte, bounds: d.bounds });
    for (const k of ['x', 'z', 'angle']) if (d[k] != null) S.carte[k] = Number(d[k]) || 0;
    if (d.camAngle !== undefined) S.carte.camAngle = d.camAngle == null ? null : Number(d.camAngle);
    if (Array.isArray(d.pnj)) S.carte.pnj = d.pnj;
    if (d.objectif !== undefined) S.cible = d.objectif && d.objectif.x != null ? { ...(S.cible && S.cible.x === d.objectif.x ? S.cible : {}), ...d.objectif } : null;
    if (d.cible !== undefined) S.cible = d.cible;
    if (d.direction !== undefined) S.carte.direction = d.direction;
    planifierCarte();
  }

  function planifierCarte() {
    if (S.rafCarte) return;
    S.rafCarte = requestAnimationFrame(() => {
      S.rafCarte = 0;
      rendreMiniCarte();
      if (S.pile.includes('carte')) rendreCartePleine();
      majDistanceObjectif();
    });
  }

  function marqueursCarte() {
    const liste = [];
    (S.carte.pnj || []).forEach((p, i) => {
      if (p == null || p.x == null || p.z == null) return;
      const estDirection = p.direction === true || p.type === 'direction' || String(p.role || p.id || '').startsWith('direction');
      liste.push({ ...p, type: estDirection ? 'direction' : (p.type || 'pnj'), cle: p.id || p.role || `pnj${i}` });
    });
    if (S.carte.direction && S.carte.direction.x != null) liste.push({ ...S.carte.direction, type: 'direction', cle: '__direction' });
    if (S.cible && S.cible.x != null) liste.push({ ...S.cible, type: 'objectif', cle: '__objectif' });
    return liste;
  }

  function nouvelleMarque(type, avecDistance = false) {
    const m = el('span', { class: 'ui-mc-marque', 'data-type': type });
    if (type === 'objectif') {
      m.append(el('span', { class: 'ui-mc-losange' }, el('i')));
      if (avecDistance) m.append(el('span', { class: 'ui-mc-m' }, ''));
    }
    return m;
  }

  function rendreMiniCarte() {
    const taille = hud.disque.clientWidth || 184;
    const r = taille / 2;
    const k = r / RAYON_MINICARTE_M;
    const { x, z, angle } = S.carte;
    const cam = S.carte.camAngle;
    const phi = Number.isFinite(cam) ? cam : 0;
    hud.monde.style.transform = phi ? `rotate(${phi.toFixed(4)}rad)` : '';
    const b = S.zone && S.zone.bounds;
    if (b && (S.zone.carte || S.zone.image)) {
      const W = (b.max[0] - b.min[0]) * k;
      const H = (b.max[2] - b.min[2]) * k;
      hud.plan.style.width = `${W}px`;
      hud.plan.style.height = `${H}px`;
      hud.plan.style.transform = `translate(${(r - (x - b.min[0]) * k).toFixed(1)}px, ${(r - (z - b.min[2]) * k).toFixed(1)}px)`;
      hud.plan.hidden = false;
    } else {
      hud.plan.hidden = true;
    }
    const rot = `rotate(${(Math.PI - angle + phi).toFixed(4)}rad)`;
    hud.fleche.style.transform = rot;
    hud.cone.style.transform = rot;
    const rn = r + 2;
    hud.mcN.style.transform = `translate(${(r + Math.sin(phi) * rn).toFixed(1)}px, ${(r - Math.cos(phi) * rn).toFixed(1)}px)`;
    const contre = phi ? ` rotate(${(-phi).toFixed(4)}rad)` : '';
    const vus = new Set();
    let horsChamp = null;
    for (const m of marqueursCarte()) {
      let n = hud.pool.get(m.cle);
      if (!n || n.dataset.type !== m.type) { n && n.remove(); n = nouvelleMarque(m.type, true); hud.pool.set(m.cle, n); hud.marques.append(n); }
      vus.add(m.cle);
      let dx = (m.x - x) * k;
      let dz = (m.z - z) * k;
      const d = Math.hypot(dx, dz);
      const lim = r - 11;
      const bord = d > lim;
      if (bord) {
        if (m.type === 'objectif' || m.type === 'direction') { dx *= lim / d; dz *= lim / d; n.hidden = false; }
        else { n.hidden = true; continue; }
      } else n.hidden = false;
      n.classList.toggle('bord', bord);
      n.style.transform = `translate(${(r + dx).toFixed(1)}px, ${(r + dz).toFixed(1)}px)${contre}`;
      if (m.type === 'objectif') {
        horsChamp = bord;
        const ey = dx * Math.sin(phi) + dz * Math.cos(phi);
        n.classList.toggle('etiquette-haut', ey > r * 0.25);
      }
    }
    for (const [cle, n] of hud.pool) if (!vus.has(cle)) { n.remove(); hud.pool.delete(cle); }
    hud.minicarte.classList.toggle('objectif-loin', !!horsChamp);
    const lab = hud.pool.get('__objectif') && hud.pool.get('__objectif').querySelector('.ui-mc-m');
    if (lab && lab.textContent !== hud.objDist.textContent) lab.textContent = hud.objDist.textContent;
  }

  let distancePrecedente = '';
  function majDistanceObjectif() {
    let t = '';
    if (S.cible && S.objectifTexte) {
      let d = Number(S.cible.distance);
      if (!Number.isFinite(d) && S.cible.x != null) d = Math.hypot(S.cible.x - S.carte.x, S.cible.z - S.carte.z);
      if (Number.isFinite(d) && d >= 3) t = `${Math.round(d)}${NBSP}m`;
    }
    if (t !== distancePrecedente) {
      hud.objDist.textContent = t;
      const lab = hud.pool.get('__objectif') && hud.pool.get('__objectif').querySelector('.ui-mc-m');
      if (lab) lab.textContent = t;
      distancePrecedente = t;
    }
  }

  /* ---------- Sous-titres et dialogues ---------- */

  const st = (() => {
    const portrait = el('div', { class: 'ui-st-portrait', 'aria-hidden': 'true' });
    const nom = el('p', { class: 'ui-st-nom' }, '');
    const vu = el('span', { class: 'vu' }, '');
    const reste = el('span', { class: 'reste' }, '');
    const texte = el('p', { class: 'ui-st-texte', 'aria-hidden': 'true' }, vu, reste);
    const lecteur = el('p', { class: 'ui-sr', 'aria-live': 'polite' }, '');
    const passer = el('button', { class: 'ui-st-passer', type: 'button', tabindex: '-1', onclick: (ev) => { ev.stopPropagation(); passer_(); } }, glyphe('passer'), el('span', {}, 'Passer'));
    const boite = el('div', { class: 'ui-st-boite' }, portrait, el('div', { class: 'ui-st-corps' }, nom, texte), passer);
    const e = el('div', { class: 'ui-soustitre' }, boite, lecteur);
    e.addEventListener('click', () => { if (S.mode === 'dialogue' || S.st) passer_(); });
    return { el: e, portrait, nom, vu, reste, texte, lecteur, boite, passer, anim: 0, minuterie: 0, complet: true, plein: '' };
  })();

  const replique = (() => {
    const nom = el('span', { class: 'ui-replique-nom' }, '');
    const texte = el('span', { class: 'ui-replique-texte' }, '');
    const e = el('p', { class: 'ui-replique', 'aria-live': 'polite' }, nom, texte);
    return { el: e, nom, texte, minuterie: 0 };
  })();

  function afficherReplique(d) {
    clearTimeout(replique.minuterie);
    if (!d || !d.texte || !S.options.sousTitres) { replique.el.classList.remove('visible'); return; }
    const nom = d.nom || nomDe(d.qui);
    noterRencontre(d.qui, d.nom);
    replique.nom.textContent = fr(nom);
    replique.nom.hidden = !nom;
    replique.texte.textContent = fr(d.texte);
    replique.el.style.setProperty('--couleur-perso', couleurDe(d.qui, d.couleur));
    replique.el.classList.remove('visible');
    void replique.el.offsetWidth;
    replique.el.classList.add('visible');
    let duree = Number(d.duree) > 0 ? (Number(d.duree) > 100 ? Number(d.duree) / 1000 : Number(d.duree)) : 0;
    if (!duree) duree = pince(1.6 + String(d.texte).length / 16, 2.5, 7);
    replique.minuterie = setTimeout(() => replique.el.classList.remove('visible'), duree * 1000);
  }

  function afficherSousTitre(d) {
    if (d && d.discret) { afficherReplique(d); return; }
    clearTimeout(st.minuterie);
    clearTimeout(st.anim);
    if (!d || !d.texte) {
      S.st = null;
      st.el.classList.remove('visible');
      racine.classList.remove('ui-st-actif');
      st.complet = true;
      return;
    }
    S.st = d;
    noterRencontre(d.qui, d.nom);
    racine.classList.add('ui-st-actif');
    const nom = d.nom || nomDe(d.qui);
    const texte = fr(d.texte);
    st.plein = texte;
    st.nom.textContent = fr(nom);
    st.nom.hidden = !nom;
    st.el.style.setProperty('--couleur-perso', couleurDe(d.qui, d.couleur));
    st.portrait.replaceChildren(monogramme(nom, portraitDe(d.qui, d.portrait), 'ui-st-mono'));
    st.lecteur.textContent = nom ? `${fr(nom)}${NBSP}: ${texte}` : texte;
    const montrer = S.options.sousTitres;
    st.el.classList.toggle('visible', montrer);
    const duree = Number(d.duree) > 0 ? (Number(d.duree) > 100 ? Number(d.duree) / 1000 : Number(d.duree)) : 0;
    if (S.options.reduireMouvement || !montrer) {
      st.vu.textContent = texte;
      st.reste.textContent = '';
      st.complet = true;
    } else {
      st.complet = false;
      const vitesse = duree ? pince(texte.length / (duree * 0.6), 34, 120) : 52;
      const t0 = performance.now();
      const pas = () => {
        const n = Math.min(texte.length, Math.max(1, Math.floor(((performance.now() - t0) / 1000) * vitesse)));
        st.vu.textContent = texte.slice(0, n);
        st.reste.textContent = texte.slice(n);
        if (n < texte.length) st.anim = setTimeout(pas, 28);
        else st.complet = true;
      };
      st.vu.textContent = '';
      st.reste.textContent = texte;
      st.anim = setTimeout(pas, 28);
    }
    if (duree) st.minuterie = setTimeout(() => afficherSousTitre(null), duree * 1000);
  }

  function completerSousTitre() {
    clearTimeout(st.anim);
    st.vu.textContent = st.plein;
    st.reste.textContent = '';
    st.complet = true;
  }

  function passer_() {
    if (S.choix) return;
    if (S.st && !st.complet) { completerSousTitre(); return; }
    son('ui_clic');
    emettre('dialogue:passer', {});
  }

  function definirMode(mode) {
    S.mode = ['dialogue', 'cinematique', 'defi'].includes(mode) ? mode : 'jeu';
    racine.dataset.mode = S.mode;
    if (S.mode !== 'jeu') liberePointeur();
    majAide();
  }

  const choix = (() => {
    const question = el('p', { class: 'ui-choix-question' }, '');
    const liste = el('div', { class: 'ui-choix-liste', role: 'group', 'aria-label': 'Choix de réponse' });
    const delai = el('div', { class: 'ui-choix-delai', hidden: '' }, el('i'));
    const e = el('div', { class: 'ui-choix', inert: '' }, question, liste, delai);
    return { el: e, question, liste, delai, minuterie: 0 };
  })();

  function afficherChoix(d) {
    const options = (d && Array.isArray(d.options)) ? d.options : [];
    clearTimeout(choix.minuterie);
    if (!options.length) { masquerChoix(); return; }
    S.choix = { options, defaut: d.defaut ?? 0 };
    choix.question.textContent = fr(d.question || 'Votre réponse');
    choix.liste.replaceChildren(...options.map((o, i) => {
      const texte = typeof o === 'string' ? o : (o.texte || '');
      return el('button', { class: 'ui-choix-option', type: 'button', 'data-nav': '', disabled: (o && o.desactive) ? '' : null, 'data-index': String(i), onclick: () => repondre(i) },
        el('span', { class: 'ui-choix-num', 'aria-hidden': 'true' }, String(i + 1)),
        el('span', { class: 'ui-choix-texte' }, texte));
    }));
    st.el.classList.add('avec-choix');
    choix.el.classList.add('visible');
    const delaiS = Number(d.delai) > 0 ? Number(d.delai) : 0;
    const barre = choix.delai.firstChild;
    choix.delai.hidden = !delaiS;
    if (delaiS) {
      barre.style.transition = 'none';
      barre.style.transform = 'scaleX(1)';
      void barre.offsetWidth;
      barre.style.transition = `transform ${delaiS}s linear`;
      barre.style.transform = 'scaleX(0)';
      choix.minuterie = setTimeout(() => repondre(S.choix ? S.choix.defaut : 0), delaiS * 1000);
    }
    liberePointeur();
    majInert();
    majAide();
    requestAnimationFrame(() => focusInitial(choix.el));
  }
  function masquerChoix() {
    clearTimeout(choix.minuterie);
    S.choix = null;
    choix.el.classList.remove('visible');
    st.el.classList.remove('avec-choix');
    majInert();
    majAide();
  }
  function repondre(i) {
    if (!S.choix) return;
    const o = S.choix.options[i];
    if (!o || (o && o.desactive)) return;
    son('ui_clic');
    masquerChoix();
    emettre('dialogue:reponse', { index: i });
  }

  /* ---------- Toasts ---------- */

  const toasts = el('div', { class: 'ui-toasts', 'aria-live': 'polite' });
  const TOAST_TYPES = {
    info: { icone: 'info', titre: '' },
    succes: { icone: 'check', titre: 'Réussite', son: 'ui_succes' },
    echec: { icone: 'alerte', titre: 'Échec', son: 'ui_echec' },
    alerte: { icone: 'alerte', titre: 'Attention', son: 'ui_echec' },
    preuve: { icone: 'preuve', titre: 'Preuve récoltée', son: 'ui_succes' },
    mission: { icone: 'mission', titre: 'Journal mis à jour', son: 'ui_page' },
    semaine: { icone: 'calendrier', titre: 'Le temps file' },
    aide: { icone: 'manette', titre: 'Commandes' }
  };
  function toast(d) {
    if (!d || !d.texte) return;
    const type = TOAST_TYPES[d.type] ? d.type : 'info';
    const def = TOAST_TYPES[type];
    const titreT = d.titre != null ? d.titre : def.titre;
    const t = el('div', { class: `ui-toast ui-toast-${type}`, role: type === 'alerte' || type === 'echec' ? 'alert' : 'status' },
      el('span', { class: 'ui-toast-icone', html: svg(def.icone) }),
      el('div', { class: 'ui-toast-corps' }, titreT ? el('p', { class: 'ui-toast-titre' }, titreT) : null, el('p', { class: 'ui-toast-texte' }, d.texte)));
    toasts.append(t);
    while (toasts.children.length > 3) toasts.firstElementChild.remove();
    void t.offsetWidth;
    t.classList.add('ouvert');
    if (def.son) son(def.son);
    const duree = Number(d.duree) > 0 ? (Number(d.duree) > 100 ? Number(d.duree) : Number(d.duree) * 1000) : 4800;
    setTimeout(() => { t.classList.add('sortie'); setTimeout(() => t.remove(), 400); }, duree);
  }

  /* ---------- Outils de panneaux ---------- */

  function entetePlein({ surtitre, titre: titreTexte, idTitre, extra }) {
    const fermer = el('button', { class: 'ui-bouton-icone ui-fermer', type: 'button', 'aria-label': 'Fermer', 'data-nav': '', onclick: () => { son('ui_clic'); retour(); } }, icone('croix'));
    return {
      fermer,
      el: el('header', { class: 'ui-plein-entete' },
        el('div', { class: 'ui-journal-gauche' },
          el('div', {}, surtitre ? el('p', { class: 'ui-surtitre' }, el('span', { class: 'ui-points', 'aria-hidden': 'true' }, el('i'), el('i')), surtitre) : null, el('h2', { class: 'ui-titre-section', id: idTitre }, titreTexte)),
          extra || null),
        fermer)
    };
  }

  function creerOnglets(defs, surChange) {
    const boutons = {};
    const panneaux = {};
    const barre = el('div', { class: 'ui-onglets', role: 'tablist' });
    barre.append(el('span', { class: 'ui-onglets-glyphe' }, glypheOnglet(0)));
    for (const d of defs) {
      const idP = `ui-p-${d.id}-${Math.random().toString(36).slice(2, 7)}`;
      const compte = el('span', { class: 'ui-onglet-compte', hidden: '' }, '');
      const point = el('span', { class: 'ui-pastille-nouveau', hidden: '', 'aria-hidden': 'true' });
      const b = el('button', { class: 'ui-onglet', type: 'button', role: 'tab', 'aria-selected': 'false', 'aria-controls': idP, 'data-nav': '', 'data-onglet': d.id, onclick: () => surChange(d.id, true) }, d.icone ? icone(d.icone) : null, el('span', {}, d.titre), compte, point);
      b._compte = compte;
      b._point = point;
      boutons[d.id] = b;
      panneaux[d.id] = el('div', { class: 'ui-panneau-onglet', role: 'tabpanel', id: idP, 'aria-label': d.titre });
      barre.append(b);
    }
    barre.append(el('span', { class: 'ui-onglets-glyphe' }, glypheOnglet(1)));
    const activer = (id) => {
      for (const [k, b] of Object.entries(boutons)) {
        const actif = k === id;
        b.setAttribute('aria-selected', actif ? 'true' : 'false');
        b.tabIndex = actif ? 0 : -1;
        panneaux[k].classList.toggle('actif', actif);
        panneaux[k].inert = !actif;
      }
    };
    return { barre, boutons, panneaux, activer, ordre: defs.map(d => d.id) };
  }
  function glypheOnglet(i) {
    const g = el('span', { class: 'ui-glyphes', 'data-glyphe': i === 0 ? 'ongletPrec' : 'ongletSuiv', 'aria-hidden': 'true' });
    return g;
  }

  /* ---------- Pause ---------- */

  const pause = (() => {
    const item = (libelle, ic, fn, classe = '') => el('button', { class: `ui-menu-item ${classe}`, type: 'button', 'data-nav': '', onclick: fn }, el('span', { class: 'ui-menu-libelle' }, libelle));
    const items = {
      reprendre: item('Reprendre', 'reprendre', () => { son('ui_clic'); reprendre(); }),
      changer: item('Changer d’activité', 'cible', () => { son('ui_clic'); ouvrirCouche('salles'); }),
      journal: item('Journal', 'journal', () => { son('ui_clic'); ouvrirCouche('journal'); }),
      carte: item('Carte', 'carte', () => { son('ui_clic'); ouvrirCouche('carte'); }),
      options: item('Options', 'reglages', () => { son('ui_clic'); ouvrirCouche('options'); }),
      quitter: item('Menu principal', 'sortie', quitterPartie, 'danger')
    };
    const menu = el('nav', { class: 'ui-menu', 'aria-label': 'Menu de pause', 'data-boucle': '' },
      items.reprendre, items.changer, items.journal, items.carte, items.options,
      el('div', { class: 'ui-menu-sep', 'aria-hidden': 'true' }),
      items.quitter);
    items.reprendre.setAttribute('data-defaut', '');
    const chap = el('p', { class: 'ui-resume-chap' }, '');
    const lieu = el('p', { class: 'ui-resume-lieu' }, icone('lieu'), el('span', {}, ''));
    const obj = el('p', {}, '');
    const resume = el('div', { class: 'ui-resume ui-carte-panneau ui-entree d1' }, el('p', { class: 'ui-surtitre' }, 'Où en êtes-vous'), chap, lieu, el('div', { class: 'ui-resume-obj' }, el('p', { class: 'ui-surtitre' }, 'Objectif'), obj));
    const stats = el('div', { class: 'ui-resume-stats ui-carte-panneau ui-entree d2' });
    const e = el('section', { class: 'ui-couche ui-pause', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-pause-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein' },
        el('div', { class: 'ui-pause-gauche ui-entree' }, el('p', { class: 'ui-surtitre' }, el('span', { class: 'ui-points', 'aria-hidden': 'true' }, el('i'), el('i')), 'Partie en pause'), el('h2', { class: 'ui-titre-section', id: 'ui-pause-titre' }, 'Pause'), menu),
        el('div', { class: 'ui-pause-droite' }, resume, stats)));
    return { el: e, chap, lieu, obj, stats, resume, items };
  })();
  couches.pause = { el: pause.el, preparer: majPause };

  function majPause() {
    const salle = S.modeJeu === 'salle';
    pause.items.changer.hidden = !salle;
    pause.items.journal.hidden = salle;
    const c = S.hud.chapitre;
    pause.chap.textContent = fr(libelleChapitre(c) || (salle ? 'Mode salle' : 'En route vers la soutenance'));
    pause.lieu.lastChild.textContent = fr((S.zone && (S.zone.titre + (S.zone.sousTitre ? ` · ${S.zone.sousTitre}` : ''))) || '');
    pause.lieu.hidden = !pause.lieu.lastChild.textContent;
    pause.obj.textContent = fr(S.objectifTexte || 'Aucun objectif en cours');
    const cases = salle ? [] : [['Semaines', S.hud.semaines != null ? String(S.hud.semaines) : '–']];
    for (const [cle, nom] of STATS) cases.push([nom, S.hud.stats[cle] != null ? String(Math.round(S.hud.stats[cle])) : '–']);
    pause.stats.replaceChildren(...cases.map(([n, v]) => el('div', { class: 'ui-resume-stat' }, el('p', {}, n), el('p', {}, v))));
    pause.stats.classList.toggle('sans-semaines', salle);
  }

  async function quitterPartie() {
    son('ui_clic');
    const salle = S.modeJeu === 'salle';
    const ok = await confirmer({ surtitre: salle ? 'Mode salle' : 'Quitter la partie', titre: 'Revenir au menu principal ?', texte: salle ? 'L’activité en cours sera interrompue.' : 'Votre progression est sauvegardée.', ok: 'Menu principal', annuler: 'Annuler', danger: true });
    if (!ok) return;
    emettre('quitter', {});
    changerBase('titre');
  }

  /* ---------- Journal ---------- */

  const journal = (() => {
    const onglets = creerOnglets([
      { id: 'missions', titre: 'Missions', icone: 'mission' },
      { id: 'protocole', titre: 'Mon protocole', icone: 'protocole' },
      { id: 'preuves', titre: 'Preuves', icone: 'preuve' },
      { id: 'personnages', titre: 'Personnages', icone: 'personnes' }
    ], (id, clic) => changerOngletJournal(id, clic));
    const entete = entetePlein({ titre: 'Journal', idTitre: 'ui-journal-titre', extra: onglets.barre });
    const corps = el('div', { class: 'ui-plein-corps' }, Object.values(onglets.panneaux));
    const e = el('section', { class: 'ui-couche ui-journal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-journal-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein ui-entree' }, entete.el, corps));
    return { el: e, onglets };
  })();
  couches.journal = {
    el: journal.el,
    preparer: () => { S.ongletsVus = new Set(); if (!S.journalExplicite) { chargerPersonnages(); journalDepuisEtat(); } rendreJournal(); changerOngletJournal(S.ongletJournal, false); },
    fermer: () => {
      if (S.ongletsVus.has('protocole')) for (const s of S.journal.protocole.sections) { if (sectionRemplie(s)) S.vus.protocole.add(s.id); s._nouvelle = false; }
      if (S.ongletsVus.has('preuves')) { for (const x of S.journal.preuves) x._nouvelle = false; S.preuvesNouvelles.clear(); }
      if (S.ongletsVus.has('protocole')) S.sectionsNouvelles.clear();
    },
    onglets: journal.onglets,
    changer: (id) => changerOngletJournal(id, true)
  };

  function changerOngletJournal(id, depuisUtilisateur) {
    if (!journal.onglets.boutons[id]) id = 'missions';
    const change = S.ongletJournal !== id;
    S.ongletJournal = id;
    journal.onglets.activer(id);
    S.nouveaux[id] = false;
    journal.onglets.boutons[id]._point.hidden = true;
    S.ongletsVus.add(id);
    if (change && depuisUtilisateur) son('ui_page');
    if (depuisUtilisateur) {
      requestAnimationFrame(() => {
        const p = journal.onglets.panneaux[id];
        const cible = p.querySelector('.choisie[data-nav]') || navigables(p)[0];
        focaliser((cible || journal.onglets.boutons[id]));
      });
    }
  }

  function typePreuve(id) {
    const t = String(id);
    if (/simulation|tableau|grille|attribution|donnee|carte|atlas/.test(t)) return 'donnees';
    if (/entretien|notes|temoignage/.test(t)) return 'entretien';
    if (/article|revue|requete/.test(t)) return 'article';
    return 'document';
  }
  function journalDepuisEtat() {
    const p = partieCourante();
    const sc = etat.scenario;
    if (!p || !sc || S.journalExplicite) return;
    const J = S.journal;
    const chs = sc.chapitres || [];
    const iCour = Math.max(0, chs.findIndex(c => c.id === p.chapitre));
    const faits = new Set(p.etapesFaites || []);
    J.missions = chs.slice(0, iCour + 1).map((c, i) => {
      const objectifs = [];
      let courante = false;
      for (const e of (c.etapes || [])) {
        if (!e.objectif) continue;
        if (faits.has(e.id)) objectifs.push({ texte: e.objectif, fait: true });
        else if (i === iCour && !courante && (!p.etape || p.etape === e.id || !faits.has(e.id))) { objectifs.push({ texte: e.objectif, fait: false }); courante = true; }
      }
      return { id: c.id, titre: c.titre, chapitre: `Chapitre ${i + 1}`, etat: i < iCour ? 'terminee' : 'en_cours', description: c.resume || '', objectifs };
    }).reverse();
    const ecrit = p.protocole || {};
    J.protocole.titre = sc.titreProtocole || J.protocole.titre || '';
    J.protocole.sousTitre = sc.sousTitreProtocole || J.protocole.sousTitre || '';
    J.protocole.sections = (sc.protocole || []).map(x => ({ id: x.section, titre: x.section, texte: ecrit[x.section] || '', _nouvelle: S.sectionsNouvelles.has(x.section) && !!ecrit[x.section] }));
    if (!J.protocole.sections.length) J.protocole.sections = SECTIONS_PROTOCOLE.map(x => ({ ...x }));
    const dict = sc.preuves || {};
    J.preuves = (p.preuves || []).map(id => ({ id, titre: (dict[id] && dict[id].titre) || id, description: (dict[id] && dict[id].description) || '', type: typePreuve(id), _nouvelle: S.preuvesNouvelles.has(id) }));
    const P = S.donneesPerso || {};
    const ids = ['eric', ...S.rencontres.filter(x => x !== 'eric')];
    J.personnages = ids.map(id => {
      const d = P[id] || {};
      if (id === 'eric') return { id, nom: 'Éric Bernier', role: 'Doctorant en santé publique', description: '' };
      return { id, nom: d.nom || S.nomsVus[id] || id, role: d.description || '', description: '' };
    });
  }
  function chargerPersonnages() {
    if (S.donneesPerso || S.chargementPerso) return;
    S.chargementPerso = true;
    let url;
    try { url = new URL('../donnees/dialogues.json', import.meta.url).href; } catch { return; }
    fetch(url).then(r => (r.ok ? r.json() : null)).then((d) => {
      S.donneesPerso = (d && d.personnages) || {};
      if (S.pile.includes('journal')) { journalDepuisEtat(); rendreJournal(); }
    }).catch(() => { S.donneesPerso = {}; });
  }
  function noterRencontre(qui, nom) {
    if (!qui) return;
    if (nom) S.nomsVus[qui] = nom;
    if (S.rencontres.includes(qui)) return;
    S.rencontres.push(qui);
    ecrireStockage(CLE_RENCONTRES, JSON.stringify(S.rencontres));
  }

  function sectionRemplie(s) { return !!(s && (s.texte || (Array.isArray(s.points) && s.points.length))); }

  function fusionnerJournal(d, initial = false) {
    if (!d) return;
    const J = S.journal;
    const upsert = (liste, item) => {
      if (!item || item.id == null) return false;
      const i = liste.findIndex(x => x.id === item.id);
      if (i >= 0) { liste[i] = { ...liste[i], ...item }; return false; }
      liste.push({ ...item });
      return true;
    };
    const marquer = (onglet) => { if (!initial) S.nouveaux[onglet] = true; };
    if (Array.isArray(d.missions) || Array.isArray(d.preuves) || Array.isArray(d.personnages) || (d.protocole && Array.isArray(d.protocole.sections))) S.journalExplicite = true;
    if (Array.isArray(d.missions)) { J.missions = d.missions.map(m => ({ ...m })); marquer('missions'); }
    if (d.mission) { upsert(J.missions, d.mission); marquer('missions'); }
    if (d.protocole) {
      const p = d.protocole;
      if (p.titre != null) J.protocole.titre = p.titre;
      if (p.sousTitre != null) J.protocole.sousTitre = p.sousTitre;
      if (p.auteur != null) J.protocole.auteur = p.auteur;
      if (Array.isArray(p.sections)) {
        J.protocole.sections = p.sections.map(s => ({ ...s }));
        for (const s of J.protocole.sections) {
          if (!sectionRemplie(s)) continue;
          if (initial) S.vus.protocole.add(s.id);
          else if (!S.vus.protocole.has(s.id)) s._nouvelle = true;
        }
      }
      marquer('protocole');
    }
    if (typeof d.section === 'string') {
      S.sectionsNouvelles.add(d.section);
      marquer('protocole');
      if (!initial) { etiquette(`Protocole : ${d.section}`, 'plus', 'protocole', 3.6); son('ui_succes'); }
    } else if (d.section) {
      let s = J.protocole.sections.find(x => x.id === d.section.id);
      if (s) Object.assign(s, d.section);
      else { s = { ...d.section }; J.protocole.sections.push(s); }
      if (sectionRemplie(s)) {
        if (initial) S.vus.protocole.add(s.id);
        else if (!S.vus.protocole.has(s.id)) s._nouvelle = true;
      }
      marquer('protocole');
    }
    const ajouterPreuve = (p) => {
      const neuf = upsert(J.preuves, p);
      if (neuf && !initial) { J.preuves.find(x => x.id === p.id)._nouvelle = true; }
    };
    if (Array.isArray(d.preuves)) {
      const anciens = new Set(J.preuves.map(p => p.id));
      J.preuves = d.preuves.map(p => ({ ...p, _nouvelle: !initial && !anciens.has(p.id) }));
      marquer('preuves');
    }
    if (d.preuve) { ajouterPreuve(d.preuve); marquer('preuves'); }
    if (Array.isArray(d.personnages)) { J.personnages = d.personnages.map(p => ({ ...p })); marquer('personnages'); }
    if (d.personnage) { upsert(J.personnages, d.personnage); marquer('personnages'); }
    for (const k of Object.keys(S.nouveaux)) journal.onglets.boutons[k]._point.hidden = !S.nouveaux[k] || (S.pile.includes('journal') && S.ongletJournal === k);
    if (S.pile.includes('journal')) rendreJournal();
  }

  function rendreJournal() {
    rendreMissions();
    rendreProtocole();
    rendrePreuves();
    rendrePersonnages();
    const b = journal.onglets.boutons;
    const compter = (k, n) => { b[k]._compte.textContent = String(n); b[k]._compte.hidden = !n; };
    compter('missions', S.journal.missions.filter(m => m.etat === 'en_cours').length);
    compter('preuves', S.journal.preuves.length);
    compter('personnages', S.journal.personnages.filter(p => p.rencontre !== false).length);
    for (const k of Object.keys(S.nouveaux)) b[k]._point.hidden = !S.nouveaux[k] || S.ongletJournal === k;
  }

  const ETATS_MISSION = { en_cours: ['En cours', 'mission'], terminee: ['Terminée', 'check'], echouee: ['Échouée', 'croix'], a_venir: ['À venir', 'cadenas'] };

  function rendreMissions() {
    const p = journal.onglets.panneaux.missions;
    const missions = S.journal.missions;
    if (!missions.length) {
      p.replaceChildren(el('div', { class: 'ui-vide ui-carte-panneau' }, icone('mission'), el('p', {}, 'Aucune mission pour l’instant. Les missions apparaissent au fil des chapitres.')));
      return;
    }
    let sel = missions.find(m => m.id === S.selection.missions) || missions.find(m => m.etat === 'en_cours') || missions[0];
    S.selection.missions = sel.id;
    const liste = el('div', { class: 'ui-liste ui-defile' });
    let groupe = null;
    const ordre = [...missions].sort((a, b) => (a.etat === 'en_cours' ? -1 : 0) - (b.etat === 'en_cours' ? -1 : 0));
    for (const m of ordre) {
      const g = m.etat === 'en_cours' ? 'En cours' : (m.chapitre || 'Autres missions');
      if (g !== groupe) { liste.append(el('p', { class: 'ui-liste-groupe' }, g)); groupe = g; }
      const [libEtat, ic] = ETATS_MISSION[m.etat] || ETATS_MISSION.a_venir;
      const b = el('button', { class: 'ui-ligne' + (m.id === sel.id ? ' choisie' : ''), type: 'button', 'data-nav': '', 'data-defaut': m.id === sel.id ? '' : null, 'data-etat': m.etat || 'a_venir', 'aria-pressed': m.id === sel.id ? 'true' : 'false' },
        el('span', { class: 'ui-ligne-icone' }, icone(ic)),
        el('span', { class: 'ui-ligne-texte' }, el('p', { class: 'ui-ligne-titre' }, m.titre || ''), el('p', { class: 'ui-ligne-sous' }, m.etat === 'en_cours' ? (m.chapitre || libEtat) : libEtat)));
      const choisir = () => { if (S.selection.missions === m.id) return; S.selection.missions = m.id; for (const x of liste.querySelectorAll('.ui-ligne')) { x.classList.toggle('choisie', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); } detail.replaceChildren(...detailMission(m)); };
      b.addEventListener('focus', choisir);
      b.addEventListener('click', choisir);
      liste.append(b);
    }
    const detail = el('div', { class: 'ui-detail ui-carte-panneau ui-defile', 'aria-live': 'polite' }, ...detailMission(sel));
    p.replaceChildren(el('div', { class: 'ui-deux-col' }, liste, detail));
  }
  function detailMission(m) {
    const [libEtat] = ETATS_MISSION[m.etat] || ETATS_MISSION.a_venir;
    const objs = Array.isArray(m.objectifs) ? m.objectifs : [];
    return [
      el('p', { class: 'ui-surtitre' }, [m.chapitre, libEtat].filter(Boolean).join(' · ')),
      el('h3', { class: 'ui-detail-titre' }, m.titre || ''),
      m.description ? el('p', { class: 'ui-detail-texte' }, m.description) : null,
      objs.length ? el('ul', { class: 'ui-objectifs' }, objs.map(o => {
        const fait = typeof o === 'object' && o.fait;
        return el('li', { class: 'ui-objectif-ligne' + (fait ? ' fait' : '') }, el('span', { class: 'ui-case' }, fait ? icone('check') : null), el('span', { class: 'ui-objectif-txt' }, typeof o === 'string' ? o : o.texte), el('span', { class: 'ui-sr' }, fait ? ' (fait)' : ' (à faire)'));
      })) : null
    ];
  }

  function rendreProtocole() {
    const p = journal.onglets.panneaux.protocole;
    const P = S.journal.protocole;
    const sections = P.sections || [];
    const remplie = sectionRemplie;
    const n = sections.filter(remplie).length;
    const pct = sections.length ? Math.round((n / sections.length) * 100) : 0;
    const feuille = el('article', { class: 'ui-feuille', 'aria-label': 'Mon protocole' },
      el('p', { class: 'ui-feuille-entete' }, 'Protocole de recherche · Doctorat en santé publique'),
      el('h3', { class: 'ui-feuille-titre' }, P.titre || 'Titre à préciser'),
      P.sousTitre ? el('p', { class: 'ui-feuille-sous' }, P.sousTitre) : null,
      el('p', { class: 'ui-feuille-auteur' }, el('b', {}, P.auteur || 'Éric Bernier'), ' · ESPUM, Université de Montréal'),
      sections.map((s, i) => {
        const ok = remplie(s);
        const num = String(i + 1).padStart(2, '0');
        const contenu = [];
        if (ok) {
          if (s.texte) contenu.push(...String(s.texte).split(/\n+/).map(par => el('p', {}, par)));
          if (Array.isArray(s.points) && s.points.length) contenu.push(el('ul', {}, s.points.map(x => el('li', {}, x))));
        } else {
          contenu.push(el('div', { class: 'ui-lignes-vides', 'aria-hidden': 'true' }, el('i'), el('i'), el('i')));
          contenu.push(el('p', { class: 'ui-a-rediger' }, s.chapitre ? `À rédiger — se précise au ${String(s.chapitre).toLowerCase().startsWith('chapitre') ? String(s.chapitre).toLowerCase() : `chapitre ${s.chapitre}`}.` : 'À rédiger.'));
        }
        return el('section', { class: 'ui-feuille-sec' + (ok ? '' : ' a-rediger') + (ok && s._nouvelle ? ' nouvelle' : '') }, el('h4', {}, el('span', {}, num), s.titre || ''), contenu);
      }));
    const zone = el('div', { class: 'ui-feuille-zone ui-defile', tabindex: '0', 'data-nav': '', 'data-defile': '', 'aria-label': 'Document du protocole, faire défiler' }, feuille);
    const marge = el('aside', { class: 'ui-protocole-marge ui-carte-panneau' },
      el('p', { class: 'ui-surtitre' }, 'Avancement'),
      el('p', { class: 'ui-protocole-pct' }, `${pct}${NBSP}%`, el('small', {}, 'rédigé')),
      el('div', { class: 'ui-progression-piste' }, el('div', { class: 'ui-progression-barre', style: { width: `${pct}%` } })),
      el('ul', { class: 'ui-protocole-sommaire' }, sections.map(s => el('li', { class: remplie(s) ? 'fait' : '' }, el('span', { class: 'ui-case' }, remplie(s) ? icone('check') : null), s.titre))));
    zone.setAttribute('data-defaut', '');
    p.replaceChildren(el('div', { class: 'ui-protocole-cadre' }, zone, marge));
  }

  const ICONES_PREUVES = { article: 'article', entretien: 'entretien', donnees: 'donnees', observation: 'observation', document: 'preuve', carte: 'carte' };

  function rendrePreuves() {
    const p = journal.onglets.panneaux.preuves;
    const preuves = S.journal.preuves;
    if (!preuves.length) {
      p.replaceChildren(el('div', { class: 'ui-vide ui-carte-panneau' }, icone('preuve'), el('p', {}, 'Aucune preuve pour l’instant. Explorez, lisez, discutez : certaines réponses devant le jury en dépendent.')));
      return;
    }
    let sel = preuves.find(x => x.id === S.selection.preuves) || preuves[preuves.length - 1];
    S.selection.preuves = sel.id;
    const grille = el('div', { class: 'ui-grille-cartes ui-defile' });
    const detail = el('div', { class: 'ui-detail ui-carte-panneau ui-preuve-detail ui-defile', 'aria-live': 'polite' }, ...detailPreuve(sel));
    for (const x of preuves) {
      const f = el('button', { class: 'ui-fiche' + (x.id === sel.id ? ' choisie' : ''), type: 'button', 'data-nav': '', 'data-defaut': x.id === sel.id ? '' : null, 'aria-pressed': x.id === sel.id ? 'true' : 'false' },
        el('span', { class: 'ui-fiche-icone' }, icone(ICONES_PREUVES[x.type] || 'preuve')),
        x._nouvelle ? el('span', { class: 'ui-ligne-badge' }, 'Nouveau') : null,
        el('p', { class: 'ui-fiche-titre' }, x.titre || ''),
        el('p', { class: 'ui-fiche-sous' }, [x.source, x.chapitre].filter(Boolean).join(' · ')));
      const choisir = () => {
        x._nouvelle = false;
        f.querySelector('.ui-ligne-badge')?.remove();
        if (S.selection.preuves === x.id) return;
        S.selection.preuves = x.id;
        for (const y of grille.children) { y.classList.toggle('choisie', y === f); y.setAttribute('aria-pressed', y === f ? 'true' : 'false'); }
        detail.replaceChildren(...detailPreuve(x));
      };
      f.addEventListener('focus', choisir);
      f.addEventListener('click', choisir);
      grille.append(f);
    }
    p.replaceChildren(el('div', { class: 'ui-preuves-cadre' }, grille, detail));
  }
  function detailPreuve(x) {
    const meta = [['Source', x.source], ['Obtenue', x.chapitre], ['Utile pour', x.utilePour]].filter(m => m[1]);
    return [
      el('span', { class: 'ui-fiche-icone' }, icone(ICONES_PREUVES[x.type] || 'preuve')),
      el('h3', { class: 'ui-detail-titre' }, x.titre || ''),
      x.description ? el('p', { class: 'ui-detail-texte' }, x.description) : null,
      meta.length ? el('div', { class: 'ui-meta' }, meta.map(([k, v]) => el('div', {}, el('span', { class: 'cle' }, k), el('span', {}, v)))) : null
    ];
  }

  function rendrePersonnages() {
    const p = journal.onglets.panneaux.personnages;
    const liste = S.journal.personnages;
    if (!liste.length) {
      p.replaceChildren(el('div', { class: 'ui-vide ui-carte-panneau' }, icone('personnes'), el('p', {}, 'Les personnes rencontrées apparaîtront ici.')));
      return;
    }
    const grille = el('div', { class: 'ui-grille-cartes ui-defile', style: { gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' } });
    for (const x of liste) {
      const connu = x.rencontre !== false;
      const couleur = couleurDe(x.id, x.couleur);
      const f = el('div', { class: 'ui-fiche ui-fiche-perso' + (connu ? '' : ' inconnu'), tabindex: '-1', 'data-nav': '', style: { '--cp': couleur } },
        connu ? monogramme(x.nom, portraitDe(x.id, x.portrait)) : el('span', { class: 'ui-monogramme', 'aria-hidden': 'true' }, '?'),
        el('div', {},
          el('p', { class: 'ui-fiche-nom' }, connu ? (x.nom || '') : 'Pas encore rencontré'),
          el('p', { class: 'ui-fiche-role' }, connu ? (x.role || '') : (x.indice || '')),
          connu && x.description ? el('p', { class: 'ui-fiche-desc' }, x.description) : null));
      f.style.setProperty('--cp', couleur);
      if (!grille.children.length) f.setAttribute('data-defaut', '');
      grille.append(f);
    }
    p.replaceChildren(grille);
  }

  /* ---------- Carte plein écran ---------- */

  const carteVue = (() => {
    const image = el('img', { class: 'ui-carte-image', alt: '', hidden: '', draggable: 'false' });
    const marques = el('div', { class: 'ui-carte-marques' });
    const eric = el('div', { class: 'ui-carte-eric', html: FLECHE_ERIC });
    const plan = el('div', { class: 'ui-carte-plan' }, image, marques, eric);
    const zone = el('div', { class: 'ui-carte-zone' }, plan);
    const titreEl = el('span', {}, 'Carte');
    const sous = el('p', { class: 'ui-legende-sep' }, '');
    const legende = el('aside', { class: 'ui-legende ui-carte-panneau' },
      el('p', { class: 'ui-surtitre' }, 'Légende'),
      el('ul', {},
        el('li', {}, el('span', { class: 'ui-legende-eric', html: FLECHE_ERIC }), 'Vous'),
        el('li', {}, nouvelleMarque('objectif'), 'Objectif'),
        el('li', {}, el('span', { class: 'ui-mc-marque', 'data-type': 'pnj' }), 'Personnes'),
        el('li', {}, el('span', { class: 'ui-mc-marque', 'data-type': 'direction' }), 'La direction')),
      sous);
    const entete = entetePlein({ surtitre: 'Carte', titre: '', idTitre: 'ui-carte-titre' });
    entete.el.querySelector('h2').append(titreEl);
    const e = el('section', { class: 'ui-couche ui-carte', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-carte-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein ui-entree' }, entete.el, el('div', { class: 'ui-plein-corps' }, el('div', { class: 'ui-carte-cadre' }, zone, legende))));
    entete.fermer.setAttribute('data-defaut', '');
    return { el: e, image, marques, eric, plan, zone, titre: titreEl, sous, pool: new Map() };
  })();
  couches.carte = { el: carteVue.el, preparer: () => requestAnimationFrame(rendreCartePleine) };

  function rendreCartePleine() {
    const W = carteVue.zone.clientWidth;
    const H = carteVue.zone.clientHeight;
    if (!W || !H) return;
    let b = S.zone && S.zone.bounds;
    const marques = marqueursCarte();
    if (!b) {
      const xs = [S.carte.x, ...marques.map(m => m.x)];
      const zs = [S.carte.z, ...marques.map(m => m.z)];
      b = { min: [Math.min(...xs) - 12, 0, Math.min(...zs) - 12], max: [Math.max(...xs) + 12, 0, Math.max(...zs) + 12] };
    }
    const bx = Math.max(1, b.max[0] - b.min[0]);
    const bz = Math.max(1, b.max[2] - b.min[2]);
    const ratio = bx / bz;
    let w = W;
    let h = W / ratio;
    if (h > H) { h = H; w = H * ratio; }
    carteVue.plan.style.width = `${Math.floor(w)}px`;
    carteVue.plan.style.height = `${Math.floor(h)}px`;
    const pos = (x, z) => [((x - b.min[0]) / bx) * 100, ((z - b.min[2]) / bz) * 100];
    const [ex, ez] = pos(S.carte.x, S.carte.z);
    carteVue.eric.style.left = `${ex}%`;
    carteVue.eric.style.top = `${ez}%`;
    carteVue.eric.style.transform = `rotate(${(Math.PI - S.carte.angle).toFixed(4)}rad)`;
    const vus = new Set();
    for (const m of marques) {
      let n = carteVue.pool.get(m.cle);
      if (!n || n.dataset.type !== m.type) {
        n && n.remove();
        n = el('span', {}, nouvelleMarque(m.type));
        n.dataset.type = m.type;
        n.style.position = 'absolute';
        carteVue.pool.set(m.cle, n);
        carteVue.marques.append(n);
      }
      vus.add(m.cle);
      const [px, pz] = pos(m.x, m.z);
      n.style.left = `${pince(px, 0, 100)}%`;
      n.style.top = `${pince(pz, 0, 100)}%`;
      const distTexte = m.type === 'objectif' && Number.isFinite(Number(m.distance)) ? ` · ${Math.round(Number(m.distance))}${NBSP}m` : '';
      const etiquetteTexte = m.type === 'objectif' ? `${m.texte || 'Objectif'}${distTexte}` : (m.nom || '');
      let et = n.querySelector('.ui-carte-etiquette');
      if (etiquetteTexte && (m.type === 'objectif' || m.type === 'direction' || m.nom)) {
        if (!et) { et = el('span', { class: 'ui-carte-etiquette' + (m.type === 'objectif' ? ' objectif' : '') }); n.append(et); }
        et.textContent = fr(m.type === 'direction' && !m.nom ? 'La direction' : etiquetteTexte);
        et.classList.toggle('gauche', px < 18);
        et.classList.toggle('droite', px > 82);
      } else if (et) et.remove();
      n.firstChild.style.position = 'absolute';
    }
    for (const [cle, n] of carteVue.pool) if (!vus.has(cle)) { n.remove(); carteVue.pool.delete(cle); }
    carteVue.sous.textContent = fr(S.zone && S.zone.sousTitre ? S.zone.sousTitre : '');
    carteVue.sous.hidden = !carteVue.sous.textContent;
  }

  /* ---------- Options ---------- */

  const pctTexte = v => `${Math.round(v * 100)}${NBSP}%`;
  const SCHEMA_OPTIONS = [
    {
      id: 'affichage', titre: 'Affichage', icone: 'graphismes', lignes: [
        { cle: 'qualite', type: 'choix', libelle: 'Qualité graphique', valeurs: [['auto', 'Auto'], ['bas', 'Bas'], ['moyen', 'Moyen'], ['eleve', 'Élevé'], ['ultra', 'Ultra']], aide: 'Auto choisit selon votre appareil. Bas convient aux portables et aux téléphones ; Ultra demande une carte graphique récente.' },
        { cle: 'reduireMouvement', type: 'bascule', libelle: 'Réduire les mouvements', aide: 'Atténue les animations de l’interface et les secousses de caméra.' },
        { cle: 'contraste', type: 'bascule', libelle: 'Contraste élevé', aide: 'Opacifie les panneaux et renforce les contours pour une lecture plus nette.' }
      ]
    },
    {
      id: 'audio', titre: 'Audio', icone: 'son', lignes: [
        { cle: 'volumeGeneral', type: 'curseur', libelle: 'Volume général', min: 0, max: 1, pas: 0.05, format: pctTexte, aide: 'Règle l’ensemble des sons du jeu.' },
        { cle: 'volumeMusique', type: 'curseur', libelle: 'Musique', min: 0, max: 1, pas: 0.05, format: pctTexte, aide: 'Règle le volume de la musique.' },
        { cle: 'volumeVoix', type: 'curseur', libelle: 'Voix', min: 0, max: 1, pas: 0.05, format: pctTexte, aide: 'Règle le volume des personnages qui parlent.' },
        { cle: 'volumeEffets', type: 'curseur', libelle: 'Effets sonores', min: 0, max: 1, pas: 0.05, format: pctTexte, aide: 'Règle le volume des pas, des portes, des objets et de l’interface.' }
      ]
    },
    {
      id: 'soustitres', titre: 'Sous-titres', icone: 'soustitres', lignes: [
        { cle: 'sousTitres', type: 'bascule', libelle: 'Sous-titres', aide: 'Affiche les répliques à l’écran, avec le nom de la personne qui parle.', apercu: true },
        { cle: 'tailleSousTitres', type: 'choix', libelle: 'Taille du texte', valeurs: [['petite', 'Petite'], ['normale', 'Normale'], ['grande', 'Grande'], ['tres_grande', 'Très grande']], aide: 'Agrandit le texte des sous-titres et des dialogues.', apercu: true },
        { cle: 'fondSousTitres', type: 'choix', libelle: 'Fond', valeurs: [['aucun', 'Aucun'], ['leger', 'Léger'], ['opaque', 'Opaque']], aide: 'Ajoute un fond derrière les sous-titres pour les détacher du décor.', apercu: true }
      ]
    },
    {
      id: 'commandes', titre: 'Commandes', icone: 'clavier', lignes: [
        { cle: 'sensibilite', type: 'curseur', libelle: 'Sensibilité de la caméra', min: 0.2, max: 3, pas: 0.1, format: v => `${nombreFr(v, 1)}${NBSP}×`, aide: 'Vitesse de rotation de la caméra à la souris, à la manette ou au doigt.' },
        { cle: 'inverserY', type: 'bascule', libelle: 'Inverser l’axe vertical', aide: 'Pousser vers le haut fait regarder vers le bas.' },
        { cle: 'clavier', type: 'choix', libelle: 'Disposition du clavier', valeurs: [['auto', 'Auto'], ['qwerty', 'QWERTY'], ['azerty', 'AZERTY']], aide: 'Adapte l’affichage des touches de déplacement : WASD en QWERTY, ZQSD en AZERTY. Auto suit votre clavier.' }
      ],
      touches: true
    }
  ];

  const options = (() => {
    const onglets = creerOnglets(SCHEMA_OPTIONS.map(s => ({ id: s.id, titre: s.titre, icone: s.icone })), (id, clic) => changerOngletOptions(id, clic));
    const entete = entetePlein({ titre: 'Options', idTitre: 'ui-options-titre', extra: onglets.barre });
    const controles = {};
    const aides = {};
    const listeTouches = el('ul', { class: 'ui-touches' });
    const apercuNom = el('p', { class: 'ui-st-nom' }, 'Éric');
    const apercuBoite = el('div', { class: 'ui-st-boite' }, apercuNom, el('p', { class: 'ui-st-texte' }, 'Une question de recherche, ça se peaufine. Comme un lancer du poignet.'));
    const apercu = el('div', { class: 'ui-apercu-st' }, apercuBoite);
    for (const s of SCHEMA_OPTIONS) {
      const lignes = el('div', { class: 'ui-options-lignes ui-defile' });
      for (const l of s.lignes) {
        l._onglet = s.id;
        const ligne = construireLigneOption(l);
        controles[l.cle] = ligne;
        lignes.append(ligne.el);
      }
      if (s.touches) { lignes.append(el('p', { class: 'ui-opt-sous-titre' }, 'Touches'), listeTouches); }
      if (s.id === 'affichage') {
        lignes.append(el('div', { class: 'ui-options-pied' }, el('button', { class: 'ui-bouton', type: 'button', 'data-nav': '', onclick: retablirOptions }, 'Rétablir les valeurs par défaut')));
      }
      const aTitre = el('h3', {}, '');
      const aTexte = el('p', { class: 'ui-aide-texte' }, '');
      const panneauAide = el('aside', { class: 'ui-options-aide ui-carte-panneau' }, el('p', { class: 'ui-surtitre' }, 'Description'), aTitre, aTexte, s.id === 'soustitres' ? apercu : null);
      aides[s.id] = { titre: aTitre, texte: aTexte };
      onglets.panneaux[s.id].append(el('div', { class: 'ui-options-cadre' }, lignes, panneauAide));
    }
    const corps = el('div', { class: 'ui-plein-corps' }, Object.values(onglets.panneaux));
    const e = el('section', { class: 'ui-couche ui-options', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-options-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein ui-entree' }, entete.el, corps));
    e.addEventListener('focusin', (ev) => {
      const ligne = ev.target.closest('.ui-opt');
      for (const x of e.querySelectorAll('.ui-opt.focus')) if (x !== ligne) x.classList.remove('focus');
      if (ligne) { ligne.classList.add('focus'); const def = ligne._def; montrerAideOption(def); }
    });
    return { el: e, onglets, aides, apercu, apercuBoite, apercuNom, controles, listeTouches };
  })();
  couches.options = { el: options.el, preparer: () => { majControlesOptions(); majTouchesListe(); changerOngletOptions(S.ongletOptions, false); }, onglets: options.onglets, changer: (id) => changerOngletOptions(id, true) };

  function montrerAideOption(def) {
    if (!def) return;
    const a = options.aides[def._onglet];
    if (!a) return;
    a.titre.textContent = fr(def.libelle);
    a.texte.textContent = fr(def.aide || '');
  }

  function changerOngletOptions(id, depuisUtilisateur) {
    if (!options.onglets.boutons[id]) id = SCHEMA_OPTIONS[0].id;
    const change = S.ongletOptions !== id;
    S.ongletOptions = id;
    options.onglets.activer(id);
    const panneau = options.onglets.panneaux[id];
    const premiere = SCHEMA_OPTIONS.find(s => s.id === id).lignes[0];
    montrerAideOption(premiere);
    if (change && depuisUtilisateur) son('ui_page');
    if (depuisUtilisateur) requestAnimationFrame(() => { const c = navigables(panneau)[0]; focaliser((c || options.onglets.boutons[id])); });
  }

  function construireLigneOption(def) {
    const idLib = `ui-opt-${def.cle}`;
    const libelle = el('span', { class: 'ui-opt-libelle', id: idLib }, def.libelle);
    let controle;
    let maj;
    if (def.type === 'choix') {
      const segs = def.valeurs.map(([v, lib]) => el('button', { class: 'ui-segment', type: 'button', role: 'radio', tabindex: '-1', 'data-valeur': v, onclick: (ev) => { ev.stopPropagation(); changerOption(def.cle, v); focaliser(controle); } }, lib));
      controle = el('div', { class: 'ui-segments', role: 'radiogroup', tabindex: '0', 'aria-labelledby': idLib, 'data-nav': '', 'data-nav-h': '' }, segs);
      controle._ajuster = (sens) => {
        const vals = def.valeurs.map(x => x[0]);
        const i = vals.indexOf(S.options[def.cle]);
        const j = pince(i + sens, 0, vals.length - 1);
        if (j !== i) changerOption(def.cle, vals[j]);
      };
      controle._activer = () => {
        const vals = def.valeurs.map(x => x[0]);
        const i = vals.indexOf(S.options[def.cle]);
        changerOption(def.cle, vals[(i + 1) % vals.length]);
      };
      maj = () => { for (const s of segs) s.setAttribute('aria-checked', s.dataset.valeur === S.options[def.cle] ? 'true' : 'false'); };
    } else if (def.type === 'curseur') {
      const rempli = el('div', { class: 'ui-curseur-rempli' });
      const poignee = el('div', { class: 'ui-curseur-poignee' });
      const piste = el('div', { class: 'ui-curseur-piste' }, rempli, poignee);
      const valeur = el('span', { class: 'ui-curseur-valeur', 'aria-hidden': 'true' }, '');
      controle = el('div', { class: 'ui-curseur', role: 'slider', tabindex: '0', 'aria-labelledby': idLib, 'aria-valuemin': String(def.min), 'aria-valuemax': String(def.max), 'data-nav': '', 'data-nav-h': '' }, piste, valeur);
      const fixer = (v) => {
        const n = Math.round((pince(v, def.min, def.max) - def.min) / def.pas) * def.pas + def.min;
        changerOption(def.cle, Number(n.toFixed(3)));
      };
      controle._ajuster = (sens) => fixer(S.options[def.cle] + sens * def.pas);
      controle._activer = () => { };
      controle.addEventListener('keydown', (ev) => {
        if (ev.key === 'Home') { fixer(def.min); ev.preventDefault(); ev.stopPropagation(); }
        else if (ev.key === 'End') { fixer(def.max); ev.preventDefault(); ev.stopPropagation(); }
        else if (ev.key === 'PageUp') { fixer(S.options[def.cle] + def.pas * 4); ev.preventDefault(); ev.stopPropagation(); }
        else if (ev.key === 'PageDown') { fixer(S.options[def.cle] - def.pas * 4); ev.preventDefault(); ev.stopPropagation(); }
      });
      const depuisPointeur = (ev) => {
        const r = piste.getBoundingClientRect();
        fixer(def.min + ((ev.clientX - r.left) / r.width) * (def.max - def.min));
      };
      controle.addEventListener('pointerdown', (ev) => {
        focaliser(controle);
        controle.setPointerCapture(ev.pointerId);
        depuisPointeur(ev);
        const bouge = (e2) => depuisPointeur(e2);
        const fin = () => { controle.removeEventListener('pointermove', bouge); controle.removeEventListener('pointerup', fin); controle.removeEventListener('pointercancel', fin); son('ui_clic'); };
        controle.addEventListener('pointermove', bouge);
        controle.addEventListener('pointerup', fin);
        controle.addEventListener('pointercancel', fin);
      });
      maj = () => {
        const v = S.options[def.cle];
        const t = (v - def.min) / (def.max - def.min);
        controle.style.setProperty('--v', String(pince(t, 0, 1)));
        valeur.textContent = def.format(v);
        controle.setAttribute('aria-valuenow', String(v));
        controle.setAttribute('aria-valuetext', def.format(v));
      };
    } else {
      const etatTexte = el('span', { class: 'ui-bascule-etat' }, '');
      controle = el('button', { class: 'ui-bascule', type: 'button', role: 'switch', 'aria-labelledby': idLib, 'data-nav': '', 'data-nav-h': '', onclick: () => changerOption(def.cle, !S.options[def.cle]) }, el('span', { class: 'ui-bascule-piste' }), etatTexte);
      controle._ajuster = (sens) => { const v = sens > 0; if (S.options[def.cle] !== v) changerOption(def.cle, v); };
      controle._activer = () => controle.click();
      maj = () => { const v = !!S.options[def.cle]; controle.setAttribute('aria-checked', v ? 'true' : 'false'); etatTexte.textContent = v ? 'Activé' : 'Désactivé'; };
    }
    const ligne = el('div', { class: 'ui-opt' }, libelle, controle);
    ligne._def = def;
    libelle.addEventListener('click', () => controle.focus());
    maj();
    return { el: ligne, controle, maj };
  }

  function majControlesOptions() {
    for (const c of Object.values(options.controles)) c.maj();
    const tailles = { petite: 16, normale: 19, grande: 23, tres_grande: 28 };
    options.apercu.style.fontSize = `${tailles[S.options.tailleSousTitres] || 19}px`;
    options.apercuBoite.style.background = `rgba(4, 16, 23, ${{ aucun: 0, leger: 0.55, opaque: 0.92 }[S.options.fondSousTitres]})`;
    options.apercu.style.opacity = S.options.sousTitres ? '1' : '.35';
    options.apercuNom.style.fontSize = '0.56em';
    options.apercuNom.style.color = COULEURS_PERSONNAGES.eric;
  }

  function changerOption(cle, valeur) {
    if (S.options[cle] === valeur) return;
    S.options[cle] = valeur;
    son('ui_survol');
    appliquerOptions();
    ecrireOptions(S.options);
    majControlesOptions();
    if (cle === 'clavier') rafraichirGlyphes();
    emettre('options', { ...S.options });
  }

  function retablirOptions() {
    son('ui_clic');
    S.options = optionsParDefaut();
    appliquerOptions();
    ecrireOptions(S.options);
    majControlesOptions();
    rafraichirGlyphes();
    emettre('options', { ...S.options });
  }

  function appliquerOptions() {
    const o = S.options;
    racine.dataset.tailleSt = o.tailleSousTitres;
    racine.dataset.fondSt = o.fondSousTitres;
    racine.classList.toggle('ui-mouvement-reduit', !!o.reduireMouvement);
    racine.classList.toggle('ui-contraste', !!o.contraste);
    if (!o.sousTitres) { st.el.classList.remove('visible'); replique.el.classList.remove('visible'); }
    else if (S.st) st.el.classList.add('visible');
  }

  function majTouchesListe() {
    if (!options || !options.listeTouches) return;
    const lignes = [
      ['Se déplacer', 'deplacer'],
      ['Regarder', 'regarder'],
      ['Courir', 'courir'],
      ['Sauter', 'sauter'],
      ['Interagir', 'interagir'],
      ['Journal', 'journal'],
      ['Carte', 'carte'],
      ['Pause', 'pause']
    ];
    options.listeTouches.replaceChildren(...lignes.map(([lib, action]) => el('li', {},
      el('span', {}, lib),
      el('span', { class: 'ui-touches-cles' }, glyphe(action, 'clavier')),
      el('span', { class: 'ui-touches-manette' }, glyphe(action, 'manette')))));
    for (const g of options.listeTouches.querySelectorAll('[data-glyphe]')) g.removeAttribute('data-glyphe');
  }

  /* ---------- Mode salle ---------- */

  const ICONES_SALLES = { arena: 'patin', bibliotheque: 'livres', campus: 'pavillon', clsc: 'clsc', soutenance: 'lutrin' };
  const TEINTES_SALLES = { arena: '#11A7A5', bibliotheque: '#0879BE', campus: '#0755AD', clsc: '#3E8A22', soutenance: '#4F6878' };

  const sallesVue = (() => {
    const liste = el('div', { class: 'ui-salles-liste ui-defile' });
    const entete = entetePlein({ surtitre: 'Mode salle', titre: 'Choisir une activité', idTitre: 'ui-salles-titre' });
    const e = el('section', { class: 'ui-couche ui-salles', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-salles-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein ui-entree' }, entete.el, el('div', { class: 'ui-plein-corps' }, liste)));
    return { el: e, liste };
  })();
  couches.salles = { el: sallesVue.el, preparer: () => { rendreSalles(); emettre('salles:verifier', {}); } };

  function rendreSalles() {
    const l = S.salles || [];
    if (!l.length) {
      sallesVue.liste.replaceChildren(el('div', { class: 'ui-vide ui-carte-panneau', style: { minHeight: '240px' } }, icone('cible'), el('p', {}, 'Aucune salle n’est prête pour l’instant.')));
      return;
    }
    const focusAvant = document.activeElement && sallesVue.el.contains(document.activeElement) ? document.activeElement.dataset.cle : null;
    let premier = null;
    const cartes = l.map((sa, i) => {
      const dispo = sa.disponible !== false;
      const acts = Array.isArray(sa.activites) ? sa.activites : [];
      const boutons = acts.map((a) => {
        const b = el('button', { class: 'ui-activite', type: 'button', 'data-nav': '', 'data-cle': `${sa.id}/${a.id}`, 'aria-disabled': dispo ? null : 'true', onclick: () => choisirActivite(sa, a, dispo) },
          el('span', { class: 'ui-activite-textes' }, el('span', { class: 'ui-activite-titre' }, a.titre || ''), a.description ? el('span', { class: 'ui-activite-desc' }, a.description) : null),
          el('span', { class: 'ui-activite-fleche', html: svg(dispo ? 'chevron' : 'cadenas') }));
        if (dispo && !premier) premier = b;
        return el('li', {}, b);
      });
      return el('article', { class: 'ui-salle' + (dispo ? '' : ' indispo'), style: { '--teinte': TEINTES_SALLES[sa.zone || sa.id] || '#0879BE' }, 'aria-label': sa.titre || '' },
        el('header', { class: 'ui-salle-tete' },
          el('span', { class: 'ui-salle-icone', html: svg(ICONES_SALLES[sa.zone || sa.id] || 'lieu') }),
          el('span', { class: 'ui-salle-num', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')),
          dispo ? null : el('span', { class: 'ui-salle-badge' }, icone('cadenas'), 'En construction')),
        el('div', { class: 'ui-salle-corps' },
          el('h3', { class: 'ui-salle-titre' }, sa.titre || ''),
          sa.sousTitre ? el('p', { class: 'ui-salle-sous' }, sa.sousTitre) : null,
          el('ul', { class: 'ui-salle-activites' }, boutons)));
    });
    sallesVue.liste.replaceChildren(...cartes);
    const cible = (focusAvant && sallesVue.liste.querySelector(`[data-cle="${CSS.escape(focusAvant)}"]`)) || null;
    if (premier) premier.setAttribute('data-defaut', '');
    if (cible) focaliser(cible);
  }

  function choisirActivite(sa, a, dispo) {
    if (!dispo) {
      son('ui_echec');
      toast({ texte: `${sa.titre} : ce lieu est encore en construction.`, type: 'info', duree: 3.5 });
      return;
    }
    son('ui_clic');
    S.derniereSalle = { salle: sa.id, activite: a.id };
    definirModeJeu('salle');
    if (S.base === 'hud') fermerTout();
    else fermerTout({ silencieux: true });
    emettre('partie:salle', { salle: sa.id, activite: a.id });
  }

  const salleFin = (() => {
    const anneau = el('div', { class: 'ui-sf-anneau ui-entree', 'aria-hidden': 'true' }, el('span', { class: 'ui-sf-score' }, ''), el('span', { class: 'ui-sf-sur' }, ''));
    const surtitre = el('p', { class: 'ui-surtitre ui-entree d1' }, '');
    const titreF = el('h1', { class: 'ui-sf-titre ui-entree d1', id: 'ui-sf-titre' }, '');
    const verdict = el('p', { class: 'ui-sf-verdict ui-entree d2' }, '');
    const details = el('ul', { class: 'ui-sf-details ui-entree d3' });
    const actions = el('div', { class: 'ui-fin-actions ui-entree d4' });
    const e = el('section', { class: 'ui-couche ui-salle-fin', 'aria-labelledby': 'ui-sf-titre', inert: '' },
      el('div', { class: 'ui-voile' }),
      el('div', { class: 'ui-sf-contenu' }, anneau, surtitre, titreF, el('div', { class: 'ui-fin-filet ui-entree d2', 'aria-hidden': 'true' }), verdict, details, actions));
    return { el: e, anneau, surtitre, titre: titreF, verdict, details, actions };
  })();
  bases.salle_fin = salleFin.el;

  function majSalleFin(d = {}) {
    const idSalle = d.salle && typeof d.salle === 'object' ? d.salle.id : d.salle;
    const sa = (d.salle && typeof d.salle === 'object') ? d.salle : (S.salles.find(x => x.id === idSalle) || { id: idSalle });
    const idAct = d.activite && typeof d.activite === 'object' ? d.activite.id : d.activite;
    const act = (d.activite && typeof d.activite === 'object') ? d.activite : ((sa.activites || []).find(x => x.id === idAct) || { id: idAct });
    S.derniereSalle = { salle: idSalle, activite: idAct };
    const b = d.bilan || {};
    const total = Math.max(0, Number(b.total) || 0);
    const reussis = Math.max(0, Math.min(total, Number(b.reussis) || 0));
    const resultat = total && reussis === total ? 'parfait' : (reussis > 0 ? 'partiel' : 'rate');
    salleFin.el.dataset.resultat = resultat;
    salleFin.el.style.setProperty('--r', total ? (reussis / total).toFixed(3) : '0');
    salleFin.anneau.querySelector('.ui-sf-score').textContent = String(reussis);
    salleFin.anneau.querySelector('.ui-sf-sur').textContent = fr(`sur ${total}`);
    salleFin.surtitre.textContent = fr(sa.titre || 'Mode salle');
    salleFin.titre.textContent = fr(act.titre || 'Activité terminée');
    const verdicts = { parfait: 'Activité réussie. Rien à redire.', partiel: `${reussis} réussite${reussis > 1 ? 's' : ''} sur ${total}. Encore un essai ?`, rate: 'Pas cette fois. Chaque essai rapproche du but.' };
    salleFin.verdict.textContent = fr(total ? verdicts[resultat] : 'Activité terminée.');
    const lignes = Array.isArray(b.details) ? b.details : [];
    salleFin.details.replaceChildren(...lignes.map((x) => el('li', { class: x.reussi ? 'reussi' : 'rate' },
      el('span', { class: 'ui-sf-pastille', html: svg(x.reussi ? 'check' : 'croix') }),
      el('span', { class: 'ui-sf-ligne' }, x.titre || ''),
      Number.isFinite(Number(x.score)) && x.score != null ? el('span', { class: 'ui-sf-pct' }, `${Math.round(Number(x.score) * 100)}${NBSP}%`) : null,
      el('span', { class: 'ui-sr' }, x.reussi ? ' (réussi)' : ' (à reprendre)'))));
    salleFin.details.hidden = !lignes.length;
    salleFin.actions.replaceChildren(
      el('button', { class: 'ui-bouton primaire', type: 'button', 'data-nav': '', 'data-defaut': '', onclick: () => { son('ui_clic'); definirModeJeu('salle'); emettre('partie:salle', { salle: idSalle, activite: idAct }); } }, 'Rejouer'),
      el('button', { class: 'ui-bouton', type: 'button', 'data-nav': '', onclick: () => { son('ui_clic'); ouvrirCouche('salles'); } }, 'Autre activité'),
      el('button', { class: 'ui-bouton', type: 'button', 'data-nav': '', onclick: () => { son('ui_clic'); emettre('quitter', {}); changerBase('titre'); } }, 'Menu principal'));
  }

  /* ---------- Chapitres ---------- */

  const chapitresVue = (() => {
    const liste = el('div', { class: 'ui-chapitres-liste ui-defile' });
    const entete = entetePlein({ surtitre: 'Reprendre à un chapitre', titre: 'Chapitres', idTitre: 'ui-chapitres-titre' });
    const e = el('section', { class: 'ui-couche ui-chapitres', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-chapitres-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein ui-entree' }, entete.el, el('div', { class: 'ui-plein-corps' }, liste)));
    return { el: e, liste };
  })();
  couches.chapitres = { el: chapitresVue.el, preparer: rendreChapitres };

  function chapitresDuScenario() {
    const chs = (etat.scenario && etat.scenario.chapitres) || [];
    if (!chs.length) return [];
    const p = lireStockageJSON(CLE_PARTIE);
    const atteint = Math.max(0, chs.findIndex(c => c.id === p.chapitre));
    return chs.map((c, i) => ({ id: c.id, numero: i + 1, titre: c.titre, lieu: (lieuDe(c.zone) || {}).titre || '', debloque: i <= atteint }));
  }
  function rendreChapitres() {
    const l = S.chapitres.length ? S.chapitres : chapitresDuScenario();
    if (!l.length) {
      chapitresVue.liste.replaceChildren(el('div', { class: 'ui-vide ui-carte-panneau', style: { gridColumn: '1 / -1', minHeight: '240px' } }, icone('cadenas'), el('p', {}, 'Les chapitres se débloquent à mesure que vous avancez.')));
      return;
    }
    let premier = true;
    chapitresVue.liste.replaceChildren(...l.map((c, i) => {
      const ouvert = c.debloque !== false;
      const b = el('button', { class: 'ui-chapitre' + (ouvert ? '' : ' verrou'), type: 'button', 'data-nav': '', 'aria-disabled': ouvert ? null : 'true', onclick: () => { if (!ouvert) { son('ui_echec'); return; } son('ui_clic'); emettre('partie:chapitre', { id: c.id }); } },
        el('span', { class: 'ui-chapitre-num', 'aria-hidden': 'true' }, String(c.numero ?? i + 1).padStart(2, '0')),
        el('span', { class: 'ui-chapitre-titre' }, ouvert ? (c.titre || '') : (c.titre || 'Chapitre verrouillé')),
        el('span', { class: 'ui-chapitre-lieu' }, icone('lieu'), el('span', {}, c.lieu || c.zoneTitre || '')),
        ouvert ? null : el('span', { class: 'ui-chapitre-cadenas' }, icone('cadenas'), 'Verrouillé'));
      if (ouvert && premier) { b.setAttribute('data-defaut', ''); premier = false; }
      return b;
    }));
  }

  /* ---------- Crédits ---------- */

  const creditsVue = (() => {
    const rouleau = el('div', { class: 'ui-credits-rouleau' });
    const zone = el('div', { class: 'ui-credits-zone ui-defile', tabindex: '0', 'data-nav': '', 'data-defile': '', 'aria-label': 'Crédits, faire défiler' }, rouleau);
    const fermer = el('button', { class: 'ui-bouton-icone ui-fermer', type: 'button', 'aria-label': 'Fermer', 'data-nav': '', onclick: () => { son('ui_clic'); retour(); } }, icone('croix'));
    const e = el('section', { class: 'ui-couche ui-credits', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Crédits', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-plein ui-entree' }, el('div', { style: { position: 'absolute', right: 'calc(var(--marge) * 1.5)', top: 'calc(var(--marge) * 1.1)', zIndex: '2' } }, fermer), el('div', { class: 'ui-plein-corps', style: { marginTop: '0' } }, zone)));
    zone.setAttribute('data-defaut', '');
    return { el: e, rouleau, zone, raf: 0, auto: true };
  })();
  couches.credits = { el: creditsVue.el, preparer: () => { rendreCredits(); demarrerDefilementCredits(); }, fermer: () => cancelAnimationFrame(creditsVue.raf) };

  function rendreCredits() {
    const sections = [
      { titre: 'D’après la thèse de', lignes: [['Éric Bernier', 'Doctorat en santé publique · ESPUM, Université de Montréal']] },
      ...S.credits,
      { titre: 'Police de caractères', lignes: [['Lato', 'Łukasz Dziedzic · SIL Open Font License 1.1']] }
    ];
    const ligne = (l) => {
      if (typeof l === 'string') return el('p', {}, l);
      if (Array.isArray(l)) return el('p', {}, l[0], l[1] ? el('small', {}, l[1]) : null);
      const detail = [l.auteur, l.licence].filter(Boolean).join(' · ');
      return el('p', {}, l.ressource || l.nom || l.titre || '', detail ? el('small', {}, detail) : null);
    };
    creditsVue.rouleau.replaceChildren(
      el('h2', { class: 'ui-credits-titre' }, 'Protocole'),
      ...sections.map(s => el('section', { class: 'ui-credits-section' }, el('h3', {}, s.titre || s.section || ''), (s.lignes || []).map(ligne))),
      el('p', { class: 'ui-credits-note' }, 'Hormis Éric Bernier, tous les personnages sont fictifs. Toute ressemblance avec des personnes réelles serait fortuite.'));
  }
  function demarrerDefilementCredits() {
    cancelAnimationFrame(creditsVue.raf);
    creditsVue.zone.scrollTop = 0;
    creditsVue.auto = !S.options.reduireMouvement;
    let t0 = 0;
    let acc = 0;
    const pas = (t) => {
      if (!S.pile.includes('credits')) return;
      if (t0 && creditsVue.auto) {
        acc += ((t - t0) / 1000) * 34;
        if (acc >= 1) { const n = Math.floor(acc); creditsVue.zone.scrollTop += n; acc -= n; }
      }
      t0 = t;
      creditsVue.raf = requestAnimationFrame(pas);
    };
    creditsVue.raf = requestAnimationFrame(pas);
  }
  for (const ev of ['wheel', 'pointerdown', 'touchstart', 'keydown']) creditsVue.zone.addEventListener(ev, () => { creditsVue.auto = false; }, { passive: true });

  /* ---------- Confirmation ---------- */

  const confirmation = (() => {
    const surtitre = el('p', { class: 'ui-surtitre' }, '');
    const titreC = el('h2', { id: 'ui-confirmation-titre' }, '');
    const texte = el('p', { class: 'ui-modal-texte' }, '');
    const annuler = el('button', { class: 'ui-bouton', type: 'button', 'data-nav': '', onclick: () => resoudreConfirmation(false) }, 'Annuler');
    const ok = el('button', { class: 'ui-bouton primaire', type: 'button', 'data-nav': '', onclick: () => resoudreConfirmation(true) }, 'Confirmer');
    const e = el('section', { class: 'ui-couche ui-confirmation', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'ui-confirmation-titre', inert: '' },
      el('div', { class: 'ui-fond-menu' }),
      el('div', { class: 'ui-modal' }, surtitre, titreC, texte, el('div', { class: 'ui-modal-actions' }, annuler, ok)));
    return { el: e, surtitre, titre: titreC, texte, annuler, ok, resoudre: null };
  })();
  couches.confirmation = { el: confirmation.el };

  function confirmer({ surtitre = '', titre: t = '', texte = '', ok = 'Confirmer', annuler = 'Annuler', danger = false } = {}) {
    if (confirmation.resoudre) confirmation.resoudre(false);
    confirmation.surtitre.textContent = fr(surtitre);
    confirmation.titre.textContent = fr(t);
    confirmation.texte.textContent = fr(texte);
    confirmation.ok.textContent = fr(ok);
    confirmation.annuler.textContent = fr(annuler);
    confirmation.ok.classList.toggle('danger', danger);
    confirmation.ok.classList.toggle('primaire', !danger);
    confirmation.annuler.toggleAttribute('data-defaut', danger);
    confirmation.ok.toggleAttribute('data-defaut', !danger);
    return new Promise(res => {
      confirmation.resoudre = res;
      ouvrirCouche('confirmation', { silencieux: true });
    });
  }
  function resoudreConfirmation(v) {
    const r = confirmation.resoudre;
    confirmation.resoudre = null;
    son('ui_clic');
    if (S.pile[S.pile.length - 1] === 'confirmation') fermerCouche({ silencieux: true });
    if (r) r(v);
  }

  /* ---------- Fin ---------- */

  const fin = (() => {
    const sceau = el('div', { class: 'ui-fin-sceau ui-entree', 'aria-hidden': 'true' });
    const surtitre = el('p', { class: 'ui-surtitre ui-entree d1' }, '');
    const titreF = el('h1', { class: 'ui-fin-titre ui-entree d1', id: 'ui-fin-titre' }, '');
    const texte = el('p', { class: 'ui-fin-texte ui-entree d2' }, '');
    const bilan = el('div', { class: 'ui-fin-bilan ui-entree d3' });
    const actions = el('div', { class: 'ui-fin-actions ui-entree d4' });
    const e = el('section', { class: 'ui-couche ui-fin', 'aria-labelledby': 'ui-fin-titre', inert: '' },
      el('div', { class: 'ui-voile' }),
      el('div', { class: 'ui-fin-contenu' }, sceau, surtitre, titreF, el('div', { class: 'ui-fin-filet ui-entree d2', 'aria-hidden': 'true' }), texte, bilan, actions));
    return { el: e, sceau, surtitre, titre: titreF, texte, bilan, actions };
  })();
  bases.fin = fin.el;

  const ALIAS_FINS = { reussite: 'reussie', reussie: 'reussie', succes: 'reussie', corrections: 'corrections', report: 'report', echec: 'report' };
  function bilanDepuisEtat(e) {
    if (!e || typeof e !== 'object') return {};
    const stats = e.stats || {};
    const compte = (v) => Array.isArray(v) ? v.length : (v instanceof Set ? v.size : v);
    return {
      semaines: e.semaines,
      rigueur: stats.rigueur ?? e.rigueur,
      preuves: compte(e.preuves),
      suivis: e.suivis ?? e.rencontres,
      defis: e.defisReussis ?? e.defis
    };
  }
  function majFin(d = {}) {
    const r = ALIAS_FINS[d.issue || d.resultat || d.type] || 'reussie';
    const def = FINS[r];
    fin.el.dataset.resultat = r;
    fin.sceau.innerHTML = svg(def.icone);
    fin.surtitre.textContent = fr(d.surtitre || def.surtitre);
    const [a, b] = d.titre ? [d.titre, ''] : def.titre;
    fin.titre.replaceChildren(document.createTextNode(fr(a)), b ? el('br') : '', b ? el('b', {}, b) : '');
    fin.texte.textContent = fr(d.texte || def.texte);
    const B = d.bilan || bilanDepuisEtat(d.etat);
    const cases = [];
    const nb = (v) => v != null && Number.isFinite(Number(v));
    if (nb(B.semaines)) cases.push([Number(B.semaines) === 1 ? 'Semaine restante' : 'Semaines restantes', String(Math.max(0, Math.round(B.semaines)))]);
    if (nb(B.rigueur)) cases.push(['Rigueur', String(Math.round(B.rigueur))]);
    if (nb(B.preuves)) cases.push(['Preuves', String(B.preuves)]);
    if (nb(B.suivis)) cases.push([Number(B.suivis) === 1 ? 'Rencontre de suivi' : 'Rencontres de suivi', String(B.suivis)]);
    if (nb(B.defis)) cases.push(['Défis réussis', String(B.defis)]);
    fin.bilan.replaceChildren(...cases.map(([n, v]) => el('div', {}, el('p', {}, n), el('p', {}, v))));
    fin.bilan.hidden = !cases.length;
    const boutons = [];
    if (r === 'report') boutons.push(el('button', { class: 'ui-bouton primaire', type: 'button', 'data-nav': '', 'data-defaut': '', onclick: () => { son('ui_clic'); emettre('partie:continuer', {}); } }, 'Reprendre au dernier chapitre'));
    boutons.push(el('button', { class: 'ui-bouton' + (r === 'report' ? '' : ' primaire'), type: 'button', 'data-nav': '', 'data-defaut': r === 'report' ? null : '', onclick: () => { son('ui_clic'); ouvrirCouche('credits'); } }, 'Voir les crédits'));
    boutons.push(el('button', { class: 'ui-bouton', type: 'button', 'data-nav': '', onclick: () => { son('ui_clic'); emettre('quitter', {}); changerBase('titre'); } }, 'Menu principal'));
    fin.actions.replaceChildren(...boutons);
  }

  /* ---------- Contrôles tactiles ---------- */

  const tactile = (() => {
    const manche = el('div', { class: 'ui-tc-manche' });
    const base = el('div', { class: 'ui-tc-base' }, manche);
    const joystick = el('div', { class: 'ui-tc-joystick', 'aria-hidden': 'true' }, base);
    const regard = el('div', { class: 'ui-tc-regard', 'aria-hidden': 'true' });
    const bouton = (nom, ic, libelle) => el('button', { class: 'ui-tc-bouton', type: 'button', 'data-nav-ignore': '', 'data-nom': nom, 'aria-label': libelle }, icone(ic), el('span', { class: 'ui-tc-libelle', 'aria-hidden': 'true' }, libelle));
    const interagir = bouton('interagir', 'main', 'Interagir');
    const sauter = bouton('sauter', 'sauter', 'Sauter');
    const tirer = bouton('tirer', 'rondelle', 'Tirer');
    tirer.hidden = true;
    const boutons = el('div', { class: 'ui-tc-boutons' }, interagir, sauter, tirer);
    const haut = el('div', { class: 'ui-tc-haut' },
      el('button', { class: 'ui-bouton-icone ui-tc-journal', type: 'button', 'aria-label': 'Journal', onclick: () => actionTactile('journal') }, icone('journal')),
      el('button', { class: 'ui-bouton-icone', type: 'button', 'aria-label': 'Carte', onclick: () => actionTactile('carte') }, icone('carte')),
      el('button', { class: 'ui-bouton-icone', type: 'button', 'aria-label': 'Pause', onclick: () => actionTactile('pause') }, icone('pause')));
    const e = el('div', { class: 'ui-tactile' }, regard, joystick, boutons, haut);
    return { el: e, joystick, base, manche, regard, interagir, sauter, tirer, haut };
  })();

  (() => {
    let id = null;
    let cx = 0;
    let cy = 0;
    let rayon = 56;
    let raf = 0;
    let vec = { x: 0, y: 0 };
    const envoyer = () => { raf = 0; emettre('tactile:deplacement', { ...vec }); };
    const planifier = () => { if (!raf) raf = requestAnimationFrame(envoyer); };
    const z = tactile.joystick;
    z.addEventListener('pointerdown', (e) => {
      if (id != null) return;
      id = e.pointerId;
      z.setPointerCapture(id);
      const r = z.getBoundingClientRect();
      rayon = tactile.base.clientWidth / 2;
      cx = e.clientX;
      cy = e.clientY;
      tactile.base.style.left = `${e.clientX - r.left}px`;
      tactile.base.style.bottom = `${r.bottom - e.clientY}px`;
      tactile.base.classList.add('actif');
      e.preventDefault();
    });
    z.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      let dx = e.clientX - cx;
      let dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > rayon) { dx *= rayon / d; dy *= rayon / d; }
      tactile.manche.style.transform = `translate(${dx}px, ${dy}px)`;
      vec = { x: Number((dx / rayon).toFixed(3)), y: Number((-dy / rayon).toFixed(3)) };
      planifier();
    });
    const relacher = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      tactile.manche.style.transform = '';
      tactile.base.style.left = '';
      tactile.base.style.bottom = '';
      tactile.base.classList.remove('actif');
      vec = { x: 0, y: 0 };
      planifier();
    };
    z.addEventListener('pointerup', relacher);
    z.addEventListener('pointercancel', relacher);

    let idR = null;
    let rx = 0;
    let ry = 0;
    const R = tactile.regard;
    R.addEventListener('pointerdown', (e) => { if (idR != null) return; idR = e.pointerId; R.setPointerCapture(idR); rx = e.clientX; ry = e.clientY; });
    R.addEventListener('pointermove', (e) => {
      if (e.pointerId !== idR) return;
      const dx = e.clientX - rx;
      const dy = e.clientY - ry;
      rx = e.clientX;
      ry = e.clientY;
      if (dx || dy) emettre('tactile:regard', { dx, dy });
    });
    const finR = (e) => { if (e.pointerId === idR) idR = null; };
    R.addEventListener('pointerup', finR);
    R.addEventListener('pointercancel', finR);

    for (const b of [tactile.interagir, tactile.sauter]) {
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.classList.add('appuye'); emettre('tactile:action', { action: b.dataset.nom }); });
      const fin2 = () => b.classList.remove('appuye');
      b.addEventListener('pointerup', fin2);
      b.addEventListener('pointercancel', fin2);
      b.addEventListener('pointerleave', fin2);
    }
    const T = tactile.tirer;
    T.addEventListener('pointerdown', (e) => { e.preventDefault(); T.setPointerCapture(e.pointerId); T.classList.add('appuye'); emettre('tactile:action', { action: 'tirer_debut' }); });
    const finTir = () => { if (!T.classList.contains('appuye')) return; T.classList.remove('appuye'); emettre('tactile:action', { action: 'tirer_fin' }); };
    T.addEventListener('pointerup', finTir);
    T.addEventListener('pointercancel', finTir);
  })();

  function actionTactile(action) {
    son('ui_clic');
    if (autonome) ouvrirCouche(action);
    else emettre('tactile:action', { action });
  }

  /* ---------- But et carte de chapitre ---------- */

  const but = (() => {
    const sous = el('p', { class: 'ui-but-sous' }, '');
    const e = el('div', { class: 'ui-but', 'aria-live': 'assertive' },
      el('span', { class: 'ui-but-faisceau f1', 'aria-hidden': 'true' }),
      el('span', { class: 'ui-but-faisceau f2', 'aria-hidden': 'true' }),
      el('div', { class: 'ui-but-contenu' }, el('p', { class: 'ui-but-titre' }, 'But'), el('span', { class: 'ui-but-filet', 'aria-hidden': 'true' }), sous));
    return { el: e, sous, minuterie: 0 };
  })();

  const chapitreVue = (() => {
    const numero = el('p', { class: 'ui-chapitre-carte-num' }, '');
    const titreC = el('p', { class: 'ui-chapitre-carte-titre' }, '');
    const sous = el('p', { class: 'ui-chapitre-carte-sous' }, '');
    const e = el('div', { class: 'ui-chapitre-carte', role: 'status' },
      el('div', { class: 'ui-chapitre-carte-contenu' }, numero, el('span', { class: 'ui-chapitre-carte-filet', 'aria-hidden': 'true' }), titreC, sous));
    return { el: e, numero, titre: titreC, sous, minuterie: 0 };
  })();

  /* ---------- Éléments globaux ---------- */

  const vignette = el('div', { class: 'ui-vignette', 'aria-hidden': 'true' });
  const bandes = el('div', { class: 'ui-bandes', 'aria-hidden': 'true' });
  const capteur = el('div', { class: 'ui-capteur', 'aria-hidden': 'true' });
  capteur.addEventListener('click', () => { if ((S.mode === 'dialogue' || S.st) && !S.pile.length) passer_(); });
  const aide = el('div', { class: 'ui-aide', 'aria-hidden': 'true' });

  racine.append(
    vignette,
    titre.el,
    chargement.el,
    hud.el,
    bandes,
    capteur,
    replique.el,
    st.el,
    choix.el,
    toasts,
    tactile.el,
    but.el,
    chapitreVue.el,
    fin.el,
    salleFin.el,
    chapitresVue.el,
    pause.el,
    sallesVue.el,
    journal.el,
    carteVue.el,
    options.el,
    creditsVue.el,
    confirmation.el,
    aide
  );

  /* ---------- Aide contextuelle ---------- */

  function itemAide(action, libelle, fn) {
    const b = el('button', { class: 'ui-aide-item', type: 'button', tabindex: '-1', onclick: fn }, glyphe(action), el('span', {}, libelle));
    return b;
  }
  function majAide() {
    const haut = S.pile[S.pile.length - 1];
    const items = [];
    const valider = () => activer(document.activeElement);
    if (haut) {
      if (couches[haut].onglets) items.push(itemAide('onglets', 'Onglets', () => changerOngletRelatif(1)));
      if (haut !== 'carte' && haut !== 'credits') items.push(itemAide('valider', 'Choisir', valider));
      items.push(itemAide('retour', haut === 'pause' ? 'Reprendre' : (haut === 'confirmation' ? 'Annuler' : 'Retour'), retour));
    } else if (S.choix) {
      items.push(itemAide('valider', 'Choisir', valider));
    } else if (S.base === 'titre' || S.base === 'fin' || S.base === 'salle_fin') {
      items.push(itemAide('valider', 'Choisir', valider));
      if (S.base === 'titre' && S.pageTitre === 'histoire') items.push(itemAide('retour', 'Retour', retour));
    }
    aide.replaceChildren(...items);
    aide.classList.toggle('ouvert', items.length > 0);
  }

  /* ---------- Navigation ---------- */

  function marquerSel(t) {
    if (selection && selection !== t) selection.classList.remove('ui-sel');
    if (t && t.classList && racine.contains(t)) { t.classList.add('ui-sel'); selection = t; } else selection = null;
  }
  function focaliser(n) {
    if (!n || typeof n.focus !== 'function') return;
    n.focus({ preventScroll: true });
    if (document.activeElement === n) marquerSel(n);
  }

  function navigables(zone) {
    if (!zone) return [];
    return [...zone.querySelectorAll('[data-nav]')].filter(n => !n.hasAttribute('data-nav-ignore') && visible(n) && zone.contains(n));
  }

  function zoneActive() {
    const haut = S.pile[S.pile.length - 1];
    if (haut) return couches[haut].el;
    if (S.choix) return choix.el;
    if (S.base === 'titre') return titre.el;
    if (S.base === 'fin') return fin.el;
    if (S.base === 'salle_fin') return salleFin.el;
    return null;
  }

  function focusInitial(zone) {
    if (!zone) return;
    if (zone.contains(document.activeElement) && document.activeElement !== zone && visible(document.activeElement)) return;
    const liste = navigables(zone);
    const panneau = zone.querySelector('.ui-panneau-onglet.actif');
    const cible = liste.find(n => n.hasAttribute('data-defaut'))
      || (panneau && liste.find(n => panneau.contains(n)))
      || liste.find(n => n.getAttribute('aria-selected') === 'true')
      || liste[0];
    if (cible) focaliser(cible);
  }

  function voisin(courant, dir, liste) {
    const r = courant.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let meilleur = null;
    let score = Infinity;
    for (const c of liste) {
      if (c === courant || c.contains(courant) || courant.contains(c)) continue;
      const q = c.getBoundingClientRect();
      const qx = q.left + q.width / 2;
      const qy = q.top + q.height / 2;
      let prim;
      let orth;
      if (dir === 'bas' || dir === 'haut') {
        prim = dir === 'bas' ? q.top - r.bottom : r.top - q.bottom;
        if ((dir === 'bas' && qy <= cy + 2) || (dir === 'haut' && qy >= cy - 2)) continue;
        orth = Math.max(0, q.left - r.right, r.left - q.right);
        orth += Math.abs(qx - cx) * 0.05;
      } else {
        prim = dir === 'droite' ? q.left - r.right : r.left - q.right;
        if ((dir === 'droite' && qx <= cx + 2) || (dir === 'gauche' && qx >= cx - 2)) continue;
        orth = Math.max(0, q.top - r.bottom, r.top - q.bottom);
        if (orth > Math.max(r.height, q.height) * 0.75) continue;
        orth += Math.abs(qy - cy) * 0.05;
      }
      const s = Math.max(prim, -r.height) + orth * 3;
      if (s < score) { score = s; meilleur = c; }
    }
    return meilleur;
  }

  function naviguer(dir) {
    const zone = zoneActive();
    if (!zone) return;
    const liste = navigables(zone);
    if (!liste.length) return;
    const a = document.activeElement;
    if (!a || !zone.contains(a) || !liste.includes(a)) { focusInitial(zone); return; }
    if (a.hasAttribute('data-defile') && (dir === 'haut' || dir === 'bas')) {
      const avant = a.scrollTop;
      a.scrollBy({ top: dir === 'bas' ? 90 : -90, behavior: S.options.reduireMouvement ? 'auto' : 'smooth' });
      const auBord = dir === 'bas' ? a.scrollTop + a.clientHeight >= a.scrollHeight - 2 : avant <= 0;
      if (!auBord) return;
    }
    if (a.hasAttribute('data-nav-h') && (dir === 'gauche' || dir === 'droite')) {
      if (a._ajuster) a._ajuster(dir === 'droite' ? 1 : -1);
      return;
    }
    if (a.getAttribute('role') === 'tab' && (dir === 'gauche' || dir === 'droite')) {
      changerOngletRelatif(dir === 'droite' ? 1 : -1, true);
      return;
    }
    let cible = voisin(a, dir, liste);
    if (!cible && (dir === 'haut' || dir === 'bas')) {
      const boucle = a.closest('[data-boucle]');
      if (boucle) {
        const dans = liste.filter(n => boucle.contains(n));
        cible = dir === 'bas' ? dans[0] : dans[dans.length - 1];
      }
    }
    if (cible && cible !== a) {
      focaliser(cible);
      cible.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: S.options.reduireMouvement ? 'auto' : 'smooth' });
    }
  }

  function changerOngletRelatif(sens, garderFocusOnglet = false) {
    const haut = S.pile[S.pile.length - 1];
    const c = haut && couches[haut];
    if (!c || !c.onglets) return;
    const ordre = c.onglets.ordre;
    const courant = haut === 'journal' ? S.ongletJournal : S.ongletOptions;
    const i = ordre.indexOf(courant);
    const j = (i + sens + ordre.length) % ordre.length;
    c.changer(ordre[j]);
    if (garderFocusOnglet) requestAnimationFrame(() => focaliser(c.onglets.boutons[ordre[j]]));
  }

  function activer(n) {
    if (!n || !zoneActive() || !zoneActive().contains(n)) { focusInitial(zoneActive()); return; }
    if (n._activer) { n._activer(); return; }
    if (n.hasAttribute('data-defile')) return;
    if (typeof n.click === 'function') n.click();
  }

  /* ---------- Couches ---------- */

  function montrer(n) { n.classList.add('ouvert'); n.removeAttribute('aria-hidden'); }
  function cacher(n) { n.classList.remove('ouvert'); n.setAttribute('aria-hidden', 'true'); }

  function majInert() {
    const haut = S.pile[S.pile.length - 1];
    for (const [nom, c] of Object.entries(couches)) c.el.inert = nom !== haut;
    for (const [nom, n] of Object.entries(bases)) n.inert = !(nom === S.base && !haut) || nom === 'chargement';
    hud.el.inert = !!haut || S.base !== 'hud';
    choix.el.inert = !!haut || !S.choix;
    st.el.inert = !!haut;
    tactile.el.inert = !!haut;
    racine.classList.toggle('ui-menu-ouvert', !!haut);
  }

  function liberePointeur() {
    if (document.pointerLockElement && document.exitPointerLock) {
      S.ignorerPerteVerrou = true;
      try { document.exitPointerLock(); } catch { }
    }
  }

  function ouvrirCouche(nom, opts = {}) {
    const c = couches[nom];
    if (!c) return;
    const i = S.pile.indexOf(nom);
    if (i >= 0) {
      while (S.pile.length > i + 1) fermerCouche({ silencieux: true, sansFocus: true });
      majInert();
      focusInitial(c.el);
      return;
    }
    const etaitVide = S.pile.length === 0;
    c.retourFocus = document.activeElement;
    S.pile.push(nom);
    if (c.preparer) c.preparer(opts);
    montrer(c.el);
    if (etaitVide && S.base === 'hud' && !opts.silencieux) { S.pauseEmise = performance.now(); emettre('pause', { menu: nom }); }
    if (S.base === 'hud') liberePointeur();
    if (nom !== 'confirmation') son('ui_page');
    majInert();
    majAide();
    requestAnimationFrame(() => focusInitial(c.el));
  }

  function fermerCouche(opts = {}) {
    const nom = S.pile.pop();
    if (!nom) return;
    const c = couches[nom];
    cacher(c.el);
    if (c.fermer) c.fermer();
    if (nom === 'confirmation' && confirmation.resoudre) { const r = confirmation.resoudre; confirmation.resoudre = null; r(false); }
    if (S.pile.length === 0 && S.base === 'hud' && !opts.silencieux) emettre('reprendre', {});
    majInert();
    majAide();
    if (opts.sansFocus) return;
    const f = c.retourFocus;
    const zone = zoneActive();
    if (f && zone && zone.contains(f) && visible(f)) focaliser(f);
    else if (zone) focusInitial(zone);
    else if (document.activeElement && racine.contains(document.activeElement)) document.activeElement.blur();
  }

  function fermerTout(opts = {}) {
    const avait = S.pile.length > 0;
    while (S.pile.length) fermerCouche({ silencieux: true, sansFocus: true });
    if (avait && S.base === 'hud' && !opts.silencieux) emettre('reprendre', {});
    if (document.activeElement && racine.contains(document.activeElement)) document.activeElement.blur();
  }

  function reprendre() { fermerTout(); }

  function retour() {
    const haut = S.pile[S.pile.length - 1];
    if (!haut) {
      if (S.base === 'titre' && S.pageTitre === 'histoire') { son('ui_clic'); pageTitre('principal', true); }
      return;
    }
    if (haut === 'confirmation') { resoudreConfirmation(false); return; }
    if (haut === 'pause') { son('ui_clic'); reprendre(); return; }
    son('ui_clic');
    fermerCouche();
  }

  function changerBase(nom, donnees = {}) {
    const avant = S.base;
    fermerTout({ silencieux: true });
    for (const [n, e] of Object.entries(bases)) (n === nom ? montrer : cacher)(e);
    S.base = bases[nom] ? nom : 'aucun';
    racine.dataset.ecran = S.base;
    if (S.base !== 'hud') { definirMode('jeu'); masquerChoix(); afficherSousTitre(null); afficherReplique(null); majInvite(null); majHockey(null); majExercice(null); majPatin(null); }
    if (S.base === 'titre') { majTitre(); pageTitre('principal'); }
    if (S.base === 'fin') majFin(donnees);
    if (S.base === 'salle_fin') majSalleFin(donnees);
    if (S.base === 'hud') { const p = partieCourante(); if (p && p.mode) definirModeJeu(p.mode); }
    if (S.base === 'chargement') {
      chargement.surtitre.textContent = (S.chapitreCourant && S.modeJeu !== 'salle' && !S.chargementDemarrage) ? fr(libelleChapitre(S.chapitreCourant)) : (S.modeJeu === 'salle' ? fr('Mode salle') : '');
      majChargement(donnees);
      demarrerConseils();
    } else { clearInterval(chargement.minuterie); S.chargementDemarrage = false; }
    if (S.base !== 'hud') majDirection({ visible: false });
    majInert();
    majAide();
    if (S.base === 'titre' || S.base === 'fin' || S.base === 'salle_fin') requestAnimationFrame(() => focusInitial(bases[S.base]));
    if (avant !== S.base && S.base === 'hud') { planifierCarte(); setTimeout(lancerAttentes, 700); }
  }

  function allerA(nom, donnees = {}) {
    switch (nom) {
      case 'titre':
      case 'chargement':
      case 'fin':
      case 'salle_fin':
        changerBase(nom, donnees);
        break;
      case 'salles':
        ouvrirCouche('salles', { silencieux: true });
        break;
      case 'hud':
      case 'jeu':
        if (S.base !== 'hud') changerBase('hud');
        else fermerTout({ silencieux: true });
        definirMode('jeu');
        break;
      case 'dialogue':
      case 'cinematique':
      case 'defi':
        if (S.base !== 'hud') changerBase('hud');
        else fermerTout({ silencieux: true });
        definirMode(nom);
        break;
      case 'pause': {
        const haut = S.pile[S.pile.length - 1];
        if (haut && haut !== 'pause' && performance.now() - S.pauseEmise < 900) break;
        ouvrirCouche('pause', { silencieux: true });
        break;
      }
      case 'journal':
      case 'carte':
      case 'options':
        if (nom === 'journal' && donnees.onglet) S.ongletJournal = donnees.onglet;
        if (nom === 'options' && donnees.onglet) S.ongletOptions = donnees.onglet;
        ouvrirCouche(nom, { silencieux: !(S.base === 'hud' && S.mode === 'jeu' && !S.pile.length) });
        break;
      case 'credits':
      case 'chapitres':
        ouvrirCouche(nom, { silencieux: true });
        break;
      case 'aucun':
        changerBase('aucun');
        break;
      default:
        break;
    }
  }

  /* ---------- Entrées clavier, souris, manette ---------- */

  ecouter(window, 'keydown', (e) => {
    if (S.detruit) return;
    definirEntree('clavier');
    const zone = zoneActive();
    if (zone) {
      if (gererToucheMenu(e, zone)) { e.preventDefault(); e.stopPropagation(); }
      return;
    }
    if (S.base !== 'hud') return;
    if (e.repeat || S.mode === 'defi') return;
    if (S.mode === 'dialogue' || S.mode === 'cinematique') {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter' || e.key === 'e' || e.key === 'E') { passer_(); e.preventDefault(); e.stopPropagation(); }
      return;
    }
    const k = (e.key || '').toLowerCase();
    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && S.st) { passer_(); e.preventDefault(); e.stopPropagation(); return; }
    if (e.code === 'Escape' || k === 'p') { ouvrirCouche('pause'); e.preventDefault(); e.stopPropagation(); }
    else if (k === 'j' || e.code === 'Tab') { ouvrirCouche('journal'); e.preventDefault(); e.stopPropagation(); }
    else if (k === 'm') { ouvrirCouche('carte'); e.preventDefault(); e.stopPropagation(); }
  }, true);

  function gererToucheMenu(e, zone) {
    const a = document.activeElement;
    const haut = S.pile[S.pile.length - 1];
    if (e.code === 'Escape' || e.code === 'Backspace') {
      if (!e.repeat) { if (!haut && S.base === 'hud' && S.mode === 'jeu' && e.code === 'Escape') ouvrirCouche('pause'); else retour(); }
      return true;
    }
    if (S.choix && !haut && /^(Digit|Numpad)[1-9]$/.test(e.code)) { repondre(Number(e.code.slice(-1)) - 1); return true; }
    if (haut && couches[haut].onglets && !e.repeat) {
      if (e.code === 'KeyQ' || e.code === 'PageUp') { changerOngletRelatif(-1); return true; }
      if (e.code === 'KeyE' || e.code === 'PageDown') { changerOngletRelatif(1); return true; }
    }
    if (haut === 'carte' && (e.key === 'm' || e.key === 'M') && !e.repeat) { retour(); return true; }
    if (haut === 'journal' && (e.key === 'j' || e.key === 'J') && !e.repeat) { retour(); return true; }
    if (haut === 'pause' && (e.key === 'p' || e.key === 'P') && !e.repeat) { retour(); return true; }
    const dir = DIRECTIONS_CLAVIER[e.code];
    if (dir) { naviguer(dir); return true; }
    if (e.code === 'Tab') {
      const liste = [...zone.querySelectorAll('button, [tabindex]')].filter(n => n.tabIndex >= 0 && visible(n));
      if (!liste.length) return true;
      const i = liste.indexOf(a);
      const j = i < 0 ? 0 : (i + (e.shiftKey ? -1 : 1) + liste.length) % liste.length;
      liste[j].focus();
      return true;
    }
    if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') {
      if (!a || !zone.contains(a) || a === document.body) { focusInitial(zone); return true; }
      if (a._activer) { if (!e.repeat) a._activer(); return true; }
      if (a.hasAttribute('data-defile')) return e.code === 'Space';
      if (a.tagName === 'BUTTON') return false;
      return true;
    }
    if (e.code === 'KeyE' && a && a.tagName === 'BUTTON' && zone.contains(a) && !e.repeat && !(haut && couches[haut].onglets)) { a.click(); return true; }
    return false;
  }

  ecouter(racine, 'pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target.closest('[data-nav]');
    const zone = zoneActive();
    if (t && zone && zone.contains(t) && t !== document.activeElement && visible(t) && !t.hasAttribute('data-defile')) focaliser(t);
  });
  let selection = null;
  ecouter(racine, 'focusin', (e) => {
    const t = e.target;
    if (t.matches && t.matches('[data-nav]')) son('ui_survol');
    marquerSel(t);
  });
  ecouter(window, 'pointerdown', (e) => { definirEntree(e.pointerType === 'touch' ? 'tactile' : 'clavier'); }, true);
  ecouter(window, 'mousemove', (e) => { if (S.entree === 'manette' && (Math.abs(e.movementX) + Math.abs(e.movementY) > 6)) definirEntree('clavier'); }, { passive: true });

  ecouter(document, 'pointerlockchange', () => {
    const verrou = !!document.pointerLockElement;
    if (!verrou && S.verrouActif && pauseSurPerteVerrou && !S.ignorerPerteVerrou && S.base === 'hud' && S.mode === 'jeu' && !S.pile.length && !S.choix) ouvrirCouche('pause');
    S.verrouActif = verrou;
    S.ignorerPerteVerrou = false;
  });
  ecouter(document, 'visibilitychange', () => {
    if (document.hidden && S.base === 'hud' && !S.pile.length && pauseSurPerteVerrou) ouvrirCouche('pause');
  });
  ecouter(window, 'resize', () => { planifierCarte(); });

  const manette = { raf: 0, prec: [], dir: null, prochain: 0, ax: [] };
  function boucleManette(t) {
    manette.raf = 0;
    if (S.detruit) return;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let pad = null;
    for (const p of pads) if (p && p.connected) { pad = p; break; }
    if (!pad) return;
    manette.raf = requestAnimationFrame(boucleManette);
    const presse = [];
    const bt = pad.buttons || [];
    for (let i = 0; i < bt.length; i++) {
      const v = !!(bt[i] && (bt[i].pressed || bt[i].value > 0.6));
      if (v && !manette.prec[i]) presse.push(i);
      manette.prec[i] = v;
    }
    const ax = pad.axes || [];
    const actif = presse.length || Math.abs(ax[0] || 0) > 0.5 || Math.abs(ax[1] || 0) > 0.5 || Math.abs(ax[2] || 0) > 0.5 || Math.abs(ax[3] || 0) > 0.5;
    if (actif) definirEntree('manette');
    const zone = zoneActive();
    const haut = S.pile[S.pile.length - 1];
    if (zone) {
      let dir = null;
      if (manette.prec[12] || (ax[1] || 0) < -0.55) dir = 'haut';
      else if (manette.prec[13] || (ax[1] || 0) > 0.55) dir = 'bas';
      else if (manette.prec[14] || (ax[0] || 0) < -0.55) dir = 'gauche';
      else if (manette.prec[15] || (ax[0] || 0) > 0.55) dir = 'droite';
      if (dir) {
        if (dir !== manette.dir) { naviguer(dir); manette.prochain = t + 380; }
        else if (t >= manette.prochain) { naviguer(dir); manette.prochain = t + 110; }
      }
      manette.dir = dir;
      const defile = Math.abs(ax[3] || 0) > 0.2 ? ax[3] : 0;
      if (defile) {
        const cible = (document.activeElement && document.activeElement.closest('.ui-defile')) || zone.querySelector('.ui-panneau-onglet.actif .ui-defile, .ui-credits-zone');
        if (cible) { cible.scrollTop += defile * 16; if (haut === 'credits') creditsVue.auto = false; }
      }
      for (const b of presse) {
        if (b === 0) activer(document.activeElement);
        else if (b === 1) retour();
        else if (b === 4) changerOngletRelatif(-1);
        else if (b === 5) changerOngletRelatif(1);
        else if (!autonome) continue;
        else if (b === 9 && haut === 'pause') reprendre();
        else if (b === 9 && !haut && S.base === 'hud') ouvrirCouche('pause');
        else if (b === 3 && haut === 'journal') retour();
        else if (b === 8 && haut === 'carte') retour();
      }
      return;
    }
    manette.dir = null;
    if (S.base !== 'hud' || !autonome) return;
    for (const b of presse) {
      if ((S.mode === 'dialogue' || S.mode === 'cinematique') && b === 0) passer_();
      else if (b === 9 && S.mode === 'jeu') ouvrirCouche('pause');
      else if (b === 3 && S.mode === 'jeu') ouvrirCouche('journal');
      else if (b === 8 && S.mode === 'jeu') ouvrirCouche('carte');
    }
  }
  function demarrerManette() { if (!manette.raf && !S.detruit) manette.raf = requestAnimationFrame(boucleManette); }
  ecouter(window, 'gamepadconnected', () => { demarrerManette(); });
  try { if (navigator.getGamepads && [...navigator.getGamepads()].some(Boolean)) demarrerManette(); } catch { }

  /* ---------- Bus ---------- */

  const abonnements = [];
  const sur = (nom, fn) => {
    const g = (d) => { if (!S.detruit) { try { fn(d); } catch (e) { console.error(e); } } };
    const res = bus.on(nom, g);
    abonnements.push({ nom, g, res });
  };
  sur('ecran', (d) => { const x = typeof d === 'string' ? { nom: d } : (d || {}); allerA(x.nom, x); });
  sur('chargement', (d) => {
    if (S.base === 'aucun' && !S.partieLancee) { S.chargementDemarrage = true; changerBase('chargement', { titre: 'Protocole', sousTitre: 'Doctorat en santé publique' }); chargement.surtitre.textContent = ''; }
    majChargement(d || {});
  });
  for (const n of ['partie:nouvelle', 'partie:continuer', 'partie:chapitre']) {
    sur(n, () => {
      S.partieLancee = true;
      definirModeJeu('histoire');
      if (n !== 'partie:continuer') { S.rencontres = []; ecrireStockage(CLE_RENCONTRES, '[]'); S.preuvesNouvelles.clear(); S.sectionsNouvelles.clear(); }
    });
  }
  sur('hud', (d) => majHUD(d || {}));
  sur('invite', (d) => majInvite(d));
  sur('sousTitre', (d) => afficherSousTitre(d));
  sur('dialogue:choix', (d) => afficherChoix(d || {}));
  sur('dialogue:debut', () => allerA('dialogue'));
  sur('dialogue:fin', () => { masquerChoix(); afficherSousTitre(null); if (S.base === 'hud') definirMode('jeu'); });
  sur('toast', (d) => toast(d));
  sur('direction', (d) => majDirection(d));
  sur('carte', (d) => majCarte(d || {}));
  sur('zone', (d) => majZone(d, true));
  sur('journal:maj', (d) => fusionnerJournal(d || {}));
  sur('fin', (d) => changerBase('fin', d || {}));
  sur('chapitres', (d) => { S.chapitres = Array.isArray(d) ? d : ((d && d.liste) || []); if (S.pile.includes('chapitres')) rendreChapitres(); });
  sur('sauvegarde', (d) => { S.sauvegarde = d; if (S.base === 'titre') majTitre(); });
  sur('credits', (d) => { S.credits = Array.isArray(d) ? d : ((d && d.sections) || []); if (S.pile.includes('credits')) rendreCredits(); });
  sur('salles', (d) => {
    const l = Array.isArray(d) ? d : (d && d.salles);
    if (!Array.isArray(l)) return;
    S.salles = l;
    if (S.pile.includes('salles')) rendreSalles();
  });
  sur('partie:salle', () => { S.partieLancee = true; definirModeJeu('salle'); });
  sur('personnages', (d) => { S.personnages = { ...S.personnages, ...(d || {}) }; });
  sur('chapitre', (d) => carteChapitre(d || {}));
  sur('objectif', (d) => { if (d && d.cible) S.cible = d.cible; definirObjectif(d && d.texte ? d.texte : null); S.hud.objectif = d; });
  sur('stat:changement', (d) => statChangement(d));
  sur('replique', (d) => afficherReplique(d));
  sur('echec', (d) => echec(d));
  sur('patin:etat', (d) => majPatin(d));
  sur('exercice', (d) => majExercice(d));
  sur('hockey:etat', (d) => majHockey(d));
  sur('hockey:but', (d) => butHockey(d || {}));

  /* ---------- Démarrage ---------- */

  racine.dataset.entree = S.entree;
  racine.dataset.mode = 'jeu';
  racine.dataset.ecran = 'aucun';
  appliquerOptions();
  majTitre();
  rafraichirGlyphes();
  if (S.zone) majZone(S.zone);
  if (S.hud && (S.hud.stats || S.hud.objectif)) majHUD({ ...S.hud });
  if (etat.journal) fusionnerJournal(etat.journal, true);
  majInert();

  if (navigator.keyboard && typeof navigator.keyboard.getLayoutMap === 'function') {
    navigator.keyboard.getLayoutMap().then((carte) => {
      const d = carte.get('KeyQ') === 'a' ? 'azerty' : 'qwerty';
      if (d !== S.dispositionDetectee) { S.dispositionDetectee = d; rafraichirGlyphes(); }
    }).catch(() => { });
  }
  if (!etat.options) queueMicrotask(() => emettre('options', { ...S.options }));

  return {
    get options() { return { ...S.options }; },
    ouvrir: (nom, d) => allerA(nom, d || {}),
    fermer: () => retour(),
    forcerEntree: (type) => definirEntree(type),
    confirmer,
    detruire() {
      S.detruit = true;
      cancelAnimationFrame(manette.raf);
      cancelAnimationFrame(S.rafCarte);
      clearInterval(chargement.minuterie);
      for (const f of nettoyages) f();
      for (const a of abonnements) {
        if (typeof a.res === 'function') a.res();
        else if (typeof bus.off === 'function') bus.off(a.nom, a.g);
      }
      racine.replaceChildren();
    }
  };
}
