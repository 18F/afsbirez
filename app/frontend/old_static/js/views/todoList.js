(function() {
  define(['backbone', 'react', 'mixins/backbone', 'views/todoItem', 'module'], function(Backbone, React, BackboneMixin, TodoItem, module) {
    var TodoList;
    TodoList = React.createClass({
      mixins: [BackboneMixin],
      getBackboneCollections: function() {
        return [this.props.todos];
      },
      getInitialState: function() {
        return {
          editing: null,
          nowShowing: 'all'
        };
      },
      componentDidMount: function() {
        var Router, router;
        Router = Backbone.Router.extend({
          routes: {
            "": "all",
            "active": "active",
            "completed": "completed"
          },
          all: this.setState.bind(this, {
            nowShowing: 'all'
          }),
          active: this.setState.bind(this, {
            nowShowing: 'active'
          }),
          completed: this.setState.bind(this, {
            nowShowing: 'completed'
          })
        });
        router = new Router();
        Backbone.history.start();
        return this.props.todos.fetch();
      },
      handleNewTodoKeyDown: function(event) {
        var val;
        if (event.which !== 13) {
          return;
        }
        val = this.refs.newField.getDOMNode().value.trim();
        if (val) {
          this.props.todos.create({
            title: val,
            completed: false
          }, {
            wait: true
          });
          this.refs.newField.getDOMNode().value = '';
        }
        return false;
      },
      toggleAll: function() {
        return console.log("toggleAll called");
      },
      edit: function(todo, callback) {
        return this.setState({
          editing: todo.get('id')
        }, callback);
      },
      save: function(todo, text) {
        if (todo.get('title') !== text) {
          todo.save({
            title: text
          }, {
            wait: true
          });
        }
        return this.setState({
          editing: null
        });
      },
      destroy: function(todo) {
        return todo.destroy();
      },
      cancel: function() {
        return this.setState({
          editing: null
        });
      },
      clearCompleted: function() {
        var todo, _i, _len, _ref, _results;
        _ref = this.props.todos.completed();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          todo = _ref[_i];
          _results.push(todo.destroy);
        }
        return _results;
      },
      render: function() {
        var main, todoItems, visibleTodos;
        visibleTodos = this.props.todos.filter((function(_this) {
          return function(todo) {
            switch (_this.state.nowShowing) {
              case 'active':
                return !todo.get('completed');
              case 'completed':
                return todo.get('completed');
              default:
                return true;
            }
          };
        })(this));
        todoItems = this.props.todos.map((function(_this) {
          return function(todo) {
            return TodoItem({
              "key": todo.get('id'),
              "todo": todo,
              "editing": _this.state.editing === todo.get('id'),
              "onToggle": todo.toggle.bind(todo),
              "onDestroy": _this.destroy.bind(_this, todo),
              "onEdit": _this.edit.bind(_this, todo),
              "onSave": _this.save.bind(_this, todo),
              "onCancel": _this.cancel
            });
          };
        })(this));
        if (this.props.todos.length) {
          main = React.DOM.section({
            "id": "main"
          }, React.DOM.input({
            "id": "toggle-all",
            "type": "checkbox",
            "onChange": this.toggleAll
          }), React.DOM.ul({
            "id": "todo-list"
          }, todoItems));
        }
        return React.DOM.div(null, React.DOM.header({
          "id": "header"
        }, React.DOM.h1(null, "todos"), React.DOM.input({
          "ref": "newField",
          "id": "new-todo",
          "placeholder": "What needs to be done?",
          "onKeyDown": this.handleNewTodoKeyDown,
          "autoFocus": true
        })), main);
      }
    });
    return module.exports = TodoList;
  });

}).call(this);
