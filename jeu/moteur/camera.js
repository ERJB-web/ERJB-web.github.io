import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=2a9aa6f76b';

const FILTRE_CAM = groupes(0xffff, GROUPES.STATIQUE | GROUPES.PORTE);

export function creerCamera({ camera, physique, options }) {
  const etat = {
    mode: 'suivi',
    lacet: 0,
    tangage: -0.12,
    distance: 3.1,
    distanceVoulue: 3.1,
    distanceEffective: 3.1,
    epaule: 0.42,
    hauteur: 1.58,
    fov: 55,
    fovVoulu: 55,
    secousse: 0,
  };
  const cine = { position: new THREE.Vector3(), cible: new THREE.Vector3(), fov: 40, lissage: 3, actif: false, coupe: false };
  const posLisse = new THREE.Vector3();
  const cibleLisse = new THREE.Vector3();
  const vTmp = new THREE.Vector3(), dir = new THREE.Vector3(), voulu = new THREE.Vector3();
  let initialise = false;
  let orbite = null;

  function suivre(dt, entrees, joueur) {
    if (!joueur) return;
    etat.lacet -= entrees.regardX;
    etat.tangage -= entrees.regardY;
    etat.tangage = THREE.MathUtils.clamp(etat.tangage, -1.05, 0.62);
    if (entrees.molette) etat.distanceVoulue = THREE.MathUtils.clamp(etat.distanceVoulue + entrees.molette * 0.35, 1.6, 6.5);
    // recentrage doux derrière Éric à la manette et au toucher quand il avance
    if ((entrees.source === 'manette' || entrees.source === 'tactile') && Math.abs(entrees.regardX) < 1e-4 && joueur.vitesseHorizontale > 1.0) {
      const cible = joueur.lacet + Math.PI;
      let d = cible - etat.lacet;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      etat.lacet += d * Math.min(1, dt * 0.8);
    }
    const tete = joueur.position.clone();
    tete.y += etat.hauteur * (joueur.accroupi ? 0.7 : 1);
    dir.set(Math.sin(etat.lacet) * Math.cos(etat.tangage), Math.sin(-etat.tangage), Math.cos(etat.lacet) * Math.cos(etat.tangage));
    const droite = vTmp.set(Math.cos(etat.lacet), 0, -Math.sin(etat.lacet));
    const pivot = tete.clone().addScaledVector(droite, etat.epaule * Math.min(1, etat.distanceVoulue / 3));
    // collision de la caméra avec le décor
    const longueur = etat.distanceVoulue;
    const hit = physique.lancerRayon(pivot, dir, longueur + 0.25, FILTRE_CAM);
    let d = longueur;
    if (hit) d = Math.max(0.35, hit.distance - 0.25);
    etat.distanceEffective = d < etat.distanceEffective ? d : etat.distanceEffective + (d - etat.distanceEffective) * Math.min(1, dt * 2.2);
    voulu.copy(pivot).addScaledVector(dir, etat.distanceEffective);
    if (!initialise) { posLisse.copy(voulu); cibleLisse.copy(pivot); initialise = true; }
    posLisse.lerp(voulu, Math.min(1, dt * 18));
    cibleLisse.lerp(pivot, Math.min(1, dt * 20));
    camera.position.copy(posLisse);
    const regard = cibleLisse.clone().addScaledVector(dir, -4);
    camera.lookAt(regard);
    etat.fovVoulu = joueur.court ? 60 : joueur.patine ? 58 : 55;
  }

  function appliquerSecousse(dt) {
    if (etat.secousse > 0 && !options.reduireMouvement) {
      const s = etat.secousse;
      camera.position.x += (Math.random() - 0.5) * s * 0.06;
      camera.position.y += (Math.random() - 0.5) * s * 0.06;
      etat.secousse = Math.max(0, s - dt * 2);
    }
  }

  function mettreAJour(dt, entrees, joueur) {
    if (etat.mode === 'suivi') suivre(dt, entrees, joueur);
    else if (etat.mode === 'cine') {
      if (cine.coupe) {
        camera.position.copy(cine.position);
        cibleLisse.copy(cine.cible);
        cine.coupe = false;
      } else {
        camera.position.lerp(cine.position, Math.min(1, dt * cine.lissage));
        cibleLisse.lerp(cine.cible, Math.min(1, dt * cine.lissage * 1.3));
      }
      camera.lookAt(cibleLisse);
      etat.fovVoulu = cine.fov;
    } else if (etat.mode === 'orbite' && orbite) {
      orbite.angle += dt * orbite.vitesse;
      const p = orbite.centre.clone().add(new THREE.Vector3(Math.sin(orbite.angle) * orbite.rayon, orbite.hauteur, Math.cos(orbite.angle) * orbite.rayon));
      camera.position.lerp(p, Math.min(1, dt * 2));
      camera.lookAt(orbite.regard);
      etat.fovVoulu = orbite.fov;
    }
    etat.fov += (etat.fovVoulu - etat.fov) * Math.min(1, dt * 4);
    if (Math.abs(camera.fov - etat.fov) > 0.01) { camera.fov = etat.fov; camera.updateProjectionMatrix(); }
    appliquerSecousse(dt);
  }

  return {
    etat,
    mettreAJour,
    suivi(joueur) {
      etat.mode = 'suivi';
      if (joueur) {
        etat.lacet = joueur.lacet + Math.PI;
        initialise = false;
      }
    },
    plan(position, cible, { fov = 38, lissage = 3, coupe = false } = {}) {
      etat.mode = 'cine';
      cine.position.copy(position);
      cine.cible.copy(cible);
      cine.fov = fov;
      cine.lissage = lissage;
      cine.coupe = coupe;
    },
    orbite(o) { etat.mode = 'orbite'; orbite = { angle: 0, vitesse: 0.04, rayon: 14, hauteur: 6, fov: 50, ...o }; },
    secouer(f) { etat.secousse = Math.max(etat.secousse, f); },
    get lacet() { return etat.lacet; },
  };
}
