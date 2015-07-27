'use strict';

angular.module('sbirezApp').directive('bool', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      bool: '=',
      multiplename: '=?',
      multipletoken: '=?'
    },
    templateUrl: 'static/views/partials/elements/bool.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.bool;
        $scope.visible = true;
        $scope.validationstorage = '';

        var validationCallback = function(data) {
          $scope.validationstorage = data;
        };

        var askIfCallback = function(data) {
          $scope.visible = (data === true || data === 'true');
        };

        $scope.storage = ProposalService.register($scope.element,
                                 validationCallback,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipleName);

        $scope.fieldName = $scope.element.human;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        $scope.fieldToken = $scope.element.name;
        if ($scope.multipletoken !== undefined) {
          $scope.fieldToken = $scope.element.name + '_' + $scope.multipletoken;
        }

        $scope.apply = function() {
          ProposalService.apply($scope.element, $scope.storage);
        };
      }
    ]
  };
});
