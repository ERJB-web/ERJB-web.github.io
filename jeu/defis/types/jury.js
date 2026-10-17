import { h, icone, vider, pct, portrait, attendre } from '../noyau.js?v=224d9fe72e';
import { borner, scoreJury, humeurApres, normaliser } from '../calculs.js?v=224d9fe72e';

export const chronoManuel = true;

const ROLES = ['Président du jury', 'Membre du jury', 'Membre du jury'];
const PORTRAITS = ['jury_1', 'jury_2', 'jury_3'];

const REACTIONS = {
  excellent: ['Très bien. C’est exactement ce que je voulais entendre.', 'Voilà une réponse appuyée sur des données. Merci.', 'Convaincant. Je raye ma question suivante.'],
  bon: ['D’accord. J’aurais aimé un peu plus de précision, mais ça se défend.', 'Raisonnable. Vous pourrez l’étoffer dans la version finale.'],
  moyen: ['Hum. Je reste sur ma faim.', 'C’est une piste… mais ce n’est pas encore une réponse.'],
  faible: ['Je vais être franc : ça m’inquiète.', 'Vous êtes conscient que ce n’est pas ce que dit la littérature ?'],
  silence: ['… Nous prendrons ce silence pour un « je ne sais pas ».'],
};

function humeurVisage(q) {
  if (q >= 0.85) return 'ravi';
  if (q >= 0.6) return 'content';
  if (q >= 0.35) return 'neutre';
  if (q >= 0.15) return 'sceptique';
  return 'fache';
}

export function verdictJury(score, seuil) {
  if (score >= 0.85) return 'Protocole accepté';
  if (score >= seuil) return 'Accepté avec modifications mineures';
  if (score >= 0.4) return 'Modifications majeures demandées';
  return 'Soutenance ajournée';
}

function estIdentifiant(m) {
  return typeof m === 'number' || /^(jury|membre|m)?[\s_-]?\d+$/i.test(String(m).trim());
}

export function rendre(def, coque) {
  const questions = (Array.isArray(def.questions) ? def.questions : []).map((q, i) => ({
    i, texte: String(q.texte ?? ''), membre: q.membre ?? i % 3,
    reponses: (Array.isArray(q.reponses) ? q.reponses : []).map((r, k) => ({ k, texte: String(r.texte ?? r), qualite: borner(Number(r.qualite) || 0), preuve: r.preuve ? String(r.preuve) : null })),
  }));
  const cles = [];
  for (const q of questions) {
    const c = String(q.membre);
    if (!cles.includes(c)) cles.push(c);
  }
  const membres = cles.slice(0, 3).map((c, k) => {
    let siege = k;
    const m = /(\d+)\s*$/.exec(c);
    if (m && +m[1] >= 1 && +m[1] <= 3) siege = +m[1] - 1;
    const connu = estIdentifiant(c) && coque.ctx.personnages[`jury_${siege + 1}`] ? coque.nomPersonnage(`jury_${siege + 1}`, true) : null;
    return { cle: c, siege, nom: estIdentifiant(c) ? connu : c, role: coque.descriptionPersonnage(`jury_${siege + 1}`) };
  });
  const sieges = [0, 1, 2].map((k) => membres.find((m) => m.siege === k) || null);
  membres.forEach((m) => { if (!sieges.includes(m)) sieges[sieges.indexOf(null)] = m; });
  const siegeDe = (q) => {
    const m = membres.find((x) => x.cle === String(q.membre));
    return m ? sieges.indexOf(m) : questions.indexOf(q) % 3;
  };
  const preuves = new Set(coque.ctx.preuves.map((p) => normaliser(p)));
  const tempsQ = Number(def.temps) > 0 ? Math.max(15, Number(def.temps) / Math.max(1, questions.length)) : 45;
  const qualites = [];
  const reponsesDonnees = [];
  let humeur = 0.5;
  let k = 0;
  let enAttente = false;
  let fini = false;

  // ---------------------------------------------------------------- scène
  const jaugeRemplie = h('span', { class: 'dfx-jury-humeur-remplie' });
  const jaugeCurseur = h('span', { class: 'dfx-jury-humeur-curseur' });
  const jauge = h('div', { class: 'dfx-jury-humeur', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '50', 'aria-label': 'Humeur du jury' },
    h('span', { class: 'dfx-jury-humeur-bout', text: 'Sceptique' }),
    h('span', { class: 'dfx-jury-humeur-piste' }, jaugeRemplie, jaugeCurseur),
    h('span', { class: 'dfx-jury-humeur-bout', text: 'Convaincu' }));
  const membresEl = [0, 1, 2].map((k2) => {
    const m = sieges[k2] || (coque.ctx.personnages[`jury_${k2 + 1}`] ? { nom: coque.nomPersonnage(`jury_${k2 + 1}`, true), role: coque.descriptionPersonnage(`jury_${k2 + 1}`) } : null);
    const zonePortrait = h('div', { class: 'dfx-jury-portrait' }, portrait(PORTRAITS[k2], 'neutre', 112));
    const el = h('div', { class: 'dfx-jury-membre', dataset: { siege: String(k2) } },
      zonePortrait,
      h('div', { class: 'dfx-jury-plaque' },
        h('strong', { text: m?.nom || ROLES[k2] }),
        m?.nom ? h('span', { text: m.role || ROLES[k2] }) : null));
    return { el, zonePortrait, humeur: 'neutre' };
  });
  const table = h('div', { class: 'dfx-jury-table' }, membresEl.map((m) => m.el), h('div', { class: 'dfx-jury-bois', 'aria-hidden': 'true' }));
  const bulle = h('div', { class: 'dfx-jury-bulle', 'aria-live': 'polite' });
  const reponses = h('div', { class: 'dfx-jury-reponses', role: 'group', 'aria-label': 'Tes réponses possibles' });
  const reaction = h('p', { class: 'dfx-jury-reaction', 'aria-live': 'polite' });
  const progression = h('ol', { class: 'dfx-jury-prog', 'aria-hidden': 'true' }, questions.map(() => h('li')));
  const deliberation = h('div', { class: 'dfx-jury-deliberation', hidden: true }, h('span', { class: 'dfx-jury-points' }, h('i'), h('i'), h('i')), h('p', { text: 'Le jury délibère…' }));

  coque.corps.append(h('div', { class: 'dfx-jury' },
    h('div', { class: 'dfx-jury-haut' }, jauge, progression),
    table,
    h('div', { class: 'dfx-jury-echange' }, bulle, reaction, reponses),
    deliberation));
  majJauge();
  poser();

  coque.surTouche((e) => {
    if (enAttente || fini) return false;
    const n = /^[1-9]$/.test(e.key) ? +e.key - 1 : -1;
    const tous = [...reponses.querySelectorAll('button')];
    if (n >= 0 && n < tous.length && !tous[n].disabled) { tous[n].click(); return true; }
    return false;
  });

  function majJauge() {
    jaugeRemplie.style.width = `${Math.round(humeur * 100)}%`;
    jaugeCurseur.style.left = `${Math.round(humeur * 100)}%`;
    jauge.setAttribute('aria-valuenow', String(Math.round(humeur * 100)));
    jauge.classList.toggle('dfx-jury-humeur--basse', humeur < 0.35);
    jauge.classList.toggle('dfx-jury-humeur--haute', humeur > 0.7);
  }

  function visage(siege, hum) {
    const m = membresEl[siege];
    if (m.humeur === hum) return;
    m.humeur = hum;
    vider(m.zonePortrait);
    m.zonePortrait.append(portrait(PORTRAITS[siege], hum, 112));
  }

  async function poser() {
    if (k >= questions.length) { conclure(); return; }
    const q = questions[k];
    const siege = siegeDe(q);
    enAttente = true;
    vider(reponses);
    reaction.textContent = '';
    [...progression.children].forEach((li, j) => { li.className = j < k ? 'dfx-jury-prog--fait' : j === k ? 'dfx-jury-prog--actuel' : ''; });
    membresEl.forEach((m, j) => m.el.classList.toggle('dfx-jury-membre--actif', j === siege));
    visage(siege, 'neutre');
    vider(bulle);
    const qui = sieges[siege]?.nom || ROLES[siege];
    const texte = h('p', { class: 'dfx-jury-question' });
    bulle.append(h('p', { class: 'dfx-jury-qui', text: `${qui} · question ${k + 1} sur ${questions.length}` }), texte);
    bulle.dataset.siege = String(siege);
    await taper(texte, q.texte);
    if (fini) return;
    q.reponses.forEach((r, j) => {
      const verrouillee = r.preuve && !preuves.has(normaliser(r.preuve));
      const b = h('button', { class: `dfx-jury-rep${r.preuve ? (verrouillee ? ' dfx-jury-rep--verrou' : ' dfx-jury-rep--preuve') : ''}`, type: 'button', style: { '--dfx-delai': `${j * 60}ms` } },
        h('span', { class: 'dfx-option-lettre', brut: String(j + 1) }),
        h('span', { class: 'dfx-jury-rep-texte', text: verrouillee ? 'Réponse appuyée sur une preuve que tu n’as pas encore récoltée.' : r.texte }),
        r.preuve ? h('span', { class: 'dfx-jury-rep-preuve' }, icone(verrouillee ? 'cadenas' : 'preuve'), h('span', { text: verrouillee ? `Preuve requise : ${coque.titrePreuve(r.preuve)}` : `Preuve : ${coque.titrePreuve(r.preuve)}` })) : null);
      b.disabled = !!verrouillee;
      b.addEventListener('click', () => repondre(q, r, b));
      reponses.append(b);
    });
    enAttente = false;
    reponses.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
    coque.chrono.demarrer(tempsQ, { surFin: () => { if (!enAttente && !fini) repondre(q, null, null); } });
    coque.setStatut('Choisis ta réponse (touches 1 à 4).');
  }

  async function taper(el, texte) {
    if (coque.calme) { el.textContent = texte; return; }
    let passer = false;
    const sauter = () => { passer = true; };
    bulle.addEventListener('click', sauter, { once: true });
    const t = String(texte);
    for (let i = 1; i <= t.length; i++) {
      if (passer || fini) break;
      el.textContent = t.slice(0, i);
      await attendre(t[i - 1] === ' ' ? 8 : 14);
    }
    el.textContent = t;
    bulle.removeEventListener('click', sauter);
  }

  async function repondre(q, r, bouton) {
    if (enAttente || fini) return;
    enAttente = true;
    coque.chrono.arreter();
    const qualite = r ? r.qualite : 0;
    qualites.push(qualite);
    reponsesDonnees.push({ question: q.i, reponse: r ? r.k : null, qualite, preuve: r?.preuve || null });
    reponses.querySelectorAll('button').forEach((b) => { b.disabled = true; if (b !== bouton) b.classList.add('dfx-jury-rep--ecartee'); });
    bouton?.classList.add('dfx-jury-rep--choisie');
    coque.jouer('clic');
    const siege = siegeDe(q);
    const cat = !r ? 'silence' : qualite >= 0.85 ? 'excellent' : qualite >= 0.6 ? 'bon' : qualite >= 0.35 ? 'moyen' : 'faible';
    const liste = REACTIONS[cat];
    const avant = humeur;
    humeur = humeurApres(humeur, qualite);
    if (!r) humeur = borner(humeur - 0.05);
    majJauge();
    visage(siege, humeurVisage(qualite));
    membresEl.forEach((m, j) => {
      if (j === siege) return;
      visage(j, humeur > avant + 0.05 ? 'content' : humeur < avant - 0.05 ? 'sceptique' : 'neutre');
    });
    reaction.textContent = '';
    reaction.append(h('span', { class: `dfx-jury-reaction-texte dfx-jury-reaction--${cat}`, text: liste[Math.floor(coque.alea() * liste.length)] }));
    if (!coque.calme) jauge.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 400 });
    if (r?.preuve && qualite >= 0.85) coque.reagir('La preuve a fait mouche. Bien joué d’être passé la chercher !', { humeur: 'ravi', force: true });
    k++;
    const suivant = coque.bouton(k < questions.length ? 'Question suivante' : 'Laisser le jury délibérer', { primaire: true, ico: 'droite', surClic: avancer });
    suivant.focus({ preventScroll: true });
    let avance = false;
    function avancer() {
      if (avance) return;
      avance = true;
      coque.viderActions();
      poser();
    }
    if (!coque.calme) setTimeout(() => { if (!fini && !avance && suivant.isConnected && document.activeElement === suivant) avancer(); }, 4200);
    coque.setStatut(k < questions.length ? 'Le jury prend des notes…' : 'C’était la dernière question.');
  }

  async function conclure() {
    if (fini) return;
    fini = true;
    coque.chrono.masquer();
    membresEl.forEach((m) => m.el.classList.remove('dfx-jury-membre--actif'));
    vider(reponses);
    vider(bulle);
    reaction.textContent = '';
    deliberation.hidden = false;
    coque.setStatut('');
    if (!coque.calme) await attendre(1500);
    const score = scoreJury(qualites);
    const seuil = Number.isFinite(Number(def.reussite)) && def.reussite != null ? borner(Number(def.reussite)) : 0.6;
    coque.terminer({ score, details: { reponses: reponsesDonnees, humeur: Math.round(humeur * 100) / 100 } }, (zone) => correction(zone), {
      verdict: verdictJury(score, seuil),
      reactionQui: score >= seuil ? 'collegue' : 'direction',
    });
  }

  function correction(zone) {
    zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Question par question' }));
    const liste = h('ul', { class: 'dfx-liste-correction' });
    questions.forEach((q, j) => {
      const donnee = reponsesDonnees[j];
      const r = donnee && donnee.reponse != null ? q.reponses[donnee.reponse] : null;
      const meilleure = q.reponses.slice().sort((a, b) => b.qualite - a.qualite)[0];
      const siege = siegeDe(q);
      const ok = r && meilleure && r.qualite >= meilleure.qualite - 1e-9;
      liste.append(h('li', { class: `dfx-ligne-correction ${ok ? 'dfx-ok' : r && r.qualite >= 0.5 ? 'dfx-moyen' : 'dfx-ko'}` },
        h('span', { class: 'dfx-ligne-ico' }, icone(ok ? 'valider' : r && r.qualite >= 0.5 ? 'info' : 'fermer')),
        h('div', {},
          h('p', { class: 'dfx-ligne-meta', text: sieges[siege]?.nom || ROLES[siege] }),
          h('p', { class: 'dfx-ligne-titre', text: q.texte }),
          h('p', { class: 'dfx-ligne-explication', text: r ? `Ta réponse (${pct(r.qualite)}) : ${r.texte}` : 'Pas de réponse dans le temps imparti.' }),
          !ok && meilleure ? h('p', { class: 'dfx-ligne-explication dfx-ligne-explication--forte', text: `Réponse la plus forte (${pct(meilleure.qualite)}) : ${meilleure.texte}${meilleure.preuve ? ` · débloquée par la preuve « ${coque.titrePreuve(meilleure.preuve)} »` : ''}` }) : null)));
    });
    zone.append(liste);
  }

  return {};
}

