'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {
      $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {
          UserService.logIn(username, password).then(function(data) {
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $window.sessionStorage.username = data.username;
            $window.sessionStorage.userid = data.id;
            $location.path('/');
          },function(status, data) {
            $scope.errorMsg = status.message;
          });
        }
      };
 
      $scope.logOut = function logout() {
        if (AuthenticationService.isLogged || $window.sessionStorage.token) {
          AuthenticationService.isLogged = false;
          $window.sessionStorage.token = '';
        }
        $location.path('/');
      };
    }
]);
