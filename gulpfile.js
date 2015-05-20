// Load Gulp plugin
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');
var csscomb = require('gulp-csscomb');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var minifyCss = require('gulp-minify-css');
//Connect Task
gulp.task('connect',function(){
	connect.server({
		root:'src',
		livereload:true
	});
});

//Sass(Scss) Task 
gulp.task('compile:css', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(csscomb())
        .pipe(connect.reload())
        .pipe(gulp.dest('./src/css'));
});

//Minify CSS Task
gulp.task('minify:css',function(){
	 gulp.src('./src/css/*.css')
			   .pipe(minifyCss())
			   .pipe(gulp.dest('./build/css/'))
	});
 //Eslint Task
gulp.task('eslint',function(){
		return gulp.src(['./src/js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
		.pipe(connect.reload())
		.pipe(uglify())
		.pipe(gulp.dest('./build/js/*.js'));
	});

//Html Task
gulp.task('html',function(){
	gulp.src('src/index.html')
		.pipe(connect.reload());
	});

//Watch Task
gulp.task('watch',['compile:css','minify:css'],function () {
	gulp.watch(['./src/sass/**/*.scss'],['compile:css']);
	gulp.watch(['./src/css/*.css'],['minify:css']);
	gulp.watch(['./src/js/**/*.js'],['eslint']);
	gulp.watch(['./src/index.html'],['html']);
}
);
gulp.task('default',['connect','watch']);