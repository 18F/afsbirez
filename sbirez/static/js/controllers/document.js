'use strict';

angular.module('sbirezApp')
  .controller('DocumentCtrl', function ($scope, $http, $state, $window, $location, DocumentService, ProposalService) {
    $scope.documentId = $state.params.id;
    $scope.jwt = $window.sessionStorage.token;
    $scope.errorMsg = '';
    $scope.updated = false;
    $scope.proposals = [];
    $scope.versions = [];

    var pushProposal = function(data) {
      $scope.proposals.push(data);
    };

    var pushVersion = function(data) {
      $scope.versions.push(data);
    };

    DocumentService.get(parseInt($scope.documentId)).then(function(data) {
      $scope.data = data;
      if ($scope.data.proposals !== undefined) {
        for (var i = 0; i < $scope.data.proposals.length; i++) {
          ProposalService.get($scope.data.proposals[i]).then(pushProposal);
        }
      }
      if ($scope.data.versions !== undefined) {
        for (var j = 0; j < $scope.data.versions.length; j++) {
          DocumentService.getVersion($scope.data.versions[j]).then(pushVersion);
        }
      }
    });

    $scope.save = function() {
      DocumentService.saveData(parseInt($scope.documentId), {'description':$scope.data.description}).then(function() {
        $scope.updated = true;
      }, function(data) {
        $scope.errorMsg = data;
        $scope.updated = false;
      });
    };

    $scope.remove = function() {
      DocumentService.remove(parseInt($scope.documentId)).then(function() {
        console.log('file removed...need to redirect.');
        $location.path('/app/documents');
      });
    };
  });
