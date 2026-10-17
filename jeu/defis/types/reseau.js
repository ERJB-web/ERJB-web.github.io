import { h, s, icone, vider, nombre, pct, styleSecteurs, cheminSymbole, pastilleSecteur, glisser, humaniser } from '../noyau.js?v=4c12ba9b3d';
import { mesuresReseau, scoreCodageReseau, clefLien, vrai, borner, melanger, jaccard, couvertureDomaines } from '../calculs.js?v=4c12ba9b3d';
import { panneauQuestions } from './questions.js?v=4c12ba9b3d';
import { ongletsPanneau } from './carte.js?v=4c12ba9b3d';

export const NIVEAUX = [
  { n: 1, nom: 'Information', def: 'Échange d’information, sans action commune.' },
  { n: 2, nom: 'Coopération', def: 'Entraide ponctuelle et références, chacun garde ses façons de faire.' },
  { n: 3, nom: 'Coordination', def: 'Mécanismes convenus : corridor, procédure, retour d’information.' },
  { n: 4, nom: 'Intégration', def: 'Ressources, entente et plan d’intervention communs.' },
];

const EXTRAITS = {
  1: ['On leur envoie de l’information de temps en temps ; leurs dépliants traînent dans la salle d’attente. Sans plus.',
    'On échange de l’information quand ça adonne. On ne fait rien ensemble, à vrai dire.'],
  2: ['On leur réfère du monde et eux aussi nous en envoient. On s’entraide, mais chacun garde ses façons de faire.',
    'Quand un usager en a besoin, on les appelle et ils nous rendent service. C’est du cas par cas.'],
  3: ['On s’est donné un corridor de référence : un formulaire commun, un délai convenu et un retour systématique.',
    'On planifie les suivis ensemble : une procédure écrite et une rencontre aux deux semaines pour les cas complexes.'],
  4: ['C’est presque une seule équipe : une entente formelle, une intervenante partagée et un plan d’intervention commun.',
    'On a un plan d’intervention commun et une entente signée ; on partage même une ressource à temps plein.'],
  alters: ['Ces deux-là se connaissent bien : ils se renvoient des gens régulièrement.',
    'Je sais qu’ils travaillent ensemble ; ils organisent des choses à deux.'],
  aucun: ['Honnêtement, on n’a jamais eu affaire à eux.',
    'Je connais le nom, mais on ne les a jamais sollicités.'],
};

const EGO = '__ego__';

export function preparerReseau(def) {
  const egoNom = typeof def.ego === 'string' ? def.ego : String(def.ego?.nom ?? def.ego?.id ?? 'Équipe SAD');
  const alters = (Array.isArray(def.alters) ? def.alters : []).map((a, i) => ({
    id: String(a.id ?? i), nom: String(a.nom ?? a.id ?? `Alter ${i + 1}`), secteur: String(a.secteur ?? ''),
    domaines: Array.isArray(a.domaines) ? a.domaines.map(String) : [],
    declare: a.declare == null ? null : vrai(a.declare),
    refere211: a.refere211 == null ? null : vrai(a.refere211),
    inventaire: a.inventaire == null ? null : vrai(a.inventaire),
  }));
  const ids = new Set(alters.map((a) => a.id));
  const fin = (v) => (ids.has(String(v)) ? String(v) : EGO);
  const vus = new Map();
  for (const l of Array.isArray(def.liens) ? def.liens : []) {
    let a = fin(l.a);
    let b = fin(l.b);
    if (a === b) continue;
    if (b === EGO) [a, b] = [b, a];
    const k = clefLien(a, b);
    const prec = vus.get(k);
    const niveau = Math.max(0, Math.min(4, Math.round(Number(l.niveau) || 0)));
    const observe = vrai(l.observe);
    if (prec) { prec.niveau = Math.max(prec.niveau, niveau); prec.observe = prec.observe || observe; }
    else vus.set(k, { a, b, niveau, observe });
  }
  const liens = [...vus.values()];
  const noms = [...new Set(alters.map((a) => a.secteur))];
  const secteurs = styleSecteurs(noms.map((n) => ({ id: n, nom: nomSecteur(n) })));
  const observes = liens.filter((l) => l.observe);
  for (const a of alters) {
    if (a.refere211 && !observes.some((l) => l.a === EGO && l.b === a.id)) observes.push({ a: EGO, b: a.id, niveau: 0, observe: true });
  }
  const legende = def.legende && typeof def.legende === 'object' ? def.legende : {};
  return { egoNom, alters, liens, secteurs, declares: liens.filter((l) => l.niveau >= 1), observes, legende, avec211: alters.some((a) => a.refere211 != null) || /211/.test(String(legende.observe || legende.refere211 || '')) };
}

function nomSecteur(id) {
  const m = /^s\s*([1-6])$/i.exec(String(id).trim());
  if (m) return ['Réseau public', 'Première ligne', 'Parapublic', 'Communauté', 'Ville et municipalité', 'Habitation'][+m[1] - 1];
  return id ? humaniser(id) : 'Autre';
}

export function niveauxDe(legende) {
  const brut = legende && typeof legende.niveau === 'string' ? legende.niveau : '';
  if (!brut) return { niveaux: NIVEAUX, echelle: false };
  const parties = {};
  for (const morceau of brut.split(/[;\n]/)) {
    const m = /^\s*([1-4])\s*[=:–-]\s*(.+?)\s*$/.exec(morceau);
    if (m) parties[+m[1]] = m[2];
  }
  const unite = /passes?/i.test(brut) ? 'passes' : '';
  for (const k of Object.keys(parties)) if (unite && !/passe/i.test(parties[k])) parties[k] = `${parties[k]} ${unite}`;
  return {
    echelle: true,
    niveaux: [1, 2, 3, 4].map((n) => ({ n, nom: parties[n] ? `Niveau ${n}` : NIVEAUX[n - 1].nom, def: parties[n] || NIVEAUX[n - 1].def, valeur: parties[n] || '' })),
  };
}

export function rendre(def, coque) {
  const R = preparerReseau(def);
  const { niveaux, echelle } = niveauxDe(R.legende);
  const libObs = R.avec211 ? 'Observé (211)' : 'Observé';
  const questions = Array.isArray(def.questions) ? def.questions : [];
  const joueur = new Map();
  let selection = null;
  let lienChoisi = null;
  let phase = 'codage';
  let vueAnalyse = 'corrige';
  let resultatCodage = null;

  // ---------------------------------------------------------------- disposition
  const ordreSect = R.secteurs.slice().sort((a, b) => a.k - b.k);
  const groupes = ordreSect.map((sec) => ({ sec, alters: R.alters.filter((a) => a.secteur === sec.id) })).filter((g) => g.alters.length);
  const ecart = groupes.length > 1 ? 0.9 : 0;
  const total = R.alters.length + ecart * groupes.length || 1;
  const pasA = (2 * Math.PI) / total;
  const RAYON = 310;
  const pos = new Map();
  const secteursArcs = [];
  let curseur = -Math.PI / 2 - (pasA * ecart) / 2;
  for (const g of groupes) {
    const debut = curseur;
    curseur += (pasA * ecart) / 2;
    for (const a of g.alters) {
      curseur += pasA / 2;
      pos.set(a.id, { x: RAYON * Math.cos(curseur), y: RAYON * Math.sin(curseur), ang: curseur });
      curseur += pasA / 2;
    }
    curseur += (pasA * ecart) / 2;
    secteursArcs.push({ sec: g.sec, a0: debut + pasA * ecart * 0.25, a1: curseur - pasA * ecart * 0.25 });
  }
  pos.set(EGO, { x: 0, y: 0, ang: 0 });

  // ---------------------------------------------------------------- SVG
  const svg = s('svg', { class: 'dfx-res-svg', viewBox: '-560 -430 1120 860', role: 'group', 'aria-label': 'Sociogramme égocentré' });
  const gSecteurs = s('g', { class: 'dfx-res-secteurs', 'aria-hidden': 'true' });
  const gLiens = s('g', { class: 'dfx-res-liens' });
  const gTemp = s('g');
  const gNoeuds = s('g', { class: 'dfx-res-noeuds' });
  svg.append(
    s('circle', { r: RAYON, class: 'dfx-res-orbite', 'aria-hidden': 'true' }),
    s('circle', { r: RAYON * 0.55, class: 'dfx-res-orbite dfx-res-orbite--interne', 'aria-hidden': 'true' }),
    gSecteurs, gLiens, gTemp, gNoeuds);

  for (const arc of secteursArcs) {
    const r0 = 120;
    const r1 = RAYON + 34;
    const d = `M${r0 * Math.cos(arc.a0)},${r0 * Math.sin(arc.a0)} L${r1 * Math.cos(arc.a0)},${r1 * Math.sin(arc.a0)} A${r1},${r1} 0 ${arc.a1 - arc.a0 > Math.PI ? 1 : 0} 1 ${r1 * Math.cos(arc.a1)},${r1 * Math.sin(arc.a1)} L${r0 * Math.cos(arc.a1)},${r0 * Math.sin(arc.a1)} A${r0},${r0} 0 ${arc.a1 - arc.a0 > Math.PI ? 1 : 0} 0 ${r0 * Math.cos(arc.a0)},${r0 * Math.sin(arc.a0)}Z`;
    gSecteurs.append(s('path', { d, fill: arc.sec.couleur, class: 'dfx-res-secteur' }));
    const r2 = RAYON + 30;
    gSecteurs.append(s('path', { d: `M${r2 * Math.cos(arc.a0)},${r2 * Math.sin(arc.a0)} A${r2},${r2} 0 ${arc.a1 - arc.a0 > Math.PI ? 1 : 0} 1 ${r2 * Math.cos(arc.a1)},${r2 * Math.sin(arc.a1)}`, stroke: arc.sec.couleur, class: 'dfx-res-secteur-arc' }));
  }

  const noeudsEl = new Map();
  function noeud(id) {
    const p = pos.get(id);
    const g = s('g', { class: `dfx-res-noeud${id === EGO ? ' dfx-res-noeud--ego' : ''}`, transform: `translate(${p.x} ${p.y})`, tabindex: '0', role: 'button', dataset: { id } });
    if (id === EGO) {
      g.append(s('circle', { r: 74, class: 'dfx-res-ego' }));
      lignes(R.egoNom.replace(/\s*\(.*\)\s*$/, ''), 14).forEach((l, k, t) => g.append(s('text', { y: (k - (t.length - 1) / 2) * 24, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'dfx-res-ego-txt' }, l)));
      g.setAttribute('aria-label', `${R.egoNom} (ego)`);
    } else {
      const a = R.alters.find((x) => x.id === id);
      const st = R.secteurs.find((x) => x.id === a.secteur);
      g.append(s('circle', { r: 30, class: 'dfx-res-halo' }));
      g.append(s('path', { d: cheminSymbole(st?.forme, 21), fill: st?.couleur || '#0755AD', class: 'dfx-res-symbole' }));
      const cos = Math.cos(p.ang);
      const sin = Math.sin(p.ang);
      const ancre = cos > 0.16 ? 'start' : cos < -0.16 ? 'end' : 'middle';
      const rang = [...pos.keys()].indexOf(id);
      const serre = R.alters.length > 9 && Math.abs(sin) > 0.7 && rang % 2 === 1;
      const ecart = serre ? 74 : 42;
      const lx = cos * ecart;
      const morceaux = lignes(a.nom, R.alters.length > 9 ? 17 : 20);
      const ly = sin * ecart + (Math.abs(cos) <= 0.16 ? (sin > 0 ? 10 : -10 - (morceaux.length - 1) * 22) : -((morceaux.length - 1) * 22) / 2);
      if (serre) g.append(s('line', { x1: cos * 26, y1: sin * 26, x2: cos * (ecart - 12), y2: sin * (ecart - 12), class: 'dfx-res-attache' }));
      morceaux.forEach((l, k) => g.append(s('text', { x: lx, y: ly + k * 22, 'text-anchor': ancre, 'dominant-baseline': 'middle', class: 'dfx-res-nom' }, l)));
      g.setAttribute('aria-label', `${a.nom}, ${st?.nom ?? ''}`);
    }
    g.addEventListener('click', () => cliquerNoeud(id));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cliquerNoeud(id); } });
    brancherTrait(g, id);
    gNoeuds.append(g);
    noeudsEl.set(id, g);
  }
  R.alters.forEach((a) => noeud(a.id));
  noeud(EGO);

  const popover = h('div', { class: 'dfx-res-pop', hidden: true, role: 'dialog', 'aria-label': 'Niveau de collaboration' });
  const scene = h('div', { class: 'dfx-res-scene' }, svg, popover,
    h('div', { class: 'dfx-res-legende' },
      h('div', { class: 'dfx-res-legende-ligne' }, ordreSect.filter((sec) => R.alters.some((a) => a.secteur === sec.id)).map((sec) => h('span', { class: 'dfx-res-leg' }, pastilleSecteur(sec, 14), h('span', { text: sec.nom })))),
      h('div', { class: 'dfx-res-legende-ligne dfx-res-legende-niveaux' }, niveaux.map((n) => h('span', { class: `dfx-res-leg dfx-res-leg--${n.n}` }, s('svg', { width: 34, height: 12, 'aria-hidden': 'true' }, s('line', { x1: 2, y1: 6, x2: 32, y2: 6, class: `dfx-res-lien dfx-res-lien--n${n.n}` })), h('span', { text: echelle ? `${n.n} · ${n.def}` : `${n.n} · ${n.nom}` }))))));

  // ---------------------------------------------------------------- entretien
  const libNiv = (n) => (echelle ? niveaux[n - 1]?.def : niveaux[n - 1]?.nom) || '';
  const extraits = construireExtraits(R, coque.alea, echelle ? niveaux : null);
  const listeExtraits = h('ol', { class: 'dfx-res-extraits' }, extraits.map((x) => {
    const coche = h('input', { type: 'checkbox', 'aria-label': 'Extrait codé' });
    coche.addEventListener('change', () => li.classList.toggle('dfx-res-extrait--fait', coche.checked));
    const li = h('li', { class: 'dfx-res-extrait' },
      h('p', { class: 'dfx-res-extrait-qui', text: x.titre }),
      h('blockquote', { text: `« ${x.texte} »` }),
      h('label', { class: 'dfx-res-extrait-coche' }, coche, h('span', { text: 'Codé' })));
    return li;
  }));
  const entretien = h('aside', { class: 'dfx-res-gauche' },
    h('p', { class: 'dfx-surtitre', text: echelle ? `Ce que déclare ${R.egoNom.replace(/\s*\(.*\)\s*$/, '')}` : 'Entretien avec l’équipe SAD' }),
    h('p', { class: 'dfx-aide', text: echelle ? `Trace chaque lien déclaré et cote-le avec l’échelle : ${R.legende.niveau}.` : '« Au cours des 12 derniers mois, avec quelles organisations avez-vous collaboré pour une personne aînée ? » Trace chaque lien déclaré et cote son niveau.' }),
    listeExtraits);

  const mesures = h('div', { class: 'dfx-res-mesures' });
  const vues = h('div', { class: 'dfx-segments dfx-res-vues', role: 'radiogroup', 'aria-label': 'Réseau affiché', hidden: true });
  let btn = null;
  const pq = panneauQuestions(questions, coque, { surComplet: (c) => { if (btn && phase === 'analyse') btn.disabled = !c; } });
  const onglets = ongletsPanneau(coque, [
    { id: 'mesures', titre: 'Mesures', contenu: h('div', {}, vues, mesures) },
    { id: 'questions', titre: `Questions${questions.length ? ` (${questions.length})` : ''}`, contenu: pq.el },
  ]);
  const droite = h('aside', { class: 'dfx-res-droite' }, onglets.el);
  const ongletQuestions = droite.querySelector('[role="tab"]:nth-child(2)');
  if (ongletQuestions) ongletQuestions.disabled = true;

  coque.corps.append(h('div', { class: 'dfx-reseau' }, entretien, scene, droite));
  btn = coque.bouton('Valider le codage', { primaire: true, ico: 'valider', desactive: true, surClic: validerCodage });
  dessiner();
  majMesures();

  coque.surEchap(() => {
    if (!popover.hidden) { fermerPop(); return true; }
    if (selection) { choisirNoeud(null); return true; }
    return false;
  });
  coque.surTouche((e) => {
    if (popover.hidden || !lienChoisi) return false;
    if (/^[1-4]$/.test(e.key) && (lienChoisi.a === EGO)) { coter(lienChoisi, +e.key); return true; }
    if (e.key === 'Delete' || e.key === 'Backspace') { supprimer(lienChoisi); return true; }
    return false;
  });

  // ---------------------------------------------------------------- interactions
  function cliquerNoeud(id) {
    if (phase !== 'codage') return;
    fermerPop();
    if (!selection) { choisirNoeud(id); return; }
    if (selection === id) { choisirNoeud(null); return; }
    relier(selection, id);
    choisirNoeud(null);
  }

  function choisirNoeud(id) {
    selection = id;
    noeudsEl.forEach((g, k) => g.classList.toggle('dfx-res-noeud--choisi', k === id));
    scene.classList.toggle('dfx-res-scene--choix', !!id);
    if (id) {
      coque.jouer('clic');
      coque.setStatut('Choisis maintenant l’autre extrémité du lien.');
    } else majStatut();
  }

  function relier(a, b) {
    let x = a;
    let y = b;
    if (y === EGO) [x, y] = [y, x];
    const k = clefLien(x, y);
    let l = joueur.get(k);
    if (!l) {
      l = { a: x, b: y, niveau: 0 };
      joueur.set(k, l);
      coque.jouer('clic');
      coque.annoncer('Lien tracé.');
    }
    dessiner();
    majMesures();
    ouvrirPop(l);
  }

  function coter(l, n) {
    l.niveau = n;
    coque.jouer('clic');
    coque.annoncer(`Niveau ${n} : ${niveaux[n - 1].nom}.`);
    fermerPop();
    dessiner();
    majMesures();
  }

  function supprimer(l) {
    joueur.delete(clefLien(l.a, l.b));
    coque.jouer('clic');
    coque.annoncer('Lien supprimé.');
    fermerPop();
    dessiner();
    majMesures();
  }

  function ouvrirPop(l) {
    lienChoisi = l;
    vider(popover);
    const ego = l.a === EGO;
    const nomA = ego ? R.egoNom : R.alters.find((x) => x.id === l.a)?.nom;
    const nomB = R.alters.find((x) => x.id === l.b)?.nom;
    popover.append(h('p', { class: 'dfx-res-pop-titre', text: `${nomA} — ${nomB}` }));
    if (ego) {
      popover.append(h('p', { class: 'dfx-res-pop-q', text: 'Niveau de collaboration le plus élevé :' }));
      const grille = h('div', { class: 'dfx-res-pop-niveaux' }, niveaux.map((n) => {
        const b = h('button', { class: `dfx-res-niv${l.niveau === n.n ? ' dfx-res-niv--actif' : ''}`, type: 'button', 'aria-pressed': String(l.niveau === n.n) },
          h('span', { class: 'dfx-res-niv-n', brut: String(n.n) }),
          h('span', { class: 'dfx-res-niv-nom', text: n.nom }),
          h('span', { class: 'dfx-res-niv-def', text: n.def }));
        b.addEventListener('click', () => coter(l, n.n));
        return b;
      }));
      popover.append(grille);
    } else popover.append(h('p', { class: 'dfx-res-pop-q', text: 'Lien entre deux alters (déclaré par l’équipe).' }));
    const suppr = h('button', { class: 'dfx-btn dfx-btn--discret dfx-btn--petit', type: 'button' }, icone('supprimer'), h('span', { text: 'Supprimer le lien' }));
    suppr.addEventListener('click', () => supprimer(l));
    const fermer = h('button', { class: 'dfx-btn dfx-btn--discret dfx-btn--petit', type: 'button' }, icone('fermer'), h('span', { text: 'Fermer' }));
    fermer.addEventListener('click', fermerPop);
    popover.append(h('div', { class: 'dfx-res-pop-actions' }, suppr, fermer));
    popover.hidden = false;
    placerPop(l);
    (popover.querySelector('.dfx-res-niv--actif') || popover.querySelector('button'))?.focus({ preventScroll: true });
  }

  function placerPop(l) {
    const a = pos.get(l.a);
    const b = pos.get(l.b);
    const m = svg.createSVGPoint ? svg.createSVGPoint() : null;
    const r = scene.getBoundingClientRect();
    let x = r.width / 2;
    let y = r.height / 2;
    if (m && svg.getScreenCTM()) {
      m.x = (a.x + b.x) / 2;
      m.y = (a.y + b.y) / 2;
      const p = m.matrixTransform(svg.getScreenCTM());
      x = p.x - r.left;
      y = p.y - r.top;
    }
    const pw = Math.min(300, r.width - 16);
    popover.style.width = `${pw}px`;
    const etroit = r.width < 2.4 * pw;
    const gauche = etroit ? (r.width - pw) / 2 : x > r.width / 2 ? 12 : r.width - pw - 12;
    popover.style.left = `${Math.max(8, gauche)}px`;
    const ph = popover.offsetHeight || 260;
    popover.style.top = `${Math.max(8, Math.min(r.height - ph - 8, etroit ? r.height - ph - 8 : y - ph / 2))}px`;
  }

  function fermerPop() {
    popover.hidden = true;
    lienChoisi = null;
    dessiner();
  }

  function brancherTrait(g, id) {
    let survol = null;
    const detacher = glisser(g, {
      seuil: 8,
      surDebut() {
        if (phase !== 'codage') return;
        fermerPop();
        choisirNoeud(id);
      },
      surDeplacement(ev) {
        if (phase !== 'codage') return;
        const p = versSvg(ev.clientX, ev.clientY);
        const a = pos.get(id);
        vider(gTemp);
        gTemp.append(s('line', { x1: a.x, y1: a.y, x2: p.x, y2: p.y, class: 'dfx-res-lien dfx-res-lien--temp' }));
        const cible = [...document.elementsFromPoint(ev.clientX, ev.clientY)].map((e) => e.closest?.('.dfx-res-noeud')).find(Boolean);
        if (cible !== survol) {
          survol?.classList.remove('dfx-res-noeud--survol');
          survol = cible && cible.dataset.id !== id ? cible : null;
          survol?.classList.add('dfx-res-noeud--survol');
        }
      },
      surFin(ev, etat, annule) {
        vider(gTemp);
        const cible = survol;
        survol?.classList.remove('dfx-res-noeud--survol');
        survol = null;
        if (!annule && cible && phase === 'codage') {
          relier(id, cible.dataset.id);
          choisirNoeud(null);
        }
      },
    });
    coque.surNettoyage(detacher);
  }

  function versSvg(cx, cy) {
    const m = svg.createSVGPoint();
    m.x = cx;
    m.y = cy;
    const ctm = svg.getScreenCTM();
    return ctm ? m.matrixTransform(ctm.inverse()) : { x: 0, y: 0 };
  }

  // ---------------------------------------------------------------- dessin
  function geometrie(l) {
    const a = pos.get(l.a);
    const b = pos.get(l.b);
    if (l.a === EGO) {
      const ang = Math.atan2(b.y, b.x);
      const x0 = 76 * Math.cos(ang);
      const y0 = 76 * Math.sin(ang);
      const x1 = b.x - 30 * Math.cos(ang);
      const y1 = b.y - 30 * Math.sin(ang);
      return { d: `M${x0},${y0}L${x1},${y1}`, mx: x0 + (x1 - x0) * 0.58, my: y0 + (y1 - y0) * 0.58 };
    }
    const cx = (a.x + b.x) / 2 * 0.45;
    const cy = (a.y + b.y) / 2 * 0.45;
    return { d: `M${a.x},${a.y}Q${cx},${cy} ${b.x},${b.y}`, mx: 0.25 * a.x + 0.5 * cx + 0.25 * b.x, my: 0.25 * a.y + 0.5 * cy + 0.25 * b.y };
  }

  function dessiner() {
    vider(gLiens);
    let traits = [];
    if (phase === 'codage') traits = [...joueur.values()].map((l) => ({ ...l, etat: 'joueur' }));
    else if (vueAnalyse === 'corrige') traits = resultatCodage.traits;
    else if (vueAnalyse === 'declare') traits = R.declares.map((l) => ({ ...l, etat: 'vrai' }));
    else if (vueAnalyse === 'observe') traits = R.observes.map((l) => ({ ...l, etat: 'observe' }));
    else traits = [...R.declares.map((l) => ({ ...l, etat: 'vrai' })), ...R.observes.map((l) => ({ ...l, etat: 'observe', superpose: true }))];
    for (const t of traits) {
      const g = geometrie(t);
      const niv = t.etat === 'observe' ? 'obs' : t.niveau >= 1 ? `n${t.niveau}` : 'n0';
      const cls = `dfx-res-lien dfx-res-lien--${niv} dfx-res-lien--${t.etat}${t.superpose ? ' dfx-res-lien--superpose' : ''}${lienChoisi && clefLien(lienChoisi.a, lienChoisi.b) === clefLien(t.a, t.b) ? ' dfx-res-lien--choisi' : ''}`;
      const groupe = s('g', { class: 'dfx-res-lien-g' });
      if (t.niveau === 4 && t.etat !== 'observe' && !['faux', 'manquant'].includes(t.etat)) groupe.append(s('path', { d: g.d, class: 'dfx-res-lien dfx-res-lien--double' }));
      groupe.append(s('path', { d: g.d, class: cls }));
      if (phase === 'codage') {
        const zone = s('path', { d: g.d, class: 'dfx-res-lien-zone' });
        zone.addEventListener('click', () => { ouvrirPop(joueur.get(clefLien(t.a, t.b))); dessiner(); });
        groupe.append(zone);
      }
      if (t.a === EGO && t.etat !== 'observe') {
        const txt = t.etat === 'niveau' ? `${t.donne}→${t.niveau}` : t.niveau >= 1 ? String(t.niveau) : '?';
        groupe.append(s('g', { class: `dfx-res-badge dfx-res-badge--${t.etat}${t.niveau ? '' : ' dfx-res-badge--vide'}`, transform: `translate(${g.mx} ${g.my})` },
          s('rect', { x: txt.length > 1 ? -24 : -14, y: -14, width: txt.length > 1 ? 48 : 28, height: 28, rx: 14 }),
          s('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central' }, txt)));
      }
      gLiens.append(groupe);
    }
    const relies = new Set();
    const declares = new Set(R.declares.filter((l) => l.a === EGO).map((l) => l.b));
    const observes = new Set(R.observes.filter((l) => l.a === EGO).map((l) => l.b));
    traits.forEach((t) => { relies.add(t.a); relies.add(t.b); });
    noeudsEl.forEach((g, id) => {
      if (id === EGO) return;
      g.classList.toggle('dfx-res-noeud--isole', phase === 'analyse' && !relies.has(id));
      g.classList.toggle('dfx-res-noeud--non-mobilise', phase === 'analyse' && (vueAnalyse === 'superpose' || vueAnalyse === 'observe') && observes.has(id) && !declares.has(id));
    });
  }

  function majStatut() {
    if (phase !== 'codage') return;
    const n = joueur.size;
    const aCoter = [...joueur.values()].filter((l) => l.a === EGO && !l.niveau).length;
    btn.disabled = n === 0;
    coque.setStatut(n ? `${n} lien${n > 1 ? 's' : ''} tracé${n > 1 ? 's' : ''}${aCoter ? ` · ${aCoter} à coter` : ''}` : 'Touche l’ego puis une organisation (ou glisse de l’un à l’autre) pour tracer un lien.');
  }

  function blocMesures(m, titre) {
    return h('div', { class: 'dfx-res-mesure-col' },
      titre ? h('p', { class: 'dfx-res-mesure-titre', text: titre }) : null,
      h('dl', { class: 'dfx-res-dl' },
        ligne('Taille', String(m.taille), 'alters reliés à l’ego'),
        ligne('Liens entre alters', String(m.liensAlters), ''),
        ligne('Densité', nombre(m.densite, 2), 'liens entre alters ÷ liens possibles'),
        ligne('Diversité sectorielle', nombre(m.blau, 2), 'indice de Blau : 1 − Σ p²'),
        ligne('Taille effective', nombre(m.tailleEffective, 1), 'Burt : n − 2t ÷ n'),
        ligne('Liens de niveau 3 ou 4', pct(m.partForts), 'coordination ou intégration'),
        ligne('Groupes d’alters', String(m.composantes), 'non reliés entre eux sans l’ego')));
  }

  function ligne(dt, dd, aide) {
    return h('div', { class: 'dfx-res-dl-ligne' }, h('dt', {}, h('span', { text: dt }), aide ? h('small', { text: aide }) : null), h('dd', { brut: dd }));
  }

  function majMesures() {
    majStatut();
    vider(mesures);
    if (phase === 'codage') {
      const liensM = [...joueur.values()].map((l) => ({ a: l.a === EGO ? 'ego' : l.a, b: l.b, niveau: l.a === EGO ? Math.max(1, l.niveau) : 1 }));
      const m = mesuresReseau(R.alters, liensM, 'ego');
      mesures.append(h('p', { class: 'dfx-aide', text: 'Mesures de ton codage, mises à jour à chaque lien.' }), blocMesures(m));
    } else {
      const dec = mesuresReseau(R.alters, R.declares.map((l) => ({ a: l.a === EGO ? 'ego' : l.a, b: l.b, niveau: l.niveau })), 'ego');
      const obs = mesuresReseau(R.alters, R.observes.map((l) => ({ a: l.a === EGO ? 'ego' : l.a, b: l.b, niveau: Math.max(1, l.niveau) })), 'ego');
      const egoDec = R.declares.filter((l) => l.a === EGO).map((l) => l.b);
      const egoObs = R.observes.filter((l) => l.a === EGO).map((l) => l.b);
      const nonMob = R.alters.filter((a) => egoObs.includes(a.id) && !egoDec.includes(a.id));
      const avecInventaire = R.alters.some((a) => a.inventaire != null);
      const jamais = R.alters.filter((a) => (avecInventaire ? a.inventaire : true) && !egoDec.includes(a.id) && !egoObs.includes(a.id));
      mesures.append(h('div', { class: 'dfx-res-mesure-duo' }, blocMesures(dec, 'Déclaré'), blocMesures(obs, libObs)));
      const extra = [];
      if (egoObs.length) extra.push(ligne('Concordance déclaré et observé', nombre(jaccard(egoDec, egoObs), 2), 'indice de Jaccard sur les alters'));
      if (R.alters.some((a) => a.domaines.length)) {
        const cv = couvertureDomaines(R.alters, R.declares.map((l) => ({ a: l.a === EGO ? 'ego' : l.a, b: l.b, niveau: l.niveau })), 'ego', 2);
        extra.push(ligne('Couverture des domaines', `${cv.couverts} sur ${cv.total}`, 'domaines avec un alter de niveau 2 ou plus'));
      }
      if (extra.length) mesures.append(h('dl', { class: 'dfx-res-dl' }, extra));
      if (nonMob.length) mesures.append(h('div', { class: 'dfx-res-note' }, h('p', { class: 'dfx-res-note-titre', text: R.avec211 ? 'Référés par le 211, non mobilisés par l’équipe' : 'Observés, mais non déclarés' }), h('ul', {}, nonMob.map((a) => h('li', { text: a.nom })))));
      if (jamais.length && avecInventaire) mesures.append(h('div', { class: 'dfx-res-note dfx-res-note--neutre' }, h('p', { class: 'dfx-res-note-titre', text: 'Dans l’inventaire, absents des deux réseaux' }), h('ul', {}, jamais.map((a) => h('li', { text: a.nom })))));
      const cles = Object.entries(R.legende).filter(([k, v]) => k !== 'niveau' && typeof v === 'string' && v);
      if (cles.length) {
        const libelles = { declare: 'Déclaré', refere211: 'Référé par le 211', inventaire: 'Inventaire', observe: 'Observé' };
        mesures.append(h('div', { class: 'dfx-res-note dfx-res-note--neutre' }, h('p', { class: 'dfx-res-note-titre', text: 'Sources' }), h('ul', {}, cles.map(([k, v]) => h('li', { text: `${libelles[k] || humaniser(k)} : ${v}` })))));
      }
    }
  }

  // ---------------------------------------------------------------- validation et analyse
  function validerCodage() {
    if (phase !== 'codage') return;
    fermerPop();
    choisirNoeud(null);
    const liensJoueur = [...joueur.values()];
    const sc = scoreCodageReseau(liensJoueur, R.declares, EGO);
    const parCle = new Map(sc.detail.map((d) => [d.cle, d]));
    const traits = [];
    for (const l of R.declares) {
      const d = parCle.get(clefLien(l.a, l.b));
      traits.push({ ...l, etat: d?.etat === 'manquant' ? 'manquant' : d?.etat === 'niveau' ? 'niveau' : 'juste', donne: d?.donne });
    }
    for (const l of liensJoueur) if (parCle.get(clefLien(l.a, l.b))?.etat === 'faux') traits.push({ ...l, etat: 'faux' });
    resultatCodage = { sc, traits };
    phase = 'analyse';
    scene.classList.add('dfx-res-scene--analyse');
    coque.jouer(sc.score >= 0.6 ? 'succes' : 'echec');
    const nivJustes = sc.detail.filter((d) => d.etat === 'juste' && d.attendu != null).length;
    const egoVrais = R.declares.filter((l) => l.a === EGO).length;
    coque.reagir(sc.score >= 0.85 ? 'Codage solide. Ton accord interjuges va faire des jaloux.' : sc.score >= 0.55 ? 'Pas mal. Regarde les badges en rouge : coopération ou coordination, c’est là que ça se joue.' : 'Coder des niveaux de collaboration, c’est plus subtil qu’il n’y paraît. Relis les définitions.',
      { humeur: sc.score >= 0.85 ? 'ravi' : sc.score >= 0.55 ? 'content' : 'surpris', force: true });
    coque.setStatut(`Liens trouvés : ${sc.vp} sur ${R.declares.length} · niveaux exacts : ${nivJustes} sur ${egoVrais} · liens en trop : ${sc.fp}`);
    vider(vues);
    vues.hidden = false;
    [['corrige', 'Ton codage corrigé'], ['declare', 'Déclaré'], ['observe', libObs], ['superpose', 'Superposé']].forEach(([v, t]) => {
      const b = h('button', { class: 'dfx-segment', type: 'button', role: 'radio', 'aria-checked': String(v === vueAnalyse), text: t });
      b.addEventListener('click', () => {
        vueAnalyse = v;
        vues.querySelectorAll('.dfx-segment').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
        coque.jouer('clic');
        dessiner();
      });
      vues.append(b);
    });
    scene.querySelector('.dfx-res-legende-niveaux').append(
      h('span', { class: 'dfx-res-leg dfx-res-leg--obs' }, s('svg', { width: 34, height: 12, 'aria-hidden': 'true' }, s('line', { x1: 2, y1: 6, x2: 32, y2: 6, class: 'dfx-res-lien dfx-res-lien--obs' })), h('span', { text: R.avec211 ? 'Référence du 211' : 'Lien observé' })),
      h('span', { class: 'dfx-res-leg' }, s('svg', { width: 34, height: 12, 'aria-hidden': 'true' }, s('line', { x1: 2, y1: 6, x2: 32, y2: 6, class: 'dfx-res-lien dfx-res-lien--manquant' })), h('span', { text: 'Lien manqué' })),
      h('span', { class: 'dfx-res-leg' }, s('svg', { width: 34, height: 12, 'aria-hidden': 'true' }, s('line', { x1: 2, y1: 6, x2: 32, y2: 6, class: 'dfx-res-lien dfx-res-lien--faux' })), h('span', { text: 'Lien en trop' })));
    if (ongletQuestions) ongletQuestions.disabled = false;
    dessiner();
    majMesures();
    coque.viderActions();
    if (questions.length) {
      btn = coque.bouton('Remettre l’analyse', { primaire: true, ico: 'valider', desactive: true, surClic: () => finir(false) });
      coque.bouton('Aux questions', { ico: 'droite', surClic: () => { onglets.activer(1); droite.querySelector('.dfx-question input')?.focus(); } });
    } else btn = coque.bouton('Voir le bilan', { primaire: true, ico: 'droite', surClic: () => finir(false) });
  }

  function finir(tempsEcoule) {
    if (coque.estTermine()) return;
    if (phase === 'codage') {
      const sc = scoreCodageReseau([...joueur.values()], R.declares, EGO);
      resultatCodage = { sc, traits: [] };
    }
    const sc = resultatCodage.sc;
    const q = questions.length ? pq.corriger() : { score: 1, justes: 0, total: 0, choix: [] };
    const score = questions.length ? 0.6 * sc.score + 0.4 * q.score : sc.score;
    coque.terminer({
      score: borner(score),
      details: {
        codage: Math.round(sc.score * 1000) / 1000,
        liensJustes: sc.vp, liensEnTrop: sc.fp, liensManques: sc.fn,
        niveauxExacts: Math.round(sc.niveaux * 1000) / 1000,
        questions: q.total ? Math.round(q.score * 1000) / 1000 : null,
        tempsEcoule,
      },
    }, (zone) => {
      zone.append(h('div', { class: 'dfx-stats' },
        statCase('Liens trouvés', `${sc.vp} / ${R.declares.length}`, 'liens déclarés retrouvés'),
        statCase('Niveaux', pct(sc.niveaux), 'justesse des cotes (±1 = moitié)'),
        statCase('En trop', String(sc.fp), 'liens non déclarés', sc.fp > 0),
        statCase('Questions', q.total ? `${q.justes} / ${q.total}` : '—', 'analyse du réseau')));
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Les liens déclarés' }));
      const ul = h('ul', { class: 'dfx-liste-correction' });
      for (const l of R.declares) {
        const d = sc.detail.find((x) => x.cle === clefLien(l.a, l.b));
        const ok = d?.etat === 'juste';
        const nomA = l.a === EGO ? R.egoNom : R.alters.find((x) => x.id === l.a)?.nom;
        const nomB = R.alters.find((x) => x.id === l.b)?.nom;
        const meta = l.a === EGO
          ? (d?.etat === 'manquant' ? `Non tracé · niveau attendu : ${l.niveau} (${libNiv(l.niveau)})` : d?.etat === 'niveau' ? `Coté ${d.donne || '?'} · attendu ${l.niveau} (${libNiv(l.niveau)})` : `Niveau ${l.niveau} (${libNiv(l.niveau)})`)
          : (d?.etat === 'manquant' ? 'Lien entre alters non tracé' : 'Lien entre alters');
        ul.append(h('li', { class: `dfx-ligne-correction ${ok ? 'dfx-ok' : d?.etat === 'niveau' ? 'dfx-moyen' : 'dfx-ko'}` },
          h('span', { class: 'dfx-ligne-ico' }, icone(ok ? 'valider' : d?.etat === 'niveau' ? 'info' : 'fermer')),
          h('div', {}, h('p', { class: 'dfx-ligne-titre', text: `${nomA} — ${nomB}` }), h('p', { class: 'dfx-ligne-meta', text: meta }))));
      }
      zone.append(ul);
      pq.rendreCorrection(zone);
    });
  }

  return {
    surTempsEcoule() {
      if (phase === 'codage') validerCodage();
      finir(true);
    },
  };
}

function construireExtraits(R, alea, echelle) {
  const choisir = (t) => t[Math.floor(alea() * t.length)];
  const nom = (id) => R.alters.find((a) => a.id === id)?.nom ?? id;
  const out = [];
  for (const l of R.declares) {
    if (echelle) {
      const v = echelle[l.niveau - 1]?.valeur || '';
      if (l.a === EGO) out.push({ titre: nom(l.b), texte: `Avec ${nom(l.b).replace(/\s*\(.*\)\s*$/, '')} : ${v}${/passe/i.test(v) || !v ? '' : ' passes'}.` });
      else out.push({ titre: `${nom(l.a)} et ${nom(l.b)}`, texte: 'Entre eux aussi, ça circule.' });
    } else if (l.a === EGO) out.push({ titre: nom(l.b), texte: choisir(EXTRAITS[l.niveau]) });
    else out.push({ titre: `${nom(l.a)} et ${nom(l.b)}`, texte: choisir(EXTRAITS.alters) });
  }
  const declares = new Set(R.declares.filter((l) => l.a === EGO).map((l) => l.b));
  for (const a of R.alters) if (!declares.has(a.id)) out.push({ titre: a.nom, texte: echelle ? 'Aucun échange déclaré.' : choisir(EXTRAITS.aucun) });
  return melanger(out, alea);
}

function lignes(texte, max) {
  const mots = String(texte).split(/\s+/);
  const out = [];
  let cur = '';
  for (const m of mots) {
    if ((cur + ' ' + m).trim().length > max && cur) { out.push(cur); cur = m; }
    else cur = (cur + ' ' + m).trim();
  }
  if (cur) out.push(cur);
  if (out.length > 3) return [...out.slice(0, 2), `${out.slice(2).join(' ').slice(0, max - 1)}…`];
  return out;
}

function statCase(titre, valeur, legende, alerte) {
  return h('div', { class: `dfx-stat${alerte ? ' dfx-stat--alerte' : ''}` }, h('strong', { brut: valeur }), h('p', { class: 'dfx-stat-titre', text: titre }), h('p', { class: 'dfx-stat-legende', text: legende }));
}

