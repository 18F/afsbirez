'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $rootScope, $http, $state, $window, AuthenticationService, SavedOpportunityService, ProposalService) {
    $scope.topicId = $state.params.id;
    $rootScope.bodyClass = 'topic-show';
    $scope.data = {};

    $scope.createProposal = function() {
      var title = 'Proposal for ' + $scope.data.title;
      var workflow = $scope.data.solicitation.element;
      SavedOpportunityService.save($scope.topicId).then(function() {
        $scope.data.saved = true;
        ProposalService.create($scope.data.id, title, workflow).then(function(data) {
          $scope.data.proposal = data.id;
          $state.go('app.proposals.report', {id: $scope.data.proposal});
        });
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

    $scope.back = function() {
      $window.history.back();
    };

    $http.get('api/v1/topics/' + $scope.topicId + '/').success(function(data) {
      $scope.data = data;
    }).error(function(/*data, status, headers, config*/) {
      $scope.errorMsg = 'The topic you are looking for does not exist.';
    });
  });
