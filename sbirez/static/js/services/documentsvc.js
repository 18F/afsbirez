'use strict';

angular.module('sbirezApp').factory('DocumentService', function($http, $window, $q, $upload, DialogService, AuthenticationService) {

  var DOCUMENT_URI = 'api/v1/documents/';
  var results = {};

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
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var uploadDocument = function(selectedFile, fileName, fileDescription, progressCB) {
    var deferred = $q.defer();
    $upload.upload({
      url: '/api/v1/documents/',
      data: {'firm': parseInt($window.sessionStorage.firmid),
             'name': fileName,
             'description': fileDescription},
      file: selectedFile
    }).progress(function(evt) {
      progressCB(Math.min(100, parseInt(100.0 * evt.loaded / evt.total)));
    }).success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var removeDocument = function(documentId) {
    var deferred = $q.defer();
    $http.delete(DOCUMENT_URI + documentId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  return {
    upload: function(selectedFile, fileName, fileDescription, progressCB) {
      if (!AuthenticationService.isAuthenticated) {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return uploadDocument(selectedFile, fileName, fileDescription, progressCB);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      } else {
        return uploadDocument(selectedFile, fileName, fileDescription, progressCB);
      }
    },
    remove: function(documentId) {
      // remove opportunity from saved opps
      if (typeof documentId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return removeDocument(documentId);
        } else {
          return DialogService.openLogin().then(function(data) {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          });
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
        return DialogService.openLogin().then(function(data) {
          var deferred = $q.defer();
          deferred.reject(new Error('Failed to authenticate'));
          return deferred.promise;
        });
      }
    },
    get: function(documentId) {
      if (typeof documentId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return getDocument(documentId);
        } else {
          return DialogService.openLogin().then(function(data) {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          });
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    }
  };
});
