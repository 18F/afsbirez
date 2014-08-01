'use strict';

describe('Controller: DocumentListCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocListCtrl,
    scope,
    upload,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, $upload) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/documents')
      .respond({'files':[
        {'name':'file1','id':1},
        {'name':'file2','id':2},
        {'name':'file3','id':3}
      ]});
    scope = $rootScope.$new();
    upload = $upload;

    upload.progress = function() {};
    upload.success = function() {};

    spyOn($upload,'upload').andCallThrough(function(){
      console.log('FAKE UPLOAD');
    });

    DocListCtrl = $controller('DocumentListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of documents to the scope', function () {
    expect(scope.docList.length).toBe(0);
    $httpBackend.flush();
    expect(scope.docList.length).toBe(3);
  });
  
  it('should call upload when a file is uploaded', function () {
    $httpBackend.flush();
    expect(scope.docList.length).toBe(3);
    var files = [
      {'$$hashKey':'013',
       'lastModifiedDate': new Date().getTime(),
       'name': 'dd6c6dca9589c24581e97d7bdd159401.pdf',
       'size': 6171,
       'type': ''
      }
    ];
    scope.onFileSelect(files);
    expect(upload.upload).toHaveBeenCalled();
  });
});
