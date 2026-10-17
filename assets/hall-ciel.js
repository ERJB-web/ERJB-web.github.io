"use strict";
// Lumière du hall : heure solaire, saison et météo actuelles de Montréal.
(() => {
  const hall = document.querySelector("[data-hall-volume]");
  if (!hall) return;
  const archi = hall.querySelector(".architecture-hall");
  const dossier = new URL("photos/", document.currentScript ? document.currentScript.src : location.href);
  const photo = (nom) => `url("${new URL(`${nom}.webp`, dossier).href}")`;
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
    const soleil = (1 - nuit) * (1 - couvert) * (1 - crepuscule * 0.6);
    const eclairage = 1 - nuit * 0.12 - crepuscule * 0.16 * (1 - nuit) - couvert * 0.06 * (1 - nuit);
    hall.style.setProperty("--hall-soleil", soleil.toFixed(3));
    hall.style.setProperty("--hall-eclairage", eclairage.toFixed(3));
    hall.style.setProperty("--hall-chaleur", (crepuscule * 0.1 * (1 - nuit)).toFixed(3));
    hall.style.setProperty("--hall-nuit", nuit.toFixed(3));
    hall.style.setProperty("--hall-reflet", (0.16 + nuit * 0.3 + crepuscule * 0.12).toFixed(3));
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
      const s = Math.max(b.w / 3800, b.h / 1090), ox = (b.w - 3800 * s) / 2, oy = (b.h - 1090 * s) * 0.4;
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
    if (enVue && !document.hidden && !calme.matches) boucle = requestAnimationFrame(animer);
  }
  function relancer() {
    if (!boucle && enVue && !document.hidden) { avant = 0; boucle = requestAnimationFrame(animer); }
  }
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
