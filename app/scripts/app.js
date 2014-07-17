'use strict';

angular.module('sbirezApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'schemaForm'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });
