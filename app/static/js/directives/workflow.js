'use strict';

angular.module('sbirezApp').directive('workflow', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      includeSidebar: '@'
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
              name: "Main Section",
              description: "This is the main section",
              states: [ 
                {
                  id: 'start',
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
                  priorState: 'start'
                },
                {
                  id: 'success2',
                  name: 'All Done',
                  description: 'Thank you for completing the workflow.',
                  priorState: 'success1',
                  nextState: 'start2'
                }
              ]
            },
            {
              name: "Section 2",
              description: "This is the second section.",
              states: [
                {
                  id: 'start2',
                  name: 'Start Next',
                  description: 'Thank you for completing the workflow.',
                  priorState: 'success2'
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

        var getStateDataById = function(id) {
          for (var i = 0; i < $scope.stateData.length; i++) {
            if ($scope.stateData[i].id === id) return $scope.stateData[i];
          }
          var newData = {id: id};
          $scope.stateData.push(newData);
          return $scope.stateData[$scope.stateData.length - 1];
        };

        $scope.currentStateIndex = 1;
        $scope.currentState = getStateById('start');
        $scope.currentStateData = getStateDataById('start');

        $scope.showBackButton = function() {
          return $scope.currentState.id !== 'start';
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
                }
              }
            }
          }
        };

        $scope.isCurrentId = function(state) {
          return state === $scope.currentState.id;
        };
      }
    ]
  };
});
