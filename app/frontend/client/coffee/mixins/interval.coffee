define ['module'], (module) ->

  IntervalMixin =
    componentWillMount: ->
      @intervals = []

    setInterval:  ->
      @intervals.push setInterval.apply(null, arguments)

    componentWillUnmount: ->
      @intervals.map clearInterval

  module.exports = IntervalMixin
