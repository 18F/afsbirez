'use strict';

describe('Service: ProposalService', function () {

  // load the controller's module
  beforeEach(module('sbirezApp'));

  var $window,
    ProposalService,
    $httpBackend,
    $rootScope,
    AuthenticationService,
    ValidationService;

  var propData = {
    'owner': '1',
    'id':1,
    'firm': null,
    'workflow': 1,
    'topic': 1,
    'title': 'title',
    'data':{
      'nestedworkflow': {
        'nested_workflow1': {
          'bool_field1': 'true'
        }
      }
    }
  };

  var responseProp = {
    'owner': '1',
    'firm': null,
    'workflow': 1,
    'topic': 1,
    'title': 'title',
    'data':'{\"nestedworkflow\":{\"nested_workflow1\":{\"bool_field1\":\"true\"},\"nested_workflow3\":{}}}'
  };

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

  var boolField = {
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
    'children': [],
    'parentId': 2
  };

  var dollarField = {
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
    'children': [],
    'parentId': 2
  };

  var calculatedField = {
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
    'children': [],
    'parentId': 2
  };

  var boolField2 = {
    'id': 5,
    'name': 'bool_field2',
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
    'children': [],
    'parentId': 3
  };

  var dollarField2 = {
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
    'children': [],
    'parentId': 9
  };

  var dynamicLineItem = {
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
    'parentId': 8,
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
        'children': [],
        'parentId': 9
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
        'children': [],
        'parentId': 9
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
        'children': [],
        'parentId': 9
      }
    ]
  };

  var topicData = {
    'id':1,
    'topic_number':'AF151-100',
    'title':'title',
    'agency':'AirForce',
    'program':'SBIR',
    'description':'The description',
    'objective':'The objective',
    'solicitation':{
      'id':1,
      'name':'DoD SBIR 2015.1',
      'pre_release_date':'2014-12-12T05:00:00Z',
      'proposals_begin_date':'2015-01-15T05:00:00Z',
      'proposals_end_date':'2015-02-18T05:00:00Z',
      'element':1,
      'days_to_close':0,
      'status':'Closed'
    },
    'references':[
      {'reference':'1. Reference 1'},
      {'reference':'2. Reference 2'}],
    'phases':[
      {'phase':'PHASE I:  Develop.'},
      {'phase':'PHASE II'},
      {'phase':'PHASE III'}],
    'keywords':[
      {'keyword':'thermographic phosphors'},
      {'keyword':'temperature sensitive paint'}],
    'areas':[{'area':'Air Platform'}],
    'saved':true,
    'proposal':1
  };

  var successfulLoad = function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.load(1);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(elemData);
    $httpBackend.expectGET('api/v1/topics/1/').respond(topicData);
    $httpBackend.flush();
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, _ProposalService_, _$window_, _$rootScope_, _AuthenticationService_, _ValidationService_) {
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    AuthenticationService = _AuthenticationService_;
    ValidationService = _ValidationService_;
    $httpBackend.whenGET('static/views/partials/main.html').respond({});
    ProposalService = _ProposalService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // create
  it('should post to the backend with the expected default values if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.create(1, 'title', 6);
    var propData = {
      'owner': '1',
      'firm': null,
      'workflow': 6,
      'topic': 1,
      'title': 'title',
      'data':'{}'
    };
    $httpBackend.expect('POST', 'api/v1/proposals/partial/', propData).respond(200);
    $httpBackend.flush();
  });

  it('should open the login dialog if not authenticated on create', function() {
    ProposalService.create(1, 'title', 1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // remove
  it('should send a delete request if authed', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.remove(1);
    $httpBackend.expectDELETE('api/v1/proposals/1/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on remove', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.remove(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // list
  it('should return a list of proposals if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.list();
    $httpBackend.expectGET('api/v1/proposals/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on list', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.list();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // get
  it('should return a proposal if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.get(1);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on get', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.get(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // complete
  it('should post a proposal if one loaded and the user is authenticated', function() {
    successfulLoad();
    ProposalService.complete();
    $httpBackend.expect('PATCH', 'api/v1/proposals/1/', {'data':responseProp.data}).respond(200);
    $httpBackend.flush();
  });

  it('should return an error if no proposal is loaded and the user is authenticated on complete', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.complete().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });
  
  it('should open a login dialog if not authed on complete', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.complete();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // saveData
  it('should save data without validating if requested and if authenticated', function() {
    successfulLoad();
    ProposalService.saveData(false);
    $httpBackend.expect('PUT', 'api/v1/proposals/1/partial/', responseProp).respond(200);
    $httpBackend.flush();
  });

  it('should save data and validate if requested and if authenticated', function() {
    successfulLoad();
    ProposalService.saveData(true);
    $httpBackend.expect('PATCH', 'api/v1/proposals/1/', responseProp).respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on save', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.saveData();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error if no proposal is loaded and the user is authenticated on save', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.saveData().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // saveTitle
  it('should return a proposal if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var title = 'Title';
    ProposalService.saveTitle(1, title);
    $httpBackend.expect('PATCH', 'api/v1/proposals/1/partial/', {'title': title}).respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on get', function() {
    AuthenticationService.setAuthenticated(false);
    var title = 'Title';
    ProposalService.saveTitle(1, title);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // submit
  it('should submit if authenticated', function() {
    successfulLoad();
    ProposalService.submit();
    $httpBackend.expect('POST', 'api/v1/proposals/1/submit/').respond(200);
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on submit', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.submit();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it('should return an error if no proposal is loaded and the user is authenticated on submit', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.submit().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  // load
  it('should load data if authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    ProposalService.load(1);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(elemData);
    $httpBackend.expectGET('api/v1/topics/1/').respond(topicData);
    $httpBackend.flush();
  });

  it('should not reload data if data is already loaded', function() {
    successfulLoad();
    ProposalService.load(1);
  });

  it('should return an error if an invalid proposal is requested', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.load(523).then(goodHandler, errorHandler);
    $httpBackend.expectGET('api/v1/proposals/523/').respond(404);
    $httpBackend.flush();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on load', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.load(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // unload
  it('should unload a proposal one is loaded and if authenticated', function() {
    successfulLoad();
    ProposalService.unload();
    ProposalService.load(1);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(elemData);
    $httpBackend.expectGET('api/v1/topics/1/').respond(topicData);
    $rootScope.$digest();
    $httpBackend.flush();
  });

  it('should not return an error if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.unload().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(goodHandler).toHaveBeenCalled();    
    $httpBackend.flush();
  });

  it('should open a login dialog if not authed on unload', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.unload();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // getWorkflow
  it('should return an element if a workflow is loaded and user is authenticated', function() {
    successfulLoad();
    var wf;
    var goodHandler = jasmine.createSpy('success').andCallFake(function(data) { wf = data;});
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getWorkflow(2).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(goodHandler).toHaveBeenCalled();
    expect(wf.current.name).toBe('nested_workflow1');
    expect(wf.previous).toBeNull();
    expect(wf.next).toBe(3);
  });

  it('should return an error if no workflow is loaded and the user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getWorkflow(2).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
    $httpBackend.flush();
  });

  it('should return an error if an invalid element is chosen when a workflow is loaded and the user is authenticated', function() {
    successfulLoad();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getWorkflow(2323).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on getWorkflow', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.getWorkflow(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // getOverview
  it('should return an overview if a proposal is loaded and user is authenticated', function() {
    successfulLoad();
    var ov;
    var goodHandler = jasmine.createSpy('success').andCallFake(function(data) { ov = data;});
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getOverview().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(goodHandler).toHaveBeenCalled();
    expect(ov[0].id).toBe(2);
    expect(ov[0].complete).toBe(true);
    expect(ov[1].id).toBe(3);
    expect(ov[1].complete).toBe(false);
  });

  it ('should return an error on getOverview if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    var ov;
    var goodHandler = jasmine.createSpy('success').andCallFake(function(data) { ov = data;});
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getOverview().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on getOverview', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.getOverview(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // register
  it ('should return the data value on successful registration', function() {
    successfulLoad();    
    var result = ProposalService.register(boolField, null, null);
    $rootScope.$digest();
    expect(result).toBe('true');
  });

  it ('should return the an empty object value on successful registration if no value exists', function() {
    successfulLoad();    
    var result = ProposalService.register(boolField2, null, null);
    $rootScope.$digest();
    expect(result).toEqual({});
  });

  it ('should return an error on register if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.register(boolField, null, null).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on register', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.getOverview(1);
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  it ('should return the data value on successful registration with a validation callback', function() {
    successfulLoad();
    var validationCallback = function() {};

    var result = ProposalService.register(boolField, validationCallback, null);
    $rootScope.$digest();
    expect(result).toBe('true');
  });

  it ('should return the data value on successful registration with a askif callback', function() {
    successfulLoad();
    var askifCallback = function() {};
    var result = ProposalService.register(boolField, null, askifCallback);
    $rootScope.$digest();
    expect(result).toBe('true');
  });

  it ('should call the askif callback if the field requests it', function() {
    successfulLoad();
    var callbackData;
    var askifCallback = function(data) {callbackData = data;};
    ProposalService.register(boolField, null, null);
    ProposalService.register(dollarField, null, askifCallback);
    $rootScope.$digest();
    expect(callbackData).toBe('true');
  });

  it ('should return the data value on successful registration with a calculated field', function() {
    successfulLoad();
    var validationData;
    var validationCallback = function(data) {validationData = data;};
    var result = ProposalService.register(calculatedField, validationCallback, null);
    $rootScope.$digest();
    expect(result).toEqual({});
  });

  // apply
  it ('should update the saved data on success', function() {
    successfulLoad();
    ProposalService.register(boolField, null, null);
    ProposalService.register(dollarField, null, null);
    var storage = 12.99;
    ProposalService.apply(dollarField, storage);
    ProposalService.saveData();
    var responseData = {'owner':'1','firm':null,'workflow':1,'topic':1,'title':'title','data':'{\"nestedworkflow\":{\"nested_workflow1\":{\"bool_field1\":\"true\",\"dollar_field1\":12.99},\"nested_workflow3\":{}}}'};
    $httpBackend.expect('PUT', 'api/v1/proposals/1/partial/', responseData).respond(200);
    $httpBackend.flush();
  });

  it ('should update calculated fields on success, if needed', function() {
    successfulLoad();
    var callbackData;
    var validationCallback = function(data) {callbackData = data;};

    ProposalService.register(boolField, null, null);
    ProposalService.register(dollarField, null, null);
    ProposalService.register(calculatedField, validationCallback, null);
    var storage = 12.99;
    ProposalService.apply(dollarField, storage);
    $rootScope.$digest();
    expect(callbackData).toBe(12.99 * 5);
  });

  it ('should call the askif callback if an apply changes the value', function() {
    successfulLoad();
    var callbackData;
    var askifCallback = function(data) {callbackData = data;};
    ProposalService.register(boolField, null, null);
    ProposalService.register(dollarField, null, askifCallback);
    $rootScope.$digest();
    var storage = false;
    ProposalService.apply(boolField, storage);
    $rootScope.$digest();
    expect(callbackData).toBe(false);
  });

  it('should open a login dialog if not authed on apply', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.apply();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // validate
  it ('should call the ValidationService on success', function() {
    successfulLoad();
    var validationHandler = spyOn(ValidationService, 'validate');
    ProposalService.validate();
    $rootScope.$digest();
    expect(validationHandler).toHaveBeenCalled();

  });

  it ('should call the validation callbacks of registered fields that fail validation', function() {
    successfulLoad();
    var callbackDataUnset;
    var callbackDataSet;
    var validationCallbackSkipped = function(data) {callbackDataUnset = data;};
    var validationCallbackCalled = function(data) {callbackDataSet = data;};
    ProposalService.register(boolField, validationCallbackSkipped, null);
    ProposalService.register(boolField2, validationCallbackCalled, null);
    $rootScope.$digest();
    ProposalService.validate();
    $rootScope.$digest();
    expect(callbackDataSet).toBe('This field is required');
    expect(callbackDataUnset).toBe('');
  });

  it ('should return an error on validate if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.validate().then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on validate', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.validate();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });


  // getDynamicCount
  it ('should return the correct number of dynamic fields with a valid dynamic line item', function() {
    successfulLoad();
    ProposalService.register(dynamicLineItem, null, null);
    $rootScope.$digest();
    var value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(0);
  });

  it ('should return an error on getDynamicCount if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getDynamicCount(dynamicLineItem).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it ('should return an error if the field is not a dynamic line item', function() {
    successfulLoad();
    ProposalService.register(boolField, null, null);
    $rootScope.$digest();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.getDynamicCount(boolField).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it ('should return the correct number after an item is added', function() {
    successfulLoad();
    ProposalService.register(dynamicLineItem, null, null);
    ProposalService.register(dollarField2, null, null, '0');
    $rootScope.$digest();
    var value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(1);
    ProposalService.addDynamicItem(dynamicLineItem);
    ProposalService.register(dollarField2, null, null, '1');
    value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(2);
  });

  it ('should return the correct number after an item is removed', function() {
    successfulLoad();
    ProposalService.register(dynamicLineItem, null, null);
    ProposalService.register(dollarField2, null, null, '0');
    $rootScope.$digest();
    var value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(1);
    ProposalService.addDynamicItem(dynamicLineItem);
    ProposalService.register(dollarField2, null, null, '1');
    value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(2);
    ProposalService.removeDynamicItem(dynamicLineItem,'1');
    value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(1);
  });

  it('should open a login dialog if not authed on getDynamicCount', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.getDynamicCount();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });


  // addDynamicItem
  it ('should add an item successfully', function() {
    successfulLoad();
    ProposalService.register(dynamicLineItem, null, null);
    ProposalService.register(dollarField2, null, null, '0');
    $rootScope.$digest();
    var value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(1);
    ProposalService.addDynamicItem(dynamicLineItem);
    ProposalService.register(dollarField2, null, null, '1');
    value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(2);
  });

  it ('should return an error on addDynamicItem if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.addDynamicItem(dynamicLineItem).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it ('should return an error on addDynamicItem if the field is not a dynamic line item', function() {
    successfulLoad();
    ProposalService.register(boolField, null, null);
    $rootScope.$digest();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.addDynamicItem(boolField).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on addDynamicItem', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.addDynamicItem();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });

  // removeDynamicItem  
  it ('should remove an item successfully', function() {
    successfulLoad();
    ProposalService.register(dynamicLineItem, null, null);
    ProposalService.register(dollarField2, null, null, '0');
    $rootScope.$digest();
    var value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(1);
    ProposalService.addDynamicItem(dynamicLineItem);
    ProposalService.register(dollarField2, null, null, '1');
    value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(2);
    ProposalService.removeDynamicItem(dynamicLineItem,'1');
    value = ProposalService.getDynamicCount(dynamicLineItem);
    expect(value).toBe(1);
  });

  it ('should return an error on removeDynamicItem if no proposal is loaded and user is authenticated', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    $httpBackend.flush();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.removeDynamicItem(dynamicLineItem).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it ('should return an error on removeDynamicItem if the field is not a dynamic line item', function() {
    successfulLoad();
    ProposalService.register(boolField, null, null);
    $rootScope.$digest();
    var goodHandler = jasmine.createSpy('success');
    var errorHandler = jasmine.createSpy('error');
    ProposalService.removeDynamicItem(boolField).then(goodHandler, errorHandler);
    $rootScope.$digest();
    expect(errorHandler).toHaveBeenCalled();
  });

  it('should open a login dialog if not authed on removeDynamicItem', function() {
    AuthenticationService.setAuthenticated(false);
    ProposalService.removeDynamicItem();
    $httpBackend.expectGET('static/views/partials/login.html').respond(200);
    $httpBackend.flush();
  });
});
