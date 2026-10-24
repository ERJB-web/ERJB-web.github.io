# Vision de l’enseignement : parcours interactif

Le chapitre français `transmission/enseignement-0` développe les liens entre éducation spécialisée, psychologie de l’apprentissage, pédagogie et responsabilités sociales de l’enseignement. Il conserve le menu et les huit chapitres existants. Le texte initial reste accessible dans un volet de lecture approfondie.

## Parti pris

Les interactions servent des apprentissages précis : distinguer une observation d’une interprétation, comparer des choix d’accompagnement, comprendre les finalités de l’éducation, vérifier la cohérence d’une activité et discuter des conséquences sociales du savoir. La fiction ne présente ni un étudiant réel ni une expérience d’enseignement évaluée. Aucun parcours de décision n’est transformé en profil psychologique ou en score de qualité professionnelle.

La simulation comprend trois moments et neuf choix commentés. Le laboratoire examine les 27 combinaisons d’un objectif, d’une activité et d’une évaluation ; ses règles explicites illustrent un alignement et ne valident pas un cours. Le quiz de six questions propose un bilan corrigé et ne constitue pas un instrument validé.

## Sources

Les douze références sont liées dans le parcours et accompagnées de leur statut : repère professionnel, modèle conceptuel, philosophie de l’éducation, synthèse, cadre de conception, méta-analyse ou rapport d’orientation. La recherche ciblée mobilise le Gouvernement du Québec, le RIPPH, Ryan et Deci (2020), CAST (2024), Biesta (2009), l’Eberly Center, Biggs (1996), Freeman et al. (2014), Carless et Boud (2018), l’UNESCO (2021) et Pashler et al. (2008). Les références à Freire et hooks du texte initial sont conservées.

Les effets rapportés dans l’étude de Freeman sont situés dans les enseignements STEM étudiés. Les travaux sur les styles d’apprentissage sont distingués de l’accessibilité et de la diversité des supports. Le modèle MDH-PPH éclaire une attention au contexte ; il n’est pas employé pour diagnostiquer les étudiants.

## Charte graphique

Les variables héritent de la Chaire : `--gab-bleu` (#0879BE), `--gab-sarcelle` (#11A7A5), `--gab-vert` (#5AAE38), `--gab-bleu-logo` (#0755AD) et `--gab-marine` (#0D2A3A). La typographie conserve les échelles de `assets/typographie.css`. Aucun menu général ou latéral n’est remplacé. Les boutons internes servent à explorer une notion ou une situation. La page directe reprend les mêmes feuilles de style.

## Maintenance et validation

- Contenu et rendu : `outils/enseignement-immersif.cjs`.
- Interactions : `assets/enseignement-immersif.js` ; styles limités à `.ei` dans la feuille correspondante.
- Exécuter `node outils/installer-enseignement-immersif.cjs` pour actualiser uniquement ce chapitre et `enseignement/vision.html`, avec des empreintes de cache automatiques. Le générateur général utilise aussi le module pour le français.
- Un serveur HTTP sur le port 8781, Playwright et Edge permettent de lancer `node tests/enseignement-immersif.cjs`. Les variables `ENSEIGNEMENT_BASE_URL` et `ENSEIGNEMENT_QA_OUTPUT` modifient l’adresse de test et la destination des captures.

Le test couvre les couleurs calculées, trois regards, neuf décisions, la reprise de la simulation, trois finalités, quatre horizons sociaux, les 27 assemblages, le fichier exporté, le score du quiz sans double comptage, le bilan et la reprise. Il vérifie les largeurs 320, 390 et 768 pixels ainsi que le chapitre réel dans la salle clonée et la présence des menus communs. Les interactions sont accessibles au clavier ; l’animation respecte la préférence de réduction du mouvement.
