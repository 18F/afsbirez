'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var SearchCtrl,
    scope,
    $state,
    mockDependency,
    $httpBackend,
    AuthenticationService,
    data,
    emptyData,
    longData;

  emptyData = {
    'count': 0,
    'results': []
  };

  var shortResultList = [
    {'title': 'ABC', 'description': 'The desc', 'topic_number': '123'},
    {'title': 'BCD', 'description': 'The desc', 'topic_number': '234'},
    {'title': 'CDE', 'description': 'The desc', 'topic_number': '345'}
  ];

  data = {
    'start': 0,
    'count': 3,
    'results': shortResultList
  };

  var longResultList = [
    {'title': 'ABC', 'description': 'The desc', 'topic_number': '123'},
    {'title': 'BCD', 'description': 'The desc', 'topic_number': '234'},
    {'title': 'CDE', 'description': 'The desc', 'topic_number': '345'},
    {'title': 'DEF', 'description': 'The desc', 'topic_number': '456'},
    {'title': 'EFG', 'description': 'The desc', 'topic_number': '567'},
    {'title': 'FGH', 'description': 'The desc', 'topic_number': '678'},
    {'title': 'GHI', 'description': 'The desc', 'topic_number': '789'},
    {'title': 'HIJ', 'description': 'The desc', 'topic_number': '890'},
    {'title': 'IJK', 'description': 'The desc', 'topic_number': '901'},
    {'title': 'JKL', 'description': 'The desc', 'topic_number': '012'}
  ];

  longData = {
    'start': 0,
    'count': 30,
    'results':longResultList
  };

  beforeEach(function(){
    mockDependency = {};
    mockDependency.params = {};
    mockDependency.params.id = 1;
    
    inject(function (_$httpBackend_, $controller, $rootScope, _AuthenticationService_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('static/views/partials/main.html').respond({});
      $httpBackend.whenGET('static/views/partials/search.html').respond({});
      AuthenticationService = _AuthenticationService_;
      scope = $rootScope.$new();
      $state = mockDependency;
      SearchCtrl = $controller('SearchCtrl', {
        $scope: scope,
        $state: mockDependency
      });
    });
  });

  it('search results should be empty before a search is attempted', function () {
    expect(scope.searchTerm).toBe('');
    expect(scope.results).toEqual({});
  });
  
  it('search results should be empty if no results are returned', function () {
    scope.searchTerm = 'xyz';
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search(1);
    $httpBackend.flush();
    expect(scope.results).toEqual(emptyData);
  });

  it('search results count should match the number of results returned ', function () {
    scope.searchTerm = 'searchTerm';
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(data);
    scope.search(1);
    $httpBackend.flush();
    expect(scope.results).toEqual(data);
    expect(scope.itemCount).toEqual(data.count);
  });

  it('searching for page 2 should change the start parameter', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=2&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search(2);
    $httpBackend.flush();
  });

  it('searching for a non-whole number should default to the first page', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search(2.5);
    $httpBackend.flush();
  });

  it('searching for a the same page and search term twice should return the cached results.', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search(1);
    scope.search(1);
    $httpBackend.flush();
  });

  it('searching for a bogus text string should search for the first page of results', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search('bogustextstring');
    $httpBackend.flush();
  });

  it('searching for "next" page should change the start parameter after a search is completed.', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search(1);
    $httpBackend.flush();
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=2&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search('next');
    expect(scope.currentPage).toEqual(2);
  });

  it('searching for "prev" page should change the start parameter after a search is completed.', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=2&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search(2);
    $httpBackend.flush();
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(emptyData);
    scope.search('prev');
    expect(scope.currentPage).toEqual(1);
  });

  it('results should include a pagination component if there are more than 10 results', function () {
    scope.searchTerm = 'searchTerm';
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics/?closed=true&page=1&page_size=10&q=' + scope.searchTerm).respond(longData);
    scope.search(1);
    $httpBackend.flush();
    expect(scope.results).toEqual(longData);
    expect(scope.numFound).toEqual(longData.count);
  });

  xit('saving a valid opportunity when logged in should result in a saved opportunity', function() {
    AuthenticationService.setAuthenticated(true);
    scope.saveOpportunity(1);
    $httpBackend.expectPOST('api/v1/topics/1/saved/').respond(201);
    $httpBackend.flush();
  });

  xit('saving a opportunity when not logged in should result in the login dialog showing', function() {
    scope.saveOpportunity(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond({});
    $httpBackend.flush();
  });

  xit('saving an invalid opportunity when logged in should result in no change to the opportunity list.', function() {
    AuthenticationService.setAuthenticated(true);
    scope.saveOpportunity(9999999);
    $httpBackend.expectPOST('api/v1/topics/9999999/saved/').respond(404);
    $httpBackend.flush();
  });

});
