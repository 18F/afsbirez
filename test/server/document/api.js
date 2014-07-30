'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    sqlite3 = require('sqlite3').verbose(),
    jwt = require('jsonwebtoken'),
    fs = require('fs'),
    config = require('../../../lib/config/config');

//  app.route('/api/documents')
//    .get(auth.decoder, documents.getList)
//    .post(auth.decoder, documents.add);

//  app.route('/api/documents/:id')
//    .get(auth.decoder, documents.getSingle)
//    .put(auth.decoder, documents.replace)
//    .post(auth.decoder, documents.update)
//    .delete(auth.decoder, documents.delete);

var user1, user2;
var token;
var file1, file2, file3;
var db;

function openDatabase() {
  db = new sqlite3.Database('data_store/database', function(err) {
  });
}

function createUsers(done) {
  db.run('INSERT INTO users (name, password) VALUES ("test_1", "test")', function(err) {
    user1 = this.lastID;
    token = jwt.sign({id: user1}, config.authkey, { expiresInMinutes: 20});
    db.run('INSERT INTO users (name, password) VALUES ("test_2", "test")', function(err) {
      user2 = this.lastID;
      db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
        [user1, JSON.stringify({"name":"file1"}), 'filepath'], 
        function(err) {
          file1 = this.lastID;
          db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)', 
            [user1, JSON.stringify({"name":"file2"}), 'filepath'], 
            function(err) {
              file2 = this.lastID;
              db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)', 
                [user2, JSON.stringify({"name":"file3"}), 'filepath'], 
                function(err) {
                  file3 = this.lastID;
                  done();
                });
            });
        });
    });
  });
}

function removeUsers(done) {
  db.run('DELETE FROM users WHERE id = ?1', user1);
  db.run('DELETE FROM users WHERE id = ?1', user2);
  db.run('DELETE FROM files WHERE id = ?1', file1);
  db.run('DELETE FROM files WHERE id = ?1', file2);
  db.run('DELETE FROM files WHERE id = ?1', file3);
  done();
}

describe('GET /api/documents', function() {
  before(function(done) {
    openDatabase();
    createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    removeUsers(done);
  });

  it('should respond with JSON array of documents, if given correct auth header', function(done) {
    request(app)
      .get('/api/documents')
      .set('Authorization', 'Bearer ' + token)
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
      .get('/api/documents?jwt=' + token)
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
    openDatabase();
    createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    removeUsers(done);
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
      .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer adfasdfa' + token)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  
  it('should respond with an error, if given correct auth header and but invalid file', function(done) {
    request(app)
      .post('/api/documents')
      .set('Authorization', 'Bearer ' + token)
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
    openDatabase();
    createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    removeUsers(done);
  });

  it('should respond with success and data, if given correct auth header and file exists', function(done) {
    request(app)
      .get('/api/documents/' + file1)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', file1);
        done();
      });
  });

  it('should respond with an error, if given correct auth header and file does not exist', function(done) {
    request(app)
      .get('/api/documents/1234233')
      .set('Authorization', 'Bearer ' + token)
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
    openDatabase();
    createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    removeUsers(done);
  });

  it('should respond with success, if given correct auth header and file exists', function(done) {
    request(app)
      .put('/api/documents/' + file1)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', file1);
        done();
      });
  });

  it('should respond with an error, if given correct auth header and file does not exist', function(done) {
    request(app)
      .put('/api/documents/1234233')
      .set('Authorization', 'Bearer ' + token)
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
    openDatabase();
    createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    removeUsers(done);
  });

  it('should respond with success, if given correct auth header, file exists, and json is valid', function(done) {
    request(app)
      .post('/api/documents/' + file1)
      .set('Authorization', 'Bearer ' + token)
      .send({"name": "fileABC", "id": file1, "description":"New description"})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', file1);
        request(app)
          .get('/api/documents/' + file1)
          .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
      .send({"name": "fileABC", "id": file1, "description":"New description"})
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
  
  it('should respond with an error, if given correct auth header and file exists, but json is invalid', function(done) {
    request(app)
      .post('/api/documents/' + file1)
      .set('Authorization', 'Bearer ' + token)
      .send('{"name": "fileABC", "id": file1, "description":}}}}""/"New description}}}fasdfadfafdafdfdfafs....."}')
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
    openDatabase();
    createUsers(done);
  });
  
  // remove database entries after test
  after(function(done) {
    removeUsers(done);
  });

  it('should respond with success, if given correct auth header and file exists', function(done) {
    request(app)
      .del('/api/documents/' + file1)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('id', file1);
        request(app)
          .get('/api/documents/' + file1)
          .set('Authorization', 'Bearer ' + token)
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
      .set('Authorization', 'Bearer ' + token)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 400);
        done();
      });
  });
});     



