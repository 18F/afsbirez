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
    $scope.showContinue = true;
    var first = true;

    var goodStartElement = function() {
      var goodStart = -1; //$scope.overview[0].id;
      var found = false;

      for (var i = 0; i < $scope.overview.length && !found; i++) {
        if ($scope.overview[i].complete === false) {
          goodStart = $scope.overview[i].id;
          found = true;
          break;
        }
        if ($scope.overview[i].children) {
          for (var j = 0; j < $scope.overview[i].children.length; j++) {
            if ($scope.overview[i].children[j].complete === false) {
              goodStart = $scope.overview[i].children[j].id;
              found = true;
              break;
            }
            first = false; 
          }
          if (found) {
            break;
          }
        }
        first = false; 
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
        if (!first && $scope.goodStartWorkflow === -1) {
          $scope.showContinue = false;
        } else if (!first) {
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
