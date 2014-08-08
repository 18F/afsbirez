'use strict';

var should = require('should'),
    app = require('../../server'),
    config = require('../../lib/config/config'),
    request = require('supertest'),
    sqlite3 = require('sqlite3').verbose(),
    jwt = require('jsonwebtoken'),
    database = require('../../lib/config/database'),
    fs = require('fs');

var user1, user2;
var token;
var file1, file2, file3;
var db;

exports.openDatabase = function(done) {
  db = database.createDatabase();
  done();
}

exports.createUsers = function(done) {
  db.run('INSERT INTO users (name, password) VALUES ("test_1", "test")', function(err) {
    exports.user1 = this.lastID;
    exports.token = jwt.sign({id: exports.user1}, config.authkey, { expiresInMinutes: 20});
    db.run('INSERT INTO users (name, password) VALUES ("test_2", "test")', function(err) {
      exports.user2 = this.lastID;
      db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
        [exports.user1, JSON.stringify({"name":"file1", "keywords":['test', 'resume'], "description":"Software project"}), 'filepath'], 
        function(err) {
          exports.file1 = this.lastID;
          db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)', 
            [exports.user1, JSON.stringify({"name":"file2", "keywords":['resume']}), 'filepath'], 
            function(err) {
              exports.file2 = this.lastID;
              db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)', 
                [exports.user2, JSON.stringify({"name":"file3", "proposals":[{"name":"prop1"}, {"name":"prop2"}]}), 'filepath'], 
                function(err) {
                  exports.file3 = this.lastID;
                  db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
                    [exports.user1, JSON.stringify({"name":"file4", "description":"", "proposals":[{"name":"prop1"}]}), 'filepath'],
                    function(err) {
                      db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
                        [exports.user1, JSON.stringify({"name":"file5", "proposals":[{"name":"prop1"}, {"name":"prop2"}]}), 'filepath'],
                        function(err) {  
                          db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
                            [exports.user1, JSON.stringify({"name":"file6", "proposals":[{"name":"prop2"}]}), 'filepath'],
                            function(err) {
                              done();
                            });
                        });
                    });
                });
            });
        });
    });
  });
}

exports.removeUsers = function(done) {
  db.run('DELETE FROM users WHERE id = ?1', exports.user1);
  db.run('DELETE FROM users WHERE id = ?1', exports.user2);
  db.run('DELETE FROM files WHERE id = ?1', exports.file1);
  db.run('DELETE FROM files WHERE id = ?1', exports.file2);
  db.run('DELETE FROM files WHERE id = ?1', exports.file3);
  done();
}

