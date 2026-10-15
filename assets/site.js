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
  // Une entrée d’historique décrit une seule adresse et sa rubrique réelle.
  try { sessionStorage.removeItem('eb-navigation-v1:' + location.pathname); } catch {}
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  let memoirePrete = false, repriseEnCours = false, minuterieMemoire = 0, lectureAReprendre = null;
  let numeroReprise=0, adresseEnAttente=false, minuterieAdresse=0;

  // L’URL décide de la salle ; une sauvegarde d’une autre adresse est ignorée.
  function lireNavigation() {
    const etat=history.state?.ebNavigation;
    const destination=location.hash.slice(1).split('/')[0];
    if(!etat || etat.version!==2 || etat.chemin!==location.pathname || etat.fragment!==location.hash)return null;
    if(etat.libre)return etat.salle ? null : etat;
    return ordre.includes(destination) ? (etat.salle===destination ? etat : null) : (!etat.salle ? etat : null);
  }
  const navigationInitiale = lireNavigation();
  const zoneNavigation = () => courante && salle && !salle.hidden ? contenu : racine.classList.contains('libre') ? $('main') : null;
  function memoriserNavigation() {
    clearTimeout(minuterieMemoire);
    if (!memoirePrete || repriseEnCours || occupe) return;
    const zone = zoneNavigation();
    const etat = {
      version:2, chemin:location.pathname, fragment:location.hash,
      salle:courante, libre:racine.classList.contains('libre'), page:scrollY,
      hall:hallVolume?.etat?.(), reprise:courante ? null : lectureAReprendre,
      lecture:salle && courante ? salle.scrollTop : 0,
      porte:Number(($('.station-hall.selectionnee') || {}).dataset?.hallStation) || 0,
      simple:!!$('[data-hall-mode][aria-pressed="false"]:not([hidden])'),
      menu:onglets ? onglets.scrollLeft : 0,
      tables:zone ? $$('[data-onglets]',zone).map(table=>{
        const actif=$$('[role=tab]',table).find(b=>b.closest('[data-onglets]')===table && b.getAttribute('aria-selected')==='true');
        const nav=$('.onglets',table);
        return {rubrique:actif?.dataset.rubrique || '',volet:actif?.dataset.volet || '0',defilement:nav ? nav.scrollLeft : 0};
      }) : [],
      details:zone ? $$('details:not(.menu)',zone).map(d=>d.open) : []
    };
    try {
      const precedent=history.state && typeof history.state==='object' ? history.state : {};
      history.replaceState({...precedent,ebNavigation:etat},'');
    } catch {}
  }
  function demanderMemoire() {
    if (!memoirePrete || repriseEnCours) return;
    clearTimeout(minuterieMemoire);
    minuterieMemoire=setTimeout(memoriserNavigation,160);
  }


  // Inscrire la destination avant l’animation rend même un rechargement immédiat fiable.
  function reserverNavigation(fragment, destination=fragment) {
    numeroReprise++;repriseEnCours=false;
    memoriserNavigation();
    const hash=fragment ? '#'+fragment : '';
    const precedent=history.state?.ebNavigation || {};
    const etat={...precedent,version:2,chemin:location.pathname,fragment:hash,
      salle:ordre.includes(destination)?destination:null,libre:false,page:scrollY,lecture:0,
      menu:0,tables:[],details:[],reprise:null};
    try {
      history[location.hash===hash?'replaceState':'pushState']({ebNavigation:etat},'',location.pathname+location.search+hash);
    } catch {}
  }
  function terminerNavigation() {
    if(adresseEnAttente){adresseEnAttente=false;suivreAdresse();}
    else memoriserNavigation();
  }
  function suivreAdresse() {
    clearTimeout(minuterieAdresse);
    if(occupe){adresseEnAttente=true;return;}
    const etat=lireNavigation();
    const [destination,repere]=location.hash.slice(1).split('/');
    if(etat){reprendreNavigation(etat);return;}
    const libre=racine.classList.contains('libre') && !courante;
    reprendreNavigation({
      salle:!libre && ordre.includes(destination)?destination:null,libre,
      page:scrollY,lecture:0,ancre:libre?destination:repere || (!ordre.includes(destination)?destination:'')
    });
  }
  function demanderAdresse() {
    clearTimeout(minuterieAdresse);
    minuterieAdresse=setTimeout(suivreAdresse,0);
  }

  function reprendreNavigation(etat) {
    const reprise=++numeroReprise;
    repriseEnCours=true;
    racine.classList.toggle('libre',!!etat.libre);
    const mode=$('[data-hall-mode]');
    if(mode && !mode.hidden && (mode.getAttribute('aria-pressed')==='false')!==!!etat.simple)mode.click();
    hallVolume?.retablir?.({...etat.hall,selection:etat.hall?.selection ?? etat.porte ?? 0});
    if(salle && ordre.includes(etat.salle) && !etat.libre){
      afficher(etat.salle);
      salle.hidden=false;
      salle.classList.add('visible');
      document.body.classList.add('salle-ouverte');
      document.querySelectorAll('body > main, body > header, body > footer').forEach(el=>{el.inert=true;});
      marquer(etat.salle);
      $('[data-retour]',salle).focus({preventScroll:true});
    } else {
      courante=null;
      if(salle){salle.hidden=true;salle.classList.remove('visible');contenu.replaceChildren();}
      document.body.classList.remove('salle-ouverte');
      document.querySelectorAll('body > main, body > header, body > footer').forEach(el=>{el.inert=false;});
      document.querySelectorAll('.porte.ouverte').forEach(p=>p.classList.remove('ouverte'));
      marquer(null);hallVolume?.redessiner?.();signalerAudience();
    }
    const zone=zoneNavigation();
    const tables=zone ? $$('[data-onglets]',zone) : [];
    if(Array.isArray(etat.tables))etat.tables.forEach((sauve,i)=>{
      if(!sauve || !tables[i])return;
      const propres=table=>$$('[role=tab]',table).filter(b=>b.closest('[data-onglets]')===table);
      const table=sauve.rubrique ? tables.find(t=>propres(t).some(b=>b.dataset.rubrique===sauve.rubrique)) || tables[i] : tables[i];
      const bouton=propres(table).find(b=>sauve.rubrique ? b.dataset.rubrique===sauve.rubrique : b.dataset.volet===sauve.volet);
      if(bouton)bouton.click();
    });
    const repere=location.hash.slice(1).split('/')[1];
    const cibleRepere=repere && zone ? $$('.volet[data-rubrique],[data-axe-cible]',zone).find(el=>el.dataset.rubrique===repere || el.dataset.axeCible===repere) : null;
    if(cibleRepere){
      const parents=[];let panneau=cibleRepere.closest('.volet');
      while(panneau && zone.contains(panneau)){parents.unshift(panneau);panneau=panneau.parentElement?.closest('.volet');}
      parents.forEach(p=>{
        const table=p.closest('[data-onglets]');
        const bouton=table && $$('[role=tab]',table).find(b=>b.closest('[data-onglets]')===table && b.dataset.volet===p.dataset.volet);
        bouton?.click();
      });
    }
    if(zone && Array.isArray(etat.details))$$('details:not(.menu)',zone).forEach((d,i)=>{if(typeof etat.details[i]==='boolean')d.open=etat.details[i];});
    let interrompue=false;
    const interrompre=ev=>{if(ev.isTrusted)interrompue=true;};
    const gestes=['pointerdown','touchstart','wheel','keydown'];
    gestes.forEach(n=>document.addEventListener(n,interrompre,{capture:true,passive:true}));
    const nombre=v=>Number.isFinite(v) ? Math.max(0,v) : 0;
    const placer=()=>{
      if(interrompue || reprise!==numeroReprise)return;
      window.scrollTo({top:nombre(etat.page),left:0,behavior:'instant'});
      if(salle && courante)salle.scrollTo({top:nombre(etat.lecture),left:0,behavior:'instant'});
      if(onglets && Number.isFinite(etat.menu))onglets.scrollLeft=etat.menu;
      if(etat.ancre){
        const ancre=cibleRepere || document.getElementById(etat.ancre);
        ancre?.scrollIntoView({block:'start',behavior:'instant'});
      }
      if(Array.isArray(etat.tables))etat.tables.forEach((sauve,i)=>{
        const nav=tables[i] && $('.onglets',tables[i]);
        if(nav && Number.isFinite(sauve?.defilement))nav.scrollLeft=sauve.defilement;
      });
    };
    requestAnimationFrame(()=>{
      placer();
      requestAnimationFrame(()=>{
        if(reprise!==numeroReprise)return;
        placer();repriseEnCours=false;memoirePrete=true;memoriserNavigation();
      });
    });
    if(document.fonts)document.fonts.ready.then(placer);
    addEventListener('load',placer,{once:true});
    setTimeout(()=>{
      interrompue=true;
      gestes.forEach(n=>document.removeEventListener(n,interrompre,true));
      removeEventListener('load',placer);
    },1800);
  }

  function marquer(nom) {
    points.forEach((p, i) => p.classList.toggle("actif", ordre[i] === nom));
  }

  function synchroniserRubriques(table) {
    if (!table || table.dataset.navigation!=='atelier') return;
    const boutons=$$('[role=tab]',table).filter(b=>b.closest('[data-onglets]')===table);
    const actif=boutons.find(b=>b.getAttribute('aria-selected')==='true');
    const index=Math.max(0,boutons.indexOf(actif)), nav=$('.rubriques-nav',table);
    const compteur=$('[data-rubrique-compteur]',table), progression=$('[data-rubrique-progression]',table);
    if(compteur)compteur.textContent=String(index+1).padStart(2,'0')+' / '+String(boutons.length).padStart(2,'0');
    if(progression)progression.style.width=(100*(index+1)/boutons.length)+'%';
    if(nav){
      const horizontal=matchMedia('(max-width:1099px)').matches;
      nav.setAttribute('aria-orientation',horizontal?'horizontal':'vertical');
      if(actif && horizontal)nav.scrollLeft+=actif.getBoundingClientRect().left-nav.getBoundingClientRect().left-(nav.clientWidth-actif.offsetWidth)/2;
      else if(actif)nav.scrollTop+=actif.getBoundingClientRect().top-nav.getBoundingClientRect().top-(nav.clientHeight-actif.offsetHeight)/2;
    }
  }

  function signalerAudience() {
    const table=contenu && $('[data-navigation="atelier"]',contenu);
    const actif=table && $$('[role=tab]',table).find(b=>b.closest('[data-onglets]')===table && b.getAttribute('aria-selected')==='true');
    const etat={salle:courante || '',rubrique:actif?.dataset.rubrique || ''};
    racine.dataset.audienceSalle=etat.salle;
    racine.dataset.audienceRubrique=etat.rubrique;
    document.dispatchEvent(new CustomEvent('eb:page',{detail:etat}));
  }

  async function entrer(nom) {
    const groupe = groupeDe(nom);
    if (!groupe) return;
    if (!groupe.sections.length) {
      $("#" + groupe.nom).scrollIntoView({ behavior: sansPassage() ? "auto" : "smooth" });
      return;
    }
    const cible = groupe.sections.includes(nom) ? nom : groupe.sections[0];
    if (courante && groupeDe(courante) === groupe) return passerSous(cible);
    if (occupe) return;
    reserverNavigation(cible);
    occupe = true;
    reduit = sansPassage();
    const porte = groupe.porte;
    if (salle.classList.contains("visible")) await sortir(false,false);
    const zoneEntree = hallVolume && hallVolume.actif ? hallVolume.scene : porte;
    const r0 = zoneEntree.getBoundingClientRect();
    if (r0.top < 70 || r0.bottom > innerHeight) {
      zoneEntree.scrollIntoView({ block: "center", behavior: reduit ? "auto" : "smooth" });
      await attendre(300);
    }
    $$(".porte.ouverte").forEach((p) => p.classList.remove("ouverte"));
    const restaurerHall = hallVolume && hallVolume.actif ? await hallVolume.approcher(porte) : null;
    porte.classList.add("ouverte");
    marquer(nom);
    await attendre(restaurerHall ? 80 : 400);

    const r = $(".ouverture", porte).getBoundingClientRect();
    const passage = document.createElement("div");
    passage.className = "passage";
    const teinte = getComputedStyle(porte);
    const g1 = teinte.getPropertyValue("--c1").trim();
    passage.style.background = `radial-gradient(120% 70% at 50% 75%, color-mix(in srgb, ${g1} 12%, rgba(255,255,255,.78)) 0%, color-mix(in srgb, ${g1} 32%, rgba(255,255,255,.55)) 100%)`;
    Object.assign(passage.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.append(passage);
    if (!reduit && passage.animate) {
      const anim = passage.animate(
        [
          { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" },
          { left: "0px", top: "0px", width: innerWidth + "px", height: innerHeight + "px" },
        ],
        { duration: 420, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" }
      );
      await Promise.race([anim.finished, attendre(480)]);
    }

    afficher(cible);
    salle.hidden = false;
    salle.scrollTop = 0;
    document.body.classList.add("salle-ouverte");
    void salle.offsetWidth;
    salle.classList.add("visible");
    document.querySelectorAll("body > main, body > header, body > footer").forEach(el => { el.inert = true; });
    await attendre(220);
    passage.remove();
    if (restaurerHall) restaurerHall();
    $("[data-retour]", salle).focus({ preventScroll: true });
    occupe = false;
    terminerNavigation();
  }


// Les axes relient une salle et, au besoin, un travail ou un onglet précis.
  async function ouvrirDestinationAxe(fragment, memoriser = true) {
    const parties = fragment.split('/');
    const destination = parties[0];
    const repere = parties[1] || '';
    if (!ordre.includes(destination) || parties.length > 2 || (repere && !/^[a-z0-9-]+$/.test(repere)) || occupe) return;
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
      history.replaceState(history.state,'','#'+fragment);
      memoriserNavigation();
    }
  }

  document.addEventListener('click', ev => {
    const lien = ev.target.closest('a[data-axe-lien]');
    if (!lien || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
    ev.preventDefault();
    ouvrirDestinationAxe(lien.getAttribute('href').slice(1));
  });
  addEventListener('popstate',demanderAdresse);
  addEventListener('hashchange',demanderAdresse);

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
    if (matchMedia('(max-width:999px)').matches) {
      const actif = $('.onglet-salle.actif',onglets);
      if (actif) onglets.scrollLeft += actif.getBoundingClientRect().left - onglets.getBoundingClientRect().left - (onglets.clientWidth-actif.offsetWidth)/2;
    }
    const i = ordre.indexOf(s);
    $("[data-suivante]", salle).hidden = i === ordre.length - 1;
    $("[data-contact]", salle).hidden = i !== ordre.length - 1;
    salle.scrollTop = 0;
    courante = s;
    lectureAReprendre=null;
    const reprise=$('[data-reprendre-lecture]');
    if(reprise)reprise.hidden=true;
    $$('[data-navigation="atelier"]',contenu).forEach(synchroniserRubriques);
    signalerAudience();
    demanderMemoire();
  }

  // Petite porte : même transition que les grandes (la porte s’ouvre, on passe à travers).
  async function passerSous(x) {
    if (occupe || x === courante) return;
    reserverNavigation(x);
    const bouton = onglets.querySelector(`[data-sous="${x}"]`);
    if (!bouton) {afficher(x);terminerNavigation();return;}
    occupe = true;
    reduit = sansPassage();
    bouton.classList.add("ouverte");
    await attendre(180);
    const r = bouton.querySelector(".ouverture").getBoundingClientRect();
    const passage = document.createElement("div");
    passage.className = "passage";
    const c1 = bouton.style.getPropertyValue("--c1").trim();
    passage.style.background = `radial-gradient(120% 70% at 50% 75%, color-mix(in srgb, ${c1} 12%, rgba(255,255,255,.78)) 0%, color-mix(in srgb, ${c1} 32%, rgba(255,255,255,.55)) 100%)`;
    Object.assign(passage.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.append(passage);
    if (!reduit && passage.animate) {
      const anim = passage.animate(
        [
          { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" },
          { left: "0px", top: "0px", width: innerWidth + "px", height: innerHeight + "px" },
        ],
        { duration: 280, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" }
      );
      await Promise.race([anim.finished, attendre(330)]);
    }
    afficher(x);
    if (!reduit && passage.animate) await Promise.race([passage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }).finished, attendre(200)]);
    passage.remove();
    occupe = false;
    terminerNavigation();
  }

  async function sortir(rendreFocus = true, changerAdresse = true) {
    if (!courante || (occupe && changerAdresse)) return;
    if(changerAdresse)reserverNavigation('hall',null);
    const dejaOccupe=occupe;occupe=true;
    const nom = courante;
    courante = null;
    salle.classList.remove("visible");
    await attendre(450);
    salle.hidden = true;
    contenu.replaceChildren();
    document.body.classList.remove("salle-ouverte");
    hallVolume?.redessiner?.();
    document.querySelectorAll("body > main, body > header, body > footer").forEach(el => { el.inert = false; });
    const porte = groupeDe(nom).porte;
    setTimeout(() => porte.classList.remove("ouverte"), reduit ? 0 : 200);
    marquer(null);
    if (rendreFocus) porte.focus({ preventScroll: true });
    if(rendreFocus)signalerAudience();
    occupe=dejaOccupe;
    if(changerAdresse)terminerNavigation();
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
  $("#visite").addEventListener("click", () => entrer(ordre[0]));
  $("[data-retour]", salle).addEventListener("click", () => sortir());
  $("[data-suivante]", salle).addEventListener("click", () => {
    const suivante = ordre[ordre.indexOf(courante) + 1];
    if (suivante) entrer(suivante);
    salle.scrollTop = 0;
  });
  $("[data-contact]", salle).addEventListener("click", async () => {
    await sortir(false,false);
    reserverNavigation("contact",null);
    suivreAdresse();
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


  // Éclairage en fonction de l'heure locale du navigateur, sans géolocalisation.
  function actualiserLumiereHall() {
    const hall = document.querySelector('[data-hall-volume]');
    if (!hall) return;
    const maintenant = new Date();
    const annee = maintenant.getFullYear();
    const jour = Math.floor((Date.UTC(annee,maintenant.getMonth(),maintenant.getDate())-Date.UTC(annee,0,1))/86400000)+1;
    // Horaires saisonniers indicatifs, sans prétendre calculer l'aube astronomique.
    const saison = Math.cos(2*Math.PI*(jour-172)/365.2425);
    const lever = 420 - 75*saison, coucher = 1140 + 90*saison;
    const minutes = maintenant.getHours()*60 + maintenant.getMinutes();
    const moment = minutes < lever-45 || minutes >= coucher+50 ? 'nuit' :
      minutes < lever+50 ? 'aube' :
      minutes >= coucher-55 ? 'crepuscule' : 'jour';
    if (hall.dataset.moment !== moment) hall.dataset.moment = moment;
  }
  actualiserLumiereHall();
  setInterval(actualiserLumiereHall, 60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)actualiserLumiereHall();});

  let hallVolume = null;
  function initialiserHallVolume() {
    const hall = $('[data-hall-volume]');
    if (!hall) return;
    const scene = $('[data-hall-espace]',hall), monde = $('.hall-univers',hall), rail = $('.portes',hall);
    const stations = $$('[data-hall-station]',hall), choix = $$('[data-hall-choix]',hall);
    const mode = $('[data-hall-mode]',hall), reperes = $('[data-hall-reperes]',hall), commandes = $('[data-hall-commandes]',hall);
    const aideMobile = $('[data-hall-aide-mobile]',hall), positionMobile = $('[data-hall-position]',hall);
    const large = matchMedia('(min-width:1000px)'), calme = matchMedia('(prefers-reduced-motion:reduce)'), forcees = matchMedia('(forced-colors:active)');
    let selection = 0, simple = false, vueLarge = false, regardX = 0, regardY = 0, glissement = null, image = 0;
    let marche = null;
    let mobile = false, imageDefilement = 0, cibleMobile = null, minuterieMobile = 0, largeurMobile = 0;
    const hauteurMobile = () => {
      if (!mobile) return;
      const hauteur = stations[selection].offsetHeight + 24;
      if (rail.style.height !== hauteur + 'px') rail.style.height = hauteur + 'px';
    };
    const defilerMobile = (instant = false) => {
      if (!mobile) return;
      const cible = stations[selection].getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - 12;
      clearTimeout(minuterieMobile);
      cibleMobile=instant || calme.matches ? null : selection;
      if(cibleMobile!==null)minuterieMobile=setTimeout(()=>{cibleMobile=null;},800);
      rail.scrollTo({left:cible,behavior:instant || calme.matches ? 'instant' : 'smooth'});
    };
    const angleDe = station => parseFloat(getComputedStyle(station).getPropertyValue('--station-angle')) || 0;
    const camera = (index, entrer = false, profondeur = 50) => {
      const station = stations[index], porte = groupes[index].porte, panneau = $('.panneau-hall',station);
      const a = angleDe(station) * Math.PI / 180;
      const localX = entrer ? porte.offsetLeft + porte.offsetWidth / 2 : (porte.offsetLeft + panneau.offsetLeft + panneau.offsetWidth) / 2;
      const localY = entrer ? porte.offsetTop + porte.offsetHeight / 2 : 420;
      const dx = station.offsetLeft + Math.cos(a) * localX - monde.offsetWidth / 2;
      const dy = localY - monde.offsetHeight / 2;
      const dz = parseFloat(getComputedStyle(station).getPropertyValue('--station-z')) - Math.sin(a) * localX;
      const rotation = -angleDe(station) + (entrer ? 0 : regardX);
      const pitch = entrer ? 0 : regardY;
      const ry = rotation * Math.PI / 180, rx = pitch * Math.PI / 180;
      const x = dx * Math.cos(ry) + dz * Math.sin(ry);
      const z = -dx * Math.sin(ry) + dz * Math.cos(ry);
      const y = dy * Math.cos(rx) - z * Math.sin(rx);
      const zFinal = dy * Math.sin(rx) + z * Math.cos(rx);
      const s = Math.min(1.04, Math.max(.82, scene.clientWidth / 1180));
      const tx = -s*x, ty = scene.clientHeight*.52 - monde.offsetTop - s*y, tz = profondeur - s*zFinal;
      return 'translate(-50%,-50%) translate3d('+tx.toFixed(2)+'px,'+ty.toFixed(2)+'px,'+tz.toFixed(2)+'px) scale('+s.toFixed(3)+') rotateX('+pitch.toFixed(2)+'deg) rotateY('+rotation.toFixed(2)+'deg)';
    };
    const panorama = () => 'translate(-50%,-50%) translate3d(0px,48px,-160px) scale(' + Math.min(.72, scene.clientWidth/1900).toFixed(3) + ') rotateX(-5deg) rotateY(0deg)';
    const dessiner = () => {
      image = 0;
      if (mobile) { hauteurMobile(); return; }
      if (!hall.classList.contains('en-volume') || occupe) return;
      if(marche){marche.dessiner();return;}
      monde.style.transform = vueLarge ? panorama() : camera(selection);
    };
    const demander = () => { if (!image) image = requestAnimationFrame(dessiner); };
    const marquerChoix = () => {
      choix.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selection)));
      stations.forEach((s,i)=>{s.classList.toggle('selectionnee',i===selection);s.inert=mobile && i!==selection;});
      if (positionMobile) positionMobile.textContent = String(selection+1).padStart(2,'0') + ' / ' + String(stations.length).padStart(2,'0');
      if(mobile && reperes && choix[selection]){
        const cadre=reperes.getBoundingClientRect(), bouton=choix[selection].getBoundingClientRect();
        if(bouton.left<cadre.left || bouton.right>cadre.right)reperes.scrollBy({left:bouton.left-cadre.left-(cadre.width-bouton.width)/2,behavior:calme.matches?'instant':'smooth'});
      }
      hauteurMobile();
      demanderMemoire();
    };
    const choisir = index => {
      if (occupe) return;
      selection = Math.max(0,Math.min(stations.length-1,index));
      vueLarge = false; regardX = 0; regardY = 0;
      marquerChoix(); demander();
      defilerMobile();
      if(!mobile && marche)marche.choisir(selection);
    };
    const actualiser = () => {
      const accessible = /(^| )(lv|hc|t[123])( |$)/.test(racine.className) || forcees.matches;
      const possible = large.matches && !accessible && typeof CSS!=='undefined' && CSS.supports('transform-style','preserve-3d');
      mode.hidden = !possible;
      const actif = possible && !simple;
      const ancienMobile = mobile;
      mobile = !large.matches && !accessible;
      hall.classList.toggle('en-volume',actif);
      hall.classList.toggle('en-mobile',mobile);
      mode.setAttribute('aria-pressed',String(actif));
      [reperes,commandes].forEach(el=>el.hidden=!(actif || mobile));
      if (aideMobile) aideMobile.hidden=!mobile;
      if (hallVolume) { hallVolume.actif=actif || mobile; hallVolume.mobile=mobile; }
      if(marche)marche.activer(actif);
      if (!actif) monde.style.removeProperty('transform');
      if (!mobile) rail.style.removeProperty('height');
      if (!mobile) {clearTimeout(minuterieMobile);cibleMobile=null;}
      marquerChoix();
      if (mobile && !ancienMobile) requestAnimationFrame(()=>defilerMobile(true));
      demander();
    };
    hallVolume = {
      actif:false, scene,
      etat(){return {...(marche?.etat() || {}),selection};},
      redessiner(){demander();},
      retablir(etat){
        if(Number.isInteger(etat?.selection))selection=Math.max(0,Math.min(stations.length-1,etat.selection));
        if(marche)marche.retablir(etat);
        marquerChoix();if(mobile)defilerMobile(true);demander();
      },
      async approcher(porte) {
        if (!this.actif) return null;
        const i = groupes.findIndex(g=>g.porte===porte);
        if (i<0) return null;
        if(!mobile && marche)return marche.approcher(i);
        selection=i; vueLarge=false; regardX=0; regardY=0; marquerChoix();
        if (mobile) {
          defilerMobile(true);
          if (reduit || !monde.animate) return null;
          const cadre = monde.getBoundingClientRect(), entree = $('.baie',porte).getBoundingClientRect();
          const x = entree.left + entree.width/2 - cadre.left, y = entree.top + entree.height/2 - cadre.top;
          monde.style.transformOrigin = x + 'px ' + y + 'px';
          hall.classList.add('en-marche');
          const animation = monde.animate([
            {transform:'translate3d(0,0,0) scale(1)'},
            {transform:'translate3d(' + (cadre.width/2-x).toFixed(1) + 'px,' + (cadre.height/2-y).toFixed(1) + 'px,0) scale(2.5)'}
          ],{duration:520,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
          await Promise.all([
            attendre(180).then(()=>porte.classList.add('ouverte')),
            Promise.race([animation.finished.catch(()=>{}),attendre(580)])
          ]);
          return ()=>{animation.cancel();monde.style.removeProperty('transform-origin');hall.classList.remove('en-marche');};
        }
        if (reduit || !monde.animate) return null;
        const depart = getComputedStyle(monde).transform;
        monde.style.transform = camera(i);
        hall.classList.add('en-marche');
        const animation = monde.animate([
          {transform:depart,offset:0},
          {transform:camera(i,false,100),offset:.48},
          {transform:camera(i,true,720),offset:1}
        ],{duration:950,easing:'cubic-bezier(.42,0,.18,1)',fill:'forwards'});
        await Promise.all([
          attendre(460).then(()=>porte.classList.add('ouverte')),
          Promise.race([animation.finished.catch(()=>{}),attendre(1020)])
        ]);
        return ()=>{animation.cancel();hall.classList.remove('en-marche');if(marche)marche.placerDevant(i);demander();};
      }
    };
    stations.forEach((station,i)=>station.addEventListener('focusin',()=>{if(mobile && hallVolume.actif && selection!==i && !occupe)choisir(i);}));
    rail.addEventListener('scroll',()=>{
      if (!mobile || occupe || imageDefilement) return;
      if(cibleMobile!==null){
        if(Math.abs(stations[cibleMobile].getBoundingClientRect().left-rail.getBoundingClientRect().left-12)>2)return;
        clearTimeout(minuterieMobile);cibleMobile=null;
      }
      imageDefilement=requestAnimationFrame(()=>{
        imageDefilement=0;
        if(!mobile || occupe || cibleMobile!==null)return;
        const centre=rail.getBoundingClientRect().left+rail.clientWidth/2;
        let plusProche=selection, distance=Infinity;
        stations.forEach((station,i)=>{
          const r=station.getBoundingClientRect(), ecart=Math.abs(r.left+r.width/2-centre);
          if(ecart<distance){distance=ecart;plusProche=i;}
        });
        if(plusProche!==selection){selection=plusProche;marquerChoix();}
      });
    },{passive:true});
    rail.addEventListener('pointerdown',()=>{if(mobile){clearTimeout(minuterieMobile);cibleMobile=null;}},{passive:true});
    rail.addEventListener('keydown',ev=>{
      if(!mobile || ev.target.closest('button,a') || !['ArrowLeft','ArrowRight'].includes(ev.key))return;
      ev.preventDefault();choisir(selection+(ev.key==='ArrowRight'?1:-1));
    });
    mode.addEventListener('click',()=>{simple=!simple;actualiser();});
    choix.forEach((b,i)=>{
      b.addEventListener('click',()=>choisir(i));
      b.addEventListener('keydown',ev=>{
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(ev.key))return;
        ev.preventDefault();
        const sens=racine.dir==='rtl'?-1:1;
        const n=ev.key==='Home'?0:ev.key==='End'?choix.length-1:(i+(ev.key==='ArrowRight'?sens:-sens)+choix.length)%choix.length;
        choisir(n);choix[n].focus();
      });
    });
    $$('[data-hall-sous]',hall).forEach(b=>b.addEventListener('click',()=>entrer(b.dataset.hallSous)));
    $$('[data-hall-entrer]',hall).forEach(b=>b.addEventListener('click',()=>entrer(groupes[+b.dataset.hallEntrer].sections[0]||groupes[+b.dataset.hallEntrer].nom)));
    $('[data-hall-precedente]',hall).addEventListener('click',()=>choisir(selection-1));
    $('[data-hall-suivante]',hall).addEventListener('click',()=>choisir(selection+1));
    $('[data-hall-recentrer]',hall).addEventListener('click',()=>{if(occupe)return;if(marche){marche.recentrer();return;}vueLarge=true;regardX=0;regardY=0;demander();});
    scene.addEventListener('pointerdown',ev=>{
      if(marche||mobile||ev.pointerType!=='mouse'||ev.button!==0||ev.target.closest('button,a')||!hallVolume.actif||calme.matches||occupe)return;
      glissement={x:ev.clientX,y:ev.clientY};
      scene.classList.add('en-glissement');scene.setPointerCapture(ev.pointerId);ev.preventDefault();
    });
    scene.addEventListener('pointermove',ev=>{
      if(marche||mobile||ev.pointerType!=='mouse'||!hallVolume.actif||calme.matches||occupe||vueLarge||(salle&&!salle.hidden))return;
      const r=scene.getBoundingClientRect();
      regardX=glissement?Math.max(-7,Math.min(7,(ev.clientX-glissement.x)*.035)):((ev.clientX-r.left)/r.width-.5)*1.4;
      regardY=glissement?Math.max(-2,Math.min(2,(ev.clientY-glissement.y)*.015)):((ev.clientY-r.top)/r.height-.5)*.8;
      demander();
    },{passive:true});
    const finir=()=>{glissement=null;scene.classList.remove('en-glissement');};
    ['pointerup','pointercancel','lostpointercapture'].forEach(n=>scene.addEventListener(n,finir));
    scene.addEventListener('pointerleave',()=>{if(!glissement){regardX=0;regardY=0;demander();}});
    [large,calme,forcees].forEach(m=>m.addEventListener('change',actualiser));
    if(typeof ResizeObserver!=='undefined'){
      const observation=new ResizeObserver(()=>{
        demander();
        if(mobile&&!occupe&&largeurMobile!==rail.clientWidth){largeurMobile=rail.clientWidth;defilerMobile(true);}
      });
      observation.observe(scene);stations.forEach(station=>observation.observe(station));
    }
    else addEventListener('resize',demander,{passive:true});
    new MutationObserver(actualiser).observe(racine,{attributes:true,attributeFilter:['class']});
    if(window.creerMarcheHall)marche=window.creerMarcheHall({hall,scene,monde,stations,surSelection:i=>{selection=i;marquerChoix();}});
    marquerChoix();actualiser();
  }
  initialiserHallVolume();

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
    synchroniserRubriques(table);
    if(!repriseEnCours && courante && contenu.contains(onglet)){
      if(onglet.dataset.rubrique)history.replaceState(history.state,'','#'+courante+'/'+onglet.dataset.rubrique);
      memoriserNavigation();
    }
    signalerAudience();
    const panneau=propres('.volet').find(v=>!v.hidden);
    if(table.dataset.navigation==='atelier' && panneau && panneau.animate && !sansPassage() && !repriseEnCours){
      panneau.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:210,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  });

  document.addEventListener('click',ev=>{
    const pas=ev.target.closest('[data-rubrique-pas]');
    const renvoi=ev.target.closest('[data-these-vers]');
    if(!pas && !renvoi)return;
    const table=(pas || renvoi).closest('[data-onglets]') || (renvoi && renvoi.closest('.these')?.querySelector('[data-rubriques="these"]'));
    if(!table)return;
    const boutons=$$('[role=tab]',table).filter(b=>b.closest('[data-onglets]')===table);
    const actuel=boutons.findIndex(b=>b.getAttribute('aria-selected')==='true');
    const cible=renvoi ? boutons.find(b=>b.dataset.rubrique===renvoi.dataset.theseVers) : boutons[actuel+Number(pas.dataset.rubriquePas)];
    if(!cible)return;
    cible.click();
    const panneau=$$('.volet',table).find(v=>v.closest('[data-onglets]')===table && !v.hidden);
    const article=renvoi?.dataset.theseObjectif && panneau ? $$('article[data-objectif]',panneau).find(a=>a.dataset.objectif===renvoi.dataset.theseObjectif) : null;
    const destination=article || panneau;
    if(destination){destination.tabIndex=-1;destination.focus({preventScroll:true});destination.scrollIntoView({block:'start',behavior:sansPassage()?'instant':'smooth'});}
  });

  document.addEventListener("change", (ev) => {
    if (!ev.target.matches("[data-rubrique-select]")) return;
    const table = ev.target.closest("[data-onglets]");
    const bouton = $$("[role=tab]", table).find((b) => b.closest("[data-onglets]") === table && b.dataset.volet === ev.target.value);
    if (bouton) bouton.click();
  });

  document.addEventListener("keydown", (ev) => {
    const onglet = ev.target.closest && ev.target.closest(".onglets [role=tab]");
    if (!onglet || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(ev.key)) return;
    ev.preventDefault();
    const table = onglet.closest("[data-onglets]");
    const tous = $$("[role=tab]", table).filter((b) => b.closest("[data-onglets]") === table);
    const sens = racine.dir === "rtl" ? -1 : 1;
    const delta=ev.key==='ArrowDown'?1:ev.key==='ArrowUp'?-1:ev.key==='ArrowRight'?sens:-sens;
    const i = ev.key === "Home" ? 0 : ev.key === "End" ? tous.length - 1 : tous.indexOf(onglet) + delta;
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
  $$('[data-navigation="atelier"]').forEach(synchroniserRubriques);

  document.addEventListener('scroll',demanderMemoire,{capture:true,passive:true});
  document.addEventListener('eb:hallposition',demanderMemoire);
  ['click','change','toggle'].forEach(n=>document.addEventListener(n,demanderMemoire,true));
  addEventListener('pagehide',memoriserNavigation);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)memoriserNavigation();});
  requestAnimationFrame(async()=>{
    document.querySelectorAll('.porte.ouverte').forEach(p=>p.classList.remove('ouverte'));
    document.querySelectorAll('.passage').forEach(p=>p.remove());
    if(navigationInitiale){reprendreNavigation(navigationInitiale);return;}
    if(location.hash){suivreAdresse();return;}
    memoirePrete=true;
    demanderMemoire();
  });
})();


/* Les quatre mini portes de Publications défilent dans la salle, sans changer son URL. */
document.addEventListener("click",function(event){
 const bouton=event.target.closest("[data-publications-cible]");if(!bouton)return;
 const racine=bouton.closest(".publications-page");
 const cible=racine&&racine.querySelector("#"+bouton.dataset.publicationsCible);
 if(!cible)return;
 cible.focus({preventScroll:true});
 cible.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
});
