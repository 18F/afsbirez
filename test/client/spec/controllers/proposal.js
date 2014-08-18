'use strict';

describe('Controller: ProposalCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var PropCtrl,
    scope,
    $routeParams,
    mockDependency,
    $httpBackend,
    data;

  data = {
    'name': 'filename',
    'uploaded': new Date().getTime(),
    'size': 1000,
    'proposals': [{'id': 1, 'name': 'prop123'}, {'id':2, 'name': 'prop2'}],
    'keywords':['resume', 'test'],
    'changelog': [
      {'message':'File uploaded', 'dateChanged': new Date().getTime()}
    ],
    'description': 'This is a description of the file.'
  };

  beforeEach(function(){
    mockDependency = {};
    mockDependency.params = {};
    mockDependency.params.id = 1;
    
    inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $routeParams = mockDependency;
      PropCtrl = $controller('ProposalCtrl', {
        $scope: scope,
        $state: mockDependency
      });
    });
  });

  it('should attach a proposal to the scope', function () {
    expect(scope.data).toBeUndefined();
    $httpBackend.whenGET('partials/main.html').respond({});
    $httpBackend.whenGET('partials/search.html').respond({});
    $httpBackend.expectGET('api/proposals/1').respond(data);
    $httpBackend.flush();
    expect(scope.data).toBeDefined();
  });
});
