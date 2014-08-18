'use strict';

var Sequelize = require("sequelize");
require("coffee-script/register");
var helpers = require('./helpers');

var config = require('./config');

exports.db = null;

exports.createDatabase = function(done, populater) {
    if (exports.db === null) {

        var sequelize = new Sequelize(config.databaseName, config.databaseUsername, config.databasePassword, {
            dialect: "postgres",
            port: 5432,
        });

        sequelize.authenticate()
                .complete(function(err) {
                    if (!!err) {
                        console.log('Unable to connect to the database: ', err);
                    } else {
                        console.log('Connection has been established successfully.');
                    }
                });
                             
        var migrator = sequelize.getMigrator({
            path:        process.cwd() + '/migrations',
            filesFilter: /\.js$/
            });
            

        exports.db = {}

        exports.db.Organization = sequelize.define('organization', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false},
            duns: {type: Sequelize.STRING, allowNull: true},
            ein: {type: Sequelize.STRING, allowNull: true},
        }, { quoteIdentifiers: false });

        exports.db.User = sequelize.define('user', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false},
            password: Sequelize.STRING,
            email: {type: Sequelize.STRING, allowNull: true},
            title: {type: Sequelize.STRING, allowNull: true},
        }, { quoteIdentifiers: false });

        exports.db.File = sequelize.define('file', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            metadata: Sequelize.STRING,
            filepath: {type: Sequelize.STRING, allowNull: false}
        }, { quoteIdentifiers: false });
        
        exports.db.Workflow = sequelize.define('workflow', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},      
            name: Sequelize.STRING,
            description: Sequelize.TEXT,            
        }, { quoteIdentifiers: false });
        
        exports.db.WorkflowStep = sequelize.define('workflowStep', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},      
            name: Sequelize.STRING,
            description: Sequelize.TEXT,    
            work: Sequelize.TEXT,           
        }, { quoteIdentifiers: false });
        
        exports.db.WorkflowStepResult = sequelize.define('workflowStepResult', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},      
            result: Sequelize.TEXT,    
            completedAt: Sequelize.DATE,
        }, { quoteIdentifiers: false });
        
        exports.db.Proposal = sequelize.define('proposal', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}, 
            name: Sequelize.STRING,
            description: Sequelize.TEXT,    
            sbir_topic_reference: Sequelize.STRING,
            startDate: Sequelize.DATE,
            endDate: Sequelize.DATE,
            sbir_topic: Sequelize.STRING,   
        }, { quoteIdentifiers: false });
    
        exports.db.Organization.hasMany(exports.db.User);
        exports.db.Organization.hasMany(exports.db.Proposal);        
        exports.db.User.hasMany(exports.db.File);
        exports.db.Workflow.hasMany(exports.db.WorkflowStep);
        exports.db.WorkflowStep.hasMany(exports.db.WorkflowStepResult);
        
        sequelize.sync({force: true})
                .complete(function(err) {
                    console.log("tables created");
                    if (!!err) {
                        console.log('Error during table creation: ', err);
                    } else {
                        if (!!populater) {
                            populater(done);
                        } else {
                            if (!!done) {
                                done();
                            }
                        }
                    }
                });
        
    } else {
        if (!!done) {
            done();
        }
    }
    
    return exports.db;
};
