'use strict';

angular.module('sbirezApp')
  .controller('DocumentListCtrl', function ($scope, $rootScope, $http, $upload, $window, DocumentService) {
    $scope.docList = [];

    $scope.sortType = 'name';
    $scope.sortReverse = false;

    DocumentService.list().then(function(data) {
      $scope.docList = data.results;
    });
    $rootScope.$on('fileAdded', function() {
      DocumentService.list().then(function(data) {
        $scope.docList = data.results;
      });
    });
  });
