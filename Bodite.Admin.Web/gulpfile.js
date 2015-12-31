var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('browserify');
var watchify = require('uber-watchify');
var source = require('vinyl-source-stream');
var debowerify = require('debowerify');
var bulkify = require('bulkify');
var exorcist = require('exorcist');
var path = require('path');
var gutil = require('gulp-util');
var shim = require('browserify-shim');
var mold = require('mold-source-map');
var concat = require('gulp-concat');
var print = require('gulp-print');
var webserver = require('gulp-webserver');

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

    var cacheFilePath = 'tmp/watchify.cache.json';

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
                .pipe(mold.transform(function (src, write) {
                    delete src.sourcemap.sourcemap.sourcesContent;
                    src.sourcemap.sourcemap.sourceRoot = 'http://localhost:9991/';
                    src.sourcemap.sourcemap.file = 'bundle.js';
                    
                    write(src.toComment());
                }))
                //.pipe(exorcist('content/js/bundle.js.map'))
                .pipe(source('bundle.js'))
                .pipe(gulp.dest('build/js'))
                .pipe(print());
    }

    w.on('update', rebundle);

    w.on('log', gutil.log);

    return rebundle().pipe(print());
});




gulp.task('webserver', function() {
    return gulp.src('build')
                .pipe(webserver({
                    livereload: false,
                    //open: 'http://localhost:999/',
                    port: 999,
                    https: false
                }));
});


gulp.task('webserver-sourcemaps', function() {
    return gulp.src('')
                .pipe(webserver({
                    port: 9991                   
                }));
})






gulp.task('css', [], function () {
    return gulp.src('./css/**/*.css')
                .pipe(watch('./css/**/*.css'))
                .pipe(gulp.dest('./build/css'))
                .pipe(print());
});


gulp.task('jquery-ui-img', [], function () {
    return gulp.src('bower_components/jquery-ui/themes/smoothness/images/*.*')
                .pipe(gulp.dest('build/css/images'))
                .pipe(print());
});

gulp.task('img', ['jquery-ui-img'], function () {
    return gulp.src('./img/**/*')
                .pipe(watch('./img/**/*'))
                .pipe(gulp.dest('./build/img'))
                .pipe(print());
});


gulp.task('other', [], function () {
    return gulp.src(config.otherPaths)
                .pipe(gulp.dest('build/misc'))
                .pipe(print());
});


gulp.task('html', [], function() {
   return gulp.src('./html/**/*.html')
                .pipe(watch('./html/**/*.html'))
                .pipe(gulp.dest('./build'))
                .pipe(print()); 
});
// 
// gulp.task('html-templates', [], function() {
//    return gulp.src('./html/templates/**/*.html')
//                 .pipe(gulp.dest('build/templates'))
//                 .pipe(print()); 
// });



gulp.task('default', ['html', /*'html-templates',*/ 'js', 'css', 'img', 'other', 'webserver', 'webserver-sourcemaps'], function () {
    //...
});