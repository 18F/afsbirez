'use strict';

describe('Controller: AccountUserCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AccountUserCtrl,
    $rootScope,
    scope,
    UserService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _UserService_) {
    UserService = _UserService_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    spyOn(UserService, 'getUserDetails').andReturn({'id':1, 'name':'Test User'});
    spyOn(UserService, 'addOrganization');
    spyOn(UserService, 'updateUserDetails');
    AccountUserCtrl = $controller('AccountUserCtrl', {
      $scope: scope
    });
  }));

  it('should retrieve the user details from the user service at creation', function () {
    expect(UserService.getUserDetails).toHaveBeenCalled();
    expect(scope.user).toBeDefined();
  });

  it('should retrieve the user details when userUpdated event is seen', function () {
    expect(UserService.getUserDetails).toHaveBeenCalled();
    expect(scope.user).toBeDefined();
    $rootScope.$broadcast('userUpdated');
    expect(UserService.getUserDetails).toHaveBeenCalled();
  });

  it('should call addOrganization on UserService when an organization is added', function() {
    scope.newOrganization = 'OrgTest';
    scope.addOrganization();
    expect(scope.newOrganization).toBe('');
    expect(UserService.addOrganization).toHaveBeenCalled();
  });

  it('should call updateUserDetails when save is called', function() {
    scope.save();
    expect(UserService.updateUserDetails).toHaveBeenCalled();
  });

});
