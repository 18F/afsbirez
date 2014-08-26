'use strict';

var Sequelize = require("sequelize");
require("coffee-script/register");
var helpers = require('./helpers');

var config = require('./config');

exports.db = null;

exports.createDatabase = function(done, populater) {
    if (exports.db === null) {

        exports.db = {}

        exports.db.sequelize = new Sequelize(config.databaseName, config.databaseUsername, config.databasePassword, {
            dialect: "postgres",
            port: 5432,
            define: {quoteIdentifiers: false, underscored: true},
        });

        exports.db.sequelize.authenticate()
                .complete(function(err) {
                    if (!!err) {
                        console.log('Unable to connect to the database: ', err);
                    } else {
                        console.log('Connection has been established successfully.');
                    }
                });

        exports.db.Organization = exports.db.sequelize.define('organizations', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false},
            duns: {type: Sequelize.STRING, allowNull: true},
            ein: {type: Sequelize.STRING, allowNull: true},
        }, { quoteIdentifiers: false });

        exports.db.User = exports.db.sequelize.define('users', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false},
            password: Sequelize.STRING,
            email: {type: Sequelize.STRING, allowNull: true},
            title: {type: Sequelize.STRING, allowNull: true},
        }, { quoteIdentifiers: false });

        exports.db.Document = exports.db.sequelize.define('documents', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
            filepath: {type: Sequelize.STRING, allowNull: false}
        }, { quoteIdentifiers: false });

        exports.db.Workflow = exports.db.sequelize.define('workflows', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
        }, { quoteIdentifiers: false });

        exports.db.WorkflowStep = exports.db.sequelize.define('workflowsteps', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
            work: Sequelize.TEXT
        }, { quoteIdentifiers: false });

        exports.db.WorkflowStepResult = exports.db.sequelize.define('workflowstepresults', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            result: Sequelize.TEXT,
            completed_at: Sequelize.DATE
        }, { quoteIdentifiers: false });

        exports.db.Proposal = exports.db.sequelize.define('proposals', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
            sbir_topic_reference: Sequelize.STRING,
            start_date: Sequelize.DATE,
            end_date: Sequelize.DATE
        }, { quoteIdentifiers: false });

        exports.db.Keyword = exports.db.sequelize.define('keywords', {
          id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          keyword: {type: Sequelize.STRING, allowNulls: false}
        }, { quoteIdentifiers: false });

        exports.db.Content = exports.db.sequelize.define('contents', {
          id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          version: {type: Sequelize.INTEGER, allowNulls: false},
          start_date: Sequelize.DATE,
          end_date: Sequelize.DATE,
          change_log: Sequelize.TEXT,
          content: Sequelize.BLOB,
        }, { quoteIdentifiers: false });

        exports.db.User.hasMany(exports.db.Organization);
        exports.db.Organization.hasMany(exports.db.User);

        exports.db.Document.hasMany(exports.db.Keyword);
        exports.db.Keyword.hasMany(exports.db.Document);

        exports.db.Organization.hasMany(exports.db.Document);
        exports.db.Document.belongsTo(exports.db.Organization);

        exports.db.Document.hasMany(exports.db.Content);
        exports.db.Content.belongsTo(exports.db.Document);

        exports.db.Document.hasMany(exports.db.Proposal);
        exports.db.Proposal.hasMany(exports.db.Document);

        exports.db.Organization.hasMany(exports.db.Proposal);
        exports.db.Proposal.belongsTo(exports.db.Organization);

        exports.db.Workflow.hasMany(exports.db.Proposal);
        exports.db.Proposal.belongsTo(exports.db.Workflow);

        exports.db.Workflow.hasMany(exports.db.WorkflowStep);
        exports.db.WorkflowStep.belongsTo(exports.db.Workflow);

        exports.db.WorkflowStep.hasMany(exports.db.WorkflowStepResult);
        exports.db.WorkflowStepResult.belongsTo(exports.db.WorkflowStep);

        exports.db.sequelize.sync({force: true})
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
