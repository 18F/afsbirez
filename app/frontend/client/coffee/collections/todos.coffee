define ['collections/base', 'models/todo', 'module'], (BaseCollection, Todo, module) ->

  Todos = BaseCollection.extend
    
    model: Todo

    url: '/api/v1/todos'

    completed: ->
      @where completed: true

    remaining: ->
      @where completed: false

  module.exports = Todos
