'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function AdminUserCtrl($scope, $location, $window, UserService, AuthenticationService) {
      $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {
          UserService.logIn(username, password).then(function(data) {
            $window.sessionStorage.token = data.data.token;
            $window.sessionStorage.username = data.data.username;
            $window.sessionStorage.userid = data.data.id;
            AuthenticationService.setAuthenticated(true);
            $scope.closeThisDialog();
            //$location.path('/');
          },function(status) {
            console.log(status);
            $scope.errorMsg = status.data.message;
          });
        }
      };

      $scope.signUp = function signUp(name, email) {
        console.log('Signups are not yet implemented.');
        $scope.closeThisDialog();
      }
 
      $scope.logOut = function logout() {
        if (AuthenticationService.isAuthenticated || $window.sessionStorage.token) {
          $window.sessionStorage.token = '';
          $window.sessionStorage.username = null;
          $window.sessionStorage.userid = null;
          AuthenticationService.setAuthenticated(false);
          $scope.closeThisDialog();
        }
        $location.path('/');
      };
    }
]);
