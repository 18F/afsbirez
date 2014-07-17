'use strict';

angular.module('sbirezApp')
  .controller('FormCtrl', function ($scope, $http) {
    $scope.formData = {}
    $scope.formId = {};
    $scope.formSchema = null;
    $scope.formFields = ["*", {"type":"submit", "title": "Submit"}];

    $http.get('/api/forms').success(function(list) {
      $scope.formList = list;
    });

    $scope.setForm = function(id) {
      $http.get('/api/forms/' + id).success(function(fields) {
        $scope.formSchema = fields;
        $scope.formId = id;
      });
    };

    $scope.formOptions = {
      uniqueFormId: 'myFormId',
      hideSubmit: false
    };

    $scope.onSubmit = function() {
      console.log('form submitted:', $scope.formData);
      $http.post('/api/forms/' + $scope.formId, $scope.formData).success(console.log('saved')); 
    };

  });
