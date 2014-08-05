'use strict';

angular.module('sbirezApp')
  .controller('MainCtrl', function ($scope, $http, $window, AuthenticationService) {
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
  });
