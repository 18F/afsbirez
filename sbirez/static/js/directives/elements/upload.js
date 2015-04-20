'use strict';

angular.module('sbirezApp').directive('upload', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      upload: '=',
      storage: '=',
      proposal: '@'
    },
    templateUrl: 'static/views/partials/elements/upload.html',
    controller: ['$scope', 'DocumentService',
      function ($scope, DocumentService) {
        $scope.element = $scope.upload;
        $scope.fileId = null;
        if ($scope.storage !== undefined && $scope.storage !== null) {
          $scope.fileId = parseInt($scope.storage);
          if ($scope.fileId) {
            DocumentService.get($scope.fileId).then(function(data) {
              $scope.selectedFiles = [];
              $scope.selectedFiles[0] = data;
              $scope.selectedFiles[0].filename = data.name;
            }, function() {
              $scope.fileId = null;
              $scope.selectedFiles = [];
              $scope.storage = null;
            });
          }
        }

        $scope.onFileSelect = function($files) {
          $scope.selectedFiles = $files;
          $scope.progress = [];

          for (var j = 0; j < $scope.selectedFiles.length; j++) {
            $scope.selectedFiles[j].filename = $scope.selectedFiles[j].name;
            $scope.progress[j] = -1;
          }
        };

        $scope.start = function(index) {
          DocumentService.upload($scope.selectedFiles[index],
            $scope.selectedFiles[index].filename,
            $scope.selectedFiles[index].description,
            $scope.proposal,
            $scope.fileId,
            function(val) {console.log('progress', val);
          }).then(function(data) {
            $scope.storage = data.id;
            $scope.progress[index] = 0;
          });
        };
      }
    ]
  };
});
