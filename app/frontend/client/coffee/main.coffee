require.config {
  baseURL: 'static/js'
  paths:
    jquery: 'vendor/jquery'
    underscore: 'vendor/lodash'
    backbone: 'vendor/backbone'
    bootstrap: 'vendor/bootstrap'
    react: 'vendor/react'
  shim:
    backbone:
      deps: ['underscore', 'jquery']
      exports: 'Backbone'
    bootstrap:
      deps: ['jquery']
      exports: 'Bootstrap'
    lodash:
      exports: '_'
    jquery:
      exports: '$'
}

require ['utils/bootstrap-basics']
require ['utils/backbone-ajax-jwt']
