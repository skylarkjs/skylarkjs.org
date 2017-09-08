var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourceMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    ignore = require('gulp-ignore'),
    onError = require('../utils/handleErrors'),
    util = require('../utils');

gutil.log('The env is : ', gutil.colors.magenta((util.isProd()) ? '"prod"' : '"dev"'));

module.exports = function() {
    gulp.src(util.src + 'assets/**/*')
        .pipe(gulp.dest(util.dest + "assets"));
    gulp.src(util.src + 'index.html')
        .pipe(gulp.dest(util.dest));
    gulp.src(util.src + 'contents/**/*')
        .pipe(gulp.dest(util.dest + "contents"));
    gulp.src(util.src + 'scripts/**/*')
        .pipe(ignore.exclude(["**/*.js"]))
        .pipe(gulp.dest(util.dest + "scripts"));
    return gulp.src(util.src + 'scripts/**/*.js')
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write())
        .pipe(util.isProd() ? uglify({}).on('error', onError) : gutil.noop())
        .pipe(gulp.dest(util.dest + "scripts"));
};

// var gulp = require('gulp'),
//     gutil = require('gulp-util'),
//     util = require('../utils');

// module.exports = function() {
//     return  gulp.src(util.src + '**/*')
//             .pipe(gulp.dest(util.dest));
// };
