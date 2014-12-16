(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['models/base', 'module'], function(Model, module) {
    var Todo;
    Todo = (function(_super) {
      __extends(Todo, _super);

      function Todo() {
        return Todo.__super__.constructor.apply(this, arguments);
      }

      Todo.prototype.defaults = function() {
        return {
          title: '',
          completed: false
        };
      };

      Todo.prototype.toggle = function() {
        return this.save({
          completed: !this.get('completed')
        });
      };

      Todo.prototype.save = function(attributes, options) {
        options = this.extend_options(options);
        return Todo.__super__.save.call(this, attributes, options);
      };

      Todo.prototype.destroy = function(options) {
        options = this.extend_options(options);
        console.log(options);
        return Todo.__super__.destroy.call(this, options);
      };

      Todo.prototype.extend_options = function(options) {
        if (options == null) {
          options = {};
        }
        if (options.wait == null) {
          options.wait = true;
        }
        return options;
      };

      return Todo;

    })(Model);
    return module.exports = Todo;
  });

}).call(this);
