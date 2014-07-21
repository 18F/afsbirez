'use strict';

angular.module('sbirezApp')
  .controller('ProposalCtrl', function ($scope, $http) {

    $http.get('/api/proposals').success(function(list) {
      console.log(list);
      $scope.proposalList = list.proposals;
    });

  });
