'use strict';

angular.module('sbirezApp')
  .controller('AccountOrganizationCtrl', function ($scope, $http, $routeParams, $window) {
    console.log('Account Organization Ctrl');
    $scope.newKeyword = '';
    $scope.documentId = $routeParams.documentId;
    $scope.jwt = $window.sessionStorage.token;
  });
