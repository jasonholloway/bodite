module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'], //['Chrome'],
    frameworks: ['browserify', 'jasmine'],
    preprocessors: {
      'spec/**/*.js': [ 'browserify' ]
    },
    files: [
      'spec/**/*.js'
    ],
    browserify: {
      debug: true,
      transform: [ 'debowerify' ]
    }
  });
};