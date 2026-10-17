import { h, s, icone, vider, glisser, elementSous } from '../noyau.js?v=194d6359b9';
import { melanger, scoreCorrespondance, clePaire } from '../calculs.js?v=194d6359b9';

export function rendre(def, coque) {
  const gauche = (Array.isArray(def.gauche) ? def.gauche : []).map((x, i) => ({ id: String(x.id ?? i), texte: String(x.texte ?? x.id ?? '') }));
  const droite = (Array.isArray(def.droite) ? def.droite : []).map((x, i) => ({ id: String(x.id ?? i), texte: String(x.texte ?? x.id ?? '') }));
  const paires = (Array.isArray(def.paires) ? def.paires : [])
    .map((p) => (Array.isArray(p) ? [String(p[0]), String(p[1])] : p && typeof p === 'object' ? [String(p.g ?? p.gauche), String(p.d ?? p.droite)] : null))
    .filter(Boolean);
  const droiteMelangee = melanger(droite, coque.alea);
  const compter = (cote) => {
    const m = new Map();
    for (const [g, d] of paires) { const k = cote === 'g' ? g : d; m.set(k, (m.get(k) || 0) + 1); }
    return Math.max(1, ...m.values());
  };
  const maxG = compter('g');
  const maxD = def.plusieursParCible === true || def.plusieursParCible === 1 ? Infinity : compter('d');
  const explications = def.explications && typeof def.explications === 'object' ? def.explications : {};
  const aide = maxG === 1 && maxD === 1
    ? 'Relie chaque élément de gauche à un seul élément de droite : glisse un trait, ou touche un élément puis un autre. Un nouveau lien remplace l’ancien.'
    : maxG === 1
      ? 'Chaque élément de gauche va vers un seul élément de droite ; un élément de droite peut en recevoir plusieurs. Glisse un trait, ou touche un élément puis un autre.'
      : 'Relie chaque élément de gauche à son ou ses équivalents de droite : glisse un trait, ou touche un élément puis un autre. Touche un trait existant (ou refais la même paire) pour le retirer.';
  const liens = new Map();
  let selection = null;
  let valide = false;

  const colG = h('div', { class: 'dfx-corr-col dfx-corr-col--g', role: 'group', 'aria-label': 'Colonne de gauche' });
  const colD = h('div', { class: 'dfx-corr-col dfx-corr-col--d', role: 'group', 'aria-label': 'Colonne de droite' });
  const svg = s('svg', { class: 'dfx-corr-traits', 'aria-hidden': 'true' });
  const calqueBoutons = h('div', { class: 'dfx-corr-suppr' });
  const titres = def.titreGauche || def.titreDroite ? h('div', { class: 'dfx-corr-titres' },
    h('p', { class: 'dfx-surtitre', text: def.titreGauche || '' }),
    h('p', { class: 'dfx-surtitre', text: def.titreDroite || '' })) : null;
  const plateau = h('div', { class: 'dfx-corr-plateau' }, colG, svg, colD, calqueBoutons);

  const items = new Map();
  function item(x, cote) {
    const badge = h('span', { class: 'dfx-corr-badge', brut: '0' });
    const el = h('button', { class: `dfx-corr-item dfx-corr-item--${cote}`, type: 'button', 'aria-pressed': 'false', dataset: { cote, id: x.id } },
      h('span', { class: 'dfx-corr-texte', text: x.texte }), badge,
      h('span', { class: 'dfx-corr-port', 'aria-hidden': 'true' }));
    el.addEventListener('click', () => cliquer(cote, x.id));
    items.set(`${cote}:${x.id}`, { el, badge, x, cote });
    brancherTrait(el, cote, x.id);
    return el;
  }
  gauche.forEach((x) => colG.append(item(x, 'g')));
  droiteMelangee.forEach((x) => colD.append(item(x, 'd')));

  coque.corps.append(h('div', { class: 'dfx-correspondance' },
    h('p', { class: 'dfx-aide', text: aide }),
    titres, plateau));
  const btn = coque.bouton('Valider les liens', { primaire: true, ico: 'valider', desactive: true, surClic: valider });

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => dessiner()) : null;
  ro?.observe(plateau);
  coque.surNettoyage(() => ro?.disconnect());
  coque.ecouter(window, 'resize', () => dessiner());
  requestAnimationFrame(() => dessiner());
  majStatut();

  coque.surEchap(() => {
    if (!selection) return false;
    choisir(null);
    return true;
  });

  function cliquer(cote, id) {
    if (valide) return;
    if (!selection) { choisir({ cote, id }); return; }
    if (selection.cote === cote) {
      choisir(selection.id === id ? null : { cote, id });
      return;
    }
    const g = cote === 'g' ? id : selection.id;
    const d = cote === 'd' ? id : selection.id;
    basculer(g, d);
    choisir(null);
    items.get(`${cote}:${id}`).el.focus();
  }

  function choisir(sel) {
    selection = sel;
    items.forEach((it, k) => {
      const actif = sel && k === `${sel.cote}:${sel.id}`;
      it.el.classList.toggle('dfx-corr-item--choisi', !!actif);
      it.el.setAttribute('aria-pressed', String(!!actif));
    });
    plateau.classList.toggle('dfx-corr-plateau--choix', !!sel);
    if (sel) {
      coque.jouer('clic');
      coque.setStatut(`« ${items.get(`${sel.cote}:${sel.id}`).x.texte} » : choisis maintenant un élément de l’autre colonne.`);
    } else majStatut();
    dessiner();
  }

  function basculer(g, d) {
    const k = clePaire(g, d);
    if (liens.has(k)) {
      liens.delete(k);
      coque.annoncer('Lien retiré.');
    } else {
      const deG = [...liens.entries()].filter(([, [a]]) => a === g);
      if (deG.length >= maxG) liens.delete(deG[0][0]);
      const deD = [...liens.entries()].filter(([, [, b]]) => b === d);
      if (deD.length >= maxD) liens.delete(deD[0][0]);
      liens.set(k, [g, d]);
      coque.annoncer(`Lien créé : ${gauche.find((x) => x.id === g)?.texte} et ${droite.find((x) => x.id === d)?.texte}.`);
      if (liens.size > Math.max(paires.length * 1.6, paires.length + 3) && !basculer.dit) {
        basculer.dit = true;
        coque.reagir('Un trait de plus et ça devient une toile d’araignée.', { humeur: 'sceptique' });
      }
    }
    coque.jouer('clic');
    majStatut();
    dessiner();
  }

  function majStatut() {
    items.forEach((it) => {
      const n = [...liens.values()].filter(([g, d]) => (it.cote === 'g' ? g : d) === it.x.id).length;
      it.badge.textContent = String(n);
      it.el.classList.toggle('dfx-corr-item--relie', n > 0);
    });
    const sansLien = gauche.filter((x) => ![...liens.values()].some(([g]) => g === x.id)).length;
    btn.disabled = valide || liens.size === 0;
    if (!selection) coque.setStatut(`${liens.size} lien${liens.size > 1 ? 's' : ''} · ${sansLien} élément${sansLien > 1 ? 's' : ''} de gauche sans lien`);
  }

  function port(cote, id) {
    const it = items.get(`${cote}:${id}`);
    const r = it.el.getBoundingClientRect();
    const p = plateau.getBoundingClientRect();
    return { x: (cote === 'g' ? r.right : r.left) - p.left, y: r.top + r.height / 2 - p.top };
  }

  function courbe(a, b) {
    const mx = (a.x + b.x) / 2;
    return `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
  }

  let traitTemp = null;
  let corrige = null;

  function dessiner() {
    const p = plateau.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${p.width} ${p.height}`);
    svg.setAttribute('width', p.width);
    svg.setAttribute('height', p.height);
    vider(svg);
    vider(calqueBoutons);
    const tous = corrige ? corrige : [...liens.values()].map(([g, d]) => ({ g, d, etat: 'normal' }));
    for (const l of tous) {
      if (!items.has(`g:${l.g}`) || !items.has(`d:${l.d}`)) continue;
      const a = port('g', l.g);
      const b = port('d', l.d);
      const actif = selection && ((selection.cote === 'g' && selection.id === l.g) || (selection.cote === 'd' && selection.id === l.d));
      svg.append(s('path', { d: courbe(a, b), class: `dfx-corr-trait dfx-corr-trait--${l.etat}${actif ? ' dfx-corr-trait--actif' : ''}` }));
      if (!valide) {
        const bx = h('button', { class: 'dfx-corr-x', type: 'button', title: 'Retirer ce lien', style: { left: `${(a.x + b.x) / 2}px`, top: `${(a.y + b.y) / 2}px` } }, icone('fermer'), h('span', { class: 'dfx-sr', text: 'Retirer ce lien' }));
        bx.addEventListener('click', () => basculer(l.g, l.d));
        calqueBoutons.append(bx);
      }
    }
    if (traitTemp) svg.append(s('path', { d: courbe(traitTemp.a, traitTemp.b), class: 'dfx-corr-trait dfx-corr-trait--temp' }));
  }

  function brancherTrait(el, cote, id) {
    let survol = null;
    const detacher = glisser(el, {
      tactile: true,
      seuil: 8,
      surDebut() {
        if (valide) return;
        choisir({ cote, id });
        coque.racine.classList.add('dfx--glisse');
      },
      surDeplacement(ev) {
        if (valide) return;
        const p = plateau.getBoundingClientRect();
        const a = port(cote, id);
        traitTemp = cote === 'g' ? { a, b: { x: ev.clientX - p.left, y: ev.clientY - p.top } } : { a: { x: ev.clientX - p.left, y: ev.clientY - p.top }, b: a };
        const cible = elementSous(ev.clientX, ev.clientY, `.dfx-corr-item--${cote === 'g' ? 'd' : 'g'}`);
        if (cible !== survol) {
          survol?.classList.remove('dfx-corr-item--survol');
          survol = cible;
          survol?.classList.add('dfx-corr-item--survol');
        }
        dessiner();
      },
      surFin(ev, etat, annule) {
        coque.racine.classList.remove('dfx--glisse');
        traitTemp = null;
        const cible = survol;
        survol?.classList.remove('dfx-corr-item--survol');
        survol = null;
        if (!annule && cible) {
          const autre = cible.dataset.id;
          basculer(cote === 'g' ? id : autre, cote === 'g' ? autre : id);
        }
        choisir(null);
      },
    });
    coque.surNettoyage(detacher);
  }

  function valider() {
    if (valide) return;
    valide = true;
    coque.chrono.arreter();
    choisir(null);
    btn.disabled = true;
    const donnes = [...liens.values()];
    const res = scoreCorrespondance(donnes, paires);
    const attendu = new Set(paires.map(([g, d]) => clePaire(g, d)));
    corrige = [
      ...donnes.map(([g, d]) => ({ g, d, etat: attendu.has(clePaire(g, d)) ? 'juste' : 'faux' })),
      ...paires.filter(([g, d]) => !liens.has(clePaire(g, d))).map(([g, d]) => ({ g, d, etat: 'manquant' })),
    ];
    plateau.classList.add('dfx-corr-plateau--corrige');
    items.forEach((it) => { it.el.disabled = true; });
    dessiner();
    coque.jouer(res.score >= 0.6 ? 'succes' : 'echec');
    coque.reagir(res.score >= 0.9 ? 'Ta grille parle enfin la même langue que le 211.' : res.score >= 0.6 ? 'Bonne base. Regarde les traits pointillés : il en manque.' : 'Les deux classifications ne se recoupent pas toujours un pour un. Relis la légende.',
      { humeur: res.score >= 0.9 ? 'ravi' : res.score >= 0.6 ? 'content' : 'surpris', force: true });
    coque.setStatut(`${res.vp} lien${res.vp > 1 ? 's' : ''} juste${res.vp > 1 ? 's' : ''} · ${res.fp} en trop · ${res.fn} manquant${res.fn > 1 ? 's' : ''}`);
    plateau.parentElement.insertBefore(h('div', { class: 'dfx-legende-corr' },
      h('span', { class: 'dfx-leg dfx-leg--juste', text: 'Lien juste' }),
      h('span', { class: 'dfx-leg dfx-leg--faux', text: 'Lien en trop' }),
      h('span', { class: 'dfx-leg dfx-leg--manquant', text: 'Lien manquant' })), plateau);
    requestAnimationFrame(() => dessiner());
    coque.viderActions();
    coque.bouton('Voir le bilan', { primaire: true, ico: 'droite', surClic: () => finir(res, donnes) }).focus();
  }

  function finir(res, donnes) {
    coque.terminer({
      score: res.score,
      details: { vp: res.vp, fp: res.fp, fn: res.fn, liens: donnes },
    }, (zone) => {
      zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Les correspondances attendues' }));
      const tab = h('div', { class: 'dfx-corr-bilan' });
      for (const g of gauche) {
        const attendus = paires.filter(([a]) => a === g.id).map(([, d]) => d);
        const donnesG = donnes.filter(([a]) => a === g.id).map(([, d]) => d);
        const tout = [...new Set([...attendus, ...donnesG])];
        tab.append(h('div', { class: 'dfx-corr-bilan-ligne' },
          h('p', { class: 'dfx-corr-bilan-g', text: g.texte }),
          h('ul', {}, tout.length ? tout.map((d) => {
            const x = droite.find((y) => y.id === d);
            const etat = attendus.includes(d) && donnesG.includes(d) ? 'juste' : attendus.includes(d) ? 'manquant' : 'faux';
            return h('li', { class: `dfx-corr-bilan-d dfx-corr-bilan-d--${etat}` },
              icone(etat === 'juste' ? 'valider' : etat === 'faux' ? 'fermer' : 'plus'),
              h('span', { text: x?.texte ?? d }),
              h('span', { class: 'dfx-etiquette', text: etat === 'juste' ? 'trouvé' : etat === 'faux' ? 'en trop' : 'manquant' }));
          }) : h('li', { class: 'dfx-corr-bilan-d', text: 'Aucune correspondance attendue.' })),
          explications[g.id] ? h('p', { class: 'dfx-corr-bilan-expl', text: String(explications[g.id]) }) : null));
      }
      zone.append(tab);
    });
  }

  return {
    surTempsEcoule() {
      if (valide) return;
      if (!liens.size) {
        valide = true;
        const res = scoreCorrespondance([], paires);
        finir(res, []);
        return;
      }
      valider();
      finir(scoreCorrespondance([...liens.values()], paires), [...liens.values()]);
    },
  };
}
