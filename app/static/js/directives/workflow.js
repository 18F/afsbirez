'use strict';

angular.module('sbirezApp').directive('workflow', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'static/views/partials/workflow.html',
    controller: ['$scope', '$filter', '$window', '$location', 
      function ($scope, $filter, $window, $location) {

        $scope.stateData = [];
        $scope.workflow = {
          name: 'Test Workflow',
          description: 'This is a test workflow',
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
              priorState: 'success1'
            }
          ]
        };

        var getStateById = function(id) {
          for (var i = 0; i < $scope.workflow.states.length; i++) {
            if ($scope.workflow.states[i].id === id) return $scope.workflow.states[i];
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
          return $scope.workflow.states.length;
        };

        $scope.backState = function() {
          $scope.currentState = getStateById($scope.currentState.priorState);
          $scope.currentStateIndex--;
        };

        $scope.nextState = function() {
//          for (var i = 0; i < $scope.currentState.fields.length; i++) {
//            if ($scope.currentState.fields[i].required)
//          }
          $scope.currentState = getStateById($scope.currentState.nextState);
          $scope.currentStateIndex++;
        };
      }
    ]
  };
});
