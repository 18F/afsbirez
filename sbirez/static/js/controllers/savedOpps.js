'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, $rootScope, SavedOpportunityService, ProposalService) {
    $scope.data = {};
    $rootScope.bodyClass = 'my-topics';

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
    });
  });
