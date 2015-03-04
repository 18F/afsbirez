'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $http, $window,
               SearchService, SavedOpportunityService, SavedSearchService) {
    $scope.jwt = $window.sessionStorage.token;
   
    var loadState = function() {
      var state = SearchService.loadState();
      $scope.searchTerm = state.searchTerm; 
      $scope.currentPage = state.currentPage;
      $scope.itemCount = state.itemCount;
      $scope.numFound = state.numFound;
      $scope.results = state.results;
    };

    loadState(); 

    var SOLICITATIONS_PER_PAGE = 10;
    $scope.itemsPerPage = SOLICITATIONS_PER_PAGE;

    $scope.simpleMode = ($scope.searchTerm === '');
    $scope.simpleModeIcebox = true;

    $scope.saveOpportunity = function(opportunityId) {
      SavedOpportunityService.save(opportunityId);
    };

    $scope.saveSearch = function() {
      SavedSearchService.save($scope.searchTerm);
    };

    $scope.search = function(page) {
      SearchService.search(page, $scope.searchTerm, $scope.itemsPerPage).then(function(data) {
        $scope.results = data;
        if (data !== undefined && data.results !== undefined) {
          $scope.itemCount = data.results.length;
          $scope.numFound = data.count;
          $scope.simpleMode = false;
        }
      });
      $scope.currentPage = SearchService.getPage();
    };

    $scope.clear = function() {
      SearchService.clearState();
      loadState();
    };
  });
