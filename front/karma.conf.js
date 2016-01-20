
module.exports = function(config) {
  config.set({
      
    frameworks: ['browserify', 'mocha'],
    
    files: [
      'test/_global.js',
      'test/**/*.js' //[Ss]pec.js'
    ],
    
    preprocessors: {
      'test/*.js' : ['browserify'],      
    },
        
    browserify: {
        debug: true,        
        transform: ['bulkify']
    },
    
    reporters: ['dots'], //progress'], //or 'dots'
    
    port: 18767,

    autoWatch: true,
    
    browsers: ['PhantomJS']
    
  })
}
