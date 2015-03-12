'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, SavedOpportunityService) {
    $scope.data = {};

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
    });

    $scope.removeOpportunity = function(opportunityId) {
      SavedOpportunityService.remove(opportunityId).then(function() {
        SavedOpportunityService.list().then(function(data) {
          $scope.data = data;
        }, function(error) { 
          console.log(error);
        });
      });
    };
  });
