'use strict';

angular.module('sbirezApp').directive('group', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      group: '=',
      method: '='
    },
    templateUrl: 'static/views/partials/elements/group.html',
    controller: ['$scope', 
      function ($scope) {
        $scope.element = $scope.group;
      }
    ]
  };
});
