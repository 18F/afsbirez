'use strict';

angular.module('sbirezApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.formData = {}

    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $http.get('/api/form/register').success(function(register) {
      $scope.formFields = register;
    });

    $scope.formOptions = {
      uniqueFormId: 'myFormId',
      hideSubmit: false
    };

    $scope.onSubmit = function() {
      console.log('form submitted:', $scope.formData);
    };

  });
