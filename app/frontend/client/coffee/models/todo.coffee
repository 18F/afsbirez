define ['models/base', 'module'], (Model, module) ->

  class Todo extends Model
    
    defaults: () ->
      title: ''
      completed: false

    toggle: -> @save completed: !@get('completed')

    save: (attributes, options) ->
      options = @extend_options(options)
      super attributes, options

    destroy: (options) ->
      options = @extend_options(options)
      console.log options
      super options

    extend_options: (options) ->
      options ?= {}
      options.wait ?= true
      return options

  module.exports = Todo
