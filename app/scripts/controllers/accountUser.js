'use strict';

angular.module('sbirezApp')
  .controller('AccountUserCtrl', function ($scope, $http, $routeParams, $window) {
    console.log('Account User Ctrl');
    $scope.newKeyword = '';
    $scope.documentId = $routeParams.documentId;
    $scope.jwt = $window.sessionStorage.token;
  });
