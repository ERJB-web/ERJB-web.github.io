// Outils d'interface communs aux défis.

export const NB = ' ';

export function typo(s) {
  if (s == null) return '';
  return String(s)
    .replace(/[  ]([;:!?»%])/g, `${NB}$1`)
    .replace(/« /g, `«${NB}`)
    .replace(/'/g, '’');
}

export function h(tag, attrs, ...enfants) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = typo(v);
      else if (k === 'brut') el.textContent = v;
      else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
      else if (k === 'style' && typeof v === 'object') {
        for (const [p, val] of Object.entries(v)) {
          if (p.startsWith('--')) el.style.setProperty(p, val);
          else el.style[p] = val;
        }
      }
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
  }
  ajouter(el, enfants);
  return el;
}

function ajouter(el, enfants) {
  for (const e of enfants.flat(Infinity)) {
    if (e == null || e === false) continue;
    el.append(e instanceof Node ? e : document.createTextNode(typo(e)));
  }
}

export function vider(el) {
  while (el.firstChild) el.firstChild.remove();
  return el;
}

const NS = 'http://www.w3.org/2000/svg';

export function s(tag, attrs, ...enfants) {
  const el = document.createElementNS(NS, tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.setAttribute('class', v);
      else if (k === 'text') el.textContent = typo(v);
      else if (k === 'dataset') for (const [dk, dv] of Object.entries(v)) el.setAttribute(`data-${dk.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`, dv);
      else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
      else el.setAttribute(k, v);
    }
  }
  for (const e of enfants.flat(Infinity)) {
    if (e == null || e === false) continue;
    el.append(e instanceof Node ? e : document.createTextNode(typo(e)));
  }
  return el;
}

const TRAITS = {
  fermer: '<path d="M6 6l12 12M18 6L6 18"/>',
  valider: '<path d="M4.5 12.5l4.8 4.8L19.5 7"/>',
  horloge: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.1"/>',
  recherche: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  lancer: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  haut: '<path d="M12 19V5M6.5 10.5L12 5l5.5 5.5"/>',
  bas: '<path d="M12 5v14M6.5 13.5L12 19l5.5-5.5"/>',
  droite: '<path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5"/>',
  gauche: '<path d="M19 12H5M10.5 6.5L5 12l5.5 5.5"/>',
  poignee: '<circle cx="9" cy="6" r="1.3" fill="currentColor"/><circle cx="15" cy="6" r="1.3" fill="currentColor"/><circle cx="9" cy="12" r="1.3" fill="currentColor"/><circle cx="15" cy="12" r="1.3" fill="currentColor"/><circle cx="9" cy="18" r="1.3" fill="currentColor"/><circle cx="15" cy="18" r="1.3" fill="currentColor"/>',
  cadenas: '<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  ouvert: '<rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.7-1.5"/>',
  preuve: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',
  couches: '<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/><path d="M3.5 12.5l8.5 4.5 8.5-4.5"/><path d="M3.5 16.5l8.5 4.5 8.5-4.5" opacity=".5"/>',
  regle: '<path d="M3.5 15.5l12-12 5 5-12 12z"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2"/>',
  cible: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  reseau: '<circle cx="12" cy="12" r="2.6"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="6" cy="19" r="1.8"/><circle cx="19" cy="17.5" r="1.8"/><path d="M10 10.3L6.4 7.2M14 10.3l3.6-3.1M10.2 13.9l-2.8 3.6M14.2 13.3l3.3 3"/>',
  balance: '<path d="M12 4v16M7 20h10M5 7.5h14"/><path d="M5 7.5L2.5 13a2.6 2.6 0 0 0 5 0zM19 7.5L16.5 13a2.6 2.6 0 0 0 5 0z"/>',
  bacs: '<rect x="3.5" y="4" width="7" height="7" rx="1.5"/><rect x="13.5" y="4" width="7" height="7" rx="1.5"/><rect x="3.5" y="14" width="7" height="6.5" rx="1.5"/><rect x="13.5" y="14" width="7" height="6.5" rx="1.5"/>',
  ordre: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 5l1.5-1v5M3.8 13.5a1.6 1.6 0 1 1 2.6 1.2L4 17.5h2.8"/>',
  filtre: '<path d="M4 5h16l-6.2 7.5v5.5l-3.6 2v-7.5z"/>',
  lien: '<circle cx="5.5" cy="7" r="2.2"/><circle cx="18.5" cy="17" r="2.2"/><path d="M7.6 7.6C14 8.5 10 15.5 16.4 16.4"/>',
  carte: '<path d="M9 4.5L3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  jury: '<circle cx="12" cy="7.5" r="3"/><circle cx="5" cy="9.5" r="2.2"/><circle cx="19" cy="9.5" r="2.2"/><path d="M6.5 20a5.5 5.5 0 0 1 11 0M1.5 19a3.6 3.6 0 0 1 5.4-3.2M22.5 19a3.6 3.6 0 0 0-5.4-3.2"/>',
  micro: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  moins: '<path d="M5 12h14"/>',
  recentrer: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2.5"/>',
  main: '<path d="M8 12.5V6.5a1.5 1.5 0 0 1 3 0v5M11 11.5v-7a1.5 1.5 0 0 1 3 0v7M14 11.5v-5a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 6.5-6 6.5-2.6 0-4-1.2-5.6-3.6L3.6 13.4a1.5 1.5 0 0 1 2.4-1.8L8 14"/>',
  identifier: '<path d="M5 3.5l12.5 7-5.5 1.5-2.5 5.5z"/><path d="M13 13l5 5"/>',
  avertissement: '<path d="M12 4L2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17v.1"/>',
  pas: '<ellipse cx="8" cy="8" rx="2.6" ry="4" transform="rotate(-12 8 8)"/><ellipse cx="16" cy="15" rx="2.6" ry="4" transform="rotate(-12 16 15)"/><path d="M7 14.2l1.8.6M15 21l1.8.6"/>',
  inclure: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.8 2.8L16.3 9.5"/>',
  exclure: '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
  crayon: '<path d="M4 20l1-4.5L15.5 5a2 2 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>',
  guillemets: '<path d="M10 7c-3 1-4.5 3.5-4.5 6.5V17H10v-4.5H7.5M18.5 7c-3 1-4.5 3.5-4.5 6.5V17h4.5v-4.5H16"/>',
  etoile: '<path d="M12 4v16M5.1 8l13.8 8M5.1 16L18.9 8"/>',
  retour: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  livre: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  calque: '<path d="M3 12h18M12 3v18" opacity=".4"/><circle cx="12" cy="12" r="8.5"/>',
  oeil: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  ascenseur: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M8 9.5l1.5-2 1.5 2M8 14.5l1.5 2 1.5-2" />',
  aide: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6M12 16.6v.1"/>',
  drapeau: '<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>',
  supprimer: '<path d="M5 7h14M10 4h4M7 7l1 13h8l1-13"/>',
};

export function icone(nom, cls = '') {
  const t = document.createElement('template');
  t.innerHTML = `<svg class="dfx-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${TRAITS[nom] || ''}</svg>`;
  return t.content.firstChild;
}

const fmtCache = new Map();
function format(dec) {
  if (!fmtCache.has(dec)) {
    fmtCache.set(dec, new Intl.NumberFormat('fr-CA', { minimumFractionDigits: dec, maximumFractionDigits: dec }));
  }
  return fmtCache.get(dec);
}

export function nombre(x, dec = 0) {
  if (!Number.isFinite(x)) return '—';
  return format(dec).format(x).replace(/ /g, NB);
}

export function pct(x, dec = 0) {
  if (!Number.isFinite(x)) return '—';
  return `${nombre(x * 100, dec)}${NB}%`;
}

export function duree(sec) {
  const t = Math.max(0, Math.ceil(sec));
  const m = Math.floor(t / 60);
  const r = t % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

const SIGLES = new Set(['ad', 'clsc', 'sad', 'rta', 'sig', 'gmf', 'rls', 'rts', 'omh', 'hlm', 'rpa', 'chsld', 'spvm', 'stm', 'cer', 'osf', 'jbi', 'pcc', 'msss', 'inspq', 'isq', 'oemc', 'qgis']);
export function humaniser(id) {
  const t = String(id ?? '').replace(/[_-]+/g, ' ').trim().split(/\s+/).map((m) => (SIGLES.has(m.toLowerCase()) ? m.toUpperCase() : m)).join(' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function lettre(i) {
  return String.fromCharCode(65 + i);
}

export function attendre(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function focusables(racine) {
  return [...racine.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((e) => e.offsetParent !== null || e === document.activeElement);
}

// Glisser au pointeur avec seuil ; renvoie une fonction de détachement.
// tactile : true (partout), false (jamais) ou sélecteur de la zone de prise au doigt.
export function glisser(el, { surDebut, surDeplacement, surFin, seuil = 5, tactile = true, ignorer = null }) {
  let etat = null;
  const cible = el;
  function bas(ev) {
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    if (ignorer && ev.target.closest?.(ignorer)) return;
    if (ev.pointerType === 'touch') {
      if (tactile === false) return;
      if (typeof tactile === 'string' && !ev.target.closest?.(tactile)) return;
    }
    etat = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, actif: false, type: ev.pointerType, cibleInitiale: ev.target };
    try { cible.setPointerCapture?.(ev.pointerId); } catch { /* capture impossible */ }
  }
  function deplace(ev) {
    if (!etat || ev.pointerId !== etat.id) return;
    const dx = ev.clientX - etat.x0;
    const dy = ev.clientY - etat.y0;
    if (!etat.actif) {
      if (Math.hypot(dx, dy) < seuil) return;
      etat.actif = true;
      surDebut?.(ev, etat);
    }
    ev.preventDefault();
    surDeplacement?.(ev, etat, dx, dy);
  }
  function haut(ev) {
    if (!etat || ev.pointerId !== etat.id) return;
    const e = etat;
    etat = null;
    try { cible.releasePointerCapture?.(ev.pointerId); } catch { /* déjà relâché */ }
    if (e.actif) {
      surFin?.(ev, e, ev.type === 'pointercancel');
      const bloquer = (c) => { c.stopPropagation(); c.preventDefault(); };
      el.addEventListener('click', bloquer, { capture: true, once: true });
      setTimeout(() => el.removeEventListener('click', bloquer, { capture: true }), 60);
    }
  }
  cible.addEventListener('pointerdown', bas);
  cible.addEventListener('pointermove', deplace);
  cible.addEventListener('pointerup', haut);
  cible.addEventListener('pointercancel', haut);
  return () => {
    cible.removeEventListener('pointerdown', bas);
    cible.removeEventListener('pointermove', deplace);
    cible.removeEventListener('pointerup', haut);
    cible.removeEventListener('pointercancel', haut);
  };
}

export function elementSous(x, y, selecteur) {
  const pile = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [document.elementFromPoint(x, y)];
  for (const e of pile) {
    const c = e?.closest?.(selecteur);
    if (c) return c;
  }
  return null;
}

// Défilement automatique d'un conteneur quand le pointeur approche d'un bord.
export function defilerPres(conteneur, y, marge = 48, vitesse = 14) {
  if (!conteneur) return;
  const r = conteneur.getBoundingClientRect();
  if (y < r.top + marge) conteneur.scrollTop -= vitesse * (1 - (y - r.top) / marge);
  else if (y > r.bottom - marge) conteneur.scrollTop += vitesse * (1 - (r.bottom - y) / marge);
}

// Animation FLIP : mémoriser les positions, puis animer après modification du DOM.
export function memoriserPositions(elements) {
  const m = new Map();
  for (const e of elements) m.set(e, e.getBoundingClientRect());
  return m;
}

export function animerDepuis(positions, calme, duree = 220) {
  if (calme) return;
  for (const [e, avant] of positions) {
    if (!e.isConnected) continue;
    const apres = e.getBoundingClientRect();
    const dx = avant.left - apres.left;
    const dy = avant.top - apres.top;
    if (!dx && !dy) continue;
    e.animate?.([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: duree, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
}

export function compteurAnime(el, de, a, { duree = 600, calme = false, format: f = (v) => nombre(v) } = {}) {
  if (calme || !window.requestAnimationFrame) {
    el.textContent = f(a);
    return;
  }
  const t0 = performance.now();
  function pas(t) {
    const k = Math.min(1, (t - t0) / duree);
    const e = 1 - (1 - k) ** 3;
    el.textContent = f(de + (a - de) * e);
    if (k < 1) requestAnimationFrame(pas);
  }
  requestAnimationFrame(pas);
}

// Portraits stylisés (personnages fictifs, formes simples).
const PERSONNAGES = {
  collegue: { peau: '#E9C3A5', cheveux: '#3B2A22', coupe: 'queue', haut: '#11A7A5', lunettes: false },
  bibliothecaire: { peau: '#C99A78', cheveux: '#1E1B1A', coupe: 'carre', haut: '#4F6878', lunettes: true },
  direction: { peau: '#EBC9B0', cheveux: '#6E6A68', coupe: 'chignon', haut: '#253439', lunettes: true },
  jury1: { peau: '#EED1BC', cheveux: '#B9B5B0', coupe: 'carre', haut: '#253439', lunettes: true },
  jury2: { peau: '#B98263', cheveux: '#2A1F1A', coupe: 'court', haut: '#4F6878', lunettes: false, barbe: true },
  jury3: { peau: '#8E5F45', cheveux: '#17120F', coupe: 'boucles', haut: '#0879BE', lunettes: false, foulard: true },
  gestionnaire: { peau: '#DDB08F', cheveux: '#4A3426', coupe: 'chignon', haut: '#0755AD', lunettes: false, cordon: true },
};

export function portrait(qui, humeur = 'neutre', taille = 64) {
  const p = PERSONNAGES[qui] || PERSONNAGES.collegue;
  const g = s('svg', { class: `dfx-portrait dfx-portrait--${qui}`, viewBox: '0 0 100 100', width: taille, height: taille, 'aria-hidden': 'true' });
  g.append(s('circle', { cx: 50, cy: 50, r: 50, class: 'dfx-portrait-fond' }));
  const haut = s('path', { d: 'M14 100c2-20 16-30 36-30s34 10 36 30z', fill: p.haut });
  g.append(haut);
  if (p.foulard) g.append(s('path', { d: 'M34 72c6 8 26 8 32 0l-3 10c-8 5-18 5-26 0z', fill: '#11A7A5' }));
  if (p.cordon) g.append(s('path', { d: 'M40 72l10 20 10-20', fill: 'none', stroke: '#F6F4F1', 'stroke-width': 2 }), s('rect', { x: 45, y: 88, width: 10, height: 8, rx: 1.5, fill: '#F6F4F1' }));
  g.append(s('rect', { x: 43, y: 58, width: 14, height: 14, rx: 5, fill: p.peau }));
  if (p.coupe === 'queue') g.append(s('path', { d: 'M70 36c10 4 12 20 4 30-2-10-4-18-4-30z', fill: p.cheveux }));
  if (p.coupe === 'chignon') g.append(s('circle', { cx: 50, cy: 18, r: 9, fill: p.cheveux }));
  if (p.coupe === 'carre') g.append(s('path', { d: 'M26 44c0-18 10-26 24-26s24 8 24 26v16c-4 2-6 2-8 0V40H34v20c-2 2-4 2-8 0z', fill: p.cheveux }));
  g.append(s('ellipse', { cx: 50, cy: 44, rx: 18, ry: 21, fill: p.peau }));
  const coupes = {
    queue: 'M31 42c0-14 8-22 19-22s19 7 19 20c-8-2-16-7-20-13-3 7-10 12-18 15z',
    chignon: 'M31 42c0-13 8-20 19-20s19 7 19 20c-4-6-10-10-19-10s-15 4-19 10z',
    carre: 'M31 40c1-12 8-19 19-19s18 7 19 19c-6-5-12-8-19-8s-13 3-19 8z',
    court: 'M32 38c1-11 8-16 18-16s17 5 18 16c-3-3-8-6-18-6s-15 3-18 6z',
    boucles: 'M30 44c-4-14 6-26 20-26s24 12 20 26c-2-6-4-10-6-12-2 4-8 6-14 6s-12-2-14-6c-2 2-4 6-6 12z',
  };
  g.append(s('path', { d: coupes[p.coupe] || coupes.court, fill: p.cheveux }));
  if (p.coupe === 'boucles') {
    for (const [x, y] of [[30, 30], [36, 22], [46, 18], [56, 18], [65, 23], [70, 31]]) g.append(s('circle', { cx: x, cy: y, r: 6, fill: p.cheveux }));
  }
  if (p.barbe) g.append(s('path', { d: 'M33 48c2 14 8 19 17 19s15-5 17-19c-3 5-8 7-17 7s-14-2-17-7z', fill: p.cheveux, opacity: 0.85 }));
  const visage = s('g', { class: 'dfx-visage' });
  const sourcil = {
    neutre: ['M38 37h8', 'M54 37h8'],
    content: ['M38 36q4-2 8 0', 'M54 36q4-2 8 0'],
    ravi: ['M38 35q4-3 8 0', 'M54 35q4-3 8 0'],
    sceptique: ['M38 36l8 1.5', 'M54 35.5l8-2'],
    fache: ['M38 35l8 3', 'M54 38l8-3'],
    surpris: ['M38 33q4-2 8 0', 'M54 33q4-2 8 0'],
  }[humeur] || ['M38 37h8', 'M54 37h8'];
  const bouche = {
    neutre: 'M44 55h12',
    content: 'M43 54q7 5 14 0',
    ravi: 'M42 53q8 8 16 0z',
    sceptique: 'M44 56q6-2 12 1',
    fache: 'M43 57q7-4 14 0',
    surpris: 'M47 55a3 3.5 0 1 0 6 0a3 3.5 0 1 0-6 0',
  }[humeur] || 'M44 55h12';
  const encre = '#253439';
  sourcil.forEach((d) => visage.append(s('path', { d, stroke: encre, 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: 'none' })));
  visage.append(s('circle', { cx: 42, cy: 43, r: 2.1, fill: encre }), s('circle', { cx: 58, cy: 43, r: 2.1, fill: encre }));
  visage.append(s('path', { d: bouche, stroke: encre, 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: humeur === 'ravi' ? '#fff' : 'none' }));
  if (p.lunettes) {
    visage.append(s('rect', { x: 35.5, y: 38.5, width: 12, height: 9, rx: 3, fill: 'none', stroke: encre, 'stroke-width': 1.6 }));
    visage.append(s('rect', { x: 52.5, y: 38.5, width: 12, height: 9, rx: 3, fill: 'none', stroke: encre, 'stroke-width': 1.6 }));
    visage.append(s('path', { d: 'M47.5 42h5', stroke: encre, 'stroke-width': 1.6 }));
  }
  g.append(visage);
  return g;
}

// Symbologie des secteurs : forme et couleur distinctes (lisible sans la couleur).
const STYLES_SECTEURS = [
  { forme: 'cercle', couleur: '#0755AD' },
  { forme: 'carre', couleur: '#11A7A5' },
  { forme: 'triangle', couleur: '#4F6878' },
  { forme: 'losange', couleur: '#3E8A22' },
  { forme: 'hexagone', couleur: '#0879BE' },
  { forme: 'maison', couleur: '#253439' },
  { forme: 'etoile', couleur: '#0D2A3A' },
  { forme: 'croix', couleur: '#5AAE38' },
];
const CANONIQUES = [
  [/^(s1\b|reseau public|public|rss|sante et services sociaux)/, 0],
  [/^(s2\b|premiere ligne|soins primaires|clinique)/, 1],
  [/^(s3\b|parapublic)/, 2],
  [/^(s4\b|communaut|organisme)/, 3],
  [/^(s5\b|municipal|ville|arrondissement)/, 4],
  [/^(s6\b|habitation|logement)/, 5],
];

function sansAccents(t) {
  return String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function styleSecteurs(secteurs) {
  const pris = new Set();
  const out = secteurs.map((sec) => {
    const brut = sansAccents(sec.nom || sec.id);
    const n = brut.replace(/^s\d\s*[-·:.]?\s*/, '');
    let k = null;
    for (const [re, i] of CANONIQUES) if (re.test(n)) { k = i; break; }
    if (k == null) for (const [re, i] of CANONIQUES) if (re.test(brut)) { k = i; break; }
    if (k != null && pris.has(k)) k = null;
    if (k != null) pris.add(k);
    return { ...sec, k };
  });
  let libre = 0;
  for (const sec of out) {
    if (sec.k != null) continue;
    while (pris.has(libre) && libre < STYLES_SECTEURS.length) libre++;
    sec.k = libre < STYLES_SECTEURS.length ? libre : out.indexOf(sec) % STYLES_SECTEURS.length;
    pris.add(sec.k);
  }
  return out.map((sec) => ({ ...sec, ...STYLES_SECTEURS[sec.k] }));
}

export function cheminSymbole(forme, r = 1) {
  const poly = (n, rot = -Math.PI / 2, rr = r) => {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = rot + (2 * Math.PI * i) / n;
      p.push(`${(rr * Math.cos(a)).toFixed(3)},${(rr * Math.sin(a)).toFixed(3)}`);
    }
    return `M${p.join('L')}Z`;
  };
  switch (forme) {
    case 'carre': return `M${-r * 0.85},${-r * 0.85}h${r * 1.7}v${r * 1.7}h${-r * 1.7}Z`;
    case 'triangle': return poly(3, -Math.PI / 2, r * 1.15);
    case 'losange': return poly(4, -Math.PI / 2, r * 1.15);
    case 'hexagone': return poly(6, 0, r * 1.02);
    case 'maison': return `M0,${-r * 1.1}L${r},${-r * 0.2}V${r * 0.95}H${-r}V${-r * 0.2}Z`;
    case 'etoile': {
      const p = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (Math.PI * i) / 5;
        const rr = i % 2 ? r * 0.5 : r * 1.15;
        p.push(`${(rr * Math.cos(a)).toFixed(3)},${(rr * Math.sin(a)).toFixed(3)}`);
      }
      return `M${p.join('L')}Z`;
    }
    case 'croix': {
      const a = r * 0.36;
      return `M${-a},${-r}H${a}V${-a}H${r}V${a}H${a}V${r}H${-a}V${a}H${-r}V${-a}H${-a}Z`;
    }
    default: return `M${r},0A${r},${r} 0 1 1 ${-r},0A${r},${r} 0 1 1 ${r},0Z`;
  }
}

export function pastilleSecteur(style, taille = 16) {
  return s('svg', { class: 'dfx-pastille-secteur', viewBox: '-12 -12 24 24', width: taille, height: taille, 'aria-hidden': 'true' },
    s('path', { d: cheminSymbole(style.forme, 9), fill: style.couleur, stroke: '#fff', 'stroke-width': 2 }));
}

export const NOMS_PERSONNAGES = {
  collegue: 'Ta collègue de bureau',
  bibliothecaire: 'La bibliothécaire',
  direction: 'Ta direction',
  gestionnaire: 'La gestionnaire du CLSC',
};
