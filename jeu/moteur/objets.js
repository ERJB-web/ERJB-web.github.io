import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=57e75813b4';

const TOUT = 0xffff;
const AXE_Y = new THREE.Vector3(0, 1, 0);

export function boiteLocale(objet) {
  const boite = new THREE.Box3();
  const inv = new THREE.Matrix4();
  objet.updateWorldMatrix(true, true);
  inv.copy(objet.matrixWorld).invert();
  const v = new THREE.Vector3();
  objet.traverse((o) => {
    if (!o.isMesh || !o.geometry?.attributes?.position) return;
    const pos = o.geometry.attributes.position;
    const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m);
      boite.expandByPoint(v);
    }
  });
  return boite;
}

function echelleMonde(objet) {
  const s = new THREE.Vector3();
  objet.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), s);
  return s;
}

export function creerObjets({ physique, audio, bus }) {
  const { RAPIER, monde } = physique;
  const portes = [];
  const coulissantes = [];
  const dynamiques = [];
  const declencheurs = [];
  const qA = new THREE.Quaternion(), qB = new THREE.Quaternion(), qR = new THREE.Quaternion();
  const vTmp = new THREE.Vector3();

  function ajouterPorte(objet) {
    const u = objet.userData || {};
    objet.updateWorldMatrix(true, true);
    const b = boiteLocale(objet);
    if (b.isEmpty()) return null;
    const s = echelleMonde(objet);
    const p = new THREE.Vector3(), q = new THREE.Quaternion();
    objet.matrixWorld.decompose(p, q, new THREE.Vector3());
    const taille = b.getSize(new THREE.Vector3()).multiply(s);
    const centre = b.getCenter(new THREE.Vector3()).multiply(s);
    const masse = Number(u.weight) || 25;
    const ancre = monde.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(p.x, p.y, p.z).setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }));
    const corps = monde.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(p.x, p.y, p.z)
        .setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
        .setAngularDamping(2.6)
        .setLinearDamping(4)
        .setCanSleep(true)
    );
    const cd = RAPIER.ColliderDesc.cuboid(Math.max(taille.x / 2 - 0.015, 0.02), Math.max(taille.y / 2 - 0.01, 0.02), Math.max(taille.z / 2, 0.015))
      .setTranslation(centre.x, centre.y + 0.01, centre.z)
      .setMass(masse)
      .setFriction(0.3)
      .setCollisionGroups(groupes(GROUPES.PORTE, GROUPES.JOUEUR | GROUPES.PNJ | GROUPES.DYNAMIQUE | GROUPES.RONDELLE));
    const collider = monde.createCollider(cd, corps);
    const ouverture = THREE.MathUtils.degToRad(Number(u.open_deg) || 105);
    const sens = u.swing === undefined ? 0 : Number(u.swing);
    const min = sens > 0 ? 0 : -ouverture;
    const max = sens < 0 ? 0 : ouverture;
    const params = RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 });
    params.limitsEnabled = true;
    params.limits = [min, max];
    const joint = monde.createImpulseJoint(params, ancre, corps, true);
    const ferme = u.closer === undefined ? 1 : Number(u.closer);
    const porte = {
      objet, corps, ancre, joint, collider, min, max, sens, ouverture, masse,
      largeur: taille.x, centreLocal: centre,
      label: u.label || '', verrou: Number(u.locked) === 1, cle: u.key || null,
      ferme, commande: null, angle: 0, angleAvant: 0, sonFerme: true, id: objet.name,
    };
    reglerFermeture(porte);
    if (porte.verrou) corps.setBodyType(RAPIER.RigidBodyType.Fixed, true);
    physique.lier(objet, corps);
    objet.userData.porte = porte;
    portes.push(porte);
    return porte;
  }

  function reglerFermeture(porte) {
    if (porte.ferme) porte.joint.configureMotorPosition(0, 3.5 + porte.masse * 0.08, 2.2);
    else porte.joint.configureMotorPosition(0, 0, 0.6);
  }

  function anglePorte(porte) {
    const ra = porte.ancre.rotation(), rb = porte.corps.rotation();
    qA.set(ra.x, ra.y, ra.z, ra.w); qB.set(rb.x, rb.y, rb.z, rb.w);
    qR.copy(qA).invert().multiply(qB);
    return 2 * Math.atan2(qR.y, qR.w);
  }

  function coteJoueur(porte, position) {
    vTmp.copy(position);
    porte.objet.parent.updateWorldMatrix(true, false);
    const t = porte.ancre.translation(), r = porte.ancre.rotation();
    qA.set(r.x, r.y, r.z, r.w).invert();
    vTmp.sub(new THREE.Vector3(t.x, t.y, t.z)).applyQuaternion(qA);
    return vTmp.z >= 0 ? 1 : -1;
  }

  function actionnerPorte(porte, positionActeur, forcer) {
    if (porte.verrou && !forcer) {
      audio?.jouer3d('porte_verrouillee', porte.objet.getWorldPosition(vTmp));
      porte.secousse = 0.35;
      return 'verrouillee';
    }
    if (porte.verrou && forcer) deverrouiller(porte);
    const a = anglePorte(porte);
    porte.corps.wakeUp();
    if (Math.abs(a) > THREE.MathUtils.degToRad(18)) {
      porte.commande = { cible: 0, t: 1.4 };
      porte.joint.configureMotorPosition(0, 40, 9);
      return 'fermer';
    }
    let dir = coteJoueur(porte, positionActeur) > 0 ? 1 : -1;
    if (porte.sens > 0) dir = 1;
    if (porte.sens < 0) dir = -1;
    const cible = dir > 0 ? porte.max * 0.94 : porte.min * 0.94;
    porte.commande = { cible, t: 1.1 };
    porte.joint.configureMotorPosition(cible, 55, 10);
    audio?.jouer3d(Math.random() < 0.25 ? 'porte_grince' : 'porte_ouvre', porte.objet.getWorldPosition(vTmp), { hauteur: 0.9 + Math.random() * 0.2 });
    porte.sonFerme = false;
    return 'ouvrir';
  }

  function ouvrir(porte, positionActeur) {
    if (porte.verrou) return false;
    let dir = coteJoueur(porte, positionActeur) > 0 ? 1 : -1;
    if (porte.sens > 0) dir = 1;
    if (porte.sens < 0) dir = -1;
    const cible = dir > 0 ? porte.max * 0.94 : porte.min * 0.94;
    if (porte.commande && Math.abs(porte.commande.cible - cible) < 0.01) return true;
    porte.corps.wakeUp();
    porte.commande = { cible, t: 2.2 };
    porte.joint.configureMotorPosition(cible, 55, 10);
    if (Math.abs(anglePorte(porte)) < 0.2) audio?.jouer3d('porte_ouvre', porte.objet.getWorldPosition(vTmp), { hauteur: 0.95 + Math.random() * 0.1 });
    porte.sonFerme = false;
    return true;
  }

  function deverrouiller(porte) {
    if (!porte.verrou) return;
    porte.verrou = false;
    porte.corps.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    reglerFermeture(porte);
  }

  function ajouterCoulissante(objet) {
    const u = objet.userData || {};
    objet.updateWorldMatrix(true, true);
    const b = boiteLocale(objet);
    const s = echelleMonde(objet);
    const p = new THREE.Vector3(), q = new THREE.Quaternion();
    objet.matrixWorld.decompose(p, q, new THREE.Vector3());
    const taille = b.getSize(new THREE.Vector3()).multiply(s);
    const centre = b.getCenter(new THREE.Vector3()).multiply(s);
    const corps = monde.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(p.x, p.y, p.z).setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }));
    monde.createCollider(RAPIER.ColliderDesc.cuboid(taille.x / 2, taille.y / 2, taille.z / 2).setTranslation(centre.x, centre.y, centre.z)
      .setCollisionGroups(groupes(GROUPES.STATIQUE, TOUT)), corps);
    const axe = String(u.axis || 'x').toLowerCase();
    const dist = Number(u.dist) || taille.x * 0.95;
    const local = axe === 'x' ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, -1);
    const dirMonde = local.multiplyScalar(dist).applyQuaternion(q);
    const c = { objet, corps, origine: p.clone(), dir: dirMonde, ouverture: 0, cible: 0, centreMonde: b.getCenter(new THREE.Vector3()).applyMatrix4(objet.matrixWorld) };
    physique.lier(objet, corps);
    coulissantes.push(c);
    return c;
  }

  function ajouterDynamique(objet) {
    const u = objet.userData || {};
    objet.updateWorldMatrix(true, true);
    const b = boiteLocale(objet);
    if (b.isEmpty()) return null;
    const s = echelleMonde(objet);
    const demi = b.getSize(new THREE.Vector3()).multiply(s).multiplyScalar(0.5);
    const centre = b.getCenter(new THREE.Vector3()).multiply(s);
    const masse = Number(u.mass) || Math.max(0.2, demi.x * demi.y * demi.z * 8 * 400);
    const forme = u.shape || 'box';
    const estRondelle = /rondelle/i.test(objet.name);
    const options = {
      masse, centre,
      friction: estRondelle ? 0.04 : 0.7,
      restitution: estRondelle ? 0.35 : 0.08,
      ccd: estRondelle,
      amortLineaire: estRondelle ? 0.05 : 0.2,
      amortAngulaire: estRondelle ? 0.3 : 0.5,
      groupes: groupes(estRondelle ? GROUPES.RONDELLE : GROUPES.DYNAMIQUE, TOUT),
    };
    objet.userData.echelleMonde = s;
    const { corps, collider } = physique.corpsDynamique(objet, forme, demi, options);
    if (estRondelle) collider.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min);
    const d = {
      objet, corps, collider, masse, demi, centre,
      prenable: Number(u.pickable) === 1, label: u.label || '', id: objet.name,
      cote: u.cote || null, titre: u.titre || null, rondelle: estRondelle,
      chocAvant: 0,
    };
    objet.userData.dynamique = d;
    dynamiques.push(d);
    // au repos jusqu'au premier contact : un objet posé ne s'envole pas au chargement
    corps.sleep();
    return d;
  }

  function ajouterDeclencheur(objet) {
    objet.updateWorldMatrix(true, true);
    const b = boiteLocale(objet);
    const inv = objet.matrixWorld.clone().invert();
    const actions = String(objet.userData.action || '').split(';').map((x) => x.trim()).filter(Boolean);
    const t = { objet, id: objet.name, boite: b, inv, actions, une: Number(objet.userData.once) === 1, dedans: false, fait: false };
    declencheurs.push(t);
    objet.visible = false;
    return t;
  }

  const pLocal = new THREE.Vector3();
  function testerDeclencheurs(position) {
    for (const t of declencheurs) {
      if (t.une && t.fait) continue;
      pLocal.copy(position).applyMatrix4(t.inv);
      const dedans = t.boite.containsPoint(pLocal);
      if (dedans && !t.dedans) {
        t.dedans = true;
        t.fait = true;
        bus.emit('declencheur:entree', t);
      } else if (!dedans && t.dedans) {
        t.dedans = false;
        bus.emit('declencheur:sortie', t);
      }
    }
  }

  function mettreAJour(dt, acteurs) {
    for (const porte of portes) {
      const a = anglePorte(porte);
      const vitesse = (a - porte.angleAvant) / Math.max(dt, 1e-3);
      porte.angleAvant = a;
      porte.angle = a;
      if (porte.commande) {
        porte.commande.t -= dt;
        if (porte.commande.t <= 0 || Math.abs(a - porte.commande.cible) < 0.03) {
          porte.commande = null;
          reglerFermeture(porte);
        }
      }
      if (!porte.sonFerme && Math.abs(a) < 0.035 && Math.abs(vitesse) > 0.25) {
        porte.sonFerme = true;
        audio?.jouer3d('porte_ferme', porte.objet.getWorldPosition(vTmp), { volume: Math.min(1, Math.abs(vitesse) / 2) });
      }
      if (Math.abs(a) > 0.2) porte.sonFerme = false;
      if (porte.secousse > 0) {
        porte.secousse -= dt;
        if (!porte.qBase) porte.qBase = porte.objet.quaternion.clone();
        const off = porte.secousse > 0 ? Math.sin(porte.secousse * 70) * 0.012 * porte.secousse : 0;
        porte.objet.quaternion.copy(porte.qBase).multiply(qR.setFromAxisAngle(AXE_Y, off));
        if (porte.secousse <= 0) { porte.objet.quaternion.copy(porte.qBase); porte.qBase = null; }
      }
    }
    for (const c of coulissantes) {
      let proche = false;
      for (const a of acteurs) {
        if (a && a.distanceTo(c.centreMonde) < 2.6) { proche = true; break; }
      }
      const cible = proche ? 1 : 0;
      if (cible !== c.cible) {
        c.cible = cible;
        audio?.jouer3d('coulissante', c.centreMonde);
      }
      c.ouverture += Math.sign(c.cible - c.ouverture) * Math.min(Math.abs(c.cible - c.ouverture), dt * 1.4);
      const e = c.ouverture < 0.5 ? 2 * c.ouverture * c.ouverture : 1 - Math.pow(-2 * c.ouverture + 2, 2) / 2;
      const p = c.origine.clone().addScaledVector(c.dir, e);
      c.corps.setNextKinematicTranslation({ x: p.x, y: p.y, z: p.z });
    }
    for (const d of dynamiques) {
      if (d.porte || d.tenu) continue;
      const v = d.corps.linvel();
      const vit = Math.hypot(v.x, v.y, v.z);
      if (d.chocAvant - vit > 1.2 && !d.corps.isSleeping()) {
        const nom = d.rondelle ? 'rondelle_bande' : /livre/i.test(d.id) ? 'livre_tombe' : 'objet_choc';
        audio?.jouer3d(nom, d.objet.getWorldPosition(vTmp), { volume: Math.min(1, (d.chocAvant - vit) / 4) });
      }
      d.chocAvant = vit;
    }
  }

  function prendre(d) {
    d.tenu = true;
    d.corps.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    d.collider.setCollisionGroups(groupes(GROUPES.DYNAMIQUE, GROUPES.STATIQUE));
  }

  function porterVers(d, position, quaternion) {
    d.corps.setNextKinematicTranslation({ x: position.x, y: position.y, z: position.z });
    d.corps.setNextKinematicRotation({ x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w });
  }

  function lacher(d, vitesse) {
    d.tenu = false;
    d.corps.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    d.collider.setCollisionGroups(groupes(d.rondelle ? GROUPES.RONDELLE : GROUPES.DYNAMIQUE, TOUT));
    if (vitesse) d.corps.setLinvel({ x: vitesse.x, y: vitesse.y, z: vitesse.z }, true);
  }

  function retirer(d) {
    const i = dynamiques.indexOf(d);
    if (i >= 0) dynamiques.splice(i, 1);
    physique.delier(d.objet);
    monde.removeRigidBody(d.corps);
    d.objet.parent?.remove(d.objet);
  }

  function vider() {
    portes.length = 0; coulissantes.length = 0; dynamiques.length = 0; declencheurs.length = 0;
  }

  return {
    portes, coulissantes, dynamiques, declencheurs,
    ajouterPorte, ajouterCoulissante, ajouterDynamique, ajouterDeclencheur,
    actionnerPorte, ouvrir, deverrouiller, anglePorte,
    testerDeclencheurs, mettreAJour, prendre, porterVers, lacher, retirer, vider,
  };
}
