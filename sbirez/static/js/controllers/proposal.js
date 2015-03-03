'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $http, $window, $state, AuthenticationService) {
    console.log('Proposal Ctrl');
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
    $scope.proposalId = $state.params.id;
    $scope.jwt = $window.sessionStorage.token;
    $http.get('api/proposals/' + $scope.proposalId).success(function(data) {
      $scope.data = data;
    });
  });
