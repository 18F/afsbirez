'use strict';

var jwt = require('jsonwebtoken'),
    config = require('../config/config');

exports.decoder = function(req, res, next) {
  //console.log('req ' + req.params.id);
  //console.log('query ' + req.query);
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

  if (token === null) {
    return res.json(401, {"status": 401, "message": "Missing API token."});
  }
    //next(new Error('missing auth')); 
 
  jwt.verify(token, config.authkey, null, function(err, payload) {
    req.user = payload;
    //console.log('payload=' + payload);
    if (err) {
      console.log(err);
      return res.json(401, {"status": 401, "message": "Missing API token."});
    }
    else {
      next();
    }
  });
};

exports.signin = function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  if (username === '' || password === '') { 
    //console.log('unauthed!');
    return res.json(401, {"status": 401, "message": "Please provide a username and password."});
  }

  req.db.get("SELECT id FROM users WHERE name = ?1 AND password = ?2", [username, password], function(err, row) {
    //console.log('row: ' + row);
    //console.log('user: ' + username);
    //console.log('password: ' + password);
    if (row  !== undefined) {
      var token = jwt.sign({id: row.id}, config.authkey, { expiresInMinutes: 20});
      return res.json({token:token, username: username, id: row.id});
    }
    else {
      //console.log('unauthed!');
      return res.json(401, {"status": 401, "message": "Invalid username or password."});
    }
  });
};
