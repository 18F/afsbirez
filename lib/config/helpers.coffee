database = require('./database')

module.instances_to_create = null

count_instances = (forest) ->
  count = forest.length
  for tree in forest
    tree.cls = database.db[tree.class_name]
    if tree.children?
      count += count_instances tree.children
      for child in tree.children
        child["#{tree.class_name}_id"] = tree.id
  return count

module.exports.persist_forest = (call_me_when_done, forest, is_top=true) ->
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
      module.exports.persist_forest call_me_when_done, tree.children, false

module.exports.persist_document_objects = (doc, data) ->
  if data.keywords?
    for kw_name in data.keywords
      database.Keyword.find({where: {keyword: kw_name}}).complete(
        (err, kw) ->
          if kw?
            doc.addKeyword(kw)
          else
            kw = database.Keyword.create(kw_name)
            doc.addKeyword(kw)
      )
