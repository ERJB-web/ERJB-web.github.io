# Éric Bernier — site professionnel

Site statique publié avec GitHub Pages : https://erjb-web.github.io/

- `index.html` (français), `en/index.html` (anglais) et `404.html` sont produits par `outils/construire.js`.
- Tous les textes sont dans `outils/contenu.js`, en français et en anglais, avec la même structure.
- `assets/site.css` et `assets/site.js` : mise en page, hall à quatre portes, salles et onglets.
- `docs/` : CV publiés (sans numéro de téléphone ni coordonnées des références).

## Modifier un texte

1. Changer le texte dans `outils/contenu.js` (les deux langues).
2. `node outils/construire.js`
3. Vérifier en local, puis publier (`git commit` et `git push`).

## Aperçu local

```
python -m http.server 8770
```

puis ouvrir http://localhost:8770.
