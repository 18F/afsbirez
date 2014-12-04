// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/frontend/static/lib/angular/angular.js',
      'app/frontend/static/lib/angular-mocks/angular-mocks.js',
      'app/frontend/static/lib/angular-resource/angular-resource.js',
      'app/frontend/static/lib/angular-cookies/angular-cookies.js',
      'app/frontend/static/lib/angular-sanitize/angular-sanitize.js',
      'app/frontend/static/lib/angular-route/angular-route.js',
      'app/frontend/static/lib/angular-schema-form/dist/schema-form.min.js',
      'app/frontend/static/lib/ng-file-upload/angular-file-upload.js',
      'app/frontend/static/lib/ngDialog/js/ngDialog.min.js',
      'app/frontend/static/lib/angular-ui-router/release/angular-ui-router.js',
      'app/frontend/static/js/*.js',
      'app/frontend/static/js/**/*.js',
      'tests/client/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: ['app/frontend/static/js/vendor/*.js'],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
