'use strict';

angular.module('sbirezApp').directive('calculated', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      calculated: '=',
      multiplename: '=?',
      multipletoken: '=?'
    },
    templateUrl: 'static/views/partials/elements/calculated.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.calculated;
        $scope.fieldName = $scope.element.human;
        $scope.options = [];
        $scope.visible = true;
        $scope.validationstorage = '';

        var validationCallback = function(data) {
          $scope.storage = data;
          $scope.apply();
        };

        var askIfCallback = function(data) {
          $scope.visible = (data === true || data === 'true');
        };

        $scope.apply = function() {
          ProposalService.apply($scope.element, $scope.storage, $scope.multipletoken);
        };

        $scope.storage = ProposalService.register($scope.element,
                                 validationCallback,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipletoken);
        //console.log('$storage', $scope.storage, $scope.element.name, $scope.storage.length);
        if ($scope.storage.length === undefined && typeof $scope.storage === 'object') {
          $scope.storage = '';
        }

        $scope.fieldName = $scope.element.human;
        if ($scope.multiplename !== undefined && $scope.element.human.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.element.human.replace('%multiple%', $scope.multiplename);
        }

        $scope.fieldToken = $scope.element.name;
        if ($scope.multipletoken !== undefined) {
          $scope.fieldToken = $scope.element.name + '_' + $scope.multipletoken;
        }

        if ($scope.multiplename !== undefined && $scope.fieldName.indexOf('%multiple%') > -1) {
          $scope.fieldName = $scope.fieldName.replace('%multiple%', $scope.multiplename);
        }
      }
    ]
  };
});
