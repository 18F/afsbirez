'use strict';

angular.module('sbirezApp').directive('pagination', ['$compile', function($compile) {
  return {
    restrict: 'EA',
    replace: false,
    scope: {
      'itemCount': '@',
      'itemsPerPage': '@',
      'method': '@',
      'currentPage': '@'
    },
    link: function (scope, element, attrs) {
      attrs.$observe('itemCount', function() {
        updatePagination();
      });
      attrs.$observe('currentPage', function() {
        updatePagination();
      });

      function updatePagination() {
        var currentPage = parseInt(scope.currentPage);
        var itemsPerPage = parseInt(scope.itemsPerPage);
        var itemCount = parseInt(scope.itemCount);

        var startRange = currentPage * itemsPerPage - (itemsPerPage - 1);
        var endRange = Math.min(currentPage * itemsPerPage, itemCount);

        var retVal = '<nav class="pagination">' +
          '<a class="pagination-prev" ng-click="$parent.' + attrs.method + '(\'prev\')" href="#">Previous</a>'+
          '<a class="pagination-next" ng-click="$parent.' + attrs.method + '(\'next\')" href="#">Next</a>' +
          '<span class="showing-results">Showing results</span>' +
          '<span class="pagination-current-range"> ' + startRange + '-' + endRange + ' </span>' +
          '<span class="preposition">of</span>' +
          '<span class="pagination-total"> ' + itemCount + '</span>' +
        '</nav>';

        element.html(retVal);
        $compile(element.contents())(scope);
      }

      updatePagination();
    }
  };
}]);
