// Load Gulp plugin
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
//updated plugin
var cssnano = require('gulp-cssnano');
var babel = require("gulp-babel");
var eslint = require('eslint/lib/cli');
var globby = require('globby');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var webp = require('gulp-webp');
//img optimization
gulp.task('img', function () {
    return gulp.src('./src/images/*')
        //.pipe(webp())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});
//Static Server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Watch HTML File Change
    gulp.watch("*.html").on("change", browserSync.reload);
});

//Sass(Scss) Task (Development Only)
gulp.task('sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
            cascade: false
        }))
        .pipe(csscomb())
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});

//Minify CSS Task (Production Only)
gulp.task('minify:css',function(){
	 gulp.src('./src/css/*.css')
   //remove cssMinify
   .pipe(cssnano())
	 .pipe(gulp.dest('./build/css/'))
   .pipe(browserSync.stream());
	});

// Babel Task (Production)
gulp.task('babel:js',function () {
	gulp.src('./src/js/**/*.js')
	.pipe(babel())
  .pipe(gulp.dest("./build/js"))
  .pipe(browserSync.stream());
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['babel:js'], browserSync.reload);


//Custom eslint without gulp-eslint from
//http://bl.ocks.org/tschaub/b7fed443597b979ceb28
//Running ESLint with Gulp

// run eslint without an additional plugin
gulp.task('lint', function(done) {

  // patterns with the same form as gulp.src(patterns)
  var patterns = ['lib/**/*.{js}'];

  globby(patterns, function(err, paths) {
    if (err) {
      // unexpected failure, include stack
      done(err);
      return;
    }
    // additional CLI options can be added here
    var code = eslint.execute(paths.join(' '));
    if (code) {
      // eslint output already written, wrap up with a short message
      done(new gutil.PluginError('lint', new Error('ESLint error')));
      return;
    }
    done();
  });
});
//Watch Task
gulp.task('watch',function () {
	gulp.watch(['./src/sass/**/*.scss'],['sass']);
	gulp.watch(['./src/css/*.css'],['minify:css']);
  gulp.watch(['./src/js/**/*.js'],['js-watch']);
	gulp.watch(['./src/js/**/*.js'],['lint']);
  gulp.watch(['./src/images/*'],['img']);
});
gulp.task('default',['serve','watch']);
