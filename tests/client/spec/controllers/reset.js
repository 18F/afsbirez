'use strict';

describe('Controller: ResetCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var ResetCtrl,
    scope,
    window,
    UserService,
    $httpBackend,
    $location,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _$q_, _$location_, $controller, $rootScope, $window, _UserService_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    UserService = _UserService_;
    scope = $rootScope.$new();
    window = $window;
    $q = _$q_;
    $location = _$location_;
    ResetCtrl = $controller('ResetCtrl', {
      $scope: scope
    });
  }));

  it('should accept an email and not set an error on success', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'resetPassword').andReturn(mockDeferred.promise);
    scope.email = 'test@user.com';
    scope.reset();
    mockDeferred.resolve({'data':{"success":"Password reset e-mail has been sent."}});
    scope.$root.$digest();
    expect(scope.errorMsg).toBe('');
    expect(scope.successMsg).toBe('Password reset e-mail has been sent.');
  });
  
  it('should not accept an email and set an error on failure', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'resetPassword').andReturn(mockDeferred.promise);
    scope.email = 'test@user.com';
    scope.reset();
    mockDeferred.reject({});
    scope.$root.$digest();
    expect(scope.errorMsg).toBe('Unable to reset password.');
  });

  it('should require an email address', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'resetPassword').andReturn(mockDeferred.promise);
    scope.email = '';
    scope.reset();
    mockDeferred.resolve({});
    scope.$root.$digest();
    expect(scope.errorMsg).toBe('Please provide an email address.');
  });
  
});
