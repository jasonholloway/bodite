module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
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