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
    'numFound':  0,
    'start': 0,
    'docs': {}
  };

  data = {
    'numFound': 3,
    'start': 0,
    'docs': [
      {'title': 'ABC', 'description': 'The desc', 'topic_number': '123'},
      {'title': 'BCD', 'description': 'The desc', 'topic_number': '234'},
      {'title': 'CDE', 'description': 'The desc', 'topic_number': '345'}
    ]
  };

  longData = {
    'numFound': 30,
    'start': 0,
    'docs': [
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
    ]
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
    scope.searchTerm = "";
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics?q=' + scope.searchTerm + '&start=0&limit=10').respond(emptyData);
    scope.search(0);
    $httpBackend.flush();
    expect(scope.results).toEqual({});
  });

  it('search results count should match the number of results returned ', function () {
    scope.searchTerm = "searchTerm";
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics?q=' + scope.searchTerm + '&start=0&limit=10').respond(data);
    scope.search(0);
    $httpBackend.flush();
    expect(scope.results).toEqual(data);
    expect(scope.itemCount).toEqual(data.numFound);
  });

  it('results should include a pagination component if there are more than 10 results', function () {
    scope.searchTerm = "searchTerm";
    expect(scope.results).toEqual({});
    $httpBackend.expectGET('api/v1/topics?q=' + scope.searchTerm + '&start=0&limit=10').respond(longData);
    scope.search(0);
    $httpBackend.flush();
    expect(scope.results).toEqual(longData);
    expect(scope.itemCount).toEqual(longData.numFound);
  });

});
