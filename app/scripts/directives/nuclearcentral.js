'use strict';

/**
 * @ngdoc directive
 * @name swissNuclearExitApp.directive:nuclearcentral
 * @description
 * # nuclearcentral
 */
angular.module('swissNuclearExitApp')
  .directive('nuclearcentral', function () {
    return {
      templateUrl: 'views/nuclear_central.html',
      scope: {
        central_id: '=id'
      },
      restrict: 'E'
    };
  });
