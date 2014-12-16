define ['backbone', 'module'], (Backbone, module) ->

  # Extends Backbone.Model with ETag and If-None-Match header support
  # An ETag is added to the outgoing headers if `etag` is defined
  # `etag` is set by from the response headers for If-None-Match on completion
  # The `options` object has the final word, i.e. it has the final say
  # See: http://jsfiddle.net/Ewg7q/1/

  class Model extends Backbone.Model

  module.exports = Model
