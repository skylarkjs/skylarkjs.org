'use strict';

var util = require('../utils');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var src = [util.assetSrc + 'stylesheets/sass/**/*.scss'];
gutil.log('The env is : ', gutil.colors.magenta((util.isProd()) ? '"prod"' : '"dev"'));

module.exports = function() {

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(sass(util.isProd() ? {
            outputStyle: 'compressed'
        } : {}).on('error', sass.logError))
        .pipe(util.isProd() ? rename("main.min.css") : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(util.assetDest + "assets/stylesheets"));
};
