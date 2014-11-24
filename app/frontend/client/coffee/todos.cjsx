require ['main'], () ->

  require ['react', 'collections/todos', 'views/todoList'], (React, Todos, TodoList) ->

    todos = new Todos()

    React.renderComponent(
      <TodoList todos={todos} />
      document.getElementById('todoapp')
    )
