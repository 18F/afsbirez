'use strict';

angular.module('sbirezApp').directive('jargon', function(){
    return {
      restrict: 'AE',
      scope: {
        jargon: '='
      },
      link: function (scope, element, attrs) {

        function spliceSlice(str, index, count, add) {
          return str.slice(0, index) + (add || '') + str.slice(index + count);
        }

        function set(val) {
          var found = false;
          var startIndex, endIndex;
          startIndex = val.indexOf('<jargon');
          while (startIndex !== -1) {
            endIndex = val.indexOf('>',startIndex);
            var id = val.substr(startIndex + 8, endIndex - startIndex - 8);
            for (var i = 0; i < scope.jargon.jargons.length; i++) {
              if (scope.jargon.jargons[i].name === id) {
                found = true;
                val = spliceSlice(val, startIndex, endIndex - startIndex + 1, 
                  '<a id="fn-' + i + '-a" href="#fn-' + i + '" class="footnote-button" rel="footnote">' + i + '</a>' + 
                  '<section class="footnotes"><ol><li class="footnote" id="fn-' + i + '">' + 
                  scope.jargon.jargons[i].html + 
                  '<a href="#fn-' + i + '-a" class="reversefootnote">R</a></li></ol></section>');
                break;
              }
            }
            if (!found) {
              console.log('ERROR: jargon not found', id);
              val = spliceSlice(val, startIndex, endIndex - startIndex + 1, '');
            } else {
              found = false;
            }
            startIndex = val.indexOf('<jargon');
          }
          element.html(val);
        }

        set(scope.jargon.human || element.text() || '');
      }
    };
});
