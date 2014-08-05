'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $http, $window, $routeParams, AuthenticationService) {
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
    $scope.proposalId = $routeParams.documentId;
    $scope.jwt = $window.sessionStorage.token;
    $http.get('api/proposals/' + $scope.proposalId).success(function(data) {
      $scope.data = data;
    });
  });
