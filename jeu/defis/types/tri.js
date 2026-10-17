import { h, icone, humaniser, glisser, elementSous, memoriserPositions, animerDepuis, defilerPres } from '../noyau.js?v=63f5f7cb13';
import { melanger, scoreTri } from '../calculs.js?v=63f5f7cb13';

export function rendre(def, coque) {
  const bacs = (Array.isArray(def.bacs) ? def.bacs : []).map((b, i) => ({
    id: String(b.id ?? i), titre: String(b.titre ?? humaniser(b.id ?? `Bac ${i + 1}`)),
  }));
  const cartes = (Array.isArray(def.cartes) ? def.cartes : []).map((c, i) => ({
    i, texte: String(c.texte ?? ''), bac: String(c.bac), explication: c.explication || '',
  }));
  const place = new Array(cartes.length).fill(null);
  let selection = null;
  let valide = false;

  const pioche = h('div', { class: 'dfx-tri-pioche', 'data-bac': '', role: 'group', 'aria-label': 'Cartes à classer' });
  const piocheVide = h('p', { class: 'dfx-tri-vide', text: 'Toutes les cartes sont classées. Tu peux encore les déplacer.' });
  const zonePioche = h('div', { class: 'dfx-tri-zone-pioche' },
    h('div', { class: 'dfx-tri-entete' },
      h('p', { class: 'dfx-surtitre', text: 'Cartes à classer' }),
      h('p', { class: 'dfx-aide', text: 'Glisse une carte dans un bac, ou sélectionne-la puis choisis le bac (touches 1 à 9).' })),
    pioche, piocheVide);

  const grilleBacs = h('div', { class: 'dfx-tri-bacs', style: { '--dfx-nb-bacs': String(Math.min(bacs.length, 6)) } });
  const elBacs = bacs.map((b, k) => {
    const liste = h('div', { class: 'dfx-bac-liste' });
    const compte = h('span', { class: 'dfx-bac-compte', brut: '0' });
    const el = h('div', { class: 'dfx-bac', 'data-bac': b.id, role: 'button', tabindex: '0', 'aria-label': `Bac ${k + 1} : ${b.titre}` },
      h('div', { class: 'dfx-bac-tete' },
        h('kbd', { class: 'dfx-bac-num', brut: String(k + 1) }),
        h('span', { class: 'dfx-bac-titre', text: b.titre }),
        compte),
      liste);
    el.addEventListener('click', (e) => {
      if (valide || e.target.closest('.dfx-carte')) return;
      if (selection != null) deposer(selection, b.id);
    });
    el.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target === el && selection != null) { e.preventDefault(); deposer(selection, b.id); }
    });
    grilleBacs.append(el);
    return { b, el, liste, compte };
  });
  pioche.addEventListener('click', (e) => {
    if (!valide && !e.target.closest('.dfx-carte') && selection != null) deposer(selection, null);
  });

  const elCartes = new Map();
  for (const c of melanger(cartes, coque.alea)) {
    const el = h('div', { class: 'dfx-carte', role: 'button', tabindex: '0', 'aria-pressed': 'false', dataset: { i: String(c.i) } },
      h('span', { class: 'dfx-carte-poignee', 'aria-hidden': 'true' }, icone('poignee')),
      h('span', { class: 'dfx-carte-texte', text: c.texte }),
      h('span', { class: 'dfx-carte-marque', 'aria-hidden': 'true' }));
    el.addEventListener('click', () => { if (!valide) selectionner(c.i); });
    el.addEventListener('keydown', (e) => {
      if (valide) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectionner(c.i); }
    });
    brancherGlisser(el, c.i);
    elCartes.set(c.i, el);
    pioche.append(el);
  }

  coque.corps.append(h('div', { class: 'dfx-tri' }, zonePioche, grilleBacs));
  const btn = coque.bouton('Valider le classement', { primaire: true, ico: 'valider', desactive: true, surClic: valider });
  majStatut();

  coque.surTouche((e) => {
    if (valide) return false;
    const actif = document.activeElement?.closest?.('.dfx-carte');
    const cible = selection ?? (actif ? +actif.dataset.i : null);
    if (cible == null) return false;
    if (/^[1-9]$/.test(e.key) && +e.key <= bacs.length) { deposer(cible, bacs[+e.key - 1].id, true); return true; }
    if (e.key === '0' || e.key === 'Backspace') { deposer(cible, null, true); return true; }
    return false;
  });
  coque.surEchap(() => {
    if (selection == null) return false;
    selectionner(null);
    return true;
  });

  function selectionner(i) {
    if (selection === i || i == null) {
      if (selection != null) elCartes.get(selection).setAttribute('aria-pressed', 'false');
      selection = null;
    } else {
      if (selection != null) elCartes.get(selection).setAttribute('aria-pressed', 'false');
      selection = i;
      elCartes.get(i).setAttribute('aria-pressed', 'true');
      coque.jouer('clic');
      coque.annoncer(`Carte sélectionnée : ${cartes[i].texte}. Choisis un bac.`);
    }
    coque.racine.querySelector('.dfx-tri')?.classList.toggle('dfx-tri--selection', selection != null);
    elCartes.forEach((el, k) => el.classList.toggle('dfx-carte--selection', k === selection));
  }

  function deposer(i, bacId, garderFocus = false) {
    const el = elCartes.get(i);
    const tous = [...elCartes.values()];
    const positions = memoriserPositions(tous);
    place[i] = bacId;
    const dest = bacId == null ? pioche : elBacs.find((x) => x.b.id === bacId).liste;
    dest.append(el);
    animerDepuis(positions, coque.calme);
    if (!coque.calme) el.animate?.([{ boxShadow: '0 0 0 3px rgba(17,167,165,.9)' }, { boxShadow: '0 0 0 0 rgba(17,167,165,0)' }], { duration: 500 });
    selectionner(null);
    coque.jouer('clic');
    const bac = bacs.find((b) => b.id === bacId);
    coque.annoncer(bac ? `Placée dans ${bac.titre}.` : 'Remise dans la pile.');
    if (garderFocus) el.focus();
    majStatut();
  }

  function majStatut() {
    const n = place.filter((p) => p != null).length;
    elBacs.forEach((x) => { x.compte.textContent = String(place.filter((p) => p === x.b.id).length); });
    piocheVide.hidden = n < cartes.length;
    btn.disabled = n < cartes.length || valide;
    coque.setStatut(`${n} carte${n > 1 ? 's' : ''} classée${n > 1 ? 's' : ''} sur ${cartes.length}`);
    if (n === cartes.length && !majStatut.dit) {
      majStatut.dit = true;
      coque.reagir('Tout est classé. Reste à savoir si c’est bien classé.', { humeur: 'content' });
    }
  }

  function brancherGlisser(el, i) {
    let fantome = null;
    let survol = null;
    let decalage = { x: 0, y: 0 };
    const detacher = glisser(el, {
      tactile: '.dfx-carte-poignee',
      surDebut(ev) {
        if (valide) return;
        const r = el.getBoundingClientRect();
        decalage = { x: ev.clientX - r.left, y: ev.clientY - r.top };
        fantome = el.cloneNode(true);
        fantome.classList.add('dfx-carte--fantome');
        fantome.style.width = `${r.width}px`;
        fantome.style.left = '0px';
        fantome.style.top = '0px';
        fantome.style.transform = `translate(${r.left}px, ${r.top}px)`;
        coque.racine.append(fantome);
        el.classList.add('dfx-carte--source');
        coque.racine.classList.add('dfx--glisse');
      },
      surDeplacement(ev) {
        if (!fantome) return;
        fantome.style.transform = `translate(${ev.clientX - decalage.x}px, ${ev.clientY - decalage.y}px) rotate(-2deg)`;
        const cible = elementSous(ev.clientX, ev.clientY, '[data-bac]');
        if (cible !== survol) {
          survol?.classList.remove('dfx-bac--survol');
          survol = cible;
          survol?.classList.add('dfx-bac--survol');
        }
        defilerPres(coque.corps, ev.clientY);
      },
      surFin(ev, etat, annule) {
        if (!fantome) return;
        fantome.remove();
        fantome = null;
        el.classList.remove('dfx-carte--source');
        coque.racine.classList.remove('dfx--glisse');
        survol?.classList.remove('dfx-bac--survol');
        const cible = survol;
        survol = null;
        if (annule || !cible) return;
        const id = cible.dataset.bac;
        deposer(i, id === '' ? null : id);
      },
    });
    coque.surNettoyage(detacher);
  }

  function valider() {
    if (valide) return;
    valide = true;
    coque.chrono.arreter();
    selectionner(null);
    btn.disabled = true;
    const res = scoreTri(place, cartes);
    cartes.forEach((c, k) => {
      const el = elCartes.get(c.i);
      el.classList.add(res.parCarte[k] ? 'dfx-carte--juste' : 'dfx-carte--fausse');
      el.setAttribute('aria-disabled', 'true');
      const marque = el.querySelector('.dfx-carte-marque');
      marque.append(icone(res.parCarte[k] ? 'valider' : 'fermer'));
      if (!res.parCarte[k]) {
        const bon = bacs.find((b) => b.id === c.bac);
        el.append(h('span', { class: 'dfx-carte-bon', text: `→ ${bon ? bon.titre : c.bac}` }));
      }
    });
    coque.jouer(res.score >= 0.6 ? 'succes' : 'echec');
    coque.reagir(res.score >= 0.9 ? 'Classement impeccable. Le schéma du RUISSS n’a plus de secrets pour toi.' : res.score >= 0.6 ? 'Pas mal ! Regarde quand même les cartes en rouge.' : 'Aïe. Les frontières entre secteurs sont plus subtiles qu’elles en ont l’air.',
      { humeur: res.score >= 0.9 ? 'ravi' : res.score >= 0.6 ? 'content' : 'surpris', force: true });
    coque.setStatut(`${res.justes} sur ${res.total} cartes au bon endroit.`);
    coque.viderActions();
    coque.bouton('Voir le bilan', { primaire: true, ico: 'droite', surClic: () => finir(res) }).focus();
  }

  function finir(res) {
    coque.terminer({
      score: res.score,
      details: { justes: res.justes, total: res.total, placements: cartes.map((c) => ({ carte: c.texte, bac: place[c.i], attendu: c.bac })) },
    }, (zone) => {
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Carte par carte' }));
      const liste = h('ul', { class: 'dfx-liste-correction' });
      const ordreAff = cartes.slice().sort((a, b) => Number(res.parCarte[a.i]) - Number(res.parCarte[b.i]));
      for (const c of ordreAff) {
        const ok = res.parCarte[c.i];
        const donne = bacs.find((b) => b.id === place[c.i]);
        const bon = bacs.find((b) => b.id === c.bac);
        liste.append(h('li', { class: `dfx-ligne-correction ${ok ? 'dfx-ok' : 'dfx-ko'}` },
          h('span', { class: 'dfx-ligne-ico' }, icone(ok ? 'valider' : 'fermer')),
          h('div', {},
            h('p', { class: 'dfx-ligne-titre', text: c.texte }),
            h('p', { class: 'dfx-ligne-meta', text: ok ? `Bac : ${bon?.titre ?? c.bac}` : `Ton choix : ${donne?.titre ?? 'aucun'} · Bon bac : ${bon?.titre ?? c.bac}` }),
            c.explication ? h('p', { class: 'dfx-ligne-explication', text: c.explication }) : null)));
      }
      zone.append(liste);
    });
  }

  return {
    surTempsEcoule() {
      if (!valide) {
        valider();
        finir(scoreTri(place, cartes));
      }
    },
  };
}
