define ['react', 'module'], (React, module) ->

  # define a utils package mapping keys to key values
  ESCAPE_KEY = 27
  ENTER_KEY = 13

  TodoItem = React.createClass
    
    getInitialState: ->
      editText: @props.todo.get 'title'

    handleSubmit: ->
      val = @state.editText.trim()
      if val
        @props.onSave val
        @setState editText: val
      else
        @props.onDestroy()
      false

    handleEdit: ->
      enableInput = =>
        node = @refs.editField.getDOMNode()
        node.focus()
        node.setSelectionRange(node.value.length, node.value.length)
      @props.onEdit enableInput
      @setState editText: @props.todo.get('title')

    handleKeyDown: ->
      if event.which == ESCAPE_KEY
        @setState editText: @props.todo.get('title')
        @props.onCancel()
      else if event.which == ENTER_KEY
        @handleSubmit()

    handleChange: ->
      @setState editText: event.target.value

    render: ->
      <li className={React.addons.classSet
        completed: @props.todo.get('completed')
        editing: @props.editing
      }>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={@props.todo.get('completed')}
            onChange={@props.onToggle}
          />
          <label onDoubleClick={@handleEdit}>
            {@props.todo.get('title')}
          </label>
          <button className="destroy" onClick={@props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={@state.editText}
          onBlur={@handleSubmit}
          onChange={@handleChange}
          onKeyDown={@handleKeyDown}
        />
      </li>


