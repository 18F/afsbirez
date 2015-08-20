'use strict';

angular.module('sbirezApp')
  .controller('MainCtrl', function ($scope, $http, $location, $state, $window, AuthenticationService, DialogService, $rootScope, SearchService) {
    $scope.auth = AuthenticationService;
    $scope.isLoggedIn = $scope.auth.getAuthenticated() && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined);
    $rootScope.bodyClass = 'home';
    $scope.query = '';


    AuthenticationService.registerObserverCallback(function() {
      $scope.isLoggedIn = AuthenticationService.isAuthenticated && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '');
    });

    if ($scope.isLoggedIn && $state.includes('home')) {
      console.log($state);
      $location.path('/~/proposals');
    } else if ($rootScope.preproduction) {
      DialogService.openIntroMessage();
    }

    $scope.search = function() {
      SearchService.search(1, $scope.query, 10).then(function(data) {
        $state.go('search', {'query':$scope.query}, {'reload':true});
      }, function(error) {
        console.log(error);
      });
    };

  });
