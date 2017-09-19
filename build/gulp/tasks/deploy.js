'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    shell = require('gulp-shell'),
    util = require('../utils'),
    del = require('del');


module.exports = function() {
    del.sync([util.nodeDeploy + '/**/*', '!' + util.nodeDeploy + "/"], {
        force: true
    });

    del.sync([util.apacheDeploy + '/**/*', '!' + util.apacheDeploy + "/"], {
        force: true
    });

    gulp.src(util.dest + '**/*')
        .pipe(gulp.dest(util.nodeDeploy));
    gulp.src(util.dest + '**/*')
        .pipe(gulp.dest(util.apacheDeploy));

};
