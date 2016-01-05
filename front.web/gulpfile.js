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


gulp.task('default', ['html', 'js', 'css', 'images'], function() {
    //...
});


gulp.task('html', function() {
    var index = gulp.src('index.html')
                .pipe(watch('index.html'))
                .pipe(gulp.dest('build/'))
                .pipe(print());
    
    var templates = gulp.src('templates/**/*.html')
                    .pipe(watch('templates/**/*.html'))
                    .pipe(gulp.dest('build/templates/'))
                    .pipe(print());
                     
    return merge(index, templates);   
})


gulp.task('css', function() {
    return gulp.src('css/**/*.css')
            .pipe(watch('css/**/*.css'))
            .pipe(gulp.dest('build/css/'))
            .pipe(print());
})

gulp.task('images', function() {
    return gulp.src('images/**/*.*')
            .pipe(watch('images/**/*.*'))
            .pipe(gulp.dest('build/images/'))
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
                
    var w = watchify(b, { cacheFile: cacheFilePath });
                
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
                .pipe(print());
    }

    w.on('update', rebundle);

    w.on('log', gutil.log);

    return rebundle().pipe(print());	
})