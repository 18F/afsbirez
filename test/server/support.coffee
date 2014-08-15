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
        child["#{tree.class_name}Id"] = tree.id
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
    data = [
        id:         1
        cls:        database.db.User
        class_name: "User"
        name:       "test"
        password:   "123"
       ,
        id:         2
        cls:        database.db.User
        class_name: "user"
        name:       "test_1"
        password:   "test"
        children: [
            cls:        database.db.File
            class_name: "File"
            metadata:   JSON.stringify {"name": "file1"}
            filepath:   "filepath"
           ,
            cls:        database.db.File
            class_name: "file"
            metadata: JSON.stringify({"name": "file2"})
            filepath: "filepath"
            ]
       ,
        id:         3
        cls:        database.db.User
        class_name: "user"
        name:       "test_2"
        password:   "test"
        children: [
            cls:        database.db.File
            class_name: "file"
            metadata:   JSON.stringify({"name": "file3"})
            filepath:   "filepath"
            ]
        ]

    module.exports.file1 = data[0].id
    module.instances_to_create = count_instances data
    persist_trees data, call_me_when_done


