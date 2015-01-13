# Extensions of Backbone.ajax to retry any ajax call that fails with a 401 error
# if a new jwt is successfull obtained from the session; otherwise prompt for
# reauthentication.
#
# Note: We pass the original error (on_error) handler to the updateJWT function,
# this in-turn passes that error handler to the subsequent ajax retry after a 
# new jwt is obtained, or is executed in the error handler of the updateJWT ajax
# call.  The on_error function should accept a 4th arguemnt to determine from
# which ajax call the error came from:
#
# on_error(jqXHR, textStatus, errorThrown, originalStatus)
#
# jqXHR.status != 401, originalStatus == undefined ==> original ajax error
# jqXHR.status == *, originalStatus == 'update' ==> updateJWT.ajax.error
# jqXHR.status == *, originalStatus == 'retry' ==> retry.error
# jqXHR.status == 401, originalStatus == undefined ==> should not be possible
#
#
# on_error in the error handler.  on_error takes the standard 3 calling arguments
# jqXHR, textStatus, errorThrown, but also accepts a 4th argument that is either
# the value of the original failure or undefined.
#

#
# Inspired from:
# https://github.com/gdibble/backbone-ajaxretry/blob/master/backbone-ajaxretry.js

require ['backbone', 'module'], (Backbone, module) ->

  token = undefined

  settings =
    url: '/auth/jwt/token'

  updateJWT = (args..., on_error) ->
    retry = @
    retry.error = (args...) ->
      console.log "error in retry ajax call"
      console.log "calling original error handler with retry"
      on_error?(args..., 'retry')
    $.ajax settings.url,
      type: 'POST'
      data: {}
      dataType: 'json'
      beforeSend: (xhr) ->
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.setRequestHeader("Accept", "application/json")
      success: (data, textStatus, jqXHR) ->
        token = data?.token
        $.ajax(retry) if token
      error: (args...) ->
        console.log "unable to obtain a fresh jwt token"
        console.log "calling original error handler with update"
        on_error?(args..., 'update')

  extender = (options) ->
    options ?= {}
    # beforeSend - Set JWT Bearer token
    beforeSend = options?.beforeSend
    options.beforeSend = (xhr, args...) ->
      xhr.setRequestHeader("Authorization", "Bearer #{token}") if token
      beforeSend?(xhr, args...)
    # error - if 401, then retry the request after trying to update the JWT
    on_error = options?.error
    options.error = (args...) ->
      jqXHR = args[0]
      if jqXHR.status == 401
        console.log "request failed w/ 401; will try to update jwt and retry"
        args.push on_error
        updateJWT.apply(@, args...)
      else
        console.log "request failed w/o 401; just calling the error handler"
        on_error?(args...)
    return options

  Backbone.ajax = (args...) ->
    args[0] = extender(args[0])
    Backbone.$.ajax.apply(Backbone.$, args)

