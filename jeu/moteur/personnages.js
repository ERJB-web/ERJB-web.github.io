import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { recolorer } from './equipes.js?v=5a3cf24964';

const ALIAS = {
  idle: ['idle', 'Idle', 'repos'],
  walk: ['walk', 'Walk', 'marche'],
  run: ['run', 'Run', 'course'],
};

// hauteur du bassin d'Éric, sur qui les animations communes ont été faites
const BASSIN_ERIC = 0.959;
const clipsAdaptes = new Map();

// garde les rotations et les morphoses, et ne garde du déplacement que celui du bassin, mis à l'échelle,
// pour que les longueurs d'os d'Éric n'étirent pas un personnage d'une autre taille
function adapterClips(liste, ratio) {
  const cle = ratio.toFixed(3);
  if (!clipsAdaptes.has(cle)) {
    clipsAdaptes.set(cle, liste.map((clip) => {
      const pistes = [];
      for (const p of clip.tracks) {
        const prop = p.name.slice(p.name.lastIndexOf('.') + 1);
        if (prop === 'quaternion' || p.name.includes('morphTargetInfluences')) pistes.push(p);
        else if (prop === 'position' && /pelvis/i.test(p.name)) {
          const q = p.clone();
          for (let i = 0; i < q.values.length; i++) q.values[i] *= ratio;
          pistes.push(q);
        }
      }
      return new THREE.AnimationClip(clip.name, clip.duration, pistes);
    }));
  }
  return clipsAdaptes.get(cle);
}

export function creerPersonnages({ chargeur, base = 'personnages', audio }) {
  const modeles = new Map();
  let clips = [];
  let clipsPromesse = null;
  const tous = [];
  const ombreTex = texturerOmbre();

  function chargerGLB(url) {
    return new Promise((ok, ko) => chargeur.gltf.load(url, ok, undefined, ko));
  }

  async function animations() {
    if (!clipsPromesse) {
      clipsPromesse = chargerGLB(`${base}/animations.glb`)
        .then((g) => { clips = g.animations || []; return clips; })
        .catch(() => { clips = []; return clips; });
    }
    return clipsPromesse;
  }

  const existence = new Map();
  function existe(role) {
    if (!existence.has(role)) existence.set(role, fetch(`${base}/${role}.glb`, { method: 'HEAD', cache: 'no-cache' }).then((r) => r.ok).catch(() => false));
    return existence.get(role);
  }

  const HOCKEY = ['joueur_hockey_1', 'joueur_hockey_2', 'joueur_hockey_3', 'joueur_hockey_4', 'joueur_hockey_5', 'joueur_hockey_6'];
  const CIVILS = ['entraineur', 'entraineur_patin', 'chauffeur_zamboni', 'etudiant_1', 'etudiant_2', 'etudiant_3', 'etudiant_4', 'collegue_doc', 'bibliothecaire', 'prof_seminaire', 'prof_quanti', 'intervenante_sad', 'gestionnaire_clsc', 'prepose_accueil', 'usager_1', 'usager_2', 'usager_3', 'jury_1', 'jury_2', 'jury_3'];
  const SUPPORTERS = Array.from({ length: 10 }, (_, i) => `supporter_${i + 1}`);
  const equipe = (t) => Array.from({ length: 8 }, (_, i) => `${t}_${i + 1}`);
  function candidats(role) {
    const m = /^(carabins|visiteurs)_(\d+)$/.exec(role);
    if (m) {
      const k = Number(m[2]), t = m[1], autre = t === 'carabins' ? 'visiteurs' : 'carabins';
      const memes = equipe(t).filter((r) => r !== role);
      return [...memes, HOCKEY[(k - 1) % 6], ...HOCKEY, 'gardien', ...equipe(autre)];
    }
    const ligue = /^(canadiens|adversaires_lnh)_(\d+)$/.exec(role);
    if (ligue) {
      const k = Number(ligue[2]);
      return [...Array.from({ length: 8 }, (_, i) => `${ligue[1]}_${i + 1}`).filter((r) => r !== role), HOCKEY[(k - 1) % 6], ...HOCKEY, 'gardien'];
    }
    if (/_gardien$/.test(role) || role === 'gardien') return ['gardien', 'carabins_gardien', 'visiteurs_gardien', ...HOCKEY];
    if (/^arbitre_/.test(role)) return ['arbitre_1', 'arbitre_2', ...HOCKEY, 'gardien'];
    if (role === 'entraineur' || role === 'entraineur_patin') return ['entraineur', 'entraineur_patin', 'chauffeur_zamboni', 'prof_seminaire', 'gestionnaire_clsc', 'etudiant_1', ...CIVILS, ...HOCKEY];
    if (/^supporter_/.test(role)) return [...SUPPORTERS, 'etudiant_1', 'etudiant_2', 'etudiant_3', 'etudiant_4', 'usager_1', 'usager_2', 'usager_3', 'collegue_doc', ...CIVILS, ...HOCKEY];
    if (/^joueur_hockey_/.test(role)) return [...HOCKEY, ...equipe('carabins'), 'gardien'];
    if (/^jury_/.test(role)) return ['jury_1', 'jury_2', 'jury_3', 'prof_seminaire', 'prof_quanti', ...CIVILS, ...HOCKEY];
    return ['etudiant_1', 'etudiant_2', 'etudiant_3', 'etudiant_4', 'usager_1', 'usager_2', 'collegue_doc', ...CIVILS, ...SUPPORTERS, ...HOCKEY, 'gardien'];
  }

  async function source(role) {
    if (await existe(role)) return role;
    if (role === 'eric' || role === 'chienne') return null;
    if (role === 'eric_hockey') return (await existe('eric')) ? 'eric' : null;
    for (const c of candidats(role)) if (c !== role && c !== 'eric' && c !== 'eric_hockey' && (await existe(c))) return c;
    return null;
  }

  async function modele(role) {
    const src = await source(role);
    if (!src) return { gltf: null, source: null };
    if (!modeles.has(src)) {
      modeles.set(src, chargerGLB(`${base}/${src}.glb`).catch(() => { existence.set(src, Promise.resolve(false)); modeles.delete(src); return null; }));
    }
    let gltf = await modeles.get(src);
    if (!gltf) return modele(role);
    return { gltf, source: gltf ? src : null };
  }

  function trouverOs(racine, motifs) {
    let trouve = null;
    racine.traverse((o) => {
      if (trouve || !o.isBone) return;
      if (motifs.some((m) => m.test(o.name))) trouve = o;
    });
    return trouve;
  }

  async function creer(role, options = {}) {
    const [{ gltf, source: src }, anims] = await Promise.all([modele(role), animations()]);
    const racine = new THREE.Group();
    racine.name = `perso_${role}`;
    let corps;
    let clipsPropres = [];
    if (gltf) {
      corps = SkeletonUtils.clone(gltf.scene);
      clipsPropres = gltf.animations || [];
    } else {
      corps = mannequin(options.couleur);
    }
    racine.add(corps);
    if (options.couleurs && (src !== role || options.toujoursRecolorer)) recolorer(corps, options.couleurs);
    let decalagePatins = 0;
    corps.traverse((o) => { const d = o.userData?.decalage_patins ?? o.userData?.lever; if (d != null && Number.isFinite(Number(d))) decalagePatins = Math.max(decalagePatins, Number(d)); });
    const morphs = [];
    corps.traverse((o) => {
      if (o.isMesh || o.isSkinnedMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.frustumCulled = false;
        if (o.morphTargetDictionary) morphs.push(o);
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (!m) continue;
          if (m.transparent && m.map) { m.alphaTest = 0.4; m.transparent = false; m.alphaToCoverage = true; }
          m.envMapIntensity = 1.0;
        }
      }
    });
    const ombre = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({
      map: ombreTex, transparent: true, depthWrite: false, opacity: 0.55, color: 0x000000,
      polygonOffset: true, polygonOffsetFactor: -2,
    }));
    ombre.rotation.x = -Math.PI / 2;
    ombre.position.y = 0.012;
    ombre.renderOrder = 1;
    racine.add(ombre);

    let bassin = null;
    corps.traverse((o) => { const h = o.userData?.hauteur_bassin; if (bassin == null && h != null && Number.isFinite(Number(h))) bassin = Number(h); });
    const partagees = src === 'eric' || src === 'eric_hockey' ? anims : adapterClips(anims, bassin ? bassin / BASSIN_ERIC : 1);
    const mixer = new THREE.AnimationMixer(corps);
    const actions = {};
    const bibliotheque = clipsPropres.length && role === 'chienne' ? [...clipsPropres] : [...clipsPropres, ...partagees];
    for (const clip of bibliotheque) {
      const nom = clip.name;
      if (!actions[nom]) actions[nom] = mixer.clipAction(clip);
    }
    for (const [cle, alias] of Object.entries(ALIAS)) {
      if (!actions[cle]) for (const a of alias) if (actions[a]) { actions[cle] = actions[a]; break; }
    }
    if (!actions.walk && bibliotheque[0]) actions.walk = mixer.clipAction(bibliotheque[0]);

    const tete = trouverOs(corps, [/^head$/i, /mixamorig:?head$/i, /^tete/i, /head(?!top|_end|end)/i]);
    const cou = trouverOs(corps, [/neck/i, /cou/i]);
    const machoire = trouverOs(corps, [/jaw/i, /machoire/i, /mandib/i]);
    const mainDroite = trouverOs(corps, [/main_baton/i, /hand[._]?r$/i, /righthand$/i, /r[._]?hand$/i, /hand_r/i, /wrist[._]?r/i]);
    const repereBaton = (() => { let r = null; corps.traverse((o) => { if (/main_baton/i.test(o.name)) r = o; }); return r; })();

    const perso = {
      role, source: src, repli: src !== role, decalagePatins, racine, corps, mixer, actions, tete, cou, machoire, mainDroite: repereBaton || mainDroite, morphs, ombre,
      courant: null, regardCible: null, regardPoids: 0, bouche: 0, parle: false,
      prochainClignement: 1 + Math.random() * 3, clignement: 0,
      vitesseNominale: { walk: 1.4, run: 4.5, skate: 5.5, walk_fast: 1.9 },
      jouer(nom, { fondu = 0.25, boucle = true, vitesse = 1, forcer = false } = {}) {
        let a = actions[nom] || (nom === 'walk_fast' ? actions.walk : null) || (/^skate/.test(nom) ? actions.walk : null) || actions.idle || actions.walk;
        if (!a) return null;
        if (this.courant === a && !forcer) { a.timeScale = vitesse; return a; }
        a.reset();
        a.setLoop(boucle ? THREE.LoopRepeat : THREE.LoopOnce, boucle ? Infinity : 1);
        a.clampWhenFinished = !boucle;
        a.timeScale = vitesse;
        a.enabled = true;
        a.setEffectiveWeight(1);
        if (this.courant && this.courant !== a) a.crossFadeFrom(this.courant, fondu, true);
        a.play();
        this.courant = a;
        this.nomCourant = nom;
        return a;
      },
      possede(nom) { return !!actions[nom]; },
      duree(nom) { return actions[nom]?.getClip().duration || 1; },
      regarder(cible, poids = 1) { this.regardCible = cible; this.regardPoidsCible = cible ? poids : 0; },
      morph(nom, v) {
        for (const m of morphs) {
          const i = m.morphTargetDictionary[nom];
          if (i !== undefined) m.morphTargetInfluences[i] = v;
        }
      },
    };
    perso.jouer('idle', { fondu: 0 });
    tous.push(perso);
    return perso;
  }

  const qTmp = new THREE.Quaternion(), qMonde = new THREE.Quaternion(), vTmp = new THREE.Vector3(), vTete = new THREE.Vector3();
  const mTmp = new THREE.Matrix4();
  function mettreAJour(dt, camera) {
    for (const p of tous) {
      if (!p.racine.parent) continue;
      p.mixer.update(dt);
      // regard : rotation additive de la tête vers la cible, bornée
      p.regardPoids += ((p.regardPoidsCible || 0) - p.regardPoids) * Math.min(1, dt * 4);
      if (p.tete && p.regardPoids > 0.01 && p.regardCible) {
        p.tete.updateWorldMatrix(true, false);
        p.tete.getWorldPosition(vTete);
        vTmp.copy(p.regardCible).sub(vTete);
        const racineInv = qMonde.copy(p.racine.getWorldQuaternion(new THREE.Quaternion())).invert();
        vTmp.applyQuaternion(racineInv);
        let lacet = Math.atan2(vTmp.x, vTmp.z);
        let tangage = Math.atan2(-vTmp.y, Math.hypot(vTmp.x, vTmp.z));
        lacet = THREE.MathUtils.clamp(lacet, -1.1, 1.1) * p.regardPoids;
        tangage = THREE.MathUtils.clamp(tangage, -0.5, 0.45) * p.regardPoids;
        const parent = p.tete.parent;
        parent.updateWorldMatrix(true, false);
        const qParent = parent.getWorldQuaternion(new THREE.Quaternion());
        const qRac = p.racine.getWorldQuaternion(new THREE.Quaternion());
        const qVoulu = new THREE.Quaternion().setFromEuler(new THREE.Euler(tangage, lacet, 0, 'YXZ'));
        const qMondeActuel = qParent.clone().multiply(p.tete.quaternion);
        const qCibleMonde = qRac.clone().multiply(qVoulu).multiply(qRac.clone().invert().multiply(qMondeActuel));
        const qLocal = qParent.clone().invert().multiply(qCibleMonde);
        p.tete.quaternion.slerp(qLocal, 0.85);
      }
      // clignement
      p.prochainClignement -= dt;
      if (p.prochainClignement <= 0) { p.clignement = 0.16; p.prochainClignement = 2 + Math.random() * 4.5; }
      if (p.clignement > 0) {
        p.clignement -= dt;
        const t = 1 - Math.abs(p.clignement - 0.08) / 0.08;
        p.morph('clignement', Math.max(0, t));
      }
      // bouche (synchronisée sur la voix)
      if (p.morphs.length) {
        const cible = p.parle ? (audio?.amplitudeVoix?.(p) ?? 0) : 0;
        p.bouche += (cible - p.bouche) * Math.min(1, dt * 18);
        p.morph('bouche', THREE.MathUtils.clamp(p.bouche * 1.6, 0, 1));
      } else if (p.machoire) {
        const cible = p.parle ? (audio?.amplitudeVoix?.(p) ?? 0) : 0;
        p.bouche += (cible - p.bouche) * Math.min(1, dt * 18);
        p.machoire.rotateX(THREE.MathUtils.clamp(p.bouche, 0, 1) * 0.22);
      } else if (p.parle && p.tete) {
        const amp = audio?.amplitudeVoix?.(p) ?? 0;
        p.tete.rotateX(-amp * 0.05);
      }
    }
  }

  function retirer(perso) {
    perso.racine.parent?.remove(perso.racine);
    const i = tous.indexOf(perso);
    if (i >= 0) tous.splice(i, 1);
  }

  return { creer, mettreAJour, retirer, animations, tous, existe, source, chargerGLB };
}

function texturerOmbre() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  gr.addColorStop(0, 'rgba(255,255,255,0.85)');
  gr.addColorStop(0.45, 'rgba(255,255,255,0.45)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function mannequin(couleur = 0x6d7c86) {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.7 });
  const corps = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.95, 6, 12), m);
  corps.position.y = 1.0;
  const tete = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd9b59a, roughness: 0.6 }));
  tete.position.y = 1.66;
  g.add(corps, tete);
  return g;
}
