'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, $rootScope, SavedOpportunityService) {
    $scope.data = {};
    $rootScope.bodyClass = 'proposals';

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
      if ($scope.data.results && $scope.data.results.length === 0) {
        $rootScope.bodyClass = 'proposals proposals-no-results';
      } else {
        $rootScope.bodyClass = 'proposals';
      }
    });
  });
