'use strict';

angular.module('sbirezApp').directive('footer', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'views/partials/footer.html',
    controller: ['$scope', '$filter', function ($scope, $filter) {

    }]
  };
});
