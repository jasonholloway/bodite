var Promise = require('promise');
var request = require('superagent');
// var util = require('util');

var urlJoin = require('url-join');


//Just an insterface for all api actions

function ApiRequest(baseUrl) {   
    this.baseUrl = baseUrl || '';
    this.token = undefined;
}


ApiRequest.prototype.authorize = function(getCreds) {
    var self = this;
    
    if(self.token) return Promise.resolve(true);
        
    return new Promise(function(done, fail) {
        getCreds()
            .then(function(creds) {                
                if(!creds) return done(false);
                
                var loginUrl = urlJoin(self.baseUrl, 'login');
                                
                request.post(loginUrl)
                        .send(creds)
                        .set('Accept', 'application/json')
                        .set('Content-Type', 'application/json')
                        .end(function(err, res) {                            
                            if(res.status === 401) return done(false);                            
                            if(err) return fail(err);
                            
                            self.token = res.body.token;                                                        
                            done(true);                            
                        });                       
            })
            .catch(fail);        
    });
    
    
    
    
}


ApiRequest.prototype.getKeys = function() {
    //...
}


module.exports = ApiRequest;
