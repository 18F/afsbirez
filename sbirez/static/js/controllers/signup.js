'use strict';

angular.module('sbirezApp')
  .controller('SignUpCtrl', function ($scope, $rootScope, $window, $state, UserService, AuthenticationService) {
    $rootScope.bodyClass = 'sign-up';
    $scope.name = '';
    $scope.email = '';
    $scope.password = '';

    var isStrongPassword = function(password) {
        var regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
        var validPassword = regExp.test(password);
        return validPassword;
    }

    $scope.signUp = function signUp() {
      $scope.errorMsg = '';
      $scope.errorName = '';
      $scope.errorEmail = '';
      $scope.errorPassword = '';
      if ($scope.name !== '' && $scope.email !== '' && $scope.password !== '') {
        if (!isStrongPassword($scope.password)) {
          $scope.errorPassword = 'Password does not meet requirements.';
          return;
        }
        UserService.createUser($scope.name, $scope.email, $scope.password).then(function() {
          $scope.successMsg = 'User created successfully. Log in to continue.';
          UserService.logIn($scope.email, $scope.password).then(function(data) {
            $window.sessionStorage.token = data.data.token;
            $window.sessionStorage.username = data.data.username;
            $window.sessionStorage.userid = data.data.id;
            AuthenticationService.setAuthenticated(true);
            UserService.getUserDetails(data.data.id).then(function(data) {
              $window.sessionStorage.firmid = data.firm;
            });
            $state.go('app.landing');
          });
        }, function(status) {
          if (status && status.data && status.data.non_field_errors) {
            $scope.errorMsg = status.data.non_field_errors[0];
          } else {
            if (status.data.name) {
              $scope.errorName = status.data.name[0];
            }
            if (status.data.email) {
              $scope.errorEmail = status.data.email[0];
            }
            if (status.data.password) {
              $scope.errorPassword = status.data.password[0];
            }
            $scope.errorMsg = 'Unable to sign up.';
          }
        });
      } else {
        $scope.errorMsg = 'All fields are required.';
      }
    };
  });
