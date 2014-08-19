'use strict';

angular.module('sbirezApp')
  .controller('AccountCtrl', [ '$scope', '$rootScope', 'UserService', function AccountCtrl($scope, $rootScope, UserService) {
    console.log('Account Ctrl');
    $scope.user = UserService.getUserDetails();

    $rootScope.$on('userUpdated', function() {
      $scope.user = UserService.getUserDetails();
    });
  }]);
