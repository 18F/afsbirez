'use strict';

angular.module('sbirezApp').factory('SearchService', function($http, $window, $q) {
  var SEARCH_URI = 'api/v1/topics/';
  var lastSearch = '';
  var currentPage = 1;
  var itemCount = 0;
  var numFound = 0;
  var results = {};
 
  return {
    search: function(page, searchTerm, itemsPerPage) {
      var deferred = $q.defer();
      console.log('val', itemCount, itemsPerPage);
      if (typeof page === 'number' && page === Math.floor(page) && page >= 0) {
        page = page;
      }
      else if (page === 'next' && currentPage < (numFound / itemsPerPage)) {
        page = currentPage + 1;
      }
      else if (page === 'next') {
        page = currentPage;
      }
      else if (page === 'prev' && currentPage > 1) {
        page = currentPage - 1;
      }
      else if (page === 'prev') {
        page = currentPage;
      }
      else {
        page = 1;
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
      config.params.page_size = itemsPerPage;
      config.params.page = page;
      config.params.closed = 'true';
      $http.get(SEARCH_URI, config).success(function(data) {
        results = data;
        numFound = data.count;
        itemCount = data.results.length;
        deferred.resolve(results);
      }).error(function(data) {
        deferred.reject(new Error(data));
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
    },

    clearState: function() {
      lastSearch = '';
      currentPage = 0;
      itemCount = 0;
      numFound = 0;
      results = {};
    },

    getPage: function() {
      return currentPage;
    }
  };
});
