'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, SavedOpportunityService, ProposalService) {
    $scope.data = {};

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
    });

    $scope.removeOpportunity = function(opportunityId) {
      SavedOpportunityService.remove(opportunityId).then(function() {
        SavedOpportunityService.list().then(function(data) {
          $scope.data = data;
        }, function(error) { 
          console.log(error);
        });
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
        console.log('created proposal', data);
      });
    };
  });
