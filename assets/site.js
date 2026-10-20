"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const racine = document.documentElement;
  // Le hall commence après le premier écran, sans tronquer son en-tête.
  const presentationAccueil = $('.accueil > .presentation');
  const enteteAccueil = $('body > .entete');
  const accueilLarge = matchMedia('(min-width:1081px)');
  function ajusterJonctionAccueil() {
    if (!presentationAccueil) return;
    if (!accueilLarge.matches) { presentationAccueil.style.removeProperty('--presentation-min'); return; }
    const haut = presentationAccueil.getBoundingClientRect().top + scrollY;
    const intervalle = parseFloat(getComputedStyle(presentationAccueil.parentElement).rowGap) || 0;
    presentationAccueil.style.setProperty('--presentation-min', Math.max(0, innerHeight - haut - intervalle + 12) + 'px');
  }
  ajusterJonctionAccueil();
  addEventListener('resize', ajusterJonctionAccueil, { passive:true });
  if (enteteAccueil && 'ResizeObserver' in window) new ResizeObserver(ajusterJonctionAccueil).observe(enteteAccueil);
  document.fonts?.ready.then(ajusterJonctionAccueil);
  // L’indice « glissez » disparaît au premier geste dans le hall, ou quelques secondes après être apparu.
  const hallIndice = $('.hall-indice');
  if (hallIndice) {
    const espace = hallIndice.parentElement, gestesIndice = ['pointerdown','wheel','keydown','touchstart'];
    const masquerIndice = () => { hallIndice.classList.add('vu'); gestesIndice.forEach((n) => espace.removeEventListener(n, masquerIndice)); };
    gestesIndice.forEach((n) => espace.addEventListener(n, masquerIndice, { passive:true }));
    if ('IntersectionObserver' in window) {
      const vue = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { vue.disconnect(); setTimeout(masquerIndice, 7000); } }, { threshold:.5 });
      vue.observe(espace);
    } else setTimeout(masquerIndice, 9000);
  }
  const groupes = $$(".porte").map((p) => ({ nom: p.dataset.salle, porte: p, sections: (p.dataset.sections || "").split(" ").filter(Boolean) }));
  const ordre = groupes.flatMap((g) => g.sections);
  const groupeDe = (s) => groupes.find((g) => g.nom === s || g.sections.includes(s));
  const mouvementReduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Le zoom des modes basse vision et taille du texte fausse les coordonnées du passage : on l'omet.
  const sansPassage = () => mouvementReduit || /(^| )(lv|t[123])( |$)/.test(racine.className);
  let reduit = mouvementReduit;
  const attendre = (ms) => new Promise((r) => setTimeout(r, reduit ? 0 : ms));
  const mobileTactile=matchMedia('(max-width:999px) and (pointer:coarse)');
  const salle = $("#salle");
  const contenu = salle && $(".salle-contenu", salle);
  const points = $$(".points span");
  let courante = null;
  let occupe = false;
  // Une entrée d’historique décrit une seule adresse et sa rubrique réelle.
  try { sessionStorage.removeItem('eb-navigation-v1:' + location.pathname); } catch {}
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  // La page reste masquée jusqu’à ce qu’elle soit placée à sa position finale.
  const reveler = () => racine.classList.remove('chargement');
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
      tables:zone ? $$('[data-onglets]',zone).map(table=>{
        const actif=$$('[role=tab]',table).find(b=>b.closest('[data-onglets]')===table && b.getAttribute('aria-selected')==='true');
        const nav=$('.onglets',table);
        return {rubrique:actif?.dataset.rubrique || '',volet:actif?.dataset.volet || '0',defilement:nav ? nav.scrollLeft : 0};
      }) : [],
      details:zone ? $$('details:not(.menu)',zone).map(d=>d.matches('.o2-these-tech') ? false : d.open) : []
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
    const cibleRepere=repere && zone ? $$('.chapitre-source[data-rubrique],[data-axe-cible],.publication-bloc[id]',zone).find(el=>el.dataset.rubrique===repere || el.dataset.axeCible===repere || el.id===repere) : null;
    if(cibleRepere){
      const pub=cibleRepere.closest('.publication-bloc');
      if(pub)selectionnerPublication(pub.closest('.publications-page'),pub.id);
      const parents=[];let panneau=cibleRepere.closest('.volet');
      while(panneau && zone.contains(panneau)){parents.unshift(panneau);panneau=panneau.parentElement?.closest('.volet');}
      parents.forEach(p=>{
        const table=p.closest('[data-onglets]');
        const bouton=table && $$('[role=tab]',table).find(b=>b.closest('[data-onglets]')===table && b.dataset.volet===p.dataset.volet);
        bouton?.click();
      });
    }
    if(zone && Array.isArray(etat.details))$$('details:not(.menu)',zone).forEach((d,i)=>{if(d.matches('.o2-these-tech'))d.open=false;else if(typeof etat.details[i]==='boolean')d.open=etat.details[i];});
    let interrompue=false;
    const interrompre=ev=>{if(ev.isTrusted)interrompue=true;};
    const gestes=['pointerdown','touchstart','wheel','keydown'];
    gestes.forEach(n=>document.addEventListener(n,interrompre,{capture:true,passive:true}));
    const nombre=v=>Number.isFinite(v) ? Math.max(0,v) : 0;
    const placer=()=>{
      if(interrompue || reprise!==numeroReprise)return;
      window.scrollTo({top:nombre(etat.page),left:0,behavior:'instant'});
      if(salle && courante)salle.scrollTo({top:nombre(etat.lecture),left:0,behavior:'instant'});
      if(etat.ancre){
        const ancre=cibleRepere || zone?.querySelector('#'+CSS.escape(etat.ancre)) || document.getElementById(etat.ancre);
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
        placer();reveler();repriseEnCours=false;memoirePrete=true;memoriserNavigation();
      });
    });
    if(document.fonts)document.fonts.ready.then(placer);
    addEventListener('load',placer,{once:true});
    setTimeout(()=>{
      reveler();
      interrompue=true;
      gestes.forEach(n=>document.removeEventListener(n,interrompre,true));
      removeEventListener('load',placer);
    },1800);
  }

  function marquer(nom) {
    points.forEach((p, i) => p.classList.toggle("actif", ordre[i] === nom));
  }

  function signalerAudience() {
    const actif=contenu && $('.gab-page-active',contenu);
    const etat={salle:courante || '',rubrique:actif?.dataset.gabSlug || ''};
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
    if (courante && groupeDe(courante) === groupe) {
      if (occupe || cible === courante) return;
      reserverNavigation(cible);
      afficher(cible);
      terminerNavigation();
      return;
    }
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
    await attendre(restaurerHall ? 80 : mobileTactile.matches ? 210 : 400);

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
        { duration: mobileTactile.matches ? 250 : 420, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" }
      );
      await Promise.race([anim.finished, attendre(mobileTactile.matches ? 310 : 480)]);
    }

    afficher(cible);
    salle.hidden = false;
    salle.scrollTop = 0;
    document.body.classList.add("salle-ouverte");
    void salle.offsetWidth;
    salle.classList.add("visible");
    document.querySelectorAll("body > main, body > header, body > footer").forEach(el => { el.inert = true; });
    await attendre(mobileTactile.matches ? 110 : 220);
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
      ? zone.querySelector('[data-axe-cible="' + repere + '"], .chapitre-source[data-rubrique="' + repere + '"]')
      : zone;
    if (cible) {
      const pub=cible.closest('.publication-bloc');
      if(pub)selectionnerPublication(pub.closest('.publications-page'),pub.id);
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

  if(salle){
    const barre=$(".salle-barre",salle);
    const actualiserHauteur=()=>{const h=barre?.getBoundingClientRect().height||0;if(h>0)salle.style.setProperty('--salle-barre-hauteur',Math.ceil(h)+'px');};
    if(barre && typeof ResizeObserver!=='undefined')new ResizeObserver(actualiserHauteur).observe(barre);
    else addEventListener('resize',actualiserHauteur,{passive:true});
    actualiserHauteur();
  }

  function selectionnerPublication(root,id,options={}) {
    if(!root)return;
    const panels=$$('.publication-bloc',root),active=panels.find(p=>p.id===id);
    if(!active)return;
    panels.forEach(p=>p.hidden=p!==active);
    const tabs=$$('[data-publications-cible]',root);
    tabs.forEach(b=>{const chosen=b.dataset.publicationsCible===id;b.setAttribute('aria-selected',String(chosen));b.tabIndex=chosen?0:-1;b.classList.toggle('est-actif',chosen);});
    const label=$('[data-publications-annonce]',root),tab=tabs.find(b=>b.dataset.publicationsCible===id);
    if(label&&tab)label.textContent=tab.querySelector('strong')?.textContent||'';
    if(options.adresse&&courante==='publications'){history.replaceState(history.state,'','#publications/'+id);memoriserNavigation();}
    if(options.focus&&tab)tab.focus({preventScroll:true});
    if(options.defiler)active.scrollIntoView({block:'nearest',behavior:sansPassage()?'auto':'smooth'});
  }
  // Les articles se lisent comme une liste bibliographique : HPE d'abord,
  // le manuscrit sur le retour épistémique en dernier. Aucun menu n'est modifié.
  function ordonnerNoticesPublications(root) {
    const liste=$('#publication-articles .travaux-grille',root);
    if(!liste)return;
    const ordre=['travail-hospitalisations','travail-pl2','travail-droit','travail-epistemique'];
    const notices=$$(':scope > article.travail',liste);
    notices.sort((a,b)=>{
      const x=ordre.indexOf(a.dataset.axeCible),y=ordre.indexOf(b.dataset.axeCible);
      return (x<0?ordre.length:x)-(y<0?ordre.length:y);
    }).forEach(article=>liste.appendChild(article));
    const traductions={fr:'Lire le résumé',en:'Read abstract',es:'Leer resumen',zh:'阅读摘要',ar:'قراءة الملخص',ru:'Читать аннотацию'};
    notices.forEach(article=>{
      const resume=$('.resume',article);
      if(!resume || $('.pub-details',article))return;
      const details=document.createElement('details');
      details.className='pub-details';
      const titre=document.createElement('summary');
      titre.textContent=traductions[document.documentElement.lang?.slice(0,2)]||traductions.fr;
      details.appendChild(titre);
      resume.before(details);
      details.appendChild(resume);
      const motsCles=$('.etiquettes',article);
      if(motsCles)details.appendChild(motsCles);
    });
  }
  function initialiserPublications(zone=document) {
    $$('.publications-page',zone).forEach(root=>{
      ordonnerNoticesPublications(root);
      const frag=location.hash.slice(1).split('/')[1],panels=$$('.publication-bloc',root);
      const target=panels.find(p=>p.id===frag)||$$('[data-axe-cible]',root).find(el=>el.dataset.axeCible===frag)?.closest('.publication-bloc');
      selectionnerPublication(root,target?.id||'publication-articles');
    });
  }
  document.addEventListener('click',ev=>{
    const b=ev.target.closest('[data-publications-cible]'),root=b?.closest('.publications-page');
    if(root)selectionnerPublication(root,b.dataset.publicationsCible,{adresse:true,defiler:true});
  });
  document.addEventListener('keydown',ev=>{
    const b=ev.target.closest('.pub-format[role="tab"]'),root=b?.closest('.publications-page');
    if(!root)return;
    const tabs=$$('[data-publications-cible]',root),i=tabs.indexOf(b),before=document.dir==='rtl'?'ArrowRight':'ArrowLeft',after=document.dir==='rtl'?'ArrowLeft':'ArrowRight';
    let chosen;
    if(ev.key===before)chosen=tabs[(i+tabs.length-1)%tabs.length];
    else if(ev.key===after)chosen=tabs[(i+1)%tabs.length];
    else if(ev.key==='Home')chosen=tabs[0];
    else if(ev.key==='End')chosen=tabs[tabs.length-1];
    if(chosen){ev.preventDefault();selectionnerPublication(root,chosen.dataset.publicationsCible,{adresse:true,focus:true});}
  });

  function afficher(s) {
    const groupe = groupeDe(s);
    const section = $(`section[data-salle="${s}"]`);
    contenu.replaceChildren(section.querySelector(".section-contenu").cloneNode(true));
    initialiserPublications(contenu);
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
    salle.style.setProperty("--c1", getComputedStyle(groupe.porte).getPropertyValue("--c1"));
    $("#salle-titre").textContent = `${String(ordre.indexOf(s) + 1).padStart(2, "0")} / ${String(ordre.length).padStart(2, "0")} · ${groupe.porte.dataset.titre} · ${section.dataset.titre}`;
    const i = ordre.indexOf(s);
    salle.scrollTop = 0;
    courante = s;
    lectureAReprendre=null;
    const reprise=$('[data-reprendre-lecture]');
    if(reprise)reprise.hidden=true;
    signalerAudience();
    demanderMemoire();
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
    porte.classList.remove("ouverte");
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
    const boutonMobilePrecedent=$('[data-hall-precedente]',hall);
    const boutonMobileSuivant=$('[data-hall-suivante]',hall);
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
      if(boutonMobilePrecedent)boutonMobilePrecedent.disabled=selection===0;
      if(boutonMobileSuivant)boutonMobileSuivant.disabled=selection===stations.length-1;
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
          // Transition tactile légère, sans coûteux zoom 3D.
          if (mobileTactile.matches || reduit || !monde.animate) return null;
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
      b.addEventListener('click',()=>{
        choisir(i);
        // Les six carrés sont placés après le décor sur téléphone :
        // ramener la porte sélectionnée à l'écran, sans modifier le comportement ordinateur.
        if(mobile && matchMedia('(max-width:700px)').matches)
          scene.scrollIntoView({behavior:calme.matches?'auto':'smooth',block:'start'});
      });
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
    signalerAudience();
  });

  document.addEventListener("keydown", (ev) => {
    const onglet = ev.target.closest && ev.target.closest(".onglets [role=tab]");
    if (!onglet || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(ev.key)) return;
    ev.preventDefault();
    const table = onglet.closest("[data-onglets]");
    const tous = $("[role=tab]", table).filter((b) => b.closest("[data-onglets]") === table);
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

  // Accès transversal au dossier approfondi : ajouté AVANT la duplication des salles.
  // Conserve intactes les deux rubriques historiques et la navigation du hall.
  // Le dossier d'implantation est intégré dans le chapitre 03 par gabarit-salles.js.


  // Apparitions au défilement : schémas, cartes et figures entrent en douceur.
  const CIBLES = '.schema, .figure-officielle, .cycle, .cadre, .expertises > div, .liste li, .frise li, .lacune, .media, .chiffres > div, .travail, .personne, .notions > div, .cours-carte, .bandeau-texte, .trajectoire li, .valeurs > div, .piliers > div';
  const preparer = (racineZone) => $$(CIBLES, racineZone).forEach((el) => el.classList.add('revele'));
  preparer(document);
  initialiserPublications(document);

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
    reveler();
    demanderMemoire();
  });
})();


// Vidéo de visite : pas de lecture automatique si l’animation est réduite
(()=>{const v=document.querySelector('.tuto-video video');if(!v)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();}})();


/* Atlas O2 : galerie exhaustive statique ; interactions dans galerie-o2.js. */

// Atlas O3 — réseaux egocentres CLSC Centre-Sud (figures scientifiques et volets qualitatifs).
(()=>{
  if (!/^fr(?:-|$)/i.test(document.documentElement.lang || "")) return;
  if (document.querySelector('script[data-o3-reseaux]')) return;
  const script = document.createElement('script');
  script.dataset.o3Reseaux = '1';
  script.src = (document.documentElement.dataset.racine || './') + 'assets/o3-reseaux.js?v=20261019-retro-prospectif-v1';
  script.defer = true;
  document.head.appendChild(script);
})();


/* Clarification du produit O2 et de son rôle dans la sélection des terrains O3. */
(() => {
  const lang = (document.documentElement.lang || "fr").toLowerCase();
  const en = lang.startsWith("en");
  if (!lang.startsWith("fr") && !en) return;

  const actualiserDevis = () => {
    const devis = document.querySelector('.these .a-apercu .a-devis');
    if (!devis) return;
    const cartes = devis.querySelectorAll(':scope > .a-obj');
    const produitO2 = cartes[1]?.querySelector('.a-prod');
    if (!produitO2) return;
    produitO2.textContent = en
      ? 'CLSC-level atlas of needs, resources and territorial gaps'
      : 'Atlas des besoins, ressources et écarts territoriaux par CLSC';

    if (devis.nextElementSibling?.classList.contains('a-o2-vers-o3')) return;
    const note = document.createElement('p');
    note.className = 'a-o2-vers-o3';
    const titre = document.createElement('strong');
    titre.textContent = en ? 'O2 → O3 · From maps to networks.' : 'O2 → O3 · De la cartographie aux réseaux.';
    const explication = document.createElement('span');
    explication.textContent = en
      ? ' The atlas and needs–resources matrix reveal potential mismatches in provision and accessibility. These territorial contrasts guide the selection of CLSC areas for comparison in O3, where actually mobilised intersectoral relationships will be studied.'
      : ' L’atlas et la matrice besoins–ressources font ressortir les écarts potentiels d’offre et d’accessibilité. Ces contrastes orientent la sélection de territoires de CLSC à comparer en O3, où seront étudiées les relations intersectorielles effectivement mobilisées.';
    note.append(titre, explication);
    devis.after(note);
    if (!document.getElementById('style-a-o2-vers-o3')) {
      const style = document.createElement('style');
      style.id = 'style-a-o2-vers-o3';
      style.textContent = `
        .these .a-o2-vers-o3 {
          margin: 15px 0 16px;
          padding: 13px clamp(15px,2vw,22px);
          border: 1px solid #cee1d9;
          border-inline-start: 4px solid #61a644;
          border-radius: 10px;
          background: #f5faf7;
          color: #254840;
          font-size: clamp(14px,1.08vw,16px);
          line-height: 1.6;
          text-align: start;
          hyphens: none;
          overflow-wrap: break-word;
        }
        .these .a-o2-vers-o3 strong { color: #173f39; font-weight: 750; }
      `;
      document.head.appendChild(style);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', actualiserDevis, { once: true });
  } else {
    actualiserDevis();
  }
})();


/* Thèse : afficher les trois objectifs dans une seule page de méthodologie.
   Les liens O1/O2/O3 restent des accès directs, sans masquer d'autre contenu.
   La navigation latérale et le gabarit des chapitres restent inchangés. */
(() => {
  const choisirObjectif = (navigation, code, defiler = false) => {
    if (!navigation || !/^O[123]$/.test(code)) return false;
    const parent = navigation.parentElement;
    if (!parent) return false;
    const vues = Array.from(parent.children).filter(
      element => element.matches?.('.these-objectif-vue[data-vue-objectif]')
    );
    if (vues.length !== 3) return false;
    const selection = vues.find(vue => vue.dataset.vueObjectif === code);
    if (!selection) return false;
    vues.forEach(vue => {
      vue.hidden = false;
      vue.setAttribute('aria-hidden', 'false');
    });
    navigation.querySelectorAll('a[data-objectif]').forEach(lien => {
      const actif = lien.dataset.objectif === code;
      lien.setAttribute('aria-expanded', 'true');
      if (actif) lien.setAttribute('aria-current', 'step');
      else lien.removeAttribute('aria-current');
    });
    if (defiler) {
      (selection.querySelector('[id="these-methode-' + code.toLowerCase() + '"]') || selection).scrollIntoView({
        block: 'start',
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }
    return true;
  };

  const navigations = () => Array.from(
    document.querySelectorAll('.these-methode-parcours[data-objectifs-isoles="oui"]')
  );

  // Liens O1/O2/O3 : rejoindre l'objectif demandé dans la page complète.
  document.addEventListener('click', evenement => {
    const lien = evenement.target.closest?.(
      '.these-methode-parcours[data-objectifs-isoles="oui"] a[data-objectif]'
    );
    if (lien) {
      evenement.preventDefault();
      choisirObjectif(lien.closest('.these-methode-parcours'), lien.dataset.objectif, true);
      return;
    }

    // Les renvois situés dans « Problématique et objectifs », ainsi que les
    // renvois internes à la SNA, doivent ouvrir la bonne vue AVANT que le
    // gestionnaire général des chapitres déplace le focus vers l'article.
    const renvoi = evenement.target.closest?.('[data-these-vers="methodes"][data-these-objectif]');
    if (renvoi && /^O[123]$/.test(renvoi.dataset.theseObjectif)) {
      navigations().forEach(nav => choisirObjectif(nav, renvoi.dataset.theseObjectif));
      return;
    }

    // Conserver aussi les liens d'ancrage historiques vers O1/O2/O3.
    const ancre = evenement.target.closest?.('a[href^="#these-methode-o"]');
    if (ancre) {
      const correspondance = /^#these-methode-o([123])$/.exec(ancre.getAttribute('href') || '');
      if (correspondance) {
        const code = 'O' + correspondance[1];
        if (navigations().some(nav => choisirObjectif(nav, code))) {
          evenement.preventDefault();
          const cible = document.getElementById('these-methode-o' + correspondance[1]);
          if (cible && !cible.closest('[hidden]')) cible.scrollIntoView({block:'start',behavior:'smooth'});
        }
      }
    }
  }, true);

  // Tous les objectifs sont visibles à l'ouverture, en page publique comme en salle.
  const initialiser = () => navigations().forEach(nav => {
    const actif = nav.querySelector('a[aria-current="step"]')?.dataset.objectif || 'O1';
    choisirObjectif(nav, actif);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiser, {once:true});
  } else {
    initialiser();
  }
})();


/* Acces Projet de these : libelles et geste du guide. */
(() => {
  const actualiser = (zone) => {
    zone.querySelectorAll('a.acces-these').forEach(lien => {
      if (lien.getAttribute('aria-label') === 'Ma thèse') lien.setAttribute('aria-label', 'Projet de thèse');
      lien.querySelectorAll('span').forEach(texte => {
        if (texte.textContent.trim() === 'Ma thèse') texte.textContent = 'Projet de thèse';
      });
    });
    zone.querySelectorAll('[data-hall-sous="recherche"],[data-sous="recherche"]').forEach(element => {
      if (element.textContent.trim() === 'Ma thèse') element.textContent = 'Projet de thèse';
    });
    zone.querySelectorAll('section[data-salle="recherche"]').forEach(section => {
      if (section.dataset.titre === 'Ma thèse') section.dataset.titre = 'Projet de thèse';
      section.querySelectorAll('.bandeau[aria-label="Ma thèse"]').forEach(b => b.setAttribute('aria-label', 'Projet de thèse'));
      section.querySelectorAll('.bandeau-titre').forEach(t => {
        if (t.textContent.trim() === 'Ma thèse') t.textContent = 'Projet de thèse';
      });
      section.querySelectorAll('[aria-label="Explorer Ma thèse"]').forEach(t => t.setAttribute('aria-label', 'Explorer Projet de thèse'));
    });
    zone.querySelectorAll('.publication-these-note').forEach(note => {
      const premier = note.firstChild;
      if (premier && premier.nodeType === 3 && premier.textContent.includes('« Ma thèse »')) {
        premier.textContent = premier.textContent.replace('« Ma thèse »', '« Projet de thèse »');
      }
      note.querySelectorAll('a[href="#recherche"]').forEach(lien => {
        for (const enfant of lien.childNodes) {
          if (enfant.nodeType === 3 && enfant.textContent.includes('Voir ma thèse'))
            enfant.textContent = enfant.textContent.replace('Voir ma thèse', 'Voir le projet de thèse');
        }
      });
    });
  };
  const demarrer = () => {
    const style = document.createElement('style');
    style.id = 'guide-these-bras-animation';
    style.textContent = ''; 
    if (!document.getElementById(style.id)) document.head.appendChild(style);
    actualiser(document);
    const salle = document.getElementById('salle');
    if (salle) {
      const observateur = new MutationObserver(() => actualiser(salle));
      observateur.observe(salle, {childList:true,subtree:true});
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer, {once:true});
  else demarrer();
})();
