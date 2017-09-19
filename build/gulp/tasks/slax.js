'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    util = require('../utils'),
    del = require('del'),
    gasar = require('gulp-asar');


module.exports = function() {
//    del.sync([util.asarDeploy + '/**/*', '!' + util.asarDeploy + "/"], {
//        force: true
//    });

    gulp.src(util.dest + '**/*')
      .pipe(gasar(util.pkg.name +'.slax'))
      .pipe(gulp.dest(util.slaxDeploy));
};
