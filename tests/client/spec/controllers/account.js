'use strict';

describe('Controller: AccountCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AccountCtrl,
    $rootScope,
    scope,
    UserService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _UserService_) {
    UserService = _UserService_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    spyOn(UserService, 'getUserDetails').andReturn({'id':1, 'name':'Test User'});
    AccountCtrl = $controller('AccountCtrl', {
      $scope: scope
    });
  }));

  // This controller no longer retrieves this information. It is done on the user and org page instead
  xit('should retrieve the user details from the user service at creation', function () {
    expect(UserService.getUserDetails).toHaveBeenCalled();
    expect(scope.user).toBeDefined();
  });

  xit('should retrieve the user details when userUpdated event is seen', function () {
    expect(UserService.getUserDetails).toHaveBeenCalled();
    expect(scope.user).toBeDefined();
    $rootScope.$broadcast('userUpdated');
    expect(UserService.getUserDetails).toHaveBeenCalled();
  });
});
