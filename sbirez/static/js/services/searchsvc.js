'use strict';

angular.module('sbirezApp').factory('SearchService', function($http, $window, $q) {
  var SEARCH_URI = 'api/v1/topics';
  var lastSearch = '';
  var currentPage = 0;
  var itemCount = 0;
  var numFound = 0;
  var results = {};
 
  return {
    search: function(page, searchTerm, itemsPerPage) {
      var deferred = $q.defer();
      if (typeof page === 'number' && page === Math.floor(page) && page >= 0) {
        page = page;
      }
      else if (page === 'next') {
        page = currentPage + 1;
      }
      else if (page === 'prev') {
        page = currentPage - 1;
      }
      else {
        page = 0;
      }

      if (page === currentPage && lastSearch === searchTerm) {
        deferred.resolve(results);
        return deferred.promise;
      }

      currentPage = page;
      lastSearch = searchTerm;

      var config = {};
      config.params = [];
      config.params.q = searchTerm;
      config.params.limit = itemsPerPage;
      config.params.start = itemsPerPage * page + 1;
      $http.get(SEARCH_URI, config).success(function(data) {
        results = data;
        numFound = data.numFound;
        itemCount = data._embedded['ea:topic'].length;
        deferred.resolve(results);
      });
      return deferred.promise;
    },

    loadState: function() {
      return {
        searchTerm: lastSearch,
        currentPage: currentPage,
        itemCount: itemCount,
        numFound: numFound,
        results: results
      };
    }
  };
});
