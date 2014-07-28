angular.module('sbirezApp').directive('header', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/partials/header.html',
    controller: ['$scope', '$filter', '$window', '$location', 'AuthenticationService',
      function ($scope, $filter, $window, $location, AuthenticationService) {
      $scope.menu = [{
        'title': 'Home',
        'link': '/'
      }];

      if ($window.sessionStorage.token !== undefined && AuthenticationService.isLogged) {
        $scope.menu.push({'title': 'Logout', 'link':'/logout'});
      }
      else {
        $scope.menu.push({'title': 'Login', 'link':'/login'});
      }

      $scope.isActive = function(route) {
        return route === $location.path();
      };
    }]
  }
});
