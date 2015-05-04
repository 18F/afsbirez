'use strict';

angular.module('sbirezApp').directive('lineitem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      lineitem: '=',
      proposal: '@'
    },
    templateUrl: 'static/views/partials/elements/lineitem.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        var count = 0;
        var iter = 0;
        $scope.element = $scope.lineitem;
        $scope.visible = true;

        if ($scope.element.multiplicity === null) {
          $scope.element.multiplicity = [];
          $scope.element.multiplicity[0] = {};
          $scope.element.multiplicity[0].token = 0;
          $scope.element.multiplicity[0].value = 0;
        }
        else if (isFinite($scope.element.multiplicity)) {
          count = parseInt($scope.element.multiplicity);
          $scope.element.multiplicity = [];
          for (iter = 0; iter < count; iter++) {
            $scope.element.multiplicity[iter] = {};
            $scope.element.multiplicity[iter].token = iter;
            $scope.element.multiplicity[iter].value = iter; 
          }
        }
        else if (typeof $scope.element.multiplicity === 'string') {
	  $scope.element.multiplicity = $scope.element.multiplicity.split(', ');
          count = $scope.element.multiplicity.length;
          for (iter = 0; iter < count; iter++) {
            var value = $scope.element.multiplicity[iter];
            var token = $scope.element.multiplicity[iter].replace(/[^\w]|_/g, '_');
            $scope.element.multiplicity[iter] = {};
            $scope.element.multiplicity[iter].value = value;
            $scope.element.multiplicity[iter].token = token;
          }
        }

        var askIfCallback = function(data) {
          $scope.visible = (data === true || data === 'true');
        };
        $scope.storage = ProposalService.register($scope.element,
                                 null,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipletoken);
      }
    ]
  };
});
