'use strict';

angular.module('sbirezApp').factory('SavedOpportunityService', function($http, $q) {

  var SAVEDTOPIC_URI = 'api/v1/topics/';
  var PROPOSALS_URI = 'api/v1/proposals/';
  var observerCallbacks = [];
  var opportunities = {};
  opportunities.results = [];

  var callObservers = function() {
    angular.forEach(observerCallbacks, function(callback) {
      if (callback) {
        callback();
      }
    });
  };

  var getOpportunities = function() {
    var deferred = $q.defer();
    $http.get(SAVEDTOPIC_URI + '?closed=true&saved=true').success(function(data) {
      opportunities = data;
      if (opportunities && opportunities.count > 0) {
        $http.get(PROPOSALS_URI).success(function(data) {
          for (var i = 0; i < opportunities.count; i++) {
            for (var j = 0; j < data.count; j++) {
              if (opportunities.results[i].proposal === data.results[j].id) {
                opportunities.results[i].proposal_created = data.results[j].created_at;
                opportunities.results[i].proposal_verified = data.results[j].verified_at;
                opportunities.results[i].proposal_submitted = data.results[j].submitted_at;
                break;
              }
            }
          }
          deferred.resolve(opportunities);
        });
      } else {
        deferred.resolve(opportunities);
      }
    });
    return deferred.promise;
  };

  var getOpportunityCount = function() {
    var deferred = $q.defer();
    if (opportunities && opportunities.results && opportunities.results.length > 0) {
      deferred.resolve(opportunities.count);
    } else {
      getOpportunities().then(function(data) {
        deferred.resolve(opportunities.count);
      });
    }
    return deferred.promise;
  };

  var saveOpportunity = function(opportunityId) {
    var deferred = $q.defer();
    if (parseInt(opportunityId)) {
      $http.post(SAVEDTOPIC_URI + opportunityId + '/saved/').success(function(data) {
        opportunities.count++;
        opportunities.results.push(data);
        deferred.resolve(data);
        callObservers();
      }).error(function(data) {
        deferred.reject(data);
      });
    } else {
      deferred.reject('Invalid opportunity id');
    }
    return deferred.promise;
  };

  var removeOpportunity = function(opportunityId) {
    var deferred = $q.defer();
    if (parseInt(opportunityId)) {
      $http.delete(SAVEDTOPIC_URI + opportunityId + '/saved/').success(function(data) {
        opportunities.count--;
        deferred.resolve(data);
        callObservers();
      }).error(function(data) {
        deferred.reject(data);
      });
    } else {
      deferred.reject('Invalid opportunity id');
    }
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
    },
    count: function() {
      return getOpportunityCount();
    },
    registerCountObserverCallback : function(callback) {
      observerCallbacks.push(callback);
    },
  };
});
