'use strict';
/**
 * Truncate Filter
 * @Param string
 * @Param int, default = 10
 * @Param string, default = "…"
 * @return string
 */
angular.module('sbirezApp')
  .filter('truncate', function () {
    return function (text, length, end) {
      if (isNaN(length)) {
        length = 10;
      }
 
      if (end === undefined) {
        end = '…';
      }

      if (text && (text.length <= length || text.length - end.length <= length)) {
        return text;
      }
      else if (text) {
        return String(text).substring(0, length-end.length) + end;
      }
    };
  });
 
 
/**
 * Example - see the jsfiddle: http://jsfiddle.net/tUyyx/
 *
 * var myText = "This is an example.";
 *
 * {{myText|truncate}}
 * {{myText|truncate:5}}
 * {{myText|truncate:25:" ->"}}
 * 
 * Output
 * "This is..."
 * "Th..."
 * "This is an e ->"
 *
 */
