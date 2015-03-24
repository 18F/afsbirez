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
      'sbirez/static/lib/angular/angular.js',
      'sbirez/static/lib/angular-mocks/angular-mocks.js',
      'sbirez/static/lib/angular-resource/angular-resource.js',
      'sbirez/static/lib/angular-aria/angular-aria.js',
      'sbirez/static/lib/angular-cookies/angular-cookies.js',
      'sbirez/static/lib/angular-sanitize/angular-sanitize.js',
      'sbirez/static/lib/angular-route/angular-route.js',
      'sbirez/static/lib/ng-file-upload/angular-file-upload.js',
      'sbirez/static/lib/ngDialog/js/ngDialog.min.js',
      'sbirez/static/lib/angular-ui-router/release/angular-ui-router.js',
      'sbirez/static/lib/angular-order-object-by/src/ng-order-object-by.js',
      'sbirez/static/lib/marked/lib/marked.js',
      'sbirez/static/lib/angular-marked/angular-marked.js',
      'sbirez/static/js/*.js',
      'sbirez/static/js/**/*.js',
      'tests/client/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: ['sbirez/static/js/vendor/*.js'],

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
