// Load Gulp plugin
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var csscomb = require('gulp-csscomb');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var babel = require("gulp-babel");
var eslint = require('eslint/lib/cli');
var globby = require('globby');
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
gulp.task('compile:Sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(csscomb())
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.stream());
});

//Minify CSS Task (Production Only)
gulp.task('minify:css',function(){
	 gulp.src('./src/css/*.css')
	 .pipe(minifyCss())
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


//lint and minify JS Task (Development)
gulp.task('eslint',function(){
		return gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
		.pipe(uglify())
		.pipe(gulp.dest('./build/js/*.js'));
	});

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
});
gulp.task('default',['serve','watch']);
