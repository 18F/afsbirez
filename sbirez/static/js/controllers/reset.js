'use strict';

angular.module('sbirezApp')
  .controller('ResetCtrl', function ($scope, $rootScope, $window, $state, UserService) {
    $rootScope.bodyClass = 'sign-up';
    $scope.email = '';
    $scope.errorMsg = '';

    $scope.reset = function reset() {
      $scope.errorMsg = '';
      if ($scope.email !== '') {
        UserService.resetPassword($scope.email).then(function(data) {
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
  });
