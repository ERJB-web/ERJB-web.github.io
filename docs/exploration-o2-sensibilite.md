# Analyses de sensibilité : les conclusions tiennent-elles ?

Territoire : CIUSSS du Centre-Sud-de-l'Île-de-Montréal (RTS 063). Script `R/12_sensibilite.R`, exécuté le 17/10/2026.

On refait les calculs principaux en changeant une hypothèse à la fois, puis on regarde si l'ordre des huit territoires de CLSC change. Rang 1 = situation la plus défavorable. Tableaux détaillés : `12_classements_clsc.csv`, `12_comparaison_variantes.csv`, `12_zones_prioritaires_clsc.csv`, `12_lisa_stabilite.csv` ; figure : `fig_sensibilite_classements.png`.

Règle de verdict : « robuste » si la corrélation de Spearman avec le classement principal est d'au moins 0,85, si aucun CLSC ne bouge de plus de 2 rangs et si les deux CLSC en tête restent les mêmes ; « plutôt robuste » si la corrélation est d'au moins 0,7 ; sinon, le résultat dépend de l'hypothèse. Bilan : 11 variantes robustes, 8 plutôt robustes, 7 qui dépendent de l'hypothèse, 0 non classables.

## 1. Réponse intersectorielle (score de 0 à 12)

- Marche à 4 km/h, 10 min : Spearman 0,95, 4 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Marche à 4 km/h, 20 min : Spearman 0,98, 2 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Transport collectif 15 min, mardi 10 h : Spearman 0,95, 4 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Transport collectif 15 min, mardi 14 h : Spearman 0,95, 4 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Transport collectif 15 min, samedi 10 h : Spearman 0,95, 4 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Transport collectif 30 min, mardi 10 h : Spearman 0,98, 2 CLSC changent de rang (au plus 2), rang 1 : Verdun ; verdict : robuste.
- Transport collectif 30 min, mardi 14 h : Spearman 0,95, 5 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Transport collectif 30 min, samedi 10 h : Spearman 0,87, 5 CLSC changent de rang (au plus 2), rang 1 : Verdun ; verdict : plutôt robuste.

À pied, le score principal de Verdun à 500 m est de 4,29 ; à 4 km/h, il passe à 5,65. En transport collectif (30 min, mardi 10 h), presque tous les aînés atteignent les 12 domaines : moyenne de 10,95 à 12,00 selon le CLSC. L'écart entre CLSC est donc un écart de proximité à pied, pas d'accès en autobus ou en métro.

## 2. Accès aux GMF (E2SFCA, transport collectif)

- 20 min, poids constants (2SFCA) : Spearman 0,93, 6 CLSC changent de rang (au plus 1), rang 1 : Saint-Louis-du-Parc ; verdict : plutôt robuste.
- 20 min, poids gaussiens : Spearman 0,71, 7 CLSC changent de rang (au plus 3), rang 1 : Pointe-Saint-Charles ; verdict : plutôt robuste.
- 30 min, poids constants (2SFCA) : Spearman 0,95, 4 CLSC changent de rang (au plus 1), rang 1 : Saint-Louis-du-Parc ; verdict : robuste.
- 45 min, poids constants (2SFCA) : Spearman 0,52, 6 CLSC changent de rang (au plus 4), rang 1 : Verdun ; verdict : dépend de l'hypothèse.
- 45 min, poids gaussiens : Spearman 0,69, 6 CLSC changent de rang (au plus 3), rang 1 : Verdun ; verdict : dépend de l'hypothèse.

## 3. Besoins exprimés et non comblés au 211 (exercice 2025-2026)

- Exprimés 2025-2026 : Spearman 0,43, 6 CLSC changent de rang (au plus 4), rang 1 : Montréal - Centre-Ville ; verdict : dépend de l'hypothèse.
- Non comblés 2025-2026 : Spearman 1,00, 0 CLSC changent de rang (au plus 0), rang 1 : Saint-Paul ; verdict : robuste.

Ces besoins sont publiés par arrondissement et répartis entre les CLSC par la part des 60 ans et plus : les CLSC d'un même arrondissement (Saint-Henri, Saint-Paul, Pointe-Saint-Charles pour le Sud-Ouest) reçoivent le même taux à la population près. Le classement dit surtout quel arrondissement demande le plus.

## 4. Zones prioritaires (aînés nombreux, réponse faible, défavorisation)

- Quartiles, quintile 4 ou 5 : Spearman 0,95, 5 CLSC changent de rang (au plus 1), rang 1 : Verdun ; verdict : robuste.
- Quartiles, quintile 5 seulement : Spearman 0,92, 4 CLSC changent de rang (au plus 2), rang 1 : Verdun ; verdict : plutôt robuste.
- Score : Marche à 4 km/h, 10 min : Spearman 0,90, 5 CLSC changent de rang (au plus 2), rang 1 : Saint-Paul ; verdict : robuste.
- Score : Marche à 4 km/h, 20 min : Spearman 0,64, 4 CLSC changent de rang (au plus 4), rang 1 : Saint-Paul ; verdict : dépend de l'hypothèse.
- Score : Transport collectif 15 min, mardi 10 h : Spearman 0,79, 4 CLSC changent de rang (au plus 3), rang 1 : Saint-Paul ; verdict : plutôt robuste.
- Score : Transport collectif 15 min, mardi 14 h : Spearman 0,79, 4 CLSC changent de rang (au plus 3), rang 1 : Saint-Paul ; verdict : plutôt robuste.
- Score : Transport collectif 15 min, samedi 10 h : Spearman 0,79, 4 CLSC changent de rang (au plus 3), rang 1 : Saint-Paul ; verdict : plutôt robuste.
- Score : Transport collectif 30 min, mardi 10 h : Spearman 0,52, 7 CLSC changent de rang (au plus 4), rang 1 : Verdun ; verdict : dépend de l'hypothèse.
- Score : Transport collectif 30 min, mardi 14 h : Spearman 0,28, 7 CLSC changent de rang (au plus 5), rang 1 : Verdun ; verdict : dépend de l'hypothèse.
- Score : Transport collectif 30 min, samedi 10 h : Spearman 0,28, 7 CLSC changent de rang (au plus 5), rang 1 : Verdun ; verdict : dépend de l'hypothèse.
- Terciles, quintile 5 seulement : Spearman 0,90, 5 CLSC changent de rang (au plus 2), rang 1 : Montréal - Centre-Sud ; verdict : plutôt robuste.

- Marche à 4 km/h, 10 min : 15,6 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,69.
- Marche à 4 km/h, 20 min : 21,4 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,48.
- Transport collectif 30 min, mardi 10 h : 6,4 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,18.
- Transport collectif 15 min, mardi 10 h : 18,1 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,62.
- Transport collectif 30 min, mardi 14 h : 6,0 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,16.
- Transport collectif 15 min, mardi 14 h : 17,9 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,63.
- Transport collectif 30 min, samedi 10 h : 6,6 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,17.
- Transport collectif 15 min, samedi 10 h : 18,6 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,65.
- Terciles, quintile 5 seulement : 9,7 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,54.
- Quartiles, quintile 4 ou 5 : 12,0 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,51.
- Quartiles, quintile 5 seulement : 6,3 % des 65 ans et plus en zone prioritaire (principal : 18,3 %) ; îlots communs avec les zones principales (Jaccard) : 0,29.

## 5. Grappes de réponse faible (LISA Bas-Bas)

- Marche à 4 km/h, 10 min : 104 îlots Bas-Bas (principal : 137), 88 en commun, Jaccard 0,58.
- Marche à 4 km/h, 20 min : 0 îlots Bas-Bas (principal : 90), 0 en commun, Jaccard 0,00.
- Transport collectif 30 min, mardi 10 h : 0 îlots Bas-Bas (principal : 137), 0 en commun, Jaccard 0,00.
- Transport collectif 15 min, mardi 10 h : 98 îlots Bas-Bas (principal : 137), 79 en commun, Jaccard 0,51.
- Transport collectif 30 min, mardi 14 h : 0 îlots Bas-Bas (principal : 137), 0 en commun, Jaccard 0,00.
- Transport collectif 15 min, mardi 14 h : 100 îlots Bas-Bas (principal : 137), 80 en commun, Jaccard 0,51.
- Transport collectif 30 min, samedi 10 h : 0 îlots Bas-Bas (principal : 137), 0 en commun, Jaccard 0,00.
- Transport collectif 15 min, samedi 10 h : 102 îlots Bas-Bas (principal : 137), 83 en commun, Jaccard 0,53.

## Ce qui est solide et ce qui dépend des hypothèses

**Solide.** Verdun reste au rang 1 (score le plus faible) dans toutes les variantes du score ; la corrélation de Spearman avec le classement principal va de 0,87 à 0,98, et aucun CLSC ne bouge de plus de 2 rangs. Les CLSC du sud-ouest (Verdun, Saint-Paul, Saint-Henri) restent en bas, ceux du centre (Centre-Ville, Plateau, Saint-Louis-du-Parc) en haut, à 3 ou 4 km/h, à pied ou en transport collectif, un mardi ou un samedi.

**Solide.** Le classement des besoins non comblés au 211 ne change pas avec l'exercice 2025-2026 (Spearman 1,00) ; mais les effectifs non comblés sont petits (moins de 5 par domaine dans la plupart des CLSC) : c'est un signal faible.

**Plutôt solide.** Les zones prioritaires désignent surtout les mêmes CLSC quand on change les seuils (Spearman de 0,90 à 0,95) ; la part des 65 ans et plus en zone prioritaire, elle, dépend directement du seuil (6,3 à 18,3 %). Avec le quintile 5 seulement, Verdun, Montréal - Centre-Sud passe au rang 1 devant Saint-Paul : la conclusion « Saint-Paul et Verdun d'abord » repose sur l'inclusion du quintile 4.

**Dépend des hypothèses.** L'accès aux GMF : avec des zones de 30 min, le classement est stable (poids constants : Spearman 0,95) ; avec 20 ou 45 min, il change (Spearman de 0,52 à 0,93, rang 1 : Saint-Louis-du-Parc, Pointe-Saint-Charles, Verdun). La taille de la zone de desserte décide de quel CLSC paraît le moins bien servi.

**Dépend des hypothèses.** Les besoins exprimés au 211 en 2025-2026 se classent autrement qu'en 2024-2025 (Spearman 0,43, rang 1 : Montréal - Centre-Ville au lieu de Plateau-Mont-Royal) : le volume d'appels varie d'une année à l'autre.

**Dépend des hypothèses.** Les grappes LISA Bas-Bas tiennent à courte portée (10 min à 4 km/h, 15 min en transport collectif : Jaccard de 0,51 à 0,58) mais disparaissent quand la portée s'élargit (20 min à 4 km/h, 30 min en transport collectif : 0 îlot Bas-Bas) : presque tous les aînés atteignent alors 11 ou 12 domaines. Les zones prioritaires calculées sur ces scores larges ne couvrent plus que 6,0 à 21,4 % des 65 ans et plus.

**En bref.** La faiblesse de la réponse intersectorielle dans le sud-ouest du CCSMTL, et d'abord à Verdun, est un résultat robuste. Elle tient à la proximité à pied : en transport collectif, presque tous les aînés atteignent les 12 domaines. Le CLSC le moins bien servi en GMF, la taille exacte des zones prioritaires et les besoins exprimés au 211 dépendent des choix de calcul et doivent être présentés avec leurs hypothèses.
