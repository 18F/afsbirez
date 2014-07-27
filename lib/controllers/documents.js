'use strict';

// GET on api/documents
exports.getList = function(req, res) {
  console.log('user:' + req.user + req.db);
  req.db.all("SELECT id, metadata FROM files WHERE userid = ?1", req.user.id, function (err, rows) {
    var listing = { 'files':[] };
    for (var i = 0; i < rows.length; i++) {
      console.log(rows[i]);
      var data = JSON.parse(rows[i].metadata);
      data.id = rows[i].id;
      listing.files.push(data);
    }
    res.json(listing);
  });
};

// POST on api/documents
exports.add = function(req, res) {
  console.log(req.files);
  console.log(req.user.id);
  var config = {
        "name": req.files.file.originalname,
        "uploaded": new Date().getTime()
      };

  req.db.run("INSERT INTO files (userid, metadata, filepath) VALUES(?1, ?2, ?3)", [req.user.id, JSON.stringify(config), req.files.file.path], function(err) {
    console.log(this.lastID);
    console.log(err);
    res.json({"id": this.lastID, "status":"success"});
  });
};

// GET on api/documents/:id
exports.getSingle = function(req, res) {
  console.log(req.query.file);
  console.log('get file ' + req.params.id);
  if (req.query.file !== undefined && req.query.file !== null) {
    console.log('get file ' + req.params.id);
    req.db.get("SELECT metadata, filepath FROM files WHERE id = ?1", req.params.id, function(err, row) {
      res.download(row.filepath, JSON.parse(row.metadata).name);
    });
  }
  else {
    console.log('get description ' + req.params.id);
    req.db.get("SELECT id, metadata FROM files WHERE id = ?1", req.params.id, function(err, row) {
      console.log(err);
      var data = JSON.parse(row.metadata);
      data.id = req.user.id;
      res.json(data);
    });
  }
};

// PUT on api/documents/:id
exports.replace = function(req, res) {
  console.log("Document PUT:" + req.params.id);
};

// POST on api/documents/:id
exports.update = function(req, res) {
  var data = req.body;
  console.log(req.body);
  console.log("Document POST:" + req.params.id);
  req.db.run("UPDATE files SET metadata = ?1 WHERE id = ?2", [req.body, req.params.id], function(err) { 
      res.json({"status": "updated"});
    });
  });  
};


// DELETE on api/documents/:id
exports.delete = function(req, res) {
  console.log("Document DELETE:" + req.params.id);
};






