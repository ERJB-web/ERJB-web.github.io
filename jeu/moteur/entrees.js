const ACTIONS_TOUCHES = {
  e: 'interagir', f: 'interagir', enter: 'confirmer', ' ': 'sauter', escape: 'pause', p: 'pause',
  tab: 'journal', j: 'journal', m: 'carte', c: 'accroupir', r: 'demander', q: 'gauche_alt', x: 'lacher',
};

const MOUVEMENT = {
  KeyW: [0, 1], ArrowUp: [0, 1], KeyS: [0, -1], ArrowDown: [0, -1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0],
};

export function creerEntrees({ canvas, bus, options }) {
  const tenus = new Set();
  const presses = new Set();
  const regard = { x: 0, y: 0 };
  let molette = 0;
  let sourisGauche = false, sourisDroite = false, sourisGaucheAppui = false, sourisGaucheRelache = false;
  let verrouActif = false;
  let actif = true;
  let derniereSource = 'clavier';
  const tactile = { mx: 0, my: 0, lx: 0, ly: 0, courir: false };
  const manette = { mx: 0, my: 0, lx: 0, ly: 0, boutons: [], precedents: [] };

  function action(e) {
    const k = (e.key || '').toLowerCase();
    return ACTIONS_TOUCHES[k] || null;
  }

  window.addEventListener('keydown', (e) => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    derniereSource = 'clavier';
    const a = action(e);
    if (e.code === 'Tab') e.preventDefault();
    if (!e.repeat) {
      tenus.add(e.code);
      if (a) presses.add(a);
      if (e.code === 'Space') presses.add('sauter');
    }
    if (e.code === 'Space' && actif) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => {
    tenus.delete(e.code);
  });
  window.addEventListener('blur', () => { tenus.clear(); sourisGauche = false; sourisDroite = false; });

  canvas.addEventListener('mousedown', (e) => {
    derniereSource = 'clavier';
    if (e.button === 0) { sourisGauche = true; sourisGaucheAppui = true; }
    if (e.button === 2) sourisDroite = true;
    if (actif && !verrouActif && canvas.requestPointerLock) {
      try { const r = canvas.requestPointerLock({ unadjustedMovement: true }); r?.catch?.(() => canvas.requestPointerLock()); } catch { /* refus du navigateur */ }
    }
  });
  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) { sourisGauche = false; sourisGaucheRelache = true; }
    if (e.button === 2) sourisDroite = false;
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('pointerlockchange', () => {
    verrouActif = document.pointerLockElement === canvas;
    bus.emit('entrees:verrou', { actif: verrouActif });
  });
  window.addEventListener('mousemove', (e) => {
    if (!actif) return;
    if (verrouActif) { regard.x += e.movementX; regard.y += e.movementY; }
  });
  canvas.addEventListener('wheel', (e) => { molette += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });

  // glisser au doigt sur le décor pour tourner la caméra
  let toucheCam = null;
  canvas.addEventListener('touchstart', (e) => {
    derniereSource = 'tactile';
    for (const t of e.changedTouches) {
      if (toucheCam === null && t.clientX > window.innerWidth * 0.4) toucheCam = { id: t.identifier, x: t.clientX, y: t.clientY };
    }
  }, { passive: true });
  canvas.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (toucheCam && t.identifier === toucheCam.id) {
        regard.x += (t.clientX - toucheCam.x) * 1.6;
        regard.y += (t.clientY - toucheCam.y) * 1.6;
        toucheCam.x = t.clientX; toucheCam.y = t.clientY;
      }
    }
  }, { passive: true });
  canvas.addEventListener('touchend', (e) => {
    for (const t of e.changedTouches) if (toucheCam && t.identifier === toucheCam.id) toucheCam = null;
  });

  bus.on('tactile:deplacement', (d) => { derniereSource = 'tactile'; tactile.mx = d.x ?? 0; tactile.my = d.y ?? 0; tactile.courir = Math.hypot(tactile.mx, tactile.my) > 0.92; });
  bus.on('tactile:regard', (d) => { regard.x += (d.dx ?? 0); regard.y += (d.dy ?? 0); });
  bus.on('tactile:action', (d) => { derniereSource = 'tactile'; if (d?.action) presses.add(d.action); if (d?.action === 'tirer_fin') sourisGaucheRelache = true; if (d?.action === 'tirer_debut') { sourisGauche = true; sourisGaucheAppui = true; } });

  const zoneMorte = (v) => (Math.abs(v) < 0.15 ? 0 : (v - Math.sign(v) * 0.15) / 0.85);

  function lireManette() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const p = [...pads].find((x) => x && x.connected);
    if (!p) { manette.mx = manette.my = manette.lx = manette.ly = 0; return; }
    manette.mx = zoneMorte(p.axes[0] || 0);
    manette.my = -zoneMorte(p.axes[1] || 0);
    manette.lx = zoneMorte(p.axes[2] || 0);
    manette.ly = zoneMorte(p.axes[3] || 0);
    const b = p.buttons.map((x) => x.pressed);
    const bv = p.buttons.map((x) => x.value);
    const appui = (i) => b[i] && !manette.precedents[i];
    if (b.some(Boolean) || Math.abs(manette.mx) + Math.abs(manette.my) > 0) derniereSource = 'manette';
    if (appui(0)) { presses.add('interagir'); presses.add('confirmer'); }
    if (appui(1)) presses.add('retour');
    if (appui(2)) presses.add('sauter');
    if (appui(3)) presses.add('journal');
    if (appui(1)) presses.add('demander');
    if (appui(8)) presses.add('carte');
    if (appui(9)) presses.add('pause');
    if (appui(12)) presses.add('haut');
    if (appui(13)) presses.add('bas');
    if (appui(14)) presses.add('gauche');
    if (appui(15)) presses.add('droite');
    if ((bv[7] || 0) > 0.4 && !manette.precedents[7]) { sourisGaucheAppui = true; }
    if ((bv[7] || 0) <= 0.4 && manette.precedents[7]) { sourisGaucheRelache = true; }
    manette.courir = b[10] || (bv[6] || 0) > 0.4;
    manette.freiner = b[4] || b[5];
    manette.tir = (bv[7] || 0) > 0.4;
    manette.precedents = b.map((x, i) => (i === 7 ? (bv[7] || 0) > 0.4 : x));
  }

  function lire(dt) {
    lireManette();
    let mx = 0, my = 0;
    for (const code of tenus) {
      const m = MOUVEMENT[code];
      if (m) { mx += m[0]; my += m[1]; }
    }
    mx += tactile.mx + manette.mx;
    my += tactile.my + manette.my;
    const l = Math.hypot(mx, my);
    if (l > 1) { mx /= l; my /= l; }
    const sens = options.sensibilite ?? 1;
    const inv = options.inverserY ? -1 : 1;
    const etat = {
      mx, my,
      regardX: regard.x * 0.0022 * sens + manette.lx * 2.6 * dt * sens,
      regardY: regard.y * 0.0022 * sens * inv + manette.ly * 1.8 * dt * sens * inv,
      molette,
      courir: tenus.has('ShiftLeft') || tenus.has('ShiftRight') || tactile.courir || manette.courir,
      freiner: tenus.has('Space') || manette.freiner,
      tenirTir: sourisGauche || manette.tir,
      appuiTir: sourisGaucheAppui,
      relacheTir: sourisGaucheRelache,
      viser: sourisDroite,
      tenus,
      presses: new Set(presses),
      source: derniereSource,
      verrou: verrouActif,
    };
    regard.x = 0; regard.y = 0; molette = 0;
    presses.clear();
    sourisGaucheAppui = false; sourisGaucheRelache = false;
    return actif ? etat : { ...etat, mx: 0, my: 0, regardX: 0, regardY: 0, courir: false, presses: etat.presses };
  }

  return {
    lire,
    activer(v) {
      actif = v;
      if (!v && document.pointerLockElement === canvas) document.exitPointerLock?.();
    },
    liberer() { if (document.pointerLockElement === canvas) document.exitPointerLock?.(); },
    get source() { return derniereSource; },
    touche(action) {
      if (derniereSource === 'manette') return { interagir: 'A', sauter: 'X', journal: 'Y', pause: 'Start' }[action] || action;
      if (derniereSource === 'tactile') return '';
      return { interagir: 'E', sauter: 'Espace', journal: 'Tab', pause: 'Échap', carte: 'M', courir: 'Maj', demander: 'R' }[action] || action;
    },
  };
}
