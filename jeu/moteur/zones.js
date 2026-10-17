import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { preparerMateriauLightmap } from './rendu.js?v=e83f1d9a58';
import { creerNavmesh } from './navmesh.js?v=e83f1d9a58';
import { boiteLocale } from './objets.js?v=e83f1d9a58';
import { GROUPES, groupes } from './physique.js?v=e83f1d9a58';

const TOUT = 0xffff;

export function creerChargeur(renderer) {
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
  const gltf = new GLTFLoader();
  gltf.setDRACOLoader(draco);
  gltf.setMeshoptDecoder(MeshoptDecoder);
  // une texture sans image (export incomplet) est ignorée au lieu de faire échouer toute la zone
  gltf.register((parser) => ({
    name: 'texture_sans_image',
    loadTexture(index) {
      const def = parser.json.textures?.[index];
      const ext = def?.extensions || {};
      if (!def || def.source !== undefined || ext.EXT_texture_webp || ext.KHR_texture_basisu || ext.EXT_texture_avif) return null;
      console.warn('[zone] texture sans image ignorée :', index);
      return Promise.resolve(null);
    },
  }));
  const textures = new THREE.TextureLoader();
  const rgbe = new RGBELoader();
  const max = renderer.capabilities.getMaxAnisotropy();
  return { gltf, textures, rgbe, anisotropieMax: max };
}

function charger(loader, url, progression) {
  return new Promise((ok, ko) => loader.load(url, ok, (e) => progression?.(e.total ? e.loaded / e.total : 0), ko));
}

export async function chargerZone({ id, base = 'zones', rendu, physique, objets, chargeur, progression }) {
  const racineUrl = `${base}/${id}/`;
  const manifeste = await (await fetch(`${racineUrl}${id}.json`, { cache: 'no-cache' })).json();
  const etapes = { glb: 0.75, lm: 0.15, env: 0.1 };
  let avance = 0;
  const signaler = (part, f) => progression?.(Math.min(1, avance + part * f));

  const gltf = await charger(chargeur.gltf, racineUrl + manifeste.glb, (f) => signaler(etapes.glb, f));
  avance += etapes.glb;

  const lightmaps = await Promise.all((manifeste.lightmaps || []).map(async (lm) => {
    const t = await charger(chargeur.textures, racineUrl + lm.fichier);
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    t.channel = 1;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.anisotropy = 4;
    return { texture: t, intensite: Math.PI * (lm.scale ?? 1) };
  }));
  avance += etapes.lm;
  signaler(0, 0);

  let envTex = null, envFond = null;
  const env = manifeste.env || {};
  if (env.fichier) {
    try {
      const hdr = await charger(chargeur.rgbe, racineUrl + env.fichier);
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      envTex = rendu.pmrem.fromEquirectangular(hdr).texture;
      if (env.ciel) envFond = hdr; else hdr.dispose();
    } catch (e) {
      console.warn('[zone] environnement introuvable', e);
    }
  }
  if (!envTex) {
    envTex = rendu.pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }
  avance += etapes.env;
  signaler(0, 0);

  const scene = gltf.scene;
  scene.name = `zone_${id}`;
  scene.updateWorldMatrix(true, true);
  const zone = {
    id, manifeste, racine: scene, envTex, envFond,
    spawns: {}, pnj: [], interactions: [], sieges: {}, cameras: {}, declencheurs: [],
    portes: [], dynamiques: [], navmesh: null, corps: [], glace: null, filets: {}, sons: [],
    lumieres: [],
  };

  const aCacher = [];
  const aSupprimer = [];
  const corpsStatique = physique.corpsFixe();
  zone.corps.push(corpsStatique);
  const clonesLm = new Map();
  const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), ech = new THREE.Vector3();

  const noeuds = [];
  scene.traverse((o) => noeuds.push(o));
  const traites = new Set();
  const PREFIXES_OBJETS = /^(COL_|COLM_|NAV_|TRIGGER_|DOORSLIDE_|DOOR_|DYN_|GLACE)/;
  const dansObjetTraite = (o) => { for (let p = o.parent; p; p = p.parent) if (traites.has(p)) return true; return false; };
  for (const o of noeuds) {
    const n = o.name || '';
    if (dansObjetTraite(o)) continue;
    if (PREFIXES_OBJETS.test(n)) traites.add(o);
    const marqueur = () => {
      o.updateWorldMatrix(true, false);
      o.matrixWorld.decompose(pos, quat, ech);
      return { id: n, position: pos.clone(), quaternion: quat.clone(), donnees: { ...o.userData }, objet: o };
    };
    if (n.startsWith('COL_')) {
      const b = boiteLocale(o);
      if (!b.isEmpty()) {
        o.matrixWorld.decompose(pos, quat, ech);
        const taille = b.getSize(new THREE.Vector3()).multiply(ech);
        const centre = b.getCenter(new THREE.Vector3()).multiply(ech).applyQuaternion(quat).add(pos);
        physique.boite(corpsStatique, taille.multiplyScalar(0.5), {
          position: centre, rotation: quat.clone(), friction: 0.7,
          groupes: groupes(GROUPES.STATIQUE, TOUT),
        });
      }
      aSupprimer.push(o);
      continue;
    }
    if (n === 'GLACE' || (n.startsWith('GLACE') && !n.startsWith('GLACE_'))) {
      // la glace est plane : une seule boîte, sans arêtes internes pour la rondelle
      const b = new THREE.Box3().setFromObject(o);
      zone.glace = o;
      zone.glaceBoite = b;
      const centre = b.getCenter(new THREE.Vector3());
      const taille = b.getSize(new THREE.Vector3());
      physique.boite(corpsStatique, { x: taille.x / 2, y: 0.25, z: taille.z / 2 }, {
        position: { x: centre.x, y: b.max.y - 0.25, z: centre.z }, friction: 0.02,
        groupes: groupes(GROUPES.GLACE | GROUPES.STATIQUE, TOUT),
      });
      continue;
    }
    if (n.startsWith('COLM_')) {
      const sommets = [], indices = [];
      o.traverse((m) => {
        if (!m.isMesh) return;
        const g = m.geometry, p = g.attributes.position;
        const base0 = sommets.length / 3;
        const v = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld); sommets.push(v.x, v.y, v.z); }
        if (g.index) for (const i of g.index.array) indices.push(base0 + i);
        else for (let i = 0; i < p.count; i++) indices.push(base0 + i);
      });
      if (indices.length) {
        physique.maillage(corpsStatique, new Float32Array(sommets), new Uint32Array(indices), {
          friction: 0.7, groupes: groupes(GROUPES.STATIQUE, TOUT),
        });
      }
      aSupprimer.push(o);
      continue;
    }
    if (n.startsWith('NAV_')) {
      zone.navmesh = creerNavmesh(o);
      aSupprimer.push(o);
      continue;
    }
    if (n.startsWith('TRIGGER_')) {
      zone.declencheurs.push(objets.ajouterDeclencheur(o));
      aCacher.push(o);
      continue;
    }
    if (n.startsWith('DOORSLIDE_')) { zone.portes.push(objets.ajouterCoulissante(o)); continue; }
    if (n.startsWith('DOOR_')) {
      const p = objets.ajouterPorte(o);
      if (p) zone.portes.push(p);
      continue;
    }
    if (n.startsWith('DYN_')) {
      const d = objets.ajouterDynamique(o);
      if (d) zone.dynamiques.push(d);
      continue;
    }
    if (n.startsWith('SPAWN_')) { zone.spawns[n] = marqueur(); continue; }
    if (n.startsWith('NPC_')) { zone.pnj.push(marqueur()); continue; }
    if (n.startsWith('INTERACT_')) {
      const m = marqueur();
      m.rayon = Number(m.donnees.radius) || 1.6;
      m.label = m.donnees.label || '';
      m.actions = String(m.donnees.action || '').split(';').map((x) => x.trim()).filter(Boolean);
      zone.interactions.push(m);
      continue;
    }
    if (n.startsWith('SEAT_')) { zone.sieges[n] = marqueur(); continue; }
    if (n.startsWith('CAM_')) { const m = marqueur(); m.fov = Number(m.donnees.fov) || 45; zone.cameras[n] = m; continue; }
    if (n.startsWith('FILET_')) zone.filets[n] = o;
  }
  for (const o of aSupprimer) o.parent?.remove(o);
  for (const o of aCacher) o.visible = false;

  // matériaux : lightmaps, anisotropie, transparence, verre
  scene.traverse((o) => {
    if (!o.isMesh) return;
    let lm = undefined;
    for (let p = o; p && lm === undefined; p = p.parent) if (p.userData && p.userData.lm !== undefined) lm = Number(p.userData.lm);
    const mobile = !!(o.userData.porte || o.parent?.userData?.porte || o.userData.dynamique || o.parent?.userData?.dynamique || estDansMobile(o));
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const nouveaux = mats.map((m) => {
      if (!m) return m;
      for (const cle of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap']) {
        if (m[cle]) m[cle].anisotropy = Math.min(chargeur.anisotropieMax, 8);
      }
      const nom = (m.name || '').toLowerCase();
      if (/^glass|verre|vitre/.test(nom)) {
        m.transparent = true;
        m.depthWrite = false;
        m.envMapIntensity = 1.6;
        if (m.opacity === 1) m.opacity = 0.18;
        m.roughness = Math.min(m.roughness ?? 0.05, 0.08);
      } else if (m.transparent && m.map) {
        m.alphaTest = Math.max(m.alphaTest || 0, 0.45);
        m.transparent = false;
        m.depthWrite = true;
      }
      if (lm !== undefined && !mobile && lightmaps[lm] && o.geometry.attributes.uv1) {
        const cle = `${m.uuid}:${lm}`;
        if (!clonesLm.has(cle)) {
          const c = m.clone();
          c.lightMap = lightmaps[lm].texture;
          c.lightMapIntensity = lightmaps[lm].intensite;
          preparerMateriauLightmap(c);
          clonesLm.set(cle, c);
        }
        return clonesLm.get(cle);
      }
      return m;
    });
    o.material = Array.isArray(o.material) ? nouveaux : nouveaux[0];
    o.castShadow = false;
    o.receiveShadow = true;
    if (mobile) o.castShadow = true;
  });

  // collisions exactes sur tout le décor solide visible, en plus des COL_
  if (manifeste.collisionsAuto !== false) {
    const sommets = [], indices = [];
    const v = new THREE.Vector3();
    const taille = new THREE.Vector3();
    scene.updateWorldMatrix(true, true);
    scene.traverse((o) => {
      if (!o.isMesh || !o.geometry?.attributes?.position || o.isSkinnedMesh) return;
      for (let p = o; p; p = p.parent) if (p.visible === false) return;
      if (o === zone.glace || o.parent === zone.glace) return;
      if (o.userData.porte || o.userData.dynamique || estDansMobile(o)) return;
      for (let p = o; p; p = p.parent) {
        const n = p.name || '';
        if (Number(p.userData?.collide) === 0 || /NOCOL|^FILET_|filet|feuill|leaf|herbe|grass|decal|ligne_|marquage/i.test(n)) return;
      }
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      if (mats.every((m) => m && m.alphaTest > 0 && !/glass|verre|vitre/i.test(m.name || ''))) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      o.geometry.boundingBox.getSize(taille);
      const e = new THREE.Vector3();
      o.matrixWorld.decompose(new THREE.Vector3(), new THREE.Quaternion(), e);
      taille.multiply(e);
      if (Math.max(taille.x, taille.y, taille.z) < 0.3) return;
      if (zone.glaceBoite && taille.y < 0.05) {
        const c = new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
        const g = zone.glaceBoite;
        if (c.x > g.min.x && c.x < g.max.x && c.z > g.min.z && c.z < g.max.z && Math.abs(c.y - g.max.y) < 0.08) return;
      }
      const pos = o.geometry.attributes.position;
      const base0 = sommets.length / 3;
      for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld); sommets.push(v.x, v.y, v.z); }
      if (o.geometry.index) for (const i of o.geometry.index.array) indices.push(base0 + i);
      else for (let i = 0; i < pos.count; i++) indices.push(base0 + i);
    });
    if (indices.length) {
      physique.maillage(corpsStatique, new Float32Array(sommets), new Uint32Array(indices), {
        friction: 0.7, groupes: groupes(GROUPES.STATIQUE, TOUT),
      });
      zone.trianglesCollision = indices.length / 3;
    }
  }

  return zone;
}

function estDansMobile(o) {
  for (let p = o.parent; p; p = p.parent) if (p.userData?.porte || p.userData?.dynamique) return true;
  return false;
}

export function installerZone(zone, rendu) {
  const { scene, renderer } = rendu;
  scene.add(zone.racine);
  scene.environment = zone.envTex;
  scene.environmentIntensity = zone.manifeste.env?.intensite ?? 1;
  if (zone.envFond) {
    scene.background = zone.envFond;
    scene.backgroundIntensity = zone.manifeste.env?.intensiteFond ?? 1;
    scene.backgroundBlurriness = 0;
  } else {
    scene.background = new THREE.Color(zone.manifeste.env?.fond || '#1b2328');
  }
  const b = zone.manifeste.brouillard;
  scene.fog = b && b.densite > 0 ? new THREE.FogExp2(new THREE.Color(b.couleur || '#cfd6da'), b.densite) : null;
  renderer.toneMappingExposure = zone.manifeste.exposition ?? 1;
}

export function retirerZone(zone, rendu, physique) {
  if (!zone) return;
  rendu.scene.remove(zone.racine);
  const vus = new Set();
  zone.racine.traverse((o) => {
    if (o.isMesh) {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m || vus.has(m)) continue;
        vus.add(m);
        for (const k of Object.keys(m)) if (m[k]?.isTexture) m[k].dispose();
        m.dispose();
      }
    }
  });
  zone.envTex?.dispose();
  zone.envFond?.dispose();
  physique.vider();
}
