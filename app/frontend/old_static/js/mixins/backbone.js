(function() {
  define(['module'], function(module) {
    var BackboneMixin;
    BackboneMixin = {
      componentDidMount: function() {
        var collection, _i, _len, _ref, _results;
        _ref = this.getBackboneCollections();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          collection = _ref[_i];
          _results.push(collection.on('add remove change', this.forceUpdate.bind(this, null)));
        }
        return _results;
      },
      componentWillUnmount: function() {
        var collection, _i, _len, _ref, _results;
        _ref = this.getBackboneCollections();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          collection = _ref[_i];
          _results.push(collection.off(null, null, this));
        }
        return _results;
      }
    };
    return module.exports = BackboneMixin;
  });

}).call(this);
