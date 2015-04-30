'use strict';

angular.module('sbirezApp').directive('str', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      str: '=',
      storage: '=',
      validationstorage: '=',
      multiplename: '=?'
    },
    templateUrl: 'static/views/partials/elements/str.html',
    controller: ['$scope',
      function ($scope) {
        $scope.element = $scope.str;
        $scope.fieldName = $scope.element.human;
        $scope.options = [];

        if ($scope.multiplename !== undefined && $scope.fieldName.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.fieldName.replace('%multiple%', $scope.multiplename);
        }

        if ($scope.element.validation) {
          var validationElements = $scope.element.validation.split(' ');
          if (validationElements[0] === 'one_of' && validationElements.length > 2) {
            var command = validationElements[0];
            validationElements.splice(0,1);
            if (validationElements[0].startsWith('"')) {
              var options = validationElements.join(' ');
              validationElements = options.split(',')
              $scope.options = validationElements;
            } else {
              $scope.options = validationElements;
            }
          }
        }
      }
    ]
  };
});
