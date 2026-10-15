"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const racine = document.documentElement;
  const groupes = $$(".porte").map((p) => ({ nom: p.dataset.salle, porte: p, sections: (p.dataset.sections || "").split(" ").filter(Boolean) }));
  const ordre = groupes.flatMap((g) => g.sections);
  const groupeDe = (s) => groupes.find((g) => g.nom === s || g.sections.includes(s));
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


  function couleurDestination(nom, porte) {
    const sous = porte.querySelector('[data-sous="' + nom + '"]');
    const section = document.querySelector('section[data-salle="' + nom + '"] .bandeau');
    return (sous && sous.style.getPropertyValue('--c1')) || (section && section.style.getPropertyValue('--c1')) || getComputedStyle(porte).getPropertyValue('--c1').trim() || '#286d5c';
  }

  function creerPassage(rect, couleur) {
    const passage = document.createElement('div');
    passage.className = 'passage passage-immersion';
    passage.setAttribute('aria-hidden', 'true');
    passage.style.setProperty('--passage-couleur', couleur);
    Object.assign(passage.style, { left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px', height: rect.height + 'px' });
    ['sol', 'plafond', 'gauche', 'droite', 'fond'].forEach(nom => {
      const plan = document.createElement('span');
      plan.className = 'passage-plan passage-' + nom;
      passage.append(plan);
    });
    return passage;
  }

  async function traverserPassage(passage, duree = 560) {
    if (reduit || !passage.animate) return;
    const r = passage.getBoundingClientRect();
    const animation = passage.animate([
      { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: '1px' },
      { left: '0px', top: '0px', width: innerWidth + 'px', height: innerHeight + 'px', borderRadius: '0px' }
    ], { duration: duree, easing: 'cubic-bezier(.45,0,.15,1)', fill: 'forwards' });
    await Promise.race([animation.finished.catch(() => {}), attendre(duree + 80)]);
  }

  async function effacerPassage(passage) {
    if (reduit || !passage.animate) return;
    const animation = passage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
    await Promise.race([animation.finished.catch(() => {}), attendre(220)]);
  }

  async function avancerVersPorte(porte) {
    const hall = porte.closest('.hall.en-3d');
    const monde = hall && $('.hall-monde', hall);
    const scene = hall && $('[data-hall-scene]', hall);
    if (!hall || !monde || !scene || reduit || !monde.animate) {
      porte.classList.add('ouverte');
      await attendre(300);
      return null;
    }
    const style = getComputedStyle(porte);
    const angle = parseFloat(style.getPropertyValue('--ha')) || 0;
    const z = parseFloat(style.getPropertyValue('--hz')) || 0;
    const echelle = parseFloat(getComputedStyle(hall).getPropertyValue('--hall-echelle')) || 1;
    const radians = angle * Math.PI / 180;
    const dx = porte.offsetLeft + Math.cos(radians) * porte.offsetWidth / 2 - monde.offsetWidth / 2;
    const dy = porte.offsetTop + porte.offsetHeight / 2 - monde.offsetHeight / 2;
    const dz = z - Math.sin(radians) * porte.offsetWidth / 2;
    const depart = getComputedStyle(monde).transform;
    const vue = (rotation, profondeur) => {
      const a = rotation * Math.PI / 180;
      const x = dx * Math.cos(a) + dz * Math.sin(a);
      const distance = -dx * Math.sin(a) + dz * Math.cos(a);
      const tx = -echelle * x;
      const ty = scene.clientHeight * .48 - monde.offsetTop - echelle * dy;
      const tz = profondeur - echelle * distance;
      return 'translate(-50%,-50%) translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,' + tz.toFixed(2) + 'px) scale(' + echelle + ') rotateX(0deg) rotateY(' + rotation + 'deg)';
    };
    hall.classList.add('en-approche');
    const animation = monde.animate([
      { transform: depart, offset: 0 },
      { transform: vue(-angle * .78, 130), offset: .58 },
      { transform: vue(-angle, 500), offset: 1 }
    ], { duration: 900, easing: 'cubic-bezier(.45,0,.18,1)', fill: 'forwards' });
    await Promise.all([
      attendre(260).then(() => porte.classList.add('ouverte')),
      Promise.race([animation.finished.catch(() => {}), attendre(1000)])
    ]);
    return () => { animation.cancel(); hall.classList.remove('en-approche'); };
  }

  async function entrer(nom) {
    const groupe = groupeDe(nom);
    if (!groupe) return;
    const contact = !groupe.sections.length;
    const cible = contact ? groupe.nom : groupe.sections.includes(nom) ? nom : groupe.sections[0];
    if (!contact && courante && groupeDe(courante) === groupe) return passerSous(cible);
    if (occupe) return;
    occupe = true;
    reduit = sansPassage();
    const porte = groupe.porte;
    let passage = null;
    let restaurerVue = null;
    try {
      if (salle.classList.contains('visible')) await sortir(false);
      const hall = porte.closest('.hall.en-3d');
      const zone = hall ? $('[data-hall-scene]', hall) : porte;
      const r0 = zone.getBoundingClientRect();
      if (r0.top < 110 || r0.bottom > innerHeight - 20) {
        zone.scrollIntoView({ block: 'center', behavior: reduit ? 'auto' : 'smooth' });
        await attendre(280);
      }
      $$('.porte.ouverte').forEach(p => p.classList.remove('ouverte'));
      const couleur = couleurDestination(cible, porte);
      porte.style.setProperty('--porte-interieur', couleur);
      marquer(cible);
      restaurerVue = await avancerVersPorte(porte);
      const r = $('.ouverture', porte).getBoundingClientRect();
      passage = creerPassage(r, couleur);
      document.body.append(passage);
      await traverserPassage(passage);
      if (contact) {
        $('#' + groupe.nom).scrollIntoView({ behavior: 'auto', block: 'start' });
        const titreContact = $('#' + groupe.nom + ' h2');
        if (titreContact) { titreContact.tabIndex = -1; titreContact.focus({ preventScroll: true }); }
        await effacerPassage(passage);
      } else {
        afficher(cible);
        salle.hidden = false;
        salle.scrollTop = 0;
        document.body.classList.add('salle-ouverte');
        void salle.offsetWidth;
        salle.classList.add('visible');
        await attendre(150);
        await effacerPassage(passage);
        $('[data-retour]', salle).focus({ preventScroll: true });
      }
    } finally {
      if (passage) passage.remove();
      if (restaurerVue) restaurerVue();
      porte.style.removeProperty('--porte-interieur');
      if (contact) porte.classList.remove('ouverte');
      occupe = false;
    }
  }

// Les axes relient une salle et, au besoin, un travail ou un onglet précis.
  async function ouvrirDestinationAxe(fragment, memoriser = true) {
    const parties = fragment.split('/');
    const destination = parties[0];
    const repere = parties[1] || '';
    if (!ordre.includes(destination) || parties.length > 2 || (repere && !/^[a-z0-9-]+$/.test(repere)) || occupe) return;
    const depart = courante;
    const libre = racine.classList.contains('libre');
    if (!libre) {
      await entrer(destination);
      if (courante !== destination) return;
    }
    const zone = libre ? $('section[data-salle="' + destination + '"]') : contenu;
    if (!zone) return;
    const cible = repere
      ? zone.querySelector('[data-axe-cible="' + repere + '"], .rubrique-corps[data-rubrique="' + repere + '"]')
      : zone;
    if (cible) {
      const parents = [];
      let volet = cible.closest('.volet');
      while (volet && zone.contains(volet)) {
        parents.unshift(volet);
        volet = volet.parentElement && volet.parentElement.closest('.volet');
      }
      parents.forEach(panneau => {
        const table = panneau.closest('[data-onglets]');
        const bouton = table && $$('[role=tab]', table).find(b => b.closest('[data-onglets]') === table && b.dataset.volet === panneau.dataset.volet);
        if (bouton) bouton.click();
      });
      if (repere) {
        cible.tabIndex = -1;
        cible.classList.add('axe-destination');
        cible.addEventListener('blur', () => cible.classList.remove('axe-destination'), { once: true });
        cible.focus({ preventScroll: true });
      }
      if (repere || libre) cible.scrollIntoView({ block: 'start', behavior: sansPassage() ? 'auto' : 'smooth' });
    }
    if (memoriser && location.hash !== '#' + fragment) {
      if (depart && location.hash.split('/')[0] !== '#' + depart) history.replaceState(null, '', '#' + depart);
      history.pushState(null, '', '#' + fragment);
    }
  }

  document.addEventListener('click', ev => {
    const lien = ev.target.closest('a[data-axe-lien]');
    if (!lien || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    ouvrirDestinationAxe(lien.getAttribute('href').slice(1));
  });
  addEventListener('popstate', () => ouvrirDestinationAxe(location.hash.slice(1), false));


  const onglets = salle && $(".salle-onglets", salle);
  function afficher(s) {
    const groupe = groupeDe(s);
    const section = $(`section[data-salle="${s}"]`);
    contenu.replaceChildren(section.querySelector(".section-contenu").cloneNode(true));
    $$("[data-onglets]", contenu).forEach((table, ti) => {
      const propres = (sel) => $$(sel, table).filter((el) => el.closest("[data-onglets]") === table);
      propres("[role=tab]").forEach((b) => {
        b.id = `${s}-table-${ti}-tab-${b.dataset.volet}`;
        b.setAttribute("aria-controls", `${s}-table-${ti}-volet-${b.dataset.volet}`);
        b.tabIndex = b.getAttribute("aria-selected") === "true" ? 0 : -1;
      });
      propres(".volet").forEach((v) => {
        v.id = `${s}-table-${ti}-volet-${v.dataset.volet}`;
        v.setAttribute("aria-labelledby", `${s}-table-${ti}-tab-${v.dataset.volet}`);
        v.tabIndex = 0;
      });
    });
    contenu.querySelectorAll(".revele").forEach((el) => el.classList.remove("revele", "vu"));
    if (typeof preparer === "function") setTimeout(() => preparer(contenu), 0);
    const gi = groupes.indexOf(groupe);
    const avecSalles = groupes.filter((g) => g.sections.length);
    salle.style.setProperty("--c1", getComputedStyle(groupe.porte).getPropertyValue("--c1"));
    $$(".salle-progres span").forEach((x, k) => x.classList.toggle("actif", k <= ordre.indexOf(s)));
    $("#salle-titre").textContent = `${String(ordre.indexOf(s) + 1).padStart(2, "0")} / ${String(ordre.length).padStart(2, "0")} · ${groupe.porte.dataset.titre} · ${section.dataset.titre}`;
    onglets.hidden = groupe.sections.length < 2;
    const nb = groupe.sections.length;
    onglets.style.setProperty("--colonnes", nb > 5 ? Math.ceil(nb / 2) : nb);
    onglets.replaceChildren(
      ...groupe.sections.map((x) => {
        const sx = $(`section[data-salle="${x}"]`);
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "onglet-salle" + (x === s ? " actif" : "");
        bouton.setAttribute("aria-current", x === s ? "true" : "false");
        bouton.style.setProperty("--c1", sx.querySelector(".bandeau").style.getPropertyValue("--c1"));
        const n = document.createElement("span");
        n.className = "onglet-num";
        n.textContent = sx.querySelector(".section-contenu").dataset.numero;
        const t = document.createElement("span");
        t.className = "onglet-titre";
        t.textContent = sx.dataset.titre;
        const d = document.createElement("span");
        d.className = "baie mini";
        d.setAttribute("aria-hidden", "true");
        d.innerHTML = "<span class=\"ouverture\"><span class=\"battant\"><span class=\"vignette\"></span><span class=\"poignee\"></span></span></span>";
        const mini = sx.querySelector(".section-contenu").dataset.mini;
        if (mini) d.querySelector(".vignette").style.backgroundImage = `url("${mini}")`;
        bouton.append(d, n, t);
        bouton.dataset.sous = x;
        bouton.addEventListener("click", () => passerSous(x));
        return bouton;
      })
    );
    const i = ordre.indexOf(s);
    $("[data-suivante]", salle).hidden = i === ordre.length - 1;
    $("[data-contact]", salle).hidden = i !== ordre.length - 1;
    salle.scrollTop = 0;
    courante = s;
  }

  // Petite porte : même transition que les grandes (la porte s’ouvre, on passe à travers).
  async function passerSous(x) {
    if (occupe || x === courante) return;
    const bouton = onglets.querySelector('[data-sous="' + x + '"]');
    if (!bouton) return afficher(x);
    occupe = true;
    reduit = sansPassage();
    let passage = null;
    try {
      bouton.classList.add('ouverte');
      await attendre(160);
      const rect = bouton.querySelector('.ouverture').getBoundingClientRect();
      const couleur = bouton.style.getPropertyValue('--c1').trim() || '#286d5c';
      passage = creerPassage(rect, couleur);
      document.body.append(passage);
      await traverserPassage(passage, 420);
      afficher(x);
      await attendre(100);
      await effacerPassage(passage);
    } finally {
      if (passage) passage.remove();
      occupe = false;
    }
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
    const porte = groupeDe(nom).porte;
    setTimeout(() => porte.classList.remove("ouverte"), reduit ? 0 : 200);
    marquer(null);
    if (rendreFocus) porte.focus({ preventScroll: true });
  }

  if (salle) {
  racine.classList.add("salles");
  $$(".porte").forEach((p) => p.addEventListener("click", (ev) => {
    const lien = ev.target.closest("[data-lien]");
    if (lien) {
      if (lien.dataset.nouvel) window.open(lien.dataset.lien, "_blank", "noopener");
      else location.href = lien.dataset.lien;
      return;
    }
    const sous = ev.target.closest("[data-sous]");
    entrer(sous ? sous.dataset.sous : p.dataset.sections.split(" ")[0] || p.dataset.salle);
  }));
  // Les liens vers une salle (menu, « Explorer ») ouvrent sa porte
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute("data-axe-lien") || salle.contains(a)) return;
    const id = a.getAttribute("href").slice(1);
    if (!ordre.includes(id)) return;
    if (a.closest(".actions")) racine.classList.add("libre");
    if (racine.classList.contains("libre")) return;
    ev.preventDefault();
    entrer(id);
  });
  if (ordre.includes(location.hash.slice(1).split("/")[0])) requestAnimationFrame(() => ouvrirDestinationAxe(location.hash.slice(1), false));
  $("#visite").addEventListener("click", () => entrer(ordre[0]));
  $("[data-retour]", salle).addEventListener("click", () => sortir());
  $("[data-suivante]", salle).addEventListener("click", () => {
    const suivante = ordre[ordre.indexOf(courante) + 1];
    if (suivante) entrer(suivante);
    salle.scrollTop = 0;
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


  function initialiserHall3D() {
    const hall = $('[data-hall]');
    if (!hall || !groupes.length) return;
    const scene = $('[data-hall-scene]', hall);
    const mode = $('[data-hall-mode]', hall);
    const reperes = $('[data-hall-reperes]', hall);
    const choix = $$('[data-hall-choix]', hall);
    const fiches = $$('[data-hall-fiche]', hall);
    const commande = $('[data-hall-commandes]', hall);
    const geste = $('[data-hall-geste]', hall);
    const large = matchMedia('(min-width:1000px)');
    const calme = matchMedia('(prefers-reduced-motion: reduce)');
    const couleursForcees = matchMedia('(forced-colors: active)');
    const support = typeof CSS !== 'undefined' && CSS.supports('transform-style', 'preserve-3d');
    let actif = 0, simple = false, sourisX = 0, sourisY = 0, imageEnAttente = 0;
    let glissement = null;
    const orienter = () => {
      imageEnAttente = 0;
      if (!hall.classList.contains('en-3d') || occupe) return;
      hall.style.setProperty('--hall-rotation-y', (calme.matches ? 0 : sourisX * 1.15).toFixed(2) + 'deg');
      hall.style.setProperty('--hall-rotation-x', (calme.matches ? 0 : -sourisY * .6).toFixed(2) + 'deg');
    };
    const demanderVue = () => { if (!imageEnAttente) imageEnAttente = requestAnimationFrame(orienter); };
    const dimensionner = () => {
      if (hall.classList.contains('en-3d')) hall.style.setProperty('--hall-echelle', (scene.clientWidth / 1600).toFixed(4));
    };
    const choisir = index => {
      if (occupe) return;
      actif = (index + groupes.length) % groupes.length;
      groupes.forEach((g, i) => g.porte.classList.toggle('choisie', i === actif));
      fiches.forEach((f, i) => f.classList.toggle('choisie', i === actif));
      hall.style.setProperty('--hall-teinte', groupes[actif].porte.style.getPropertyValue('--c1'));
    };
    const actualiserMode = () => {
      const lectureSimple = /(^| )(lv|hc|t[123])( |$)/.test(racine.className) || couleursForcees.matches;
      const disponible = support && large.matches && !lectureSimple;
      const relief = disponible && !simple;
      mode.hidden = !disponible;
      mode.setAttribute('aria-pressed', String(relief));
      hall.classList.toggle('en-3d', relief);
      [reperes, commande, geste].forEach(el => { el.hidden = !relief; });
      dimensionner();
      demanderVue();
    };
    mode.addEventListener('click', () => { simple = !simple; actualiserMode(); });
    choix.forEach((b, i) => {
      b.addEventListener('click', () => { choisir(i); entrer(groupes[i].sections[0] || groupes[i].nom); });
      b.addEventListener('pointerenter', () => choisir(i));
      b.addEventListener('focus', () => choisir(i));
      b.addEventListener('keydown', ev => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(ev.key)) return;
        ev.preventDefault();
        const sens = racine.dir === 'rtl' ? -1 : 1;
        const prochain = ev.key === 'Home' ? 0 : ev.key === 'End' ? choix.length - 1 : (i + (ev.key === 'ArrowRight' ? sens : -sens) + choix.length) % choix.length;
        choisir(prochain);
        choix[prochain].focus();
      });
    });
    fiches.forEach((fiche, i) => {
      fiche.addEventListener('pointerenter', () => choisir(i));
      fiche.addEventListener('focusin', () => choisir(i));
    });
    groupes.forEach((g, i) => {
      g.porte.addEventListener('pointerenter', () => { if (hall.classList.contains('en-3d')) choisir(i); });
      g.porte.addEventListener('focus', () => { if (hall.classList.contains('en-3d')) choisir(i); });
    });
    $('[data-hall-precedente]', hall).addEventListener('click', () => { choisir(actif - 1); choix[actif].focus({ preventScroll:true }); });
    $('[data-hall-suivante]', hall).addEventListener('click', () => { choisir(actif + 1); choix[actif].focus({ preventScroll:true }); });
    $('[data-hall-recentrer]', hall).addEventListener('click', () => { sourisX = 0; sourisY = 0; demanderVue(); });
    scene.addEventListener('pointerdown', ev => {
      if (ev.pointerType !== 'mouse' || ev.button !== 0 || ev.target.closest('button,a') || !hall.classList.contains('en-3d') || calme.matches || occupe) return;
      glissement = { x:ev.clientX, y:ev.clientY };
      scene.classList.add('en-glissement');
      scene.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    scene.addEventListener('pointermove', ev => {
      if (ev.pointerType !== 'mouse' || !hall.classList.contains('en-3d') || calme.matches || occupe || (salle && !salle.hidden)) return;
      const r = scene.getBoundingClientRect();
      sourisX = Math.max(-1, Math.min(1, glissement ? (ev.clientX - glissement.x) / 180 : ((ev.clientX - r.left) / r.width - .5) * 2));
      sourisY = Math.max(-1, Math.min(1, glissement ? (ev.clientY - glissement.y) / 140 : ((ev.clientY - r.top) / r.height - .5) * 2));
      demanderVue();
    }, {passive:true});
    const terminer = () => { glissement = null; scene.classList.remove('en-glissement'); };
    scene.addEventListener('pointerup', terminer);
    scene.addEventListener('pointercancel', terminer);
    scene.addEventListener('lostpointercapture', terminer);
    scene.addEventListener('pointerleave', () => { if (!glissement) { sourisX = 0; sourisY = 0; demanderVue(); } });
    large.addEventListener('change', actualiserMode);
    calme.addEventListener('change', actualiserMode);
    couleursForcees.addEventListener('change', actualiserMode);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(dimensionner).observe(scene);
    else addEventListener('resize', dimensionner, {passive:true});
    new MutationObserver(actualiserMode).observe(racine, {attributes:true, attributeFilter:['class']});
    choisir(0);
    actualiserMode();
  }
  initialiserHall3D();

  // Cycle des cinq temps : chaque étape ouvre l'onglet correspondant.
  document.addEventListener("click", (ev) => {
    const noeud = ev.target.closest("[data-aller]");
    if (!noeud) return;
    const bloc = noeud.closest(".cycle-bloc");
    const onglet = $$("[role=tab]", bloc)[+noeud.dataset.aller];
    if (onglet) onglet.click();
  });

  document.addEventListener("click", (ev) => {
    const onglet = ev.target.closest(".onglets [role=tab]");
    if (!onglet) return;
    const bloc = onglet.closest(".cycle-bloc");
    if (bloc) $$(".cycle-noeud", bloc).forEach((n) => n.classList.toggle("actif", n.dataset.aller === onglet.dataset.volet));
    const table = onglet.closest("[data-onglets]");
    const propres = (sel) => $$(sel, table).filter((el) => el.closest("[data-onglets]") === table);
    propres("[role=tab]").forEach((b) => {
      b.setAttribute("aria-selected", b === onglet);
      b.tabIndex = b === onglet ? 0 : -1;
    });
    propres(".volet").forEach((v) => (v.hidden = v.dataset.volet !== onglet.dataset.volet));
    propres("[data-rubrique-select]").forEach((select) => (select.value = onglet.dataset.volet));
  });

  document.addEventListener("change", (ev) => {
    if (!ev.target.matches("[data-rubrique-select]")) return;
    const table = ev.target.closest("[data-onglets]");
    const bouton = $$("[role=tab]", table).find((b) => b.closest("[data-onglets]") === table && b.dataset.volet === ev.target.value);
    if (bouton) bouton.click();
  });

  document.addEventListener("keydown", (ev) => {
    const onglet = ev.target.closest && ev.target.closest(".onglets [role=tab]");
    if (!onglet || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(ev.key)) return;
    ev.preventDefault();
    const table = onglet.closest("[data-onglets]");
    const tous = $$("[role=tab]", table).filter((b) => b.closest("[data-onglets]") === table);
    const sens = racine.dir === "rtl" ? -1 : 1;
    const i = ev.key === "Home" ? 0 : ev.key === "End" ? tous.length - 1 : tous.indexOf(onglet) + (ev.key === "ArrowRight" ? sens : -sens);
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
  const audioExclus = new Set((racine.dataset.audioExclues || "").split(" ").filter(Boolean));
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
      const zones = zonesDemandees(b);
      const enregistrees = zones.filter((z) => indexAudio && indexAudio[z] && !audioExclus.has(z));
      if (enregistrees.length > 0 && enregistrees.length === zones.length) {
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

  // Apparitions au défilement : schémas, cartes et figures entrent en douceur.
  const CIBLES = '.schema, .figure-officielle, .cycle, .cadre, .expertises > div, .liste li, .frise li, .lacune, .media, .chiffres > div, .travail, .personne, .notions > div, .cours-carte, .bandeau-texte, .trajectoire li, .valeurs > div, .piliers > div';
  const preparer = (racineZone) => $$(CIBLES, racineZone).forEach((el) => el.classList.add('revele'));
  preparer(document);
})();
