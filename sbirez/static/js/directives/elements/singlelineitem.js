'use strict';

angular.module('sbirezApp').directive('singlelineitem', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      singlelineitem: '=',
      proposal: '@'
    },
    templateUrl: 'static/views/partials/elements/singlelineitem.html',
    controller: ['$scope', 'ProposalService',
      function ($scope, ProposalService) {
        $scope.element = $scope.singlelineitem;
        $scope.visible = true;
        $scope.visibleCount = $scope.element.multiplicity.length;

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
