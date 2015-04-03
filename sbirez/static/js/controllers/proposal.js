'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $http, $window, $state, AuthenticationService, ProposalService) {
    $scope.proposalId = $state.params.id;
    $scope.data = {};

    ProposalService.get(parseInt($scope.proposalId)).then(function(data) {
      console.log('proposal', data);
      $scope.data = data;
    });
  });
