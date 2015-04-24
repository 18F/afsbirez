'use strict';

angular.module('sbirezApp').directive('workflow', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      includeSidebar: '@',
      includeMetro: '@',
      proposalId: '@'
    },
    templateUrl: 'static/views/partials/workflow.html',
    controller: ['$scope', '$http', '$q', '$stateParams', '$location', 'ProposalService', 'ValidationService',
      function ($scope, $http, $q, $stateParams, $location, ProposalService, ValidationService) {

        $scope.workflows = [];
        $scope.currentWorkflow = {};
        $scope.parentWorkflow = null;
        $scope.startingWorkflow = null;
        $scope.backWorkflow = null;
        $scope.nextWorkflow = null;
        $scope.proposalData = {};
        $scope.validationData = {};
        var getWorkflow = function(workflow_id) {
          var deferred = $q.defer();
          $http.get('api/v1/elements/' + workflow_id + '/').success(function(data) {
            data.id = workflow_id;
            deferred.resolve(data);
          });
          return deferred.promise;
        };

        var buildIndex = function(workflow) {
          $scope.workflows.push(workflow);
          if (workflow.children !== undefined) {
            for (var i = 0; i < workflow.children.length; i++) {
              buildIndex(workflow.children[i]);
            }
          }
        };

        ProposalService.get(parseInt($scope.proposalId)).then(function(data) {
          $scope.proposal = data;
          if (data.data !== null && data.data.length > 0) {
            var parsedData = data.data.replace(/\'/g, '\"');
            parsedData = parsedData.replace(/True/g, 'true');
            $scope.proposalData = JSON.parse(parsedData);
          }
          else {
            $scope.proposalData = {};
          }
          getWorkflow($scope.proposal.workflow).then(function(data) {
            $scope.workflow = data;
            buildIndex($scope.workflow);
            if ($stateParams.current !== null) {
              for (var i = 0; i < $scope.workflows.length; i++) {
                if ($scope.workflows[i].id === parseInt($stateParams.current)) {
                  $scope.jumpTo(parseInt($stateParams.current));
                  break;
                }
              }
            }
            if ($scope.currentWorkflow.id === undefined) {
              $scope.currentWorkflow = $scope.workflow;
            }

            $scope.startingWorkflow = $scope.workflow.id;
          });
        });

        // for next/previous workflow, you need to get the parent workflow,
        // and then iterate over the questions until you find
        var getParentWorkflow = function(workflow_id) {
          var count = $scope.workflows.length;
          for (var i = 0; i < count; i++) {
            var childCount = $scope.workflows[i].children.length;
            for (var j = 0; j < childCount; j++) {
              if ($scope.workflows[i].children[j].id === workflow_id) {
                return $scope.workflows[i];
              }
            }
          }
          return null;
        };

        var getNextWorkflow = function(workflow_id) {
          var parentWorkflow = $scope.parentWorkflow;
          var found = false;
          var childCount = 0;
          while (!found && parentWorkflow !== null) {
            found = false;
            childCount = parentWorkflow.children.length;
            for (var i = 0; i < childCount; i++) {
              if (parentWorkflow.children[i].id === workflow_id) {
                found = true;
              }
              else if (found && (parentWorkflow.children[i].element_type === 'workflow' || parentWorkflow.children[i].element_type === 'group')) {
                return parentWorkflow.children[i].id;
              }
            }
            // haven't found at the current level, so let's go up a level and continue looking.
            workflow_id = $scope.parentWorkflow.id;
            parentWorkflow = getParentWorkflow(workflow_id);
            found = false;
          }
          // no next workflow
          return null;
        };

        var getPreviousWorkflow = function(workflow_id) {
          if ($scope.parentWorkflow !== null) {
            var childCount = $scope.parentWorkflow.children.length; 
            var previousWorkflow = null;
            for (var i = 0; i < childCount; i++) {
              if ($scope.parentWorkflow.children[i].id === workflow_id) {
                if (previousWorkflow) {
                  return previousWorkflow;
                }
              }
              else if ($scope.parentWorkflow.children[i].element_type === 'workflow' || $scope.parentWorkflow.children[i].element_type === 'group') {
                previousWorkflow = $scope.parentWorkflow.children[i].id;
              }
            }
          }
          if ($scope.parentWorkflow !== null) {
            return $scope.parentWorkflow.id;
          } else {
            return null;
          }
        };

        // need jumpto functionality
        $scope.jumpTo = function(workflow_id) {
          var count = $scope.workflows.length;
          for (var i = 0; i < count; i++) {
            if (workflow_id === $scope.workflows[i].id) {
              $scope.currentWorkflow = $scope.workflows[i];
              $scope.parentWorkflow = getParentWorkflow(workflow_id);
              $scope.backWorkflow = getPreviousWorkflow(workflow_id);
              $scope.nextWorkflow = getNextWorkflow(workflow_id);
              $location.search('current', workflow_id);
              //$stateParams.current = workflow_id;
              break;
            }
          }
        };

        $scope.showBackButton = function() {
          return $scope.backWorkflow !== null;
        };

        $scope.showNextButton = function() {
          return $scope.nextWorkflow !== null;
        };

        $scope.saveData = function() {
          console.log('saved Data', $scope.proposalData);
          ProposalService.saveData(parseInt($scope.proposalId), JSON.stringify($scope.proposalData));
        };

        $scope.validate = function() {
          var response = ValidationService.validate($scope.currentWorkflow, $scope.proposalData, $scope.validationData, false);
        }
      }
    ]
  };
});
