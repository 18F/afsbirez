'use strict';

angular.module('sbirezApp').factory('AuthenticationService', function() {
  var observerCallbacks = [];
  return {
    registerObserverCallback : function(callback) {
      observerCallbacks.push(callback);
    },

    getAuthenticated : function() {
      return this.isAuthenticated;
    },

    setAuthenticated : function(value) {
      this.isAuthenticated = value;
      angular.forEach(observerCallbacks, function(callback) {
        if (callback) {
          callback();
        }
      });
    },

    isAuthenticated: false
  };
});
