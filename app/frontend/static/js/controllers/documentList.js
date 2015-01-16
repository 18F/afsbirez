'use strict';

angular.module('sbirezApp')
  .controller('DocumentListCtrl', function ($scope, $rootScope, $http, $upload, $window) {
    $scope.jwt = $window.sessionStorage.token;
    $scope.docList = [];
    $http.get('api/documents').success(function(list) {
      console.log(list);
      $scope.docList = list.files;
    });
    $rootScope.$on('fileAdded', function() {
      $http.get('api/documents').success(function(list) {
        $scope.docList = list.files;
      });
    });
  });
