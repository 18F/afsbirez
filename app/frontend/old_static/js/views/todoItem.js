(function() {
  define(['react', 'module'], function(React, module) {
    var ENTER_KEY, ESCAPE_KEY, TodoItem;
    ESCAPE_KEY = 27;
    ENTER_KEY = 13;
    return TodoItem = React.createClass({
      getInitialState: function() {
        return {
          editText: this.props.todo.get('title')
        };
      },
      handleSubmit: function() {
        var val;
        val = this.state.editText.trim();
        if (val) {
          this.props.onSave(val);
          this.setState({
            editText: val
          });
        } else {
          this.props.onDestroy();
        }
        return false;
      },
      handleEdit: function() {
        var enableInput;
        enableInput = (function(_this) {
          return function() {
            var node;
            node = _this.refs.editField.getDOMNode();
            node.focus();
            return node.setSelectionRange(node.value.length, node.value.length);
          };
        })(this);
        this.props.onEdit(enableInput);
        return this.setState({
          editText: this.props.todo.get('title')
        });
      },
      handleKeyDown: function() {
        if (event.which === ESCAPE_KEY) {
          this.setState({
            editText: this.props.todo.get('title')
          });
          return this.props.onCancel();
        } else if (event.which === ENTER_KEY) {
          return this.handleSubmit();
        }
      },
      handleChange: function() {
        return this.setState({
          editText: event.target.value
        });
      },
      render: function() {
        return React.DOM.li({
          "className": React.addons.classSet({
            completed: this.props.todo.get('completed'),
            editing: this.props.editing
          })
        }, React.DOM.div({
          "className": "view"
        }, React.DOM.input({
          "className": "toggle",
          "type": "checkbox",
          "checked": this.props.todo.get('completed'),
          "onChange": this.props.onToggle
        }), React.DOM.label({
          "onDoubleClick": this.handleEdit
        }, this.props.todo.get('title')), React.DOM.button({
          "className": "destroy",
          "onClick": this.props.onDestroy
        })), React.DOM.input({
          "ref": "editField",
          "className": "edit",
          "value": this.state.editText,
          "onBlur": this.handleSubmit,
          "onChange": this.handleChange,
          "onKeyDown": this.handleKeyDown
        }));
      }
    });
  });

}).call(this);
