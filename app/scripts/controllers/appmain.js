'use strict';

angular.module('sbirezApp')
  .controller('AppMainCtrl', function ($scope, $http, $location, $state, $window, AuthenticationService) {
    $scope.auth = AuthenticationService;
    $scope.isLoggedIn = $scope.auth.getAuthenticated() && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined);

    console.log('AppMain Ctrl');

    AuthenticationService.registerObserverCallback(function() {
      $scope.isLoggedIn = AuthenticationService.isAuthenticated && ($window.sessionStorage.token !== null && $window.sessionStorage.token !== undefined && $window.sessionStorage.token !== '');
    });

    $scope.tabs = [
      { label : 'Activity', sref : 'app.activity.proposals.list' },
      { label : 'Notifications', sref : 'app.notifications' },
      { label : 'Account', sref : 'app.account' }
    ];

    $scope.selectedTab = $scope.tabs[0];
    console.log($scope.selectedTab.label);

    if ($scope.isLoggedIn && !$state.includes($scope.selectedTab.sref)) {
      console.log('All state go!');
      console.log($state);
//      $state.go($scope.selectedTab.sref);
    }

    $scope.tabClass = function(tab) {
      if ($state.includes(tab.sref)) {
        return 'active';
      } else {
        return '';
      }
    };
  });
