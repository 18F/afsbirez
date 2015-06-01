'use strict';

angular.module('sbirezApp').factory('ProposalService', function($http, $window, $q, DialogService, AuthenticationService, ValidationService) {

  var proposal = {};
  var proposalData = {};
  var validationData = {};
  var overview = [];
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
  var loadingPromise = null;
  var topic = {};

  var PROPOSAL_URI = 'api/v1/proposals/';
  var TOPIC_URI = 'api/v1/topics/';

  var getTopic = function(topicId) {
    var deferred = $q.defer();
    if (topic.id === topicId) {
      deferred.resolve(topic);
    } else {
      $http.get(TOPIC_URI + topicId + '/').success(function(data) {
        topic = data;
        deferred.resolve(data);
      }).error(function(data) {
        deferred.reject(new Error(data));
      });
    }
    return deferred.promise;
  };

  var getProposals = function() {
    var deferred = $q.defer();
    $http.get(PROPOSAL_URI).success(function(data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  };

  var getProposal = function(proposalId) {
    var deferred = $q.defer();
    if (proposal.id === proposalId) {
      deferred.resolve(proposal);
    }
    else {
      $http.get(PROPOSAL_URI + proposalId + '/').success(function(data) {
        proposal = data;
        deferred.resolve(data);
      }).error(function(data) {
        deferred.reject(new Error(data));
      });
    }
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

  var saveCompleteData = function() {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposal.id + '/', {'data':JSON.stringify(proposalData)}).success(function(data) {
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

  var buildMultiplicities = function() {
    var count;
    var iter;
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].element_type === 'line_item') {
        if (workflows[i].multiplicity === null) {
          workflows[i].multiplicity = [];
          workflows[i].multiplicity[0] = {};
          workflows[i].multiplicity[0].token = 0;
          workflows[i].multiplicity[0].value = 0;
        }
        else if (isFinite(workflows[i].multiplicity)) {
          count = parseInt(workflows[i].multiplicity);
          workflows[i].multiplicity = [];
          for (iter = 0; iter < count; iter++) {
            workflows[i].multiplicity[iter] = {'token': iter, 'value': iter};
          }
        }
        else if (typeof workflows[i].multiplicity === 'string') {
          workflows[i].multiplicity = workflows[i].multiplicity.split(', ');
          count = workflows[i].multiplicity.length;
          for (iter = 0; iter < count; iter++) {
            var value = workflows[i].multiplicity[iter];
            var token = workflows[i].multiplicity[iter].replace(/[^\w]|_/g, '_');
            workflows[i].multiplicity[iter] = {'token': token, 'value': value};
          }
        }
        //console.log('mult', workflows[i].multiplicity);
      }
    }
  };

  var loadProposal = function(proposalId) {
    // retrieves workflow and data
    //var deferred = $q.defer();
    if (proposal.id !== proposalId) {
      loadingPromise = $q.defer();
      $http.get(PROPOSAL_URI + proposalId + '/').success(function(data) {
        proposal = data;
        $http.get('api/v1/elements/' + proposal.workflow + '/').success(function(data) {
          workflow = data;
          buildIndex(workflow, null);
          workflowLength = workflows.length;
          buildMultiplicities();
          if (typeof proposal.topic !== 'object' && proposal.topic.id === undefined) {
            if (topic.id === proposal.topic) {
              proposal.topic = topic;
              loadingPromise.resolve(proposal);
              console.log('already loaded topic', topic);
            } else {
              $http.get(TOPIC_URI + proposal.topic + '/').success(function(data) {
                proposal.topic = data;
                topic = data;
                loadingPromise.resolve(proposal);
              });
            }
          }
          else {
            loadingPromise.resolve(proposal);
          }
        });
        proposalData = proposal.data;
      });
    } else {
      console.log('already loaded proposal');
      loadingPromise.resolve(proposal);
    }
    return loadingPromise.promise;
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
      var innerIndex;
      var found = false;
      if (currentWorkflowIndex >= 0) {
        previousWorkflow = null;
        for (index = currentWorkflowIndex - 1; index >= 0; --index) {
          if ((workflows[index].element_type === 'group' || workflows[index].element_type === 'workflow') && workflows[index].children && workflows[index].children[0] && workflows[index].children[0].element_type !== 'group' && workflows[index].children[0].element_type !== 'workflow') {
            previousWorkflow = workflows[index].id;
            break;
          }
        }
      }
      if (currentWorkflowIndex < workflowLength) {
        nextWorkflow = null;
        for (index = currentWorkflowIndex + 1; index < workflowLength; ++index) {
          if ((workflows[index].element_type === 'group' || workflows[index].element_type === 'workflow') && workflows[index].children && workflows[index].children[0] && workflows[index].children[0].element_type !== 'group' && workflows[index].children[0].element_type !== 'workflow') {
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

  var ObjectLengthCount = function(object) {
    var length = 0;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'object') {
          length += ObjectLengthCount(object[key]);
        } else {
          ++length;
        }
      }
    }
    return length;
  };
    
  var isSet = function(data, elementName) {
    return !(data === undefined ||
             data[elementName] === null ||
             data[elementName] === undefined ||
             data[elementName] === '' ||
             (typeof data[elementName] === 'object' && data[elementName].length === undefined));
  };

  var checkCompleteness = function(element, data) {
    var length = element.children.length;
    var index = 0;
    var complete = true;
    for (index; index < length && complete; index++) {
      if (element.children[index].required && element.children[index].ask_if) {
        if (data[element.children[index].ask_if] === true) {
          complete = isSet(data, element.children[index].name);
        }
      } else if (element.children[index].required) {
        complete = isSet(data, element.children[index].name);
      }
    }
    return complete;
  };

  var getProposalOverview = function(validate) {
    var element, child;
    if (overview.length === 0 || validate) {
      overview = [];
      if (validate) {
        validateWorkflow();
      }
      for (var index = 0; index < workflow.children.length; index++) {
        element = {
                    'name':workflow.children[index].human,
                    'id':workflow.children[index].id
                  };
        if (workflow.children[index].children && workflow.children[index].children[0] && workflow.children[index].children[0].element_type === 'group') {
          element.children = [];
          for (var subindex = 0; subindex < workflow.children[index].children.length; subindex++) {
            child = {
                      'name': workflow.children[index].children[subindex].human,
                      'id':workflow.children[index].children[subindex].id
                    };
            if (validate) {
              child.errors = ObjectLengthCount(validationData[workflow.name][workflow.children[index].name][workflow.children[index].children[subindex].name])
            }
            if (proposalData && proposalData[workflow.name] && proposalData[workflow.name][workflow.children[index].name]) {
              child.complete = checkCompleteness(workflow.children[index].children[subindex], proposalData[workflow.name][workflow.children[index].name][workflow.children[index].children[subindex].name]);
            }
            else {
              child.complete = false;
            }
            element.children.push(child);
          }
        }
        else {
          if (validate) {
            element.errors = ObjectLengthCount(validationData[workflow.name][workflow.children[index].name]);
          }
          if (proposalData && proposalData[workflow.name]) {
            element.complete = checkCompleteness(workflow.children[index], proposalData[workflow.name][workflow.children[index].name]);
          }
          else {
            element.complete = false;
          }
        }
        overview.push(element);
      }
    }
    return overview;
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
  };

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
    }
    return data;
  };

  var registerElement = function(element, validationCallback, askIfCallback, multipleToken) {
    // return data, and set validation & ask_if callbacks
    // find or create the proposal data in the correct spot, taking into account the multipleToken, if present.
    var order = getOrder(element, multipleToken);
    var data = getDataIndex(order, false, proposalData);
    var fieldName;
    // if there is a validation callback, add it to the validation structure
    if (validationCallback !== null && validationCallback !== undefined) {
      fieldName = element.name;
      if (multipleToken !== null && multipleToken !== undefined) {
        fieldName += '_' + multipleToken;
      }

      validationCallbacks.push({
        'order': order,
        'cb': validationCallback
      });

      // check to see if the state was already set
      var message = getDataIndex(order, false, validationData);
      if (message === null || (typeof message === 'object' && message.length === undefined)) {
        message = '';
      }
      validationCallback(message);
    }
    
    // if there is an ask if callback, add it to the askif structure
    if (askIfCallback !== null && askIfCallback !== undefined && element.ask_if !== null && element.ask_if !== undefined) {
      var askIfSplit = element.ask_if.split(' ');
      fieldName = askIfSplit[askIfSplit.length - 1];
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
    ValidationService.validate(workflow, proposalData[workflow.name], validationData[workflow.name], true);
    for (var index = 0; index < validationCallbacks.length; index++) {
      // check to see if the state was already set
      var message = getDataIndex(validationCallbacks[index].order, false, validationData);
      if (typeof message === 'object' && message !== null && message.length === undefined) {
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
    remove: function(proposalId) {
      // remove proposal from saved opps
      if (typeof proposalId === 'number') {
        if (AuthenticationService.isAuthenticated) {
          return removeProposal(proposalId);
        } else {
          return DialogService.openLogin().then(function(data) {
            if (data.value) {
              return removeProposal(proposalId);
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
    complete: function() {
      if (AuthenticationService.isAuthenticated) {
        return saveCompleteData();
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return saveCompleteData();
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
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
    getOverview: function(validate) {
      if (AuthenticationService.isAuthenticated) {
        return getProposalOverview(validate);
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return getProposalOverview(validate);
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
