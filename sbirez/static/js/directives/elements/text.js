'use strict';

angular.module('sbirezApp').directive('text', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      text: '=',
      storage: '=',
      validationstorage: '='
    },
    templateUrl: 'static/views/partials/elements/text.html',
    controller: ['$scope',
      function ($scope) {
        $scope.element = $scope.text;
        $scope.validationstorage = '';
      }
    ]
  };
});
