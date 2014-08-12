'use strict';

angular.module('sbirezApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'schemaForm',
  'angularFileUpload',
  'ngDialog'
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
      .when('/contact', {
        templateUrl: 'partials/contact',
        controller: 'ContactCtrl'
      })
      .when('/proposal/:proposalId', {
        templateUrl: 'partials/proposal',
        controller: 'ProposalCtrl',
        access: { requiredAuthentication: true }
      })
      .when('/document/:documentId', {
        templateUrl: 'partials/document',
        controller: 'DocumentCtrl',
        access: { requiredAuthentication: true }
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push('TokenInterceptor');

    $locationProvider.html5Mode(true);
  })

.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.$on('$routeChangeStart', function(event, nextRoute) {
    if (nextRoute !== null && nextRoute.access !== undefined && nextRoute.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
      console.log('auth failed');
      $location.path('login');
    }
  });
});
