import * as THREE from 'three';

export function creerAudio({ base = 'audio', options }) {
  let ctx = null;
  let maitre, busMusique, busVoix, busEffets, busAmbiance, compresseur;
  const tampons = new Map();
  const manquants = new Set();
  const voixActives = new Map();
  const tmpAvant = new THREE.Vector3(), tmpHaut = new THREE.Vector3();
  let duck = 1;

  function demarrer() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC({ latencyHint: 'interactive' });
    compresseur = ctx.createDynamicsCompressor();
    compresseur.threshold.value = -10;
    compresseur.ratio.value = 3;
    maitre = ctx.createGain();
    maitre.connect(compresseur).connect(ctx.destination);
    busMusique = ctx.createGain(); busMusique.connect(maitre);
    busVoix = ctx.createGain(); busVoix.connect(maitre);
    busEffets = ctx.createGain(); busEffets.connect(maitre);
    busAmbiance = ctx.createGain(); busAmbiance.connect(maitre);
    appliquerVolumes();
  }

  function appliquerVolumes() {
    if (!ctx) return;
    const t = ctx.currentTime;
    maitre.gain.setTargetAtTime(options.volumeGeneral ?? 0.9, t, 0.05);
    busMusique.gain.setTargetAtTime((options.volumeMusique ?? 0.6) * duck, t, 0.3);
    busVoix.gain.setTargetAtTime(options.volumeVoix ?? 1, t, 0.05);
    busEffets.gain.setTargetAtTime(options.volumeEffets ?? 0.85, t, 0.05);
    busAmbiance.gain.setTargetAtTime((options.volumeEffets ?? 0.85) * 0.8, t, 0.3);
  }

  async function tampon(chemin) {
    if (!ctx) return null;
    if (tampons.has(chemin)) return tampons.get(chemin);
    if (manquants.has(chemin)) return null;
    const p = fetch(chemin).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((b) => ctx.decodeAudioData(b))
      .catch(() => { manquants.add(chemin); tampons.delete(chemin); return null; });
    tampons.set(chemin, p);
    return p;
  }

  const sfx = (nom) => `${base}/sfx/${nom}.mp3`;
  const piste = (nom) => `${base}/musique/${nom}.mp3`;

  async function jouer(nom, { volume = 1, hauteur = 1, bus = 'effets', retard = 0, filtre = 0, debut = 0, duree = 0 } = {}) {
    if (!ctx) return null;
    const b = await tampon(sfx(nom));
    if (!b) return null;
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = hauteur;
    const g = ctx.createGain();
    g.gain.value = volume;
    let entree = g;
    if (filtre > 0) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filtre;
      f.connect(g);
      entree = f;
    }
    src.connect(entree);
    g.connect(bus === 'ui' || bus === 'effets' ? busEffets : busAmbiance);
    const t0 = ctx.currentTime + Math.max(0, retard);
    if (duree > 0) {
      g.gain.setValueAtTime(volume, t0 + Math.max(0, duree - 0.25));
      g.gain.linearRampToValueAtTime(0, t0 + duree);
      src.start(t0, debut, duree);
    } else src.start(t0, debut);
    return src;
  }

  async function boucle(nom, { volume = 0.3, hauteur = 1, filtre = 0, bus = 'ambiance' } = {}) {
    if (!ctx) return null;
    const b = await tampon(sfx(nom));
    if (!b) return null;
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.loop = true;
    src.playbackRate.value = hauteur;
    const g = ctx.createGain();
    g.gain.value = 0;
    let entree = g;
    let f = null;
    if (filtre > 0) {
      f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filtre;
      f.connect(g);
      entree = f;
    }
    src.connect(entree);
    g.connect(bus === 'effets' ? busEffets : busAmbiance);
    src.start(ctx.currentTime, Math.random() * b.duration);
    g.gain.setTargetAtTime(volume, ctx.currentTime, 0.8);
    return {
      regler(v, { filtre: fr, constante = 0.6 } = {}) {
        g.gain.setTargetAtTime(v, ctx.currentTime, constante);
        if (f && fr) f.frequency.setTargetAtTime(fr, ctx.currentTime, constante);
      },
      arreter(fondu = 1.2) {
        g.gain.setTargetAtTime(0, ctx.currentTime, fondu / 3);
        setTimeout(() => { try { src.stop(); } catch { /* arrêtée */ } }, fondu * 1000 + 300);
      },
    };
  }

  async function jouer3d(nom, position, { volume = 1, hauteur = 1, distanceRef = 2, max = 40 } = {}) {
    if (!ctx || !position) return null;
    const b = await tampon(sfx(nom));
    if (!b) return null;
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = hauteur;
    const g = ctx.createGain();
    g.gain.value = volume;
    const pan = ctx.createPanner();
    pan.panningModel = 'HRTF';
    pan.distanceModel = 'inverse';
    pan.refDistance = distanceRef;
    pan.maxDistance = max;
    pan.rolloffFactor = 1.1;
    pan.positionX.value = position.x; pan.positionY.value = position.y; pan.positionZ.value = position.z;
    src.connect(g).connect(pan).connect(busEffets);
    src.start();
    return src;
  }

  // ---------- voix ----------
  async function jouerVoix(id, { perso = null, position = null, volume = 1 } = {}) {
    if (!ctx) return null;
    const b = await tampon(`${base}/voix/fr/${id}.mp3`);
    if (!b) return null;
    const src = ctx.createBufferSource();
    src.buffer = b;
    const g = ctx.createGain();
    g.gain.value = volume;
    const an = ctx.createAnalyser();
    an.fftSize = 512;
    let sortie = g;
    if (position) {
      const pan = ctx.createPanner();
      pan.panningModel = 'HRTF';
      pan.refDistance = 3;
      pan.positionX.value = position.x; pan.positionY.value = position.y; pan.positionZ.value = position.z;
      g.connect(pan);
      sortie = pan;
    }
    src.connect(an);
    an.connect(g);
    sortie.connect(busVoix);
    const donnees = new Float32Array(an.fftSize);
    const entree = { src, an, donnees, perso };
    if (perso) voixActives.set(perso, entree);
    duckMusique(0.45);
    src.start();
    return new Promise((ok) => {
      src.onended = () => {
        if (perso && voixActives.get(perso) === entree) voixActives.delete(perso);
        if (!voixActives.size) duckMusique(1);
        ok(true);
      };
      entree.arreter = () => { try { src.stop(); } catch { /* déjà arrêtée */ } };
    }).then(() => true);
  }

  function arreterVoix() {
    for (const v of voixActives.values()) v.arreter?.();
    voixActives.clear();
    duckMusique(1);
  }

  function amplitudeVoix(perso) {
    const v = voixActives.get(perso);
    if (!v) return 0;
    v.an.getFloatTimeDomainData(v.donnees);
    let s = 0;
    for (let i = 0; i < v.donnees.length; i++) s += v.donnees[i] * v.donnees[i];
    return Math.min(1, Math.sqrt(s / v.donnees.length) * 6);
  }

  function duckMusique(f) {
    duck = f;
    if (ctx) busMusique.gain.setTargetAtTime((options.volumeMusique ?? 0.6) * duck, ctx.currentTime, 0.4);
  }

  // ---------- ambiance ----------
  let ambiance = null;
  async function changerAmbiance(nom) {
    if (!ctx) return;
    if (ambiance?.nom === nom) return;
    const ancienne = ambiance;
    ambiance = { nom };
    if (ancienne?.g) {
      ancienne.g.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
      setTimeout(() => { try { ancienne.src.stop(); } catch { /* arrêtée */ } }, 4000);
    }
    if (!nom) return;
    const b = await tampon(sfx(nom));
    if (!b || ambiance.nom !== nom) return;
    const src = ctx.createBufferSource();
    src.buffer = b; src.loop = true;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(g).connect(busAmbiance);
    src.start();
    g.gain.setTargetAtTime(0.9, ctx.currentTime, 1.2);
    ambiance.src = src; ambiance.g = g;
  }

  // ---------- musique : séquences avec silences, couche de tension ----------
  const directeur = { liste: [], courant: null, minuterie: null, mode: 'sequences', derniere: null, tension: null, niveauTension: 0, unique: null };

  async function existe(nom) { return !!(await tampon(piste(nom))); }

  async function listePour(theme) {
    const candidats = [theme, `${theme}_1`, `${theme}_2`, `${theme}_3`, `${theme}_4`];
    const ok = [];
    for (const c of candidats) if (await existe(c)) ok.push(c);
    return ok;
  }

  function arreterPiste(p, fondu = 2.5) {
    if (!p || !ctx) return;
    p.g.gain.cancelScheduledValues(ctx.currentTime);
    p.g.gain.setTargetAtTime(0, ctx.currentTime, fondu / 3);
    setTimeout(() => { try { p.src.stop(); } catch { /* arrêtée */ } }, fondu * 1000 + 500);
  }

  async function lancerPiste(nom, { boucle = false, volume = 1, fondu = 3 } = {}) {
    const b = await tampon(piste(nom));
    if (!b) return null;
    const src = ctx.createBufferSource();
    src.buffer = b; src.loop = boucle;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(g).connect(busMusique);
    src.start();
    g.gain.setTargetAtTime(volume, ctx.currentTime, fondu / 3);
    return { nom, src, g, duree: b.duration, debut: ctx.currentTime };
  }

  async function themeMusical(theme, { boucle = false, immediat = true } = {}) {
    if (!ctx) { directeur.themeEnAttente = { theme, boucle }; return; }
    clearTimeout(directeur.minuterie);
    directeur.theme = theme;
    directeur.boucle = boucle;
    directeur.liste = theme ? await listePour(theme) : [];
    if (directeur.theme !== theme) return;
    arreterPiste(directeur.courant);
    directeur.courant = null;
    if (!theme || !directeur.liste.length) return;
    if (immediat) suivante();
    else directeur.minuterie = setTimeout(suivante, 8000 + Math.random() * 12000);
  }

  async function suivante() {
    const theme = directeur.theme;
    const choix = directeur.liste.filter((n) => n !== directeur.derniere);
    const nom = (choix.length ? choix : directeur.liste)[Math.floor(Math.random() * (choix.length || directeur.liste.length))];
    if (!nom) return;
    directeur.derniere = nom;
    const p = await lancerPiste(nom, { boucle: directeur.boucle, volume: 0.9 });
    if (!p || directeur.theme !== theme) { arreterPiste(p, 0.5); return; }
    directeur.courant = p;
    if (!directeur.boucle) {
      p.src.onended = () => {
        if (directeur.courant !== p) return;
        directeur.courant = null;
        const silence = 60000 + Math.random() * 110000;
        directeur.minuterie = setTimeout(() => { if (directeur.theme === theme) suivante(); }, silence);
      };
    }
  }

  async function stinger(nom, { volume = 1 } = {}) {
    if (!ctx) return;
    duckMusique(0.25);
    const p = await lancerPiste(nom, { boucle: false, volume, fondu: 0.05 });
    if (p) p.src.onended = () => { if (!voixActives.size) duckMusique(1); };
    else duckMusique(1);
  }

  async function regler_tension(niveau, theme = 'tension') {
    if (!ctx) return;
    directeur.niveauTension = niveau;
    if (niveau > 0.02 && !directeur.tension) {
      directeur.tension = { chargement: true };
      const nom = (await existe(`${theme}_${directeur.theme}`)) ? `${theme}_${directeur.theme}` : theme;
      const p = await lancerPiste(nom, { boucle: true, volume: 0, fondu: 0.5 });
      directeur.tension = p;
    }
    const t = directeur.tension;
    if (t?.g) {
      t.g.gain.setTargetAtTime(Math.min(1, niveau) * 1.0, ctx.currentTime, 0.6);
      if (directeur.courant) directeur.courant.g.gain.setTargetAtTime(0.9 * (1 - Math.min(0.7, niveau)), ctx.currentTime, 0.8);
      if (niveau <= 0.02) {
        arreterPiste(t, 4);
        directeur.tension = null;
      }
    }
  }

  function mettreAJourAuditeur(camera) {
    if (!ctx) return;
    const l = ctx.listener;
    const p = camera.position;
    camera.getWorldDirection(tmpAvant);
    tmpHaut.set(0, 1, 0).applyQuaternion(camera.quaternion);
    if (l.positionX) {
      const t = ctx.currentTime;
      l.positionX.setValueAtTime(p.x, t); l.positionY.setValueAtTime(p.y, t); l.positionZ.setValueAtTime(p.z, t);
      l.forwardX.setValueAtTime(tmpAvant.x, t); l.forwardY.setValueAtTime(tmpAvant.y, t); l.forwardZ.setValueAtTime(tmpAvant.z, t);
      l.upX.setValueAtTime(tmpHaut.x, t); l.upY.setValueAtTime(tmpHaut.y, t); l.upZ.setValueAtTime(tmpHaut.z, t);
    } else {
      l.setPosition(p.x, p.y, p.z);
      l.setOrientation(tmpAvant.x, tmpAvant.y, tmpAvant.z, tmpHaut.x, tmpHaut.y, tmpHaut.z);
    }
  }

  return {
    demarrer() {
      demarrer();
      if (directeur.themeEnAttente) { const t = directeur.themeEnAttente; directeur.themeEnAttente = null; themeMusical(t.theme, { boucle: t.boucle }); }
    },
    get pret() { return !!ctx; },
    appliquerVolumes,
    jouer, jouer3d, jouerVoix, arreterVoix, amplitudeVoix, boucle,
    get contexte() { return ctx; },
    changerAmbiance, themeMusical, stinger, tension: regler_tension,
    mettreAJourAuditeur,
    precharger(noms) { if (ctx) for (const n of noms) tampon(sfx(n)); },
    prechargerVoix(ids) { if (ctx) for (const id of ids) tampon(`${base}/voix/fr/${id}.mp3`); },
  };
}
