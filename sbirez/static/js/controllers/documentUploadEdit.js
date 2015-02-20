'use strict';

angular.module('sbirezApp')
  .controller('DocumentUploadEditCtrl', function ($scope, $http, $routeParams, $window) {
    $scope.newKeyword = '';
    $scope.jwt = $window.sessionStorage.token;
    $scope.keywords = [];
    $scope.proposals = [];
    $scope.changelog = [];
    $scope.index = 0;
    $scope.availableProposals = [];
    $scope.selectedProposal = 'Please select a proposal';

    $http.get('api/proposals').success(function(data) {
      $scope.availableProposals = data.proposals;
    });

    $scope.initialize = function(file, index) {
      $scope.name = file.name;
      $scope.index = index;
    };

    $scope.save = function() {
      var data = {};
      var propId = 0;
      data.name = $scope.name;
      data.description = $scope.description;
      data.keywords = $scope.keywords;
      data.changelog = $scope.changelog;
      data.proposals = $scope.proposals;
      if ($scope.selectedProposal !== 'Please select a proposal') {
        var index = 0;
        for (;index<$scope.availableProposals.length;index++) {
          if ($scope.availableProposals[index].name === $scope.selectedProposal) {
            propId = $scope.availableProposals[index].id;
            break;
          }
        }
        data.proposals.push({'name':$scope.selectedProposal, 'id':propId});
      }
      data.changelog.push({'message': 'Added', 'dateChanged': new Date().getTime()});
      
      $http.post('api/documents/', data).success(function(data) {
        $scope.start($scope.index, data.id);
      });
    };

    $scope.cancelUpload = function() {
      console.log('Canceling upload...');
      $scope.cancel($scope.index);
    };

    $scope.removeKeyword = function(keyword) {
      for (var i = $scope.keywords.length - 1; i >= 0; i--) {
        if ($scope.keywords[i] === keyword) {
          $scope.keywords.splice(i, 1);
        }
      }
    };

    $scope.addKeyword = function() {
      var found = false;
      for (var i = $scope.keywords.length - 1; i >= 0; i--) {
        if ($scope.keywords[i] === $scope.newKeyword) {
          found = true;
          break;
        }
      }

      if (found === false) {
        $scope.keywords.push($scope.newKeyword);
      }

      $scope.newKeyword = '';
    };
  });
