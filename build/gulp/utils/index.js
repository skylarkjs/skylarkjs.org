var gutil = require('gulp-util');


var pkg = require('../../../package.json');
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

module.exports = {
    src: '../src/',
    lib: '../lib/',
    dest: '../dist/',
    assetSrc: '../src/assets/',
    assetDest: '../dist/',
    jsDistFolders: ["../dist/", "../src/scripts/"],
    nodeDeploy: '../server/node/public',
    apacheDeploy: '../server/apache',
    banner: banner,
    pkg: pkg
};
