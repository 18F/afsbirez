'use strict';

describe('Directive: UploadDirective', function () {

  var $compile, $rootScope, template,
    $window,
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
    'title': 'Temperature/Heat Flux Imaging of an Aerodynamic Model in High-Temperature, Continuous-Flow Wind Tunnels',
    'topic': 8,
    'workflow': 1
  };

  // Initialize the controller and a mock scope
  beforeEach(module('sbirezApp'));
  beforeEach(module('static/views/partials/elements/upload.html'));

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
  xit('should load successfully', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var element = {
      ask_if: null,
      children: [],
      default: null,
      element_type: "file_upload",
      help: null,
      human: "Upload Technical Volume",
      id: 47,
      multiplicity: null,
      name: "tech_volume_upload",
      order: 6,
      required: false,
      validation: null,
      validation_msg: null
    };
    var storage = 1;
    var formElement = angular.element('<div upload="element" proposal="1" storage="storage"></div>');
    $compile(formElement)($rootScope);
    $rootScope.$apply(function() {
      $rootScope.element = element;
      $rootScope.storage = storage;
    });
    console.log('element', formElement);
    //$httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    //$httpBackend.expectGET('api/v1/elements/1/').respond(elementData);
    $httpBackend.flush();
    // validate title
    var title = formElement.find('h2');
    expect(title.text()).toBe('Test Workflow');

    // validate that the child elements create workflow elements
    var elements = formElement.find('div.workflow-element div');
    expect(elements.length).toBe(3);
    expect(elements.eq(0).attr('text')).toBeDefined();
    expect(elements.eq(1).attr('str')).toBeDefined();
    expect(elements.eq(2).attr('bool')).toBeDefined();

    // validate that there is a start button
    var startButton = formElement.find('button#start');
    expect(startButton.length).toBe(1);

    // validate that there is a save button
    var saveButton = formElement.find('button#save_state');
    expect(saveButton.length).toBe(1);
  });

  xit('should load nested workflows', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    expect($rootScope.$$childTail.workflows.length).toBe(3);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(1);
    expect($rootScope.$$childTail.nextWorkflow).toBeNull();
    expect($rootScope.$$childTail.backWorkflow).toBeNull();
  });

  xit('jumpTo changes state correctly if given valid id', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    $rootScope.$$childTail.jumpTo(2);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(2);
    expect($rootScope.$$childTail.nextWorkflow).toBe(3);
    expect($rootScope.$$childTail.backWorkflow).toBe(1);
  });

  xit('jumpTo does not change state if given invalid id', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    $rootScope.$$childTail.jumpTo(20);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(1);
    expect($rootScope.$$childTail.nextWorkflow).toBeNull();
    expect($rootScope.$$childTail.backWorkflow).toBeNull();
  });

  xit('showBackButton and showNextButton state are true when they are expected to be', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    $rootScope.$$childTail.jumpTo(2);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(2);
    expect($rootScope.$$childTail.showBackButton()).toBe(true);
    expect($rootScope.$$childTail.showNextButton()).toBe(true);
  });

  xit('showBackButton and showNextButton state are false when they are expected to be', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(1);
    expect($rootScope.$$childTail.showBackButton()).toBe(false);
    expect($rootScope.$$childTail.showNextButton()).toBe(false);
  });

  xit('showBackButton and showNextButton state are false when they are expected to be', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    $rootScope.$$childTail.jumpTo(3);
    expect($rootScope.$$childTail.currentWorkflow.id).toBe(3);
    expect($rootScope.$$childTail.showBackButton()).toBe(true);
    expect($rootScope.$$childTail.showNextButton()).toBe(false);
  });

  xit('saveData attempts to save the data via the ProposalService', function() {
    $window.sessionStorage.userid = 1;
    AuthenticationService.setAuthenticated(true);
    var formElement = angular.element('<div workflow ng-attr-proposal-id="1"></div>');
    $compile(formElement)($rootScope);
    $httpBackend.expectGET('api/v1/proposals/1/').respond(propData);
    $httpBackend.expectGET('api/v1/elements/1/').respond(nestedElementData);
    $httpBackend.flush();
    $rootScope.$$childTail.saveData();
    $httpBackend.expectPATCH('api/v1/proposals/1/partial/').respond(200);
    $httpBackend.flush();
  });
});
