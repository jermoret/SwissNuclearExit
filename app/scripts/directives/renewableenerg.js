'use strict';

/**
 * @ngdoc directive
 * @name swissNuclearExitApp.directive:RenewableEnerg
 * @description
 * # RenewableEnerg
 */
angular.module('swissNuclearExitApp')
  .directive('renewableEnerg', function(){
    return {
      restrict: 'E',
      templateUrl: 'templates/renewableEnergies.html',
      link: function postLink(scope) {
        scope.myChartObject = {};

        scope.myChartObject.type = 'PieChart';

        scope.onions = [
          {v: 'Onions'},
          {v: 3},
        ];

        scope.myChartObject.data = {
          'cols': [
            {id: 't', label: 'Topping', type: 'string'},
            {id: 's', label: 'Slices', type: 'number'}
          ],
          'rows': [
            {
              c: [
                {v: 'Mushrooms'},
                {v: 3},
              ]
            },
            {c: 3},
            {
              c: [
                {v: 'Olives'},
                {v: 31}
              ]
            },
            {
              c: [
                {v: 'Zucchini'},
                {v: 1},
              ]
            },
            {
              c: [
                {v: 'Pepperoni'},
                {v: 2},
              ]
            }
          ]
        };

        scope.myChartObject.options = {
          'title': 'How Much Pizza I Ate Last Night'
        };
      }
    };
  });
