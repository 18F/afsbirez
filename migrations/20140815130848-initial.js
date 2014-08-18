module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('users', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: {type: DataTypes.STRING, allowNull: false},
            password: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, { quoteIdentifiers: false } );
        migration.createTable('files', {
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            metadata: DataTypes.STRING,
            filepath: {type: DataTypes.STRING, allowNull: false},
            userId: {
                type: DataTypes.INTEGER,
                references: "users",
                referenceKey: "id",
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, { quoteIdentifiers: false } );
        done()
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('files');
        migration.dropTable('users');
        done();
    }
}
