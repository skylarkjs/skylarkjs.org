var gulp = require('gulp'),
    path = require('path'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload'),
    util = require('../utils');

module.exports = function() {
    livereload.listen({
        port: 35769,
        start: true
    });
    gutil.log('The env is : ', gutil.colors.magenta((util.isProd()) ? '"prod"' : '"dev"'));
    gulp.watch(util.src + "**/*", ['runSequence']);
};
