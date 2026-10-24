export function creerBus() {
  const ecouteurs = new Map();
  return {
    on(nom, fn) {
      if (!ecouteurs.has(nom)) ecouteurs.set(nom, new Set());
      ecouteurs.get(nom).add(fn);
      return () => ecouteurs.get(nom)?.delete(fn);
    },
    off(nom, fn) {
      ecouteurs.get(nom)?.delete(fn);
    },
    once(nom, fn) {
      const retirer = this.on(nom, (d) => { retirer(); fn(d); });
      return retirer;
    },
    emit(nom, donnees) {
      const set = ecouteurs.get(nom);
      if (!set) return;
      for (const fn of [...set]) {
        try { fn(donnees); } catch (e) { console.error(`[bus] ${nom}`, e); }
      }
    },
    attendre(nom, filtre) {
      return new Promise((resoudre) => {
        const retirer = this.on(nom, (d) => {
          if (filtre && !filtre(d)) return;
          retirer();
          resoudre(d);
        });
      });
    },
  };
}
