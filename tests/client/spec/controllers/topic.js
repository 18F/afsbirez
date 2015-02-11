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
    'title': '',
    pre_release_date:'',
    proposals_begin_date:'',
    proposals_end_date:''
  };

  data = {
    'title': 'The title.',
    pre_release_date:'',
    proposals_begin_date:'',
    proposals_end_date:''
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
    expect(scope.data.title).toEqual(data.title);
  });

  it('page should display an error message if an invalid topic is requested', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/topics/1').respond(500);
    $httpBackend.flush();
    expect(scope.errorMsg).toEqual('The topic you are looking for does not exist.');
  });

});
