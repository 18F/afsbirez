'use strict';

angular.module('sbirezApp').factory('UserService', function($http, $window, $rootScope, $location, $q, AuthenticationService) {
  var user = {};
  return {
    logIn: function(username, password) {
      return $http.post('auth/', {email: username, password: password});
    },

    logOut: function() {
        $window.sessionStorage.token = '';
        $window.sessionStorage.username = null;
        $window.sessionStorage.userid = null;
        $window.sessionStorage.firmid = null;
        user = {};
        AuthenticationService.setAuthenticated(false);
        $location.path('/');      
    },

    refreshToken: function() {
      return $http.post('auth-refresh/', {token: $window.sessionStorage.token});
    },

    resetPassword: function(email) {
      return $http.post('rest-auth/password/reset/', {'email': email});
    },

    changePassword: function(old_password, new_password1, new_password2) {
      return $http.post('rest-auth/password/change/', 
        {
          'old_password': old_password,
          'new_password1': new_password1,
          'new_password2': new_password2
        });
    },

    createUser: function(name, username, password) {
      return $http.post('api/v1/users/', 
        {
          name: name, 
          email: username, 
          password: password,
          groups: [],
          is_staff: false 
        });
    },

    getUserDetails: function(id) {
      var deferred = $q.defer();
      if (user.name === null || user.name === undefined || user.name === '') {
        if (id === undefined || id === null) {
          id = $window.sessionStorage.userid;
        }
        $http.get('api/v1/users/' + id + '/').success(function(data) {
          user = data;
          $rootScope.$broadcast('userUpdated', user);
          deferred.resolve(data);
        }).error(function(data) {
          deferred.reject(new Error(data));
        });
      }
      else {
        deferred.resolve(user);
      }
      return deferred.promise;
    },
   
    updateUserDetails: function(id, user) {
      $http.put('api/v1/users/' + id + '/', user).success(function() {
      });
    }
  };
});
