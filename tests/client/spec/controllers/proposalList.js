'use strict';

describe('Controller: ProposalListCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var PropListCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    $httpBackend.expectGET('api/proposals')
      .respond({'proposals':[
        {'name':'file1','id':1},
        {'name':'file2','id':2}
      ]});
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
