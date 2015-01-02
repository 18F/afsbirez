(function() {
  define(['collections/base', 'models/todo', 'module'], function(BaseCollection, Todo, module) {
    var Todos;
    Todos = BaseCollection.extend({
      model: Todo,
      url: '/api/v1/todos',
      completed: function() {
        return this.where({
          completed: true
        });
      },
      remaining: function() {
        return this.where({
          completed: false
        });
      }
    });
    return module.exports = Todos;
  });

}).call(this);
