var gulp = require('gulp');
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


gulp.task('default', ['html', 'js', 'css', 'images'], function() {
    //...
});


gulp.task('html', function() {
    gulp.src('./index.html')
    .pipe(gulp.dest('./build/'));
    
    gulp.src('./templates/*.html')
    .pipe(gulp.dest('./build/templates/'));    
})


gulp.task('css', function() {
    gulp.src('./css/*.css')
    .pipe(gulp.dest('./build/css/'));
})

gulp.task('images', function() {
    gulp.src('./images/*.*')
    .pipe(gulp.dest('./build/images/'));
})


gulp.task('js', function() {	
        
    var cacheFilePath = './temp/watchify.cache.json';
        
    var b = browserify({ 
                    entries: ['./js/app.js'], 
                    cache: watchify.getCache(cacheFilePath), 
                    packageCache: {}, 
                    debug: true 
                })
                .transform(bulkify)
                //.transform(babelify)
                //.transform(uglifyify)
                //.transform(function(f) {
                //    return /^bb-/.test(f)    //NOT WORKING!!!!
                //            ? babelify(f, { presets: ['es2015'] })
                //            : new through(function() { });
                //})
                //.transform(function (f, o) {
                //    return /^bb-/.test(f)
                //            ? new through(function() { })
                //            : uglifyify(f, o);
                //})
                .plugin(function (b) {                    
                    b.on('reset', attach);
                    attach();

                    function attach() {
                        b.pipeline.get('debug')
                            .push(through.obj(function (data, enc, cb) {
                                data.sourceFile = path.relative(process.cwd(), data.sourceFile);
                                data.sourceFile = path.join('http:////localhost:9967', data.sourceFile);
                                //data.sourceFile = data.sourceFile.replace(/\\/g, '/');
                                cb(null, data);
                            }));
                    }
                });
                
    var w = watchify(b, { cacheFile: cacheFilePath });
                
    function rebundle() {
        return w.bundle()
                .pipe(exorcist('./build/js/bundle.js.map'))
                .pipe(source('bundle.js'))
                .pipe(gulp.dest('./build/js'))
                .on('end', function() {
                   w.write(); 
                });
    }

    w.on('update', rebundle);

    w.on('log', gutil.log);

    return rebundle().pipe(print());	
})