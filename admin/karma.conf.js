module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'], //['Chrome'],
    frameworks: ['browserify', 'mocha'],
    plugins: [
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-browserify',
      'karma-mocha'
    ],
    reporters: ['mocha'],
    preprocessors: {
      'test/**/*.js': [ 'browserify' ]
    },
    files: [
      'test/**/*.js'
    ],
    browserify: {
      debug: true,
      transform: [ 'debowerify' ]
    }
  });
};