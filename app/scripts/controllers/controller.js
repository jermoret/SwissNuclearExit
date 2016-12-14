'use strict';

/**
 * @ngdoc function
 * @name swissNuclearExitApp.controller:ControllerCtrl
 * @description
 * # ControllerCtrl
 * Controller of the swissNuclearExitApp
 */
angular.module('swissNuclearExitApp')
  .controller('ControllerCtrl', function ($scope, $http) {

    $http.get('../data/graphs_data.json').then(function(response) {
      //$scope.data = response.data;
      $scope.centrals = response.data.swiss_nuclear_centrals;
    });

    $scope.nbrShutdownedCentral = 0;
    $scope.deficiencyRatio = 0;

    // Initialize toggles
    $scope.toggle = new Array(true, true, true, true, true);

    $scope.toggleChanged = function (central_id) {
      if($scope.toggle[central_id]) {
        $scope.nbrShutdownedCentral--
        $scope.deficiencyRatio += $scope.centrals[central_id].production_GWh;
      } else {
        $scope.nbrShutdownedCentral++
        $scope.deficiencyRatio -= $scope.centrals[central_id].production_GWh;
      }
    }
  });
