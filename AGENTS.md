# Règles communes du site

- Toute évolution conserve la charte de `assets/typographie.css` : police commune, tailles par niveau de titre, corps et tableaux, justification du texte rédigé.
- Appliquer la justification dans les paragraphes, listes, encadrés et cellules des tableaux, y compris les contenus injectés. Les titres, commandes et sommaires gardent leur alignement fonctionnel.
- Modifier les critères typographiques dans la feuille centrale ; ne pas créer de variantes locales ni de styles typographiques importants en ligne.
- Après toute modification de CSS ou génération de HTML, exécuter `node outils/harmoniser-typographie.js`, puis `node outils/harmoniser-typographie.js --check`. Le générateur principal intègre cette étape automatiquement.
- Vérifier les pages concernées sur ordinateur et mobile, et conserver les adaptations linguistiques et le mode grands caractères.
- Préserver les textes et les modifications récentes ; les générateurs historiques peuvent ne pas reprendre toutes les retouches des pages publiées. Vérifier les différences avant de remplacer les pages générées.
- Dans toutes les salles et toutes les langues, conserver deux barres : coordonnées, langue, accessibilité, « Revenir aux Halls » à gauche et « Revenir aux Chapitres » à droite ; puis précédent au bord gauche, chapitre courant exactement au centre et suivant au bord droit. Aucun bouton Écouter, CV ou Affiche dans ces barres. L'en-tête de l'accueil reste inchangé. Les sommaires colorés sont conservés. Les anciennes consoles « Parcours de lecture » et le bouton « Porte suivante » des salles ont été supprimés ; ne pas les recréer.
- Après une modification de la navigation, exécuter `node tests/navigation-unique.cjs` (jsdom@26) : l'initialisation et précédent/suivant doivent fonctionner dans les huit éditions.
- Les styles de la barre supérieure appartiennent exclusivement à `assets/navigation-chapitres.css`. Ne pas ajouter de correctif de cette barre dans un module de page, un style en ligne ou une autre feuille.
- Une retouche graphique ne régénère pas les pages. Le vrai générateur se teste sans écriture avec `node tests/generation-navigation.cjs` ; ses dépendances de navigation proviennent de `outils/navigation-chapitres.js`.
- Avant publication, exécuter `node outils/verifier-navigation.js`. Le workflow `pages.yml` conditionne la publication aux contrôles ; conserver cette dépendance.
