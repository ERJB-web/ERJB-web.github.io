"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const racine = document.documentElement;
  const ordre = $$(".porte").map((p) => p.dataset.salle);
  const mouvementReduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Le zoom des modes basse vision et taille du texte fausse les coordonnées du passage : on l'omet.
  const sansPassage = () => mouvementReduit || /(^| )(lv|t[123])( |$)/.test(racine.className);
  let reduit = mouvementReduit;
  const attendre = (ms) => new Promise((r) => setTimeout(r, reduit ? 0 : ms));
  const salle = $("#salle");
  const contenu = salle && $(".salle-contenu", salle);
  const points = $$(".points span");
  let courante = null;
  let occupe = false;

  function marquer(nom) {
    points.forEach((p, i) => p.classList.toggle("actif", ordre[i] === nom));
  }

  async function entrer(nom) {
    if (occupe) return;
    occupe = true;
    reduit = sansPassage();
    const porte = $(`.porte[data-salle="${nom}"]`);
    if (salle.classList.contains("visible")) await sortir(false);
    const r0 = porte.getBoundingClientRect();
    if (r0.top < 70 || r0.bottom > innerHeight) {
      porte.scrollIntoView({ block: "center", behavior: reduit ? "auto" : "smooth" });
      await attendre(450);
    }
    $$(".porte.ouverte").forEach((p) => p.classList.remove("ouverte"));
    porte.classList.add("ouverte");
    marquer(nom);
    await attendre(650);

    const r = $(".ouverture", porte).getBoundingClientRect();
    const passage = document.createElement("div");
    passage.className = "passage";
    Object.assign(passage.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.append(passage);
    if (!reduit && passage.animate) {
      const anim = passage.animate(
        [
          { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" },
          { left: "0px", top: "0px", width: innerWidth + "px", height: innerHeight + "px" },
        ],
        { duration: 620, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" }
      );
      await Promise.race([anim.finished, attendre(700)]);
    }

    const section = $(`section[data-salle="${nom}"]`);
    contenu.replaceChildren(section.querySelector(".section-contenu").cloneNode(true));
    const i = ordre.indexOf(nom);
    $("#salle-titre").textContent = `${String(i + 1).padStart(2, "0")} / ${String(ordre.length).padStart(2, "0")} · ${section.dataset.titre}`;
    $("[data-suivante]", salle).hidden = i === ordre.length - 1;
    $("[data-contact]", salle).hidden = i !== ordre.length - 1;
    salle.hidden = false;
    salle.scrollTop = 0;
    document.body.classList.add("salle-ouverte");
    courante = nom;
    void salle.offsetWidth;
    salle.classList.add("visible");
    await attendre(320);
    passage.remove();
    $("[data-retour]", salle).focus({ preventScroll: true });
    occupe = false;
  }

  async function sortir(rendreFocus = true) {
    if (!courante) return;
    const nom = courante;
    courante = null;
    salle.classList.remove("visible");
    await attendre(450);
    salle.hidden = true;
    contenu.replaceChildren();
    document.body.classList.remove("salle-ouverte");
    const porte = $(`.porte[data-salle="${nom}"]`);
    setTimeout(() => porte.classList.remove("ouverte"), reduit ? 0 : 200);
    marquer(null);
    if (rendreFocus) porte.focus({ preventScroll: true });
  }

  if (salle) {
  $$(".porte").forEach((p) => p.addEventListener("click", () => entrer(p.dataset.salle)));
  $("#visite").addEventListener("click", () => entrer(ordre[0]));
  $("[data-retour]", salle).addEventListener("click", () => sortir());
  $("[data-suivante]", salle).addEventListener("click", () => {
    const suivante = ordre[ordre.indexOf(courante) + 1];
    if (suivante) entrer(suivante);
  });
  $("[data-contact]", salle).addEventListener("click", async () => {
    await sortir(false);
    location.hash = "contact";
  });

  }

  addEventListener("keydown", (ev) => {
    if (!courante) return;
    if (ev.key === "Escape") sortir();
    if (ev.key === "Tab") {
      const focusables = $$("button:not([hidden]), a[href], [tabindex]:not([tabindex='-1'])", salle).filter((el) => el.offsetParent !== null);
      const premier = focusables[0];
      const dernier = focusables[focusables.length - 1];
      if (ev.shiftKey && document.activeElement === premier) {
        ev.preventDefault();
        dernier.focus();
      } else if (!ev.shiftKey && document.activeElement === dernier) {
        ev.preventDefault();
        premier.focus();
      }
    }
  });

  document.addEventListener("click", (ev) => {
    const onglet = ev.target.closest(".onglets [role=tab]");
    if (!onglet) return;
    const table = onglet.closest("[data-onglets]");
    $$("[role=tab]", table).forEach((b) => b.setAttribute("aria-selected", b === onglet));
    $$(".volet", table).forEach((v) => (v.hidden = v.dataset.volet !== onglet.dataset.volet));
  });

  document.addEventListener("keydown", (ev) => {
    const onglet = ev.target.closest && ev.target.closest(".onglets [role=tab]");
    if (!onglet || !["ArrowLeft", "ArrowRight"].includes(ev.key)) return;
    const tous = $$("[role=tab]", onglet.closest("[data-onglets]"));
    const i = tous.indexOf(onglet) + (ev.key === "ArrowRight" ? 1 : -1);
    const cible = tous[(i + tous.length) % tous.length];
    cible.focus();
    cible.click();
  });

  // Menus de l'en-tête : un seul ouvert à la fois, fermeture au clic extérieur et avec Échap.
  const menus = $$("details.menu");
  menus.forEach((m) =>
    m.addEventListener("toggle", () => {
      if (m.open) menus.forEach((autre) => autre !== m && (autre.open = false));
    })
  );
  document.addEventListener("click", (ev) => menus.forEach((m) => m.open && !m.contains(ev.target) && (m.open = false)));
  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Escape") return;
    const ouvert = menus.find((m) => m.open);
    if (ouvert) {
      ouvert.open = false;
      $("summary", ouvert).focus();
    }
  });

  // Préférences d'affichage, gardées sur cet appareil.
  const lire = (cle) => {
    try {
      return localStorage.getItem(cle);
    } catch {
      return null;
    }
  };
  const garder = (cle, valeur) => {
    try {
      localStorage.setItem(cle, valeur);
    } catch {}
  };
  const MODES = ["cb", "lv", "hc"];
  const images = () =>
    $$("img[data-cb]").forEach((img) => {
      const v = img.getAttribute(racine.classList.contains("cb") ? "data-cb" : "data-std");
      if (img.getAttribute("src") !== v) img.src = v;
    });
  const afficherModes = () => {
    $$("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", racine.classList.contains(b.dataset.mode)));
    images();
  };
  $$("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      racine.classList.toggle(b.dataset.mode);
      garder("eb-modes", MODES.filter((m) => racine.classList.contains(m)).join(" "));
      afficherModes();
    })
  );
  let taille = Math.max(0, Math.min(3, +lire("eb-taille") || 0));
  $$("[data-taille]").forEach((b) =>
    b.addEventListener("click", () => {
      taille = Math.max(0, Math.min(3, taille + +b.dataset.taille));
      racine.classList.remove("t1", "t2", "t3");
      if (taille) racine.classList.add("t" + taille);
      garder("eb-taille", String(taille));
    })
  );
  afficherModes();

  // Lecture à voix haute avec la voix de l'appareil.
  const voix = window.speechSynthesis;
  const langueVoix = racine.dataset.voix || racine.lang;
  const boutonsEcoute = $$("[data-ecouter]");
  const boutonsArret = $$("[data-arreter]");
  const BLOCS = "h1,h2,h3,h4,p,li,blockquote,figcaption,summary";
  const choisirVoix = (lang) => {
    const base = lang.slice(0, 2).toLowerCase();
    const candidates = voix.getVoices().filter((v) => v.lang && v.lang.toLowerCase().replace("_", "-").startsWith(base));
    const note = (v) =>
      (/natural|neural|online/i.test(v.name) ? 4 : 0) +
      (/henri|antoine|jean|thierry|remy|guy|davis|andrew|brian|christopher|eric|roger|alvaro|jorge|dario|yunxi|yunjian|yunyang|hamed|shakir|taim/i.test(v.name) ? 3 : 0) +
      (v.lang.toLowerCase() === lang.toLowerCase() ? 2 : 0) +
      (v.localService ? 0 : 1);
    return candidates.sort((a, b) => note(b) - note(a))[0] || null;
  };
  const enLecture = (oui) => {
    boutonsArret.forEach((b) => (b.hidden = !oui));
  };
  const textes = (zone) =>
    $$(BLOCS, zone)
      .filter((el) => el.offsetParent !== null && !el.parentElement.closest(BLOCS) && !el.closest("[aria-hidden=true]"))
      .map((el) => ({ texte: el.textContent.replace(/\s+/g, " ").trim(), lang: (el.closest("[lang]") || racine).getAttribute("lang") }))
      .filter((x) => x.texte);
  const lireZone = (zone) => {
    voix.cancel();
    const morceaux = textes(zone);
    let manque = false;
    morceaux.forEach(({ texte, lang }, i) => {
      const langue = lang === racine.lang ? langueVoix : lang;
      const v = choisirVoix(langue);
      if (!v) {
        manque = true;
        return;
      }
      const u = new SpeechSynthesisUtterance(texte);
      u.voice = v;
      u.lang = v.lang;
      u.rate = 0.95;
      if (i === morceaux.length - 1) u.onend = () => enLecture(false);
      voix.speak(u);
    });
    $$("[data-sans-voix]").forEach((n) => (n.hidden = !manque));
    enLecture(voix.pending || voix.speaking);
  };
  // Voix enregistrées (voix humaine de synthèse locale) quand elles existent ; sinon, voix de l'appareil.
  const racineSite = racine.dataset.racine || "./";
  const dossierAudio = racine.dataset.audio;
  let indexAudio = null;
  if (dossierAudio)
    fetch(`${racineSite}audio/${dossierAudio}/index.json`)
      .then((rep) => (rep.ok ? rep.json() : null))
      .then((idx) => (indexAudio = idx))
      .catch(() => {});
  const lecteur = new Audio();
  let file = [];
  const suivant = () => {
    const z = file.shift();
    if (!z) return enLecture(false);
    lecteur.src = `${racineSite}audio/${dossierAudio}/${z}.ogg`;
    lecteur.play().catch(() => enLecture(false));
  };
  lecteur.addEventListener("ended", suivant);
  const zonesDemandees = (b) => {
    const cible = b.dataset.cible;
    if (cible === "contenu") return $$(".bloc-falc").map((s) => s.id);
    if (cible) return [cible];
    if (salle && salle.classList.contains("visible")) return [courante];
    return ["accueil", ...ordre];
  };
  const arreter = () => {
    if (voix) voix.cancel();
    lecteur.pause();
    file = [];
    enLecture(false);
  };
  boutonsEcoute.forEach((b) =>
    b.addEventListener("click", () => {
      menus.forEach((m) => (m.open = false));
      arreter();
      const enregistrees = zonesDemandees(b).filter((z) => indexAudio && indexAudio[z]);
      if (enregistrees.length) {
        file = enregistrees;
        enLecture(true);
        suivant();
        return;
      }
      if (!voix) return;
      const cible = b.dataset.cible && document.getElementById(b.dataset.cible);
      lireZone(cible || (salle && salle.classList.contains("visible") ? contenu : $("main")));
    })
  );
  boutonsArret.forEach((b) => b.addEventListener("click", arreter));
  addEventListener("pagehide", arreter);
  if (voix) voix.getVoices();

  // Vidéos et balados : le lecteur du service se charge seulement au clic.
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-integrer]");
    if (!b) return;
    const f = document.createElement("iframe");
    f.src = b.dataset.integrer;
    f.title = b.dataset.titre;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    b.replaceWith(f);
  });
})();
