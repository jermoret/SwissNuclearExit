'use strict';

describe('Directive: nuclearcentral', function () {

  // load the directive's module
  beforeEach(module('swissNuclearExitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nuclearcentral></nuclearcentral>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the nuclearcentral directive');
  }));
});
