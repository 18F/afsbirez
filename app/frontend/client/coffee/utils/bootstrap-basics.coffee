require ['bootstrap', 'jquery'], (Bootstrap, $) ->

  # disable ajax cache - big problem with ie
  $.ajaxSetup( cache: false )

  # enable dropdown menus
  $('.dropdown-toggle').dropdown()

  $('a[href="#"]').click (e) ->
    e.preventDefault()

  hide_flask_message_container = () ->
    $('#flash_message_container').slideUp 'fast'

