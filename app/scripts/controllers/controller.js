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
    var NB_SWISS_HOUSEHOLDS = 3400000;
    var percentColors = [
      { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
      { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0xff } },
      { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

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

    function computeCoverPercentage(cover) {
      if($scope.nuclearDeficiencyRatio != 0) {
        if(cover.constructor === Array) {

        } else {
          return cover * 100 / ($scope.nuclearDeficiencyRatio * -1);
        }
      }
      return 0;
    }

    function refreshSwissRenewBarPercentage() {
      var newPercentages = computePercentage($scope.renew_pie_data);
      for(var i = 0; i < newPercentages.length; i++) {
        $scope.renew_bar_data[i][0] = newPercentages[i].toFixed(2);
      }
    }

    function getColorForPercentage(pct) {
      for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
          break;
        }
      }
      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
      };
      return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    };

    function refreshDeficiencyColor() {
      var pct;
      var UPPER_LIMIT = 3000;
      if($scope.generalDeficiencyRatio < 0) { // Percentage 0 to 0,5 between nuclear deficiency and zero
        pct = (1 - ($scope.generalDeficiencyRatio * -1) / ($scope.nuclearDeficiencyRatio * -1)) / 2;
      } else { // Percentage 0,5 to 1 between zero to upper limit
        pct = 0.5 + $scope.generalDeficiencyRatio / UPPER_LIMIT / 2;
      }

      if(pct <= 1) {
        $scope.deficiencyStyle = {"color" : getColorForPercentage(pct)};
      }
    }

    function refreshSummaryGraph() {
      $scope.summary_data = [];
      for(var i = 0; i < $scope.strategy.length; i++) {
        $scope.summary_data.push([$scope.strategy[i].percentage]);
      }
      $scope.summary_options.scales.xAxes[0].ticks.max = 100;
      $scope.summary_options.scales.xAxes[0].scaleLabel = {
        display: true,
        labelString: 'of ' + $scope.nuclearDeficiencyRatio * -1 + ' ' + GWH_UNITY
      };
    }

    // Get data from the JSON file
    $http.get('../data/graphs_data.json').then(function(response) {
      $scope.centrals = response.data.swiss_nuclear_centrals;
      $scope.euro_stats_2014 = response.data.european_statistics_2014;
      $scope.swiss_stats_2014 = $scope.euro_stats_2014[0];

      $scope.renew_pie_data = getValuesOfObject($scope.swiss_stats_2014.production_GWh);
      $scope.renew_pie_labels = RENEWS_LABELS;
      $scope.swiss_non_renew_2014 = $scope.renew_pie_data[0];
      $scope.swiss_wind_2014 = $scope.renew_pie_data[5];
      $scope.swiss_solar_2014 = $scope.renew_pie_data[3];
      $scope.swiss_total_production = $scope.renew_pie_data.reduce((pv, cv) => pv+cv, 0);
      $scope.swiss_per_house_cons_2014 = $scope.swiss_stats_2014.comsumption.comsumption_by_households_kWh;
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

      $scope.wind_households_supply_unity = response.data.renewables_energies.wind.household_supply_unity;
      $scope.solar_households_supply_unity = response.data.renewables_energies.solar.household_supply_unity;

      $scope.soccer_fields_size_m2 = response.data.equivalent.soccer_field_m2;
      $scope.led_bulb_power = response.data.bulbs[0].power;
      $scope.halo_bulb_power = response.data.bulbs[1].power;
    });

    $scope.default_colors = ['#F7464A','#8C4906','#337AB7','#FCD552','#85CA3A','#ADC9D7','#303030'];
    $scope.summary_colors = ['#ADC9D7','#FCD552','#85CA3A','#F7464A'];
    $scope.deficiencyStyle = {"color":"white"};
    $scope.nbrShutdownedCentral = 0;
    $scope.generalDeficiencyRatio = 0;
    $scope.nuclearDeficiencyRatio = 0;
    $scope.badge_color = "label-danger";
    $scope.strategy = [
      {
        cover:0,
        percentage:0
      },
      {
        cover:0,
        percentage:0
      },
      {
        cover:0,
        percentage:0
      },
      {
        cover:0,
        percentage:0
      },
    ];
    $scope.wind_input = 0;
    $scope.solar_input = 0;
    $scope.wind_households_supply = 0;
    $scope.solar_households_supply = 0;
    $scope.equivalent_soccer_fields = 0;
    $scope.equivalent_beznau_1 = 0;
    $scope.equivalent_bulbs_replacement = 0;
    $scope.summary_series = ["Wind strategy","Solar strategy","Households consumption reduction","Imports strategy"];
    $scope.reduction_value = 0;
    $scope.imports_value = 0;

    // Initialize toggles
    $scope.toggle = new Array(true, true, true, true, true);

    $scope.toggleChanged = function (central_id) {
      var central_production = $scope.centrals[central_id].production_GWh;
      if($scope.toggle[central_id]) {
        $scope.nbrShutdownedCentral--;
        $scope.generalDeficiencyRatio += central_production;
        $scope.nuclearDeficiencyRatio += central_production;
      } else {
        $scope.nbrShutdownedCentral++;
        $scope.generalDeficiencyRatio -= central_production;
        $scope.nuclearDeficiencyRatio -= central_production;
      }
      $scope.renew_pie_data[0] = $scope.swiss_non_renew_2014 + $scope.nuclearDeficiencyRatio;
      refreshSwissRenewBarPercentage();
      refreshDeficiencyColor();
    };

    $scope.old_renew_value = 0;
    $scope.inputChange = function () {
      var wind_cover = $scope.wind_input * $scope.wind_anual_production_unit;
      var solar_cover = $scope.solar_input * $scope.solar_anual_production_unit;
      $scope.generalDeficiencyRatio -= $scope.old_renew_value;
      $scope.generalDeficiencyRatio += wind_cover + solar_cover;

      $scope.strategy[0].cover = wind_cover;
      $scope.strategy[1].cover = solar_cover;
      $scope.strategy[0].percentage = computeCoverPercentage(wind_cover);
      $scope.strategy[1].percentage = computeCoverPercentage(solar_cover);

      $scope.wind_households_supply = $scope.wind_input * $scope.wind_households_supply_unity;
      $scope.solar_households_supply = $scope.solar_input * $scope.solar_households_supply_unity;

      $scope.equivalent_soccer_fields = $scope.solar_input / $scope.soccer_fields_size_m2;

      $scope.renew_pie_data[5] = $scope.swiss_wind_2014 + wind_cover;
      $scope.renew_pie_data[3] = $scope.swiss_solar_2014 + solar_cover;
      refreshSwissRenewBarPercentage();
      $scope.old_renew_value = wind_cover + solar_cover;
      refreshDeficiencyColor();
      refreshSummaryGraph();
    };

    $scope.old_reduction_value = 0;
    $scope.old_reduction_kwh = 0;

    $scope.reductionInputChange = function () {
      $scope.generalDeficiencyRatio -= $scope.old_reduction_value;
      var reduction_kwh = $scope.reduction_value / 100 * $scope.swiss_per_house_cons_2014;
      var reduction = NB_SWISS_HOUSEHOLDS * reduction_kwh / 1000000;
      $scope.generalDeficiencyRatio += reduction;

      $scope.strategy[2].cover = reduction;
      $scope.strategy[2].percentage = computeCoverPercentage(reduction);

      var length = $scope.total_household_cons_data[0].length;
      $scope.total_household_cons_data[0][length-1] += $scope.old_reduction_value;
      $scope.total_household_cons_data[0][length-1] -= reduction;
      $scope.per_house_cons_data[0][0] += $scope.old_reduction_kwh;
      $scope.per_house_cons_data[0][0] -= reduction_kwh;

      var halo_year_wh = $scope.halo_bulb_power * 4 * 365;
      var led_year_wh = $scope.led_bulb_power * 4 * 365;
      var difference_kwh = (halo_year_wh - led_year_wh) / 1000;
      $scope.equivalent_bulbs_replacement = reduction_kwh / difference_kwh;

      $scope.old_reduction_value = reduction;
      $scope.old_reduction_kwh = reduction_kwh;
      refreshDeficiencyColor();
      refreshSummaryGraph();
    };

    $scope.old_import_value = 0;
    $scope.importInputChange = function () {
      $scope.generalDeficiencyRatio -= $scope.old_import_value;
      var imports = $scope.imports_value;
      $scope.generalDeficiencyRatio += imports;

      $scope.strategy[3].cover = imports;
      $scope.strategy[3].percentage = computeCoverPercentage(imports);

      $scope.swiss_imp_exp_data[0][0] -= $scope.old_import_value / 2;
      $scope.swiss_imp_exp_data[0][1] -= $scope.old_import_value / 2;
      $scope.swiss_imp_exp_data[0][0] += imports / 2;
      $scope.swiss_imp_exp_data[0][1] += imports / 2;
      $scope.eu_imp_exp_data[0][0] -= $scope.old_import_value;
      $scope.eu_imp_exp_data[0][0] += imports;

      $scope.equivalent_beznau_1 = imports / $scope.centrals[0].production_GWh;

      $scope.old_import_value = imports;
      refreshDeficiencyColor();
      refreshSummaryGraph();
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
    $scope.swiss_imp_exp_opt.scales.yAxes[0].scaleLabel = {
      display: true,
      labelString: '< exporter ratio              importer ratio >'
    };
    $scope.eu_imp_exp_opt = tooltipAndYAxis(GWH_UNITY);
    $scope.eu_imp_exp_opt.scales.yAxes[0].scaleLabel = {
      display: true,
      labelString: '< exporter ratio              importer ratio >'
    };

    $scope.summary_options = {
      legend: {
        display: true,
        position: "bottom"
      },
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            callback: function(value, index, values) {
              var percentage = value + ' %'
              /*if(value === 100) {
                percentage += '\n (' + $scope.nuclearDeficiencyRatio * -1 + ' GWh)';
              }*/
              return percentage;
            }
          }
        }],
        yAxes: [{
          stacked: true
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.xLabel.toFixed(1) + ' % (' +
              $scope.strategy[tooltipItem.datasetIndex].cover.toFixed(1) + ' ' + GWH_UNITY + ')';
          }
        }
      }
    };
    $scope.summary_over = [];
    $scope.summary_colors.forEach(function (element) {
      $scope.summary_over.push({backgroundColor: element, borderColor: element})
    });
    refreshSummaryGraph();
  });
