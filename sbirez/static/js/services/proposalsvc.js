'use strict';

angular.module('sbirezApp').factory('ProposalService', function($http, $window, $q, DialogService, AuthenticationService, ValidationService) {

  var proposal = {};
  var proposalData = {};
  var validationData = {};
  var overview = [];
  var validationCallbacks = []; 
  var askIfCallbacks = {};
  var calculatedCallbacks = {};
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
  var validationMode = false;

  var PROPOSAL_URI = 'api/v1/proposals/';
  var TOPIC_URI = 'api/v1/topics/';

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
    } else {
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

  var saveProposalData = function(validate) {
    var deferred = $q.defer();
    var url = PROPOSAL_URI + proposal.id + (validate ? '/' : '/partial/');
    var method = validate ? 'PATCH' : 'PUT';
    $http({
      'url': url,
      'method': method,
      'data': {
        'owner': proposal.owner, 
        'firm': proposal.firm, 
        'workflow': proposal.workflow, 
        'topic': proposal.topic.id,
        'title': proposal.title,
        'data':JSON.stringify(proposalData)}}).success(function(data) {
          console.log('saved', data);
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

  var submitProposal = function() {
    var deferred = $q.defer();
    $http.post(PROPOSAL_URI + proposal.id + '/submit/').success(function(data) {
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
          workflows[i].multiplicity[0] = {'token':0, 'value':0};
        } else if (isFinite(workflows[i].multiplicity)) {
          count = parseInt(workflows[i].multiplicity);
          var dataCount = Math.max(1, getDynamicDataCount(workflows[i]));
          workflows[i].multiplicity = [];
          workflows[i].multiplicityCount = count;
          for (iter = 0; iter < dataCount; iter++) {
            workflows[i].multiplicity[iter] = {'token': iter, 'value': iter};
          }
        } else if (typeof workflows[i].multiplicity === 'string') {
          workflows[i].multiplicity = workflows[i].multiplicity.split(', ');
          count = workflows[i].multiplicity.length;
          for (iter = 0; iter < count; iter++) {
            var value = workflows[i].multiplicity[iter];
            var token = workflows[i].multiplicity[iter].replace(/[^\w]|_/g, '_');
            workflows[i].multiplicity[iter] = {'token': token, 'value': value};
          }
        }
      }
    }
  };

  var addDynamicDataItem = function(element) {
    var data = getDataIndex(getOrder(element), true, proposalData);
    var length = objectLengthCount(data[element.name], false);
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].id === element.id) {
        workflows[i].multiplicity[length] = {'token': length, 'value': length};
        break;
      }
    }
  };

  var removeDynamicDataItem = function(element, multipleToken) {
    var data = getDataIndex(getOrder(element), true, proposalData);
    var length = objectLengthCount(data[element.name], false);
    var index;
    var workingElement;
    if (multipleToken < length-1) {
      for (index = multipleToken; index + 1 < length; index++) {
        data[element.name][index] = data[element.name][index + 1];
      }
    }
    delete data[element.name][length - 1];
    for (index = 0; index < workflowLength; index++) {
      if (workflows[index].id === element.id) {
        workingElement = workflows[index];
        break;
      }
    }
    workingElement.multiplicity.splice(multipleToken, 1);
    for (index = 0; index < workingElement.multiplicity.length; index++) {
      workingElement.multiplicity[index] = {'token': index, 'value': index};
    }
    var fieldName = getFieldName(workingElement.name, multipleToken);
    for (var i = 0; i < workingElement.children.length; i++) {
      var varName = getFieldName(workingElement.children[i].name, multipleToken);
      delete calculatedCallbacks[varName];
      if (calculatedCallbacks[workingElement.children[i].name]) {
        applyCalculatedCallback(varName, undefined, workingElement.children[i].name, multipleToken);
      }
    }
    delete calculatedCallbacks[fieldName];
  };

  var getDynamicDataCount = function(element) {
    var data = getDataIndex(getOrder(element), true, proposalData);
    return objectLengthCount(data[element.name], false);
  };

  var loadProposal = function(proposalId) {
    // retrieves workflow and data
    if (proposal.id !== proposalId) {
      overview = [];
      loadingPromise = $q.defer();
      $http.get(PROPOSAL_URI + proposalId + '/').success(function(propData) {
        proposal = propData;
        proposalData = propData.data;
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
              }).error(function() {
                loadingPromise.reject(new Error('Invalid topic id.'));
              });
            }
          } else {
            loadingPromise.resolve(proposal);
          }
        }).error(function() {
          loadingPromise.reject(new Error('Invalid workflow id.'));
        });
      }).error(function() {
        loadingPromise.reject(new Error('Invalid proposal id.'));
      });
    } else {
      console.log('already loaded proposal');
      loadingPromise.resolve(proposal);
    }
    return loadingPromise.promise;
  };

  var unloadProposal = function() {
    // clears workflow & data
    var deferred = $q.defer();
    deferred.resolve(true);
    proposal = {};
    proposalData = {};
    validationCallbacks = [];
    askIfCallbacks = {};
    calculatedCallbacks = {};
    topic = {};
    return deferred.promise;
  };

  var getWorkflowElement = function(elementId) {
    var deferred = $q.defer();
    elementId = parseInt(elementId);
    if (elementId === undefined || elementId === null || isNaN(elementId)) {
      elementId = workflow.id;
    }

    var changed = false;
    var found = false;
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].id === elementId && i !== currentWorkflowIndex) {
        changed = true;
        found = true;
        currentWorkflowIndex = i;
        break;
      } else if (workflows[i].id === elementId) {
        found = true;
        break;
      }
    }
    if (!found) {
      deferred.reject(new Error('Invalid element.'));
      return deferred.promise;
    }

    if (changed) {
      // clears callback objects
      validationCallbacks = []; 
      askIfCallbacks = {};
      calculatedCallbacks = {};
      var index;
      if (currentWorkflowIndex >= 0) {
        previousWorkflow = null;
        for (index = currentWorkflowIndex - 1; index >= 0; --index) {
          if (workflows[index].element_type === 'workflow' && workflows[index].children && workflows[index].children[0] && workflows[index].children[0].element_type !== 'workflow') {
            previousWorkflow = workflows[index].id;
            break;
          }
        }
      }
      if (currentWorkflowIndex < workflowLength) {
        nextWorkflow = null;
        for (index = currentWorkflowIndex + 1; index < workflowLength; ++index) {
          if (workflows[index].element_type === 'workflow' && workflows[index].children && workflows[index].children[0] && workflows[index].children[0].element_type !== 'workflow') {
            nextWorkflow = workflows[index].id;
            break;
          }
        }
      }
    }
    // returns the current workflow + prev & next
    deferred.resolve({
      'current': workflows[currentWorkflowIndex],
      'previous': previousWorkflow,
      'next': nextWorkflow
    });
    return deferred.promise;
  };

  var objectLengthCount = function(object, recurse) {
    recurse = typeof recurse !== 'undefined' ? recurse : true;
    var length = 0;
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'object' && recurse) {
          length += objectLengthCount(object[key]);
        } else if (object[key] !== undefined && object[key] !== null) {
          ++length;
        }
      }
    }
    return length;
  };
    
  var isEmpty = function(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };

  var isSet = function(data, elementName) {
    return !(data === undefined || data[elementName] === null ||
             data[elementName] === undefined || data[elementName] === '' ||
             (typeof data[elementName] === 'object' && data[elementName].length === undefined));
  };

  var stringToBoolean = function(data){
    switch(data.toLowerCase()){
      case "true": case "yes": case "1": return true;
      case "false": case "no": case "0": case null: return false;
      default: return Boolean(data);
    }
  };

  var checkCompleteness = function(element, data) {
    var length = element.children.length;
    var index = 0;
    var complete = true;
    if (data === undefined) {
      return false;
    }
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
    var deferred = $q.defer();
    var element, child;
    if (overview.length === 0 || validate || validationMode) {
      overview = [];
      if (validate) {
        validateWorkflow();
      }
      for (var index = 0; index < workflow.children.length; index++) {
        element = {
                    'name':workflow.children[index].human,
                    'id':workflow.children[index].id
                  };
        if (workflow.children[index].children && workflow.children[index].children[0] && workflow.children[index].children[0].element_type === 'workflow') {
          element.children = [];
          for (var subindex = 0; subindex < workflow.children[index].children.length; subindex++) {
            child = {
                      'name': workflow.children[index].children[subindex].human,
                      'id':workflow.children[index].children[subindex].id
                    };
            if (validationData && validationData[workflow.name] && validationData[workflow.name][workflow.children[index].name]) {
              child.errors = objectLengthCount(validationData[workflow.name][workflow.children[index].name][workflow.children[index].children[subindex].name]);
            }
            if (proposalData && proposalData[workflow.name] && proposalData[workflow.name][workflow.children[index].name]) {
              child.complete = checkCompleteness(workflow.children[index].children[subindex], proposalData[workflow.name][workflow.children[index].name][workflow.children[index].children[subindex].name]);
            } else {
              child.complete = false;
            }
            element.children.push(child);
          }
        }
        else {
          if (validationData && validationData[workflow.name] && validationData[workflow.name][workflow.children[index].name]) {
            element.errors = objectLengthCount(validationData[workflow.name][workflow.children[index].name]);
          }
          if (proposalData && proposalData[workflow.name]) {
            element.complete = checkCompleteness(workflow.children[index], proposalData[workflow.name][workflow.children[index].name]);
          } else {
            element.complete = false;
          }
        }
        overview.push(element);
      }
    }
    deferred.resolve(overview);
    return deferred.promise;
  };

  var getElement = function(elementName) {
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].name === elementName) {
        return workflows[i];
      }
    }
    return null;
  };

  var getOrder = function(element, multipleToken, altName) {
    var order = [];
    order.push(altName !== undefined ? altName : element.name);
    if (multipleToken !== null && multipleToken !== undefined) {
      order.push(multipleToken);
    }
    var nextElementId = element.parentId;
    for (var index = workflowLength - 1; index >= 0; --index) {
      if (workflows[index].id === nextElementId) {
        if (workflows[index].id !== element.id) {
          order.push(workflows[index].name);
        }
        nextElementId = workflows[index].parentId;
      }
    }
    return order;
  };

  var getDataIndex = function(order, leaveOne, source) {
    var data = source;
    var floor = leaveOne ? 1 : 0;
    for (var index = order.length - 1; index >=floor; --index) {
      if (data[order[index]] === undefined || data[order[index]] === null) {
        data[order[index]] = {};
      }
      data = data[order[index]];
    }
    return data;
  };

  var getFieldName = function(name, token) {
    if (token !== null && token !== undefined) {
      return name + '_' + token;
    } else {
      return name;
    }
  };

  var sum = function(params) {
    var value = 0;
    var tempVal;
    for (var i = 0; i < params.length; i++) {
      tempVal = parseFloat(params[i]);
      value += isNaN(tempVal) ? 0 : tempVal;
    }
    return value;
  };

  var numericValue = function(value) {
    var type = typeof value;
    if (type === 'string') {
      return parseFloat(value);
    } else if (type === 'number') {
      return value;
    } else if (type === 'boolean' && value) {
      return 1;
    } else {
      return 0;
    }
  };

  var registerElement = function(element, validationCallback, askIfCallback, multipleToken) {
    // return data, and set validation & ask_if callbacks
    // find or create the proposal data in the correct spot, taking into account the multipleToken, if present.
    var order = getOrder(element, multipleToken);
    var data = getDataIndex(order, true, proposalData);
    var fieldName;
    // if there is a validation callback, add it to the validation structure
    if (validationCallback !== null && validationCallback !== undefined) {
      fieldName = getFieldName(element.name, multipleToken);

      if (element.element_type !== 'calculated') {
        validationCallbacks.push({
          'order': order,
          'cb': validationCallback
        });

        // check to see if the state was already set
        var message = getDataIndex(order, false, validationData);
        if (message === null || (typeof message === 'object' && isEmpty(message))) {
          message = '';
        }
        validationCallback(message);
        if (!calculatedCallbacks[fieldName]) {
          calculatedCallbacks[fieldName] = {
            value: numericValue(data[order[0]]),
            callbacks:[]
          };
        }
      } else {
        var expr = Parser.parse(element.validation);
        var variables = expr.variables();
        expr = expr.toJSFunction(variables);
        var params = [];
        for (var index = 0; index < variables.length; index++) {
          var variableName = getFieldName(variables[index], multipleToken);
          if (variableName === 'sum') {
            // loop over the existing keys, adding them to the list if they look like the next variable
            for (var key in calculatedCallbacks) {
              if (calculatedCallbacks.hasOwnProperty(key) && (key.indexOf(variables[index+1]) === 0)) {
                variables.push(key);
              }
            }
          }
          if (calculatedCallbacks[variableName]) {
            calculatedCallbacks[variableName].callbacks.push({
              callback:validationCallback,
              calculation:expr,
              variables:variables
            });
            params.push(calculatedCallbacks[variableName].value);
          }
          else {
            var variableElement = getElement(variables[index]);
            if (variableElement) {
              var variableOrder = getOrder(variableElement, multipleToken);
              var variableValue = getDataIndex(variableOrder, true, proposalData)[variables[index]];
              calculatedCallbacks[variableName] = {
                value: variableValue,
                callbacks: []
              };
              calculatedCallbacks[variableName].callbacks.push({
                callback:validationCallback,
                calculation:expr,
                variables:variables
              });
              params.push(variableValue);
            }
          }
        }
        if (variables[0] === 'sum') {
          data[order[0]] = sum(params);
        } else {
          data[order[0]] = expr.apply(null, params);
        }
        if (isNaN(data[order[0]])) {
          data[order[0]] = {};
        }
        if (!calculatedCallbacks[fieldName]) {
          calculatedCallbacks[fieldName] = {
            value: numericValue(data[order[0]]),
            callbacks:[]
          };
        }
      }
    }
    
    // if there is an ask if callback, add it to the askif structure
    if (askIfCallback !== null && askIfCallback !== undefined && element.ask_if !== null && element.ask_if !== undefined) {
      var askIfSplit = element.ask_if.split(' ');
      var notLogic = askIfSplit[0] === 'not';
      fieldName = getFieldName(askIfSplit[askIfSplit.length - 1], multipleToken);

      if (askIfCallbacks[fieldName] === undefined) {
        askIfCallbacks[fieldName] = [];
      }
      askIfCallbacks[fieldName].push({'cb':askIfCallback, 'not': notLogic});

      // check to see if the state was already set
      var askIfOrder = getOrder(element, multipleToken, askIfSplit[askIfSplit.length - 1]);
      var askIfData = getDataIndex(askIfOrder, true, proposalData);
      if (notLogic && typeof askIfData[askIfOrder[0]] === 'string') {
        askIfCallback(!stringToBoolean(askIfData[askIfOrder[0]]));
      } else {
        askIfCallback(askIfData[askIfOrder[0]]);
      }
    }
    if (data[order[0]] === undefined) {
      data[order[0]] = {};
    }
    return data[order[0]];
  };

  var applyCalculatedCallback = function(fieldName, value, name, multipleToken) {
    var record, index, varIndex, params;
    if (calculatedCallbacks[fieldName] !== undefined) {
      record = calculatedCallbacks[fieldName];
      record.value = numericValue(value);
      for (index = 0; index < record.callbacks.length; index++) {
        params = [];
        if (record.callbacks[index].variables[0] !== 'sum') {
          for (varIndex = 0; varIndex < record.callbacks[index].variables.length; varIndex++) {
            var varName = getFieldName(record.callbacks[index].variables[varIndex], multipleToken);
            if (calculatedCallbacks[varName]) {
              params.push(calculatedCallbacks[varName].value);
            }
          }
          record.callbacks[index].callback(record.callbacks[index].calculation.apply(null, params));
        }
      }
    }

    if (calculatedCallbacks[name] !== undefined && multipleToken !== undefined) {
      record = calculatedCallbacks[name];
      for (index = 0; index < record.callbacks.length; index++) {
        params = [];
        if (record.callbacks[index].variables[0] === 'sum') {
          for (var key in calculatedCallbacks) {
            if (calculatedCallbacks.hasOwnProperty(key) && (key.indexOf(name) === 0)) {
              params.push(calculatedCallbacks[key].value);
            }
          }
          record.callbacks[index].callback(sum(params));
        }
      }
    }
  };

  var applyElementValue = function(element, value, multipleToken) {
    // apply the value to the proposal data structure
    var order = getOrder(element, multipleToken); 
    var data = getDataIndex(order, true, proposalData);
    data[order[0]] = value;
    var fieldName = getFieldName(element.name, multipleToken);
    var index = 0;

    if (element.element_type === 'bool' || element.element_type === 'checkbox') {
      // walk the askIf tree to see if any callbacks need to be called.
      if (askIfCallbacks[fieldName] !== undefined) {
        for (index = 0; index < askIfCallbacks[fieldName].length; index++) {
          if (askIfCallbacks[fieldName][index].not && typeof value ==='string') {
            askIfCallbacks[fieldName][index].cb(!stringToBoolean(value));
          } else {
            askIfCallbacks[fieldName][index].cb(value);
          }
        }
      }
    }

    // if we've validated the proposal, let's keep that up to date.
    if (validationMode) {
      var message = getDataIndex(order, true, validationData);
      var priorMessage = message[order[0]];
      ValidationService.validateElement(element, data, message);
      if ((priorMessage !== message[order[0]]) && (isEmpty(priorMessage) !== isEmpty(message[order[0]]))) {  
        for (index = 0; index < validationCallbacks.length; index++) {
          message = getDataIndex(validationCallbacks[index].order, false, validationData);
          if (typeof message === 'object' && isEmpty(message)) {
            message = '';
          }
          validationCallbacks[index].cb(message);
        }
      }
    }

    applyCalculatedCallback(fieldName, value, element.name, multipleToken);
  };

  var validateWorkflow = function(element) {
    validationMode = true;
    var data;
    var validData;
    if (element) {
      var order = getOrder(element); 
      data = getDataIndex(order, false, proposalData);
      validData = getDataIndex(order, true, validationData);
      validData[order[0]] = {};
      validData = validData[order[0]];
    } else {
      validationData = {};
      validationData[workflow.name] = {};
      if (proposalData[workflow.name] === undefined) {
        proposalData[workflow.name] = {};
      }
      validData = validationData[workflow.name];
      data = proposalData[workflow.name];
      element = workflow;
    }
    ValidationService.validate(element, data, validData, true);
    for (var index = 0; index < validationCallbacks.length; index++) {
      // check to see if the state was already set
      var message = getDataIndex(validationCallbacks[index].order, false, validationData);
      if (typeof message === 'object' && isEmpty(message)) {
        message = '';
      }
      validationCallbacks[index].cb(message);
    }
  };

  var currentValidationData = function(element) {
    var deferred = $q.defer();
    var order = getOrder(element);
    var selectedData = getDataIndex(order, false, validationData);
    deferred.resolve(selectedData);
    return deferred.promise;
  };

  return {
    create: function(opportunityId, opportunityTitle, workflowId) {
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
    },
    remove: function(proposalId) {
      // remove proposal from saved opps
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
    },
    complete: function() {
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          return saveCompleteData();
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
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
    saveData: function(validate) {
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          return saveProposalData(validate);
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return saveProposalData(validate);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    saveTitle: function(proposalId, proposalTitle) {
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
        if (workflows.length > 0) {
          return getWorkflowElement(elementId);
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No workflow loaded.'));
          return deferred.promise;
        }
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
        if (proposal.id) {
          return getProposalOverview(validate);
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
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
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          return registerElement(element, validationCallback, askIfCallback, multipleToken);
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
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
    validate: function(element) {
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          return validateWorkflow(element);
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return validateWorkflow(element);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    getValidationData: function(element) {
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id && element) {
          return currentValidationData(element);
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return currentValidationData(element);
          } else {
            var deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    getDynamicCount: function(element) {
      var deferred;
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          if (element && element.element_type === 'line_item') {
            return getDynamicDataCount(element);
          }
          else {
            deferred = $q.defer();
            deferred.reject(new Error('Invalid element type.'));
            return deferred.promise;
          }
        }
        else {
          deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return getDynamicDataCount(element);
          } else {
            deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    addDynamicItem: function(element) {
      var deferred;
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          if (element && element.element_type === 'line_item') {
            return addDynamicDataItem(element);
          }
          else {
            deferred = $q.defer();
            deferred.reject(new Error('Invalid element type.'));
            return deferred.promise;
          }
        }
        else {
          deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return addDynamicDataItem(element);
          } else {
            deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    removeDynamicItem: function(element, token) {
      var deferred;      
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          if (element && element.element_type === 'line_item') {
            return removeDynamicDataItem(element, token);
          }
          else {
            deferred = $q.defer();
            deferred.reject(new Error('Invalid element type.'));
            return deferred.promise;
          }
        }
        else {
          deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return removeDynamicDataItem(element, token);
          } else {
            deferred = $q.defer();
            deferred.reject(new Error('Failed to authenticate'));
            return deferred.promise;
          }
        });
      }
    },
    submit: function() {
      if (AuthenticationService.isAuthenticated) {
        if (proposal.id) {
          return submitProposal();
        }
        else {
          var deferred = $q.defer();
          deferred.reject(new Error('No proposal loaded.'));
          return deferred.promise;
        }
      } else {
        return DialogService.openLogin().then(function(data) {
          if (data.value) {
            return submitProposal();
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
