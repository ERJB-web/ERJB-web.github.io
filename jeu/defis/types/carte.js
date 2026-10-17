import { h, s, icone, vider, nombre, pct, humaniser, styleSecteurs, cheminSymbole, pastilleSecteur } from '../noyau.js?v=0a26226c4e';
import {
  voronoi, contourTampon, distance, statsSecteur, deuxEtapes, zonesSansRessource, seuilsQuantiles, classeDe,
  populationTotale, capaciteDe, capaciteConnue, pointDansPolygone, normaliser, enveloppeConvexe, couperRectangle, densitePour1000,
} from '../calculs.js?v=0a26226c4e';
import { panneauQuestions } from './questions.js?v=0a26226c4e';

const RAMPE_POP = ['#EEF4F7', '#C9D9E3', '#8DB5D3', '#3F86BF', '#0D4F86'];
const RAMPE_ACCES = ['#F3DCD9', '#CDEBEA', '#7FD0CD', '#2BAEAB', '#0B7472'];
const VITESSE_MARCHE = 60;

function point(p) {
  if (Array.isArray(p)) return { x: Number(p[0]), y: Number(p[1]) };
  return { x: Number(p?.x), y: Number(p?.y) };
}

function nombreOuNul(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function preparerCarte(def) {
  const territoire = typeof def.territoire === 'object' && def.territoire ? def.territoire : { nom: def.territoire };
  const echelle = def.echelle && typeof def.echelle === 'object' ? def.echelle : (territoire.echelle && typeof territoire.echelle === 'object' ? territoire.echelle : null);
  const brutsZones = (Array.isArray(def.zonesAD) ? def.zonesAD : []).map((z, i) => ({
    id: String(z.id ?? `AD ${i + 1}`), pop65: Number(z.pop65) || 0, type: z.type ? String(z.type) : '', ...point(z),
  })).filter((z) => Number.isFinite(z.x) && Number.isFinite(z.y));
  const listeSecteurs = (Array.isArray(def.secteurs) ? def.secteurs : []).map((x, i) => (typeof x === 'object' && x
    ? { id: String(x.id ?? x.nom ?? i), nom: String(x.nom ?? x.titre ?? x.id ?? `Secteur ${i + 1}`) }
    : { id: String(x), nom: String(x) }));
  const brutsRes = (Array.isArray(def.ressources) ? def.ressources : []).map((r, i) => ({
    nom: String(r.nom ?? `Ressource ${i + 1}`),
    secteurBrut: String(r.secteur ?? ''),
    type: r.type ? String(r.type) : '',
    domaine: r.domaine ? String(r.domaine) : '',
    territoire: r.territoire ? String(r.territoire) : '',
    capacite: nombreOuNul(r.capacite),
    attente: nombreOuNul(r.attente),
    ...point(r),
  })).filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
  for (const r of brutsRes) {
    const n = normaliser(r.secteurBrut);
    if (r.secteurBrut && !listeSecteurs.some((x) => normaliser(x.id) === n || normaliser(x.nom) === n)) listeSecteurs.push({ id: r.secteurBrut, nom: nomSecteurParDefaut(r.secteurBrut) });
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
  let facteur;
  let unite = 'm';
  if (echelle) {
    unite = /^km/i.test(String(echelle.unite || '')) ? 'km' : 'm';
    facteur = unite === 'km' ? 1000 : 1;
  } else {
    const largeur = Number(territoire.largeur) > 0 ? Number(territoire.largeur) : 3000;
    facteur = Number(territoire.echelle) > 0 ? Number(territoire.echelle) : etendue <= 1.5 ? largeur : etendue <= 100 ? largeur / 100 : 1;
  }
  const yBas = territoire.axeY === 'bas';
  const conv = (p) => ({ x: p.x * facteur, y: (yBas ? -p.y : p.y) * facteur });
  const zones = brutsZones.map((z) => ({ ...z, ...conv(z) }));
  const ressources = brutsRes.map((r) => ({ ...r, ...conv(r), secteur: cle(r.secteurBrut) }));
  const pts = [...zones, ...ressources];
  const etendueM = Math.max(etendue * facteur, 1);
  const L = echelle && Number(echelle.largeur) > 0 ? Number(echelle.largeur) * facteur : null;
  const H = echelle && Number(echelle.hauteur) > 0 ? Number(echelle.hauteur) * facteur : null;
  let contour;
  if (contourBrut.length >= 3) contour = contourBrut.map(conv).map((p) => [p.x, p.y]);
  else {
    contour = contourTampon(pts.length ? pts : [{ x: 0, y: 0 }], Math.max(etendueM * 0.12, 60), 14);
    if (L && H) {
      const coupe = couperRectangle(contour, 0, 0, L, H);
      if (coupe.length >= 3) contour = coupe;
    }
  }
  if (contour.length < 3) contour = enveloppeConvexe(pts.map((p) => [p.x, p.y]));
  const bx = contour.map((p) => p[0]);
  const by = contour.map((p) => p[1]);
  const boite = { x0: Math.min(...bx), x1: Math.max(...bx), y0: Math.min(...by), y1: Math.max(...by) };
  const m = (boite.x1 - boite.x0) * 0.05 + 1;
  const rect = [[boite.x0 - m, boite.y0 - m], [boite.x1 + m, boite.y0 - m], [boite.x1 + m, boite.y1 + m], [boite.x0 - m, boite.y1 + m]];
  const cellules = voronoi(zones, rect);
  const parTerritoire = ressources.some((r) => r.territoire);
  return { territoire, nom: String(territoire.nom ?? territoire.id ?? 'Territoire'), zones, ressources, secteurs, contour, boite, cellules, unite, parTerritoire };
}

function nomSecteurParDefaut(id) {
  const m = /^s\s*([1-6])$/i.exec(String(id).trim());
  if (m) return ['Réseau public', 'Première ligne', 'Parapublic', 'Communauté', 'Ville et municipalité', 'Habitation'][+m[1] - 1];
  return humaniser(id);
}

export function rendre(def, coque) {
  const C = preparerCarte(def);
  const types = [...new Set(C.ressources.map((r) => r.type).filter(Boolean))];
  const domaines = [...new Set(C.ressources.map((r) => r.domaine).filter(Boolean))];
  const avecAttente = C.ressources.some((r) => r.attente != null);
  const libZone = C.zones.some((z) => z.type) ? humaniser(C.zones.find((z) => z.type).type) : 'Aire de diffusion';
  const libZones = pluriel(minuscule(libZone));
  const etat = {
    fond: 'pop',
    visibles: new Set(C.secteurs.map((x) => x.id)),
    types: new Set(types),
    domaine: '',
    rayon: 0,
    nonDesservies: false,
    pression: false,
    etiquettes: false,
    outil: 'deplacer',
  };
  const vue = { x: (C.boite.x0 + C.boite.x1) / 2, y: (C.boite.y0 + C.boite.y1) / 2, w: (C.boite.x1 - C.boite.x0) * 1.12 || 1000 };
  let ajuste = false;
  const largeurAjustee = (r) => Math.max(C.boite.x1 - C.boite.x0, (C.boite.y1 - C.boite.y0) * (r.width / Math.max(1, r.height))) * 1.1 || 1000;
  let mesure = null;
  let identifie = null;
  const popTot = populationTotale(C.zones);
  const dist = (m) => (C.unite === 'km' && m >= 1000 ? `${nombre(m / 1000, m >= 10000 ? 0 : 1)} km` : `${nombre(Math.round(m / 10) * 10)} m`);

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
  svg.append(defs, s('rect', { class: 'dfx-sig-eau', x: -1e8, y: -1e8, width: 2e8, height: 2e8 }), gFond, gHach, gRayons, gContour, gSymboles, gEtiquettes, gSel, gMesure);

  const cellulesEl = C.zones.map((z, i) => {
    const p = s('path', { d: polyD(C.cellules[i], true), class: 'dfx-sig-ad' });
    gFond.append(p);
    return p;
  });
  const symbolesEl = C.ressources.map((r) => {
    const st = C.secteurs.find((x) => x.id === r.secteur) || C.secteurs[0];
    const vide = r.capacite === 0;
    const g = s('g', { class: `dfx-sig-res${vide ? ' dfx-sig-res--vide' : ''}` });
    if (r.attente > 0) g.append(s('circle', { r: 12, class: 'dfx-sig-attente' }));
    g.append(s('path', { d: cheminSymbole(st?.forme, 7), fill: vide ? 'rgba(255,255,255,0.85)' : st?.couleur || '#0755AD', stroke: vide ? st?.couleur : null }));
    gSymboles.append(g);
    return g;
  });

  const echelleEl = h('div', { class: 'dfx-sig-echelle' }, h('span', { class: 'dfx-sig-echelle-barre' }), h('span', { class: 'dfx-sig-echelle-txt' }));
  const coords = h('div', { class: 'dfx-sig-coords', 'aria-hidden': 'true' });
  const fiche = h('div', { class: 'dfx-sig-fiche', hidden: true, role: 'status' });
  const outils = h('div', { class: 'dfx-sig-outils', role: 'toolbar', 'aria-label': 'Outils de la carte' },
    outilBtn('deplacer', 'main', 'Déplacer'), outilBtn('mesurer', 'regle', 'Mesurer'), outilBtn('identifier', 'identifier', 'Identifier'));
  const zoom = h('div', { class: 'dfx-sig-zoom' },
    btnIco('plus', 'Zoom avant', () => zoomer(1 / 1.4)),
    btnIco('moins', 'Zoom arrière', () => zoomer(1.4)),
    btnIco('recentrer', 'Recentrer', recentrer));
  const nord = h('div', { class: 'dfx-sig-nord', 'aria-hidden': 'true' }, s('svg', { viewBox: '0 0 24 32', width: 18, height: 24 }, s('path', { d: 'M12 2l7 20-7-5-7 5z', fill: 'currentColor' }), s('text', { x: 12, y: 31, 'text-anchor': 'middle', 'font-size': 9, fill: 'currentColor', text: 'N' })));
  const titreCarte = h('div', { class: 'dfx-sig-titre' }, h('strong', { text: C.nom }));
  const carte = h('div', { class: 'dfx-sig-carte', tabindex: '0', 'aria-label': 'Carte interactive : flèches pour déplacer, + et − pour zoomer' }, svg, titreCarte, outils, zoom, nord, echelleEl, coords, fiche);

  // ---------------------------------------------------------------- couches
  const legendeFond = h('div', { class: 'dfx-sig-legende' });
  const couches = h('div', { class: 'dfx-sig-couches' },
    h('p', { class: 'dfx-surtitre', text: 'Couches' }),
    groupe(humaniser(libZones),
      radio('fond', 'pop', 'Aînés de 65 ans et plus', true),
      radio('fond', 'acces', 'Accessibilité (2SFCA)'),
      radio('fond', 'aucun', 'Aucun fond'),
      legendeFond),
    groupe('Ressources par secteur', C.secteurs.map((x) => caseSecteur(x))),
    domaines.length ? groupe('Domaine de besoin', choixDomaine()) : null,
    groupe('Rayon d’accessibilité',
      h('div', { class: 'dfx-segments', role: 'radiogroup', 'aria-label': 'Rayon' }, [0, 500, 1000].map((r) => segment(r)))),
    groupe('Analyse',
      caseSimple('nonDesservies', `${humaniser(libZones)} non desservies dans le rayon`),
      caseSimple('pression', 'Symboles selon la pression (aînés par place)'),
      caseSimple('etiquettes', 'Étiquettes'),
      avecAttente ? h('p', { class: 'dfx-sig-cle' }, s('svg', { width: 22, height: 22, viewBox: '-12 -12 24 24', 'aria-hidden': 'true' }, s('circle', { r: 10, class: 'dfx-sig-attente' }), s('circle', { r: 5, fill: '#4F6878' })), h('span', { text: 'Cercle rouge : liste d’attente' })) : null,
      C.ressources.some((r) => r.capacite === 0) ? h('p', { class: 'dfx-sig-cle' }, s('svg', { width: 22, height: 22, viewBox: '-12 -12 24 24', 'aria-hidden': 'true' }, s('path', { d: cheminSymbole('cercle', 7), fill: '#fff', stroke: '#4F6878', 'stroke-width': 2 })), h('span', { text: 'Symbole creux : aucune ressource (0)' })) : null));

  // ---------------------------------------------------------------- indicateurs et questions
  const indicateurs = h('div', { class: 'dfx-sig-indic' });
  const tables = h('div', { class: 'dfx-sig-tables' });
  const note = def.note ? h('p', { class: 'dfx-note dfx-sig-note', text: String(def.note) }) : null;
  const questions = Array.isArray(def.questions) ? def.questions : [];
  let btn = null;
  const pq = panneauQuestions(questions, coque, { surComplet: (complet) => { if (btn) btn.disabled = !complet; } });
  const onglets = ongletsPanneau(coque, [
    { id: 'indic', titre: 'Indicateurs', contenu: h('div', {}, note, indicateurs, tables) },
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
    try { carte.setPointerCapture?.(e.pointerId); } catch { /* capture impossible */ }
    pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointeurs.size === 2) {
      const [a, b] = [...pointeurs.values()];
      geste = { type: 'pince', d0: Math.hypot(a.x - b.x, a.y - b.y), w0: vue.w };
    } else geste = { type: 'pan', x0: e.clientX, y0: e.clientY, vx: vue.x, vy: vue.y, bouge: false };
  });
  carte.addEventListener('pointermove', (e) => {
    const w = monde(e.clientX, e.clientY);
    coords.textContent = C.unite === 'km' ? `x ${nombre(w.x / 1000, 2)} km · y ${nombre(w.y / 1000, 2)} km` : `x ${nombre(w.x)} m · y ${nombre(w.y)} m`;
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
    const r = svg.getBoundingClientRect();
    const base = r.width ? largeurAjustee(r) : (C.boite.x1 - C.boite.x0) * 1.12 || 1000;
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
    if (!ajuste) { ajuste = true; vue.w = largeurAjustee(r); }
    const k = vue.w / r.width;
    const hgt = r.height * k;
    svg.setAttribute('viewBox', `${vue.x - vue.w / 2} ${-vue.y - hgt / 2} ${vue.w} ${hgt}`);
    const vis = ressourcesVisibles();
    const pres = deuxEtapes(vis, C.zones, etat.rayon || 1000).pression;
    const med = mediane(pres.filter((p) => p > 0)) || 1;
    C.ressources.forEach((rs, i) => {
      const j = vis.indexOf(rs);
      let taille = 1;
      if (etat.pression && j >= 0 && pres[j] > 0) taille = Math.max(0.7, Math.min(2.3, Math.sqrt(pres[j] / med)));
      symbolesEl[i].setAttribute('transform', `translate(${rs.x} ${-rs.y}) scale(${k * taille})`);
    });
    gEtiquettes.querySelectorAll('text').forEach((t) => {
      t.setAttribute('font-size', String(12 * k));
      t.setAttribute('stroke-width', String(3 * k));
    });
    gSel.querySelectorAll('[data-k]').forEach((el) => el.setAttribute('transform', `${el.dataset.base} scale(${k})`));
    dessinerMesure();
    const cible = 110 * k;
    const pasM = [50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 20000].find((v) => v >= cible) || 20000;
    echelleEl.querySelector('.dfx-sig-echelle-barre').style.width = `${pasM / k}px`;
    echelleEl.querySelector('.dfx-sig-echelle-txt').textContent = pasM >= 1000 ? `${nombre(pasM / 1000)} km` : `${pasM} m`;
  }

  function zoomer(f) { vue.w = borneW(vue.w * f); appliquerVue(); coque.jouer('clic'); }
  function recentrer() {
    vue.x = (C.boite.x0 + C.boite.x1) / 2;
    vue.y = (C.boite.y0 + C.boite.y1) / 2;
    const r = svg.getBoundingClientRect();
    vue.w = r.width ? largeurAjustee(r) : (C.boite.x1 - C.boite.x0) * 1.12 || 1000;
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
        coque.annoncer(`Distance : ${dist(d)}.`);
        if (d > 1000 && d < 6000 && !clicCarte.dit) {
          clicCarte.dit = true;
          coque.reagir(`${nombre(d / 1000, 1)} km à pied avec une marchette, en février ? Pas si accessible.`, { humeur: 'sceptique' });
        }
      }
      coque.jouer('clic');
      dessinerMesure();
      return;
    }
    const r = svg.getBoundingClientRect();
    const k = vue.w / r.width;
    let best = null;
    for (const rs of ressourcesVisibles()) {
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
      const lignes = [];
      if (rs.type) lignes.push(ligneDl('Type', humaniser(rs.type)));
      if (rs.domaine) lignes.push(ligneDl('Domaine de besoin', humaniser(rs.domaine)));
      if (rs.territoire) lignes.push(ligneDl('Territoire', rs.territoire));
      lignes.push(ligneDl(C.parTerritoire ? 'Nombre' : 'Capacité', capaciteConnue(rs) ? nombre(rs.capacite) : 'inconnue'));
      if (rs.attente != null) lignes.push(ligneDl('Liste d’attente', rs.attente > 0 ? `${nombre(rs.attente)} personne${rs.attente > 1 ? 's' : ''}` : 'aucune', rs.attente > 0));
      if (!C.parTerritoire) {
        lignes.push(ligneDl(`Aînés à moins de ${dist(rayon)}`, nombre(de.demande[j] ?? 0)));
        lignes.push(ligneDl('Aînés par place', j >= 0 && capaciteConnue(rs) && rs.capacite > 0 ? nombre(de.pression[j], 1) : '—'));
      }
      fiche.append(fermer,
        h('p', { class: 'dfx-sig-fiche-type' }, st ? pastilleSecteur(st, 14) : null, h('span', { text: st?.nom ?? 'Ressource' })),
        h('p', { class: 'dfx-sig-fiche-nom', text: rs.nom }),
        h('dl', {}, lignes));
    } else {
      const z = cible.z;
      const lignes = [ligneDl('Aînés (65 ans et +)', nombre(z.pop65)), ligneDl('Part des aînés du territoire', pct(popTot ? z.pop65 / popTot : 0, 1))];
      const duTerritoire = C.ressources.filter((rs) => rs.territoire && normaliser(rs.territoire) === normaliser(z.id));
      if (duTerritoire.length) {
        for (const rs of duTerritoire) {
          lignes.push(ligneDl(rs.nom, capaciteConnue(rs) ? `${nombre(rs.capacite)} · ${nombre(densitePour1000(rs.capacite, z.pop65), 2)} pour 1 000` : 'inconnu', rs.capacite === 0));
        }
      } else {
        const plusProche = vis.filter((rs) => capaciteDe(rs) > 0).reduce((mn, rs) => Math.min(mn, distance(rs, z)), Infinity);
        lignes.push(ligneDl('Ressource affichée la plus proche', Number.isFinite(plusProche) ? dist(plusProche) : '—'));
        lignes.push(ligneDl(`Accessibilité (2SFCA, ${dist(rayon)})`, `${nombre(de.acces[cible.i] ?? 0, 1)} places / 1 000`));
        for (const x of C.secteurs) {
          if (!etat.visibles.has(x.id)) continue;
          const n = vis.filter((rs) => rs.secteur === x.id && capaciteDe(rs) > 0 && distance(rs, z) <= rayon).length;
          lignes.push(ligneDl(`${x.nom} à moins de ${dist(rayon)}`, String(n)));
        }
      }
      fiche.append(fermer,
        h('p', { class: 'dfx-sig-fiche-type', text: humaniser(z.type || libZone) }),
        h('p', { class: 'dfx-sig-fiche-nom', text: z.id }),
        h('dl', {}, lignes));
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
      gSel.append(s('circle', { r: 15, class: 'dfx-sig-sel', 'data-k': '1', 'data-base': base, transform: `${base} scale(${k})` }));
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
      gMesure.append(s('text', { x: (a.x + b.x) / 2, y: -(a.y + b.y) / 2 - 10 * k, 'font-size': 13 * k, 'stroke-width': 4 * k, class: 'dfx-sig-mesure-txt', 'text-anchor': 'middle' },
        minutes <= 120 ? `${dist(d)} · ≈ ${minutes} min à pied` : dist(d)));
    }
  }

  // ---------------------------------------------------------------- couches et indicateurs
  function ressourcesVisibles() {
    return C.ressources.filter((r) => etat.visibles.has(r.secteur)
      && (!r.type || etat.types.has(r.type))
      && (!etat.domaine || r.domaine === etat.domaine));
  }

  function majTout() {
    const vis = ressourcesVisibles();
    const actives = vis.filter((r) => capaciteDe(r) > 0);
    const rayonA = etat.rayon || 1000;
    let valeurs;
    let rampe;
    let titreLeg;
    let fmt = (v) => nombre(v);
    if (etat.fond === 'pop') { valeurs = C.zones.map((z) => z.pop65); rampe = RAMPE_POP; titreLeg = `Aînés de 65 ans et plus par ${minuscule(libZone)}`; }
    else if (etat.fond === 'acces') {
      valeurs = deuxEtapes(actives, C.zones, rayonA).acces;
      rampe = RAMPE_ACCES;
      titreLeg = `Places pour 1 000 aînés à moins de ${dist(rayonA)} (ressources affichées)`;
      fmt = (v) => nombre(v, 1);
    }
    vider(legendeFond);
    if (valeurs) {
      const positifs = etat.fond === 'acces' ? valeurs.filter((v) => v > 0) : valeurs;
      const nClasses = Math.min(etat.fond === 'acces' ? 4 : 5, Math.max(1, new Set(positifs).size));
      const seuils = seuilsQuantiles(positifs, nClasses);
      const decal = etat.fond === 'acces' ? 1 : 0;
      const etale = (c) => (nClasses <= 1 ? (etat.fond === 'acces' ? 3 : 2) : Math.round((c * ((etat.fond === 'acces' ? 4 : 5) - 1)) / (nClasses - 1)));
      const classe = (v) => (etat.fond === 'acces' && v <= 0 ? 0 : decal + etale(classeDe(v, seuils)));
      cellulesEl.forEach((p, i) => { p.setAttribute('fill', rampe[Math.min(rampe.length - 1, classe(valeurs[i]))]); p.classList.remove('dfx-sig-ad--vide'); });
      legendeFond.append(h('p', { class: 'dfx-sig-legende-titre', text: titreLeg }));
      const libelles = etiquettesClasses(seuils, nClasses, fmt).map((txt, c) => ({ txt, couleur: rampe[Math.min(rampe.length - 1, decal + etale(c))] }));
      if (etat.fond === 'acces' && valeurs.some((v) => v <= 0)) libelles.unshift({ txt: 'aucune place accessible', couleur: rampe[0] });
      legendeFond.append(h('ul', { class: 'dfx-sig-legende-liste' }, libelles.map((l) => h('li', {}, h('span', { class: 'dfx-sig-case', style: { background: l.couleur } }), h('span', { text: l.txt })))));
    } else {
      cellulesEl.forEach((p) => { p.setAttribute('fill', 'transparent'); p.classList.add('dfx-sig-ad--vide'); });
    }

    vider(gHach);
    if (etat.nonDesservies && etat.rayon) {
      const sans = new Set(zonesSansRessource(C.zones, vis, etat.rayon).map((z) => z.id));
      C.zones.forEach((z, i) => { if (sans.has(z.id)) gHach.append(s('path', { d: polyD(C.cellules[i], true), fill: `url(#${idHach})`, class: 'dfx-sig-hach' })); });
    }

    vider(gRayons);
    if (etat.rayon) for (const rs of actives) {
      const st = C.secteurs.find((x) => x.id === rs.secteur);
      gRayons.append(s('circle', { cx: rs.x, cy: -rs.y, r: etat.rayon, class: 'dfx-sig-rayon', stroke: st?.couleur, fill: st?.couleur }));
    }

    const ensembleVis = new Set(vis);
    C.ressources.forEach((rs, i) => { symbolesEl[i].style.display = ensembleVis.has(rs) ? '' : 'none'; });
    const pres = deuxEtapes(vis, C.zones, rayonA).pression;
    const med = mediane(pres.filter((p) => p > 0)) || 1;
    C.ressources.forEach((rs, i) => {
      const j = vis.indexOf(rs);
      symbolesEl[i].classList.toggle('dfx-sig-res--sature', etat.pression && j >= 0 && pres[j] >= med * 1.6);
    });

    vider(gEtiquettes);
    if (etat.etiquettes) {
      const kk = vue.w / (svg.getBoundingClientRect().width || 1);
      for (const z of C.zones) gEtiquettes.append(s('text', { x: z.x, y: -z.y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'dfx-sig-etiq-ad' }, C.zones.some((x) => x.type) ? String(z.id) : String(z.id).slice(-4)));
      if (!C.parTerritoire) for (const rs of vis) gEtiquettes.append(s('text', { x: rs.x, y: -rs.y - 14 * kk, 'text-anchor': 'middle', class: 'dfx-sig-etiq-res' }, rs.nom));
    }

    majIndicateurs(vis);
    appliquerVue();
    dessinerSelection();
    if (identifie) {
      if (identifie.type === 'res' && !ensembleVis.has(identifie.rs)) fermerFiche();
      else identifier(identifie, true);
    }
  }

  function majIndicateurs(vis) {
    vider(indicateurs);
    const rayon = etat.rayon;
    indicateurs.append(h('div', { class: 'dfx-sig-resume' },
      h('div', {}, h('strong', { brut: nombre(popTot) }), h('span', { text: 'aînés de 65 ans et plus' })),
      h('div', {}, h('strong', { brut: String(C.zones.length) }), h('span', { text: libZones })),
      h('div', {}, h('strong', { brut: String(vis.length) }), h('span', { text: `ressource${vis.length > 1 ? 's' : ''} affichée${vis.length > 1 ? 's' : ''}` }))));
    const entete = ['Secteur', C.parTerritoire ? 'total' : 'n', 'pour 1 000 aînés'];
    if (!C.parTerritoire) entete.push('places pour 1 000');
    if (rayon && !C.parTerritoire) entete.push(`aînés à ${dist(rayon)}`);
    const tbody = h('tbody');
    for (const x of C.secteurs) {
      const rs = vis.filter((r) => r.secteur === x.id);
      const tousSecteur = C.ressources.filter((r) => r.secteur === x.id);
      const st = statsSecteur(rs, C.zones, rayon);
      const n = C.parTerritoire ? rs.reduce((t, r) => t + (capaciteConnue(r) ? r.capacite : 0), 0) : rs.filter((r) => capaciteDe(r) > 0).length;
      const cache = !etat.visibles.has(x.id) || (tousSecteur.length && !rs.length);
      tbody.append(h('tr', { class: `${cache ? 'dfx-sig-ligne-cachee' : ''}${tousSecteur.length === 0 && !C.parTerritoire ? ' dfx-sig-ligne-absente' : ''}` },
        h('th', { scope: 'row' }, pastilleSecteur(x, 14), h('span', { text: x.nom })),
        h('td', { brut: String(n) }),
        h('td', { brut: nombre(densitePour1000(n, popTot), 2) }),
        C.parTerritoire ? null : h('td', { brut: rs.length && rs.every(capaciteConnue) ? nombre(st.places, 1) : '—' }),
        rayon && !C.parTerritoire ? h('td', { brut: n ? pct(st.couverture ?? 0) : `0${' '}%` }) : null));
    }
    const nTous = C.parTerritoire ? vis.reduce((t, r) => t + (capaciteConnue(r) ? r.capacite : 0), 0) : vis.filter((r) => capaciteDe(r) > 0).length;
    const stTous = statsSecteur(vis.filter((r) => capaciteDe(r) > 0), C.zones, rayon);
    const tfoot = h('tfoot', {}, h('tr', {},
      h('th', { scope: 'row', text: 'Ressources affichées' }),
      h('td', { brut: String(nTous) }),
      h('td', { brut: nombre(densitePour1000(nTous, popTot), 2) }),
      C.parTerritoire ? null : h('td', { brut: vis.length && vis.every(capaciteConnue) ? nombre(stTous.places, 1) : '—' }),
      rayon && !C.parTerritoire ? h('td', { brut: pct(stTous.couverture ?? 0) }) : null));
    indicateurs.append(h('div', { class: 'dfx-table-defile' }, h('table', { class: 'dfx-table dfx-sig-table' },
      h('caption', { text: C.parTerritoire ? 'Ressources par secteur, pour 1 000 aînés' : 'Densité par secteur (ressources ÷ aînés × 1 000)' }),
      h('thead', {}, h('tr', {}, entete.map((t) => h('th', { scope: 'col', text: t })))), tbody, tfoot)));

    vider(tables);
    const rayonA = rayon || 1000;
    const de = deuxEtapes(vis, C.zones, rayonA);
    if (!C.parTerritoire) {
      const lignesRes = vis.map((r, j) => ({ r, j })).sort((a, b) => de.pression[b.j] - de.pression[a.j]);
      const colonnes = ['Ressource', 'Secteur', 'Capacité'];
      if (avecAttente) colonnes.push('Attente');
      colonnes.push(`Aînés à ${dist(rayonA)}`, 'Aînés par place');
      tables.append(h('details', { class: 'dfx-sig-attributs' },
        h('summary', { text: `Table attributaire des ressources affichées (${vis.length})` }),
        h('div', { class: 'dfx-table-defile' }, h('table', { class: 'dfx-table' },
          h('thead', {}, h('tr', {}, colonnes.map((t) => h('th', { scope: 'col', text: t })))),
          h('tbody', {}, lignesRes.map(({ r, j }) => h('tr', {},
            h('th', { scope: 'row', text: r.nom }),
            h('td', { text: C.secteurs.find((x) => x.id === r.secteur)?.nom ?? '' }),
            h('td', { brut: capaciteConnue(r) ? nombre(r.capacite) : '—' }),
            avecAttente ? h('td', { brut: r.attente != null ? nombre(r.attente) : '—' }) : null,
            h('td', { brut: nombre(de.demande[j]) }),
            h('td', { brut: capaciteConnue(r) && r.capacite > 0 ? nombre(de.pression[j], 1) : '—' }))))))));
    }
    const sansR = new Set(rayon ? zonesSansRessource(C.zones, vis, rayon).map((z) => z.id) : []);
    const typesTerr = C.parTerritoire ? [...new Set(vis.map((r) => r.type || r.nom))] : [];
    const entetesZ = [humaniser(libZone), '65 ans et +', 'part'];
    if (C.parTerritoire) entetesZ.push(...typesTerr.map((t) => humaniser(t)));
    else {
      entetesZ.push(`2SFCA (${dist(rayonA)})`);
      if (rayon) entetesZ.push(`desservie à ${dist(rayon)}`);
    }
    tables.append(h('details', { class: 'dfx-sig-attributs', open: C.parTerritoire || null },
      h('summary', { text: `Table attributaire des ${libZones} (${C.zones.length})` }),
      h('div', { class: 'dfx-table-defile' }, h('table', { class: 'dfx-table' },
        h('thead', {}, h('tr', {}, entetesZ.map((t) => h('th', { scope: 'col', text: t })))),
        h('tbody', {}, C.zones.map((z, i) => ({ z, i })).sort((a, b) => b.z.pop65 - a.z.pop65).map(({ z, i }) => h('tr', {},
          h('th', { scope: 'row', text: z.id }),
          h('td', { brut: nombre(z.pop65) }),
          h('td', { brut: pct(popTot ? z.pop65 / popTot : 0) }),
          ...(C.parTerritoire
            ? typesTerr.map((t) => {
              const r = vis.find((x) => (x.type || x.nom) === t && normaliser(x.territoire) === normaliser(z.id));
              return h('td', { class: r && r.capacite === 0 ? 'dfx-sig-zero' : null, brut: r && capaciteConnue(r) ? nombre(r.capacite) : '—' });
            })
            : [h('td', { brut: nombre(de.acces[i], 1) }), rayon ? h('td', { text: sansR.has(z.id) ? 'non' : 'oui' }) : null]))))))));
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
    const liste = C.ressources.filter((r) => r.secteur === x.id);
    const n = C.parTerritoire ? liste.reduce((t, r) => t + (capaciteConnue(r) ? r.capacite : 0), 0) : liste.length;
    const inp = h('input', { type: 'checkbox' });
    inp.checked = true;
    inp.addEventListener('change', () => {
      if (inp.checked) etat.visibles.add(x.id); else etat.visibles.delete(x.id);
      sous?.querySelectorAll('input').forEach((i) => { i.disabled = !inp.checked; });
      coque.jouer('clic');
      majTout();
    });
    const typesS = [...new Set(liste.map((r) => r.type).filter(Boolean))];
    let sous = null;
    if (typesS.length > 1) {
      sous = h('div', { class: 'dfx-sig-sous' }, typesS.map((t) => {
        const i2 = h('input', { type: 'checkbox' });
        i2.checked = true;
        i2.addEventListener('change', () => {
          if (i2.checked) etat.types.add(t); else etat.types.delete(t);
          coque.jouer('clic');
          majTout();
        });
        const nt = liste.filter((r) => r.type === t).length;
        return h('label', { class: 'dfx-choix-ligne dfx-choix-ligne--sous' }, i2, h('span', { text: humaniser(t) }), h('span', { class: 'dfx-sig-n', brut: String(nt) }));
      }));
    }
    return h('div', { class: 'dfx-sig-secteur' },
      h('label', { class: 'dfx-choix-ligne' }, inp, pastilleSecteur(x, 16), h('span', { text: x.nom }), h('span', { class: `dfx-sig-n${n || C.parTerritoire ? '' : ' dfx-sig-n--zero'}`, brut: String(n) })),
      sous);
  }
  function choixDomaine() {
    const sel = h('select', { class: 'dfx-select', 'aria-label': 'Domaine de besoin' },
      h('option', { value: '', text: 'Tous les domaines' }),
      domaines.map((d) => h('option', { value: d, text: `${humaniser(d)} (${C.ressources.filter((r) => r.domaine === d).length})` })));
    sel.addEventListener('change', () => { etat.domaine = sel.value; coque.jouer('clic'); majTout(); });
    return sel;
  }
  function caseSimple(cle, libelle) {
    const inp = h('input', { type: 'checkbox' });
    inp.addEventListener('change', () => {
      etat[cle] = inp.checked;
      coque.jouer('clic');
      if (cle === 'nonDesservies' && inp.checked && !etat.rayon) {
        etat.rayon = 500;
        couches.querySelectorAll('.dfx-segment').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.r === '500')));
        coque.setStatut('Rayon de 500 m activé pour repérer les zones non desservies.');
      }
      majTout();
    });
    return h('label', { class: 'dfx-choix-ligne' }, inp, h('span', { text: libelle }));
  }
  function segment(r) {
    const b = h('button', { class: 'dfx-segment', type: 'button', role: 'radio', 'aria-checked': String(r === 0), dataset: { r: String(r) }, text: r ? dist(r) : 'Aucun' });
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
      coque.setStatut(id === 'mesurer' ? 'Mesure : clique un point de départ, puis un point d’arrivée.' : id === 'identifier' ? 'Identifier : clique une ressource ou une zone.' : 'Déplacer : glisse la carte, molette pour zoomer.');
    });
    return b;
  }

  function finir(tempsEcoule) {
    if (coque.estTermine()) return;
    const res = pq.corriger();
    coque.terminer({
      score: res.score,
      details: { justes: res.justes, total: res.total, reponses: res.choix, tempsEcoule },
    }, (zone) => pq.rendreCorrection(zone));
  }

  return { surTempsEcoule: () => finir(true) };
}

function minuscule(t) {
  const mots = String(t).split(' ');
  if (mots[0] && mots[0] !== mots[0].toUpperCase()) mots[0] = mots[0].charAt(0).toLowerCase() + mots[0].slice(1);
  return mots.join(' ');
}

function pluriel(t) {
  const mots = String(t).split(' ');
  const m = mots[0];
  if (m && !/[sxz]$/i.test(m)) mots[0] = /al$/i.test(m) ? m.replace(/al$/i, 'aux') : `${m}s`;
  const de = mots.indexOf('de');
  for (let i = 1; i < (de > 0 ? de : mots.length); i++) if (/^[a-zà-ÿ]+$/.test(mots[i]) && !/[sxz]$/.test(mots[i])) mots[i] = `${mots[i]}s`;
  return mots.join(' ');
}

function polyD(poly, inverser = true) {
  if (!poly || !poly.length) return '';
  return `M${poly.map((p) => `${p[0].toFixed(1)},${(inverser ? -p[1] : p[1]).toFixed(1)}`).join('L')}Z`;
}

function etiquettesClasses(seuils, n, fmt) {
  const out = [];
  if (n <= 1 || !seuils.length) return ['toutes les zones'];
  for (let c = 0; c < n; c++) {
    if (c === 0) out.push(`jusqu’à ${fmt(seuils[0])}`);
    else if (c < n - 1) out.push(`${fmt(seuils[c - 1])} à ${fmt(seuils[c])}`);
    else out.push(`plus de ${fmt(seuils[seuils.length - 1])}`);
  }
  return out;
}

function mediane(v) {
  if (!v.length) return 0;
  const t = v.slice().sort((a, b) => a - b);
  const m = Math.floor(t.length / 2);
  return t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2;
}

function ligneDl(dt, dd, alerte = false) {
  return [h('dt', { text: dt }), h('dd', { class: alerte ? 'dfx-sig-alerte' : null, text: dd })];
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
