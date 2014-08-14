'use strict';

// GET on api/documents
exports.getList = function(req, res) {
  //console.log('user:' + req.user.id);
  if (!!req.user) {
      var filter = {where: {userId: req.user.id}}
  } else {
      var filter = {};
  }
  var qry = req.db.File.findAll(filter);
  console.log("***** ", qry);
  qry.complete(function(err, rows){
    console.log('length: ' + rows.length);
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
  if (req.files.file !== undefined && req.files.file !== null) {
    var config = {
          "name": req.files.file.originalname,
          "uploaded": new Date().getTime(),
          "size": req.files.file.size,
          "proposals": [{"id": 1, "name": "prop123"}, {"id":2, "name": "prop2"}],
          "keywords":["resume"],
          "changelog": [
                         {"message":"File uploaded", "dateChanged": new Date().getTime()}
                       ],
          "description": "This is a description of the file."
        };
    req.db.File.create({userId: req.user.id, metadata: JSON.stringify(config), filepath: req.files.file.path})
            .complete(function(err, created_file) {
                if (err !== null) {
                  res.json({"id": created_file.id, "status":"success"});
                }
                else {
                  res.json(400, {'status': 400, 'message': 'File not posted'});
                }             
            });
  }
  else {
    res.json(400, {"status": 400, "message": "File not posted."});
  }
};

// GET on api/documents/:id
exports.getSingle = function(req, res) {
  //console.log(req.query.file);
  if (req.query.file !== undefined && req.query.file !== null) {
    //console.log('get file ' + req.params.id);
    req.db.File.find({where: {id: req.params.id}}).complete(function(err, row){
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
    req.db.File.find({where:{id: req.params.id}}).complete(function(err, row){
      if (row !== null && row !== undefined)
      {
        //console.log(row.metadata);
        var data = JSON.parse(row.metadata);
        data.id = row.id;
        //console.log(data);
        res.json(data);
      }
      else {
        res.json(400, {"status": 400, "message": "File not found."});
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
  if (req.body.id !== null && req.body.id !== undefined)
  {
    //console.log("Document POST:" + req.params.id);
    req.db.File.find({where:{id: req.params.id}}).complete(function(err, row) {
        if (!err) {
             res.json(400, {"status": 400, "message": "File not found."});        
        } else {
            row.metadata = JSON.stringify(req.body);
            row.save().complete(function(err, row) {
                if (!!err) {
                    res.json(400, {"status": 400, "message": "Problem updating file: " + err});
                } else {
                    res.json({"status": "updated", "id": row.id});   
                }
            });
        }
    })
  }
  else {
    res.json(400, {"status": 400, "message": "JSON is not valid."});
  }
};

// DELETE on api/documents/:id
exports.delete = function(req, res) {
  console.log("Document DELETE:" + req.params.id);
  
  req.db.File.find({where:{id: req.params.id}}).complete(function(err, row){
      console.log(row);
      if ((!!err) || (!row)) {
          res.json(400, {"status": 400, "message": "File not found."});
      } else {
          row.destroy().complete(function(err, row) {
              if (!!err) {
                  res.json(400, {"status": 400, "message": "Error deleting file: " + err});                  
              } else {
                  res.json({"id": parseInt(req.params.id), "status": "deleted"});      
              }
          })
      }
  })
};






