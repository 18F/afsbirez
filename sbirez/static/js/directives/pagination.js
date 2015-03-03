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

      function buildLink(page, currentPage) {
        var linkTextActive = ' class="active" ';

        return '<li title="Page ' + page + '" ' + 
               (currentPage === page ? linkTextActive : '') +
               '><a ng-href="#" ng-click="$parent.' +
               attrs.method + '(' + page + ')">' +
               page +
               '</a></li>';
      }

      function updatePagination() {
        var page = 1;
        var retVal = '<ul class="pagination">';
        var currentItem = 0;
        var currentPage = parseInt(scope.currentPage);
        var itemsPerPage = parseInt(scope.itemsPerPage);
        var itemCount = parseInt(scope.itemCount);

        // add the left arrow, enabled if not at the first page
        if (page !== currentPage) {
          retVal += '<li><a href="#" ng-click="$parent.' + attrs.method + '(\'prev\')">Prev</a></li>';
        }
        else {
          retVal += '<li class="disabled"><a href="#">Prev</a></li>';
        }

        // add the individual page callouts
        for (currentItem; currentItem < itemCount; currentItem += itemsPerPage) {
          retVal += buildLink(page, currentPage);
          page++;
        }

        // add the right arrow, enabled if not at the last page
        if (page - 1 !== currentPage) {
          retVal += '<li><a href="#" ng-click="$parent.' + attrs.method + '(\'next\')">Next</a></li>';
        }
        else {
          retVal += '<li class="disabled"><a href="#">Next</a></li>';
        }

        retVal += '</ul>';
        element.html(retVal);
        $compile(element.contents())(scope);
      }

      updatePagination();
    }
  };
}]);
