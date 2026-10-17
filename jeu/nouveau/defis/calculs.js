// Calculs des défis : fonctions pures, sans DOM.

export function borner(x, min = 0, max = 1) {
  if (!Number.isFinite(x)) return min;
  return Math.min(max, Math.max(min, x));
}

export function vrai(v) {
  if (typeof v === 'string') return v === '1' || v.toLowerCase() === 'true' || v.toLowerCase() === 'oui';
  return v === true || v === 1;
}

export function hacher(s) {
  let h = 2166136261;
  const t = String(s ?? '');
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateur(graine) {
  let a = (graine >>> 0) || 0x9e3779b9;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function melanger(tableau, alea = Math.random) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

// ---------------------------------------------------------------- texte

export function normaliser(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLowerCase();
}

export function tokeniser(s) {
  return normaliser(s).split(/[^a-z0-9]+/).filter(Boolean);
}

export function compterMots(texte) {
  const t = String(texte ?? '').trim();
  if (!t) return 0;
  return t
    .replace(/[«»"“”()]/g, ' ')
    .split(/\s+/)
    .filter((m) => /[\p{L}\p{N}]/u.test(m)).length;
}

export function dureeLecture(mots, motsParMinute = 150) {
  return (mots / motsParMinute) * 60;
}

// ---------------------------------------------------------------- requête

const GUILLEMETS = /^["«“](.*)["»”]$/s;

export function analyserTerme(brut) {
  let texte = String(brut ?? '').trim();
  let expression = false;
  const m = texte.match(GUILLEMETS);
  if (m) {
    expression = true;
    texte = m[1].trim();
  }
  const mots = [];
  for (const morceau of texte.split(/\s+/)) {
    if (!morceau) continue;
    const troncature = /\*$/.test(morceau);
    const toks = tokeniser(morceau.replace(/\*/g, ' '));
    toks.forEach((racine, i) => {
      mots.push({ racine, troncature: troncature && i === toks.length - 1 });
    });
  }
  return { brut: String(brut ?? '').trim(), expression: expression && mots.length > 0, mots, valide: mots.length > 0 };
}

function motCorrespond(mot, jeton) {
  return mot.troncature ? jeton.startsWith(mot.racine) : jeton === mot.racine;
}

export function indexerNotice(doc) {
  const champs = [];
  champs.push(tokeniser(doc?.titre));
  champs.push(tokeniser(doc?.resume));
  for (const mc of listeMotsCles(doc?.motsCles)) champs.push(tokeniser(mc));
  return champs.filter((c) => c.length);
}

export function listeMotsCles(mc) {
  if (Array.isArray(mc)) return mc.map(String);
  if (typeof mc === 'string') return mc.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export function termeCorrespond(terme, champs) {
  const t = typeof terme === 'string' ? analyserTerme(terme) : terme;
  if (!t.valide) return false;
  if (t.expression) {
    const n = t.mots.length;
    for (const champ of champs) {
      for (let i = 0; i + n <= champ.length; i++) {
        let ok = true;
        for (let k = 0; k < n; k++) {
          if (!motCorrespond(t.mots[k], champ[i + k])) { ok = false; break; }
        }
        if (ok) return true;
      }
    }
    return false;
  }
  return t.mots.every((mot) => champs.some((champ) => champ.some((j) => motCorrespond(mot, j))));
}

// blocs : [{ termes: [brut], actif, exclusion }]
export function evaluerEquation(blocs, corpus) {
  const index = corpus.map(indexerNotice);
  const utiles = blocs
    .filter((b) => b && b.actif !== false)
    .map((b) => ({ ...b, analyses: (b.termes || []).map(analyserTerme).filter((t) => t.valide) }))
    .filter((b) => b.analyses.length);
  const positifs = utiles.filter((b) => !b.exclusion);
  const negatifs = utiles.filter((b) => b.exclusion);
  const totalPertinents = corpus.filter((d) => vrai(d?.pertinent)).length;
  if (!positifs.length) {
    return { valide: false, resultats: [], vp: 0, totalPertinents, rappel: 0, precision: 0, parBloc: [] };
  }
  const parBloc = utiles.map((b) => ({ id: b.id, nb: 0 }));
  const resultats = [];
  index.forEach((champs, i) => {
    let garde = true;
    utiles.forEach((b, k) => {
      const touche = b.analyses.some((t) => termeCorrespond(t, champs));
      if (touche) parBloc[k].nb++;
      if (b.exclusion ? touche : !touche) garde = false;
    });
    if (garde) resultats.push(i);
  });
  const vp = resultats.filter((i) => vrai(corpus[i]?.pertinent)).length;
  return {
    valide: true,
    resultats,
    vp,
    totalPertinents,
    rappel: totalPertinents ? vp / totalPertinents : 0,
    precision: resultats.length ? vp / resultats.length : 0,
    parBloc,
  };
}

export function termesTrouves(blocs, doc) {
  const champs = indexerNotice(doc);
  const out = [];
  for (const b of blocs) {
    if (!b || b.actif === false) continue;
    for (const brut of b.termes || []) {
      const t = analyserTerme(brut);
      if (t.valide && termeCorrespond(t, champs)) out.push({ bloc: b.id, terme: brut, analyse: t });
    }
  }
  return out;
}

export function scoreRequete(essai, cibles, nbEssais = 1) {
  const cR = cibles?.rappel > 0 ? cibles.rappel : 0.8;
  const cP = cibles?.precision > 0 ? cibles.precision : 0.5;
  if (!essai || !essai.valide) return { score: 0, reussi: false, base: 0, facteur: 1 };
  const base = 0.5 * borner(essai.rappel / cR) + 0.5 * borner(essai.precision / cP);
  const facteur = Math.max(0.8, 1 - 0.04 * Math.max(0, nbEssais - 2));
  const reussi = essai.rappel >= cR - 1e-9 && essai.precision >= cP - 1e-9;
  return { score: borner(base * facteur), reussi, base, facteur };
}

export function equationLignes(blocs) {
  const lignes = [];
  const refs = [];
  let n = 0;
  for (const b of blocs) {
    if (!b || b.actif === false) continue;
    const termes = (b.termes || []).filter((t) => analyserTerme(t).valide);
    if (!termes.length) continue;
    n++;
    lignes.push({ num: n, bloc: b.id, nom: b.nom, termes, exclusion: !!b.exclusion });
    refs.push({ num: n, exclusion: !!b.exclusion });
  }
  const pos = refs.filter((r) => !r.exclusion);
  let combinaison = null;
  if (refs.length > 1 && pos.length) {
    let s = pos.map((r) => `#${r.num}`).join(' AND ');
    for (const r of refs.filter((r) => r.exclusion)) s += ` AND NOT #${r.num}`;
    combinaison = { num: n + 1, texte: s };
  }
  return { lignes, combinaison };
}

// ---------------------------------------------------------------- tri, ordre, correspondance

export function scoreTri(placements, cartes) {
  let justes = 0;
  const parCarte = cartes.map((c, i) => {
    const ok = placements[i] != null && String(placements[i]) === String(c.bac);
    if (ok) justes++;
    return ok;
  });
  return { score: cartes.length ? justes / cartes.length : 0, justes, total: cartes.length, parCarte };
}

// rangs : rangs attendus, dans l'ordre proposé par le joueur
export function concordancePaires(rangs) {
  let comparables = 0;
  let justes = 0;
  for (let i = 0; i < rangs.length; i++) {
    for (let j = i + 1; j < rangs.length; j++) {
      const a = Number(rangs[i]);
      const b = Number(rangs[j]);
      if (a === b) continue;
      comparables++;
      if (a < b) justes++;
    }
  }
  return comparables ? justes / comparables : 1;
}

export function positionsAttendues(elements) {
  const tries = elements.map((e, i) => ({ i, r: Number(e.rang) })).sort((a, b) => a.r - b.r || a.i - b.i);
  const pos = new Array(elements.length);
  tries.forEach((e, k) => { pos[e.i] = k; });
  return pos;
}

export function scoreOrdre(ordreJoueur, elements) {
  const rangs = ordreJoueur.map((i) => elements[i].rang);
  const attendues = positionsAttendues(elements);
  let exactes = 0;
  ordreJoueur.forEach((idx, pos) => {
    const r = Number(elements[idx].rang);
    const ok = attendues[idx] === pos || elements.some((e, k) => k !== idx && Number(e.rang) === r && attendues[k] === pos);
    if (ok) exactes++;
  });
  return { score: concordancePaires(rangs), exactes, total: elements.length };
}

export function clePaire(g, d) {
  return `${g}\u0001${d}`;
}

export function scoreCorrespondance(liens, paires) {
  const attendu = new Set(paires.map(([g, d]) => clePaire(g, d)));
  const donne = new Set(liens.map(([g, d]) => clePaire(g, d)));
  let vp = 0;
  for (const k of donne) if (attendu.has(k)) vp++;
  const fp = donne.size - vp;
  const fn = attendu.size - vp;
  const denom = donne.size + attendu.size;
  return { score: denom ? (2 * vp) / denom : 1, vp, fp, fn };
}

// ---------------------------------------------------------------- criblage

export function categorieMotif(motif) {
  const m = normaliser(motif).trim();
  if (!m) return null;
  for (const c of ['population', 'concept', 'contexte']) if (m.startsWith(c)) return c;
  const trouvees = ['population', 'concept', 'contexte'].filter((c) => new RegExp(`\\b${c}\\b`).test(m));
  return trouvees.length === 1 ? trouvees[0] : null;
}

export function normaliserDecision(d) {
  const n = normaliser(d);
  if (n.startsWith('incl')) return 'inclure';
  if (n.startsWith('excl')) return 'exclure';
  return null;
}

// decisions : [{ decision, motif }] (null si non traité)
export function scoreCriblage(decisions, articles) {
  let points = 0;
  let fauxNegatifs = 0;
  let fauxPositifs = 0;
  let motifsErrones = 0;
  let nonTraites = 0;
  const parArticle = articles.map((a, i) => {
    const attendu = normaliserDecision(a.decision);
    const d = decisions[i];
    if (!d || !d.decision) {
      nonTraites++;
      return { etat: 'non_traite', points: 0 };
    }
    if (d.decision !== attendu) {
      if (attendu === 'inclure') fauxNegatifs++;
      else fauxPositifs++;
      return { etat: 'erreur', points: 0 };
    }
    if (attendu === 'exclure') {
      const cat = categorieMotif(a.motif);
      if (cat && d.motif && d.motif !== cat) {
        motifsErrones++;
        points += 0.5;
        return { etat: 'motif', points: 0.5 };
      }
    }
    points += 1;
    return { etat: 'juste', points: 1 };
  });
  return {
    score: articles.length ? points / articles.length : 0,
    fauxNegatifs, fauxPositifs, motifsErrones, nonTraites, parArticle,
  };
}

// ---------------------------------------------------------------- jury, pitch

export function scoreJury(qualites) {
  if (!qualites.length) return 0;
  return borner(qualites.reduce((s, q) => s + borner(Number(q) || 0), 0) / qualites.length);
}

export function humeurApres(humeur, qualite) {
  return borner(humeur + (borner(qualite) - 0.5) * 0.5);
}

export function scorePitch(selection, fragments, limiteMots = 75) {
  const essentiels = fragments.map((f, i) => ({ f, i })).filter((x) => !vrai(x.f.superflu));
  const superflus = fragments.length - essentiels.length;
  const choisis = selection.map((i) => fragments[i]).filter(Boolean);
  const nbEssentielsChoisis = choisis.filter((f) => !vrai(f.superflu)).length;
  const nbSuperflusChoisis = choisis.length - nbEssentielsChoisis;
  const couverture = essentiels.length ? nbEssentielsChoisis / essentiels.length : 1;
  const sobriete = superflus ? 1 - nbSuperflusChoisis / superflus : 1;
  const rangs = selection.filter((i) => fragments[i] && !vrai(fragments[i].superflu)).map((i) => fragments[i].rang);
  const ordre = rangs.length > 1 ? concordancePaires(rangs) : rangs.length ? 1 : 0;
  const mots = choisis.reduce((s, f) => s + compterMots(f.texte), 0);
  const limite = limiteMots > 0 ? limiteMots : 75;
  const longueur = mots === 0 ? 0 : mots <= limite ? 1 : borner(1 - (mots - limite) / limite);
  const score = borner(0.35 * couverture + 0.2 * sobriete + 0.3 * ordre + 0.15 * longueur);
  return { score, couverture, sobriete, ordre, longueur, mots, secondes: dureeLecture(mots), limite };
}

// ---------------------------------------------------------------- carte

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function densitePour1000(n, population) {
  return population > 0 ? (n / population) * 1000 : 0;
}

function decouper(poly, a, b, c) {
  // garde les points où a*x + b*y <= c
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const fp = a * p[0] + b * p[1] - c;
    const fq = a * q[0] + b * q[1] - c;
    if (fp <= 0) out.push(p);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const t = fp / (fp - fq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  return out;
}

export function voronoi(sites, contour) {
  return sites.map((s, i) => {
    let poly = contour.map((p) => [p[0], p[1]]);
    for (let j = 0; j < sites.length && poly.length; j++) {
      if (j === i) continue;
      const o = sites[j];
      const a = o.x - s.x;
      const b = o.y - s.y;
      if (a === 0 && b === 0) continue;
      const c = (o.x * o.x + o.y * o.y - s.x * s.x - s.y * s.y) / 2;
      poly = decouper(poly, a, b, c);
    }
    return poly;
  });
}

export function enveloppeConvexe(points) {
  const p = points.map((q) => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const croix = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const bas = [];
  for (const q of p) {
    while (bas.length >= 2 && croix(bas[bas.length - 2], bas[bas.length - 1], q) <= 0) bas.pop();
    bas.push(q);
  }
  const haut = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (haut.length >= 2 && croix(haut[haut.length - 2], haut[haut.length - 1], q) <= 0) haut.pop();
    haut.push(q);
  }
  haut.pop();
  bas.pop();
  return bas.concat(haut);
}

export function contourTampon(points, marge, segments = 10) {
  const echant = [];
  for (const p of points) {
    for (let k = 0; k < segments; k++) {
      const a = (2 * Math.PI * k) / segments;
      echant.push([p.x + marge * Math.cos(a), p.y + marge * Math.sin(a)]);
    }
  }
  return enveloppeConvexe(echant);
}

export function aireSigne(poly) {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

export function pointDansPolygone(pt, poly) {
  let dedans = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) dedans = !dedans;
  }
  return dedans;
}

export function capaciteDe(r) {
  const c = Number(r?.capacite);
  return Number.isFinite(c) && c > 0 ? c : 1;
}

export function populationTotale(zones) {
  return zones.reduce((s, z) => s + (Number(z.pop65) || 0), 0);
}

export function statsSecteur(ressources, zones, rayon) {
  const pop = populationTotale(zones);
  const n = ressources.length;
  const capacite = ressources.reduce((s, r) => s + capaciteDe(r), 0);
  let couverte = 0;
  if (rayon > 0) {
    for (const z of zones) if (ressources.some((r) => distance(z, r) <= rayon)) couverte += Number(z.pop65) || 0;
  }
  return {
    n,
    capacite,
    densite: densitePour1000(n, pop),
    places: densitePour1000(capacite, pop),
    couverture: pop > 0 && rayon > 0 ? couverte / pop : null,
  };
}

export function deuxEtapes(ressources, zones, rayon) {
  const demande = ressources.map((r) =>
    zones.reduce((s, z) => (distance(z, r) <= rayon ? s + (Number(z.pop65) || 0) : s), 0));
  const ratio = ressources.map((r, j) => (demande[j] > 0 ? capaciteDe(r) / demande[j] : 0));
  const acces = zones.map((z) =>
    ressources.reduce((s, r, j) => (distance(z, r) <= rayon ? s + ratio[j] : s), 0) * 1000);
  const pression = ressources.map((r, j) => demande[j] / capaciteDe(r));
  return { demande, ratio, acces, pression };
}

export function zonesSansRessource(zones, ressources, rayon) {
  return zones.filter((z) => !ressources.some((r) => distance(z, r) <= rayon));
}

export function seuilsQuantiles(valeurs, classes = 5) {
  const v = valeurs.filter(Number.isFinite).slice().sort((a, b) => a - b);
  if (!v.length) return [];
  const s = [];
  for (let k = 1; k < classes; k++) {
    const pos = (v.length - 1) * (k / classes);
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    s.push(v[lo] + (v[hi] - v[lo]) * (pos - lo));
  }
  return s;
}

export function classeDe(valeur, seuils) {
  let k = 0;
  while (k < seuils.length && valeur > seuils[k]) k++;
  return k;
}

// ---------------------------------------------------------------- réseau

export function indiceBlau(categories) {
  const n = categories.length;
  if (!n) return 0;
  const compte = new Map();
  for (const c of categories) compte.set(c, (compte.get(c) || 0) + 1);
  let s = 0;
  for (const v of compte.values()) s += (v / n) ** 2;
  return 1 - s;
}

// liens : [{ a, b, niveau }] où a ou b vaut egoId pour les liens avec l'ego
export function mesuresReseau(alters, liens, egoId = 'ego') {
  const ids = new Set(alters.map((a) => a.id));
  const niveauEgo = new Map();
  for (const l of liens) {
    const nv = Number(l.niveau) || 0;
    if (nv < 1) continue;
    if (l.a === egoId && ids.has(l.b)) niveauEgo.set(l.b, Math.max(niveauEgo.get(l.b) || 0, nv));
    else if (l.b === egoId && ids.has(l.a)) niveauEgo.set(l.a, Math.max(niveauEgo.get(l.a) || 0, nv));
  }
  const relies = [...niveauEgo.keys()];
  const n = relies.length;
  const ensemble = new Set(relies);
  const vus = new Set();
  let t = 0;
  for (const l of liens) {
    if (l.a === egoId || l.b === egoId) continue;
    if (!ensemble.has(l.a) || !ensemble.has(l.b) || l.a === l.b) continue;
    const k = [l.a, l.b].sort().join('\u0001');
    if (vus.has(k)) continue;
    vus.add(k);
    t++;
  }
  const secteurs = relies.map((id) => alters.find((a) => a.id === id)?.secteur ?? '');
  const forts = [...niveauEgo.values()].filter((v) => v >= 3).length;
  const possibles = (n * (n - 1)) / 2;
  return {
    taille: n,
    liensAlters: t,
    densite: possibles ? t / possibles : 0,
    blau: indiceBlau(secteurs),
    tailleEffective: n ? n - (2 * t) / n : 0,
    partForts: n ? forts / n : 0,
    secteursPresents: new Set(secteurs).size,
    composantes: composantesAlters(relies, liens, egoId),
    niveauMoyen: n ? [...niveauEgo.values()].reduce((s, v) => s + v, 0) / n : 0,
  };
}

export function composantesAlters(ids, liens, egoId = 'ego') {
  const parent = new Map(ids.map((i) => [i, i]));
  const trouver = (x) => {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  };
  for (const l of liens) {
    if (l.a === egoId || l.b === egoId) continue;
    if (!parent.has(l.a) || !parent.has(l.b)) continue;
    parent.set(trouver(l.a), trouver(l.b));
  }
  return new Set(ids.map(trouver)).size;
}

export function clefLien(a, b) {
  return a < b ? `${a}\u0001${b}` : `${b}\u0001${a}`;
}

// liensJoueur / liensVrais : [{ a, b, niveau }]
export function scoreCodageReseau(liensJoueur, liensVrais, egoId = 'ego') {
  const vrais = new Map();
  for (const l of liensVrais) if ((Number(l.niveau) || 0) >= 1) vrais.set(clefLien(l.a, l.b), l);
  const joues = new Map();
  for (const l of liensJoueur) joues.set(clefLien(l.a, l.b), l);
  let vp = 0;
  let niveauxPoints = 0;
  let niveauxTotal = 0;
  const detail = [];
  for (const [k, l] of joues) {
    const v = vrais.get(k);
    if (v) {
      vp++;
      const ego = l.a === egoId || l.b === egoId;
      if (ego) {
        niveauxTotal++;
        const donne = Number(l.niveau) || 0;
        const ecart = donne ? Math.abs(donne - Number(v.niveau)) : 99;
        const pts = ecart === 0 ? 1 : ecart === 1 ? 0.5 : 0;
        niveauxPoints += pts;
        detail.push({ cle: k, etat: ecart === 0 ? 'juste' : 'niveau', attendu: Number(v.niveau), donne });
      } else detail.push({ cle: k, etat: 'juste' });
    } else detail.push({ cle: k, etat: 'faux' });
  }
  for (const [k, v] of vrais) if (!joues.has(k)) detail.push({ cle: k, etat: 'manquant', attendu: Number(v.niveau) });
  const denom = joues.size + vrais.size;
  const f1 = denom ? (2 * vp) / denom : 1;
  const niveaux = niveauxTotal ? niveauxPoints / niveauxTotal : f1 > 0 ? 1 : 0;
  return { score: borner(0.6 * f1 + 0.4 * niveaux * f1), f1, niveaux, vp, fp: joues.size - vp, fn: vrais.size - vp, detail };
}

// ---------------------------------------------------------------- questions (carte, réseau)

export function indexCorrecte(q) {
  const reps = Array.isArray(q?.reponses) ? q.reponses : [];
  const c = q?.correcte;
  const accepte = new Set();
  const ajouter = (v) => {
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v < reps.length) accepte.add(v);
    else if (typeof v === 'string') {
      const k = reps.findIndex((r) => normaliser(texteReponse(r)).trim() === normaliser(v).trim());
      if (k >= 0) accepte.add(k);
      else if (/^\d+$/.test(v) && +v < reps.length) accepte.add(+v);
    }
  };
  if (Array.isArray(c)) c.forEach(ajouter);
  else ajouter(c);
  reps.forEach((r, i) => { if (r && typeof r === 'object' && vrai(r.correct)) accepte.add(i); });
  return accepte;
}

export function texteReponse(r) {
  if (r == null) return '';
  if (typeof r === 'object') return String(r.texte ?? r.t ?? '');
  return String(r);
}

export function scoreQuestions(choix, questions) {
  if (!questions.length) return { score: 1, justes: 0, total: 0 };
  let justes = 0;
  questions.forEach((q, i) => { if (choix[i] != null && indexCorrecte(q).has(choix[i])) justes++; });
  return { score: justes / questions.length, justes, total: questions.length };
}

// ---------------------------------------------------------------- contraste (WCAG)

export function luminance(hex) {
  const h = hex.replace('#', '');
  const v = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

export function contraste(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
