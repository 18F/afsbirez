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
        var page = 1;
        var linkTextStart = '<li';
        var linkTextStart2 = '><a ng-href="#" ng-click="$parent.' + attrs.method + '(';
        var linkTextMiddle = ')">';
        var linkTextActive = ' class="active" ';
        var linkTextEnd = '</a></li>';
        var retVal = '<ul class="pagination">';
        var currentItem = 0;
        var currentPage = parseInt(scope.currentPage);
        var itemsPerPage = parseInt(scope.itemsPerPage);
        var itemCount = parseInt(scope.itemCount);

        // add the left arrow, enabled if not at the first page
        if (page !== currentPage) {
          retVal += '<li><a href="#" ng-click="$parent.' + attrs.method + '(\'prev\')">&laquo;</a></li>';
        }
        else {
          retVal += '<li class="disabled"><a href="#">&laquo;</a></li>';
        }

        // add the individual page callouts
        for (currentItem; currentItem < itemCount; currentItem += itemsPerPage) {
          retVal += linkTextStart + (currentPage === page ? linkTextActive : '') + linkTextStart2 + page + linkTextMiddle + page + linkTextEnd;
          page++;
        }

        // add the right arrow, enabled if not at the last page
        if (page - 1 !== currentPage) {
          retVal += '<li><a href="#" ng-click="$parent.' + attrs.method + '(\'next\')">&raquo;</a></li>';
        }
        else {
          retVal += '<li class="disabled"><a href="#">&raquo;</a></li>';
        }

        retVal += '</ul>';
        element.html(retVal);
        $compile(element.contents())(scope);
      }

      updatePagination();
    }
  };
}]);
