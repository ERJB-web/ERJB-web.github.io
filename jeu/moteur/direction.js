import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=0a63877699';

const SEUIL_APPARITION = 30;
const FILTRE_VUE = groupes(0xffff, GROUPES.STATIQUE | GROUPES.PORTE);

export function creerDirection({ pnj, physique, audio, bus, jeu, dialogues }) {
  const d = {
    actives: [],
    statut: 'absente', // absente | traque | cherche | repart | rencontre
    vuDepuis: 0,
    perduDepuis: 0,
    derniereVue: new THREE.Vector3(),
    repath: 0,
    replique: 6,
    coeur: 0,
    attente: 0,
    zone: null,
    pause: false,
    indexReplique: 0,
  };

  function vitesse() {
    const p = Math.max(0, jeu.etat.pression - SEUIL_APPARITION) / (100 - SEUIL_APPARITION);
    return 1.45 + p * 1.75;
  }

  async function apparaitre() {
    const z = d.zone;
    const sp = z?.spawns?.SPAWN_direction;
    if (!sp || d.actives.length) return;
    d.statut = 'traque';
    const decal = new THREE.Vector3(0.9, 0, 0.4).applyQuaternion(sp.quaternion);
    const a = await pnj.ajouter({ role: 'direction_a', id: 'direction_a', position: sp.position.clone(), quaternion: sp.quaternion, mobile: true });
    const b = await pnj.ajouter({ role: 'direction_b', id: 'direction_b', position: sp.position.clone().add(decal), quaternion: sp.quaternion, mobile: true });
    d.actives = [a, b];
    d.replique = 4;
    bus.emit('direction:apparition', { zone: z.id });
    setTimeout(() => dialogues.repliqueAuHasard('direction_apparition', {}), 1200);
  }

  function disparaitre() {
    for (const p of d.actives) pnj.retirer(p);
    d.actives = [];
    d.statut = 'absente';
    audio.tension(0);
    bus.emit('direction', { distance: Infinity, visible: false, statut: 'absente' });
  }

  const tete = new THREE.Vector3(), dir = new THREE.Vector3();
  function voit(p, joueur) {
    tete.copy(p.position); tete.y += 1.6;
    const cible = joueur.tete();
    dir.subVectors(cible, tete);
    const dist = dir.length();
    if (dist > 30) return false;
    dir.normalize();
    const hit = physique.lancerRayon(tete, dir, dist, FILTRE_VUE);
    return !hit || hit.distance > dist - 0.4;
  }

  function repliqueSuivante(joueur, distance) {
    const palier = jeu.etat.pression >= 75 ? 3 : jeu.etat.pression >= 50 ? 2 : 1;
    const r = dialogues.repliqueAuHasard('direction_poursuite', { palier, pnj: null, distance, filtreQui: d.actives.map((p) => p.role) });
    void r; void joueur;
  }

  function mettreAJour(dt, joueur) {
    if (!joueur || d.pause) return;
    if (jeu.modeSalle) return;
    if (d.statut === 'absente') {
      if (jeu.etat.pression >= SEUIL_APPARITION && d.zone?.spawns?.SPAWN_direction && d.attente <= 0 && joueur.mode === 'libre') apparaitre();
      d.attente -= dt;
      return;
    }
    const [a, b] = d.actives;
    if (!a) return;
    const distance = Math.min(...d.actives.map((p) => p.position.distanceTo(joueur.position)));
    const vue = voit(a, joueur) || (b && voit(b, joueur));
    if (vue) { d.derniereVue.copy(joueur.position); d.perduDepuis = 0; d.vuDepuis += dt; }
    else { d.perduDepuis += dt; d.vuDepuis = 0; }

    if (d.statut === 'traque' || d.statut === 'cherche') {
      d.repath -= dt;
      if (d.repath <= 0) {
        d.repath = 0.6;
        const cible = d.statut === 'traque' ? joueur.position : d.derniereVue;
        pnj.allerVers(a, cible, { vitesse: vitesse(), anim: 'walk_fast' });
        if (b) {
          const lateral = new THREE.Vector3().subVectors(cible, a.position).setY(0).normalize();
          const cote = new THREE.Vector3(-lateral.z, 0, lateral.x).multiplyScalar(0.9);
          pnj.allerVers(b, cible.clone().add(cote), { vitesse: vitesse() * 0.97, anim: 'walk_fast' });
        }
      }
      if (d.statut === 'traque' && !vue && d.perduDepuis > 5 && distance > 9) d.statut = 'cherche';
      if (d.statut === 'cherche' && vue) d.statut = 'traque';
      if (d.statut === 'cherche' && a.position.distanceTo(d.derniereVue) < 1.5 && d.perduDepuis > 12) {
        d.statut = 'repart';
        jeu.etat.pression = Math.max(0, jeu.etat.pression - 4);
        bus.emit('direction:perdu');
        dialogues.repliqueAuHasard('direction_perdue', {});
        const sp = d.zone.spawns.SPAWN_direction;
        pnj.allerVers(a, sp.position, { vitesse: 1.3, anim: 'walk', fin: () => disparaitre() });
        if (b) pnj.allerVers(b, sp.position, { vitesse: 1.3, anim: 'walk' });
        d.attente = 75;
      }
      d.replique -= dt;
      if (d.replique <= 0 && distance < 22) { d.replique = 7 + Math.random() * 7; repliqueSuivante(joueur, distance); }
      if (distance < 1.35 && vue && joueur.mode === 'libre') {
        d.statut = 'rencontre';
        for (const p of d.actives) { p.comportement = 'statique'; p.chemin = null; pnj.orienterVers(p, joueur.position); }
        audio.tension(0);
        bus.emit('direction:rattrape', { suivi: jeu.etat.suivis + 1 });
      }
    }
    if (d.statut === 'traque' || d.statut === 'cherche') {
      const niveau = THREE.MathUtils.clamp(1 - (distance - 2) / 20, 0, 1) * (vue ? 1 : 0.6);
      audio.tension(niveau);
      d.coeur -= dt;
      if (distance < 9 && d.coeur <= 0) {
        d.coeur = 0.35 + (distance / 9) * 0.6;
        audio.jouer('coeur', { volume: 0.25 + (1 - distance / 9) * 0.55 });
      }
    }
    bus.emit('direction', { distance, visible: vue, statut: d.statut, positions: d.actives.map((p) => p.position) });
  }

  function relacher(issue) {
    const sp = d.zone?.spawns?.SPAWN_direction;
    d.statut = 'repart';
    d.attente = issue === 'succes' ? 120 : 45;
    for (const p of d.actives) {
      if (sp) pnj.allerVers(p, sp.position, { vitesse: 1.25, anim: 'walk', fin: () => { if (p === d.actives[0]) disparaitre(); } });
    }
    if (!sp) disparaitre();
  }

  function changerZone(zone) {
    d.actives = [];
    d.statut = 'absente';
    d.zone = zone;
    d.attente = 20;
  }

  return Object.assign(d, { mettreAJour, relacher, changerZone, disparaitre, apparaitre });
}
