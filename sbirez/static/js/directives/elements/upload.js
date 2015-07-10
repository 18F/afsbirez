'use strict';

angular.module('sbirezApp').directive('upload', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      upload: '=',
      proposal: '@',
      multiplename: '=?',
      multipletoken: '=?'
    },
    templateUrl: 'static/views/partials/elements/upload.html',
    controller: ['$scope', 'DocumentService', 'ProposalService',
      function ($scope, DocumentService, ProposalService) {
        $scope.element = $scope.upload;
        var fileId = null;
        $scope.validationstorage = '';
        $scope.visible = true;

        var validationCallback = function(data) {
          $scope.validationstorage = data;
        };

        var askIfCallback = function(data) {
          $scope.visible = (data === true || data === 'true');
        };

        $scope.storage = ProposalService.register($scope.element,
                                 validationCallback,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipletoken);
        if (typeof $scope.storage === 'object') {
          $scope.storage = undefined; 
        }

        $scope.fieldName = $scope.element.human;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        $scope.fieldToken = $scope.element.name;
        if ($scope.multipletoken !== undefined) {
          $scope.fieldToken = $scope.element.name + '_' + $scope.multipletoken;
        }

        $scope.apply = function() {
          ProposalService.apply($scope.element, $scope.storage, $scope.multipletoken);
        };

        if ($scope.storage !== undefined) {
          fileId = parseInt($scope.storage);
          if (fileId) {
            DocumentService.get(fileId).then(function(data) {
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
            $scope.selectedFiles[index].filename,
            $scope.proposal,
            fileId,
            function(val) {
              console.log('progress', val);
              $scope.progress[index] = val;
          }).then(function(data) {
            $scope.storage = data.id;
            $scope.apply();
          });
        };
      }
    ]
  };
});
