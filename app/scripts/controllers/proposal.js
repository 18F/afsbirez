'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $http, $window, AuthenticationService) {
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
  });
