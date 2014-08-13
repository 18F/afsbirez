'use strict';

angular.module('sbirezApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'schemaForm',
  'angularFileUpload',
  'ngDialog',
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'AdminUserCtrl'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'partials/logout.html',
        controller: 'AdminUserCtrl',
        access: { requiredAuthentication: true }
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .state('proposal', {
        url: '/proposal',
        template: '<ui-view/>',
        controller: 'ProposalCtrl',
        abstract: true,
        access: { requiredAuthentication: true }
      })
      .state('proposal.detail', {
        url: '/:id',
        templateUrl: 'partials/proposal.html',
        access: { requiredAuthentication: true }
      })
      .state('document', {
        url: '/document',
        template: '<ui-view/>',
        controller: 'DocumentCtrl',
        abstract: true,
        access: { requiredAuthentication: true }
      })
      .state('document.detail', {
        url: '/:id',
        templateUrl: 'partials/document.html',
        access: { requiredAuthentication: true }
      })
      .state('home.activity', {
        url: 'activity',
        views: {
          'tabContent': {
            templateUrl: 'partials/activity.html',
            controller: 'ActivityCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('home.account', {
        url: 'account',
        views: {
          'tabContent': {
            templateUrl: 'partials/account.html',
            controller: 'AccountCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('home.notifications', {
        url: 'notifications',
        views: {
          'tabContent': {
            templateUrl: 'partials/notification.html',
            controller: 'NotificationCtrl'
          }
        },
        access: { requiredAuthentication: true }
      });

    $httpProvider.interceptors.push('TokenInterceptor');

    $locationProvider.html5Mode(true);
  })

.run(function($rootScope, $location, $window, AuthenticationService) {
  $rootScope.$on('$stateChangeStart', function(event, nextRoute) {
    if (nextRoute !== null && nextRoute.access !== undefined && nextRoute.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
      console.log('auth failed');
      $location.path('login');
    }
  });
});
