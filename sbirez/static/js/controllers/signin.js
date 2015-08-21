'use strict';

angular.module('sbirezApp')
  .controller('SignInCtrl', function ($scope, $rootScope, $window, $location, $state, UserService, AuthenticationService) {
    $rootScope.bodyClass = 'sign-in';
    $scope.email = '';
    $scope.password = '';
    $scope.intention = $location.search();
    if (!$scope.intention.target) {
      $scope.intention = null;
    }
    $scope.logIn = function logIn() {
      $scope.errorEmail = '';
      $scope.errorPassword = '';
      $scope.errorMsg = '';
      if ($scope.email !== '' && $scope.password !== '') {
        UserService.logIn($scope.email, $scope.password).then(function(data) {
          $window.sessionStorage.token = data.data.token;
          $window.sessionStorage.username = data.data.username;
          $window.sessionStorage.userid = data.data.id;
          UserService.getUserDetails(data.data.id).then(function(data) {
            $window.sessionStorage.firmid = data.firm;
            $window.sessionStorage.expiration = data.password_expires;
            AuthenticationService.setAuthenticated(true);
          });
          if ($scope.intention) {
            $location.path($scope.intention.target.replace(/%2F/g, '/')).search('target', null);
          } else {
            $state.go('app.proposals.list');
          }
        },function(status) {
          if (status && status.data && status.data.non_field_errors) {
            $scope.errorMsg = status.data.non_field_errors[0];
            if ($scope.errorMsg === 'Password has expired.') {
              $scope.errorMsg = 'Your password has expired. Please reset your password via the \'Forgot your password?\' link to continue.'
            }
          } else {
            if (status.data.email) {
              $scope.errorEmail = status.data.email[0];
            }
            if (status.data.password) {
              $scope.errorPassword = status.data.password[0];
            }
            $scope.errorMsg = 'Unable to log in.';
          }
        });
      } else {
        $scope.errorMsg = 'Please provide a username and password';
      }
    };
  });
