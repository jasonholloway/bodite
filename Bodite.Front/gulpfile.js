var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var debowerify = require('debowerify');
var bulkify = require('bulkify');


var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var minifyCSS = require('gulp-minify-css');
var copy = require('gulp-copy');
var bower = require('gulp-bower');
var sourcemaps = require('gulp-sourcemaps');
var print = require('gulp-print');
var gulpif = require('gulp-if');

var config = {
    
    cssPaths: [
        './bower_components/jquery-ui/themes/smoothness/jquery-ui.css',
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
    return browserify('./Scripts/bb-admin.js', { debug: true })
            .transform(debowerify)
            .transform(bulkify)
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./Content/js'))
            .pipe(print());
});


gulp.task('css', [], function () {
    return gulp.src(config.cssPaths)
                .pipe(gulp.dest('./Content/css'))
                .pipe(print());
});


gulp.task('jquery-ui-img', [], function () {
    return gulp.src('./bower_components/jquery-ui/themes/smoothness/images/*.*')
                .pipe(gulp.dest('./Content/css/images'))
                .pipe(print());
});

gulp.task('img', ['jquery-ui-img'], function () {
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