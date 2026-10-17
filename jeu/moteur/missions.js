import { appliquerEffets, sauvegarder } from './etat.js?v=0a002b19d4';

export function creerMissions({ bus, jeu }) {
  let scenario = { chapitres: [] };
  let defis = {};
  let etapeCourante = null;
  let sousEtapes = null;
  let bonus = [];
  let occupe = false;
  const essais = new Map();

  function charger(s, d) {
    scenario = s || { chapitres: [] };
    const brut = Array.isArray(d) ? d : (d?.defis ?? d ?? {});
    const liste = Array.isArray(brut) ? brut : Object.values(brut);
    defis = {};
    for (const x of liste) if (x?.id) defis[x.id] = x;
  }

  const chapitre = (id) => scenario.chapitres.find((c) => c.id === id);
  const etat = () => jeu.etat;

  function trouverEtape(id) {
    for (const c of scenario.chapitres) {
      const e = (c.etapes || []).find((x) => x.id === id);
      if (e) return { chapitre: c, etape: e };
      for (const x of c.etapes || []) {
        const s = (x.etapes || []).find((y) => y.id === id);
        if (s) return { chapitre: c, etape: s, parent: x };
      }
    }
    return null;
  }

  function condition(e) {
    if (!e.si) return true;
    const conds = [].concat(e.si);
    return conds.every((c) => {
      if (typeof c !== 'string') return true;
      if (c.startsWith('!')) return !etat().drapeaux[c.slice(1)];
      if (c.includes('=')) { const [k, v] = c.split('='); return String(etat().drapeaux[k]) === v; }
      return !!etat().drapeaux[c];
    });
  }

  function etapeSuivanteDans(ch, idActuel) {
    const liste = ch.etapes || [];
    let i = liste.findIndex((e) => e.id === idActuel);
    for (i = i + 1; i < liste.length; i++) if (condition(liste[i])) return liste[i];
    return null;
  }

  function hud() {
    const e = etat();
    bus.emit('hud', { stats: { ...e.stats }, semaines: e.semaines, pression: e.pression, objectif: etapeCourante?.objectif || '', preuves: e.preuves.length, chapitre: chapitre(e.chapitre)?.titre || '' });
  }

  async function demarrerChapitre(id, { reprise = false } = {}) {
    const ch = chapitre(id);
    if (!ch) return;
    const e = etat();
    e.chapitre = id;
    bonus = [];
    bus.emit('chapitre', { id, titre: ch.titre, numero: scenario.chapitres.indexOf(ch) + 1, sousTitre: ch.sousTitre || '' });
    if (jeu.zone?.id !== ch.zone || !jeu.joueur || jeu.ecranTitre) await jeu.allerZone(ch.zone, reprise ? e.spawn : (ch.spawn || null));
    if (!reprise && ch.intro) await jeu.scene(ch.intro);
    const premiere = reprise && e.etape ? trouverEtape(e.etape)?.etape : (ch.etapes || []).find(condition);
    await activer(premiere);
  }

  async function activer(etape) {
    sousEtapes = null;
    etapeCourante = etape || null;
    const e = etat();
    e.etape = etape?.id || null;
    sauvegarder(e);
    if (!etape) { await finChapitre(); return; }
    jeu.cibleObjectif(etape);
    hud();
    if (etape.objectif) bus.emit('objectif', { texte: etape.objectif, id: etape.id });
    switch (etape.type) {
      case 'dialogue':
        await jeu.scene(etape.scene);
        await terminer(etape, true);
        break;
      case 'defi':
        if (etape.auto !== false && !etape.cible) await lancerDefi(etape);
        break;
      case 'choix_libre': {
        const subs = (etape.etapes || []).filter(condition).filter((x) => !etat().etapesFaites.includes(x.id));
        const minimum = etape.minimum ?? etape.requis ?? subs.length;
        if (minimum <= 0) {
          bonus.push(...subs);
          await terminer(etape, true);
        } else sousEtapes = new Set(subs.map((x) => x.id));
        break;
      }
      case 'fin': {
        let sceneFin = etape.scene;
        let issue = etape.issue || (/correction/.test(etape.scene || '') ? 'corrections' : 'reussite');
        for (const v of etape.variantes || []) {
          if ([].concat(v.si || []).every((f) => etat().drapeaux[f])) { sceneFin = v.scene; if (v.issue) issue = v.issue; else if (/felicit/.test(v.scene)) issue = 'felicitations'; break; }
        }
        if (sceneFin) await jeu.scene(sceneFin);
        await jeu.fin(issue, etape);
        break;
      }
      case 'exercice':
        lancerExercice(etape);
        break;
      default:
        break;
    }
  }

  function lancerExercice(etape) {
    jeu.exercice?.(etape, async (reussi, details) => {
      const n = (essais.get(etape.id) || 0) + 1;
      essais.set(etape.id, n);
      const e = etape.echec || {};
      if (!reussi && e.reessayer && n < (e.essaisMax ?? 3)) {
        appliquerEffets(etat(), e.effets);
        hud();
        setTimeout(() => lancerExercice(etape), 1800);
        return;
      }
      await terminer(etape, reussi, details);
    });
  }

  async function lancerDefi(etape, idDefi) {
    const def = defis[idDefi || etape.defi];
    if (!def) { await terminer(etape, true); return; }
    occupe = true;
    const r = await jeu.defi(def);
    occupe = false;
    etat().defis[def.id] = { reussi: r.reussi, score: r.score };
    const effetsDefi = def.effets?.[r.reussi ? 'succes' : 'echec'];
    const changements = [...appliquerEffets(etat(), effetsDefi), ...appliquerEffets(etat(), r.details?.effets)];
    const brillante = scenario.regles?.reussiteBrillante;
    if (r.reussi && brillante && r.score >= (brillante.seuil ?? 0.9)) changements.push(...appliquerEffets(etat(), { pression: brillante.pression ?? -10 }));
    if (r.reussi) for (const sec of scenario.protocole || []) if (sec.defi === def.id) { etat().protocole[sec.section] = sec.texte; bus.emit('journal:maj', { section: sec.section }); }
    signalerChangements(changements);
    await terminer(etape, r.reussi, r);
  }

  function signalerChangements(ch) {
    for (const c of ch) bus.emit('stat:changement', c);
  }

  async function terminer(etape, reussi = true, details = null) {
    if (!etape) return;
    const e = etat();
    const branche = reussi ? (etape.succes || {}) : (etape.echec || {});
    const changements = [
      ...appliquerEffets(e, etape.effets),
      ...appliquerEffets(e, branche),
      ...appliquerEffets(e, branche.effets),
    ];
    signalerChangements(changements);
    if (!e.etapesFaites.includes(etape.id)) e.etapesFaites.push(etape.id);
    if (branche.scene) await jeu.scene(branche.scene);
    if (!reussi) bus.emit('echec', { etape: etape.id, pression: e.pression });
    hud();
    if (e.semaines <= 0) { await jeu.fin('report'); return; }
    // sous-étape facultative menée en parallèle
    const ib = bonus.indexOf(etape);
    if (ib >= 0) { bonus.splice(ib, 1); hud(); return; }
    // sous-étape d'un choix libre
    if (sousEtapes && etapeCourante && etapeCourante.type === 'choix_libre' && sousEtapes.has(etape.id)) {
      sousEtapes.delete(etape.id);
      const requis = etapeCourante.minimum ?? etapeCourante.requis ?? (etapeCourante.etapes || []).length;
      const faits = (etapeCourante.etapes || []).filter((x) => e.etapesFaites.includes(x.id)).length;
      if (sousEtapes.size === 0 || faits >= requis) {
        const restantes = (etapeCourante.etapes || []).filter((x) => sousEtapes.has(x.id));
        bonus.push(...restantes);
        sousEtapes = null;
        return terminer(etapeCourante, true);
      }
      hud();
      return;
    }
    if (etape !== etapeCourante && etapeCourante?.type !== 'choix_libre') return;
    const ch = chapitre(e.chapitre);
    let suivante = null;
    if (branche.suivante) suivante = trouverEtape(branche.suivante)?.etape || null;
    else if (etape.suivante) suivante = trouverEtape(etape.suivante)?.etape || null;
    else suivante = etapeSuivanteDans(ch, etape.id);
    await activer(suivante);
  }

  async function finChapitre() {
    const e = etat();
    const ch = chapitre(e.chapitre);
    const i = scenario.chapitres.indexOf(ch);
    if (ch?.fin) await jeu.scene(ch.fin);
    bus.emit('chapitre:fin', { id: ch?.id });
    const prochain = scenario.chapitres[i + 1];
    if (prochain) await demarrerChapitre(prochain.id);
    else await jeu.fin('reussite');
  }

  function etapesActives() {
    const liste = [];
    if (etapeCourante) {
      if (etapeCourante.type === 'choix_libre') liste.push(...(etapeCourante.etapes || []).filter((x) => sousEtapes?.has(x.id)));
      else liste.push(etapeCourante);
    }
    liste.push(...bonus);
    return liste;
  }

  function correspond(etape, cible) {
    if (!etape?.cible) return false;
    return [].concat(etape.cible).includes(cible);
  }

  // Événements du monde → progression
  async function surInteraction(evt) {
    if (occupe) return true;
    for (const etape of etapesActives()) {
      const id = evt.type === 'pnj' ? (evt.pnj.id) : evt.id;
      if (etape.type === 'ramasser' && etape.destination === id && evt.porteObjet && correspond(etape, evt.porteObjet.id)) {
        jeu.deposer?.(evt.porteObjet);
        if (etape.scene) await jeu.scene(etape.scene);
        await terminer(etape, true);
        return true;
      }
      const cibles = [id, evt.type === 'pnj' ? `NPC_${evt.pnj.id}` : null, evt.type === 'pnj' ? evt.pnj.role : null].filter(Boolean);
      if (!cibles.some((c) => correspond(etape, c))) continue;
      if (etape.type === 'parler' || etape.type === 'aller') {
        if (etape.scene) await jeu.scene(etape.scene);
        if (etape.defi) { await lancerDefi(etape); return true; }
        await terminer(etape, true);
        return true;
      }
      if (etape.type === 'defi') { if (etape.scene) await jeu.scene(etape.scene); await lancerDefi(etape); return true; }
      if (etape.type === 'dialogue') { await jeu.scene(etape.scene); await terminer(etape, true); return true; }
      if (etape.type === 'ramasser' && etape.destination === id && evt.porteObjet && correspond(etape, evt.porteObjet.id)) {
        jeu.deposer?.(evt.porteObjet);
        if (etape.scene) await jeu.scene(etape.scene);
        await terminer(etape, true);
        return true;
      }
    }
    return false;
  }

  async function surArrivee(cible) {
    if (occupe) return;
    for (const etape of etapesActives()) {
      if (etape.type === 'aller' && correspond(etape, cible) && !etape.interagir) {
        if (etape.scene) await jeu.scene(etape.scene);
        await terminer(etape, true);
        return;
      }
    }
  }

  async function surRamasse(id, objet) {
    for (const etape of etapesActives()) {
      if (etape.type === 'ramasser' && correspond(etape, id) && !etape.destination) {
        if (etape.scene) await jeu.scene(etape.scene);
        await terminer(etape, true);
        return;
      }
    }
    void objet;
  }

  async function surOuverture(id) {
    for (const etape of etapesActives()) {
      if (etape.type === 'ouvrir' && correspond(etape, id)) { await terminer(etape, true); return; }
    }
  }

  function arreter() {
    etapeCourante = null;
    sousEtapes = null;
    bonus = [];
  }

  return {
    charger, demarrerChapitre, activer, terminer, lancerDefi, hud, arreter,
    get bonus() { return bonus; },
    surInteraction, surArrivee, surRamasse, surOuverture,
    etapesActives, trouverEtape,
    get etape() { return etapeCourante; },
    get scenario() { return scenario; },
    get defis() { return defis; },
    get occupe() { return occupe; },
    set occupe(v) { occupe = v; },
  };
}
