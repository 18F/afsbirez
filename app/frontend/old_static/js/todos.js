(function() {
  require(['main'], function() {
    return require(['react', 'collections/todos', 'views/todoList'], function(React, Todos, TodoList) {
      var todos;
      todos = new Todos();
      return React.renderComponent(TodoList({
        "todos": todos
      }), document.getElementById('todoapp'));
    });
  });

}).call(this);
