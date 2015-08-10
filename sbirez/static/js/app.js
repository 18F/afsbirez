'use strict';

angular.module('sbirezApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAria',
  'angularFileUpload',
  'ngDialog',
  'ui.router',
  'ngOrderObjectBy'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        views: {
          '': {
            templateUrl: 'static/views/partials/main.html',
            controller: 'MainCtrl'
          }
        }
      })
      .state('search', {
        url: '/search/',
        views: {
          '': {
            templateUrl: 'static/views/partials/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('signin', {
        url: '/signin?target&current',
        views: {
          '': {
            templateUrl: 'static/views/partials/signin.html',
            controller: 'SignInCtrl'
          }
        }
      })
      .state('signup', {
        url: '/signup?target&current',
        views: {
          '': {
            templateUrl: 'static/views/partials/signup.html',
            controller: 'SignUpCtrl'
          }
        }
      })
      .state('reset', {
        url: '/reset/',
        views: {
          '': {
            templateUrl: 'static/views/partials/reset.html',
            controller: 'ResetCtrl'
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
            controller: ''
          }
        }
      })
      .state('app.search', {
        url: '/search?q',
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/search.html',
            controller: 'SearchCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.landing', {
        url: '/landing',
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/landing.html',
            controller: 'LandingCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.proposals', {
        url: '/proposals',
        abstract: true,
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/proposal.html',
            controller: ''
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.proposals.list', {
        url: '',
        views: {
          '': {
            templateUrl: 'static/views/partials/savedOpps.html',
            controller: 'SavedOppsCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.proposals.detail', {
        url: '/:id?current',
        reloadOnSearch: false,
        views: {
          '': {
            templateUrl: 'static/views/partials/proposal.details.html',
            controller: 'ProposalCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.proposals.report', {
        url: '/report/:id',
        views: {
          '': {
            templateUrl: 'static/views/partials/proposal.report.html',
            controller: 'ProposalReportCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.documents', {
        url: '/documents',
        abstract: true,
        views: {
          'tabContent': {
            templateUrl: 'static/views/partials/document.html'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.documents.list', {
        url: '',
        views: {
          '': {
            templateUrl: 'static/views/partials/documentList.html',
            controller: 'DocumentListCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.documents.detail', {
        url: '/:id',
        views: {
          '': {
            templateUrl: 'static/views/partials/documentDetails.html',
            controller: 'DocumentCtrl'
          }
        },
        access: { requiredAuthentication: true }
      })
      .state('app.history', {
        url: '/history',
        views: {
          'tabContent': {
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
        url: '/organization',
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
  $rootScope.preproduction = true;
  $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
    //console.log('$stateChangeError - fired when an error occurs during transition.');
    //console.log(arguments);
  });
  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
    //console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.', event, toState);
    $rootScope.bodyClass = '';
  });
  $rootScope.$on('$viewContentLoaded',function(event){
    //console.log('$viewContentLoaded - fired after dom rendered',event);
  });
  $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
    //console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
    //console.log(unfoundState, fromState, fromParams);
  });
  $rootScope.$on('$stateChangeStart',function(event, toState, toParams/*, fromState, fromParams*/){
//  $rootScope.$on('$stateChangeStart', function(event, nextRoute) {
  //console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    if (toState !== null && toState.access !== undefined && toState.access.requiredAuthentication && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
      event.preventDefault();
      $state.go('home');
    }
  });
});
