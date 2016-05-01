'use strict';

var gulp = require('gulp');
var pk = require('./package.json');

var DIR_SRC = './src'
var DIR_DIST = './dist'

gulp.task('sw', function(callback) {
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
      './index.html',
      DIR_DIST + '/css/**/*.css',
      DIR_DIST + '/js/**/*.js'
    ],
    verbose: true
  }

  swPrecache.write(path.join('./', 'sw.js'), config, callback);
});
