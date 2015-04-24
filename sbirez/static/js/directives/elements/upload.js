'use strict';

angular.module('sbirezApp').directive('upload', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      upload: '=',
      storage: '=',
      proposal: '@',
      validationstorage: '='
    },
    templateUrl: 'static/views/partials/elements/upload.html',
    controller: ['$scope', 'DocumentService',
      function ($scope, DocumentService) {
        $scope.element = $scope.upload;
        var fileId = null;
        if ($scope.storage !== undefined) {
          fileId = parseInt($scope.storage);
          if (fileId) {
            DocumentService.get(fileId).then(function(data) {
              $scope.selectedFiles = [];
              $scope.selectedFiles[0] = data;
              $scope.selectedFiles[0].filename = data.name;
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

        $scope.start = function(index, id) {
          DocumentService.upload($scope.selectedFiles[index],
            $scope.selectedFiles[index].filename,
            $scope.selectedFiles[index].description,
            $scope.proposal,
            function(val) {console.log('progress', val);
          }).then(function(data) {
            $scope.storage = data.id;
          });
        };
      }
    ]
  };
});
