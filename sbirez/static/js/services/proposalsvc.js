'use strict';

angular.module('sbirezApp').factory('ProposalService', function($http, $window, $q, DialogService, AuthenticationService, ValidationService) {

  var proposal = {};
  var proposalData = {};
  var validationData = {};
  var validationCallbacks = []; 
  var askIfCallbacks = {};
  // workflow as a tree
  var workflow = {};
  // workflows as an array (for quicker search)
  var workflows = [];
  var currentWorkflowIndex = null;
  var workflowLength = 0;
  var previousWorkflow = null;
  var nextWorkflow = null;

  var PROPOSAL_URI = 'api/v1/proposals/';

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
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var createProposal = function(opportunityId, opportunityTitle, workflowId) {
    var deferred = $q.defer();
    var propData = {
      'owner': $window.sessionStorage.userid, 
      'firm': parseInt($window.sessionStorage.firmid), 
      'workflow': workflowId, 
      'topic': opportunityId,
      'title': opportunityTitle,
      'data': '{}' 
    };
      
    $http.post(PROPOSAL_URI + 'partial/', propData).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var removeProposal = function(proposalId) {
    var deferred = $q.defer();
    $http.delete(PROPOSAL_URI + proposalId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var saveProposalData = function() {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposal.id + '/partial/', {'data':JSON.stringify(proposalData)}).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var saveProposalTitle = function(proposalId, proposalTitle) {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposalId + '/partial/', {'title':proposalTitle}).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  var buildIndex = function(workflow, parent) {
    workflow.parentId = parent;
    workflows.push(workflow);
    if (workflow.children !== undefined) {
      for (var i = 0; i < workflow.children.length; i++) {
        buildIndex(workflow.children[i], workflow.id);
      }
    }
  };

  var loadProposal = function(proposalId) {
    // retrieves workflow and data
    var deferred = $q.defer();
    //console.log('loadProposal', proposalId);
    $http.get(PROPOSAL_URI + proposalId + '/').success(function(data) {
      proposal = data;
      $http.get('api/v1/elements/' + proposal.workflow + '/').success(function(data) {
        workflow = data;
        buildIndex(workflow, null);
        workflowLength = workflows.length;
        deferred.resolve(data);
      });
      proposalData = proposal.data;
    });
    return deferred.promise;
  };

  var unloadProposal = function() {
    // clears workflow & data
    proposal = {};
    proposalData = {};
    validationCallbacks = [];
    askIfCallbacks = {};
  };

  var getWorkflowElement = function(elementId) {
    elementId = parseInt(elementId);
    if (elementId === undefined || elementId === null || isNaN(elementId)) {
      elementId = workflow.id;
    }

    var changed = false;
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].id === elementId && i !== currentWorkflowIndex) {
        changed = true;
        currentWorkflowIndex = i;
        break;
      }
      else if (workflows[i].id === elementId) {
        break;
      }
    }
    if (changed) {
      // clears callback objects
      validationCallbacks = []; 
      askIfCallbacks = {};
      var index;
      if (currentWorkflowIndex >= 0) {
        previousWorkflow = null;
        for (index = currentWorkflowIndex - 1; index >= 0; --index) {
          if (workflows[index].element_type === 'group' || workflows[index].element_type === 'workflow') {
            previousWorkflow = workflows[index].id;
            break;
          }
        }
      }
      if (currentWorkflowIndex < workflowLength) {
        nextWorkflow = null;
        for (index = currentWorkflowIndex + 1; index < workflowLength; ++index) {
          if (workflows[index].element_type === 'group' || workflows[index].element_type === 'workflow') {
            nextWorkflow = workflows[index].id;
            break;
          }
        }
      }
    }
    //console.log('workflows', workflows, currentWorkflowIndex);
    // returns the current workflow + prev & next
    return {
      'current': workflows[currentWorkflowIndex],
      'previous': previousWorkflow,
      'next': nextWorkflow 
    };
  };

  var getOrder = function(element, multipleToken, altName) {
    var order = [];
    order.push(altName !== undefined ? altName : element.name);
    if (multipleToken !== null && multipleToken !== undefined) {
      order.push(multipleToken);
    }
    var index = -1;
    var nextElementId = element.parentId;
    for (index = workflowLength - 1; index >= 0; --index) {
      if (workflows[index].id === nextElementId) {
        if (workflows[index].id !== element.Id) {
          order.push(workflows[index].name);
        }
        nextElementId = workflows[index].parentId;
      }
    }
    return order;
  }

  var getDataIndex = function(order, leaveOne, source) {
    var data = source;
    var floor = 0;
    if (leaveOne) {
      floor = 1;
    }
    for (var index = order.length - 1; index >=floor; --index) {
      if (data[order[index]] === undefined) {
        data[order[index]] = {};
      }
      data = data[order[index]];
      //console.log('data', data);
    }
    return data;
  }

  var registerElement = function(element, validationCallback, askIfCallback, multipleToken) {
    // return data, and set validation & ask_if callbacks
    // find or create the proposal data in the correct spot, taking into account the multipleToken, if present.
    var order = getOrder(element, multipleToken);
    var data = getDataIndex(order, false, proposalData);

    //console.log('order', order, data, element.name, multipleToken);    
    // if there is a validation callback, add it to the validation structure
    if (validationCallback !== null && validationCallback !== undefined) {
      var fieldName = element.name;
      if (multipleToken !== null && multipleToken !== undefined) {
        fieldName += '_' + multipleToken;
      }

      validationCallbacks.push({
        'order': order,
        'cb': validationCallback
      });

      // check to see if the state was already set
      var message = getDataIndex(order, false, validationData);
      //console.log('message', message, message.length);
      if (typeof message === 'object' && message.length === undefined) {
        message = '';
      }
      validationCallback(message);
    }
    
    // if there is an ask if callback, add it to the askif structure
    if (askIfCallback !== null && askIfCallback !== undefined && element.ask_if !== null && element.ask_if !== undefined) {
      var askIfSplit = element.ask_if.split(' ');
      var fieldName = askIfSplit[askIfSplit.length - 1];
      if (multipleToken !== null && multipleToken !== undefined) {
        fieldName += '_' + multipleToken;
      }

      //console.log('ask if', element.ask_if, fieldName)
      if (askIfCallbacks[fieldName] === undefined) {
        askIfCallbacks[fieldName] = [];
      }
      askIfCallbacks[fieldName].push(askIfCallback);

      // check to see if the state was already set
      order = getOrder(element, multipleToken, askIfSplit[askIfSplit.length - 1]);
      var askIfData = getDataIndex(order, true, proposalData);
      askIfCallback(askIfData[order[0]]);
    }
    // return the data
    return data;
  };

  var applyElementValue = function(element, value, multipleToken) {
    // apply the value to the proposal data structure
    var order = getOrder(element, multipleToken); 
    var data = getDataIndex(order, true, proposalData);
    data[order[0]] = value;
    //console.log('applyElementValue', order, element, value, proposalData, data);

    if (element.element_type === 'bool' || element.element_type === 'checkbox') {
      // walk the askIf tree to see if any callbacks need to be called.
      var fieldName = element.name;
      if (multipleToken !== null && multipleToken !== undefined) {
        fieldName += '_' + multipleToken;
      }

      if (askIfCallbacks[fieldName] !== undefined) {
        for (var index = 0; index < askIfCallbacks[fieldName].length; index++) {
          //console.log('callback', value, askIfCallbacks);
          askIfCallbacks[fieldName][index](value);
        }
      }
    }
  };

  var validateWorkflow = function() {
    validationData = {};
    validationData[workflow.name] = {};
    if (proposalData[workflow.name] === undefined) {
      proposalData[workflow.name] = {};
    }
    ValidationService.validate(workflow, proposalData[workflow.name], validationData, true);
    for (var index = 0; index < validationCallbacks.length; index++) {
      // check to see if the state was already set
      var message = getDataIndex(validationCallbacks[index].order, false, validationData);
      if (typeof message === 'object' && message.length === undefined) {
        message = '';
      }
      validationCallbacks[index].cb(message);
    }
    //console.log('DONE VALIDATING', validationData);
  };

  return {
    create: function(opportunityId, opportunityTitle, workflowId) {
      if (typeof opportunityId === 'number') {
        if (!AuthenticationService.isAuthenticated) {
          return DialogService.openLogin().then(function(data) {
            if (data.value) {
              return createProposal(opportunityId, opportunityTitle, workflowId);
            } else {
              var deferred = $q.defer();
              deferred.reject(new Error('Failed to authenticate'));
              return deferred.promise;
            }
          });
        } else {
          return createProposal(opportunityId, opportunityTitle, workflowId);
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    remove: function(opportunityId) {
      // remove opportunity from saved opps
      if (typeof opportunityId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return removeProposal(opportunityId);
        } else {
          return DialogService.openLogin().then(function(data) {
            if (data.value) {
              return removeProposal(opportunityId);
            } else {
              var deferred = $q.defer();
              deferred.reject(new Error('Failed to authenticate'));
              return deferred.promise;
            }
          });
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    list: function() {
      if (AuthenticationService.isAuthenticated) {
        return getProposals();
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return getProposals();
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    get: function(proposalId) {
      if (typeof proposalId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return getProposal(proposalId);
        } else {
          return DialogService.openLogin().then(function(data) {
            if (data.value) {
              return getProposal(proposalId);
            } else {
              var deferred = $q.defer();
              deferred.reject(new Error('Failed to authenticate'));
              return deferred.promise;
            }
          });
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    saveData: function() {
      if (AuthenticationService.isAuthenticated) {
        return saveProposalData();
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return saveProposalData();
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    saveTitle: function(proposalId, proposalTitle) {
      if (typeof proposalId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return saveProposalTitle(proposalId, proposalTitle);
        } else {
          return DialogService.openLogin().then(function(data) {
            if (data.value) {
              return saveProposalTitle(proposalId, proposalTitle);
            } else {
              var deferred = $q.defer();
              deferred.reject(new Error('Failed to authenticate'));
              return deferred.promise;
            }
          });
        }
      } else {
        var deferred = $q.defer();
        deferred.reject(new Error('Invalid parameter'));
        return deferred.promise;
      }
    },
    load: function(proposalId) {
      if (AuthenticationService.isAuthenticated) {
        return loadProposal(proposalId);
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return loadProposal(proposalId);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    unload: function() {
      if (AuthenticationService.isAuthenticated) {
        return unloadProposal();
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return unloadProposal();
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    getWorkflow: function(elementId) {
      //console.log('getWorkflow', elementId);
      if (AuthenticationService.isAuthenticated) {
        return getWorkflowElement(elementId);
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return getWorkflowElement(elementId);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    register: function(element, validationCallback, askIfCallback, multipleToken) {
      //console.log('register', element, validationCallback, askIfCallback, multipleToken);
      if (AuthenticationService.isAuthenticated) {
        return registerElement(element, validationCallback, askIfCallback, multipleToken);
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return registerElement(element, validationCallback, askIfCallback, multipleToken);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    apply: function(element, value, multipleToken) {
      //console.log('apply', element, value, multipleToken);
      if (AuthenticationService.isAuthenticated) {
        return applyElementValue(element, value, multipleToken);
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return applyElementValue(element, value, multipleToken);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    validate: function() {
      //console.log('validate');
      if (AuthenticationService.isAuthenticated) {
        return validateWorkflow();
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return validateWorkflow();
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    }
  };
});
