var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('uber-watchify');
var source = require('vinyl-source-stream');
var debowerify = require('debowerify');
var bulkify = require('bulkify');
var exorcist = require('exorcist');
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
//var uglifyify = require('uglifyify');
var fs = require('fs');
var shim = require('browserify-shim');

//var mold = require('mold-source-map');
//var sourcemapify = require('sourcemapify');



var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var del = require('del');
//var minifyCSS = require('gulp-minify-css');
//var copy = require('gulp-copy');
//var bower = require('gulp-bower');
//var sourcemaps = require('gulp-sourcemaps');
var print = require('gulp-print');
//var gulpif = require('gulp-if');

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




gulp.task('js', [], function () {

    var cacheFilePath = 'temp/watchify.cache.json';

    var b = browserify({
                entries: ['js/app.js'],
                cache: watchify.getCache(cacheFilePath),
                packageCache: {},
                debug: true
            })
            .transform(debowerify)
            .transform(bulkify);

    var w = watchify(b, { cacheFile: cacheFilePath });

    function rebundle() {
        return w.bundle()
                .on('error', function (err) {
                    gutil.log(err.message);
                })
                .on('end', function () {
                    w.write();
                })
                .pipe(exorcist('content/js/bundle.js.map', null, 'http://localhost:8080/'))
                .pipe(source('bundle.js'))
                .pipe(gulp.dest('content/js'))
                .pipe(print());
    }

    w.on('update', rebundle);

    w.on('log', gutil.log);

    return rebundle().pipe(print());
});













//gulp.task('scripts', [], function () {
//    var b = browserify({ entries: ['./Scripts/bb-admin.js'], cache: {}, packageCache: {}, debug: true })
//                .transform(debowerify)
//                .transform(bulkify)
//                .transform(uglifyify)
//                //.transform(function(f) {
//                //    return /^bb-/.test(f)    //NOT WORKING!!!!
//                //            ? babelify(f, { presets: ['es2015'] })
//                //            : new through(function() { });
//                //})
//                //.transform(function (f, o) {
//                //    return /^bb-/.test(f)
//                //            ? new through(function() { })
//                //            : uglifyify(f, o);
//                //})
//                .plugin(watchify);
//    
//    function rebundle() {
//        return b.bundle()
//                .pipe(exorcist('./Content/js/bundle.js.map'))
//                .pipe(source('bundle.js'))
//                .pipe(gulp.dest('./Content/js'));
//    }
//
//    b.on('update', rebundle);
//
//    b.on('log', gutil.log);
//
//    return rebundle().pipe(print());
//});


gulp.task('css', [], function () {
    return gulp.src(config.cssPaths)
                .pipe(gulp.dest('Content/css'))
                .pipe(print());
});


gulp.task('jquery-ui-img', [], function () {
    return gulp.src('bower_components/jquery-ui/themes/smoothness/images/*.*')
                .pipe(gulp.dest('Content/css/images'))
                .pipe(print());
});

gulp.task('img', ['jquery-ui-img'], function () {
    return gulp.src(config.imgPaths)
                .pipe(gulp.dest('Content/css'))
                .pipe(print());
});


gulp.task('other', [], function () {
    return gulp.src(config.otherPaths)
                .pipe(gulp.dest('Content/misc'))
                .pipe(print());
});


gulp.task('default', ['js', 'css', 'img', 'other'], function () {
    //...
});