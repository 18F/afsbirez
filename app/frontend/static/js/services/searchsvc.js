'use strict';

angular.module('sbirezApp').factory('SavedSearchService', function($http, $window, DialogService, AuthenticationService) {
  return {
    save: function(query) {
      if (!AuthenticationService.isAuthenticated) {
        var intention = {};
        intention.name = 'app.activity.savedSearches';
        intention.data = {};
        intention.data.query = query;
        DialogService.openLogin(intention);
      }
    }
  };
});
