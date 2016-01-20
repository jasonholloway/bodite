module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'], //['Chrome'],
    frameworks: ['browserify', 'mocha'],
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