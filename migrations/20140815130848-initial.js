module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable('user', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      name: {type: DataTypes.STRING, allowNull: false},
      password: DataTypes.STRING,
      }, {});
    migration.createTable('file', {
      id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
      metadata: DataTypes.STRING,
      filepath: {type: DataTypes.STRING, allowNull: false},
      }, {});            
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable('file');
    migration.dropTable('user');
    done(); 
    }
  }
