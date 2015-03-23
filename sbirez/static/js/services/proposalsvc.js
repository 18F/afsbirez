'use strict';

angular.module('sbirezApp').factory('ProposalService', function($http, $window, $q, DialogService, AuthenticationService) {

  var PROPOSAL_URI = 'api/v1/proposals/';
  var results = {};

  var getProposals = function() {
    var deferred = $q.defer();
    $http.get(PROPOSAL_URI).success(function(data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  };

  var getProposal = function(proposalId) {
    var deferred = $q.defer();
    $http.get(PROPOSAL_URI + proposalId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var createProposal = function(opportunityId, opportunityTitle) {
    var deferred = $q.defer();
    var propData = {
      'owner': $window.sessionStorage.userid, 
      'firm': 1,//$window.sessionStorage.firmid, 
      'workflow': 6, // how can I look this up? 
      'topic': opportunityId,
      'title': opportunityTitle
    };
      
    $http.post(PROPOSAL_URI, propData).success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var removeProposal = function(proposalId) {
    var deferred = $q.defer();
    $http.delete(PROPOSAL_URI + proposalId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var saveProposalData = function(proposalId, proposalData) {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposalId + '/', proposalData).success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var saveProposalTitle = function(proposalId, proposalTitle) {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposalId + '/', {'title':proposalTitle}).success(function(data) {
      deferred.resolve(data);
    }).error(function(data, status) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  return {
    create: function(opportunityId, opportunityTitle) {
      if (!AuthenticationService.isAuthenticated) {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return createProposal(opportunityId, opportunityTitle);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      } else {
        return createProposal(opportunityId, opportunityTitle);
      }
    },
    remove: function(opportunityId) {
      // remove opportunity from saved opps
      if (AuthenticationService.isAuthenticated) {
        return removeProposal(opportunityId);
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Failed to authenticate'));
        return deferred.promise;
      }
    },
    list: function() {
      return getProposals();
    },
    get: function(proposalId) {
      return getProposal(proposalId);
    },
    saveData: function(proposalId, proposalData) {
      console.log('saveData', proposalId, proposalData);
      return saveProposalData(proposalId, {'data':proposalData});
    },
    saveTitle: function(proposalId, proposalTitle) {
      return saveProposalData(proposalId, proposalTitle);
    }
  };
});
