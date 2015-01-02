define ['backbone', 'react', 'mixins/backbone', 'views/todoItem', 'module'], (Backbone, React, BackboneMixin, TodoItem, module) ->

  TodoList = React.createClass

    mixins: [BackboneMixin]

    getBackboneCollections: -> [ @props.todos ]

    getInitialState: ->
      editing: null
      nowShowing: 'all'

    componentDidMount: ->
      Router = Backbone.Router.extend
        routes:
          "": "all"
          "active": "active"
          "completed": "completed"
        all: @setState.bind(@, nowShowing: 'all')
        active: @setState.bind(@, nowShowing: 'active')
        completed: @setState.bind(@, nowShowing: 'completed')
      router = new Router()
      Backbone.history.start()
      @props.todos.fetch()

    handleNewTodoKeyDown: (event) ->
      if event.which != 13
        return
      val = @refs.newField.getDOMNode().value.trim()
      if val
        @props.todos.create {
          title: val
          completed: false
        }, {
          wait: true
        }
        @refs.newField.getDOMNode().value = ''
      return false

    toggleAll: ->
      console.log "toggleAll called"

    edit: (todo, callback) ->
      @setState(editing: todo.get('id'), callback)

    save: (todo, text) ->
      if todo.get('title') != text
        todo.save({title: text}, {wait: true})
      @setState editing: null

    destroy: (todo) ->
      todo.destroy()

    cancel: ->
      @setState editing: null

    clearCompleted: ->
      todo.destroy for todo in @props.todos.completed()

    render: ->
      visibleTodos = @props.todos.filter (todo) =>
        switch @state.nowShowing
          when 'active' then return !todo.get('completed')
          when 'completed'then return todo.get('completed')
          else return true

      todoItems = @props.todos.map (todo) =>
        <TodoItem 
          key={todo.get('id')} 
          todo={todo}
          editing={@state.editing == todo.get('id')}
          onToggle={todo.toggle.bind(todo)}
          onDestroy={@destroy.bind(@, todo)}
          onEdit={@edit.bind(@, todo)}
          onSave={@save.bind(@, todo)}
          onCancel={@cancel}
        />

      if @props.todos.length
        main = (
          <section id="main">
            <input
              id="toggle-all"
              type="checkbox"
              onChange={@toggleAll}
            />
            <ul id="todo-list">
              {todoItems}
            </ul>
          </section>
        )
 
      <div>
        <header id="header">
          <h1>todos</h1>
          <input
            ref="newField"
            id="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={@handleNewTodoKeyDown}
            autoFocus={true}
          />
        </header>
        {main}
      </div>

  module.exports = TodoList
