'use strict';

describe('Controller: SignInCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var SignInCtrl,
    scope,
    window,
    UserService,
    $httpBackend,
    $location,
    $q;

    var data ={'data': {'token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzU2OTU4ODIsInVzZXJfaWQiOjMsImVtYWlsIjoiZGF2ZUBnbWFpbC5jb20iLCJvcmlnX2lhdCI6MTQzNTY5Mjg4MiwidXNlcm5hbWUiOiJkYXZlQGdtYWlsLmNvbSJ9.EZe59iapntq48PBMQ2WB8UeEFGVcy61y_MAvVw7sXAI', 'username':'test', 'id':1}};

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _$q_, _$location_, $controller, $rootScope, $window, _UserService_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('static/views/partials/appmain.html').respond({});
    $httpBackend.whenGET('static/views/partials/activity.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    UserService = _UserService_;
    scope = $rootScope.$new();
    window = $window;
    $q = _$q_;
    $location = _$location_;
    SignInCtrl = $controller('SignInCtrl', {
      $scope: scope
    });
  }));

  it('should set the token to window storage on successful signin and direct back to the application', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn(UserService, 'getUserDetails').andReturn(mockDeferred.promise);
    spyOn($location, 'path');
    scope.email = data.data.username;
    scope.password = '123';
    scope.logIn();
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path).toHaveBeenCalledWith('/');
  });
  
  it('should not redirect and it should return an error', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn($location, 'path');
    data.data.token = 'ABC';
    scope.email = data.data.username;
    scope.password = '123';
    scope.logIn();
    mockDeferred.reject(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toNotBe(data.data.token);
    expect(scope.errorMsg).toBeDefined();
  });

  it ('should honor the target query string, if present', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn(UserService, 'getUserDetails').andReturn(mockDeferred.promise);
    scope.intention = {'target': '/~/proposals/5'};
    scope.email = data.data.username;
    scope.password = '123';
    scope.logIn();
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path()).toBe('/~/proposals/5');
  });

  it ('should honor the target query string, if present, even if url encoded', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn(UserService, 'getUserDetails').andReturn(mockDeferred.promise);
    scope.intention = {'target': '%2F~%2Fproposals%2F5'};
    scope.email = data.data.username;
    scope.password = '123';
    scope.logIn();
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path()).toBe('/~/proposals/5');
  });
});
