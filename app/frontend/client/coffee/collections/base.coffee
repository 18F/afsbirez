define ['backbone', 'module'], (Backbone, module) ->

  # Extends Backbone.Collection with ETag and If-None-Match header support
  # An ETag is added to the outgoing headers if `etag` is defined
  # `etag` is set by from the response headers for If-None-Match on completion
  # The `options` object has the final word, i.e. it has the final say
  # See: http://jsfiddle.net/Ewg7q/1/

  class Collection extends Backbone.Collection

    initialize: (@etag) ->
      super

    fetch: (options) ->
      options = _.clone(options ? {})
      beforeSend = options?.beforeSend
      options.beforeSend = (xhr) =>
        xhr.setRequestHeader('If-None-Match', @etag) if this?.etag
        xhr.setRequestHeader('X-Conditional', true)
        beforeSend?(arguments)
      success = options?.success
      options.success = (resp, status, xhr) =>
        method = if options?.reset then 'reset' else 'set'
        @[method](resp, options) if xhr.status != 304
        success?(@, arguments)
      complete = options?.complete
      options.complete = (xhr, status) =>
        @etag = xhr.getResponseHeader 'ETag'
        complete?(arguments)
      error = options?.error
      options.error = (resp) =>
        error?(@, resp, options)
        @trigger?('error', @, resp, options)
      @sync('read', @, options)

    _reset: ->
      super
      @etag = undefined

  module.exports = Collection
