'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', '$state', '$location', '$rootScope', '$window', 'UserService', 'AuthenticationService',
    function AdminUserCtrl($scope, $state, $location, $rootScope, $window, UserService, AuthenticationService) {
      $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {
          UserService.logIn(username, password).then(function(data) {
            $window.sessionStorage.token = data.data.token;
            $window.sessionStorage.username = data.data.username;
            $window.sessionStorage.userid = data.data.id;
            AuthenticationService.setAuthenticated(true);
            if ($scope.closeThisDialog !== undefined) {
              $scope.closeThisDialog();
              //$state.go('home.activity');
            }
            if ($scope.ngDialogData !== undefined && $scope.ngDialogData !== null) {
              $state.go($scope.ngDialogData.name, $scope.ngDialogData);
            }
            else {
              $state.go('app.activity.proposals.list');
            }
          },function(status) {
            console.log(status);
            $scope.errorMsg = status.data.message;
          });
        }
      };

      $scope.signUp = function signUp(name, email) {
        console.log('Signups are not yet implemented. Name: ' + name + ', Email: ' + email);
        if ($scope.closeThisDialog !== undefined) {
          $scope.closeThisDialog();
        }
      };
 
      $scope.logOut = function logout() {
        console.log('LogOut');
        $window.sessionStorage.token = '';
        $window.sessionStorage.username = null;
        $window.sessionStorage.userid = null;
        AuthenticationService.setAuthenticated(false);
        if ($scope.closeThisDialog !== undefined) {
          $scope.closeThisDialog();
        }
        $location.path('/');
        //$state.go('home.search');
      };
    }
]);
