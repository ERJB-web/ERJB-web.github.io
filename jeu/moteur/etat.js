const CLE = 'protocole.partie.v1';
const CLE_OPTIONS = 'protocole.options.v1';

export const OPTIONS_DEFAUT = {
  qualite: 'auto',
  volumeGeneral: 0.9,
  volumeMusique: 0.6,
  volumeVoix: 1.0,
  volumeEffets: 0.85,
  sousTitres: true,
  tailleSousTitres: 'normale',
  sensibilite: 1.0,
  inverserY: false,
  clavier: 'auto',
  reduireMouvement: false,
  contraste: false,
};

export function etatInitial(scenario) {
  const s = scenario?.stats || {};
  return {
    version: 1,
    chapitre: scenario?.chapitres?.[0]?.id || null,
    etape: null,
    etapesFaites: [],
    zone: scenario?.chapitres?.[0]?.zone || 'campus',
    spawn: null,
    position: null,
    semaines: scenario?.semainesDepart ?? 14,
    stats: {
      rigueur: s.rigueur ?? 30,
      energie: s.energie ?? 80,
      stress: s.stress ?? 15,
      confiance: s.confiance ?? 50,
    },
    pression: 0,
    suivis: 0,
    drapeaux: {},
    preuves: [],
    protocole: {},
    journal: [],
    defis: {},
    debut: Date.now(),
    tempsJeu: 0,
    fin: null,
  };
}

export function sauvegarder(etat) {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
    return true;
  } catch {
    return false;
  }
}

export function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const e = JSON.parse(brut);
    return e && e.version === 1 ? e : null;
  } catch {
    return null;
  }
}

export function effacer() {
  try { localStorage.removeItem(CLE); } catch { /* stockage indisponible */ }
}

export function chargerOptions() {
  try {
    const brut = localStorage.getItem(CLE_OPTIONS);
    return { ...OPTIONS_DEFAUT, ...(brut ? JSON.parse(brut) : {}) };
  } catch {
    return { ...OPTIONS_DEFAUT };
  }
}

export function sauverOptions(o) {
  try { localStorage.setItem(CLE_OPTIONS, JSON.stringify(o)); } catch { /* stockage indisponible */ }
}

const borner = (v) => Math.max(0, Math.min(100, v));

export function appliquerEffets(etat, effets) {
  if (!effets) return [];
  const changements = [];
  const st = effets.stats || {};
  for (const [k, v] of Object.entries(st)) {
    if (k in etat.stats && typeof v === 'number') {
      const avant = etat.stats[k];
      etat.stats[k] = borner(avant + v);
      if (etat.stats[k] !== avant) changements.push({ stat: k, delta: etat.stats[k] - avant });
    }
  }
  for (const k of ['rigueur', 'energie', 'stress', 'confiance']) {
    if (typeof effets[k] === 'number') {
      const avant = etat.stats[k];
      etat.stats[k] = borner(avant + effets[k]);
      if (etat.stats[k] !== avant) changements.push({ stat: k, delta: etat.stats[k] - avant });
    }
  }
  if (typeof effets.semaines === 'number') {
    etat.semaines = Math.max(0, etat.semaines + effets.semaines);
    changements.push({ stat: 'semaines', delta: effets.semaines });
  }
  if (typeof effets.pression === 'number') {
    etat.pression = borner(etat.pression + effets.pression);
    changements.push({ stat: 'pression', delta: effets.pression });
  }
  if (Array.isArray(effets.drapeaux)) for (const f of effets.drapeaux) etat.drapeaux[f] = true;
  else if (effets.drapeaux && typeof effets.drapeaux === 'object') Object.assign(etat.drapeaux, effets.drapeaux);
  else if (typeof effets.drapeaux === 'string') etat.drapeaux[effets.drapeaux] = true;
  const preuves = effets.preuves ? [].concat(effets.preuves) : [];
  for (const p of preuves) {
    if (p && !etat.preuves.includes(p)) {
      etat.preuves.push(p);
      changements.push({ preuve: p });
    }
  }
  if (effets.protocole) Object.assign(etat.protocole, effets.protocole);
  return changements;
}
