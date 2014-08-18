'use strict';

describe('Controller: DocumentListCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocListCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/documents')
      .respond({'files':[
        {'name':'file1','id':1},
        {'name':'file2','id':2},
        {'name':'file3','id':3}
      ]});
    scope = $rootScope.$new();

    DocListCtrl = $controller('DocumentListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of documents to the scope', function () {
    expect(scope.docList.length).toBe(0);
    $httpBackend.flush();
    expect(scope.docList.length).toBe(3);
  });
});
