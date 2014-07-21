'use strict';

// GET on api/documents
exports.getList = function(req, res) {
  res.json([
    {
      "id": "1",
      "name": "resumeA.pdf",
      "uploaded": 1405708885,
      "keywords": ["resume", "prop123"]
    },
    {
      "id": "2",
      "name": "resumeB.pdf",
      "uploaded": 1405708888,
      "keywords": ["resume", "prop123"]
    }]);
};

// POST on api/documents
exports.add = function(req, res) {
  console.log("Document Upload!");
  res.json({"id":3, "status":"success"});
};

// GET on api/documents/:id
exports.getSingle = function(req, res) {
  res.json({"file": "Nothing here"});
};

// PUT on api/documents/:id
exports.replace = function(req, res) {
  console.log("Document PUT:" + req.params.id);
};

// PATCH on api/documents/:id
exports.update = function(req, res) {
  console.log("Document PATCH:" + req.params.id);
};


// DELETE on api/documents/:id
exports.delete = function(req, res) {
  console.log("Document DELETE:" + req.params.id);
};






