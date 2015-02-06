'use strict';

describe('Controller: TopicCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var TopicCtrl,
    scope,
    $state,
    mockDependency,
    $httpBackend,
    data,
    emptyData;

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

  beforeEach(function(){
    mockDependency = {};
    mockDependency.params = {};
    mockDependency.params.id = 1;
    mockDependency.params.fromSearch = {'q': 'searchTerm'};
 
    inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('static/views/partials/main.html').respond({});
      $httpBackend.whenGET('static/views/partials/search.html').respond({});
      scope = $rootScope.$new();
      $state = mockDependency;
      TopicCtrl = $controller('TopicCtrl', {
        $scope: scope,
        $state: mockDependency
      });
    });
  });

  it('page should be empty before request is made', function () {
    expect(scope.data).toEqual({});
  });
  
  it('page should be populated when a request for a valid topic is made', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/topics/1').respond(data);
    $httpBackend.flush();
    expect(scope.data).toEqual(data);
  });

  it('page should display an error message if an invalid topic is requested', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/topics/1').respond(notFound);
    $httpBackend.flush();
    expect(scope.data).toEqual({});
  });

  it('page should display a back button if coming from a search', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/topics/1').respond(data);
    $httpBackend.flush();
    expect(scope.data).toEqual(data);
  });

});
