'use strict';

angular.module('sbirezApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'formly'
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
