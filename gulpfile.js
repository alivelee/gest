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

//Sass(Scss) Task (Development Only)
gulp.task('compile:Sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(csscomb())
        .pipe(gulp.dest('./src/css'));
});

//Minify CSS Task (Production Only)
gulp.task('minify:css',function(){
	 gulp.src('./src/css/*.css')
			   .pipe(minifyCss())
			   .pipe(gulp.dest('./build/css/'))
	});

// Babel Task (Production)
gulp.task('babel:js',function () {
	gulp.src('./src/js/**/*.js')
	.pipe(babel())
  .pipe(gulp.dest("dist"));
});



//lint and minify JS Task (Development)
gulp.task('eslint',function(){
		return gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
		.pipe(uglify())
		.pipe(gulp.dest('./build/js/*.js'));
	});

//Watch Task
gulp.task('watch',['compile:css','minify:css','eslint'],function () {
	//Static Server
	browserSync.init({
        server: "./"
    });
	//Watch HTML File Change
	gulp.watch("app/*.html").on('change', browserSync.reload);
	gulp.watch(['./src/sass/**/*.scss'],['compile:Sass']);
	gulp.watch(['./src/css/*.css'],['minify:css']);
	gulp.watch(['./src/js/**/*.js'],['eslint']);
});
gulp.task('default',['connect','watch']);
