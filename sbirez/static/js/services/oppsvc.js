'use strict';

angular.module('sbirezApp').factory('SavedOpportunityService', function($http, $window, $q, AuthenticationService) {

  var SAVEDTOPIC_URI = 'api/v1/topics/';

  var getOpportunities = function() {
    var deferred = $q.defer();
    $http.get(SAVEDTOPIC_URI + '?closed=true&saved=true').success(function(data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  };

  var saveOpportunity = function(opportunityId) {
    var deferred = $q.defer();
    $http.post(SAVEDTOPIC_URI + opportunityId + '/saved/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  var removeOpportunity = function(opportunityId) {
    var deferred = $q.defer();
    $http.delete(SAVEDTOPIC_URI + opportunityId + '/saved/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  return {
    save: function(opportunityId) {
      return saveOpportunity(opportunityId);
    },
    remove: function(opportunityId) {
      return removeOpportunity(opportunityId);
    },
    list: function() {
      return getOpportunities();
    }
  };
});
