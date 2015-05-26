'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $http, $window, $state, AuthenticationService, ProposalService) {
    $scope.proposalId = $state.params.id;
    $scope.data = {};

    ProposalService.load(parseInt($scope.proposalId)).then(function(data) {
      $scope.data = data;
    });
  });
