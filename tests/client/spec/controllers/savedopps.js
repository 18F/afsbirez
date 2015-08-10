'use strict';

describe('Controller: SavedOppsCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var SavedOppsCtrl,
    scope,
    $state,
    AuthenticationService,
    mockDependency,
    $httpBackend,
    data,
    emptyData,
    propData;

  emptyData = {
    'title': '',
    pre_release_date:'',
    proposals_begin_date:'',
    proposals_end_date:''
  };

  data = {
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

  propData = {
    'results': [{
      'id': 2,
      'topic': 123
    }]
  };

  beforeEach(function(){
    mockDependency = {};
    mockDependency.params = {};
    mockDependency.params.id = 1;
 
    inject(function (_$httpBackend_, $controller, $rootScope, _AuthenticationService_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('static/views/partials/main.html').respond({});
      $httpBackend.whenGET('static/views/partials/search.html').respond({});
      scope = $rootScope.$new();
      $state = mockDependency;
      AuthenticationService = _AuthenticationService_;
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
    AuthenticationService.setAuthenticated(true);
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(data);
    $httpBackend.expectGET('api/v1/proposals/').respond(data);
    $httpBackend.flush();
    expect(scope.data.results[0].proposal).toBe(2);
  });

  it('page should not load if not logged in', function () {
    expect(scope.data).toEqual({});
    $httpBackend.expectGET('api/v1/topics/?closed=true&saved=true').respond(404);
    $httpBackend.flush();
  });

});
