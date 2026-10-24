"use strict";
// Météo actuelle de Montréal, partagée par le hall et la ligne d'état de l'en-tête.
const ebMeteoMontreal = (() => {
  const URL_METEO = "https://api.open-meteo.com/v1/forecast?latitude=45.5017&longitude=-73.5673"
    + "&current=temperature_2m,is_day,weather_code,cloud_cover,precipitation,rain,showers,snowfall,wind_speed_10m,wind_direction_10m"
    + "&timezone=America%2FToronto";
  const CLE = "eb-meteo-montreal";
  let enCours = null;
  return () => {
    try {
      const memo = JSON.parse(localStorage.getItem(CLE) || "null");
      if (memo && Date.now() - memo.t < 20 * 60000) return Promise.resolve(memo.d);
    } catch (e) { /* stockage indisponible */ }
    if (!enCours) {
      enCours = fetch(URL_METEO, { credentials: "omit", referrerPolicy: "no-referrer" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d) { try { localStorage.setItem(CLE, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* stockage indisponible */ } }
          return d;
        })
        .catch(() => null)
        .finally(() => { setTimeout(() => { enCours = null; }, 1000); });
    }
    return enCours;
  };
})();

// Ligne d'état : heure, météo et activité d'Éric Bernier à Montréal.
(() => {
  const entete = document.querySelector(".entete");
  if (!entete) return;
  const ZONE = "America/Toronto";
  const langue = (document.documentElement.lang || "fr").slice(0, 2);
  const L = {
    fr: { ville: "Montréal", statuts: { enseignement: "En cours d'enseignement", classe: "En classe", labo: "Au laboratoire", vacances: "En vacances", weekend: "En week-end", bibliotheque: "À la bibliothèque", sport: "Au sport", patin: "En train de patiner", teletravail: "En télétravail", congres: "En congrès", hors: "Hors des heures de travail" },
      meteo: { soleil: "Ensoleillé", clair: "Ciel dégagé", eclaircies: "Éclaircies", couvert: "Nuageux", brouillard: "Brouillard", bruine: "Bruine", pluie: "Pluie", verglas: "Pluie verglaçante", neige: "Neige", orage: "Orage" }, etiquette: "En ce moment à Montréal" },
    en: { ville: "Montreal", statuts: { enseignement: "Teaching a class", classe: "In class", labo: "In the lab", vacances: "On vacation", weekend: "Weekend", bibliotheque: "At the library", sport: "Playing sports", patin: "Skating", teletravail: "Working remotely", congres: "At a conference", hors: "Outside working hours" },
      meteo: { soleil: "Sunny", clair: "Clear sky", eclaircies: "Partly cloudy", couvert: "Cloudy", brouillard: "Fog", bruine: "Drizzle", pluie: "Rain", verglas: "Freezing rain", neige: "Snow", orage: "Thunderstorm" }, etiquette: "Right now in Montreal" },
    es: { ville: "Montreal", statuts: { enseignement: "Dando clase", classe: "En clase", labo: "En el laboratorio", vacances: "De vacaciones", weekend: "Fin de semana", bibliotheque: "En la biblioteca", sport: "Haciendo deporte", patin: "Patinando", teletravail: "Teletrabajando", congres: "En un congreso", hors: "Fuera del horario laboral" },
      meteo: { soleil: "Soleado", clair: "Despejado", eclaircies: "Parcialmente nublado", couvert: "Nublado", brouillard: "Niebla", bruine: "Llovizna", pluie: "Lluvia", verglas: "Lluvia helada", neige: "Nieve", orage: "Tormenta" }, etiquette: "Ahora en Montreal" },
    zh: { ville: "蒙特利尔", statuts: { enseignement: "正在授课", classe: "正在上课", labo: "在实验室", vacances: "休假中", weekend: "周末", bibliotheque: "在图书馆", sport: "在运动", patin: "在滑冰", teletravail: "远程办公", congres: "参加学术会议", hors: "非工作时间" },
      meteo: { soleil: "晴", clair: "晴朗", eclaircies: "多云间晴", couvert: "多云", brouillard: "雾", bruine: "毛毛雨", pluie: "雨", verglas: "冻雨", neige: "雪", orage: "雷暴" }, etiquette: "蒙特利尔此刻" },
    ar: { ville: "مونتريال", statuts: { enseignement: "يُدرّس الآن", classe: "في الصف", labo: "في المختبر", vacances: "في إجازة", weekend: "عطلة نهاية الأسبوع", bibliotheque: "في المكتبة", sport: "يمارس الرياضة", patin: "يتزلّج على الجليد", teletravail: "يعمل عن بُعد", congres: "في مؤتمر", hors: "خارج ساعات العمل" },
      meteo: { soleil: "مشمس", clair: "سماء صافية", eclaircies: "غائم جزئيًا", couvert: "غائم", brouillard: "ضباب", bruine: "رذاذ", pluie: "مطر", verglas: "مطر متجمّد", neige: "ثلج", orage: "عاصفة رعدية" }, etiquette: "الآن في مونتريال" },
    ru: { ville: "Монреаль", statuts: { enseignement: "Веду занятие", classe: "На занятиях", labo: "В лаборатории", vacances: "В отпуске", weekend: "Выходные", bibliotheque: "В библиотеке", sport: "На тренировке", patin: "Катаюсь на коньках", teletravail: "Работаю удалённо", congres: "На конференции", hors: "Нерабочее время" },
      meteo: { soleil: "Солнечно", clair: "Ясно", eclaircies: "Переменная облачность", couvert: "Облачно", brouillard: "Туман", bruine: "Морось", pluie: "Дождь", verglas: "Ледяной дождь", neige: "Снег", orage: "Гроза" }, etiquette: "Сейчас в Монреале" },
  }[langue] || null;
  const T = L || {
    ville: "Montréal", statuts: { enseignement: "En cours d'enseignement", classe: "En classe", labo: "Au laboratoire", vacances: "En vacances", weekend: "En week-end", bibliotheque: "À la bibliothèque", sport: "Au sport", patin: "En train de patiner", teletravail: "En télétravail", congres: "En congrès", hors: "Hors des heures de travail" },
    meteo: { soleil: "Ensoleillé", clair: "Ciel dégagé", eclaircies: "Éclaircies", couvert: "Nuageux", brouillard: "Brouillard", bruine: "Bruine", pluie: "Pluie", verglas: "Pluie verglaçante", neige: "Neige", orage: "Orage" }, etiquette: "En ce moment à Montréal",
  };
  const codeLangue = L ? langue : "fr";

  // Emploi du temps hebdomadaire, en heure de Montréal : [jour (0 = dimanche), début, fin, statut], minutes depuis minuit.
  const h = (heure, minute = 0) => heure * 60 + minute;
  const HORAIRE = [
    [1, h(8, 30), h(11, 30), "enseignement"], [1, h(12), h(13), "patin"],
    [2, h(9), h(12), "enseignement"], [2, h(12, 30), h(15, 30), "enseignement"],
    [3, h(9), h(17), "labo"],
    [4, h(15), h(16, 30), "sport"], [4, h(18), h(19, 30), "sport"],
    [5, h(12), h(13), "patin"],
    [0, h(8), h(11), "sport"],
  ];
  // Périodes particulières (dates incluses, AAAA-MM-JJ) : vacances, congrès, bibliothèque.
  const PERIODES = [];
  const COULEURS = { enseignement: "#c0612b", classe: "#1f5a8a", labo: "#7a4a8c", sport: "#4f7d2e", patin: "#138086", teletravail: "#2e8b57", weekend: "#5b6fb5", hors: "#6b7a90", vacances: "#b8862b", congres: "#a8343f", bibliotheque: "#466a78" };

  function maintenantMontreal() {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const jours = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { date: `${p.year}-${p.month}-${p.day}`, jour: jours[p.weekday], minutes: Number(p.hour) * 60 + Number(p.minute), heure: Number(p.hour), minute: Number(p.minute) };
  }
  function activite(m) {
    const periode = PERIODES.find((x) => m.date >= x.du && m.date <= x.au);
    if (periode) return periode.statut;
    const creneau = HORAIRE.find(([j, a, b]) => j === m.jour && m.minutes >= a && m.minutes < b);
    if (creneau) return creneau[3];
    if (m.jour === 0 || m.jour === 6) return "weekend";
    return m.minutes >= h(9) && m.minutes < h(17) ? "teletravail" : "hors";
  }
  function heure(m) {
    if (codeLangue === "fr") return `${m.heure} h ${String(m.minute).padStart(2, "0")}`;
    return new Intl.DateTimeFormat(codeLangue, { timeZone: ZONE, hour: "numeric", minute: "2-digit" }).format(new Date());
  }

  // Codes météo de l'Organisation météorologique mondiale.
  function temps(c) {
    const code = Number(c.weather_code) || 0;
    if (code >= 95) return "orage";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "neige";
    if (code === 66 || code === 67 || code === 56 || code === 57) return "verglas";
    if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) return "pluie";
    if (code >= 51 && code <= 55) return "bruine";
    if (code === 45 || code === 48) return "brouillard";
    if (code === 3) return "couvert";
    if (code === 1 || code === 2) return "eclaircies";
    return Number(c.is_day) ? "soleil" : "clair";
  }
  const NUAGE = 'M7.4 18.5h9.4a3.9 3.9 0 0 0 .5-7.77 5.3 5.3 0 0 0-10.1-.95A4.4 4.4 0 0 0 7.4 18.5Z';
  const PETIT_NUAGE = 'M9.6 19h7.6a3.1 3.1 0 0 0 .4-6.17 4.2 4.2 0 0 0-8-.76A3.5 3.5 0 0 0 9.6 19Z';
  const soleil = (cx, cy, r) => `<circle class="i-halo" cx="${cx}" cy="${cy}" r="${r + 3}"/><circle class="i-soleil" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const lune = (dx = 0, dy = 0, k = 1) => `<path class="i-lune" transform="translate(${dx} ${dy}) scale(${k})" d="M14.6 4.2a7.6 7.6 0 1 0 5.2 12.6A6.3 6.3 0 0 1 14.6 4.2Z"/>`;
  const nuage = (cls = 'i-nuage', d = NUAGE) => `<path class="${cls}" d="${d}"/>`;
  function icone(nom, nuit) {
    switch (nom) {
      case 'soleil': return soleil(12, 12, 6.2);
      case 'clair': return lune();
      case 'eclaircies': return (nuit ? lune(-3.5, -3, .8) : soleil(8.5, 8.5, 4.2)) + nuage('i-nuage', PETIT_NUAGE);
      case 'couvert': return nuage('i-nuage i-fond', 'M6 14.5h8a3.3 3.3 0 0 0 .3-6.6 4.5 4.5 0 0 0-8.6-.8A3.7 3.7 0 0 0 6 14.5Z') + nuage();
      case 'brouillard': return '<rect class="i-brume" x="3" y="8" width="18" height="2" rx="1"/><rect class="i-brume" x="5" y="12" width="15" height="2" rx="1"/><rect class="i-brume" x="3" y="16" width="17" height="2" rx="1"/>';
      case 'bruine': return nuage('i-nuage', 'M7.4 15.5h9.4a3.9 3.9 0 0 0 .5-7.77 5.3 5.3 0 0 0-10.1-.95A4.4 4.4 0 0 0 7.4 15.5Z') + '<path class="i-goutte" d="M9 18v1.4M13 18v1.4M17 18v1.4"/>';
      case 'pluie':
      case 'verglas': return nuage('i-nuage', 'M7.4 15h9.4a3.9 3.9 0 0 0 .5-7.77 5.3 5.3 0 0 0-10.1-.95A4.4 4.4 0 0 0 7.4 15Z') + '<path class="i-goutte" d="m9 17.5-1 2.8M13 17.5l-1 2.8M17 17.5l-1 2.8"/>';
      case 'neige': return nuage('i-nuage', 'M7.4 15h9.4a3.9 3.9 0 0 0 .5-7.77 5.3 5.3 0 0 0-10.1-.95A4.4 4.4 0 0 0 7.4 15Z') + '<circle class="i-flocon" cx="9" cy="18.5" r="1.1"/><circle class="i-flocon" cx="13" cy="20.2" r="1.1"/><circle class="i-flocon" cx="16.6" cy="18.3" r="1.1"/>';
      case 'orage': return nuage('i-nuage i-sombre', 'M7.4 15h9.4a3.9 3.9 0 0 0 .5-7.77 5.3 5.3 0 0 0-10.1-.95A4.4 4.4 0 0 0 7.4 15Z') + '<path class="i-eclair" d="m12.8 14.2-2.6 4.3h2.6l-1.6 3.6 4.3-5.2h-2.7l1.6-2.7Z"/>';
      default: return soleil(12, 12, 6.2);
    }
  }

  function creer(classe) {
    const p = document.createElement("p");
    p.className = "direct-montreal " + classe;
    p.setAttribute("aria-label", T.etiquette);
    p.innerHTML = '<span class="direct-ciel" aria-hidden="true"><span class="direct-etoiles"></span><svg viewBox="0 0 24 24"></svg></span>'
      + '<span class="direct-meteo"><span class="direct-temp"></span><span class="direct-cond"></span></span>'
      + '<span class="direct-filet" aria-hidden="true"></span>'
      + '<span class="direct-texte"><time class="direct-heure"></time><span class="direct-ville"></span></span>'
      + '<span class="direct-filet" aria-hidden="true"></span>'
      + '<span class="direct-activite"><span class="direct-point" aria-hidden="true"></span><span class="direct-statut"></span></span>';
    return p;
  }
  // Hauteur réelle de l'en-tête, pour que le hall et ses rubriques tiennent dans la fenêtre.
  const noterEntete = () => document.documentElement.style.setProperty("--entete-h", Math.round(entete.getBoundingClientRect().height) + "px");
  noterEntete();
  if ("ResizeObserver" in window) new ResizeObserver(noterEntete).observe(entete);
  const lignes = [creer("direct-entete")];
  entete.append(lignes[0]);
  const teteHall = document.querySelector(".hall-tete");
  if (teteHall) {
    const l = creer("direct-hall");
    teteHall.firstElementChild ? teteHall.firstElementChild.after(l) : teteHall.prepend(l);
    lignes.push(l);
  }
  let meteo = null;
  function afficher() {
    const m = maintenantMontreal();
    const statut = activite(m);
    const hall = document.querySelector("[data-hall-volume]");
    const moment = hall?.dataset.moment || (meteo ? (Number(meteo.is_day) ? "jour" : "nuit") : (m.heure >= 7 && m.heure < 18 ? "jour" : "nuit"));
    let nom = meteo ? temps(meteo) : "soleil";
    // Ciel sans nuages : le soleil le jour, la lune la nuit, selon la position du soleil à Montréal.
    if (nom === "soleil" || nom === "clair") nom = moment === "nuit" ? "clair" : "soleil";
    for (const l of lignes) {
      l.dataset.moment = moment;
      l.dataset.temps = nom;
      l.style.setProperty("--statut", COULEURS[statut]);
      l.querySelector(".direct-ville").textContent = T.ville;
      const t = l.querySelector(".direct-heure");
      t.textContent = heure(m);
      t.dateTime = `${m.date}T${String(m.heure).padStart(2, "0")}:${String(m.minute).padStart(2, "0")}`;
      l.querySelector(".direct-statut").textContent = T.statuts[statut];
      l.querySelector(".direct-ciel svg").innerHTML = icone(nom, moment === "nuit");
      const bloc = l.querySelector(".direct-meteo");
      bloc.hidden = !meteo;
      if (meteo && Number.isFinite(Number(meteo.temperature_2m))) {
        const degres = Math.round(Number(meteo.temperature_2m));
        l.querySelector(".direct-temp").textContent = `${degres === 0 ? 0 : degres}\u00a0°C`;
        l.querySelector(".direct-cond").textContent = T.meteo[nom];
      }
    }
    placer();
  }
  // Réserver la largeur réelle de la météo, sans déplacer la ligne d'état.
  function placer() {
    document.documentElement.classList.remove("direct-serre");
    if (getComputedStyle(lignes[0]).display === "none") return;
    const largeur = Math.ceil(lignes[0].getBoundingClientRect().width);
    const valeur = largeur + "px";
    if (entete.style.getPropertyValue("--direct-largeur") !== valeur) {
      entete.style.setProperty("--direct-largeur", valeur);
    }
  }
  if ("ResizeObserver" in window) {
    const observation = new ResizeObserver(placer);
    observation.observe(entete);
    observation.observe(lignes[0]);
  }
  document.fonts?.ready.then(placer);
  function charger() { ebMeteoMontreal().then((d) => { if (d?.current) { meteo = d.current; afficher(); } }); }
  afficher();
  charger();
  setInterval(afficher, 30000);
  setInterval(charger, 20 * 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { afficher(); charger(); } });
})();

// Lumière du hall : heure solaire, saison et météo actuelles de Montréal.
(() => {
  const hall = document.querySelector("[data-hall-volume]");
  if (!hall) return;
  const archi = hall.querySelector(".architecture-hall");
  const dossier = new URL("photos/", document.currentScript ? document.currentScript.src : location.href);
  const photo = (nom) => `url("${new URL(`${nom}.webp`, dossier).href}")`;
  const LAT = 45.5017, LON = -73.5673;
  const calme = matchMedia("(prefers-reduced-motion: reduce)");
  const borner = (v, a, b) => Math.max(a, Math.min(b, v));
  const lisse = (a, b, x) => { const t = borner((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  // Hauteur du soleil au-dessus de l'horizon, en degrés.
  function hauteurSoleil(date) {
    const rad = Math.PI / 180;
    const n = date.getTime() / 86400000 + 2440587.5 - 2451545;
    const L = (280.46 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * rad;
    const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
    const eps = (23.439 - 0.0000004 * n) * rad;
    const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) / rad;
    const temps = ((18.697374558 + 24.06570982441908 * n) % 24) * 15 + LON;
    const angle = ((temps - ra) % 360) * rad;
    const lat = LAT * rad;
    return Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(angle)) / rad;
  }

  function dateMontreal(date) {
    const parties = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", month: "numeric", day: "numeric" }).formatToParts(date);
    const val = (t) => Number(parties.find((p) => p.type === t)?.value || 0);
    return val("month") * 100 + val("day");
  }
  function saison(date, neige) {
    const md = dateMontreal(date);
    if (neige || md >= 1116 || md <= 415) return "hiver";
    if (md >= 922) return "automne";
    if (md <= 620) return "printemps";
    return "ete";
  }

  // Codes météo de l'Organisation météorologique mondiale.
  function lireMeteo(d) {
    const c = d?.current;
    if (!c) return null;
    const code = Number(c.weather_code) || 0;
    const neige = (code >= 71 && code <= 77) || code === 85 || code === 86 || Number(c.snowfall) > 0;
    const pluie = !neige && ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95 || Number(c.rain) > 0 || Number(c.showers) > 0);
    const orage = code >= 95;
    const brouillard = code === 45 || code === 48;
    const quantite = Number(c.precipitation) || 0;
    return {
      nuages: borner((Number(c.cloud_cover) || 0) / 100, 0, 1),
      pluie, neige, orage, brouillard,
      force: neige ? borner(0.35 + (Number(c.snowfall) || quantite) * 0.5, 0.35, 1) : borner(0.3 + quantite * 0.25, 0.3, 1),
      vent: Number(c.wind_speed_10m) || 0,
      direction: Number(c.wind_direction_10m) || 0,
    };
  }
  let meteo = null;
  function charger() {
    ebMeteoMontreal().then((d) => { if (d?.current) { meteo = lireMeteo(d); actualiser(); } });
  }

  // La ville derrière la baie, l'intérieur du hall par-dessus, puis le reflet de la ville sur le sol.
  const creer = (classe, parent) => { const el = document.createElement("span"); el.className = classe; parent?.append(el); return el; };
  const ville = creer("hall-ville", archi);
  const plan = creer("hall-ville-plan", ville);
  const villeBase = creer("hall-ville-base", plan);
  const villeCalques = {};
  for (const nom of ["couvert", "crepuscule", "nuit"]) villeCalques[nom] = creer("hall-ville-calque hall-ville-" + nom, plan);
  const bateaux = document.createElement("canvas");
  bateaux.className = "hall-bateaux";
  plan.append(bateaux);
  const brume = creer("hall-brume", ville);
  const toile = document.createElement("canvas");
  toile.className = "hall-precipitation";
  ville.append(toile);
  const eclair = creer("hall-eclair", ville);
  creer("hall-eblouissement", ville);
  const vitre = document.createElement("canvas");
  vitre.className = "hall-gouttes";
  ville.append(vitre);
  creer("hall-interieur", archi);
  const calques = {};
  for (const nom of ["couvert", "crepuscule", "nuit"]) calques[nom] = creer("hall-calque hall-calque-" + nom, archi);
  creer("hall-reflet", archi);

  function poser(el, image, opacite) {
    if (opacite > 0.005 && el.dataset.image !== image) { el.style.backgroundImage = image; el.dataset.image = image; }
    el.style.opacity = opacite.toFixed(3);
  }

  let etat = null;
  function actualiser() {
    const maintenant = new Date();
    const h = hauteurSoleil(maintenant);
    const m = meteo || { nuages: 0.2, pluie: false, neige: false, orage: false, brouillard: false, force: 0, vent: 0, direction: 0 };
    const s = saison(maintenant, m.neige);
    const nuit = lisse(2, -8, h);
    const precip = m.pluie || m.neige;
    const couvert = precip || m.brouillard ? 1 : lisse(0.35, 0.92, m.nuages);
    const crepuscule = borner(1 - Math.abs(h + 1.5) / 8, 0, 1) * (1 - couvert * 0.75);
    hall.dataset.saison = s;
    hall.dataset.moment = nuit > 0.6 ? "nuit" : crepuscule > 0.45 ? (matin(maintenant) ? "aube" : "crepuscule") : "jour";
    hall.dataset.meteo = m.orage ? "orage" : m.neige ? "neige" : m.pluie ? "pluie" : m.brouillard ? "brouillard" : couvert > 0.5 ? "couvert" : "soleil";
    hall.style.setProperty("--hall-jour", photo("hall-interieur-jour"));
    poser(calques.couvert, photo("hall-interieur-couvert"), couvert * (1 - nuit));
    poser(calques.crepuscule, photo("hall-interieur-crepuscule"), crepuscule);
    poser(calques.nuit, photo("hall-interieur-nuit"), nuit);
    const jourVille = photo("hall-ville-jour-" + s);
    if (villeBase.dataset.image !== jourVille) { villeBase.style.backgroundImage = jourVille; villeBase.dataset.image = jourVille; }
    poser(villeCalques.couvert, photo("hall-ville-couvert-" + s), couvert);
    poser(villeCalques.crepuscule, photo("hall-ville-crepuscule"), crepuscule);
    poser(villeCalques.nuit, photo("hall-ville-nuit"), nuit);
    // Une seule image dominante pour le reflet au sol et l'affichage mobile.
    const dominante = nuit > 0.55 ? "hall-ville-nuit" : crepuscule > 0.5 ? "hall-ville-crepuscule" : couvert > 0.5 ? "hall-ville-couvert-" + s : "hall-ville-jour-" + s;
    hall.style.setProperty("--hall-ville-fond", photo(dominante));
    const piece = nuit > 0.55 ? "nuit" : crepuscule > 0.5 ? "crepuscule" : couvert > 0.5 ? "couvert" : "jour";
    hall.style.setProperty("--hall-interieur-mobile", photo("hall-interieur-mobile-" + piece));
    const soleil = (1 - nuit) * (1 - couvert) * (1 - crepuscule * 0.6);
    const eclairage = 1 - nuit * 0.12 - crepuscule * 0.16 * (1 - nuit) - couvert * 0.06 * (1 - nuit);
    hall.style.setProperty("--hall-soleil", soleil.toFixed(3));
    hall.style.setProperty("--hall-eclairage", eclairage.toFixed(3));
    hall.style.setProperty("--hall-chaleur", (crepuscule * 0.1 * (1 - nuit)).toFixed(3));
    hall.style.setProperty("--hall-nuit", nuit.toFixed(3));
    hall.style.setProperty("--hall-reflet", (0.36 - nuit * 0.1 + crepuscule * 0.04).toFixed(3));
    const voile = m.brouillard ? 0.5 : m.neige ? 0.34 : m.pluie ? 0.24 : couvert * 0.08;
    brume.style.opacity = voile.toFixed(3);
    brume.style.setProperty("--hall-brume-nuit", nuit.toFixed(3));
    hall.style.setProperty("--hall-givre", (m.neige ? Math.min(1, 0.4 + m.force * 0.6) : 0).toFixed(3));
    hall.style.setProperty("--hall-eblouissement", (soleil * (1 - nuit)).toFixed(3));
    etat = { precip, neige: m.neige, pluie: m.pluie, orage: m.orage, force: m.force, vent: m.vent, direction: m.direction, nuit, crepuscule, couvert };
    lancerPrecipitation();
  }
  function matin(date) {
    const heure = Number(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", hour: "numeric", hour12: false }).format(date));
    return heure < 12;
  }

  // Pluie et neige derrière les vitrages.
  const ctx = toile.getContext("2d");
  let gouttes = [], image = 0, dernier = 0, largeur = 0, hauteur = 0, prochainEclair = 0;
  function dimensionner() {
    const r = toile.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (!w || !h) return false;
    if (w !== largeur || h !== hauteur) { largeur = toile.width = w; hauteur = toile.height = h; gouttes = []; }
    return true;
  }
  function peupler() {
    const n = Math.round((etat.neige ? 260 : 340) * etat.force * (largeur * hauteur) / (1200 * 470 * 2));
    while (gouttes.length < n) gouttes.push(nouvelle(true));
    gouttes.length = n;
  }
  function nouvelle(partout) {
    const z = 0.35 + Math.random() * 0.65;
    return { x: Math.random() * largeur, y: partout ? Math.random() * hauteur : -10, z, t: Math.random() * 6.28 };
  }
  function dessiner(t) {
    image = 0;
    if (!etat?.precip || !dimensionner()) { ctx?.clearRect(0, 0, largeur, hauteur); return; }
    peupler();
    const dt = dernier ? Math.min(0.05, (t - dernier) / 1000) : 0.016;
    dernier = t;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const vent = borner(etat.vent / 40, 0, 1) * (Math.sin(etat.direction * Math.PI / 180) >= 0 ? 1 : -1);
    ctx.clearRect(0, 0, largeur, hauteur);
    if (etat.neige) {
      ctx.fillStyle = etat.nuit > 0.5 ? "rgba(214,222,236,.85)" : "rgba(255,255,255,.92)";
      for (const g of gouttes) {
        g.t += dt * 1.4;
        g.y += (22 + 38 * g.z) * dt * dpr;
        g.x += (Math.sin(g.t) * 10 + vent * 30) * g.z * dt * dpr;
        if (g.y > hauteur + 4) Object.assign(g, nouvelle(false));
        if (g.x < -4) g.x += largeur; else if (g.x > largeur + 4) g.x -= largeur;
        ctx.globalAlpha = 0.45 + 0.55 * g.z;
        ctx.beginPath();
        ctx.arc(g.x, g.y, (0.7 + 1.5 * g.z) * dpr, 0, 6.283);
        ctx.fill();
      }
    } else {
      ctx.strokeStyle = etat.nuit > 0.5 ? "rgba(170,186,214,.5)" : "rgba(222,230,240,.55)";
      ctx.lineCap = "round";
      for (const g of gouttes) {
        const v = (520 + 420 * g.z) * dpr;
        g.y += v * dt;
        g.x += vent * v * 0.18 * dt;
        if (g.y > hauteur + 20) Object.assign(g, nouvelle(false));
        if (g.x < -10) g.x += largeur; else if (g.x > largeur + 10) g.x -= largeur;
        const l = (7 + 10 * g.z) * dpr;
        ctx.globalAlpha = 0.35 + 0.5 * g.z;
        ctx.lineWidth = (0.6 + 0.7 * g.z) * dpr;
        ctx.beginPath();
        ctx.moveTo(g.x, g.y);
        ctx.lineTo(g.x - vent * l * 0.18, g.y - l);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    if (etat.orage && !calme.matches && t > prochainEclair) {
      if (prochainEclair) eclair.animate?.([{ opacity: 0 }, { opacity: 0.75, offset: 0.08 }, { opacity: 0.1, offset: 0.2 }, { opacity: 0.55, offset: 0.3 }, { opacity: 0 }], { duration: 900, easing: "ease-out" });
      prochainEclair = t + 7000 + Math.random() * 16000;
    }
    if (!calme.matches && !document.hidden && visible && !masque()) image = requestAnimationFrame(dessiner);
  }
  let visible = true;
  // Une salle ouverte recouvre le hall : ses animations s'arrêtent et reprennent à la fermeture.
  const masque = () => document.body.classList.contains("salle-ouverte");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entrees) => {
      visible = entrees.some((e) => e.isIntersecting);
      lancerPrecipitation();
    }).observe(hall);
  }
  function lancerPrecipitation() {
    if (image) { cancelAnimationFrame(image); image = 0; }
    dernier = 0;
    if (!etat?.precip) { ctx?.clearRect(0, 0, largeur, hauteur); return; }
    if (masque()) return;
    image = requestAnimationFrame(dessiner);
  }
  if ("ResizeObserver" in window) new ResizeObserver(() => { if (etat?.precip) lancerPrecipitation(); }).observe(toile);
  calme.addEventListener?.("change", lancerPrecipitation);

  // Bateaux sur le Saint-Laurent, en coordonnées de la photo (3800 × 1090), masqués par les immeubles.
  const FLEUVE = {
    pres: [[300, 352], [650, 350], [1100, 347], [1700, 341], [1950, 335], [2150, 323], [2300, 324], [2860, 331]],
    loin: [[2560, 292], [3100, 289], [3800, 287]],
  };
  function longueur(chemin) {
    let l = 0;
    for (let i = 1; i < chemin.length; i++) l += Math.hypot(chemin[i][0] - chemin[i - 1][0], chemin[i][1] - chemin[i - 1][1]);
    return l;
  }
  function point(chemin, d) {
    for (let i = 1; i < chemin.length; i++) {
      const [x0, y0] = chemin[i - 1], [x1, y1] = chemin[i], l = Math.hypot(x1 - x0, y1 - y0);
      if (d <= l) return [x0 + (x1 - x0) * d / l, y0 + (y1 - y0) * d / l];
      d -= l;
    }
    return chemin[chemin.length - 1];
  }
  const COULEURS = ["#9c3b2e", "#2f5d8a", "#c9a23a", "#4f7a52", "#7d8084", "#b0563a"];
  const navires = [
    { voie: "loin", type: "cargo", l: 46, v: 7, sens: 1, d: 300, e: 1.5 },
    { voie: "pres", type: "navette", l: 30, v: 18, sens: -1, d: 1500, e: 1.7 },
    { voie: "pres", type: "cargo", l: 58, v: 9, sens: 1, d: 2300, e: 1.7 },
  ];
  for (const n of navires) {
    n.total = longueur(FLEUVE[n.voie]);
    n.couleurs = COULEURS.slice().sort(() => Math.random() - 0.5);
  }
  function melanger(c, voile, t) {
    const a = parseInt(c.slice(1), 16), b = parseInt(voile.slice(1), 16);
    const m = (k) => Math.round(((a >> k) & 255) * (1 - t) + ((b >> k) & 255) * t);
    return "#" + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  function feu(c, x, y, r, rgb) {
    const g = c.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, `rgba(${rgb},1)`);
    g.addColorStop(0.35, `rgba(${rgb},.35)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    c.fillStyle = g;
    c.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  }
  function dessinerNavire(c, n, nuit) {
    const loin = n.voie === "loin";
    const voile = nuit > 0.5 ? "#141a2a" : "#b9c3cf";
    const brume = loin ? 0.22 : 0.1;
    const teinte = (col) => melanger(nuit > 0.5 ? melanger(col, "#05070c", 0.75) : col, voile, brume);
    const L = n.l;
    c.save();
    c.scale(n.sens * n.e, n.e);
    c.translate(-L / 2, 0);
    if (nuit < 0.6) {
      const g = c.createLinearGradient(-26, 0, 2, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, `rgba(255,255,255,${loin ? 0.35 : 0.5})`);
      c.fillStyle = g;
      c.fillRect(-26, -0.6, 28, 1.2);
    }
    c.fillStyle = teinte(n.type === "navette" ? "#eef0ef" : "#3a2b2b");
    c.beginPath();
    c.moveTo(0, -4); c.lineTo(L - 6, -4); c.lineTo(L, -5.2); c.lineTo(L - 3, 0); c.lineTo(1, 0);
    c.closePath();
    c.fill();
    if (n.type === "cargo") {
      c.fillStyle = teinte("#7a2b22");
      c.fillRect(1, -1.1, L - 4, 1.1);
      for (let x = 9, i = 0; x < L - 8; x += 3.2, i++) {
        const bas = i % 3 === 0 ? 0.9 : 0;
        c.fillStyle = teinte(n.couleurs[i % n.couleurs.length]);
        c.fillRect(x, -7.4 + bas, 3, 3.4 - bas);
      }
      c.fillStyle = teinte("#e9e8e3"); c.fillRect(1.6, -12, 6, 8);
      c.fillStyle = teinte("#2b2f36"); c.fillRect(1.6, -10.6, 6, 0.8);
      c.fillStyle = teinte("#3a3f45"); c.fillRect(3.4, -14, 1.6, 2.2);
    } else {
      c.fillStyle = teinte("#2f5d8a"); c.fillRect(1, -2.2, L - 4, 0.9);
      c.fillStyle = teinte("#f4f4f2"); c.fillRect(5, -8.2, L - 12, 4.4);
      c.fillStyle = teinte("#3b4652"); c.fillRect(6, -7.2, L - 14, 1.4);
    }
    if (nuit > 0.3) {
      c.globalAlpha = Math.min(1, (nuit - 0.3) / 0.4);
      if (n.type === "cargo") {
        for (let x = 2.4; x < 7.5; x += 1.6) feu(c, x, -8.8, 0.45, "255,226,160");
        feu(c, L - 4, -9, 0.8, "255,255,255");
        feu(c, 4.2, -15.2, 0.8, "255,255,255");
        for (let x = 12; x < L - 8; x += 7) feu(c, x, -8.2, 0.55, "255,240,205");
      } else {
        for (let x = 7; x < L - 7; x += 2.2) feu(c, x, -6.4, 0.5, "255,236,190");
        feu(c, L - 3, -9, 0.7, "255,255,255");
      }
      feu(c, L - 2, -3.5, 0.6, n.sens > 0 ? "80,255,140" : "255,70,60");
      c.globalAlpha = 1;
    }
    c.restore();
  }

  // Gouttes de pluie et flocons collés sur la vitre ; ils glissent avec les modules de verre.
  const TUILE = 1600;
  const perles = [], flocons = [];
  const goutte = (x, y) => ({ x, y, r: 0.8 + Math.pow(Math.random(), 2.2) * 3.2, v: 0, age: 0, vie: 20 + Math.random() * 40 });
  const scene = hall.querySelector("[data-hall-espace]");
  const cb = bateaux.getContext("2d"), cv = vitre.getContext("2d");
  let boucle = 0, avant = 0, enVue = true;
  function taille(el) {
    const r = el.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (w && h && (el.width !== w || el.height !== h)) { el.width = w; el.height = h; }
    return { w: r.width, h: r.height, dpr };
  }
  function animer(t) {
    boucle = 0;
    const dt = avant ? Math.min(0.1, (t - avant) / 1000) : 0.016;
    avant = t;
    const nuit = etat?.nuit || 0;
    const b = taille(bateaux);
    if (b.w) {
      const s = b.w / 3800, ox = 0, oy = (b.h - 1090 * s) / 2;
      cb.setTransform(1, 0, 0, 1, 0, 0);
      cb.clearRect(0, 0, bateaux.width, bateaux.height);
      for (const n of navires) {
        if (!calme.matches) n.d += n.v * dt * n.sens;
        if (n.d > n.total + 80) n.d = -80; else if (n.d < -80) n.d = n.total + 80;
        const [x, y] = point(FLEUVE[n.voie], Math.max(0, Math.min(n.total, n.d)));
        cb.setTransform(s * b.dpr, 0, 0, s * b.dpr, (ox + x * s) * b.dpr, (oy + y * s) * b.dpr);
        dessinerNavire(cb, n, nuit);
      }
    }
    const v = taille(vitre);
    cv.setTransform(v.dpr, 0, 0, v.dpr, 0, 0);
    cv.clearRect(0, 0, v.w, v.h);
    const decal = scene?.ebDefile || 0;
    const pluie = etat?.pluie, neige = etat?.neige, force = etat?.force || 0;
    if (pluie && !calme.matches) {
      const cible = Math.round(260 + 520 * force);
      for (let k = 0; k < 6 && perles.length < cible; k++) perles.push(goutte(Math.random() * TUILE, Math.random() * v.h));
      if (Math.random() < 0.35 * force) perles.push(goutte(Math.random() * TUILE, Math.random() * v.h * 0.7));
    }
    for (let i = perles.length - 1; i >= 0; i--) {
      const p = perles[i];
      p.age += dt;
      if (p.r > 2.6 && !p.v && Math.random() < 0.004) p.v = 18 + Math.random() * 40;
      if (p.v) {
        p.y += p.v * dt;
        p.x += Math.sin(p.y * 0.08) * 0.15;
        if (Math.random() < 0.12) perles.push({ x: p.x + (Math.random() - 0.5), y: p.y - p.r * 2, r: 0.4 + Math.random() * 0.4, v: 0, age: 0, vie: 6 + Math.random() * 8 });
        for (const q of perles) {
          if (q !== p && !q.v && Math.abs(q.x - p.x) < p.r && q.y > p.y && q.y - p.y < p.r * 1.5) { p.r = Math.min(4.6, Math.hypot(p.r, q.r)); q.age = q.vie; }
        }
      }
      if (p.y > v.h + 4 || p.age > p.vie || (!pluie && p.age > 4)) perles.splice(i, 1);
    }
    for (const p of perles) {
      const r = p.r * (p.age > p.vie - 3 ? Math.max(0.2, (p.vie - p.age) / 3) : 1);
      for (let x = ((p.x - decal) % TUILE + TUILE) % TUILE; x < v.w + 4; x += TUILE) {
        cv.fillStyle = nuit > 0.5 ? "rgba(0,0,0,.32)" : "rgba(20,28,36,.22)";
        cv.beginPath(); cv.ellipse(x + r * 0.25, p.y + r * 0.35, r, r * (p.v ? 1.25 : 1.05), 0, 0, 6.283); cv.fill();
        const g = cv.createRadialGradient(x - r * 0.3, p.y - r * 0.35, 0, x, p.y, r);
        g.addColorStop(0, nuit > 0.5 ? "rgba(255,226,180,.55)" : "rgba(255,255,255,.62)");
        g.addColorStop(0.45, nuit > 0.5 ? "rgba(255,214,160,.16)" : "rgba(255,255,255,.18)");
        g.addColorStop(1, "rgba(255,255,255,.1)");
        cv.fillStyle = g;
        cv.beginPath(); cv.ellipse(x, p.y, r, r * (p.v ? 1.25 : 1.02), 0, 0, 6.283); cv.fill();
        cv.fillStyle = nuit > 0.5 ? "rgba(255,240,210,.9)" : "rgba(255,255,255,.9)";
        cv.beginPath(); cv.arc(x - r * 0.35, p.y - r * 0.4, Math.max(0.35, r * 0.24), 0, 6.283); cv.fill();
      }
    }
    if (neige && !calme.matches && flocons.length < 60 + 160 * force && Math.random() < 0.5) {
      flocons.push({ x: Math.random() * TUILE, y: Math.random() * v.h, r: 0.8 + Math.random() * 2.2, age: 0, vie: 6 + Math.random() * 10 });
    }
    for (let i = flocons.length - 1; i >= 0; i--) {
      const f = flocons[i];
      f.age += dt;
      if (f.age > f.vie || (!neige && f.age > 2)) flocons.splice(i, 1);
    }
    for (const f of flocons) {
      const a = Math.min(1, f.age * 3) * Math.max(0, 1 - f.age / f.vie);
      for (let x = ((f.x - decal) % TUILE + TUILE) % TUILE; x < v.w + 4; x += TUILE) {
        const g = cv.createRadialGradient(x, f.y, 0, x, f.y, f.r * 1.6);
        g.addColorStop(0, `rgba(255,255,255,${0.95 * a})`);
        g.addColorStop(0.5, `rgba(250,252,255,${0.55 * a})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        cv.fillStyle = g;
        cv.beginPath(); cv.arc(x, f.y, f.r * 1.6, 0, 6.283); cv.fill();
      }
    }
    if (enVue && !document.hidden && !calme.matches && !masque()) boucle = requestAnimationFrame(animer);
  }
  function relancer() {
    if (!boucle && enVue && !document.hidden && !masque()) { avant = 0; boucle = requestAnimationFrame(animer); }
  }
  let etaitMasque = masque();
  new MutationObserver(() => { const m = masque(); if (etaitMasque && !m) { relancer(); lancerPrecipitation(); } etaitMasque = m; }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entrees) => { enVue = entrees.some((e) => e.isIntersecting); relancer(); }).observe(hall);
  }
  document.addEventListener("visibilitychange", relancer);
  calme.addEventListener?.("change", () => { avant = 0; boucle || (boucle = requestAnimationFrame(animer)); });

  actualiser();
  charger();
  relancer();
  setInterval(actualiser, 60000);
  setInterval(charger, 20 * 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { actualiser(); charger(); } });
})();
