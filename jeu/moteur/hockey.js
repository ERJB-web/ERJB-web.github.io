import * as THREE from 'three';
import { GROUPES, groupes } from './physique.js?v=c7ebb6024c';

const H_RONDELLE = 0.0127;
const EXERCICES = {
  equilibre: { titre: 'Équilibre', consigne: 'Glisse sans tomber. Corrige ton déséquilibre en tournant doucement du côté où tu penches.', defaut: { duree: 8 } },
  poussee: { titre: 'Poussée', consigne: 'Pousse avec les lames, une jambe puis l’autre, jusqu’à prendre de la vitesse.', defaut: { vitesse: 4 } },
  glisse: { titre: 'Glisse', consigne: 'Prends de l’élan, puis lâche tout et laisse-toi glisser le plus loin possible.', defaut: { distance: 10 } },
  arret: { titre: 'Arrêt', consigne: 'Prends de la vitesse, puis freine net (Espace) : lames en travers, genoux fléchis.', defaut: { vitesse: 3.5, repetitions: 3 } },
  croisement: { titre: 'Croisements', consigne: 'Fais le tour du cercle de cônes en croisant les patins dans le virage.', defaut: { tours: 2, temps: 50 } },
  recul: { titre: 'À reculons', consigne: 'Patine vers l’arrière : tire vers toi, regarde par-dessus l’épaule.', defaut: { distance: 8 } },
  maniement: { titre: 'Maniement de rondelle', consigne: 'Garde la rondelle sur ta palette et contourne les cônes sans la perdre.', defaut: { distance: 25 } },
  passe: { titre: 'Passes', consigne: 'Fais des passes à l’entraîneur (E). Vise sa palette, pas ses patins.', defaut: { passes: 5 } },
  lancer: { titre: 'Lancers', consigne: 'Maintiens le clic pour charger, relâche pour lancer. Vise les coins, le gardien couvre le centre.', defaut: { buts: 3 } },
  partie: { titre: 'Partie amicale', consigne: 'Trois contre trois. Premier à trois buts. Passe la rondelle : un réseau, ce sont des passes.', defaut: { buts: 3, duree: 360 } },
};

export function creerHockey({ bus, physique, objets, jeu, audio, dialogues, gestionPnj, cam }) {
  const { RAPIER, monde } = physique;
  const h = {
    actif: false, baton: null, lame: new THREE.Vector3(), possession: null, porteur: null,
    charge: 0, charge_debut: 0, refroidi: 0, exercice: null, partie: null,
    gardiens: [], patineurs: [], buts: [], rondelles: [], temps: 0, dernierToucheur: null,
  };
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

  function rondellesZone() {
    return objets.dynamiques.filter((d) => d.rondelle);
  }

  function creerBaton() {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0x1b1f24, roughness: 0.45, metalness: 0.1 });
    const ruban = new THREE.MeshStandardMaterial({ color: 0x0b0c0e, roughness: 0.9 });
    const blanc = new THREE.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.6 });
    const manche = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.024, 1.42), mat);
    manche.position.z = -0.71;
    const bout = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.028, 0.14), blanc);
    bout.position.z = -0.05;
    const lame = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.075, 0.012), ruban);
      s.position.set(0.03 + i * 0.058, 0.034, -Math.pow(i / 4, 2) * 0.03);
      s.rotation.y = -i * 0.05;
      lame.add(s);
    }
    lame.position.z = -1.42;
    lame.rotation.x = -0.5;
    g.add(manche, bout, lame);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    g.userData.lame = lame;
    return g;
  }

  function activer(zone) {
    h.actif = !!zone && (zone.id === 'arena' || !!zone.glace);
    h.buts = (zone?.declencheurs || []).filter((t) => /^TRIGGER_but_/.test(t.id)).map((t) => ({ ...t, cote: t.id.replace('TRIGGER_but_', '') }));
    h.gardiens = [];
    h.patineurs = [];
    h.possession = null;
    h.porteur = null;
    h.exercice = null;
    h.partie = null;
    for (const d of objets.dynamiques) if (/aide_patineur/i.test(d.id)) { d.prenable = true; d.label = d.label || 'Aide-patineur'; }
    if (!h.actif) { retirerBaton(); return; }
    preparerGardiens();
  }

  function filetDe(zone, cote, pres) {
    let filet = null, dmin = Infinity;
    for (const [nom, f] of Object.entries(zone.filets || {})) {
      if (cote && !nom.toLowerCase().endsWith(`_${cote}`)) continue;
      const c = f.getWorldPosition(new THREE.Vector3());
      const d = pres ? c.distanceTo(pres) : 0;
      if (d < dmin) { dmin = d; filet = { nom, centre: c }; }
    }
    return filet;
  }

  function orienterGardien(g, cote) {
    const zone = jeu.zone;
    const filet = filetDe(zone, cote, g.pnj.position);
    if (!filet) return;
    const centreGlace = zone.glaceBoite ? zone.glaceBoite.getCenter(new THREE.Vector3()) : new THREE.Vector3();
    g.filet = filet;
    g.cote = /_est$/i.test(filet.nom) ? 'est' : 'ouest';
    g.versCentre = centreGlace.clone().sub(filet.centre).setY(0).normalize();
    g.cible.copy(filet.centre).addScaledVector(g.versCentre, 0.55);
  }

  function ajouterGardien(p, cote = null) {
    const zone = jeu.zone;
    const filet = filetDe(zone, cote, p.position);
    if (!filet) return null;
    const corps = monde.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(p.position.x, 0.4, p.position.z));
    const collider = monde.createCollider(RAPIER.ColliderDesc.cuboid(0.42, 0.4, 0.16).setRestitution(0.25).setCollisionGroups(groupes(GROUPES.PNJ, GROUPES.RONDELLE)), corps);
    p.muet = true;
    p.comportement = 'hockey';
    const g = { pnj: p, filet, cote: null, versCentre: new THREE.Vector3(1, 0, 0), corps, collider, papillon: 0, reaction: 0, cible: p.position.clone(), vitesse: 2.6, delai: 0.16 };
    h.gardiens.push(g);
    orienterGardien(g, cote || (/_est$/i.test(filet.nom) ? 'est' : 'ouest'));
    return g;
  }

  function viderGardiens() {
    for (const g of h.gardiens) {
      try { monde.removeRigidBody(g.corps); } catch { /* déjà retiré */ }
      g.pnj.comportement = 'statique';
    }
    h.gardiens = [];
  }

  function preparerGardiens() {
    for (const p of gestionPnj.liste.filter((x) => (x.role === 'gardien' || /^gardien/.test(x.id)) && !x.cache)) ajouterGardien(p);
  }

  function retirerBaton() {
    if (h.baton) { h.baton.parent?.remove(h.baton); h.baton = null; }
  }

  function equiperBaton(j) {
    if (h.baton || !j) return;
    h.baton = creerBaton();
    jeu.zone.racine.add(h.baton);
  }

  // ---------- bâton : de la main à la glace ----------
  const main = new THREE.Vector3(), haut = new THREE.Vector3(0, 1, 0);
  function placerBaton(j, dt) {
    if (!h.baton) return;
    const avant = j.avant();
    const droite = tmp2.set(avant.z, 0, -avant.x).multiplyScalar(-1);
    h.temps += dt;
    const balayage = h.possession && j.vitesseHorizontale < 6 ? Math.sin(h.temps * 7) * 0.16 : 0;
    const charge = h.charge > 0 ? h.charge : 0;
    h.lame.copy(j.position).addScaledVector(avant, 0.82 - charge * 0.35).addScaledVector(droite, 0.28 + balayage + charge * 0.25);
    h.lame.y = j.position.y + 0.02 + charge * 0.4;
    const propre = j.perso.batonPropre;
    if (propre) {
      if (!propre.userData.bout) {
        const boite = new THREE.Box3();
        propre.updateWorldMatrix(true, true);
        const inv = propre.matrixWorld.clone().invert();
        propre.traverse((o) => {
          if (!o.isMesh) return;
          o.geometry.computeBoundingBox();
          boite.union(o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)));
        });
        const t = boite.getSize(new THREE.Vector3());
        const k = t.x > t.y ? (t.x > t.z ? 'x' : 'z') : (t.y > t.z ? 'y' : 'z');
        const c = boite.getCenter(new THREE.Vector3());
        c[k] = Math.abs(boite.max[k]) > Math.abs(boite.min[k]) ? boite.max[k] : boite.min[k];
        propre.userData.bout = c;
      }
      const bout = propre.localToWorld(tmp.copy(propre.userData.bout));
      if (bout.y - j.position.y < 0.35 && charge <= 0) h.lame.set(h.lame.x * 0.4 + bout.x * 0.6, h.lame.y, h.lame.z * 0.4 + bout.z * 0.6);
      return;
    }
    if (j.perso.mainDroite) j.perso.mainDroite.getWorldPosition(main);
    else main.copy(j.position).addScaledVector(droite, 0.22).addScaledVector(avant, 0.25).setY(j.position.y + 0.95);
    h.baton.position.copy(main);
    h.baton.lookAt(h.lame);
    h.baton.up.copy(haut);
  }

  // ---------- rondelle sur la palette ----------
  function controler(j, dt, ent) {
    const pucks = rondellesZone();
    h.refroidi -= dt;
    if (!h.possession && h.refroidi <= 0 && !(h.match?.actif && !h.match.ericPeutPrendre())) {
      for (const p of pucks) {
        if (p.tenu || p.horsJeu) continue;
        const pos = p.objet.getWorldPosition(tmp);
        const v = p.corps.linvel();
        if (pos.distanceTo(h.lame) < 0.5 && Math.hypot(v.x, v.z) < 11) {
          h.possession = p;
          h.porteur = 'eric';
          j.aLaRondelle = true;
          audio.jouer3d('rondelle_poteau', pos, { volume: 0.25, hauteur: 1.6 });
          h.match?.surPossessionEric?.(p);
          h.entrainement?.surPossessionEric?.(p);
          break;
        }
      }
    }
    const p = h.possession;
    if (p && h.porteur === 'eric') {
      const pos = p.objet.getWorldPosition(tmp);
      const ecart = h.lame.clone().setY(H_RONDELLE + (jeu.zone.glaceBoite?.min.y || 0)).sub(pos);
      if (ecart.length() > 1.1) perdre();
      else {
        const vj = j.vitesse;
        p.corps.setLinvel({ x: vj.x + ecart.x * 14, y: Math.min(0, p.corps.linvel().y), z: vj.z + ecart.z * 14 }, true);
        p.corps.setAngvel({ x: 0, y: (Math.random() - 0.5) * 4, z: 0 }, true);
      }
    }
    // charge du lancer
    if (ent.tenirTir && (h.possession || prochePalette())) {
      if (h.charge === 0) h.charge = 0.01;
      h.charge = Math.min(1, h.charge + dt / 0.9);
    }
    if (ent.relacheTir && h.charge > 0) {
      lancer(j, h.charge);
      h.charge = 0;
    }
    if (!ent.tenirTir && h.charge > 0 && !ent.relacheTir) h.charge = 0;
    if (ent.presses.has('interagir') && h.possession && h.porteur === 'eric') passer(j);
    else if (ent.presses.has('interagir') && h.match?.actif) h.match.harponner();
  }

  function prochePalette() {
    for (const p of rondellesZone()) if (p.objet.getWorldPosition(tmp).distanceTo(h.lame) < 0.7) return p;
    return null;
  }

  function perdre() {
    h.possession = null;
    h.porteur = null;
    if (jeu.joueur) jeu.joueur.aLaRondelle = false;
    h.refroidi = 0.35;
  }

  function directionVisee() {
    return new THREE.Vector3(-Math.sin(cam.lacet), 0, -Math.cos(cam.lacet)).normalize();
  }

  function lancer(j, charge) {
    const p = h.possession || prochePalette();
    if (!p) return;
    const dir = directionVisee();
    const vitesse = 9 + 25 * charge * (0.6 + 0.4 * (jeu.etat.drapeaux.patinage ?? 0.3));
    const leve = charge > 0.55 ? 1.2 + 3.4 * (charge - 0.55) : 0.15;
    const imprecision = (1 - (jeu.etat.drapeaux.patinage ?? 0.3)) * 0.12;
    dir.applyAxisAngle(haut, (Math.random() - 0.5) * imprecision);
    perdre();
    h.dernierToucheur = 'eric';
    p.corps.setLinvel({ x: dir.x * vitesse, y: leve, z: dir.z * vitesse }, true);
    h.match?.surTirEric?.(p, vitesse, dir, charge);
    h.entrainement?.surTirEric?.(p, vitesse, dir, charge);
    j.jouerSpecial(charge > 0.6 ? 'skate_slap' : 'skate_shoot', 0.45);
    audio.jouer3d('rondelle_tir', p.objet.getWorldPosition(tmp), { volume: 0.5 + charge * 0.5, hauteur: 0.9 + charge * 0.25 });
    cam.secouer(charge * 0.5);
    bus.emit('hockey:tir', { vitesse, charge });
    h.tirEnVol = { rondelle: p, t: 2.5, cadre: false };
    h.exercice?.surTir?.(vitesse);
  }

  function passer(j, cible = null) {
    const p = h.possession;
    if (!p) return;
    const dir = directionVisee();
    let meilleur = cible, score = -Infinity;
    if (!meilleur) {
      const candidats = h.match?.actif ? h.match.coequipiersEric() : h.entrainement?.actif ? h.entrainement.coequipiersEric() : [...h.patineurs.filter((s) => s.equipe === 'eric'), ...gestionPnj.liste.filter((x) => x.role === 'entraineur_patin')];
      for (const c of candidats) {
        const pos = c.position || c.pnj?.position;
        const v = tmp.copy(pos).sub(j.position).setY(0);
        const d = v.length();
        if (d < 2 || d > 30) continue;
        const a = v.normalize().dot(dir);
        if (a < 0.7) continue;
        if (a * 10 - d * 0.1 > score) { score = a * 10 - d * 0.1; meilleur = c; }
      }
    }
    let vers = dir;
    if (meilleur) {
      const pos = (meilleur.position || meilleur.pnj?.position).clone();
      const vel = meilleur.vitesse instanceof THREE.Vector3 ? meilleur.vitesse : new THREE.Vector3();
      pos.addScaledVector(vel, 0.4);
      vers = pos.sub(j.position).setY(0).normalize();
    }
    perdre();
    h.dernierToucheur = 'eric';
    p.corps.setLinvel({ x: vers.x * 13, y: 0.05, z: vers.z * 13 }, true);
    h.match?.surPasseEric?.(meilleur, p);
    h.entrainement?.surPasseEric?.(meilleur, p);
    j.jouerSpecial('skate_pass', 0.4);
    audio.jouer3d('rondelle_tir', p.objet.getWorldPosition(tmp), { volume: 0.4, hauteur: 1.2 });
    bus.emit('hockey:passe', { vers: meilleur?.id || null });
    h.dernierePasseEric = performance.now();
    h.exercice?.surPasse?.();
  }

  // ---------- gardiens ----------
  function gardiens(dt) {
    const pucks = rondellesZone();
    for (const g of h.gardiens) {
      let menace = null, dmin = Infinity;
      for (const p of pucks) {
        const pos = p.objet.getWorldPosition(new THREE.Vector3());
        const d = pos.distanceTo(g.filet.centre);
        if (d < dmin) { dmin = d; menace = { p, pos }; }
      }
      const base = g.filet.centre.clone().addScaledVector(g.versCentre, 0.55);
      let cible = base.clone();
      if (menace && dmin < 25) {
        const vers = menace.pos.clone().sub(g.filet.centre).setY(0);
        const avance = THREE.MathUtils.clamp(0.55 + (25 - dmin) * 0.02, 0.55, 1.1);
        cible = g.filet.centre.clone().addScaledVector(vers.normalize(), avance);
        const v = menace.p.corps.linvel();
        const versFilet = g.filet.centre.clone().sub(menace.pos).setY(0).normalize();
        const vitesseVersFilet = v.x * versFilet.x + v.z * versFilet.z;
        if (vitesseVersFilet > 9 && dmin < 14 && g.papillon <= 0) { g.papillon = 0.7; g.pnj.perso.jouer(g.pnj.perso.possede('butterfly') ? 'butterfly' : 'skate_idle', { fondu: 0.08 }); }
      }
      g.reaction -= dt;
      if (g.reaction <= 0) { g.reaction = g.delai ?? 0.16; g.cible.copy(cible); }
      const pos = g.pnj.position;
      const dep = g.cible.clone().sub(pos).setY(0);
      const l = dep.length();
      const vmax = (g.vitesse ?? 2.6) * dt;
      if (l > vmax) dep.multiplyScalar(vmax / l);
      pos.add(dep);
      g.pnj.lacet = Math.atan2(g.versCentre.x, g.versCentre.z);
      if (g.papillon > 0 && g.papillon - dt <= 0) g.pnj.perso.jouer('skate_idle', { fondu: 0.25 });
      g.papillon -= dt;
      const bas = g.papillon > 0;
      const t = g.pnj.corps.translation();
      g.pnj.corps.setNextKinematicTranslation({ x: pos.x, y: t.y, z: pos.z });
      g.corps.setNextKinematicTranslation({ x: pos.x + g.versCentre.x * 0.15, y: bas ? 0.24 : 0.42, z: pos.z + g.versCentre.z * 0.15 });
      g.collider.setHalfExtents({ x: bas ? 0.58 : 0.42, y: bas ? 0.24 : 0.42, z: 0.16 });
      // la rondelle arrêtée près du gardien : il la bloque et la renvoie
      if (menace && dmin < 1.4) {
        const v = menace.p.corps.linvel();
        if (Math.hypot(v.x, v.z) < 1.2 && !h.possession) {
          g.gele = (g.gele || 0) + dt;
          if (g.gele > 1.2 && h.match?.actif) { g.gele = 0; h.match.surGel(g, menace.p); }
          else if (g.gele > 1.2) {
            g.gele = 0;
            const dirDegage = g.versCentre.clone().applyAxisAngle(haut, (Math.random() - 0.5) * 1.2);
            menace.p.corps.setLinvel({ x: dirDegage.x * 9, y: 0.1, z: dirDegage.z * 9 }, true);
            audio.jouer3d('rondelle_tir', menace.pos, { volume: 0.4 });
          }
        }
      }
    }
  }

  // ---------- buts ----------
  const pl = new THREE.Vector3();
  function verifierButs() {
    for (const p of rondellesZone()) {
      const pos = p.objet.getWorldPosition(tmp);
      for (const b of h.buts) {
        pl.copy(pos).applyMatrix4(b.inv);
        if (b.boite.containsPoint(pl)) {
          if (p.dansBut || performance.now() - (p.dernierBut || 0) < 4000) continue;
          p.dansBut = true;
          p.dernierBut = performance.now();
          but(b.cote, p);
        }
      }
      if (p.dansBut) {
        const dedans = h.buts.some((b) => b.boite.containsPoint(pl.copy(pos).applyMatrix4(b.inv)));
        if (!dedans) p.dansBut = false;
      }
    }
  }

  function but(cote, p) {
    if (h.possession === p) perdre();
    if (h.match?.actif) { h.match.surBut(cote, p); return; }
    if (h.entrainement?.actif && h.entrainement.surBut(cote, p)) return;
    const pourEric = h.partie ? cote === h.partie.coteAttaque : true;
    audio.jouer('sirene_but', { volume: 0.8 });
    audio.jouer('foule_acclame', { volume: 0.6 });
    audio.stinger('orgue_but', { volume: 0.6 });
    bus.emit('hockey:but', { cote, pourEric });
    if (pourEric) {
      jeu.joueur?.jouerSpecial('celebrate_hockey');
      dialogues.repliqueAuHasard('hockey_but_eric', { position: p.objet.getWorldPosition(new THREE.Vector3()) });
    } else dialogues.repliqueAuHasard('hockey_but_adverse', {});
    h.exercice?.surBut?.(pourEric);
    if (h.partie) {
      if (pourEric) h.partie.score.eric++; else h.partie.score.adverse++;
      h.partie.pause = 3;
      setTimeout(() => miseAuJeu(), 2500);
    }
  }

  function miseAuJeu() {
    const sp = jeu.zone?.spawns?.SPAWN_mise_au_jeu || jeu.zone?.spawns?.SPAWN_glace;
    const p = rondellesZone()[0];
    if (!sp || !p) return;
    p.corps.setTranslation({ x: sp.position.x, y: (jeu.zone.glaceBoite?.min.y || 0) + 0.2, z: sp.position.z }, true);
    p.corps.setLinvel({ x: 0, y: 0, z: 0 }, true);
    if (h.partie) {
      for (const s of h.patineurs) { s.position.copy(s.depart); s.vitesse.set(0, 0, 0); }
      const j = jeu.joueur;
      if (j) j.placer(sp.position.clone().addScaledVector(h.partie.versAttaque, -2.2), Math.atan2(h.partie.versAttaque.x, h.partie.versAttaque.z));
      audio.jouer('sifflet', { volume: 0.7 });
      dialogues.repliqueAuHasard('hockey_mise_au_jeu', {});
    }
  }

  // ---------- partie amicale ----------
  const idPnj = (x) => String(x || '').replace(/^NPC_/, '');
  function demarrerPartie(params) {
    const z = jeu.zone;
    const centre = z.glaceBoite.getCenter(new THREE.Vector3());
    const coteVoulu = /ouest/i.test(params.filet_attaque || '') ? 'ouest' : 'est';
    const cibleAttaque = h.buts.find((b) => b.cote === coteVoulu) || h.buts[0];
    const centreBut = cibleAttaque.boite.getCenter(new THREE.Vector3()).applyMatrix4(cibleAttaque.objet.matrixWorld);
    const versAttaque = centreBut.clone().sub(centre).setY(0).normalize();
    h.partie = {
      score: { eric: 0, adverse: 0 }, chrono: params.duree, objectif: params.buts, coteAttaque: cibleAttaque.cote,
      versAttaque, centre, centreBut, pause: 0, fini: false,
      objectifPasses: params.objectifPasses, objectifTirs: params.objectifTirs, passes: 0, tirs: 0,
    };
    const tous = gestionPnj.liste.filter((p) => /^joueur_hockey/.test(p.role) || /^joueur/.test(p.id));
    const parId = (id) => tous.find((p) => p.id === idPnj(id));
    let equipeEric = (params.coequipiers || []).map(parId).filter(Boolean);
    let adverses = (params.adversaires || []).map(parId).filter(Boolean);
    if (!equipeEric.length && !adverses.length) { equipeEric = tous.slice(0, 2); adverses = tous.slice(2, 5); }
    const lateral = new THREE.Vector3(-versAttaque.z, 0, versAttaque.x);
    const placer = (p, equipe, i, n) => {
      const recul = equipe === 'eric' ? -4 - (i % 2) * 4 : 4 + (i % 2) * 4;
      const ecart = (i - (n - 1) / 2) * 6;
      const depart = centre.clone().addScaledVector(versAttaque, recul).addScaledVector(lateral, ecart);
      p.muet = true;
      p.comportement = 'hockey';
      return { pnj: p, id: p.id, equipe, position: depart.clone(), depart, vitesse: new THREE.Vector3(), decision: 0, poke: 0, aLaRondelle: false };
    };
    h.patineurs = [
      ...equipeEric.map((p, i) => placer(p, 'eric', i, equipeEric.length)),
      ...adverses.map((p, i) => placer(p, 'adverse', i, adverses.length)),
    ];
    miseAuJeu();
  }

  function attaqueDe(equipe) {
    return equipe === 'eric' ? h.partie.versAttaque : h.partie.versAttaque.clone().negate();
  }

  function patineurs(dt) {
    if (!h.partie || h.partie.fini) return;
    const P = h.partie;
    if (P.pause > 0) { P.pause -= dt; return; }
    P.chrono -= dt;
    const puck = rondellesZone()[0];
    if (!puck) return;
    const pp = puck.objet.getWorldPosition(new THREE.Vector3());
    const j = jeu.joueur;
    const tous = [...h.patineurs];
    const porteurAI = h.patineurs.find((s) => s.aLaRondelle);
    const equipePossession = h.porteur === 'eric' ? 'eric' : porteurAI ? porteurAI.equipe : null;
    for (const s of tous) {
      s.decision -= dt;
      s.poke -= dt;
      let cible = s.position.clone();
      let vmax = 6;
      if (s.aLaRondelle) {
        const att = attaqueDe(s.equipe);
        const filet = P.centre.clone().addScaledVector(att, 26);
        cible = filet;
        vmax = 5.2;
        const dFilet = s.position.distanceTo(filet);
        if (s.decision <= 0) {
          s.decision = 0.35;
          const adversaires = [...h.patineurs.filter((x) => x.equipe !== s.equipe).map((x) => x.position), ...(s.equipe === 'adverse' && j ? [j.position] : [])];
          const presse = adversaires.some((a) => a.distanceTo(s.position) < 3);
          if (dFilet < 13 && Math.random() < 0.55) {
            const coin = filet.clone().add(new THREE.Vector3(-att.z, 0, att.x).multiplyScalar((Math.random() < 0.5 ? -1 : 1) * 0.7));
            const dir = coin.sub(s.position).setY(0).normalize();
            relacherAI(s, puck, dir, 17 + Math.random() * 9, Math.random() < 0.4 ? 0.9 : 0.15);
            audio.jouer3d('rondelle_tir', s.position, { volume: 0.6 });
          } else if (presse) {
            const coequipiers = [...h.patineurs.filter((x) => x.equipe === s.equipe && x !== s).map((x) => ({ pos: x.position, s: x })), ...(s.equipe === 'eric' && j ? [{ pos: j.position, eric: true }] : [])];
            const choix = coequipiers.sort((a, b) => b.pos.clone().sub(s.position).dot(att) - a.pos.clone().sub(s.position).dot(att))[0];
            if (choix) {
              const dir = choix.pos.clone().sub(s.position).setY(0).normalize();
              relacherAI(s, puck, dir, 12, 0.05);
              if (choix.eric) dialogues.repliqueAuHasard('hockey_passe_demandee', { pnj: s.pnj, position: s.position });
            }
          }
        }
        if (s.aLaRondelle) {
          const av = s.vitesse.lengthSq() > 0.01 ? s.vitesse.clone().normalize() : att;
          const lame = s.position.clone().addScaledVector(av, 0.75).setY(H_RONDELLE);
          const ec = lame.sub(pp);
          if (ec.length() > 1.2) s.aLaRondelle = false;
          else puck.corps.setLinvel({ x: s.vitesse.x + ec.x * 12, y: 0, z: s.vitesse.z + ec.z * 12 }, true);
        }
      } else if (!equipePossession) {
        const plusProche = tous.filter((x) => x.equipe === s.equipe).sort((a, b) => a.position.distanceTo(pp) - b.position.distanceTo(pp))[0];
        cible = plusProche === s ? pp.clone().addScaledVector(new THREE.Vector3(puck.corps.linvel().x, 0, puck.corps.linvel().z), 0.3) : P.centre.clone().addScaledVector(attaqueDe(s.equipe), -6).add(new THREE.Vector3(Math.sin(s.depart.x) * 4, 0, Math.cos(s.depart.z) * 4));
        if (s.position.distanceTo(pp) < 0.7 && Math.hypot(puck.corps.linvel().x, puck.corps.linvel().z) < 10 && h.porteur !== 'eric') prendreAI(s);
      } else if (equipePossession === s.equipe) {
        const att = attaqueDe(s.equipe);
        const lateral = new THREE.Vector3(-att.z, 0, att.x);
        const porteurPos = h.porteur === 'eric' ? j.position : porteurAI.position;
        cible = porteurPos.clone().addScaledVector(att, 6).addScaledVector(lateral, (s.depart.dot(lateral) > P.centre.dot(lateral) ? 1 : -1) * 6);
      } else {
        const porteurPos = h.porteur === 'eric' ? j.position : porteurAI?.position;
        const defenseurs = tous.filter((x) => x.equipe === s.equipe);
        const plusProche = porteurPos ? defenseurs.sort((a, b) => a.position.distanceTo(porteurPos) - b.position.distanceTo(porteurPos))[0] : null;
        if (plusProche === s && porteurPos) {
          cible = porteurPos.clone();
          if (s.position.distanceTo(porteurPos) < 1.3 && s.poke <= 0) {
            s.poke = 0.9;
            const vitPorteur = h.porteur === 'eric' ? j.vitesseHorizontale : porteurAI.vitesse.length();
            const chance = 0.32 - Math.min(0.18, vitPorteur * 0.025);
            if (Math.random() < chance) {
              if (h.porteur === 'eric') { perdre(); bus.emit('hockey:vole'); }
              else porteurAI.aLaRondelle = false;
              prendreAI(s);
            }
          }
        } else {
          cible = P.centre.clone().addScaledVector(attaqueDe(s.equipe), -14).add(new THREE.Vector3(Math.sin(s.depart.z) * 5, 0, 0));
        }
      }
      // déplacement sur glace : accélération bornée, inertie
      const dir = cible.sub(s.position).setY(0);
      const d = dir.length();
      const voulu = d > 0.2 ? dir.multiplyScalar(Math.min(vmax, d * 1.6) / d) : new THREE.Vector3();
      const dv = voulu.sub(s.vitesse);
      const amax = 5.5 * dt;
      if (dv.length() > amax) dv.setLength(amax);
      s.vitesse.add(dv);
      s.position.addScaledVector(s.vitesse, dt);
      const b = jeu.zone.glaceBoite;
      s.position.x = THREE.MathUtils.clamp(s.position.x, b.min.x + 1.2, b.max.x - 1.2);
      s.position.z = THREE.MathUtils.clamp(s.position.z, b.min.z + 1.2, b.max.z - 1.2);
      s.position.y = b.min.y;
      s.pnj.position.copy(s.position);
      const t = s.pnj.corps.translation();
      s.pnj.corps.setNextKinematicTranslation({ x: s.position.x, y: t.y, z: s.position.z });
      if (s.vitesse.lengthSq() > 0.04) s.pnj.lacet = Math.atan2(s.vitesse.x, s.vitesse.z);
      const v = s.vitesse.length();
      s.pnj.perso.jouer(s.aLaRondelle ? 'stickhandle' : v > 0.6 ? 'skate' : 'skate_idle', { vitesse: 0.6 + v / 7 });
    }
    // fin de partie
    const parObjectifs = P.objectifPasses != null || P.objectifTirs != null;
    const objectifsAtteints = parObjectifs && P.passes >= (P.objectifPasses ?? 0) && P.tirs >= (P.objectifTirs ?? 0);
    if (!P.fini && (objectifsAtteints || P.chrono <= 0 || (!parObjectifs && (P.score.eric >= P.objectif || P.score.adverse >= P.objectif)))) {
      P.fini = true;
      const gagne = parObjectifs ? objectifsAtteints : P.score.eric > P.score.adverse;
      dialogues.repliqueAuHasard(gagne ? 'hockey_fin_victoire' : 'hockey_fin_defaite', {});
      audio.jouer('sirene_but', { volume: 0.9 });
      setTimeout(() => h.exercice?.terminer?.(gagne, { score: { ...P.score } }), 2500);
    }
    bus.emit('hockey:etat', { score: { ...P.score }, chrono: Math.max(0, P.chrono), charge: h.charge, possession: h.porteur === 'eric', passes: P.passes, tirs: P.tirs, objectifPasses: P.objectifPasses, objectifTirs: P.objectifTirs });
  }

  function prendreAI(s) {
    // passe réussie d'Éric : un coéquipier reçoit la rondelle peu après
    if (h.partie && s.equipe === 'eric' && h.dernierePasseEric && performance.now() - h.dernierePasseEric < 3500) {
      h.partie.passes++;
      h.dernierePasseEric = 0;
      audio.jouer('ui_clic', { volume: 0.4 });
    }
    for (const x of h.patineurs) x.aLaRondelle = false;
    s.aLaRondelle = true;
    h.porteur = s.id;
    h.possession = null;
    if (jeu.joueur) jeu.joueur.aLaRondelle = false;
  }

  function relacherAI(s, puck, dir, vitesse, leve) {
    s.aLaRondelle = false;
    h.porteur = null;
    s.decision = 0.8;
    puck.corps.setLinvel({ x: dir.x * vitesse, y: leve, z: dir.z * vitesse }, true);
    s.pnj.perso.jouer('skate_shoot', { boucle: false, forcer: true });
  }

  // ---------- leçon de patinage ----------
  function normaliser(type, p) {
    const n = (...cles) => { for (const c of cles) if (p[c] !== undefined && p[c] !== null) return Number(p[c]); return undefined; };
    const d = EXERCICES[type]?.defaut || {};
    return {
      duree: n('duree_s', 'duree') ?? d.duree ?? 8,
      chutesMax: n('chutes_max') ?? Infinity,
      distance: n('distance_m', 'distance') ?? d.distance ?? 10,
      tempsMax: n('temps_max_s', 'temps') ?? d.temps ?? Infinity,
      poussees: n('poussees_min') ?? 0,
      vitesse: n('vitesse_min_m_s', 'vitesse') ?? d.vitesse ?? 3,
      glisses: n('glisses_reussies') ?? 0,
      dureeGlisse: n('duree_glisse_s') ?? 2,
      distanceArret: n('distance_arret_max_m') ?? 4.5,
      repetitions: n('essais_reussis', 'repetitions') ?? d.repetitions ?? 3,
      tours: n('tours') ?? d.tours ?? 2,
      cones: Array.isArray(p.cones) ? p.cones : null,
      pertesMax: n('pertes_max') ?? Infinity,
      passes: n('passes_reussies', 'passes') ?? d.passes ?? 5,
      essaisMax: n('essais_max', 'essais') ?? Infinity,
      receveur: p.receveur ? idPnj(p.receveur) : null,
      buts: n('buts') ?? d.buts ?? 3,
      dureePartie: n('duree_min') !== undefined ? n('duree_min') * 60 : (n('duree') ?? 360),
      objectifPasses: n('objectif_passes'),
      objectifTirs: n('objectif_tirs'),
      coequipiers: p.coequipiers, adversaires: p.adversaires, filet_attaque: p.filet_attaque,
    };
  }

  const coach = () => gestionPnj.liste.find((x) => x.role === 'entraineur_patin');
  const conesDe = (ids) => (ids || []).map((id) => objets.dynamiques.find((d) => d.id === id)).filter(Boolean);

  function exerciceEnEquipe(type) {
    if (!jeu.match || !jeu.zone?.glaceBoite) return false;
    if (type === 'partie' || type === 'match' || type === 'entrainement') return true;
    return (type === 'passe' || type === 'lancer') && jeu.zone.id === 'arena';
  }

  function lancerEnEquipe(etape, fin) {
    const type = etape.exercice;
    const p = normaliser(type === 'match' ? 'partie' : type, etape.parametres || {});
    const brut = etape.parametres || {};
    const titre = etape.titre || etape.objectif || '';
    let promesse;
    if (type === 'partie' || type === 'match') {
      promesse = jeu.match.lancerMatch({ ...brut, objectifPasses: p.objectifPasses, objectifTirs: p.objectifTirs, titre: titre || 'Match des Carabins', consigne: etape.objectif || '' });
    } else if (type === 'entrainement') {
      promesse = jeu.match.lancerEntrainement({ ...brut, exercices: brut.exercices });
    } else if (type === 'passe') {
      promesse = jeu.match.lancerEntrainement({ exercices: ['passes_deux'], passes_deux: { passes: p.passes, temps: Number.isFinite(p.tempsMax) ? p.tempsMax : 120 } });
    } else {
      promesse = jeu.match.lancerEntrainement({ exercices: ['tirs_gardien'], tirs_gardien: { buts: p.buts, tirs: Number.isFinite(p.essaisMax) ? p.essaisMax : 10 } });
    }
    promesse.then((r) => {
      if (r?.reussi) jeu.etat.drapeaux.patinage = Math.min(1, (jeu.etat.drapeaux.patinage ?? 0.3) + 0.06);
      fin(!!r?.reussi, r);
    }).catch((e) => { console.error('[match]', e); fin(true); });
  }

  function lancerExercice(etape, fin) {
    const type = etape.exercice;
    if (exerciceEnEquipe(type)) { lancerEnEquipe(etape, fin); return; }
    const modele = EXERCICES[type];
    if (!modele) { fin(true); return; }
    const p = normaliser(type, etape.parametres || {});
    const j = jeu.joueur;
    if ((jeu.etat.drapeaux.patinage ?? 0) < 0.05) jeu.etat.drapeaux.patinage = 0.05;
    const ex = {
      type, p, titre: etape.titre || modele.titre, consigne: etape.objectif || modele.consigne,
      progression: 0, compteur: 0, distance: 0, temps: 0, chutes: 0, pertes: 0, essais: 0, etat: 'en_cours',
      dernierePos: j.position.clone(), elan: false, angle: 0, angleAvant: null, iCone: 0, glisse: 0,
      poussees0: j.nbPoussees || 0,
      terminer(reussi, details) {
        if (ex.etat !== 'en_cours') return;
        ex.etat = reussi ? 'reussi' : 'rate';
        if (reussi) {
          jeu.etat.drapeaux.patinage = Math.min(1, (jeu.etat.drapeaux.patinage ?? 0.05) + 0.13);
          dialogues.situation([`entraineur_bravo_${type}`, 'entraineur_bravo'], { pnj: coach() });
          audio.jouer('ui_succes');
        } else dialogues.repliqueAuHasard('entraineur_encore', { pnj: coach() });
        bus.emit('exercice', { ...publique(), etat: ex.etat });
        h.exercice = null;
        if (type === 'partie') { h.partie = null; for (const s of h.patineurs) s.pnj.comportement = 'statique'; h.patineurs = []; }
        setTimeout(() => fin(reussi, details), 1200);
      },
      surTir() { if (type === 'lancer') ex.essais++; },
      surPasse() { if (type === 'passe') { ex.passeEnVol = 2.5; ex.essais++; } },
      surBut(pourEric) { if (type === 'lancer' && pourEric) { ex.compteur++; if (ex.compteur >= p.buts) ex.terminer(true); } },
      surChute() { ex.chutes++; },
    };
    function publique() {
      return { type, titre: ex.titre, consigne: ex.consigne, progression: ex.progression, texte: ex.texte || '' };
    }
    ex.publique = publique;
    h.exercice = ex;
    if (!j.patins) j.patins = true;
    const sp = jeu.zone.spawns.SPAWN_lecon || jeu.zone.spawns.SPAWN_glace;
    if (sp && !j.surGlace) j.placer(sp.position, j.lacet);
    equiperBaton(j);
    if (['maniement', 'passe', 'lancer'].includes(type)) {
      const pk = rondellesZone()[0];
      if (pk) {
        const devant = j.position.clone().addScaledVector(j.avant(), 1.0);
        pk.corps.setTranslation({ x: devant.x, y: j.position.y + 0.05, z: devant.z }, true);
        pk.corps.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
    if (type === 'partie') demarrerPartie({ ...p, duree: p.dureePartie });
    const c = coach();
    dialogues.situation([`entraineur_intro_${type}`, `entraineur_conseil_${type}`], { pnj: c, position: c?.position });
    bus.emit('exercice', publique());
  }

  function suivreExercice(dt) {
    const ex = h.exercice;
    if (!ex || ex.etat !== 'en_cours') return;
    const j = jeu.joueur;
    const p = ex.p;
    const v = j.vitesseHorizontale;
    ex.temps += dt;
    const deplacement = j.position.distanceTo(ex.dernierePos);
    ex.dernierePos.copy(j.position);
    const reste = Number.isFinite(p.tempsMax) ? ` · ${Math.max(0, p.tempsMax - ex.temps).toFixed(0)} s` : '';
    if (ex.chutes > p.chutesMax) { ex.terminer(false); return; }
    switch (ex.type) {
      case 'equilibre':
        if (j.chute > 0) ex.compteur = 0;
        else ex.compteur += dt;
        ex.progression = Math.min(1, ex.compteur / p.duree);
        ex.texte = `${Math.floor(ex.compteur)} / ${p.duree} s debout${Number.isFinite(p.chutesMax) ? ` · chutes ${ex.chutes}/${p.chutesMax}` : ''}`;
        if (ex.compteur >= p.duree) ex.terminer(true);
        break;
      case 'poussee': {
        if (!j.recule && j.chute <= 0) ex.distance += deplacement;
        const nb = (j.nbPoussees || 0) - ex.poussees0;
        ex.progression = Math.min(1, ex.distance / p.distance);
        ex.texte = `${ex.distance.toFixed(1)} / ${p.distance} m · ${nb} poussées${p.poussees ? ` (min. ${p.poussees})` : ''}${reste}`;
        if (ex.distance >= p.distance) ex.terminer(nb >= p.poussees);
        else if (ex.temps > p.tempsMax) ex.terminer(false);
        break;
      }
      case 'glisse':
        if (v > 1 && !j.pousse && j.chute <= 0) ex.glisse += dt;
        else if (j.pousse || v < 0.6) { ex.glisse = 0; ex.glisseComptee = false; }
        if (p.glisses) {
          if (ex.glisse >= p.dureeGlisse && !ex.glisseComptee) { ex.glisseComptee = true; ex.compteur++; audio.jouer('ui_clic', { volume: 0.5 }); }
          ex.progression = Math.min(1, ex.compteur / p.glisses);
          ex.texte = `${ex.compteur} / ${p.glisses} glisses de ${p.dureeGlisse} s`;
          if (ex.compteur >= p.glisses) ex.terminer(true);
        } else {
          if (v > 1 && !j.pousse) ex.distance += deplacement; else if (j.pousse) ex.distance = 0;
          ex.progression = Math.min(1, ex.distance / p.distance);
          ex.texte = `${ex.distance.toFixed(1)} / ${p.distance} m sans pousser`;
          if (ex.distance >= p.distance) ex.terminer(true);
        }
        break;
      case 'arret':
        if (!ex.elan && v >= p.vitesse) { ex.elan = true; ex.departFrein = null; }
        if (ex.elan && j.freine && !ex.departFrein) ex.departFrein = j.position.clone();
        if (ex.elan && ex.departFrein && v < 0.3) {
          const dist = ex.departFrein.distanceTo(j.position);
          ex.elan = false; ex.departFrein = null;
          if (dist <= p.distanceArret) { ex.compteur++; audio.jouer('ui_clic'); }
          else dialogues.repliqueAuHasard('entraineur_conseil_arret', { pnj: coach() });
        }
        ex.progression = ex.compteur / p.repetitions;
        ex.texte = `${ex.compteur} / ${p.repetitions} arrêts en moins de ${p.distanceArret} m`;
        if (ex.compteur >= p.repetitions) ex.terminer(true);
        break;
      case 'croisement': {
        const cones = conesDe(p.cones);
        const c = cones.length
          ? cones.reduce((acc, d) => acc.add(d.objet.getWorldPosition(new THREE.Vector3())), new THREE.Vector3()).divideScalar(cones.length)
          : (jeu.zone.spawns.SPAWN_lecon?.position || jeu.zone.glaceBoite.getCenter(new THREE.Vector3()));
        const a = Math.atan2(j.position.z - c.z, j.position.x - c.x);
        const r = Math.hypot(j.position.z - c.z, j.position.x - c.x);
        if (ex.angleAvant !== null && r > 1.5 && r < 10) {
          let d = a - ex.angleAvant; d = Math.atan2(Math.sin(d), Math.cos(d));
          ex.angle += d;
        }
        ex.angleAvant = a;
        const tours = Math.abs(ex.angle) / (Math.PI * 2);
        ex.progression = Math.min(1, tours / p.tours);
        ex.texte = `${tours.toFixed(1)} / ${p.tours} tours${reste}`;
        if (tours >= p.tours) ex.terminer(true);
        else if (ex.temps > p.tempsMax) ex.terminer(false);
        break;
      }
      case 'recul':
        if (j.recule && j.chute <= 0) ex.distance += deplacement;
        ex.progression = Math.min(1, ex.distance / p.distance);
        ex.texte = `${ex.distance.toFixed(1)} / ${p.distance} m à reculons${reste}`;
        if (ex.distance >= p.distance) ex.terminer(true);
        else if (ex.temps > p.tempsMax) ex.terminer(false);
        break;
      case 'maniement': {
        const cones = conesDe(p.cones);
        if (h.possession && h.porteur === 'eric') ex.avait = true;
        else if (ex.avait) { ex.avait = false; ex.pertes++; }
        if (cones.length) {
          const cible = cones[ex.iCone];
          if (cible && h.porteur === 'eric' && cible.objet.getWorldPosition(new THREE.Vector3()).distanceTo(j.position) < 1.6) { ex.iCone++; audio.jouer('ui_clic', { volume: 0.5 }); }
          ex.progression = ex.iCone / cones.length;
          ex.texte = `${ex.iCone} / ${cones.length} cônes · pertes ${ex.pertes}${Number.isFinite(p.pertesMax) ? `/${p.pertesMax}` : ''}${reste}`;
          if (ex.iCone >= cones.length) { ex.terminer(ex.pertes <= p.pertesMax); break; }
        } else {
          if (h.porteur === 'eric') ex.distance += deplacement;
          ex.progression = Math.min(1, ex.distance / p.distance);
          ex.texte = `${ex.distance.toFixed(0)} / ${p.distance} m avec la rondelle`;
          if (ex.distance >= p.distance) { ex.terminer(true); break; }
        }
        if (ex.pertes > p.pertesMax || ex.temps > p.tempsMax) ex.terminer(false);
        break;
      }
      case 'passe': {
        const receveur = (p.receveur && gestionPnj.trouver(p.receveur)) || coach();
        if (ex.passeEnVol > 0 && receveur) {
          ex.passeEnVol -= dt;
          const pk = rondellesZone()[0];
          const pos = pk?.objet.getWorldPosition(new THREE.Vector3());
          if (pos && pos.distanceTo(receveur.position) < 1.5) {
            ex.passeEnVol = 0;
            ex.compteur++;
            audio.jouer3d('rondelle_poteau', pos, { volume: 0.4, hauteur: 1.4 });
            setTimeout(() => {
              const vers = jeu.joueur.position.clone().sub(receveur.position).setY(0).normalize();
              pk.corps.setTranslation({ x: receveur.position.x + vers.x * 0.8, y: pos.y, z: receveur.position.z + vers.z * 0.8 }, true);
              pk.corps.setLinvel({ x: vers.x * 9, y: 0, z: vers.z * 9 }, true);
            }, 900);
          }
        }
        ex.progression = ex.compteur / p.passes;
        ex.texte = `${ex.compteur} / ${p.passes} passes reçues${Number.isFinite(p.essaisMax) ? ` · ${ex.essais}/${p.essaisMax} essais` : ''}`;
        if (ex.compteur >= p.passes) ex.terminer(true);
        else if (ex.essais >= p.essaisMax && !(ex.passeEnVol > 0)) ex.terminer(false);
        break;
      }
      case 'lancer':
        ex.progression = ex.compteur / p.buts;
        ex.texte = `${ex.compteur} / ${p.buts} buts${Number.isFinite(p.essaisMax) ? ` · ${ex.essais}/${p.essaisMax} tirs` : ''}`;
        if (ex.compteur < p.buts && ex.essais >= p.essaisMax) {
          ex.attenteFin = (ex.attenteFin || 0) + dt;
          if (ex.attenteFin > 2.5) ex.terminer(false);
        }
        break;
      case 'partie':
        if (h.partie) {
          const P = h.partie;
          if (P.objectifPasses != null || P.objectifTirs != null) {
            const op = P.objectifPasses ?? 0, ot = P.objectifTirs ?? 0;
            ex.progression = Math.min(1, (Math.min(P.passes, op) + Math.min(P.tirs, ot)) / Math.max(1, op + ot));
            const c = Math.max(0, P.chrono);
            ex.texte = `Passes ${P.passes}/${op} · tirs cadrés ${P.tirs}/${ot} · ${Math.floor(c / 60)}:${String(Math.floor(c % 60)).padStart(2, '0')}`;
          } else { ex.progression = P.score.eric / Math.max(1, p.buts); ex.texte = `${P.score.eric} – ${P.score.adverse}`; }
        }
        break;
      default:
        break;
    }
    ex.accUI = (ex.accUI || 0) + dt;
    if (ex.accUI > 0.15) { ex.accUI = 0; bus.emit('exercice', ex.publique()); }
    ex.conseil = (ex.conseil ?? 18) - dt;
    if (ex.conseil <= 0 && ex.progression < 0.3) {
      ex.conseil = 25;
      const c = coach();
      dialogues.repliqueAuHasard(`entraineur_conseil_${ex.type}`, { pnj: c, position: c?.position });
    }
  }

  function suivreTirs(dt) {
    const t = h.tirEnVol;
    if (!t) return;
    t.t -= dt;
    if (t.t <= 0) { h.tirEnVol = null; return; }
    if (t.cadre || !h.partie) return;
    const pos = t.rondelle.objet.getWorldPosition(new THREE.Vector3());
    const g = h.gardiens.find((x) => x.cote === h.partie.coteAttaque) || h.gardiens[0];
    const pres = pos.distanceTo(h.partie.centreBut) < 1.4 || (g && pos.distanceTo(g.pnj.position) < 0.9);
    if (pres) { t.cadre = true; h.partie.tirs++; }
  }

  bus.on('patin:chute', () => {
    h.exercice?.surChute?.();
    const coach = gestionPnj.liste.find((x) => x.role === 'entraineur_patin' && !x.cache);
    if (h.match?.actif || h.entrainement?.actif) { if (Math.random() < 0.35) dialogues.situation(['eric_chute_match', 'eric_chute_glace'], { canal: 'eric' }); }
    else if (Math.random() < 0.7) dialogues.repliqueAuHasard('entraineur_chute', { pnj: coach, position: coach?.position }) || dialogues.repliqueAuHasard('eric_chute_glace', {});
    if (h.possession) perdre();
  });
  bus.on('patin:bande', () => { if (Math.random() < 0.5) dialogues.repliqueAuHasard('hockey_bande', {}); });

  function horsJeu() {
    const b = jeu.zone?.glaceBoite;
    if (!b) return;
    for (const p of rondellesZone()) {
      if (p.tenu) continue;
      const t = p.corps.translation();
      const dehors = t.y < b.min.y - 1 || t.y > b.max.y + 6 || t.x < b.min.x - 3 || t.x > b.max.x + 3 || t.z < b.min.z - 3 || t.z > b.max.z + 3;
      if (!dehors) continue;
      if (h.possession === p) perdre();
      if (h.match?.actif) { h.match.surSortie(p); continue; }
      const sp = jeu.zone.spawns.SPAWN_mise_au_jeu || jeu.zone.spawns.SPAWN_glace;
      const c = sp ? sp.position : b.getCenter(new THREE.Vector3());
      p.corps.setTranslation({ x: c.x + (Math.random() - 0.5) * 0.4, y: b.max.y + 0.1, z: c.z + (Math.random() - 0.5) * 0.4 }, true);
      p.corps.setLinvel({ x: 0, y: 0, z: 0 }, true);
      p.corps.setAngvel({ x: 0, y: 0, z: 0 }, true);
      if (h.partie || h.exercice) { audio.jouer('sifflet', { volume: 0.6 }); if (h.partie) miseAuJeu(); }
    }
  }

  function mettreAJour(dt, ent) {
    if (!h.actif || !jeu.joueur) return;
    horsJeu();
    const j = jeu.joueur;
    if (j.patins && !h.baton && (j.surGlace || h.exercice)) equiperBaton(j);
    if (h.baton) {
      h.baton.visible = j.patins && !j.perso.batonPropre;
      placerBaton(j, dt);
      if (j.patine && j.mode === 'libre') controler(j, dt, ent);
    }
    gardiens(dt);
    if (h.match?.actif) h.match.mettreAJour(dt, ent);
    else if (h.entrainement?.actif) h.entrainement.mettreAJour(dt, ent);
    else patineurs(dt);
    verifierButs();
    suivreTirs(dt);
    suivreExercice(dt);
    if (!h.match?.actif && (h.partie || h.exercice)) bus.emit('hockey:etat', { score: h.partie ? { ...h.partie.score } : null, chrono: h.partie?.chrono ?? null, charge: h.charge, possession: h.porteur === 'eric' });
  }

  bus.on('action:lecon', () => bus.emit('toast', { texte: 'L’entraîneur t’attend sur la glace.', type: 'info' }));
  bus.on('action:rondelles', () => {
    const j = jeu.joueur; const p = rondellesZone().find((x) => !x.tenu);
    if (!j || !p) return;
    const devant = j.position.clone().addScaledVector(j.avant(), 0.9);
    p.corps.setTranslation({ x: devant.x, y: j.position.y + 0.1, z: devant.z }, true);
    p.corps.setLinvel({ x: 0, y: 0, z: 0 }, true);
  });

  return Object.assign(h, {
    activer, mettreAJour, lancerExercice, EXERCICES,
    rondelles: rondellesZone, perdre, equiperBaton, retirerBaton, ajouterGardien, viderGardiens, preparerGardiens, orienterGardien, creerBaton,
  });
}
