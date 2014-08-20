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
            define: {quoteIdentifiers: false, underscored: true},
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

        exports.db.Organization = sequelize.define('organizations', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false},
            duns: {type: Sequelize.STRING, allowNull: true},
            ein: {type: Sequelize.STRING, allowNull: true},
        }, { quoteIdentifiers: false });

        exports.db.User = sequelize.define('users', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: Sequelize.STRING, allowNull: false},
            password: Sequelize.STRING,
            email: {type: Sequelize.STRING, allowNull: true},
            title: {type: Sequelize.STRING, allowNull: true},
            // organization_id:  {
            //                     type: Sequelize.INTEGER,
            //                     references: "organizations",
            //                     referenceKey: "id",
            //                     onUpdate: "CASCADE",
            //                     onDelete: "RESTRICT"
            //                   },
        }, { quoteIdentifiers: false });


        exports.db.File = sequelize.define('files', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            metadata: Sequelize.STRING,
            filepath: {type: Sequelize.STRING, allowNull: false},
            user_id:  {
                                type: Sequelize.INTEGER,
                                references: "users",
                                referenceKey: "id",
                                onUpdate: "CASCADE",
                                onDelete: "RESTRICT"
                              },
        }, { quoteIdentifiers: false });

        exports.db.Workflow = sequelize.define('workflows', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
        }, { quoteIdentifiers: false });

        exports.db.WorkflowStep = sequelize.define('workflowsteps', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
            work: Sequelize.TEXT,
            workflow_id:  {
                                type: Sequelize.INTEGER,
                                references: "workflows",
                                referenceKey: "id",
                                onUpdate: "CASCADE",
                                onDelete: "RESTRICT"
                              },
        }, { quoteIdentifiers: false });

        exports.db.WorkflowStepResult = sequelize.define('workflowstepresults', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            result: Sequelize.TEXT,
            completed_at: Sequelize.DATE,
            workflowstep_id:  {
                                type: Sequelize.INTEGER,
                                references: "workflowsteps",
                                referenceKey: "id",
                                onUpdate: "CASCADE",
                                onDelete: "RESTRICT"
                              },
        }, { quoteIdentifiers: false });

        exports.db.Proposal = sequelize.define('proposals', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
            name: Sequelize.STRING,
            description: Sequelize.TEXT,
            sbir_topic_reference: Sequelize.STRING,
            start_date: Sequelize.DATE,
            end_date: Sequelize.DATE,
            organization_id:  {
                                type: Sequelize.INTEGER,
                                references: "organizations",
                                referenceKey: "id",
                                onUpdate: "CASCADE",
                                onDelete: "RESTRICT"
                              },
            workflow_id:  {
                                type: Sequelize.INTEGER,
                                references: "workflows",
                                referenceKey: "id",
                                onUpdate: "CASCADE",
                                onDelete: "RESTRICT"
                              },
        }, { quoteIdentifiers: false });

        exports.db.User.hasMany(exports.db.Organization);
        exports.db.Organization.hasMany(exports.db.User);

        exports.db.Organization.hasMany(exports.db.Proposal);
        exports.db.Workflow.hasMany(exports.db.WorkflowStep, {foreignKey: "workflow_id"});
        exports.db.WorkflowStep.hasMany(exports.db.WorkflowStepResult, {foreignKey: "workflowstep_id"});

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
