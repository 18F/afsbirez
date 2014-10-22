/* global require */

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var streamqueue = require('streamqueue');


gulp.task('bootstrap', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(
              gulp.src("./src/directives/decorators/bootstrap/*.html")
                  .pipe(minifyHtml({
                      empty: true,
                      spare: true,
                      quotes: true
                  }))
                  .pipe(templateCache({
                      module: "schemaForm",
                      root: "directives/decorators/bootstrap/"
                  }))
    );
    stream.queue(gulp.src('./src/directives/decorators/bootstrap/*.js'));

    stream.done()
          .pipe(concat('bootstrap-decorator.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest("./dist/"));

});

gulp.task('bootstrap-datepicker', function() {
  var stream = streamqueue({ objectMode: true });
  stream.queue(
              gulp.src("./src/directives/decorators/bootstrap/datepicker/*.html")
                  .pipe(minifyHtml({
                      empty: true,
                      spare: true,
                      quotes: true
                  }))
                  .pipe(templateCache({
                      module: "schemaForm",
                      root: "directives/decorators/bootstrap/datepicker/"
                  }))
    );
    stream.queue(gulp.src('./src/directives/decorators/bootstrap/datepicker/*.js'));

    stream.done()
          .pipe(concat('bootstrap-datepicker.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest("./dist/"));

});



gulp.task('minify',function(){
  gulp.src([
    './src/module.js',
    './src/services/*.js',
    './src/directives/*.js'
  ])
  .pipe(concat('schema-form.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist/'));
});


gulp.task('default',['minify','bootstrap','bootstrap-datepicker']);


gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['default']);
});
