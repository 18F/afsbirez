'use strict';

angular.module('sbirezApp').factory('DocumentService', function($http, $window, $q, $upload, $location, AuthenticationService) {

  var DOCUMENT_URI = 'api/v1/documents/';

  var getDocuments = function() {
    var deferred = $q.defer();
    $http.get(DOCUMENT_URI).success(function(data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  };

  var getDocument = function(documentId) {
    var deferred = $q.defer();
    $http.get(DOCUMENT_URI + documentId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  var getDocumentVersion = function(versionId) {
    var deferred = $q.defer();
    $http.get('api/v1/documentversions/' + versionId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  var uploadDocument = function(selectedFile, fileName, fileDescription, proposalId, documentId, progressCB) {
    var deferred = $q.defer();
    $upload.upload({
      url: DOCUMENT_URI + ((documentId === null) ? '' : ('' + documentId + '/')),
      fields: {'firm': parseInt($window.sessionStorage.firmid),
               'name': fileName,
               'description': fileDescription,
               'proposals': proposalId},
      method: documentId === null ? 'POST' : 'PATCH',
      file: selectedFile
    }).progress(function(evt) {
      progressCB(Math.min(100, parseInt(100.0 * evt.loaded / evt.total)));
    }).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  var removeDocument = function(documentId) {
    var deferred = $q.defer();
    $http.delete(DOCUMENT_URI + documentId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  var saveDocumentData = function(documentId, documentData) {
    var deferred = $q.defer();
    $http.patch(DOCUMENT_URI + documentId + '/', documentData).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  return {
    upload: function(selectedFile, fileName, fileDescription, proposalId, documentId, progressCB) {
      if (!AuthenticationService.isAuthenticated) {
        var path = $location.path();
        $location.path('signin').search('target', path);
      } else {
        return uploadDocument(selectedFile, fileName, fileDescription, proposalId, documentId, progressCB);
      }
    },
    remove: function(documentId) {
      if (typeof documentId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return removeDocument(documentId);
        } else {
          var path = $location.path();
          $location.path('signin').search('target', path);
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    list: function() {
      if (AuthenticationService.isAuthenticated) {
        return getDocuments();
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    get: function(documentId) {
      if (typeof documentId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return getDocument(documentId);
        } else {
          var path = $location.path();
          $location.path('signin').search('target', path);
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    getVersion: function(versionId) {
      if (typeof versionId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return getDocumentVersion(versionId);
        } else {
          var path = $location.path();
          $location.path('signin').search('target', path);
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    saveData: function(documentId, documentData) {
      if (typeof documentId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return saveDocumentData(documentId, documentData);
        } else {
          var path = $location.path();
          $location.path('signin').search('target', path);
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    }
  };
});
