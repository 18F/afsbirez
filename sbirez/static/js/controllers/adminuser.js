'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', '$state', '$location', '$rootScope', '$window', 'UserService', 'AuthenticationService',
    function AdminUserCtrl($scope, $state, $location, $rootScope, $window, UserService, AuthenticationService) {
      var mode = 'login';

      $scope.logIn = function logIn(username, password) {
        $scope.errorMsg = '';
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
            if (status && status.data && status.data.non_field_errors) {
              $scope.errorMsg = status.data.non_field_errors[0];
            } else {
              $scope.errorMsg = 'Unable to log in.';
            }
          });
        } else {
          $scope.errorMsg = 'Please provide a username and password'; 
        }
      };

      $scope.signUp = function signUp(name, email, password) {
        $scope.errorMsg = '';
        if (name !== undefined && email !== undefined && password !== undefined) {
          UserService.createUser(name, email, password).then(function(data) {
            $scope.successMsg = 'User created successfully. Log in to continue.';
          }, function(status) {
            if (status && status.data && status.data.non_field_errors) {
              $scope.errorMsg = status.data.non_field_errors[0];
            } else {
              $scope.errorMsg = 'Unable to sign up.';
            }
          });
        } else {
          $scope.errorMsg = 'All fields are required.'; 
        }
      };
 
      $scope.logOut = function logout() {
        UserService.logOut();
      };

      $scope.resetPassword = function resetPassword(email) {
        $scope.errorMsg = '';
        if (email !== undefined) {
          UserService.resetPassword(email).then(function(data) {
            $scope.successMsg = data.data.success;
          }, function(status) {
            if (status && status.data && status.data.non_field_errors) {
              $scope.errorMsg = status.data.non_field_errors[0];
            } else {
              $scope.errorMsg = 'Unable to reset password.';
            }
          });
        } else {
          $scope.errorMsg = 'Please provide an email address.'; 
        }
      };

      $scope.cancel = function cancel() {
         if ($scope.closeThisDialog !== undefined) {
           $scope.closeThisDialog();
         }
      };

      $scope.setMode = function(newMode) {
        $scope.errorMsg = '';
        mode = newMode;
      };

      $scope.getMode = function() {
        return mode;
      };

      $scope.introMessage = function(username, password) {
        if (username === 'doduser' && password === 'sbireztest') {
          $scope.closeThisDialog();
        }
        else {
          $scope.errorMsg = 'Invalid credentials.'; 
        }
      };
    }
]);
