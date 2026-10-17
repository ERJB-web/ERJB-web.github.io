import { h, s, icone, vider, nombre, pct, humaniser, styleSecteurs, cheminSymbole, pastilleSecteur } from '../noyau.js?v=03b1c95b3e';
import {
  voronoi, contourTampon, distance, statsSecteur, deuxEtapes, zonesSansRessource, seuilsQuantiles, classeDe,
  populationTotale, capaciteDe, pointDansPolygone, normaliser, enveloppeConvexe,
} from '../calculs.js?v=03b1c95b3e';
import { panneauQuestions } from './questions.js?v=03b1c95b3e';

const RAMPE_POP = ['#EEF4F7', '#C9D9E3', '#8DB5D3', '#3F86BF', '#0D4F86'];
const RAMPE_ACCES = ['#F3DCD9', '#CDEBEA', '#7FD0CD', '#2BAEAB', '#0B7472'];
const VITESSE_MARCHE = 60;

function point(p) {
  if (Array.isArray(p)) return { x: Number(p[0]), y: Number(p[1]) };
  return { x: Number(p?.x), y: Number(p?.y) };
}

export function preparerCarte(def) {
  const territoire = typeof def.territoire === 'object' && def.territoire ? def.territoire : { nom: def.territoire };
  const brutsZones = (Array.isArray(def.zonesAD) ? def.zonesAD : []).map((z, i) => ({ id: String(z.id ?? `AD ${i + 1}`), pop65: Number(z.pop65) || 0, ...point(z) }))
    .filter((z) => Number.isFinite(z.x) && Number.isFinite(z.y));
  const listeSecteurs = (Array.isArray(def.secteurs) ? def.secteurs : []).map((x, i) => (typeof x === 'object' && x
    ? { id: String(x.id ?? x.nom ?? i), nom: String(x.nom ?? x.titre ?? x.id ?? `Secteur ${i + 1}`) }
    : { id: String(x), nom: String(x) }));
  const brutsRes = (Array.isArray(def.ressources) ? def.ressources : []).map((r, i) => ({ nom: String(r.nom ?? `Ressource ${i + 1}`), secteurBrut: String(r.secteur ?? ''), capacite: r.capacite, ...point(r) }))
    .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
  for (const r of brutsRes) {
    const n = normaliser(r.secteurBrut);
    if (!listeSecteurs.some((x) => normaliser(x.id) === n || normaliser(x.nom) === n) && r.secteurBrut) listeSecteurs.push({ id: r.secteurBrut, nom: r.secteurBrut });
  }
  const secteurs = styleSecteurs(listeSecteurs);
  const cle = (txt) => {
    const n = normaliser(txt);
    return secteurs.find((x) => normaliser(x.id) === n || normaliser(x.nom) === n)?.id ?? null;
  };
  const contourBrut = Array.isArray(territoire.contour) ? territoire.contour.map(point) : [];
  const tous = [...brutsZones, ...brutsRes, ...contourBrut];
  const xs = tous.map((p) => p.x);
  const ys = tous.map((p) => p.y);
  const etendue = tous.length ? Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) : 1;
  const largeur = Number(territoire.largeur) > 0 ? Number(territoire.largeur) : 3000;
  const facteur = Number(territoire.echelle) > 0 ? Number(territoire.echelle) : etendue <= 1.5 ? largeur : etendue <= 100 ? largeur / 100 : 1;
  const yBas = territoire.axeY === 'bas';
  const conv = (p) => ({ x: p.x * facteur, y: (yBas ? -p.y : p.y) * facteur });
  const zones = brutsZones.map((z) => ({ ...z, ...conv(z) }));
  const ressources = brutsRes.map((r) => ({ ...r, ...conv(r), secteur: cle(r.secteurBrut) }));
  const pts = [...zones, ...ressources];
  const etendueM = etendue * facteur;
  let contour = contourBrut.length >= 3 ? contourBrut.map(conv).map((p) => [p.x, p.y]) : contourTampon(pts.length ? pts : [{ x: 0, y: 0 }], Math.max(120, etendueM * 0.07), 12);
  if (contour.length < 3) contour = enveloppeConvexe(pts.map((p) => [p.x, p.y]));
  const bx = contour.map((p) => p[0]);
  const by = contour.map((p) => p[1]);
  const boite = { x0: Math.min(...bx), x1: Math.max(...bx), y0: Math.min(...by), y1: Math.max(...by) };
  const m = (boite.x1 - boite.x0) * 0.05 + 1;
  const rect = [[boite.x0 - m, boite.y0 - m], [boite.x1 + m, boite.y0 - m], [boite.x1 + m, boite.y1 + m], [boite.x0 - m, boite.y1 + m]];
  const cellules = voronoi(zones, rect);
  return { territoire, nom: String(territoire.nom ?? territoire.id ?? 'Territoire'), zones, ressources, secteurs, contour, boite, cellules };
}

export function rendre(def, coque) {
  const C = preparerCarte(def);
  const etat = {
    fond: 'pop',
    visibles: new Set(C.secteurs.map((x) => x.id)),
    rayon: 0,
    nonDesservies: false,
    pression: false,
    etiquettes: false,
    outil: 'deplacer',
  };
  const vue = { x: (C.boite.x0 + C.boite.x1) / 2, y: (C.boite.y0 + C.boite.y1) / 2, w: (C.boite.x1 - C.boite.x0) * 1.12 || 1000 };
  let mesure = null;
  let identifie = null;
  const popTot = populationTotale(C.zones);

  // ---------------------------------------------------------------- carte SVG
  const svg = s('svg', { class: 'dfx-sig-svg', role: 'img', 'aria-label': `Carte du territoire ${C.nom}` });
  const defs = s('defs');
  const idClip = `${coque.id}-clip`;
  const idHach = `${coque.id}-hach`;
  defs.append(
    s('clipPath', { id: idClip }, s('path', { d: polyD(C.contour) })),
    s('pattern', { id: idHach, width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      s('rect', { width: 10, height: 10, fill: 'rgba(200,70,61,0.10)' }),
      s('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: '#C8463D', 'stroke-width': 3 })));
  const gFond = s('g', { 'clip-path': `url(#${idClip})` });
  const gHach = s('g', { 'clip-path': `url(#${idClip})` });
  const gRayons = s('g', { class: 'dfx-sig-rayons' });
  const gContour = s('path', { d: polyD(C.contour), class: 'dfx-sig-contour' });
  const gSymboles = s('g');
  const gEtiquettes = s('g', { class: 'dfx-sig-etiquettes' });
  const gMesure = s('g', { class: 'dfx-sig-mesure' });
  const gSel = s('g');
  svg.append(defs, s('rect', { class: 'dfx-sig-eau', x: -1e7, y: -1e7, width: 2e7, height: 2e7 }), gFond, gHach, gRayons, gContour, gSymboles, gEtiquettes, gSel, gMesure);

  const cellulesEl = C.zones.map((z, i) => {
    const p = s('path', { d: polyD(C.cellules[i], true), class: 'dfx-sig-ad' });
    gFond.append(p);
    return p;
  });
  const symbolesEl = C.ressources.map((r) => {
    const st = C.secteurs.find((x) => x.id === r.secteur) || C.secteurs[0];
    const g = s('g', { class: 'dfx-sig-res' }, s('path', { d: cheminSymbole(st?.forme, 7), fill: st?.couleur || '#0755AD' }));
    gSymboles.append(g);
    return g;
  });

  const echelle = h('div', { class: 'dfx-sig-echelle' }, h('span', { class: 'dfx-sig-echelle-barre' }), h('span', { class: 'dfx-sig-echelle-txt' }));
  const coords = h('div', { class: 'dfx-sig-coords', 'aria-hidden': 'true' });
  const fiche = h('div', { class: 'dfx-sig-fiche', hidden: true, role: 'status' });
  const outils = h('div', { class: 'dfx-sig-outils', role: 'toolbar', 'aria-label': 'Outils de la carte' },
    outilBtn('deplacer', 'main', 'Déplacer'), outilBtn('mesurer', 'regle', 'Mesurer'), outilBtn('identifier', 'identifier', 'Identifier'));
  const zoom = h('div', { class: 'dfx-sig-zoom' },
    btnIco('plus', 'Zoom avant', () => zoomer(1 / 1.4)),
    btnIco('moins', 'Zoom arrière', () => zoomer(1.4)),
    btnIco('recentrer', 'Recentrer', recentrer));
  const nord = h('div', { class: 'dfx-sig-nord', 'aria-hidden': 'true' }, s('svg', { viewBox: '0 0 24 32', width: 18, height: 24 }, s('path', { d: 'M12 2l7 20-7-5-7 5z', fill: 'currentColor' }), s('text', { x: 12, y: 31, 'text-anchor': 'middle', 'font-size': 9, fill: 'currentColor', text: 'N' })));
  const titreCarte = h('div', { class: 'dfx-sig-titre' }, h('strong', { text: C.nom }), h('span', { text: 'Données fictives' }));
  const carte = h('div', { class: 'dfx-sig-carte', tabindex: '0', 'aria-label': 'Carte interactive : flèches pour déplacer, + et − pour zoomer' }, svg, titreCarte, outils, zoom, nord, echelle, coords, fiche);

  // ---------------------------------------------------------------- couches
  const legendeFond = h('div', { class: 'dfx-sig-legende' });
  const couches = h('div', { class: 'dfx-sig-couches' },
    h('p', { class: 'dfx-surtitre', text: 'Couches' }),
    groupe('Aires de diffusion',
      radio('fond', 'pop', 'Aînés de 65 ans et plus', true),
      radio('fond', 'acces', 'Accessibilité (2SFCA)'),
      radio('fond', 'aucun', 'Aucun fond'),
      legendeFond),
    groupe('Ressources par secteur', C.secteurs.map((x) => caseSecteur(x))),
    groupe('Rayon d’accessibilité',
      h('div', { class: 'dfx-segments', role: 'radiogroup', 'aria-label': 'Rayon' }, [0, 500, 1000].map((r) => segment(r)))),
    groupe('Analyse',
      caseSimple('nonDesservies', 'Aires non desservies dans le rayon'),
      caseSimple('pression', 'Symboles selon la pression (aînés par place)'),
      caseSimple('etiquettes', 'Étiquettes')));

  // ---------------------------------------------------------------- indicateurs
  const indicateurs = h('div', { class: 'dfx-sig-indic' });
  const tables = h('div', { class: 'dfx-sig-tables' });

  // ---------------------------------------------------------------- questions
  const questions = Array.isArray(def.questions) ? def.questions : [];
  let btn = null;
  const pq = panneauQuestions(questions, coque, {
    surComplet: (complet) => { if (btn) btn.disabled = !complet; },
  });

  const onglets = ongletsPanneau(coque, [
    { id: 'indic', titre: 'Indicateurs', contenu: h('div', {}, indicateurs, tables) },
    { id: 'questions', titre: `Questions${questions.length ? ` (${questions.length})` : ''}`, contenu: pq.el },
  ]);

  coque.corps.append(h('div', { class: 'dfx-sig' },
    h('aside', { class: 'dfx-sig-gauche' }, couches),
    carte,
    h('aside', { class: 'dfx-sig-droite' }, onglets.el)));

  btn = coque.bouton(questions.length ? 'Remettre l’analyse' : 'Terminer l’exploration', { primaire: true, ico: 'valider', desactive: questions.length > 0, surClic: () => finir(false) });
  coque.setStatut(questions.length ? 'Explore les couches, mesure, identifie, puis réponds aux questions.' : 'Explore le territoire.');

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => appliquerVue()) : null;
  ro?.observe(carte);
  coque.surNettoyage(() => ro?.disconnect());
  majTout();
  requestAnimationFrame(appliquerVue);

  // ---------------------------------------------------------------- interactions
  const pointeurs = new Map();
  let geste = null;
  carte.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, .dfx-sig-fiche')) return;
    carte.setPointerCapture?.(e.pointerId);
    pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointeurs.size === 2) {
      const [a, b] = [...pointeurs.values()];
      geste = { type: 'pince', d0: Math.hypot(a.x - b.x, a.y - b.y), w0: vue.w, cx: vue.x, cy: vue.y };
    } else geste = { type: 'pan', x0: e.clientX, y0: e.clientY, vx: vue.x, vy: vue.y, bouge: false };
  });
  carte.addEventListener('pointermove', (e) => {
    const w = monde(e.clientX, e.clientY);
    coords.textContent = `x ${nombre(w.x)} m · y ${nombre(w.y)} m`;
    if (mesure && !mesure.fixe) { mesure.b = w; dessinerMesure(); }
    if (!pointeurs.has(e.pointerId)) return;
    pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (geste?.type === 'pince' && pointeurs.size === 2) {
      const [a, b] = [...pointeurs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > 10) { vue.w = borneW(geste.w0 * (geste.d0 / d)); appliquerVue(); }
    } else if (geste?.type === 'pan') {
      const dx = e.clientX - geste.x0;
      const dy = e.clientY - geste.y0;
      if (Math.hypot(dx, dy) > 5) geste.bouge = true;
      if (geste.bouge && (etat.outil === 'deplacer' || e.pointerType === 'touch')) {
        const k = vue.w / carte.clientWidth;
        vue.x = geste.vx - dx * k;
        vue.y = geste.vy + dy * k;
        appliquerVue();
        carte.classList.add('dfx-sig-carte--pan');
      }
    }
  });
  const relacher = (e) => {
    if (!pointeurs.has(e.pointerId)) return;
    pointeurs.delete(e.pointerId);
    carte.classList.remove('dfx-sig-carte--pan');
    if (geste?.type === 'pan' && !geste.bouge && e.type === 'pointerup') clicCarte(e);
    if (pointeurs.size === 0) geste = null;
    else if (pointeurs.size === 1) {
      const [p] = [...pointeurs.values()];
      geste = { type: 'pan', x0: p.x, y0: p.y, vx: vue.x, vy: vue.y, bouge: true };
    }
  };
  carte.addEventListener('pointerup', relacher);
  carte.addEventListener('pointercancel', relacher);
  carte.addEventListener('wheel', (e) => {
    e.preventDefault();
    const avant = monde(e.clientX, e.clientY);
    vue.w = borneW(vue.w * (e.deltaY > 0 ? 1.18 : 1 / 1.18));
    appliquerVue();
    const apres = monde(e.clientX, e.clientY);
    vue.x += avant.x - apres.x;
    vue.y += avant.y - apres.y;
    appliquerVue();
  }, { passive: false });
  carte.addEventListener('keydown', (e) => {
    const pas = vue.w * 0.1;
    if (e.key === 'ArrowLeft') vue.x -= pas;
    else if (e.key === 'ArrowRight') vue.x += pas;
    else if (e.key === 'ArrowUp') vue.y += pas;
    else if (e.key === 'ArrowDown') vue.y -= pas;
    else if (e.key === '+' || e.key === '=') vue.w = borneW(vue.w / 1.3);
    else if (e.key === '-') vue.w = borneW(vue.w * 1.3);
    else if (e.key === '0') { recentrer(); return; }
    else return;
    e.preventDefault();
    appliquerVue();
  });
  coque.surEchap(() => {
    if (mesure && !mesure.fixe) { mesure = null; dessinerMesure(); return true; }
    if (!fiche.hidden) { fermerFiche(); return true; }
    return false;
  });

  function borneW(w) {
    const base = (C.boite.x1 - C.boite.x0) * 1.12 || 1000;
    return Math.min(base * 3, Math.max(base / 12, w));
  }

  function monde(cx, cy) {
    const r = svg.getBoundingClientRect();
    const k = vue.w / (r.width || 1);
    const hgt = (r.height || 1) * k;
    return { x: vue.x - vue.w / 2 + (cx - r.left) * k, y: vue.y + hgt / 2 - (cy - r.top) * k };
  }

  function appliquerVue() {
    const r = svg.getBoundingClientRect();
    if (!r.width) return;
    const k = vue.w / r.width;
    const hgt = r.height * k;
    svg.setAttribute('viewBox', `${vue.x - vue.w / 2} ${-vue.y - hgt / 2} ${vue.w} ${hgt}`);
    const pres = deuxEtapes(ressourcesVisibles(), C.zones, etat.rayon || 1000).pression;
    const vis = ressourcesVisibles();
    const med = mediane(pres.filter((p) => p > 0)) || 1;
    C.ressources.forEach((rs, i) => {
      const el = symbolesEl[i];
      const j = vis.indexOf(rs);
      let taille = 1;
      if (etat.pression && j >= 0) taille = Math.max(0.7, Math.min(2.3, Math.sqrt(pres[j] / med)));
      el.setAttribute('transform', `translate(${rs.x} ${-rs.y}) scale(${k * taille})`);
    });
    gEtiquettes.querySelectorAll('text').forEach((t) => {
      t.setAttribute('font-size', String(12 * k));
      t.setAttribute('stroke-width', String(3 * k));
    });
    gSel.querySelectorAll('[data-k]').forEach((el) => el.setAttribute('transform', `${el.dataset.base} scale(${k})`));
    dessinerMesure();
    const cible = 110 * k;
    const pasM = [50, 100, 200, 250, 500, 1000, 2000, 5000, 10000].find((v) => v >= cible) || 10000;
    echelle.querySelector('.dfx-sig-echelle-barre').style.width = `${pasM / k}px`;
    echelle.querySelector('.dfx-sig-echelle-txt').textContent = pasM >= 1000 ? `${nombre(pasM / 1000)} km` : `${pasM} m`;
  }

  function zoomer(f) { vue.w = borneW(vue.w * f); appliquerVue(); coque.jouer('clic'); }
  function recentrer() {
    vue.x = (C.boite.x0 + C.boite.x1) / 2;
    vue.y = (C.boite.y0 + C.boite.y1) / 2;
    vue.w = (C.boite.x1 - C.boite.x0) * 1.12 || 1000;
    appliquerVue();
  }

  function clicCarte(e) {
    const w = monde(e.clientX, e.clientY);
    if (etat.outil === 'mesurer') {
      if (!mesure || mesure.fixe) mesure = { a: w, b: w, fixe: false };
      else {
        mesure.b = w;
        mesure.fixe = true;
        const d = distance(mesure.a, mesure.b);
        coque.annoncer(`Distance : ${nombre(Math.round(d / 10) * 10)} mètres.`);
        if (d > 1000 && !clicCarte.dit) {
          clicCarte.dit = true;
          coque.reagir(`${nombre(d / 1000, 1)} km à pied avec une marchette, en février ? Pas si accessible.`, { humeur: 'sceptique' });
        }
      }
      coque.jouer('clic');
      dessinerMesure();
      return;
    }
    if (etat.outil === 'identifier' || e.pointerType === 'touch' || etat.outil === 'deplacer') {
      const r = svg.getBoundingClientRect();
      const k = vue.w / r.width;
      const vis = ressourcesVisibles();
      let best = null;
      for (const rs of vis) {
        const d = distance(rs, w) / k;
        if (d < 14 && (!best || d < best.d)) best = { d, rs };
      }
      if (best) identifier({ type: 'res', rs: best.rs });
      else {
        const i = C.cellules.findIndex((p) => p.length && pointDansPolygone([w.x, w.y], p));
        if (i >= 0 && pointDansPolygone([w.x, w.y], C.contour)) identifier({ type: 'ad', z: C.zones[i], i });
        else fermerFiche();
      }
    }
  }

  function identifier(cible, silencieux) {
    identifie = cible;
    if (!silencieux) coque.jouer('clic');
    vider(fiche);
    const rayon = etat.rayon || 1000;
    const vis = ressourcesVisibles();
    const de = deuxEtapes(vis, C.zones, rayon);
    const fermer = btnIco('fermer', 'Fermer la fiche', fermerFiche);
    fermer.classList.add('dfx-sig-fiche-x');
    if (cible.type === 'res') {
      const rs = cible.rs;
      const st = C.secteurs.find((x) => x.id === rs.secteur);
      const j = vis.indexOf(rs);
      fiche.append(fermer,
        h('p', { class: 'dfx-sig-fiche-type' }, st ? pastilleSecteur(st, 14) : null, h('span', { text: st?.nom ?? 'Ressource' })),
        h('p', { class: 'dfx-sig-fiche-nom', text: rs.nom }),
        h('dl', {},
          ligneDl('Capacité', rs.capacite != null && rs.capacite !== '' ? nombre(Number(rs.capacite)) : 'non précisée'),
          ligneDl(`Aînés à moins de ${nombre(rayon)} m`, nombre(de.demande[j] ?? 0)),
          ligneDl('Aînés par place', j >= 0 && capaciteDe(rs) ? nombre(de.pression[j], 1) : '—')));
    } else {
      const z = cible.z;
      const parSecteur = C.secteurs.map((x) => ({ x, n: vis.filter((rs) => rs.secteur === x.id && distance(rs, z) <= rayon).length })).filter((p) => etat.visibles.has(p.x.id));
      const plusProche = vis.reduce((m, rs) => Math.min(m, distance(rs, z)), Infinity);
      fiche.append(fermer,
        h('p', { class: 'dfx-sig-fiche-type', text: 'Aire de diffusion' }),
        h('p', { class: 'dfx-sig-fiche-nom', text: z.id }),
        h('dl', {},
          ligneDl('Aînés (65 ans et +)', nombre(z.pop65)),
          ligneDl('Ressource visible la plus proche', Number.isFinite(plusProche) ? `${nombre(Math.round(plusProche / 10) * 10)} m` : '—'),
          ligneDl(`Accessibilité (2SFCA, ${nombre(rayon)} m)`, `${nombre(de.acces[cible.i] ?? 0, 1)} places / 1 000`),
          ...parSecteur.map((p) => ligneDl(`${p.x.nom} à moins de ${nombre(rayon)} m`, String(p.n)))));
    }
    fiche.hidden = false;
    dessinerSelection();
  }

  function fermerFiche() {
    fiche.hidden = true;
    identifie = null;
    dessinerSelection();
  }

  function dessinerSelection() {
    vider(gSel);
    if (!identifie) return;
    const r = svg.getBoundingClientRect();
    const k = vue.w / (r.width || 1);
    if (identifie.type === 'res') {
      const base = `translate(${identifie.rs.x} ${-identifie.rs.y})`;
      gSel.append(s('circle', { r: 14, class: 'dfx-sig-sel', 'data-k': '1', 'data-base': base, transform: `${base} scale(${k})` }));
    } else gSel.append(s('path', { d: polyD(C.cellules[identifie.i], true), class: 'dfx-sig-sel-ad' }));
  }

  function dessinerMesure() {
    vider(gMesure);
    if (!mesure) return;
    const r = svg.getBoundingClientRect();
    const k = vue.w / (r.width || 1);
    const { a, b } = mesure;
    const d = distance(a, b);
    gMesure.append(s('line', { x1: a.x, y1: -a.y, x2: b.x, y2: -b.y, class: 'dfx-sig-mesure-ligne' }));
    for (const p of [a, b]) gMesure.append(s('circle', { cx: p.x, cy: -p.y, r: 4.5 * k, class: 'dfx-sig-mesure-pt' }));
    if (d > 1) {
      const minutes = Math.round(d / VITESSE_MARCHE);
      const t = s('text', { x: (a.x + b.x) / 2, y: -(a.y + b.y) / 2 - 10 * k, 'font-size': 13 * k, 'stroke-width': 4 * k, class: 'dfx-sig-mesure-txt', 'text-anchor': 'middle' },
        `${nombre(Math.round(d / 10) * 10)} m · ≈ ${minutes} min à pied`);
      gMesure.append(t);
    }
  }

  // ---------------------------------------------------------------- couches et indicateurs
  function ressourcesVisibles() {
    return C.ressources.filter((r) => etat.visibles.has(r.secteur));
  }

  function majTout() {
    const vis = ressourcesVisibles();
    const rayonA = etat.rayon || 1000;
    let valeurs;
    let rampe;
    let titreLeg;
    let fmt = (v) => nombre(v);
    if (etat.fond === 'pop') { valeurs = C.zones.map((z) => z.pop65); rampe = RAMPE_POP; titreLeg = 'Aînés de 65 ans et plus par AD'; }
    else if (etat.fond === 'acces') {
      valeurs = deuxEtapes(vis, C.zones, rayonA).acces;
      rampe = RAMPE_ACCES;
      titreLeg = `Places pour 1 000 aînés à moins de ${nombre(rayonA)} m`;
      fmt = (v) => nombre(v, 1);
    }
    vider(legendeFond);
    if (valeurs) {
      const positifs = etat.fond === 'acces' ? valeurs.filter((v) => v > 0) : valeurs;
      const seuils = seuilsQuantiles(positifs, etat.fond === 'acces' ? 4 : 5);
      const classe = (v) => (etat.fond === 'acces' ? (v <= 0 ? 0 : 1 + classeDe(v, seuils)) : classeDe(v, seuils));
      cellulesEl.forEach((p, i) => { p.setAttribute('fill', rampe[Math.min(rampe.length - 1, classe(valeurs[i]))]); p.classList.remove('dfx-sig-ad--vide'); });
      legendeFond.append(h('p', { class: 'dfx-sig-legende-titre', text: titreLeg }));
      const libelles = etiquettesClasses(seuils, etat.fond === 'acces' ? 4 : 5, fmt);
      if (etat.fond === 'acces') libelles.unshift('aucune place accessible');
      const items = libelles.map((txt, c) => h('li', {}, h('span', { class: 'dfx-sig-case', style: { background: rampe[c] } }), h('span', { text: txt })));
      legendeFond.append(h('ul', { class: 'dfx-sig-legende-liste' }, items));
    } else {
      cellulesEl.forEach((p) => { p.setAttribute('fill', 'transparent'); p.classList.add('dfx-sig-ad--vide'); });
    }

    vider(gHach);
    if (etat.nonDesservies && etat.rayon) {
      const sans = new Set(zonesSansRessource(C.zones, vis, etat.rayon).map((z) => z.id));
      C.zones.forEach((z, i) => { if (sans.has(z.id)) gHach.append(s('path', { d: polyD(C.cellules[i], true), fill: `url(#${idHach})`, class: 'dfx-sig-hach' })); });
    }

    vider(gRayons);
    if (etat.rayon) for (const rs of vis) {
      const st = C.secteurs.find((x) => x.id === rs.secteur);
      gRayons.append(s('circle', { cx: rs.x, cy: -rs.y, r: etat.rayon, class: 'dfx-sig-rayon', stroke: st?.couleur, fill: st?.couleur }));
    }

    C.ressources.forEach((rs, i) => { symbolesEl[i].style.display = etat.visibles.has(rs.secteur) ? '' : 'none'; });
    const pres = deuxEtapes(vis, C.zones, rayonA).pression;
    const med = mediane(pres.filter((p) => p > 0)) || 1;
    C.ressources.forEach((rs, i) => {
      const j = vis.indexOf(rs);
      symbolesEl[i].classList.toggle('dfx-sig-res--sature', etat.pression && j >= 0 && pres[j] >= med * 1.6);
    });

    vider(gEtiquettes);
    if (etat.etiquettes) {
      for (const z of C.zones) gEtiquettes.append(s('text', { x: z.x, y: -z.y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'dfx-sig-etiq-ad' }, String(z.id).slice(-4)));
      for (const rs of vis) gEtiquettes.append(s('text', { x: rs.x, y: -rs.y - 14 * (vue.w / (svg.getBoundingClientRect().width || 1)), 'text-anchor': 'middle', class: 'dfx-sig-etiq-res' }, rs.nom));
    }

    majIndicateurs(vis);
    appliquerVue();
    dessinerSelection();
    if (identifie) {
      if (identifie.type === 'res' && !etat.visibles.has(identifie.rs.secteur)) fermerFiche();
      else identifier(identifie, true);
    }
  }

  function majIndicateurs(vis) {
    vider(indicateurs);
    const rayon = etat.rayon;
    indicateurs.append(h('div', { class: 'dfx-sig-resume' },
      h('div', {}, h('strong', { brut: nombre(popTot) }), h('span', { text: 'aînés de 65 ans et plus' })),
      h('div', {}, h('strong', { brut: String(C.zones.length) }), h('span', { text: 'aires de diffusion' })),
      h('div', {}, h('strong', { brut: String(C.ressources.length) }), h('span', { text: 'ressources' }))));
    const entete = ['Secteur', 'n', 'pour 1 000 aînés', 'places pour 1 000'];
    if (rayon) entete.push(`aînés à moins de ${nombre(rayon)} m`);
    const tbody = h('tbody');
    for (const x of C.secteurs) {
      const rs = C.ressources.filter((r) => r.secteur === x.id);
      const st = statsSecteur(rs, C.zones, rayon);
      const cache = !etat.visibles.has(x.id);
      tbody.append(h('tr', { class: `${cache ? 'dfx-sig-ligne-cachee' : ''}${st.n === 0 ? ' dfx-sig-ligne-absente' : ''}` },
        h('th', { scope: 'row' }, pastilleSecteur(x, 14), h('span', { text: x.nom })),
        h('td', { brut: String(st.n) }),
        h('td', { brut: nombre(st.densite, 2) }),
        h('td', { brut: rs.some((r) => r.capacite != null) ? nombre(st.places, 1) : '—' }),
        rayon ? h('td', { brut: st.n ? pct(st.couverture) : `0${' '}%` }) : null));
    }
    const stTous = statsSecteur(vis, C.zones, rayon);
    const tfoot = h('tfoot', {}, h('tr', {},
      h('th', { scope: 'row', text: 'Secteurs affichés' }),
      h('td', { brut: String(stTous.n) }),
      h('td', { brut: nombre(stTous.densite, 2) }),
      h('td', { brut: '' }),
      rayon ? h('td', { brut: pct(stTous.couverture ?? 0) }) : null));
    indicateurs.append(h('div', { class: 'dfx-table-defile' }, h('table', { class: 'dfx-table dfx-sig-table' },
      h('caption', { text: 'Densité par secteur (n ÷ aînés × 1 000)' }),
      h('thead', {}, h('tr', {}, entete.map((t) => h('th', { scope: 'col', text: t })))), tbody, tfoot)));

    vider(tables);
    const rayonA = rayon || 1000;
    const de = deuxEtapes(vis, C.zones, rayonA);
    const lignesRes = vis.map((r, j) => ({ r, j })).sort((a, b) => de.pression[b.j] - de.pression[a.j]);
    tables.append(h('details', { class: 'dfx-sig-attributs' },
      h('summary', { text: `Table attributaire des ressources affichées (${vis.length})` }),
      h('div', { class: 'dfx-table-defile' }, h('table', { class: 'dfx-table' },
        h('thead', {}, h('tr', {}, ['Ressource', 'Secteur', 'Capacité', `Aînés à ${nombre(rayonA)} m`, 'Aînés par place'].map((t) => h('th', { scope: 'col', text: t })))),
        h('tbody', {}, lignesRes.map(({ r, j }) => h('tr', {},
          h('th', { scope: 'row', text: r.nom }),
          h('td', { text: C.secteurs.find((x) => x.id === r.secteur)?.nom ?? '' }),
          h('td', { brut: r.capacite != null ? nombre(Number(r.capacite)) : '—' }),
          h('td', { brut: nombre(de.demande[j]) }),
          h('td', { brut: nombre(de.pression[j], 1) }))))))));
    const sansR = new Set(rayon ? zonesSansRessource(C.zones, vis, rayon).map((z) => z.id) : []);
    tables.append(h('details', { class: 'dfx-sig-attributs' },
      h('summary', { text: `Table attributaire des aires de diffusion (${C.zones.length})` }),
      h('div', { class: 'dfx-table-defile' }, h('table', { class: 'dfx-table' },
        h('thead', {}, h('tr', {}, ['AD', '65 ans et +', `Accès 2SFCA (${nombre(rayonA)} m)`, rayon ? `Desservie à ${nombre(rayon)} m` : null].filter(Boolean).map((t) => h('th', { scope: 'col', text: t })))),
        h('tbody', {}, C.zones.map((z, i) => ({ z, i })).sort((a, b) => b.z.pop65 - a.z.pop65).map(({ z, i }) => h('tr', {},
          h('th', { scope: 'row', text: z.id }),
          h('td', { brut: nombre(z.pop65) }),
          h('td', { brut: nombre(de.acces[i], 1) }),
          rayon ? h('td', { text: sansR.has(z.id) ? 'non' : 'oui' }) : null)))))));
  }

  // ---------------------------------------------------------------- contrôles
  function groupe(titre, ...enfants) {
    return h('fieldset', { class: 'dfx-sig-groupe' }, h('legend', { text: titre }), enfants);
  }
  function radio(nom, valeur, libelle, coche = false) {
    const inp = h('input', { type: 'radio', name: `${coque.id}-${nom}`, value: valeur });
    inp.checked = coche;
    inp.addEventListener('change', () => { etat[nom] = valeur; coque.jouer('clic'); majTout(); });
    return h('label', { class: 'dfx-choix-ligne' }, inp, h('span', { text: libelle }));
  }
  function caseSecteur(x) {
    const n = C.ressources.filter((r) => r.secteur === x.id).length;
    const inp = h('input', { type: 'checkbox' });
    inp.checked = true;
    inp.addEventListener('change', () => {
      if (inp.checked) etat.visibles.add(x.id); else etat.visibles.delete(x.id);
      coque.jouer('clic');
      majTout();
    });
    return h('label', { class: 'dfx-choix-ligne' }, inp, pastilleSecteur(x, 16), h('span', { text: x.nom }), h('span', { class: `dfx-sig-n${n ? '' : ' dfx-sig-n--zero'}`, brut: String(n) }));
  }
  function caseSimple(cle, libelle) {
    const inp = h('input', { type: 'checkbox' });
    inp.addEventListener('change', () => {
      etat[cle] = inp.checked;
      coque.jouer('clic');
      if (cle === 'nonDesservies' && inp.checked && !etat.rayon) {
        etat.rayon = 500;
        couches.querySelectorAll('.dfx-segment').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.r === '500')));
        coque.setStatut('Rayon de 500 m activé pour repérer les aires non desservies.');
      }
      majTout();
    });
    return h('label', { class: 'dfx-choix-ligne' }, inp, h('span', { text: libelle }));
  }
  function segment(r) {
    const b = h('button', { class: 'dfx-segment', type: 'button', role: 'radio', 'aria-checked': String(r === 0), dataset: { r: String(r) }, text: r ? `${nombre(r)} m` : 'Aucun' });
    b.addEventListener('click', () => {
      etat.rayon = r;
      couches.querySelectorAll('.dfx-segment').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      coque.jouer('clic');
      majTout();
    });
    return b;
  }
  function outilBtn(id, ico, libelle) {
    const b = h('button', { class: 'dfx-sig-outil', type: 'button', 'aria-pressed': String(etat.outil === id), title: libelle }, icone(ico), h('span', { text: libelle }));
    b.addEventListener('click', () => {
      etat.outil = id;
      outils.querySelectorAll('.dfx-sig-outil').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      carte.dataset.outil = id;
      if (id !== 'mesurer') { mesure = null; dessinerMesure(); }
      coque.jouer('clic');
      coque.setStatut(id === 'mesurer' ? 'Mesure : clique un point de départ, puis un point d’arrivée.' : id === 'identifier' ? 'Identifier : clique une ressource ou une aire de diffusion.' : 'Déplacer : glisse la carte, molette pour zoomer.');
    });
    return b;
  }

  function finir(tempsEcoule) {
    if (coque.estTermine()) return;
    const res = pq.corriger();
    coque.jouer(res.score >= 0.6 ? 'succes' : 'echec');
    coque.terminer({
      score: res.score,
      details: { justes: res.justes, total: res.total, reponses: res.choix, tempsEcoule },
    }, (zone) => pq.rendreCorrection(zone));
  }

  return { surTempsEcoule: () => finir(true) };
}

function polyD(poly, inverser = true) {
  if (!poly || !poly.length) return '';
  return `M${poly.map((p) => `${p[0].toFixed(1)},${(inverser ? -p[1] : p[1]).toFixed(1)}`).join('L')}Z`;
}

function etiquettesClasses(seuils, n, fmt) {
  const out = [];
  for (let c = 0; c < n; c++) {
    if (!seuils.length) { out.push(c === 0 ? 'toutes les aires' : ''); continue; }
    if (c === 0) out.push(`jusqu’à ${fmt(seuils[0])}`);
    else if (c < n - 1) out.push(`${fmt(seuils[c - 1])} à ${fmt(seuils[c])}`);
    else out.push(`plus de ${fmt(seuils[seuils.length - 1])}`);
  }
  return out.filter(Boolean);
}

function mediane(v) {
  if (!v.length) return 0;
  const t = v.slice().sort((a, b) => a - b);
  const m = Math.floor(t.length / 2);
  return t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2;
}

function ligneDl(dt, dd) {
  return [h('dt', { text: dt }), h('dd', { text: dd })];
}

function btnIco(ico, titre, fn) {
  const b = h('button', { class: 'dfx-btn-ico', type: 'button', title: titre }, icone(ico), h('span', { class: 'dfx-sr', text: titre }));
  b.addEventListener('click', fn);
  return b;
}

export function ongletsPanneau(coque, onglets) {
  const barre = h('div', { class: 'dfx-onglets', role: 'tablist' });
  const panneaux = [];
  onglets.forEach((o, k) => {
    const idT = `${coque.id}-tab-${o.id}`;
    const idP = `${coque.id}-pan-${o.id}`;
    const t = h('button', { class: 'dfx-onglet', type: 'button', role: 'tab', id: idT, 'aria-controls': idP, 'aria-selected': String(k === 0), tabindex: k === 0 ? '0' : '-1', text: o.titre });
    const p = h('div', { class: 'dfx-onglet-panneau', role: 'tabpanel', id: idP, 'aria-labelledby': idT, hidden: k !== 0 }, o.contenu);
    t.addEventListener('click', () => activer(k));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const n = (k + (e.key === 'ArrowRight' ? 1 : -1) + onglets.length) % onglets.length;
        activer(n);
        barre.children[n].focus();
      }
    });
    barre.append(t);
    panneaux.push(p);
  });
  function activer(k) {
    [...barre.children].forEach((t, j) => { t.setAttribute('aria-selected', String(j === k)); t.tabIndex = j === k ? 0 : -1; });
    panneaux.forEach((p, j) => { p.hidden = j !== k; });
    coque.jouer('clic');
  }
  return { el: h('div', { class: 'dfx-onglets-boite' }, onglets.length > 1 ? barre : null, panneaux), activer };
}

