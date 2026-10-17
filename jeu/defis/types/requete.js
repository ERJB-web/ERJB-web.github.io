import { h, icone, vider, pct, nombre, compteurAnime, attendre } from '../noyau.js?v=63f5f7cb13';
import { analyserTerme, evaluerEquation, equationLignes, scoreRequete, termesTrouves, normaliser, vrai, listeMotsCles, modeRequete } from '../calculs.js?v=63f5f7cb13';

const MOTS_VIDES = new Set(['a', 'au', 'aux', 'avec', 'chez', 'd', 'dans', 'de', 'des', 'du', 'en', 'et', 'l', 'la', 'le', 'les', 'ou', 'par', 'pour', 'sur', 'un', 'une', 'plus', 'moins']);

export function estTronque(texte) {
  return /\*/.test(texte);
}

export function basculerTroncature(texte) {
  const q = /^"(.*)"$/s.exec(texte.trim());
  const coeur = q ? q[1] : texte.trim();
  let nouveau;
  if (estTronque(coeur)) nouveau = coeur.replace(/\*/g, '');
  else {
    nouveau = coeur.split(/(\s+)/).map((m) => {
      if (/^\s+$/.test(m) || !m) return m;
      const n = normaliser(m).replace(/[^a-z0-9]/g, '');
      if (n.length < 3 || MOTS_VIDES.has(n) || /^\d+$/.test(n)) return m;
      return `${m}*`;
    }).join('');
  }
  return q ? `"${nouveau}"` : nouveau;
}

export function basculerGuillemets(texte) {
  const t = texte.trim();
  const q = /^"(.*)"$/s.exec(t);
  return q ? q[1] : `"${t.replace(/"/g, '')}"`;
}

function permetExclusion(operateurs) {
  const liste = Array.isArray(operateurs) ? operateurs : typeof operateurs === 'string' ? operateurs.split(/[,;\s]+/) : [];
  return liste.some((o) => ['sauf', 'not', 'non', 'et non', 'and not', 'sans'].includes(normaliser(o).trim()));
}

export function rendre(def, coque) {
  const corpus = Array.isArray(def.corpus) ? def.corpus : [];
  const cibles = {
    rappel: Number(def.cibleRappel) > 0 ? Number(def.cibleRappel) : 0.8,
    precision: Number(def.ciblePrecision) > 0 ? Number(def.ciblePrecision) : 0.5,
  };
  const maxEssais = Number(def.essais) > 0 ? Math.round(Number(def.essais)) : 6;
  const mode = modeRequete(def.concepts, corpus);
  const exact = mode === 'exact';
  const exclusionPermise = permetExclusion(def.operateurs) && !exact;
  const champ = exact ? '' : 'TITLE-ABS-KEY';
  let idTerme = 0;

  const blocs = (Array.isArray(def.concepts) ? def.concepts : []).map((c, k) => ({
    id: String(c.id ?? `bloc${k + 1}`),
    nom: String(c.nom ?? c.id ?? `Concept ${k + 1}`),
    actif: true,
    exclusion: false,
    termes: (Array.isArray(c.termes) ? c.termes : []).map((t) => {
      const brut = typeof t === 'string' ? t : String(t.t ?? t.texte ?? '');
      return {
        id: ++idTerme, original: brut, texte: brut, coche: false, suggere: true,
        pertinent: typeof t === 'object' && t.pertinent != null ? vrai(t.pertinent) : null,
        sens: typeof t === 'object' && t.sens ? String(t.sens) : '',
        explication: typeof t === 'object' && t.explication ? String(t.explication) : '',
      };
    }),
  }));
  if (exclusionPermise) blocs.push({ id: '__sauf', nom: 'Exclure (SAUF)', actif: true, exclusion: true, termes: [] });

  const essais = [];
  let modifieDepuis = true;
  let enCours = false;
  let fini = false;

  // ---------------------------------------------------------------- constructeur
  const constructeur = h('div', { class: 'dfx-req-constructeur' });
  const elBlocs = blocs.map((b, k) => {
    const corpsBloc = h('div', { class: 'dfx-req-termes', role: 'group', 'aria-label': `Termes du bloc ${b.nom}` });
    const saisie = h('input', { class: 'dfx-req-saisie', type: 'text', placeholder: b.exclusion ? 'Terme à exclure, ex. enfant*' : 'Ajouter un terme, ex. "proche aidant*"', 'aria-label': `Ajouter un terme au bloc ${b.nom}`, maxlength: '60', spellcheck: 'false' });
    const ajouter = h('button', { class: 'dfx-btn dfx-btn--discret dfx-btn--petit', type: 'button' }, icone('plus'), h('span', { text: 'Ajouter' }));
    const interrupteur = h('button', { class: 'dfx-interrupteur', type: 'button', role: 'switch', 'aria-checked': 'true', title: 'Inclure ce bloc dans l’équation' }, h('span', { class: 'dfx-sr', text: `Bloc ${b.nom} actif` }));
    const compteBloc = h('span', { class: 'dfx-req-compte-bloc', hidden: true });
    const el = h('section', { class: `dfx-req-bloc${b.exclusion ? ' dfx-req-bloc--sauf' : ''}`, 'aria-label': b.nom },
      h('header', { class: 'dfx-req-bloc-tete' },
        h('span', { class: 'dfx-req-bloc-num', brut: b.exclusion ? 'SAUF' : `#${k + 1}` }),
        h('h3', { class: 'dfx-req-bloc-nom', text: b.nom }),
        compteBloc,
        interrupteur),
      h('p', { class: 'dfx-req-bloc-aide', text: b.exclusion ? 'Les notices qui contiennent un de ces termes seront retirées. À manier avec prudence.' : 'Termes reliés par OU : une notice est retenue si elle contient au moins un terme coché.' }),
      corpsBloc,
      exact ? null : h('form', { class: 'dfx-req-ajout', on: { submit: (e) => { e.preventDefault(); ajouterTerme(b, saisie.value); saisie.value = ''; saisie.focus(); } } }, saisie, ajouter));
    ajouter.type = 'submit';
    interrupteur.addEventListener('click', () => {
      b.actif = !b.actif;
      interrupteur.setAttribute('aria-checked', String(b.actif));
      el.classList.toggle('dfx-req-bloc--inactif', !b.actif);
      coque.jouer('clic');
      changement();
    });
    return { b, el, corpsBloc, compteBloc };
  });
  elBlocs.forEach((x, k) => {
    if (k > 0) constructeur.append(h('div', { class: `dfx-req-operateur${x.b.exclusion ? ' dfx-req-operateur--sauf' : ''}`, 'aria-hidden': 'true' }, h('span', { brut: x.b.exclusion ? 'SAUF' : 'ET' })));
    constructeur.append(x.el);
    rendreTermes(x);
  });

  function rendreTermes(x) {
    vider(x.corpsBloc);
    x.b.termes.forEach((t, k) => {
      if (k > 0) x.corpsBloc.append(h('span', { class: 'dfx-req-ou', 'aria-hidden': 'true', brut: 'OU' }));
      x.corpsBloc.append(puce(x, t));
    });
    if (!x.b.termes.length) x.corpsBloc.append(h('p', { class: 'dfx-req-vide', text: 'Aucun terme pour l’instant.' }));
  }

  function puce(x, t) {
    const analyse = analyserTerme(t.texte);
    const multi = analyse.mots.length > 1 || analyse.expression;
    const principal = h('button', { class: 'dfx-puce-terme', type: 'button', role: 'checkbox', 'aria-checked': String(t.coche), title: t.sens || (t.coche ? 'Retirer ce terme de l’équation' : 'Ajouter ce terme à l’équation') },
      h('span', { class: 'dfx-puce-case', 'aria-hidden': 'true' }, icone('valider')),
      h('span', { class: 'dfx-puce-libelle' },
        h('span', { class: 'dfx-puce-texte' }, ...texteColore(t.texte)),
        t.sens ? h('span', { class: 'dfx-puce-sens', text: t.sens }) : null));
    principal.addEventListener('click', () => { t.coche = !t.coche; coque.jouer('clic'); rafraichir(x, t); });
    const tronc = h('button', { class: 'dfx-puce-mini', type: 'button', 'aria-pressed': String(estTronque(t.texte)), title: 'Troncature (*) : retrouve aussi les pluriels et les variantes' }, h('span', { 'aria-hidden': 'true', brut: '*' }), h('span', { class: 'dfx-sr', text: `Troncature pour ${t.texte}` }));
    tronc.addEventListener('click', () => { t.texte = basculerTroncature(t.texte); t.coche = true; coque.jouer('clic'); rafraichir(x, t, '.dfx-puce-mini'); });
    const guil = h('button', { class: 'dfx-puce-mini', type: 'button', 'aria-pressed': String(analyse.expression), title: 'Guillemets : expression exacte, mots consécutifs', disabled: !multi }, h('span', { 'aria-hidden': 'true', brut: '“ ”' }), h('span', { class: 'dfx-sr', text: `Expression exacte pour ${t.texte}` }));
    guil.addEventListener('click', () => { t.texte = basculerGuillemets(t.texte); t.coche = true; coque.jouer('clic'); rafraichir(x, t, '.dfx-puce-mini + .dfx-puce-mini'); });
    const enfants = exact ? [principal] : [principal, h('span', { class: 'dfx-puce-outils' }, tronc, guil)];
    if (!t.suggere) {
      const suppr = h('button', { class: 'dfx-puce-mini dfx-puce-mini--suppr', type: 'button', title: 'Supprimer ce terme' }, icone('fermer'), h('span', { class: 'dfx-sr', text: `Supprimer ${t.texte}` }));
      suppr.addEventListener('click', () => {
        x.b.termes = x.b.termes.filter((u) => u !== t);
        coque.jouer('clic');
        rendreTermes(x);
        changement();
      });
      enfants[1].append(suppr);
    }
    return h('span', { class: `dfx-puce${t.coche ? ' dfx-puce--coche' : ''}${t.suggere ? '' : ' dfx-puce--ajoutee'}`, dataset: { t: String(t.id) } }, enfants);
  }

  function rafraichir(x, t, focusSel) {
    const ancien = x.corpsBloc.querySelector(`[data-t="${t.id}"]`);
    const nouveau = puce(x, t);
    ancien.replaceWith(nouveau);
    (focusSel ? nouveau.querySelector(focusSel) : nouveau.querySelector('.dfx-puce-terme'))?.focus();
    changement();
  }

  function ajouterTerme(b, valeur) {
    const v = String(valeur || '').trim().replace(/\s+/g, ' ');
    const x = elBlocs.find((e) => e.b === b);
    if (!analyserTerme(v).valide) { coque.setStatut('Ce terme est vide.'); return; }
    if (b.termes.some((t) => normaliser(t.texte) === normaliser(v))) {
      const t = b.termes.find((u) => normaliser(u.texte) === normaliser(v));
      t.coche = true;
      rendreTermes(x);
      changement();
      return;
    }
    b.termes.push({ id: ++idTerme, original: v, texte: v, coche: true, suggere: false, pertinent: null });
    coque.jouer('clic');
    rendreTermes(x);
    changement();
    coque.annoncer(`Terme ajouté : ${v}`);
  }

  // ---------------------------------------------------------------- aperçu
  const apercu = h('pre', { class: 'dfx-req-syntaxe', 'aria-label': 'Équation en syntaxe de base de données' });
  const zoneApercu = h('section', { class: 'dfx-req-apercu' },
    h('div', { class: 'dfx-req-apercu-tete' },
      h('p', { class: 'dfx-surtitre', text: 'Historique de recherche' }),
      h('p', { class: 'dfx-req-champs', text: exact ? 'Champs : titre, résumé, descripteurs' : 'Champs : titre, résumé, mots-clés' })),
    apercu);

  const nbResultats = h('strong', { class: 'dfx-req-nb', brut: '—' });
  const jaugeR = jauge('Rappel', cibles.rappel);
  const jaugeP = jauge('Précision', cibles.precision);
  const balayage = h('div', { class: 'dfx-req-balayage', hidden: true }, h('span'), h('p', { text: 'Interrogation de la base…' }));
  const listeRes = h('ol', { class: 'dfx-req-liste' });
  const historique = h('table', { class: 'dfx-req-historique', hidden: true },
    h('thead', {}, h('tr', {}, h('th', { text: 'Essai' }), h('th', { text: 'Notices' }), h('th', { text: 'Rappel' }), h('th', { text: 'Précision' }))),
    h('tbody'));
  const zoneRes = h('section', { class: 'dfx-req-resultats', 'aria-live': 'polite' },
    h('div', { class: 'dfx-req-tableau' },
      h('div', { class: 'dfx-req-total' }, nbResultats, h('span', { text: `notice(s) sur ${corpus.length}` })),
      jaugeR.el, jaugeP.el),
    balayage,
    historique,
    h('p', { class: 'dfx-surtitre dfx-req-liste-titre', text: 'Notices retrouvées' }),
    listeRes);
  listeRes.append(h('li', { class: 'dfx-req-attente', text: 'Lance une première recherche pour voir les notices retrouvées.' }));

  coque.corps.append(h('div', { class: 'dfx-requete' },
    constructeur,
    h('div', { class: 'dfx-req-droite' }, zoneApercu, zoneRes)));

  const btnLancer = coque.bouton('Lancer la recherche', { primaire: true, ico: 'recherche', surClic: lancer });
  const btnSoumettre = coque.bouton('Soumettre l’équation', { ico: 'valider', desactive: true, surClic: soumettre });
  coque.setCompteur(`Essai 0 / ${maxEssais}`);
  majApercu();
  coque.setStatut('Coche des termes, ajuste-les, puis lance la recherche.');

  function jauge(nom, cible) {
    const barre = h('span', { class: 'dfx-jauge-remplie' });
    const valeur = h('strong', { brut: '—' });
    const el = h('div', { class: 'dfx-jauge' },
      h('div', { class: 'dfx-jauge-tete' }, h('span', { text: nom }), valeur),
      h('div', { class: 'dfx-jauge-piste', role: 'img', 'aria-label': `${nom}, cible ${pct(cible)}` },
        barre,
        h('span', { class: 'dfx-jauge-cible', style: { left: `${cible * 100}%` }, title: `Cible : ${pct(cible)}` })),
      h('p', { class: 'dfx-jauge-legende', text: `Cible : ${pct(cible)}` }));
    return {
      el,
      maj(v) {
        barre.style.width = `${Math.round(v * 100)}%`;
        el.classList.toggle('dfx-jauge--atteinte', v >= cible - 1e-9);
        compteurAnime(valeur, 0, v, { calme: coque.calme, format: (x) => pct(x) });
      },
    };
  }

  function blocsPourCalcul() {
    return blocs.map((b) => ({ id: b.id, nom: b.nom, actif: b.actif, exclusion: b.exclusion, termes: b.termes.filter((t) => t.coche).map((t) => t.texte) }));
  }

  function changement() {
    modifieDepuis = true;
    majApercu();
    if (essais.length) coque.setStatut('L’équation a changé. Relance la recherche pour voir l’effet.');
  }

  function majApercu() {
    vider(apercu);
    const { lignes, combinaison } = equationLignes(blocsPourCalcul());
    if (!lignes.length) {
      apercu.append(h('span', { class: 'dfx-syn-vide', text: 'Coche au moins un terme pour composer l’équation.' }));
      return;
    }
    for (const l of lignes) {
      const ligne = h('span', { class: `dfx-syn-ligne${l.exclusion ? ' dfx-syn-ligne--sauf' : ''}` },
        h('span', { class: 'dfx-syn-num', brut: `${l.num}` }),
        champ ? h('span', { class: 'dfx-syn-champ', brut: champ }) : null, champ ? ' ( ' : '( ');
      l.termes.forEach((t, k) => {
        if (k > 0) ligne.append(h('span', { class: 'dfx-syn-op', brut: ' OR ' }));
        ligne.append(...texteColore(t));
      });
      ligne.append(' )');
      apercu.append(ligne, '\n');
    }
    if (combinaison) {
      const c = h('span', { class: 'dfx-syn-ligne dfx-syn-ligne--comb' }, h('span', { class: 'dfx-syn-num', brut: `${combinaison.num}` }));
      combinaison.texte.split(/(AND NOT|AND)/).forEach((m) => {
        if (m === 'AND' || m === 'AND NOT') c.append(h('span', { class: 'dfx-syn-op', brut: m }));
        else c.append(h('span', { class: 'dfx-syn-ref', brut: m }));
      });
      apercu.append(c);
    }
  }

  async function lancer() {
    if (enCours || fini) return;
    const blocsCalc = blocsPourCalcul();
    const res = evaluerEquation(blocsCalc, corpus, mode);
    if (!res.valide) {
      coque.setStatut('Coche au moins un terme dans un bloc actif.');
      coque.reagir('Une recherche sans terme ? Même la bibliothécaire n’a jamais vu ça.', { humeur: 'surpris' });
      return;
    }
    if (essais.length >= maxEssais) return;
    enCours = true;
    btnLancer.disabled = true;
    balayage.hidden = false;
    if (!coque.calme) await attendre(650);
    balayage.hidden = true;
    enCours = false;
    const essai = { ...res, equation: equationLignes(blocsCalc), blocs: blocsCalc };
    essais.push(essai);
    modifieDepuis = false;
    afficherResultats(essai);
    coque.setCompteur(`Essai ${essais.length} / ${maxEssais}`);
    btnSoumettre.disabled = false;
    btnLancer.disabled = essais.length >= maxEssais;
    const atteint = res.rappel >= cibles.rappel - 1e-9 && res.precision >= cibles.precision - 1e-9;
    btnSoumettre.classList.toggle('dfx-btn--succes', atteint);
    btnSoumettre.classList.toggle('dfx-btn--primaire', atteint);
    btnLancer.classList.toggle('dfx-btn--primaire', !atteint);
    if (essais.length >= maxEssais) coque.setStatut('Dernier essai utilisé : soumets ton équation.');
    else coque.setStatut(atteint ? 'Cibles atteintes ! Tu peux soumettre, ou peaufiner.' : `Il te reste ${maxEssais - essais.length} essai${maxEssais - essais.length > 1 ? 's' : ''}.`);
    quip(res, atteint);
  }

  function quip(res, atteint) {
    const n = res.resultats.length;
    if (n === 0) coque.reagir('Zéro résultat. C’est une revue de portée ou une revue du vide ?', { humeur: 'surpris', qui: 'bibliothecaire', force: true });
    else if (n >= corpus.length * 0.75) coque.reagir('Tu as retrouvé presque toute la base. Tu cherches quelque chose en particulier ?', { humeur: 'sceptique', qui: 'bibliothecaire', force: true });
    else if (atteint) coque.reagir('Rappel et précision au rendez-vous. Je l’encadrerais.', { humeur: 'ravi', qui: 'bibliothecaire', force: true });
    else if (res.rappel >= cibles.rappel && res.precision < cibles.precision) coque.reagir('Beaucoup de bruit. Regarde les titres : lesquels n’ont rien à faire là ?', { humeur: 'neutre', qui: 'bibliothecaire', force: true });
    else if (res.rappel < cibles.rappel) coque.reagir(exact ? 'Il manque des études. Pense aux synonymes et aux descripteurs.' : 'Il manque des études. Pense aux pluriels, au féminin et aux synonymes.', { humeur: 'neutre', qui: 'bibliothecaire', force: true });
  }

  function afficherResultats(e) {
    compteurAnime(nbResultats, 0, e.resultats.length, { calme: coque.calme });
    jaugeR.maj(e.rappel);
    jaugeP.maj(e.precision);
    elBlocs.forEach((x) => {
      const pb = e.parBloc.find((p) => p.id === x.b.id);
      x.compteBloc.hidden = !pb;
      if (pb) x.compteBloc.textContent = `${pb.nb} notice${pb.nb > 1 ? 's' : ''}`;
    });
    historique.hidden = false;
    const tb = historique.querySelector('tbody');
    tb.append(h('tr', { class: e.rappel >= cibles.rappel && e.precision >= cibles.precision ? 'dfx-req-hist--ok' : '' },
      h('td', { brut: `${essais.length}` }),
      h('td', { brut: `${e.resultats.length}` }),
      h('td', { brut: pct(e.rappel) }),
      h('td', { brut: pct(e.precision) })));
    vider(listeRes);
    if (!e.resultats.length) listeRes.append(h('li', { class: 'dfx-req-attente', text: 'Aucune notice ne correspond à cette équation.' }));
    e.resultats.forEach((i, k) => {
      const d = corpus[i];
      const trouves = termesTrouves(e.blocs, d, mode);
      const li = h('li', { class: 'dfx-req-notice', style: { '--dfx-delai': `${Math.min(k, 14) * 28}ms` } },
        h('p', { class: 'dfx-req-notice-titre' }, ...(exact ? [String(d.titre ?? '')] : surligner(String(d.titre ?? ''), trouves))),
        exact
          ? h('p', { class: 'dfx-req-notice-mc' }, [...new Set(trouves.map((x) => x.terme))].map((x) => h('span', { class: 'dfx-req-tag', brut: x })))
          : h('p', { class: 'dfx-req-notice-mc', text: listeMotsCles(d.motsCles).join(' · ') }));
      listeRes.append(li);
    });
  }

  function soumettre() {
    if (fini || !essais.length) return;
    fini = true;
    btnLancer.disabled = true;
    btnSoumettre.disabled = true;
    const dernier = essais[essais.length - 1];
    const sc = scoreRequete(dernier, cibles, essais.length);
    coque.terminer({
      score: sc.score,
      reussi: sc.reussi,
      details: {
        essais: essais.length,
        resultats: dernier.resultats.length,
        rappel: dernier.rappel,
        precision: dernier.precision,
        equation: [...dernier.equation.lignes.map((l) => (champ ? `${champ} ( ${l.termes.join(' OR ')} )` : `( ${l.termes.join(' OR ')} )`)), dernier.equation.combinaison?.texte].filter(Boolean),
      },
    }, (zone) => correction(zone, dernier, sc), {
      sousVerdict: `Rappel ${pct(dernier.rappel)} · précision ${pct(dernier.precision)} · ${essais.length} essai${essais.length > 1 ? 's' : ''}`,
    });
  }

  function correction(zone, dernier, sc) {
    zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Ton équation soumise' }));
    const pre = h('pre', { class: 'dfx-req-syntaxe dfx-req-syntaxe--bilan' });
    dernier.equation.lignes.forEach((l) => {
      const ligne = h('span', { class: `dfx-syn-ligne${l.exclusion ? ' dfx-syn-ligne--sauf' : ''}` }, h('span', { class: 'dfx-syn-num', brut: `${l.num}` }), champ ? h('span', { class: 'dfx-syn-champ', brut: champ }) : null, champ ? ' ( ' : '( ');
      l.termes.forEach((t, k) => { if (k) ligne.append(h('span', { class: 'dfx-syn-op', brut: ' OR ' })); ligne.append(...texteColore(t)); });
      ligne.append(' )');
      pre.append(ligne, '\n');
    });
    if (dernier.equation.combinaison) pre.append(h('span', { class: 'dfx-syn-ligne dfx-syn-ligne--comb' }, h('span', { class: 'dfx-syn-num', brut: `${dernier.equation.combinaison.num}` }), h('span', { class: 'dfx-syn-ref', brut: dernier.equation.combinaison.texte })));
    zone.append(pre);
    if (sc.facteur < 1) zone.append(h('p', { class: 'dfx-note', text: `Chaque essai au-delà du deuxième coûte un peu : facteur appliqué ${nombre(sc.facteur, 2)}.` }));

    zone.append(h('h4', { class: 'dfx-correction-titre', text: 'Les termes proposés' }));
    const grille = h('div', { class: 'dfx-req-bilan-termes' });
    for (const b of blocs) {
      if (!b.termes.length) continue;
      grille.append(h('div', { class: 'dfx-req-bilan-bloc' },
        h('p', { class: 'dfx-req-bilan-nom', text: b.nom }),
        h('ul', {}, b.termes.map((t) => {
          const statut = t.pertinent == null ? 'ajouté' : t.pertinent ? 'utile' : 'source de bruit';
          return h('li', { class: `dfx-req-bilan-terme ${t.pertinent == null ? '' : t.pertinent ? 'dfx-ok' : 'dfx-ko'}${t.coche ? ' dfx-req-bilan-terme--utilise' : ''}`, title: t.coche ? 'Dans ton équation' : 'Absent de ton équation' },
            h('span', { class: 'dfx-req-bilan-coche', 'aria-hidden': 'true' }, t.coche ? icone('valider') : null),
            h('code', { brut: t.texte }),
            h('span', { class: 'dfx-etiquette', text: statut }),
            h('span', { class: 'dfx-sr', text: t.coche ? 'dans ton équation' : 'absent de ton équation' }),
            t.explication ? h('span', { class: 'dfx-req-bilan-expl', text: t.explication }) : null);
        }))));
    }
    zone.append(grille);
    zone.append(h('p', { class: 'dfx-aide', text: 'Les termes cochés figuraient dans ton équation soumise.' }));

    const manques = corpus.map((d, i) => ({ d, i })).filter((x) => vrai(x.d.pertinent) && !dernier.resultats.includes(x.i));
    const bruit = dernier.resultats.filter((i) => !vrai(corpus[i].pertinent));
    if (manques.length) {
      zone.append(h('h4', { class: 'dfx-correction-titre', text: `Études pertinentes manquées (${manques.length})` }));
      zone.append(h('ul', { class: 'dfx-liste-simple' }, manques.map((x) => h('li', { class: 'dfx-ko' }, h('span', { text: x.d.titre }), x.d.note ? h('span', { class: 'dfx-liste-note', text: x.d.note }) : null))));
    }
    if (bruit.length) {
      zone.append(h('h4', { class: 'dfx-correction-titre', text: `Bruit retenu (${bruit.length})` }));
      zone.append(h('ul', { class: 'dfx-liste-simple' }, bruit.map((i) => h('li', { class: 'dfx-neutre' }, h('span', { text: corpus[i].titre }), corpus[i].note ? h('span', { class: 'dfx-liste-note', text: corpus[i].note }) : null))));
    }
  }

  return {
    async surTempsEcoule() {
      if (fini) return;
      if (!essais.length) {
        const res = evaluerEquation(blocsPourCalcul(), corpus, mode);
        const blocsCalc = blocsPourCalcul();
        essais.push({ ...res, equation: equationLignes(blocsCalc), blocs: blocsCalc });
      }
      soumettre();
    },
  };
}

export function texteColore(t) {
  const out = [];
  const m = /^"(.*)"$/s.exec(t.trim());
  const coeur = m ? m[1] : t.trim();
  if (m) out.push(h('span', { class: 'dfx-syn-guil', brut: '"' }));
  coeur.split(/(\*)/).forEach((p) => {
    if (p === '*') out.push(h('span', { class: 'dfx-syn-tronc', brut: '*' }));
    else if (p) out.push(h('span', { class: 'dfx-syn-terme', brut: p }));
  });
  if (m) out.push(h('span', { class: 'dfx-syn-guil', brut: '"' }));
  return out;
}

function surligner(texte, trouves) {
  const mots = trouves.flatMap((x) => x.analyse.mots);
  if (!mots.length) return [texte];
  const out = [];
  let dernier = 0;
  const re = /[\p{L}\p{N}]+/gu;
  let m;
  while ((m = re.exec(texte))) {
    const n = normaliser(m[0]);
    const touche = mots.some((w) => (w.troncature ? n.startsWith(w.racine) : n === w.racine)) && !MOTS_VIDES.has(n);
    if (touche) {
      if (m.index > dernier) out.push(texte.slice(dernier, m.index));
      out.push(h('mark', { brut: m[0] }));
      dernier = m.index + m[0].length;
    }
  }
  if (dernier < texte.length) out.push(texte.slice(dernier));
  return out;
}

