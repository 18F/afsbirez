'use strict';

angular.module('sbirezApp').factory('UserService', function($http) {
  return {
    logIn: function(username, password) {
      return $http.post('auth', {username: username, password: password});
    },
 
    logOut: function() {

    }
  };
});
