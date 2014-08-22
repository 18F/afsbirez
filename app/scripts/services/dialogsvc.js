'use strict';

angular.module('sbirezApp').factory('DialogService', function(ngDialog) {
  var observerCallbacks = [];
  return {
    openLogin : function(intention) {
      if (intention) {
        console.log(intention);
      }
      ngDialog.open({
        'template':'partials/login.html', 
        'className':'ngdialog-theme-login', 
        'controller':'AdminUserCtrl', 
        'data':JSON.stringify(intention)
      });
    },

    openLogout : function(intention) {
      ngDialog.open({
        'template':'partials/logout.html', 
        'className':'ngdialog-theme-logout', 
        'controller':'AdminUserCtrl', 
        'data':JSON.stringify(intention)
      });
    },
  };
});
