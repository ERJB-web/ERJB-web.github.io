import * as THREE from 'three';

export function creerCompagnon({ bus, gestionPnj, audio, dialogues, jeu }) {
  const c = { pnj: null, disponible: null, immobile: 0, prochainAboi: 5, prochainReniflement: 8, etat: 'suit', anim: 'idle' };

  async function existe() {
    if (c.disponible === null) {
      c.disponible = await fetch('personnages/chienne.glb', { method: 'HEAD' }).then((r) => r.ok).catch(() => false);
    }
    return c.disponible;
  }

  async function installer(zone, joueur) {
    c.pnj = null;
    if (!zone || !joueur || !(await existe())) return;
    if (zone.manifeste?.compagnon === false || zone.id === 'clsc' || zone.id === 'soutenance') return;
    c.attend = zone.id === 'bibliotheque' || zone.manifeste?.compagnon === 'attend';
    c.poste = zone.spawns?.SPAWN_chienne || null;
    const pos = c.poste && (c.attend || zone.glace) ? c.poste.position.clone() : joueur.position.clone().addScaledVector(joueur.avant(), -1.2).add(new THREE.Vector3(0.8, 0, 0));
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), joueur.lacet + Math.PI);
    const nom = dialogues.donnees.personnages?.chienne?.nom || 'Ta chienne';
    c.pnj = await gestionPnj.ajouter({ role: 'chienne', id: 'chienne', position: pos, quaternion: q, mobile: true, nom, anim: 'idle' });
    c.pnj.estAnimal = true;
    c.pnj.perso.vitesseNominale = { walk: 1.3, trot: 3, run: 7 };
    c.pnj.comportement = 'compagnon';
  }

  function jouer(nom, vitesse = 1) {
    const p = c.pnj.perso;
    const choix = p.possede(nom) ? nom : nom === 'trot' && p.possede('run') ? 'run' : 'idle';
    p.jouer(choix, { vitesse, fondu: 0.3 });
    c.anim = choix;
  }

  function mettreAJour(dt, joueur) {
    const n = c.pnj;
    if (!n || !joueur || !n.perso.racine.parent) return;
    if (c.attend || jeu.joueur?.patine || jeu.joueur?.surGlace) {
      if (c.poste && n.position.distanceTo(c.poste.position) > 1.5 && n.comportement !== 'aller') gestionPnj.allerVers(n, c.poste.position, { vitesse: 1.5, anim: 'walk', fin: (x) => { x.comportement = 'compagnon'; } });
      else if (n.comportement !== 'aller') { n.perso.regarder(joueur.tete(), 0.8); jouer(c.attend ? 'lie' : 'sit'); }
      return;
    }
    const d = n.position.distanceTo(joueur.position);
    const bouge = joueur.vitesseHorizontale > 0.3;
    c.immobile = bouge ? 0 : c.immobile + dt;
    if (d > 2.8 || (bouge && d > 1.8)) {
      const vitesse = d > 9 ? 7 : d > 4.5 ? 3.2 : 1.5;
      const derriere = joueur.position.clone().addScaledVector(joueur.avant(), -1.3).add(new THREE.Vector3(Math.sin(performance.now() / 4000) * 0.9, 0, 0));
      if (!n.chemin || n.comportement !== 'aller' || (n.dernierRepath ?? 0) <= 0) {
        gestionPnj.allerVers(n, derriere, { vitesse, anim: vitesse > 5 ? 'run' : vitesse > 2.5 ? 'trot' : 'walk', fin: (x) => { x.comportement = 'compagnon'; } });
        n.dernierRepath = 0.5;
      }
      n.dernierRepath -= dt;
      if (d > 25) {
        n.position.copy(joueur.position).addScaledVector(joueur.avant(), -1.5);
        const t = n.corps.translation();
        n.corps.setTranslation({ x: n.position.x, y: t.y, z: n.position.z }, true);
      }
      return;
    }
    if (n.comportement === 'aller') { n.comportement = 'compagnon'; n.chemin = null; }
    const versEric = joueur.position.clone().sub(n.position);
    n.lacet += Math.atan2(Math.sin(Math.atan2(versEric.x, versEric.z) - n.lacet), Math.cos(Math.atan2(versEric.x, versEric.z) - n.lacet)) * Math.min(1, dt * 3);
    n.perso.regarder(joueur.tete(), 0.8);
    c.prochainReniflement -= dt;
    if (c.immobile > 12) jouer('lie');
    else if (c.immobile > 3) jouer('sit');
    else if (c.prochainReniflement <= 0) { c.prochainReniflement = 10 + Math.random() * 12; jouer('sniff'); setTimeout(() => { if (c.anim === 'sniff') jouer('idle'); }, 2500); }
    else if (c.anim !== 'sniff') jouer('idle');
  }

  function aboyer(nombre = 1) {
    if (!c.pnj) return;
    const p = c.pnj.position.clone().setY(c.pnj.position.y + 0.5);
    for (let i = 0; i < nombre; i++) setTimeout(() => audio.jouer3d(`aboiement_${1 + Math.floor(Math.random() * 4)}`, p, { volume: 0.8 }), i * 380);
    jouer('bark');
    setTimeout(() => { if (c.anim === 'bark') jouer('idle'); }, 1200);
  }

  // elle prévient quand la direction approche
  bus.on('direction', (d) => {
    if (!c.pnj || !d || d.statut !== 'traque') return;
    c.prochainAboi -= 0.1;
    if (d.distance < 14 && c.prochainAboi <= 0) { c.prochainAboi = 8 + Math.random() * 6; aboyer(2); }
  });
  bus.on('direction:apparition', () => setTimeout(() => aboyer(3), 1500));
  bus.on('hockey:but', ({ pourEric }) => { if (pourEric) aboyer(2); });

  return {
    installer, mettreAJour, aboyer,
    get pnj() { return c.pnj; },
    flatter() {
      if (!c.pnj) return false;
      jouer('play');
      audio.jouer3d('halete', c.pnj.position, { volume: 0.6 });
      dialogues.repliqueAuHasard('eric_chienne', {}) || dialogues.repliqueAuHasard('chienne_contente', {});
      setTimeout(() => { if (c.anim === 'play') jouer('idle'); }, 1800);
      return true;
    },
  };
}
