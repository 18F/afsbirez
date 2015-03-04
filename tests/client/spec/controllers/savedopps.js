'use strict';

describe('Controller: SavedOppsCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var SavedOppsCtrl,
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
      SavedOppsCtrl = $controller('SavedOppsCtrl', {
        $scope: scope,
        $state: mockDependency
      });
    });
  });

  it('page should be empty before request is made', function () {
    expect(scope.data).toEqual({});
  });
  
  it('page should be populated when a request is made while logged in', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/savedtopics/').respond(data);
    $httpBackend.flush();
  });

  it('page should display an error message if not logged in', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/savedtopics/').respond(404);
    $httpBackend.flush();
    //expect(scope.errorMsg).toEqual('The topic you are looking for does not exist.');
  });

  it('clicking the remove button should remove a topic if logged in', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/savedtopics/').respond({});
    $httpBackend.flush();
    scope.removeOpportunity(1);
    $httpBackend.expectDELETE('api/v1/savedtopics/').respond(200);
    //expect(scope.errorMsg).toEqual('The topic you are looking for does not exist.');
  });
});
