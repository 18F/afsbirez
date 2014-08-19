'use strict';

angular.module('sbirezApp')
  .controller('AccountUserCtrl', function ($scope, $rootScope, $http, $routeParams, $window, UserService) {
    console.log('Account User Ctrl');
    $scope.newOrganization = '';
    $scope.userId = $window.sessionStorage.userid;
    $scope.jwt = $window.sessionStorage.token;
    $scope.user = {};
    $scope.user.name = '';

    if ($scope.user.name === '') {
      $scope.user = UserService.getUserDetails($scope.userId);
    }

    $rootScope.$on('userUpdated', function() {
      $scope.user = UserService.getUserDetails($scope.userId);
    });

    $scope.addOrganization = function() {
      if ($scope.newOrganization !== '') {
        UserService.addOrganization($scope.newOrganization);
      }
      $scope.newOrganization = '';
    };

    $scope.save = function() {
      UserService.updateUserDetails($scope.user);
    };
  });
