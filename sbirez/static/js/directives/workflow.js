'use strict';

angular.module('sbirezApp').directive('workflow', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      proposalId: '@'
    },
    templateUrl: 'static/views/partials/workflow.html',
    controller: ['$scope', '$stateParams', '$state', '$location', 'ProposalService', 
      function ($scope, $stateParams, $state, $location, ProposalService) {

        $scope.currentWorkflow = {};
        $scope.startingWorkflow = null;
        $scope.backWorkflow = null;
        $scope.nextWorkflow = null;
        $scope.proposalData = {};
        $scope.validationData = undefined;
        $scope.overview;
        $scope.proposal = {};
        $scope.proposalId = parseInt($scope.proposalId);

        $scope.jumpTo = function(workflow_id) {
          if (workflow_id !== null) {
            var data = ProposalService.getWorkflow(workflow_id);
            if (workflow_id === undefined) {
              $scope.startingWorkflow = data.current.id;
            }
            $scope.currentWorkflow = data.current;
            $scope.backWorkflow = data.previous;
            $scope.nextWorkflow = data.next;
            $location.search('current', workflow_id);
          }
        };

        ProposalService.load($scope.proposalId).then(function() {
          $scope.jumpTo($stateParams.current !== undefined ? $stateParams.current : undefined);
          ProposalService.get(parseInt($scope.proposalId)).then(function(data) {
            $scope.proposal = data;
          });
          $scope.overview = ProposalService.getOverview(false);
        });

        $scope.showBackButton = function() {
          return $scope.backWorkflow !== null ;
        };

        $scope.showNextButton = function() {
          return $scope.nextWorkflow !== null;
        };

        $scope.saveAndContinue = function(next) { 
          ProposalService.validate();
          ProposalService.saveData();
          $scope.jumpTo(next);
        };

        $scope.exit = function() {
          $state.go('app.proposals.report',{id: $scope.proposalId});
        };

        $scope.saveAndExit = function(next) { 
          ProposalService.validate();
          ProposalService.saveData();
          $scope.exit();
        };

      }
    ]
  };
});
