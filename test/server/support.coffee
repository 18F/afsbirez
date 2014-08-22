async = require 'async'
config = require '../../lib/config/config'
database = require '../../lib/config/database'
jwt = require 'jsonwebtoken'

module.exports.token = jwt.sign {id: 2}, config.authkey, { expiresInMinutes: 20 }

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
