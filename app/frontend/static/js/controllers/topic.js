'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $http, $window, $state, AuthenticationService) {
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
    $scope.topicId = $state.params.id;
    $scope.data = {};

    var parseDate = function(dateString) {
      if (dateString.length === 8) {
        return new Date(dateString.substring(0,4), dateString.substring(4,6) - 1, dateString.substring(6));
      }
      else {
        return new Date();
      }
    };

    $scope.jwt = $window.sessionStorage.token;
    $http.get('api/v1/topics/' + $scope.topicId).success(function(data) {
      $scope.data = data;
      $scope.data.pre_release_date = parseDate(data.pre_release_date || '');
      $scope.data.proposals_begin_date = parseDate(data.proposals_begin_date || '');
      $scope.data.proposals_end_date = parseDate(data.proposals_end_date || '');
    }).error(function(/*data, status, headers, config*/) {
      $scope.errorMsg = 'The topic you are looking for does not exist.';
    });
  });
