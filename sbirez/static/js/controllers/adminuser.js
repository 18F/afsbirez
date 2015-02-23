'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', '$state', '$location', '$rootScope', '$window', 'UserService', 'AuthenticationService',
    function AdminUserCtrl($scope, $state, $location, $rootScope, $window, UserService, AuthenticationService) {
      var mode = 'login';

      $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {
          UserService.logIn(username, password).then(function(data) {
            $window.sessionStorage.token = data.data.token;
            $window.sessionStorage.username = data.data.username;
            $window.sessionStorage.userid = data.data.id;
            AuthenticationService.setAuthenticated(true);
            if ($scope.closeThisDialog !== undefined) {
              $scope.closeThisDialog();
            }
            if ($scope.ngDialogData !== undefined && $scope.ngDialogData !== null) {
              $state.go($scope.ngDialogData.name, $scope.ngDialogData);
            }
            else {
              $state.go('app.activity.search');
            }
          },function(status) {
            console.log(status);
            $scope.errorMsg = status.data.message;
          });
        }
      };

      $scope.signUp = function signUp(name, email, password) {
        if (name !== undefined && username !== undefined && password !== undefined) {
          UserService.createUser(name, email, password).then(function(data) {
            if ($scope.closeThisDialog !== undefined) {
              $scope.closeThisDialog();
            }
          }, function(status) {
            console.log(status);
            $scope.errorMsg = status.data.message;
          });
        }
      };
 
      $scope.logOut = function logout() {
        UserService.logOut();
      };

      $scope.resetPassword = function resetPassword(email) {
        UserService.resetPassword(email);
      };

      $scope.cancel = function cancel() {
         if ($scope.closeThisDialog !== undefined) {
           $scope.closeThisDialog();
         }
      };

      $scope.setMode = function(newMode) {
        mode = newMode;
      };

      $scope.getMode = function() {
        return mode;
      };
    }
]);
