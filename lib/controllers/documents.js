'use strict';

// GET on api/documents
exports.getList = function(req, res) {
  req.storage.listing(function(err, arr) { 
    if (err !== undefined) {
      console.log(err);
    }
    //console.log(arr);
    var listing = { 'files':[] };
    var entries = arr[0].split('\n');
    for (var i = 0; i < entries.length; i++) {
      var data = JSON.parse(entries[i]);
      listing.files.push({
        "id": data.id,
        "name": data.name,
        "uploaded": data.stamp,
        "type": data.type
      });
    }
    //console.log(listing);
    res.json(listing);
  });
};

// POST on api/documents
exports.add = function(req, res) {
  //console.log(req.files);
  var id = req.storage.insert(req.files.file.originalname, req.files.file.path);
  res.json({"id":id, "status":"success"});
};

// GET on api/documents/:id
exports.getSingle = function(req, res) {
  console.log(req.params.id);
  req.storage.stat(req.params.id, function(err, stat) {
    res.set({
      'Content-Type':  stat.type,
      'Content-Length': stat.length
    });
    //res.download(stat.name);
    req.storage.pipe(req.params.id, req, res, stat.name);
    //res.json({"file": "Nothing here"});
  });
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






