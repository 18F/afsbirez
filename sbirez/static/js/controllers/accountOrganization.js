'use strict';

angular.module('sbirezApp')
  .controller('AccountOrganizationCtrl', function ($scope, $http, $state, $q, $window, $rootScope, UserService) {

    $scope.orgId = null;
    $scope.firm = {};
    $scope.firm.point_of_contact = {};
    $scope.firm.address = {};
    $scope.validationData = {};
    $scope.errorState = false;
    $scope.naicsdata = [];
    $rootScope.bodyClass = 'company';

    UserService.getUserDetails().then(function(data) {
      $scope.orgId = data.firm;
      if ($scope.orgId !== null && $scope.orgId !== undefined) {
        $http.get('api/v1/firms/' + $scope.orgId + '/').success(function(data) {
          $scope.firm = data;
          for (var i = 0; i < 4; i++) {
            $scope.applyNaics(i);
          }
        });
      }
    }, function(error) {
      console.log(error);
    });

    $scope.applyNaics = function(index) {
      $scope.naicsdata[index] = {};
      $scope.naicsdata[index].error = false;
      if ($scope.firm.naics && $scope.firm.naics[index] !== undefined && $scope.firm.naics[index].length > 2) {
        $http.get('api/v1/naics/' + $scope.firm.naics[index]).success(function(data) {
          $scope.naicsdata[index].detail = data.description;
        }).error(function(data) {
          $scope.naicsdata[index].detail = data.detail;
          $scope.naicsdata[index].error = true;
        });
      } else {
        $scope.naicsdata[index].detail = '';
      }
    };

    var consolidateNaics = function() {
      if ($scope.firm.naics) {
        for (var i = $scope.firm.naics.length - 1; i >= 0; i--) {
          if ($scope.firm.naics[i] === undefined || $scope.firm.naics[i] === null || $scope.firm.naics[i] === '') {
            $scope.firm.naics.splice(i, 1);
          }
        }
      }
    };

    $scope.updateFirm = function() {
      if ($scope.orgId === null || $scope.orgId === undefined) {
        consolidateNaics();
        $http.post('api/v1/firms/', $scope.firm).success(function(data) {
          $scope.firm = data;
          $scope.orgId = data.id;
          $window.sessionStorage.firmid = data.id;
        }).error(function(data,status) {
          console.log('update', data, status);
          $scope.errorState = true;
          $scope.validationData = data;
        });
      } else {
        if ($scope.firm.address === null) {
          delete $scope.firm.address;
        }
        if ($scope.firm.point_of_contact === null) {
          delete $scope.firm.point_of_contact;
        }
        consolidateNaics();
       
        $http.patch('api/v1/firms/' + $scope.orgId + '/', $scope.firm).success(function(data) {
          $scope.firm = data;
          $state.go('app.proposals.list');
        }).error(function(data, status) {
          $scope.errorState = true;
          $scope.validationData = data;
          for (var i = 0; i < 4; i++) {
            $scope.applyNaics(i);
          }
        });
      }
    };

  });
