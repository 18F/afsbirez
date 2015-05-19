'use strict';

angular.module('sbirezApp').directive('readonlytext', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      readonlytext: '=',
      multiplename: '=?'
    },
    templateUrl: 'static/views/partials/elements/readonlytext.html',
    controller: ['$scope', 
      function ($scope) {
        $scope.element = $scope.readonlytext;
        $scope.fieldName = $scope.element.human;

        $scope.fieldName = $scope.element.human;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        if ($scope.multiplename !== undefined && $scope.fieldName.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.fieldName.replace('%multiple%', $scope.multiplename);
        }
      }
    ]
  };
});
