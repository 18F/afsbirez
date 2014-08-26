'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    jwt = require('jsonwebtoken'),
    fs = require('fs'),
    config = require('../../../lib/config/config'),
    support = require('../support'),
    database = require('../../../lib/config/database');

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
    database.createDatabase(done, support.populate);
  });

  it('should respond with JSON array of documents, if given correct auth header', function(done) {
    request(app)
      .get('/api/documents')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(6);
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with JSON array of documents containing the query string if the query is found in the documents', function(done) {
    request(app)
      .get('/api/documents?q=software')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(1);
        done();
     });
  });

  it('should respond with JSON array of documents containing the keyword if the keyword is found in the documents', function(done) {
    request(app)
      .get('/api/documents?keyword=test')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(1);
        res.body.documents[0].keywords[0].should.be.exactly('test');
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with an empty JSON array of documents containing the keyword if the keyword is not found in the documents', function(done) {
    request(app)
      .get('/api/documents?keyword=notfound')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(0);
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with JSON array of documents attached to the specified proposal', function(done) {
    request(app)
      .get('/api/documents?proposal=prop1')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(3);
        res.body.documents[0].proposals[0].name.should.be.exactly('prop1');
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with JSON array of documents limited to the requested length', function(done) {
    request(app)
      .get('/api/documents?limit=3')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(3);
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with JSON array of documents starting with the requested offset', function(done) {
    request(app)
      .get('/api/documents?start=4')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(3);
        res.body.documents[0].name.should.be.exactly('file4');
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with JSON array of documents starting with the requested offset and limit', function(done) {
    request(app)
      .get('/api/documents?start=2&limit=2')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(2);
        res.body.documents[0].name.should.be.exactly('file2');
        res.body.documents.should.be.instanceOf.Array;
        done();
     });
  });

  it('should respond with an ordered JSON array of documents', function(done) {
    request(app)
      .get('/api/documents?order=desc')
      .set('Authorization', 'Bearer ' + support.token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('documents').with.lengthOf(6);
        res.body.documents[0].name.should.be.exactly('file6');
        res.body.documents.should.be.instanceOf.Array;
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
        res.body.should.have.property('documents').with.lengthOf(6);
        res.body.documents.should.be.instanceOf.Array;
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
    database.createDatabase(done, support.populate);
  });

  it('should respond with success, if given correct auth header and JSON metadata', function(done) {
    request(app)
      .post('/api/documents')
      .set('Authorization', 'Bearer ' + support.token)
      .send({"name": "fileABC", "id": support.file1, "description":"New description"})
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

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

  it('should respond with an error, if given correct auth header and but invalid metadata', function(done) {
    request(app)
      .post('/api/documents')
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


describe('GET /api/documents/id', function() {
  before(function(done) {
    database.createDatabase(done, support.populate);
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
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('status', 404);
        done();
      });
  });
});

// //    .put(auth.decoder, documents.replace)
// // PUT is not yet implemented
// describe.skip('PUT /api/documents/id', function() {
//   before(function(done) {
//     database.createDatabase(done, support.populate);
//   });
//
//   it('should respond with success, if given correct auth header and file exists', function(done) {
//     request(app)
//       .put('/api/documents/' + support.file1)
//       .set('Authorization', 'Bearer ' + support.token)
//       .expect(200)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('id', support.file1);
//         done();
//       });
//   });
//
//   it('should respond with an error, if given correct auth header and file does not exist', function(done) {
//     request(app)
//       .put('/api/documents/1234233')
//       .set('Authorization', 'Bearer ' + support.token)
//       .expect(400)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('status', 400);
//         done();
//       });
//   });
// });
//
// //    .post(auth.decoder, documents.update)
// describe('POST /api/documents/id', function() {
//   before(function(done) {
//     database.createDatabase(done, support.populate);
//   });
//
//   it('should respond with success, if given correct auth header, file exists, and json is valid', function(done) {
//     request(app)
//       .post('/api/documents/' + support.file1)
//       .set('Authorization', 'Bearer ' + support.token)
//       .send({"name": "fileABC", "id": support.file1, "description":"New description"})
//       .expect(200)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('id', support.file1);
//         request(app)
//           .get('/api/documents/' + support.file1)
//           .set('Authorization', 'Bearer ' + support.token)
//           .end(function(err, res) {
//             if (err) return done(err);
//             res.body.should.have.property('description', 'New description');
//             done();
//           });
//       });
//   });
//
//   it('should respond with an error, if given correct auth header and file does not exist', function(done) {
//     request(app)
//       .post('/api/documents/1234233')
//       .set('Authorization', 'Bearer ' + support.token)
//       .send({"name": "fileABC", "id": support.file1, "description":"New description"})
//       .expect(404)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('status', 404);
//         done();
//       });
//   });
//
//   it('should respond with an error, if given correct auth header and file exists, but json is invalid', function(done) {
//     request(app)
//       .post('/api/documents/' + support.file1)
//       .set('Authorization', 'Bearer ' + support.token)
//       .send('{"name": "fileABC", "id": support.file1, "description":}}}}""/"New description}}}fasdfadfafdafdfdfafs....."}')
//       .expect(400)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('status', 400);
//         done();
//       });
//   });
// });
//
// //    .delete(auth.decoder, documents.delete);
// describe('DELETE /api/documents/id', function() {
//   before(function(done) {
//     database.createDatabase(done, support.populate);
//   });
//
//   it('should respond with success, if given correct auth header and file exists', function(done) {
//     request(app)
//       .del('/api/documents/' + support.file1)
//       .set('Authorization', 'Bearer ' + support.token)
//       .expect(200)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('id', support.file1);
//         request(app)
//           .get('/api/documents/' + support.file1)
//           .set('Authorization', 'Bearer ' + support.token)
//           .expect(404)
//           .end(function(err, res) {
//             if (err) return done(err);
//             done();
//           });
//       });
//   });
//
//   it('should respond with an error, if given correct auth header and file does not exist', function(done) {
//     request(app)
//       .del('/api/documents/1234233')
//       .set('Authorization', 'Bearer ' + support.token)
//       .expect(404)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.have.property('status', 404);
//         done();
//       });
//   });
// });
