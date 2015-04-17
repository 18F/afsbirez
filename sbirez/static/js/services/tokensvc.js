'use strict';

angular.module('sbirezApp').factory('TokenInterceptor', function ($q, $window, $location, $injector, AuthenticationService) {

  var EXPIRATION_DELTA = 1800000; // 30 minutes, in milliseconds
  var expiration = null;
  var urlBase64Decode = function(str) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }
/* jshint ignore:start */
    return decodeURIComponent(escape(window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
/* jshint ignore:end */
  };
  
  var decodeToken = function(token) {
    var parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    var decoded = urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  };

  var getTokenExpirationDate = function(token) {
    var decoded;
    decoded = decodeToken(token);
    if(!decoded.exp) {
      return null;
    }
    var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds(decoded.exp);
    return d;
  };

  return {
    request: function (config) {
      config.headers = config.headers || {};
      // only need the auth header if we are talking to our api
      if ($window.sessionStorage.token && config.url.indexOf('api/') >= 0) {
        config.headers.Authorization = 'JWT ' + $window.sessionStorage.token;
        if (expiration === null) {
          expiration = getTokenExpirationDate($window.sessionStorage.token);
        }
        var now = new Date();
        // if we are 'near enough' to the expiration, let's try and refresh the token
        // it would be nice to handle expired tokens in a fault tolerant manner, but 
        //  that'll require refactoring the auth code.
        // ref: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
        if (expiration - now < EXPIRATION_DELTA) {
          // need to use the injector to avoid a circular dependency loop.
          var UserService = $injector.get('UserService');
          UserService.refreshToken().then(function(data) {
            $window.sessionStorage.token = data.data.token;
            expiration = getTokenExpirationDate($window.sessionStorage.token);
          }, function(error) {
            // don't immediately log the user out - could have been a server hiccup or something.
            console.log('Failed to refresh the token', error);
          });
        }
      }
      return config;
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    response: function (response) {
      if (response !== null && response.status === 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
        AuthenticationService.isAuthenticated = true;
      }
      return response || $q.when(response);
    },

    responseError: function(rejection) {
      if (rejection !== null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
        $window.sessionStorage.token = '';
        AuthenticationService.setAuthenticated(false);
        $location.path('/');
      }
      return $q.reject(rejection);
    }
  };
});
