'use strict';

angular.module('sbirezApp').directive('checkbox', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      checkbox: '=',
      multiplename: '=?',
      multipletoken: '=?'
    },
    templateUrl: 'static/views/partials/elements/checkbox.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.checkbox;
        $scope.fieldName = $scope.element.human;
        $scope.visible = true;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        $scope.fieldToken = $scope.element.name;
        if ($scope.multipletoken !== undefined) {
          $scope.fieldToken = $scope.element.name + '_' + $scope.multipletoken;
        }

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
                                 $scope.multipletoken);

        $scope.apply = function() {
          console.log('bool apply', $scope.element.id, $scope.storage);
          ProposalService.apply($scope.element, $scope.storage, $scope.multipletoken);
        };
      }
    ]
  };
});
