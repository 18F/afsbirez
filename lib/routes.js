'use strict';

var api = require('./controllers/api'),
    config = require('./config/config'),
    auth = require('./controllers/auth'),
    index = require('./controllers'),
    jwt = require('express-jwt');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
 
  app.route('/api/forms')
    .get(api.formsList);

  app.route('/api/forms/:id')
    .get(jwt({secret: config.authkey}), api.forms)
    .post(api.formsPost);

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
