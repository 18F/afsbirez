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
    controller: ['$scope', '$filter', '$window', '$location', '$http',
      function ($scope, $filter, $window, $location, $http) {

        $scope.stateData = {};
        $scope.stateData.fields = [];

        $http.get('api/workflowdata/1').success(function(data) {
          $scope.stateData = data;
        });

        $http.get('api/workflows/1').success(function(data) {
          $scope.workflow = data;
          $scope.currentStateIndex = 1;
          $scope.currentState = $scope.workflow.sections[0].states[0];
          $scope.currentStateData = getStateDataById($scope.currentState.id);
          $scope.currentSectionId = $scope.workflow.sections[0].id;
        });

        var getStateById = function(id) {
          for (var i = 0; i < $scope.workflow.sections.length; i++) {
            for (var j = 0; j < $scope.workflow.sections[i].states.length; j++) {
              if ($scope.workflow.sections[i].states[j].id === id) {
                return $scope.workflow.sections[i].states[j];
              }
            }
          }
        };

        var getSectionIdByStateId = function(id) {
          for (var i = 0; i < $scope.workflow.sections.length; i++) {
            for (var j = 0; j < $scope.workflow.sections[i].states.length; j++) {
              if ($scope.workflow.sections[i].states[j].id === id) {
                return $scope.workflow.sections[i].id;
              }
            }
          }
        };

        var getStateDataById = function(id) {
          if ($scope.stateData.fields) {
            for (var i = 0; i < $scope.stateData.fields.length; i++) {
              if ($scope.stateData.fields[i].id === id) {
                return $scope.stateData.fields[i];
              }
            }
          }
          var newData = {id: id};
          if (!$scope.stateData.fields) {
            $scope.stateData.fields = [];
          }
          $scope.stateData.fields.push(newData);
          return $scope.stateData.fields[$scope.stateData.fields.length - 1];
        };

        $scope.showBackButton = function() {
          if ($scope.workflow && $scope.workflow.sections) {
            return $scope.currentState.id !== $scope.workflow.sections[0].states[0].id;
          }
          else {
            return false;
          }
        };

        $scope.showNextButton = function() {
          if ($scope.workflow && $scope.workflow.sections) {
            return $scope.currentState.nextState !== undefined && $scope.currentState.nextState !== null;
          }
          else {
            return false;
          }
        };

        $scope.getStateCount = function() {
          var count = 0;
          if ($scope.workflow && $scope.workflow.sections) {
            for (var i = 0; i < $scope.workflow.sections.length; i++) {
              count += $scope.workflow.sections[i].states.length;
            }
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
          $scope.currentStateData.validated = validated;
          return validated;
        };

        $scope.nextState = function() {
          validate();
          $scope.currentState = getStateById($scope.currentState.nextState);
          $scope.currentSectionId = getSectionIdByStateId($scope.currentState.id);
          $scope.currentStateData = getStateDataById($scope.currentState.id);
          $scope.currentStateIndex++;
        };

        $scope.changeState = function(state) {
          validate();
          var count = 0;
          for (var i = 0; i < $scope.workflow.sections.length; i++) {
            for (var j = 0; j < $scope.workflow.sections[i].states.length; j++) {
              count++;
              if (state === $scope.workflow.sections[i].states[j].id) {
                $scope.currentState = $scope.workflow.sections[i].states[j];
                $scope.currentStateIndex = count;
                $scope.currentSectionId = $scope.workflow.sections[i].id;
                $scope.currentStateData = getStateDataById($scope.currentState.id);
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

        $scope.isStateCompleted = function(state) {
          for (var i = 0; i < $scope.stateData.fields.length; i++) {
            if ($scope.stateData.fields[i].id === state && $scope.stateData.fields[i].validated) {
              return true;
            }
          }
          return false;
        };

        $scope.getStateStatus = function(state) {
          if ($scope.isCurrentState(state)) {
            return 'current-state-list-item label-primary';
          }
          else if ($scope.isStateCompleted(state)) {
            return 'label-info';
          }
          else {
            return 'label-warning';
          }
        };
      }
    ]
  };
});
