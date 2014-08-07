'use strict';

// GET on api/documents
exports.getList = function(req, res) {
  //console.log('user:' + req.user.id);
  req.db.all("SELECT id, metadata FROM files WHERE userid = ?1", req.user.id, function (err, rows) {
    //console.log('length: ' + rows.length);
    var listing = { 'files':[] };
    for (var i = 0; i < rows.length; i++) {
      //console.log(rows[i]);
      var data = JSON.parse(rows[i].metadata);
      if (data === null)
        data = {};
      data.id = rows[i].id;
      listing.files.push(data);
    }
    res.json(listing);
  });
};

// POST on api/documents
exports.add = function(req, res) {
  //console.log(req);
  //console.log(req.user.id);
  var data = req.body;
  if (req.body !== null && req.body !== undefined && req.body.name !== null && req.body.name !== undefined)
  {
    if (data.uploaded === undefined || data.uploaded === null)
      data.uploaded = new Date().getTime();
    req.db.run("INSERT INTO files (userid, metadata, filepath) VALUES(?1, ?2, ?3)", [req.user.id, JSON.stringify(data), ''], function(err) {
       if (this.changes === 0) {
         console.log('failed to add');
         res.json(400, {"status": 400, "message": "Unable to add file: " + err.message});
       }
       else {
         console.log(data);
         res.json(201, {"status": "saved", "id": parseInt(this.lastID)});
       }
    });
  }
  else {
    console.log('invalid json');
    res.json(400, {"status": 400, "message": "JSON is not valid."});
  }
};

// GET on api/documents/:id
exports.getSingle = function(req, res) {
  //console.log(req.query.file);
  if (req.query.file !== undefined && req.query.file !== null) {
    //console.log('get file ' + req.params.id);
    req.db.get("SELECT metadata, filepath FROM files WHERE id = ?1", req.params.id, function(err, row) {
      if (row !== null && row !== undefined) {
        res.download(row.filepath, JSON.parse(row.metadata).name);
      }
      else {
        res.json(404, {"status": 404, "message": "File not found."});
      }
    });
  }
  else {
    //console.log('get description ' + req.params.id);
    req.db.get("SELECT id, metadata FROM files WHERE id = ?1", req.params.id, function(err, row) {
      if (row !== null && row !== undefined)
      {
        //console.log(row.metadata);
        var data = JSON.parse(row.metadata);
        data.id = row.id;
        //console.log(data);
        res.json(data);
      }
      else {
        res.json(404, {"status": 404, "message": "File not found."});
      }
    });
  }
};

// PUT on api/documents/:id
exports.replace = function(req, res) { 
  //console.log("Document PUT:" + req.params.id);
  //console.log('Not implemented...we will want to update/version files.');
};

// POST on api/documents/:id
exports.update = function(req, res) {
  var data = req.body;
  if (req.files.file !== undefined && req.files.file !== null) {
    req.db.run("UPDATE files SET filepath = ?1 WHERE id = ?2 and userid = ?3", [req.files.file.path, req.params.id, req.user.id], function(err) {
      console.log(err);
      if (err === null && this.changes > 0) {
        res.json({"id": Number(req.params.id), "status":"success"});
      }
      else {
        res.json(404, {'status': 404, 'message': 'File not found'});
      }
    });
  }
  else if (req.body !== null && req.body !== undefined && req.body.id !== null && req.body.id !== undefined) {
    req.db.run("UPDATE files SET metadata = ?1 WHERE id = ?2 and userid = ?3", [JSON.stringify(data), req.params.id, req.user.id], function(err) {
      console.log(err);
      if (err === null && this.changes > 0) {
        res.json({'id': Number(req.params.id), 'status':'success'});
      }
      else {
        res.json(404, {'status': 404, 'message': 'File not found'});
      }
    });
  }
  else {
    console.log('invalid json');
    res.json(400, {"status": 400, "message": "JSON is not valid."});
  }
};

// DELETE on api/documents/:id
exports.delete = function(req, res) {
  //console.log("Document DELETE:" + req.params.id);
  req.db.run("DELETE FROM files WHERE id = ?1", req.params.id, function(err) {
    if (this.changes === 0) {
      res.json(404, {"status": 404, "message": "File not found."});
    }
    else {
      res.json({"id": parseInt(req.params.id), "status": "deleted"});
    }
  });
};






