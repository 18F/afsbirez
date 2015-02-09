'use strict';

angular.module('sbirezApp').directive('backButton', function(){
    return {
      restrict: 'A',

      link: function(scope, element) {
        function goBack() {
          history.back();
          scope.$apply();
        }

        element.bind('click', goBack);
      }
    };
});
