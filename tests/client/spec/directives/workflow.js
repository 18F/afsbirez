'use strict';

describe('Directive: WorkflowDirective', function () {

  var $compile, $rootScope, template,
    $window,
    ProposalService,
    $httpBackend,
    AuthenticationService,
    propData,
    elementData,
    nestedElementData;

  propData = {
    'data': '{}',
    'firm': 2,
    'id': 3,
    'owner': 3,
    'submitted_at': '2015-04-14T00:48:55.023678Z',
    'title': 'Proposal for Test Workflow',
    'topic': 8,
    'workflow': 1
  };

  elementData = {
    'id': 1,
    'name': 'testworkflow',
    'order': 1,
    'element_type': 'workflow',
    'required': false,
    'default': null,
    'human': 'Test Workflow',
    'help': null,
    'validation': null,
    'validation_msg': null,
    'ask_if': null,
    'multiplicity': null,
    'children': [
      {
        'id': 2,
        'name': 'text_field',
        'order': 1,
        'element_type': 'text',
        'required': false,
        'default': null,
        'human': 'Text Field',
        'help': null,
        'validation': null, 
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      },
      {
        'id': 3,
        'name': 'int_field',
        'order': 2,
        'element_type': 'int',
        'required': false,
        'default': null,
        'human': 'Integer Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      },
      {
        'id': 4,
        'name': 'bool_field',
        'order': 1,
        'element_type': 'bool',
        'required': false,
        'default': null,
        'human': 'Bool Field',
        'help': null,
        'validation': null,
        'validation_msg': null,
        'ask_if': null,
        'multiplicity': null,
        'children': []
      }
    ]
  };

  nestedElementData = {
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
            'name': 'bool_field',
            'order': 1,
            'element_type': 'bool',
            'required': false,
            'default': null,
            'human': 'Bool Field',
            'help': null,
            'validation': null,
            'validation_msg': null,
            'ask_if': null,
            'multiplicity': null,
            'children': []
          }]
      },
      {
        'id': 3,
        'name': 'nested_workflow2',
        'order': 1,
        'element_type': 'group',
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
            'name': 'bool_field',
            'order': 1,
            'element_type': 'bool',
            'required': false,
            'default': null,
            'human': 'Bool Field',
            'help': null,
            'validation': null,
            'validation_msg': null,
            'ask_if': null,
            'multiplicity': null,
            'children': []
          }]
      }
    ]
  };

  // Initialize the controller and a mock scope
  beforeEach(module('sbirezApp'));
  beforeEach(module('static/views/partials/workflow.html'));

  beforeEach(inject(function(_$compile_,_$rootScope_, _$httpBackend_, _$window_, _AuthenticationService_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    AuthenticationService = _AuthenticationService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    $httpBackend.whenGET('static/views/partials/search.html').respond({});
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // load successfully 
  it('should load successfully', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(elementData);
    $httpBackend.expectGET('api/v1/topics/8/').respond(elementData);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.flush();
    // validate title
    var title = formElement.find('header.proposal-banner div.wrap h1');
    expect(title.text()).toBe('Proposal for Test Workflow');

    // validate that the child elements create workflow elements
    var elements = formElement.find('main form').children('div.ng-scope');
    expect(elements.length).toBe(3);
    expect(elements.eq(0).children(0).attr('text')).toBeDefined();
    expect(elements.eq(1).children(0).attr('str')).toBeDefined();
    expect(elements.eq(2).children(0).attr('bool')).toBeDefined();
  });

  var loadNestedWorkflows = function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.expectGET('api/v1/topics/8/').respond(nestedElementData);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.flush();
    return formElement;
  }

  xit('should load nested workflows', function() {
    var formElement = loadNestedWorkflows(); 
    expect($rootScope.$$childTail.workflows.length).toBe(3);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(1);
    expect($rootScope.$$childTail.nextWorkflow).toBeNull();
    expect($rootScope.$$childTail.backWorkflow).toBeNull();
  });

  it('jumpTo changes state correctly if given valid id', function() {
    var formElement = loadNestedWorkflows(); 
    $rootScope.$$childTail.jumpTo(2);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(2);
    expect($rootScope.$$childTail.nextWorkflow).toBe(3);
    expect($rootScope.$$childTail.backWorkflow).toBeNull();
  });

  it('jumpTo does not change state if given invalid id', function() {
    var formElement = loadNestedWorkflows(); 
    $rootScope.$$childTail.jumpTo(20);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(1);
    expect($rootScope.$$childTail.nextWorkflow).toBe(2);
    expect($rootScope.$$childTail.backWorkflow).toBeNull();
  });

  it('showBackButton and showNextButton state are true when they are expected to be', function() {
    var formElement = loadNestedWorkflows(); 
    $rootScope.$$childTail.jumpTo(2);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(2);
    expect($rootScope.$$childTail.showBackButton()).toBe(false);
    expect($rootScope.$$childTail.showNextButton()).toBe(true);
  });

  it('showBackButton and showNextButton state are false when they are expected to be', function() {
    var formElement = loadNestedWorkflows(); 
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(1);
    expect($rootScope.$$childTail.showBackButton()).toBe(false);
    expect($rootScope.$$childTail.showNextButton()).toBe(true);
  });

  it('showBackButton and showNextButton state are false when they are expected to be', function() {
    var formElement = loadNestedWorkflows(); 
    $rootScope.$$childTail.jumpTo(3);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(3);
    expect($rootScope.$$childTail.showBackButton()).toBe(true);
    expect($rootScope.$$childTail.showNextButton()).toBe(false);
  });

  xit('saveData attempts to save the data via the ProposalService', function() {
    var formElement = loadNestedWorkflows(); 
    $rootScope.$$childTail.saveData();
    $httpBackend.expectPATCH('api/v1/proposals/3/').respond(200);
    $httpBackend.flush();
  });
});
