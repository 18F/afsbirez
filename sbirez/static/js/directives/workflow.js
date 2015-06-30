'use strict';

angular.module('sbirezApp').directive('workflow', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      proposalId: '@'
    },
    templateUrl: 'static/views/partials/workflow.html',
    controller: ['$scope', '$stateParams', '$state', '$location', 'ProposalService', '$timeout', 
      function ($scope, $stateParams, $state, $location, ProposalService, $timeout) {

        $scope.currentWorkflow = {};
        $scope.startingWorkflow = null;
        $scope.backWorkflow = null;
        $scope.nextWorkflow = null;
        $scope.proposalData = {};
        $scope.validationData = undefined;
        $scope.overview = {};
        $scope.proposal = {};
        $scope.proposalId = parseInt($scope.proposalId);
        $scope.validationList = [];

        var isEmpty = function(obj) {
          for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
              return false;
            }
          }
          return true;
        };

        var findChildElement = function(name, parentElement) {
          var index = 0;
          if (parentElement) {
            for (index = 0; index < parentElement.children.length; index++) {
              if (parentElement.children[index].name === name) {
                return parentElement.children[index];
              }
            }
            for (index = 0; index < parentElement.multiplicity.length; index++) {
              if (parentElement.multiplicity[index].token == name) {
                return parentElement;
              }
            }
          }
          return null;
        };

        function spliceSlice(str, index, count, add) {
          return str.slice(0, index) + (add || '') + str.slice(index + count);
        };

        var buildErrorList = function(validationData, rootElement) {
          if (rootElement === undefined) {
            rootElement = $scope.currentWorkflow;
          }
          for(var prop in validationData) {
            if(validationData.hasOwnProperty(prop)) {
              if (typeof validationData[prop] !== 'object') {
                var element = findChildElement(prop, rootElement);
                var human = element.human;
                var jargonIndex = human.indexOf('<jargon');
                var endIndex;
                while (jargonIndex !== -1) {
                  endIndex = human.indexOf('>', jargonIndex);
                  human = spliceSlice(human, jargonIndex, endIndex - jargonIndex + 1,'');
                  jargonIndex = human.indexOf('<jargon');
                }
                $scope.validationList.push({'id':prop, 'human': human, 'message': validationData[prop]});
              } else if (!isEmpty(validationData[prop])) {
                buildErrorList(validationData[prop], findChildElement(prop, rootElement));
              }
            }
          }
        };

        var validationCallback = function(data) {
          $scope.validationList = [];
          $scope.validationData = data;
          buildErrorList($scope.validationData);
          ProposalService.getOverview(false).then(function(data) {
            $scope.overview = data;
          });
        };

        $scope.jumpTo = function(workflow_id) {
          if (workflow_id !== null) {
            ProposalService.getWorkflow(workflow_id).then(function(data) {
              if (workflow_id === undefined) {
                $scope.startingWorkflow = data.current.id;
              }
              $scope.currentWorkflow = data.current;
              $scope.backWorkflow = data.previous;
              $scope.nextWorkflow = data.next;
              $location.search('current', workflow_id);
              ProposalService.getValidationData(data.current).then(function(data) {
                ProposalService.register($scope.currentWorkflow, validationCallback, null);
                $scope.validationData = data;
                $scope.validationList = [];
                buildErrorList($scope.validationData);
                ProposalService.getOverview(false).then(function(data) {
                  $scope.overview = data;
                  $timeout($.bigfoot, 100);
                });
              });
            });
          }
        };

        ProposalService.load($scope.proposalId).then(function() {
          $scope.jumpTo($stateParams.current !== undefined ? $stateParams.current : undefined);
          ProposalService.get(parseInt($scope.proposalId)).then(function(data) {
            $scope.proposal = data;
          });
          ProposalService.getOverview(false).then(function(data) {
            $scope.overview = data;
          });
        });

        $scope.showBackButton = function() {
          return $scope.backWorkflow !== null ;
        };

        $scope.showNextButton = function() {
          return $scope.nextWorkflow !== null;
        };

        $scope.saveAndContinue = function(next) {
          var advanceAnyway = $scope.validationList.length > 0;
          ProposalService.validate($scope.currentWorkflow);
          ProposalService.saveData(false);
          if (advanceAnyway || $scope.validationList.length === 0) {
            $scope.jumpTo(next);
          }
        };

        $scope.exit = function() {
          $state.go('app.proposals.report',{id: $scope.proposalId});
        };

        $scope.saveAndExit = function() { 
          ProposalService.validate();
          ProposalService.saveData(true);
          $scope.exit();
        };

      }
    ]
  };
});
