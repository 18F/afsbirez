'use strict';

describe('Controller: AccountOrganizationCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AccountOrganizationCtrl,
    $rootScope,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    AccountOrganizationCtrl = $controller('AccountOrganizationCtrl', {
      $scope: scope,
      $state: {params: {'id':1}}
    });
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    $httpBackend.expectGET('api/organizations/1')
      .respond({'organization': {'id':1, 'name':'abc' }
      });
  }));

  it('should call the api to retrieve organization details', function() {
    $httpBackend.flush();
    expect(scope.organization).toBeDefined();
  });
});
