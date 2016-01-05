var gulp = require('gulp');
var watch = require('gulp-watch');
var merge = require('gulp-merge');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var bulkify = require('bulkify');
var watchify = require('uber-watchify');
var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var process = require('process');
var print = require('gulp-print');
var exorcist = require('exorcist');
var uglifyify = require('uglifyify');
var mold = require('mold-source-map');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var gulpIf = require('gulp-if');


var devMode = false;



gulp.task('dev', function(cb) {
   devMode = true;
   runSequence(['build', 'devServer'], cb);
});


gulp.task('build', ['html', 'js', 'css', 'images'], function() {
    //...
});


gulp.task('devServer', function() {
    connect.server({
        root: 'build',
        port: 999,
        debug: true,
        livereload: true
    });
});


gulp.task('mapServer', function() {
    //....
});



gulp.task('html', function() {
    var index = gulp.src('index.html')
                .pipe(gulpIf(devMode, watch('index.html')))
                .pipe(gulp.dest('build/'));
    
    var templates = gulp.src('templates/**/*.html')
                    .pipe(gulpIf(devMode, watch('templates/**/*.html')))
                    .pipe(gulp.dest('build/templates/'));
                     
    return merge(index, templates)
            .pipe(print())
            .pipe(connect.reload());   
})


gulp.task('css', function() {
    return gulp.src('css/**/*.css')
            .pipe(gulpIf(devMode, watch('css/**/*.css')))
            .pipe(gulp.dest('build/css/'))
            .pipe(connect.reload())
            .pipe(print());
})

gulp.task('images', function() {
    return gulp.src('images/**/*.*')
            .pipe(gulpIf(devMode, watch('images/**/*.*')))
            .pipe(gulp.dest('build/images/'))
            .pipe(connect.reload())
            .pipe(print());
})


gulp.task('js', function() {	        
    var cacheFilePath = 'temp/watchify.cache.json';
        
    var b = browserify({ 
                    entries: ['js/app.js'], 
                    cache: watchify.getCache(cacheFilePath), 
                    packageCache: {}, 
                    debug: true 
                })
                .transform(bulkify);
                
    var w = devMode
                ? watchify(b, { cacheFile: cacheFilePath })
                : b;
                
    function rebundle() {
        return w.bundle()
                .on('error', function(err) {
                    gutil.log(err.message);
                })
                .on('end', function() {
                   w.write(); 
                })
                .pipe(exorcist('build/js/bundle.js.map', null, 'http://localhost:9967/'))
                .pipe(source('bundle.js'))
                .pipe(gulp.dest('build/js'))
                .pipe(connect.reload())
                .pipe(print());
    }

    w.on('update', rebundle);

    w.on('log', gutil.log);

    return rebundle().pipe(print());	
})