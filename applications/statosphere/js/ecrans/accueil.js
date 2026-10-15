/* 00 · Accueil : tableau de bord (bandeau de Sigma, anneaux de progression, conseil de Sigma, prochaines échéances, carte « Aujourd'hui »). */
import * as M from "../modele.js";
import * as E from "../etat.js";
import * as T from "../tuteur.js";
import * as Plan from "../plan.js";
import { tete } from "../dessins.js";
import { ico, icoPlein } from "../icones.js";
import { anneau, barre } from "../ui.js";
import { esc, jour, dateLongue, dateCourte, ecart, insecables, S } from "../outils.js";

const COULEURS = { Diapos: "var(--sarcelle)", Questions: "var(--orange)", Cartes: "var(--vert)", Exercices: "var(--violet)" };
const PALETTE_PLAN = ["var(--bleu)", "var(--sarcelle)", "var(--vert)", "var(--orange)", "var(--bleu-profond)", "var(--ampoule)"];
export const couleurPlan = n => (n <= 0 ? "var(--erreur)" : PALETTE_PLAN[(n - 1) % PALETTE_PLAN.length]);
export const duree = m => (m < 60 ? `${m} min` : m % 60 === 0 ? `${m / 60} h` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`);
export function quand(j, auj) { const n = ecart(auj, j); return n <= 0 ? "aujourd'hui" : n === 1 ? "demain" : n < 14 ? `dans ${n} jours` : `dans ${Math.floor(n / 7)} semaines`; }
export function nomExamen(ex) { let n = ex.titre.startsWith("Examen ") ? ex.titre.slice(7) : ex.titre; n = n.toLowerCase(); return /^[aeiouyéèêh]/.test(n) ? `l'${n}` : `le ${n}`; }

/** Ciel étoilé (graine fixe : le même ciel à chaque affichage). */
export function ciel(densite = 2.6, graine = 11, largeur = 1200, hauteur = 260) {
  let a = graine >>> 0;
  const hasard = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const n = Math.round(densite * largeur * hauteur / 10000);
  let s = `<svg class="ciel" viewBox="0 0 ${largeur} ${hauteur}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;
  for (let i = 0; i < n; i++) s += `<circle cx="${(hasard() * largeur).toFixed(1)}" cy="${(hasard() * hauteur).toFixed(1)}" r="${(0.5 + hasard() * 1.3).toFixed(2)}" fill="#fff" opacity="${(0.25 + hasard() * 0.6).toFixed(2)}"/>`;
  return s + "</svg>";
}
const flamme = allumee => `<svg class="flamme${allumee ? " allumee" : ""}" viewBox="0 0 24 30" aria-hidden="true"><path d="M12,0 C14,6 20,9 20,18 C20,25 16,30 12,30 C8,30 4,25.5 4,19.5 C4,14.5 7,11.5 8,7.5 C9,10.5 10,12 11.5,13 C11.5,8 10.5,4 12,0 Z" fill="var(--orange)"/><path d="M12,14.5 C14,18 16,20.5 16,23.6 C16,27.2 14.2,29.2 12,29.2 C9.8,29.2 8,27.4 8,24.4 C8,21.4 10,19.4 12,14.5 Z" fill="var(--ampoule)"/></svg>`;

/** La carte « Aujourd'hui » du plan de révision (aussi sur l'écran 08). */
export function carteAujourdhui(c, jp, API, o = {}) {
  const pret = Plan.pretPour(c);
  const ex = M.C.seances.find(s => s.estExamen && s.jour >= c.aujourdhui);
  const faites = jp.taches.filter(t => t.faite).length, minutes = Plan.minutesDuJour(jp), minutesFaites = jp.taches.filter(t => t.faite).reduce((x, t) => x + (t.minutes || 0), 0);
  const resume = jp.taches.length ? `${faites} tâche${S(faites)} sur ${jp.taches.length} faite${S(faites)} · ${duree(minutesFaites)} sur ${duree(Math.max(minutes, c.donnees.minutesParJour))}` : "";
  const vide = jp.taches.length ? "" : messageVide(jp);
  const lignes = jp.taches.map(t => {
    const s = M.trouver(t.seance || ""); const sous = s ? (s.estExamen ? `${s.titre} · ${dateLongue(s.jour).toLowerCase()}` : `Séance ${Plan.numeroCours(s)} · ${s.titre}`) : "";
    return `<li class="tache-courte${t.faite ? " faite" : ""}"><button class="coche${t.faite ? " cochee" : ""}" data-cocher='${esc(JSON.stringify({ id: t.id, jour: t.jour }))}' aria-pressed="${!!t.faite}" aria-label="${esc(t.titre)}${t.faite ? ", faite" : ""}">${ico("coche", 3)}</button>
<a class="tache-lien" href="${t.cible ? API.routeDe(t.serieQcm != null ? { ...t.cible, serieQcm: t.serieQcm } : t.cible) : "#/plan"}" title="${esc(t.raison || "")}"><i class="trait" style="background:${couleurPlan(t.numero)}"></i><span><b>${esc(insecables(t.titre))}</b><small>${esc(insecables(sous))}</small></span></a><span class="duree">${duree(t.minutes || 0)}</span></li>`;
  }).join("");
  return `<section class="carte accueil carte-aujourdhui${o.classe ? " " + o.classe : ""}">
<div class="aujourdhui-tete"><div><div class="etiquette-section">AUJOURD'HUI</div><div class="date-jour">${esc(dateLongue(c.aujourdhui))}</div>
${ex ? `<div class="examen-ligne">${esc(insecables(`${ex.titre} · ${dateLongue(ex.jour).toLowerCase()} · ${quand(ex.jour, c.aujourdhui)}`))}</div>` : ""}</div>
${anneau(pret ? pret.pourcent / 100 : 1, { couleur: "var(--sarcelle)", taille: 78, epaisseur: 8, texte: pret ? pret.pourcent + " %" : "✓", sous: "prête", taillePolice: 17 })}</div>
${lignes ? `<ul class="taches-courtes">${lignes}</ul>` : `<p class="attenue petit">${esc(vide)}</p>`}
${jp.taches.length ? barre(minutes ? minutesFaites / minutes : 0, "succes") : ""}
<div class="aujourdhui-pied"><span class="attenue">${esc(resume)}</span>${o.sansLien ? "" : `<a class="lien" href="#/plan">Voir le plan ${ico("droite", 2)}</a>`}</div></section>`;
}
export function messageVide(jp) {
  if (jp.taches.length) return "";
  if (jp.evenements.some(e => e.genre === "examen")) return "Jour d'examen : bonne chance !";
  if (jp.repos) return "Jour de repos : rien de prévu, profites-en.";
  if (jp.passe) return "Rien de coché ce jour-là.";
  const dernier = M.C.seances.filter(s => s.estExamen).pop();
  if (dernier && jp.jour > dernier.jour) return "La session est terminée.";
  return "Rien à réviser ce jour-là.";
}
export function lierCoches(racine, rendre) {
  for (const b of racine.querySelectorAll("[data-cocher]")) b.addEventListener("click", ev => {
    ev.preventDefault();
    const { id, jour: j } = JSON.parse(b.getAttribute("data-cocher"));
    if (E.estCochee(j, id)) E.decocher(j, id);
    else {
      const c = Plan.contexte();
      const jp = Plan.jours(c, j, j)[0];
      const t = jp.taches.find(x => x.id === id);
      if (t) E.cocher(t);
    }
    rendre();
  });
}


export default function accueilPublic(route,API){const chap=Object.values(M.C.lecons).sort((a,b)=>a.chapitre-b.chapitre),n=Object.values(M.C.banques).concat(Object.values(M.C.quiz)).reduce((s,b)=>s+b.questions.length,0);return {ecran:'accueil',titreMobile:'Sphère pédagogique',html:'<header class="entete-page"><p class="surtitre">APPRENDRE · COMPRENDRE · PRATIQUER</p><h1>Statosphère</h1><p class="chapeau">Statistiques, analyse des données et raisonnement causal, à son rythme.</p></header><p class="edition-publique">'+chap.length+' chapitres · '+n.toLocaleString('fr-CA')+' QCM commentés · formules, cartes de mémorisation et exercices. Une copie publique autonome, avec de nouveaux calculs sur données fictives. L’avancement reste dans ce navigateur.</p><div class="rangee" style="margin-bottom:24px"><a class="bouton" href="#/reviser/lecons">Lire une leçon</a><a class="bouton secondaire" href="#/reviser/qcm">S’entraîner aux QCM</a><a class="bouton secondaire" href="#/catalogue">Explorer les formules</a><a class="bouton secondaire" href="#/jeux">Réviser en jouant</a></div><div class="bibliotheque-publique">'+chap.map(l=>{const s=M.C.seances.find(s=>s.chapitres.includes(l.chapitre));return '<article><p class="surtitre">CHAPITRE '+l.chapitre+'</p><h2>'+esc(l.titre)+'</h2><p>'+esc((l.objectifs||[])[0]||'Comprendre les notions, justifier les choix et interpréter les résultats.')+'</p><a class="bouton secondaire" href="#/reviser/lecons/'+encodeURIComponent(s?.cle||'')+'/'+l.chapitre+'">Commencer →</a></article>';}).join('')+'</div>'};}
