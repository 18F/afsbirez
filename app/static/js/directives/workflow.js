'use strict';

angular.module('sbirezApp').directive('workflow', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      includeSidebar: '@',
      includeMetro: '@'
    },
    templateUrl: 'static/views/partials/workflow.html',
    controller: ['$scope', '$filter', '$window', '$location', 
      function ($scope, $filter, $window, $location) {

        $scope.stateData = [];
        $scope.workflow = {
          name: 'Test Workflow',
          description: 'This is a test workflow',
          sections: [
            {
              name: "Pre-Release",
              id: "prerelease",
              description: "This is the pre-release state.",
              states: [
                {
                  id: 'prerelease-start',
                  name: 'Information',
                  description: 'This is the pre-release state.',
                  nextState: 'released-start'
                }
              ]
            },
            {
              name: "Released",
              id: "released",
              description: "This is the released state.",
              states: [
                {
                  id: 'released-start',
                  name: 'Information',
                  description: 'This is the release state.',
                  priorState: 'prerelease-start',
                  nextState: 'proposals-start'
                }
              ]
            },
            {
              name: "Proposals Accepted",
              id: "proposalsaccepted",
              description: "This is the main section",
              states: [ 
                {
                  id: 'proposals-start',
                  name: 'First State',
                  description: 'This is the first state',
                  fields: [ 
                    {
                      id: 'name',
                      name: 'Name',
                      type: 'text',
                      required: true,
                      helpMessage: 'Name is required.'
                    },
                    {
                      id: 'email',
                      name: 'Email',
                      type: 'text',
                      required: true,
                      helpMessage: 'Email is required.'
                    }
                  ],
                  priorState: 'released-start',
                  nextState: 'success1'
                },
                {
                  id: 'success1',
                  name: 'Success State',
                  description: 'This is the second state',
                  fields: [
                    {
                      id: 'agree',
                      name: 'I Agree',
                      type: 'checkbox',
                      required: true,
                      helpMessage: 'You must agree.'
                    }
                  ],
                  nextState: 'success2',
                  priorState: 'proposals-start'
                },
                {
                  id: 'success2',
                  name: 'All Done',
                  description: 'Thank you for completing the workflow.',
                  priorState: 'success1',
                  nextState: 'techeval-start'
                }
              ]
            },
            {
              name: "Technical Evaluation",
              id: "technicalevaluation",
              description: "This is the technical evaluation section.",
              states: [
                {
                  id: 'techeval-start',
                  name: 'Information',
                  description: 'This is the technical evaluation.',
                  priorState: 'success2',
                  nextState: 'source-start'
                }
              ]
            },
            {
              name: "Source Selection",
              id: "sourceselection",
              description: "This is the source selection section.",
              states: [
                {
                  id: 'source-start',
                  name: 'Information',
                  description: 'This is the source selection section.',
                  priorState: 'techeval-start',
                  nextState: 'pr-start'
                }
              ]
            },
            {
              name: "PR Package",
              id: "prpackage",
              description: "This is the PR Package section.",
              states: [
                {
                  id: 'pr-start',
                  name: 'Information',
                  description: 'This is the PR Package section.',
                  priorState: 'source-start',
                  nextState: 'clarification-start'
                }
              ]
            },
            {
              name: "Clarifications",
              id: "clarifications",
              description: "This is the clarifications section.",
              states: [
                {
                  id: 'clarification-start',
                  name: 'Information',
                  description: 'This is the clarifications section.',
                  priorState: 'pr-start',
                  nextState: 'prepareaward-start'
                }
              ]
            },
            {
              name: "Prepare Award",
              id: "prepareaward",
              description: "This is the prepare award section.",
              states: [
                {
                  id: 'prepareaward-start',
                  name: 'Information',
                  description: 'This is the prepare award section.',
                  priorState: 'clarification-start',
                  nextState: 'award-start'
                }
              ]
            },
            {
              name: "Award",
              id: "award",
              description: "This is the award section.",
              states: [
                {
                  id: 'award-start',
                  name: 'Information',
                  description: 'This is the award section.',
                  priorState: 'prepareaward-start'
                }
              ]
            }
          ]
        };

        var getStateById = function(id) {
          for (var i = 0; i < $scope.workflow.sections.length; i++) {
            for (var j = 0; j < $scope.workflow.sections[i].states.length; j++) {
              if ($scope.workflow.sections[i].states[j].id === id) return $scope.workflow.sections[i].states[j];
            }
          }
        };

        var getSectionIdByStateId = function(id) {
          for (var i = 0; i < $scope.workflow.sections.length; i++) {
            for (var j = 0; j < $scope.workflow.sections[i].states.length; j++) {
              if ($scope.workflow.sections[i].states[j].id === id) return $scope.workflow.sections[i].id;
            }
          }
        };

        var getStateDataById = function(id) {
          for (var i = 0; i < $scope.stateData.length; i++) {
            if ($scope.stateData[i].id === id) return $scope.stateData[i];
          }
          var newData = {id: id};
          $scope.stateData.push(newData);
          return $scope.stateData[$scope.stateData.length - 1];
        };

        $scope.currentStateIndex = 1;
        $scope.currentState = $scope.workflow.sections[0].states[0];
        $scope.currentStateData = getStateDataById($scope.currentState.id);
        $scope.currentSectionId = $scope.workflow.sections[0].id;

        $scope.showBackButton = function() {
          return $scope.currentState.id !== $scope.workflow.sections[0].states[0].id; 
        };

        $scope.showNextButton = function() {
          return $scope.currentState.nextState !== undefined && $scope.currentState.nextState !== null;
        };

        $scope.getStateCount = function() {
          var count = 0;
          for (var i = 0; i < $scope.workflow.sections.length; i++) {
            count += $scope.workflow.sections[i].states.length;
          }
          return count;
        };

        $scope.backState = function() {
          $scope.currentState = getStateById($scope.currentState.priorState);
          $scope.currentSectionId = getSectionIdByStateId($scope.currentState.id);
          $scope.currentStateIndex--;
        };

        var validate = function() {
          var validated = true;
          if ($scope.currentState.fields && $scope.currentState.fields.length) {
            for (var i = 0; i < $scope.currentState.fields.length; i++) {
              var currentValue = $scope.currentStateData[$scope.currentState.fields[i].id];
              if ($scope.currentState.fields[i].required && (currentValue === undefined || currentValue.length === 0 || currentValue === false)) {
                $scope.currentState.fields[i].invalid = true;
                validated = false;
              }
              else {
                $scope.currentState.fields[i].invalid = false;
              }
            }
          }
          return validated;
        }

        $scope.nextState = function() {
          if (validate()) {
            $scope.currentState = getStateById($scope.currentState.nextState);
            $scope.currentSectionId = getSectionIdByStateId($scope.currentState.id);
            $scope.currentStateIndex++;
          }
        };

        $scope.changeState = function(state) {
          if (validate()) {
            var count = 0;
            for (var i = 0; i < $scope.workflow.sections.length; i++) {
              for (var j = 0; j < $scope.workflow.sections[i].states.length; j++) {
                count++;
                if (state === $scope.workflow.sections[i].states[j].id) {
                  $scope.currentState = $scope.workflow.sections[i].states[j];
                  $scope.currentStateIndex = count;
                  $scope.currentSectionId = $scope.workflow.sections[i].id;
                }
              }
            }
          }
        };

        $scope.isCurrentState = function(state) {
          return state === $scope.currentState.id;
        };

        $scope.isCurrentSection = function(section) {
          return section === $scope.currentSectionId;
        };
      }
    ]
  };
});
