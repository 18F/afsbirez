'use strict';

angular.module('sbirezApp')
  .controller('DocumentCtrl', function ($scope, $http, $state, $window, $location, DocumentService, ProposalService) {
    $scope.documentId = $state.params.id;
    $scope.jwt = $window.sessionStorage.token;
    $scope.errorMsg = '';
    $scope.updated = false;
    $scope.proposals = [];

    DocumentService.get(parseInt($scope.documentId)).then(function(data) {
      $scope.data = data;
      for (var i = 0; i < $scope.data.proposals.length; i++) {
        ProposalService.get($scope.data.proposals[i]).then(function(data) {
          $scope.proposals.push(data);
        });
      }
    });

    $scope.save = function() {
      DocumentService.saveData(parseInt($scope.documentId), {'description':$scope.data.description}).then(function(data) {
        $scope.updated = true;
      }, function(data, status) {
        $scope.errorMsg = data;
        $scope.updated = false;
      });
    };

    $scope.remove = function() {
      DocumentService.remove(parseInt($scope.documentId)).then(function(data) {
        console.log('file removed...need to redirect.');
        $location.path('/app/documents');
      });
    };
  });
