import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const BLEU = '#0d4ea6', BLANC = '#eef1f4', ROUGE = '#b5121b', NOIR = '#151515';
const CHANDAILS_CARABINS = [BLEU, BLEU, BLEU, BLEU, BLANC, BLANC, '#0a3d82', '#1d5fbf', '#2b3a4a', '#6d7378', '#1e2328', '#7a2131', '#3d5a3b', '#c9ccd0'];
const CHANDAILS_VISITEURS = [ROUGE, ROUGE, ROUGE, NOIR, NOIR, '#8e0f17', '#2a2a2a'];
const PEAUX = ['#f1c9a5', '#e8b48c', '#d9a07a', '#c68863', '#a86f4c', '#8a5a3c', '#6b4430', '#f5d6bd'];
const CHEVEUX = ['#2b1d14', '#3b2a1e', '#5a3e2a', '#8a6a44', '#b8945e', '#1a1a1a', '#6e6e6e', '#c9c2b8', '#7a3b1f'];
const PANTALONS = ['#26354a', '#1f2a3a', '#33302c', '#3d4b60', '#1b1b1d', '#4a3f35', '#2f3d55'];

function boite(lx, ly, lz, x, y, z) {
  const g = new THREE.BoxGeometry(lx, ly, lz);
  g.translate(x, y, z);
  return g;
}

function geometries() {
  const torse = new THREE.CylinderGeometry(0.165, 0.15, 0.56, 9, 1);
  torse.scale(1, 1, 0.62);
  torse.translate(0, 0.28, 0);
  const epaules = new THREE.SphereGeometry(0.165, 9, 5, 0, Math.PI * 2, 0, Math.PI / 2);
  epaules.scale(1.05, 0.45, 0.62);
  epaules.translate(0, 0.55, 0);
  const tronc = mergeGeometries([torse.toNonIndexed(), epaules.toNonIndexed()]);

  const crane = new THREE.SphereGeometry(0.102, 11, 9);
  crane.scale(0.92, 1.08, 1);
  crane.translate(0, 0.74, 0.01);
  const cou = new THREE.CylinderGeometry(0.048, 0.055, 0.12, 7);
  cou.translate(0, 0.6, 0);
  const nez = new THREE.ConeGeometry(0.02, 0.05, 5);
  nez.rotateX(Math.PI / 2);
  nez.translate(0, 0.73, 0.105);
  const tete = mergeGeometries([crane.toNonIndexed(), cou.toNonIndexed(), nez.toNonIndexed()]);

  const cheveux = new THREE.SphereGeometry(0.108, 11, 6, 0, Math.PI * 2, 0, Math.PI * 0.52);
  cheveux.scale(0.95, 1.05, 1.04);
  cheveux.rotateX(-0.25);
  cheveux.translate(0, 0.765, -0.006);

  const jambesAssis = mergeGeometries([
    boite(0.14, 0.13, 0.46, -0.095, 0.47, 0.17), boite(0.14, 0.13, 0.46, 0.095, 0.47, 0.17),
    boite(0.11, 0.44, 0.12, -0.095, 0.23, 0.38), boite(0.11, 0.44, 0.12, 0.095, 0.23, 0.38),
    boite(0.11, 0.07, 0.24, -0.095, 0.035, 0.44), boite(0.11, 0.07, 0.24, 0.095, 0.035, 0.44),
  ].map((g) => g.toNonIndexed()));
  const jambesDebout = mergeGeometries([
    boite(0.13, 0.86, 0.14, -0.09, 0.47, 0.02), boite(0.13, 0.86, 0.14, 0.09, 0.47, 0.02),
    boite(0.11, 0.07, 0.24, -0.09, 0.035, 0.07), boite(0.11, 0.07, 0.24, 0.09, 0.035, 0.07),
  ].map((g) => g.toNonIndexed()));

  const bras = new THREE.CylinderGeometry(0.048, 0.04, 0.56, 6, 1);
  bras.translate(0, -0.28, 0);
  const main = new THREE.SphereGeometry(0.045, 6, 5);
  main.translate(0, -0.58, 0);
  const brasMain = mergeGeometries([bras.toNonIndexed(), main.toNonIndexed()]);

  const hampe = new THREE.CylinderGeometry(0.008, 0.008, 0.8, 5);
  hampe.translate(0, 0.4, 0);
  const tissu = new THREE.PlaneGeometry(0.46, 0.3, 6, 1);
  tissu.translate(0.23, 0.64, 0);
  return { tronc, tete, cheveux, jambesAssis, jambesDebout, bras: brasMain, hampe, tissu };
}

function textureDrapeau(haut, bas) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 40;
  const g = c.getContext('2d');
  g.fillStyle = haut; g.fillRect(0, 0, 64, 20);
  g.fillStyle = bas; g.fillRect(0, 20, 64, 20);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function creerFoule({ audio, bus }) {
  const F = { groupe: null, gens: [], meshes: {}, temps: 0, excitation: 0.3, rumeur: null, prochainChant: 25, accum: 0, debout: 0, equipeLocale: 'carabins' };
  const q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3();
  const coul = new THREE.Color();

  function sieges(zone) {
    const liste = [];
    zone.racine.updateWorldMatrix(true, true);
    const p = new THREE.Vector3(), s = new THREE.Vector3(), r = new THREE.Quaternion(), m = new THREE.Matrix4();
    const estSiege = (o) => { for (let n = o; n; n = n.parent) if (/^SIEGES|^SEATS_foule|^SEAT_foule|gradin_siege/i.test(n.name || '')) return true; return false; };
    zone.racine.traverse((o) => {
      if (o.isInstancedMesh && estSiege(o)) {
        for (let i = 0; i < o.count; i++) {
          o.getMatrixAt(i, m);
          m.premultiply(o.matrixWorld).decompose(p, r, s);
          liste.push({ position: p.clone(), quaternion: r.clone() });
        }
      } else if (!o.isMesh && /^SEATS_foule/i.test(o.name || '') && o.children.length) {
        for (const c of o.children) { c.matrixWorld.decompose(p, r, s); liste.push({ position: p.clone(), quaternion: r.clone() }); }
      }
    });
    for (const [id, x] of Object.entries(zone.sieges || {})) if (/foule|gradin|public/i.test(id)) liste.push({ position: x.position.clone(), quaternion: x.quaternion.clone() });
    return liste;
  }

  function installer(zone, { nombre = 320, partVisiteurs = 0.12, equipeLocale = 'carabins', couleursLocales = null, couleursVisiteurs = null } = {}) {
    retirer();
    if (!zone) return 0;
    const places = sieges(zone);
    if (!places.length) return 0;
    F.equipeLocale = equipeLocale;
    const centre = zone.glaceBoite ? zone.glaceBoite.getCenter(new THREE.Vector3()) : new THREE.Vector3();
    // les meilleures places d'abord : près de la glace et du centre
    for (const s of places) s.score = Math.hypot((s.position.x - centre.x) * 0.55, s.position.z - centre.z) + s.position.y * 1.5 + Math.random() * 6;
    places.sort((a, b) => a.score - b.score);
    const choisies = places.slice(0, Math.min(nombre, places.length));
    // une section pour les partisans visiteurs
    const xs = choisies.map((s) => s.position.x).sort((a, b) => a - b);
    const xVisiteurs = xs[Math.floor(xs.length * 0.86)] ?? 0;
    const G = geometries();
    const n = choisies.length;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.86, metalness: 0 });
    const matPeau = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0 });
    const creer = (geo, materiau, compte) => {
      const im = new THREE.InstancedMesh(geo, materiau, compte);
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.frustumCulled = false;
      im.castShadow = false;
      im.receiveShadow = true;
      return im;
    };
    const M = {
      tronc: creer(G.tronc, mat, n), tete: creer(G.tete, matPeau, n), cheveux: creer(G.cheveux, mat, n),
      assis: creer(G.jambesAssis, mat, n), debout: creer(G.jambesDebout, mat, n), bras: creer(G.bras, mat, n * 2),
    };
    const porteDrapeau = [];
    F.gens = choisies.map((s, i) => {
      const visiteur = s.position.x >= xVisiteurs && Math.random() < Math.max(0.5, partVisiteurs * 4);
      const palette = visiteur ? (couleursVisiteurs || CHANDAILS_VISITEURS) : (couleursLocales || CHANDAILS_CARABINS);
      const avant = new THREE.Vector3(0, 0, 1).applyQuaternion(s.quaternion).setY(0);
      const versGlace = centre.clone().sub(s.position).setY(0);
      if (avant.lengthSq() < 1e-4 || avant.dot(versGlace) < 0) avant.copy(versGlace);
      avant.normalize();
      const lacet = Math.atan2(avant.x, avant.z) + (Math.random() - 0.5) * 0.25;
      const echelle = 0.9 + Math.random() * 0.16;
      const g = {
        i, position: s.position.clone(), lacet, echelle, visiteur, phase: Math.random() * Math.PI * 2, vitesse: 0.8 + Math.random() * 0.5,
        etat: 'assis', jusqua: 0, retard: 0, prochain: null, drapeau: -1, penche: (Math.random() - 0.5) * 0.12,
      };
      coul.set(palette[Math.floor(Math.random() * palette.length)]);
      M.tronc.setColorAt(i, coul); M.bras.setColorAt(i * 2, coul); M.bras.setColorAt(i * 2 + 1, coul);
      coul.set(PEAUX[Math.floor(Math.random() * PEAUX.length)]); M.tete.setColorAt(i, coul);
      const tuque = Math.random() < 0.18;
      coul.set(tuque ? (visiteur ? (Math.random() < 0.5 ? ROUGE : NOIR) : (Math.random() < 0.6 ? BLEU : BLANC)) : CHEVEUX[Math.floor(Math.random() * CHEVEUX.length)]);
      M.cheveux.setColorAt(i, coul);
      coul.set(PANTALONS[Math.floor(Math.random() * PANTALONS.length)]); M.assis.setColorAt(i, coul); M.debout.setColorAt(i, coul);
      if (Math.random() < (visiteur ? 0.2 : 0.14)) porteDrapeau.push(g);
      return g;
    });
    const tissuA = new THREE.MeshStandardMaterial({ map: textureDrapeau(BLEU, BLANC), side: THREE.DoubleSide, roughness: 0.9 });
    const tissuB = new THREE.MeshStandardMaterial({ map: textureDrapeau(ROUGE, NOIR), side: THREE.DoubleSide, roughness: 0.9 });
    const locaux = porteDrapeau.filter((g) => !g.visiteur), visiteurs = porteDrapeau.filter((g) => g.visiteur);
    M.drapeauxA = creer(G.tissu, tissuA, Math.max(1, locaux.length));
    M.drapeauxB = creer(G.tissu, tissuB, Math.max(1, visiteurs.length));
    M.hampes = creer(G.hampe, new THREE.MeshStandardMaterial({ color: 0x8a8f94, roughness: 0.5, metalness: 0.4 }), Math.max(1, porteDrapeau.length));
    locaux.forEach((g, k) => { g.drapeau = k; g.lot = 'A'; });
    visiteurs.forEach((g, k) => { g.drapeau = k; g.lot = 'B'; });
    porteDrapeau.forEach((g, k) => { g.hampe = k; });
    M.drapeauxA.count = locaux.length; M.drapeauxB.count = visiteurs.length; M.hampes.count = porteDrapeau.length;
    for (const im of Object.values(M)) if (im.instanceColor) im.instanceColor.needsUpdate = true;
    F.meshes = M;
    F.groupe = new THREE.Group();
    F.groupe.name = 'foule';
    F.groupe.add(...Object.values(M));
    zone.racine.add(F.groupe);
    for (const g of F.gens) poser(g, 0);
    majTout();
    F.temps = 0;
    F.excitation = 0.3;
    demarrerRumeur();
    return n;
  }

  // ---------- poses ----------
  const EPAULE_G = new THREE.Vector3(-0.2, 0.53, 0), EPAULE_D = new THREE.Vector3(0.2, 0.53, 0);
  const mCorps = new THREE.Matrix4(), mTete = new THREE.Matrix4(), mPieds = new THREE.Matrix4(), mBras = new THREE.Matrix4(), mMain = new THREE.Matrix4(), mTmp = new THREE.Matrix4();
  const mCache = new THREE.Matrix4().makeScale(0, 0, 0);
  const tCou = new THREE.Matrix4().makeTranslation(0, 0.6, 0), tCouInv = new THREE.Matrix4().makeTranslation(0, -0.6, 0);
  const tAvant = new THREE.Matrix4().makeTranslation(0, 0, 0.2), tMain = new THREE.Matrix4().makeTranslation(0, -0.58, 0), tHampe = new THREE.Matrix4().makeTranslation(0, -0.15, 0);
  const ech = new THREE.Vector3();
  function placer(g, hauteur, penche, out) {
    q.setFromEuler(e.set(penche, g.lacet, 0, 'YXZ'));
    v.copy(g.position);
    v.y += hauteur;
    return out.compose(v, q, ech.set(g.echelle, g.echelle, g.echelle));
  }

  function poser(g, t) {
    const M = F.meshes;
    const i = g.i;
    const tps = t * g.vitesse + g.phase;
    let debout = false, brasG0 = -0.55, brasG1 = 0.12, brasD0 = -0.55, brasD1 = -0.12, sautille = 0, penche = -0.06 + g.penche, rotTete = 0, drapeauLeve = false, agite = 0;
    switch (g.etat) {
      case 'applaudit': {
        const c = Math.sin(tps * 13) * 0.22;
        brasG0 = -1.35; brasG1 = 0.42 + c; brasD0 = -1.35; brasD1 = -0.42 - c; penche = 0.06;
        break;
      }
      case 'debout': {
        const c = Math.sin(tps * 12) * 0.2;
        debout = true; brasG0 = -1.25; brasG1 = 0.4 + c; brasD0 = -1.25; brasD1 = -0.4 - c; penche = 0.02;
        break;
      }
      case 'joie': {
        const c = Math.sin(tps * 7.5);
        debout = true; sautille = Math.max(0, c) * 0.07;
        brasG0 = -2.85 + c * 0.15; brasG1 = 0.25; brasD0 = -2.85 - c * 0.15; brasD1 = -0.25;
        drapeauLeve = true; agite = Math.sin(tps * 6.5);
        break;
      }
      case 'deception':
        penche = 0.28; brasG0 = -1.9; brasG1 = 0.75; brasD0 = -1.9; brasD1 = -0.75; rotTete = 0.3;
        break;
      case 'drapeau':
        brasD0 = -2.6; brasD1 = -0.2; drapeauLeve = true; agite = Math.sin(tps * 5.5);
        break;
      default:
        rotTete = Math.sin(tps * 0.37) * 0.25;
        if (g.drapeau >= 0) brasD0 = -1.0;
    }
    placer(g, (debout ? 0.9 : 0.45) + sautille, penche, mCorps);
    M.tronc.setMatrixAt(i, mCorps);
    mTete.copy(mCorps).multiply(tCou).multiply(mTmp.makeRotationY(rotTete)).multiply(tCouInv);
    M.tete.setMatrixAt(i, mTete);
    M.cheveux.setMatrixAt(i, mTete);
    placer(g, 0, 0, mPieds);
    if (debout) { M.assis.setMatrixAt(i, mCache); M.debout.setMatrixAt(i, mPieds.multiply(tAvant)); }
    else { M.assis.setMatrixAt(i, mPieds); M.debout.setMatrixAt(i, mCache); }
    mBras.copy(mCorps).multiply(mTmp.makeTranslation(EPAULE_G.x, EPAULE_G.y, EPAULE_G.z)).multiply(mTmp.makeRotationFromEuler(e.set(brasG0, 0, brasG1, 'XYZ')));
    M.bras.setMatrixAt(i * 2, mBras);
    mBras.copy(mCorps).multiply(mTmp.makeTranslation(EPAULE_D.x, EPAULE_D.y, EPAULE_D.z)).multiply(mTmp.makeRotationFromEuler(e.set(brasD0, 0, brasD1, 'XYZ')));
    M.bras.setMatrixAt(i * 2 + 1, mBras);
    if (g.drapeau >= 0) {
      mMain.copy(mBras).multiply(tMain).multiply(mTmp.makeRotationX(drapeauLeve ? Math.PI : 1.2)).multiply(tHampe);
      M.hampes.setMatrixAt(g.hampe, mMain);
      mMain.multiply(mTmp.makeRotationY(agite * 0.9 + 0.3));
      (g.lot === 'A' ? M.drapeauxA : M.drapeauxB).setMatrixAt(g.drapeau, mMain);
    }
  }

  function majTout() {
    for (const im of Object.values(F.meshes)) im.instanceMatrix.needsUpdate = true;
  }

  // ---------- réactions ----------
  function reaction(qui, etat, duree, { part = 1, dispersion = 0.6 } = {}) {
    const t = F.temps;
    for (const g of F.gens) {
      if (qui === 'locaux' && g.visiteur) continue;
      if (qui === 'visiteurs' && !g.visiteur) continue;
      if (Math.random() > part) continue;
      g.prochain = { etat, debut: t + Math.random() * dispersion, fin: t + duree * (0.8 + Math.random() * 0.4) };
    }
  }

  function but(equipe) {
    const locaux = equipe === F.equipeLocale;
    reaction(locaux ? 'locaux' : 'visiteurs', 'joie', 6.5, { part: 0.96, dispersion: 0.5 });
    reaction(locaux ? 'visiteurs' : 'locaux', 'deception', 4, { part: 0.85, dispersion: 0.8 });
    F.excitation = 1;
    if (locaux) {
      audio.jouer('foule_acclame', { volume: 0.95, bus: 'effets' });
      audio.jouer('foule_acclame', { volume: 0.7, hauteur: 0.93, retard: 0.35, bus: 'effets' });
      audio.jouer('foule_acclame', { volume: 0.55, hauteur: 1.06, retard: 2.6, bus: 'effets' });
      audio.jouer('orgue_but', { volume: 0.75, retard: 1.4 });
      setTimeout(() => claquer(8, 2.2), 6200);
    } else {
      audio.jouer('foule_acclame', { volume: 0.35, hauteur: 1.08, filtre: 2400, bus: 'effets' });
      audio.jouer('foule_acclame', { volume: 0.5, hauteur: 0.62, filtre: 700, retard: 0.3, bus: 'effets', duree: 2.6 });
    }
  }

  function reagir(type) {
    if (!F.gens.length) return;
    switch (type) {
      case 'occasion':
        reaction('tous', 'debout', 2.2, { part: 0.45, dispersion: 0.4 });
        audio.jouer('foule_acclame', { volume: 0.4, hauteur: 0.78, filtre: 1100, bus: 'effets', duree: 2.4 });
        F.excitation = Math.min(1, F.excitation + 0.25);
        break;
      case 'arret_local':
        reaction('locaux', 'applaudit', 2.5, { part: 0.55 });
        audio.jouer('foule_acclame', { volume: 0.35, hauteur: 0.9, filtre: 1500, bus: 'effets', duree: 2.5 });
        claquer(1, 1.2);
        break;
      case 'penalite_contre':
        reaction('locaux', 'deception', 2.8, { part: 0.6 });
        audio.jouer('foule_acclame', { volume: 0.45, hauteur: 0.55, filtre: 600, bus: 'effets', duree: 3 });
        break;
      case 'penalite_pour':
        reaction('locaux', 'applaudit', 3.5, { part: 0.8 });
        audio.jouer('foule_acclame', { volume: 0.45, hauteur: 0.95, filtre: 1800, bus: 'effets', duree: 3 });
        claquer(2, 1.5);
        break;
      case 'mise_en_echec':
        audio.jouer('foule_acclame', { volume: 0.3, hauteur: 0.7, filtre: 900, bus: 'effets', duree: 1.6 });
        break;
      case 'debut':
        reaction('tous', 'applaudit', 5, { part: 0.9 });
        audio.jouer('foule_acclame', { volume: 0.6, bus: 'effets' });
        claquer(2, 2);
        break;
      case 'fin_victoire':
        reaction('locaux', 'joie', 9, { part: 0.95 });
        reaction('visiteurs', 'deception', 6, { part: 0.9 });
        audio.jouer('foule_acclame', { volume: 0.9, bus: 'effets' });
        audio.jouer('foule_acclame', { volume: 0.7, hauteur: 0.95, retard: 3, bus: 'effets' });
        break;
      case 'fin_defaite':
        reaction('locaux', 'applaudit', 5, { part: 0.5 });
        reaction('visiteurs', 'joie', 7, { part: 0.95 });
        audio.jouer('foule_acclame', { volume: 0.4, hauteur: 0.85, filtre: 1400, bus: 'effets' });
        break;
      default:
        break;
    }
  }

  // battements de mains de la foule (« Go, Ca-ra-bins, go ! ») : des claquements superposés
  function claquer(mesures = 2, intensite = 1) {
    const motif = [0, 0.5, 1.0, 1.25, 1.5];
    for (let k = 0; k < mesures; k++) {
      for (const b of motif) {
        const t0 = k * 2 + b;
        for (let c = 0; c < 6; c++) audio.jouer('livre_tombe', { volume: 0.055 * intensite, hauteur: 2.6 + Math.random() * 0.9, retard: t0 + Math.random() * 0.045, duree: 0.12, filtre: 4200 });
      }
    }
    reaction('locaux', 'applaudit', mesures * 2 + 0.5, { part: 0.75, dispersion: 0.25 });
  }

  function chant() {
    claquer(4, 1.2);
    audio.jouer('foule_acclame', { volume: 0.3, hauteur: 0.85, filtre: 1300, bus: 'effets', debut: 1.5, duree: 3.5, retard: 4 });
    bus.emit('foule:chant');
  }

  async function demarrerRumeur() {
    F.rumeur?.arreter();
    F.rumeur = await audio.boucle('foule_acclame', { volume: 0.06, hauteur: 0.74, filtre: 650 });
  }

  function mettreAJour(dt, { jeuEnCours = true } = {}) {
    if (!F.gens.length) return;
    F.temps += dt;
    F.excitation += (0.3 - F.excitation) * Math.min(1, dt * 0.08);
    F.rumeur?.regler(0.04 + F.excitation * 0.12, { filtre: 500 + F.excitation * 1400 });
    for (const g of F.gens) {
      const p = g.prochain;
      if (p && F.temps >= p.debut) { g.etat = p.etat; g.jusqua = p.fin; g.prochain = null; }
      if (g.etat !== 'assis' && F.temps > g.jusqua) {
        g.etat = g.etat !== 'drapeau' && g.drapeau >= 0 && Math.random() < 0.3 ? 'drapeau' : 'assis';
        g.jusqua = F.temps + 3 + Math.random() * 4;
      }
    }
    F.accum += dt;
    const anime = F.gens.some((g) => g.etat !== 'assis');
    if (F.accum > (anime ? 1 / 30 : 0.25)) {
      for (const g of F.gens) poser(g, F.temps);
      majTout();
      F.accum = 0;
    }
    if (jeuEnCours) {
      F.prochainChant -= dt;
      if (F.prochainChant <= 0) { F.prochainChant = 35 + Math.random() * 40; chant(); }
    }
  }

  function retirer() {
    F.rumeur?.arreter();
    F.rumeur = null;
    if (F.groupe) {
      F.groupe.parent?.remove(F.groupe);
      F.groupe.traverse((o) => { if (o.isInstancedMesh) { o.geometry.dispose(); o.dispose?.(); } });
    }
    F.groupe = null;
    F.gens = [];
    F.meshes = {};
  }

  return {
    installer, retirer, mettreAJour, but, reagir, chant, claquer,
    get nombre() { return F.gens.length; },
    set excitation(v) { F.excitation = Math.max(F.excitation, v); },
  };
}
