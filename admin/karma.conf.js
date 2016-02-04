module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'], //['Chrome'],
    frameworks: ['browserify', 'mocha'],
    plugins: [
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-browserify',
      'karma-mocha',
      'karma-ng-html2js-preprocessor'
    ],
    reporters: ['dots'], //mocha'],
    preprocessors: {
      'test/**/*.js': [ 'browserify' ],
      'html/templates/**/*.html': [ 'ng-html2js' ]
    },
    files: [
      'test/**/*.js',
      'html/templates/**/*.html'
    ],
    browserify: {
      debug: true,
      transform: [            
          'debowerify',
          ['babelify', { presets: ['es2015'], ignore: /node_modules|bower_components/ }]
        ]
    },
    ngHtml2JsPreprocessor: {
        moduleName: 'BoditeAdminTemplates',
        stripPrefix: 'html/templates/',
        prependPrefix: '../templates/'
    }
  });
};