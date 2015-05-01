'use strict';

angular.module('sbirezApp').directive('bool', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      bool: '=',
      multiplename: '=?'
    },
    templateUrl: 'static/views/partials/elements/bool.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.bool;
        $scope.validationstorage = '';

        var validationCallback = function(data) {
          console.log('valid cb', data);
          $scope.validationstorage = data;
        };

        var askIfCallback = function(data) {
          console.log('ask if!', data);
        };

        $scope.storage = ProposalService.register($scope.element,
                                 validationCallback,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipleName);

        $scope.fieldName = $scope.element.human;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        $scope.apply = function() {
          console.log('bool apply', $scope.element.id, $scope.storage);
          ProposalService.apply($scope.element, $scope.storage);
        };
      }
    ]
  };
});
