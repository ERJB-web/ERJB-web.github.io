import * as THREE from 'three';

export function creerInteractions({ bus, objets, entrees }) {
  let candidat = null;
  let derniereInvite = '';
  const desactives = new Set();
  const libelles = new Map();
  const vTmp = new THREE.Vector3();
  const centre = new THREE.Vector3();

  function centrePorte(p) {
    return centre.copy(p.centreLocal).applyMatrix4(p.objet.matrixWorld);
  }

  function chercher(zone, joueur, gestionPnj) {
    if (!zone || !joueur) return null;
    const pos = joueur.position;
    const avant = joueur.avant();
    let meilleur = null, score = Infinity;
    const proposer = (c, d, cible) => {
      const dir = vTmp.copy(cible).sub(pos).setY(0);
      const l = dir.length() || 1;
      const face = dir.divideScalar(l).dot(avant);
      const s = d - face * 0.6;
      if (s < score) { score = s; meilleur = c; }
    };
    if (joueur.mode === 'assis') return { type: 'lever', texte: 'Se lever' };
    for (const m of zone.interactions) {
      if (desactives.has(m.id)) continue;
      const dy = Math.abs(m.position.y - pos.y - 1);
      const d = Math.hypot(m.position.x - pos.x, m.position.z - pos.z);
      if (d <= m.rayon && dy < 2.4) proposer({ type: 'point', id: m.id, texte: libelles.get(m.id) || m.label || 'Examiner', marqueur: m }, d, m.position);
    }
    for (const p of objets.portes) {
      if (!p.ancre) continue;
      const c = centrePorte(p);
      const d = Math.hypot(c.x - pos.x, c.z - pos.z);
      if (d > 1.75 || Math.abs(c.y - pos.y - 1) > 1.6) continue;
      const ouverte = Math.abs(objets.anglePorte(p)) > 0.31;
      const nom = p.label ? ` · ${p.label}` : '';
      const texte = p.verrou ? `Verrouillée${nom}` : ouverte ? `Fermer la porte${nom}` : `Ouvrir la porte${nom}`;
      proposer({ type: 'porte', porte: p, texte }, d + 0.2, c);
    }
    if (!joueur.porte) {
      for (const dyn of objets.dynamiques) {
        if (!dyn.prenable || dyn.tenu || desactives.has(dyn.id)) continue;
        const c = dyn.objet.getWorldPosition(new THREE.Vector3());
        const d = Math.hypot(c.x - pos.x, c.z - pos.z);
        if (d > 1.5 || Math.abs(c.y - pos.y - 0.9) > 1.4) continue;
        const nom = dyn.titre || dyn.label || 'l’objet';
        proposer({ type: 'objet', objet: dyn, texte: `Prendre · ${nom}` }, d, c);
      }
    }
    for (const n of gestionPnj?.liste || []) {
      if (/^direction/.test(n.role) || !n.nom || n.muet) continue;
      const d = n.position.distanceTo(pos);
      if (d > 2.3) continue;
      proposer({ type: 'pnj', pnj: n, texte: n.role === 'chienne' ? `Flatter · ${n.nom}` : `Parler · ${n.nom}` }, d + 0.1, n.position);
    }
    for (const s of Object.values(zone.sieges)) {
      if (desactives.has(s.id)) continue;
      const d = Math.hypot(s.position.x - pos.x, s.position.z - pos.z);
      if (d < 1.0) proposer({ type: 'siege', siege: s, texte: 'S’asseoir' }, d + 0.4, s.position);
    }
    if (!meilleur && joueur.porte) return { type: 'poser', texte: `Poser · ${joueur.porte.titre || joueur.porte.label || 'l’objet'}` };
    return meilleur;
  }

  function mettreAJour(zone, joueur, gestionPnj, etatEntrees, actif) {
    candidat = actif ? chercher(zone, joueur, gestionPnj) : null;
    const texte = candidat ? candidat.texte : '';
    if (texte !== derniereInvite) {
      derniereInvite = texte;
      bus.emit('invite', candidat ? { texte, touche: entrees.touche('interagir') } : null);
    }
    if (joueur?.porte) {
      const d = joueur.porte;
      const aide = /aide_patineur/i.test(d.id);
      const p = joueur.position.clone().addScaledVector(joueur.avant(), aide ? 0.55 : 0.42);
      p.y += aide ? d.demi.y + 0.01 : 1.05;
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), joueur.lacet);
      objets.porterVers(d, p, q);
    }
    if (!actif || !etatEntrees) return;
    if (etatEntrees.presses.has('lacher') && joueur?.porte) poser(joueur);
    if (etatEntrees.presses.has('interagir') && candidat) executer(candidat, joueur);
  }

  function poser(joueur) {
    const d = joueur.porte;
    if (!d) return;
    objets.lacher(d, joueur.vitesse.clone().multiplyScalar(0.6));
    joueur.porte = null;
    bus.emit('objet:pose', { id: d.id, objet: d });
  }

  function executer(c, joueur) {
    if (c.type === 'lever') { joueur.lever(); return; }
    if (c.type === 'poser') { poser(joueur); return; }
    if (c.type === 'porte') {
      const r = objets.actionnerPorte(c.porte, joueur.position);
      if (r !== 'verrouillee') joueur.jouerSpecial('push', 0.7);
      bus.emit('porte', { id: c.porte.id, resultat: r, porte: c.porte });
      return;
    }
    if (c.type === 'objet') {
      objets.prendre(c.objet);
      joueur.porte = c.objet;
      joueur.jouerSpecial('pickup', 0.6);
      bus.emit('ramasse', { id: c.objet.id, objet: c.objet });
      return;
    }
    if (c.type === 'siege') { joueur.asseoir(c.siege); bus.emit('assis', { id: c.siege.id }); return; }
    if (c.type === 'pnj') { bus.emit('interaction', { type: 'pnj', id: c.pnj.id, pnj: c.pnj }); return; }
    if (c.type === 'point') bus.emit('interaction', { type: 'point', id: c.id, actions: c.marqueur.actions, marqueur: c.marqueur });
  }

  return {
    mettreAJour,
    desactiver(id) { desactives.add(id); },
    activer(id) { desactives.delete(id); },
    libelle(id, texte) { if (texte) libelles.set(id, texte); else libelles.delete(id); },
    reinitialiser() { desactives.clear(); libelles.clear(); candidat = null; derniereInvite = ''; bus.emit('invite', null); },
    poser,
    get candidat() { return candidat; },
  };
}
