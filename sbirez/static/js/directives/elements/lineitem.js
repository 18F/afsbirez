'use strict';

angular.module('sbirezApp').directive('lineitem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      lineitem: '=',
      storage: '=',
      proposal: '@'
    },
    templateUrl: 'static/views/partials/elements/lineitem.html',
    controller: ['$scope', 
      function ($scope) {
        var count = 0;
        var iter = 0;
        $scope.element = $scope.lineitem;
        if ($scope.storage === undefined) {
          $scope.storage = {};
        }

        if ($scope.element.multiplicity === null) {
          $scope.element.multiplicity = [];
          $scope.element.multiplicity[0] = {};
        }
        else if (isFinite($scope.element.multiplicity)) {
          count = parseInt($scope.element.multiplicity);
          $scope.element.multiplicity = [];
          for (iter = 0; iter < count; iter++) {
            $scope.element.multiplicity[iter] = iter;
          }
        } else if (typeof $scope.element.multiplicity === 'string') {
	  $scope.element.multiplicity = $scope.element.multiplicity.split(', ');
          count = $scope.element.multiplicity.length;
          for (iter = 0; iter < count; iter++) {
            var value = $scope.element.multiplicity[iter].trim();
            if ($scope.storage[value] !== undefined && $scope.storage[value] !== null && $scope.storage[value].length === 0) {
              $scope.storage[value] = {};
            }
          }
        }
      }
    ]
  };
});
