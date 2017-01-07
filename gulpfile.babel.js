'use strict';

import path from 'path';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('lint', () =>
  gulp.src(['app/scripts/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
);

gulp.task('styles',() => {
	const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];
  return gulp.src([
  		'app/src/styles/**/*.scss',
  		'app/src/styles/**/*.css'
  	])
  		.pipe(plugins.sourcemaps.init())
  		.pipe(plugins.sass({
     		precision: 10
    	}).on('error', plugins.sass.logError))
    	.pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
    	.pipe(plugins.sourcemaps.write('./'))
    	.pipe(gulp.dest('app/dist/styles'));
});

gulp.task('serve',['styles'], () => {
	browserSync({
		notify: false,
		server:'app',
		port:4000
	});
	gulp.watch(['app/**/*.html'],reload);
	gulp.watch(['app/src/styles/**/*.{scss,css}'],['styles',reload]);
});