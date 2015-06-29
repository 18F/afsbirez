'use strict';

angular.module('sbirezApp')
  .controller('AccountOrganizationCtrl', function ($scope, $http, $state, $q, $window, $rootScope, UserService) {

    $scope.orgId = null;
    $scope.firm = {};
    $scope.firm.point_of_contact = {};
    $scope.firm.address = {};
    $scope.validationData = {};
    $scope.errorState = false;
    $rootScope.bodyClass = 'company';

    UserService.getUserDetails().then(function(data) {
      $scope.orgId = data.firm;
      if ($scope.orgId !== null && $scope.orgId !== undefined) {
        $http.get('api/v1/firms/' + $scope.orgId + '/').success(function(data) {
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
          $window.sessionStorage.firmid = data.id;
        }).error(function(data,status) {
          console.log('update', data, status);
        });
      } else {
        if ($scope.firm.address === null) {
          delete $scope.firm.address;
        }
        if ($scope.firm.point_of_contact === null) {
          delete $scope.firm.point_of_contact;
        }
       
        $http.patch('api/v1/firms/' + $scope.orgId + '/', $scope.firm).success(function(data) {
          $scope.firm = data;
          $state.go('app.proposals.list');
        }).error(function(data, status) {
          $scope.errorState = true;
          $scope.validationData = data;
          console.log('update', data, status);
        });
      }
    };

  });
