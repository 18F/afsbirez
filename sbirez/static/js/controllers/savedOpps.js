'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, SavedOpportunityService) {
    $scope.data = {};


    SavedOpportunityService.list().success(function(data){
      $scope.data = data;
    }).error(function(/*data, status, headers, config*/) {
      $scope.errorMsg = 'Unable to retrieve saved opportunities.';
    });

    $scope.removeOpportunity = function(opportunityId) {
      SavedOpportunityService.remove(opportunityId);
      $scope.data = SavedOpportunityService.list();
    }
  });
