'use strict';

var config = require('./config'),
    fs = require('fs'),
    sqlite3 = require('sqlite3').verbose();

exports.db = null;

exports.createDatabase = function() {
  if (exports.db === null) {
    exports.db = new sqlite3.Database(config.databaseFile, function(err) {
      if (err !== null)
        console.log('error' + err);
      exports.db.serialize(function() {
        exports.db.run("CREATE TABLE files (id INTEGER PRIMARY KEY, userid INT, metadata TEXT, filepath TEXT)");
        exports.db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT)");
        exports.db.run("INSERT INTO users (name, password) VALUES('test', '123')");
        if (config.env === 'test') {
          exports.db.run('INSERT INTO users (name, password) VALUES ("test_1", "test")');
          exports.db.run('INSERT INTO users (name, password) VALUES ("test_2", "test")');
          exports.db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
            [2, JSON.stringify({"name":"file1"}), 'filepath']);
          exports.db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
            [2, JSON.stringify({"name":"file2"}), 'filepath']);
          exports.db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
            [3, JSON.stringify({"name":"file3"}), 'filepath']);
        }
      });
    });
  }
  return exports.db;
};
