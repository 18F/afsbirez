'use strict';

angular.module('sbirezApp').directive('text', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      text: '=',
      multiplename: '=?',
      multipletoken: '=?'
    },
    templateUrl: 'static/views/partials/elements/text.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.text;
        $scope.validationstorage = '';
        $scope.visible = true;

        var validationCallback = function(data) {
          $scope.validationstorage = data;
        };

        var askIfCallback = function(data) {
          $scope.visible = data;
        };

        $scope.storage = ProposalService.register($scope.element,
                                 validationCallback,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipletoken);
        if ($scope.storage.length === undefined) {
          $scope.storage = '';
        }

        $scope.fieldName = $scope.element.human;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        $scope.apply = function() {
          ProposalService.apply($scope.element, $scope.storage, $scope.multipletoken);
        };
      }
    ]
  };
});
