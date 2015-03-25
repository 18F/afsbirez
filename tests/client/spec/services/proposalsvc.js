'use strict';

describe('Service: ProposalService', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var $window,
    ProposalService,
    $httpBackend,
    $rootScope,
    AuthenticationService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _ProposalService_, _$window_, _$rootScope_, _AuthenticationService_) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    AuthenticationService = _AuthenticationService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    ProposalService = _ProposalService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // create
  it('should post to the backend with the expected default values if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.create(1, 'title');
    var propData = {
      'owner': '1',
      'firm': 1,
      'workflow': 6,
      'topic': 1,
      'title': 'title' 
    };
    $httpBackend.expect('POST', 'api/v1/proposals/', propData).respond(200);
    $httpBackend.flush();
  });

  it('should open the login dialog if not authenticated on create', function() {
    ProposalService.create(1, 'title');
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on create if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = ProposalService.create('title').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // remove
  it('should send a delete request if authed', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.remove(1);
    $httpBackend.expectDELETE('api/v1/proposals/1/').respond(200);
    $httpBackend.flush();
  });

  
  it('should open a login dialog if not authed on remove', function() {
    AuthenticationService.setAuthenticated(false);
    var response = ProposalService.remove(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on remove if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = ProposalService.remove('title').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // list
  it('should return a list of proposals if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.list();
    $httpBackend.expectGET('api/v1/proposals/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on list', function() {
    AuthenticationService.setAuthenticated(false);
    var response = ProposalService.list();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // get
  it('should return a proposal if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.get(1);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on get', function() {
    AuthenticationService.setAuthenticated(false);
    var response = ProposalService.get(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on get if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = ProposalService.get('title').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // saveData
  it('should return a proposal if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var data = {'field_1': '123', 'field_2': '234'};
    ProposalService.saveData(1, data);
    $httpBackend.expect('PATCH', 'api/v1/proposals/1/', {'data': data}).respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on get', function() {
    AuthenticationService.setAuthenticated(false);
    var data = {'field_1': '123', 'field_2': '234'};
    ProposalService.saveData(1, data);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on saveData if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = ProposalService.saveData('title', {}).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // saveTitle
  it('should return a proposal if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var title = 'Title';
    ProposalService.saveTitle(1, title);
    $httpBackend.expect('PATCH', 'api/v1/proposals/1/', {'title': title}).respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on get', function() {
    AuthenticationService.setAuthenticated(false);
    var title = 'Title';
    ProposalService.saveTitle(1, title);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error on saveTitle if the opportunity id is non-numeric', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');

    var promise = ProposalService.saveTitle('title', {}).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });
});
