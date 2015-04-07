'use strict';

angular.module('sbirezApp').directive('lineitem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      lineitem: '=',
      storage: '='
    },
    templateUrl: 'static/views/partials/elements/lineitem.html',
    controller: ['$scope', 
      function ($scope) {
        $scope.element = $scope.lineitem;
        if ($scope.storage === undefined) {
          $scope.storage = {};
        }

        if ($scope.element.multiplicity === null) {
          $scope.element.multiplicity = [];
          $scope.element.multiplicity[0] = {};
        }
        else if (isFinite($scope.element.multiplicity)) {
          var count = parseInt($scope.element.multiplicity);
          $scope.element.multiplicity = [];
          for (var i = 0; i < count; i++) {
            $scope.element.multiplicity[i] = i;
          }
        } else if (typeof $scope.element.multiplicity === 'string') {
	  $scope.element.multiplicity = $scope.element.multiplicity.split(', ');
          var count = $scope.element.multiplicity.length;
          for (var i = 0; i < count; i++) {
            var value = $scope.element.multiplicity[i].trim();
            if ($scope.storage[value] !== undefined && $scope.storage[value] !== null && $scope.storage[value].length === 0) {
              $scope.storage[value] = {};
            }
          }
        }
      }
    ]
  };
});
