import { h, icone, lettre, pct } from '../noyau.js?v=fa2b8c1a0f';
import { borner, melanger } from '../calculs.js?v=fa2b8c1a0f';

export function paragraphes(texte, cls = '') {
  return String(texte ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => h('p', { class: cls, text: p }));
}

export function verdictOption(c) {
  if (c >= 0.85) return { cle: 'bon', texte: 'Meilleur choix' };
  if (c >= 0.4) return { cle: 'partiel', texte: 'En partie juste' };
  return { cle: 'faible', texte: 'À éviter' };
}

export function rendre(def, coque) {
  const options = (Array.isArray(def.options) ? def.options : []).map((o, i) => ({
    ...o, i, correct: borner(Number(o.correct) || 0), texte: String(o.texte ?? ''),
  }));
  const ordre = melanger(options, coque.alea);
  let choisi = null;
  let verrouille = false;

  const scene = h('div', { class: 'dfx-choix-scene' },
    h('div', { class: 'dfx-choix-embleme', 'aria-hidden': 'true' }, h('span'), h('span'), icone('balance')),
    h('p', { class: 'dfx-surtitre', text: 'La situation' }),
    h('div', { class: 'dfx-choix-situation' }, paragraphes(def.situation || def.consigne || '')));

  const groupe = h('div', { class: 'dfx-choix-options', role: 'radiogroup', 'aria-label': 'Options possibles' });
  const boutons = ordre.map((o, k) => {
    const b = h('button', { class: 'dfx-option', type: 'button', role: 'radio', 'aria-checked': 'false', tabindex: k === 0 ? '0' : '-1' },
      h('span', { class: 'dfx-option-lettre', brut: lettre(k) }),
      h('span', { class: 'dfx-option-texte', text: o.texte }),
      h('span', { class: 'dfx-option-coche', 'aria-hidden': 'true' }, icone('valider')));
    b.addEventListener('click', () => choisir(k, true));
    b.addEventListener('dblclick', () => { choisir(k, true); confirmer(); });
    b.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        const pas = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
        choisir((k + pas + boutons.length) % boutons.length, true);
      }
    });
    groupe.append(b);
    return b;
  });

  const colonne = h('div', { class: 'dfx-choix-colonne' },
    h('p', { class: 'dfx-surtitre', text: 'Que fais-tu ?' }), groupe);
  coque.corps.append(h('div', { class: 'dfx-choix' }, scene, colonne));

  const btn = coque.bouton('Confirmer ce choix', { primaire: true, ico: 'valider', desactive: true, surClic: confirmer });
  coque.setStatut('Choisis une option, puis confirme.');

  coque.surTouche((e) => {
    if (verrouille) return false;
    const k = /^[1-9]$/.test(e.key) ? +e.key - 1 : /^[a-z]$/i.test(e.key) && e.key.length === 1 ? e.key.toUpperCase().charCodeAt(0) - 65 : -1;
    if (k >= 0 && k < boutons.length) { choisir(k, true); return true; }
    if (e.key === 'Enter' && choisi != null && document.activeElement?.classList.contains('dfx-option')) { confirmer(); return true; }
    return false;
  });

  function choisir(k, focus) {
    if (verrouille) return;
    if (choisi !== k) coque.jouer('clic');
    choisi = k;
    boutons.forEach((b, j) => {
      b.setAttribute('aria-checked', String(j === k));
      b.tabIndex = j === k ? 0 : -1;
      b.classList.toggle('dfx-option--choisie', j === k);
    });
    if (focus) boutons[k].focus();
    btn.disabled = false;
    coque.setStatut(`Option ${lettre(k)} retenue. Confirme quand tu es prêt.`);
  }

  function confirmer() {
    if (verrouille || choisi == null) return;
    verrouille = true;
    btn.disabled = true;
    const o = ordre[choisi];
    boutons.forEach((b, j) => b.classList.add(j === choisi ? 'dfx-option--retenue' : 'dfx-option--ecartee'));
    const v = verdictOption(o.correct);
    const repliques = {
      bon: 'Solide. Je n’aurais pas fait mieux… enfin, presque.',
      partiel: 'Défendable. Ta direction va quand même poser des questions.',
      faible: 'Euh… tu es certain ? Je dis ça comme ça.',
    };
    coque.reagir(repliques[v.cle], { humeur: v.cle === 'bon' ? 'ravi' : v.cle === 'partiel' ? 'neutre' : 'surpris', force: true });
    setTimeout(() => {
      coque.terminer({
        score: o.correct,
        details: { option: o.i, lettre: lettre(choisi), texte: o.texte, correct: o.correct, effets: o.effets || null },
      }, (zone) => correction(zone, o), { effetsSupplementaires: o.effets });
    }, coque.calme ? 0 : 900);
  }

  function correction(zone, retenue) {
    zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Ton choix' }));
    zone.append(carteOption(retenue, ordre.indexOf(retenue), true));
    const autres = ordre.filter((o) => o !== retenue);
    if (autres.length) {
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Les autres options' }));
      for (const o of autres) zone.append(carteOption(o, ordre.indexOf(o), false));
    }
  }

  return {
    surTempsEcoule() {
      if (choisi == null) {
        verrouille = true;
        coque.terminer({ score: 0, reussi: false, details: { option: null, tempsEcoule: true } }, (zone) => {
          zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Les options' }));
          ordre.forEach((o, k) => zone.append(carteOption(o, k, false)));
        });
      } else confirmer();
    },
  };
}

function carteOption(o, k, ouverte) {
  const v = verdictOption(o.correct);
  const resume = h('summary', { class: 'dfx-retour-resume' },
    h('span', { class: 'dfx-option-lettre', brut: lettre(k) }),
    h('span', { class: 'dfx-retour-texte', text: o.texte }),
    h('span', { class: `dfx-verdict dfx-verdict--${v.cle}`, text: v.texte }),
    h('span', { class: 'dfx-jauge-mini', title: `Justesse : ${pct(o.correct)}`, 'aria-label': `Justesse : ${pct(o.correct)}` },
      h('span', { style: { width: `${Math.round(o.correct * 100)}%` } })));
  const d = h('details', { class: `dfx-retour dfx-retour--${v.cle}` }, resume,
    h('div', { class: 'dfx-retour-corps' }, paragraphes(o.retour || 'Aucun retour pour cette option.')));
  d.open = ouverte;
  return d;
}
