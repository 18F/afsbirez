'use strict';

describe('Controller: DocumentCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocCtrl,
    scope,
    $state,
    mockDependency,
    $httpBackend,
    $window,
    $q,
    AuthenticationService,
    DocumentService,
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
    
    inject(function (_$httpBackend_, $controller, $rootScope, _$window_, _$q_, _AuthenticationService_, _DocumentService_) {
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $httpBackend.whenGET('static/views/partials/main.html').respond({});
      $httpBackend.whenGET('static/views/partials/search.html').respond({});
      scope = $rootScope.$new();
      AuthenticationService = _AuthenticationService_;
      DocumentService = _DocumentService_;
      $state = mockDependency;
      $q = _$q_;
      spyOn(DocumentService, 'get').andCallFake(function() {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      });
      DocCtrl = $controller('DocumentCtrl', {
        $scope: scope,
        $state: mockDependency
      });
    });
  });

  it('should attach a document to the scope', function () {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    scope.documentId = 1;
    expect(scope.data).toBeUndefined();
    $httpBackend.flush();
    expect(scope.data).toBeDefined();
  });
  
  it('should post a document when save is called', function () {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    $httpBackend.expectPATCH('api/v1/documents/1/').respond(200, '');
    scope.save();
    $httpBackend.flush();
  });

  it('should send a delete command to the server when remove is called', function () {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    $httpBackend.expectDELETE('api/v1/documents/1/').respond(200, '');
    scope.remove();
    $httpBackend.expectGET('static/views/partials/appmain.html').respond(200, '');
    $httpBackend.expectGET('static/views/partials/activity.html').respond(200, '');
    $httpBackend.expectGET('static/views/partials/document.html').respond(200, '');
    $httpBackend.expectGET('static/views/partials/documentList.html').respond(200, '');
    $httpBackend.flush();
  });
});
