'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var SearchCtrl,
    scope,
    $state,
    mockDependency,
    $httpBackend,
    data,
    emptyData,
    longData;

  emptyData = {
    'numFound': 0,
    '_embedded': {'ea:topic': []}
  };

  var shortResultList = [
    {'title': 'ABC', 'description': 'The desc', 'topic_number': '123'},
    {'title': 'BCD', 'description': 'The desc', 'topic_number': '234'},
    {'title': 'CDE', 'description': 'The desc', 'topic_number': '345'}
  ];

  data = {
    'start': 0,
    'numFound': 3,
    '_embedded': {
      'ea:topic': shortResultList
    }
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
    'numFound': 30,
    '_embedded': {
      'ea:topic':longResultList
    }
  };

  beforeEach(function(){
    mockDependency = {};
    mockDependency.params = {};
    mockDependency.params.id = 1;
    
    inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('static/views/partials/main.html').respond({});
      $httpBackend.whenGET('static/views/partials/search.html').respond({});
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
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(emptyData);
    scope.search(0);
    $httpBackend.flush();
    expect(scope.results).toEqual(emptyData);
  });

  it('search results count should match the number of results returned ', function () {
    scope.searchTerm = 'searchTerm';
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(data);
    scope.search(0);
    $httpBackend.flush();
    expect(scope.results).toEqual(data);
    expect(scope.itemCount).toEqual(data.numFound);
  });

  it('searching for page 2 should change the start parameter', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=11').respond(emptyData);
    scope.search(1);
    $httpBackend.flush();
  });

  it('searching for a non-whole number should default to the first page', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(emptyData);
    scope.search(2.5);
    $httpBackend.flush();
  });

  it('searching for a the same page and search term twice should return the cached results.', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(emptyData);
    scope.search(0);
    scope.search(0);
    $httpBackend.flush();
  });

  it('searching for a bogus text string should search for the first page of results', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(emptyData);
    scope.search('bogustextstring');
    $httpBackend.flush();
  });

  it('searching for "next" page should change the start parameter after a search is completed.', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(emptyData);
    scope.search(0);
    $httpBackend.flush();
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=11').respond(emptyData);
    scope.search('next');
  });

  it('searching for "prev" page should change the start parameter after a search is completed.', function () {
    scope.searchTerm = 'searchTerm';
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=11').respond(emptyData);
    scope.search(1);
    $httpBackend.flush();
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(emptyData);
    scope.search('prev');
  });

  it('results should include a pagination component if there are more than 10 results', function () {
    scope.searchTerm = 'searchTerm';
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics?limit=10&q=' + scope.searchTerm + '&start=1').respond(longData);
    scope.search(0);
    $httpBackend.flush();
    expect(scope.results).toEqual(longData);
    expect(scope.numFound).toEqual(longData.numFound);
  });

});
