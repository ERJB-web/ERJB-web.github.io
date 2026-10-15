# Activer la mesure d’audience

L’intégration Umami est configurée avec l’identifiant public fourni le 15 octobre 2026 : `782c7df7-c2cf-4578-bddc-fa02662324af`. Le script est activé sur le domaine public après publication, sous réserve des préférences de confidentialité décrites ci-dessous. Le tableau de bord appartient au compte Umami du propriétaire du site.

1. Créer son compte sur https://cloud.umami.is/signup et sélectionner l’offre gratuite Hobby. Confirmer son adresse de courriel et choisir sa région de données.
2. Ajouter le site `erjb-web.github.io` dans Settings → Websites, puis ouvrir son code de suivi.
3. Copier la valeur publique `data-website-id` du script. Aucun mot de passe, code de confirmation ou jeton privé n’est nécessaire.
4. Renseigner `websiteId`, régénérer les pages avec `node outils/construire.js`, puis publier.

Les salles et rubriques sont des vues virtuelles ; les téléchargements des deux CV et les clics de contact ou de rendez-vous sont des événements distincts. Les paramètres d’URL, la reprise de lecture et les préférences d’accessibilité ne sont pas transmis. Les provenances sont limitées à leur domaine. Aucun identifiant individuel n’est ajouté par le site et aucune fonction identify n’est utilisée.

Les demandes Do Not Track et Global Privacy Control et le refus dans le pied de page empêchent le chargement et les envois. Les statistiques automatiques de navigation et de performance sont désactivées : seuls les envois explicitement définis par le site sont utilisés. Les domaines absents de la configuration, dont localhost, sont exclus.

Documentation : https://docs.umami.is/docs/cloud/sign-up · https://docs.umami.is/docs/cloud/faq · https://docs.umami.is/docs/tracker-functions · https://docs.umami.is/docs/tracker-configuration

Le service GoatCounter initialement proposé n’a pas pu être joint en HTTPS depuis cet environnement lors de la préparation. Il n’est ni chargé ni utilisé.
