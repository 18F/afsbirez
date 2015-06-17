'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, $rootScope, SavedOpportunityService) {
    $scope.data = {};
    $rootScope.bodyClass = 'my-topics';

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
    });
  });
