'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    sqlite3 = require('sqlite3').verbose(),
    jwt = require('jsonwebtoken'),
    fs = require('fs'),
    config = require('../../../lib/config/config'),
    support = require('../support');

//  app.route('/api/documents')
//    .get(auth.decoder, documents.getList)
//    .post(auth.decoder, documents.add);

//  app.route('/api/documents/:id')
//    .get(auth.decoder, documents.getSingle)
//    .put(auth.decoder, documents.replace)
//    .post(auth.decoder, documents.update)
//    .delete(auth.decoder, documents.delete);

describe('GET /api/documents', function() {
  before(function(done) {
    support.openDatabase();
    support.createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    support.removeUsers(done);
  });

  it('should respond with JSON array of documents, if given correct auth header', function(done) {
    console.log('TOKEN: ' + support.token);
    request(app)
      .get('/api/documents')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('files').with.lengthOf(2);
        res.body.files.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with JSON array of documents, if correct token passed in url', function(done) {
    request(app)
      .get('/api/documents?jwt=' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('files').with.lengthOf(2);
        res.body.files.should.be.instanceOf.Array;
        done();
      });
  });

  it('should respond respond with unauthorized if no auth header and no token', function(done) {
    request(app)
      .get('/api/documents')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 401);
        done();
      });
  });
  
  it('should respond respond with unauthorized if invalid auth header', function(done) {
    request(app)
      .get('/api/documents')
      .set('Authorization', 'Bearer abcd1234 ')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 401);
        done();
      });
  });
});

describe('POST /api/documents', function() {
  before(function(done) {
    support.openDatabase();
    support.createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    support.removeUsers(done);
  });

/*
// Supertest and multer don't seem to play nicely - I never see the file attached to the request.
  it('should respond with success, if given correct auth header and file', function(done) {
    var filename = 'server.js';
    var data = fs.readFileSync(filename);

    request(app)
      .post('/api/documents')
//      .set('Content-Type', 'text/plain')
//      .set('Content-Disposition', 'attachment; filename='+filename)
//      .set('Content-Length', data.length)
//      .send(data)
//      .attach('files', 'sbir142.pdf')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
*/ 
  it('should respond with unauthorized, if given an incorrect auth header', function(done) {
    request(app)
      .post('/api/documents')
      .set('Authorization', 'Bearer adfasdfa' + support.token)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  
  it('should respond with an error, if given correct auth header and but invalid file', function(done) {
    request(app)
      .post('/api/documents')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(400)
      .end(function(err, res) {
        console.log('err: ' + err);
        console.log('res: ' + res);
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
});

describe('GET /api/documents/id', function() {
  before(function(done) {
    support.openDatabase();
    support.createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    support.removeUsers(done);
  });

  it('should respond with success and data, if given correct auth header and file exists', function(done) {
    request(app)
      .get('/api/documents/' + support.file1)
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', support.file1);
        done();
      });
  });

  it('should respond with an error, if given correct auth header and file does not exist', function(done) {
    request(app)
      .get('/api/documents/1234233')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
});     

//    .put(auth.decoder, documents.replace)
/*
// PUT is not yet implemented
describe('PUT /api/documents/id', function() {
  before(function(done) {
    support.openDatabase();
    support.createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    support.removeUsers(done);
  });

  it('should respond with success, if given correct auth header and file exists', function(done) {
    request(app)
      .put('/api/documents/' + support.file1)
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', support.file1);
        done();
      });
  });

  it('should respond with an error, if given correct auth header and file does not exist', function(done) {
    request(app)
      .put('/api/documents/1234233')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
});     
*/

//    .post(auth.decoder, documents.update)
describe('POST /api/documents/id', function() {
  before(function(done) {
    support.openDatabase();
    support.createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    support.removeUsers(done);
  });

  it('should respond with success, if given correct auth header, file exists, and json is valid', function(done) {
    request(app)
      .post('/api/documents/' + support.file1)
      .set('Authorization', 'Bearer ' + support.token)
      .send({"name": "fileABC", "id": support.file1, "description":"New description"})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', support.file1);
        request(app)
          .get('/api/documents/' + support.file1)
          .set('Authorization', 'Bearer ' + support.token)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.should.have.property('description', 'New description'); 
            done();
          });
      });
  });

  it('should respond with an error, if given correct auth header and file does not exist', function(done) {
    request(app)
      .post('/api/documents/1234233')
      .set('Authorization', 'Bearer ' + support.token)
      .send({"name": "fileABC", "id": support.file1, "description":"New description"})
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
  
  it('should respond with an error, if given correct auth header and file exists, but json is invalid', function(done) {
    request(app)
      .post('/api/documents/' + support.file1)
      .set('Authorization', 'Bearer ' + support.token)
      .send('{"name": "fileABC", "id": support.file1, "description":}}}}""/"New description}}}fasdfadfafdafdfdfafs....."}')
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
});     

//    .delete(auth.decoder, documents.delete);
describe('DELETE /api/documents/id', function() {
  before(function(done) {
    support.openDatabase();
    support.createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    support.removeUsers(done);
  });

  it('should respond with success, if given correct auth header and file exists', function(done) {
    request(app)
      .del('/api/documents/' + support.file1)
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', support.file1);
        request(app)
          .get('/api/documents/' + support.file1)
          .set('Authorization', 'Bearer ' + support.token)
          .expect(400)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
  });

  it('should respond with an error, if given correct auth header and file does not exist', function(done) {
    request(app)
      .del('/api/documents/1234233')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
});     



