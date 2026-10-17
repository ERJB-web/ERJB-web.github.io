import { h, s, icone, typo, vider, pct, duree, focusables, portrait, roleCanonique, NOMS_PERSONNAGES, humaniser, NB } from './noyau.js?v=71e1708f0f';
import { borner, hacher, generateur } from './calculs.js?v=71e1708f0f';
import * as choix from './types/choix.js?v=71e1708f0f';
import * as tri from './types/tri.js?v=71e1708f0f';
import * as ordre from './types/ordre.js?v=71e1708f0f';
import * as requete from './types/requete.js?v=71e1708f0f';
import * as criblage from './types/criblage.js?v=71e1708f0f';
import * as correspondance from './types/correspondance.js?v=71e1708f0f';
import * as carte from './types/carte.js?v=71e1708f0f';
import * as reseau from './types/reseau.js?v=71e1708f0f';
import * as jury from './types/jury.js?v=71e1708f0f';
import * as pitch from './types/pitch.js?v=71e1708f0f';

const TYPES = {
  choix: { module: choix, libelle: 'Dilemme méthodologique', icone: 'balance' },
  tri: { module: tri, libelle: 'Classement', icone: 'bacs' },
  ordre: { module: ordre, libelle: 'Mise en ordre', icone: 'ordre' },
  requete: { module: requete, libelle: 'Équation de recherche', icone: 'recherche' },
  criblage: { module: criblage, libelle: 'Criblage des résumés', icone: 'filtre' },
  correspondance: { module: correspondance, libelle: 'Correspondance', icone: 'lien' },
  carte: { module: carte, libelle: 'Cartographie SIG', icone: 'carte' },
  reseau: { module: reseau, libelle: 'Réseau égocentré', icone: 'reseau' },
  jury: { module: jury, libelle: 'Soutenance', icone: 'jury' },
  pitch: { module: pitch, libelle: 'Pitch d’ascenseur', icone: 'ascenseur' },
};

export const TYPES_DEFIS = Object.keys(TYPES);

const STATS = { rigueur: 'Rigueur', energie: 'Énergie', stress: 'Stress', confiance: 'Confiance' };

const QUIPS_REUSSITE = [
  'Bravo ! Je t’offre un café. De la machine du 4e, quand même.',
  'Ça, c’est du travail de doctorant qui dort la nuit.',
  'Note-le dans ton journal de bord avant d’oublier comment tu as fait.',
  'Ta direction va devoir se trouver une autre raison de t’écrire.',
  'Propre. Je vais copier ta méthode, si ça ne te dérange pas.',
];
const QUIPS_ECHEC = [
  { qui: 'direction_a', texte: 'On avait dit vendredi.' },
  { qui: 'direction_a', texte: 'Nous en reparlerons à notre prochaine rencontre de suivi.' },
  { qui: 'direction_a', texte: 'Relisez la section méthode avant notre rencontre, s’il vous plaît.' },
  { qui: 'direction_b', texte: 'Petite idée : on se voit jeudi ? Apporte ton protocole.' },
  { qui: 'direction_b', texte: 'Intéressant… Ce n’est pas un compliment.' },
];

function normaliserCtx(ctx) {
  const c = ctx || {};
  const son = c.son || {};
  const jouer = (nom) => {
    try { if (typeof son[nom] === 'function') son[nom](); } catch { /* son facultatif */ }
  };
  let calme = !!c.reduireMouvement;
  try { calme = calme || window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* sans matchMedia */ }
  return {
    racine: c.racine || document.body,
    jouer,
    preuves: Array.isArray(c.preuves) ? c.preuves.map(String) : [],
    stats: c.stats || {},
    calme,
    graine: Number.isFinite(c.graine) ? c.graine : null,
    personnages: c.personnages && typeof c.personnages === 'object' ? c.personnages : {},
    titresPreuves: c.titresPreuves && typeof c.titresPreuves === 'object' ? c.titresPreuves : {},
  };
}

let compteurIds = 0;

function creerCoque(def, ctx, type, resolve) {
  const precedent = document.activeElement;
  const id = `dfx-${++compteurIds}`;
  const graine = ctx.graine != null ? (ctx.graine ^ hacher(def.id)) : (hacher(def.id) ^ ((Math.random() * 2 ** 31) | 0));
  const alea = generateur(graine);
  const t0 = performance.now();
  const nettoyages = [];
  const piles = { echap: [], touches: [] };
  let termine = false;
  let derniereReaction = 0;

  const racine = h('div', {
    class: `dfx${ctx.calme ? ' dfx--calme' : ''}`,
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': `${id}-titre`,
    'data-type': def.type || 'inconnu',
  });
  const voile = h('div', { class: 'dfx-voile', 'aria-hidden': 'true' });
  const panneau = h('section', { class: 'dfx-panneau' });

  const compteur = h('span', { class: 'dfx-pastille dfx-pastille--compteur', hidden: true });
  const chronoTexte = h('span', { class: 'dfx-chrono-texte', brut: '0:00' });
  const chronoEl = h('span', { class: 'dfx-pastille dfx-chrono', hidden: true, role: 'timer', 'aria-live': 'off' }, icone('horloge'), chronoTexte);
  const barreTemps = h('div', { class: 'dfx-barre-temps', hidden: true }, h('span'));
  const btnConsigne = h('button', { class: 'dfx-btn-ico', type: 'button', 'aria-expanded': 'true', 'aria-controls': `${id}-consigne`, title: 'Afficher ou masquer la consigne' }, icone('aide'), h('span', { class: 'dfx-sr', text: 'Consigne' }));
  const btnQuitter = h('button', { class: 'dfx-btn-ico', type: 'button', title: 'Abandonner le défi' }, icone('fermer'), h('span', { class: 'dfx-sr', text: 'Abandonner le défi' }));
  const consigne = h('p', { class: 'dfx-consigne', id: `${id}-consigne`, text: def.consigne || '' });
  if (!def.consigne) { consigne.hidden = true; btnConsigne.hidden = true; }

  const entete = h('header', { class: 'dfx-entete' },
    h('div', { class: 'dfx-badge' }, icone(type?.icone || 'info')),
    h('div', { class: 'dfx-titres' },
      h('p', { class: 'dfx-surtitre', text: type?.libelle || 'Défi' }),
      h('h2', { class: 'dfx-titre', id: `${id}-titre`, text: def.titre || type?.libelle || 'Défi' })),
    h('div', { class: 'dfx-outils' }, compteur, chronoEl, btnConsigne, btnQuitter));

  const corps = h('div', { class: 'dfx-corps' });
  const statut = h('p', { class: 'dfx-statut', 'aria-live': 'polite' });
  const actions = h('div', { class: 'dfx-actions' });
  const pied = h('footer', { class: 'dfx-pied' }, statut, actions);
  const annonceur = h('div', { class: 'dfx-sr', 'aria-live': 'assertive' });
  const reactions = h('div', { class: 'dfx-reactions', 'aria-live': 'polite' });

  panneau.append(entete, barreTemps, consigne, corps, pied, reactions, annonceur);
  racine.append(voile, panneau);
  ctx.racine.append(racine);
  if (window.matchMedia?.('(max-width: 720px)').matches && (def.consigne || '').length > 140) basculerConsigne(false);

  function basculerConsigne(ouvrir) {
    const o = ouvrir ?? consigne.hidden;
    consigne.hidden = !o;
    btnConsigne.setAttribute('aria-expanded', String(o));
  }
  btnConsigne.addEventListener('click', () => { ctx.jouer('clic'); basculerConsigne(); });
  btnQuitter.addEventListener('click', () => { ctx.jouer('clic'); confirmerAbandon(); });

  // ---------------------------------------------------------------- clavier
  function surClavier(ev) {
    if (ev.key === 'Tab') {
      const f = focusables(panneau);
      if (!f.length) return;
      const premier = f[0];
      const dernier = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === premier) { ev.preventDefault(); dernier.focus(); }
      else if (!ev.shiftKey && document.activeElement === dernier) { ev.preventDefault(); premier.focus(); }
      return;
    }
    if (ev.key === 'Escape') {
      const fn = piles.echap[piles.echap.length - 1];
      if (fn && fn() !== false) { ev.preventDefault(); return; }
      if (!termine) { ev.preventDefault(); confirmerAbandon(); }
      return;
    }
    const cible = ev.target;
    const saisie = cible && (cible.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'range'].includes(cible.type) || cible.tagName === 'TEXTAREA' || cible.isContentEditable);
    if (saisie) return;
    for (let i = piles.touches.length - 1; i >= 0; i--) {
      if (piles.touches[i](ev) === true) { ev.preventDefault(); return; }
    }
  }
  racine.addEventListener('keydown', surClavier);
  for (const nom of ['keydown', 'keyup', 'keypress']) racine.addEventListener(nom, (e) => e.stopPropagation());
  ev(document, 'keydown', (e) => { if (e.key !== 'Tab' && !racine.contains(e.target)) e.stopPropagation(); }, true);

  function ev(cible, nom, fn, opts) {
    cible.addEventListener(nom, fn, opts);
    nettoyages.push(() => cible.removeEventListener(nom, fn, opts));
  }

  // ---------------------------------------------------------------- chronomètre
  const chrono = (() => {
    let total = 0;
    let restantMs = 0;
    let dernier = 0;
    let minuterie = null;
    let enPause = false;
    let surFin = null;
    let surTic = null;
    let dernierTic = null;
    function afficher() {
      const sec = restantMs / 1000;
      chronoTexte.textContent = duree(sec);
      const frac = total ? restantMs / (total * 1000) : 0;
      barreTemps.firstChild.style.transform = `scaleX(${borner(frac)})`;
      const urgent = sec <= Math.min(10, total * 0.2);
      chronoEl.classList.toggle('dfx-chrono--urgent', urgent);
      barreTemps.classList.toggle('dfx-barre-temps--urgent', urgent);
      const entier = Math.ceil(sec);
      if (urgent && entier !== dernierTic && entier > 0) { dernierTic = entier; ctx.jouer('tic'); }
      surTic?.(sec);
    }
    function boucle() {
      const maintenant = performance.now();
      if (!enPause && !document.hidden) restantMs -= maintenant - dernier;
      dernier = maintenant;
      if (restantMs <= 0) {
        restantMs = 0;
        afficher();
        arreter();
        const f = surFin;
        surFin = null;
        f?.();
        return;
      }
      afficher();
    }
    function demarrer(sec, opts = {}) {
      arreter();
      total = sec;
      restantMs = sec * 1000;
      surFin = opts.surFin || null;
      surTic = opts.surTic || null;
      dernier = performance.now();
      chronoEl.hidden = false;
      barreTemps.hidden = false;
      afficher();
      minuterie = setInterval(boucle, 200);
    }
    function arreter() {
      if (minuterie) clearInterval(minuterie);
      minuterie = null;
    }
    function masquer() { arreter(); chronoEl.hidden = true; barreTemps.hidden = true; }
    return {
      demarrer,
      arreter,
      masquer,
      pause() { enPause = true; },
      reprendre() { enPause = false; dernier = performance.now(); },
      restant: () => restantMs / 1000,
      utilise: () => total - restantMs / 1000,
      actif: () => !!minuterie,
    };
  })();
  nettoyages.push(() => chrono.arreter());

  // ---------------------------------------------------------------- confirmation d'abandon
  function confirmerAbandon() {
    if (termine || panneau.querySelector('.dfx-confirmation')) return;
    chrono.pause();
    const rester = h('button', { class: 'dfx-btn dfx-btn--primaire', type: 'button', text: 'Continuer le défi' });
    const partir = h('button', { class: 'dfx-btn dfx-btn--danger', type: 'button', text: 'Abandonner' });
    const boite = h('div', { class: 'dfx-confirmation', role: 'alertdialog', 'aria-labelledby': `${id}-conf` },
      h('div', { class: 'dfx-confirmation-carte' },
        h('p', { class: 'dfx-confirmation-titre', id: `${id}-conf`, text: 'Abandonner ce défi ?' }),
        h('p', { text: 'Il comptera comme un échec, et ta direction l’apprendra.' }),
        h('div', { class: 'dfx-confirmation-actions' }, rester, partir)));
    const fermer = () => { boite.remove(); piles.echap.pop(); chrono.reprendre(); };
    piles.echap.push(() => { fermer(); return true; });
    rester.addEventListener('click', () => { ctx.jouer('clic'); fermer(); });
    partir.addEventListener('click', () => {
      ctx.jouer('echec');
      termine = true;
      conclure({ reussi: false, score: 0, details: { type: def.type, abandon: true, duree: tempsEcoule() } });
    });
    panneau.append(boite);
    rester.focus();
  }

  function tempsEcoule() {
    return Math.round((performance.now() - t0) / 100) / 10;
  }

  function conclure(resultat) {
    for (const n of nettoyages.splice(0)) { try { n(); } catch { /* déjà nettoyé */ } }
    const fin = () => {
      racine.remove();
      try { if (precedent && precedent.isConnected) precedent.focus(); } catch { /* sans focus */ }
      resolve(resultat);
    };
    if (ctx.calme) fin();
    else {
      racine.classList.add('dfx--sortie');
      setTimeout(fin, 260);
    }
  }

  // ---------------------------------------------------------------- réactions de personnages
  function nomPersonnage(qui, long = false) {
    const role = roleCanonique(qui);
    const p = ctx.personnages[role];
    if (p && (p.court || p.nom)) return String(long ? p.nom || p.court : p.court || p.nom);
    return NOMS_PERSONNAGES[role] || humaniser(role);
  }

  function descriptionPersonnage(qui) {
    const p = ctx.personnages[roleCanonique(qui)];
    return p && p.description ? String(p.description) : '';
  }

  function titrePreuve(id) {
    const v = ctx.titresPreuves[id];
    if (typeof v === 'string' && v) return v;
    if (v && typeof v === 'object' && v.titre) return String(v.titre);
    return humaniser(id);
  }

  function reagir(texte, { qui = 'collegue_doc', humeur = 'content', delai = 4200, force = false } = {}) {
    const maintenant = performance.now();
    if (!force && maintenant - derniereReaction < 2200) return;
    derniereReaction = maintenant;
    vider(reactions);
    const role = roleCanonique(qui);
    const bulle = h('div', { class: `dfx-reaction dfx-reaction--${role.replace(/_.*/, '')}` },
      h('div', { class: 'dfx-reaction-portrait' }, portrait(role, humeur, 52)),
      h('div', { class: 'dfx-reaction-bulle' },
        h('p', { class: 'dfx-reaction-nom', text: nomPersonnage(role) }),
        h('p', { class: 'dfx-reaction-texte', text: texte })));
    reactions.append(bulle);
    clearTimeout(reagir.minuterie);
    reagir.minuterie = setTimeout(() => {
      bulle.classList.add('dfx-reaction--sortie');
      setTimeout(() => bulle.remove(), 300);
    }, delai);
  }
  nettoyages.push(() => clearTimeout(reagir.minuterie));

  // ---------------------------------------------------------------- boutons du pied
  function bouton(texte, { primaire = false, ico = null, variante = '', surClic, desactive = false, titre = null } = {}) {
    const b = h('button', {
      class: `dfx-btn${primaire ? ' dfx-btn--primaire' : ''}${variante ? ` dfx-btn--${variante}` : ''}`,
      type: 'button',
      title: titre,
    }, ico ? icone(ico) : null, h('span', { text: texte }));
    b.disabled = desactive;
    b.addEventListener('click', (e) => { ctx.jouer('clic'); surClic?.(e); });
    actions.append(b);
    return b;
  }

  function erreur() {
    vider(corps);
    corps.append(h('div', { class: 'dfx-vide' }, icone('avertissement'), h('p', { text: 'Ce défi ne peut pas être affiché.' })));
    vider(actions);
    bouton('Continuer', { primaire: true, surClic: () => conclure({ reussi: false, score: 0, details: { type: def.type, erreur: true } }) }).focus();
  }

  // ---------------------------------------------------------------- bilan
  function terminer(res, rendreCorrection, options = {}) {
    if (termine) return;
    termine = true;
    chrono.arreter();
    piles.touches.length = 0;
    piles.echap.length = 0;
    const seuil = Number.isFinite(Number(def.reussite)) && def.reussite !== '' && def.reussite != null ? borner(Number(def.reussite)) : 0.6;
    const score = borner(Number(res.score) || 0);
    const reussi = typeof res.reussi === 'boolean' ? res.reussi : score >= seuil - 1e-9;
    const resultat = {
      reussi,
      score: Math.round(score * 1000) / 1000,
      details: { type: def.type, duree: tempsEcoule(), ...(res.details || {}) },
    };
    afficherBilan(resultat, rendreCorrection, options);
  }

  function afficherBilan(resultat, rendreCorrection, options) {
    const { reussi, score } = resultat;
    ctx.jouer(reussi ? 'succes' : 'echec');
    vider(corps);
    vider(actions);
    vider(reactions);
    statut.textContent = '';
    consigne.hidden = true;
    btnConsigne.hidden = true;
    btnQuitter.hidden = true;
    compteur.hidden = true;
    chrono.masquer();
    racine.classList.add('dfx--bilan', reussi ? 'dfx--reussi' : 'dfx--echoue');

    const verdict = options.verdict || (reussi ? (score >= 0.9 ? 'Impeccable' : 'Défi réussi') : 'À retravailler');
    const r = 52;
    const circ = 2 * Math.PI * r;
    const arc = s('circle', { cx: 60, cy: 60, r, class: 'dfx-anneau-arc', 'stroke-dasharray': circ.toFixed(1), 'stroke-dashoffset': circ.toFixed(1) });
    const valeur = h('strong', { class: 'dfx-anneau-valeur', brut: ctx.calme ? pct(score) : `0${NB}%` });
    const anneau = h('div', { class: 'dfx-anneau', role: 'img', 'aria-label': typo(`Score : ${pct(score)}`) },
      s('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true' },
        s('circle', { cx: 60, cy: 60, r, class: 'dfx-anneau-fond' }), arc),
      valeur, h('span', { class: 'dfx-anneau-legende', text: 'score' }));

    const tampon = h('div', { class: 'dfx-tampon', 'aria-hidden': 'true', text: reussi ? 'Validé' : 'À retravailler' });
    const retourTexte = reussi ? def.retour?.succes : def.retour?.echec;
    const effets = def.effets?.[reussi ? 'succes' : 'echec'];
    const effetsListe = listeEffets(effets, options.effetsSupplementaires);

    const tete = h('div', { class: 'dfx-bilan-tete' },
      h('div', { class: 'dfx-bilan-score' }, anneau, tampon),
      h('div', { class: 'dfx-bilan-texte' },
        h('p', { class: 'dfx-surtitre', text: reussi ? 'Bilan' : 'Bilan · échec' }),
        h('h3', { class: 'dfx-bilan-verdict', text: verdict }),
        options.sousVerdict ? h('p', { class: 'dfx-bilan-sous', text: options.sousVerdict }) : null,
        retourTexte ? h('p', { class: 'dfx-bilan-retour', text: retourTexte }) : null,
        effetsListe));

    const bilan = h('div', { class: 'dfx-bilan' }, tete);
    const pression = Number(effets?.pression) || 0;
    if (pression) bilan.append(bandeauPression(pression));

    if (rendreCorrection) {
      const zone = h('section', { class: 'dfx-correction', 'aria-label': 'Correction' });
      try { rendreCorrection(zone); } catch (e) { console.error(e); }
      if (zone.childNodes.length) bilan.append(zone);
    }

    const refs = Array.isArray(def.references) ? def.references.filter(Boolean) : (def.references ? [def.references] : []);
    if (refs.length) {
      bilan.append(h('section', { class: 'dfx-refs' },
        h('h4', { class: 'dfx-refs-titre', text: 'Pour aller plus loin' }),
        h('ol', { class: 'dfx-refs-liste' }, refs.map((rf) => h('li', { text: String(rf) })))));
    }

    corps.append(bilan);
    corps.scrollTop = 0;
    const continuer = bouton('Continuer', { primaire: true, ico: 'droite', surClic: () => conclure(resultat) });
    continuer.focus({ preventScroll: true });
    piles.touches.push((e) => { if (e.key === 'Enter' && document.activeElement === document.body) { continuer.click(); return true; } return false; });

    requestAnimationFrame(() => {
      arc.style.strokeDashoffset = (circ * (1 - score)).toFixed(1);
      if (!ctx.calme) {
        let k = 0;
        const t1 = performance.now();
        const pas = (t) => {
          k = Math.min(1, (t - t1) / 900);
          valeur.textContent = pct(score * (1 - (1 - k) ** 3));
          if (k < 1) requestAnimationFrame(pas);
        };
        requestAnimationFrame(pas);
      }
    });

    if (!ctx.calme) {
      if (reussi) eclats(tete.querySelector('.dfx-bilan-score'));
      else {
        panneau.classList.add('dfx-secousse');
        setTimeout(() => panneau.classList.remove('dfx-secousse'), 520);
      }
    }
    const tire = reussi ? { qui: 'collegue_doc', texte: QUIPS_REUSSITE[Math.floor(alea() * QUIPS_REUSSITE.length)] } : QUIPS_ECHEC[Math.floor(alea() * QUIPS_ECHEC.length)];
    const quip = options.reaction || tire.texte;
    const quiQuip = options.reactionQui || tire.qui;
    setTimeout(() => {
      if (!racine.isConnected) return;
      reagir(quip, { qui: quiQuip, humeur: reussi ? 'ravi' : 'sceptique', delai: 6000, force: true });
    }, ctx.calme ? 0 : 900);
  }

  function listeEffets(effets, supplementaires) {
    const items = [];
    const ajouter = (txt, bon) => items.push(h('li', { class: `dfx-effet ${bon ? 'dfx-effet--bon' : 'dfx-effet--mauvais'}`, text: txt }));
    const stats = { ...(effets?.stats || {}) };
    if (supplementaires?.stats) for (const [k, v] of Object.entries(supplementaires.stats)) stats[k] = (stats[k] || 0) + v;
    for (const [k, v] of Object.entries(stats)) {
      const n = Number(v);
      if (!n) continue;
      const bon = k === 'stress' ? n < 0 : n > 0;
      ajouter(`${STATS[k] || humaniser(k)} ${n > 0 ? '+' : '−'}${Math.abs(n)}`, bon);
    }
    const sem = (Number(effets?.semaines) || 0) + (Number(supplementaires?.semaines) || 0);
    if (sem) ajouter(`${sem > 0 ? '+' : '−'}${Math.abs(sem)} semaine${Math.abs(sem) > 1 ? 's' : ''}`, sem > 0);
    const preuves = [].concat(effets?.preuves || [], supplementaires?.preuves || []);
    for (const p of preuves) ajouter(`Preuve obtenue : ${titrePreuve(p)}`, true);
    return items.length ? h('ul', { class: 'dfx-effets', 'aria-label': 'Effets' }, items) : null;
  }

  function bandeauPression(p) {
    const monte = p > 0;
    const barre = h('span', { class: 'dfx-pression-barre' }, h('span', { style: { '--dfx-pression': `${borner(Math.abs(p) / 30)}` } }));
    return h('div', { class: `dfx-pression ${monte ? 'dfx-pression--monte' : 'dfx-pression--baisse'}` },
      icone('pas'),
      h('div', {},
        h('p', { class: 'dfx-pression-titre', text: monte ? 'La direction se rapproche' : 'La direction relâche la pression' }),
        h('p', { class: 'dfx-pression-texte', text: `Pression ${monte ? '+' : '−'}${Math.abs(p)}` })),
      barre);
  }

  function eclats(origine) {
    if (!origine) return;
    const couleurs = ['#16C762', '#11A7A5', '#0879BE', '#F6F4F1', '#5AAE38'];
    const zone = h('div', { class: 'dfx-eclats', 'aria-hidden': 'true' });
    for (let i = 0; i < 34; i++) {
      const a = alea() * Math.PI * 2;
      const d = 90 + alea() * 170;
      zone.append(h('i', {
        style: {
          '--dx': `${Math.cos(a) * d}px`,
          '--dy': `${Math.sin(a) * d - 40}px`,
          '--r': `${(alea() - 0.5) * 540}deg`,
          '--c': couleurs[i % couleurs.length],
          '--d': `${600 + alea() * 500}ms`,
          '--w': `${4 + alea() * 6}px`,
        },
      }));
    }
    origine.append(zone);
    setTimeout(() => zone.remove(), 1400);
  }

  return {
    def, ctx, racine, panneau, corps, actions, statut, alea, calme: ctx.calme, id,
    chrono,
    jouer: ctx.jouer,
    bouton,
    viderActions: () => vider(actions),
    annoncer: (t) => { annonceur.textContent = ''; setTimeout(() => { annonceur.textContent = typo(t); }, 30); },
    setStatut: (t) => { statut.textContent = typo(t || ''); },
    setCompteur: (t) => { compteur.hidden = !t; compteur.textContent = typo(t || ''); },
    setSurtitre: (t) => { const el = entete.querySelector('.dfx-surtitre'); if (el && t) el.textContent = typo(t); },
    reagir,
    nomPersonnage,
    descriptionPersonnage,
    titrePreuve,
    surTouche: (fn) => { piles.touches.push(fn); },
    surEchap: (fn) => { piles.echap.push(fn); return () => { const i = piles.echap.indexOf(fn); if (i >= 0) piles.echap.splice(i, 1); }; },
    ecouter: ev,
    surNettoyage: (fn) => nettoyages.push(fn),
    terminer,
    erreur,
    tempsEcoule,
    estTermine: () => termine,
    basculerConsigne,
  };
}

export async function lancerDefi(def, ctx) {
  const c = normaliserCtx(ctx);
  const d = def && typeof def === 'object' ? def : {};
  const type = TYPES[d.type];
  return new Promise((resolve) => {
    const coque = creerCoque(d, c, type, resolve);
    if (!type) { coque.erreur(); return; }
    let controle = {};
    try {
      controle = type.module.rendre(d, coque) || {};
    } catch (e) {
      console.error(e);
      coque.erreur();
      return;
    }
    const temps = Number(d.temps);
    if (!type.module.chronoManuel && temps > 0) {
      coque.chrono.demarrer(temps, {
        surFin: () => {
          if (coque.estTermine()) return;
          coque.reagir('Le temps est écoulé ! On remet ce qu’on a.', { qui: 'collegue_doc', humeur: 'surpris', force: true });
          controle.surTempsEcoule?.();
        },
      });
    }
  });
}
