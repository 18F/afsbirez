'use strict';

angular.module('sbirezApp')
  .controller('MainCtrl', function ($scope, $http, $location, $state, $window, AuthenticationService, DialogService, $rootScope) {
    $scope.auth = AuthenticationService;
    $scope.isLoggedIn = $scope.auth.getAuthenticated() && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined);


    AuthenticationService.registerObserverCallback(function() {
      $scope.isLoggedIn = AuthenticationService.isAuthenticated && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '');
    });

    if ($scope.isLoggedIn && $state.includes('home')) {
      console.log($state);
      $location.path('/app/proposals');
    } else if ($rootScope.preproduction) {
      DialogService.openIntroMessage();
    }

    $scope.logIn = function() {
      console.log('here');
    };

  });
