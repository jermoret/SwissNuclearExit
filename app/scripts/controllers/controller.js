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
    var UNITY = "GWh";
    var RENEWS_LABELS = ["Non-renewable", "Geothermal", "Hydro", "Solar", "Biomass and Biogaz", "Wind", "Wastes"];

    function labelWithGWhAndPercentage(tooltipItem, data) {
      var allData = data.datasets[tooltipItem.datasetIndex].data;
      var tooltipLabel = data.labels[tooltipItem.index];
      var tooltipData = allData[tooltipItem.index];
      var total = 0;
      for (var i in allData) {
        total += allData[i];
      }
      var tooltipPercentage = Math.round((tooltipData / total) * 100);
      return tooltipLabel + ': ' + tooltipData + ' ' + UNITY + ' (' + tooltipPercentage + '%)';
    }

    function labelWithGWh (tooltipItem, data) {
      var res_str = labelWithGWhAndPercentage(tooltipItem, data);
      return res_str.substr(0, res_str.search(UNITY) + UNITY.length);
    }

    function labelWithPercentage(tooltipItem, data) {
      return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel + ' %';
    }

    function getValuesOfObject(object) {
      var values = [];
      for(var key in object) {
        values.push(object[key]);
      }
      return values;
    }


    $scope.$on('create', function (event, chart) {
      //document.getElementById('pie_chart_legend').innerHTML = chart.generateLegend();
    });

    $http.get('../data/graphs_data.json').then(function(response) {
      //$scope.data = response.data;
      $scope.centrals = response.data.swiss_nuclear_centrals;
      $scope.euro_stats_2014 = response.data.european_statistics_2014;
      $scope.swiss_stats_2014 = $scope.euro_stats_2014[0];

      $scope.renew_pie_data = getValuesOfObject($scope.swiss_stats_2014.production_GWh);

      $scope.renew_bar_labels = [];
      $scope.renew_bar_data = [];
      for(var i = 0; i < RENEWS_LABELS.length; i++) {
        $scope.renew_bar_data.push(new Array());
      }

      $scope.euro_stats_2014.forEach(function(element) {
        $scope.renew_bar_labels.push(element.country);
        var values = getValuesOfObject(element.production_GWh);
        var sum = values.reduce((pv, cv) => pv+cv, 0);
        for(var i = 0; i < values.length; i++) {
          $scope.renew_bar_data[i].push((values[i] * 100 / sum).toFixed(2));
        }
      });
    });

    $scope.default_colors = ['#F7464A','#8C4906','#337AB7','#FCD552','#85CA3A','#ADC9D7','#303030'];
    $scope.nbrShutdownedCentral = 0;
    $scope.deficiencyRatio = 0;
    $scope.badge_color = "label-danger";

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

    $scope.renew_pie_labels = RENEWS_LABELS;
    $scope.renew_pie_options = {
      legend: {
        display: true,
        position: "bottom"
      },
      tooltips: {
        callbacks: {
          label: labelWithGWhAndPercentage
        }
      }
    }

    $scope.renew_bar_series = RENEWS_LABELS;
    $scope.renew_bar_options = {
      legend: {
        display: true,
        position: "bottom"
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            max: 100,
            callback: function(value, index, values) {
              return value + ' %';
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: labelWithPercentage
        }
      }
    }
    $scope.renew_bar_over = [];
    $scope.default_colors.forEach(function (element) {
      $scope.renew_bar_over.push({backgroundColor: element, borderColor: element})
    });
  });
