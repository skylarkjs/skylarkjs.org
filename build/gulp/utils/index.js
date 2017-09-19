var gutil = require('gulp-util');
var DEV = 1;
var PROD = 2;

var env = ((gutil.env.mode && gutil.env.mode.indexOf('prod') > -1) ? PROD : DEV);

function isDev() {
    return env !== PROD;
}

function isProd() {
    return env === PROD;
}

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
    isProd: isProd,
    isDev: isDev,
    src: '../src/',
    lib: '../lib/',
    dest: '../dist/',
    assetSrc: '../src/assets/',
    assetDest: '../dist/',
    jsDistFolders: ["../dist/", "../src/scripts/"],
    asarScript: './asar/',
    asarDeploy: '../desktop/asar',
    nodeDeploy: '../server/node/public',
    apacheDeploy: '../server/apache',
    slaxDeploy: '../desktop/slax',
    banner: banner,
    pkg: pkg
};
