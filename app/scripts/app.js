'use strict';

angular.module('sbirezApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'schemaForm'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'AdminUserCtrl'
      })
      .when('/logout', {
        templateUrl: 'partials/logout',
        controller: 'AdminUserCtrl',
        access: { requiredAuthentication: true }
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push('TokenInterceptor');

    $locationProvider.html5Mode(true);
  });

