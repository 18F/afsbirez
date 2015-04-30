'use strict';

angular.module('sbirezApp').directive('checkbox', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      checkbox: '=',
      storage: '=',
      validationstorage: '=',
      multiplename: '=?'
    },
    templateUrl: 'static/views/partials/elements/checkbox.html',
    controller: ['$scope', 
      function ($scope) {
        $scope.element = $scope.checkbox;
        $scope.fieldName = $scope.element.human
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }
      }
    ]
  };
});
