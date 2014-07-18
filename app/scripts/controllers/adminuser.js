'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {
      $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {
          UserService.logIn(username, password).success(function(data) {
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            console.log($window.sessionStorage.token);
            $location.path('/');
          }).error(function(status, data) {
            console.log(status);
            $scope.errorMsg = status.message;
          });
        }
      };
 
      $scope.logOut = function logout() {
        if (AuthenticationService.isLogged || $window.sessionStorage.token) {
          AuthenticationService.isLogged = false;
          delete $window.sessionStorage.token;
          $location.path('/');
        }
      };
    }
]);
