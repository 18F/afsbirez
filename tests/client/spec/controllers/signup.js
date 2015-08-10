'use strict';

describe('Controller: SignUpCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var SignUpCtrl,
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
    SignUpCtrl = $controller('SignUpCtrl', {
      $scope: scope
    });
  }));

  it('should set the token to window storage on successful signup and direct back to the application', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'createUser').andReturn(mockDeferred.promise);
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn(UserService, 'getUserDetails').andReturn(mockDeferred.promise);
    spyOn($location, 'path');
    scope.name = 'Test User';
    scope.email = 'test@user.com';
    scope.password = 'Abc123!2';
    scope.signUp();
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path).toHaveBeenCalledWith('/');
  });

  it ('should honor the target query string, if present', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'createUser').andReturn(mockDeferred.promise);
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn(UserService, 'getUserDetails').andReturn(mockDeferred.promise);
    scope.intention = {'target': '/~/proposals/5'};
    scope.email = data.data.username;
    scope.name = 'Test User';
    scope.password = 'Abc123!2';
    scope.signUp();
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path()).toBe('/~/proposals/5');
  });

  it ('should honor the target query string, if present, even if url encoded', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'createUser').andReturn(mockDeferred.promise);
    spyOn(UserService, 'logIn').andReturn(mockDeferred.promise);
    spyOn(UserService, 'getUserDetails').andReturn(mockDeferred.promise);
    scope.intention = {'target': '%2F~%2Fproposals%2F5'};
    scope.email = data.data.username;
    scope.name = 'Test User';
    scope.password = 'Abc123!2';
    scope.signUp();
    mockDeferred.resolve(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toBe(data.data.token);
    expect($location.path()).toBe('/~/proposals/5');
  });

  it('should not redirect and it should return an error', function () {
    var mockDeferred = $q.defer();
    spyOn(UserService, 'createUser').andReturn(mockDeferred.promise);
    spyOn($location, 'path');
    data.data.token = 'ABC';
    scope.name = 'Test User';
    scope.email = 'test@user.com';
    scope.password = 'Abc123!2';
    scope.signUp();
    mockDeferred.reject(data);
    scope.$root.$digest();
    expect(window.sessionStorage.token).toNotBe(data.data.token);
    expect(scope.errorMsg).toBe('Unable to sign up.');
    UserService.logOut();
  });
 
  it('should enforce password requirements', function() {
    scope.name = 'Test User';
    scope.email = 'test@user.com';
    scope.password = 'badpass';
    scope.signUp();
    expect(scope.errorPassword).toBe('Password does not meet requirements.');
    expect(scope.errorProblems[0]).toBe('The password is missing a number.');
    expect(scope.errorProblems[1]).toBe('The password is missing a capital letter.');
    expect(scope.errorProblems[2]).toBe('The password is missing a special character.');
    expect(scope.errorProblems[3]).toBe('The password is too short.');
  });
 
  it('should require all fields.', function() {
    scope.name = '';
    scope.email = 'test@user.com';
    scope.password = 'badpass';
    scope.signUp();
    expect(scope.errorMsg).toBe('All fields are required.');
  });
});
