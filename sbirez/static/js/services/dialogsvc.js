'use strict';

angular.module('sbirezApp').factory('DialogService', function(ngDialog) {
  return {
    openLogin : function(intention) {
      if (intention) {
        console.log(intention);
      }
      var dialog = ngDialog.open({
        'template':'static/views/partials/login.html',
        'className':'ngdialog-theme-login',
        'controller':'AdminUserCtrl',
        'data':JSON.stringify(intention)
      });
      return dialog.closePromise;
    },

    openLogout : function(intention) {
      var dialog = ngDialog.open({
        'template':'static/views/partials/logout.html',
        'className':'ngdialog-theme-logout',
        'controller':'AdminUserCtrl',
        'data':JSON.stringify(intention)
      });
      return dialog.closePromise;
    },

    openIntroMessage : function(intention) {
      var dialog = ngDialog.open({
        'template':'static/views/partials/introMessage.html',
        'className':'ngdialog-theme-intromessage',
        'controller':'AdminUserCtrl',
        'showClose':false,
        'closeByEscape':false,
        'closeByDocument':false,
        'data':JSON.stringify(intention)
      });
      return dialog.closePromise;
    }
  };
});
