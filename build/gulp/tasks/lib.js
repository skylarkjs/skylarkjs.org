var gulp = require('gulp'),
    gutil = require('gulp-util'),
    util = require('../utils');

module.exports = function() {
    return	gulp.src(util.lib + '**//*')
        	.pipe(gulp.dest(util.dest+"/lib"));
};
