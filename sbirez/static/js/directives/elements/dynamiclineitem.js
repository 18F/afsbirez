'use strict';

angular.module('sbirezApp').directive('dynamiclineitem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      dynamiclineitem: '=',
      proposal: '@'
    },
    templateUrl: 'static/views/partials/elements/dynamiclineitem.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.dynamiclineitem;
        $scope.visible = true;
        $scope.visibleCount = $scope.element.multiplicity.length;

        if ($scope.element.multiplicityCount) {
          $scope.visibleCount = Math.max(1, ProposalService.getDynamicCount($scope.element));
        }

        var askIfCallback = function(data) {
          $scope.visible = (data === true || data === 'true');
        };
        $scope.storage = ProposalService.register($scope.element,
                                 null,
                                 $scope.element.ask_if !== null ? askIfCallback : null,
                                 $scope.multipletoken);

        $scope.addAnother = function() {
          ProposalService.addDynamicItem($scope.element);
          $scope.visibleCount++;
        };

        $scope.remove = function(index) {
          console.log('index', index);
          ProposalService.removeDynamicItem($scope.element, index);
          $scope.visibleCount--;
        };
      }
    ]
  };
});
