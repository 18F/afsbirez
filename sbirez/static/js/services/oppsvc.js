'use strict';

angular.module('sbirezApp').factory('SavedOpportunityService', function($http, $window, DialogService, AuthenticationService) {
  return {
    save: function(opportunityId) {
      if (!AuthenticationService.isAuthenticated) {
        var intention = {};
        intention.name = 'app.activity.savedOpps';
        intention.data = {};
        intention.data.id = opportunityId;
        DialogService.openLogin(intention);
      }
    }
  };
});
