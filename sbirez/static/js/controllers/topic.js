'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $http, $window, $state, AuthenticationService) {
    $scope.topicId = $state.params.id;
    $scope.data = {};

    $http.get('api/v1/topics/' + $scope.topicId + '/').success(function(data) {
      $scope.data = data;
      $scope.data.pre_release_date = new Date(data.pre_release_date);
      $scope.data.proposals_begin_date = new Date(data.proposals_begin_date);
      $scope.data.proposals_end_date = new Date(data.proposals_end_date);
    }).error(function(/*data, status, headers, config*/) {
      $scope.errorMsg = 'The topic you are looking for does not exist.';
    });
  });
