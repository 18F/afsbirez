'use strict';

angular.module('sbirezApp')
  .controller('ProposalListCtrl', function ($scope, $http) {
    $scope.proposalList = [];
    $http.get('/api/proposals').success(function(list) {
      console.log(list);
      $scope.proposalList = list.proposals;
    });
    console.log('Proposal List Ctrl');
  });
