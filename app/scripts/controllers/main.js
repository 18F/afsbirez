'use strict';

angular.module('sbirezApp')
  .controller('MainCtrl', function ($scope, $http, $state, $window, AuthenticationService) {
    $scope.auth = AuthenticationService;
    $scope.isLoggedIn = $scope.auth.getAuthenticated() && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined);

    AuthenticationService.registerObserverCallback(function() {
      $scope.isLoggedIn = AuthenticationService.isAuthenticated && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '');
    });

    $scope.tabs = [
      { label : 'Activity', sref : 'home.activity' },
      { label : 'Notifications', sref : 'home.notifications' },
      { label : 'Account', sref : 'home.account' }
    ];

    $scope.selectedTab = $scope.tabs[0];

    if (!$state.includes($scope.selectedTab.sref)) {
      $state.go($scope.selectedTab.sref);
    }

    $scope.tabClass = function(tab) {
      if ($state.includes(tab.sref)) {
        return 'active'
      } else {
        return '';
      }
    };
  });
