var gulp = require('gulp');
var watch = require('gulp-watch');
var merge = require('merge2');
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
var connect = require('gulp-connect');
var through = require('through2');
var del = require('del');
var runSequence = require('run-sequence');
var karma = require('karma');


var devMode = false;

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

};




gulp.task('clean', function(cb) {
   del.sync('build');
   cb();
});



gulp.task('bits', function () {
    return merge(
        gulp.src([
            './bower_components/bootstrap/dist/css/bootstrap.css',
            './bower_components/fancytree/dist/skin-xp/*.gif',
            './bower_components/fancytree/dist/skin-xp/ui.fancytree.css',
            './bower_components/fancytree/dist/skin-xp/*.gif',
            './bower_components/croppic/assets/css/croppics.css'
        ])
        .pipe(gulp.dest('build/css/'))
    );
})



gulp.task('js', [], function () {

    var cacheFilePath = 'tmp/watchify.cache.json';

    var b = browserify({
        entries: ['js/app.js'].concat(devMode ? ['js_dev/dev.js'] : []),
        cache: watchify.getCache(cacheFilePath),
        packageCache: {},
        debug: true
    })
    .transform(debowerify)
    .transform(bulkify);

    var w = devMode 
            ? watchify(b, { cacheFile: cacheFilePath }) 
            : b;

    function rebundle() {
        return w.bundle()
                .on('error', function (err) {
                    gutil.log(err.message);
                })
                .on('end', function () {
                    if(devMode) w.write();
                })
                .pipe(mold.transform(function (src, write) {
                    if(src.sourcemap) {
                        delete src.sourcemap.sourcemap.sourcesContent;
                        src.sourcemap.sourcemap.sourceRoot = 'http://localhost:9991/';
                        src.sourcemap.sourcemap.file = 'bundle.js';                        
                        write(src.toComment());
                    }
                    else {
                        write(null);
                    }
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




gulp.task('server', function() {    
    connect.server({
        root: 'build',
        port: 999,
        debug: true,
        livereload: true
    });
});


gulp.task('server-sourcemaps', function() {
//    connect.server({
//        root: '',
//        port: 9991
//    });
})



gulp.task('test', function(cb) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb).start();
})


gulp.task('tdd', function(cb) {
    new karma.Server({
        configFile: __dirname + '/karma.conf.js',
    }, cb).start();
})





gulp.task('css', [], function () {
    return gulp.src('./css/**/*.css')
                .pipe(devMode ? watch('./css/**/*.css') : through.obj())
                .pipe(gulp.dest('./build/css'))
                .pipe(connect.reload())
                .pipe(print());
});


gulp.task('jquery-ui-img', [], function () {
    return gulp.src('bower_components/jquery-ui/themes/smoothness/images/*.*')
                .pipe(gulp.dest('build/css/images'))
                .pipe(print());
});

gulp.task('img', ['jquery-ui-img'], function () {
    return gulp.src('img/**/*')
                .pipe(devMode ? watch('img/**/*') : through.obj())
                .pipe(gulp.dest('build/img'))
                .pipe(connect.reload())
                .pipe(print());
});




gulp.task('html', [], function() {
   return gulp.src('html/**/*')
                .pipe(devMode ? watch('html/**/*') : through.obj())
                .pipe(gulp.dest('build'))
                .pipe(connect.reload())
                .pipe(print());
});



gulp.task('build', function(cb) {
    return runSequence('clean', ['html', 'js', 'bits', 'css', 'img'], cb);
});


gulp.task('dev', function(cb) {    
    devMode = true;    
    return runSequence(['build', 'server', 'server-sourcemaps'], cb);
});