'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $http, $window,
               SearchService, SavedOpportunityService, SavedSearchService) {
    $scope.jwt = $window.sessionStorage.token;
    
    var state = SearchService.loadState();

    var SOLICITATIONS_PER_PAGE = 10;
    $scope.itemsPerPage = SOLICITATIONS_PER_PAGE;

    $scope.simpleMode = true;
    $scope.searchTerm = state.searchTerm; 
    $scope.currentPage = state.currentPage;
    $scope.itemCount = state.itemCount;
    $scope.results = state.results;

    $scope.saveOpportunity = function(opportunityId) {
      SavedOpportunityService.save(opportunityId);
    };

    $scope.saveSearch = function() {
      SavedSearchService.save($scope.searchTerm);
    };

    $scope.search = function(page) {
      $scope.currentPage = page;
      var data = SearchService.search(page, $scope.searchTerm).then(function(data) {
        $scope.results = data;
        if (data !== undefined && data._embedded !== undefined) {
          $scope.results.docs = data._embedded["ea:topic"];
          $scope.itemCount = data._embedded["ea:topic"].length;
//          $scope.simpleMode = false;
        }
      });
    };
  });
