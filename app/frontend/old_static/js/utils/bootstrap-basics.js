(function() {
  require(['bootstrap', 'jquery'], function(Bootstrap, $) {
    var hide_flask_message_container;
    $.ajaxSetup({
      cache: false
    });
    $('.dropdown-toggle').dropdown();
    $('a[href="#"]').click(function(e) {
      return e.preventDefault();
    });
    return hide_flask_message_container = function() {
      return $('#flash_message_container').slideUp('fast');
    };
  });

}).call(this);
