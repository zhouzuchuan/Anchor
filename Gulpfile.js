
var defaultInfo = {
  develop : 'src/' ,
  produce : 'dest/'
}
var gulp            = require('gulp');
var browserSync     = require('browser-sync').create();
var rename          = require('gulp-rename');
var uglify          = require('gulp-uglify');
var jshint          = require('gulp-jshint');
var header          = require('gulp-header');

var info = '/* git@github.com:zhouzuchuan/Anchor.git */\n';

// js压缩
gulp.task('js' , function () {
  return gulp.src(defaultInfo.develop + '*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(rename({ suffix : '.min'}))
    .pipe(uglify())
    .pipe(header(info))
    .pipe(gulp.dest(defaultInfo.produce));
});

gulp.task('server', function() {
  browserSync.init({ server: { baseDir: defaultInfo.develop } });
  gulp.watch('./').on('change', function () { browserSync.reload(); });
});


