'use strict';

angular.module('sbirezApp').factory('SearchService', function($http, $window, $q) {
  var SEARCH_URI = 'api/v1/topics';
  var lastSearch = '';
  var currentPage = 0;
  var itemCount = 0;
  var results = {};
 
  return {
    search: function(page, searchTerm) {
      var deferred = $q.defer();
      if (page === undefined) {
        page = 0;
      }
      else if (page === 'next') {
        page = currentPage + 1;
      }
      else if (page === 'prev') {
        page = currentPage - 1;
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
//      config.params.limit = SOLICITATIONS_PER_PAGE;
//      config.params.start = SOLICITATIONS_PER_PAGE * page;
      $http.get(SEARCH_URI, config).success(function(data) {
        results = data;
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
        results: results
      };
    }
  };
});
