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
    controller: ['$scope', '$window', '$http', '$q', '$stateParams', 'ProposalService',
      function ($scope, $window, $http, $q, $stateParams, ProposalService) {

        $scope.workflows = [];
        $scope.currentWorkflow = {};
        $scope.parentWorkflow = null;
        $scope.startingWorkflow = null;
        $scope.backWorkflow = null;
        $scope.nextWorkflow = null;
        var promises = [];
        $scope.proposalData = {};

        var getWorkflow = function(workflow_id) {
          var deferred = $q.defer();
          $http.get('api/v1/workflows/' + workflow_id + '/').success(function(data) {
            data.id = workflow_id;
            $scope.workflows.push(data);
            var count = data.questions.length;
            for (var i = 0; i < count; i++) {
              if (data.questions[i].data_type === 'workflow') {
                promises.push(getWorkflow(data.questions[i].subworkflow));
              }
            }
            deferred.resolve(data);
          });
          return deferred.promise;
        };

        var buildTree = function(workflow) {
          var workflowCount = $scope.workflows.length;
          var count = workflow.questions.length;
          for (var i = 0; i < count; i++) {
            if (workflow.questions[i].data_type === 'workflow') {
              for (var j = 0; j < workflowCount; j++) {
                if ($scope.workflows[j].id === workflow.questions[i].subworkflow) {
                  workflow.questions[i].workflow = $scope.workflows[j];
                  workflow.questions[i].workflow = buildTree(workflow.questions[i].workflow);
                  $scope.workflows[j].human = workflow.questions[i].human;
                  break;
                }
              }
            }
          }
          return workflow;
        };

        ProposalService.get(parseInt($scope.proposalId)).then(function(data) {
          $scope.proposal = data;
          if (data.data !== null && data.data.length > 0) {
            var parsedData = data.data.replace(/\'/g, "\"");
            parsedData = parsedData.replace(/True/g, "true");
            $scope.proposalData = JSON.parse(parsedData);
          }
          else {
            $scope.proposalData = {};
          }
          getWorkflow($scope.proposal.workflow).then(function(data) {
            $scope.workflow = data;
            $scope.workflow.human = 'Coversheet Workflow';
            $q.all(promises).then(function() {
              $scope.workflow = buildTree($scope.workflow);
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
        });

        // need next/previous workflow
        // for next/previous workflow, you need to get the parent workflow,
        // and then iterate over the questions until you find
        var getParentWorkflow = function(workflow_id) {
          var count = $scope.workflows.length;
          for (var i = 0; i < count; i++) {
            var questionCount = $scope.workflows[i].questions.length;
            for (var j = 0; j < questionCount; j++) {
              if ($scope.workflows[i].questions[j].data_type === 'workflow' && $scope.workflows[i].questions[j].subworkflow === workflow_id) {
                return $scope.workflows[i];
              }
            }
            return null;
          }
        };

        var getNextWorkflow = function(workflow_id) {
          var count = $scope.workflows.length;
          var parentWorkflow = $scope.parentWorkflow;
          var found = false;
          var questionCount = 0;
          while (!found && parentWorkflow !== null) {
            found = false;
            questionCount = parentWorkflow.questions.length;
            for (var i = 0; i < questionCount; i++) {
              if (parentWorkflow.questions[i].data_type === 'workflow' && parentWorkflow.questions[i].subworkflow === workflow_id) {
                found = true;
              }
              else if (found && parentWorkflow.questions[i].data_type === 'workflow') {
                return parentWorkflow.questions[i].workflow.id;
              }
            }
            if (!found) {
              workflow_id = $scope.parentWorkflow.id;
              parentWorkflow = getParentWorkflow(workflow_id);
            }
          }
          // no next workflow
          return null;
        };

        var getPreviousWorkflow = function(workflow_id) {
          var count = $scope.workflows.length;
          if ($scope.parentWorkflow !== null) {
            var questionCount = $scope.parentWorkflow.questions.length; 
            var previousWorkflow = null;
            for (var i = 0; i < questionCount; i++) {
              if ($scope.parentWorkflow.questions[i].data_type === 'workflow' && $scope.parentWorkflow.questions[i].subworkflow === workflow_id) {
                if (previousWorkflow) {
                  return previousWorkflow;
                }
              }
              else if ($scope.parentWorkflow.questions[i].data_type === 'workflow') {
                previousWorkflow = $scope.parentWorkflow.questions[i].workflow.id;
              }
            }
          }
          if ($scope.parentWorkflow != null)
            return $scope.parentWorkflow.id;
          else
            return null;
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
              $stateParams.current = workflow_id;
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
          ProposalService.saveData($scope.proposalId, $scope.proposalData);
        };
      }
    ]
  };
});
