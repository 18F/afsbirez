'use strict';

angular.module('sbirezApp').factory('DialogService', function(ngDialog) {
  return {
    openLogin : function(intention) {
      if (intention) {
        console.log(intention);
      }
      ngDialog.open({
        'template':'static/views/partials/login.html',
        'className':'ngdialog-theme-login',
        'controller':'AdminUserCtrl',
        'data':JSON.stringify(intention)
      });
    },

    openLogout : function(intention) {
      ngDialog.open({
        'template':'static/views/partials/logout.html',
        'className':'ngdialog-theme-logout',
        'controller':'AdminUserCtrl',
        'data':JSON.stringify(intention)
      });
    },
  };
});
