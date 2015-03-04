'use strict';

angular.module('sbirezApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAria',
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
        templateUrl: 'static/views/partials/main.html',
        controller: 'MainCtrl'
      })
      .state('home.search', {
        url: '',
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('topic', {
        url: '/topic/:id',
        views: {
          '': {
            templateUrl: 'static/views/partials/topicDetails.html',
            controller: 'TopicCtrl'
          }
        }
      })
      .state('app', {
        url: '/app',
        abstract: true,
        access: {requiredAuthentication: true},
        views: {
          '': {
            templateUrl: 'static/views/partials/appmain.html',
            controller: 'AppMainCtrl'
          }
        }
      })
      .state('app.activity', {
        url: '',
        abstract: 'true',
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/activity.html',
            controller: 'ActivityCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.search', {
        url: '/search',
        views: {
          'activityContent': {
            templateUrl: 'static/views/partials/search.html',
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
            templateUrl: 'static/views/partials/proposal.html',
            controller: 'ProposalListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.proposals.list', {
        url: '',
        views: {
          '': {
            templateUrl: 'static/views/partials/proposalList.html',
            controller: 'ProposalListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.proposals.detail', {
        url: '/:id',
        views: {
          '': {
            templateUrl: 'static/views/partials/proposal.details.html',
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
            templateUrl: 'static/views/partials/document.html'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.documents.list', {
        url: '',
        views: {
          '': {
            templateUrl: 'static/views/partials/documentList.html',
            controller: 'DocumentListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.documents.detail', {
        url: '/:id',
        views: {
          '': {
            templateUrl: 'static/views/partials/documentDetails.html',
            controller: 'DocumentCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.savedOpps', {
        url: '/savedOpps',
        views: {
          'activityContent': {
            templateUrl: 'static/views/partials/savedOpps.html',
            controller: 'SavedOppsCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.savedSearches', {
        url: '/savedSearches',
        views: {
          'activityContent': {
            templateUrl: 'static/views/partials/savedSearches.html',
            controller: 'SavedSearchesCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.activity.history', {
        url: '/history',
        views: {
          'activityContent': {
            templateUrl: 'static/views/partials/history.html',
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
            templateUrl: 'static/views/partials/account.html',
            controller: 'AccountCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.account.user', {
        url: '',
        views: {
          'accountContent': {
            templateUrl: 'static/views/partials/accountUser.html',
            controller: 'AccountUserCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.account.organization', {
        url: '/organization/:id',
        views: {
          'accountContent': {
            templateUrl: 'static/views/partials/accountOrganization.html',
            controller: 'AccountOrganizationCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.notifications', {
        url: '/notifications',
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/notification.html',
            controller: 'NotificationCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'static/views/partials/login.html',
        controller: 'AdminUserCtrl'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'static/views/partials/logout.html',
        controller: 'AdminUserCtrl',
        access: { requiredAuthentication: true }
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'static/views/partials/contact.html',
        controller: 'ContactCtrl'
      });

    $httpProvider.interceptors.push('TokenInterceptor');
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $locationProvider.html5Mode(true);
  })

.run(function($rootScope, $location, $state, $window, AuthenticationService) {
  $rootScope.preproduction = false;
//  $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
//    console.log('$stateChangeError - fired when an error occurs during transition.');
//    console.log(arguments);
//  });
//  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
//    console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
//  });
  $rootScope.$on('$viewContentLoaded',function(event){
    console.log('$viewContentLoaded - fired after dom rendered',event);
  });
  $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
    console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
    console.log(unfoundState, fromState, fromParams);
  });
  $rootScope.$on('$stateChangeStart',function(event, toState /*, toParams, fromState, fromParams*/){
//  $rootScope.$on('$stateChangeStart', function(event, nextRoute) {
//  console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    if (toState !== null && toState.access !== undefined && toState.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
      event.preventDefault();
      $state.go('home.search');
    }
  });
});
