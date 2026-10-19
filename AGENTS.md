# Règles communes du site

- Toute évolution conserve la charte de `assets/typographie.css` : police commune, tailles par niveau de titre, corps et tableaux, justification du texte rédigé.
- Appliquer la justification dans les paragraphes, listes, encadrés et cellules des tableaux, y compris les contenus injectés. Les titres, commandes et sommaires gardent leur alignement fonctionnel.
- Modifier les critères typographiques dans la feuille centrale ; ne pas créer de variantes locales ni de styles typographiques importants en ligne.
- Après toute modification de CSS ou génération de HTML, exécuter `node outils/harmoniser-typographie.js`, puis `node outils/harmoniser-typographie.js --check`. Le générateur principal intègre cette étape automatiquement.
- Vérifier les pages concernées sur ordinateur et mobile, et conserver les adaptations linguistiques et le mode grands caractères.
- Préserver les textes et les modifications récentes ; les générateurs historiques peuvent ne pas reprendre toutes les retouches des pages publiées. Vérifier les différences avant de remplacer les pages générées.
- Navigation des salles : conserver la barre supérieure « Tous les chapitres / Chapitre précédent / Chapitre suivant », son compteur et les sommaires colorés dédiés. Les anciennes consoles « Parcours de lecture » et le bouton « Porte suivante » des salles ont été supprimés ; ne pas les recréer dans les pages, les scripts ou le générateur.
- Après une modification de la navigation, exécuter `node tests/navigation-unique.cjs` (jsdom@26) : l'initialisation et précédent/suivant doivent fonctionner dans les huit éditions.
