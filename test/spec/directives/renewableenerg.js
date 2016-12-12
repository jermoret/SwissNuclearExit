'use strict';

describe('Directive: RenewableEnerg', function () {

  // load the directive's module
  beforeEach(module('swissNuclearExitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-renewable-energ></-renewable-energ>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the RenewableEnerg directive');
  }));
});
