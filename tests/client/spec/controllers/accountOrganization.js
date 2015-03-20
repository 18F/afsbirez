'use strict';

describe('Controller: AccountOrganizationCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AccountOrganizationCtrl,
    $rootScope,
    scope,
    $httpBackend,
    UserService,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$httpBackend_, _UserService_, $q) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    UserService = _UserService_;
    scope = $rootScope.$new();
    spyOn(UserService, 'getUserDetails').andCallFake(function() {
      var deferred = $q.defer();
      deferred.resolve({'id':1, 'name':'Test User', 'firm':1});
      return deferred.promise;
    });
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    $httpBackend.expectGET('api/v1/firms/1/')
      .respond({'organization': {'id':1, 'name':'abc' }
      });

    AccountOrganizationCtrl = $controller('AccountOrganizationCtrl', {
      $scope: scope,
      $state: {params: {'id':1}}
    });
  }));

  it('should call the api to retrieve organization details', function() {
    $httpBackend.flush();
    expect(scope.firm).toBeDefined();
  });

  it('should post data to the server if a firm is not defined on submit', function() {
    $httpBackend.flush();
    scope.orgId = null;
    scope.updateFirm();
    $httpBackend.expectPOST('api/v1/firms/');
  });

  it('should put data to the server if a firm is defined on submit', function() {
    $httpBackend.flush();
    scope.updateFirm();
    $httpBackend.expectPOST('api/v1/firms/1/');

  });
});
