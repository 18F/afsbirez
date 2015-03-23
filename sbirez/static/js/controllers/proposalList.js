'use strict';

angular.module('sbirezApp')
  .controller('ProposalListCtrl', function ($scope, $http, ProposalService) {
    $scope.proposalList = [];

    ProposalService.list().then(function(data) {
      console.log(data);
      $scope.proposalList = data.results;
    });
  });
