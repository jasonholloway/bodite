var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var copy = require('gulp-copy');
var bower = require('gulp-bower');
var sourcemaps = require('gulp-sourcemaps');
var print = require('gulp-print');

var config = {
    //JavaScript files that will be combined into a jquery bundle
    scriptPaths: [
        './bower_components/jquery/dist/jquery.js',
        './bower_components/jquery-ui/jquery-ui.js',
        './bower_components/jquery-validation/dist/jquery.validate.js',
        './bower_components/jquery-validation-unobtrusive/jquery.validate.unobtrusive.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-advanced-searchbox/dist/angular-advanced-searchbox.js',
        './bower_components/angular-bootstrap/ui-bootstrap.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js',
        './bower_components/pica/dist/pica.js',
        './bower_components/aws-sdk-js/dist/aws-sdk.js',
        './bower_components/smap/smap-shim.js',
        './bower_components/fancytree/dist/jquery.fancytree.js',
        './bower_components/fancytree/dist/src/jquery.fancytree.dnd.js',
        './bower_components/jquery-contextmenu/contextmenu.js'
    ],


    cssPaths: [
        './bower_components/bootstrap/dist/css/bootstrap.css',
        './bower_components/angular-advanced-searchbox/dist/angular-advanced-searchbox.css',
        './bower_components/croppic/assets/css/croppic.css',
        './bower_components/fancytree/dist/skin-xp/ui.fancytree.css'
    ],


    imgPaths: [
        './bower_components/croppic/assets/img/cropperIcons.png',
        './bower_components/fancytree/dist/skin-xp/*.gif'
    ],


    otherPaths: [
    ]

};

gulp.task('scripts', [], function () {
    return gulp.src(config.scriptPaths)
                .pipe(gulp.dest('./Content/js'))
                .pipe(print());
});


gulp.task('css', [], function () {
    return gulp.src(config.cssPaths)
                .pipe(gulp.dest('./Content/css'))
                .pipe(print());
});

gulp.task('img', [], function () {
    return gulp.src(config.imgPaths)
                .pipe(gulp.dest('./Content/css'))
                .pipe(print());
});


gulp.task('other', [], function () {
    return gulp.src(config.otherPaths)
                .pipe(gulp.dest('./Content/misc'))
                .pipe(print());
});


gulp.task('default', ['scripts', 'css', 'img', 'other'], function () {
    //...
});