'use strict';

angular.module('sbirezApp')
  .controller('AccountOrganizationCtrl', function ($scope, $http, $state, $q, UserService) {

    $scope.orgId = null;
    $scope.firm = {};
    $scope.firm.point_of_contact = {};
    $scope.firm.address = {};

    UserService.getUserDetails().then(function(data) {
      $scope.orgId = data.firm;
      if ($scope.orgId !== null && $scope.orgId !== undefined) {
        $http.get('api/v1/firms/' + $scope.orgId + '/').success(function(data) {
          console.log('get org', data);
          $scope.firm = data;
        });
      }
    }, function(error) {
      console.log(error);
    });

    $scope.updateFirm = function() {
      if ($scope.orgId === null || $scope.orgId === undefined) {
        $http.post('api/v1/firms/', $scope.firm).success(function(data) {
          $scope.firm = data;
          $scope.orgId = data.id; 
        }).error(function(data,status) {
          console.log('update', data, status);
        });
      } else {
        $http.put('api/v1/firms/' + $scope.orgId + '/', $scope.firm).success(function(data) {
          $scope.firm = data;
        }).error(function(data, status) {
          console.log('update', data, status);
        });
      }
    };

  });
