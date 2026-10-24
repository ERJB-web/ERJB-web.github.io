/* Galerie O2 : une seule planche visible, sans piste défilante et sans déplacement de page. */
(() => {
  "use strict";
  const trouver = (gallery) => Array.from(gallery.querySelectorAll(".galerie-o2-planche"));
  const bornes = (i, total) => Math.max(0, Math.min(total - 1, i));

  function afficher(gallery, n) {
    const figures = trouver(gallery);
    if (!figures.length) return;
    n = bornes(n, figures.length);
    figures.forEach((figure, i) => {
      const visible = i === n;
      figure.hidden = !visible;
      figure.setAttribute("aria-hidden", String(!visible));
      if (visible) {
        const image = figure.querySelector("img");
        if (image) image.loading = "eager";
      }
    });
    gallery.dataset.planche = String(n + 1);
    const select = gallery.querySelector("[data-galerie-choix]");
    if (select) select.value = String(n + 1);
    const counter = gallery.querySelector("[data-galerie-compteur]");
    if (counter) counter.textContent = (n + 1) + " / " + figures.length;
    const prev = gallery.querySelector("[data-galerie-precedente]");
    const next = gallery.querySelector("[data-galerie-suivante]");
    if (prev) prev.disabled = n === 0;
    if (next) next.disabled = n === figures.length - 1;
    const hd = gallery.querySelector("[data-galerie-agrandir]");
    const origin = figures[n].querySelector(".galerie-o2-photo");
    if (hd && origin) {
      hd.href = origin.href;
      const title = figures[n].querySelector("img");
      hd.setAttribute("aria-label", "Voir en haute définition : " + (title?.alt || "la carte"));
    }
  }

  // Sélection éditoriale : dix illustrations complémentaires de la faisabilité O2.
  // Les 48 fichiers d'origine restent archivés ; seule la galerie publique est allégée.
  const selectionO2 = [1, 2, 3, 6, 8, 9, 26, 28, 33, 35];
  function reduireGalerie(gallery) {
    const figures = trouver(gallery);
    if (figures.length > selectionO2.length) {
      figures.forEach((figure, index) => {
        const rang = selectionO2.indexOf(index + 1);
        if (rang < 0) figure.remove();
      });
      const select = gallery.querySelector("[data-galerie-choix]");
      if (select) {
        Array.from(select.options).forEach(option => {
          const rang = selectionO2.indexOf(Number(option.value));
          if (rang < 0) option.remove();
          else {
            option.value = String(rang + 1);
            option.textContent = option.textContent.replace(/^\s*\d{1,2}\s*·\s*/, String(rang + 1).padStart(2, "0") + " · ");
          }
        });
      }
      gallery.dataset.planche = "1";
    }
    trouver(gallery).forEach((figure, i) => {
      figure.setAttribute("aria-label", "Planche " + (i + 1) + " sur 10");
    });
    gallery.setAttribute("aria-label", "10 cartes et graphiques de démonstration O2");
    const select = gallery.querySelector("[data-galerie-choix]");
    if (select) select.setAttribute("aria-label", "Choisir une des 10 planches");
    const zone = gallery.closest("#methode-o2-exemples");
    const titre = zone?.querySelector(":scope > header h6");
    if (titre) titre.textContent = "Galerie exploratoire · 10 cartes et graphiques";
  }

  function initialiser(gallery) {
    if (!gallery || gallery.dataset.galerieInitialisee === "oui") return;
    reduireGalerie(gallery);
    const figures = trouver(gallery);
    if (!figures.length) return;
    gallery.dataset.galerieInitialisee = "oui";
    afficher(gallery, bornes((Number(gallery.dataset.planche) || 1) - 1, figures.length));
  }

  // Les vues de chapitre peuvent déplacer ou recréer le contenu : les événements
  // sont délégués au document. Aucune écoute de scroll, aucun drag de la page.
  document.querySelectorAll("[data-galerie-o2]").forEach(initialiser);
  document.addEventListener("focusin", event => {
    const gallery = event.target.closest?.("[data-galerie-o2]");
    if (gallery) initialiser(gallery);
  });
  document.addEventListener("change", event => {
    if (!event.target.matches?.("[data-galerie-choix]")) return;
    const gallery = event.target.closest("[data-galerie-o2]");
    initialiser(gallery);
    afficher(gallery, Number(event.target.value) - 1);
  });

  document.addEventListener("click", event => {
    const source = event.target.closest?.("[data-galerie-planche]");
    if (source) {
      const gallery = source.closest(".methode-exemples")?.querySelector("[data-galerie-o2]");
      if (!gallery) return;
      event.preventDefault();
      initialiser(gallery);
      afficher(gallery, Number(source.dataset.galeriePlanche) - 1);
      // Un lien extérieur à la visionneuse mène volontairement à celle-ci.
      gallery.scrollIntoView({block:"start", behavior:"auto"});
      return;
    }
    const button = event.target.closest?.("[data-galerie-precedente],[data-galerie-suivante]");
    if (!button) return;
    const gallery = button.closest("[data-galerie-o2]");
    if (!gallery) return;
    initialiser(gallery);
    const i = Number(gallery.dataset.planche || "1") - 1;
    const delta = button.hasAttribute("data-galerie-suivante") ? 1 : -1;
    // Ne jamais appeler scrollTo ou scrollIntoView depuis les flèches.
    afficher(gallery, i + delta);
  });

  document.addEventListener("keydown", event => {
    if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest?.("select,input,textarea,[contenteditable='true']")) return;
    const gallery = event.target.closest?.("[data-galerie-o2]");
    if (!gallery) return;
    initialiser(gallery);
    const total = trouver(gallery).length;
    let i = Number(gallery.dataset.planche || "1") - 1;
    if (event.key === "ArrowLeft") i--;
    else if (event.key === "ArrowRight") i++;
    else if (event.key === "Home") i = 0;
    else i = total - 1;
    event.preventDefault();
    afficher(gallery, i);
  });
})();
