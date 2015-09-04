'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $rootScope, $location, $anchorScroll, SearchService) {

    $rootScope.bodyClass = 'topics';
 
    var SOLICITATIONS_PER_PAGE = 10;
    $scope.itemsPerPage = SOLICITATIONS_PER_PAGE;

    var loadState = function() {
      var state = SearchService.loadState();
      $scope.searchTerm = state.searchTerm; 
      $scope.currentPage = state.currentPage;
      $scope.itemCount = state.itemCount;
      $scope.numFound = state.numFound;
      $scope.results = state.results;
      if ($scope.numFound > 0) {
        $rootScope.bodyClass = 'topics';
      } else {
        $rootScope.bodyClass = 'topics-no-results';
      }
    };

    $scope.search = function(page) {
      SearchService.search(page, $scope.searchTerm, $scope.itemsPerPage).then(function(data) {
        $scope.results = data;
        if (data !== undefined && data.results !== undefined) {
          $scope.itemCount = data.results.length;
          $scope.numFound = data.count;
          $scope.simpleMode = false;
        }
      }, function(error) {
        console.log(error);
      });
      $scope.currentPage = SearchService.getPage();
      $location.search({'query': $scope.searchTerm, 'page': $scope.currentPage});
      $anchorScroll();
    };

    loadState();
    
    var query = $location.search();
    if (query && query.query && ($scope.searchTerm !== query.query || $scope.numFound === 0)) {
      $scope.searchTerm = query.query;
      if (query.page) {
        $scope.currentPage = query.page;
      }
      $scope.search($scope.currentPage);
    }

    $scope.simpleMode = ($scope.searchTerm === '');
    $scope.simpleModeIcebox = true;

    SearchService.registerObserverCallback(loadState);

    $scope.clear = function() {
      SearchService.clearState();
      loadState();
    };
  });
