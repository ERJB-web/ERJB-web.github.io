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
  const reveler = () => document.dispatchEvent(new Event('eb:navigation-prete'));
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
    const [destination,chapitre,section]=location.hash.slice(1).split('/');
    const repere=section || chapitre;
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
    const segments=location.hash.slice(1).split('/');
    let repere=segments[2] || segments[1];
    try { repere=decodeURIComponent(repere || ''); } catch {}
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
    if(zone && Array.isArray(etat.details))$$('details:not(.menu)',zone).forEach((d,i)=>{const ouvert=d.closest('.these-objectif-vue[data-vue-objectif]')?false:etat.details[i];if(typeof ouvert==='boolean')d.open=ouvert;});
    let interrompue=false;
    const interrompre=ev=>{if(ev.isTrusted)interrompue=true;};
    const gestes=['pointerdown','touchstart','wheel','keydown'];
    gestes.forEach(n=>document.addEventListener(n,interrompre,{capture:true,passive:true}));
    const nombre=v=>Number.isFinite(v) ? Math.max(0,v) : 0;
    const placer=()=>{
      if(interrompue || reprise!==numeroReprise)return;
      if(zone && Array.isArray(etat.details))$$('details:not(.menu)',zone).forEach((d,i)=>{const ouvert=d.closest('.these-objectif-vue[data-vue-objectif]')?false:etat.details[i];if(typeof ouvert==='boolean')d.open=ouvert;});
      window.scrollTo({top:nombre(etat.page),left:0,behavior:'instant'});
      if(salle && courante)salle.scrollTo({top:nombre(etat.lecture),left:0,behavior:'instant'});
      const cibleAdresse=window.gabaritSalles?.atteindre?.(zone, repere);
      if(etat.ancre){
        const ancre=cibleAdresse || cibleRepere || zone?.querySelector('#'+CSS.escape(etat.ancre)) || document.getElementById(etat.ancre);
        ancre?.scrollIntoView({block:'start',behavior:'instant'});
      }
      if(Array.isArray(etat.tables))etat.tables.forEach((sauve,i)=>{
        const nav=tables[i] && $('.onglets',tables[i]);
        if(nav && Number.isFinite(sauve?.defilement))nav.scrollLeft=sauve.defilement;
      });
    };
    Promise.resolve(window.ebQuandPret?.()).then(()=>requestAnimationFrame(()=>{
      placer();
      requestAnimationFrame(()=>{
        if(reprise!==numeroReprise)return;
        placer();reveler();repriseEnCours=false;memoirePrete=true;memoriserNavigation();
      });
    }));
    if(document.fonts)document.fonts.ready.then(placer);
    addEventListener('load',placer,{once:true});
    Promise.resolve(window.ebQuandPret?.()).then(()=>setTimeout(()=>{
      reveler();
      interrompue=true;
      gestes.forEach(n=>document.removeEventListener(n,interrompre,true));
      removeEventListener('load',placer);
    },1800));
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
  window.ebNavigation = { memoriser: memoriserNavigation, actualiser: demanderMemoire };
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

  // À chaque création de la page Méthodologie, tout volet dépliable commence fermé.
  // Le WeakSet évite de replier un volet que le lecteur vient d'ouvrir.
  const voletsInitialises = new WeakSet();
  const replierVoletsNeufs = (portee = document) => {
    portee.querySelectorAll('.these-objectif-vue[data-vue-objectif] details:not(.menu)').forEach(detail => {
      if (voletsInitialises.has(detail)) return;
      detail.open = false;
      voletsInitialises.add(detail);
    });
  };

  // Tous les objectifs sont visibles à l'ouverture, en page publique comme en salle.
  const initialiser = () => {
    navigations().forEach(nav => {
      const actif = nav.querySelector('a[aria-current="step"]')?.dataset.objectif || 'O1';
      choisirObjectif(nav, actif);
    });
    replierVoletsNeufs();
    const contenuSalle = document.querySelector('#salle .salle-contenu');
    if (contenuSalle) new MutationObserver(() => replierVoletsNeufs(contenuSalle))
      .observe(contenuSalle, { childList: true });
  };
  addEventListener('o3:contenu-pret', () => replierVoletsNeufs());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiser, {once:true});
  } else {
    initialiser();
  }
})();


/* VITRINE_METHODO_20261022 : rend visibles deux planches utiles par objectif.
   Les figures et galeries des annexes originales ne sont ni déplacées ni supprimées. */
(() => {
  const langue = (document.documentElement.lang || "fr").toLowerCase();
  const en = langue.startsWith("en");
  if (!langue.startsWith("fr") && !en) return;

  function preparerVitrine(objectif) {
    if (objectif.dataset.vitrineMethodo20261022 === "oui") return;
    const code = objectif.dataset.objectif;
    if (!/^O[123]$/.test(code || "")) return;
    const annexes = Array.from(objectif.querySelectorAll("details.methodo-doc"));
    const annexe = annexes.find(detail => detail.querySelector("figure img"));
    if (!annexe) return;
    const vues = new Set(
      Array.from(objectif.querySelectorAll("figure img"))
        .filter(img => !img.closest("details.methodo-doc"))
        .map(img => img.getAttribute("src")).filter(Boolean)
    );
    const mots = {
      O1: /prisma|corpus|revue|screen|review|sélection|extraction/i,
      O2: /carte|map|clsc|qgis|spatial|accessibil|territoir/i,
      O3: /réseau|network|graphe|relation|matrice|matrix|sna/i
    };
    const figures = Array.from(annexe.querySelectorAll("figure"))
      .filter(figure => {
        const img = figure.querySelector("img[src]");
        if (!img) return false;
        const src = img.getAttribute("src");
        return src && !vues.has(src);
      });
    if (!figures.length) return;
    const choix = figures.map((figure, index) => ({
      figure, index,
      score: mots[code].test(
        (figure.querySelector("img")?.alt || "") + " " +
        (figure.querySelector("figcaption")?.textContent || "") + " " +
        (figure.querySelector("img")?.getAttribute("src") || "")
      ) ? 1 : 0
    })).sort((a,b) => b.score - a.score || a.index - b.index).slice(0,2);
    if (!choix.length) return;
    const sectionAnalyse = objectif.querySelector("#methode-" + code.toLowerCase() + "-7");
    if (!sectionAnalyse) return;

    const vitrine = document.createElement("section");
    vitrine.className = "methodo-vitrine";
    vitrine.dataset.vitrineMethodo20261022 = "oui";
    vitrine.setAttribute("aria-label", en ? "Visual examples" : "Repères visuels");
    const titre = document.createElement("h5");
    titre.textContent = en ? "Visual references for the method" : "Repères visuels de la méthode";
    const note = document.createElement("p");
    note.textContent = en
      ? "Illustrations from the existing documentation. The complete figures and references remain available in the annexes."
      : "Illustrations issues de la documentation existante. Les figures complètes et leurs références restent accessibles dans les annexes.";
    const grille = document.createElement("div");
    grille.className = "methodo-vitrine-grille";
    choix.forEach(({figure}) => {
      const original = figure.querySelector("img[src]");
      const copie = document.createElement("figure");
      const image = original.cloneNode(false);
      image.removeAttribute("id");
      image.loading = "lazy";
      image.decoding = "async";
      const lienOriginal = original.closest("a[href]");
      if (lienOriginal) {
        const lien = document.createElement("a");
        lien.href = lienOriginal.getAttribute("href");
        if (lienOriginal.hasAttribute("target")) lien.target = lienOriginal.target;
        if (lienOriginal.hasAttribute("rel")) lien.rel = lienOriginal.rel;
        lien.appendChild(image);
        copie.appendChild(lien);
      } else copie.appendChild(image);
      const caption = figure.querySelector("figcaption");
      if (caption) {
        const legende = document.createElement("figcaption");
        legende.textContent = caption.textContent.trim();
        copie.appendChild(legende);
      }
      grille.appendChild(copie);
    });
    vitrine.append(titre,note,grille);
    sectionAnalyse.appendChild(vitrine);
    objectif.dataset.vitrineMethodo20261022 = "oui";
  }
  let programme = false;
  const actualiser = () => {
    if (programme) return;
    programme = true;
    requestAnimationFrame(() => {
      programme = false;
      document.querySelectorAll(".these-methode-objectif[data-cadrage-harmonise][data-objectif]")
        .forEach(preparerVitrine);
    });
  };
  const initialiser = () => {
    actualiser();
    const espace = document.querySelector("#salle .salle-contenu") || document.querySelector("#salle");
    if (espace) new MutationObserver(actualiser).observe(espace, {childList:true,subtree:true});
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded",initialiser,{once:true});
  else initialiser();
})();


/* o1-biblio-refonte-20261022 — repères documentaires horizontaux, sans pictogrammes. */
(() => {
  "use strict";
  const styleId="o1-biblio-visuel-styles";
  function installerStyles() {
    if(document.getElementById(styleId))return;
    const s=document.createElement("style");
    s.id=styleId;
    s.textContent=[
      '#methode-o1-5 .o1b-visuel{box-sizing:border-box;width:100%;min-width:0;margin:16px 0 22px;padding:clamp(18px,2.4vw,28px);border:1px solid #dbe5e4;border-radius:17px;background:#fff;box-shadow:0 10px 28px -26px rgba(31,72,68,.3);color:#304b56;text-align:left!important}',
      '#methode-o1-5 .o1b-visuel *{box-sizing:border-box;min-width:0;max-width:100%;hyphens:none!important;word-break:normal!important;word-spacing:normal!important;text-align:left!important;text-align-last:left!important}',
      '#methode-o1-5 .o1b-header{display:flex;justify-content:space-between;align-items:center;gap:14px;margin:0 0 21px;padding:0 0 16px;border-bottom:1px solid #e5ecec}',
      '#methode-o1-5 .o1b-kicker{display:block;margin:0 0 5px;color:#367657;font-size:12px!important;line-height:1.5!important;letter-spacing:.06em;font-weight:750;text-transform:uppercase}',
      '#methode-o1-5 .o1b-visuel h6{margin:0!important;padding:0!important;color:#234b56!important;font-size:clamp(20px,2.1vw,26px)!important;line-height:1.23!important;font-weight:750!important;letter-spacing:-.015em}',
      '#methode-o1-5 .o1b-total{display:flex;align-items:baseline;flex:0 0 auto;gap:8px;padding:9px 15px;border-radius:12px;background:#e8f4ed;border:1px solid #cfe3d7;color:#286447;white-space:nowrap}',
      '#methode-o1-5 .o1b-total strong{font-size:clamp(29px,3.1vw,38px)!important;font-weight:850!important;line-height:1!important;letter-spacing:-.04em}',
      '#methode-o1-5 .o1b-total span{font-size:14px!important;line-height:1.35!important;font-weight:650}',
      '#methode-o1-5 .o1b-label{display:block;margin:0 0 10px!important;color:#4c6671;font-size:13px!important;line-height:1.4!important;font-weight:750;text-transform:none;letter-spacing:0}',
      '#methode-o1-5 .o1b-bases{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:0!important;margin:0 0 17px!important;list-style:none!important}',
      '#methode-o1-5 .o1b-bases li{display:flex;flex-direction:column;justify-content:center;gap:3px;min-height:75px;padding:13px 14px;border:1px solid #dbe6e7;border-top:4px solid var(--base-accent);border-radius:10px;background:var(--base-fond);list-style:none!important}',
      '#methode-o1-5 .o1b-bases li:nth-child(1){--base-accent:#287358;--base-fond:#f2f9f5}',
      '#methode-o1-5 .o1b-bases li:nth-child(2){--base-accent:#217c8d;--base-fond:#f1f8fb}',
      '#methode-o1-5 .o1b-bases li:nth-child(3){--base-accent:#8260a1;--base-fond:#f7f3fa}',
      '#methode-o1-5 .o1b-bases li:nth-child(4){--base-accent:#a27238;--base-fond:#faf7f0}',
      '#methode-o1-5 .o1b-bases strong{display:block;color:#274955;font-size:clamp(14px,1.3vw,17px)!important;line-height:1.3!important;font-weight:750!important;overflow-wrap:normal!important}',
      '#methode-o1-5 .o1b-bases small{display:block;color:#5e7781;font-size:13px!important;line-height:1.3!important;font-weight:550}',
      '#methode-o1-5 .o1b-chiffres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 17px}',
      '#methode-o1-5 .o1b-indic{display:flex;flex-direction:column;justify-content:center;gap:8px;min-height:112px;padding:14px 17px;border:1px solid #dfe7e7;border-radius:11px;background:var(--fond-indic);border-left:4px solid var(--accent-indic)}',
      '#methode-o1-5 .o1b-indic:nth-child(1){--accent-indic:#287358;--fond-indic:#eff7f2}',
      '#methode-o1-5 .o1b-indic:nth-child(2){--accent-indic:#217c8d;--fond-indic:#f0f8fa}',
      '#methode-o1-5 .o1b-indic:nth-child(3){--accent-indic:#a27238;--fond-indic:#faf6ee}',
      '#methode-o1-5 .o1b-indic strong{display:block;margin:0!important;color:var(--accent-indic);font-size:clamp(30px,3vw,42px)!important;line-height:1!important;font-weight:850!important;letter-spacing:-.035em;font-variant-numeric:tabular-nums}',
      '#methode-o1-5 .o1b-indic span{display:block;color:#344e5b;font-size:clamp(13px,1.2vw,16px)!important;line-height:1.4!important;font-weight:600}',
      '#methode-o1-5 .o1b-notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;padding:0;border:0;background:transparent}',
      '#methode-o1-5 .o1b-notes p{margin:0!important;padding:14px 16px;border-radius:10px;border:1px solid #e1e8e9;background:#f6f9f9;color:#405d68;font-size:clamp(14px,1.17vw,16px)!important;line-height:1.55!important;font-weight:450}',
      '#methode-o1-5 .o1b-notes p+p{border-top:1px solid #e1e8e9;padding-top:14px}',
      '#methode-o1-5 .o1b-notes strong{color:#2e6958;font-weight:750!important}',
      '@media(max-width:820px){#methode-o1-5 .o1b-bases{grid-template-columns:repeat(2,minmax(0,1fr))}#methode-o1-5 .o1b-notes{grid-template-columns:1fr}}',
      '@media(max-width:540px){#methode-o1-5 .o1b-visuel{padding:15px}#methode-o1-5 .o1b-header{align-items:flex-start;flex-wrap:wrap}#methode-o1-5 .o1b-chiffres{grid-template-columns:1fr}#methode-o1-5 .o1b-indic{min-height:0;flex-direction:row;align-items:center;justify-content:flex-start}#methode-o1-5 .o1b-indic strong{min-width:55px}#methode-o1-5 .o1b-bases strong{font-size:14px!important}}',
      '@media(forced-colors:active){#methode-o1-5 .o1b-visuel,#methode-o1-5 .o1b-bases li,#methode-o1-5 .o1b-indic,#methode-o1-5 .o1b-notes p{background:Canvas;color:CanvasText;border-color:CanvasText}}'
    ].join("\n");
    document.head.appendChild(s);
  }
  function composer(){
    const section=document.querySelector("#these-methode-o1 #methode-o1-5")||document.getElementById("methode-o1-5");
    if(!section)return;
    installerStyles();
    if(section.querySelector(".o1b-visuel"))return;
    // Rechercher le plus petit conteneur contenant les chiffres et notes :
    // le libellé source peut être découpé entre plusieurs éléments HTML.
    const noeuds=Array.from(section.querySelectorAll("div,aside,section,blockquote,p,li"));
    const candidats=noeuds.filter(el=>{
      const t=(el.textContent||"").replace(/\s+/g," ").trim();
      return t.length>=170&&t.length<=2300&&
        t.includes("interrogations bibliographiques")&&
        t.includes("lignes de recherche")&&
        t.includes("blocs thématiques")&&
        t.includes("articles de référence pour le test")&&
        t.includes("Covidence");
    }).sort((a,b)=>a.textContent.length-b.textContent.length);
    const ancien=candidats[0];
    if(!ancien)return;
    const vue=document.createElement("section");
    vue.className="o1b-visuel";
    vue.setAttribute("aria-label","Stratégie bibliographique et repères du premier essai O1");
    vue.innerHTML=[
      '<div class="o1b-header"><div><span class="o1b-kicker">O1 · Revue de portée</span><h6>Stratégie bibliographique</h6></div><div class="o1b-total"><strong>4</strong><span>interrogations</span></div></div>',
      '<p class="o1b-label">Sources interrogées lors du premier essai</p>',
      '<ul class="o1b-bases"><li><strong>MEDLINE</strong><small>Ovid</small></li><li><strong>Embase</strong><small>Ovid</small></li><li><strong>APA PsycInfo</strong><small>Ovid</small></li><li><strong>PubMed</strong><small>Ovid</small></li></ul>',
      '<div class="o1b-chiffres" aria-label="Indicateurs du premier essai">',
      '<div class="o1b-indic"><strong>42</strong><span>Lignes de recherche</span></div>',
      '<div class="o1b-indic"><strong>7</strong><span>Blocs thématiques</span></div>',
      '<div class="o1b-indic"><strong>6</strong><span>Articles de référence pour le test</span></div></div>',
      '<div class="o1b-notes"><p><strong>Traçabilité.</strong> MEDLINE et PubMed se recoupent : leurs stratégies et le dédoublonnage devront être documentés.</p>',
      '<p><strong>Étape suivante.</strong> La stratégie a été testée ; les critères restent à affiner. La sélection de toutes les études admissibles sera réalisée par deux évaluateurs indépendants dans Covidence, sans tirage probabiliste.</p></div>'
    ].join("");
    ancien.replaceWith(vue);
  }
  let programme=false;
  function programmer(){
    if(programme)return;
    programme=true;
    requestAnimationFrame(()=>{programme=false;composer()});
  }
  function initialiser(){
    installerStyles();
    programmer();
    const racine=document.getElementById("salle")||document.body;
    new MutationObserver(programmer).observe(racine,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialiser,{once:true});
  else initialiser();
})();


/* Refonte du tableau des étapes O1 en schéma de cartes – 2026-10-22 */
(() => {
  "use strict";
  const css = [
    '.o1-revue-parcours{box-sizing:border-box;width:100%;max-width:100%;min-width:0;margin:24px 0 28px;container-type:inline-size;container-name:o1parcours;text-align:left!important;color:#263f49}',
    '.o1-revue-parcours *{box-sizing:border-box}',
    '.o1-revue-grille{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;align-items:stretch;padding:0;margin:0;list-style:none}',
    '.o1-revue-carte{--etape:#2d7948;--fond:#eaf5ed;position:relative;display:flex;flex-direction:column;gap:14px;min-width:0;padding:22px;border:1px solid #d5e4dc;border-radius:17px;background:white;box-shadow:0 5px 20px rgba(19,62,49,.06);overflow:hidden;text-align:left!important;hyphens:none!important;word-break:normal!important}',
    '.o1-revue-carte:before{content:"";position:absolute;top:0;left:0;right:0;height:5px;background:var(--etape)}',
    '.o1-revue-carte:nth-child(2){--etape:#117c86;--fond:#e7f6f5}',
    '.o1-revue-carte:nth-child(3){--etape:#345f9b;--fond:#ebf2fc}',
    '.o1-revue-carte:nth-child(4){--etape:#80549a;--fond:#f5eef9}',
    '.o1-revue-entete{display:flex;align-items:center;gap:13px;margin:0;min-width:0}',
    '.o1-revue-numero{flex:0 0 53px;width:53px;height:53px;display:grid;place-items:center;border-radius:13px;background:var(--etape);color:white;font-size:22px;font-weight:850;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em}',
    '.these .o1-revue-titre,.o1-revue-titre{margin:0!important;padding:0!important;border:0!important;min-width:0;color:var(--etape)!important;font-size:20px!important;font-weight:800!important;line-height:1.26!important;letter-spacing:-.02em;text-align:left!important;overflow-wrap:break-word;text-wrap:pretty}',
    '.o1-revue-action{min-width:0}',
    '.o1-revue-label{display:block;margin:0 0 6px;color:#567080;font-size:11px;font-weight:850;line-height:1.3;text-transform:uppercase;letter-spacing:.1em}',
    '.these .o1-revue-texte,.o1-revue-texte{margin:0!important;font-size:16px!important;line-height:1.56!important;color:#2d4753!important;text-align:left!important;text-wrap:pretty;hyphens:none!important;overflow-wrap:break-word!important;word-spacing:normal!important}',
    '.o1-revue-production{min-width:0;margin-top:auto;padding:13px 15px;border:1px solid #d2e4dc;border-left:4px solid var(--etape);border-radius:9px;background:var(--fond)}',
    '.o1-revue-production .o1-revue-label{color:var(--etape)}',
    '.o1-revue-production .o1-revue-texte{color:#22424d!important;font-weight:630}',
    '@container o1parcours (min-width:800px){.o1-revue-grille{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@container o1parcours (max-width:480px){.o1-revue-carte{padding:18px 16px;gap:13px;border-radius:13px}.o1-revue-numero{width:45px;height:45px;flex-basis:45px;font-size:19px}.o1-revue-titre{font-size:18px!important}.o1-revue-texte{font-size:15px!important}}',
    '@media(prefers-reduced-motion:no-preference){.o1-revue-carte{transition:box-shadow .18s ease,transform .18s ease}.o1-revue-carte:hover{transform:translateY(-2px);box-shadow:0 9px 26px rgba(24,55,48,.1)}}',
    '@media(forced-colors:active){.o1-revue-carte,.o1-revue-production{border:1px solid CanvasText}.o1-revue-numero{background:Highlight;color:HighlightText}}'
  ].join("\n");
  const normaliser = s => (s || "").replace(/[’‘]/g,"'").replace(/\s+/g," ").trim().toLocaleLowerCase("fr");
  function convertir(table) {
    if (table.closest(".o1-revue-parcours")) return;
    const lignes = Array.from(table.rows);
    if (lignes.length !== 5) return;
    const labels = Array.from(lignes[0].cells, c => normaliser(c.textContent));
    if (labels.length !== 3 || labels[0] !== "étape" ||
        labels[1] !== "ce qu'on fait" || labels[2] !== "ce que ça produit") return;
    const etapes = lignes.slice(1).map((ligne,i) => {
      if (ligne.cells.length !== 3) return null;
      const identite = ligne.cells[0].textContent.trim().match(/^(\d{2})\s*(.+)$/s);
      if (!identite || +identite[1] !== i + 1) return null;
      return {num:identite[1],titre:identite[2].trim(),action:ligne.cells[1],production:ligne.cells[2]};
    });
    if (etapes.some(x=>!x)) return;
    if (!document.getElementById("style-o1-revue-parcours")) {
      const st=document.createElement("style");
      st.id="style-o1-revue-parcours";
      st.textContent=css;
      document.head.appendChild(st);
    }
    const bloc=document.createElement("div");
    bloc.className="o1-revue-parcours";
    bloc.setAttribute("aria-label","Étapes de la revue de portée");
    const grille=document.createElement("div");
    grille.className="o1-revue-grille";
    grille.setAttribute("role","list");
    etapes.forEach(etape => {
      const carte=document.createElement("article");
      carte.className="o1-revue-carte";
      carte.setAttribute("role","listitem");
      const entete=document.createElement("div");
      entete.className="o1-revue-entete";
      const numero=document.createElement("span");
      numero.className="o1-revue-numero";
      numero.textContent=etape.num;
      const titre=document.createElement("h6");
      titre.className="o1-revue-titre";
      titre.textContent=etape.titre;
      entete.append(numero,titre);
      const action=document.createElement("div");
      action.className="o1-revue-action";
      const l1=document.createElement("span");
      l1.className="o1-revue-label";
      l1.textContent="Travail prévu";
      const p1=document.createElement("p");
      p1.className="o1-revue-texte";
      p1.innerHTML=etape.action.innerHTML;
      action.append(l1,p1);
      const sortie=document.createElement("div");
      sortie.className="o1-revue-production";
      const l2=document.createElement("span");
      l2.className="o1-revue-label";
      l2.textContent="Production attendue";
      const p2=document.createElement("p");
      p2.className="o1-revue-texte";
      p2.innerHTML=etape.production.innerHTML;
      sortie.append(l2,p2);
      carte.append(entete,action,sortie);
      grille.appendChild(carte);
    });
    bloc.appendChild(grille);
    table.replaceWith(bloc);
  }
  let planifie=false;
  const verifier=()=>{
    if(planifie) return;
    planifie=true;
    requestAnimationFrame(()=>{
      planifie=false;
      document.querySelectorAll(".these table").forEach(convertir);
    });
  };
  const demarrer=()=>{
    verifier();
    const racine=document.querySelector("#salle") || document.body;
    if (racine) new MutationObserver(verifier).observe(racine,{childList:true,subtree:true});
  };
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",demarrer,{once:true});
  else demarrer();
})();

/* O1_PILOTE_20261022 : regrouper au début d'O1 Ovid, Covidence et critères
 * du PREMIER essai exploratoire ; les six rubriques restent le protocole prévu. */
(() => {
 "use strict";
 if (!(document.documentElement.lang||"fr").startsWith("fr")) return;
 const txt=e=>(e?.textContent||"").replace(/[\u00a0\u202f]/g," ").replace(/\s+/g," ").trim();
 const head=(root,term)=>Array.from(root.querySelectorAll("h3,h4,h5,h6,strong"))
   .find(e=>txt(e).toLowerCase()===term.toLowerCase());
 const block=(root,terms,max)=>Array.from(root.querySelectorAll("div,section,article,details"))
   .filter(e=>txt(e).length>200&&txt(e).length<max&&terms.every(t=>txt(e).includes(t)))
   .sort((a,b)=>txt(a).length-txt(b).length)[0];
 function injectStyle(){
  if(document.getElementById("o1-pilote-style"))return;
  const st=document.createElement("style");st.id="o1-pilote-style";
  st.textContent=[
   "#these-methode-o1 .o1-pilote{box-sizing:border-box;margin:15px 0 30px;padding:9px 0 24px;border:0;border-bottom:2px solid #b9d7c5;max-width:100%;min-width:0;background:transparent;container:o1pilot / inline-size;text-align:left}",
   "#these-methode-o1 .o1-pilote *{box-sizing:border-box}",
   "#these-methode-o1 .o1-pilote-label{font:800 12px/1.45 var(--sans,Arial,sans-serif);letter-spacing:.05em;text-transform:uppercase;color:#297046}",
   "#these-methode-o1 .o1-pilote h5.o1-pilote-titre{font:820 clamp(23px,2.6vw,32px)/1.25 var(--sans,Arial,sans-serif)!important;letter-spacing:-.02em;color:#1e5a3c!important;margin:7px 0 11px!important}",
   "#these-methode-o1 .o1-pilote-intro{font:500 16px/1.66 var(--sans,Arial,sans-serif)!important;color:#3a5662!important;margin:0 0 19px!important;max-width:87ch;text-align:left!important}",
   "#these-methode-o1 .o1-pilote .o1b-visuel{margin:8px 0 23px!important}",
   "#these-methode-o1 .o1-pilote-chiffres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 12px}",
   "#these-methode-o1 .o1-pilote-chiffres>div{min-width:0;padding:17px;border:1px solid #dce7e3;border-top:4px solid var(--pilote);border-radius:11px;background:var(--fond)}",
   "#these-methode-o1 .o1-pilote-chiffres>div:nth-child(1){--pilote:#257440;--fond:#f1f8f2}",
   "#these-methode-o1 .o1-pilote-chiffres>div:nth-child(2){--pilote:#197b92;--fond:#f1f8fb}",
   "#these-methode-o1 .o1-pilote-chiffres>div:nth-child(3){--pilote:#7a5c9a;--fond:#f7f4fb}",
   "#these-methode-o1 .o1-pilote-chiffres strong{display:block;color:var(--pilote);font:850 clamp(26px,3.3vw,42px)/1.07 var(--sans,Arial,sans-serif);white-space:nowrap;letter-spacing:-.03em}",
   "#these-methode-o1 .o1-pilote-chiffres span{display:block;margin:8px 0 0;color:#345260;font:600 14px/1.5 var(--sans,Arial,sans-serif)}",
   "#these-methode-o1 .o1-pilote-legende{font-size:13px!important;line-height:1.5!important;color:#56707a!important;margin:0 0 13px!important}",
   "#these-methode-o1 figure.o1-pilote-covidence{margin:12px 0 26px!important;width:100%;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}",
   "#these-methode-o1 .o1-pilote-covidence a{display:block;width:100%}",
   "#these-methode-o1 .o1-pilote-covidence img{display:block;width:100%!important;max-width:100%!important;height:auto!important;max-height:none!important;object-fit:contain;border:1px solid #d9e4e6;border-radius:8px}",
   "#these-methode-o1 .o1-pilote-covidence figcaption{font-size:13px!important;line-height:1.5!important;color:#546d77;margin:7px 0 0!important}",
   "#these-methode-o1 .o1-pilote-criteres{margin:17px 0 20px;min-width:0}",
   "#these-methode-o1 .o1-pilote-criteres>h6{font-size:clamp(20px,2vw,25px)!important;color:#296744!important;margin:0 0 14px!important}",
   "#these-methode-o1 .o1-pilote-criteres .o1-pilote-ancien{padding:0!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}",
   "#these-methode-o1 .o1-pilote-fin{border-top:1px solid #cbded3;padding:13px 0 0;margin:18px 0 0!important;color:#3b5a63!important;font-size:14px!important;line-height:1.6!important}",
   "#these-methode-o1 .o1-pilote-fin strong{color:#206342}",
   "#these-methode-o1 .o1-pilote [data-o1-slot]:empty{display:none}",
   "#these-methode-o1 .o1-revision2026{margin-top:20px!important}",
   "@container o1pilot (max-width:640px){#these-methode-o1 .o1-pilote-chiffres{grid-template-columns:1fr}#these-methode-o1 .o1-pilote-chiffres strong{font-size:32px}}"
  ].join("\n");
  document.head.appendChild(st);
 }
 function rangerCollecte(root){
  const sec=root.querySelector("#methode-o1-6");if(!sec)return;
  const row=Array.from(sec.querySelectorAll("div,section,ul"))
   .filter(e=>txt(e).length<650&&["52 021","25 412","26 609"].every(t=>txt(e).includes(t))
         &&!txt(e).includes("Matériaux")&&!txt(e).includes("Procédure"))
   .sort((a,b)=>txt(a).length-txt(b).length)[0];
  if(row)row.remove();
  Array.from(sec.querySelectorAll("p")).filter(p=>txt(p).includes("État de l’import Covidence")
     &&txt(p).length<350).forEach(p=>p.remove());
  const status=Array.from(sec.querySelectorAll("p")).find(p=>txt(p).includes("État d’avancement : codebook et essai pilote réalisés"));
  if(status)status.textContent="Protocole prévu : révision bibliothécaire, validation de la grille et des critères, sélection indépendante, puis extraction en double.";
  const capture=sec.querySelector('img[src*="capture_covidence"]');
  if(capture){
   const wrapper=block(sec,["L’avancement de la sélection documentaire","Capture de Covidence"],2400);
   if(wrapper&&wrapper!==sec)wrapper.remove();
   else {
    (capture.closest("figure")||capture.closest("a")||capture).remove();
    const h=head(sec,"L’avancement de la sélection documentaire");if(h)h.remove();
    Array.from(sec.querySelectorAll("p")).filter(p=>/Capture du logiciel de revue|Capture de Covidence \(octobre 2026\)/.test(txt(p))
      &&txt(p).length<400).forEach(p=>p.remove());
   }
  }
 }
 function mount(){
  const root=document.querySelector("#these-methode-o1");if(!root)return;
  const first=root.querySelector("#methode-o1-4")||root.querySelector(".methode-rubrique");if(!first)return;
  injectStyle();
  let intro=root.querySelector(".o1-pilote");
  if(!intro){
   intro=document.createElement("section");intro.className="o1-pilote";intro.id="o1-essai-exploratoire";
   intro.setAttribute("aria-label","Premier essai exploratoire de faisabilité O1");
   intro.innerHTML=[
    "<span class='o1-pilote-label'>O1 · Essai préalable, non définitif</span>",
    "<h5 class='o1-pilote-titre'>Premier essai exploratoire de faisabilité</h5>",
    "<p class='o1-pilote-intro'>Une première stratégie menée avec <strong>Ovid, PubMed et Covidence</strong> a permis de tester les équations, le dédoublonnage et les critères provisoires. Le volume et l’hétérogénéité du corpus ont mis en évidence la nécessité d’un <strong>resserrement méthodologique avant la sélection définitive</strong>. Cet essai n’est pas l’état d’avancement de la revue de portée doctorale.</p>",
    "<div data-o1-slot='ovid'></div>",
    "<div class='o1-pilote-chiffres' aria-label='Décomptes provisoires du seul essai exploratoire'><div><strong>52 021</strong><span>Références importées dans le test Covidence</span></div><div><strong>25 412</strong><span>Doublons retirés lors du test</span></div><div><strong>26 609</strong><span>Notices restantes avant le tri</span></div></div>",
    "<p class='o1-pilote-legende'>Premier essai, octobre 2026. Aucun de ces chiffres ne représente un corpus définitif ou des études incluses.</p>",
    "<figure class='o1-pilote-covidence'><a href='https://erjb-web.github.io/assets/these/captures/capture_covidence.webp' target='_blank' rel='noopener noreferrer'><img src='https://erjb-web.github.io/assets/these/captures/capture_covidence.webp' alt='Capture de Covidence du premier essai exploratoire de la revue O1 : 52 021 références, 25 412 doublons et 26 609 notices à évaluer.' loading='lazy'></a><figcaption>Covidence, octobre 2026 · Capture du premier essai, distincte de la revue définitive.</figcaption></figure>",
    "<div class='o1-pilote-criteres'><h6>Critères d’inclusion et d’exclusion utilisés dans l’essai</h6><div data-o1-slot='criteres'></div></div>",
    "<div data-o1-slot='ajustements'></div>",
    "<p class='o1-pilote-fin'><strong>Pour la revue prévue :</strong> réviser les critères et les équations avec une bibliothécaire, tester leur concordance, puis lancer la sélection sur un protocole validé. Les six rubriques suivantes décrivent les méthodes projetées.</p>"
   ].join("");
   first.before(intro);
  }
  const ovid=root.querySelector("#methode-o1-5 .o1b-visuel");
  const os=intro.querySelector("[data-o1-slot='ovid']");
  if(ovid&&os&&!os.contains(ovid)){
   os.appendChild(ovid);
   const k=ovid.querySelector(".o1b-kicker");if(k)k.textContent="Stratégie du premier essai · Ovid / PubMed";
   const p=ovid.querySelectorAll(".o1b-notes p");
   if(p[1])p[1].innerHTML="<strong>À réviser :</strong> équations de recherche, chevauchements et critères avant le tri définitif. Aucun double tri systématique n’est achevé.";
  }
  const cs=intro.querySelector("[data-o1-slot='criteres']");
  if(cs&&!cs.firstElementChild){
   const exemples=document.querySelector("#methode-o1-exemples");
   const criteria=exemples?.querySelector(".o1-protocole.o1-compact") || block(root,["Grille provisoire issue de l’essai Covidence","Critères d’inclusion et d’exclusion proposés","Documents et limites"],16000);
   if(criteria&&!intro.contains(criteria)&&!criteria.matches(".these-methode-objectif,.methode-rubrique,.methode-objectif-separe")){
     criteria.classList.add("o1-pilote-ancien");cs.appendChild(criteria);
     const h=head(criteria,"Critères d’inclusion et d’exclusion proposés");if(h)h.textContent="Grille utilisée pour le premier essai";
   }
  }
  const as=intro.querySelector("[data-o1-slot='ajustements']");
  if(as&&!as.firstElementChild){
   const revision=root.querySelector(".o1-revision2026")||document.querySelector("#methode-o1-exemples .o1-revision2026")||root.querySelector(".o1-resserrement");
   if(revision&&!intro.contains(revision))as.appendChild(revision);
  }
  /* La capture et les critères sont des matériaux du pilote, pas une
     seconde galerie isolée à la fin des méthodes. On DÉPLACE les éléments
     d'origine ; on ne duplique ni contenu ni figure. */
  const exemples=document.querySelector("#methode-o1-exemples");
  if(exemples){
   const capture=exemples.querySelector(".a-caps figure.a-cap");
   const destination=intro.querySelector("figure.o1-pilote-covidence");
   if(capture&&destination){
    capture.classList.add("o1-pilote-covidence");
    destination.replaceWith(capture);
   }
   const attribution=exemples.querySelector("p.a-src");
   const fin=intro.querySelector(".o1-pilote-fin");
   if(attribution&&fin)fin.before(attribution);
   if(!exemples.querySelector(".o1-protocole,.o1-revision2026,figure.a-cap") && txt(exemples).length<340){
    exemples.remove();
   }
  }
  rangerCollecte(root);
 }
 let scheduled=false;
 function run(){
  if(scheduled)return;scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;mount()});
 }
 const boot=()=>{
  run();
  const host=document.querySelector("#salle .salle-contenu")||document.querySelector("#salle")||document.body;
  new MutationObserver(run).observe(host,{childList:true,subtree:true});
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
