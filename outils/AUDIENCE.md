# Activer la mesure d’audience

L’intégration est prête mais reste inactive tant que `outils/audience.json` contient `"endpoint": null`. Aucun appel à GoatCounter n’est alors ajouté aux pages.

1. Créer le compte gratuit sur https://www.goatcounter.com/signup avec son propre courriel. Utiliser `https://erjb-web.github.io/` comme adresse du site et conserver le tableau de bord privé.
2. Relever l’adresse attribuée, par exemple `https://nom-du-site.goatcounter.com`.
3. Remplacer `endpoint` par `https://nom-du-site.goatcounter.com/count`, régénérer les pages avec `node outils/construire.js`, puis publier. Aucun mot de passe ni jeton privé n’entre dans le dépôt.

Les vues des salles et rubriques sont comptées comme des vues virtuelles. Les téléchargements des deux CV et les clics de contact ou de rendez-vous sont des événements distincts. Les paramètres d’URL, la position de lecture, les préférences d’accessibilité et les coordonnées des visiteurs ne sont pas transmis par cette intégration. Les provenances sont limitées à leur origine (domaine).

Les demandes Do Not Track et Global Privacy Control, ainsi que le refus exprimé dans le pied de page, empêchent le chargement et les envois. Les visites sur localhost et les domaines absents de la configuration sont exclues. Un blocage par le navigateur peut réduire les chiffres ; aucun contournement n’est prévu.

Documentation officielle : https://www.goatcounter.com/help/js · https://www.goatcounter.com/help/spa · https://www.goatcounter.com/help/privacy
