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

        $scope.openLogout = function() {
          UserService.logOut();
        };

        var setMenu = function() {
          if ($window.sessionStorage.token !== undefined && $window.sessionStorage.token !== null && $window.sessionStorage.token !== '' &&
              AuthenticationService.isAuthenticated) {
            $scope.menu = [{
              'class': 'my-topics',
              'title': 'My Proposals',
              'link': '/app/proposals'
            }, {
              'class': 'my-company',
              'title': 'My Company',
              'link': '/app/account/organization'
            }, {
              'class': 'sign-out',
              'title': 'Sign Out',
              'click':$scope.openLogout
            }];
          } else {
            $scope.menu = [{'title': 'Sign in', 'link':'/signin/', 'class':'sign-in'}];
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
