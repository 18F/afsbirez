'use strict';

var api = require('./controllers/api'),
    config = require('./config/config'),
    auth = require('./controllers/auth'),
    documents = require('./controllers/documents'),
    index = require('./controllers'),
    jwt = require('jwt-simple'),
    storage = require('filestorage').create('data_store/'),
    multer = require('multer');

/**
 * Application routes
 */
module.exports = function(app) {

  var jwtDecoder = function(req, res, next) {
    var token = null;
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      }
    }

    if (token === null && req.query.jwt) {
      token = req.query.jwt;
    }

    var error = null;

    try {
      req.user = jwt.decode(token, config.authkey);
    }
    catch (err)
    {
      error = new Error('credentials_required', { message: 'No or invalid token found.', status: 401 });
    }
    console.log(req.user);
    if (error)
      next(error);
    else 
      next();
  };

  app.use(multer({dest: './uploads'}));
  app.use(function(req, res, next) {
      req.storage = storage;
      return next();
    });

  // Server API Routes
  app.route('/api/forms')
    .get(jwtDecoder, api.formsList);

  app.route('/api/forms/:id')
    .get(jwtDecoder, api.forms)
    .post(api.formsPost);

  app.route('/api/documents')
    .get(jwtDecoder, documents.getList)
    .post(jwtDecoder, documents.add);

  app.route('/api/documents/:id')
    .get(jwtDecoder, documents.getSingle)
    .put(jwtDecoder, documents.replace)
    .patch(jwtDecoder, documents.update)
    .delete(jwtDecoder, documents.delete);

  app.route('/api/keywords')
    .get(jwtDecoder, api.getKeywords)
    .post(jwtDecoder, api.addKeyword);

  app.route('/api/proposals')
    .get(jwtDecoder, api.getProposalList);

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
