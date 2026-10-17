import * as THREE from 'three';
import { COULEURS_EQUIPES, CONFIGS } from './equipes.js?v=8efd015962';

const POSTES = ['C', 'AG', 'AD', 'DG', 'DD'];
const COTE_POSTE = { C: 0, AG: -1, AD: 1, DG: -1, DD: 1 };
const H_RONDELLE = 0.0127;
const NOMS_FAUTES = { accrochage: 'accrochage', trebucher: 'avoir fait trébucher' };
const ROLES_ANNONCEUR = ['imitateur', 'imitateur_de_gaulle', 'annonceur', 'annonceur_bell'];
const ROLES_ARBITRES = ['arbitre_1', 'arbitre_2', 'arbitre'];
const ROLES_ENTRAINEUR = ['entraineur', 'entraineur_patin'];
const nomPeriode = (n, total) => (n > total ? 'Prol.' : n === 1 ? '1re' : `${n}e`);
const alea = (a, b) => a + Math.random() * (b - a);
const borne = THREE.MathUtils.clamp;

export function creerMatch({ bus, jeu, hockey, gestionPnj, personnages, dialogues, audio, cam, foule }) {
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3(), HAUT = new THREE.Vector3(0, 1, 0);
  let G = null;
  let modeleBaton = null;
  const persoCivil = { eric: null, hockey: null };

  const ERIC = {
    id: 'eric', role: 'eric', estEric: true, equipe: 'carabins', poste: 'AD', numero: 15, prenom: 'Éric', nomComplet: 'Éric Bernier', talent: 0.7, banc: false, pnj: null, alias: [],
    get pos() { return jeu.joueur.position; },
    get vel() { return jeu.joueur.vitesse; },
  };

  const P = {
    actif: false, mode: null, etat: 'inactif', minuterie: 0, temps: 0,
    equipes: null, patineurs: [], arbitres: [], entraineur: null, annonceur: null, pnjs: [], masques: [], rondellesRangees: [],
    R: null, rp: new THREE.Vector3(), rv: new THREE.Vector3(), ru: 0, rvv: 0, ruPrec: 0,
    porteurAI: null, passe: null, tir: null, touches: [], dernier: null, idMouvement: 0, demande: 0,
    params: {}, periode: 1, chrono: 0, prolongation: false, dureePenalite: 30, miseAuJeu: null,
    stats: null, regles: { horsJeu: true, penalites: true }, resoudre: null, accHud: 0, accDecision: 0,
    compte: {},
  };
  const compter = (k) => { P.compte[k] = (P.compte[k] || 0) + 1; };

  // ---------- géométrie de la patinoire (repère local : u le long des filets, v en travers) ----------
  function geometrie(zone) {
    const b = zone.glaceBoite;
    const centre = b.getCenter(new THREE.Vector3());
    const filets = Object.entries(zone.filets || {});
    const fe = filets.find(([n]) => /_est$/i.test(n)), fo = filets.find(([n]) => /_ouest$/i.test(n));
    const pe = fe ? fe[1].getWorldPosition(new THREE.Vector3()) : centre.clone().add(new THREE.Vector3(27, 0, 0));
    const po = fo ? fo[1].getWorldPosition(new THREE.Vector3()) : centre.clone().add(new THREE.Vector3(-27, 0, 0));
    const axe = pe.clone().sub(po).setY(0).normalize();
    const lat = new THREE.Vector3(-axe.z, 0, axe.x);
    const t = b.getSize(new THREE.Vector3());
    const L = (Math.abs(t.x * axe.x) + Math.abs(t.z * axe.z)) / 2;
    const W = (Math.abs(t.x * lat.x) + Math.abs(t.z * lat.z)) / 2;
    const c = pe.clone().add(po).multiplyScalar(0.5);
    centre.x = c.x; centre.z = c.z; centre.y = b.max.y;
    const butX = pe.clone().sub(centre).dot(axe);
    return { centre, axe, lat, L, W, R: Math.min(8.5, W * 0.66), butX, bleue: L * 0.25, y: b.max.y };
  }
  function monde(u, v, out = new THREE.Vector3()) { return out.copy(G.centre).addScaledVector(G.axe, u).addScaledVector(G.lat, v); }
  function localU(p) { return v1.copy(p).sub(G.centre).dot(G.axe); }
  function localV(p) { return v1.copy(p).sub(G.centre).dot(G.lat); }
  function borner(u, v, marge = 0.9) {
    const Lm = G.L - marge, Wm = G.W - marge, R = Math.max(0.5, G.R - marge);
    u = borne(u, -Lm, Lm); v = borne(v, -Wm, Wm);
    const cu = Lm - R, cv = Wm - R;
    if (Math.abs(u) > cu && Math.abs(v) > cv) {
      const du = Math.abs(u) - cu, dv = Math.abs(v) - cv, d = Math.hypot(du, dv);
      if (d > R) { u = Math.sign(u) * (cu + du * R / d); v = Math.sign(v) * (cv + dv * R / d); }
    }
    // derrière et dans les filets : on contourne la cage
    if (Math.abs(u) > G.butX - 0.35 && Math.abs(u) < G.butX + 1.3 && Math.abs(v) < 1.25) v = Math.sign(v || 1) * 1.25;
    return [u, v];
  }
  // repère d'équipe : u vers le filet adverse, v positif à droite
  function pointEquipe(E, ut, vt, out = new THREE.Vector3()) {
    const [u, v] = borner(ut * E.sens, vt * E.sens);
    return monde(u, v, out);
  }
  const uEquipe = (E, p) => localU(p) * E.sens;
  const vEquipe = (E, p) => localV(p) * E.sens;
  const autre = (id) => (id === 'carabins' ? 'visiteurs' : 'carabins');
  const filetAdverse = (E, out = new THREE.Vector3()) => monde(G.butX * E.sens, 0, out);
  const filetPropre = (E, out = new THREE.Vector3()) => monde(-G.butX * E.sens, 0, out);

  function avantDe(s, out = new THREE.Vector3()) {
    if (s.estEric) return out.copy(jeu.joueur.avant());
    return out.set(Math.sin(s.lacet), 0, Math.cos(s.lacet));
  }
  function lameDe(s, out = new THREE.Vector3()) {
    if (s.estEric) return out.copy(hockey.lame);
    avantDe(s, out);
    const balai = s === P.porteurAI ? Math.sin(P.temps * 7 + s.phase) * 0.14 : 0;
    return out.set(s.pos.x + out.x * 0.74 + out.z * balai, G.y + H_RONDELLE, s.pos.z + out.z * 0.74 - out.x * balai);
  }
  const enJeu = (s) => !s.banc && !s.auBanc && !s.horsJeuExercice;
  const surGlace = () => P.patineurs.filter(enJeu);
  const porteur = () => (hockey.porteur === 'eric' ? ERIC : P.porteurAI);

  // ---------- répliques ----------
  function roles(E) {
    if (!E) return [];
    const g = E.gardien?.patineur;
    return [...E.tous.flatMap((s) => [s.role, ...(s.alias || [])]), ...(g ? [g.role, ...(g.alias || [])] : [])];
  }
  function dire(cles, contexte = {}) {
    if (!dialogues) return null;
    const table = P.config?.cles;
    const liste = [].concat(cles).map((k) => (table && k in table ? table[k] : k)).filter(Boolean);
    if (!liste.length) return null;
    return dialogues.situation(liste, { canal: 'glace', ...contexte });
  }
  function annoncerBut(buteur) {
    if (!buteur) return null;
    const ids = [buteur.role, ...(buteur.alias || [])];
    return dialogues?.situation(['match_annonce_but_joueur'], { canal: 'annonce', priorite: 2, pnj: P.annonceur || null, position: null, filtre: (r) => ids.includes(r.joueur) });
  }
  function annoncer(cles, palier, priorite = 1) {
    const pnj = P.annonceur;
    return dire(cles, { canal: 'annonce', priorite, roles: ROLES_ANNONCEUR, pnj: pnj || null, position: null, palier });
  }
  function arbitreDit(cles, priorite = 1) {
    const ref = P.arbitres[0]?.pnj || null;
    return dire(cles, { canal: 'arbitre', priorite, roles: ROLES_ARBITRES, pnj: ref, position: ref ? ref.position.clone().setY(ref.position.y + 1.7) : null });
  }
  function entraineurDit(cles, priorite = 1) {
    const c = P.entraineur;
    return dire(cles, { canal: 'banc', priorite, roles: ROLES_ENTRAINEUR, pnj: c || null, position: c ? c.position.clone().setY(c.position.y + 1.7) : null });
  }
  function equipeDit(E, cles, priorite = 0, qui = null) {
    const pnj = qui?.pnj || null;
    return dire(cles, { canal: E.id === 'carabins' ? 'glace' : 'adverse', priorite, roles: roles(E), rolesStricts: !!pnj, pnj, position: pnj ? pnj.position.clone().setY(pnj.position.y + 1.7) : null });
  }
  function ericDit(cles, priorite = 1) {
    return dire(cles, { canal: 'eric', priorite, roles: ['eric'] });
  }
  function fouleDit(cles) {
    return dire(cles, { canal: 'foule', priorite: 0, roles: ['foule', 'supporters', 'supporter'], position: null });
  }
  async function scene(id) {
    if (!id || !dialogues?.scene?.(id) || !jeu.scene) return;
    const avant = P.etat;
    P.etat = 'scene';
    try { await jeu.scene(id); } catch (e) { console.error('[scene]', id, e); }
    if (P.etat === 'scene') P.etat = avant;
  }

  // ---------- personnages ----------
  async function baton() {
    if (modeleBaton === null) {
      modeleBaton = await personnages.chargerGLB('personnages/baton.glb').then((g) => g.scene).catch(() => false);
    }
    return modeleBaton || null;
  }
  async function attacherBaton(pnj) {
    const m = await baton();
    if (!m || !pnj?.perso) return;
    let ancre = null;
    pnj.perso.corps.traverse((o) => { if (!ancre && /main_baton/i.test(o.name)) ancre = o; });
    if (!ancre || ancre.userData.baton) return;
    const b = m.clone(true);
    b.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    ancre.add(b);
    ancre.userData.baton = b;
  }

  function quaternionPour(lacet) {
    return new THREE.Quaternion().setFromAxisAngle(HAUT, lacet - Math.PI);
  }

  async function ajouterPnj(fiche, equipe, position, lacet, anim = 'skate_idle', couleursImposees = null) {
    const noms = dialogues?.donnees?.personnages || {};
    const nom = noms[fiche.role]?.nom || fiche.prenom || fiche.role;
    const couleurs = couleursImposees || P.config?.equipes?.[equipe]?.couleurs || COULEURS_EQUIPES[equipe] || null;
    const pnj = await gestionPnj.ajouter({ role: fiche.role, id: fiche.role, position, quaternion: quaternionPour(lacet), anim, nom, couleurs, alias: fiche.alias || [] });
    pnj.muet = true;
    pnj.match = true;
    P.pnjs.push(pnj);
    return pnj;
  }

  function extrasModele(pnj) {
    let x = null;
    if (pnj?.perso?.source === pnj?.role) pnj.perso.corps.traverse((o) => { if (!x && o.userData && (o.userData.numero != null || o.userData.nom_dos != null)) x = o.userData; });
    return x || {};
  }

  function creerPatineur(fiche, equipe, pnj, poste) {
    const noms = dialogues?.donnees?.personnages || {};
    const p = noms[fiche.role] || {};
    const x = extrasModele(pnj);
    const numero = Number(x.numero ?? p.numero ?? fiche.numero);
    return {
      id: fiche.role, role: fiche.role, alias: fiche.alias || [], pnj, equipe, poste: poste || fiche.poste, numero, nomDos: x.nom_dos || x.nom || fiche.nomDos || '', prenom: p.court || (p.nom ? p.nom.split(' ')[0] : fiche.prenom),
      pos: pnj.position, vel: new THREE.Vector3(), lacet: pnj.lacet, cible: pnj.position.clone(), vmax: 7, talent: alea(0.52, 0.78),
      decision: Math.random() * 0.3, poke: 0, mise: 0, chute: 0, recup: 0, anim: null, animT: 0, phase: Math.random() * 6, banc: false, essai: -1, recul: false, regardRondelle: true,
    };
  }

  function cacher(p) {
    if (p.cache) return;
    p.cache = true;
    p.muetAvant = p.muet;
    p.muet = true;
    p.comportementAvant = p.comportement;
    p.comportement = 'cache';
    p.perso.racine.visible = false;
    p.position.y -= 100;
    const t = p.corps.translation();
    p.corps.setTranslation({ x: t.x, y: t.y - 100, z: t.z }, true);
    P.masques.push(p);
  }
  function montrer(p) {
    if (!p.cache) return;
    p.cache = false;
    p.muet = p.muetAvant;
    p.comportement = p.comportementAvant === 'hockey' ? 'statique' : (p.comportementAvant || 'statique');
    p.perso.racine.visible = true;
    p.position.y += 100;
    const t = p.corps.translation();
    p.corps.setTranslation({ x: t.x, y: t.y + 100, z: t.z }, true);
  }

  function rangerRondelles() {
    const toutes = hockey.rondelles();
    P.R = toutes[0] || null;
    P.rondellesRangees = [];
    for (const d of toutes.slice(1)) {
      const t = d.corps.translation();
      P.rondellesRangees.push({ d, t: { x: t.x, y: t.y, z: t.z } });
      d.horsJeu = true;
      d.objet.visible = false;
      try { d.corps.setEnabled(false); } catch { d.corps.setTranslation({ x: t.x, y: -60, z: t.z }, true); }
    }
    if (P.R) { P.R.horsJeu = false; P.R.objet.visible = true; try { P.R.corps.setEnabled(true); } catch { /* déjà actif */ } }
  }
  function sortirRondelles() {
    for (const { d, t } of P.rondellesRangees) {
      d.horsJeu = false;
      d.objet.visible = true;
      try { d.corps.setEnabled(true); } catch { /* ancien moteur */ }
      d.corps.setTranslation(t, true);
      d.corps.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
    P.rondellesRangees = [];
    if (P.R) P.R.horsJeu = false;
  }

  function placerRondelle(p, { vitesse = null } = {}) {
    if (!P.R) return;
    P.R.corps.setTranslation({ x: p.x, y: G.y + 0.03, z: p.z }, true);
    P.R.corps.setLinvel(vitesse ? { x: vitesse.x, y: 0, z: vitesse.z } : { x: 0, y: 0, z: 0 }, true);
    P.R.corps.setAngvel({ x: 0, y: 0, z: 0 }, true);
    P.idMouvement++;
  }

  async function equiperEric(enHockey) {
    const j = jeu.joueur;
    if (!j) return;
    if (enHockey) {
      if (!(await personnages.existe('eric_hockey'))) return;
      if (!persoCivil.hockey) persoCivil.hockey = await personnages.creer('eric_hockey');
      if (persoCivil.hockey.source !== 'eric_hockey') return;
      if (j.perso !== persoCivil.hockey) persoCivil.eric = j.changerPerso(persoCivil.hockey);
      hockey.retirerBaton();
      await attacherBatonPerso(persoCivil.hockey);
    } else if (persoCivil.eric && j.perso !== persoCivil.eric) {
      j.changerPerso(persoCivil.eric);
      hockey.retirerBaton();
    }
  }
  async function attacherBatonPerso(perso) {
    const m = await baton();
    if (!m) return;
    let ancre = null;
    perso.corps.traverse((o) => { if (!ancre && /main_baton/i.test(o.name)) ancre = o; });
    if (!ancre || ancre.userData.baton) return;
    const b = m.clone(true);
    b.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    ancre.add(b);
    ancre.userData.baton = b;
    perso.batonPropre = b;
  }

  // ---------- déplacement des patineurs pilotés ----------
  function piloter(s, dt) {
    if (s.chute > 0) {
      s.chute -= dt;
      s.vel.multiplyScalar(Math.max(0, 1 - dt * 2.2));
      if (s.chute <= 0) jouerAnim(s, 'skate_idle');
    } else {
      const d = v2.copy(s.cible).sub(s.pos).setY(0);
      const dist = d.length();
      const voulu = dist > 0.15 ? d.multiplyScalar(Math.min(s.vmax, dist * 1.9 + 0.4) / dist) : d.set(0, 0, 0);
      // écart avec les autres patineurs
      for (const o of P.patineurs) {
        if (o === s || o.banc || o.auBanc) continue;
        const e = v3.copy(s.pos).sub(o.pos).setY(0);
        const l = e.length();
        if (l < 1.25 && l > 1e-3) voulu.addScaledVector(e, (1.25 - l) * 4.5 / l);
      }
      for (const a of P.arbitres) {
        if (a === s) continue;
        const e = v3.copy(s.pos).sub(a.pos).setY(0);
        const l = e.length();
        if (l < 1.3 && l > 1e-3) voulu.addScaledVector(e, (1.3 - l) * 4 / l);
      }
      const dv = voulu.sub(s.vel);
      const freine = dv.dot(s.vel) < 0;
      const amax = (freine ? 9 : 5.2 + s.talent * 3) * dt;
      if (dv.length() > amax) dv.setLength(amax);
      s.vel.add(dv);
    }
    s.pos.addScaledVector(s.vel, dt);
    const [u, v] = borner(localU(s.pos), localV(s.pos), 0.75);
    monde(u, v, s.pos);
    s.pos.y = G.y;
    const vit = Math.hypot(s.vel.x, s.vel.z);
    // orientation : vers la rondelle quand on recule, sinon dans le sens de la glisse
    let lacetVoulu = s.lacet;
    s.recul = false;
    if (s.regardRondelle && !(s === P.porteurAI)) {
      const vr = v3.copy(P.rp).sub(s.pos).setY(0);
      if (vr.lengthSq() > 0.5) {
        const aR = Math.atan2(vr.x, vr.z);
        if (vit < 1.2 || (vit > 0.8 && (s.vel.x * vr.x + s.vel.z * vr.z) < -0.5 * vit * vr.length())) { lacetVoulu = aR; s.recul = vit > 0.8; }
        else lacetVoulu = Math.atan2(s.vel.x, s.vel.z);
      }
    } else if (vit > 0.4) lacetVoulu = Math.atan2(s.vel.x, s.vel.z);
    let dl = lacetVoulu - s.lacet; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
    s.lacet += dl * Math.min(1, dt * 7);
    if (s.pnj) {
      s.pnj.lacet = s.lacet;
      const t = s.pnj.corps.translation();
      s.pnj.corps.setNextKinematicTranslation({ x: s.pos.x, y: t.y, z: s.pos.z });
    }
    animer(s, dt, vit);
  }

  function jouerAnim(s, nom, duree = 0) {
    if (!s.pnj) return;
    const p = s.pnj.perso;
    if (duree > 0) {
      if (!p.possede(nom)) return;
      s.anim = nom;
      s.animT = duree;
      p.jouer(nom, { boucle: false, fondu: 0.1, forcer: true });
    } else p.jouer(nom, { fondu: 0.25 });
  }
  function animer(s, dt, vit) {
    if (!s.pnj || s.chute > 0) return;
    if (s.anim) { s.animT -= dt; if (s.animT > 0) return; s.anim = null; }
    const p = s.pnj.perso;
    if (s === P.porteurAI && vit > 0.4) p.jouer('stickhandle', { vitesse: 0.7 + vit / 8 });
    else if (s.recul && p.possede('skate_back')) p.jouer('skate_back', { vitesse: 0.6 + vit / 5 });
    else if (vit > 1.1) p.jouer('skate', { vitesse: 0.55 + vit / 7 });
    else p.jouer('skate_idle', { fondu: 0.35 });
  }

  // ---------- rondelle : possession, passes, tirs ----------
  function toucher(s) {
    P.dernier = s;
    P.touches.push({ s, t: P.temps });
    if (P.touches.length > 8) P.touches.shift();
  }
  function prendre(s) {
    for (const x of P.patineurs) if (x !== s && x === P.porteurAI) P.porteurAI = null;
    if (hockey.porteur === 'eric') hockey.perdre();
    compter(P.passe && P.passe.vers === s ? 'passe_recue' : 'prise');
    P.porteurAI = s;
    hockey.porteur = s.id;
    hockey.possession = null;
    s.decision = 0.25 + Math.random() * 0.2;
    s.depuis = P.temps;
    toucher(s);
    const passe = P.passe;
    if (passe && passe.de !== s) {
      if (passe.de.equipe === s.equipe) {
        if (passe.de.estEric) { P.stats.passes++; bus.emit('hockey:passe_reussie', { vers: s.id }); if (Math.random() < 0.3) equipeDit(P.equipes.carabins, ['coequipier_bravo'], 0, s); }
        P.surPasse?.(passe.de, s, true);
      } else P.surPasse?.(passe.de, s, false);
    }
    P.passe = null;
    P.surPossession?.(s);
    return true;
  }
  function perdreAI(s) {
    if (P.porteurAI === s) compter('perte');
    if (P.porteurAI === s) P.porteurAI = null;
    if (hockey.porteur === s.id) hockey.porteur = null;
    s.recup = 0.35;
  }
  function relacher(s) {
    perdreAI(s);
    P.idMouvement++;
    s.recup = 0.5;
  }

  function porter(s) {
    const lame = lameDe(s, v2);
    const ec = lame.sub(P.rp);
    ec.y = 0;
    if (ec.length() > 1.35 || P.rp.y > G.y + 0.4) { compter(ec.length() > 1.35 ? 'perte_ecart' : 'perte_hauteur'); perdreAI(s); return; }
    P.R.corps.setLinvel({ x: s.vel.x + ec.x * 12, y: Math.min(0, P.rv.y), z: s.vel.z + ec.z * 12 }, true);
  }

  function essayerPrendre(s) {
    if (s.estEric || s.banc || s.chute > 0 || s.recup > 0 || P.R.horsJeu) return false;
    const lame = lameDe(s, v2);
    const d = Math.hypot(lame.x - P.rp.x, lame.z - P.rp.z);
    const destinataire = P.passe && P.passe.vers === s;
    const dCorps = Math.hypot(s.pos.x - P.rp.x, s.pos.z - P.rp.z);
    if (P.rp.y > G.y + 0.38) return false;
    if (destinataire && (d < 1.05 || dCorps < 0.95)) return prendre(s);
    if (d > 0.66) return false;
    const vit = Math.hypot(P.rv.x, P.rv.z);
    if (vit < 7.5) return prendre(s);
    if (s.essai === P.idMouvement) return false;
    s.essai = P.idMouvement;
    const chance = (vit < 14 ? 0.24 : 0.09) * (0.6 + s.talent);
    if (Math.random() < chance) return prendre(s);
    const dev = v3.set(P.rv.x, 0, P.rv.z).multiplyScalar(0.55).applyAxisAngle(HAUT, alea(-0.6, 0.6));
    P.R.corps.setLinvel({ x: dev.x, y: P.rv.y, z: dev.z }, true);
    return false;
  }

  function couloirLibre(de, vers, adversaires, marge = 1.1) {
    const ab = v3.copy(vers).sub(de).setY(0);
    const l2 = ab.lengthSq();
    if (l2 < 1e-3) return true;
    for (const o of adversaires) {
      const ap = v2.copy(o.pos).sub(de).setY(0);
      const t = borne(ap.dot(ab) / l2, 0, 1);
      if (t < 0.08 || t > 0.95) continue;
      const px = de.x + ab.x * t - o.pos.x, pz = de.z + ab.z * t - o.pos.z;
      if (Math.hypot(px, pz) < marge) return false;
    }
    return true;
  }

  function passer(s, c) {
    const E = P.equipes[s.equipe];
    const d = c.pos.distanceTo(s.pos);
    const vitesse = c.estEric ? borne(7 + d * 0.22, 7.5, 10.4) : borne(8.5 + d * 0.4, 9, 16);
    const tVol = d / vitesse;
    const visee = v1.copy(c.pos).addScaledVector(c.vel, tVol * 0.85);
    const dir = visee.sub(P.rp).setY(0).normalize();
    compter('passe');
    relacher(s);
    P.R.corps.setLinvel({ x: dir.x * vitesse, y: 0.02, z: dir.z * vitesse }, true);
    P.passe = { de: s, vers: c, t: 0 };
    jouerAnim(s, 'skate_pass', 0.7);
    audio.jouer3d('rondelle_tir', P.rp, { volume: 0.35, hauteur: 1.2 });
    if (c.estEric && Math.random() < 0.25) equipeDit(E, ['coequipier_passe_eric', 'hockey_passe_demandee'], 0, s);
  }

  function tirer(s, frappe) {
    const E = P.equipes[s.equipe];
    const net = filetAdverse(E, v1);
    const coin = (Math.random() < 0.5 ? -1 : 1) * alea(0.4, 0.86);
    const haut = Math.random() < 0.45 ? alea(0.7, 1.1) : alea(0.08, 0.3);
    const cible = net.addScaledVector(G.lat, coin);
    const dir = v2.copy(cible).sub(P.rp).setY(0);
    const dist = dir.length();
    dir.normalize().applyAxisAngle(HAUT, alea(-1, 1) * (0.035 + (1 - s.talent) * 0.07));
    const vitesse = frappe ? alea(25, 32) : alea(18, 25);
    const t = Math.max(0.05, dist / vitesse);
    const vy = (haut + alea(-0.15, 0.15) - (P.rp.y - G.y)) / t + 0.5 * 9.81 * t;
    compter('tir');
    relacher(s);
    P.R.corps.setLinvel({ x: dir.x * vitesse, y: Math.max(0, vy), z: dir.z * vitesse }, true);
    jouerAnim(s, frappe ? 'skate_slap' : 'skate_shoot', frappe ? 1.2 : 0.8);
    audio.jouer3d('rondelle_tir', P.rp, { volume: frappe ? 1 : 0.7, hauteur: frappe ? 0.9 : 1.05 });
    enregistrerTir(s, { x: dir.x * vitesse, y: vy, z: dir.z * vitesse });
  }

  function degager(s) {
    const E = P.equipes[s.equipe];
    const cible = pointEquipe(E, G.butX - 2, (Math.random() < 0.5 ? -1 : 1) * (G.W - 3), v1);
    const dir = cible.sub(P.rp).setY(0).normalize();
    compter('degagement');
    relacher(s);
    P.R.corps.setLinvel({ x: dir.x * 19, y: 0.6, z: dir.z * 19 }, true);
    jouerAnim(s, 'skate_shoot', 0.8);
    audio.jouer3d('rondelle_tir', P.rp, { volume: 0.7 });
    P.surDegagement?.(s);
  }

  function enregistrerTir(s, vel) {
    const E = P.equipes[s.equipe];
    const uNet = G.butX * E.sens;
    const vu = vel.x * G.axe.x + vel.z * G.axe.z;
    let cadre = false;
    if (Math.abs(vu) > 0.5) {
      const t = (uNet - P.ru) / vu;
      if (t > 0 && t < 2.5) {
        const vl = vel.x * G.lat.x + vel.z * G.lat.z;
        const vAt = P.rvv + vl * t;
        const yAt = (P.rp.y - G.y) + vel.y * t - 4.9 * t * t;
        cadre = Math.abs(vAt) < 0.92 && yAt > 0 && yAt < 1.22;
      }
    }
    toucher(s);
    if (cadre) { E.tirs++; if (s.estEric) P.stats.tirs++; }
    P.tir = { tireur: s, equipe: E, cadre, t: 0, but: false };
    P.surTir?.(s, cadre);
    if (cadre && E.id === 'carabins' && localU(P.rp) * E.sens > G.butX - 14) foule?.reagir('occasion');
  }

  function suivreTir(dt) {
    const T = P.tir;
    if (!T) return;
    T.t += dt;
    if (T.but) { P.tir = null; return; }
    const E = T.equipe;
    const versFilet = Math.sign(E.sens) * (P.rv.x * G.axe.x + P.rv.z * G.axe.z);
    const g = P.equipes[autre(E.id)]?.gardien;
    const pres = g && g.pnj.position.distanceTo(P.rp) < 2.2;
    if (T.cadre && T.t > 0.08 && (versFilet < 1 || porteur() || P.R.horsJeu) && (pres || porteur())) {
      P.tir = null;
      if (P.mode === 'match') {
        const O = P.equipes[autre(E.id)];
        bus.emit('hockey:arret', { equipe: O.id });
        if (O.id === 'carabins') { foule?.reagir('arret_local'); if (Math.random() < 0.6) equipeDit(O, ['match_arret_carabins', 'hockey_arret_gardien'], 0, O.gardien); }
        else if (T.tireur.estEric) {
          const r = Math.random();
          if (r < 0.35) ericDit(['match_eric_arret'], 1);
          else if (r < 0.7) dire(['match_arret_tir_eric', 'foule_arret'], { canal: 'glace', roles: [...roles(P.equipes.carabins), 'foule'] });
        }
        else if (Math.random() < 0.3) fouleDit(['foule_arret']);
      }
      P.surArret?.(T);
      return;
    }
    if (T.t > 2.5) P.tir = null;
  }

  // ---------- intelligence des patineurs ----------
  function plusProche(liste, p, sauf = null) {
    let m = null, dm = Infinity;
    for (const s of liste) {
      if (s === sauf || s.banc) continue;
      const d = s.pos.distanceTo(p);
      if (d < dm) { dm = d; m = s; }
    }
    return [m, dm];
  }

  function decider(s) {
    const E = P.equipes[s.equipe];
    const O = P.equipes[autre(s.equipe)];
    const prt = porteur();
    if (s === P.porteurAI) return deciderPorteur(s, E, O);
    if (prt && prt.equipe === s.equipe) return soutenir(s, E, O, prt);
    if (prt) return defendre(s, E, O, prt);
    return rondelleLibre(s, E, O);
  }

  function deciderPorteur(s, E, O) {
    const su = uEquipe(E, s.pos), sv = vEquipe(E, s.pos);
    const adversaires = O.glace.filter((x) => !x.banc);
    const [, dPress] = plusProche(adversaires, s.pos);
    const dNet = Math.hypot(G.butX - su, sv);
    const angle = Math.abs(Math.atan2(sv, G.butX - su));
    const mode = P.comportement?.(s, E, O) || null;
    if (mode === 'degager') { degager(s); return; }
    // passe demandée par Éric
    if (s.equipe === 'carabins' && P.demande > 0 && !ERIC.banc && couloirLibre(P.rp, ERIC.pos, adversaires, 0.9) && ERIC.pos.distanceTo(s.pos) < 28) {
      if (!(P.regles.horsJeu && uEquipe(E, ERIC.pos) > G.bleue + 0.3 && uEquipe(E, P.rp) < G.bleue)) { passer(s, ERIC); P.demande = 0; return; }
    }
    // tir
    if (su > G.bleue - 1 && su < G.butX + 0.3 && dNet < 21 && angle < 1.15 && (P.temps - (s.depuis || 0)) > 0.25) {
      const net = filetAdverse(E, v3);
      const libre = couloirLibre(P.rp, net, adversaires, 0.8);
      const q = Math.max(0, 1 - dNet / 18) * (1 - angle / 1.35) * (libre ? 1 : 0.35);
      const pointe = dNet >= 15 && libre && dPress > 3 ? 0.12 : 0;
      if (Math.random() < 0.06 + pointe + q * 0.75 || (dPress < 1.6 && dNet < 9)) { tirer(s, dNet > 9 && dPress > 3.5 && Math.random() < 0.55); return; }
    }
    // passe
    const option = meilleurePasse(s, E, O, adversaires);
    if (option) {
      const presse = dPress < 2.3;
      if ((presse && Math.random() < 0.7) || (option.score > 6 && Math.random() < 0.16) || (option.cible.estEric && option.score > 3 && Math.random() < 0.14)) { passer(s, option.cible); return; }
    }
    // dégagement sous pression dans sa zone
    if (su < -G.bleue && dPress < 1.4 && Math.random() < 0.6) { degager(s); return; }
    // patiner avec la rondelle
    const couloir = COTE_POSTE[s.poste] * (s.poste[0] === 'D' ? 4 : 7.5);
    let ut, vt;
    if (su < G.bleue) { ut = su + 9; vt = couloir * 0.6 + sv * 0.4; }
    else if (dPress < 2.4 && Math.abs(sv) > 4) { ut = Math.min(G.butX - 1.5, su + 3); vt = Math.sign(sv) * (G.W - 2); }
    else { ut = G.butX - 5.5; vt = Math.sign(sv || 1) * 2.4; }
    // contourner l'adversaire le plus proche devant soi
    const [o] = plusProche(adversaires, s.pos);
    if (o) {
      const ou = uEquipe(E, o.pos), ov = vEquipe(E, o.pos);
      if (ou > su && ou - su < 5 && Math.abs(ov - sv) < 2.5) vt = sv + (ov > sv ? -3.5 : 3.5);
    }
    pointEquipe(E, ut, vt, s.cible);
    s.vmax = 6.4 + s.talent * 0.8;
  }

  function meilleurePasse(s, E, O, adversaires) {
    const su = uEquipe(E, s.pos);
    let meilleur = null;
    const coequipiers = E.glace.filter((x) => x !== s && !x.banc);
    for (const c of coequipiers) {
      const d = c.pos.distanceTo(s.pos);
      if (d < 3.5 || d > 26) continue;
      const cu = uEquipe(E, c.pos);
      if (P.regles.horsJeu && cu > G.bleue + 0.3 && uEquipe(E, P.rp) < G.bleue) continue;
      if (!couloirLibre(P.rp, c.pos, adversaires, 1.05)) continue;
      const [, libre] = plusProche(adversaires, c.pos);
      const score = (cu - su) * 0.32 + Math.min(libre, 6) - d * 0.07 + (c.estEric ? 1.2 : 0);
      if (!meilleur || score > meilleur.score) meilleur = { cible: c, score };
    }
    return meilleur;
  }

  function soutenir(s, E, O, prt) {
    const pu = uEquipe(E, P.rp), pv = vEquipe(E, P.rp);
    const zoneOff = pu > G.bleue;
    const cu = uEquipe(E, prt.pos), cv = vEquipe(E, prt.pos);
    const k = COTE_POSTE[s.poste];
    let ut, vt;
    switch (s.poste) {
      case 'C':
        if (zoneOff) { ut = G.butX - 7.5; vt = borne(-pv * 0.3, -3, 3); }
        else { ut = cu + 2.5; vt = cv > 0 ? cv - 5.5 : cv + 5.5; }
        break;
      case 'AG': case 'AD':
        if (zoneOff) {
          if (Math.sign(pv || k) === k) { ut = Math.max(G.bleue + 2, pu - 3); vt = k * (G.W - 2.6); }
          else { ut = G.butX - 3.2; vt = k * 2.3; }
        } else { ut = cu + 7; vt = k * 7.5; }
        break;
      default:
        if (zoneOff) { ut = G.bleue + 1.6; vt = k * 6.5 + pv * 0.15; }
        else { ut = Math.min(cu - 6.5, G.bleue - 2); vt = k * 4.5; }
    }
    if (P.regles.horsJeu && !zoneOff) ut = Math.min(ut, G.bleue - 0.8);
    if (s.poste[0] === 'D') ut = Math.min(ut, G.bleue + 2.5);
    pointEquipe(E, ut, vt, s.cible);
    s.vmax = 6.8 + s.talent;
    s.regardRondelle = true;
  }

  function defendre(s, E, O, prt) {
    const cu = uEquipe(E, prt.pos), cv = vEquipe(E, prt.pos);
    const k = COTE_POSTE[s.poste];
    const moi = E.glace.filter((x) => !x.banc && !x.estEric);
    // le presseur : le plus proche du porteur
    let presseur = null, dp = Infinity;
    for (const x of moi) {
      const d = x.pos.distanceTo(prt.pos) + (x.poste[0] === 'D' && cu > -G.bleue ? 4 : 0);
      if (d < dp) { dp = d; presseur = x; }
    }
    s.regardRondelle = true;
    if (s === presseur) {
      const net = filetPropre(E, v3);
      const versNet = v2.copy(net).sub(prt.pos).setY(0).normalize();
      // zone neutre : on garde l'écart ; en zone défensive ou en échec avant, on presse
      const ecart = cu > G.bleue ? 0.7 : cu < -G.bleue + 2 ? 0.85 : 2.4;
      s.cible.copy(prt.pos).addScaledVector(prt.vel, ecart > 1 ? 0.15 : 0.3).addScaledVector(versNet, ecart);
      s.vmax = 6.9 + s.talent * 0.5;
      return;
    }
    let ut, vt;
    if (cu > G.bleue) {
      // échec avant
      const avants = moi.filter((x) => x.poste[0] !== 'D' && x !== presseur);
      const i = avants.indexOf(s);
      if (s.poste[0] === 'D') { ut = G.bleue + 0.6; vt = k * 6.2; }
      else if (i === 0) { ut = G.bleue + 4; vt = Math.sign(cv || 1) * (G.W - 3); }
      else { ut = G.bleue + 0.2; vt = -Math.sign(cv || 1) * 2.5; }
    } else if (s.poste[0] === 'D') {
      if (cu < -G.bleue) { ut = -G.butX + 4.3; vt = k * 1.9 + cv * 0.2; }
      else { ut = Math.max(cu - 7, -G.butX + 5); vt = k * 4 + cv * 0.3; }
    } else {
      // repli : couvrir l'adversaire le plus dangereux non surveillé
      const marque = P.marquage?.get(s);
      if (marque) {
        const net = filetPropre(E, v3);
        const versNet = v2.copy(net).sub(marque.pos).setY(0).normalize();
        s.cible.copy(marque.pos).addScaledVector(versNet, 1.6);
        s.vmax = 7 + s.talent * 0.5;
        return;
      }
      ut = cu - 5; vt = k * 6;
    }
    pointEquipe(E, ut, vt, s.cible);
    s.vmax = 6.8 + s.talent * 0.6;
  }

  function rondelleLibre(s, E, O) {
    const moi = E.glace.filter((x) => !x.banc && !x.estEric);
    let chasseur = null, dc = Infinity;
    for (const x of moi) {
      const d = x.pos.distanceTo(P.rp) - (x.poste[0] === 'D' && uEquipe(E, P.rp) > 0 ? -3 : 0);
      if (d < dc) { dc = d; chasseur = x; }
    }
    s.regardRondelle = true;
    if (s === chasseur && !(P.passe && P.passe.de.equipe === E.id && P.passe.vers !== s && P.passe.vers.pos.distanceTo(P.rp) < s.pos.distanceTo(P.rp))) {
      const d = s.pos.distanceTo(P.rp);
      s.cible.copy(P.rp).addScaledVector(v2.set(P.rv.x, 0, P.rv.z), Math.min(0.55, d / 8));
      s.vmax = 7.6 + s.talent * 0.5;
      return;
    }
    if (P.passe && P.passe.vers === s) {
      s.cible.copy(P.rp).addScaledVector(v2.set(P.rv.x, 0, P.rv.z), 0.35);
      s.vmax = 6;
      return;
    }
    const pu = uEquipe(E, P.rp), pv = vEquipe(E, P.rp);
    const k = COTE_POSTE[s.poste];
    let ut, vt;
    if (s.poste[0] === 'D') { ut = pu > 0 ? Math.min(G.bleue + 1, pu - 8) : Math.max(-G.butX + 5, pu - 5); vt = k * 5; }
    else if (s.poste === 'C') { ut = pu - 3; vt = borne(pv * 0.5, -4, 4); }
    else { ut = pu + (pu > 0 ? -1 : 2); vt = k * 7; }
    if (P.regles.horsJeu && pu < G.bleue) ut = Math.min(ut, G.bleue - 0.8);
    pointEquipe(E, ut, vt, s.cible);
    s.vmax = 6.6 + s.talent * 0.6;
  }

  function calculerMarquage() {
    const m = new Map();
    for (const id of ['carabins', 'visiteurs']) {
      const E = P.equipes[id], O = P.equipes[autre(id)];
      const prt = porteur();
      if (!prt || prt.equipe !== O.id) continue;
      const net = filetPropre(E, v3);
      const menaces = O.glace.filter((x) => !x.banc && x !== prt).sort((a, b) => a.pos.distanceTo(net) - b.pos.distanceTo(net));
      const libres = E.glace.filter((x) => !x.banc && !x.estEric && x.poste[0] !== 'D');
      for (const cible of menaces) {
        if (!libres.length) break;
        libres.sort((a, b) => a.pos.distanceTo(cible.pos) - b.pos.distanceTo(cible.pos));
        m.set(libres.shift(), cible);
      }
    }
    P.marquage = m;
  }

  // ---------- harponnage, mises en échec, pénalités ----------
  function contacts(dt) {
    const prt = porteur();
    if (!prt || P.etat !== 'jeu') return;
    const O = P.equipes[autre(prt.equipe)];
    for (const s of O.glace) {
      if (s.banc || s.estEric || s.chute > 0) continue;
      s.poke -= dt;
      s.mise -= dt;
      const d = s.pos.distanceTo(prt.pos);
      if (d > 1.7) continue;
      // mise en échec : arrivée rapide sur le porteur
      const rel = v2.copy(s.vel).sub(prt.vel).length();
      if (d < 1.0 && rel > 4 && s.mise <= 0 && Math.random() < 0.18 && P.regles.mises !== false) {
        s.mise = 5;
        miseEnEchec(s, prt);
        return;
      }
      if (s.poke > 0 || d > 1.5) continue;
      s.poke = alea(1.0, 1.6);
      const vitP = Math.hypot(prt.vel.x, prt.vel.z);
      const dirP = v2.set(prt.vel.x, 0, prt.vel.z).normalize();
      const versP = v3.copy(prt.pos).sub(s.pos).setY(0).normalize();
      const derriere = vitP > 2 && dirP.dot(versP) > 0.45;
      if (P.regles.penalites && Math.random() < (derriere ? 0.075 : 0.03) * (P.params.penalites ?? 1)) {
        penalite(s, derriere ? 'accrochage' : 'trebucher', prt);
        return;
      }
      let chance = 0.17 - vitP * 0.012 + (s.talent - 0.6) * 0.25;
      if (prt.estEric) chance *= 1.12 - (jeu.etat.drapeaux.patinage ?? 0.4) * 0.45;
      if (Math.random() < chance) {
        jouerAnim(s, 'skate_pass', 0.5);
        if (prt.estEric) { hockey.perdre(); bus.emit('hockey:vole'); if (Math.random() < 0.4) equipeDit(O, ['adversaire_vol', 'adversaire_provocation'], 0, s); }
        else perdreAI(prt);
        if (Math.random() < 0.55) prendre(s);
        else { const r = v1.set(alea(-1, 1), 0, alea(-1, 1)).normalize().multiplyScalar(4); P.R.corps.setLinvel({ x: r.x, y: 0, z: r.z }, true); P.idMouvement++; toucher(s); }
        P.surVol?.(s, prt);
      }
    }
  }

  function miseEnEchec(s, prt) {
    const pres = Math.abs(localV(prt.pos)) > G.W - 2.5 || Math.abs(localU(prt.pos)) > G.L - 4;
    audio.jouer3d(pres ? 'rondelle_bande' : 'objet_choc', prt.pos, { volume: 1, hauteur: pres ? 0.5 : 0.65 });
    foule?.reagir('mise_en_echec');
    const pousse = v2.copy(prt.pos).sub(s.pos).setY(0).normalize();
    if (prt.estEric) {
      hockey.perdre();
      jeu.joueur.vitesse.multiplyScalar(0.3).addScaledVector(pousse, 1.5);
      cam.secouer?.(0.6);
      if (Math.random() < 0.5) ericDit(['eric_mise_en_echec', 'eric_chute_glace']);
    } else {
      perdreAI(prt);
      prt.vel.multiplyScalar(0.3).addScaledVector(pousse, 1.5);
      if (Math.random() < 0.2) { prt.chute = 1.4; jouerAnim(prt, 'skate_fall', 1.4); }
    }
    s.vel.multiplyScalar(0.5);
    P.idMouvement++;
    P.R.corps.setLinvel({ x: P.rv.x * 0.3 + pousse.x * 2, y: 0, z: P.rv.z * 0.3 + pousse.z * 2 }, true);
    if (prt.equipe === 'carabins' && Math.random() < 0.4) equipeDit(P.equipes.carabins, ['coequipier_attention'], 0);
  }

  function harponner() {
    if (P.etat !== 'jeu' || ERIC.banc) return;
    const prt = porteur();
    const j = jeu.joueur;
    j.jouerSpecial('skate_pass', 0.35);
    if (!prt || prt.estEric || prt.equipe === 'carabins') return;
    const d = prt.pos.distanceTo(j.position);
    const versP = v2.copy(prt.pos).sub(j.position).setY(0).normalize();
    if (d > 2.2 || versP.dot(j.avant()) < 0.2) return;
    const dirP = v3.set(prt.vel.x, 0, prt.vel.z);
    const derriere = dirP.length() > 2 && dirP.normalize().dot(versP) > 0.45;
    if (P.regles.penalites && Math.random() < (derriere ? 0.14 : 0.05) * (P.params.penalites ?? 1)) { penalite(ERIC, derriere ? 'accrochage' : 'trebucher', prt); return; }
    const chance = 0.32 + (jeu.etat.drapeaux.patinage ?? 0.4) * 0.25;
    if (Math.random() < chance) {
      perdreAI(prt);
      const r = v1.copy(j.position).addScaledVector(j.avant(), 0.6).sub(P.rp).setY(0).multiplyScalar(3);
      P.R.corps.setLinvel({ x: r.x, y: 0, z: r.z }, true);
      P.idMouvement++;
      toucher(ERIC);
      if (Math.random() < 0.3) equipeDit(P.equipes.carabins, ['coequipier_bravo'], 0);
    }
  }

  function boitePenalite(equipe, k = 0) {
    const cote = equipe === 'carabins' ? -1 : 1;
    return monde(cote * (3.2 + k * 0.9), -(G.W + 0.9));
  }
  function retourBanc(equipe) {
    const cote = equipe === 'carabins' ? -1 : 1;
    return monde(cote * 3, G.W - 1.2);
  }

  function penalite(fautif, type, victime) {
    if (P.etat !== 'jeu') return;
    const E = P.equipes[fautif.equipe];
    if (E.penalites.length >= 2) return;
    if (victime && !victime.estEric && type === 'trebucher') { victime.chute = 1.3; jouerAnim(victime, 'skate_fall', 1.3); }
    if (victime?.estEric && type === 'trebucher') jeu.joueur.vitesse.multiplyScalar(0.2);
    siffler(P.arbitres[0]);
    const k = E.penalites.length;
    E.penalites.push({ joueur: fautif, type, reste: P.dureePenalite });
    fautif.banc = true;
    if (porteur() === fautif) { if (fautif.estEric) hockey.perdre(); else perdreAI(fautif); }
    const boite = boitePenalite(E.id, k);
    if (fautif.estEric) {
      hockey.perdre();
      jeu.joueur.asseoir({ position: boite.clone().setY(G.y + 0.45), quaternion: new THREE.Quaternion().setFromAxisAngle(HAUT, Math.atan2(G.lat.x, G.lat.z) + Math.PI), anim: 'sit' });
      ericDit(['eric_penalite'], 2);
    } else {
      fautif.pos.copy(boite);
      fautif.vel.set(0, 0, 0);
      fautif.lacet = Math.atan2(G.lat.x, G.lat.z);
      if (fautif.pnj) { fautif.pnj.lacet = fautif.lacet; fautif.pnj.perso.jouer('skate_idle'); fautif.pnj.corps.setNextKinematicTranslation({ x: boite.x, y: boite.y + 0.88, z: boite.z }); }
    }
    P.stats.penalites.push({ equipe: E.nom, numero: fautif.numero, nom: fautif.prenom, type });
    const nomFaute = NOMS_FAUTES[type] || type;
    bus.emit('toast', { texte: `Pénalité · ${E.nom} n° ${fautif.numero} ${fautif.prenom} · ${nomFaute} · 2 minutes`, type: fautif.equipe === 'carabins' ? 'alerte' : 'info', duree: 5 });
    bus.emit('match:penalite', { equipe: E.id, numero: fautif.numero, type });
    arbitreDit([`arbitre_penalite_${type}`, 'arbitre_penalite'], 2);
    setTimeout(() => annoncer(['match_annonce_penalite']), 2600);
    if (E.id === 'carabins') { foule?.reagir('penalite_contre'); setTimeout(() => entraineurDit(['entraineur_match_penalite']), 1200); }
    else { foule?.reagir('penalite_pour'); setTimeout(() => entraineurDit(['entraineur_match_avantage']), 1200); if (Math.random() < 0.6) setTimeout(() => equipeDit(E, ['adversaire_penalite'], 0, fautif.estEric ? null : fautif), 700); }
    arret('penalite', { u: -(G.butX - 6.1) * E.sens, v: Math.sign(localV(P.rp) || 1) * 6.7 });
  }

  function finirPenalite(E, i) {
    const pen = E.penalites.splice(i, 1)[0];
    if (!pen) return;
    const f = pen.joueur;
    f.banc = false;
    const sortie = retourBanc(E.id);
    const autres = E.glace.filter((s) => s !== f && !s.banc && !s.auBanc).length;
    if (!f.estEric && autres >= 5) {
      E.glace = E.glace.filter((s) => s !== f);
      envoyerAuBanc(f, E);
      return;
    }
    if (f.estEric) {
      jeu.joueur.mode = 'libre';
      jeu.joueur.placer(sortie, Math.atan2(-G.lat.x, -G.lat.z));
      toast('Ta pénalité est terminée. Retour au jeu !');
    } else {
      f.pos.copy(sortie);
      if (f.pnj) f.pnj.corps.setNextKinematicTranslation({ x: sortie.x, y: sortie.y + 0.88, z: sortie.z });
    }
  }

  function tickPenalites(dt) {
    for (const E of Object.values(P.equipes)) {
      for (let i = E.penalites.length - 1; i >= 0; i--) {
        E.penalites[i].reste -= dt;
        if (E.penalites[i].reste <= 0) finirPenalite(E, i);
      }
      if (ERIC.banc && jeu.joueur.mode !== 'assis' && E.penalites.some((p) => p.joueur === ERIC)) {
        const pen = E.penalites.find((p) => p.joueur === ERIC);
        const k = E.penalites.indexOf(pen);
        jeu.joueur.asseoir({ position: boitePenalite(E.id, k).setY(G.y + 0.45), quaternion: new THREE.Quaternion().setFromAxisAngle(HAUT, Math.atan2(G.lat.x, G.lat.z) + Math.PI), anim: 'sit' });
      }
    }
  }

  // ---------- arbitres, sifflets, arrêts de jeu ----------
  function siffler(ref) {
    const p = ref?.pos || P.rp;
    audio.jouer3d('sifflet', p, { volume: 0.9, distanceRef: 6 });
  }
  function toast(texte, type = 'info', duree = 3.5) { bus.emit('toast', { texte, type, duree }); }

  function arret(type, mise) {
    if (porteur() === ERIC) hockey.perdre();
    if (P.porteurAI) perdreAI(P.porteurAI);
    P.etat = 'arret';
    P.minuterie = type === 'penalite' ? 3.2 : 2.2;
    P.miseAuJeu = mise;
    P.R.horsJeu = true;
    P.passe = null;
    P.tir = null;
  }

  function horsJeu(E, fautif) {
    siffler(P.arbitres[1] || P.arbitres[0]);
    toast(fautif.estEric ? 'Hors-jeu : tu es entré dans la zone avant la rondelle.' : `Hors-jeu · ${E.nom}`, fautif.estEric ? 'alerte' : 'info');
    arbitreDit(['arbitre_hors_jeu'], 1);
    if (fautif.estEric && Math.random() < 0.5) setTimeout(() => entraineurDit(['entraineur_match_hors_jeu']), 1500);
    arret('hors_jeu', { u: (G.bleue - 1.5) * E.sens, v: Math.sign(localV(P.rp) || 1) * 6.7 });
  }

  function surGel(g) {
    if (P.mode !== 'match') return;
    if (P.etat !== 'jeu') return;
    siffler(P.arbitres[0]);
    if (Math.random() < 0.35) arbitreDit(['arbitre_rondelle_gelee'], 0);
    const E = P.equipes.carabins.gardien === g ? P.equipes.carabins : P.equipes.visiteurs;
    arret('gel', { u: -(G.butX - 6.1) * E.sens, v: Math.sign(localV(P.rp) || 1) * 6.7 });
  }

  function surSortie(p) {
    if (P.mode !== 'match' || p !== P.R) {
      if (P.mode === 'entrainement') P.surSortie?.(p);
      return;
    }
    if (P.etat === 'jeu') {
      siffler(P.arbitres[0]);
      const u = localU(P.rp);
      const dot = Math.abs(u) > G.bleue ? Math.sign(u) * (G.butX - 6.1) : Math.sign(u || 1) * (G.bleue - 1.5);
      arret('sortie', { u: dot, v: Math.sign(localV(P.rp) || 1) * 6.7 });
    }
    placerRondelle(monde(P.miseAuJeu?.u ?? 0, P.miseAuJeu?.v ?? 0));
  }

  function verifierHorsJeu() {
    if (!P.regles.horsJeu) return;
    for (const E of Object.values(P.equipes)) {
      const avant = P.ruPrec * E.sens, maintenant = P.ru * E.sens;
      if (!(avant < G.bleue && maintenant >= G.bleue)) continue;
      const prt = porteur();
      const controle = prt ? prt.equipe : P.dernier?.equipe;
      if (controle !== E.id) continue;
      const fautif = E.glace.find((s) => !s.banc && s !== prt && uEquipe(E, s.pos) > G.bleue + 0.45);
      if (fautif) { horsJeu(E, fautif); return; }
    }
  }

  function positionsMiseAuJeu(E, du, dv) {
    // du, dv : point de mise au jeu dans le repère de l'équipe
    return {
      C: [du - 0.85, dv], AG: [du - 1.1, dv - 4.6], AD: [du - 1.1, dv + 4.6], DG: [du - 6.6, dv - 3.4], DD: [du - 6.6, dv + 3.4],
    };
  }

  function preparerMiseAuJeu(m) {
    P.etat = 'mise_au_jeu';
    P.minuterie = 1.7;
    P.miseAuJeu = m;
    const point = monde(m.u, m.v);
    placerRondelle(point);
    P.R.horsJeu = true;
    for (const E of Object.values(P.equipes)) {
      const du = m.u * E.sens, dv = m.v * E.sens;
      const pos = positionsMiseAuJeu(E, du, dv);
      const presents = E.glace.filter((s) => !s.banc);
      const postesLibres = [...POSTES];
      for (const s of presents) {
        const poste = postesLibres.includes(s.poste) ? s.poste : postesLibres[0];
        if (!poste) continue;
        postesLibres.splice(postesLibres.indexOf(poste), 1);
        const [ut, vt] = pos[poste];
        const cible = pointEquipe(E, ut, vt);
        const lacet = Math.atan2(G.axe.x * E.sens, G.axe.z * E.sens);
        if (s.estEric) {
          jeu.joueur.placer(cible, lacet);
        } else {
          s.cible.copy(cible);
          if (s.pos.distanceTo(cible) > 5) { s.pos.copy(cible); s.vel.set(0, 0, 0); s.lacet = lacet; }
          s.lacet = lacet;
        }
      }
    }
    const ref = P.arbitres[0];
    if (ref) { const c = monde(m.u, m.v + 1.4); ref.cible.copy(c); if (ref.pos.distanceTo(c) > 5) ref.pos.copy(c); }
    if (Math.random() < 0.25) arbitreDit(['arbitre_mise_au_jeu', 'hockey_mise_au_jeu'], 0);
  }

  function laisserTomber() {
    const m = P.miseAuJeu;
    const point = monde(m.u, m.v);
    placerRondelle(point);
    P.R.horsJeu = false;
    P.etat = 'jeu';
    const centres = Object.values(P.equipes).map((E) => E.glace.find((s) => s.poste === 'C' && !s.banc && !s.estEric) || E.glace.find((s) => !s.banc && !s.estEric)).filter(Boolean);
    if (centres.length < 2) return;
    const [a, b] = centres;
    const gagnant = Math.random() < 0.5 + (a.talent - b.talent) * 0.8 ? a : b;
    const E = P.equipes[gagnant.equipe];
    const d = E.glace.find((s) => s.poste === (Math.random() < 0.5 ? 'DG' : 'DD') && !s.banc) || E.glace.find((s) => !s.banc && s !== gagnant);
    const vers = (d ? v1.copy(d.pos) : pointEquipe(E, m.u * E.sens - 6, m.v * E.sens)).sub(point).setY(0).normalize();
    P.R.corps.setLinvel({ x: vers.x * 6.5, y: 0, z: vers.z * 6.5 }, true);
    jouerAnim(gagnant, 'skate_pass', 0.5);
    toucher(gagnant);
    P.idMouvement++;
    audio.jouer3d('rondelle_poteau', point, { volume: 0.4, hauteur: 1.5 });
  }

  // ---------- buts ----------
  function surBut(cote, p) {
    if (P.mode === 'entrainement') { if (p === P.R) P.surButEntrainement?.(cote); return true; }
    if (p !== P.R) return true;
    if (P.etat !== 'jeu') return;
    const E = Object.values(P.equipes).find((x) => (x.sens > 0 ? 'est' : 'ouest') === cote);
    if (!E) return;
    const O = P.equipes[autre(E.id)];
    E.score++;
    if (P.tir) P.tir.but = true;
    // buteur et passeurs
    let buteur = null;
    const passeurs = [];
    for (let i = P.touches.length - 1; i >= 0; i--) {
      const t = P.touches[i];
      if (t.s.equipe !== E.id) { if (buteur) break; continue; }
      if (!buteur) buteur = t.s;
      else if (t.s !== buteur && !passeurs.includes(t.s) && passeurs.length < 2) passeurs.push(t.s);
    }
    if (buteur?.estEric) P.stats.buts++;
    if (passeurs.includes(ERIC)) P.stats.aides++;
    P.stats.marque.push({ equipe: E.nom, periode: P.periode, buteur: buteur ? `n° ${buteur.numero} ${buteur.prenom}` : 'contre son camp', passeurs: passeurs.map((x) => `n° ${x.numero}`) });
    // avantage numérique : la pénalité la plus ancienne se termine
    if (O.penalites.length && O.penalites.length > E.penalites.length) finirPenalite(O, 0);
    P.etat = 'but';
    P.minuterie = P.prolongation ? 4 : 6;
    P.R.horsJeu = true;
    P.passe = null;
    P.porteurAI = null;
    hockey.porteur = null;
    const locaux = E.id === 'carabins';
    if (locaux) audio.jouer('sirene_but', { volume: 0.85 });
    foule?.but(E.id);
    bus.emit('hockey:but', { pourEric: locaux, equipe: E.nom, texte: buteur ? `${E.nom} · n° ${buteur.numero} ${buteur.estEric ? 'Bernier' : buteur.prenom}` : E.nom, buteur: buteur?.id || null });
    // célébration : le buteur lève le bâton, ses coéquipiers le rejoignent
    for (const s of E.glace) {
      if (s.banc) continue;
      if (s === buteur && !s.estEric) jouerAnim(s, 'celebrate_hockey', 2.2);
      else if (!s.estEric && buteur) { s.cible.copy(buteur.pos); s.vmax = 5; }
    }
    if (buteur?.estEric) {
      jeu.joueur.jouerSpecial('celebrate_hockey');
      setTimeout(() => ericDit(['eric_but'], 1), 400);
      setTimeout(() => equipeDit(E, ['hockey_but_eric', 'coequipier_but_eric'], 1), 1300);
      setTimeout(() => annoncer(['match_annonce_but_eric', 'match_annonce_but_carabins'], undefined, 2), 3200);
    } else if (locaux) {
      setTimeout(() => equipeDit(E, ['coequipier_but', 'hockey_but_eric'], 1, buteur), 900);
      setTimeout(() => { if (!annoncerBut(buteur)) annoncer(['match_annonce_but_carabins'], undefined, 2); }, 3200);
    } else {
      setTimeout(() => equipeDit(E, ['adversaire_but'], 1, buteur), 700);
      setTimeout(() => equipeDit(O, ['hockey_but_adverse', 'coequipier_but_contre'], 0), 1900);
      setTimeout(() => annoncer(['match_annonce_but_visiteurs'], undefined, 2), 3400);
    }
    setTimeout(() => entraineurDit([locaux ? 'entraineur_match_but' : 'entraineur_match_but_contre']), 2400);
    if (P.prolongation) P.finApresBut = true;
    majObjectifs();
  }

  // ---------- périodes ----------
  function changerTrio(n) {
    for (const id of ['carabins', 'visiteurs']) {
      const E = P.equipes[id];
      if (!E) continue;
      const trios = P.config.equipes[id].trios;
      const trio = trios[(n - 1) % trios.length];
      const surLaGlace = new Set(Object.values(trio));
      const enPenalite = new Set(E.penalites.map((p) => p.joueur));
      const nouveaux = [];
      for (const poste of POSTES) {
        const s = E.tous.find((x) => x.role === trio[poste]);
        if (s) { s.poste = poste; nouveaux.push(s); }
      }
      for (const s of E.tous) if (!s.estEric && !surLaGlace.has(s.role) && !enPenalite.has(s) && !s.auBanc) envoyerAuBanc(s, E);
      for (const s of nouveaux) if (s.auBanc) envoyerSurGlace(s);
      for (const s of E.glace) if (enPenalite.has(s) && !nouveaux.includes(s)) nouveaux.push(s);
      E.glace = nouveaux;
    }
  }

  function siegesBanc(E) {
    const sieges = Object.entries(jeu.zone.sieges || {}).filter(([k]) => /^SEAT_banc/i.test(k)).map(([, s]) => s.position);
    const cote = E.id === 'carabins' ? 1 : -1;
    if (sieges.length) {
      return sieges.map((p) => {
        const u = localU(p), v = localV(p);
        return monde(cote > 0 ? u : -u, v).setY(p.y);
      });
    }
    return [0, 1, 2, 3].map((k) => monde(-cote * (4.8 + k * 0.9), G.W + 1.95).setY(G.y + 0.47));
  }

  function envoyerAuBanc(s, E) {
    if (s.estEric || !s.pnj) return;
    const places = siegesBanc(E);
    const k = E.tous.filter((x) => x.auBanc).length % places.length;
    const p = places[k];
    s.auBanc = true;
    s.pnj.assis = true;
    s.pnj.comportement = 'statique';
    s.pnj.animRepos = 'sit';
    s.pnj.position.set(p.x, p.y - 0.45, p.z);
    s.pnj.lacet = Math.atan2(-G.lat.x, -G.lat.z);
    s.pnj.corps.setNextKinematicTranslation({ x: p.x, y: p.y - 0.45 + 0.88, z: p.z });
    s.pnj.perso.jouer('sit', { fondu: 0.2 });
  }
  function envoyerSurGlace(s) {
    if (s.estEric || !s.pnj) return;
    s.auBanc = false;
    s.pnj.assis = false;
    s.pnj.comportement = 'hockey';
    const p = retourBanc(s.equipe);
    s.pnj.position.copy(p);
    s.pos = s.pnj.position;
    s.vel.set(0, 0, 0);
    s.pnj.perso.jouer('skate_idle', { fondu: 0.2 });
  }

  function placerGardiens() {
    for (const E of Object.values(P.equipes)) {
      const g = E.gardien;
      if (!g) continue;
      hockey.orienterGardien(g, E.sens > 0 ? 'ouest' : 'est');
      g.pnj.position.copy(g.cible).setY(G.y);
      const t = g.pnj.corps.translation();
      g.pnj.corps.setTranslation({ x: g.cible.x, y: t.y, z: g.cible.z }, true);
      g.corps.setTranslation({ x: g.cible.x, y: 0.42, z: g.cible.z }, true);
    }
  }

  function debutPeriode(n) {
    P.periode = n;
    const prol = n > P.params.periodes;
    P.prolongation = prol;
    P.chrono = prol ? P.params.dureePeriode * 0.6 : P.params.dureePeriode;
    P.equipes.carabins.sens = (n % 2 === 1 ? 1 : -1) * P.sensInitial;
    P.equipes.visiteurs.sens = -P.equipes.carabins.sens;
    changerTrio(n);
    placerGardiens();
    toast(prol ? 'Prolongation : le prochain but l’emporte.' : `${nomPeriode(n, P.params.periodes)} période`, 'info', 3);
    annoncer(prol ? ['match_annonce_prolongation', 'match_annonce_periode'] : (n === 1 ? ['match_annonce_debut', 'match_annonce_periode'] : ['match_annonce_periode']), prol ? 4 : n, 2);
    if (n === 1) { foule?.reagir('debut'); setTimeout(() => entraineurDit(['entraineur_match_debut']), 2500); }
    preparerMiseAuJeu({ u: 0, v: 0 });
    P.minuterie = n === 1 ? 4 : 2.5;
  }

  function finPeriode() {
    P.etat = 'entracte';
    P.minuterie = P.params.entracte;
    if (porteur() === ERIC) hockey.perdre();
    if (P.porteurAI) perdreAI(P.porteurAI);
    P.R.horsJeu = true;
    audio.jouer('sirene_but', { volume: 0.6, hauteur: 0.8 });
    const n = P.periode;
    const C = P.equipes.carabins, V = P.equipes.visiteurs;
    toast(`Fin de la ${nomPeriode(n, P.params.periodes)} période · CARABINS ${C.score} – ${V.score} VISITEURS`, 'info', 5);
    annoncer(['match_annonce_fin_periode'], n, 1);
    if (n < P.params.periodes) {
      const idScene = P.config.scenes?.entracte?.[n];
      if (idScene && dialogues?.scene?.(idScene)) P.sceneEntracte = idScene;
      else setTimeout(() => entraineurDit(['entraineur_match_entracte']), 2000);
      audio.stinger(Math.random() < 0.5 ? 'arena_jeu_3' : 'arena_jeu_1', { volume: 0.55 });
    }
    for (const E of Object.values(P.equipes)) for (const s of E.glace) if (!s.estEric && !s.banc) { s.cible.copy(retourBanc(E.id)); s.vmax = 4; }
  }

  function finMatch() {
    P.etat = 'fin';
    P.minuterie = 6;
    P.R.horsJeu = true;
    if (porteur() === ERIC) hockey.perdre();
    audio.jouer('sirene_but', { volume: 0.75, hauteur: 0.8 });
    const C = P.equipes.carabins, V = P.equipes.visiteurs;
    const victoire = C.score > V.score, nul = C.score === V.score;
    toast(`Fin du match · CARABINS ${C.score} – ${V.score} VISITEURS`, victoire ? 'succes' : 'info', 6);
    foule?.reagir(victoire ? 'fin_victoire' : 'fin_defaite');
    annoncer(['match_annonce_fin'], victoire ? 1 : nul ? 3 : 2, 2);
    setTimeout(() => entraineurDit([victoire ? 'entraineur_match_fin_victoire' : 'entraineur_match_fin_defaite', victoire ? 'hockey_fin_victoire' : 'hockey_fin_defaite']), 1800);
    setTimeout(() => equipeDit(C, [victoire ? 'hockey_fin_victoire' : 'hockey_fin_defaite'], 0), 3600);
    for (const s of C.glace) if (!s.estEric && !s.banc) jouerAnim(s, victoire ? 'celebrate_hockey' : 'skate_idle', victoire ? 2.2 : 0);
    if (victoire) jeu.joueur.jouerSpecial('celebrate_hockey');
  }

  function majObjectifs() {
    const p = P.params;
    if (p.objectifPasses == null && p.objectifTirs == null) return;
    const op = p.objectifPasses ?? 0, ot = p.objectifTirs ?? 0;
    const prog = Math.min(1, (Math.min(P.stats.passes, op) + Math.min(P.stats.tirs, ot)) / Math.max(1, op + ot));
    const atteint = P.stats.passes >= op && P.stats.tirs >= ot;
    if (atteint && !P.objectifsAtteints) { P.objectifsAtteints = true; toast('Objectif atteint ! Finis le match en beauté.', 'succes'); }
    bus.emit('exercice', { type: 'match', titre: p.titre || 'Match des Carabins', consigne: p.consigne || '', progression: prog, texte: `Passes réussies ${P.stats.passes}/${op} · tirs cadrés ${P.stats.tirs}/${ot}` });
  }

  function hud() {
    const C = P.equipes.carabins, V = P.equipes.visiteurs;
    bus.emit('hockey:etat', {
      match: true,
      equipes: { eric: C.nom, adverse: V.nom },
      score: { eric: C.score, adverse: V.score },
      chrono: Math.max(0, P.chrono), periode: P.periode, nomPeriode: nomPeriode(P.periode, P.params.periodes),
      tirs: { eric: C.tirs, adverse: V.tirs },
      penalites: { eric: C.penalites.map((x) => Math.max(0, x.reste)), adverse: V.penalites.map((x) => Math.max(0, x.reste)) },
      charge: hockey.charge, possession: hockey.porteur === 'eric', arret: P.etat !== 'jeu',
    });
  }

  // ---------- boucle ----------
  function lireRondelle() {
    const t = P.R.corps.translation();
    P.rp.set(t.x, t.y, t.z);
    const l = P.R.corps.linvel();
    P.rv.set(l.x, l.y, l.z);
    P.ruPrec = P.ru;
    P.ru = localU(P.rp);
    P.rvv = localV(P.rp);
  }

  function bougerArbitres(dt) {
    P.arbitres.forEach((a, k) => {
      if (!(P.etat === 'mise_au_jeu' && k === 0)) {
        const cote = k === 0 ? 1 : -1;
        const u = borne(P.ru + cote * 6, -G.butX + 2, G.butX - 2);
        const [bu, bv] = borner(u, cote * (G.W - 1.7));
        monde(bu, bv, a.cible);
      }
      a.vmax = 6;
      piloter(a, dt);
    });
  }

  function mettreAJour(dt, ent) {
    if (!P.actif || !P.R || !jeu.joueur) return;
    P.temps += dt;
    lireRondelle();
    if (ent?.presses?.has('demander') && P.spectateur) {
      P.cameraTele = !P.cameraTele;
      if (!P.cameraTele) cam.suivi(jeu.joueur);
      toast(P.cameraTele ? 'Vue de la télévision · R pour revenir à ton siège' : 'Retour à ton siège', 'info', 2.5);
    } else if (ent?.presses?.has('demander') && !ERIC.banc) {
      P.demande = 1.6;
      ericDit(['eric_demande_passe'], 1);
    }
    if (P.cameraTele && !jeu.cinematique) {
      const pos = monde(borne(P.ru * 0.8, -G.L + 6, G.L - 6), -(G.W + 10)).setY(G.y + 9);
      cam.plan(pos, v3.copy(P.rp).setY(G.y + 0.5), { fov: 40, lissage: 2.5 });
    }
    P.demande = Math.max(0, P.demande - dt);
    if (P.mode === 'entrainement') { P.boucleEntrainement?.(dt, ent); finBoucle(dt); return; }
    switch (P.etat) {
      case 'jeu':
        P.chrono -= dt;
        tickPenalites(dt);
        jouer(dt);
        verifierHorsJeu();
        if (P.chrono <= 0 && P.etat === 'jeu') {
          P.chrono = 0;
          if (P.prolongation || P.periode >= P.params.periodes) {
            if (P.equipes.carabins.score === P.equipes.visiteurs.score && P.params.prolongation && !P.prolongation) finPeriode();
            else finMatch();
          } else finPeriode();
        }
        break;
      case 'arret':
        P.minuterie -= dt;
        mouvementsLibres(dt);
        if (P.minuterie <= 0) preparerMiseAuJeu(P.miseAuJeu || { u: 0, v: 0 });
        break;
      case 'mise_au_jeu':
        P.minuterie -= dt;
        mouvementsLibres(dt);
        placerRondelle(monde(P.miseAuJeu.u, P.miseAuJeu.v));
        if (P.minuterie <= 0) laisserTomber();
        break;
      case 'but':
        P.minuterie -= dt;
        mouvementsLibres(dt);
        if (P.minuterie <= 0) {
          if (P.finApresBut) { P.finApresBut = false; finMatch(); }
          else preparerMiseAuJeu({ u: 0, v: 0 });
        }
        break;
      case 'scene':
        mouvementsLibres(dt);
        break;
      case 'entracte':
        if (P.sceneEntracte && P.minuterie < P.params.entracte - 2.5) { const id = P.sceneEntracte; P.sceneEntracte = null; scene(id); break; }
        P.minuterie -= dt;
        mouvementsLibres(dt);
        if (P.minuterie <= 0) {
          const egal = P.equipes.carabins.score === P.equipes.visiteurs.score;
          if (P.periode < P.params.periodes) debutPeriode(P.periode + 1);
          else if (egal && P.params.prolongation && !P.prolongation) debutPeriode(P.periode + 1);
          else finMatch();
        }
        break;
      case 'fin':
        P.minuterie -= dt;
        mouvementsLibres(dt);
        if (P.minuterie <= 0) terminerMatch();
        break;
      default:
        break;
    }
    finBoucle(dt);
  }

  function finBoucle(dt) {
    foule?.mettreAJour(dt, { jeuEnCours: P.etat === 'jeu' });
    P.accHud += dt;
    if (P.accHud > 0.12 && P.mode === 'match') { P.accHud = 0; hud(); }
    if (P.mode === 'match' && P.etat === 'jeu') {
      P.accAmbiance = (P.accAmbiance ?? 12) - dt;
      if (P.accAmbiance <= 0) {
        P.accAmbiance = alea(14, 26);
        const r = Math.random();
        const avantage = P.equipes.visiteurs.penalites.length > P.equipes.carabins.penalites.length;
        if (r < 0.25) entraineurDit(['entraineur_match_banc'], 0);
        else if (r < 0.42) fouleDit(['foule_encouragement']);
        else if (r < 0.6 || avantage) ericDit(['match_eric'], 0);
        else if (r < 0.78) equipeDit(P.equipes.carabins, ['coequipier_jeu'], 0);
        else equipeDit(P.equipes.visiteurs, ['adversaire_provocation'], 0);
      }
      if (P.chrono < 60 && !P.derniereMinute && P.periode >= P.params.periodes) { P.derniereMinute = true; annoncer(['match_annonce_derniere_minute'], undefined, 1); }
    } else if (P.mode === 'match' && (P.etat === 'arret' || P.etat === 'entracte')) {
      P.accGradins = (P.accGradins ?? 6) - dt;
      if (P.accGradins <= 0) {
        P.accGradins = alea(16, 30);
        if (Math.random() < 0.6) dire(['match_gradins'], { canal: 'foule', priorite: 0, position: null });
      }
    }
  }

  function mouvementsLibres(dt) {
    for (const s of surGlace()) {
      if (s.estEric) continue;
      if (P.etat === 'arret' || P.etat === 'entracte' || P.etat === 'fin') s.vmax = Math.min(s.vmax, 3.5);
      piloter(s, dt);
    }
    bougerArbitres(dt);
  }

  function jouer(dt) {
    P.accDecision -= dt;
    if (P.accDecision <= 0) { P.accDecision = 0.1; calculerMarquage(); }
    const prt = porteur();
    // possession de la rondelle libre
    if (!prt && !P.R.horsJeu) {
      const candidats = surGlace().filter((s) => !s.estEric).sort((a, b) => a.pos.distanceTo(P.rp) - b.pos.distanceTo(P.rp));
      for (const s of candidats.slice(0, 4)) if (essayerPrendre(s)) break;
    }
    if (hockey.porteur === 'eric' && P.dernier !== ERIC) toucher(ERIC);
    for (const s of surGlace()) {
      if (s.estEric) continue;
      s.recup = Math.max(0, s.recup - dt);
      s.decision -= dt;
      if (s.decision <= 0) { s.decision = alea(0.2, 0.34); decider(s); }
      if (s === P.porteurAI) porter(s);
      piloter(s, dt);
    }
    contacts(dt);
    if (P.passe) { P.passe.t += dt; if (P.passe.t > 3.5) P.passe = null; }
    suivreTir(dt);
    bougerArbitres(dt);
  }

  function ericPeutPrendre() {
    if (!P.actif) return true;
    if (P.mode === 'entrainement') return !P.R?.horsJeu;
    return P.etat === 'jeu' && !P.porteurAI && !P.R?.horsJeu && !ERIC.banc;
  }

  function surPossessionEric() {
    const passe = P.passe;
    toucher(ERIC);
    if (passe && passe.de !== ERIC && passe.de.equipe === 'carabins') P.surPasse?.(passe.de, ERIC, true);
    P.passe = null;
    P.surPossession?.(ERIC);
  }
  function surPasseEric(cible) {
    toucher(ERIC);
    P.idMouvement++;
    const c = cible && P.patineurs.find((s) => s === cible || s.pnj === cible || s.id === cible.id);
    P.passe = { de: ERIC, vers: c || null, t: 0 };
    P.stats.passesTentees++;
  }
  function surTirEric(p, vitesse, dir, charge) {
    lireRondelle();
    enregistrerTir(ERIC, { x: dir.x * vitesse, y: charge > 0.55 ? 1.2 + 3.4 * (charge - 0.55) : 0.15, z: dir.z * vitesse });
    majObjectifs();
  }
  function coequipiersEric() {
    return P.patineurs.filter((s) => !s.estEric && !s.banc && s.equipe === 'carabins' && !s.horsJeuExercice).map((s) => ({ id: s.id, position: s.pos, vitesse: s.vel, ref: s }));
  }

  // ---------- installation commune ----------
  async function installer({ mode, equipesVoulues = ['carabins', 'visiteurs'], config = 'carabins' }) {
    const zone = jeu.zone;
    G = geometrie(zone);
    P.mode = mode;
    P.config = CONFIGS[config] || CONFIGS.carabins;
    P.temps = 0;
    P.patineurs = [];
    P.arbitres = [];
    P.pnjs = [];
    P.masques = [];
    P.touches = [];
    P.passe = null;
    P.tir = null;
    P.porteurAI = null;
    P.dernier = null;
    P.marquage = new Map();
    P.stats = { buts: 0, aides: 0, passes: 0, passesTentees: 0, tirs: 0, penalites: [], marque: [] };
    P.sensInitial = 1;
    P.derniereMinute = false;
    P.objectifsAtteints = false;
    // les joueurs de la zone laissent la place
    for (const p of [...gestionPnj.liste]) {
      if (p.match) continue;
      const surLaGlace = zone.glaceBoite && p.position.x > zone.glaceBoite.min.x - 0.3 && p.position.x < zone.glaceBoite.max.x + 0.3 && p.position.z > zone.glaceBoite.min.z - 0.3 && p.position.z < zone.glaceBoite.max.z + 0.3 && p.position.y < zone.glaceBoite.max.y + 1;
      if (/^joueur_hockey|^gardien$|^entraineur_patin$|^chevalier$/.test(p.role) || (surLaGlace && p.role !== 'chienne')) cacher(p);
    }
    hockey.viderGardiens();
    rangerRondelles();
    P.equipes = {};
    if (!equipesVoulues.includes('visiteurs')) P.equipes.visiteurs = { id: 'visiteurs', nom: 'CARABINS', sens: -1, gardien: null, glace: [], tous: [], score: 0, tirs: 0, penalites: [] };
    const avantGlace = (E, k) => pointEquipe(E, -4 - k * 2.5, (k % 2 ? 1 : -1) * 4);
    const charges = [];
    for (const id of equipesVoulues) {
      const conf = P.config.equipes[id];
      const E = { id, nom: conf.nom, sens: id === 'carabins' ? 1 : -1, gardien: null, glace: [], tous: [], score: 0, tirs: 0, penalites: [] };
      P.equipes[id] = E;
      const fiches = conf.effectif;
      fiches.forEach((f, k) => {
        charges.push(ajouterPnj(f, id, avantGlace(E, k), Math.atan2(G.axe.x * E.sens, G.axe.z * E.sens)).then((pnj) => {
          pnj.comportement = 'hockey';
          const s = creerPatineur(f, id, pnj);
          E.tous.push(s);
          P.patineurs.push(s);
          attacherBaton(pnj);
        }));
      });
      const fg = conf.gardien;
      charges.push(ajouterPnj(fg, id, filetPropre(E, new THREE.Vector3()), Math.atan2(G.axe.x * E.sens, G.axe.z * E.sens)).then((pnj) => {
        E.gardien = hockey.ajouterGardien(pnj, E.sens > 0 ? 'ouest' : 'est');
        if (E.gardien) { const x = extrasModele(pnj); E.gardien.vitesse = 2.9; E.gardien.delai = id === 'carabins' ? 0.14 : 0.15; E.gardien.patineur = { id: fg.role, role: fg.role, alias: fg.alias || [], pnj, equipe: id, numero: Number(x.numero ?? fg.numero), prenom: fg.prenom }; }
        attacherBaton(pnj);
      }));
    }
    if (mode === 'match') {
      for (const [k, role] of ['arbitre_1', 'arbitre_2'].entries()) {
        charges.push(ajouterPnj({ role, prenom: k === 0 ? 'Arbitre' : 'Juge de lignes' }, 'arbitre', monde(k ? -6 : 6, (k ? -1 : 1) * (G.W - 1.7)), 0, 'skate_idle', COULEURS_EQUIPES.arbitre).then((pnj) => {
          pnj.comportement = 'hockey';
          P.arbitres[k] = { id: role, role, pnj, pos: pnj.position, vel: new THREE.Vector3(), lacet: 0, cible: pnj.position.clone(), vmax: 6, talent: 0.7, banc: false, chute: 0, regardRondelle: true, phase: 0 };
        }));
      }
    }
    // entraîneur des Carabins derrière le banc (ou sur la glace à l'entraînement)
    const existeEntraineur = P.config.entraineur !== false && await personnages.existe('entraineur');
    const posEntraineur = mode === 'match' ? monde(-9.2, G.W + 1.0) : monde(-2, G.W - 2.5);
    if (existeEntraineur) {
      charges.push(ajouterPnj({ role: 'entraineur', prenom: 'Coach' }, null, posEntraineur, Math.atan2(-G.lat.x, -G.lat.z), mode === 'match' ? 'idle' : 'skate_idle').then((pnj) => { P.entraineur = pnj; pnj.comportement = 'statique'; }));
    } else if (P.config.entraineur !== false) {
      const c = P.masques.find((p) => p.role === 'entraineur_patin');
      if (c) {
        montrer(c);
        P.masques.splice(P.masques.indexOf(c), 1);
        c.position.copy(posEntraineur);
        const t = c.corps.translation();
        c.corps.setTranslation({ x: posEntraineur.x, y: t.y, z: posEntraineur.z }, true);
        c.lacet = Math.atan2(-G.lat.x, -G.lat.z);
        c.comportement = 'statique';
        c.muet = true;
        c.alias = [...(c.alias || []), 'entraineur'];
        P.entraineur = c;
        P.entraineurDeplace = { pnj: c, position: c.positionAvantMatch || null };
      }
    }
    await Promise.all(charges);
    P.patineurs.sort((a, b) => a.id.localeCompare(b.id));
    for (const E of Object.values(P.equipes)) E.tous.sort((a, b) => a.id.localeCompare(b.id));
    const j = jeu.joueur;
    ERIC.banc = false;
    if (P.config.eric === false) {
      const siege = jeu.zone.sieges?.SEAT_eric || Object.entries(jeu.zone.sieges || {}).find(([k]) => /eric|public|gradin/i.test(k))?.[1];
      if (siege) j.asseoir(siege);
      P.spectateur = true;
    } else {
      P.spectateur = false;
      j.patins = true;
      await equiperEric(true);
      hockey.equiperBaton(j);
    }
    if (P.equipes.carabins && P.config.eric !== false) {
      P.equipes.carabins.tous.push(ERIC);
      P.patineurs.push(ERIC);
    }
    // annonceur
    P.annonceur = gestionPnj.liste.find((p) => /imitateur|annonceur/.test(p.role) || /imitateur|annonceur/.test(p.id)) || null;
    if (P.annonceur) P.annonceur.alias = [...new Set([...(P.annonceur.alias || []), ...ROLES_ANNONCEUR])];
    const noms = {};
    for (const s of P.patineurs) if (!s.estEric) noms[s.role] = `${s.prenom} (${s.numero})`;
    dialogues?.definirNoms?.({ ...noms, arbitre_1: 'Arbitre', arbitre_2: 'Juge de lignes', imitateur: 'L’annonceur', annonceur: 'L’annonceur', foule: 'La foule' });
    hockey.match = P.mode === 'match' ? API : null;
    hockey.entrainement = P.mode === 'entrainement' ? API : null;
    P.actif = true;
    lireRondelle();
  }

  async function desinstaller() {
    P.actif = false;
    hockey.match = null;
    hockey.entrainement = null;
    if (hockey.porteur === 'eric') hockey.perdre();
    hockey.porteur = null;
    hockey.viderGardiens();
    for (const p of P.pnjs) gestionPnj.retirer(p);
    P.pnjs = [];
    for (const p of P.masques) montrer(p);
    P.masques = [];
    if (P.entraineurDeplace && !P.pnjs.includes(P.entraineurDeplace.pnj)) {
      const c = P.entraineurDeplace.pnj;
      const m = jeu.zone?.pnj?.find((x) => x.donnees?.role === c.role || x.id === `NPC_${c.id}`);
      if (m) { c.position.copy(m.position); const t = c.corps.translation(); c.corps.setTranslation({ x: m.position.x, y: t.y, z: m.position.z }, true); }
      c.muet = false;
    }
    P.entraineurDeplace = null;
    P.entraineur = null;
    sortirRondelles();
    hockey.preparerGardiens();
    if (jeu.joueur?.mode === 'assis') {
      if (P.spectateur) jeu.joueur.lever();
      else { jeu.joueur.mode = 'libre'; jeu.joueur.placer(retourBanc('carabins'), jeu.joueur.lacet); }
    }
    ERIC.banc = false;
    if (P.cameraTele) { P.cameraTele = false; cam.suivi(jeu.joueur); }
    P.spectateur = false;
    await equiperEric(false);
    foule?.retirer();
    bus.emit('hockey:etat', null);
    bus.emit('exercice', null);
  }

  // ---------- match ----------
  async function lancerMatch(params = {}) {
    if (P.actif) await desinstaller();
    const parametres = {
      periodes: 3, dureePeriode: 180, entracte: 8, prolongation: true, penalites: 1,
      ...params,
    };
    if (params.duree_periode != null) parametres.dureePeriode = Number(params.duree_periode);
    if (params.duree_min != null && params.duree_periode == null) parametres.dureePeriode = (Number(params.duree_min) * 60) / parametres.periodes;
    const q = new URLSearchParams(location.search);
    if (q.has('periode')) parametres.dureePeriode = Number(q.get('periode')) || parametres.dureePeriode;
    P.params = parametres;
    P.dureePenalite = params.duree_penalite ?? Math.max(20, Math.round(120 * parametres.dureePeriode / 1200));
    P.regles = { horsJeu: params.hors_jeu !== false, penalites: params.penalites !== 0 && params.penalites !== false, mises: true };
    await installer({ mode: 'match', config: params.config || 'carabins' });
    foule?.installer(jeu.zone, { nombre: params.spectateurs ?? P.config.spectateurs ?? 340, couleursLocales: P.config.couleursFoule || null, couleursVisiteurs: P.config.couleursFouleVisiteurs || null });
    audio.themeMusical(null);
    P.comportement = null;
    P.surPasse = P.surPossession = P.surTir = P.surVol = P.surArret = P.surDegagement = null;
    P.periode = 0;
    P.etat = 'scene';
    const fin = new Promise((ok) => { P.resoudre = ok; });
    preparerMiseAuJeu({ u: 0, v: 0 });
    P.etat = 'scene';
    for (const id of P.config.scenes?.avant || []) await scene(id);
    P.etat = 'arret';
    debutPeriode(1);
    majObjectifs();
    return fin;
  }

  function terminerMatch() {
    const C = P.equipes.carabins, V = P.equipes.visiteurs;
    const victoire = C.score > V.score;
    const p = P.params;
    const objectifs = p.objectifPasses != null || p.objectifTirs != null;
    const reussi = objectifs ? (P.objectifsAtteints || victoire) : victoire;
    const details = [
      { titre: `${victoire ? 'Victoire' : C.score === V.score ? 'Match nul' : 'Défaite'} · CARABINS ${C.score} – ${V.score} VISITEURS`, reussi: victoire },
      { titre: `Tirs au but · ${C.tirs} – ${V.tirs}`, reussi: C.tirs >= V.tirs },
      { titre: `Buts d’Éric : ${P.stats.buts} · aides : ${P.stats.aides}`, reussi: P.stats.buts + P.stats.aides > 0 },
      { titre: `Passes réussies : ${P.stats.passes} sur ${P.stats.passesTentees}`, reussi: P.stats.passes >= Math.max(1, P.stats.passesTentees * 0.5) },
      { titre: `Tirs cadrés d’Éric : ${P.stats.tirs}`, reussi: P.stats.tirs > 0 },
    ];
    if (objectifs) details.push({ titre: `Objectif · ${P.stats.passes}/${p.objectifPasses ?? 0} passes, ${P.stats.tirs}/${p.objectifTirs ?? 0} tirs cadrés`, reussi: !!P.objectifsAtteints });
    const bilan = { reussi, score: { carabins: C.score, visiteurs: V.score }, tirs: { carabins: C.tirs, visiteurs: V.tirs }, stats: { ...P.stats }, details };
    bus.emit('match:fin', bilan);
    const r = P.resoudre;
    P.resoudre = null;
    P.etat = 'conclusion';
    const sc = P.config.scenes || {};
    if (P.spectateur) {
      dire([victoire ? (P.config.fin?.victoire || 'bell_victoire') : (P.config.fin?.defaite || 'bell_defaite')], { canal: 'annonce', priorite: 2, roles: ROLES_ANNONCEUR, position: null });
      bilan.details = bilan.details.filter((d) => !/Éric|Passes/.test(d.titre));
      bilan.details[0].titre = `${victoire ? 'Victoire' : C.score === V.score ? 'Match nul' : 'Défaite'} · ${C.nom} ${C.score} – ${V.score} ${V.nom}`;
      bilan.reussi = true;
    }
    const apres = async () => {
      await scene(victoire ? sc.victoire : sc.defaite);
      if (P.spectateur) {
        await scene('bell_stats');
        const def = defiStatistiques();
        if (def && jeu.defi) { const r2 = await jeu.defi(def); bilan.details.push({ titre: def.titre, reussi: !!r2?.reussi, score: r2?.score }); }
        await scene(sc.apres);
      }
    };
    apres().then(() => desinstaller()).then(() => r?.(bilan));
  }

  // ---------- mini-défi de statistiques (spectateur) ----------
  function defiStatistiques() {
    const C = P.equipes.carabins, V = P.equipes.visiteurs;
    const tirsV = V.tirs, butsV = V.score;
    if (tirsV < 2) return null;
    const fmt = (x) => `${String(Math.round(x * 10) / 10).replace('.', ',')} %`;
    const pct = ((tirsV - butsV) / tirsV) * 100;
    const candidats = [(butsV / tirsV) * 100, ((C.tirs - C.score) / Math.max(1, C.tirs)) * 100, Math.max(0, Math.min(100, pct + (Math.random() < 0.5 ? 7.5 : -7.5))), (tirsV / Math.max(1, tirsV + C.tirs)) * 100];
    const options = [{ texte: fmt(pct), correct: 1, retour: `Oui : ${tirsV - butsV} arrêts sur ${tirsV} tirs. Le pourcentage d’arrêts divise les arrêts par les tirs reçus.` }];
    for (const f of candidats) {
      if (options.length >= 4 || options.some((o) => o.texte === fmt(f))) continue;
      options.push({ texte: fmt(f), correct: 0, retour: 'Non. Le pourcentage d’arrêts, c’est le nombre d’arrêts divisé par le nombre de tirs reçus par ce gardien.' });
    }
    options.sort(() => Math.random() - 0.5);
    return {
      id: 'bell_stats_match', type: 'choix', titre: 'Les chiffres du match',
      consigne: `Calcule le pourcentage d’arrêts du gardien des ${C.nom === 'CANADIENS' ? 'Canadiens' : C.nom}.`,
      situation: `${V.nom} : ${tirsV} tirs au but, ${butsV} but${butsV > 1 ? 's' : ''}. ${C.nom} : ${C.tirs} tirs, ${C.score} but${C.score > 1 ? 's' : ''}.`,
      options, reussite: 1, references: [],
      retour: { succes: 'Bon calcul : un ratio, un numérateur, un dénominateur, et aucun tir oublié.', echec: 'Reprends le dénominateur : tous les tirs reçus, y compris ceux qui ont fait but.' },
    };
  }

  // ---------- entraînement d'équipe ----------
  const EXERCICES = {
    passes_deux: { titre: 'Passes à deux', consigne: 'Remonte la glace avec Bruno en vous passant la rondelle (E). Vise devant lui, pas dans ses patins.', cle: 'entraineur_exercice_passes_deux', repli: 'entraineur_conseil_passe' },
    tirs_gardien: { titre: 'Tirs sur le gardien', consigne: 'Reçois la passe, puis lance : clic bref pour le poignet, clic tenu pour le frappé.', cle: 'entraineur_exercice_tirs', repli: 'entraineur_conseil_lancer' },
    deux_contre_un: { titre: 'Deux contre un', consigne: 'Attaque avec Bruno contre un défenseur. Attire-le, puis passe (E) ou lance.', cle: 'entraineur_exercice_deux_contre_un', repli: 'entraineur_conseil_partie' },
    avantage_numerique: { titre: 'Avantage numérique', consigne: 'Cinq contre quatre en zone adverse : fais circuler la rondelle et trouve l’ouverture. R pour demander la passe.', cle: 'entraineur_exercice_avantage', repli: 'entraineur_conseil_partie' },
  };

  function pnjEquipe(id) { return P.patineurs.find((s) => s.id === id); }

  function regrouperEntrainement(actifs) {
    // tous les patineurs non actifs tournent autour de la patinoire
    const C = P.equipes.carabins;
    for (const s of P.patineurs) {
      if (s.estEric) continue;
      s.horsJeuExercice = !actifs.includes(s);
      s.tour = s.horsJeuExercice ? { k: Math.floor(Math.random() * 4), sens: Math.random() < 0.5 ? 1 : -1 } : null;
    }
    C.glace = actifs.filter((s) => s.equipe === 'carabins');
    const V = P.equipes.visiteurs;
    if (V) V.glace = actifs.filter((s) => s.equipe === 'visiteurs');
  }

  function patinerEnRond(s, dt) {
    const coins = [[-G.butX + 9, -G.W + 3.5], [G.butX - 9, -G.W + 3.5], [G.butX - 9, G.W - 3.5], [-G.butX + 9, G.W - 3.5]];
    const [u, v] = coins[s.tour.k];
    monde(u, v, s.cible);
    if (s.pos.distanceTo(s.cible) < 3) s.tour.k = (s.tour.k + (s.tour.sens > 0 ? 1 : 3)) % 4;
    s.vmax = 4.5;
    s.regardRondelle = false;
    piloter(s, dt);
  }

  async function lancerEntrainement(params = {}) {
    if (P.actif) await desinstaller();
    const liste = params.exercices || ['passes_deux', 'tirs_gardien', 'deux_contre_un', 'avantage_numerique'];
    P.params = { ...params };
    P.regles = { horsJeu: false, penalites: false, mises: false };
    await installer({ mode: 'entrainement', equipesVoulues: ['carabins'] });
    // à l'entraînement, tout le monde porte le bleu : l'opposition vient des Carabins
    const V = P.equipes.visiteurs;
    if (V) V.nom = 'CARABINS';
    audio.themeMusical('arena', { immediat: false });
    if (dialogues?.scene?.('entrainement_debut')) await scene('entrainement_debut');
    else { entraineurDit(['entraineur_entrainement_debut', 'entraineur_conseil_partie'], 2); await new Promise((ok) => setTimeout(ok, 2500)); }
    const resultats = [];
    for (const id of liste) {
      if (!P.actif) break;
      const r = await exercice(id, params[id] || {});
      resultats.push({ titre: EXERCICES[id]?.titre || id, reussi: r.reussi, score: r.score });
    }
    if (dialogues?.scene?.('entrainement_fin')) await scene('entrainement_fin');
    else { entraineurDit(['entraineur_entrainement_fin', 'entraineur_bravo'], 2); await new Promise((ok) => setTimeout(ok, 1500)); }
    await desinstaller();
    return { reussi: resultats.every((r) => r.reussi), details: resultats };
  }

  function exercice(id, opts = {}) {
    const def = EXERCICES[id];
    if (!def || !P.actif) return Promise.resolve({ reussi: true, score: 1 });
    return new Promise((fini) => {
      const C = P.equipes.carabins, V = P.equipes.visiteurs;
      const j = jeu.joueur;
      const ex = { id, compteur: 0, essais: 0, temps: 0, etat: 'en_cours', phase: 'pret', minuterie: 1.5, conseil: 20 };
      const terminer = (reussi) => {
        if (ex.etat !== 'en_cours') return;
        ex.etat = reussi ? 'reussi' : 'rate';
        bus.emit('exercice', { type: 'entrainement', titre: def.titre, consigne: def.consigne, progression: reussi ? 1 : ex.progression, texte: ex.texte, etat: ex.etat });
        entraineurDit(reussi ? ['entraineur_entrainement_bravo', 'entraineur_bravo'] : ['entraineur_entrainement_encore', 'entraineur_encore'], 2);
        if (reussi) audio.jouer('ui_succes');
        P.boucleEntrainement = null;
        P.surButEntrainement = null;
        P.surPasse = P.surPossession = P.surTir = P.surArret = P.surSortie = P.comportement = null;
        if (hockey.porteur === 'eric') hockey.perdre();
        if (P.porteurAI) perdreAI(P.porteurAI);
        setTimeout(() => fini({ reussi, score: ex.score ?? (reussi ? 1 : 0) }), 2200);
      };
      const publier = () => bus.emit('exercice', { type: 'entrainement', titre: def.titre, consigne: def.consigne, progression: ex.progression || 0, texte: ex.texte || '' });
      const nettoyer = () => { P.passe = null; P.tir = null; P.touches = []; if (P.porteurAI) perdreAI(P.porteurAI); if (hockey.porteur === 'eric') hockey.perdre(); };
      C.sens = 1;
      if (V) V.sens = -1;
      const gC = C.gardien;
      if (gC) { hockey.orienterGardien(gC, 'est'); gC.pnj.position.copy(gC.cible); gC.corps.setTranslation({ x: gC.cible.x, y: 0.42, z: gC.cible.z }, true); }
      if (V?.gardien) { hockey.orienterGardien(V.gardien, 'ouest'); V.gardien.pnj.position.copy(V.gardien.cible); V.gardien.corps.setTranslation({ x: V.gardien.cible.x, y: 0.42, z: V.gardien.cible.z }, true); }
      entraineurDit([def.cle, def.repli], 2);
      toast(`${def.titre} · ${def.consigne}`, 'aide', 6);
      const bruno = pnjEquipe('carabins_1'), passeur = pnjEquipe('carabins_2'), defenseur = pnjEquipe('carabins_3');
      if (id === 'passes_deux') {
        const objectif = opts.passes ?? 8, tempsMax = opts.temps ?? 120;
        regrouperEntrainement([ERIC, bruno].filter(Boolean));
        bruno.poste = 'AG';
        j.placer(pointEquipe(C, -G.butX + 7, 3), Math.atan2(G.axe.x, G.axe.z));
        bruno.pos.copy(pointEquipe(C, -G.butX + 7, -3.5));
        placerRondelle(v1.copy(j.position).addScaledVector(j.avant(), 0.9));
        P.R.horsJeu = false;
        P.surPasse = (de, vers, ok) => { if (ok && de.estEric && vers === bruno) { ex.compteur++; audio.jouer('ui_clic', { volume: 0.5 }); if (ex.compteur === Math.ceil(objectif / 2)) entraineurDit(['entraineur_entrainement_conseil', 'entraineur_conseil_passe'], 0); } };
        P.boucleEntrainement = (dt) => {
          ex.temps += dt;
          const eu = uEquipe(C, j.position);
          let chasse = false;
          if (P.porteurAI === bruno) {
            porter(bruno);
            if (P.temps - bruno.depuis > 0.8) passer(bruno, ERIC);
          } else if (!porteur() && (!P.passe || P.passe.vers === bruno || P.passe.t > 1.2)) {
            if (P.passe?.vers === bruno || bruno.pos.distanceTo(P.rp) < j.position.distanceTo(P.rp)) {
              chasse = true;
              bruno.cible.copy(P.rp).addScaledVector(v2.set(P.rv.x, 0, P.rv.z), 0.3);
              essayerPrendre(bruno);
            }
          }
          if (!chasse && P.porteurAI !== bruno) {
            const vers = v3.set(j.vitesse.x, 0, j.vitesse.z);
            const lat = vEquipe(C, j.position) > 0 ? -6 : 6;
            pointEquipe(C, eu + 1.5 + (vers.length() > 1 ? 2 : 0), vEquipe(C, j.position) + lat, bruno.cible);
          }
          bruno.vmax = 7;
          bruno.regardRondelle = true;
          piloter(bruno, dt);
          if (P.R && P.rp.distanceTo(j.position) > 16 && bruno.pos.distanceTo(P.rp) > 16) placerRondelle(v1.copy(j.position).addScaledVector(j.avant(), 0.9));
          for (const s of P.patineurs) if (s.horsJeuExercice) patinerEnRond(s, dt);
          ex.progression = Math.min(1, ex.compteur / objectif);
          ex.texte = `${ex.compteur} / ${objectif} passes reçues par Bruno · ${Math.max(0, tempsMax - ex.temps).toFixed(0)} s`;
          if (ex.compteur >= objectif) { ex.score = 1; terminer(true); } else if (ex.temps > tempsMax) { ex.score = ex.compteur / objectif; terminer(false); }
        };
      } else if (id === 'tirs_gardien') {
        const objectif = opts.buts ?? 3, tirsMax = opts.tirs ?? 10;
        regrouperEntrainement([ERIC, passeur].filter(Boolean));
        passeur.poste = 'AG';
        j.placer(pointEquipe(C, G.bleue + 2, 4), Math.atan2(G.axe.x, G.axe.z));
        passeur.pos.copy(pointEquipe(C, G.butX - 4, -(G.W - 3.5)));
        ex.phase = 'passe';
        ex.minuterie = 1.5;
        P.R.horsJeu = false;
        P.surTir = (s) => { if (s.estEric) { ex.essais++; ex.phase = 'tir'; ex.minuterie = 2.6; } };
        P.surButEntrainement = (cote) => { if (cote === 'est' && P.dernier?.estEric && ex.phase === 'tir') { ex.compteur++; ex.phase = 'but'; ex.minuterie = 2.2; audio.jouer('sirene_but', { volume: 0.4 }); bus.emit('hockey:but', { pourEric: true, equipe: 'CARABINS', texte: 'Entraînement · n° 15 Bernier' }); if (Math.random() < 0.6) equipeDit(C, ['coequipier_entrainement', 'hockey_but_eric'], 0, passeur); } };
        P.surArret = () => { if (Math.random() < 0.5) entraineurDit(['entraineur_entrainement_conseil', 'entraineur_conseil_lancer'], 0); };
        P.boucleEntrainement = (dt) => {
          ex.temps += dt;
          ex.minuterie -= dt;
          pointEquipe(C, G.butX - 4, -(G.W - 3.5), passeur.cible);
          if (ex.phase === 'passe') {
            if (P.porteurAI !== passeur) {
              if (ex.minuterie <= 0) { nettoyer(); placerRondelle(lameDe(passeur, v1)); prendre(passeur); ex.minuterie = 1.0; ex.phase = 'attente'; }
            }
          } else if (ex.phase === 'attente') {
            porter(passeur);
            if (ex.minuterie <= 0) { passer(passeur, ERIC); ex.phase = 'recu'; ex.minuterie = 6; }
          } else if (ex.phase === 'recu') {
            if (ex.minuterie <= 0) { ex.phase = 'passe'; ex.minuterie = 0.5; }
          } else if (ex.minuterie <= 0) {
            if (ex.compteur >= objectif) { ex.score = 1; terminer(true); return; }
            if (ex.essais >= tirsMax) { ex.score = ex.compteur / objectif; terminer(false); return; }
            ex.phase = 'passe';
            ex.minuterie = 0.4;
          }
          piloter(passeur, dt);
          for (const s of P.patineurs) if (s.horsJeuExercice) patinerEnRond(s, dt);
          ex.progression = Math.min(1, ex.compteur / objectif);
          ex.texte = `${ex.compteur} / ${objectif} buts · ${ex.essais}/${tirsMax} tirs`;
          if (ex.temps > (opts.temps ?? 150) && ex.etat === 'en_cours') { ex.score = ex.compteur / objectif; terminer(false); }
        };
      } else if (id === 'deux_contre_un' || id === 'avantage_numerique') {
        const an = id === 'avantage_numerique';
        const objectif = opts.buts ?? (an ? 1 : 2), essaisMax = opts.essais ?? (an ? 3 : 5), dureeEssai = an ? 40 : 14;
        let attaquants, defenseurs;
        if (an) {
          attaquants = ['carabins_1', 'carabins_2', 'carabins_3', 'carabins_4'].map(pnjEquipe).filter(Boolean);
          defenseurs = ['carabins_5', 'carabins_6', 'carabins_7', 'carabins_8'].map(pnjEquipe).filter(Boolean);
        } else {
          attaquants = [bruno].filter(Boolean);
          defenseurs = [defenseur].filter(Boolean);
        }
        const postesA = an ? ['C', 'AG', 'DG', 'DD'] : ['AG'];
        attaquants.forEach((s, k) => { s.poste = postesA[k]; s.equipe = 'carabins'; });
        const postesD = an ? ['C', 'AG', 'DG', 'DD'] : ['DD'];
        // l'opposition joue pour l'autre camp le temps de l'exercice
        defenseurs.forEach((s, k) => { s.poste = postesD[k]; s.equipeAvant = s.equipeAvant || s.equipe; s.equipe = 'visiteurs'; });
        if (V) V.tous = [...V.tous.filter((x) => !defenseurs.includes(x)), ...defenseurs];
        regrouperEntrainement([ERIC, ...attaquants, ...defenseurs]);
        const mettreEnPlace = () => {
          nettoyer();
          ex.phase = 'jeu';
          ex.essaiT = 0;
          ex.entre = false;
          if (an) {
            const pos = positionsMiseAuJeu(C, G.butX - 6.1, -6.7);
            j.placer(pointEquipe(C, pos.AD[0] + 2, pos.AD[1]), Math.atan2(G.axe.x, G.axe.z));
            attaquants.forEach((s) => { const [ut, vt] = pos[s.poste]; pointEquipe(C, ut + (s.poste[0] === 'D' ? 4 : 1), vt, s.pos); s.vel.set(0, 0, 0); });
            defenseurs.forEach((s) => { const [ut, vt] = positionsMiseAuJeu(V, -(G.butX - 6.1), 6.7)[s.poste]; pointEquipe(V, ut + 1, vt, s.pos); s.vel.set(0, 0, 0); });
            const d = attaquants.find((s) => s.poste === 'DG') || attaquants[0];
            placerRondelle(lameDe(d, v1));
            prendre(d);
          } else {
            j.placer(pointEquipe(C, -2, 3.5), Math.atan2(G.axe.x, G.axe.z));
            attaquants.forEach((s) => { pointEquipe(C, -2, -4, s.pos); s.vel.set(0, 0, 0); });
            defenseurs.forEach((s) => { pointEquipe(C, G.bleue + 4, 0, s.pos); s.vel.set(0, 0, 0); s.lacet = Math.atan2(-G.axe.x, -G.axe.z); });
            placerRondelle(v1.copy(j.position).addScaledVector(j.avant(), 0.9));
          }
          P.R.horsJeu = false;
          ex.essais++;
        };
        mettreEnPlace();
        P.comportement = (s) => (s.equipe === 'visiteurs' ? 'degager' : null);
        P.surButEntrainement = (cote) => {
          if (ex.phase !== 'jeu' || cote !== 'est') return;
          if (P.dernier?.equipe !== 'carabins') return;
          ex.compteur++;
          ex.phase = 'fin_essai';
          ex.minuterie = 2.4;
          audio.jouer('sirene_but', { volume: 0.4 });
          bus.emit('hockey:but', { pourEric: true, equipe: 'CARABINS', texte: P.dernier?.estEric ? 'Entraînement · n° 15 Bernier' : `Entraînement · n° ${P.dernier?.numero ?? ''}` });
          if (P.dernier?.estEric) equipeDit(C, ['coequipier_entrainement', 'hockey_but_eric'], 0);
        };
        P.boucleEntrainement = (dt) => {
          ex.temps += dt;
          if (ex.phase === 'jeu') {
            ex.essaiT += dt;
            const pu = uEquipe(C, P.rp);
            if (pu > G.bleue) ex.entre = true;
            const prt = porteur();
            const perdu = (prt && prt.equipe === 'visiteurs') || (ex.entre && pu < G.bleue - 1.5) || ex.essaiT > dureeEssai || (P.R.horsJeu);
            if (perdu) {
              ex.phase = 'fin_essai';
              ex.minuterie = 1.8;
              siffler(null);
              if (Math.random() < 0.6) entraineurDit(['entraineur_entrainement_conseil', def.repli], 0);
            }
            if (!prt && !P.R.horsJeu) {
              const cands = [...attaquants, ...defenseurs].sort((a, b) => a.pos.distanceTo(P.rp) - b.pos.distanceTo(P.rp));
              for (const s of cands.slice(0, 3)) if (essayerPrendre(s)) break;
            }
            calculerMarquage();
            for (const s of [...attaquants, ...defenseurs]) {
              s.recup = Math.max(0, s.recup - dt);
              s.decision -= dt;
              if (s.decision <= 0) { s.decision = alea(0.2, 0.34); decider(s); }
              if (s === P.porteurAI) porter(s);
              piloter(s, dt);
            }
            contacts(dt);
            suivreTir(dt);
          } else {
            ex.minuterie -= dt;
            for (const s of [...attaquants, ...defenseurs]) { s.vmax = 3; piloter(s, dt); }
            if (ex.minuterie <= 0) {
              if (ex.compteur >= objectif) { ex.score = 1; terminer(true); }
              else if (ex.essais >= essaisMax) { ex.score = ex.compteur / objectif; terminer(false); }
              else mettreEnPlace();
            }
          }
          for (const s of P.patineurs) if (s.horsJeuExercice) patinerEnRond(s, dt);
          ex.progression = Math.min(1, ex.compteur / objectif);
          ex.texte = `${ex.compteur} / ${objectif} buts · essai ${Math.min(ex.essais, essaisMax)}/${essaisMax}${ex.phase === 'jeu' ? ` · ${Math.max(0, dureeEssai - ex.essaiT).toFixed(0)} s` : ''}`;
        };
      }
      // conseils réguliers et affichage
      const boucle = P.boucleEntrainement;
      P.boucleEntrainement = (dt, ent) => {
        if (ex.etat !== 'en_cours') return;
        for (const s of P.patineurs) if (!s.estEric) s.recup = Math.max(0, (s.recup || 0) - dt);
        boucle(dt, ent);
        ex.conseil -= dt;
        if (ex.conseil <= 0) { ex.conseil = alea(18, 28); if (Math.random() < 0.5) entraineurDit(['entraineur_entrainement_conseil', def.repli], 0); else equipeDit(C, ['coequipier_entrainement'], 0); }
        ex.acc = (ex.acc || 0) + dt;
        if (ex.acc > 0.15) { ex.acc = 0; publier(); }
        if (ex.etat !== 'en_cours') {
          for (const s of P.patineurs) if (s.equipeAvant) { s.equipe = s.equipeAvant; s.equipeAvant = null; }
          if (V) V.tous = V.tous.filter((x) => x.equipe === 'visiteurs');
        }
      };
      publier();
    });
  }

  const API = {
    get actif() { return P.actif; },
    get etat() { return P.etat; },
    get P() { return P; },
    mettreAJour, surBut, surSortie, surGel, ericPeutPrendre, surPossessionEric, surPasseEric, surTirEric, coequipiersEric, harponner,
  };

  return {
    lancerMatch, lancerEntrainement, arreter: desinstaller,
    get actif() { return P.actif; },
    get etat() { return P.etat; },
    get P() { return P; },
    API,
  };
}
