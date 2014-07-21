'use strict';

angular.module('sbirezApp')
  .controller('NavbarCtrl', function ($scope, $location, $window, AuthenticationService) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    console.log('token: ' + $window.sessionStorage.token);
    if ($window.sessionStorage.token !== undefined && AuthenticationService.isLogged) {
      $scope.menu.push({'title': 'Logout', 'link':'/logout'});
    }
    else {
      $scope.menu.push({'title': 'Login', 'link':'/login'});
    }
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
