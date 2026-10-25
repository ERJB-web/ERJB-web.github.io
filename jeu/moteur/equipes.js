import * as THREE from 'three';

export const COULEURS_EQUIPES = {
  carabins: { principal: '#0d4ea6', secondaire: '#f3f5f7', nom: 'CARABINS' },
  visiteurs: { principal: '#b5121b', secondaire: '#131313', nom: 'VISITEURS' },
  arbitre: { principal: '#f0f0f0', secondaire: '#111111', rayures: true },
  canadiens: { principal: '#a6192e', secondaire: '#f3f3f3', nom: 'CANADIENS' },
  lnh_visiteurs: { principal: '#ededed', secondaire: '#1b2a4a', nom: 'VISITEURS' },
};

export const EFFECTIFS = {
  carabins: [
    { role: 'carabins_1', prenom: 'Bruno', numero: 9, nomDos: 'DESROCHERS', poste: 'C', alias: ['joueur_hockey_1'] },
    { role: 'carabins_2', prenom: 'Samuel', numero: 22, nomDos: 'BEAUSOLEIL', poste: 'C', alias: ['joueur_hockey_2'] },
    { role: 'carabins_3', prenom: 'Rachid', numero: 4, nomDos: 'HAMDANI', poste: 'D', alias: ['joueur_hockey_3'] },
    { role: 'carabins_4', prenom: 'Olivier', numero: 27, nomDos: 'VALLIÈRES', poste: 'D', alias: ['joueur_hockey_4'] },
    { role: 'carabins_5', prenom: 'Kim', numero: 19, nomDos: 'PHAN', poste: 'A', alias: ['joueur_hockey_5'] },
    { role: 'carabins_6', prenom: 'Étienne', numero: 71, nomDos: 'LANCTÔT', poste: 'A', alias: ['joueur_hockey_6'] },
    { role: 'carabins_7', prenom: 'Jérémie', numero: 12, nomDos: 'LÊ-CARON', poste: 'D' },
    { role: 'carabins_8', prenom: 'Hugo', numero: 3, nomDos: 'BOISCLAIR', poste: 'D' },
  ],
  visiteurs: [
    { role: 'visiteurs_1', prenom: 'Maxime', numero: 10, poste: 'C' },
    { role: 'visiteurs_2', prenom: 'Jordan', numero: 17, poste: 'A' },
    { role: 'visiteurs_3', prenom: 'Antoine', numero: 6, poste: 'A' },
    { role: 'visiteurs_4', prenom: 'Dylan', numero: 44, poste: 'D' },
    { role: 'visiteurs_5', prenom: 'Vincent', numero: 8, poste: 'D' },
    { role: 'visiteurs_6', prenom: 'Tristan', numero: 91, poste: 'C' },
    { role: 'visiteurs_7', prenom: 'Loïc', numero: 25, poste: 'D' },
    { role: 'visiteurs_8', prenom: 'Cédric', numero: 2, poste: 'D' },
  ],
  gardiens: {
    carabins: { role: 'carabins_gardien', prenom: 'Gaëtan', numero: 31, nomDos: 'PROVENCHER', alias: ['gardien'] },
    visiteurs: { role: 'visiteurs_gardien', prenom: 'Patrick', numero: 1 },
  },
  eric: { role: 'eric', prenom: 'Éric', nom: 'Bernier', numero: 15, poste: 'AD' },
};

const ligue = (prefixe, liste) => liste.map(([prenom, numero, poste], k) => ({ role: `${prefixe}_${k + 1}`, prenom, numero, poste }));
EFFECTIFS.canadiens = ligue('canadiens', [['Mathieu', 14, 'C'], ['Raphaël', 26, 'A'], ['Wilson', 8, 'D'], ['Frédérik', 53, 'D'], ['Zachary', 91, 'A'], ['Kenji', 40, 'C'], ['Charles', 6, 'D'], ['Anthony', 77, 'A']]);
EFFECTIFS.adversaires_lnh = ligue('adversaires_lnh', [['Nolan', 12, 'C'], ['Elias', 23, 'A'], ['Owen', 4, 'D'], ['Lucas', 2, 'D'], ['Aiden', 19, 'A'], ['Mason', 18, 'C'], ['Liam', 5, 'D'], ['Jack', 28, 'A']]);
EFFECTIFS.gardiens.canadiens = { role: 'canadiens_gardien', prenom: 'Simon', numero: 35, nomDos: 'LAVIGUEUR' };
EFFECTIFS.gardiens.adversaires_lnh = { role: 'adversaires_lnh_gardien', prenom: 'Ryan', numero: 30 };

export const TRIOS = {
  carabins: [
    { C: 'carabins_1', AG: 'carabins_5', AD: 'eric', DG: 'carabins_3', DD: 'carabins_4' },
    { C: 'carabins_2', AG: 'carabins_6', AD: 'eric', DG: 'carabins_8', DD: 'carabins_7' },
  ],
  visiteurs: [
    { C: 'visiteurs_1', AG: 'visiteurs_2', AD: 'visiteurs_3', DG: 'visiteurs_4', DD: 'visiteurs_5' },
    { C: 'visiteurs_6', AG: 'visiteurs_3', AD: 'visiteurs_2', DG: 'visiteurs_8', DD: 'visiteurs_7' },
  ],
  canadiens: [
    { C: 'canadiens_1', AG: 'canadiens_2', AD: 'canadiens_5', DG: 'canadiens_3', DD: 'canadiens_4' },
    { C: 'canadiens_6', AG: 'canadiens_8', AD: 'canadiens_2', DG: 'canadiens_7', DD: 'canadiens_3' },
  ],
  adversaires_lnh: [
    { C: 'adversaires_lnh_1', AG: 'adversaires_lnh_2', AD: 'adversaires_lnh_5', DG: 'adversaires_lnh_3', DD: 'adversaires_lnh_4' },
    { C: 'adversaires_lnh_6', AG: 'adversaires_lnh_8', AD: 'adversaires_lnh_2', DG: 'adversaires_lnh_7', DD: 'adversaires_lnh_3' },
  ],
};

const BELL = {
  match_annonce_debut: 'bell_annonceur', match_annonce_periode: 'bell_annonceur', match_annonce_prolongation: 'bell_annonceur', match_annonce_fin_periode: 'bell_annonceur',
  match_annonce_derniere_minute: 'bell_annonceur', match_annonce_but_eric: null, match_annonce_but_carabins: 'bell_but_canadiens', match_annonce_but_joueur: 'bell_but_joueur',
  match_annonce_but_visiteurs: 'bell_but_visiteurs', match_annonce_penalite: 'bell_penalite', foule_encouragement: 'bell_foule', match_gradins: 'bell_foule', foule_arret: 'bell_arret',
  match_arret_carabins: 'bell_arret', hockey_arret_gardien: null, match_arret_tir_eric: null, match_eric_arret: null, match_eric: null, eric_demande_passe: null, eric_but: null, eric_penalite: null,
  eric_mise_en_echec: null, hockey_but_eric: null, coequipier_but_eric: null, coequipier_but: null, coequipier_but_contre: null, coequipier_passe_eric: null, hockey_passe_demandee: null,
  coequipier_bravo: null, coequipier_attention: null, coequipier_jeu: null, adversaire_but: null, adversaire_penalite: null, adversaire_provocation: null, adversaire_vol: null,
  hockey_but_adverse: null, hockey_fin_victoire: null, hockey_fin_defaite: null, entraineur_match_debut: null, entraineur_match_banc: null, entraineur_match_but: null,
  entraineur_match_but_contre: null, entraineur_match_penalite: null, entraineur_match_avantage: null, entraineur_match_hors_jeu: null, entraineur_match_entracte: null,
  entraineur_match_fin_victoire: null, entraineur_match_fin_defaite: null,
};

export const CONFIGS = {
  carabins: {
    eric: true, entraineur: true, spectateurs: 340,
    equipes: {
      carabins: { effectif: EFFECTIFS.carabins, gardien: EFFECTIFS.gardiens.carabins, couleurs: COULEURS_EQUIPES.carabins, nom: 'CARABINS', trios: TRIOS.carabins },
      visiteurs: { effectif: EFFECTIFS.visiteurs, gardien: EFFECTIFS.gardiens.visiteurs, couleurs: COULEURS_EQUIPES.visiteurs, nom: 'VISITEURS', trios: TRIOS.visiteurs },
    },
    scenes: { avant: ['match_vestiaire', 'match_presentation'], entracte: { 1: 'match_entracte_1', 2: 'match_entracte_2' }, victoire: 'match_victoire', defaite: 'match_defaite' },
  },
  canadiens: {
    eric: false, entraineur: false, spectateurs: 2000, cles: BELL, sirene: true, fin: { victoire: 'bell_victoire', defaite: 'bell_defaite' },
    couleursFoule: ['#a6192e', '#a6192e', '#a6192e', '#a6192e', '#1d3c8f', '#1d3c8f', '#f3f3f3', '#f3f3f3', '#2b3a4a', '#1e2328', '#6d7378'],
    couleursFouleVisiteurs: ['#ededed', '#1b2a4a', '#1b2a4a'],
    equipes: {
      carabins: { effectif: EFFECTIFS.canadiens, gardien: EFFECTIFS.gardiens.canadiens, couleurs: COULEURS_EQUIPES.canadiens, nom: 'CANADIENS', trios: TRIOS.canadiens },
      visiteurs: { effectif: EFFECTIFS.adversaires_lnh, gardien: EFFECTIFS.gardiens.adversaires_lnh, couleurs: COULEURS_EQUIPES.lnh_visiteurs, nom: 'VISITEURS', trios: TRIOS.adversaires_lnh },
    },
    scenes: { avant: ['bell_siege'], entracte: { 1: 'bell_camera_foule' }, apres: 'bell_fin' },
  },
};

const MATERIAUX_EQUIPE = /equipement|chandail|maillot|jersey|culotte|jambiere|bloqueur|mitaine|gant|casque/i;
const GLSL = `
{
  vec3 cE = diffuseColor.rgb;
  float mxE = max(cE.r, max(cE.g, cE.b));
  float mnE = min(cE.r, min(cE.g, cE.b));
  float satE = mxE > 1e-4 ? (mxE - mnE) / mxE : 0.0;
  float lumE = dot(cE, vec3(0.2126, 0.7152, 0.0722));
  float wP = smoothstep(0.5, 0.68, satE) * smoothstep(0.003, 0.012, lumE);
  float wS = (1.0 - wP) * smoothstep(0.2, 0.42, lumE);
  vec3 pE = uPrincipal * clamp(lumE / 0.058, 0.45, 1.6);
  if (uRayures > 0.5) pE = mix(pE, uSecondaire * clamp(lumE / 0.058, 0.45, 1.3), step(0.5, fract(vPosEquipe.x * 9.0 + 0.25)));
  vec3 sE = uSecondaire * clamp(lumE / 0.62, 0.55, 1.15);
  diffuseColor.rgb = mix(mix(cE, sE, wS), pE, wP);
}
`;

const cacheMateriaux = new Map();
export function recolorer(racine, couleurs) {
  if (!racine || !couleurs) return;
  const cle = `${couleurs.principal}|${couleurs.secondaire}|${couleurs.rayures ? 1 : 0}`;
  const P = new THREE.Color(couleurs.principal), S = new THREE.Color(couleurs.secondaire);
  racine.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const nouveaux = mats.map((m) => {
      if (!m || !MATERIAUX_EQUIPE.test(m.name || '')) return m;
      const k = `${m.uuid}|${cle}`;
      if (cacheMateriaux.has(k)) return cacheMateriaux.get(k);
      const c = m.clone();
      c.onBeforeCompile = (sh) => {
        sh.uniforms.uPrincipal = { value: P };
        sh.uniforms.uSecondaire = { value: S };
        sh.uniforms.uRayures = { value: couleurs.rayures ? 1 : 0 };
        sh.vertexShader = `varying vec3 vPosEquipe;\n${sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vPosEquipe = position;')}`;
        sh.fragmentShader = `uniform vec3 uPrincipal;\nuniform vec3 uSecondaire;\nuniform float uRayures;\nvarying vec3 vPosEquipe;\n${sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>\n${GLSL}`)}`;
      };
      c.customProgramCacheKey = () => 'equipe_recoloree';
      cacheMateriaux.set(k, c);
      return c;
    });
    o.material = Array.isArray(o.material) ? nouveaux : nouveaux[0];
  });
}

export function equipeDuRole(role) {
  if (/^carabins/.test(role) || role === 'eric' || role === 'eric_hockey' || role === 'entraineur') return 'carabins';
  if (/^visiteurs/.test(role)) return 'visiteurs';
  if (/^arbitre/.test(role)) return 'arbitre';
  return null;
}
