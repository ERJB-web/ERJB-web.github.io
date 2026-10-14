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
