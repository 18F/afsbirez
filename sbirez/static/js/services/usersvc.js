'use strict';

angular.module('sbirezApp').factory('UserService', function($http, $window, $rootScope, $location, AuthenticationService) {
  var user = {};
  return {
    logIn: function(username, password) {
      return $http.post('auth/', {username: username, password: password});
    },

    logOut: function() {
        $window.sessionStorage.token = '';
        $window.sessionStorage.username = null;
        $window.sessionStorage.userid = null;
        AuthenticationService.setAuthenticated(false);
        $location.path('/');      
    },

    resetPassword: function(email) {
      return $http.post('rest-auth/password/reset/', {'email': email});
    },

    createUser: function(name, username, password) {
      return $http.post('api/v1/users/', 
        {
          name: name, 
          username: username, 
          email: username, 
          password: password,
          groups: [],
          is_staff: false 
        });
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
        $http.get('api/v1/users/' + id).success(function(data) {
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
      $http.post('api/v1/users/' + id, user).success(function() {
      });
    }
  };
});
