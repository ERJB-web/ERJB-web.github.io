import { h, icone, vider, glisser } from '../noyau.js?v=daaffb3e30';
import { melanger, scoreCriblage, categorieMotif, normaliserDecision, motifsAcceptes } from '../calculs.js?v=daaffb3e30';

export const chronoManuel = true;

const CRITERES = [
  { cle: 'population', lettre: 'P', nom: 'Population', touche: '1' },
  { cle: 'concept', lettre: 'C', nom: 'Concept', touche: '2' },
  { cle: 'contexte', lettre: 'Co', nom: 'Contexte', touche: '3' },
];

export function rendre(def, coque) {
  const articles = (Array.isArray(def.articles) ? def.articles : []).map((a, i) => ({
    i, titre: String(a.titre ?? ''), resume: String(a.resume ?? ''),
    decision: normaliserDecision(a.decision) || 'exclure', motif: String(a.motif ?? ''),
    motifsAcceptes: Array.isArray(a.motifsAcceptes) ? a.motifsAcceptes : null,
    explication: String(a.explication ?? ''),
  }));
  const ordre = melanger(articles, coque.alea);
  const motifsDef = Array.isArray(def.motifs) ? def.motifs.map(categorieMotif).filter(Boolean) : [];
  const criteres = CRITERES.filter((c) => (def.criteres && def.criteres[c.cle]) || motifsDef.includes(c.cle));
  const decisions = new Array(articles.length).fill(null);
  const temps = Number(def.temps) > 0 ? Number(def.temps) : Math.max(60, 25 * articles.length);
  let k = 0;
  let modeMotif = false;
  let fini = false;
  let debutCarte = performance.now();
  let rapideDit = false;

  const listeCriteres = h('details', { class: 'dfx-crib-criteres' },
    h('summary', { class: 'dfx-surtitre', text: 'Critères d’admissibilité (PCC)' }),
    criteres.map((c) => h('div', { class: `dfx-critere dfx-critere--${c.cle}` },
      h('span', { class: 'dfx-critere-lettre', brut: c.lettre }),
      h('div', {}, h('p', { class: 'dfx-critere-nom', text: c.nom }), def.criteres?.[c.cle] ? h('p', { class: 'dfx-critere-texte', text: def.criteres[c.cle] }) : null))));
  listeCriteres.open = !window.matchMedia?.('(max-width: 720px)').matches;
  const points = h('ol', { class: 'dfx-crib-points', 'aria-hidden': 'true' }, ordre.map(() => h('li')));
  const progression = h('p', { class: 'dfx-crib-prog' });
  const pile = h('div', { class: 'dfx-crib-pile' });
  const zoneDecision = h('div', { class: 'dfx-crib-decision' });

  coque.corps.append(h('div', { class: 'dfx-criblage' },
    h('aside', { class: 'dfx-crib-cote' }, listeCriteres, h('div', { class: 'dfx-crib-suivi' }, progression, points)),
    h('div', { class: 'dfx-crib-centre' }, pile, zoneDecision)));

  coque.chrono.demarrer(temps, { surFin: () => { if (!fini) { coque.reagir('Le temps est écoulé ! Les notices restantes attendront… et compteront comme des erreurs.', { humeur: 'surpris', force: true }); finir(true); } } });
  afficherCarte();

  coque.surTouche((e) => {
    if (fini) return false;
    const t = e.key.toLowerCase();
    if (!modeMotif) {
      if (t === 'i' || e.key === 'ArrowRight') { decider('inclure'); return true; }
      if (t === 'e' || e.key === 'ArrowLeft') { decider('exclure'); return true; }
    } else {
      const c = criteres.find((x) => x.touche === e.key || x.lettre.toLowerCase() === t);
      if (c) { choisirMotif(c.cle); return true; }
    }
    return false;
  });
  coque.surEchap(() => {
    if (!modeMotif) return false;
    modeMotif = false;
    afficherBoutons();
    return true;
  });

  function carteArticle(a, rang, total) {
    const carte = h('article', { class: 'dfx-crib-carte', 'aria-labelledby': `${coque.id}-art-${a.i}` },
      h('div', { class: 'dfx-crib-tampon dfx-crib-tampon--inclure', 'aria-hidden': 'true', text: 'Inclus' }),
      h('div', { class: 'dfx-crib-tampon dfx-crib-tampon--exclure', 'aria-hidden': 'true', text: 'Exclu' }),
      h('p', { class: 'dfx-crib-num', text: `Notice ${rang} sur ${total}` }),
      h('h3', { class: 'dfx-crib-titre', id: `${coque.id}-art-${a.i}`, text: a.titre }),
      h('p', { class: 'dfx-crib-resume', text: a.resume }));
    return carte;
  }

  function afficherCarte() {
    vider(pile);
    progression.textContent = `${Math.min(k + 1, ordre.length)} / ${ordre.length}`;
    [...points.children].forEach((li, j) => {
      li.className = j < k ? 'dfx-crib-point--fait' : j === k ? 'dfx-crib-point--actuel' : '';
    });
    if (k >= ordre.length) return;
    if (k + 1 < ordre.length) pile.append(h('div', { class: 'dfx-crib-carte dfx-crib-carte--dessous', 'aria-hidden': 'true' }));
    const carte = carteArticle(ordre[k], k + 1, ordre.length);
    pile.append(carte);
    brancherBalayage(carte);
    debutCarte = performance.now();
    modeMotif = false;
    afficherBoutons();
  }

  function afficherBoutons() {
    vider(zoneDecision);
    pile.querySelector('.dfx-crib-carte:not(.dfx-crib-carte--dessous)')?.classList.remove('dfx-crib-carte--hesite');
    if (!modeMotif) {
      coque.setStatut('Inclure (I ou →) ou exclure (E ou ←) ? Sur écran tactile, balaie la notice.');
      const exc = h('button', { class: 'dfx-btn dfx-btn--grand dfx-btn--exclure', type: 'button' }, icone('exclure'), h('span', { text: 'Exclure' }), h('kbd', { brut: 'E' }));
      const inc = h('button', { class: 'dfx-btn dfx-btn--grand dfx-btn--inclure', type: 'button' }, icone('inclure'), h('span', { text: 'Inclure' }), h('kbd', { brut: 'I' }));
      exc.addEventListener('click', () => decider('exclure'));
      inc.addEventListener('click', () => decider('inclure'));
      zoneDecision.append(exc, inc);
      inc.focus({ preventScroll: true });
    } else {
      const titre = h('p', { class: 'dfx-crib-motif-titre', text: 'Motif d’exclusion : quel critère n’est pas rempli ?' });
      const boutons = criteres.map((c) => {
        const b = h('button', { class: 'dfx-btn dfx-btn--motif', type: 'button' }, h('span', { class: 'dfx-critere-lettre', brut: c.lettre }), h('span', { text: c.nom }), h('kbd', { brut: c.touche }));
        b.addEventListener('click', () => choisirMotif(c.cle));
        return b;
      });
      const annuler = h('button', { class: 'dfx-btn dfx-btn--discret', type: 'button' }, icone('retour'), h('span', { text: 'Annuler' }));
      annuler.addEventListener('click', () => { modeMotif = false; afficherBoutons(); });
      zoneDecision.append(titre, h('div', { class: 'dfx-crib-motifs' }, boutons, annuler));
      coque.setStatut('Quel critère n’est pas rempli ? Touches 1, 2 ou 3 ; Échap pour annuler.');
      boutons[0]?.focus({ preventScroll: true });
      pile.querySelector('.dfx-crib-carte:not(.dfx-crib-carte--dessous)')?.classList.add('dfx-crib-carte--hesite');
    }
  }

  function decider(d) {
    if (fini || k >= ordre.length) return;
    coque.jouer('clic');
    if (d === 'exclure' && criteres.length) {
      modeMotif = true;
      afficherBoutons();
      return;
    }
    enregistrer({ decision: d, motif: null });
  }

  function choisirMotif(cle) {
    coque.jouer('clic');
    enregistrer({ decision: 'exclure', motif: cle });
  }

  function enregistrer(d) {
    const a = ordre[k];
    decisions[a.i] = { ...d, duree: (performance.now() - debutCarte) / 1000 };
    const vite = decisions[a.i].duree < 2.5 && a.resume.length > 160;
    if (vite && !rapideDit) {
      rapideDit = true;
      coque.reagir('Tu as lu le résumé, ou seulement le titre ?', { humeur: 'sceptique', force: true });
    }
    const carte = pile.querySelector('.dfx-crib-carte:not(.dfx-crib-carte--dessous)');
    k++;
    if (carte && !coque.calme) {
      carte.classList.add(d.decision === 'inclure' ? 'dfx-crib-carte--inclue' : 'dfx-crib-carte--exclue');
      zoneDecision.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      setTimeout(suite, 380);
    } else suite();
  }

  function suite() {
    if (fini) return;
    if (k >= ordre.length) finir(false);
    else afficherCarte();
  }

  function brancherBalayage(carte) {
    const detacher = glisser(carte, {
      seuil: 10,
      surDebut() { carte.classList.add('dfx-crib-carte--glisse'); },
      surDeplacement(ev, etat, dx) {
        carte.style.transform = `translateX(${dx}px) rotate(${dx / 30}deg)`;
        carte.style.setProperty('--dfx-incl', String(Math.max(0, Math.min(1, dx / 120))));
        carte.style.setProperty('--dfx-excl', String(Math.max(0, Math.min(1, -dx / 120))));
      },
      surFin(ev, etat, annule) {
        carte.classList.remove('dfx-crib-carte--glisse');
        const dx = ev.clientX - etat.x0;
        carte.style.setProperty('--dfx-incl', '0');
        carte.style.setProperty('--dfx-excl', '0');
        if (!annule && Math.abs(dx) > 110 && !modeMotif) {
          carte.style.transform = '';
          decider(dx > 0 ? 'inclure' : 'exclure');
        } else carte.style.transform = '';
      },
    });
    coque.surNettoyage(detacher);
  }

  function finir(tempsEcoule) {
    if (fini) return;
    fini = true;
    coque.chrono.arreter();
    const res = scoreCriblage(decisions, articles);
    const utilise = Math.round(coque.chrono.utilise());
    coque.terminer({
      score: res.score,
      details: {
        justes: res.parArticle.filter((p) => p.etat === 'juste').length,
        total: articles.length,
        fauxNegatifs: res.fauxNegatifs,
        fauxPositifs: res.fauxPositifs,
        motifsErrones: res.motifsErrones,
        nonTraites: res.nonTraites,
        tempsEcoule,
        secondes: utilise,
      },
    }, (zone) => correction(zone, res), {
      sousVerdict: `${res.parArticle.filter((p) => p.etat === 'juste').length} décision${res.parArticle.filter((p) => p.etat === 'juste').length > 1 ? 's' : ''} juste${res.parArticle.filter((p) => p.etat === 'juste').length > 1 ? 's' : ''} sur ${articles.length} · ${utilise} s`,
    });
  }

  function correction(zone, res) {
    const stats = h('div', { class: 'dfx-stats' },
      stat('Faux négatifs', res.fauxNegatifs, 'études pertinentes exclues', res.fauxNegatifs > 0),
      stat('Faux positifs', res.fauxPositifs, 'études hors sujet incluses', res.fauxPositifs > 0),
      stat('Motifs erronés', res.motifsErrones, 'bonne exclusion, mauvais critère', res.motifsErrones > 0),
      stat('Non traitées', res.nonTraites, 'faute de temps', res.nonTraites > 0));
    zone.append(stats);
    if (res.fauxNegatifs) zone.append(h('p', { class: 'dfx-note', text: 'Au criblage des titres et résumés, une exclusion à tort coûte plus cher qu’une inclusion à tort : l’étude perdue ne reviendra pas, alors que l’autre sera écartée au texte intégral.' }));
    zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Notice par notice' }));
    const liste = h('ul', { class: 'dfx-liste-correction' });
    const tries = articles.map((a, i) => ({ a, p: res.parArticle[i] }))
      .sort((x, y) => (x.p.etat === 'juste') - (y.p.etat === 'juste'));
    for (const { a, p } of tries) {
      const d = decisions[a.i];
      const ok = p.etat === 'juste';
      const cats = [...motifsAcceptes(a)];
      const nomCat = cats.map((c) => CRITERES.find((x) => x.cle === c)?.nom.toLowerCase()).filter(Boolean).join(' ou ');
      const donne = !d ? 'non traitée' : d.decision === 'inclure' ? 'incluse' : `exclue${d.motif ? ` (${CRITERES.find((c) => c.cle === d.motif)?.nom.toLowerCase()})` : ''}`;
      const attendu = a.decision === 'inclure' ? 'à inclure' : `à exclure${nomCat ? ` (${nomCat})` : ''}`;
      liste.append(h('li', { class: `dfx-ligne-correction ${ok ? 'dfx-ok' : p.etat === 'motif' ? 'dfx-moyen' : 'dfx-ko'}` },
        h('span', { class: 'dfx-ligne-ico' }, icone(ok ? 'valider' : p.etat === 'motif' ? 'info' : 'fermer')),
        h('div', {},
          h('p', { class: 'dfx-ligne-titre', text: a.titre }),
          h('p', { class: 'dfx-ligne-meta', text: `Ta décision : ${donne} · Attendu : ${attendu}` }),
          a.explication || a.motif ? h('p', { class: 'dfx-ligne-explication', text: a.explication || a.motif }) : null)));
    }
    zone.append(liste);
  }

  return {};
}

function stat(titre, n, legende, alerte) {
  return h('div', { class: `dfx-stat${alerte ? ' dfx-stat--alerte' : ''}` },
    h('strong', { brut: String(n) }), h('p', { class: 'dfx-stat-titre', text: titre }), h('p', { class: 'dfx-stat-legende', text: legende }));
}

