'use strict';

var util = require('../utils');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

var src = [util.assetSrc + 'stylesheets/sass/**/*.scss'];

module.exports = function() {

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename("main.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(util.assetDest + "assets/stylesheets"));
};
