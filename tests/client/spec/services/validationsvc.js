'use strict';

describe('Service: ValidationService', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var ValidationService;

  var elemData = {
    'id': 1,
    'name': 'nestedworkflow',
    'order': 1,
    'element_type': 'workflow',
    'required': false,
    'default': null,
    'human': 'Nested Workflow',
    'help': null,
    'validation': null,
    'validation_msg': null,
    'ask_if': null,
    'multiplicity': null,
    'children': [
      {
        'id': 2,
        'name': 'nested_workflow1',
        'order': 1,
        'element_type': 'workflow',
        'required': false,
        'default': null,
        'human': 'Nested 1',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': [
          {
            'id': 4,
            'name': 'bool_field1',
            'order': 1,
            'element_type': 'bool',
            'required': true,
            'default': null,
            'human': 'Bool Field',
            'help': null,
            'validation': null,
            'validation_msg': null,
            'ask_if': null,
            'multiplicity': null,
            'children': []
          },
          {
            'id': 6,
            'name': 'dollar_field1',
            'order': 1,
            'element_type': 'dollar',
            'required': false,
            'default': null,
            'human': 'Dollar Field',
            'help': null,
            'validation': null,
            'validation_msg': null,
            'ask_if': 'bool_field1',
            'multiplicity': null,
            'children': []
          },
          {
            'id': 7,
            'name': 'calculated_field1',
            'order': 1,
            'element_type': 'calculated',
            'required': false,
            'default': null,
            'human': 'Calculated Field',
            'help': null,
            'validation': 'dollar_field1 * 5',
            'validation_msg': null,
            'ask_if': 'bool_field1',
            'multiplicity': null,
            'children': []
          }]
      },
      {
        'id': 3,
        'name': 'nested_workflow2',
        'order': 1,
        'element_type': 'workflow',
        'required': false,
        'default': null,
        'human': 'Nested 2',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': [
          {
            'id': 5,
            'name': 'bool_field2',
            'order': 1,
            'element_type': 'bool',
            'required': true,
            'default': null,
            'human': 'Bool Field 2',
            'help': null,
            'validation': null,
            'validation_msg': null,
            'ask_if': null,
            'multiplicity': null,
            'children': []
          }]
      },
      {
        'id': 8,
        'name': 'nested_workflow3',
        'order': 1,
        'element_type': 'workflow',
        'required': false,
        'default': null,
        'human': 'Nested 2',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': [
          {
            'id': 9,
            'name': 'line_item1',
            'order': 1,
            'element_type': 'line_item',
            'required': true,
            'default': null,
            'human': 'Line Item 1',
            'help': null,
            'validation': null,
            'validation_msg': null,
            'ask_if': null,
            'multiplicity': 6,
            'children': [
              {
                'id': 10,
                'name': 'dollar_field2',
                'order': 1,
                'element_type': 'dollar',
                'required': true,
                'default': null,
                'human': 'Dollar Field 2',
                'help': null,
                'validation': null,
                'validation_msg': null,
                'ask_if': null,
                'multiplicity': null,
                'children': []
              },
              {
                'id': 11,
                'name': 'hour_field1',
                'order': 1,
                'element_type': 'float',
                'required': true,
                'default': null,
                'human': 'Hour Field 1',
                'help': null,
                'validation': null,
                'validation_msg': null,
                'ask_if': null,
                'multiplicity': null,
                'children': []
              },
              {
                'id': 12,
                'name': 'calculated_field2',
                'order': 1,
                'element_type': 'calculated',
                'required': false,
                'default': null,
                'human': 'Calculated Field 2',
                'help': null,
                'validation': 'hour_field1 * dollar_field2',
                'validation_msg': null,
                'ask_if': null,
                'multiplicity': null,
                'children': []
              }
            ]
          },
          {
            'id': 12,
            'name': 'calculated_field3',
            'order': 1,
            'element_type': 'calculated',
            'required': false,
            'default': null,
            'human': 'Calculated Field 3',
            'help': null,
            'validation': 'sum(calculated_field2)',
            'validation_msg': null,
            'ask_if': null,
            'multiplicity': null,
            'children': []
          }]
      }
    ]
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_ValidationService_) {
    ValidationService = _ValidationService_;
  }));

  // validate
  it('should honor basic required flag functionality', function() {
    var elements = {
      'id': 1,
      'name': 'nestedworkflow',
      'order': 1,
      'element_type': 'workflow',
      'required': false,
      'default': null,
      'human': 'Nested Workflow',
      'help': null,
      'validation': null,
      'validation_msg': null,
      'ask_if': null,
      'multiplicity': null,
      'children': [
        {
          'id': 2,
          'name': 'bool_field1',
          'order': 1,
          'element_type': 'bool',
          'required': true,
          'default': null,
          'human': 'Bool Field',
          'help': null,
          'validation': null,
          'validation_msg': null,
          'ask_if': null,
          'multiplicity': null,
          'children': []
        },
        {
          'id': 3,
          'name': 'dollar_field1',
          'order': 1,
          'element_type': 'dollar',
          'required': true,
          'default': null,
          'human': 'Dollar Field',
          'help': null,
          'validation': null,
          'validation_msg': null,
          'ask_if': null,
          'multiplicity': null,
          'children': []
        }]
    };
    var elemData = {
      'bool_field1': 'true'
    };
    var validationData = {};
    ValidationService.validate(elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({});
    expect(validationData.dollar_field1).toEqual('This field is required');
  });

  it('should prefer required error over other validation error logic', function() {
    var elements = {
      'id': 1,
      'name': 'nestedworkflow',
      'order': 1,
      'element_type': 'workflow',
      'required': false,
      'default': null,
      'human': 'Nested Workflow',
      'help': null,
      'validation': null,
      'validation_msg': null,
      'ask_if': null,
      'multiplicity': null,
      'children': [
        {
          'id': 3,
          'name': 'dollar_field1',
          'order': 1,
          'element_type': 'dollar',
          'required': true,
          'default': null,
          'human': 'Dollar Field',
          'help': null,
          'validation': 'not_more_than 100',
          'validation_msg': 'Must not exceed 100',
          'ask_if': null,
          'multiplicity': null,
          'children': []
        }]
    };
    var elemData = {
    };
    var validationData = {};
    ValidationService.validate(elements, elemData, validationData);
    expect(validationData.dollar_field1).toEqual('This field is required');
  });

  it('should return a not more than error if it fails the test', function() {
    var elements = {
      'id': 1,
      'name': 'nestedworkflow',
      'order': 1,
      'element_type': 'workflow',
      'required': false,
      'default': null,
      'human': 'Nested Workflow',
      'help': null,
      'validation': null,
      'validation_msg': null,
      'ask_if': null,
      'multiplicity': null,
      'children': [
        {
          'id': 3,
          'name': 'dollar_field1',
          'order': 1,
          'element_type': 'dollar',
          'required': true,
          'default': null,
          'human': 'Dollar Field',
          'help': null,
          'validation': 'not_more_than 100',
          'validation_msg': 'Must not exceed 100',
          'ask_if': null,
          'multiplicity': null,
          'children': []
        }]
    };
    var elemData = {
      'dollar_field1': '333'
    };
    var validationData = {};
    ValidationService.validate(elements, elemData, validationData);
    expect(validationData.dollar_field1).toEqual('Must not exceed 100');
  });
  // validateElement

  var conditionally_required_elements = {
    'id': 1,
    'name': 'nestedworkflow',
    'order': 1,
    'element_type': 'workflow',
    'required': false,
    'default': null,
    'human': 'Nested Workflow',
    'help': null,
    'validation': null,
    'validation_msg': null,
    'ask_if': null,
    'multiplicity': null,
    'children': [
      {
        'id': 3,
        'name': 'bool_field1',
        'order': 1,
        'element_type': 'bool',
        'required': false,
        'default': null,
        'human': 'Do you feel like answering the next question?',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      },
      {
        'id': 6,
        'name': 'str_field1',
        'order': 1,
        'element_type': 'med_str',
        'required': true,
        'default': null,
        'human': 'Why did you answer this question?',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': 'bool_field1',
        'multiplicity': null,
        'children': []
      }
    ]
  };

  it('should recognize data entered as meeting the `required` condition', function() {
    var elemData = {
      'bool_field1' : true,
      'str_field1': 'my answer'
    };
    var validationData = {};
    ValidationService.validate(conditionally_required_elements, elemData, validationData);
    expect(validationData).toEqual({'str_field1' : {  }});
  });

  it('should consider a whitespace-only answer to fail a `required` check', function() {
    var elemData = {
      'bool_field1' : true,
      'str_field1': '   \t\t   \n'
    };
    var validationData = {};
    ValidationService.validate(conditionally_required_elements, elemData, validationData);
    expect(validationData.str_field1).toEqual('This field is required');
  });


  it('should honor required flag when its ask_if condition is met', function() {
    var elemData = {
      'bool_field1' : true,
      'str_field1': ''
    };
    var validationData = {};
    ValidationService.validate(conditionally_required_elements, elemData, validationData);
    expect(validationData.str_field1).toEqual('This field is required');
  });

  it('should honor required flag when bools in data are in string form', function() {
    var elemData = {
      'bool_field1' : 'true',
      'str_field1': ''
    };
    var validationData = {};
    ValidationService.validate(conditionally_required_elements, elemData, validationData);
    expect(validationData.str_field1).toEqual('This field is required');
  });

  var interdependent_elements = {
    'id': 1,
    'name': 'nestedworkflow',
    'order': 1,
    'element_type': 'workflow',
    'required': false,
    'default': null,
    'human': 'Nested Workflow',
    'help': null,
    'validation': null,
    'validation_msg': null,
    'ask_if': null,
    'multiplicity': null,
    'children': [
      {
        'id': 3,
        'name': 'bool_field1',
        'order': 1,
        'element_type': 'bool',
        'required': false,
        'default': null,
        'human': 'Please check this box.',
        'help': null,
        'validation': 'required_unless str_field1',
        'validation_msg': 'Check this box or explain yourself!',
        'ask_if': null,
        'multiplicity': null,
        'children': []
      },
      {
        'id': 6,
        'name': 'str_field1',
        'order': 1,
        'element_type': 'med_str',
        'required': false,
        'default': null,
        'human': 'Reason for refusing to check the box',
        'help': null,
        'validation': 'required_unless bool_field1',
        'validation_msg': 'Check the box above or explain yourself!',
        'multiplicity': null,
        'children': []
      }
    ]
  };

  xit('should pass the `required_unless` validation if first item is true', function() {
    var elemData = {
      'bool_field1' : 'true',
      'str_field1': ''
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  xit('should pass the `required_unless` validation if second item is true', function() {
    var elemData = {
      'bool_field1' : 'false',
      'str_field1': ' i believe in free will'
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  it('should fail the `required_unless` validation if neither item is true', function() {
    var elemData = {
      'bool_field1' : 'false',
      'str_field1': ''
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual('Check this box or explain yourself!');
  });

});
