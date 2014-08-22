'use strict';

angular.module('sbirezApp')
  .controller('DocumentUploadCtrl', function ($rootScope, $scope, $http, $timeout, $upload, $window) {
    $scope.jwt = $window.sessionStorage.token;
    $scope.progress = [];
    $scope.upload = [];

    var uploadSuccess = function(data, status, index) {
      $scope.selectedFiles.splice(index, 1);
      $scope.upload.splice(index, 1);
      $scope.progress.splice(index, 1);
      $rootScope.$broadcast('fileAdded', data);
    };

    $scope.cancel = function(index) {
      $scope.selectedFiles.splice(index, 1);
      $scope.upload.splice(index, 1);
      $scope.progress.splice(index, 1);
    };

    $scope.onFileSelect = function($files) {
      $scope.selectedFiles = $files;
      $scope.progress = [];

      if ($scope.upload && $scope.upload.length > 0) {
        for (var i = 0; i < $scope.upload.length; i++) {
          if ($scope.upload[i] !== null) {
            $scope.upload[i].abort();
          }
        }
      }

      $scope.upload = [];

      for (var j = 0; j < $scope.selectedFiles.length; j++) {
        $scope.progress[j] = -1;
      }
      console.log($scope.selectedFiles);
    };

    $scope.start = function(index, id) {
      $scope.progress[index] = 0;
      $scope.errorMsg = null;
      if (index < $scope.selectedFiles.length) {
        $scope.upload[index] = $upload.upload({
          url: '/api/documents/' + id,
          method: 'POST',
          file: $scope.selectedFiles[index]
        });
        $scope.upload[index].then(function(response) {
          uploadSuccess(response.data, response.status, index);
        }, function(response) {
          if (response.status > 0) {
            $scope.errorMsg = response.status + ': ' + response.data;
          }
        }, function(evt) {
          $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      }
    };
  });
