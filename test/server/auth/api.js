'use strict';
require("coffee-script/register");

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    sqlite3 = require('sqlite3').verbose(),
    jwt = require('jsonwebtoken'),
    config = require('../../../lib/config/config'),
    support = require('../support'),
    database = require('../../../lib/config/database');  

//  app.route('/auth')
//    .post(auth.signin);

describe('POST /auth', function() {
    
  this.timeout(60000);
  console.log("*** beginning auth tests");
  
  before(function(done) {
    database.createDatabase(done, support.populate);
  });
 
  it('should respond with success, if given correct user name and password', function(done) {
    request(app)
      .post('/auth')
      .send({"username": "test_1" , "password": "test"})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('token');
        request(app)
          .get('/api/documents')
          .set('Authorization', 'Bearer ' + res.body.token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('files').with.lengthOf(2);
            res.body.files.should.be.instanceOf.Array;      
            done();
          });
      });
  });
  
  it('should respond with unauthorized, if given incorrect user name and password', function(done) {
    request(app)
      .post('/auth')
      .send({"username": "test_1" , "password": "adfasdtest"})
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

