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
    var GWH_UNITY = "GWh";
    var KWH_UNITY = "kWh";
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
      return tooltipLabel + ': ' + tooltipData + ' ' + GWH_UNITY + ' (' + tooltipPercentage + '%)';
    }

    function labelWithGWh (tooltipItem, data) {
      var res_str = labelWithGWhAndPercentage(tooltipItem, data);
      return res_str.substr(0, res_str.search(GWH_UNITY) + GWH_UNITY.length);
    }

    function labelWithPercentage(tooltipItem, data) {
      return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel + ' %';
    }

    function addTooltipGWh(tooltipItem, data) {
      return tooltipItem.yLabel + ' ' + GWH_UNITY;
    }

    function addAxisGWh(value, index, values) {
      return value + ' ' + GWH_UNITY;
    }

    function getValuesOfObject(object) {
      var values = [];
      for(var key in object) {
        values.push(object[key]);
      }
      return values;
    }

    function tooltipAndYAxis(unity) {
      return {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return tooltipItem.yLabel + ' ' + unity;
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value + ' ' + unity;
              }
            }
          }]
        }
      };
    }

    function computePercentage(values) {
      var sum = values.reduce((pv, cv) => pv+cv, 0);
      return values.map(v => v * 100 / sum);
    }

    function refreshSwissRenewBarPercentage() {
      var newPercentages = computePercentage($scope.renew_pie_data);
      for(var i = 0; i < newPercentages.length; i++) {
        $scope.renew_bar_data[i][0] = newPercentages[i].toFixed(2);
      }
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
      $scope.renew_pie_labels = RENEWS_LABELS;
      $scope.swiss_non_renew_2014 = $scope.renew_pie_data[0];
      $scope.swiss_wind_2014 = $scope.renew_pie_data[5];
      $scope.swiss_solar_2014 = $scope.renew_pie_data[3];
      $scope.swiss_total_production = $scope.renew_pie_data.reduce((pv, cv) => pv+cv, 0);

      $scope.renew_bar_labels = [];
      $scope.renew_bar_data = [];

      for(var i = 0; i < RENEWS_LABELS.length; i++) {
        $scope.renew_bar_data.push(new Array());
      }

      $scope.per_house_cons_data = [[]];
      $scope.per_house_cons_labels = [];
      $scope.eu_imp_exp_data = [[]];
      $scope.eu_imp_exp_labels = [];

      $scope.euro_stats_2014.forEach(function(element) {
        $scope.renew_bar_labels.push(element.country);
        $scope.per_house_cons_labels.push(element.country);
        $scope.eu_imp_exp_labels.push(element.country);
        var values = getValuesOfObject(element.production_GWh);
        var sum = values.reduce((pv, cv) => pv+cv, 0);
        for(var i = 0; i < values.length; i++) {
          $scope.renew_bar_data[i].push((values[i] * 100 / sum).toFixed(2));
        }
        $scope.per_house_cons_data[0].push(element.comsumption.comsumption_by_households_kWh);
        $scope.eu_imp_exp_data[0].push(element.import_export_sold_GWh.sold);
      });

      $scope.total_household_cons_data = [[]];
      $scope.total_household_cons_labels = [];
      response.data.swiss_households_consumption_GWh.forEach(function (element) {
        $scope.total_household_cons_labels.push(element.year);
        $scope.total_household_cons_data[0].push(element.consumption);
      });

      $scope.swiss_imp_exp_labels = ['Winter', 'Summer'];
      $scope.swiss_imp_exp_data = [[
        response.data.swiss_import_export_GWh.winter_import - response.data.swiss_import_export_GWh.winter_export,
        response.data.swiss_import_export_GWh.summer_import - response.data.swiss_import_export_GWh.summer_export
      ]];

      $scope.wind_anual_production_unit = response.data.renewables_energies.wind.annual_production_kWh / 1000000;
      $scope.solar_anual_production_unit = response.data.renewables_energies.solar.annual_production_kWh / 1000000;
    });

    $scope.default_colors = ['#F7464A','#8C4906','#337AB7','#FCD552','#85CA3A','#ADC9D7','#303030'];
    $scope.nbrShutdownedCentral = 0;
    $scope.generalDeficiencyRatio = 0;
    $scope.nuclearDeficiencyRatio = 0;
    $scope.badge_color = "label-danger";
    $scope.wind_strategy_cover_percentage = 0;
    $scope.wind_strategy_cover = 0;
    $scope.solar_strategy_cover_percentage = 0;
    $scope.solar_strategy_cover = 0;
    $scope.wind_input = 0;
    $scope.solar_input = 0;

    // Initialize toggles
    $scope.toggle = new Array(true, true, true, true, true);

    $scope.toggleChanged = function (central_id) {
      if($scope.toggle[central_id]) {
        $scope.nbrShutdownedCentral--;
        $scope.generalDeficiencyRatio += $scope.centrals[central_id].production_GWh;
      } else {
        $scope.nbrShutdownedCentral++;
        $scope.generalDeficiencyRatio -= $scope.centrals[central_id].production_GWh;
      }
      $scope.nuclearDeficiencyRatio = $scope.generalDeficiencyRatio;
      $scope.renew_pie_data[0] = $scope.swiss_non_renew_2014 + $scope.nuclearDeficiencyRatio;
      refreshSwissRenewBarPercentage();
    };

    $scope.inputChange = function () {
      var wind_cover = $scope.wind_input * $scope.wind_anual_production_unit;
      var solar_cover = $scope.solar_input * $scope.solar_anual_production_unit;
      $scope.generalDeficiencyRatio = $scope.nuclearDeficiencyRatio + wind_cover + solar_cover;
      $scope.wind_strategy_cover = wind_cover;
      $scope.solar_strategy_cover = solar_cover;

      if($scope.nuclearDeficiencyRatio != 0) {
        $scope.wind_strategy_cover_percentage = wind_cover * 100 / ($scope.nuclearDeficiencyRatio * -1);
        $scope.solar_strategy_cover_percentage = solar_cover * 100 / ($scope.nuclearDeficiencyRatio * -1);
      }

      $scope.renew_pie_data[5] = $scope.swiss_wind_2014 + wind_cover;
      $scope.renew_pie_data[3] = $scope.swiss_solar_2014 + solar_cover;
      refreshSwissRenewBarPercentage();
    };

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
    };

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
    };

    $scope.renew_bar_over = [];
    $scope.default_colors.forEach(function (element) {
      $scope.renew_bar_over.push({backgroundColor: element, borderColor: element})
    });

    $scope.total_household_cons_opt = tooltipAndYAxis(GWH_UNITY);
    $scope.per_house_cons_opt = tooltipAndYAxis(KWH_UNITY);
    $scope.swiss_imp_exp_opt = tooltipAndYAxis(GWH_UNITY);
    $scope.eu_imp_exp_opt = tooltipAndYAxis(GWH_UNITY);
  });
