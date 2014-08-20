module.exports = {
  up: function(migration, DataTypes, done) {

    migration.createTable('organizations', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: DataTypes.STRING, allowNull: false},
      duns: DataTypes.STRING,
      ein: DataTypes.STRING,
      created_at: {type: DataTypes.DATE, allowNull: false},
      updated_at: {type: DataTypes.DATE, allowNull: false}
      }, { quoteIdentifiers: false } );

    migration.createTable('workflows', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_at: {type: DataTypes.DATE, allowNull: false},
      updated_at: {type: DataTypes.DATE, allowNull: false}
    }, { quoteIdentifiers: false } );

    migration.createTable('workflowsteps', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      work: DataTypes.TEXT,
      created_at: {type: DataTypes.DATE, allowNull: false},
      updated_at: {type: DataTypes.DATE, allowNull: false}
    }, { quoteIdentifiers: false } );

    migration.createTable('workflowstepresults', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      result: DataTypes.TEXT,
      completed_at: DataTypes.DATE,
      created_at: {type: DataTypes.DATE, allowNull: false},
      updated_at: {type: DataTypes.DATE, allowNull: false}
    }, { quoteIdentifiers: false } );

    migration.createTable('proposals', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      sbir_topic_reference: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      created_at: {type: DataTypes.DATE, allowNull: false},
      updated_at: {type: DataTypes.DATE, allowNull: false}
    }, { quoteIdentifiers: false } );

    migration.addColumn('users', 'title', DataTypes.STRING);
    migration.addColumn('users', 'email', DataTypes.STRING);

    done();
  },
  down: function(migration, DataTypes, done) {
    migration.removeColumn('users', 'email');
    migration.removeColumn('users', 'title');
    migration.dropTable('workflowstepresults');
    migration.dropTable('workflowsteps');
    migration.dropTable('workflows');
    migration.dropTable('proposals');
    migration.dropTable('organizations');
    done();
  }
}
