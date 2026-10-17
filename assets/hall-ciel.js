"use strict";
// Lumière du hall : heure solaire, saison et météo actuelles de Montréal.
(() => {
  const hall = document.querySelector("[data-hall-volume]");
  if (!hall) return;
  const archi = hall.querySelector(".architecture-hall");
  const dossier = new URL("photos/", document.currentScript ? document.currentScript.src : location.href);
  const photo = (nom) => `url("${new URL(`hall-montreal-${nom}.webp`, dossier).href}")`;
  const LAT = 45.5017, LON = -73.5673;
  const METEO = "https://api.open-meteo.com/v1/forecast?latitude=45.5017&longitude=-73.5673"
    + "&current=weather_code,cloud_cover,precipitation,rain,showers,snowfall,wind_speed_10m,wind_direction_10m"
    + "&timezone=America%2FToronto";
  const CLE = "eb-hall-meteo";
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
    try {
      const memo = JSON.parse(localStorage.getItem(CLE) || "null");
      if (memo && Date.now() - memo.t < 20 * 60000) { meteo = lireMeteo(memo.d); actualiser(); return; }
    } catch (e) { /* stockage indisponible */ }
    fetch(METEO, { credentials: "omit", referrerPolicy: "no-referrer" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        meteo = lireMeteo(d);
        try { localStorage.setItem(CLE, JSON.stringify({ t: Date.now(), d })); } catch (e) { /* stockage indisponible */ }
        actualiser();
      })
      .catch(() => {});
  }

  const calques = {};
  for (const nom of ["couvert", "crepuscule", "nuit"]) {
    const el = document.createElement("span");
    el.className = "hall-calque hall-calque-" + nom;
    archi?.append(el);
    calques[nom] = el;
  }
  const brume = document.createElement("span");
  brume.className = "hall-brume";
  const toile = document.createElement("canvas");
  toile.className = "hall-precipitation";
  const eclair = document.createElement("span");
  eclair.className = "hall-eclair";
  archi?.append(brume, toile, eclair);

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
    hall.style.setProperty("--hall-jour", photo("jour-" + s));
    poser(calques.couvert, photo("couvert-" + s), couvert);
    poser(calques.crepuscule, photo("crepuscule-" + s), crepuscule);
    poser(calques.nuit, photo("nuit"), nuit);
    // Une seule image dominante pour l'affichage mobile.
    const dominante = nuit > 0.55 ? "nuit" : crepuscule > 0.5 ? "crepuscule-" + s : couvert > 0.5 ? "couvert-" + s : "jour-" + s;
    hall.style.setProperty("--hall-fond", photo(dominante));
    const soleil = (1 - nuit) * (1 - couvert) * (1 - crepuscule * 0.6);
    const eclairage = 1 - nuit * 0.3 - crepuscule * 0.24 * (1 - nuit) - couvert * 0.06 * (1 - nuit);
    hall.style.setProperty("--hall-soleil", soleil.toFixed(3));
    hall.style.setProperty("--hall-eclairage", eclairage.toFixed(3));
    hall.style.setProperty("--hall-chaleur", (nuit * 0.12 + crepuscule * 0.2).toFixed(3));
    // Les rayons du soleil, ou les halos des lampes, tombent aussi sur les portes et les panneaux.
    hall.style.setProperty("--hall-lumiere-calque", photo(nuit > 0.5 ? "lumiere-nuit" : "lumiere-jour"));
    hall.style.setProperty("--hall-lumiere-force", (nuit > 0.5 ? nuit : soleil).toFixed(3));
    const voile = m.brouillard ? 0.5 : m.neige ? 0.34 : m.pluie ? 0.24 : couvert * 0.08;
    brume.style.opacity = voile.toFixed(3);
    brume.style.setProperty("--hall-brume-nuit", nuit.toFixed(3));
    etat = { precip, neige: m.neige, pluie: m.pluie, orage: m.orage, force: m.force, vent: m.vent, direction: m.direction, nuit };
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
    if (!calme.matches && !document.hidden && visible) image = requestAnimationFrame(dessiner);
  }
  let visible = true;
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
    image = requestAnimationFrame(dessiner);
  }
  if ("ResizeObserver" in window) new ResizeObserver(() => { if (etat?.precip) lancerPrecipitation(); }).observe(toile);
  calme.addEventListener?.("change", lancerPrecipitation);

  actualiser();
  charger();
  setInterval(actualiser, 60000);
  setInterval(charger, 20 * 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { actualiser(); charger(); } });
})();
