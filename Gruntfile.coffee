module.exports = (grunt) ->

  grunt.initConfig {

    pkg: grunt.file.readJSON 'package.json'

    # compile coffee source files
    coffee:
      app:
        expand: true
        src: ['**/*.coffee']
        cwd: 'app/frontend/client/coffee'
        dest: 'app/frontend/static/js/'
        ext: '.js'
        options:
          bare: false
          preserve_dirs: true
          base_path: 'app/frontend/client/coffee'

    # compile coffee-react source files
    cjsx:
      app:
        expand: true
        src: ['**/*.cjsx']
        cwd: 'app/frontend/client/coffee'
        dest: 'app/frontend/static/js'
        ext: '.js'
        options:
          base: false
          preserve_dirs: true
          base_path: 'app/frontend/client/coffee'

    # watch for file changes and react
    watch:
      app:
        files: [
          'app/frontend/client/coffee/**/*.coffee',
          'app/frontend/client/coffee/**/*.cjsx',
        ]
        tasks: ['coffee:app', 'cjsx:app']

    # copy bower components to the frontend's static directory
    bowercopy:
      options:
        srcPrefix: 'bower_components'
        destPrefix: 'app/frontend/static/lib/'
      scripts:
        files:
          'angular/angular.js': 'angular/angular.js'
          'angular-mocks/angular-mocks.js': 'angular-mocks/angular-mocks.js'
          'angular-resource/angular-resource.js': 'angular-resource/angular-resource.js'
          'angular-cookies/angular-cookies.js': 'angular-cookies/angular-cookies.js'
          'angular-sanitize/angular-sanitize.js':'angular-sanitize/angular-sanitize.js'
          'angular-route/angular-route.js':'angular-route/angular-route.js'
          'angular-scenario/angular-scenario.js':'angular-scenario/angular-scenario.js'
          'angular-schema-form/dist/schema-form.min.js':'angular-schema-form/dist/schema-form.min.js'
          'ng-file-upload/angular-file-upload.js':'ng-file-upload/angular-file-upload.js'
          'ngDialog/js/ngDialog.min.js':'ngDialog/js/ngDialog.min.js'
          'angular-ui-router/release/angular-ui-router.js':'angular-ui-router/release/angular-ui-router.js'
          'bootstrap/dist/js/bootstrap.js':'bootstrap/dist/js/bootstrap.js'
          'es5-shim/es5-shim.js':'es5-shim/es5-shim.js'
          'jquery/dist/jquery.js':'jquery/dist/jquery.js'
          'json3/lib/json3.js':'json3/lib/json3.js'

      stylesheets:
        files:
          'css/vendor/bootstrap.css': 'bootstrap/dist/css/bootstrap.css'
          'css/vendor/font-awesome.css': 'font-awesome/css/font-awesome.css'
      fonts:
        files:
          'fonts': 'font-awesome/fonts'
      flash:
        files:
          'swf/zeroclipboard.swf': 'zeroclipboard/dist/ZeroClipboard.swf'
  }

  grunt.loadNpmTasks 'grunt-bowercopy'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-coffee-react'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  #DWC -- commenting out the coffee script compilation for now until the AngularJS stuff is ported
  #grunt.registerTask 'default', ['bowercopy', 'coffee', 'cjsx']
  grunt.registerTask 'default', ['bowercopy']
  grunt.registerTask 'develop', ['default, watch:app']

