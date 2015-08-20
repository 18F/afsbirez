'use strict';

angular.module('sbirezApp').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'static/views/partials/header.html',
    controller: ['$scope', '$window', '$location', '$state', 'AuthenticationService', 'UserService', 'SearchService', 'SavedOpportunityService',
      function ($scope, $window, $location, $state, AuthenticationService, UserService, SearchService, SavedOpportunityService) {
        $scope.menu = [];
        $scope.query = '';

        $scope.openLogout = function() {
          UserService.logOut();
        };

        var setMenu = function() {
          if ($window.sessionStorage.token !== undefined && $window.sessionStorage.token !== null && $window.sessionStorage.token !== '' &&
              AuthenticationService.isAuthenticated) {
            SavedOpportunityService.count().then(function(data) {
              $scope.menu = [{
                'class': 'proposals',
                'title': 'My Proposals',
                'link': '/~/proposals'
              }, {
                'class': 'company',
                'title': 'My Company',
                'link': '/~/company'
              }, {
                'class': 'sign-out',
                'title': 'Sign Out',
                'click':$scope.openLogout
              }];
              if (data > 0) {
                $scope.menu[0].title = 'My Proposals (' + data + ')';
              }
            });
          } else {
            $scope.menu = [
              {
                'title': 'Sign in',
                'link': '/signin',
                'class': 'sign-in'
              }, {
                'title': 'Sign up',
                'link': '/signup',
                'class': 'sign-up'
              }
            ];
          }
        };

        setMenu();

        AuthenticationService.registerObserverCallback(setMenu);
        SavedOpportunityService.registerCountObserverCallback(setMenu);

        $scope.search = function() {
          if(AuthenticationService.isAuthenticated &&
             ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '')) {
            SearchService.search(1, $scope.query, 10).then(function(data) {
              $state.go('app.search');
            }, function(error) {
              console.log(error);
            });
          } else {
            SearchService.search(1, $scope.query, 10).then(function(data) {
              $state.go('search', {}, {'reload':true});
            }, function(error) {
              console.log(error);
            });
          }
        };

      }
    ]
  };
});
