# Éric Bernier — site professionnel

Site statique publié avec GitHub Pages : https://erjb-web.github.io/

- Les pages complètes en français, anglais, espagnol, chinois, arabe et russe, les versions abrégées et `404.html` se modifient directement dans le dépôt.
- Les textes français, anglais et espagnols sont dans `outils/contenu.js`. Les autres langues complètes sont dans `outils/i18n/`, avec la même structure. Les salles d’expertise sont dans `outils/vitrines.json` ; les compléments russes sont dans `outils/i18n/ru-complements.json`.
- `assets/site.css` et `assets/site.js` : mise en page, hall à six portes et routeur des salles.
- `assets/navigation-chapitres.css` : seule feuille de la barre de navigation des salles.
- `assets/gabarit-salles.js` : seul contrôleur des chapitres et des sommaires dédiés.
- `outils/navigation-chapitres.js` : chargement commun du gabarit dans les pages générées ; `outils/chapitres-these.json` fixe les six chapitres et leurs traductions.
- `docs/` : CV publiés (sans numéro de téléphone ni coordonnées des références).

## Modifier un texte

Les pages HTML publiées comportent des retouches éditoriales plus récentes que certaines sources historiques. Modifier la page et sa source concernées de façon ciblée, puis vérifier les différences. Une modification graphique ne demande aucune régénération du contenu.

Aucun générateur complet n'est conservé dans le dépôt : retoucher les pages publiées directement.

Avant publication : `node outils/verifier-navigation.js`, `node tests/navigation-unique.cjs` (jsdom@26), puis le contrôle typographique et la vérification visuelle sur ordinateur et téléphone.

Le démarrage commun provient de `assets/chargement.js` et `outils/chargement-page.js`. Il attend la navigation, les compléments de contenu et les styles avant de révéler la page. Un chargement interrompu propose de réessayer et ne réaffiche pas une présentation intermédiaire. `node tests/chargement-typographie.cjs` vérifie ce comportement et le renouvellement des versions des ressources.

Après modification d’un script ou d’une feuille, exécuter `node outils/harmoniser-typographie.js`, puis `node outils/harmoniser-typographie.js --check`. Cette commande synchronise aussi le démarrage et attribue aux ressources locales une version calculée sur leur contenu. Ne pas réintroduire des corrections de libellés après affichage ni des tailles réduites propres à une salle : modifier le HTML/source et la charte commune.

La version russe renvoie vers l’affiche française existante. La lecture des sections dont le texte a changé utilise la voix de l’appareil pour éviter de lire un ancien enregistrement.

## Aperçu local

```
python -m http.server 8770
```

puis ouvrir http://localhost:8770.

## Navigation et charte graphique

Toutes les salles partagent deux barres. La première reprend les coordonnées, la langue et l'accessibilité de l'accueil, avec « Revenir aux Halls » à gauche et « Revenir aux Chapitres » à droite, sans Écouter, CV ni Affiche. La seconde place précédent au bord gauche, le chapitre courant exactement au centre et suivant au bord droit. Le compteur et les sommaires colorés sont conservés. L'accueil reste inchangé. Ne pas créer de menus alternatifs ni découper artificiellement une rubrique. Les axes se lisent ensemble ; une rubrique peut afficher Chapitre 1 sur 1.

La typographie éditoriale commune est définie dans `assets/typographie.css`, chargée après les styles des modules : corps 16 px, sections 22 px, sous-sections 19 px, encadrés 18 px et graisse modérée. Conserver cette échelle lors des modifications.

Les rubriques Parcours, Engagements et Ressources utilisent les mêmes commandes pour passer entre les rubriques d'une porte. Une rubrique de lecture directe conserve son contenu ensemble, sans sommaire latéral artificiel. Les dossiers scientifiques conservent leurs sommaires colorés. Les compositions du contenu restent dans `assets/gabarit-salles.css` et leurs modules spécialisés ; elles ne doivent pas redéfinir la barre supérieure.

## Entretien du dépôt

Conserver les pages et ressources publiées, les sources multilingues, les générateurs des galeries et applications, les contrôles et les workflows actifs. Les scripts ponctuels de migration déjà appliqués et les variantes de menus abandonnées sont retirés. Les caches et dossiers de travail locaux sont exclus par `.gitignore`.

Le workflow `pages.yml` audite tous les fichiers de code, de styles, de données et les pages, teste le générateur et les interactions, puis publie seulement si tous les contrôles réussissent. Il ne lance jamais de régénération des pages publiées. Le workflow de revue de presse reste indépendant.

## Charte typographique obligatoire pour toute évolution

La police, les tailles et la justification sont centralisées dans `assets/typographie.css`. Corps et texte des tableaux : 16 px ; notes : 14 px ; titres de page : 28–36 px ; chapitres : 23–28 px ; sections : 22 px ; sous-sections : 19 px ; encadrés : 18 px. Les adaptations mobiles et le mode grands caractères restent définis dans cette même feuille.

Tout texte rédigé est justifié, y compris les paragraphes et listes dans les tableaux, les encadrés et les modules injectés. Les titres, commandes et sommaires gardent leur alignement d’usage. La police commune est Inter avec des polices système de remplacement. Aucun module ne doit définir une nouvelle échelle ou imposer un alignement local au texte rédigé. Les exceptions d’usage se définissent dans la charte centrale.

La couche CSS `charte-typographique` donne la priorité aux règles communes sur les déclarations locales importantes. Ne pas ajouter de styles typographiques importants en ligne.

Après toute génération de page ou modification de la charte, exécuter `node outils/harmoniser-typographie.js`, puis `node outils/harmoniser-typographie.js --check`. Le workflow GitHub vérifie cette couverture à chaque modification du dépôt.

Les liens de sous-partie utilisent `#salle/chapitre/ancre`. Le routeur conserve la position de lecture et les accordéons par entrée d’historique ; les ancres explicites ouvrent leur chapitre et les détails concernés avant affichage. Les flèches latérales portent le titre réel de leur destination et sont masquées aux extrémités.

Les éditions inuktitut et innu-aimun demeurent explicitement partielles. Les ressources Pirurvik/Tusaalanga, Tshakapesh et Innu-aimun sont référencées dans les pages et dans `outils/editions-autochtones.js` ; elles ne constituent pas une validation des textes scientifiques existants. Aucun nouveau texte scientifique n’est traduit artificiellement dans ces langues.
