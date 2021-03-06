# SwissNuclearExit

Ce projet a été réalisé au sein du cours *Visualisation de l'Information* du Master Of Science In Engineering de l'HES-SO.

## Intention

Le 27 novembre 2016, le peuple Suisse a dû se prononcer quant à la question d'une sortie programmée du nucléaire. Il est souvent difficile de s'imaginer à quel point le nucléaire est présent dans l'électricité de tous les jours. D'un côté on nous dit, qu'en plus de tous les côtés néfastes dû à la vieillesse des installations, aux déchets, qu'il serait largement possible de les remplacer par de nouvelles sources d'énergies renouvelables. De l'autre côté, on nous dit qu'il est absolument impossible de sortir rapidement du nucléaire sans dépendre complètement de l'énergie étrangère qui n'est ni plus ni moins que du nucléaire français ou du charbon allemand. Au final, qu'en est-il vraiment ? Cette application permet à l'utilisateur de jouer avec plusieurs solutions cohérentes afin de répondre au problème du remplacement du nucléaire.

## Présentation et interaction

SwissNuclearExit est une application web doté d'un fonctionnement très basique.
Il faut s'imaginer revenir au 1er janvier 2014 et avoir le pouvoir de décision suprême. On pourra, dans une première section, arrêter directement une ou plusieurs des centrales nucléaires suisses cela impactant l'électricité de l'année 2014 sous forme d'une déficience en *gigawatts/heure*. L'application donnera ensuite trois grandes solutions titrées **Nouvelles énergies renouvelables**, **Consommation des ménages** et **Importations/exportations**. Une dernière section résumera en une ligne la couverture de la déficience par l'ensemble des stratégies.

Au sein de chaque solution, on découvrira deux statistiques pour l'année 2014 présentées à l'aide de graphiques, la première concernant uniquement la Suisse et la deuxième étant l'équivalent européen (il est toujours intéressant de voir comment nos voisins abordent le problème). Enfin, il sera possible d'appliquer une ou plusieurs stratégies pour tenter de couvrir la déficience générée par l'arrêt de centrales.

L'application web est composée d'une barre de navigation ne contenant pas des liens mais un résumé du nombre de centrales arrêtées et de l'état actuel de l'électricité, toujours pour l'année 2014.

Une attention particulière a été portée aux couleurs des graphiques afin de faciliter au maximum la distinction des légendes sans avoir à consulter les titres sous-jacents. Une fonctionnalité d'équivalent a été implémentée pour certaines stratégies, ceci permettant à l'utilisateur de se représenter plus clairement l'action à l'aide d'un équivalent qu'il comprend.

## Données

Informations indispensables pour garantir la cohérence de l'application, nous avons récupéré les données suisses et européennes sur l'électricité pour l'année 2014. La limite supérieure de 2014 pour l'année a été déterminée par les données européennes qui s'arrêtent à cette année.

### Sources

- [OFEN](http://www.bfe.admin.ch/index.html?lang=fr) : Données suisses
- [Eurostat](http://ec.europa.eu/eurostat/fr/home) : Données européennes
- [Swissolar](http://www.swissolar.ch/fr/) : Données spécifiques aux cellules photovoltaïques
- [SuisseEole](http://www.suisse-eole.ch/fr/energie-eolienne/statistiques/) : Données spécifiques aux éoliennes

## Outils utilisés

L'application web a été réalisé en utilisant AngularJS. Elle a été créée en utilisant [Yeoman](http://yeoman.io/) et le scaffold [Angular-generator](https://github.com/yeoman/generator-angular). La librairie [Chart.js](http://www.chartjs.org/) a été utilisée pour tous les graphiques. La librairie [Boostrap](http://getbootstrap.com/) a été utilisée pour la cosmétique du site. Les données ont été stockées dans un fichier JSON côté serveur car les données sont uniquement lues, il n'y a pas de modifications.

## Tests utilisateurs

Quelques tests utilisateurs ont été effectuées afin d'évaluer l'intuitivité de l'application.
- Un des utilisateurs a tenté d'utilisé l'icône de l'extension du champ pour ajouter, par exemple, des éoliennes.
![user_test1](screens/user_test1.PNG "Extension du champ d'ajout")
- Les utilisateurs ont eu de la peine à comprendre qu'il s'agissait de statistiques sur une année et pour 2014.

## Améliorations possibles

- Corriger les défauts découverts avec les tests utilisateurs.
- Supprimer ou trouver un meilleur graphique pour la consommation des ménages européens.
- Une barre de navigation verticale pourrait être installée pour faciliter la navigation au sein des différentes sections.

## Exécution

Vous pouvez utiliser la commande `grunt serve` pour lancer l'exécution et la visualisation de l'application.
