# Pokedex en JavaScript

Bienvenue dans notre **Pokedex**. Notre application permet non seulement de **consulter les données des Pokemon**, mais aussi de **construire et d'analyser vos équipes de Pokemon**.
Notre site se base sur les données de **PokéAPI** et est entièrement en **anglais**.

## Installation du projet et lancement

1. Installer la dépendance npm : `npm install`
2. Lancer le projet : `npm run dev`
3. Lancer les tests : `npm run test`

## Description du projet

### Exploration et Recherche de Pokémon
Dès l'accueil, l'utilisateur accède à la liste complète des Pokémon, 
organisée via un système de pagination (20 Pokémon par page).

L'application propose deux niveaux de recherche :
* Recherche rapide : Par nom, via la barre de recherche principale.
* Recherche avancée : Un module permettant de filtrer les Pokémon par ID, type, talent (ability) ou génération.
Il est également possible de croiser plusieurs types pour trouver, par exemple, 
* tous les Pokémon possédant le double type "Eau" et "Sol".

### Fiche Détaillée et Navigation
Chaque Pokémon dispose d'une fiche d'identité interactive regroupant :
* Informations essentielles : ID, nom et visuels.
* Données techniques : Statistiques de base détaillées et cri original du Pokémon.
* Système d'évolution : Une cartographie complète de la chaîne évolutive.

L'utilisateur peut passer au Pokémon suivant ou précédent directement depuis la fiche, ou naviguer 
instantanément vers une évolution en cliquant simplement sur son nom dans la chaîne évolutive.

### Gestionnaire d'Équipe Stratégique
L'onglet "Team" transforme l'application en un véritable outil d'analyse pour les joueurs compétitifs. L'utilisateur peut :
* Composer son équipe : Sélectionner jusqu'à 6 Pokémon pour visualiser la répartition des types qui la composent.
* Analyse des Faiblesses : Un module de calcul permet d'évaluer les vulnérabilités en attaque et en défense. 
Cela permet d'identifier les types contre lesquels l'équipe est exposée afin de corriger sa composition avant un combat.
* Sauvegarde persistante : Grâce à l'intégration du localStorage, l'utilisateur peut enregistrer ses équipes (avec un maximum de 5), 
les consulter ultérieurement ou modifier une stratégie existante sans perdre ses données, même après avoir fermé le navigateur.

## Contributeurs

Auteurs : @beetiips / @CDasse
