'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $http, $window, SavedOpportunityService, SavedSearchService) {
    $scope.jwt = $window.sessionStorage.token;
    $scope.results = {};

    var SEARCH_URI = 'api/v1/topics';
    var SOLICITATIONS_PER_PAGE = 10;
    $scope.simpleMode = true;
    $scope.searchTerm = '';
    $scope.itemsPerPage = SOLICITATIONS_PER_PAGE;
    $scope.currentPage = 0;
    $scope.itemCount = 0;

    $scope.saveOpportunity = function(opportunityId) {
      SavedOpportunityService.save(opportunityId);
    };

    $scope.saveSearch = function() {
      SavedSearchService.save($scope.searchTerm);
    };

    $scope.search = function(page) {
      if (page === undefined) {
        page = 0;
      }
      else if (page === 'next') {
        page = $scope.currentPage + 1;
      }
      else if (page === 'prev') {
        page = $scope.currentPage - 1;
      }

      $scope.currentPage = page;

      var config = {};
      config.params = [];
      config.params.q = $scope.searchTerm;
      config.params.limit = SOLICITATIONS_PER_PAGE;
      config.params.start = SOLICITATIONS_PER_PAGE * page;
      $http.get(SEARCH_URI, config).success(function(data) {
        $scope.results = data;
        $scope.itemCount = data.numFound;
//        $scope.simpleMode = false;
      });
    };
  });
