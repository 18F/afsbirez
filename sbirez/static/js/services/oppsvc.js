'use strict';

angular.module('sbirezApp').factory('SavedOpportunityService', function($http, $window, $q, DialogService, AuthenticationService) {

  var SAVEDTOPIC_URI = 'api/v1/topics/';
  var results = {};

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
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var removeOpportunity = function(opportunityId) {
    var deferred = $q.defer();
    $http.delete(SAVEDTOPIC_URI + opportunityId + '/saved/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  return {
    save: function(opportunityId) {
      if (!AuthenticationService.isAuthenticated) {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return saveOpportunity(opportunityId);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      } else {
        return saveOpportunity(opportunityId);
      }
    },
    remove: function(opportunityId) {
      // remove opportunity from saved opps
      if (AuthenticationService.isAuthenticated) {
        return removeOpportunity(opportunityId);
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Failed to authenticate'));
        return deferred.promise;
      }
    },
    list: function() {
      return getOpportunities();
    }
  };
});
