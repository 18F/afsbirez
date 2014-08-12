'use strict';

var Sequelize = require("sequelize");
require("coffee-script/register");
var helpers = require('./helpers');
var wait = require("wait");

var config = require('./config'),
        fs = require('fs'),
        sqlite3 = require('sqlite3').verbose();

exports.db = null;

exports.createDatabase = function(done) {
    if (exports.db === null) {

        var sequelize = new Sequelize(config.databaseName, config.databaseUsername, config.databasePassword, {
            dialect: "postgres",
            port: 5432,
        });

        sequelize.authenticate()
                .complete(function(err) {
                    console.log('logpoint2');
                    if (!!err) {
                        console.log('Unable to connect to the database:', err);
                    } else {
                        console.log('Connection has been established successfully.');
                    }
                });

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
                            [2, JSON.stringify({"name": "file1"}), 'filepath']);
                    exports.db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
                            [2, JSON.stringify({"name": "file2"}), 'filepath']);
                    exports.db.run('INSERT INTO files (userid, metadata, filepath) VALUES (?1, ?2, ?3)',
                            [3, JSON.stringify({"name": "file3"}), 'filepath']);
                }
            });
        });

        console.log('logpoint3');
        exports.db.User = sequelize.define('user', {
            id: Sequelize.INTEGER,
            name: Sequelize.STRING,
            password: Sequelize.STRING,
        });

        console.log('logpoint4');
        exports.db.File = sequelize.define('file', {
            id: Sequelize.INTEGER,
            user_id: Sequelize.INTEGER,
            metadata: Sequelize.STRING,
            filepath: Sequelize.STRING,
        });

        var data = [
            {cls: exports.db.User,
                uqid: "user1",
                class_name: "user",
                name: "test",
                password: "123",
                children: []
            },
            {cls: exports.db.User,
                uqid: "user2",
                class_name: "user",
                name: "test_1",
                password: "test",
                children: [
                    {cls: exports.db.File,
                        uqid: "file1",
                        class_name: "file",
                        metadata: JSON.stringify({"name": "file1"}),
                        filepath: "filepath"
                    },
                    {cls: exports.db.File,
                        uqid: "file2",
                        class_name: "file",
                        metadata: JSON.stringify({"name": "file2"}),
                        filepath: "filepath"
                    },
                ]
            },
            {cls: exports.db.User,
                uqid: "user3",
                class_name: "user",
                name: "test_2",
                password: "test",
                children: [
                    {cls: exports.db.File,
                        uqid: "file3",
                        class_name: "file",
                        metadata: JSON.stringify({"name": "file3"}),
                        filepath: "filepath"
                    }
                ]
            }
        ];
        
        sequelize.sync({force: true})
                .complete(function(err) {
                    if (!!err) {
                        console.log('logpoint7: Error during table creation', err);
                    } else {
                        helpers.persist_array(data, done);
                    }
                });
        console.log('logpoint6: database sync begun');
        
    } else {
        console.log("db already exists, invoking done");
        done();
    }
    
    return exports.db;
};