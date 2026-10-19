# Éric Bernier — site professionnel

Site statique publié avec GitHub Pages : https://erjb-web.github.io/

- Les pages complètes en français, anglais, espagnol, chinois, arabe et russe, les versions abrégées et `404.html` sont produites par `outils/construire.js`.
- Les textes français, anglais et espagnols sont dans `outils/contenu.js`. Les autres langues complètes sont dans `outils/i18n/`, avec la même structure. Les salles d’expertise sont dans `outils/vitrines.json` ; les compléments russes sont dans `outils/i18n/ru-complements.json`.
- `assets/site.css` et `assets/site.js` : mise en page, hall à six portes, salles et onglets.
- `docs/` : CV publiés (sans numéro de téléphone ni coordonnées des références).

## Modifier un texte

1. Changer le texte source et ses traductions dans les fichiers correspondants.
2. `node outils/construire.js`
3. `node outils/verifier.js`, vérifier en local sur ordinateur et téléphone, puis publier (`git commit` et `git push`).

La version russe renvoie vers l’affiche française existante. La lecture des sections dont le texte a changé utilise la voix de l’appareil pour éviter de lire un ancien enregistrement.

## Aperçu local

```
python -m http.server 8770
```

puis ouvrir http://localhost:8770.

## Navigation et charte graphique

Le gabarit de Projet de thèse est la référence commune : barre de lecture, boutons Tous les chapitres / Chapitre précédent / Chapitre suivant, compteur et sommaire latéral à groupes colorés. Ne pas créer de menus alternatifs ni découper artificiellement une rubrique. Les axes de recherche se lisent ensemble dans un seul chapitre ; une rubrique peut afficher Chapitre 1 sur 1. Conserver les découpages éditoriaux explicitement établis et les textes à jour.

La typographie éditoriale commune est définie dans `assets/typographie.css`, chargée après les styles des modules : corps 16 px, sections 22 px, sous-sections 19 px, encadrés 18 px et graisse modérée. Conserver cette échelle lors des modifications.

Les cinq rubriques Engagements sont des pages de lecture directe : aucun sommaire latéral, compteur de chapitre ou bouton de chapitre précédent/suivant. Représentation présente les mandats actuels et précédents avec des filtres ; Distinctions met les prix et soutiens en valeur ; Sports et loisirs conserve les huit images dans une galerie occupant toute la largeur. Une image interne à une page unique ne doit pas être retirée pour alimenter une colonne latérale absente. Ces compositions sont définies dans `assets/gabarit-salles.js` et `assets/gabarit-salles.css` ; les textes restent dans leurs sources multilingues et la typographie dans la feuille commune.

## Entretien du dépôt

Conserver les pages et ressources publiées, les sources multilingues, les générateurs des galeries et applications, les contrôles et les workflows actifs. Les scripts ponctuels de migration déjà appliqués et les variantes de menus abandonnées sont retirés. Les caches et dossiers de travail locaux sont exclus par `.gitignore`.

## Charte typographique obligatoire pour toute évolution

La police, les tailles et la justification sont centralisées dans `assets/typographie.css`. Corps et texte des tableaux : 16 px ; notes : 14 px ; titres de page : 28–36 px ; chapitres : 23–28 px ; sections : 22 px ; sous-sections : 19 px ; encadrés : 18 px. Les adaptations mobiles et le mode grands caractères restent définis dans cette même feuille.

Tout texte rédigé est justifié, y compris les paragraphes et listes dans les tableaux, les encadrés et les modules injectés. Les titres, commandes et sommaires gardent leur alignement fonctionnel. La police commune est Inter avec des polices système de remplacement. Aucun module ne doit définir une nouvelle échelle ou imposer un alignement local au texte rédigé. Les exceptions fonctionnelles se définissent dans la charte centrale.

La couche CSS `charte-typographique` donne la priorité aux règles communes sur les déclarations locales importantes. Ne pas ajouter de styles typographiques importants en ligne.

`node outils/construire.js` applique automatiquement la feuille commune en dernier dans chaque page HTML, y compris les applications et simulations, avec une empreinte de cache recalculée. Après toute autre génération de page ou modification de la charte, exécuter `node outils/harmoniser-typographie.js`, puis `node outils/harmoniser-typographie.js --check`. Le workflow GitHub vérifie cette couverture à chaque modification du dépôt.
