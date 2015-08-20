'use strict';

angular.module('sbirezApp')
  .controller('AccountUserCtrl', function ($scope, $rootScope, UserService) {
    $scope.input = {};
    $scope.input.oldpassword = '';
    $scope.input.newpassword1 = '';
    $scope.input.newpassword2 = '';
    $rootScope.bodyClass = 'user';

    $scope.savePassword = function() {
      if ($scope.input.oldpassword !== '' && $scope.input.newpassword1 !== '' && $scope.input.newpassword2 !== '') {
        if ($scope.input.newpassword1 === $scope.input.newpassword2) {
          UserService.changePassword($scope.input.oldpassword, $scope.input.newpassword1, $scope.input.newpassword2).then(function(data) {
            $scope.validationData = {};
            console.log('password changed');
          }, function(status) {
            console.log('password changed', status);
            $scope.validationData = status.data;
          });
        } else {
          $scope.errorMsg = 'New passwords must match.';
        }
      } else {
        $scope.errorMsg = 'All fields are required.'; 
      }
    };
  });
