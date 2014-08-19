'use strict';

var api = require('./controllers/api'),
    config = require('./config/config'),
    auth = require('./controllers/auth'),
    documents = require('./controllers/documents'),
    index = require('./controllers'),
    database = require('./config/database'),
    multer = require('multer');

/**
 * Application routes
 */
module.exports = function(app) {
  app.use(multer({dest: config.uploadFolder}));
  app.use(function(req, res, next) {
            req.db = database.createDatabase();
            return next();
          });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'busted!');
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

  app.route('/api/users/:id')
    .get(auth.decoder, api.getUser)
    .post(auth.decoder, api.updateUser);

  app.route('/api/organizations/:id')
    .get(auth.decoder, api.getOrganization)
    .post(auth.decoder, api.updateOrganization);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      console.log('invalid route');
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
