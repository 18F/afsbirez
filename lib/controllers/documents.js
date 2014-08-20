'use strict';

function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

// GET on api/documents
exports.getList = function(req, res) {
  //console.log('user:' + req.user.id);
  var filter = {};
  if (!!req.user) {
    filter = {where: {user_id: req.user.id}};
  }
  var qry = req.db.File.findAll(filter);
  qry.complete(function(err, rows){
    //console.log('length: ' + rows.length);
    var listing = { 'files':[] };

    // variable for query string manipulations of the result set.
    var shouldAdd = true;
    var count = req.query.limit || 20;
    var offset = req.query.start || 0;
    var addedCount = 0;
    var seenCount = 0;

    // take each row in the result set and iterate over it, adding if it passes the query string filters
    for (var i = 0; i < rows.length; i++) {
      shouldAdd = true;
      seenCount++;
      var data = JSON.parse(rows[i].metadata);
      // if we have no metadata, create an empty metadata object. This is probably an error.
      if (data === null)
        data = {};
      // the data will not necessarily have the id in it. Add it.
      data.id = rows[i].id;


      // if the user submitted a query string, only return documents that contain the string
      if (req.query.q !== null && req.query.q !== undefined) {
        shouldAdd = false;
        if (data.description !== null && data.description !== undefined) {
          if (data.description.toLowerCase().indexOf(req.query.q.toLowerCase()) > -1) {
            shouldAdd = true;
          }
        }
      }

      // if the user submitted a keyword, only return documents that contain the keyword
      if (shouldAdd === true && req.query.keyword !== null && req.query.keyword !== undefined) {
        shouldAdd = false;
        if (data.keywords !== null && data.keywords !== undefined) {
          for (var j = 0; j < data.keywords.length; j++) {
            if (data.keywords[j] === req.query.keyword) {
              shouldAdd = true;
              break;
            }
          }
        }
      }

      // if the user submitted a proposal, only return documents that are attached to the proposal
      if (shouldAdd === true && req.query.proposal !== null && req.query.proposal !== undefined) {
        shouldAdd = false;
        if (data.proposals !== null && data.proposals !== undefined) {
          for (var k = 0; k < data.proposals.length; k++) {
            if (data.proposals[k].name === req.query.proposal) {
              shouldAdd = true;
              break;
            }
          }
        }
      }

      // if the user is getting a different page of data, ignore the first x records.
      if (shouldAdd === true && seenCount < offset) {
        shouldAdd = false;
      }

      // if the user wants a subset of the data, don't return more results.
      if (shouldAdd === true && addedCount >= count) {
        shouldAdd = false;
        break;
      }

      // Add the file to the result set.
      if (shouldAdd === true) {
        listing.files.push(data);
        addedCount++;
      }
    }

    listing.files.sort(compare);
    if (req.query.order === 'desc') {
      listing.files.reverse();
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
    req.db.File.create({userId: req.user.id, metadata: JSON.stringify(data), filepath: ''})
            .complete(function(err, created_file) {
                if (err === null) {
                  res.json(201, {"id": created_file.id, "status":"success"});
                }
                else {
                  res.json(400, {'status': 400, 'message': 'File not posted'});
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
  if ((req.files.file !== undefined && req.files.file !== null) ||
      (data !== null && data !== undefined && data.id !== null && data.id !== undefined)) {
    req.db.File.find({where:{id: req.params.id}}).complete(function(err, row) {
      if ((!!err) || (!row)) {
        res.json(404, {"status": 404, "message": "File not found."});
      } else {
        if (req.files && req.files.file && req.files.file.path) {
          row.filepath = req.files.file.path;
        }
        else if (data && data.id) {
          row.metadata = JSON.stringify(data);
        }
        row.save().complete(function(err, row) {
          if (!!err) {
            res.json(400, {"status": 400, "message": "Problem updating file: " + err});
          } else {
            res.json({"status": "updated", "id": row.id});
          }
        });
      }
    });
  }
  else {
    res.json(400, {"status": 400, "message": "JSON is not valid."});
  }
};

// DELETE on api/documents/:id
exports.delete = function(req, res) {
  //console.log("Document DELETE:" + req.params.id);

  req.db.File.find({where:{id: req.params.id}}).complete(function(err, row){
      if ((!!err) || (!row)) {
          res.json(404, {"status": 404, "message": "File not found."});
      } else {
          row.destroy().complete(function(err, row) {
              if (!!err) {
                  res.json(400, {"status": 400, "message": "Error deleting file: " + err});
              } else {
                  res.json({"id": parseInt(req.params.id), "status": "deleted"});
              }
          });
      }
  });
};
