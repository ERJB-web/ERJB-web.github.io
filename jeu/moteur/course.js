import * as THREE from 'three';

const CLE_RECORD = 'protocole.course.records.v1';
const format = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function lireRecords() {
  try { return JSON.parse(localStorage.getItem(CLE_RECORD) || '{}') || {}; } catch { return {}; }
}
function ecrireRecords(r) {
  try { localStorage.setItem(CLE_RECORD, JSON.stringify(r)); } catch { /* stockage indisponible */ }
}

export function creerCourse({ bus, jeu, gestionPnj, dialogues, audio }) {
  const C = { actif: false, points: [], i: 0, t: 0, souffle: 1, essouffle: false, coureurs: [], anneau: null, resoudre: null, acc: 0, halete: 0, dernierSouffle: -99 };

  function trouverPoints(zone) {
    const l = [];
    zone.racine.updateWorldMatrix(true, true);
    zone.racine.traverse((o) => {
      const m = /^CHECK_course_(\d+)/i.exec(o.name || '');
      if (m) l.push({ n: Number(m[1]), position: o.getWorldPosition(new THREE.Vector3()), rayon: Number(o.userData?.radius) || 4.5, objet: o });
    });
    for (const [id, s] of Object.entries(zone.spawns || {})) {
      const m = /^SPAWN_course_(\d+)/i.exec(id);
      if (m) l.push({ n: Number(m[1]), position: s.position.clone(), rayon: 4.5 });
    }
    l.sort((a, b) => a.n - b.n);
    for (const p of l) if (p.objet) p.objet.visible = false;
    return l;
  }

  function creerAnneau() {
    const g = new THREE.TorusGeometry(2.2, 0.08, 8, 48);
    g.rotateX(Math.PI / 2);
    const m = new THREE.MeshBasicMaterial({ color: 0x16c762, transparent: true, opacity: 0.75, depthWrite: false, toneMapped: false });
    const a = new THREE.Mesh(g, m);
    a.renderOrder = 5;
    return a;
  }

  async function ajouterCoureurs(zone, nombre) {
    const roles = ['coureur_1', 'coureur_2', 'coureur_3', 'coureur_4', 'coureur_5', 'coureur_6'];
    const noms = dialogues?.donnees?.personnages || {};
    const liste = [];
    for (let k = 0; k < nombre && C.points.length > 1; k++) {
      const depart = C.points[(k * 2) % C.points.length].position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3));
      const role = roles[k % roles.length];
      const p = await gestionPnj.ajouter({ role, id: `${role}_course`, position: depart, quaternion: new THREE.Quaternion(), mobile: true, nom: noms[role]?.nom || '', anim: 'idle' });
      p.muet = false;
      p.coureur = { i: (k * 2 + 1) % C.points.length, vitesse: 2.6 + Math.random() * 1.1 };
      liste.push(p);
    }
    return liste;
  }

  function relancerCoureur(p) {
    const cible = C.points[p.coureur.i]?.position;
    if (!cible) return;
    gestionPnj.allerVers(p, cible, {
      vitesse: p.coureur.vitesse, anim: 'run',
      fin: (x) => { x.coureur.i = (x.coureur.i + 1) % C.points.length; relancerCoureur(x); },
    });
  }

  async function lancer(params = {}) {
    if (C.actif) return { reussi: true, details: [] };
    const zone = jeu.zone;
    const j = jeu.joueur;
    if (!zone || !j) return { reussi: true, details: [] };
    C.points = trouverPoints(zone);
    if (!C.points.length) { bus.emit('toast', { texte: 'Le parcours n’est pas encore balisé.', type: 'info' }); return { reussi: true, details: [] }; }
    const depart = zone.spawns.SPAWN_depart_course || zone.spawns.SPAWN_player;
    if (depart) {
      const avant = new THREE.Vector3(0, 0, -1).applyQuaternion(depart.quaternion);
      j.placer(depart.position.clone(), Math.atan2(avant.x, avant.z));
    }
    C.coureurs = await ajouterCoureurs(zone, params.coureurs ?? 4);
    for (const p of C.coureurs) relancerCoureur(p);
    if (dialogues?.scene?.('mr_depart') && jeu.scene) await jeu.scene('mr_depart');
    C.anneau = C.anneau || creerAnneau();
    zone.racine.add(C.anneau);
    for (const k of [3, 2, 1]) {
      bus.emit('toast', { texte: String(k), type: 'info', duree: 0.9 });
      audio.jouer('ui_tic', { volume: 0.6 });
      await new Promise((ok) => setTimeout(ok, 900));
    }
    bus.emit('toast', { texte: 'Partez !', type: 'succes', duree: 1.5 });
    audio.jouer('sifflet', { volume: 0.5 });
    Object.assign(C, { actif: true, i: 0, t: 0, souffle: 1, essouffle: false, acc: 0, halete: 0, dernierSouffle: -99, record: lireRecords()[zone.id] ?? null });
    return new Promise((ok) => { C.resoudre = ok; });
  }

  function mettreAJour(dt) {
    if (!C.actif || !jeu.joueur || jeu.cinematique) return;
    const j = jeu.joueur;
    C.t += dt;
    const energie = jeu.etat.stats.energie ?? 70;
    // souffle : la course le vide, la marche et l'arrêt le rechargent
    if (j.court) C.souffle -= dt * (0.05 + 0.03 * (1 - energie / 100));
    else C.souffle += dt * (j.vitesseHorizontale > 0.3 ? 0.035 : 0.09);
    C.souffle = THREE.MathUtils.clamp(C.souffle, 0, 1);
    if (j.court) jeu.etat.stats.energie = Math.max(5, energie - dt * 0.12);
    if (!C.essouffle && C.souffle <= 0.02) {
      C.essouffle = true;
      j.bloqueCourse = true;
      if (C.t - C.dernierSouffle > 20) { C.dernierSouffle = C.t; dialogues?.situation(['course_souffle', 'eric_fatigue'], { canal: 'eric' }); }
    } else if (C.essouffle && C.souffle > 0.4) {
      C.essouffle = false;
      j.bloqueCourse = false;
    }
    C.halete -= dt;
    if (C.souffle < 0.3 && C.halete <= 0) { C.halete = 1.6 + C.souffle * 3; audio.jouer3d('halete', j.position, { volume: 0.35 + (0.3 - C.souffle), hauteur: 1.25 }); }
    // points de passage
    const p = C.points[C.i];
    if (p) {
      C.anneau.position.copy(p.position).setY(p.position.y + 0.15 + Math.sin(C.t * 3) * 0.05);
      C.anneau.visible = true;
      if (Math.hypot(p.position.x - j.position.x, p.position.z - j.position.z) < p.rayon && Math.abs(p.position.y - j.position.y) < 3) {
        C.i++;
        audio.jouer('ui_succes', { volume: 0.6 });
        if (C.i < C.points.length) {
          bus.emit('toast', { texte: `Point ${C.i} sur ${C.points.length} · ${format(C.t)}`, type: 'info', duree: 2.5 });
          if (Math.random() < 0.55) dialogues?.situation(['course_point_passage'], { canal: 'eric', palier: C.i });
        } else terminer();
      }
    }
    C.acc += dt;
    if (C.acc > 0.2 && C.actif) {
      C.acc = 0;
      bus.emit('exercice', {
        type: 'course', titre: 'Course au mont Royal', consigne: 'Cours (Maj) d’un point de passage à l’autre. Ménage ton souffle : marche pour récupérer.',
        progression: C.i / C.points.length,
        texte: `Point ${C.i}/${C.points.length} · ${format(C.t)} · souffle ${Math.round(C.souffle * 100)} %${C.record ? ` · record ${format(C.record)}` : ''}`,
      });
    }
  }

  async function terminer() {
    C.actif = false;
    const zone = jeu.zone;
    const j = jeu.joueur;
    j.bloqueCourse = false;
    if (C.anneau) C.anneau.parent?.remove(C.anneau);
    const temps = C.t;
    const records = lireRecords();
    const ancien = records[zone.id];
    const record = !ancien || temps < ancien;
    if (record) { records[zone.id] = Math.round(temps * 10) / 10; ecrireRecords(records); }
    bus.emit('exercice', { type: 'course', titre: 'Course au mont Royal', consigne: '', progression: 1, texte: `Arrivée en ${format(temps)}${record ? ' · nouveau record' : ` · record ${format(ancien)}`}`, etat: 'reussi' });
    audio.jouer('ui_succes');
    jeu.etat.stats.stress = Math.max(0, (jeu.etat.stats.stress ?? 15) - 6);
    if (dialogues?.scene?.('mr_arrivee') && jeu.scene) await jeu.scene('mr_arrivee');
    for (const p of C.coureurs) gestionPnj.retirer(p);
    C.coureurs = [];
    const r = C.resoudre;
    C.resoudre = null;
    r?.({ reussi: true, details: [{ titre: `Temps : ${format(temps)}`, reussi: true }, { titre: record ? 'Nouveau meilleur temps' : `Meilleur temps : ${format(ancien)}`, reussi: record }] });
  }

  function arreter() {
    if (!C.actif && !C.coureurs.length) return;
    C.actif = false;
    if (jeu.joueur) jeu.joueur.bloqueCourse = false;
    if (C.anneau) C.anneau.parent?.remove(C.anneau);
    for (const p of C.coureurs) gestionPnj.retirer(p);
    C.coureurs = [];
    bus.emit('exercice', null);
    C.resoudre?.({ reussi: false, details: [] });
    C.resoudre = null;
  }

  return { lancer, mettreAJour, arreter, get actif() { return C.actif; } };
}
