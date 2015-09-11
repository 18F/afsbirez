'use strict';

angular.module('sbirezApp').factory('ProposalService', function($http, $window, $q, $location, AuthenticationService, ValidationService) {

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


  /*
   * AuthenticationService will call this callback whenever a user
   * authenticates or logs out. Without this, logging out and logging
   * in as a different user could leave the prior user's data visible.
   */
  AuthenticationService.registerObserverCallback(function() {
    unloadProposal();
  });

  /*
   * Returns the list of proposals that the user is authorized to access.
   */
  var getProposals = function() {
    var deferred = $q.defer();
    $http.get(PROPOSAL_URI).success(function(data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  };

  /*
   * Retrieves the requested proposal, if the user is authorized to access
   * it. If the proposal is already, loaded, return the cached version.
   */
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

  /*
   * Creates a new proposal for the user, based on the opportunity.
   */
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

  /*
   * Removes a proposal based on the requested proposal id.
   */
  var removeProposal = function(proposalId) {
    var deferred = $q.defer();
    $http.delete(PROPOSAL_URI + proposalId + '/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  /*
   * Saves a complete proposal with data. Will request server-side validation
   * based on the validation flag.
   */
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

  /*
   * Updates/saves the proposal data, and triggers server side validation.
   */
  var saveCompleteData = function() {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposal.id + '/', {'data':JSON.stringify(proposalData)}).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  /*
   * Updates the proposal title. Does not trigger server side validation.
   */
  var saveProposalTitle = function(proposalId, proposalTitle) {
    var deferred = $q.defer();
    $http.patch(PROPOSAL_URI + proposalId + '/partial/', {'title':proposalTitle}).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  /*
   * Triggers the proposal submission process on the server.
   */
  var submitProposal = function() {
    var deferred = $q.defer();
    $http.post(PROPOSAL_URI + proposal.id + '/submit/').success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject(new Error(data));
    });
    return deferred.promise;
  };

  /*
   * Recursively walks the workflow tree to generate an array of elements.
   * The array of elements is used to speed up access to the elements
   * and make them easier to work with internally.
   */
  var buildIndex = function(workflow, parent) {
    workflow.parentId = parent;
    workflows.push(workflow);
    if (workflow.children !== undefined) {
      for (var i = 0; i < workflow.children.length; i++) {
        buildIndex(workflow.children[i], workflow.id);
      }
    }
  };

  /*
   * Walks the workflow index to expand line item elements that can have 
   * multiplicities. Line item elements take one of three forms: 
   *   Single line item - no multiplicity defined, line item acts as
   *  a logical container for related fields, i.e. an address or contact
   *  info. Data for these elements are stored like workflow elements,
   *  directly as a child object.
   *   Dynamic line item - numeric multiplicity. The number represents
   *  the maximum number of entries for the line item, and the form allows
   *  the user to add/remove additional entries via the [add/remove]DynamicDataItem
   *  methods. Data is stored in a object indexed by the multiplicity index.
   *   Normal line item - csv multiplicity. Each item's data is stored in a
   *  subobject indicated by the 'token' value.
   * Does not return anything, but modifies the workflow index (workflows).
   */
  var buildMultiplicities = function() {
    var count;
    var iter;
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].element_type === 'line_item') {
        // Single line item
        if (workflows[i].multiplicity === null) {
          workflows[i].multiplicity = [];
          workflows[i].multiplicity[0] = {'token':0, 'value':0};
          workflows[i].multiplicityCount = 1;
        // Dynamic line item
        } else if (isFinite(workflows[i].multiplicity)) {
          count = parseInt(workflows[i].multiplicity);
          var dataCount = Math.max(1, getDynamicDataCount(workflows[i]));
          workflows[i].multiplicity = [];
          workflows[i].multiplicityCount = count;
          for (iter = 0; iter < dataCount; iter++) {
            workflows[i].multiplicity[iter] = {'token': iter, 'value': iter};
          }
        // Normal line item
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

  /*
   * Adds a new dynamic line item to a line item. Does not return
   * anything. It modifies the workflow index.
   */
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

  /*
   * Removes a dynamic line item, reindexes the remaining entries and
   * calls any relevant calculated field callbacks.
   */
  var removeDynamicDataItem = function(element, multipleToken) {
    var data = getDataIndex(getOrder(element), true, proposalData);
    var length = objectLengthCount(data[element.name], false);
    var index;
    var workingElement;
    // move any elements after the removed item 'up'
    if (multipleToken < length-1) {
      for (index = multipleToken; index + 1 < length; index++) {
        data[element.name][index] = data[element.name][index + 1];
      }
    }
    // delete the last element from the data
    delete data[element.name][length - 1];
    for (index = 0; index < workflowLength; index++) {
      if (workflows[index].id === element.id) {
        workingElement = workflows[index];
        break;
      }
    }
    // remove an element from the workflow and reindex
    workingElement.multiplicity.splice(multipleToken, 1);
    for (index = 0; index < workingElement.multiplicity.length; index++) {
      workingElement.multiplicity[index] = {'token': index, 'value': index};
    }

    // remove any callbacks tied to the child elements of this item, and
    // trigger any calculation callbacks tied to the set of elements.
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

  /*
   * Returns the number of items in a dynamic line item.
   */
  var getDynamicDataCount = function(element) {
    var data = getDataIndex(getOrder(element), true, proposalData);
    return objectLengthCount(data[element.name], false);
  };

  /*
   * The primary entry point for the proposal service. This loads the
   * requested proposal, its corresponding workflow, and the topic. The
   * method also does all the setup work, creating the element index and
   * populating any multiplicities. It returns the constructed proposal
   * object.
   */
  var loadProposal = function(proposalId) {
    // retrieves workflow and data
    if (proposal.id !== proposalId) {
      // clear out any existing proposal info.
      overview = [];
      validationData = {};
      validationCallbacks = [];
      askIfCallbacks = {};
      calculatedCallbacks = {};
      loadingPromise = $q.defer();
      // retrieve the proposal
      $http.get(PROPOSAL_URI + proposalId + '/').success(function(propData) {
        proposal = propData;
        proposalData = propData.data;
        // retrieve the related workflow
        $http.get('api/v1/elements/' + proposal.workflow + '/').success(function(data) {
          // save the workflow info and do the post-processing on the workflow (index + multiplicity)
          workflow = data;
          buildIndex(workflow, null);
          workflowLength = workflows.length;
          buildMultiplicities();
          // if the topic isn't already loaded, load it.
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

  /*
   * Unload the current proposal. This clears out the all the local 
   * buffers.
   */
  var unloadProposal = function() {
    // clears workflow & data
    var deferred = $q.defer();
    deferred.resolve(true);
    proposal = {};
    proposalData = {};
    validationData = {};
    validationCallbacks = [];
    askIfCallbacks = {};
    calculatedCallbacks = {};
    topic = {};
    return deferred.promise;
  };

  /*
   * Functions as a page turn mechanism. 'Selects' the element and clears
   * the callbacks related to the prior selected element. Returns the current
   * element and the ids of the prior and next elements to the application.
   */
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
      // find the prior and next workflows
      if (currentWorkflowIndex >= 0) {
        previousWorkflow = null;
        for (index = currentWorkflowIndex - 1; index >= 0; --index) {
          if (workflows[index].element_type === 'workflow' &&
              workflows[index].children &&
              workflows[index].children[0] &&
              workflows[index].children[0].element_type !== 'workflow') {
            previousWorkflow = workflows[index].id;
            break;
          }
        }
      }
      if (currentWorkflowIndex < workflowLength) {
        nextWorkflow = null;
        for (index = currentWorkflowIndex + 1; index < workflowLength; ++index) {
          if (workflows[index].element_type === 'workflow' &&
              workflows[index].children && workflows[index].children[0] &&
              workflows[index].children[0].element_type !== 'workflow') {
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

  /*
   * Helper method to count the number of properties on an object.
   * Used for generating the overview and working with dynamic
   * line items. Returns the number of properties.
   */
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

  /*
   * Helper method to determine if an object is 'empty'.
   * Returns a boolean.
   */
  var isEmpty = function(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };

  /*
   * Helper method to determine if an array element is set.
   * Returns a boolean.
   */
  var isSet = function(data, elementName) {
    return !(data === undefined ||
             data[elementName] === null ||
             data[elementName] === undefined ||
             (typeof data[elementName] === 'string' && data[elementName].trim() === '') ||
             (typeof data[elementName] === 'object' && isEmpty(data[elementName])));
  };

  /*
   * Helper method to determine if an element is required.
   * Returns a boolean.
   */
  var isRequired = function(element) {
    return element && 
           element.required && 
           element.required !== 'False' &&
           element.required !== 'false';
  };

  /*
   * Helper method to derive a boolean from a string.
   * Returns a boolean.
   */
  var stringToBoolean = function(data){
    switch(data.toLowerCase()){
      case 'true': case 'yes': case '1': return true;
      case 'false': case 'no': case '0': case null: return false;
      default: return Boolean(data);
    }
  };

  /*
   * Checks to see if an element and its children are complete. A 
   * 'complete' element has all required elements filled in. This is a
   * rough heuristic; a proposal should be validated to determine actual
   * completeness. Returns a boolean.
   */
  var checkCompleteness = function(element, data) {
    var length = element.children.length;
    var index = 0;
    var complete = true;
    if (data === undefined) {
      return false;
    }
    for (index; index < length && complete; index++) {
      if (isRequired(element.children[index])) {
        if (element.children[index].ask_if && 
            (data[element.children[index].ask_if] === true || data[element.children[index].ask_if] === 'true')) {
          complete = isSet(data, element.children[index].name);
        }
        else if (!element.children[index].ask_if) {
          complete = isSet(data, element.children[index].name);
        }
      }
    }
    return complete;
  };

  /*
   * Recursive method for building an overview tree. The overview tree
   * contains names, ids, 'completeness', and (if requested) number of
   * errors (based on the client side validation logic). Will recurse
   * `depth` levels into the workflow. Returns the constructed part of
   * the overview tree.
   */
  var getOverviewLevel = function(element, localProposalData, localValidationData, depth, level) {
    var localOverview = [];
    var firstLevel, overviewElement;
    for (var index = 0; index < element.children.length; index++) {
      firstLevel = element.children[index];
      overviewElement = {
                          'name': firstLevel.human,
                          'id': firstLevel.id
                        };
      // is the child also a workflow? if so, should we follow it?
      if (firstLevel.children && 
          firstLevel.children[0] && 
          firstLevel.children[0].element_type === 'workflow' &&
          level < depth) {
        overviewElement.children = getOverviewLevel(firstLevel, 
                                                    localProposalData[firstLevel.name], 
                                                    localValidationData ? localValidationData[firstLevel.name] : undefined, 
                                                    depth, 
                                                    level + 1);
      }
      else {
        // if we have validation data, get the number of errors
        if (localValidationData) {
          overviewElement.errors = objectLengthCount(localValidationData[firstLevel.name]);
        }
        // if we have data (we should, except on a newly constructed 
        // proposal) check for 'completeness'
        if (localProposalData) {
          overviewElement.complete = checkCompleteness(firstLevel, localProposalData[firstLevel.name]);
        } else {
          overviewElement.complete = false;
        }
      }
      localOverview.push(overviewElement);
    }
    return localOverview;
  };

  /*
   * Non-recursive caller of `getOverviewLevel`. Clears out the 
   * existing overview, calls validate if requested, and then
   * jumps into getOverviewLevel to do the real work.
   */
  var getProposalOverview = function(validate) {
    var deferred = $q.defer();
    if (overview.length === 0 || validate || validationMode) {
      overview = [];
      if (validate) {
        validateWorkflow();
      }
    }
    overview = getOverviewLevel(workflow, proposalData[workflow.name], validationData[workflow.name], 2, 1);
    deferred.resolve(overview);
    return deferred.promise;
  };

  /*
   * Helper method to retrieve an element based on its name. Returns the
   * element, or null if not found.
   */
  var getElement = function(elementName) {
    for (var i = 0; i < workflowLength; i++) {
      if (workflows[i].name === elementName) {
        return workflows[i];
      }
    }
    return null;
  };

  /*
   * Retrieves the 'breadcrumbs' needed to navigate the data or 
   * validation tree to the element.
   */
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

  /*
   * Takes an order (as returned by getOrder) and returns a 
   * reference to that point in the source data structure.
   */
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

  /*
   * Helper function to build a field name + token.
   */
  var getFieldName = function(name, token) {
    if (token !== null && token !== undefined) {
      return name + '_' + token;
    } else {
      return name;
    }
  };

  /*
   * Special calculated field calculation. It wasn't built into the 
   * expression parser we are using. Takes a parameter array and returns
   * the sum of the values.
   */
  var sum = function(params) {
    var value = 0;
    var tempVal;
    for (var i = 0; i < params.length; i++) {
      tempVal = parseFloat(params[i]);
      value += isNaN(tempVal) ? 0 : tempVal;
    }
    return value;
  };

  /*
   * Helper to return the numeric representation of a value.
   */
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

  /*
   * registerElement is how the controller or directive indicates to
   * the proposalService that it is currently working with a proposal
   * field. The method sets up an requested callbacks (validation or
   * ask_if logic) and returns the current value for the field.
   */
  var registerElement = function(element, validationCallback, askIfCallback, multipleToken) {
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
        // parser is a third party expression parser that we use to process calculated fields
        var expr = Parser.parse(element.validation);
        var variables = expr.variables();
        expr = expr.toJSFunction(variables);
        var params = [];
        for (var index = 0; index < variables.length; index++) {
          var variableName = getFieldName(variables[index], multipleToken);
          // sum is not a built in function for the parser library, so 
          // we need to handle it slightly differently.
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
          // not a 'sum' field
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
        // apply the calculated field expression
        if (variables[0] === 'sum') {
          data[order[0]] = Math.round((sum(params) + 0.00001) * 100) / 100;
        } else {
          data[order[0]] = Math.round((expr.apply(null, params) + 0.00001) * 100) / 100;
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

  /*
   * Triggers all necessary calculated field callbacks based on a
   * value change. This is not usually called directly.
   */
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
          record.callbacks[index].callback(Math.round((record.callbacks[index].calculation.apply(null, params) + 0.00001) * 100) / 100);
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
          record.callbacks[index].callback(Math.round((sum(params) + 0.00001) * 100) / 100);
        }
      }
    }
  };

  /*
   * Called by the controller or directive to save an updated value
   * into the proposal data. This will trigger any callbacks for 
   * ask_if logic, validations (if we have entered validation mode),
   * and calculated fields.
   */
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

  /*
   * Called by the controller or directive to validate a proposal,
   * either from the root or from a particular element. This calls
   * into the validation service and reports the results via all
   * registered validation callbacks.
   */
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

  /*
   * Returns the current validation data for the requested element (and
   * child elements) without triggering validation.
   */
  var currentValidationData = function(element) {
    var deferred = $q.defer();
    var order = getOrder(element);
    var selectedData = getDataIndex(order, false, validationData);
    deferred.resolve(selectedData);
    return deferred.promise;
  };

  /*
   * Public interface methods. Provide access to the above methods
   * while honoring the authentication status and some flow
   * expections. i.e. you must have a proposal loaded to save data.
   */
  return {
    create: function(opportunityId, opportunityTitle, workflowId) {
      if (!AuthenticationService.isAuthenticated) {
        var path = $location.path();
        $location.path('signin').search('target', path);
      } else {
        return createProposal(opportunityId, opportunityTitle, workflowId);
      }
    },
    remove: function(proposalId) {
      // remove proposal from saved opps
      if (AuthenticationService.isAuthenticated) {
        return removeProposal(proposalId);
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    list: function() {
      if (AuthenticationService.isAuthenticated) {
        return getProposals();
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    get: function(proposalId) {
      if (AuthenticationService.isAuthenticated) {
        return getProposal(proposalId);
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
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
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    saveTitle: function(proposalId, proposalTitle) {
      if (AuthenticationService.isAuthenticated) {
        return saveProposalTitle(proposalId, proposalTitle);
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    load: function(proposalId) {
      if (AuthenticationService.isAuthenticated) {
        return loadProposal(proposalId);
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    unload: function() {
      if (AuthenticationService.isAuthenticated) {
        return unloadProposal();
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    },
    apply: function(element, value, multipleToken) {
      //console.log('apply', element, value, multipleToken);
      if (AuthenticationService.isAuthenticated) {
        return applyElementValue(element, value, multipleToken);
      } else {
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
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
        var path = $location.path();
        $location.path('signin').search('target', path);
      }
    }
  };
});
