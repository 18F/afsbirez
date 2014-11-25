(function() {
  var __slice = [].slice;

  require(['backbone', 'module'], function(Backbone, module) {
    var extender, settings, token, updateJWT;
    token = void 0;
    settings = {
      url: '/auth/jwt/token'
    };
    updateJWT = function() {
      var args, on_error, retry, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), on_error = arguments[_i++];
      retry = this;
      retry.error = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        console.log("error in retry ajax call");
        console.log("calling original error handler with retry");
        return typeof on_error === "function" ? on_error.apply(null, __slice.call(args).concat(['retry'])) : void 0;
      };
      return $.ajax(settings.url, {
        type: 'POST',
        data: {},
        dataType: 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Content-Type", "application/json");
          return xhr.setRequestHeader("Accept", "application/json");
        },
        success: function(data, textStatus, jqXHR) {
          token = data != null ? data.token : void 0;
          if (token) {
            return $.ajax(retry);
          }
        },
        error: function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          console.log("unable to obtain a fresh jwt token");
          console.log("calling original error handler with update");
          return typeof on_error === "function" ? on_error.apply(null, __slice.call(args).concat(['update'])) : void 0;
        }
      });
    };
    extender = function(options) {
      var beforeSend, on_error;
      if (options == null) {
        options = {};
      }
      beforeSend = options != null ? options.beforeSend : void 0;
      options.beforeSend = function() {
        var args, xhr;
        xhr = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (token) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        }
        return typeof beforeSend === "function" ? beforeSend.apply(null, [xhr].concat(__slice.call(args))) : void 0;
      };
      on_error = options != null ? options.error : void 0;
      options.error = function() {
        var args, jqXHR;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        jqXHR = args[0];
        if (jqXHR.status === 401) {
          console.log("request failed w/ 401; will try to update jwt and retry");
          args.push(on_error);
          return updateJWT.apply.apply(updateJWT, [this].concat(__slice.call(args)));
        } else {
          console.log("request failed w/o 401; just calling the error handler");
          return typeof on_error === "function" ? on_error.apply(null, args) : void 0;
        }
      };
      return options;
    };
    return Backbone.ajax = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args[0] = extender(args[0]);
      return Backbone.$.ajax.apply(Backbone.$, args);
    };
  });

}).call(this);
