'use strict';

angular.module('sbirezApp').factory('UserService', function($http, $window, $rootScope) {
  var user = {};
  return {
    logIn: function(username, password) {
      return $http.post('auth', {username: username, password: password});
    },

    logOut: function() {

    },

    addOrganization: function(orgName) {
      if (user.name === null || user.name === undefined || user.name === '') {
        this.getUserDetails();
      }
      user.organizations.push({'name': orgName, 'id': 1});
      $rootScope.$broadcast('userUpdated', user);
    },

    getUserDetails: function(id) {
      if (user.name === null || user.name === undefined || user.name === '') {
        if (id === undefined || id === null) {
          id = $window.sessionStorage.userid;
        }
        $http.get('/api/users/' + id).success(function(data) {
          user = data.user;
          $rootScope.$broadcast('userUpdated', user);
          return user;
        });
      }
      else {
        return user;
      }
    },
   
    updateUserDetails: function(id, user) {
      $http.post('/api/users/' + id, user).success(function() {
      });
    }
  };
});
