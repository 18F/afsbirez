'use strict';

angular.module('sbirezApp')
  .controller('DocumentCtrl', function ($scope, $http, $state, $window) {
    $scope.newKeyword = '';
    $scope.documentId = $state.params.id;
    $scope.jwt = $window.sessionStorage.token;
    $scope.errorMsg = '';
    $scope.updated = false;

    $http.get('api/v1/documents/' + $scope.documentId + '/').success(function(data) {
      $scope.data = data;
    });

    $scope.save = function() {
      $scope.data.changelog.push({'message': 'Properties changed.', 'dateChanged': new Date().getTime()});
      $http.post('api/v1/documents/' + $scope.documentId + '/', $scope.data).success(function() {
        $scope.updated = true;
      }).error(function(message) {
        $scope.errorMsg = message.message;
        $scope.updated = false;
      });
    };

    $scope.remove = function() {
      $http.delete('api/v1/documents/' + $scope.documentId + '/').success(function() {
        console.log('file removed...need to redirect.');
      });
    };

    $scope.removeKeyword = function(keyword) {
      for (var i = $scope.data.keywords.length - 1; i >= 0; i--) {
        if ($scope.data.keywords[i] === keyword) {
          $scope.data.keywords.splice(i, 1);
        }
      }
    };

    $scope.addKeyword = function() {
      var found = false;
      for (var i = $scope.data.keywords.length - 1; i >= 0; i--) {
        if ($scope.data.keywords[i] === $scope.newKeyword) {
          found = true;
          break;
        }
      }

      if (found === false) {
        $scope.data.keywords.push($scope.newKeyword);
      }

      $scope.newKeyword = '';
    };
  });
