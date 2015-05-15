'use strict';

angular.module('sbirezApp').factory('SearchService', function($http, $q, ProposalService, AuthenticationService) {
  var SEARCH_URI = 'api/v1/topics/';
  var lastSearch = '';
  var currentPage = 1;
  var itemCount = 0;
  var numFound = 0;
  var results = {};
  var observerCallbacks = [];
 
  return {
    registerObserverCallback : function(callback) {
      observerCallbacks.push(callback);
    },

    search: function(page, searchTerm, itemsPerPage) {
      var deferred = $q.defer();
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
      var proposals;
      config.params = [];
      config.params.q = searchTerm;
      config.params.page_size = itemsPerPage;
      config.params.page = page;
      config.params.closed = 'true';
      $http.get(SEARCH_URI, config).success(function(data) {
        results = data;
        numFound = data.count;
        itemCount = data.results.length;
        if (AuthenticationService.getAuthenticated()) {
          if (data.results && data.results.length > 0) {
            ProposalService.list().then(function(proposals) {
              if (proposals.results) {
                proposals = proposals;
                for (var i = 0; i < proposals.results.length; i++) {
                  for (var j = 0; j < data.results.length; j++) {
                    if (proposals.results[i].topic === data.results[j].id) {
                      data.results[j].proposal_id = proposals.results[i].id;
                      break;
                    }
                  }
                }
              }
            });
          }
        }
        
        deferred.resolve(results);
        angular.forEach(observerCallbacks, function(callback) {
          if (callback) {
            callback();
          }
        });
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
