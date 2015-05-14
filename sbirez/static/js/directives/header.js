'use strict';

angular.module('sbirezApp').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'static/views/partials/header.html',
    controller: ['$scope', '$filter', '$window', '$location', 'AuthenticationService', 'DialogService', 'UserService',
      function ($scope, $filter, $window, $location, AuthenticationService, DialogService, UserService) {
        $scope.menu = [{
          'class': 'my-topics',
          'title': 'My topics',
          'link': '/my-topics'
        }, {
          'class': 'notifications',
          'title': 'Notifications',
          'link': '/notifications'
        }, {
          'class': 'my-company',
          'title': 'My company',
          'link': '/my-company'
        }, {
          'class': 'sign-out',
          'title': 'Sign out',
          'link': '/sign-out'
        }];


        $scope.openLogin = function() {
          DialogService.openLogin();
        };

        $scope.openLogout = function() {
          UserService.logOut();
        };

        if ($window.sessionStorage.token !== undefined && $window.sessionStorage.token !== null && $window.sessionStorage.token !== '' &&
            AuthenticationService.isAuthenticated) {
          $scope.menu.push({
            'title': $window.sessionStorage.username + ' (Sign out)',
            'click':$scope.openLogout
          });
        }
        else {
          $scope.menu.push({'title': 'Sign in', 'click':$scope.openLogin});
        }

//        $scope.menu.push({'title': 'Contact', 'link':'/contact'});

        $scope.isActive = function(route) {
          return route === $location.path();
        };

        AuthenticationService.registerObserverCallback(function() {
          if(AuthenticationService.isAuthenticated &&
             ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '')) {
            $scope.menu[1] = {'title': $window.sessionStorage.username + ' (Logout)','click':$scope.openLogout};
          }
          else {
            $scope.menu[1] = {'title': 'Login', 'click':$scope.openLogin};
          }
        });

      }
    ]
  };
});
