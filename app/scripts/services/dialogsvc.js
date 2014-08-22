'use strict';

angular.module('sbirezApp').factory('DialogService', function(ngDialog) {
  var observerCallbacks = [];
  return {
    openLogin : function() {
      ngDialog.open({'template':'partials/login.html', 'className':'ngdialog-theme-login', 'controller':'AdminUserCtrl'});
    },

    openLogout : function() {
      ngDialog.open({'template':'partials/logout.html', 'className':'ngdialog-theme-logout', 'controller':'AdminUserCtrl'});
    },
  };
});
