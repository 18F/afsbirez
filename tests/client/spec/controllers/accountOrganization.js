'use strict';

describe('Controller: AccountOrganizationCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var AccountOrganizationCtrl,
    $rootScope,
    scope,
    $httpBackend,
    UserService,
    $q,
    data;

  data = {'id':1, 'name':'abc', 'naics':['111'], 'address':null, 'point_of_contact':null };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _$httpBackend_, _UserService_, $q, $state) {
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
      .respond(data);
    $httpBackend.whenGET('api/v1/naics/111').respond({'code': '111', 'description': 'Something about farming'});

//{"id":2,"name":"Dave Best","tax_id":null,"sbc_id":null,"duns_id":null,"cage_code":null,"website":null,"address":null,"point_of_contact":null,"founding_year":null,"naics":[],"phase1_count":null,"phase1_year":null,"phase2_count":null,"phase2_year":null,"phase2_employees":null,"current_employees":null,"patent_count":null,"total_revenue_range":null,"revenue_percent":null}

    AccountOrganizationCtrl = $controller('AccountOrganizationCtrl', {
      $scope: scope,
      $state: {params: {'id':1}, go: function() {}}
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
    $httpBackend.expectPOST('api/v1/firms/').respond(data);
    $httpBackend.flush();
  });

  it('should put data to the server if a firm is defined on submit', function() {
    $httpBackend.flush();
    expect(scope.orgId).toBeDefined();
    scope.updateFirm();
    $httpBackend.expectPATCH('api/v1/firms/1/').respond(data);
    $httpBackend.flush();
  });
});
