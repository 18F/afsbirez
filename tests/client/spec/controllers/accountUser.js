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
    spyOn(UserService, 'getUserDetails').andCallFake(function() {
      var deferred = $q.defer();
      deferred.resolve({'id':1, 'name':'Test User'});
      return deferred.promise;
    });
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

  // addOrganization was removed
  xit('should call addOrganization on UserService when an organization is added', function() {
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
