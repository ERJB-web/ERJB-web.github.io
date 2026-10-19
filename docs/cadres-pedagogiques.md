# Parcours « Les savoirs en mouvement »

La section française du chapitre Transfert remplace les cinq cartes par un parcours de fiches dépliables, 23 repères interactifs, cinq défis corrigés, un atelier de planification et un quiz de huit questions. Une page directe est disponible à `implantation/mobilisation.html`.

## Fondements et limites

Les sept références complètes sont intégrées dans le parcours et dans le fichier de plan exporté. Recherche ciblée dans les publications fondatrices et les ressources institutionnelles des IRSC, le 18 octobre 2026 (heure de New York).

- Ward (2017) : préserver la question des détenteurs de savoirs (« whose »), au-delà des destinataires. Le cadre est réflexif ; l’ordre proposé pour la lecture n’est pas prescriptif.
- Graham et al. (2006), ressource institutionnelle IRSC : distinguer création des connaissances et sept phases du cycle d’action ; rappeler les allers-retours.
- Kirkness et Barnhardt (1991), réédition hébergée par l’Université d’Alaska : reconnaître l’origine des 4R dans les Premières Nations et l’enseignement supérieur ; signaler la transposition pédagogique.
- IRSC (2014) : distinguer inclusivité, soutien, respect mutuel et collaboration des 4R ; rendre concrètes les conditions du partenariat.
- Boyko et al. (2012) : décrire un dialogue préparé et facilité ; ne pas en faire une promesse de consensus ou de changement organisationnel.
- Staniszewska et al. (2017), GRIPP2 : guide pour rendre compte de la participation, sans lui attribuer la fonction d’une certification de qualité.
- Morton (2015) : contribution contextualisée, mécanismes et explications concurrentes ; les quatre catégories de suivi sont une adaptation proposée pour ce plan, sans les présenter comme des indicateurs prescrits par Morton.

Les schémas et les mises en situation sont originaux. Les exemples sont fictifs, les activités du plan sont des propositions et le quiz n’est pas un instrument validé. Les versions linguistiques existantes restent disponibles ; ce nouveau parcours est en français.

## Maintenance

Contenu et HTML : `outils/cadres-pedagogiques.js`. Interactions : `assets/cadres-pedagogiques.js`. Présentation : `assets/cadres-pedagogiques.css`.

Après une modification du contenu, exécuter `node outils/installer-cadres.cjs`. Ce script met à jour uniquement le parcours dans la page française existante et sa page directe, en conservant les autres ajustements manuels du site. Le générateur général appelle aussi le module pour la section française.

## Validation

Le test navigateur `tests/cadres-smoke.cjs` utilise Playwright et Edge, avec un serveur local à `http://127.0.0.1:8780`. Il couvre les 23 repères, les réponses fausses et correctes aux défis, les scores et le redémarrage du quiz, le plan exporté, les largeurs 320/390/768 px et le contenu cloné dans le modèle du hall. Les captures sont écrites dans le dossier parent du dépôt.

Une vérification supplémentaire dans le chapitre réel a confirmé l’intégration et l’absence de débordement sur téléphone. L’erreur de sélection de plusieurs éléments dans `condenserExplicationsO2` interrompait auparavant la construction des chapitres : deux sélecteurs ont été corrigés pour retourner des listes. La sélection du dernier bloc de cadres d’implantation accepte désormais que le plan français ait été remplacé par le parcours.

Le contrôle général historique `outils/verifier.js` obtient 133/219, strictement comme avant la modification de contenu. Les différences de structures linguistiques et les liens d’images manquants qu’il signale préexistaient à cette intervention. Les tests du parcours passent et ne produisent aucune erreur JavaScript.
