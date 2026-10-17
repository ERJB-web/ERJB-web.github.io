import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=2a9aa6f76b';

const FILTRE_CAM = groupes(0xffff, GROUPES.STATIQUE | GROUPES.PORTE);
const COULEURS = {
  eric: '#7FB8FF', direction_a: '#E07A72', direction_b: '#E39C6B', collegue_doc: '#7FE0A8',
  prof_seminaire: '#C9D9E3', bibliothecaire: '#B9A6F2', intervenante_sad: '#6FD3CF', gestionnaire_clsc: '#9FC3E6',
  prepose_accueil: '#D7DEE3', entraineur_patin: '#9BE36B', jury_1: '#E8D9A8', jury_2: '#E8C6A8', jury_3: '#D8E8A8',
};

export function creerDialogues({ bus, audio, camera, physique, options }) {
  let donnees = { personnages: {}, scenes: {}, repliques: {} };
  let durees = {};
  let enCours = null;
  let passer = null;
  let joueur = null, gestionPnj = null;

  function charger(d, voix) {
    donnees = { personnages: {}, scenes: {}, repliques: {}, ...(d || {}) };
    durees = voix || {};
  }

  const nomsSupplementaires = {};
  function nomDe(qui) {
    return donnees.personnages?.[qui]?.nom || nomsSupplementaires[qui] || (qui === 'eric' ? 'Éric' : qui);
  }

  function acteur(qui, acteursForces) {
    if (acteursForces?.[qui]) return acteursForces[qui];
    if (qui === 'eric') return joueur ? { perso: joueur.perso, position: joueur.position, estJoueur: true } : null;
    const p = gestionPnj?.trouver(qui) || gestionPnj?.liste.find((x) => x.role === qui);
    return p && !p.cache ? { perso: p.perso, position: p.position, pnj: p } : null;
  }

  function teteDe(a) {
    const v = new THREE.Vector3();
    if (a?.perso?.tete) { a.perso.tete.getWorldPosition(v); return v; }
    if (a?.position) return a.position.clone().setY(a.position.y + 1.62);
    return null;
  }

  function dureeEstimee(ligne) {
    const mots = (ligne.texte || '').split(/\s+/).filter(Boolean).length;
    return Math.max(1.5, mots * 0.36 + 0.5);
  }

  const vTmp = new THREE.Vector3();
  function cadrer(plan, a, b) {
    const s = teteDe(a);
    if (!s) return;
    const l = b ? teteDe(b) : null;
    const axe = l ? l.clone().sub(s).setY(0) : new THREE.Vector3(Math.sin(a.perso.racine.rotation.y), 0, Math.cos(a.perso.racine.rotation.y));
    if (axe.lengthSq() < 1e-4) axe.set(0, 0, 1);
    axe.normalize();
    const cote = new THREE.Vector3(-axe.z, 0, axe.x);
    let pos, cible, fov;
    const choix = plan || 'rapproche';
    if (choix === 'large' && l) {
      const m = s.clone().add(l).multiplyScalar(0.5);
      pos = m.clone().addScaledVector(cote, 3.4).setY(m.y + 0.15);
      cible = m.clone().setY(m.y - 0.15);
      fov = 42;
    } else if (choix === 'epaule' && l) {
      pos = l.clone().addScaledVector(axe, -0.75).addScaledVector(cote, 0.42).setY(l.y + 0.06);
      cible = s.clone().setY(s.y - 0.06);
      fov = 34;
    } else if (choix === 'gros_plan') {
      pos = s.clone().addScaledVector(axe, 0.75).addScaledVector(cote, 0.22).setY(s.y - 0.02);
      cible = s.clone().setY(s.y - 0.03);
      fov = 27;
    } else {
      pos = s.clone().addScaledVector(axe, 1.35).addScaledVector(cote, 0.45).setY(s.y - 0.04);
      cible = s.clone().setY(s.y - 0.1);
      fov = 33;
    }
    // ne pas traverser les murs
    const dir = vTmp.subVectors(pos, cible);
    const dist = dir.length();
    dir.normalize();
    const hit = physique.lancerRayon(cible, dir, dist, FILTRE_CAM);
    if (hit && hit.distance < dist) pos = cible.clone().addScaledVector(dir, Math.max(0.35, hit.distance - 0.15));
    camera.plan(pos, cible, { fov, lissage: 6, coupe: true });
    bus.emit('camera:focus', { distance: pos.distanceTo(s), actif: true });
  }

  async function dire(ligne, acteurs, interlocuteur) {
    const a = acteur(ligne.qui, acteurs);
    const b = interlocuteur;
    if (options.cinematique !== false) cadrer(ligne.plan, a, b);
    if (a?.perso) {
      a.perso.parle = true;
      if (b) a.perso.regarder(teteDe(b), 1);
      if (a.pnj) a.pnj.parleMaintenant = true;
      if (!a.pnj?.assis && !(a.estJoueur && joueur?.mode === 'assis')) {
        const anim = ligne.anim && a.perso.possede(ligne.anim) ? ligne.anim : (a.perso.possede('talk') ? 'talk' : null);
        if (anim) a.perso.jouer(anim, { fondu: 0.3 });
      }
    }
    if (b?.perso) b.perso.regarder(teteDe(a), 1);
    const duree = durees[ligne.id]?.duree || dureeEstimee(ligne);
    bus.emit('sousTitre', { qui: ligne.qui, nom: nomDe(ligne.qui), texte: ligne.texte, duree, couleur: COULEURS[ligne.qui] || '#E6EEF2', emotion: ligne.emotion });
    const voix = ligne.son
      ? audio.jouer3d(ligne.son, a?.position ? a.position.clone().setY(a.position.y + 0.5) : null, { volume: 0.9 }).then(() => null)
      : audio.jouerVoix(ligne.id, { perso: a?.perso || null });
    await new Promise((ok) => {
      let fini = false, minuterie = null;
      const secours = setTimeout(() => finir(), (duree + 1.5) * 1000);
      const finir = () => { if (fini) return; fini = true; clearTimeout(minuterie); clearTimeout(secours); passer = null; ok(); };
      passer = () => { audio.arreterVoix(); finir(); };
      voix.then((r) => {
        if (r) minuterie = setTimeout(finir, 220);
        else minuterie = setTimeout(finir, (duree + 0.3) * 1000);
      });
    });
    passer = null;
    if (a?.perso) {
      a.perso.parle = false;
      if (a.pnj) a.pnj.parleMaintenant = false;
    }
  }

  async function jouerScene(id, { acteurs = null } = {}) {
    const scene = typeof id === 'string' ? donnees.scenes?.[id] : id;
    if (!scene || !scene.lignes?.length) return { choix: null };
    enCours = { id, scene };
    bus.emit('dialogue:debut', { id });
    const quiParle = [...new Set(scene.lignes.map((l) => l.qui))];
    const autres = quiParle.filter((q) => q !== 'eric');
    for (const q of autres) {
      const a = acteur(q, acteurs);
      if (a?.pnj && !a.pnj.assis && joueur) {
        a.pnj.comportementAvant = a.pnj.comportement;
        a.pnj.comportement = 'statique';
        a.pnj.chemin = null;
        const d = joueur.position.clone().sub(a.pnj.position);
        a.pnj.lacet = Math.atan2(d.x, d.z);
      }
    }
    if (joueur && autres.length && joueur.mode !== 'assis') {
      const a = acteur(autres[0], acteurs);
      if (a?.position) { const d = a.position.clone().sub(joueur.position); joueur.lacet = Math.atan2(d.x, d.z); }
    }
    for (let i = 0; i < scene.lignes.length; i++) {
      const ligne = scene.lignes[i];
      const interlocuteurId = ligne.a || (ligne.qui === 'eric' ? autres[0] : 'eric');
      await dire(ligne, acteurs, interlocuteurId ? acteur(interlocuteurId, acteurs) : null);
    }
    bus.emit('sousTitre', null);
    bus.emit('camera:focus', { actif: false });
    let choix = null;
    if (scene.choix?.length) {
      bus.emit('dialogue:choix', { options: scene.choix.map((c) => c.texte), question: scene.question || null });
      const r = await bus.attendre('dialogue:reponse');
      choix = { index: r.index, option: scene.choix[r.index] };
      const o = choix.option;
      const texte = o && o.muet !== true ? (o.dit || o.texte) : null;
      if (texte) {
        const base = typeof id === 'string' ? id : (scene.id || 'scene');
        const ligne = { id: o.id || `${base}_choix_${r.index + 1}`, qui: o.qui || 'eric', texte, emotion: o.emotion, anim: o.anim, plan: o.plan || 'rapproche' };
        const vers = ligne.qui === 'eric' ? (autres[0] ? acteur(autres[0], acteurs) : null) : acteur('eric', acteurs);
        await dire(ligne, acteurs, vers);
        bus.emit('sousTitre', null);
        bus.emit('camera:focus', { actif: false });
      }
    }
    for (const q of quiParle) {
      const a = acteur(q, acteurs);
      a?.perso?.regarder(null, 0);
    }
    enCours = null;
    bus.emit('dialogue:fin', { id, choix });
    return { choix };
  }

  async function replique(r, { pnj = null, position = null } = {}) {
    if (!r) return;
    bus.emit('replique:debut', { id: r.id, qui: r.qui });
    const perso = pnj?.perso || null;
    if (perso) perso.parle = true;
    const duree = durees[r.id]?.duree || dureeEstimee(r);
    bus.emit('replique', { qui: r.qui, nom: nomDe(r.qui), texte: r.texte, duree, couleur: COULEURS[r.qui] || '#E6EEF2' });
    if (!enCours) bus.emit('sousTitre', { qui: r.qui, nom: nomDe(r.qui), texte: r.texte, duree, couleur: COULEURS[r.qui] || '#E6EEF2', discret: true });
    if (r.son) { audio.jouer3d(r.son, position || pnj?.position || null, { volume: 0.9 }); await new Promise((res) => setTimeout(res, duree * 1000)); if (perso) perso.parle = false; if (!enCours) bus.emit('sousTitre', null); return; }
    const ok = await Promise.race([audio.jouerVoix(r.id, { perso, position }), new Promise((res) => setTimeout(() => res('delai'), (duree + 1.5) * 1000))]);
    if (!ok) await new Promise((res) => setTimeout(res, duree * 1000));
    if (perso) perso.parle = false;
    if (!enCours) bus.emit('sousTitre', null);
  }

  function repliques(categorie) {
    return donnees.repliques?.[categorie] || [];
  }

  const dernieres = new Map();
  const canaux = new Map();
  function repliqueAuHasard(categorie, contexte = {}) {
    let l = repliques(categorie);
    if (!l.length) return null;
    const maintenant = performance.now();
    if (contexte.canal) {
      const occupe = canaux.get(contexte.canal);
      if (occupe && occupe.fin > maintenant && (contexte.priorite ?? 0) <= occupe.priorite) return null;
    }
    const role = contexte.pnj?.role;
    if (typeof contexte.filtre === 'function') {
      l = l.filter(contexte.filtre);
      if (!l.length) return null;
    }
    if (Array.isArray(contexte.roles) && contexte.roles.length) {
      const permis = l.filter((r) => contexte.roles.includes(r.qui));
      if (permis.length) l = permis;
      else if (contexte.rolesStricts) return null;
    }
    if (role) {
      const alias = [role, ...(contexte.pnj.alias || [])];
      const propres = l.filter((r) => alias.includes(r.qui));
      if (propres.length) l = propres;
      else if (/^(pnj_|bouscule_)/.test(categorie) || contexte.rolesStricts) return null;
    }
    if (typeof contexte.palier === 'number') {
      const p = l.filter((r) => (r.palier ?? 1) === contexte.palier);
      if (p.length) l = p;
    }
    const vues = dernieres.get(categorie) || [];
    const neuves = l.filter((r) => !vues.includes(r.id));
    const choix = (neuves.length ? neuves : l);
    const r = choix[Math.floor(Math.random() * choix.length)];
    vues.push(r.id);
    if (vues.length > Math.min(8, Math.floor(l.length * 0.7))) vues.shift();
    dernieres.set(categorie, vues);
    if (!contexte.pnj && r.qui && r.qui !== 'eric') {
      const p = gestionPnj?.trouver(r.qui) || gestionPnj?.liste.find((x) => x.role === r.qui);
      if (p && !p.cache) { contexte = { ...contexte, pnj: p, position: p.position.clone().setY(p.position.y + 1.6) }; }
    }
    if (r.qui === 'eric' && joueur && !contexte.pnj) contexte = { ...contexte, pnj: { perso: joueur.perso }, position: joueur.tete() };
    if (contexte.canal) canaux.set(contexte.canal, { fin: maintenant + ((durees[r.id]?.duree || dureeEstimee(r)) + 0.4) * 1000, priorite: contexte.priorite ?? 0 });
    replique(r, contexte);
    return r;
  }

  function situation(cles, contexte = {}) {
    for (const c of [].concat(cles)) {
      if (!c || !repliques(c).length) continue;
      const r = repliqueAuHasard(c, contexte);
      if (r) return r;
      if (contexte.canal) return null;
    }
    return null;
  }

  bus.on('dialogue:passer', () => passer?.());

  return {
    charger, jouerScene, replique, repliques, repliqueAuHasard, situation, nomDe,
    definirNoms(n) { Object.assign(nomsSupplementaires, n || {}); },
    passer() { passer?.(); },
    get actif() { return !!enCours; },
    lier(j, g) { joueur = j; gestionPnj = g; },
    scene(id) { return donnees.scenes?.[id]; },
    get donnees() { return donnees; },
  };
}
