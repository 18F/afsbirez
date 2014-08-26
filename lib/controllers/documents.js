'use strict';

function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function getDocuments(req, res, is_singular) {
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
  if (is_singular) {
    whereclause += " AND d.id = :id ";
    var replacements = {id: req.params.id, limit: 1, offset: 0};
  } else {
    var replacements = {
      limit: req.query.limit || 20,
      offset: req.query.start - 1 || 0
    };
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
  }

  qry = qry + whereclause + groupclause + orderclause + " LIMIT :limit OFFSET :offset ";
  // console.log("\n\nREQ:", JSON.stringify(req));
  req.db.sequelize.query(qry, null, {raw: true}, replacements).complete(
    function(err, rows) {
      var listing = { 'documents':[] };
      if (!!err) {
        console.log("\n\nQUERY: ", qry);
        console.log("\n\nREPLACEMENT:", JSON.stringify(replacements));
        console.log("\n\nERROR: ", err);
      }
      else {
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          listing.documents.push( {id: row.id,
                               name: row.name,
                               description: row.description,
                               filepath: row.filepath,
                               keywords: row.keywords,
                               proposals: row.proposals} );
          }
      }

    if (is_singular) {
      if (listing.documents.length) {
        res.json(listing.documents[0]);
      } else {
        res.json(404, {'status': 404, 'message': 'Document ID not found', });
      }
    } else {
      res.json(listing);
    }

  });
}

// GET on api/documents
exports.getList = function(req, res) {
  return getDocuments(req, res, false);
}

// POST on api/documents
exports.add = function(req, res) {
  //console.log(req);
  //console.log(req.user.id);
  var data = req.body;
  if (req.body !== null && req.body !== undefined && req.body.name !== null && req.body.name !== undefined)
  {
    if (data.uploaded === undefined || data.uploaded === null)
      data.uploaded = new Date().getTime();
    req.db.Document.findOrCreate({id: data.id}).success(function(doc, created){
      doc.name = data.name;
      doc.description = data.description;
      doc.filepath = '';
      doc.save().success(function(){
        res.json(201, {"id": doc.id, "status":"success"});
      }).error(function(err){
        console.log("ERROR posting file ", data.id, err)
        res.json(400, {'status': 400, 'message': 'File not posted'});
      });
    }).error(function(err){
        console.log("ERROR posting file ", data.id, err)
        res.json(400, {'status': 400, 'message': 'File not posted'});
    });

  }
  else {
    console.log('invalid json');
    res.json(400, {"status": 400, "message": "JSON is not valid."});
  }
};

// GET on api/documents/:id
exports.getSingle = function(req, res) {
  return getDocuments(req, res, true);
}

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
