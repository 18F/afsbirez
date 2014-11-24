define ['react', 'mixins/interval', 'module'], (React, IntervalMixin, module) ->
  
  TickTock = React.createClass
    mixins: [IntervalMixin]
    getInitialState: -> seconds: 0
    componentDidMount: -> @setInterval(@tick, 1000)
    tick: -> @setState(seconds: @state.seconds+1)
    render: ->
      <p>
        React has been running for {@state.seconds} seconds.
      </p>

  module.exports = TickTock

