'use strict';

angular.module('sbirezApp').factory('ValidationService', function() {

  var notMoreThan = function(value, params) {
    var maxValue = null;
    var units = null;
    if (params.length > 0) {
      maxValue = parseInt(params[0]);
    }
    if (params.length === 2) {
      units = params[1];
    }
    // timespan
    if (units === 'months') {
      value = parseInt(value);
      return value <= maxValue;
    }
    // wordcount
    else if (units === 'words') {
      var wordList = value.split(' ');
      return wordList.length <= maxValue;
    }
    else if (units === 'comma_separated_phrases') {
      var phraseList = value.split(',');
      return phraseList.length <= maxValue;
    }
    // numeric comparison
    else if (units === null) {
      value = parseInt(value);
      return value <= maxValue;
    }
    else {
      console.log('unexpected parameter', params);
      return false;
    }
  };

  var notLessThan = function(value, params) {
    var minValue = null;
    var units = null;
    if (params.length > 0) {
      minValue = parseInt(params[0]);
    }
    if (params.length === 2) {
      units = params[1];
    }
    // timespan
    if (units === 'months') {
      value = parseInt(value);
      return value >= minValue;
    }
    // wordcount
    else if (units === 'words') {
      var wordList = value.split(' ');
      return wordList.length >= minValue;
    }
    else if (units === 'comma_separated_phrases') {
      var phraseList = value.split(',');
      return phraseList.length >= minValue;
    }
    // numeric comparison
    else if (units === null) {
      value = parseInt(value);
      return value >= minValue;
    }
    else {
      console.log('unexpected parameter', params);
      return false;
    }
  };

  var equals = function(value, params) {
    var equalValue = null;
    var units = null;
    if (params.length > 0) {
      equalValue = parseInt(params[0]);
    }
    if (params.length === 2) {
      units = params[1];
    }
    // timespan
    if (units === 'months') {
      value = parseInt(value);
      return value === equalValue;
    }
    // wordcount
    else if (units === 'words') {
      var wordList = value.split(' ');
      return wordList.length === equalValue;
    }
    else if (units === 'comma_separated_phrases') {
      var phraseList = value.split(',');
      return phraseList.length === equalValue;
    }
    // numeric comparison
    else if (units === null) {
      value = parseInt(value);
      return value === equalValue;
    }
    else {
      console.log('unexpected parameter', params);
      return false;
    }
  };

  var notEqual = function(value, params) {
    var equalValue = null;
    var units = null;
    value = parseInt(value);
    if (params.length > 0) {
      equalValue = parseInt(params[0]);
    }
    if (params.length === 2) {
      units = params[1];
    }
    // timespan
    if (units === 'months') {
      value = parseInt(value);
      return value !== equalValue;
    }
    // wordcount
    else if (units === 'words') {
      var wordList = value.split(' ');
      return wordList.length !== equalValue;
    }
    else if (units === 'comma_separated_phrases') {
      var phraseList = value.split(',');
      return phraseList.length !== equalValue;
    }
    // numeric comparison
    else if (units === null) {
      value = parseInt(value);
      return value !== equalValue;
    }
    else {
      console.log('unexpected parameter', params);
      return false;
    }
  };

  var oneOf = function(value, params) {
    return params.indexOf(value) !== -1;
  };

  var processValidation = function(validationString, value) {
    var commands = validationString.split(' ');
    if (typeof value === 'object' && value.length ===  undefined) {
      value = '';
    }
    if (commands.length > 0) {
      var command = commands[0];
      commands.splice(0,1);
      if (command === 'not_more_than' || command === 'no_more_than') {
        return notMoreThan(value, commands);
      }
      else if (command === 'not_less_than' || command === 'no_less_than') {
        return notLessThan(value, commands);
      }
      else if (command === 'equals') {
        return equals(value, commands);
      }
      else if (command === 'does_not_equal') {
        return notEqual(value, commands);
      }
      else if (command === 'one_of') {
        return oneOf(value, commands);
      }
    }
    else {
      console.log('Invalid validation string');
      return false;
    }
  };

  var isSet = function(data, elementName) {
    return !(data === undefined ||
             data[elementName] === null ||
             data[elementName] === undefined ||
             data[elementName] === '' ||
             (typeof data[elementName] === 'object' && data[elementName].length === undefined));
  };

  var processRequired = function(element, workflow, data) {
    if (element.ask_if && isSet(data, element.ask_if)) {
      return isSet(data, element.name);
    } else if (!element.ask_if) { 
      return (isSet(data, element.name)); 
    }
    else {
      return true;
    }
  };
 
  return {
    validate: function(workflow, data, validationResults) {
      var length = workflow.children.length;
      for (var i = 0; i < length; i++) {
        var element = workflow.children[i];
        if (element.validation !== null && data && data[element.name]) {
          if (!processValidation(element.validation, data[element.name])) {
            validationResults[element.name] = element.validation_msg;
          } else {
            //console.log('validation passed', element.name); 
          }
        }
        else if (element.required === true) {
          if (!processRequired(element, workflow, data)) {
            validationResults[element.name] = 'Field is required';
            //console.log('Field is required', element.name);
          }
        }

        if (element.element_type === 'line_item' && element.multiplicity && element.multiplicity.length > 0) {
          for (var j = 0; j < element.multiplicity.length; j++) {
            if (data[element.name] === undefined) {
              data[element.name] = {};
            }
            if (data[element.name][element.multiplicity[j].token] === undefined) {
              data[element.name][element.multiplicity[j].token] = {};
            }
            if (validationResults[element.name] === undefined) {
              validationResults[element.name] = {};
            }
            if (validationResults[element.name][element.multiplicity[j].token] === undefined) {
              validationResults[element.name][element.multiplicity[j].token] = {};
            }
            this.validate(element, data[element.name][element.multiplicity[j].token], validationResults[element.name][element.multiplicity[j].token]);
          }
        }
        if (element.children.length > 0 && element.element_type === 'group' || element.element_type === 'workflow') {
          //console.log('validate precall', element.name);
          if (validationResults[element.name] === undefined) {
            validationResults[element.name] = {};
          }
          if (data[element.name] === undefined) {
            data[element.name] = {};
          }
          this.validate(element, data[element.name], validationResults[element.name], true);
        }
      }
      //console.log('Validation Results', validationResults);
      return validationResults === undefined ? true : validationResults.length === 0;
    }
  };
});
