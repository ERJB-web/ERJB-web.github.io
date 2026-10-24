import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export const GROUPES = {
  STATIQUE: 0x0001,
  DYNAMIQUE: 0x0002,
  JOUEUR: 0x0004,
  PNJ: 0x0008,
  RONDELLE: 0x0010,
  PORTE: 0x0020,
  GLACE: 0x0040,
};

export function groupes(membre, filtre) {
  return ((membre & 0xffff) << 16) | (filtre & 0xffff);
}

const TOUT = 0xffff;
const PAS = 1 / 60;

export async function creerPhysique() {
  await RAPIER.init();
  const monde = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  monde.timestep = PAS;
  const liens = [];
  let accumulateur = 0;
  const qTmp = new THREE.Quaternion();

  function corpsFixe(position, quaternion) {
    const d = RAPIER.RigidBodyDesc.fixed();
    if (position) d.setTranslation(position.x, position.y, position.z);
    if (quaternion) d.setRotation({ x: quaternion.x, y: quaternion.y, z: quaternion.z, w: quaternion.w });
    return monde.createRigidBody(d);
  }

  function boite(corps, demi, options = {}) {
    const d = RAPIER.ColliderDesc.cuboid(Math.max(demi.x, 0.005), Math.max(demi.y, 0.005), Math.max(demi.z, 0.005));
    configurer(d, options);
    return monde.createCollider(d, corps);
  }

  function maillage(corps, sommets, indices, options = {}) {
    const d = RAPIER.ColliderDesc.trimesh(sommets, indices, RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES);
    configurer(d, options);
    return monde.createCollider(d, corps);
  }

  function configurer(d, o) {
    if (o.position) d.setTranslation(o.position.x, o.position.y, o.position.z);
    if (o.rotation) d.setRotation({ x: o.rotation.x, y: o.rotation.y, z: o.rotation.z, w: o.rotation.w });
    if (o.friction !== undefined) d.setFriction(o.friction);
    if (o.restitution !== undefined) d.setRestitution(o.restitution);
    if (o.densite !== undefined) d.setDensity(o.densite);
    if (o.masse !== undefined) d.setMass(o.masse);
    if (o.groupes !== undefined) d.setCollisionGroups(o.groupes);
    if (o.capteur) d.setSensor(true);
    if (o.combinerFriction) d.setFrictionCombineRule(o.combinerFriction);
  }

  function corpsDynamique(objet3d, forme, demi, options = {}) {
    objet3d.updateWorldMatrix(true, false);
    const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    objet3d.matrixWorld.decompose(p, q, s);
    const d = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(p.x, p.y, p.z)
      .setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
      .setLinearDamping(options.amortLineaire ?? 0.15)
      .setAngularDamping(options.amortAngulaire ?? 0.4)
      .setCanSleep(true);
    if (options.ccd) d.setCcdEnabled(true);
    const corps = monde.createRigidBody(d);
    let cd;
    const c = options.centre || new THREE.Vector3();
    if (forme === 'sphere') cd = RAPIER.ColliderDesc.ball(Math.max(demi.x, demi.y, demi.z));
    else if (forme === 'cylinder') cd = RAPIER.ColliderDesc.cylinder(demi.y, Math.max(demi.x, demi.z));
    else if (forme === 'hull' && options.points) cd = RAPIER.ColliderDesc.convexHull(options.points) || RAPIER.ColliderDesc.cuboid(demi.x, demi.y, demi.z);
    else cd = RAPIER.ColliderDesc.cuboid(Math.max(demi.x, 0.01), Math.max(demi.y, 0.01), Math.max(demi.z, 0.01));
    cd.setTranslation(c.x, c.y, c.z);
    cd.setMass(options.masse ?? 1);
    cd.setFriction(options.friction ?? 0.6);
    cd.setRestitution(options.restitution ?? 0.1);
    cd.setCollisionGroups(options.groupes ?? groupes(GROUPES.DYNAMIQUE, TOUT));
    const collider = monde.createCollider(cd, corps);
    lier(objet3d, corps);
    return { corps, collider };
  }

  function lier(objet3d, corps) {
    objet3d.matrixAutoUpdate = true;
    liens.push({ objet3d, corps });
  }

  function delier(objet3d) {
    const i = liens.findIndex((l) => l.objet3d === objet3d);
    if (i >= 0) liens.splice(i, 1);
  }

  const pInv = new THREE.Matrix4();
  const mTmp = new THREE.Matrix4();
  const vTmp = new THREE.Vector3();
  const sUn = new THREE.Vector3(1, 1, 1);

  function synchroniser() {
    for (const { objet3d, corps } of liens) {
      if (!corps.isKinematic() && corps.isSleeping() && objet3d.userData.dormait) continue;
      objet3d.userData.dormait = corps.isSleeping();
      const t = corps.translation();
      const r = corps.rotation();
      vTmp.set(t.x, t.y, t.z);
      qTmp.set(r.x, r.y, r.z, r.w);
      const parent = objet3d.parent;
      if (parent && !parent.isScene) {
        parent.updateWorldMatrix(true, false);
        pInv.copy(parent.matrixWorld).invert();
        mTmp.compose(vTmp, qTmp, objet3d.userData.echelleMonde || sUn);
        mTmp.premultiply(pInv);
        mTmp.decompose(objet3d.position, objet3d.quaternion, objet3d.scale);
      } else {
        objet3d.position.copy(vTmp);
        objet3d.quaternion.copy(qTmp);
      }
    }
  }

  function avancer(dt, avantPas) {
    accumulateur += Math.min(dt, 0.1);
    let n = 0;
    while (accumulateur >= PAS && n < 4) {
      avantPas?.(PAS);
      monde.step();
      accumulateur -= PAS;
      n++;
    }
    if (n === 4) accumulateur = 0;
    synchroniser();
    return n;
  }

  const rayon = new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
  function lancerRayon(origine, direction, distance, filtre = groupes(TOUT, GROUPES.STATIQUE | GROUPES.PORTE), exclure) {
    rayon.origin.x = origine.x; rayon.origin.y = origine.y; rayon.origin.z = origine.z;
    rayon.dir.x = direction.x; rayon.dir.y = direction.y; rayon.dir.z = direction.z;
    const hit = monde.castRayAndGetNormal(rayon, distance, true, undefined, filtre, exclure);
    if (!hit) return null;
    return { distance: hit.timeOfImpact ?? hit.toi, normale: hit.normal, collider: hit.collider };
  }

  function vider() {
    for (const l of liens.splice(0)) void l;
    const corps = [];
    monde.forEachRigidBody((b) => corps.push(b));
    for (const b of corps) monde.removeRigidBody(b);
    accumulateur = 0;
  }

  return {
    RAPIER, monde, groupes, GROUPES,
    corpsFixe, boite, maillage, corpsDynamique, lier, delier,
    avancer, lancerRayon, vider,
  };
}
