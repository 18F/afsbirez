'use strict';

angular.module('sbirezApp')
  .controller('ProposalReportCtrl', function ($scope, $http, $window, $state, AuthenticationService, ProposalService) {
    $scope.proposalId = $state.params.id;
    $scope.proposal = {};
    $scope.workflow = {};
    $scope.goodStartWorkflow = null;

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

    ProposalService.load(parseInt($scope.proposalId)).then(function(data) {
      $scope.proposal = data;
      console.log('workflow', $scope.proposal);
      $scope.workflow = ProposalService.getWorkflow(parseInt($scope.proposal.workflow)).current;
      $scope.goodStartWorkflow = goodStartElement().id;
    });

    $scope.validate = function() {
      ProposalService.validate();
    };
  });
