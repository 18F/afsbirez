'use strict';

describe('Controller: DocumentUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var DocCtrl,
    scope,
    upload,
    rootScope,
    $httpBackend,
    deferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $q, $injector, $rootScope, $upload) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    rootScope = $injector.get('$rootScope');
    upload = $upload;

    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});

    upload.progress = function() {};
    upload.success = function() {};

    deferred = $q.defer();
    spyOn($upload, 'upload').andReturn(deferred.promise);

    spyOn(rootScope, '$broadcast').andCallThrough();

    DocCtrl = $controller('DocumentUploadCtrl', {
      $scope: scope,
      $rootScope: rootScope
    });
  }));

  it('should contain a list of files to upload when they are selected', function () {
    var files = [
      {'$$hashKey':'013',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume.pdf',
       'size': 6171,
       'type': ''
      },
      {'$$hashKey':'014',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume2.pdf',
       'size': 3000,
       'type': ''
      }
    ];
    scope.onFileSelect(files);
    expect(scope.selectedFiles.length).toBe(2);
  });

  it('should remove a file if cancel is called with a valid index', function () {
    var files = [
      {'$$hashKey':'013',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume.pdf',
       'size': 6171,
       'type': ''
      },
      {'$$hashKey':'014',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume2.pdf',
       'size': 3000,
       'type': ''
      }
    ];
    scope.onFileSelect(files);
    scope.cancel(0);
    expect(scope.selectedFiles.length).toBe(1);
    expect(scope.selectedFiles[0].name).toBe('resume2.pdf');
  });

  it('should not remove a file if cancel is called with invalid index', function () {
    var files = [
      {'$$hashKey':'013',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume.pdf',
       'size': 6171,
       'type': ''
      },
      {'$$hashKey':'014',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume2.pdf',
       'size': 3000,
       'type': ''
      }
    ];
    scope.onFileSelect(files);
    scope.cancel(10);
    expect(scope.selectedFiles.length).toBe(2);
  });

  it('should call upload when a file is uploaded if called with a valid index', function () {
    var files = [
      {'$$hashKey':'013',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume.pdf',
       'size': 6171,
       'type': ''
      },
      {'$$hashKey':'014',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume2.pdf',
       'size': 3000,
       'type': ''
      }
    ];
    scope.onFileSelect(files);
    scope.start(0,1);
    deferred.resolve({'data': 'data', 'status':200});
    rootScope.$digest();
    expect(upload.upload).toHaveBeenCalled();
    expect(scope.selectedFiles.length).toBe(1);
    expect(scope.selectedFiles[0].name).toBe('resume2.pdf');
    //expect(rootScope.$broadcast).toHaveBeenCalledWith('fileAdded');
  });
  
  it('should not call upload when a file is uploaded if called with an invalid index', function () {
    var files = [
      {'$$hashKey':'013',
       'lastModifiedDate': new Date().getTime(),
       'name': 'resume.pdf',
       'size': 6171,
       'type': ''
      }
    ];
    scope.onFileSelect(files);
    scope.start(10,1);
    expect(upload.upload).not.toHaveBeenCalled();
  });
});
