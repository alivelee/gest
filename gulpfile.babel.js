'use strict';

import path from 'path';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('lint', () =>
  gulp.src(['app/scripts/**/*.js','!node_modules/**'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.if(!browserSync.active, plugins.eslint.failAfterError()))
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
      .pipe(plugins.newer('app/dist/styles'))
  		.pipe(plugins.sourcemaps.init())
  		.pipe(plugins.sass({
     		precision: 10
    	}).on('error', plugins.sass.logError))
    	.pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(plugins.if('*.css',plugins.cssnano()))
    	.pipe(plugins.sourcemaps.write('./'))
    	.pipe(gulp.dest('app/dist/styles'));
});

gulp.task('scripts', () => 
  gulp.src([
    './app/src/scripts/main.js'
    //other files
    ])
      .pipe(plugins.newer('app/dist'))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel())
      .pipe(plugins.sourcemaps.write())
      .pipe(plugins.concat('main.min.js'))
      .pipe(plugins.uglify({preserveComments: 'some'}))
      .pipe(plugins.size({title:'scripts'}))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('app/dist/scripts'))
);
gulp.task('serve',['styles','scripts'], () => {
	browserSync({
		notify: false,
		server:'app',
		port:4000
	});
	gulp.watch(['app/**/*.html'],reload);
	gulp.watch(['app/src/styles/**/*.{scss,css}'],['styles',reload]);
  gulp.watch(['app/src/scripts/**/*.js'],['lint','scripts',reload])
});