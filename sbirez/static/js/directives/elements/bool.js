'use strict';

angular.module('sbirezApp').directive('bool', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      bool: '=',
      storage: '=',
      validationstorage: '='
    },
    templateUrl: 'static/views/partials/elements/bool.html',
    controller: ['$scope', 
      function ($scope) {
        $scope.element = $scope.bool;
      }
    ]
  };
});
