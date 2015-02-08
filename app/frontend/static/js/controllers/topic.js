'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $http, $window, $state, AuthenticationService) {
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
    $scope.topicId = $state.params.id;
    $scope.fromSearch = $state.params.fromSearch;
    $scope.data = {};

    $scope.jwt = $window.sessionStorage.token;
    $http.get('api/v1/topics/' + $scope.topicId).success(function(data) {
      $scope.data = data;
    });
  });
