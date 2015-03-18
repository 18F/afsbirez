'use strict';

angular.module('sbirezApp')
  .controller('AccountUserCtrl', function ($scope, $rootScope, $http, $routeParams, $window, UserService) {
    $scope.userId = $window.sessionStorage.userid;
    $scope.user = {};
    $scope.user.name = '';

    if ($scope.user.name === '') {
      UserService.getUserDetails($scope.userId).then(function(data) {
        $scope.user = data;
      }, function(error) {
        console.log(error);
      });
    }

    $rootScope.$on('userUpdated', function() {
      UserService.getUserDetails($scope.userId).then(function(data) {
        $scope.user = data;
      }, function(error) {
        console.log(error);
      });
    });

    $scope.save = function() {
      UserService.updateUserDetails($scope.user);
    };
  });
