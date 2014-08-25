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
  // -- ARRAY_AGG(k.keyword ORDER BY keyword) AS keywords \
  var qry = "SELECT d.id, d.name, d.description, d.filepath, \n \
             ARRAY_AGG(ROW_TO_JSON(p.*) ORDER BY p.name) AS proposals, \n \
             ARRAY_AGG(k.keyword ORDER BY keyword) AS keywords \n \
             FROM documents d \n \
             LEFT OUTER JOIN documentskeywords dk ON (dk.document_id = d.id) \n \
             LEFT OUTER JOIN keywords k ON (dk.keyword_id = k.id) \n \
             LEFT OUTER JOIN documentsproposals dp ON (d.id = dp.document_id) \n \
             LEFT OUTER JOIN proposals p ON (dp.proposal_id = p.id) \n ";
  var whereclause = " WHERE 1 = 1 \n ";
  var groupclause = " GROUP BY d.id, d.name, d.description, d.filepath \n "
  var orderclause = " ORDER BY d.name \n "
  var replacements = {
    limit: req.query.limit || 20,
    offset: req.query.start - 1 || 0
  };
  var options = {raw: true};
  if (!!req.user) {
    qry += " JOIN organizations o ON (d.organization_id = o.id) \n \
             JOIN organizationsusers ou ON (o.id = ou.organization_id) \n ";
    whereclause += " AND ou.user_id = :uid ";
    replacements.uid = req.user.id;
  }

  if (req.query.q !== null && req.query.q !== undefined) {
    // if the user submitted a query string, only return documents that contain the string
    whereclause += " AND d.description ~* :description \n ";
    replacements.description = req.query.q;
  }

  if (req.query.keyword !== null && req.query.keyword !== undefined) {
    whereclause += " AND k.keyword = :keyword \n ";
    replacements.keyword = req.query.keyword.toLowerCase();
  }

  if (req.query.proposal !== null && req.query.proposal !== undefined) {
    whereclause += " AND p.name = :proposal_name \n ";
    replacements.proposal_name = req.query.proposal
  }

  if (req.query.order == 'desc') {
    orderclause += " DESC ";
  }

  qry = qry + whereclause + groupclause + orderclause + " LIMIT :limit OFFSET :offset ";
  // console.log("\n\nREQ:", JSON.stringify(req));
  req.db.sequelize.query(qry, null, {raw: true}, replacements).complete(
    function(err, rows) {
      var listing = { 'files':[] };
      if (!!err) {
        console.log("\n\nQUERY: ", qry);
        console.log("\n\nREPLACEMENT:", JSON.stringify(replacements));
        console.log("\n\nERROR: ", err);
      }
      else {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          listing.files.push( {id: row.id,
                               name: row.name,
                               description: row.description,
                               filepath: row.filepath,
                               keywords: row.keywords,
                               proposals: row.proposals} );
          }
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
  console.log('FILE:', req.query.file);
  if (req.query.file !== undefined && req.query.file !== null) {
    //console.log('get file ' + req.params.id);
    req.db.Document.find({where: {id: req.params.id}}).complete(function(err, row){
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
    req.db.Document .find({where:{id: req.params.id}}).complete(function(err, row){
      if (row !== null && row !== undefined)
      {
        res.json({id: row.id, name: row.name, description: row.description,
                             filepath: row.filepath} );
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
