'use strict';

angular.module('sbirezApp')
  .controller('ProposalReportCtrl', function ($scope, $http, $window, $state, AuthenticationService, ProposalService) {
    $scope.proposalId = $state.params.id;
    $scope.proposal = {};
    $scope.workflow = {};
    $scope.goodStartWorkflow = null;

    ProposalService.load(parseInt($scope.proposalId)).then(function(data) {
      $scope.proposal = data;
      console.log('workflow', $scope.proposal);
      $scope.workflow = ProposalService.getWorkflow(parseInt($scope.proposal.workflow)).current;
      $scope.goodStartWorkflow = $scope.workflow.children[0].id;
    });

    $scope.validate = function() {
      ProposalService.validate();
    };
  });
