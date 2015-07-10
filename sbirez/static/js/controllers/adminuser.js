'use strict';

angular.module('sbirezApp')
  .controller('AdminUserCtrl', ['$scope', 
    function AdminUserCtrl($scope) {

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
