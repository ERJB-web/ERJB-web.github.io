"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const ordre = $$(".porte").map((p) => p.dataset.salle);
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const attendre = (ms) => new Promise((r) => setTimeout(r, reduit ? 0 : ms));
  const salle = $("#salle");
  const contenu = $(".salle-contenu", salle);
  const points = $$(".points span");
  let courante = null;
  let occupe = false;

  function marquer(nom) {
    points.forEach((p, i) => p.classList.toggle("actif", ordre[i] === nom));
  }

  async function entrer(nom) {
    if (occupe) return;
    occupe = true;
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

    const r = $(".baie", porte).getBoundingClientRect();
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
    contenu.replaceChildren(section.querySelector(".section-corps").cloneNode(true));
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
})();
