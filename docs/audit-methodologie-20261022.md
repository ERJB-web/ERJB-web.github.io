# Audit de non-régression — chapitre Méthodologie

**Périmètre :** version française de `/#recherche/methodes`, objectifs O1, O2 et O3. Révision préparée sur une branche distincte, sans publication automatique du travail non validé.

## Exigences reconstituées et protégées

- Préserver pour chacun des trois objectifs les six rubriques du menu : **04 Population à l’étude ; 05 Échantillonnage ; 06 Collecte de données ; 07 Analyse des données ; 08 Intégration des données ; 09 Limitations.**
- O1 : présenter **au début** l’essai exploratoire de faisabilité Ovid/PubMed/Covidence, les captures et les critères expérimentés, puis les apprentissages, les resserrements proposés et **ensuite** les méthodes de la revue à conduire (JBI, PRISMA-ScR). Ne jamais assimiler les 26 609 notices à un corpus inclus ou un avancement de sélection achevée.
- O2 : ouvrir par la cartographie exploratoire **indépendante**, son intérêt méthodologique et les contrastes des huit territoires de CLSC ; conserver les six secteurs, les six variables, les 55 fichiers, les 7 216 lieux de services et les 35 types de services ; garder intactes les **48 planches et leurs liens haute définition**. Distinguer ressources potentiellement disponibles, accessibilité effective et collaborations réellement mobilisées.
- O3 : préserver l’**analyse quantitative, observationnelle et rétrospective**, le questionnaire relationnel portant sur 12 mois, les **réseaux entiers par profil** et les réseaux **égocentrés à partir des CLSC contrastés**, les questions ouvertes complémentaires sans entretiens distincts. Les trois scénarios de taux de réponse demeurent des **repères de prudence**, non des seuils universels. Les taux organisations/CLSC restent distincts.
- Conserver les schémas, tableaux, figures, détails scientifiques et références ; auteur–année dans les phrases, notice complète à sa place dans la bibliographie.
- Palette cohérente : **O1 vert, O2 turquoise, O3 bleu** sur titres, menu et cartes de synthèse ; figures lisibles et niveaux de titre cohérents ; ne pas étirer artificiellement les mots, ne pas enfermer chaque illustration dans un cadre additionnel.

## Corrections apportées sur cette branche

1. La justification imposée à tous les paragraphes, listes et tableaux par la charte typographique a été remplacée par un alignement naturel. Cette règle produisait les espacements disgracieux montrés par les captures utilisateur.
2. La palette des produits O1/O2/O3 est alignée sur celle des objectifs.
3. Les quatre cartes analytiques O3 ont des nuances distinctes avec une typographie non justifiée, sans modification de leurs calculs.
4. Le déplacement de l’essai O1 corrige sa source : les critères, le bilan des resserrements et la **capture originale** sont transférés depuis la section d’exemples vers le début d’O1. Cela évite une reproduction de la capture et un reliquat d’encadré en fin de chapitre.
5. Le test `tests/methodologie-integrite.cjs` est exécuté dans le workflow des demandes de fusion.

## Résultats des contrôles structurels

| Vérification | Résultat |
| --- | --- |
| Six rubriques O1, O2, O3 et ordre respecté | 18/18 |
| Galerie O2 et originaux HD conservés | 48/48 planches ; 96/96 fichiers |
| Essai O1 avant la première rubrique | Présence du montage vérifiée |
| Essai O2 après l’intitulé de l’objectif | Présence du montage vérifiée |
| Deux niveaux de réseaux et instrument O3 | Présents |
| Couleurs cohérentes du parcours | O1/O2/O3 définies |
| Justification forcée dans la charte typographique | 0 occurrence |

## Limites de cette vérification

Ces contrôles portent sur les fichiers, la structure, les liens des figures et les règles de présentation. **Ils ne prouvent pas l’apparence effective de la page dans un navigateur.** Avant fusion sur `main`, il reste indispensable de vérifier visuellement les trois objectifs sur écran large et mobile, les encarts à dimensions étroites, l’ouverture des 48 planches, le menu latéral, les formulaires/contrôles interactifs et la parité de la version anglaise. Aucun succès visuel ne doit être déclaré sans capture ou session de navigateur.

**Règle de déploiement :** ne pas fusionner un correctif qui supprime une sous-rubrique, modifie les galeries ou contredit une formulation méthodologique retenue.
