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
  });
