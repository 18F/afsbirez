'use strict';

angular.module('sbirezApp')
  .controller('DocumentCtrl', function ($scope, $http, $routeParams, $window) {
    console.log('DocumentCtrl ' + $routeParams.documentId);
    $scope.documentId = $routeParams.documentId;
    $scope.jwt = $window.sessionStorage.token;
    $http.get('api/documents/' + $routeParams.documentId).success(function(data) {
      // doc description should contain
      // name
      // size
      // upload date
      // description
      // keyword list
      // proposal list
      // changelog
      $scope.data = data;
      console.log(data);
    });

  $scope.save = function() {
    console.log('here');
    var data = {
      "id": $scope.documentId,
      "name": $scope.data.name,
      "uploaded": $scope.data.uploaded,
      "keywords": ["resume", "part123"],
      "proposals": ["123", "234"]
    };          
    $http.post('api/documents/' + $scope.documentId, data).success(function(data) {
    });
  };
  });
