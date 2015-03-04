'use strict';

angular.module('sbirezApp').factory('SavedOpportunityService', function($http, $window, DialogService, AuthenticationService) {

  var SAVEDTOPIC_URI = 'api/v1/savedtopics/';
  var results = {};

  var getOpportunities = function() {
    return $http.get(SAVEDTOPIC_URI);
  };

  var saveOpportunity = function(opportunityId) {
    var config = {};
    config.params = [];
    config.params.topic = opportunityId;
    $http.post(SAVEDTOPIC_URI, config).success(function(data) {
      results = data;
    });
  };

  var removeOpportunity = function(opportunityId) {
    var config = {};
    config.params = [];
    config.params.topic = opportunityId;
    $http.delete(SAVEDTOPIC_URI, config).success(function(data) {
      results = data;
    });
  }

  return {
    save: function(opportunityId) {
      if (!AuthenticationService.isAuthenticated) {
        var intention = {};
//        intention.name = 'app.activity.savedOpps';
//        intention.data = {};
//        intention.data.id = opportunityId;
        DialogService.openLogin(intention).then(function() {
          saveOpportunity(opportunityId);
        });
      } else {
        saveOpportunity(opportunityId);
      }
    },
    remove: function(opportunityId) {
      // remove opportunity from saved opps
      if (AuthenticationService.isAuthenticated) {
        removeOpportunity(opportunityId);
      }
    },
    list: function() {
      return getOpportunities();
    }
  };
});
