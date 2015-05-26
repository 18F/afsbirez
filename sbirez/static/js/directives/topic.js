'use strict';

angular.module('sbirezApp').directive('topic', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      topic: '=',
      removeOption: '@',
      saveOption: '@',
      createOption: '@'
    },
    templateUrl: 'static/views/partials/topic.html',
    controller: ['$scope', '$http', '$q', '$stateParams', '$location', 'SavedOpportunityService', 'ProposalService',
      function ($scope, $http, $q, $stateParams, $location, SavedOpportunityService, ProposalService) {

        $scope.saveOpportunity = function() {
          SavedOpportunityService.save($scope.topic.id).then(function() {
            $scope.topic.saved = true;
          }, function(error) {
            console.log(error);
          });
        };

        $scope.removeOpportunity = function() {
          SavedOpportunityService.remove($scope.topic.id).then(function() {
            $scope.topic = {};
          });
        };

        $scope.createProposal = function() {
          var title = 'Proposal for ' + $scope.topic.title;
          var workflow = $scope.topic.solicitation.element;
          ProposalService.create($scope.topic.id, title, workflow).then(function(data) {
            $scope.topic.proposal_id = data.id;
          });
        }; 

      }
    ]
  };
});
