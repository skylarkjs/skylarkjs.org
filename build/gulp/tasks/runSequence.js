var gulp = require('gulp'),
    gutil = require('gulp-util'),
    runSequence = require('run-sequence');

module.exports = function(callback) {
    return runSequence('clean', 'src', 'lib', 'sass', 'deploy', callback);
};
