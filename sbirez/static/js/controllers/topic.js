'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $http, $window, $state, AuthenticationService, SavedOpportunityService) {
    $scope.topicId = $state.params.id;
    $scope.data = {};

    $scope.saveOpportunity = function() {
      SavedOpportunityService.save($scope.topicId).then(function(data) {
        $scope.data.saved = true;
      }, function(error) {
        console.log(error);
      });
    };

    $scope.getKeywordList = function() {
      var keywords = '';
      if ($scope.data.keywords && $scope.data.keywords[0]) {
        keywords = $scope.data.keywords[0].keyword;
        var length = $scope.data.keywords.length;
        for (var i = 1; i < length; i++) {
          keywords += ', ' + $scope.data.keywords[i].keyword;
        }
      }
      return keywords;
    };

    $http.get('api/v1/topics/' + $scope.topicId + '/').success(function(data) {
      $scope.data = data;
      $scope.data.pre_release_date = new Date(data.pre_release_date);
      $scope.data.proposals_begin_date = new Date(data.proposals_begin_date);
      $scope.data.proposals_end_date = new Date(data.proposals_end_date);
    }).error(function(/*data, status, headers, config*/) {
      $scope.errorMsg = 'The topic you are looking for does not exist.';
    });
  });
