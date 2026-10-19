/* Ma thèse — transformation progressive des listes de méthode en schémas */
(() => {
  const listes = document.querySelectorAll('.these .these-methode-objectif[data-objectif] .methode-these-corps > dl');
  listes.forEach((liste) => {
    if (liste.dataset.schemaInitialise) return;
    const elements = Array.from(liste.children);
    if (elements.length < 4 || elements.length % 2 ||
        elements.some((el, i) => el.tagName !== (i % 2 ? 'DD' : 'DT'))) return;

    const objectif = liste.closest('.these-methode-objectif');
    if (!objectif) return;
    const code = objectif.dataset.objectif || 'objectif';
    const etapes = [];
    for (let i = 0; i < elements.length; i += 2) {
      const titre = elements[i].textContent.trim();
      etapes.push({titre, rubrique:titre.replace(/,\s*volet\s+.*$/i, '').trim(),
        dt:elements[i], dd:elements[i + 1]});
    }

    const grille = document.createDocumentFragment();
    const cartes = [];
    etapes.forEach((etape, index) => {
      const carte = document.createElement('div');
      carte.className = 'these-schema-card';
      carte.id = 'schema-' + code.toLowerCase() + '-' + (index + 1);
      carte.dataset.num = String(index + 1).padStart(2, '0');
      if (/\bQUAN\b/i.test(etape.titre)) carte.dataset.volet = 'quan';
      else if (/\bqual\b/i.test(etape.titre)) carte.dataset.volet = 'qual';
      if (index === 0 || index === etapes.length - 1 ||
          /^intégration$/i.test(etape.titre) ||
          /^pourquoi plusieurs CLSC contrastés$/i.test(etape.titre)) {
        carte.classList.add('is-wide');
      }
      carte.append(etape.dt, etape.dd);
      cartes.push(carte);
      grille.appendChild(carte);
    });

    // Évite une carte orpheline à la fin d'une rangée à deux colonnes.
    let serie = [];
    const equilibrer = () => {
      if (serie.length % 2) serie[serie.length - 1].classList.add('is-wide');
      serie = [];
    };
    cartes.forEach((carte) => {
      if (carte.classList.contains('is-wide')) equilibrer();
      else serie.push(carte);
    });
    equilibrer();

    const navigation = document.createElement('nav');
    navigation.className = 'these-schema-nav';
    navigation.setAttribute('aria-label', 'Parcours de la méthodologie');
    const boutons = [];
    let rubriquePrecedente = '';
    etapes.forEach((etape, index) => {
      if (etape.rubrique.toLocaleLowerCase('fr') === rubriquePrecedente) return;
      rubriquePrecedente = etape.rubrique.toLocaleLowerCase('fr');
      if (boutons.length) {
        const fleche = document.createElement('span');
        fleche.className = 'these-schema-nav-fleche';
        fleche.setAttribute('aria-hidden', 'true');
        fleche.textContent = '→';
        navigation.appendChild(fleche);
      }
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'these-schema-nav-btn';
      bouton.textContent = etape.rubrique;
      bouton.setAttribute('aria-label', 'Aller à : ' + etape.rubrique);
      bouton.addEventListener('click', () => {
        boutons.forEach(b => b.removeAttribute('aria-current'));
        bouton.setAttribute('aria-current', 'step');
        cartes[index].scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
      });
      boutons.push(bouton);
      navigation.appendChild(bouton);
    });
    if (boutons[0]) boutons[0].setAttribute('aria-current', 'step');
    liste.replaceChildren(grille);
    liste.classList.add('these-schema-grille');
    liste.dataset.schemaInitialise = '1';
    liste.before(navigation);
  });
})();


/* Compléments de rigueur scientifique, indépendants des menus de chapitres.
   Seul le contenu O1/O2/O3 est enrichi ; aucun contrôleur de navigation n'est remplacé. */
(() => {
  "use strict";
  const installer = () => {
    if ((document.documentElement.lang || "fr").slice(0, 2) !== "fr" ||
        !document.querySelector("#these-methode-o1") ||
        document.getElementById("maturite-scientifique-loader")) return;
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = new URL("assets/maturite-scientifique.css?v=20261019-2", document.baseURI).href;
    document.head.appendChild(style);
    const script = document.createElement("script");
    script.id = "maturite-scientifique-loader";
    script.src = new URL("assets/maturite-scientifique.js?v=20261019-2", document.baseURI).href;
    document.head.appendChild(script);
  };
  if (document.readyState === "complete") installer();
  else window.addEventListener("load", installer, { once: true });
})();
