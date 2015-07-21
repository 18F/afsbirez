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
      'bool_field1': true
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

  var percentageElements = {
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
        'name': 'percentage_field1',
        'order': 1,
        'element_type': 'percentage',
        'required': true,
        'default': null,
        'human': 'Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      }]
  }

  it('should correctly validate that a valid percentage field is valid', function() {
    var elemData = {
      'percentage_field1': '80'
    };
    var validationData = {};
    ValidationService.validate(percentageElements, elemData, validationData);
    expect(validationData.percentage_field1).toEqual({});
  });

  it('should correctly validate an invalid percentage field greater than 100', function() {
    var elemData = {
      'percentage_field1': '180'
    };
    var validationData = {};
    ValidationService.validate(percentageElements, elemData, validationData);
    expect(validationData.percentage_field1).toEqual('Invalid percentage');
  });

  it('should correctly validate that an negative percentage field is invalid', function() {
    var elemData = {
      'percentage_field1': '-20'
    };
    var validationData = {};
    ValidationService.validate(percentageElements, elemData, validationData);
    expect(validationData.percentage_field1).toEqual('Invalid percentage');
  });

  it('should correctly validate that an string percentage field is invalid', function() {
    var elemData = {
      'percentage_field1': '9abc'
    };
    var validationData = {};
    ValidationService.validate(percentageElements, elemData, validationData);
    expect(validationData.percentage_field1).toEqual('Invalid percentage');
  });

  var integerElements = {
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
        'name': 'integer_field1',
        'order': 1,
        'element_type': 'integer',
        'required': true,
        'default': null,
        'human': 'Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      }]
  }

  it('should correctly validate that a valid integer field is valid', function() {
    var elemData = {
      'integer_field1': '80'
    };
    var validationData = {};
    ValidationService.validate(integerElements, elemData, validationData);
    expect(validationData.integer_field1).toEqual({});
  });

  it('should correctly validate an invalid integer field greater that is a float', function() {
    var elemData = {
      'integer_field1': '180.43'
    };
    var validationData = {};
    ValidationService.validate(integerElements, elemData, validationData);
    expect(validationData.integer_field1).toEqual('Invalid number');
  });

  it('should correctly validate that an negative integer field is valid', function() {
    var elemData = {
      'integer_field1': '-20'
    };
    var validationData = {};
    ValidationService.validate(integerElements, elemData, validationData);
    expect(validationData.integer_field1).toEqual({});
  });

  it('should correctly validate that an string integer field is invalid', function() {
    var elemData = {
      'integer_field1': '9abc'
    };
    var validationData = {};
    ValidationService.validate(integerElements, elemData, validationData);
    expect(validationData.integer_field1).toEqual('Invalid number');
  });

  var emailElements = {
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
        'name': 'email_field1',
        'order': 1,
        'element_type': 'email',
        'required': true,
        'default': null,
        'human': 'Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      }]
  }

  it('should correctly validate that a valid email field is valid', function() {
    var elemData = {
      'email_field1': 'name@example.com'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual({});
  });

  it('should correctly validate that a valid email field is valid even with a plus sign', function() {
    var elemData = {
      'email_field1': 'name+last@example.com'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual({});
  });

  it('should correctly validate that a valid email field is valid even with a . in local', function() {
    var elemData = {
      'email_field1': 'name.LAST@example.com'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual({});
  });

  it('should correctly validate that an email field without @ or . is invalid', function() {
    var elemData = {
      'email_field1': 'abc'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual('Invalid email address');
  });

  it('should correctly validate that an email field without . is invalid', function() {
    var elemData = {
      'email_field1': 'abc@'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual('Invalid email address');
  });

  it('should correctly validate that an email field with two @ is invalid', function() {
    var elemData = {
      'email_field1': 'abc@@abc.com'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual('Invalid email address');
  });

  it('should correctly validate that an email field with two consecutive . is invalid', function() {
    var elemData = {
      'email_field1': 'abc@bdc..com'
    };
    var validationData = {};
    ValidationService.validate(emailElements, elemData, validationData);
    expect(validationData.email_field1).toEqual('Invalid email address');
  });

  var zipElements = {
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
        'name': 'zip_field1',
        'order': 1,
        'element_type': 'zip',
        'required': true,
        'default': null,
        'human': 'Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      }]
  }

  it('should correctly validate that a valid 5 digit zip field is valid', function() {
    var elemData = {
      'zip_field1': '11111'
    };
    var validationData = {};
    ValidationService.validate(zipElements, elemData, validationData);
    expect(validationData.zip_field1).toEqual({});
  });

  it('should correctly validate that a valid 5+4 digit zip field is valid', function() {
    var elemData = {
      'zip_field1': '11111-1111'
    };
    var validationData = {};
    ValidationService.validate(zipElements, elemData, validationData);
    expect(validationData.zip_field1).toEqual({});
  });

  it('should correctly validate that an zip field with letters is invalid', function() {
    var elemData = {
      'zip_field1': 'abc-d2342'
    };
    var validationData = {};
    ValidationService.validate(zipElements, elemData, validationData);
    expect(validationData.zip_field1).toEqual('Invalid zip code');
  });

  it('should correctly validate that an zip field with insufficient length is invalid', function() {
    var elemData = {
      'zip_field1': '1111-1111'
    };
    var validationData = {};
    ValidationService.validate(zipElements, elemData, validationData);
    expect(validationData.zip_field1).toEqual('Invalid zip code');
  });

  var phoneElements = {
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
        'name': 'phone_field1',
        'order': 1,
        'element_type': 'phone',
        'required': true,
        'default': null,
        'human': 'Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      }]
  }

  it('should correctly validate a valid seven digit phone number', function() {
    var elemData = {
      'phone_field1': '1234567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid space separated seven digit phone number', function() {
    var elemData = {
      'phone_field1': '123 4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid hyphen separated seven digit phone number', function() {
    var elemData = {
      'phone_field1': '123-4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid period separated seven digit phone number', function() {
    var elemData = {
      'phone_field1': '123.4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid ten digit phone number', function() {
    var elemData = {
      'phone_field1': '1111234567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid space separated ten digit phone number', function() {
    var elemData = {
      'phone_field1': '111 123 4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid space separated ten digit phone number with parens', function() {
    var elemData = {
      'phone_field1': '(111) 123 4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid hyphen separated ten digit phone number', function() {
    var elemData = {
      'phone_field1': '111-123-4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid hyphen separated ten digit phone number with parens', function() {
    var elemData = {
      'phone_field1': '(111) 123-4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid period separated ten digit phone number', function() {
    var elemData = {
      'phone_field1': '111.123.4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid period separated ten digit phone number with parens', function() {
    var elemData = {
      'phone_field1': '(111) 123.4567'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid ten digit phone number with an "ext" extension', function() {
    var elemData = {
      'phone_field1': '1111234567 ext 1234'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid ten digit phone number with an "x" extension', function() {
    var elemData = {
      'phone_field1': '1111234567x123'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate a valid hyphen separated ten digit phone number with parens and extension', function() {
    var elemData = {
      'phone_field1': '(111) 123-4567 EXT 432'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual({});
  });

  it('should correctly validate that a phone number with six digits is invalid', function() {
    var elemData = {
      'phone_field1': '123456'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual('Invalid phone number');
  });

  it('should correctly validate that a phone number with letters is invalid', function() {
    var elemData = {
      'phone_field1': 'abc'
    };
    var validationData = {};
    ValidationService.validate(phoneElements, elemData, validationData);
    expect(validationData.phone_field1).toEqual('Invalid phone number');
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
    expect(validationData).toEqual({'bool_field1': {  }, 'str_field1' : {  }});
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
      'bool_field1' : true,
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
        'required': 'xor str_field1',
        'validation': null,
        'validation_msg': null,
        'default': null,
        'human': 'Please check this box.',
        'help': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      },
      {
        'id': 6,
        'name': 'str_field1',
        'order': 2,
        'element_type': 'med_str',
        'required': 'xor bool_field1',
        'validation': null,
        'validation_msg': null,
        'default': null,
        'human': 'Reason for refusing to check the box',
        'help': null,
        'multiplicity': null,
        'children': []
      },
        {
        'id': 7,
        'name': 'bool_field2',
        'order': 3,
        'element_type': 'med_str',
        'required': 'unless str_field2',
        'validation': null,
        'validation_msg': null,
        'default': null,
        'human': 'Consider checking this box.',
        'help': null,
        'multiplicity': null,
        'children': []
      },
        {
        'id': 8,
        'name': 'str_field2',
        'order': 4,
        'element_type': 'med_str',
        'required': 'unless bool_field2',
        'validation': null,
        'validation_msg': null,
        'default': null,
        'human': 'Thoughts on not checking the box above',
        'help': null,
        'multiplicity': null,
        'children': []
      }
    ]
  };

  it('should pass the `unless` requirement if first item is true', function() {
    var elemData = {
      'bool_field1': true,
      'str_field1': '',
      'bool_field2' : true,
      'str_field2': ''
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  it('should pass the `unless` requirement if second item is true', function() {
    var elemData = {
      'bool_field1': true,
      'str_field1': '',
      'bool_field2' : false,
      'str_field2': ' i believe in free will'
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  it('should pass the `unless` requirement if both items are true', function() {
    var elemData = {
      'bool_field1': true,
      'str_field1': '',
      'bool_field2' : true,
      'str_field2': ' i believe in free will'
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  it('should fail the `unless` requirement if neither item is true', function() {
    var elemData = {
      'bool_field1': true,
      'str_field1': '',
      'bool_field2' : false,
      'str_field2': ''
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field2).toEqual('One of these fields is required.');
  });

  it('should pass the `xor` requirement if first item is true', function() {
    var elemData = {
      'bool_field1' : true,
      'str_field1': '',
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  it('should pass the `xor` requirement if second item is true', function() {
    var elemData = {
      'bool_field1' : false,
      'str_field1': ' i believe in free will',
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual({ });
  });

  it('should fail the `xor` requirement if neither item is true', function() {
    var elemData = {
      'bool_field1' : false,
      'str_field1': '',
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual('Exactly one of these fields is required.');
  });

  it('should fail the `xor` requirement if both items are true', function() {
    var elemData = {
      'bool_field2': true,
      'str_field2': ''
    };
    var validationData = {};
    ValidationService.validate(interdependent_elements, elemData, validationData);
    expect(validationData.bool_field1).toEqual('Exactly one of these fields is required.');
    // except really that's not what the message should be
  });

});
