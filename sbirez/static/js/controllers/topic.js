'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $rootScope, $http, $state, AuthenticationService, SavedOpportunityService, ProposalService) {
    $scope.topicId = $state.params.id;
    $rootScope.bodyClass = 'topic-show';
    $scope.data = {};

    $scope.saveOpportunity = function() {
      SavedOpportunityService.save($scope.topicId).then(function() {
        $scope.data.saved = true;
      }, function(error) {
        console.log(error);
      });
    };

    $scope.removeOpportunity = function() {
      SavedOpportunityService.remove($scope.topicId).then(function() {
        $scope.data.saved = false;
      });
    };

    $scope.createProposal = function() {
      var title = 'Proposal for ' + $scope.data.title;
      var workflow = $scope.data.solicitation.element;
      ProposalService.create($scope.data.id, title, workflow).then(function(data) {
        $scope.data.proposal = data.id;
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
    }).error(function(/*data, status, headers, config*/) {
      $scope.errorMsg = 'The topic you are looking for does not exist.';
    });
  });
