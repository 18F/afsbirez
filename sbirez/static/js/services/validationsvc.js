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
             (typeof data[elementName] === 'string' && data[elementName].trim() === '') ||
             (typeof data[elementName] === 'object' && data[elementName].length === undefined));
  };

  var isTrueIsh = function(data, elementName) {
    return !(data === undefined ||
             data[elementName] === null ||
             data[elementName] === undefined ||
             data[elementName] === false ||
             (typeof data[elementName] === 'string' && data[elementName].trim() === '') ||
             (typeof data[elementName] === 'object' && data[elementName].length === undefined));
  }

  var xor = function(foo, bar) {
    return ( ( foo || bar ) && !( foo && bar ) );
  };

  var meetsRequirement = function(data, element) {
    if ((element.required === 'True') || (element.required === true)) {
      return isSet(data, element.name);
    } else if ((element.required === 'False') || (element.required === false)) {
      return true;
    }
    else {
      var words = element.required.split(/\s+/);
      if (words[0] === 'unless') {
        return (isTrueIsh(data, element.name) || isTrueIsh(data, words[1]));
      } else if (words[0] === 'xor') {
        return xor(isTrueIsh(data, element.name), isTrueIsh(data, words[1]));
      }
    }
  };

  // Similar function in proposalsvc.js.  Moving to a single location would
  // be a good refactoring task
  var stringToBoolean = function(data){
    try {
      switch(data.toLowerCase()){
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(data);
      }
    } catch (err) {
      if (err instanceof TypeError) {
        return Boolean(data);
      }
      else {
        throw err;
      }
    }
  };

  // as with processValidation, returns true if  it passes, false if it fails
  var processRequired = function(element, data) {
    // if it has a condition, and that condition is set
    if (element.ask_if && isSet(data, element.ask_if)) {
        if (stringToBoolean(data[element.ask_if]) === true) {
          return meetsRequirement(data, element);   // usual handling of `required`
        } else {
          return true;    // `ask_if` proved false, so do not check for `required`
        }
      }
      else { // no `ask_if`, so check `required` normally
        return meetsRequirement(data, element);
      }
  };

  var parseRequirement = function(element) {
    // from a .required string, produces
    // [validation_type, [related_element_names]]
    try {
      var words = element.required.split(/\s+/);
      var requirement_type = words[0];
      var related_element_names = words.slice(1);
      return [requirement_type, related_element_names];
    } catch(err) {
      return [element.requirement, []];
    }
  };

  var splitOnWhitespace = function(txt) {
    try {
      return txt.split(/\s+/);
    } catch(err) {
      return [txt];
    }
  };

  var requirementFailureMessage = function(element) {
    var requirement_type = splitOnWhitespace(element.required)[0];
    if (requirement_type === 'unless') {
      return 'One of these fields is required.';
    } else if (requirement_type === 'xor') {
      return 'Exactly one of these fields is required.';
    } else {
      return 'This field is required';
    }
  };

  var elementsRelated = function(workflow, element) {
    // An element's `.required` field may indicate that it can only be
    // validated in conjunction with other elements, like in the case
    // of `.required` === 'unless element2'.  Find such elements, if any.
    var words = splitOnWhitespace(element.required);
    var element_names = words.slice(1);
    var result = [];
    for (i = 0; i < element_names.length; i++) {
      result.append(workflow);
    }
    return words.slice(1);
  };

  return {
    validate: function(workflow, data, validationResults) {
      var length = workflow.children.length;
      var requiredSet = false;
      for (var i = 0; i < length; i++) {
        var element = workflow.children[i];
        if (element.required !== 'False') {
          if (!processRequired(element, data)) {
            validationResults[element.name] = requirementFailureMessage(element);
            requiredSet = true;
          } else {
            validationResults[element.name] = {};
          }
        }
        if (element.validation !== null && data && data[element.name] && !requiredSet) {
          if (!processValidation(element.validation, data[element.name])) {
            validationResults[element.name] = element.validation_msg;
          } else {
            validationResults[element.name] = {};
          }
        }
        if (element.element_type === 'line_item' && element.multiplicity && element.multiplicity.length > 0 &&
            (!element.ask_if || element.ask_if && isSet(data, element.ask_if) && data[element.ask_if] === 'true')) {
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
        if (element.children.length > 0 && element.element_type === 'workflow') {
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
    },

    validateElement: function(element, data, validationResults) {
      // calling this single validation should also trigger re-validation
      // of fields linked through `unless`, `xor`, etc
      var requiredSet = false;
      if (element.required !== 'False') {
        if (!processRequired(element, data)) {
          validationResults[element.name] = requirementFailureMessage(element);
          requiredSet = true;
        } else {
          validationResults[element.name] = {};
        }
      }
      if (element.validation !== null && data && data[element.name] && !requiredSet) {
        if (!processValidation(element.validation, data[element.name])) {
          validationResults[element.name] = element.validation_msg;
        } else {
          validationResults[element.name] = {};
        }
      }
    }
  };
});
