import { h, s, icone, vider, pct, portrait, attendre, glisser, memoriserPositions, animerDepuis, roleCanonique, NB } from '../noyau.js?v=c7ebb6024c';
import { melanger, scorePitch, compterMots, dureeLecture, estSuperflu, borner, normaliser } from '../calculs.js?v=c7ebb6024c';

const MPM = 150;
const ETAGES = 6;

const REGISTRES = {
  soutenu: {
    bon: ['Intéressant.', 'Ça, ça me parle.', 'Hum hum.', 'Continuez.', 'D’accord, je vois.'],
    desordre: ['Attendez, je ne vous suis plus.', 'L’ordre m’échappe un peu.'],
    superflu: ['Euh… d’accord.', 'Je ne vois pas trop le lien.', 'C’est très… technique.', 'On arrive bientôt, non ?'],
    fin: ['Envoyez-moi votre protocole. On en reparle.', 'Intéressant. Écrivez-moi.', 'Euh… bonne chance avec votre thèse !'],
  },
  familier: {
    bon: ['Ah ouin.', 'Ça, je comprends.', 'Continue.', 'OK, je te suis.'],
    desordre: ['Attends, t’es rendu où, là ?', 'Recommence donc par le début.'],
    superflu: ['Hein ?', 'Euh… en français ?', 'Tu me perds, mon gars.', 'Ça, c’est du jargon.'],
    fin: ['Ah ben ! Ça, ça me parle.', 'Pas pire. Essaie plus simple.', 'J’ai rien compris, mais bonne chance.'],
  },
};

export function contextePitch(def) {
  const texte = normaliser(`${def.titre ?? ''} ${def.consigne ?? ''} ${def.retour?.succes ?? ''} ${def.retour?.echec ?? ''}`);
  const decor = ['ascenseur', 'glace', 'neutre'].includes(def.decor) ? def.decor
    : /ascenseur|etage/.test(texte) ? 'ascenseur'
      : /surfaceuse|zamboni|patinoire|la glace/.test(texte) ? 'glace' : 'neutre';
  let role = typeof def.interlocuteur === 'string' && def.interlocuteur.trim() ? def.interlocuteur.trim() : '';
  if (!role) {
    if (/\breal\b|surfaceuse|zamboni/.test(texte)) role = 'chauffeur_zamboni';
    else if (/professeur|\bprof\b/.test(texte)) role = 'prof_seminaire';
    else if (/direction|codirectrice/.test(texte)) role = 'direction_a';
    else role = 'gestionnaire_clsc';
  }
  const descend = decor === 'ascenseur' && /rez-de-chaussee|descend/.test(texte) && !/\bmonte\b/.test(texte);
  return { decor, role: roleCanonique(role), descend, registre: roleCanonique(role) === 'chauffeur_zamboni' ? 'familier' : 'soutenu' };
}

export function rendre(def, coque) {
  const fragments = (Array.isArray(def.fragments) ? def.fragments : []).map((f, i) => ({
    i, texte: String(f.texte ?? ''), rang: Number(f.rang), superflu: estSuperflu(f), mots: compterMots(f.texte),
  }));
  const limite = Number(def.limiteMots) > 0 ? Number(def.limiteMots) : 75;
  const ctxPitch = contextePitch(def);
  const PENSEES = REGISTRES[ctxPitch.registre];
  const nomInterlocuteur = coque.nomPersonnage(ctxPitch.role, true);
  const libDuree = ctxPitch.decor === 'ascenseur' ? 'd’ascenseur' : ctxPitch.decor === 'glace' ? 'pour un tour de glace' : 'd’attention';
  coque.setSurtitre(ctxPitch.decor === 'ascenseur' ? 'Pitch d’ascenseur' : ctxPitch.decor === 'glace' ? 'Pitch · vulgarisation' : 'Pitch');
  const piocheOrdre = melanger(fragments.map((f) => f.i), coque.alea);
  let piste = [];
  let phase = 'composer';

  const pioche = h('div', { class: 'dfx-pitch-pioche', role: 'list', 'aria-label': 'Fragments disponibles' });
  const pisteEl = h('ol', { class: 'dfx-pitch-piste', 'aria-label': 'Ton pitch, dans l’ordre' });
  const videPiste = h('li', { class: 'dfx-pitch-vide', text: 'Touche des fragments pour composer ton pitch. Garde l’essentiel, dans le bon ordre.' });
  const motsEl = h('strong', { brut: '0' });
  const secEl = h('strong', { brut: '0 s' });
  const barre = h('span', { class: 'dfx-pitch-barre-remplie' });
  const compteur = h('div', { class: 'dfx-pitch-compteur' },
    h('div', { class: 'dfx-pitch-chiffres' },
      h('span', {}, motsEl, h('span', { text: ` / ${limite} mots` })),
      h('span', {}, secEl, h('span', { text: ` · environ ${Math.round(dureeLecture(limite, MPM))} s ${libDuree}` }))),
    h('div', { class: 'dfx-pitch-barre', 'aria-hidden': 'true' }, barre, h('span', { class: 'dfx-pitch-limite' })));

  const elPioche = new Map();
  for (const i of piocheOrdre) {
    const f = fragments[i];
    const b = h('button', { class: 'dfx-pitch-frag', type: 'button', role: 'listitem', dataset: { i: String(i) } },
      h('span', { class: 'dfx-pitch-frag-texte', text: f.texte }),
      h('span', { class: 'dfx-pitch-frag-mots', brut: `${f.mots}${NB}mots` }),
      h('span', { class: 'dfx-pitch-frag-plus', 'aria-hidden': 'true' }, icone('plus')));
    b.setAttribute('aria-label', `Ajouter : ${f.texte} (${f.mots} mots)`);
    b.addEventListener('click', () => ajouter(i));
    elPioche.set(i, b);
    pioche.append(b);
  }

  coque.corps.append(h('div', { class: 'dfx-pitch' },
    h('section', { class: 'dfx-pitch-gauche' },
      h('p', { class: 'dfx-surtitre', text: 'Fragments' }),
      h('p', { class: 'dfx-aide', text: `Ton interlocuteur : ${nomInterlocuteur}. Environ 150 mots par minute : chaque mot compte.` }),
      pioche),
    h('section', { class: 'dfx-pitch-droite' },
      h('p', { class: 'dfx-surtitre', text: 'Ton pitch' }),
      compteur, pisteEl)));
  pisteEl.append(videPiste);
  const btn = coque.bouton('Présenter le pitch', { primaire: true, ico: 'micro', desactive: true, surClic: presenter });
  maj();

  function ajouter(i) {
    if (phase !== 'composer' || piste.includes(i)) return;
    piste.push(i);
    coque.jouer('clic');
    const el = elPioche.get(i);
    el.classList.add('dfx-pitch-frag--utilise');
    el.disabled = true;
    rendrePiste();
    coque.annoncer(`Ajouté en position ${piste.length}.`);
  }

  function retirer(i) {
    piste = piste.filter((x) => x !== i);
    const el = elPioche.get(i);
    el.classList.remove('dfx-pitch-frag--utilise');
    el.disabled = false;
    coque.jouer('clic');
    rendrePiste();
    el.focus();
  }

  function deplacer(i, pas) {
    const k = piste.indexOf(i);
    const n = k + pas;
    if (n < 0 || n >= piste.length) return;
    [piste[k], piste[n]] = [piste[n], piste[k]];
    rendrePiste();
    coque.jouer('clic');
    pisteEl.querySelector(`[data-i="${i}"] .dfx-pitch-fleche-${pas < 0 ? 'haut' : 'bas'}`)?.focus();
  }

  function rendrePiste() {
    const anciens = new Map([...pisteEl.querySelectorAll('[data-i]')].map((li) => [li.dataset.i, li.getBoundingClientRect()]));
    vider(pisteEl);
    if (!piste.length) pisteEl.append(videPiste);
    piste.forEach((i, k) => {
      const f = fragments[i];
      const haut = h('button', { class: 'dfx-btn-ico dfx-btn-ico--petit dfx-pitch-fleche-haut', type: 'button', title: 'Monter', disabled: k === 0 }, icone('haut'), h('span', { class: 'dfx-sr', text: 'Monter' }));
      const bas = h('button', { class: 'dfx-btn-ico dfx-btn-ico--petit dfx-pitch-fleche-bas', type: 'button', title: 'Descendre', disabled: k === piste.length - 1 }, icone('bas'), h('span', { class: 'dfx-sr', text: 'Descendre' }));
      const suppr = h('button', { class: 'dfx-btn-ico dfx-btn-ico--petit', type: 'button', title: 'Retirer' }, icone('fermer'), h('span', { class: 'dfx-sr', text: 'Retirer du pitch' }));
      haut.addEventListener('click', () => deplacer(i, -1));
      bas.addEventListener('click', () => deplacer(i, 1));
      suppr.addEventListener('click', () => retirer(i));
      const li = h('li', { class: 'dfx-pitch-item', dataset: { i: String(i) }, tabindex: '0' },
        h('span', { class: 'dfx-ordre-poignee', 'aria-hidden': 'true' }, icone('poignee')),
        h('span', { class: 'dfx-pitch-item-num', brut: String(k + 1) }),
        h('span', { class: 'dfx-pitch-item-texte', text: f.texte }),
        h('span', { class: 'dfx-pitch-item-outils' }, haut, bas, suppr));
      li.addEventListener('keydown', (e) => {
        if (e.target !== li) return;
        if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); deplacer(i, e.key === 'ArrowUp' ? -1 : 1); li.focus(); }
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); retirer(i); }
      });
      brancherGlisser(li, i);
      pisteEl.append(li);
    });
    if (!coque.calme) {
      for (const li of pisteEl.querySelectorAll('[data-i]')) {
        const r0 = anciens.get(li.dataset.i);
        if (r0) {
          const r1 = li.getBoundingClientRect();
          if (r0.top !== r1.top) li.animate?.([{ transform: `translateY(${r0.top - r1.top}px)` }, { transform: 'none' }], { duration: 200, easing: 'ease-out' });
        } else li.animate?.([{ opacity: 0, transform: 'translateX(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
      }
    }
    maj();
  }

  function brancherGlisser(li, i) {
    let prise = 0;
    const detacher = glisser(li, {
      tactile: '.dfx-ordre-poignee',
      ignorer: 'button',
      surDebut(ev) { prise = ev.clientY - li.getBoundingClientRect().top; li.classList.add('dfx-ordre-item--glisse'); },
      surDeplacement(ev) {
        const autres = [...pisteEl.children].filter((x) => x !== li);
        let index = autres.length;
        for (let k = 0; k < autres.length; k++) {
          const r = autres[k].getBoundingClientRect();
          if (ev.clientY < r.top + r.height / 2) { index = k; break; }
        }
        const actuel = [...pisteEl.children].indexOf(li);
        if (index !== actuel) {
          const pos = memoriserPositions(autres);
          pisteEl.insertBefore(li, autres[index] || null);
          animerDepuis(pos, coque.calme, 160);
        }
        li.style.transform = '';
        li.style.transform = `translateY(${ev.clientY - prise - li.getBoundingClientRect().top}px)`;
      },
      surFin() {
        li.classList.remove('dfx-ordre-item--glisse');
        li.style.transform = '';
        piste = [...pisteEl.querySelectorAll('[data-i]')].map((x) => +x.dataset.i);
        rendrePiste();
      },
    });
    coque.surNettoyage(detacher);
  }

  function maj() {
    const mots = piste.reduce((s2, i) => s2 + fragments[i].mots, 0);
    const sec = dureeLecture(mots, MPM);
    motsEl.textContent = String(mots);
    secEl.textContent = `${Math.round(sec)}${NB}s`;
    barre.style.width = `${Math.min(100, (mots / (limite * 1.5)) * 100)}%`;
    compteur.style.setProperty('--dfx-limite', `${(1 / 1.5) * 100}%`);
    compteur.classList.toggle('dfx-pitch-compteur--trop', mots > limite);
    btn.disabled = piste.length === 0;
    const trop = ctxPitch.decor === 'ascenseur' ? 'l’ascenseur arrivera avant la fin' : ctxPitch.decor === 'glace' ? 'le tour de glace finira avant toi' : 'ton interlocuteur partira avant la fin';
    coque.setStatut(piste.length ? (mots > limite ? `Trop long de ${mots - limite} mots : ${trop}.` : `${piste.length} fragment${piste.length > 1 ? 's' : ''} · ça tient dans le temps.`) : 'Compose ton pitch.');
  }

  // ---------------------------------------------------------------- présentation
  async function presenter() {
    if (phase !== 'composer' || !piste.length) return;
    phase = 'presenter';
    coque.chrono.arreter();
    coque.viderActions();
    vider(coque.corps);
    const { decor, role, descend } = ctxPitch;
    const zonePortrait = h('div', { class: 'dfx-asc-portrait' }, portrait(role, 'neutre', 150));
    const pensee = h('div', { class: 'dfx-asc-pensee', 'aria-live': 'polite' });
    const interet = h('span', { class: 'dfx-asc-interet-remplie' });
    const chronoSim = h('strong', { brut: `0${NB}s` });
    const decorEl = construireDecor(decor, descend);
    const scene = h('div', { class: `dfx-asc dfx-asc--${decor}` },
      h('div', { class: 'dfx-asc-cabine' }, decorEl.el, zonePortrait, pensee),
      h('div', { class: 'dfx-asc-hud' },
        h('p', { class: 'dfx-asc-qui', text: nomInterlocuteur }),
        h('div', { class: 'dfx-asc-interet', role: 'img', 'aria-label': 'Intérêt de ton interlocuteur' }, h('span', { text: 'Intérêt' }), h('span', { class: 'dfx-asc-interet-piste' }, interet)),
        h('p', { class: 'dfx-asc-temps' }, chronoSim, h('span', { text: ' écoulées' }))));
    const texte = h('div', { class: 'dfx-asc-texte' }, piste.map((i) => h('span', { class: 'dfx-asc-frag', dataset: { i: String(i) }, text: `${fragments[i].texte} ` })));
    coque.corps.append(h('div', { class: 'dfx-pitch-scene' }, scene, texte));
    coque.bouton('Passer', { variante: 'discret', ico: 'droite', surClic: () => { rapide = true; } });
    let rapide = coque.calme;

    const trajet = dureeLecture(limite, MPM);
    const facteur = 2.6;
    let simule = 0;
    let niveau = 0.5;
    let maxRang = -Infinity;
    let coupe = false;
    const majInteret = () => { interet.style.width = `${Math.round(niveau * 100)}%`; };
    majInteret();
    decorEl.maj(0);
    if (!coque.calme) { scene.classList.add('dfx-asc--entree'); await attendre(850); scene.classList.remove('dfx-asc--entree'); }

    for (const i of piste) {
      const f = fragments[i];
      const el = texte.querySelector(`[data-i="${i}"]`);
      const duree = dureeLecture(f.mots, MPM);
      if (simule >= trajet) { coupe = true; break; }
      el.classList.add('dfx-asc-frag--actif');
      const pas = rapide ? 0 : (duree / facteur) * 1000;
      const t0 = performance.now();
      while (!rapide && performance.now() - t0 < pas) {
        const s2 = simule + ((performance.now() - t0) / 1000) * facteur;
        chronoSim.textContent = `${Math.min(Math.round(s2), 99)}${NB}s`;
        decorEl.maj(Math.min(1, s2 / trajet));
        if (s2 >= trajet) break;
        await attendre(60);
      }
      simule += duree;
      if (simule > trajet + 0.5) {
        el.classList.add('dfx-asc-frag--coupe');
        coupe = true;
      }
      let cat;
      if (f.superflu) { niveau = borner(niveau - 0.16); cat = 'superflu'; }
      else if (f.rang > maxRang) { niveau = borner(niveau + 0.14); cat = 'bon'; maxRang = f.rang; }
      else { niveau = borner(niveau + 0.03); cat = 'desordre'; }
      majInteret();
      el.classList.remove('dfx-asc-frag--actif');
      el.classList.add(`dfx-asc-frag--${cat}`);
      vider(zonePortrait);
      zonePortrait.append(portrait(role, niveau >= 0.7 ? 'ravi' : niveau >= 0.5 ? 'content' : niveau >= 0.35 ? 'neutre' : 'sceptique', 150));
      const liste = PENSEES[cat];
      dire(liste[Math.floor(coque.alea() * liste.length)]);
      if (coupe) break;
    }
    chronoSim.textContent = `${Math.round(Math.min(simule, 99))}${NB}s`;
    decorEl.maj(Math.min(1, simule / trajet));
    const res = scorePitch(piste, fragments, limite);
    if (coupe || simule > trajet + 0.5) {
      texte.querySelectorAll('.dfx-asc-frag:not([class*="--bon"]):not([class*="--superflu"]):not([class*="--desordre"])').forEach((e2) => e2.classList.add('dfx-asc-frag--coupe'));
      decorEl.maj(1);
      coque.jouer('tic');
      dire(decor === 'ascenseur' ? 'Ding ! C’est mon étage. Écrivez-moi !' : decor === 'glace' ? 'Fin du tour ! La glace m’attend.' : 'Désolé, on m’attend. Écrivez-moi !');
      decorEl.fin();
      coque.reagir(decor === 'ascenseur' ? 'L’ascenseur n’attend personne. Même pas les doctorants.' : decor === 'glace' ? 'Un tour de surfaceuse, ça passe vite.' : 'Trop long : ton interlocuteur est parti avant la fin.', { humeur: 'surpris', force: true });
    } else {
      dire(PENSEES.fin[res.score >= 0.85 ? 0 : res.score >= 0.6 ? 1 : 2]);
      if (!coque.calme) decorEl.fin();
    }
    coque.viderActions();
    coque.bouton('Voir le bilan', { primaire: true, ico: 'droite', surClic: () => finir(res) }).focus();
    coque.setStatut(`${res.mots} mots · environ ${Math.round(res.secondes)} s pour ${Math.round(trajet)} s ${libDuree}.`);

    function dire(txt) {
      pensee.textContent = txt;
      pensee.classList.remove('dfx-asc-pensee--pop');
      void pensee.offsetWidth;
      pensee.classList.add('dfx-asc-pensee--pop');
    }
  }

  function finir(res) {
    coque.terminer({
      score: res.score,
      details: { mots: res.mots, secondes: Math.round(res.secondes), couverture: res.couverture, sobriete: res.sobriete, ordre: res.ordre, longueur: res.longueur, fragments: piste.slice() },
    }, (zone) => {
      zone.append(h('div', { class: 'dfx-stats' },
        statCase('Essentiel', pct(res.couverture), 'fragments clés présents'),
        statCase('Sobriété', pct(res.sobriete), 'superflu écarté'),
        statCase('Ordre', pct(res.ordre), 'logique du récit'),
        statCase('Longueur', `${res.mots} mots`, `limite : ${limite} mots`, res.mots > limite)));
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Le pitch attendu' }));
      const ess = fragments.filter((f) => !f.superflu).sort((a, b) => a.rang - b.rang);
      zone.append(h('ol', { class: 'dfx-liste-correction dfx-liste-correction--num' }, ess.map((f, k) => h('li', { class: `dfx-ligne-correction ${piste.includes(f.i) ? 'dfx-ok' : 'dfx-ko'}` },
        h('span', { class: 'dfx-ligne-num', brut: String(k + 1) }),
        h('div', {}, h('p', { class: 'dfx-ligne-titre', text: f.texte }), h('p', { class: 'dfx-ligne-meta', text: piste.includes(f.i) ? `Dans ton pitch, en position ${piste.indexOf(f.i) + 1}` : 'Absent de ton pitch' }))))));
      const sup = fragments.filter((f) => f.superflu);
      if (sup.length) {
        zone.append(h('h4', { class: 'dfx-correction-titre', text: 'À garder pour plus tard' }));
        zone.append(h('ul', { class: 'dfx-liste-simple' }, sup.map((f) => h('li', { class: piste.includes(f.i) ? 'dfx-ko' : 'dfx-ok', text: `${f.texte}${piste.includes(f.i) ? ' (dans ton pitch)' : ''}` }))));
      }
    });
  }

  return {
    surTempsEcoule() {
      if (phase === 'composer') {
        if (piste.length) presenter();
        else coque.terminer({ score: 0, reussi: false, details: { mots: 0, tempsEcoule: true } });
      }
    },
  };
}

function construireDecor(decor, descend) {
  if (decor === 'ascenseur') {
    const affichage = h('span', { class: 'dfx-asc-etage', brut: descend ? String(ETAGES) : 'RC' });
    const fleche = h('span', { class: 'dfx-asc-fleche', 'aria-hidden': 'true' }, icone(descend ? 'bas' : 'haut'));
    const portes = h('div', { class: 'dfx-asc-portes', 'aria-hidden': 'true' }, h('span', { class: 'dfx-asc-porte dfx-asc-porte--g' }), h('span', { class: 'dfx-asc-porte dfx-asc-porte--d' }));
    const el = h('div', { class: 'dfx-decor' }, h('div', { class: 'dfx-asc-panneau' }, fleche, affichage), portes, h('div', { class: 'dfx-asc-main-courante', 'aria-hidden': 'true' }));
    return {
      el,
      maj(k) {
        const e = Math.min(ETAGES, Math.floor(k * ETAGES));
        const n = descend ? ETAGES - e : e;
        affichage.textContent = n <= 0 ? 'RC' : String(n);
      },
      fin() { el.closest('.dfx-asc')?.classList.add('dfx-asc--ouvert'); },
    };
  }
  if (decor === 'glace') {
    const surfaceuse = s('g', { class: 'dfx-glace-surfaceuse' },
      s('rect', { x: -26, y: -15, width: 52, height: 30, rx: 7, fill: '#F6F4F1', stroke: '#0D2A3A', 'stroke-width': 2 }),
      s('rect', { x: -26, y: -15, width: 14, height: 30, rx: 4, fill: '#0755AD' }),
      s('rect', { x: 2, y: -10, width: 14, height: 12, rx: 3, fill: '#11A7A5' }),
      s('rect', { x: -30, y: -17, width: 6, height: 34, rx: 2, fill: '#4F6878' }));
    const trace = s('path', { class: 'dfx-glace-trace', d: '' });
    const svg = s('svg', { class: 'dfx-glace', viewBox: '0 0 400 230', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' },
      s('rect', { x: 10, y: 10, width: 380, height: 210, rx: 70, class: 'dfx-glace-bande' }),
      s('rect', { x: 18, y: 18, width: 364, height: 194, rx: 64, class: 'dfx-glace-surface' }),
      s('line', { x1: 200, y1: 18, x2: 200, y2: 212, class: 'dfx-glace-rouge' }),
      s('line', { x1: 140, y1: 18, x2: 140, y2: 212, class: 'dfx-glace-bleue' }),
      s('line', { x1: 260, y1: 18, x2: 260, y2: 212, class: 'dfx-glace-bleue' }),
      s('circle', { cx: 200, cy: 115, r: 28, class: 'dfx-glace-cercle' }),
      trace, surfaceuse);
    const el = h('div', { class: 'dfx-decor dfx-decor--glace' }, svg);
    const pos = (k) => {
      const a = -Math.PI / 2 + k * 2 * Math.PI;
      return { x: 200 + 150 * Math.cos(a), y: 115 + 72 * Math.sin(a), ang: (a * 180) / Math.PI + 90 };
    };
    return {
      el,
      maj(k) {
        const p = pos(k);
        surfaceuse.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.ang})`);
        const pts = [];
        for (let j = 0; j <= 40; j++) { const q = pos((k * j) / 40); pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`); }
        trace.setAttribute('d', `M${pts.join('L')}`);
      },
      fin() { el.classList.add('dfx-decor--fini'); },
    };
  }
  const barre = h('span', { class: 'dfx-decor-temps-remplie' });
  const el = h('div', { class: 'dfx-decor dfx-decor--neutre' }, h('div', { class: 'dfx-decor-horloge', 'aria-hidden': 'true' }, icone('horloge')), h('div', { class: 'dfx-decor-temps' }, barre));
  return { el, maj(k) { barre.style.width = `${Math.round(k * 100)}%`; }, fin() {} };
}

function statCase(titre, valeur, legende, alerte) {
  return h('div', { class: `dfx-stat${alerte ? ' dfx-stat--alerte' : ''}` }, h('strong', { brut: valeur }), h('p', { class: 'dfx-stat-titre', text: titre }), h('p', { class: 'dfx-stat-legende', text: legende }));
}

