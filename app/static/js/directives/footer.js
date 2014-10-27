'use strict';

angular.module('sbirezApp').directive('footer', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'static/views/partials/footer.html',
    controller: [function () {

    }]
  };
});
