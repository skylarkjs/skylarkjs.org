'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    shell = require('gulp-shell'),
    util = require('../utils'),
    del = require('del');

module.exports = function() {
    del.sync([util.electronPath + '/skylarkjs-website.asar'], {
        force: true
    });
    return gulp.src(util.electronPath + "/package.json")
        .pipe(shell(['cd <%= versionPath(file.path) %>; asar pack electron skylarkjs-website.asar'], {
            templateData: {
                versionPath: function(path) {
                    var matcher = path.match(/(.*)\/electron\/package.json$/);
                    return matcher[1];
                }
            }
        }));
};
