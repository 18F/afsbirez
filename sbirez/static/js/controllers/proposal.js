'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $state) {
    $scope.proposalId = $state.params.id;
  });