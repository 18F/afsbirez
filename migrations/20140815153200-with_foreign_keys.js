module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn('proposals', 'organization_id', {
        type: DataTypes.INTEGER,
        references: "organizations",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      });
    migration.addColumn('proposals', 'workflow_id', {
        type: DataTypes.INTEGER,
        references: "workflows",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      });
    migration.addColumn('workflowstepresults', 'workflowstep_id', {
        type: DataTypes.INTEGER,
        references: "workflowsteps",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      });
    migration.addColumn('workflowsteps', 'workflow_id', {
        type: DataTypes.INTEGER,
        references: "workflows",
        referenceKey: "id",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      });
    migration.createTable('organizationsusers', {
        organization_id:  {
                            type: DataTypes.INTEGER,
                            references: "organizations",
                            referenceKey: "id",
                            onUpdate: "CASCADE",
                            onDelete: "RESTRICT",
                            allowNull: false,
                          },
        user_id:  {
                            type: DataTypes.INTEGER,
                            references: "users",
                            referenceKey: "id",
                            onUpdate: "CASCADE",
                            onDelete: "RESTRICT",
                            allowNull: false,
                          },
      created_at: {type: DataTypes.DATE, allowNull: false},
      updated_at: {type: DataTypes.DATE, allowNull: false}
    }, { quoteIdentifiers: false });
    done()
  },
  down: function(migration, DataTypes, done) {
      migration.dropTable('organizationsusers');
      migration.removeColumn('proposals', 'organization_id');
      migration.removeColumn('proposals', 'workflow_id');
      migration.removeColumn('workflowstepresults', 'workflowstep_id');
      migration.removeColumn('workflowsteps', 'workflow_id');

    done();
  }
}
