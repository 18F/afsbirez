(function() {
  define(['react', 'mixins/interval', 'module'], function(React, IntervalMixin, module) {
    var TickTock;
    TickTock = React.createClass({
      mixins: [IntervalMixin],
      getInitialState: function() {
        return {
          seconds: 0
        };
      },
      componentDidMount: function() {
        return this.setInterval(this.tick, 1000);
      },
      tick: function() {
        return this.setState({
          seconds: this.state.seconds + 1
        });
      },
      render: function() {
        return React.DOM.p(null, "React has been running for ", this.state.seconds, " seconds.");
      }
    });
    return module.exports = TickTock;
  });

}).call(this);
