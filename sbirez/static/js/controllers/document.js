'use strict';

angular.module('sbirezApp')
  .controller('DocumentCtrl', function ($scope, $http, $state, $window) {
    $scope.newKeyword = '';
    $scope.documentId = $state.params.id;
    $scope.jwt = $window.sessionStorage.token;
    $scope.errorMsg = '';
    $scope.updated = false;

    $http.get('api/documents/' + $scope.documentId).success(function(data) {
      $scope.data = data;
    });

    $scope.save = function() {
      console.log($scope.data);
      $scope.data.changelog.push({'message': 'Properties changed.', 'dateChanged': new Date().getTime()});
      $http.post('api/documents/' + $scope.documentId, $scope.data).success(function() {
        console.log('metadata saved');
        $scope.updated = true;
      }).error(function(message) {
        $scope.errorMsg = message.message;
        console.log(message);
        $scope.updated = false;
      });
    };

    $scope.remove = function() {
      console.log('Removing file');
      $http.delete('api/documents/' + $scope.documentId).success(function() {
        console.log('file removed...need to redirect.');
      });
    };

    $scope.removeKeyword = function(keyword) {
      for (var i = $scope.data.keywords.length - 1; i >= 0; i--) {
        if ($scope.data.keywords[i] === keyword) {
          console.log('removing ' + keyword);
          $scope.data.keywords.splice(i, 1);
        }
      }
    };

    $scope.addKeyword = function() {
      console.log('addKeyword: ' + $scope.newKeyword);
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
