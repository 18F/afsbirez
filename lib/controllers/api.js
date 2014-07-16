'use strict';

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 10
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Karma',
      info : 'Spectacular Test Runner for JavaScript.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};

exports.formsList = function(req, res) {
  res.json([
    {
      "id": "1",
      "name": "DoD SBIR Organization Application",
      "description": "Application for an organization to allow them to submit a SBIR proposal for the DoD."
    },
    {
      "id": "2",
      "name": "SBIR Organization Application",
      "description": "Application for an organization to allow them to submit a proposal for a non-DoD SBIR."
    },
    {
      "id": "3",
      "name": "Cost Volume",
      "description": "Cost portion of the SBIR proposal."
    }
  ]);
};

exports.forms = function(req, res) {
  console.log('Form ID:' + req.params.id);
  var jsonData = [];
  if (req.params.id === '1') {
    jsonData = [
      {
        "key": "firstName",
        "type": "text",
        "label": "First Name",
        "placeholder": "Dave"
      },
      {
        "key": "lastName",
        "type": "text",
        "label": "Last Name",
        "placeholder": "Doe"
      },
      {
        "key": "email",
        "type": "email",
        "placeholder": "janedoe@gmail.com"
      }
    ];
  }
  else if (req.params.id === '2') {
    jsonData = [];
  }
  else if (req.params.id === '3') {
    jsonData = [
      {
        "key": "lastName",
        "type": "text",
        "label": "Last Name",
        "placeholder": "Last Name"
      }
    ];
  }

  res.json(jsonData);
};

exports.formsPost = function(req, res) {
  console.log("Form POST:" + req.params.id);
};
