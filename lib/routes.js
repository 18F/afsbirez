'use strict';

var api = require('./controllers/api'),
    config = require('./config/config'),
    auth = require('./controllers/auth'),
    documents = require('./controllers/documents'),
    index = require('./controllers'),
    jwt = require('jsonwebtoken'),
//    storage = require('filestorage').create('data_store/'),
    sqlite3 = require('sqlite3').verbose(),
    fs = require('fs'),
    multer = require('multer');

/**
 * Application routes
 */
module.exports = function(app) {


  app.use(multer({dest: './uploads'}));
  app.use(function(req, res, next) {
      fs.exists('data_store/database', function(exists) {
        req.db = new sqlite3.Database('data_store/database', function(err) {
          console.log('error' + err);
          console.log(req.db);
          if (!exists) {
            req.db.run("CREATE TABLE files (id INTEGER PRIMARY KEY, userid INT, metadata TEXT, filepath TEXT)");
          }
          return next();
        });
      });
    });

  // Server API Routes
  app.route('/api/forms')
    .get(auth.decoder, api.formsList);

  app.route('/api/forms/:id')
    .get(auth.decoder, api.forms)
    .post(api.formsPost);

  app.route('/api/documents')
    .get(auth.decoder, documents.getList)
    .post(auth.decoder, documents.add);
  
  app.route('/api/documents/:id')
    .get(auth.decoder, documents.getSingle)
    .put(auth.decoder, documents.replace)
    .post(auth.decoder, documents.update)
    .delete(auth.decoder, documents.delete);

  app.route('/api/keywords')
    .get(auth.decoder, api.getKeywords)
    .post(auth.decoder, api.addKeyword);

  app.route('/api/proposals')
    .get(auth.decoder, api.getProposalList);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  app.route('/auth')
    .post(auth.signin);

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( index.index);
};
