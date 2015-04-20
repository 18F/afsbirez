'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, SavedOpportunityService, ProposalService) {
    $scope.data = {};

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
      if (data.results && data.results.length > 0) {
        ProposalService.list().then(function(proposals) {
          if (proposals.results) {
            $scope.proposals = proposals;
            for (var i = 0; i < $scope.proposals.results.length; i++) {
              for (var j = 0; j < $scope.data.results.length; j++) {
                if ($scope.proposals.results[i].topic === $scope.data.results[j].id) {
                  $scope.data.results[j].proposal_id = proposals.results[i].id;
                  break;
                }
              }
            }
          }
        });
      }
    });

    $scope.removeOpportunity = function(opportunityId) {
      SavedOpportunityService.remove(opportunityId).then(function() {
        for (var i = 0; i < $scope.data.results.length; i++) {
          console.log('da', $scope.data.results[i],opportunityId );
          if ($scope.data.results[i].id === opportunityId) {
            $scope.data.results.splice(i,1);
            break;
          }
        }
      });
    };

    $scope.createProposal = function(opportunityId) {
      var title = 'New Proposal';
      var count = $scope.data.results.length;
      var workflow = 1;
      for (var i = 0; i < count; i++) {
        if ($scope.data.results[i].id === opportunityId) {
          title = $scope.data.results[i].title;
          workflow = $scope.data.results[i].solicitation.element;
          break;
        }
      }
      ProposalService.create(opportunityId, title, workflow).then(function(data) {
        var count = $scope.data.results.length;
        for (var i = 0; i < count; i++) {
          if ($scope.data.results[i].id === opportunityId) {
            $scope.data.results[i].proposal_id = data.id;
            break;
          }
        }
      });
    };
  });
