import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=63f5f7cb13';

const DEMI = 0.6, RAYON = 0.28, CENTRE = DEMI + RAYON;
const FILTRE = groupes(GROUPES.PNJ, GROUPES.STATIQUE | GROUPES.DYNAMIQUE | GROUPES.PORTE | GROUPES.JOUEUR);

export function creerGestionPNJ({ physique, personnages, objets, audio, bus }) {
  const { RAPIER, monde } = physique;
  const liste = [];
  let zone = null;

  async function ajouter({ role, position, quaternion, anim = 'idle', id, dialogue = null, mobile = false, nom, flaner = false, couleurs = null, alias = null }) {
    if (flaner) mobile = true;
    const perso = await personnages.creer(role, { couleurs });
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion || new THREE.Quaternion());
    const lacet = Math.atan2(fwd.x, fwd.z);
    const p = position.clone();
    const assis = /^(sit|type|sit_)/.test(anim);
    if (assis && p.y > 0.3) p.y -= 0.45;
    const corps = monde.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(p.x, p.y + CENTRE, p.z));
    const collider = monde.createCollider(RAPIER.ColliderDesc.capsule(DEMI, RAYON).setCollisionGroups(groupes(GROUPES.PNJ, 0xffff & ~GROUPES.PNJ)), corps);
    let controleur = null;
    if (mobile) {
      controleur = monde.createCharacterController(0.02);
      controleur.enableAutostep(0.36, 0.12, false);
      controleur.enableSnapToGround(0.4);
      controleur.setApplyImpulsesToDynamicBodies(true);
      controleur.setCharacterMass(70);
      controleur.setSlideEnabled(true);
    }
    const pnj = {
      id: id || role, role, nom: nom || role, perso, corps, collider, controleur, dialogue,
      position: p.clone(), lacet, animRepos: anim, assis, mobile,
      chemin: null, iChemin: 0, vitesse: 0, vitesseMax: 1.4, anim: 'walk',
      vy: 0, comportement: 'statique', cibleRegard: null, cachee: false,
      ralenti: 0, bousculade: 0, alias: alias || [],
    };
    perso.racine.position.copy(p);
    perso.racine.rotation.y = lacet;
    if (flaner) { pnj.comportement = 'flaner'; pnj.origine = p.clone(); pnj.attente = Math.random() * 6; pnj.telephone = Math.random() < 0.35; }
    perso.jouer(anim in perso.actions ? anim : 'idle', { fondu: 0 });
    if (perso.actions[anim]) perso.actions[anim].time = Math.random() * perso.duree(anim);
    zone?.racine.add(perso.racine);
    liste.push(pnj);
    return pnj;
  }

  function retirer(pnj) {
    const i = liste.indexOf(pnj);
    if (i >= 0) liste.splice(i, 1);
    personnages.retirer(pnj.perso);
    try { monde.removeRigidBody(pnj.corps); } catch { /* déjà retiré */ }
    if (pnj.controleur) try { monde.removeCharacterController(pnj.controleur); } catch { /* déjà retiré */ }
  }

  function allerVers(pnj, cible, { vitesse = 1.4, anim = 'walk', fin } = {}) {
    if (!zone?.navmesh || zone.navmesh.vide) { pnj.chemin = [pnj.position.clone(), cible.clone()]; }
    else pnj.chemin = zone.navmesh.chemin(pnj.position, cible) || [pnj.position.clone(), cible.clone()];
    pnj.iChemin = 1;
    pnj.vitesseMax = vitesse;
    pnj.anim = anim;
    pnj.fin = fin || null;
    pnj.comportement = 'aller';
  }

  const vTmp = new THREE.Vector3();
  function porteSurLeChemin(pnj, dir) {
    for (const porte of objets.portes) {
      if (!porte.corps || porte.verrou === undefined) continue;
      const pp = porte.objet.getWorldPosition(vTmp);
      const d = pp.distanceTo(pnj.position);
      if (d > 2.4) continue;
      const ang = Math.abs(objets.anglePorte(porte));
      if (ang > 1.35) continue;
      const versPorte = pp.clone().sub(pnj.position).setY(0).normalize();
      if (versPorte.dot(dir) > 0.2) return porte;
    }
    return null;
  }

  function mettreAJour(dt, joueur) {
    for (const pnj of liste) {
      const p = pnj.perso;
      if (pnj.comportement === 'aller' && pnj.chemin && pnj.controleur) {
        if (pnj.ralenti > 0) { pnj.ralenti -= dt; pnj.vitesse *= 0.85; }
        const cible = pnj.chemin[pnj.iChemin];
        if (!cible) {
          pnj.comportement = 'statique';
          pnj.vitesse = 0;
          const f = pnj.fin; pnj.fin = null; f?.(pnj);
        } else {
          const dir = cible.clone().sub(pnj.position).setY(0);
          const dist = dir.length();
          if (dist < 0.35) { pnj.iChemin++; }
          else {
            dir.normalize();
            const porte = porteSurLeChemin(pnj, dir);
            if (porte && !porte.verrou) {
              const fermee = Math.abs(objets.anglePorte(porte)) < 0.3;
              if (objets.ouvrir(porte, pnj.position) && fermee) pnj.ralenti = 0.6;
            }
            const vmax = pnj.ralenti > 0 ? pnj.vitesseMax * 0.35 : pnj.vitesseMax;
            pnj.vitesse += (vmax - pnj.vitesse) * Math.min(1, dt * 4);
            const angle = Math.atan2(dir.x, dir.z);
            let d = angle - pnj.lacet; d = Math.atan2(Math.sin(d), Math.cos(d));
            pnj.lacet += d * Math.min(1, dt * 7);
            pnj.vy -= 9.81 * dt;
            if (pnj.vy < -2) pnj.vy = -2;
            const mv = { x: dir.x * pnj.vitesse * dt, y: pnj.vy * dt, z: dir.z * pnj.vitesse * dt };
            pnj.controleur.computeColliderMovement(pnj.collider, mv, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, FILTRE);
            const m = pnj.controleur.computedMovement();
            if (pnj.controleur.computedGrounded()) pnj.vy = -0.5;
            const nc = pnj.controleur.numComputedCollisions();
            for (let k = 0; k < nc; k++) {
              const b = pnj.controleur.computedCollision(k)?.collider?.parent();
              if (!b || !b.isDynamic()) continue;
              const f = Math.min(110, 25 * b.mass()) * dt;
              const t0 = pnj.corps.translation();
              b.applyImpulseAtPoint({ x: dir.x * f, y: 0, z: dir.z * f }, { x: t0.x + dir.x * 0.3, y: t0.y + 0.15, z: t0.z + dir.z * 0.3 }, true);
            }
            const t = pnj.corps.translation();
            pnj.corps.setNextKinematicTranslation({ x: t.x + m.x, y: t.y + m.y, z: t.z + m.z });
            pnj.position.set(t.x + m.x, t.y + m.y - CENTRE, t.z + m.z);
            const reel = Math.hypot(m.x, m.z) / Math.max(dt, 1e-4);
            if (reel < 0.1 && pnj.vitesse > 0.6) {
              pnj.bloque = (pnj.bloque || 0) + dt;
              if (pnj.bloque > 1.2) {
                pnj.bloque = 0;
                bus.emit('pnj:bloque', pnj);
                const fin = pnj.chemin[pnj.chemin.length - 1];
                if (fin && zone?.navmesh && !zone.navmesh.vide) {
                  const detour = zone.navmesh.pointAuHasard(pnj.position, 2.5);
                  if (detour) { pnj.chemin = [pnj.position.clone(), detour, ...(zone.navmesh.chemin(detour, fin) || [fin]).slice(1)]; pnj.iChemin = 1; }
                }
              }
            } else pnj.bloque = 0;
            const nomAnim = pnj.anim === 'walk_fast' && !p.possede('walk_fast') ? 'walk' : pnj.anim;
            p.jouer(reel > 0.15 ? nomAnim : 'idle', { vitesse: THREE.MathUtils.clamp(reel / (p.vitesseNominale[nomAnim] || 1.4), 0.6, 1.8) });
          }
        }
      } else if (pnj.comportement === 'flaner') {
        pnj.attente = (pnj.attente ?? 2) - dt;
        if (pnj.attente <= 0 && zone?.navmesh && !zone.navmesh.vide) {
          const but = zone.navmesh.pointAuHasard(pnj.origine || pnj.position, 12);
          if (but) {
            allerVers(pnj, but, { vitesse: 1.1 + Math.random() * 0.4, anim: 'walk', fin: (x) => { x.comportement = 'flaner'; x.attente = 3 + Math.random() * 7; } });
          } else pnj.attente = 4;
        }
        if (!pnj.parleMaintenant) p.jouer(pnj.telephone && p.possede('phone') ? 'phone' : 'idle');
      } else if (pnj.comportement === 'statique') {
        if (!pnj.parleMaintenant && !pnj.animForcee) p.jouer(pnj.animRepos in p.actions ? pnj.animRepos : 'idle');
      }
      p.racine.position.copy(pnj.position);
      if (p.decalagePatins && !pnj.assis) p.racine.position.y += p.decalagePatins;
      p.racine.rotation.y = pnj.lacet;
      // regarde Éric quand il passe près
      if (joueur && !pnj.assis && pnj.comportement === 'statique') {
        const d = pnj.position.distanceTo(joueur.position);
        p.regarder(d < 4.5 ? joueur.tete() : pnj.cibleRegard, d < 4.5 ? 0.9 : 0.7);
      } else if (joueur && pnj.assis) {
        const d = pnj.position.distanceTo(joueur.position);
        p.regarder(d < 2.6 ? joueur.tete() : null, 0.6);
      }
      // bousculade : Éric qui court dans un PNJ
      if (joueur && joueur.court && pnj.position.distanceTo(joueur.position) < 0.75 && pnj.bousculade <= 0) {
        pnj.bousculade = 4;
        bus.emit('pnj:bouscule', pnj);
      }
      pnj.bousculade -= dt;
    }
  }

  function orienterVers(pnj, cible) {
    const d = cible.clone().sub(pnj.position);
    pnj.lacet = Math.atan2(d.x, d.z);
  }

  function vider() {
    for (const pnj of [...liste]) retirer(pnj);
  }

  return {
    liste, ajouter, retirer, allerVers, mettreAJour, orienterVers, vider,
    set zone(z) { zone = z; },
    get zone() { return zone; },
    trouver(id) {
      const ok = (p) => p.id === id || p.role === id || p.alias?.includes(id);
      return liste.find((p) => ok(p) && !p.cache) || liste.find(ok);
    },
  };
}
