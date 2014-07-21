'use strict';

angular.module('sbirezApp').factory('AuthenticationService', function() {
  var auth = {
    isAuthenticated: false,
    isAdmin: false
  };

  return auth;
});
