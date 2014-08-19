'use strict';

angular.module('sbirezApp', [
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
        abstract: true,
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .state('home.search', {
        url: '',
        views: {
          'tabContent': {
            templateUrl: 'partials/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('app', {
        url: '/app',
        abstract: true,
        access: {requiredAuthentication: true},
        views: {
          '': {
            templateUrl: 'partials/appmain.html',
            controller: 'AppMainCtrl'
          }
        }
      })
      .state('app.activity', {
        url: '',
        abstract: 'true',
        views: {
          'tabContent': {
            templateUrl: 'partials/activity.html',
            controller: 'ActivityCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.search', {
        url: '/search',
        views: {
          'activityContent': {
            templateUrl: 'partials/search.html',
            controller: 'SearchCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.proposals', {
        url: '/proposals',
        abstract: true,
        views: {
          'activityContent': {
            templateUrl: 'partials/proposal.html',
            controller: 'ProposalListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.proposals.list', {
        url: '',
        views: {
          '': {
            templateUrl: 'partials/proposalList.html',
            controller: 'ProposalListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.proposals.detail', {
        url: '/:id',
        views: {
          '': {
            templateUrl: 'partials/proposal.details.html',
            controller: 'ProposalCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.documents', {
        url: '/documents',
        abstract: true,
        views: {
          'activityContent': {
            templateUrl: 'partials/document.html',
            controller: 'DocumentListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.documents.list', {
        url: '',
        views: {
          '': {
            templateUrl: 'partials/documentList.html',
            controller: 'DocumentListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.documents.detail', {
        url: '/:id',
        views: {
          '': {
            templateUrl: 'partials/document.details.html',
            controller: 'DocumentCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.savedOpps', {
        url: '/savedOpps',
        views: {
          'activityContent': {
            templateUrl: 'partials/savedOpps.html',
            controller: 'SavedOppsCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.savedSearches', {
        url: '/savedSearches',
        views: {
          'activityContent': {
            templateUrl: 'partials/savedSearches.html',
            controller: 'SavedSearchesCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.history', {
        url: '/history',
        views: {
          'activityContent': {
            templateUrl: 'partials/history.html',
            controller: 'HistoryCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.account', {
        url: '/account',
        abstract: 'true',
        views: {
          'tabContent': {
            templateUrl: 'partials/account.html',
            controller: 'AccountCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.account.user', {
        url: '',
        views: {
          'accountContent': {
            templateUrl: 'partials/accountUser.html',
            controller: 'AccountUserCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.account.organization', {
        url: '/organization/:id',
        views: {
          'accountContent': {
            templateUrl: 'partials/accountOrganization.html',
            controller: 'AccountOrganizationCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.notifications', {
        url: '/notifications',
        views: {
          'tabContent': {
            templateUrl: 'partials/notification.html',
            controller: 'NotificationCtrl'
          }
        },
        access: { requiredAuthentication: true }
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
      });

    $httpProvider.interceptors.push('TokenInterceptor');

    $locationProvider.html5Mode(true);
  })

.run(function($rootScope, $location, $state, $window, AuthenticationService) {
//$rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
//  console.log('$stateChangeError - fired when an error occurs during transition.');
//  console.log(arguments);
//});
//$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
//  console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
//});
//$rootScope.$on('$viewContentLoaded',function(event){
//  console.log('$viewContentLoaded - fired after dom rendered',event);
//});
//$rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
//  console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
//  console.log(unfoundState, fromState, fromParams);
//});
  $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
//  $rootScope.$on('$stateChangeStart', function(event, nextRoute) {
//  console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    if (toState !== null && toState.access !== undefined && toState.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
      event.preventDefault();
      $state.go('home.search');
    }
  });
});
