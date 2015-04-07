'use strict';

describe('Controller: DocumentUploadEditCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocCtrl,
    scope,
    upload,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, $upload) {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
    $httpBackend.expectGET('api/v1/proposals/')
      .respond({'proposals':[
        {'name':'proposal1','id':1},
        {'name':'proposal2','id':2},
        {'name':'proposal3','id':3}
      ]});
    scope = $rootScope.$new();

    scope = $rootScope.$new();
    upload = $upload;

    upload.progress = function() {};
    upload.success = function() {};

    spyOn($upload,'upload').andCallThrough(function(){
      console.log('FAKE UPLOAD');
    });

    DocCtrl = $controller('DocumentUploadEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of proposals to the scope', function () {
    expect(scope.availableProposals.length).toBe(0);
    $httpBackend.flush();
    expect(scope.availableProposals.length).toBe(3);
  });

  it('should initialize the filename and index when initialize is called', function() {
    $httpBackend.flush();
    scope.initialize({'name':'filename'}, 1);
    //scope.$digest();
    expect(scope.name).toBe('filename');
    expect(scope.index).toBe(1);
  });

  it('should call cancel on the parent scope when cancelUpload is called', function() {
    $httpBackend.flush();
    scope.cancel = function() {};
    spyOn(scope, 'cancel').andCallFake(scope.cancel());
    expect(scope.cancel).toHaveBeenCalled();
  });

  it('should remove a keyword when removeKeyword is called with an existing keyword', function () {
    $httpBackend.flush();
    scope.keywords.push('key1');
    scope.keywords.push('key2');
    expect(scope.keywords.length).toBe(2);
    scope.removeKeyword('key1');
    expect(scope.keywords.length).toBe(1);
    expect(scope.keywords[0]).toBe('key2');
  });

  it('should not remove a keyword when removeKeyword is called with a bogus keyword', function () {
    $httpBackend.flush();
    scope.keywords.push('key1');
    scope.keywords.push('key2');
    expect(scope.keywords.length).toBe(2);
    scope.removeKeyword('key3');
    expect(scope.keywords.length).toBe(2);
    expect(scope.keywords[0]).toBe('key1');
  });

  it('should add a keyword when addKeyword is called with a new keyword', function () {
    $httpBackend.flush();
    scope.keywords.push('key1');
    scope.keywords.push('key2');
    expect(scope.keywords.length).toBe(2);
    scope.newKeyword = 'anothertest';
    scope.addKeyword();
    expect(scope.keywords.length).toBe(3);
    expect(scope.keywords[0]).toBe('key1');
    expect(scope.keywords[1]).toBe('key2');
    expect(scope.keywords[2]).toBe('anothertest');
  });

  it('should not add a keyword when addKeyword is called with an existing new keyword', function () {
    $httpBackend.flush();
    scope.keywords.push('key1');
    scope.keywords.push('key2');
    expect(scope.keywords.length).toBe(2);
    scope.newKeyword = 'key1';
    scope.addKeyword();
    expect(scope.keywords.length).toBe(2);
    expect(scope.keywords[0]).toBe('key1');
    expect(scope.keywords[1]).toBe('key2');
  });

  it('should start an upload when save is called', function () {
    $httpBackend.flush();
    scope.save();
    $httpBackend.expectPOST('api/v1/documents/').respond(200);
    scope.start = function() {};
    spyOn(scope, 'start').andCallFake(scope.start());
    expect(scope.start).toHaveBeenCalled();
  });
});
