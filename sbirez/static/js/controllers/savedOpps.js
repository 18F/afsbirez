'use strict';

angular.module('sbirezApp')
  .controller('SavedOppsCtrl', function ($scope, $rootScope, $state, SavedOpportunityService, SearchService) {
    $scope.data = {};
    $scope.queryData = '';
    $rootScope.bodyClass = 'proposals';

    SavedOpportunityService.list().then(function(data){
      $scope.data = data;
      if ($scope.data.results && $scope.data.results.length === 0) {
        $rootScope.bodyClass = 'proposals proposals-no-results';
      } else {
        $rootScope.bodyClass = 'proposals';
      }
    });

    $scope.search = function() {
      SearchService.search(1, $scope.queryData, 10).then(function(data) {
        $state.go('app.search', {}, {'reload':true});
      }, function(error) {
        console.log(error);
      });
    };
  });
