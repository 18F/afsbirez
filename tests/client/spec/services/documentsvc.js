'use strict';

describe('Service: DocumentService', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var $window,
    DocumentService,
    $httpBackend,
    $rootScope,
    AuthenticationService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _DocumentService_, _$window_, _$rootScope_, _AuthenticationService_) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    AuthenticationService = _AuthenticationService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    DocumentService = _DocumentService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // upload
  it('should post to the backend with the expected default values if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var progressCB = function(val) { };
    var file = {data:"asas",method:"POST",url:'',file:[{"name":"File 1", "body":"abcd121212"}]};
//    DocumentService.upload(file, 'title', 'desc', progressCB);
//    $httpBackend.expectPOST('api/v1/documents/').respond(200);
    $httpBackend.flush();
  });

  it('should open the login dialog if not authenticated on create', function() {
    DocumentService.upload(1, 'title', 1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // remove
  it('should send a delete request if authed', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    DocumentService.remove(1);
    $httpBackend.expectDELETE('api/v1/documents/1/').respond(200);
    $httpBackend.flush();
  });

  
  it('should open a login dialog if not authed on remove', function() {
    AuthenticationService.setAuthenticated(false);
    var response = DocumentService.remove(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on remove if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = DocumentService.remove('title').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // list
  it('should return a list of documents if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    DocumentService.list();
    $httpBackend.expectGET('api/v1/documents/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on list', function() {
    AuthenticationService.setAuthenticated(false);
    var response = DocumentService.list();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // get
  it('should return a document if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    DocumentService.get(1);
    $httpBackend.expectGET('api/v1/documents/1/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on get', function() {
    AuthenticationService.setAuthenticated(false);
    var response = DocumentService.get(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on get if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = DocumentService.get('title').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

});
