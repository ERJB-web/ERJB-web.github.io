import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=1770adecd5';

const DEMI_HAUTEUR = 0.6, RAYON = 0.3, CENTRE = DEMI_HAUTEUR + RAYON;
const FILTRE = groupes(GROUPES.JOUEUR, GROUPES.STATIQUE | GROUPES.DYNAMIQUE | GROUPES.PORTE | GROUPES.PNJ | GROUPES.GLACE);

export function creerJoueur({ physique, perso, audio, bus, jeu }) {
  const { RAPIER, monde } = physique;
  let corps = null, collider = null, controleur = null;
  const j = {
    perso,
    position: new THREE.Vector3(),
    vitesse: new THREE.Vector3(),
    lacet: 0,
    vitesseHorizontale: 0,
    sol: true,
    court: false,
    accroupi: false,
    mode: 'libre', // libre | assis | gele | cine
    patins: false,
    patine: false,
    surGlace: false,
    equilibre: 0,
    chute: 0,
    porte: null,
    siege: null,
    distancePas: 0,
    surface: 'beton',
    tir: null,
    zone: null,
    bloqueCourse: false,
  };

  function creerCorps(pos) {
    if (corps) { try { monde.removeRigidBody(corps); } catch { /* déjà retiré */ } }
    if (controleur) { try { monde.removeCharacterController(controleur); } catch { /* déjà retiré */ } }
    corps = monde.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(pos.x, pos.y + CENTRE, pos.z));
    collider = monde.createCollider(
      RAPIER.ColliderDesc.capsule(DEMI_HAUTEUR, RAYON).setCollisionGroups(groupes(GROUPES.JOUEUR, 0xffff & ~GROUPES.JOUEUR)).setFriction(0.0),
      corps
    );
    controleur = monde.createCharacterController(0.02);
    controleur.setUp({ x: 0, y: 1, z: 0 });
    controleur.enableAutostep(0.36, 0.12, false);
    controleur.enableSnapToGround(0.4);
    controleur.setMaxSlopeClimbAngle(THREE.MathUtils.degToRad(52));
    controleur.setMinSlopeSlideAngle(THREE.MathUtils.degToRad(38));
    controleur.setApplyImpulsesToDynamicBodies(false);
    controleur.setCharacterMass(80);
    controleur.setSlideEnabled(true);
  }

  function placer(position, lacet = 0) {
    j.position.copy(position);
    j.lacet = lacet;
    j.vitesse.set(0, 0, 0);
    creerCorps(position);
    perso.racine.position.copy(position);
    perso.racine.rotation.set(0, lacet, 0);
  }

  const desire = new THREE.Vector3();
  const f = new THREE.Vector3(), r = new THREE.Vector3();

  function directionVoulue(entrees, lacetCam) {
    f.set(-Math.sin(lacetCam), 0, -Math.cos(lacetCam));
    r.set(Math.cos(lacetCam), 0, -Math.sin(lacetCam));
    return desire.set(0, 0, 0).addScaledVector(f, entrees.my).addScaledVector(r, entrees.mx);
  }

  function tournerVers(angleCible, dt, taux) {
    let d = angleCible - j.lacet;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    j.lacet += d * Math.min(1, dt * taux);
  }

  function animer(dt) {
    const p = perso;
    if (j.mode === 'assis') { p.jouer(j.animAssis || 'sit', { fondu: 0.4 }); return; }
    if (j.animSpeciale) {
      j.animSpeciale.t -= dt;
      if (j.animSpeciale.t > 0) return;
      j.animSpeciale = null;
    }
    if (j.patine) {
      if (j.chute > 0) return;
      const v = j.vitesseHorizontale;
      if (j.freine && v > 1.2) p.jouer('skate_stop', { fondu: 0.12 });
      else if (Math.abs(j.equilibre) > 0.55 && p.possede('skate_wobble')) p.jouer('skate_wobble', { fondu: 0.2 });
      else if (j.recule && v > 0.3) p.jouer('skate_back', { vitesse: 0.6 + v / 4 });
      else if (j.aLaRondelle && v > 0.3) p.jouer('stickhandle', { vitesse: 0.7 + v / 8 });
      else if (j.pousse && v > 0.2) p.jouer('skate', { vitesse: 0.65 + v / 7 });
      else if (v > 0.5) p.jouer(p.possede('skate_glide') ? 'skate_glide' : 'skate_idle', { fondu: 0.35 });
      else p.jouer('skate_idle', { fondu: 0.3 });
      return;
    }
    if (!j.sol) {
      if (j.vitesse.y > 0.5) p.jouer('jump', { boucle: false, fondu: 0.1 });
      else p.jouer(p.possede('fall') ? 'fall' : 'jump', { fondu: 0.25 });
      return;
    }
    const v = j.vitesseHorizontale;
    if (v < 0.12) p.jouer('idle', { fondu: 0.3 });
    else if (v < 2.6) p.jouer('walk', { vitesse: THREE.MathUtils.clamp(v / p.vitesseNominale.walk, 0.55, 1.6), fondu: 0.25 });
    else p.jouer('run', { vitesse: THREE.MathUtils.clamp(v / p.vitesseNominale.run, 0.7, 1.3), fondu: 0.25 });
  }

  function pas(dt) {
    if (!j.sol || j.patine) return;
    j.distancePas += j.vitesseHorizontale * dt;
    const foulee = j.court ? 1.25 : 0.72;
    if (j.distancePas > foulee) {
      j.distancePas = 0;
      const n = 1 + Math.floor(Math.random() * 4);
      audio?.jouer3d(`pas_${j.surface}_${n}`, j.position, { volume: j.court ? 0.7 : 0.45, hauteur: 0.93 + Math.random() * 0.14 });
      if (j.court) bus.emit('joueur:bruit', { position: j.position, force: 1 });
    }
  }

  // ---------- patinage ----------
  const cap = new THREE.Vector3();
  function patiner(dt, entrees, lacetCam) {
    const habilete = THREE.MathUtils.clamp(jeu.etat.drapeaux.patinage ?? 0.05, 0, 1);
    const aide = j.porte && /aide_patineur/i.test(j.porte.id);
    const vh = new THREE.Vector3(j.vitesse.x, 0, j.vitesse.z);
    const v = vh.length();
    if (j.chute > 0) {
      j.chute -= dt;
      vh.multiplyScalar(Math.max(0, 1 - dt * 1.8));
      if (j.chute <= 0) { perso.jouer('skate_getup', { boucle: false, fondu: 0.15 }); j.animSpeciale = { t: perso.duree('skate_getup') * 0.9 }; j.equilibre = 0; }
      j.vitesse.x = vh.x; j.vitesse.z = vh.z;
      return;
    }
    const voulue = directionVoulue(entrees, lacetCam);
    const intensite = Math.min(1, voulue.length());
    j.freine = entrees.freiner;
    j.recule = false;
    j.pousse = false;
    cap.set(Math.sin(j.lacet), 0, Math.cos(j.lacet));
    if (intensite > 0.1) {
      const angleVoulu = Math.atan2(voulue.x, voulue.z);
      let d = angleVoulu - j.lacet;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      if (Math.abs(d) > 2.4 && v < 3) {
        // à reculons : on garde le cap, on pousse vers l'arrière
        j.recule = true;
        vh.addScaledVector(cap, -dt * (0.8 + 1.6 * habilete) * intensite);
      } else {
        const tourne = THREE.MathUtils.clamp(d, -1, 1) * (1.8 + 1.4 * habilete) * dt * (1 / (1 + v * 0.08));
        j.lacet += tourne;
        cap.set(Math.sin(j.lacet), 0, Math.cos(j.lacet));
        const vmax = (aide ? 2.0 : 2.6 + 6.2 * habilete) * (entrees.courir ? 1.15 : 1);
        if (!j.freine && v < vmax) {
          j.phasePoussee = (j.phasePoussee || 0) + dt * (1.3 + v * 0.12);
          const impulsion = Math.pow(Math.max(0, Math.sin(j.phasePoussee * Math.PI)), 2);
          vh.addScaledVector(cap, dt * (1.1 + 3.6 * habilete) * (0.35 + impulsion * 1.3) * intensite);
          j.pousse = true;
          if (impulsion > 0.95 && !j.sonPoussee) { j.sonPoussee = true; audio?.jouer3d('patin_glisse', j.position, { volume: 0.35 + v * 0.05 }); }
          if (impulsion < 0.5) j.sonPoussee = false;
        }
      }
    }
    // adhérence des lames : la vitesse suit le cap, plus ou moins vite
    if (v > 0.05 && !j.recule) {
      const prise = (1.6 + 2.8 * habilete) * dt;
      const sens = vh.dot(cap) >= 0 ? 1 : -1;
      const cible = cap.clone().multiplyScalar(v * sens);
      vh.lerp(cible, Math.min(1, prise));
    }
    // frottement et freinage
    let decel = 0.12;
    if (j.freine) {
      decel = 1.6 + 6.5 * habilete;
      if (v > 1.5 && !j.sonFrein) { j.sonFrein = true; audio?.jouer3d('patin_freinage', j.position, { volume: Math.min(1, v / 6) }); bus.emit('patin:frein', { position: j.position.clone(), vitesse: v }); }
    } else j.sonFrein = false;
    const nv = Math.max(0, v - decel * dt);
    if (v > 1e-4) vh.multiplyScalar(nv / v);
    // équilibre du débutant : chaque poussée et chaque virage le déstabilisent
    const instable = (1 - habilete) * (aide ? 0.2 : 1);
    const genoux = j.freine && v < 1.6;
    j.equilibre += (Math.random() - 0.5) * instable * dt * (5 + v * 2.2);
    j.equilibre += j.equilibre * instable * dt * 2.1;
    if (j.pousse && j.sonPoussee && !j.coupDeja) { j.equilibre += (Math.random() - 0.5) * instable * 0.32 * (entrees.courir ? 1.8 : 1); j.coupDeja = true; }
    if (!j.sonPoussee) j.coupDeja = false;
    if (j.freine && v > 1.6) j.equilibre += Math.sign(j.equilibre || 1) * instable * dt * 1.2 * Math.min(1, v / 3);
    j.equilibre *= Math.max(0, 1 - dt * (0.5 + 2.4 * habilete + (genoux ? 2.6 : 0)));
    if (intensite < 0.1 && v < 0.4) j.equilibre *= Math.max(0, 1 - dt * 2);
    // se pencher du côté où l'on tombe rattrape le déséquilibre
    j.equilibre -= entrees.mx * dt * (1.2 + 0.6 * habilete);
    if (Math.abs(j.equilibre) > 1) {
      j.chute = 1.6;
      j.equilibre = 0;
      perso.jouer('skate_fall', { boucle: false, fondu: 0.08 });
      audio?.jouer3d('objet_choc', j.position, { volume: 0.8, hauteur: 0.6 });
      bus.emit('patin:chute', { vitesse: v });
    }
    j.vitesse.x = vh.x; j.vitesse.z = vh.z;
    bus.emit('patin:etat', { equilibre: j.equilibre, vitesse: nv, habilete });
  }

  // ---------- marche ----------
  function marcher(dt, entrees, lacetCam) {
    const voulue = directionVoulue(entrees, lacetCam);
    const intensite = Math.min(1, voulue.length());
    const fatigue = jeu.etat.stats.energie < 12;
    j.court = entrees.courir && intensite > 0.5 && !fatigue && !j.porte && !j.bloqueCourse;
    let vmax = j.court ? 4.4 : 1.75;
    if (j.porte) vmax = Math.min(vmax, j.porte.masse > 15 ? 1.1 : 1.6);
    if (fatigue) vmax = 1.4;
    const cible = voulue.clone().normalize().multiplyScalar(vmax * intensite);
    if (intensite < 0.05) cible.set(0, 0, 0);
    const glisse = j.surGlace && !j.patins;
    const accel = j.sol ? (glisse ? 1.5 : 11) : 2.5;
    const vh = new THREE.Vector3(j.vitesse.x, 0, j.vitesse.z);
    vh.lerp(cible, Math.min(1, dt * accel));
    j.vitesse.x = vh.x; j.vitesse.z = vh.z;
    if (intensite > 0.05) tournerVers(Math.atan2(voulue.x, voulue.z), dt, j.sol ? 11 : 3);
    if (j.sol && entrees.presses.has('sauter') && !j.porte) { j.vitesse.y = 3.9; j.sol = false; }
    if (j.court) jeu.etat.stats.energie = Math.max(0, jeu.etat.stats.energie - dt * 0.35);
  }

  const vPousse = new THREE.Vector3();
  function pousserObjets(dt) {
    const vh = Math.hypot(j.vitesse.x, j.vitesse.z);
    if (vh < 0.2) return;
    vPousse.set(j.vitesse.x / vh, 0, j.vitesse.z / vh);
    const n = controleur.numComputedCollisions();
    for (let i = 0; i < n; i++) {
      const c = controleur.computedCollision(i);
      const b = c?.collider?.parent();
      if (!b || !b.isDynamic()) continue;
      const masse = b.mass();
      const force = Math.min(140, 28 * masse) * (0.4 + vh * 0.35) * (j.court ? 1.6 : 1);
      const t = corps.translation();
      const p = { x: t.x + vPousse.x * (RAYON + 0.02), y: t.y + 0.15, z: t.z + vPousse.z * (RAYON + 0.02) };
      b.applyImpulseAtPoint({ x: vPousse.x * force * dt, y: 0, z: vPousse.z * force * dt }, p, true);
    }
  }

  function mettreAJour(dt, entrees, lacetCam) {
    if (!corps) return;
    if (j.mode === 'assis' || j.mode === 'gele' || j.mode === 'cine') {
      j.vitesse.set(0, j.vitesse.y, 0);
      if (j.mode !== 'assis') { j.vitesse.x = 0; j.vitesse.z = 0; }
      entrees = { ...entrees, mx: 0, my: 0, presses: new Set(), courir: false, freiner: false };
    }
    const g = j.zone?.glaceBoite;
    j.surGlace = !!(g && j.position.x > g.min.x - 0.05 && j.position.x < g.max.x + 0.05 && j.position.z > g.min.z - 0.05 && j.position.z < g.max.z + 0.05 && j.position.y < g.max.y + 0.4);
    j.patine = j.patins && j.surGlace;
    if (j.mode === 'libre') {
      if (j.patine) patiner(dt, entrees, lacetCam);
      else marcher(dt, entrees, lacetCam);
    }
    if (j.mode !== 'assis') {
      j.vitesse.y -= 9.81 * dt * 1.25;
      if (j.sol && j.vitesse.y < -1) j.vitesse.y = -1;
      const d = { x: j.vitesse.x * dt, y: j.vitesse.y * dt, z: j.vitesse.z * dt };
      controleur.computeColliderMovement(collider, d, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, FILTRE);
      const m = controleur.computedMovement();
      pousserObjets(dt);
      const t = corps.translation();
      corps.setNextKinematicTranslation({ x: t.x + m.x, y: t.y + m.y, z: t.z + m.z });
      const etaitAuSol = j.sol;
      j.sol = controleur.computedGrounded();
      if (j.sol && j.vitesse.y < 0) j.vitesse.y = -0.5;
      if (j.sol && !etaitAuSol) audio?.jouer3d(`pas_${j.surface}_1`, j.position, { volume: 0.6 });
      // vitesse réelle (bloquée par un mur) pour l'animation et le patin
      const reel = Math.hypot(m.x, m.z) / Math.max(dt, 1e-4);
      if (j.patine && reel < Math.hypot(j.vitesse.x, j.vitesse.z) * 0.5 && Math.hypot(j.vitesse.x, j.vitesse.z) > 2.5) {
        bus.emit('patin:bande', { vitesse: Math.hypot(j.vitesse.x, j.vitesse.z) });
        audio?.jouer3d('rondelle_bande', j.position, { volume: 0.9, hauteur: 0.55 });
        j.vitesse.x *= -0.25; j.vitesse.z *= -0.25;
      }
      j.vitesseHorizontale = Math.min(Math.hypot(j.vitesse.x, j.vitesse.z), reel + 0.05);
      j.position.set(t.x + m.x, t.y + m.y - CENTRE, t.z + m.z);
      if (j.position.y < -30) bus.emit('joueur:tombe');
    }
    perso.racine.position.copy(j.position);
    perso.racine.rotation.set(0, j.lacet, 0);
    animer(dt);
    pas(dt);
  }

  function asseoir(siege) {
    j.mode = 'assis';
    j.siege = siege;
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(siege.quaternion);
    j.lacet = Math.atan2(fwd.x, fwd.z);
    const p = siege.position.clone();
    p.y = Math.max(0, p.y - 0.45);
    perso.racine.position.copy(p);
    j.positionAvantSiege = j.position.clone();
    j.position.copy(p);
    j.animAssis = siege.anim || 'sit';
  }

  function lever() {
    if (j.mode !== 'assis') return;
    j.mode = 'libre';
    const p = j.positionAvantSiege || j.position;
    placer(p, j.lacet);
  }

  function jouerSpecial(nom, duree) {
    if (!perso.possede(nom)) return;
    perso.jouer(nom, { boucle: false, fondu: 0.12, forcer: true });
    j.animSpeciale = { t: duree ?? perso.duree(nom) * 0.92 };
  }

  return Object.assign(j, {
    placer, mettreAJour, asseoir, lever, jouerSpecial,
    get corps() { return corps; },
    get collider() { return collider; },
    avant() { return new THREE.Vector3(Math.sin(j.lacet), 0, Math.cos(j.lacet)); },
    tete() { const p = j.position.clone(); p.y += 1.62; return p; },
  });
}
