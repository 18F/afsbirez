'use strict';

describe('Service: SavedOpportunityService', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var $window,
    $rootScope,
    SavedOpportunityService,
    $httpBackend,
    AuthenticationService;

  var data = {
    'results': [{
        'title': 'The title.',
        'id':123,
        'proposal':2,
        'pre_release_date':'',
        'proposals_begin_date':'',
        'proposals_end_date':''
      },{
        'title': 'The 2nd title.',
        'id':456,
        'pre_release_date':'',
        'proposals_begin_date':'',
        'proposals_end_date':''
      }],
    'count': 2
  };

  var propData = {
    'results': [{
      'id': 2,
      'topic': 123
    }],
    'count': 1
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _$rootScope_, _SavedOpportunityService_, _$window_, _AuthenticationService_) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    AuthenticationService = _AuthenticationService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    SavedOpportunityService = _SavedOpportunityService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // save
  it ('should save to the backend with the correct opportunity id if the user is logged in', function() {
    AuthenticationService.setAuthenticated(true);
    SavedOpportunityService.save(1);
    $httpBackend.expectPOST('api/v1/topics/1/saved/').respond(200);
    $httpBackend.flush();
  });

  it ('should open a login dialog if not authed on save', function() {
    AuthenticationService.setAuthenticated(false);
    SavedOpportunityService.save(1);
    $httpBackend.expectPOST('api/v1/topics/1/saved/').respond(401);
    $httpBackend.expectGET('static/views/partials/signin.html').respond(200);
    $httpBackend.flush();
  });

  it ('should not save to the backend if it is missing the id', function() {
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    SavedOpportunityService.save().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  it ('should not save to the backend if the id is non-numeric', function() {
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    SavedOpportunityService.save('theid').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // remove
  it ('should remove the topic with the correct opportunity id if the user is logged in', function() {
    AuthenticationService.setAuthenticated(true);
    SavedOpportunityService.remove(1);
    $httpBackend.expectDELETE('api/v1/topics/1/saved/').respond(200);
    $httpBackend.flush();
  });

  it ('should open a login dialog if not authed on delete', function() {
    AuthenticationService.setAuthenticated(false);
    SavedOpportunityService.remove(1);
    $httpBackend.expectDELETE('api/v1/topics/1/saved/').respond(401);
    $httpBackend.expectGET('static/views/partials/signin.html').respond(200);
    $httpBackend.flush();
  });

  it ('should not remove from the backend if it is missing the id', function() {
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    SavedOpportunityService.remove().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  it ('should not remove from the backend if the id is non-numeric', function() {
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    SavedOpportunityService.remove('theid').then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // list
  it ('should return a list of opportunities correlated with proposals if the user is logged in', function() {
    AuthenticationService.setAuthenticated(true);
    SavedOpportunityService.list();
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(data);
    $httpBackend.expectGET('api/v1/proposals/').respond(propData);
    $httpBackend.flush();
  });

  it ('should not request proposals if the opopportunities list is empty', function() {
    AuthenticationService.setAuthenticated(true);
    SavedOpportunityService.list();
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(200);
    $httpBackend.flush();
  });

  it ('should open a login dialog if not authed on list', function() {
    AuthenticationService.setAuthenticated(false);
    SavedOpportunityService.list();
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(401);
    $httpBackend.expectGET('static/views/partials/signin.html').respond(200);
    $httpBackend.flush();
  });

  // count
  it ('should return a the number of opportunities if the user is logged in', function() {
    AuthenticationService.setAuthenticated(true);
    SavedOpportunityService.list();
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(data);
    $httpBackend.expectGET('api/v1/proposals/').respond(propData);
    $httpBackend.flush();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    SavedOpportunityService.count().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(goodHandler).toHaveBeenCalledWith(2);
  });

  it ('should request the opportunities list if not already populated', function() {
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    SavedOpportunityService.count().then(goodHandler, errorHandler);
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(data);
    $httpBackend.expectGET('api/v1/proposals/').respond(propData);
    $httpBackend.flush();
    expect(goodHandler).toHaveBeenCalledWith(2);
  });

  it ('should open a login dialog if not authed on list', function() {
    AuthenticationService.setAuthenticated(false);
    SavedOpportunityService.count();
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(401);
    $httpBackend.expectGET('static/views/partials/signin.html').respond(200);
    $httpBackend.flush();
  });
});
