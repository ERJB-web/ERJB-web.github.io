import { h, icone, glisser, memoriserPositions, animerDepuis, defilerPres } from '../noyau.js?v=20134ff5c3';
import { melanger, concordancePaires, scoreOrdre, positionsAttendues } from '../calculs.js?v=20134ff5c3';

export function rendre(def, coque) {
  const elements = (Array.isArray(def.elements) ? def.elements : []).map((e, i) => ({ i, texte: String(e.texte ?? ''), rang: Number(e.rang) }));
  let ordre = elements.map((e) => e.i);
  for (let essai = 0; essai < 60; essai++) {
    ordre = melanger(elements.map((e) => e.i), coque.alea);
    if (elements.length < 3 || concordancePaires(ordre.map((i) => elements[i].rang)) <= 0.6) break;
  }
  let saisi = null;
  let valide = false;

  const liste = h('ol', { class: 'dfx-ordre-liste', 'aria-label': 'Étapes à ordonner' });
  const elLignes = new Map();
  for (const i of ordre) {
    const e = elements[i];
    const haut = h('button', { class: 'dfx-btn-ico dfx-btn-ico--petit', type: 'button', title: 'Monter' }, icone('haut'), h('span', { class: 'dfx-sr', text: 'Monter' }));
    const bas = h('button', { class: 'dfx-btn-ico dfx-btn-ico--petit', type: 'button', title: 'Descendre' }, icone('bas'), h('span', { class: 'dfx-sr', text: 'Descendre' }));
    const li = h('li', { class: 'dfx-ordre-item', tabindex: '0', dataset: { i: String(i) }, 'aria-roledescription': 'élément déplaçable' },
      h('span', { class: 'dfx-ordre-poignee', 'aria-hidden': 'true' }, icone('poignee')),
      h('span', { class: 'dfx-ordre-pos', 'aria-hidden': 'true' }),
      h('span', { class: 'dfx-ordre-texte', text: e.texte }),
      h('span', { class: 'dfx-ordre-verdict', 'aria-hidden': 'true' }),
      h('span', { class: 'dfx-ordre-fleches' }, haut, bas));
    haut.addEventListener('click', () => deplacer(i, -1, true));
    bas.addEventListener('click', () => deplacer(i, 1, true));
    li.addEventListener('keydown', (ev) => surTouche(ev, i));
    brancherGlisser(li, i);
    elLignes.set(i, li);
    liste.append(li);
  }

  coque.corps.append(h('div', { class: 'dfx-ordre' },
    h('div', { class: 'dfx-ordre-entete' },
      h('p', { class: 'dfx-surtitre', text: 'Du premier au dernier' }),
      h('p', { class: 'dfx-aide', text: 'Glisse les étapes, ou utilise les flèches. Au clavier : Espace pour saisir, ↑ ↓ pour déplacer, Espace pour déposer.' })),
    liste));
  const btn = coque.bouton('Valider l’ordre', { primaire: true, ico: 'valider', surClic: valider });
  majPositions();

  function majPositions() {
    [...liste.children].forEach((li, k) => {
      li.querySelector('.dfx-ordre-pos').textContent = String(k + 1);
      li.setAttribute('aria-label', `${k + 1}. ${elements[+li.dataset.i].texte}`);
      const [haut, bas] = li.querySelectorAll('.dfx-ordre-fleches button');
      haut.disabled = valide || k === 0;
      bas.disabled = valide || k === liste.children.length - 1;
    });
    coque.setStatut(saisi != null ? 'Étape saisie : ↑ ↓ pour la déplacer, Espace pour la déposer.' : `${elements.length} étapes à ordonner.`);
  }

  function ordreActuel() {
    return [...liste.children].map((li) => +li.dataset.i);
  }

  function deplacer(i, pas, garderFocus) {
    if (valide) return;
    const li = elLignes.get(i);
    const enfants = [...liste.children];
    const k = enfants.indexOf(li);
    const n = k + pas;
    if (n < 0 || n >= enfants.length) return;
    const positions = memoriserPositions(enfants);
    if (pas < 0) liste.insertBefore(li, enfants[n]);
    else liste.insertBefore(li, enfants[n].nextSibling);
    animerDepuis(positions, coque.calme);
    coque.jouer('clic');
    majPositions();
    coque.annoncer(`Position ${n + 1} sur ${enfants.length}.`);
    if (garderFocus) {
      const bouton = li.querySelectorAll('.dfx-ordre-fleches button')[pas < 0 ? 0 : 1];
      (bouton && !bouton.disabled ? bouton : li).focus();
    }
  }

  function surTouche(ev, i) {
    if (valide || ev.target.tagName === 'BUTTON') return;
    const li = elLignes.get(i);
    if (ev.key === ' ' || ev.key === 'Enter') {
      ev.preventDefault();
      saisi = saisi === i ? null : i;
      elLignes.forEach((el, k) => el.classList.toggle('dfx-ordre-item--saisi', k === saisi));
      coque.annoncer(saisi != null ? 'Étape saisie.' : 'Étape déposée.');
      majPositions();
    } else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      const pas = ev.key === 'ArrowUp' ? -1 : 1;
      if (saisi === i || ev.altKey) {
        deplacer(i, pas, false);
        li.focus();
      } else {
        const sib = pas < 0 ? li.previousElementSibling : li.nextElementSibling;
        sib?.focus();
      }
    } else if (ev.key === 'Escape' && saisi != null) {
      ev.preventDefault();
      ev.stopPropagation();
      saisi = null;
      elLignes.forEach((el) => el.classList.remove('dfx-ordre-item--saisi'));
      majPositions();
    }
  }

  function brancherGlisser(li, i) {
    let pointeurY = 0;
    let prise = 0;
    const recaler = () => {
      li.style.transform = '';
      const r = li.getBoundingClientRect();
      li.style.transform = `translateY(${pointeurY - prise - r.top}px)`;
    };
    const detacher = glisser(li, {
      tactile: '.dfx-ordre-poignee',
      ignorer: 'button',
      surDebut(ev) {
        if (valide) return;
        const r = li.getBoundingClientRect();
        prise = ev.clientY - r.top;
        pointeurY = ev.clientY;
        li.classList.add('dfx-ordre-item--glisse');
        coque.racine.classList.add('dfx--glisse');
      },
      surDeplacement(ev) {
        if (valide) return;
        pointeurY = ev.clientY;
        const autres = [...liste.children].filter((x) => x !== li);
        let index = autres.length;
        for (let k = 0; k < autres.length; k++) {
          const r = autres[k].getBoundingClientRect();
          if (ev.clientY < r.top + r.height / 2) { index = k; break; }
        }
        const actuel = [...liste.children].indexOf(li);
        if (index !== actuel) {
          const positions = memoriserPositions(autres);
          liste.insertBefore(li, autres[index] || null);
          animerDepuis(positions, coque.calme, 160);
          majPositions();
        }
        recaler();
        defilerPres(coque.corps, ev.clientY);
      },
      surFin() {
        li.classList.remove('dfx-ordre-item--glisse');
        coque.racine.classList.remove('dfx--glisse');
        const r0 = li.getBoundingClientRect();
        li.style.transform = '';
        const r1 = li.getBoundingClientRect();
        if (!coque.calme) li.animate?.([{ transform: `translateY(${r0.top - r1.top}px)` }, { transform: 'none' }], { duration: 160, easing: 'ease-out' });
        coque.jouer('clic');
        majPositions();
      },
    });
    coque.surNettoyage(detacher);
  }

  function valider() {
    if (valide) return;
    valide = true;
    coque.chrono.arreter();
    btn.disabled = true;
    saisi = null;
    const joueur = ordreActuel();
    const res = scoreOrdre(joueur, elements);
    const attendues = positionsAttendues(elements);
    joueur.forEach((i, pos) => {
      const li = elLignes.get(i);
      li.classList.remove('dfx-ordre-item--saisi');
      const juste = attendues[i] === pos || elements.some((e, k) => k !== i && e.rang === elements[i].rang && attendues[k] === pos);
      li.classList.add(juste ? 'dfx-ordre-item--juste' : 'dfx-ordre-item--faux');
      li.querySelector('.dfx-ordre-verdict').append(juste ? icone('valider') : h('span', { text: `devrait être ${attendues[i] + 1}` }));
    });
    majPositions();
    coque.jouer(res.score >= 0.6 ? 'succes' : 'echec');
    coque.reagir(res.score >= 0.95 ? 'Même PRISMA-ScR n’aurait rien à redire.' : res.score >= 0.7 ? 'Presque ! Quelques étapes ont joué à la chaise musicale.' : 'Hum. Cribler avant de chercher, c’est audacieux.',
      { humeur: res.score >= 0.95 ? 'ravi' : res.score >= 0.7 ? 'content' : 'surpris', force: true });
    coque.setStatut(`${res.exactes} étape${res.exactes > 1 ? 's' : ''} sur ${res.total} à la bonne place.`);
    coque.viderActions();
    coque.bouton('Voir le bilan', { primaire: true, ico: 'droite', surClic: () => finir(joueur, res) }).focus();
  }

  function finir(joueur, res) {
    const attendues = positionsAttendues(elements);
    coque.terminer({
      score: res.score,
      details: { exactes: res.exactes, total: res.total, ordre: joueur.map((i) => elements[i].texte) },
    }, (zone) => {
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'L’ordre attendu' }));
      const ol = h('ol', { class: 'dfx-liste-correction dfx-liste-correction--num' });
      const parRang = elements.slice().sort((a, b) => attendues[a.i] - attendues[b.i]);
      for (const e of parRang) {
        const pos = joueur.indexOf(e.i);
        const ok = pos === attendues[e.i];
        ol.append(h('li', { class: `dfx-ligne-correction ${ok ? 'dfx-ok' : 'dfx-ko'}` },
          h('span', { class: 'dfx-ligne-num', brut: String(attendues[e.i] + 1) }),
          h('div', {},
            h('p', { class: 'dfx-ligne-titre', text: e.texte }),
            h('p', { class: 'dfx-ligne-meta', text: ok ? 'Bien placée' : `Tu l’avais en position ${pos + 1}` }))));
      }
      zone.append(ol);
    });
  }

  return {
    surTempsEcoule() {
      if (!valide) {
        valider();
        finir(ordreActuel(), scoreOrdre(ordreActuel(), elements));
      }
    },
  };
}
