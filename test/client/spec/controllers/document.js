'use strict';

describe('Controller: DocumentCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocCtrl,
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
    mockDependency.documentId = 1;
    
    inject(function (_$httpBackend_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $routeParams = mockDependency;
      DocCtrl = $controller('DocumentCtrl', {
        $scope: scope,
        $routeParams: mockDependency
      });
    });
  });

  it('should attach a document to the scope', function () {
    expect(scope.data).toBeUndefined();
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    expect(scope.data).toBeDefined();
  });
  
  it('should post a document when save is called', function () {
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    $httpBackend.expectPOST('api/documents/1').respond(200, '');
    scope.save();
    $httpBackend.flush();
  });

  it('should send a delete command to the server when remove is called', function () {
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    $httpBackend.expectDELETE('api/documents/1').respond(200, '');
    scope.remove();
    $httpBackend.flush();
  });

  it('should remove a keyword when removeKeyword is called with an existing keyword', function () {
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    expect(scope.data.keywords.length).toBe(2);
    scope.removeKeyword('test');
    expect(scope.data.keywords.length).toBe(1);
    expect(scope.data.keywords[0]).toBe('resume');
  });

  it('should not remove a keyword when removeKeyword is called with a bogus keyword', function () {
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    expect(scope.data.keywords.length).toBe(2);
    scope.removeKeyword('anothertest');
    expect(scope.data.keywords.length).toBe(2);
    expect(scope.data.keywords[0]).toBe('resume');
    expect(scope.data.keywords[1]).toBe('test');
  });

  it('should add a keyword when addKeyword is called with a new keyword', function () {
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    expect(scope.data.keywords.length).toBe(2);
    scope.newKeyword = 'anothertest';
    scope.addKeyword();
    expect(scope.data.keywords.length).toBe(3);
    expect(scope.data.keywords[0]).toBe('resume');
    expect(scope.data.keywords[1]).toBe('test');
    expect(scope.data.keywords[2]).toBe('anothertest');
  });

  it('should not add a keyword when addKeyword is called with an existing new keyword', function () {
    $httpBackend.expectGET('api/documents/1').respond(data);
    $httpBackend.flush();
    expect(scope.data.keywords.length).toBe(2);
    scope.newKeyword = 'test';
    scope.addKeyword();
    expect(scope.data.keywords.length).toBe(2);
    expect(scope.data.keywords[0]).toBe('resume');
    expect(scope.data.keywords[1]).toBe('test');
  });
});
