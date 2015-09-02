'use strict';

describe('Controller: AccountUserCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AccountUserCtrl,
    $rootScope,
    scope,
    UserService,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _UserService_, _$q_) {
    UserService = _UserService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    scope = $rootScope.$new();
    spyOn(UserService, 'changePassword');
    AccountUserCtrl = $controller('AccountUserCtrl', {
      $scope: scope
    });
  }));

  xit('should call changePassword when savePassword is called if form is properly filled out', function() {
    scope.input.oldpassword = 'abc';
    scope.input.newpassword1 = '123';
    scope.input.newpassword2 = '123';
    scope.savePassword();
    expect(UserService.changePassword).toHaveBeenCalled();
  });

});
