'use strict';

angular.module('sbirezApp').directive('text', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      text: '=',
      storage: '='
    },
    templateUrl: 'static/views/partials/elements/text.html',
    controller: ['$scope',
      function ($scope) {
        $scope.element = $scope.text;
      }
    ]
  };
});
