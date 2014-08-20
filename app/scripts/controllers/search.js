'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $http, $window) {
    $scope.jwt = $window.sessionStorage.token;
    $scope.results = {};

    var FBOPEN_URI = 'http://api.data.gov/gsa/fbopen-dev/v0/opps';
    var FBOPEN_KEY = 'DEMO_KEY';
    var FBOPEN_SBIR = '(SBIR OR "small business innovation research" OR STTR OR "small business technology transfer")';
    var SOLICITATIONS_PER_PAGE = 2;
    $scope.simpleMode = true;
    $scope.searchTerm = '';

    console.log('Search Ctrl');

    $scope.search = function(page) {
      var combinedSearch = FBOPEN_SBIR;

      if (page === undefined) {
        page = 0;
      }

      if ($scope.searchTerm !== '') {
        combinedSearch += ' AND ' + $scope.searchTerm;
      }

      var config = {};
      config.params = [];
      config.params.q = combinedSearch;
      config.params.api_key = FBOPEN_KEY;
      config.params.limit = SOLICITATIONS_PER_PAGE;
      config.params.start = SOLICITATIONS_PER_PAGE * page;
      $http.get(FBOPEN_URI, config).success(function(data) {
        $scope.results = data;
        $scope.simpleMode = false;
        console.log(data);
      });
    };
  });
