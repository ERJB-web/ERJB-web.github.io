import * as THREE from 'three';
import { creerBus } from './bus.js?v=03b1c95b3e';
import { etatInitial, charger as chargerPartie, sauvegarder, chargerOptions, sauverOptions, appliquerEffets } from './etat.js?v=03b1c95b3e';
import { creerRendu } from './rendu.js?v=03b1c95b3e';
import { creerPhysique } from './physique.js?v=03b1c95b3e';
import { creerChargeur, chargerZone, installerZone, retirerZone } from './zones.js?v=03b1c95b3e';
import { creerObjets } from './objets.js?v=03b1c95b3e';
import { creerAudio } from './audio.js?v=03b1c95b3e';
import { creerPersonnages } from './personnages.js?v=03b1c95b3e';
import { creerCamera } from './camera.js?v=03b1c95b3e';
import { creerEntrees } from './entrees.js?v=03b1c95b3e';
import { creerInteractions } from './interactions.js?v=03b1c95b3e';
import { creerGestionPNJ } from './pnj.js?v=03b1c95b3e';
import { creerDialogues } from './dialogues.js?v=03b1c95b3e';
import { creerDirection } from './direction.js?v=03b1c95b3e';
import { creerMissions } from './missions.js?v=03b1c95b3e';
import { creerHockey } from './hockey.js?v=03b1c95b3e';

const VERSION = '2.0.0';
const params = new URLSearchParams(location.search);

async function json(url, defaut) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch {
    return defaut;
  }
}

async function demarrer() {
  const canvas = document.getElementById('scene');
  const racineUI = document.getElementById('ui');
  const racineDefis = document.getElementById('defis');
  const voile = document.getElementById('voile');
  const options = chargerOptions();
  const bus = creerBus();
  const rendu = creerRendu(canvas);
  rendu.appliquerQualite(options.qualite);
  const physique = await creerPhysique();
  const chargeur = creerChargeur(rendu.renderer);
  const audio = creerAudio({ options });
  const objets = creerObjets({ physique, audio, bus });
  const personnages = creerPersonnages({ chargeur, audio });
  const cam = creerCamera({ camera: rendu.camera, physique, options });
  const entrees = creerEntrees({ canvas, bus, options });
  const interactions = creerInteractions({ bus, objets, entrees });
  const gestionPnj = creerGestionPNJ({ physique, personnages, objets, audio, bus });
  const dialogues = creerDialogues({ bus, audio, camera: cam, physique, options });

  const [scenario, donneesDialogues, donneesDefis, voix] = await Promise.all([
    json('donnees/scenario.json', { chapitres: [] }),
    json('donnees/dialogues.json', {}),
    json('donnees/defis.json', []),
    json('donnees/voix.json', {}),
  ]);
  dialogues.charger(donneesDialogues, voix);

  const jeu = {
    etat: etatInitial(scenario),
    zone: null,
    joueur: null,
    enJeu: false,
    pause: false,
    cinematique: false,
    objectif: null,
    version: VERSION,
  };
  const direction = creerDirection({ pnj: gestionPnj, physique, audio, bus, jeu, dialogues });
  const missions = creerMissions({ bus, jeu });
  missions.charger(scenario, donneesDefis);
  const hockey = creerHockey({ bus, physique, objets, jeu, audio, dialogues, gestionPnj, cam });
  jeu.exercice = (etape, fin) => hockey.lancerExercice(etape, fin);

  // ---------- interface ----------
  let ui = null;
  try {
    const mod = await import('../ui/ui.js?v=03b1c95b3e');
    ui = mod.initUI({ bus, etat: { options, get partie() { return jeu.etat; }, get existeSauvegarde() { return !!chargerPartie(); }, scenario, version: VERSION }, racine: racineUI });
  } catch (e) {
    console.warn('[ui] interface de secours', e);
    const mod = await import('./ui-secours.js?v=03b1c95b3e');
    ui = mod.initUI({ bus, etat: { options, get partie() { return jeu.etat; }, get existeSauvegarde() { return !!chargerPartie(); }, scenario }, racine: racineUI });
  }

  function fondu(versNoir, duree = 0.6) {
    return new Promise((ok) => {
      voile.style.transition = `opacity ${duree}s ease`;
      voile.style.opacity = versNoir ? '1' : '0';
      setTimeout(ok, duree * 1000 + 30);
    });
  }

  // ---------- zones ----------
  async function allerZone(id, spawnNom) {
    jeu.enJeu = false;
    entrees.activer(false);
    await fondu(true, 0.5);
    bus.emit('chargement', { progression: 0, texte: '', zone: id });
    bus.emit('ecran', { nom: 'chargement', zone: id });
    if (jeu.zone) {
      if (jeu.joueur) {
        if (jeu.joueur.porte) jeu.joueur.porte = null;
        jeu.joueur.perso.racine.parent?.remove(jeu.joueur.perso.racine);
      }
      gestionPnj.vider();
      objets.vider();
      interactions.reinitialiser();
      retirerZone(jeu.zone, rendu, physique);
      jeu.zone = null;
    }
    let zone;
    try {
      zone = await chargerZone({ id, rendu, physique, objets, chargeur, progression: (p) => bus.emit('chargement', { progression: p, zone: id }) });
    } catch (e) {
      console.error('[zone]', id, e);
      if (id !== 'test') return allerZone('test', null);
      throw e;
    }
    installerZone(zone, rendu);
    jeu.zone = zone;
    jeu.ecranTitre = false;
    gestionPnj.zone = zone;
    direction.changerZone(zone);
    jeu.etat.zone = id;

    // personnage du joueur
    if (!jeu.joueur) {
      const { creerJoueur } = await import('./joueur.js?v=03b1c95b3e');
      const perso = await personnages.creer('eric');
      jeu.joueur = creerJoueur({ physique, perso, audio, bus, jeu });
      dialogues.lier(jeu.joueur, gestionPnj);
    }
    zone.racine.add(jeu.joueur.perso.racine);
    jeu.joueur.zone = zone;
    jeu.joueur.surface = zone.manifeste.sol || 'beton';
    jeu.joueur.patins = false;
    jeu.joueur.porte = null;
    jeu.joueur.mode = 'libre';
    const sp = zone.spawns[spawnNom] || zone.spawns.SPAWN_player || Object.values(zone.spawns)[0];
    const pos = sp ? sp.position.clone() : new THREE.Vector3();
    const avant = sp ? new THREE.Vector3(0, 0, -1).applyQuaternion(sp.quaternion) : new THREE.Vector3(0, 0, 1);
    jeu.joueur.placer(pos, Math.atan2(avant.x, avant.z));
    jeu.etat.spawn = sp?.id || null;

    // personnages non joueurs
    const roles = dialogues.donnees.personnages || {};
    await Promise.all(zone.pnj.map((m) => {
      const id = m.id.replace(/^NPC_/, '');
      const role = m.donnees.role || id;
      if (/^direction/.test(role)) return null;
      const flaner = Number(m.donnees.flaner) === 1 || m.donnees.anim === 'walk' || m.donnees.anim === 'flaner';
      return gestionPnj.ajouter({ role, id, position: m.position, quaternion: m.quaternion, anim: flaner ? 'idle' : (m.donnees.anim || 'idle'), dialogue: m.donnees.dialogue || null, nom: roles[role]?.nom || roles[id]?.nom || '', flaner });
    }));

    hockey.activer(zone);
    cam.suivi(jeu.joueur);
    audio.themeMusical(zone.manifeste.musique || null, { immediat: false });
    audio.changerAmbiance(zone.manifeste.ambiance || null);
    bus.emit('zone', { id, titre: zone.manifeste.titre, sousTitre: zone.manifeste.sousTitre, carte: zone.manifeste.carte ? `zones/${id}/${zone.manifeste.carte}` : null, bounds: zone.manifeste.bounds });
    const vues = jeu.etat.zonesVues || (jeu.etat.zonesVues = []);
    const premiereFois = !vues.includes(id);
    if (premiereFois) vues.push(id);
    const plans = Object.keys(zone.cameras).filter((k) => /^CAM_intro_/.test(k)).sort().map((k) => zone.cameras[k]);
    if (premiereFois && plans.length && !jeu.sansIntro) {
      jeu.cinematique = true;
      jeu.joueur.mode = 'cine';
      bus.emit('ecran', { nom: 'cinematique' });
      for (let i = 0; i < plans.length; i++) {
        const c = plans[i];
        const visee = new THREE.Vector3(0, -1, 0).applyQuaternion(c.quaternion);
        const depart = c.position.clone().addScaledVector(visee, -0.6);
        cam.plan(depart, depart.clone().addScaledVector(visee, 12), { fov: c.fov, coupe: true });
        if (i === 0) await fondu(false, 0.9);
        cam.plan(c.position.clone().addScaledVector(visee, 0.5), c.position.clone().addScaledVector(visee, 12.5), { fov: c.fov, lissage: 0.35 });
        await attendre(3000);
      }
      await fondu(true, 0.4);
      cam.suivi(jeu.joueur);
      jeu.joueur.mode = 'libre';
      jeu.cinematique = false;
    }
    bus.emit('ecran', { nom: 'jeu' });
    await fondu(false, 0.8);
    jeu.enJeu = true;
    entrees.activer(true);
    if (premiereFois && vues.length === 1) {
      const t = (a) => entrees.touche(a);
      setTimeout(() => bus.emit('toast', { texte: entrees.source === 'tactile' ? 'Joystick à gauche pour marcher, glisse à droite pour regarder.' : `ZQSD ou WASD pour marcher · ${t('courir')} pour courir · ${t('interagir')} pour agir · souris pour regarder`, type: 'aide', duree: 7 }), 1200);
    }
    return zone;
  }

  function attendre(ms) { return new Promise((ok) => setTimeout(ok, ms)); }

  // ---------- scènes, défis, fins ----------
  async function scene(id) {
    if (!id || !dialogues.scene(id)) return { choix: null };
    const j = jeu.joueur;
    const modeAvant = j?.mode;
    jeu.cinematique = true;
    direction.pause = true;
    if (j && j.mode !== 'assis') j.mode = 'cine';
    interactions.reinitialiserInvite?.();
    bus.emit('invite', null);
    bus.emit('ecran', { nom: 'dialogue' });
    const r = await dialogues.jouerScene(id);
    if (r.choix?.option) {
      const o = r.choix.option;
      signaler(appliquerEffets(jeu.etat, o.effets));
      if (o.scene) await dialogues.jouerScene(o.scene);
    }
    if (j && modeAvant !== 'assis') j.mode = 'libre';
    cam.suivi();
    jeu.cinematique = false;
    direction.pause = false;
    bus.emit('ecran', { nom: 'jeu' });
    missions.hud();
    return r;
  }

  async function defi(def) {
    jeu.cinematique = true;
    direction.pause = true;
    entrees.activer(false);
    bus.emit('ecran', { nom: 'defi' });
    bus.emit('invite', null);
    let r = { reussi: true, score: 1 };
    try {
      const mod = await import('../defis/defis.js?v=03b1c95b3e');
      racineDefis.hidden = false;
      r = await mod.lancerDefi(def, {
        racine: racineDefis,
        son: { clic: () => audio.jouer('ui_clic'), succes: () => audio.jouer('ui_succes'), echec: () => audio.jouer('ui_echec'), tic: () => audio.jouer('ui_survol', { volume: 0.5 }), page: () => audio.jouer('ui_page') },
        preuves: [...jeu.etat.preuves],
        stats: { ...jeu.etat.stats },
        reduireMouvement: options.reduireMouvement,
      });
    } catch (e) {
      console.error('[defi]', def?.id, e);
    } finally {
      racineDefis.hidden = true;
      racineDefis.innerHTML = '';
    }
    audio.stinger(r.reussi ? 'victoire' : 'echec', { volume: 0.7 });
    entrees.activer(true);
    jeu.cinematique = false;
    direction.pause = false;
    bus.emit('ecran', { nom: 'jeu' });
    return r;
  }

  async function fin(issue) {
    jeu.enJeu = false;
    jeu.etat.fin = issue;
    sauvegarder(jeu.etat);
    entrees.activer(false);
    audio.themeMusical(issue === 'report' ? null : 'fin', { boucle: false });
    bus.emit('ecran', { nom: 'fin', issue, etat: jeu.etat });
  }

  function signaler(changements) {
    for (const c of changements || []) bus.emit('stat:changement', c);
  }

  function positionCible(cible) {
    const z = jeu.zone;
    if (!z || !cible) return null;
    const c = [].concat(cible)[0];
    if (typeof c !== 'string') return null;
    const m = z.interactions.find((x) => x.id === c) || z.spawns[c] || z.sieges[c];
    if (m) return m.position;
    const t = z.declencheurs.find((x) => x.id === c);
    if (t) return t.boite.getCenter(new THREE.Vector3()).applyMatrix4(t.objet.matrixWorld);
    const p = gestionPnj.liste.find((x) => `NPC_${x.id}` === c || x.id === c || x.role === c);
    if (p) return p.position;
    const porte = objets.portes.find((x) => x.id === c);
    if (porte) return porte.objet.getWorldPosition(new THREE.Vector3());
    const d = objets.dynamiques.find((x) => x.id === c);
    if (d) return d.objet.getWorldPosition(new THREE.Vector3());
    return null;
  }

  Object.assign(jeu, {
    allerZone, scene, defi, fin,
    deposer(obj) {
      if (jeu.joueur?.porte === obj) jeu.joueur.porte = null;
      objets.retirer(obj);
      audio.jouer('ui_page');
    },
    cibleObjectif(etape) {
      jeu.objectif = etape ? { etape, cible: etape.cible || etape.destination || null } : null;
    },
  });

  // ---------- événements du monde ----------
  bus.on('interaction', async (evt) => {
    if (jeu.cinematique || !jeu.enJeu) return;
    if (evt.type === 'point' && jeu.joueur?.porte) evt.porteObjet = jeu.joueur.porte;
    const pris = await missions.surInteraction(evt);
    if (pris) return;
    if (evt.type === 'pnj') {
      const p = evt.pnj;
      if (p.dialogue && dialogues.scene(p.dialogue)) await scene(p.dialogue);
      else dialogues.repliqueAuHasard(`pnj_${p.role}`, { pnj: p }) || dialogues.repliqueAuHasard('pnj_generique', { pnj: p });
      return;
    }
    for (const a of evt.actions || []) await actionGenerique(a, evt);
  });

  async function actionGenerique(a, evt) {
    const [cle, ...reste] = a.split(':');
    const val = reste.join(':');
    const e = jeu.etat;
    switch (cle) {
      case 'zone': {
        const [zid, sp] = val.split('@');
        await allerZone(zid, sp || `SPAWN_from_${jeu.zone?.id}`);
        missions.surArrivee(`zone:${zid}`);
        break;
      }
      case 'dialogue': await scene(val); break;
      case 'defi': {
        const def = missions.defis[val];
        if (def) await defi(def);
        break;
      }
      case 'cafe': {
        e.cafes = (e.cafes || 0) + 1;
        audio.jouer3d('cafe_machine', evt?.marqueur?.position || jeu.joueur.position);
        const effets = e.cafes > 3 ? { energie: 6, stress: 4 } : { energie: 14, stress: -2 };
        signaler(appliquerEffets(e, effets));
        bus.emit('toast', { texte: e.cafes > 3 ? `${e.cafes}e café de la journée. Tes mains tremblent un peu.` : 'Café de la machine. Énergie retrouvée.', type: 'info' });
        missions.hud();
        break;
      }
      case 'message': bus.emit('toast', { texte: val, type: 'info' }); break;
      case 'sit': { const s = jeu.zone.sieges[val]; if (s) jeu.joueur.asseoir(s); break; }
      case 'voyage': await voyage(); break;
      case 'patins': {
        jeu.joueur.patins = !jeu.joueur.patins;
        bus.emit('toast', { texte: jeu.joueur.patins ? 'Patins lacés. Direction la glace.' : 'Patins retirés.', type: 'info' });
        break;
      }
      case 'glace': {
        if (!jeu.joueur.patins) { bus.emit('toast', { texte: 'Pas sur la glace en souliers : va chausser tes patins au vestiaire.', type: 'alerte' }); break; }
        const sp = jeu.zone.spawns.SPAWN_glace;
        if (sp) jeu.joueur.placer(sp.position, jeu.joueur.lacet);
        break;
      }
      case 'banc': { const sp = jeu.zone.spawns.SPAWN_banc; if (sp) jeu.joueur.placer(sp.position, jeu.joueur.lacet); break; }
      default:
        bus.emit(`action:${cle}`, { valeur: val, evt });
    }
  }

  async function voyage() {
    const destinations = [
      { zone: 'campus', texte: 'Université-de-Montréal · campus' },
      { zone: 'clsc', texte: 'Centre-Sud · CLSC des Faubourgs' },
      { zone: 'arena', texte: 'CEPSUM · aréna' },
    ].filter((d) => d.zone !== jeu.zone?.id);
    const dispo = [];
    for (const d of destinations) {
      const ok = await fetch(`zones/${d.zone}/${d.zone}.json`, { method: 'HEAD' }).then((r) => r.ok).catch(() => false);
      if (ok) dispo.push(d);
    }
    if (!dispo.length) { bus.emit('toast', { texte: 'Le métro est en panne. Classique.', type: 'info' }); return; }
    entrees.liberer();
    bus.emit('dialogue:choix', { question: 'Prendre le métro vers…', options: [...dispo.map((d) => d.texte), 'Rester ici'] });
    const r = await bus.attendre('dialogue:reponse');
    const d = dispo[r.index];
    if (!d) return;
    audio.jouer('metro_carillon');
    await allerZone(d.zone, 'SPAWN_from_metro');
    missions.surArrivee(`zone:${d.zone}`);
  }

  bus.on('declencheur:entree', (t) => {
    missions.surArrivee(t.id);
    for (const a of t.actions) {
      if (a.startsWith('sol:')) jeu.joueur.surface = a.slice(4);
      else if (a === 'silence') jeu.dansSilence = true;
      else if (a.startsWith('but:')) bus.emit('but', { cote: a.slice(4) });
      else if (!a.startsWith('zone:')) actionGenerique(a, { marqueur: { position: jeu.joueur.position } });
      else actionGenerique(a, {});
    }
  });
  bus.on('declencheur:sortie', (t) => {
    for (const a of t.actions) {
      if (a.startsWith('sol:')) jeu.joueur.surface = jeu.zone.manifeste.sol || 'beton';
      if (a === 'silence') jeu.dansSilence = false;
    }
  });
  bus.on('joueur:bruit', () => {
    if (!jeu.dansSilence) return;
    const maintenant = performance.now();
    if (maintenant - (jeu.dernierChut || 0) < 9000) return;
    jeu.dernierChut = maintenant;
    const b = gestionPnj.trouver('bibliothecaire');
    dialogues.repliqueAuHasard('bibliothecaire_bruit', { pnj: b, position: b?.position });
    signaler(appliquerEffets(jeu.etat, { stress: 2 }));
  });
  bus.on('pnj:bouscule', (p) => {
    dialogues.repliqueAuHasard(`bouscule_${p.role}`, { pnj: p, position: p.position }) || dialogues.repliqueAuHasard('pnj_bouscule', { pnj: p, position: p.position });
  });
  bus.on('ramasse', ({ id, objet }) => missions.surRamasse(id, objet));
  bus.on('porte', ({ id, resultat }) => { if (resultat === 'ouvrir') missions.surOuverture(id); });
  bus.on('direction:rattrape', async ({ suivi }) => {
    const e = jeu.etat;
    e.suivis = suivi;
    const n = Math.min(suivi, 6);
    jeu.joueur.mode = 'cine';
    await scene(`suivi_${n}`) ;
    const def = missions.defis[`suivi_${n}`];
    let reussi = true;
    if (def) reussi = (await defi(def)).reussi;
    const effets = reussi ? { pression: -22, confiance: 6, stress: -3 } : { pression: -8, semaines: -1, stress: 9, confiance: -5 };
    signaler(appliquerEffets(e, effets));
    await scene(reussi ? `suivi_${n}_succes` : `suivi_${n}_echec`);
    direction.relacher(reussi ? 'succes' : 'echec');
    jeu.joueur.mode = 'libre';
    missions.hud();
    if (e.semaines <= 0) fin('report');
  });

  // ---------- interface → moteur ----------
  bus.on('partie:nouvelle', async () => {
    audio.demarrer();
    jeu.etat = etatInitial(scenario);
    direction.changerZone(jeu.zone);
    const premier = scenario.chapitres[0];
    if (params.has('zone')) await allerZone(params.get('zone'));
    else if (premier) await missions.demarrerChapitre(premier.id);
    else await allerZone('campus');
  });
  bus.on('partie:continuer', async () => {
    audio.demarrer();
    const e = chargerPartie();
    if (!e) return bus.emit('partie:nouvelle');
    jeu.etat = e;
    direction.changerZone(jeu.zone);
    if (e.chapitre) await missions.demarrerChapitre(e.chapitre, { reprise: true });
    else await allerZone(e.zone || 'campus', e.spawn);
  });
  bus.on('partie:chapitre', async ({ id }) => {
    audio.demarrer();
    jeu.etat = etatInitial(scenario);
    const i = scenario.chapitres.findIndex((c) => c.id === id);
    for (const c of scenario.chapitres.slice(0, Math.max(0, i))) jeu.etat.etapesFaites.push(...(c.etapes || []).map((x) => x.id));
    direction.changerZone(jeu.zone);
    await missions.demarrerChapitre(id);
  });
  bus.on('options', (o) => {
    Object.assign(options, o || {});
    sauverOptions(options);
    if (o && 'qualite' in o) rendu.appliquerQualite(options.qualite);
    audio.appliquerVolumes();
  });
  bus.on('pause', () => { if (!jeu.enJeu) return; jeu.pause = true; entrees.activer(false); bus.emit('ecran', { nom: 'pause' }); });
  bus.on('reprendre', () => { jeu.pause = false; entrees.activer(true); bus.emit('ecran', { nom: 'jeu' }); });
  bus.on('quitter', () => { sauvegarder(jeu.etat); location.reload(); });
  bus.on('camera:focus', ({ actif, distance }) => rendu.flou(!!actif, distance));
  bus.on('ui:son', ({ nom, volume } = {}) => audio.jouer(nom || 'ui_clic', { volume: volume ?? 0.6 }));
  window.addEventListener('pointerdown', () => audio.demarrer(), { once: false });
  window.addEventListener('keydown', () => audio.demarrer(), { once: true });

  // ---------- marqueur d'objectif dans le monde ----------
  const marqueur = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    g.translate(64, 64);
    g.rotate(Math.PI / 4);
    g.fillStyle = 'rgba(7,85,173,0.92)';
    g.strokeStyle = '#F6F4F1';
    g.lineWidth = 7;
    g.beginPath(); g.rect(-30, -30, 60, 60); g.fill(); g.stroke();
    g.rotate(-Math.PI / 4);
    g.fillStyle = '#F6F4F1';
    g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, depthWrite: false, transparent: true, sizeAttenuation: false, toneMapped: false }));
    s.scale.setScalar(0.03);
    s.renderOrder = 999;
    s.visible = false;
    rendu.scene.add(s);
    return s;
  })();
  function majMarqueur(t) {
    const j = jeu.joueur;
    const cible = jeu.enJeu && !jeu.cinematique && jeu.objectif ? positionCible(jeu.objectif.cible) : null;
    if (!cible || !j) { marqueur.visible = false; return; }
    const d = Math.hypot(cible.x - j.position.x, cible.z - j.position.z);
    marqueur.visible = d > 2.6;
    marqueur.position.set(cible.x, Math.max(cible.y, j.position.y) + 1.15 + Math.sin(t * 2.4) * 0.06, cible.z);
    marqueur.material.opacity = THREE.MathUtils.clamp((d - 2.6) / 4, 0, 0.9);
  }

  // ---------- écran-titre ----------
  const zoneTitre = params.get('zone') || ((await fetch('zones/campus/campus.json', { method: 'HEAD' }).then((r) => r.ok).catch(() => false)) ? 'campus' : 'test');
  try {
    const z = await chargerZone({ id: zoneTitre, rendu, physique, objets, chargeur, progression: (p) => bus.emit('chargement', { progression: p, zone: zoneTitre }) });
    installerZone(z, rendu);
    jeu.zone = z;
    jeu.ecranTitre = true;
    gestionPnj.zone = z;
    const sp = z.spawns.SPAWN_titre || z.spawns.SPAWN_player;
    const centre = sp ? sp.position.clone() : new THREE.Vector3();
    const cTitre = z.cameras.CAM_titre;
    if (cTitre) cam.plan(cTitre.position, cTitre.position.clone().add(new THREE.Vector3(0, -1, 0).applyQuaternion(cTitre.quaternion).multiplyScalar(10)), { fov: cTitre.fov, coupe: true });
    else cam.orbite({ centre, regard: centre.clone().add(new THREE.Vector3(0, 4, 0)), rayon: 16, hauteur: 5 });
  } catch (e) {
    console.error('[titre]', e);
  }
  await fondu(false, 1.2);
  bus.emit('ecran', { nom: 'titre' });
  audio.themeMusical('menu', { boucle: true });

  if (params.has('jouer')) bus.emit('partie:nouvelle');

  // ---------- boucle ----------
  let avant = performance.now();
  let accCarte = 0, accSauvegarde = 0;
  function boucle(t) {
    const dt = Math.min(0.05, (t - avant) / 1000);
    avant = t;
    etape(dt);
    rendu.rendre();
    requestAnimationFrame(boucle);
  }
  function etape(dt, entreesForcees) {
    const ent = entreesForcees ? { ...entrees.lire(dt), ...entreesForcees } : entrees.lire(dt);
    if (!ent.presses) ent.presses = new Set();
    const j = jeu.joueur;
    if (ent.presses.has('pause')) {
      if (jeu.pause) bus.emit('reprendre');
      else if (jeu.enJeu && !jeu.cinematique) bus.emit('pause');
    }
    if (jeu.cinematique && (ent.presses.has('confirmer') || ent.presses.has('interagir') || ent.presses.has('sauter'))) dialogues.passer();
    if (!jeu.pause) {
      if (jeu.enJeu && j) {
        if (ent.presses.has('journal') && !jeu.cinematique) bus.emit('ecran', { nom: 'journal' });
        if (ent.presses.has('carte') && !jeu.cinematique) bus.emit('ecran', { nom: 'carte' });
        j.mettreAJour(dt, ent, cam.lacet);
      }
      physique.avancer(dt);
      const acteurs = [j?.position, ...gestionPnj.liste.map((p) => p.position)];
      objets.mettreAJour(dt, acteurs);
      gestionPnj.mettreAJour(dt, j);
      if (jeu.enJeu && j) {
        direction.mettreAJour(dt, j);
        hockey.mettreAJour(dt, ent);
        objets.testerDeclencheurs(j.position);
        interactions.mettreAJour(jeu.zone, j, gestionPnj, ent, !jeu.cinematique && j.mode !== 'cine');
        // arrivée près d'une cible « aller »
        for (const etape of missions.etapesActives()) {
          if (etape.type !== 'aller' || etape.interagir) continue;
          const p = positionCible(etape.cible);
          if (p && Math.hypot(p.x - j.position.x, p.z - j.position.z) < (etape.rayon || 1.8) && Math.abs(p.y - j.position.y) < 2.5) missions.surArrivee([].concat(etape.cible)[0]);
        }
        jeu.etat.tempsJeu += dt;
      }
      cam.mettreAJour(dt, ent, j);
      majMarqueur(performance.now() / 1000);
      personnages.mettreAJour(dt, rendu.camera);
      audio.mettreAJourAuditeur(rendu.camera);
      accCarte += dt;
      if (accCarte > 0.1 && j && jeu.enJeu) {
        accCarte = 0;
        const cible = jeu.objectif ? positionCible(jeu.objectif.cible) : null;
        bus.emit('carte', {
          x: j.position.x, z: j.position.z, angle: j.lacet, camAngle: cam.lacet,
          pnj: gestionPnj.liste.map((p) => ({ x: p.position.x, z: p.position.z, direction: /^direction/.test(p.role) })),
          objectif: cible ? { x: cible.x, z: cible.z, distance: Math.hypot(cible.x - j.position.x, cible.z - j.position.z) } : null,
        });
      }
      accSauvegarde += dt;
      if (accSauvegarde > 15 && jeu.enJeu && j && !jeu.cinematique) {
        accSauvegarde = 0;
        jeu.etat.position = j.position.toArray();
        sauvegarder(jeu.etat);
      }
    }
  }
  requestAnimationFrame(boucle);
  const simuler = (secondes, entreesForcees, rendre = false) => {
    const n = Math.round(secondes * 60);
    for (let i = 0; i < n; i++) etape(1 / 60, entreesForcees ? { ...entreesForcees, presses: new Set(i === 0 ? (entreesForcees.presses || []) : []) } : null);
    if (rendre) rendu.rendre();
  };
  window.__protocole = { simuler, hockey, jeu, bus, entrees, interactions, rendu, physique, objets, gestionPnj, direction, missions, dialogues, cam, audio, THREE };
}

demarrer().catch((e) => {
  console.error(e);
  const m = document.getElementById('erreur');
  if (m) { m.hidden = false; m.textContent = 'Le jeu n’a pas pu démarrer sur ce navigateur. Essaie une version récente de Chrome, Edge, Firefox ou Safari.'; }
});
