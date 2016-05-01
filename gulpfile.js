'use strict';

var gulp = require('gulp');
var sync    = require( 'browser-sync' );
var watch   = require('gulp-watch');
var plumber = require('gulp-plumber');
var pk = require('./package.json');

var DIR_SRC = './src'
var DIR_DIST = './dist'

gulp.task('build-slim', function() {
  var slim = require("gulp-slim");

  return gulp.src(DIR_SRC + '/**/*.slim')
    .pipe(plumber())
    .pipe(slim())
    .pipe(gulp.dest(DIR_DIST));
});

gulp.task('build-scss', function() {
  var sass = require('gulp-sass');
  var pleeease = require('gulp-pleeease');

  return gulp.src(DIR_SRC + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(pleeease({
      autoprefixer: {
        browsers: ['last 2 versions', 'Android 4.0']
      }
    }))
    .pipe(gulp.dest(DIR_DIST + '/css'));
});

gulp.task( 'build-js', function() {
  var browserify = require('browserify');
  var babelify   = require('babelify');
  var watchify   = require('watchify');
  var source     = require('vinyl-source-stream');
  var buffer     = require('vinyl-buffer');
  var uglify     = require('gulp-uglify');

  return browserify({
    cache: {},
    packageCache: {},
    plugin: [watchify],
    entries : [DIR_SRC + '/js/index.js'],
    debug   : true
  })
  .transform(babelify)
  .bundle()
  .on('error', function(err) {
    console.error('Error : ' + err.message);
    this.emit('end');
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(DIR_DIST + '/js'));
});

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var config = {
    cacheId: pk.name,
    runtimeCaching: [{
      urlPattern: /^https:\/\/hn\.algolia\.com\/api/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 2,
          name: 'hn-list-cache'
        }
      }
    }],
    staticFileGlobs: [
      DIR_DIST + '/**/*.html',
      DIR_DIST + '/css/**/*.css',
      DIR_DIST + '/js/**/*.js'
    ],
    stripPrefix: DIR_DIST + '/',
    verbose: true
  }

  swPrecache.write(path.join(DIR_DIST, 'sw.js'), config, callback);
});

gulp.task('sync', function() {
  return sync.init( null, {
    server : {
      baseDir : DIR_DIST
    },
    open: false
  });
});

gulp.task( 'reload', function() {
  return sync.reload();
});

gulp.task('watch', ['build-js'], function() {
  watch(DIR_SRC + '/**/*.slim', function() {
    gulp.start('build-slim');
  });
  watch(DIR_SRC + '/scss/**/*.scss', function() {
    gulp.start('build-scss');
  });
  watch(DIR_SRC + '/js/**/*.js', function() {
    gulp.start('build-js');
  });
  watch(DIR_DIST + '/**', function() {
    gulp.start( 'reload' );
  });
});

gulp.task('default', [ 'sync', 'watch' ]);
