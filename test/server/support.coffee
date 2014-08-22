async = require 'async'
config = require '../../lib/config/config'
database = require '../../lib/config/database'
jwt = require 'jsonwebtoken'

module.exports.token = jwt.sign {id: 2}, config.authkey, { expiresInMinutes: 20 }

module.instances_to_create = null

count_instances = (trees) ->
  count = trees.length
  for tree in trees
    if tree.children?
      count += count_instances tree.children
      for child in tree.children
        child["#{tree.class_name}_id"] = tree.id
  return count

persist_trees = (trees, call_me_when_done) ->
  console.log "N of trees is #{trees.length}"
  for tree in trees
    console.log "object creation: #{tree.class_name} #{tree.name or tree.filepath}"
    tree.cls.create(tree).complete(
      (err, created) ->
        if err?
          console.log "error creating instance: #{err}"
        else
          console.log "instance #{created.id} created successfully"
          module.instances_to_create -= 1
          console.log "#{module.instances_to_create} instances left to create"
          if not module.instances_to_create
            console.log "all test data created"
            call_me_when_done()
      )
    if tree.children?
      console.log "*** call persist_trees for #{tree.children.length} children"
      persist_trees tree.children, call_me_when_done
    else
      console.log "*** no children"


module.exports.populate = (call_me_when_done) ->
    queries = [
      "INSERT INTO organizations (id, name, duns, ein, created_at, updated_at) VALUES (1, 'FooCorp', '123456', '987654', current_timestamp, current_timestamp)"
      "INSERT INTO proposals (id, name, created_at, updated_at) VALUES (1, 'prop1', current_timestamp, current_timestamp)"
      "INSERT INTO proposals (id, name, created_at, updated_at) VALUES (2, 'prop2', current_timestamp, current_timestamp)"
      "INSERT INTO organizations (id, name, duns, ein, created_at, updated_at) VALUES (2, 'Bar Inc', '121212', '343434', current_timestamp, current_timestamp)"
      "INSERT INTO documents (id, name, description, filepath, organization_id, created_at, updated_at) VALUES (1, 'file1', 'Software project', 'filepath', 1, current_timestamp, current_timestamp)"
      "INSERT INTO keywords (id, keyword, created_at, updated_at) VALUES (1, 'test', current_timestamp, current_timestamp)"
      "INSERT INTO keywords (id, keyword, created_at, updated_at) VALUES (2, 'resume', current_timestamp, current_timestamp)"
      "INSERT INTO documentskeywords (document_id, keyword_id, created_at, updated_at) VALUES (1, 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentskeywords (document_id, keyword_id, created_at, updated_at) VALUES (1, 2, current_timestamp, current_timestamp)"

      "INSERT INTO documents (id, name, description, filepath, organization_id, created_at, updated_at) VALUES (2, 'file2', NULL, 'filepath', 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentskeywords (document_id, keyword_id, created_at, updated_at) VALUES (2, 2, current_timestamp, current_timestamp)"

      "INSERT INTO documents (id, name, description, filepath, organization_id, created_at, updated_at) VALUES (3, 'file3', NULL, 'filepath', 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentsproposals (document_id, proposal_id, created_at, updated_at) VALUES (3, 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentsproposals (document_id, proposal_id, created_at, updated_at) VALUES (3, 2, current_timestamp, current_timestamp)"

      "INSERT INTO documents (id, name, description, filepath, organization_id, created_at, updated_at) VALUES (4, 'file4', NULL, 'filepath', 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentsproposals (document_id, proposal_id, created_at, updated_at) VALUES (4, 1, current_timestamp, current_timestamp)"

      "INSERT INTO documents (id, name, description, filepath, organization_id, created_at, updated_at) VALUES (5, 'file5', NULL, 'filepath', 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentsproposals (document_id, proposal_id, created_at, updated_at) VALUES (5, 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentsproposals (document_id, proposal_id, created_at, updated_at) VALUES (5, 2, current_timestamp, current_timestamp)"

      "INSERT INTO documents (id, name, description, filepath, organization_id, created_at, updated_at) VALUES (6, 'file6', NULL, 'filepath', 1, current_timestamp, current_timestamp)"
      "INSERT INTO documentsproposals (document_id, proposal_id, created_at, updated_at) VALUES (6, 2, current_timestamp, current_timestamp)"

      "INSERT INTO users (id, name, password, created_at, updated_at) VALUES (1, 'test', '123', current_timestamp, current_timestamp)"
      "INSERT INTO users (id, name, password, created_at, updated_at) VALUES (2, 'test_1', 'test', current_timestamp, current_timestamp)"
      "INSERT INTO users (id, name, password, created_at, updated_at) VALUES (3, 'test_2', 'test', current_timestamp, current_timestamp)"
      "INSERT INTO organizationsusers (organization_id, user_id, created_at, updated_at) VALUES (1, 1, current_timestamp, current_timestamp)"
      "INSERT INTO organizationsusers (organization_id, user_id, created_at, updated_at) VALUES (1, 2, current_timestamp, current_timestamp)"
      "INSERT INTO organizationsusers (organization_id, user_id, created_at, updated_at) VALUES (2, 2, current_timestamp, current_timestamp)"
      "INSERT INTO organizationsusers (organization_id, user_id, created_at, updated_at) VALUES (2, 3, current_timestamp, current_timestamp)"
    ]

    run_one_qry = (qry, callback) ->
      database.db.sequelize.query(qry).success( (result) -> console.log result )
    async.each queries, run_one_qry, call_me_when_done

    module.exports.file1 = 1
