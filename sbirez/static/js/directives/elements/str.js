'use strict';

angular.module('sbirezApp').directive('str', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      str: '=',
      storage: '='
    },
    templateUrl: 'static/views/partials/elements/str.html',
    controller: ['$scope',
      function ($scope) {
        $scope.element = $scope.str;
      }
    ]
  };
});
