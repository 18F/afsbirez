(function() {
  define(['module'], function(module) {
    var IntervalMixin;
    IntervalMixin = {
      componentWillMount: function() {
        return this.intervals = [];
      },
      setInterval: function() {
        return this.intervals.push(setInterval.apply(null, arguments));
      },
      componentWillUnmount: function() {
        return this.intervals.map(clearInterval);
      }
    };
    return module.exports = IntervalMixin;
  });

}).call(this);
