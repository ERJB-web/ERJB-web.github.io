# Éric Bernier — site professionnel

Site statique publié avec GitHub Pages : `index.html` à la racine, ressources dans `assets/`.

## Modifier un texte

Les textes de la visite sont dans `assets/app.js`, en cinq langues (français, anglais, espagnol, arabe, chinois).

1. Repérer le texte : `node outils/textes.js liste "début du texte en français"`.
2. Écrire les nouvelles versions dans un fichier JSON sur le modèle de `outils/modifs-2026-10-12.json`.
3. Appliquer : `node outils/modifier.js outils/<fichier>.json`, puis `node --check assets/app.js`.

`node outils/entete.js <URL du site>` met à jour la description, l’aperçu de partage et la fiche de présentation lue par les moteurs de recherche.

## Aperçu local

```
python -m http.server 8770
```

puis ouvrir http://localhost:8770.
