'use strict';

angular.module('sbirezApp').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'static/views/partials/header.html',
    controller: ['$scope', '$filter', '$window', '$location', '$state', 'AuthenticationService', 'DialogService', 'UserService', 'SearchService',
      function ($scope, $filter, $window, $location, $state, AuthenticationService, DialogService, UserService, SearchService) {
        $scope.menu = [];
        $scope.query = '';

        $scope.openLogin = function() {
          DialogService.openLogin();
        };

        $scope.openLogout = function() {
          UserService.logOut();
        };

        var setMenu = function() {
          if ($window.sessionStorage.token !== undefined && $window.sessionStorage.token !== null && $window.sessionStorage.token !== '' &&
              AuthenticationService.isAuthenticated) {
            $scope.menu = [{
              'class': 'my-topics',
              'title': 'My topics',
              'link': '/app/savedOpps'
            }, {
              'class': 'notifications',
              'title': 'Notifications',
              'link': '/app/notifications'
            }, {
              'class': 'my-company',
              'title': 'My company',
              'link': '/app/account/organization'
            }, {
              'class': 'sign-out',
              'title': 'Sign out',
              'click':$scope.openLogout
            }];
          } else {
            $scope.menu = [{'title': 'Sign in', 'click':$scope.openLogin, 'class':'sign-in'}];
          }
        };

        setMenu();

        AuthenticationService.registerObserverCallback(setMenu);

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
              $state.go('home.search', {}, {'reload':true});
            }, function(error) {
              console.log(error);
            });
          }
        };

      }
    ]
  };
});
