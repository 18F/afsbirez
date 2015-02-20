'use strict';

angular.module('sbirezApp')
  .controller('AccountOrganizationCtrl', function ($scope, $http, $state) {
    console.log('Account Organization Ctrl');
    $scope.orgId = $state.params.id;

    $http.get('api/organizations/' + $scope.orgId).success(function(data) {
      $scope.organization = data.organization;
    });
  });
