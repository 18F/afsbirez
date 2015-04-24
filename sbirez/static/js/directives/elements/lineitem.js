'use strict';

angular.module('sbirezApp').directive('lineitem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      lineitem: '=',
      storage: '=',
      proposal: '@',
      validationstorage: '='
    },
    templateUrl: 'static/views/partials/elements/lineitem.html',
    controller: ['$scope', 
      function ($scope) {
        var count = 0;
        var iter = 0;
        $scope.validationstorage = {};
        $scope.element = $scope.lineitem;
        if ($scope.storage === undefined) {
          $scope.storage = {};
        }

        if ($scope.element.multiplicity === null) {
          $scope.element.multiplicity = [];
          $scope.element.multiplicity[0] = {};
          $scope.element.multiplicity[0].token = 0;
          $scope.element.multiplicity[0].value = 0;
        }
        else if (isFinite($scope.element.multiplicity)) {
          count = parseInt($scope.element.multiplicity);
          $scope.element.multiplicity = [];
          for (iter = 0; iter < count; iter++) {
            $scope.element.multiplicity[iter] = {};
            $scope.element.multiplicity[iter].token = iter;
            $scope.element.multiplicity[iter].value = iter; 
          }
        }
        else if (typeof $scope.element.multiplicity === 'string') {
	  $scope.element.multiplicity = $scope.element.multiplicity.split(', ');
          count = $scope.element.multiplicity.length;
          for (iter = 0; iter < count; iter++) {
            var value = $scope.element.multiplicity[iter];
            var token = $scope.element.multiplicity[iter].replace(/[^\w]|_/g, '_');
            $scope.element.multiplicity[iter] = {};
            $scope.element.multiplicity[iter].value = value;
            $scope.element.multiplicity[iter].token = token;
          }
        }
      }
    ]
  };
});
