'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $http, $window) {
    $scope.jwt = $window.sessionStorage.token;
    $scope.results = {};

    var FBOPEN_URI = 'http://api.data.gov/gsa/fbopen/v0/opps';
    //var FBOPEN_KEY = 'DEMO_KEY';
    //var FBOPEN_KEY = 'ftAQGUKHMf09pl9re18Vg1E3sEK5K1JQjPdpUiyG';
    var FBOPEN_KEY = 'hd4gdCcFEms7xOkxkE7qv5N0Wde5kGggq0EI0NKT';
    var FBOPEN_SBIR = '(SBIR OR "small business innovation research" OR STTR OR "small business technology transfer")';
    var SOLICITATIONS_PER_PAGE = 10;
    $scope.simpleMode = true;
    $scope.searchTerm = '';
    $scope.itemsPerPage = SOLICITATIONS_PER_PAGE;
    $scope.currentPage = 0;
    $scope.itemCount = 0;
    console.log('Search Ctrl');

    $scope.search = function(page) {
      var combinedSearch = FBOPEN_SBIR;

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

      if ($scope.searchTerm !== '') {
        combinedSearch += ' AND ' + $scope.searchTerm;
      }

      var config = {};
      config.params = [];
      config.params.q = combinedSearch;
      config.params.api_key = FBOPEN_KEY;
//      config.params.limit = SOLICITATIONS_PER_PAGE;
      config.params.start = SOLICITATIONS_PER_PAGE * page;
      $http.get(FBOPEN_URI, config).success(function(data) {
        $scope.results = data;
        $scope.itemCount = data.numFound;
        $scope.simpleMode = false;
      });
    };
  });
