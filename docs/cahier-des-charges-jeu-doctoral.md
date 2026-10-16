# PROTOCOLE : LA THÈSE IMPOSSIBLE
## Cahier des charges de création — jeu 3D narratif interactif intégré au site d’Éric Bernier
**Version** 1.0 — 15 octobre 2026 · **Statut** cahier des charges de référence · **Plateforme** navigateur / GitHub Pages

> **Ambition** : une aventure doctorale à la troisième personne, spectaculaire, pleine d'autodérision et scientifiquement rigoureuse. Référence d'exigence : lisibilité des espaces, caméra et ressenti d'un jeu d'action-aventure contemporain (ex. Assassin's Creed), **et non** promesse de photoréalisme AAA ou de son budget de production. L'exécution doit rester réaliste dans un site statique, fluide sur mobile, accessible et sans serveur.

## 1. Promesse au joueur
« Aidez Éric à transformer une intuition tentaculaire sur les besoins sociaux et les services de santé en un protocole de thèse **faisable**, **pertinent**, **éthique** et **défendable**. Vous avez des idées, un peu de temps, trois cafés et quinze formulaires. Le comité, lui, a des questions. »

**Genre** : aventure exploratoire 3D + récit à embranchements + gestion de ressources + enquêtes documentaires + mini-jeux scientifiques + boss de soutenance. **Ton** : comédie lucide et bienveillante, pas parodie de la recherche elle-même. **Public** : chercheuses/chercheurs, étudiantes/étudiants, grand public, partenaires de recherche.

**Non-négociables** : on contrôle un personnage à l'effigie d'Éric ; on bouge dans des espaces 3D lisibles ; le récit varie en fonction de nos décisions ; les problèmes méthodologiques sont authentiques ; les conséquences sont compréhensibles ; plusieurs échecs et fins sont possibles ; on peut recommencer ; la partie est enregistrée localement ; aucun compte ni collecte du contenu du jeu.

## 2. Placement et architecture
- Site visé : `ERJB-web/ERJB-web.github.io`, branche `main`.
- Intégrer une **nouvelle section immersive juste avant Contact**, après les contenus du parcours et les médias, et l'ouvrir également à partir d'un lien depuis le bandeau « Le parcours en chiffres » si souhaité. Ne pas casser le système préexistant de portes ni la navigation.
- Page dédiée : `/jeu/` (mode plein écran) ; aperçu visuel et bouton « Jouer » dans la page de présentation. Le jeu peut être lancé dans un nouvel onglet depuis la section pour éviter le conflit des touches et des modales du hall.
- Technologie cible : **Three.js / WebGL**, textures et modèles locaux, Web Audio minimal, HTML sémantique pour les choix et sous-titres, CSS responsive ; publication entièrement statique sur GitHub Pages.
- Les traductions de la section d'accès suivent les langues des sites. Les traductions intégrales de la fiction demandent une relecture humaine de locuteurs compétents, en particulier en innu-aimun et en inuktitut ; jamais afficher comme certifiée une traduction automatique non validée.
- Objectif de poids de chargement initial : < 5 Mo compressés ; chargement différé des actifs lourds. Option qualité adaptative ; sans WebGL, accès à l'histoire et aux choix en mode 2D.
- Fichiers : `jeu/index.html`, `assets/doctorat-game.css`, `assets/doctorat-game.js`, puis actifs `assets/jeu/` (modèles/sons) si leur réalisation et leurs licences sont validées.

## 3. Direction artistique 3D
**Univers** : « l'Académie des sujets impossibles », une ville-campus nocturne d'automne stylisée haut de gamme. Architecture institutionnelle néoclassique mêlée à du verre, à des halos néon cyan, à des interfaces holographiques et à des machines à café omniprésentes. Chaque zone traduit visuellement un problème scientifique.
- Cinématique d'introduction : porte monumentale, panneaux lumineux, journal « protocole rejeté pour la 4e fois », plongée caméra, première réplique du narrateur.
- Avatar : silhouette 3D avec vêtements proches du portrait, coiffure et barbe courtes ; photo d'Éric dans la carte d'identité du HUD ; finition du visage via sculpture 3D / rig facial sous réserve de disposer de bonnes références ; **ne pas prétendre** qu'une texture photographique plaquée équivaut à un avatar photoréaliste.
- Caméra suivie 3e personne, accélération et interpolation douces, déplacements ZQSD/WASD/flèches et joystick tactile, repères d'interaction, ombres de contact, matériaux PBR, profondeur par brouillard, atmosphère lumineuse, particules parcimonieuses.
- Décors distincts : campus, archives, comité, labo de données, atelier méthodologique, territoire/intersectorialité, comité éthique, salle de cours, congrès, bureau des reviewers, pré-soutenance, grand auditorium.
- UI diegétique : « horloge doctorale », épingles sur carnet de terrain, jauge de lucidité, fonds de dossier, notifications de direction, avertissements « RELECTEUR 2 ».
- Captures et bandeau du jeu à designer en cohérence avec le site ; pas d'emprunt d'actifs Assassin's Creed ni d'imitation de sa marque.

## 4. Synopsis en 3 actes et 12 chapitres
### ACTE I — L'idée est géniale (à 2 h 17 du matin)
1. **La rentrée des hypothèses** : orienter le sujet (réponse intersectorielle, réseaux de soutien, inégalités territoriales), distinguer population/phénomène/question. PNJ : *Le Sujet Gigantesque*, « Pourquoi ne pas aussi comparer 14 pays ? »
2. **Le donjon bibliographique** : sélectionner des preuves pertinentes, distinguer revue de portée, résultat empirique, source de vulgarisation, et repérer un sujet déjà traité. Embûche : l'article qui a déjà répondu à la question.
3. **Le tribunal de la direction** : présenter un angle défendable ; négociation des objectifs ; distinguer préférences du jury et vraie limite scientifique.
4. **Les serveurs du néant** : vérifier l'accès réel aux données, faisabilité et permissions ; plan B sans tricher.
### ACTE II — La méthode contre-attaque
5. **Le labyrinthe des méthodes** : aligner question, unité d'analyse et méthodes (personas, analyse de réseaux sociaux égocentrée, cartographie des ressources, atelier délibératif). Pièges : prétendre démontrer une causalité avec un devis inadéquat ; confondre offres de services et relations effectivement mobilisées.
6. **La carte n'est pas le territoire** : explorer deux territoires contrastés, construire des liens intersectoriels, ne pas présumer que disponibilité d'une ressource implique recours ; éviter l'erreur écologique.
7. **Le couloir de l'éthique** : consentement, confidentialité, données sensibles, recrutement et risques d'identification.
8. **Le semestre impossible** : véritable jeu d'allocation d'heures : enseignement, cours, terrain, revue, écriture, repos ; arbitrage qualité / fatigue / échéances.
### ACTE III — Publier, périr ou défendre
9. **Le congrès des badges qui coûtent cher** : défendre un résumé clair, préparer poster et présentation orale, distinguer constat et promesse.
10. **Reviewer 2 : le retour** : corriger surinterprétation, transparence méthodologique et limites, résister à la tentation de citer un article inventé.
11. **La pré-soutenance fantôme** : pitch de protocole, objections inattendues, reprendre un argument, lier chaque objectif à une donnée et à un livrable.
12. **Le grand oral** : boss à plusieurs phases (pertinence, faisabilité, méthodes, éthique, retombées), gestion d'endurance, arguments gagnés au long de la partie.

## 5. Embranchements concrets
Au chapitre 1, trois trajectoires de sujet :
- **Réseaux de réponse intersectorielle** : étudier les liens effectivement mobilisés autour de profils de besoins sociaux co-occurrents chez des personnes aînées à domicile ; approche SNA égocentrée.
- **Territoires et accès** : cartographier ressources et écarts territoriaux, sans assimiler disponibilité à utilisation ; articulation quantitative/spatiale et qualitative.
- **Conception de réponses avec les parties prenantes** : croiser profils, réseaux observés et ressources disponibles pour co-construire des recommandations contextualisées ; atelier délibératif.

Les trois voies se retrouvent autour de l'enjeu de la réponse intersectorielle en soins primaires, avec des informations, contraintes et dialogues différents. Le jeu doit récompenser les **reformulations nuancées** plutôt qu'imposer un « bon sujet » unique ; il doit explicitement rappeler que le projet réel évolue et que les scénarios sont fictifs.

### Variables persistantes
`temps` (semaines fictives restantes), `energie`, `rigueur`, `preuves`, `soutienDirection`, `stress`, `budget`, `choixSujet`, `methode`, `preuvesAcces`, `ethique`, `relectures`, `feedback`, `chapitre`.
- Un choix produit un commentaire explicatif, des changements de jauges, parfois un drapeau réutilisé 3 chapitres plus tard.
- Fausses solutions séduisantes : méthodes « toutes à la fois », données imaginaires, conclusions causales, collecte sans consentement, publication opportuniste.
- Choix coûteux mais scientifiquement honnêtes pouvant être gagnants.
- Au moins 3 stratégies de réussite, 5 causes de game over, 3 fins de soutenance et une fin cachée comique.
- Sauvegarde sur l'appareil, option Effacer / Rejouer ; aucun classement nominatif ni transfert de données du joueur.

## 6. Gameplay et épreuves réellement jouables
1. Exploration : approcher des stations / PNJ et interagir (E, clic, appui).
2. **Tri bibliographique** : sélectionner trois documents en fonction de leurs limites et de leur pertinence ; affichage explicite des justifications.
3. **Arbre de méthode** : associer des objectifs O1–O4 aux sources / méthodes ; validation scientifique et feedback.
4. **Cartographie de réseau** : relier acteurs, relations effectivement mobilisées et ressources seulement disponibles ; erreurs visuellement identifiées.
5. **Agenda de survie** : répartir 40 h/semaine, protéger du temps de récupération ; un agenda à 73 h ne vaut pas une méthode robuste.
6. **Congrès** : écrire / choisir un titre, résumer sans surpromesse, esquiver les questions du public.
7. **Peer review** : reformuler trois affirmations scientifiquement problématiques, traiter Reviewer 2 avec humour.
8. **Boss soutenance** : cinq rounds dont les attaques varient avec les erreurs passées ; possibilité de réponse argumentée, joker et défaite.

**Chaque épreuve** doit avoir consigne, critères, feedback pédagogique, risque, retour possible et une variante narrative.

## 7. Progression, difficulté et game over
- Introduction ~ 45 s ; partie normale visée 25–40 min ; chapitres de 2–5 min ; option « partie courte » plus tard.
- Mode découverte (moins de pénalités, indices), doctoral (normal), « Comité de 17 personnes » (difficile).
- Ressources plafonnées, fatigue ne se régénérant pas magiquement : repos donne de l'énergie mais consomme du temps.
- Défaites : épuisement, absence de données essentielles sans plan B, incident éthique majeur, protocole infaisable, soutenance insuffisamment préparée.
- Retour au dernier chapitre / recommencer campagne ; l'échec explique pourquoi et comment améliorer le protocole.
- Victoires graduées : **protocole accepté sans réserve**, **accepté sous conditions**, **soutenance honorable mais révision nécessaire**. Scène post-crédits : un courriel de Reviewer 2 arrive.

## 8. Ton, personnages, écriture
- **Éric** : personnage actif, intelligent, parfois trop ambitieux ; répliques d'autodérision, jamais de dévalorisation de la personne.
- **La Direction** : contradictoire et bienveillante ; change parfois d'avis, demande de la concision puis ajoute des objectifs.
- **Le Comité** : juge de la cohérence, pas simple antagoniste.
- **L'Archiviste** : monstre fait de PDFs mal nommés.
- **La Responsable des données** : « Le fichier existe. Le droit d'y accéder, c'est une autre discipline. »
- **Reviewer 2** : vrai mini-boss, apparaît aussi sur une affiche de congrès.
- **La Machine à café** : personnage qui vend le café au prix d'une ligne budgétaire.

Exemples de répliques :
- « Ton sujet tient en trois pages. Le titre. »
- « J'ai une hypothèse : si je rajoute une méthode, mon directeur dira oui. » — *Spoiler : non.*
- « Félicitations, vous avez trouvé une base de données. Elle contient 2011 et 2012. »
- « Nous avons lu votre résumé de 250 mots. Reviewer 2 en a proposé 1 400 autres. »
- « L'intersectorialité, c'est quand tout le monde s'accorde sur l'urgence d'organiser une autre réunion. »

Humour contextuel, pas de généralisation abusive sur chercheurs ou personnes concernées.

## 9. Pédagogie méthodologique et validité
Le jeu n'est pas une consultation méthodologique ni un enregistrement du protocole réel. Chaque épreuve doit enseigner un principe : pertinence de question, faisabilité, adéquation question/méthode, distinction entre besoins et ressources, lien effectivement mobilisé vs disponibilité, éthique, limites de l'inférence, négociation des objectifs, dissémination honnête.
- Dans le **projet fictif inspiré de la vraie recherche**, utiliser O1 profils/personas ; O2 SNA égocentrée des relations organisationnelles ; O3 cartographie spatiale ; O4 recommandations contextualisées en atelier délibératif, si ces éléments restent pertinents. Le thème, la condition traceuse et les territoires sont explicitement provisoires.
- Éviter de présenter la SNA ou les personas comme une réponse automatique : hypothèses, unité d'analyse, limites et collecte comptent.
- La soutenance évalue l'argumentation, **pas** des prétendues données empiriques du doctorat.
- Si plusieurs réponses scientifiquement acceptables existent, les accepter selon le raisonnement ; erreurs pédagogiques corrigibles.

## 10. Exigences UX, accessibilité et qualité
- Bureau : WebGL 3D, avatar et objectif toujours repérables ; clavier, souris, pause, son désactivable.
- Mobile : 3D optimisée, joystick tactile et bouton action, contrôles accessibles sans masquer le dialogue, portrait/paysage, performance calibrée.
- Adaptation `prefers-reduced-motion`, priorité aux claviers et lecteurs d'écran ; modes de contraste et jeu narratif 2D de secours ; sous-titres intégrals.
- Aucune dépendance obligatoire aux cookies ; sauvegarde locale optionnelle ; pas de permissions micro/caméra.
- Possibilité de sortir du jeu vers le contact sans perte des autres états du site.
- Responsive 360 px à 1920 px et tactile ; minimiser les effets 3D sur faibles GPU.
- Tester clavier, joystick, WebGL indisponible, mode économie d'énergie, navigation historique, changement de langue, rafraîchissement, sauvegarde corrompue.

## 11. Jalons et critères d'acceptation
**M0 — Conception** : présent document, trame à 12 chapitres, graphes de conséquences, critères scientifiques validés.
**M1 — Vertical slice jouable** : 3D procédurale mobile/desktop, avatar inspiré d'Éric, mouvement, 12 étapes de récit, trois branches, HUD, au moins trois types d'épreuves, game over et soutenance ; liens dans le site.
**M2 — Production visuelle** : assets 3D sur mesure (GLB/GLTF), rig/anims crédibles, portrait/avatar validé par Éric, décors sculptés, sound design, cinématiques.
**M3 — QA et finition** : localisation complète vérifiée par humain, audit accessibilité, profiling, tests multi-appareils, tests utilisateurs, équilibrage narratif.
**Sortie** : un jeu se terminant en une session sans erreur, jouable sans souris, 3 branches avec des conséquences observables, cinq types de défaites et des explications ; aucune promesse trompeuse sur la 3D AAA.

## 12. Registre des risques
| Risque | Mitigation |
|---|---|
| Photographie de visage non adaptée à un modèle 3D animé | Avatar stylisé fidèle + portrait HUD, production future du mesh facial via références validées |
| WebGL indisponible | Mode narratif 2D jouable |
| Fragilité du hall actuel | Page indépendante et section intégrée sans toucher au système de portes |
| Poids/temps de chargement | Chargement paresseux + assets procéduraux et qualité adaptative |
| Traductions des langues moins dotées | Maintenir une version de fiction source et indiquer honnêtement langues disponibles ; révision humaine avant publication complète |
| Trop de lecture et pas assez de jeu | Exploration et épreuves mécaniques en alternance ; dialogues courts et scénarisés |
| Déterminisme méthodologique | Accepter plusieurs solutions justifiées, feedback explicite et consultation scientifique avant diffusion |
| Présenter une vraie donnée/proposition comme approuvée | Bandeau « fiction pédagogique inspirée d'un projet évolutif » |

## 13. Définition de “digne d'un jeu moderne”
La comparaison au prestige visuel d'Assassin's Creed fixe **le niveau d'intention artistique**, mais pas un résultat photoréaliste garanti sur une page GitHub Pages. Pour s'en rapprocher réellement, il faut créer et intégrer des modèles 3D détaillés, animations mocap ou keyframe de qualité, éclairage cinématographique, PBR, environnements et sons originaux, et consacrer un cycle distinct aux performances et tests. Le vertical slice procède d'abord par décors générés et narration systémique. Il ne sera jamais présenté comme un rendu AAA fini.
