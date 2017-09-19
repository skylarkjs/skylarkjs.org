'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    util = require('../utils'),
    del = require('del'),
    gasar = require('gulp-asar');


module.exports = function() {
    gulp.src([util.dest + '**/*',util.asarScript + '**/*'])
      .pipe(gasar(util.pkg.name +'.asar'))
      .pipe(gulp.dest(util.asarDeploy));

};
