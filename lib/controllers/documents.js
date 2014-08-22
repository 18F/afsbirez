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
  var qry = "SELECT d.* FROM documents d ";
  var whereclause = " WHERE 1 = 1 ";
  var orderclause = " ORDER BY d.name "
  var replacements = {
    count: req.query.limit || 20,
    offset: req.query.start || 0
  };
  var options = {raw: true};
  if (!!req.user) {
    qry += " JOIN organizations o ON (d.organization_id = o.id) \
             JOIN organizationsusers ou ON (o.id = ou.organization_id) ";
    whereclause += " AND ou.user_id = :uid ";
    replacements.uid = req.user.id;
  }

  if (req.query.q !== null && req.query.q !== undefined) {
    // if the user submitted a query string, only return documents that contain the string
    whereclause += " AND d.description ILIKE :description ";
    replacements.description = req.query.q;
  }

  if (req.query.keyword !== null && req.query.keyword !== undefined) {
    qry += " JOIN documentskeywords dk ON (d.id = dk.document_id) \
             JOIN keywords k ON (dk.keyword_id = k.id) ";
    whereclause += " AND k.keyword = :keyword ";
    replacements.keyword = req.query.keyword.toLowerCase();
  }

  if (req.query.proposal !== null && req.query.proposal !== undefined) {
    qry += " JOIN documentsproposals dp ON (d.id = dp.document_id) \
             JOIN proposals p ON (dp.proposal_id = p.id) ";
    whereclause += " AND p.name = :proposal_name ";
    replacements.proposal_name = req.query.proposal
  }

  if (req.query.order == 'desc') {
    orderclause = " DESC ";
  }

  qry = qry + whereclause + orderclause + " LIMIT :limit OFFSET :offset ";
  req.db.sequelize.query(qry, req.db.Document, {}, replacements).success(
    function(rows) {
    var listing = { 'files':[] };
    for (var i = 0; i < rows.length; i++) {
      listing.files.push( {name: rows.name, description: rows.description,
                           filepath: rows.filepath} );
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
