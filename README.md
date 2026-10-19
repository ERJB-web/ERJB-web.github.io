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
