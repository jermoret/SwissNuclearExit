'use strict';

describe('Controller: ControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('swissNuclearExitApp'));

  var ControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ControllerCtrl = $controller('ControllerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ControllerCtrl.awesomeThings.length).toBe(3);
  });
});
