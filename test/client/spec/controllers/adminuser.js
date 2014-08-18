'use strict';

describe('Controller: AdminUserCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AdminUserCtrl,
    scope,
    window,
    UserService,
    $httpBackend,
    $location,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _$q_, _$location_, $controller, $rootScope, $window, _UserService_) {
    $httpBackend = _$httpBackend_;
    UserService = _UserService_;
    scope = $rootScope.$new();
    window = $window;
    $q = _$q_;
    $location = _$location_;
    AdminUserCtrl = $controller('AdminUserCtrl', {
      $scope: scope
    });
  }));

  it('should set the token to window storage on successful signin and direct back to the application', function () {
    var data ={'data': {'token':'ABC', 'username':'test', 'id':1}};
    var mockDeferred = $q.defer();
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn($location, 'path');
    scope.logIn(data.data.username, '123');
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path).toHaveBeenCalledWith('/');
  });
  
  it('should not redirect and it should return an error', function () {
    var data = {'data': {'token':'XYZ', 'username':'test', 'id':1}};
    var mockDeferred = $q.defer();
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn($location, 'path');
    scope.logIn(data.username, '123');
    mockDeferred.reject(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toNotBe(data.data.token);
    expect(scope.errorMsg).toBeUndefined();
  });
  
  it('should remove tokens and redirect to root when logout', function () {
    expect(window.sessionStorage.token).not.toBeUndefined();
    spyOn($location, 'path');
    scope.logOut();
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe('');
    expect($location.path).toHaveBeenCalledWith('/');
  });

});
