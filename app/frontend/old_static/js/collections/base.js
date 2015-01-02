(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'module'], function(Backbone, module) {
    var Collection;
    Collection = (function(_super) {
      __extends(Collection, _super);

      function Collection() {
        return Collection.__super__.constructor.apply(this, arguments);
      }

      Collection.prototype.initialize = function(etag) {
        this.etag = etag;
        return Collection.__super__.initialize.apply(this, arguments);
      };

      Collection.prototype.fetch = function(options) {
        var beforeSend, complete, error, success;
        options = _.clone(options != null ? options : {});
        beforeSend = options != null ? options.beforeSend : void 0;
        options.beforeSend = (function(_this) {
          return function(xhr) {
            if (_this != null ? _this.etag : void 0) {
              xhr.setRequestHeader('If-None-Match', _this.etag);
            }
            xhr.setRequestHeader('X-Conditional', true);
            return typeof beforeSend === "function" ? beforeSend(arguments) : void 0;
          };
        })(this);
        success = options != null ? options.success : void 0;
        options.success = (function(_this) {
          return function(resp, status, xhr) {
            var method;
            method = (options != null ? options.reset : void 0) ? 'reset' : 'set';
            if (xhr.status !== 304) {
              _this[method](resp, options);
            }
            return typeof success === "function" ? success(_this, arguments) : void 0;
          };
        })(this);
        complete = options != null ? options.complete : void 0;
        options.complete = (function(_this) {
          return function(xhr, status) {
            _this.etag = xhr.getResponseHeader('ETag');
            return typeof complete === "function" ? complete(arguments) : void 0;
          };
        })(this);
        error = options != null ? options.error : void 0;
        options.error = (function(_this) {
          return function(resp) {
            if (typeof error === "function") {
              error(_this, resp, options);
            }
            return typeof _this.trigger === "function" ? _this.trigger('error', _this, resp, options) : void 0;
          };
        })(this);
        return this.sync('read', this, options);
      };

      Collection.prototype._reset = function() {
        Collection.__super__._reset.apply(this, arguments);
        return this.etag = void 0;
      };

      return Collection;

    })(Backbone.Collection);
    return module.exports = Collection;
  });

}).call(this);
