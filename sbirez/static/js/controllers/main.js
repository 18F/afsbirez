'use strict';

angular.module('sbirezApp')
  .controller('MainCtrl', function ($scope, $http, $location, $state, $window, AuthenticationService) {
    $scope.auth = AuthenticationService;
    $scope.isLoggedIn = $scope.auth.getAuthenticated() && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined);

    console.log('Main Ctrl');

    AuthenticationService.registerObserverCallback(function() {
      $scope.isLoggedIn = AuthenticationService.isAuthenticated && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '');
    });

    if ($scope.isLoggedIn && $state.includes('home')) {
      console.log('All state go!');
      console.log($state);
      $location.path('/app/proposals');
    }
  });
