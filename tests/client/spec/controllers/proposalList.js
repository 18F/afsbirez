'use strict';

describe('Controller: ProposalListCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var PropListCtrl,
    scope,
    ProposalService,
    $httpBackend,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _$q_, _ProposalService_) {
    ProposalService = _ProposalService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    spyOn(ProposalService, 'list').andCallFake(function() {
      var deferred = $q.defer();
      deferred.resolve({'results':[
        {'name':'file1','id':1},
        {'name':'file2','id':2}
      ]});
      return deferred.promise;
    });
    scope = $rootScope.$new();

    PropListCtrl = $controller('ProposalListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of proposals to the scope', function () {
    expect(scope.proposalList.length).toBe(0);
    $httpBackend.flush();
    expect(scope.proposalList.length).toBe(2);
  });
});
