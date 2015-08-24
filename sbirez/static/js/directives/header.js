'use strict';

angular.module('sbirezApp').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'static/views/partials/header.html',
    controller: ['$scope', '$rootScope', '$window', '$location', '$state', 'AuthenticationService', 'UserService', 'SearchService', 'SavedOpportunityService',
      function ($scope, $rootScope, $window, $location, $state, AuthenticationService, UserService, SearchService, SavedOpportunityService) {
        $scope.menu = [];
        $scope.query = '';
        $scope.warning = false;

        $scope.openLogout = function() {
          UserService.logOut();
        };

        var getDays = function(expiration) {
          var now = Date.now();
          var dayInMS = 60 * 60 * 24 * 1000;
          var expirationDate = new Date(expiration);
          return (expirationDate - now) / dayInMS; 
        };

        var setMenu = function() {
          $scope.warning = false;
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
            if ($window.sessionStorage.expiration !== null) {
              var days = parseInt(getDays($window.sessionStorage.expiration));
              if (days < 11) {
                $scope.warning = true;
                $scope.expiration_days = '' + days;
                $scope.expiration_days +=  days > 1 ? ' days' : 'day';
              } else {
                $scope.warning = false;
              }
            }
          } else {
            $scope.warning = false;
            $scope.menu = [{'title': 'Sign in', 'link':'/signin', 'class':'sign-in'}];
          }
        };

        setMenu();

        var setSearchTerm = function(term) {
          $scope.query = term;
        };

        AuthenticationService.registerObserverCallback(setMenu);
        SavedOpportunityService.registerCountObserverCallback(setMenu);
        SearchService.registerSearchTermCallback(setSearchTerm);

        $rootScope.$on('userUpdated', function() {
          setMenu();
        });

        $scope.search = function() {
          if(AuthenticationService.isAuthenticated &&
             ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '')) {
            SearchService.search(1, $scope.query, 10).then(function(data) {
              $state.go('app.search', {'query': $scope.query}, {'reload': false, 'location': true});
            }, function(error) {
              console.log(error);
            });
          } else {
            SearchService.search(1, $scope.query, 10).then(function(data) {
              $state.go('search', {'query': $scope.query}, {'reload':true, 'location': true});
            }, function(error) {
              console.log(error);
            });
          }
        };

      }
    ]
  };
});
