'use strict';

angular.module('sbirezApp').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/partials/header.html',
    controller: ['$scope', '$filter', '$window', '$location', 'ngDialog', 'AuthenticationService',
      function ($scope, $filter, $window, $location, ngDialog, AuthenticationService) {
        $scope.menu = [{
          'title': 'Home',
          'link': '/'
        }];

        $scope.openLogin = function() {
          ngDialog.open({'template':'partials/login.html', 'className':'ngdialog-theme-login', 'controller':'AdminUserCtrl'});
        };

        $scope.openLogout = function() {
          ngDialog.open({'template':'partials/logout.html', 'className':'ngdialog-theme-logout', 'controller':'AdminUserCtrl'});
        };

        if ($window.sessionStorage.token !== undefined && $window.sessionStorage.token !== null && $window.sessionStorage.token !== '' &&
            AuthenticationService.isAuthenticated) {
          $scope.menu.push({
            'title': $window.sessionStorage.username + ' (Logout)',
            'click':$scope.openLogout
          });
        }
        else {
          $scope.menu.push({'title': 'Login', 'click':$scope.openLogin});
        }

        $scope.menu.push({'title': 'Contact', 'link':'/contact'});

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
