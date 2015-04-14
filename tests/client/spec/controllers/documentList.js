'use strict';

describe('Controller: DocumentListCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocListCtrl,
    scope,
    $httpBackend,
    $window,
    $q,
    AuthenticationService,
    DocumentService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _$window_, _$q_, _AuthenticationService_, _DocumentService_) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $q = _$q_;
    AuthenticationService = _AuthenticationService_;
    DocumentService = _DocumentService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    scope = $rootScope.$new();
    spyOn(DocumentService, 'list').andCallFake(function() {
      var deferred = $q.defer();
      deferred.resolve({'results':[
        {'name':'file1','id':1},
        {'name':'file2','id':2},
        {'name':'file3','id':3}
      ]});
      return deferred.promise;
    });
    DocListCtrl = $controller('DocumentListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of documents to the scope', function () {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    expect(scope.docList.length).toBe(0);
    $httpBackend.flush();
    expect(scope.docList.length).toBe(3);
  });
});
