'use strict';

describe('Controller: ProposalCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var PropCtrl,
    scope,
    $routeParams,
    mockDependency,
    $httpBackend,
    $window,
    $q,
    ProposalService,
    AuthenticationService,
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
    
    inject(function (_$httpBackend_, $controller, $rootScope, _$window_, _$q_, _ProposalService_, _AuthenticationService_) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $routeParams = mockDependency;
      ProposalService = _ProposalService_;
      AuthenticationService = _AuthenticationService_;
      $q = _$q_;
      $window = _$window_;
      $window.sessionStorage.userid = 1;
      AuthenticationService.setAuthenticated(true);
      spyOn(ProposalService, 'load').andCallFake(function() {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      });
      PropCtrl = $controller('ProposalCtrl', {
        $scope: scope,
        $state: mockDependency
      });
    });
  });

  it('should attach a proposal to the scope', function () {
    expect(scope.data).toBeDefined();
  });
});
