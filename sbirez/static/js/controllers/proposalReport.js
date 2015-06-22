'use strict';

angular.module('sbirezApp')
  .controller('ProposalReportCtrl', function ($scope, $rootScope, $state, AuthenticationService, ProposalService) {
    $scope.proposalId = parseInt($state.params.id);
    $scope.proposal = {};
    $scope.workflow = {};
    $scope.overview = {};
    $scope.goodStartWorkflow = null;
    $scope.buttonMessage = 'Get Started';
    $rootScope.bodyClass = 'proposal proposal-overview';

    var goodStartElement = function() {
      var goodStart = $scope.overview[0].id;
      var found = false;
      for (var i = 0; i < $scope.overview.length && !found; i++) {
        if ($scope.overview[i].complete === false) {
          goodStart = $scope.overview[i].id;
          found = true;
          break;
        }
        else if ($scope.overview[i].children) {
          for (var j = 0; j < $scope.overview[i].children.length; j++) {
            if ($scope.overview[i].children[j].complete === false) {
              goodStart = $scope.overview[i].children[j].id;
              found = true;
              break;
            }
          }
        } 
      }
      return goodStart;
    };

    ProposalService.load($scope.proposalId).then(function(data) {
      $scope.proposal = data;
      $scope.workflow = ProposalService.getWorkflow(parseInt($scope.proposal.workflow)).then(function(data) {
        $scope.workflow = data.current;
      });
      ProposalService.getOverview(false).then(function(data) {
        $scope.overview = data;
        $scope.goodStartWorkflow = goodStartElement();
        if ($scope.goodStartWorkflow !== $scope.overview[0].id) {
          $scope.buttonMessage = 'Continue';
        }
      });
    });

    $scope.validate = function() {
      ProposalService.getOverview(true).then(function(data) {
        $scope.overview = data;
      });
    };

    $scope.delete = function() {
      ProposalService.remove($scope.proposalId);
      $state.go('app.proposals.list');
    };

  });
