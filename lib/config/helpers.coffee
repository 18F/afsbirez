async = require 'async'

module.instances_to_create = null

count_instances = (forest) ->
  count = forest.length 
  for tree in forest
    if tree.children?
      count += count_instances tree.children
      for child in tree.children
        child["#{tree.class_name}Id"] = tree.id
  return count

module.exports.persist_forest = (forest, call_me_when_done, is_top=true) ->
  if is_top
    module.instances_to_create = count_instances forest
  for tree in forest
    tree.cls.create(tree).complete( 
      (err, created) ->
        module.instances_to_create -= 1
        if not module.instances_to_create
          call_me_when_done()
      )
    if tree.children?
      module.exports.persist_forest tree.children, call_me_when_done, false
  