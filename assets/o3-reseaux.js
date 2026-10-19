"use strict";
(function o3Atlas() {
  "use strict";
  // Une instance par élément DOM réel. Les clones de la navigation
  // ne reprennent pas les gestionnaires d'événements du module initial.
  const modulesInitialises = new WeakSet();
  function initialiser(zone) {
    if (!/^fr(?:-|$)/i.test(document.documentElement.lang || "")) return;
    if (!zone) return;
    const cibleO3 = zone.querySelector("#these-methode-o3");
    if (!cibleO3) return;
    const espaceExistant = zone.querySelector("#methode-o3-exemples");
    const ancienModule = espaceExistant?.querySelector("[data-o3-atlas]") ||
      cibleO3.querySelector("[data-o3-atlas]");
    if (ancienModule && modulesInitialises.has(ancienModule)) return;
    // Une galerie clonée doit être recréée pour restituer ses contrôles.
    if (ancienModule) ancienModule.remove();
    const point = zone.querySelector(".these-objectifs");
    const racine = document.documentElement.dataset.racine || "./";
    if (!document.querySelector("link[data-o3-style]")) {
      const feuille = document.createElement("link");
      feuille.rel = "stylesheet";
      feuille.href = racine + "assets/o3-reseaux.css?v=20261018-o3-legendes-3a993";
      feuille.dataset.o3Style = "1";
      document.head.appendChild(feuille);
    }
    function qualitatifSVG() {
      const points = [
        { x: 290, y: 92, txt: "A1", type: "#307c8b" },
        { x: 516, y: 160, txt: "A2", type: "#2c836c" },
        { x: 550, y: 365, txt: "A3", type: "#2c836c" },
        { x: 321, y: 441, txt: "A4", type: "#af7943" },
        { x: 106, y: 325, txt: "A5", type: "#af7943" },
        { x: 113, y: 125, txt: "A6", type: "#307c8b" }
      ];
      const lien = points.map((p, i) => '<path d="M315 265 L' + p.x + " " + p.y + '" fill="none" stroke="' + p.type + '" stroke-width="' + (i % 2 ? 4 : 2) + '" stroke-dasharray="' + (i > 3 ? "8 7" : "none") + '"/>').join("");
      const acteurs = points.map(p => '<circle cx="' + p.x + '" cy="' + p.y + '" r="26" fill="#fff" stroke="' + p.type + '" stroke-width="3"/><text x="' + p.x + '" y="' + (p.y + 5) + '" text-anchor="middle" font-size="16" fill="#173f3b" font-weight="700">' + p.txt + '</text>').join("");
      return '<svg viewBox="0 0 660 540" role="img" aria-label="Exemple de carte d’entretien qualitatif avec ego central, six alters anonymisés, cercles concentriques et liens de styles distincts"><rect x="1" y="1" width="658" height="538" rx="22" fill="#f7faf8" stroke="#d8e5df"/><circle cx="315" cy="265" r="215" fill="none" stroke="#b8cfc7" stroke-width="2"/><circle cx="315" cy="265" r="130" fill="#e9f2ed" stroke="#c9dcd3" stroke-width="2"/>' + lien + acteurs + '<circle cx="315" cy="265" r="63" fill="#20594e" stroke="white" stroke-width="5"/><text x="315" y="259" font-size="20" text-anchor="middle" fill="white" font-weight="750">EGO</text><text x="315" y="281" font-size="16" text-anchor="middle" fill="#d9f5e7">CLSC</text><text x="16" y="518" font-size="15" fill="#6d7f78">A1 à A6 : acteurs codés, placement fictif</text></svg>';
    }

    // Expérimentations et modèles d'application, distincts de l'enquête SAD.
    const descriptifs211=[
      ["Orientations du 211 : ego dirigé et pondéré","01-ego-211.svg","Verdun, 2024–2025. Chaque flèche correspond à une référence du 211 vers un destinataire : aucun lien SAD–partenaire n'est observé."],
      ["Affiliation domaines–organismes","02-biparti.svg","Verdun, tous âges : des besoins référencés vers des destinataires. Il ne s'agit pas de liens de collaboration entre organismes."],
      ["Matrice des destinations par origine","03-matrice.svg","Références des 60 ans et plus en 2024–2025. Les arrondissements sont des contextes géographiques, non des organisations qui collaborent."],
      ["Évolution des destinataires du 211","04-evolution.svg","Trois exercices de références. Une variation de destinataires observés ne prouve pas l'ouverture ou la fermeture d'organismes."]
    ];
    const annees=["2023–2024","2024–2025","2025–2026"];
    const serieR=[{titre:"Évolution temporelle · R",cle:"a1_temporel.svg",
      lecture:"Comparaison calculée des exercices à Verdun ; l'interprétation dépend de la couverture des extractions."}];
    annees.forEach((annee,i)=>{
      const k="a1_y"+(i+1)+"_";
      serieR.push({titre:"SNA égocentrée 211 · "+annee,cle:k+"ego.svg",
        lecture:"Le 211 est l'ego. Les liens représentent les références enregistrées vers les destinataires, pas des partenariats SAD."});
      serieR.push({titre:"SNA bipartie · "+annee,cle:k+"biparti.svg",
        lecture:"Affiliation entre domaines de besoins et organismes référencés, sans mesurer les besoins concomitants d'une personne."});
      [0,10,20].forEach(seuil=>serieR.push({
        titre:"Projection des domaines · "+annee+" · seuil "+(seuil/100).toFixed(2).replace(".",","),
        cle:k+"projection_"+seuil+".svg",
        lecture:"Domaines liés parce qu'ils partagent des destinataires, avec seuil de similarité Jaccard ; ces liens dérivés ne mesurent pas les collaborations intersectorielles."
      }));
    });
    // Galerie : uniquement les figures d'analyse des orientations du 211.
    const donnees=[
      ...descriptifs211.map(([titre,nom,lecture])=>({type:"figure",titre:"211 · "+titre,url:"/simulations/sna-o3/figures/"+nom,lecture})),
      ...serieR.map(x=>({...x,type:"r",titre:"211 / R · "+x.titre}))
    ];
    const nFigures=descriptifs211.length,total=donnees.length;
    const enteteChoix=(debut,fin)=>donnees.slice(debut,fin).map((d,j)=>
      '<option value="'+(debut+j)+'">'+String(debut+j+1).padStart(2,"0")+' · '+echapper(d.titre)+'</option>').join("");
    const options='<optgroup label="211 · quatre figures de synthèse">'+enteteChoix(0,nFigures)+'</optgroup>'+
      '<optgroup label="211 · seize graphiques calculés avec R">'+enteteChoix(nFigures,total)+'</optgroup>';
    const planches=donnees.map((d,i)=>{
      let visuel;
      if(d.type==="figure")visuel='<a class="o3-galerie-visuel" href="'+d.url+'" target="_blank" rel="noopener" aria-label="Voir la figure vectorielle"><img src="'+d.url+'" alt="'+echapper(d.titre)+'" loading="lazy"></a>';
      else visuel='<div class="o3-galerie-visuel o3-galerie-r" data-o3-r-key="'+echapper(d.cle)+'"><p>Graphique R chargé lors de sa sélection.</p></div>';
      return '<figure class="o3-galerie-planche" data-o3-slide="'+i+'"'+(i?' hidden aria-hidden="true"':' aria-hidden="false"')+'>'+visuel+
        '<figcaption><span class="o3-galerie-statut">'+"Exercice SNA sur les références du 211 · non assimilable au protocole de thèse"+
        '</span><h4>'+echapper(d.titre)+'</h4><p>'+echapper(d.lecture)+'</p>'+
        (d.type==="r"?'<section class="o3-r-legende" data-o3-r-legende aria-label="Codes, couleurs et nombres de la figure R"><p>Légende en cours de chargement…</p></section>':'')+'</figcaption></figure>';
    }).join("");
    const module=document.createElement("section");
    module.className="o3-atlas o3-galerie-unifiee";
    module.id="o3-atlas-reseaux";
    module.dataset.o3Atlas="1";
    module.setAttribute("aria-labelledby","o3-atlas-titre");
    const qualitatif =
      '<div class="o3-partie o3-partie-quali"><span>VOLET QUALITATIF DU SNA · O3 (QUAN → qual)</span><h4>De la carte à l’explication des relations</h4><p>Le sociogramme devient un support d’entretien : on explore les raisons des liens, les ressources échangées, les difficultés de coordination, les absences de relation et les points de passage entre organisations.</p></div>' +
      '<div class="o3-quali-grille">' +
        '<article class="o3-quali-panneau"><div class="o3-panneau-entete"><span>01 · ÉLICITATION</span><h5>Sociogramme co-construit</h5><p>Le participant nomme les acteurs, les positionne sur une carte concentrique et décrit ses relations avec eux.</p></div><div class="o3-quali-visuel">' + qualitatifSVG() + '</div><div class="o3-panneau-pied"><span>Proximité ou importance perçue</span><span>Alters anonymisés · exemple de méthode</span></div></article>' +
        '<article class="o3-quali-panneau"><div class="o3-panneau-entete"><span>02 · QUALIFICATION DES LIENS</span><h5>Ce que les traits ne disent pas</h5><p>La présence d’un lien ne renseigne pas à elle seule sur sa nature, sa direction, sa fréquence ou sa fonction.</p></div><div class="o3-qualifications"><div><span class="o3-qual-repere solide"></span><strong>Collaboration opérationnelle</strong><small>Pour quelles tâches, à quelle fréquence ?</small></div><div><span class="o3-qual-repere double"></span><strong>Échanges réciproques</strong><small>Qui transmet quoi et à qui ?</small></div><div><span class="o3-qual-repere pointille"></span><strong>Lien incertain ou occasionnel</strong><small>Quand est-il activé et pourquoi ?</small></div><div><span class="o3-qual-repere manque"></span><strong>Lien absent ou non mobilisé</strong><small>Obstacle, connaissance, mandat, accessibilité ?</small></div></div><p class="o3-qual-note">Ces styles sont une grille de lecture pédagogique à confronter aux définitions du questionnaire, et non des liens observés.</p></article>' +
      '</div>' +
      '<div class="o3-quali-matrice"><div class="o3-matrice-titre"><span>03 · CODAGE ET INTERPRÉTATION</span><h5>Mise en regard des réseaux et des entretiens</h5><p>Exemples de questions analytiques, sans verbatim attribué à un professionnel ni constat présenté comme acquis.</p></div><div class="o3-table-wrap"><table><thead><tr><th>Observation structurale à vérifier</th><th>Question d’entretien</th><th>Thème à coder</th><th>Discussion possible en O3</th></tr></thead><tbody><tr><td>Un partenaire périphérique sur la carte</td><td>Pourquoi est-il peu mobilisé pour ce profil de besoins ?</td><td>Connaissance des ressources · accès</td><td>Quelles conditions faciliteraient sa mobilisation ?</td></tr><tr><td>Un CLSC placé en position de passage</td><td>Qui relie les organisations en son absence ?</td><td>Coordination · dépendance à un acteur</td><td>Comment renforcer la continuité des liens ?</td></tr><tr><td>Un lien attendu mais non déclaré</td><td>Le mandat, le financement ou les pratiques empêchent-ils l’échange ?</td><td>Frontières institutionnelles · confiance</td><td>Quel ajustement intersectoriel envisager ?</td></tr></tbody></table></div></div>' +
      '<div class="o3-transfert"><div><span>04 · INTÉGRATION ET ATELIER</span><h5>Du constat discuté à une recommandation contextualisée</h5></div><ol><li><strong>Carte de réseau</strong><small>Qui est relié à qui ?</small></li><li><strong>Entretien qualitatif</strong><small>Pourquoi, comment, dans quel contexte ?</small></li><li><strong>Mise en regard</strong><small>Convergences, divergences et incertitudes</small></li><li><strong>Délibération O3</strong><small>Options, désaccords et recommandations</small></li></ol></div>' +
      '<div class="o3-methodo-sources"><h5>Repères méthodologiques vérifiables</h5><p><a href="https://doi.org/10.1177/19375867211013772" target="_blank" rel="noopener noreferrer">Burgette et al. (2021) · Principes et métriques des réseaux égocentrés ↗</a><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12315688/" target="_blank" rel="noopener noreferrer">Étude qualitative avec sociogrammes et entretiens (2025) ↗</a><a href="https://doi.org/10.1111/glob.12315" target="_blank" rel="noopener noreferrer">Herz (2021) · Cartes égocentrées et analyse qualitative ↗</a></p></div>';

    module.innerHTML=
      '<header class="o3-galerie-intro"><span class="o3-galerie-surtexte">O3 · ATLAS EXPÉRIMENTAL · DISTINCT DU PROTOCOLE</span>'+
      '<h3 id="o3-atlas-titre">Galerie SNA du 211 · '+total+' figures</h3>'+
      '<p>La galerie suivante rassemble <strong>quatre figures de synthèse</strong> et <strong>seize figures calculées dans R</strong> afin d’illustrer une analyse de réseaux (SNA) fondée sur les fichiers du 211, qui décrivent des orientations vers des organismes, et non les collaborations entre équipes SAD et partenaires. <strong>Il s’agit d’un exercice méthodologique à titre d’exemple : ces données et figures ne sont ni les données collectées ni les résultats de la SNA prévue dans la thèse, laquelle sera égocentrée sur les équipes des CLSC en soutien à domicile.</strong></p>'+
      '<div class="o3-galerie-reperes"><span>4 figures de synthèse</span><span>16 graphiques R</span><span>Exercice exploratoire · 211</span></div></header>'+
      '<div class="o3-galerie-commandes"><label for="o3-galerie-select">Choisir un sociogramme ou un graphique</label>'+
      '<div class="o3-galerie-controles"><select id="o3-galerie-select" data-o3-choix>'+options+'</select>'+
      '<div class="o3-galerie-fleches"><button type="button" data-o3-prev aria-label="Figure précédente" disabled>←</button>'+
      '<output data-o3-compteur aria-live="polite">1 / '+total+'</output>'+
      '<button type="button" data-o3-next aria-label="Figure suivante">→</button></div></div></div>'+
      '<div class="o3-galerie-planches" aria-label="Figure sélectionnée">'+planches+'</div>'+
      '<div class="o3-galerie-pied"><p><strong>Statut des données.</strong> Seules des orientations du 211 sont enregistrées ; les relations entre organismes, les collaborations SAD et la réponse effective aux besoins devront être documentées dans le protocole O3. Les variations de couverture des fichiers peuvent influencer les graphes.</p>'+
      '<a href="/simulations/sna-o3/" target="_blank" rel="noopener">Dossier 211 : figures et sources ↗</a>'+
      '<a href="/simulations/sna-o3/r/" target="_blank" rel="noopener">Calculs R, graphiques et GraphML ↗</a>'+
      '</div>';
    const methodo = document.createElement("section");
    methodo.className = "o3-clsc-methodo";
    methodo.setAttribute("aria-label", "Exemples méthodologiques d’entretiens et de codage qualitatif");
    methodo.innerHTML = '<details class="o3-galerie-qual"><summary>Exemples méthodologiques d’entretiens et de codage qualitatif</summary>'+qualitatif+'</details>';
    const espaceExemples=zone.querySelector("#methode-o3-exemples");
    if (espaceExemples) {
      const precedent=espaceExemples.querySelector(":scope > .o3-clsc-methodo");
      if (precedent) precedent.remove();
      // Les modèles CLSC sont hors de la galerie des données du 211.
      const entete=espaceExemples.querySelector(":scope > header");
      if (entete) entete.after(methodo,module);
      else espaceExemples.prepend(methodo,module);
    } else cibleO3.append(methodo,module);
    modulesInitialises.add(module);
    // Accès immédiat à la galerie depuis le début de l'objectif O3.
    const teteO3 = cibleO3.querySelector(":scope > .methode-objectif-tete");
    if (teteO3 && !teteO3.querySelector("[data-o3-acces-galerie]")) {
      const acces = document.createElement("a");
      acces.dataset.o3AccesGalerie = "1";
      acces.className = "o3-acces-galerie";
      acces.href = "#o3-atlas-reseaux";
      acces.textContent = "Voir la galerie SNA du 211 · 20 figures ↓";
      acces.addEventListener("click", event => {
        event.preventDefault();
        module.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
      teteO3.append(acces);
    }
    const el=Array.from(module.querySelectorAll("[data-o3-slide]"));
    const select=module.querySelector("[data-o3-choix]"),output=module.querySelector("[data-o3-compteur]");
    const prev=module.querySelector("[data-o3-prev]"),next=module.querySelector("[data-o3-next]");
    let current=0,sourceR=null,promesseR=null,promesseAnalyses=null;
    // analyses.json et analyse_sna.R définissent tous les codes, groupes et poids.
    const paletteR=['#176B91','#D67A25','#568447','#9861AB','#C34D68','#3C9190','#A78A28','#647A94','#903F40','#295F48','#774E95','#BD6054','#3759A0','#79773B'];
    const nombreR=x=>Number(x).toLocaleString('fr-CA',{maximumFractionDigits:3});
    function legendeR(fig,resultats) {
      const cle=String(fig.cle||'');
      const couleur=(c,t)=>'<span class="o3-r-repere"><i aria-hidden="true" style="background:'+c+'"></i>'+t+'</span>';
      const codes=liste=>'<ul class="o3-r-codes">'+liste.map(x=>
        '<li><b style="--o3-code:'+x.c+'">'+echapper(x.code)+'</b><span>'+echapper(x.name)+
        (x.note?'<small>'+echapper(x.note)+'</small>':'')+'</span></li>').join('')+'</ul>';
      const afficher=(titre,explication,cles,details)=>
        '<h5>Comment lire la figure · '+titre+'</h5><p>'+explication+'</p>'+
        '<div class="o3-r-reperes">'+cles.join('')+'</div>'+details+
        '<p class="o3-r-limite">Prudence : les fichiers du 211 décrivent des références vers des destinataires, pas des collaborations SAD–organismes, des prestations reçues ou des besoins concomitants individuels.</p>'+
        '<a class="o3-r-source" href="/simulations/sna-o3/r/" target="_blank" rel="noopener noreferrer">Calculs R, mesures et listes complètes ↗</a>';
      if(cle==='a1_temporel.svg'){
        const top=resultats.temporal?.a1?.top;
        if(!Array.isArray(top))throw Error('Codes temporels absents');
        return afficher('suivi temporel',
          'Trois colonnes = trois exercices. Les chiffres près des cercles indiquent le nombre de références de l’année. Le signe — indique qu’aucune référence n’est enregistrée dans cette extraction.',
          [couleur('#176B91','Bleu : destinataire référencé'),couleur('#ffffff','Blanc : absence de référence'),couleur('#8DB4C6','Trait : références dans deux années consécutives')],
          '<p>La taille du cercle dépend du compte ; la largeur du trait est liée au compte minimum des deux exercices. Une absence de référence ne prouve pas une fermeture.</p><h6>Numéros O1–O10 : noms des destinataires</h6>'+
          codes(top.map(x=>({code:x.code,name:x.name,note:'ID '+x.id,c:'#176B91'}))));
      }
      const m=/^a1_y([1-3])_(ego|biparti|projection_(0|10|20))\.svg$/.exec(cle);
      if(!m)throw Error('Figure non reconnue');
      const a=resultats.analyses?.['a1_y'+m[1]];
      if(!a)throw Error('Analyse absente');
      if(m[2]==='ego')return afficher('réseau égocentré',
        '211 est le centre ; les cercles numérotés 1 à 8 sont les huit destinataires les plus référencés. Le nombre placé sur une flèche est le compte des références du 211 vers ce destinataire.',
        [couleur('#173F55','Bleu foncé : ego 211'),couleur('#176B91','Bleu : destinataires'),couleur('#8DB4C6','Flèche : référence dirigée')],
        '<p>La largeur de la flèche croît avec la racine carrée des références. Huit destinataires sont affichés pour la lisibilité, mais les indicateurs portent sur l’ensemble du réseau.</p><h6>Codes 1–8 : destinataires et nombres</h6>'+
        codes(a.ego_top.map(x=>({code:x.code,name:x.name,note:'ID '+x.id+' · '+nombreR(x.in_strength)+' références',c:'#176B91'}))));
      if(m[2]==='biparti')return afficher('réseau à deux modes',
        'Les carrés D1–D14 sont des domaines de besoins ; les cercles O1–O12 représentent les organismes les plus référencés. Une arête relie un domaine à un destinataire lorsqu’une référence l’associe à ce domaine.',
        [couleur('#D67A25','Carrés orange D : domaines'),couleur('#176B91','Cercles bleus O : organismes'),couleur('#568CA4','Trait : références enregistrées')],
        '<p>L’épaisseur des arêtes augmente avec les comptes. Ces résultats concernent tous les âges ; ils ne mesurent pas les liens entre organismes.</p>'+
        '<div class="o3-r-deux-colonnes"><div><h6>Domaines D1 à D14</h6>'+
        codes(a.domains.map(x=>({code:x.code,name:x.name,c:'#D67A25'})))+
        '</div><div><h6>Organismes O1 à O12</h6>'+
        codes(a.biparti_top.map(x=>({code:x.code,name:x.name,note:'ID '+x.id,c:'#176B91'})))+'</div></div>');
      const seuil=Number(m[3])/100,proj=a.projection?.[String(seuil)];
      if(!proj?.nodes)throw Error('Projection absente');
      const groupes=[...new Set(proj.nodes.map(x=>+x.community))].sort((x,y)=>x-y);
      return afficher('projection des domaines · seuil Jaccard '+seuil.toLocaleString('fr-CA',{minimumFractionDigits:2}),
        'D1–D14 représentent les domaines. Deux domaines sont liés s’ils partagent des organismes référencés ; Jaccard (0–1) mesure leur similarité de destinataires.',
        groupes.map(g=>couleur(paletteR[(g-1)%paletteR.length],'Couleur : communauté Louvain '+g)),
        '<p>Ces couleurs représentent des groupes calculés, pas des secteurs de services. La taille des nœuds augmente avec l’intermédiarité ; l’épaisseur des liens avec Jaccard. Les groupes peuvent changer entre exercices et seuils.</p><h6>Codes D1–D14, noms et groupes</h6>'+
        codes(proj.nodes.map(x=>({code:x.code,name:x.name,note:'Groupe '+x.community+' · intermédiarité '+nombreR(x.betweenness),c:paletteR[(+x.community-1)%paletteR.length]}))));
    }
    async function ouvrirGraphique(zone){
      if(!zone||zone.dataset.charge==="oui")return;
      zone.innerHTML="<p>Chargement du graphique calculé avec R…</p>";
      try{
        if(!promesseR)promesseR=fetch("/simulations/sna-o3/r/graphiques-a1.json")
          .then(r=>{if(!r.ok)throw Error("Fichier R inaccessible");return r.json()});
        sourceR=await promesseR;
        if(!zone.isConnected)return;
        const svg=sourceR.figures?.[zone.dataset.o3RKey];
        if(!svg)throw Error("Graphique absent");
        zone.innerHTML=svg.replace(/^<\?xml[^>]*>\s*/i,"");
        zone.dataset.charge="oui";
        const figure=zone.closest("[data-o3-slide]");
        const image=zone.querySelector("svg");
        if(image){image.setAttribute("role","img");image.setAttribute("aria-label",donnees[+figure.dataset.o3Slide].titre)}
        const cleLegende=figure.querySelector("[data-o3-r-legende]");
        if(cleLegende){
          try{
            if(!promesseAnalyses)promesseAnalyses=fetch("/simulations/sna-o3/r/analyses.json")
              .then(r=>{if(!r.ok)throw Error("Analyses R indisponibles");return r.json()});
            const calculs=await promesseAnalyses;
            if(cleLegende.isConnected)cleLegende.innerHTML=legendeR(donnees[+figure.dataset.o3Slide],calculs);
          }catch(erreur){
            if(cleLegende.isConnected)cleLegende.innerHTML='<p>La légende détaillée est indisponible. <a href="/simulations/sna-o3/r/" target="_blank" rel="noopener">Consulter les correspondances des codes dans les calculs R ↗</a></p>';
            promesseAnalyses=null;
          }
        }
      }catch(erreur){
        zone.innerHTML='<p>Le chargement a échoué. <a href="/simulations/sna-o3/r/" target="_blank" rel="noopener">Ouvrir les résultats R ↗</a></p>';
        promesseR=null;
      }
    }
    function afficher(i){
      current=Math.max(0,Math.min(total-1,i));
      el.forEach((p,j)=>{p.hidden=j!==current;p.setAttribute("aria-hidden",String(j!==current))});
      select.value=String(current);output.textContent=(current+1)+" / "+total;
      prev.disabled=current===0;next.disabled=current===total-1;
      ouvrirGraphique(el[current].querySelector("[data-o3-r-key]"));
    }
    select.addEventListener("change",()=>afficher(+select.value));
    prev.addEventListener("click",()=>afficher(current-1));
    next.addEventListener("click",()=>afficher(current+1));
    module.addEventListener("keydown",event=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
      if(event.target.closest("select,input,textarea,a"))return;
      event.preventDefault();
      afficher(event.key==="Home"?0:event.key==="End"?total-1:current+(event.key==="ArrowRight"?1:-1));
    });
    // Raccourci explicite depuis la carte O3 et les méthodes O2 sans déplacer ni modifier leurs formulations.
    const o3 = point?.querySelector('.objectif-carte[data-objectif="O3"]');
    if (o3 && !o3.querySelector("[data-o3-raccourci]")) {
      const lien = document.createElement("a");
      lien.className = "o3-raccourci";
      lien.dataset.o3Raccourci = "1";
      lien.href = "#o3-atlas-reseaux";
      lien.dataset.theseVers = "methodes";
      lien.dataset.theseObjectif = "O3";
      lien.textContent = "Explorer les 20 figures de la galerie SNA du 211 →";
      // Le gestionnaire de rubriques change d'onglet et défile jusqu'à O3.
      lien.addEventListener('click', (event) => event.preventDefault());
      o3.appendChild(lien);
    }
    const methodes = zone.querySelector(".these-methodes");
    const ancienRenvoi = methodes?.querySelector(".o3-renvoi-methodes");
    if (ancienRenvoi && !modulesInitialises.has(ancienRenvoi)) ancienRenvoi.remove();
    if (methodes && !methodes.querySelector(".o3-renvoi-methodes")) {
      const note = document.createElement("div");
      note.className = "o3-renvoi-methodes";
      note.innerHTML = '<strong>Exemples qualitatifs et analyse du 211</strong><p>Les exemples d’entretiens et de codage sont présentés séparément ; la galerie contient quatre figures de synthèse et seize graphiques R issus du 211.</p><button type="button">Voir la galerie SNA du 211 (20 figures) →</button>';
      // Garder ce renvoi avec la méthode O3 au lieu d'en faire un bloc flottant.
      const titreO3 = zone.querySelector('#methode-o3-exemples > header');
      if (titreO3) titreO3.insertAdjacentElement("afterend", note);
      else if (espaceExemples) espaceExemples.insertBefore(note, espaceExemples.querySelector(":scope > .o3-clsc-methodo") || espaceExemples.firstChild);
      else cibleO3.prepend(note);
      modulesInitialises.add(note);
      note.querySelector("button").addEventListener("click", () => {
        const table = note.closest('[data-rubriques="these"]');
        const ongletMethode = table?.querySelector('[role="tab"][data-rubrique="methodes"]');
        if (ongletMethode && ongletMethode.getAttribute('aria-selected') !== 'true') ongletMethode.click();
        const carte = zone.querySelector("#o3-atlas-reseaux");
        if (carte) carte.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
    }
  }
  function synchroniserGaleries() {
    // Source statique pour la lecture libre, puis copie effectivement affichée dans la salle.
    initialiser(document.querySelector('section.section[data-salle="recherche"]'));
    initialiser(document.querySelector("#salle .salle-contenu"));
  }
  function installer() {
    synchroniserGaleries();
    const contenuSalle = document.querySelector("#salle .salle-contenu");
    if (contenuSalle) {
      // L'ouverture d'une porte remplace les enfants directs de .salle-contenu.
      // Ne pas observer toute la page et ne modifier aucun autre chapitre.
      new MutationObserver(() => initialiser(contenuSalle))
        .observe(contenuSalle, { childList: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installer, { once: true });
  else installer();
})();
