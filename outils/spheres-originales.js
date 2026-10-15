"use strict";
// Contenus originaux de l'édition publique : exemples fictifs, écrits pour Positron.
// Ce fichier ne lit aucun document pédagogique externe.
const donnees = [
  'parcours <- data.frame(',
  '  id = sprintf("P%02d", 1:16),',
  '  service = factor(rep(c("Accueil", "Accompagnement"), each = 8)),',
  '  age = c(28, 46, 35, 61, 52, 39, 67, 44, 31, 58, 42, 73, 49, 37, 65, 54),',
  '  delai = c(12, 18, 9, 25, 16, 21, 14, 28, 8, 11, 15, 7, 19, 13, 10, 17),',
  '  score_avant = c(6, 8, 5, 9, 7, 6, 8, 7, 5, 8, 6, 9, 7, 5, 8, 6),',
  '  score_apres = c(4, 6, 4, 7, 5, 5, 6, 4, 4, 5, 4, 6, 6, 3, 5, 4),',
  '  suivi = c(TRUE, TRUE, FALSE, TRUE, FALSE, TRUE, TRUE, FALSE,',
  '           TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE)',
  ')'
].join('\n');
const sujets = [
  {
    titre: 'Démarrer une analyse dans Positron',
    texte: 'Une analyse commence par un dossier de travail identifiable, pas par une succession de commandes oubliées dans la console. Installe R puis Positron, ouvre un dossier consacré à cet atelier et sélectionne une session R. Crée un fichier analyse.R. Le script conserve les instructions ; la console montre leur exécution ; le panneau des variables aide à examiner les objets. Ces trois vues ont des fonctions différentes. Les exemples de cet atelier utilisent uniquement des personnes et des situations inventées.',
    code: "print(R.version.string)\nprint(\"Dossier de projet : consulter getwd() dans votre session\")",
    consigne: 'Dans un nouveau script, crée un objet nommé objectif contenant la phrase « Décrire un délai d’accès ». Affiche cet objet puis les informations de version de R. Enregistre le script avant de fermer la session.',
    depart: '# Écrire ici un objectif explicite\nobjectif <- ""\n# Afficher objectif et R.version.string',
    solution: 'objectif <- "Décrire un délai d’accès"\nprint(objectif)\nprint(R.version.string)',
    interpretation: 'Un fichier enregistré permet de reprendre l’analyse dans une nouvelle session. Une console remplie ne remplace pas ce fichier. Il est normal que le numéro de version diffère entre deux appareils.'
  },
  {
    titre: 'Créer des objets et vérifier leurs types',
    texte: 'R distingue les nombres, les textes et les valeurs logiques. Une variable qualitative codée par un nombre ne devient pas pour autant une quantité mesurable : un identifiant ne se moyenne pas. L’affectation nom <- valeur crée un objet ; elle ne démontre rien sur la qualité de la mesure. Utilise des noms courts mais interprétables et vérifie le type avant une opération. Les vecteurs réunissent des valeurs d’un même type et les calculs peuvent agir sur toutes leurs composantes.',
    code: 'attentes <- c(7, 13, 16, 22, 27)\njours <- attentes / 7\nprint(jours)\nprint(typeof(attentes))\nprint(attentes > 15)',
    consigne: 'Cinq déplacements durent 18, 24, 31, 42 et 55 minutes. Crée le vecteur trajet puis un vecteur trajet_heures. Repère ensuite les déplacements de plus d’une demi-heure.',
    depart: 'trajet <- c(18, 24, 31, 42, 55)\n# Convertir en heures puis comparer à 30 minutes',
    solution: 'trajet <- c(18, 24, 31, 42, 55)\nprint(trajet / 60)\nprint(trajet > 30)',
    interpretation: 'Les résultats logiques gardent le même ordre que les observations. Convertir les unités avant de comparer évite des conclusions erronées.'
  },
  {
    titre: 'Construire une table et son dictionnaire',
    texte: 'Notre table fictive comporte seize personnes, deux modalités de service, un délai en jours et deux scores mesurés chez les mêmes personnes. Une ligne représente ici une personne, mais ce choix doit être vérifié dans toute nouvelle base : une table de consultations peut avoir plusieurs lignes par personne. Un dictionnaire décrit l’unité, les catégories possibles, les valeurs manquantes et le moment de mesure. Les différences entre services ci-dessous sont fabriquées et ne décrivent aucun organisme réel.',
    code: 'print(dim(parcours))\nprint(head(parcours, 4))\nstr(parcours)',
    consigne: 'Vérifie le nombre de lignes, l’unicité des identifiants et les catégories de service. Écris ce que représente une ligne avant d’interpréter une moyenne.',
    depart: '# parcours est préparé dans le script téléchargé\n# Utiliser nrow(), anyDuplicated() et levels()',
    solution: 'print(nrow(parcours))\nprint(anyDuplicated(parcours$id))\nprint(levels(parcours$service))',
    interpretation: 'Un résultat égal à zéro pour anyDuplicated indique qu’aucun identifiant n’est répété. Cela ne prouve pas que le recrutement est représentatif.'
  },
  {
    titre: 'Filtrer sans perdre le sens des dénominateurs',
    texte: 'Un filtre définit une population d’analyse. Conserve la condition dans le script et indique combien de lignes restent. Les opérateurs & et | combinent des conditions élément par élément ; les parenthèses rendent leur ordre lisible. Avec des valeurs manquantes, une comparaison peut elle-même produire NA. Retirer silencieusement ces lignes peut modifier la population étudiée. La variable suivi est logique ; un délai exprimé en jours reste numérique.',
    code: 'selection <- subset(parcours, age >= 50 & suivi)\nprint(selection[c("id", "age", "delai")])\nprint(nrow(selection))',
    consigne: 'Garde les personnes de moins de 50 ans dont le délai dépasse 14 jours. Affiche les identifiants et le nombre de personnes retenues.',
    depart: '# Construire une condition combinant age et delai\nselection <- parcours[FALSE, ]',
    solution: 'selection <- subset(parcours, age < 50 & delai > 14)\nprint(selection$id)\nprint(nrow(selection))',
    interpretation: 'Le résultat concerne le sous-groupe filtré. Son effectif ne doit pas être utilisé comme dénominateur d’une proportion portant sur l’ensemble des seize personnes.'
  },
  {
    titre: 'Importer, exporter et contrôler un CSV',
    texte: 'Le nom du fichier ne suffit pas à connaître son contenu. Après l’importation, examine le séparateur, le codage des caractères, le séparateur décimal et les types inférés. L’exemple crée d’abord un fichier fictif dans le dossier temporaire pour rester reproductible sur tout appareil ; pour un projet réel, garde les données brutes dans un sous-dossier dédié et utilise un chemin relatif au dossier ouvert dans Positron. N’écrase pas ton fichier source en exportant une table nettoyée.',
    code: 'fichier <- file.path(tempdir(), "atelier_acces_fictif.csv")\nwrite.csv(parcours, fichier, row.names = FALSE, fileEncoding = "UTF-8")\ncopie <- read.csv(fichier, stringsAsFactors = FALSE)\nprint(dim(copie))\nprint(names(copie))',
    consigne: 'Exporte seulement id, service et delai dans un autre CSV temporaire. Réimporte ce fichier et vérifie qu’il contient seize lignes et trois colonnes.',
    depart: 'fichier <- file.path(tempdir(), "delais_selection.csv")\n# Exporter trois colonnes, puis les relire',
    solution: 'fichier <- file.path(tempdir(), "delais_selection.csv")\nwrite.csv(parcours[c("id", "service", "delai")], fichier, row.names = FALSE)\nverification <- read.csv(fichier)\nprint(dim(verification))',
    interpretation: 'Un contrôle de dimensions détecte certaines erreurs d’importation, pas toutes. Vérifie aussi les unités, les catégories et quelques observations.'
  },
  {
    titre: 'Gérer les valeurs manquantes et les conditions',
    texte: 'NA signifie qu’une valeur manque ; ce n’est ni zéro ni une catégorie ordinaire. La moyenne avec na.rm = TRUE répond à une question portant sur les valeurs observées. Elle ne corrige pas un mécanisme de non-réponse. Documente le nombre de valeurs exclues et demande-toi si leur absence peut dépendre du délai, du service ou d’autres caractéristiques. Une condition sert aussi à rendre les contrôles explicites plutôt qu’à masquer un problème.',
    code: 'delai_incomplet <- parcours$delai\ndelai_incomplet[c(3, 11)] <- NA\nprint(sum(is.na(delai_incomplet)))\nprint(mean(delai_incomplet, na.rm = TRUE))',
    consigne: 'Ajoute une valeur manquante à un vecteur de scores. Calcule séparément le nombre de scores observés et leur médiane. Ne remplace pas automatiquement la valeur manquante par zéro.',
    depart: 'scores <- c(4, 7, NA, 6, 9, 5)\n# Compter les observations disponibles et résumer ces observations',
    solution: 'scores <- c(4, 7, NA, 6, 9, 5)\nprint(sum(!is.na(scores)))\nprint(median(scores, na.rm = TRUE))',
    interpretation: 'Le nombre de valeurs disponibles doit accompagner le résumé. Une imputation demanderait des hypothèses supplémentaires.'
  },
  {
    titre: 'Décrire une distribution avant de la modéliser',
    texte: 'Une moyenne décrit un centre ; elle ne montre ni l’étendue des observations ni leur asymétrie. Compare moyenne, médiane, quartiles et écart type. Les jours d’attente ne peuvent pas être négatifs et une longue attente peut avoir un poids important dans la moyenne. Ne confonds pas l’écart type des personnes avec l’erreur standard d’une moyenne estimée. Les résumés doivent toujours préciser la variable, son unité et le nombre d’observations.',
    code: 'print(c(moyenne = mean(parcours$delai), mediane = median(parcours$delai), ecart_type = sd(parcours$delai)))\nprint(quantile(parcours$delai, c(.25, .75)))',
    consigne: 'Calcule les mêmes résumés pour l’âge. Compare l’unité des résultats et explique pourquoi un écart type en années ne se compare pas directement à un écart type en jours.',
    depart: '# Résumer parcours$age avec mean(), median(), sd() et quantile()',
    solution: 'print(c(moyenne = mean(parcours$age), mediane = median(parcours$age), ecart_type = sd(parcours$age)))\nprint(quantile(parcours$age, c(.25, .75)))',
    interpretation: 'Un changement d’unité modifie la valeur numérique de l’écart type. Il ne modifie pas à lui seul la variabilité relative ni la qualité des mesures.'
  },
  {
    titre: 'Résumer par groupe et contrôler les effectifs',
    texte: 'Une comparaison de groupes commence par leurs effectifs et leurs distributions. aggregate() permet ici de calculer le même indicateur pour chaque service. Une différence descriptive ne démontre pas un effet du service : les personnes accueillies peuvent différer avant toute intervention. Évite de comparer des moyennes dont les dénominateurs ou les périodes de mesure ne sont pas les mêmes.',
    code: 'print(table(parcours$service))\nprint(aggregate(delai ~ service, parcours, mean))',
    consigne: 'Calcule la médiane du délai pour chaque service, puis le nombre de personnes avec un suivi dans chaque service.',
    depart: '# aggregate() pour la médiane ; table() pour le croisement',
    solution: 'print(aggregate(delai ~ service, parcours, median))\nprint(with(parcours, table(service, suivi)))',
    interpretation: 'Une table de comptage et une table de résumés ne décrivent pas la même chose. Indique laquelle tu présentes et garde les catégories même lorsqu’un effectif est nul.'
  },
  {
    titre: 'Construire une figure qui répond à une question',
    texte: 'Choisis une figure selon la question : distribution d’une variable, comparaison de groupes ou association de deux mesures. Les étiquettes doivent montrer les unités ; le titre ne doit pas transformer une association descriptive en conclusion causale. Dans Positron, le panneau des graphiques permet d’examiner la figure produite par R. Un graphique accessible utilise aussi des formes, des libellés et un contraste suffisant plutôt que la couleur seule.',
    code: 'boxplot(delai ~ service, data = parcours, ylab = "Délai en jours", xlab = "Service fictif", col = c("#B7D7D0", "#C5D7EB"))\nprint(aggregate(delai ~ service, parcours, median))',
    consigne: 'Produis un nuage de points reliant âge et délai. Ajoute les unités aux deux axes. Écris une phrase descriptive qui ne parle pas d’un effet causal.',
    depart: '# plot(x, y, xlab = ..., ylab = ...)\n# Les points représentent des observations fictives',
    solution: 'plot(parcours$age, parcours$delai, xlab = "Âge en années", ylab = "Délai en jours", pch = 19, col = "#286D5C")\nprint(cor(parcours$age, parcours$delai))',
    interpretation: 'La forme du nuage et la corrélation décrivent une association dans cet exemple. Elles ne permettent pas de conclure que l’âge cause une variation du délai.'
  },
  {
    titre: 'Relier deux tables avec une clé explicite',
    texte: 'Une jointure associe des lignes à partir d’une clé, pas à partir de leur position dans les fichiers. Vérifie l’unicité de la clé dans chaque table et l’effectif après la jointure. Une relation plusieurs-à-plusieurs peut multiplier les lignes sans avertissement suffisant pour l’analyse. L’exemple ajoute une caractéristique fictive de service à une table de personnes : plusieurs personnes peuvent partager le même service, mais chaque service ne doit avoir qu’une ligne de référence.',
    code: 'organisation <- data.frame(service = c("Accueil", "Accompagnement"), secteur = c("Nord", "Sud"))\nrelie <- merge(parcours, organisation, by = "service", all.x = TRUE, sort = FALSE)\nprint(table(relie$secteur))\nprint(nrow(relie))',
    consigne: 'Crée une table contenant seulement P01, P02 et P03 avec une colonne contact. Fais une jointure qui conserve toutes les personnes et compte les contacts manquants.',
    depart: 'contacts <- data.frame(id = c("P01", "P02", "P03"), contact = c("tel", "tel", "courriel"))\n# Joindre sur id et conserver les 16 personnes',
    solution: 'contacts <- data.frame(id = c("P01", "P02", "P03"), contact = c("tel", "tel", "courriel"))\nrelie <- merge(parcours, contacts, by = "id", all.x = TRUE)\nprint(nrow(relie))\nprint(sum(is.na(relie$contact)))',
    interpretation: 'Une absence de correspondance n’est pas nécessairement une absence de contact dans la réalité. Elle peut provenir du périmètre du fichier ou d’une clé mal saisie.'
  },
  {
    titre: 'Écrire une transformation lisible avec le pipe',
    texte: 'Une chaîne de transformations est plus facile à contrôler lorsque chaque étape fait une seule opération interprétable. Le pipe natif |> transmet le résultat à l’étape suivante. Le paquet dplyr propose notamment filter(), mutate(), group_by() et summarise(). Leur usage est facultatif : le langage R de base permet aussi d’effectuer ces opérations. Si tu ajoutes un paquet, documente son nom et sa version ; n’installe pas une dépendance sans comprendre son rôle.',
    code: 'if (requireNamespace("dplyr", quietly = TRUE)) {\n  resultat <- parcours |> dplyr::group_by(service) |> dplyr::summarise(n = dplyr::n(), delai_moyen = mean(delai), .groups = "drop")\n} else {\n  resultat <- aggregate(delai ~ service, parcours, mean)\n}\nprint(resultat)',
    consigne: 'Filtre les délais inférieurs ou égaux à 14 jours et calcule leur moyenne. Écris d’abord une version en R de base ; une seconde version avec dplyr est possible si ce paquet est installé.',
    depart: '# Une solution sans paquet supplémentaire suffit\n# Identifier les délais <= 14 puis calculer leur moyenne',
    solution: 'delais_courts <- subset(parcours, delai <= 14)\nprint(mean(delais_courts$delai))\nprint(nrow(delais_courts))',
    interpretation: 'La lisibilité d’un pipeline ne remplace pas les contrôles. Vérifie les effectifs à chaque filtre et conserve une définition claire des nouvelles variables.'
  },
  {
    titre: 'Créer une fonction et répéter un calcul',
    texte: 'Une fonction évite de réécrire un calcul à plusieurs endroits. Son nom, ses arguments et sa valeur de retour doivent rester compréhensibles. Pour répéter une opération, une boucle ou vapply() peut convenir ; vapply() impose en plus le type de la réponse attendue. Teste d’abord la fonction sur un petit exemple connu. Une fonction courte dont les hypothèses sont explicites vaut mieux qu’une automatisation opaque.',
    code: 'etendue <- function(x) { max(x, na.rm = TRUE) - min(x, na.rm = TRUE) }\nprint(etendue(c(5, 11, 18)))\nprint(vapply(parcours[c("age", "delai")], etendue, numeric(1)))',
    consigne: 'Écris une fonction proportion_courte(x) qui renvoie la proportion de délais inférieurs ou égaux à 14 jours parmi les valeurs observées. Applique-la au vecteur des délais.',
    depart: 'proportion_courte <- function(x) {\n  # Compléter le calcul sans traiter NA comme zéro\n}\n',
    solution: 'proportion_courte <- function(x) mean(x <= 14, na.rm = TRUE)\nprint(proportion_courte(parcours$delai))',
    interpretation: 'La fonction renvoie une proportion entre zéro et un. Multiplier par cent donne un pourcentage, pas un effectif.'
  },
  {
    titre: 'Simuler pour comprendre l’échantillonnage',
    texte: 'Une simulation aide à examiner le comportement d’une méthode lorsque l’on connaît le mécanisme de génération. Elle ne crée pas de données empiriques sur un service réel. Fixer une graine rend une suite de tirages reproductible dans un environnement donné. La distribution des moyennes simulées n’est pas la distribution des observations individuelles : cette distinction explique le rôle de l’erreur standard.',
    code: 'set.seed(7319)\nmoyennes <- replicate(1500, mean(rnorm(36, mean = 17, sd = 6)))\nprint(round(c(centre = mean(moyennes), dispersion = sd(moyennes)), 3))\nprint(6 / sqrt(36))',
    consigne: 'Refais la simulation avec des échantillons de 144 observations. Compare l’écart type des moyennes à celui obtenu avec 36 observations.',
    depart: 'set.seed(7319)\n# replicate(1500, mean(rnorm(...)))\n# Comparer les dispersions des moyennes',
    solution: 'set.seed(7319)\na <- replicate(1500, mean(rnorm(36, 17, 6)))\nb <- replicate(1500, mean(rnorm(144, 17, 6)))\nprint(round(c(n36 = sd(a), n144 = sd(b)), 3))',
    interpretation: 'Multiplier l’effectif par quatre divise l’erreur standard théorique par deux, si les observations sont indépendantes et de même variance. Cela ne corrige ni la sélection ni un biais de mesure.'
  },
  {
    titre: 'Estimer une moyenne avec son incertitude',
    texte: 'Une estimation ponctuelle doit être accompagnée de sa population cible, de son unité et de son incertitude. t.test() fournit notamment une moyenne et un intervalle de confiance selon le modèle utilisé. Le niveau de confiance décrit une propriété de la procédure sur des répétitions d’échantillonnage ; il ne donne pas la probabilité que le paramètre fixe se trouve dans un intervalle déjà calculé. Dans notre petit exemple fictif, les hypothèses doivent rester visibles.',
    code: 'estimation <- t.test(parcours$delai)\nprint(estimation$estimate)\nprint(estimation$conf.int)',
    consigne: 'Calcule un intervalle à 90 % pour la moyenne du délai. Compare sa largeur à celle de l’intervalle à 95 %, avec les mêmes observations.',
    depart: '# t.test(..., conf.level = .90)\n# diff() calcule la largeur d’un intervalle',
    solution: 'ic90 <- t.test(parcours$delai, conf.level = .90)$conf.int\nic95 <- t.test(parcours$delai, conf.level = .95)$conf.int\nprint(ic90)\nprint(c(largeur90 = diff(ic90), largeur95 = diff(ic95)))',
    interpretation: 'Un niveau de confiance plus élevé conduit ici à un intervalle plus large. Une plus grande précision ne garantit pas une meilleure validité du recrutement ou de la mesure.'
  },
  {
    titre: 'Choisir une comparaison adaptée aux observations',
    texte: 'Avant un test, identifie l’unité d’observation et la dépendance éventuelle. Deux services accueillant des personnes différentes relèvent d’une comparaison entre groupes indépendants. Deux scores d’une même personne demandent au contraire de conserver l’appariement. Le test de Welch évite d’imposer l’égalité des variances pour deux groupes indépendants. Un résultat avant-après sans groupe de comparaison ne permet pas d’attribuer le changement au service.',
    code: 'comparaison <- t.test(delai ~ service, data = parcours)\nprint(comparaison$estimate)\nprint(comparaison$conf.int)\nprint(comparaison$p.value)',
    consigne: 'Compare score_avant et score_apres en respectant l’appariement. Affiche la différence moyenne avant moins après et son intervalle de confiance.',
    depart: '# Les deux colonnes décrivent les mêmes personnes\n# Utiliser paired = TRUE',
    solution: 'resultat <- t.test(parcours$score_avant, parcours$score_apres, paired = TRUE)\nprint(resultat$estimate)\nprint(resultat$conf.int)',
    interpretation: 'La différence indique un changement observé. Sans contrefactuel crédible, elle ne mesure pas à elle seule l’effet causal d’un accompagnement.'
  },
  {
    titre: 'Ajuster une régression et examiner ses limites',
    texte: 'Une régression relie une variable à une ou plusieurs autres sous des hypothèses explicites. Le coefficient d’un âge en années représente ici une variation moyenne du délai par année, conditionnellement aux variables incluses. L’ajustement n’efface pas automatiquement les biais et ne garantit pas une interprétation causale. Regarde la distribution des résidus, les observations influentes, les unités et la précision des coefficients.',
    code: 'modele <- lm(delai ~ age + service, data = parcours)\nprint(round(coef(modele), 3))\nprint(round(confint(modele), 3))',
    consigne: 'Ajuste un modèle avec l’âge seul puis ajoute le service. Compare les deux coefficients de l’âge sans conclure automatiquement qu’un changement prouve une confusion.',
    depart: '# lm(delai ~ age, ...)\n# lm(delai ~ age + service, ...)',
    solution: 'simple <- lm(delai ~ age, data = parcours)\najuste <- lm(delai ~ age + service, data = parcours)\nprint(c(simple = coef(simple)["age"], ajuste = coef(ajuste)["age"]))',
    interpretation: 'Un changement de coefficient doit être discuté avec les hypothèses causales et les caractéristiques des variables. Le seul critère numérique ne décide pas du jeu d’ajustement.'
  },
  {
    titre: 'Analyser un tableau de comptes',
    texte: 'Un tableau croisé contient des effectifs, pas automatiquement des pourcentages. Pour un khi-deux d’indépendance, inspecte les effectifs attendus et l’indépendance des observations. Un petit tableau peu rempli peut justifier un test exact de Fisher plutôt qu’une approximation asymptotique. La p-valeur ne décrit ni la taille de l’association ni son intérêt pratique ; présente aussi les proportions et leur dénominateur.',
    code: 'effectifs <- matrix(c(24, 56, 15, 65), nrow = 2, byrow = TRUE)\ndimnames(effectifs) <- list(groupe = c("Avec appui", "Sans appui"), issue = c("Oui", "Non"))\nprint(prop.table(effectifs, 1))\nprint(chisq.test(effectifs, correct = FALSE)$expected)',
    consigne: 'Pour le tableau fictif de l’exemple, calcule le ratio des proportions de l’issue puis réalise un test de Fisher. Donne séparément la mesure d’association et la p-valeur.',
    depart: 'effectifs <- matrix(c(24, 56, 15, 65), nrow = 2, byrow = TRUE)\n# Chaque ligne contient 80 observations',
    solution: 'effectifs <- matrix(c(24, 56, 15, 65), nrow = 2, byrow = TRUE)\nrisques <- effectifs[, 1] / rowSums(effectifs)\nprint(risques[1] / risques[2])\nprint(fisher.test(effectifs)$p.value)',
    interpretation: 'Le ratio compare deux proportions fictives. Le test exact ne transforme pas ces observations en essai randomisé et ne résout pas les biais de sélection.'
  },
  {
    titre: 'Documenter et partager une analyse reproductible',
    texte: 'Un rapport utile relie la question, les choix de traitement, les résultats et leurs limites. Un document Quarto peut réunir texte, code R et figures ; sa production nécessite Quarto en plus de R. Dans Positron, garde le document et les scripts dans le même projet. Décris les données fictives, les dépendances et les décisions de nettoyage. Avant de partager, vérifie qu’aucune donnée personnelle, clé d’accès ou chemin privé n’apparaît dans les sorties.',
    code: 'trace <- list(effectif = nrow(parcours), variables = names(parcours), version_R = R.version.string)\nprint(trace)\nprint(round(aggregate(delai ~ service, parcours, mean)$delai, 2))',
    consigne: 'Prépare une table de résultats par service avec l’effectif et le délai moyen. Donne aux colonnes des noms explicites avant une éventuelle exportation.',
    depart: '# Préparer un tableau de résultats, pas un fichier nominatif\n# aggregate(), table() et merge() peuvent être utilisés',
    solution: 'resultats <- aggregate(delai ~ service, parcours, mean)\nn <- as.data.frame(table(parcours$service))\nnames(n) <- c("service", "effectif")\nprint(merge(resultats, n, by = "service"))',
    interpretation: 'Les résultats agrégés restent à discuter selon la taille des groupes et le risque de réidentification dans un projet réel. La reproductibilité technique ne suffit pas à autoriser une diffusion.'
  },
  {
    titre: 'Vérifier un script avec ou sans assistance IA',
    texte: 'Une proposition de code peut être utile et pourtant fausse. Avant de l’exécuter, vérifie les fonctions appelées, les fichiers modifiés, les dépendances et les hypothèses statistiques. Une assistance IA dans Positron ne doit recevoir que des informations compatibles avec les règles d’accès aux données. Compare ses résultats à un petit calcul manuel et utilise des assertions. Tu restes responsable du choix de la méthode et de l’interprétation.',
    code: 'stopifnot(nrow(parcours) == 16)\nstopifnot(!anyDuplicated(parcours$id))\nstopifnot(all(parcours$delai >= 0))\nprint("Contrôles élémentaires réussis")',
    consigne: 'Écris un contrôle qui vérifie que les scores sont compris entre zéro et dix. Explique pourquoi ce contrôle de plage ne prouve pas que les scores mesurent correctement le phénomène étudié.',
    depart: '# stopifnot() interrompt le script si une condition est fausse',
    solution: 'stopifnot(all(parcours$score_avant >= 0 & parcours$score_avant <= 10))\nstopifnot(all(parcours$score_apres >= 0 & parcours$score_apres <= 10))\nprint("Plages des scores vérifiées")',
    interpretation: 'Un script peut être techniquement cohérent et scientifiquement mal posé. Les assertions contrôlent certaines propriétés des objets, pas la validité d’un concept ou d’un raisonnement causal.'
  },
  {
    titre: 'Mener un mini-projet du début à la discussion',
    texte: 'Question fictive : comment les délais se distribuent-ils dans deux modalités d’accueil ? Définis d’abord la population et les variables, contrôle les données, décris chaque groupe puis formule une conclusion proportionnée. Le mini-projet assemble les commandes précédentes sans présenter l’exemple comme une étude réelle. Le résultat attendu est un raisonnement documenté, pas une succession de p-valeurs.',
    code: 'resume <- aggregate(delai ~ service, parcours, function(x) c(n = length(x), moyenne = mean(x), mediane = median(x)))\nprint(resume)\nprint(t.test(delai ~ service, parcours)$conf.int)',
    consigne: 'Rédige quatre phrases : une sur les données, une sur les résultats descriptifs, une sur l’incertitude et une sur les limites. Vérifie tes valeurs dans le tableau avant de les citer.',
    depart: '# Repartir du script fictif plutôt que copier une interprétation\n# Écrire une conclusion descriptive, sans allégation causale',
    solution: 'print(aggregate(delai ~ service, parcours, mean))\nprint(t.test(delai ~ service, parcours)$conf.int)\nmessage("Discussion : données fictives, petit effectif, absence de randomisation")',
    interpretation: 'Une analyse aboutie peut conclure que les données ne suffisent pas. La qualité tient à la correspondance entre la question, le devis, la mesure et la portée réelle des résultats.'
  }
];

const texte = t => ({genre:'texte',texte:t});
const exemple = (titre,t) => ({genre:'exemple',titre,texte:t});
const attention = t => ({genre:'attention',texte:t});
const question = (t,r) => ({genre:'question',texte:t,reponse:r});
const chapitre = (numero,titre,objectifs,parties,resume) => ({chapitre:numero,titre,objectifs,parties:parties.map((p,i)=>({id:'c'+String(numero).padStart(2,'0')+'-p'+String(i+1).padStart(2,'0'),titre:p[0],section:p[0],blocs:p.slice(1)})),resume,horsProgramme:false});
const nouveauxChapitres = [
 chapitre(25,'Échantillonner et quantifier la précision',[
  'Distinguer population cible, population accessible et échantillon analysé.',
  'Relier la distribution normale, la distribution des moyennes et l’erreur standard.',
  'Interpréter une estimation ponctuelle et un intervalle sans confondre précision et validité.'
 ],[
  ['De qui parle-t-on ?',texte('Une enquête n’observe généralement qu’une partie de la population visée. Le cadre d’échantillonnage délimite les unités accessibles ; le recrutement et les réponses déterminent ensuite les unités analysées. Décrire ces étapes permet de distinguer le hasard d’échantillonnage des erreurs de couverture, de non-réponse et de mesure. Un grand effectif ne rend pas représentatif un recrutement très sélectif.'),exemple('Trois périmètres distincts','Un territoire fictif compte 8 400 personnes éligibles. Une liste de contact en recense 6 900 ; un tirage invite 520 personnes et 364 répondent. Le taux de réponse parmi les personnes invitées vaut 364 / 520 = 70 %. Il ne vaut ni 364 / 8 400 ni 364 / 6 900.'),question('Le taux de réponse de 70 % suffit-il à écarter un biais de non-réponse ?','Non. Il faut notamment examiner ce qui distingue les personnes répondantes et non répondantes pour les variables pertinentes.')],
  ['Distribution normale et moyennes répétées',texte('Une distribution normale est décrite par une moyenne et un écart type. Une variable individuelle n’a pas besoin d’être parfaitement normale pour qu’une moyenne ait une distribution approximativement normale sous des conditions adaptées. La taille requise dépend de l’asymétrie, des valeurs extrêmes et de la dépendance. La règle mécanique « trente observations suffisent » ne remplace pas cet examen.'),exemple('Une erreur standard calculable','Dans un exemple de mesures indépendantes, un écart type de 12 et un effectif de 144 donnent une erreur standard estimée de 12 / racine(144) = 1. Avec 36 observations, elle vaut 2. Cette relation suppose une variance comparable et n’intègre pas automatiquement un effet de grappe.'),attention('L’écart type décrit la dispersion des observations. L’erreur standard décrit la dispersion d’un estimateur sur des échantillons répétés.')],
  ['Intervalle et couverture',texte('L’intervalle de confiance résulte d’une procédure et de ses hypothèses. À 95 %, la couverture annoncée concerne des répétitions de cette procédure, si le modèle et l’échantillonnage conviennent. Un intervalle étroit peut rester centré sur une valeur biaisée. Pour une moyenne avec variance inconnue, l’intervalle de Student utilise la moyenne, l’erreur standard et un quantile de Student.'),exemple('Interpréter avec l’unité','Pour une moyenne fictive de 42 jours, un écart type de 12 et 144 observations indépendantes, le quantile de Student à 143 degrés de liberté est proche de 1,977. L’intervalle à 95 % est donc environ [40,02 ; 43,98] jours. Il décrit la moyenne sous les hypothèses du modèle, pas l’étendue de 95 % des délais individuels.'),{genre:'code',code:'n <- 144\nmoyenne <- 42\ns <- 12\nmarge <- qt(.975, df = n - 1) * s / sqrt(n)\nprint(moyenne + c(-1, 1) * marge)'},question('Peut-on interpréter cet intervalle comme contenant 95 % des personnes ?','Non. Il concerne une moyenne de population, pas un intervalle de référence pour les valeurs individuelles.')],
  ['Observer la répétition dans R',texte('Une simulation permet de séparer l’idée d’une moyenne ponctuelle de celle d’une distribution d’estimations. Elle doit être annoncée comme telle et ses paramètres doivent figurer dans le script.'),{genre:'code',code:'set.seed(6921)\nm <- replicate(2000, mean(rnorm(64, 23, 8)))\nprint(c(moyenne_des_moyennes = mean(m), erreur_standard = sd(m)))\nprint(8 / sqrt(64))'},attention('Des tirages indépendants dans une simulation ne démontrent pas l’indépendance d’observations réelles. En présence de grappes ou de pondérations, la variance doit tenir compte du plan.')]
 ],['Définir le périmètre de l’inférence avant de calculer.','Distinguer dispersion des personnes et précision d’un estimateur.','Présenter ensemble estimation, unité, incertitude et principales limites.']),
 chapitre(26,'Comparer des moyennes et des proportions',[
  'Choisir entre comparaison indépendante, comparaison appariée et comparaison de plusieurs groupes.',
  'Relier tests de Welch, analyse de variance, khi-deux et test exact à leurs hypothèses.',
  'Présenter une taille de différence ou d’association avec son incertitude.'
 ],[
  ['Commencer par le devis',texte('Le choix d’un test dépend d’abord de la structure des observations. Deux mesures d’une même personne ne sont pas indépendantes. Des personnes incluses dans un même établissement peuvent aussi se ressembler. Énonce la population, la variable, l’unité et le contraste avant de choisir une commande. Le test de Welch est une option usuelle pour deux moyennes indépendantes lorsque l’égalité des variances n’est pas imposée.'),exemple('Deux groupes fictifs','Des durées fictives valent 14, 17, 19, 22, 25 et 29 jours dans un groupe, contre 10, 13, 15, 18, 20 et 24 dans un autre. Les moyennes valent 21 et 16,667 jours, soit une différence d’environ 4,333 jours. Une conclusion doit aussi présenter l’incertitude de cette différence.'),{genre:'code',code:'a <- c(14,17,19,22,25,29)\nb <- c(10,13,15,18,20,24)\nr <- t.test(a,b)\nprint(r$estimate)\nprint(r$conf.int)\nprint(r$p.value)'}],
  ['Respecter un appariement',texte('Une comparaison appariée porte sur les différences à l’intérieur des paires. L’appariement doit provenir du devis, et non d’un rapprochement arbitraire de lignes. Pour un test de Student apparié, l’hypothèse de normalité pertinente concerne les différences. Une analyse avant-après sans contrôle reste exposée à l’évolution naturelle, aux changements concomitants et à la régression vers la moyenne.'),{genre:'code',code:'avant <- c(18,22,17,25,20,24,19,23)\napres <- c(15,19,16,20,17,22,15,20)\nprint(t.test(avant,apres,paired=TRUE)$conf.int)'},question('L’option paired = TRUE crée-t-elle un appariement valide ?','Non. Elle indique au logiciel d’utiliser les paires déjà définies par la collecte. Il faut conserver leur alignement et justifier leur sens.')],
  ['Plus de deux groupes',texte('Une analyse de variance examine l’hypothèse d’égalité de plusieurs moyennes. Un test global peut signaler qu’au moins une moyenne diffère sans identifier toutes les paires concernées. Examine les résidus, la structure des variances et l’indépendance ; des comparaisons multiples prévues ou exploratoires nécessitent une stratégie explicite. Un modèle linéaire permet de représenter ce même contraste par des variables indicatrices.'),{genre:'code',code:'d <- data.frame(groupe=factor(rep(c("A","B","C"),each=5)),temps=c(10,13,15,14,18,16,19,21,18,23,20,22,25,24,27))\nprint(summary(aov(temps~groupe,data=d)))'},attention('Multiplier les tests sans plan augmente la probabilité de résultats fortuits. Sépare les analyses prévues des explorations.')],
  ['Comparer des distributions catégorielles',texte('Le khi-deux d’indépendance compare des effectifs observés à des effectifs attendus sous l’hypothèse d’indépendance. Son approximation dépend de la structure du tableau. Pour un tableau 2 × 2 peu rempli, Fisher fournit une alternative exacte conditionnelle. Aucun de ces tests ne remplace la présentation des risques, différences de proportions ou rapports pertinents pour le devis.'),exemple('Effectifs puis proportions','Dans deux groupes fictifs de 90 personnes, on observe 27 puis 18 issues positives. Les proportions valent 30 % et 20 %. La différence est de 10 points de pourcentage et leur ratio vaut 1,5. Ces deux mesures décrivent des aspects différents du contraste.'),{genre:'code',code:'tab <- matrix(c(27,63,18,72),nrow=2,byrow=TRUE)\nprint(prop.table(tab,1))\nprint(chisq.test(tab,correct=FALSE)$expected)\nprint(fisher.test(tab)$p.value)'},question('Un test non significatif démontre-t-il l’égalité des deux proportions ?','Non. Il peut refléter une différence faible, une incertitude importante ou les deux. Une conclusion d’équivalence demande une marge et une méthode adaptées.')]
 ],['Choisir une méthode à partir du devis et de l’unité d’observation.','Un résultat global ne décrit pas toutes les différences entre groupes.','Ne pas remplacer les tailles d’effet par une étiquette significatif/non significatif.']),
 chapitre(27,'Lire un résultat quantitatif avec esprit critique',[
  'Distinguer quantité estimée, erreur aléatoire et biais.',
  'Interpréter une p-valeur sans la transformer en probabilité de vérité.',
  'Discuter corrélation, régression et résultats catégoriels dans un texte autonome.'
 ],[
  ['Identifier ce qui a été estimé',texte('Une lecture critique commence par la question : quelle population, quelle exposition ou intervention, quel comparateur et quelle issue ? Vérifie ensuite le devis, le recrutement et les mesures. Une différence de moyennes, un rapport de risques et un odds ratio ne s’interprètent pas de la même manière. Les résultats d’un exemple fictif ne doivent pas être présentés comme des données probantes sur la santé.'),exemple('Un résultat fictif à discuter','Une analyse inventée rapporte une différence ajustée de −3,2 jours, avec un intervalle à 95 % de [−6,1 ; −0,3]. Sous les hypothèses du modèle, les données sont compatibles avec une réduction moyenne comprise approximativement entre 0,3 et 6,1 jours. La portée causale dépend du devis et des hypothèses d’ajustement.'),attention('Un intervalle qui exclut zéro ne démontre ni l’absence de biais ni l’importance pratique de la différence.')],
  ['Lire la p-valeur sans raccourci',texte('Une p-valeur évalue la compatibilité des données avec une hypothèse nulle dans un modèle donné, au moyen d’une statistique de test. Elle n’est pas la probabilité que cette hypothèse soit vraie. Elle ne mesure pas non plus la taille de la différence. Demande-toi si l’analyse a été définie avant de regarder les résultats, combien de comparaisons ont été explorées et si toutes sont rapportées.'),question('Que manque-t-il à la phrase « le résultat est significatif » ?','La quantité comparée, sa valeur et son unité, l’incertitude, la méthode, le devis et les limites. Une conclusion ne peut pas être réduite au franchissement d’un seuil.')],
  ['Corrélation et régression',texte('La corrélation résume une association linéaire standardisée ; elle ne représente pas une pente en unités originales. Une régression peut ajuster un contraste sur des variables mesurées, mais le choix de ces variables doit être justifié. Ajuster sur une conséquence de l’exposition ou sur un collisionneur peut produire un biais. Un modèle prédictif performant ne justifie pas, à lui seul, une décision causale.'),exemple('Distinguer les tâches','Prévoir le délai d’une prochaine personne et estimer l’effet d’un changement d’organisation sont deux objectifs différents. Le premier privilégie une validation prédictive adaptée ; le second demande notamment de définir un contraste causal et de discuter les mécanismes de confusion.')],
  ['Rédiger une discussion proportionnée',texte('Une discussion utile énonce ce que le résultat apporte, les conditions de sa validité et ce qu’il ne permet pas de conclure. Précise les données manquantes, l’incertitude et les limites de transportabilité vers d’autres populations. Évite les recommandations plus fortes que le devis. Les décisions collectives doivent aussi intégrer les préférences, les ressources, l’équité et les conséquences possibles.'),{genre:'etapes',titre:'Une lecture en cinq questions',etapes:['Quelle quantité répond à la question posée ?','Sur quelle population et avec quel devis ?','Quelle taille, quelle unité et quelle incertitude ?','Quels biais ou choix analytiques peuvent changer l’interprétation ?','Quelles décisions ces données permettent-elles réellement d’éclairer ?']},question('Comment améliorer « l’étude prouve que le programme fonctionne » ?','Décrire le résultat estimé, son incertitude et le devis, puis préciser les hypothèses nécessaires à une interprétation causale et les limites pour d’autres contextes.')]
 ],['Une p-valeur ne mesure pas la probabilité de vérité d’une hypothèse.','La précision statistique ne corrige pas automatiquement les biais.','La discussion doit rester proportionnée à la question et au devis.'])
];

const questionsOriginales = [
 [4,'Une équipe observe seulement deux valeurs, 0 et 1, pour une issue. Quel modèle décrit directement une observation individuelle ?',['Bernoulli','Normale','Student','Uniforme continue'],0,'Une variable de Bernoulli représente une issue binaire. Un total de plusieurs essais indépendants de même probabilité peut suivre une loi binomiale.'],
 [3,'Une valeur extrême est ajoutée à une série de délais. Quel résumé du centre résiste généralement le mieux ?',['La médiane','La somme','La moyenne','Le maximum'],0,'La médiane dépend du rang central. La moyenne et la somme sont directement sensibles à la magnitude de la valeur extrême.'],
 [3,'Quel élément doit accompagner une moyenne de délais pour en comprendre la dispersion ?',['Un écart type ou des quantiles, avec l’unité','Le seul numéro du chapitre','La couleur du graphique','Une p-valeur sans autre information'],0,'Le centre ne décrit pas à lui seul la distribution. Une unité et des indicateurs de dispersion rendent le résumé interprétable.'],
 [4,'Si deux événements sont indépendants et ont des probabilités 0,25 et 0,4, quelle est la probabilité de leur intersection ?',['0,10','0,65','0,15','0,625'],0,'L’indépendance autorise le produit : 0,25 × 0,4 = 0,10. Additionner les probabilités répond à une autre opération.'],
 [6,'Un intervalle à 95 % pour une moyenne est déjà calculé. Quelle interprétation est correcte ?',['La procédure vise une couverture de 95 % sur des répétitions adaptées','95 % des observations sont forcément dans cet intervalle','Le paramètre fixe a une probabilité de 95 % de bouger dans cet intervalle','L’échantillon est nécessairement représentatif'],0,'Le niveau de confiance porte sur la procédure, sous ses hypothèses. Il ne décrit ni la proportion de personnes dans l’intervalle ni l’absence de biais.'],
 [7,'Dans Positron, quel élément conserve les instructions d’une analyse pour une nouvelle session ?',['Un script enregistré','Le seul panneau des variables','Une capture d’écran de la console','Un nom de fenêtre'],0,'Le script constitue une trace exécutable. Les objets en mémoire disparaissent lorsque la session est fermée sans sauvegarde adaptée.'],
 [7,'Quelle commande compte les valeurs manquantes du vecteur x ?',['sum(is.na(x))','mean(x == 0)','length(unique(x))','sd(x)'],0,'is.na() repère chaque valeur manquante, puis sum() additionne les indicateurs logiques.'],
 [7,'Que garantit set.seed() dans une simulation ?',['Un point de départ reproductible pour le générateur','La représentativité des personnes recrutées','La causalité de l’association','L’absence de valeurs manquantes'],0,'Une graine concerne la génération pseudo-aléatoire. Elle ne garantit aucune propriété empirique du recrutement.'],
 [7,'Que faut-il vérifier après une jointure entre deux tables ?',['Les clés, les correspondances et le nombre de lignes','Seulement le nom du fichier','Seulement le thème de l’éditeur','Que toutes les variables sont numériques'],0,'Une clé dupliquée peut multiplier les lignes. Une absence de correspondance peut aussi modifier l’interprétation des valeurs manquantes.'],
 [7,'Deux colonnes représentent un score avant et après chez les mêmes personnes. Quelle option conserve cette structure dans t.test() ?',['paired = TRUE','var.equal = TRUE uniquement','na.rm = FALSE','Un tri indépendant de chaque colonne'],0,'paired = TRUE utilise les différences à l’intérieur des paires, qui doivent rester alignées. L’option ne crée pas un appariement valide à partir de données sans lien.'],
 [7,'Quel contrôle vérifie que les délais du vecteur delai sont non négatifs ?',['stopifnot(all(delai >= 0))','sort(delai)','names(delai)','mean(delai)'],0,'Une assertion explicite peut arrêter le script lorsqu’une condition attendue n’est pas satisfaite.'],
 [7,'L’assistant IA propose un modèle qui s’exécute sans erreur. Quelle est la bonne étape suivante ?',['Vérifier le devis, les hypothèses, les données et l’interprétation','Publier immédiatement sa conclusion','Retirer les limites de l’analyse','Traiter la sortie comme une preuve causale'],0,'Une exécution réussie ne démontre ni la pertinence de la méthode ni la validité des conclusions.'],
 [25,'Quelle distinction est essentielle entre écart type et erreur standard ?',['Dispersion des observations contre dispersion d’un estimateur','Les deux décrivent toujours la même quantité','L’erreur standard mesure systématiquement un biais','L’écart type est une p-valeur'],0,'L’écart type décrit les valeurs individuelles. L’erreur standard décrit la variabilité d’un estimateur sur des échantillons répétés.'],
 [25,'À variance inchangée et sous indépendance, multiplier l’effectif par quatre modifie comment l’erreur standard d’une moyenne ?',['Elle est divisée par deux','Elle est divisée par quatre','Elle reste toujours identique','Elle est multipliée par deux'],0,'L’erreur standard est proportionnelle à 1 / racine(n). La relation doit être adaptée si les observations sont dépendantes ou pondérées.'],
 [25,'Un très grand échantillon de volontaires élimine-t-il nécessairement un biais de sélection ?',['Non','Oui, dès cent personnes','Oui, dès trente personnes','Oui si la moyenne est arrondie'],0,'La taille réduit certaines composantes de l’incertitude aléatoire. Elle ne corrige pas automatiquement un recrutement sélectif.'],
 [25,'Dans l’exemple fictif, 364 personnes répondent sur 520 personnes invitées. Quel est le taux de réponse parmi les invitées ?',['70 %','43,3 %','52 %','36,4 %'],0,'Le dénominateur pertinent est le nombre de personnes invitées : 364 / 520 = 0,70.'],
 [26,'Pour deux moyennes indépendantes, quelle méthode n’impose pas l’égalité des variances ?',['Le test de Welch','Un test apparié arbitraire','Le calcul d’une seule médiane','La suppression du groupe le plus variable'],0,'Le test de Welch estime les variances des deux groupes séparément et adapte les degrés de liberté.'],
 [26,'Que signifie un test global d’analyse de variance concluant à une différence ?',['Au moins une moyenne diffère sous le modèle','Toutes les paires de moyennes diffèrent','Les groupes sont devenus randomisés','Les observations sont forcément normales'],0,'Le test global ne précise pas à lui seul quelles paires diffèrent. La suite de l’analyse doit être planifiée et justifiée.'],
 [26,'Deux proportions fictives valent 30 % et 20 %. Quelle est leur différence absolue ?',['10 points de pourcentage','10 % d’augmentation relative','1,5 point de pourcentage','50 points de pourcentage'],0,'30 % − 20 % = 10 points de pourcentage. Le rapport est 1,5 et l’augmentation relative est 50 %, ce qui répond à une autre question.'],
 [26,'Dans un petit tableau 2 × 2 peu rempli, quelle méthode peut remplacer une approximation du khi-deux ?',['Le test exact de Fisher','Une régression sans variable','Une moyenne des identifiants','Un changement de couleur'],0,'Fisher propose un test exact conditionnel. Le choix dépend du tableau et du devis ; il ne remplace pas une mesure d’association.'],
 [27,'Une p-valeur de 0,03 est-elle la probabilité de 3 % que l’hypothèse nulle soit vraie ?',['Non','Oui, toujours','Oui, seulement si elle est arrondie','Oui, si l’effectif dépasse trente'],0,'La p-valeur est calculée sous une hypothèse et un modèle. Elle ne fournit pas directement une probabilité de vérité de cette hypothèse.'],
 [27,'Quel ensemble décrit le mieux un résultat quantitatif utile ?',['Estimation, unité, incertitude, devis et limites','Seulement significatif ou non significatif','Seulement le nom du logiciel','Seulement une valeur arrondie'],0,'La portée d’un résultat dépend de ce qui a été mesuré et de la manière dont les données ont été produites et analysées.'],
 [27,'Une bonne prédiction justifie-t-elle à elle seule une conclusion causale ?',['Non','Oui, si le graphique est net','Oui, avec une p-valeur faible','Oui, si plusieurs variables sont utilisées'],0,'Prédiction et estimation causale répondent à des questions différentes et reposent sur des validations ou hypothèses différentes.'],
 [27,'Un résultat non significatif prouve-t-il l’équivalence de deux modalités ?',['Non','Oui, automatiquement','Oui, pour toute marge imaginable','Oui, si les moyennes sont proches à l’écran'],0,'L’équivalence demande une marge définie et une procédure adaptée. Une incertitude importante peut expliquer un résultat non significatif.']
];
module.exports={donnees,sujets,nouveauxChapitres,questionsOriginales};
