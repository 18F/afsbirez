'use strict';

angular.module('sbirezApp')
  .controller('ProposalReportCtrl', function ($scope, $rootScope, $state, AuthenticationService, ProposalService) {
    $scope.proposalId = parseInt($state.params.id);
    $scope.proposal = {};
    $scope.workflow = {};
    $scope.overview;
    $scope.goodStartWorkflow = null;
    $rootScope.bodyClass = 'proposal proposal-overview';

    var goodStartElement = function() {
      var goodStart = $scope.workflow.children[0];
      var count = 0;
      for (var i = 0; i < goodStart.children.length; i++) {
        if (goodStart.children[i].element_type === 'group' || goodStart.children[i].element_type === 'workflow') {
          count++;
        }
      }
      if (count === goodStart.children.length) {
        goodStart = goodStart.children[0];
      }
      return goodStart;
    };

    ProposalService.load($scope.proposalId).then(function(data) {
      $scope.proposal = data;
      $scope.workflow = ProposalService.getWorkflow(parseInt($scope.proposal.workflow)).current;
      $scope.overview = ProposalService.getOverview(false);
      $scope.goodStartWorkflow = goodStartElement().id;
    });

    $scope.validate = function() {
      ProposalService.validate();
    };

    $scope.delete = function() {
      ProposalService.remove($scope.proposalId);
      $state.go('app.proposals.list');
    };

  });
