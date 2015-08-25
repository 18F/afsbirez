'use strict';

describe('Service: UserService', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var $window,
    UserService,
    $httpBackend,
    AuthenticationService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _UserService_, _$window_, _AuthenticationService_) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    AuthenticationService = _AuthenticationService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    UserService = _UserService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

// logIn
  it('should post to the backend with the expected user name and password', function() {
    UserService.logIn('user', 'password');
    $httpBackend.expect('POST', 'auth/', {email: 'user', password: 'password'}).respond(200);
    $httpBackend.flush();
  });

// logOut
  it('should clear session storage, set to unauthenticated, and redirect to root', function() {
    $window.sessionStorage.token = 'abc';
    $window.sessionStorage.username = 'Test';
    $window.sessionStorage.userid = 1;
    UserService.logOut('user', 'password');
    expect($window.sessionStorage.token).toBe('');
    expect($window.sessionStorage.username).toBe('null');
    expect($window.sessionStorage.userid).toBe('null');
    expect(AuthenticationService.getAuthenticated()).toBe(false);

    $httpBackend.flush();
  });

// refreshToken
  it('should post to the backend with the existing token', function() {
    $window.sessionStorage.token = 'abc';
    UserService.refreshToken();
    $httpBackend.expect('POST', 'auth-refresh/', {token: 'abc'}).respond(200);
    $httpBackend.flush();
  });

// resetPassword
  it ('should post to the password reset endpoint', function() {
    UserService.resetPassword('a@b.com');
    $httpBackend.expect('POST', 'rest-auth/password/reset/', {'email': 'a@b.com'}).respond(200);
    $httpBackend.flush();
  });

// createUser
  it ('should post to the create user endpoint with correctly formatted parameters', function() {
    $window.sessionStorage.token = '';
    UserService.createUser('test', 'a@b.com', 'abc');
    $httpBackend.expect('POST', 'api/v1/users/', 
      {'name': 'test',
       'email': 'a@b.com',
       'password': 'abc',
       'groups': [],
       'is_staff': false }).respond(200);
    $httpBackend.flush();
  });

// changePassword
  it ('should post to the change password endpoint with correct parameters', function() {
    AuthenticationService.setAuthenticated(true);
    UserService.changePassword('oldpass', 'newpass', 'newpass');
    $httpBackend.expect('POST', 'rest-auth/password/change/',
      {
        'old_password': 'oldpass',
        'new_password1': 'newpass',
        'new_password2': 'newpass'
      }).respond(200);
    $httpBackend.flush();
  })
});
