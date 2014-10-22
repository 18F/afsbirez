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
      'app/static/lib/angular/angular.js',
      'app/static/lib/angular-mocks/angular-mocks.js',
      'app/static/lib/angular-resource/angular-resource.js',
      'app/static/lib/angular-cookies/angular-cookies.js',
      'app/static/lib/angular-sanitize/angular-sanitize.js',
      'app/static/lib/angular-route/angular-route.js',
      'app/static/lib/angular-schema-form/dist/schema-form.min.js',
      'app/static/lib/ng-file-upload/angular-file-upload.js',
      'app/static/lib/ngDialog/js/ngDialog.min.js',
      'app/static/lib/angular-ui-router/release/angular-ui-router.js',
      'app/static/js/*.js',
      'app/static/js/**/*.js',
      'test/client/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

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
